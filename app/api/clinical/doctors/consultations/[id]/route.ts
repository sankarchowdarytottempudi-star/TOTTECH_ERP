import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import { createBillingItemForWorkflow } from "@/lib/clinical/phase4-operational-spine";
import { recordWorkflowEvent } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const serialize = (value: unknown) =>
  JSON.parse(
    JSON.stringify(value, (_, item) =>
      typeof item === "bigint" ? Number(item) : item
    )
  );

const text = (value: unknown) =>
  String(value || "").trim();

const normalizeList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string"
          ? { name: item }
          : item
      )
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({ name }));
  }

  return [];
};

const genericDoctorName = (value: unknown) => {
  const name = text(value);
  return !name || /^doctor( #\d+)?$/i.test(name) ? "Assigned Doctor" : name;
};

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { id } = await params;
  const appointmentId = Number(id);

  if (!Number.isFinite(appointmentId)) {
    return NextResponse.json(
      {
        error:
          "Valid appointment id is required.",
      },
      { status: 400 }
    );
  }

  const appointmentRows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        a.*,
        p.patient_uid,
        p.uhid,
        p.abha_id,
        p.phone,
        p.alternate_mobile,
        p.whatsapp_number,
        p.gender,
        p.date_of_birth,
        p.age_years,
        p.blood_group,
        p.allergies,
        p.medical_history,
        p.insurance_provider,
        p.insurance_number,
        p.emergency_relationship,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        d.full_name AS doctor_name,
        dep.department_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      LEFT JOIN departments dep ON dep.id = a.department_id
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
    return NextResponse.json(
      {
        error: "Appointment not found.",
      },
      { status: 404 }
    );
  }

  const patientId = Number(
    appointment.patient_id
  );
  const scope = [
    patientId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];

  const [
    medicalRecords,
    prescriptions,
    labOrders,
    labResults,
    radiologyOrders,
    radiologyReports,
    radiologyUploads,
    admissions,
    discharges,
    ivfCouples,
    ivfCycles,
    otSchedules,
    documents,
    timeline,
    vitals,
    labTestMasters,
    medicineMasters,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM medical_records
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM prescriptions
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM lab_orders
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY ordered_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
	      SELECT
	        lr.*,
	        lo.appointment_id,
	        lo.order_uid,
	        lo.order_type,
	        lo.status AS order_status,
	        COALESCE(lt.lab_test_name, lo.order_type) AS lab_test_name,
	        COALESCE(lt.unit, (lr.result_data ->> 'unit')) AS result_unit,
	        COALESCE(lt.reference_range, lt.normal_value, (lr.result_data ->> 'reference_range')) AS reference_range,
	        COALESCE(u.full_name, validator.full_name) AS released_by_name,
	        lr.validated_at AS released_at
	      FROM lab_results lr
	      LEFT JOIN lab_orders lo ON lo.id = lr.lab_order_id
	      LEFT JOIN clinical_lab_test_master lt
	        ON (
	          lt.id = lo.lab_test_id
	          OR lower(lt.lab_test_name) = lower(lo.order_type)
	        )
	        AND lt.tenant_id = lr.tenant_id
	        AND lt.hospital_id = lr.hospital_id
	        AND lt.branch_id = lr.branch_id
	        AND COALESCE(lt.is_deleted,false) = false
	      LEFT JOIN users u ON u.id = lr.updated_by
	      LEFT JOIN users validator ON validator.id = lr.validated_by
	      WHERE lr.patient_id = $1
	        AND lr.tenant_id = $2
	        AND lr.hospital_id = $3
	        AND lr.branch_id = $4
	        AND COALESCE(lr.is_deleted,false) = false
	        AND lr.result_status = 'RELEASED'
	      ORDER BY lr.created_at DESC, lr.id DESC
	      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM radiology_orders
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM radiology_reports
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM radiology_uploads
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY uploaded_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM ip_admissions
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY admission_date DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT ds.*
      FROM discharge_summaries ds
      JOIN ip_admissions ip ON ip.id = ds.admission_id
      WHERE ip.patient_id = $1
        AND ds.tenant_id = $2
        AND ds.hospital_id = $3
        AND ds.branch_id = $4
        AND COALESCE(ds.is_deleted,false) = false
      ORDER BY ds.discharge_date DESC NULLS LAST, ds.id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM ivf_couples
      WHERE (female_patient_id = $1 OR male_patient_id = $1)
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT cyc.*
      FROM ivf_cycles cyc
      JOIN ivf_couples c ON c.id = cyc.couple_id
      WHERE (c.female_patient_id = $1 OR c.male_patient_id = $1)
        AND cyc.tenant_id = $2
        AND cyc.hospital_id = $3
        AND cyc.branch_id = $4
        AND COALESCE(cyc.is_deleted,false) = false
      ORDER BY cyc.start_date DESC NULLS LAST, cyc.id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM ot_schedules
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY scheduled_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM medical_documents
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_patient_timeline
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY event_time DESC NULLS LAST, created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_vitals
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 20
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, lab_test_name, category, normal_value, unit, reference_range, cost, status
      FROM clinical_lab_test_master
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
        AND status = 'ACTIVE'
      ORDER BY lab_test_name ASC
      LIMIT 250
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, medicine_name, generic_name, brand_name, medicine_type, strength, unit, selling_price, stock_quantity, reorder_level, expiry_date, status
      FROM clinical_medicine_master
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
        AND status = 'ACTIVE'
      ORDER BY medicine_name ASC
      LIMIT 300
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  const currentRecord =
    medicalRecords.find(
      (record) =>
        Number(record.appointment_id) ===
        appointmentId
    ) || null;

  return NextResponse.json(serialize({
    context,
    appointment,
    currentRecord,
    patientSummary: {
      patient_id: appointment.patient_id,
      patient_name:
        appointment.patient_name,
      mrn:
        appointment.uhid ||
        appointment.patient_uid,
      age:
        appointment.age_years,
      gender: appointment.gender,
      mobile: appointment.phone,
      blood_group:
        appointment.blood_group,
      allergies: appointment.allergies,
      insurance:
        appointment.insurance_provider ||
        appointment.insurance_number,
      current_visit:
        appointment.appointment_uid,
      last_visit:
        medicalRecords.find(
          (record) =>
            Number(record.appointment_id) !==
            appointmentId
        )?.created_at || null,
      primary_doctor:
        appointment.doctor_name,
    },
    history: {
      previousConsultations:
        medicalRecords.filter(
          (record) =>
            Number(record.appointment_id) !==
            appointmentId
        ),
      previousPrescriptions:
        prescriptions,
      previousDiagnoses:
        medicalRecords.filter(
          (record) => record.diagnosis
        ),
      previousAdmissions: admissions,
      previousDischarges: discharges,
	      previousLabReports: labResults,
      previousRadiologyReports: [
        ...radiologyOrders,
        ...radiologyReports,
        ...radiologyUploads,
      ],
      previousIvfCycles: [
        ...ivfCouples,
        ...ivfCycles,
      ],
      previousProcedures: otSchedules,
      previousSurgeries: otSchedules,
      previousAllergies:
        appointment.allergies,
      previousChronicDiseases:
        appointment.medical_history,
      documents,
      timeline,
    },
    vitals,
    masters: {
      labTests: labTestMasters,
      medicines: medicineMasters,
      radiologyStudies: [
        "X-Ray",
        "2D Echo",
        "3D Echo",
        "Ultrasound",
        "CT Scan",
        "MRI",
        "Doppler",
        "Custom",
      ],
    },
  }));
}

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { id } = await params;
  const appointmentId = Number(id);
  const body = await request.json();

  if (!Number.isFinite(appointmentId)) {
    return NextResponse.json(
      {
        error:
          "Valid appointment id is required.",
      },
      { status: 400 }
    );
  }

  const appointmentRows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        a.*,
        p.phone,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
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
    return NextResponse.json(
      {
        error: "Appointment not found.",
      },
      { status: 404 }
    );
  }

  const complete =
    body.complete === true ||
    body.status === "COMPLETED";
  const rawMedications =
    normalizeList(body.medications);
  const labOrders =
    normalizeList(body.lab_orders);
  const radiologyOrders =
    normalizeList(body.radiology_orders);

  const medications: Row[] = [];
  for (const item of rawMedications) {
    const row = item as Row;
    const medicineMasterId = Number(row.medicine_master_id || row.medicine_id);
    const medicineName = text(row.name || row.medicine_name);
    const masterRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, medicine_name, generic_name, brand_name, medicine_type, strength, stock_quantity, unit
      FROM clinical_medicine_master
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
        AND (
          ($4::int IS NOT NULL AND id=$4::int)
          OR ($5::text <> '' AND lower(medicine_name)=lower($5::text))
          OR ($5::text <> '' AND lower(generic_name)=lower($5::text))
          OR ($5::text <> '' AND lower(brand_name)=lower($5::text))
        )
      ORDER BY CASE WHEN $4::int IS NOT NULL AND id=$4::int THEN 0 ELSE 1 END, id DESC
      LIMIT 1
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      Number.isFinite(medicineMasterId) && medicineMasterId > 0 ? medicineMasterId : null,
      medicineName
    );
    const master = masterRows[0] || {};
    medications.push({
      ...row,
      medicine_master_id: master.id || row.medicine_master_id || row.medicine_id || null,
      medicine_id: master.id || row.medicine_id || row.medicine_master_id || null,
      name: master.medicine_name || row.name || row.medicine_name || "",
      medicine_name: master.medicine_name || row.medicine_name || row.name || "",
      generic_name: master.generic_name || row.generic_name || "",
      brand_name: master.brand_name || row.brand_name || "",
      strength: master.strength || row.strength || "",
      dosage_form: master.medicine_type || row.dosage_form || row.medicine_type || "",
      medicine_type: master.medicine_type || row.medicine_type || row.dosage_form || "",
      available_stock: master.stock_quantity ?? row.available_stock ?? null,
      unit: master.unit || row.unit || "",
    });
  }

  let recordRows =
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

  if (recordRows.length) {
    recordRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        UPDATE medical_records
        SET chief_complaint = $5,
            history = $6,
            diagnosis = $7,
            treatment_plan = $8,
            clinical_notes = $9,
            advice = $10,
            follow_up_date = $11::date,
            status = $12,
            metadata = $13::jsonb,
            updated_by = $14,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
        RETURNING *
        `,
        recordRows[0].id,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        text(body.chief_complaint) ||
          null,
        text(body.history) || null,
        text(body.diagnosis) || null,
        text(body.treatment_plan) ||
          text(body.advice) ||
          null,
        text(body.clinical_notes) ||
          null,
        text(body.advice) || null,
        text(body.follow_up_date) ||
          null,
        complete
          ? "COMPLETED"
          : "ACTIVE",
        JSON.stringify({
          lab_orders: labOrders,
          radiology_orders:
            radiologyOrders,
          medication_scribble: text(body.medication_scribble) || null,
          study_notes_scribble: text(body.study_notes_scribble) || null,
          doctor_notes_scribble: text(body.doctor_notes_scribble) || null,
          source:
            "doctor_consultation_save",
        }),
        context.user.id ?? null
      );
  } else {
    recordRows =
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
          history,
          diagnosis,
          treatment_plan,
          clinical_notes,
          advice,
          follow_up_date,
          status,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'OPD_CONSULTATION',$8,$9,$10,$11,$12,$13,$14::date,$15,$16::jsonb,$17,$17,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        context.clinicId,
        appointment.patient_id,
        appointment.doctor_id,
        appointmentId,
        text(body.chief_complaint) ||
          null,
        text(body.history) || null,
        text(body.diagnosis) || null,
        text(body.treatment_plan) ||
          text(body.advice) ||
          null,
        text(body.clinical_notes) ||
          null,
        text(body.advice) || null,
        text(body.follow_up_date) ||
          null,
        complete
          ? "COMPLETED"
          : "ACTIVE",
        JSON.stringify({
          lab_orders: labOrders,
          radiology_orders:
            radiologyOrders,
          medication_scribble: text(body.medication_scribble) || null,
          study_notes_scribble: text(body.study_notes_scribble) || null,
          doctor_notes_scribble: text(body.doctor_notes_scribble) || null,
          source:
            "doctor_consultation_save",
        }),
        context.user.id ?? null
      );
  }

  const record = recordRows[0];
  let prescription: Row | null = null;

  if (medications.length) {
    const prescriptionRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM prescriptions
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

    if (prescriptionRows.length) {
      const updated =
        await prisma.$queryRawUnsafe<Row[]>(
          `
          UPDATE prescriptions
          SET medical_record_id = $5,
              medications = $6::jsonb,
              instructions = $7,
              chief_complaint = $8,
              diagnosis = $9,
              advice = $10,
              follow_up_date = $11::date,
              pharmacy_status = 'PENDING',
              status = 'ACTIVE',
              updated_by = $12,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND tenant_id = $2
            AND hospital_id = $3
            AND branch_id = $4
          RETURNING *
          `,
          prescriptionRows[0].id,
          context.tenantId,
          context.hospitalId,
          context.branchId,
          record.id,
          JSON.stringify(medications),
          text(body.instructions) ||
            text(body.advice) ||
            null,
          text(body.chief_complaint) ||
            null,
          text(body.diagnosis) || null,
          text(body.advice) || null,
          text(body.follow_up_date) ||
            null,
          context.user.id ?? null
        );
      prescription = updated[0];
    } else {
      const uid = `RX-${Date.now()}`;
      const inserted =
        await prisma.$queryRawUnsafe<Row[]>(
          `
          INSERT INTO prescriptions (
            tenant_id,
            hospital_id,
            branch_id,
            clinic_id,
            patient_id,
            doctor_id,
            appointment_id,
            medical_record_id,
            prescription_uid,
            medications,
            instructions,
            chief_complaint,
            diagnosis,
            advice,
            follow_up_date,
            pharmacy_status,
            status,
            created_by,
            updated_by,
            created_at,
            updated_at,
            is_deleted
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13,$14,$15::date,'PENDING','ACTIVE',$16,$16,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
          RETURNING *
          `,
          context.tenantId,
          context.hospitalId,
          context.branchId,
          context.clinicId,
          appointment.patient_id,
          appointment.doctor_id,
          appointmentId,
          record.id,
          uid,
          JSON.stringify(medications),
          text(body.instructions) ||
            text(body.advice) ||
            null,
          text(body.chief_complaint) ||
            null,
          text(body.diagnosis) ||
            null,
          text(body.advice) || null,
          text(body.follow_up_date) ||
            null,
          context.user.id ?? null
        );
      prescription = inserted[0];
    }

    const queueRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM pharmacy_prescription_queue
        WHERE prescription_id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
          AND COALESCE(is_deleted,false) = false
        LIMIT 1
        `,
        prescription.id,
        context.tenantId,
        context.hospitalId,
        context.branchId
      );

    if (queueRows.length) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE pharmacy_prescription_queue
        SET medications = $5::jsonb,
            status = 'PENDING',
            patient_name = $6,
            patient_mobile = $7,
            updated_by = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
        `,
        queueRows[0].id,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        JSON.stringify(medications),
        appointment.patient_name ||
          null,
        appointment.phone || null,
        context.user.id ?? null
      );
    } else {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO pharmacy_prescription_queue (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          queue_number,
          prescription_id,
          appointment_id,
          medical_record_id,
          patient_id,
          doctor_id,
          prescription_uid,
          patient_name,
          patient_mobile,
          medications,
          status,
          notes,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,'PENDING',$15,$16,$16,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        context.clinicId,
        `RXQ-${Date.now()}`,
        prescription.id,
        appointmentId,
        record.id,
        appointment.patient_id,
        appointment.doctor_id,
        prescription.prescription_uid,
        appointment.patient_name ||
          null,
        appointment.phone || null,
        JSON.stringify(medications),
        "Created automatically from doctor consultation",
        context.user.id ?? null
      );
    }

    if (prescription?.id) {
      await recordWorkflowEvent(context, {
        patientId: Number(appointment.patient_id),
        appointmentId,
        workflowStage: "PRESCRIPTION",
        status: "PRESCRIPTION_GENERATED",
        summary: `Prescription generated by ${genericDoctorName(appointment.doctor_name)}.`,
        sourceTable: "prescriptions",
        sourceId: Number(prescription.id),
        metadata: {
          prescription_uid: prescription.prescription_uid,
          doctor_name: genericDoctorName(appointment.doctor_name),
          medicine_count: medications.length,
          medications,
        },
      });

      await queueClinicalWorkflowNotification(context, {
        templateKey: "prescription_generated",
        patientId: Number(appointment.patient_id),
        appointmentId,
        sourceModule: "prescriptions",
        sourceRecordId: Number(prescription.id),
        variables: {
          doctor_name: genericDoctorName(appointment.doctor_name),
          medicine_count: medications.length,
        },
      }).catch(() => null);
    }
  }

  const createdLabOrders: Row[] = [];
  for (const item of labOrders) {
    const name = text(
      (item as Row).name || item
    );

    if (!name) {
      continue;
    }

    const masterRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, COALESCE(cost, price) AS amount
      FROM clinical_lab_test_master
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND (
          lower(lab_test_name) = lower($4)
          OR lower(COALESCE(test_name,'')) = lower($4)
          OR lower(COALESCE(test_code,'')) = lower($4)
        )
        AND COALESCE(is_deleted,false) = false
        AND status = 'ACTIVE'
      ORDER BY id DESC
      LIMIT 1
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      name
    );
    const labTestAmount = Number(masterRows[0]?.amount);

    if (!masterRows.length || !Number.isFinite(labTestAmount) || labTestAmount <= 0) {
      return NextResponse.json(
        {
          error: `Lab test "${name}" is missing from Lab Test Master or has no valid cost. Please configure the test cost before billing.`,
        },
        { status: 400 }
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        INSERT INTO lab_orders (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          patient_id,
          doctor_id,
          appointment_id,
          medical_record_id,
          lab_test_id,
          order_uid,
          order_type,
          priority,
          status,
          ordered_at,
          notes,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'BILL_GENERATED',CURRENT_TIMESTAMP,$13,$14::jsonb,$15,$15,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        context.clinicId,
        appointment.patient_id,
        appointment.doctor_id,
        appointmentId,
        record.id,
        Number(masterRows[0].id),
        `LAB-${Date.now()}-${createdLabOrders.length + 1}`,
        name,
        text((item as Row).priority) ||
          "NORMAL",
        text((item as Row).notes) ||
          text(body.clinical_notes) ||
          null,
        JSON.stringify({
          source:
            "doctor_consultation",
          test: item,
        }),
        context.user.id ?? null
      );
    createdLabOrders.push(rows[0]);

    await createBillingItemForWorkflow(context, {
      moduleKey: "laboratory",
      patientId: Number(appointment.patient_id),
      sourceRecordId: Number(rows[0].id),
      description: `${name} Lab Charge`,
      amount: labTestAmount,
    });
  }

  if (createdLabOrders.length) {
    await queueClinicalWorkflowNotification(context, {
      templateKey: "lab_test_ordered",
      patientId: Number(appointment.patient_id),
      appointmentId,
      sourceModule: "lab_orders",
      sourceRecordId: Number(createdLabOrders[0].id),
      variables: {
        doctor_name: genericDoctorName(appointment.doctor_name),
        lab_tests: createdLabOrders.map((row) => row.order_type).join(", "),
      },
    }).catch(() => null);
  }

  const createdRadiologyOrders: Row[] = [];
  for (const item of radiologyOrders) {
    const name = text(
      (item as Row).name || item
    );

    if (!name) {
      continue;
    }

    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        INSERT INTO radiology_orders (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          order_number,
          patient_id,
          doctor_id,
          appointment_id,
          medical_record_id,
          study_type,
          priority,
          clinical_notes,
          order_status,
          order_date,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'CREATED',CURRENT_DATE,$13::jsonb,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        context.clinicId,
        `RAD-${Date.now()}-${createdRadiologyOrders.length + 1}`,
        appointment.patient_id,
        appointment.doctor_id,
        appointmentId,
        record.id,
        name,
        text((item as Row).priority) ||
          "ROUTINE",
        text((item as Row).notes) ||
          text(body.clinical_notes) ||
          null,
        JSON.stringify({
          source:
            "doctor_consultation",
          study: item,
        }),
        context.user.id ?? null
      );
    createdRadiologyOrders.push(rows[0]);
    await createBillingItemForWorkflow(context, {
      moduleKey: "radiology",
      patientId: Number(appointment.patient_id),
      sourceRecordId: Number(rows[0].id),
      description: `${name} Radiology Charge`,
      amount: Number((item as Row).amount || (item as Row).cost || 1200),
    });
  }

  const nextAppointmentStatus = complete
    ? "CONSULTATION_COMPLETED"
    : createdLabOrders.length || createdRadiologyOrders.length
      ? "LAB_ORDERED"
      : "IN_CONSULTATION";
  const nextQueueStatus = complete
    ? prescription
      ? "AWAITING_PHARMACY"
      : "AWAITING_BILLING"
    : createdLabOrders.length || createdRadiologyOrders.length
      ? "LAB_ORDERED"
      : "IN_CONSULTATION";

  await prisma.$executeRawUnsafe(
    `
    UPDATE appointments
    SET status = $5::varchar,
        queue_status = $6::varchar,
        updated_by = $7::int,
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
    nextAppointmentStatus,
    nextQueueStatus,
    context.user.id ?? null
  );

  if (complete) {
    await createBillingItemForWorkflow(context, {
      moduleKey: "consultations",
      patientId: Number(appointment.patient_id),
      sourceRecordId: Number(record.id),
      description: "OP Consultation Fee",
      amount: Number(appointment.consultation_fee || body.consultation_fee || 500),
    });

    await recordWorkflowEvent(context, {
      patientId: Number(appointment.patient_id),
      appointmentId,
      workflowStage: "CONSULTATION",
      status: "CONSULTATION_COMPLETED",
      summary: "Doctor consultation completed.",
      sourceTable: "medical_records",
      sourceId: Number(record.id),
      metadata: {
        prescription_id: prescription?.id || null,
        lab_order_ids: createdLabOrders.map((row) => row.id),
        radiology_order_ids: createdRadiologyOrders.map((row) => row.id),
      },
    });

    await queueClinicalWorkflowNotification(context, {
      templateKey: "consultation_completed",
      patientId: Number(appointment.patient_id),
      appointmentId,
      sourceModule: "medical_records",
      sourceRecordId: Number(record.id),
      variables: {
        doctor_name: genericDoctorName(appointment.doctor_name),
        diagnosis_summary: text(body.diagnosis) || "Consultation completed",
      },
    }).catch(() => null);
  }

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
    VALUES ($1,$2,$3,$4,$5,'CONSULTATION_SAVED','Consultation saved',$6,'medical_records',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    appointment.patient_id,
    `Consultation saved with ${medications.length} medicines, ${createdLabOrders.length} lab orders, and ${createdRadiologyOrders.length} radiology orders.`,
    record.id,
    JSON.stringify({
      appointment_id: appointmentId,
      prescription_id:
        prescription?.id || null,
      lab_order_ids:
        createdLabOrders.map(
          (row) => row.id
        ),
      radiology_order_ids:
        createdRadiologyOrders.map(
          (row) => row.id
        ),
    }),
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName:
      "doctor_consultation",
    action: "save",
    entityType: "medical_record",
    entityId: Number(record.id),
    summary:
      "Doctor consultation saved",
    payload: {
      appointment_id: appointmentId,
      prescription_id:
        prescription?.id || null,
      lab_orders:
        createdLabOrders.length,
      radiology_orders:
        createdRadiologyOrders.length,
      completed: complete,
    },
  });

  return NextResponse.json(serialize({
    medical_record: record,
    prescription,
    lab_orders: createdLabOrders,
    radiology_orders:
      createdRadiologyOrders,
  }));
}
