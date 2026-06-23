export const SCHOOL_PROJECT =
  "tottech_one";

export const CLINICAL_PROJECT =
  "tottech_clinical_services";

export const ERP_PROJECT_TYPE =
  "ERP";

export const CLINICAL_PROJECT_TYPE =
  "CLINICAL";

export const CLINICAL_DASHBOARD =
  "/clinical-services";

export const SCHOOL_DASHBOARD = "/";

export type PlatformType =
  | "EDUCATIONAL"
  | "CLINICAL";

export function isClinicalServicesEmail(
  email?: string | null
) {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();

  return (
    normalized ===
      "cs-superadmin@erp.com" ||
    normalized.startsWith("cs-")
  );
}

export function projectForPlatform(
  platformType?: string | null
) {
  return String(platformType || "")
    .trim()
    .toUpperCase() === "CLINICAL"
    ? CLINICAL_PROJECT
    : SCHOOL_PROJECT;
}

export function projectTypeForPlatform(
  platformType?: string | null
) {
  return String(platformType || "")
    .trim()
    .toUpperCase() === "CLINICAL"
    ? CLINICAL_PROJECT_TYPE
    : ERP_PROJECT_TYPE;
}

export function projectForEmail(
  email?: string | null
) {
  return isClinicalServicesEmail(email)
    ? CLINICAL_PROJECT
    : SCHOOL_PROJECT;
}

export function projectTypeForEmail(
  email?: string | null
) {
  return isClinicalServicesEmail(email)
    ? CLINICAL_PROJECT_TYPE
    : ERP_PROJECT_TYPE;
}

export function dashboardForProject(
  project?: string | null
) {
  return project === CLINICAL_PROJECT
    ? CLINICAL_DASHBOARD
    : SCHOOL_DASHBOARD;
}
