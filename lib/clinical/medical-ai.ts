import { prisma } from "@/lib/prisma";

import type { ClinicalContext } from "./context";

type Row = Record<string, unknown>;

export type MedicalAIResponse = {
  answer: string;
  confidenceScore: number;
  dataSourcesUsed: string[];
  reasoningSummary: string;
  metadata: {
    audience: string;
    intent: string;
    patientId: number | null;
    safetyFlags: string[];
    retrievedKnowledge: Array<{
      id: number;
      title: string;
      category: string;
      source: string;
      confidenceScore: number;
    }>;
    hospitalRecordSummary: Record<string, unknown>;
    providerMode: "deterministic_rag" | "llm_rag";
  };
};

const emergencyPatterns = [
  /chest pain/i,
  /severe breath/i,
  /not breathing/i,
  /stroke/i,
  /face droop/i,
  /unconscious/i,
  /seizure/i,
  /severe bleeding/i,
  /bp\s*(?:is|=)?\s*(?:1[8-9]\d|2\d\d|3\d\d)\s*\/\s*\d+/i,
  /spo2\s*(?:is|=)?\s*(?:[0-8]\d|9[0-1])\b/i,
];

const text = (value: unknown, fallback = "") =>
  String(value ?? fallback).trim();

const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const safeQuery = async <T extends Row>(
  sql: string,
  ...params: unknown[]
): Promise<T[]> => {
  try {
    return await prisma.$queryRawUnsafe<T[]>(
      sql,
      ...params
    );
  } catch (error) {
    console.error(
      "[medical-ai] query failed",
      error
    );
    return [];
  }
};

function inferAudience(
  context: ClinicalContext,
  explicitAudience?: string
) {
  const requested =
    text(explicitAudience).toLowerCase();
  if (requested) return requested;

  const role =
    `${context.roleKey} ${context.roleName}`.toLowerCase();

  if (role.includes("doctor")) return "doctor";
  if (role.includes("nurse")) return "nurse";
  if (role.includes("lab")) return "lab_staff";
  if (role.includes("pharmac")) return "pharmacist";
  if (role.includes("patient")) return "patient";
  if (
    role.includes("admin") ||
    role.includes("owner") ||
    role.includes("finance") ||
    role.includes("cfo") ||
    role.includes("ceo")
  ) {
    return "hospital_admin";
  }

  return "clinical_user";
}

function inferIntent(prompt: string) {
  const q = prompt.toLowerCase();

  if (
    /summary|history|last .*visits|allerg|diagnos|medications|lab results|patient record/.test(
      q
    )
  ) {
    return "patient_summary";
  }
  if (
    /bp trend|blood pressure trend|vitals|spo2|weight trend|sugar.*improv|compare current/.test(
      q
    )
  ) {
    return "vitals_trends";
  }
  if (
    /\bbp\b|blood pressure|is it normal|normal range/.test(
      q
    )
  ) {
    return "patient_education";
  }
  if (
    /prescription|medicine|dosage|dose|drug interaction|alternative medication|pregnancy safe/.test(
      q
    )
  ) {
    return "prescription_assistance";
  }
  if (
    /lab|cbc|report|abnormal|critical|diagnostic|x-ray|mri|ct|ultrasound|radiology/.test(
      q
    )
  ) {
    return "diagnostics";
  }
  if (
    /appointment|waiting|follow-up|consulted today|revenue|opd load|stock shortage|productivity/.test(
      q
    )
  ) {
    return "operations";
  }
  if (
    /soap|consultation note|discharge summary|referral letter|medical certificate|conversation/.test(
      q
    )
  ) {
    return "clinical_documentation";
  }
  if (
    /pubmed|research|systematic review|meta-analysis|thesis|dissertation|citation|literature review/.test(
      q
    )
  ) {
    return "research";
  }
  if (
    /explain|simple language|telugu|what does|what causes|avoid|side effects|missed a dose/.test(
      q
    )
  ) {
    return "patient_education";
  }

  return "general_medical";
}

function queryTokens(prompt: string) {
  return Array.from(
    new Set(
      prompt
        .toLowerCase()
        .replace(/[^a-z0-9\s/-]/g, " ")
        .split(/\s+/)
        .filter((item) => item.length >= 3)
        .slice(0, 10)
    )
  );
}

