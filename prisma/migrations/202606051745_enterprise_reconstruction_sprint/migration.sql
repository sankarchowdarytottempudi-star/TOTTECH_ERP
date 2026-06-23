DO $$
DECLARE
  v_table_name text;
BEGIN
  FOREACH v_table_name IN ARRAY ARRAY[
    'students',
    'teachers',
    'attendance',
    'attendance_master',
    'teacher_attendance',
    'fees',
    'fee_payments',
    'invoices',
    'payments',
    'concession_requests',
    'exams',
    'exam_schedule',
    'marks',
    'question_papers',
    'question_bank',
    'dining_attendance',
    'hostel_attendance',
    'transport_attendance',
    'hostel_allocations',
    'transport_assignments',
    'notifications',
    'ai_usage_logs'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = v_table_name
        AND column_name = 'academic_year_id'
    ) THEN
      EXECUTE format('ALTER TABLE %I ADD COLUMN academic_year_id INTEGER', v_table_name);
    END IF;
  END LOOP;
END $$;

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS current_class_id INTEGER,
  ADD COLUMN IF NOT EXISTS current_section_id INTEGER;

ALTER TABLE dining_attendance
  ADD COLUMN IF NOT EXISTS teacher_id INTEGER,
  ADD COLUMN IF NOT EXISTS staff_id INTEGER,
  ADD COLUMN IF NOT EXISTS recorded_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE student_promotions
  ADD COLUMN IF NOT EXISTS from_section_id INTEGER,
  ADD COLUMN IF NOT EXISTS to_section_id INTEGER,
  ADD COLUMN IF NOT EXISTS source_academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS target_academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS promotion_date DATE,
  ADD COLUMN IF NOT EXISTS promoted_by_user_id INTEGER,
  ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS approved_by INTEGER,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS metadata JSONB;

UPDATE student_promotions
SET promotion_date = COALESCE(promotion_date, promoted_on::date),
    approval_status = COALESCE(approval_status, 'PENDING');

UPDATE students s
SET academic_year_id = ay.id,
    current_section_id = COALESCE(s.current_section_id, s.section_id)
FROM academic_years ay
WHERE s.school_id = ay.school_id
  AND ay.is_current = true
  AND s.academic_year_id IS NULL;

UPDATE teachers t
SET academic_year_id = ay.id
FROM academic_years ay
WHERE t.school_id = ay.school_id
  AND ay.is_current = true
  AND t.academic_year_id IS NULL;

UPDATE attendance a
SET academic_year_id = ay.id
FROM academic_years ay
WHERE a.school_id = ay.school_id
  AND ay.is_current = true
  AND a.academic_year_id IS NULL;

UPDATE attendance_master a
SET academic_year_id = ay.id
FROM academic_years ay
WHERE a.school_id = ay.school_id
  AND ay.is_current = true
  AND a.academic_year_id IS NULL;

UPDATE teacher_attendance ta
SET academic_year_id = ay.id
FROM teachers t
JOIN academic_years ay ON ay.school_id = t.school_id AND ay.is_current = true
WHERE ta.teacher_id = t.id
  AND ta.academic_year_id IS NULL;

UPDATE fees f
SET academic_year_id = ay.id
FROM academic_years ay
WHERE f.school_id = ay.school_id
  AND ay.is_current = true
  AND f.academic_year_id IS NULL;

UPDATE fee_payments fp
SET academic_year_id = ay.id
FROM academic_years ay
WHERE fp.school_id = ay.school_id
  AND ay.is_current = true
  AND fp.academic_year_id IS NULL;

UPDATE invoices i
SET academic_year_id = ay.id
FROM students s
JOIN academic_years ay ON ay.school_id = s.school_id AND ay.is_current = true
WHERE i.student_id = s.id
  AND i.academic_year_id IS NULL;

UPDATE payments p
SET academic_year_id = ay.id
FROM students s
JOIN academic_years ay ON ay.school_id = s.school_id AND ay.is_current = true
WHERE p.student_id = s.id
  AND p.academic_year_id IS NULL;

UPDATE concession_requests c
SET academic_year_id = ay.id
FROM academic_years ay
WHERE c.school_id = ay.school_id
  AND ay.is_current = true
  AND c.academic_year_id IS NULL;

