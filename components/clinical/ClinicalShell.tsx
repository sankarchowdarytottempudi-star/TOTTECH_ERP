"use client";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Activity,
  AlertTriangle,
  Baby,
  BarChart3,
  Bell,
  Boxes,
  Brain,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Cloud,
  Database,
  Fingerprint,
  FileText,
  FlaskConical,
  GitBranch,
  Globe2,
  GraduationCap,
  HeartPulse,
  KeyRound,
  LogOut,
  Menu,
  Network,
  Package,
  Pill,
  RadioTower,
  Receipt,
  ScanLine,
  Server,
  Settings,
  Search,
  ShieldCheck,
  Snowflake,
  Stethoscope,
  ShoppingCart,
  Truck,
  UserRound,
  UsersRound,
  Warehouse,
  Workflow,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  clinicalEnterpriseSidebar,
  type ClinicalSidebarDomain,
  type ClinicalSidebarGroup,
} from "@/lib/clinical/enterprise-sidebar";
import ClinicalGlobalSearch from "@/components/clinical/ClinicalGlobalSearch";
import {
  CLINICAL_MODULE_LABELS,
  isModuleLicensed,
  moduleCodeForClinicalPath,
} from "@/lib/clinical/module-licensing";
import {
  shouldShowClinicalAnalytics,
  workflowSidebarDomainKeys,
  getClinicalRoleFamily,
} from "@/lib/clinical/workflow-experience";
import { translateLabel } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

type MenuItem = {
  menu_key: string;
  label: string;
  path: string;
  module_name?: string | null;
};

type ClinicalContextPayload = {
  context?: {
    hospitalId?: number;
    hospitalName?: string;
    branchName?: string;
    clinicName?: string;
    organizationName?: string;
    roleName?: string;
    roleKey?: string;
	    permissions?: Record<string, unknown>;
	    licensedModules?: string[];
	    branding?: {
      name?: string;
      logoUrl?: string | null;
      primaryColor?: string;
      accentColor?: string;
      source?: string;
    };
  };
  hospitals?: {
    id: number;
    hospital_name?: string;
    hospital_code?: string;
    status?: string;
    branding?: Record<string, unknown>;
  }[];
  menu?: MenuItem[];
};

type ClinicalUserProfile = {
  full_name?: string;
  role?: string;
  username?: string;
  email?: string;
  photo_url?: string | null;
  avatar_url?: string | null;
  profile_picture?: string | null;
  image_url?: string | null;
};

function readStoredClinicalUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser =
      localStorage.getItem("erpUser");

    return storedUser
      ? (JSON.parse(
          storedUser
        ) as ClinicalUserProfile)
      : null;
  } catch {
    return null;
  }
}

function resolveUserImage(
  user: ClinicalUserProfile | null
) {
  const value = String(
    user?.photo_url ||
      user?.avatar_url ||
      user?.profile_picture ||
      user?.image_url ||
      ""
  ).trim();

  return value || null;
}

const iconMap: Record<
  string,
  LucideIcon
