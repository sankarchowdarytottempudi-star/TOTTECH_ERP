import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import { nullableText, recordWorkflowEvent, serialize, text, toDecimal, toNumber } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT pay.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
    FROM clinical_operational_payments pay
    LEFT JOIN patients p ON p.id = pay.patient_id
    WHERE pay.tenant_id = $1 AND pay.hospital_id = $2 AND pay.branch_id = $3
      AND COALESCE(pay.is_deleted,false) = false
    ORDER BY pay.created_at DESC, pay.id DESC
    LIMIT 250
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  return NextResponse.json(serialize({ rows }));
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json();
  const patientId = toNumber(body.patient_id);
  const appointmentId = toNumber(body.appointment_id);
  const labOrderId = toNumber(body.lab_order_id);
  const paymentType = text(body.payment_type) || "CONSULTATION_FEE";
  if (!patientId) {
    return NextResponse.json({ error: "Patient is required for payment collection." }, { status: 400 });
  }
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_operational_payments (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,appointment_id,payment_type,amount,
      payment_method,reference_number,payment_date,status,notes,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,COALESCE($11::date,CURRENT_DATE),$12,$13,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    patientId,
    appointmentId,
    paymentType,
    toDecimal(body.amount) ?? 0,
    nullableText(body.payment_method),
    nullableText(body.reference_number),
    nullableText(body.payment_date),
    text(body.status) || "PAID",
    nullableText(body.notes),
    context.user.id ?? null
  );

  if (paymentType === "LAB_PAYMENT") {
    await prisma.$executeRawUnsafe(
      `
      UPDATE lab_orders
      SET status = 'BILL_PAID',
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
        AND (
          ($4::int IS NOT NULL AND id = $4::int)
          OR ($4::int IS NULL AND $5::int IS NOT NULL AND appointment_id = $5::int AND patient_id = $7::int AND status IN ('ORDERED','PENDING_PAYMENT'))
        )
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      labOrderId,
      appointmentId,
      context.user.id ?? null,
      patientId
    );
  }

  await recordWorkflowEvent(context, {
    patientId,
    appointmentId,
    workflowStage: "BILLING",
    status: text(body.status) || "PAID",
    summary: `${paymentType} collected: ${toDecimal(body.amount) ?? 0}`,
    sourceTable: "clinical_operational_payments",
    sourceId: Number(rows[0].id),
    metadata: rows[0],
  });

  await recordClinicalAudit(context, {
    moduleName: "front_desk_collections",
    action: "collect",
    entityType: "clinical_operational_payments",
    entityId: Number(rows[0].id),
    summary: "Clinical operational payment collected",
    payload: rows[0],
  });

  await queueClinicalWorkflowNotification(context, {
    templateKey: "payment_received",
    patientId,
    appointmentId,
    sourceModule: "clinical_operational_payments",
    sourceRecordId: Number(rows[0].id),
    variables: {
      amount: toDecimal(body.amount) ?? 0,
      payment_mode: nullableText(body.payment_method) || "Cash",
      receipt_number: rows[0].reference_number || rows[0].id,
    },
  });

  return NextResponse.json(serialize(rows[0]), { status: 201 });
}
