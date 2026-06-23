import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { resolvePlatformContext } from "@/lib/api/context";
import { apiError } from "@/lib/api/errors";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";

const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

export async function GET(request: Request) {
  try {
    const moduleGuard = await requireSchoolModule("STUDENTS");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Login required." },
        { status: 401 }
      );
    }

    const context = await resolvePlatformContext(request);
    const { searchParams } = new URL(request.url);

    const schoolId =
      user.role === "SUPER_ADMIN"
        ? numberOrNull(searchParams?.get("school_id")) ??
          context?.schoolId ??
          null
        : (context?.schoolId ?? numberOrNull(user.school_id) ?? null);
    const academicYearId =
      numberOrNull(searchParams?.get("academic_year_id")) ??
      context?.academicYearId ??
      numberOrNull(user.academic_year_id) ?? null;
    const classId = numberOrNull(searchParams?.get("class_id"));
    const sectionId = numberOrNull(searchParams?.get("section_id"));
    const gender = String(searchParams?.get("gender") || "").trim();
    const from = searchParams?.get("from");
    const to = searchParams?.get("to");

    const rows = await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        COUNT(*) FILTER (WHERE COALESCE(s.student_status, CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'DROPOUT' END) = 'ACTIVE')::int AS active_count,
        COUNT(*) FILTER (WHERE COALESCE(s.student_status, CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'DROPOUT' END) = 'PROMOTED')::int AS promoted_count,
        COUNT(*) FILTER (WHERE COALESCE(s.student_status, CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'DROPOUT' END) = 'TRANSFERRED')::int AS transferred_count,
        COUNT(*) FILTER (WHERE COALESCE(s.student_status, CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'DROPOUT' END) = 'DROPOUT')::int AS dropout_count,
        COUNT(*) FILTER (WHERE COALESCE(s.student_status, CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'DROPOUT' END) = 'ALUMNI')::int AS alumni_count,
        COUNT(*) FILTER (WHERE COALESCE(s.student_status, CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'DROPOUT' END) = 'SUSPENDED')::int AS suspended_count,
        COUNT(*) FILTER (WHERE COALESCE(s.student_status, CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'DROPOUT' END) = 'GRADUATED')::int AS graduated_count
      FROM students s
      WHERE ($1::int IS NULL OR s.school_id = $1::int)
        AND ($2::int IS NULL OR s.academic_year_id = $2::int)
        AND ($3::int IS NULL OR s.current_class_id = $3::int)
        AND ($4::int IS NULL OR s.current_section_id = $4::int)
        AND ($5::text = '' OR UPPER(COALESCE(s.gender, '')) = UPPER($5::text))
        AND ($6::date IS NULL OR COALESCE(s.status_updated_at::date, s.updated_at::date, s.created_at::date) >= $6::date)
        AND ($7::date IS NULL OR COALESCE(s.status_updated_at::date, s.updated_at::date, s.created_at::date) <= $7::date)
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId,
      gender,
      from ? new Date(from) : null,
      to ? new Date(to) : null
    );

    const backlogRows = await prisma.$queryRawUnsafe<
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
      LEFT JOIN classes c ON c.id = s.current_class_id
      LEFT JOIN sections sec ON sec.id = s.current_section_id
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
        AND ($2::int IS NULL OR sb.academic_year_id = $2::int)
        AND ($3::int IS NULL OR s.current_class_id = $3::int)
        AND ($4::int IS NULL OR s.current_section_id = $4::int)
        AND ($5::text = '' OR UPPER(COALESCE(s.gender, '')) = UPPER($5::text))
        AND ($6::date IS NULL OR COALESCE(sb.created_at::date, s.updated_at::date, s.created_at::date) >= $6::date)
        AND ($7::date IS NULL OR COALESCE(sb.created_at::date, s.updated_at::date, s.created_at::date) <= $7::date)
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId,
      gender,
      from ? new Date(from) : null,
      to ? new Date(to) : null
    );

    const backlogByClass = await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        COALESCE(c.class_name, 'Unassigned') AS class_name,
        COUNT(sb.id)::int AS backlog_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') = 'CLEARED')::int AS cleared_count,
        COUNT(*) FILTER (WHERE COALESCE(UPPER(sb.backlog_status), 'PENDING') <> 'CLEARED')::int AS pending_count
      FROM student_backlogs sb
      LEFT JOIN students s ON s.id = sb.student_id
      LEFT JOIN classes c ON c.id = s.current_class_id
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
        AND ($2::int IS NULL OR sb.academic_year_id = $2::int)
      GROUP BY COALESCE(c.class_name, 'Unassigned')
      ORDER BY backlog_count DESC, class_name ASC
      LIMIT 20
      `,
      schoolId,
      academicYearId
    );

    const backlogBySubject = await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
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
      LIMIT 20
      `,
      schoolId,
      academicYearId
    );

    const backlogBySchool = await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
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
      LIMIT 20
      `,
      schoolId,
      academicYearId
    );

    const backlogByAcademicYear =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
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
        LIMIT 20
        `,
        schoolId
      );

    return NextResponse.json({
      ...(rows[0] || {}),
      backlogSummary: backlogRows[0] || {},
      backlogByClass,
      backlogBySubject,
      backlogBySchool,
      backlogByAcademicYear,
    });
  } catch (error) {
    return apiError(error, "Failed to load student lifecycle analytics");
  }
}
