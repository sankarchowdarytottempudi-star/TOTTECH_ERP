export type MobileModuleKey =
  | "dashboard"
  | "mobile-users"
  | "devices"
  | "auth-sessions"
  | "patient-dashboard"
  | "patient-profile"
  | "patient-360"
  | "appointments"
  | "lab-reports"
  | "lab-trends"
  | "radiology-reports"
  | "eprescriptions"
  | "refill-requests"
  | "medication-reminders"
  | "online-payments"
  | "documents"
  | "health-tracker"
  | "wearables"
  | "ivf-dashboard"
  | "ivf-medications"
  | "doctor-consultations"
  | "telemedicine"
  | "chat"
  | "nurse-tasks"
  | "medication-admin"
  | "vitals"
  | "referral-leads"
  | "referral-commissions"
  | "corporate-employees"
  | "executive-kpis"
  | "notifications"
  | "offline-sync"
  | "ai-assistant";

export type MobileModuleConfig = {
  key: MobileModuleKey;
  label: string;
  table: string;
  appName: string;
  idPrefix: string;
  uidColumn?: string;
  patientColumn?: string;
  doctorColumn?: string;
  mobileUserColumn?: string;
  deviceColumn?: string;
  dateColumn: string;
  statusColumn?: string;
  createColumns: string[];
  requiredColumns?: string[];
  numericColumns?: string[];
  booleanColumns?: string[];
  dateColumns?: string[];
  textAreaColumns?: string[];
  jsonColumns?: string[];
};

const idColumns = [
  "user_id",
  "patient_id",
  "doctor_id",
  "department_id",
  "prescription_id",
  "telemedicine_session_id",
  "thread_id",
  "lead_id",
  "sender_id",
  "nurse_user_id",
  "mobile_user_id",
  "device_id",
  "comparison_study_id",
  "assigned_to",
];

const numericColumns = [
  ...idColumns,
  "health_score",
  "progress_percent",
  "result_value",
  "amount",
  "duration_seconds",
  "bp_systolic",
  "bp_diastolic",
  "blood_sugar",
  "heart_rate",
  "temperature",
  "spo2",
  "pulse",
  "respiration",
  "revenue_generated",
  "referral_revenue",
  "commission_amount",
  "pending_approval",
  "paid_amount",
  "kpi_value",
  "sort_order",
];

const dateColumns = [
  "last_login",
  "expires_at",
  "appointment_date",
  "event_date",
  "report_date",
  "result_date",
  "prescription_date",
  "start_date",
  "end_date",
  "tracker_date",
  "follow_up_date",
  "scheduled_at",
  "started_at",
  "ended_at",
  "due_at",
  "administered_at",
  "recorded_at",
  "scheduled_at",
  "sent_at",
  "snapshot_date",
];

const jsonColumns = [
  "auth_methods",
  "emergency_contacts",
  "allergies",
  "conditions",
  "medications",
  "family_history",
  "lifestyle_history",
  "widget_payload",
  "payload",
  "report_payload",
  "medicines",
  "medicine_payload",
  "channels",
  "timeline_payload",
  "prescription_payload",
  "orders_payload",
  "eligibility_payload",
  "kpi_payload",
  "conflict_payload",
  "source_payload",
];

export const mobileModules: Record<
  MobileModuleKey,
  MobileModuleConfig
