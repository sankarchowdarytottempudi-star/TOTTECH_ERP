import { NextResponse } from "next/server";

import {
  apiError,
} from "@/lib/api/errors";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";

async function subjectDependencies(
  subjectId: number
) {
  const rows =
    await prisma.$queryRawUnsafe<
      Array<{
        dependency: string;
        count: bigint | number | null;
      }>
    >(
      `
      SELECT 'Teachers' AS dependency, COUNT(*) AS count
      FROM teacher_class_assignments
      WHERE subject_id = $1::int AND COALESCE(status, 'ACTIVE') = 'ACTIVE'
      UNION ALL
      SELECT 'Homework', COUNT(*)
      FROM homework_assignments
      WHERE subject_id = $1::int
      UNION ALL
      SELECT 'Question Papers', COUNT(*)
      FROM question_papers
      WHERE subject_id = $1::int
      UNION ALL
      SELECT 'Exam Schedules', COUNT(*)
      FROM exam_schedule
      WHERE subject_id = $1::int
      UNION ALL
      SELECT 'Marks', COUNT(*)
      FROM marks
      WHERE subject_id = $1::int
      UNION ALL
      SELECT 'Question Bank', COUNT(*)
      FROM question_bank
      WHERE subject_id = $1::int
      UNION ALL
      SELECT 'Timetable', COUNT(*)
      FROM timetable_entries
      WHERE subject_id = $1::int
      UNION ALL
      SELECT 'Student Backlogs', COUNT(*)
      FROM student_backlogs
      WHERE subject_id = $1::int
      UNION ALL
      SELECT 'Student Analysis', COUNT(*)
      FROM ai_student_analysis
      WHERE subject_id = $1::int
      `,
      subjectId
    );

  return rows
    .map((row) => ({
      dependency: row.dependency,
      count: Number(row.count || 0),
    }))
    .filter((row) => row.count > 0);
}

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
  const record =
    await prisma.subjects.findUnique({
      where: {
        id: Number(id),
      },
    });

  return record
    ? NextResponse.json(record)
    : NextResponse.json(
        {
          error:
            "Subject not found",
        },
        {
          status: 404,
        }
      );
}

export async function PATCH(
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
      "subject",
      "update"
    )
  ) {
    return NextResponse.json(
      {
        error: managementError(
          "subject",
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
    const body =
      await request.json();
    const subjectName = String(
      body.subject_name || ""
    ).trim();

    if (!subjectName) {
      return NextResponse.json(
        {
          error:
            "Subject name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const record =
      await prisma.subjects.update({
        where: {
          id: Number(id),
        },
        data: {
          subject_name:
            subjectName,
          subject_code:
            String(
              body.subject_code || ""
            ).trim() || null,
          description:
            String(
              body.description || ""
            ).trim() || null,
          status:
            String(
              body.status || "ACTIVE"
            )
              .trim()
              .toUpperCase() ===
            "INACTIVE"
              ? "INACTIVE"
              : "ACTIVE",
        },
      });

    return NextResponse.json(record);
  } catch (error) {
    return apiError(
      error,
      "Failed to update subject"
    );
  }
}

export async function DELETE(
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

  if (
    !canManageRecord(
      auth.user?.role,
      "subject",
      "delete"
    )
  ) {
    return NextResponse.json(
      {
        error: managementError(
          "subject",
          "delete"
        ),
      },
      {
        status: 403,
      }
    );
  }

  try {
    const { id } = await params;
    const subjectId = Number(id);
    const existing =
      await prisma.subjects.findUnique({
        where: {
          id: subjectId,
        },
        select: {
          id: true,
          subject_name: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Subject not found",
        },
        {
          status: 404,
        }
      );
    }

    const dependencies =
      await subjectDependencies(
        subjectId
      );

    if (dependencies.length) {
      return NextResponse.json(
        {
          error:
            "Cannot delete subject because it is currently assigned to active records.",
          dependencies,
        },
        {
          status: 409,
        }
      );
    }

    await prisma.subjects.delete({
      where: {
        id: subjectId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to delete subject"
    );
  }
}
