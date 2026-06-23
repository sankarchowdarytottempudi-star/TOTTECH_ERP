-- TOTTECH Clinical Services - Phase 4 Laboratory + Radiology + PACS + DICOM + Diagnostic Center

CREATE TABLE IF NOT EXISTS lab_test_categories (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  category_code VARCHAR(80) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(160),
  status VARCHAR(60) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, category_code)
);

CREATE TABLE IF NOT EXISTS lab_tests (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  test_code VARCHAR(80) NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(160) NOT NULL,
  category_id INTEGER REFERENCES lab_test_categories(id),
  category VARCHAR(160),
  sample_type VARCHAR(120) NOT NULL,
  method VARCHAR(160),
  turnaround_time_minutes INTEGER NOT NULL DEFAULT 1440,
  base_price NUMERIC(14,2) DEFAULT 0,
  gst NUMERIC(8,2) DEFAULT 0,
  discount_allowed BOOLEAN DEFAULT false,
  insurance_covered BOOLEAN DEFAULT false,
  home_collection_available BOOLEAN DEFAULT false,
  reference_range TEXT,
  critical_range TEXT,
  normal_range TEXT,
  gender_specific BOOLEAN DEFAULT false,
  age_specific BOOLEAN DEFAULT false,
  units VARCHAR(80),
  status VARCHAR(60) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, test_code)
);

CREATE TABLE IF NOT EXISTS lab_test_packages (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  package_code VARCHAR(80) NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  package_category VARCHAR(160),
  tests_included JSONB DEFAULT '[]'::jsonb,
  price NUMERIC(14,2) DEFAULT 0,
  discount NUMERIC(14,2) DEFAULT 0,
  validity_days INTEGER,
  status VARCHAR(60) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, package_code)
);

CREATE TABLE IF NOT EXISTS lab_package_tests (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  package_id INTEGER REFERENCES lab_test_packages(id),
  test_id INTEGER REFERENCES lab_tests(id),
  display_order INTEGER DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS lab_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  order_number VARCHAR(80) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  department_id INTEGER REFERENCES departments(id),
  priority VARCHAR(40) DEFAULT 'ROUTINE',
  clinical_notes TEXT,
  order_status VARCHAR(80) DEFAULT 'CREATED',
  order_date DATE DEFAULT CURRENT_DATE,
  expected_tat TIMESTAMP,
  source_module VARCHAR(80),
  ivf_cycle_id INTEGER,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, order_number)
);

CREATE TABLE IF NOT EXISTS lab_order_items (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  test_id INTEGER REFERENCES lab_tests(id),
  package_id INTEGER REFERENCES lab_test_packages(id),
  item_name VARCHAR(255),
  sample_type VARCHAR(120),
  price NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'CREATED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS lab_samples (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  collection_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  collector_id INTEGER,
  collection_date DATE DEFAULT CURRENT_DATE,
  collection_time TIME,
  sample_type VARCHAR(120),
  barcode VARCHAR(160),
  collection_address TEXT,
  gps_coordinates VARCHAR(120),
  travel_cost NUMERIC(14,2) DEFAULT 0,
  storage_condition VARCHAR(120),
  status VARCHAR(80) DEFAULT 'COLLECTED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, collection_number)
);

CREATE TABLE IF NOT EXISTS lab_sample_tracking (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  sample_id INTEGER REFERENCES lab_samples(id),
  order_id INTEGER REFERENCES lab_orders(id),
  barcode VARCHAR(160),
  event_type VARCHAR(120),
  event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  location VARCHAR(255),
  storage_condition VARCHAR(120),
  handled_by INTEGER,
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'TRACKED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS lab_result_parameters (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  test_id INTEGER REFERENCES lab_tests(id),
  parameter_name VARCHAR(255) NOT NULL,
  units VARCHAR(80),
  reference_range TEXT,
  critical_range TEXT,
  display_order INTEGER DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS lab_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  result_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  sample_id INTEGER REFERENCES lab_samples(id),
  patient_id INTEGER REFERENCES patients(id),
  test_id INTEGER REFERENCES lab_tests(id),
  parameter_name VARCHAR(255),
  observed_value VARCHAR(255),
  units VARCHAR(80),
  reference_range TEXT,
  critical_flag BOOLEAN DEFAULT false,
  abnormal_flag BOOLEAN DEFAULT false,
  interpretation TEXT,
  technician_id INTEGER,
  verifier_id INTEGER,
  approval_date TIMESTAMP,
  digital_signature TEXT,
  status VARCHAR(80) DEFAULT 'PROCESSING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, result_number)
);

