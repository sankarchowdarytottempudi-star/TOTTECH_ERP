import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";

export async function GET() {
  const moduleGuard = await requireSchoolModule("AI");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth =
    await requirePermission({
      module: "ai",
      action: "view_health",
    });

  if (auth.response) {
    return auth.response;
  }

  const checks =
    await prisma.ai_health_checks.findMany({
      orderBy: {
        checked_at: "desc",
      },
      take: 100,
    });

  return NextResponse.json({
    checks,
  });
}
