-- TOTTECH Clinical Services - Phase 16 Compliance + Governance + Go-Live Readiness

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

CREATE TABLE IF NOT EXISTS clinical_compliance_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  framework_key VARCHAR(160) NOT NULL,
  framework_name VARCHAR(255) NOT NULL,
  framework_scope TEXT,
  readiness_percent INTEGER DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, framework_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  control_key VARCHAR(220) NOT NULL,
  framework_key VARCHAR(160) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  control_name VARCHAR(255) NOT NULL,
  requirement TEXT NOT NULL,
  evidence_type VARCHAR(160),
  owner_role VARCHAR(180),
  status VARCHAR(80) DEFAULT 'DEFINED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, control_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  consent_key VARCHAR(180) NOT NULL,
  consent_type VARCHAR(180) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  required_for JSONB DEFAULT '[]'::jsonb,
  retention_policy TEXT,
  audit_event VARCHAR(180),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, consent_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_patient_safety_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  goal_key VARCHAR(180) NOT NULL,
  goal_name VARCHAR(255) NOT NULL,
  jci_goal VARCHAR(180),
  measurement_method TEXT,
  evidence_required TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, goal_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  incident_number VARCHAR(180) NOT NULL,
  incident_date DATE NOT NULL,
  department VARCHAR(180) NOT NULL,
  severity VARCHAR(80) NOT NULL,
  incident_type VARCHAR(180) NOT NULL,
  description TEXT,
  action_taken TEXT,
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, incident_number)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_root_cause_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  action_key VARCHAR(180) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  cause TEXT NOT NULL,
  corrective_action TEXT NOT NULL,
  preventive_action TEXT NOT NULL,
  owner_role VARCHAR(180),
  due_days INTEGER DEFAULT 30,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, action_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_risk_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  risk_id VARCHAR(180) NOT NULL,
  risk_name VARCHAR(255) NOT NULL,
  risk_category VARCHAR(120) NOT NULL,
  probability VARCHAR(80) NOT NULL,
  impact VARCHAR(80) NOT NULL,
  owner_role VARCHAR(180),
  mitigation_plan TEXT,
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, risk_id)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_infection_surveillance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  surveillance_key VARCHAR(180) NOT NULL,
  infection_type VARCHAR(180) NOT NULL,
  department VARCHAR(180) NOT NULL,
  metric_name VARCHAR(180) NOT NULL,
  reporting_frequency VARCHAR(80) DEFAULT 'MONTHLY',
  corrective_action TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, surveillance_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_bcm_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  plan_key VARCHAR(180) NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  scenario VARCHAR(180) NOT NULL,
  recovery_time VARCHAR(120),
  recovery_owner VARCHAR(180),
  test_results TEXT,
  status VARCHAR(80) DEFAULT 'DEFINED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, plan_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_dr_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  test_key VARCHAR(180) NOT NULL,
  backup_restored BOOLEAN DEFAULT false,
  application_restored BOOLEAN DEFAULT false,
  database_restored BOOLEAN DEFAULT false,
  files_restored BOOLEAN DEFAULT false,
  rpo_minutes INTEGER,
  rto_minutes INTEGER,
  recovery_success_rate INTEGER,
  status VARCHAR(80) DEFAULT 'PLANNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, test_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_soc_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  event_key VARCHAR(180) NOT NULL,
  event_type VARCHAR(180) NOT NULL,
  severity VARCHAR(80) NOT NULL,
  detection_source VARCHAR(180),
  response_playbook TEXT,
  status VARCHAR(80) DEFAULT 'MONITORED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, event_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_vulnerabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  finding_key VARCHAR(180) NOT NULL,
  finding VARCHAR(255) NOT NULL,
  severity VARCHAR(80) NOT NULL,
  owner_role VARCHAR(180),
  due_days INTEGER DEFAULT 30,
  remediation TEXT,
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, finding_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_penetration_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  test_key VARCHAR(180) NOT NULL,
  scope_name VARCHAR(255) NOT NULL,
  finding_category VARCHAR(180) NOT NULL,
  severity VARCHAR(80) NOT NULL,
  closure_status VARCHAR(80) DEFAULT 'OPEN',
  report_type VARCHAR(180),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, test_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_migration_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  source_key VARCHAR(180) NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  source_type VARCHAR(120) NOT NULL,
  imported_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  duplicate_count INTEGER DEFAULT 0,
  validated_count INTEGER DEFAULT 0,
  status VARCHAR(80) DEFAULT 'PLANNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, source_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  training_key VARCHAR(180) NOT NULL,
  employee_group VARCHAR(180) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  completion_required BOOLEAN DEFAULT true,
  score_required INTEGER DEFAULT 80,
  status VARCHAR(80) DEFAULT 'ASSIGNED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, training_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_uat_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  case_key VARCHAR(180) NOT NULL,
  module_name VARCHAR(180) NOT NULL,
  scenario TEXT NOT NULL,
  expected_result TEXT NOT NULL,
  actual_result TEXT,
  status VARCHAR(80) DEFAULT 'PENDING',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, case_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_go_live_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  checklist_key VARCHAR(180) NOT NULL,
  checklist_area VARCHAR(180) NOT NULL,
  checklist_item VARCHAR(255) NOT NULL,
  required_for_go_live BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'PENDING',
  evidence_required TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, checklist_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_hypercare_sla (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  sla_key VARCHAR(180) NOT NULL,
  severity VARCHAR(80) NOT NULL,
  response_time VARCHAR(120) NOT NULL,
  resolution_time VARCHAR(120) NOT NULL,
  escalation_role VARCHAR(180),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, sla_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_accreditation_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  finding_key VARCHAR(180) NOT NULL,
  framework_key VARCHAR(160) NOT NULL,
  finding_type VARCHAR(180) NOT NULL,
  finding_summary TEXT NOT NULL,
  corrective_action TEXT,
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, finding_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_key VARCHAR(180) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  framework_key VARCHAR(160) NOT NULL,
  report_category VARCHAR(180) NOT NULL,
  output_formats JSONB DEFAULT '["PDF","Excel","CSV","JSON"]'::jsonb,
  evidence_source VARCHAR(255),
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_key)
);

