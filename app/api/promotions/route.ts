import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";

type StudentRow = {
  id: number;
  source_class_id: number | null;
  source_section_id: number | null;
};

const numberOrNull = (
  value: unknown
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? parsed
    : null;
};

async function getOrCreateTargetYear(
  schoolId: number,
  targetAcademicYearId?: number | null
) {
  if (targetAcademicYearId) {
    return prisma.academic_years.findUnique({
      where: {
        id: targetAcademicYearId,
      },
    });
  }

  const current =
    await prisma.academic_years.findFirst({
      where: {
        school_id: schoolId,
        is_current: true,
      },
      orderBy: {
        id: "desc",
      },
    });

  if (!current?.academic_year) {
    return null;
  }

  const [start] =
    current.academic_year
      .split("-")
      .map(Number);
  const nextLabel = `${start + 1}-${start + 2}`;

  const existing =
    await prisma.academic_years.findFirst({
      where: {
        school_id: schoolId,
        academic_year: nextLabel,
      },
    });

  if (existing) {
    return existing;
  }

  return prisma.academic_years.create({
    data: {
      school_id: schoolId,
      academic_year: nextLabel,
      start_date: new Date(
        `${start + 1}-06-01T00:00:00.000Z`
      ),
      end_date: new Date(
        `${start + 2}-05-31T00:00:00.000Z`
      ),
      is_current: false,
    },
  });
}

