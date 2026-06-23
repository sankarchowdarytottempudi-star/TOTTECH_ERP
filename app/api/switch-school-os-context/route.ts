import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";
import {
  getSchoolModuleAccess,
  getUserModuleAccess,
} from "@/lib/module-governance";

export async function POST(
  request: Request
) {
  const auth = await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const body = await request.json();
  const schoolId = Number(
    body.schoolId ?? body.school_id
  );

  if (!Number.isFinite(schoolId)) {
    return NextResponse.json(
      {
        error:
          "schoolId is required.",
      },
      {
        status: 400,
      }
    );
  }

  const school =
    await prisma.schools.findUnique({
      where: {
        id: schoolId,
      },
    });

  if (!school) {
    return NextResponse.json(
      {
        error: "School/College not found.",
      },
      {
        status: 404,
      }
    );
  }

  const cookieStore = await cookies();

  cookieStore.set(
    "active_school_id",
    String(schoolId),
    {
      path: "/",
    }
  );

  const schoolModuleAccess = await getSchoolModuleAccess(schoolId);
  const userModuleAccess = await getUserModuleAccess(
    Number(auth.user?.id) || null,
    schoolId
  );

  cookieStore.set(
    "module_access",
    JSON.stringify(schoolModuleAccess),
    {
      path: "/",
    }
  );

  cookieStore.set(
    "user_module_access",
    JSON.stringify(userModuleAccess),
    {
      path: "/",
    }
  );

  return NextResponse.json({
    success: true,
    activeSchool: school,
  });
}
