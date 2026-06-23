-- TOTTECH Clinical Services - Phase 17 HRMS + Payroll + Biometric + Roster + Credentialing + LMS

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

CREATE TABLE IF NOT EXISTS clinical_hr_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id VARCHAR(120) NOT NULL,
  employee_number VARCHAR(120),
  first_name VARCHAR(160) NOT NULL,
  middle_name VARCHAR(160),
  last_name VARCHAR(160),
  gender VARCHAR(40),
  date_of_birth DATE,
  marital_status VARCHAR(60),
  nationality VARCHAR(120),
  photo_url TEXT,
  mobile VARCHAR(40),
  alternate_mobile VARCHAR(40),
  email VARCHAR(220),
  emergency_contact JSONB DEFAULT '{}'::jsonb,
  address JSONB DEFAULT '{}'::jsonb,
  department VARCHAR(180),
  designation VARCHAR(180),
  employment_type VARCHAR(80),
  date_of_joining DATE,
  probation_end_date DATE,
  reporting_manager_id UUID,
  cost_center VARCHAR(160),
  profit_center VARCHAR(160),
  employee_status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, employee_id)
);

CREATE TABLE IF NOT EXISTS clinical_hr_employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  document_type VARCHAR(160) NOT NULL,
  document_number VARCHAR(180),
  file_url TEXT,
  verification_status VARCHAR(80) DEFAULT 'PENDING',
  verified_by INTEGER,
  verified_at TIMESTAMP,
  expiry_date DATE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  requisition_number VARCHAR(160) NOT NULL,
  department VARCHAR(180) NOT NULL,
  position VARCHAR(180) NOT NULL,
  vacancies INTEGER DEFAULT 1,
  requested_by INTEGER,
  approval_status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, requisition_number)
);

CREATE TABLE IF NOT EXISTS clinical_hr_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  candidate_id VARCHAR(160) NOT NULL,
  requisition_id UUID REFERENCES clinical_hr_requisitions(id),
  candidate_name VARCHAR(220) NOT NULL,
  mobile VARCHAR(40),
  email VARCHAR(220),
  qualification TEXT,
  experience_years NUMERIC(6,2),
  resume_url TEXT,
  source VARCHAR(120),
  workflow_stage VARCHAR(80) DEFAULT 'APPLICATION',
  offer_status VARCHAR(80),
  joining_date DATE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, candidate_id)
);

CREATE TABLE IF NOT EXISTS clinical_hr_onboarding_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  checklist_item VARCHAR(220) NOT NULL,
  checklist_category VARCHAR(120) NOT NULL,
  status VARCHAR(80) DEFAULT 'PENDING',
  due_date DATE,
  completed_at TIMESTAMP,
  evidence_url TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_geo_attendance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(160) NOT NULL,
  latitude NUMERIC(12,8),
  longitude NUMERIC(12,8),
  allowed_radius_meters INTEGER DEFAULT 1,
  mobile_attendance_enabled BOOLEAN DEFAULT true,
  web_attendance_enabled BOOLEAN DEFAULT true,
  biometric_required BOOLEAN DEFAULT false,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_hr_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  attendance_date DATE NOT NULL,
  source VARCHAR(80) NOT NULL,
  in_time TIMESTAMP,
  out_time TIMESTAMP,
  working_hours NUMERIC(8,2),
  overtime_hours NUMERIC(8,2),
  attendance_status VARCHAR(80) DEFAULT 'PRESENT',
  latitude NUMERIC(12,8),
  longitude NUMERIC(12,8),
  distance_from_hospital_meters NUMERIC(10,2),
  geo_validated BOOLEAN DEFAULT false,
  remarks TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_biometric_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  device_id VARCHAR(160) NOT NULL,
  vendor VARCHAR(120) NOT NULL,
  device_location VARCHAR(180),
  ip_address VARCHAR(80),
  sync_status VARCHAR(80) DEFAULT 'PENDING',
  last_sync_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, device_id)
);

CREATE TABLE IF NOT EXISTS clinical_hr_biometric_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  device_id UUID REFERENCES clinical_hr_biometric_devices(id),
  employee_id UUID REFERENCES clinical_hr_employees(id),
  punch_time TIMESTAMP NOT NULL,
  punch_type VARCHAR(40),
  raw_payload JSONB DEFAULT '{}'::jsonb,
  sync_status VARCHAR(80) DEFAULT 'RECEIVED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  shift_code VARCHAR(80) NOT NULL,
  shift_name VARCHAR(160) NOT NULL,
  shift_type VARCHAR(80) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  grace_minutes INTEGER DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, shift_code)
);

