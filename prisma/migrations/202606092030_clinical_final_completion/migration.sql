CREATE TABLE IF NOT EXISTS clinical_notification_queue (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  appointment_id INTEGER REFERENCES appointments(id),
  invoice_id INTEGER REFERENCES billing_invoices(id),
  source_module TEXT,
  source_record_id INTEGER,
  channel TEXT NOT NULL,
  template_key TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  message_body TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  provider_response JSONB DEFAULT '{}'::jsonb,
  failure_reason TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS clinical_notification_queue_scope_idx
  ON clinical_notification_queue (tenant_id, hospital_id, branch_id, status, scheduled_at)
  WHERE COALESCE(is_deleted,false)=false;

CREATE TABLE IF NOT EXISTS clinical_appointment_reminders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id),
  patient_id INTEGER REFERENCES patients(id),
  reminder_type TEXT NOT NULL,
  reminder_at TIMESTAMP NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  notification_id INTEGER REFERENCES clinical_notification_queue(id),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX IF NOT EXISTS clinical_appointment_reminders_uidx
  ON clinical_appointment_reminders (tenant_id, hospital_id, branch_id, appointment_id, reminder_type, channel)
  WHERE COALESCE(is_deleted,false)=false;

CREATE TABLE IF NOT EXISTS clinical_credit_notes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  invoice_id INTEGER NOT NULL REFERENCES billing_invoices(id),
  credit_note_number TEXT NOT NULL UNIQUE,
  credit_note_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  approved_by INTEGER,
  approved_at TIMESTAMP,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS clinical_credit_notes_scope_idx
  ON clinical_credit_notes (tenant_id, hospital_id, branch_id, patient_id, status, credit_note_date)
  WHERE COALESCE(is_deleted,false)=false;

CREATE TABLE IF NOT EXISTS clinical_document_verifications (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  document_id INTEGER REFERENCES document_repository(id),
  document_type TEXT,
  source_module TEXT,
  source_record_id INTEGER,
  verification_token TEXT NOT NULL UNIQUE,
  verification_status TEXT NOT NULL DEFAULT 'VALID',
  verified_at TIMESTAMP,
  verified_by INTEGER,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS clinical_document_verifications_scope_idx
  ON clinical_document_verifications (tenant_id, hospital_id, branch_id, verification_token)
  WHERE COALESCE(is_deleted,false)=false;

CREATE INDEX IF NOT EXISTS payments_clinical_scope_date_idx
  ON payments (tenant_id, hospital_id, branch_id, payment_date, is_deleted);

CREATE INDEX IF NOT EXISTS refunds_clinical_scope_date_idx
  ON refunds (tenant_id, hospital_id, branch_id, created_at, is_deleted);

CREATE INDEX IF NOT EXISTS insurance_claims_workflow_idx
  ON insurance_claims (tenant_id, hospital_id, branch_id, status, submission_date, is_deleted);
