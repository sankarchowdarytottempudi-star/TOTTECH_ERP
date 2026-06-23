-- TOTTECH Clinical Services - Phase 6 Finance + Accounting + Insurance + Referral Commission Engine

CREATE TABLE IF NOT EXISTS clinical_finance_cost_centers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  cost_center_code VARCHAR(80) NOT NULL,
  cost_center_name VARCHAR(255) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  manager_id INTEGER,
  budget NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, cost_center_code)
);

CREATE TABLE IF NOT EXISTS clinical_finance_profit_centers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  profit_center_code VARCHAR(80) NOT NULL,
  profit_center_name VARCHAR(255) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  revenue_target NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, profit_center_code)
);

CREATE TABLE IF NOT EXISTS clinical_finance_accounts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  account_code VARCHAR(80) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(80) NOT NULL,
  parent_account_id INTEGER REFERENCES clinical_finance_accounts(id),
  cost_center_id INTEGER REFERENCES clinical_finance_cost_centers(id),
  profit_center_id INTEGER REFERENCES clinical_finance_profit_centers(id),
  is_system_account BOOLEAN DEFAULT false,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, account_code)
);

CREATE TABLE IF NOT EXISTS clinical_finance_journal_entries (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  journal_number VARCHAR(100) NOT NULL,
  journal_date DATE DEFAULT CURRENT_DATE,
  reference VARCHAR(160),
  description TEXT,
  total_debit NUMERIC(16,2) DEFAULT 0,
  total_credit NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'DRAFT',
  approved_by INTEGER,
  approved_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, journal_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_journal_lines (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  journal_id INTEGER REFERENCES clinical_finance_journal_entries(id),
  account_id INTEGER REFERENCES clinical_finance_accounts(id),
  debit NUMERIC(16,2) DEFAULT 0,
  credit NUMERIC(16,2) DEFAULT 0,
  cost_center_id INTEGER REFERENCES clinical_finance_cost_centers(id),
  profit_center_id INTEGER REFERENCES clinical_finance_profit_centers(id),
  remarks TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_ar_invoices (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  invoice_number VARCHAR(100) NOT NULL,
  customer_type VARCHAR(80) DEFAULT 'PATIENT',
  patient_id INTEGER REFERENCES patients(id),
  insurance_company_id INTEGER,
  corporate_id INTEGER,
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  gross_amount NUMERIC(16,2) DEFAULT 0,
  discount_amount NUMERIC(16,2) DEFAULT 0,
  tax_amount NUMERIC(16,2) DEFAULT 0,
  paid_amount NUMERIC(16,2) DEFAULT 0,
  outstanding_amount NUMERIC(16,2) DEFAULT 0,
  collection_status VARCHAR(80) DEFAULT 'PENDING',
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_ap_vendor_invoices (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  vendor_id INTEGER,
  vendor_name VARCHAR(255),
  invoice_number VARCHAR(100) NOT NULL,
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  amount NUMERIC(16,2) DEFAULT 0,
  paid_amount NUMERIC(16,2) DEFAULT 0,
  outstanding_amount NUMERIC(16,2) DEFAULT 0,
  aging_bucket VARCHAR(80),
  status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, vendor_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_cash_transactions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  transaction_number VARCHAR(100) NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE,
  transaction_type VARCHAR(120) NOT NULL,
  amount NUMERIC(16,2) DEFAULT 0,
  reference VARCHAR(160),
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'POSTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, transaction_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_banks (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(120) NOT NULL,
  ifsc VARCHAR(40),
  branch VARCHAR(255),
  account_type VARCHAR(120),
  opening_balance NUMERIC(16,2) DEFAULT 0,
  current_balance NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, account_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_bank_reconciliations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  bank_id INTEGER REFERENCES clinical_finance_banks(id),
  statement_date DATE DEFAULT CURRENT_DATE,
  opening_balance NUMERIC(16,2) DEFAULT 0,
  closing_balance NUMERIC(16,2) DEFAULT 0,
  book_balance NUMERIC(16,2) DEFAULT 0,
  variance NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_gst_configurations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  gstin VARCHAR(80) NOT NULL,
  state_code VARCHAR(20),
  tax_type VARCHAR(40) DEFAULT 'CGST_SGST',
  cgst_rate NUMERIC(8,2) DEFAULT 0,
  sgst_rate NUMERIC(8,2) DEFAULT 0,
  igst_rate NUMERIC(8,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, gstin)
);

CREATE TABLE IF NOT EXISTS clinical_finance_gst_transactions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  invoice_number VARCHAR(100),
  transaction_date DATE DEFAULT CURRENT_DATE,
  hsn_code VARCHAR(80),
  taxable_amount NUMERIC(16,2) DEFAULT 0,
  cgst_amount NUMERIC(16,2) DEFAULT 0,
  sgst_amount NUMERIC(16,2) DEFAULT 0,
  igst_amount NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_tds_categories (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  tds_section VARCHAR(80) NOT NULL,
  rate NUMERIC(8,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, category_name, tds_section)
);

CREATE TABLE IF NOT EXISTS clinical_finance_tds_deductions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  category_id INTEGER REFERENCES clinical_finance_tds_categories(id),
  pan VARCHAR(40),
  payee_type VARCHAR(120),
  payee_name VARCHAR(255),
  amount NUMERIC(16,2) DEFAULT 0,
  deducted_amount NUMERIC(16,2) DEFAULT 0,
  deduction_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(80) DEFAULT 'DEDUCTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_assets (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  asset_number VARCHAR(100) NOT NULL,
  asset_name VARCHAR(255) NOT NULL,
  category VARCHAR(160),
  purchase_date DATE,
  purchase_cost NUMERIC(16,2) DEFAULT 0,
  location TEXT,
  department_id INTEGER REFERENCES departments(id),
  depreciation_method VARCHAR(120),
  depreciation_rate NUMERIC(8,2) DEFAULT 0,
  useful_life_months INTEGER,
  current_value NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, asset_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_depreciation (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  asset_id INTEGER REFERENCES clinical_finance_assets(id),
  period_start DATE,
  period_end DATE,
  depreciation_amount NUMERIC(16,2) DEFAULT 0,
  accumulated_depreciation NUMERIC(16,2) DEFAULT 0,
  closing_value NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'POSTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_budgets (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  financial_year VARCHAR(40) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  budget_type VARCHAR(120) DEFAULT 'OPERATIONAL',
  budget_amount NUMERIC(16,2) DEFAULT 0,
  actual_amount NUMERIC(16,2) DEFAULT 0,
  variance NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_revenue_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  revenue_number VARCHAR(100) NOT NULL,
  revenue_source VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  revenue_date DATE DEFAULT CURRENT_DATE,
  amount NUMERIC(16,2) DEFAULT 0,
  cost_amount NUMERIC(16,2) DEFAULT 0,
  margin_amount NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'POSTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, revenue_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_insurance_companies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  company_code VARCHAR(80) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(40),
  settlement_terms TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, company_code)
);

CREATE TABLE IF NOT EXISTS clinical_finance_tpas (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  tpa_code VARCHAR(80),
  tpa_name VARCHAR(255) NOT NULL,
  agreement_date DATE,
  settlement_period_days INTEGER,
  coverage_rules JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, tpa_name)
);

CREATE TABLE IF NOT EXISTS clinical_finance_pre_authorizations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  request_number VARCHAR(100) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  insurance_company_id INTEGER REFERENCES clinical_finance_insurance_companies(id),
  tpa_id INTEGER REFERENCES clinical_finance_tpas(id),
  diagnosis TEXT,
  requested_amount NUMERIC(16,2) DEFAULT 0,
  submitted_date DATE DEFAULT CURRENT_DATE,
  approved_amount NUMERIC(16,2) DEFAULT 0,
  rejected_amount NUMERIC(16,2) DEFAULT 0,
  approval_date DATE,
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, request_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_claims (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  claim_number VARCHAR(100) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  admission_number VARCHAR(120),
  insurance_company_id INTEGER REFERENCES clinical_finance_insurance_companies(id),
  tpa_id INTEGER REFERENCES clinical_finance_tpas(id),
  preauth_id INTEGER REFERENCES clinical_finance_pre_authorizations(id),
  claim_amount NUMERIC(16,2) DEFAULT 0,
  approved_amount NUMERIC(16,2) DEFAULT 0,
  rejected_amount NUMERIC(16,2) DEFAULT 0,
  settled_amount NUMERIC(16,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'DRAFT',
  submitted_date DATE,
  settlement_date DATE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, claim_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_claim_documents (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  claim_id INTEGER REFERENCES clinical_finance_claims(id),
  document_type VARCHAR(160) NOT NULL,
  document_title VARCHAR(255),
  file_url TEXT,
  verification_status VARCHAR(80) DEFAULT 'PENDING',
  uploaded_by INTEGER,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_corporates (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  corporate_code VARCHAR(80) NOT NULL,
  corporate_name VARCHAR(255) NOT NULL,
  agreement_start DATE,
  agreement_end DATE,
  credit_limit NUMERIC(16,2) DEFAULT 0,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(40),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, corporate_code)
);

CREATE TABLE IF NOT EXISTS clinical_finance_corporate_patients (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  corporate_id INTEGER REFERENCES clinical_finance_corporates(id),
  patient_id INTEGER REFERENCES patients(id),
  employee_id VARCHAR(120),
  corporate_approval VARCHAR(160),
  package_eligibility TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_referrals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  referral_code VARCHAR(100) NOT NULL,
  referral_type VARCHAR(120) NOT NULL,
  doctor_id INTEGER REFERENCES doctors(id),
  external_hospital VARCHAR(255),
  external_clinic VARCHAR(255),
  agent_name VARCHAR(255),
  corporate_id INTEGER REFERENCES clinical_finance_corporates(id),
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(40),
  email VARCHAR(255),
  address TEXT,
  agreement_date DATE,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, referral_code)
);

CREATE TABLE IF NOT EXISTS clinical_finance_commission_rules (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  rule_name VARCHAR(255) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  procedure_name VARCHAR(255),
  commission_type VARCHAR(120) DEFAULT 'PERCENTAGE',
  fixed_amount NUMERIC(16,2) DEFAULT 0,
  percentage NUMERIC(8,2) DEFAULT 0,
  slab_rules JSONB DEFAULT '[]'::jsonb,
  revenue_sharing_rules JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_commission_calculations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  calculation_number VARCHAR(100) NOT NULL,
  referral_id INTEGER REFERENCES clinical_finance_referrals(id),
  rule_id INTEGER REFERENCES clinical_finance_commission_rules(id),
  patient_id INTEGER REFERENCES patients(id),
  revenue_generated NUMERIC(16,2) DEFAULT 0,
  commission_percentage NUMERIC(8,2) DEFAULT 0,
  commission_amount NUMERIC(16,2) DEFAULT 0,
  tax_deduction NUMERIC(16,2) DEFAULT 0,
  net_payable NUMERIC(16,2) DEFAULT 0,
  approval_status VARCHAR(80) DEFAULT 'GENERATED',
  approved_by INTEGER,
  approved_at TIMESTAMP,
  status VARCHAR(80) DEFAULT 'GENERATED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, calculation_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_doctor_incentive_rules (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  procedure_name VARCHAR(255),
  revenue_threshold NUMERIC(16,2) DEFAULT 0,
  incentive_percentage NUMERIC(8,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_doctor_incentives (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  doctor_id INTEGER REFERENCES doctors(id),
  rule_id INTEGER REFERENCES clinical_finance_doctor_incentive_rules(id),
  department_id INTEGER REFERENCES departments(id),
  revenue_amount NUMERIC(16,2) DEFAULT 0,
  incentive_percentage NUMERIC(8,2) DEFAULT 0,
  incentive_amount NUMERIC(16,2) DEFAULT 0,
  period_start DATE,
  period_end DATE,
  status VARCHAR(80) DEFAULT 'GENERATED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_payouts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  payout_number VARCHAR(100) NOT NULL,
  referral_id INTEGER REFERENCES clinical_finance_referrals(id),
  commission_calculation_id INTEGER REFERENCES clinical_finance_commission_calculations(id),
  amount NUMERIC(16,2) DEFAULT 0,
  payment_date DATE,
  payment_method VARCHAR(120),
  reference VARCHAR(160),
  status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, payout_number)
);

CREATE TABLE IF NOT EXISTS clinical_finance_ai_forecasts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  forecast_number VARCHAR(100),
  forecast_type VARCHAR(120) NOT NULL,
  forecast_period VARCHAR(120),
  predicted_revenue NUMERIC(16,2) DEFAULT 0,
  predicted_claim_delay_days NUMERIC(8,2) DEFAULT 0,
  claim_approval_probability NUMERIC(8,2),
  referral_impact NUMERIC(16,2) DEFAULT 0,
  model_name VARCHAR(160),
  confidence_score NUMERIC(8,2),
  recommendations JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_timeline (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  account_id INTEGER REFERENCES clinical_finance_accounts(id),
  claim_id INTEGER REFERENCES clinical_finance_claims(id),
  referral_id INTEGER REFERENCES clinical_finance_referrals(id),
  event_type VARCHAR(160) NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_summary TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_finance_alerts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  alert_type VARCHAR(160) NOT NULL,
  severity VARCHAR(80) DEFAULT 'INFO',
  title VARCHAR(255) NOT NULL,
  message TEXT,
  source_module VARCHAR(160),
  status VARCHAR(80) DEFAULT 'OPEN',
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'clinical_finance_ar_aging_snapshots','clinical_finance_ap_aging_snapshots','clinical_finance_receipt_allocations',
    'clinical_finance_payment_allocations','clinical_finance_refund_requests','clinical_finance_refund_approvals',
    'clinical_finance_patient_ledgers','clinical_finance_insurance_ledgers','clinical_finance_corporate_ledgers',
    'clinical_finance_vendor_ledgers','clinical_finance_doctor_ledgers','clinical_finance_tax_ledgers',
    'clinical_finance_bank_statement_lines','clinical_finance_reconciliation_matches','clinical_finance_trial_balance_snapshots',
    'clinical_finance_balance_sheet_snapshots','clinical_finance_profit_loss_snapshots','clinical_finance_cash_flow_snapshots',
    'clinical_finance_gstr1_snapshots','clinical_finance_gstr3b_snapshots','clinical_finance_hsn_summaries',
    'clinical_finance_tds_returns','clinical_finance_asset_transfers','clinical_finance_asset_disposals',
    'clinical_finance_budget_revisions','clinical_finance_budget_approvals','clinical_finance_revenue_targets',
    'clinical_finance_revenue_forecasts','clinical_finance_claim_settlements','clinical_finance_claim_rejections',
    'clinical_finance_claim_followups','clinical_finance_claim_audits','clinical_finance_claim_denial_reasons',
    'clinical_finance_preauth_followups','clinical_finance_preauth_approvals','clinical_finance_tpa_settlements',
    'clinical_finance_insurance_tariffs','clinical_finance_insurance_packages','clinical_finance_corporate_tariffs',
    'clinical_finance_corporate_packages','clinical_finance_corporate_authorizations','clinical_finance_referral_agreements',
    'clinical_finance_referral_performance','clinical_finance_referral_roi_snapshots','clinical_finance_commission_approvals',
    'clinical_finance_commission_disputes','clinical_finance_payout_batches','clinical_finance_payout_approvals',
    'clinical_finance_doctor_revenue_snapshots','clinical_finance_department_revenue_snapshots','clinical_finance_service_line_revenue',
    'clinical_finance_ivf_revenue_snapshots','clinical_finance_lab_revenue_snapshots','clinical_finance_radiology_revenue_snapshots',
    'clinical_finance_pharmacy_revenue_snapshots','clinical_finance_occupancy_revenue_snapshots','clinical_finance_profitability_snapshots',
    'clinical_finance_cfo_kpi_snapshots','clinical_finance_ceo_kpi_snapshots','clinical_finance_ai_revenue_predictions',
    'clinical_finance_ai_claim_predictions','clinical_finance_ai_referral_predictions','clinical_finance_ai_risk_alerts',
    'clinical_finance_ai_observability_logs','clinical_finance_document_links','clinical_finance_audit_reviews',
    'clinical_finance_approval_workflows','clinical_finance_workflow_steps','clinical_finance_notification_logs',
    'clinical_finance_report_snapshots','clinical_finance_export_logs','clinical_finance_import_logs',
    'clinical_finance_opening_balances','clinical_finance_closing_balances','clinical_finance_period_locks',
    'clinical_finance_month_end_closures','clinical_finance_year_end_closures','clinical_finance_financial_years',
    'clinical_finance_exchange_rates','clinical_finance_payment_gateways','clinical_finance_upi_collections',
    'clinical_finance_cheque_registers','clinical_finance_neft_registers','clinical_finance_cash_denominations',
    'clinical_finance_petty_cash_requests','clinical_finance_petty_cash_settlements','clinical_finance_expense_claims',
    'clinical_finance_expense_approvals','clinical_finance_procurement_liabilities','clinical_finance_inventory_valuation',
    'clinical_finance_pharmacy_claim_links','clinical_finance_ivf_billing_links','clinical_finance_hms_billing_links',
    'clinical_finance_lab_billing_links','clinical_finance_radiology_billing_links','clinical_finance_payroll_accruals',
    'clinical_finance_hr_cost_allocations','clinical_finance_referral_tax_deductions','clinical_finance_commission_tax_filings'
  ]
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL,
        hospital_id INTEGER NOT NULL,
        branch_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        patient_id INTEGER REFERENCES patients(id),
        doctor_id INTEGER REFERENCES doctors(id),
        department_id INTEGER REFERENCES departments(id),
        account_id INTEGER REFERENCES clinical_finance_accounts(id),
        claim_id INTEGER REFERENCES clinical_finance_claims(id),
        referral_id INTEGER REFERENCES clinical_finance_referrals(id),
        corporate_id INTEGER REFERENCES clinical_finance_corporates(id),
        record_number VARCHAR(120),
        record_date DATE DEFAULT CURRENT_DATE,
        title VARCHAR(255),
        amount NUMERIC(16,2) DEFAULT 0,
        status VARCHAR(80) DEFAULT ''ACTIVE'',
        payload JSONB DEFAULT ''{}''::jsonb,
        created_by INTEGER,
        updated_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT false
      )',
      tbl
    );
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS clinical_finance_screen_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  screen_key VARCHAR(180) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  route_path VARCHAR(255),
  section_definitions JSONB DEFAULT '[]'::jsonb,
  field_definitions JSONB DEFAULT '[]'::jsonb,
  workflow_definitions JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, screen_key)
);

