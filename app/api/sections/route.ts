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

    const sections =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          sec.*,
          c.class_name,
          sch.school_name,
          COUNT(DISTINCT s.id)::int AS student_count
        FROM sections sec
        LEFT JOIN classes c ON c.id = sec.class_id
        LEFT JOIN schools sch ON sch.id = sec.school_id
        LEFT JOIN students s
          ON COALESCE(s.current_section_id, s.section_id) = sec.id
          AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)
        WHERE ($1::int IS NULL OR sec.school_id = $1::int)
          AND ($2::int IS NULL OR sec.academic_year_id = $2::int OR sec.academic_year_id IS NULL)
        GROUP BY sec.id, c.class_name, sch.school_name
        ORDER BY c.class_name ASC, sec.section_name ASC
        `,
        context.schoolId,
        context.academicYearId
      );

    return NextResponse.json(
      sections
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load sections"
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
        "Login required before creating a section."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "section",
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "section",
            "create"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const classId =
      Number(body.class_id) || null;

    if (!classId) {
      return validationError(
        "Select a class before creating a section."
      );
    }

    if (!body.section_name) {
      return validationError(
        "Section name is required."
      );
    }

    const classRows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT id, school_id
             , academic_year_id
        FROM classes
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        `,
        classId,
        user.role === "SUPER_ADMIN"
          ? Number(user.school_id) ||
              null
          : Number(user.school_id)
      );
    const classRecord =
      classRows[0];

    if (!classRecord) {
      return validationError(
        "Selected class does not belong to the selected school."
      );
    }

    const schoolId =
      Number(
        classRecord.school_id
      ) ||
      Number(body.school_id) ||
      Number(user.school_id) ||
      null;
    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          academicYear?.id ??
          classRecord.academic_year_id ??
          user.academic_year_id
      ) || null;

    if (!academicYearId) {
      return validationError(
        "Select an academic year before creating a section."
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        INSERT INTO sections (
          school_id,
          academic_year_id,
          class_id,
          section_name,
          created_by,
          created_at
        )
        VALUES ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP)
        RETURNING *
        `,
        schoolId,
        academicYearId,
        classId,
        String(
          body.section_name
        ).trim(),
        user.id || null
      );
    const section = rows[0];

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type: "SECTION_CREATED",
      action: "create",
      entity_type: "class",
      entity_id: classId,
      summary:
        "Section created",
      payload: {
        section_id:
          section?.id,
      },
    });

    return NextResponse.json(
      section,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to create section"
    );
  }
}
