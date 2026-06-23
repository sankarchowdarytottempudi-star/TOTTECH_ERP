export type HrmsModuleKey =
  | "employees"
  | "recruitment"
  | "candidates"
  | "onboarding"
  | "attendance"
  | "geo-attendance"
  | "biometric"
  | "biometric-logs"
  | "shifts"
  | "roster"
  | "leave"
  | "leave-types"
  | "payroll"
  | "payroll-runs"
  | "credentialing"
  | "privileges"
  | "performance"
  | "lms"
  | "training"
  | "cme"
  | "licenses"
  | "workforce"
  | "screens"
  | "api-catalog"
  | "reports"
  | "table-blueprints";

export type HrmsModuleConfig = {
  key: HrmsModuleKey;
  label: string;
  table: string;
  category: string;
  dateColumn: string;
  description: string;
  primaryColumns: string[];
};

export const hrmsModules: Record<
  HrmsModuleKey,
  HrmsModuleConfig
> = {
  employees: {
    key: "employees",
    label: "Employee Master",
    table: "clinical_hr_employees",
    category: "HRMS",
    dateColumn: "created_at",
    description:
      "Hospital workforce master for doctors, nurses, embryologists, technicians, pharmacists, finance, HR, and corporate teams.",
    primaryColumns: [
      "employee_id",
      "first_name",
      "department",
      "designation",
      "employee_status",
    ],
  },
  recruitment: {
    key: "recruitment",
    label: "Job Requisitions",
    table: "clinical_hr_requisitions",
    category: "Recruitment",
    dateColumn: "created_at",
    description:
      "Approved hiring demand, department vacancies, requested positions, and requisition workflow.",
    primaryColumns: [
      "requisition_number",
      "department",
      "position",
      "vacancies",
      "approval_status",
    ],
  },
  candidates: {
    key: "candidates",
    label: "Candidates",
    table: "clinical_hr_candidates",
    category: "Recruitment",
    dateColumn: "created_at",
    description:
      "Candidate pipeline from application, screening, interview, offer, acceptance, and joining.",
    primaryColumns: [
      "candidate_id",
      "candidate_name",
      "qualification",
      "experience_years",
      "workflow_stage",
    ],
  },
  onboarding: {
    key: "onboarding",
    label: "Onboarding",
    table:
      "clinical_hr_onboarding_checklists",
    category: "Onboarding",
    dateColumn: "created_at",
    description:
      "ID verification, background verification, medical checkup, document submission, system access, and training assignment.",
    primaryColumns: [
      "checklist_item",
      "checklist_category",
      "status",
      "due_date",
    ],
  },
  attendance: {
    key: "attendance",
    label: "Attendance",
    table: "clinical_hr_attendance",
    category: "Attendance",
    dateColumn: "attendance_date",
    description:
      "Biometric, mobile, web, RFID, and face recognition attendance with geo validation.",
    primaryColumns: [
      "attendance_date",
      "source",
      "in_time",
      "out_time",
      "attendance_status",
      "geo_validated",
    ],
  },
  "geo-attendance": {
    key: "geo-attendance",
    label: "Geo Attendance Policy",
    table:
      "clinical_hr_geo_attendance_policies",
    category: "Attendance",
    dateColumn: "created_at",
    description:
      "Hospital coordinate and one-meter mobile attendance radius policy managed by hospital administrators.",
    primaryColumns: [
      "policy_key",
      "latitude",
      "longitude",
      "allowed_radius_meters",
      "mobile_attendance_enabled",
    ],
  },
  biometric: {
    key: "biometric",
    label: "Biometric Devices",
    table: "clinical_hr_biometric_devices",
    category: "Biometric",
    dateColumn: "created_at",
    description:
      "ZKTeco, eSSL, Matrix, Realtime, and Mantra device registry with sync status.",
    primaryColumns: [
      "device_id",
      "vendor",
      "device_location",
      "ip_address",
      "sync_status",
    ],
  },
  "biometric-logs": {
    key: "biometric-logs",
    label: "Biometric Logs",
    table: "clinical_hr_biometric_logs",
    category: "Biometric",
    dateColumn: "punch_time",
    description:
      "Raw biometric punch log ingestion and sync status evidence.",
    primaryColumns: [
      "punch_time",
      "punch_type",
      "sync_status",
      "raw_payload",
    ],
  },
  shifts: {
    key: "shifts",
    label: "Shift Master",
    table: "clinical_hr_shifts",
    category: "Roster",
    dateColumn: "created_at",
    description:
      "Morning, evening, night, general, and rotational shift definitions with grace time.",
    primaryColumns: [
      "shift_code",
      "shift_name",
      "shift_type",
      "start_time",
      "end_time",
      "grace_minutes",
    ],
  },
  roster: {
    key: "roster",
    label: "Roster Management",
    table: "clinical_hr_rosters",
    category: "Roster",
    dateColumn: "roster_date",
    description:
      "Nurse and staff rosters by ward, department, employee, shift, and date.",
    primaryColumns: [
      "roster_date",
      "ward",
      "department",
      "roster_status",
    ],
  },
  leave: {
    key: "leave",
    label: "Leave Requests",
    table: "clinical_hr_leave_requests",
    category: "Leave",
    dateColumn: "created_at",
    description:
      "Casual, sick, earned, maternity, paternity, and compensatory leave approval workflow.",
    primaryColumns: [
      "start_date",
      "end_date",
      "reason",
      "approval_status",
    ],
  },
  "leave-types": {
    key: "leave-types",
    label: "Leave Types",
    table: "clinical_hr_leave_types",
    category: "Leave",
    dateColumn: "created_at",
    description:
      "Leave quota master with carry-forward controls.",
    primaryColumns: [
      "leave_code",
      "leave_name",
      "annual_quota",
      "carry_forward",
    ],
  },
  payroll: {
    key: "payroll",
    label: "Payroll",
    table: "clinical_hr_payroll",
    category: "Payroll",
    dateColumn: "created_at",
    description:
      "Payroll lines generated from attendance, overtime, deductions, salary calculation, approval, and payslip.",
    primaryColumns: [
      "attendance_days",
      "overtime_hours",
      "gross_salary",
      "deductions",
      "net_salary",
      "approval_status",
    ],
  },
  "payroll-runs": {
    key: "payroll-runs",
    label: "Payroll Runs",
    table: "clinical_hr_payroll_runs",
    category: "Payroll",
    dateColumn: "created_at",
    description:
      "Monthly payroll processing workflow from attendance capture to approval.",
    primaryColumns: [
      "payroll_month",
      "workflow_status",
      "total_employees",
      "total_gross",
      "total_net",
    ],
  },
  credentialing: {
    key: "credentialing",
    label: "Doctor Credentialing",
    table:
      "clinical_hr_doctor_credentials",
    category: "Clinical Governance",
    dateColumn: "created_at",
    description:
      "Medical council number, qualification, specialization, super specialization, documents, and expiry tracking.",
    primaryColumns: [
      "medical_council_number",
      "qualification",
      "specialization",
      "license_expiry_date",
      "credential_status",
    ],
  },
  privileges: {
    key: "privileges",
    label: "Doctor Privileging",
    table:
      "clinical_hr_doctor_privileges",
    category: "Clinical Governance",
    dateColumn: "created_at",
    description:
      "Procedure privileges for IVF, surgery, endoscopy, ICU, and emergency procedures with committee review.",
    primaryColumns: [
      "privilege_category",
      "procedure_name",
      "committee_review_status",
      "approval_status",
      "expires_at",
    ],
  },
  performance: {
    key: "performance",
    label: "Performance Reviews",
    table:
      "clinical_hr_performance_reviews",
    category: "Performance",
    dateColumn: "created_at",
    description:
      "Doctor, nurse, lab, and staff KPI reviews with clinical, revenue, satisfaction, TAT, and productivity metrics.",
    primaryColumns: [
      "review_period",
      "kpi_category",
      "rating",
      "review_status",
    ],
  },
  lms: {
    key: "lms",
    label: "LMS Courses",
    table: "clinical_hr_lms_courses",
    category: "Learning",
    dateColumn: "created_at",
    description:
      "Clinical, IVF, safety, compliance, technology, and HR course catalog.",
    primaryColumns: [
      "course_id",
      "course_name",
      "category",
      "duration_hours",
      "mandatory",
    ],
  },
  training: {
    key: "training",
    label: "Training Records",
    table: "clinical_hr_training_records",
    category: "Learning",
    dateColumn: "created_at",
    description:
      "Mandatory training completion, score, certificate, and compliance tracking.",
    primaryColumns: [
      "completion_date",
      "score",
      "certificate_url",
      "compliance_training",
      "training_status",
    ],
  },
  cme: {
    key: "cme",
    label: "CME Records",
    table: "clinical_hr_cme_records",
    category: "Learning",
    dateColumn: "created_at",
    description:
      "Continuing medical education programs, credit hours, completion, and renewal support.",
    primaryColumns: [
      "program_name",
      "credit_hours",
      "completion_date",
      "credits_required",
      "renewal_date",
    ],
  },
  licenses: {
    key: "licenses",
    label: "License Management",
    table: "clinical_hr_licenses",
    category: "Credentialing",
    dateColumn: "expiry_date",
    description:
      "Doctor, nurse, and staff license expiry with 30/60/90 day alerts.",
    primaryColumns: [
      "license_type",
      "license_number",
      "expiry_date",
      "authority",
    ],
  },
  workforce: {
    key: "workforce",
    label: "Workforce Planning",
    table: "clinical_hr_workforce_plans",
    category: "Analytics",
    dateColumn: "created_at",
    description:
      "Doctor availability, nurse availability, department staffing, vacancy analysis, hiring forecasts, attrition risk, and skill gaps.",
    primaryColumns: [
      "department",
      "role_group",
      "current_headcount",
      "required_headcount",
      "attrition_risk",
    ],
  },
  screens: {
    key: "screens",
    label: "Screen Catalog",
    table: "clinical_hr_screens",
    category: "Architecture",
    dateColumn: "created_at",
    description:
      "150+ HRMS screen definitions across desktop and mobile workflows.",
    primaryColumns: [
      "screen_key",
      "module_key",
      "screen_name",
      "route_path",
      "screen_type",
    ],
  },
  "api-catalog": {
    key: "api-catalog",
    label: "API Catalog",
    table: "clinical_hr_api_catalog",
    category: "Architecture",
    dateColumn: "created_at",
    description:
      "300+ HRMS REST API contract definitions with permissions and audit events.",
    primaryColumns: [
      "api_key",
      "module_key",
      "method",
      "route_path",
      "action_name",
    ],
  },
  reports: {
    key: "reports",
    label: "Report Catalog",
    table: "clinical_hr_reports",
    category: "Reporting",
    dateColumn: "created_at",
    description:
      "250+ HR, attendance, leave, payroll, recruitment, training, credentialing, LMS, and CME reports.",
    primaryColumns: [
      "report_key",
      "report_name",
      "report_category",
      "output_formats",
      "evidence_source",
    ],
  },
  "table-blueprints": {
    key: "table-blueprints",
    label: "Table Blueprints",
    table: "clinical_hr_table_blueprints",
    category: "Database",
    dateColumn: "created_at",
    description:
      "120+ workforce database table blueprints for future HRMS expansion.",
    primaryColumns: [
      "table_name",
      "module_key",
      "purpose",
      "implementation_status",
    ],
  },
};

export const hrmsDashboardModules =
  Object.values(hrmsModules);

export function getHrmsModuleConfig(
  key: string
) {
  return hrmsModules[
    key as HrmsModuleKey
  ];
}
