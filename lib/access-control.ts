export type ManagedAction =
  | "create"
  | "update"
  | "delete";

export type ManagedResource =
  | "school"
  | "class"
  | "section"
  | "subject"
  | "timetable"
  | "exam"
  | "exam_schedule"
  | "transport"
  | "transport_route"
  | "transport_vehicle"
  | "hostel"
  | "dining_menu"
  | "meal_plan";

export function normalizeRole(
  role?: string | null
) {
  return String(role || "")
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_");
}

export function isSuperAdmin(
  role?: string | null
) {
  return normalizeRole(role) === "SUPER_ADMIN";
}

export function isSchoolAdmin(
  role?: string | null
) {
  const normalized = normalizeRole(role);

  return (
    normalized === "ADMIN" ||
    normalized === "SCHOOL_ADMIN"
  );
}

export function canManageRecord(
  role: string | null | undefined,
  resource: ManagedResource,
  action: ManagedAction
) {
  const normalized = normalizeRole(role);

  if (normalized === "SUPER_ADMIN") {
    return true;
  }

  if (action === "delete") {
    if (
      resource === "school" ||
      resource === "class" ||
      resource === "section"
    ) {
      return false;
    }

    return isSchoolAdmin(normalized);
  }

  if (
    resource === "school" ||
    resource === "class"
  ) {
    return isSchoolAdmin(normalized);
  }

  if (resource === "section") {
    return [
      "ADMIN",
      "SCHOOL_ADMIN",
      "PRINCIPAL",
    ].includes(normalized);
  }

  if (
    resource === "subject" ||
    resource === "timetable" ||
    resource === "exam" ||
    resource === "exam_schedule"
  ) {
    return [
      "ADMIN",
      "SCHOOL_ADMIN",
      "PRINCIPAL",
      "TEACHER",
    ].includes(normalized);
  }

  if (
    resource === "transport" ||
    resource === "transport_route" ||
    resource === "transport_vehicle" ||
    resource === "hostel" ||
    resource === "dining_menu" ||
    resource === "meal_plan"
  ) {
    return isSchoolAdmin(normalized);
  }

  return false;
}

export function managementError(
  resource: ManagedResource,
  action: ManagedAction
) {
  return `Your role does not have access to ${action} ${resource.replaceAll(
    "_",
    " "
  )} records.`;
}
