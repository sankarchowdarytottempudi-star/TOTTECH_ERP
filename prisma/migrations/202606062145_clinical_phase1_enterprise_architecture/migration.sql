-- TOTTECH Clinical Services Phase 1 enterprise SaaS foundation.
-- Adds tenant -> hospital -> branch architecture while preserving the
-- existing organization -> clinic compatibility layer.

CREATE TABLE IF NOT EXISTS clinical_tenants (
  id SERIAL PRIMARY KEY,
  tenant_name VARCHAR(255) NOT NULL,
  tenant_code VARCHAR(80) UNIQUE NOT NULL,
  subscription_plan VARCHAR(120) DEFAULT 'ENTERPRISE',
  subscription_status VARCHAR(80) DEFAULT 'ACTIVE',
  deployment_model VARCHAR(120) DEFAULT 'MULTI_TENANT_SAAS',
  hosting_provider VARCHAR(120) DEFAULT 'CONTABO',
  data_region VARCHAR(120) DEFAULT 'India',
  settings JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS hospitals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_name VARCHAR(255) NOT NULL,
  hospital_code VARCHAR(80) NOT NULL,
  legal_name VARCHAR(255),
  license_number VARCHAR(150),
  nabh_details JSONB DEFAULT '{}'::jsonb,
  gst_number VARCHAR(80),
  email VARCHAR(255),
  phone VARCHAR(40),
  address TEXT,
  city VARCHAR(120),
  state VARCHAR(120),
  country VARCHAR(120) DEFAULT 'India',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  branding JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_code)
);

CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_id INTEGER NOT NULL REFERENCES hospitals(id),
  branch_name VARCHAR(255) NOT NULL,
  branch_code VARCHAR(80) NOT NULL,
  branch_type VARCHAR(120) DEFAULT 'IVF_CENTER',
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(40),
  address TEXT,
  city VARCHAR(120),
  state VARCHAR(120),
  country VARCHAR(120) DEFAULT 'India',
  latitude NUMERIC(11,8),
  longitude NUMERIC(11,8),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  branding JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(hospital_id, branch_code)
);

CREATE TABLE IF NOT EXISTS clinical_security_settings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_id INTEGER REFERENCES hospitals(id),
  branch_id INTEGER REFERENCES branches(id),
  encryption_at_rest VARCHAR(80) DEFAULT 'AES-256',
  encryption_in_transit VARCHAR(80) DEFAULT 'TLS-1.3',
  login_methods JSONB DEFAULT '["username_password","mobile_otp","email_otp","mfa","sso"]'::jsonb,
  mfa_required BOOLEAN DEFAULT false,
  patient_record_authorization_required BOOLEAN DEFAULT true,
  audit_capture JSONB DEFAULT '["user","action","timestamp","ip","device","browser","old_value","new_value"]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id)
);

CREATE TABLE IF NOT EXISTS clinical_file_objects (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_id INTEGER NOT NULL REFERENCES hospitals(id),
  branch_id INTEGER NOT NULL REFERENCES branches(id),
  patient_id INTEGER,
  object_uid VARCHAR(100) UNIQUE NOT NULL,
  object_type VARCHAR(120),
  file_name VARCHAR(255),
  file_extension VARCHAR(20),
  mime_type VARCHAR(120),
  storage_provider VARCHAR(120) DEFAULT 'S3_COMPATIBLE',
  bucket_name VARCHAR(255),
  object_key TEXT,
  object_url TEXT,
  checksum VARCHAR(255),
  size_bytes BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_api_services (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  service_key VARCHAR(150) UNIQUE NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_type VARCHAR(120) DEFAULT 'NEXTJS_ROUTE_HANDLER',
  target_runtime VARCHAR(120) DEFAULT 'NEXTJS',
  base_path VARCHAR(255),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  settings JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_event_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  event_key VARCHAR(150) UNIQUE NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  event_bus VARCHAR(120) DEFAULT 'RABBITMQ_READY',
  producer_service VARCHAR(150),
  payload_schema JSONB DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_integration_connectors (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_id INTEGER REFERENCES hospitals(id),
  branch_id INTEGER REFERENCES branches(id),
  connector_key VARCHAR(150) NOT NULL,
  connector_name VARCHAR(255) NOT NULL,
  connector_type VARCHAR(120) NOT NULL,
  standard VARCHAR(120),
  status VARCHAR(80) DEFAULT 'CONFIG_REQUIRED',
  config JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, connector_key)
);

CREATE TABLE IF NOT EXISTS clinical_observability_config (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_id INTEGER REFERENCES hospitals(id),
  branch_id INTEGER REFERENCES branches(id),
  prometheus_enabled BOOLEAN DEFAULT false,
  grafana_enabled BOOLEAN DEFAULT false,
  elk_enabled BOOLEAN DEFAULT false,
  opentelemetry_enabled BOOLEAN DEFAULT false,
  log_retention_days INTEGER DEFAULT 90,
  config JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id)
);

