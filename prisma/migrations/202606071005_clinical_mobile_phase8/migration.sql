-- TOTTECH Clinical Services - Phase 8 Mobile Apps + Patient Portal + Doctor Portal + Nurse App + Referral App + Telemedicine Platform

CREATE TABLE IF NOT EXISTS clinical_mobile_users (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id),
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  mobile_user_type VARCHAR(80) NOT NULL,
  mobile_number VARCHAR(40),
  email VARCHAR(255),
  abha_address VARCHAR(255),
  auth_methods JSONB DEFAULT '[]'::jsonb,
  onboarding_status VARCHAR(80) DEFAULT 'PENDING',
  last_login TIMESTAMP,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_devices (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  mobile_user_id INTEGER REFERENCES clinical_mobile_users(id),
  device_uid VARCHAR(255) NOT NULL,
  platform VARCHAR(80),
  device_name VARCHAR(255),
  app_name VARCHAR(160),
  app_version VARCHAR(80),
  push_token TEXT,
  device_binding_status VARCHAR(80) DEFAULT 'PENDING',
  last_seen TIMESTAMP,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, device_uid)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_auth_sessions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  mobile_user_id INTEGER REFERENCES clinical_mobile_users(id),
  device_id INTEGER REFERENCES clinical_mobile_devices(id),
  login_method VARCHAR(120),
  otp_reference VARCHAR(160),
  mfa_status VARCHAR(80) DEFAULT 'PENDING',
  token_refresh_status VARCHAR(80) DEFAULT 'ACTIVE',
  expires_at TIMESTAMP,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_biometric_credentials (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  mobile_user_id INTEGER REFERENCES clinical_mobile_users(id),
  device_id INTEGER REFERENCES clinical_mobile_devices(id),
  biometric_type VARCHAR(80),
  credential_reference VARCHAR(255),
  verification_status VARCHAR(80) DEFAULT 'PENDING',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_patient_profiles (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  uhid VARCHAR(120),
  abha_id VARCHAR(160),
  blood_group VARCHAR(40),
  emergency_contacts JSONB DEFAULT '[]'::jsonb,
  allergies JSONB DEFAULT '[]'::jsonb,
  conditions JSONB DEFAULT '[]'::jsonb,
  medications JSONB DEFAULT '[]'::jsonb,
  family_history JSONB DEFAULT '[]'::jsonb,
  lifestyle_history JSONB DEFAULT '{}'::jsonb,
  health_score NUMERIC(8,2),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_patient_dashboard_widgets (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  widget_key VARCHAR(120) NOT NULL,
  widget_title VARCHAR(255),
  widget_value TEXT,
  widget_payload JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_appointment_bookings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  booking_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  location VARCHAR(255),
  appointment_date DATE,
  appointment_time VARCHAR(40),
  visit_type VARCHAR(120),
  reason TEXT,
  insurance_reference VARCHAR(160),
  referral_reference VARCHAR(160),
  telemedicine_session_id INTEGER,
  booking_status VARCHAR(80) DEFAULT 'BOOKED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, booking_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_patient_360_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  event_type VARCHAR(160) NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_date DATE DEFAULT CURRENT_DATE,
  source_module VARCHAR(160),
  source_table VARCHAR(160),
  source_id INTEGER,
  payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_lab_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  report_title VARCHAR(255),
  report_date DATE DEFAULT CURRENT_DATE,
  pdf_url TEXT,
  critical_alert BOOLEAN DEFAULT false,
  report_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'READY',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_lab_trends (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  test_code VARCHAR(120),
  test_name VARCHAR(255),
  result_value NUMERIC(14,4),
  result_unit VARCHAR(80),
  reference_range VARCHAR(160),
  result_date DATE DEFAULT CURRENT_DATE,
  trend_status VARCHAR(80),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_radiology_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  modality VARCHAR(80),
  study_instance_uid VARCHAR(255),
  report_url TEXT,
  dicom_viewer_url TEXT,
  comparison_study_id INTEGER,
  report_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(80) DEFAULT 'READY',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_eprescriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  prescription_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  prescription_date DATE DEFAULT CURRENT_DATE,
  medicines JSONB DEFAULT '[]'::jsonb,
  instructions TEXT,
  e_signature_status VARCHAR(80) DEFAULT 'PENDING',
  drug_interaction_alerts JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, prescription_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_refill_requests (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  request_number VARCHAR(120) NOT NULL,
  prescription_id INTEGER REFERENCES clinical_mobile_eprescriptions(id),
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  medicine_payload JSONB DEFAULT '[]'::jsonb,
  approval_status VARCHAR(80) DEFAULT 'REQUESTED',
  payment_status VARCHAR(80) DEFAULT 'PENDING',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, request_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_medication_reminders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  reminder_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  medicine_name VARCHAR(255) NOT NULL,
  dose VARCHAR(120),
  reminder_time VARCHAR(40),
  frequency VARCHAR(120),
  start_date DATE,
  end_date DATE,
  channels JSONB DEFAULT '["PUSH"]'::jsonb,
  reminder_status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, reminder_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_online_payments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  payment_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  invoice_number VARCHAR(160),
  payment_method VARCHAR(120),
  amount NUMERIC(16,2) DEFAULT 0,
  gateway_reference VARCHAR(255),
  payment_status VARCHAR(80) DEFAULT 'PENDING',
  receipt_url TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, payment_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_patient_documents (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  document_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  document_type VARCHAR(160) NOT NULL,
  document_title VARCHAR(255),
  file_url TEXT,
  source_module VARCHAR(160),
  vault_status VARCHAR(80) DEFAULT 'STORED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, document_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_health_tracker (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  tracker_date DATE DEFAULT CURRENT_DATE,
  weight NUMERIC(10,2),
  bp_systolic INTEGER,
  bp_diastolic INTEGER,
  blood_sugar NUMERIC(10,2),
  heart_rate INTEGER,
  temperature NUMERIC(10,2),
  spo2 NUMERIC(10,2),
  source VARCHAR(120) DEFAULT 'USER',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_wearable_data (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  device_provider VARCHAR(120),
  metric_type VARCHAR(120),
  metric_value NUMERIC(14,4),
  metric_unit VARCHAR(80),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_ivf_dashboards (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  cycle_number VARCHAR(120),
  current_stage VARCHAR(160),
  doctor_id INTEGER REFERENCES doctors(id),
  embryologist VARCHAR(255),
  progress_percent NUMERIC(8,2),
  next_action VARCHAR(255),
  timeline_payload JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_ivf_medication_tracking (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  cycle_number VARCHAR(120),
  medicine_name VARCHAR(255),
  dose VARCHAR(120),
  start_date DATE,
  end_date DATE,
  compliance_status VARCHAR(80) DEFAULT 'PENDING',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_doctor_consultations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  consultation_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  chief_complaint TEXT,
  history TEXT,
  diagnosis TEXT,
  prescription_payload JSONB DEFAULT '[]'::jsonb,
  orders_payload JSONB DEFAULT '[]'::jsonb,
  follow_up_date DATE,
  ai_notes TEXT,
  e_signature_status VARCHAR(80) DEFAULT 'PENDING',
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, consultation_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_telemedicine_sessions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  session_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  session_type VARCHAR(80) DEFAULT 'VIDEO',
  scheduled_at TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INTEGER DEFAULT 0,
  meeting_url TEXT,
  recording_url TEXT,
  session_status VARCHAR(80) DEFAULT 'SCHEDULED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, session_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_video_recordings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  telemedicine_session_id INTEGER REFERENCES clinical_mobile_telemedicine_sessions(id),
  recording_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  storage_status VARCHAR(80) DEFAULT 'STORED',
  consent_status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_chat_threads (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  thread_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  thread_type VARCHAR(120) DEFAULT 'TELEMEDICINE',
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, thread_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_chat_messages (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  thread_id INTEGER REFERENCES clinical_mobile_chat_threads(id),
  sender_type VARCHAR(80),
  sender_id INTEGER,
  message_type VARCHAR(80) DEFAULT 'TEXT',
  message_text TEXT,
  attachment_url TEXT,
  read_status VARCHAR(80) DEFAULT 'UNREAD',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_nurse_tasks (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  task_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  nurse_user_id INTEGER REFERENCES users(id),
  task_type VARCHAR(120),
  task_title VARCHAR(255),
  due_at TIMESTAMP,
  task_status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, task_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_medication_administration (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  administration_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  nurse_user_id INTEGER REFERENCES users(id),
  medicine_name VARCHAR(255),
  dose VARCHAR(120),
  route VARCHAR(120),
  administered_at TIMESTAMP,
  administration_status VARCHAR(80) DEFAULT 'PENDING',
  remarks TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, administration_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_vitals_entries (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  nurse_user_id INTEGER REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  temperature NUMERIC(10,2),
  pulse INTEGER,
  bp_systolic INTEGER,
  bp_diastolic INTEGER,
  respiration INTEGER,
  spo2 NUMERIC(10,2),
  blood_sugar NUMERIC(10,2),
  status VARCHAR(80) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_referral_leads (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  lead_number VARCHAR(120) NOT NULL,
  lead_name VARCHAR(255) NOT NULL,
  phone VARCHAR(40),
  source VARCHAR(160),
  assigned_to INTEGER,
  lead_status VARCHAR(80) DEFAULT 'NEW',
  patient_id INTEGER REFERENCES patients(id),
  revenue_generated NUMERIC(16,2) DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, lead_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_referral_commissions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  lead_id INTEGER REFERENCES clinical_mobile_referral_leads(id),
  referral_name VARCHAR(255),
  referral_revenue NUMERIC(16,2) DEFAULT 0,
  commission_amount NUMERIC(16,2) DEFAULT 0,
  pending_approval NUMERIC(16,2) DEFAULT 0,
  paid_amount NUMERIC(16,2) DEFAULT 0,
  commission_status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_corporate_employees (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  employee_code VARCHAR(120) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  corporate_name VARCHAR(255),
  department VARCHAR(160),
  insurance_reference VARCHAR(160),
  eligibility_payload JSONB DEFAULT '{}'::jsonb,
  patient_id INTEGER REFERENCES patients(id),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, employee_code)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_executive_kpis (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dashboard_type VARCHAR(80) NOT NULL,
  kpi_key VARCHAR(160) NOT NULL,
  kpi_label VARCHAR(255),
  kpi_value NUMERIC(16,2) DEFAULT 0,
  kpi_payload JSONB DEFAULT '{}'::jsonb,
  snapshot_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_push_notifications (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  notification_number VARCHAR(120) NOT NULL,
  mobile_user_id INTEGER REFERENCES clinical_mobile_users(id),
  patient_id INTEGER REFERENCES patients(id),
  notification_type VARCHAR(120),
  title VARCHAR(255),
  message TEXT,
  channel VARCHAR(80) DEFAULT 'PUSH',
  delivery_status VARCHAR(80) DEFAULT 'PENDING',
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, notification_number)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_offline_sync_queue (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  mobile_user_id INTEGER REFERENCES clinical_mobile_users(id),
  device_id INTEGER REFERENCES clinical_mobile_devices(id),
  app_name VARCHAR(160),
  sync_entity VARCHAR(160),
  sync_action VARCHAR(80),
  payload JSONB DEFAULT '{}'::jsonb,
  sync_status VARCHAR(80) DEFAULT 'PENDING',
  conflict_payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_ai_assistant_logs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  mobile_user_id INTEGER REFERENCES clinical_mobile_users(id),
  assistant_mode VARCHAR(120),
  prompt TEXT,
  answer TEXT,
  safety_notice TEXT DEFAULT 'Information only. Contact your doctor for medical advice.',
  source_payload JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ANSWERED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_mobile_timeline (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  mobile_user_id INTEGER REFERENCES clinical_mobile_users(id),
  event_type VARCHAR(160) NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_summary TEXT,
  source_table VARCHAR(160),
  source_id INTEGER,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'clinical_mobile_patient_app_usage','clinical_mobile_doctor_app_usage','clinical_mobile_nurse_app_usage',
    'clinical_mobile_referral_app_usage','clinical_mobile_executive_app_usage','clinical_mobile_kiosk_sessions',
    'clinical_mobile_smart_tv_dashboards','clinical_mobile_tablet_sessions','clinical_mobile_google_login_links',
    'clinical_mobile_apple_login_links','clinical_mobile_abha_login_links','clinical_mobile_otp_requests',
    'clinical_mobile_token_refresh_logs','clinical_mobile_mfa_challenges','clinical_mobile_face_id_logs',
    'clinical_mobile_fingerprint_logs','clinical_mobile_patient_insurance_status','clinical_mobile_ivf_appointments',
    'clinical_mobile_ivf_documents','clinical_mobile_ivf_timeline_events','clinical_mobile_radiology_viewer_sessions',
    'clinical_mobile_dicom_viewer_sessions','clinical_mobile_document_shares','clinical_mobile_invoice_shares',
    'clinical_mobile_payment_gateway_logs','clinical_mobile_medication_compliance','clinical_mobile_reminder_delivery_logs',
    'clinical_mobile_apple_health_imports','clinical_mobile_google_fit_imports','clinical_mobile_fitbit_imports',
    'clinical_mobile_garmin_imports','clinical_mobile_doctor_dashboard_snapshots','clinical_mobile_doctor_critical_alerts',
    'clinical_mobile_voice_dictation_logs','clinical_mobile_speech_to_text_jobs','clinical_mobile_clinical_template_usage',
    'clinical_mobile_ai_note_generations','clinical_mobile_prescription_esignatures','clinical_mobile_drug_interaction_checks',
    'clinical_mobile_telemedicine_chat_files','clinical_mobile_telemedicine_screen_shares','clinical_mobile_telemedicine_call_events',
    'clinical_mobile_telemedicine_quality_metrics','clinical_mobile_nurse_dashboard_snapshots','clinical_mobile_nurse_procedure_tasks',
    'clinical_mobile_nurse_vital_alerts','clinical_mobile_referral_dashboard_snapshots','clinical_mobile_referral_performance_snapshots',
    'clinical_mobile_corporate_dashboard_snapshots','clinical_mobile_corporate_claims','clinical_mobile_corporate_health_checkups',
    'clinical_mobile_ceo_dashboard_snapshots','clinical_mobile_cfo_dashboard_snapshots','clinical_mobile_push_templates',
    'clinical_mobile_push_delivery_receipts','clinical_mobile_sms_delivery_receipts','clinical_mobile_whatsapp_delivery_receipts',
    'clinical_mobile_offline_conflicts','clinical_mobile_offline_resolution_logs','clinical_mobile_mobile_reports',
    'clinical_mobile_app_release_channels','clinical_mobile_feature_flags','clinical_mobile_device_security_events',
    'clinical_mobile_mobile_audit_reviews','clinical_mobile_patient_feedback','clinical_mobile_app_crash_logs',
    'clinical_mobile_performance_metrics','clinical_mobile_patient_engagement_scores','clinical_mobile_referral_roi_snapshots',
    'clinical_mobile_telemedicine_usage_snapshots','clinical_mobile_medication_compliance_snapshots','clinical_mobile_ai_safety_reviews'
  ]
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL,
        hospital_id INTEGER NOT NULL,
        branch_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        patient_id INTEGER REFERENCES patients(id),
        doctor_id INTEGER REFERENCES doctors(id),
        mobile_user_id INTEGER REFERENCES clinical_mobile_users(id),
        device_id INTEGER REFERENCES clinical_mobile_devices(id),
        record_number VARCHAR(160),
        record_date DATE DEFAULT CURRENT_DATE,
        title VARCHAR(255),
        status VARCHAR(80) DEFAULT ''ACTIVE'',
        payload JSONB DEFAULT ''{}''::jsonb,
        created_by INTEGER,
        updated_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT false
      )',
      tbl
    );
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS clinical_mobile_screen_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  screen_key VARCHAR(180) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  app_name VARCHAR(160),
  route_path VARCHAR(255),
  section_definitions JSONB DEFAULT '[]'::jsonb,
  field_definitions JSONB DEFAULT '[]'::jsonb,
  workflow_definitions JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, screen_key)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_api_endpoint_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  endpoint_key VARCHAR(180) NOT NULL,
  method VARCHAR(20) NOT NULL,
  path VARCHAR(255) NOT NULL,
  permission_key VARCHAR(180),
  request_schema JSONB DEFAULT '{}'::jsonb,
  response_schema JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, endpoint_key)
);

CREATE TABLE IF NOT EXISTS clinical_mobile_report_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  report_key VARCHAR(180) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  report_category VARCHAR(120),
  output_formats JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  metric_definitions JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, report_key)
);

CREATE INDEX IF NOT EXISTS idx_clinical_mobile_users_scope ON clinical_mobile_users(tenant_id, hospital_id, branch_id, mobile_user_type, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_mobile_devices_scope ON clinical_mobile_devices(tenant_id, hospital_id, branch_id, mobile_user_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_mobile_bookings_scope ON clinical_mobile_appointment_bookings(tenant_id, hospital_id, branch_id, patient_id, appointment_date, booking_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_mobile_telemedicine_scope ON clinical_mobile_telemedicine_sessions(tenant_id, hospital_id, branch_id, patient_id, doctor_id, session_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_mobile_notifications_scope ON clinical_mobile_push_notifications(tenant_id, hospital_id, branch_id, delivery_status, scheduled_at, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_mobile_timeline_scope ON clinical_mobile_timeline(tenant_id, hospital_id, branch_id, patient_id, created_at);

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
items(menu_key, label, path, module_name, permission_key, sort_order) AS (
  VALUES
    ('mobile_core','Mobile Command Center','/clinical-services/mobile','mobile','clinical.mobile.read',310),
    ('mobile_users','Mobile Users','/clinical-services/mobile/mobile-users','mobile','clinical.mobile.users.read',311),
    ('mobile_devices','Devices','/clinical-services/mobile/devices','mobile','clinical.mobile.devices.read',312),
    ('mobile_patient_app','Patient App','/clinical-services/mobile/patient-dashboard','mobile','clinical.mobile.patient.read',313),
    ('mobile_patient_360','Patient 360','/clinical-services/mobile/patient-360','mobile','clinical.mobile.patient360.read',314),
    ('mobile_lab_reports','Lab Reports','/clinical-services/mobile/lab-reports','mobile','clinical.mobile.lab.read',315),
    ('mobile_radiology','Radiology Reports','/clinical-services/mobile/radiology-reports','mobile','clinical.mobile.radiology.read',316),
    ('mobile_eprescriptions','E-Prescriptions','/clinical-services/mobile/eprescriptions','mobile','clinical.mobile.prescriptions.read',317),
    ('mobile_med_reminders','Medication Reminders','/clinical-services/mobile/medication-reminders','mobile','clinical.mobile.reminders.read',318),
    ('mobile_payments','Online Payments','/clinical-services/mobile/online-payments','mobile','clinical.mobile.payments.read',319),
    ('mobile_documents','Document Vault','/clinical-services/mobile/documents','mobile','clinical.mobile.documents.read',320),
    ('mobile_health_tracker','Health Tracker','/clinical-services/mobile/health-tracker','mobile','clinical.mobile.health.read',321),
    ('mobile_ivf','IVF Patient App','/clinical-services/mobile/ivf-dashboard','mobile','clinical.mobile.ivf.read',322),
    ('mobile_doctor','Doctor App','/clinical-services/mobile/doctor-consultations','mobile','clinical.mobile.doctor.read',323),
    ('mobile_telemedicine','Telemedicine','/clinical-services/mobile/telemedicine','mobile','clinical.mobile.telemedicine.read',324),
    ('mobile_nurse','Nurse App','/clinical-services/mobile/nurse-tasks','mobile','clinical.mobile.nurse.read',325),
    ('mobile_referral','Referral App','/clinical-services/mobile/referral-leads','mobile','clinical.mobile.referral.read',326),
    ('mobile_corporate','Corporate Portal','/clinical-services/mobile/corporate-employees','mobile','clinical.mobile.corporate.read',327),
    ('mobile_executive','Executive App','/clinical-services/mobile/executive-kpis','mobile','clinical.mobile.executive.read',328),
    ('mobile_notifications','Push Notifications','/clinical-services/mobile/notifications','mobile','clinical.mobile.notifications.read',329),
    ('mobile_offline','Offline Sync','/clinical-services/mobile/offline-sync','mobile','clinical.mobile.offline.read',330),
    ('mobile_ai','AI Patient Assistant','/clinical-services/mobile/ai-assistant','mobile','clinical.mobile.ai.read',331)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.clinic_id,
  scope.hospital_id,
  scope.branch_id,
  items.menu_key,
  items.label,
  items.path,
  items.module_name,
  items.permission_key,
  items.sort_order,
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET
  hospital_id = EXCLUDED.hospital_id,
  branch_id = EXCLUDED.branch_id,
  label = EXCLUDED.label,
  path = EXCLUDED.path,
  module_name = EXCLUDED.module_name,
  permission_key = EXCLUDED.permission_key,
  sort_order = EXCLUDED.sort_order,
  is_enabled = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, app_name, route_path, screen_count, api_count, report_count, category) AS (
  VALUES
    ('dashboard','Mobile Command Center','Executive App','/clinical-services/mobile',5,9,4,'Dashboard'),
    ('mobile-users','Mobile Users','Platform','/clinical-services/mobile/mobile-users',5,9,4,'Security'),
    ('devices','Device Binding','Platform','/clinical-services/mobile/devices',5,9,4,'Security'),
    ('auth-sessions','Mobile Auth Sessions','Platform','/clinical-services/mobile/auth-sessions',5,9,4,'Security'),
    ('patient-dashboard','Patient Dashboard','Patient App','/clinical-services/mobile/patient-dashboard',5,9,4,'Patient'),
    ('patient-profile','Patient Profile','Patient App','/clinical-services/mobile/patient-profile',5,9,4,'Patient'),
    ('patient-360','Patient 360','Patient App','/clinical-services/mobile/patient-360',5,9,4,'Patient'),
    ('appointments','Appointment Booking','Patient App','/clinical-services/mobile/appointments',5,9,4,'Patient'),
    ('lab-reports','Lab Reports','Patient App','/clinical-services/mobile/lab-reports',5,9,4,'Patient'),
    ('lab-trends','Lab Trends','Patient App','/clinical-services/mobile/lab-trends',5,9,4,'Patient'),
    ('radiology-reports','Radiology Reports','Patient App','/clinical-services/mobile/radiology-reports',5,9,4,'Patient'),
    ('eprescriptions','E-Prescriptions','Patient App','/clinical-services/mobile/eprescriptions',5,9,4,'Patient'),
    ('refill-requests','Refill Requests','Patient App','/clinical-services/mobile/refill-requests',5,9,4,'Patient'),
    ('medication-reminders','Medication Reminders','Patient App','/clinical-services/mobile/medication-reminders',5,9,4,'Patient'),
    ('online-payments','Online Payments','Patient App','/clinical-services/mobile/online-payments',5,9,4,'Payments'),
    ('documents','Document Vault','Patient App','/clinical-services/mobile/documents',5,9,4,'Documents'),
    ('health-tracker','Health Tracker','Patient App','/clinical-services/mobile/health-tracker',5,9,4,'Patient'),
    ('wearables','Wearable Data','Patient App','/clinical-services/mobile/wearables',5,9,4,'Patient'),
    ('ivf-dashboard','IVF Dashboard','IVF Patient App','/clinical-services/mobile/ivf-dashboard',5,9,4,'IVF'),
    ('ivf-medications','IVF Medication Tracker','IVF Patient App','/clinical-services/mobile/ivf-medications',5,9,4,'IVF'),
    ('doctor-consultations','Doctor Consultation','Doctor App','/clinical-services/mobile/doctor-consultations',5,9,4,'Doctor'),
    ('telemedicine','Telemedicine Sessions','Telemedicine App','/clinical-services/mobile/telemedicine',5,9,4,'Telemedicine'),
    ('chat','Chat Platform','Telemedicine App','/clinical-services/mobile/chat',5,9,4,'Telemedicine'),
    ('nurse-tasks','Nurse Tasks','Nurse App','/clinical-services/mobile/nurse-tasks',5,9,4,'Nurse'),
    ('medication-admin','Medication Administration','Nurse App','/clinical-services/mobile/medication-admin',5,9,4,'Nurse'),
    ('vitals','Vitals Entry','Nurse App','/clinical-services/mobile/vitals',5,9,4,'Nurse'),
    ('referral-leads','Referral Leads','Referral App','/clinical-services/mobile/referral-leads',5,9,4,'Referral'),
    ('referral-commissions','Referral Commissions','Referral App','/clinical-services/mobile/referral-commissions',5,9,4,'Referral'),
    ('corporate-employees','Corporate Employees','Corporate Portal','/clinical-services/mobile/corporate-employees',5,9,4,'Corporate'),
    ('executive-kpis','Executive KPIs','Executive App','/clinical-services/mobile/executive-kpis',5,9,4,'Executive'),
    ('notifications','Push Notifications','Platform','/clinical-services/mobile/notifications',5,9,4,'Notifications'),
    ('offline-sync','Offline Sync','Platform','/clinical-services/mobile/offline-sync',5,9,4,'Offline'),
    ('ai-assistant','AI Patient Assistant','Patient App','/clinical-services/mobile/ai-assistant',5,9,4,'AI')
),
screen_rows AS (
  SELECT modules.*, generate_series(1, screen_count) AS n FROM modules
)
INSERT INTO clinical_mobile_screen_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, screen_key, screen_name, app_name, route_path,
  section_definitions, field_definitions, workflow_definitions, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  screen_rows.module_key,
  screen_rows.module_key || '_screen_' || LPAD(screen_rows.n::text, 2, '0'),
  screen_rows.module_name || ' Screen ' || screen_rows.n,
  screen_rows.app_name,
  screen_rows.route_path,
  jsonb_build_array('Mobile Header', 'Context Cards', 'Quick Actions', 'Timeline', 'Offline State', 'AI Assistance'),
  jsonb_build_array('Tenant Scope', 'Hospital Scope', 'Branch Scope', 'Clinic Scope', 'Patient/Provider Context', 'Device Context'),
  jsonb_build_array('Create', 'Review', 'Approve', 'Pay', 'Join Call', 'Notify', 'Sync', 'Report'),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN screen_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, screen_key)
DO UPDATE SET
  screen_name = EXCLUDED.screen_name,
  app_name = EXCLUDED.app_name,
  route_path = EXCLUDED.route_path,
  section_definitions = EXCLUDED.section_definitions,
  field_definitions = EXCLUDED.field_definitions,
  workflow_definitions = EXCLUDED.workflow_definitions,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, api_count) AS (
  VALUES
    ('dashboard',9),('mobile-users',9),('devices',9),('auth-sessions',9),('patient-dashboard',9),
    ('patient-profile',9),('patient-360',9),('appointments',9),('lab-reports',9),('lab-trends',9),
    ('radiology-reports',9),('eprescriptions',9),('refill-requests',9),('medication-reminders',9),
    ('online-payments',9),('documents',9),('health-tracker',9),('wearables',9),('ivf-dashboard',9),
    ('ivf-medications',9),('doctor-consultations',9),('telemedicine',9),('chat',9),('nurse-tasks',9),
    ('medication-admin',9),('vitals',9),('referral-leads',9),('referral-commissions',9),
    ('corporate-employees',9),('executive-kpis',9),('notifications',9),('offline-sync',9),('ai-assistant',9)
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
)
INSERT INTO clinical_mobile_api_endpoint_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, endpoint_key, method, path, permission_key,
  request_schema, response_schema, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  api_rows.module_key,
  api_rows.module_key || '_api_' || LPAD(api_rows.n::text, 3, '0'),
  CASE WHEN api_rows.n % 5 = 1 THEN 'POST' WHEN api_rows.n % 5 = 2 THEN 'PATCH' WHEN api_rows.n % 5 = 3 THEN 'DELETE' ELSE 'GET' END,
  '/api/clinical/mobile/' || api_rows.module_key || '/' || api_rows.n,
  'clinical.mobile.' || replace(api_rows.module_key, '-', '_') || '.execute',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','clinic_id','required','device_binding','conditional'),
  jsonb_build_object('audit','required','mobile_security','device_binding_mfa_token_refresh','offline_sync', api_rows.module_key IN ('offline-sync','doctor-consultations','nurse-tasks','vitals')),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN api_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, endpoint_key)
DO UPDATE SET
  method = EXCLUDED.method,
  path = EXCLUDED.path,
  permission_key = EXCLUDED.permission_key,
  request_schema = EXCLUDED.request_schema,
  response_schema = EXCLUDED.response_schema,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, category, report_count) AS (
  VALUES
    ('dashboard','Mobile Command Center','Dashboard',4),('mobile-users','Mobile Users','Security',4),
    ('devices','Device Binding','Security',4),('auth-sessions','Mobile Auth Sessions','Security',4),
    ('patient-dashboard','Patient Dashboard','Patient',4),('patient-profile','Patient Profile','Patient',4),
    ('patient-360','Patient 360','Patient',4),('appointments','Appointment Booking','Patient',4),
    ('lab-reports','Lab Reports','Patient',4),('lab-trends','Lab Trends','Patient',4),
    ('radiology-reports','Radiology Reports','Patient',4),('eprescriptions','E-Prescriptions','Patient',4),
    ('refill-requests','Refill Requests','Patient',4),('medication-reminders','Medication Reminders','Patient',4),
    ('online-payments','Online Payments','Payments',4),('documents','Document Vault','Documents',4),
    ('health-tracker','Health Tracker','Patient',4),('wearables','Wearable Data','Patient',4),
    ('ivf-dashboard','IVF Dashboard','IVF',4),('ivf-medications','IVF Medication Tracker','IVF',4),
    ('doctor-consultations','Doctor Consultation','Doctor',4),('telemedicine','Telemedicine Sessions','Telemedicine',4),
    ('chat','Chat Platform','Telemedicine',4),('nurse-tasks','Nurse Tasks','Nurse',4),
    ('medication-admin','Medication Administration','Nurse',4),('vitals','Vitals Entry','Nurse',4),
    ('referral-leads','Referral Leads','Referral',4),('referral-commissions','Referral Commissions','Referral',4),
    ('corporate-employees','Corporate Employees','Corporate',4),('executive-kpis','Executive KPIs','Executive',4),
    ('notifications','Push Notifications','Notifications',4),('offline-sync','Offline Sync','Offline',4),
    ('ai-assistant','AI Patient Assistant','AI',4)
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO clinical_mobile_report_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, report_key, report_name, report_category,
  output_formats, metric_definitions, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  report_rows.module_key,
  report_rows.module_key || '_report_' || LPAD(report_rows.n::text, 3, '0'),
  report_rows.module_name || ' Report ' || report_rows.n,
  report_rows.category,
  '["PDF","Excel","CSV"]'::jsonb,
  jsonb_build_object(
    'source','database',
    'scope','tenant_hospital_branch_clinic',
    'mobile_app', report_rows.module_key,
    'ai_safety', report_rows.module_key = 'ai-assistant'
  ),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN report_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, report_key)
DO UPDATE SET
  report_name = EXCLUDED.report_name,
  report_category = EXCLUDED.report_category,
  output_formats = EXCLUDED.output_formats,
  metric_definitions = EXCLUDED.metric_definitions,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;
