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
  const [roles, matrixCounts] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT role_key, role_name, role_category, hierarchy_rank, mfa_required, break_glass_allowed
        FROM clinical_security_roles
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
        ORDER BY hierarchy_rank, role_name
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT role_key, COUNT(*)::int AS permission_count
        FROM clinical_security_role_permissions
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
        GROUP BY role_key
        ORDER BY permission_count DESC
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    context,
    roles,
    matrixCounts,
  });
}