CREATE TABLE IF NOT EXISTS clinical_backup_policies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_id INTEGER REFERENCES hospitals(id),
  branch_id INTEGER REFERENCES branches(id),
  daily_backup_enabled BOOLEAN DEFAULT true,
  weekly_full_backup_enabled BOOLEAN DEFAULT true,
  monthly_archive_enabled BOOLEAN DEFAULT true,
  rpo_minutes INTEGER DEFAULT 15,
  rto_minutes INTEGER DEFAULT 60,
  retention_policy JSONB DEFAULT '{"daily":14,"weekly":8,"monthly":12}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id)
);

CREATE TABLE IF NOT EXISTS clinical_notification_templates (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_id INTEGER REFERENCES hospitals(id),
  branch_id INTEGER REFERENCES branches(id),
  template_key VARCHAR(150) NOT NULL,
  channel VARCHAR(80) NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, template_key, channel)
);

CREATE TABLE IF NOT EXISTS clinical_ai_governance_policies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES clinical_tenants(id),
  hospital_id INTEGER REFERENCES hospitals(id),
  branch_id INTEGER REFERENCES branches(id),
  policy_key VARCHAR(150) NOT NULL,
  policy_name VARCHAR(255) NOT NULL,
  restrictions JSONB DEFAULT '["no_independent_diagnosis","no_independent_prescription","clinical_review_required"]'::jsonb,
  required_disclaimer TEXT DEFAULT 'Clinical review required before patient action.',
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

INSERT INTO clinical_tenants (
  tenant_name,
  tenant_code,
  subscription_plan,
  subscription_status,
  deployment_model,
  hosting_provider,
  settings
)
SELECT
  organization_name,
  organization_code,
  'ENTERPRISE',
  'ACTIVE',
  'MULTI_TENANT_SAAS',
  'CONTABO',
  jsonb_build_object(
    'source', 'organizations',
    'legacyOrganizationId', id,
    'supportedProducts', ARRAY['Multi Specialty Hospital','IVF Center','Fertility Clinic','Diagnostic Center','Pharmacy','Day Care Hospital','Corporate Hospital Chain']
  )
FROM organizations
WHERE organization_code = 'TCS'
ON CONFLICT (tenant_code)
DO UPDATE SET
  tenant_name = EXCLUDED.tenant_name,
  subscription_plan = EXCLUDED.subscription_plan,
  subscription_status = EXCLUDED.subscription_status,
  deployment_model = EXCLUDED.deployment_model,
  hosting_provider = EXCLUDED.hosting_provider,
  settings = EXCLUDED.settings,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO hospitals (
  tenant_id,
  hospital_name,
  hospital_code,
  legal_name,
  email,
  phone,
  address,
  city,
  state,
  branding,
  settings
)
SELECT
  ct.id,
  'TOTTECH Clinical Services Hospital Network',
  'TCS-HOSPITAL',
  o.legal_name,
  o.email,
  o.phone,
  o.address,
  'Hyderabad',
  'Telangana',
  o.branding,
  jsonb_build_object('legacyOrganizationId', o.id, 'nabhRequired', true)
FROM clinical_tenants ct
JOIN organizations o ON o.organization_code = ct.tenant_code
WHERE ct.tenant_code = 'TCS'
ON CONFLICT (tenant_id, hospital_code)
DO UPDATE SET
  hospital_name = EXCLUDED.hospital_name,
  legal_name = EXCLUDED.legal_name,
  branding = EXCLUDED.branding,
  settings = EXCLUDED.settings,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO branches (
  tenant_id,
  hospital_id,
  branch_name,
  branch_code,
  branch_type,
  email,
  phone,
  address,
  city,
  state,
  branding,
  settings
)
SELECT
  ct.id,
  h.id,
  c.clinic_name,
  c.clinic_code,
  c.clinic_type,
  c.email,
  c.phone,
  c.address,
  c.city,
  c.state,
  c.branding,
  jsonb_build_object('legacyClinicId', c.id)
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id AND h.hospital_code = 'TCS-HOSPITAL'
JOIN clinics c ON c.tenant_id = ct.id
WHERE ct.tenant_code = 'TCS'
ON CONFLICT (hospital_id, branch_code)
DO UPDATE SET
  branch_name = EXCLUDED.branch_name,
  branch_type = EXCLUDED.branch_type,
  branding = EXCLUDED.branding,
  settings = EXCLUDED.settings,
  updated_at = CURRENT_TIMESTAMP;

