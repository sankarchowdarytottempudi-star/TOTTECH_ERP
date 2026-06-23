-- TOTTECH Clinical Services - Phase 5 Pharmacy + Inventory + Procurement + Supply Chain

CREATE TABLE IF NOT EXISTS pharmacy_medicine_categories (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  category_code VARCHAR(80) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  category_type VARCHAR(120),
  restrictions TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, category_code)
);

CREATE TABLE IF NOT EXISTS pharmacy_medicines (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  medicine_code VARCHAR(80) NOT NULL,
  generic_name VARCHAR(255) NOT NULL,
  brand_name VARCHAR(255) NOT NULL,
  strength VARCHAR(120) NOT NULL,
  form VARCHAR(120) NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES pharmacy_medicine_categories(id),
  hsn_code VARCHAR(80),
  schedule_drug VARCHAR(80),
  controlled_drug BOOLEAN DEFAULT false,
  narcotic BOOLEAN DEFAULT false,
  storage_condition VARCHAR(120),
  cold_chain_required BOOLEAN DEFAULT false,
  barcode VARCHAR(160),
  qr_code VARCHAR(160),
  shelf_life_days INTEGER,
  reorder_level NUMERIC(14,2) DEFAULT 0,
  maximum_level NUMERIC(14,2) DEFAULT 0,
  minimum_level NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, medicine_code)
);

CREATE TABLE IF NOT EXISTS pharmacy_vendors (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  vendor_code VARCHAR(80) NOT NULL,
  vendor_name VARCHAR(255) NOT NULL,
  gst_number VARCHAR(80),
  drug_license_number VARCHAR(120),
  address TEXT,
  contact_person VARCHAR(255),
  mobile VARCHAR(40),
  email VARCHAR(255),
  payment_terms VARCHAR(255),
  credit_limit NUMERIC(14,2) DEFAULT 0,
  bank_details JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC(8,2),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, vendor_code)
);

CREATE TABLE IF NOT EXISTS pharmacy_vendor_performance (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  vendor_id INTEGER REFERENCES pharmacy_vendors(id),
  period_start DATE,
  period_end DATE,
  delivery_time_score NUMERIC(8,2),
  quality_score NUMERIC(8,2),
  pricing_score NUMERIC(8,2),
  return_percentage NUMERIC(8,2),
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_warehouses (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  warehouse_code VARCHAR(80) NOT NULL,
  warehouse_name VARCHAR(255) NOT NULL,
  pharmacy_type VARCHAR(120),
  location TEXT,
  manager_id INTEGER,
  capacity NUMERIC(14,2),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, warehouse_code)
);

CREATE TABLE IF NOT EXISTS pharmacy_warehouse_locations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  warehouse_id INTEGER REFERENCES pharmacy_warehouses(id),
  location_code VARCHAR(120) NOT NULL,
  zone_type VARCHAR(120),
  rack VARCHAR(80),
  shelf VARCHAR(80),
  bin VARCHAR(80),
  storage_condition VARCHAR(120),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, location_code)
);

