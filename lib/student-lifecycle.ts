export const STUDENT_STATUSES = [
  "ACTIVE",
  "PROMOTED",
  "TRANSFERRED",
  "DROPOUT",
  "ALUMNI",
  "SUSPENDED",
  "GRADUATED",
] as const;

export type StudentStatus =
  (typeof STUDENT_STATUSES)[number];

export function isStudentStatus(
  value: unknown
): value is StudentStatus {
  return STUDENT_STATUSES.includes(
    String(value || "")
      .trim()
      .toUpperCase() as StudentStatus
  );
}

export function normalizeStudentStatus(
  value: unknown,
  fallback: StudentStatus = "ACTIVE"
) {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();

  return isStudentStatus(normalized)
    ? normalized
    : fallback;
}

export function statusIsActive(
  status: unknown,
  isActive?: boolean | null
) {
  const normalized =
    String(status || "")
      .trim()
      .toUpperCase();

  if (
    normalized === "ACTIVE" ||
    normalized === "PROMOTED"
  ) {
    return true;
  }

  if (
    normalized === "TRANSFERRED" ||
    normalized === "DROPOUT" ||
    normalized === "ALUMNI" ||
    normalized === "SUSPENDED" ||
    normalized === "GRADUATED"
  ) {
    return false;
  }

  return Boolean(isActive ?? true);
}

export function currentYearSuffix(
  date = new Date()
) {
  return String(date.getFullYear()).slice(-2);
}

export function cleanSchoolCode(
  value: unknown
) {
  return String(value || "KVS")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") || "KVS";
}

export function certificateDocumentNumber(
  schoolCode: string,
  certificateType:
    | "TC"
    | "SC",
  sequence: number,
  date = new Date()
) {
  const suffix = currentYearSuffix(date);
  return `${schoolCode}-${certificateType}-${String(sequence).padStart(3, "0")}/${suffix}`;
}

