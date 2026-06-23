-- TOTTECH Clinical Services - Phase 14 Complete API Catalog + Event Catalog + Integration Contracts

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

CREATE TABLE IF NOT EXISTS clinical_api_catalog_gateway_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(180) NOT NULL,
  policy_name VARCHAR(255) NOT NULL,
  middleware_order INTEGER NOT NULL,
  middleware_name VARCHAR(180) NOT NULL,
  requirement TEXT NOT NULL,
  applies_to JSONB DEFAULT '["/api/v1"]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_rest_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  endpoint_key VARCHAR(260) NOT NULL,
  endpoint_name VARCHAR(255) NOT NULL,
  api_version VARCHAR(40) DEFAULT 'v1',
  method VARCHAR(20) NOT NULL,
  path VARCHAR(320) NOT NULL,
  api_group VARCHAR(120) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  auth_required BOOLEAN DEFAULT true,
  tenant_middleware BOOLEAN DEFAULT true,
  audit_middleware BOOLEAN DEFAULT true,
  rate_limiter BOOLEAN DEFAULT true,
  logging_middleware BOOLEAN DEFAULT true,
  request_schema JSONB DEFAULT '{}'::jsonb,
  response_schema JSONB DEFAULT '{}'::jsonb,
  permission_key VARCHAR(260),
  rate_limit_policy VARCHAR(180) DEFAULT 'default_100_per_minute',
  error_model VARCHAR(180) DEFAULT 'standard_error_response',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, endpoint_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_graphql_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  operation_key VARCHAR(180) NOT NULL,
  operation_name VARCHAR(255) NOT NULL,
  operation_type VARCHAR(40) NOT NULL,
  graph_area VARCHAR(120) NOT NULL,
  query_definition TEXT NOT NULL,
  response_schema JSONB DEFAULT '{}'::jsonb,
  auth_required BOOLEAN DEFAULT true,
  tenant_isolation_required BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, operation_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_websocket_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  channel_key VARCHAR(180) NOT NULL,
  channel_name VARCHAR(255) NOT NULL,
  namespace VARCHAR(180) NOT NULL,
  purpose TEXT NOT NULL,
  auth_required BOOLEAN DEFAULT true,
  tenant_isolation_required BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, channel_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_websocket_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  event_key VARCHAR(220) NOT NULL,
  channel_key VARCHAR(180) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  direction VARCHAR(40) DEFAULT 'SERVER_TO_CLIENT',
  payload_schema JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, event_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  event_key VARCHAR(180) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  event_category VARCHAR(120) NOT NULL,
  payload_schema JSONB DEFAULT '{}'::jsonb,
  producer_service VARCHAR(180),
  consumer_services JSONB DEFAULT '[]'::jsonb,
  audit_required BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, event_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_rabbitmq_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  topic_key VARCHAR(180) NOT NULL,
  exchange_name VARCHAR(180) DEFAULT 'clinical.events',
  routing_key VARCHAR(220) NOT NULL,
  event_key VARCHAR(180),
  producer_service VARCHAR(180),
  retry_policy JSONB DEFAULT '{"maxRetries":3,"backoff":"exponential"}'::jsonb,
  dead_letter_queue VARCHAR(220),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, topic_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  webhook_key VARCHAR(180) NOT NULL,
  webhook_name VARCHAR(255) NOT NULL,
  direction VARCHAR(40) NOT NULL,
  external_system VARCHAR(180) NOT NULL,
  method VARCHAR(20) DEFAULT 'POST',
  path VARCHAR(260) NOT NULL,
  auth_scheme VARCHAR(120) DEFAULT 'HMAC_SIGNATURE',
  request_schema JSONB DEFAULT '{}'::jsonb,
  response_schema JSONB DEFAULT '{}'::jsonb,
  retry_policy JSONB DEFAULT '{"maxRetries":3}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, webhook_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_error_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  error_key VARCHAR(180) NOT NULL,
  error_code VARCHAR(180) NOT NULL,
  http_status INTEGER NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  message_template TEXT NOT NULL,
  response_schema JSONB DEFAULT '{"success":false,"errorCode":"","message":""}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, error_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_versioning_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  version_key VARCHAR(120) NOT NULL,
  version_label VARCHAR(120) NOT NULL,
  base_path VARCHAR(120) NOT NULL,
  lifecycle_status VARCHAR(80) DEFAULT 'ACTIVE',
  compatibility_policy TEXT,
  deprecation_policy TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, version_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  policy_key VARCHAR(180) NOT NULL,
  policy_name VARCHAR(255) NOT NULL,
  requests_per_minute INTEGER NOT NULL,
  applies_to JSONB DEFAULT '[]'::jsonb,
  reason TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, policy_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_openapi_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  spec_key VARCHAR(180) NOT NULL,
  spec_name VARCHAR(255) NOT NULL,
  openapi_version VARCHAR(40) DEFAULT '3.1.0',
  output_format VARCHAR(40) NOT NULL,
  spec_path VARCHAR(260) NOT NULL,
  spec_payload JSONB DEFAULT '{}'::jsonb,
  generated_from VARCHAR(180) DEFAULT 'clinical_api_catalog_rest_endpoints',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, spec_key)
);

