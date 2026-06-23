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
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT user_id, role_key, action_key, module_key, record_type, outcome, data_masked, created_at
      FROM clinical_security_access_logs
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 300
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

  return NextResponse.json({
    context,
    rows,
  });
}
