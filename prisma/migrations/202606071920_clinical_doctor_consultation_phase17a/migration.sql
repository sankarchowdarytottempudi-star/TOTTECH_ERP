ALTER TABLE medical_records
  ADD COLUMN IF NOT EXISTS history TEXT,
  ADD COLUMN IF NOT EXISTS advice TEXT,
  ADD COLUMN IF NOT EXISTS follow_up_date DATE,
  ADD COLUMN IF NOT EXISTS status VARCHAR(80) DEFAULT 'ACTIVE';

ALTER TABLE prescriptions
  ADD COLUMN IF NOT EXISTS medical_record_id INTEGER REFERENCES medical_records(id),
  ADD COLUMN IF NOT EXISTS chief_complaint TEXT,
  ADD COLUMN IF NOT EXISTS diagnosis TEXT,
  ADD COLUMN IF NOT EXISTS advice TEXT,
  ADD COLUMN IF NOT EXISTS follow_up_date DATE,
  ADD COLUMN IF NOT EXISTS pharmacy_status VARCHAR(80) DEFAULT 'PENDING';

ALTER TABLE lab_orders
  ADD COLUMN IF NOT EXISTS appointment_id INTEGER REFERENCES appointments(id),
  ADD COLUMN IF NOT EXISTS medical_record_id INTEGER REFERENCES medical_records(id);

CREATE TABLE IF NOT EXISTS radiology_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  order_number VARCHAR(80) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  appointment_id INTEGER REFERENCES appointments(id),
  medical_record_id INTEGER REFERENCES medical_records(id),
  study_type VARCHAR(120),
  priority VARCHAR(40) DEFAULT 'ROUTINE',
  clinical_notes TEXT,
  order_status VARCHAR(80) DEFAULT 'CREATED',
  order_date DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, order_number)
);

CREATE TABLE IF NOT EXISTS radiology_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  study_date DATE,
  findings TEXT,
  impression TEXT,
  recommendation TEXT,
  radiologist_notes TEXT,
  comparison_summary TEXT,
  radiologist_id INTEGER REFERENCES doctors(id),
  approval_date TIMESTAMP,
  status VARCHAR(80) DEFAULT 'DRAFT',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS radiology_uploads (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  upload_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  report_id INTEGER REFERENCES radiology_reports(id),
  patient_id INTEGER REFERENCES patients(id),
  file_name VARCHAR(255),
  file_url TEXT,
  file_type VARCHAR(40),
  mime_type VARCHAR(120),
  file_size BIGINT,
  uploaded_by INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, upload_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_prescription_queue (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  queue_number VARCHAR(80) NOT NULL,
  prescription_id INTEGER REFERENCES prescriptions(id),
  appointment_id INTEGER REFERENCES appointments(id),
  medical_record_id INTEGER REFERENCES medical_records(id),
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  prescription_uid VARCHAR(80),
  patient_name VARCHAR(255),
  patient_mobile VARCHAR(40),
  medications JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'PENDING',
  dispensed_at TIMESTAMP,
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, queue_number)
);

CREATE INDEX IF NOT EXISTS idx_medical_records_consultation
  ON medical_records(tenant_id, hospital_id, branch_id, appointment_id, patient_id, doctor_id, status, is_deleted);

CREATE INDEX IF NOT EXISTS idx_prescriptions_queue
  ON prescriptions(tenant_id, hospital_id, branch_id, appointment_id, patient_id, pharmacy_status, is_deleted);

CREATE INDEX IF NOT EXISTS idx_lab_orders_consultation
  ON lab_orders(tenant_id, hospital_id, branch_id, appointment_id, patient_id, status, is_deleted);

CREATE INDEX IF NOT EXISTS idx_radiology_orders_scope
  ON radiology_orders(tenant_id, hospital_id, branch_id, appointment_id, patient_id, order_status, is_deleted);

CREATE INDEX IF NOT EXISTS idx_radiology_reports_patient
  ON radiology_reports(tenant_id, hospital_id, branch_id, patient_id, status, is_deleted);

CREATE INDEX IF NOT EXISTS idx_radiology_uploads_patient
  ON radiology_uploads(tenant_id, hospital_id, branch_id, patient_id, file_type, is_deleted);

CREATE INDEX IF NOT EXISTS idx_pharmacy_prescription_queue
  ON pharmacy_prescription_queue(tenant_id, hospital_id, branch_id, patient_id, status, is_deleted);
