-- PHASE 3 - Hospital data model refactoring.
-- Normalized healthcare entities for Clinical Services operational workflows.

CREATE TABLE IF NOT EXISTS patient_visits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  appointment_id INTEGER,
  visit_uid VARCHAR(80) UNIQUE NOT NULL,
  visit_type VARCHAR(80) NOT NULL DEFAULT 'OPD',
  visit_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(80) NOT NULL DEFAULT 'REGISTERED',
  chief_complaint TEXT,
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS patient_allergies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  allergy_name VARCHAR(255) NOT NULL,
  severity VARCHAR(80),
  reaction TEXT,
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS patient_documents (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  document_type VARCHAR(120) NOT NULL,
  document_title VARCHAR(255) NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  uploaded_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS patient_contacts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  contact_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(120),
  mobile VARCHAR(80),
  email VARCHAR(255),
  address TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  visit_id INTEGER REFERENCES patient_visits(id),
  consultation_uid VARCHAR(80) UNIQUE NOT NULL,
  consultation_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(80) NOT NULL DEFAULT 'DRAFT',
  chief_complaint TEXT NOT NULL,
  symptoms TEXT,
  diagnosis_summary TEXT,
  clinical_notes TEXT,
  follow_up_date DATE,
  priority VARCHAR(40) DEFAULT 'NORMAL',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS consultation_diagnoses (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  consultation_id INTEGER NOT NULL REFERENCES consultations(id),
  diagnosis_text TEXT NOT NULL,
  diagnosis_type VARCHAR(80),
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS consultation_prescriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  consultation_id INTEGER NOT NULL REFERENCES consultations(id),
  medicine_id INTEGER REFERENCES clinical_medicine_master(id),
  medicine_name VARCHAR(255),
  dose VARCHAR(120),
  frequency VARCHAR(120),
  duration VARCHAR(120),
  instructions TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS consultation_lab_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  consultation_id INTEGER REFERENCES consultations(id),
  lab_test_id INTEGER REFERENCES clinical_lab_test_master(id),
  order_notes TEXT,
  status VARCHAR(80) DEFAULT 'ORDERED',
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS consultation_radiology_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  consultation_id INTEGER REFERENCES consultations(id),
  patient_id INTEGER REFERENCES patients(id),
  modality VARCHAR(120) NOT NULL,
  study_name VARCHAR(255) NOT NULL,
  scheduled_date DATE,
  technician VARCHAR(255),
  findings TEXT,
  impression TEXT,
  approved_by VARCHAR(255),
  status VARCHAR(80) DEFAULT 'ORDERED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS branch_id INTEGER;
ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS appointment_id INTEGER;
ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS medical_record_id INTEGER;
ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS lab_test_id INTEGER REFERENCES clinical_lab_test_master(id);
ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS sample_number VARCHAR(120);
ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS result_value TEXT;
ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS critical_value BOOLEAN DEFAULT FALSE;
ALTER TABLE lab_orders ADD COLUMN IF NOT EXISTS validated_by VARCHAR(255);

CREATE TABLE IF NOT EXISTS lab_samples (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  lab_order_id INTEGER NOT NULL REFERENCES lab_orders(id),
  sample_number VARCHAR(120),
  sample_type VARCHAR(120),
  collection_time TIME,
  collected_by INTEGER,
  status VARCHAR(80) DEFAULT 'COLLECTED',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS lab_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  lab_order_id INTEGER NOT NULL REFERENCES lab_orders(id),
  result_value TEXT NOT NULL,
  critical_value BOOLEAN DEFAULT FALSE,
  entered_by INTEGER,
  entered_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(80) DEFAULT 'COMPLETED',
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS lab_result_approvals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  lab_result_id INTEGER NOT NULL REFERENCES lab_results(id),
  approved_by VARCHAR(255),
  approved_user_id INTEGER,
  approval_status VARCHAR(80) DEFAULT 'PENDING',
  approved_at TIMESTAMP WITHOUT TIME ZONE,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pharmacy_stock (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  medicine_id INTEGER REFERENCES clinical_medicine_master(id),
  stock_uid VARCHAR(80) UNIQUE NOT NULL,
  quantity NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'STOCK',
  priority VARCHAR(40) DEFAULT 'NORMAL',
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pharmacy_batches (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  stock_id INTEGER NOT NULL REFERENCES pharmacy_stock(id),
  batch_number VARCHAR(120),
  expiry_date DATE,
  quantity NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pharmacy_dispensing (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  stock_id INTEGER REFERENCES pharmacy_stock(id),
  patient_id INTEGER REFERENCES patients(id),
  quantity NUMERIC(12,2) DEFAULT 0,
  dispense_notes TEXT,
  return_reason TEXT,
  status VARCHAR(80) DEFAULT 'PRESCRIPTION_QUEUE',
  dispensed_by INTEGER,
  dispensed_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pharmacy_purchase_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  stock_id INTEGER REFERENCES pharmacy_stock(id),
  purchase_order VARCHAR(120),
  goods_receipt VARCHAR(120),
  supplier VARCHAR(255),
  status VARCHAR(80) DEFAULT 'PO_CREATED',
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS nursing_vitals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  record_uid VARCHAR(80) UNIQUE NOT NULL,
  temperature NUMERIC(8,2),
  pulse NUMERIC(8,2),
  respiratory_rate NUMERIC(8,2),
  blood_pressure VARCHAR(80),
  spo2 NUMERIC(8,2),
  weight NUMERIC(8,2),
  height NUMERIC(8,2),
  bmi NUMERIC(8,2),
  status VARCHAR(80) DEFAULT 'PRESENT',
  priority VARCHAR(40) DEFAULT 'NORMAL',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS nursing_notes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  vital_id INTEGER REFERENCES nursing_vitals(id),
  patient_id INTEGER REFERENCES patients(id),
  note_text TEXT NOT NULL,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS medication_administration_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  vital_id INTEGER REFERENCES nursing_vitals(id),
  patient_id INTEGER REFERENCES patients(id),
  medicine_id INTEGER REFERENCES clinical_medicine_master(id),
  dose VARCHAR(120),
  administration_time TIME,
  nurse_name VARCHAR(255),
  status VARCHAR(80) DEFAULT 'MEDICATION_GIVEN',
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS shift_handovers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  vital_id INTEGER REFERENCES nursing_vitals(id),
  patient_id INTEGER REFERENCES patients(id),
  handover_to VARCHAR(255),
  notes TEXT,
  status VARCHAR(80) DEFAULT 'HANDOVER_DONE',
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS admissions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  admission_uid VARCHAR(80) UNIQUE NOT NULL,
  admission_date DATE,
  admission_reason TEXT NOT NULL,
  status VARCHAR(80) DEFAULT 'ADMITTED',
  priority VARCHAR(40) DEFAULT 'NORMAL',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bed_allocations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  admission_id INTEGER REFERENCES admissions(id),
  patient_id INTEGER REFERENCES patients(id),
  room_id INTEGER REFERENCES clinical_room_master(id),
  allocation_uid VARCHAR(80) UNIQUE NOT NULL,
  building VARCHAR(255),
  ward VARCHAR(255),
  bed_number VARCHAR(120) NOT NULL,
  action VARCHAR(120),
  status VARCHAR(80) DEFAULT 'AVAILABLE',
  priority VARCHAR(40) DEFAULT 'NORMAL',
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS bed_transfers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  admission_id INTEGER REFERENCES admissions(id),
  patient_id INTEGER REFERENCES patients(id),
  from_room_id INTEGER REFERENCES clinical_room_master(id),
  to_room_id INTEGER REFERENCES clinical_room_master(id),
  transfer_reason TEXT,
  transferred_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS discharges (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  admission_id INTEGER REFERENCES admissions(id),
  patient_id INTEGER REFERENCES patients(id),
  discharge_summary TEXT,
  discharge_date DATE,
  status VARCHAR(80) DEFAULT 'DISCHARGE_PLANNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE ot_schedules ADD COLUMN IF NOT EXISTS assistant_surgeon_id INTEGER;
ALTER TABLE ot_schedules ADD COLUMN IF NOT EXISTS anaesthetist VARCHAR(255);
ALTER TABLE ot_schedules ADD COLUMN IF NOT EXISTS assistant_surgeon VARCHAR(255);
ALTER TABLE ot_schedules ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE ot_schedules ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE ot_schedules ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE TABLE IF NOT EXISTS ot_procedures (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  ot_schedule_id INTEGER NOT NULL REFERENCES ot_schedules(id),
  procedure_name VARCHAR(255) NOT NULL,
  procedure_notes TEXT,
  billing_notes TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ot_staff_assignments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  ot_schedule_id INTEGER NOT NULL REFERENCES ot_schedules(id),
  staff_role VARCHAR(120) NOT NULL,
  staff_name VARCHAR(255),
  doctor_id INTEGER REFERENCES doctors(id),
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS icu_admissions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  admission_uid VARCHAR(80) UNIQUE NOT NULL,
  status VARCHAR(80) DEFAULT 'ADMITTED',
  priority VARCHAR(40) DEFAULT 'NORMAL',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS icu_monitoring (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  icu_admission_id INTEGER NOT NULL REFERENCES icu_admissions(id),
  pulse NUMERIC(8,2),
  bp VARCHAR(80),
  spo2 NUMERIC(8,2),
  respiratory_rate NUMERIC(8,2),
  critical_notes TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ventilator_tracking (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  icu_admission_id INTEGER NOT NULL REFERENCES icu_admissions(id),
  ventilator_mode VARCHAR(120),
  fio2 NUMERIC(8,2),
  peep NUMERIC(8,2),
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE ivf_cycles ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id);
ALTER TABLE ivf_cycles ADD COLUMN IF NOT EXISTS workflow_stage VARCHAR(120);
ALTER TABLE ivf_cycles ADD COLUMN IF NOT EXISTS priority VARCHAR(40) DEFAULT 'NORMAL';
ALTER TABLE ivf_cycles ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE TABLE IF NOT EXISTS ivf_stimulation (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  ivf_cycle_id INTEGER NOT NULL REFERENCES ivf_cycles(id),
  amh NUMERIC(8,2),
  fsh NUMERIC(8,2),
  lh NUMERIC(8,2),
  estradiol NUMERIC(8,2),
  afc NUMERIC(8,2),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ivf_monitoring (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  ivf_cycle_id INTEGER NOT NULL REFERENCES ivf_cycles(id),
  monitoring_notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ivf_egg_retrievals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  ivf_cycle_id INTEGER NOT NULL REFERENCES ivf_cycles(id),
  retrieval_date DATE,
  eggs_retrieved INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ivf_embryos (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  ivf_cycle_id INTEGER NOT NULL REFERENCES ivf_cycles(id),
  embryo_grade VARCHAR(120),
  sperm_count VARCHAR(120),
  motility VARCHAR(120),
  morphology VARCHAR(120),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ivf_transfers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  ivf_cycle_id INTEGER NOT NULL REFERENCES ivf_cycles(id),
  transfer_date DATE,
  embryo_grade VARCHAR(120),
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ivf_cryostorage (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  ivf_cycle_id INTEGER NOT NULL REFERENCES ivf_cycles(id),
  storage_tank VARCHAR(120),
  canister VARCHAR(120),
  straw_number VARCHAR(120),
  freeze_date DATE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  clinic_id INTEGER,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  item_uid VARCHAR(80) UNIQUE NOT NULL,
  category VARCHAR(120) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity NUMERIC(12,2) DEFAULT 0,
  supplier VARCHAR(255),
  status VARCHAR(80) DEFAULT 'STOCK_ENTERED',
  priority VARCHAR(40) DEFAULT 'NORMAL',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  inventory_item_id INTEGER NOT NULL REFERENCES inventory_items(id),
  transaction_type VARCHAR(80) NOT NULL,
  quantity NUMERIC(12,2) DEFAULT 0,
  transaction_date DATE,
  notes TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS inventory_issues (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  inventory_item_id INTEGER NOT NULL REFERENCES inventory_items(id),
  issued_to VARCHAR(255),
  consumption_area VARCHAR(255),
  quantity NUMERIC(12,2) DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS inventory_returns (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  inventory_item_id INTEGER NOT NULL REFERENCES inventory_items(id),
  return_reason TEXT,
  quantity NUMERIC(12,2) DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS patient_visits_scope_idx ON patient_visits (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS consultations_scope_idx ON consultations (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS lab_orders_scope_idx ON lab_orders (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS nursing_vitals_scope_idx ON nursing_vitals (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS admissions_scope_idx ON admissions (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS bed_allocations_scope_idx ON bed_allocations (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS ot_schedules_scope_idx ON ot_schedules (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS icu_admissions_scope_idx ON icu_admissions (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS ivf_cycles_scope_idx ON ivf_cycles (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS pharmacy_stock_scope_idx ON pharmacy_stock (tenant_id, hospital_id, branch_id, medicine_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS inventory_items_scope_idx ON inventory_items (tenant_id, hospital_id, branch_id, category, status) WHERE COALESCE(is_deleted,false) = false;
