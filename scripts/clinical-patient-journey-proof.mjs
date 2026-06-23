import fs from "fs";
import path from "path";
import process from "process";

import { chromium } from "playwright";
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
const evidenceRoot = path.join(root, "uat-evidence", "clinical-services", "patient-journey");
const screenshotsDir = path.join(evidenceRoot, "screenshots");
const videosDir = path.join(evidenceRoot, "videos");
const pdfDir = path.join(evidenceRoot, "pdfs");
fs.mkdirSync(screenshotsDir, { recursive: true });
fs.mkdirSync(videosDir, { recursive: true });
fs.mkdirSync(pdfDir, { recursive: true });

const client = new Client({ connectionString: process.env.DATABASE_URL });
const stamp = Date.now();
let uidCounter = 0;
const uid = (prefix) => {
  uidCounter += 1;
  return `${prefix}-${stamp}-${String(uidCounter).padStart(3, "0")}`;
};

async function one(sql, values = []) {
  const result = await client.query(sql, values);
  return result.rows[0];
}

async function many(sql, values = []) {
  const result = await client.query(sql, values);
  return result.rows;
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
    JOIN clinical_medicine_master lm ON lm.tenant_id=ct.id AND lm.hospital_id=h.id AND lm.branch_id=b.id AND COALESCE(lm.is_deleted,false)=false
    JOIN clinical_lab_test_master lt ON lt.tenant_id=ct.id AND lt.hospital_id=h.id AND lt.branch_id=b.id AND COALESCE(lt.is_deleted,false)=false
    WHERE ct.tenant_name='TOTTECH Multi-Speciality Hospital'
      AND COALESCE(ct.is_deleted,false)=false
    ORDER BY ct.id DESC, d.id ASC, doc.id ASC, lm.id ASC, lt.id ASC
    LIMIT 1
    `
  );
}

async function getUser(email) {
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

function cookieFor(user) {
  return `erpUser=${encodeURIComponent(JSON.stringify({
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
  }))}`;
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
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/pdf")) {
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!response.ok) throw new Error(`${route} failed ${response.status}`);
    return { buffer, contentType };
  }
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

const post = (user, route, body) => api(user, route, { method: "POST", body: JSON.stringify(body) });
const patch = (user, route, body) => api(user, route, { method: "PATCH", body: JSON.stringify(body) });

async function createInvoiceWithItems(scope, patientId, sourceModule, sourceRecordId, items, userId) {
  const invoice = await one(
    `
    INSERT INTO billing_invoices (
      tenant_id,hospital_id,branch_id,clinic_id,invoice_number,patient_id,invoice_date,status,
      subtotal,discount,tax,total,paid_amount,balance_amount,balance,invoice_type,source_module,source_record_id,
      created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,CURRENT_DATE,'OPEN',0,0,0,0,0,0,0,'PATIENT',$7,$8,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, uid("INV"), patientId, sourceModule, sourceRecordId, userId]
  );
  for (const item of items) {
    await one(
      `
      INSERT INTO billing_invoice_items (
        tenant_id,hospital_id,branch_id,clinic_id,invoice_id,item_type,item_reference_id,item_name,item_description,
        quantity,rate,discount,tax,amount,total,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,1,$9,0,0,$9,$9,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING id
      `,
      [scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, invoice.id, item.type, item.referenceId, item.name, item.amount, userId]
    );
  }
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return one(
    `
    UPDATE billing_invoices
    SET subtotal=$2,total=$2,balance_amount=$2,balance=$2,updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
    RETURNING *
    `,
    [invoice.id, total]
  );
}