CREATE TABLE IF NOT EXISTS clinical_hr_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  ward VARCHAR(180),
  department VARCHAR(180),
  shift_id UUID REFERENCES clinical_hr_shifts(id),
  employee_id UUID REFERENCES clinical_hr_employees(id),
  roster_date DATE NOT NULL,
  roster_status VARCHAR(80) DEFAULT 'PLANNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  leave_code VARCHAR(80) NOT NULL,
  leave_name VARCHAR(160) NOT NULL,
  annual_quota NUMERIC(8,2),
  carry_forward BOOLEAN DEFAULT false,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, leave_code)
);

CREATE TABLE IF NOT EXISTS clinical_hr_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  leave_type_id UUID REFERENCES clinical_hr_leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  approval_status VARCHAR(80) DEFAULT 'PENDING',
  approved_by INTEGER,
  approved_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_salary_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  effective_from DATE NOT NULL,
  basic NUMERIC(14,2) DEFAULT 0,
  hra NUMERIC(14,2) DEFAULT 0,
  special_allowance NUMERIC(14,2) DEFAULT 0,
  medical_allowance NUMERIC(14,2) DEFAULT 0,
  travel_allowance NUMERIC(14,2) DEFAULT 0,
  performance_pay NUMERIC(14,2) DEFAULT 0,
  pf NUMERIC(14,2) DEFAULT 0,
  esi NUMERIC(14,2) DEFAULT 0,
  professional_tax NUMERIC(14,2) DEFAULT 0,
  tds NUMERIC(14,2) DEFAULT 0,
  loan_recovery NUMERIC(14,2) DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_payroll_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  payroll_month VARCHAR(20) NOT NULL,
  workflow_status VARCHAR(80) DEFAULT 'ATTENDANCE_CAPTURE',
  total_employees INTEGER DEFAULT 0,
  total_gross NUMERIC(14,2) DEFAULT 0,
  total_deductions NUMERIC(14,2) DEFAULT 0,
  total_net NUMERIC(14,2) DEFAULT 0,
  approved_by INTEGER,
  approved_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, payroll_month)
);

CREATE TABLE IF NOT EXISTS clinical_hr_payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  payroll_run_id UUID REFERENCES clinical_hr_payroll_runs(id),
  employee_id UUID REFERENCES clinical_hr_employees(id),
  attendance_days NUMERIC(8,2) DEFAULT 0,
  overtime_hours NUMERIC(8,2) DEFAULT 0,
  gross_salary NUMERIC(14,2) DEFAULT 0,
  deductions NUMERIC(14,2) DEFAULT 0,
  net_salary NUMERIC(14,2) DEFAULT 0,
  payslip_url TEXT,
  approval_status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_doctor_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  medical_council_number VARCHAR(180) NOT NULL,
  qualification TEXT NOT NULL,
  specialization VARCHAR(180),
  super_specialization VARCHAR(180),
  license_expiry_date DATE,
  experience_years NUMERIC(6,2),
  documents JSONB DEFAULT '[]'::jsonb,
  credential_status VARCHAR(80) DEFAULT 'PENDING_REVIEW',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, medical_council_number)
);

CREATE TABLE IF NOT EXISTS clinical_hr_doctor_privileges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  privilege_category VARCHAR(160) NOT NULL,
  procedure_name VARCHAR(220) NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  committee_review_status VARCHAR(80) DEFAULT 'PENDING',
  approval_status VARCHAR(80) DEFAULT 'PENDING',
  activated_at TIMESTAMP,
  expires_at DATE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  review_period VARCHAR(80) NOT NULL,
  kpi_category VARCHAR(160) NOT NULL,
  kpi_payload JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC(5,2),
  reviewer_id INTEGER,
  review_status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_lms_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  course_id VARCHAR(160) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  category VARCHAR(120) NOT NULL,
  duration_hours NUMERIC(8,2),
  instructor VARCHAR(180),
  mandatory BOOLEAN DEFAULT false,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, course_id)
);

