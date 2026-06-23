CREATE TABLE IF NOT EXISTS module_master (
  id SERIAL PRIMARY KEY,
  module_key VARCHAR(100) NOT NULL UNIQUE,
  module_name VARCHAR(255) NOT NULL,
  category VARCHAR(80),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_module_access (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  school_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  created_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_user_module_access_scope'
  ) THEN
    ALTER TABLE user_module_access
      ADD CONSTRAINT uq_user_module_access_scope UNIQUE (user_id, school_id, module_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_module_access_user_school
  ON user_module_access (user_id, school_id, is_active);

CREATE INDEX IF NOT EXISTS idx_user_module_access_school_module
  ON user_module_access (school_id, module_id, is_active);

ALTER TABLE user_module_access
  ADD CONSTRAINT fk_user_module_access_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_module_access
  ADD CONSTRAINT fk_user_module_access_school
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE user_module_access
  ADD CONSTRAINT fk_user_module_access_module
  FOREIGN KEY (module_id) REFERENCES module_master(id) ON DELETE CASCADE;

INSERT INTO module_master (module_key, module_name, category, sort_order, is_active)
VALUES
  ('STUDENTS', 'Students', 'Academics', 1, TRUE),
  ('TEACHERS', 'Teachers', 'Academics', 2, TRUE),
  ('ACADEMICS', 'Academics', 'Academics', 3, TRUE),
  ('ATTENDANCE', 'Attendance', 'Operations', 4, TRUE),
  ('HOMEWORK', 'Homework', 'Academics', 5, TRUE),
  ('QUESTION_BANK', 'Question Bank', 'Academics', 6, TRUE),
  ('QUESTION_PAPERS', 'Question Papers', 'Academics', 7, TRUE),
  ('EXAMS', 'Exams', 'Academics', 8, TRUE),
  ('MARKS_ENTRY', 'Marks Entry', 'Academics', 9, TRUE),
  ('STUDENT_360', 'Student 360', 'Insights', 10, TRUE),
  ('TEACHER_360', 'Teacher 360', 'Insights', 11, TRUE),
  ('SCHOOL_360', 'School 360', 'Insights', 12, TRUE),
  ('FINANCE', 'Finance', 'Finance', 13, TRUE),
  ('CONCESSIONS', 'Concessions', 'Finance', 14, TRUE),
  ('INVOICES', 'Invoices', 'Finance', 15, TRUE),
  ('PAYMENTS', 'Payments', 'Finance', 16, TRUE),
  ('DINING', 'Dining', 'Operations', 17, TRUE),
  ('TRANSPORT', 'Transport', 'Operations', 18, TRUE),
  ('HOSTEL', 'Hostel', 'Operations', 19, TRUE),
  ('OPERATIONS', 'Operations', 'Operations', 20, TRUE),
  ('REPORTS', 'Reports', 'Governance', 21, TRUE),
  ('ANALYTICS', 'Analytics', 'Governance', 22, TRUE),
  ('GOVERNANCE', 'Governance', 'Governance', 23, TRUE),
  ('WAR_ROOM', 'War Room', 'Governance', 24, TRUE),
  ('TOTTECH_AI', 'TOTTECH AI', 'AI', 25, TRUE),
  ('SCHOOLGPT', 'SchoolGPT', 'AI', 26, TRUE),
  ('SETTINGS', 'Settings', 'Administration', 27, TRUE),
  ('USER_MANAGEMENT', 'User Management', 'Administration', 28, TRUE),
  ('PARENT_PORTAL', 'Parent Portal', 'Parent', 29, TRUE),
  ('MOBILE_APP', 'Mobile App', 'Platform', 30, TRUE)
ON CONFLICT (module_key) DO UPDATE SET
  module_name = EXCLUDED.module_name,
  category = EXCLUDED.category,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = CURRENT_TIMESTAMP;
