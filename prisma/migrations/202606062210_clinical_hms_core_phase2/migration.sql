-- TOTTECH Clinical Services Phase 2 HMS Core.
-- Core hospital operations foundation for Registration, Appointments,
-- OP, IP, ER, ICU, OT, Nursing, Billing, and Insurance.

ALTER TABLE patients ADD COLUMN IF NOT EXISTS uhid VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS abha_id VARCHAR(100);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS aadhaar_number VARCHAR(40);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS passport_number VARCHAR(80);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS age_years INTEGER;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS marital_status VARCHAR(80);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS nationality VARCHAR(120);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS religion VARCHAR(120);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS occupation VARCHAR(150);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS alternate_mobile VARCHAR(40);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(40);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS landmark TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS city VARCHAR(120);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS district VARCHAR(120);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS state VARCHAR(120);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS country VARCHAR(120) DEFAULT 'India';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_relationship VARCHAR(120);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_address TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS policy_validity DATE;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS tpa VARCHAR(255);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS coverage_amount NUMERIC(14,2);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referral_type VARCHAR(80);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referral_code VARCHAR(120);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referral_name VARCHAR(255);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS commission_plan VARCHAR(255);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS consent_captured_at TIMESTAMP;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS duplicate_check JSONB DEFAULT '{}'::jsonb;

UPDATE patients
SET uhid = COALESCE(uhid, patient_uid)
WHERE uhid IS NULL;

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS consultation_type VARCHAR(120);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS priority VARCHAR(80) DEFAULT 'NORMAL';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS referral_id INTEGER;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS insurance_policy_id INTEGER;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS telemedicine_enabled BOOLEAN DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS telemedicine_url TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS no_show_reason TEXT;

