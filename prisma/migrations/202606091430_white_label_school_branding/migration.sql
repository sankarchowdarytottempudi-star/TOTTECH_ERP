ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS school_logo TEXT,
  ADD COLUMN IF NOT EXISTS favicon_url TEXT,
  ADD COLUMN IF NOT EXISTS school_favicon TEXT,
  ADD COLUMN IF NOT EXISTS primary_color VARCHAR(30) DEFAULT '#04142E',
  ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(30) DEFAULT '#D4AF37',
  ADD COLUMN IF NOT EXISTS city VARCHAR(120),
  ADD COLUMN IF NOT EXISTS state VARCHAR(120),
  ADD COLUMN IF NOT EXISTS country VARCHAR(120) DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS postal_code VARCHAR(30),
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS principal_contact VARCHAR(50),
  ADD COLUMN IF NOT EXISTS owner_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS owner_contact VARCHAR(50),
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_branding_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS report_branding JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS certificate_branding JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

UPDATE schools
SET
  primary_color = COALESCE(primary_color, '#04142E'),
  secondary_color = COALESCE(secondary_color, '#D4AF37'),
  country = COALESCE(country, 'India'),
  subscription_status = COALESCE(subscription_status, CASE WHEN is_active THEN 'ACTIVE' ELSE 'INACTIVE' END),
  branding = COALESCE(branding, '{}'::jsonb),
  report_branding = COALESCE(report_branding, '{}'::jsonb),
  certificate_branding = COALESCE(certificate_branding, '{}'::jsonb),
  settings = COALESCE(settings, '{}'::jsonb);
