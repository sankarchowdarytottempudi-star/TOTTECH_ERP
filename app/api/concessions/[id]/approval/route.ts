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
      module: "concessions",
      action: "approve",
    });

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const body =
    await request.json();
  const existing =
    await prisma.concession_requests.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!existing) {
    return NextResponse.json(
      {
        error:
          "Concession not found",
      },
      {
        status: 404,
      }
    );
  }

  const status =
    String(
      body.status ?? "APPROVED"
    ).toUpperCase();

  const concession =
    await prisma.concession_requests.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
        approved_amount:
          body.approved_amount ??
          existing.requested_amount,
        reviewed_by:
          auth.user?.id ?? null,
        reviewed_at: new Date(),
        metadata:
          body.metadata ??
          existing.metadata,
      },
    });

  if (
    status === "APPROVED" &&
    concession.invoice_id &&
    Number(
      concession.approved_amount || 0
    ) > 0
  ) {
    await prisma.$executeRawUnsafe(
      `
      UPDATE invoices
      SET balance_amount = GREATEST(COALESCE(balance_amount, 0) - $1, 0),
          status = CASE
            WHEN GREATEST(COALESCE(balance_amount, 0) - $1, 0) = 0 THEN 'PAID'
            ELSE 'PARTIAL'
          END,
          metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      Number(
        concession.approved_amount
      ),
      JSON.stringify({
        last_concession_id:
          concession.id,
        concession_applied_at:
          new Date().toISOString(),
      }),
      concession.invoice_id
    );
  }

  await prisma.concession_audit_logs.create({
    data: {
      concession_request_id:
        concession.id,
      school_id:
        concession.school_id,
      actor_user_id:
        auth.user?.id ?? null,
      action: "APPROVAL",
      previous_status:
        existing.status,
      new_status: status,
      comments:
        body.comments ?? null,
    },
  });

  await recordEvent({
    school_id:
      concession.school_id,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "concessions",
    event_type:
      "CONCESSION_APPROVAL",
    action:
      status.toLowerCase(),
    entity_type: "student",
    entity_id:
      concession.student_id,
    summary:
      `Concession ${status.toLowerCase()}`,
    payload: {
      concession_id:
        concession.id,
      approved_amount:
        concession.approved_amount,
    },
  });

  return NextResponse.json({
    concession,
  });
}