> = {
  dashboard: Activity,
  hms_core: ClipboardList,
  patients: UserRound,
  appointments: CalendarDays,
  doctors: Stethoscope,
  front_desk: ClipboardList,
  opd: Stethoscope,
  ipd: Building2,
  er: Activity,
  icu: HeartPulse,
  ot: Workflow,
  nursing: ClipboardList,
  ivf: HeartPulse,
  ivf_core: HeartPulse,
  ivf_couples: UsersRound,
  ivf_assessment: Stethoscope,
  ivf_treatment: Workflow,
  ivf_cycles: Workflow,
  ivf_embryology: FlaskConical,
  ivf_cryo: Snowflake,
  ivf_transfer: HeartPulse,
  ivf_pregnancy: Baby,
  ivf_donor: UsersRound,
  ivf_surrogacy: Baby,
  ivf_billing: BarChart3,
  ivf_referrals: ClipboardList,
  ivf_ai: Brain,
  laboratory: FlaskConical,
  radiology: FileText,
  pharmacy: Pill,
  pharmacy_core: Pill,
  pharmacy_medicines: Pill,
  pharmacy_categories: Package,
  pharmacy_vendors: Truck,
  pharmacy_requisitions: ClipboardList,
  pharmacy_purchase_orders: ClipboardList,
  pharmacy_grn: Truck,
  pharmacy_inventory: Boxes,
  pharmacy_warehouses: Warehouse,
  pharmacy_transfers: Truck,
  pharmacy_sales: ShoppingCart,
  pharmacy_ip: Pill,
  pharmacy_ivf: Pill,
  pharmacy_controlled: AlertTriangle,
  pharmacy_expiry: AlertTriangle,
  pharmacy_returns: Workflow,
  pharmacy_adjustments: ClipboardList,
  pharmacy_audits: ShieldCheck,
  pharmacy_reorder: Workflow,
  pharmacy_ai: Brain,
  pharmacy_formulary: FileText,
  pharmacy_claims: ShieldCheck,
  finance_core: BarChart3,
  finance_coa: ClipboardList,
  finance_gl: FileText,
  finance_cost_centers: Building2,
  finance_profit_centers: BarChart3,
  finance_ar: BarChart3,
  finance_ap: ClipboardList,
  finance_cash: BarChart3,
  finance_banks: Building2,
  finance_gst: FileText,
  finance_tds: FileText,
  finance_assets: Building2,
  finance_budgets: BarChart3,
  finance_revenue: BarChart3,
  finance_insurance_companies: ShieldCheck,
  finance_tpa: ShieldCheck,
  finance_preauth: ClipboardList,
  finance_claims: ShieldCheck,
  finance_claim_documents: FileText,
  finance_corporates: Building2,
  finance_corporate_patients: UsersRound,
  finance_referrals: UsersRound,
  finance_commission_rules: ClipboardList,
  finance_commissions: BarChart3,
  finance_incentives: BarChart3,
  finance_payouts: ClipboardList,
  finance_ai: Brain,
  interop_core: Globe2,
  interop_abha: Fingerprint,
  interop_consents: ShieldCheck,
  interop_hie: Network,
  interop_fhir: GitBranch,
  interop_hl7: RadioTower,
  interop_hl7_errors: AlertTriangle,
  interop_dicom: ScanLine,
  interop_pacs: FileText,
  interop_ayushman: ShieldCheck,
  interop_partner_labs: FlaskConical,
  interop_partner_pharmacies: Pill,
  interop_referral_network: Building2,
  interop_marketplace: KeyRound,
  interop_terminology: Stethoscope,
  interop_mpi: Network,
  interop_security: ShieldCheck,
  mobile_core: Activity,
  mobile_users: UserRound,
  mobile_devices: ShieldCheck,
  mobile_patient_app: UserRound,
  mobile_patient_360: HeartPulse,
  mobile_lab_reports: FlaskConical,
  mobile_radiology: FileText,
  mobile_eprescriptions: Pill,
  mobile_med_reminders: Bell,
  mobile_payments: BarChart3,
  mobile_documents: FileText,
  mobile_health_tracker: HeartPulse,
  mobile_ivf: Baby,
  mobile_doctor: Stethoscope,
  mobile_telemedicine: Activity,
  mobile_nurse: ClipboardList,
  mobile_referral: UsersRound,
  mobile_corporate: Building2,
  mobile_executive: BarChart3,
  mobile_notifications: Bell,
  mobile_offline: Workflow,
  mobile_ai: Brain,
  analytics_core: BarChart3,
  analytics_warehouse: Database,
  analytics_kpis: BarChart3,
  analytics_ceo: BarChart3,
  analytics_cfo: BarChart3,
  analytics_medical_director: HeartPulse,
  analytics_ivf: Baby,
  analytics_lab: FlaskConical,
  analytics_radiology: FileText,
  analytics_pharmacy: Pill,
  analytics_insurance: ShieldCheck,
  analytics_referral: UsersRound,
  analytics_patient: UserRound,
  analytics_hr: UsersRound,
  analytics_ot: Workflow,
  analytics_bed: Building2,
  analytics_ai: Brain,
  analytics_forecasting: BarChart3,
  analytics_report_builder: FileText,
  analytics_scheduled_reports: CalendarDays,
  analytics_catalog: FileText,
  analytics_export: FileText,
  analytics_bi: Network,
  analytics_alerts: AlertTriangle,
  analytics_lake: Database,
  dictionary_core: Database,
  dictionary_entities: Database,
  dictionary_fields: ClipboardList,
  dictionary_relationships: GitBranch,
  dictionary_constraints: KeyRound,
  dictionary_indexes: Database,
  dictionary_retention: ShieldCheck,
  dictionary_archival: ShieldCheck,
  dictionary_er: Network,
  dictionary_generation: Workflow,
  dictionary_blueprints: FileText,
  uiux_core: Workflow,
  uiux_design_tokens: Database,
  uiux_navigation: Workflow,
  uiux_screens: FileText,
  uiux_dashboards: BarChart3,
  uiux_components: ClipboardList,
  uiux_workflows: Workflow,
  uiux_responsive: Activity,
  uiux_accessibility: ShieldCheck,
  uiux_mobile: Bell,
  production_core: Server,
  production_apps: Boxes,
  production_services: Server,
  production_infra: Cloud,
  production_security: ShieldCheck,
  production_testing: ClipboardList,
  production_devops: Workflow,
  production_monitoring: Activity,
  production_backups: Database,
  production_go_live: ShieldCheck,
  security_core: ShieldCheck,
  security_rbac: UsersRound,
  security_permissions: KeyRound,
  security_role_matrix: ShieldCheck,
  security_data_masks: ShieldCheck,
  security_access_logs: FileText,
  security_approvals: Workflow,
  security_mfa: KeyRound,
  security_break_glass: AlertTriangle,
  security_reports: FileText,
  api_catalog_core: Network,
  api_catalog_rest: Network,
  api_catalog_graphql: GitBranch,
  api_catalog_websockets: RadioTower,
  api_catalog_events: Workflow,
  api_catalog_topics: RadioTower,
  api_catalog_rabbitmq: RadioTower,
  api_catalog_webhooks: Globe2,
  api_catalog_errors: AlertTriangle,
  api_catalog_openapi: FileText,
  api_catalog_integrations: Network,
  business_spec_core: ClipboardList,
  business_spec_screens: ClipboardList,
  business_spec_validations: ShieldCheck,
  business_spec_workflows: Workflow,
  business_spec_approvals: KeyRound,
  business_spec_reports: FileText,
  business_spec_exports: Database,
  business_spec_templates: Bell,
  business_spec_audit: ShieldCheck,
  business_spec_documents: FileText,
  hrms_core: UsersRound,
  hr_employees: UsersRound,
  hr_recruitment: ClipboardList,
  hr_attendance: Activity,
  hr_biometric: Fingerprint,
  hr_roster: CalendarDays,
  hr_leave: ClipboardList,
  hr_payroll: BarChart3,
  hr_credentialing: Stethoscope,
  hr_privileges: ShieldCheck,
  hr_lms: FileText,
  hr_cme: GraduationCap,
  hr_analytics: BarChart3,
  hr_ai: Brain,
  compliance_core: ShieldCheck,
  compliance_frameworks: ShieldCheck,
  compliance_controls: ClipboardList,
  compliance_consents: FileText,
  compliance_safety: HeartPulse,
  compliance_incidents: AlertTriangle,
  compliance_risks: AlertTriangle,
  compliance_infection: HeartPulse,
  compliance_security: ShieldCheck,
  compliance_golive: Workflow,
  compliance_reports: FileText,
  billing: BarChart3,
  insurance: ShieldCheck,
  inventory: ClipboardList,
  reports: BarChart3,
  documents: FileText,
  workflow: Workflow,
  form_builder: ClipboardList,
  ai: Brain,
  administration: ShieldCheck,
  settings: Settings,
  admissions: Building2,
  anesthesia: HeartPulse,
  approvals: ShieldCheck,
  assets: Building2,
	  audit: FileText,
	  backup: Database,
	  bed: Building2,
	  branch: GitBranch,
	  calendar: CalendarDays,
	  key: KeyRound,
	  campaigns: Bell,
  care_plans: ClipboardList,
  claims: ShieldCheck,
  clinical_ai: Brain,
  clinical_reports: HeartPulse,
  commissions: BarChart3,
  custom_reports: FileText,
  departments: Building2,
  dicom: ScanLine,
  discharge: ClipboardList,
  email: Bell,
  feedback: ClipboardList,
  financial_reports: BarChart3,
  followups: CalendarDays,
  grn: Truck,
  hospital: Building2,
  imaging: ScanLine,
  integrations: Network,
  items: Package,
  leads: UsersRound,
  masters: Database,
  medical_dashboard: HeartPulse,
  monitoring: Activity,
  observation: Activity,
  operational_reports: Workflow,
  operations: Workflow,
  operations_ai: Brain,
  packages: Boxes,
  pacs: FileText,
  patient_360: HeartPulse,
  patient_engagement: UsersRound,
  patient_portal: UserRound,
  payments: BarChart3,
  preauth: ClipboardList,
  prescriptions: Pill,
  procedures: Workflow,
  processing: Workflow,
  purchase_orders: ClipboardList,
  queue: ClipboardList,
  recovery: HeartPulse,
  referral: UsersRound,
  refunds: BarChart3,
  registration: UserRound,
  results: FileText,
  retention: HeartPulse,
  samples: FlaskConical,
  scheduled_reports: CalendarDays,
  security_events: AlertTriangle,
  settlements: ShieldCheck,
  stock_movements: Truck,
  surgery: Workflow,
  system_health: Activity,
  timeline: Workflow,
  tracking: Workflow,
  triage: AlertTriangle,
  users: UsersRound,
  ventilator: HeartPulse,
  ward: Building2,
  warehouse: Warehouse,
  whatsapp: Bell,
  ai_command: Brain,
};

