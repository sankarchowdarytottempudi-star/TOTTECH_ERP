import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
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

  const [
    checks,
    schools,
    students,
    teachers,
    events,
  ] = await Promise.all([
    prisma.operation_health_checks.findMany({
      orderBy: {
        checked_at: "desc",
      },
      take: 50,
    }),
    prisma.schools.count(),
    prisma.students.count(),
    prisma.teachers.count(),
    prisma.event_ledger.count(),
  ]);

  return NextResponse.json({
    status: "ONLINE",
    checks,
    counts: {
      schools,
      students,
      teachers,
      events,
    },
  });
}