CREATE TABLE IF NOT EXISTS clinical_referrals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  referral_uid VARCHAR(100) UNIQUE NOT NULL,
  referral_type VARCHAR(80),
  referral_code VARCHAR(120),
  referral_name VARCHAR(255),
  source_name VARCHAR(255),
  commission_plan VARCHAR(255),
  commission_rate NUMERIC(8,2),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_consent_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  consent_uid VARCHAR(100) UNIQUE NOT NULL,
  consent_type VARCHAR(120),
  consent_status VARCHAR(80) DEFAULT 'CAPTURED',
  captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  captured_by INTEGER,
  document_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS doctor_schedules (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  schedule_uid VARCHAR(100) UNIQUE NOT NULL,
  start_time TIME,
  end_time TIME,
  slot_duration_minutes INTEGER DEFAULT 15,
  break_time JSONB DEFAULT '[]'::jsonb,
  working_days JSONB DEFAULT '[]'::jsonb,
  holiday_calendar JSONB DEFAULT '[]'::jsonb,
  telemedicine_enabled BOOLEAN DEFAULT false,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_holiday_calendars (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  holiday_date DATE NOT NULL,
  title VARCHAR(255),
  department_id INTEGER,
  doctor_id INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS op_visits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  visit_number VARCHAR(100) UNIQUE NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  appointment_id INTEGER REFERENCES appointments(id),
  visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  chief_complaint TEXT,
  present_illness TEXT,
  past_medical_history TEXT,
  past_surgical_history TEXT,
  family_history TEXT,
  social_history TEXT,
  lifestyle_history TEXT,
  drug_allergies TEXT,
  food_allergies TEXT,
  environmental_allergies TEXT,
  follow_up_date DATE,
  follow_up_notes TEXT,
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS op_visit_complaints (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  op_visit_id INTEGER REFERENCES op_visits(id),
  complaint TEXT,
  duration VARCHAR(120),
  severity VARCHAR(80),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS op_visit_vitals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  op_visit_id INTEGER REFERENCES op_visits(id),
  temperature VARCHAR(40),
  pulse VARCHAR(40),
  respiratory_rate VARCHAR(40),
  blood_pressure VARCHAR(60),
  height_cm NUMERIC(8,2),
  weight_kg NUMERIC(8,2),
  bmi NUMERIC(8,2),
  spo2 VARCHAR(40),
  pain_score INTEGER,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS op_visit_diagnoses (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  op_visit_id INTEGER REFERENCES op_visits(id),
  icd10_code VARCHAR(80),
  diagnosis_description TEXT,
  diagnosis_type VARCHAR(80),
  is_primary BOOLEAN DEFAULT false,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS op_visit_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  op_visit_id INTEGER REFERENCES op_visits(id),
  order_type VARCHAR(80),
  order_details JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ORDERED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS er_visits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  er_number VARCHAR(100) UNIQUE NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  arrival_mode VARCHAR(80),
  triage_level VARCHAR(40),
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS er_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  er_visit_id INTEGER REFERENCES er_visits(id),
  vitals JSONB DEFAULT '{}'::jsonb,
  primary_survey TEXT,
  secondary_survey TEXT,
  injuries TEXT,
  diagnosis TEXT,
  treatment TEXT,
  outcome_status VARCHAR(120),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS hms_wards (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  ward_name VARCHAR(255) NOT NULL,
  ward_code VARCHAR(80) NOT NULL,
  ward_type VARCHAR(120),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(branch_id, ward_code)
);

CREATE TABLE IF NOT EXISTS hms_rooms (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  ward_id INTEGER REFERENCES hms_wards(id),
  room_number VARCHAR(80) NOT NULL,
  room_type VARCHAR(120),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS hms_beds (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  ward_id INTEGER REFERENCES hms_wards(id),
  room_id INTEGER REFERENCES hms_rooms(id),
  bed_number VARCHAR(80) NOT NULL,
  bed_type VARCHAR(120),
  status VARCHAR(80) DEFAULT 'AVAILABLE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ip_admissions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  admission_number VARCHAR(100) UNIQUE NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  consultant_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  admission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  admission_reason TEXT,
  diagnosis TEXT,
  expected_discharge DATE,
  discharge_date TIMESTAMP,
  status VARCHAR(80) DEFAULT 'ADMITTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS bed_allocations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  admission_id INTEGER REFERENCES ip_admissions(id),
  ward_id INTEGER REFERENCES hms_wards(id),
  room_id INTEGER REFERENCES hms_rooms(id),
  bed_id INTEGER REFERENCES hms_beds(id),
  allocation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  release_date TIMESTAMP,
  status VARCHAR(80) DEFAULT 'ALLOCATED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS bed_transfers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  admission_id INTEGER REFERENCES ip_admissions(id),
  current_ward_id INTEGER,
  target_ward_id INTEGER,
  current_bed_id INTEGER,
  target_bed_id INTEGER,
  reason TEXT,
  transfer_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS discharge_summaries (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  admission_id INTEGER REFERENCES ip_admissions(id),
  discharge_date TIMESTAMP,
  discharge_summary TEXT,
  final_diagnosis TEXT,
  follow_up TEXT,
  discharge_medications JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS icu_monitoring_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  admission_id INTEGER REFERENCES ip_admissions(id),
  bed_id INTEGER REFERENCES hms_beds(id),
  ventilator BOOLEAN DEFAULT false,
  oxygen VARCHAR(120),
  ecg TEXT,
  bp VARCHAR(60),
  pulse VARCHAR(40),
  temperature VARCHAR(40),
  urine_output VARCHAR(80),
  alert_level VARCHAR(80),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS icu_alerts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  alert_type VARCHAR(120),
  alert_message TEXT,
  severity VARCHAR(80),
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ot_rooms (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  room_name VARCHAR(255),
  room_code VARCHAR(80),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ot_schedules (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  procedure_name VARCHAR(255),
  patient_id INTEGER REFERENCES patients(id),
  surgeon_id INTEGER REFERENCES doctors(id),
  anesthetist_id INTEGER REFERENCES doctors(id),
  ot_room_id INTEGER REFERENCES ot_rooms(id),
  scheduled_date DATE,
  scheduled_time TIME,
  duration_minutes INTEGER,
  status VARCHAR(80) DEFAULT 'SCHEDULED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ot_checklists (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  ot_schedule_id INTEGER REFERENCES ot_schedules(id),
  consent BOOLEAN DEFAULT false,
  investigations BOOLEAN DEFAULT false,
  implants BOOLEAN DEFAULT false,
  blood_availability BOOLEAN DEFAULT false,
  checklist_data JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ot_notes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  ot_schedule_id INTEGER REFERENCES ot_schedules(id),
  procedure_notes TEXT,
  findings TEXT,
  complications TEXT,
  implants_used TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS nursing_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  admission_id INTEGER REFERENCES ip_admissions(id),
  pain_assessment TEXT,
  skin_assessment TEXT,
  fall_risk VARCHAR(80),
  pressure_ulcer_risk VARCHAR(80),
  assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS nursing_notes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  admission_id INTEGER REFERENCES ip_admissions(id),
  note_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observation TEXT,
  action_taken TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS medication_administrations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  admission_id INTEGER REFERENCES ip_admissions(id),
  medicine VARCHAR(255),
  dose VARCHAR(120),
  route VARCHAR(120),
  administered_time TIMESTAMP,
  administered_by INTEGER,
  status VARCHAR(80) DEFAULT 'ADMINISTERED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS charge_master (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  service_code VARCHAR(120) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  price NUMERIC(14,2) DEFAULT 0,
  tax NUMERIC(8,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(branch_id, service_code)
);

CREATE TABLE IF NOT EXISTS billing_invoices (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  department_id INTEGER REFERENCES departments(id),
  invoice_date DATE DEFAULT CURRENT_DATE,
  subtotal NUMERIC(14,2) DEFAULT 0,
  discount NUMERIC(14,2) DEFAULT 0,
  tax NUMERIC(14,2) DEFAULT 0,
  total NUMERIC(14,2) DEFAULT 0,
  paid_amount NUMERIC(14,2) DEFAULT 0,
  balance_amount NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS billing_invoice_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  invoice_id INTEGER REFERENCES billing_invoices(id),
  charge_id INTEGER REFERENCES charge_master(id),
  item_name VARCHAR(255),
  quantity NUMERIC(12,2) DEFAULT 1,
  rate NUMERIC(14,2) DEFAULT 0,
  discount NUMERIC(14,2) DEFAULT 0,
  tax NUMERIC(14,2) DEFAULT 0,
  total NUMERIC(14,2) DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS billing_payments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  invoice_id INTEGER REFERENCES billing_invoices(id),
  patient_id INTEGER REFERENCES patients(id),
  payment_number VARCHAR(100) UNIQUE NOT NULL,
  amount NUMERIC(14,2) DEFAULT 0,
  method VARCHAR(80),
  reference_number VARCHAR(255),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(80) DEFAULT 'POSTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS billing_refunds (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  invoice_id INTEGER REFERENCES billing_invoices(id),
  patient_id INTEGER REFERENCES patients(id),
  refund_number VARCHAR(100) UNIQUE NOT NULL,
  amount NUMERIC(14,2) DEFAULT 0,
  reason TEXT,
  status VARCHAR(80) DEFAULT 'REQUESTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS insurance_policies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  policy_number VARCHAR(150),
  insurance_company VARCHAR(255),
  tpa VARCHAR(255),
  coverage_amount NUMERIC(14,2),
  remaining_balance NUMERIC(14,2),
  valid_from DATE,
  valid_to DATE,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS insurance_pre_authorizations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  policy_id INTEGER REFERENCES insurance_policies(id),
  request_date DATE DEFAULT CURRENT_DATE,
  approval_status VARCHAR(80) DEFAULT 'REQUESTED',
  requested_amount NUMERIC(14,2),
  approved_amount NUMERIC(14,2),
  remarks TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS insurance_claims (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  policy_id INTEGER REFERENCES insurance_policies(id),
  invoice_id INTEGER REFERENCES billing_invoices(id),
  claim_number VARCHAR(150) UNIQUE NOT NULL,
  submission_date DATE,
  claimed_amount NUMERIC(14,2),
  approved_amount NUMERIC(14,2),
  rejected_amount NUMERIC(14,2),
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_patient_timeline (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  event_type VARCHAR(120),
  event_title VARCHAR(255),
  event_summary TEXT,
  source_table VARCHAR(120),
  source_id INTEGER,
  event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_patient_alerts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  alert_type VARCHAR(120),
  alert_title VARCHAR(255),
  alert_message TEXT,
  severity VARCHAR(80),
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hms_screen_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  module_key VARCHAR(120) NOT NULL,
  screen_key VARCHAR(180) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  route_path VARCHAR(255),
  section_definitions JSONB DEFAULT '[]'::jsonb,
  field_definitions JSONB DEFAULT '[]'::jsonb,
  workflow_definitions JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, screen_key)
);

CREATE TABLE IF NOT EXISTS clinical_hms_api_endpoint_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  api_group VARCHAR(120) NOT NULL,
  endpoint_key VARCHAR(220) NOT NULL,
  method VARCHAR(20) NOT NULL,
  path VARCHAR(255) NOT NULL,
  permission_key VARCHAR(180),
  request_schema JSONB DEFAULT '{}'::jsonb,
  response_schema JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, endpoint_key)
);

CREATE TABLE IF NOT EXISTS clinical_hms_report_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  module_key VARCHAR(120) NOT NULL,
  report_key VARCHAR(180) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  output_formats JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  definition JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_key)
);

CREATE INDEX IF NOT EXISTS idx_op_visits_scope ON op_visits(tenant_id, hospital_id, branch_id, patient_id, visit_date, is_deleted);
CREATE INDEX IF NOT EXISTS idx_er_visits_scope ON er_visits(tenant_id, hospital_id, branch_id, patient_id, arrival_time, is_deleted);
CREATE INDEX IF NOT EXISTS idx_ip_admissions_scope ON ip_admissions(tenant_id, hospital_id, branch_id, patient_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_scope ON billing_invoices(tenant_id, hospital_id, branch_id, patient_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_scope ON insurance_claims(tenant_id, hospital_id, branch_id, patient_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_patient_timeline_scope ON clinical_patient_timeline(tenant_id, hospital_id, branch_id, patient_id, event_time, is_deleted);

WITH scope AS (
  SELECT ct.id AS tenant_id, h.id AS hospital_id, b.id AS branch_id
  FROM clinical_tenants ct
  JOIN hospitals h ON h.tenant_id = ct.id
  JOIN branches b ON b.hospital_id = h.id
  WHERE ct.tenant_code = 'TCS'
  LIMIT 1
),
modules(module_key, module_name, route_path) AS (
  VALUES
    ('registration','Patient Registration','/clinical-services/patients'),
    ('appointments','Appointment Management','/clinical-services/appointments'),
    ('op','OP Management','/clinical-services/hms/op'),
    ('er','Emergency Room','/clinical-services/hms/er'),
    ('ip','IP Admission','/clinical-services/hms/ip'),
    ('icu','ICU Management','/clinical-services/hms/icu'),
    ('ot','Operation Theatre','/clinical-services/hms/ot'),
    ('nursing','Nursing','/clinical-services/hms/nursing'),
    ('billing','Billing','/clinical-services/hms/billing'),
    ('insurance','Insurance','/clinical-services/hms/insurance')
),
screen_types(screen_type, screen_label, sort_order) AS (
  VALUES
    ('dashboard','Dashboard',10),
    ('create','Create',20),
    ('search','Search',30),
    ('profile','Profile',40),
    ('workflow','Workflow',50),
    ('approval','Approval',60),
    ('queue','Queue',70),
    ('calendar','Calendar',80),
    ('timeline','Timeline',90),
    ('reports','Reports',100),
    ('analytics','Analytics',110),
    ('settings','Settings',120)
)
INSERT INTO clinical_hms_screen_definitions (
  tenant_id,
  hospital_id,
  branch_id,
  module_key,
  screen_key,
  screen_name,
  route_path,
  section_definitions,
  field_definitions,
  workflow_definitions
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  modules.module_key,
  modules.module_key || '_' || screen_types.screen_type,
  modules.module_name || ' - ' || screen_types.screen_label,
  modules.route_path,
  jsonb_build_array(
    jsonb_build_object('key','context','label','Context'),
    jsonb_build_object('key','details','label','Details'),
    jsonb_build_object('key','audit','label','Audit')
  ),
  jsonb_build_array(
    jsonb_build_object('key','patient_id','label','Patient','type','Lookup'),
    jsonb_build_object('key','department_id','label','Department','type','Lookup'),
    jsonb_build_object('key','status','label','Status','type','Dropdown')
  ),
  jsonb_build_array(
    jsonb_build_object('step','create','label','Create'),
    jsonb_build_object('step','review','label','Review'),
    jsonb_build_object('step','complete','label','Complete')
  )
FROM scope
CROSS JOIN modules
CROSS JOIN screen_types
ON CONFLICT (tenant_id, hospital_id, branch_id, screen_key)
DO UPDATE SET
  screen_name = EXCLUDED.screen_name,
  route_path = EXCLUDED.route_path,
  section_definitions = EXCLUDED.section_definitions,
  field_definitions = EXCLUDED.field_definitions,
  workflow_definitions = EXCLUDED.workflow_definitions,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT ct.id AS tenant_id, h.id AS hospital_id, b.id AS branch_id
  FROM clinical_tenants ct
  JOIN hospitals h ON h.tenant_id = ct.id
  JOIN branches b ON b.hospital_id = h.id
  WHERE ct.tenant_code = 'TCS'
  LIMIT 1
),
groups(api_group, base_path) AS (
  VALUES
    ('auth','/api/auth'),
    ('patients','/api/clinical/patients'),
    ('appointments','/api/clinical/appointments'),
    ('op','/api/clinical/hms/op'),
    ('ip','/api/clinical/hms/ip'),
    ('er','/api/clinical/hms/er'),
    ('icu','/api/clinical/hms/icu'),
    ('ot','/api/clinical/hms/ot'),
    ('nursing','/api/clinical/hms/nursing'),
    ('billing','/api/clinical/hms/billing'),
    ('insurance','/api/clinical/hms/insurance')
),
ops(operation_key, http_method) AS (
  VALUES
    ('list','GET'),('detail','GET'),('create','POST'),('update','PATCH'),('delete','DELETE'),
    ('export','GET'),('print','GET'),('audit','GET'),('timeline','GET'),('search','GET'),
    ('approve','POST'),('reject','POST'),('cancel','PATCH'),('complete','PATCH'),('reopen','PATCH'),
    ('assign','POST'),('unassign','POST'),('bulk_create','POST'),('bulk_update','PATCH'),('bulk_export','GET'),
    ('calendar','GET'),('queue','GET'),('dashboard','GET'),('analytics','GET'),('reports','GET'),
    ('attachments','GET'),('upload','POST'),('consent','POST'),('notify','POST'),('whatsapp','POST'),
    ('sms','POST'),('email','POST'),('ai_summary','POST'),('risk_score','GET'),('settings','GET')
)
INSERT INTO clinical_hms_api_endpoint_definitions (
  tenant_id,
  hospital_id,
  branch_id,
  api_group,
  endpoint_key,
  method,
  path,
  permission_key,
  request_schema,
  response_schema
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  groups.api_group,
  groups.api_group || '_' || ops.operation_key,
  ops.http_method,
  groups.base_path || '/' || ops.operation_key,
  'clinical.' || groups.api_group || '.' || ops.operation_key,
  '{"tenant_id":"required","hospital_id":"required","branch_id":"required"}'::jsonb,
  '{"status":"ok","audit":"required"}'::jsonb
FROM scope
CROSS JOIN groups
CROSS JOIN ops
ON CONFLICT (tenant_id, hospital_id, branch_id, endpoint_key)
DO UPDATE SET
  method = EXCLUDED.method,
  path = EXCLUDED.path,
  permission_key = EXCLUDED.permission_key,
  request_schema = EXCLUDED.request_schema,
  response_schema = EXCLUDED.response_schema,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT ct.id AS tenant_id, h.id AS hospital_id, b.id AS branch_id
  FROM clinical_tenants ct
  JOIN hospitals h ON h.tenant_id = ct.id
  JOIN branches b ON b.hospital_id = h.id
  WHERE ct.tenant_code = 'TCS'
  LIMIT 1
),
modules(module_key, module_name) AS (
  VALUES
    ('registration','Patient Registration'),
    ('appointments','Appointment Management'),
    ('op','OP Management'),
    ('er','Emergency Room'),
    ('ip','IP Admission'),
    ('icu','ICU Management'),
    ('ot','Operation Theatre'),
    ('nursing','Nursing'),
    ('billing','Billing'),
    ('insurance','Insurance')
),
reports(report_suffix, report_label) AS (
  VALUES
    ('daily','Daily'),
    ('monthly','Monthly'),
    ('doctor_wise','Doctor Wise'),
    ('patient_wise','Patient Wise'),
    ('cancelled','Cancelled'),
    ('revenue','Revenue'),
    ('analytics','Analytics'),
    ('audit','Audit'),
    ('exceptions','Exceptions'),
    ('export','Export')
)
INSERT INTO clinical_hms_report_definitions (
  tenant_id,
  hospital_id,
  branch_id,
  module_key,
  report_key,
  report_name,
  definition
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  modules.module_key,
  modules.module_key || '_' || reports.report_suffix,
  modules.module_name || ' - ' || reports.report_label || ' Report',
  jsonb_build_object(
    'filters', ARRAY['tenant','hospital','branch','date_range','department','doctor','patient'],
    'formats', ARRAY['PDF','Excel','CSV']
  )
FROM scope
CROSS JOIN modules
CROSS JOIN reports
ON CONFLICT (tenant_id, hospital_id, branch_id, report_key)
DO UPDATE SET
  report_name = EXCLUDED.report_name,
  definition = EXCLUDED.definition,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT ct.id AS tenant_id, h.id AS hospital_id, b.id AS branch_id, c.id AS clinic_id
  FROM clinical_tenants ct
  JOIN hospitals h ON h.tenant_id = ct.id
  JOIN branches b ON b.hospital_id = h.id
  JOIN clinics c ON c.branch_id = b.id
  WHERE ct.tenant_code = 'TCS'
  LIMIT 1
)
INSERT INTO clinical_menu_items (
  tenant_id,
  hospital_id,
  branch_id,
  clinic_id,
  menu_key,
  label,
  path,
  module_name,
  permission_key,
  sort_order
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  item.menu_key,
  item.label,
  item.path,
  item.module_name,
  item.permission_key,
  item.sort_order
FROM scope
CROSS JOIN (
  VALUES
    ('hms_core','HMS Core','/clinical-services/hms','hms','clinical.hms.read',35),
    ('opd','OP Management','/clinical-services/hms/op','op','clinical.op.read',60),
    ('ipd','IP Admission','/clinical-services/hms/ip','ip','clinical.ip.read',70),
    ('er','Emergency','/clinical-services/hms/er','er','clinical.er.read',75),
    ('icu','ICU','/clinical-services/hms/icu','icu','clinical.icu.read',76),
    ('ot','Operation Theatre','/clinical-services/hms/ot','ot','clinical.ot.read',77),
    ('nursing','Nursing','/clinical-services/hms/nursing','nursing','clinical.nursing.read',78),
    ('billing','Billing','/clinical-services/hms/billing','billing','clinical.billing.read',120),
    ('insurance','Insurance','/clinical-services/hms/insurance','insurance','clinical.insurance.read',125)
) AS item(menu_key, label, path, module_name, permission_key, sort_order)
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET
  hospital_id = EXCLUDED.hospital_id,
  branch_id = EXCLUDED.branch_id,
  label = EXCLUDED.label,
  path = EXCLUDED.path,
  module_name = EXCLUDED.module_name,
  permission_key = EXCLUDED.permission_key,
  sort_order = EXCLUDED.sort_order,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false,
  is_enabled = true;

WITH form_scope AS (
  SELECT f.*
  FROM clinical_forms f
  WHERE f.form_key = 'patient_registration'
  ORDER BY f.id ASC
  LIMIT 1
),
fields(field_key, label, field_type, section_key, tab_key, sort_order, is_required, options) AS (
  VALUES
    ('uhid','UHID','Text','identity','identity',5,true,'[]'::jsonb),
    ('abha_id','ABHA ID','Text','identity','identity',15,false,'[]'::jsonb),
    ('aadhaar_number','Aadhaar Number','Text','identity','identity',16,false,'[]'::jsonb),
    ('passport_number','Passport Number','Text','identity','identity',17,false,'[]'::jsonb),
    ('middle_name','Middle Name','Text','identity','identity',18,false,'[]'::jsonb),
    ('age_years','Age','Number','identity','identity',42,false,'[]'::jsonb),
    ('blood_group','Blood Group','Dropdown','identity','identity',43,false,'["A+","A-","B+","B-","AB+","AB-","O+","O-"]'::jsonb),
    ('marital_status','Marital Status','Dropdown','identity','identity',44,false,'["Single","Married","Separated","Widowed"]'::jsonb),
    ('nationality','Nationality','Text','identity','identity',45,false,'[]'::jsonb),
    ('religion','Religion','Text','identity','identity',46,false,'[]'::jsonb),
    ('occupation','Occupation','Text','identity','identity',47,false,'[]'::jsonb),
    ('alternate_mobile','Alternate Mobile','Phone','contact','contact',61,false,'[]'::jsonb),
    ('whatsapp_number','WhatsApp Number','Phone','contact','contact',62,false,'[]'::jsonb),
    ('address_line1','Address Line 1','Text','address','contact',63,false,'[]'::jsonb),
    ('address_line2','Address Line 2','Text','address','contact',64,false,'[]'::jsonb),
    ('landmark','Landmark','Text','address','contact',65,false,'[]'::jsonb),
    ('city','City','Text','address','contact',66,false,'[]'::jsonb),
    ('district','District','Text','address','contact',67,false,'[]'::jsonb),
    ('state','State','Text','address','contact',68,false,'[]'::jsonb),
    ('country','Country','Text','address','contact',69,false,'[]'::jsonb),
    ('pincode','Pincode','Text','address','contact',70,false,'[]'::jsonb),
    ('emergency_relationship','Emergency Relationship','Text','emergency','contact',81,false,'[]'::jsonb),
    ('emergency_address','Emergency Address','Rich Text','emergency','contact',82,false,'[]'::jsonb),
    ('policy_validity','Policy Validity','Date','insurance','insurance',121,false,'[]'::jsonb),
    ('tpa','TPA','Text','insurance','insurance',122,false,'[]'::jsonb),
    ('coverage_amount','Coverage Amount','Number','insurance','insurance',123,false,'[]'::jsonb),
    ('referral_type','Referral Type','Dropdown','referral','insurance',130,false,'["Doctor","Hospital","Clinic","Agent","Corporate"]'::jsonb),
    ('referral_code','Referral Code','Text','referral','insurance',131,false,'[]'::jsonb),
    ('referral_name','Referral Name','Text','referral','insurance',132,false,'[]'::jsonb),
    ('commission_plan','Commission Plan','Text','referral','insurance',133,false,'[]'::jsonb)
)
INSERT INTO clinical_form_fields (
  tenant_id,
  clinic_id,
  hospital_id,
  branch_id,
  form_id,
  field_key,
  label,
  field_type,
  section_key,
  tab_key,
  sort_order,
  is_required,
  options,
  validations,
  created_at,
  updated_at,
  is_deleted
)
SELECT
  f.tenant_id,
  f.clinic_id,
  f.hospital_id,
  f.branch_id,
  f.id,
  fields.field_key,
  fields.label,
  fields.field_type,
  fields.section_key,
  fields.tab_key,
  fields.sort_order,
  fields.is_required,
  fields.options,
  '{}'::jsonb,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM form_scope f
CROSS JOIN fields
ON CONFLICT (form_id, field_key)
DO UPDATE SET
  label = EXCLUDED.label,
  field_type = EXCLUDED.field_type,
  section_key = EXCLUDED.section_key,
  tab_key = EXCLUDED.tab_key,
  sort_order = EXCLUDED.sort_order,
  is_required = EXCLUDED.is_required,
  options = EXCLUDED.options,
  hospital_id = EXCLUDED.hospital_id,
  branch_id = EXCLUDED.branch_id,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

UPDATE clinical_form_fields
SET is_required = true,
    updated_at = CURRENT_TIMESTAMP
WHERE field_key IN ('first_name','last_name','gender','date_of_birth')
  AND form_id IN (
    SELECT id
    FROM clinical_forms
    WHERE form_key = 'patient_registration'
  );
