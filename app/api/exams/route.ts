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
      return validationError(
        "Login required before viewing exams."
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;
    const exams =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          e.*,
          ay.academic_year,
          COUNT(DISTINCT es.id)::int AS schedule_count,
          COUNT(DISTINCT qp.id)::int AS paper_count
        FROM exams e
        LEFT JOIN academic_years ay ON ay.id = e.academic_year_id
        LEFT JOIN exam_schedule es ON es.exam_id = e.id
        LEFT JOIN question_papers qp ON qp.exam_id = e.id
        WHERE ($1::int IS NULL OR e.school_id = $1::int)
          AND ($2::int IS NULL OR e.academic_year_id = $2::int OR e.academic_year_id IS NULL)
        GROUP BY e.id, ay.academic_year
        ORDER BY e.start_date DESC NULLS LAST, e.id DESC
        `,
        schoolId,
        academicYearId
      );

    return NextResponse.json({
      exams,
      academicYear: {
        id: academicYearId,
        scope:
          context.academicYearScope,
      },
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load exams"
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before creating an exam."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "exam",
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "exam",
            "create"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();
    const schoolId =
      Number(
        body.school_id ??
          user.school_id
      ) || null;

    if (!schoolId) {
      return validationError(
        "Select a school before creating an exam."
      );
    }

    if (!body.exam_name) {
      return validationError(
        "Exam name is required."
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
        "Select an academic year before creating an exam."
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        INSERT INTO exams (
          school_id,
          academic_year_id,
          exam_name,
          exam_type,
          start_date,
          end_date,
          created_by,
          created_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP)
        RETURNING *
        `,
        schoolId,
        academicYearId,
        String(body.exam_name).trim(),
        body.exam_type || null,
        body.start_date
          ? new Date(
              body.start_date
            )
          : null,
        body.end_date
          ? new Date(body.end_date)
          : null,
        user.id || null
      );
    const exam = rows[0];

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type: "EXAM_CREATED",
      action: "create",
      entity_type: "school",
      entity_id: schoolId,
      summary: "Exam created",
      payload: {
        exam_id: exam?.id,
        exam_name: body.exam_name,
      },
    });

    return NextResponse.json(
      exam,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to create exam"
    );
  }
}
