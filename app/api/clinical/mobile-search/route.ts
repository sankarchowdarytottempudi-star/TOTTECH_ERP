import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const normalizeMobile = (value: string) =>
  value.replace(/\D/g, "").slice(-10);

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } =
    new URL(request.url);
  const mobile = normalizeMobile(
    searchParams?.get("mobile") ||
      searchParams?.get("q") ||
      ""
  );

  if (mobile.length < 3) {
    return NextResponse.json({
      mobile,
      patients: [],
      ivfCouples: [],
      message:
        "Enter at least 3 digits to search linked patients.",
    });
  }

  const patients =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        p.id,
        p.patient_uid,
        p.uhid,
        p.abha_id,
        p.first_name,
        p.last_name,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        p.gender,
        COALESCE(p.age_years, EXTRACT(YEAR FROM age(CURRENT_DATE, p.date_of_birth))::int) AS age,
        p.date_of_birth,
        p.phone,
        p.alternate_mobile,
        p.whatsapp_number,
        p.emergency_contact_phone,
        p.emergency_relationship,
        p.blood_group,
        p.insurance_provider,
        latest_appointment.id AS latest_appointment_id,
        latest_appointment.appointment_date AS latest_visit_date,
        latest_appointment.status AS latest_visit_status,
        latest_prescription.prescription_uid AS latest_prescription_uid,
        latest_prescription.pharmacy_status AS latest_prescription_status,
        lab_counts.lab_report_count,
        radiology_counts.radiology_record_count,
        '/clinical-services/patients/' || p.id AS patient_360_href,
        CASE
          WHEN regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $4 THEN 'Primary Mobile'
          WHEN regexp_replace(COALESCE(p.whatsapp_number,''),'\\D','','g') LIKE '%' || $4 THEN 'WhatsApp'
          WHEN regexp_replace(COALESCE(p.alternate_mobile,''),'\\D','','g') LIKE '%' || $4 THEN 'Alternate Mobile'
          WHEN regexp_replace(COALESCE(p.emergency_contact_phone,''),'\\D','','g') LIKE '%' || $4 THEN COALESCE(NULLIF(p.emergency_relationship,''),'Emergency Contact')
          ELSE COALESCE(NULLIF(p.emergency_relationship,''),'Linked Patient')
        END AS relationship
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
          regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $4
          OR regexp_replace(COALESCE(p.whatsapp_number,''),'\\D','','g') LIKE '%' || $4
          OR regexp_replace(COALESCE(p.alternate_mobile,''),'\\D','','g') LIKE '%' || $4
          OR regexp_replace(COALESCE(p.emergency_contact_phone,''),'\\D','','g') LIKE '%' || $4
        )
      ORDER BY p.created_at DESC
      LIMIT 50
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      mobile
    );

  const patientIds = patients
    .map((patient) => Number(patient.id))
    .filter(Boolean);

  const ivfCouples = patientIds.length
    ? await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM ivf_couples
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
          AND (
            female_patient_id = ANY($4::int[])
            OR male_patient_id = ANY($4::int[])
          )
        ORDER BY created_at DESC
        LIMIT 30
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        patientIds
      )
    : [];

  return NextResponse.json({
    mobile,
    patients,
    ivfCouples,
  });
}
