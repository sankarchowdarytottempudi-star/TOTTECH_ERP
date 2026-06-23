-- TOTTECH Clinical Services - Phase 15 Screen-Level Business Specification

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

CREATE TABLE IF NOT EXISTS clinical_business_screens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  screen_id VARCHAR(80) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  module_name VARCHAR(160) NOT NULL,
  role_access JSONB DEFAULT '[]'::jsonb,
  business_rules JSONB DEFAULT '[]'::jsonb,
  workflow_states JSONB DEFAULT '[]'::jsonb,
  notifications JSONB DEFAULT '[]'::jsonb,
  reports JSONB DEFAULT '[]'::jsonb,
  audit_events JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, screen_id)
);

CREATE TABLE IF NOT EXISTS clinical_business_screen_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  screen_id VARCHAR(80) NOT NULL,
  field_key VARCHAR(160) NOT NULL,
  field_label VARCHAR(255) NOT NULL,
  field_type VARCHAR(80) NOT NULL,
  mandatory BOOLEAN DEFAULT false,
  validation_summary TEXT,
  validation_rules JSONB DEFAULT '[]'::jsonb,
  dropdown_group VARCHAR(160),
  data_masking VARCHAR(120),
  sort_order INTEGER DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, screen_id, field_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_dropdown_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dropdown_group VARCHAR(160) NOT NULL,
  value_key VARCHAR(160) NOT NULL,
  value_label VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, dropdown_group, value_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_validation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  rule_key VARCHAR(220) NOT NULL,
  screen_id VARCHAR(80),
  field_key VARCHAR(160),
  rule_type VARCHAR(120) NOT NULL,
  severity VARCHAR(80) DEFAULT 'ERROR',
  rule_expression TEXT NOT NULL,
  message TEXT NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, rule_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  workflow_key VARCHAR(160) NOT NULL,
  workflow_name VARCHAR(255) NOT NULL,
  module_name VARCHAR(160) NOT NULL,
  description TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, workflow_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_workflow_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  workflow_key VARCHAR(160) NOT NULL,
  state_key VARCHAR(160) NOT NULL,
  state_name VARCHAR(255) NOT NULL,
  state_order INTEGER NOT NULL,
  allowed_roles JSONB DEFAULT '[]'::jsonb,
  entry_rules JSONB DEFAULT '[]'::jsonb,
  exit_rules JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, workflow_key, state_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_approval_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  approval_key VARCHAR(180) NOT NULL,
  approval_type VARCHAR(120) NOT NULL,
  condition_label VARCHAR(180) NOT NULL,
  condition_expression TEXT NOT NULL,
  approver_role VARCHAR(180) NOT NULL,
  audit_required BOOLEAN DEFAULT true,
  reason_required BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, approval_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_id VARCHAR(80) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  module_name VARCHAR(160) NOT NULL,
  description TEXT,
  supported_formats JSONB DEFAULT '["PDF","Excel","CSV","JSON"]'::jsonb,
  permission_key VARCHAR(220),
  audit_required BOOLEAN DEFAULT true,
  reason_required BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_id)
);

CREATE TABLE IF NOT EXISTS clinical_business_report_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_id VARCHAR(80) NOT NULL,
  column_key VARCHAR(160) NOT NULL,
  column_label VARCHAR(255) NOT NULL,
  data_type VARCHAR(80) DEFAULT 'Text',
  sort_order INTEGER DEFAULT 0,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_id, column_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_export_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  export_key VARCHAR(180) NOT NULL,
  export_format VARCHAR(80) NOT NULL,
  permission_required BOOLEAN DEFAULT true,
  audit_required BOOLEAN DEFAULT true,
  reason_required BOOLEAN DEFAULT true,
  applies_to JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, export_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_communication_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  template_key VARCHAR(180) NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  channel VARCHAR(80) NOT NULL,
  trigger_event VARCHAR(180),
  subject_template TEXT,
  body_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  approval_required BOOLEAN DEFAULT false,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, template_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_audit_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  audit_key VARCHAR(180) NOT NULL,
  action_key VARCHAR(120) NOT NULL,
  module_name VARCHAR(160) NOT NULL,
  entity_type VARCHAR(160),
  reason_required BOOLEAN DEFAULT false,
  old_new_required BOOLEAN DEFAULT false,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, audit_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_sensitive_access_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  sensitive_key VARCHAR(180) NOT NULL,
  sensitive_area VARCHAR(180) NOT NULL,
  fields JSONB DEFAULT '[]'::jsonb,
  allowed_roles JSONB DEFAULT '[]'::jsonb,
  audit_event VARCHAR(180) NOT NULL,
  masking_required BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, sensitive_key)
);

