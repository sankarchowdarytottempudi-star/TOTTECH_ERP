import { NextResponse } from "next/server";

import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Context
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before viewing an exam schedule."
      );
    }

    const { id } = await params;
    const rows =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT *
        FROM exam_schedule
        WHERE id = $1
        LIMIT 1
        `,
        Number(id)
      );

    return rows[0]
      ? NextResponse.json(rows[0])
      : NextResponse.json(
          {
            error:
              "Exam schedule not found.",
          },
          {
            status: 404,
          }
        );
  } catch (error) {
    return apiError(
      error,
      "Failed to fetch schedule"
    );
  }
}

export async function PUT(
  request: Request,
  { params }: Context
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before updating an exam schedule."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "exam_schedule",
        "update"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "exam_schedule",
            "update"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;
    const body =
      await request.json();
    const schoolId =
      user.role === "SUPER_ADMIN" &&
      !user.school_id
        ? null
        : Number(user.school_id) || null;

    const rows =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        UPDATE exam_schedule
        SET exam_id = $2,
            exam_type_id = $3,
            question_paper_id = $4,
            class_id = $5,
            section_id = $6,
            subject_id = $7,
            exam_date = $8,
            start_time = $9::time,
            end_time = $10::time,
            room_no = $11,
            invigilator_teacher_id = $12,
            status = COALESCE($13, status),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND ($14::int IS NULL OR school_id = $14::int)
        RETURNING *
        `,
        Number(id),
        body.exam_id
          ? Number(body.exam_id)
          : null,
        body.exam_type_id
          ? Number(body.exam_type_id)
          : null,
        body.question_paper_id
          ? Number(
              body.question_paper_id
            )
          : null,
        body.class_id
          ? Number(body.class_id)
          : null,
        body.section_id
          ? Number(body.section_id)
          : null,
        body.subject_id
          ? Number(body.subject_id)
          : null,
        body.exam_date
          ? new Date(body.exam_date)
          : null,
        body.start_time || null,
        body.end_time || null,
        body.room_no || null,
        body.invigilator_teacher_id
          ? Number(
              body.invigilator_teacher_id
            )
          : null,
        body.status || null,
        schoolId
      );

    const schedule = rows[0];

    if (!schedule) {
      return NextResponse.json(
        {
          error:
            "Exam schedule not found.",
        },
        {
          status: 404,
        }
      );
    }

    await recordEvent({
      school_id:
        Number(schedule.school_id) ||
        null,
      academic_year_id:
        Number(
          schedule.academic_year_id
        ) || null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "EXAM_SCHEDULE_UPDATED",
      action: "update",
      entity_type: "exam_schedule",
      entity_id: Number(schedule.id),
      summary:
        "Exam schedule updated",
      payload: schedule,
    });

    return NextResponse.json(
      schedule
    );
  } catch (error) {
    return apiError(
      error,
      "Update failed"
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Context
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before deleting an exam schedule."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "exam_schedule",
        "delete"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "exam_schedule",
            "delete"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;
    const scheduleId = Number(id);
    const schoolId =
      user.role === "SUPER_ADMIN" &&
      !user.school_id
        ? null
        : Number(user.school_id) || null;
    const rows =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT *
        FROM exam_schedule
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        LIMIT 1
        `,
        scheduleId,
        schoolId
      );
    const schedule = rows[0];

    if (!schedule) {
      return NextResponse.json(
        {
          error:
            "Exam schedule not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(
          "DELETE FROM student_marks_entry WHERE exam_schedule_id = $1",
          scheduleId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM exam_schedule WHERE id = $1",
          scheduleId
        );
      }
    );

    await recordEvent({
      school_id:
        Number(schedule.school_id) ||
        null,
      academic_year_id:
        Number(
          schedule.academic_year_id
        ) || null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "EXAM_SCHEDULE_DELETED",
      action: "delete",
      entity_type: "exam_schedule",
      entity_id: scheduleId,
      summary:
        "Exam schedule deleted",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Delete failed"
    );
  }
}
