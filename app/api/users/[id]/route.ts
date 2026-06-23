import { NextRequest, NextResponse } from "next/server";
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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const adminRoles = new Set([
  "SUPER_ADMIN",
  "ADMIN",
  "OWNER",
]);

const normalizeRole = (role?: string | null) =>
  String(role || "")
    .trim()
    .toUpperCase();

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
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
      !adminRoles.has(
        normalizeRole(
          currentUser.role
        )
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only Admin and Super Admin users can edit users.",
        },
        {
          status: 403,
        }
      );
    }

    const resolvedParams =
      await params;
    const id = Number(
      resolvedParams.id
    );

    if (!id) {
      return NextResponse.json(
        {
          error:
            "A valid user id is required.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await req.json();
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

    const passwordData =
      body.password
        ? {
            password_hash:
              await bcrypt.hash(
                body.password,
                10
              ),
          }
        : {};

    const preferredLanguage = body.preferred_language
      ? String(body.preferred_language)
          .trim()
          .toLowerCase()
      : null;

    const user =
      await prisma.users.update({

        where: {
          id,
        },

        data: {

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
          ...(preferredLanguage
            ? {
                preferred_language:
                  preferredLanguage,
              }
            : {}),

          role,

          school_id:
            role === "SUPER_ADMIN"
              ? null
              : primarySchoolId,

          is_active:
            body.is_active === false
              ? false
              : true,
          status:
            body.is_active === false
              ? "INACTIVE"
              : "ACTIVE",

          ...passwordData,

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
      preferred_language:
        (user as { preferred_language?: string | null })
          .preferred_language || null,
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
            : "Update failed",
      },
      {
        status: 500,
      }
    );

  }

}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
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

    if (
      !adminRoles.has(
        normalizeRole(
          currentUser?.role
        )
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only Admin and Super Admin users can manage user lifecycle.",
        },
        {
          status: 403,
        }
      );
    }

    const resolvedParams =
      await params;
    const id = Number(
      resolvedParams.id
    );
    const body = await req.json();
    const action = String(
      body.action || ""
    )
      .trim()
      .toUpperCase();

    const currentUserId =
      Number(currentUser?.id) || null;
    const now = new Date();

    const lifecycleMap: Record<
      string,
      {
        status: string;
        is_active: boolean;
        data?: Record<string, unknown>;
      }
    > = {
      DISABLE: {
        status: "INACTIVE",
        is_active: false,
      },
      LOCK: {
        status: "LOCKED",
        is_active: false,
        data: {
          locked_at: now,
          locked_by: currentUserId,
        },
      },
      ARCHIVE: {
        status: "ARCHIVED",
        is_active: false,
        data: {
          archived_at: now,
          archived_by: currentUserId,
          is_deleted: true,
          deleted_at: now,
          deleted_by: currentUserId,
        },
      },
      RESTORE: {
        status: "ACTIVE",
        is_active: true,
        data: {
          locked_at: null,
          locked_by: null,
          archived_at: null,
          archived_by: null,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
      },
    };

    const lifecycle =
      lifecycleMap[action];

    if (!id || !lifecycle) {
      return NextResponse.json(
        {
          error:
            "Valid action is required: DISABLE, LOCK, ARCHIVE, RESTORE.",
        },
        {
          status: 400,
        }
      );
    }

    const before =
      await prisma.users.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          school_id: true,
          full_name: true,
          email: true,
          role: true,
          status: true,
          is_active: true,
          is_deleted: true,
        },
      });

    if (!before) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const user =
      await prisma.users.update({
        where: {
          id,
        },
        data: {
          status: lifecycle.status,
          is_active: lifecycle.is_active,
          updated_at: now,
          ...(lifecycle.data || {}),
        },
      });

    await prisma.audit_logs.create({
      data: {
        school_id:
          before.school_id ?? null,
        user_id: currentUserId,
        action_type: `USER_${action}`,
        action_details: JSON.stringify({
          target_user_id: id,
          before,
          after: {
            status: user.status,
            is_active: user.is_active,
            is_deleted: user.is_deleted,
          },
        }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
        is_active: user.is_active,
        is_deleted: user.is_deleted,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "User lifecycle update failed",
      },
      {
        status: 500,
      }
    );
  }
}
