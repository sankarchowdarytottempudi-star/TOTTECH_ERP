import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

const allowedTransitions = new Set([
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "SETTLED",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const { id } = await params;
  const claimId = Number(id);
  const body = await request.json();
  const status = String(body.status || "").toUpperCase();
  if (!allowedTransitions.has(status)) {
    return NextResponse.json({ error: "Unsupported insurance claim status." }, { status: 400 });
  }
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE insurance_claims
    SET status=$5,
        approved_amount=COALESCE($6::numeric, approved_amount),
        rejected_amount=COALESCE($7::numeric, rejected_amount),
        settled_amount=COALESCE($8::numeric, settled_amount),
        pending_amount=GREATEST(COALESCE(claimed_amount,0)-COALESCE($8::numeric, settled_amount,0),0),
        updated_by=$9,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
    RETURNING *
    `,
    claimId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    status,
    body.approved_amount ?? null,
    body.rejected_amount ?? null,
    body.settled_amount ?? null,
    context.user.id ?? null
  );
  if (!rows[0]) {
    return NextResponse.json({ error: "Claim not found." }, { status: 404 });
  }
  await recordClinicalAudit(context, {
    moduleName: "insurance_claims",
    action: "workflow_transition",
    entityType: "insurance_claims",
    entityId: claimId,
    summary: `Insurance claim moved to ${status}`,
    payload: { status, body },
  });
  return NextResponse.json(rows[0]);
}
