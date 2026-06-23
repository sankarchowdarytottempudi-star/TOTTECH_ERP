-- PHASE 4 - Patient timeline, billing, insurance, document, audit spine.

CREATE TABLE IF NOT EXISTS patient_timeline_events (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  event_type VARCHAR(120) NOT NULL,
  event_source VARCHAR(120) NOT NULL,
  source_record_id INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_datetime TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS visit_id INTEGER REFERENCES patient_visits(id);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS balance NUMERIC(12,2);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS invoice_type VARCHAR(80) DEFAULT 'PATIENT';
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS source_module VARCHAR(120);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS source_record_id INTEGER;

ALTER TABLE billing_invoice_items ADD COLUMN IF NOT EXISTS item_type VARCHAR(120);
ALTER TABLE billing_invoice_items ADD COLUMN IF NOT EXISTS item_reference_id INTEGER;
ALTER TABLE billing_invoice_items ADD COLUMN IF NOT EXISTS item_description TEXT;
ALTER TABLE billing_invoice_items ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2);

ALTER TABLE payments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS branch_id INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS clinic_id INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_number VARCHAR(120);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(80);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE refunds ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS branch_id INTEGER;
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS clinic_id INTEGER;
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id);
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS refund_number VARCHAR(120);
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2);
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS payment_modes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  mode_name VARCHAR(120) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS insurance_providers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  provider_name VARCHAR(255) NOT NULL,
  provider_type VARCHAR(80) DEFAULT 'INSURANCE',
  contact_name VARCHAR(255),
  contact_phone VARCHAR(80),
  email VARCHAR(255),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

ALTER TABLE insurance_policies ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES insurance_providers(id);
ALTER TABLE insurance_policies ADD COLUMN IF NOT EXISTS patient_type VARCHAR(80) DEFAULT 'INSURANCE';

ALTER TABLE insurance_pre_authorizations ADD COLUMN IF NOT EXISTS authorization_number VARCHAR(120);
ALTER TABLE insurance_pre_authorizations ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITHOUT TIME ZONE;
ALTER TABLE insurance_pre_authorizations ADD COLUMN IF NOT EXISTS rejected_amount NUMERIC(12,2) DEFAULT 0;

ALTER TABLE insurance_claims ADD COLUMN IF NOT EXISTS pending_amount NUMERIC(12,2) DEFAULT 0;
ALTER TABLE insurance_claims ADD COLUMN IF NOT EXISTS settled_amount NUMERIC(12,2) DEFAULT 0;

CREATE TABLE IF NOT EXISTS insurance_settlements (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  claim_id INTEGER REFERENCES insurance_claims(id),
  settlement_number VARCHAR(120) UNIQUE NOT NULL,
  approved_amount NUMERIC(12,2) DEFAULT 0,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  rejected_amount NUMERIC(12,2) DEFAULT 0,
  pending_amount NUMERIC(12,2) DEFAULT 0,
  settlement_date DATE,
  status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS document_repository (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  document_type VARCHAR(120) NOT NULL,
  document_title VARCHAR(255) NOT NULL,
  source_module VARCHAR(120),
  source_record_id INTEGER,
  version INTEGER DEFAULT 1,
  file_name VARCHAR(255),
  file_url TEXT,
  content_type VARCHAR(120),
  generated_by INTEGER,
  uploaded_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS claim_documents (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  claim_id INTEGER REFERENCES insurance_claims(id),
  document_id INTEGER REFERENCES document_repository(id),
  document_type VARCHAR(120),
  status VARCHAR(80) DEFAULT 'UPLOADED',
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE UNIQUE INDEX IF NOT EXISTS patient_timeline_event_source_uidx
ON patient_timeline_events(tenant_id, hospital_id, branch_id, event_source, source_record_id, event_type)
WHERE source_record_id IS NOT NULL AND COALESCE(is_deleted,false) = false;

CREATE INDEX IF NOT EXISTS patient_timeline_scope_idx
ON patient_timeline_events(tenant_id, hospital_id, branch_id, patient_id, event_datetime DESC)
WHERE COALESCE(is_deleted,false) = false;

CREATE INDEX IF NOT EXISTS billing_invoices_scope_idx
ON billing_invoices(tenant_id, hospital_id, branch_id, patient_id, status)
WHERE COALESCE(is_deleted,false) = false;

CREATE INDEX IF NOT EXISTS billing_invoice_items_invoice_idx
ON billing_invoice_items(invoice_id)
WHERE COALESCE(is_deleted,false) = false;

CREATE INDEX IF NOT EXISTS document_repository_scope_idx
ON document_repository(tenant_id, hospital_id, branch_id, patient_id, document_type)
WHERE COALESCE(is_deleted,false) = false;

INSERT INTO payment_modes (mode_name)
SELECT mode_name
FROM (VALUES
  ('Cash'),
  ('Card'),
  ('UPI'),
  ('Bank Transfer'),
  ('Insurance'),
  ('Corporate Credit')
) AS modes(mode_name)
WHERE NOT EXISTS (
  SELECT 1 FROM payment_modes pm
  WHERE pm.mode_name = modes.mode_name
    AND pm.tenant_id IS NULL
);
