import fs from "fs";
import path from "path";
import process from "process";

import bcrypt from "bcryptjs";
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

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
const runKey = new Date().toISOString().replace(/\D/g, "").slice(0, 12);
const shortKey = runKey.slice(4);
const password = "ClinicalUAT@2026";
const passwordHash = await bcrypt.hash(password, 10);
const reportPath = path.join(root, "PROFESSIONAL_DEMO_HOSPITAL_REPORT.md");

const firstNames = [
  "Aarav", "Ananya", "Vihaan", "Diya", "Sai", "Ishaan", "Meera", "Arjun", "Kavya", "Rohan",
  "Nitya", "Aditya", "Saanvi", "Karthik", "Aditi", "Reyansh", "Ira", "Varun", "Lakshmi", "Rahul",
];
const lastNames = ["Rao", "Reddy", "Sharma", "Naidu", "Kumar", "Devi", "Prasad", "Varma", "Chowdary", "Menon"];
const departments = [
  ["General Medicine", "GEN"],
  ["Cardiology", "CARD"],
  ["Gynecology", "GYN"],
  ["IVF & Fertility", "IVF"],
  ["Pediatrics", "PED"],
  ["Orthopedics", "ORTH"],
  ["Emergency", "ER"],
  ["ICU", "ICU"],
  ["Laboratory", "LAB"],
  ["Radiology", "RAD"],
  ["Pharmacy", "PHARM"],
  ["Finance", "FIN"],
];
const specializations = [
  "General Physician",
  "Cardiologist",
  "Gynecologist",
  "IVF Specialist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Emergency Physician",
  "Intensivist",
  "Radiologist",
  "Clinical Pathologist",
];
const labTests = [
  ["Complete Blood Count", "Hematology", "cells/cumm", "11-16 g/dL", 450],
  ["Fasting Blood Sugar", "Biochemistry", "mg/dL", "70-100", 220],
  ["Liver Function Test", "Biochemistry", "U/L", "Normal", 900],
  ["Renal Function Test", "Biochemistry", "mg/dL", "Normal", 850],
  ["Thyroid Profile", "Endocrinology", "mIU/L", "0.4-4.0", 650],
  ["Serum Beta HCG", "IVF", "mIU/mL", "Clinical correlation", 700],
  ["AMH", "IVF", "ng/mL", "1.0-4.0", 1400],
  ["Vitamin D", "Biochemistry", "ng/mL", "30-100", 1100],
  ["Urine Routine", "Pathology", "-", "Normal", 250],
  ["CRP", "Immunology", "mg/L", "<5", 550],
];
const medicineNames = [
  "Paracetamol", "Amoxicillin", "Azithromycin", "Pantoprazole", "Metformin", "Amlodipine", "Atorvastatin", "Levothyroxine",
  "Doxycycline", "Cefixime", "Ondansetron", "Cetirizine", "Montelukast", "Salbutamol", "Insulin Glargine", "Folic Acid",
  "Progesterone", "Estradiol", "Letrozole", "Clomiphene", "Duphaston", "Calcium D3", "Iron Sucrose", "Rabeprazole",
  "Diclofenac", "Ibuprofen", "Losartan", "Telmisartan", "Hydroxyprogesterone", "Menotropin",
];

let uidCounter = 0;
const uid = (prefix, index = "") => {
  uidCounter += 1;
  return `${prefix}-${shortKey}${index ? `-${index}` : ""}-${String(uidCounter).padStart(5, "0")}`;
};
const pick = (items, index) => items[index % items.length];
const dateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

async function one(sql, values = []) {
  const result = await client.query(sql, values);
  return result.rows[0];
}

async function many(sql, values = []) {
  const result = await client.query(sql, values);
  return result.rows;
}

async function createUser(email, name, role) {
  return one(
    `
    INSERT INTO users (full_name,email,password_hash,role,is_active,created_at)
    VALUES ($1,$2,$3,$4,true,CURRENT_TIMESTAMP)
    ON CONFLICT (email) DO UPDATE SET full_name=EXCLUDED.full_name, password_hash=EXCLUDED.password_hash, role=EXCLUDED.role, is_active=true
    RETURNING *
    `,
    [name, email, passwordHash, role]
  );
}

