import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { apiError } from "@/lib/api/errors";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";
import {
  getSchoolModuleAccess,
  getUserModuleAccess,
  ensureUserModuleMasterRows,
  replaceUserModuleAccess,
  schoolAllowsUserKey,
} from "@/lib/module-governance";
import { getUserSchoolAccess, isSuperAdminRole } from "@/lib/school-access";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN", "OWNER"]);

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = await params;
    const userId = Number(resolved.id);
    const schoolId = Number(new URL(request.url).searchParams?.get("school_id") || currentUser.school_id || 0);

    if (!userId || !schoolId) {
      return NextResponse.json({ error: "user_id and school_id are required" }, { status: 400 });
    }

    const [schoolAccess, userAccess, modules] = await Promise.all([
      getSchoolModuleAccess(schoolId),
      getUserModuleAccess(userId, schoolId),
      prisma.module_master.findMany({
        where: {
          is_active: true,
        },
        orderBy: [
          {
            sort_order: "asc",
          },
          {
            module_name: "asc",
          },
        ],
      }),
    ]);

    return NextResponse.json({
      school_id: schoolId,
      modules: modules.map((module) => ({
        id: module.id,
        module_key: module.module_key,
        module_name: module.module_name,
        category: module.category,
        enabled_for_school:
          schoolAllowsUserKey(
            schoolAccess,
            module.module_key
          ),
        enabled_for_user:
          userAccess[module.module_key as keyof typeof userAccess] !== false,
      })),
    });
  } catch (error) {
    console.error(error);
    return apiError(error, "Failed to load user module access");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!adminRoles.has(String(currentUser.role || "").toUpperCase())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolved = await params;
    const userId = Number(resolved.id);
    const body = await request.json();
    const schoolId = Number(body.school_id || body.selected_school_id || currentUser.school_id || 0);
    const moduleKeys = Array.isArray(body.module_keys) ? body.module_keys : [];

    if (!userId || !schoolId) {
      return NextResponse.json({ error: "user_id and school_id are required" }, { status: 400 });
    }

    const targetUser = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        platform_type: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!isSuperAdminRole(currentUser.role)) {
      const assignedSchools = await getUserSchoolAccess(Number(currentUser.id) || null, currentUser.role);
      if (!assignedSchools.some((school) => school.id === schoolId)) {
        return NextResponse.json({ error: "You can only manage assigned schools." }, { status: 403 });
      }
    }

    const schoolAccess = await getSchoolModuleAccess(schoolId);
    await ensureUserModuleMasterRows();
    const availableModules = await prisma.module_master.findMany({
      where: { is_active: true },
      select: {
        module_key: true,
      },
    });
    const allowedKeys = availableModules
      .filter((module) =>
        schoolAllowsUserKey(
          schoolAccess,
          module.module_key
        )
      )
      .map((module) => module.module_key);
    const invalidKeys = moduleKeys.filter((key: unknown) => !allowedKeys.includes(String(key)));

    if (invalidKeys.length) {
      return NextResponse.json(
        {
          error: "Some selected modules are not enabled for this school subscription.",
          invalid_modules: invalidKeys,
        },
        { status: 400 }
      );
    }

    await replaceUserModuleAccess({
      userId,
      schoolId,
      moduleKeys: moduleKeys.map((key: unknown) => String(key)),
      createdBy: Number(currentUser.id) || null,
    });

    await recordEvent({
      school_id: schoolId,
      user_id: Number(currentUser.id) || null,
      actor_role: currentUser.role,
      module_name: "User Management",
      event_type: "USER_MODULE_ACCESS_UPDATED",
      action: "update",
      entity_type: "user",
      entity_id: userId,
      summary: `Module access updated for user ${userId}`,
      payload: {
        target_user_id: userId,
        school_id: schoolId,
        module_keys: moduleKeys,
      },
    });

    const refreshed = await getUserModuleAccess(userId, schoolId);

    return NextResponse.json({
      success: true,
      school_id: schoolId,
      module_access: refreshed,
    });
  } catch (error) {
    console.error(error);
    return apiError(error, "Failed to save user module access");
  }
}
