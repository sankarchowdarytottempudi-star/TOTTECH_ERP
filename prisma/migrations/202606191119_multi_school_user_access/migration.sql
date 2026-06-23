CREATE TABLE IF NOT EXISTS user_school_access (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  CONSTRAINT uq_user_school_access_user_school UNIQUE (user_id, school_id)
);

CREATE INDEX IF NOT EXISTS idx_user_school_access_user_active
  ON user_school_access(user_id, is_active);

CREATE INDEX IF NOT EXISTS idx_user_school_access_school_active
  ON user_school_access(school_id, is_active);

INSERT INTO user_school_access (user_id, school_id, is_primary, is_active, created_at, created_by)
SELECT u.id, u.school_id, TRUE, COALESCE(u.is_active, TRUE), CURRENT_TIMESTAMP, NULL
FROM users u
WHERE u.school_id IS NOT NULL
ON CONFLICT (user_id, school_id)
DO UPDATE SET
  is_primary = CASE
    WHEN user_school_access.is_primary IS TRUE THEN TRUE
    ELSE EXCLUDED.is_primary
  END,
  is_active = EXCLUDED.is_active;
