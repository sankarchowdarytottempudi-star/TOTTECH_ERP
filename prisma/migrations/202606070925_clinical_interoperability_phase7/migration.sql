-- TOTTECH Clinical Services - Phase 7 FHIR + HL7 + DICOM + ABHA + ABDM + Ayushman Bharat + Interoperability Platform

CREATE TABLE IF NOT EXISTS clinical_interop_abha_profiles (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  abha_number VARCHAR(80),
  abha_address VARCHAR(255),
  mobile_number VARCHAR(40),
  aadhaar_reference VARCHAR(160),
  driving_license_reference VARCHAR(160),
  pan_reference VARCHAR(160),
  passport_reference VARCHAR(160),
  verification_status VARCHAR(80) DEFAULT 'PENDING',
  linked_uhid VARCHAR(120),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, abha_number)
);

CREATE TABLE IF NOT EXISTS clinical_interop_abha_verifications (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  abha_profile_id INTEGER REFERENCES clinical_interop_abha_profiles(id),
  verification_type VARCHAR(120) NOT NULL,
  otp_reference VARCHAR(160),
  aadhaar_verification_status VARCHAR(80),
  mobile_verification_status VARCHAR(80),
  provider_response JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'REQUESTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_abha_links (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  abha_profile_id INTEGER REFERENCES clinical_interop_abha_profiles(id),
  patient_id INTEGER REFERENCES patients(id),
  link_type VARCHAR(120) NOT NULL,
  linked_record_id INTEGER,
  linked_record_key VARCHAR(160),
  link_status VARCHAR(80) DEFAULT 'ACTIVE',
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_abdm_consents (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  consent_id VARCHAR(160) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  purpose VARCHAR(160) NOT NULL,
  requester VARCHAR(255),
  requester_organization VARCHAR(255),
  data_type VARCHAR(160),
  consent_type VARCHAR(120),
  start_date DATE,
  end_date DATE,
  consent_status VARCHAR(80) DEFAULT 'REQUESTED',
  provider_response JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, consent_id)
);

CREATE TABLE IF NOT EXISTS clinical_interop_consent_audits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  consent_id INTEGER REFERENCES clinical_interop_abdm_consents(id),
  patient_id INTEGER REFERENCES patients(id),
  requested_by VARCHAR(255),
  approved_by INTEGER,
  data_shared JSONB DEFAULT '[]'::jsonb,
  purpose VARCHAR(160),
  event_type VARCHAR(120) NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_hie_exchanges (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  exchange_number VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  source_type VARCHAR(160),
  destination_type VARCHAR(160),
  exchange_action VARCHAR(120) NOT NULL,
  resource_type VARCHAR(120),
  request_payload JSONB DEFAULT '{}'::jsonb,
  response_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, exchange_number)
);

CREATE TABLE IF NOT EXISTS clinical_interop_fhir_resources (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  fhir_id VARCHAR(160) NOT NULL,
  fhir_version VARCHAR(40) DEFAULT 'R4',
  resource_type VARCHAR(120) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  practitioner_id INTEGER REFERENCES doctors(id),
  organization_reference VARCHAR(160),
  resource_status VARCHAR(80) DEFAULT 'ACTIVE',
  resource JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_table VARCHAR(160),
  source_id INTEGER,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, fhir_id, resource_type)
);

CREATE TABLE IF NOT EXISTS clinical_interop_fhir_audit (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  resource_id INTEGER REFERENCES clinical_interop_fhir_resources(id),
  request_method VARCHAR(20),
  request_path VARCHAR(255),
  request_payload JSONB DEFAULT '{}'::jsonb,
  response_payload JSONB DEFAULT '{}'::jsonb,
  status_code INTEGER,
  requester VARCHAR(255),
  organization VARCHAR(255),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_fhir_mappings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  local_table VARCHAR(160) NOT NULL,
  local_field VARCHAR(160) NOT NULL,
  fhir_resource VARCHAR(120) NOT NULL,
  fhir_path VARCHAR(255) NOT NULL,
  terminology_system VARCHAR(120),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_hl7_messages (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  message_control_id VARCHAR(160) NOT NULL,
  message_type VARCHAR(40) NOT NULL,
  direction VARCHAR(40) DEFAULT 'INBOUND',
  sending_application VARCHAR(160),
  receiving_application VARCHAR(160),
  patient_id INTEGER REFERENCES patients(id),
  raw_message TEXT,
  parsed_payload JSONB DEFAULT '{}'::jsonb,
  processing_status VARCHAR(80) DEFAULT 'PENDING',
  retry_count INTEGER DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, message_control_id)
);

