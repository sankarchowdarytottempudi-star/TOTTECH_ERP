import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  MODULE_KEYS,
  SchoolModuleKey,
  modulesForPlan,
  normalizeModuleKey,
} from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";
import {
  isSuperAdminRole,
} from "@/lib/school-access";

function forbidden() {
  return NextResponse.json(
    {
      error:
        "Only SUPER_ADMIN can manage school subscription entitlements.",
    },
    {
      status: 403,
    }
  );
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (!isSuperAdminRole(user.role)) {
    return forbidden();
  }

  const schools =
    await prisma.schools.findMany({
      select: {
        id: true,
        school_name: true,
        school_code: true,
        email: true,
        phone: true,
        owner_name: true,
        owner_contact: true,
        subscription_plan: true,
        subscription_status: true,
        is_active: true,
        updated_at: true,
        created_at: true,
        school_module_access: {
          select: {
            module_key: true,
            enabled: true,
            enabled_at: true,
            enabled_by: true,
            updated_at: true,
          },
          orderBy: {
            module_key: "asc",
          },
        },
      },
      orderBy: {
        school_name: "asc",
      },
    });

  for (const school of schools) {
    const existing = new Set(
      school.school_module_access.map((row) =>
        String(row.module_key)
      )
    );
    const defaults = new Set(
      modulesForPlan(
        school.subscription_plan
      )
    );

    for (const moduleKey of MODULE_KEYS) {
      if (!existing.has(moduleKey)) {
        await prisma.school_module_access.create({
          data: {
            school_id: school.id,
            module_key: moduleKey,
            enabled: defaults.has(moduleKey),
            enabled_at: defaults.has(moduleKey)
              ? new Date()
              : null,
            enabled_by:
              Number(user.id) || null,
          },
        });
      }
    }
  }

  const refreshed =
    await prisma.schools.findMany({
      select: {
        id: true,
        school_name: true,
        school_code: true,
        email: true,
        phone: true,
        owner_name: true,
        owner_contact: true,
        subscription_plan: true,
        subscription_status: true,
        is_active: true,
        updated_at: true,
        created_at: true,
        school_module_access: {
          select: {
            module_key: true,
            enabled: true,
            enabled_at: true,
            updated_at: true,
          },
          orderBy: {
            module_key: "asc",
          },
        },
      },
      orderBy: {
        school_name: "asc",
      },
    });

  return NextResponse.json({
    moduleKeys: MODULE_KEYS,
    planDefaults: {
      STARTER: modulesForPlan("STARTER"),
      PROFESSIONAL:
        modulesForPlan("PROFESSIONAL"),
      ENTERPRISE:
        modulesForPlan("ENTERPRISE"),
      CUSTOM: modulesForPlan("CUSTOM"),
    },
    schools: refreshed,
  });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (!isSuperAdminRole(user.role)) {
    return forbidden();
  }

  const body = await request.json();
  const schoolId = Number(
    body.school_id || body.schoolId
  );

  if (!schoolId) {
    return NextResponse.json(
      {
        error: "A valid school is required.",
      },
      {
        status: 400,
      }
    );
  }

  const plan = String(
    body.plan ||
      body.subscription_plan ||
      "CUSTOM"
  )
    .trim()
    .toUpperCase();
  const requestedModules: unknown[] = Array.isArray(
    body.enabled_modules
  )
    ? body.enabled_modules
    : [];
  const enabledModules = new Set(
    requestedModules
      .map(normalizeModuleKey)
      .filter(
        (
          value
        ): value is SchoolModuleKey =>
          Boolean(value)
      )
  );

  const finalEnabled =
    plan === "CUSTOM"
      ? enabledModules
      : new Set(modulesForPlan(plan));

  await prisma.$transaction(async (tx) => {
    await tx.schools.update({
      where: {
        id: schoolId,
      },
      data: {
        subscription_plan: plan,
        subscription_status:
          body.subscription_status ||
          "ACTIVE",
        updated_by:
          Number(user.id) || null,
        updated_at: new Date(),
      },
    });

    for (const moduleKey of MODULE_KEYS) {
      const enabled =
        finalEnabled.has(moduleKey);

      await tx.school_module_access.upsert({
        where: {
          school_id_module_key: {
            school_id: schoolId,
            module_key: moduleKey,
          },
        },
        create: {
          school_id: schoolId,
          module_key: moduleKey,
          enabled,
          enabled_by:
            Number(user.id) || null,
          enabled_at: enabled
            ? new Date()
            : null,
          updated_at: new Date(),
        },
        update: {
          enabled,
          enabled_by:
            Number(user.id) || null,
          enabled_at: enabled
            ? new Date()
            : null,
          updated_at: new Date(),
        },
      });
    }

    await tx.audit_logs.create({
      data: {
        school_id: schoolId,
        user_id: Number(user.id) || null,
        action_type:
          "SCHOOL_MODULE_ACCESS_UPDATED",
        action_details: JSON.stringify({
          plan,
          enabled_modules:
            Array.from(finalEnabled),
        }),
      },
    });
  });

  return NextResponse.json({
    success: true,
    school_id: schoolId,
    plan,
    enabled_modules: Array.from(
      finalEnabled
    ),
  });
}
