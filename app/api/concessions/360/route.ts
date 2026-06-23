import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth = await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const where =
    await scopedSchoolWhere(auth.user);
  const [
    requests,
    byStatus,
    auditRows,
  ] = await Promise.all([
    prisma.concession_requests.findMany({
      where,
      orderBy: {
        requested_at: "desc",
      },
      take: 100,
    }),
    prisma.concession_requests.groupBy({
      by: ["status"],
      where,
      _count: {
        id: true,
      },
      _sum: {
        requested_amount: true,
        approved_amount: true,
      },
    }),
    prisma.concession_audit_logs.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    }),
  ]);

  return NextResponse.json({
    requests,
    byStatus,
    auditRows,
    workflow: {
      request:
        "student/guardian concession request",
      approval:
        "review, approve/reject, audit",
      source:
        "APK-proven concession 360",
    },
  });
}
