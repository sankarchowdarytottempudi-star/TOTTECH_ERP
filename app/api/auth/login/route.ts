import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  getRolePermissionCodes,
} from "@/lib/governance/rbac";
import {
  dashboardForProject,
  projectForPlatform,
  projectTypeForPlatform,
} from "@/lib/project-routing";
import {
  getUserSchoolAccess,
  isSuperAdminRole,
} from "@/lib/school-access";
import {
  getSchoolModuleAccess,
  getUserModuleAccess,
} from "@/lib/module-governance";
import {
  getParentLinkedStudents,
} from "@/lib/parent-access";

async function recordLoginHistory(input: {
  userId?: number | null;
  schoolId?: number | null;
  platformType?: string | null;
  status: string;
  reason?: string | null;
  request: Request;
}) {
  try {
    await prisma.user_login_history.create({
      data: {
        user_id: input.userId ?? null,
        school_id: input.schoolId ?? null,
        platform_type:
          input.platformType ?? null,
        status: input.status,
        reason: input.reason ?? null,
        ip_address:
          input.request.headers.get(
            "x-forwarded-for"
          ) ||
          input.request.headers.get(
            "x-real-ip"
          ) ||
          null,
        user_agent:
          input.request.headers.get(
            "user-agent"
          ) || null,
      },
    });
  } catch (error) {
    console.error(
      "Login history write failed",
      error
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(
      body.username || body.email || ""
    )
      .trim()
      .toLowerCase();
    const platformType = String(
      body.platform_type || body.platformType || "EDUCATIONAL"
    )
      .trim()
      .toUpperCase();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    if (!["EDUCATIONAL", "CLINICAL"].includes(platformType)) {
      return NextResponse.json(
        { error: "Invalid platform selected." },
        { status: 400 }
      );
    }

    const users = await prisma.$queryRawUnsafe<
      {
        id: number;
        school_id: number | null;
        full_name: string;
        email: string;
        username: string | null;
        phone: string | null;
        password_hash: string;
        role: string;
        is_active: boolean | null;
        platform_type: string;
        status: string | null;
        is_deleted: boolean | null;
        preferred_language: string | null;
        school_name: string | null;
      }[]
    >(
      `
      SELECT
        u.id,
        u.school_id,
        u.full_name,
        u.email,
        u.username,
        u.phone,
        u.password_hash,
        u.role,
        u.is_active,
        u.platform_type,
        u.status,
        u.is_deleted,
        u.preferred_language,
        s.school_name
      FROM users u
      LEFT JOIN schools s ON s.id = u.school_id
      WHERE u.platform_type = $1
        AND (
          LOWER(COALESCE(u.username,'')) = $2
          OR LOWER(u.email) = $2
        )
      ORDER BY u.id ASC
      LIMIT 1
      `,
      platformType,
      username
    );

    const user = users[0];

    if (!user) {
      await recordLoginHistory({
        platformType,
        status: "FAILED",
        reason:
          "Invalid username or platform.",
        request,
      });

      return NextResponse.json(
        { error: "Invalid username or platform." },
        { status: 401 }
      );
    }

    const status = String(
      user.status || "ACTIVE"
    )
      .trim()
      .toUpperCase();

    if (
      user.is_deleted ||
      status === "ARCHIVED"
    ) {
      await recordLoginHistory({
        userId: user.id,
        schoolId: user.school_id,
        platformType,
        status: "BLOCKED",
        reason:
          "User account is archived.",
        request,
      });

      return NextResponse.json(
        {
          error:
            "This user account is archived. Contact the administrator to restore access.",
        },
        { status: 403 }
      );
    }

    if (status === "LOCKED") {
      await recordLoginHistory({
        userId: user.id,
        schoolId: user.school_id,
        platformType,
        status: "BLOCKED",
        reason:
          "User account is locked.",
        request,
      });

      return NextResponse.json(
        {
          error:
            "This user account is locked. Contact the administrator.",
        },
        { status: 403 }
      );
    }

    if (
      status !== "ACTIVE" ||
      user.is_active === false
    ) {
      await recordLoginHistory({
        userId: user.id,
        schoolId: user.school_id,
        platformType,
        status: "BLOCKED",
        reason:
          "User account is inactive.",
        request,
      });

      return NextResponse.json(
        {
          error:
            "This user account is inactive. Contact the administrator.",
        },
        { status: 403 }
      );
    }

   const validPassword =
  await bcrypt.compare(
    body.password,
    user.password_hash
  );

	if (!validPassword) {
	  await recordLoginHistory({
	    userId: user.id,
	    schoolId: user.school_id,
	    platformType,
	    status: "FAILED",
	    reason: "Invalid password.",
	    request,
	  });

	  return NextResponse.json(
	    { error: "Invalid Password" },
    { status: 401 }
  );

}

    const permissions =
      Array.from(
        await getRolePermissionCodes(
          user.role
        )
      );
    const project =
      projectForPlatform(user.platform_type);
    const projectType =
      projectTypeForPlatform(user.platform_type);
    const isEducationalPlatform =
      String(user.platform_type || "")
        .trim()
        .toUpperCase() === "EDUCATIONAL";
    const assignedSchools =
      isEducationalPlatform
        ? await getUserSchoolAccess(
            user.id,
            user.role
          )
        : [];
    const superAdmin =
      isSuperAdminRole(user.role);
    const autoSchoolId =
      isEducationalPlatform &&
      !superAdmin &&
      assignedSchools.length === 1
        ? assignedSchools[0].id
        : null;
    const requiresSchoolSelection =
      isEducationalPlatform &&
      !superAdmin &&
      assignedSchools.length > 1;
    const redirectTo =
      String(user.role || "")
        .trim()
        .toUpperCase() === "PARENT"
        ? "/parent/dashboard"
        : requiresSchoolSelection
          ? "/select-school"
          : dashboardForProject(project);
    const activeSchoolForSession =
      autoSchoolId ?? user.school_id;
    const schoolModuleAccess =
      isEducationalPlatform && activeSchoolForSession
        ? await getSchoolModuleAccess(
            activeSchoolForSession
          )
        : {};
    const userModuleAccess =
      isEducationalPlatform
        ? await getUserModuleAccess(
            user.id,
            activeSchoolForSession
          )
        : {};
    const isParentRole =
      String(user.role || "")
        .trim()
        .toUpperCase() === "PARENT";
    const parentStudents =
      isParentRole
        ? await getParentLinkedStudents({
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            full_name: user.full_name,
            school_id:
              activeSchoolForSession,
          })
        : [];
    const parentStudentIds =
      parentStudents.map((student) =>
        Number(student.id)
      );
    const erpUserCookie = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      school_id:
        activeSchoolForSession,
      active_school_id:
        activeSchoolForSession,
      school_name:
        user.school_name || "",
      preferred_language:
        user.preferred_language || "en",
      requires_school_selection:
        requiresSchoolSelection,
      username: user.username,
      platform_type: user.platform_type,
      parent_student_ids:
        parentStudentIds,
      parent_student_count:
        parentStudentIds.length,
      project,
      projectType,
    };

    const response = NextResponse.json({
      success: true,
      project,
      projectType,
      redirectTo,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        school_id: user.school_id,
        active_school_id: activeSchoolForSession,
        school_name: user.school_name || "",
        preferred_language:
          user.preferred_language || "en",
        assigned_schools: assignedSchools,
        requires_school_selection:
          requiresSchoolSelection,
        username: user.username,
        platform_type: user.platform_type,
        parent_student_ids: parentStudentIds,
        parent_student_count:
          parentStudentIds.length,
        permissions,
        user_module_access: userModuleAccess,
        project,
        projectType,
        redirectTo,
      },
    });

    const isSecureRequest =
      request.headers.get("x-forwarded-proto") === "https" ||
      request.url.startsWith("https://");
    const useSecureCookie =
      process.env.NODE_ENV === "production" &&
      isSecureRequest;

    response.cookies.set(
      "erpUser",
      JSON.stringify(erpUserCookie),
      {
        httpOnly: true,
        secure: useSecureCookie,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 8,
      }
    );

    if (isEducationalPlatform) {
      response.cookies.set(
        "module_access",
        JSON.stringify(schoolModuleAccess),
        {
          httpOnly: true,
          secure: useSecureCookie,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 8,
        }
      );

      response.cookies.set(
        "user_module_access",
        JSON.stringify(userModuleAccess),
        {
          httpOnly: true,
          secure: useSecureCookie,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 8,
        }
      );
    }

    if (isEducationalPlatform) {
      if (superAdmin) {
        response.cookies.set(
          "active_school_id",
          "all",
          {
            httpOnly: false,
            secure: useSecureCookie,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 8,
          }
        );
      } else if (autoSchoolId) {
        response.cookies.set(
          "active_school_id",
          String(autoSchoolId),
          {
            httpOnly: false,
            secure: useSecureCookie,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 8,
          }
        );
      } else {
        response.cookies.delete(
          "active_school_id"
        );
      }
    }

    if (isEducationalPlatform && !superAdmin) {
      if (isParentRole) {
        response.cookies.set(
          "parent_student_ids",
          JSON.stringify(
            parentStudentIds
          ),
          {
            httpOnly: false,
            secure: useSecureCookie,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 8,
          }
        );
      } else {
        response.cookies.delete(
          "parent_student_ids"
        );
      }
    }

    response.cookies.set("platform_type", user.platform_type, {
      httpOnly: false,
      secure: useSecureCookie,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    response.cookies.set(
      "app_language",
      user.preferred_language || "en",
      {
        httpOnly: false,
        secure: useSecureCookie,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      }
    );

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        last_login: new Date(),
        updated_at: new Date(),
      },
    });

    await recordLoginHistory({
      userId: user.id,
      schoolId:
        Number(activeSchoolForSession) ||
        user.school_id,
      platformType,
      status: "SUCCESS",
      reason: "Login successful.",
      request,
    });

    if (projectType === "CLINICAL") {
      const profiles =
        await prisma.$queryRawUnsafe<
          {
            tenant_id: number;
            hospital_id: number | null;
            branch_id: number | null;
            clinic_id: number | null;
          }[]
        >(
          `
          SELECT
            cup.tenant_id,
            COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
            COALESCE(cup.branch_id, c.branch_id) AS branch_id,
            cup.clinic_id
          FROM clinical_user_profiles cup
          JOIN clinics c ON c.id = cup.clinic_id
          WHERE cup.user_id = $1
            AND COALESCE(cup.is_deleted,false) = false
            AND COALESCE(c.is_deleted,false) = false
          ORDER BY cup.id ASC
          LIMIT 1
          `,
          user.id
        );
      const profile = profiles[0];
      const clinicalCookieOptions = {
        httpOnly: false,
        secure: useSecureCookie,
        sameSite: "strict" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      };

      if (profile?.hospital_id) {
        response.cookies.set(
          "active_hospital_id",
          String(profile.hospital_id),
          clinicalCookieOptions
        );
      }
      if (profile?.branch_id) {
        response.cookies.set(
          "active_branch_id",
          String(profile.branch_id),
          clinicalCookieOptions
        );
      }
      if (profile?.clinic_id) {
        response.cookies.set(
          "active_clinic_id",
          String(profile.clinic_id),
          clinicalCookieOptions
        );
      }
    } else {
      response.cookies.delete(
        "active_hospital_id"
      );
      response.cookies.delete(
        "active_branch_id"
      );
      response.cookies.delete(
        "active_clinic_id"
      );
    }

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Login Failed" },
      { status: 500 }
    );
  }
}
