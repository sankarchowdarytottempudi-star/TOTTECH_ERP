ALTER TABLE users
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS locked_by INTEGER,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP(6),
  ADD COLUMN IF NOT EXISTS archived_by INTEGER,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(6);

UPDATE users
SET status = CASE
  WHEN COALESCE(is_deleted,false) = true THEN 'ARCHIVED'
  WHEN COALESCE(is_active,true) = false THEN 'INACTIVE'
  WHEN UPPER(COALESCE(status,'ACTIVE')) IN ('ACTIVE','INACTIVE','LOCKED','ARCHIVED') THEN UPPER(COALESCE(status,'ACTIVE'))
  ELSE 'ACTIVE'
END,
updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS school_module_access (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  module_key VARCHAR(80) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  enabled_by INTEGER,
  enabled_at TIMESTAMP(6),
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (school_id, module_key)
);

CREATE INDEX IF NOT EXISTS idx_school_module_access_school
  ON school_module_access (school_id);

CREATE INDEX IF NOT EXISTS idx_school_module_access_school_module
  ON school_module_access (school_id, module_key);

CREATE INDEX IF NOT EXISTS idx_school_module_access_enabled
  ON school_module_access (module_key, enabled);

CREATE TABLE IF NOT EXISTS user_login_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  platform_type VARCHAR(40),
  status VARCHAR(80) NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  reason TEXT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_login_history_user
  ON user_login_history (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_login_history_school
  ON user_login_history (school_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_login_history_status
  ON user_login_history (status, created_at DESC);

WITH module_keys(module_key) AS (
  VALUES
    ('STUDENTS'),
    ('TEACHERS'),
    ('ACADEMICS'),
    ('FINANCE'),
    ('OPERATIONS'),
    ('DINING'),
    ('TRANSPORT'),
    ('HOSTEL'),
    ('REPORTS'),
    ('ANALYTICS'),
    ('AI'),
    ('USER_MANAGEMENT'),
    ('PARENT_PORTAL'),
    ('MOBILE_APP')
),
school_modules AS (
  SELECT
    s.id AS school_id,
    mk.module_key,
    CASE
      WHEN UPPER(COALESCE(s.subscription_plan,'STARTER')) IN ('ENTERPRISE','PRO','PREMIUM') THEN true
      WHEN UPPER(COALESCE(s.subscription_plan,'STARTER')) IN ('PROFESSIONAL','STANDARD') THEN mk.module_key IN ('STUDENTS','TEACHERS','ACADEMICS','FINANCE','OPERATIONS','REPORTS')
      WHEN UPPER(COALESCE(s.subscription_plan,'STARTER')) IN ('CUSTOM') THEN mk.module_key IN ('STUDENTS','TEACHERS','ACADEMICS')
      ELSE mk.module_key IN ('STUDENTS','TEACHERS','ACADEMICS')
    END AS enabled
  FROM schools s
  CROSS JOIN module_keys mk
)
INSERT INTO school_module_access (school_id, module_key, enabled, enabled_at, created_at, updated_at)
SELECT school_id, module_key, enabled, CASE WHEN enabled THEN CURRENT_TIMESTAMP ELSE NULL END, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM school_modules
ON CONFLICT (school_id, module_key)
DO NOTHING;
