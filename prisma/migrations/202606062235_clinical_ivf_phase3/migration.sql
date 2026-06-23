-- TOTTECH Clinical Services - Phase 3 IVF & Fertility Center Management
-- Couple-centric IVF subsystem integrated with HMS tenant/hospital/branch/clinic scope.

CREATE TABLE IF NOT EXISTS ivf_couples (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_number VARCHAR(80) NOT NULL,
  female_patient_id INTEGER REFERENCES patients(id),
  male_patient_id INTEGER REFERENCES patients(id),
  marriage_date DATE,
  marriage_duration_months INTEGER,
  infertility_duration_months INTEGER,
  primary_infertility BOOLEAN DEFAULT false,
  secondary_infertility BOOLEAN DEFAULT false,
  female_name VARCHAR(255),
  female_age INTEGER,
  female_height NUMERIC(8,2),
  female_weight NUMERIC(8,2),
  female_bmi NUMERIC(8,2),
  female_blood_group VARCHAR(20),
  female_occupation VARCHAR(255),
  male_name VARCHAR(255),
  male_age INTEGER,
  male_height NUMERIC(8,2),
  male_weight NUMERIC(8,2),
  male_bmi NUMERIC(8,2),
  male_blood_group VARCHAR(20),
  referral_doctor VARCHAR(255),
  referral_hospital VARCHAR(255),
  referral_agent VARCHAR(255),
  campaign_source VARCHAR(255),
  commission_plan VARCHAR(255),
  status VARCHAR(60) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, couple_number)
);

CREATE TABLE IF NOT EXISTS ivf_female_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  patient_id INTEGER REFERENCES patients(id),
  assessment_date DATE DEFAULT CURRENT_DATE,
  menarche_age INTEGER,
  cycle_length INTEGER,
  cycle_regularity VARCHAR(80),
  lmp DATE,
  previous_pregnancies INTEGER,
  previous_ivf_cycles INTEGER,
  previous_miscarriages INTEGER,
  previous_abortions INTEGER,
  previous_ectopic_pregnancy INTEGER,
  amh NUMERIC(10,2),
  fsh NUMERIC(10,2),
  lh NUMERIC(10,2),
  estradiol NUMERIC(10,2),
  progesterone NUMERIC(10,2),
  tsh NUMERIC(10,2),
  prolactin NUMERIC(10,2),
  vitamin_d NUMERIC(10,2),
  hba1c NUMERIC(10,2),
  right_ovary_afc INTEGER,
  left_ovary_afc INTEGER,
  endometrial_thickness NUMERIC(10,2),
  fibroids TEXT,
  polyps TEXT,
  ovarian_cysts TEXT,
  pcos_findings TEXT,
  hsg_result TEXT,
  laparoscopy_result TEXT,
  tubal_patency VARCHAR(120),
  hydrosalpinx TEXT,
  clinical_summary TEXT,
  status VARCHAR(60) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_male_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  patient_id INTEGER REFERENCES patients(id),
  assessment_date DATE DEFAULT CURRENT_DATE,
  volume NUMERIC(10,2),
  liquefaction_time INTEGER,
  sperm_count NUMERIC(12,2),
  motility NUMERIC(8,2),
  progressive_motility NUMERIC(8,2),
  morphology NUMERIC(8,2),
  vitality NUMERIC(8,2),
  ph NUMERIC(8,2),
  viscosity VARCHAR(120),
  dna_fragmentation NUMERIC(8,2),
  oxidative_stress VARCHAR(120),
  mar_test VARCHAR(120),
  testosterone NUMERIC(10,2),
  fsh NUMERIC(10,2),
  lh NUMERIC(10,2),
  prolactin NUMERIC(10,2),
  clinical_summary TEXT,
  status VARCHAR(60) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_treatment_plans (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  plan_number VARCHAR(80) NOT NULL,
  treatment_type VARCHAR(120),
  protocol_type VARCHAR(120),
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  planned_start_date DATE,
  planned_end_date DATE,
  clinical_indication TEXT,
  donor_required BOOLEAN DEFAULT false,
  surrogate_required BOOLEAN DEFAULT false,
  insurance_required BOOLEAN DEFAULT false,
  package_id INTEGER,
  status VARCHAR(60) DEFAULT 'PLANNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, plan_number)
);

