import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const text = (value: unknown) =>
  String(value || "").trim();

const nullableText = (
  value: unknown
) => text(value) || null;

const nullableDate = (value: unknown) =>
  text(value) || null;

const nullableNumber = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? parsed
    : null;
};

export async function GET(
  request: Request
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } =
    new URL(request.url);
  const query =
    searchParams?.get("q")?.trim() ||
    "";
  const search = query
    ? `%${query.toLowerCase()}%`
    : null;

  const patients =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        p.*,
        COUNT(DISTINCT a.id)::int AS appointment_count,
        COUNT(DISTINCT mr.id)::int AS record_count,
        COUNT(DISTINCT ivf.id)::int AS ivf_case_count
      FROM patients p
      LEFT JOIN appointments a ON a.patient_id = p.id AND COALESCE(a.is_deleted,false) = false
      LEFT JOIN medical_records mr ON mr.patient_id = p.id AND COALESCE(mr.is_deleted,false) = false
      LEFT JOIN ivf_cases ivf ON ivf.patient_id = p.id AND COALESCE(ivf.is_deleted,false) = false
      WHERE p.tenant_id = $1
        AND p.hospital_id = $2
        AND p.branch_id = $3
        AND COALESCE(p.is_deleted, false) = false
        AND (
          $4::text IS NULL
          OR lower(p.patient_uid) LIKE $4::text
          OR lower(COALESCE(p.uhid, '')) LIKE $4::text
          OR lower(COALESCE(p.abha_id, '')) LIKE $4::text
          OR lower(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '')) LIKE $4::text
          OR lower(COALESCE(p.phone, '')) LIKE $4::text
          OR lower(COALESCE(p.whatsapp_number, '')) LIKE $4::text
          OR lower(COALESCE(p.email, '')) LIKE $4::text
        )
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 250
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      search
    );

  return NextResponse.json({
    patients,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body =
    await request.json();

  if (!text(body.first_name)) {
    return NextResponse.json(
      {
        error:
          "Patient first name is required.",
      },
      {
        status: 400,
      }
    );
  }

  if (!text(body.last_name)) {
    return NextResponse.json(
      {
        error:
          "Patient last name is required.",
      },
      {
        status: 400,
      }
    );
  }

  if (!text(body.gender)) {
    return NextResponse.json(
      {
        error:
          "Patient gender is required.",
      },
      {
        status: 400,
      }
    );
  }

  if (!text(body.date_of_birth)) {
    return NextResponse.json(
      {
        error:
          "Patient date of birth is required.",
      },
      {
        status: 400,
      }
    );
  }

  const uid = `PAT-${Date.now()}`;
  const uhid =
    text(body.uhid) ||
    `UHID-${Date.now()}`;
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO patients (
        tenant_id,
        clinic_id,
        hospital_id,
        branch_id,
        patient_uid,
        uhid,
        abha_id,
        aadhaar_number,
        passport_number,
        first_name,
        middle_name,
        last_name,
        gender,
        date_of_birth,
        age_years,
        blood_group,
        marital_status,
        nationality,
        religion,
        occupation,
        phone,
        alternate_mobile,
        email,
        whatsapp_number,
        address,
        address_line1,
        address_line2,
        landmark,
        city,
        district,
        state,
        country,
        pincode,
        emergency_contact_name,
        emergency_relationship,
        emergency_contact_phone,
        emergency_address,
        insurance_provider,
        insurance_number,
        policy_validity,
        tpa,
        coverage_amount,
        referral_type,
        referral_code,
        referral_name,
        commission_plan,
        allergies,
        medical_history,
        consent_captured_at,
        qr_payload,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::date,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40::date,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50::jsonb,$51::jsonb,$52,$52,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      context.tenantId,
      context.clinicId,
      context.hospitalId,
      context.branchId,
      uid,
      uhid,
      nullableText(body.abha_id),
      nullableText(body.aadhaar_number),
      nullableText(body.passport_number),
      text(body.first_name),
      nullableText(body.middle_name),
      text(body.last_name),
      text(body.gender),
      text(body.date_of_birth),
      nullableNumber(body.age_years),
      nullableText(body.blood_group),
      nullableText(body.marital_status),
      nullableText(body.nationality),
      nullableText(body.religion),
      nullableText(body.occupation),
      nullableText(body.phone),
      nullableText(body.alternate_mobile),
      nullableText(body.email),
      nullableText(body.whatsapp_number),
      nullableText(body.address),
      nullableText(body.address_line1),
      nullableText(body.address_line2),
      nullableText(body.landmark),
      nullableText(body.city),
      nullableText(body.district),
      nullableText(body.state),
      nullableText(body.country) ||
        "India",
      nullableText(body.pincode),
      nullableText(
        body.emergency_contact_name
      ),
      nullableText(
        body.emergency_relationship
      ),
      nullableText(
        body.emergency_contact_phone
      ),
      nullableText(
        body.emergency_address
      ),
      nullableText(
        body.insurance_provider
      ),
      nullableText(
        body.insurance_number
      ),
      nullableText(
        body.policy_validity
      ),
      nullableText(body.tpa),
      nullableNumber(
        body.coverage_amount
      ),
      nullableText(body.referral_type),
      nullableText(body.referral_code),
      nullableText(body.referral_name),
      nullableText(body.commission_plan),
      nullableText(body.allergies),
      nullableText(
        body.medical_history
      ),
      body.consent_captured_at
        ? new Date(
            body.consent_captured_at
          )
        : null,
      JSON.stringify({
        patient_uid: uid,
        uhid,
        clinic_id:
          context.clinicId,
        hospital_id:
          context.hospitalId,
        branch_id:
          context.branchId,
      }),
      JSON.stringify(
        body.metadata || {}
      ),
      context.user.id ?? null
    );
  const patient = rows[0];

  const isIvfPatient =
    body.ivf_patient === true ||
    text(body.ivf_patient).toLowerCase() === "true" ||
    text(body.ivf_patient).toLowerCase() === "yes" ||
    text(body.patient_type).toUpperCase() === "IVF";

  if (isIvfPatient) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO ivf_cases (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        patient_id,
        case_uid,
        cycle_status,
        notes,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,'ACTIVE','Created from IVF patient registration checkbox',$7::jsonb,$8,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (case_uid) DO NOTHING
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      Number(patient.id),
      `IVFCASE-${Date.now()}`,
      JSON.stringify({
        source: "patient_registration",
        ivf_patient: true,
      }),
      context.user.id ?? null
    );
  }

  await recordClinicalAudit(context, {
    moduleName: "patients",
    action: "create",
    entityType: "patient",
    entityId: Number(patient.id),
    summary:
      "Clinical patient registered",
    payload: {
      patient_uid: uid,
      ivf_patient: isIvfPatient,
    },
  });

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
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,'REGISTRATION','Patient Registered','Patient registration and UHID created','patients',$5,$6,$6,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    Number(patient.id),
    context.user.id ?? null
  );

  await queueClinicalWorkflowNotification(context, {
    templateKey: "patient_registration_success",
    patientId: Number(patient.id),
    sourceModule: "patients",
    sourceRecordId: Number(patient.id),
    variables: {
      registration_date: new Date().toLocaleString("en-IN"),
    },
  });

  return NextResponse.json(
    patient,
    {
      status: 201,
    }
  );
}