CREATE TABLE IF NOT EXISTS clinical_compliance_table_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  table_key VARCHAR(180) NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  module_key VARCHAR(160) NOT NULL,
  purpose TEXT NOT NULL,
  required_fields JSONB DEFAULT '[]'::jsonb,
  implementation_status VARCHAR(80) DEFAULT 'BLUEPRINT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, table_key)
);

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
frameworks(framework_key, framework_name, framework_scope, readiness_percent) AS (
  VALUES
    ('nabh','NABH','Indian hospital accreditation readiness covering patient rights, consent, infection control, quality, and governance.',65),
    ('jci','JCI','International patient safety goals, audit dashboard, corrective actions, and open findings.',60),
    ('hipaa','HIPAA','Administrative and technical safeguards for protected health information.',58),
    ('gdpr','GDPR','Data subject rights, privacy dashboard, consent, retention, and portability.',55),
    ('iso27001','ISO 27001','Information security assets, risks, controls, incidents, and vulnerability governance.',62),
    ('soc2','SOC 2','Security operations, access monitoring, audit evidence, and trust service controls.',54),
    ('abdm','ABDM','ABHA, consent, health information exchange, and India digital health governance.',60),
    ('ayushman','Ayushman Bharat','Government insurance integration, claim governance, and audit evidence.',52),
    ('clinical_establishment_act','Clinical Establishment Act','Clinical establishment registration, statutory compliance, and operational reporting.',57)
)
INSERT INTO clinical_compliance_frameworks (
  tenant_id, hospital_id, branch_id, clinic_id, framework_key, framework_name, framework_scope, readiness_percent, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, frameworks.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN frameworks
ON CONFLICT (tenant_id, hospital_id, branch_id, framework_key)
DO UPDATE SET framework_name=EXCLUDED.framework_name, framework_scope=EXCLUDED.framework_scope, readiness_percent=EXCLUDED.readiness_percent, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
base(framework_key, module_key, control_name, requirement, evidence_type, owner_role) AS (
  VALUES
    ('nabh','patient_rights','Patient Consent','System must support patient consent, information access, privacy, confidentiality, and complaint management.','Consent register','Quality Manager'),
    ('nabh','complaints','Complaint Management','Patient complaints must be captured, assigned, resolved, and audited.','Complaint log','Hospital Admin'),
    ('nabh','infection_control','Infection Control Reports','Monthly infection rate, department-wise infection, and corrective action evidence must be available.','Infection surveillance','Infection Control Nurse'),
    ('jci','patient_identification','Patient Identification','Track and audit patient identification checks.','Safety audit','Nursing Head'),
    ('jci','communication','Communication Safety','Track critical communication, handoffs, and near misses.','Incident register','Medical Director'),
    ('jci','medication_safety','Medication Safety','Medication error events must be captured with RCA and CAPA.','Medication safety log','Pharmacy Manager'),
    ('jci','procedure_verification','Procedure Verification','Procedure verification, time-out, and consent evidence must be auditable.','Procedure checklist','OT Manager'),
    ('hipaa','access_reviews','Access Reviews','User access, role changes, and periodic access reviews must be tracked.','Access review','Security Officer'),
    ('hipaa','technical_safeguards','Technical Safeguards','Encryption, audit logging, access controls, MFA, and session management must be enforced.','Security controls','Security Officer'),
    ('hipaa','phi_classification','PHI Classification','Patient name, diagnosis, reports, insurance data, and ABHA data must be classified as PHI.','PHI register','Compliance Officer'),
    ('gdpr','data_subject_rights','Data Subject Rights','Support access, rectification, restriction, and portability requests.','Data request register','Privacy Officer'),
    ('gdpr','retention','Retention Status','Retention status and consent status must be tracked in privacy dashboard.','Retention report','Privacy Officer'),
    ('iso27001','risk_register','Security Register','Track risk ID, risk name, likelihood, impact, and mitigation.','Risk register','Security Officer'),
    ('iso27001','vulnerabilities','Vulnerability Management','Track critical, high, medium, and low findings through remediation.','Vulnerability register','Security Officer'),
    ('soc2','soc_events','Security Operations','Failed logins, MFA failures, unauthorized access, and suspicious activity must be monitored.','SOC event log','Security Officer'),
    ('abdm','abha','ABHA Governance','ABHA access and data sharing consent must be auditable.','ABDM consent log','Compliance Officer'),
    ('ayushman','claims','Government Claim Governance','Ayushman claim submission, approval, and settlement evidence must be tracked.','Claim register','Insurance Manager'),
    ('clinical_establishment_act','statutory','Clinical Establishment Compliance','Registration, licenses, statutory reports, and audit evidence must be maintained.','License register','Hospital Admin')
),
generated AS (
  SELECT
    framework_key,
    module_key,
    control_name || ' Control ' || n AS control_name,
    requirement || ' Evidence checkpoint ' || n || '.' AS requirement,
    evidence_type,
    owner_role
  FROM base CROSS JOIN generate_series(1,3) n
)
INSERT INTO clinical_compliance_controls (
  tenant_id, hospital_id, branch_id, clinic_id, control_key, framework_key, module_key, control_name, requirement, evidence_type, owner_role, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower(generated.framework_key || '_' || generated.module_key || '_' || md5(generated.control_name)),
  generated.framework_key, generated.module_key, generated.control_name, generated.requirement, generated.evidence_type, generated.owner_role, scope.user_id, scope.user_id
FROM scope CROSS JOIN generated
ON CONFLICT (tenant_id, hospital_id, branch_id, control_key)
DO UPDATE SET framework_key=EXCLUDED.framework_key, module_key=EXCLUDED.module_key, control_name=EXCLUDED.control_name, requirement=EXCLUDED.requirement, evidence_type=EXCLUDED.evidence_type, owner_role=EXCLUDED.owner_role, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
consents(consent_key, consent_type, module_key, required_for, retention_policy, audit_event) AS (
  VALUES
    ('general_consent','General Consent','Patient','["Registration","OP","IP"]'::jsonb,'Retain per hospital legal policy.','General Consent Captured'),
    ('procedure_consent','Procedure Consent','OP','["Procedure","Investigation"]'::jsonb,'Retain with clinical record.','Procedure Consent Captured'),
    ('surgery_consent','Surgery Consent','OT','["Surgery","Anesthesia"]'::jsonb,'Retain with surgical record.','Surgery Consent Captured'),
    ('anesthesia_consent','Anesthesia Consent','OT','["Anesthesia"]'::jsonb,'Retain with OT record.','Anesthesia Consent Captured'),
    ('ivf_consent','IVF Consent','IVF','["IVF Cycle","Embryology","Transfer"]'::jsonb,'Retain per ART/IVF policy.','IVF Consent Captured'),
    ('data_sharing_consent','Data Sharing Consent','ABDM','["ABHA","HIE","Reports Sharing"]'::jsonb,'Retain with consent version.','Data Sharing Consent Captured')
)
INSERT INTO clinical_compliance_consents (
  tenant_id, hospital_id, branch_id, clinic_id, consent_key, consent_type, module_key, required_for, retention_policy, audit_event, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, consents.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN consents
ON CONFLICT (tenant_id, hospital_id, branch_id, consent_key)
DO UPDATE SET consent_type=EXCLUDED.consent_type, module_key=EXCLUDED.module_key, required_for=EXCLUDED.required_for, retention_policy=EXCLUDED.retention_policy, audit_event=EXCLUDED.audit_event, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
goals(goal_key, goal_name, jci_goal, measurement_method, evidence_required) AS (
  VALUES
    ('patient_identification','Patient Identification','IPSG 1','Two identifiers before medication, procedure, and sample collection.','Patient ID audit checklist'),
    ('communication','Communication','IPSG 2','Critical communication read-back and handoff compliance.','Communication log'),
    ('medication_safety','Medication Safety','IPSG 3','High-alert medicine checks and medication error register.','Medication safety register'),
    ('procedure_verification','Procedure Verification','IPSG 4','Time-out and procedure-site verification.','OT/procedure checklist'),
    ('infection_control','Infection Control','IPSG 5','Hand hygiene and infection surveillance.','Infection reports'),
    ('fall_prevention','Fall Prevention','IPSG 6','Fall-risk assessment and prevention plan.','Fall-risk audit')
)
INSERT INTO clinical_compliance_patient_safety_goals (
  tenant_id, hospital_id, branch_id, clinic_id, goal_key, goal_name, jci_goal, measurement_method, evidence_required, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, goals.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN goals
ON CONFLICT (tenant_id, hospital_id, branch_id, goal_key)
DO UPDATE SET goal_name=EXCLUDED.goal_name, jci_goal=EXCLUDED.jci_goal, measurement_method=EXCLUDED.measurement_method, evidence_required=EXCLUDED.evidence_required, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
incidents(incident_number, department, severity, incident_type, description, action_taken) AS (
  VALUES
    ('INC-CLIN-001','OPD','Minor','Medication Error','Sample medication error governance case.','Review and educate staff.'),
    ('INC-CLIN-002','ICU','Critical','Equipment Failure','Sample equipment failure governance case.','Escalate biomedical response.'),
    ('INC-CLIN-003','OT','Major','Procedure Error','Sample procedure verification case.','RCA and corrective action.'),
    ('INC-CLIN-004','Ward','Moderate','Fall','Sample fall prevention governance case.','Fall prevention protocol review.')
)
INSERT INTO clinical_compliance_incidents (
  tenant_id, hospital_id, branch_id, clinic_id, incident_number, incident_date, department, severity, incident_type, description, action_taken, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, incidents.incident_number, CURRENT_DATE, incidents.department, incidents.severity, incidents.incident_type, incidents.description, incidents.action_taken, scope.user_id, scope.user_id
FROM scope CROSS JOIN incidents
ON CONFLICT (tenant_id, hospital_id, branch_id, incident_number)
DO UPDATE SET department=EXCLUDED.department, severity=EXCLUDED.severity, incident_type=EXCLUDED.incident_type, description=EXCLUDED.description, action_taken=EXCLUDED.action_taken, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
rca(action_key, event_name, cause, corrective_action, preventive_action, owner_role) AS (
  VALUES
    ('rca_medication_error','Medication Error','Process deviation or order interpretation issue.','Correct order workflow and retrain.','Add medication double-check gate.','Pharmacy Manager'),
    ('rca_procedure_error','Procedure Error','Procedure verification gap.','RCA committee review.','Mandatory time-out checklist.','Medical Director'),
    ('rca_fall','Fall','Fall risk not reassessed.','Immediate ward review.','Fall-risk reassessment every shift.','Nursing Head'),
    ('rca_infection','Infection','Infection control breach.','Isolate and investigate.','Monthly infection control audit.','Infection Control Nurse')
)
INSERT INTO clinical_compliance_root_cause_actions (
  tenant_id, hospital_id, branch_id, clinic_id, action_key, event_name, cause, corrective_action, preventive_action, owner_role, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, rca.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN rca
ON CONFLICT (tenant_id, hospital_id, branch_id, action_key)
DO UPDATE SET event_name=EXCLUDED.event_name, cause=EXCLUDED.cause, corrective_action=EXCLUDED.corrective_action, preventive_action=EXCLUDED.preventive_action, owner_role=EXCLUDED.owner_role, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
risks(risk_id, risk_name, risk_category, probability, impact, owner_role, mitigation_plan) AS (
  VALUES
    ('RISK-CLINICAL-001','Clinical adverse event risk','Clinical','Medium','High','Medical Director','Incident management, RCA, and patient safety audit.'),
    ('RISK-FIN-001','Revenue leakage risk','Financial','Medium','Medium','Finance Manager','Billing controls and audit reconciliation.'),
    ('RISK-OPS-001','Operational downtime risk','Operational','Low','High','Hospital Admin','BCM and DR plan testing.'),
    ('RISK-TECH-001','Cyber attack risk','Technology','Medium','Critical','Security Officer','SOC monitoring, MFA, vulnerability remediation.'),
    ('RISK-COMP-001','Accreditation non-compliance risk','Compliance','Medium','High','Compliance Officer','Compliance controls and audit readiness dashboard.')
)
INSERT INTO clinical_compliance_risk_register (
  tenant_id, hospital_id, branch_id, clinic_id, risk_id, risk_name, risk_category, probability, impact, owner_role, mitigation_plan, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, risks.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN risks
ON CONFLICT (tenant_id, hospital_id, branch_id, risk_id)
DO UPDATE SET risk_name=EXCLUDED.risk_name, risk_category=EXCLUDED.risk_category, probability=EXCLUDED.probability, impact=EXCLUDED.impact, owner_role=EXCLUDED.owner_role, mitigation_plan=EXCLUDED.mitigation_plan, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
infection(surveillance_key, infection_type, department, metric_name, corrective_action) AS (
  VALUES
    ('hai_monthly','Hospital Acquired Infection','All Departments','Monthly Infection Rate','Department-wise RCA and corrective action.'),
    ('icu_infection','ICU Infection','ICU','ICU Infection Rate','ICU asepsis bundle audit.'),
    ('ot_infection','OT Infection','OT','OT Infection Rate','OT sterilization and procedure review.'),
    ('ivf_lab_infection','IVF Lab Infection','IVF Lab','IVF Lab Infection Rate','IVF lab environmental and embryology safety audit.')
)
INSERT INTO clinical_compliance_infection_surveillance (
  tenant_id, hospital_id, branch_id, clinic_id, surveillance_key, infection_type, department, metric_name, corrective_action, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, infection.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN infection
ON CONFLICT (tenant_id, hospital_id, branch_id, surveillance_key)
DO UPDATE SET infection_type=EXCLUDED.infection_type, department=EXCLUDED.department, metric_name=EXCLUDED.metric_name, corrective_action=EXCLUDED.corrective_action, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
bcm(plan_key, plan_name, scenario, recovery_time, recovery_owner, test_results) AS (
  VALUES
    ('pandemic_plan','Pandemic Plan','Pandemic','24 hours','Hospital Admin','Annual tabletop required.'),
    ('disaster_plan','Disaster Plan','Disaster','12 hours','Operations Head','Mock drill required.'),
    ('cyber_attack_plan','Cyber Attack Plan','Cyber Attack','4 hours','Security Officer','Security incident drill required.'),
    ('power_failure_plan','Power Failure Plan','Power Failure','1 hour','Facilities Head','Generator/failover test required.')
)
INSERT INTO clinical_compliance_bcm_plans (
  tenant_id, hospital_id, branch_id, clinic_id, plan_key, plan_name, scenario, recovery_time, recovery_owner, test_results, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, bcm.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN bcm
ON CONFLICT (tenant_id, hospital_id, branch_id, plan_key)
DO UPDATE SET plan_name=EXCLUDED.plan_name, scenario=EXCLUDED.scenario, recovery_time=EXCLUDED.recovery_time, recovery_owner=EXCLUDED.recovery_owner, test_results=EXCLUDED.test_results, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
dr(test_key, backup_restored, application_restored, database_restored, files_restored, rpo_minutes, rto_minutes, recovery_success_rate, status) AS (
  VALUES
    ('quarterly_dr_test',false,false,false,false,15,60,0,'PLANNED'),
    ('database_restore_test',true,false,true,false,15,60,85,'PARTIAL'),
    ('full_application_restore_test',true,true,true,true,15,60,95,'PASSED')
)
INSERT INTO clinical_compliance_dr_tests (
  tenant_id, hospital_id, branch_id, clinic_id, test_key, backup_restored, application_restored, database_restored, files_restored, rpo_minutes, rto_minutes, recovery_success_rate, status, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, dr.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN dr
ON CONFLICT (tenant_id, hospital_id, branch_id, test_key)
DO UPDATE SET backup_restored=EXCLUDED.backup_restored, application_restored=EXCLUDED.application_restored, database_restored=EXCLUDED.database_restored, files_restored=EXCLUDED.files_restored, rpo_minutes=EXCLUDED.rpo_minutes, rto_minutes=EXCLUDED.rto_minutes, recovery_success_rate=EXCLUDED.recovery_success_rate, status=EXCLUDED.status, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
soc(event_key, event_type, severity, detection_source, response_playbook) AS (
  VALUES
    ('failed_logins','Failed Logins','Medium','Authentication Logs','Investigate repeated failures and lock account if threshold exceeded.'),
    ('mfa_failures','MFA Failures','High','MFA Logs','Escalate to security officer.'),
    ('unauthorized_access','Unauthorized Access','High','RBAC Logs','Revoke session and perform access review.'),
    ('suspicious_activity','Suspicious Activity','High','Audit Logs','Security triage and incident ticket.'),
    ('privilege_escalation','Privilege Escalation','Critical','Permission Logs','Immediate account freeze and audit.'),
    ('mass_export','Mass Export','Critical','Export Logs','Require reason and approval validation.'),
    ('data_leak_attempt','Data Leak Attempt','Critical','DLP/Audit Logs','Incident response and legal review.'),
    ('brute_force_attack','Brute Force Attack','Critical','Auth Logs','IP block and credential reset.')
)
INSERT INTO clinical_compliance_soc_events (
  tenant_id, hospital_id, branch_id, clinic_id, event_key, event_type, severity, detection_source, response_playbook, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, soc.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN soc
ON CONFLICT (tenant_id, hospital_id, branch_id, event_key)
DO UPDATE SET event_type=EXCLUDED.event_type, severity=EXCLUDED.severity, detection_source=EXCLUDED.detection_source, response_playbook=EXCLUDED.response_playbook, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
vulns(finding_key, finding, severity, owner_role, due_days, remediation) AS (
  VALUES
    ('critical_security_scan','Critical security scan finding','Critical','Security Officer',3,'Patch immediately and validate closure.'),
    ('high_security_scan','High security scan finding','High','Security Officer',7,'Patch and retest.'),
    ('medium_security_scan','Medium security scan finding','Medium','IT Manager',30,'Schedule remediation.'),
    ('low_security_scan','Low security scan finding','Low','IT Manager',60,'Track to closure.')
)
INSERT INTO clinical_compliance_vulnerabilities (
  tenant_id, hospital_id, branch_id, clinic_id, finding_key, finding, severity, owner_role, due_days, remediation, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, vulns.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN vulns
ON CONFLICT (tenant_id, hospital_id, branch_id, finding_key)
DO UPDATE SET finding=EXCLUDED.finding, severity=EXCLUDED.severity, owner_role=EXCLUDED.owner_role, due_days=EXCLUDED.due_days, remediation=EXCLUDED.remediation, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
pentest(test_key, scope_name, finding_category, severity, closure_status, report_type) AS (
  VALUES
    ('owasp_top_10','Web Application','OWASP Top 10','High','OPEN','Annual Pen Test'),
    ('api_security','API Gateway','API Security','High','OPEN','Annual Pen Test'),
    ('network_security','Network','Network Security','Medium','OPEN','Annual Pen Test')
)
INSERT INTO clinical_compliance_penetration_tests (
  tenant_id, hospital_id, branch_id, clinic_id, test_key, scope_name, finding_category, severity, closure_status, report_type, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, pentest.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN pentest
ON CONFLICT (tenant_id, hospital_id, branch_id, test_key)
DO UPDATE SET scope_name=EXCLUDED.scope_name, finding_category=EXCLUDED.finding_category, severity=EXCLUDED.severity, closure_status=EXCLUDED.closure_status, report_type=EXCLUDED.report_type, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
sources(source_key, source_name, source_type) AS (
  VALUES ('excel','Excel','Excel'),('csv','CSV','CSV'),('legacy_hms','Legacy HMS','Legacy HMS'),('sap','SAP','SAP'),('oracle','Oracle','Oracle'),('sql_server','SQL Server','SQL Server')
)
INSERT INTO clinical_compliance_migration_sources (
  tenant_id, hospital_id, branch_id, clinic_id, source_key, source_name, source_type, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, sources.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN sources
ON CONFLICT (tenant_id, hospital_id, branch_id, source_key)
DO UPDATE SET source_name=EXCLUDED.source_name, source_type=EXCLUDED.source_type, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
training(training_key, employee_group, course_name) AS (
  VALUES
    ('doctors_compliance','Doctors','Clinical Governance and Patient Safety'),
    ('nurses_compliance','Nurses','NABH/JCI Nursing Compliance'),
    ('lab_staff_compliance','Lab Staff','Lab Safety and Report Governance'),
    ('pharmacy_staff_compliance','Pharmacy Staff','Medication Safety and Inventory Governance'),
    ('management_compliance','Management','Compliance, Risk, and Go-Live Governance')
)
INSERT INTO clinical_compliance_training_records (
  tenant_id, hospital_id, branch_id, clinic_id, training_key, employee_group, course_name, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, training.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN training
ON CONFLICT (tenant_id, hospital_id, branch_id, training_key)
DO UPDATE SET employee_group=EXCLUDED.employee_group, course_name=EXCLUDED.course_name, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
uat(module_name, scenario, expected_result) AS (
  VALUES
    ('Patient','Register patient with consent','Patient, consent, audit event, and UHID are created.'),
    ('Appointments','Book active doctor slot','Appointment workflow enters Booked state.'),
    ('IVF','Create IVF cycle after assessments','Cycle enters Planned state only after validations.'),
    ('Lab','Enter critical result','Critical alert and audit event are generated.'),
    ('Insurance','Submit claim with documents','Claim enters submitted/review workflow.'),
    ('Compliance','Close accreditation finding','Finding closure and corrective action are audited.'),
    ('Security','MFA failure monitoring','SOC event is visible in dashboard.'),
    ('Reports','Export compliance report','Permission, reason, and audit log are required.')
)
INSERT INTO clinical_compliance_uat_cases (
  tenant_id, hospital_id, branch_id, clinic_id, case_key, module_name, scenario, expected_result, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower('uat_' || module_name || '_' || md5(scenario)), module_name, scenario, expected_result, scope.user_id, scope.user_id
FROM scope CROSS JOIN uat
ON CONFLICT (tenant_id, hospital_id, branch_id, case_key)
DO UPDATE SET module_name=EXCLUDED.module_name, scenario=EXCLUDED.scenario, expected_result=EXCLUDED.expected_result, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
checklist(checklist_area, checklist_item, evidence_required) AS (
  VALUES
    ('Infrastructure','Servers Ready','Server inventory and health proof'),
    ('Infrastructure','Database Ready','Database migration and backup proof'),
    ('Infrastructure','Backups Ready','Backup schedule and restore test'),
    ('Infrastructure','Monitoring Ready','Monitoring dashboard and alert rules'),
    ('Application','Modules Tested','UAT pass evidence'),
    ('Application','Reports Tested','Report run/export evidence'),
    ('Application','APIs Tested','API contract test evidence'),
    ('Application','Mobile Apps Tested','Mobile smoke test evidence'),
    ('Security','Pen Test Passed','Pen test closure report'),
    ('Security','Audit Passed','Compliance audit signoff'),
    ('Security','MFA Enabled','MFA enforcement evidence')
)
INSERT INTO clinical_compliance_go_live_checklists (
  tenant_id, hospital_id, branch_id, clinic_id, checklist_key, checklist_area, checklist_item, evidence_required, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower('golive_' || checklist_area || '_' || md5(checklist_item)), checklist_area, checklist_item, evidence_required, scope.user_id, scope.user_id
FROM scope CROSS JOIN checklist
ON CONFLICT (tenant_id, hospital_id, branch_id, checklist_key)
DO UPDATE SET checklist_area=EXCLUDED.checklist_area, checklist_item=EXCLUDED.checklist_item, evidence_required=EXCLUDED.evidence_required, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
sla(sla_key, severity, response_time, resolution_time, escalation_role) AS (
  VALUES
    ('sla_critical','Critical','15 Minutes','4 Hours','Executive Support Lead'),
    ('sla_high','High','1 Hour','8 Hours','Support Manager'),
    ('sla_medium','Medium','4 Hours','2 Days','Support Team Lead'),
    ('sla_low','Low','1 Day','5 Days','Support Desk')
)
INSERT INTO clinical_compliance_hypercare_sla (
  tenant_id, hospital_id, branch_id, clinic_id, sla_key, severity, response_time, resolution_time, escalation_role, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, sla.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN sla
ON CONFLICT (tenant_id, hospital_id, branch_id, sla_key)
DO UPDATE SET severity=EXCLUDED.severity, response_time=EXCLUDED.response_time, resolution_time=EXCLUDED.resolution_time, escalation_role=EXCLUDED.escalation_role, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
findings(finding_key, framework_key, finding_type, finding_summary, corrective_action, status) AS (
  VALUES
    ('nabh_open_findings','nabh','Open Findings','NABH open findings dashboard seed.','Assign owners and due dates.','OPEN'),
    ('nabh_closed_findings','nabh','Closed Findings','NABH closed findings dashboard seed.','Maintain evidence pack.','CLOSED'),
    ('jci_patient_safety_goals','jci','Patient Safety Goals','JCI patient safety goals dashboard seed.','Track corrective actions.','OPEN'),
    ('jci_corrective_actions','jci','Corrective Actions','JCI corrective action dashboard seed.','Close CAPA evidence.','OPEN')
)
INSERT INTO clinical_compliance_accreditation_findings (
  tenant_id, hospital_id, branch_id, clinic_id, finding_key, framework_key, finding_type, finding_summary, corrective_action, status, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, findings.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN findings
ON CONFLICT (tenant_id, hospital_id, branch_id, finding_key)
DO UPDATE SET framework_key=EXCLUDED.framework_key, finding_type=EXCLUDED.finding_type, finding_summary=EXCLUDED.finding_summary, corrective_action=EXCLUDED.corrective_action, status=EXCLUDED.status, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
report_groups(framework_key, report_category, base_report) AS (
  VALUES
    ('nabh','Consent Compliance','Consent Compliance'),
    ('nabh','Incident Reports','Incident Reports'),
    ('nabh','Infection Reports','Infection Reports'),
    ('hipaa','PHI Access','PHI Access'),
    ('hipaa','Audit Logs','Audit Logs'),
    ('hipaa','Security Events','Security Events'),
    ('gdpr','Consent Reports','Consent Reports'),
    ('gdpr','Data Requests','Data Requests'),
    ('gdpr','Retention Reports','Retention Reports'),
    ('iso27001','Risk Register','Risk Register'),
    ('iso27001','Security Controls','Security Controls'),
    ('iso27001','Vulnerability Reports','Vulnerability Reports')
),
generated AS (
  SELECT framework_key, report_category, base_report || ' ' || n AS report_name
  FROM report_groups CROSS JOIN generate_series(1,20) n
)
INSERT INTO clinical_compliance_reports (
  tenant_id, hospital_id, branch_id, clinic_id, report_key, report_name, framework_key, report_category, evidence_source, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower(framework_key || '_' || replace(report_category,' ','_') || '_' || md5(report_name)), report_name, framework_key, report_category, 'clinical_compliance_' || framework_key, scope.user_id, scope.user_id
FROM scope CROSS JOIN generated
ON CONFLICT (tenant_id, hospital_id, branch_id, report_key)
DO UPDATE SET report_name=EXCLUDED.report_name, framework_key=EXCLUDED.framework_key, report_category=EXCLUDED.report_category, evidence_source=EXCLUDED.evidence_source, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key) AS (
  VALUES ('nabh'),('jci'),('hipaa'),('gdpr'),('iso27001'),('soc2'),('abdm'),('ayushman'),('clinical_governance'),('patient_safety'),('infection_control'),('risk_management')
),
generated AS (
  SELECT
    module_key || '_table_' || n AS table_key,
    'clinical_' || module_key || '_register_' || n AS table_name,
    module_key,
    'Compliance database blueprint for ' || module_key || ' register ' || n || '.' AS purpose,
    jsonb_build_array('tenant_id','hospital_id','branch_id','created_by','created_at','status','audit_evidence') AS required_fields
  FROM modules CROSS JOIN generate_series(1,10) n
)
INSERT INTO clinical_compliance_table_blueprints (
  tenant_id, hospital_id, branch_id, clinic_id, table_key, table_name, module_key, purpose, required_fields, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, generated.*, scope.user_id, scope.user_id
FROM scope CROSS JOIN generated
ON CONFLICT (tenant_id, hospital_id, branch_id, table_key)
DO UPDATE SET table_name=EXCLUDED.table_name, module_key=EXCLUDED.module_key, purpose=EXCLUDED.purpose, required_fields=EXCLUDED.required_fields, is_deleted=false, updated_at=CURRENT_TIMESTAMP;

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
    ('compliance_core','Compliance Center','/clinical-services/compliance','Clinical Compliance','clinical.compliance.read',1710),
    ('compliance_frameworks','Frameworks','/clinical-services/compliance/frameworks','Clinical Compliance','clinical.compliance.frameworks',1720),
    ('compliance_controls','Controls','/clinical-services/compliance/controls','Clinical Compliance','clinical.compliance.controls',1730),
    ('compliance_consents','Consents','/clinical-services/compliance/consents','Clinical Compliance','clinical.compliance.consents',1740),
    ('compliance_safety','Patient Safety','/clinical-services/compliance/safety','Clinical Compliance','clinical.compliance.safety',1750),
    ('compliance_incidents','Incidents','/clinical-services/compliance/incidents','Clinical Compliance','clinical.compliance.incidents',1760),
    ('compliance_risks','Risk Register','/clinical-services/compliance/risks','Clinical Compliance','clinical.compliance.risks',1770),
    ('compliance_infection','Infection Control','/clinical-services/compliance/infection','Clinical Compliance','clinical.compliance.infection',1780),
    ('compliance_security','Security Operations','/clinical-services/compliance/security','Clinical Compliance','clinical.compliance.security',1790),
    ('compliance_golive','Go-Live Readiness','/clinical-services/compliance/go-live','Clinical Compliance','clinical.compliance.go_live',1800),
    ('compliance_reports','Compliance Reports','/clinical-services/compliance/reports','Clinical Compliance','clinical.compliance.reports',1810)
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
  'Clinical Phase 16 Compliance',
  'PHASE_16_COMPLIANCE_INSTALLED',
  'clinical_compliance_pack',
  'Phase 16 compliance, accreditation, clinical governance, risk, security, DR, UAT, go-live, training, migration, and hypercare pack installed.',
  jsonb_build_object('frameworks',9,'controls','54','reports','240','tableBlueprints','120'),
  CURRENT_TIMESTAMP
FROM clinical_user_profiles cup
JOIN clinics c ON c.id = cup.clinic_id
WHERE COALESCE(cup.is_deleted,false) = false
ORDER BY cup.id ASC
LIMIT 1;
