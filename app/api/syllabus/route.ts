import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import {
  resolveMutationContext,
  resolvePlatformContext,
} from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const text = (value: unknown) =>
  String(value ?? "").trim();

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

    const { searchParams } =
      new URL(request.url);
    const classId = toNumber(
      searchParams?.get("class_id")
    );
    const sectionId = toNumber(
      searchParams?.get("section_id")
    );
    const subjectId = toNumber(
      searchParams?.get("subject_id")
    );
    const examTypeId = toNumber(
      searchParams?.get("exam_type_id")
    );

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          su.*,
          c.class_name,
          sec.section_name,
          sub.subject_name,
          et.exam_name AS exam_type_name,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'assignment_id', ssa.id,
                'teacher_id', ssa.teacher_id,
                'teacher_name', TRIM(COALESCE(t.first_name,'') || ' ' || COALESCE(t.last_name,'')),
                'expected_completion_percent', ssa.expected_completion_percent,
                'actual_completion_percent', ssa.actual_completion_percent,
                'completed_periods', ssa.completed_periods,
                'status', ssa.status,
                'remarks', ssa.remarks
              )
            ) FILTER (WHERE ssa.id IS NOT NULL),
            '[]'::json
          ) AS assignments
        FROM syllabus_units su
        LEFT JOIN classes c ON c.id = su.class_id
        LEFT JOIN sections sec ON sec.id = su.section_id
        LEFT JOIN subjects sub ON sub.id = su.subject_id
        LEFT JOIN exam_types et ON et.id = su.exam_type_id
        LEFT JOIN syllabus_staff_assignments ssa ON ssa.syllabus_unit_id = su.id
        LEFT JOIN teachers t ON t.id = ssa.teacher_id
        WHERE ($1::int IS NULL OR su.school_id = $1::int)
          AND ($2::int IS NULL OR su.academic_year_id = $2::int OR su.academic_year_id IS NULL)
          AND ($3::int IS NULL OR su.class_id = $3::int)
          AND ($4::int IS NULL OR su.section_id = $4::int)
          AND ($5::int IS NULL OR su.subject_id = $5::int)
          AND ($6::int IS NULL OR su.exam_type_id = $6::int)
        GROUP BY su.id, c.class_name, sec.section_name, sub.subject_name, et.exam_name
        ORDER BY su.created_at DESC, su.id DESC
        `,
        context.schoolId,
        context.academicYearId,
        classId,
        sectionId,
        subjectId,
        examTypeId
      );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return apiError(
      error,
      "Failed to load syllabus"
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
        "Login required before creating syllabus."
      );
    }

    const body = await request.json();
    const mutation =
      await resolveMutationContext(
        request,
        body
      );
    const context =
      mutation.context;

    if (!context) {
      return validationError(
        mutation.error ||
          "School/College and academic year context is required."
      );
    }

    const schoolId =
      toNumber(body.school_id) ??
      context.requiredSchoolId;
    const academicYearId =
      toNumber(body.academic_year_id) ??
      context.requiredAcademicYearId;
    const classId = toNumber(
      body.class_id
    );
    const sectionId = toNumber(
      body.section_id
    );
    const subjectId = toNumber(
      body.subject_id
    );
    const examTypeId = toNumber(
      body.exam_type_id
    );
    const teacherId = toNumber(
      body.teacher_id
    );
    const title = text(body.title);

    if (!schoolId) {
      return validationError(
        "Select a school before creating syllabus."
      );
    }

    if (!academicYearId) {
      return validationError(
        "Select an academic year before creating syllabus."
      );
    }

    if (
      !classId ||
      !sectionId ||
      !subjectId ||
      !examTypeId ||
      !teacherId ||
      !title
    ) {
      return validationError(
        "Class, section, subject, exam type, staff, and syllabus title are required."
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        { id: number }[]
      >(
        `
        INSERT INTO syllabus_units (
          school_id,
          academic_year_id,
          class_id,
          section_id,
          subject_id,
          exam_type_id,
          title,
          description,
          total_periods,
          target_completion_percent,
          start_date,
          target_date,
          status,
          created_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::date,$12::date,$13,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING id
        `,
        schoolId,
        academicYearId,
        classId,
        sectionId,
        subjectId,
        examTypeId,
        title,
        text(body.description) || null,
        toNumber(body.total_periods) ?? 0,
        Number(
          body.target_completion_percent ||
            100
        ),
        text(body.start_date) || null,
        text(body.target_date) || null,
        text(body.status) || "PLANNED",
        user.id || null
      );
    const syllabusId = rows[0]?.id;

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO syllabus_staff_assignments (
        syllabus_unit_id,
        teacher_id,
        assigned_by,
        expected_completion_percent,
        actual_completion_percent,
        completed_periods,
        status,
        remarks,
        assigned_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,0,0,'ASSIGNED',$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      `,
      syllabusId,
      teacherId,
      user.id || null,
      Number(
        body.expected_completion_percent ||
          body.target_completion_percent ||
          100
      ),
      text(body.remarks) || null
    );

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "SYLLABUS_CREATED",
      action: "create",
      entity_type: "syllabus",
      entity_id: syllabusId,
      summary:
        "Syllabus created and assigned to staff",
      payload: {
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId,
        exam_type_id: examTypeId,
        teacher_id: teacherId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: syllabusId,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return apiError(
      error,
      "Failed to create syllabus"
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before updating syllabus progress."
      );
    }

    const body = await request.json();
    const assignmentId = toNumber(
      body.assignment_id
    );

    if (!assignmentId) {
      return validationError(
        "Assignment is required."
      );
    }

    const actual = Math.max(
      0,
      Math.min(
        100,
        Number(
          body.actual_completion_percent ||
            0
        )
      )
    );
    const completedPeriods =
      toNumber(
        body.completed_periods
      ) ?? 0;
    const status =
      actual >= 100
        ? "COMPLETED"
        : text(body.status) ||
          "IN_PROGRESS";

    await prisma.$executeRawUnsafe(
      `
      UPDATE syllabus_staff_assignments
      SET actual_completion_percent = $2,
          completed_periods = $3,
          status = $4,
          remarks = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      assignmentId,
      actual,
      completedPeriods,
      status,
      text(body.remarks) || null
    );

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT su.*
        FROM syllabus_staff_assignments ssa
        JOIN syllabus_units su ON su.id = ssa.syllabus_unit_id
        WHERE ssa.id = $1
        LIMIT 1
        `,
        assignmentId
      );
    const syllabus = rows[0];

    await recordEvent({
      school_id:
        Number(syllabus?.school_id) ||
        null,
      academic_year_id:
        Number(
          syllabus?.academic_year_id
        ) || null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "SYLLABUS_PROGRESS_UPDATED",
      action: "update",
      entity_type: "syllabus",
      entity_id:
        Number(syllabus?.id) ||
        assignmentId,
      summary:
        "Syllabus completion updated",
      payload: {
        assignment_id:
          assignmentId,
        actual_completion_percent:
          actual,
        completed_periods:
          completedPeriods,
        status,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return apiError(
      error,
      "Failed to update syllabus progress"
    );
  }
}
