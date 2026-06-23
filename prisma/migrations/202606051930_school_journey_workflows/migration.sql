-- School journey workflow foundation:
-- school -> class -> section -> student/teacher context across operations.

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS current_class_id INTEGER,
  ADD COLUMN IF NOT EXISTS current_section_id INTEGER,
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER;

ALTER TABLE teachers
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER;

ALTER TABLE fee_categories
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS class_id INTEGER,
  ADD COLUMN IF NOT EXISTS section_id INTEGER,
  ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(50),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS school_id INTEGER,
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS class_id INTEGER,
  ADD COLUMN IF NOT EXISTS section_id INTEGER,
  ADD COLUMN IF NOT EXISTS billing_scope VARCHAR(50),
  ADD COLUMN IF NOT EXISTS billing_period VARCHAR(50),
  ADD COLUMN IF NOT EXISTS installment_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS source VARCHAR(100),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE invoices i
SET school_id = s.school_id
FROM students s
WHERE i.student_id = s.id
  AND i.school_id IS NULL;

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS school_id INTEGER,
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS class_id INTEGER,
  ADD COLUMN IF NOT EXISTS section_id INTEGER,
  ADD COLUMN IF NOT EXISTS received_by INTEGER,
  ADD COLUMN IF NOT EXISTS receipt_number VARCHAR(100),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

ALTER TABLE transport_assignments
  ADD COLUMN IF NOT EXISTS school_id INTEGER,
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS teacher_id INTEGER,
  ADD COLUMN IF NOT EXISTS staff_id INTEGER,
  ADD COLUMN IF NOT EXISTS assigned_to_type VARCHAR(50) DEFAULT 'STUDENT',
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS created_by INTEGER,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE transport_assignments ta
SET school_id = s.school_id
FROM students s
WHERE ta.student_id = s.id
  AND ta.school_id IS NULL;

ALTER TABLE dining_attendance
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS class_id INTEGER,
  ADD COLUMN IF NOT EXISTS section_id INTEGER,
  ADD COLUMN IF NOT EXISTS teacher_id INTEGER,
  ADD COLUMN IF NOT EXISTS staff_id INTEGER,
  ADD COLUMN IF NOT EXISTS recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS teacher_class_assignments (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  teacher_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  section_id INTEGER,
  subject_id INTEGER,
  assignment_type VARCHAR(50) DEFAULT 'CLASS_TEACHER',
  status VARCHAR(50) DEFAULT 'ACTIVE',
  assigned_by INTEGER,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_teacher_class_assignment_active
  ON teacher_class_assignments (
    teacher_id,
    academic_year_id,
    class_id,
    COALESCE(section_id, 0),
    assignment_type
  )
  WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_scope
  ON teacher_class_assignments (school_id, academic_year_id, class_id, section_id);

CREATE TABLE IF NOT EXISTS invoice_line_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL,
  fee_category_id INTEGER,
  fee_name VARCHAR(255),
  amount NUMERIC(12, 2) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice
  ON invoice_line_items (invoice_id);

CREATE TABLE IF NOT EXISTS invoice_installments (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL,
  part_number INTEGER NOT NULL,
  part_label VARCHAR(100),
  due_date DATE,
  amount NUMERIC(12, 2) DEFAULT 0,
  paid_amount NUMERIC(12, 2) DEFAULT 0,
  balance_amount NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'PENDING',
  paid_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_invoice_installment_part
  ON invoice_installments (invoice_id, part_number);

CREATE INDEX IF NOT EXISTS idx_invoice_installments_status
  ON invoice_installments (invoice_id, status, due_date);