type AccessControlledNode = {
  permission?: string;
  roles?: string[];
};

function normalizeRoleName(
  role?: string | null
) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function hasPermission(
  permissions: Record<
    string,
    unknown
  >,
  permission?: string
) {
  if (!permission) {
    return true;
  }

  if (Array.isArray(permissions)) {
    return permissions.includes(
      permission
    );
  }

  const value =
    permissions[permission] ??
    permissions["*"] ??
    permissions.all ??
    permissions.all_access;

  return (
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1"
  );
}

function canAccessNode(
  node: AccessControlledNode,
  roleKey: string,
  permissions: Record<
    string,
    unknown
  >
) {
  const role =
    normalizeRoleName(roleKey);

  if (
    !role &&
    !node.roles?.length &&
    !node.permission
  ) {
    return true;
  }

  if (
    !role &&
    (node.roles?.length ||
      node.permission)
  ) {
    return true;
  }

  const privilegedRoles = new Set([
    "super_admin",
    "tottech_super_admin",
    "clinical_super_admin",
    "tenant_admin",
    "organization_admin",
    "hospital_admin",
    "branch_admin",
    "clinic_admin",
  ]);

  if (privilegedRoles.has(role)) {
    return true;
  }

  if (
    node.roles?.length &&
    !node.roles
      .map(normalizeRoleName)
      .includes(role)
  ) {
    return false;
  }

  return hasPermission(
    permissions,
    node.permission
  );
}

function textMatches(
  value: string,
  query: string
) {
  return value
    .toLowerCase()
    .includes(query);
}

function filterSidebarByAccessAndSearch({
  domains,
  roleKey,
  permissions,
  search,
  licensedModules,
  allowedDomainKeys,
}: {
  domains: ClinicalSidebarDomain[];
  roleKey: string;
  permissions: Record<
    string,
    unknown
  >;
  search: string;
  licensedModules?: string[];
  allowedDomainKeys?: string[] | null;
}) {
  const query = search
    .trim()
    .toLowerCase();

  const roleScopedDomains =
    Array.isArray(allowedDomainKeys) &&
    allowedDomainKeys.length > 0
      ? domains.filter((domain) =>
          allowedDomainKeys.includes(
            domain.key
          )
        )
      : domains;

  return roleScopedDomains
    .filter((domain) =>
      canAccessNode(
        domain,
        roleKey,
        permissions
      ) &&
      isModuleLicensed(
        moduleCodeForClinicalPath(
          domain.href
        ),
        licensedModules
      )
    )
    .map((domain) => {
      const domainMatches =
        query &&
        textMatches(
          domain.label,
          query
        );
      const groups = domain.groups
        .map((group) => {
          const accessibleItems =
            group.items.filter((item) =>
              canAccessNode(
                item,
                roleKey,
                permissions
              ) &&
              isModuleLicensed(
                moduleCodeForClinicalPath(
                  item.href
                ),
                licensedModules
              )
            );
          const groupMatches =
            query &&
            textMatches(
              group.label,
              query
            );

          if (
            !query ||
            domainMatches ||
            groupMatches
          ) {
            return {
              ...group,
              items: accessibleItems,
            };
          }

          return {
            ...group,
            items:
              accessibleItems.filter(
                (item) =>
                  textMatches(
                    item.label,
                    query
                  ) ||
                  textMatches(
                    item.href,
                    query
                  )
              ),
          };
        })
        .filter(
          (group): group is ClinicalSidebarGroup =>
            group.items.length > 0
        );

      if (groups.length === 0) {
        return null;
      }

      return {
        ...domain,
        groups,
      };
    })
    .filter(
      (
        domain
      ): domain is ClinicalSidebarDomain =>
        Boolean(domain)
    );
}

function isRouteActive(
  pathname: string,
  href: string
) {
  const cleanHref = href.split("#")[0].split("?")[0];

  if (cleanHref === "/clinical-services") {
    return pathname === cleanHref;
  }

  return (
    pathname === cleanHref ||
    pathname.startsWith(`${cleanHref}/`)
  );
}

function isRouteExactActive(
  pathname: string,
  href: string
) {
  const cleanHref = href.split("#")[0].split("?")[0];

  return pathname === cleanHref;
}

function isDomainActive(
  pathname: string,
  domain: ClinicalSidebarDomain
) {
  return (
    isRouteActive(pathname, domain.href) ||
    domain.groups.some((group) =>
      group.items.some((item) =>
        isRouteActive(pathname, item.href)
      )
    )
  );
}

function getActiveDomainKey(
  pathname: string
) {
  return (
    clinicalEnterpriseSidebar.find(
      (domain) =>
        isDomainActive(pathname, domain)
  )?.key || "dashboard"
  );
}