CREATE TABLE IF NOT EXISTS lab_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  report_components JSONB DEFAULT '{}'::jsonb,
  interpretation TEXT,
  comments TEXT,
  qr_verification_code VARCHAR(160),
  digital_signature TEXT,
  released_at TIMESTAMP,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS lab_machines (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  machine_code VARCHAR(80) NOT NULL,
  machine_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(160),
  manufacturer VARCHAR(160),
  model VARCHAR(160),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, machine_code)
);

CREATE TABLE IF NOT EXISTS lab_quality_controls (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  qc_number VARCHAR(80) NOT NULL,
  machine_id INTEGER REFERENCES lab_machines(id),
  control_level VARCHAR(120),
  observed_value VARCHAR(255),
  target_value VARCHAR(255),
  variance VARCHAR(120),
  external_provider VARCHAR(255),
  external_result VARCHAR(255),
  score VARCHAR(120),
  remarks TEXT,
  status VARCHAR(80) DEFAULT 'RECORDED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, qc_number)
);

CREATE TABLE IF NOT EXISTS lab_hematology_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  result_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  sample_id INTEGER REFERENCES lab_samples(id),
  patient_id INTEGER REFERENCES patients(id),
  hemoglobin NUMERIC(10,2),
  rbc NUMERIC(10,2),
  wbc NUMERIC(10,2),
  platelets NUMERIC(10,2),
  mcv NUMERIC(10,2),
  mch NUMERIC(10,2),
  mchc NUMERIC(10,2),
  neutrophils NUMERIC(10,2),
  lymphocytes NUMERIC(10,2),
  monocytes NUMERIC(10,2),
  eosinophils NUMERIC(10,2),
  basophils NUMERIC(10,2),
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, result_number)
);

CREATE TABLE IF NOT EXISTS lab_biochemistry_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  result_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  sample_id INTEGER REFERENCES lab_samples(id),
  patient_id INTEGER REFERENCES patients(id),
  glucose NUMERIC(10,2),
  hba1c NUMERIC(10,2),
  urea NUMERIC(10,2),
  creatinine NUMERIC(10,2),
  uric_acid NUMERIC(10,2),
  sodium NUMERIC(10,2),
  potassium NUMERIC(10,2),
  chloride NUMERIC(10,2),
  calcium NUMERIC(10,2),
  magnesium NUMERIC(10,2),
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, result_number)
);

CREATE TABLE IF NOT EXISTS lab_hormone_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  result_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  sample_id INTEGER REFERENCES lab_samples(id),
  patient_id INTEGER REFERENCES patients(id),
  ivf_cycle_id INTEGER,
  amh NUMERIC(10,2),
  fsh NUMERIC(10,2),
  lh NUMERIC(10,2),
  estradiol NUMERIC(10,2),
  progesterone NUMERIC(10,2),
  tsh NUMERIC(10,2),
  prolactin NUMERIC(10,2),
  testosterone NUMERIC(10,2),
  beta_hcg NUMERIC(10,2),
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, result_number)
);

CREATE TABLE IF NOT EXISTS lab_microbiology_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  result_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  sample_id INTEGER REFERENCES lab_samples(id),
  patient_id INTEGER REFERENCES patients(id),
  organism VARCHAR(255),
  colony_count VARCHAR(120),
  sensitivity TEXT,
  resistance TEXT,
  antibiogram JSONB DEFAULT '[]'::jsonb,
  comments TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, result_number)
);

CREATE TABLE IF NOT EXISTS lab_histopathology_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  specimen_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  specimen_type VARCHAR(160),
  collection_date DATE,
  gross_findings TEXT,
  microscopic_findings TEXT,
  diagnosis TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, specimen_number)
);

