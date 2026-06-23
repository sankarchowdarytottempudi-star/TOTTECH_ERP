export type ClinicalRoleFamily =
  | "super_admin"
  | "admin"
  | "reception"
  | "doctor"
  | "lab"
  | "pharmacy"
  | "nurse"
  | "ot"
  | "icu"
  | "ivf"
  | "finance"
  | "other";

export function normalizeRoleName(
  role?: string | null
) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function getClinicalRoleFamily(
  role?: string | null
): ClinicalRoleFamily {
  const normalized =
    normalizeRoleName(role);

  if (
    [
      "super_admin",
      "tottech_super_admin",
      "clinical_super_admin",
    ].includes(normalized)
  ) {
    return "super_admin";
  }

  if (
    [
      "tenant_admin",
      "organization_admin",
      "hospital_admin",
      "branch_admin",
      "clinic_admin",
      "admin",
    ].includes(normalized)
  ) {
    return "admin";
  }

  if (
    [
      "reception",
      "receptionist",
      "front_desk",
      "frontdesk",
    ].includes(normalized)
  ) {
    return "reception";
  }

  if (
    [
      "doctor",
      "physician",
      "consultant",
    ].includes(normalized)
  ) {
    return "doctor";
  }

  if (
    [
      "lab",
      "laboratory",
      "lab_technician",
      "lab_tech",
    ].includes(normalized)
  ) {
    return "lab";
  }

  if (
    [
      "pharmacy",
      "pharmacist",
      "dispensing",
    ].includes(normalized)
  ) {
    return "pharmacy";
  }

  if (
    [
      "nurse",
      "vitals",
      "staff_nurse",
    ].includes(normalized)
  ) {
    return "nurse";
  }

  if (
    [
      "ot",
      "ot_coordinator",
      "operation_theatre",
    ].includes(normalized)
  ) {
    return "ot";
  }

  if (
    [
      "icu",
      "icu_nurse",
      "critical_care",
    ].includes(normalized)
  ) {
    return "icu";
  }

  if (
    [
      "ivf",
      "ivf_specialist",
      "embryologist",
      "fertility",
    ].includes(normalized)
  ) {
    return "ivf";
  }

  if (
    [
      "finance",
      "finance_manager",
      "billing_executive",
      "finance_user",
    ].includes(normalized)
  ) {
    return "finance";
  }

  return "other";
}

export function isGovernanceRole(
  role?: string | null
) {
  return [
    "super_admin",
    "tottech_super_admin",
    "clinical_super_admin",
    "tenant_admin",
    "organization_admin",
    "hospital_admin",
    "branch_admin",
    "clinic_admin",
    "admin",
  ].includes(normalizeRoleName(role));
}

export function workflowSidebarDomainKeys(
  role?: string | null
) {
  const family =
    getClinicalRoleFamily(role);

  if (family === "super_admin") {
    return null;
  }

  if (family === "admin") {
    return [
      "dashboard",
      "patient-management",
      "doctors",
      "op",
      "ip",
      "er",
      "icu",
      "operation-theatre",
      "ivf",
      "laboratory",
      "radiology",
      "pharmacy",
      "inventory-procurement",
      "billing-revenue",
      "insurance-tpa",
      "referral-crm",
      "finance-accounts",
      "hrms",
      "patient-engagement",
      "administration",
    ];
  }

  if (family === "reception") {
    return [
      "dashboard",
      "patient-management",
      "doctors",
      "billing-revenue",
      "finance-accounts",
      "patient-engagement",
    ];
  }

  if (family === "doctor") {
    return [
      "dashboard",
      "patient-management",
      "doctors",
      "op",
      "ip",
      "er",
      "icu",
      "operation-theatre",
      "laboratory",
      "radiology",
      "pharmacy",
      "billing-revenue",
    ];
  }

  if (family === "lab") {
    return [
      "dashboard",
      "patient-management",
      "laboratory",
      "radiology",
      "billing-revenue",
    ];
  }

  if (family === "pharmacy") {
    return [
      "dashboard",
      "patient-management",
      "pharmacy",
      "inventory-procurement",
      "billing-revenue",
    ];
  }

  if (family === "nurse") {
    return [
      "dashboard",
      "patient-management",
      "doctors",
      "op",
      "ip",
      "icu",
      "operation-theatre",
      "billing-revenue",
    ];
  }

  if (family === "ot") {
    return [
      "dashboard",
      "patient-management",
      "operation-theatre",
      "ip",
      "billing-revenue",
    ];
  }

  if (family === "icu") {
    return [
      "dashboard",
      "patient-management",
      "icu",
      "ip",
      "doctors",
      "billing-revenue",
    ];
  }

  if (family === "ivf") {
    return [
      "dashboard",
      "patient-management",
      "ivf",
      "laboratory",
      "billing-revenue",
    ];
  }

  if (family === "finance") {
    return [
      "dashboard",
      "billing-revenue",
      "finance-accounts",
      "insurance-tpa",
      "referral-crm",
    ];
  }

  return [
    "dashboard",
    "patient-management",
    "billing-revenue",
  ];
}

export function shouldShowClinicalAnalytics(
  role?: string | null
) {
  return isGovernanceRole(role);
}

export function shouldShowClinicalQuickActions(
  role?: string | null
) {
  const family =
    getClinicalRoleFamily(role);

  return [
    "super_admin",
    "admin",
    "finance",
  ].includes(family);
}
