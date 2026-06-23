import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";

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

export async function GET() {
  const auth =
    await requirePermission({
      module: "finance",
      action: "view_approvals",
    });

  if (auth.response) {
    return auth.response;
  }

  const schoolId =
    auth.user?.school_id ?? null;
  const approvals =
    await prisma.$queryRawUnsafe(
      `
      SELECT fal.*, ay.academic_year
      FROM finance_approval_ledger fal
      LEFT JOIN academic_years ay ON ay.id = fal.academic_year_id
      WHERE ($1::int IS NULL OR fal.school_id = $1::int)
      ORDER BY fal.created_at DESC
      LIMIT 200
      `,
      schoolId
    );

  return NextResponse.json({
    approvals,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "finance",
      action: "view_approvals",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const schoolId =
    numberOrNull(body.school_id) ??
    auth.user?.school_id ??
    null;
  const academicYearId =
    numberOrNull(
      body.academic_year_id
    ) ??
    (
      await prisma.academic_years.findFirst({
        where: schoolId
          ? {
              school_id: schoolId,
              is_current: true,
            }
          : {
              is_current: true,
            },
        orderBy: {
          id: "desc",
        },
      })
    )?.id ??
    null;
  const entityType = String(
    body.entity_type ?? "invoice"
  ).toLowerCase();
  const workflowType = String(
    body.workflow_type ??
      `${entityType}_approval`
  ).toUpperCase();

  const rows =
    await prisma.$queryRawUnsafe<
      {
        id: number;
      }[]
    >(
      `
      INSERT INTO finance_approval_ledger (
        school_id,
        academic_year_id,
        entity_type,
        entity_id,
        workflow_type,
        requested_amount,
        status,
        requested_by,
        reason,
        metadata
      )
      VALUES ($1,$2,$3,$4,$5,$6,'PENDING',$7,$8,$9::jsonb)
      RETURNING id
      `,
      schoolId,
      academicYearId,
      entityType,
      numberOrNull(body.entity_id),
      workflowType,
      numberOrNull(
        body.requested_amount
      ),
      auth.user?.id ?? null,
      body.reason ?? null,
      JSON.stringify(
        body.metadata ?? {}
      )
    );
  const approvalId =
    rows[0]?.id;

  await recordEvent({
    school_id: schoolId,
    academic_year_id:
      academicYearId,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "finance",
    event_type:
      "FINANCE_APPROVAL_REQUESTED",
    action: "request",
    entity_type: entityType,
    entity_id:
      numberOrNull(body.entity_id),
    summary:
      "Finance approval requested",
    payload: {
      approvalId,
      workflowType,
    },
  });

  const approval =
    await prisma.$queryRawUnsafe(
      "SELECT * FROM finance_approval_ledger WHERE id = $1",
      approvalId
    );

  return NextResponse.json(
    {
      approval:
        Array.isArray(approval)
          ? approval[0]
          : approval,
    },
    {
      status: 201,
    }
  );
}