CREATE TABLE IF NOT EXISTS ivf_cycles (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  treatment_plan_id INTEGER REFERENCES ivf_treatment_plans(id),
  cycle_number VARCHAR(80) NOT NULL,
  cycle_type VARCHAR(120),
  protocol_type VARCHAR(120),
  start_date DATE,
  expected_retrieval_date DATE,
  expected_transfer_date DATE,
  doctor_id INTEGER REFERENCES doctors(id),
  embryologist_id INTEGER REFERENCES doctors(id),
  status VARCHAR(60) DEFAULT 'ACTIVE',
  outcome VARCHAR(120),
  outcome_date DATE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, cycle_number)
);

CREATE TABLE IF NOT EXISTS ivf_stimulation_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  cycle_day INTEGER,
  monitoring_date DATE DEFAULT CURRENT_DATE,
  doctor_id INTEGER REFERENCES doctors(id),
  medication TEXT,
  dose VARCHAR(120),
  duration VARCHAR(120),
  notes TEXT,
  status VARCHAR(60) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_follicle_tracking (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  stimulation_record_id INTEGER REFERENCES ivf_stimulation_records(id),
  tracking_date DATE DEFAULT CURRENT_DATE,
  right_follicle_1 NUMERIC(8,2),
  right_follicle_2 NUMERIC(8,2),
  right_follicle_3 NUMERIC(8,2),
  right_follicle_4 NUMERIC(8,2),
  right_follicle_5 NUMERIC(8,2),
  left_follicle_1 NUMERIC(8,2),
  left_follicle_2 NUMERIC(8,2),
  left_follicle_3 NUMERIC(8,2),
  left_follicle_4 NUMERIC(8,2),
  left_follicle_5 NUMERIC(8,2),
  endometrial_thickness NUMERIC(8,2),
  impression TEXT,
  status VARCHAR(60) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_trigger_plans (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  trigger_drug VARCHAR(255),
  trigger_dose VARCHAR(120),
  trigger_date TIMESTAMP,
  retrieval_date TIMESTAMP,
  approved_by INTEGER,
  status VARCHAR(60) DEFAULT 'PLANNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_retrievals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  retrieval_number VARCHAR(80) NOT NULL,
  retrieval_date DATE DEFAULT CURRENT_DATE,
  doctor_id INTEGER REFERENCES doctors(id),
  anesthetist_id INTEGER REFERENCES doctors(id),
  procedure_duration_minutes INTEGER,
  follicles_aspirated INTEGER,
  oocytes_retrieved INTEGER,
  mii INTEGER,
  mi INTEGER,
  gv INTEGER,
  degenerated INTEGER,
  bleeding TEXT,
  pain TEXT,
  ohss_risk VARCHAR(120),
  hospital_admission BOOLEAN DEFAULT false,
  status VARCHAR(60) DEFAULT 'COMPLETED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, retrieval_number)
);

CREATE TABLE IF NOT EXISTS ivf_oocytes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  retrieval_id INTEGER REFERENCES ivf_retrievals(id),
  oocyte_number VARCHAR(80),
  maturity VARCHAR(80),
  quality_grade VARCHAR(80),
  current_status VARCHAR(80) DEFAULT 'AVAILABLE',
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_fertilization_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  retrieval_id INTEGER REFERENCES ivf_retrievals(id),
  fertilization_number VARCHAR(80) NOT NULL,
  method VARCHAR(80),
  oocytes_inseminated INTEGER,
  two_pn INTEGER,
  one_pn INTEGER,
  three_pn INTEGER,
  failed_fertilization INTEGER,
  embryologist_id INTEGER REFERENCES doctors(id),
  status VARCHAR(60) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, fertilization_number)
);