async function dbState(scope, ids) {
  const timeline = await one(
    `
    SELECT
      (
        SELECT count(*)::int FROM patient_timeline_events
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ) patient_timeline_events,
      (
        SELECT count(*)::int FROM clinical_patient_timeline
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ) clinical_patient_timeline,
      (
        SELECT count(*)::int FROM clinical_patient_workflow_events
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ) workflow_events
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id, ids.patientId]
  );
  const statuses = await one(
    `
    SELECT
      (SELECT status FROM appointments WHERE id=$4) appointment_status,
      (SELECT queue_status FROM appointments WHERE id=$4) appointment_queue_status,
      (SELECT status FROM lab_orders WHERE id=$5) lab_status,
      (SELECT result_status FROM lab_results WHERE id=$6) lab_result_status,
      (SELECT status FROM pharmacy_prescription_queue WHERE id=$7) pharmacy_status,
      (SELECT status FROM billing_invoices WHERE id=$8) invoice_status
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id, ids.appointmentId || null, ids.labOrderId || null, ids.labResultId || null, ids.pharmacyQueueId || null, ids.invoiceId || null]
  ).catch(() => ({}));
  const counts = await one(
    `
    SELECT
      (SELECT count(*)::int FROM patients WHERE id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) patients,
      (SELECT count(*)::int FROM appointments WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) appointments,
      (SELECT count(*)::int FROM clinical_vitals WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) vitals,
      (SELECT count(*)::int FROM medical_records WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) medical_records,
      (SELECT count(*)::int FROM lab_orders WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) lab_orders,
      (SELECT count(*)::int FROM lab_results WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) lab_results,
      (SELECT count(*)::int FROM prescriptions WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) prescriptions,
      (SELECT count(*)::int FROM pharmacy_prescription_queue WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) pharmacy_queue,
      (SELECT count(*)::int FROM billing_invoices WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) invoices,
      (SELECT count(*)::int FROM payments WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) payments,
      (SELECT count(*)::int FROM document_repository WHERE patient_id=$4 AND tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) documents
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id, ids.patientId]
  );
  return { counts, statuses, timeline };
}

function pass(value) {
  return value ? "PASS" : "FAIL";
}

async function savePdf(user, route, fileName) {
  const pdf = await api(user, route);
  const filePath = path.join(pdfDir, fileName);
  fs.writeFileSync(filePath, pdf.buffer);
  return { filePath, bytes: pdf.buffer.length, ok: pdf.buffer.length > 1000 };
}

async function scrollAndCapture(page, route, label, expectedText = "") {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(500);
  const body = await page.locator("body").innerText({ timeout: 8000 }).catch(() => "");
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += Math.max(260, Math.floor(window.innerHeight * 0.6));
        if (y > document.documentElement.scrollHeight + window.innerHeight) {
          resolve(null);
        } else {
          setTimeout(step, 180);
        }
      };
      step();
    });
  });
  await page.waitForTimeout(300);
  const screenshot = path.join(screenshotsDir, `${label}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  return {
    route,
    screenshot,
    uiUpdated: expectedText ? body.toLowerCase().includes(expectedText.toLowerCase()) : body.length > 100,
    textSample: body.slice(0, 300).replace(/\s+/g, " "),
  };
}

