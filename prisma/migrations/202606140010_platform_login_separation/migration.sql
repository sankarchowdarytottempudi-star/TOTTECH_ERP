ALTER TABLE users
  ADD COLUMN IF NOT EXISTS username VARCHAR(120),
  ADD COLUMN IF NOT EXISTS platform_type VARCHAR(40) NOT NULL DEFAULT 'EDUCATIONAL',
  ADD COLUMN IF NOT EXISTS status VARCHAR(40) NOT NULL DEFAULT 'ACTIVE';

UPDATE users
SET platform_type = 'CLINICAL'
WHERE id IN (
  SELECT DISTINCT user_id
  FROM clinical_user_profiles
  WHERE COALESCE(is_deleted,false) = false
)
OR LOWER(COALESCE(email,'')) LIKE 'cs-%'
OR LOWER(COALESCE(email,'')) = 'cs-superadmin@erp.com'
OR LOWER(COALESCE(email,'')) LIKE '%tottechclinical.local';

UPDATE users
SET platform_type = 'EDUCATIONAL'
WHERE platform_type IS NULL
   OR platform_type NOT IN ('EDUCATIONAL','CLINICAL');

UPDATE users
SET status = CASE WHEN COALESCE(is_active,true) THEN 'ACTIVE' ELSE 'INACTIVE' END;

UPDATE users
SET username =
  CASE
    WHEN id = 1 THEN 'admin'
    WHEN id = 2 THEN 'principal1'
    WHEN id = 3 THEN 'admin'
    WHEN LOWER(email) IN ('cs-doctor@erp.com') THEN 'doctor1'
    WHEN LOWER(email) IN ('cs-receptionist@erp.com') THEN 'reception'
    WHEN LOWER(email) IN ('cs-lab-technician@erp.com') THEN 'labtech'
    WHEN LOWER(email) IN ('cs-pharmacist@erp.com') THEN 'pharmacy1'
    WHEN LOWER(email) LIKE 'cs-%@%' THEN regexp_replace(split_part(LOWER(email),'@',1), '^cs-', '')
    ELSE regexp_replace(split_part(LOWER(email),'@',1), '[^a-z0-9._-]+', '', 'g')
  END
WHERE username IS NULL OR TRIM(username) = '';

WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY platform_type, LOWER(username)
           ORDER BY id
         ) AS rn
  FROM users
)
UPDATE users u
SET username = u.username || u.id::text
FROM duplicates d
WHERE d.id = u.id
  AND d.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS users_platform_username_unique
  ON users (platform_type, LOWER(username));

CREATE INDEX IF NOT EXISTS users_platform_login_lookup
  ON users (platform_type, LOWER(username), LOWER(email), status, is_active);
