import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

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

    const classes =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          c.*,
          sch.school_name,
          COUNT(DISTINCT sec.id)::int AS section_count,
          COUNT(DISTINCT s.id)::int AS student_count
        FROM classes c
        LEFT JOIN schools sch ON sch.id = c.school_id
        LEFT JOIN sections sec
          ON sec.class_id = c.id
          AND ($2::int IS NULL OR sec.academic_year_id = $2::int OR sec.academic_year_id IS NULL)
        LEFT JOIN students s
          ON s.current_class_id = c.id
          AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)
        WHERE ($1::int IS NULL OR c.school_id = $1::int)
          AND ($2::int IS NULL OR c.academic_year_id = $2::int OR c.academic_year_id IS NULL)
        GROUP BY c.id, sch.school_name
        ORDER BY c.class_name ASC, c.id ASC
        `,
        context.schoolId,
        context.academicYearId
      );

    return NextResponse.json(
      classes
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load classes"
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before creating a class."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "class",
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "class",
            "create"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const schoolId =
      Number(
        body.school_id ??
          user.school_id
      ) || null;

    if (!schoolId) {
      return validationError(
        "Select a school before creating a class."
      );
    }

    if (!body.class_name) {
      return validationError(
        "Class name is required."
      );
    }

    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          academicYear?.id ??
          user.academic_year_id
      ) || null;

    if (!academicYearId) {
      return validationError(
        "Select an academic year before creating a class."
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        INSERT INTO classes (
          school_id,
          academic_year_id,
          class_name,
          class_teacher_id,
          created_by,
          created_at
        )
        VALUES ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP)
        RETURNING *
        `,
        schoolId,
        academicYearId,
        String(body.class_name).trim(),
        body.class_teacher_id
          ? Number(
              body.class_teacher_id
            )
          : null,
        user.id || null
      );
    const record = rows[0];

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type: "CLASS_CREATED",
      action: "create",
      entity_type: "class",
      entity_id:
        Number(record?.id) ||
        null,
      summary:
        "Class created",
    });

    return NextResponse.json(
      record,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to create class"
    );
  }
}
