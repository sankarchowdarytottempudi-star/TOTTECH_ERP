import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  getPrimarySchoolId,
  userCanAccessSchool,
} from "@/lib/school-access";

export async function getCurrentUser() {

  const cookieStore =
    await cookies();

  const userCookie =
    cookieStore.get("erpUser");

  if (!userCookie) {
    return null;
  }

  let user: any;

  try {
    user = JSON.parse(userCookie.value);
  } catch {
    return null;
  }
  const assignedSchoolId =
    Number(user.school_id) || null;
  const isSuperAdmin =
    String(user.role || "")
      .trim()
      .toUpperCase() ===
    "SUPER_ADMIN";
  const primarySchoolId =
    await getPrimarySchoolId(
      Number(user.id) || null,
      user.role
    );

  const activeSchool =
    cookieStore.get(
      "active_school_id"
    );

  if (
    activeSchool
  ) {
    const value = String(
      activeSchool.value || ""
    ).toLowerCase();

    if (
      isSuperAdmin &&
      (value === "all" ||
        value === "0" ||
        value === "")
    ) {
      user.school_id = null;
      user.school_scope = "all";
    } else {
      const selectedSchoolId =
        Number(activeSchool.value);
      if (
        Number.isFinite(
          selectedSchoolId
        ) &&
        selectedSchoolId > 0 &&
        (await userCanAccessSchool(
          Number(user.id) || null,
          user.role,
          selectedSchoolId
        ))
      ) {
        user.school_id =
          selectedSchoolId;
      } else {
        user.school_id =
          primarySchoolId ??
          assignedSchoolId;
      }
      user.school_scope = user.school_id
        ? "selected"
        : isSuperAdmin
          ? "all"
          : "assigned";
    }
  } else if (!isSuperAdmin) {
    user.school_id =
      primarySchoolId ??
      assignedSchoolId;
    user.school_scope = user.school_id
      ? "assigned"
      : "none";
  }

  if (
    isSuperAdmin &&
    user.school_id
  ) {
    const school =
      await prisma.schools.findUnique({
        where: {
          id: Number(user.school_id),
        },
        select: {
          id: true,
        },
      });

    if (!school) {
      user.school_id = null;
      user.school_scope = "all";
    }
  }

  const activeAcademicYear =
    cookieStore.get(
      "active_academic_year_id"
    );

  if (
    activeAcademicYear?.value
  ) {
    const value = String(
      activeAcademicYear.value
    ).toLowerCase();

    if (
      value === "all" ||
      value === "0" ||
      value === ""
    ) {
      user.academic_year_id = null;
      user.academic_year_scope =
        "all";
    } else {
      user.academic_year_id =
        Number(
          activeAcademicYear.value
        );
      user.academic_year_scope =
        "selected";
    }
  }

  return user;
}
