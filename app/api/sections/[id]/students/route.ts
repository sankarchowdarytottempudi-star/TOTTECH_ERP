import { NextResponse } from "next/server";

import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import { recordEvent } from "@/lib/governance/events";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";
import { prisma } from "@/lib/prisma";

const numberArray = (
  value: unknown
) =>
  Array.isArray(value)
    ? value
        .map((item) => Number(item))
        .filter(
          (item) =>
            Number.isFinite(item) &&
            item > 0
        )
    : Number(value) > 0
      ? [Number(value)]
      : [];

export async function GET(
  _request: Request,
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
  const sectionId = Number(id);

  const students =
    await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        s.id,
        s.school_id,
        s.admission_number,
        s.enrollment_number,
        COALESCE(NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')), ''), s.name) AS student_name,
        s.current_class_id,
        s.current_section_id,
        c.class_name,
        sec.section_name
      FROM students s
      LEFT JOIN classes c ON c.id = s.current_class_id
      LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id)
      WHERE COALESCE(s.current_section_id, s.section_id) = $1
        AND (
          $2::int IS NULL
          OR s.school_id = $2::int
        )
      ORDER BY student_name ASC
      `,
      sectionId,
      auth.user?.role === "SUPER_ADMIN"
        ? null
        : auth.user?.school_id ?? null
    );

  return NextResponse.json({
    students,
  });
}

export async function POST(
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

  if (
    !canManageRecord(
      auth.user?.role,
      "section",
      "update"
    )
  ) {
    return NextResponse.json(
      {
        error: managementError(
          "section",
          "update"
        ),
      },
      {
        status: 403,
      }
    );
  }

  try {
    const { id } = await params;
    const sectionId = Number(id);
    const body =
      await request.json();
    const studentIds =
      numberArray(
        body.student_ids ??
          body.student_id
      );

    if (!studentIds.length) {
      return validationError(
        "Select at least one student to assign to this section."
      );
    }

    const sections =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT
          sec.id,
          sec.school_id,
          sec.class_id,
          sec.academic_year_id,
          sec.section_name,
          c.class_name
        FROM sections sec
        LEFT JOIN classes c ON c.id = sec.class_id
        WHERE sec.id = $1
        `,
        sectionId
      );
    const section = sections[0];

    if (!section) {
      return validationError(
        "Section not found."
      );
    }

    const schoolId =
      Number(section.school_id) ||
      null;

    if (
      auth.user?.role !==
        "SUPER_ADMIN" &&
      Number(auth.user?.school_id) !==
        schoolId
    ) {
      return NextResponse.json(
        {
          error:
            "You can only assign students within your school.",
        },
        {
          status: 403,
        }
      );
    }

    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          section.academic_year_id ??
          academicYear?.id
      ) || null;

    if (!academicYearId) {
      return validationError(
        "Select an academic year before assigning students to a section."
      );
    }

    const validStudents =
      await prisma.$queryRawUnsafe<
        {
          id: number;
        }[]
      >(
        `
        SELECT id
        FROM students
        WHERE id = ANY($1::int[])
          AND school_id = $2::int
        `,
        studentIds,
        schoolId
      );

    if (
      validStudents.length !==
      studentIds.length
    ) {
      return validationError(
        "One or more selected students do not belong to this section's school."
      );
    }

    await prisma.$transaction(
      async (tx) => {
        for (const student of validStudents) {
          await tx.$executeRawUnsafe(
            `
            UPDATE students
            SET current_class_id = $1,
                current_section_id = $2,
                section_id = $2,
                academic_year_id = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            `,
            Number(section.class_id),
            sectionId,
            academicYearId,
            student.id
          );

          await tx.$executeRawUnsafe(
            `
            INSERT INTO student_year_enrollments (
              school_id,
              student_id,
              academic_year_id,
              class_id,
              section_id,
              status,
              source,
              created_at,
              updated_at
            )
            VALUES ($1,$2,$3,$4,$5,'ACTIVE','section_assignment',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
            ON CONFLICT (student_id, academic_year_id)
            DO UPDATE SET
              class_id = EXCLUDED.class_id,
              section_id = EXCLUDED.section_id,
              status = 'ACTIVE',
              source = 'section_assignment',
              updated_at = CURRENT_TIMESTAMP
            `,
            schoolId,
            student.id,
            academicYearId,
            Number(section.class_id),
            sectionId
          );
        }
      }
    );

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: auth.user?.id,
      actor_role: auth.user?.role,
      module_name: "academics",
      event_type:
        "SECTION_STUDENTS_ASSIGNED",
      action: "assign",
      entity_type: "section",
      entity_id: sectionId,
      summary:
        "Students assigned to section",
      payload: {
        class_id:
          section.class_id,
        assigned_student_ids:
          studentIds,
      },
    });

    return NextResponse.json({
      success: true,
      assigned: studentIds.length,
    });
  } catch (error) {
    console.error(
      "Section student assignment error:",
      error
    );

    return apiError(
      error,
      "Failed to assign students to section"
    );
  }
}
