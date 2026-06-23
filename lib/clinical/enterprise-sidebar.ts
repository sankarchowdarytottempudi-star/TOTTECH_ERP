export type ClinicalSidebarItem = {
  label: string;
  href: string;
  iconKey: string;
  permission?: string;
  roles?: string[];
};

export type ClinicalSidebarGroup = {
  label: string;
  items: ClinicalSidebarItem[];
};

export type ClinicalSidebarDomain = {
  key: string;
  label: string;
  iconKey: string;
  href: string;
  permission?: string;
  roles?: string[];
  groups: ClinicalSidebarGroup[];
};

const root = "/clinical-services";
const route = (slug: string) => `${root}/${slug}`;
const hms = (module: string) => `${root}/hms/${module}`;
const ivf = (module: string) => `${root}/ivf/${module}`;
const pharmacy = (module: string) =>
  `${root}/pharmacy/${module}`;
const finance = (module: string) =>
  `${root}/finance/${module}`;
const analytics = (module: string) =>
  `${root}/analytics/${module}`;
const interop = (module: string) =>
  `${root}/interoperability/${module}`;
const security = (module: string) =>
  `${root}/security/${module}`;
const hrms = (module: string) =>
  `${root}/hrms/${module}`;
const mobile = (module: string) =>
  `${root}/mobile/${module}`;
const compliance = (module: string) =>
  `${root}/compliance/${module}`;
const production = (module: string) =>
  `${root}/production/${module}`;

const adminRoles = [
  "clinical_super_admin",
  "organization_admin",
  "clinic_admin",
  "hospital_admin",
  "branch_admin",
];

const financeRoles = [
  ...adminRoles,
  "billing_executive",
  "finance_manager",
  "insurance_executive",
  "finance_user",
];

const clinicalRoles = [
  ...adminRoles,
  "doctor",
  "vitals",
  "nurse",
  "ivf_specialist",
  "embryologist",
  "lab_technician",
  "radiologist",
  "pharmacist",
  "receptionist",
];

