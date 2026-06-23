import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth =
    await requirePermission({
      module: "operations",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const schoolWhere =
    await scopedSchoolWhere(
      auth.user
    );

  const [events, auditLogs] =
    await Promise.all([
      prisma.event_ledger.findMany({
        where: schoolWhere,
        orderBy: {
          occurred_at: "desc",
        },
        take: 100,
      }),
      prisma.audit_logs.findMany({
        where: schoolWhere,
        orderBy: {
          created_at: "desc",
        },
        take: 100,
      }),
    ]);

  return NextResponse.json({
    events,
    auditLogs,
  });
}
