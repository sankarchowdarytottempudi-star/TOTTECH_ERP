CREATE TABLE IF NOT EXISTS hr_staff_master (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  employee_id VARCHAR(120) NOT NULL UNIQUE,
  employee_number VARCHAR(120),
  first_name VARCHAR(120),
  last_name VARCHAR(120),
  department VARCHAR(255),
  designation VARCHAR(255),
  qualification VARCHAR(255),
  experience_years NUMERIC(6,2),
  experience_gap VARCHAR(255),
  previous_school VARCHAR(255),
  mobile VARCHAR(20),
  alternate_mobile VARCHAR(20),
  whatsapp_number VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  current_address JSONB DEFAULT '{}'::jsonb,
  permanent_address JSONB DEFAULT '{}'::jsonb,
  bank_details JSONB DEFAULT '{}'::jsonb,
  pan VARCHAR(30),
  aadhaar VARCHAR(30),
  salary_structure_id INT,
  documents JSONB DEFAULT '{}'::jsonb,
  notes JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  updated_by INT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_staff_school_year ON hr_staff_master(school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_hr_staff_department_designation ON hr_staff_master(department, designation);
CREATE INDEX IF NOT EXISTS idx_hr_staff_mobile ON hr_staff_master(mobile);

CREATE TABLE IF NOT EXISTS hr_leave_categories (
  id SERIAL PRIMARY KEY,
  school_id INT,
  category_name VARCHAR(120) NOT NULL,
  category_code VARCHAR(50),
  leaves_per_year NUMERIC(6,2),
  carry_forward_allowed BOOLEAN DEFAULT FALSE,
  max_consecutive_days INT DEFAULT 3,
  requires_approval BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  updated_by INT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_hr_leave_categories_name ON hr_leave_categories(school_id, category_name);

CREATE TABLE IF NOT EXISTS hr_leave_allocations (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  staff_id INT,
  leave_category_id INT,
  department VARCHAR(255),
  designation VARCHAR(255),
  allocated_days NUMERIC(6,2),
  carry_forward BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  updated_by INT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_hr_leave_allocation_scope
  ON hr_leave_allocations(school_id, academic_year_id, staff_id, leave_category_id);

CREATE TABLE IF NOT EXISTS hr_leave_requests (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  staff_id INT,
  leave_category_id INT,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  days_requested NUMERIC(6,2),
  reason TEXT,
  attachment JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(40) DEFAULT 'PENDING',
  approved_by INT,
  approved_at TIMESTAMP(6),
  rejection_reason TEXT,
  created_by INT,
  updated_by INT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_leave_requests_scope ON hr_leave_requests(school_id, academic_year_id, status);

CREATE TABLE IF NOT EXISTS hr_lop_entries (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  staff_id INT,
  attendance_date DATE,
  days_lost NUMERIC(6,2),
  amount NUMERIC(12,2),
  reason VARCHAR(255),
  source VARCHAR(80),
  status VARCHAR(40) DEFAULT 'GENERATED',
  created_by INT,
  updated_by INT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_lop_entries_scope ON hr_lop_entries(school_id, academic_year_id, staff_id);

CREATE TABLE IF NOT EXISTS hr_salary_structures (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  structure_name VARCHAR(255) NOT NULL,
  basic NUMERIC(12,2),
  hra NUMERIC(12,2),
  da NUMERIC(12,2),
  special_allowance NUMERIC(12,2),
  transport_allowance NUMERIC(12,2),
  medical_allowance NUMERIC(12,2),
  other_allowances NUMERIC(12,2),
  pf NUMERIC(12,2),
  esi NUMERIC(12,2),
  professional_tax NUMERIC(12,2),
  income_tax NUMERIC(12,2),
  other_deductions NUMERIC(12,2),
  gross_salary NUMERIC(12,2),
  net_salary NUMERIC(12,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  updated_by INT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_salary_structures_scope ON hr_salary_structures(school_id, academic_year_id, is_active);

CREATE TABLE IF NOT EXISTS hr_salary_assignments (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  staff_id INT,
  salary_structure_id INT,
  effective_from DATE,
  effective_to DATE,
  current_salary NUMERIC(12,2),
  status VARCHAR(40) DEFAULT 'ACTIVE',
  created_by INT,
  updated_by INT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_salary_assignments_scope ON hr_salary_assignments(school_id, academic_year_id, staff_id);

CREATE TABLE IF NOT EXISTS hr_salary_history (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  staff_id INT,
  salary_structure_id INT,
  old_salary NUMERIC(12,2),
  new_salary NUMERIC(12,2),
  change_reason TEXT,
  revised_by INT,
  revised_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_salary_history_scope ON hr_salary_history(school_id, academic_year_id, staff_id);

CREATE TABLE IF NOT EXISTS hr_increment_requests (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  staff_id INT,
  current_salary NUMERIC(12,2),
  requested_salary NUMERIC(12,2),
  requested_percentage NUMERIC(12,2),
  requested_amount NUMERIC(12,2),
  owner_adjustment_percentage NUMERIC(12,2),
  owner_adjustment_amount NUMERIC(12,2),
  final_salary NUMERIC(12,2),
  reason TEXT,
  status VARCHAR(40) DEFAULT 'PENDING',
  requested_by INT,
  approved_by INT,
  approved_at TIMESTAMP(6),
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_increment_requests_scope ON hr_increment_requests(school_id, academic_year_id, status);

CREATE TABLE IF NOT EXISTS hr_payroll_runs (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  payroll_month INT,
  payroll_year INT,
  total_staff INT DEFAULT 0,
  total_gross NUMERIC(12,2),
  total_deductions NUMERIC(12,2),
  total_net NUMERIC(12,2),
  status VARCHAR(40) DEFAULT 'DRAFT',
  generated_by INT,
  approved_by INT,
  approved_at TIMESTAMP(6),
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_payroll_runs_scope ON hr_payroll_runs(school_id, academic_year_id, payroll_year, payroll_month);

CREATE TABLE IF NOT EXISTS hr_pay_slips (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  payroll_run_id INT,
  staff_id INT,
  payroll_month INT,
  payroll_year INT,
  gross_salary NUMERIC(12,2),
  total_deductions NUMERIC(12,2),
  net_salary NUMERIC(12,2),
  pdf_url TEXT,
  status VARCHAR(40) DEFAULT 'GENERATED',
  created_by INT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_payslips_scope ON hr_pay_slips(school_id, academic_year_id, payroll_year, payroll_month);

CREATE TABLE IF NOT EXISTS hr_approval_center (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  module_key VARCHAR(80) NOT NULL,
  record_id INT,
  record_label VARCHAR(255),
  requested_by INT,
  approved_by INT,
  status VARCHAR(40) DEFAULT 'PENDING',
  remarks TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_approval_center_scope ON hr_approval_center(school_id, academic_year_id, module_key, status);

CREATE TABLE IF NOT EXISTS hr_event_ledger (
  id SERIAL PRIMARY KEY,
  school_id INT,
  academic_year_id INT,
  module_key VARCHAR(80),
  entity_type VARCHAR(100),
  entity_id INT,
  action_type VARCHAR(100),
  action_by INT,
  before_state JSONB DEFAULT '{}'::jsonb,
  after_state JSONB DEFAULT '{}'::jsonb,
  remarks TEXT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_event_ledger_scope ON hr_event_ledger(school_id, academic_year_id, module_key, created_at);