export const clinicalEnterpriseSidebar: ClinicalSidebarDomain[] =
  [
    {
      key: "dashboard",
      label: "Dashboard",
      iconKey: "dashboard",
      href: root,
      groups: [
        {
          label: "Command Centers",
          items: [
            {
              label: "Overview",
              href: root,
              iconKey: "dashboard",
            },
            {
              label: "Executive Dashboard",
              href: analytics("ceo-dashboard"),
              iconKey: "analytics_ceo",
            },
            {
              label: "Clinical Dashboard",
              href: analytics("medical-director"),
              iconKey: "medical_dashboard",
            },
            {
              label: "Operations Dashboard",
              href: analytics("bed-analytics"),
              iconKey: "operations",
            },
            {
              label: "Financial Dashboard",
              href: analytics("cfo-dashboard"),
              iconKey: "finance_core",
              roles: financeRoles,
            },
            {
              label: "AI Insights",
              href: analytics("ai-insights"),
              iconKey: "ai",
            },
            {
              label:
                "Operational Masters",
              href: route(
                "operational-masters"
              ),
              iconKey: "masters",
              roles: adminRoles,
            },
          ],
        },
      ],
    },
    {
      key: "patient-management",
      label: "Patient Management",
      iconKey: "patients",
      href: `${root}/patients`,
      groups: [
        {
          label: "Patient Access",
          items: [
            {
              label: "Registration",
              href: `${root}/patients`,
              iconKey: "patients",
              roles: [
                ...adminRoles,
                "receptionist",
                "doctor",
                "nurse",
              ],
            },
            {
              label: "Patient Search",
              href: `${root}/patients`,
              iconKey: "search",
            },
            {
              label: "Patient 360",
              href: `${root}/patients`,
              iconKey: "patient_360",
            },
            {
              label: "Patient Timeline",
              href: route("patient-timeline"),
              iconKey: "timeline",
            },
            {
              label: "Appointments",
              href: `${root}/appointments`,
              iconKey: "appointments",
            },
            {
              label: "Queue Management",
              href: `${root}/appointments`,
              iconKey: "queue",
            },
            {
              label: "Real Workflow Console",
              href: route("operations"),
              iconKey: "workflow",
              roles: clinicalRoles,
            },
            {
              label: "Follow Ups",
              href: route("follow-ups"),
              iconKey: "followups",
            },
          ],
        },
      ],
    },
    {
      key: "doctors",
      label: "Doctors",
      iconKey: "doctors",
      href: `${root}/doctors`,
      roles: [
        ...adminRoles,
        "doctor",
        "nurse",
        "receptionist",
      ],
      groups: [
        {
          label: "Doctor Workflows",
          items: [
            {
              label: "Dashboard",
              href: `${root}/doctors`,
              iconKey: "doctors",
            },
            {
              label: "Consultation Queue",
              href: `${root}/doctors/queue`,
              iconKey: "queue",
            },
            {
              label: "Vitals Ready Queue",
              href: `${root}/operations#vitals`,
              iconKey: "monitoring",
            },
            {
              label: "Active Consultations",
              href: `${root}/doctors/active`,
              iconKey: "opd",
            },
            {
              label: "Completed Consultations",
              href: `${root}/doctors/completed`,
              iconKey: "clinical_reports",
            },
            {
              label: "My Appointments",
              href: `${root}/doctors/appointments`,
              iconKey: "appointments",
            },
            {
              label: "Prescriptions",
              href: `${root}/doctors/prescriptions`,
              iconKey: "prescriptions",
            },
            {
              label: "Lab Orders",
              href: `${root}/doctors/lab-orders`,
              iconKey: "laboratory",
            },
            {
              label: "Radiology Orders",
              href: `${root}/doctors/radiology-orders`,
              iconKey: "radiology",
            },
            {
              label: "Clinical Notes",
              href: `${root}/doctors/clinical-notes`,
              iconKey: "documents",
            },
            {
              label: "Follow Ups",
              href: `${root}/doctors/follow-ups`,
              iconKey: "followups",
            },
            {
              label: "Patient History",
              href: `${root}/doctors/patient-history`,
              iconKey: "patient_360",
            },
          ],
        },
      ],
    },
    {
      key: "op",
      label: "Outpatient (OP)",
      iconKey: "opd",
      href: route("consultations"),
      roles: clinicalRoles,
      groups: [
        {
          label: "OP Workflows",
          items: [
            {
              label: "Consultations",
              href: route("consultations"),
              iconKey: "opd",
            },
            {
              label: "Prescriptions",
              href: route("prescriptions"),
              iconKey: "prescriptions",
            },
            {
              label: "Procedures",
              href: route("procedures"),
              iconKey: "procedures",
            },
            {
              label: "Lab Orders",
              href: route("lab-orders"),
              iconKey: "laboratory",
            },
            {
              label: "Radiology Orders",
              href: route("radiology-orders"),
              iconKey: "radiology",
            },
            {
              label: "Follow Ups",
              href: route("op-follow-ups"),
              iconKey: "followups",
            },
          ],
        },
      ],
    },
    {
      key: "ip",
      label: "Inpatient (IP)",
      iconKey: "ipd",
      href: route("ipd"),
      roles: clinicalRoles,
      groups: [
        {
          label: "IP Workflows",
          items: [
            {
              label: "Admissions",
              href: route("ipd"),
              iconKey: "admissions",
            },
            {
              label: "Bed Management",
              href: route("bed-management"),
              iconKey: "bed",
            },
            {
              label: "Bed Allocations",
              href: hms("bed-allocations"),
              iconKey: "bed",
            },
            {
              label: "Bed Transfers",
              href: hms("bed-transfers"),
              iconKey: "workflow",
            },
            {
              label: "Ward Management",
              href: hms("wards"),
              iconKey: "ward",
            },
            {
              label: "Nursing Station",
              href: route("nursing"),
              iconKey: "nursing",
            },
            {
              label: "Nursing Assessments",
              href: hms("nursing-assessments"),
              iconKey: "nursing",
            },
            {
              label: "Medication Administration",
              href: hms("medication-administrations"),
              iconKey: "pharmacy",
            },
            {
              label: "Care Plans",
              href: route("care-plans"),
              iconKey: "care_plans",
            },
            {
              label: "Discharges",
              href: hms("discharges"),
              iconKey: "discharge",
            },
          ],
        },
      ],
    },
    {
      key: "er",
      label: "Emergency (ER)",
      iconKey: "er",
      href: hms("er"),
      roles: clinicalRoles,
      groups: [
        {
          label: "Emergency Operations",
          items: [
            {
              label: "Triage",
              href: hms("er"),
              iconKey: "triage",
            },
            {
              label: "Emergency Registration",
              href: hms("er"),
              iconKey: "registration",
            },
            {
              label: "Observation",
              href: route("er-observation"),
              iconKey: "observation",
            },
            {
              label: "Emergency Billing",
              href: hms("billing"),
              iconKey: "billing",
              roles: financeRoles,
            },
          ],
        },
      ],
    },
    {
      key: "icu",
      label: "ICU",
      iconKey: "icu",
      href: route("icu"),
      roles: clinicalRoles,
      groups: [
        {
          label: "Critical Care",
          items: [
            {
              label: "ICU Dashboard",
              href: route("icu"),
              iconKey: "icu",
            },
            {
              label: "Critical Monitoring",
              href: route("icu"),
              iconKey: "monitoring",
            },
            {
              label: "Ventilator Management",
              href: route("ventilator-management"),
              iconKey: "ventilator",
            },
            {
              label: "Critical Alerts",
              href: route("critical-alerts"),
              iconKey: "alerts",
            },
          ],
        },
      ],
    },
    {
      key: "operation-theatre",
      label: "Operation Theatre",
      iconKey: "ot",
      href: route("ot"),
      roles: clinicalRoles,
      groups: [
        {
          label: "OT Workflows",
          items: [
            {
              label: "Surgery Scheduling",
              href: route("ot"),
              iconKey: "surgery",
            },
            {
              label: "OT Calendar",
              href: route("ot-calendar"),
              iconKey: "calendar",
            },
            {
              label: "Procedures",
              href: route("ot"),
              iconKey: "procedures",
            },
            {
              label: "Anesthesia",
              href: route("anesthesia"),
              iconKey: "anesthesia",
            },
            {
              label: "Recovery",
              href: route("ot-recovery"),
              iconKey: "recovery",
            },
          ],
        },
      ],
    },
    {
      key: "ivf",
      label: "IVF & Fertility",
      iconKey: "ivf",
      href: ivf("dashboard"),
      roles: [
        ...adminRoles,
        "doctor",
        "ivf_specialist",
        "embryologist",
        "nurse",
        "billing_executive",
      ],
      groups: [
        {
          label: "Fertility Workflows",
          items: [
            {
              label: "IVF Dashboard",
              href: ivf("dashboard"),
              iconKey: "analytics_ivf",
            },
            {
              label: "Couple Management",
              href: ivf("couples"),
              iconKey: "ivf_couples",
            },
            {
              label: "Female Assessment",
              href: ivf("female-assessment"),
              iconKey: "ivf_assessment",
            },
            {
              label: "Male Assessment",
              href: ivf("male-assessment"),
              iconKey: "ivf_assessment",
            },
            {
              label: "Fertility Assessment",
              href: ivf("treatment-plans"),
              iconKey: "ivf_treatment",
            },
            {
              label: "IVF Cycles",
              href: ivf("cycles"),
              iconKey: "ivf_cycles",
            },
            {
              label: "Stimulation",
              href: ivf("stimulation"),
              iconKey: "ivf_treatment",
            },
            {
              label: "Retrieval",
              href: ivf("retrievals"),
              iconKey: "procedures",
            },
            {
              label: "Embryology",
              href: ivf("embryology"),
              iconKey: "ivf_embryology",
            },
            {
              label: "Cryopreservation",
              href: ivf("cryo"),
              iconKey: "ivf_cryo",
            },
            {
              label: "Transfer",
              href: ivf("transfers"),
              iconKey: "ivf_transfer",
            },
            {
              label: "Donor Management",
              href: ivf("donors"),
              iconKey: "ivf_donor",
            },
            {
              label: "Surrogacy",
              href: ivf("surrogacy"),
              iconKey: "ivf_surrogacy",
            },
            {
              label: "Pregnancy Tracking",
              href: ivf("pregnancies"),
              iconKey: "ivf_pregnancy",
            },
            {
              label: "IVF Analytics",
              href: analytics("ivf-analytics"),
              iconKey: "analytics_ivf",
            },
          ],
        },
      ],
    },
    {
      key: "laboratory",
      label: "Laboratory",
      iconKey: "laboratory",
      href: route("laboratory"),
      roles: [
        ...adminRoles,
        "doctor",
        "lab_technician",
        "nurse",
      ],
      groups: [
        {
          label: "LIS Workflows",
          items: [
            {
              label: "Orders",
              href: route("laboratory"),
              iconKey: "laboratory",
            },
            {
              label: "Sample Collection",
              href: route("laboratory"),
              iconKey: "samples",
            },
            {
              label: "Sample Tracking",
              href: route("laboratory"),
              iconKey: "tracking",
            },
            {
              label: "Processing",
              href: route("laboratory"),
              iconKey: "processing",
            },
            {
              label: "Results",
              href: route("laboratory"),
              iconKey: "results",
            },
            {
              label: "Approvals",
              href: security("approval-workflows"),
              iconKey: "approvals",
            },
            {
              label: "Reports",
              href: analytics("lab-analytics"),
              iconKey: "reports",
              roles: adminRoles,
            },
          ],
        },
      ],
    },
    {
      key: "radiology",
      label: "Radiology & PACS",
      iconKey: "radiology",
      href: route("radiology"),
      roles: [
        ...adminRoles,
        "doctor",
        "radiologist",
        "nurse",
      ],
      groups: [
        {
          label: "Imaging Workflows",
          items: [
            {
              label: "Orders",
              href: route("radiology"),
              iconKey: "radiology",
            },
            {
              label: "Imaging",
              href: route("radiology"),
              iconKey: "imaging",
            },
            {
              label: "Reporting",
              href: route("radiology"),
              iconKey: "reports",
            },
            {
              label: "PACS Viewer",
              href: interop("pacs-studies"),
              iconKey: "pacs",
            },
            {
              label: "DICOM Archive",
              href: interop("dicom-nodes"),
              iconKey: "dicom",
            },
          ],
        },
      ],
    },
    {
      key: "pharmacy",
      label: "Pharmacy",
      iconKey: "pharmacy",
      href: `${root}/pharmacy`,
      roles: [
        ...adminRoles,
        "pharmacist",
        "doctor",
        "nurse",
        "billing_executive",
      ],
      groups: [
        {
          label: "Pharmacy Workflows",
          items: [
            {
              label: "Pending Prescriptions",
              href: route("pharmacy"),
              iconKey: "prescriptions",
            },
            {
              label: "Sales",
              href: route("pharmacy"),
              iconKey: "pharmacy_sales",
            },
            {
              label: "Inventory",
              href: route("pharmacy"),
              iconKey: "pharmacy_inventory",
            },
            {
              label: "Purchases",
              href: route("pharmacy"),
              iconKey: "pharmacy_purchase_orders",
            },
            {
              label: "Returns",
              href: route("pharmacy"),
              iconKey: "pharmacy_returns",
            },
            {
              label: "Reports",
              href: analytics("pharmacy-analytics"),
              iconKey: "reports",
              roles: adminRoles,
            },
          ],
        },
      ],
    },
    {
      key: "inventory-procurement",
      label: "Inventory & Procurement",
      iconKey: "inventory",
      href: route("inventory"),
      roles: [
        ...adminRoles,
        "pharmacist",
        "finance_manager",
      ],
      groups: [
        {
          label: "Supply Chain",
          items: [
            {
              label: "Items",
              href: route("inventory"),
              iconKey: "items",
            },
            {
              label: "Warehouses",
              href: route("inventory"),
              iconKey: "warehouse",
            },
            {
              label: "Stock Movements",
              href: route("inventory"),
              iconKey: "stock_movements",
            },
            {
              label: "Purchase Orders",
              href: route("inventory"),
              iconKey: "purchase_orders",
            },
            {
              label: "GRN",
              href: route("inventory"),
              iconKey: "grn",
            },
            {
              label: "Assets",
              href: finance("assets"),
              iconKey: "assets",
            },
          ],
        },
      ],
    },
    {
      key: "billing-revenue",
      label: "Billing & Revenue",
      iconKey: "billing",
      href: hms("billing"),
      roles: financeRoles,
      groups: [
        {
          label: "Revenue Cycle",
          items: [
            {
              label: "OP Billing",
              href: hms("billing"),
              iconKey: "billing",
            },
            {
              label: "IP Billing",
              href: hms("billing"),
              iconKey: "ipd",
            },
            {
              label: "Packages",
              href: finance("revenue-cycle"),
              iconKey: "packages",
            },
            {
              label: "Payments",
              href: finance("cash"),
              iconKey: "payments",
            },
            {
              label: "Refunds",
              href: security("approval-workflows"),
              iconKey: "refunds",
            },
            {
              label: "Revenue Dashboard",
              href: analytics("cfo-dashboard"),
              iconKey: "finance_core",
            },
          ],
        },
      ],
    },
    {
      key: "insurance-tpa",
      label: "Insurance & TPA",
      iconKey: "insurance",
      href: finance("claims"),
      roles: financeRoles,
      groups: [
        {
          label: "Payer Workflows",
          items: [
            {
              label: "Insurance",
              href: hms("insurance"),
              iconKey: "insurance",
            },
            {
              label: "Pre Authorization",
              href: finance("preauth"),
              iconKey: "preauth",
            },
            {
              label: "Claims",
              href: finance("claims"),
              iconKey: "claims",
            },
            {
              label: "Settlements",
              href: finance("claims"),
              iconKey: "settlements",
            },
            {
              label: "Analytics",
              href: analytics("insurance-analytics"),
              iconKey: "analytics_insurance",
            },
          ],
        },
      ],
    },
    {
      key: "referral-crm",
      label: "Referral & CRM",
      iconKey: "referral",
      href: finance("referrals"),
      roles: [
        ...adminRoles,
        "referral_manager",
        "billing_executive",
        "finance_manager",
      ],
      groups: [
        {
          label: "Growth Workflows",
          items: [
            {
              label: "Referral Sources",
              href: finance("referrals"),
              iconKey: "referral",
            },
            {
              label: "Referral Tracking",
              href: finance("referrals"),
              iconKey: "tracking",
            },
            {
              label: "Commissions",
              href: finance("commission-calculations"),
              iconKey: "commissions",
            },
            {
              label: "Leads",
              href: route("crm-leads"),
              iconKey: "leads",
            },
            {
              label: "Campaigns",
              href: route("crm-campaigns"),
              iconKey: "campaigns",
            },
            {
              label: "Patient Retention",
              href: route("patient-retention"),
              iconKey: "retention",
            },
          ],
        },
      ],
    },
    {
      key: "finance-accounts",
      label: "Finance & Accounts",
      iconKey: "finance_core",
      href: `${root}/finance`,
      roles: financeRoles,
      groups: [
        {
          label: "Accounting",
          items: [
            {
              label: "Chart Of Accounts",
              href: finance("coa"),
              iconKey: "finance_coa",
            },
            {
              label: "General Ledger",
              href: finance("gl"),
              iconKey: "finance_gl",
            },
            {
              label: "Receivables",
              href: finance("ar"),
              iconKey: "finance_ar",
            },
            {
              label: "Payables",
              href: finance("ap"),
              iconKey: "finance_ap",
            },
            {
              label: "Budgets",
              href: finance("budgets"),
              iconKey: "finance_budgets",
            },
            {
              label: "Fixed Assets",
              href: finance("assets"),
              iconKey: "finance_assets",
            },
          ],
        },
      ],
    },
    {
      key: "hrms",
      label: "HRMS",
      iconKey: "hrms_core",
      href: `${root}/hrms`,
      roles: [
        ...adminRoles,
        "hr_manager",
        "finance_manager",
      ],
      groups: [
        {
          label: "Workforce",
          items: [
            {
              label: "Employees",
              href: hrms("employees"),
              iconKey: "hr_employees",
            },
            {
              label: "Attendance",
              href: hrms("attendance"),
              iconKey: "hr_attendance",
            },
            {
              label: "Leave",
              href: hrms("leave"),
              iconKey: "hr_leave",
            },
            {
              label: "Payroll",
              href: hrms("payroll"),
              iconKey: "hr_payroll",
            },
            {
              label: "Credentialing",
              href: hrms("credentialing"),
              iconKey: "hr_credentialing",
            },
            {
              label: "LMS",
              href: hrms("lms"),
              iconKey: "hr_lms",
            },
            {
              label: "CME",
              href: hrms("cme"),
              iconKey: "hr_cme",
            },
          ],
        },
      ],
    },
    {
      key: "analytics-reports",
      label: "Analytics & Reports",
      iconKey: "analytics_core",
      href: `${root}/analytics`,
      roles: adminRoles,
      groups: [
        {
          label: "Reports",
          items: [
            {
              label: "Reports Center",
              href: route("reports"),
              iconKey: "reports",
            },
            {
              label: "Clinical Reports",
              href: analytics("medical-director"),
              iconKey: "clinical_reports",
            },
            {
              label: "IVF Reports",
              href: analytics("ivf-analytics"),
              iconKey: "analytics_ivf",
            },
            {
              label: "Financial Reports",
              href: analytics("cfo-dashboard"),
              iconKey: "financial_reports",
              roles: financeRoles,
            },
            {
              label: "Operational Reports",
              href: analytics("bed-analytics"),
              iconKey: "operational_reports",
            },
            {
              label: "Custom Reports",
              href: analytics("report-builder"),
              iconKey: "custom_reports",
            },
            {
              label: "Scheduled Reports",
              href: analytics("scheduled-reports"),
              iconKey: "scheduled_reports",
            },
          ],
        },
      ],
    },
    {
      key: "tottech-ai",
      label: "TOTTECH AI",
      iconKey: "ai",
      href: `${root}/ai`,
      groups: [
        {
          label: "AI Workspaces",
          items: [
            {
              label: "Clinical AI",
              href: `${root}/ai`,
              iconKey: "clinical_ai",
            },
            {
              label: "IVF AI",
              href: ivf("ai"),
              iconKey: "ivf_ai",
            },
            {
              label: "Finance AI",
              href: finance("ai-finance"),
              iconKey: "finance_ai",
              roles: financeRoles,
            },
            {
              label: "Operations AI",
              href: analytics("ai-insights"),
              iconKey: "operations_ai",
            },
            {
              label: "AI Command Center",
              href: `${root}/ai`,
              iconKey: "ai_command",
            },
          ],
        },
      ],
    },
    {
      key: "patient-engagement",
      label: "Patient Engagement",
      iconKey: "patient_engagement",
      href: `${root}/mobile`,
      groups: [
        {
          label: "Engagement Channels",
          items: [
            {
              label: "Patient Portal",
              href: mobile("patient-dashboard"),
              iconKey: "patient_portal",
            },
            {
              label: "Mobile Apps",
              href: `${root}/mobile`,
              iconKey: "mobile_core",
            },
            {
              label: "WhatsApp",
              href: mobile("notifications"),
              iconKey: "whatsapp",
            },
            {
              label: "Email Campaigns",
              href: route("email-campaigns"),
              iconKey: "email",
            },
            {
              label: "Feedback",
              href: route("patient-feedback"),
              iconKey: "feedback",
            },
          ],
        },
      ],
    },
    {
      key: "interoperability",
      label: "Interoperability",
      iconKey: "interop_core",
      href: `${root}/interoperability`,
      roles: [
        ...adminRoles,
        "doctor",
        "lab_technician",
        "radiologist",
      ],
      groups: [
        {
          label: "Standards",
          items: [
            {
              label: "ABHA",
              href: interop("abha"),
              iconKey: "interop_abha",
            },
            {
              label: "ABDM",
              href: interop("consents"),
              iconKey: "interop_consents",
            },
            {
              label: "FHIR",
              href: interop("fhir-resources"),
              iconKey: "interop_fhir",
            },
            {
              label: "HL7",
              href: interop("hl7"),
              iconKey: "interop_hl7",
            },
            {
              label: "DICOM",
              href: interop("dicom-nodes"),
              iconKey: "interop_dicom",
            },
          ],
        },
      ],
    },
    {
      key: "security-compliance",
      label: "Security & Compliance",
      iconKey: "security_core",
      href: `${root}/security`,
      roles: adminRoles,
      groups: [
        {
          label: "Security Governance",
          items: [
            {
              label: "Users",
              href: security("user-permissions"),
              iconKey: "users",
            },
            {
              label: "Hospital Users",
              href: "/clinical-services/users",
              iconKey: "users",
            },
            {
              label: "Roles",
              href: route("admin/roles"),
              iconKey: "security_rbac",
            },
            {
              label: "Permissions",
              href: security("permissions"),
              iconKey: "security_permissions",
            },
            {
              label: "Audit Logs",
              href: route("audit"),
              iconKey: "audit",
            },
            {
              label: "Security Events",
              href: security("security-events"),
              iconKey: "security_events",
            },
            {
              label: "Compliance",
              href: compliance("frameworks"),
              iconKey: "compliance_core",
            },
          ],
        },
      ],
    },
    {
      key: "administration",
      label: "Administration",
      iconKey: "administration",
      href: route("administration"),
      roles: adminRoles,
      groups: [
        {
          label: "Platform Setup",
          items: [
            {
              label: "Hospital Creation",
              href: route("platform-hospitals"),
              iconKey: "hospital",
              roles: [
                "tottech_super_admin",
                "clinical_super_admin",
                "organization_admin",
              ],
            },
            {
              label: "Hospital Licensing",
              href: route("hospital-licensing"),
              iconKey: "key",
              roles: [
                "tottech_super_admin",
                "clinical_super_admin",
                "organization_admin",
                "hospital_admin",
              ],
            },
            {
              label: "Hospital Setup",
              href: route("configuration"),
              iconKey: "hospital",
            },
            {
              label: "Branch Setup",
              href: route("branch-setup"),
              iconKey: "branch",
            },
            {
              label: "Departments",
              href: route("departments"),
              iconKey: "departments",
            },
            {
              label: "Masters",
              href: route("masters"),
              iconKey: "masters",
            },
            {
              label: "Rooms / OT / Collections",
              href: route("operations"),
              iconKey: "workflow",
            },
            {
              label: "Integrations",
              href: production("services"),
              iconKey: "integrations",
            },
            {
              label: "Backup & Restore",
              href: route("system"),
              iconKey: "backup",
            },
            {
              label: "System Health",
              href: production("monitoring"),
              iconKey: "system_health",
            },
            {
              label: "Production Readiness",
              href: route("production-readiness"),
              iconKey: "production_go_live",
            },
            {
              label:
                "Operational Masters",
              href: route(
                "operational-masters"
              ),
              iconKey: "masters",
            },
            {
              label: "Reports Center",
              href: route("reports"),
              iconKey: "reports",
            },
            {
              label: "API Catalog",
              href: route("api-catalog"),
              iconKey: "interop_fhir",
            },
            {
              label: "AI Insights",
              href: analytics("ai-insights"),
              iconKey: "ai",
            },
            {
              label: "Analytics",
              href: `${root}/analytics`,
              iconKey: "analytics_core",
            },
            {
              label: "Data Dictionary",
              href: route("data-dictionary"),
              iconKey: "database",
            },
          ],
        },
      ],
    },
  ];
