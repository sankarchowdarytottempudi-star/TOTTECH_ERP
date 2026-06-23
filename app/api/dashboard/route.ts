import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolvePlatformContext } from "@/lib/api/context";

export async function GET(
  request: Request
) {
  try {

    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;

    const [rows, trendRows] =
      await Promise.all([
      prisma.$queryRawUnsafe<
        Record<string, number>[]
      >(
        `
        SELECT
          (SELECT COUNT(*)::int FROM schools sch WHERE ($1::int IS NULL OR sch.id = $1::int)) AS schools,
          (SELECT COUNT(*)::int FROM students s WHERE ($1::int IS NULL OR s.school_id = $1::int) AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)) AS students,
          (SELECT COUNT(*)::int FROM teachers t WHERE ($1::int IS NULL OR t.school_id = $1::int) AND ($2::int IS NULL OR t.academic_year_id = $2::int OR t.academic_year_id IS NULL)) AS teachers,
          (SELECT COUNT(*)::int FROM attendance_master am WHERE ($1::int IS NULL OR am.school_id = $1::int) AND ($2::int IS NULL OR am.academic_year_id = $2::int OR am.academic_year_id IS NULL)) AS attendance,
          (SELECT COUNT(*)::int FROM classes c WHERE ($1::int IS NULL OR c.school_id = $1::int) AND ($2::int IS NULL OR c.academic_year_id = $2::int OR c.academic_year_id IS NULL)) AS classes,
          (SELECT COUNT(*)::int FROM subjects sub WHERE ($1::int IS NULL OR sub.school_id = $1::int) AND ($2::int IS NULL OR sub.academic_year_id = $2::int OR sub.academic_year_id IS NULL)) AS subjects,
          (SELECT COUNT(*)::int FROM sections sec WHERE ($1::int IS NULL OR sec.school_id = $1::int) AND ($2::int IS NULL OR sec.academic_year_id = $2::int OR sec.academic_year_id IS NULL)) AS sections,
          (SELECT COUNT(*)::int FROM student_marks_entry sme WHERE ($1::int IS NULL OR sme.school_id = $1::int) AND ($2::int IS NULL OR sme.academic_year_id = $2::int OR sme.academic_year_id IS NULL)) AS marks_entries
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<
        {
          month: string;
          students: number;
          new_students: number;
        }[]
      >(
        `
        WITH months AS (
          SELECT generate_series(
            date_trunc('month', CURRENT_DATE) - interval '5 months',
            date_trunc('month', CURRENT_DATE),
            interval '1 month'
          ) AS month_start
        )
        SELECT
          to_char(m.month_start, 'Mon') AS month,
          COUNT(s.id) FILTER (
            WHERE COALESCE(s.created_at, CURRENT_TIMESTAMP) < m.month_start + interval '1 month'
          )::int AS students,
          COUNT(s.id) FILTER (
            WHERE date_trunc('month', COALESCE(s.created_at, CURRENT_TIMESTAMP)) = m.month_start
          )::int AS new_students
        FROM months m
        LEFT JOIN students s
          ON ($1::int IS NULL OR s.school_id = $1::int)
          AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)
        GROUP BY m.month_start
        ORDER BY m.month_start ASC
        `,
        schoolId,
        academicYearId
      ),
    ]);

    const counts =
      rows[0] || {};
    const schools =
      Number(counts.schools || 0);
    const students =
      Number(counts.students || 0);
    const teachers =
      Number(counts.teachers || 0);
    const attendance =
      Number(counts.attendance || 0);
    const classes =
      Number(counts.classes || 0);
    const subjects =
      Number(counts.subjects || 0);
    const sections =
      Number(counts.sections || 0);
    const marksEntries =
      Number(
        counts.marks_entries || 0
      );

    const campusHealth =
      Math.min(
        100,
        Math.round(
          (
            (students > 0 ? 25 : 0) +
            (teachers > 0 ? 25 : 0) +
            (attendance > 0 ? 25 : 0) +
            (marksEntries > 0 ? 25 : 0)
          )
        )
      );

    return NextResponse.json({

      students,
      teachers,
      schools,
      classes,
      subjects,
      sections,
      attendance,
      marksEntries,
      campusHealth,
      studentGrowthTrend:
        trendRows.map((row) => ({
          month: row.month,
          students:
            Number(row.students || 0),
          newStudents:
            Number(row.new_students || 0),
        })),
      context: {
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        all_schools:
          context.allSchools,
        all_years:
          context.allYears,
      },

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Dashboard Error",
      },
      {
        status: 500,
      }
    );

  }
}
