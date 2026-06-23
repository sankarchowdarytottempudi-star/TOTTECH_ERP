#!/usr/bin/env node
import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import pg from "pg";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const baseUrl = process.env.CLINICAL_BASE_URL || "https://erp.tottechsolutions.com";
const evidenceRoot = path.join(root, "uat-evidence", "clinical-services", "patient-journey");
const screenshotDir = path.join(evidenceRoot, "screenshots");
const videoDir = path.join(evidenceRoot, "videos");
const downloadsDir = path.join(evidenceRoot, "documents");

const ts = new Date().toISOString().replace(/[:.]/g, "-");
const journeyTag = `E2E-${Date.now()}`;
const reportPath = path.join(root, "PATIENT_JOURNEY_E2E_REPORT.md");
const reportV2Path = path.join(root, "PATIENT_JOURNEY_E2E_REPORT_V2.md");
const jsonPath = path.join(evidenceRoot, "patient-journey-results.json");

const client = new Client({ connectionString: process.env.DATABASE_URL });
const steps = [];
const defects = [];
const artifacts = {
  screenshots: [],
  videos: [],
  documents: [],
};

const asJson = (value) =>
  JSON.parse(
    JSON.stringify(value, (_, item) =>
      typeof item === "bigint" ? Number(item) : item
    )
  );

const nowDate = () => new Date().toISOString().slice(0, 10);

const sqlOne = async (query, params = []) => {
  const result = await client.query(query, params);
  return result.rows[0] || null;
};

const sqlRows = async (query, params = []) => {
  const result = await client.query(query, params);
  return result.rows;
};

const cookieFor = (user, scope) => [
  {
    name: "erpUser",
    value: JSON.stringify({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      project: "tottech_clinical_services",
    }),
    domain: new URL(baseUrl).hostname,
    path: "/",
    httpOnly: false,
    sameSite: "Lax",
  },
  {
    name: "active_clinic_id",
    value: String(scope.clinic_id),
    domain: new URL(baseUrl).hostname,
    path: "/",
  },
  {
    name: "active_hospital_id",
    value: String(scope.hospital_id),
    domain: new URL(baseUrl).hostname,
    path: "/",
  },
  {
    name: "active_branch_id",
    value: String(scope.branch_id),
    domain: new URL(baseUrl).hostname,
    path: "/",
  },
];

const api = async (request, user, scope, url, options = {}) => {
  const response = await request.fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      cookie: cookieFor(user, scope)
        .map((cookie) => `${cookie.name}=${encodeURIComponent(cookie.value)}`)
        .join("; "),
      ...(options.headers || {}),
    },
  });
  const contentType = response.headers()["content-type"] || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : Buffer.from(await response.body());
  if (!response.ok()) {
    throw new Error(`${options.method || "GET"} ${url} failed ${response.status()}: ${typeof body === "string" ? body : JSON.stringify(body).slice(0, 500)}`);
  }
  return body;
};