function buildWorkflowFirstSidebar(
  roleFamily: ReturnType<
    typeof getClinicalRoleFamily
  >
): ClinicalSidebarDomain[] {
  const root = "/clinical-services";
  const route = (slug: string) =>
    `${root}/${slug}`;
  const hms = (module: string) =>
    `${root}/hms/${module}`;
  const ivf = (module: string) =>
    `${root}/ivf/${module}`;
  const finance = (module: string) =>
    `${root}/finance/${module}`;

  const patientAccess: ClinicalSidebarDomain =
    {
      key: "patient-access",
      label: "Patient Access",
      iconKey: "patients",
      href: route("patients"),
      groups: [
        {
          label: "Patient Workflows",
          items: [
            {
              label: "Patients",
              href: route("patients"),
              iconKey: "patients",
            },
            {
              label: "Appointments",
              href: route("appointments"),
              iconKey: "appointments",
            },
            {
              label: "Patient 360",
              href: route("patients"),
              iconKey: "patient_360",
            },
          ],
        },
      ],
    };

  const roleWorkspaces: Record<
    string,
    ClinicalSidebarDomain[]
  > = {
    reception: [
      patientAccess,
      {
        key: "reception-workbench",
        label: "Reception Workbench",
        iconKey: "front_desk",
        href: route("appointments"),
        groups: [
          {
            label: "Front Desk",
            items: [
              {
                label: "Waiting Patients",
                href: route("appointments"),
                iconKey: "queue",
              },
              {
                label: "Book Appointment",
                href: route("appointments"),
                iconKey: "appointments",
              },
              {
                label: "Collect Payment",
                href: hms("billing"),
                iconKey: "billing",
              },
              {
                label: "Receipts",
                href: finance("cash"),
                iconKey: "payments",
              },
            ],
          },
        ],
      },
    ],
    doctor: [
      patientAccess,
      {
        key: "doctor-workbench",
        label: "Doctor Workbench",
        iconKey: "doctors",
        href: route("doctors/queue"),
        groups: [
          {
            label: "Consultation Flow",
            items: [
              {
                label: "Today's Queue",
                href: route("doctors/queue"),
                iconKey: "queue",
              },
              {
                label: "Consultation",
                href: route("doctors/queue"),
                iconKey: "opd",
              },
              {
                label: "Lab Results",
                href: route("doctors/lab-orders"),
                iconKey: "laboratory",
              },
              {
                label: "Prescriptions",
                href: route("doctors/prescriptions"),
                iconKey: "prescriptions",
              },
            ],
          },
        ],
      },
    ],
    lab: [
      patientAccess,
      {
        key: "lab-workbench",
        label: "Lab Workbench",
        iconKey: "laboratory",
        href: route("laboratory"),
        groups: [
          {
            label: "Lab Tasks",
            items: [
              {
                label: "Pending Samples",
                href: route("laboratory"),
                iconKey: "samples",
              },
              {
                label: "Result Entry",
                href: route("laboratory"),
                iconKey: "results",
              },
              {
                label: "Reports",
                href: route("laboratory"),
                iconKey: "clinical_reports",
              },
            ],
          },
        ],
      },
    ],
    pharmacy: [
      patientAccess,
      {
        key: "pharmacy-workbench",
        label: "Pharmacy Workbench",
        iconKey: "pharmacy",
        href: route("pharmacy"),
        groups: [
          {
            label: "Dispensing Tasks",
            items: [
              {
                label: "Pending Prescriptions",
                href: route("pharmacy"),
                iconKey: "prescriptions",
              },
              {
                label: "Sales",
                href: route("pharmacy"),
                iconKey: "sales",
              },
              {
                label: "Inventory",
                href: route("pharmacy/inventory"),
                iconKey: "inventory",
              },
            ],
          },
        ],
      },
    ],
    nurse: [
      patientAccess,
      {
        key: "nurse-workbench",
        label: "Nursing Workbench",
        iconKey: "nursing",
        href: route("operations"),
        groups: [
          {
            label: "Nursing Tasks",
            items: [
              {
                label: "Vitals",
                href: route("operations"),
                iconKey: "monitoring",
              },
              {
                label: "Admissions",
                href: route("ipd"),
                iconKey: "admissions",
              },
              {
                label: "Patient Queue",
                href: route("appointments"),
                iconKey: "queue",
              },
            ],
          },
        ],
      },
    ],
    ot: [
      patientAccess,
      {
        key: "ot-workbench",
        label: "OT Workbench",
        iconKey: "ot",
        href: route("ot"),
        groups: [
          {
            label: "OT Tasks",
            items: [
              {
                label: "OT Schedule",
                href: route("ot"),
                iconKey: "calendar",
              },
              {
                label: "Procedures",
                href: route("ot"),
                iconKey: "procedures",
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
    ],
    icu: [
      patientAccess,
      {
        key: "icu-workbench",
        label: "ICU Workbench",
        iconKey: "icu",
        href: route("icu"),
        groups: [
          {
            label: "Critical Care",
            items: [
              {
                label: "Monitoring",
                href: route("icu"),
                iconKey: "monitoring",
              },
              {
                label: "Alerts",
                href: route("critical-alerts"),
                iconKey: "alerts",
              },
              {
                label: "Admissions",
                href: route("ipd"),
                iconKey: "admissions",
              },
            ],
          },
        ],
      },
    ],
    ivf: [
      patientAccess,
      {
        key: "ivf-workbench",
        label: "IVF Workbench",
        iconKey: "ivf",
        href: ivf("dashboard"),
        groups: [
          {
            label: "Fertility Tasks",
            items: [
              {
                label: "Cycles",
                href: ivf("cycles"),
                iconKey: "ivf_cycles",
              },
              {
                label: "Embryology",
                href: ivf("embryology"),
                iconKey: "ivf_embryology",
              },
              {
                label: "Transfer",
                href: ivf("transfers"),
                iconKey: "ivf_transfer",
              },
              {
                label: "Pregnancy",
                href: ivf("pregnancies"),
                iconKey: "ivf_pregnancy",
              },
            ],
          },
        ],
      },
    ],
    finance: [
      patientAccess,
      {
        key: "finance-workbench",
        label: "Finance Workbench",
        iconKey: "finance_core",
        href: finance("cash"),
        groups: [
          {
            label: "Cash Desk",
            items: [
              {
                label: "Invoices",
                href: finance("invoices"),
                iconKey: "finance_gl",
              },
              {
                label: "Payments",
                href: finance("payments"),
                iconKey: "payments",
              },
              {
                label: "Receipts",
                href: finance("cash"),
                iconKey: "finance_cash",
              },
              {
                label: "Expenses",
                href: finance("expenses"),
                iconKey: "finance_ap",
              },
            ],
          },
        ],
      },
    ],
    other: [patientAccess],
  };

  return roleWorkspaces[roleFamily] || roleWorkspaces.other;
}

export default function ClinicalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { language, t } = useLanguage();
  const [open, setOpen] =
    useState(false);
  const [payload, setPayload] =
    useState<ClinicalContextPayload | null>(
      null
    );
  const [openDomains, setOpenDomains] =
    useState<string[]>(() =>
      Array.from(
        new Set([
          "dashboard",
          getActiveDomainKey(pathname),
        ])
      )
    );
  const [
    navigationSearch,
    setNavigationSearch,
  ] = useState("");
  const [clinicalUser, setClinicalUser] =
    useState<ClinicalUserProfile | null>(
      null
    );

  useEffect(() => {
    setClinicalUser(readStoredClinicalUser());
  }, []);

  const clinicName =
    payload?.context?.branchName ||
    payload?.context?.clinicName ||
    "Clinical Services";
  const hospitalList = payload?.hospitals || [];
  const activeHospitalId = payload?.context?.hospitalId;
  const selectedHospital =
    hospitalList.find(
      (h) =>
        Number(h.id) ===
        Number(activeHospitalId)
    ) || null;
  const effectiveHospital =
    selectedHospital ||
    hospitalList[0] ||
    null;
  const hospitalName = effectiveHospital
    ? effectiveHospital.hospital_name ||
      effectiveHospital.hospital_code ||
      String(
        payload?.context?.hospitalName ||
          payload?.context?.organizationName ||
          "Hospital"
      )
    : payload?.context?.hospitalName ||
      payload?.context?.organizationName ||
      "Hospital Network";
  const hospitalDisplayName =
    selectedHospital?.hospital_name ||
    selectedHospital?.hospital_code ||
    hospitalName ||
    clinicName;
  const poweredByLabel =
    t(
      "poweredByClinical",
      "Powered by TOTTECH Clinical Services"
    );
  const brandLogo =
    payload?.context?.branding?.logoUrl ||
    null;
  const brandInitial =
    hospitalDisplayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "H";
  const roleName =
    clinicalUser?.full_name ||
    clinicalUser?.username ||
    clinicalUser?.email ||
    payload?.context?.roleName ||
    "Clinical User";
  const roleKey =
    clinicalUser?.role ||
    payload?.context?.roleKey ||
    roleName;
  const roleFamily =
    getClinicalRoleFamily(roleKey);
  const userImage = resolveUserImage(
    clinicalUser
  );
  const userInitial =
    String(
      clinicalUser?.full_name ||
        roleName ||
        "U"
    )
      .trim()
      .charAt(0)
      .toUpperCase() || "U";
  const permissions =
    payload?.context?.permissions ||
    {};
  const licensedModules =
    payload?.context?.licensedModules ||
    [];
  const workflowSidebar =
    buildWorkflowFirstSidebar(
      roleFamily
    );
  const allowedDomainKeys =
    roleFamily === "super_admin" ||
    roleFamily === "admin"
      ? workflowSidebarDomainKeys(
          roleKey
        )
      : null;
  const visibleSidebar =
    roleFamily === "super_admin" ||
    roleFamily === "admin"
      ? filterSidebarByAccessAndSearch({
          domains:
            clinicalEnterpriseSidebar,
          roleKey,
          permissions,
          search: navigationSearch,
          licensedModules,
          allowedDomainKeys,
        })
      : filterSidebarByAccessAndSearch({
          domains: workflowSidebar,
          roleKey,
          permissions,
          search: navigationSearch,
          licensedModules,
          allowedDomainKeys: null,
        });
  const activeModuleCode =
    moduleCodeForClinicalPath(pathname);
  const activeModuleLicensed =
    isModuleLicensed(
      activeModuleCode,
      licensedModules
    );
  const showClinicalAnalytics =
    shouldShowClinicalAnalytics(
      roleKey
    );

  const loadContext = async () => {
    const response = await fetch(
      "/api/clinical/context"
    );

    if (response.ok) {
      setPayload(
        await response.json()
      );
    }
  };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadContext();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, []);

  // If the context loads but the active hospital id is not present
  // in the returned hospitals list, set the first hospital as active.
  useEffect(() => {
    if (!payload) return;

    try {
      const hospitalList = payload.hospitals || [];
      const activeHospitalId = payload.context?.hospitalId;
      console.log('HOSPITAL_SWITCHER_DEBUG - hospitalList', hospitalList);
      console.log('HOSPITAL_SWITCHER_DEBUG - activeHospitalId', activeHospitalId);
      const selectedHospital = hospitalList.find((h) => Number(h.id) === Number(activeHospitalId));
      console.log('HOSPITAL_SWITCHER_DEBUG - selectedHospital', selectedHospital || null);

      if (hospitalList.length && !selectedHospital) {
        const firstId = hospitalList[0].id;
        (async () => {
          try {
            console.log('HOSPITAL_SWITCHER_DEBUG - setting default active hospital', firstId);
            const res = await fetch('/api/clinical/context', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hospital_id: firstId }),
            });
            if (res.ok) {
              window.location.reload();
            } else {
              console.error('HOSPITAL_SWITCHER_DEBUG - failed to set default hospital', res.status);
            }
          } catch (e) {
            console.error('HOSPITAL_SWITCHER_DEBUG - error setting default hospital', e);
          }
        })();
      }
    } catch (e) {
      console.error('HOSPITAL_SWITCHER_DEBUG - error', e);
    }
  }, [payload]);

  useEffect(() => {
    document.body.classList.toggle(
      "tt-lock-scroll",
      open
    );

    return () => {
      document.body.classList.remove(
        "tt-lock-scroll"
      );
    };
  }, [open]);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "clinicalSidebarOpenDomains"
      );

    if (!saved) {
      return;
    }

    try {
      const parsed =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        window.setTimeout(() => {
          setOpenDomains((current) =>
            Array.from(
              new Set([
                ...current,
                ...parsed.filter(
                  (item) =>
                    typeof item ===
                    "string"
                ),
              ])
            )
          );
        }, 0);
      }
    } catch {
      localStorage.removeItem(
        "clinicalSidebarOpenDomains"
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "clinicalSidebarOpenDomains",
      JSON.stringify(openDomains)
    );
  }, [openDomains]);

  useEffect(() => {
    const activeSidebar =
      roleFamily === "super_admin" ||
      roleFamily === "admin"
        ? clinicalEnterpriseSidebar
        : buildWorkflowFirstSidebar(
            roleFamily
          );
    const activeDomain =
      activeSidebar.find((domain) =>
        isDomainActive(pathname, domain)
      )?.key || "dashboard";

    setOpenDomains((current) =>
      current.includes(activeDomain)
        ? current
        : [...current, activeDomain]
    );
  }, [pathname, roleFamily]);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    localStorage.removeItem("erpUser");
    router.push("/login");
  };

  const nav = (
    <aside className="flex h-full w-[min(92vw,320px)] flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-950 shadow-xl md:w-[280px] lg:w-[320px]">
      <div className="min-w-0 border-b border-slate-200 p-4 lg:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow">
            {brandLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogo}
                alt={`${hospitalDisplayName} logo`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-xl font-black text-[#D4AF37]">
                {brandInitial}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p
              className="whitespace-normal text-base font-black leading-5 lg:text-lg"
              title={hospitalDisplayName}
            >
              {hospitalDisplayName}
            </p>
            <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.12em] text-teal-700">
              {poweredByLabel}
            </p>
          </div>
        </div>
        <div className="mt-5 min-w-0 rounded-[8px] border border-teal-100 bg-teal-50 p-4">
          <p
            className="truncate text-xs font-black uppercase text-teal-800"
            title={hospitalDisplayName}
          >
            {hospitalDisplayName}
          </p>
          <p
            className="mt-1 truncate text-sm font-black text-slate-950"
            title={clinicName}
          >
            {clinicName}
          </p>
          <p
            className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.12em] text-teal-700"
            title={poweredByLabel}
          >
            {poweredByLabel}
          </p>
        </div>
      </div>

      <EnterpriseSidebarNav
        domains={visibleSidebar}
        pathname={pathname}
        language={language}
        search={navigationSearch}
        setSearch={
          setNavigationSearch
        }
        openDomains={openDomains}
        setOpenDomains={setOpenDomains}
        closeDrawer={() =>
          setOpen(false)
        }
      />

      <div className="border-t border-slate-200 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-950 shadow-sm"
        >
          <LogOut size={17} />
          {translateLabel(language, "Logout")}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="tt-clinical-shell flex flex-col bg-[#f5f8fb] text-slate-950">
      <header className="tt-clinical-header z-30 grid min-w-0 shrink-0 grid-cols-1 gap-3 border-b border-slate-200 bg-white px-3 py-3 shadow-sm md:px-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,420px)_auto] lg:items-center lg:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() =>
              setOpen(true)
            }
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] border border-slate-300 bg-white text-slate-950 shadow-sm md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="hidden h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm md:grid">
            {brandLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogo}
                alt={`${hospitalDisplayName} logo`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-sm font-black text-[#D4AF37]">
                {brandInitial}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p
              className="truncate text-sm font-black leading-5 md:text-base"
              title={hospitalDisplayName}
            >
              {hospitalDisplayName}
            </p>
            <p
              className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-teal-700"
              title={poweredByLabel}
            >
              {poweredByLabel}
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 lg:block">
          <ClinicalGlobalSearch />
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 lg:justify-self-end">
          <div className="hidden min-w-[150px] md:block">
            <LanguageSwitcher compact />
          </div>
          <div className="hidden min-w-[220px] max-w-xs md:block">
            <div className="rounded-[8px] border border-teal-100 bg-teal-50 px-3 py-2">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-teal-800">
                {translateLabel(
                  language,
                  "Hospital Context"
                )}
              </p>
              {payload?.hospitals && payload.hospitals.length > 1 ? (
                <select
                  className="mt-2 w-full rounded-[8px] border border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-950"
                  value={payload.context?.hospitalId ?? ""}
                  onChange={async (event) => {
                    const hospitalId = Number(event.target.value);
                    if (!hospitalId) {
                      return;
                    }

                    const response = await fetch(
                      "/api/clinical/context",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          hospital_id: hospitalId,
                        }),
                      }
                    );

                    if (response.ok) {
                      const url = new URL(window.location.href);
                      url.searchParams.set('hospital_id', String(hospitalId));
                      window.location.href = url.toString();
                    }
                  }}
                >
                  {payload.hospitals.map((hospital) => (
                    <option
                      key={hospital.id}
                      value={hospital.id}
                    >
                      {hospital.hospital_name || hospital.hospital_code || `Hospital ${hospital.id}`}
                    </option>
                  ))}
                </select>
              ) : (
                <p
                  className="mt-2 truncate text-xs font-black text-slate-950"
                  title={hospitalName}
                >
                  {hospitalName}
                </p>
              )}
            </div>
          </div>
          <div className="hidden min-w-0 rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] px-3 py-2 sm:block">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-[#8a6500]">
              {translateLabel(language, "Active User")}
            </p>
            <div className="mt-2 flex min-w-0 items-center justify-end gap-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border border-[#D4AF37]/40 bg-white text-[11px] font-black text-[#8a6500]">
                {userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userImage}
                    alt={
                      clinicalUser?.full_name ||
                      clinicalUser?.username ||
                      clinicalUser?.email ||
                      roleName
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>
              <div className="min-w-0 text-right">
                <p
                  className="truncate text-xs font-black text-slate-950"
                  title={
                    clinicalUser?.full_name ||
                    clinicalUser?.username ||
                    clinicalUser?.email ||
                    roleName
                  }
                >
                  {clinicalUser?.full_name ||
                    clinicalUser?.username ||
                    clinicalUser?.email ||
                    roleName}
                </p>
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a6500]">
                  {translateLabel(
                    language,
                    poweredByLabel
                  )}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] border border-slate-300 bg-white text-slate-950 shadow-sm md:hidden"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
          <button
            onClick={logout}
            className="hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-[8px] border border-slate-300 bg-white px-4 text-sm font-black text-slate-950 shadow-sm md:inline-flex"
          >
            <LogOut size={17} />
            {translateLabel(language, "Logout")}
          </button>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white px-3 py-3 lg:hidden">
        <ClinicalGlobalSearch />
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="relative h-full w-[min(92vw,320px)]">
            {nav}
            <button
              onClick={() =>
                setOpen(false)
              }
              className="absolute right-[-52px] top-4 rounded-[8px] bg-white p-3 text-slate-950 shadow"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden min-h-0 shrink-0 overflow-hidden md:block">
          {nav}
        </div>
	        <main
	          className="tt-clinical-content min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-24 md:pb-0"
	          data-clinical-scroll-container="true"
	        >
	          {activeModuleLicensed ? (
	            children
	          ) : (
	            <ModuleNotLicensed
	              moduleCode={
	                activeModuleCode
	              }
	            />
	          )}
	        </main>
      </div>
      <ClinicalBottomNav
        pathname={pathname}
        language={language}
        roleFamily={roleFamily}
        licensedModules={
          licensedModules
        }
        showClinicalAnalytics={
          showClinicalAnalytics
        }
      />
    </div>
  );
}