CREATE TABLE IF NOT EXISTS clinical_finance_api_endpoint_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  endpoint_key VARCHAR(180) NOT NULL,
  method VARCHAR(20) NOT NULL,
  path VARCHAR(255) NOT NULL,
  permission_key VARCHAR(180),
  request_schema JSONB DEFAULT '{}'::jsonb,
  response_schema JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, endpoint_key)
);

CREATE TABLE IF NOT EXISTS clinical_finance_report_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  report_key VARCHAR(180) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  report_category VARCHAR(120),
  output_formats JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  metric_definitions JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, report_key)
);

CREATE INDEX IF NOT EXISTS idx_clinical_finance_accounts_scope ON clinical_finance_accounts(tenant_id, hospital_id, branch_id, clinic_id, account_type, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_finance_journal_scope ON clinical_finance_journal_entries(tenant_id, hospital_id, branch_id, journal_date, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_finance_ar_scope ON clinical_finance_ar_invoices(tenant_id, hospital_id, branch_id, invoice_date, collection_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_finance_ap_scope ON clinical_finance_ap_vendor_invoices(tenant_id, hospital_id, branch_id, due_date, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_finance_claims_scope ON clinical_finance_claims(tenant_id, hospital_id, branch_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_finance_commissions_scope ON clinical_finance_commission_calculations(tenant_id, hospital_id, branch_id, approval_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_finance_timeline_scope ON clinical_finance_timeline(tenant_id, hospital_id, branch_id, patient_id, doctor_id, created_at);

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
items(menu_key, label, path, module_name, permission_key, sort_order) AS (
  VALUES
    ('finance_core','Finance Command Center','/clinical-services/finance','finance','clinical.finance.read',220),
    ('finance_coa','Chart of Accounts','/clinical-services/finance/coa','finance','clinical.finance.coa.read',221),
    ('finance_gl','General Ledger','/clinical-services/finance/gl','finance','clinical.finance.gl.read',222),
    ('finance_cost_centers','Cost Centers','/clinical-services/finance/cost-centers','finance','clinical.finance.cost_centers.read',223),
    ('finance_profit_centers','Profit Centers','/clinical-services/finance/profit-centers','finance','clinical.finance.profit_centers.read',224),
    ('finance_ar','Accounts Receivable','/clinical-services/finance/ar','finance','clinical.finance.ar.read',225),
    ('finance_ap','Accounts Payable','/clinical-services/finance/ap','finance','clinical.finance.ap.read',226),
    ('finance_cash','Cash Management','/clinical-services/finance/cash','finance','clinical.finance.cash.read',227),
    ('finance_banks','Bank Management','/clinical-services/finance/banks','finance','clinical.finance.banks.read',228),
    ('finance_gst','GST Management','/clinical-services/finance/gst','tax','clinical.finance.gst.read',229),
    ('finance_tds','TDS Management','/clinical-services/finance/tds','tax','clinical.finance.tds.read',230),
    ('finance_assets','Fixed Assets','/clinical-services/finance/assets','finance','clinical.finance.assets.read',231),
    ('finance_budgets','Budgeting','/clinical-services/finance/budgets','finance','clinical.finance.budgets.read',232),
    ('finance_revenue','Revenue Cycle','/clinical-services/finance/revenue-cycle','rcm','clinical.finance.revenue.read',233),
    ('finance_insurance_companies','Insurance Companies','/clinical-services/finance/insurance-companies','insurance','clinical.finance.insurance_companies.read',234),
    ('finance_tpa','TPA Management','/clinical-services/finance/tpa','insurance','clinical.finance.tpa.read',235),
    ('finance_preauth','Pre Authorization','/clinical-services/finance/preauth','insurance','clinical.finance.preauth.read',236),
    ('finance_claims','Claims Management','/clinical-services/finance/claims','insurance','clinical.finance.claims.read',237),
    ('finance_claim_documents','Claim Documents','/clinical-services/finance/claim-documents','insurance','clinical.finance.claim_documents.read',238),
    ('finance_corporates','Corporate Billing','/clinical-services/finance/corporates','corporate','clinical.finance.corporates.read',239),
    ('finance_corporate_patients','Corporate Patients','/clinical-services/finance/corporate-patients','corporate','clinical.finance.corporate_patients.read',240),
    ('finance_referrals','Referral Management','/clinical-services/finance/referrals','referrals','clinical.finance.referrals.read',241),
    ('finance_commission_rules','Commission Rules','/clinical-services/finance/commission-rules','referrals','clinical.finance.commission_rules.read',242),
    ('finance_commissions','Commission Calculation','/clinical-services/finance/commission-calculations','referrals','clinical.finance.commissions.read',243),
    ('finance_incentives','Doctor Incentives','/clinical-services/finance/doctor-incentives','finance','clinical.finance.incentives.read',244),
    ('finance_payouts','Payout Management','/clinical-services/finance/payouts','finance','clinical.finance.payouts.read',245),
    ('finance_ai','AI Finance Engine','/clinical-services/finance/ai-finance','ai','clinical.finance.ai.read',246)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.clinic_id,
  scope.hospital_id,
  scope.branch_id,
  items.menu_key,
  items.label,
  items.path,
  items.module_name,
  items.permission_key,
  items.sort_order,
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET
  hospital_id = EXCLUDED.hospital_id,
  branch_id = EXCLUDED.branch_id,
  label = EXCLUDED.label,
  path = EXCLUDED.path,
  module_name = EXCLUDED.module_name,
  permission_key = EXCLUDED.permission_key,
  sort_order = EXCLUDED.sort_order,
  is_enabled = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, route_path, screen_count, api_count, report_count, category) AS (
  VALUES
    ('dashboard','Finance Command Center','/clinical-services/finance',8,16,16,'Dashboard'),
    ('coa','Chart of Accounts','/clinical-services/finance/coa',6,12,12,'Accounting'),
    ('gl','General Ledger','/clinical-services/finance/gl',6,12,12,'Accounting'),
    ('cost-centers','Cost Centers','/clinical-services/finance/cost-centers',6,12,12,'Accounting'),
    ('profit-centers','Profit Centers','/clinical-services/finance/profit-centers',6,12,12,'Accounting'),
    ('ar','Accounts Receivable','/clinical-services/finance/ar',6,12,12,'RCM'),
    ('ap','Accounts Payable','/clinical-services/finance/ap',6,12,12,'RCM'),
    ('cash','Cash Management','/clinical-services/finance/cash',6,12,12,'Cash'),
    ('banks','Bank Management','/clinical-services/finance/banks',6,12,12,'Cash'),
    ('gst','GST Management','/clinical-services/finance/gst',6,12,12,'Tax'),
    ('tds','TDS Management','/clinical-services/finance/tds',6,12,12,'Tax'),
    ('assets','Fixed Assets','/clinical-services/finance/assets',6,12,12,'Assets'),
    ('budgets','Budgeting','/clinical-services/finance/budgets',6,12,12,'Planning'),
    ('revenue-cycle','Revenue Cycle','/clinical-services/finance/revenue-cycle',6,12,12,'RCM'),
    ('insurance-companies','Insurance Companies','/clinical-services/finance/insurance-companies',6,12,12,'Insurance'),
    ('tpa','TPA Management','/clinical-services/finance/tpa',6,12,12,'Insurance'),
    ('preauth','Pre Authorization','/clinical-services/finance/preauth',6,12,12,'Insurance'),
    ('claims','Claims Management','/clinical-services/finance/claims',6,12,12,'Insurance'),
    ('claim-documents','Claim Documents','/clinical-services/finance/claim-documents',6,12,12,'Insurance'),
    ('corporates','Corporate Billing','/clinical-services/finance/corporates',6,12,12,'Corporate'),
    ('corporate-patients','Corporate Patients','/clinical-services/finance/corporate-patients',6,12,12,'Corporate'),
    ('referrals','Referral Management','/clinical-services/finance/referrals',6,12,12,'Referral'),
    ('commission-rules','Commission Rules','/clinical-services/finance/commission-rules',6,12,12,'Referral'),
    ('commission-calculations','Commission Calculation','/clinical-services/finance/commission-calculations',6,12,12,'Referral'),
    ('doctor-incentives','Doctor Incentives','/clinical-services/finance/doctor-incentives',6,12,12,'Incentives'),
    ('payouts','Payout Management','/clinical-services/finance/payouts',6,12,12,'Payouts'),
    ('ai-finance','AI Finance Engine','/clinical-services/finance/ai-finance',6,12,12,'AI')
),
screen_rows AS (
  SELECT modules.*, generate_series(1, screen_count) AS n FROM modules
)
INSERT INTO clinical_finance_screen_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, screen_key, screen_name, route_path,
  section_definitions, field_definitions, workflow_definitions, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  screen_rows.module_key,
  screen_rows.module_key || '_screen_' || LPAD(screen_rows.n::text, 2, '0'),
  screen_rows.module_name || ' Screen ' || screen_rows.n,
  screen_rows.route_path,
  jsonb_build_array('Master', 'Transaction', 'Approval', 'Settlement', 'Audit', 'AI Insight'),
  jsonb_build_array('Tenant Scope', 'Hospital Scope', 'Branch Scope', 'Clinic Scope', 'Financial Period', 'Amount'),
  jsonb_build_array('Create', 'Review', 'Approve', 'Post', 'Settle', 'Audit', 'Report'),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN screen_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, screen_key)
DO UPDATE SET
  screen_name = EXCLUDED.screen_name,
  route_path = EXCLUDED.route_path,
  section_definitions = EXCLUDED.section_definitions,
  field_definitions = EXCLUDED.field_definitions,
  workflow_definitions = EXCLUDED.workflow_definitions,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, api_count) AS (
  VALUES
    ('dashboard',16),('coa',12),('gl',12),('cost-centers',12),('profit-centers',12),('ar',12),('ap',12),
    ('cash',12),('banks',12),('gst',12),('tds',12),('assets',12),('budgets',12),('revenue-cycle',12),
    ('insurance-companies',12),('tpa',12),('preauth',12),('claims',12),('claim-documents',12),
    ('corporates',12),('corporate-patients',12),('referrals',12),('commission-rules',12),
    ('commission-calculations',12),('doctor-incentives',12),('payouts',12),('ai-finance',12)
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
)
INSERT INTO clinical_finance_api_endpoint_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, endpoint_key, method, path, permission_key,
  request_schema, response_schema, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  api_rows.module_key,
  api_rows.module_key || '_api_' || LPAD(api_rows.n::text, 3, '0'),
  CASE WHEN api_rows.n % 5 = 1 THEN 'POST' WHEN api_rows.n % 5 = 2 THEN 'PATCH' WHEN api_rows.n % 5 = 3 THEN 'DELETE' ELSE 'GET' END,
  '/api/clinical/finance/' || api_rows.module_key || '/' || api_rows.n,
  'clinical.finance.' || replace(api_rows.module_key, '-', '_') || '.execute',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','clinic_id','required','financial_audit','required'),
  jsonb_build_object('audit','required','timeline','required','posting_control','required','approval_required', api_rows.module_key IN ('gl','claims','commission-calculations','payouts')),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN api_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, endpoint_key)
DO UPDATE SET
  method = EXCLUDED.method,
  path = EXCLUDED.path,
  permission_key = EXCLUDED.permission_key,
  request_schema = EXCLUDED.request_schema,
  response_schema = EXCLUDED.response_schema,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, category, report_count) AS (
  VALUES
    ('dashboard','Finance Command Center','Dashboard',16),('coa','Chart of Accounts','Financial',12),
    ('gl','General Ledger','Financial',12),('cost-centers','Cost Centers','Financial',12),
    ('profit-centers','Profit Centers','Financial',12),('ar','Accounts Receivable','RCM',12),
    ('ap','Accounts Payable','RCM',12),('cash','Cash Management','Cash',12),('banks','Bank Management','Cash',12),
    ('gst','GST Management','Tax',12),('tds','TDS Management','Tax',12),('assets','Fixed Assets','Assets',12),
    ('budgets','Budgeting','Planning',12),('revenue-cycle','Revenue Cycle','RCM',12),
    ('insurance-companies','Insurance Companies','Insurance',12),('tpa','TPA Management','Insurance',12),
    ('preauth','Pre Authorization','Insurance',12),('claims','Claims Management','Insurance',12),
    ('claim-documents','Claim Documents','Insurance',12),('corporates','Corporate Billing','Corporate',12),
    ('corporate-patients','Corporate Patients','Corporate',12),('referrals','Referral Management','Referral',12),
    ('commission-rules','Commission Rules','Referral',12),('commission-calculations','Commission Calculation','Referral',12),
    ('doctor-incentives','Doctor Incentives','Incentives',12),('payouts','Payout Management','Payouts',12),
    ('ai-finance','AI Finance Engine','AI',12)
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO clinical_finance_report_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, report_key, report_name, report_category,
  output_formats, metric_definitions, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  report_rows.module_key,
  report_rows.module_key || '_report_' || LPAD(report_rows.n::text, 3, '0'),
  report_rows.module_name || ' Report ' || report_rows.n,
  report_rows.category,
  '["PDF","Excel","CSV"]'::jsonb,
  jsonb_build_object(
    'source','database',
    'scope','tenant_hospital_branch_clinic',
    'rcm', report_rows.module_key IN ('ar','claims','preauth','insurance-companies','tpa'),
    'ai_forecast', report_rows.module_key = 'ai-finance'
  ),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN report_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, report_key)
DO UPDATE SET
  report_name = EXCLUDED.report_name,
  report_category = EXCLUDED.report_category,
  output_formats = EXCLUDED.output_formats,
  metric_definitions = EXCLUDED.metric_definitions,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;
