ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP(6) NULL,
  ADD COLUMN IF NOT EXISTS deleted_by INTEGER NULL;

CREATE INDEX IF NOT EXISTS idx_users_platform_deleted_status
  ON users(platform_type, is_deleted, status);

CREATE TABLE IF NOT EXISTS hospital_subscriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  plan_name VARCHAR(120) NOT NULL DEFAULT 'ENTERPRISE',
  start_date DATE NULL,
  end_date DATE NULL,
  status VARCHAR(80) NOT NULL DEFAULT 'ACTIVE',
  created_by INTEGER NULL,
  updated_by INTEGER NULL,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_hospital_subscriptions_scope
  ON hospital_subscriptions(tenant_id, hospital_id, status);

CREATE TABLE IF NOT EXISTS hospital_module_access (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  module_code VARCHAR(80) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  enabled_by INTEGER NULL,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER NULL,
  CONSTRAINT uq_hospital_module_access_scope UNIQUE (tenant_id, hospital_id, module_code)
);

CREATE INDEX IF NOT EXISTS idx_hospital_module_access_enabled
  ON hospital_module_access(tenant_id, hospital_id, enabled);

INSERT INTO hospital_subscriptions (
  tenant_id,
  hospital_id,
  plan_name,
  status,
  start_date,
  created_by,
  updated_by,
  created_at,
  updated_at,
  is_deleted
)
SELECT
  h.tenant_id,
  h.id,
  COALESCE((h.settings->'subscription'->>'plan_type'), 'ENTERPRISE'),
  COALESCE(h.status, 'ACTIVE'),
  CURRENT_DATE,
  h.created_by,
  h.updated_by,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  FALSE
FROM hospitals h
WHERE COALESCE(h.is_deleted, false) = false
  AND NOT EXISTS (
    SELECT 1
    FROM hospital_subscriptions hs
    WHERE hs.tenant_id = h.tenant_id
      AND hs.hospital_id = h.id
      AND COALESCE(hs.is_deleted, false) = false
  );

WITH module_codes(module_code) AS (
  VALUES
    ('PATIENTS'),
    ('APPOINTMENTS'),
    ('OP'),
    ('IP'),
    ('ER'),
    ('ICU'),
    ('OT'),
    ('IVF'),
    ('LAB'),
    ('RADIOLOGY'),
    ('PHARMACY'),
    ('INVENTORY'),
    ('PROCUREMENT'),
    ('BILLING'),
    ('INSURANCE'),
    ('REFERRAL'),
    ('FINANCE'),
    ('HR'),
    ('ANALYTICS'),
    ('AI')
)
INSERT INTO hospital_module_access (
  tenant_id,
  hospital_id,
  module_code,
  enabled,
  created_at,
  updated_at,
  enabled_by,
  updated_by
)
SELECT
  h.tenant_id,
  h.id,
  mc.module_code,
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  h.created_by,
  h.updated_by
FROM hospitals h
CROSS JOIN module_codes mc
WHERE COALESCE(h.is_deleted, false) = false
ON CONFLICT (tenant_id, hospital_id, module_code) DO NOTHING;
