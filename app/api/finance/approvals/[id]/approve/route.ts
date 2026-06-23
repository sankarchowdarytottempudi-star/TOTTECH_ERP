import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";

type Approval = {
  id: number;
  school_id: number | null;
  academic_year_id: number | null;
  entity_type: string;
  entity_id: number | null;
  workflow_type: string;
  requested_amount: string | number | null;
};

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
      module: "finance",
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

  const existingRows =
    await prisma.$queryRawUnsafe<
      Approval[]
    >(
      "SELECT * FROM finance_approval_ledger WHERE id = $1",
      Number(id)
    );
  const existing =
    existingRows[0];

  if (!existing) {
    return NextResponse.json(
      {
        error:
          "Finance approval not found.",
      },
      {
        status: 404,
      }
    );
  }

  const status =
    decision === "APPROVE"
      ? "APPROVED"
      : "REJECTED";
  const approvedAmount =
    body.approved_amount ??
    existing.requested_amount;

  const rows =
    await prisma.$queryRawUnsafe<
      Approval[]
    >(
      `
      UPDATE finance_approval_ledger
      SET status = $1::varchar,
          approved_amount = $2,
          approved_by = CASE WHEN $1::varchar = 'APPROVED' THEN $3::int ELSE approved_by END,
          approved_at = CASE WHEN $1::varchar = 'APPROVED' THEN CURRENT_TIMESTAMP ELSE approved_at END,
          metadata = COALESCE(metadata, '{}'::jsonb) || $4::jsonb,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5::int
      RETURNING *
      `,
      status,
      approvedAmount,
      auth.user?.id ?? null,
      JSON.stringify({
        comments:
          body.comments ?? null,
      }),
      Number(id)
    );
  const approval =
    rows[0];

  if (
    approval.entity_type ===
      "invoice" &&
    approval.entity_id
  ) {
    const invoiceRows =
      await prisma.$queryRawUnsafe<
        {
          status: string | null;
          total_amount:
            | string
            | number
            | null;
        }[]
      >(
        "SELECT status, total_amount FROM invoices WHERE id = $1",
        approval.entity_id
      );
    const previous =
      invoiceRows[0];

    await prisma.$executeRawUnsafe(
      `
      UPDATE invoices
      SET status = $1
      WHERE id = $2
      `,
      status === "APPROVED"
        ? "APPROVED"
        : "REJECTED",
      approval.entity_id
    );

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO invoice_audit_logs (
        invoice_id,
        school_id,
        academic_year_id,
        actor_user_id,
        action,
        previous_status,
        new_status,
        amount,
        comments,
        metadata
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb)
      `,
      approval.entity_id,
      approval.school_id,
      approval.academic_year_id,
      auth.user?.id ?? null,
      "APPROVAL",
      previous?.status ?? null,
      status,
      approvedAmount ??
        previous?.total_amount ??
        null,
      body.comments ?? null,
      JSON.stringify({
        approvalId:
          approval.id,
      })
    );
  }

  if (
    approval.entity_type ===
      "concession" &&
    approval.entity_id
  ) {
    await prisma.$executeRawUnsafe(
      `
      UPDATE concession_requests
      SET status = $1,
          approved_amount = $2,
          reviewed_by = $3,
          reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $4
      `,
      status,
      approvedAmount,
      auth.user?.id ?? null,
      approval.entity_id
    );

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO concession_audit_logs (
        concession_request_id,
        school_id,
        actor_user_id,
        action,
        new_status,
        comments,
        metadata
      )
      VALUES ($1,$2,$3,'APPROVAL',$4,$5,$6::jsonb)
      `,
      approval.entity_id,
      approval.school_id,
      auth.user?.id ?? null,
      status,
      body.comments ?? null,
      JSON.stringify({
        approvalId:
          approval.id,
      })
    );
  }

  await recordEvent({
    school_id: approval.school_id,
    academic_year_id:
      approval.academic_year_id,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "finance",
    event_type:
      `FINANCE_APPROVAL_${status}`,
    action:
      decision.toLowerCase(),
    entity_type:
      approval.entity_type,
    entity_id:
      approval.entity_id,
    summary:
      `Finance approval ${status.toLowerCase()}`,
    payload: {
      approvalId:
        approval.id,
      workflowType:
        approval.workflow_type,
      approvedAmount,
      comments:
        body.comments ?? null,
    },
  });

  return NextResponse.json({
    approval,
  });
}
