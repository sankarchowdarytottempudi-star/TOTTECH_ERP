-- TOTTECH Clinical Services Phase 2 foundation.
-- Idempotent migration for coexistence with the existing School ERP.

CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  organization_name VARCHAR(255) NOT NULL,
  organization_code VARCHAR(80) UNIQUE NOT NULL,
  legal_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(40),
  address TEXT,
  branding JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinic_groups (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  organization_id INTEGER REFERENCES organizations(id),
  group_name VARCHAR(255) NOT NULL,
  group_code VARCHAR(80) NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(organization_id, group_code)
);

CREATE TABLE IF NOT EXISTS clinics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  organization_id INTEGER REFERENCES organizations(id),
  clinic_group_id INTEGER REFERENCES clinic_groups(id),
  clinic_name VARCHAR(255) NOT NULL,
  clinic_code VARCHAR(80) NOT NULL,
  clinic_type VARCHAR(120) DEFAULT 'IVF_CLINIC',
  email VARCHAR(255),
  phone VARCHAR(40),
  address TEXT,
  city VARCHAR(120),
  state VARCHAR(120),
  country VARCHAR(120) DEFAULT 'India',
  branding JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(organization_id, clinic_code)
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  organization_id INTEGER REFERENCES organizations(id),
  department_name VARCHAR(255) NOT NULL,
  department_code VARCHAR(80) NOT NULL,
  department_type VARCHAR(120),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(clinic_id, department_code)
);

CREATE TABLE IF NOT EXISTS clinical_roles (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  role_name VARCHAR(150) NOT NULL,
  role_key VARCHAR(150) NOT NULL,
  permissions JSONB DEFAULT '{}'::jsonb,
  field_permissions JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, clinic_id, role_key)
);

CREATE TABLE IF NOT EXISTS clinical_user_profiles (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  user_id INTEGER REFERENCES users(id),
  clinical_role_id INTEGER REFERENCES clinical_roles(id),
  department_id INTEGER REFERENCES departments(id),
  project_type VARCHAR(50) DEFAULT 'CLINICAL',
  display_name VARCHAR(255),
  settings JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(user_id, tenant_id, clinic_id)
);

CREATE TABLE IF NOT EXISTS clinical_menu_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  menu_key VARCHAR(150) NOT NULL,
  label VARCHAR(255) NOT NULL,
  path VARCHAR(255),
  parent_key VARCHAR(150),
  module_name VARCHAR(150),
  permission_key VARCHAR(150),
  sort_order INTEGER DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, clinic_id, menu_key)
);

CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  patient_uid VARCHAR(80) UNIQUE NOT NULL,
  first_name VARCHAR(150) NOT NULL,
  middle_name VARCHAR(150),
  last_name VARCHAR(150),
  gender VARCHAR(40),
  date_of_birth DATE,
  phone VARCHAR(40),
  email VARCHAR(255),
  address TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(40),
  insurance_provider VARCHAR(255),
  insurance_number VARCHAR(120),
  blood_group VARCHAR(20),
  allergies TEXT,
  medical_history TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  qr_payload JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  user_id INTEGER REFERENCES users(id),
  doctor_uid VARCHAR(80) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  department_id INTEGER REFERENCES departments(id),
  phone VARCHAR(40),
  email VARCHAR(255),
  consultation_fee NUMERIC(12,2) DEFAULT 0,
  availability JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'AVAILABLE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  appointment_uid VARCHAR(80) UNIQUE NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  appointment_type VARCHAR(120) DEFAULT 'OPD',
  status VARCHAR(80) DEFAULT 'BOOKED',
  token_number VARCHAR(80),
  queue_status VARCHAR(80) DEFAULT 'WAITING',
  reason TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  appointment_id INTEGER REFERENCES appointments(id),
  record_type VARCHAR(120) DEFAULT 'OPD_NOTE',
  chief_complaint TEXT,
  vitals JSONB DEFAULT '{}'::jsonb,
  diagnosis TEXT,
  treatment_plan TEXT,
  clinical_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ivf_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  case_uid VARCHAR(80) UNIQUE NOT NULL,
  female_partner_profile JSONB DEFAULT '{}'::jsonb,
  male_partner_profile JSONB DEFAULT '{}'::jsonb,
  cycle_type VARCHAR(120),
  cycle_status VARCHAR(120) DEFAULT 'ACTIVE',
  stimulation_protocol TEXT,
  egg_retrieval_date DATE,
  embryo_transfer_date DATE,
  outcome_status VARCHAR(120),
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS lab_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  order_uid VARCHAR(80) UNIQUE NOT NULL,
  order_type VARCHAR(120),
  priority VARCHAR(80) DEFAULT 'NORMAL',
  status VARCHAR(80) DEFAULT 'ORDERED',
  ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS lab_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  lab_order_id INTEGER REFERENCES lab_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  result_uid VARCHAR(80) UNIQUE NOT NULL,
  result_status VARCHAR(80) DEFAULT 'PENDING_VALIDATION',
  result_data JSONB DEFAULT '{}'::jsonb,
  interpretation TEXT,
  validated_by INTEGER,
  validated_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  appointment_id INTEGER REFERENCES appointments(id),
  prescription_uid VARCHAR(80) UNIQUE NOT NULL,
  medications JSONB DEFAULT '[]'::jsonb,
  instructions TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS medical_documents (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  patient_id INTEGER REFERENCES patients(id),
  document_uid VARCHAR(80) UNIQUE NOT NULL,
  document_type VARCHAR(120),
  title VARCHAR(255) NOT NULL,
  file_url TEXT,
  version INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_forms (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  form_key VARCHAR(150) NOT NULL,
  form_name VARCHAR(255) NOT NULL,
  module_name VARCHAR(150) NOT NULL,
  version INTEGER DEFAULT 1,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  layout JSONB DEFAULT '{}'::jsonb,
  validations JSONB DEFAULT '{}'::jsonb,
  workflow_key VARCHAR(150),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, clinic_id, form_key, version)
);

