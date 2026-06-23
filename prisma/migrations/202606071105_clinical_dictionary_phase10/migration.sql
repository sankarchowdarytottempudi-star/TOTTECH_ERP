-- TOTTECH Clinical Services - Phase 10 Database Dictionary + Master Data Model + Entity Relationships

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS clinical_dictionary_entity_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  group_key VARCHAR(120) NOT NULL,
  group_name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, group_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  group_id UUID REFERENCES clinical_dictionary_entity_groups(id),
  group_key VARCHAR(120) NOT NULL,
  entity_key VARCHAR(180) NOT NULL,
  entity_name VARCHAR(255) NOT NULL,
  table_name VARCHAR(180) NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80) DEFAULT 'BUSINESS',
  is_business_table BOOLEAN DEFAULT true,
  physical_table_required BOOLEAN DEFAULT true,
  tenant_policy VARCHAR(120) DEFAULT 'tenant_hospital_branch',
  generation_status VARCHAR(80) DEFAULT 'READY',
  postgres_schema_blueprint JSONB DEFAULT '{}'::jsonb,
  prisma_model_blueprint TEXT,
  nestjs_entity_blueprint TEXT,
  dto_blueprint JSONB DEFAULT '{}'::jsonb,
  rbac_actions JSONB DEFAULT '["create","read","update","delete","export"]'::jsonb,
  report_enabled BOOLEAN DEFAULT true,
  description TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, entity_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  entity_id UUID REFERENCES clinical_dictionary_entities(id),
  entity_key VARCHAR(180) NOT NULL,
  field_key VARCHAR(180) NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  column_name VARCHAR(180) NOT NULL,
  data_type VARCHAR(120) NOT NULL,
  postgres_type VARCHAR(120) NOT NULL,
  prisma_type VARCHAR(120) NOT NULL,
  nestjs_type VARCHAR(120),
  is_primary_key BOOLEAN DEFAULT false,
  is_foreign_key BOOLEAN DEFAULT false,
  is_required BOOLEAN DEFAULT false,
  is_nullable BOOLEAN DEFAULT true,
  is_unique BOOLEAN DEFAULT false,
  is_indexed BOOLEAN DEFAULT false,
  default_expression TEXT,
  max_length INTEGER,
  numeric_precision INTEGER,
  numeric_scale INTEGER,
  enum_values JSONB DEFAULT '[]'::jsonb,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  ui_component VARCHAR(120),
  sort_order INTEGER DEFAULT 0,
  description TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, entity_key, field_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  relationship_key VARCHAR(220) NOT NULL,
  from_entity_id UUID REFERENCES clinical_dictionary_entities(id),
  to_entity_id UUID REFERENCES clinical_dictionary_entities(id),
  from_entity_key VARCHAR(180) NOT NULL,
  to_entity_key VARCHAR(180) NOT NULL,
  from_column VARCHAR(180) NOT NULL,
  to_column VARCHAR(180) NOT NULL DEFAULT 'id',
  relation_type VARCHAR(80) DEFAULT 'many_to_one',
  cardinality VARCHAR(80) DEFAULT 'N:1',
  on_delete VARCHAR(80) DEFAULT 'RESTRICT',
  on_update VARCHAR(80) DEFAULT 'CASCADE',
  prisma_relation TEXT,
  description TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, relationship_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  entity_id UUID REFERENCES clinical_dictionary_entities(id),
  entity_key VARCHAR(180) NOT NULL,
  constraint_key VARCHAR(220) NOT NULL,
  constraint_name VARCHAR(255) NOT NULL,
  constraint_type VARCHAR(80) NOT NULL,
  columns JSONB DEFAULT '[]'::jsonb,
  expression TEXT,
  validation_message TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, constraint_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_indexes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  entity_id UUID REFERENCES clinical_dictionary_entities(id),
  entity_key VARCHAR(180) NOT NULL,
  index_key VARCHAR(220) NOT NULL,
  index_name VARCHAR(255) NOT NULL,
  index_type VARCHAR(80) DEFAULT 'BTREE',
  columns JSONB DEFAULT '[]'::jsonb,
  is_unique BOOLEAN DEFAULT false,
  where_clause TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, index_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(180) NOT NULL,
  entity_group VARCHAR(120) NOT NULL,
  retention_period VARCHAR(120) NOT NULL,
  retention_years INTEGER,
  legal_basis TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_archival_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(180) NOT NULL,
  archive_target VARCHAR(180) NOT NULL,
  trigger_condition TEXT NOT NULL,
  archive_storage VARCHAR(120) DEFAULT 'S3_COMPATIBLE',
  restore_sla VARCHAR(120),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_er_diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  diagram_key VARCHAR(180) NOT NULL,
  diagram_name VARCHAR(255) NOT NULL,
  diagram_type VARCHAR(80) DEFAULT 'MERMAID',
  entity_keys JSONB DEFAULT '[]'::jsonb,
  relationship_keys JSONB DEFAULT '[]'::jsonb,
  diagram_text TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, diagram_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_generation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  rule_key VARCHAR(180) NOT NULL,
  generator_target VARCHAR(120) NOT NULL,
  rule_name VARCHAR(255) NOT NULL,
  rule_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, rule_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  blueprint_key VARCHAR(180) NOT NULL,
  blueprint_type VARCHAR(120) NOT NULL,
  entity_key VARCHAR(180),
  blueprint_name VARCHAR(255) NOT NULL,
  blueprint_text TEXT,
  blueprint_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, blueprint_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_screen_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  screen_key VARCHAR(180) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  route_path VARCHAR(255),
  section_definitions JSONB DEFAULT '[]'::jsonb,
  workflow_definitions JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, screen_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_api_endpoint_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, endpoint_key)
);

CREATE TABLE IF NOT EXISTS clinical_dictionary_report_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, report_key)
);

