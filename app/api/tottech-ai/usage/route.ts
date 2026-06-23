import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  scopedSchoolWhere,
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
      action: "view_usage",
    });

  if (auth.response) {
    return auth.response;
  }

  const where =
    await scopedSchoolWhere(
      auth.user
    );

  const [
    logs,
    aggregate,
  ] = await Promise.all([
    prisma.ai_usage_logs.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    }),
    prisma.ai_usage_logs.aggregate({
      where,
      _sum: {
        input_tokens: true,
        output_tokens: true,
        estimated_cost: true,
      },
      _count: {
        id: true,
      },
    }),
  ]);

  return NextResponse.json({
    summary: aggregate,
    logs,
  });
}
