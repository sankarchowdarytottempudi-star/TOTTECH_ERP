import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth = await requirePermission({
    module: "operations",
    action: "read",
  });

  if (auth.response) {
    return auth.response;
  }

  const schoolId =
    auth.user?.school_id ?? null;
  const [
    studentsWithoutYear,
    teachersWithoutYear,
    duplicateCurrentYears,
    pendingPromotions,
    pendingFinanceApprovals,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<
      { count: number }[]
    >(
      `
      SELECT COUNT(*)::int AS count
      FROM students
      WHERE academic_year_id IS NULL
        AND ($1::int IS NULL OR school_id = $1::int)
      `,
      schoolId
    ),
    prisma.$queryRawUnsafe<
      { count: number }[]
    >(
      `
      SELECT COUNT(*)::int AS count
      FROM teachers
      WHERE academic_year_id IS NULL
        AND ($1::int IS NULL OR school_id = $1::int)
      `,
      schoolId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT school_id, COUNT(*)::int AS current_years
      FROM academic_years
      WHERE is_current = true
        AND ($1::int IS NULL OR school_id = $1::int)
      GROUP BY school_id
      HAVING COUNT(*) > 1
      `,
      schoolId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*)::int AS count
      FROM promotion_workflows
      WHERE approval_status = 'PENDING'
        AND ($1::int IS NULL OR school_id = $1::int)
      `,
      schoolId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*)::int AS count
      FROM finance_approval_ledger
      WHERE status = 'PENDING'
        AND ($1::int IS NULL OR school_id = $1::int)
      `,
      schoolId
    ),
  ]);

  const studentGapCount =
    studentsWithoutYear[0]?.count ?? 0;
  const teacherGapCount =
    teachersWithoutYear[0]?.count ?? 0;

  return NextResponse.json({
    status:
      studentGapCount === 0 &&
      teacherGapCount === 0
        ? "HEALTHY"
        : "NEEDS_ATTENTION",
    checks: {
      studentsWithoutYear:
        studentGapCount,
      teachersWithoutYear:
        teacherGapCount,
      duplicateCurrentYears,
      pendingPromotions,
      pendingFinanceApprovals,
    },
  });
}
