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
import { notifyExamScheduleCreated } from "@/lib/notifications/whatsapp";
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
        "Login required before viewing exam schedule."
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;
    const schedules =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          es.*,
          e.exam_name,
          e.exam_type,
          et.exam_name AS exam_type_name,
          qp.paper_name,
          c.class_name,
          sec.section_name,
          sub.subject_name,
          TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS invigilator_name
        FROM exam_schedule es
        LEFT JOIN exams e ON e.id = es.exam_id
        LEFT JOIN exam_types et ON et.id = es.exam_type_id
        LEFT JOIN question_papers qp ON qp.id = es.question_paper_id
        LEFT JOIN classes c ON c.id = es.class_id
        LEFT JOIN sections sec ON sec.id = es.section_id
        LEFT JOIN subjects sub ON sub.id = es.subject_id
        LEFT JOIN teachers t ON t.id = es.invigilator_teacher_id
        WHERE ($1::int IS NULL OR COALESCE(es.school_id, c.school_id) = $1::int)
          AND ($2::int IS NULL OR es.academic_year_id = $2::int OR es.academic_year_id IS NULL)
        ORDER BY es.exam_date DESC NULLS LAST, es.id DESC
        `,
        schoolId,
        academicYearId
      );

    return NextResponse.json(
      schedules
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load exam schedule"
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
        "Login required before creating an exam schedule."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "exam_schedule",
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "exam_schedule",
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
    const classId =
      Number(body.class_id) || null;
    const sectionId =
      Number(body.section_id) || null;
    const subjectId =
      Number(body.subject_id) || null;

    if (!schoolId) {
      return validationError(
        "Select a school before scheduling an exam."
      );
    }

    if (
      !body.exam_id &&
      !body.exam_type_id
    ) {
      return validationError(
        "Select an exam or exam type before scheduling."
      );
    }

    if (
      !classId ||
      !sectionId ||
      !subjectId ||
      !body.exam_date
    ) {
      return validationError(
        "Class, section, subject, and exam date are required."
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
        INSERT INTO exam_schedule (
          school_id,
          academic_year_id,
          exam_id,
          exam_type_id,
          question_paper_id,
          class_id,
          section_id,
          subject_id,
          exam_date,
          start_time,
          end_time,
          room_no,
          invigilator_teacher_id,
          status,
          metadata,
          created_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::time,$11::time,$12,$13,$14,$15::jsonb,$16,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING *
        `,
        schoolId,
        academicYearId,
        body.exam_id
          ? Number(body.exam_id)
          : null,
        body.exam_type_id
          ? Number(
              body.exam_type_id
            )
          : null,
        body.question_paper_id
          ? Number(
              body.question_paper_id
            )
          : null,
        classId,
        sectionId,
        subjectId,
        new Date(body.exam_date),
        body.start_time || null,
        body.end_time || null,
        body.room_no || null,
        body.invigilator_teacher_id
          ? Number(
              body.invigilator_teacher_id
            )
          : null,
        body.status || "SCHEDULED",
        JSON.stringify(
          body.metadata || {}
        ),
        user.id || null
      );
    const schedule = rows[0];

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "EXAM_SCHEDULE_CREATED",
      action: "schedule",
      entity_type: "class",
      entity_id: classId,
      summary:
        "Exam schedule created",
      payload: {
        schedule_id:
          schedule?.id,
        section_id: sectionId,
        subject_id: subjectId,
      },
    });

    if (schedule?.id) {
      await notifyExamScheduleCreated(
        Number(schedule.id),
        user.id || null
      ).catch((error) => {
        console.error(
          "WhatsApp exam_schedule_created dispatch failed:",
          error instanceof Error
            ? error.message
            : error
        );
      });
    }

    return NextResponse.json(
      schedule,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to save exam schedule"
    );
  }
}
