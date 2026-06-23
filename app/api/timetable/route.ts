import { NextResponse } from "next/server";

import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

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
  user: any,
  body?: any
) =>
  Number(body?.school_id) ||
  (user?.role === "SUPER_ADMIN" &&
  !user?.school_id
    ? null
    : Number(user?.school_id) || null);

export async function GET() {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before viewing timetable."
      );
    }

    const schoolId =
      scopedSchoolId(user);
    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        user.academic_year_id ??
          academicYear?.id
      ) || null;

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          te.*,
          c.class_name,
          sec.section_name,
          sub.subject_name,
          TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name,
          ay.academic_year
        FROM timetable_entries te
        LEFT JOIN classes c ON c.id = te.class_id
        LEFT JOIN sections sec ON sec.id = te.section_id
        LEFT JOIN subjects sub ON sub.id = te.subject_id
        LEFT JOIN teachers t ON t.id = te.teacher_id
        LEFT JOIN academic_years ay ON ay.id = te.academic_year_id
        WHERE ($1::int IS NULL OR te.school_id = $1::int)
          AND ($2::int IS NULL OR te.academic_year_id = $2::int OR te.academic_year_id IS NULL)
        ORDER BY
          CASE te.day_of_week
            WHEN 'MONDAY' THEN 1
            WHEN 'TUESDAY' THEN 2
            WHEN 'WEDNESDAY' THEN 3
            WHEN 'THURSDAY' THEN 4
            WHEN 'FRIDAY' THEN 5
            WHEN 'SATURDAY' THEN 6
            WHEN 'SUNDAY' THEN 7
            ELSE 8
          END,
          te.start_time ASC NULLS LAST,
          te.id DESC
        `,
        schoolId,
        academicYearId
      );

    return NextResponse.json({
      entries: rows,
      academicYear,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to load timetable."
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
        "Login required before creating timetable entries."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "timetable",
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "timetable",
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
      scopedSchoolId(user, body);

    if (!schoolId) {
      return validationError(
        "Select a school before creating timetable entries."
      );
    }

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

    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          user.academic_year_id ??
          academicYear?.id
      ) || null;

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        INSERT INTO timetable_entries (
          school_id,
          academic_year_id,
          class_id,
          section_id,
          subject_id,
          teacher_id,
          day_of_week,
          start_time,
          end_time,
          room_no,
          status,
          metadata,
          created_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8::time,$9::time,$10,$11,$12::jsonb,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING *
        `,
        schoolId,
        academicYearId,
        Number(body.class_id),
        Number(body.section_id),
        Number(body.subject_id),
        Number(body.teacher_id),
        String(
          body.day_of_week
        ).toUpperCase(),
        body.start_time || null,
        body.end_time || null,
        body.room_no || null,
        body.status || "ACTIVE",
        JSON.stringify(
          body.metadata || {}
        ),
        user.id || null
      );
    const entry = rows[0];

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "TIMETABLE_ENTRY_CREATED",
      action: "create",
      entity_type: "timetable",
      entity_id:
        Number(entry?.id) || null,
      summary:
        "Timetable entry created",
      payload: entry,
    });

    return NextResponse.json(
      entry,
      {
        status: 201,
      }
    );
  } catch (error) {
    return apiError(
      error,
      "Failed to save timetable entry."
    );
  }
}