export async function GET() {
  const auth =
    await requirePermission({
      module: "promotions",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const schoolId =
    auth.user?.school_id ?? null;

  const [workflows, legacy] =
    await Promise.all([
      prisma.$queryRawUnsafe(
        `
        SELECT pw.*, say.academic_year AS source_academic_year, tay.academic_year AS target_academic_year
        FROM promotion_workflows pw
        LEFT JOIN academic_years say ON say.id = pw.source_academic_year_id
        LEFT JOIN academic_years tay ON tay.id = pw.target_academic_year_id
        WHERE ($1::int IS NULL OR pw.school_id = $1::int)
        ORDER BY pw.created_at DESC
        LIMIT 100
        `,
        schoolId
      ),
      prisma.student_promotions.findMany({
        where: schoolId
          ? {
              school_id: schoolId,
            }
          : {},
        orderBy: {
          id: "desc",
        },
        take: 100,
      }),
    ]);

  return NextResponse.json({
    workflows,
    legacyPromotions: legacy,
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

  try {
    const body =
      await request.json();
    const schoolId =
      numberOrNull(body.school_id) ??
      auth.user?.school_id;

    if (!schoolId) {
      return NextResponse.json(
        {
          error:
            "School/College is required for promotion.",
        },
        {
          status: 400,
        }
      );
    }

    const school =
      await prisma.schools.findUnique({
        where: {
          id: schoolId,
        },
        select: {
          id: true,
          school_name: true,
          settings: true,
        },
      });
    const backlogMode = String(
      (school?.settings as Record<string, unknown> | null | undefined)
        ?.backlog_promotion_mode || "WARNING"
    )
      .trim()
      .toUpperCase();

    const sourceYearId =
      numberOrNull(
        body.source_academic_year_id
      ) ??
      numberOrNull(
        body.academic_year_id
      );
    const currentYear =
      sourceYearId
        ? await prisma.academic_years.findUnique({
            where: {
              id: sourceYearId,
            },
          })
        : await prisma.academic_years.findFirst({
            where: {
              school_id: schoolId,
              is_current: true,
            },
            orderBy: {
              id: "desc",
            },
          });
    const targetYear =
      await getOrCreateTargetYear(
        schoolId,
        numberOrNull(
          body.target_academic_year_id
        )
      );

    if (
      !currentYear ||
      !targetYear
    ) {
      return NextResponse.json(
        {
          error:
            "Source and target academic years are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      currentYear.id ===
      targetYear.id
    ) {
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

    const fromClassId =
      numberOrNull(body.from_class_id);
    const fromSectionId =
      numberOrNull(
        body.from_section_id
      );
    const toClassId =
      numberOrNull(body.to_class_id);
    const toSectionId =
      numberOrNull(body.to_section_id);

    if (!toClassId) {
      return NextResponse.json(
        {
          error:
            "Target class is required before creating a promotion workflow.",
        },
        {
          status: 400,
        }
      );
    }

    const targetClass =
      await prisma.classes.findFirst({
        where: {
          id: toClassId,
          school_id: schoolId,
        },
        select: {
          id: true,
        },
      });

    if (!targetClass) {
      return NextResponse.json(
        {
          error:
            "Target class does not belong to the selected school.",
        },
        {
          status: 400,
        }
      );
    }

    if (toSectionId) {
      const targetSection =
        await prisma.sections.findFirst({
          where: {
            id: toSectionId,
            school_id: schoolId,
            class_id: toClassId,
          },
          select: {
            id: true,
          },
        });

      if (!targetSection) {
        return NextResponse.json(
          {
            error:
              "Target section must belong to the target class and selected school.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const studentIds =
      Array.isArray(body.student_ids)
        ? body.student_ids
            .map((value: unknown) =>
              numberOrNull(value)
            )
            .filter(
              (
                id: number | null
              ): id is number =>
                typeof id === "number"
            )
        : [];

    const students =
      studentIds.length > 0
        ? await prisma.$queryRawUnsafe<StudentRow[]>(
            `
            SELECT s.id,
                   COALESCE(s.current_class_id, sec.class_id) AS source_class_id,
                   COALESCE(s.current_section_id, s.section_id) AS source_section_id
            FROM students s
            LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id)
            WHERE s.school_id = $1
              AND s.id = ANY($2::int[])
            `,
            schoolId,
            studentIds
          )
        : await prisma.$queryRawUnsafe<StudentRow[]>(
            `
            SELECT s.id,
                   COALESCE(s.current_class_id, sec.class_id) AS source_class_id,
                   COALESCE(s.current_section_id, s.section_id) AS source_section_id
            FROM students s
            LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id)
            WHERE s.school_id = $1
              AND ($2::int IS NULL OR COALESCE(s.current_class_id, sec.class_id) = $2::int)
              AND ($3::int IS NULL OR COALESCE(s.current_section_id, s.section_id) = $3::int)
              AND COALESCE(s.is_active, true) = true
            `,
            schoolId,
            fromClassId,
            fromSectionId
          );

    if (!students.length) {
      return NextResponse.json(
        {
          error:
            "No eligible students found for the selected promotion filters.",
        },
        {
          status: 400,
        }
      );
    }

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
        students.map((student) =>
          Number(student.id)
        )
      );

    if (
      backlogMode === "BLOCK" &&
      pendingBacklogs.length
    ) {
      return NextResponse.json(
        {
          error:
            "Promotion is blocked because one or more selected students have uncleared backlogs.",
          backlog_mode: backlogMode,
          pending_backlog_student_ids:
            pendingBacklogs.map(
              (row) => row.student_id
            ),
        },
        {
          status: 400,
        }
      );
    }

    const selectedIds =
      students.map((student) =>
        Number(student.id)
      );
    const duplicateRows =
      await prisma.$queryRawUnsafe<
        {
          student_id: number;
        }[]
      >(
        `
        SELECT student_id
        FROM student_year_enrollments
        WHERE academic_year_id = $1
          AND student_id = ANY($2::int[])
        LIMIT 10
        `,
        targetYear.id,
        selectedIds
      );

    if (duplicateRows.length) {
      return NextResponse.json(
        {
          error:
            "One or more selected students already have enrollment in the target academic year. Review promotion history before continuing.",
          duplicateStudentIds:
            duplicateRows.map(
              (row) => row.student_id
            ),
        },
        {
          status: 400,
        }
      );
    }

    const workflowRows =
      await prisma.$queryRawUnsafe<
        { id: number }[]
      >(
        `
        INSERT INTO promotion_workflows (
          school_id,
          source_academic_year_id,
          target_academic_year_id,
          from_class_id,
          from_section_id,
          to_class_id,
          to_section_id,
          promotion_mode,
          approval_status,
          requested_by,
          student_count,
          metadata
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'PENDING',$9,$10,$11::jsonb)
        RETURNING id
        `,
        schoolId,
        currentYear.id,
        targetYear.id,
        fromClassId,
        fromSectionId,
        toClassId,
        toSectionId,
        studentIds.length > 0
          ? "SELECTED"
          : "BULK",
        auth.user?.id ?? null,
        students.length,
        JSON.stringify({
          requestedFrom:
            "promotion_api",
          noOverwrite:
            true,
        })
      );
    const workflowId =
      workflowRows[0]?.id;

    for (const student of students) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO promotion_workflow_students (
          workflow_id,
          student_id,
          source_class_id,
          source_section_id,
          target_class_id,
          target_section_id,
          status
        )
        VALUES ($1,$2,$3,$4,$5,$6,'PENDING')
        ON CONFLICT (workflow_id, student_id) DO NOTHING
        `,
        workflowId,
        student.id,
        student.source_class_id,
        student.source_section_id,
        toClassId,
        toSectionId
      );
    }

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        currentYear.id,
      user_id: auth.user?.id,
      actor_role: auth.user?.role,
      module_name: "promotions",
      event_type:
        "PROMOTION_WORKFLOW_CREATED",
      action: "request",
      entity_type:
        "promotion_workflow",
      entity_id: workflowId,
      summary:
        "Promotion workflow requested",
      payload: {
        workflowId,
        studentCount:
          students.length,
        sourceAcademicYear:
          currentYear.academic_year,
        targetAcademicYear:
          targetYear.academic_year,
        backlogMode,
      },
    });

    const workflow =
      await prisma.$queryRawUnsafe(
        "SELECT * FROM promotion_workflows WHERE id = $1",
        workflowId
      );

    return NextResponse.json(
      {
        workflow:
          Array.isArray(workflow)
            ? workflow[0]
            : workflow,
        students,
        backlog_mode: backlogMode,
        backlog_warning:
          backlogMode === "WARNING" &&
          pendingBacklogs.length
            ? `Warning: ${pendingBacklogs.length} selected student(s) have uncleared backlogs.`
            : null,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Promotion workflow failed",
      },
      {
        status: 500,
      }
    );
  }
}
