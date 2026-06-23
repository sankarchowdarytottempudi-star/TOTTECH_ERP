-- TOTTECH Clinical Services - Phase 13 Enterprise RBAC + ABAC + Permission Matrix + Data Security Governance

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

CREATE TABLE IF NOT EXISTS clinical_security_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  role_key VARCHAR(180) NOT NULL,
  role_name VARCHAR(255) NOT NULL,
  role_category VARCHAR(120) NOT NULL,
  hierarchy_rank INTEGER NOT NULL DEFAULT 100,
  parent_role_key VARCHAR(180),
  mfa_required BOOLEAN DEFAULT false,
  break_glass_allowed BOOLEAN DEFAULT false,
  data_scope JSONB DEFAULT '["tenant_id","hospital_id","branch_id"]'::jsonb,
  description TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, role_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  permission_key VARCHAR(260) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  action_key VARCHAR(80) NOT NULL,
  action_name VARCHAR(120) NOT NULL,
  resource_scope VARCHAR(120) NOT NULL,
  permission_group VARCHAR(120) DEFAULT 'RBAC',
  requires_reason BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  audit_required BOOLEAN DEFAULT true,
  description TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, permission_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  role_key VARCHAR(180) NOT NULL,
  permission_key VARCHAR(260) NOT NULL,
  access_decision VARCHAR(40) DEFAULT 'ALLOW',
  abac_conditions JSONB DEFAULT '{}'::jsonb,
  field_mask_profile VARCHAR(120),
  record_scope_policy VARCHAR(180),
  approval_policy JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, role_key, permission_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  user_id INTEGER,
  permission_key VARCHAR(260) NOT NULL,
  grant_type VARCHAR(40) DEFAULT 'ALLOW',
  reason TEXT,
  expires_at TIMESTAMP,
  approved_by INTEGER,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_security_data_masks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  mask_key VARCHAR(180) NOT NULL,
  field_key VARCHAR(180) NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  sensitive_type VARCHAR(120) NOT NULL,
  mask_pattern VARCHAR(255) NOT NULL,
  example_masked VARCHAR(255),
  full_access_roles JSONB DEFAULT '[]'::jsonb,
  masked_roles JSONB DEFAULT '[]'::jsonb,
  apply_to_modules JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, mask_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_record_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(180) NOT NULL,
  policy_name VARCHAR(255) NOT NULL,
  role_key VARCHAR(180) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  rule_expression TEXT NOT NULL,
  examples JSONB DEFAULT '[]'::jsonb,
  enforcement_level VARCHAR(80) DEFAULT 'REQUIRED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_field_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(220) NOT NULL,
  role_key VARCHAR(180) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  field_key VARCHAR(180) NOT NULL,
  can_view BOOLEAN DEFAULT true,
  can_edit BOOLEAN DEFAULT false,
  mask_policy VARCHAR(180),
  denial_reason TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_export_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  control_key VARCHAR(180) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  export_format VARCHAR(80) NOT NULL,
  permission_key VARCHAR(260) NOT NULL,
  reason_required BOOLEAN DEFAULT true,
  audit_required BOOLEAN DEFAULT true,
  approval_required BOOLEAN DEFAULT false,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, control_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_bulk_action_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  control_key VARCHAR(180) NOT NULL,
  action_key VARCHAR(120) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  approval_required BOOLEAN DEFAULT true,
  approver_roles JSONB DEFAULT '[]'::jsonb,
  reason_required BOOLEAN DEFAULT true,
  audit_required BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, control_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_approval_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  workflow_key VARCHAR(180) NOT NULL,
  workflow_name VARCHAR(255) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  action_key VARCHAR(120) NOT NULL,
  trigger_condition TEXT,
  approver_roles JSONB DEFAULT '[]'::jsonb,
  sla_hours INTEGER DEFAULT 24,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, workflow_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  workflow_key VARCHAR(180) NOT NULL,
  step_order INTEGER NOT NULL,
  step_name VARCHAR(255) NOT NULL,
  approver_role VARCHAR(180),
  action_required VARCHAR(120) DEFAULT 'APPROVE',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, workflow_key, step_order)
);

CREATE TABLE IF NOT EXISTS clinical_security_mfa_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(180) NOT NULL,
  role_key VARCHAR(180) NOT NULL,
  factor_policy JSONB DEFAULT '["password","otp"]'::jsonb,
  required_context JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_session_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(180) NOT NULL,
  role_key VARCHAR(180) NOT NULL,
  track_ip BOOLEAN DEFAULT true,
  track_device BOOLEAN DEFAULT true,
  track_browser BOOLEAN DEFAULT true,
  track_location BOOLEAN DEFAULT true,
  session_timeout_minutes INTEGER DEFAULT 480,
  concurrent_session_limit INTEGER DEFAULT 2,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  user_id INTEGER,
  role_key VARCHAR(180),
  action_key VARCHAR(120) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  record_type VARCHAR(160),
  record_id VARCHAR(160),
  access_reason TEXT,
  ip_address VARCHAR(80),
  device TEXT,
  browser TEXT,
  location TEXT,
  outcome VARCHAR(80) DEFAULT 'SUCCESS',
  data_masked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  event_key VARCHAR(180) NOT NULL,
  event_type VARCHAR(120) NOT NULL,
  severity VARCHAR(80) DEFAULT 'INFO',
  summary TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_security_break_glass_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  request_key VARCHAR(180) NOT NULL,
  user_id INTEGER,
  role_key VARCHAR(180),
  patient_id INTEGER,
  reason TEXT NOT NULL,
  access_scope JSONB DEFAULT '[]'::jsonb,
  starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  approved_by INTEGER,
  status VARCHAR(80) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, request_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_key VARCHAR(180) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  report_category VARCHAR(120) NOT NULL,
  data_source VARCHAR(180) NOT NULL,
  filter_schema JSONB DEFAULT '[]'::jsonb,
  output_formats JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  audit_required BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_key)
);