CREATE TABLE IF NOT EXISTS lab_cytology_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  result_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  pap_smear TEXT,
  fnac TEXT,
  cytology_findings TEXT,
  impression TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, result_number)
);

CREATE TABLE IF NOT EXISTS lab_genetics_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  result_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  ivf_cycle_id INTEGER,
  karyotyping TEXT,
  pgt_a TEXT,
  pgt_m TEXT,
  pgt_sr TEXT,
  carrier_screening TEXT,
  genetic_findings TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, result_number)
);

CREATE TABLE IF NOT EXISTS lab_home_collections (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  collection_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES lab_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  collector_id INTEGER,
  route_plan TEXT,
  gps_coordinates VARCHAR(120),
  barcode_scan VARCHAR(160),
  digital_signature TEXT,
  photo_proof TEXT,
  collection_address TEXT,
  collection_time TIMESTAMP,
  travel_cost NUMERIC(14,2) DEFAULT 0,
  status VARCHAR(80) DEFAULT 'SCHEDULED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, collection_number)
);

CREATE TABLE IF NOT EXISTS radiology_machines (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  machine_code VARCHAR(80) NOT NULL,
  machine_name VARCHAR(255) NOT NULL,
  modality VARCHAR(80),
  room_name VARCHAR(120),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, machine_code)
);

CREATE TABLE IF NOT EXISTS radiology_orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  order_number VARCHAR(80) NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  doctor_id INTEGER REFERENCES doctors(id),
  study_type VARCHAR(120),
  priority VARCHAR(40) DEFAULT 'ROUTINE',
  clinical_notes TEXT,
  order_status VARCHAR(80) DEFAULT 'CREATED',
  order_date DATE DEFAULT CURRENT_DATE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, order_number)
);

CREATE TABLE IF NOT EXISTS radiology_appointments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  appointment_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  machine_id INTEGER REFERENCES radiology_machines(id),
  radiologist_id INTEGER REFERENCES doctors(id),
  appointment_date DATE,
  appointment_time TIME,
  duration_minutes INTEGER,
  status VARCHAR(80) DEFAULT 'SCHEDULED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, appointment_number)
);

CREATE TABLE IF NOT EXISTS radiology_studies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  study_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  modality VARCHAR(80),
  study_type VARCHAR(120),
  study_uid VARCHAR(255),
  acquisition_date DATE,
  status VARCHAR(80) DEFAULT 'ACQUIRED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, study_number)
);

CREATE TABLE IF NOT EXISTS radiology_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  study_id INTEGER REFERENCES radiology_studies(id),
  patient_id INTEGER REFERENCES patients(id),
  findings TEXT,
  impression TEXT,
  recommendation TEXT,
  radiologist_id INTEGER REFERENCES doctors(id),
  approval_date TIMESTAMP,
  digital_signature TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS radiology_ultrasound_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  ivf_cycle_id INTEGER,
  right_ovary_follicles JSONB DEFAULT '[]'::jsonb,
  left_ovary_follicles JSONB DEFAULT '[]'::jsonb,
  endometrial_thickness NUMERIC(10,2),
  vascularity VARCHAR(120),
  comments TEXT,
  findings TEXT,
  impression TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS radiology_xray_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  body_part VARCHAR(160),
  technique TEXT,
  findings TEXT,
  impression TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS radiology_ct_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  study_type VARCHAR(160),
  contrast VARCHAR(120),
  findings TEXT,
  impression TEXT,
  recommendations TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS radiology_mri_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  protocol VARCHAR(160),
  sequence TEXT,
  findings TEXT,
  impression TEXT,
  recommendations TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS radiology_mammography_reports (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_number VARCHAR(80) NOT NULL,
  order_id INTEGER REFERENCES radiology_orders(id),
  patient_id INTEGER REFERENCES patients(id),
  bi_rads_category VARCHAR(80),
  breast_density VARCHAR(120),
  findings TEXT,
  recommendations TEXT,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_number)
);

CREATE TABLE IF NOT EXISTS pacs_studies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  radiology_study_id INTEGER REFERENCES radiology_studies(id),
  patient_id INTEGER REFERENCES patients(id),
  study_uid VARCHAR(255) NOT NULL,
  modality VARCHAR(80),
  acquisition_date DATE,
  study_description TEXT,
  storage_status VARCHAR(80) DEFAULT 'STORED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, study_uid)
);