> = {
  dashboard: {
    key: "dashboard",
    label: "Mobile Command Center",
    table:
      "clinical_mobile_patient_dashboard_widgets",
    appName: "Executive App",
    idPrefix: "MWID",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "widget_key",
      "widget_title",
      "widget_value",
      "widget_payload",
      "sort_order",
      "status",
    ],
    requiredColumns: ["widget_key"],
    numericColumns,
    jsonColumns,
  },
  "mobile-users": {
    key: "mobile-users",
    label: "Mobile Users",
    table: "clinical_mobile_users",
    appName: "Platform",
    idPrefix: "MUSR",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "user_id",
      "patient_id",
      "doctor_id",
      "mobile_user_type",
      "mobile_number",
      "email",
      "abha_address",
      "auth_methods",
      "onboarding_status",
      "last_login",
      "status",
    ],
    requiredColumns: ["mobile_user_type"],
    numericColumns,
    dateColumns,
    jsonColumns,
  },
  devices: {
    key: "devices",
    label: "Device Binding",
    table: "clinical_mobile_devices",
    appName: "Platform",
    idPrefix: "DEV",
    uidColumn: "device_uid",
    mobileUserColumn: "mobile_user_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "mobile_user_id",
      "device_uid",
      "platform",
      "device_name",
      "app_name",
      "app_version",
      "push_token",
      "device_binding_status",
      "last_seen",
      "status",
    ],
    numericColumns,
    dateColumns: [...dateColumns, "last_seen"],
  },
  "auth-sessions": {
    key: "auth-sessions",
    label: "Mobile Auth Sessions",
    table: "clinical_mobile_auth_sessions",
    appName: "Platform",
    idPrefix: "AUTH",
    mobileUserColumn: "mobile_user_id",
    deviceColumn: "device_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "mobile_user_id",
      "device_id",
      "login_method",
      "otp_reference",
      "mfa_status",
      "token_refresh_status",
      "expires_at",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  "patient-dashboard": {
    key: "patient-dashboard",
    label: "Patient Dashboard",
    table:
      "clinical_mobile_patient_dashboard_widgets",
    appName: "Patient App",
    idPrefix: "PWID",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "widget_key",
      "widget_title",
      "widget_value",
      "widget_payload",
      "sort_order",
      "status",
    ],
    requiredColumns: ["widget_key"],
    numericColumns,
    jsonColumns,
  },
  "patient-profile": {
    key: "patient-profile",
    label: "Patient Profile",
    table: "clinical_mobile_patient_profiles",
    appName: "Patient App",
    idPrefix: "PPRO",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "uhid",
      "abha_id",
      "blood_group",
      "emergency_contacts",
      "allergies",
      "conditions",
      "medications",
      "family_history",
      "lifestyle_history",
      "health_score",
      "status",
    ],
    numericColumns,
    jsonColumns,
  },
  "patient-360": {
    key: "patient-360",
    label: "Patient 360",
    table: "clinical_mobile_patient_360_events",
    appName: "Patient App",
    idPrefix: "P360",
    patientColumn: "patient_id",
    dateColumn: "event_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "event_type",
      "event_title",
      "event_date",
      "source_module",
      "source_table",
      "source_id",
      "payload",
      "status",
    ],
    requiredColumns: [
      "event_type",
      "event_title",
    ],
    numericColumns,
    dateColumns,
    jsonColumns,
  },
  appointments: {
    key: "appointments",
    label: "Appointment Booking",
    table:
      "clinical_mobile_appointment_bookings",
    appName: "Patient App",
    idPrefix: "MOBAPT",
    uidColumn: "booking_number",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "appointment_date",
    statusColumn: "booking_status",
    createColumns: [
      "booking_number",
      "patient_id",
      "doctor_id",
      "department_id",
      "location",
      "appointment_date",
      "appointment_time",
      "visit_type",
      "reason",
      "insurance_reference",
      "referral_reference",
      "telemedicine_session_id",
      "booking_status",
    ],
    requiredColumns: [
      "appointment_date",
      "visit_type",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: ["reason"],
  },
  "lab-reports": {
    key: "lab-reports",
    label: "Lab Reports",
    table: "clinical_mobile_lab_reports",
    appName: "Patient App",
    idPrefix: "MLAB",
    uidColumn: "report_number",
    patientColumn: "patient_id",
    dateColumn: "report_date",
    statusColumn: "status",
    createColumns: [
      "report_number",
      "patient_id",
      "report_title",
      "report_date",
      "pdf_url",
      "critical_alert",
      "report_payload",
      "status",
    ],
    numericColumns,
    booleanColumns: ["critical_alert"],
    dateColumns,
    jsonColumns,
  },
  "lab-trends": {
    key: "lab-trends",
    label: "Lab Trends",
    table: "clinical_mobile_lab_trends",
    appName: "Patient App",
    idPrefix: "LTR",
    patientColumn: "patient_id",
    dateColumn: "result_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "test_code",
      "test_name",
      "result_value",
      "result_unit",
      "reference_range",
      "result_date",
      "trend_status",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  "radiology-reports": {
    key: "radiology-reports",
    label: "Radiology Reports",
    table:
      "clinical_mobile_radiology_reports",
    appName: "Patient App",
    idPrefix: "MRAD",
    uidColumn: "report_number",
    patientColumn: "patient_id",
    dateColumn: "report_date",
    statusColumn: "status",
    createColumns: [
      "report_number",
      "patient_id",
      "modality",
      "study_instance_uid",
      "report_url",
      "dicom_viewer_url",
      "comparison_study_id",
      "report_date",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  eprescriptions: {
    key: "eprescriptions",
    label: "E-Prescriptions",
    table: "clinical_mobile_eprescriptions",
    appName: "Patient App",
    idPrefix: "EPRX",
    uidColumn: "prescription_number",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "prescription_date",
    statusColumn: "status",
    createColumns: [
      "prescription_number",
      "patient_id",
      "doctor_id",
      "prescription_date",
      "medicines",
      "instructions",
      "e_signature_status",
      "drug_interaction_alerts",
      "status",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: ["instructions"],
    jsonColumns: [
      ...jsonColumns,
      "drug_interaction_alerts",
    ],
  },
  "refill-requests": {
    key: "refill-requests",
    label: "Refill Requests",
    table: "clinical_mobile_refill_requests",
    appName: "Patient App",
    idPrefix: "RFL",
    uidColumn: "request_number",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "request_number",
      "prescription_id",
      "patient_id",
      "doctor_id",
      "medicine_payload",
      "approval_status",
      "payment_status",
      "status",
    ],
    numericColumns,
    jsonColumns,
  },
  "medication-reminders": {
    key: "medication-reminders",
    label: "Medication Reminders",
    table:
      "clinical_mobile_medication_reminders",
    appName: "Patient App",
    idPrefix: "REM",
    uidColumn: "reminder_number",
    patientColumn: "patient_id",
    dateColumn: "start_date",
    statusColumn: "reminder_status",
    createColumns: [
      "reminder_number",
      "patient_id",
      "medicine_name",
      "dose",
      "reminder_time",
      "frequency",
      "start_date",
      "end_date",
      "channels",
      "reminder_status",
    ],
    requiredColumns: ["medicine_name"],
    numericColumns,
    dateColumns,
    jsonColumns,
  },
  "online-payments": {
    key: "online-payments",
    label: "Online Payments",
    table: "clinical_mobile_online_payments",
    appName: "Patient App",
    idPrefix: "MPAY",
    uidColumn: "payment_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "payment_status",
    createColumns: [
      "payment_number",
      "patient_id",
      "invoice_number",
      "payment_method",
      "amount",
      "gateway_reference",
      "payment_status",
      "receipt_url",
    ],
    numericColumns,
  },
  documents: {
    key: "documents",
    label: "Document Vault",
    table: "clinical_mobile_patient_documents",
    appName: "Patient App",
    idPrefix: "MDOC",
    uidColumn: "document_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "vault_status",
    createColumns: [
      "document_number",
      "patient_id",
      "document_type",
      "document_title",
      "file_url",
      "source_module",
      "vault_status",
    ],
    requiredColumns: ["document_type"],
    numericColumns,
  },
  "health-tracker": {
    key: "health-tracker",
    label: "Health Tracker",
    table: "clinical_mobile_health_tracker",
    appName: "Patient App",
    idPrefix: "HTR",
    patientColumn: "patient_id",
    dateColumn: "tracker_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "tracker_date",
      "weight",
      "bp_systolic",
      "bp_diastolic",
      "blood_sugar",
      "heart_rate",
      "temperature",
      "spo2",
      "source",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  wearables: {
    key: "wearables",
    label: "Wearable Data",
    table: "clinical_mobile_wearable_data",
    appName: "Patient App",
    idPrefix: "WEAR",
    patientColumn: "patient_id",
    dateColumn: "recorded_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "device_provider",
      "metric_type",
      "metric_value",
      "metric_unit",
      "recorded_at",
      "payload",
      "status",
    ],
    numericColumns: [
      ...numericColumns,
      "metric_value",
    ],
    dateColumns,
    jsonColumns,
  },
  "ivf-dashboard": {
    key: "ivf-dashboard",
    label: "IVF Dashboard",
    table: "clinical_mobile_ivf_dashboards",
    appName: "IVF Patient App",
    idPrefix: "IVFD",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "cycle_number",
      "current_stage",
      "doctor_id",
      "embryologist",
      "progress_percent",
      "next_action",
      "timeline_payload",
      "status",
    ],
    numericColumns,
    jsonColumns,
  },
  "ivf-medications": {
    key: "ivf-medications",
    label: "IVF Medication Tracker",
    table:
      "clinical_mobile_ivf_medication_tracking",
    appName: "IVF Patient App",
    idPrefix: "IVFM",
    patientColumn: "patient_id",
    dateColumn: "start_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "cycle_number",
      "medicine_name",
      "dose",
      "start_date",
      "end_date",
      "compliance_status",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  "doctor-consultations": {
    key: "doctor-consultations",
    label: "Doctor Consultation",
    table:
      "clinical_mobile_doctor_consultations",
    appName: "Doctor App",
    idPrefix: "DCON",
    uidColumn: "consultation_number",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "consultation_number",
      "patient_id",
      "doctor_id",
      "chief_complaint",
      "history",
      "diagnosis",
      "prescription_payload",
      "orders_payload",
      "follow_up_date",
      "ai_notes",
      "e_signature_status",
      "status",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: [
      "chief_complaint",
      "history",
      "diagnosis",
      "ai_notes",
    ],
    jsonColumns,
  },
  telemedicine: {
    key: "telemedicine",
    label: "Telemedicine Sessions",
    table:
      "clinical_mobile_telemedicine_sessions",
    appName: "Telemedicine App",
    idPrefix: "TLM",
    uidColumn: "session_number",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "scheduled_at",
    statusColumn: "session_status",
    createColumns: [
      "session_number",
      "patient_id",
      "doctor_id",
      "session_type",
      "scheduled_at",
      "started_at",
      "ended_at",
      "duration_seconds",
      "meeting_url",
      "recording_url",
      "session_status",
    ],
    numericColumns,
    dateColumns,
  },
  chat: {
    key: "chat",
    label: "Chat Platform",
    table: "clinical_mobile_chat_threads",
    appName: "Telemedicine App",
    idPrefix: "CHAT",
    uidColumn: "thread_number",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "thread_number",
      "patient_id",
      "doctor_id",
      "thread_type",
      "status",
    ],
    numericColumns,
  },
  "nurse-tasks": {
    key: "nurse-tasks",
    label: "Nurse Tasks",
    table: "clinical_mobile_nurse_tasks",
    appName: "Nurse App",
    idPrefix: "NTASK",
    uidColumn: "task_number",
    patientColumn: "patient_id",
    dateColumn: "due_at",
    statusColumn: "task_status",
    createColumns: [
      "task_number",
      "patient_id",
      "nurse_user_id",
      "task_type",
      "task_title",
      "due_at",
      "task_status",
    ],
    requiredColumns: ["task_title"],
    numericColumns,
    dateColumns,
  },
  "medication-admin": {
    key: "medication-admin",
    label: "Medication Administration",
    table:
      "clinical_mobile_medication_administration",
    appName: "Nurse App",
    idPrefix: "MAR",
    uidColumn: "administration_number",
    patientColumn: "patient_id",
    dateColumn: "administered_at",
    statusColumn: "administration_status",
    createColumns: [
      "administration_number",
      "patient_id",
      "nurse_user_id",
      "medicine_name",
      "dose",
      "route",
      "administered_at",
      "administration_status",
      "remarks",
    ],
    requiredColumns: ["medicine_name"],
    numericColumns,
    dateColumns,
    textAreaColumns: ["remarks"],
  },
  vitals: {
    key: "vitals",
    label: "Vitals Entry",
    table: "clinical_mobile_vitals_entries",
    appName: "Nurse App",
    idPrefix: "VIT",
    patientColumn: "patient_id",
    dateColumn: "recorded_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "nurse_user_id",
      "recorded_at",
      "temperature",
      "pulse",
      "bp_systolic",
      "bp_diastolic",
      "respiration",
      "spo2",
      "blood_sugar",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  "referral-leads": {
    key: "referral-leads",
    label: "Referral Leads",
    table: "clinical_mobile_referral_leads",
    appName: "Referral App",
    idPrefix: "RLEAD",
    uidColumn: "lead_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "lead_status",
    createColumns: [
      "lead_number",
      "lead_name",
      "phone",
      "source",
      "assigned_to",
      "lead_status",
      "patient_id",
      "revenue_generated",
    ],
    requiredColumns: ["lead_name"],
    numericColumns,
  },
  "referral-commissions": {
    key: "referral-commissions",
    label: "Referral Commissions",
    table:
      "clinical_mobile_referral_commissions",
    appName: "Referral App",
    idPrefix: "RCOM",
    dateColumn: "created_at",
    statusColumn: "commission_status",
    createColumns: [
      "lead_id",
      "referral_name",
      "referral_revenue",
      "commission_amount",
      "pending_approval",
      "paid_amount",
      "commission_status",
    ],
    numericColumns,
  },
  "corporate-employees": {
    key: "corporate-employees",
    label: "Corporate Employees",
    table:
      "clinical_mobile_corporate_employees",
    appName: "Corporate Portal",
    idPrefix: "CEMP",
    uidColumn: "employee_code",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "employee_code",
      "employee_name",
      "corporate_name",
      "department",
      "insurance_reference",
      "eligibility_payload",
      "patient_id",
      "status",
    ],
    requiredColumns: ["employee_name"],
    numericColumns,
    jsonColumns,
  },
  "executive-kpis": {
    key: "executive-kpis",
    label: "Executive KPIs",
    table: "clinical_mobile_executive_kpis",
    appName: "Executive App",
    idPrefix: "EKPI",
    dateColumn: "snapshot_date",
    statusColumn: "status",
    createColumns: [
      "dashboard_type",
      "kpi_key",
      "kpi_label",
      "kpi_value",
      "kpi_payload",
      "snapshot_date",
      "status",
    ],
    requiredColumns: [
      "dashboard_type",
      "kpi_key",
    ],
    numericColumns,
    dateColumns,
    jsonColumns,
  },
  notifications: {
    key: "notifications",
    label: "Push Notifications",
    table:
      "clinical_mobile_push_notifications",
    appName: "Platform",
    idPrefix: "PNOT",
    uidColumn: "notification_number",
    patientColumn: "patient_id",
    mobileUserColumn: "mobile_user_id",
    dateColumn: "created_at",
    statusColumn: "delivery_status",
    createColumns: [
      "notification_number",
      "mobile_user_id",
      "patient_id",
      "notification_type",
      "title",
      "message",
      "channel",
      "delivery_status",
      "scheduled_at",
      "sent_at",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: ["message"],
  },
  "offline-sync": {
    key: "offline-sync",
    label: "Offline Sync",
    table: "clinical_mobile_offline_sync_queue",
    appName: "Platform",
    idPrefix: "SYNC",
    mobileUserColumn: "mobile_user_id",
    deviceColumn: "device_id",
    dateColumn: "created_at",
    statusColumn: "sync_status",
    createColumns: [
      "mobile_user_id",
      "device_id",
      "app_name",
      "sync_entity",
      "sync_action",
      "payload",
      "sync_status",
      "conflict_payload",
    ],
    numericColumns,
    jsonColumns,
  },
  "ai-assistant": {
    key: "ai-assistant",
    label: "AI Patient Assistant",
    table: "clinical_mobile_ai_assistant_logs",
    appName: "Patient App",
    idPrefix: "AIM",
    patientColumn: "patient_id",
    mobileUserColumn: "mobile_user_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "mobile_user_id",
      "assistant_mode",
      "prompt",
      "answer",
      "safety_notice",
      "source_payload",
      "status",
    ],
    requiredColumns: ["prompt"],
    numericColumns,
    textAreaColumns: [
      "prompt",
      "answer",
      "safety_notice",
    ],
    jsonColumns,
  },
};

export const mobileDashboardModules =
  Object.values(mobileModules);

export function getMobileModuleConfig(
  moduleKey: string
) {
  return mobileModules[
    moduleKey as MobileModuleKey
  ];
}

export function normalizeMobileValue(
  config: MobileModuleConfig,
  column: string,
  value: unknown
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (config.booleanColumns?.includes(column)) {
    if (typeof value === "boolean") {
      return value;
    }

    return ["true", "1", "yes", "on"].includes(
      String(value).toLowerCase()
    );
  }

  if (config.numericColumns?.includes(column)) {
    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  if (config.jsonColumns?.includes(column)) {
    if (typeof value === "object") {
      return value;
    }

    try {
      return JSON.parse(String(value));
    } catch {
      return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return String(value);
}