CREATE TABLE IF NOT EXISTS clinical_security_api_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  group_key VARCHAR(120) NOT NULL,
  path_prefix VARCHAR(180) NOT NULL,
  description TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, group_key)
);

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
base_roles(role_key, role_name, role_category, hierarchy_rank, parent_role_key, mfa_required, break_glass_allowed, description) AS (
  VALUES
    ('tottech_super_admin','TOTTECH Super Admin','PLATFORM',1,NULL,true,true,'Can manage platform tenants and security; patient access requires authorization.'),
    ('tenant_admin','Tenant Admin','TENANT',10,'tottech_super_admin',true,true,'Manages tenant-level hospital network configuration.'),
    ('hospital_admin','Hospital Admin','HOSPITAL',20,'tenant_admin',true,true,'Manages hospital configuration, users, roles, and governance.'),
    ('branch_admin','Branch Admin','BRANCH',30,'hospital_admin',true,false,'Manages branch-level operations and users.'),
    ('department_head','Department Head','DEPARTMENT',40,'branch_admin',true,false,'Manages department users and workflows.'),
    ('doctor','Doctor','CLINICAL',50,'department_head',false,true,'Views assigned patients and performs clinical actions.'),
    ('nurse','Nurse','CLINICAL',60,'department_head',false,false,'Views ward patients and records nursing activity.'),
    ('receptionist','Receptionist','FRONT_DESK',70,'branch_admin',false,false,'Registers patients and books appointments.'),
    ('lab_technician','Lab Technician','DIAGNOSTICS',70,'department_head',false,false,'Collects samples and enters lab results.'),
    ('lab_manager','Lab Manager','DIAGNOSTICS',50,'department_head',true,false,'Approves and releases lab results.'),
    ('radiology_technician','Radiology Technician','DIAGNOSTICS',70,'department_head',false,false,'Captures radiology images.'),
    ('radiologist','Radiologist','DIAGNOSTICS',50,'department_head',true,false,'Reads images and approves radiology reports.'),
    ('pharmacist','Pharmacist','PHARMACY',70,'department_head',false,false,'Dispenses medication and manages inventory.'),
    ('pharmacy_manager','Pharmacy Manager','PHARMACY',50,'department_head',true,false,'Approves pharmacy purchases and returns.'),
    ('billing_executive','Billing Executive','FINANCE',70,'finance_manager',false,false,'Generates invoices and collects payments.'),
    ('insurance_executive','Insurance Executive','INSURANCE',70,'insurance_manager',true,false,'Creates and submits claims.'),
    ('insurance_manager','Insurance Manager','INSURANCE',50,'hospital_admin',true,false,'Approves claim submissions and settlements.'),
    ('referral_manager','Referral Manager','REFERRAL',60,'branch_admin',false,false,'Creates referrals and commissions.'),
    ('finance_manager','Finance Manager','FINANCE',50,'hospital_admin',true,false,'Approves refunds, write-offs, and revenue views.'),
    ('hr_manager','HR Manager','HR',60,'hospital_admin',true,false,'Manages staff lifecycle and HR records.'),
    ('patient','Patient','PORTAL',100,NULL,false,false,'Patient portal user.'),
    ('referral_partner','Referral Partner','PORTAL',100,'referral_manager',false,false,'External referral partner user.'),
    ('ivf_doctor','IVF Doctor','IVF',45,'department_head',true,true,'Creates cycles, approves transfers, reviews embryology.'),
    ('embryologist','Embryologist','IVF',55,'ivf_doctor',true,false,'Creates embryos, updates grades, manages cryo storage.'),
    ('ivf_coordinator','IVF Coordinator','IVF',70,'ivf_doctor',true,false,'Manages IVF appointments, consents, and documents.')
),
generated_roles AS (
  SELECT
    lower(replace(dept.department_name,' ','_')) || '_' || lower(levels.level_key) AS role_key,
    dept.department_name || ' ' || levels.level_name AS role_name,
    dept.category AS role_category,
    levels.rank AS hierarchy_rank,
    levels.parent_key AS parent_role_key,
    levels.mfa_required OR dept.sensitive AS mfa_required,
    dept.break_glass_allowed AS break_glass_allowed,
    dept.department_name || ' generated role for ' || levels.level_name || ' duties.' AS description
  FROM (
    VALUES
      ('Cardiology','CLINICAL',true,true),('Pediatrics','CLINICAL',false,true),('General Medicine','CLINICAL',false,true),('Nursing','CLINICAL',false,false),
      ('ER','CLINICAL',true,true),('ICU','CLINICAL',true,true),('OT','CLINICAL',true,true),('IVF','IVF',true,true),
      ('Embryology','IVF',true,false),('Laboratory','DIAGNOSTICS',true,false),('Radiology','DIAGNOSTICS',true,false),('PACS','DIAGNOSTICS',true,false),
      ('Pharmacy','PHARMACY',true,false),('Inventory','PHARMACY',false,false),('Billing','FINANCE',true,false),('Finance','FINANCE',true,false),
      ('Insurance','INSURANCE',true,false),('Referral','REFERRAL',false,false),('HR','HR',true,false),('Analytics','ANALYTICS',true,false),
      ('AI Governance','AI',true,false),('Integrations','INTEGRATION',true,false)
  ) AS dept(department_name, category, sensitive, break_glass_allowed)
  CROSS JOIN (
    VALUES
      ('admin','Admin',35,'branch_admin',true),
      ('manager','Manager',45,'department_head',true),
      ('lead','Lead',50,'department_head',false),
      ('specialist','Specialist',60,'department_head',false),
      ('executive','Executive',70,'branch_admin',false)
  ) AS levels(level_key, level_name, rank, parent_key, mfa_required)
  WHERE lower(replace(dept.department_name,' ','_')) || '_' || lower(levels.level_key) NOT IN (
    SELECT role_key FROM base_roles
  )
),
all_roles AS (
  SELECT * FROM base_roles
  UNION ALL
  SELECT * FROM generated_roles
)
INSERT INTO clinical_security_roles (
  tenant_id, hospital_id, branch_id, clinic_id, role_key, role_name, role_category, hierarchy_rank, parent_role_key, mfa_required, break_glass_allowed, description, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, all_roles.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN all_roles
ON CONFLICT (tenant_id, hospital_id, branch_id, role_key)
DO UPDATE SET role_name = EXCLUDED.role_name, role_category = EXCLUDED.role_category, hierarchy_rank = EXCLUDED.hierarchy_rank, parent_role_key = EXCLUDED.parent_role_key, mfa_required = EXCLUDED.mfa_required, break_glass_allowed = EXCLUDED.break_glass_allowed, description = EXCLUDED.description, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name) AS (
  VALUES
    ('patients','Patients'),('patient_demographics','Patient Demographics'),('patient_documents','Patient Documents'),('patient_timeline','Patient Timeline'),('appointments','Appointments'),
    ('op_consultations','OP Consultations'),('diagnosis','Diagnosis'),('prescriptions','Prescriptions'),('lab_orders','Lab Orders'),('lab_results','Lab Results'),
    ('radiology_orders','Radiology Orders'),('radiology_reports','Radiology Reports'),('pacs_images','PACS Images'),('ip_admissions','IP Admissions'),('ward_management','Ward Management'),
    ('bed_management','Bed Management'),('nursing_vitals','Nursing Vitals'),('medication_admin','Medication Administration'),('er_cases','ER Cases'),('icu_monitoring','ICU Monitoring'),
    ('ot_schedules','OT Schedules'),('ivf_cycles','IVF Cycles'),('ivf_embryology','IVF Embryology'),('ivf_cryo','IVF Cryo Storage'),('ivf_pregnancy','IVF Pregnancy'),
    ('ivf_donors','IVF Donors'),('pharmacy_sales','Pharmacy Sales'),('pharmacy_inventory','Pharmacy Inventory'),('pharmacy_purchases','Pharmacy Purchases'),('controlled_drugs','Controlled Drugs'),
    ('billing_invoices','Billing Invoices'),('payments','Payments'),('refunds','Refunds'),('discounts','Discounts'),('finance_revenue','Finance Revenue'),
    ('finance_gl','Finance GL'),('insurance_policies','Insurance Policies'),('insurance_claims','Insurance Claims'),('referral_commissions','Referral Commissions'),('hr_staff','HR Staff'),
    ('reports_clinical','Clinical Reports'),('reports_finance','Financial Reports'),('analytics','Analytics'),('ai_clinical','Clinical AI'),('ai_finance','Finance AI'),
    ('settings_users','Settings Users'),('settings_roles','Settings Roles'),('security_audit','Security Audit'),('exports','Exports'),('mobile_patient','Mobile Patient'),
    ('mobile_doctor','Mobile Doctor'),('mobile_nurse','Mobile Nurse')
),
actions(action_key, action_name) AS (
  VALUES
    ('create','Create'),('read','Read'),('update','Update'),('delete','Delete'),('approve','Approve'),
    ('reject','Reject'),('export','Export'),('print','Print'),('share','Share'),('audit_view','Audit View')
),
scopes(resource_scope) AS (
  VALUES ('own'),('assigned'),('department'),('branch'),('hospital'),('tenant'),('all'),('sensitive'),('bulk'),('emergency')
)
INSERT INTO clinical_security_permissions (
  tenant_id, hospital_id, branch_id, clinic_id, permission_key, module_key, module_name, action_key, action_name, resource_scope, permission_group,
  requires_reason, requires_approval, audit_required, description, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  modules.module_key || '.' || actions.action_key || '.' || scopes.resource_scope,
  modules.module_key,
  modules.module_name,
  actions.action_key,
  actions.action_name,
  scopes.resource_scope,
  CASE WHEN scopes.resource_scope IN ('sensitive','emergency') THEN 'ABAC' WHEN scopes.resource_scope = 'bulk' THEN 'BULK' ELSE 'RBAC' END,
  actions.action_key IN ('export','print','share','audit_view') OR scopes.resource_scope IN ('sensitive','bulk','emergency'),
  actions.action_key IN ('delete','approve','reject') OR scopes.resource_scope IN ('bulk','emergency'),
  true,
  modules.module_name || ' ' || actions.action_name || ' permission for ' || scopes.resource_scope || ' scope.',
  scope.user_id, scope.user_id
FROM scope CROSS JOIN modules CROSS JOIN actions CROSS JOIN scopes
ON CONFLICT (tenant_id, hospital_id, branch_id, permission_key)
DO UPDATE SET module_name = EXCLUDED.module_name, action_name = EXCLUDED.action_name, permission_group = EXCLUDED.permission_group, requires_reason = EXCLUDED.requires_reason, requires_approval = EXCLUDED.requires_approval, audit_required = EXCLUDED.audit_required, description = EXCLUDED.description, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
candidate AS (
  SELECT r.role_key, p.permission_key, p.module_key, p.action_key, p.resource_scope
  FROM clinical_security_roles r
  JOIN clinical_security_permissions p
    ON p.tenant_id = r.tenant_id AND p.hospital_id = r.hospital_id AND p.branch_id = r.branch_id
  WHERE r.tenant_id = (SELECT tenant_id FROM scope)
    AND r.hospital_id = (SELECT hospital_id FROM scope)
    AND r.branch_id = (SELECT branch_id FROM scope)
    AND COALESCE(r.is_deleted,false) = false
    AND COALESCE(p.is_deleted,false) = false
    AND (
      r.role_key = 'tottech_super_admin'
      OR (r.role_key IN ('tenant_admin','hospital_admin','branch_admin') AND p.resource_scope IN ('tenant','hospital','branch','department','assigned','own'))
      OR (r.role_key = 'doctor' AND p.module_key IN ('patients','patient_demographics','appointments','op_consultations','diagnosis','prescriptions','lab_orders','radiology_orders','patient_timeline') AND p.resource_scope IN ('assigned','department'))
      OR (r.role_key = 'nurse' AND p.module_key IN ('patients','nursing_vitals','medication_admin','ward_management','patient_timeline') AND p.resource_scope IN ('assigned','department'))
      OR (r.role_key = 'receptionist' AND p.module_key IN ('patients','patient_demographics','appointments','patient_documents') AND p.action_key IN ('create','read','update','share'))
      OR (r.role_key = 'lab_technician' AND p.module_key IN ('lab_orders','lab_results') AND p.action_key IN ('read','create','update'))
      OR (r.role_key = 'lab_manager' AND p.module_key IN ('lab_orders','lab_results','reports_clinical') AND p.action_key IN ('read','approve','reject','export','print','audit_view'))
      OR (r.role_key = 'radiology_technician' AND p.module_key IN ('radiology_orders','pacs_images') AND p.action_key IN ('read','create','update'))
      OR (r.role_key = 'radiologist' AND p.module_key IN ('radiology_orders','radiology_reports','pacs_images') AND p.action_key IN ('read','create','update','approve','print'))
      OR (r.role_key = 'pharmacist' AND p.module_key IN ('pharmacy_sales','pharmacy_inventory','prescriptions') AND p.action_key IN ('read','create','update','print'))
      OR (r.role_key = 'pharmacy_manager' AND p.module_key IN ('pharmacy_sales','pharmacy_inventory','pharmacy_purchases','controlled_drugs') AND p.action_key IN ('read','approve','reject','export','audit_view'))
      OR (r.role_key = 'billing_executive' AND p.module_key IN ('billing_invoices','payments','discounts') AND p.action_key IN ('read','create','update','print'))
      OR (r.role_key = 'finance_manager' AND p.module_key IN ('refunds','discounts','finance_revenue','finance_gl','payments','referral_commissions') AND p.action_key IN ('read','approve','reject','export','audit_view'))
      OR (r.role_key = 'insurance_executive' AND p.module_key IN ('insurance_policies','insurance_claims') AND p.action_key IN ('read','create','update','share'))
      OR (r.role_key = 'insurance_manager' AND p.module_key IN ('insurance_policies','insurance_claims') AND p.action_key IN ('read','approve','reject','export','audit_view'))
      OR (r.role_key = 'referral_manager' AND p.module_key IN ('referral_commissions','reports_finance') AND p.action_key IN ('read','create','update','export'))
      OR (r.role_key IN ('ivf_doctor','embryologist','ivf_coordinator') AND p.module_key LIKE 'ivf_%')
      OR substring(md5(r.role_key || p.permission_key),1,1) IN ('0','1')
    )
)
INSERT INTO clinical_security_role_permissions (
  tenant_id, hospital_id, branch_id, clinic_id, role_key, permission_key, access_decision, abac_conditions, field_mask_profile, record_scope_policy, approval_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  candidate.role_key,
  candidate.permission_key,
  'ALLOW',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','resource_scope',candidate.resource_scope),
  CASE WHEN candidate.resource_scope = 'sensitive' THEN 'sensitive_masking' ELSE 'standard' END,
  CASE
    WHEN candidate.role_key = 'doctor' THEN 'assigned_patients_only'
    WHEN candidate.role_key = 'nurse' THEN 'assigned_ward_patients_only'
    WHEN candidate.role_key = 'lab_technician' THEN 'lab_related_data_only'
    ELSE candidate.resource_scope || '_scope'
  END,
  jsonb_build_object('requiresApproval', candidate.action_key IN ('delete','approve','reject') OR candidate.resource_scope IN ('bulk','emergency')),
  scope.user_id, scope.user_id
FROM scope CROSS JOIN candidate
ON CONFLICT (tenant_id, hospital_id, branch_id, role_key, permission_key)
DO UPDATE SET access_decision = EXCLUDED.access_decision, abac_conditions = EXCLUDED.abac_conditions, field_mask_profile = EXCLUDED.field_mask_profile, record_scope_policy = EXCLUDED.record_scope_policy, approval_policy = EXCLUDED.approval_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
masks(mask_key, field_key, field_name, sensitive_type, mask_pattern, example_masked, full_access_roles, masked_roles, apply_to_modules) AS (
  VALUES
    ('aadhaar_mask','aadhaar_number','Aadhaar','AADHAAR','XXXX XXXX ####','XXXX XXXX 1234','["finance_manager","hospital_admin","tottech_super_admin"]'::jsonb,'["receptionist","nurse","referral_partner"]'::jsonb,'["patients","patient_demographics","patient_documents"]'::jsonb),
    ('abha_mask','abha_id','ABHA','ABHA','XX-XX-####','XX-XX-7890','["doctor","hospital_admin","tottech_super_admin"]'::jsonb,'["receptionist","billing_executive","referral_partner"]'::jsonb,'["patients","patient_demographics","patient_documents"]'::jsonb),
    ('passport_mask','passport_number','Passport','PASSPORT','XXXX####','XXXX5821','["hospital_admin","insurance_manager","tottech_super_admin"]'::jsonb,'["receptionist","nurse","referral_partner"]'::jsonb,'["patients","insurance_claims"]'::jsonb),
    ('insurance_policy_mask','insurance_policy_number','Insurance Policy','INSURANCE','POL-XXXX-####','POL-XXXX-4421','["insurance_executive","insurance_manager","finance_manager","tottech_super_admin"]'::jsonb,'["receptionist","nurse","referral_partner"]'::jsonb,'["insurance_policies","insurance_claims","billing_invoices"]'::jsonb),
    ('mobile_mask','mobile_number','Mobile Number','MOBILE','XXXXXX####','XXXXXX9876','["receptionist","doctor","finance_manager","hospital_admin","tottech_super_admin"]'::jsonb,'["referral_partner"]'::jsonb,'["patients","appointments","billing_invoices"]'::jsonb)
)
INSERT INTO clinical_security_data_masks (
  tenant_id, hospital_id, branch_id, clinic_id, mask_key, field_key, field_name, sensitive_type, mask_pattern, example_masked, full_access_roles, masked_roles, apply_to_modules, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, masks.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN masks
ON CONFLICT (tenant_id, hospital_id, branch_id, mask_key)
DO UPDATE SET field_key = EXCLUDED.field_key, field_name = EXCLUDED.field_name, sensitive_type = EXCLUDED.sensitive_type, mask_pattern = EXCLUDED.mask_pattern, example_masked = EXCLUDED.example_masked, full_access_roles = EXCLUDED.full_access_roles, masked_roles = EXCLUDED.masked_roles, apply_to_modules = EXCLUDED.apply_to_modules, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
policies(policy_key, policy_name, role_key, module_key, rule_expression, examples) AS (
  VALUES
    ('doctor_assigned_patients','Doctor Assigned Patients Only','doctor','patients','patient.doctor_id = current_user.doctor_id OR patient.care_team contains current_user','["Doctor can view assigned OP/IP patients only"]'::jsonb),
    ('nurse_assigned_ward','Nurse Assigned Ward Patients Only','nurse','patients','patient.ward_id IN current_user.assigned_wards','["Nurse can view ward patients only"]'::jsonb),
    ('lab_related_data','Lab Related Data Only','lab_technician','lab_results','lab_order.assigned_lab_id = current_user.department_id','["Lab technician can only view lab-related data"]'::jsonb),
    ('radiologist_assigned_studies','Radiologist Assigned Studies','radiologist','radiology_reports','study.radiologist_id = current_user.doctor_id OR study.department_id = current_user.department_id','["Radiologist can view assigned studies"]'::jsonb),
    ('patient_own_record','Patient Own Record','patient','patients','patient.user_id = current_user.id','["Patient can view their own portal record"]'::jsonb),
    ('referral_partner_own_referrals','Referral Partner Own Referrals','referral_partner','referral_commissions','referral.partner_user_id = current_user.id','["Referral partner sees own referrals only"]'::jsonb)
)
INSERT INTO clinical_security_record_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, policy_name, role_key, module_key, rule_expression, examples, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, policies.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN policies
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET policy_name = EXCLUDED.policy_name, role_key = EXCLUDED.role_key, module_key = EXCLUDED.module_key, rule_expression = EXCLUDED.rule_expression, examples = EXCLUDED.examples, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
field_rows(role_key, module_key, field_key, can_view, can_edit, mask_policy, denial_reason) AS (
  VALUES
    ('receptionist','patients','name',true,true,NULL,NULL),
    ('receptionist','patients','phone',true,true,'mobile_mask',NULL),
    ('receptionist','patients','address',true,true,NULL,NULL),
    ('receptionist','patients','insurance_settlement',false,false,NULL,'Reception cannot view financial settlement data.'),
    ('receptionist','patients','revenue',false,false,NULL,'Reception cannot view revenue.'),
    ('receptionist','patients','embryology_data',false,false,NULL,'Reception cannot view IVF embryology.'),
    ('doctor','patients','name',true,false,NULL,NULL),
    ('doctor','patients','abha_id',true,false,'abha_mask',NULL),
    ('doctor','patients','billing_amount',false,false,NULL,'Doctor cannot modify billing.'),
    ('nurse','patients','financial_data',false,false,NULL,'Nurse cannot view financial data.'),
    ('finance_manager','patients','insurance_settlement',true,false,NULL,NULL),
    ('finance_manager','patients','revenue',true,false,NULL,NULL)
)
INSERT INTO clinical_security_field_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, role_key, module_key, field_key, can_view, can_edit, mask_policy, denial_reason, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  field_rows.role_key || '_' || field_rows.module_key || '_' || field_rows.field_key,
  field_rows.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN field_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET role_key = EXCLUDED.role_key, module_key = EXCLUDED.module_key, field_key = EXCLUDED.field_key, can_view = EXCLUDED.can_view, can_edit = EXCLUDED.can_edit, mask_policy = EXCLUDED.mask_policy, denial_reason = EXCLUDED.denial_reason, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key) AS (
  VALUES ('patients'),('billing_invoices'),('payments'),('insurance_claims'),('lab_results'),('radiology_reports'),('ivf_embryology'),('pharmacy_inventory'),('finance_revenue'),('security_audit')
),
formats(export_format) AS (
  VALUES ('Excel'),('CSV'),('PDF'),('Print')
)
INSERT INTO clinical_security_export_controls (
  tenant_id, hospital_id, branch_id, clinic_id, control_key, module_key, export_format, permission_key, reason_required, audit_required, approval_required, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  modules.module_key || '_' || lower(formats.export_format),
  modules.module_key,
  formats.export_format,
  modules.module_key || '.' || CASE WHEN formats.export_format = 'Print' THEN 'print' ELSE 'export' END || '.sensitive',
  true,
  true,
  modules.module_key IN ('ivf_embryology','security_audit','finance_revenue'),
  scope.user_id, scope.user_id
FROM scope CROSS JOIN modules CROSS JOIN formats
ON CONFLICT (tenant_id, hospital_id, branch_id, control_key)
DO UPDATE SET module_key = EXCLUDED.module_key, export_format = EXCLUDED.export_format, permission_key = EXCLUDED.permission_key, reason_required = EXCLUDED.reason_required, audit_required = EXCLUDED.audit_required, approval_required = EXCLUDED.approval_required, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
bulk(action_key, module_key, approver_roles) AS (
  VALUES
    ('mass_delete','patients','["hospital_admin","tottech_super_admin"]'::jsonb),
    ('mass_update','patients','["hospital_admin","department_head"]'::jsonb),
    ('mass_export','patients','["hospital_admin","security_admin"]'::jsonb),
    ('mass_delete','billing_invoices','["finance_manager","hospital_admin"]'::jsonb),
    ('mass_update','pharmacy_inventory','["pharmacy_manager","hospital_admin"]'::jsonb),
    ('mass_export','security_audit','["hospital_admin","tottech_super_admin"]'::jsonb)
)
INSERT INTO clinical_security_bulk_action_controls (
  tenant_id, hospital_id, branch_id, clinic_id, control_key, action_key, module_key, approver_roles, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  bulk.action_key || '_' || bulk.module_key,
  bulk.action_key,
  bulk.module_key,
  bulk.approver_roles,
  scope.user_id, scope.user_id
FROM scope CROSS JOIN bulk
ON CONFLICT (tenant_id, hospital_id, branch_id, control_key)
DO UPDATE SET action_key = EXCLUDED.action_key, module_key = EXCLUDED.module_key, approver_roles = EXCLUDED.approver_roles, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
workflows(workflow_key, workflow_name, module_key, action_key, trigger_condition, approver_roles, sla_hours) AS (
  VALUES
    ('refund_approval','Refund Approval','refunds','approve','Any refund above configured threshold.','["finance_manager","hospital_admin"]'::jsonb,24),
    ('commission_payment_approval','Commission Payment Approval','referral_commissions','approve','Commission payment generated.','["finance_manager","hospital_admin"]'::jsonb,48),
    ('claim_submission_approval','Claim Submission Approval','insurance_claims','approve','Claim submission to insurer.','["insurance_manager","hospital_admin"]'::jsonb,24),
    ('asset_disposal_approval','Asset Disposal Approval','finance_gl','approve','Asset disposal or write-off.','["finance_manager","hospital_admin"]'::jsonb,72),
    ('stock_adjustment_approval','Stock Adjustment Approval','pharmacy_inventory','approve','Stock adjustment affecting inventory valuation.','["pharmacy_manager","finance_manager"]'::jsonb,24),
    ('discount_approval','Discount Approval','discounts','approve','Discount above user threshold.','["finance_manager","hospital_admin"]'::jsonb,12)
)
INSERT INTO clinical_security_approval_workflows (
  tenant_id, hospital_id, branch_id, clinic_id, workflow_key, workflow_name, module_key, action_key, trigger_condition, approver_roles, sla_hours, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, workflows.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN workflows
ON CONFLICT (tenant_id, hospital_id, branch_id, workflow_key)
DO UPDATE SET workflow_name = EXCLUDED.workflow_name, module_key = EXCLUDED.module_key, action_key = EXCLUDED.action_key, trigger_condition = EXCLUDED.trigger_condition, approver_roles = EXCLUDED.approver_roles, sla_hours = EXCLUDED.sla_hours, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
steps AS (
  SELECT workflow_key, 1 AS step_order, 'Request Submitted' AS step_name, NULL::varchar AS approver_role, 'SUBMIT' AS action_required FROM clinical_security_approval_workflows
  UNION ALL
  SELECT workflow_key, 2, 'Manager Review', (approver_roles->>0)::varchar, 'APPROVE' FROM clinical_security_approval_workflows
  UNION ALL
  SELECT workflow_key, 3, 'Final Audit Lock', (approver_roles->>1)::varchar, 'AUDIT_LOCK' FROM clinical_security_approval_workflows
)
INSERT INTO clinical_security_workflow_steps (
  tenant_id, hospital_id, branch_id, clinic_id, workflow_key, step_order, step_name, approver_role, action_required, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  steps.workflow_key, steps.step_order, steps.step_name, steps.approver_role, steps.action_required,
  scope.user_id, scope.user_id
FROM scope CROSS JOIN steps
WHERE steps.workflow_key IN (
  SELECT workflow_key FROM clinical_security_approval_workflows
  WHERE tenant_id = scope.tenant_id AND hospital_id = scope.hospital_id AND branch_id = scope.branch_id
)
ON CONFLICT (tenant_id, hospital_id, branch_id, workflow_key, step_order)
DO UPDATE SET step_name = EXCLUDED.step_name, approver_role = EXCLUDED.approver_role, action_required = EXCLUDED.action_required, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
roles AS (
  SELECT role_key FROM clinical_security_roles
  WHERE tenant_id = (SELECT tenant_id FROM scope)
    AND hospital_id = (SELECT hospital_id FROM scope)
    AND branch_id = (SELECT branch_id FROM scope)
    AND (mfa_required = true OR role_key IN ('hospital_admin','finance_manager','insurance_manager','ivf_doctor','tottech_super_admin'))
)
INSERT INTO clinical_security_mfa_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, role_key, factor_policy, required_context, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  roles.role_key || '_mfa',
  roles.role_key,
  '["password","otp","trusted_device"]'::jsonb,
  '["login","sensitive_export","approval","break_glass"]'::jsonb,
  scope.user_id, scope.user_id
FROM scope CROSS JOIN roles
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET role_key = EXCLUDED.role_key, factor_policy = EXCLUDED.factor_policy, required_context = EXCLUDED.required_context, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
)
INSERT INTO clinical_security_session_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, role_key, session_timeout_minutes, concurrent_session_limit, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  role_key || '_session',
  role_key,
  CASE WHEN mfa_required THEN 240 ELSE 480 END,
  CASE WHEN role_key IN ('tottech_super_admin','hospital_admin','finance_manager','insurance_manager') THEN 1 ELSE 2 END,
  scope.user_id, scope.user_id
FROM scope
JOIN clinical_security_roles r ON r.tenant_id = scope.tenant_id AND r.hospital_id = scope.hospital_id AND r.branch_id = scope.branch_id
WHERE COALESCE(r.is_deleted,false) = false
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET role_key = EXCLUDED.role_key, session_timeout_minutes = EXCLUDED.session_timeout_minutes, concurrent_session_limit = EXCLUDED.concurrent_session_limit, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
reports(report_key, report_name, report_category, data_source, filter_schema) AS (
  VALUES
    ('login_audit','Login Audit','SESSION','clinical_security_access_logs','["date_range","user","role","outcome"]'::jsonb),
    ('failed_logins','Failed Logins','SESSION','clinical_security_access_logs','["date_range","user","ip_address"]'::jsonb),
    ('data_exports','Data Exports','EXPORT','clinical_security_access_logs','["date_range","module","format","reason"]'::jsonb),
    ('permission_changes','Permission Changes','RBAC','clinical_security_events','["date_range","role","permission"]'::jsonb),
    ('sensitive_record_access','Sensitive Record Access','DATA_SECURITY','clinical_security_access_logs','["date_range","module","record_type","data_masked"]'::jsonb),
    ('break_glass_access','Break Glass Access','EMERGENCY','clinical_security_break_glass_access','["date_range","user","patient","status"]'::jsonb)
)
INSERT INTO clinical_security_reports (
  tenant_id, hospital_id, branch_id, clinic_id, report_key, report_name, report_category, data_source, filter_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, reports.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN reports
ON CONFLICT (tenant_id, hospital_id, branch_id, report_key)
DO UPDATE SET report_name = EXCLUDED.report_name, report_category = EXCLUDED.report_category, data_source = EXCLUDED.data_source, filter_schema = EXCLUDED.filter_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
groups(group_key, path_prefix, description) AS (
  VALUES
    ('rbac','/api/clinical/security/rbac','Role hierarchy and role-permission matrix.'),
    ('permissions','/api/clinical/security/permissions','Permission catalog and action security.'),
    ('security','/api/clinical/security','Security governance registry.'),
    ('access_logs','/api/clinical/security/access-logs','Access logs and session tracking.'),
    ('approvals','/api/clinical/security/approvals','Approval workflow engine.'),
    ('audit','/api/clinical/security/audit','Audit and sensitive access reports.')
)
INSERT INTO clinical_security_api_groups (
  tenant_id, hospital_id, branch_id, clinic_id, group_key, path_prefix, description, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, groups.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN groups
ON CONFLICT (tenant_id, hospital_id, branch_id, group_key)
DO UPDATE SET path_prefix = EXCLUDED.path_prefix, description = EXCLUDED.description, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

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
    ('security_core','Security Governance','/clinical-services/security','Clinical Security Governance','clinical.security.read',1410),
    ('security_rbac','RBAC Roles','/clinical-services/security/roles','Clinical Security Governance','clinical.security.roles',1420),
    ('security_permissions','Permissions','/clinical-services/security/permissions','Clinical Security Governance','clinical.security.permissions',1430),
    ('security_role_matrix','Role Matrix','/clinical-services/security/role-permissions','Clinical Security Governance','clinical.security.matrix',1440),
    ('security_data_masks','Data Masking','/clinical-services/security/data-masks','Clinical Security Governance','clinical.security.masks',1450),
    ('security_access_logs','Access Logs','/clinical-services/security/access-logs','Clinical Security Governance','clinical.security.access_logs',1460),
    ('security_approvals','Approval Workflows','/clinical-services/security/approval-workflows','Clinical Security Governance','clinical.security.approvals',1470),
    ('security_mfa','MFA Policies','/clinical-services/security/mfa','Clinical Security Governance','clinical.security.mfa',1480),
    ('security_break_glass','Break Glass','/clinical-services/security/break-glass','Clinical Security Governance','clinical.security.break_glass',1490),
    ('security_reports','Security Reports','/clinical-services/security/reports','Clinical Security Governance','clinical.security.reports',1500)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.clinic_id, scope.hospital_id, scope.branch_id, items.menu_key, items.label, items.path, items.module_name, items.permission_key, items.sort_order,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET hospital_id = EXCLUDED.hospital_id, branch_id = EXCLUDED.branch_id, label = EXCLUDED.label, path = EXCLUDED.path, module_name = EXCLUDED.module_name, permission_key = EXCLUDED.permission_key, sort_order = EXCLUDED.sort_order, is_enabled = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_security_events (
  tenant_id, hospital_id, branch_id, clinic_id, event_key, event_type, severity, summary, payload, created_by
)
SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id), COALESCE(cup.branch_id, c.branch_id), cup.clinic_id,
  'phase13_security_governance_installed',
  'PHASE_INSTALL',
  'INFO',
  'Phase 13 enterprise RBAC, ABAC, data masking, audit, approval, MFA, and break-glass governance installed.',
  jsonb_build_object('roles_target','100+','permissions_target','5000+','security_model','RBAC+ABAC+Tenant Isolation+Data Masking'),
  cup.user_id
FROM clinical_user_profiles cup
JOIN clinics c ON c.id = cup.clinic_id
WHERE COALESCE(cup.is_deleted,false) = false
ORDER BY cup.id ASC
LIMIT 1;

INSERT INTO clinical_audit_events (
  tenant_id, hospital_id, branch_id, clinic_id, user_id, module_name, action, entity_type, summary, payload, created_at
)
SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id), COALESCE(cup.branch_id, c.branch_id), cup.clinic_id, cup.user_id,
  'Clinical Phase 13 Security Governance',
  'PHASE_13_SECURITY_GOVERNANCE_INSTALLED',
  'clinical_security_governance_pack',
  'Phase 13 enterprise RBAC, ABAC, permission matrix, data masking, access logs, approvals, MFA, break-glass access, and security reporting installed.',
  jsonb_build_object('roles','100+','permissions','5000+','api_groups','/rbac,/permissions,/security,/access-logs,/approvals,/audit'),
  CURRENT_TIMESTAMP
FROM clinical_user_profiles cup
JOIN clinics c ON c.id = cup.clinic_id
WHERE COALESCE(cup.is_deleted,false) = false
ORDER BY cup.id ASC
LIMIT 1;
