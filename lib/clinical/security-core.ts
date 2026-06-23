export type SecurityModuleKey =
  | "roles"
  | "permissions"
  | "role-permissions"
  | "user-permissions"
  | "data-masks"
  | "record-policies"
  | "field-policies"
  | "export-controls"
  | "bulk-actions"
  | "approval-workflows"
  | "workflow-steps"
  | "mfa"
  | "session-security"
  | "access-logs"
  | "security-events"
  | "break-glass"
  | "reports"
  | "api-groups";

export type SecurityModuleConfig = {
  key: SecurityModuleKey;
  label: string;
  table: string;
  category: string;
  dateColumn: string;
  description: string;
  primaryColumns: string[];
};

export const securityModules: Record<
  SecurityModuleKey,
  SecurityModuleConfig
> = {
  roles: {
    key: "roles",
    label: "RBAC Roles",
    table: "clinical_security_roles",
    category: "RBAC",
    dateColumn: "created_at",
    description:
      "Hospital-grade role hierarchy including TOTTECH Super Admin, tenant, hospital, branch, department, clinical, finance, insurance, portal, and generated department roles.",
    primaryColumns: [
      "role_key",
      "role_name",
      "role_category",
      "hierarchy_rank",
      "mfa_required",
    ],
  },
  permissions: {
    key: "permissions",
    label: "Permissions",
    table: "clinical_security_permissions",
    category: "Permission Matrix",
    dateColumn: "created_at",
    description:
      "Create, read, update, delete, approve, reject, export, print, share, and audit-view permissions across resource scopes.",
    primaryColumns: [
      "permission_key",
      "module_key",
      "action_key",
      "resource_scope",
      "requires_approval",
    ],
  },
  "role-permissions": {
    key: "role-permissions",
    label: "Role Permission Matrix",
    table: "clinical_security_role_permissions",
    category: "RBAC + ABAC",
    dateColumn: "created_at",
    description:
      "Role-to-permission mapping with ABAC conditions, field masks, record-scope policies, and approval policies.",
    primaryColumns: [
      "role_key",
      "permission_key",
      "access_decision",
      "field_mask_profile",
      "record_scope_policy",
    ],
  },
  "user-permissions": {
    key: "user-permissions",
    label: "User Permission Overrides",
    table: "clinical_security_user_permissions",
    category: "User Overrides",
    dateColumn: "created_at",
    description:
      "User-specific allow/deny permissions with reasons, expiry, and approvals.",
    primaryColumns: [
      "user_id",
      "permission_key",
      "grant_type",
      "expires_at",
      "reason",
    ],
  },
  "data-masks": {
    key: "data-masks",
    label: "Data Masking",
    table: "clinical_security_data_masks",
    category: "Data Security",
    dateColumn: "created_at",
    description:
      "Masking rules for Aadhaar, ABHA, passport, insurance policy, and mobile number fields.",
    primaryColumns: [
      "mask_key",
      "field_name",
      "sensitive_type",
      "mask_pattern",
      "example_masked",
    ],
  },
  "record-policies": {
    key: "record-policies",
    label: "Record-Level Security",
    table: "clinical_security_record_policies",
    category: "ABAC",
    dateColumn: "created_at",
    description:
      "Record-level rules for assigned patients, ward patients, lab-related data, radiology studies, patient-owned records, and referral ownership.",
    primaryColumns: [
      "policy_key",
      "policy_name",
      "role_key",
      "module_key",
      "rule_expression",
    ],
  },
  "field-policies": {
    key: "field-policies",
    label: "Field-Level Security",
    table: "clinical_security_field_policies",
    category: "ABAC",
    dateColumn: "created_at",
    description:
      "Field-level patient-screen rules for demographics, financial data, insurance settlement, revenue, and embryology data.",
    primaryColumns: [
      "role_key",
      "module_key",
      "field_key",
      "can_view",
      "mask_policy",
    ],
  },
  "export-controls": {
    key: "export-controls",
    label: "Export Controls",
    table: "clinical_security_export_controls",
    category: "Export Security",
    dateColumn: "created_at",
    description:
      "Excel, CSV, PDF, and print controls requiring permission, reason, and audit logging.",
    primaryColumns: [
      "module_key",
      "export_format",
      "permission_key",
      "reason_required",
      "approval_required",
    ],
  },
  "bulk-actions": {
    key: "bulk-actions",
    label: "Bulk Action Controls",
    table: "clinical_security_bulk_action_controls",
    category: "Bulk Security",
    dateColumn: "created_at",
    description:
      "Mass delete, mass update, and mass export restrictions with approval workflows.",
    primaryColumns: [
      "action_key",
      "module_key",
      "approval_required",
      "approver_roles",
    ],
  },
  "approval-workflows": {
    key: "approval-workflows",
    label: "Approval Workflows",
    table:
      "clinical_security_approval_workflows",
    category: "Approvals",
    dateColumn: "created_at",
    description:
      "Approval workflow engine for refunds, commission payments, claim submission, asset disposal, stock adjustments, and discounts.",
    primaryColumns: [
      "workflow_key",
      "workflow_name",
      "module_key",
      "action_key",
      "approver_roles",
    ],
  },
  "workflow-steps": {
    key: "workflow-steps",
    label: "Workflow Steps",
    table: "clinical_security_workflow_steps",
    category: "Approvals",
    dateColumn: "created_at",
    description:
      "Approval workflow step definitions with approver roles and required actions.",
    primaryColumns: [
      "workflow_key",
      "step_order",
      "step_name",
      "approver_role",
      "action_required",
    ],
  },
  mfa: {
    key: "mfa",
    label: "MFA Policies",
    table: "clinical_security_mfa_policies",
    category: "Session Security",
    dateColumn: "created_at",
    description:
      "Mandatory MFA policies for hospital admin, finance, insurance, IVF, super admin, and sensitive generated roles.",
    primaryColumns: [
      "role_key",
      "factor_policy",
      "required_context",
      "status",
    ],
  },
  "session-security": {
    key: "session-security",
    label: "Session Security",
    table: "clinical_security_session_policies",
    category: "Session Security",
    dateColumn: "created_at",
    description:
      "IP, device, browser, location, timeout, and concurrent-session rules for every clinical role.",
    primaryColumns: [
      "role_key",
      "track_ip",
      "track_device",
      "session_timeout_minutes",
      "concurrent_session_limit",
    ],
  },
  "access-logs": {
    key: "access-logs",
    label: "Access Logs",
    table: "clinical_security_access_logs",
    category: "Audit",
    dateColumn: "created_at",
    description:
      "Runtime access logs for view, create, update, delete, print, export, login, logout, IP, device, browser, location, and masking outcomes.",
    primaryColumns: [
      "user_id",
      "role_key",
      "module_key",
      "action_key",
      "outcome",
    ],
  },
  "security-events": {
    key: "security-events",
    label: "Security Events",
    table: "clinical_security_events",
    category: "Audit",
    dateColumn: "created_at",
    description:
      "Security event stream for permission changes, sensitive access, approval decisions, and governance milestones.",
    primaryColumns: [
      "event_key",
      "event_type",
      "severity",
      "summary",
    ],
  },
  "break-glass": {
    key: "break-glass",
    label: "Break Glass Access",
    table: "clinical_security_break_glass_access",
    category: "Emergency Access",
    dateColumn: "created_at",
    description:
      "Emergency temporary access requests with reason, expiry, approval, and audit status.",
    primaryColumns: [
      "request_key",
      "user_id",
      "role_key",
      "patient_id",
      "status",
    ],
  },
  reports: {
    key: "reports",
    label: "Security Reports",
    table: "clinical_security_reports",
    category: "Security Reports",
    dateColumn: "created_at",
    description:
      "Login audit, failed logins, data exports, permission changes, sensitive record access, and break-glass reports.",
    primaryColumns: [
      "report_key",
      "report_name",
      "report_category",
      "data_source",
      "output_formats",
    ],
  },
  "api-groups": {
    key: "api-groups",
    label: "API Groups",
    table: "clinical_security_api_groups",
    category: "API",
    dateColumn: "created_at",
    description:
      "Security API groups for /rbac, /permissions, /security, /access-logs, /approvals, and /audit.",
    primaryColumns: [
      "group_key",
      "path_prefix",
      "description",
    ],
  },
};

export const securityDashboardModules =
  Object.values(securityModules);

export function getSecurityModuleConfig(
  key: string
) {
  return securityModules[
    key as SecurityModuleKey
  ];
}