CREATE TABLE IF NOT EXISTS clinical_form_fields (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  form_id INTEGER REFERENCES clinical_forms(id) ON DELETE CASCADE,
  field_key VARCHAR(150) NOT NULL,
  label VARCHAR(255) NOT NULL,
  field_type VARCHAR(80) NOT NULL,
  section_key VARCHAR(150),
  tab_key VARCHAR(150),
  sort_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  options JSONB DEFAULT '[]'::jsonb,
  validations JSONB DEFAULT '{}'::jsonb,
  visibility_rules JSONB DEFAULT '{}'::jsonb,
  default_value TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(form_id, field_key)
);

CREATE TABLE IF NOT EXISTS clinical_workflows (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  workflow_key VARCHAR(150) NOT NULL,
  workflow_name VARCHAR(255) NOT NULL,
  module_name VARCHAR(150) NOT NULL,
  statuses JSONB DEFAULT '[]'::jsonb,
  transitions JSONB DEFAULT '[]'::jsonb,
  approvals JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, clinic_id, workflow_key)
);

CREATE TABLE IF NOT EXISTS clinical_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  report_key VARCHAR(150) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  module_name VARCHAR(150),
  definition JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, clinic_id, report_key)
);

CREATE TABLE IF NOT EXISTS clinical_audit_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  user_id INTEGER REFERENCES users(id),
  module_name VARCHAR(150) NOT NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(120),
  entity_id INTEGER,
  summary TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_ai_logs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  clinic_id INTEGER,
  user_id INTEGER REFERENCES users(id),
  prompt TEXT NOT NULL,
  answer TEXT,
  confidence_score INTEGER DEFAULT 0,
  data_sources JSONB DEFAULT '[]'::jsonb,
  reasoning_summary TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_clinics_tenant ON clinics(tenant_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_departments_clinic ON departments(clinic_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_patients_scope ON patients(tenant_id, clinic_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_patients_search ON patients(tenant_id, clinic_id, lower(first_name), lower(last_name), phone);
CREATE INDEX IF NOT EXISTS idx_doctors_scope ON doctors(tenant_id, clinic_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_appointments_scope_date ON appointments(tenant_id, clinic_id, appointment_date, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(tenant_id, clinic_id, patient_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_ivf_cases_patient ON ivf_cases(tenant_id, clinic_id, patient_id, cycle_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_lab_orders_scope ON lab_orders(tenant_id, clinic_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_forms_scope ON clinical_forms(tenant_id, clinic_id, module_name, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_audit_scope ON clinical_audit_events(tenant_id, clinic_id, module_name, created_at);

INSERT INTO organizations (
  organization_name,
  organization_code,
  legal_name,
  branding,
  settings
)
VALUES (
  'TOTTECH Clinical Services',
  'TCS',
  'TOTTECH Clinical Services',
  '{"theme":"medical-blue-teal","logo":"/brand/tottech-clinical-services/logo.png"}'::jsonb,
  '{"projectType":"CLINICAL"}'::jsonb
)
ON CONFLICT (organization_code)
DO UPDATE SET
  organization_name = EXCLUDED.organization_name,
  branding = EXCLUDED.branding,
  settings = EXCLUDED.settings,
  updated_at = CURRENT_TIMESTAMP;

UPDATE organizations
SET tenant_id = id
WHERE organization_code = 'TCS'
  AND tenant_id IS NULL;

INSERT INTO clinic_groups (
  tenant_id,
  organization_id,
  group_name,
  group_code
)
SELECT id, id, 'TOTTECH Fertility Group', 'TCS-FERTILITY'
FROM organizations
WHERE organization_code = 'TCS'
ON CONFLICT (organization_id, group_code)
DO NOTHING;

INSERT INTO clinics (
  tenant_id,
  organization_id,
  clinic_group_id,
  clinic_name,
  clinic_code,
  clinic_type,
  city,
  state,
  branding,
  settings
)
SELECT
  o.id,
  o.id,
  cg.id,
  'TOTTECH IVF Center',
  'TCS-IVF-HYD',
  'IVF_CLINIC',
  'Hyderabad',
  'Telangana',
  '{"theme":"medical-blue-teal","logo":"/brand/tottech-clinical-services/logo.png"}'::jsonb,
  '{"default":true}'::jsonb
FROM organizations o
LEFT JOIN clinic_groups cg
  ON cg.organization_id = o.id
  AND cg.group_code = 'TCS-FERTILITY'
WHERE o.organization_code = 'TCS'
ON CONFLICT (organization_id, clinic_code)
DO UPDATE SET
  clinic_name = EXCLUDED.clinic_name,
  branding = EXCLUDED.branding,
  settings = EXCLUDED.settings,
  updated_at = CURRENT_TIMESTAMP;

UPDATE clinics
SET clinic_id = id
WHERE clinic_code = 'TCS-IVF-HYD'
  AND clinic_id IS NULL;

INSERT INTO departments (
  tenant_id,
  clinic_id,
  organization_id,
  department_name,
  department_code,
  department_type
)
SELECT c.tenant_id, c.id, c.organization_id, item.department_name, item.department_code, item.department_type
FROM clinics c
CROSS JOIN (
  VALUES
    ('Front Desk', 'FRONT_DESK', 'OPERATIONS'),
    ('OPD', 'OPD', 'CLINICAL'),
    ('IVF', 'IVF', 'SPECIALTY'),
    ('Embryology', 'EMBRYOLOGY', 'LAB'),
    ('Laboratory', 'LAB', 'LAB'),
    ('Radiology', 'RADIOLOGY', 'DIAGNOSTICS'),
    ('Pharmacy', 'PHARMACY', 'OPERATIONS'),
    ('Billing', 'BILLING', 'FINANCE')
) AS item(department_name, department_code, department_type)
WHERE c.clinic_code = 'TCS-IVF-HYD'
ON CONFLICT (clinic_id, department_code)
DO UPDATE SET
  department_name = EXCLUDED.department_name,
  department_type = EXCLUDED.department_type,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_roles (
  tenant_id,
  clinic_id,
  role_name,
  role_key,
  permissions,
  field_permissions
)
SELECT
  c.tenant_id,
  c.id,
  role_name,
  role_key,
  jsonb_build_object(
    'create', true,
    'read', true,
    'update', true,
    'delete', role_key IN ('clinical_super_admin','organization_admin','clinic_admin'),
    'approve', role_key IN ('clinical_super_admin','organization_admin','clinic_admin','auditor'),
    'export', true,
    'aiAccess', role_key NOT IN ('patient_support'),
    'modules', modules
  ),
  '{}'::jsonb
FROM clinics c
CROSS JOIN (
  VALUES
    ('Clinical Super Admin', 'clinical_super_admin', '["*"]'::jsonb),
    ('Organization Admin', 'organization_admin', '["dashboard","patients","appointments","forms","reports","admin"]'::jsonb),
    ('Clinic Admin', 'clinic_admin', '["dashboard","patients","appointments","front_desk","reports","settings"]'::jsonb),
    ('Receptionist', 'receptionist', '["front_desk","patients","appointments"]'::jsonb),
    ('Doctor', 'doctor', '["patients","appointments","opd","prescriptions","ai"]'::jsonb),
    ('IVF Specialist', 'ivf_specialist', '["patients","appointments","ivf","lab","ai"]'::jsonb),
    ('Embryologist', 'embryologist', '["ivf","lab"]'::jsonb),
    ('Nurse', 'nurse', '["patients","appointments","ipd","opd"]'::jsonb),
    ('Lab Technician', 'lab_technician', '["lab","patients"]'::jsonb),
    ('Radiologist', 'radiologist', '["radiology","patients"]'::jsonb),
    ('Pharmacist', 'pharmacist', '["pharmacy","prescriptions"]'::jsonb),
    ('Billing Executive', 'billing_executive', '["billing","patients"]'::jsonb),
    ('Patient Support', 'patient_support', '["patients","appointments"]'::jsonb),
    ('Auditor', 'auditor', '["audit","reports"]'::jsonb)
) AS r(role_name, role_key, modules)
WHERE c.clinic_code = 'TCS-IVF-HYD'
ON CONFLICT (tenant_id, clinic_id, role_key)
DO UPDATE SET
  role_name = EXCLUDED.role_name,
  permissions = EXCLUDED.permissions,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_user_profiles (
  tenant_id,
  clinic_id,
  user_id,
  clinical_role_id,
  project_type,
  display_name
)
SELECT
  c.tenant_id,
  c.id,
  u.id,
  cr.id,
  'CLINICAL',
  u.full_name
FROM users u
CROSS JOIN clinics c
JOIN clinical_roles cr
  ON cr.tenant_id = c.tenant_id
  AND cr.clinic_id = c.id
  AND cr.role_key = 'clinical_super_admin'
WHERE lower(u.email) = 'cs-superadmin@erp.com'
  AND c.clinic_code = 'TCS-IVF-HYD'
ON CONFLICT (user_id, tenant_id, clinic_id)
DO UPDATE SET
  clinical_role_id = EXCLUDED.clinical_role_id,
  project_type = 'CLINICAL',
  display_name = EXCLUDED.display_name,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_menu_items (
  tenant_id,
  clinic_id,
  menu_key,
  label,
  path,
  module_name,
  permission_key,
  sort_order
)
SELECT
  c.tenant_id,
  c.id,
  item.menu_key,
  item.label,
  item.path,
  item.module_name,
  item.permission_key,
  item.sort_order
FROM clinics c
CROSS JOIN (
  VALUES
    ('dashboard','Dashboard','/clinical-services','dashboard','clinical.dashboard.read',10),
    ('patients','Patient Management','/clinical-services/patients','patients','clinical.patients.read',20),
    ('appointments','Appointments','/clinical-services/appointments','appointments','clinical.appointments.read',30),
    ('doctors','Doctors','/clinical-services/doctors','doctors','clinical.doctors.read',40),
    ('front_desk','Front Desk','/clinical-services/front-desk','front_desk','clinical.front_desk.read',50),
    ('opd','OPD','/clinical-services/opd','opd','clinical.opd.read',60),
    ('ipd','IPD','/clinical-services/ipd','ipd','clinical.ipd.read',70),
    ('ivf','IVF Management','/clinical-services/ivf','ivf','clinical.ivf.read',80),
    ('laboratory','Laboratory','/clinical-services/laboratory','laboratory','clinical.lab.read',90),
    ('radiology','Radiology','/clinical-services/radiology','radiology','clinical.radiology.read',100),
    ('pharmacy','Pharmacy','/clinical-services/pharmacy','pharmacy','clinical.pharmacy.read',110),
    ('billing','Billing','/clinical-services/billing','billing','clinical.billing.read',120),
    ('inventory','Inventory','/clinical-services/inventory','inventory','clinical.inventory.read',130),
    ('reports','Reports','/clinical-services/reports','reports','clinical.reports.read',140),
    ('documents','Document Center','/clinical-services/documents','documents','clinical.documents.read',150),
    ('workflow','Workflow Designer','/clinical-services/workflows','workflows','clinical.workflows.manage',160),
    ('form_builder','Form Builder','/clinical-services/forms','forms','clinical.forms.manage',170),
    ('ai','TOTTECH AI Clinical','/clinical-services/ai','ai','clinical.ai.use',180),
    ('administration','Administration','/clinical-services/administration','administration','clinical.admin.manage',190),
    ('settings','Settings','/clinical-services/settings','settings','clinical.settings.manage',200)
) AS item(menu_key, label, path, module_name, permission_key, sort_order)
WHERE c.clinic_code = 'TCS-IVF-HYD'
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET
  label = EXCLUDED.label,
  path = EXCLUDED.path,
  module_name = EXCLUDED.module_name,
  permission_key = EXCLUDED.permission_key,
  sort_order = EXCLUDED.sort_order,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

INSERT INTO clinical_forms (
  tenant_id,
  clinic_id,
  form_key,
  form_name,
  module_name,
  version,
  layout,
  validations
)
SELECT
  c.tenant_id,
  c.id,
  'patient_registration',
  'Patient Registration',
  'patients',
  1,
  '{"tabs":[{"key":"identity","label":"Identity"},{"key":"contact","label":"Contact"},{"key":"clinical","label":"Clinical"},{"key":"insurance","label":"Insurance"}]}'::jsonb,
  '{}'::jsonb
FROM clinics c
WHERE c.clinic_code = 'TCS-IVF-HYD'
ON CONFLICT (tenant_id, clinic_id, form_key, version)
DO UPDATE SET
  form_name = EXCLUDED.form_name,
  layout = EXCLUDED.layout,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

INSERT INTO clinical_form_fields (
  tenant_id,
  clinic_id,
  form_id,
  field_key,
  label,
  field_type,
  section_key,
  tab_key,
  sort_order,
  is_required,
  options,
  validations
)
SELECT
  f.tenant_id,
  f.clinic_id,
  f.id,
  field.field_key,
  field.label,
  field.field_type,
  field.section_key,
  field.tab_key,
  field.sort_order,
  field.is_required,
  field.options,
  field.validations
FROM clinical_forms f
CROSS JOIN (
  VALUES
    ('first_name','First Name','Text','identity','identity',10,true,'[]'::jsonb,'{}'::jsonb),
    ('last_name','Last Name','Text','identity','identity',20,false,'[]'::jsonb,'{}'::jsonb),
    ('gender','Gender','Dropdown','identity','identity',30,false,'["Female","Male","Other"]'::jsonb,'{}'::jsonb),
    ('date_of_birth','Date of Birth','Date','identity','identity',40,false,'[]'::jsonb,'{}'::jsonb),
    ('phone','Phone','Phone','contact','contact',50,false,'[]'::jsonb,'{}'::jsonb),
    ('email','Email','Email','contact','contact',60,false,'[]'::jsonb,'{}'::jsonb),
    ('emergency_contact_name','Emergency Contact Name','Text','contact','contact',70,false,'[]'::jsonb,'{}'::jsonb),
    ('emergency_contact_phone','Emergency Contact Phone','Phone','contact','contact',80,false,'[]'::jsonb,'{}'::jsonb),
    ('allergies','Allergies','Rich Text','history','clinical',90,false,'[]'::jsonb,'{}'::jsonb),
    ('medical_history','Medical History','Rich Text','history','clinical',100,false,'[]'::jsonb,'{}'::jsonb),
    ('insurance_provider','Insurance Provider','Text','insurance','insurance',110,false,'[]'::jsonb,'{}'::jsonb),
    ('insurance_number','Insurance Number','Text','insurance','insurance',120,false,'[]'::jsonb,'{}'::jsonb)
) AS field(field_key, label, field_type, section_key, tab_key, sort_order, is_required, options, validations)
WHERE f.form_key = 'patient_registration'
ON CONFLICT (form_id, field_key)
DO UPDATE SET
  label = EXCLUDED.label,
  field_type = EXCLUDED.field_type,
  section_key = EXCLUDED.section_key,
  tab_key = EXCLUDED.tab_key,
  sort_order = EXCLUDED.sort_order,
  is_required = EXCLUDED.is_required,
  options = EXCLUDED.options,
  validations = EXCLUDED.validations,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

INSERT INTO clinical_workflows (
  tenant_id,
  clinic_id,
  workflow_key,
  workflow_name,
  module_name,
  statuses,
  transitions,
  approvals
)
SELECT
  c.tenant_id,
  c.id,
  'appointment_lifecycle',
  'Appointment Lifecycle',
  'appointments',
  '["BOOKED","CHECKED_IN","IN_CONSULTATION","CHECKED_OUT","CANCELLED"]'::jsonb,
  '[{"from":"BOOKED","to":"CHECKED_IN"},{"from":"CHECKED_IN","to":"IN_CONSULTATION"},{"from":"IN_CONSULTATION","to":"CHECKED_OUT"},{"from":"BOOKED","to":"CANCELLED"}]'::jsonb,
  '[]'::jsonb
FROM clinics c
WHERE c.clinic_code = 'TCS-IVF-HYD'
ON CONFLICT (tenant_id, clinic_id, workflow_key)
DO UPDATE SET
  statuses = EXCLUDED.statuses,
  transitions = EXCLUDED.transitions,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;
