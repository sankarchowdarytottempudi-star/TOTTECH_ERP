ALTER TABLE students
  ADD COLUMN IF NOT EXISTS previous_school_details TEXT,
  ADD COLUMN IF NOT EXISTS previous_academic_performance VARCHAR(80);

UPDATE students
SET previous_school_details = TRIM(
      COALESCE(previous_school_name, '') ||
      CASE
        WHEN COALESCE(previous_school_name, '') <> '' AND COALESCE(previous_school_address, '') <> '' THEN ', '
        ELSE ''
      END ||
      COALESCE(previous_school_address, '')
    ),
    previous_academic_performance = COALESCE(
      NULLIF(previous_school_performance, ''),
      NULLIF(previous_school_grade, ''),
      CASE
        WHEN previous_school_percentage IS NULL THEN NULL
        ELSE TRIM(TRAILING '.00' FROM previous_school_percentage::text)
      END
    )
WHERE previous_school_details IS NULL
   OR previous_academic_performance IS NULL;
