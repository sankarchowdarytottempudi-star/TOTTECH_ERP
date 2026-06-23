import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { notifyHomeworkAssigned } from "@/lib/notifications/whatsapp";
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
        "Login required before viewing homework."
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;
    const homework =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          ha.*,
          c.class_name,
          sec.section_name,
          sub.subject_name,
          TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name,
          COUNT(hs.id)::int AS submission_count,
          COUNT(hs.id) FILTER (WHERE hs.status = 'SUBMITTED')::int AS submitted_count
        FROM homework_assignments ha
        LEFT JOIN classes c ON c.id = ha.class_id
        LEFT JOIN sections sec ON sec.id = ha.section_id
        LEFT JOIN subjects sub ON sub.id = ha.subject_id
        LEFT JOIN teachers t ON t.id = ha.teacher_id
        LEFT JOIN homework_submissions hs ON hs.homework_id = ha.id
        WHERE ($1::int IS NULL OR ha.school_id = $1::int)
          AND ($2::int IS NULL OR ha.academic_year_id = $2::int OR ha.academic_year_id IS NULL)
        GROUP BY ha.id, c.class_name, sec.section_name, sub.subject_name, t.first_name, t.last_name
        ORDER BY ha.created_at DESC
        LIMIT 250
        `,
        schoolId,
        academicYearId
      );

    return NextResponse.json({
      homework,
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
      "Failed to load homework"
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
        "Login required before assigning homework."
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
        "Select a school before assigning homework."
      );
    }

    if (
      !classId ||
      !sectionId ||
      !subjectId ||
      !body.title ||
      !body.due_date
    ) {
      return validationError(
        "Class, section, subject, title, and due date are required."
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
        "Select an academic year before assigning homework."
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        INSERT INTO homework_assignments (
          school_id,
          academic_year_id,
          class_id,
          section_id,
          subject_id,
          teacher_id,
          title,
          description,
          due_date,
          status,
          assignment_type,
          metadata,
          created_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING *
        `,
        schoolId,
        academicYearId,
        classId,
        sectionId,
        subjectId,
        body.teacher_id
          ? Number(body.teacher_id)
          : null,
        body.title,
        body.description || null,
        new Date(body.due_date),
        body.status || "ASSIGNED",
        body.assignment_type ||
          "CLASS_SECTION",
        JSON.stringify(
          body.metadata || {}
        ),
        user.id || null
      );
    const homework = rows[0];

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "homework",
      event_type:
        "HOMEWORK_ASSIGNED",
      action: "assign",
      entity_type: "class",
      entity_id: classId,
      summary:
        "Homework assigned",
      payload: {
        homework_id:
          homework?.id,
        section_id: sectionId,
        subject_id: subjectId,
      },
    });

    if (homework?.id) {
      await notifyHomeworkAssigned(
        Number(homework.id),
        user.id || null
      ).catch((error) => {
        console.error(
          "WhatsApp homework_assigned dispatch failed:",
          error instanceof Error
            ? error.message
            : error
        );
      });
    }

    return NextResponse.json(
      homework,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to assign homework"
    );
  }
}