CREATE TABLE IF NOT EXISTS clinical_interop_hl7_errors (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  message_id INTEGER REFERENCES clinical_interop_hl7_messages(id),
  error_type VARCHAR(160),
  message_content TEXT,
  retry_count INTEGER DEFAULT 0,
  resolution_status VARCHAR(80) DEFAULT 'OPEN',
  resolution_notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_dicom_nodes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  ae_title VARCHAR(120) NOT NULL,
  ip_address VARCHAR(80),
  port INTEGER,
  modality VARCHAR(40),
  node_role VARCHAR(80) DEFAULT 'SCP',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, ae_title)
);

CREATE TABLE IF NOT EXISTS clinical_interop_pacs_studies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  study_instance_uid VARCHAR(255) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  accession_number VARCHAR(120),
  modality VARCHAR(40),
  study_date DATE,
  study_description TEXT,
  storage_status VARCHAR(80) DEFAULT 'STORED',
  image_count INTEGER DEFAULT 0,
  report_url TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, study_instance_uid)
);

CREATE TABLE IF NOT EXISTS clinical_interop_pacs_series (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  study_id INTEGER REFERENCES clinical_interop_pacs_studies(id),
  series_instance_uid VARCHAR(255) NOT NULL,
  series_description TEXT,
  modality VARCHAR(40),
  image_count INTEGER DEFAULT 0,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_pacs_images (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  study_id INTEGER REFERENCES clinical_interop_pacs_studies(id),
  series_id INTEGER REFERENCES clinical_interop_pacs_series(id),
  sop_instance_uid VARCHAR(255) NOT NULL,
  image_url TEXT,
  archive_url TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_ayushman_beneficiaries (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  ayushman_id VARCHAR(160),
  family_id VARCHAR(160),
  scheme VARCHAR(160),
  eligibility_status VARCHAR(80) DEFAULT 'PENDING',
  verification_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_ayushman_packages (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  package_code VARCHAR(120) NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  coverage_amount NUMERIC(16,2) DEFAULT 0,
  specialty VARCHAR(160),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, package_code)
);

CREATE TABLE IF NOT EXISTS clinical_interop_ayushman_claims (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  claim_number VARCHAR(160) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  beneficiary_id INTEGER REFERENCES clinical_interop_ayushman_beneficiaries(id),
  package_id INTEGER REFERENCES clinical_interop_ayushman_packages(id),
  claim_amount NUMERIC(16,2) DEFAULT 0,
  approved_amount NUMERIC(16,2) DEFAULT 0,
  claim_status VARCHAR(80) DEFAULT 'DRAFT',
  submitted_date DATE,
  paid_date DATE,
  provider_response JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, claim_number)
);

CREATE TABLE IF NOT EXISTS clinical_interop_ayushman_claim_documents (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  claim_id INTEGER REFERENCES clinical_interop_ayushman_claims(id),
  document_type VARCHAR(160) NOT NULL,
  document_title VARCHAR(255),
  file_url TEXT,
  upload_status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_partner_labs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  lab_code VARCHAR(120) NOT NULL,
  lab_name VARCHAR(255) NOT NULL,
  contact VARCHAR(160),
  api_endpoint TEXT,
  hl7_support BOOLEAN DEFAULT false,
  fhir_support BOOLEAN DEFAULT false,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, lab_code)
);

CREATE TABLE IF NOT EXISTS clinical_interop_external_lab_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  order_number VARCHAR(160) NOT NULL,
  partner_lab_id INTEGER REFERENCES clinical_interop_partner_labs(id),
  patient_id INTEGER REFERENCES patients(id),
  order_payload JSONB DEFAULT '{}'::jsonb,
  result_payload JSONB DEFAULT '{}'::jsonb,
  transmission_status VARCHAR(80) DEFAULT 'PENDING',
  result_status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, order_number)
);

CREATE TABLE IF NOT EXISTS clinical_interop_partner_pharmacies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  pharmacy_code VARCHAR(120) NOT NULL,
  pharmacy_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(160),
  contact VARCHAR(160),
  api_endpoint TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, pharmacy_code)
);

