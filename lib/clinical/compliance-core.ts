export type ComplianceModuleKey =
  | "frameworks"
  | "controls"
  | "consents"
  | "safety"
  | "incidents"
  | "rca"
  | "risks"
  | "infection"
  | "bcm"
  | "dr"
  | "security"
  | "vulnerabilities"
  | "pen-tests"
  | "migration"
  | "training"
  | "uat"
  | "go-live"
  | "hypercare"
  | "findings"
  | "reports"
  | "table-blueprints";

export type ComplianceModuleConfig = {
  key: ComplianceModuleKey;
  label: string;
  table: string;
  category: string;
  dateColumn: string;
  description: string;
  primaryColumns: string[];
};

export const complianceModules: Record<
  ComplianceModuleKey,
  ComplianceModuleConfig
> = {
  frameworks: {
    key: "frameworks",
    label: "Compliance Frameworks",
    table: "clinical_compliance_frameworks",
    category: "Compliance",
    dateColumn: "created_at",
    description:
      "NABH, JCI, HIPAA, GDPR, ISO 27001, SOC 2, ABDM, Ayushman Bharat, and Clinical Establishment Act readiness.",
    primaryColumns: [
      "framework_key",
      "framework_name",
      "readiness_percent",
      "framework_scope",
      "status",
    ],
  },
  controls: {
    key: "controls",
    label: "Compliance Controls",
    table: "clinical_compliance_controls",
    category: "Compliance",
    dateColumn: "created_at",
    description:
      "Evidence-backed controls for patient rights, safety, privacy, access reviews, infection control, security, and statutory compliance.",
    primaryColumns: [
      "framework_key",
      "module_key",
      "control_name",
      "evidence_type",
      "owner_role",
    ],
  },
  consents: {
    key: "consents",
    label: "Consent Management",
    table: "clinical_compliance_consents",
    category: "NABH + GDPR",
    dateColumn: "created_at",
    description:
      "General, procedure, surgery, anesthesia, IVF, and data-sharing consent governance.",
    primaryColumns: [
      "consent_type",
      "module_key",
      "required_for",
      "retention_policy",
      "audit_event",
    ],
  },
  safety: {
    key: "safety",
    label: "Patient Safety Goals",
    table:
      "clinical_compliance_patient_safety_goals",
    category: "JCI",
    dateColumn: "created_at",
    description:
      "International patient safety goals for identification, communication, medication safety, procedure verification, infection control, and fall prevention.",
    primaryColumns: [
      "goal_name",
      "jci_goal",
      "measurement_method",
      "evidence_required",
    ],
  },
  incidents: {
    key: "incidents",
    label: "Incident Management",
    table: "clinical_compliance_incidents",
    category: "Clinical Governance",
    dateColumn: "created_at",
    description:
      "Clinical incident register for minor, moderate, major, and critical events.",
    primaryColumns: [
      "incident_number",
      "department",
      "severity",
      "incident_type",
      "status",
    ],
  },
  rca: {
    key: "rca",
    label: "Root Cause Actions",
    table:
      "clinical_compliance_root_cause_actions",
    category: "Clinical Governance",
    dateColumn: "created_at",
    description:
      "Root cause analysis, corrective action, and preventive action definitions.",
    primaryColumns: [
      "event_name",
      "cause",
      "corrective_action",
      "preventive_action",
      "owner_role",
    ],
  },
  risks: {
    key: "risks",
    label: "Risk Register",
    table: "clinical_compliance_risk_register",
    category: "Risk Management",
    dateColumn: "created_at",
    description:
      "Clinical, financial, operational, technology, and compliance risk register.",
    primaryColumns: [
      "risk_id",
      "risk_name",
      "risk_category",
      "probability",
      "impact",
    ],
  },
  infection: {
    key: "infection",
    label: "Infection Control",
    table:
      "clinical_compliance_infection_surveillance",
    category: "Infection Control",
    dateColumn: "created_at",
    description:
      "Hospital-acquired, ICU, OT, and IVF lab infection surveillance.",
    primaryColumns: [
      "infection_type",
      "department",
      "metric_name",
      "reporting_frequency",
      "corrective_action",
    ],
  },
  bcm: {
    key: "bcm",
    label: "BCM Plans",
    table: "clinical_compliance_bcm_plans",
    category: "Business Continuity",
    dateColumn: "created_at",
    description:
      "Pandemic, disaster, cyber attack, and power-failure continuity plans.",
    primaryColumns: [
      "plan_name",
      "scenario",
      "recovery_time",
      "recovery_owner",
      "status",
    ],
  },
  dr: {
    key: "dr",
    label: "DR Validation",
    table: "clinical_compliance_dr_tests",
    category: "Disaster Recovery",
    dateColumn: "created_at",
    description:
      "Backup, application, database, and file restore test evidence with RPO/RTO metrics.",
    primaryColumns: [
      "test_key",
      "rpo_minutes",
      "rto_minutes",
      "recovery_success_rate",
      "status",
    ],
  },
  security: {
    key: "security",
    label: "Security Operations",
    table: "clinical_compliance_soc_events",
    category: "SOC",
    dateColumn: "created_at",
    description:
      "Failed logins, MFA failures, unauthorized access, suspicious activity, privilege escalation, mass export, data leak, and brute-force monitoring.",
    primaryColumns: [
      "event_type",
      "severity",
      "detection_source",
      "response_playbook",
      "status",
    ],
  },
  vulnerabilities: {
    key: "vulnerabilities",
    label: "Vulnerabilities",
    table: "clinical_compliance_vulnerabilities",
    category: "Security",
    dateColumn: "created_at",
    description:
      "Critical, high, medium, and low vulnerability remediation register.",
    primaryColumns: [
      "finding",
      "severity",
      "owner_role",
      "due_days",
      "status",
    ],
  },
  "pen-tests": {
    key: "pen-tests",
    label: "Penetration Tests",
    table:
      "clinical_compliance_penetration_tests",
    category: "Security",
    dateColumn: "created_at",
    description:
      "Annual penetration test scope, findings, severity, and closure status.",
    primaryColumns: [
      "scope_name",
      "finding_category",
      "severity",
      "closure_status",
      "report_type",
    ],
  },
  migration: {
    key: "migration",
    label: "Migration Framework",
    table:
      "clinical_compliance_migration_sources",
    category: "Data Migration",
    dateColumn: "created_at",
    description:
      "Excel, CSV, Legacy HMS, SAP, Oracle, and SQL Server migration validation tracking.",
    primaryColumns: [
      "source_name",
      "source_type",
      "imported_count",
      "failed_count",
      "validated_count",
    ],
  },
  training: {
    key: "training",
    label: "Training Management",
    table:
      "clinical_compliance_training_records",
    category: "Training",
    dateColumn: "created_at",
    description:
      "Compliance training tracks for doctors, nurses, lab staff, pharmacy staff, and management.",
    primaryColumns: [
      "employee_group",
      "course_name",
      "completion_required",
      "score_required",
      "status",
    ],
  },
  uat: {
    key: "uat",
    label: "UAT Cases",
    table: "clinical_compliance_uat_cases",
    category: "UAT",
    dateColumn: "created_at",
    description:
      "User acceptance testing cases with module, scenario, expected result, actual result, and status.",
    primaryColumns: [
      "module_name",
      "scenario",
      "expected_result",
      "status",
    ],
  },
  "go-live": {
    key: "go-live",
    label: "Go-Live Checklist",
    table:
      "clinical_compliance_go_live_checklists",
    category: "Go-Live",
    dateColumn: "created_at",
    description:
      "Infrastructure, application, and security readiness checklist.",
    primaryColumns: [
      "checklist_area",
      "checklist_item",
      "required_for_go_live",
      "status",
      "evidence_required",
    ],
  },
  hypercare: {
    key: "hypercare",
    label: "Hypercare SLA",
    table: "clinical_compliance_hypercare_sla",
    category: "Post Go-Live",
    dateColumn: "created_at",
    description:
      "Critical, high, medium, and low support response and resolution SLA matrix.",
    primaryColumns: [
      "severity",
      "response_time",
      "resolution_time",
      "escalation_role",
      "status",
    ],
  },
  findings: {
    key: "findings",
    label: "Accreditation Findings",
    table:
      "clinical_compliance_accreditation_findings",
    category: "Accreditation",
    dateColumn: "created_at",
    description:
      "NABH and JCI open/closed findings, audit readiness, corrective actions, and status.",
    primaryColumns: [
      "framework_key",
      "finding_type",
      "finding_summary",
      "corrective_action",
      "status",
    ],
  },
  reports: {
    key: "reports",
    label: "Compliance Reports",
    table: "clinical_compliance_reports",
    category: "Reporting",
    dateColumn: "created_at",
    description:
      "200+ compliance report definitions for NABH, HIPAA, GDPR, ISO 27001, incidents, infection, PHI access, audit logs, data requests, and vulnerabilities.",
    primaryColumns: [
      "report_name",
      "framework_key",
      "report_category",
      "output_formats",
      "evidence_source",
    ],
  },
  "table-blueprints": {
    key: "table-blueprints",
    label: "Table Blueprints",
    table:
      "clinical_compliance_table_blueprints",
    category: "Database",
    dateColumn: "created_at",
    description:
      "100+ compliance database table blueprints for future certification expansion.",
    primaryColumns: [
      "table_name",
      "module_key",
      "purpose",
      "required_fields",
      "implementation_status",
    ],
  },
};

export const complianceDashboardModules =
  Object.values(complianceModules);

export function getComplianceModuleConfig(
  key: string
) {
  return complianceModules[
    key as ComplianceModuleKey
  ];
}
