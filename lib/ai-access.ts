import { getCurrentUser } from "@/lib/auth";
import {
  getSchoolModuleAccess,
  getUserModuleAccess,
} from "@/lib/module-governance";
import { isSuperAdminRole } from "@/lib/school-access";

export async function hasEffectiveAiAccess(
  userId?: number | null,
  schoolId?: number | null,
  role?: string | null
) {
  if (isSuperAdminRole(role)) {
    return true;
  }

  if (!userId || !schoolId) {
    return false;
  }

  const [schoolAccess, userAccess] =
    await Promise.all([
      getSchoolModuleAccess(schoolId),
      getUserModuleAccess(userId, schoolId),
    ]);

  return (
    schoolAccess.AI !== false &&
    userAccess.TOTTECH_AI !== false &&
    userAccess.SCHOOLGPT !== false
  );
}

export async function requireAiAccess() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      allowed: false,
      reason: "Unauthorized",
    };
  }

  const allowed = await hasEffectiveAiAccess(
    Number(user.id) || null,
    Number(user.school_id) || null,
    user.role
  );

  if (!allowed) {
    return {
      user,
      allowed: false,
      reason:
        "You do not have access to this module.",
    };
  }

  return {
    user,
    allowed: true,
    reason: null,
  };
}
