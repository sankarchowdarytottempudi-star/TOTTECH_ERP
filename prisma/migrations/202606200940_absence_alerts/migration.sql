ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS channel VARCHAR(30),
  ADD COLUMN IF NOT EXISTS recipient_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(50) DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS attendance_absence_responses (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  attendance_id INTEGER,
  student_id INTEGER,
  response_type VARCHAR(50) NOT NULL,
  notes TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  declared_by INTEGER,
  created_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendance_absence_responses_scope
  ON attendance_absence_responses (school_id, academic_year_id, student_id, response_type);
CREATE INDEX IF NOT EXISTS idx_attendance_master_absence_scope
  ON attendance_master (school_id, academic_year_id, status, attendance_date, class_id, section_id);
