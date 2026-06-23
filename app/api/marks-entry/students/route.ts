import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import { apiError } from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
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
      return NextResponse.json([]);
    }

    const { searchParams } =
      new URL(request.url);
    const examScheduleId =
      toNumber(
        searchParams?.get(
          "exam_schedule_id"
        )
      );
    const explicitClassId =
      toNumber(
        searchParams?.get("class_id")
      );
    const explicitSectionId =
      toNumber(
        searchParams?.get("section_id")
      );
    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;

    let classId =
      explicitClassId;
    let sectionId =
      explicitSectionId;

    if (examScheduleId) {
      const scheduleRows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          SELECT class_id, section_id
          FROM exam_schedule
          WHERE id = $1
          LIMIT 1
          `,
          examScheduleId
        );

      classId =
        classId ||
        Number(
          scheduleRows[0]?.class_id
        ) ||
        null;
      sectionId =
        sectionId ||
        Number(
          scheduleRows[0]?.section_id
        ) ||
        null;
    }

    const students =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          s.id,
          s.school_id,
          s.admission_number,
          s.name,
          s.first_name,
          s.middle_name,
          s.last_name,
          COALESCE(s.roll_number, sye.roll_number) AS student_roll_number,
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
        WHERE COALESCE(s.is_active, true) = true
          AND ($1::int IS NULL OR s.school_id = $1::int)
          AND ($3::int IS NULL OR COALESCE(s.current_class_id, sye.class_id) = $3::int)
          AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $4::int)
          AND ($2::int IS NULL OR s.academic_year_id = $2::int OR sye.academic_year_id = $2::int OR (s.academic_year_id IS NULL AND sye.academic_year_id IS NULL))
        ORDER BY COALESCE(s.roll_number, sye.roll_number) ASC NULLS LAST, s.first_name ASC NULLS LAST, s.id ASC
        `,
        schoolId,
        academicYearId,
        classId,
        sectionId
      );

    return NextResponse.json(
      students
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load mark-entry students"
    );
  }
}
