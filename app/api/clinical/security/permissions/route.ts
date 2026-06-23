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
      SELECT module_key, action_key, resource_scope, COUNT(*)::int AS permission_count
      FROM clinical_security_permissions
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      GROUP BY module_key, action_key, resource_scope
      ORDER BY module_key, action_key, resource_scope
      LIMIT 500
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
