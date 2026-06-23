-- TOTTECH ONE student lifecycle and certificate management sprint.
-- Idempotent additive migration for promotion history, certificate storage,
-- and school compliance metadata.

ALTER TABLE IF EXISTS schools
  ADD COLUMN IF NOT EXISTS recognition_number VARCHAR(120),
  ADD COLUMN IF NOT EXISTS recognition_authority VARCHAR(255),
  ADD COLUMN IF NOT EXISTS recognition_start_date DATE,
  ADD COLUMN IF NOT EXISTS recognition_expiry_date DATE,
  ADD COLUMN IF NOT EXISTS affiliation_number VARCHAR(120),
  ADD COLUMN IF NOT EXISTS affiliation_authority VARCHAR(255),
  ADD COLUMN IF NOT EXISTS affiliation_start_date DATE,
  ADD COLUMN IF NOT EXISTS affiliation_expiry_date DATE;

ALTER TABLE IF EXISTS students
  ADD COLUMN IF NOT EXISTS student_status VARCHAR(40) DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS status_reason TEXT;

UPDATE students
SET student_status = CASE
      WHEN COALESCE(is_suspended, false) THEN 'SUSPENDED'
      WHEN COALESCE(is_active, true) THEN 'ACTIVE'
      ELSE 'DROPOUT'
    END,
    status_updated_at = COALESCE(status_updated_at, updated_at, created_at, CURRENT_TIMESTAMP)
WHERE student_status IS NULL OR student_status = '';

CREATE TABLE IF NOT EXISTS student_academic_history (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  academic_year_id INTEGER REFERENCES academic_years(id) ON DELETE SET NULL,
  class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
  section_id INTEGER REFERENCES sections(id) ON DELETE SET NULL,
  promotion_status VARCHAR(80),
  promoted_on TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_academic_history_school_student
  ON student_academic_history(school_id, student_id);

CREATE INDEX IF NOT EXISTS idx_student_academic_history_student_year
  ON student_academic_history(student_id, academic_year_id);

CREATE INDEX IF NOT EXISTS idx_student_academic_history_status
  ON student_academic_history(promotion_status, promoted_on);

CREATE TABLE IF NOT EXISTS student_documents (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  academic_year_id INTEGER REFERENCES academic_years(id) ON DELETE SET NULL,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  document_type VARCHAR(80) NOT NULL,
  document_number VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_url TEXT,
  issued_on DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_student_documents_school_number
  ON student_documents(school_id, document_number);

CREATE INDEX IF NOT EXISTS idx_student_documents_student_type
  ON student_documents(student_id, document_type);

CREATE INDEX IF NOT EXISTS idx_student_documents_school_year
  ON student_documents(school_id, academic_year_id);

CREATE INDEX IF NOT EXISTS idx_students_lifecycle_status
  ON students(school_id, academic_year_id, student_status, is_active);

INSERT INTO student_academic_history (
  student_id,
  school_id,
  academic_year_id,
  class_id,
  section_id,
  promotion_status,
  promoted_on,
  created_by,
  metadata,
  created_at
)
SELECT DISTINCT ON (sye.student_id, sye.academic_year_id)
  sye.student_id,
  sye.school_id,
  sye.academic_year_id,
  sye.class_id,
  sye.section_id,
  CASE
    WHEN COALESCE(sye.source, '') = 'promotion' THEN 'PROMOTED'
    WHEN COALESCE(sye.source, '') = 'admission' THEN 'ADMITTED'
    WHEN COALESCE(sye.source, '') = 'student_edit' THEN 'UPDATED'
    ELSE COALESCE(UPPER(NULLIF(sye.status, '')), 'ADMITTED')
  END,
  COALESCE(sye.updated_at, sye.created_at, CURRENT_TIMESTAMP),
  NULL,
  jsonb_build_object(
    'source', COALESCE(sye.source, 'migration_backfill'),
    'roll_number', sye.roll_number,
    'status', sye.status
  ),
  COALESCE(sye.created_at, CURRENT_TIMESTAMP)
FROM student_year_enrollments sye
WHERE NOT EXISTS (
  SELECT 1
  FROM student_academic_history sah
  WHERE sah.student_id = sye.student_id
    AND sah.academic_year_id = sye.academic_year_id
    AND COALESCE(sah.class_id, 0) = COALESCE(sye.class_id, 0)
    AND COALESCE(sah.section_id, 0) = COALESCE(sye.section_id, 0)
)
ORDER BY sye.student_id, sye.academic_year_id, sye.id DESC;
