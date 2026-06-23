import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";

type Workflow = {
  id: number;
  school_id: number | null;
  source_academic_year_id: number | null;
  target_academic_year_id: number | null;
  to_class_id: number | null;
  to_section_id: number | null;
  approval_status: string;
};

type WorkflowStudent = {
  student_id: number;
  source_class_id: number | null;
  source_section_id: number | null;
  target_class_id: number | null;
  target_section_id: number | null;
};

export async function POST(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const auth =
    await requirePermission({
      module: "promotions",
      action: "approve",
    });

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const workflows =
    await prisma.$queryRawUnsafe<
      Workflow[]
    >(
      "SELECT * FROM promotion_workflows WHERE id = $1",
      Number(id)
    );
  const workflow = workflows[0];

  if (!workflow) {
    return NextResponse.json(
      {
        error:
          "Promotion workflow not found.",
      },
      {
        status: 404,
      }
    );
  }

  if (
    workflow.approval_status !==
    "APPROVED"
  ) {
    return NextResponse.json(
      {
        error:
          "Promotion workflow must be approved before execution.",
      },
      {
        status: 400,
      }
    );
  }

  const targetYears =
    await prisma.$queryRawUnsafe<
      {
        id: number;
        academic_year: string | null;
      }[]
    >(
      "SELECT id, academic_year FROM academic_years WHERE id = $1",
      workflow.target_academic_year_id
    );
  const targetYear =
    targetYears[0];

  if (!targetYear) {
    return NextResponse.json(
      {
        error:
          "Target academic year not found.",
      },
      {
        status: 400,
      }
    );
  }

  const students =
    await prisma.$queryRawUnsafe<
      WorkflowStudent[]
    >(
      `
      SELECT student_id, source_class_id, source_section_id, target_class_id, target_section_id
      FROM promotion_workflow_students
      WHERE workflow_id = $1
        AND status <> 'EXECUTED'
      ORDER BY id ASC
      `,
      workflow.id
    );

  const school =
    await prisma.schools.findUnique({
      where: {
        id: workflow.school_id ?? undefined,
      },
      select: {
        settings: true,
      },
    });
  const backlogMode = String(
    (school?.settings as Record<string, unknown> | null | undefined)
      ?.backlog_promotion_mode || "WARNING"
  )
    .trim()
    .toUpperCase();
  const pendingBacklogs =
    await prisma.$queryRawUnsafe<
      { student_id: number }[]
    >(
      `
      SELECT DISTINCT sb.student_id
      FROM student_backlogs sb
      WHERE sb.student_id = ANY($1::int[])
        AND COALESCE(UPPER(sb.backlog_status), 'PENDING') <> 'CLEARED'
      `,
      students.map((student) => student.student_id)
    );

  if (backlogMode === "BLOCK" && pendingBacklogs.length) {
    return NextResponse.json(
      {
        error:
          "Promotion execution blocked because one or more students still have uncleared backlogs.",
        backlog_mode: backlogMode,
        pending_backlog_student_ids:
          pendingBacklogs.map((row) => row.student_id),
      },
      {
        status: 400,
      }
    );
  }

  let executed = 0;

  for (const student of students) {
    const targetClassId =
      student.target_class_id ??
      workflow.to_class_id;
    const targetSectionId =
      student.target_section_id ??
      workflow.to_section_id;

    await prisma.$transaction([
      prisma.$executeRawUnsafe(
        `
        UPDATE students
        SET academic_year_id = $1,
            academic_year = $2,
            current_class_id = $3,
            current_section_id = $4,
            section_id = COALESCE($4, section_id),
            student_status = 'PROMOTED',
            is_active = true,
            status_updated_at = CURRENT_TIMESTAMP,
            status_reason = 'Promoted to next academic year',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        `,
        targetYear.id,
        targetYear.academic_year,
        targetClassId,
        targetSectionId,
        student.student_id
      ),
      prisma.$executeRawUnsafe(
        `
        INSERT INTO student_year_enrollments (
          school_id,
          student_id,
          academic_year_id,
          class_id,
          section_id,
          status,
          source,
          metadata
        )
        VALUES ($1,$2,$3,$4,$5,'ACTIVE','promotion',$6::jsonb)
        ON CONFLICT (student_id, academic_year_id)
        DO UPDATE SET
          class_id = EXCLUDED.class_id,
          section_id = EXCLUDED.section_id,
          status = 'ACTIVE',
          updated_at = CURRENT_TIMESTAMP,
          metadata = EXCLUDED.metadata
        `,
        workflow.school_id,
        student.student_id,
        targetYear.id,
        targetClassId,
        targetSectionId,
        JSON.stringify({
          workflowId:
            workflow.id,
        })
      ),
      prisma.$executeRawUnsafe(
        `
        INSERT INTO student_academic_history (
          student_id,
          school_id,
          academic_year_id,
          class_id,
          section_id,
          promotion_status,
          promoted_on,
          created_by,
          metadata
        )
        VALUES ($1,$2,$3,$4,$5,'PROMOTED',CURRENT_TIMESTAMP,$6,$7::jsonb)
        `,
        student.student_id,
        workflow.school_id,
        targetYear.id,
        targetClassId,
        targetSectionId,
        auth.user?.id ?? null,
        JSON.stringify({
          workflowId: workflow.id,
          sourceAcademicYearId:
            workflow.source_academic_year_id,
        })
      ),
      prisma.$executeRawUnsafe(
        `
        INSERT INTO student_promotions (
          school_id,
          student_id,
          from_class_id,
          from_section_id,
          to_class_id,
          to_section_id,
          academic_year,
          source_academic_year_id,
          target_academic_year_id,
          promotion_date,
          promoted_by,
          promoted_by_user_id,
          approval_status,
          approved_by,
          approved_at,
          metadata
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_DATE,'SYSTEM',$10,'APPROVED',$10,CURRENT_TIMESTAMP,$11::jsonb)
        `,
        workflow.school_id,
        student.student_id,
        student.source_class_id,
        student.source_section_id,
        targetClassId,
        targetSectionId,
        targetYear.academic_year,
        workflow.source_academic_year_id,
        targetYear.id,
        auth.user?.id ?? null,
        JSON.stringify({
          workflowId:
            workflow.id,
        })
      ),
      prisma.$executeRawUnsafe(
        `
        UPDATE promotion_workflow_students
        SET status = 'EXECUTED',
            updated_at = CURRENT_TIMESTAMP
        WHERE workflow_id = $1
          AND student_id = $2
        `,
        workflow.id,
        student.student_id
      ),
    ]);

    executed += 1;
  }

  await prisma.$executeRawUnsafe(
    `
    UPDATE promotion_workflows
    SET approval_status = 'EXECUTED',
        executed_by = $1,
        executed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    `,
    auth.user?.id ?? null,
    workflow.id
  );

  await recordEvent({
    school_id: workflow.school_id,
    academic_year_id:
      workflow.target_academic_year_id,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "promotions",
    event_type:
      "PROMOTION_WORKFLOW_EXECUTED",
    action: "execute",
    entity_type:
      "promotion_workflow",
    entity_id: workflow.id,
    summary:
      "Promotion workflow executed",
    payload: {
      workflowId: workflow.id,
      executed,
      targetAcademicYear:
        targetYear.academic_year,
    },
  });

  return NextResponse.json({
    workflowId: workflow.id,
    executed,
  });
}