DO $$
DECLARE
  target_table text;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'organizations',
    'clinic_groups',
    'clinics',
    'departments',
    'clinical_roles',
    'clinical_user_profiles',
    'clinical_menu_items',
    'patients',
    'doctors',
    'appointments',
    'medical_records',
    'ivf_cases',
    'lab_orders',
    'lab_results',
    'prescriptions',
    'medical_documents',
    'clinical_forms',
    'clinical_form_fields',
    'clinical_workflows',
    'clinical_reports',
    'clinical_audit_events',
    'clinical_ai_logs'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS hospital_id INTEGER', target_table);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS branch_id INTEGER', target_table);
  END LOOP;
END $$;

UPDATE organizations o
SET hospital_id = h.id,
    branch_id = b.id
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id
JOIN branches b ON b.hospital_id = h.id
WHERE o.organization_code = ct.tenant_code
  AND ct.tenant_code = 'TCS'
  AND (o.hospital_id IS NULL OR o.branch_id IS NULL);

UPDATE clinics c
SET hospital_id = h.id,
    branch_id = b.id
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id
JOIN branches b ON b.hospital_id = h.id
WHERE c.tenant_id = ct.id
  AND b.branch_code = c.clinic_code
  AND ct.tenant_code = 'TCS'
  AND (c.hospital_id IS NULL OR c.branch_id IS NULL);

UPDATE clinic_groups cg
SET hospital_id = h.id,
    branch_id = b.id
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id
JOIN branches b ON b.hospital_id = h.id
WHERE cg.tenant_id = ct.id
  AND ct.tenant_code = 'TCS'
  AND (cg.hospital_id IS NULL OR cg.branch_id IS NULL);

UPDATE departments d
SET hospital_id = c.hospital_id,
    branch_id = c.branch_id
FROM clinics c
WHERE d.clinic_id = c.id
  AND (d.hospital_id IS NULL OR d.branch_id IS NULL);