CREATE TABLE IF NOT EXISTS clinical_interop_eprescription_exchanges (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  prescription_number VARCHAR(160) NOT NULL,
  partner_pharmacy_id INTEGER REFERENCES clinical_interop_partner_pharmacies(id),
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  prescription_payload JSONB DEFAULT '{}'::jsonb,
  fulfillment_status VARCHAR(80) DEFAULT 'SENT',
  delivery_status VARCHAR(80),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, prescription_number)
);

CREATE TABLE IF NOT EXISTS clinical_interop_referral_hospitals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  network_code VARCHAR(120) NOT NULL,
  hospital_name VARCHAR(255) NOT NULL,
  location TEXT,
  specialization VARCHAR(255),
  abha_compatible BOOLEAN DEFAULT false,
  api_endpoint TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, network_code)
);

CREATE TABLE IF NOT EXISTS clinical_interop_referral_exchanges (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  referral_number VARCHAR(160) NOT NULL,
  network_hospital_id INTEGER REFERENCES clinical_interop_referral_hospitals(id),
  patient_id INTEGER REFERENCES patients(id),
  clinical_notes TEXT,
  document_payload JSONB DEFAULT '[]'::jsonb,
  follow_up_status VARCHAR(80) DEFAULT 'PENDING',
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, referral_number)
);

CREATE TABLE IF NOT EXISTS clinical_interop_api_consumers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  consumer_key VARCHAR(120) NOT NULL,
  consumer_name VARCHAR(255) NOT NULL,
  consumer_type VARCHAR(120),
  allowed_scopes JSONB DEFAULT '[]'::jsonb,
  oauth_client_id VARCHAR(255),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, consumer_key)
);

CREATE TABLE IF NOT EXISTS clinical_interop_api_subscriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  consumer_id INTEGER REFERENCES clinical_interop_api_consumers(id),
  api_group VARCHAR(120) NOT NULL,
  rate_limit_per_minute INTEGER DEFAULT 60,
  subscription_status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_terminology_codes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  code_system VARCHAR(80) NOT NULL,
  code_value VARCHAR(160) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  version VARCHAR(80),
  category VARCHAR(160),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, code_system, code_value)
);

CREATE TABLE IF NOT EXISTS clinical_interop_terminology_mappings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  local_code VARCHAR(160) NOT NULL,
  local_display VARCHAR(255),
  national_code_id INTEGER REFERENCES clinical_interop_terminology_codes(id),
  fhir_system VARCHAR(255),
  mapping_confidence NUMERIC(8,2),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_mpi_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  mpi_number VARCHAR(160) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  abha_profile_id INTEGER REFERENCES clinical_interop_abha_profiles(id),
  uhid VARCHAR(120),
  external_id VARCHAR(160),
  government_id_reference VARCHAR(160),
  insurance_id VARCHAR(160),
  match_score NUMERIC(8,2),
  duplicate_status VARCHAR(80) DEFAULT 'UNIQUE',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, mpi_number)
);

