export const currentRole =
  "SUPER_ADMIN";

export function canEdit() {
  return (
    currentRole === "SUPER_ADMIN" ||
    currentRole === "SCHOOL_ADMIN" ||
    currentRole === "PRINCIPAL"
  );
}

export function canDelete() {
  return (
    currentRole === "SUPER_ADMIN" ||
    currentRole === "SCHOOL_ADMIN"
  );
}
