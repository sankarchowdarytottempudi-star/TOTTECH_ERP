ALTER TABLE students
  ADD COLUMN IF NOT EXISTS father_alternative_mobile VARCHAR(20),
  ADD COLUMN IF NOT EXISTS mother_alternative_mobile VARCHAR(20),
  ADD COLUMN IF NOT EXISTS guardian_alternative_mobile VARCHAR(20),
  ADD COLUMN IF NOT EXISTS emergency_contact_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS emergency_relationship VARCHAR(100);

ALTER TABLE teachers
  ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS alternative_mobile VARCHAR(20),
  ADD COLUMN IF NOT EXISTS emergency_contact_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS emergency_contact_person VARCHAR(255),
  ADD COLUMN IF NOT EXISTS relationship VARCHAR(100);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS alternative_mobile VARCHAR(20),
  ADD COLUMN IF NOT EXISTS emergency_contact_number VARCHAR(20);

CREATE TABLE IF NOT EXISTS student_learning_gaps (
  id SERIAL PRIMARY KEY,
  school_id INT NULL,
  student_id INT NULL,
  academic_year_id INT NULL,
  gap_category VARCHAR(100) NULL,
  subject VARCHAR(255) NULL,
  description TEXT NULL,
  severity VARCHAR(50) NULL,
  identified_by INT NULL,
  identified_date DATE NULL,
  action_plan TEXT NULL,
  target_date DATE NULL,
  status VARCHAR(40) DEFAULT 'OPEN',
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teacher_teaching_gaps (
  id SERIAL PRIMARY KEY,
  school_id INT NULL,
  teacher_id INT NULL,
  academic_year_id INT NULL,
  gap_category VARCHAR(100) NULL,
  description TEXT NULL,
  severity VARCHAR(50) NULL,
  training_recommendation TEXT NULL,
  target_date DATE NULL,
  status VARCHAR(40) DEFAULT 'OPEN',
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_learning_gaps_student ON student_learning_gaps(student_id, school_id, academic_year_id, status);
CREATE INDEX IF NOT EXISTS idx_teacher_teaching_gaps_teacher ON teacher_teaching_gaps(teacher_id, school_id, academic_year_id, status);
