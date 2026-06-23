import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  getGovernanceSnapshot,
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
      action: "manage",
    });

  if (auth.response) {
    return auth.response;
  }

  const [
    snapshot,
    policies,
    limits,
  ] = await Promise.all([
    getGovernanceSnapshot(
      auth.user!
    ),
    prisma.ai_policy_profiles.findMany({
      orderBy: {
        id: "asc",
      },
    }),
    prisma.ai_school_limits.findMany({
      orderBy: {
        school_id: "asc",
      },
    }),
  ]);

  return NextResponse.json({
    snapshot,
    policies,
    limits,
  });
}