export async function PATCH(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body = await request.json();
  const id = Number(body.id || body.patient_id || 0);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Patient id is required." }, { status: 400 });
  }

  const existingRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM patients
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted, false) = false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );

  const existing = existingRows[0];
  if (!existing) {
    return NextResponse.json({ error: "Patient not found." }, { status: 404 });
  }

  const ageYears = text(body.date_of_birth)
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(`${text(body.date_of_birth)}T00:00:00.000Z`).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      )
    : existing.age_years ?? null;

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE patients
    SET first_name = COALESCE($5, first_name),
        middle_name = COALESCE($6, middle_name),
        last_name = COALESCE($7, last_name),
        gender = COALESCE($8, gender),
        date_of_birth = COALESCE($9::date, date_of_birth),
        age_years = $10,
        blood_group = COALESCE($11, blood_group),
        marital_status = COALESCE($12, marital_status),
        nationality = COALESCE($13, nationality),
        religion = COALESCE($14, religion),
        occupation = COALESCE($15, occupation),
        phone = COALESCE($16, phone),
        alternate_mobile = COALESCE($17, alternate_mobile),
        email = COALESCE($18, email),
        whatsapp_number = COALESCE($19, whatsapp_number),
        address = COALESCE($20, address),
        address_line1 = COALESCE($21, address_line1),
        address_line2 = COALESCE($22, address_line2),
        landmark = COALESCE($23, landmark),
        city = COALESCE($24, city),
        district = COALESCE($25, district),
        state = COALESCE($26, state),
        country = COALESCE($27, country),
        pincode = COALESCE($28, pincode),
        emergency_contact_name = COALESCE($29, emergency_contact_name),
        emergency_relationship = COALESCE($30, emergency_relationship),
        emergency_contact_phone = COALESCE($31, emergency_contact_phone),
        emergency_address = COALESCE($32, emergency_address),
        insurance_provider = COALESCE($33, insurance_provider),
        insurance_number = COALESCE($34, insurance_number),
        policy_validity = COALESCE($35::date, policy_validity),
        tpa = COALESCE($36, tpa),
        coverage_amount = COALESCE($37, coverage_amount),
        referral_type = COALESCE($38, referral_type),
        referral_code = COALESCE($39, referral_code),
        referral_name = COALESCE($40, referral_name),
        commission_plan = COALESCE($41, commission_plan),
        allergies = COALESCE($42, allergies),
        medical_history = COALESCE($43, medical_history),
        consent_captured_at = COALESCE($44::timestamp, consent_captured_at),
        metadata = COALESCE($45::jsonb, metadata),
        updated_by = $46,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted, false) = false
    RETURNING *
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    nullableText(body.first_name),
    nullableText(body.middle_name),
    nullableText(body.last_name),
    nullableText(body.gender),
    nullableDate(body.date_of_birth),
    ageYears,
    nullableText(body.blood_group),
    nullableText(body.marital_status),
    nullableText(body.nationality),
    nullableText(body.religion),
    nullableText(body.occupation),
    nullableText(body.phone),
    nullableText(body.alternate_mobile),
    nullableText(body.email),
    nullableText(body.whatsapp_number),
    nullableText(body.address),
    nullableText(body.address_line1),
    nullableText(body.address_line2),
    nullableText(body.landmark),
    nullableText(body.city),
    nullableText(body.district),
    nullableText(body.state),
    nullableText(body.country),
    nullableText(body.pincode),
    nullableText(body.emergency_contact_name),
    nullableText(body.emergency_relationship),
    nullableText(body.emergency_contact_phone),
    nullableText(body.emergency_address),
    nullableText(body.insurance_provider),
    nullableText(body.insurance_number),
    nullableDate(body.policy_validity),
    nullableText(body.tpa),
    nullableNumber(body.coverage_amount),
    nullableText(body.referral_type),
    nullableText(body.referral_code),
    nullableText(body.referral_name),
    nullableText(body.commission_plan),
    nullableText(body.allergies),
    nullableText(body.medical_history),
    body.consent_captured_at ? new Date(body.consent_captured_at) : null,
    JSON.stringify(body.metadata || {}),
    context.user.id ?? null
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Patient not found." }, { status: 404 });
  }

  await recordClinicalAudit(context, {
    moduleName: "patients",
    action: "update",
    entityType: "patient",
    entityId: id,
    summary: "Clinical patient updated",
  });

  return NextResponse.json(rows[0]);
}

export async function DELETE(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id") || 0);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Patient id is required." }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE patients
    SET is_deleted = true,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted, false) = false
    RETURNING id, patient_uid
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.user.id ?? null
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Patient not found." }, { status: 404 });
  }

  await recordClinicalAudit(context, {
    moduleName: "patients",
    action: "delete",
    entityType: "patient",
    entityId: id,
    summary: "Clinical patient deleted",
    payload: {
      patient_uid: rows[0].patient_uid,
    },
  });

  return NextResponse.json({ success: true });
}
