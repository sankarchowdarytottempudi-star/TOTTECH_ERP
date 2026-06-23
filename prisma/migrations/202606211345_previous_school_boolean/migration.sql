ALTER TABLE students
  ADD COLUMN IF NOT EXISTS has_previous_school BOOLEAN DEFAULT FALSE;

UPDATE students
SET has_previous_school =
  CASE
    WHEN COALESCE(previous_school_details, '') <> ''
      OR COALESCE(previous_school_name, '') <> ''
      OR COALESCE(previous_school_address, '') <> ''
      OR COALESCE(previous_school_performance, '') <> ''
      OR COALESCE(previous_school_grade, '') <> ''
      OR previous_school_percentage IS NOT NULL
    THEN TRUE
    ELSE COALESCE(has_previous_school, FALSE)
  END;
