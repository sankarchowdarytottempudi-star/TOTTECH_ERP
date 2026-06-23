-- TOTTECH Clinical Services - Phase 12 Codex Implementation Pack + DevOps + Testing + Deployment + Production Readiness

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

CREATE TABLE IF NOT EXISTS clinical_production_monorepo_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  app_key VARCHAR(160) NOT NULL,
  app_name VARCHAR(255) NOT NULL,
  app_type VARCHAR(120) NOT NULL,
  target_users JSONB DEFAULT '[]'::jsonb,
  framework VARCHAR(160) DEFAULT 'Next.js + React + TypeScript',
  folder_path VARCHAR(255) NOT NULL,
  deployment_target VARCHAR(160) DEFAULT 'container',
  healthcheck_path VARCHAR(255),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, app_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  service_key VARCHAR(160) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_type VARCHAR(120) NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  technology_stack JSONB DEFAULT '[]'::jsonb,
  api_prefix VARCHAR(255),
  event_topics JSONB DEFAULT '[]'::jsonb,
  data_scope JSONB DEFAULT '["tenant_id","hospital_id","branch_id"]'::jsonb,
  healthcheck_path VARCHAR(255) DEFAULT '/health',
  readiness_path VARCHAR(255) DEFAULT '/ready',
  liveness_path VARCHAR(255) DEFAULT '/live',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, service_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  package_key VARCHAR(160) NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  folder_path VARCHAR(255) NOT NULL,
  package_type VARCHAR(120) NOT NULL,
  exports JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, package_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_infrastructure_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  component_key VARCHAR(180) NOT NULL,
  component_name VARCHAR(255) NOT NULL,
  component_type VARCHAR(120) NOT NULL,
  provider_targets JSONB DEFAULT '[]'::jsonb,
  artifact_path VARCHAR(255),
  ports JSONB DEFAULT '[]'::jsonb,
  persistence_policy JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, component_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_technology_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  stack_key VARCHAR(160) NOT NULL,
  stack_area VARCHAR(120) NOT NULL,
  technology_name VARCHAR(255) NOT NULL,
  minimum_version VARCHAR(80),
  usage_policy TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, stack_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_prisma_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  rule_key VARCHAR(180) NOT NULL,
  rule_name VARCHAR(255) NOT NULL,
  rule_category VARCHAR(120) NOT NULL,
  requirement TEXT NOT NULL,
  applies_to JSONB DEFAULT '[]'::jsonb,
  enforcement_level VARCHAR(80) DEFAULT 'REQUIRED',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, rule_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_api_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  contract_key VARCHAR(220) NOT NULL,
  service_key VARCHAR(160) NOT NULL,
  method VARCHAR(20) NOT NULL,
  path VARCHAR(255) NOT NULL,
  openapi_version VARCHAR(40) DEFAULT '3.1.0',
  auth_required BOOLEAN DEFAULT true,
  tenant_isolation_required BOOLEAN DEFAULT true,
  audit_required BOOLEAN DEFAULT true,
  response_schema JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, contract_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_event_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  event_key VARCHAR(180) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  exchange_name VARCHAR(180) DEFAULT 'clinical.events',
  routing_key VARCHAR(220) NOT NULL,
  producer_service VARCHAR(160) NOT NULL,
  consumer_services JSONB DEFAULT '[]'::jsonb,
  payload_schema JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, event_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_security_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  control_key VARCHAR(180) NOT NULL,
  control_name VARCHAR(255) NOT NULL,
  control_area VARCHAR(120) NOT NULL,
  requirement TEXT NOT NULL,
  validation_method TEXT NOT NULL,
  severity VARCHAR(80) DEFAULT 'HIGH',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, control_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_testing_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  test_key VARCHAR(180) NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  test_type VARCHAR(120) NOT NULL,
  framework VARCHAR(120) NOT NULL,
  target_coverage VARCHAR(80),
  scope JSONB DEFAULT '[]'::jsonb,
  command TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, test_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_devops_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  artifact_key VARCHAR(180) NOT NULL,
  artifact_name VARCHAR(255) NOT NULL,
  artifact_type VARCHAR(120) NOT NULL,
  artifact_path VARCHAR(255) NOT NULL,
  validation_command TEXT,
  deployment_stage VARCHAR(120) DEFAULT 'PRODUCTION',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, artifact_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_monitoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  rule_key VARCHAR(180) NOT NULL,
  rule_name VARCHAR(255) NOT NULL,
  metric_name VARCHAR(180) NOT NULL,
  threshold_expression TEXT NOT NULL,
  alert_channel JSONB DEFAULT '["email","whatsapp"]'::jsonb,
  severity VARCHAR(80) DEFAULT 'HIGH',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, rule_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_backup_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(180) NOT NULL,
  policy_name VARCHAR(255) NOT NULL,
  backup_type VARCHAR(120) NOT NULL,
  schedule_expression VARCHAR(160) NOT NULL,
  retention_policy JSONB DEFAULT '{}'::jsonb,
  recovery_target JSONB DEFAULT '{}'::jsonb,
  verification_command TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_production_go_live_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  checklist_key VARCHAR(180) NOT NULL,
  checklist_item VARCHAR(255) NOT NULL,
  checklist_category VARCHAR(120) NOT NULL,
  acceptance_evidence TEXT NOT NULL,
  required_for_go_live BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, checklist_key)
);

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
apps(app_key, app_name, app_type, target_users, folder_path, healthcheck_path) AS (
  VALUES
    ('web_admin','Web Admin','Next.js','["Hospital Admin","Super Admin","Operations"]'::jsonb,'apps/web-admin','/api/health'),
    ('patient_portal','Patient Portal','Next.js','["Patients","Families"]'::jsonb,'apps/patient-portal','/api/health'),
    ('doctor_portal','Doctor Portal','Next.js','["Doctors","Consultants"]'::jsonb,'apps/doctor-portal','/api/health'),
    ('nurse_portal','Nurse Portal','Next.js','["Nurses","Ward Staff"]'::jsonb,'apps/nurse-portal','/api/health'),
    ('referral_portal','Referral Portal','Next.js','["Referral Partners"]'::jsonb,'apps/referral-portal','/api/health'),
    ('executive_dashboard','Executive Dashboard','Next.js','["CXO","Medical Director","Finance Head"]'::jsonb,'apps/executive-dashboard','/api/health'),
    ('mobile_api','Mobile API','NestJS','["Mobile Apps"]'::jsonb,'apps/mobile-api','/health')
)
INSERT INTO clinical_production_monorepo_apps (
  tenant_id, hospital_id, branch_id, clinic_id, app_key, app_name, app_type, target_users, folder_path, healthcheck_path, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, apps.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN apps
ON CONFLICT (tenant_id, hospital_id, branch_id, app_key)
DO UPDATE SET app_name = EXCLUDED.app_name, app_type = EXCLUDED.app_type, target_users = EXCLUDED.target_users, folder_path = EXCLUDED.folder_path, healthcheck_path = EXCLUDED.healthcheck_path, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
services(service_key, service_name, service_type, responsibilities, api_prefix, event_topics) AS (
  VALUES
    ('auth_service','Authentication Service','NestJS','["Login","MFA","JWT","SSO","ABHA Login"]'::jsonb,'/api/v1/auth','["Login","Logout","MfaVerified"]'::jsonb),
    ('patient_service','Patient Service','NestJS','["Registration","Patient 360","Documents","Timeline"]'::jsonb,'/api/v1/patients','["PatientCreated","PatientUpdated"]'::jsonb),
    ('appointment_service','Appointment Service','NestJS','["Appointment Booking","Reschedule","Cancel","Check In"]'::jsonb,'/api/v1/appointments','["AppointmentBooked"]'::jsonb),
    ('doctor_service','Doctor Service','NestJS','["Doctor Directory","Availability","Consultation Ownership"]'::jsonb,'/api/v1/doctors','["DoctorUpdated"]'::jsonb),
    ('nursing_service','Nursing Service','NestJS','["Ward Tasks","Vitals","Medication Tasks"]'::jsonb,'/api/v1/nursing','["NursingTaskCreated"]'::jsonb),
    ('ip_service','IP Service','NestJS','["Admissions","Transfers","Ward Management","Bed Management","Discharges"]'::jsonb,'/api/v1/ip','["AdmissionCreated","DischargeCreated"]'::jsonb),
    ('er_service','ER Service','NestJS','["Triage","ER Case Sheet","Emergency Orders"]'::jsonb,'/api/v1/er','["ErCaseCreated"]'::jsonb),
    ('icu_service','ICU Service','NestJS','["ICU Bed Status","Ventilator Status","Critical Alerts"]'::jsonb,'/api/v1/icu','["IcuAlertCreated"]'::jsonb),
    ('ot_service','OT Service','NestJS','["OT Scheduling","Procedure Notes","Sterilization"]'::jsonb,'/api/v1/ot','["OtScheduled"]'::jsonb),
    ('ivf_service','IVF Service','NestJS','["Cycles","Embryology","Cryopreservation","Pregnancy Tracking"]'::jsonb,'/api/v1/ivf','["EmbryoCreated","IvfCycleStarted"]'::jsonb),
    ('embryology_service','Embryology Service','NestJS','["Embryo Grading","Images","Cryo Status"]'::jsonb,'/api/v1/embryology','["EmbryoCreated"]'::jsonb),
    ('lab_service','Lab Service','NestJS','["Orders","Sample Collection","Results","Reports","Quality Control"]'::jsonb,'/api/v1/lab','["LabResultReady"]'::jsonb),
    ('radiology_service','Radiology Service','NestJS','["Orders","Studies","Reports"]'::jsonb,'/api/v1/radiology','["RadiologyReportReady"]'::jsonb),
    ('pacs_service','PACS Service','NestJS','["DICOM","PACS","Viewer Integration"]'::jsonb,'/api/v1/pacs','["DicomStudyReceived"]'::jsonb),
    ('pharmacy_service','Pharmacy Service','NestJS','["Sales","Inventory","Purchases","Returns","Vendors"]'::jsonb,'/api/v1/pharmacy','["PharmacySaleCreated"]'::jsonb),
    ('inventory_service','Inventory Service','NestJS','["Stock","Reorder","Warehouses","Transfers"]'::jsonb,'/api/v1/inventory','["StockLow"]'::jsonb),
    ('billing_service','Billing Service','NestJS','["Invoices","Payments","Refunds","Revenue"]'::jsonb,'/api/v1/billing','["InvoiceGenerated"]'::jsonb),
    ('finance_service','Finance Service','NestJS','["GL","AR","AP","GST","TDS","Assets","Budgets"]'::jsonb,'/api/v1/finance','["PaymentPosted"]'::jsonb),
    ('insurance_service','Insurance Service','NestJS','["Policies","Pre Authorization","Claims","Settlements"]'::jsonb,'/api/v1/insurance','["ClaimApproved"]'::jsonb),
    ('referral_service','Referral Service','NestJS','["Referrals","Commissions","Payments","Analytics"]'::jsonb,'/api/v1/referrals','["ReferralCreated"]'::jsonb),
    ('reporting_service','Reporting Service','NestJS','["500+ Reports","Scheduled Reports","PDF","Excel","CSV"]'::jsonb,'/api/v1/reports','["ReportGenerated"]'::jsonb),
    ('analytics_service','Analytics Service','NestJS','["BI","Warehouse","KPIs","Forecasting"]'::jsonb,'/api/v1/analytics','["KpiCalculated"]'::jsonb),
    ('ai_service','AI Service','NestJS','["Clinical Summary","IVF Summary","Revenue Analytics","Inventory Analytics"]'::jsonb,'/api/v1/ai','["AiReviewRequired"]'::jsonb),
    ('notification_service','Notification Service','NestJS','["WhatsApp","SMS","Email","Push"]'::jsonb,'/api/v1/notifications','["NotificationSent"]'::jsonb),
    ('integration_service','Integration Service','NestJS','["FHIR","HL7","DICOM","ABHA","Ayushman Bharat"]'::jsonb,'/api/v1/integrations','["IntegrationSynced"]'::jsonb)
)
INSERT INTO clinical_production_services (
  tenant_id, hospital_id, branch_id, clinic_id, service_key, service_name, service_type, responsibilities, technology_stack, api_prefix, event_topics, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, services.service_key, services.service_name, services.service_type, services.responsibilities,
  '["NestJS","TypeScript","Prisma","PostgreSQL","Redis","RabbitMQ"]'::jsonb,
  services.api_prefix, services.event_topics, scope.user_id, scope.user_id
FROM scope CROSS JOIN services
ON CONFLICT (tenant_id, hospital_id, branch_id, service_key)
DO UPDATE SET service_name = EXCLUDED.service_name, responsibilities = EXCLUDED.responsibilities, technology_stack = EXCLUDED.technology_stack, api_prefix = EXCLUDED.api_prefix, event_topics = EXCLUDED.event_topics, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
packages(package_key, package_name, folder_path, package_type, exports) AS (
  VALUES
    ('ui','UI Package','packages/ui','React Components','["Button","Card","Modal","Drawer","Table","Chart","Timeline"]'::jsonb),
    ('shared_types','Shared Types','packages/shared-types','TypeScript Types','["DTOs","Enums","OpenAPI Types"]'::jsonb),
    ('shared_utils','Shared Utils','packages/shared-utils','Utilities','["Date","Currency","Validation","Tenant Scope"]'::jsonb),
    ('shared_auth','Shared Auth','packages/shared-auth','Authentication','["JWT","MFA","RBAC","ABAC"]'::jsonb),
    ('shared_prisma','Shared Prisma','packages/shared-prisma','Database','["Prisma Client","Migrations","Seeders"]'::jsonb)
)
INSERT INTO clinical_production_packages (
  tenant_id, hospital_id, branch_id, clinic_id, package_key, package_name, folder_path, package_type, exports, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, packages.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN packages
ON CONFLICT (tenant_id, hospital_id, branch_id, package_key)
DO UPDATE SET package_name = EXCLUDED.package_name, folder_path = EXCLUDED.folder_path, package_type = EXCLUDED.package_type, exports = EXCLUDED.exports, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
infra(component_key, component_name, component_type, provider_targets, artifact_path, ports, persistence_policy) AS (
  VALUES
    ('docker','Docker','container','["Contabo","AWS","Azure","GCP","On Premise"]'::jsonb,'infrastructure/clinical-production/docker-compose.production.yml','[3000,5432,6379,5672,9000,9090,3001]'::jsonb,'{"volumes":true}'::jsonb),
    ('kubernetes','Kubernetes','orchestration','["AWS","Azure","GCP","On Premise"]'::jsonb,'infrastructure/clinical-production/kubernetes/tottech-clinical-production.yaml','[80,443]'::jsonb,'{"pvc":true}'::jsonb),
    ('terraform','Terraform','infrastructure_as_code','["AWS","Azure","GCP"]'::jsonb,'infrastructure/clinical-production/terraform','[]'::jsonb,'{"remoteState":true}'::jsonb),
    ('monitoring','Prometheus + Grafana','monitoring','["Contabo","AWS","Azure","GCP","On Premise"]'::jsonb,'infrastructure/clinical-production/monitoring/prometheus.yml','[9090,3001]'::jsonb,'{"retention":"30d"}'::jsonb),
    ('backups','Backup Automation','backup','["Contabo","AWS","Azure","GCP","On Premise"]'::jsonb,'infrastructure/clinical-production/backups/backup-clinical.sh','[]'::jsonb,'{"rpo":"15m","rto":"1h"}'::jsonb)
)
INSERT INTO clinical_production_infrastructure_components (
  tenant_id, hospital_id, branch_id, clinic_id, component_key, component_name, component_type, provider_targets, artifact_path, ports, persistence_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, infra.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN infra
ON CONFLICT (tenant_id, hospital_id, branch_id, component_key)
DO UPDATE SET component_name = EXCLUDED.component_name, component_type = EXCLUDED.component_type, provider_targets = EXCLUDED.provider_targets, artifact_path = EXCLUDED.artifact_path, ports = EXCLUDED.ports, persistence_policy = EXCLUDED.persistence_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
stack(stack_key, stack_area, technology_name, minimum_version, usage_policy) AS (
  VALUES
    ('frontend_next','Frontend','Next.js','Latest stable','Admin, portal, dashboard, and web shells.'),
    ('frontend_react','Frontend','React','Latest stable','Interactive UI layer.'),
    ('frontend_tailwind','Frontend','TailwindCSS','Latest stable','Design token implementation.'),
    ('frontend_shadcn','Frontend','ShadCN','Latest stable','Enterprise component primitives.'),
    ('frontend_framer','Frontend','Framer Motion','Latest stable','Controlled transitions and clinical-safe animation.'),
    ('frontend_query','Frontend','React Query','Latest stable','Server-state cache.'),
    ('frontend_forms','Frontend','React Hook Form + Zod','Latest stable','Validated forms.'),
    ('frontend_state','Frontend','Zustand','Latest stable','Local workspace state.'),
    ('backend_nest','Backend','NestJS','Latest stable','Microservice implementation.'),
    ('backend_prisma','Backend','Prisma','Latest stable','Schema, migrations, generated client.'),
    ('database_postgres','Database','PostgreSQL','17+','Primary relational store.'),
    ('cache_redis','Cache','Redis','7+','Sessions, permissions, schedules, reports, dashboards.'),
    ('event_rabbitmq','Event Bus','RabbitMQ','3+','Clinical and financial events.'),
    ('storage_s3','Object Storage','S3 compatible','Current','Reports, DICOM, documents, prescriptions, embryology images.'),
    ('testing_jest','Testing','Jest','Latest stable','Unit testing with 90% target coverage.'),
    ('testing_supertest','Testing','Supertest','Latest stable','API integration testing.'),
    ('testing_playwright','Testing','Playwright','Latest stable','End-to-end testing.'),
    ('testing_k6','Testing','k6','Latest stable','Performance testing.'),
    ('monitoring_prometheus','Monitoring','Prometheus','Latest stable','Metrics collection.'),
    ('monitoring_grafana','Monitoring','Grafana','Latest stable','Dashboards.'),
    ('logging_elk','Logging','ELK Stack','Latest stable','Application, audit, security, and API logs.')
)
INSERT INTO clinical_production_technology_stack (
  tenant_id, hospital_id, branch_id, clinic_id, stack_key, stack_area, technology_name, minimum_version, usage_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, stack.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN stack
ON CONFLICT (tenant_id, hospital_id, branch_id, stack_key)
DO UPDATE SET stack_area = EXCLUDED.stack_area, technology_name = EXCLUDED.technology_name, minimum_version = EXCLUDED.minimum_version, usage_policy = EXCLUDED.usage_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
rules(rule_key, rule_name, rule_category, requirement, applies_to, enforcement_level) AS (
  VALUES
    ('required_context_columns','Required Context Columns','Schema','Every operational table must include id, tenant_id, hospital_id, branch_id, created_by, updated_by, created_at, updated_at, deleted_at, and is_active.','["models","migrations"]'::jsonb,'REQUIRED'),
    ('tenant_indexes','Tenant Scope Indexes','Indexes','Every high-volume table must index tenant_id, hospital_id, branch_id, and primary workflow foreign keys.','["models","migrations"]'::jsonb,'REQUIRED'),
    ('relations_required','Relations Required','Relations','Codex must generate Prisma relations for patient, appointment, admission, invoice, claim, and audit ownership.','["models"]'::jsonb,'REQUIRED'),
    ('seeders_required','Seeders Required','Seeders','Codex must generate tenant-safe seeders for roles, permissions, menus, feature flags, templates, and master data.','["seeders"]'::jsonb,'REQUIRED'),
    ('soft_delete','Soft Delete','Schema','Operational delete actions must set deleted_at and is_active=false unless a regulated purge is approved.','["services","repositories"]'::jsonb,'REQUIRED'),
    ('audit_mutations','Audit Mutations','Audit','Create, update, delete, view, print, and export actions must be logged.','["services","controllers"]'::jsonb,'REQUIRED')
)
INSERT INTO clinical_production_prisma_rules (
  tenant_id, hospital_id, branch_id, clinic_id, rule_key, rule_name, rule_category, requirement, applies_to, enforcement_level, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, rules.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN rules
ON CONFLICT (tenant_id, hospital_id, branch_id, rule_key)
DO UPDATE SET rule_name = EXCLUDED.rule_name, rule_category = EXCLUDED.rule_category, requirement = EXCLUDED.requirement, applies_to = EXCLUDED.applies_to, enforcement_level = EXCLUDED.enforcement_level, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
contracts(service_key, method, path) AS (
  SELECT service_key, method, '/api/v1/' || replace(replace(service_key,'_service',''),'_','-') || suffix
  FROM clinical_production_services
  CROSS JOIN (VALUES ('GET'),('POST'),('PUT'),('DELETE')) AS methods(method)
  CROSS JOIN (VALUES (''),('/search'),('/reports'),('/export')) AS suffixes(suffix)
  WHERE tenant_id = (SELECT tenant_id FROM scope)
    AND hospital_id = (SELECT hospital_id FROM scope)
    AND branch_id = (SELECT branch_id FROM scope)
)
INSERT INTO clinical_production_api_contracts (
  tenant_id, hospital_id, branch_id, clinic_id, contract_key, service_key, method, path, response_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  contracts.service_key || '_' || lower(contracts.method) || '_' || md5(contracts.path),
  contracts.service_key,
  contracts.method,
  contracts.path,
  jsonb_build_object('success','boolean','data','object_or_array','audit_id','uuid','tenant_scope','required'),
  scope.user_id, scope.user_id
FROM scope CROSS JOIN contracts
ON CONFLICT (tenant_id, hospital_id, branch_id, contract_key)
DO UPDATE SET service_key = EXCLUDED.service_key, method = EXCLUDED.method, path = EXCLUDED.path, response_schema = EXCLUDED.response_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
events(event_key, event_name, routing_key, producer_service, consumer_services) AS (
  VALUES
    ('patient_created','PatientCreated','patient.created','patient_service','["notification_service","analytics_service","audit_service"]'::jsonb),
    ('appointment_booked','AppointmentBooked','appointment.booked','appointment_service','["notification_service","doctor_service","analytics_service"]'::jsonb),
    ('admission_created','AdmissionCreated','admission.created','ip_service','["billing_service","nursing_service","analytics_service"]'::jsonb),
    ('lab_result_ready','LabResultReady','lab.result.ready','lab_service','["notification_service","doctor_service","patient_service"]'::jsonb),
    ('embryo_created','EmbryoCreated','ivf.embryo.created','embryology_service','["ivf_service","ai_service","analytics_service"]'::jsonb),
    ('invoice_generated','InvoiceGenerated','invoice.generated','billing_service','["finance_service","notification_service","analytics_service"]'::jsonb),
    ('claim_approved','ClaimApproved','claim.approved','insurance_service','["finance_service","billing_service","notification_service"]'::jsonb)
)
INSERT INTO clinical_production_event_contracts (
  tenant_id, hospital_id, branch_id, clinic_id, event_key, event_name, routing_key, producer_service, consumer_services, payload_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, events.event_key, events.event_name, events.routing_key, events.producer_service, events.consumer_services,
  jsonb_build_object('tenant_id','integer','hospital_id','integer','branch_id','integer','event_id','uuid','occurred_at','timestamp','payload','object'),
  scope.user_id, scope.user_id
FROM scope CROSS JOIN events
ON CONFLICT (tenant_id, hospital_id, branch_id, event_key)
DO UPDATE SET event_name = EXCLUDED.event_name, routing_key = EXCLUDED.routing_key, producer_service = EXCLUDED.producer_service, consumer_services = EXCLUDED.consumer_services, payload_schema = EXCLUDED.payload_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
controls(control_key, control_name, control_area, requirement, validation_method, severity) AS (
  VALUES
    ('jwt_refresh_tokens','JWT + Refresh Tokens','Authentication','All sessions must use short-lived JWT and refresh tokens.','Automated auth integration tests.','CRITICAL'),
    ('mfa_required_admins','MFA For Privileged Users','Authentication','Hospital admins and super admins require MFA.','Role-based login test.','CRITICAL'),
    ('sso_ready','SSO Ready','Authentication','SSO must be supported for enterprise hospital chains.','OIDC configuration validation.','HIGH'),
    ('rbac_abac','RBAC + ABAC','Authorization','Access must enforce role, permission, tenant, hospital, branch, department, and patient assignment.','Permission matrix tests.','CRITICAL'),
    ('tenant_isolation','Tenant Isolation','Authorization','Every query must filter tenant_id, hospital_id, and branch_id.','Static query audit and integration tests.','CRITICAL'),
    ('aes256_at_rest','AES256 At Rest','Encryption','Sensitive data and storage must be encrypted at rest.','Storage/database encryption verification.','CRITICAL'),
    ('tls13_in_transit','TLS 1.3 In Transit','Encryption','Production traffic must terminate through TLS 1.3 capable ingress/proxy.','SSL scan.','HIGH'),
    ('audit_everything','Audit Framework','Audit','Login, logout, create, update, delete, view, print, and export must be audited.','Audit table assertions.','CRITICAL'),
    ('ai_safety','AI Safety','AI','TOTTECH AI must never diagnose, prescribe, or override clinicians and must display Clinical Review Required.','AI prompt safety tests.','CRITICAL')
)
INSERT INTO clinical_production_security_controls (
  tenant_id, hospital_id, branch_id, clinic_id, control_key, control_name, control_area, requirement, validation_method, severity, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, controls.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN controls
ON CONFLICT (tenant_id, hospital_id, branch_id, control_key)
DO UPDATE SET control_name = EXCLUDED.control_name, control_area = EXCLUDED.control_area, requirement = EXCLUDED.requirement, validation_method = EXCLUDED.validation_method, severity = EXCLUDED.severity, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
tests(test_key, test_name, test_type, framework, target_coverage, scope_json, command) AS (
  VALUES
    ('unit_tests','Unit Tests','Unit','Jest','90%','["services","repositories","utils","validators"]'::jsonb,'npm run test:unit'),
    ('integration_tests','Integration Tests','Integration','Supertest','API workflows','["auth","patients","appointments","billing","ivf","lab","claims"]'::jsonb,'npm run test:integration'),
    ('e2e_tests','End To End Tests','E2E','Playwright','Critical journeys','["login","registration","appointment","consultation","billing","claim","patient360"]'::jsonb,'npm run test:e2e'),
    ('performance_tests','Performance Tests','Performance','k6','10000 concurrent users','["login","patient_search","dashboard","billing","reports"]'::jsonb,'k6 run infrastructure/clinical-production/tests/load.js'),
    ('security_tests','Security Tests','Security','OWASP/ZAP','Critical controls','["rbac","tenant_isolation","mfa","audit","headers"]'::jsonb,'npm run test:security')
)
INSERT INTO clinical_production_testing_requirements (
  tenant_id, hospital_id, branch_id, clinic_id, test_key, test_name, test_type, framework, target_coverage, scope, command, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, tests.test_key, tests.test_name, tests.test_type, tests.framework, tests.target_coverage, tests.scope_json, tests.command, scope.user_id, scope.user_id
FROM scope CROSS JOIN tests
ON CONFLICT (tenant_id, hospital_id, branch_id, test_key)
DO UPDATE SET test_name = EXCLUDED.test_name, test_type = EXCLUDED.test_type, framework = EXCLUDED.framework, target_coverage = EXCLUDED.target_coverage, scope = EXCLUDED.scope, command = EXCLUDED.command, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
artifacts(artifact_key, artifact_name, artifact_type, artifact_path, validation_command, deployment_stage) AS (
  VALUES
    ('dockerfile','Clinical Production Dockerfile','Docker','infrastructure/clinical-production/Dockerfile.clinical','docker build -f infrastructure/clinical-production/Dockerfile.clinical -t tottech-clinical-services .','BUILD'),
    ('docker_compose','Clinical Production Compose','Docker Compose','infrastructure/clinical-production/docker-compose.production.yml','docker compose -f infrastructure/clinical-production/docker-compose.production.yml config','DEPLOY'),
    ('kubernetes_manifest','Kubernetes Production Manifest','Kubernetes','infrastructure/clinical-production/kubernetes/tottech-clinical-production.yaml','kubectl apply --dry-run=client -f infrastructure/clinical-production/kubernetes/tottech-clinical-production.yaml','DEPLOY'),
    ('prometheus_config','Prometheus Configuration','Monitoring','infrastructure/clinical-production/monitoring/prometheus.yml','promtool check config infrastructure/clinical-production/monitoring/prometheus.yml','MONITOR'),
    ('backup_script','Clinical Backup Script','Backup','infrastructure/clinical-production/backups/backup-clinical.sh','bash -n infrastructure/clinical-production/backups/backup-clinical.sh','BACKUP'),
    ('github_actions','Production CI/CD Workflow','CI/CD','.github/workflows/clinical-production-readiness.yml','actionlint .github/workflows/clinical-production-readiness.yml','CI')
)
INSERT INTO clinical_production_devops_artifacts (
  tenant_id, hospital_id, branch_id, clinic_id, artifact_key, artifact_name, artifact_type, artifact_path, validation_command, deployment_stage, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, artifacts.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN artifacts
ON CONFLICT (tenant_id, hospital_id, branch_id, artifact_key)
DO UPDATE SET artifact_name = EXCLUDED.artifact_name, artifact_type = EXCLUDED.artifact_type, artifact_path = EXCLUDED.artifact_path, validation_command = EXCLUDED.validation_command, deployment_stage = EXCLUDED.deployment_stage, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
rules(rule_key, rule_name, metric_name, threshold_expression, severity) AS (
  VALUES
    ('service_down','Service Down','up','up == 0 for 1m','CRITICAL'),
    ('database_down','Database Down','postgres_up','postgres_up == 0 for 1m','CRITICAL'),
    ('high_cpu','High CPU','process_cpu_seconds_total','cpu usage > 80% for 5m','HIGH'),
    ('high_memory','High Memory','process_resident_memory_bytes','memory usage > 85% for 5m','HIGH'),
    ('high_error_rate','High API Error Rate','http_requests_total','5xx rate > 2% for 5m','HIGH'),
    ('claim_failure','Claim Failure Spike','insurance_claim_failures_total','claim failures > 10 in 10m','HIGH'),
    ('backup_failure','Backup Failure','clinical_backup_success','backup success == 0','CRITICAL')
)
INSERT INTO clinical_production_monitoring_rules (
  tenant_id, hospital_id, branch_id, clinic_id, rule_key, rule_name, metric_name, threshold_expression, severity, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, rules.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN rules
ON CONFLICT (tenant_id, hospital_id, branch_id, rule_key)
DO UPDATE SET rule_name = EXCLUDED.rule_name, metric_name = EXCLUDED.metric_name, threshold_expression = EXCLUDED.threshold_expression, severity = EXCLUDED.severity, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
policies(policy_key, policy_name, backup_type, schedule_expression, retention_policy, recovery_target, verification_command) AS (
  VALUES
    ('db_incremental_15m','Database Incremental Backup','DATABASE_INCREMENTAL','*/15 * * * *','{"retention":"48h","archive":"daily"}'::jsonb,'{"rpo":"15 minutes","rto":"1 hour"}'::jsonb,'pg_restore --list latest.dump'),
    ('db_daily_full','Database Daily Full Backup','DATABASE_FULL','0 2 * * *','{"retention":"30d","weeklyArchive":"12w"}'::jsonb,'{"rpo":"24 hours","rto":"1 hour"}'::jsonb,'pg_restore --list daily.dump'),
    ('db_weekly_archive','Database Weekly Archive','DATABASE_ARCHIVE','0 3 * * 0','{"retention":"12 months"}'::jsonb,'{"rpo":"7 days","rto":"4 hours"}'::jsonb,'pg_restore --list weekly.dump'),
    ('object_daily','Object Storage Daily Backup','OBJECT_STORAGE','0 1 * * *','{"retention":"30d","geoReplication":true}'::jsonb,'{"rpo":"24 hours","rto":"2 hours"}'::jsonb,'mc ls backup/clinical'),
    ('config_daily','Configuration Daily Backup','CONFIGURATION','30 1 * * *','{"retention":"30d"}'::jsonb,'{"rpo":"24 hours","rto":"1 hour"}'::jsonb,'test -s config-backup.tar.gz')
)
INSERT INTO clinical_production_backup_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, policy_name, backup_type, schedule_expression, retention_policy, recovery_target, verification_command, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, policies.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN policies
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET policy_name = EXCLUDED.policy_name, backup_type = EXCLUDED.backup_type, schedule_expression = EXCLUDED.schedule_expression, retention_policy = EXCLUDED.retention_policy, recovery_target = EXCLUDED.recovery_target, verification_command = EXCLUDED.verification_command, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
checklist(checklist_key, checklist_item, checklist_category, acceptance_evidence) AS (
  VALUES
    ('all_modules_working','All modules working','Functional','Workflow tests pass for HMS, IVF, lab, radiology, pharmacy, finance, insurance, referral, analytics, AI, and mobile.'),
    ('all_apis_working','All APIs working','Functional','OpenAPI contracts generated and integration tests pass.'),
    ('all_reports_working','All reports working','Functional','Scheduled, PDF, Excel, CSV reports generated from tenant-scoped data.'),
    ('all_dashboards_working','All dashboards working','Functional','Executive, operations, clinical, finance, and AI dashboards use live data.'),
    ('rbac_working','RBAC working','Security','Permission matrix tests pass.'),
    ('mfa_working','MFA working','Security','Privileged login requires second factor.'),
    ('audit_logs_working','Audit logs working','Security','Create, update, delete, view, print, export, login, and logout events are recorded.'),
    ('tenant_isolation_working','Tenant isolation working','Security','Cross-tenant and cross-hospital tests are blocked.'),
    ('docker_working','Docker deployment working','Infrastructure','Docker Compose config validates and services pass health checks.'),
    ('kubernetes_working','Kubernetes working','Infrastructure','Kubernetes dry-run passes and readiness/liveness probes are configured.'),
    ('backup_working','Backup working','Infrastructure','Database and object backup verification succeeds.'),
    ('monitoring_working','Monitoring working','Infrastructure','Prometheus and Grafana dashboards receive metrics.'),
    ('unit_tests_pass','Unit tests pass','Testing','Jest unit tests meet 90% coverage.'),
    ('integration_tests_pass','Integration tests pass','Testing','Supertest API workflows pass.'),
    ('e2e_tests_pass','E2E tests pass','Testing','Playwright critical user journeys pass.'),
    ('load_testing_complete','Load testing complete','Go Live','k6 validates target workload.'),
    ('dr_verified','Disaster recovery verified','Go Live','RPO 15 minutes and RTO 1 hour restore drill succeeds.'),
    ('security_audit_complete','Security audit complete','Go Live','Security scan and penetration testing completed.'),
    ('uat_complete','User acceptance testing complete','Go Live','Hospital teams sign off on workflows.'),
    ('training_complete','Hospital training complete','Go Live','Training completion records are uploaded.'),
    ('migration_complete','Data migration complete','Go Live','Production migration reconciliation report is approved.')
)
INSERT INTO clinical_production_go_live_checklist (
  tenant_id, hospital_id, branch_id, clinic_id, checklist_key, checklist_item, checklist_category, acceptance_evidence, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, checklist.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN checklist
ON CONFLICT (tenant_id, hospital_id, branch_id, checklist_key)
DO UPDATE SET checklist_item = EXCLUDED.checklist_item, checklist_category = EXCLUDED.checklist_category, acceptance_evidence = EXCLUDED.acceptance_evidence, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
items(menu_key, label, path, module_name, permission_key, sort_order) AS (
  VALUES
    ('production_core','Production Readiness','/clinical-services/production','Clinical Production Readiness','clinical.production.read',1310),
    ('production_apps','Monorepo Apps','/clinical-services/production/apps','Clinical Production Readiness','clinical.production.apps',1320),
    ('production_services','Microservices','/clinical-services/production/services','Clinical Production Readiness','clinical.production.services',1330),
    ('production_infra','Infrastructure','/clinical-services/production/infrastructure','Clinical Production Readiness','clinical.production.infrastructure',1340),
    ('production_security','Security Controls','/clinical-services/production/security','Clinical Production Readiness','clinical.production.security',1350),
    ('production_testing','Testing Framework','/clinical-services/production/testing','Clinical Production Readiness','clinical.production.testing',1360),
    ('production_devops','DevOps Artifacts','/clinical-services/production/devops','Clinical Production Readiness','clinical.production.devops',1370),
    ('production_monitoring','Monitoring','/clinical-services/production/monitoring','Clinical Production Readiness','clinical.production.monitoring',1380),
    ('production_backups','Backup and DR','/clinical-services/production/backups','Clinical Production Readiness','clinical.production.backups',1390),
    ('production_go_live','Go-Live Checklist','/clinical-services/production/go-live','Clinical Production Readiness','clinical.production.go-live',1400)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.clinic_id, scope.hospital_id, scope.branch_id, items.menu_key, items.label, items.path, items.module_name, items.permission_key, items.sort_order,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET hospital_id = EXCLUDED.hospital_id, branch_id = EXCLUDED.branch_id, label = EXCLUDED.label, path = EXCLUDED.path, module_name = EXCLUDED.module_name, permission_key = EXCLUDED.permission_key, sort_order = EXCLUDED.sort_order, is_enabled = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_audit_events (
  tenant_id, hospital_id, branch_id, clinic_id, user_id, module_name, action, entity_type, summary, payload, created_at
)
SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id), COALESCE(cup.branch_id, c.branch_id), cup.clinic_id, cup.user_id,
  'Clinical Phase 12 Production Readiness',
  'PHASE_12_PRODUCTION_READINESS_INSTALLED',
  'clinical_production_readiness_pack',
  'Phase 12 Codex implementation pack, DevOps, testing, deployment, monitoring, backup, security, and go-live readiness metadata installed.',
  jsonb_build_object('apps',7,'services',25,'packages',5,'api_contracts','generated','rpo','15 minutes','rto','1 hour','target_hospitals',100,'target_branches',1000,'target_patients',10000000,'target_users',10000),
  CURRENT_TIMESTAMP
FROM clinical_user_profiles cup
JOIN clinics c ON c.id = cup.clinic_id
WHERE COALESCE(cup.is_deleted,false) = false
ORDER BY cup.id ASC
LIMIT 1;
