import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { apiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import {
  getPrimarySchoolId,
  isSuperAdminRole,
  userCanAccessSchool,
} from "@/lib/school-access";

export async function GET() {
  try {
    const user =
      await getCurrentUser();
    const cookieStore =
      await cookies();
    const activeSchool =
      cookieStore.get(
        "active_school_id"
      )?.value;
    const activeSchoolId =
      activeSchool &&
      activeSchool !== "all"
        ? Number(activeSchool)
        : null;

    const superAdmin =
      isSuperAdminRole(user?.role);

    if (
      user &&
      activeSchoolId &&
      Number.isFinite(activeSchoolId) &&
      (await userCanAccessSchool(
        Number(user.id) || null,
        user.role,
        activeSchoolId
      ))
    ) {
      const selectedSchool =
        await prisma.schools.findUnique({
          where: {
            id: activeSchoolId,
          },
        });

      if (selectedSchool) {
        return NextResponse.json(
          selectedSchool
        );
      }
    }

    if (
      superAdmin &&
      !user.school_id
    ) {
      return NextResponse.json({
        id: null,
        school_name: "All Schools/Colleges",
        school_code: "ALL",
        is_all_schools: true,
      });
    }

    const school =
      user?.school_id
        ? await prisma.schools.findUnique({
            where: {
              id: Number(
                user.school_id
              ),
            },
          })
        : user
          ? await prisma.schools.findUnique({
              where: {
                id:
                  (await getPrimarySchoolId(
                    Number(user.id) || null,
                    user.role
                  )) || -1,
              },
            })
          : null;

    if (
      superAdmin &&
      !school
    ) {
      return NextResponse.json({
        id: null,
        school_name: "All Schools/Colleges",
        school_code: "ALL",
        is_all_schools: true,
      });
    }

    return NextResponse.json(
      school
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load current school/college"
    );
  }
}
