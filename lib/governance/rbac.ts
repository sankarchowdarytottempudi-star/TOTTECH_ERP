import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type GovernanceUser = {
  id?: number;
  role?: string;
  school_id?: number | null;
  school_name?: string;
};

export type PermissionCheck = {
  module: string;
  action: string;
};

const normalize = (value: string) =>
  value.trim().toUpperCase();

export const permissionCode = (
  check: PermissionCheck
) =>
  `${normalize(check.module)}.${normalize(check.action)}`;

export async function getRolePermissionCodes(
  roleName?: string
) {
  if (!roleName) {
    return new Set<string>();
  }

  const role =
    await prisma.roles.findFirst({
      where: {
        role_name: roleName,
      },
    });

  if (!role) {
    return new Set<string>();
  }

  const links =
    await prisma.role_permissions.findMany({
      where: {
        role_id: role.id,
      },
    });

  const permissionIds =
    links
      .map((link) => link.permission_id)
      .filter(
        (id): id is number =>
          typeof id === "number"
      );

  if (!permissionIds.length) {
    return new Set<string>();
  }

  const permissions =
    await prisma.permissions.findMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });

  return new Set(
    permissions
      .filter(
        (permission) =>
          permission.module_name &&
          permission.action_name
      )
      .map((permission) =>
        `${normalize(permission.module_name!)}.${normalize(permission.action_name!)}`
      )
  );
}

export async function userHasPermission(
  user: GovernanceUser | null,
  check: PermissionCheck | string
) {
  if (!user?.role) {
    return false;
  }

  const expected =
    typeof check === "string"
      ? normalize(check)
      : permissionCode(check);

  const permissions =
    await getRolePermissionCodes(
      user.role
    );

  return permissions.has(expected);
}

export async function requireCurrentUser() {
  const user =
    (await getCurrentUser()) as GovernanceUser | null;

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

export async function requirePermission(
  check: PermissionCheck | string
) {
  const auth =
    await requireCurrentUser();

  if (!auth.user) {
    return auth;
  }

  const allowed =
    await userHasPermission(
      auth.user,
      check
    );

  if (!allowed) {
    return {
      user: auth.user,
      response: NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    user: auth.user,
    response: null,
  };
}

export async function canAccessAllSchools(
  user: GovernanceUser | null
) {
  if (
    String(user?.role || "")
      .trim()
      .toUpperCase() === "SUPER_ADMIN"
  ) {
    return true;
  }

  return false;
  /*
  return (
    (await userHasPermission(user, {
      module: "platform",
      action: "manage",
    })) ||
    (await userHasPermission(user, {
      module: "governance",
      action: "manage",
    }))
  );
  */
}

export async function scopedSchoolWhere(
  user: GovernanceUser | null
) {
  if (
    await canAccessAllSchools(user)
  ) {
    return {};
  }

  return {
    school_id: user?.school_id ?? -1,
  };
}

export async function getActiveAcademicYear(
  schoolId?: number | null
) {
  if (!schoolId) {
    return null;
  }

  return prisma.academic_years.findFirst({
    where: {
      school_id: schoolId,
      is_current: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

export async function getGovernanceSnapshot(
  user: GovernanceUser
) {
  const [
    permissions,
    activeAcademicYear,
    settings,
    flags,
  ] = await Promise.all([
    getRolePermissionCodes(user.role),
    getActiveAcademicYear(user.school_id),
    prisma.governance_settings.findMany({
      where: {
        OR: [
          {
            school_id: null,
          },
          {
            school_id:
              user.school_id ?? undefined,
          },
        ],
      },
      orderBy: {
        setting_key: "asc",
      },
    }),
    prisma.feature_flags.findMany({
      where: {
        OR: [
          {
            school_id: null,
          },
          {
            school_id:
              user.school_id ?? undefined,
          },
        ],
      },
      orderBy: {
        flag_key: "asc",
      },
    }),
  ]);

  return {
    user: {
      id: user.id,
      school_id: user.school_id,
      school_name: user.school_name,
    },
    activeAcademicYear,
    permissions: Array.from(
      permissions
    ).sort(),
    settings,
    flags,
  };
}