CREATE TABLE IF NOT EXISTS clinical_business_document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  template_key VARCHAR(180) NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  module_name VARCHAR(160) NOT NULL,
  output_formats JSONB DEFAULT '["PDF"]'::jsonb,
  required_sections JSONB DEFAULT '[]'::jsonb,
  signer_roles JSONB DEFAULT '[]'::jsonb,
  audit_event VARCHAR(180),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, template_key)
);

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
screens(screen_id, screen_name, module_name, role_access, business_rules, workflow_states, notifications, reports, audit_events) AS (
  VALUES
    ('SCREEN-001','Patient Registration','Patient','["Receptionist","Doctor","Hospital Admin"]'::jsonb,'["Mobile Number Must Be Unique","ABHA Can Be Linked Later","Patient Cannot Be Deleted","Duplicate Detection Required"]'::jsonb,'["Registered","Verified","Active"]'::jsonb,'["registration_success"]'::jsonb,'["Daily OP Report"]'::jsonb,'["Patient Created","Patient Updated","Patient Viewed","Patient Exported"]'::jsonb),
    ('SCREEN-002','Appointment Booking','Appointments','["Receptionist","Doctor","Patient"]'::jsonb,'["Doctor Must Be Active","Slot Must Be Available","Patient Must Be Active"]'::jsonb,'["Booked","Confirmed","Checked In","Consultation Started","Completed","Cancelled","No Show"]'::jsonb,'["appointment_confirmation","appointment_reminder"]'::jsonb,'["Daily OP Report"]'::jsonb,'["Appointment Booked","Appointment Updated","Appointment Cancelled","Appointment Viewed"]'::jsonb),
    ('SCREEN-003','OP Consultation','OP','["Doctor","Nurse","Hospital Admin"]'::jsonb,'["Diagnosis Required Before Closing Visit","Prescription Requires Active Doctor","Orders Must Be Linked To Visit"]'::jsonb,'["Started","Diagnosis Added","Orders Raised","Prescription Added","Closed"]'::jsonb,'["prescription_added"]'::jsonb,'["Daily OP Report"]'::jsonb,'["Consultation Created","Diagnosis Added","Prescription Added","Consultation Closed"]'::jsonb),
    ('SCREEN-004','IVF Cycle','IVF','["IVF Doctor","IVF Coordinator","Embryologist"]'::jsonb,'["Female Assessment Required","Male Assessment Required","Consent Uploaded"]'::jsonb,'["Planned","Started","Stimulation","Retrieval","Embryology","Transfer","Completed"]'::jsonb,'["ivf_appointment_reminder"]'::jsonb,'["IVF Success Report"]'::jsonb,'["IVF Cycle Created","IVF Cycle Updated","IVF Cycle Completed"]'::jsonb),
    ('SCREEN-005','Embryology','IVF','["IVF Doctor","Embryologist","IVF Coordinator"]'::jsonb,'["Embryo grade is mandatory","Storage location required for frozen embryos","Discarded embryos require approval"]'::jsonb,'["Fresh","Frozen","Transferred","Discarded","Donated"]'::jsonb,'[]'::jsonb,'["IVF Success Report"]'::jsonb,'["Embryo Created","Embryo Updated","Embryo Transferred","Embryo Discarded"]'::jsonb),
    ('SCREEN-006','Lab Result Entry','Laboratory','["Lab Technician","Lab Manager","Doctor"]'::jsonb,'["Numeric Values Only","Critical Result Detection","Out Of Range Alerts"]'::jsonb,'["Draft","Entered","Critical Flagged","Approved","Released"]'::jsonb,'["lab_report_ready","lab_result_ready"]'::jsonb,'["Lab Revenue Report"]'::jsonb,'["Lab Result Entered","Lab Result Approved","Lab Result Released"]'::jsonb),
    ('SCREEN-007','Claim Submission','Insurance','["Insurance Executive","Insurance Manager","Finance Manager"]'::jsonb,'["Discharge Summary Required","Supporting Documents Required","Approval Required"]'::jsonb,'["Draft","Submitted","Review","Approved","Settlement"]'::jsonb,'[]'::jsonb,'["Referral Revenue Report"]'::jsonb,'["Claim Created","Claim Submitted","Claim Approved","Claim Settled"]'::jsonb)
)
INSERT INTO clinical_business_screens (
  tenant_id, hospital_id, branch_id, clinic_id, screen_id, screen_name, module_name, role_access, business_rules, workflow_states, notifications, reports, audit_events, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, screens.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN screens
ON CONFLICT (tenant_id, hospital_id, branch_id, screen_id)
DO UPDATE SET screen_name=EXCLUDED.screen_name, module_name=EXCLUDED.module_name, role_access=EXCLUDED.role_access, business_rules=EXCLUDED.business_rules, workflow_states=EXCLUDED.workflow_states, notifications=EXCLUDED.notifications, reports=EXCLUDED.reports, audit_events=EXCLUDED.audit_events, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
fields(screen_id, field_key, field_label, field_type, mandatory, validation_summary, validation_rules, dropdown_group, data_masking, sort_order) AS (
  VALUES
    ('SCREEN-001','first_name','First Name','Text',true,'2-100 chars','["min:2","max:100"]'::jsonb,NULL,NULL,10),
    ('SCREEN-001','last_name','Last Name','Text',true,'2-100 chars','["min:2","max:100"]'::jsonb,NULL,NULL,20),
    ('SCREEN-001','gender','Gender','Dropdown',true,'Required','["required"]'::jsonb,'gender',NULL,30),
    ('SCREEN-001','dob','DOB','Date',true,'Past Date Only','["required","pastDate"]'::jsonb,NULL,NULL,40),
    ('SCREEN-001','mobile','Mobile','Mobile',true,'Unique','["required","mobile","unique"]'::jsonb,NULL,'mobile_mask',50),
    ('SCREEN-001','email','Email','Email',false,'Valid Email','["email"]'::jsonb,NULL,NULL,60),
    ('SCREEN-001','abha_id','ABHA ID','Text',false,'ABDM Validation','["abdm"]'::jsonb,NULL,'abha_mask',70),
    ('SCREEN-001','aadhaar','Aadhaar','Text',false,'Masked','["aadhaar"]'::jsonb,NULL,'aadhaar_mask',80),
    ('SCREEN-001','blood_group','Blood Group','Dropdown',false,'Valid blood group','["dropdown"]'::jsonb,'blood_group',NULL,90),
    ('SCREEN-002','doctor','Doctor','Lookup',true,'Doctor Must Be Active','["required","activeDoctor"]'::jsonb,NULL,NULL,10),
    ('SCREEN-002','department','Department','Dropdown',true,'Department required','["required"]'::jsonb,'department',NULL,20),
    ('SCREEN-002','date','Date','Date',true,'Appointment date required','["required","futureOrToday"]'::jsonb,NULL,NULL,30),
    ('SCREEN-002','time','Time','Time',true,'Slot Must Be Available','["required","availableSlot"]'::jsonb,NULL,NULL,40),
    ('SCREEN-002','visit_type','Visit Type','Dropdown',true,'Visit type required','["required"]'::jsonb,'visit_type',NULL,50),
    ('SCREEN-002','reason','Reason','Textarea',false,'Reason optional','[]'::jsonb,NULL,NULL,60),
    ('SCREEN-002','referral','Referral','Lookup',false,'Referral optional','[]'::jsonb,NULL,NULL,70),
    ('SCREEN-002','insurance','Insurance','Lookup',false,'Insurance optional','[]'::jsonb,NULL,'insurance_mask',80),
    ('SCREEN-003','chief_complaint','Chief Complaint','Textarea',true,'Mandatory','["required"]'::jsonb,NULL,NULL,10),
    ('SCREEN-003','diagnosis','Diagnosis','Textarea',true,'Diagnosis Required Before Closing Visit','["requiredBeforeClose"]'::jsonb,NULL,NULL,20),
    ('SCREEN-003','doctor','Doctor','Lookup',true,'Doctor required','["required"]'::jsonb,NULL,NULL,30),
    ('SCREEN-003','history','History','Textarea',false,'Optional','[]'::jsonb,NULL,NULL,40),
    ('SCREEN-003','notes','Notes','Textarea',false,'Optional','[]'::jsonb,NULL,NULL,50),
    ('SCREEN-003','orders','Orders','Repeater',false,'Optional orders','[]'::jsonb,NULL,NULL,60),
    ('SCREEN-003','prescription','Prescription','Repeater',false,'Optional prescription','[]'::jsonb,NULL,NULL,70),
    ('SCREEN-004','cycle_number','Cycle Number','Text',true,'Required unique per couple','["required","uniquePerCouple"]'::jsonb,NULL,NULL,10),
    ('SCREEN-004','protocol','Protocol','Dropdown',true,'Required','["required"]'::jsonb,'ivf_protocol',NULL,20),
    ('SCREEN-004','start_date','Start Date','Date',true,'Required','["required"]'::jsonb,NULL,NULL,30),
    ('SCREEN-004','doctor','Doctor','Lookup',true,'Doctor required','["required"]'::jsonb,NULL,NULL,40),
    ('SCREEN-004','coordinator','Coordinator','Lookup',true,'Coordinator required','["required"]'::jsonb,NULL,NULL,50),
    ('SCREEN-005','embryo_id','Embryo ID','Text',true,'Required','["required"]'::jsonb,NULL,NULL,10),
    ('SCREEN-005','grade','Grade','Dropdown',true,'Required','["required"]'::jsonb,'embryo_grade',NULL,20),
    ('SCREEN-005','day','Day','Number',true,'Numeric','["required","numeric"]'::jsonb,NULL,NULL,30),
    ('SCREEN-005','status','Status','Dropdown',true,'Required','["required"]'::jsonb,'embryo_status',NULL,40),
    ('SCREEN-005','storage_location','Storage Location','Text',false,'Required if frozen','["requiredIf:status=Frozen"]'::jsonb,NULL,NULL,50),
    ('SCREEN-006','parameter','Parameter','Text',true,'Required','["required"]'::jsonb,NULL,NULL,10),
    ('SCREEN-006','observed_value','Observed Value','Number',true,'Numeric Values Only','["required","numeric"]'::jsonb,NULL,NULL,20),
    ('SCREEN-006','units','Units','Text',true,'Required','["required"]'::jsonb,NULL,NULL,30),
    ('SCREEN-006','reference_range','Reference Range','Text',true,'Required','["required"]'::jsonb,NULL,NULL,40),
    ('SCREEN-007','claim_number','Claim Number','Text',true,'Required unique','["required","unique"]'::jsonb,NULL,NULL,10),
    ('SCREEN-007','patient','Patient','Lookup',true,'Required','["required"]'::jsonb,NULL,NULL,20),
    ('SCREEN-007','insurance','Insurance','Lookup',true,'Required','["required"]'::jsonb,NULL,'insurance_mask',30),
    ('SCREEN-007','diagnosis','Diagnosis','Textarea',true,'Required','["required"]'::jsonb,NULL,NULL,40),
    ('SCREEN-007','amount','Amount','Currency',true,'Positive amount','["required","positive"]'::jsonb,NULL,NULL,50)
)
INSERT INTO clinical_business_screen_fields (
  tenant_id, hospital_id, branch_id, clinic_id, screen_id, field_key, field_label, field_type, mandatory, validation_summary, validation_rules, dropdown_group, data_masking, sort_order, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, fields.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN fields
ON CONFLICT (tenant_id, hospital_id, branch_id, screen_id, field_key)
DO UPDATE SET field_label=EXCLUDED.field_label, field_type=EXCLUDED.field_type, mandatory=EXCLUDED.mandatory, validation_summary=EXCLUDED.validation_summary, validation_rules=EXCLUDED.validation_rules, dropdown_group=EXCLUDED.dropdown_group, data_masking=EXCLUDED.data_masking, sort_order=EXCLUDED.sort_order, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
values(dropdown_group, value_key, value_label, sort_order) AS (
  VALUES
    ('gender','male','Male',10),('gender','female','Female',20),('gender','other','Other',30),
    ('blood_group','a_positive','A+',10),('blood_group','a_negative','A-',20),('blood_group','b_positive','B+',30),('blood_group','b_negative','B-',40),('blood_group','ab_positive','AB+',50),('blood_group','ab_negative','AB-',60),('blood_group','o_positive','O+',70),('blood_group','o_negative','O-',80),
    ('embryo_status','fresh','Fresh',10),('embryo_status','frozen','Frozen',20),('embryo_status','transferred','Transferred',30),('embryo_status','discarded','Discarded',40),('embryo_status','donated','Donated',50),
    ('visit_type','new','New Visit',10),('visit_type','follow_up','Follow Up',20),('visit_type','emergency','Emergency',30),('visit_type','telemedicine','Telemedicine',40),
    ('department','cardiology','Cardiology',10),('department','ivf','IVF',20),('department','pediatrics','Pediatrics',30),('department','laboratory','Laboratory',40),('department','radiology','Radiology',50),
    ('ivf_protocol','antagonist','Antagonist',10),('ivf_protocol','long_agonist','Long Agonist',20),('ivf_protocol','minimal_stimulation','Minimal Stimulation',30),('ivf_protocol','natural_cycle','Natural Cycle',40),
    ('embryo_grade','a','A',10),('embryo_grade','b','B',20),('embryo_grade','c','C',30),('embryo_grade','poor','Poor',40)
)
INSERT INTO clinical_business_dropdown_values (
  tenant_id, hospital_id, branch_id, clinic_id, dropdown_group, value_key, value_label, sort_order, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, values.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN values
ON CONFLICT (tenant_id, hospital_id, branch_id, dropdown_group, value_key)
DO UPDATE SET value_label=EXCLUDED.value_label, sort_order=EXCLUDED.sort_order, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
rules(rule_key, screen_id, field_key, rule_type, severity, rule_expression, message) AS (
  VALUES
    ('patient_mobile_unique','SCREEN-001','mobile','UNIQUE','ERROR','mobile must be unique per tenant','Mobile number already exists.'),
    ('patient_dob_past_date','SCREEN-001','dob','DATE','ERROR','dob < current_date','Date of birth must be a past date.'),
    ('patient_cannot_delete','SCREEN-001',NULL,'BUSINESS','ERROR','patient delete is prohibited','Patient records cannot be deleted.'),
    ('patient_duplicate_detection','SCREEN-001',NULL,'BUSINESS','WARNING','match name + dob + mobile before save','Possible duplicate patient detected.'),
    ('appointment_doctor_active','SCREEN-002','doctor','BUSINESS','ERROR','doctor.status = ACTIVE','Selected doctor must be active.'),
    ('appointment_slot_available','SCREEN-002','time','BUSINESS','ERROR','slot availability must be true','Selected appointment slot is not available.'),
    ('op_diagnosis_before_close','SCREEN-003','diagnosis','WORKFLOW','ERROR','diagnosis required before close','Diagnosis is required before closing visit.'),
    ('ivf_female_assessment_required','SCREEN-004',NULL,'WORKFLOW','ERROR','female assessment exists','Female assessment is required before IVF cycle start.'),
    ('ivf_male_assessment_required','SCREEN-004',NULL,'WORKFLOW','ERROR','male assessment exists','Male assessment is required before IVF cycle start.'),
    ('ivf_consent_uploaded','SCREEN-004',NULL,'DOCUMENT','ERROR','signed consent uploaded','Consent must be uploaded before IVF cycle start.'),
    ('lab_numeric_values_only','SCREEN-006','observed_value','TYPE','ERROR','observed_value numeric','Observed value must be numeric.'),
    ('lab_critical_result_detection','SCREEN-006','observed_value','CLINICAL_ALERT','WARNING','observed_value outside critical threshold','Critical result detected.'),
    ('claim_discharge_summary_required','SCREEN-007',NULL,'DOCUMENT','ERROR','discharge summary attached','Discharge summary is required for claim submission.'),
    ('claim_documents_required','SCREEN-007',NULL,'DOCUMENT','ERROR','supporting documents attached','Supporting documents are required.'),
    ('claim_approval_required','SCREEN-007',NULL,'APPROVAL','ERROR','insurance manager approval exists','Approval is required before claim submission.')
)
INSERT INTO clinical_business_validation_rules (
  tenant_id, hospital_id, branch_id, clinic_id, rule_key, screen_id, field_key, rule_type, severity, rule_expression, message, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, rules.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN rules
ON CONFLICT (tenant_id, hospital_id, branch_id, rule_key)
DO UPDATE SET screen_id=EXCLUDED.screen_id, field_key=EXCLUDED.field_key, rule_type=EXCLUDED.rule_type, severity=EXCLUDED.severity, rule_expression=EXCLUDED.rule_expression, message=EXCLUDED.message, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
workflows(workflow_key, workflow_name, module_name, description) AS (
  VALUES
    ('patient_workflow','Patient Workflow','Patient','Registration to appointment, consultation, investigation, billing, and follow-up.'),
    ('ip_workflow','IP Workflow','IP','Admission, bed allocation, treatment, billing, and discharge.'),
    ('ivf_workflow','IVF Workflow','IVF','Registration, assessment, protocol, stimulation, retrieval, embryology, transfer, pregnancy, and outcome.'),
    ('claim_workflow','Claim Workflow','Insurance','Draft, submitted, review, approved, and settlement.')
)
INSERT INTO clinical_business_workflows (
  tenant_id, hospital_id, branch_id, clinic_id, workflow_key, workflow_name, module_name, description, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, workflows.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN workflows
ON CONFLICT (tenant_id, hospital_id, branch_id, workflow_key)
DO UPDATE SET workflow_name=EXCLUDED.workflow_name, module_name=EXCLUDED.module_name, description=EXCLUDED.description, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
states(workflow_key, state_key, state_name, state_order) AS (
  VALUES
    ('patient_workflow','registration','Registration',10),('patient_workflow','appointment','Appointment',20),('patient_workflow','consultation','Consultation',30),('patient_workflow','investigation','Investigation',40),('patient_workflow','billing','Billing',50),('patient_workflow','follow_up','Follow Up',60),
    ('ip_workflow','admission','Admission',10),('ip_workflow','bed_allocation','Bed Allocation',20),('ip_workflow','treatment','Treatment',30),('ip_workflow','billing','Billing',40),('ip_workflow','discharge','Discharge',50),
    ('ivf_workflow','registration','Registration',10),('ivf_workflow','assessment','Assessment',20),('ivf_workflow','protocol_selection','Protocol Selection',30),('ivf_workflow','stimulation','Stimulation',40),('ivf_workflow','retrieval','Retrieval',50),('ivf_workflow','embryology','Embryology',60),('ivf_workflow','transfer','Transfer',70),('ivf_workflow','pregnancy','Pregnancy',80),('ivf_workflow','outcome','Outcome',90),
    ('claim_workflow','draft','Draft',10),('claim_workflow','submitted','Submitted',20),('claim_workflow','review','Review',30),('claim_workflow','approved','Approved',40),('claim_workflow','settlement','Settlement',50)
)
INSERT INTO clinical_business_workflow_states (
  tenant_id, hospital_id, branch_id, clinic_id, workflow_key, state_key, state_name, state_order, allowed_roles, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, states.*, '["Hospital Admin","Doctor","Nurse","Receptionist","Finance Manager","Insurance Manager"]'::jsonb, scope.user_id, scope.user_id
FROM scope CROSS JOIN states
ON CONFLICT (tenant_id, hospital_id, branch_id, workflow_key, state_key)
DO UPDATE SET state_name=EXCLUDED.state_name, state_order=EXCLUDED.state_order, allowed_roles=EXCLUDED.allowed_roles, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
approvals(approval_key, approval_type, condition_label, condition_expression, approver_role) AS (
  VALUES
    ('refund_lt_5000','Refund','< ₹5,000','amount < 5000','Billing Manager'),
    ('refund_5000_50000','Refund','₹5,000 - ₹50,000','amount >= 5000 AND amount <= 50000','Finance Manager'),
    ('refund_gt_50000','Refund','> ₹50,000','amount > 50000','Hospital Admin'),
    ('discount_lt_10','Discount','<10%','discount_percent < 10','Billing Executive'),
    ('discount_10_25','Discount','10%-25%','discount_percent >= 10 AND discount_percent <= 25','Billing Manager'),
    ('discount_gt_25','Discount','>25%','discount_percent > 25','Hospital Admin')
)
INSERT INTO clinical_business_approval_rules (
  tenant_id, hospital_id, branch_id, clinic_id, approval_key, approval_type, condition_label, condition_expression, approver_role, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, approvals.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN approvals
ON CONFLICT (tenant_id, hospital_id, branch_id, approval_key)
DO UPDATE SET approval_type=EXCLUDED.approval_type, condition_label=EXCLUDED.condition_label, condition_expression=EXCLUDED.condition_expression, approver_role=EXCLUDED.approver_role, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
reports(report_id, report_name, module_name, description) AS (
  VALUES
    ('REPORT-001','Daily OP Report','OP','Date, doctor, department, patients seen, revenue, and follow-up report.'),
    ('REPORT-002','Daily Admission Report','IP','Admission number, patient, doctor, ward, room, bed, and admission date report.'),
    ('REPORT-003','IVF Success Report','IVF','Cycle number, doctor, age group, protocol, transfer date, and outcome report.'),
    ('REPORT-004','Lab Revenue Report','Laboratory','Date, department, tests, and revenue report.'),
    ('REPORT-005','Referral Revenue Report','Referral','Referral name, patients, revenue, and commission report.')
)
INSERT INTO clinical_business_reports (
  tenant_id, hospital_id, branch_id, clinic_id, report_id, report_name, module_name, description, permission_key, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, reports.*, 'clinical.reports.' || lower(replace(reports.report_id,'-','_')), scope.user_id, scope.user_id
FROM scope CROSS JOIN reports
ON CONFLICT (tenant_id, hospital_id, branch_id, report_id)
DO UPDATE SET report_name=EXCLUDED.report_name, module_name=EXCLUDED.module_name, description=EXCLUDED.description, permission_key=EXCLUDED.permission_key, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
columns(report_id, column_key, column_label, data_type, sort_order) AS (
  VALUES
    ('REPORT-001','date','Date','Date',10),('REPORT-001','doctor','Doctor','Text',20),('REPORT-001','department','Department','Text',30),('REPORT-001','patients_seen','Patients Seen','Number',40),('REPORT-001','revenue','Revenue','Currency',50),('REPORT-001','follow_ups','Follow Ups','Number',60),
    ('REPORT-002','admission_number','Admission Number','Text',10),('REPORT-002','patient','Patient','Text',20),('REPORT-002','doctor','Doctor','Text',30),('REPORT-002','ward','Ward','Text',40),('REPORT-002','room','Room','Text',50),('REPORT-002','bed','Bed','Text',60),('REPORT-002','admission_date','Admission Date','Date',70),
    ('REPORT-003','cycle_number','Cycle Number','Text',10),('REPORT-003','doctor','Doctor','Text',20),('REPORT-003','age_group','Age Group','Text',30),('REPORT-003','protocol','Protocol','Text',40),('REPORT-003','transfer_date','Transfer Date','Date',50),('REPORT-003','outcome','Outcome','Text',60),
    ('REPORT-004','date','Date','Date',10),('REPORT-004','department','Department','Text',20),('REPORT-004','tests','Tests','Number',30),('REPORT-004','revenue','Revenue','Currency',40),
    ('REPORT-005','referral_name','Referral Name','Text',10),('REPORT-005','patients','Patients','Number',20),('REPORT-005','revenue','Revenue','Currency',30),('REPORT-005','commission','Commission','Currency',40)
)
INSERT INTO clinical_business_report_columns (
  tenant_id, hospital_id, branch_id, clinic_id, report_id, column_key, column_label, data_type, sort_order, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, columns.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN columns
ON CONFLICT (tenant_id, hospital_id, branch_id, report_id, column_key)
DO UPDATE SET column_label=EXCLUDED.column_label, data_type=EXCLUDED.data_type, sort_order=EXCLUDED.sort_order, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
exports(export_key, export_format) AS (
  VALUES ('export_pdf','PDF'),('export_excel','Excel'),('export_csv','CSV'),('export_json','JSON')
)
INSERT INTO clinical_business_export_rules (
  tenant_id, hospital_id, branch_id, clinic_id, export_key, export_format, applies_to, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, exports.export_key, exports.export_format, '["Reports","Patient","Finance","Insurance","IVF","Lab"]'::jsonb, scope.user_id, scope.user_id
FROM scope CROSS JOIN exports
ON CONFLICT (tenant_id, hospital_id, branch_id, export_key)
DO UPDATE SET export_format=EXCLUDED.export_format, applies_to=EXCLUDED.applies_to, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
templates(template_key, template_name, channel, trigger_event, subject_template, body_template, variables) AS (
  VALUES
    ('email_appointment_confirmation','Appointment Confirmation','Email','AppointmentConfirmed','Appointment Confirmed','Dear {PatientName},\n\nYour appointment with Dr. {DoctorName}\nhas been confirmed for {Date} at {Time}.\n\nThank you.','["PatientName","DoctorName","Date","Time"]'::jsonb),
    ('email_lab_report_ready','Lab Report Ready','Email','LabReportReady','Lab Report Available','Dear {PatientName},\n\nYour laboratory report is ready.\n\nPlease login to the patient portal to view.\n\nThank you.','["PatientName"]'::jsonb),
    ('sms_appointment_reminder','Appointment Reminder','SMS','AppointmentReminder',NULL,'Reminder:\nYou have an appointment with\nDr {DoctorName}\non {Date} at {Time}.','["DoctorName","Date","Time"]'::jsonb),
    ('sms_payment_reminder','Payment Reminder','SMS','PaymentReminder',NULL,'Dear {PatientName},\n\nOutstanding balance:\n{Amount}\n\nPlease make payment.','["PatientName","Amount"]'::jsonb),
    ('whatsapp_registration_success','Registration Success','WhatsApp','PatientCreated',NULL,'Dear {PatientName},\n\nWelcome to {HospitalName}.\n\nYour UHID:\n{UHID}\n\nThank you.','["PatientName","HospitalName","UHID"]'::jsonb),
    ('whatsapp_ivf_appointment_reminder','IVF Appointment Reminder','WhatsApp','IvfAppointmentReminder',NULL,'Dear {PatientName},\n\nYour IVF monitoring appointment\nis scheduled on {Date}.\n\nPlease arrive 15 minutes early.','["PatientName","Date"]'::jsonb),
    ('push_lab_result_ready','Lab Result Ready','Push','LabResultReady',NULL,'Your lab result is now available.','[]'::jsonb),
    ('push_prescription_added','Prescription Added','Push','PrescriptionAdded',NULL,'A new prescription has been added by your doctor.','[]'::jsonb)
)
INSERT INTO clinical_business_communication_templates (
  tenant_id, hospital_id, branch_id, clinic_id, template_key, template_name, channel, trigger_event, subject_template, body_template, variables, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, templates.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN templates
ON CONFLICT (tenant_id, hospital_id, branch_id, template_key)
DO UPDATE SET template_name=EXCLUDED.template_name, channel=EXCLUDED.channel, trigger_event=EXCLUDED.trigger_event, subject_template=EXCLUDED.subject_template, body_template=EXCLUDED.body_template, variables=EXCLUDED.variables, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
actions(action_key) AS (VALUES ('Create'),('Update'),('Delete'),('View'),('Export'),('Print'),('Share')),
modules(module_name) AS (VALUES ('Patient'),('Appointments'),('OP'),('IP'),('IVF'),('Laboratory'),('Radiology'),('Pharmacy'),('Billing'),('Insurance'),('Referral'),('Finance'),('Reports'))
INSERT INTO clinical_business_audit_rules (
  tenant_id, hospital_id, branch_id, clinic_id, audit_key, action_key, module_name, entity_type, reason_required, old_new_required, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower(modules.module_name || '_' || actions.action_key),
  actions.action_key,
  modules.module_name,
  modules.module_name,
  actions.action_key IN ('Export','Print','Share','Delete'),
  actions.action_key IN ('Update','Delete'),
  scope.user_id, scope.user_id
FROM scope CROSS JOIN actions CROSS JOIN modules
ON CONFLICT (tenant_id, hospital_id, branch_id, audit_key)
DO UPDATE SET action_key=EXCLUDED.action_key, module_name=EXCLUDED.module_name, entity_type=EXCLUDED.entity_type, reason_required=EXCLUDED.reason_required, old_new_required=EXCLUDED.old_new_required, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
sensitive(sensitive_key, sensitive_area, fields, allowed_roles, audit_event) AS (
  VALUES
    ('abha_access','ABHA','["ABHA ID","ABHA Consent","ABDM Link"]'::jsonb,'["Hospital Admin","Doctor","Receptionist"]'::jsonb,'Sensitive ABHA Viewed'),
    ('aadhaar_access','Aadhaar','["Aadhaar"]'::jsonb,'["Hospital Admin","Finance Manager"]'::jsonb,'Sensitive Aadhaar Viewed'),
    ('insurance_access','Insurance','["Insurance Policy","Claim Settlement","Policy Number"]'::jsonb,'["Insurance Executive","Insurance Manager","Finance Manager"]'::jsonb,'Sensitive Insurance Viewed'),
    ('embryology_access','Embryology Records','["Embryo ID","Grade","Storage Location","Outcome"]'::jsonb,'["IVF Doctor","Embryologist","Hospital Admin"]'::jsonb,'Sensitive Embryology Viewed'),
    ('financial_access','Financial Records','["Invoice","Payment","Refund","Settlement"]'::jsonb,'["Billing Executive","Finance Manager","Hospital Admin"]'::jsonb,'Sensitive Financial Viewed')
)
INSERT INTO clinical_business_sensitive_access_rules (
  tenant_id, hospital_id, branch_id, clinic_id, sensitive_key, sensitive_area, fields, allowed_roles, audit_event, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, sensitive.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN sensitive
ON CONFLICT (tenant_id, hospital_id, branch_id, sensitive_key)
DO UPDATE SET sensitive_area=EXCLUDED.sensitive_area, fields=EXCLUDED.fields, allowed_roles=EXCLUDED.allowed_roles, audit_event=EXCLUDED.audit_event, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
docs(template_key, template_name, module_name, required_sections, signer_roles, audit_event) AS (
  VALUES
    ('prescription','Prescription','OP','["Patient","Doctor","Diagnosis","Medicines","Instructions"]'::jsonb,'["Doctor"]'::jsonb,'Prescription Generated'),
    ('discharge_summary','Discharge Summary','IP','["Admission","Treatment","Diagnosis","Procedures","Discharge Advice","Follow Up"]'::jsonb,'["Doctor","Hospital Admin"]'::jsonb,'Discharge Summary Generated'),
    ('lab_report','Lab Report','Laboratory','["Patient","Sample","Parameters","Observed Values","Reference Range","Approval"]'::jsonb,'["Lab Manager"]'::jsonb,'Lab Report Generated'),
    ('radiology_report','Radiology Report','Radiology','["Patient","Study","Findings","Impression","Images","Approval"]'::jsonb,'["Radiologist"]'::jsonb,'Radiology Report Generated'),
    ('insurance_claim','Insurance Claim','Insurance','["Patient","Policy","Diagnosis","Invoice","Documents","Submission"]'::jsonb,'["Insurance Manager"]'::jsonb,'Insurance Claim Generated'),
    ('consent_form','Consent Form','Patient','["Patient","Procedure","Risks","Consent","Witness"]'::jsonb,'["Patient","Doctor"]'::jsonb,'Consent Form Generated'),
    ('ivf_consent','IVF Consent','IVF','["Couple","Protocol","Risks","Consent","Counselor"]'::jsonb,'["IVF Doctor","Patient"]'::jsonb,'IVF Consent Generated'),
    ('embryology_report','Embryology Report','IVF','["Cycle","Embryos","Grades","Storage","Transfer","Outcome"]'::jsonb,'["Embryologist","IVF Doctor"]'::jsonb,'Embryology Report Generated')
)
INSERT INTO clinical_business_document_templates (
  tenant_id, hospital_id, branch_id, clinic_id, template_key, template_name, module_name, required_sections, signer_roles, audit_event, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, docs.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN docs
ON CONFLICT (tenant_id, hospital_id, branch_id, template_key)
DO UPDATE SET template_name=EXCLUDED.template_name, module_name=EXCLUDED.module_name, required_sections=EXCLUDED.required_sections, signer_roles=EXCLUDED.signer_roles, audit_event=EXCLUDED.audit_event, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

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
    ('business_spec_core','Business Specs','/clinical-services/business-spec','Clinical Business Specification','clinical.business_spec.read',1610),
    ('business_spec_screens','Screen Fields','/clinical-services/business-spec/screens','Clinical Business Specification','clinical.business_spec.screens',1620),
    ('business_spec_validations','Validation Rules','/clinical-services/business-spec/validations','Clinical Business Specification','clinical.business_spec.validations',1630),
    ('business_spec_workflows','Workflows','/clinical-services/business-spec/workflows','Clinical Business Specification','clinical.business_spec.workflows',1640),
    ('business_spec_approvals','Approval Matrix','/clinical-services/business-spec/approvals','Clinical Business Specification','clinical.business_spec.approvals',1650),
    ('business_spec_reports','Report Definitions','/clinical-services/business-spec/reports','Clinical Business Specification','clinical.business_spec.reports',1660),
    ('business_spec_exports','Export Rules','/clinical-services/business-spec/exports','Clinical Business Specification','clinical.business_spec.exports',1670),
    ('business_spec_templates','Communication Templates','/clinical-services/business-spec/templates','Clinical Business Specification','clinical.business_spec.templates',1680),
    ('business_spec_audit','Audit Rules','/clinical-services/business-spec/audit','Clinical Business Specification','clinical.business_spec.audit',1690),
    ('business_spec_documents','Document Templates','/clinical-services/business-spec/documents','Clinical Business Specification','clinical.business_spec.documents',1700)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.clinic_id, scope.hospital_id, scope.branch_id, items.menu_key, items.label, items.path, items.module_name, items.permission_key, items.sort_order,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET hospital_id=EXCLUDED.hospital_id, branch_id=EXCLUDED.branch_id, label=EXCLUDED.label, path=EXCLUDED.path, module_name=EXCLUDED.module_name, permission_key=EXCLUDED.permission_key, sort_order=EXCLUDED.sort_order, is_enabled=true, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

INSERT INTO clinical_audit_events (
  tenant_id, hospital_id, branch_id, clinic_id, user_id, module_name, action, entity_type, summary, payload, created_at
)
SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id), COALESCE(cup.branch_id, c.branch_id), cup.clinic_id, cup.user_id,
  'Clinical Phase 15 Business Specification',
  'PHASE_15_BUSINESS_SPEC_INSTALLED',
  'clinical_business_spec_pack',
  'Phase 15 screen-level fields, validation rules, workflows, approvals, reports, export rules, communication templates, audit rules, sensitive access rules, and document templates installed.',
  jsonb_build_object('screens',7,'fields',43,'reports',5,'templates',8,'documentTemplates',8),
  CURRENT_TIMESTAMP
FROM clinical_user_profiles cup
JOIN clinics c ON c.id = cup.clinic_id
WHERE COALESCE(cup.is_deleted,false) = false
ORDER BY cup.id ASC
LIMIT 1;
