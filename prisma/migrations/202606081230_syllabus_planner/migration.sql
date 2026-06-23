CREATE TABLE IF NOT EXISTS syllabus_units (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  class_id INTEGER,
  section_id INTEGER,
  subject_id INTEGER,
  exam_type_id INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_periods INTEGER DEFAULT 0,
  target_completion_percent NUMERIC(5,2) DEFAULT 100,
  start_date DATE,
  target_date DATE,
  status VARCHAR(50) DEFAULT 'PLANNED',
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_syllabus_units_scope
  ON syllabus_units(school_id, academic_year_id, class_id, section_id, subject_id, exam_type_id);

CREATE TABLE IF NOT EXISTS syllabus_staff_assignments (
  id SERIAL PRIMARY KEY,
  syllabus_unit_id INTEGER REFERENCES syllabus_units(id) ON DELETE CASCADE,
  teacher_id INTEGER,
  assigned_by INTEGER,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expected_completion_percent NUMERIC(5,2) DEFAULT 100,
  actual_completion_percent NUMERIC(5,2) DEFAULT 0,
  completed_periods INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'ASSIGNED',
  remarks TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_syllabus_staff_assignments_unit
  ON syllabus_staff_assignments(syllabus_unit_id, teacher_id);
