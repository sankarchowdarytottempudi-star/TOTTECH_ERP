-- TOTTECH ONE post-UAT enterprise gap closure.
-- Idempotent by design: production already contains several governance tables.

CREATE TABLE IF NOT EXISTS school_expenses (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL,
  academic_year_id INTEGER,
  category VARCHAR(80) NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor_name VARCHAR(255),
  description TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(60),
  reference_number VARCHAR(255),
  status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
  approved_by INTEGER,
  approved_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_school_expenses_scope
  ON school_expenses(school_id, academic_year_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_school_expenses_status
  ON school_expenses(school_id, status, category);

CREATE TABLE IF NOT EXISTS parent_attendance_declarations (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL,
  academic_year_id INTEGER,
  student_id INTEGER NOT NULL,
  declaration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  declaration_status VARCHAR(40) NOT NULL,
  reason TEXT,
  declared_by INTEGER,
  declared_by_name VARCHAR(255),
  declared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_parent_attendance_declaration
    UNIQUE(school_id, student_id, declaration_date)
);

CREATE INDEX IF NOT EXISTS idx_parent_attendance_scope
  ON parent_attendance_declarations(school_id, academic_year_id, declaration_date);

CREATE TABLE IF NOT EXISTS ptm_meetings (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL,
  academic_year_id INTEGER,
  student_id INTEGER,
  teacher_id INTEGER,
  class_id INTEGER,
  section_id INTEGER,
  meeting_title VARCHAR(255) NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_time TIME,
  mode VARCHAR(40) DEFAULT 'IN_PERSON',
  parent_confirmation VARCHAR(40) DEFAULT 'PENDING',
  status VARCHAR(40) DEFAULT 'SCHEDULED',
  notes TEXT,
  action_items TEXT,
  follow_up_date DATE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ptm_meetings_scope
  ON ptm_meetings(school_id, academic_year_id, meeting_date);
CREATE INDEX IF NOT EXISTS idx_ptm_meetings_student
  ON ptm_meetings(student_id, status);

CREATE TABLE IF NOT EXISTS school_feedback (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL,
  academic_year_id INTEGER,
  feedback_type VARCHAR(40) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(40) NOT NULL DEFAULT 'OPEN',
  priority VARCHAR(40) DEFAULT 'NORMAL',
  assigned_to INTEGER,
  student_id INTEGER,
  parent_name VARCHAR(255),
  contact_phone VARCHAR(50),
  resolution_notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  closed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_school_feedback_scope
  ON school_feedback(school_id, academic_year_id, status, feedback_type);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_invoices_due_date_not_past'
  ) THEN
    ALTER TABLE invoices
      ADD CONSTRAINT chk_invoices_due_date_not_past
      CHECK (due_date IS NULL OR due_date >= invoice_date OR invoice_date IS NULL)
      NOT VALID;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_filters
  ON teacher_class_assignments(school_id, academic_year_id, class_id, section_id, subject_id, status);

DROP INDEX IF EXISTS uq_teacher_class_assignment_active;
CREATE UNIQUE INDEX IF NOT EXISTS uq_teacher_class_assignment_active
  ON teacher_class_assignments(
    teacher_id,
    academic_year_id,
    class_id,
    COALESCE(section_id, 0),
    COALESCE(subject_id, 0),
    assignment_type
  )
  WHERE status = 'ACTIVE';
