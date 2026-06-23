import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { prisma } from "@/lib/prisma";
import { requireSchoolModule } from "@/lib/module-governance";

type Row = Record<string, unknown>;

const toNumber = (value: string | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

export async function GET(request: Request) {
  const guard = await requireSchoolModule("ACADEMICS");
  if (guard.response) {
    return guard.response;
  }

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const classId = toNumber(searchParams?.get("class_id"));
  const sectionId = toNumber(searchParams?.get("section_id"));

  if (!classId) {
    return NextResponse.json(
      { error: "class_id is required." },
      { status: 400 }
    );
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    WITH scoped_students AS (
      SELECT
        s.id,
        s.school_id,
        COALESCE(s.name, NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), 'Student ' || s.id::text) AS student_name,
        s.admission_number,
        COALESCE(s.current_class_id, sye.class_id) AS class_id,
        COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id,
        c.class_name,
        sec.section_name
      FROM students s
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
       AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
      LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
      LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
      WHERE ($1::int IS NULL OR s.school_id = $1::int)
        AND COALESCE(s.current_class_id, sye.class_id) = $3::int
        AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $4::int)
    ),
    marks_stats AS (
      SELECT
        student_id,
        CASE WHEN SUM(total_marks) > 0 THEN ROUND((SUM(obtained_marks)::numeric / SUM(total_marks)::numeric) * 100, 0) ELSE 0 END AS marks_percent
      FROM marks
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      GROUP BY student_id
    ),
    attendance_stats AS (
      SELECT
        student_id,
        CASE WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'PRESENT')::numeric / COUNT(*)::numeric) * 100, 0) ELSE 0 END AS attendance_percent
      FROM attendance_master
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      GROUP BY student_id
    ),
    homework_stats AS (
      SELECT
        student_id,
        CASE WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) IN ('SUBMITTED','COMPLETED','REVIEWED'))::numeric / COUNT(*)::numeric) * 100, 0) ELSE 0 END AS homework_percent
      FROM homework_submissions
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      GROUP BY student_id
    )
    SELECT
      ss.*,
      COALESCE(ms.marks_percent, 0)::int AS marks_percent,
      COALESCE(att.attendance_percent, 0)::int AS attendance_percent,
      COALESCE(hw.homework_percent, 0)::int AS homework_percent,
      ROUND((
        COALESCE(ms.marks_percent, 0) * 0.50 +
        COALESCE(att.attendance_percent, 0) * 0.30 +
        COALESCE(hw.homework_percent, 0) * 0.20
      ), 0)::int AS combined_score
    FROM scoped_students ss
    LEFT JOIN marks_stats ms ON ms.student_id = ss.id
    LEFT JOIN attendance_stats att ON att.student_id = ss.id
    LEFT JOIN homework_stats hw ON hw.student_id = ss.id
    ORDER BY combined_score DESC, student_name ASC
    `,
    context.schoolId,
    context.academicYearId,
    classId,
    sectionId
  );

  const top = rows.slice(0, 3);
  const bottom = [...rows]
    .sort(
      (a, b) =>
        Number(a.combined_score || 0) -
          Number(b.combined_score || 0) ||
        String(a.student_name || "").localeCompare(
          String(b.student_name || "")
        )
    )
    .slice(0, 3);

  const averages = rows.length
    ? rows.reduce<{
        marks: number;
        attendance: number;
        homework: number;
        combined: number;
      }>(
        (acc, row) => {
          acc.marks += Number(row.marks_percent || 0);
          acc.attendance += Number(row.attendance_percent || 0);
          acc.homework += Number(row.homework_percent || 0);
          acc.combined += Number(row.combined_score || 0);
          return acc;
        },
        { marks: 0, attendance: 0, homework: 0, combined: 0 }
      )
    : { marks: 0, attendance: 0, homework: 0, combined: 0 };

  return NextResponse.json({
    class_id: classId,
    section_id: sectionId,
    total: rows.length,
    top,
    bottom,
    averages: rows.length
      ? {
          marks: Math.round(averages.marks / rows.length),
          attendance: Math.round(averages.attendance / rows.length),
          homework: Math.round(averages.homework / rows.length),
          combined: Math.round(averages.combined / rows.length),
        }
      : {
          marks: 0,
          attendance: 0,
          homework: 0,
          combined: 0,
        },
  });
}
