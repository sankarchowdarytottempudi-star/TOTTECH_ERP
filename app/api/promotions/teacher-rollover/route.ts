import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";

const numberOrNull = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const numberArray = (
  value: unknown
) =>
  Array.isArray(value)
    ? value
        .map((item) => numberOrNull(item))
        .filter(
          (item): item is number =>
            typeof item === "number"
        )
    : [];

export async function GET(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "promotions",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const { searchParams } =
    new URL(request.url);
  const schoolId =
    auth.user?.role === "SUPER_ADMIN"
      ? numberOrNull(
          searchParams?.get("school_id")
        ) ??
        auth.user?.school_id ??
        null
      : auth.user?.school_id ?? null;
  const sourceYearId =
    numberOrNull(
      searchParams?.get(
        "source_academic_year_id"
      )
    );
  const targetYearId =
    numberOrNull(
      searchParams?.get(
        "target_academic_year_id"
      )
    );

  const [teachers, history] =
    await Promise.all([
      prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
      `
      SELECT
        t.id,
        t.school_id,
        t.academic_year_id AS current_academic_year_id,
        ay.academic_year AS current_academic_year,
        t.employee_id,
        TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name,
        t.designation,
        t.department,
        COUNT(DISTINCT tca.id)::int AS assignment_count,
        COUNT(DISTINCT target_tca.id)::int AS target_assignment_count,
        MAX(tr.created_at) AS last_rollover_at,
        MAX(tr.action) AS last_rollover_action
      FROM teachers t
      LEFT JOIN academic_years ay ON ay.id = t.academic_year_id
      LEFT JOIN teacher_class_assignments tca
        ON tca.teacher_id = t.id
        AND tca.status = 'ACTIVE'
        AND ($2::int IS NULL OR tca.academic_year_id = $2::int)
      LEFT JOIN teacher_class_assignments target_tca
        ON target_tca.teacher_id = t.id
        AND target_tca.status = 'ACTIVE'
        AND ($3::int IS NULL OR target_tca.academic_year_id = $3::int)
      LEFT JOIN teacher_rollovers tr
        ON tr.teacher_id = t.id
        AND tr.school_id = t.school_id
        AND ($2::int IS NULL OR tr.source_academic_year_id = $2::int)
        AND ($3::int IS NULL OR tr.target_academic_year_id = $3::int)
      WHERE ($1::int IS NULL OR t.school_id = $1::int)
        AND COALESCE(t.is_active, true) = true
        AND (
          $2::int IS NULL
          OR t.academic_year_id = $2::int
          OR t.academic_year_id IS NULL
          OR tca.id IS NOT NULL
        )
      GROUP BY t.id, ay.academic_year
      ORDER BY teacher_name ASC
      LIMIT 300
      `,
      schoolId,
      sourceYearId,
      targetYearId
      ),
      prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT
          tr.*,
          TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name,
          source_year.academic_year AS source_academic_year,
          target_year.academic_year AS target_academic_year
        FROM teacher_rollovers tr
        LEFT JOIN teachers t ON t.id = tr.teacher_id
        LEFT JOIN academic_years source_year ON source_year.id = tr.source_academic_year_id
        LEFT JOIN academic_years target_year ON target_year.id = tr.target_academic_year_id
        WHERE ($1::int IS NULL OR tr.school_id = $1::int)
          AND ($2::int IS NULL OR tr.source_academic_year_id = $2::int)
          AND ($3::int IS NULL OR tr.target_academic_year_id = $3::int)
        ORDER BY tr.created_at DESC NULLS LAST, tr.id DESC
        LIMIT 50
        `,
        schoolId,
        sourceYearId,
        targetYearId
      ),
    ]);

  return NextResponse.json({
    teachers,
    history,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "promotions",
      action: "create",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const schoolId =
    auth.user?.role === "SUPER_ADMIN"
      ? numberOrNull(body.school_id) ??
        auth.user?.school_id ??
        null
      : auth.user?.school_id ?? null;
  const sourceYearId = numberOrNull(
    body.source_academic_year_id
  );
  const targetYearId = numberOrNull(
    body.target_academic_year_id
  );
  const action = String(
    body.action || "CONTINUE"
  ).toUpperCase();
  const teacherIds =
    numberArray(body.teacher_ids);

  if (
    !schoolId ||
    !sourceYearId ||
    !targetYearId
  ) {
    return NextResponse.json(
      {
        error:
          "School/College, source academic year, and target academic year are required for teacher rollover.",
      },
      {
        status: 400,
      }
    );
  }

  if (sourceYearId === targetYearId) {
    return NextResponse.json(
      {
        error:
          "Target academic year must be different from source academic year.",
      },
      {
        status: 400,
      }
    );
  }

  if (!teacherIds.length) {
    return NextResponse.json(
      {
        error:
          "Select at least one teacher for rollover.",
      },
      {
        status: 400,
      }
    );
  }

  let processed = 0;
  let assignmentsCopied = 0;
  let teachersUpdated = 0;

  for (const teacherId of teacherIds) {
    const teacherRows =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT *
        FROM teachers
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        LIMIT 1
        `,
        teacherId,
        schoolId
      );
    const teacher =
      teacherRows[0];

    if (!teacher) {
      continue;
    }

    const sourceAssignments =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT *
        FROM teacher_class_assignments
        WHERE teacher_id = $1
          AND school_id = $2
          AND academic_year_id = $3
          AND status = 'ACTIVE'
        `,
        teacherId,
        schoolId,
        sourceYearId
      );

    if (
      action === "CONTINUE" ||
      action === "TRANSFER"
    ) {
      for (const assignment of sourceAssignments) {
        const insertRows =
          await prisma.$queryRawUnsafe<
            { id: number }[]
          >(
          `
          INSERT INTO teacher_class_assignments (
            school_id,
            academic_year_id,
            teacher_id,
            class_id,
            section_id,
            subject_id,
            assignment_type,
            status,
            assigned_by,
            metadata,
            created_at,
            updated_at
          )
          SELECT $1,$2,$3,$4,$5,$6,$7,'ACTIVE',$8,$9::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
          WHERE NOT EXISTS (
            SELECT 1
            FROM teacher_class_assignments existing
            WHERE existing.teacher_id = $3
              AND existing.academic_year_id = $2
              AND existing.class_id = $4
              AND COALESCE(existing.section_id, 0) = COALESCE($5, 0)
              AND existing.assignment_type = $7
              AND existing.status = 'ACTIVE'
          )
          RETURNING id
          `,
          schoolId,
          targetYearId,
          teacherId,
          Number(
            assignment.class_id
          ),
          Number(
            assignment.section_id
          ) || null,
          Number(
            assignment.subject_id
          ) || null,
          assignment.assignment_type ||
            "CLASS_TEACHER",
          auth.user?.id ?? null,
          JSON.stringify({
            source:
              "teacher_rollover",
            sourceAcademicYearId:
              sourceYearId,
            action,
          })
        );
        assignmentsCopied +=
          insertRows.length;
      }

      await prisma.teachers.update({
        where: {
          id: teacherId,
        },
        data: {
          academic_year_id:
            targetYearId,
          is_active: true,
          updated_at: new Date(),
        },
      });
      teachersUpdated += 1;
    }

    if (
      action === "DEACTIVATE"
    ) {
      await prisma.teachers.update({
        where: {
          id: teacherId,
        },
        data: {
          is_active: false,
          updated_at: new Date(),
        },
      });
    }

    const targetCount =
      await prisma.$queryRawUnsafe<
        {
          count: number;
        }[]
      >(
        `
        SELECT COUNT(*)::int AS count
        FROM teacher_class_assignments
        WHERE teacher_id = $1
          AND school_id = $2
          AND academic_year_id = $3
          AND status = 'ACTIVE'
        `,
        teacherId,
        schoolId,
        targetYearId
      );

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO teacher_rollovers (
        school_id,
        teacher_id,
        source_academic_year_id,
        target_academic_year_id,
        action,
        source_assignment_count,
        target_assignment_count,
        status,
        remarks,
        created_by,
        metadata
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,'COMPLETED',$8,$9,$10::jsonb)
      `,
      schoolId,
      teacherId,
      sourceYearId,
      targetYearId,
      action,
      sourceAssignments.length,
      targetCount[0]?.count || 0,
      body.remarks || null,
      auth.user?.id ?? null,
      JSON.stringify({
        source:
          "promotion_center",
        source_teacher_academic_year_id:
          teacher.academic_year_id,
        assignmentsCopied,
      })
    );

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        targetYearId,
      user_id: auth.user?.id,
      actor_role: auth.user?.role,
      module_name: "promotions",
      event_type:
        "TEACHER_ROLLED_OVER",
      action: "rollover",
      entity_type: "teacher",
      entity_id: teacherId,
      summary:
        action === "DEACTIVATE"
          ? "Teacher deactivated during academic-year rollover"
          : "Teacher rolled over to target academic year",
      payload: {
        action,
        sourceYearId,
        targetYearId,
        source_assignment_count:
          sourceAssignments.length,
        target_assignment_count:
          targetCount[0]?.count || 0,
      },
    });

    processed += 1;
  }

  await recordEvent({
    school_id: schoolId,
    academic_year_id:
      targetYearId,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "promotions",
    event_type:
      "TEACHER_ROLLOVER_COMPLETED",
    action: "rollover",
    entity_type:
      "teacher_rollover",
    summary:
      "Teacher rollover completed",
    payload: {
      action,
      processed,
      sourceYearId,
      targetYearId,
    },
  });

  return NextResponse.json({
    processed,
    assignmentsCopied,
    teachersUpdated,
  });
}
