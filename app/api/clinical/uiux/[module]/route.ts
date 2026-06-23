import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { getUiuxModuleConfig } from "@/lib/clinical/uiux-core";
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
    getUiuxModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown clinical UI/UX blueprint module.",
      },
      { status: 404 }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const moduleKey =
    searchParams?.get("module_key");
  const category =
    searchParams?.get("category");

  const paramsList: unknown[] = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];
  const filters: string[] = [];

  if (
    moduleKey &&
    [
      "screen-specs",
      "dashboards",
      "api-blueprints",
      "report-blueprints",
    ].includes(config.key)
  ) {
    filters.push(
      `AND t.module_key = $${paramsList.length + 1}`
    );
    paramsList.push(moduleKey);
  }

  if (
    category &&
    config.key === "components"
  ) {
    filters.push(
      `AND t.component_category = $${paramsList.length + 1}`
    );
    paramsList.push(category);
  }

  const [rows, metrics, screenCounts] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT t.*
        FROM ${config.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
          ${filters.join("\n")}
        ORDER BY t.${config.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT 300
        `,
        ...paramsList
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
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT module_key, COUNT(*)::int AS screen_count
        FROM clinical_ui_screen_specs
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        GROUP BY module_key
        ORDER BY module_key
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
    screenCounts,
  });
}
