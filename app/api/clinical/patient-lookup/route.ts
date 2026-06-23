import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const raw = searchParams?.get("q")?.trim() || "";
  const search = raw ? `%${raw.toLowerCase()}%` : null;
  const digits = raw.replace(/\D/g, "");

  if (!search && digits.length < 4) {
    return NextResponse.json({
      query: raw,
      patients: [],
      message: "Search by patient name, mobile number, UHID/MRN, or ABHA.",
    });
  }

  const patients = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      p.id,
      p.patient_uid,
      p.uhid,
      p.abha_id,
      p.first_name,
      p.last_name,
      COALESCE(NULLIF(TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')), ''), p.patient_uid, p.uhid) AS patient_name,
      p.gender,
      COALESCE(p.age_years, EXTRACT(YEAR FROM age(CURRENT_DATE, p.date_of_birth))::int) AS age,
      p.date_of_birth,
      p.phone,
      p.whatsapp_number,
      p.alternate_mobile,
      p.status,
      p.created_at,
      latest_appointment.id AS appointment_id,
      latest_appointment.status AS appointment_status,
      latest_appointment.queue_status,
      latest_appointment.token_number,
      latest_appointment.appointment_date,
      latest_doctor.full_name AS doctor_name,
      latest_prescription.prescription_uid AS latest_prescription_uid,
      latest_prescription.pharmacy_status AS latest_prescription_status,
      latest_lab.lab_test_name AS latest_lab_report,
      latest_lab.result_status AS latest_lab_status,
      latest_lab.released_at AS latest_lab_released_at,
      latest_radiology.study_type AS latest_radiology_study,
      latest_radiology.order_status AS latest_radiology_status,
      lab_counts.lab_report_count,
      radiology_counts.radiology_record_count,
      '/clinical-services/patients/' || p.id AS patient_360_href,
      latest_vitals.id AS vitals_id,
      latest_vitals.blood_pressure,
      latest_vitals.pulse,
      latest_vitals.temperature,
      latest_vitals.spo2,
      latest_vitals.height,
      latest_vitals.weight,
      latest_vitals.bmi
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
    LEFT JOIN doctors latest_doctor ON latest_doctor.id = latest_appointment.doctor_id
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
      SELECT
        lr.*,
        COALESCE(lt.lab_test_name, lo.order_type, lr.result_uid) AS lab_test_name,
        lr.validated_at AS released_at
      FROM lab_results lr
      LEFT JOIN lab_orders lo ON lo.id = lr.lab_order_id
      LEFT JOIN clinical_lab_test_master lt ON lt.id = lo.lab_test_id
      WHERE lr.patient_id = p.id
        AND lr.tenant_id = p.tenant_id
        AND lr.hospital_id = p.hospital_id
        AND lr.branch_id = p.branch_id
        AND COALESCE(lr.is_deleted,false) = false
      ORDER BY lr.created_at DESC, lr.id DESC
      LIMIT 1
    ) latest_lab ON true
    LEFT JOIN LATERAL (
      SELECT ro.*
      FROM radiology_orders ro
      WHERE ro.patient_id = p.id
        AND ro.tenant_id = p.tenant_id
        AND ro.hospital_id = p.hospital_id
        AND ro.branch_id = p.branch_id
        AND COALESCE(ro.is_deleted,false) = false
      ORDER BY ro.created_at DESC, ro.id DESC
      LIMIT 1
    ) latest_radiology ON true
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
    LEFT JOIN LATERAL (
      SELECT cv.*
      FROM clinical_vitals cv
      WHERE cv.patient_id = p.id
        AND cv.tenant_id = p.tenant_id
        AND cv.hospital_id = p.hospital_id
        AND cv.branch_id = p.branch_id
        AND COALESCE(cv.is_deleted,false) = false
      ORDER BY
        CASE WHEN cv.appointment_id = latest_appointment.id THEN 0 ELSE 1 END,
        cv.created_at DESC,
        cv.id DESC
      LIMIT 1
    ) latest_vitals ON true
    WHERE p.tenant_id = $1
      AND p.hospital_id = $2
      AND p.branch_id = $3
      AND COALESCE(p.is_deleted,false) = false
      AND (
        lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        OR lower(COALESCE(p.patient_uid,'')) LIKE $4
        OR lower(COALESCE(p.uhid,'')) LIKE $4
        OR lower(COALESCE(p.abha_id,'')) LIKE $4
        OR lower(COALESCE(p.phone,'')) LIKE $4
        OR lower(COALESCE(p.whatsapp_number,'')) LIKE $4
        OR lower(COALESCE(p.alternate_mobile,'')) LIKE $4
        OR ($5::text <> '' AND regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5)
        OR ($5::text <> '' AND regexp_replace(COALESCE(p.whatsapp_number,''),'\\D','','g') LIKE '%' || $5)
        OR ($5::text <> '' AND regexp_replace(COALESCE(p.alternate_mobile,''),'\\D','','g') LIKE '%' || $5)
      )
    ORDER BY
      CASE
        WHEN lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4 THEN 1
        WHEN $5::text <> '' AND regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5 THEN 2
        WHEN lower(COALESCE(p.uhid,'')) LIKE $4 OR lower(COALESCE(p.patient_uid,'')) LIKE $4 THEN 3
        ELSE 4
      END,
      p.created_at DESC
    LIMIT 50
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    search || "%%",
    digits
  );

  return NextResponse.json({
    query: raw,
    patients,
  });
}
