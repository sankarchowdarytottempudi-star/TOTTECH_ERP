import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
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

const searchText = (
  value: string | null
) =>
  value && value.trim()
    ? `%${value.trim().toLowerCase()}%`
    : null;

export async function GET(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before loading school roster."
      );
    }

    const { searchParams } =
      new URL(request.url);
    const classId = toNumber(
      searchParams?.get("class_id")
    );
    const sectionId = toNumber(
      searchParams?.get("section_id")
    );
    const query = searchText(
      searchParams?.get("q")
    );
    const schoolId =
      user.role === "SUPER_ADMIN" &&
      !user.school_id
        ? null
        : Number(user.school_id) || null;
    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        user.academic_year_id ??
          academicYear?.id
      ) || null;

    const [
      classes,
      sections,
      students,
      teachers,
      subjects,
    ] = await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          c.*,
          COUNT(DISTINCT sec.id)::int AS section_count,
          COUNT(DISTINCT s.id)::int AS student_count,
          COUNT(DISTINCT tca.teacher_id)::int AS teacher_count
        FROM classes c
        LEFT JOIN sections sec ON sec.class_id = c.id
        LEFT JOIN students s
          ON s.school_id = c.school_id
          AND COALESCE(s.current_class_id, 0) = c.id
        LEFT JOIN teacher_class_assignments tca
          ON tca.class_id = c.id
          AND tca.status = 'ACTIVE'
          AND ($2::int IS NULL OR tca.academic_year_id = $2::int OR tca.academic_year_id IS NULL)
        WHERE ($1::int IS NULL OR c.school_id = $1::int)
        GROUP BY c.id
        ORDER BY c.class_name ASC, c.id ASC
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          sec.*,
          c.class_name,
          COUNT(DISTINCT s.id)::int AS student_count,
          COUNT(DISTINCT tca.teacher_id)::int AS teacher_count
        FROM sections sec
        LEFT JOIN classes c ON c.id = sec.class_id
        LEFT JOIN students s
          ON s.school_id = sec.school_id
          AND COALESCE(s.current_section_id, s.section_id, 0) = sec.id
        LEFT JOIN teacher_class_assignments tca
          ON tca.section_id = sec.id
          AND tca.status = 'ACTIVE'
          AND ($3::int IS NULL OR tca.academic_year_id = $3::int OR tca.academic_year_id IS NULL)
        WHERE ($1::int IS NULL OR sec.school_id = $1::int)
          AND ($2::int IS NULL OR sec.class_id = $2::int)
        GROUP BY sec.id, c.class_name
        ORDER BY c.class_name ASC, sec.section_name ASC
        `,
        schoolId,
        classId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          s.id,
          s.school_id,
          s.admission_number,
          s.enrollment_number,
          s.name,
          s.first_name,
          s.middle_name,
          s.last_name,
          s.phone,
          s.email,
          s.roll_number,
          COALESCE(s.current_class_id, sye.class_id) AS class_id,
          COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id,
          c.class_name,
          sec.section_name,
          ay.academic_year
        FROM students s
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
        LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
        LEFT JOIN academic_years ay ON ay.id = COALESCE(s.academic_year_id, sye.academic_year_id)
        WHERE ($1::int IS NULL OR s.school_id = $1::int)
          AND ($3::int IS NULL OR COALESCE(s.current_class_id, sye.class_id) = $3::int)
          AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $4::int)
          AND (
            $5::text IS NULL
            OR LOWER(COALESCE(s.name, '')) LIKE $5::text
            OR LOWER(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')) LIKE $5::text
            OR LOWER(COALESCE(s.admission_number, '')) LIKE $5::text
            OR LOWER(COALESCE(s.enrollment_number, '')) LIKE $5::text
            OR LOWER(COALESCE(s.phone, '')) LIKE $5::text
          )
        ORDER BY s.first_name ASC NULLS LAST, s.id DESC
        LIMIT 250
        `,
        schoolId,
        academicYearId,
        classId,
        sectionId,
        query
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          t.id,
          t.school_id,
          t.employee_id,
          t.first_name,
          t.last_name,
          t.phone,
          t.email,
          t.department,
          t.designation,
          ay.academic_year,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'assignment_id', tca.id,
                'class_id', tca.class_id,
                'class_name', c.class_name,
                'section_id', tca.section_id,
                'section_name', sec.section_name,
                'assignment_type', tca.assignment_type
              )
            ) FILTER (WHERE tca.id IS NOT NULL),
            '[]'::json
          ) AS assignments
        FROM teachers t
        LEFT JOIN teacher_class_assignments tca
          ON tca.teacher_id = t.id
          AND tca.status = 'ACTIVE'
          AND ($2::int IS NULL OR tca.academic_year_id = $2::int OR tca.academic_year_id IS NULL)
        LEFT JOIN classes c ON c.id = tca.class_id
        LEFT JOIN sections sec ON sec.id = tca.section_id
        LEFT JOIN academic_years ay ON ay.id = t.academic_year_id
        WHERE ($1::int IS NULL OR t.school_id = $1::int)
          AND ($3::int IS NULL OR tca.class_id = $3::int)
          AND ($4::int IS NULL OR tca.section_id = $4::int)
          AND (
            $5::text IS NULL
            OR LOWER(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) LIKE $5::text
            OR LOWER(COALESCE(t.employee_id, '')) LIKE $5::text
            OR LOWER(COALESCE(t.phone, '')) LIKE $5::text
            OR LOWER(COALESCE(t.email, '')) LIKE $5::text
            OR LOWER(COALESCE(t.department, '')) LIKE $5::text
          )
        GROUP BY t.id, ay.academic_year
        ORDER BY t.first_name ASC NULLS LAST, t.id DESC
        LIMIT 250
        `,
        schoolId,
        academicYearId,
        classId,
        sectionId,
        query
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT id, school_id, academic_year_id, subject_name, subject_code
        FROM subjects
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY subject_name ASC NULLS LAST, id ASC
        `,
        schoolId,
        academicYearId
      ),
    ]);

    return NextResponse.json({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      academic_year:
        academicYear?.academic_year ?? null,
      filters: {
        class_id: classId,
        section_id: sectionId,
        q:
          searchParams?.get("q") ?? "",
      },
      classes,
      sections,
      students,
      teachers,
      subjects,
    });
  } catch (error) {
    console.error(
      "Roster context error:",
      error
    );

    return apiError(
      error,
      "Failed to load school roster."
    );
  }
}
