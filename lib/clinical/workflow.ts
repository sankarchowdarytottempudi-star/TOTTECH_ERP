import { prisma } from "@/lib/prisma";
import type { ClinicalContext } from "@/lib/clinical/context";

type JsonRecord = Record<string, unknown>;

export const text = (value: unknown) => String(value || "").trim();

export const nullableText = (value: unknown) => text(value) || null;

export const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const toDecimal = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const serialize = (value: unknown) =>
  JSON.parse(
    JSON.stringify(value, (_, item) =>
      typeof item === "bigint" ? Number(item) : item
    )
  );

export async function recordWorkflowEvent(
  context: ClinicalContext,
  input: {
    patientId?: number | null;
    appointmentId?: number | null;
    workflowStage: string;
    status: string;
    summary: string;
    metadata?: JsonRecord;
    sourceTable?: string;
    sourceId?: number | null;
  }
) {
  await prisma.$executeRawUnsafe(
    `
    INSERT INTO clinical_patient_workflow_events (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      patient_id,
      appointment_id,
      workflow_stage,
      status,
      summary,
      metadata,
      created_by,
      created_at,
      is_deleted
    )
	    VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::int,$7::varchar,$8::varchar,$9::text,$10::jsonb,$11::int,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    input.patientId ?? null,
    input.appointmentId ?? null,
    input.workflowStage,
    input.status,
    input.summary,
    JSON.stringify(input.metadata || {}),
    context.user.id ?? null
  );

  if (input.patientId) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_patient_timeline (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        patient_id,
        event_type,
        event_title,
        event_summary,
        source_table,
        source_id,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
	      VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::varchar,$7::varchar,$8::text,$9::varchar,$10::int,$11::jsonb,$12::int,$12::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      input.patientId,
      input.workflowStage,
      input.status,
      input.summary,
      input.sourceTable || "clinical_patient_workflow_events",
      input.sourceId ?? null,
      JSON.stringify({
        appointment_id: input.appointmentId ?? null,
        ...(input.metadata || {}),
      }),
      context.user.id ?? null
    );
  }
}