const snapshot = async (scope, patientId, appointmentId = null, invoiceId = null, labOrderId = null) => {
  const [patient, appointment, timelineCounts, billingCounts, documentCount, labOrder, labResult, prescription, queue, invoice] = await Promise.all([
    sqlOne(
      `SELECT id, patient_uid, uhid, first_name, last_name, created_at FROM patients WHERE id=$1`,
      [patientId]
    ),
    appointmentId
      ? sqlOne(`SELECT id, status, queue_status, appointment_uid FROM appointments WHERE id=$1`, [appointmentId])
      : Promise.resolve(null),
    sqlOne(
      `
      SELECT
        (SELECT COUNT(*)::int FROM clinical_patient_timeline WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false) AS clinical_timeline,
        (SELECT COUNT(*)::int FROM clinical_patient_workflow_events WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false) AS workflow_events,
        (SELECT COUNT(*)::int FROM patient_timeline_events WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false) AS patient_timeline_events
      `,
      [patientId, scope.tenant_id, scope.hospital_id, scope.branch_id]
    ),
    sqlOne(
      `
      SELECT
        (SELECT COUNT(*)::int FROM billing_invoices WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false) AS invoices,
        (SELECT COUNT(*)::int FROM billing_invoice_items bii JOIN billing_invoices bi ON bi.id=bii.invoice_id WHERE bi.patient_id=$1 AND bi.tenant_id=$2 AND bi.hospital_id=$3 AND bi.branch_id=$4 AND COALESCE(bii.is_deleted,false)=false AND COALESCE(bi.is_deleted,false)=false) AS invoice_items,
        (SELECT COALESCE(SUM(total),0)::numeric FROM billing_invoices WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false) AS billed_total,
        (SELECT COUNT(*)::int FROM payments WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false) AS payments,
        (SELECT COALESCE(SUM(amount),0)::numeric FROM payments WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false) AS paid_total
      `,
      [patientId, scope.tenant_id, scope.hospital_id, scope.branch_id]
    ),
    sqlOne(
      `SELECT COUNT(*)::int AS documents FROM document_repository WHERE patient_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false`,
      [patientId, scope.tenant_id, scope.hospital_id, scope.branch_id]
    ),
    labOrderId ? sqlOne(`SELECT id, status, order_type, order_uid FROM lab_orders WHERE id=$1`, [labOrderId]) : Promise.resolve(null),
    labOrderId
      ? sqlOne(`SELECT id, result_status, status, result_uid FROM lab_results WHERE lab_order_id=$1 ORDER BY id DESC LIMIT 1`, [labOrderId])
      : Promise.resolve(null),
    appointmentId
      ? sqlOne(`SELECT id, prescription_uid, pharmacy_status FROM prescriptions WHERE appointment_id=$1 ORDER BY id DESC LIMIT 1`, [appointmentId])
      : Promise.resolve(null),
    appointmentId
      ? sqlOne(`SELECT id, status, queue_number FROM pharmacy_prescription_queue WHERE appointment_id=$1 ORDER BY id DESC LIMIT 1`, [appointmentId])
      : Promise.resolve(null),
    invoiceId
      ? sqlOne(`SELECT id, invoice_number, status, total, paid_amount, balance_amount FROM billing_invoices WHERE id=$1`, [invoiceId])
      : Promise.resolve(null),
  ]);
  return asJson({
    patient,
    appointment,
    timelineCounts,
    billingCounts,
    documentCount,
    labOrder,
    labResult,
    prescription,
    pharmacyQueue: queue,
    invoice,
    invoiceId,
  });
};

const addDefect = (step, issue, impact = "Workflow evidence incomplete") => {
  defects.push({ step, issue, impact });
};

const evaluateStep = async ({
  name,
  scope,
  patientId,
  appointmentId,
  invoiceId,
  labOrderId,
  before,
  after,
  uiEvidence,
  statusCheck,
  billingCheck,
  documentCheck,
  timelineExpected = true,
}) => {
  const delta = {
    clinicalTimeline: Number(after.timelineCounts?.clinical_timeline || 0) - Number(before?.timelineCounts?.clinical_timeline || 0),
    workflowEvents: Number(after.timelineCounts?.workflow_events || 0) - Number(before?.timelineCounts?.workflow_events || 0),
    patientTimelineEvents: Number(after.timelineCounts?.patient_timeline_events || 0) - Number(before?.timelineCounts?.patient_timeline_events || 0),
    invoices: Number(after.billingCounts?.invoices || 0) - Number(before?.billingCounts?.invoices || 0),
    invoiceItems: Number(after.billingCounts?.invoice_items || 0) - Number(before?.billingCounts?.invoice_items || 0),
    payments: Number(after.billingCounts?.payments || 0) - Number(before?.billingCounts?.payments || 0),
    documents: Number(after.documentCount?.documents || 0) - Number(before?.documentCount?.documents || 0),
  };
  const anyTimeline = delta.clinicalTimeline > 0 || delta.workflowEvents > 0 || delta.patientTimelineEvents > 0;
  const result = {
    name,
    database: after.patient ? "WORKING" : "BROKEN",
    ui: uiEvidence?.ok ? "WORKING" : uiEvidence?.attempted ? "PARTIAL" : "NOT_CHECKED",
    status: statusCheck?.ok ? "WORKING" : statusCheck?.checked ? "PARTIAL" : "NOT_CHECKED",
    timeline: anyTimeline ? "WORKING" : timelineExpected ? "MISSING" : "NOT_APPLICABLE",
    billing: billingCheck?.ok ? "WORKING" : billingCheck?.checked ? "PARTIAL" : "NOT_APPLICABLE",
    documents: documentCheck?.ok ? "WORKING" : documentCheck?.checked ? "PARTIAL" : "NOT_APPLICABLE",
    delta,
    snapshot: after,
    notes: [
      uiEvidence?.note,
      statusCheck?.note,
      billingCheck?.note,
      documentCheck?.note,
    ].filter(Boolean),
  };
  if (timelineExpected && !anyTimeline) {
    addDefect(name, "No timeline event delta detected for this workflow step.");
  }
  steps.push(result);
  return result;
};

