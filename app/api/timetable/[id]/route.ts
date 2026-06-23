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

const hasRequiredTimetableFields = (
  body: Record<string, unknown>
) =>
  Boolean(
    body.class_id &&
      body.section_id &&
      body.subject_id &&
      body.teacher_id &&
      body.day_of_week &&
      body.start_time &&
      body.end_time
  );

const hasValidTimeRange = (
  startTime: unknown,
  endTime: unknown
) =>
  String(startTime || "") <
  String(endTime || "");

const scopedSchoolId = (
  user: any
) =>
  user?.role === "SUPER_ADMIN" &&
  !user?.school_id
    ? null
    : Number(user?.school_id) || null;

export async function PATCH(
  request: Request,
  { params }: Context
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before updating timetable entries."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "timetable",
        "update"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "timetable",
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
      scopedSchoolId(user);

    if (!hasRequiredTimetableFields(body)) {
      return validationError(
        "Class, section, subject, teacher, day, start time, and end time are required."
      );
    }

    if (
      !hasValidTimeRange(
        body.start_time,
        body.end_time
      )
    ) {
      return validationError(
        "End time must be later than start time."
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        UPDATE timetable_entries
        SET class_id = $2,
            section_id = $3,
            subject_id = $4,
            teacher_id = $5,
            day_of_week = $6,
            start_time = $7::time,
            end_time = $8::time,
            room_no = $9,
            status = COALESCE($10, status),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND ($11::int IS NULL OR school_id = $11::int)
        RETURNING *
        `,
        Number(id),
        body.class_id
          ? Number(body.class_id)
          : null,
        body.section_id
          ? Number(body.section_id)
          : null,
        body.subject_id
          ? Number(body.subject_id)
          : null,
        body.teacher_id
          ? Number(body.teacher_id)
          : null,
        body.day_of_week
          ? String(
              body.day_of_week
            ).toUpperCase()
          : null,
        body.start_time || null,
        body.end_time || null,
        body.room_no || null,
        body.status || null,
        schoolId
      );
    const entry = rows[0];

    if (!entry) {
      return NextResponse.json(
        {
          error:
            "Timetable entry not found.",
        },
        {
          status: 404,
        }
      );
    }

    await recordEvent({
      school_id:
        Number(entry.school_id) ||
        null,
      academic_year_id:
        Number(
          entry.academic_year_id
        ) || null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "TIMETABLE_ENTRY_UPDATED",
      action: "update",
      entity_type: "timetable",
      entity_id: Number(entry.id),
      summary:
        "Timetable entry updated",
      payload: entry,
    });

    return NextResponse.json(entry);
  } catch (error) {
    return apiError(
      error,
      "Failed to update timetable entry."
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
        "Login required before deleting timetable entries."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "timetable",
        "delete"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "timetable",
            "delete"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;
    const schoolId =
      scopedSchoolId(user);
    const rows =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        DELETE FROM timetable_entries
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        RETURNING *
        `,
        Number(id),
        schoolId
      );
    const entry = rows[0];

    if (!entry) {
      return NextResponse.json(
        {
          error:
            "Timetable entry not found.",
        },
        {
          status: 404,
        }
      );
    }

    await recordEvent({
      school_id:
        Number(entry.school_id) ||
        null,
      academic_year_id:
        Number(
          entry.academic_year_id
        ) || null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "TIMETABLE_ENTRY_DELETED",
      action: "delete",
      entity_type: "timetable",
      entity_id: Number(entry.id),
      summary:
        "Timetable entry deleted",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to delete timetable entry."
    );
  }
}
