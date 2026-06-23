ALTER TABLE teachers
  ADD COLUMN IF NOT EXISTS staff_type VARCHAR(20) DEFAULT 'Teaching',
  ADD COLUMN IF NOT EXISTS subject_specialization TEXT,
  ADD COLUMN IF NOT EXISTS classes_handling JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sections_handling JSONB DEFAULT '[]'::jsonb;