UPDATE exams e
SET academic_year_id = ay.id
FROM academic_years ay
WHERE e.school_id = ay.school_id
  AND ay.is_current = true
  AND e.academic_year_id IS NULL;

UPDATE exam_schedule es
SET academic_year_id = ay.id
FROM classes c
JOIN academic_years ay ON ay.school_id = c.school_id AND ay.is_current = true
WHERE es.class_id = c.id
  AND es.academic_year_id IS NULL;

UPDATE marks m
SET academic_year_id = ay.id
FROM academic_years ay
WHERE m.school_id = ay.school_id
  AND ay.is_current = true
  AND m.academic_year_id IS NULL;

UPDATE question_papers qp
SET academic_year_id = ay.id
FROM classes c
JOIN academic_years ay ON ay.school_id = c.school_id AND ay.is_current = true
WHERE qp.class_id = c.id
  AND qp.academic_year_id IS NULL;

UPDATE dining_attendance da
SET academic_year_id = ay.id,
    recorded_at = COALESCE(da.recorded_at, da.created_at, CURRENT_TIMESTAMP)
FROM academic_years ay
WHERE da.school_id = ay.school_id
  AND ay.is_current = true
  AND da.academic_year_id IS NULL;

UPDATE hostel_attendance ha
SET academic_year_id = ay.id
FROM academic_years ay
WHERE ha.school_id = ay.school_id
  AND ay.is_current = true
  AND ha.academic_year_id IS NULL;

UPDATE transport_attendance ta
SET academic_year_id = ay.id
FROM academic_years ay
WHERE ta.school_id = ay.school_id
  AND ay.is_current = true
  AND ta.academic_year_id IS NULL;

UPDATE hostel_allocations ha
SET academic_year_id = ay.id
FROM academic_years ay
WHERE ha.school_id = ay.school_id
  AND ay.is_current = true
  AND ha.academic_year_id IS NULL;

UPDATE transport_assignments ta
SET academic_year_id = ay.id
FROM students s
JOIN academic_years ay ON ay.school_id = s.school_id AND ay.is_current = true
WHERE ta.student_id = s.id
  AND ta.academic_year_id IS NULL;

UPDATE notifications n
SET academic_year_id = ay.id
FROM academic_years ay
WHERE n.school_id = ay.school_id
  AND ay.is_current = true
  AND n.academic_year_id IS NULL;

UPDATE ai_usage_logs a
SET academic_year_id = ay.id
FROM academic_years ay
WHERE a.school_id = ay.school_id
  AND ay.is_current = true
  AND a.academic_year_id IS NULL;

CREATE TABLE IF NOT EXISTS student_year_enrollments (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  student_id INTEGER NOT NULL,
  academic_year_id INTEGER NOT NULL,
  class_id INTEGER,
  section_id INTEGER,
  roll_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  source VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, academic_year_id)
);

INSERT INTO student_year_enrollments (
  school_id,
  student_id,
  academic_year_id,
  section_id,
  roll_number,
  status,
  source
)
SELECT
  s.school_id,
  s.id,
  s.academic_year_id,
  s.section_id,
  s.roll_number,
  CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'INACTIVE' END,
  'migration_backfill'