CREATE TABLE IF NOT EXISTS pacs_series (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  pacs_study_id INTEGER REFERENCES pacs_studies(id),
  series_uid VARCHAR(255) NOT NULL,
  series_description TEXT,
  modality VARCHAR(80),
  image_count INTEGER DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, series_uid)
);

CREATE TABLE IF NOT EXISTS pacs_dicom_files (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  pacs_study_id INTEGER REFERENCES pacs_studies(id),
  pacs_series_id INTEGER REFERENCES pacs_series(id),
  instance_uid VARCHAR(255) NOT NULL,
  modality VARCHAR(80),
  file_path TEXT,
  file_size BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb,
  storage_status VARCHAR(80) DEFAULT 'STORED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, instance_uid)
);

CREATE TABLE IF NOT EXISTS dicom_annotations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dicom_file_id INTEGER REFERENCES pacs_dicom_files(id),
  annotation_type VARCHAR(120),
  annotation_data JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS dicom_measurements (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dicom_file_id INTEGER REFERENCES pacs_dicom_files(id),
  measurement_type VARCHAR(120),
  measurement_value NUMERIC(14,4),
  units VARCHAR(80),
  measurement_data JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS radiology_ai_assists (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  study_id INTEGER REFERENCES radiology_studies(id),
  patient_id INTEGER REFERENCES patients(id),
  prompt TEXT,
  draft_report TEXT,
  highlighted_findings JSONB DEFAULT '[]'::jsonb,
  prior_comparison TEXT,
  confidence NUMERIC(8,2),
  radiologist_review_required BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS diagnostic_ivf_integrations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  couple_id INTEGER REFERENCES ivf_couples(id),
  cycle_id INTEGER REFERENCES ivf_cycles(id),
  source_module VARCHAR(120),
  lab_order_id INTEGER REFERENCES lab_orders(id),
  radiology_order_id INTEGER REFERENCES radiology_orders(id),
  result_summary TEXT,
  status VARCHAR(80) DEFAULT 'LINKED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS diagnostic_timeline (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  order_id INTEGER,
  study_id INTEGER,
  sample_id INTEGER,
  event_type VARCHAR(120),
  event_title VARCHAR(255),
  event_summary TEXT,
  source_table VARCHAR(120),
  source_id INTEGER,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS diagnostic_alerts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  patient_id INTEGER REFERENCES patients(id),
  alert_type VARCHAR(120),
  severity VARCHAR(80),
  title VARCHAR(255),
  message TEXT,
  status VARCHAR(80) DEFAULT 'OPEN',
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
    'lab_departments','lab_methods','lab_analyzers','lab_reagents','lab_reagent_batches','lab_calibrations',
    'lab_delta_checks','lab_critical_alerts','lab_result_comments','lab_report_delivery','lab_report_prints',
    'lab_sms_logs','lab_email_logs','lab_whatsapp_logs','lab_specimen_storage','lab_disposal_records',
    'lab_sample_rejections','lab_sample_transfers','lab_sample_receipts','lab_chain_of_custody','lab_home_routes',
    'lab_collector_tasks','lab_collector_attendance','lab_phlebotomy_notes','lab_barcode_labels',
    'lab_accession_register','lab_external_lab_refs','lab_outsource_orders','lab_outsource_results',
    'lab_doctor_commissions','lab_package_mappings','lab_insurance_approvals','lab_billing_links',
    'lab_refund_links','lab_tat_breaches','lab_machine_maintenance','lab_qc_rules','lab_qc_lots','lab_qc_failures',
    'lab_audit_snapshots','lab_result_amendments','lab_result_history','lab_microbiology_antibiotics',
    'lab_microbiology_panels','lab_microbiology_sensitivity','lab_histopathology_blocks','lab_histopathology_slides',
    'lab_cytology_slides','lab_genetics_variants','lab_molecular_runs','lab_ivf_hormone_links','lab_ivf_semen_links',
    'lab_ivf_embryology_links','radiology_modalities','radiology_protocols','radiology_room_schedules',
    'radiology_contrast_records','radiology_sedation_records','radiology_critical_alerts','radiology_report_templates',
    'radiology_report_amendments','radiology_prior_comparisons','radiology_image_quality','radiology_machine_maintenance',
    'radiology_radiologist_worklist','radiology_technician_worklist','radiology_billing_links','radiology_insurance_links',
    'radiology_referral_links','pacs_storage_nodes','pacs_routing_rules','pacs_import_jobs','pacs_export_jobs',
    'pacs_viewer_sessions','pacs_study_shares','pacs_dicom_tags','pacs_dicom_instances','dicom_window_presets',
    'dicom_hanging_protocols','dicom_key_images','dicom_structured_reports','dicom_ai_findings',
    'diagnostic_kpi_snapshots','diagnostic_report_snapshots','diagnostic_ai_logs','diagnostic_quality_events',
    'diagnostic_turnaround_events','diagnostic_inventory_links','diagnostic_procurement_links',
    'diagnostic_home_collection_payments','diagnostic_patient_portal_deliveries','diagnostic_doctor_portal_deliveries'
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
        lab_order_id INTEGER,
        radiology_order_id INTEGER,
        sample_id INTEGER,
        study_id INTEGER,
        record_number VARCHAR(100),
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

CREATE TABLE IF NOT EXISTS diagnostic_screen_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  screen_key VARCHAR(160) NOT NULL,
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

CREATE TABLE IF NOT EXISTS diagnostic_api_endpoint_definitions (
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

CREATE TABLE IF NOT EXISTS diagnostic_report_definitions (
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

CREATE INDEX IF NOT EXISTS idx_lab_orders_scope ON lab_orders(tenant_id, hospital_id, branch_id, clinic_id, order_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_lab_samples_scope ON lab_samples(tenant_id, hospital_id, branch_id, clinic_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_lab_results_scope ON lab_results(tenant_id, hospital_id, branch_id, clinic_id, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_radiology_orders_scope ON radiology_orders(tenant_id, hospital_id, branch_id, clinic_id, order_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_pacs_dicom_scope ON pacs_dicom_files(tenant_id, hospital_id, branch_id, clinic_id, modality, is_deleted);
CREATE INDEX IF NOT EXISTS idx_diagnostic_timeline_scope ON diagnostic_timeline(tenant_id, hospital_id, branch_id, clinic_id, patient_id, created_at);

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
    ('diagnostics_core','Diagnostics Command Center','/clinical-services/diagnostics','diagnostics','clinical.diagnostics.read',140),
    ('lab_tests','Test Master','/clinical-services/diagnostics/test-master','lab','clinical.lab.tests.read',141),
    ('lab_packages','Test Packages','/clinical-services/diagnostics/packages','lab','clinical.lab.packages.read',142),
    ('lab_orders','Lab Orders','/clinical-services/diagnostics/lab-orders','lab','clinical.lab.orders.read',143),
    ('lab_samples','Sample Collection','/clinical-services/diagnostics/sample-collection','lab','clinical.lab.samples.read',144),
    ('lab_tracking','Sample Tracking','/clinical-services/diagnostics/sample-tracking','lab','clinical.lab.tracking.read',145),
    ('lab_results','Result Entry','/clinical-services/diagnostics/result-entry','lab','clinical.lab.results.read',146),
    ('lab_reports','Lab Reports','/clinical-services/diagnostics/lab-reports','lab','clinical.lab.reports.read',147),
    ('lab_qc','Quality Control','/clinical-services/diagnostics/quality-control','lab','clinical.lab.qc.read',148),
    ('ris_orders','Radiology Orders','/clinical-services/diagnostics/radiology-orders','radiology','clinical.radiology.orders.read',149),
    ('ris_schedule','RIS Scheduling','/clinical-services/diagnostics/radiology-scheduling','radiology','clinical.radiology.schedule.read',150),
    ('ris_ultrasound','Ultrasound','/clinical-services/diagnostics/ultrasound','radiology','clinical.radiology.ultrasound.read',151),
    ('ris_reporting','Radiology Reporting','/clinical-services/diagnostics/radiology-reporting','radiology','clinical.radiology.reports.read',152),
    ('pacs','PACS','/clinical-services/diagnostics/pacs','pacs','clinical.pacs.read',153),
    ('dicom','DICOM Viewer','/clinical-services/diagnostics/dicom-viewer','dicom','clinical.dicom.read',154),
    ('ai_radiology','AI Radiology Assist','/clinical-services/diagnostics/ai-radiology','ai','clinical.radiology.ai.read',155),
    ('home_collection','Home Collection','/clinical-services/diagnostics/home-collection','lab','clinical.home_collection.read',156),
    ('ivf_lab_integration','IVF Lab Integration','/clinical-services/diagnostics/ivf-integration','ivf','clinical.diagnostics.ivf.read',157)
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
    ('dashboard','Diagnostic Dashboard','/clinical-services/diagnostics',10,16,12,'Operational'),
    ('test-master','Test Master','/clinical-services/diagnostics/test-master',8,16,10,'Laboratory'),
    ('packages','Test Packages','/clinical-services/diagnostics/packages',6,14,10,'Laboratory'),
    ('lab-orders','Lab Order Management','/clinical-services/diagnostics/lab-orders',8,18,12,'Laboratory'),
    ('sample-collection','Sample Collection','/clinical-services/diagnostics/sample-collection',8,16,12,'Laboratory'),
    ('sample-tracking','Sample Tracking','/clinical-services/diagnostics/sample-tracking',6,14,10,'Laboratory'),
    ('hematology','Hematology','/clinical-services/diagnostics/hematology',6,14,8,'Laboratory'),
    ('biochemistry','Biochemistry','/clinical-services/diagnostics/biochemistry',6,14,8,'Laboratory'),
    ('hormone-lab','Hormone Lab','/clinical-services/diagnostics/hormone-lab',6,14,10,'Laboratory'),
    ('microbiology','Microbiology','/clinical-services/diagnostics/microbiology',6,14,10,'Laboratory'),
    ('histopathology','Histopathology','/clinical-services/diagnostics/histopathology',5,12,8,'Laboratory'),
    ('cytology','Cytology','/clinical-services/diagnostics/cytology',5,12,8,'Laboratory'),
    ('genetics','Genetics','/clinical-services/diagnostics/genetics',5,12,10,'Laboratory'),
    ('result-entry','Lab Result Entry','/clinical-services/diagnostics/result-entry',8,18,12,'Laboratory'),
    ('lab-reports','Lab Report Generation','/clinical-services/diagnostics/lab-reports',8,16,16,'Laboratory'),
    ('quality-control','Lab Quality Control','/clinical-services/diagnostics/quality-control',5,12,12,'Laboratory'),
    ('radiology-orders','Radiology Orders','/clinical-services/diagnostics/radiology-orders',7,16,10,'Radiology'),
    ('radiology-scheduling','RIS Scheduling','/clinical-services/diagnostics/radiology-scheduling',5,12,8,'Radiology'),
    ('ultrasound','Ultrasound','/clinical-services/diagnostics/ultrasound',5,14,10,'Radiology'),
    ('xray','X-Ray','/clinical-services/diagnostics/xray',4,10,6,'Radiology'),
    ('ct','CT Scan','/clinical-services/diagnostics/ct',4,10,6,'Radiology'),
    ('mri','MRI','/clinical-services/diagnostics/mri',4,10,6,'Radiology'),
    ('mammography','Mammography','/clinical-services/diagnostics/mammography',4,10,6,'Radiology'),
    ('pacs','PACS','/clinical-services/diagnostics/pacs',8,18,12,'PACS'),
    ('dicom-viewer','DICOM Viewer','/clinical-services/diagnostics/dicom-viewer',8,18,12,'DICOM'),
    ('radiology-reporting','Radiology Reporting','/clinical-services/diagnostics/radiology-reporting',7,16,14,'Radiology'),
    ('ai-radiology','AI Radiology Assist','/clinical-services/diagnostics/ai-radiology',6,14,14,'AI'),
    ('ivf-integration','IVF Lab Integration','/clinical-services/diagnostics/ivf-integration',5,12,12,'IVF'),
    ('home-collection','Home Collection','/clinical-services/diagnostics/home-collection',7,16,12,'Home Collection')
),
screen_rows AS (
  SELECT modules.*, generate_series(1, screen_count) AS n FROM modules
)
INSERT INTO diagnostic_screen_definitions (
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
  jsonb_build_array('Patient', 'Order', 'Sample/Study', 'Result/Report', 'Audit'),
  jsonb_build_array('Tenant Scope', 'Hospital Scope', 'Branch Scope', 'Patient Context', 'Diagnostic Context'),
  jsonb_build_array('Create', 'Collect/Acquire', 'Process', 'Verify', 'Approve', 'Release', 'Audit'),
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
modules(module_key, module_name, api_count) AS (
  VALUES
    ('dashboard','Diagnostic Dashboard',16),('test-master','Test Master',16),('packages','Test Packages',14),
    ('lab-orders','Lab Order Management',18),('sample-collection','Sample Collection',16),('sample-tracking','Sample Tracking',14),
    ('hematology','Hematology',14),('biochemistry','Biochemistry',14),('hormone-lab','Hormone Lab',14),
    ('microbiology','Microbiology',14),('histopathology','Histopathology',12),('cytology','Cytology',12),
    ('genetics','Genetics',12),('result-entry','Lab Result Entry',18),('lab-reports','Lab Report Generation',16),
    ('quality-control','Lab Quality Control',12),('radiology-orders','Radiology Orders',16),('radiology-scheduling','RIS Scheduling',12),
    ('ultrasound','Ultrasound',14),('xray','X-Ray',10),('ct','CT Scan',10),('mri','MRI',10),('mammography','Mammography',10),
    ('pacs','PACS',18),('dicom-viewer','DICOM Viewer',18),('radiology-reporting','Radiology Reporting',16),
    ('ai-radiology','AI Radiology Assist',14),('ivf-integration','IVF Lab Integration',12),('home-collection','Home Collection',16)
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
)
INSERT INTO diagnostic_api_endpoint_definitions (
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
  '/api/clinical/diagnostics/' || api_rows.module_key || '/' || api_rows.n,
  'clinical.diagnostics.' || replace(api_rows.module_key, '-', '_') || '.execute',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','clinic_id','required'),
  jsonb_build_object('audit','required','timeline','required','radiologist_review_required', api_rows.module_key = 'ai-radiology'),
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
    ('dashboard','Diagnostic Dashboard','Operational',12),('test-master','Test Master','Laboratory',10),
    ('packages','Test Packages','Financial',10),('lab-orders','Lab Orders','Operational',12),
    ('sample-collection','Sample Collection','Operational',12),('sample-tracking','Sample Tracking','Operational',10),
    ('hematology','Hematology','Clinical',8),('biochemistry','Biochemistry','Clinical',8),
    ('hormone-lab','Hormone Lab','Clinical',10),('microbiology','Microbiology','Clinical',10),
    ('histopathology','Histopathology','Clinical',8),('cytology','Cytology','Clinical',8),
    ('genetics','Genetics','Clinical',10),('result-entry','Result Entry','Clinical',12),
    ('lab-reports','Lab Reports','Operational',16),('quality-control','Quality Control','Quality',12),
    ('radiology-orders','Radiology Orders','Radiology',10),('radiology-scheduling','RIS Scheduling','Radiology',8),
    ('ultrasound','Ultrasound','Radiology',10),('xray','X-Ray','Radiology',6),('ct','CT Scan','Radiology',6),
    ('mri','MRI','Radiology',6),('mammography','Mammography','Radiology',6),('pacs','PACS','PACS',12),
    ('dicom-viewer','DICOM Viewer','DICOM',12),('radiology-reporting','Radiology Reporting','Radiology',14),
    ('ai-radiology','AI Radiology Assist','AI',14),('ivf-integration','IVF Lab Integration','IVF',12),
    ('home-collection','Home Collection','Operational',12)
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO diagnostic_report_definitions (
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
  jsonb_build_object('source','database','scope','tenant_hospital_branch_clinic','review_required', report_rows.module_key IN ('ai-radiology','dicom-viewer')),
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
