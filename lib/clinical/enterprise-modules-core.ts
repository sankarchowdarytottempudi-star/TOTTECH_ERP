export type EnterpriseModuleStatus =
  | "WORKING"
  | "PARTIAL"
  | "MISSING";

export type EnterpriseModuleDefinition = {
  key: string;
  label: string;
  category: string;
  description: string;
  href: string;
  iconKey: string;
  tablePatterns: string[];
  tableNames?: string[];
  requiredCapabilities: string[];
  actions: {
    label: string;
    href: string;
  }[];
};

const root = "/clinical-services";
const security = (module: string) =>
  `${root}/security/${module}`;
const hrms = (module: string) =>
  `${root}/hrms/${module}`;
const finance = (module: string) =>
  `${root}/finance/${module}`;
const pharmacy = (module: string) =>
  `${root}/pharmacy/${module}`;
const production = (module: string) =>
  `${root}/production/${module}`;
const analytics = (module: string) =>
  `${root}/analytics/${module}`;
const mobile = (module: string) =>
  `${root}/mobile/${module}`;

export const enterpriseModuleDefinitions: EnterpriseModuleDefinition[] =
  [
    {
      key: "iam",
      label: "Identity & Access Management",
      category: "Security",
      description:
        "Clinical users, role assignment, permission overrides, login governance, access audit and session/security policy controls.",
      href: security("user-permissions"),
      iconKey: "users",
      tablePatterns: [
        "clinical_security_%",
      ],
      tableNames: [
        "users",
        "clinical_user_profiles",
        "clinical_security_roles",
        "clinical_security_permissions",
        "clinical_security_user_permissions",
        "clinical_security_access_logs",
        "clinical_security_session_policies",
        "clinical_security_mfa_policies",
      ],
      requiredCapabilities: [
        "Create/edit/deactivate clinical users",
        "Assign hospital roles and departments",
        "Track login/access history",
        "Prepare password/MFA/session governance",
      ],
      actions: [
        {
          label: "Users",
          href: security("user-permissions"),
        },
        {
          label: "Access Logs",
          href: security("access-logs"),
        },
        {
          label: "Session Security",
          href: security("session-security"),
        },
      ],
    },
    {
      key: "role-builder",
      label: "Role & Permission Builder",
      category: "Security",
      description:
        "Dynamic RBAC/ABAC matrix for view, create, edit, delete, approve, reject, export, print and audit controls.",
      href: security("roles"),
      iconKey: "security_rbac",
      tablePatterns: [
        "clinical_security_%",
      ],
      tableNames: [
        "clinical_security_roles",
        "clinical_security_permissions",
        "clinical_security_role_permissions",
        "clinical_security_record_policies",
        "clinical_security_field_policies",
        "clinical_security_export_controls",
        "clinical_security_approval_workflows",
      ],
      requiredCapabilities: [
        "Create/edit/clone roles",
        "Map permissions by module and action",
        "Support record and field policies",
        "Enforce export and approval controls",
      ],
      actions: [
        {
          label: "Roles",
          href: security("roles"),
        },
        {
          label: "Permissions",
          href: security("permissions"),
        },
        {
          label: "Role Matrix",
          href: security("role-permissions"),
        },
      ],
    },
    {
      key: "employee-management",
      label: "Staff & Employee Management",
      category: "HRMS",
      description:
        "Employee master for doctors, nurses, pharmacists, lab, radiology, front desk, accounts, HR, housekeeping, security and management teams.",
      href: hrms("employees"),
      iconKey: "hr_employees",
      tablePatterns: [
        "clinical_hr_%",
      ],
      tableNames: [
        "clinical_hr_employees",
        "clinical_hr_employee_documents",
        "clinical_hr_requisitions",
        "clinical_hr_candidates",
        "clinical_hr_onboarding_checklists",
      ],
      requiredCapabilities: [
        "Hire, transfer, promote and terminate employees",
        "Maintain documents and qualifications",
        "Track department/designation/status",
        "Support recruitment and onboarding",
      ],
      actions: [
        {
          label: "Employees",
          href: hrms("employees"),
        },
        {
          label: "Recruitment",
          href: hrms("recruitment"),
        },
        {
          label: "Onboarding",
          href: hrms("onboarding"),
        },
      ],
    },
    {
      key: "hrms",
      label: "HRMS Operations",
      category: "HRMS",
      description:
        "Attendance, biometric, geo attendance, shifts, duty roster, leave, payroll, payslips, credentialing, LMS and CME.",
      href: `${root}/hrms`,
      iconKey: "hrms_core",
      tablePatterns: [
        "clinical_hr_%",
      ],
      tableNames: [
        "clinical_hr_attendance",
        "clinical_hr_geo_attendance_policies",
        "clinical_hr_biometric_devices",
        "clinical_hr_shifts",
        "clinical_hr_rosters",
        "clinical_hr_leave_requests",
        "clinical_hr_payroll",
        "clinical_hr_payroll_runs",
        "clinical_hr_lms_courses",
        "clinical_hr_cme_records",
      ],
      requiredCapabilities: [
        "Manual, biometric and mobile attendance",
        "Shift and roster management",
        "Leave approval workflow",
        "Payroll, payslip and compliance training",
      ],
      actions: [
        {
          label: "Attendance",
          href: hrms("attendance"),
        },
        {
          label: "Rosters",
          href: hrms("roster"),
        },
        {
          label: "Payroll",
          href: hrms("payroll"),
        },
      ],
    },
    {
      key: "fixed-assets",
      label: "Fixed Asset Management",
      category: "Assets",
      description:
        "IT and facility asset register with allocation, return, transfer, repair, replacement, disposal and depreciation evidence.",
      href: finance("assets"),
      iconKey: "finance_assets",
      tablePatterns: [
        "clinical_finance_asset%",
      ],
      tableNames: [
        "clinical_finance_assets",
        "clinical_finance_asset_transfers",
        "clinical_finance_asset_disposals",
        "clinical_finance_depreciation",
      ],
      requiredCapabilities: [
        "Asset register",
        "Allocation and transfer tracking",
        "Repair/scrap/disposal workflows",
        "Asset value and depreciation reporting",
      ],
      actions: [
        {
          label: "Assets",
          href: finance("assets"),
        },
        {
          label: "Asset Transfers",
          href: finance("assets"),
        },
        {
          label: "Approvals",
          href: security("approval-workflows"),
        },
      ],
    },
    {
      key: "biomedical-equipment",
      label: "Biomedical Equipment",
      category: "Assets",
      description:
        "Medical equipment tracking for ICU, OT, lab and radiology with calibration, warranty, AMC and service-due governance.",
      href: pharmacy("inventory"),
      iconKey: "assets",
      tablePatterns: [
        "%equipment%",
        "%maintenance%",
        "%calibration%",
      ],
      tableNames: [
        "clinical_finance_assets",
        "clinical_finance_document_links",
        "pharmacy_alerts",
      ],
      requiredCapabilities: [
        "Equipment register",
        "Calibration and AMC tracking",
        "Service history",
        "Warranty and service-due alerts",
      ],
      actions: [
        {
          label: "Asset Register",
          href: finance("assets"),
        },
        {
          label: "Alerts",
          href: analytics("ai-insights"),
        },
        {
          label: "Documents",
          href: `${root}/documents`,
        },
      ],
    },
    {
      key: "procurement",
      label: "Procurement & Vendor Management",
      category: "Supply Chain",
      description:
        "Purchase request, approvals, purchase orders, GRN, invoice verification, vendor contracts and payment history.",
      href: pharmacy("purchase-orders"),
      iconKey: "purchase_orders",
      tablePatterns: [
        "pharmacy_purchase%",
        "pharmacy_grn%",
        "pharmacy_vendor%",
      ],
      tableNames: [
        "pharmacy_vendors",
        "pharmacy_purchase_requisitions",
        "pharmacy_purchase_orders",
        "pharmacy_grns",
        "pharmacy_vendor_invoices",
        "clinical_finance_ap_vendor_invoices",
      ],
      requiredCapabilities: [
        "Purchase request to PO flow",
        "Vendor master",
        "GRN and quality checks",
        "Invoice verification and AP link",
      ],
      actions: [
        {
          label: "Vendors",
          href: pharmacy("vendors"),
        },
        {
          label: "Purchase Orders",
          href: pharmacy("purchase-orders"),
        },
        {
          label: "GRN",
          href: pharmacy("grn"),
        },
      ],
    },
    {
      key: "document-management",
      label: "Document Management",
      category: "Administration",
      description:
        "Employee, vendor, AMC, license, registration, insurance, NABH and clinical documents with versioning and expiry evidence.",
      href: `${root}/documents`,
      iconKey: "documents",
      tablePatterns: [
        "%document%",
      ],
      tableNames: [
        "medical_documents",
        "ivf_documents",
        "clinical_hr_employee_documents",
        "clinical_finance_document_links",
        "pharmacy_document_links",
        "clinical_business_document_templates",
      ],
      requiredCapabilities: [
        "Upload and link documents",
        "Versioning and expiry reminders",
        "Download history",
        "Audit-ready document categories",
      ],
      actions: [
        {
          label: "Clinical Documents",
          href: `${root}/documents`,
        },
        {
          label: "Employee Documents",
          href: hrms("employees"),
        },
        {
          label: "Templates",
          href: `${root}/business-spec/document-templates`,
        },
      ],
    },
    {
      key: "master-data",
      label: "Master Data Management",
      category: "Administration",
      description:
        "Department, designation, service, tax, ward, room, bed, medicine, lab test, procedure and billing masters.",
      href: `${root}/dictionary`,
      iconKey: "dictionary_core",
      tablePatterns: [
        "clinical_dictionary_%",
        "departments",
        "hms_%",
        "pharmacy_medicine%",
      ],
      tableNames: [
        "departments",
        "hms_wards",
        "hms_beds",
        "pharmacy_medicines",
        "pharmacy_medicine_categories",
        "clinical_finance_gst_configurations",
      ],
      requiredCapabilities: [
        "Department and designation masters",
        "Service and tax masters",
        "Ward, bed and room masters",
        "Clinical dictionary evidence",
      ],
      actions: [
        {
          label: "Dictionary",
          href: `${root}/dictionary`,
        },
        {
          label: "Departments",
          href: `${root}/departments`,
        },
        {
          label: "Ward Management",
          href: `${root}/ward-management`,
        },
      ],
    },
    {
      key: "business-continuity",
      label: "Backup, DR & Business Continuity",
      category: "Production",
      description:
        "Daily, weekly and monthly backup policies, recovery target, monitoring, restore validation and go-live readiness gates.",
      href: production("backups"),
      iconKey: "backup",
      tablePatterns: [
        "clinical_production_%",
      ],
      tableNames: [
        "clinical_production_backup_policies",
        "clinical_production_monitoring_rules",
        "clinical_production_go_live_checklist",
        "clinical_production_devops_artifacts",
      ],
      requiredCapabilities: [
        "Backup policies",
        "Restore validation",
        "Monitoring and alert rules",
        "Go-live recovery procedures",
      ],
      actions: [
        {
          label: "Backups",
          href: production("backups"),
        },
        {
          label: "Monitoring",
          href: production("monitoring"),
        },
        {
          label: "Go-Live",
          href: production("go-live"),
        },
      ],
    },
    {
      key: "executive-dashboard",
      label: "Executive Management Dashboard",
      category: "Analytics",
      description:
        "Owner dashboard for revenue, expenses, profit, patient count, occupancy, performance, inventory, asset value, payroll cost and pending claims.",
      href: analytics("ceo-dashboard"),
      iconKey: "analytics_ceo",
      tablePatterns: [
        "clinical_finance_%snapshot%",
        "clinical_finance_%kpi%",
        "pharmacy_%snapshot%",
        "clinical_hr_payroll%",
      ],
      tableNames: [
        "clinical_finance_ceo_kpi_snapshots",
        "clinical_finance_cfo_kpi_snapshots",
        "clinical_finance_profit_loss_snapshots",
        "clinical_finance_balance_sheet_snapshots",
        "pharmacy_kpi_snapshots",
        "clinical_hr_payroll_runs",
      ],
      requiredCapabilities: [
        "Revenue and profit drilldowns",
        "Occupancy and patient counts",
        "Inventory, asset and payroll costs",
        "Claims and operational risk views",
      ],
      actions: [
        {
          label: "CEO Dashboard",
          href: analytics("ceo-dashboard"),
        },
        {
          label: "Finance Dashboard",
          href: analytics("cfo-dashboard"),
        },
        {
          label: "Operations Dashboard",
          href: analytics("bed-analytics"),
        },
      ],
    },
    {
      key: "mobile-readiness",
      label: "Mobile & Employee Self Service",
      category: "Mobile",
      description:
        "Mobile users, patient app, doctor/nurse mobile workflows, notifications, offline mode, documents and employee self-service access.",
      href: `${root}/mobile`,
      iconKey: "mobile_core",
      tablePatterns: [
        "clinical_mobile_%",
      ],
      tableNames: [
        "clinical_mobile_users",
        "clinical_mobile_devices",
        "clinical_mobile_patient_documents",
        "clinical_mobile_notifications",
        "clinical_mobile_offline_sync",
      ],
      requiredCapabilities: [
        "Mobile user/device registry",
        "Patient and staff mobile workflows",
        "Notifications and document access",
        "Offline sync readiness",
      ],
      actions: [
        {
          label: "Mobile Command Center",
          href: `${root}/mobile`,
        },
        {
          label: "Mobile Users",
          href: mobile("mobile-users"),
        },
        {
          label: "Notifications",
          href: mobile("notifications"),
        },
      ],
    },
  ];