CREATE TABLE IF NOT EXISTS clinical_hr_training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  course_id UUID REFERENCES clinical_hr_lms_courses(id),
  completion_date DATE,
  score NUMERIC(6,2),
  certificate_url TEXT,
  compliance_training BOOLEAN DEFAULT false,
  training_status VARCHAR(80) DEFAULT 'ASSIGNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_cme_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  program_name VARCHAR(255) NOT NULL,
  credit_hours NUMERIC(8,2) DEFAULT 0,
  completion_date DATE,
  credits_required NUMERIC(8,2),
  renewal_date DATE,
  certificate_url TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_id UUID REFERENCES clinical_hr_employees(id),
  license_type VARCHAR(120) NOT NULL,
  license_number VARCHAR(180) NOT NULL,
  issue_date DATE,
  expiry_date DATE NOT NULL,
  authority VARCHAR(220),
  alert_30_days BOOLEAN DEFAULT true,
  alert_60_days BOOLEAN DEFAULT true,
  alert_90_days BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, license_type, license_number)
);

CREATE TABLE IF NOT EXISTS clinical_hr_workforce_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  department VARCHAR(180) NOT NULL,
  role_group VARCHAR(160) NOT NULL,
  current_headcount INTEGER DEFAULT 0,
  required_headcount INTEGER DEFAULT 0,
  vacancy_count INTEGER DEFAULT 0,
  attrition_risk VARCHAR(80) DEFAULT 'LOW',
  skill_gap_summary TEXT,
  forecast_payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_hr_screens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  screen_key VARCHAR(220) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  route_path TEXT NOT NULL,
  screen_type VARCHAR(120) NOT NULL,
  permission_key VARCHAR(220),
  workflow_support JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, screen_key)
);

CREATE TABLE IF NOT EXISTS clinical_hr_api_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  api_key VARCHAR(260) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  method VARCHAR(12) NOT NULL,
  route_path TEXT NOT NULL,
  action_name VARCHAR(220) NOT NULL,
  permission_key VARCHAR(220),
  audit_event VARCHAR(220),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, api_key)
);

CREATE TABLE IF NOT EXISTS clinical_hr_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_key VARCHAR(260) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  report_category VARCHAR(160) NOT NULL,
  output_formats JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  evidence_source TEXT,
  schedule_supported BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_key)
);

CREATE TABLE IF NOT EXISTS clinical_hr_table_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  table_name VARCHAR(220) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  purpose TEXT NOT NULL,
  required_fields JSONB DEFAULT '[]'::jsonb,
  implementation_status VARCHAR(80) DEFAULT 'DEFINED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, table_name)
);

