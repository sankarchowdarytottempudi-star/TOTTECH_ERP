import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { apiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (
  value: string | null
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

export async function GET(
  request: Request
) {
  try {
    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json({
        rows: [],
        summary: null,
      });
    }

    const { searchParams } =
      new URL(request.url);
    const examScheduleId =
      toNumber(
        searchParams?.get(
          "exam_schedule_id"
        )
      );

    if (!examScheduleId) {
      return NextResponse.json({
        rows: [],
        summary: null,
      });
    }

    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        WITH student_totals AS (
          SELECT
            sme.student_id,
            COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.middle_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
            s.admission_number,
            COALESCE(s.roll_number, sye.roll_number) AS student_roll_number,
            c.class_name,
            sec.section_name,
            SUM(COALESCE(sme.obtained_marks,0))::numeric AS obtained_marks,
            SUM(COALESCE(sme.max_marks,0))::numeric AS max_marks,
            CASE
              WHEN SUM(COALESCE(sme.max_marks,0)) > 0
              THEN ROUND((SUM(COALESCE(sme.obtained_marks,0)) / SUM(COALESCE(sme.max_marks,0))) * 100, 2)
              ELSE 0
            END AS percentage
          FROM student_marks_entry sme
          LEFT JOIN students s ON s.id = sme.student_id
          LEFT JOIN student_year_enrollments sye
            ON sye.student_id = s.id
            AND ($3::int IS NULL OR sye.academic_year_id = $3::int)
          LEFT JOIN classes c ON c.id = COALESCE(sme.class_id, s.current_class_id, sye.class_id)
          LEFT JOIN sections sec ON sec.id = COALESCE(sme.section_id, s.current_section_id, s.section_id, sye.section_id)
          WHERE sme.exam_schedule_id = $1::int
            AND ($2::int IS NULL OR COALESCE(sme.school_id, s.school_id) = $2::int)
            AND ($3::int IS NULL OR sme.academic_year_id = $3::int OR sme.academic_year_id IS NULL)
          GROUP BY sme.student_id, student_name, s.admission_number, student_roll_number, c.class_name, sec.section_name
        )
        SELECT
          *,
          CASE
            WHEN percentage >= 90 THEN 'A+'
            WHEN percentage >= 80 THEN 'A'
            WHEN percentage >= 70 THEN 'B'
            WHEN percentage >= 60 THEN 'C'
            WHEN percentage >= 50 THEN 'D'
            WHEN percentage >= 35 THEN 'E'
            ELSE 'F'
          END AS grade
        FROM student_totals
        ORDER BY percentage DESC, student_name ASC
        `,
        examScheduleId,
        context.schoolId,
        context.academicYearId
      );

    const percentages = rows.map((row) =>
      Number(row.percentage || 0)
    );
    const highest = rows[0] || null;
    const lowest =
      rows.length > 0
        ? rows[rows.length - 1]
        : null;
    const average =
      percentages.length > 0
        ? percentages.reduce(
            (sum, item) => sum + item,
            0
          ) / percentages.length
        : 0;

    return NextResponse.json({
      rows,
      summary: {
        student_count: rows.length,
        class_name:
          highest?.class_name ||
          lowest?.class_name ||
          null,
        section_name:
          highest?.section_name ||
          lowest?.section_name ||
          null,
        highest,
        lowest,
        average_percentage:
          Math.round(average * 100) / 100,
      },
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load marks analytics"
    );
  }
}