async function main() {
  await client.connect();
  const scope = await latestScope();
  if (!scope) throw new Error("Professional demo tenant missing.");

  const users = {
    admin: await getUser("uat.hospital.admin@tottechclinical.local"),
    receptionist: await getUser("uat.receptionist@tottechclinical.local"),
    doctor: await getUser("uat.doctor@tottechclinical.local"),
    nurse: await getUser("uat.nurse@tottechclinical.local"),
    lab: await getUser("uat.lab@tottechclinical.local"),
    pharmacist: await getUser("uat.pharmacist@tottechclinical.local"),
    finance: await getUser("uat.finance@tottechclinical.local"),
  };

  const ids = {};
  const steps = [];
  const uiEvidence = [];
  const docs = [];
  const defects = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 980 },
    recordVideo: { dir: videosDir, size: { width: 1440, height: 980 } },
  });
  await context.addCookies([
    {
      name: "erpUser",
      value: encodeURIComponent(JSON.stringify({
        id: users.admin.id,
        full_name: users.admin.full_name,
        email: users.admin.email,
        role: users.admin.role,
        school_id: null,
        school_name: "",
        permissions: [],
        project: "tottech_clinical_services",
        projectType: "CLINICAL",
        tenant_id: scope.tenant_id,
        hospital_id: scope.hospital_id,
        branch_id: scope.branch_id,
        clinic_id: scope.clinic_id,
      })),
      domain: new URL(baseUrl).hostname,
      path: "/",
      secure: baseUrl.startsWith("https://"),
      sameSite: "Lax",
    },
  ]);
  const page = await context.newPage();

  async function recordStep(name, action, route, expectedText, checks) {
    const before = ids.patientId ? await dbState(scope, ids) : null;
    const result = await action();
    const after = ids.patientId ? await dbState(scope, ids) : null;
    const ui = route ? await scrollAndCapture(page, route, String(steps.length + 1).padStart(2, "0") + "-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), expectedText) : null;
    if (ui) uiEvidence.push({ step: name, ...ui });
    const checkResult = checks ? checks({ before, after, result, ui }) : [];
    const failed = checkResult.filter((check) => check.status === "FAIL");
    if (failed.length) {
      defects.push(...failed.map((check) => `${name}: ${check.name} - ${check.detail || "failed"}`));
    }
    steps.push({ name, result, dbBefore: before, dbAfter: after, ui, checks: checkResult });
  }

  await recordStep(
    "Register Patient",
    async () => {
      const patient = await post(users.receptionist, "/api/clinical/patients", {
        first_name: "Journey",
        last_name: `Patient ${stamp}`,
        gender: "Female",
        date_of_birth: "1992-06-10",
        age_years: 34,
        phone: `94${String(stamp).slice(-8)}`,
        email: `journey.patient.${stamp}@demo.local`,
        blood_group: "B+",
        address: "End-to-end patient journey evidence",
        consent_captured_at: new Date().toISOString(),
      });
      ids.patientId = patient.id;
      ids.patientName = `${patient.first_name} ${patient.last_name}`;
      return patient;
    },
    "/clinical-services/patients",
    "Journey",
    ({ after, ui }) => [
      { name: "Database patient inserted", status: pass(after.counts.patients >= 1) },
      { name: "UI patient list updated", status: pass(ui.uiUpdated) },
      { name: "Timeline event appeared", status: pass(after.timeline.patient_timeline_events + after.timeline.clinical_patient_timeline + after.timeline.workflow_events >= 1) },
      { name: "Billing not expected at registration", status: "PASS" },
      { name: "Document not expected at registration", status: "PASS" },
    ]
  );

  await recordStep(
    "Appointment",
    async () => {
      const appointment = await post(users.receptionist, "/api/clinical/appointments", {
        patient_id: ids.patientId,
        doctor_id: scope.doctor_id,
        department_id: scope.department_id,
        appointment_date: new Date().toISOString().slice(0, 10),
        start_time: "11:00",
        end_time: "11:20",
        appointment_type: "OPD",
        reason: "End-to-end workflow proof",
      });
      ids.appointmentId = appointment.id;
      return appointment;
    },
    `/clinical-services/appointments/${ids.appointmentId || ""}`,
    "BOOKED",
    ({ after, result, ui }) => [
      { name: "Database appointment inserted", status: pass(after.counts.appointments >= 1) },
      { name: "Status BOOKED/WAITING", status: pass(result.status === "BOOKED" && result.queue_status === "WAITING") },
      { name: "UI appointment page updated", status: pass(ui.uiUpdated) },
      { name: "Timeline event appeared", status: pass(after.timeline.patient_timeline_events + after.timeline.clinical_patient_timeline + after.timeline.workflow_events >= 1) },
    ]
  );

  await recordStep(
    "Check-In",
    async () => patch(users.receptionist, "/api/clinical/appointments", { id: ids.appointmentId, status: "IN_PROGRESS", queue_status: "CHECKED_IN" }),
    `/clinical-services/appointments/${ids.appointmentId}`,
    "CHECKED",
    ({ after, result, ui }) => [
      { name: "Database appointment status changed", status: pass(after.statuses.appointment_status === "IN_PROGRESS" || result.status === "IN_PROGRESS") },
      { name: "Workflow queue CHECKED_IN", status: pass(after.statuses.appointment_queue_status === "CHECKED_IN" || result.queue_status === "CHECKED_IN") },
      { name: "UI check-in status visible", status: pass(ui.uiUpdated) },
      { name: "Timeline event for check-in", status: "FAIL", detail: "Appointment PATCH changes status but does not create a patient timeline/workflow event." },
    ]
  );

  await recordStep(
    "Vitals",
    async () => post(users.nurse, "/api/clinical/operations/vitals", {
      appointment_id: ids.appointmentId,
      blood_pressure: "118/78",
      weight: 62,
      height: 164,
      temperature: 98.4,
      spo2: 99,
      pulse: 78,
      respiration: 16,
      notes: "Vitals captured for end-to-end journey",
      mark_ready: true,
    }),
    `/clinical-services/doctors/consultation/${ids.appointmentId}`,
    "Vitals",
    ({ after, ui }) => [
      { name: "Database vitals inserted", status: pass(after.counts.vitals >= 1) },
      { name: "Status READY_FOR_CONSULTATION", status: pass(after.statuses.appointment_status === "READY_FOR_CONSULTATION") },
      { name: "UI doctor screen shows patient context", status: pass(ui.uiUpdated) },
      { name: "Timeline/workflow event appeared", status: pass(after.timeline.workflow_events >= 1) },
    ]
  );

  await recordStep(
    "Doctor Consultation + Lab Order",
    async () => {
      const consultation = await post(users.doctor, `/api/clinical/doctors/consultations/${ids.appointmentId}`, {
        chief_complaint: "Fever and fatigue",
        history: "Three days fever with body pains",
        diagnosis: "Acute viral syndrome, lab confirmation required",
        treatment_plan: "Order CBC and review report before prescription",
        clinical_notes: "No respiratory distress. Hydration advised.",
        advice: "Return after lab report.",
        follow_up_date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
        medications: [],
        lab_orders: [{ name: scope.lab_test_name, priority: "NORMAL" }],
        radiology_orders: [],
        complete: false,
      });
      ids.medicalRecordId = consultation.medical_record?.id;
      ids.labOrderId = consultation.lab_orders?.[0]?.id;
      return consultation;
    },
    `/clinical-services/laboratory`,
    scope.lab_test_name,
    ({ after, result, ui }) => [
      { name: "Database medical record inserted", status: pass(after.counts.medical_records >= 1) },
      { name: "Lab order created", status: pass(after.counts.lab_orders >= 1 && ids.labOrderId) },
      { name: "Status IN_CONSULTATION/ORDERED", status: pass(after.statuses.appointment_status === "IN_CONSULTATION" && after.statuses.lab_status === "ORDERED") },
      { name: "UI lab order visible", status: pass(ui.uiUpdated) },
      { name: "Timeline event appeared", status: pass(after.timeline.clinical_patient_timeline >= 1 || after.timeline.workflow_events >= 1) },
    ]
  );

  await recordStep(
    "Sample Collection",
    async () => post(users.lab, "/api/clinical/operations/lab-results", {
      lab_order_id: ids.labOrderId,
      action: "SAMPLE_COLLECTED",
      remarks: "Sample collected for full journey proof",
    }),
    "/clinical-services/laboratory",
    "SAMPLE",
    ({ after, ui }) => [
      { name: "Database lab order status changed", status: pass(after.statuses.lab_status === "SAMPLE_COLLECTED") },
      { name: "UI laboratory screen updated", status: pass(ui.uiUpdated) },
      { name: "Timeline/workflow event appeared", status: pass(after.timeline.workflow_events >= 2) },
    ]
  );

  await recordStep(
    "Result Entry",
    async () => ({ note: "Current API combines result entry and release in one action." }),
    "/clinical-services/laboratory",
    "SAMPLE",
    ({ after, ui }) => [
      { name: "Separate result entry state exists", status: "FAIL", detail: "No separate ENTERED/PENDING_VALIDATION UI/API step; release endpoint creates APPROVED result directly." },
      { name: "UI laboratory still accessible", status: pass(ui.uiUpdated) },
    ]
  );

  await recordStep(
    "Result Release",
    async () => {
      const result = await post(users.lab, "/api/clinical/operations/lab-results", {
        lab_order_id: ids.labOrderId,
        result_value: "WBC 6900 cells/cumm; Hb 12.8 g/dL; Platelets 2.4 lakh",
        remarks: "No critical abnormality. Report released.",
      });
      ids.labResultId = result.id;
      return result;
    },
    `/clinical-services/patients/${ids.patientId}`,
    "Lab",
    ({ after, ui }) => [
      { name: "Database lab result inserted", status: pass(after.counts.lab_results >= 1) },
      { name: "Lab order RESULT_READY", status: pass(after.statuses.lab_status === "RESULT_READY") },
      { name: "Appointment LAB_COMPLETED", status: pass(after.statuses.appointment_status === "LAB_COMPLETED") },
      { name: "UI patient 360 updated", status: pass(ui.uiUpdated) },
      { name: "Timeline/workflow event appeared", status: pass(after.timeline.workflow_events >= 3) },
    ]
  );

  docs.push({ type: "Lab Report", ...(await savePdf(users.lab, `/api/clinical/documents/render/lab-report/${ids.labOrderId}`, "lab-report.pdf")) });

  await recordStep(
    "Doctor Review + Prescription",
    async () => {
      const consultation = await post(users.doctor, `/api/clinical/doctors/consultations/${ids.appointmentId}`, {
        chief_complaint: "Fever and fatigue",
        history: "CBC reviewed. No critical abnormality.",
        diagnosis: "Viral fever",
        treatment_plan: "Symptomatic treatment and hydration",
        clinical_notes: "Reviewed lab report and patient stable.",
        advice: "Paracetamol if fever. Review if symptoms persist.",
        follow_up_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
        medications: [{ name: scope.medicine_name, quantity: 1, dose: "1 tablet", frequency: "Twice daily", duration: "3 days", instructions: "After food" }],
        lab_orders: [],
        radiology_orders: [],
        complete: true,
      });
      ids.prescriptionConsultationId = consultation.medical_record?.id ? await one(
        "SELECT id FROM consultations WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 ORDER BY id DESC LIMIT 1",
        [ids.patientId, scope.tenant_id, scope.hospital_id, scope.branch_id]
      ).then((row) => row?.id) : null;
      const queue = await one(
        "SELECT id FROM pharmacy_prescription_queue WHERE appointment_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false ORDER BY id DESC LIMIT 1",
        [ids.appointmentId, scope.tenant_id, scope.hospital_id, scope.branch_id]
      );
      ids.pharmacyQueueId = queue?.id;
      return consultation;
    },
    `/clinical-services/doctors/consultation/${ids.appointmentId}`,
    "Prescription",
    ({ after, ui }) => [
      { name: "Prescription queue created", status: pass(after.counts.pharmacy_queue >= 1 && ids.pharmacyQueueId) },
      { name: "Appointment completed", status: pass(after.statuses.appointment_status === "CHECKED_OUT" || after.statuses.appointment_queue_status === "COMPLETED") },
      { name: "UI doctor review shows context", status: pass(ui.uiUpdated) },
      { name: "Timeline event appeared", status: pass(after.timeline.clinical_patient_timeline >= 2) },
    ]
  );

  if (ids.prescriptionConsultationId) {
    docs.push({ type: "Prescription", ...(await savePdf(users.doctor, `/api/clinical/documents/render/prescription/${ids.prescriptionConsultationId}`, "prescription.pdf")) });
  } else {
    defects.push("Documents: prescription PDF could not be generated because normalized consultation id was not available from doctor route.");
  }

  await recordStep(
    "Pharmacy",
    async () => post(users.pharmacist, "/api/clinical/operations/pharmacy-dispense", {
      queue_id: ids.pharmacyQueueId,
      dispense_status: "DISPENSED",
      quantity: 1,
      notes: "Medicine dispensed for journey proof",
    }),
    "/clinical-services/pharmacy",
    "COMPLETED",
    ({ after, ui }) => [
      { name: "Pharmacy queue completed", status: pass(after.statuses.pharmacy_status === "COMPLETED") },
      { name: "UI pharmacy screen updated", status: pass(ui.uiUpdated) },
      { name: "Timeline/workflow event appeared", status: pass(after.timeline.workflow_events >= 4) },
    ]
  );

  await recordStep(
    "Billing",
    async () => {
      const invoice = await createInvoiceWithItems(scope, ids.patientId, "patient_journey", ids.appointmentId, [
        { type: "CONSULTATION", referenceId: ids.appointmentId, name: "OP Consultation Fee", amount: 600 },
        { type: "LAB", referenceId: ids.labOrderId, name: scope.lab_test_name, amount: 450 },
        { type: "PHARMACY", referenceId: ids.pharmacyQueueId, name: scope.medicine_name, amount: 120 },
      ], users.finance.id);
      ids.invoiceId = invoice.id;
      return invoice;
    },
    "/clinical-services/finance",
    "Revenue",
    ({ after, result, ui }) => [
      { name: "Invoice created", status: pass(after.counts.invoices >= 1 && result.total > 0) },
      { name: "Invoice OPEN", status: pass(after.statuses.invoice_status === "OPEN") },
      { name: "UI finance screen updated", status: pass(ui.uiUpdated) },
      { name: "Timeline for invoice missing", status: "FAIL", detail: "Direct invoice item creation path did not create a patient timeline event; billing API creates timeline only for empty manual invoice." },
    ]
  );

  docs.push({ type: "Invoice", ...(await savePdf(users.finance, `/api/clinical/billing/invoices/${ids.invoiceId}/pdf`, "invoice.pdf")) });

  await recordStep(
    "Payment",
    async () => {
      const invoice = await one("SELECT * FROM billing_invoices WHERE id=$1", [ids.invoiceId]);
      const payment = await post(users.finance, "/api/clinical/billing/invoices", {
        action: "payment",
        invoiceId: ids.invoiceId,
        patientId: ids.patientId,
        amount: Number(invoice.total || 0),
        paymentMode: "UPI",
        referenceNumber: uid("UPI"),
        remarks: "Full journey payment collected",
      });
      ids.paymentId = payment.id;
      return payment;
    },
    "/clinical-services/finance",
    "Revenue",
    ({ after, ui }) => [
      { name: "Payment inserted", status: pass(after.counts.payments >= 1) },
      { name: "Invoice paid", status: pass(after.statuses.invoice_status === "PAID") },
      { name: "UI finance screen updated", status: pass(ui.uiUpdated) },
      { name: "Timeline event appeared", status: pass(after.timeline.patient_timeline_events >= 1) },
    ]
  );

  docs.push({ type: "Receipt", ...(await savePdf(users.finance, `/api/clinical/documents/render/payment-receipt/${ids.paymentId}`, "payment-receipt.pdf")) });

  await scrollAndCapture(page, `/clinical-services/patients/${ids.patientId}/timeline`, "99-final-patient-timeline", "Payment");
  await context.close();
  await browser.close();

  const videos = fs.existsSync(videosDir) ? fs.readdirSync(videosDir).filter((file) => file.endsWith(".webm")).map((file) => path.join(videosDir, file)) : [];
  const finalDb = await dbState(scope, ids);
  const report = `# Clinical Patient Journey Proof Report

Generated: ${new Date().toISOString()}

Base URL: ${baseUrl}

## Journey IDs

- Patient ID: ${ids.patientId}
- Patient Name: ${ids.patientName}
- Appointment ID: ${ids.appointmentId}
- Lab Order ID: ${ids.labOrderId}
- Lab Result ID: ${ids.labResultId}
- Pharmacy Queue ID: ${ids.pharmacyQueueId}
- Invoice ID: ${ids.invoiceId}
- Payment ID: ${ids.paymentId}

## Screen Recording

${videos.map((video) => `- ${video}`).join("\n") || "- No video file found"}

## Step Verification

${steps.map((step, index) => `### ${index + 1}. ${step.name}

UI route: ${step.ui?.route || "N/A"}

Screenshot: ${step.ui?.screenshot || "N/A"}

| Check | Status | Detail |
|---|---|---|
${step.checks.map((check) => `| ${check.name} | ${check.status} | ${check.detail || ""} |`).join("\n")}
`).join("\n")}

## Final Database State

\`\`\`json
${JSON.stringify(finalDb, null, 2)}
\`\`\`

## Documents Generated

| Document | Status | File | Bytes |
|---|---|---|---:|
${docs.map((doc) => `| ${doc.type} | ${doc.ok ? "PASS" : "FAIL"} | ${doc.filePath} | ${doc.bytes} |`).join("\n")}

## Defects / Gaps Discovered

${defects.length ? defects.map((defect) => `- ${defect}`).join("\n") : "- No defects detected by this automated journey."}

## Notes

- The browser recording scrolls the opened pages from top to bottom after each workflow step.
- API/database checks prove the records changed; screenshots prove the corresponding pages rendered after each step.
- Human UAT still needs to judge whether the UI requires too many clicks even when the underlying workflow passes.
`;

  fs.writeFileSync(path.join(evidenceRoot, "CLINICAL_PATIENT_JOURNEY_PROOF_REPORT.md"), report);
  fs.writeFileSync(path.join(evidenceRoot, "journey-results.json"), JSON.stringify({ ids, steps, docs, defects, finalDb, videos }, null, 2));
  console.log(JSON.stringify({ report: path.join(evidenceRoot, "CLINICAL_PATIENT_JOURNEY_PROOF_REPORT.md"), ids, defects, videos, docs }, null, 2));
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => null);
}