CREATE TABLE IF NOT EXISTS ivf_day3_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  embryo_number VARCHAR(80),
  assessment_date DATE DEFAULT CURRENT_DATE,
  cell_count INTEGER,
  fragmentation VARCHAR(80),
  grade VARCHAR(80),
  embryologist_id INTEGER REFERENCES doctors(id),
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_day5_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  embryo_number VARCHAR(80),
  assessment_date DATE DEFAULT CURRENT_DATE,
  blastocyst_grade VARCHAR(80),
  expansion VARCHAR(80),
  icm_grade VARCHAR(80),
  te_grade VARCHAR(80),
  embryologist_id INTEGER REFERENCES doctors(id),
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_embryos (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  embryo_id VARCHAR(80) NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  creation_date DATE DEFAULT CURRENT_DATE,
  current_status VARCHAR(80) DEFAULT 'FRESH',
  fertilization_method VARCHAR(80),
  day3_grade VARCHAR(80),
  day5_grade VARCHAR(80),
  pgt_status VARCHAR(80),
  storage_location_id INTEGER,
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, embryo_id)
);

CREATE TABLE IF NOT EXISTS ivf_freezing_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  cryo_number VARCHAR(80) NOT NULL,
  embryo_id INTEGER REFERENCES ivf_embryos(id),
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  freezing_date DATE DEFAULT CURRENT_DATE,
  method VARCHAR(80),
  tank_number VARCHAR(80),
  canister VARCHAR(80),
  straw_number VARCHAR(80),
  location_code VARCHAR(120),
  status VARCHAR(80) DEFAULT 'FROZEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, cryo_number)
);

CREATE TABLE IF NOT EXISTS ivf_storage_locations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  location_code VARCHAR(120) NOT NULL,
  tank_number VARCHAR(80),
  canister VARCHAR(80),
  straw_number VARCHAR(80),
  material_type VARCHAR(80),
  current_status VARCHAR(80) DEFAULT 'AVAILABLE',
  couple_id INTEGER REFERENCES ivf_couples(id),
  embryo_id INTEGER REFERENCES ivf_embryos(id),
  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, location_code)
);

CREATE TABLE IF NOT EXISTS ivf_embryo_transfers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  transfer_number VARCHAR(80) NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  transfer_date DATE DEFAULT CURRENT_DATE,
  doctor_id INTEGER REFERENCES doctors(id),
  embryologist_id INTEGER REFERENCES doctors(id),
  transfer_type VARCHAR(80),
  embryo_count INTEGER,
  embryo_grade VARCHAR(80),
  embryo_age_days INTEGER,
  catheter_type VARCHAR(120),
  difficulty VARCHAR(120),
  status VARCHAR(80) DEFAULT 'COMPLETED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, transfer_number)
);

CREATE TABLE IF NOT EXISTS ivf_pregnancies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  transfer_id INTEGER REFERENCES ivf_embryo_transfers(id),
  beta_hcg_date DATE,
  beta_hcg_result NUMERIC(12,2),
  beta_hcg_status VARCHAR(120),
  ultrasound_date DATE,
  gestational_sac BOOLEAN,
  yolk_sac BOOLEAN,
  heartbeat BOOLEAN,
  crl NUMERIC(10,2),
  pregnancy_outcome VARCHAR(120),
  outcome_date DATE,
  status VARCHAR(80) DEFAULT 'TRACKING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_donors (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  donor_number VARCHAR(80) NOT NULL,
  donor_type VARCHAR(80),
  age INTEGER,
  blood_group VARCHAR(20),
  education VARCHAR(255),
  medical_history TEXT,
  genetic_screening TEXT,
  availability_status VARCHAR(80) DEFAULT 'AVAILABLE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, donor_number)
);

