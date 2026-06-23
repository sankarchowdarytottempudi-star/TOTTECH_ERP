import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  getGovernanceSnapshot,
  requireCurrentUser,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth = await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const schoolWhere =
    await scopedSchoolWhere(auth.user);
  const schoolId =
    auth.user?.school_id ?? null;

  const [
    school,
    governance,
    students,
    teachers,
    attendance,
    fees,
    payments,
    events,
    health,
    aiUsage,
  ] = await Promise.all([
    schoolId
      ? prisma.schools.findUnique({
          where: {
            id: schoolId,
          },
        })
      : prisma.schools.findFirst({
          orderBy: {
            id: "asc",
          },
        }),
    getGovernanceSnapshot(auth.user!),
    prisma.students.count({
      where: schoolWhere,
    }),
    prisma.teachers.count({
      where: schoolWhere,
    }),
    prisma.attendance_master.count({
      where: schoolWhere,
    }),
    prisma.fees.aggregate({
      where: schoolWhere,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.fee_payments.aggregate({
      where: schoolWhere,
      _sum: {
        paid_amount: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.event_ledger.findMany({
      where: schoolWhere,
      orderBy: {
        occurred_at: "desc",
      },
      take: 20,
    }),
    prisma.operation_health_checks.findMany({
      orderBy: {
        checked_at: "desc",
      },
      take: 10,
    }),
    prisma.ai_usage_logs.aggregate({
      where: schoolWhere,
      _sum: {
        estimated_cost: true,
        input_tokens: true,
        output_tokens: true,
      },
      _count: {
        id: true,
      },
    }),
  ]);

  return NextResponse.json({
    product: "TOTTECH ONE",
    tagline: "Gateway To Learning",
    user: auth.user,
    school,
    academicYear:
      governance.activeAcademicYear,
    governance,
    kpis: {
      students,
      teachers,
      attendanceRecords: attendance,
      feeStructures:
        fees._count.id,
      totalFees:
        Number(fees._sum.amount ?? 0),
      totalCollected:
        Number(
          payments._sum.paid_amount ?? 0
        ),
      paymentRecords:
        payments._count.id,
      aiCalls: aiUsage._count.id,
      aiEstimatedCost:
        Number(
          aiUsage._sum.estimated_cost ?? 0
        ),
    },
    events,
    health,
    mobile: {
      source:
        "APK-proven school/college-os context",
      supportsOfflineDrafts: true,
      supportsSchoolSwitching: true,
    },
  });
}
