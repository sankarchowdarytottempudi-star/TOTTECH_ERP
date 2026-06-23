import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { resolvePlatformContext } from "@/lib/api/context";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";

type CountRow = {
  count: bigint;
};

type SumRow = {
  total: string | number | null;
};

const firstCount = (
  rows: CountRow[]
) =>
  rows[0]?.count
    ? Number(rows[0].count)
    : 0;

const firstMoney = (
  rows: SumRow[]
) => Number(rows[0]?.total ?? 0);

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const schoolId = Number(id);
  const platformContext =
    await resolvePlatformContext(
      request
    );

  if (!platformContext) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (
    !platformContext.allSchools &&
    platformContext.schoolId &&
    platformContext.schoolId !== schoolId
  ) {
    return NextResponse.json(
      {
        error:
          "You can only view your selected school.",
      },
      {
        status: 403,
      }
    );
  }

  const academicYearId =
    platformContext.academicYearId;
  const yearWhere = academicYearId
    ? {
        OR: [
          {
            academic_year_id:
              academicYearId,
          },
          {
            academic_year_id: null,
          },
        ],
      }
    : {};

  const [
    school,
    currentYear,
    students,
    teachers,
    attendance,
    invoices,
    revenue,
    payments,
    dining,
    transport,
    hostel,
    aiUsage,
    whatsapp,
    timeline,
    events,
  ] = await Promise.all([
    prisma.schools.findUnique({
      where: {
        id: schoolId,
      },
    }),
    prisma.academic_years.findFirst({
      where: academicYearId
        ? {
            id: academicYearId,
          }
        : {
            school_id: schoolId,
            is_current: true,
          },
      orderBy: {
        id: "desc",
      },
    }),
    prisma.students.count({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
    }),
    prisma.teachers.count({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
    }),
    prisma.attendance_master.count({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
    }),
    prisma.$queryRaw<CountRow[]>`
      SELECT count(*)::bigint AS count
      FROM invoices i
      JOIN students s ON s.id = i.student_id
      WHERE s.school_id = ${schoolId}
        AND (${academicYearId}::int IS NULL OR i.academic_year_id = ${academicYearId}::int OR i.academic_year_id IS NULL)
    `,
    prisma.$queryRaw<SumRow[]>`
      SELECT COALESCE(sum(total_amount), 0) AS total
      FROM invoices i
      JOIN students s ON s.id = i.student_id
      WHERE s.school_id = ${schoolId}
        AND (${academicYearId}::int IS NULL OR i.academic_year_id = ${academicYearId}::int OR i.academic_year_id IS NULL)
    `,
    prisma.$queryRaw<SumRow[]>`
      SELECT COALESCE(sum(amount), 0) AS total
      FROM payments p
      JOIN students s ON s.id = p.student_id
      WHERE s.school_id = ${schoolId}
        AND (${academicYearId}::int IS NULL OR p.academic_year_id = ${academicYearId}::int OR p.academic_year_id IS NULL)
    `,
    prisma.dining_attendance.count({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
    }),
    prisma.transport_attendance.count({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
    }),
    prisma.hostel_attendance.count({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
    }),
    prisma.ai_usage_logs.count({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
    }),
    prisma.whatsapp_metering.findMany({
      where: {
        school_id: schoolId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 12,
    }),
    prisma.school_timelines.findMany({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
      orderBy: {
        occurred_at: "desc",
      },
      take: 50,
    }),
    prisma.event_ledger.findMany({
      where: {
        school_id: schoolId,
        ...yearWhere,
      },
      orderBy: {
        occurred_at: "desc",
      },
      take: 100,
    }),
  ]);

  const revenueAmount =
    firstMoney(revenue);
  const collectedAmount =
    firstMoney(payments);

  return NextResponse.json({
    school,
    currentYear,
    context: {
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      all_years:
        platformContext.allYears,
    },
    kpis: {
      students,
      teachers,
      attendance,
      invoices:
        firstCount(invoices),
      revenue: revenueAmount,
      collected:
        collectedAmount,
      pending:
        revenueAmount -
        collectedAmount,
      profitability:
        revenueAmount > 0
          ? Math.round(
              (collectedAmount /
                revenueAmount) *
                100
            )
          : 0,
      dining,
      transport,
      hostel,
      aiUsage,
      whatsappUsage:
        whatsapp.reduce(
          (sum, row) =>
            sum +
            Number(
              row.messages_sent ?? 0
            ),
          0
        ),
      academicHealth:
        attendance > 0
          ? 82
          : 50,
      operationalHealth:
        Math.round(
          ([
            dining,
            transport,
            hostel,
          ].filter(
            (value) =>
              value > 0
          ).length /
            3) *
            100
        ),
    },
    riskAlerts: events
      .filter(
        (event) =>
          event.severity ===
            "ERROR" ||
          event.severity ===
            "WARN"
      )
      .slice(0, 20),
    timeline,
    eventLedger: events,
  });
}
