import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } =
    new URL(request.url);
  const q =
    searchParams?.get("q")?.trim() || "";
  const search = q
    ? `%${q.toLowerCase()}%`
    : null;
  const mobileDigits = q.replace(/\D/g, "");

  if (!search && mobileDigits.length < 4) {
    return NextResponse.json({
      query: q,
      results: [],
    });
  }

  const [
    patients,
    appointments,
    consultations,
    prescriptions,
    labOrders,
    radiologyOrders,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        'Patient' AS result_type,
        p.id,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS title,
        CONCAT(
          'UHID ', COALESCE(NULLIF(p.uhid,''), NULLIF(p.patient_uid,''), '-'),
          ' | ', COALESCE(p.phone,'No mobile'),
          ' | ', COALESCE(p.gender,'-'),
          ' | Age ', COALESCE(COALESCE(p.age_years, EXTRACT(YEAR FROM age(CURRENT_DATE, p.date_of_birth))::int)::text, '-'),
          ' | Latest Visit ', COALESCE(latest_appointment.appointment_date::text, 'No visit'),
          ' | Rx ', COALESCE(latest_prescription.prescription_uid, 'No prescription'),
          ' | Lab Reports ', COALESCE(lab_counts.lab_report_count::text, '0')
        ) AS subtitle,
        '/clinical-services/patients/' || p.id AS href,
        p.created_at,
        latest_appointment.id AS latest_appointment_id,
        latest_appointment.status AS latest_visit_status,
        latest_prescription.prescription_uid AS latest_prescription_uid,
        lab_counts.lab_report_count,
        radiology_counts.radiology_record_count
      FROM patients p
      LEFT JOIN LATERAL (
        SELECT a.*
        FROM appointments a
        WHERE a.patient_id = p.id
          AND a.tenant_id = p.tenant_id
          AND a.hospital_id = p.hospital_id
          AND a.branch_id = p.branch_id
          AND COALESCE(a.is_deleted,false) = false
        ORDER BY a.appointment_date DESC NULLS LAST, a.created_at DESC, a.id DESC
        LIMIT 1
      ) latest_appointment ON true
      LEFT JOIN LATERAL (
        SELECT pr.*
        FROM prescriptions pr
        WHERE pr.patient_id = p.id
          AND pr.tenant_id = p.tenant_id
          AND pr.hospital_id = p.hospital_id
          AND pr.branch_id = p.branch_id
          AND COALESCE(pr.is_deleted,false) = false
        ORDER BY pr.created_at DESC, pr.id DESC
        LIMIT 1
      ) latest_prescription ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS lab_report_count
        FROM lab_results lr
        WHERE lr.patient_id = p.id
          AND lr.tenant_id = p.tenant_id
          AND lr.hospital_id = p.hospital_id
          AND lr.branch_id = p.branch_id
          AND COALESCE(lr.is_deleted,false) = false
      ) lab_counts ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS radiology_record_count
        FROM radiology_orders ro
        WHERE ro.patient_id = p.id
          AND ro.tenant_id = p.tenant_id
          AND ro.hospital_id = p.hospital_id
          AND ro.branch_id = p.branch_id
          AND COALESCE(ro.is_deleted,false) = false
      ) radiology_counts ON true
      WHERE p.tenant_id = $1
        AND p.hospital_id = $2
        AND p.branch_id = $3
        AND COALESCE(p.is_deleted,false) = false
        AND (
          lower(COALESCE(p.patient_uid,'')) LIKE $4
          OR lower(COALESCE(p.uhid,'')) LIKE $4
          OR lower(COALESCE(p.abha_id,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        )
      ORDER BY p.created_at DESC
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      search,
      mobileDigits
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        'Appointment' AS result_type,
        a.id,
        COALESCE(a.appointment_uid, a.token_number, 'Appointment') AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(a.status,'')) AS subtitle,
        '/clinical-services/appointments/' || a.id AS href,
        a.created_at
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND COALESCE(a.is_deleted,false) = false
        AND (
          lower(COALESCE(a.appointment_uid,'')) LIKE $4
          OR lower(COALESCE(a.token_number,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          OR lower(COALESCE(d.full_name,'')) LIKE $4
        )
      ORDER BY a.created_at DESC
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      search,
      mobileDigits
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        'Consultation' AS result_type,
        mr.id,
        COALESCE(mr.diagnosis, mr.chief_complaint, 'Clinical Note') AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(d.full_name,'')) AS subtitle,
        '/clinical-services/doctors/consultation/' || mr.appointment_id AS href,
        mr.created_at
      FROM medical_records mr
      LEFT JOIN patients p ON p.id = mr.patient_id
      LEFT JOIN doctors d ON d.id = mr.doctor_id
      WHERE mr.tenant_id = $1
        AND mr.hospital_id = $2
        AND mr.branch_id = $3
        AND COALESCE(mr.is_deleted,false) = false
        AND (
          lower(COALESCE(mr.diagnosis,'')) LIKE $4
          OR lower(COALESCE(mr.chief_complaint,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          OR lower(COALESCE(d.full_name,'')) LIKE $4
        )
      ORDER BY mr.created_at DESC
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      search,
      mobileDigits
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        'Prescription' AS result_type,
        pr.id,
        pr.prescription_uid AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(pr.pharmacy_status,'')) AS subtitle,
        '/clinical-services/doctors/prescriptions?q=' || pr.prescription_uid AS href,
        pr.created_at
      FROM prescriptions pr
      LEFT JOIN patients p ON p.id = pr.patient_id
      WHERE pr.tenant_id = $1
        AND pr.hospital_id = $2
        AND pr.branch_id = $3
        AND COALESCE(pr.is_deleted,false) = false
        AND (
          lower(COALESCE(pr.prescription_uid,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        )
      ORDER BY pr.created_at DESC
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      search,
      mobileDigits
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        'Lab Order' AS result_type,
        lo.id,
        COALESCE(lo.order_uid, lo.order_type, 'Lab Order') AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(lo.status,'')) AS subtitle,
        '/clinical-services/doctors/lab-orders?q=' || COALESCE(lo.order_uid,'') AS href,
        lo.created_at
      FROM lab_orders lo
      LEFT JOIN patients p ON p.id = lo.patient_id
      WHERE lo.tenant_id = $1
        AND lo.hospital_id = $2
        AND lo.branch_id = $3
        AND COALESCE(lo.is_deleted,false) = false
        AND (
          lower(COALESCE(lo.order_uid,'')) LIKE $4
          OR lower(COALESCE(lo.order_type,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        )
      ORDER BY lo.created_at DESC
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      search,
      mobileDigits
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        'Radiology Order' AS result_type,
        ro.id,
        COALESCE(ro.order_number, ro.study_type, 'Radiology Order') AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(ro.order_status,'')) AS subtitle,
        '/clinical-services/doctors/radiology-orders?q=' || COALESCE(ro.order_number,'') AS href,
        ro.created_at
      FROM radiology_orders ro
      LEFT JOIN patients p ON p.id = ro.patient_id
      WHERE ro.tenant_id = $1
        AND ro.hospital_id = $2
        AND ro.branch_id = $3
        AND COALESCE(ro.is_deleted,false) = false
        AND (
          lower(COALESCE(ro.order_number,'')) LIKE $4
          OR lower(COALESCE(ro.study_type,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        )
      ORDER BY ro.created_at DESC
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      search,
      mobileDigits
    ),
  ]);

  return NextResponse.json({
    query: q,
    results: [
      ...patients,
      ...appointments,
      ...consultations,
      ...prescriptions,
      ...labOrders,
      ...radiologyOrders,
    ].sort((a, b) => {
      const aDate = new Date(
        String(a.created_at || 0)
      ).getTime();
      const bDate = new Date(
        String(b.created_at || 0)
      ).getTime();
      return bDate - aDate;
    }),
  });
}