function EnterpriseSidebarNav({
  domains,
  pathname,
  language,
  search,
  setSearch,
  openDomains,
  setOpenDomains,
  closeDrawer,
}: {
  domains: ClinicalSidebarDomain[];
  pathname: string;
  language: ReturnType<typeof useLanguage>["language"];
  search: string;
  setSearch: Dispatch<
    SetStateAction<string>
  >;
  openDomains: string[];
  setOpenDomains: Dispatch<
    SetStateAction<string[]>
  >;
  closeDrawer: () => void;
}) {
  const activeRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const toggleDomain = (
    key: string
  ) => {
    setOpenDomains((current) =>
      current.includes(key)
        ? current.filter(
            (item) => item !== key
          )
        : [...current, key]
    );
  };

  useEffect(() => {
    const scrollActiveIntoView = () => {
      const container = navRef.current;
      const activeElement =
        container?.querySelector<HTMLElement>(
          '[data-clinical-active-menu="true"]'
        ) ||
        (activeRef.current &&
        container?.contains(activeRef.current)
          ? activeRef.current
          : null);

      if (!container || !activeElement) {
        return;
      }

      const containerRect =
        container.getBoundingClientRect();
      const activeRect =
        activeElement.getBoundingClientRect();
      const centeredTop =
        container.scrollTop +
        activeRect.top -
        containerRect.top -
        container.clientHeight / 2 +
        activeRect.height / 2;

      container.scrollTo({
        top: Math.max(0, centeredTop),
        behavior: "smooth",
      });
    };

    const animationFrame =
      window.requestAnimationFrame(
        scrollActiveIntoView
      );
    const timers = [
      window.setTimeout(
        scrollActiveIntoView,
        80
      ),
      window.setTimeout(
        scrollActiveIntoView,
        260
      ),
      window.setTimeout(
        scrollActiveIntoView,
        520
      ),
    ];

    return () => {
      window.cancelAnimationFrame(
        animationFrame
      );
      timers.forEach((timer) =>
        window.clearTimeout(timer)
      );
    };
  }, [pathname, search, openDomains.join("|")]);

  return (
    <nav
      ref={navRef}
      className="tt-clinical-sidebar-scroll flex-1 overflow-y-auto p-4 scroll-smooth"
    >
      <div className="mb-3 px-1">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-700">
          {translateLabel(
            language,
            "Workflow Navigation"
          )}
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
          {translateLabel(
            language,
            "Organized by role so hospital staff see only the work they need."
          )}
        </p>
      </div>

      <label className="mb-4 flex min-h-11 items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3 text-slate-700 focus-within:border-[#D4AF37] focus-within:bg-white">
        <Search
          size={16}
          className="shrink-0 text-[#8a6500]"
        />
        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder={translateLabel(
            language,
            "Search navigation..."
          )}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm font-bold outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="space-y-2">
        {domains.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-600">
            {translateLabel(
              language,
              "No navigation items match your search or current role."
            )}
          </div>
        ) : null}

        {domains.map(
          (domain) => {
            const Icon =
              iconMap[domain.iconKey] ||
              Activity;
            const active =
              isDomainActive(
                pathname,
                domain
              );
            const open =
              active ||
              openDomains.includes(
                domain.key
              );
            const itemCount =
              domain.groups.reduce(
                (total, group) =>
                  total +
                  group.items.length,
                0
              );

            return (
              <div
                key={domain.key}
                className={`rounded-[8px] border transition ${
                  active
                    ? "border-[#D4AF37]/60 bg-[#fff9e8]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <button
                  ref={(node) => {
                    if (active) {
                      activeRef.current = node;
                    }
                  }}
                  data-clinical-active-parent={
                    active ? "true" : undefined
                  }
                  type="button"
                  onClick={() =>
                    toggleDomain(
                      domain.key
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-[8px] px-3 py-3 text-left"
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ${
                      active
                        ? "bg-[#0B1F3A] text-[#D4AF37]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm font-black ${
                        active
                          ? "text-slate-950"
                          : "text-slate-800"
                      }`}
                    >
                      {translateLabel(
                        language,
                        domain.label
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] font-bold text-slate-500">
                      {itemCount} {translateLabel(language, "workflows", "workflows")}
                    </span>
                  </span>
                  {open ? (
                    <ChevronDown
                      size={17}
                      className="shrink-0 text-slate-500"
                    />
                  ) : (
                    <ChevronRight
                      size={17}
                      className="shrink-0 text-slate-500"
                    />
                  )}
                </button>

                {open ? (
                  <div className="space-y-3 border-t border-slate-200 px-3 pb-3 pt-2">
                    <Link
                      ref={(node) => {
                        if (
                          isRouteExactActive(
                            pathname,
                            domain.href
                          )
                        ) {
                          activeRef.current = node;
                        }
                      }}
                      data-clinical-active-menu={
                        isRouteExactActive(
                          pathname,
                          domain.href
                        )
                          ? "true"
                          : undefined
                      }
                      href={domain.href}
                      prefetch={false}
                      onClick={closeDrawer}
                      className={`flex min-h-10 items-center rounded-[8px] px-3 py-2 text-xs font-black transition ${
                        isRouteExactActive(
                          pathname,
                          domain.href
                        )
                          ? "bg-[#0B1F3A] text-white"
                          : "bg-slate-50 text-slate-700 hover:bg-teal-50"
                      }`}
                    >
                      {translateLabel(
                        language,
                        domain.label
                      )}{" "}
                      {translateLabel(
                        language,
                        "Workspace"
                      )}
                      <Icon
                        size={14}
                        className="ml-2 shrink-0"
                      />
                    </Link>

                    {domain.groups.map(
                      (group) => (
                        <div
                          key={`${domain.key}-${group.label}`}
                          className="space-y-1"
                        >
                          <p className="px-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#8a6500]">
                            {translateLabel(
                              language,
                              group.label
                            )}
                          </p>
                          {group.items.map(
                            (item) => {
                              const activeItem =
                                isRouteActive(
                                  pathname,
                                  item.href
                                );
                              const ItemIcon =
                                iconMap[
                                  item.iconKey
                                ] ||
                                FileText;

                              return (
                                <Link
                                  ref={(node) => {
                                    if (activeItem) {
                                      activeRef.current = node;
                                    }
                                  }}
                                  data-clinical-active-menu={
                                    activeItem
                                      ? "true"
                                      : undefined
                                  }
                                  key={`${domain.key}-${group.label}-${item.label}`}
                                  href={
                                    item.href
                                  }
                                  prefetch={false}
                                  onClick={
                                    closeDrawer
                                  }
                                  className={`flex min-h-9 items-center rounded-[8px] px-3 py-2 text-xs font-bold leading-5 transition ${
                                    activeItem
                                      ? "bg-slate-950 text-white"
                                      : "text-slate-600 hover:bg-teal-50 hover:text-slate-950"
                                  }`}
                                >
                                  <span
                                    className={`mr-2 grid h-7 w-7 shrink-0 place-items-center rounded-[7px] ${
                                      activeItem
                                        ? "bg-white/10 text-[#D4AF37]"
                                        : "bg-slate-100 text-[#8a6500]"
                                    }`}
                                  >
                                    <ItemIcon
                                      size={
                                        14
                                      }
                                    />
                                  </span>
                                  <span className="min-w-0 break-words">
                                    {translateLabel(
                                      language,
                                      item.label
                                    )}
                                  </span>
                                </Link>
                              );
                            }
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : null}
              </div>
            );
          }
        )}
      </div>
    </nav>
  );
}

function ModuleNotLicensed({
  moduleCode,
}: {
  moduleCode: string | null;
}) {
  const label =
    moduleCode &&
    Object.prototype.hasOwnProperty.call(
      CLINICAL_MODULE_LABELS,
      moduleCode
    )
      ? CLINICAL_MODULE_LABELS[
          moduleCode as keyof typeof CLINICAL_MODULE_LABELS
        ]
      : "This module";

  return (
    <div className="grid min-h-full place-items-center p-6">
      <section className="w-full max-w-2xl rounded-[8px] border border-[#D4AF37]/40 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
          <ShieldCheck size={28} />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[#8a6500]">
          Module Not Licensed
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          {label} is not enabled for this hospital.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
          Contact the TOTTECH Super Admin to update the hospital subscription or enable this module from Administration → Hospital Licensing.
        </p>
      </section>
    </div>
  );
}

function ClinicalBottomNav({
  pathname,
  language,
  licensedModules,
  showClinicalAnalytics,
  roleFamily,
}: {
  pathname: string;
  language: ReturnType<typeof useLanguage>["language"];
  licensedModules?: string[];
  showClinicalAnalytics?: boolean;
  roleFamily?: ReturnType<
    typeof getClinicalRoleFamily
  >;
}) {
  const itemsByRole: Record<
    string,
    {
      label: string;
      href: string;
      icon: LucideIcon;
      badge?: boolean;
    }[]
  > = {
    reception: [
      {
        label: "Patients",
        href: "/clinical-services/patients",
        icon: UserRound,
      },
      {
        label: "Appointments",
        href: "/clinical-services/appointments",
        icon: CalendarDays,
      },
      {
        label: "Billing",
        href: "/clinical-services/hms/billing",
        icon: BarChart3,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    doctor: [
      {
        label: "Queue",
        href: "/clinical-services/doctors/queue",
        icon: ClipboardList,
      },
      {
        label: "Consult",
        href: "/clinical-services/doctors/queue",
        icon: Stethoscope,
      },
      {
        label: "Lab",
        href: "/clinical-services/doctors/lab-orders",
        icon: FlaskConical,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    lab: [
      {
        label: "Samples",
        href: "/clinical-services/laboratory",
        icon: FlaskConical,
      },
      {
        label: "Results",
        href: "/clinical-services/laboratory",
        icon: FileText,
      },
      {
        label: "Reports",
        href: "/clinical-services/laboratory",
        icon: BarChart3,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    pharmacy: [
      {
        label: "Prescriptions",
        href: "/clinical-services/pharmacy",
        icon: Pill,
      },
      {
        label: "Sales",
        href: "/clinical-services/pharmacy",
        icon: ShoppingCart,
      },
      {
        label: "Inventory",
        href: "/clinical-services/pharmacy/inventory",
        icon: Boxes,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    nurse: [
      {
        label: "Vitals",
        href: "/clinical-services/operations",
        icon: HeartPulse,
      },
      {
        label: "Queue",
        href: "/clinical-services/appointments",
        icon: ClipboardList,
      },
      {
        label: "Admissions",
        href: "/clinical-services/ipd",
        icon: Building2,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    ot: [
      {
        label: "OT",
        href: "/clinical-services/ot",
        icon: Workflow,
      },
      {
        label: "Schedule",
        href: "/clinical-services/ot-calendar",
        icon: CalendarDays,
      },
      {
        label: "Recovery",
        href: "/clinical-services/ot-recovery",
        icon: HeartPulse,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    icu: [
      {
        label: "Monitoring",
        href: "/clinical-services/icu",
        icon: HeartPulse,
      },
      {
        label: "Alerts",
        href: "/clinical-services/critical-alerts",
        icon: Bell,
      },
      {
        label: "Admissions",
        href: "/clinical-services/ipd",
        icon: Building2,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    ivf: [
      {
        label: "Cycles",
        href: "/clinical-services/ivf/cycles",
        icon: HeartPulse,
      },
      {
        label: "Embryology",
        href: "/clinical-services/ivf/embryology",
        icon: FlaskConical,
      },
      {
        label: "Transfer",
        href: "/clinical-services/ivf/transfers",
        icon: Workflow,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    finance: [
      {
        label: "Invoices",
        href: "/clinical-services/finance/invoices",
        icon: FileText,
      },
      {
        label: "Payments",
        href: "/clinical-services/finance/payments",
        icon: BarChart3,
      },
      {
        label: "Expenses",
        href: "/clinical-services/finance/expenses",
        icon: Receipt,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
    ],
    admin: [
      {
        label: "Dashboard",
        href: "/clinical-services",
        icon: Activity,
      },
      {
        label: "Patients",
        href: "/clinical-services/patients",
        icon: UserRound,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
      ...(showClinicalAnalytics
        ? [
            {
              label: "Reports",
              href: "/clinical-services/analytics",
              icon: BarChart3,
            },
          ]
        : []),
    ],
    super_admin: [
      {
        label: "Dashboard",
        href: "/clinical-services",
        icon: Activity,
      },
      {
        label: "Patients",
        href: "/clinical-services/patients",
        icon: UserRound,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
      {
        label: "Reports",
        href: "/clinical-services/analytics",
        icon: BarChart3,
      },
    ],
  };

  const items =
    (roleFamily &&
      itemsByRole[roleFamily]) ||
    [
      {
        label: "Dashboard",
        href: "/clinical-services",
        icon: Activity,
      },
      {
        label: "Search",
        href: "/clinical-services/patients",
        icon: Search,
      },
      {
        label: "Alerts",
        href: "/clinical-services/appointments",
        icon: Bell,
        badge: true,
      },
      {
        label: "Profile",
        href: "/clinical-services/security",
        icon: UserRound,
      },
    ];

  const visibleItems = items.filter((item) =>
    isModuleLicensed(
      moduleCodeForClinicalPath(item.href),
      licensedModules
    )
  );

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 rounded-[8px] border border-slate-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-xl md:hidden">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${Math.max(
            visibleItems.length,
            1
          )}, minmax(0, 1fr))`,
        }}
      >
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !==
              "/clinical-services" &&
              pathname.startsWith(
                `${item.href}/`
              ));

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-1.5"
            >
              <span
                className={`relative grid h-11 w-11 place-items-center rounded-[8px] transition ${
                  active
                    ? "bg-slate-950 text-white shadow-lg"
                    : "text-slate-500"
                }`}
              >
                <Icon size={20} />
                {item.badge ? (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white" />
                ) : null}
              </span>
              <span
                className={`w-full truncate text-center text-[10px] font-black ${
                  active
                    ? "text-teal-700"
                    : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
