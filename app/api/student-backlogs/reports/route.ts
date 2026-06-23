import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { apiError } from "@/lib/api/errors";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";

const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function GET(request: Request) {
  try {
    const guard = await requireSchoolModule("STUDENTS");
    if (guard.response) {
      return guard.response;
    }

    const context = await resolvePlatformContext(request);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const schoolId =
      numberOrNull(searchParams?.get("school_id")) ??
      context.schoolId ??
      null;
    const academicYearId =
      numberOrNull(searchParams?.get("academic_year_id")) ??
      context.academicYearId ??
      null;
    const classId = numberOrNull(searchParams?.get("class_id"));
    const sectionId = numberOrNull(searchParams?.get("section_id"));

    const summary = await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        COUNT(*)::int AS total_backlogs,
        COUNT(DISTINCT sb.student_id)::int AS students_with_backlogs,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') = 'CLEARED')::int AS cleared_backlogs,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') <> 'CLEARED')::int AS pending_backlogs
      FROM student_backlogs sb
      LEFT JOIN students s ON s.id = sb.student_id
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
        AND ($2::int IS NULL OR sb.academic_year_id = $2::int)
        AND ($3::int IS NULL OR COALESCE(s.current_class_id, s.section_id) = $3::int)
        AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id) = $4::int)
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId
    );

    const rows = await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        sb.id,
        sb.student_id,
        sb.school_id,
        sb.academic_year_id,
        sb.subject_id,
        sb.exam_id,
        sb.backlog_status,
        sb.backlog_reason,
        sb.cleared_date,
        sb.remarks,
        COALESCE(NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.middle_name, '') || ' ' || COALESCE(s.last_name, '')), ''), s.name) AS student_name,
        COALESCE(c.class_name, 'Unassigned') AS class_name,
        COALESCE(sec.section_name, 'Unassigned') AS section_name,
        COALESCE(sub.subject_name, 'Unassigned') AS subject_name,
        COALESCE(ex.exam_name, 'Unassigned') AS exam_name,
        COALESCE(ay.academic_year, 'Unassigned') AS academic_year,
        COALESCE(sch.school_name, 'Unassigned') AS school_name
      FROM student_backlogs sb
      LEFT JOIN students s ON s.id = sb.student_id
      LEFT JOIN schools sch ON sch.id = sb.school_id
      LEFT JOIN academic_years ay ON ay.id = sb.academic_year_id
      LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, s.section_id)
      LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id)
      LEFT JOIN subjects sub ON sub.id = sb.subject_id
      LEFT JOIN exams ex ON ex.id = sb.exam_id
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
        AND ($2::int IS NULL OR sb.academic_year_id = $2::int)
        AND ($3::int IS NULL OR COALESCE(s.current_class_id, s.section_id) = $3::int)
        AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id) = $4::int)
      ORDER BY sb.created_at DESC, sb.id DESC
      LIMIT 500
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId
    );

    const byClass = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `
      SELECT
        COALESCE(c.class_name, 'Unassigned') AS class_name,
        COUNT(sb.id)::int AS backlog_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') = 'CLEARED')::int AS cleared_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') <> 'CLEARED')::int AS pending_count
      FROM student_backlogs sb
      LEFT JOIN students s ON s.id = sb.student_id
      LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, s.section_id)
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
        AND ($2::int IS NULL OR sb.academic_year_id = $2::int)
      GROUP BY COALESCE(c.class_name, 'Unassigned')
      ORDER BY backlog_count DESC, class_name ASC
      `,
      schoolId,
      academicYearId
    );

    const bySubject = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `
      SELECT
        COALESCE(sub.subject_name, 'Unassigned') AS subject_name,
        COUNT(sb.id)::int AS backlog_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') = 'CLEARED')::int AS cleared_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') <> 'CLEARED')::int AS pending_count
      FROM student_backlogs sb
      LEFT JOIN subjects sub ON sub.id = sb.subject_id
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
        AND ($2::int IS NULL OR sb.academic_year_id = $2::int)
      GROUP BY COALESCE(sub.subject_name, 'Unassigned')
      ORDER BY backlog_count DESC, subject_name ASC
      `,
      schoolId,
      academicYearId
    );

    const bySchool = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `
      SELECT
        COALESCE(sch.school_name, 'Unassigned') AS school_name,
        COUNT(sb.id)::int AS backlog_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') = 'CLEARED')::int AS cleared_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') <> 'CLEARED')::int AS pending_count
      FROM student_backlogs sb
      LEFT JOIN schools sch ON sch.id = sb.school_id
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
        AND ($2::int IS NULL OR sb.academic_year_id = $2::int)
      GROUP BY COALESCE(sch.school_name, 'Unassigned')
      ORDER BY backlog_count DESC, school_name ASC
      `,
      schoolId,
      academicYearId
    );

    const byAcademicYear = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `
      SELECT
        COALESCE(ay.academic_year, 'Unassigned') AS academic_year,
        COUNT(sb.id)::int AS backlog_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') = 'CLEARED')::int AS cleared_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') <> 'CLEARED')::int AS pending_count
      FROM student_backlogs sb
      LEFT JOIN academic_years ay ON ay.id = sb.academic_year_id
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
      GROUP BY COALESCE(ay.academic_year, 'Unassigned')
      ORDER BY backlog_count DESC, academic_year ASC
      `,
      schoolId
    );

    return NextResponse.json({
      summary: summary[0] || {},
      rows,
      byClass,
      bySubject,
      bySchool,
      byAcademicYear,
      context,
    });
  } catch (error) {
    return apiError(error, "Failed to load backlog reports");
  }
}
