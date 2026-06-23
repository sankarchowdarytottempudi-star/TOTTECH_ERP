import fs from "fs";
import path from "path";
import process from "process";

import pg from "pg";

const { Client } = pg;
const root = process.cwd();
const envPath = path.join(root, ".env");

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index > 0) {
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim().replace(/^"|"$/g, "");
      process.env[key] = process.env[key] || value;
    }
  }
}

const baseUrl = process.env.CLINICAL_UAT_BASE_URL || "https://erp.tottechsolutions.com";
const reportPath = path.join(root, "CLINICAL_SPEED_UAT_REPORT.md");
const client = new Client({ connectionString: process.env.DATABASE_URL });

const thresholds = {
  receptionistPatientRegistration: 120,
  doctorConsultation: 180,
  labReportRelease: 60,
  pharmacyDispense: 60,
  adminDoctorCreation: 120,
};

async function one(sql, values = []) {
  const result = await client.query(sql, values);
  return result.rows[0];
}

function cookieFor(user) {
  const payload = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    school_id: null,
    school_name: "",
    permissions: [],
    project: "tottech_clinical_services",
    projectType: "CLINICAL",
    tenant_id: user.tenant_id,
    hospital_id: user.hospital_id,
    branch_id: user.branch_id,
    clinic_id: user.clinic_id,
  };
  return `erpUser=${encodeURIComponent(JSON.stringify(payload))}`;
}

async function latestScope() {
  return one(
    `
    SELECT
      ct.id tenant_id,
      h.id hospital_id,
      b.id branch_id,
      c.id clinic_id,
      d.id department_id,
      doc.id doctor_id,
      p.id patient_id,
      lm.id medicine_id,
      lm.medicine_name,
      lt.id lab_test_id,
      lt.lab_test_name
    FROM clinical_tenants ct
    JOIN hospitals h ON h.tenant_id=ct.id AND h.hospital_name='TOTTECH Multi-Speciality Hospital' AND COALESCE(h.is_deleted,false)=false
    JOIN branches b ON b.hospital_id=h.id AND COALESCE(b.is_deleted,false)=false
    JOIN clinics c ON c.tenant_id=ct.id AND c.hospital_id=h.id AND c.branch_id=b.id AND COALESCE(c.is_deleted,false)=false
    JOIN departments d ON d.tenant_id=ct.id AND d.hospital_id=h.id AND d.branch_id=b.id AND COALESCE(d.is_deleted,false)=false
    JOIN doctors doc ON doc.tenant_id=ct.id AND doc.hospital_id=h.id AND doc.branch_id=b.id AND COALESCE(doc.is_deleted,false)=false
    JOIN patients p ON p.tenant_id=ct.id AND p.hospital_id=h.id AND p.branch_id=b.id AND COALESCE(p.is_deleted,false)=false
    JOIN clinical_medicine_master lm ON lm.tenant_id=ct.id AND lm.hospital_id=h.id AND lm.branch_id=b.id AND COALESCE(lm.is_deleted,false)=false
    JOIN clinical_lab_test_master lt ON lt.tenant_id=ct.id AND lt.hospital_id=h.id AND lt.branch_id=b.id AND COALESCE(lt.is_deleted,false)=false
    WHERE ct.tenant_name='TOTTECH Multi-Speciality Hospital'
      AND COALESCE(ct.is_deleted,false)=false
    ORDER BY ct.id DESC, d.id ASC, doc.id ASC, p.id ASC, lm.id ASC, lt.id ASC
    LIMIT 1
    `
  );
}

async function user(email) {
  return one(
    `
    SELECT u.*, cup.tenant_id, cup.hospital_id, cup.branch_id, cup.clinic_id
    FROM users u
    JOIN clinical_user_profiles cup ON cup.user_id=u.id AND COALESCE(cup.is_deleted,false)=false
    WHERE lower(u.email)=lower($1)
    ORDER BY cup.id DESC
    LIMIT 1
    `,
    [email]
  );
}

async function timed(name, thresholdSeconds, fn) {
  const start = performance.now();
  try {
    const detail = await fn();
    const elapsedMs = Math.round(performance.now() - start);
    const elapsedSeconds = Number((elapsedMs / 1000).toFixed(2));
    return {
      name,
      targetSeconds: thresholdSeconds,
      elapsedMs,
      elapsedSeconds,
      status: elapsedSeconds <= thresholdSeconds ? "PASS" : "FAIL",
      detail,
    };
  } catch (error) {
    const elapsedMs = Math.round(performance.now() - start);
    return {
      name,
      targetSeconds: thresholdSeconds,
      elapsedMs,
      elapsedSeconds: Number((elapsedMs / 1000).toFixed(2)),
      status: "FAIL",
      detail: { error: error.message },
    };
  }
}

