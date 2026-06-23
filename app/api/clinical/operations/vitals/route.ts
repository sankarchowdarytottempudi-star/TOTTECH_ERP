import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  BP_VALIDATION_MESSAGE,
  parseBloodPressure,
} from "@/lib/clinical/blood-pressure";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import {
  nullableText,
  recordWorkflowEvent,
  serialize,
  toDecimal,
  toNumber,
} from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      a.*,
      p.patient_uid,
      p.uhid,
      p.phone,
      p.gender,
      p.age_years,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
      d.full_name AS doctor_name,
      v.id AS vitals_id,
      v.blood_pressure,
      v.systolic_bp,
      v.diastolic_bp,
      v.weight,
      v.height,
      v.temperature,
      v.spo2,
      v.pulse,
      v.respiration,
      v.bmi,
      v.notes AS vitals_notes,
      CASE
        WHEN v.id IS NOT NULL THEN 'COMPLETED_VITALS'
        WHEN a.queue_status IN ('WAITING_FOR_DOCTOR','READY_FOR_CONSULTATION') OR a.status IN ('VITALS_COMPLETED','READY_FOR_CONSULTATION') THEN 'READY_FOR_DOCTOR'
        ELSE 'WAITING_FOR_VITALS'
      END AS vitals_queue_bucket
    FROM appointments a
    LEFT JOIN patients p ON p.id = a.patient_id
    LEFT JOIN doctors d ON d.id = a.doctor_id
    LEFT JOIN LATERAL (
      SELECT *
      FROM clinical_vitals cv
      WHERE cv.appointment_id = a.id
        AND COALESCE(cv.is_deleted,false) = false
      ORDER BY cv.created_at DESC, cv.id DESC
      LIMIT 1
    ) v ON true
    WHERE a.tenant_id = $1
      AND a.hospital_id = $2
      AND a.branch_id = $3
      AND a.appointment_date = CURRENT_DATE
      AND COALESCE(a.is_deleted,false) = false
      AND (
        a.status IN ('BOOKED','CHECKED_IN','WAITING_FOR_VITALS','VITALS_COLLECTED','VITALS_COMPLETED','READY_FOR_CONSULTATION')
        OR a.queue_status IN ('WAITING','CHECKED_IN','WAITING_FOR_VITALS','VITALS_COLLECTED','WAITING_FOR_DOCTOR','READY_FOR_CONSULTATION')
      )
    ORDER BY a.created_at ASC, a.id ASC
    LIMIT 200
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
  let appointmentId = toNumber(body.appointment_id);
  const patientId = toNumber(body.patient_id);

  if (!appointmentId && patientId) {
    const appointmentRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id
      FROM appointments
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
        AND (
          appointment_date = CURRENT_DATE
          OR status IN ('BOOKED','CHECKED_IN','WAITING_FOR_VITALS','VITALS_COLLECTED','VITALS_COMPLETED','READY_FOR_CONSULTATION','IN_CONSULTATION')
          OR queue_status IN ('WAITING','CHECKED_IN','WAITING_FOR_VITALS','VITALS_COLLECTED','WAITING_FOR_DOCTOR','READY_FOR_CONSULTATION','IN_CONSULTATION')
        )
      ORDER BY
        CASE WHEN appointment_date = CURRENT_DATE THEN 0 ELSE 1 END,
        appointment_date DESC NULLS LAST,
        created_at DESC,
        id DESC
      LIMIT 1
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );
    appointmentId = toNumber(appointmentRows[0]?.id);
  }

  if (!appointmentId) {
    return NextResponse.json(
      {
        error:
          "Select a patient with an active appointment before saving vitals.",
      },
      { status: 400 }
    );
  }

  const appointmentRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      a.*,
      d.full_name AS doctor_name
    FROM appointments a
    LEFT JOIN doctors d ON d.id = a.doctor_id
    WHERE a.id = $1
      AND a.tenant_id = $2
      AND a.hospital_id = $3
      AND a.branch_id = $4
      AND COALESCE(a.is_deleted,false) = false
    LIMIT 1
    `,
    appointmentId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const appointment = appointmentRows[0];
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }

  const weight = toDecimal(body.weight);
  const height = toDecimal(body.height);
  const bmi = weight && height ? Number((weight / Math.pow(height / 100, 2)).toFixed(2)) : toDecimal(body.bmi);
  const bpInput = nullableText(body.blood_pressure);
  const parsedBp = bpInput ? parseBloodPressure(bpInput) : null;

  if (bpInput && !parsedBp) {
    return NextResponse.json(
      { error: BP_VALIDATION_MESSAGE },
      { status: 400 }
    );
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_vitals (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,appointment_id,blood_pressure,systolic_bp,diastolic_bp,
      weight,height,temperature,spo2,pulse,respiration,bmi,notes,status,
      created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'VITALS_COLLECTED',$18,$18,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    appointment.patient_id,
    appointmentId,
    parsedBp?.bloodPressure || null,
    parsedBp?.systolicBp || null,
    parsedBp?.diastolicBp || null,
    weight,
    height,
    toDecimal(body.temperature),
    toDecimal(body.spo2),
    toDecimal(body.pulse),
    toDecimal(body.respiration),
    bmi,
    nullableText(body.notes),
    context.user.id ?? null
  );

  const ready = body.mark_ready !== false;
  const nextStatus = ready ? "VITALS_COMPLETED" : "VITALS_COLLECTED";
  const nextQueueStatus = ready ? "WAITING_FOR_DOCTOR" : "VITALS_COLLECTED";
  await prisma.$executeRawUnsafe(
    `
    UPDATE appointments
    SET status = $5,
        queue_status = $6,
        updated_by = $7,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,
    appointmentId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    nextStatus,
    nextQueueStatus,
    context.user.id ?? null
  );

  await prisma.$executeRawUnsafe(
    `
    UPDATE medical_records
    SET vitals = $5::jsonb,
        updated_by = $6,
        updated_at = CURRENT_TIMESTAMP
    WHERE appointment_id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    `,
    appointmentId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    JSON.stringify(rows[0]),
    context.user.id ?? null
  );

  await recordWorkflowEvent(context, {
    patientId: Number(appointment.patient_id),
    appointmentId,
    workflowStage: "VITALS",
    status: nextStatus,
    summary: ready
      ? "Vitals captured by nursing and patient moved to doctor queue."
      : "Vitals captured by nursing.",
    sourceTable: "clinical_vitals",
    sourceId: Number(rows[0].id),
    metadata: rows[0],
  });

  await recordClinicalAudit(context, {
    moduleName: "vitals",
    action: "save",
    entityType: "clinical_vitals",
    entityId: Number(rows[0].id),
    summary: "Patient vitals saved",
    payload: rows[0],
  });

  await queueClinicalWorkflowNotification(context, {
    templateKey: "vitals_completed",
    patientId: Number(appointment.patient_id),
    appointmentId,
    sourceModule: "clinical_vitals",
    sourceRecordId: Number(rows[0].id),
    variables: {
      doctor_name:
        nullableText(appointment.doctor_name) ||
        (appointment.doctor_id ? "Assigned Doctor" : "Doctor"),
    },
  });

  return NextResponse.json(
    serialize({
      ...rows[0],
      message: ready
        ? "Vitals saved successfully. Patient moved to Doctor Queue."
        : "Vitals saved successfully.",
      appointment_status: nextStatus,
      queue_status: nextQueueStatus,
    }),
    { status: 201 }
  );
}
