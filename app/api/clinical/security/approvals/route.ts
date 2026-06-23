import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const [workflows, steps] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT workflow_key, workflow_name, module_key, action_key, trigger_condition, approver_roles, sla_hours
        FROM clinical_security_approval_workflows
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
        ORDER BY workflow_name
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT workflow_key, step_order, step_name, approver_role, action_required
        FROM clinical_security_workflow_steps
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
        ORDER BY workflow_key, step_order
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    context,
    workflows,
    steps,
  });
}