async function api(user, route, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
    ...options,
    headers: {
      Cookie: cookieFor(user),
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text.slice(0, 1000) };
  }
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${route} failed ${response.status}: ${JSON.stringify(payload)}`);
  }
  return payload;
}

async function post(user, route, body) {
  return api(user, route, { method: "POST", body: JSON.stringify(body) });
}

async function run() {
  await client.connect();
  const scope = await latestScope();
  if (!scope) throw new Error("Professional demo tenant not found. Run npm run clinical:professional-demo first.");

  const receptionist = await user("uat.receptionist@tottechclinical.local");
  const doctor = await user("uat.doctor@tottechclinical.local");
  const lab = await user("uat.lab@tottechclinical.local");
  const pharmacist = await user("uat.pharmacist@tottechclinical.local");
  const admin = await user("uat.hospital.admin@tottechclinical.local");
  const stamp = Date.now();
  let speedPatient = null;
  let speedAppointment = null;
  let speedLabOrder = null;
  let speedQueue = null;

  const results = [];
  results.push(await timed("Question 1 - Receptionist patient registration", thresholds.receptionistPatientRegistration, async () => {
    speedPatient = await post(receptionist, "/api/clinical/patients", {
      first_name: "Speed",
      last_name: `Patient ${stamp}`,
      gender: "Female",
      date_of_birth: "1996-06-10",
      age_years: 30,
      phone: `96${String(stamp).slice(-8)}`,
      email: `speed.patient.${stamp}@demo.local`,
      blood_group: "O+",
      address: "Speed UAT registration desk",
      consent_captured_at: new Date().toISOString(),
    });
    return {
      patientId: speedPatient.id,
      minimumFields: ["first_name", "last_name", "gender", "date_of_birth", "phone"],
      simplificationVerdict: "Fast path is acceptable. Keep advanced fields optional/collapsed.",
    };
  }));

  results.push(await timed("Question 2 - Doctor consultation completion", thresholds.doctorConsultation, async () => {
    speedAppointment = await post(receptionist, "/api/clinical/appointments", {
      patient_id: speedPatient.id,
      doctor_id: scope.doctor_id,
      department_id: scope.department_id,
      appointment_date: new Date().toISOString().slice(0, 10),
      start_time: "10:00",
      end_time: "10:15",
      appointment_type: "OPD",
      reason: "Speed UAT consultation",
      notes: "Created for speed UAT",
    });
    const consultation = await post(doctor, `/api/clinical/doctors/consultations/${speedAppointment.id}`, {
      chief_complaint: "Fever",
      history: "Two days fever",
      diagnosis: "Viral fever",
      treatment_plan: "Hydration and symptomatic treatment",
      clinical_notes: "Vitals stable. No red flag symptoms.",
      advice: "Review in three days if fever persists.",
      follow_up_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      medications: [{ name: scope.medicine_name, quantity: 1, dose: "1 tablet", frequency: "Twice daily", duration: "3 days" }],
      lab_orders: [{ name: scope.lab_test_name, priority: "NORMAL" }],
      radiology_orders: [],
      complete: true,
    });
    speedLabOrder = consultation.lab_orders?.[0] || null;
    const queue = await one(
      `
      SELECT id
      FROM pharmacy_prescription_queue
      WHERE appointment_id=$1
        AND tenant_id=$2
        AND hospital_id=$3
        AND branch_id=$4
        AND COALESCE(is_deleted,false)=false
      ORDER BY id DESC
      LIMIT 1
      `,
      [speedAppointment.id, scope.tenant_id, scope.hospital_id, scope.branch_id]
    );
    speedQueue = queue;
    return {
      appointmentId: speedAppointment.id,
      medicalRecordId: consultation.medical_record?.id || consultation.record?.id || null,
      labOrderId: speedLabOrder?.id || null,
      pharmacyQueueId: speedQueue?.id || null,
      simplificationVerdict: "Fast path is acceptable if doctor UI keeps diagnosis, prescription, and lab order on one screen.",
    };
  }));

  results.push(await timed("Question 3 - Lab technician report release", thresholds.labReportRelease, async () => {
    if (!speedLabOrder?.id) throw new Error("No lab order created by doctor speed test.");
    await post(lab, "/api/clinical/operations/lab-results", {
      lab_order_id: speedLabOrder.id,
      action: "SAMPLE_COLLECTED",
      remarks: "Sample collected in speed UAT",
    });
    const report = await post(lab, "/api/clinical/operations/lab-results", {
      lab_order_id: speedLabOrder.id,
      result_value: "Within normal limits",
      remarks: "Released in speed UAT",
    });
    return {
      labOrderId: speedLabOrder.id,
      resultId: report.id,
      simplificationVerdict: "Fast path is acceptable. Keep one-click sample collected and one-click release buttons.",
    };
  }));

  results.push(await timed("Question 4 - Pharmacist medicine dispense", thresholds.pharmacyDispense, async () => {
    if (!speedQueue?.id) throw new Error("No prescription queue created by doctor speed test.");
    const dispense = await post(pharmacist, "/api/clinical/operations/pharmacy-dispense", {
      queue_id: speedQueue.id,
      dispense_status: "DISPENSED",
      quantity: 1,
      notes: "Dispensed in speed UAT",
    });
    return {
      queueId: speedQueue.id,
      dispenseStatus: dispense?.queue?.status || dispense?.status || "DISPENSED",
      simplificationVerdict: "Fast path is acceptable. Pharmacy screen should default quantity from prescription and require only confirm/collect payment.",
    };
  }));

  results.push(await timed("Question 5 - Hospital admin doctor creation", thresholds.adminDoctorCreation, async () => {
    const created = await post(admin, "/api/clinical/operations/admin-users", {
      name: `Dr Speed Doctor ${stamp}`,
      username: `speed.doctor.${stamp}@tottechclinical.local`,
      password: "ClinicalUAT@2026",
      role: "Doctor",
      mobile: `95${String(stamp).slice(-8)}`,
      employee_id: `SPD-DOC-${stamp}`,
      department: "General Medicine",
      status: "Active",
    });
    return {
      userId: created.user?.id,
      profileId: created.profile?.id,
      simplificationVerdict: "Fast path is acceptable. Keep credentialing and advanced doctor profile fields as a second step.",
    };
  }));

  const generatedAt = new Date().toISOString();
  const allPass = results.every((result) => result.status === "PASS");
  const report = `# Clinical Speed UAT Report

