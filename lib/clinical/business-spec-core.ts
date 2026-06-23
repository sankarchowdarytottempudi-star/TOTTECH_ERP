export type BusinessSpecModuleKey =
  | "screens"
  | "fields"
  | "dropdowns"
  | "validations"
  | "workflows"
  | "states"
  | "approvals"
  | "reports"
  | "report-columns"
  | "exports"
  | "templates"
  | "audit"
  | "sensitive"
  | "documents";

export type BusinessSpecModuleConfig = {
  key: BusinessSpecModuleKey;
  label: string;
  table: string;
  category: string;
  dateColumn: string;
  description: string;
  primaryColumns: string[];
};

export const businessSpecModules: Record<
  BusinessSpecModuleKey,
  BusinessSpecModuleConfig
> = {
  screens: {
    key: "screens",
    label: "Screen Specifications",
    table: "clinical_business_screens",
    category: "Business Layer",
    dateColumn: "created_at",
    description:
      "Screen-level specifications containing screen ID, name, module, role access, business rules, workflow states, notifications, reports, and audit events.",
    primaryColumns: [
      "screen_id",
      "screen_name",
      "module_name",
      "role_access",
      "business_rules",
    ],
  },
  fields: {
    key: "fields",
    label: "Screen Fields",
    table: "clinical_business_screen_fields",
    category: "Business Layer",
    dateColumn: "created_at",
    description:
      "Field dictionary for each screen, including type, mandatory flag, validation summary, dropdown group, masking rule, and display order.",
    primaryColumns: [
      "screen_id",
      "field_label",
      "field_type",
      "mandatory",
      "validation_summary",
    ],
  },
  dropdowns: {
    key: "dropdowns",
    label: "Dropdown Values",
    table: "clinical_business_dropdown_values",
    category: "Field Dictionary",
    dateColumn: "created_at",
    description:
      "Master dropdown values for gender, blood group, visit type, departments, IVF protocols, embryo status, and embryo grades.",
    primaryColumns: [
      "dropdown_group",
      "value_key",
      "value_label",
      "sort_order",
      "status",
    ],
  },
  validations: {
    key: "validations",
    label: "Validation Rules",
    table:
      "clinical_business_validation_rules",
    category: "Validation",
    dateColumn: "created_at",
    description:
      "Business validation rules for uniqueness, past dates, active doctors, appointment slot availability, clinical close rules, IVF consent, critical lab values, and claim documentation.",
    primaryColumns: [
      "rule_key",
      "screen_id",
      "field_key",
      "rule_type",
      "message",
    ],
  },
  workflows: {
    key: "workflows",
    label: "Workflows",
    table: "clinical_business_workflows",
    category: "Workflow",
    dateColumn: "created_at",
    description:
      "Patient, IP, IVF, and claim workflow definitions from registration/draft states through completion and settlement.",
    primaryColumns: [
      "workflow_key",
      "workflow_name",
      "module_name",
      "description",
    ],
  },
  states: {
    key: "states",
    label: "Workflow States",
    table:
      "clinical_business_workflow_states",
    category: "Workflow",
    dateColumn: "created_at",
    description:
      "Ordered workflow states for patient, IP, IVF, and insurance claim workflows.",
    primaryColumns: [
      "workflow_key",
      "state_name",
      "state_order",
      "allowed_roles",
    ],
  },
  approvals: {
    key: "approvals",
    label: "Approval Matrix",
    table:
      "clinical_business_approval_rules",
    category: "Approvals",
    dateColumn: "created_at",
    description:
      "Refund and discount approval matrix with amount/percentage thresholds, approver roles, audit, and reason requirements.",
    primaryColumns: [
      "approval_type",
      "condition_label",
      "condition_expression",
      "approver_role",
      "reason_required",
    ],
  },
  reports: {
    key: "reports",
    label: "Report Definitions",
    table: "clinical_business_reports",
    category: "Reporting",
    dateColumn: "created_at",
    description:
      "Business report definitions for Daily OP, Daily Admission, IVF Success, Lab Revenue, and Referral Revenue reports.",
    primaryColumns: [
      "report_id",
      "report_name",
      "module_name",
      "supported_formats",
      "permission_key",
    ],
  },
  "report-columns": {
    key: "report-columns",
    label: "Report Columns",
    table:
      "clinical_business_report_columns",
    category: "Reporting",
    dateColumn: "created_at",
    description:
      "Column-level definitions for each report, including data type and order.",
    primaryColumns: [
      "report_id",
      "column_label",
      "data_type",
      "sort_order",
    ],
  },
  exports: {
    key: "exports",
    label: "Export Rules",
    table: "clinical_business_export_rules",
    category: "Reporting",
    dateColumn: "created_at",
    description:
      "PDF, Excel, CSV, and JSON export controls requiring permission, audit log, and reason.",
    primaryColumns: [
      "export_format",
      "permission_required",
      "audit_required",
      "reason_required",
      "applies_to",
    ],
  },
  templates: {
    key: "templates",
    label: "Communication Templates",
    table:
      "clinical_business_communication_templates",
    category: "Communication",
    dateColumn: "created_at",
    description:
      "Email, SMS, WhatsApp, and push notification templates for appointments, lab reports, payments, registration, IVF reminders, and prescriptions.",
    primaryColumns: [
      "channel",
      "template_name",
      "trigger_event",
      "subject_template",
      "variables",
    ],
  },
  audit: {
    key: "audit",
    label: "Audit Rules",
    table: "clinical_business_audit_rules",
    category: "Audit",
    dateColumn: "created_at",
    description:
      "Create, update, delete, view, export, print, and share audit rules across clinical and business modules.",
    primaryColumns: [
      "action_key",
      "module_name",
      "entity_type",
      "reason_required",
      "old_new_required",
    ],
  },
  sensitive: {
    key: "sensitive",
    label: "Sensitive Access",
    table:
      "clinical_business_sensitive_access_rules",
    category: "Audit",
    dateColumn: "created_at",
    description:
      "Sensitive data access rules for ABHA, Aadhaar, insurance, embryology records, and financial records.",
    primaryColumns: [
      "sensitive_area",
      "fields",
      "allowed_roles",
      "audit_event",
      "masking_required",
    ],
  },
  documents: {
    key: "documents",
    label: "Document Templates",
    table:
      "clinical_business_document_templates",
    category: "Documents",
    dateColumn: "created_at",
    description:
      "Document template definitions for prescription, discharge summary, lab report, radiology report, insurance claim, consent form, IVF consent, and embryology report.",
    primaryColumns: [
      "template_name",
      "module_name",
      "output_formats",
      "required_sections",
      "signer_roles",
    ],
  },
};

export const businessSpecDashboardModules =
  Object.values(businessSpecModules);

export function getBusinessSpecModuleConfig(
  key: string
) {
  return businessSpecModules[
    key as BusinessSpecModuleKey
  ];
}
