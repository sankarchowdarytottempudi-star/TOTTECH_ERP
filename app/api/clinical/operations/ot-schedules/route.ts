import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { nullableText, recordWorkflowEvent, serialize, text, toNumber } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT ot.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name, d.full_name AS doctor_name
    FROM clinical_ot_schedules ot
    LEFT JOIN patients p ON p.id = ot.patient_id
    LEFT JOIN doctors d ON d.id = ot.doctor_id
    WHERE ot.tenant_id = $1 AND ot.hospital_id = $2 AND ot.branch_id = $3
      AND COALESCE(ot.is_deleted,false) = false
    ORDER BY ot.scheduled_date DESC NULLS LAST, ot.scheduled_time DESC NULLS LAST, ot.id DESC
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
  if (!text(body.procedure_name)) {
    return NextResponse.json({ error: "Procedure name is required." }, { status: 400 });
  }
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_ot_schedules (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,doctor_id,appointment_id,ot_number,
      procedure_name,scheduled_date,scheduled_time,status,notes,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::date,$11::time,$12,$13,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    toNumber(body.patient_id),
    toNumber(body.doctor_id),
    toNumber(body.appointment_id),
    nullableText(body.ot_number),
    text(body.procedure_name),
    nullableText(body.scheduled_date),
    nullableText(body.scheduled_time),
    text(body.status) || "PLANNED",
    nullableText(body.notes),
    context.user.id ?? null
  );
  await recordWorkflowEvent(context, {
    patientId: toNumber(body.patient_id),
    appointmentId: toNumber(body.appointment_id),
    workflowStage: "OT",
    status: text(body.status) || "PLANNED",
    summary: `OT ${text(body.status) || "PLANNED"}: ${text(body.procedure_name)}`,
    sourceTable: "clinical_ot_schedules",
    sourceId: Number(rows[0].id),
    metadata: rows[0],
  });
  await recordClinicalAudit(context, {
    moduleName: "ot_management",
    action: "save",
    entityType: "clinical_ot_schedules",
    entityId: Number(rows[0].id),
    summary: "OT schedule saved",
    payload: rows[0],
  });
  return NextResponse.json(serialize(rows[0]), { status: 201 });
}