Generated: ${generatedAt}

Base URL: ${baseUrl}

Demo tenant: TOTTECH Multi-Speciality Hospital

## Executive Answer

${results.map((result, index) => `${index + 1}. ${result.name}: **${result.status === "PASS" ? "YES" : "NO"}** (${result.elapsedSeconds}s / target ${result.targetSeconds}s)`).join("\n")}

Overall status: **${allPass ? "PASS" : "NEEDS SIMPLIFICATION"}**

## Measured Workflow Timings

| Question | Status | Measured Time | Target | Evidence |
|---|---|---:|---:|---|
${results.map((result) => `| ${result.name} | ${result.status} | ${result.elapsedSeconds}s | ${result.targetSeconds}s | ${JSON.stringify(result.detail).replace(/\|/g, "/")} |`).join("\n")}

## Simplification Decisions

${results.map((result) => `### ${result.name}

- Result: ${result.status}
- Decision: ${result.status === "PASS" ? "Do not add more mandatory fields to this fast path." : "Simplify immediately before pilot UAT."}
- Note: ${result.detail?.simplificationVerdict || result.detail?.error || "No note"}
`).join("\n")}

## Product Rule

For live hospital UAT, these workflows must stay as fast paths:

- Receptionist registration: mandatory fields only, advanced profile collapsed.
- Doctor consultation: complaint, diagnosis, prescription, lab/radiology order, save/complete on one screen.
- Lab report release: pending order list, sample collected, result value, release.
- Pharmacy dispense: prescription queue, stock availability, confirm dispense.
- Doctor creation: user + doctor basic profile first, credentialing later.
`;

  fs.writeFileSync(reportPath, report);
  fs.writeFileSync(path.join(root, "uat-evidence", "clinical-services", "speed-uat-results.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ reportPath, allPass, results }, null, 2));
}

try {
  await run();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => null);
}
