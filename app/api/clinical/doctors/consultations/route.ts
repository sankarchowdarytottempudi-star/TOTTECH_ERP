import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } =
    new URL(request.url);
  const view =
    searchParams?.get("view") || "queue";
  const q =
    searchParams?.get("q")?.trim() || "";
  const search = q
    ? `%${q.toLowerCase()}%`
    : null;

  const scope = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];

  if (view === "prescriptions") {
    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          pr.*,
          p.patient_uid,
          p.uhid,
          p.phone,
          COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
          d.full_name AS doctor_name
        FROM prescriptions pr
        LEFT JOIN patients p ON p.id = pr.patient_id
        LEFT JOIN doctors d ON d.id = pr.doctor_id
        WHERE pr.tenant_id = $1
          AND pr.hospital_id = $2
          AND pr.branch_id = $3
          AND COALESCE(pr.is_deleted,false) = false
          AND (
            $4::text IS NULL
            OR lower(COALESCE(pr.prescription_uid,'')) LIKE $4
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.uhid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        ORDER BY pr.created_at DESC, pr.id DESC
        LIMIT 200
        `,
        ...scope,
        search
      );

    return NextResponse.json({
      view,
      rows,
    });
  }

  if (view === "lab-orders") {
    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          lo.*,
          p.patient_uid,
          p.uhid,
          p.phone,
          COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
          d.full_name AS doctor_name
        FROM lab_orders lo
        LEFT JOIN patients p ON p.id = lo.patient_id
        LEFT JOIN doctors d ON d.id = lo.doctor_id
        WHERE lo.tenant_id = $1
          AND lo.hospital_id = $2
          AND lo.branch_id = $3
          AND COALESCE(lo.is_deleted,false) = false
          AND (
            $4::text IS NULL
            OR lower(COALESCE(lo.order_uid,'')) LIKE $4
            OR lower(COALESCE(lo.order_type,'')) LIKE $4
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        ORDER BY lo.ordered_at DESC, lo.id DESC
        LIMIT 200
        `,
        ...scope,
        search
      );

    return NextResponse.json({
      view,
      rows,
    });
  }

  if (view === "radiology-orders") {
    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          ro.*,
          p.patient_uid,
          p.uhid,
          p.phone,
          COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
          d.full_name AS doctor_name
        FROM radiology_orders ro
        LEFT JOIN patients p ON p.id = ro.patient_id
        LEFT JOIN doctors d ON d.id = ro.doctor_id
        WHERE ro.tenant_id = $1
          AND ro.hospital_id = $2
          AND ro.branch_id = $3
          AND COALESCE(ro.is_deleted,false) = false
          AND (
            $4::text IS NULL
            OR lower(COALESCE(ro.order_number,'')) LIKE $4
            OR lower(COALESCE(ro.study_type,'')) LIKE $4
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        ORDER BY ro.created_at DESC, ro.id DESC
        LIMIT 200
        `,
        ...scope,
        search
      );

    return NextResponse.json({
      view,
      rows,
    });
  }

  if (
    view === "clinical-notes" ||
    view === "follow-ups"
  ) {
    const followUpFilter =
      view === "follow-ups"
        ? "AND mr.follow_up_date IS NOT NULL"
        : "";
    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          mr.*,
          p.patient_uid,
          p.uhid,
          p.phone,
          COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
          d.full_name AS doctor_name
        FROM medical_records mr
        LEFT JOIN patients p ON p.id = mr.patient_id
        LEFT JOIN doctors d ON d.id = mr.doctor_id
        WHERE mr.tenant_id = $1
          AND mr.hospital_id = $2
          AND mr.branch_id = $3
          AND COALESCE(mr.is_deleted,false) = false
          ${followUpFilter}
          AND (
            $4::text IS NULL
            OR lower(COALESCE(mr.chief_complaint,'')) LIKE $4
            OR lower(COALESCE(mr.diagnosis,'')) LIKE $4
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        ORDER BY COALESCE(mr.follow_up_date, mr.created_at::date) DESC, mr.id DESC
        LIMIT 200
        `,
        ...scope,
        search
      );

    return NextResponse.json({
      view,
      rows,
    });
  }

  if (view === "patient-history") {
    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          p.*,
          COUNT(DISTINCT a.id)::int AS appointment_count,
          COUNT(DISTINCT mr.id)::int AS consultation_count,
          COUNT(DISTINCT pr.id)::int AS prescription_count,
          COUNT(DISTINCT lo.id)::int AS lab_order_count,
          COUNT(DISTINCT ro.id)::int AS radiology_order_count
        FROM patients p
        LEFT JOIN appointments a ON a.patient_id = p.id AND COALESCE(a.is_deleted,false) = false
        LEFT JOIN medical_records mr ON mr.patient_id = p.id AND COALESCE(mr.is_deleted,false) = false
        LEFT JOIN prescriptions pr ON pr.patient_id = p.id AND COALESCE(pr.is_deleted,false) = false
        LEFT JOIN lab_orders lo ON lo.patient_id = p.id AND COALESCE(lo.is_deleted,false) = false
        LEFT JOIN radiology_orders ro ON ro.patient_id = p.id AND COALESCE(ro.is_deleted,false) = false
        WHERE p.tenant_id = $1
          AND p.hospital_id = $2
          AND p.branch_id = $3
          AND COALESCE(p.is_deleted,false) = false
          AND (
            $4::text IS NULL
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.uhid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.abha_id,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 200
        `,
        ...scope,
        search
      );

    return NextResponse.json({
      view,
      rows,
    });
  }

  const statusFilter =
    view === "active"
      ? "AND a.status = 'IN_CONSULTATION'"
      : view === "completed"
        ? "AND a.status IN ('CHECKED_OUT','COMPLETED','CONSULTATION_COMPLETED')"
        : view === "appointments"
          ? "AND a.appointment_date >= CURRENT_DATE"
        : "AND (a.status IN ('READY_FOR_CONSULTATION','VITALS_COLLECTED','VITALS_COMPLETED','CHECKED_IN','LAB_COMPLETED') OR a.queue_status IN ('WAITING_FOR_DOCTOR','WAITING_FOR_DOCTOR_REVIEW','READY_FOR_CONSULTATION'))";

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        a.*,
        p.patient_uid,
        p.uhid,
        p.phone,
        p.gender,
        p.date_of_birth,
        p.blood_group,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        d.full_name AS doctor_name,
        dep.department_name,
        mr.id AS medical_record_id,
        mr.status AS consultation_status
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      LEFT JOIN departments dep ON dep.id = a.department_id
      LEFT JOIN medical_records mr ON mr.appointment_id = a.id AND COALESCE(mr.is_deleted,false) = false
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND COALESCE(a.is_deleted,false) = false
        ${statusFilter}
        AND (
          $4::text IS NULL
          OR lower(COALESCE(a.appointment_uid,'')) LIKE $4
          OR lower(COALESCE(a.token_number,'')) LIKE $4
          OR lower(COALESCE(p.patient_uid,'')) LIKE $4
          OR lower(COALESCE(p.uhid,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          OR lower(COALESCE(d.full_name,'')) LIKE $4
        )
      ORDER BY
        CASE WHEN a.queue_status IN ('WAITING_FOR_DOCTOR','READY_FOR_CONSULTATION') OR a.status IN ('VITALS_COMPLETED','READY_FOR_CONSULTATION') THEN 0 ELSE 1 END,
        COALESCE(a.updated_at, a.created_at) ASC,
        a.appointment_date ASC,
        a.start_time ASC NULLS LAST,
        a.id ASC
      LIMIT 200
      `,
      ...scope,
      search
    );

  return NextResponse.json({
    view,
    rows,
  });
}