CREATE TABLE IF NOT EXISTS clinical_interop_mpi_match_candidates (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  mpi_record_id INTEGER REFERENCES clinical_interop_mpi_records(id),
  candidate_patient_id INTEGER REFERENCES patients(id),
  match_reason JSONB DEFAULT '[]'::jsonb,
  match_score NUMERIC(8,2),
  review_status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_security_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  event_type VARCHAR(160) NOT NULL,
  request_path VARCHAR(255),
  request_payload JSONB DEFAULT '{}'::jsonb,
  response_payload JSONB DEFAULT '{}'::jsonb,
  user_id INTEGER,
  organization VARCHAR(255),
  ip_address VARCHAR(80),
  signature_status VARCHAR(80),
  encryption_status VARCHAR(80),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_interop_timeline (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
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
    'clinical_interop_fhir_patient_snapshots','clinical_interop_fhir_practitioner_snapshots','clinical_interop_fhir_organization_snapshots',
    'clinical_interop_fhir_encounter_snapshots','clinical_interop_fhir_observation_snapshots','clinical_interop_fhir_condition_snapshots',
    'clinical_interop_fhir_procedure_snapshots','clinical_interop_fhir_medication_request_snapshots','clinical_interop_fhir_diagnostic_report_snapshots',
    'clinical_interop_fhir_bundle_exports','clinical_interop_fhir_bundle_imports','clinical_interop_fhir_subscription_events',
    'clinical_interop_hl7_adt_events','clinical_interop_hl7_orm_orders','clinical_interop_hl7_oru_results',
    'clinical_interop_hl7_dft_financial_messages','clinical_interop_hl7_siu_schedules','clinical_interop_hl7_mdm_documents',
    'clinical_interop_dicom_routes','clinical_interop_dicom_archive_jobs','clinical_interop_dicom_forwarding_jobs',
    'clinical_interop_dicom_storage_commitments','clinical_interop_pacs_query_logs','clinical_interop_pacs_retrieval_logs',
    'clinical_interop_abdm_discovery_requests','clinical_interop_abdm_data_shares','clinical_interop_abdm_revocations',
    'clinical_interop_abha_creation_requests','clinical_interop_abha_link_requests','clinical_interop_abha_auth_sessions',
    'clinical_interop_ayushman_benefit_checks','clinical_interop_ayushman_package_checks','clinical_interop_ayushman_pre_auths',
    'clinical_interop_ayushman_settlements','clinical_interop_government_claim_audits','clinical_interop_external_lab_results',
    'clinical_interop_external_lab_failures','clinical_interop_external_pharmacy_fulfillment','clinical_interop_external_pharmacy_failures',
    'clinical_interop_marketplace_api_keys','clinical_interop_marketplace_access_logs','clinical_interop_marketplace_webhooks',
    'clinical_interop_ihe_profile_configs','clinical_interop_cda_documents','clinical_interop_ccd_documents',
    'clinical_interop_snomed_maps','clinical_interop_loinc_maps','clinical_interop_icd10_maps',
    'clinical_interop_icd11_maps','clinical_interop_cpt_maps','clinical_interop_mpi_merge_requests',
    'clinical_interop_mpi_unmerge_requests','clinical_interop_duplicate_patient_reviews','clinical_interop_hie_partner_directories',
    'clinical_interop_hie_export_jobs','clinical_interop_hie_import_jobs','clinical_interop_oauth_clients',
    'clinical_interop_openid_sessions','clinical_interop_jwt_token_audits','clinical_interop_digital_signature_logs',
    'clinical_interop_encryption_key_rotations','clinical_interop_interop_report_snapshots','clinical_interop_interop_kpi_snapshots',
    'clinical_interop_alerts','clinical_interop_notifications','clinical_interop_retry_queue',
    'clinical_interop_dead_letter_queue','clinical_interop_provider_health_checks','clinical_interop_data_quality_checks'
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
        record_number VARCHAR(160),
        record_date DATE DEFAULT CURRENT_DATE,
        resource_type VARCHAR(120),
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

CREATE TABLE IF NOT EXISTS clinical_interop_screen_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  screen_key VARCHAR(180) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
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

CREATE TABLE IF NOT EXISTS clinical_interop_api_endpoint_definitions (
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

CREATE TABLE IF NOT EXISTS clinical_interop_report_definitions (
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

CREATE INDEX IF NOT EXISTS idx_clinical_interop_abha_scope ON clinical_interop_abha_profiles(tenant_id, hospital_id, branch_id, patient_id, verification_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_interop_consents_scope ON clinical_interop_abdm_consents(tenant_id, hospital_id, branch_id, patient_id, consent_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_interop_fhir_scope ON clinical_interop_fhir_resources(tenant_id, hospital_id, branch_id, resource_type, resource_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_interop_hl7_scope ON clinical_interop_hl7_messages(tenant_id, hospital_id, branch_id, message_type, processing_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_interop_pacs_scope ON clinical_interop_pacs_studies(tenant_id, hospital_id, branch_id, patient_id, modality, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_interop_ayushman_scope ON clinical_interop_ayushman_claims(tenant_id, hospital_id, branch_id, claim_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_interop_timeline_scope ON clinical_interop_timeline(tenant_id, hospital_id, branch_id, patient_id, created_at);

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
    ('interop_core','Interoperability Hub','/clinical-services/interoperability','interoperability','clinical.interop.read',270),
    ('interop_abha','ABHA Management','/clinical-services/interoperability/abha','interoperability','clinical.interop.abha.read',271),
    ('interop_consents','ABDM Consents','/clinical-services/interoperability/consents','interoperability','clinical.interop.consents.read',272),
    ('interop_hie','Health Information Exchange','/clinical-services/interoperability/hie','interoperability','clinical.interop.hie.read',273),
    ('interop_fhir','FHIR Resources','/clinical-services/interoperability/fhir-resources','interoperability','clinical.interop.fhir.read',274),
    ('interop_hl7','HL7 Engine','/clinical-services/interoperability/hl7','interoperability','clinical.interop.hl7.read',275),
    ('interop_hl7_errors','HL7 Monitor','/clinical-services/interoperability/hl7-errors','interoperability','clinical.interop.hl7_errors.read',276),
    ('interop_dicom','DICOM Nodes','/clinical-services/interoperability/dicom-nodes','interoperability','clinical.interop.dicom.read',277),
    ('interop_pacs','PACS Studies','/clinical-services/interoperability/pacs-studies','interoperability','clinical.interop.pacs.read',278),
    ('interop_ayushman','Ayushman Claims','/clinical-services/interoperability/ayushman-claims','interoperability','clinical.interop.ayushman.read',279),
    ('interop_partner_labs','Partner Labs','/clinical-services/interoperability/partner-labs','interoperability','clinical.interop.partner_labs.read',280),
    ('interop_partner_pharmacies','Partner Pharmacies','/clinical-services/interoperability/partner-pharmacies','interoperability','clinical.interop.partner_pharmacies.read',281),
    ('interop_referral_network','Referral Network','/clinical-services/interoperability/referral-network','interoperability','clinical.interop.referral_network.read',282),
    ('interop_marketplace','API Marketplace','/clinical-services/interoperability/marketplace','interoperability','clinical.interop.marketplace.read',283),
    ('interop_terminology','Terminology Server','/clinical-services/interoperability/terminology','interoperability','clinical.interop.terminology.read',284),
    ('interop_mpi','Master Patient Index','/clinical-services/interoperability/mpi','interoperability','clinical.interop.mpi.read',285),
    ('interop_security','Security Audit','/clinical-services/interoperability/security','interoperability','clinical.interop.security.read',286)
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
modules(module_key, module_name, route_path, screen_count, api_count, report_count, category) AS (
  VALUES
    ('dashboard','Interoperability Dashboard','/clinical-services/interoperability',4,10,8,'Dashboard'),
    ('abha','ABHA Management','/clinical-services/interoperability/abha',4,10,8,'ABDM'),
    ('abha-verification','ABHA Verification','/clinical-services/interoperability/abha-verification',4,10,8,'ABDM'),
    ('consents','ABDM Consent Manager','/clinical-services/interoperability/consents',4,10,8,'ABDM'),
    ('consent-audit','Consent Audit','/clinical-services/interoperability/consent-audit',4,10,8,'ABDM'),
    ('hie','Health Information Exchange','/clinical-services/interoperability/hie',4,10,8,'HIE'),
    ('fhir-resources','FHIR Resources','/clinical-services/interoperability/fhir-resources',4,10,8,'FHIR'),
    ('fhir-audit','FHIR Audit','/clinical-services/interoperability/fhir-audit',4,10,8,'FHIR'),
    ('fhir-mappings','FHIR Mappings','/clinical-services/interoperability/fhir-mappings',4,10,8,'FHIR'),
    ('hl7','HL7 Messages','/clinical-services/interoperability/hl7',4,10,8,'HL7'),
    ('hl7-errors','HL7 Message Monitor','/clinical-services/interoperability/hl7-errors',4,10,8,'HL7'),
    ('dicom-nodes','DICOM Gateway','/clinical-services/interoperability/dicom-nodes',4,10,8,'DICOM'),
    ('pacs-studies','PACS Studies','/clinical-services/interoperability/pacs-studies',4,10,8,'PACS'),
    ('ayushman-beneficiaries','Ayushman Beneficiaries','/clinical-services/interoperability/ayushman-beneficiaries',4,10,8,'Ayushman'),
    ('ayushman-packages','Ayushman Packages','/clinical-services/interoperability/ayushman-packages',4,10,8,'Ayushman'),
    ('ayushman-claims','Ayushman Claims','/clinical-services/interoperability/ayushman-claims',4,10,8,'Ayushman'),
    ('partner-labs','External Lab Integration','/clinical-services/interoperability/partner-labs',4,10,8,'External'),
    ('partner-pharmacies','External Pharmacy Integration','/clinical-services/interoperability/partner-pharmacies',4,10,8,'External'),
    ('referral-network','Referral Hospital Network','/clinical-services/interoperability/referral-network',4,10,8,'External'),
    ('marketplace','Healthcare API Marketplace','/clinical-services/interoperability/marketplace',4,10,8,'Marketplace'),
    ('terminology','Terminology Server','/clinical-services/interoperability/terminology',4,10,8,'Terminology'),
    ('terminology-mappings','Terminology Mappings','/clinical-services/interoperability/terminology-mappings',4,10,8,'Terminology'),
    ('mpi','Master Patient Index','/clinical-services/interoperability/mpi',4,10,8,'MPI'),
    ('security','Security Audit','/clinical-services/interoperability/security',4,10,8,'Security')
),
screen_rows AS (
  SELECT modules.*, generate_series(1, screen_count) AS n FROM modules
)
INSERT INTO clinical_interop_screen_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, screen_key, screen_name, route_path,
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
  screen_rows.route_path,
  jsonb_build_array('Identity', 'Consent', 'Exchange', 'Security', 'Audit', 'Monitoring'),
  jsonb_build_array('Tenant Scope', 'Hospital Scope', 'Branch Scope', 'Clinic Scope', 'Patient Context', 'FHIR/HL7/DICOM Payload'),
  jsonb_build_array('Create', 'Validate', 'Exchange', 'Retry', 'Audit', 'Report'),
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
    ('dashboard',10),('abha',10),('abha-verification',10),('consents',10),('consent-audit',10),('hie',10),
    ('fhir-resources',10),('fhir-audit',10),('fhir-mappings',10),('hl7',10),('hl7-errors',10),
    ('dicom-nodes',10),('pacs-studies',10),('ayushman-beneficiaries',10),('ayushman-packages',10),
    ('ayushman-claims',10),('partner-labs',10),('partner-pharmacies',10),('referral-network',10),
    ('marketplace',10),('terminology',10),('terminology-mappings',10),('mpi',10),('security',10)
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
)
INSERT INTO clinical_interop_api_endpoint_definitions (
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
  '/api/clinical/interoperability/' || api_rows.module_key || '/' || api_rows.n,
  'clinical.interop.' || replace(api_rows.module_key, '-', '_') || '.execute',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','clinic_id','required','consent','required_for_patient_data'),
  jsonb_build_object('audit','required','security','TLS1.3/OAuth2/OIDC/JWT/signature-ready','standards',jsonb_build_array('FHIR R4','FHIR R5','HL7','DICOM','ABDM')),
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
    ('dashboard','Interoperability Dashboard','Dashboard',8),('abha','ABHA Management','ABDM',8),
    ('abha-verification','ABHA Verification','ABDM',8),('consents','ABDM Consent Manager','ABDM',8),
    ('consent-audit','Consent Audit','ABDM',8),('hie','Health Information Exchange','HIE',8),
    ('fhir-resources','FHIR Resources','FHIR',8),('fhir-audit','FHIR Audit','FHIR',8),
    ('fhir-mappings','FHIR Mappings','FHIR',8),('hl7','HL7 Messages','HL7',8),
    ('hl7-errors','HL7 Message Monitor','HL7',8),('dicom-nodes','DICOM Gateway','DICOM',8),
    ('pacs-studies','PACS Studies','PACS',8),('ayushman-beneficiaries','Ayushman Beneficiaries','Ayushman',8),
    ('ayushman-packages','Ayushman Packages','Ayushman',8),('ayushman-claims','Ayushman Claims','Ayushman',8),
    ('partner-labs','External Lab Integration','External',8),('partner-pharmacies','External Pharmacy Integration','External',8),
    ('referral-network','Referral Hospital Network','External',8),('marketplace','Healthcare API Marketplace','Marketplace',8),
    ('terminology','Terminology Server','Terminology',8),('terminology-mappings','Terminology Mappings','Terminology',8),
    ('mpi','Master Patient Index','MPI',8),('security','Security Audit','Security',8)
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO clinical_interop_report_definitions (
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
    'abdm', report_rows.module_key IN ('abha','abha-verification','consents','consent-audit'),
    'standards', report_rows.module_key IN ('fhir-resources','fhir-audit','fhir-mappings','hl7','hl7-errors','dicom-nodes','pacs-studies')
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