const visitAndScroll = async (page, urlPath, label, patientName) => {
  const fileLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let ok = false;
  let note = "";
  let bodyText = "";
  try {
    const response = await page.goto(`${baseUrl}${urlPath}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(1200);
    await page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 200));
      const max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      for (let y = 0; y <= max; y += 520) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
      window.scrollTo(0, max);
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    const screenshotPath = path.join(screenshotDir, `${String(steps.length + 1).padStart(2, "0")}-${fileLabel}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    artifacts.screenshots.push(screenshotPath);
    bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
    ok = response?.ok() && (!patientName || bodyText.toLowerCase().includes(patientName.toLowerCase().split(" ")[0]));
    note = ok
      ? `UI loaded and scrolled: ${urlPath}`
      : `UI loaded but did not clearly show expected patient context: ${urlPath}`;
  } catch (error) {
    note = `UI navigation failed for ${urlPath}: ${error.message}`;
  }
  return { attempted: true, ok, note, bodyText };
};

const saveBinary = async (request, user, scope, url, fileName) => {
  const response = await request.fetch(`${baseUrl}${url}`, {
    headers: {
      cookie: cookieFor(user, scope)
        .map((cookie) => `${cookie.name}=${encodeURIComponent(cookie.value)}`)
        .join("; "),
    },
  });
  const buffer = Buffer.from(await response.body());
  const target = path.join(downloadsDir, fileName);
  await fs.writeFile(target, buffer);
  artifacts.documents.push(target);
  return {
    ok: response.ok() && buffer.length > 1000 && (response.headers()["content-type"] || "").includes("pdf"),
    status: response.status(),
    contentType: response.headers()["content-type"],
    bytes: buffer.length,
    path: target,
  };
};

const createInvoiceWithItems = async (scope, userId, patientId, sourceModule, sourceRecordId, items) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.total), 0);
  const invoiceNumber = `E2E-INV-${Date.now()}`;
  const invoice = await sqlOne(
    `
    INSERT INTO billing_invoices (
      tenant_id,hospital_id,branch_id,clinic_id,invoice_number,patient_id,invoice_date,
      subtotal,discount,tax,total,paid_amount,balance_amount,balance,status,invoice_type,source_module,source_record_id,
      created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,CURRENT_DATE,$7,0,0,$7,0,$7,$7,'PENDING','OPD',$8,$9,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, invoiceNumber, patientId, subtotal, sourceModule, sourceRecordId, userId]
  );
  for (const item of items) {
    await client.query(
      `
      INSERT INTO billing_invoice_items (
        tenant_id,hospital_id,branch_id,clinic_id,invoice_id,item_name,item_type,item_reference_id,item_description,
        quantity,rate,discount,tax,total,amount,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,0,$12,$12,$13,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      [
        scope.tenant_id,
        scope.hospital_id,
        scope.branch_id,
        scope.clinic_id,
        invoice.id,
        item.name,
        item.type,
        item.referenceId || null,
        item.description || null,
        item.quantity || 1,
        item.rate,
        item.total,
        userId,
      ]
    );
  }
  return invoice;
};

const createPaymentFallback = async (scope, userId, patientId, invoiceId, amount) => {
  const paymentNumber = `E2E-PAY-${Date.now()}`;
  const payment = await sqlOne(
    `
    INSERT INTO payments (
      tenant_id,hospital_id,branch_id,clinic_id,invoice_id,patient_id,payment_number,receipt_number,
      payment_date,payment_mode,payment_method,amount,reference_number,remarks,
      created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$7,CURRENT_DATE,'UPI','UPI',$8,$7,'Direct fallback payment after API 500 during E2E journey',$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, invoiceId, patientId, paymentNumber, amount, userId]
  );
  const sums = await sqlOne(
    `
    SELECT COALESCE(SUM(amount),0)::numeric AS paid
    FROM payments
    WHERE invoice_id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
      AND COALESCE(is_deleted,false)=false
    `,
    [invoiceId, scope.tenant_id, scope.hospital_id, scope.branch_id]
  );
  await client.query(
    `
    UPDATE billing_invoices
    SET paid_amount=$5,
        balance_amount=GREATEST(total - $5, 0),
        balance=GREATEST(total - $5, 0),
        status=CASE WHEN total - $5 <= 0 THEN 'PAID' ELSE 'PARTIAL' END,
        updated_by=$6,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4
    `,
    [invoiceId, scope.tenant_id, scope.hospital_id, scope.branch_id, Number(sums.paid), userId]
  );
  return payment;
};

const latestPatientInvoice = async (scope, patientId) => {
  return sqlOne(
    `
    SELECT *
    FROM billing_invoices
    WHERE tenant_id=$1
      AND hospital_id=$2
      AND branch_id=$3
      AND patient_id=$4
      AND COALESCE(is_deleted,false)=false
    ORDER BY updated_at DESC NULLS LAST, created_at DESC, id DESC
    LIMIT 1
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id, patientId]
  );
};