CREATE INDEX IF NOT EXISTS idx_clinical_dictionary_entities_scope ON clinical_dictionary_entities(tenant_id, hospital_id, branch_id, group_key, module_key, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_dictionary_fields_scope ON clinical_dictionary_fields(tenant_id, hospital_id, branch_id, entity_key, column_name, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_dictionary_relationships_scope ON clinical_dictionary_relationships(tenant_id, hospital_id, branch_id, from_entity_key, to_entity_key, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_dictionary_constraints_scope ON clinical_dictionary_constraints(tenant_id, hospital_id, branch_id, entity_key, constraint_type, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_dictionary_indexes_scope ON clinical_dictionary_indexes(tenant_id, hospital_id, branch_id, entity_key, index_type, is_deleted);

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
groups(group_key, group_name, description, sort_order) AS (
  VALUES
    ('platform','Platform','Tenants, subscriptions, licenses, feature flags, and system settings.',1),
    ('hospital','Hospital','Hospitals, branches, departments, units, wards, rooms, and beds.',2),
    ('users','Users','Users, roles, permissions, sessions, and MFA settings.',3),
    ('patients','Patients','Patient master, contacts, addresses, documents, allergies, conditions, and preferences.',4),
    ('appointments','Appointments','Appointments, slots, doctor availability, schedules, and status history.',5),
    ('op','Outpatient','OP visits, diagnosis, prescriptions, lab/radiology orders, and procedures.',6),
    ('ip','Inpatient','Admissions, bed allocation, transfers, discharges, rounds, and care plans.',7),
    ('nursing','Nursing','Nursing assessments, notes, vitals, medication administration, and incidents.',8),
    ('doctors','Doctors','Doctors, qualifications, specializations, schedules, and incentives.',9),
    ('ivf','IVF','Couples, assessments, cycles, embryology, stimulation, retrievals, transfers, and cryo.',10),
    ('lab','Laboratory','Tests, categories, parameters, orders, samples, results, and reports.',11),
    ('radiology','Radiology','Orders, studies, series, DICOM files, and reports.',12),
    ('pharmacy','Pharmacy','Medicines, batches, inventory, sales, returns, and vendors.',13),
    ('inventory','Inventory','Warehouses, locations, stock movements, transfers, and adjustments.',14),
    ('billing','Billing','Charge master, invoices, invoice items, payments, and refunds.',15),
    ('insurance','Insurance','Insurance companies, TPAs, policies, claims, documents, and pre-authorizations.',16),
    ('referral','Referral','Referrals, rules, commissions, and commission payments.',17),
    ('finance','Finance','Accounts, journals, budgets, cost centers, profit centers, and assets.',18),
    ('hr','HR','Employees, attendance, leave, payroll, and performance reviews.',19),
    ('mobile','Mobile','Devices, notifications, chat messages, and telemedicine sessions.',20),
    ('ai','AI','AI requests, responses, feedback, predictions, and audit logs.',21),
    ('audit','Audit','Audit logs, login logs, security events, and data exports.',22),
    ('terminology','Clinical Terminology','ICD, SNOMED, LOINC, CPT, and healthcare terminology.',23),
    ('analytics','Analytics','Fact tables, dimensions, reports, dashboards, and forecast models.',24),
    ('mdm','Master Data Management','Reference data, canonical keys, sync, lineage, and entity governance.',25)
)
INSERT INTO clinical_dictionary_entity_groups (
  tenant_id, hospital_id, branch_id, clinic_id, group_key, group_name, description, sort_order,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, groups.group_key, groups.group_name, groups.description, groups.sort_order,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
CROSS JOIN groups
ON CONFLICT (tenant_id, hospital_id, branch_id, group_key)
DO UPDATE SET
  group_name = EXCLUDED.group_name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
explicit_entities(group_key, entity_key, entity_name, table_name, module_key) AS (
  VALUES
    ('platform','tenants','Tenants','tenants','platform'),('platform','subscription_plans','Subscription Plans','subscription_plans','platform'),('platform','subscriptions','Subscriptions','subscriptions','platform'),('platform','licenses','Licenses','licenses','platform'),('platform','feature_flags','Feature Flags','feature_flags','platform'),('platform','system_settings','System Settings','system_settings','platform'),
    ('hospital','hospitals','Hospitals','hospitals','hospital'),('hospital','branches','Branches','branches','hospital'),('hospital','departments','Departments','departments','hospital'),('hospital','units','Units','units','hospital'),('hospital','wards','Wards','wards','hospital'),('hospital','rooms','Rooms','rooms','hospital'),('hospital','beds','Beds','beds','hospital'),
    ('users','users','Users','users','users'),('users','roles','Roles','roles','users'),('users','permissions','Permissions','permissions','users'),('users','user_roles','User Roles','user_roles','users'),('users','role_permissions','Role Permissions','role_permissions','users'),('users','user_sessions','User Sessions','user_sessions','users'),('users','mfa_settings','MFA Settings','mfa_settings','users'),
    ('patients','patients','Patients','patients','patients'),('patients','patient_contacts','Patient Contacts','patient_contacts','patients'),('patients','patient_addresses','Patient Addresses','patient_addresses','patients'),('patients','patient_documents','Patient Documents','patient_documents','patients'),('patients','patient_allergies','Patient Allergies','patient_allergies','patients'),('patients','patient_conditions','Patient Conditions','patient_conditions','patients'),('patients','patient_vaccinations','Patient Vaccinations','patient_vaccinations','patients'),('patients','patient_preferences','Patient Preferences','patient_preferences','patients'),('patients','patient_tags','Patient Tags','patient_tags','patients'),
    ('appointments','appointments','Appointments','appointments','appointments'),('appointments','appointment_slots','Appointment Slots','appointment_slots','appointments'),('appointments','doctor_availability','Doctor Availability','doctor_availability','appointments'),('appointments','appointment_doctor_schedules','Appointment Doctor Schedules','appointment_doctor_schedules','appointments'),('appointments','appointment_status_history','Appointment Status History','appointment_status_history','appointments'),
    ('op','op_visits','OP Visits','op_visits','op'),('op','op_diagnosis','OP Diagnosis','op_diagnosis','op'),('op','op_prescriptions','OP Prescriptions','op_prescriptions','op'),('op','op_lab_orders','OP Lab Orders','op_lab_orders','op'),('op','op_radiology_orders','OP Radiology Orders','op_radiology_orders','op'),('op','op_procedures','OP Procedures','op_procedures','op'),
    ('ip','admissions','Admissions','admissions','ip'),('ip','bed_allocations','Bed Allocations','bed_allocations','ip'),('ip','transfers','Transfers','transfers','ip'),('ip','discharges','Discharges','discharges','ip'),('ip','rounds','Rounds','rounds','ip'),('ip','care_plans','Care Plans','care_plans','ip'),
    ('nursing','nursing_assessments','Nursing Assessments','nursing_assessments','nursing'),('nursing','nursing_notes','Nursing Notes','nursing_notes','nursing'),('nursing','vitals','Vitals','vitals','nursing'),('nursing','medication_administration','Medication Administration','medication_administration','nursing'),('nursing','incidents','Incidents','incidents','nursing'),
    ('doctors','doctors','Doctors','doctors','doctors'),('doctors','doctor_qualifications','Doctor Qualifications','doctor_qualifications','doctors'),('doctors','doctor_specializations','Doctor Specializations','doctor_specializations','doctors'),('doctors','doctor_schedules','Doctor Schedules','doctor_schedules','doctors'),('doctors','doctor_incentives','Doctor Incentives','doctor_incentives','doctors'),
    ('ivf','couples','Couples','couples','ivf'),('ivf','couple_notes','Couple Notes','couple_notes','ivf'),('ivf','fertility_assessments','Fertility Assessments','fertility_assessments','ivf'),('ivf','female_assessments','Female Assessments','female_assessments','ivf'),('ivf','hormone_profiles','Hormone Profiles','hormone_profiles','ivf'),('ivf','ultrasounds','Ultrasounds','ultrasounds','ivf'),('ivf','follicle_tracking','Follicle Tracking','follicle_tracking','ivf'),('ivf','male_assessments','Male Assessments','male_assessments','ivf'),('ivf','semen_analysis','Semen Analysis','semen_analysis','ivf'),('ivf','genetic_tests','Genetic Tests','genetic_tests','ivf'),('ivf','ivf_cycles','IVF Cycles','ivf_cycles','ivf'),('ivf','protocols','Protocols','protocols','ivf'),('ivf','stimulation_records','Stimulation Records','stimulation_records','ivf'),('ivf','retrievals','Retrievals','retrievals','ivf'),('ivf','ivf_transfers','IVF Transfers','ivf_transfers','ivf'),('ivf','oocytes','Oocytes','oocytes','ivf'),('ivf','fertilization','Fertilization','fertilization','ivf'),('ivf','embryos','Embryos','embryos','ivf'),('ivf','blastocysts','Blastocysts','blastocysts','ivf'),('ivf','cryopreservation','Cryopreservation','cryopreservation','ivf'),
    ('lab','tests','Tests','tests','lab'),('lab','test_categories','Test Categories','test_categories','lab'),('lab','test_parameters','Test Parameters','test_parameters','lab'),('lab','orders','Orders','orders','lab'),('lab','samples','Samples','samples','lab'),('lab','results','Results','results','lab'),('lab','reports','Reports','reports','lab'),
    ('radiology','radiology_orders','Radiology Orders','radiology_orders','radiology'),('radiology','studies','Studies','studies','radiology'),('radiology','series','Series','series','radiology'),('radiology','dicom_files','DICOM Files','dicom_files','radiology'),('radiology','radiology_reports','Radiology Reports','radiology_reports','radiology'),
    ('pharmacy','medicines','Medicines','medicines','pharmacy'),('pharmacy','medicine_batches','Medicine Batches','medicine_batches','pharmacy'),('pharmacy','inventory','Inventory','inventory','pharmacy'),('pharmacy','sales','Sales','sales','pharmacy'),('pharmacy','sale_items','Sale Items','sale_items','pharmacy'),('pharmacy','returns','Returns','returns','pharmacy'),('pharmacy','vendors','Vendors','vendors','pharmacy'),
    ('inventory','warehouses','Warehouses','warehouses','inventory'),('inventory','warehouse_locations','Warehouse Locations','warehouse_locations','inventory'),('inventory','stock_movements','Stock Movements','stock_movements','inventory'),('inventory','stock_transfers','Stock Transfers','stock_transfers','inventory'),('inventory','stock_adjustments','Stock Adjustments','stock_adjustments','inventory'),
    ('billing','charge_master','Charge Master','charge_master','billing'),('billing','invoices','Invoices','invoices','billing'),('billing','invoice_items','Invoice Items','invoice_items','billing'),('billing','payments','Payments','payments','billing'),('billing','refunds','Refunds','refunds','billing'),
    ('insurance','insurance_companies','Insurance Companies','insurance_companies','insurance'),('insurance','tpas','TPAs','tpas','insurance'),('insurance','policies','Policies','policies','insurance'),('insurance','claims','Claims','claims','insurance'),('insurance','claim_documents','Claim Documents','claim_documents','insurance'),('insurance','pre_authorizations','Pre Authorizations','pre_authorizations','insurance'),
    ('referral','referrals','Referrals','referrals','referral'),('referral','referral_rules','Referral Rules','referral_rules','referral'),('referral','commissions','Commissions','commissions','referral'),('referral','commission_payments','Commission Payments','commission_payments','referral'),
    ('finance','accounts','Accounts','accounts','finance'),('finance','journal_entries','Journal Entries','journal_entries','finance'),('finance','journal_lines','Journal Lines','journal_lines','finance'),('finance','budgets','Budgets','budgets','finance'),('finance','cost_centers','Cost Centers','cost_centers','finance'),('finance','profit_centers','Profit Centers','profit_centers','finance'),('finance','assets','Assets','assets','finance'),
    ('hr','employees','Employees','employees','hr'),('hr','attendance','Attendance','attendance','hr'),('hr','leave_requests','Leave Requests','leave_requests','hr'),('hr','payroll','Payroll','payroll','hr'),('hr','performance_reviews','Performance Reviews','performance_reviews','hr'),
    ('mobile','mobile_devices','Mobile Devices','mobile_devices','mobile'),('mobile','notifications','Notifications','notifications','mobile'),('mobile','chat_messages','Chat Messages','chat_messages','mobile'),('mobile','telemedicine_sessions','Telemedicine Sessions','telemedicine_sessions','mobile'),
    ('ai','ai_requests','AI Requests','ai_requests','ai'),('ai','ai_responses','AI Responses','ai_responses','ai'),('ai','ai_feedback','AI Feedback','ai_feedback','ai'),('ai','ai_predictions','AI Predictions','ai_predictions','ai'),('ai','ai_audit_logs','AI Audit Logs','ai_audit_logs','ai'),
    ('audit','audit_logs','Audit Logs','audit_logs','audit'),('audit','login_logs','Login Logs','login_logs','audit'),('audit','security_events','Security Events','security_events','audit'),('audit','data_exports','Data Exports','data_exports','audit'),
    ('terminology','icd10_codes','ICD10 Codes','icd10_codes','terminology'),('terminology','icd11_codes','ICD11 Codes','icd11_codes','terminology'),('terminology','snomed_codes','SNOMED Codes','snomed_codes','terminology'),('terminology','loinc_codes','LOINC Codes','loinc_codes','terminology'),('terminology','cpt_codes','CPT Codes','cpt_codes','terminology'),
    ('analytics','fact_revenue','Fact Revenue','fact_revenue','analytics'),('analytics','fact_visits','Fact Visits','fact_visits','analytics'),('analytics','fact_claims','Fact Claims','fact_claims','analytics'),('analytics','fact_ivf','Fact IVF','fact_ivf','analytics'),('analytics','fact_lab','Fact Lab','fact_lab','analytics'),('analytics','fact_pharmacy','Fact Pharmacy','fact_pharmacy','analytics'),('analytics','dim_patient','Dim Patient','dim_patient','analytics'),('analytics','dim_doctor','Dim Doctor','dim_doctor','analytics'),('analytics','dim_department','Dim Department','dim_department','analytics'),('analytics','dim_hospital','Dim Hospital','dim_hospital','analytics'),('analytics','dim_date','Dim Date','dim_date','analytics')
),
generated_entities AS (
  SELECT
    g.group_key,
    g.group_key || '_entity_' || LPAD(n::text, 3, '0') AS entity_key,
    initcap(replace(g.group_key, '_', ' ')) || ' Entity ' || LPAD(n::text, 3, '0') AS entity_name,
    g.group_key || '_entity_' || LPAD(n::text, 3, '0') AS table_name,
    g.group_key AS module_key
  FROM (SELECT group_key FROM clinical_dictionary_entity_groups cg JOIN scope s ON s.tenant_id = cg.tenant_id AND s.hospital_id = cg.hospital_id AND s.branch_id = cg.branch_id) g
  CROSS JOIN generate_series(1, 42) AS n
),
all_entities AS (
  SELECT * FROM explicit_entities
  UNION ALL
  SELECT * FROM generated_entities
)
INSERT INTO clinical_dictionary_entities (
  tenant_id, hospital_id, branch_id, clinic_id, group_id, group_key, entity_key, entity_name, table_name, module_key,
  postgres_schema_blueprint, prisma_model_blueprint, nestjs_entity_blueprint, dto_blueprint, description,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  eg.id,
  all_entities.group_key,
  all_entities.entity_key,
  all_entities.entity_name,
  all_entities.table_name,
  all_entities.module_key,
  jsonb_build_object(
    'primary_key','id UUID PRIMARY KEY',
    'tenant_fields', jsonb_build_array('tenant_id UUID NOT NULL','hospital_id UUID NOT NULL','branch_id UUID NOT NULL'),
    'audit_fields', jsonb_build_array('created_by UUID','updated_by UUID','created_at TIMESTAMP','updated_at TIMESTAMP','deleted_at TIMESTAMP','version INTEGER')
  ),
  'model ' || regexp_replace(initcap(replace(all_entities.entity_key, '_', ' ')), '\s+', '', 'g') || ' { id String @id @default(uuid()) }',
  'export class ' || regexp_replace(initcap(replace(all_entities.entity_key, '_', ' ')), '\s+', '', 'g') || 'Entity {}',
  jsonb_build_object('createDto', all_entities.entity_key || 'CreateDto', 'updateDto', all_entities.entity_key || 'UpdateDto'),
  'Generator-ready dictionary entity for ' || all_entities.entity_name,
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  true,
  false
FROM scope
JOIN clinical_dictionary_entity_groups eg ON eg.tenant_id = scope.tenant_id AND eg.hospital_id = scope.hospital_id AND eg.branch_id = scope.branch_id
JOIN all_entities ON all_entities.group_key = eg.group_key
ON CONFLICT (tenant_id, hospital_id, branch_id, entity_key)
DO UPDATE SET
  entity_name = EXCLUDED.entity_name,
  table_name = EXCLUDED.table_name,
  module_key = EXCLUDED.module_key,
  postgres_schema_blueprint = EXCLUDED.postgres_schema_blueprint,
  prisma_model_blueprint = EXCLUDED.prisma_model_blueprint,
  nestjs_entity_blueprint = EXCLUDED.nestjs_entity_blueprint,
  dto_blueprint = EXCLUDED.dto_blueprint,
  is_active = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
base_fields(field_key, field_name, column_name, data_type, postgres_type, prisma_type, nestjs_type, is_primary_key, is_required, is_nullable, is_indexed, default_expression, sort_order) AS (
  VALUES
    ('id','ID','id','UUID','UUID','String','string',true,true,false,true,'gen_random_uuid()',1),
    ('tenant_id','Tenant ID','tenant_id','UUID','UUID','String','string',false,true,false,true,NULL,2),
    ('hospital_id','Hospital ID','hospital_id','UUID','UUID','String','string',false,true,false,true,NULL,3),
    ('branch_id','Branch ID','branch_id','UUID','UUID','String','string',false,true,false,true,NULL,4),
    ('created_by','Created By','created_by','UUID','UUID','String','string',false,false,true,true,NULL,5),
    ('updated_by','Updated By','updated_by','UUID','UUID','String','string',false,false,true,false,NULL,6),
    ('created_at','Created At','created_at','TIMESTAMP','TIMESTAMP','DateTime','Date',false,true,false,true,'CURRENT_TIMESTAMP',7),
    ('updated_at','Updated At','updated_at','TIMESTAMP','TIMESTAMP','DateTime','Date',false,true,false,false,'CURRENT_TIMESTAMP',8),
    ('deleted_at','Deleted At','deleted_at','TIMESTAMP','TIMESTAMP','DateTime','Date',false,false,true,false,NULL,9),
    ('is_active','Is Active','is_active','BOOLEAN','BOOLEAN','Boolean','boolean',false,true,false,true,'true',10),
    ('status','Status','status','VARCHAR','VARCHAR(50)','String','string',false,true,false,true,'''ACTIVE''',11),
    ('version','Version','version','INTEGER','INTEGER','Int','number',false,true,false,false,'1',12)
)
INSERT INTO clinical_dictionary_fields (
  tenant_id, hospital_id, branch_id, clinic_id, entity_id, entity_key, field_key, field_name, column_name,
  data_type, postgres_type, prisma_type, nestjs_type, is_primary_key, is_required, is_nullable, is_indexed,
  default_expression, sort_order, created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, e.id, e.entity_key,
  base_fields.field_key, base_fields.field_name, base_fields.column_name, base_fields.data_type, base_fields.postgres_type,
  base_fields.prisma_type, base_fields.nestjs_type, base_fields.is_primary_key, base_fields.is_required, base_fields.is_nullable,
  base_fields.is_indexed, base_fields.default_expression, base_fields.sort_order,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
JOIN clinical_dictionary_entities e ON e.tenant_id = scope.tenant_id AND e.hospital_id = scope.hospital_id AND e.branch_id = scope.branch_id AND COALESCE(e.is_deleted,false) = false
CROSS JOIN base_fields
ON CONFLICT (tenant_id, hospital_id, branch_id, entity_key, field_key)
DO UPDATE SET
  field_name = EXCLUDED.field_name,
  column_name = EXCLUDED.column_name,
  data_type = EXCLUDED.data_type,
  postgres_type = EXCLUDED.postgres_type,
  prisma_type = EXCLUDED.prisma_type,
  nestjs_type = EXCLUDED.nestjs_type,
  is_primary_key = EXCLUDED.is_primary_key,
  is_required = EXCLUDED.is_required,
  is_nullable = EXCLUDED.is_nullable,
  is_indexed = EXCLUDED.is_indexed,
  default_expression = EXCLUDED.default_expression,
  is_active = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
domain_fields(entity_key, field_key, field_name, column_name, data_type, postgres_type, prisma_type, sort_order) AS (
  VALUES
    ('patients','patient_number','Patient Number','patient_number','VARCHAR','VARCHAR(80)','String',20),('patients','uhid','UHID','uhid','VARCHAR','VARCHAR(80)','String',21),('patients','abha_id','ABHA ID','abha_id','VARCHAR','VARCHAR(120)','String',22),('patients','aadhaar_number','Aadhaar Number','aadhaar_number','VARCHAR','VARCHAR(40)','String',23),('patients','passport_number','Passport Number','passport_number','VARCHAR','VARCHAR(80)','String',24),('patients','first_name','First Name','first_name','VARCHAR','VARCHAR(120)','String',25),('patients','middle_name','Middle Name','middle_name','VARCHAR','VARCHAR(120)','String',26),('patients','last_name','Last Name','last_name','VARCHAR','VARCHAR(120)','String',27),('patients','gender','Gender','gender','VARCHAR','VARCHAR(40)','String',28),('patients','date_of_birth','Date Of Birth','date_of_birth','DATE','DATE','DateTime',29),('patients','blood_group','Blood Group','blood_group','VARCHAR','VARCHAR(20)','String',30),('patients','mobile','Mobile','mobile','VARCHAR','VARCHAR(40)','String',31),('patients','email','Email','email','VARCHAR','VARCHAR(255)','String',32),('patients','emergency_contact_name','Emergency Contact Name','emergency_contact_name','VARCHAR','VARCHAR(255)','String',33),('patients','emergency_contact_number','Emergency Contact Number','emergency_contact_number','VARCHAR','VARCHAR(40)','String',34),
    ('patient_addresses','patient_id','Patient ID','patient_id','UUID','UUID','String',20),('patient_addresses','address_line1','Address Line 1','address_line1','VARCHAR','VARCHAR(255)','String',21),('patient_addresses','address_line2','Address Line 2','address_line2','VARCHAR','VARCHAR(255)','String',22),('patient_addresses','city','City','city','VARCHAR','VARCHAR(120)','String',23),('patient_addresses','district','District','district','VARCHAR','VARCHAR(120)','String',24),('patient_addresses','state','State','state','VARCHAR','VARCHAR(120)','String',25),('patient_addresses','country','Country','country','VARCHAR','VARCHAR(120)','String',26),('patient_addresses','postal_code','Postal Code','postal_code','VARCHAR','VARCHAR(40)','String',27),('patient_addresses','latitude','Latitude','latitude','DECIMAL','NUMERIC(12,8)','Decimal',28),('patient_addresses','longitude','Longitude','longitude','DECIMAL','NUMERIC(12,8)','Decimal',29),
    ('patient_documents','patient_id','Patient ID','patient_id','UUID','UUID','String',20),('patient_documents','document_type','Document Type','document_type','VARCHAR','VARCHAR(120)','String',21),('patient_documents','document_number','Document Number','document_number','VARCHAR','VARCHAR(120)','String',22),('patient_documents','file_url','File URL','file_url','TEXT','TEXT','String',23),('patient_documents','expiry_date','Expiry Date','expiry_date','DATE','DATE','DateTime',24),
    ('appointments','appointment_number','Appointment Number','appointment_number','VARCHAR','VARCHAR(80)','String',20),('appointments','patient_id','Patient ID','patient_id','UUID','UUID','String',21),('appointments','doctor_id','Doctor ID','doctor_id','UUID','UUID','String',22),('appointments','department_id','Department ID','department_id','UUID','UUID','String',23),('appointments','appointment_date','Appointment Date','appointment_date','DATE','DATE','DateTime',24),('appointments','start_time','Start Time','start_time','TIME','TIME','String',25),('appointments','end_time','End Time','end_time','TIME','TIME','String',26),('appointments','visit_type','Visit Type','visit_type','VARCHAR','VARCHAR(80)','String',27),('appointments','consultation_type','Consultation Type','consultation_type','VARCHAR','VARCHAR(80)','String',28),
    ('op_visits','visit_number','Visit Number','visit_number','VARCHAR','VARCHAR(80)','String',20),('op_visits','patient_id','Patient ID','patient_id','UUID','UUID','String',21),('op_visits','doctor_id','Doctor ID','doctor_id','UUID','UUID','String',22),('op_visits','department_id','Department ID','department_id','UUID','UUID','String',23),('op_visits','visit_date','Visit Date','visit_date','DATE','DATE','DateTime',24),('op_visits','chief_complaint','Chief Complaint','chief_complaint','TEXT','TEXT','String',25),('op_visits','history','History','history','TEXT','TEXT','String',26),('op_visits','clinical_notes','Clinical Notes','clinical_notes','TEXT','TEXT','String',27),
    ('admissions','admission_number','Admission Number','admission_number','VARCHAR','VARCHAR(80)','String',20),('admissions','patient_id','Patient ID','patient_id','UUID','UUID','String',21),('admissions','admission_date','Admission Date','admission_date','DATE','DATE','DateTime',22),('admissions','consultant_id','Consultant ID','consultant_id','UUID','UUID','String',23),('admissions','department_id','Department ID','department_id','UUID','UUID','String',24),('admissions','admission_reason','Admission Reason','admission_reason','TEXT','TEXT','String',25),('admissions','expected_discharge','Expected Discharge','expected_discharge','DATE','DATE','DateTime',26),
    ('vitals','temperature','Temperature','temperature','DECIMAL','NUMERIC(8,2)','Decimal',20),('vitals','pulse','Pulse','pulse','INTEGER','INTEGER','Int',21),('vitals','respiratory_rate','Respiratory Rate','respiratory_rate','INTEGER','INTEGER','Int',22),('vitals','systolic_bp','Systolic BP','systolic_bp','INTEGER','INTEGER','Int',23),('vitals','diastolic_bp','Diastolic BP','diastolic_bp','INTEGER','INTEGER','Int',24),('vitals','height','Height','height','DECIMAL','NUMERIC(8,2)','Decimal',25),('vitals','weight','Weight','weight','DECIMAL','NUMERIC(8,2)','Decimal',26),('vitals','bmi','BMI','bmi','DECIMAL','NUMERIC(8,2)','Decimal',27),('vitals','spo2','SPO2','spo2','DECIMAL','NUMERIC(8,2)','Decimal',28),('vitals','pain_score','Pain Score','pain_score','INTEGER','INTEGER','Int',29),
    ('doctors','doctor_code','Doctor Code','doctor_code','VARCHAR','VARCHAR(80)','String',20),('doctors','registration_number','Registration Number','registration_number','VARCHAR','VARCHAR(120)','String',21),('doctors','specialization','Specialization','specialization','VARCHAR','VARCHAR(160)','String',22),('doctors','qualification','Qualification','qualification','VARCHAR','VARCHAR(255)','String',23),('doctors','experience','Experience','experience','INTEGER','INTEGER','Int',24),('doctors','license_expiry','License Expiry','license_expiry','DATE','DATE','DateTime',25),('doctors','consultation_fee','Consultation Fee','consultation_fee','DECIMAL','NUMERIC(12,2)','Decimal',26),
    ('embryos','embryo_id','Embryo ID','embryo_id','VARCHAR','VARCHAR(120)','String',20),('embryos','cycle_id','Cycle ID','cycle_id','UUID','UUID','String',21),('embryos','grade','Grade','grade','VARCHAR','VARCHAR(40)','String',22),('embryos','day','Day','day','INTEGER','INTEGER','Int',23),('embryos','storage_location','Storage Location','storage_location','VARCHAR','VARCHAR(160)','String',24),
    ('tests','test_code','Test Code','test_code','VARCHAR','VARCHAR(80)','String',20),('tests','test_name','Test Name','test_name','VARCHAR','VARCHAR(255)','String',21),('tests','department','Department','department','VARCHAR','VARCHAR(160)','String',22),('tests','sample_type','Sample Type','sample_type','VARCHAR','VARCHAR(120)','String',23),('tests','turnaround_time','Turnaround Time','turnaround_time','INTEGER','INTEGER','Int',24),('tests','price','Price','price','DECIMAL','NUMERIC(12,2)','Decimal',25),
    ('studies','study_uid','Study UID','study_uid','VARCHAR','VARCHAR(255)','String',20),('studies','patient_id','Patient ID','patient_id','UUID','UUID','String',21),('studies','modality','Modality','modality','VARCHAR','VARCHAR(40)','String',22),('studies','study_date','Study Date','study_date','DATE','DATE','DateTime',23),('studies','radiologist_id','Radiologist ID','radiologist_id','UUID','UUID','String',24),
    ('medicines','medicine_code','Medicine Code','medicine_code','VARCHAR','VARCHAR(80)','String',20),('medicines','generic_name','Generic Name','generic_name','VARCHAR','VARCHAR(255)','String',21),('medicines','brand_name','Brand Name','brand_name','VARCHAR','VARCHAR(255)','String',22),('medicines','strength','Strength','strength','VARCHAR','VARCHAR(120)','String',23),('medicines','manufacturer','Manufacturer','manufacturer','VARCHAR','VARCHAR(255)','String',24),('medicines','reorder_level','Reorder Level','reorder_level','INTEGER','INTEGER','Int',25),
    ('invoices','invoice_number','Invoice Number','invoice_number','VARCHAR','VARCHAR(80)','String',20),('invoices','patient_id','Patient ID','patient_id','UUID','UUID','String',21),('invoices','department_id','Department ID','department_id','UUID','UUID','String',22),('invoices','gross_amount','Gross Amount','gross_amount','DECIMAL','NUMERIC(14,2)','Decimal',23),('invoices','discount','Discount','discount','DECIMAL','NUMERIC(14,2)','Decimal',24),('invoices','tax','Tax','tax','DECIMAL','NUMERIC(14,2)','Decimal',25),('invoices','net_amount','Net Amount','net_amount','DECIMAL','NUMERIC(14,2)','Decimal',26),
    ('claims','claim_number','Claim Number','claim_number','VARCHAR','VARCHAR(80)','String',20),('claims','patient_id','Patient ID','patient_id','UUID','UUID','String',21),('claims','insurance_company_id','Insurance Company ID','insurance_company_id','UUID','UUID','String',22),('claims','claim_amount','Claim Amount','claim_amount','DECIMAL','NUMERIC(14,2)','Decimal',23),('claims','approved_amount','Approved Amount','approved_amount','DECIMAL','NUMERIC(14,2)','Decimal',24),
    ('commissions','referral_id','Referral ID','referral_id','UUID','UUID','String',20),('commissions','patient_id','Patient ID','patient_id','UUID','UUID','String',21),('commissions','revenue_amount','Revenue Amount','revenue_amount','DECIMAL','NUMERIC(14,2)','Decimal',22),('commissions','commission_percentage','Commission Percentage','commission_percentage','DECIMAL','NUMERIC(8,2)','Decimal',23),('commissions','commission_amount','Commission Amount','commission_amount','DECIMAL','NUMERIC(14,2)','Decimal',24)
)
INSERT INTO clinical_dictionary_fields (
  tenant_id, hospital_id, branch_id, clinic_id, entity_id, entity_key, field_key, field_name, column_name,
  data_type, postgres_type, prisma_type, nestjs_type, is_required, is_nullable, is_indexed, sort_order,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, e.id, domain_fields.entity_key,
  domain_fields.field_key, domain_fields.field_name, domain_fields.column_name, domain_fields.data_type,
  domain_fields.postgres_type, domain_fields.prisma_type, lower(domain_fields.prisma_type), true, false,
  domain_fields.column_name IN ('patient_id','doctor_id','appointment_date','admission_date','claim_number','invoice_number'),
  domain_fields.sort_order, scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
JOIN domain_fields ON true
JOIN clinical_dictionary_entities e ON e.tenant_id = scope.tenant_id AND e.hospital_id = scope.hospital_id AND e.branch_id = scope.branch_id AND e.entity_key = domain_fields.entity_key
ON CONFLICT (tenant_id, hospital_id, branch_id, entity_key, field_key)
DO UPDATE SET
  field_name = EXCLUDED.field_name,
  column_name = EXCLUDED.column_name,
  data_type = EXCLUDED.data_type,
  postgres_type = EXCLUDED.postgres_type,
  prisma_type = EXCLUDED.prisma_type,
  is_required = EXCLUDED.is_required,
  is_nullable = EXCLUDED.is_nullable,
  is_indexed = EXCLUDED.is_indexed,
  is_active = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
rels(from_key, to_key, from_column, relation_type, cardinality) AS (
  VALUES
    ('patient_contacts','patients','patient_id','many_to_one','N:1'),('patient_addresses','patients','patient_id','many_to_one','N:1'),('patient_documents','patients','patient_id','many_to_one','N:1'),('patient_allergies','patients','patient_id','many_to_one','N:1'),('patient_conditions','patients','patient_id','many_to_one','N:1'),('patient_vaccinations','patients','patient_id','many_to_one','N:1'),('patient_preferences','patients','patient_id','many_to_one','N:1'),
    ('appointments','patients','patient_id','many_to_one','N:1'),('appointments','doctors','doctor_id','many_to_one','N:1'),('appointments','departments','department_id','many_to_one','N:1'),
    ('op_visits','patients','patient_id','many_to_one','N:1'),('op_visits','doctors','doctor_id','many_to_one','N:1'),('op_lab_orders','op_visits','visit_id','many_to_one','N:1'),('op_radiology_orders','op_visits','visit_id','many_to_one','N:1'),('op_prescriptions','op_visits','visit_id','many_to_one','N:1'),
    ('admissions','patients','patient_id','many_to_one','N:1'),('admissions','doctors','consultant_id','many_to_one','N:1'),('bed_allocations','admissions','admission_id','many_to_one','N:1'),('transfers','admissions','admission_id','many_to_one','N:1'),('discharges','admissions','admission_id','many_to_one','N:1'),
    ('vitals','patients','patient_id','many_to_one','N:1'),('medication_administration','patients','patient_id','many_to_one','N:1'),('nursing_notes','patients','patient_id','many_to_one','N:1'),
    ('doctor_qualifications','doctors','doctor_id','many_to_one','N:1'),('doctor_specializations','doctors','doctor_id','many_to_one','N:1'),('doctor_schedules','doctors','doctor_id','many_to_one','N:1'),('doctor_incentives','doctors','doctor_id','many_to_one','N:1'),
    ('couples','patients','female_patient_id','many_to_one','N:1'),('couples','patients','male_patient_id','many_to_one','N:1'),('ivf_cycles','couples','couple_id','many_to_one','N:1'),('embryos','ivf_cycles','cycle_id','many_to_one','N:1'),('oocytes','ivf_cycles','cycle_id','many_to_one','N:1'),('fertilization','ivf_cycles','cycle_id','many_to_one','N:1'),('blastocysts','ivf_cycles','cycle_id','many_to_one','N:1'),
    ('orders','patients','patient_id','many_to_one','N:1'),('samples','orders','order_id','many_to_one','N:1'),('results','samples','sample_id','many_to_one','N:1'),('reports','orders','order_id','many_to_one','N:1'),('studies','patients','patient_id','many_to_one','N:1'),('radiology_reports','studies','study_id','many_to_one','N:1'),
    ('medicine_batches','medicines','medicine_id','many_to_one','N:1'),('inventory','medicines','medicine_id','many_to_one','N:1'),('sale_items','sales','sale_id','many_to_one','N:1'),('sale_items','medicines','medicine_id','many_to_one','N:1'),
    ('invoices','patients','patient_id','many_to_one','N:1'),('invoice_items','invoices','invoice_id','many_to_one','N:1'),('payments','invoices','invoice_id','many_to_one','N:1'),('refunds','payments','payment_id','many_to_one','N:1'),
    ('claims','patients','patient_id','many_to_one','N:1'),('claims','insurance_companies','insurance_company_id','many_to_one','N:1'),('claim_documents','claims','claim_id','many_to_one','N:1'),('pre_authorizations','claims','claim_id','many_to_one','N:1'),
    ('commissions','referrals','referral_id','many_to_one','N:1'),('commission_payments','commissions','commission_id','many_to_one','N:1'),
    ('journal_lines','journal_entries','journal_entry_id','many_to_one','N:1'),('journal_lines','accounts','account_id','many_to_one','N:1'),
    ('attendance','employees','employee_id','many_to_one','N:1'),('leave_requests','employees','employee_id','many_to_one','N:1'),('payroll','employees','employee_id','many_to_one','N:1'),
    ('ai_responses','ai_requests','request_id','many_to_one','N:1'),('ai_feedback','ai_requests','request_id','many_to_one','N:1'),('ai_predictions','patients','patient_id','many_to_one','N:1'),
    ('audit_logs','users','performed_by','many_to_one','N:1'),('login_logs','users','user_id','many_to_one','N:1')
)
INSERT INTO clinical_dictionary_relationships (
  tenant_id, hospital_id, branch_id, clinic_id, relationship_key, from_entity_id, to_entity_id,
  from_entity_key, to_entity_key, from_column, to_column, relation_type, cardinality, prisma_relation,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  rels.from_key || '_to_' || rels.to_key || '_' || rels.from_column,
  fe.id, te.id, rels.from_key, rels.to_key, rels.from_column, 'id', rels.relation_type, rels.cardinality,
  rels.from_key || '.' || rels.from_column || ' -> ' || rels.to_key || '.id',
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
JOIN rels ON true
JOIN clinical_dictionary_entities fe ON fe.tenant_id = scope.tenant_id AND fe.hospital_id = scope.hospital_id AND fe.branch_id = scope.branch_id AND fe.entity_key = rels.from_key
JOIN clinical_dictionary_entities te ON te.tenant_id = scope.tenant_id AND te.hospital_id = scope.hospital_id AND te.branch_id = scope.branch_id AND te.entity_key = rels.to_key
ON CONFLICT (tenant_id, hospital_id, branch_id, relationship_key)
DO UPDATE SET
  from_column = EXCLUDED.from_column,
  relation_type = EXCLUDED.relation_type,
  cardinality = EXCLUDED.cardinality,
  prisma_relation = EXCLUDED.prisma_relation,
  is_active = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
constraint_templates(constraint_type, suffix, columns, expression, validation_message) AS (
  VALUES
    ('PRIMARY_KEY','pk','["id"]'::jsonb,'PRIMARY KEY (id)','Primary key is required.'),
    ('TENANT_SCOPE','tenant_scope','["tenant_id","hospital_id","branch_id"]'::jsonb,'tenant_id IS NOT NULL AND hospital_id IS NOT NULL AND branch_id IS NOT NULL','Tenant scope is mandatory.'),
    ('STATUS_CHECK','status_check','["status"]'::jsonb,'status IS NOT NULL','Status is mandatory.'),
    ('VERSION_CHECK','version_check','["version"]'::jsonb,'version >= 1','Version must support optimistic locking.')
)
INSERT INTO clinical_dictionary_constraints (
  tenant_id, hospital_id, branch_id, clinic_id, entity_id, entity_key, constraint_key, constraint_name,
  constraint_type, columns, expression, validation_message, created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, e.id, e.entity_key,
  e.entity_key || '_' || constraint_templates.suffix,
  e.table_name || '_' || constraint_templates.suffix,
  constraint_templates.constraint_type,
  constraint_templates.columns,
  constraint_templates.expression,
  constraint_templates.validation_message,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
JOIN clinical_dictionary_entities e ON e.tenant_id = scope.tenant_id AND e.hospital_id = scope.hospital_id AND e.branch_id = scope.branch_id AND COALESCE(e.is_deleted,false) = false
CROSS JOIN constraint_templates
ON CONFLICT (tenant_id, hospital_id, branch_id, constraint_key)
DO UPDATE SET
  constraint_name = EXCLUDED.constraint_name,
  constraint_type = EXCLUDED.constraint_type,
  columns = EXCLUDED.columns,
  expression = EXCLUDED.expression,
  validation_message = EXCLUDED.validation_message,
  is_active = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
index_templates(suffix, columns, is_unique, where_clause) AS (
  VALUES
    ('tenant_scope','["tenant_id","hospital_id","branch_id"]'::jsonb,false,'deleted_at IS NULL'),
    ('status','["status","is_active"]'::jsonb,false,'deleted_at IS NULL'),
    ('created_at','["created_at"]'::jsonb,false,NULL)
)
INSERT INTO clinical_dictionary_indexes (
  tenant_id, hospital_id, branch_id, clinic_id, entity_id, entity_key, index_key, index_name,
  index_type, columns, is_unique, where_clause, created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, e.id, e.entity_key,
  e.entity_key || '_' || index_templates.suffix,
  'idx_' || e.table_name || '_' || index_templates.suffix,
  'BTREE',
  index_templates.columns,
  index_templates.is_unique,
  index_templates.where_clause,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
JOIN clinical_dictionary_entities e ON e.tenant_id = scope.tenant_id AND e.hospital_id = scope.hospital_id AND e.branch_id = scope.branch_id AND COALESCE(e.is_deleted,false) = false
CROSS JOIN index_templates
ON CONFLICT (tenant_id, hospital_id, branch_id, index_key)
DO UPDATE SET
  index_name = EXCLUDED.index_name,
  columns = EXCLUDED.columns,
  is_unique = EXCLUDED.is_unique,
  where_clause = EXCLUDED.where_clause,
  is_active = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
policies(policy_key, entity_group, retention_period, retention_years, legal_basis) AS (
  VALUES
    ('clinical_records_permanent','Clinical Records','Permanent',NULL,'Clinical medico-legal records retained permanently.'),
    ('insurance_10_years','Insurance','10 Years',10,'Insurance and claim records retained for ten years.'),
    ('audit_logs_10_years','Audit Logs','10 Years',10,'Audit logs retained for ten years.'),
    ('system_logs_2_years','System Logs','2 Years',2,'System logs retained for two years.'),
    ('ai_logs_10_years','AI Logs','10 Years',10,'AI safety and decision-support logs retained for review.')
)
INSERT INTO clinical_dictionary_retention_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, entity_group, retention_period, retention_years, legal_basis,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, policies.policy_key, policies.entity_group, policies.retention_period, policies.retention_years, policies.legal_basis,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
CROSS JOIN policies
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET retention_period = EXCLUDED.retention_period, retention_years = EXCLUDED.retention_years, legal_basis = EXCLUDED.legal_basis, is_active = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
policies(policy_key, archive_target, trigger_condition, archive_storage, restore_sla) AS (
  VALUES
    ('archive_inactive_patients','Inactive Patients','Patient inactive for configured period and no open encounters.','S3_COMPATIBLE','24 Hours'),
    ('archive_completed_claims','Completed Claims','Claim completed and retention policy allows archive.','S3_COMPATIBLE','24 Hours'),
    ('archive_historical_reports','Historical Reports','Report older than configured active reporting window.','S3_COMPATIBLE','8 Hours')
)
INSERT INTO clinical_dictionary_archival_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, archive_target, trigger_condition, archive_storage, restore_sla,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, policies.policy_key, policies.archive_target, policies.trigger_condition, policies.archive_storage, policies.restore_sla,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
CROSS JOIN policies
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET archive_target = EXCLUDED.archive_target, trigger_condition = EXCLUDED.trigger_condition, restore_sla = EXCLUDED.restore_sla, is_active = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
rules(rule_key, generator_target, rule_name, rule_payload) AS (
  VALUES
    ('postgres_uuid_multitenant','PostgreSQL','Generate UUID multi-tenant business tables','{"id":"UUID PRIMARY KEY","tenant_id":"UUID NOT NULL","hospital_id":"UUID NOT NULL","branch_id":"UUID NOT NULL"}'::jsonb),
    ('prisma_relations','Prisma','Generate Prisma models, indexes, and relations','{"relations":true,"indexes":true,"constraints":true}'::jsonb),
    ('nestjs_entities_dtos','NestJS','Generate NestJS entities and DTOs','{"entities":true,"createDto":true,"updateDto":true,"validation":true}'::jsonb),
    ('rbac_actions','RBAC','Generate role permissions from entity actions','{"actions":["create","read","update","delete","approve","export"]}'::jsonb),
    ('reports_from_dictionary','Reports','Generate reports from entity metadata','{"formats":["PDF","Excel","CSV"],"drilldown":true}'::jsonb)
)
INSERT INTO clinical_dictionary_generation_rules (
  tenant_id, hospital_id, branch_id, clinic_id, rule_key, generator_target, rule_name, rule_payload,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, rules.rule_key, rules.generator_target, rules.rule_name, rules.rule_payload,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
CROSS JOIN rules
ON CONFLICT (tenant_id, hospital_id, branch_id, rule_key)
DO UPDATE SET generator_target = EXCLUDED.generator_target, rule_name = EXCLUDED.rule_name, rule_payload = EXCLUDED.rule_payload, is_active = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
diagrams(diagram_key, diagram_name, entity_keys, relationship_keys, diagram_text) AS (
  VALUES
    ('patient_care_er','Patient Care ER Diagram','["patients","appointments","op_visits","admissions","vitals","invoices","claims"]'::jsonb,'["appointments_to_patients_patient_id","op_visits_to_patients_patient_id","admissions_to_patients_patient_id"]'::jsonb,'erDiagram\n  patients ||--o{ appointments : books\n  patients ||--o{ admissions : admitted\n  patients ||--o{ invoices : billed'),
    ('ivf_er','IVF ER Diagram','["couples","ivf_cycles","embryos","oocytes","blastocysts","cryopreservation"]'::jsonb,'["ivf_cycles_to_couples_couple_id","embryos_to_ivf_cycles_cycle_id"]'::jsonb,'erDiagram\n  couples ||--o{ ivf_cycles : starts\n  ivf_cycles ||--o{ embryos : creates'),
    ('finance_claims_er','Finance Claims ER Diagram','["patients","invoices","payments","claims","insurance_companies","commissions"]'::jsonb,'["invoices_to_patients_patient_id","payments_to_invoices_invoice_id","claims_to_patients_patient_id"]'::jsonb,'erDiagram\n  patients ||--o{ invoices : receives\n  invoices ||--o{ payments : paid\n  patients ||--o{ claims : claims')
)
INSERT INTO clinical_dictionary_er_diagrams (
  tenant_id, hospital_id, branch_id, clinic_id, diagram_key, diagram_name, entity_keys, relationship_keys, diagram_text,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, diagrams.diagram_key, diagrams.diagram_name, diagrams.entity_keys, diagrams.relationship_keys, diagrams.diagram_text,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
CROSS JOIN diagrams
ON CONFLICT (tenant_id, hospital_id, branch_id, diagram_key)
DO UPDATE SET diagram_name = EXCLUDED.diagram_name, entity_keys = EXCLUDED.entity_keys, relationship_keys = EXCLUDED.relationship_keys, diagram_text = EXCLUDED.diagram_text, is_active = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
items(menu_key, label, path, module_name, permission_key, sort_order) AS (
  VALUES
    ('dictionary_core','Database Dictionary','/clinical-services/dictionary','dictionary','clinical.dictionary.read',410),
    ('dictionary_entities','Entity Catalog','/clinical-services/dictionary/entities','dictionary','clinical.dictionary.entities.read',411),
    ('dictionary_fields','Field Catalog','/clinical-services/dictionary/fields','dictionary','clinical.dictionary.fields.read',412),
    ('dictionary_relationships','Relationships','/clinical-services/dictionary/relationships','dictionary','clinical.dictionary.relationships.read',413),
    ('dictionary_constraints','Constraints','/clinical-services/dictionary/constraints','dictionary','clinical.dictionary.constraints.read',414),
    ('dictionary_indexes','Indexes','/clinical-services/dictionary/indexes','dictionary','clinical.dictionary.indexes.read',415),
    ('dictionary_retention','Retention Policies','/clinical-services/dictionary/retention','dictionary','clinical.dictionary.retention.read',416),
    ('dictionary_archival','Archival Policies','/clinical-services/dictionary/archival','dictionary','clinical.dictionary.archival.read',417),
    ('dictionary_er','ER Diagrams','/clinical-services/dictionary/er-diagrams','dictionary','clinical.dictionary.er.read',418),
    ('dictionary_generation','Generation Rules','/clinical-services/dictionary/generation-rules','dictionary','clinical.dictionary.generation.read',419),
    ('dictionary_blueprints','Schema Blueprints','/clinical-services/dictionary/blueprints','dictionary','clinical.dictionary.blueprints.read',420)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.clinic_id, scope.hospital_id, scope.branch_id, items.menu_key, items.label, items.path, items.module_name, items.permission_key, items.sort_order,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope
CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET hospital_id = EXCLUDED.hospital_id, branch_id = EXCLUDED.branch_id, label = EXCLUDED.label, path = EXCLUDED.path, module_name = EXCLUDED.module_name, permission_key = EXCLUDED.permission_key, sort_order = EXCLUDED.sort_order, is_enabled = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, screen_count, api_count, report_count) AS (
  VALUES
    ('entities','Entity Catalog',5,8,5),
    ('fields','Field Catalog',5,8,5),
    ('relationships','Relationship Catalog',5,8,5),
    ('constraints','Constraint Catalog',5,8,5),
    ('indexes','Index Catalog',5,8,5),
    ('retention','Retention Policies',5,8,5),
    ('archival','Archival Policies',5,8,5),
    ('er-diagrams','ER Diagrams',5,8,5),
    ('generation-rules','Generation Rules',5,8,5),
    ('blueprints','Schema Blueprints',5,8,5)
),
screen_rows AS (
  SELECT modules.*, generate_series(1, screen_count) AS n FROM modules
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO clinical_dictionary_screen_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, screen_key, screen_name, route_path, section_definitions, workflow_definitions,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, screen_rows.module_key, screen_rows.module_key || '_screen_' || LPAD(screen_rows.n::text,2,'0'), screen_rows.module_name || ' Screen ' || screen_rows.n,
  '/clinical-services/dictionary/' || screen_rows.module_key,
  jsonb_build_array('Catalog Summary','Generator Blueprint','Relationship Evidence','Governance Metadata'),
  jsonb_build_array('Review','Filter','Generate','Export','Audit'),
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
CROSS JOIN screen_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, screen_key)
DO UPDATE SET screen_name = EXCLUDED.screen_name, route_path = EXCLUDED.route_path, section_definitions = EXCLUDED.section_definitions, workflow_definitions = EXCLUDED.workflow_definitions, is_active = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, api_count) AS (
  VALUES ('entities','Entity Catalog',8),('fields','Field Catalog',8),('relationships','Relationship Catalog',8),('constraints','Constraint Catalog',8),('indexes','Index Catalog',8),('retention','Retention Policies',8),('archival','Archival Policies',8),('er-diagrams','ER Diagrams',8),('generation-rules','Generation Rules',8),('blueprints','Schema Blueprints',8)
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
)
INSERT INTO clinical_dictionary_api_endpoint_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, endpoint_key, method, path, permission_key, request_schema, response_schema,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, api_rows.module_key, api_rows.module_key || '_api_' || LPAD(api_rows.n::text,3,'0'),
  CASE WHEN api_rows.n % 5 = 1 THEN 'POST' WHEN api_rows.n % 5 = 2 THEN 'PATCH' WHEN api_rows.n % 5 = 3 THEN 'DELETE' ELSE 'GET' END,
  '/api/clinical/dictionary/' || api_rows.module_key || '/' || api_rows.n,
  'clinical.dictionary.' || replace(api_rows.module_key,'-','_') || '.execute',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','generator','optional'),
  jsonb_build_object('dictionary','required','blueprint','supported','audit','required'),
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
CROSS JOIN api_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, endpoint_key)
DO UPDATE SET method = EXCLUDED.method, path = EXCLUDED.path, permission_key = EXCLUDED.permission_key, request_schema = EXCLUDED.request_schema, response_schema = EXCLUDED.response_schema, is_active = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, report_count) AS (
  VALUES ('entities','Entity Catalog',5),('fields','Field Catalog',5),('relationships','Relationship Catalog',5),('constraints','Constraint Catalog',5),('indexes','Index Catalog',5),('retention','Retention Policies',5),('archival','Archival Policies',5),('er-diagrams','ER Diagrams',5),('generation-rules','Generation Rules',5),('blueprints','Schema Blueprints',5)
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO clinical_dictionary_report_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, report_key, report_name, report_category, output_formats, metric_definitions,
  created_by, updated_by, created_at, updated_at, is_active, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, report_rows.module_key, report_rows.module_key || '_report_' || LPAD(report_rows.n::text,3,'0'), report_rows.module_name || ' Report ' || report_rows.n,
  'Database Dictionary',
  '["PDF","Excel","CSV","JSON"]'::jsonb,
  jsonb_build_object('source','clinical_dictionary','module',report_rows.module_key,'generation_ready',true),
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, false
FROM scope
CROSS JOIN report_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, report_key)
DO UPDATE SET report_name = EXCLUDED.report_name, report_category = EXCLUDED.report_category, output_formats = EXCLUDED.output_formats, metric_definitions = EXCLUDED.metric_definitions, is_active = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;
