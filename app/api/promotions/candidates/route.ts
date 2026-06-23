import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";

const numberOrNull = (
  value: unknown
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
  const auth =
    await requirePermission({
      module: "promotions",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const { searchParams } =
    new URL(request.url);
  const schoolId =
    auth.user?.role === "SUPER_ADMIN"
      ? numberOrNull(
          searchParams?.get("school_id")
        ) ??
        auth.user?.school_id ??
        null
      : auth.user?.school_id ?? null;
  const sourceAcademicYearId =
    numberOrNull(
      searchParams?.get(
        "source_academic_year_id"
      )
    );
  const classId = numberOrNull(
    searchParams?.get("class_id")
  );
  const sectionId = numberOrNull(
    searchParams?.get("section_id")
  );
  const studentId = numberOrNull(
    searchParams?.get("student_id")
  );
  const filtersUsed = [
    schoolId,
    sourceAcademicYearId,
    classId,
    sectionId,
    studentId,
  ].filter(Boolean).length;

  const [
    schools,
    academicYears,
    classes,
    sections,
  ] = await Promise.all([
    prisma.schools.findMany({
      orderBy: {
        school_name: "asc",
      },
    }),
    prisma.academic_years.findMany({
      where: schoolId
        ? {
            OR: [
              {
                school_id: schoolId,
              },
              {
                school_id: null,
              },
            ],
          }
        : {
            school_id: null,
          },
      orderBy: {
        academic_year: "asc",
      },
    }),
    prisma.classes.findMany({
      where: schoolId
        ? {
            school_id: schoolId,
          }
        : {},
      orderBy: {
        class_name: "asc",
      },
    }),
    prisma.sections.findMany({
      where: {
        ...(schoolId
          ? {
              school_id: schoolId,
            }
          : {}),
        ...(classId
          ? {
              class_id: classId,
            }
          : {}),
      },
      orderBy: {
        section_name: "asc",
      },
    }),
  ]);

  const students =
    filtersUsed >= 2
      ? await prisma.$queryRawUnsafe<
          Record<string, unknown>[]
        >(
          `
          SELECT
            s.id,
            s.school_id,
            s.admission_number,
            s.enrollment_number,
            COALESCE(NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')), ''), s.name) AS student_name,
            COALESCE(s.current_class_id, sye.class_id) AS class_id,
            COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id,
            c.class_name,
            sec.section_name,
            COALESCE(s.academic_year_id, sye.academic_year_id) AS academic_year_id,
            ay.academic_year,
            COALESCE(s.status, CASE WHEN COALESCE(s.is_active, true) THEN 'ACTIVE' ELSE 'INACTIVE' END) AS status,
            COALESCE((
              SELECT COUNT(*)::int
              FROM student_backlogs sb
              WHERE sb.student_id = s.id
                AND COALESCE(UPPER(sb.backlog_status), 'PENDING') <> 'CLEARED'
            ), 0) AS pending_backlogs_count,
            COALESCE((
              SELECT COUNT(*)::int
              FROM student_backlogs sb
              WHERE sb.student_id = s.id
            ), 0) AS backlog_count
          FROM students s
          LEFT JOIN student_year_enrollments sye
            ON sye.student_id = s.id
            AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
          LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
          LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
          LEFT JOIN academic_years ay ON ay.id = COALESCE(s.academic_year_id, sye.academic_year_id)
          WHERE ($1::int IS NULL OR s.school_id = $1::int)
            AND ($2::int IS NULL OR s.academic_year_id = $2::int OR sye.academic_year_id = $2::int)
            AND ($3::int IS NULL OR COALESCE(s.current_class_id, sye.class_id) = $3::int)
            AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $4::int)
            AND ($5::int IS NULL OR s.id = $5::int)
            AND COALESCE(s.status, 'ACTIVE') <> 'DROPOUT'
          ORDER BY c.class_name ASC NULLS LAST, sec.section_name ASC NULLS LAST, student_name ASC
          LIMIT 500
          `,
          schoolId,
          sourceAcademicYearId,
          classId,
          sectionId,
          studentId
        )
      : [];

  return NextResponse.json({
    schools,
    academicYears,
    classes,
    sections,
    students,
    filtersUsed,
    ready:
      filtersUsed >= 2,
    message:
      filtersUsed >= 2
        ? "Students loaded from matching filters."
        : "Select at least two filters to load students.",
  });
}
