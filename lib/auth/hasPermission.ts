import {
  legacyPermissionAliases,
  normalizePermissionKey,
} from "./permissions";

type StoredUser = {
  permissions?: string[];
};

const privilegedSchoolRoles = new Set([
  "SUPER_ADMIN",
  "OWNER",
  "ADMIN",
]);

const readPermissionCodes = () => {
  if (
    typeof window === "undefined"
  ) {
    return new Set<string>();
  }

  try {
    const storedUser =
      localStorage.getItem("erpUser");
    const user = storedUser
      ? (JSON.parse(
          storedUser
        ) as StoredUser)
      : null;

    return new Set(
      (user?.permissions ?? []).map(
        normalizePermissionKey
      )
    );
  } catch {
    return new Set<string>();
  }
};

export function hasPermission(
  role: string,
  permission: string
) {
  const normalizedRole =
    normalizePermissionKey(role);
  if (
    privilegedSchoolRoles.has(
      normalizedRole
    )
  ) {
    return true;
  }

  const requested =
    normalizePermissionKey(permission);
  const codes =
    readPermissionCodes();

  if (codes.has(requested)) {
    return true;
  }

  return (
    legacyPermissionAliases[
      requested
    ] ?? []
  ).some((alias) =>
    codes.has(
      normalizePermissionKey(alias)
    )
  );
}
