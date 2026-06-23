import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth = await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const schoolId =
    auth.user?.school_id ?? null;
  const [mealPlans, permissions] =
    await Promise.all([
      prisma.$queryRawUnsafe(
        `
        SELECT *
        FROM dining_meal_plans
        WHERE ($1::int IS NULL OR school_id = $1::int)
        ORDER BY created_at DESC
        LIMIT 100
        `,
        schoolId
      ),
      prisma.permissions.findMany({
        where: {
          module_name: "DINING",
        },
        orderBy: {
          action_name: "asc",
        },
      }),
    ]);

  return NextResponse.json({
    mealPlans,
    permissions,
    governance:
      "Meal plan access is controlled through DINING permissions and feature flags.",
  });
}