function extractMobile(prompt: string) {
  return (
    prompt.match(
      /(?:\+?91[-\s]?)?[6-9]\d{9}/
    )?.[0] || ""
  ).replace(/\D/g, "").slice(-10);
}

function extractBloodPressure(prompt: string) {
  const match = prompt.match(
    /\b([1-2]?\d{2})\s*\/\s*(\d{2,3})\b/
  );
  if (!match) return null;
  const systolic = Number(match[1]);
  const diastolic = Number(match[2]);
  if (
    !Number.isFinite(systolic) ||
    !Number.isFinite(diastolic)
  ) {
    return null;
  }
  return {
    systolic,
    diastolic,
    formatted: `${systolic}/${diastolic}`,
  };
}

async function resolvePatient(
  context: ClinicalContext,
  prompt: string,
  patientId?: number | null
) {
  if (patientId) {
    const rows = await safeQuery<Row>(
      `
      SELECT id, patient_uid, uhid, first_name, middle_name, last_name, gender,
             age_years, date_of_birth, phone, whatsapp_number, abha_id, address,
             blood_group, allergies, medical_history, insurance_provider
      FROM patients
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND id=$4 AND COALESCE(is_deleted,false)=false
      LIMIT 1
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    );
    return rows[0] || null;
  }

  const mobile = extractMobile(prompt);
  const tokens = queryTokens(prompt);
  const phrase =
    tokens.length > 0
      ? `%${tokens.slice(0, 3).join("%")}%`
      : "";

  const rows = await safeQuery<Row>(
    `
    SELECT id, patient_uid, uhid, first_name, middle_name, last_name, gender,
           age_years, date_of_birth, phone, whatsapp_number, abha_id, address,
           blood_group, allergies, medical_history, insurance_provider
    FROM patients
    WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
      AND (
        ($4::text <> '' AND regexp_replace(COALESCE(phone, whatsapp_number, ''), '\\D', '', 'g') LIKE '%' || $4::text || '%')
        OR ($5::text <> '' AND (
          LOWER(COALESCE(uhid, patient_uid, '')) LIKE LOWER($5::text)
          OR LOWER(CONCAT_WS(' ', first_name, middle_name, last_name)) LIKE LOWER($5::text)
          OR LOWER(COALESCE(abha_id, '')) LIKE LOWER($5::text)
        ))
      )
    ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
    LIMIT 1
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    mobile,
    phrase
  );

  return rows[0] || null;
}

async function getPatientClinicalContext(
  context: ClinicalContext,
  patientId: number | null
) {
  if (!patientId) {
    return {
      vitals: [],
      appointments: [],
      consultations: [],
      prescriptions: [],
      labResults: [],
      radiologyReports: [],
      timeline: [],
      invoices: [],
      payments: [],
    };
  }

  const [
    vitals,
    appointments,
    consultations,
    prescriptions,
    labResults,
    radiologyReports,
    timeline,
    invoices,
    payments,
  ] = await Promise.all([
    safeQuery<Row>(
      `
      SELECT blood_pressure, systolic_bp, diastolic_bp, weight, height, bmi,
             temperature, spo2, pulse, respiration, notes, created_at
      FROM clinical_vitals
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 12
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
    safeQuery<Row>(
      `
      SELECT a.id, a.appointment_uid, a.appointment_date, a.start_time,
             a.status, a.queue_status, a.reason, d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.tenant_id=$1 AND a.hospital_id=$2 AND a.branch_id=$3
        AND a.patient_id=$4 AND COALESCE(a.is_deleted,false)=false
      ORDER BY a.appointment_date DESC, a.start_time DESC NULLS LAST
      LIMIT 10
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
    safeQuery<Row>(
      `
      SELECT c.id, c.consultation_uid, c.consultation_date, c.status,
             c.chief_complaint, c.symptoms, c.diagnosis_summary,
             c.clinical_notes, c.follow_up_date, d.full_name AS doctor_name
      FROM consultations c
      LEFT JOIN doctors d ON d.id = c.doctor_id
      WHERE c.tenant_id=$1 AND c.hospital_id=$2 AND c.branch_id=$3
        AND c.patient_id=$4 AND COALESCE(c.is_deleted,false)=false
      ORDER BY c.consultation_date DESC
      LIMIT 8
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
    safeQuery<Row>(
      `
      SELECT prescription_uid, medications, instructions, diagnosis, advice,
             follow_up_date, pharmacy_status, created_at
      FROM prescriptions
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 8
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
    safeQuery<Row>(
      `
      SELECT lo.order_uid, lo.status AS order_status, lo.ordered_at,
             COALESCE(lt.lab_test_name, lt.test_name, lo.order_type) AS test_name,
             COALESCE(lr.result_status, lr.status) AS result_status,
             lr.result_value, lr.result_data, lr.interpretation,
             lr.critical_value, lr.validated_at, lr.created_at AS result_date
      FROM lab_orders lo
      LEFT JOIN clinical_lab_test_master lt ON lt.id = lo.lab_test_id
      LEFT JOIN lab_results lr ON lr.lab_order_id = lo.id AND COALESCE(lr.is_deleted,false)=false
      WHERE lo.tenant_id=$1 AND lo.hospital_id=$2 AND lo.branch_id=$3
        AND lo.patient_id=$4 AND COALESCE(lo.is_deleted,false)=false
      ORDER BY COALESCE(lr.created_at, lo.ordered_at) DESC
      LIMIT 12
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
    safeQuery<Row>(
      `
      SELECT ro.order_number, ro.study_type, ro.order_status, ro.order_date,
             rr.report_number, rr.findings, rr.impression, rr.recommendation,
             rr.status AS report_status, rr.study_date
      FROM radiology_orders ro
      LEFT JOIN radiology_reports rr ON rr.order_id = ro.id AND COALESCE(rr.is_deleted,false)=false
      WHERE ro.tenant_id=$1 AND ro.hospital_id=$2 AND ro.branch_id=$3
        AND ro.patient_id=$4 AND COALESCE(ro.is_deleted,false)=false
      ORDER BY COALESCE(rr.created_at, ro.created_at) DESC
      LIMIT 8
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
    safeQuery<Row>(
      `
      SELECT event_type, event_source, title, description, event_datetime
      FROM patient_timeline_events
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY event_datetime DESC
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
    safeQuery<Row>(
      `
      SELECT invoice_number, invoice_date, total, paid_amount, balance_amount,
             status, source_module
      FROM billing_invoices
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 10
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
    safeQuery<Row>(
      `
      SELECT payment_number, amount, method, payment_date, status
      FROM billing_payments
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY payment_date DESC
      LIMIT 10
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      patientId
    ),
  ]);

  return {
    vitals,
    appointments,
    consultations,
    prescriptions,
    labResults,
    radiologyReports,
    timeline,
    invoices,
    payments,
  };
}

async function getOperationalContext(
  context: ClinicalContext
) {
  const [dashboard, lab, pharmacy, revenue] =
    await Promise.all([
      safeQuery<Row>(
        `
        SELECT
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE)::int AS appointments_today,
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE AND queue_status IN ('WAITING','CHECKED_IN','WAITING_FOR_VITALS','WAITING_FOR_DOCTOR'))::int AS waiting_patients,
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE AND status IN ('CONSULTATION_COMPLETED','COMPLETED'))::int AS consulted_today
        FROM appointments
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
          AND COALESCE(is_deleted,false)=false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      safeQuery<Row>(
        `
        SELECT
          COUNT(*) FILTER (WHERE status IN ('PRESCRIBED','ORDERED','BILL_GENERATED','BILL_PAID','SAMPLE_COLLECTED','PROCESSING'))::int AS pending_tests,
          COUNT(*) FILTER (WHERE critical_value = true)::int AS critical_orders
        FROM lab_orders
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
          AND COALESCE(is_deleted,false)=false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      safeQuery<Row>(
        `
        SELECT
          COUNT(*) FILTER (WHERE status='ACTIVE')::int AS active_medicines,
          COUNT(*) FILTER (WHERE COALESCE(reorder_level,0) >= 0)::int AS tracked_medicines
        FROM pharmacy_medicines
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
          AND COALESCE(is_deleted,false)=false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      safeQuery<Row>(
        `
        SELECT
          COALESCE(SUM(total) FILTER (WHERE invoice_date = CURRENT_DATE),0)::numeric AS revenue_today,
          COALESCE(SUM(total) FILTER (WHERE date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE)),0)::numeric AS revenue_month,
          COALESCE(SUM(balance_amount),0)::numeric AS outstanding
        FROM billing_invoices
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
          AND COALESCE(is_deleted,false)=false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return {
    dashboard: dashboard[0] || {},
    lab: lab[0] || {},
    pharmacy: pharmacy[0] || {},
    revenue: revenue[0] || {},
  };
}

async function retrieveKnowledge(
  prompt: string,
  intent: string
) {
  const tokens = queryTokens(prompt);
  const pattern =
    tokens.length > 0
      ? `%${tokens.join("%")}%`
      : `%${intent}%`;

  return safeQuery<Row>(
    `
    SELECT id, title, category, specialty, source, source_url,
           content, keywords, citations, confidence_score
    FROM clinical_medical_knowledge_documents
    WHERE COALESCE(is_deleted,false)=false
      AND status='ACTIVE'
      AND (
        LOWER(title || ' ' || content || ' ' || COALESCE(specialty,'')) LIKE LOWER($1)
        OR category = $2
      )
    ORDER BY confidence_score DESC, updated_at DESC
    LIMIT 5
    `,
    pattern,
    intent === "diagnostics"
      ? "lab_tests"
      : intent === "prescription_assistance"
        ? "drugs"
        : intent === "research"
          ? "research_papers"
          : "guidelines"
  );
}

function formatPatientName(patient: Row | null) {
  if (!patient) return "No patient selected";
  return (
    text(
      [
        patient.first_name,
        patient.middle_name,
        patient.last_name,
      ]
        .filter(Boolean)
        .join(" ")
    ) || "Unnamed patient"
  );
}

function formatList(
  rows: Row[],
  formatter: (row: Row, index: number) => string,
  empty = "No records found."
) {
  if (!rows.length) return empty;
  return rows
    .map((row, index) => formatter(row, index))
    .join("\n");
}

function vitalRiskFlags(vitals: Row[]) {
  const latest = vitals[0];
  if (!latest) return [];

  const flags: string[] = [];
  const sys = numberOrNull(latest.systolic_bp);
  const dia = numberOrNull(latest.diastolic_bp);
  const spo2 = numberOrNull(latest.spo2);
  const temp = numberOrNull(latest.temperature);

  if (sys !== null && dia !== null) {
    if (sys >= 180 || dia >= 120) {
      flags.push("Hypertensive crisis range: immediate clinician review required.");
    } else if (sys >= 160 || dia >= 100) {
      flags.push("Blood pressure is significantly elevated; clinician review recommended.");
    }
  }
  if (spo2 !== null && spo2 < 92) {
    flags.push("SpO2 is low; urgent clinical assessment may be required.");
  }
  if (temp !== null && temp >= 103) {
    flags.push("High fever range; clinician review recommended.");
  }

  return flags;
}

function buildAnswer(input: {
  context: ClinicalContext;
  prompt: string;
  audience: string;
  intent: string;
  patient: Row | null;
  patientContext: Awaited<
    ReturnType<typeof getPatientClinicalContext>
  >;
  operations: Awaited<
    ReturnType<typeof getOperationalContext>
  >;
  knowledge: Row[];
  safetyFlags: string[];
}) {
  const {
    prompt,
    audience,
    intent,
    patient,
    patientContext,
    operations,
    knowledge,
    safetyFlags,
  } = input;
  const patientName = formatPatientName(patient);
  const latestVitals =
    patientContext.vitals[0] || null;
  const latestLabs =
    patientContext.labResults.slice(0, 5);
  const latestRx =
    patientContext.prescriptions[0] || null;
  const knowledgeSummary =
    knowledge[0]?.content
      ? text(knowledge[0].content)
      : "";

  const sections: string[] = [];
  sections.push("Summary");

  if (safetyFlags.length) {
    sections.push(
      `Safety alert: ${safetyFlags.join(" ")}`
    );
  }

  if (intent === "operations") {
    const d = operations.dashboard;
    const r = operations.revenue;
    const l = operations.lab;
    const p = operations.pharmacy;
    sections.push(
      [
        `Appointments today: ${d.appointments_today ?? 0}`,
        `Waiting patients: ${d.waiting_patients ?? 0}`,
        `Consulted today: ${d.consulted_today ?? 0}`,
        `Pending lab tests: ${l.pending_tests ?? 0}`,
        `Critical lab orders flagged: ${l.critical_orders ?? 0}`,
        `Revenue today: ₹${r.revenue_today ?? 0}`,
        `Monthly revenue: ₹${r.revenue_month ?? 0}`,
        `Outstanding amount: ₹${r.outstanding ?? 0}`,
        `Active medicines: ${p.active_medicines ?? 0}`,
      ].join("\n")
    );
  } else if (intent === "vitals_trends") {
    sections.push(
      patient
        ? `Patient: ${patientName} (${text(patient.uhid || patient.patient_uid)})`
        : "No patient was resolved from the prompt. Add patient name, mobile, UHID, or pass patientId."
    );
    sections.push(
      "Clinical Interpretation"
    );
    sections.push(
      formatList(
        patientContext.vitals,
        (row) =>
          `${new Date(text(row.created_at)).toLocaleString()}: BP ${text(row.blood_pressure, "-")}, Pulse ${text(row.pulse, "-")}, SpO2 ${text(row.spo2, "-")}, Temp ${text(row.temperature, "-")}, Weight ${text(row.weight, "-")}, BMI ${text(row.bmi, "-")}`,
        "No vitals found for this patient."
      )
    );
  } else if (
    intent === "patient_summary"
  ) {
    sections.push(
      patient
        ? `Patient: ${patientName} | UHID: ${text(patient.uhid || patient.patient_uid, "-")} | Age/Gender: ${text(patient.age_years, "-")}/${text(patient.gender, "-")} | Mobile: ${text(patient.phone || patient.whatsapp_number, "-")}`
        : "No patient was resolved from the prompt. Add patient name, mobile, UHID, or pass patientId."
    );
    sections.push("Clinical Interpretation");
    sections.push(
      [
        `Allergies: ${text(patient?.allergies, "No allergy recorded.")}`,
        `Medical history: ${text(patient?.medical_history, "No medical history recorded.")}`,
        latestVitals
          ? `Latest vitals: BP ${text(latestVitals.blood_pressure, "-")}, Pulse ${text(latestVitals.pulse, "-")}, SpO2 ${text(latestVitals.spo2, "-")}, Temp ${text(latestVitals.temperature, "-")}`
          : "Latest vitals: No vitals recorded.",
        latestRx
          ? `Latest prescription: ${text(latestRx.prescription_uid)} | Pharmacy status ${text(latestRx.pharmacy_status)}`
          : "Latest prescription: No prescription found.",
      ].join("\n")
    );
    sections.push("Latest Lab Results");
    sections.push(
      formatList(
        latestLabs,
        (row) =>
          `${text(row.test_name, "Lab test")}: ${text(row.result_value || row.result_data, "No value")} | Status: ${text(row.result_status || row.order_status, "-")} | Critical: ${text(row.critical_value, "false")}`,
        "No lab results found."
      )
    );
    sections.push("Recent Visits");
    sections.push(
      formatList(
        patientContext.appointments.slice(0, 5),
        (row) =>
          `${text(row.appointment_date)} ${text(row.start_time)} - ${text(row.doctor_name, "Doctor")} - ${text(row.status)} / ${text(row.queue_status)}`,
        "No visits found."
      )
    );
  } else if (
    intent === "prescription_assistance"
  ) {
    sections.push(
      "Clinical Interpretation"
    );
    sections.push(
      patient
        ? `Use the patient context before prescribing: allergies = ${text(patient.allergies, "not recorded")}; latest diagnosis = ${text(patientContext.consultations[0]?.diagnosis_summary, "not recorded")}.`
        : "No patient context was resolved. Prescription drafts require clinician review and patient-specific allergy, pregnancy, renal, hepatic, and interaction checks."
    );
    sections.push("Recommendations");
    sections.push(
      "I can draft a prescription structure, check the patient's current medicines in the record, and flag interaction/allergy review needs. I will not independently prescribe. A licensed doctor must confirm medicine, dose, route, frequency, duration, and instructions."
    );
  } else if (intent === "diagnostics") {
    sections.push("Clinical Interpretation");
    sections.push(
      patient
        ? `For ${patientName}, latest diagnostic records are listed below. Doctor review should use released reports, symptoms, vitals, and previous values together.`
        : "No patient was resolved. I can still explain lab/radiology concepts, but patient-specific interpretation needs UHID/mobile/name."
    );
    sections.push("Lab / Diagnostic Findings");
    sections.push(
      formatList(
        latestLabs,
        (row) =>
          `${text(row.test_name, "Lab test")}: ${text(row.result_value || row.result_data, "No value")} | Interpretation: ${text(row.interpretation, "-")} | Status: ${text(row.result_status || row.order_status, "-")} | Critical: ${text(row.critical_value, "false")}`,
        "No lab result records found."
      )
    );
    sections.push(
      formatList(
        patientContext.radiologyReports.slice(0, 5),
        (row) =>
          `${text(row.study_type, "Study")}: ${text(row.impression || row.findings, "No report text")} | Status: ${text(row.report_status || row.order_status, "-")}`,
        "No radiology reports found."
      )
    );
  } else if (
    intent === "clinical_documentation"
  ) {
    sections.push("Recommendations");
    sections.push(
      [
        "SOAP note draft:",
        `S: ${text(patientContext.consultations[0]?.chief_complaint, "Chief complaint not recorded.")}`,
        `O: ${latestVitals ? `BP ${text(latestVitals.blood_pressure, "-")}, Pulse ${text(latestVitals.pulse, "-")}, SpO2 ${text(latestVitals.spo2, "-")}, Temp ${text(latestVitals.temperature, "-")}` : "Vitals not recorded."}`,
        `A: ${text(patientContext.consultations[0]?.diagnosis_summary, "Assessment/diagnosis not recorded.")}`,
        `P: ${text(patientContext.consultations[0]?.clinical_notes || patientContext.prescriptions[0]?.instructions, "Plan not recorded.")}`,
      ].join("\n")
    );
  } else if (intent === "research") {
    sections.push("Evidence");
    sections.push(
      "Live PubMed/ClinicalTrials retrieval is not configured in this deployment yet. RAG tables are available for PubMed, guidelines, research papers, thesis material, ICD/SNOMED, drugs, diseases, and lab tests. Insufficient live evidence found for a current literature answer."
    );
    sections.push("Recommendations");
    sections.push(
      "Enable the external medical RAG ingestion job and provider keys before using this for current research summaries, systematic review comparison, or thesis citations."
    );
  } else if (
    intent === "patient_education"
  ) {
    sections.push("Clinical Interpretation");
    const bp =
      extractBloodPressure(prompt);
    if (bp) {
      const elevated =
        bp.systolic >= 140 ||
        bp.diastolic >= 90;
      const urgent =
        bp.systolic >= 180 ||
        bp.diastolic >= 120;
      sections.push(
        elevated
          ? `No. A blood pressure reading of ${bp.formatted} mmHg is above the usual normal range. ${urgent ? "This is in a very high range and should be treated as urgent, especially with symptoms." : "It should be reviewed by your doctor, especially if repeated or associated with symptoms."}`
          : `A blood pressure reading of ${bp.formatted} mmHg is not in the high range by usual adult thresholds, but interpretation depends on age, pregnancy status, symptoms, medicines, and previous readings.`
      );
      sections.push(
        knowledgeSummary ||
          "Trend comparison with previous readings is clinically useful."
      );
    } else {
      sections.push(
        knowledgeSummary ||
          "I can explain medical reports and medicines in simple language when patient-specific records or relevant knowledge documents are available."
      );
    }
    sections.push("Recommendations");
    sections.push(
      "For urgent symptoms, abnormal vitals, severe pain, breathlessness, fainting, stroke signs, pregnancy warning symptoms, or worsening condition, contact the hospital or emergency service immediately."
    );
  } else {
    sections.push("Clinical Interpretation");
    sections.push(
      knowledgeSummary ||
        "I can answer doctor, nurse, lab, pharmacy, patient, research, and hospital operations questions using hospital records and the medical knowledge base. Add patient name, UHID, mobile number, or patientId for patient-specific answers."
    );
  }

  sections.push("Evidence");
  sections.push(
    [
      patient
        ? `Hospital data: patient record, vitals (${patientContext.vitals.length}), visits (${patientContext.appointments.length}), consultations (${patientContext.consultations.length}), lab records (${patientContext.labResults.length}), prescriptions (${patientContext.prescriptions.length}).`
        : "Hospital data: no patient-specific record selected.",
      knowledge.length
        ? `Knowledge retrieved: ${knowledge.map((row) => text(row.title)).join("; ")}.`
        : "Knowledge retrieved: none matching the query.",
    ].join("\n")
  );

  sections.push("Recommendations");
  if (
    audience === "patient" ||
    intent === "patient_education"
  ) {
    sections.push(
      "This explanation is educational and does not replace medical care. Please consult your doctor before changing medicines or treatment."
    );
  } else {
    sections.push(
      "Clinical review required. Use this as decision support only; confirm diagnosis, orders, dose, and treatment plan as a licensed clinician."
    );
  }

  sections.push("References");
  sections.push(
    knowledge.length
      ? knowledge
          .map(
            (row, index) =>
              `${index + 1}. ${text(row.title)} — ${text(row.source)}${row.source_url ? ` (${text(row.source_url)})` : ""}`
          )
          .join("\n")
      : "No external/current literature reference retrieved in this deployment."
  );

  return sections.join("\n\n");
}

export async function answerMedicalAIQuestion({
  context,
  prompt,
  patientId,
  audience,
}: {
  context: ClinicalContext;
  prompt: string;
  patientId?: number | null;
  audience?: string;
}): Promise<MedicalAIResponse> {
  const resolvedAudience = inferAudience(
    context,
    audience
  );
  const intent = inferIntent(prompt);
  const patient = await resolvePatient(
    context,
    prompt,
    patientId
  );
  const resolvedPatientId =
    numberOrNull(patient?.id) || null;

  const [
    patientContext,
    operations,
    knowledge,
  ] = await Promise.all([
    getPatientClinicalContext(
      context,
      resolvedPatientId
    ),
    getOperationalContext(context),
    retrieveKnowledge(prompt, intent),
  ]);

  const safetyFlags = [
    ...emergencyPatterns
      .filter((pattern) => pattern.test(prompt))
      .map(
        () =>
          "Emergency/urgent-symptom language detected; advise immediate clinical review."
      ),
    ...(extractBloodPressure(prompt) &&
    (extractBloodPressure(prompt)!.systolic >=
      160 ||
      extractBloodPressure(prompt)!.diastolic >=
        100)
      ? [
          "Blood pressure reading is significantly elevated; doctor review is recommended.",
        ]
      : []),
    ...vitalRiskFlags(
      patientContext.vitals
    ),
  ];

  const uniqueSafetyFlags = Array.from(
    new Set(safetyFlags)
  );

  const answer = buildAnswer({
    context,
    prompt,
    audience: resolvedAudience,
    intent,
    patient,
    patientContext,
    operations,
    knowledge,
    safetyFlags: uniqueSafetyFlags,
  });

  const sourceSet = new Set<string>([
    "Hospital ERP Records",
    "Patient 360 Timeline",
    "Clinical Medical Knowledge Base",
  ]);
  knowledge.forEach((row) =>
    sourceSet.add(text(row.source))
  );

  const confidenceScore = Math.max(
    45,
    Math.min(
      92,
      55 +
        (resolvedPatientId ? 15 : 0) +
        Math.min(knowledge.length * 5, 15) +
        (intent === "operations" ? 10 : 0) -
        (intent === "research" ? 20 : 0)
    )
  );

  return {
    answer,
    confidenceScore,
    dataSourcesUsed: Array.from(sourceSet),
    reasoningSummary:
      "Answered using tenant-isolated hospital records first, then local medical knowledge documents. Live external PubMed/guideline retrieval is RAG-ready but not enabled in this deployment.",
    metadata: {
      audience: resolvedAudience,
      intent,
      patientId: resolvedPatientId,
      safetyFlags: uniqueSafetyFlags,
      retrievedKnowledge: knowledge.map(
        (row) => ({
          id: Number(row.id),
          title: text(row.title),
          category: text(row.category),
          source: text(row.source),
          confidenceScore:
            Number(row.confidence_score) || 0,
        })
      ),
      hospitalRecordSummary: {
        patientResolved: Boolean(
          resolvedPatientId
        ),
        vitals:
          patientContext.vitals.length,
        appointments:
          patientContext.appointments.length,
        consultations:
          patientContext.consultations.length,
        prescriptions:
          patientContext.prescriptions.length,
        labResults:
          patientContext.labResults.length,
        radiologyReports:
          patientContext.radiologyReports.length,
        timelineEvents:
          patientContext.timeline.length,
      },
      providerMode: "deterministic_rag",
    },
  };
}