const latestScope = async () => {
  const hospital = await sqlOne(
    `
    SELECT h.tenant_id, h.id AS hospital_id, b.id AS branch_id, c.id AS clinic_id,
           h.hospital_name, b.branch_name, c.clinic_name
    FROM hospitals h
    JOIN branches b ON b.hospital_id=h.id AND b.tenant_id=h.tenant_id AND COALESCE(b.is_deleted,false)=false
    JOIN clinics c ON c.hospital_id=h.id AND c.branch_id=b.id AND c.tenant_id=h.tenant_id AND COALESCE(c.is_deleted,false)=false
    WHERE h.hospital_name='TOTTECH Multi-Speciality Hospital'
      AND COALESCE(h.is_deleted,false)=false
    ORDER BY h.id DESC, b.id DESC, c.id DESC
    LIMIT 1
    `
  );
  if (!hospital) throw new Error("Demo hospital not found. Run npm run clinical:professional-demo first.");
  return hospital;
};

const usersForScope = async (scope) => {
  const rows = await sqlRows(
    `
    SELECT u.id, u.email, u.full_name, u.role, cr.role_key
    FROM users u
    JOIN clinical_user_profiles cup ON cup.user_id=u.id
    LEFT JOIN clinical_roles cr ON cr.id=cup.clinical_role_id
    WHERE cup.tenant_id=$1 AND cup.hospital_id=$2 AND cup.branch_id=$3
      AND COALESCE(cup.is_deleted,false)=false
      AND u.email LIKE 'uat.%@tottechclinical.local'
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id]
  );
  const pick = (key) =>
    rows.find((row) => String(row.email).includes(key)) ||
    rows.find((row) => String(row.role_key).toLowerCase().includes(key));
  return {
    receptionist: pick("receptionist"),
    doctor: pick("doctor"),
    nurse: pick("nurse"),
    lab: pick("lab"),
    pharmacist: pick("pharmacist"),
    finance: pick("finance"),
    admin: pick("hospital.admin") || pick("admin"),
  };
};

const writeReport = async (scope, journey, videoPaths) => {
  const rows = steps
    .map(
      (step) =>
        `| ${step.name} | ${step.database} | ${step.ui} | ${step.status} | ${step.timeline} | ${step.billing} | ${step.documents} | ${step.notes.join("<br>")} |`
    )
    .join("\n");
  const defectRows = defects.length
    ? defects
        .map((defect, index) => `| ${index + 1} | ${defect.step} | ${defect.issue} | ${defect.impact} |`)
        .join("\n")
    : "| - | - | No defects detected by this runner. | - |";
  const screenshotRows = artifacts.screenshots.map((item) => `- ${item}`).join("\n");
  const documentRows = artifacts.documents.map((item) => `- ${item}`).join("\n");
  const videoRows = videoPaths.map((item) => `- ${item}`).join("\n");

  const content = `# Patient Journey End-to-End Evidence Report

Generated: ${new Date().toISOString()}

Base URL: ${baseUrl}

Hospital: ${scope.hospital_name}

Branch: ${scope.branch_name}

Journey tag: ${journeyTag}

Patient: ${journey.patientName} (${journey.patientId})

Appointment: ${journey.appointmentId}

Lab Order: ${journey.labOrderId || "not created"}

Invoice: ${journey.invoiceId || "not created"}

Payment: ${journey.paymentId || "not created"}

## Verification Matrix

| Step | Database | UI | Status | Timeline | Billing | Documents | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Defects Found

| # | Step | Issue | Impact |
| --- | --- | --- | --- |
${defectRows}

## Evidence Files

### Screen Recording

${videoRows || "- Video path not available."}

### Screenshots

${screenshotRows || "- No screenshots captured."}

### Generated Documents

${documentRows || "- No PDF documents generated."}

## Raw Result JSON

${jsonPath}
`;
  await fs.writeFile(reportPath, content);
  await fs.writeFile(reportV2Path, content);
};

const main = async () => {
  await fs.mkdir(screenshotDir, { recursive: true });
  await fs.mkdir(videoDir, { recursive: true });
  await fs.mkdir(downloadsDir, { recursive: true });
  await client.connect();

  const scope = await latestScope();
  const users = await usersForScope(scope);
  for (const role of ["receptionist", "doctor", "nurse", "lab", "pharmacist", "finance", "admin"]) {
    if (!users[role]) throw new Error(`Missing UAT user for role: ${role}`);
  }

  const doctor = await sqlOne(
    `SELECT * FROM doctors WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY id LIMIT 1`,
    [scope.tenant_id, scope.hospital_id, scope.branch_id]
  );
  const department = await sqlOne(
    `SELECT * FROM departments WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY id LIMIT 1`,
    [scope.tenant_id, scope.hospital_id, scope.branch_id]
  );
  const labTest = await sqlOne(
    `SELECT * FROM clinical_lab_test_master WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false AND status='ACTIVE' ORDER BY id LIMIT 1`,
    [scope.tenant_id, scope.hospital_id, scope.branch_id]
  );
  const medicine = await sqlOne(
    `SELECT * FROM clinical_medicine_master WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false AND status='ACTIVE' ORDER BY id LIMIT 1`,
    [scope.tenant_id, scope.hospital_id, scope.branch_id]
  );
  if (!doctor || !department || !labTest || !medicine) {
    throw new Error("Missing doctor, department, lab test, or medicine master data.");
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    recordVideo: { dir: videoDir, size: { width: 1366, height: 900 } },
    ignoreHTTPSErrors: true,
  });
  await context.addCookies(cookieFor(users.admin, scope));
  const page = await context.newPage();
  const request = context.request;

  let patientId = null;
  let appointmentId = null;
  let labOrderId = null;
  let invoiceId = null;
  let paymentId = null;
  let patientName = null;

  try {
    const patientBody = {
      first_name: "Journey",
      last_name: `Patient ${journeyTag}`,
      gender: "Female",
      date_of_birth: "1992-05-12",
      age_years: 34,
      phone: `90000${String(Date.now()).slice(-5)}`,
      whatsapp_number: `90000${String(Date.now()).slice(-5)}`,
      email: `journey.${Date.now()}@example.com`,
      address: "Vijayawada demo address",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      emergency_contact_name: "Journey Attendant",
      emergency_contact_phone: "9000012345",
      blood_group: "B+",
      allergies: "No known allergies",
    };
    const patient = await api(request, users.receptionist, scope, "/api/clinical/patients", {
      method: "POST",
      data: patientBody,
    });
    patientId = Number(patient.id);
    patientName = `${patient.first_name} ${patient.last_name}`;
    let before = await snapshot(scope, patientId);
    let uiEvidence = await visitAndScroll(page, `/clinical-services/patients/${patientId}`, "Register Patient", patientName);
    let after = await snapshot(scope, patientId);
    await evaluateStep({
      name: "Register Patient",
      scope,
      patientId,
      before: { timelineCounts: { clinical_timeline: 0, workflow_events: 0, patient_timeline_events: 0 }, billingCounts: {}, documentCount: {} },
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: Boolean(after.patient?.id), note: "Patient row created." },
    });

    before = after;
    const appointment = await api(request, users.receptionist, scope, "/api/clinical/appointments", {
      method: "POST",
      data: {
        patient_id: patientId,
        doctor_id: doctor.id,
        department_id: department.id,
        appointment_date: nowDate(),
        start_time: "10:00",
        end_time: "10:15",
        appointment_type: "OPD",
        reason: "Fever and fatigue",
      },
    });
    appointmentId = Number(appointment.id);
    uiEvidence = await visitAndScroll(page, `/clinical-services/appointments/${appointmentId}`, "Appointment", patientName);
    after = await snapshot(scope, patientId, appointmentId);
    await evaluateStep({
      name: "Appointment",
      scope,
      patientId,
      appointmentId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.appointment?.status === "BOOKED", note: `Appointment status is ${after.appointment?.status}/${after.appointment?.queue_status}.` },
    });

    before = after;
    await api(request, users.receptionist, scope, "/api/clinical/appointments", {
      method: "PATCH",
      data: { id: appointmentId, status: "IN_PROGRESS", queue_status: "CHECKED_IN" },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/appointments/${appointmentId}`, "Check-In", patientName);
    after = await snapshot(scope, patientId, appointmentId);
    await evaluateStep({
      name: "Check-In",
      scope,
      patientId,
      appointmentId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.appointment?.queue_status === "WAITING_FOR_VITALS", note: `Queue status is ${after.appointment?.queue_status}.` },
    });

    before = after;
    await api(request, users.nurse, scope, "/api/clinical/operations/vitals", {
      method: "POST",
      data: {
        appointment_id: appointmentId,
        patient_id: patientId,
        temperature: "99.1",
        pulse: "88",
        blood_pressure: "122/80",
        respiratory_rate: "18",
        spo2: "98",
        notes: "Vitals recorded during E2E journey.",
      },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/doctors/consultation/${appointmentId}`, "Vitals", patientName);
    after = await snapshot(scope, patientId, appointmentId);
    await evaluateStep({
      name: "Vitals",
      scope,
      patientId,
      appointmentId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.appointment?.status === "VITALS_COMPLETED" && after.appointment?.queue_status === "WAITING_FOR_DOCTOR", note: `Appointment status is ${after.appointment?.status}; queue status is ${after.appointment?.queue_status}.` },
    });

    before = after;
    const consult = await api(request, users.doctor, scope, `/api/clinical/doctors/consultations/${appointmentId}`, {
      method: "POST",
      data: {
        chief_complaint: "Fever for 2 days with fatigue",
        history: "No chronic illness. No known drug allergies.",
        diagnosis: "Viral fever - provisional",
        treatment_plan: "Hydration, antipyretic, CBC test.",
        clinical_notes: "Patient stable. Lab test ordered for CBC.",
        advice: "Review with CBC report.",
        lab_orders: [{ name: labTest.lab_test_name, priority: "NORMAL" }],
        complete: false,
      },
    });
    labOrderId = Number(consult.lab_orders?.[0]?.id);
    uiEvidence = await visitAndScroll(page, `/clinical-services/doctors/consultation/${appointmentId}`, "Doctor Consultation and Lab Order", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Doctor Consultation",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.appointment?.queue_status === "LAB_ORDERED", note: `Queue status is ${after.appointment?.queue_status}.` },
    });

    await evaluateStep({
      name: "Lab Order",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.labOrder?.status === "ORDERED", note: `Lab order status is ${after.labOrder?.status}.` },
      billingCheck: { checked: true, ok: Number(after.billingCounts?.invoice_items || 0) > Number(before.billingCounts?.invoice_items || 0), note: "Automatic lab billing item should be created when the doctor orders the lab." },
    });

    before = after;
    await api(request, users.lab, scope, "/api/clinical/operations/lab-results", {
      method: "POST",
      data: { lab_order_id: labOrderId, action: "SAMPLE_COLLECTED", remarks: "Sample collected at lab counter." },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/laboratory`, "Sample Collection", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Sample Collection",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.labOrder?.status === "COLLECTED", note: `Lab order status is ${after.labOrder?.status}.` },
    });

    before = after;
    await api(request, users.lab, scope, "/api/clinical/operations/lab-results", {
      method: "POST",
      data: { lab_order_id: labOrderId, action: "PROCESSING", remarks: "Lab processing started." },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/laboratory`, "Lab Processing", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Lab Processing",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.labOrder?.status === "PROCESSING", note: `Lab order status is ${after.labOrder?.status}.` },
    });

    before = after;
    await api(request, users.lab, scope, "/api/clinical/operations/lab-results", {
      method: "POST",
      data: {
        lab_order_id: labOrderId,
        action: "RESULT_ENTRY",
        result_value: "WBC 7,200 / cumm; Hb 12.8 g/dL; Platelets 2.5 lakh",
        critical_value: false,
        remarks: "Within acceptable range. Clinical correlation advised.",
      },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/laboratory`, "Result Entry", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Result Entry",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.labResult?.result_status === "ENTERED" && after.labOrder?.status === "RESULT_ENTERED", note: `Lab result status is ${after.labResult?.result_status}; order is ${after.labOrder?.status}.` },
    });

    before = after;
    await api(request, users.lab, scope, "/api/clinical/operations/lab-results", {
      method: "POST",
      data: {
        lab_order_id: labOrderId,
        action: "VALIDATE",
        remarks: "Result validated by lab supervisor.",
      },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/laboratory`, "Result Validation", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Result Validation",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.labResult?.result_status === "VALIDATED" && after.labOrder?.status === "VALIDATED", note: `Lab result status is ${after.labResult?.result_status}; order is ${after.labOrder?.status}.` },
    });

    before = after;
    await api(request, users.lab, scope, "/api/clinical/operations/lab-results", {
      method: "POST",
      data: {
        lab_order_id: labOrderId,
        action: "APPROVE",
        remarks: "Result approved by lab supervisor.",
      },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/laboratory`, "Result Approval", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Result Approval",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.labResult?.result_status === "APPROVED" && after.labOrder?.status === "APPROVED", note: `Lab result status is ${after.labResult?.result_status}; order is ${after.labOrder?.status}.` },
    });

    before = after;
    await api(request, users.lab, scope, "/api/clinical/operations/lab-results", {
      method: "POST",
      data: {
        lab_order_id: labOrderId,
        action: "RELEASE",
        remarks: "Result released for doctor review.",
      },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/laboratory`, "Result Release", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Result Release",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.labResult?.result_status === "RELEASED" && after.labOrder?.status === "RELEASED" && after.appointment?.queue_status === "WAITING_FOR_DOCTOR_REVIEW", note: `Lab result status is ${after.labResult?.result_status}; order is ${after.labOrder?.status}; queue is ${after.appointment?.queue_status}.` },
    });

    before = after;
    uiEvidence = await visitAndScroll(page, `/clinical-services/doctors/consultation/${appointmentId}`, "Doctor Review", patientName);
    const review = await api(request, users.doctor, scope, `/api/clinical/doctors/consultations/${appointmentId}`);
    const doctorUiShowsReleasedResult =
      uiEvidence.bodyText?.includes("WBC 7,200") &&
      uiEvidence.bodyText?.includes("Hb 12.8") &&
      uiEvidence.bodyText?.includes("Released");
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Doctor Review",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: {
        checked: true,
        ok:
          Array.isArray(review.history?.previousLabReports) &&
          review.history.previousLabReports.some((row) => String(row.result_status || "") === "RELEASED" && JSON.stringify(row).includes("WBC 7,200")) &&
          doctorUiShowsReleasedResult,
        note: doctorUiShowsReleasedResult
          ? "Doctor consultation API and UI both show released lab result values for review."
          : "Doctor consultation API may have values, but the doctor UI did not visibly show released lab values.",
      },
      timelineExpected: false,
    });

    before = after;
    await api(request, users.doctor, scope, `/api/clinical/doctors/consultations/${appointmentId}`, {
      method: "POST",
      data: {
        chief_complaint: "Fever improving",
        history: "CBC reviewed.",
        diagnosis: "Viral fever - improving",
        treatment_plan: "Medication and review if fever persists.",
        clinical_notes: "CBC reviewed in doctor follow-up.",
        advice: "Paracetamol as needed. Fluids. Follow up in 3 days.",
        medications: [
          {
            name: medicine.medicine_name,
            dose: "500mg",
            frequency: "1-0-1",
            duration: "3 days",
            quantity: 6,
            instructions: "After food",
          },
        ],
        complete: true,
      },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/doctors/consultation/${appointmentId}`, "Prescription", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Prescription",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: Boolean(after.prescription?.id) && after.pharmacyQueue?.status === "PENDING", note: `Prescription ${after.prescription?.prescription_uid}; pharmacy queue ${after.pharmacyQueue?.status}.` },
    });

    before = after;
    const dispense = await api(request, users.pharmacist, scope, "/api/clinical/operations/pharmacy-dispense", {
      method: "POST",
      data: { queue_id: after.pharmacyQueue.id, dispense_status: "DISPENSED", notes: "Dispensed in E2E journey." },
    });
    uiEvidence = await visitAndScroll(page, `/clinical-services/pharmacy`, "Pharmacy", patientName);
    after = await snapshot(scope, patientId, appointmentId, null, labOrderId);
    await evaluateStep({
      name: "Pharmacy",
      scope,
      patientId,
      appointmentId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: dispense.status === "COMPLETED" && after.pharmacyQueue?.status === "COMPLETED", note: `Pharmacy queue is ${after.pharmacyQueue?.status}.` },
    });

    before = after;
    const invoice = await latestPatientInvoice(scope, patientId);
    if (!invoice) {
      throw new Error("Automatic workflow billing did not create an invoice.");
    }
    invoiceId = Number(invoice.id);
    uiEvidence = await visitAndScroll(page, `/clinical-services/billing-revenue`, "Billing", patientName);
    after = await snapshot(scope, patientId, appointmentId, invoiceId, labOrderId);
    await evaluateStep({
      name: "Billing",
      scope,
      patientId,
      appointmentId,
      invoiceId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: Boolean(after.invoice?.id) && ["OPEN", "PARTIAL", "PENDING", "DRAFT"].includes(String(after.invoice?.status || "")), note: `Workflow invoice ${after.invoice?.invoice_number || after.invoice?.id} status is ${after.invoice?.status}.` },
      billingCheck: { checked: true, ok: after.billingCounts?.invoices >= 1 && after.billingCounts?.invoice_items >= 3, note: "Invoice and itemized charges were created automatically by workflow orchestration." },
      timelineExpected: false,
    });

    before = after;
    const payment = await api(request, users.finance, scope, "/api/clinical/billing/invoices", {
      method: "POST",
      data: {
        action: "payment",
        invoiceId,
        patientId,
        amount: Number(invoice.total),
        paymentMode: "UPI",
        referenceNumber: `E2E-PAY-${Date.now()}`,
        remarks: "Full payment collected in E2E patient journey.",
      },
    });
    paymentId = Number(payment.payment?.id || payment.id);
    const paymentNote = `Payment API posted payment without DB fallback: ${paymentId}.`;
    uiEvidence = await visitAndScroll(page, `/clinical-services/billing-revenue`, "Payment", patientName);
    after = await snapshot(scope, patientId, appointmentId, invoiceId, labOrderId);
    await evaluateStep({
      name: "Payment",
      scope,
      patientId,
      appointmentId,
      invoiceId,
      labOrderId,
      before,
      after,
      uiEvidence,
      statusCheck: { checked: true, ok: after.appointment?.status === "COMPLETED" && after.appointment?.queue_status === "COMPLETED", note: `Appointment status is ${after.appointment?.status}; queue is ${after.appointment?.queue_status}.` },
      billingCheck: { checked: true, ok: after.billingCounts?.payments >= 1 && Number(after.billingCounts?.paid_total || 0) >= Number(invoice.total), note: paymentNote },
    });

    before = after;
    const invoicePdf = await saveBinary(request, users.finance, scope, `/api/clinical/billing/invoices/${invoiceId}/pdf`, `${journeyTag}-invoice.pdf`);
    const labPdf = await saveBinary(request, users.lab, scope, `/api/clinical/documents/render/lab-report/${labOrderId}`, `${journeyTag}-lab-report.pdf`);
    const receiptPdf = await saveBinary(request, users.finance, scope, `/api/clinical/documents/render/payment-receipt/${paymentId}`, `${journeyTag}-payment-receipt.pdf`);
    let prescriptionPdf = { ok: false, status: "not_attempted", bytes: 0 };
    if (after.prescription?.id) {
      prescriptionPdf = await saveBinary(request, users.doctor, scope, `/api/clinical/documents/render/prescription/${after.prescription.id}`, `${journeyTag}-prescription.pdf`).catch((error) => ({
        ok: false,
        status: "failed",
        bytes: 0,
        error: error.message,
      }));
    }
    uiEvidence = await visitAndScroll(page, `/clinical-services/patients/${patientId}/timeline`, "Final Patient Timeline", patientName);
    after = await snapshot(scope, patientId, appointmentId, invoiceId, labOrderId);
    await evaluateStep({
      name: "Documents and Timeline Review",
      scope,
      patientId,
      appointmentId,
      invoiceId,
      labOrderId,
      before,
      after,
      uiEvidence,
      documentCheck: {
        checked: true,
        ok: invoicePdf.ok && labPdf.ok && receiptPdf.ok,
        note: `Invoice PDF ${invoicePdf.ok ? "OK" : "FAILED"}, Lab PDF ${labPdf.ok ? "OK" : "FAILED"}, Receipt PDF ${receiptPdf.ok ? "OK" : "FAILED"}, Prescription PDF ${prescriptionPdf.ok ? "OK" : "FAILED"}.`,
      },
    });
    if (!prescriptionPdf.ok) {
      addDefect("Documents", "Prescription PDF did not generate from the prescription produced by the doctor consultation workflow.", "Doctor prescription document generation is not fully connected to the operational prescription table.");
    }

    await page.goto(`${baseUrl}/clinical-services/patients/${patientId}/timeline`, { waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForTimeout(1000);
  } finally {
    await context.close();
    await browser.close();
    const files = await fs.readdir(videoDir).catch(() => []);
    for (const file of files) {
      const full = path.join(videoDir, file);
      const stat = await fs.stat(full);
      if (stat.mtimeMs > Date.now() - 1000 * 60 * 15) {
        artifacts.videos.push(full);
      }
    }
  }

  const journey = { patientId, patientName, appointmentId, labOrderId, invoiceId, paymentId };
  const output = asJson({ generatedAt: new Date().toISOString(), baseUrl, scope, journey, steps, defects, artifacts });
  await fs.writeFile(jsonPath, JSON.stringify(output, null, 2));
  await writeReport(scope, journey, artifacts.videos);
  await client.end();

  console.log(JSON.stringify({ reportPath, reportV2Path, jsonPath, defects: defects.length, artifacts }, null, 2));
};

main().catch(async (error) => {
  console.error(error);
  try {
    await client.end();
  } catch {}
  process.exit(1);
});