CREATE TABLE IF NOT EXISTS ivf_surrogates (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  surrogate_number VARCHAR(80) NOT NULL,
  age INTEGER,
  previous_pregnancies INTEGER,
  medical_history TEXT,
  legal_clearance BOOLEAN DEFAULT false,
  availability_status VARCHAR(80) DEFAULT 'AVAILABLE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, surrogate_number)
);

CREATE TABLE IF NOT EXISTS ivf_packages (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  package_cost NUMERIC(14,2) DEFAULT 0,
  medication_included BOOLEAN DEFAULT false,
  procedure_included BOOLEAN DEFAULT true,
  package_details JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_billing (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  invoice_number VARCHAR(80) NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  package_id INTEGER REFERENCES ivf_packages(id),
  additional_procedures NUMERIC(14,2) DEFAULT 0,
  discounts NUMERIC(14,2) DEFAULT 0,
  taxes NUMERIC(14,2) DEFAULT 0,
  total NUMERIC(14,2) DEFAULT 0,
  paid_amount NUMERIC(14,2) DEFAULT 0,
  balance_amount NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS ivf_referrals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  referral_source VARCHAR(120),
  referral_doctor VARCHAR(255),
  referral_hospital VARCHAR(255),
  referral_agent VARCHAR(255),
  campaign VARCHAR(255),
  commission_type VARCHAR(80),
  percentage NUMERIC(8,2),
  fixed_amount NUMERIC(14,2),
  approval_status VARCHAR(80) DEFAULT 'PENDING',
  payment_status VARCHAR(80) DEFAULT 'UNPAID',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_timeline (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  patient_id INTEGER REFERENCES patients(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
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

CREATE TABLE IF NOT EXISTS ivf_alerts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
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

CREATE TABLE IF NOT EXISTS ivf_ai_summaries (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  summary_type VARCHAR(120),
  prompt TEXT,
  answer TEXT,
  confidence NUMERIC(8,2),
  clinical_review_required BOOLEAN DEFAULT true,
  sources JSONB DEFAULT '[]'::jsonb,
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
    'ivf_protocol_medications',
    'ivf_cycle_medications',
    'ivf_scan_appointments',
    'ivf_lab_orders',
    'ivf_hormone_results',
    'ivf_partner_investigations',
    'ivf_genetic_tests',
    'ivf_embryo_grading_history',
    'ivf_cryo_tanks',
    'ivf_cryo_canisters',
    'ivf_cryo_straws',
    'ivf_sperm_freezing_records',
    'ivf_oocyte_freezing_records',
    'ivf_thawing_records',
    'ivf_pgt_records',
    'ivf_donor_screenings',
    'ivf_donor_matches',
    'ivf_surrogacy_agreements',
    'ivf_legal_clearances',
    'ivf_pregnancy_visits',
    'ivf_outcome_records',
    'ivf_package_items',
    'ivf_billing_items',
    'ivf_payments',
    'ivf_referral_payments',
    'ivf_quality_indicators',
    'ivf_kpi_snapshots',
    'ivf_lab_witness_logs',
    'ivf_incident_reports',
    'ivf_inventory_items',
    'ivf_inventory_movements',
    'ivf_procedure_checklists',
    'ivf_anesthesia_notes',
    'ivf_recovery_notes',
    'ivf_counselling_notes',
    'ivf_followups',
    'ivf_notifications',
    'ivf_workflow_tasks',
    'ivf_approvals',
    'ivf_report_snapshots',
    'ivf_documents',
    'ivf_consents',
    'ivf_cycle_reviews',
    'ivf_doctor_success_metrics',
    'ivf_age_success_metrics',
    'ivf_protocol_success_metrics'
  ]
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL,
        hospital_id INTEGER NOT NULL,
        branch_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        couple_id INTEGER REFERENCES ivf_couples(id),
        patient_id INTEGER REFERENCES patients(id),
        cycle_id INTEGER REFERENCES ivf_cycles(id),
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

CREATE TABLE IF NOT EXISTS ivf_screen_definitions (
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

CREATE TABLE IF NOT EXISTS ivf_api_endpoint_definitions (
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

CREATE TABLE IF NOT EXISTS ivf_report_definitions (
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

CREATE INDEX IF NOT EXISTS idx_ivf_couples_scope ON ivf_couples(tenant_id, hospital_id, branch_id, clinic_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_ivf_cycles_scope ON ivf_cycles(tenant_id, hospital_id, branch_id, clinic_id, couple_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_ivf_embryos_scope ON ivf_embryos(tenant_id, hospital_id, branch_id, clinic_id, couple_id, current_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_ivf_timeline_scope ON ivf_timeline(tenant_id, hospital_id, branch_id, clinic_id, couple_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ivf_reports_scope ON ivf_report_definitions(tenant_id, hospital_id, branch_id, module_key, is_deleted);

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
    ('ivf_core','IVF Command Center','/clinical-services/ivf','ivf','clinical.ivf.read',80),
    ('ivf_couples','Couple Registration','/clinical-services/ivf/couples','ivf_couples','clinical.ivf.couples.read',81),
    ('ivf_assessment','Fertility Assessment','/clinical-services/ivf/female-assessment','ivf_assessment','clinical.ivf.assessment.read',82),
    ('ivf_treatment','Treatment Planning','/clinical-services/ivf/treatment-plans','ivf_treatment','clinical.ivf.treatment.read',83),
    ('ivf_cycles','IVF Cycles','/clinical-services/ivf/cycles','ivf_cycles','clinical.ivf.cycles.read',84),
    ('ivf_embryology','Embryology Lab','/clinical-services/ivf/embryology','ivf_embryology','clinical.ivf.embryology.read',85),
    ('ivf_cryo','Cryo Storage','/clinical-services/ivf/cryo','ivf_cryo','clinical.ivf.cryo.read',86),
    ('ivf_transfer','Embryo Transfer','/clinical-services/ivf/transfers','ivf_transfer','clinical.ivf.transfer.read',87),
    ('ivf_pregnancy','Pregnancy Tracking','/clinical-services/ivf/pregnancies','ivf_pregnancy','clinical.ivf.pregnancy.read',88),
    ('ivf_donor','Donor Management','/clinical-services/ivf/donors','ivf_donor','clinical.ivf.donor.read',89),
    ('ivf_surrogacy','Surrogacy','/clinical-services/ivf/surrogacy','ivf_surrogacy','clinical.ivf.surrogacy.read',90),
    ('ivf_billing','IVF Billing','/clinical-services/ivf/billing','ivf_billing','clinical.ivf.billing.read',91),
    ('ivf_referrals','IVF Referrals','/clinical-services/ivf/referrals','ivf_referrals','clinical.ivf.referrals.read',92),
    ('ivf_ai','IVF AI','/clinical-services/ivf/ai','ivf_ai','clinical.ivf.ai.read',93)
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
modules(module_key, module_name, route_path, screen_count, api_count, report_count) AS (
  VALUES
    ('dashboard','IVF Master Dashboard','/clinical-services/ivf',8,12,10),
    ('couples','Couple Registration','/clinical-services/ivf/couples',8,16,10),
    ('female-assessment','Female Fertility Assessment','/clinical-services/ivf/female-assessment',6,14,8),
    ('male-assessment','Male Fertility Assessment','/clinical-services/ivf/male-assessment',5,12,8),
    ('treatment-plans','Treatment Planning','/clinical-services/ivf/treatment-plans',5,14,8),
    ('cycles','IVF Cycles','/clinical-services/ivf/cycles',6,16,12),
    ('stimulation','Stimulation Management','/clinical-services/ivf/stimulation',5,14,10),
    ('retrievals','Egg Retrieval','/clinical-services/ivf/retrievals',5,14,10),
    ('embryology','Embryology Lab','/clinical-services/ivf/embryology',7,18,16),
    ('embryos','Embryo Management','/clinical-services/ivf/embryos',5,14,10),
    ('cryo','Cryopreservation','/clinical-services/ivf/cryo',5,14,12),
    ('transfers','Embryo Transfer','/clinical-services/ivf/transfers',5,14,10),
    ('pregnancies','Pregnancy Tracking','/clinical-services/ivf/pregnancies',5,14,12),
    ('donors','Donor Management','/clinical-services/ivf/donors',4,12,8),
    ('surrogacy','Surrogacy','/clinical-services/ivf/surrogacy',4,10,8),
    ('billing','IVF Billing','/clinical-services/ivf/billing',4,14,14),
    ('referrals','IVF Referrals','/clinical-services/ivf/referrals',3,10,8),
    ('ai','TOTTECH IVF AI','/clinical-services/ivf/ai',4,12,14)
),
screen_rows AS (
  SELECT modules.*, generate_series(1, screen_count) AS n FROM modules
)
INSERT INTO ivf_screen_definitions (
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
  jsonb_build_array('Profile', 'Clinical Fields', 'Workflow', 'Audit'),
  jsonb_build_array('Tenant Scope', 'Hospital Scope', 'Branch Scope', 'Couple Context', 'Cycle Context'),
  jsonb_build_array('Create', 'Review', 'Approve', 'Audit', 'Report'),
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
    ('dashboard','IVF Master Dashboard',12),
    ('couples','Couple Registration',16),
    ('female-assessment','Female Fertility Assessment',14),
    ('male-assessment','Male Fertility Assessment',12),
    ('treatment-plans','Treatment Planning',14),
    ('cycles','IVF Cycles',16),
    ('stimulation','Stimulation Management',14),
    ('retrievals','Egg Retrieval',14),
    ('embryology','Embryology Lab',18),
    ('embryos','Embryo Management',14),
    ('cryo','Cryopreservation',14),
    ('transfers','Embryo Transfer',14),
    ('pregnancies','Pregnancy Tracking',14),
    ('donors','Donor Management',12),
    ('surrogacy','Surrogacy',10),
    ('billing','IVF Billing',14),
    ('referrals','IVF Referrals',10),
    ('ai','TOTTECH IVF AI',12)
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
)
INSERT INTO ivf_api_endpoint_definitions (
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
  '/api/clinical/ivf/' || api_rows.module_key || '/' || api_rows.n,
  'clinical.ivf.' || replace(api_rows.module_key, '-', '_') || '.execute',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','clinic_id','required'),
  jsonb_build_object('audit','required','timeline','required','clinical_review_required', api_rows.module_key = 'ai'),
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
    ('dashboard','IVF Master Dashboard','Executive',10),
    ('couples','Couple Registration','Clinical',10),
    ('female-assessment','Female Fertility Assessment','Clinical',8),
    ('male-assessment','Male Fertility Assessment','Clinical',8),
    ('treatment-plans','Treatment Planning','Clinical',8),
    ('cycles','IVF Cycles','Clinical',12),
    ('stimulation','Stimulation Management','Clinical',10),
    ('retrievals','Egg Retrieval','Clinical',10),
    ('embryology','Embryology Lab','Embryology',16),
    ('embryos','Embryo Management','Embryology',10),
    ('cryo','Cryopreservation','Embryology',12),
    ('transfers','Embryo Transfer','Clinical',10),
    ('pregnancies','Pregnancy Tracking','Clinical',12),
    ('donors','Donor Management','Clinical',8),
    ('surrogacy','Surrogacy','Clinical',8),
    ('billing','IVF Billing','Business',14),
    ('referrals','IVF Referrals','Business',8),
    ('ai','TOTTECH IVF AI','AI',14)
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO ivf_report_definitions (
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
  jsonb_build_object('source','database','scope','tenant_hospital_branch_clinic','ai_review', report_rows.module_key = 'ai'),
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
