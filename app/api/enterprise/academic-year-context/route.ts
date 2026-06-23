import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";

type CountRow = {
  academic_year_id: number | null;
  label: string | null;
  rows: bigint | number;
};

const toNumber = (
  value: bigint | number | null
) =>
  typeof value === "bigint"
    ? Number(value)
    : value ?? 0;

export async function GET() {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const schoolScope =
    await scopedSchoolWhere(
      auth.user
    );
  const schoolId =
    "school_id" in schoolScope
      ? schoolScope.school_id
      : auth.user?.school_id ?? null;

  const [
    years,
    currentYear,
    studentCounts,
    attendanceCounts,
    financeCounts,
    diningCounts,
    hostelCounts,
    transportCounts,
  ] = await Promise.all([
    prisma.academic_years.findMany({
      where:
        schoolId && schoolId > 0
          ? { school_id: schoolId }
          : {},
      orderBy: {
        start_date: "desc",
      },
    }),
    prisma.academic_years.findFirst({
      where:
        schoolId && schoolId > 0
          ? {
              school_id: schoolId,
              is_current: true,
            }
          : {
              is_current: true,
            },
      orderBy: {
        id: "desc",
      },
    }),
    prisma.$queryRaw<CountRow[]>`
      SELECT s.academic_year_id, ay.academic_year AS label, count(*) AS rows
      FROM students s
      LEFT JOIN academic_years ay ON ay.id = s.academic_year_id
      WHERE (${schoolId}::int IS NULL OR ${schoolId}::int <= 0 OR s.school_id = ${schoolId}::int)
      GROUP BY s.academic_year_id, ay.academic_year
      ORDER BY ay.academic_year DESC NULLS LAST
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT a.academic_year_id, ay.academic_year AS label, count(*) AS rows
      FROM attendance_master a
      LEFT JOIN academic_years ay ON ay.id = a.academic_year_id
      WHERE (${schoolId}::int IS NULL OR ${schoolId}::int <= 0 OR a.school_id = ${schoolId}::int)
      GROUP BY a.academic_year_id, ay.academic_year
      ORDER BY ay.academic_year DESC NULLS LAST
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT i.academic_year_id, ay.academic_year AS label, count(*) AS rows
      FROM invoices i
      LEFT JOIN academic_years ay ON ay.id = i.academic_year_id
      LEFT JOIN students s ON s.id = i.student_id
      WHERE (${schoolId}::int IS NULL OR ${schoolId}::int <= 0 OR s.school_id = ${schoolId}::int)
      GROUP BY i.academic_year_id, ay.academic_year
      ORDER BY ay.academic_year DESC NULLS LAST
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT d.academic_year_id, ay.academic_year AS label, count(*) AS rows
      FROM dining_attendance d
      LEFT JOIN academic_years ay ON ay.id = d.academic_year_id
      WHERE (${schoolId}::int IS NULL OR ${schoolId}::int <= 0 OR d.school_id = ${schoolId}::int)
      GROUP BY d.academic_year_id, ay.academic_year
      ORDER BY ay.academic_year DESC NULLS LAST
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT h.academic_year_id, ay.academic_year AS label, count(*) AS rows
      FROM hostel_attendance h
      LEFT JOIN academic_years ay ON ay.id = h.academic_year_id
      WHERE (${schoolId}::int IS NULL OR ${schoolId}::int <= 0 OR h.school_id = ${schoolId}::int)
      GROUP BY h.academic_year_id, ay.academic_year
      ORDER BY ay.academic_year DESC NULLS LAST
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT t.academic_year_id, ay.academic_year AS label, count(*) AS rows
      FROM transport_attendance t
      LEFT JOIN academic_years ay ON ay.id = t.academic_year_id
      WHERE (${schoolId}::int IS NULL OR ${schoolId}::int <= 0 OR t.school_id = ${schoolId}::int)
      GROUP BY t.academic_year_id, ay.academic_year
      ORDER BY ay.academic_year DESC NULLS LAST
    `,
  ]);

  const normalizeCounts = (
    rows: CountRow[]
  ) =>
    rows.map((row) => ({
      academic_year_id:
        row.academic_year_id,
      label: row.label,
      rows: toNumber(row.rows),
    }));

  return NextResponse.json({
    academicYearRule: {
      starts: "June 1",
      ends: "May 31",
      examples: [
        "2025-2026",
        "2026-2027",
        "2027-2028",
      ],
    },
    currentYear,
    years,
    countsByYear: {
      students:
        normalizeCounts(
          studentCounts
        ),
      attendance:
        normalizeCounts(
          attendanceCounts
        ),
      finance:
        normalizeCounts(
          financeCounts
        ),
      dining:
        normalizeCounts(
          diningCounts
        ),
      hostel:
        normalizeCounts(
          hostelCounts
        ),
      transport:
        normalizeCounts(
          transportCounts
        ),
    },
  });
}
