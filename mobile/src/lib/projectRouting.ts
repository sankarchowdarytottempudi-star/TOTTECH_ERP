import type { RootStackParamList } from "../../App";

export const SCHOOL_PROJECT =
  "tottech_one";
export const CLINICAL_PROJECT =
  "tottech_clinical_services";
export const CLINICAL_PROJECT_TYPE =
  "CLINICAL";

export type MobileWorkspace =
  | "tottech-one"
  | "clinical-services";

export type MobileRoute =
  keyof RootStackParamList;

type LoginUser = {
  email?: string | null;
  username?: string | null;
  role?: string | null;
  project?: string | null;
  projectType?: string | null;
  redirectTo?: string | null;
};

type LoginRoutePayload = {
  project?: string | null;
  projectType?: string | null;
  redirectTo?: string | null;
  user?: LoginUser | null;
};

export function isClinicalIdentifier(
  identifier?: string | null
) {
  const normalized = String(
    identifier || ""
  )
    .trim()
    .toLowerCase();

  return (
    normalized ===
      "cs-superadmin@erp.com" ||
    normalized.startsWith("cs-")
  );
}

export function resolveMobileWorkspace(
  identifier?: string | null,
  payload?: LoginRoutePayload | null
): MobileWorkspace {
  const project =
    payload?.project ||
    payload?.user?.project;
  const projectType =
    payload?.projectType ||
    payload?.user?.projectType;
  const redirectTo =
    payload?.redirectTo ||
    payload?.user?.redirectTo;
  const userIdentifier =
    payload?.user?.email ||
    payload?.user?.username ||
    identifier;

  if (
    project === CLINICAL_PROJECT ||
    projectType === CLINICAL_PROJECT_TYPE ||
    redirectTo?.startsWith(
      "/clinical-services"
    ) ||
    isClinicalIdentifier(userIdentifier)
  ) {
    return "clinical-services";
  }

  return "tottech-one";
}

export function routeForWorkspace(
  workspace: MobileWorkspace
): MobileRoute {
  return workspace ===
    "clinical-services"
    ? "ClinicalWorkspace"
    : "SchoolWorkspace";
}
