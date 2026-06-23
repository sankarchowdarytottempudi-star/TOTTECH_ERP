import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getSchoolModuleAccess, getUserModuleAccess } from "@/lib/module-governance";
import {
  isSuperAdminRole,
  userCanAccessSchool,
} from "@/lib/school-access";

export async function POST(
  request: Request
) {
  const user =
    await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body =
    await request.json();
  const rawSchoolId = String(
    body.schoolId ??
      body.school_id ??
      body.active_school_id ??
      ""
  ).trim();
  const numericSchoolId =
    Number(rawSchoolId);
  const schoolId =
    rawSchoolId === "" ||
    rawSchoolId.toLowerCase() ===
      "all" ||
    rawSchoolId === "0"
      ? "all"
      : Number.isFinite(
            numericSchoolId
          ) &&
          numericSchoolId > 0
        ? String(numericSchoolId)
        : "all";

  const superAdmin =
    isSuperAdminRole(user.role);

  if (schoolId === "all" && !superAdmin) {
    return NextResponse.json(
      {
        error:
          "You are not allowed to access all schools.",
      },
      { status: 403 }
    );
  }

  if (schoolId !== "all") {
    const allowed =
      await userCanAccessSchool(
        Number(user.id) || null,
        user.role,
        Number(schoolId)
      );

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You are not assigned to this school.",
        },
        { status: 403 }
      );
    }
  }

  const response = NextResponse.json({
    success: true,
    schoolId,
  });

  response.cookies.set("active_school_id", schoolId, {
    path: "/",
  });

  if (schoolId !== "all") {
    const schoolModuleAccess = await getSchoolModuleAccess(Number(schoolId));
    const userModuleAccess = await getUserModuleAccess(Number(user.id) || null, Number(schoolId));

    response.cookies.set(
      "module_access",
      JSON.stringify(schoolModuleAccess),
      { path: "/" }
    );

    response.cookies.set(
      "user_module_access",
      JSON.stringify(userModuleAccess),
      { path: "/" }
    );
  }

  return response;

}
