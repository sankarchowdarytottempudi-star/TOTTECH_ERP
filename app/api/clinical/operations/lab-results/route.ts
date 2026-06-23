import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import {
  nullableText,
  recordWorkflowEvent,
  serialize,
  text,
  toNumber,
} from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  const normalized = text(value).toLowerCase();
  if (["true", "yes", "y", "1", "critical"].includes(normalized)) return true;
  return false;
};

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const status = searchParams?.get("status");

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      lo.*,
      p.patient_uid,
      p.uhid,
      p.phone,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
      d.full_name AS doctor_name,
      lr.id AS result_id,
      lr.result_uid,
      lr.result_status,
      lr.result_data,
      lr.interpretation,
      lr.validated_at
    FROM lab_orders lo
    LEFT JOIN patients p ON p.id = lo.patient_id
    LEFT JOIN doctors d ON d.id = lo.doctor_id
    LEFT JOIN LATERAL (
      SELECT *
      FROM lab_results lrx
      WHERE lrx.lab_order_id = lo.id
        AND COALESCE(lrx.is_deleted,false) = false
      ORDER BY lrx.created_at DESC, lrx.id DESC
      LIMIT 1
    ) lr ON true
    WHERE lo.tenant_id = $1
      AND lo.hospital_id = $2
      AND lo.branch_id = $3
      AND COALESCE(lo.is_deleted,false) = false
      AND ($4::text IS NULL OR lo.status = $4)
    ORDER BY lo.ordered_at DESC, lo.id DESC
    LIMIT 250
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    status || null
  );

  return NextResponse.json(serialize({ rows }));
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json();
  const orderId = toNumber(body.lab_order_id);
  const action = text(body.action);

  if (!orderId) {
    return NextResponse.json({ error: "Lab order is required." }, { status: 400 });
  }

  const orderRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM lab_orders
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,
    orderId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const order = orderRows[0];
  if (!order) {
    return NextResponse.json({ error: "Lab order not found." }, { status: 404 });
  }

  if (action === "SAMPLE_COLLECTED" || action === "COLLECTED") {
    const updated = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE lab_orders
      SET status = 'SAMPLE_COLLECTED',
          notes = COALESCE($5, notes),
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,
      orderId,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      nullableText(body.remarks),
      context.user.id ?? null
    );

    await recordWorkflowEvent(context, {
      patientId: Number(order.patient_id),
      appointmentId: toNumber(order.appointment_id),
      workflowStage: "LAB",
      status: "SAMPLE_COLLECTED",
      summary: `Sample collected / scan completed for ${order.order_type || "lab order"}.`,
      sourceTable: "lab_orders",
      sourceId: orderId,
      metadata: updated[0],
    });

    await recordClinicalAudit(context, {
      moduleName: "lab_results",
      action: "sample_collected",
      entityType: "lab_orders",
      entityId: orderId,
      summary: "Lab sample collected",
      payload: updated[0],
    });

    return NextResponse.json(serialize(updated[0]));
  }

  if (action === "PROCESSING") {
    const updated = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE lab_orders
      SET status = 'PROCESSING',
          notes = COALESCE($5, notes),
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,
      orderId,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      nullableText(body.remarks),
      context.user.id ?? null
    );

    await recordWorkflowEvent(context, {
      patientId: Number(order.patient_id),
      appointmentId: toNumber(order.appointment_id),
      workflowStage: "LAB",
      status: "PROCESSING",
      summary: `Lab processing started for ${order.order_type || "test"}.`,
      sourceTable: "lab_orders",
      sourceId: orderId,
      metadata: updated[0],
    });

    await recordClinicalAudit(context, {
      moduleName: "lab_results",
      action: "processing",
      entityType: "lab_orders",
      entityId: orderId,
      summary: "Lab processing started",
      payload: updated[0],
    });

    return NextResponse.json(serialize(updated[0]));
  }

  const latestResultRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM lab_results
    WHERE lab_order_id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    ORDER BY id DESC
    LIMIT 1
    `,
    orderId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const latestResult = latestResultRows[0];

  if (action === "VALIDATE" || action === "VALIDATED") {
    if (!latestResult) {
      return NextResponse.json({ error: "Enter a lab result before validation." }, { status: 400 });
    }

    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE lab_results
      SET result_status = 'VALIDATED',
          status = 'VALIDATED',
          validated_by = $5,
          validated_at = CURRENT_TIMESTAMP,
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,
      latestResult.id,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.user.id ?? null
    );

    await prisma.$executeRawUnsafe(
      `
      UPDATE lab_orders
      SET status = 'VALIDATED',
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,
      orderId,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.user.id ?? null
    );

    await recordWorkflowEvent(context, {
      patientId: Number(order.patient_id),
      appointmentId: toNumber(order.appointment_id),
      workflowStage: "LAB",
      status: "VALIDATED",
      summary: `Lab result validated for ${order.order_type || "test"}.`,
      sourceTable: "lab_results",
      sourceId: Number(rows[0].id),
      metadata: rows[0],
    });

    await recordClinicalAudit(context, {
      moduleName: "lab_results",
      action: "validate",
      entityType: "lab_results",
      entityId: Number(rows[0].id),
      summary: "Lab result validated",
      payload: rows[0],
    });

    await queueClinicalWorkflowNotification(context, {
      templateKey: "lab_report_ready",
      patientId: Number(order.patient_id),
      appointmentId: toNumber(order.appointment_id),
      sourceModule: "lab_results",
      sourceRecordId: Number(rows[0].id),
      variables: {
        lab_tests: order.order_type || "Lab test",
      },
    });

    return NextResponse.json(serialize(rows[0]));
  }

  if (action === "APPROVE" || action === "APPROVED") {
    if (!latestResult) {
      return NextResponse.json({ error: "Enter and validate a lab result before approval." }, { status: 400 });
    }

    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE lab_results
      SET result_status = 'APPROVED',
          status = 'APPROVED',
          validated_by = COALESCE(validated_by, $5),
          validated_at = COALESCE(validated_at, CURRENT_TIMESTAMP),
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,
      latestResult.id,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.user.id ?? null
    );

    await prisma.$executeRawUnsafe(
      `
      UPDATE lab_orders
      SET status = 'APPROVED',
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,
      orderId,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.user.id ?? null
    );

    await recordWorkflowEvent(context, {
      patientId: Number(order.patient_id),
      appointmentId: toNumber(order.appointment_id),
      workflowStage: "LAB",
      status: "APPROVED",
      summary: `Lab result approved for ${order.order_type || "test"}.`,
      sourceTable: "lab_results",
      sourceId: Number(rows[0].id),
      metadata: rows[0],
    });

    await recordClinicalAudit(context, {
      moduleName: "lab_results",
      action: "approve",
      entityType: "lab_results",
      entityId: Number(rows[0].id),
      summary: "Lab result approved",
      payload: rows[0],
    });

    return NextResponse.json(serialize(rows[0]));
  }

  if (action === "RELEASE" || action === "RESULT_READY") {
    if (!latestResult) {
      return NextResponse.json({ error: "Enter and approve a lab result before release." }, { status: 400 });
    }

    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE lab_results
      SET result_status = 'RELEASED',
          status = 'RELEASED',
          validated_by = COALESCE(validated_by, $5),
          validated_at = COALESCE(validated_at, CURRENT_TIMESTAMP),
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,
      latestResult.id,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.user.id ?? null
    );

    await prisma.$executeRawUnsafe(
      `
      UPDATE lab_orders
      SET status = 'RELEASED',
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,
      orderId,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.user.id ?? null
    );

    await prisma.$executeRawUnsafe(
      `
      UPDATE appointments
      SET status = 'LAB_COMPLETED',
          queue_status = 'WAITING_FOR_DOCTOR_REVIEW',
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,
      order.appointment_id,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.user.id ?? null
    );

    await recordWorkflowEvent(context, {
      patientId: Number(order.patient_id),
      appointmentId: toNumber(order.appointment_id),
      workflowStage: "LAB",
      status: "RELEASED",
      summary: `Lab result released for doctor review: ${order.order_type || "test"}.`,
      sourceTable: "lab_results",
      sourceId: Number(rows[0].id),
      metadata: {
        whatsapp_template: "lab_report_ready",
        lab_order_id: orderId,
        result: rows[0],
      },
    });

    await recordClinicalAudit(context, {
      moduleName: "lab_results",
      action: "release",
      entityType: "lab_results",
      entityId: Number(rows[0].id),
      summary: "Lab result released",
      payload: rows[0],
    });

    return NextResponse.json(serialize(rows[0]));
  }

  const resultData = {
    test_name: order.order_type,
    value: text(body.result_value),
    remarks: nullableText(body.remarks),
    attachments: Array.isArray(body.attachments) ? body.attachments : [],
  };

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
      INSERT INTO lab_results (
        tenant_id,hospital_id,branch_id,clinic_id,lab_order_id,patient_id,result_uid,
        result_status,result_data,interpretation,validated_by,validated_at,
        result_value,critical_value,entered_by,entered_at,status,
        created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,'ENTERED',$8::jsonb,$9,NULL,NULL,$10,$11,$12,CURRENT_TIMESTAMP,'ENTERED',$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    orderId,
    order.patient_id,
    `LABR-${Date.now()}`,
    JSON.stringify(resultData),
    nullableText(body.remarks),
    nullableText(body.result_value),
    toBoolean(body.critical_value),
    context.user.id ?? null
  );

  await prisma.$executeRawUnsafe(
    `
    UPDATE lab_orders
    SET status = 'RESULT_ENTERED',
        result_value = $5,
        critical_value = $6,
        updated_by = $7,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,
    orderId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    nullableText(body.result_value),
    toBoolean(body.critical_value),
    context.user.id ?? null
  );

  await recordWorkflowEvent(context, {
    patientId: Number(order.patient_id),
    appointmentId: toNumber(order.appointment_id),
    workflowStage: "LAB",
    status: "RESULT_ENTERED",
    summary: `Lab result entered for ${order.order_type || "test"} and waiting for approval.`,
    sourceTable: "lab_results",
    sourceId: Number(rows[0].id),
    metadata: {
      lab_order_id: orderId,
      result: rows[0],
    },
  });

  await recordClinicalAudit(context, {
    moduleName: "lab_results",
    action: "create",
    entityType: "lab_results",
    entityId: Number(rows[0].id),
    summary: "Lab result entered",
    payload: rows[0],
  });

  return NextResponse.json(serialize(rows[0]), { status: 201 });
}
