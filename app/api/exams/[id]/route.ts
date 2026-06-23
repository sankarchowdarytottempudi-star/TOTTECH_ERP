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

export async function PATCH(
  request: Request,
  { params }: Context
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before updating an exam."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "exam",
        "update"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "exam",
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
        UPDATE exams
        SET exam_name = COALESCE($2, exam_name),
            exam_type = $3,
            start_date = $4,
            end_date = $5
        WHERE id = $1
          AND ($6::int IS NULL OR school_id = $6::int)
        RETURNING *
        `,
        Number(id),
        body.exam_name
          ? String(body.exam_name).trim()
          : null,
        body.exam_type || null,
        body.start_date
          ? new Date(body.start_date)
          : null,
        body.end_date
          ? new Date(body.end_date)
          : null,
        schoolId
      );

    const exam = rows[0];

    if (!exam) {
      return NextResponse.json(
        {
          error: "Exam not found.",
        },
        {
          status: 404,
        }
      );
    }

    await recordEvent({
      school_id:
        Number(exam.school_id) || null,
      academic_year_id:
        Number(
          exam.academic_year_id
        ) || null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type: "EXAM_UPDATED",
      action: "update",
      entity_type: "exam",
      entity_id: Number(exam.id),
      summary: "Exam updated",
      payload: exam,
    });

    return NextResponse.json(exam);
  } catch (error) {
    return apiError(
      error,
      "Failed to update exam"
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
        "Login required before deleting an exam."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "exam",
        "delete"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "exam",
            "delete"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;
    const examId = Number(id);
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
        FROM exams
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        LIMIT 1
        `,
        examId,
        schoolId
      );
    const exam = rows[0];

    if (!exam) {
      return NextResponse.json(
        {
          error: "Exam not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(
          `
          DELETE FROM student_marks_entry
          WHERE exam_schedule_id IN (
            SELECT id FROM exam_schedule WHERE exam_id = $1
          )
          `,
          examId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM exam_schedule WHERE exam_id = $1",
          examId
        );

        await tx.$executeRawUnsafe(
          "UPDATE question_papers SET exam_id = NULL WHERE exam_id = $1",
          examId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM marks WHERE exam_id = $1",
          examId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM exams WHERE id = $1",
          examId
        );
      }
    );

    await recordEvent({
      school_id:
        Number(exam.school_id) || null,
      academic_year_id:
        Number(
          exam.academic_year_id
        ) || null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type: "EXAM_DELETED",
      action: "delete",
      entity_type: "exam",
      entity_id: examId,
      summary: "Exam deleted",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to delete exam"
    );
  }
}