CREATE TABLE IF NOT EXISTS clinical_api_catalog_integration_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  contract_key VARCHAR(180) NOT NULL,
  integration_name VARCHAR(255) NOT NULL,
  integration_type VARCHAR(120) NOT NULL,
  external_system VARCHAR(180) NOT NULL,
  protocol VARCHAR(80) NOT NULL,
  auth_scheme VARCHAR(120) NOT NULL,
  endpoint_base VARCHAR(260),
  supported_events JSONB DEFAULT '[]'::jsonb,
  request_contract JSONB DEFAULT '{}'::jsonb,
  response_contract JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, contract_key)
);

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
policies(policy_key, policy_name, middleware_order, middleware_name, requirement) AS (
  VALUES
    ('auth_middleware','Auth Middleware',1,'auth','Validate JWT, refresh-token state, MFA status, and project context.'),
    ('tenant_middleware','Tenant Middleware',2,'tenant','Resolve and enforce tenant_id, hospital_id, branch_id, and clinic_id.'),
    ('audit_middleware','Audit Middleware',3,'audit','Record create, read, update, delete, print, export, login, and logout where required.'),
    ('rate_limiter','Rate Limiter',4,'rateLimit','Apply default and critical API rate limits.'),
    ('logging_middleware','Logging Middleware',5,'logging','Capture request id, user id, tenant context, latency, and errors.')
)
INSERT INTO clinical_api_catalog_gateway_policies (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, policy_name, middleware_order, middleware_name, requirement, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, policies.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN policies
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET policy_name = EXCLUDED.policy_name, middleware_order = EXCLUDED.middleware_order, middleware_name = EXCLUDED.middleware_name, requirement = EXCLUDED.requirement, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
explicit(endpoint_name, method, path, api_group, module_key, request_schema, response_schema, rate_policy) AS (
  VALUES
    ('Login','POST','/api/v1/auth/login','AUTH','auth','{"email":"user@hospital.com","password":"********"}'::jsonb,'{"accessToken":"","refreshToken":"","user":{}}'::jsonb,'critical_20_per_minute'),
    ('Refresh Token','POST','/api/v1/auth/refresh','AUTH','auth','{"refreshToken":""}'::jsonb,'{"accessToken":"","refreshToken":""}'::jsonb,'critical_20_per_minute'),
    ('MFA Verification','POST','/api/v1/auth/mfa','AUTH','auth','{"otp":"","challengeId":""}'::jsonb,'{"verified":true}'::jsonb,'critical_20_per_minute'),
    ('Logout','POST','/api/v1/auth/logout','AUTH','auth','{}'::jsonb,'{"success":true}'::jsonb,'default_100_per_minute'),
    ('Create Patient','POST','/api/v1/patients','PATIENT','patients','{"firstName":"","lastName":"","gender":"","dob":"","mobile":""}'::jsonb,'{"patientId":"","uhid":""}'::jsonb,'default_100_per_minute'),
    ('Search Patient','GET','/api/v1/patients/search','PATIENT','patients','{"filters":["UHID","ABHA","Mobile","Name"]}'::jsonb,'{"patients":[]}'::jsonb,'default_100_per_minute'),
    ('Patient 360','GET','/api/v1/patients/{id}/360','PATIENT','patient_360','{"id":""}'::jsonb,'{"profile":{},"appointments":[],"visits":[],"labResults":[],"billing":[]}'::jsonb,'default_100_per_minute'),
    ('Patient Timeline','GET','/api/v1/patients/{id}/timeline','PATIENT','patient_timeline','{"id":""}'::jsonb,'{"timeline":[]}'::jsonb,'default_100_per_minute'),
    ('Create Appointment','POST','/api/v1/appointments','APPOINTMENT','appointments','{"patientId":"","doctorId":"","slot":""}'::jsonb,'{"appointmentId":""}'::jsonb,'default_100_per_minute'),
    ('Reschedule Appointment','PATCH','/api/v1/appointments/{id}','APPOINTMENT','appointments','{"newSlot":""}'::jsonb,'{"appointmentId":"","status":"RESCHEDULED"}'::jsonb,'default_100_per_minute'),
    ('Cancel Appointment','DELETE','/api/v1/appointments/{id}','APPOINTMENT','appointments','{"reason":""}'::jsonb,'{"appointmentId":"","status":"CANCELLED"}'::jsonb,'default_100_per_minute'),
    ('Doctor Schedule','GET','/api/v1/doctors/{id}/schedule','APPOINTMENT','doctors','{"id":""}'::jsonb,'{"schedule":[]}'::jsonb,'default_100_per_minute'),
    ('OP Consultation','POST','/api/v1/op/consultations','OP','op_consultations','{"patientId":"","notes":""}'::jsonb,'{"consultationId":""}'::jsonb,'default_100_per_minute'),
    ('Prescription','POST','/api/v1/op/prescriptions','OP','prescriptions','{"patientId":"","medicines":[]}'::jsonb,'{"prescriptionId":""}'::jsonb,'default_100_per_minute'),
    ('Follow Up','POST','/api/v1/op/followups','OP','followups','{"patientId":"","date":""}'::jsonb,'{"followupId":""}'::jsonb,'default_100_per_minute'),
    ('Admission','POST','/api/v1/admissions','IP','admissions','{"patientId":"","wardId":"","bedId":""}'::jsonb,'{"admissionId":""}'::jsonb,'default_100_per_minute'),
    ('Transfer','POST','/api/v1/transfers','IP','transfers','{"admissionId":"","targetWardId":"","targetBedId":""}'::jsonb,'{"transferId":""}'::jsonb,'default_100_per_minute'),
    ('Discharge','POST','/api/v1/discharges','IP','discharges','{"admissionId":"","summary":""}'::jsonb,'{"dischargeId":""}'::jsonb,'default_100_per_minute'),
    ('ICU Dashboard','GET','/api/v1/icu/dashboard','ICU','icu','{}'::jsonb,'{"beds":[],"alerts":[]}'::jsonb,'default_100_per_minute'),
    ('ICU Vitals','POST','/api/v1/icu/vitals','ICU','icu','{"patientId":"","vitals":{}}'::jsonb,'{"vitalsId":""}'::jsonb,'critical_20_per_minute'),
    ('ICU Alerts','POST','/api/v1/icu/alerts','ICU','icu','{"patientId":"","alert":""}'::jsonb,'{"alertId":""}'::jsonb,'critical_20_per_minute'),
    ('OT Schedules','POST','/api/v1/ot/schedules','OT','ot','{"patientId":"","procedureId":"","slot":""}'::jsonb,'{"scheduleId":""}'::jsonb,'default_100_per_minute'),
    ('OT Procedures','POST','/api/v1/ot/procedures','OT','ot','{"procedureName":"","team":[]}'::jsonb,'{"procedureId":""}'::jsonb,'default_100_per_minute'),
    ('OT Notes','POST','/api/v1/ot/notes','OT','ot','{"scheduleId":"","notes":""}'::jsonb,'{"noteId":""}'::jsonb,'default_100_per_minute'),
    ('IVF Couple Registration','POST','/api/v1/ivf/couples','IVF','ivf_couples','{"primaryPatientId":"","partnerPatientId":""}'::jsonb,'{"coupleId":""}'::jsonb,'default_100_per_minute'),
    ('IVF Assessment','POST','/api/v1/ivf/assessments','IVF','ivf_assessments','{"coupleId":"","assessment":{}}'::jsonb,'{"assessmentId":""}'::jsonb,'default_100_per_minute'),
    ('IVF Cycle','POST','/api/v1/ivf/cycles','IVF','ivf_cycles','{"coupleId":"","protocol":""}'::jsonb,'{"cycleId":""}'::jsonb,'default_100_per_minute'),
    ('IVF Stimulation','POST','/api/v1/ivf/stimulation','IVF','ivf_stimulation','{"cycleId":"","dosePlan":{}}'::jsonb,'{"stimulationId":""}'::jsonb,'default_100_per_minute'),
    ('IVF Retrieval','POST','/api/v1/ivf/retrievals','IVF','ivf_retrievals','{"cycleId":"","oocytes":0}'::jsonb,'{"retrievalId":""}'::jsonb,'default_100_per_minute'),
    ('Embryology','POST','/api/v1/ivf/embryos','IVF','ivf_embryology','{"cycleId":"","grade":""}'::jsonb,'{"embryoId":""}'::jsonb,'default_100_per_minute'),
    ('Cryo Storage','POST','/api/v1/ivf/cryo','IVF','ivf_cryo','{"embryoId":"","tank":""}'::jsonb,'{"cryoId":""}'::jsonb,'default_100_per_minute'),
    ('IVF Transfer','POST','/api/v1/ivf/transfers','IVF','ivf_transfers','{"cycleId":"","embryoIds":[]}'::jsonb,'{"transferId":""}'::jsonb,'default_100_per_minute'),
    ('IVF Pregnancy','POST','/api/v1/ivf/pregnancies','IVF','ivf_pregnancies','{"cycleId":"","status":""}'::jsonb,'{"pregnancyId":""}'::jsonb,'default_100_per_minute'),
    ('Lab Order','POST','/api/v1/lab/orders','LAB','lab_orders','{"patientId":"","tests":[]}'::jsonb,'{"orderId":""}'::jsonb,'default_100_per_minute'),
    ('Sample Collection','POST','/api/v1/lab/samples','LAB','lab_samples','{"orderId":"","barcode":""}'::jsonb,'{"sampleId":""}'::jsonb,'default_100_per_minute'),
    ('Lab Results','POST','/api/v1/lab/results','LAB','lab_results','{"sampleId":"","results":[]}'::jsonb,'{"resultId":""}'::jsonb,'default_100_per_minute'),
    ('Lab Report','GET','/api/v1/lab/reports/{id}','LAB','lab_reports','{"id":""}'::jsonb,'{"report":{}}'::jsonb,'default_100_per_minute'),
    ('Radiology Order','POST','/api/v1/radiology/orders','RADIOLOGY','radiology_orders','{"patientId":"","studyType":""}'::jsonb,'{"orderId":""}'::jsonb,'default_100_per_minute'),
    ('Radiology Report','POST','/api/v1/radiology/reports','RADIOLOGY','radiology_reports','{"studyId":"","report":""}'::jsonb,'{"reportId":""}'::jsonb,'default_100_per_minute'),
    ('PACS Studies','GET','/api/v1/pacs/studies','RADIOLOGY','pacs','{}'::jsonb,'{"studies":[]}'::jsonb,'default_100_per_minute'),
    ('DICOM Images','GET','/api/v1/dicom/images','RADIOLOGY','dicom','{}'::jsonb,'{"images":[]}'::jsonb,'default_100_per_minute'),
    ('Pharmacy Sales','POST','/api/v1/pharmacy/sales','PHARMACY','pharmacy_sales','{"items":[],"payment":{}}'::jsonb,'{"saleId":""}'::jsonb,'default_100_per_minute'),
    ('Inventory','GET','/api/v1/inventory','PHARMACY','inventory','{}'::jsonb,'{"items":[]}'::jsonb,'default_100_per_minute'),
    ('Purchase Orders','POST','/api/v1/purchase-orders','PHARMACY','purchase_orders','{"vendorId":"","items":[]}'::jsonb,'{"purchaseOrderId":""}'::jsonb,'default_100_per_minute'),
    ('Invoice','POST','/api/v1/invoices','BILLING','invoices','{"patientId":"","items":[]}'::jsonb,'{"invoiceId":""}'::jsonb,'default_100_per_minute'),
    ('Payment','POST','/api/v1/payments','BILLING','payments','{"invoiceId":"","amount":0}'::jsonb,'{"paymentId":""}'::jsonb,'default_100_per_minute'),
    ('Refund','POST','/api/v1/refunds','BILLING','refunds','{"paymentId":"","amount":0,"reason":""}'::jsonb,'{"refundId":""}'::jsonb,'critical_20_per_minute'),
    ('Insurance Pre Auth','POST','/api/v1/insurance/preauth','INSURANCE','insurance','{"patientId":"","estimate":0}'::jsonb,'{"preauthId":""}'::jsonb,'default_100_per_minute'),
    ('Insurance Claim','POST','/api/v1/insurance/claims','INSURANCE','insurance','{"invoiceId":"","documents":[]}'::jsonb,'{"claimId":""}'::jsonb,'default_100_per_minute'),
    ('Insurance Settlement','POST','/api/v1/insurance/settlements','INSURANCE','insurance','{"claimId":"","amount":0}'::jsonb,'{"settlementId":""}'::jsonb,'default_100_per_minute'),
    ('Referral','POST','/api/v1/referrals','REFERRAL','referrals','{"patientId":"","partnerId":""}'::jsonb,'{"referralId":""}'::jsonb,'default_100_per_minute'),
    ('Commission','POST','/api/v1/commissions','REFERRAL','commissions','{"referralId":"","amount":0}'::jsonb,'{"commissionId":""}'::jsonb,'default_100_per_minute'),
    ('Commission Payout','POST','/api/v1/commissions/payouts','REFERRAL','commissions','{"commissionId":"","amount":0}'::jsonb,'{"payoutId":""}'::jsonb,'critical_20_per_minute'),
    ('Journals','POST','/api/v1/journals','FINANCE','journals','{"entries":[]}'::jsonb,'{"journalId":""}'::jsonb,'default_100_per_minute'),
    ('Budgets','POST','/api/v1/budgets','FINANCE','budgets','{"budget":{}}'::jsonb,'{"budgetId":""}'::jsonb,'default_100_per_minute'),
    ('Profit Loss','GET','/api/v1/profit-loss','FINANCE','profit_loss','{}'::jsonb,'{"profitLoss":{}}'::jsonb,'default_100_per_minute'),
    ('Balance Sheet','GET','/api/v1/balance-sheet','FINANCE','balance_sheet','{}'::jsonb,'{"balanceSheet":{}}'::jsonb,'default_100_per_minute'),
    ('Reports','GET','/api/v1/reports','REPORTS','reports','{}'::jsonb,'{"reports":[]}'::jsonb,'default_100_per_minute'),
    ('Generate Report','POST','/api/v1/reports/generate','REPORTS','reports','{"reportKey":"","filters":{}}'::jsonb,'{"jobId":""}'::jsonb,'critical_20_per_minute'),
    ('Schedule Report','POST','/api/v1/reports/schedule','REPORTS','reports','{"reportKey":"","schedule":{}}'::jsonb,'{"scheduleId":""}'::jsonb,'default_100_per_minute'),
    ('Analytics Revenue','GET','/api/v1/analytics/revenue','ANALYTICS','analytics','{}'::jsonb,'{"revenue":{}}'::jsonb,'default_100_per_minute'),
    ('Analytics IVF','GET','/api/v1/analytics/ivf','ANALYTICS','analytics','{}'::jsonb,'{"ivf":{}}'::jsonb,'default_100_per_minute'),
    ('Analytics Lab','GET','/api/v1/analytics/lab','ANALYTICS','analytics','{}'::jsonb,'{"lab":{}}'::jsonb,'default_100_per_minute'),
    ('Analytics Pharmacy','GET','/api/v1/analytics/pharmacy','ANALYTICS','analytics','{}'::jsonb,'{"pharmacy":{}}'::jsonb,'default_100_per_minute'),
    ('Mobile Dashboard','GET','/api/v1/mobile/dashboard','MOBILE','mobile','{}'::jsonb,'{"dashboard":{}}'::jsonb,'default_100_per_minute'),
    ('Mobile Reminders','POST','/api/v1/mobile/reminders','MOBILE','mobile','{"reminder":{}}'::jsonb,'{"reminderId":""}'::jsonb,'default_100_per_minute'),
    ('Mobile Telemedicine','POST','/api/v1/mobile/telemedicine','MOBILE','mobile','{"appointmentId":""}'::jsonb,'{"sessionId":""}'::jsonb,'default_100_per_minute'),
    ('AI Clinical Summary','POST','/api/v1/ai/clinical-summary','AI','ai','{"patientId":""}'::jsonb,'{"summary":"","clinicalReviewRequired":true}'::jsonb,'critical_20_per_minute'),
    ('AI IVF Summary','POST','/api/v1/ai/ivf-summary','AI','ai','{"cycleId":""}'::jsonb,'{"summary":"","clinicalReviewRequired":true}'::jsonb,'critical_20_per_minute'),
    ('AI Insights','POST','/api/v1/ai/insights','AI','ai','{"context":{}}'::jsonb,'{"insights":[],"clinicalReviewRequired":true}'::jsonb,'critical_20_per_minute')
),
generated_modules(module_key, module_name, api_group, base_path) AS (
  VALUES
    ('patients','Patients','PATIENT','patients'),('patient_documents','Patient Documents','PATIENT','patients/{id}/documents'),('patient_timeline','Patient Timeline','PATIENT','patients/{id}/timeline'),
    ('appointments','Appointments','APPOINTMENT','appointments'),('doctors','Doctors','DOCTOR','doctors'),('doctor_schedule','Doctor Schedule','DOCTOR','doctors/{id}/schedule'),
    ('op_consultations','OP Consultations','OP','op/consultations'),('op_prescriptions','OP Prescriptions','OP','op/prescriptions'),('op_followups','OP Followups','OP','op/followups'),
    ('admissions','Admissions','IP','admissions'),('transfers','Transfers','IP','transfers'),('discharges','Discharges','IP','discharges'),('ward_management','Ward Management','IP','wards'),
    ('icu_dashboard','ICU Dashboard','ICU','icu/dashboard'),('icu_vitals','ICU Vitals','ICU','icu/vitals'),('icu_alerts','ICU Alerts','ICU','icu/alerts'),
    ('ot_schedules','OT Schedules','OT','ot/schedules'),('ot_procedures','OT Procedures','OT','ot/procedures'),('ot_notes','OT Notes','OT','ot/notes'),
    ('ivf_couples','IVF Couples','IVF','ivf/couples'),('ivf_assessments','IVF Assessments','IVF','ivf/assessments'),('ivf_cycles','IVF Cycles','IVF','ivf/cycles'),('ivf_stimulation','IVF Stimulation','IVF','ivf/stimulation'),
    ('ivf_retrievals','IVF Retrievals','IVF','ivf/retrievals'),('ivf_embryos','IVF Embryos','IVF','ivf/embryos'),('ivf_cryo','IVF Cryo','IVF','ivf/cryo'),('ivf_transfers','IVF Transfers','IVF','ivf/transfers'),('ivf_pregnancies','IVF Pregnancies','IVF','ivf/pregnancies'),
    ('lab_orders','Lab Orders','LAB','lab/orders'),('lab_samples','Lab Samples','LAB','lab/samples'),('lab_results','Lab Results','LAB','lab/results'),('lab_reports','Lab Reports','LAB','lab/reports'),
    ('radiology_orders','Radiology Orders','RADIOLOGY','radiology/orders'),('radiology_reports','Radiology Reports','RADIOLOGY','radiology/reports'),('pacs_studies','PACS Studies','RADIOLOGY','pacs/studies'),('dicom_images','DICOM Images','RADIOLOGY','dicom/images'),
    ('pharmacy_sales','Pharmacy Sales','PHARMACY','pharmacy/sales'),('inventory','Inventory','PHARMACY','inventory'),('purchase_orders','Purchase Orders','PHARMACY','purchase-orders'),('pharmacy_returns','Pharmacy Returns','PHARMACY','pharmacy/returns'),
    ('invoices','Invoices','BILLING','invoices'),('payments','Payments','BILLING','payments'),('refunds','Refunds','BILLING','refunds'),('insurance_preauth','Insurance Preauth','INSURANCE','insurance/preauth'),('insurance_claims','Insurance Claims','INSURANCE','insurance/claims'),('insurance_settlements','Insurance Settlements','INSURANCE','insurance/settlements'),
    ('referrals','Referrals','REFERRAL','referrals'),('commissions','Commissions','REFERRAL','commissions'),('commission_payouts','Commission Payouts','REFERRAL','commissions/payouts'),
    ('journals','Journals','FINANCE','journals'),('budgets','Budgets','FINANCE','budgets'),('profit_loss','Profit Loss','FINANCE','profit-loss'),('balance_sheet','Balance Sheet','FINANCE','balance-sheet'),
    ('reports','Reports','REPORTS','reports'),('report_generation','Report Generation','REPORTS','reports/generate'),('report_schedules','Report Schedules','REPORTS','reports/schedule'),
    ('analytics_revenue','Analytics Revenue','ANALYTICS','analytics/revenue'),('analytics_ivf','Analytics IVF','ANALYTICS','analytics/ivf'),('analytics_lab','Analytics Lab','ANALYTICS','analytics/lab'),('analytics_pharmacy','Analytics Pharmacy','ANALYTICS','analytics/pharmacy'),
    ('mobile_dashboard','Mobile Dashboard','MOBILE','mobile/dashboard'),('mobile_reminders','Mobile Reminders','MOBILE','mobile/reminders'),('mobile_telemedicine','Mobile Telemedicine','MOBILE','mobile/telemedicine'),
    ('ai_clinical_summary','AI Clinical Summary','AI','ai/clinical-summary'),('ai_ivf_summary','AI IVF Summary','AI','ai/ivf-summary'),('ai_insights','AI Insights','AI','ai/insights'),
    ('rbac','RBAC','SECURITY','rbac'),('permissions','Permissions','SECURITY','permissions'),('access_logs','Access Logs','SECURITY','access-logs'),('approvals','Approvals','SECURITY','approvals'),('audit','Audit','SECURITY','audit')
),
methods(method) AS (VALUES ('GET'),('POST'),('PUT'),('PATCH'),('DELETE')),
variants(variant_key, suffix) AS (
  VALUES ('root',''),('id','/{id}'),('search','/search'),('reports','/reports')
),
generated AS (
  SELECT
    generated_modules.module_name || ' ' || methods.method || ' ' || variants.variant_key AS endpoint_name,
    methods.method,
    '/api/v1/' || generated_modules.base_path || variants.suffix AS path,
    generated_modules.api_group,
    generated_modules.module_key,
    jsonb_build_object('tenantId','required','hospitalId','required','branchId','required','payload','module-specific') AS request_schema,
    jsonb_build_object('success',true,'data','module-specific','auditId','uuid') AS response_schema,
    CASE WHEN generated_modules.api_group IN ('AUTH','AI','ICU','SECURITY') THEN 'critical_20_per_minute' ELSE 'default_100_per_minute' END AS rate_policy
  FROM generated_modules CROSS JOIN methods CROSS JOIN variants
),
combined AS (
  SELECT * FROM explicit
  UNION ALL
  SELECT * FROM generated
)
INSERT INTO clinical_api_catalog_rest_endpoints (
  tenant_id, hospital_id, branch_id, clinic_id, endpoint_key, endpoint_name, method, path, api_group, module_key,
  request_schema, response_schema, permission_key, rate_limit_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower(combined.method) || '_' || md5(combined.path || combined.endpoint_name),
  combined.endpoint_name,
  combined.method,
  combined.path,
  combined.api_group,
  combined.module_key,
  combined.request_schema,
  combined.response_schema,
  'clinical.api.' || combined.module_key || '.' || lower(combined.method),
  combined.rate_policy,
  scope.user_id, scope.user_id
FROM scope CROSS JOIN combined
ON CONFLICT (tenant_id, hospital_id, branch_id, endpoint_key)
DO UPDATE SET endpoint_name = EXCLUDED.endpoint_name, method = EXCLUDED.method, path = EXCLUDED.path, api_group = EXCLUDED.api_group, module_key = EXCLUDED.module_key, request_schema = EXCLUDED.request_schema, response_schema = EXCLUDED.response_schema, permission_key = EXCLUDED.permission_key, rate_limit_policy = EXCLUDED.rate_limit_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
ops(operation_key, operation_name, operation_type, graph_area, query_definition, response_schema) AS (
  VALUES
    ('patient360','Patient360','query','Patient360','query Patient360 { patient(id:"") { profile appointments visits labResults billing } }','{"patient":{}}'::jsonb),
    ('dashboard','Dashboard','query','Executive Dashboard','query Dashboard { revenue admissions claims }','{"revenue":0,"admissions":0,"claims":0}'::jsonb),
    ('analytics','Analytics','query','Analytics','query Analytics { revenue ivf lab pharmacy }','{"analytics":{}}'::jsonb),
    ('mobile_home','MobileHome','query','Mobile Apps','query MobileHome { reminders appointments bills reports }','{"mobile":{}}'::jsonb)
),
generated AS (
  SELECT
    lower(area.area_key || '_' || op.op_key || '_' || n)::varchar AS operation_key,
    area.area_name || ' ' || op.op_name || ' ' || n AS operation_name,
    op.operation_type,
    area.area_name AS graph_area,
    op.operation_type || ' ' || replace(area.area_name,' ','') || op.op_name || n || ' { id name status updatedAt }' AS query_definition,
    jsonb_build_object('data','typed response','tenantScoped',true) AS response_schema
  FROM (
    VALUES ('patient360','Patient360'),('executive_dashboard','Executive Dashboard'),('analytics','Analytics'),('mobile_apps','Mobile Apps'),('ivf','IVF'),('finance','Finance'),('clinical','Clinical'),('reports','Reports')
  ) AS area(area_key, area_name)
  CROSS JOIN (
    VALUES ('query','Query','query'),('summary','Summary','query'),('mutation','Mutation','mutation'),('search','Search','query'),('timeline','Timeline','query')
  ) AS op(op_key, op_name, operation_type)
  CROSS JOIN generate_series(1,5) n
)
INSERT INTO clinical_api_catalog_graphql_operations (
  tenant_id, hospital_id, branch_id, clinic_id, operation_key, operation_name, operation_type, graph_area, query_definition, response_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, ops.operation_key, ops.operation_name, ops.operation_type, ops.graph_area, ops.query_definition, ops.response_schema, scope.user_id, scope.user_id
FROM scope CROSS JOIN ops
ON CONFLICT (tenant_id, hospital_id, branch_id, operation_key)
DO UPDATE SET operation_name = EXCLUDED.operation_name, operation_type = EXCLUDED.operation_type, graph_area = EXCLUDED.graph_area, query_definition = EXCLUDED.query_definition, response_schema = EXCLUDED.response_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
)
INSERT INTO clinical_api_catalog_graphql_operations (
  tenant_id, hospital_id, branch_id, clinic_id, operation_key, operation_name, operation_type, graph_area, query_definition, response_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, generated.operation_key, generated.operation_name, generated.operation_type, generated.graph_area, generated.query_definition, generated.response_schema, scope.user_id, scope.user_id
FROM scope CROSS JOIN (
  SELECT
    lower(area.area_key || '_' || op.op_key || '_' || n)::varchar AS operation_key,
    area.area_name || ' ' || op.op_name || ' ' || n AS operation_name,
    op.operation_type,
    area.area_name AS graph_area,
    op.operation_type || ' ' || replace(area.area_name,' ','') || op.op_name || n || ' { id name status updatedAt }' AS query_definition,
    jsonb_build_object('data','typed response','tenantScoped',true) AS response_schema
  FROM (
    VALUES ('patient360','Patient360'),('executive_dashboard','Executive Dashboard'),('analytics','Analytics'),('mobile_apps','Mobile Apps'),('ivf','IVF'),('finance','Finance'),('clinical','Clinical'),('reports','Reports')
  ) AS area(area_key, area_name)
  CROSS JOIN (
    VALUES ('query','Query','query'),('summary','Summary','query'),('mutation','Mutation','mutation'),('search','Search','query'),('timeline','Timeline','query')
  ) AS op(op_key, op_name, operation_type)
  CROSS JOIN generate_series(1,5) n
) generated
ON CONFLICT (tenant_id, hospital_id, branch_id, operation_key)
DO UPDATE SET operation_name = EXCLUDED.operation_name, operation_type = EXCLUDED.operation_type, graph_area = EXCLUDED.graph_area, query_definition = EXCLUDED.query_definition, response_schema = EXCLUDED.response_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
channels(channel_key, channel_name, namespace, purpose) AS (
  VALUES
    ('notifications','Notifications','/ws/notifications','Appointment, claim, report, and general notifications.'),
    ('icu_monitoring','ICU Monitoring','/ws/icu','Live ICU vitals and critical alerts.'),
    ('lab_updates','Lab Updates','/ws/lab','Sample, result, and report release updates.'),
    ('telemedicine','Telemedicine','/ws/telemedicine','Telemedicine session signaling.'),
    ('chat','Chat','/ws/chat','Clinical and patient support chat.')
)
INSERT INTO clinical_api_catalog_websocket_channels (
  tenant_id, hospital_id, branch_id, clinic_id, channel_key, channel_name, namespace, purpose, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, channels.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN channels
ON CONFLICT (tenant_id, hospital_id, branch_id, channel_key)
DO UPDATE SET channel_name = EXCLUDED.channel_name, namespace = EXCLUDED.namespace, purpose = EXCLUDED.purpose, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
events(channel_key, event_name) AS (
  VALUES
    ('notifications','AppointmentBooked'),('notifications','LabResultReady'),('notifications','ClaimApproved'),('notifications','PatientAdmitted'),
    ('icu_monitoring','VitalsUpdated'),('icu_monitoring','CriticalAlertRaised'),('lab_updates','SampleCollected'),('lab_updates','ResultReleased'),
    ('telemedicine','SessionStarted'),('telemedicine','SessionEnded'),('chat','MessageCreated'),('chat','TypingIndicator')
)
INSERT INTO clinical_api_catalog_websocket_events (
  tenant_id, hospital_id, branch_id, clinic_id, event_key, channel_key, event_name, payload_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower(events.channel_key || '_' || events.event_name),
  events.channel_key,
  events.event_name,
  jsonb_build_object('tenantId','required','hospitalId','required','branchId','required','payload','object'),
  scope.user_id, scope.user_id
FROM scope CROSS JOIN events
ON CONFLICT (tenant_id, hospital_id, branch_id, event_key)
DO UPDATE SET channel_key = EXCLUDED.channel_key, event_name = EXCLUDED.event_name, payload_schema = EXCLUDED.payload_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
events(event_key, event_name, event_category, payload_schema, producer_service, consumer_services) AS (
  VALUES
    ('patient_created','PatientCreated','PATIENT','{"patientId":"","tenantId":""}'::jsonb,'patient_service','["notification_service","analytics_service"]'::jsonb),
    ('appointment_booked','AppointmentBooked','APPOINTMENT','{"appointmentId":"","patientId":""}'::jsonb,'appointment_service','["notification_service","doctor_service"]'::jsonb),
    ('lab_result_ready','LabResultReady','LAB','{"resultId":"","patientId":""}'::jsonb,'lab_service','["notification_service","doctor_service"]'::jsonb),
    ('embryo_created','EmbryoCreated','IVF','{"embryoId":"","cycleId":""}'::jsonb,'embryology_service','["ivf_service","analytics_service"]'::jsonb),
    ('claim_approved','ClaimApproved','INSURANCE','{"claimId":"","approvedAmount":0}'::jsonb,'insurance_service','["billing_service","finance_service"]'::jsonb)
),
generated AS (
  SELECT
    replace(topic,'.','_') AS event_key,
    initcap(replace(topic,'.',' ')) AS event_name,
    upper(split_part(topic,'.',1)) AS event_category,
    jsonb_build_object('tenantId','required','hospitalId','required','branchId','required','payload','object') AS payload_schema,
    split_part(topic,'.',1) || '_service' AS producer_service,
    jsonb_build_array('audit_service','analytics_service','notification_service') AS consumer_services
  FROM (
    VALUES ('patient.updated'),('admission.created'),('ivf.embryo.created'),('invoice.generated'),
      ('payment.received'),('refund.approved'),('pharmacy.sale.created'),('inventory.low_stock'),('radiology.report.ready'),('icu.alert.created'),('telemedicine.started'),('report.generated')
  ) AS topics(topic)
)
INSERT INTO clinical_api_catalog_events (
  tenant_id, hospital_id, branch_id, clinic_id, event_key, event_name, event_category, payload_schema, producer_service, consumer_services, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, event_key, event_name, event_category, payload_schema, producer_service, consumer_services, scope.user_id, scope.user_id
FROM scope CROSS JOIN (
  SELECT * FROM events
  UNION ALL
  SELECT * FROM generated
) combined
ON CONFLICT (tenant_id, hospital_id, branch_id, event_key)
DO UPDATE SET event_name = EXCLUDED.event_name, event_category = EXCLUDED.event_category, payload_schema = EXCLUDED.payload_schema, producer_service = EXCLUDED.producer_service, consumer_services = EXCLUDED.consumer_services, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
topics(routing_key) AS (
  VALUES ('patient.created'),('patient.updated'),('appointment.booked'),('admission.created'),('lab.result.ready'),('ivf.embryo.created'),('invoice.generated'),('claim.approved'),
    ('payment.received'),('refund.approved'),('pharmacy.sale.created'),('inventory.low_stock'),('radiology.report.ready'),('icu.alert.created'),('telemedicine.started'),('report.generated'),
    ('patient.deleted'),('appointment.cancelled'),('admission.transferred'),('discharge.created'),('sample.collected'),('result.critical'),('embryo.graded'),('cryo.stored'),
    ('claim.rejected'),('commission.generated'),('commission.paid'),('budget.approved'),('journal.posted'),('ai.review.required'),('security.break_glass.requested'),('export.created')
)
INSERT INTO clinical_api_catalog_rabbitmq_topics (
  tenant_id, hospital_id, branch_id, clinic_id, topic_key, routing_key, event_key, producer_service, dead_letter_queue, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  replace(topics.routing_key,'.','_'),
  topics.routing_key,
  replace(topics.routing_key,'.','_'),
  split_part(topics.routing_key,'.',1) || '_service',
  'dlq.' || topics.routing_key,
  scope.user_id, scope.user_id
FROM scope CROSS JOIN topics
ON CONFLICT (tenant_id, hospital_id, branch_id, topic_key)
DO UPDATE SET routing_key = EXCLUDED.routing_key, event_key = EXCLUDED.event_key, producer_service = EXCLUDED.producer_service, dead_letter_queue = EXCLUDED.dead_letter_queue, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
hooks(webhook_key, webhook_name, direction, external_system, path) AS (
  VALUES
    ('lab_webhook','External Lab Webhook','INBOUND','External Lab','/webhooks/lab'),
    ('insurance_webhook','Insurance Webhook','INBOUND','Insurance/TPA','/webhooks/insurance'),
    ('abha_webhook','ABHA Webhook','INBOUND','ABHA','/webhooks/abha'),
    ('payment_webhook','Payment Webhook','INBOUND','Payment Gateway','/webhooks/payment'),
    ('outbound_claim_status','Claim Status Webhook','OUTBOUND','Insurance/TPA','/external/claims/status'),
    ('outbound_report_ready','Report Ready Webhook','OUTBOUND','Partner Portal','/external/reports/ready')
)
INSERT INTO clinical_api_catalog_webhooks (
  tenant_id, hospital_id, branch_id, clinic_id, webhook_key, webhook_name, direction, external_system, path, request_schema, response_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, hooks.webhook_key, hooks.webhook_name, hooks.direction, hooks.external_system, hooks.path,
  jsonb_build_object('tenantId','required','event','required','payload','object','signature','required'),
  jsonb_build_object('success',true,'receivedAt','timestamp'),
  scope.user_id, scope.user_id
FROM scope CROSS JOIN hooks
ON CONFLICT (tenant_id, hospital_id, branch_id, webhook_key)
DO UPDATE SET webhook_name = EXCLUDED.webhook_name, direction = EXCLUDED.direction, external_system = EXCLUDED.external_system, path = EXCLUDED.path, request_schema = EXCLUDED.request_schema, response_schema = EXCLUDED.response_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key) AS (
  VALUES ('AUTH'),('PATIENT'),('APPOINTMENT'),('OP'),('IP'),('ICU'),('OT'),('IVF'),('LAB'),('RADIOLOGY'),('PHARMACY'),('BILLING'),('INSURANCE'),('REFERRAL'),('FINANCE'),('REPORTS'),('ANALYTICS'),('MOBILE'),('AI'),('SECURITY')
),
errors(error_suffix, http_status, message_template) AS (
  VALUES
    ('NOT_FOUND',404,'Resource not found'),
    ('VALIDATION_FAILED',400,'Validation failed'),
    ('UNAUTHORIZED',401,'Authentication required'),
    ('FORBIDDEN',403,'Permission denied'),
    ('RATE_LIMITED',429,'Rate limit exceeded'),
    ('TENANT_SCOPE_REQUIRED',400,'Tenant, hospital, and branch context required'),
    ('AUDIT_REQUIRED',400,'Audit reason is required'),
    ('APPROVAL_REQUIRED',409,'Approval workflow required')
)
INSERT INTO clinical_api_catalog_error_standards (
  tenant_id, hospital_id, branch_id, clinic_id, error_key, error_code, http_status, module_key, message_template, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower(modules.module_key || '_' || errors.error_suffix),
  modules.module_key || '_' || errors.error_suffix,
  errors.http_status,
  lower(modules.module_key),
  errors.message_template,
  scope.user_id, scope.user_id
FROM scope CROSS JOIN modules CROSS JOIN errors
ON CONFLICT (tenant_id, hospital_id, branch_id, error_key)
DO UPDATE SET error_code = EXCLUDED.error_code, http_status = EXCLUDED.http_status, module_key = EXCLUDED.module_key, message_template = EXCLUDED.message_template, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
)
INSERT INTO clinical_api_catalog_versioning_rules (
  tenant_id, hospital_id, branch_id, clinic_id, version_key, version_label, base_path, lifecycle_status, compatibility_policy, deprecation_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, v.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN (
  VALUES
    ('v1','Version 1','/api/v1','ACTIVE','Backward compatible changes only; additive fields allowed.','Deprecation requires 180-day notice.'),
    ('v2','Version 2','/api/v2','PLANNED','Breaking changes allowed with migration guide.','v1 sunset only after hospital migration approval.')
) AS v(version_key, version_label, base_path, lifecycle_status, compatibility_policy, deprecation_policy)
ON CONFLICT (tenant_id, hospital_id, branch_id, version_key)
DO UPDATE SET version_label = EXCLUDED.version_label, base_path = EXCLUDED.base_path, lifecycle_status = EXCLUDED.lifecycle_status, compatibility_policy = EXCLUDED.compatibility_policy, deprecation_policy = EXCLUDED.deprecation_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
)
INSERT INTO clinical_api_catalog_rate_limits (
  tenant_id, hospital_id, branch_id, clinic_id, policy_key, policy_name, requests_per_minute, applies_to, reason, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, limits.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN (
  VALUES
    ('default_100_per_minute','Default API Rate Limit',100,'["/api/v1"]'::jsonb,'Default platform policy.'),
    ('critical_20_per_minute','Critical API Rate Limit',20,'["/api/v1/auth","/api/v1/ai","/api/v1/icu","/api/v1/security"]'::jsonb,'Critical APIs have stricter limits.'),
    ('webhook_60_per_minute','Webhook Rate Limit',60,'["/webhooks"]'::jsonb,'External inbound webhook control.')
) AS limits(policy_key, policy_name, requests_per_minute, applies_to, reason)
ON CONFLICT (tenant_id, hospital_id, branch_id, policy_key)
DO UPDATE SET policy_name = EXCLUDED.policy_name, requests_per_minute = EXCLUDED.requests_per_minute, applies_to = EXCLUDED.applies_to, reason = EXCLUDED.reason, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
)
INSERT INTO clinical_api_catalog_openapi_specs (
  tenant_id, hospital_id, branch_id, clinic_id, spec_key, spec_name, output_format, spec_path, spec_payload, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, specs.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN (
  VALUES
    ('swagger_ui','Swagger UI','HTML','/api/v1/docs','{"openapi":"3.1.0","info":{"title":"TOTTECH Clinical Services API","version":"1.0.0"}}'::jsonb),
    ('openapi_json','OpenAPI JSON','JSON','/api/v1/openapi.json','{"openapi":"3.1.0","source":"clinical_api_catalog_rest_endpoints"}'::jsonb),
    ('openapi_yaml','OpenAPI YAML','YAML','/api/v1/openapi.yaml','{"openapi":"3.1.0","source":"clinical_api_catalog_rest_endpoints"}'::jsonb)
) AS specs(spec_key, spec_name, output_format, spec_path, spec_payload)
ON CONFLICT (tenant_id, hospital_id, branch_id, spec_key)
DO UPDATE SET spec_name = EXCLUDED.spec_name, output_format = EXCLUDED.output_format, spec_path = EXCLUDED.spec_path, spec_payload = EXCLUDED.spec_payload, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
contracts(contract_key, integration_name, integration_type, external_system, protocol, auth_scheme, endpoint_base, supported_events) AS (
  VALUES
    ('fhir_r4','FHIR R4 Integration','HEALTHCARE','FHIR R4','FHIR','OAuth2','/integrations/fhir/r4','["PatientCreated","LabResultReady"]'::jsonb),
    ('fhir_r5','FHIR R5 Integration','HEALTHCARE','FHIR R5','FHIR','OAuth2','/integrations/fhir/r5','["PatientCreated","LabResultReady"]'::jsonb),
    ('hl7','HL7 Integration','HEALTHCARE','HL7','HL7','Mutual TLS','/integrations/hl7','["AdmissionCreated","LabResultReady"]'::jsonb),
    ('dicom','DICOM Integration','IMAGING','DICOM/PACS','DICOM','Mutual TLS','/integrations/dicom','["DicomStudyReceived"]'::jsonb),
    ('pacs','PACS Integration','IMAGING','PACS','REST/DICOMweb','API Key','/integrations/pacs','["RadiologyReportReady"]'::jsonb),
    ('abha','ABHA Integration','GOVERNMENT','ABHA','REST','OAuth2','/integrations/abha','["PatientCreated"]'::jsonb),
    ('ayushman','Ayushman Bharat Integration','GOVERNMENT','Ayushman Bharat','REST','OAuth2','/integrations/ayushman','["ClaimApproved"]'::jsonb),
    ('external_lab','External Lab Integration','PARTNER','External Lab','REST/Webhook','HMAC','/webhooks/lab','["LabResultReady"]'::jsonb),
    ('insurance_tpa','Insurance/TPA Integration','PARTNER','Insurance/TPA','REST/Webhook','HMAC','/webhooks/insurance','["ClaimApproved"]'::jsonb),
    ('payment_gateway','Payment Gateway Integration','PAYMENT','Payment Gateway','REST/Webhook','HMAC','/webhooks/payment','["PaymentReceived","RefundApproved"]'::jsonb)
)
INSERT INTO clinical_api_catalog_integration_contracts (
  tenant_id, hospital_id, branch_id, clinic_id, contract_key, integration_name, integration_type, external_system, protocol, auth_scheme, endpoint_base, supported_events, request_contract, response_contract, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, contracts.*,
  jsonb_build_object('tenantId','required','payload','object','signature','required'),
  jsonb_build_object('success','boolean','externalReference','string'),
  scope.user_id, scope.user_id
FROM scope CROSS JOIN contracts
ON CONFLICT (tenant_id, hospital_id, branch_id, contract_key)
DO UPDATE SET integration_name = EXCLUDED.integration_name, integration_type = EXCLUDED.integration_type, external_system = EXCLUDED.external_system, protocol = EXCLUDED.protocol, auth_scheme = EXCLUDED.auth_scheme, endpoint_base = EXCLUDED.endpoint_base, supported_events = EXCLUDED.supported_events, request_contract = EXCLUDED.request_contract, response_contract = EXCLUDED.response_contract, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

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
    ('api_catalog_core','API Catalog','/clinical-services/api-catalog','Clinical API Catalog','clinical.api_catalog.read',1510),
    ('api_catalog_rest','REST APIs','/clinical-services/api-catalog/rest','Clinical API Catalog','clinical.api_catalog.rest',1520),
    ('api_catalog_graphql','GraphQL','/clinical-services/api-catalog/graphql','Clinical API Catalog','clinical.api_catalog.graphql',1530),
    ('api_catalog_websockets','WebSockets','/clinical-services/api-catalog/websockets','Clinical API Catalog','clinical.api_catalog.websockets',1540),
    ('api_catalog_events','Events','/clinical-services/api-catalog/events','Clinical API Catalog','clinical.api_catalog.events',1550),
    ('api_catalog_topics','RabbitMQ Topics','/clinical-services/api-catalog/rabbitmq','Clinical API Catalog','clinical.api_catalog.rabbitmq',1560),
    ('api_catalog_webhooks','Webhooks','/clinical-services/api-catalog/webhooks','Clinical API Catalog','clinical.api_catalog.webhooks',1570),
    ('api_catalog_errors','Error Standards','/clinical-services/api-catalog/errors','Clinical API Catalog','clinical.api_catalog.errors',1580),
    ('api_catalog_openapi','OpenAPI Specs','/clinical-services/api-catalog/openapi','Clinical API Catalog','clinical.api_catalog.openapi',1590),
    ('api_catalog_integrations','Integrations','/clinical-services/api-catalog/integrations','Clinical API Catalog','clinical.api_catalog.integrations',1600)
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
  'Clinical Phase 14 API Catalog',
  'PHASE_14_API_CATALOG_INSTALLED',
  'clinical_api_catalog_pack',
  'Phase 14 complete REST, GraphQL, WebSocket, event, RabbitMQ, webhook, error, versioning, rate-limit, OpenAPI, and integration contract catalog installed.',
  jsonb_build_object('rest_apis','1000+','graphql','enabled','websocket','enabled','openapi','3.1','gateway','/api/v1'),
  CURRENT_TIMESTAMP
FROM clinical_user_profiles cup
JOIN clinics c ON c.id = cup.clinic_id
WHERE COALESCE(cup.is_deleted,false) = false
ORDER BY cup.id ASC
LIMIT 1;
