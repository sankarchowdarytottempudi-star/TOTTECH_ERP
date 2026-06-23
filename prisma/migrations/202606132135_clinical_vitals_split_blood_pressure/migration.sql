ALTER TABLE clinical_vitals
  ADD COLUMN IF NOT EXISTS systolic_bp INTEGER,
  ADD COLUMN IF NOT EXISTS diastolic_bp INTEGER;

UPDATE clinical_vitals
SET
  systolic_bp = NULLIF(split_part(blood_pressure, '/', 1), '')::integer,
  diastolic_bp = NULLIF(split_part(blood_pressure, '/', 2), '')::integer
WHERE blood_pressure ~ '^[0-9]{2,3}/[0-9]{1,3}$'
  AND systolic_bp IS NULL
  AND diastolic_bp IS NULL;