export async function POST(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body = await request.json();
  const appointmentId = toNumber(
    body.appointment_id
  );

  if (!appointmentId) {
    return NextResponse.json(
      {
        error:
          "Appointment id is required to start consultation.",
      },
      { status: 400 }
    );
  }

  const appointments =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM appointments
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      LIMIT 1
      `,
      appointmentId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

  const appointment = appointments[0];

  if (!appointment) {
    return NextResponse.json(
      {
        error: "Appointment not found.",
      },
      { status: 404 }
    );
  }

  let records =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM medical_records
      WHERE appointment_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY id DESC
      LIMIT 1
      `,
      appointmentId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

  if (!records.length) {
    records =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        INSERT INTO medical_records (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          patient_id,
          doctor_id,
          appointment_id,
          record_type,
          chief_complaint,
          status,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'OPD_CONSULTATION',$8,'ACTIVE',$9::jsonb,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        context.clinicId,
        appointment.patient_id,
        appointment.doctor_id,
        appointmentId,
        appointment.reason || null,
        JSON.stringify({
          source:
            "doctor_consultation_start",
          token_number:
            appointment.token_number,
        }),
        context.user.id ?? null
      );
  }

  await prisma.$executeRawUnsafe(
    `
    UPDATE appointments
    SET status = 'IN_CONSULTATION',
        queue_status = 'IN_CONSULTATION',
        updated_by = $5,
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
    context.user.id ?? null
  );

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
    VALUES ($1,$2,$3,$4,$5,'CONSULTATION_STARTED','Consultation started',$6,'medical_records',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    appointment.patient_id,
    `Doctor consultation started for appointment ${appointment.appointment_uid || appointmentId}`,
    records[0].id,
    JSON.stringify({
      appointment_id: appointmentId,
    }),
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName:
      "doctor_consultation",
    action: "start",
    entityType: "medical_record",
    entityId: Number(records[0].id),
    summary:
      "Doctor consultation started",
    payload: {
      appointment_id: appointmentId,
    },
  });

  return NextResponse.json({
    appointment_id: appointmentId,
    medical_record: records[0],
    consultation_url: `/clinical-services/doctors/consultation/${appointmentId}`,
  });
}