CREATE INDEX IF NOT EXISTS idx_clinical_hr_employees_scope ON clinical_hr_employees(tenant_id, hospital_id, branch_id, clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinical_hr_attendance_scope_date ON clinical_hr_attendance(tenant_id, hospital_id, branch_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_clinical_hr_rosters_scope_date ON clinical_hr_rosters(tenant_id, hospital_id, branch_id, roster_date);
CREATE INDEX IF NOT EXISTS idx_clinical_hr_leave_scope ON clinical_hr_leave_requests(tenant_id, hospital_id, branch_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_clinical_hr_payroll_scope ON clinical_hr_payroll(tenant_id, hospital_id, branch_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_clinical_hr_credentials_scope ON clinical_hr_doctor_credentials(tenant_id, hospital_id, branch_id, credential_status);
CREATE INDEX IF NOT EXISTS idx_clinical_hr_training_scope ON clinical_hr_training_records(tenant_id, hospital_id, branch_id, training_status);

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
    ('hrms_core', 'HRMS Command Center', '/clinical-services/hrms', 'HRMS', 'clinical.hrms.read', 1760),
    ('hr_employees', 'Employees', '/clinical-services/hrms/employees', 'HRMS', 'clinical.hr.employees.read', 1761),
    ('hr_recruitment', 'Recruitment', '/clinical-services/hrms/recruitment', 'HRMS', 'clinical.hr.recruitment.read', 1762),
    ('hr_attendance', 'Attendance + Geo Punch', '/clinical-services/hrms/attendance', 'HRMS', 'clinical.hr.attendance.read', 1763),
    ('hr_biometric', 'Biometric Devices', '/clinical-services/hrms/biometric', 'HRMS', 'clinical.hr.biometric.read', 1764),
    ('hr_roster', 'Roster', '/clinical-services/hrms/roster', 'HRMS', 'clinical.hr.roster.read', 1765),
    ('hr_leave', 'Leave Management', '/clinical-services/hrms/leave', 'HRMS', 'clinical.hr.leave.read', 1766),
    ('hr_payroll', 'Payroll', '/clinical-services/hrms/payroll', 'HRMS', 'clinical.hr.payroll.read', 1767),
    ('hr_credentialing', 'Doctor Credentialing', '/clinical-services/hrms/credentialing', 'HRMS', 'clinical.hr.credentialing.read', 1768),
    ('hr_privileges', 'Doctor Privileging', '/clinical-services/hrms/privileges', 'HRMS', 'clinical.hr.privileges.read', 1769),
    ('hr_lms', 'LMS + Training', '/clinical-services/hrms/lms', 'HRMS', 'clinical.hr.lms.read', 1770),
    ('hr_cme', 'CME + Licenses', '/clinical-services/hrms/cme', 'HRMS', 'clinical.hr.cme.read', 1771),
    ('hr_analytics', 'HR Analytics', '/clinical-services/hrms/analytics', 'HRMS', 'clinical.hr.analytics.read', 1772),
    ('hr_ai', 'AI HR Assistant', '/clinical-services/hrms/ai', 'HRMS', 'clinical.hr.ai.read', 1773)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  is_enabled, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.clinic_id, scope.hospital_id, scope.branch_id, items.menu_key, items.label, items.path, items.module_name, items.permission_key, items.sort_order,
  true, scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET label = EXCLUDED.label, path = EXCLUDED.path, module_name = EXCLUDED.module_name, permission_key = EXCLUDED.permission_key, sort_order = EXCLUDED.sort_order, is_enabled = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false)=false ORDER BY cup.id ASC LIMIT 1
),
modules(module_key, module_name) AS (
  VALUES
    ('employees','Employee Master'),
    ('recruitment','Recruitment'),
    ('onboarding','Onboarding'),
    ('attendance','Attendance'),
    ('biometric','Biometric Integration'),
    ('roster','Shift + Roster'),
    ('leave','Leave Management'),
    ('payroll','Payroll'),
    ('credentialing','Doctor Credentialing'),
    ('privileges','Doctor Privileging'),
    ('performance','Performance Management'),
    ('lms','Learning Management'),
    ('training','Compliance Training'),
    ('cme','CME Management'),
    ('licenses','License Management'),
    ('ess','Employee Self Service'),
    ('mss','Manager Self Service'),
    ('workforce','Workforce Planning'),
    ('analytics','HR Analytics'),
    ('ai','AI HR Assistant')
),
screen_types(screen_type, suffix) AS (
  VALUES
    ('Dashboard','dashboard'),
    ('List','list'),
    ('Create','create'),
    ('Detail','detail'),
    ('Edit','edit'),
    ('Approval','approval'),
    ('Reports','reports'),
    ('Mobile','mobile')
)
INSERT INTO clinical_hr_screens (
  tenant_id, hospital_id, branch_id, clinic_id, screen_key, module_key, screen_name, route_path,
  screen_type, permission_key, workflow_support, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  CONCAT('hr_', modules.module_key, '_', screen_types.suffix),
  modules.module_key,
  CONCAT(modules.module_name, ' ', screen_types.screen_type),
  CONCAT('/clinical-services/hrms/', modules.module_key, '/', screen_types.suffix),
  screen_types.screen_type,
  CONCAT('clinical.hr.', modules.module_key, '.', lower(screen_types.suffix)),
  jsonb_build_array('Create','Read','Update','Delete','Approve','Audit','Export','Mobile'),
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN modules CROSS JOIN screen_types
ON CONFLICT (tenant_id, hospital_id, branch_id, screen_key)
DO UPDATE SET screen_name=EXCLUDED.screen_name, route_path=EXCLUDED.route_path, permission_key=EXCLUDED.permission_key, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false)=false ORDER BY cup.id ASC LIMIT 1
),
modules(module_key) AS (
  VALUES ('employees'),('recruitment'),('onboarding'),('attendance'),('biometric'),('roster'),('leave'),('payroll'),('credentialing'),('privileges'),('performance'),('lms'),('training'),('cme'),('licenses'),('ess'),('mss'),('workforce'),('analytics'),('ai')
),
actions(action_name, method_name, suffix) AS (
  VALUES
    ('List','GET',''),
    ('Create','POST',''),
    ('Detail','GET','/{id}'),
    ('Update','PUT','/{id}'),
    ('Delete','DELETE','/{id}'),
    ('Approve','POST','/{id}/approve'),
    ('Reject','POST','/{id}/reject'),
    ('Export','GET','/export'),
    ('Print','GET','/{id}/print'),
    ('Audit','GET','/{id}/audit'),
    ('Bulk Create','POST','/bulk'),
    ('Workflow','POST','/{id}/workflow'),
    ('Mobile Sync','POST','/mobile-sync'),
    ('Analytics','GET','/analytics'),
    ('AI Assist','POST','/ai-assist')
)
INSERT INTO clinical_hr_api_catalog (
  tenant_id, hospital_id, branch_id, clinic_id, api_key, module_key, method, route_path,
  action_name, permission_key, audit_event, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  CONCAT('hr_', modules.module_key, '_', lower(replace(actions.action_name, ' ', '_'))),
  modules.module_key,
  actions.method_name,
  CONCAT('/api/clinical/hr/', modules.module_key, actions.suffix),
  actions.action_name,
  CONCAT('clinical.hr.', modules.module_key, '.', lower(replace(actions.action_name, ' ', '_'))),
  CONCAT('CLINICAL_HR_', upper(modules.module_key), '_', upper(replace(actions.action_name, ' ', '_'))),
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN modules CROSS JOIN actions
ON CONFLICT (tenant_id, hospital_id, branch_id, api_key)
DO UPDATE SET method=EXCLUDED.method, route_path=EXCLUDED.route_path, permission_key=EXCLUDED.permission_key, audit_event=EXCLUDED.audit_event, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false)=false ORDER BY cup.id ASC LIMIT 1
),
modules(module_key, category) AS (
  VALUES
    ('employees','Employee Master'),('attendance','Attendance'),('leave','Leave'),('payroll','Payroll'),('recruitment','Recruitment'),
    ('training','Training'),('credentialing','Credentialing'),('licenses','Credentialing'),('roster','Roster'),('workforce','Analytics')
),
series AS (
  SELECT generate_series(1,25) AS n
)
INSERT INTO clinical_hr_reports (
  tenant_id, hospital_id, branch_id, clinic_id, report_key, report_name, report_category,
  output_formats, evidence_source, schedule_supported, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  CONCAT('hr_', modules.module_key, '_report_', lpad(series.n::text, 3, '0')),
  CONCAT(modules.category, ' Report ', series.n),
  modules.category,
  '["PDF","Excel","CSV"]'::jsonb,
  CONCAT('clinical_hr_', modules.module_key, ' workflow evidence and audit logs'),
  true,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN modules CROSS JOIN series
ON CONFLICT (tenant_id, hospital_id, branch_id, report_key)
DO UPDATE SET report_name=EXCLUDED.report_name, report_category=EXCLUDED.report_category, evidence_source=EXCLUDED.evidence_source, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false)=false ORDER BY cup.id ASC LIMIT 1
),
modules(module_key) AS (
  VALUES ('employees'),('documents'),('recruitment'),('candidates'),('onboarding'),('attendance'),('biometric'),('shifts'),('rosters'),('leave'),('payroll'),('salary'),('credentialing'),('privileges'),('performance'),('lms'),('training'),('cme'),('licenses'),('workforce')
),
series AS (
  SELECT generate_series(1,6) AS n
)
INSERT INTO clinical_hr_table_blueprints (
  tenant_id, hospital_id, branch_id, clinic_id, table_name, module_key, purpose,
  required_fields, implementation_status, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  CONCAT('clinical_hr_', modules.module_key, '_extension_', lpad(series.n::text, 2, '0')),
  modules.module_key,
  CONCAT('Phase 17 workforce extension blueprint for ', modules.module_key, ' capability ', series.n),
  '["tenant_id","hospital_id","branch_id","clinic_id","created_by","created_at","updated_at","is_deleted"]'::jsonb,
  CASE WHEN series.n <= 1 THEN 'IMPLEMENTED' ELSE 'DEFINED' END,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN modules CROSS JOIN series
ON CONFLICT (tenant_id, hospital_id, branch_id, table_name)
DO UPDATE SET purpose=EXCLUDED.purpose, required_fields=EXCLUDED.required_fields, implementation_status=EXCLUDED.implementation_status, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false)=false ORDER BY cup.id ASC LIMIT 1
)
INSERT INTO clinical_hr_geo_attendance_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, latitude, longitude, allowed_radius_meters,
  mobile_attendance_enabled, web_attendance_enabled, biometric_required, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, 'default_hospital_one_meter_geo_policy', NULL, NULL, 1,
  true, true, false, scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET allowed_radius_meters=1, mobile_attendance_enabled=true, updated_at=CURRENT_TIMESTAMP, is_deleted=false;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false)=false ORDER BY cup.id ASC LIMIT 1
),
shifts(shift_code, shift_name, shift_type, start_time, end_time, grace_minutes) AS (
  VALUES
    ('GEN', 'General Shift', 'GENERAL', '09:00'::time, '18:00'::time, 10),
    ('MOR', 'Morning Shift', 'MORNING', '06:00'::time, '14:00'::time, 10),
    ('EVE', 'Evening Shift', 'EVENING', '14:00'::time, '22:00'::time, 10),
    ('NGT', 'Night Shift', 'NIGHT', '22:00'::time, '06:00'::time, 15),
    ('ROT', 'Rotational Shift', 'ROTATIONAL', '08:00'::time, '20:00'::time, 15)
)
INSERT INTO clinical_hr_shifts (
  tenant_id, hospital_id, branch_id, clinic_id, shift_code, shift_name, shift_type,
  start_time, end_time, grace_minutes, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, shifts.shift_code, shifts.shift_name, shifts.shift_type,
  shifts.start_time, shifts.end_time, shifts.grace_minutes, scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN shifts
ON CONFLICT (tenant_id, hospital_id, branch_id, shift_code)
DO UPDATE SET shift_name=EXCLUDED.shift_name, shift_type=EXCLUDED.shift_type, start_time=EXCLUDED.start_time, end_time=EXCLUDED.end_time, grace_minutes=EXCLUDED.grace_minutes, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false)=false ORDER BY cup.id ASC LIMIT 1
),
leave_types(leave_code, leave_name, annual_quota, carry_forward) AS (
  VALUES
    ('CL','Casual Leave',12,false),
    ('SL','Sick Leave',12,false),
    ('EL','Earned Leave',18,true),
    ('ML','Maternity Leave',180,false),
    ('PL','Paternity Leave',15,false),
    ('CO','Compensatory Off',10,true)
)
INSERT INTO clinical_hr_leave_types (
  tenant_id, hospital_id, branch_id, clinic_id, leave_code, leave_name, annual_quota, carry_forward,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, leave_types.leave_code, leave_types.leave_name, leave_types.annual_quota, leave_types.carry_forward,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN leave_types
ON CONFLICT (tenant_id, hospital_id, branch_id, leave_code)
DO UPDATE SET leave_name=EXCLUDED.leave_name, annual_quota=EXCLUDED.annual_quota, carry_forward=EXCLUDED.carry_forward, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false)=false ORDER BY cup.id ASC LIMIT 1
),
courses(course_id, course_name, category, duration_hours, instructor, mandatory) AS (
  VALUES
    ('HIPAA-FOUNDATION','HIPAA Foundation', 'Compliance', 3, 'Compliance Officer', true),
    ('GDPR-FOUNDATION','GDPR Foundation', 'Compliance', 3, 'Data Protection Officer', true),
    ('NABH-SAFETY','NABH Patient Safety', 'Safety', 4, 'Quality Head', true),
    ('INFECTION-CONTROL','Infection Control', 'Clinical', 4, 'Infection Control Nurse', true),
    ('FIRE-SAFETY','Fire Safety', 'Safety', 2, 'Safety Officer', true),
    ('IVF-LAB-SAFETY','IVF Lab Safety', 'IVF', 5, 'Embryology Lead', true),
    ('TECH-ERP','TOTTECH Clinical Services User Training', 'Technology', 2, 'Implementation Team', false)
)
INSERT INTO clinical_hr_lms_courses (
  tenant_id, hospital_id, branch_id, clinic_id, course_id, course_name, category, duration_hours, instructor, mandatory,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, courses.course_id, courses.course_name, courses.category, courses.duration_hours, courses.instructor, courses.mandatory,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN courses
ON CONFLICT (tenant_id, hospital_id, branch_id, course_id)
DO UPDATE SET course_name=EXCLUDED.course_name, category=EXCLUDED.category, duration_hours=EXCLUDED.duration_hours, instructor=EXCLUDED.instructor, mandatory=EXCLUDED.mandatory, is_deleted=false, updated_at=CURRENT_TIMESTAMP;