CREATE TABLE IF NOT EXISTS pharmacy_purchase_requisitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  requisition_number VARCHAR(80) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  requested_by INTEGER,
  request_date DATE DEFAULT CURRENT_DATE,
  priority VARCHAR(80) DEFAULT 'ROUTINE',
  reason TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, requisition_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_purchase_requisition_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  requisition_id INTEGER REFERENCES pharmacy_purchase_requisitions(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  quantity NUMERIC(14,2) DEFAULT 0,
  current_stock NUMERIC(14,2) DEFAULT 0,
  required_stock NUMERIC(14,2) DEFAULT 0,
  remarks TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_purchase_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  po_number VARCHAR(80) NOT NULL,
  requisition_id INTEGER REFERENCES pharmacy_purchase_requisitions(id),
  vendor_id INTEGER REFERENCES pharmacy_vendors(id),
  po_date DATE DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  remarks TEXT,
  subtotal NUMERIC(14,2) DEFAULT 0,
  tax NUMERIC(14,2) DEFAULT 0,
  discount NUMERIC(14,2) DEFAULT 0,
  net_amount NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, po_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_purchase_order_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  po_id INTEGER REFERENCES pharmacy_purchase_orders(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  ordered_qty NUMERIC(14,2) DEFAULT 0,
  unit_cost NUMERIC(14,2) DEFAULT 0,
  tax NUMERIC(14,2) DEFAULT 0,
  discount NUMERIC(14,2) DEFAULT 0,
  net_amount NUMERIC(14,2) DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_grns (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  grn_number VARCHAR(80) NOT NULL,
  po_id INTEGER REFERENCES pharmacy_purchase_orders(id),
  vendor_id INTEGER REFERENCES pharmacy_vendors(id),
  invoice_number VARCHAR(120),
  invoice_date DATE,
  received_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(80) DEFAULT 'RECEIVED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, grn_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_batches (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  batch_number VARCHAR(120) NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  vendor_id INTEGER REFERENCES pharmacy_vendors(id),
  manufacturing_date DATE,
  expiry_date DATE,
  unit_cost NUMERIC(14,2) DEFAULT 0,
  mrp NUMERIC(14,2) DEFAULT 0,
  selling_price NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, medicine_id, batch_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_grn_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  grn_id INTEGER REFERENCES pharmacy_grns(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  received_quantity NUMERIC(14,2) DEFAULT 0,
  accepted_quantity NUMERIC(14,2) DEFAULT 0,
  rejected_quantity NUMERIC(14,2) DEFAULT 0,
  unit_cost NUMERIC(14,2) DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_inventory (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  warehouse_id INTEGER REFERENCES pharmacy_warehouses(id),
  location_id INTEGER REFERENCES pharmacy_warehouse_locations(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  current_quantity NUMERIC(14,2) DEFAULT 0,
  reserved_quantity NUMERIC(14,2) DEFAULT 0,
  available_quantity NUMERIC(14,2) DEFAULT 0,
  unit_cost NUMERIC(14,2) DEFAULT 0,
  selling_price NUMERIC(14,2) DEFAULT 0,
  expiry_date DATE,
  inventory_status VARCHAR(80) DEFAULT 'IN_STOCK',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_stock_transfers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  transfer_number VARCHAR(80) NOT NULL,
  source_store_id INTEGER REFERENCES pharmacy_warehouses(id),
  destination_store_id INTEGER REFERENCES pharmacy_warehouses(id),
  transfer_date DATE DEFAULT CURRENT_DATE,
  requested_by INTEGER,
  status VARCHAR(80) DEFAULT 'REQUESTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, transfer_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_stock_transfer_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  transfer_id INTEGER REFERENCES pharmacy_stock_transfers(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  quantity NUMERIC(14,2) DEFAULT 0,
  remarks TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_retail_sales (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  bill_number VARCHAR(80) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  prescription_number VARCHAR(120),
  sale_date DATE DEFAULT CURRENT_DATE,
  payment_mode VARCHAR(80),
  subtotal NUMERIC(14,2) DEFAULT 0,
  discount NUMERIC(14,2) DEFAULT 0,
  tax NUMERIC(14,2) DEFAULT 0,
  total NUMERIC(14,2) DEFAULT 0,
  paid_amount NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, bill_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_sale_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  sale_id INTEGER REFERENCES pharmacy_retail_sales(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  quantity NUMERIC(14,2) DEFAULT 0,
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

CREATE TABLE IF NOT EXISTS pharmacy_ip_dispensing (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dispensing_number VARCHAR(80) NOT NULL,
  admission_id INTEGER REFERENCES ip_admissions(id),
  patient_id INTEGER REFERENCES patients(id),
  ward VARCHAR(120),
  doctor_id INTEGER REFERENCES doctors(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  quantity NUMERIC(14,2) DEFAULT 0,
  frequency VARCHAR(120),
  status VARCHAR(80) DEFAULT 'ISSUED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, dispensing_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_ward_stock_movements (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  admission_id INTEGER REFERENCES ip_admissions(id),
  patient_id INTEGER REFERENCES patients(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  movement_type VARCHAR(80),
  quantity NUMERIC(14,2) DEFAULT 0,
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_ivf_medication_tracking (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  patient_id INTEGER REFERENCES patients(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  medication_type VARCHAR(120),
  dose VARCHAR(120),
  start_date DATE,
  end_date DATE,
  compliance VARCHAR(120),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_controlled_drug_register (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  register_number VARCHAR(80) NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  quantity_received NUMERIC(14,2) DEFAULT 0,
  quantity_issued NUMERIC(14,2) DEFAULT 0,
  balance NUMERIC(14,2) DEFAULT 0,
  authorized_by INTEGER,
  movement_type VARCHAR(120),
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, register_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_expiry_actions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  action_number VARCHAR(80) NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  action_type VARCHAR(120),
  action_date DATE DEFAULT CURRENT_DATE,
  quantity NUMERIC(14,2) DEFAULT 0,
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'PLANNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, action_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_customer_returns (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  return_number VARCHAR(80) NOT NULL,
  sale_id INTEGER REFERENCES pharmacy_retail_sales(id),
  patient_id INTEGER REFERENCES patients(id),
  reason TEXT,
  approval_status VARCHAR(80) DEFAULT 'PENDING',
  status VARCHAR(80) DEFAULT 'REQUESTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, return_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_vendor_returns (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  return_number VARCHAR(80) NOT NULL,
  vendor_id INTEGER REFERENCES pharmacy_vendors(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  quantity NUMERIC(14,2) DEFAULT 0,
  reason TEXT,
  status VARCHAR(80) DEFAULT 'REQUESTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, return_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_stock_adjustments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  adjustment_number VARCHAR(80) NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  reason VARCHAR(160),
  stock_before NUMERIC(14,2) DEFAULT 0,
  stock_after NUMERIC(14,2) DEFAULT 0,
  approved_by INTEGER,
  status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, adjustment_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_inventory_audits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  audit_number VARCHAR(80) NOT NULL,
  warehouse_id INTEGER REFERENCES pharmacy_warehouses(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  system_quantity NUMERIC(14,2) DEFAULT 0,
  physical_quantity NUMERIC(14,2) DEFAULT 0,
  variance NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, audit_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_reorder_rules (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  minimum_level NUMERIC(14,2) DEFAULT 0,
  maximum_level NUMERIC(14,2) DEFAULT 0,
  preferred_vendor_id INTEGER REFERENCES pharmacy_vendors(id),
  lead_time_days INTEGER DEFAULT 0,
  auto_po_enabled BOOLEAN DEFAULT false,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_ai_forecasts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  forecast_number VARCHAR(80) NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  forecast_type VARCHAR(120),
  predicted_consumption NUMERIC(14,2) DEFAULT 0,
  future_demand NUMERIC(14,2) DEFAULT 0,
  seasonal_demand JSONB DEFAULT '{}'::jsonb,
  shortage_risk NUMERIC(8,2),
  expiry_risk NUMERIC(8,2),
  ivf_protocol_usage JSONB DEFAULT '{}'::jsonb,
  clinical_review_required BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, forecast_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_formulary (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  category_id INTEGER REFERENCES pharmacy_medicine_categories(id),
  hospital_approved BOOLEAN DEFAULT false,
  alternative_medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  restrictions TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_pricing_rules (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  mrp NUMERIC(14,2) DEFAULT 0,
  selling_price NUMERIC(14,2) DEFAULT 0,
  discount NUMERIC(14,2) DEFAULT 0,
  insurance_coverage BOOLEAN DEFAULT false,
  corporate_pricing JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_insurance_claims (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  claim_number VARCHAR(80) NOT NULL,
  sale_id INTEGER REFERENCES pharmacy_retail_sales(id),
  patient_id INTEGER REFERENCES patients(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  approved_amount NUMERIC(14,2) DEFAULT 0,
  rejected_amount NUMERIC(14,2) DEFAULT 0,
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, claim_number)
);

CREATE TABLE IF NOT EXISTS pharmacy_timeline (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  event_type VARCHAR(120),
  event_title VARCHAR(255),
  event_summary TEXT,
  source_table VARCHAR(120),
  source_id INTEGER,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS pharmacy_alerts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  medicine_id INTEGER REFERENCES pharmacy_medicines(id),
  batch_id INTEGER REFERENCES pharmacy_batches(id),
  alert_type VARCHAR(120),
  severity VARCHAR(80),
  title VARCHAR(255),
  message TEXT,
  status VARCHAR(80) DEFAULT 'OPEN',
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
    'pharmacy_stock_movements','pharmacy_stock_reservations','pharmacy_stock_ledger','pharmacy_barcode_scans',
    'pharmacy_qr_scans','pharmacy_cold_chain_logs','pharmacy_temperature_logs','pharmacy_narcotic_approvals',
    'pharmacy_narcotic_returns','pharmacy_controlled_drug_audit_logs','pharmacy_schedule_drug_register',
    'pharmacy_op_prescriptions','pharmacy_ip_prescriptions','pharmacy_er_prescriptions','pharmacy_ot_consumption',
    'pharmacy_icu_consumption','pharmacy_ivf_protocol_templates','pharmacy_ivf_cycle_demands',
    'pharmacy_ivf_compliance_logs','pharmacy_retail_cash_payments','pharmacy_retail_upi_payments',
    'pharmacy_retail_card_payments','pharmacy_credit_sales','pharmacy_corporate_credit_sales',
    'pharmacy_insurance_authorizations','pharmacy_claim_submissions','pharmacy_claim_responses',
    'pharmacy_vendor_invoices','pharmacy_vendor_payments','pharmacy_vendor_credit_notes',
    'pharmacy_vendor_debit_notes','pharmacy_purchase_approvals','pharmacy_po_amendments',
    'pharmacy_po_cancellations','pharmacy_grn_rejections','pharmacy_grn_quality_checks',
    'pharmacy_batch_quarantine','pharmacy_batch_release','pharmacy_batch_recalls','pharmacy_expiry_notifications',
    'pharmacy_expiry_vendor_returns','pharmacy_expiry_destruction','pharmacy_expiry_discount_sales',
    'pharmacy_damaged_stock','pharmacy_dead_stock','pharmacy_low_stock_snapshots','pharmacy_out_of_stock_snapshots',
    'pharmacy_near_expiry_snapshots','pharmacy_stock_valuation_snapshots','pharmacy_department_usage',
    'pharmacy_doctor_usage','pharmacy_patient_usage','pharmacy_medicine_usage','pharmacy_top_medicine_snapshots',
    'pharmacy_reorder_suggestions','pharmacy_auto_generated_requisitions','pharmacy_auto_generated_pos',
    'pharmacy_demand_forecast_runs','pharmacy_seasonal_forecasts','pharmacy_shortage_predictions',
    'pharmacy_expiry_risk_predictions','pharmacy_mobile_stock_checks','pharmacy_mobile_expiry_alerts',
    'pharmacy_mobile_po_approvals','pharmacy_mobile_inventory_audits','pharmacy_mobile_barcode_scans',
    'pharmacy_warehouse_zone_rules','pharmacy_warehouse_capacity_logs','pharmacy_warehouse_cycle_counts',
    'pharmacy_satellite_store_stock','pharmacy_emergency_store_stock','pharmacy_ot_store_stock',
    'pharmacy_icu_store_stock','pharmacy_ivf_store_stock','pharmacy_central_warehouse_stock',
    'pharmacy_formulary_restrictions','pharmacy_alternative_drugs','pharmacy_drug_interactions',
    'pharmacy_adverse_event_logs','pharmacy_return_approvals','pharmacy_customer_refunds',
    'pharmacy_vendor_return_shipments','pharmacy_inventory_audit_variances','pharmacy_adjustment_approvals',
    'pharmacy_report_snapshots','pharmacy_kpi_snapshots','pharmacy_ai_observability_logs',
    'pharmacy_notification_logs','pharmacy_document_links','pharmacy_compliance_registers'
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
        medicine_id INTEGER REFERENCES pharmacy_medicines(id),
        batch_id INTEGER REFERENCES pharmacy_batches(id),
        warehouse_id INTEGER REFERENCES pharmacy_warehouses(id),
        vendor_id INTEGER REFERENCES pharmacy_vendors(id),
        record_number VARCHAR(100),
        record_date DATE DEFAULT CURRENT_DATE,
        title VARCHAR(255),
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

CREATE TABLE IF NOT EXISTS pharmacy_screen_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  screen_key VARCHAR(160) NOT NULL,
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

CREATE TABLE IF NOT EXISTS pharmacy_api_endpoint_definitions (
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

CREATE TABLE IF NOT EXISTS pharmacy_report_definitions (
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

CREATE INDEX IF NOT EXISTS idx_pharmacy_medicines_scope ON pharmacy_medicines(tenant_id, hospital_id, branch_id, clinic_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_pharmacy_inventory_scope ON pharmacy_inventory(tenant_id, hospital_id, branch_id, clinic_id, medicine_id, inventory_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_pharmacy_batches_expiry ON pharmacy_batches(tenant_id, hospital_id, branch_id, expiry_date, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_pharmacy_po_scope ON pharmacy_purchase_orders(tenant_id, hospital_id, branch_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_pharmacy_sales_scope ON pharmacy_retail_sales(tenant_id, hospital_id, branch_id, sale_date, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_pharmacy_timeline_scope ON pharmacy_timeline(tenant_id, hospital_id, branch_id, patient_id, medicine_id, created_at);

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
    ('pharmacy_core','Pharmacy Command Center','/clinical-services/pharmacy','pharmacy','clinical.pharmacy.read',180),
    ('pharmacy_medicines','Medicine Master','/clinical-services/pharmacy/medicines','pharmacy','clinical.pharmacy.medicines.read',181),
    ('pharmacy_categories','Drug Classification','/clinical-services/pharmacy/categories','pharmacy','clinical.pharmacy.categories.read',182),
    ('pharmacy_vendors','Vendor Management','/clinical-services/pharmacy/vendors','procurement','clinical.pharmacy.vendors.read',183),
    ('pharmacy_requisitions','Purchase Requisitions','/clinical-services/pharmacy/requisitions','procurement','clinical.pharmacy.requisitions.read',184),
    ('pharmacy_purchase_orders','Purchase Orders','/clinical-services/pharmacy/purchase-orders','procurement','clinical.pharmacy.po.read',185),
    ('pharmacy_grn','Goods Receipt Notes','/clinical-services/pharmacy/grn','procurement','clinical.pharmacy.grn.read',186),
    ('pharmacy_inventory','Inventory','/clinical-services/pharmacy/inventory','inventory','clinical.pharmacy.inventory.read',187),
    ('pharmacy_warehouses','Warehouses','/clinical-services/pharmacy/warehouses','inventory','clinical.pharmacy.warehouses.read',188),
    ('pharmacy_transfers','Stock Transfers','/clinical-services/pharmacy/transfers','inventory','clinical.pharmacy.transfers.read',189),
    ('pharmacy_sales','Retail Pharmacy','/clinical-services/pharmacy/sales','pharmacy','clinical.pharmacy.sales.read',190),
    ('pharmacy_ip','IP Pharmacy','/clinical-services/pharmacy/ip-dispensing','pharmacy','clinical.pharmacy.ip.read',191),
    ('pharmacy_ivf','IVF Pharmacy','/clinical-services/pharmacy/ivf-medications','pharmacy','clinical.pharmacy.ivf.read',192),
    ('pharmacy_controlled','Controlled Drugs','/clinical-services/pharmacy/controlled-drugs','compliance','clinical.pharmacy.controlled.read',193),
    ('pharmacy_expiry','Expiry Management','/clinical-services/pharmacy/expiry','inventory','clinical.pharmacy.expiry.read',194),
    ('pharmacy_returns','Returns','/clinical-services/pharmacy/returns','inventory','clinical.pharmacy.returns.read',195),
    ('pharmacy_adjustments','Stock Adjustments','/clinical-services/pharmacy/adjustments','inventory','clinical.pharmacy.adjustments.read',196),
    ('pharmacy_audits','Inventory Audit','/clinical-services/pharmacy/audits','inventory','clinical.pharmacy.audits.read',197),
    ('pharmacy_reorder','Auto Reorder','/clinical-services/pharmacy/reorder','inventory','clinical.pharmacy.reorder.read',198),
    ('pharmacy_ai','AI Inventory Engine','/clinical-services/pharmacy/ai-forecast','ai','clinical.pharmacy.ai.read',199),
    ('pharmacy_formulary','Formulary','/clinical-services/pharmacy/formulary','pharmacy','clinical.pharmacy.formulary.read',200),
    ('pharmacy_claims','Pharmacy Claims','/clinical-services/pharmacy/claims','insurance','clinical.pharmacy.claims.read',201)
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
    ('dashboard','Pharmacy Dashboard','/clinical-services/pharmacy',8,18,12,'Dashboard'),
    ('medicines','Medicine Master','/clinical-services/pharmacy/medicines',8,18,12,'Master'),
    ('categories','Drug Classification','/clinical-services/pharmacy/categories',4,10,8,'Master'),
    ('vendors','Vendor Management','/clinical-services/pharmacy/vendors',6,14,10,'Procurement'),
    ('requisitions','Purchase Requisition','/clinical-services/pharmacy/requisitions',6,14,10,'Procurement'),
    ('purchase-orders','Purchase Orders','/clinical-services/pharmacy/purchase-orders',6,16,12,'Procurement'),
    ('grn','Goods Receipt Note','/clinical-services/pharmacy/grn',6,16,12,'Procurement'),
    ('inventory','Inventory Management','/clinical-services/pharmacy/inventory',8,18,16,'Inventory'),
    ('warehouses','Multi-Warehouse','/clinical-services/pharmacy/warehouses',5,12,10,'Inventory'),
    ('transfers','Stock Transfers','/clinical-services/pharmacy/transfers',5,12,10,'Inventory'),
    ('sales','Retail Pharmacy','/clinical-services/pharmacy/sales',7,16,14,'Sales'),
    ('ip-dispensing','IP Pharmacy','/clinical-services/pharmacy/ip-dispensing',5,12,10,'Pharmacy'),
    ('ivf-medications','IVF Pharmacy','/clinical-services/pharmacy/ivf-medications',5,12,12,'IVF'),
    ('controlled-drugs','Controlled Drugs','/clinical-services/pharmacy/controlled-drugs',5,12,12,'Compliance'),
    ('expiry','Expiry Management','/clinical-services/pharmacy/expiry',5,12,12,'Inventory'),
    ('returns','Returns Management','/clinical-services/pharmacy/returns',5,12,10,'Inventory'),
    ('adjustments','Stock Adjustments','/clinical-services/pharmacy/adjustments',4,10,8,'Inventory'),
    ('audits','Inventory Audit','/clinical-services/pharmacy/audits',4,10,8,'Inventory'),
    ('reorder','Auto Reorder','/clinical-services/pharmacy/reorder',5,12,12,'AI'),
    ('ai-forecast','AI Inventory Engine','/clinical-services/pharmacy/ai-forecast',5,12,14,'AI'),
    ('formulary','Formulary','/clinical-services/pharmacy/formulary',4,10,8,'Clinical'),
    ('pricing','Pharmacy Billing','/clinical-services/pharmacy/pricing',4,10,10,'Finance'),
    ('claims','Insurance Pharmacy Claims','/clinical-services/pharmacy/claims',4,10,8,'Insurance'),
    ('mobile','Mobile Pharmacy App','/clinical-services/pharmacy/mobile',4,10,8,'Mobile')
),
screen_rows AS (
  SELECT modules.*, generate_series(1, screen_count) AS n FROM modules
)
INSERT INTO pharmacy_screen_definitions (
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
  jsonb_build_array('Master', 'Stock', 'Batch', 'Expiry', 'Audit'),
  jsonb_build_array('Tenant Scope', 'Hospital Scope', 'Branch Scope', 'Warehouse Context', 'Medicine Context'),
  jsonb_build_array('Create', 'Approve', 'Receive/Issue', 'Adjust', 'Audit', 'Report'),
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
modules(module_key, module_name, api_count) AS (
  VALUES
    ('dashboard','Pharmacy Dashboard',18),('medicines','Medicine Master',18),('categories','Drug Classification',10),
    ('vendors','Vendor Management',14),('requisitions','Purchase Requisition',14),('purchase-orders','Purchase Orders',16),
    ('grn','Goods Receipt Note',16),('inventory','Inventory Management',18),('warehouses','Multi-Warehouse',12),
    ('transfers','Stock Transfers',12),('sales','Retail Pharmacy',16),('ip-dispensing','IP Pharmacy',12),
    ('ivf-medications','IVF Pharmacy',12),('controlled-drugs','Controlled Drugs',12),('expiry','Expiry Management',12),
    ('returns','Returns Management',12),('adjustments','Stock Adjustments',10),('audits','Inventory Audit',10),
    ('reorder','Auto Reorder',12),('ai-forecast','AI Inventory Engine',12),('formulary','Formulary',10),
    ('pricing','Pharmacy Billing',10),('claims','Insurance Pharmacy Claims',10),('mobile','Mobile Pharmacy App',10)
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
)
INSERT INTO pharmacy_api_endpoint_definitions (
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
  '/api/clinical/pharmacy/' || api_rows.module_key || '/' || api_rows.n,
  'clinical.pharmacy.' || replace(api_rows.module_key, '-', '_') || '.execute',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','clinic_id','required'),
  jsonb_build_object('audit','required','batch_tracking','required','expiry_tracking','required','controlled_drug_audit', api_rows.module_key = 'controlled-drugs'),
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
    ('dashboard','Pharmacy Dashboard','Dashboard',12),('medicines','Medicine Master','Inventory',12),
    ('categories','Drug Classification','Inventory',8),('vendors','Vendor Management','Purchase',10),
    ('requisitions','Purchase Requisition','Purchase',10),('purchase-orders','Purchase Orders','Purchase',12),
    ('grn','Goods Receipt Note','Purchase',12),('inventory','Inventory Management','Inventory',16),
    ('warehouses','Multi-Warehouse','Inventory',10),('transfers','Stock Transfers','Inventory',10),
    ('sales','Retail Pharmacy','Pharmacy',14),('ip-dispensing','IP Pharmacy','Pharmacy',10),
    ('ivf-medications','IVF Pharmacy','IVF',12),('controlled-drugs','Controlled Drugs','Compliance',12),
    ('expiry','Expiry Management','Inventory',12),('returns','Returns Management','Inventory',10),
    ('adjustments','Stock Adjustments','Inventory',8),('audits','Inventory Audit','Inventory',8),
    ('reorder','Auto Reorder','AI',12),('ai-forecast','AI Inventory Engine','AI',14),
    ('formulary','Formulary','Clinical',8),('pricing','Pharmacy Billing','Finance',10),
    ('claims','Insurance Pharmacy Claims','Insurance',8),('mobile','Mobile Pharmacy App','Mobile',8)
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO pharmacy_report_definitions (
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
  jsonb_build_object('source','database','scope','tenant_hospital_branch_clinic','ai_forecast', report_rows.module_key IN ('ai-forecast','reorder')),
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

UPDATE clinical_menu_items
SET is_enabled = false,
    is_deleted = true,
    updated_at = CURRENT_TIMESTAMP
WHERE menu_key = 'pharmacy'
  AND path = '/clinical-services/pharmacy';
