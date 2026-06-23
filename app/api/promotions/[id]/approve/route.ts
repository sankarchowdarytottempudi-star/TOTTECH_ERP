import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";

export async function POST(
  request: Request,
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
  const body =
    await request.json();
  const decision = String(
    body.decision ?? "APPROVE"
  ).toUpperCase();

  if (
    decision !== "APPROVE" &&
    decision !== "REJECT"
  ) {
    return NextResponse.json(
      {
        error:
          "Decision must be APPROVE or REJECT.",
      },
      {
        status: 400,
      }
    );
  }

  const status =
    decision === "APPROVE"
      ? "APPROVED"
      : "REJECTED";
  const rows =
    await prisma.$queryRawUnsafe<
      {
        id: number;
        school_id: number | null;
        source_academic_year_id:
          | number
          | null;
        approval_status: string | null;
        approved_by: number | null;
        approved_at: Date | null;
        updated_at: Date | null;
      }[]
    >(
      `
      UPDATE promotion_workflows
      SET approval_status = $1::varchar,
          approved_by = CASE WHEN $1::varchar = 'APPROVED' THEN $2::int ELSE approved_by END,
          approved_at = CASE WHEN $1::varchar = 'APPROVED' THEN CURRENT_TIMESTAMP ELSE approved_at END,
          updated_at = CURRENT_TIMESTAMP,
          metadata = COALESCE(metadata, '{}'::jsonb) || $3::jsonb
      WHERE id = $4::int
      RETURNING id, school_id, source_academic_year_id, approval_status, approved_by, approved_at, updated_at
      `,
      status,
      auth.user?.id ?? null,
      JSON.stringify({
        approvalComments:
          body.comments ?? null,
      }),
      Number(id)
    );

  const workflow = rows[0];

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

  await recordEvent({
    school_id: workflow.school_id,
    academic_year_id:
      workflow.source_academic_year_id,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "promotions",
    event_type:
      `PROMOTION_WORKFLOW_${status}`,
    action:
      decision.toLowerCase(),
    entity_type:
      "promotion_workflow",
    entity_id: workflow.id,
    summary:
      `Promotion workflow ${status.toLowerCase()}`,
    payload: {
      workflowId: workflow.id,
      comments:
        body.comments ?? null,
    },
  });

  return NextResponse.json({
    workflow,
  });
}
