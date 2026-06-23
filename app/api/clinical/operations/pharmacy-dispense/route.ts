import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import { createBillingItemForWorkflow } from "@/lib/clinical/phase4-operational-spine";
import {
  nullableText,
  recordWorkflowEvent,
  serialize,
  text,
  toDecimal,
  toNumber,
} from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const status = searchParams?.get("status") || "PENDING";
  const query = searchParams?.get("q")?.trim() || "";
  const search = query ? `%${query.toLowerCase()}%` : null;
  const digits = query.replace(/\D/g, "");

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      q.*,
      d.full_name AS doctor_name,
      p.patient_uid,
      p.uhid,
      p.phone,
      p.whatsapp_number,
      COALESCE(NULLIF(TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')), ''), q.patient_name) AS registered_patient_name,
      pr.instructions,
      pr.diagnosis,
      pr.follow_up_date,
      pr.medications AS prescription_medications
    FROM pharmacy_prescription_queue q
    LEFT JOIN doctors d ON d.id = q.doctor_id
    LEFT JOIN patients p ON p.id = q.patient_id
    LEFT JOIN prescriptions pr ON pr.id = q.prescription_id
	    WHERE q.tenant_id = $1::int
	      AND q.hospital_id = $2::int
	      AND q.branch_id = $3::int
      AND COALESCE(q.is_deleted,false) = false
	      AND ($4::text = 'ALL' OR q.status = $4::varchar)
      AND (
        $5::text IS NULL
        OR lower(COALESCE(q.patient_name,'')) LIKE $5
        OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $5
        OR lower(COALESCE(p.uhid,'')) LIKE $5
        OR lower(COALESCE(p.patient_uid,'')) LIKE $5
        OR lower(COALESCE(q.prescription_uid,'')) LIKE $5
        OR lower(COALESCE(p.phone,'')) LIKE $5
        OR ($6::text <> '' AND regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $6)
        OR ($6::text <> '' AND regexp_replace(COALESCE(p.whatsapp_number,''),'\\D','','g') LIKE '%' || $6)
        OR ($6::text <> '' AND regexp_replace(COALESCE(q.patient_mobile,''),'\\D','','g') LIKE '%' || $6)
      )
    ORDER BY q.created_at ASC, q.id ASC
    LIMIT 250
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    status,
    search,
    digits
  );

  return NextResponse.json(serialize({ rows }));
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json();
  const queueId = toNumber(body.queue_id);
  const dispenseStatus = text(body.dispense_status) || "DISPENSED";

  if (!queueId) {
    return NextResponse.json({ error: "Prescription queue record is required." }, { status: 400 });
  }

  const queueRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM pharmacy_prescription_queue
    WHERE id = $1::int
      AND tenant_id = $2::int
      AND hospital_id = $3::int
      AND branch_id = $4::int
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,
    queueId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const queue = queueRows[0];
  if (!queue) {
    return NextResponse.json({ error: "Prescription queue record not found." }, { status: 404 });
  }

  const medications = Array.isArray(queue.medications) ? queue.medications as Row[] : [];
  const dispenseItems: Row[] = medications.length
    ? medications
    : [{ name: "Prescription medicines", quantity: body.quantity }];
  let pharmacyAmount = 0;
  const isReturn = dispenseStatus === "RETURNED" || dispenseStatus === "RETURN_REQUESTED";
  for (const item of dispenseItems) {
    const medicineName =
      text(item.name || item.medicine_name) ||
      "Medicine";
    const quantity =
      toDecimal(item.quantity || body.quantity) ??
      0;
    const priceRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT selling_price
      FROM clinical_medicine_master
	      WHERE tenant_id = $1::int
	        AND hospital_id = $2::int
	        AND branch_id = $3::int
	        AND lower(medicine_name) = lower($4::text)
        AND COALESCE(is_deleted,false) = false
      ORDER BY id DESC
      LIMIT 1
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      medicineName
    );
    const unitPrice = toDecimal(item.price || item.selling_price || priceRows[0]?.selling_price) ?? 100;
    pharmacyAmount += quantity > 0 ? quantity * unitPrice : unitPrice;

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_pharmacy_dispenses (
        tenant_id,hospital_id,branch_id,clinic_id,queue_id,prescription_id,patient_id,
        medicine_name,quantity,dispense_status,notes,created_by,updated_by,created_at,updated_at,is_deleted
      )
	      VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::int,$7::int,$8::text,$9::numeric,$10::varchar,$11::text,$12::int,$12::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      queueId,
      queue.prescription_id,
      queue.patient_id,
      medicineName,
      quantity,
      dispenseStatus,
      nullableText(body.notes),
      context.user.id ?? null
    );

    if (isReturn && quantity > 0) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE clinical_medicine_master
	        SET stock_quantity = COALESCE(stock_quantity,0) + $5::numeric,
	            updated_by = $6::int,
            updated_at = CURRENT_TIMESTAMP
	        WHERE tenant_id = $1::int
	          AND hospital_id = $2::int
	          AND branch_id = $3::int
	          AND lower(medicine_name) = lower($4::text)
          AND COALESCE(is_deleted,false) = false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        medicineName,
        quantity,
        context.user.id ?? null
      );
    } else if (finalStatusForStock(dispenseStatus) && quantity > 0) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE clinical_medicine_master
	        SET stock_quantity = GREATEST(COALESCE(stock_quantity,0) - $5::numeric, 0),
	            updated_by = $6::int,
            updated_at = CURRENT_TIMESTAMP
	        WHERE tenant_id = $1::int
	          AND hospital_id = $2::int
	          AND branch_id = $3::int
	          AND lower(medicine_name) = lower($4::text)
          AND COALESCE(is_deleted,false) = false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        medicineName,
        quantity,
        context.user.id ?? null
      );
    }
  }

  const finalQueueStatus =
    isReturn
      ? "RETURNED"
      : dispenseStatus === "OUT_OF_STOCK"
      ? "OUT_OF_STOCK"
      : dispenseStatus === "PARTIAL_DISPENSE"
        ? "PARTIAL_DISPENSE"
        : "COMPLETED";

  let returnRecord: Row | null = null;
  if (isReturn) {
    const returnRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO pharmacy_customer_returns (
        tenant_id,hospital_id,branch_id,clinic_id,return_number,sale_id,patient_id,reason,approval_status,status,
        created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,NULL,$6,$7,'ELIGIBLE','RETURNED',$8,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      `RET-${Date.now()}`,
      queue.patient_id,
      nullableText(body.notes) || "Medicine returned by patient.",
      context.user.id ?? null
    );
    returnRecord = returnRows[0] || null;
  }

  const updated = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE pharmacy_prescription_queue
    SET status = $5::varchar,
        dispensed_at = CASE WHEN $5::text = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE dispensed_at END,
        notes = COALESCE($6::text, notes),
        updated_by = $7::int,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1::int
      AND tenant_id = $2::int
      AND hospital_id = $3::int
      AND branch_id = $4::int
    RETURNING *
    `,
    queueId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    finalQueueStatus,
    nullableText(body.notes),
    context.user.id ?? null
  );

  await prisma.$executeRawUnsafe(
    `
    UPDATE prescriptions
    SET pharmacy_status = $5::varchar,
        updated_by = $6::int,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1::int
      AND tenant_id = $2::int
      AND hospital_id = $3::int
      AND branch_id = $4::int
    `,
    queue.prescription_id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    finalQueueStatus,
    context.user.id ?? null
  );

  await recordWorkflowEvent(context, {
    patientId: Number(queue.patient_id),
    appointmentId: toNumber(queue.appointment_id),
    workflowStage: "PHARMACY",
    status: finalQueueStatus,
    summary: `Pharmacy ${finalQueueStatus.toLowerCase().replaceAll("_", " ")} for prescription ${queue.prescription_uid || queue.prescription_id}.`,
    sourceTable: "pharmacy_prescription_queue",
    sourceId: queueId,
    metadata: updated[0],
  });

  if (isReturn) {
    await recordWorkflowEvent(context, {
      patientId: Number(queue.patient_id),
      appointmentId: toNumber(queue.appointment_id),
      workflowStage: "PHARMACY_RETURN",
      status: "RETURNED",
      summary: `Medicine return captured for prescription ${queue.prescription_uid || queue.prescription_id}. Refund eligibility: ${pharmacyAmount || 0}.`,
      sourceTable: "pharmacy_customer_returns",
      sourceId: returnRecord?.id ? Number(returnRecord.id) : queueId,
      metadata: {
        return_record: returnRecord,
        refund_eligible_amount: pharmacyAmount || 0,
      },
    });
  }

  if (finalQueueStatus === "COMPLETED" || finalQueueStatus === "PARTIAL_DISPENSE") {
    await createBillingItemForWorkflow(context, {
      moduleKey: "pharmacy",
      patientId: Number(queue.patient_id),
      sourceRecordId: queueId,
      description: `Pharmacy medicines for ${queue.prescription_uid || queue.prescription_id}`,
      amount: pharmacyAmount || 100,
    });
  }

  if (finalQueueStatus === "COMPLETED") {
    await queueClinicalWorkflowNotification(context, {
      templateKey: "medicines_dispensed",
      patientId: Number(queue.patient_id),
      appointmentId: toNumber(queue.appointment_id),
      sourceModule: "pharmacy_prescription_queue",
      sourceRecordId: queueId,
      variables: {
        prescription_number: queue.prescription_uid || queue.prescription_id,
        amount: pharmacyAmount || 0,
      },
    });
  }

  await recordClinicalAudit(context, {
    moduleName: "pharmacy_dispense",
    action: "dispense",
    entityType: "pharmacy_prescription_queue",
    entityId: queueId,
    summary: "Pharmacy dispensing status updated",
    payload: updated[0],
  });

  return NextResponse.json(serialize(updated[0]));
}

const finalStatusForStock = (status: string) =>
  status === "DISPENSED" ||
  status === "PARTIAL_DISPENSE";
