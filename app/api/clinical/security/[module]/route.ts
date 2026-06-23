import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { getSecurityModuleConfig } from "@/lib/clinical/security-core";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      module: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module } = await params;
  const config =
    getSecurityModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown clinical security module.",
      },
      { status: 404 }
    );
  }

  const [rows, metrics] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT t.*
        FROM ${config.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        ORDER BY t.${config.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT 400
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE t.${config.dateColumn}::date = CURRENT_DATE)::int AS today
        FROM ${config.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    context,
    module: config,
    metrics: metrics[0] || {},
    rows,
  });
}
