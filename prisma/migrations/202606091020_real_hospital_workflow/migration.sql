-- TOTTECH Clinical Services - Real Hospital Workflow foundation.
-- Guarded migration: safe to run on a drifted production database.

CREATE TABLE IF NOT EXISTS clinical_lab_test_master (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  lab_test_name VARCHAR(255) NOT NULL,
  category VARCHAR(120),
  normal_value VARCHAR(255),
  unit VARCHAR(80),
  reference_range TEXT,
  cost NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(40) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clinical_lab_test_master_scope
  ON clinical_lab_test_master(tenant_id, hospital_id, branch_id, status, is_deleted);

CREATE TABLE IF NOT EXISTS clinical_medicine_master (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  medicine_name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  brand_name VARCHAR(255),
  medicine_type VARCHAR(120),
  strength VARCHAR(120),
  unit VARCHAR(80),
  selling_price NUMERIC(12,2) DEFAULT 0,
  stock_quantity NUMERIC(12,2) DEFAULT 0,
  reorder_level NUMERIC(12,2) DEFAULT 0,
  expiry_date DATE,
  status VARCHAR(40) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clinical_medicine_master_scope
  ON clinical_medicine_master(tenant_id, hospital_id, branch_id, status, is_deleted);

CREATE TABLE IF NOT EXISTS clinical_room_master (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  room_number VARCHAR(120) NOT NULL,
  room_type VARCHAR(120),
  room_rent NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(40) DEFAULT 'AVAILABLE',
  patient_id INTEGER,
  admission_id INTEGER,
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clinical_room_master_scope
  ON clinical_room_master(tenant_id, hospital_id, branch_id, status, is_deleted);

CREATE TABLE IF NOT EXISTS clinical_vitals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER,
  appointment_id INTEGER,
  blood_pressure VARCHAR(80),
  weight NUMERIC(8,2),
  height NUMERIC(8,2),
  temperature NUMERIC(8,2),
  spo2 NUMERIC(8,2),
  pulse NUMERIC(8,2),
  respiration NUMERIC(8,2),
  bmi NUMERIC(8,2),
  notes TEXT,
  status VARCHAR(40) DEFAULT 'VITALS_COLLECTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clinical_vitals_queue
  ON clinical_vitals(tenant_id, hospital_id, branch_id, appointment_id, is_deleted);

CREATE TABLE IF NOT EXISTS clinical_ot_schedules (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER,
  doctor_id INTEGER,
  appointment_id INTEGER,
  ot_number VARCHAR(120),
  procedure_name VARCHAR(255),
  scheduled_date DATE,
  scheduled_time TIME,
  status VARCHAR(40) DEFAULT 'PLANNED',
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clinical_ot_schedules_scope
  ON clinical_ot_schedules(tenant_id, hospital_id, branch_id, status, is_deleted);

CREATE TABLE IF NOT EXISTS clinical_operational_payments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER,
  appointment_id INTEGER,
  payment_type VARCHAR(80) NOT NULL,
  amount NUMERIC(12,2) DEFAULT 0,
  payment_method VARCHAR(80),
  reference_number VARCHAR(180),
  payment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(40) DEFAULT 'PAID',
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clinical_operational_payments_scope
  ON clinical_operational_payments(tenant_id, hospital_id, branch_id, payment_type, is_deleted);

CREATE TABLE IF NOT EXISTS clinical_pharmacy_dispenses (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  queue_id INTEGER,
  prescription_id INTEGER,
  patient_id INTEGER,
  medicine_name VARCHAR(255),
  quantity NUMERIC(12,2) DEFAULT 0,
  dispense_status VARCHAR(60) DEFAULT 'DISPENSED',
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clinical_pharmacy_dispenses_scope
  ON clinical_pharmacy_dispenses(tenant_id, hospital_id, branch_id, queue_id, is_deleted);

CREATE TABLE IF NOT EXISTS clinical_patient_workflow_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER,
  appointment_id INTEGER,
  workflow_stage VARCHAR(120) NOT NULL,
  status VARCHAR(80) NOT NULL,
  summary TEXT,
  metadata JSONB,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clinical_patient_workflow_events_scope
  ON clinical_patient_workflow_events(tenant_id, hospital_id, branch_id, patient_id, appointment_id, is_deleted);
