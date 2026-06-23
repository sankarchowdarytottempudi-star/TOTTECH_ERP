ALTER TABLE users
  ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en';

UPDATE users
SET preferred_language = COALESCE(preferred_language, 'en')
WHERE preferred_language IS NULL;