async function timeline(scope, patientId, eventType, source, sourceId, title, description) {
  await client.query(
    `
    INSERT INTO patient_timeline_events (
      tenant_id,hospital_id,branch_id,patient_id,event_type,event_source,source_record_id,title,description,event_datetime,created_by,created_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP,$10,CURRENT_TIMESTAMP,false)
    ON CONFLICT DO NOTHING
    `,
    [scope.tenantId, scope.hospitalId, scope.branchId, patientId, eventType, source, sourceId, title, description, scope.userId]
  );
}

async function invoice(scope, patientId, departmentId, sourceModule, sourceRecordId, itemName, amount) {
  const created = await one(
    `
    INSERT INTO billing_invoices (
      tenant_id,hospital_id,branch_id,clinic_id,invoice_number,patient_id,department_id,invoice_date,subtotal,discount,tax,total,paid_amount,balance_amount,balance,status,invoice_type,source_module,source_record_id,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE,$8,0,0,$8,0,$8,$8,'OPEN','PATIENT',$9,$10,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [scope.tenantId, scope.hospitalId, scope.branchId, scope.clinicId, uid("INV"), patientId, departmentId, amount, sourceModule, sourceRecordId, scope.userId]
  );
  await one(
    `
    INSERT INTO billing_invoice_items (
      tenant_id,hospital_id,branch_id,clinic_id,invoice_id,item_type,item_reference_id,item_name,item_description,quantity,rate,discount,tax,amount,total,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8::varchar,$8::text,1,$9,0,0,$9,$9,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING id
    `,
    [scope.tenantId, scope.hospitalId, scope.branchId, scope.clinicId, created.id, sourceModule.toUpperCase(), sourceRecordId, itemName, amount, scope.userId]
  );
  return created;
}

async function payment(scope, patientId, invoiceId, amount, mode = "UPI") {
  const created = await one(
    `
    INSERT INTO payments (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,invoice_id,payment_number,receipt_number,payment_date,payment_mode,payment_method,amount,reference_number,remarks,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE,$9,$9,$10,$11,'Professional demo payment',$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [scope.tenantId, scope.hospitalId, scope.branchId, scope.clinicId, patientId, invoiceId, uid("PAY"), uid("RCPT"), mode, amount, uid("REF"), scope.userId]
  );
  await client.query(
    `
    UPDATE billing_invoices
    SET paid_amount=COALESCE(paid_amount,0)+$2,
        balance_amount=GREATEST(COALESCE(total,0)-COALESCE(paid_amount,0)-$2,0),
        balance=GREATEST(COALESCE(total,0)-COALESCE(paid_amount,0)-$2,0),
        status=CASE WHEN GREATEST(COALESCE(total,0)-COALESCE(paid_amount,0)-$2,0)<=0 THEN 'PAID' ELSE 'PARTIAL' END,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
    `,
    [invoiceId, amount]
  );
  return created;
}

async function main() {
  await client.connect();
  await client.query("BEGIN");

  const tenant = await one(
    `
    INSERT INTO clinical_tenants (tenant_name,tenant_code,subscription_plan,subscription_status,deployment_model,hosting_provider,data_region,settings,created_at,updated_at,is_deleted)
    VALUES ('TOTTECH Multi-Speciality Hospital',$1,'ENTERPRISE','ACTIVE','MULTI_TENANT_SAAS','Contabo','India',$2::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [`TMSH-${shortKey}`, JSON.stringify({ demoTenant: true, version: "1.0", maxBranches: 25 })]
  );
  const branding = { logoUrl: "/images/logo.png", primaryColor: "#04142E", accentColor: "#D4AF37", name: "TOTTECH Multi-Speciality Hospital" };
  const hospital = await one(
    `
    INSERT INTO hospitals (tenant_id,hospital_name,hospital_code,legal_name,license_number,nabh_details,gst_number,email,phone,address,city,state,country,status,branding,settings,created_at,updated_at,is_deleted)
    VALUES ($1,'TOTTECH Multi-Speciality Hospital',$2,'TOTTECH Multi-Speciality Hospital Pvt Ltd','TMSH-NABH-DEMO',$3::jsonb,'37ABCDE1234F1Z5','demo@tottechclinical.local','9100001000','Health City Road, Vijayawada','Vijayawada','Andhra Pradesh','India','ACTIVE',$4::jsonb,$5::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [tenant.id, `TMSH-${shortKey}`, JSON.stringify({ status: "Demo Ready", accreditation: "NABH-aligned workflows" }), JSON.stringify(branding), JSON.stringify({ subscription: "Enterprise SaaS", status: "ACTIVE" })]
  );
  const branch = await one(
    `
    INSERT INTO branches (tenant_id,hospital_id,branch_name,branch_code,branch_type,contact_name,email,phone,address,city,state,country,latitude,longitude,status,branding,settings,created_at,updated_at,is_deleted)
    VALUES ($1,$2,'Vijayawada Main Branch',$3,'MULTI_SPECIALITY','Hospital Admin','main@tottechclinical.local','9100001001','Health City Road','Vijayawada','Andhra Pradesh','India',16.5062,80.6480,'ACTIVE',$4::jsonb,'{}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [tenant.id, hospital.id, `VJA-${shortKey}`, JSON.stringify(branding)]
  );
  const organization = await one(
    `
    INSERT INTO organizations (tenant_id,organization_name,organization_code,legal_name,email,phone,address,branding,settings,hospital_id,branch_id,created_at,updated_at,is_deleted)
    VALUES ($1,'TOTTECH Multi-Speciality Hospital',$2,'TOTTECH Multi-Speciality Hospital Pvt Ltd','org@tottechclinical.local','9100001002','Health City Road',$3::jsonb,'{}'::jsonb,$4,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [tenant.id, `ORG-TMSH-${shortKey}`, JSON.stringify(branding), hospital.id, branch.id]
  );
  const clinic = await one(
    `
    INSERT INTO clinics (tenant_id,clinic_id,organization_id,clinic_name,clinic_code,clinic_type,email,phone,address,city,state,country,branding,settings,hospital_id,branch_id,created_at,updated_at,is_deleted)
    VALUES ($1,$2,$3,'TOTTECH Clinical Services OPD',$4,'MULTI_SPECIALITY','clinic@tottechclinical.local','9100001003','Health City Road','Vijayawada','Andhra Pradesh','India',$5::jsonb,'{}'::jsonb,$6,$7,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [tenant.id, Number(shortKey), organization.id, `CLN-TMSH-${shortKey}`, JSON.stringify(branding), hospital.id, branch.id]
  );

  const roleSpecs = [
    ["Receptionist", "RECEPTIONIST", "uat.receptionist@tottechclinical.local"],
    ["Doctor", "DOCTOR", "uat.doctor@tottechclinical.local"],
    ["Nurse", "NURSE", "uat.nurse@tottechclinical.local"],
    ["Lab Technician", "LAB_TECHNICIAN", "uat.lab@tottechclinical.local"],
    ["Pharmacist", "PHARMACIST", "uat.pharmacist@tottechclinical.local"],
    ["Hospital Admin", "HOSPITAL_ADMIN", "uat.hospital.admin@tottechclinical.local"],
    ["Finance User", "FINANCE_USER", "uat.finance@tottechclinical.local"],
    ["CEO", "CEO", "uat.ceo@tottechclinical.local"],
    ["CFO", "CFO", "uat.cfo@tottechclinical.local"],
    ["CIO", "CIO", "uat.cio@tottechclinical.local"],
  ];
  const users = {};
  const clinicalRoles = {};
  for (const [name, key, email] of roleSpecs) {
    clinicalRoles[key] = await one(
      `
      INSERT INTO clinical_roles (tenant_id,hospital_id,branch_id,clinic_id,role_name,role_key,permissions,field_permissions,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,'{}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (tenant_id,clinic_id,role_key) DO UPDATE SET role_name=EXCLUDED.role_name, permissions=EXCLUDED.permissions, updated_at=CURRENT_TIMESTAMP
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, name, key, JSON.stringify({ clinical: true, demoUat: true, role: key })]
    );
    users[key] = await createUser(email, name, key);
    await one(
      `
      INSERT INTO clinical_user_profiles (tenant_id,hospital_id,branch_id,clinic_id,user_id,clinical_role_id,project_type,display_name,settings,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,'CLINICAL',$7,$8::jsonb,$5,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (user_id,tenant_id,clinic_id) DO UPDATE SET hospital_id=EXCLUDED.hospital_id, branch_id=EXCLUDED.branch_id, clinical_role_id=EXCLUDED.clinical_role_id, display_name=EXCLUDED.display_name, updated_at=CURRENT_TIMESTAMP, is_deleted=false
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, users[key].id, clinicalRoles[key].id, name, JSON.stringify({ demoTenantId: tenant.id, dailyTaskOwner: key })]
    );
  }

  const scope = { tenantId: tenant.id, hospitalId: hospital.id, branchId: branch.id, clinicId: clinic.id, userId: users.HOSPITAL_ADMIN.id };

  const departmentRows = [];
  for (const [name, code] of departments) {
    departmentRows.push(
      await one(
        `
        INSERT INTO departments (tenant_id,hospital_id,branch_id,clinic_id,organization_id,department_name,department_code,department_type,created_by,updated_by,created_at,updated_at,is_deleted)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,
        [tenant.id, hospital.id, branch.id, clinic.id, organization.id, name, `${code}-${shortKey}`, name.toUpperCase().replace(/[^A-Z]+/g, "_"), users.HOSPITAL_ADMIN.id]
      )
    );
  }
  const departmentByCode = Object.fromEntries(departmentRows.map((row) => [row.department_code.split("-")[0], row]));

  const doctors = [];
  for (let index = 0; index < 20; index += 1) {
    const user = await createUser(`doctor.${shortKey}.${index + 1}@tottechclinical.local`, `Dr ${pick(firstNames, index)} ${pick(lastNames, index)}`, "DOCTOR");
    const department = departmentRows[index % 10];
    const doctor = await one(
      `
      INSERT INTO doctors (
        tenant_id,hospital_id,branch_id,clinic_id,user_id,doctor_uid,doctor_code,full_name,specialization,department_id,phone,email,consultation_fee,availability,status,qualification,registration_number,experience_years,designation,signature_url,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,'AVAILABLE',$15,$16,$17,$18,$19,$20,$20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [
        tenant.id, hospital.id, branch.id, clinic.id, user.id, uid("DOC", index + 1), `DOC-${shortKey}-${index + 1}`,
        `Dr ${pick(firstNames, index)} ${pick(lastNames, index)}`, pick(specializations, index), department.id, `91${String(7000000000 + index)}`,
        `doctor.${shortKey}.${index + 1}@tottechclinical.local`, 600 + (index % 6) * 150,
        JSON.stringify({ mon_fri: "09:00-17:00", saturday: "09:00-13:00" }), index % 3 === 0 ? "MD" : "MBBS, DNB",
        `APMC-${shortKey}-${index + 1}`, 4 + (index % 16), index % 3 === 0 ? "Consultant" : "Senior Consultant", "/images/logo.png", users.HOSPITAL_ADMIN.id,
      ]
    );
    doctors.push(doctor);
  }

  const patients = [];
  for (let index = 0; index < 100; index += 1) {
    const first = pick(firstNames, index);
    const last = pick(lastNames, index + 3);
    const patient = await one(
      `
      INSERT INTO patients (
        tenant_id,hospital_id,branch_id,clinic_id,patient_uid,uhid,first_name,last_name,gender,date_of_birth,age_years,phone,email,address,blood_group,emergency_contact_name,emergency_contact_phone,insurance_provider,insurance_number,status,metadata,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'ACTIVE',$20::jsonb,$21,$21,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [
        tenant.id, hospital.id, branch.id, clinic.id, uid("PAT", index + 1), `TMSH-${shortKey}-${String(index + 1).padStart(4, "0")}`,
        first, last, index % 2 === 0 ? "Male" : "Female", `${1975 + (index % 28)}-${String((index % 12) + 1).padStart(2, "0")}-15`,
        22 + (index % 45), `98${String(10000000 + index).padStart(8, "0")}`, `patient.${shortKey}.${index + 1}@demo.local`,
        `${index + 1}, Health Colony, Vijayawada`, pick(["O+", "A+", "B+", "AB+", "O-"], index), `${pick(firstNames, index + 2)} ${last}`, `97${String(10000000 + index).padStart(8, "0")}`,
        index % 4 === 0 ? "Star Health" : null, index % 4 === 0 ? `POL-${shortKey}-${index + 1}` : null,
        JSON.stringify({ source: "professional-demo", riskProfile: index % 5 === 0 ? "Chronic care follow-up" : "Routine care" }), users.RECEPTIONIST.id,
      ]
    );
    patients.push(patient);
    await timeline(scope, patient.id, "PATIENT_REGISTERED", "patients", patient.id, "Patient registered", `${patient.first_name} ${patient.last_name} registered with UHID ${patient.uhid}`);
  }

  const tests = [];
  for (let index = 0; index < labTests.length; index += 1) {
    const [name, category, unit, range, cost] = labTests[index];
    tests.push(await one(
      `
      INSERT INTO clinical_lab_test_master (tenant_id,hospital_id,branch_id,clinic_id,lab_test_name,test_name,test_code,category,department,unit,normal_value,reference_range,cost,price,status,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5::varchar,$5::varchar,$6,$7,'Laboratory',$8,$9::varchar,$9::text,$10,$10,'ACTIVE',$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, name, `LAB-${shortKey}-${index + 1}`, category, unit, range, cost, users.HOSPITAL_ADMIN.id]
    ));
  }

  const medicines = [];
  for (let index = 0; index < 100; index += 1) {
    const base = pick(medicineNames, index);
    const medicine = await one(
      `
      INSERT INTO clinical_medicine_master (tenant_id,hospital_id,branch_id,clinic_id,medicine_name,generic_name,brand_name,medicine_type,strength,unit,selling_price,stock_quantity,reorder_level,expiry_date,status,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'strip',$10,$11,20,$12,'ACTIVE',$13,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [
        tenant.id, hospital.id, branch.id, clinic.id, `${base} ${index % 5 === 0 ? "Plus" : ""}`.trim(), base, `TOT-${base.replace(/\s+/g, "").slice(0, 8)}-${index + 1}`,
        index % 4 === 0 ? "Injection" : index % 3 === 0 ? "Syrup" : "Tablet", `${50 + (index % 9) * 25}mg`, 30 + (index % 12) * 8,
        100 + (index % 20) * 15, dateOffset(180 + index), users.PHARMACIST.id,
      ]
    );
    medicines.push(medicine);
    await one(
      `
      INSERT INTO pharmacy_stock (tenant_id,hospital_id,branch_id,clinic_id,medicine_id,stock_uid,quantity,status,priority,notes,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'STOCK','NORMAL','Professional demo opening stock',$8,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, medicine.id, uid("STK", index + 1), 100 + (index % 20) * 15, users.PHARMACIST.id]
    );
  }

  const appointments = [];
  const consultations = [];
  for (let index = 0; index < 50; index += 1) {
    const patient = patients[index];
    const doctor = doctors[index % doctors.length];
    const department = departmentRows[index % departmentRows.length];
    const appointment = await one(
      `
      INSERT INTO appointments (tenant_id,hospital_id,branch_id,clinic_id,patient_id,doctor_id,department_id,appointment_uid,appointment_date,start_time,end_time,appointment_type,status,token_number,queue_status,reason,notes,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::time,$11::time,'OPD',$12,$13,$14,$15,'Professional demo appointment',$16,$16,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [
        tenant.id, hospital.id, branch.id, clinic.id, patient.id, doctor.id, department.id, uid("APT", index + 1), dateOffset(index % 7),
        `${String(9 + (index % 8)).padStart(2, "0")}:00`, `${String(9 + (index % 8)).padStart(2, "0")}:30`,
        index % 6 === 0 ? "IN_PROGRESS" : "COMPLETED", `T-${index + 1}`, index % 6 === 0 ? "CHECKED_IN" : "COMPLETED", index % 4 === 0 ? "Review consultation" : "New consultation", users.RECEPTIONIST.id,
      ]
    );
    appointments.push(appointment);
    await timeline(scope, patient.id, "APPOINTMENT_BOOKED", "appointments", appointment.id, "Appointment booked", `Appointment booked with ${doctor.full_name}`);
    const inv = await invoice(scope, patient.id, department.id, "appointment", appointment.id, "OP consultation fee", Number(doctor.consultation_fee || 600));
    await payment(scope, patient.id, inv.id, Number(inv.total), index % 3 === 0 ? "CARD" : "UPI");
    await timeline(scope, patient.id, "PAYMENT_RECEIVED", "payments", inv.id, "Consultation fee collected", `Invoice ${inv.invoice_number} paid`);

    const consultation = await one(
      `
      INSERT INTO consultations (tenant_id,hospital_id,branch_id,clinic_id,patient_id,doctor_id,consultation_uid,consultation_date,status,chief_complaint,symptoms,diagnosis_summary,clinical_notes,follow_up_date,priority,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP,'SIGNED',$8,$9,$10,$11,$12,'NORMAL',$13,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [
        tenant.id, hospital.id, branch.id, clinic.id, patient.id, doctor.id, uid("CON", index + 1),
        index % 3 === 0 ? "Fever and fatigue" : index % 3 === 1 ? "Routine follow-up" : "Abdominal discomfort",
        index % 3 === 0 ? "Fever, myalgia" : "Stable symptoms", index % 3 === 0 ? "Viral syndrome" : "Clinical follow-up",
        "Reviewed history, vitals, and prior records. Treatment plan explained.", dateOffset(7 + (index % 10)), users.DOCTOR.id,
      ]
    );
    consultations.push(consultation);
    await timeline(scope, patient.id, "CONSULTATION_COMPLETED", "consultations", consultation.id, "Doctor consultation completed", `${doctor.full_name} completed consultation`);
    const medicine = medicines[index % medicines.length];
    await one(
      `
      INSERT INTO consultation_prescriptions (tenant_id,hospital_id,branch_id,consultation_id,medicine_id,medicine_name,dose,frequency,duration,instructions,created_by,created_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [
        tenant.id,
        hospital.id,
        branch.id,
        consultation.id,
        medicine.id,
        medicine.medicine_name,
        "1 tablet",
        "Twice daily",
        "5 days",
        "After food. Follow doctor advice.",
        users.DOCTOR.id,
      ]
    );
  }

  const labOrders = [];
  for (let index = 0; index < 30; index += 1) {
    const patient = patients[index];
    const doctor = doctors[index % doctors.length];
    const test = tests[index % tests.length];
    const consultation = consultations[index % consultations.length];
    await one(
      `
      INSERT INTO consultation_lab_orders (tenant_id,hospital_id,branch_id,consultation_id,lab_test_id,order_notes,status,created_by,created_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,'Ordered during professional demo consultation','ORDERED',$6,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, consultation.id, test.id, users.DOCTOR.id]
    );
    const labOrder = await one(
      `
      INSERT INTO lab_orders (tenant_id,hospital_id,branch_id,clinic_id,patient_id,doctor_id,lab_test_id,order_uid,order_type,priority,status,ordered_at,notes,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'OPD','NORMAL','COMPLETED',CURRENT_TIMESTAMP,'Professional demo lab order',$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, patient.id, doctor.id, test.id, uid("LAB", index + 1), users.LAB_TECHNICIAN.id]
    );
    labOrders.push(labOrder);
    await one(
      `
      INSERT INTO lab_samples (tenant_id,hospital_id,branch_id,lab_order_id,sample_number,sample_type,collection_time,collected_by,status,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,'COLLECTED',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, labOrder.id, uid("SMP", index + 1), index % 2 === 0 ? "Blood" : "Urine", users.LAB_TECHNICIAN.id]
    );
    await one(
      `
      INSERT INTO lab_results (tenant_id,hospital_id,branch_id,clinic_id,lab_order_id,patient_id,result_uid,result_status,result_data,interpretation,validated_by,validated_at,created_by,updated_by,created_at,updated_at,is_deleted,result_value,critical_value,entered_by,entered_at,status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'APPROVED',$8::jsonb,$9,$10,CURRENT_TIMESTAMP,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false,$11,false,$10,CURRENT_TIMESTAMP,'COMPLETED')
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, labOrder.id, patient.id, uid("RES", index + 1), JSON.stringify({ test: test.lab_test_name, value: index % 5 === 0 ? "Borderline" : "Within normal limits", unit: test.unit }), "Reviewed and approved by lab.", users.LAB_TECHNICIAN.id, index % 5 === 0 ? "Borderline" : "Normal"]
    );
    const inv = await invoice(scope, patient.id, departmentByCode.LAB.id, "lab", labOrder.id, test.lab_test_name, Number(test.cost || test.price || 500));
    await payment(scope, patient.id, inv.id, Number(inv.total), "UPI");
    await timeline(scope, patient.id, "LAB_RESULT_READY", "lab_orders", labOrder.id, "Lab report ready", `${test.lab_test_name} completed and approved`);
  }

  for (let index = 0; index < 20; index += 1) {
    const patient = patients[30 + index];
    const consultation = consultations[index % consultations.length];
    const radiology = await one(
      `
      INSERT INTO consultation_radiology_orders (tenant_id,hospital_id,branch_id,consultation_id,patient_id,modality,study_name,scheduled_date,technician,findings,impression,approved_by,status,created_by,updated_by,created_at,updated_at,is_deleted,order_uid,priority)
      VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE,'Rad Tech Demo',$8,$9,'Dr Radiologist','APPROVED',$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false,$11,'NORMAL')
      RETURNING *
      `,
      [
        tenant.id, hospital.id, branch.id, consultation.id, patient.id, index % 2 === 0 ? "X-Ray" : "Ultrasound",
        index % 2 === 0 ? "Chest PA View" : "Abdomen and Pelvis", "No acute abnormality detected.", "Clinical correlation advised.",
        users.DOCTOR.id, uid("RAD", index + 1),
      ]
    );
    const inv = await invoice(scope, patient.id, departmentByCode.RAD.id, "radiology", radiology.id, radiology.study_name, index % 2 === 0 ? 800 : 1500);
    await payment(scope, patient.id, inv.id, Number(inv.total), "CARD");
    await timeline(scope, patient.id, "RADIOLOGY_REPORT_READY", "consultation_radiology_orders", radiology.id, "Radiology report ready", `${radiology.study_name} approved`);
  }

  for (let index = 0; index < 8; index += 1) {
    const patient = patients[60 + index];
    const admission = await one(
      `
      INSERT INTO admissions (tenant_id,hospital_id,branch_id,clinic_id,patient_id,doctor_id,admission_uid,admission_date,admission_reason,status,priority,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE,$8,'ADMITTED','NORMAL',$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, patient.id, doctors[index % doctors.length].id, uid("ADM", index + 1), index % 2 === 0 ? "Observation and treatment" : "Procedure care", users.RECEPTIONIST.id]
    );
    const inv = await invoice(scope, patient.id, departmentByCode.GEN.id, "ipd", admission.id, "IP admission advance", 5000 + index * 750);
    await payment(scope, patient.id, inv.id, Number(inv.total), "CASH");
    await timeline(scope, patient.id, "IP_ADMISSION", "admissions", admission.id, "Inpatient admission", admission.admission_reason);
  }

  for (let index = 0; index < 5; index += 1) {
    const patient = patients[70 + index];
    const icu = await one(
      `
      INSERT INTO icu_admissions (tenant_id,hospital_id,branch_id,clinic_id,patient_id,admission_uid,status,priority,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,'ADMITTED',$7,$8,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, patient.id, uid("ICU", index + 1), index % 2 === 0 ? "HIGH" : "NORMAL", users.NURSE.id]
    );
    await timeline(scope, patient.id, "ICU_ADMISSION", "icu_admissions", icu.id, "ICU case opened", `ICU priority: ${icu.priority}`);
  }

  for (let index = 0; index < 5; index += 1) {
    const patient = patients[80 + index];
    const ivf = await one(
      `
      INSERT INTO ivf_cycles (tenant_id,hospital_id,branch_id,clinic_id,patient_id,cycle_number,cycle_type,protocol_type,start_date,expected_retrieval_date,expected_transfer_date,doctor_id,embryologist_id,status,workflow_stage,priority,notes,created_by,updated_by,created_at,updated_at,is_deleted)
      VALUES ($1,$2,$3,$4,$5,$6,'IVF','Antagonist',CURRENT_DATE,$7,$8,$9,$10,'ACTIVE',$11,'NORMAL','Professional demo IVF cycle',$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      [tenant.id, hospital.id, branch.id, clinic.id, patient.id, `IVF-${shortKey}-${index + 1}`, dateOffset(12 + index), dateOffset(17 + index), doctors[3].id, doctors[9].id, index % 2 === 0 ? "Stimulation" : "Monitoring", users.DOCTOR.id]
    );
    const inv = await invoice(scope, patient.id, departmentByCode.IVF.id, "ivf", ivf.id, "IVF package advance", 45000 + index * 5000);
    await payment(scope, patient.id, inv.id, Number(inv.total), "BANK_TRANSFER");
    await timeline(scope, patient.id, "IVF_CYCLE_STARTED", "ivf_cycles", ivf.id, "IVF cycle started", `${ivf.cycle_number} is active`);
  }

  const hospitalB = await one(
    `
    INSERT INTO hospitals (tenant_id,hospital_name,hospital_code,legal_name,email,phone,address,city,state,country,status,branding,settings,created_at,updated_at,is_deleted)
    VALUES ($1,'Isolation Validation Hospital B',$2,'Isolation Validation Hospital B','hospital-b@tottechclinical.local','9100001999','Separate Tenant Visibility Test','Guntur','Andhra Pradesh','India','ACTIVE',$3::jsonb,'{}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [tenant.id, `TMSH-B-${shortKey}`, JSON.stringify({ ...branding, name: "Isolation Validation Hospital B" })]
  );
  const branchB = await one(
    `
    INSERT INTO branches (tenant_id,hospital_id,branch_name,branch_code,branch_type,email,phone,address,city,state,country,status,branding,settings,created_at,updated_at,is_deleted)
    VALUES ($1,$2,'Guntur Branch',$3,'MULTI_SPECIALITY','guntur@tottechclinical.local','9100001998','Isolation Branch','Guntur','Andhra Pradesh','India','ACTIVE',$4::jsonb,'{}'::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [tenant.id, hospitalB.id, `GNT-${shortKey}`, JSON.stringify(branding)]
  );
  await one(
    `
    INSERT INTO patients (tenant_id,hospital_id,branch_id,clinic_id,patient_uid,uhid,first_name,last_name,gender,phone,status,metadata,created_by,updated_by,created_at,updated_at,is_deleted)
    VALUES ($1,$2,$3,$4,$5,$6,'Isolation','Patient','Female','9899999999','ACTIVE',$7::jsonb,$8,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    [tenant.id, hospitalB.id, branchB.id, clinic.id, uid("PAT-B"), `TMSH-B-${shortKey}-0001`, JSON.stringify({ isolationSentinel: true }), users.HOSPITAL_ADMIN.id]
  );

  const counts = {
    departments: departmentRows.length,
    roleUsers: roleSpecs.length,
    doctors: doctors.length,
    patients: patients.length,
    consultations: consultations.length,
    labReports: 30,
    radiologyReports: 20,
    medicines: medicines.length,
    admissions: 8,
    icuCases: 5,
    ivfCases: 5,
  };

  const verification = await many(
    `
    SELECT 'patients' entity, count(*)::int count FROM patients WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'doctors', count(*)::int FROM doctors WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'consultations', count(*)::int FROM consultations WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'lab_results', count(*)::int FROM lab_results WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'radiology_orders', count(*)::int FROM consultation_radiology_orders WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'medicines', count(*)::int FROM clinical_medicine_master WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'payments', count(*)::int FROM payments WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'timeline_events', count(*)::int FROM patient_timeline_events WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    ORDER BY entity
    `,
    [tenant.id, hospital.id, branch.id]
  );

  await client.query("COMMIT");

  const markdown = `# Professional Demo Hospital Report

Generated: ${new Date().toISOString()}

## Demo Tenant

- Tenant: TOTTECH Multi-Speciality Hospital
- Tenant ID: ${tenant.id}
- Hospital: ${hospital.hospital_name}
- Hospital ID: ${hospital.id}
- Branch: ${branch.branch_name}
- Branch ID: ${branch.id}
- Clinic: ${clinic.clinic_name}
- Clinic ID: ${clinic.id}
- Demo password for UAT users: \`${password}\`

## Created Users

${roleSpecs.map(([name, key, email]) => `- ${name}: \`${email}\` (${key})`).join("\n")}

## Seeded Clinical Data

${Object.entries(counts).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## Verification Counts

| Entity | Count |
|---|---:|
${verification.map((row) => `| ${row.entity} | ${row.count} |`).join("\n")}

## SaaS Isolation Fixture

- A second hospital was created inside the same tenant for isolation testing.
- Hospital B ID: ${hospitalB.id}
- Branch B ID: ${branchB.id}
- One sentinel patient exists in Hospital B and must not appear when Hospital A context is active.

## Sales Demo Positioning

Lead with multi-tenant architecture, IVF included, hospital branding, complete patient timeline, integrated billing, and fast deployment. Do not pitch this as only another OP/IP/Lab/Pharmacy product.
`;
  fs.writeFileSync(reportPath, markdown);
  console.log(JSON.stringify({ tenantId: tenant.id, hospitalId: hospital.id, branchId: branch.id, clinicId: clinic.id, hospitalBId: hospitalB.id, counts, reportPath }, null, 2));
}

try {
  await main();
} catch (error) {
  await client.query("ROLLBACK").catch(() => null);
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => null);
}