FROM students s
WHERE s.academic_year_id IS NOT NULL
ON CONFLICT (student_id, academic_year_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS promotion_workflows (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  source_academic_year_id INTEGER,
  target_academic_year_id INTEGER,
  from_class_id INTEGER,
  from_section_id INTEGER,
  to_class_id INTEGER,
  to_section_id INTEGER,
  promotion_mode VARCHAR(50) DEFAULT 'BULK',
  approval_status VARCHAR(50) DEFAULT 'PENDING',
  requested_by INTEGER,
  approved_by INTEGER,
  approved_at TIMESTAMP(6),
  executed_by INTEGER,
  executed_at TIMESTAMP(6),
  student_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotion_workflow_students (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  source_class_id INTEGER,
  source_section_id INTEGER,
  target_class_id INTEGER,
  target_section_id INTEGER,
  status VARCHAR(50) DEFAULT 'PENDING',
  error_message TEXT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workflow_id, student_id)
);

CREATE TABLE IF NOT EXISTS homework_assignments (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  class_id INTEGER,
  section_id INTEGER,
  subject_id INTEGER,
  teacher_id INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'PUBLISHED',
  created_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homework_submissions (
  id SERIAL PRIMARY KEY,
  homework_id INTEGER NOT NULL,
  school_id INTEGER,
  academic_year_id INTEGER,
  student_id INTEGER,
  submitted_at TIMESTAMP(6),
  status VARCHAR(50) DEFAULT 'PENDING',
  review_status VARCHAR(50) DEFAULT 'NOT_REVIEWED',
  reviewed_by INTEGER,
  reviewed_at TIMESTAMP(6),
  marks DECIMAL(8, 2),
  feedback TEXT,
  attachment_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timetable_entries (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  class_id INTEGER,
  section_id INTEGER,
  subject_id INTEGER,
  teacher_id INTEGER,
  day_of_week VARCHAR(20),
  start_time TIME,
  end_time TIME,
  room_no VARCHAR(50),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  metadata JSONB,
  created_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS finance_approval_ledger (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER,
  workflow_type VARCHAR(100) NOT NULL,
  requested_amount DECIMAL(12, 2),
  approved_amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'PENDING',
  requested_by INTEGER,
  approved_by INTEGER,
  approved_at TIMESTAMP(6),
  reason TEXT,
  metadata JSONB,
  event_id INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_audit_logs (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER,
  school_id INTEGER,
  academic_year_id INTEGER,
  actor_user_id INTEGER,
  action VARCHAR(100) NOT NULL,
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  amount DECIMAL(12, 2),
  comments TEXT,
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scholarships (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  student_id INTEGER,
  scholarship_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'PENDING',
  requested_by INTEGER,
  approved_by INTEGER,
  approved_at TIMESTAMP(6),
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refunds (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  student_id INTEGER,
  invoice_id INTEGER,
  payment_id INTEGER,
  refund_amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'PENDING',
  reason TEXT,
  requested_by INTEGER,
  approved_by INTEGER,
  approved_at TIMESTAMP(6),
  processed_at TIMESTAMP(6),
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_meal_plans (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  plan_name VARCHAR(255) NOT NULL,
  meal_type VARCHAR(50),
  price DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  metadata JSONB,
  created_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_meal_assignments (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  meal_plan_id INTEGER,
  student_id INTEGER,
  teacher_id INTEGER,
  staff_id INTEGER,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_weekly_menus (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  week_start DATE,
  day_of_week VARCHAR(20),
  meal_type VARCHAR(50),
  menu_items JSONB,
  nutrition_notes TEXT,
  created_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_special_diets (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  student_id INTEGER,
  teacher_id INTEGER,
  staff_id INTEGER,
  diet_type VARCHAR(100),
  notes TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_inventory_items (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  item_name VARCHAR(255) NOT NULL,
  unit VARCHAR(50),
  current_quantity DECIMAL(14, 3) DEFAULT 0,
  reorder_level DECIMAL(14, 3) DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_purchases (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  item_id INTEGER,
  purchase_date DATE,
  quantity DECIMAL(14, 3),
  unit_cost DECIMAL(12, 2),
  total_cost DECIMAL(12, 2),
  vendor_name VARCHAR(255),
  created_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_consumption_logs (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  item_id INTEGER,
  consumption_date DATE,
  quantity DECIMAL(14, 3),
  meal_type VARCHAR(50),
  recorded_by INTEGER,
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_production_sheets (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  production_date DATE,
  meal_type VARCHAR(50),
  expected_count INTEGER,
  produced_count INTEGER,
  served_count INTEGER,
  cost_amount DECIMAL(12, 2),
  metadata JSONB,
  created_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dining_wastage_logs (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  production_sheet_id INTEGER,
  wastage_date DATE,
  quantity DECIMAL(14, 3),
  cost_amount DECIMAL(12, 2),
  reason TEXT,
  recorded_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hostel_beds (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  hostel_id INTEGER,
  room_id INTEGER,
  bed_number VARCHAR(50),
  status VARCHAR(50) DEFAULT 'AVAILABLE',
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, bed_number)
);

CREATE TABLE IF NOT EXISTS hostel_movement_history (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  student_id INTEGER,
  hostel_id INTEGER,
  room_id INTEGER,
  bed_id INTEGER,
  movement_type VARCHAR(100),
  movement_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  recorded_by INTEGER,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hostel_warden_tracking (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  hostel_id INTEGER,
  warden_teacher_id INTEGER,
  warden_user_id INTEGER,
  duty_date DATE,
  shift VARCHAR(50),
  status VARCHAR(50) DEFAULT 'ASSIGNED',
  notes TEXT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transport_pickup_drop_history (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  student_id INTEGER,
  route_id INTEGER,
  vehicle_id INTEGER,
  trip_type VARCHAR(50),
  pickup_point VARCHAR(255),
  drop_point VARCHAR(255),
  event_time TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50),
  recorded_by INTEGER,
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_year_enrollments_student_year ON student_year_enrollments(student_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_promotion_workflows_school_status ON promotion_workflows(school_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_scope ON homework_assignments(school_id, academic_year_id, class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_homework_submissions_student ON homework_submissions(student_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_scope ON timetable_entries(school_id, academic_year_id, class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_finance_approval_ledger_scope ON finance_approval_ledger(school_id, academic_year_id, status);
CREATE INDEX IF NOT EXISTS idx_invoice_audit_logs_invoice ON invoice_audit_logs(invoice_id);
CREATE INDEX IF NOT EXISTS idx_dining_attendance_person_year ON dining_attendance(student_id, teacher_id, staff_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_dining_meal_assignments_person ON dining_meal_assignments(student_id, teacher_id, staff_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_hostel_movement_student_year ON hostel_movement_history(student_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_transport_pickup_drop_student_year ON transport_pickup_drop_history(student_id, academic_year_id);

INSERT INTO permissions (module_name, action_name)
SELECT module_name, action_name
FROM (
  VALUES
    ('PROMOTIONS', 'READ'),
    ('PROMOTIONS', 'CREATE'),
    ('PROMOTIONS', 'APPROVE'),
    ('FINANCE', 'APPROVE'),
    ('FINANCE', 'VIEW_APPROVALS'),
    ('DINING', 'MANAGE_OPERATIONS'),
    ('HOSTEL', 'MANAGE_OPERATIONS'),
    ('TRANSPORT', 'MANAGE_OPERATIONS'),
    ('ACADEMIC_YEAR', 'MANAGE'),
    ('TIMELINE', 'VIEW_HISTORY')
) AS p(module_name, action_name)
WHERE NOT EXISTS (
  SELECT 1
  FROM permissions existing
  WHERE existing.module_name = p.module_name
    AND existing.action_name = p.action_name
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
  (p.module_name = 'PROMOTIONS' AND p.action_name IN ('READ', 'CREATE', 'APPROVE')) OR
  (p.module_name = 'FINANCE' AND p.action_name IN ('APPROVE', 'VIEW_APPROVALS')) OR
  (p.module_name IN ('DINING', 'HOSTEL', 'TRANSPORT') AND p.action_name = 'MANAGE_OPERATIONS') OR
  (p.module_name = 'ACADEMIC_YEAR' AND p.action_name = 'MANAGE') OR
  (p.module_name = 'TIMELINE' AND p.action_name = 'VIEW_HISTORY')
)
WHERE r.role_name IN ('SUPER_ADMIN', 'ORGANIZATION_OWNER')
  AND NOT EXISTS (
    SELECT 1
    FROM role_permissions rp
    WHERE rp.role_id = r.id
      AND rp.permission_id = p.id
  );

INSERT INTO event_ledger (
  school_id,
  user_id,
  actor_role,
  module_name,
  event_type,
  action,
  entity_type,
  summary,
  payload
)
VALUES (
  NULL,
  NULL,
  'SYSTEM',
  'platform',
  'ENTERPRISE_RECONSTRUCTION_MIGRATED',
  'migrate',
  'enterprise_architecture',
  'Enterprise academic-year, promotion, finance, dining, hostel, and transport foundations deployed',
  '{"academicYear":"1 June to 31 May","safety":"additive migration","approval":"finance and promotion approval permissions seeded"}'::jsonb
);
