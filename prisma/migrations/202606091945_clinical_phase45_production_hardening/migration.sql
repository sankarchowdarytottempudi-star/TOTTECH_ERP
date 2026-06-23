-- PHASE 4.5 - Production hardening operational reports and audit tables.

CREATE TABLE IF NOT EXISTS financial_reconciliations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  reconciliation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cash_total NUMERIC(12,2) DEFAULT 0,
  card_total NUMERIC(12,2) DEFAULT 0,
  upi_total NUMERIC(12,2) DEFAULT 0,
  bank_total NUMERIC(12,2) DEFAULT 0,
  insurance_total NUMERIC(12,2) DEFAULT 0,
  corporate_total NUMERIC(12,2) DEFAULT 0,
  total_collected NUMERIC(12,2) DEFAULT 0,
  variance_amount NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS shift_closings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  shift_date DATE NOT NULL DEFAULT CURRENT_DATE,
  shift_name VARCHAR(120) NOT NULL DEFAULT 'General',
  opened_by INTEGER,
  closed_by INTEGER,
  opening_balance NUMERIC(12,2) DEFAULT 0,
  closing_balance NUMERIC(12,2) DEFAULT 0,
  collections_total NUMERIC(12,2) DEFAULT 0,
  refunds_total NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'OPEN',
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS daily_collections (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  collection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_mode VARCHAR(80) NOT NULL,
  amount NUMERIC(12,2) DEFAULT 0,
  payment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS outstanding_receivables (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  invoice_id INTEGER REFERENCES billing_invoices(id),
  invoice_number VARCHAR(120),
  invoice_date DATE,
  total NUMERIC(12,2) DEFAULT 0,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  balance NUMERIC(12,2) DEFAULT 0,
  aging_days INTEGER DEFAULT 0,
  payer_type VARCHAR(80) DEFAULT 'PATIENT',
  status VARCHAR(80) DEFAULT 'OPEN',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS revenue_report_snapshots (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  revenue_type VARCHAR(120) NOT NULL,
  source_module VARCHAR(120),
  gross_amount NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  net_amount NUMERIC(12,2) DEFAULT 0,
  invoice_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS clinical_role_permission_audit (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  role_key VARCHAR(120),
  permission_key VARCHAR(255),
  audit_status VARCHAR(80) NOT NULL,
  finding TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS clinical_tenant_security_audit (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  tenant_column_present BOOLEAN DEFAULT FALSE,
  hospital_column_present BOOLEAN DEFAULT FALSE,
  branch_column_present BOOLEAN DEFAULT FALSE,
  audit_status VARCHAR(80) NOT NULL,
  finding TEXT,
  created_by INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS financial_reconciliations_scope_idx
ON financial_reconciliations(tenant_id,hospital_id,branch_id,reconciliation_date)
WHERE COALESCE(is_deleted,false)=false;

CREATE INDEX IF NOT EXISTS shift_closings_scope_idx
ON shift_closings(tenant_id,hospital_id,branch_id,shift_date,status)
WHERE COALESCE(is_deleted,false)=false;

CREATE INDEX IF NOT EXISTS daily_collections_scope_idx
ON daily_collections(tenant_id,hospital_id,branch_id,collection_date,payment_mode)
WHERE COALESCE(is_deleted,false)=false;

CREATE INDEX IF NOT EXISTS outstanding_receivables_scope_idx
ON outstanding_receivables(tenant_id,hospital_id,branch_id,patient_id,status)
WHERE COALESCE(is_deleted,false)=false;

CREATE INDEX IF NOT EXISTS revenue_report_snapshots_scope_idx
ON revenue_report_snapshots(tenant_id,hospital_id,branch_id,report_date,revenue_type)
WHERE COALESCE(is_deleted,false)=false;