DO $$
DECLARE
  target_table text;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'clinical_roles',
    'clinical_user_profiles',
    'clinical_menu_items',
    'patients',
    'doctors',
    'appointments',
    'medical_records',
    'ivf_cases',
    'lab_orders',
    'lab_results',
    'prescriptions',
    'medical_documents',
    'clinical_forms',
    'clinical_form_fields',
    'clinical_workflows',
    'clinical_reports',
    'clinical_audit_events',
    'clinical_ai_logs'
  ]
  LOOP
    EXECUTE format(
      'UPDATE %I t SET hospital_id = c.hospital_id, branch_id = c.branch_id FROM clinics c WHERE t.clinic_id = c.id AND (t.hospital_id IS NULL OR t.branch_id IS NULL)',
      target_table
    );
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_hospitals_tenant ON hospitals(tenant_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_branches_scope ON branches(tenant_id, hospital_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_departments_enterprise_scope ON departments(tenant_id, hospital_id, branch_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_patients_enterprise_scope ON patients(tenant_id, hospital_id, branch_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_doctors_enterprise_scope ON doctors(tenant_id, hospital_id, branch_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_appointments_enterprise_scope ON appointments(tenant_id, hospital_id, branch_id, appointment_date, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_audit_enterprise_scope ON clinical_audit_events(tenant_id, hospital_id, branch_id, module_name, created_at);
CREATE INDEX IF NOT EXISTS idx_clinical_ai_enterprise_scope ON clinical_ai_logs(tenant_id, hospital_id, branch_id, created_at);

INSERT INTO clinical_security_settings (tenant_id, hospital_id, branch_id)
SELECT ct.id, h.id, b.id
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id
JOIN branches b ON b.hospital_id = h.id
WHERE ct.tenant_code = 'TCS'
ON CONFLICT (tenant_id, hospital_id, branch_id)
DO UPDATE SET updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_backup_policies (tenant_id, hospital_id, branch_id)
SELECT ct.id, h.id, b.id
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id
JOIN branches b ON b.hospital_id = h.id
WHERE ct.tenant_code = 'TCS'
ON CONFLICT (tenant_id, hospital_id, branch_id)
DO UPDATE SET
  rpo_minutes = 15,
  rto_minutes = 60,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_observability_config (tenant_id, hospital_id, branch_id, config)
SELECT ct.id, h.id, b.id, '{"targets":["prometheus","grafana","elk","opentelemetry"],"status":"foundation_registered"}'::jsonb
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id
JOIN branches b ON b.hospital_id = h.id
WHERE ct.tenant_code = 'TCS'
ON CONFLICT (tenant_id, hospital_id, branch_id)
DO UPDATE SET
  config = EXCLUDED.config,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_ai_governance_policies (tenant_id, hospital_id, branch_id, policy_key, policy_name)
SELECT ct.id, h.id, b.id, 'clinical_review_required', 'Clinical Review Required'
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id
JOIN branches b ON b.hospital_id = h.id
WHERE ct.tenant_code = 'TCS'
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET
  restrictions = EXCLUDED.restrictions,
  required_disclaimer = EXCLUDED.required_disclaimer,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_api_services (service_key, service_name, base_path, settings)
VALUES
  ('auth_service','Auth Service','/api/auth','{"target":"future_nestjs_gateway"}'::jsonb),
  ('patient_service','Patient Service','/api/clinical/patients','{"target":"future_patient_microservice"}'::jsonb),
  ('appointment_service','Appointment Service','/api/clinical/appointments','{"target":"future_appointment_microservice"}'::jsonb),
  ('doctor_service','Doctor Service','/api/clinical/doctors','{"target":"future_doctor_microservice"}'::jsonb),
  ('lab_service','Lab Service','/api/clinical/laboratory','{"target":"future_lab_microservice"}'::jsonb),
  ('radiology_service','Radiology Service','/api/clinical/radiology','{"target":"future_radiology_microservice"}'::jsonb),
  ('pharmacy_service','Pharmacy Service','/api/clinical/pharmacy','{"target":"future_pharmacy_microservice"}'::jsonb),
  ('billing_service','Billing Service','/api/clinical/billing','{"target":"future_billing_microservice"}'::jsonb),
  ('insurance_service','Insurance Service','/api/clinical/insurance','{"target":"future_insurance_microservice"}'::jsonb),
  ('referral_service','Referral Service','/api/clinical/referrals','{"target":"future_referral_microservice"}'::jsonb),
  ('ivf_service','IVF Service','/api/clinical/ivf','{"target":"future_ivf_microservice"}'::jsonb),
  ('ai_service','AI Service','/api/clinical/ai','{"target":"future_ai_microservice"}'::jsonb),
  ('notification_service','Notification Service','/api/notifications','{"target":"future_notification_microservice"}'::jsonb)
ON CONFLICT (service_key)
DO UPDATE SET
  service_name = EXCLUDED.service_name,
  base_path = EXCLUDED.base_path,
  settings = EXCLUDED.settings,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_event_definitions (event_key, event_name, producer_service, payload_schema)
VALUES
  ('PatientCreated','Patient Created','patient_service','{"tenant_id":"number","hospital_id":"number","branch_id":"number","patient_id":"number"}'::jsonb),
  ('AppointmentBooked','Appointment Booked','appointment_service','{"tenant_id":"number","hospital_id":"number","branch_id":"number","appointment_id":"number"}'::jsonb),
  ('InvoiceGenerated','Invoice Generated','billing_service','{"tenant_id":"number","hospital_id":"number","branch_id":"number","invoice_id":"number"}'::jsonb),
  ('LabResultReady','Lab Result Ready','lab_service','{"tenant_id":"number","hospital_id":"number","branch_id":"number","lab_result_id":"number"}'::jsonb),
  ('EmbryoCreated','Embryo Created','ivf_service','{"tenant_id":"number","hospital_id":"number","branch_id":"number","embryo_id":"number"}'::jsonb),
  ('InsuranceApproved','Insurance Approved','insurance_service','{"tenant_id":"number","hospital_id":"number","branch_id":"number","claim_id":"number"}'::jsonb)
ON CONFLICT (event_key)
DO UPDATE SET
  event_name = EXCLUDED.event_name,
  producer_service = EXCLUDED.producer_service,
  payload_schema = EXCLUDED.payload_schema,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_integration_connectors (
  tenant_id,
  hospital_id,
  branch_id,
  connector_key,
  connector_name,
  connector_type,
  standard
)
SELECT ct.id, h.id, b.id, connector_key, connector_name, connector_type, standard
FROM clinical_tenants ct
JOIN hospitals h ON h.tenant_id = ct.id
JOIN branches b ON b.hospital_id = h.id
CROSS JOIN (
  VALUES
    ('fhir_r4','FHIR R4','HEALTHCARE','FHIR_R4'),
    ('fhir_r5','FHIR R5','HEALTHCARE','FHIR_R5'),
    ('hl7','HL7','HEALTHCARE','HL7'),
    ('dicom','DICOM','IMAGING','DICOM'),
    ('pacs','PACS','IMAGING','PACS'),
    ('abha','ABHA','GOVERNMENT','ABHA'),
    ('ayushman_bharat','Ayushman Bharat','GOVERNMENT','AYUSHMAN_BHARAT')
) AS item(connector_key, connector_name, connector_type, standard)
WHERE ct.tenant_code = 'TCS'
ON CONFLICT (tenant_id, hospital_id, branch_id, connector_key)
DO UPDATE SET
  connector_name = EXCLUDED.connector_name,
  connector_type = EXCLUDED.connector_type,
  standard = EXCLUDED.standard,
  updated_at = CURRENT_TIMESTAMP;
