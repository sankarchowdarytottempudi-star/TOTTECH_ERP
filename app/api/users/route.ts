import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import {
  getUserSchoolAccess,
  isSuperAdminRole,
  parseSchoolIds,
  replaceUserSchoolAccess,
} from "@/lib/school-access";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

const adminRoles = new Set([
  "SUPER_ADMIN",
  "ADMIN",
  "OWNER",
]);

const normalizeRole = (role?: string | null) =>
  String(role || "")
    .trim()
    .toUpperCase();

const canManageUsers = (
  role?: string | null
) => adminRoles.has(normalizeRole(role));

export async function GET() {
  const moduleGuard =
    await requireSchoolModule(
      "USER_MANAGEMENT"
    );

  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const currentUser =
    moduleGuard.user;

  if (!currentUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const superAdmin =
    isSuperAdminRole(currentUser.role);
  const managerSchools =
    superAdmin
      ? []
      : await getUserSchoolAccess(
          Number(currentUser.id) || null,
          currentUser.role
        );
  const managerSchoolIds =
    managerSchools.map((school) => school.id);

  const users =
    await prisma.users.findMany({
      where: superAdmin
        ? {
            platform_type: "EDUCATIONAL",
          }
        : {
            platform_type: "EDUCATIONAL",
            user_school_access: {
              some: {
                school_id: {
                  in: managerSchoolIds,
                },
                is_active: true,
              },
            },
          },
      select: {
        id: true,
        school_id: true,
        full_name: true,
        email: true,
        phone: true,
        whatsapp_number: true,
        alternative_mobile: true,
        emergency_contact_number: true,
        role: true,
        status: true,
        is_active: true,
        is_deleted: true,
        locked_at: true,
        archived_at: true,
        last_login: true,
        created_at: true,
        schools: true,
        user_school_access: {
          where: {
            is_active: true,
          },
          select: {
            is_primary: true,
            schools: {
              select: {
                id: true,
                school_name: true,
                school_code: true,
              },
            },
          },
          orderBy: [
            {
              is_primary: "desc",
            },
            {
              school_id: "asc",
            },
          ],
        },
      },
      orderBy: {
        id: "desc",
      },
    });

  return NextResponse.json(
    users.map((user) => ({
      ...user,
      school_access:
        user.user_school_access.map(
          (access) => ({
            id: access.schools.id,
            school_name:
              access.schools.school_name,
            school_code:
              access.schools.school_code,
            is_primary:
              access.is_primary === true,
          })
        ),
      user_school_access: undefined,
    }))
  );

}

export async function POST(
  request: Request
) {

  try {
    const moduleGuard =
      await requireSchoolModule(
        "USER_MANAGEMENT"
      );

    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const currentUser =
      moduleGuard.user;

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (
      !canManageUsers(
        currentUser.role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only Admin and Super Admin users can create users.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    if (!body.full_name) {
      return NextResponse.json(
        {
          error:
            "Full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.email) {
      return NextResponse.json(
        {
          error: "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.password) {
      return NextResponse.json(
        {
          error:
            "Password is required for new users.",
        },
        {
          status: 400,
        }
      );
    }

    const role = normalizeRole(
      body.role || "TEACHER"
    );
    const requestedSchoolIds =
      parseSchoolIds(
        body.school_ids ??
          body.school_id
      );
    const primarySchoolId =
      Number(body.primary_school_id) ||
      requestedSchoolIds[0] ||
      null;
    const currentUserSuperAdmin =
      isSuperAdminRole(
        currentUser.role
      );
    const managerSchools =
      currentUserSuperAdmin
        ? []
        : await getUserSchoolAccess(
            Number(currentUser.id) || null,
            currentUser.role
          );
    const managerSchoolIds =
      managerSchools.map(
        (school) => school.id
      );

    if (
      !currentUserSuperAdmin &&
      requestedSchoolIds.some(
        (schoolId) =>
          !managerSchoolIds.includes(
            schoolId
          )
      )
    ) {
      return NextResponse.json(
        {
          error:
            "You can only assign schools you manage.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      role !== "SUPER_ADMIN" &&
      requestedSchoolIds.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Select a school for this user.",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await prisma.users.create({

        data: {

          school_id: primarySchoolId,

          full_name:
            body.full_name,

          email:
            body.email,

          phone:
            body.phone || null,
          whatsapp_number:
            body.whatsapp_number || null,
          alternative_mobile:
            body.alternative_mobile || null,
          emergency_contact_number:
            body.emergency_contact_number || null,

          password_hash:
            await bcrypt.hash(
              body.password,
              10
            ),

          role,
          platform_type: "EDUCATIONAL",

          is_active:
            body.is_active === false
              ? false
              : true,
          status:
            body.is_active === false
              ? "INACTIVE"
              : "ACTIVE",

        },

      });

    const savedPrimarySchoolId =
      await replaceUserSchoolAccess({
        userId: user.id,
        schoolIds:
          role === "SUPER_ADMIN"
            ? []
            : requestedSchoolIds,
        primarySchoolId,
        createdBy:
          Number(currentUser.id) ||
          null,
      });

    if (
      savedPrimarySchoolId !==
      user.school_id
    ) {
      await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          school_id:
            savedPrimarySchoolId,
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      school_id:
        savedPrimarySchoolId ??
        user.school_id,
      school_ids:
        requestedSchoolIds,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      whatsapp_number: (user as any).whatsapp_number,
      alternative_mobile: (user as any).alternative_mobile,
      emergency_contact_number:
        (user as any).emergency_contact_number,
      role: user.role,
      status: user.status,
      is_active: user.is_active,
      created_at: user.created_at,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create user",
      },
      {
        status: 500,
      }
    );

  }

}
