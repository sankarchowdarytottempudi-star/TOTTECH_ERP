import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  getGovernanceSnapshot,
  requireCurrentUser,
} from "@/lib/governance/rbac";
import {
  getUserSchoolAccess,
  isSuperAdminRole,
} from "@/lib/school-access";
import {
  getSchoolModuleAccess,
  getUserModuleAccess,
} from "@/lib/module-governance";

export async function GET() {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const schoolId =
    auth.user?.school_id ?? null;
  const assignedSchools =
    await getUserSchoolAccess(
      Number(auth.user?.id) || null,
      auth.user?.role
    );

  const school =
    schoolId
      ? await prisma.schools.findUnique({
          where: {
            id: schoolId,
          },
        })
      : null;

  const snapshot =
    await getGovernanceSnapshot(
      auth.user!
    );
  const moduleAccess =
    await getSchoolModuleAccess(schoolId);
  const userModuleAccess =
    await getUserModuleAccess(
      Number(auth.user?.id) || null,
      schoolId
    );
  const effectiveModuleAccess = {
    ...moduleAccess,
    AI:
      moduleAccess.AI !== false &&
      userModuleAccess.TOTTECH_AI !== false &&
      userModuleAccess.SCHOOLGPT !== false,
  };

  return NextResponse.json({
    activeSchool: school,
    assignedSchools,
    moduleAccess,
    userModuleAccess,
    effectiveModuleAccess,
    canAccessAllSchools:
      isSuperAdminRole(auth.user?.role),
    context: snapshot,
  });
}
