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
      action:
        "view_observability",
    });

  if (auth.response) {
    return auth.response;
  }

  const where =
    await scopedSchoolWhere(
      auth.user
    );

  const [
    events,
    usage,
    knowledgeQueries,
    actionRequests,
    approvals,
    usageAggregate,
    actionStatus,
  ] = await Promise.all([
    prisma.ai_observability_events.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      take: 200,
    }),
    prisma.ai_usage_logs.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    }),
    prisma.ai_knowledge_queries.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    }),
    prisma.ai_action_requests.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    }),
    prisma.ai_action_approvals.findMany({
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
      _avg: {
        latency_ms: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.ai_action_requests.groupBy({
      by: ["status"],
      where,
      _count: {
        id: true,
      },
    }),
  ]);

  return NextResponse.json({
    summary: {
      usage: usageAggregate,
      actionsByStatus:
        actionStatus,
      observedEvents:
        events.length,
      knowledgeQueries:
        knowledgeQueries.length,
      approvals:
        approvals.length,
    },
    events,
    usage,
    knowledgeQueries,
    actionRequests,
    approvals,
  });
}
