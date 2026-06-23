const baseUrl = process.env.CLINICAL_UAT_BASE_URL || "http://localhost:3000";

const clinicalUser = {
  id: 3,
  full_name: "Clinical Services Super Admin",
  email: "CS-Superadmin@erp.com",
  role: "SUPER_ADMIN",
  school_id: null,
  school_name: "",
  permissions: [],
  project: "tottech_clinical_services",
  projectType: "CLINICAL",
};

const cookie = `erpUser=${encodeURIComponent(JSON.stringify(clinicalUser))}`;
const evidence = [];

function today(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function mark(name, status, detail = {}) {
  evidence.push({
    name,
    status,
    detail,
  });
}

async function api(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Cookie: cookie,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text.slice(0, 500) };
  }

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed ${response.status}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function post(path, body) {
  return api(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function patch(path, body) {
  return api(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

async function seedPatients() {
  const existing = await api("/api/clinical/patients?q=UAT17");
  const patients = existing.patients || [];
  const needed = Math.max(0, 100 - patients.length);

  for (let index = 1; index <= needed; index += 1) {
    const serial = patients.length + index;
    await post("/api/clinical/patients", {
      first_name: `UAT17 Patient ${String(serial).padStart(3, "0")}`,
      last_name: serial % 2 === 0 ? "Female" : "Male",
      gender: serial % 2 === 0 ? "Female" : "Male",
      date_of_birth: serial % 2 === 0 ? "1995-01-15" : "1992-03-18",
      age_years: serial % 2 === 0 ? 31 : 34,
      phone: `90000${String(serial).padStart(5, "0")}`,
      email: `uat17-patient-${serial}@clinical.test`,
      blood_group: serial % 2 === 0 ? "O+" : "B+",
      address: "UAT Phase 17 Clinical Workflow Street",
      consent_captured_at: new Date().toISOString(),
      metadata: {
        uat_phase: "phase17",
      },
    });
  }

  const refreshed = await api("/api/clinical/patients?q=UAT17");
  mark("Patient seed", refreshed.patients?.length >= 100 ? "WORKING" : "PARTIAL", {
    count: refreshed.patients?.length || 0,
    target: 100,
  });
  return refreshed.patients || [];
}

async function seedDoctors() {
  const existing = await api("/api/clinical/doctors?q=UAT17");
  const doctors = existing.doctors || [];
  const departments = existing.departments || [];
  const needed = Math.max(0, 50 - doctors.length);
  const departmentId = departments[0]?.id || null;

  for (let index = 1; index <= needed; index += 1) {
    const serial = doctors.length + index;
    await post("/api/clinical/doctors", {
      full_name: `UAT17 Doctor ${String(serial).padStart(3, "0")}`,
      specialization: serial % 3 === 0 ? "IVF" : serial % 3 === 1 ? "General Medicine" : "Radiology",
      ...(departmentId ? { department_id: departmentId } : {}),
      phone: `91000${String(serial).padStart(5, "0")}`,
      email: `uat17-doctor-${serial}@clinical.test`,
      consultation_fee: 500 + serial,
      status: "AVAILABLE",
      availability: {
        mon_fri: "09:00-17:00",
      },
    });
  }

  const refreshed = await api("/api/clinical/doctors?q=UAT17");
  mark("Doctor seed", refreshed.doctors?.length >= 50 ? "WORKING" : "PARTIAL", {
    count: refreshed.doctors?.length || 0,
    target: 50,
  });
  return {
    doctors: refreshed.doctors || [],
    departments: refreshed.departments || departments,
  };
}

async function seedAppointments(patients, doctors, departments) {
  const created = [];
  const departmentId = departments[0]?.id || null;

  for (let index = 0; index < Math.min(25, patients.length, doctors.length); index += 1) {
    const appointment = await post("/api/clinical/appointments", {
      patient_id: patients[index].id,
      doctor_id: doctors[index % doctors.length].id,
      ...(departmentId ? { department_id: departmentId } : {}),
      appointment_date: today(index % 3),
      start_time: `${String(9 + (index % 8)).padStart(2, "0")}:00`,
      end_time: `${String(9 + (index % 8)).padStart(2, "0")}:30`,
      appointment_type: "OPD",
      reason: "UAT Phase 17 consultation",
      notes: "Created by Clinical Phase 17 UAT script",
    });
    created.push(appointment);
  }

  await patch("/api/clinical/appointments", {
    id: created[0]?.id,
    queue_status: "CHECKED_IN",
    status: "IN_PROGRESS",
  });

  mark("Appointment booking and status update", created.length >= 25 ? "WORKING" : "PARTIAL", {
    created: created.length,
    updatedAppointmentId: created[0]?.id || null,
  });
  return created;
}

async function seedHms(patients, doctors, departments, appointments) {
  const patient = patients[0];
  const doctor = doctors[0];
  const departmentId = departments[0]?.id || null;
  const appointment = appointments[0];
  const records = {};

  records.op = await post("/api/clinical/hms/op", {
    patient_id: patient.id,
    doctor_id: doctor.id,
    ...(departmentId ? { department_id: departmentId } : {}),
    appointment_id: appointment.id,
    chief_complaint: "Fever and fatigue",
    present_illness: "Two days of fever with body pains",
    drug_allergies: "None",
    follow_up_date: today(7),
    status: "COMPLETED",
  });
  records.ip = await post("/api/clinical/hms/ip", {
    patient_id: patient.id,
    consultant_id: doctor.id,
    ...(departmentId ? { department_id: departmentId } : {}),
    admission_reason: "Observation admission",
    diagnosis: "Viral fever",
    expected_discharge: today(2),
    status: "ADMITTED",
  });
  records.nursing = await post("/api/clinical/hms/nursing", {
    patient_id: patient.id,
    admission_id: records.ip.id,
    observation: "Vitals stable; oral fluids tolerated.",
    action_taken: "Medication administered as ordered.",
  });
  records.icu = await post("/api/clinical/hms/icu", {
    patient_id: patient.id,
    admission_id: records.ip.id,
    ventilator: false,
    oxygen: "Room air",
    ecg: "Normal sinus rhythm",
    bp: "120/80",
    pulse: "82",
    temperature: "98.6",
    urine_output: "Adequate",
    alert_level: "STABLE",
  });
  records.ot = await post("/api/clinical/hms/ot", {
    procedure_name: "UAT Minor Procedure",
    patient_id: patient.id,
    surgeon_id: doctor.id,
    anesthetist_id: doctor.id,
    scheduled_date: today(1),
    scheduled_time: "11:00",
    duration_minutes: 45,
    status: "SCHEDULED",
  });
  records.billing = await post("/api/clinical/hms/billing", {
    patient_id: patient.id,
    ...(departmentId ? { department_id: departmentId } : {}),
    subtotal: 2500,
    discount: 100,
    tax: 120,
    total: 2520,
    paid_amount: 1000,
    balance_amount: 1520,
    status: "PARTIAL",
  });
  records.insurance = await post("/api/clinical/hms/insurance", {
    patient_id: patient.id,
    invoice_id: records.billing.id,
    submission_date: today(),
    claimed_amount: 2520,
    approved_amount: 2000,
    rejected_amount: 520,
    status: "SUBMITTED",
  });

  await patch("/api/clinical/hms/ip", {
    id: records.ip.id,
    status: "DISCHARGE_PLANNED",
  });

  mark("HMS OP/IP/Nursing/ICU/OT/Billing/Insurance", "WORKING", {
    ids: Object.fromEntries(Object.entries(records).map(([key, value]) => [key, value.id])),
  });
  return records;
}

async function seedIvf(patients, doctors, departments) {
  const female = patients.find((patient) => String(patient.gender).toLowerCase() === "female") || patients[0];
  const male = patients.find((patient) => String(patient.gender).toLowerCase() === "male") || patients[1] || patients[0];
  const doctor = doctors.find((entry) => String(entry.specialization).toLowerCase().includes("ivf")) || doctors[0];
  const departmentId = departments.find((entry) => String(entry.department_name).toLowerCase().includes("ivf"))?.id || departments[0]?.id || 3;
  const records = {};

  records.couple = await post("/api/clinical/ivf/couples", {
    female_patient_id: female.id,
    male_patient_id: male.id,
    marriage_date: "2020-02-14",
    infertility_duration_months: 24,
    primary_infertility: true,
    female_name: `${female.first_name} ${female.last_name || ""}`.trim(),
    female_age: 31,
    female_blood_group: "O+",
    male_name: `${male.first_name} ${male.last_name || ""}`.trim(),
    male_age: 34,
    male_blood_group: "B+",
    referral_doctor: "UAT Referral Doctor",
    status: "ACTIVE",
  });
  records.femaleAssessment = await post("/api/clinical/ivf/female-assessment", {
    couple_id: records.couple.id,
    patient_id: female.id,
    assessment_date: today(),
    cycle_length: 28,
    amh: 2.8,
    right_ovary_afc: 8,
    left_ovary_afc: 7,
    clinical_summary: "UAT ovarian reserve assessment completed.",
    status: "COMPLETED",
  });
  records.maleAssessment = await post("/api/clinical/ivf/male-assessment", {
    couple_id: records.couple.id,
    patient_id: male.id,
    assessment_date: today(),
    volume: 2.5,
    sperm_count: 55,
    motility: 48,
    morphology: 5,
    clinical_summary: "UAT semen analysis completed.",
    status: "COMPLETED",
  });
  records.plan = await post("/api/clinical/ivf/treatment-plans", {
    couple_id: records.couple.id,
    treatment_type: "IVF",
    protocol_type: "Antagonist",
    doctor_id: doctor.id,
    ...(departmentId ? { department_id: departmentId } : {}),
    planned_start_date: today(1),
    planned_end_date: today(21),
    clinical_indication: "Tubal factor infertility",
    donor_required: false,
    surrogate_required: false,
    insurance_required: false,
    status: "APPROVED",
  });
  records.cycle = await post("/api/clinical/ivf/cycles", {
    couple_id: records.couple.id,
    treatment_plan_id: records.plan.id,
    cycle_type: "Fresh",
    protocol_type: "Antagonist",
    start_date: today(1),
    expected_retrieval_date: today(13),
    expected_transfer_date: today(18),
    doctor_id: doctor.id,
    embryologist_id: doctor.id,
    status: "ACTIVE",
  });
  records.stimulation = await post("/api/clinical/ivf/stimulation", {
    couple_id: records.couple.id,
    cycle_id: records.cycle.id,
    cycle_day: 5,
    monitoring_date: today(5),
    doctor_id: doctor.id,
    medication: "FSH",
    dose: "150 IU",
    duration: "5 days",
    notes: "Follicular response adequate.",
    status: "RECORDED",
  });
  records.retrieval = await post("/api/clinical/ivf/retrievals", {
    couple_id: records.couple.id,
    cycle_id: records.cycle.id,
    retrieval_date: today(13),
    doctor_id: doctor.id,
    anesthetist_id: doctor.id,
    procedure_duration_minutes: 35,
    follicles_aspirated: 12,
    oocytes_retrieved: 9,
    mii: 7,
    mi: 1,
    gv: 1,
    degenerated: 0,
    hospital_admission: false,
    status: "COMPLETED",
  });
  records.embryology = await post("/api/clinical/ivf/embryology", {
    couple_id: records.couple.id,
    cycle_id: records.cycle.id,
    retrieval_id: records.retrieval.id,
    method: "ICSI",
    oocytes_inseminated: 7,
    two_pn: 6,
    one_pn: 0,
    three_pn: 0,
    failed_fertilization: 1,
    embryologist_id: doctor.id,
    status: "RECORDED",
  });
  records.transfer = await post("/api/clinical/ivf/transfers", {
    couple_id: records.couple.id,
    cycle_id: records.cycle.id,
    transfer_date: today(18),
    doctor_id: doctor.id,
    embryos_transferred: 1,
    transfer_day: "Day 5",
    catheter_type: "Soft",
    luteal_support: "Progesterone",
    status: "COMPLETED",
  });

  mark("IVF couple-to-transfer workflow", "WORKING", {
    ids: Object.fromEntries(Object.entries(records).map(([key, value]) => [key, value.id])),
  });
  return records;
}

async function seedPharmacy(patients, doctors) {
  const patient = patients[0];
  const doctor = doctors[0];
  const records = {};

  records.category = await post("/api/clinical/pharmacy/categories", {
    category_name: "UAT17 Antibiotics",
    category_type: "Drug",
    restrictions: "Clinical review required.",
    status: "ACTIVE",
  });
  records.vendor = await post("/api/clinical/pharmacy/vendors", {
    vendor_name: "UAT17 Pharma Vendor",
    gst_number: "37UAT170001Z1",
    drug_license_number: "DL-UAT17",
    address: "UAT Vendor Address",
    contact_person: "Vendor Contact",
    mobile: "9888800001",
    email: "vendor-uat17@clinical.test",
    payment_terms: "30 days",
    credit_limit: 500000,
    rating: 4,
    status: "ACTIVE",
  });
  records.medicine = await post("/api/clinical/pharmacy/medicines", {
    generic_name: "Paracetamol",
    brand_name: "UAT17 ParaGold",
    strength: "500mg",
    form: "Tablet",
    manufacturer: "UAT Pharma",
    category_id: records.category.id,
    hsn_code: "300490",
    controlled_drug: false,
    narcotic: false,
    storage_condition: "Room temperature",
    shelf_life_days: 730,
    reorder_level: 100,
    maximum_level: 1000,
    minimum_level: 50,
    status: "ACTIVE",
  });
  records.warehouse = await post("/api/clinical/pharmacy/warehouses", {
    warehouse_name: "UAT17 Main Pharmacy",
    pharmacy_type: "Main",
    location: "Ground Floor",
    capacity: 10000,
    status: "ACTIVE",
  });
  records.po = await post("/api/clinical/pharmacy/purchase-orders", {
    vendor_id: records.vendor.id,
    po_date: today(),
    expected_delivery: today(3),
    remarks: "UAT purchase order",
    subtotal: 10000,
    tax: 1200,
    discount: 500,
    net_amount: 10700,
    status: "APPROVED",
  });
  records.inventory = await post("/api/clinical/pharmacy/inventory", {
    warehouse_id: records.warehouse.id,
    medicine_id: records.medicine.id,
    current_quantity: 500,
    reserved_quantity: 20,
    available_quantity: 480,
    unit_cost: 2.5,
    selling_price: 5,
    expiry_date: "2028-12-31",
    inventory_status: "AVAILABLE",
  });
  records.sale = await post("/api/clinical/pharmacy/sales", {
    patient_id: patient.id,
    doctor_id: doctor.id,
    prescription_number: "RX-UAT17-001",
    sale_date: today(),
    payment_mode: "CASH",
    subtotal: 250,
    discount: 0,
    tax: 12,
    total: 262,
    paid_amount: 262,
    status: "PAID",
  });

  mark("Pharmacy purchase, inventory, and sale workflow", "WORKING", {
    ids: Object.fromEntries(Object.entries(records).map(([key, value]) => [key, value.id])),
  });
  return records;
}

async function seedFinance(patients, doctors, departments) {
  const patient = patients[0];
  const doctor = doctors[0];
  const departmentId = departments[0]?.id || null;
  const records = {};

  records.coa = await post("/api/clinical/finance/coa", {
    account_name: "UAT17 Patient Revenue",
    account_type: "Revenue",
    is_system_account: false,
    status: "ACTIVE",
  });
  records.costCenter = await post("/api/clinical/finance/cost-centers", {
    cost_center_name: "UAT17 OPD",
    ...(departmentId ? { department_id: departmentId } : {}),
    budget: 1000000,
    status: "ACTIVE",
  });
  records.gl = await post("/api/clinical/finance/gl", {
    journal_date: today(),
    reference: "UAT17-GL-001",
    description: "UAT journal entry",
    total_debit: 5000,
    total_credit: 5000,
    status: "POSTED",
  });
  records.ar = await post("/api/clinical/finance/ar", {
    customer_type: "PATIENT",
    patient_id: patient.id,
    doctor_id: doctor.id,
    ...(departmentId ? { department_id: departmentId } : {}),
    invoice_date: today(),
    due_date: today(15),
    gross_amount: 5000,
    discount_amount: 250,
    tax_amount: 225,
    paid_amount: 2000,
    outstanding_amount: 2975,
    collection_status: "PARTIAL",
    status: "OPEN",
  });
  records.cash = await post("/api/clinical/finance/cash", {
    transaction_date: today(),
    transaction_type: "RECEIPT",
    amount: 2000,
    reference: "UAT17-RECEIPT-001",
    remarks: "Patient payment",
    status: "POSTED",
  });
  records.referral = await post("/api/clinical/finance/referrals", {
    referral_type: "DOCTOR",
    doctor_id: doctor.id,
    name: "UAT17 Referral Partner",
    mobile: "9777700001",
    email: "referral-uat17@clinical.test",
    address: "UAT referral partner address",
    agreement_date: today(),
    status: "ACTIVE",
  });

  mark("Finance CoA/GL/AR/Cash/Referral workflow", "WORKING", {
    ids: Object.fromEntries(Object.entries(records).map(([key, value]) => [key, value.id])),
  });
  return records;
}

async function seedInterop(patients, doctors) {
  const patient = patients[0];
  const doctor = doctors[0];
  const fhirPatient = await post("/api/clinical/interoperability/fhir/Patient", {
    id: `Patient-UAT17-${patient.id}`,
    patient_id: patient.id,
    status: "active",
    name: [{ text: `${patient.first_name} ${patient.last_name || ""}`.trim() }],
    telecom: [{ system: "phone", value: patient.phone || "9000000000" }],
  });
  const fhirPractitioner = await post("/api/clinical/interoperability/fhir/Practitioner", {
    id: `Practitioner-UAT17-${doctor.id}`,
    practitioner_id: doctor.id,
    status: "active",
    name: [{ text: doctor.full_name }],
  });
  const observation = await post("/api/clinical/interoperability/fhir/Observation", {
    id: `Observation-UAT17-${Date.now()}`,
    patient_id: patient.id,
    practitioner_id: doctor.id,
    status: "final",
    subject: { reference: String(patient.id) },
    performer: [{ reference: String(doctor.id) }],
    valueString: "UAT observation completed",
  });
  const hl7 = await post("/api/clinical/interoperability/hl7", {
    message_type: "ADT^A01",
    direction: "INBOUND",
    sending_application: "UAT-HIS",
    receiving_application: "TOTTECH-CS",
    patient_id: patient.id,
    raw_message: "MSH|^~\\\\&|UAT-HIS|UAT|TOTTECH-CS|TOTTECH|202606071700||ADT^A01|UAT17|P|2.5",
    parsed_payload: { messageType: "ADT_A01", patientId: patient.id },
    processing_status: "PROCESSED",
    retry_count: 0,
  });
  const pacs = await post("/api/clinical/interoperability/pacs-studies", {
    study_instance_uid: `1.2.356.uat17.${Date.now()}`,
    patient_id: patient.id,
    accession_number: `ACC-UAT17-${Date.now()}`,
    modality: "US",
    study_date: today(),
    study_description: "UAT ultrasound study metadata",
    storage_status: "STORED",
    image_count: 12,
    payload: { dicom: true, uat: "phase17" },
  });

  mark("Interop FHIR/HL7/PACS workflow", "WORKING", {
    fhirPatient: fhirPatient.id,
    fhirPractitioner: fhirPractitioner.id,
    observation: observation.id,
    hl7: hl7.id,
    pacs: pacs.id,
  });
}

async function seedAnalytics() {
  const dashboardMetric = await post("/api/clinical/analytics/ceo-dashboard", {
    module_key: "clinical",
    record_key: "uat17-ceo",
    record_name: "UAT17 Clinical Workflow Readiness",
    metric_category: "UAT",
    metric_date: today(),
    metric_value: 82,
    target_value: 95,
    variance_value: -13,
    amount: 0,
    status: "ACTIVE",
    payload: { evidence: "phase17" },
  });
  const insight = await post("/api/clinical/analytics/ai-insights", {
    insight_type: "WORKFLOW_RISK",
    module_key: "clinical",
    severity: "HIGH",
    title: "UAT workflow hardening required",
    summary: "Clinical Services has executable workflow foundations but still lacks complete go-live certification.",
    recommendation: "Complete RBAC enforcement, mobile APK pipeline, and performance tests before production rollout.",
    source_payload: { report: "CLINICAL_FUNCTIONAL_AUDIT_REPORT.md" },
    confidence_score: 90,
    clinical_review_required: true,
    status: "OPEN",
  });

  mark("Analytics KPI and AI insight workflow", "WORKING", {
    dashboardMetric: dashboardMetric.id,
    insight: insight.id,
  });
}

async function validateApis() {
  const dashboard = await api("/api/clinical/dashboard");
  const patients = await api("/api/clinical/patients?q=UAT17");
  const doctors = await api("/api/clinical/doctors?q=UAT17");
  const patient360 = await api(`/api/clinical/patients/${patients.patients[0].id}`);
  const hmsOp = await api("/api/clinical/hms/op");
  const ivfCouples = await api("/api/clinical/ivf/couples");
  const pharmacyMeds = await api("/api/clinical/pharmacy/medicines");
  const financeAr = await api("/api/clinical/finance/ar");
  const fhirPatients = await api("/api/clinical/interoperability/fhir/Patient");

  mark("Dashboard API dynamic metrics", dashboard.metrics?.patients_registered_today !== undefined ? "WORKING" : "BROKEN", dashboard.metrics || {});
  mark("Patient 360 API", patient360.patient && patient360.appointments ? "WORKING" : "BROKEN", {
    appointments: patient360.appointments?.length || 0,
    medicalRecords: patient360.medicalRecords?.length || 0,
    ivfCases: patient360.ivfCases?.length || 0,
    audit: patient360.audit?.length || 0,
  });
  mark("API read validation", "WORKING", {
    patients: patients.patients?.length || 0,
    doctors: doctors.doctors?.length || 0,
    hmsOp: hmsOp.rows?.length || 0,
    ivfCouples: ivfCouples.rows?.length || 0,
    pharmacyMeds: pharmacyMeds.rows?.length || 0,
    financeAr: financeAr.rows?.length || 0,
    fhirPatients: fhirPatients.total || 0,
  });
}

async function main() {
  const context = await api("/api/clinical/context");
  mark("Clinical context", context.context?.roleKey === "clinical_super_admin" ? "WORKING" : "BROKEN", {
    tenantId: context.context?.tenantId,
    hospitalId: context.context?.hospitalId,
    branchId: context.context?.branchId,
    clinicId: context.context?.clinicId,
    roleKey: context.context?.roleKey,
  });

  const patients = await seedPatients();
  const { doctors, departments } = await seedDoctors();
  const appointments = await seedAppointments(patients, doctors, departments);
  await seedHms(patients, doctors, departments, appointments);
  await seedIvf(patients, doctors, departments);
  await seedPharmacy(patients, doctors);
  await seedFinance(patients, doctors, departments);
  await seedInterop(patients, doctors);
  await seedAnalytics();
  await validateApis();

  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    baseUrl,
    evidence,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    generatedAt: new Date().toISOString(),
    error: error.message,
    evidence,
  }, null, 2));
  process.exit(1);
});
