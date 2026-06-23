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

  const [counts, modules, reports, dashboards] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'clinical_analytics_%') AS analytics_tables,
          (SELECT COUNT(*)::int FROM clinical_analytics_screen_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS screens,
          (SELECT COUNT(*)::int FROM clinical_analytics_api_endpoint_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS api_endpoints,
          (SELECT COUNT(*)::int FROM clinical_analytics_report_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS reports,
          (SELECT COUNT(*)::int FROM clinical_analytics_kpis WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS kpis,
          (SELECT COUNT(*)::int FROM clinical_analytics_dashboards WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS dashboards,
          (SELECT COUNT(*)::int FROM clinical_analytics_ai_insights WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS ai_insights,
          (SELECT COUNT(*)::int FROM clinical_analytics_forecast_models WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS forecast_models,
          (SELECT COUNT(*)::int FROM clinical_analytics_alerts WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS alerts,
          (SELECT COUNT(*)::int FROM clinical_analytics_report_schedules WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS schedules,
          (SELECT COUNT(*)::int FROM clinical_analytics_data_warehouse_jobs WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS warehouse_jobs,
          (SELECT COUNT(*)::int FROM clinical_analytics_export_jobs WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS export_jobs
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          module_key,
          dashboard_type,
          COUNT(*)::int AS screen_count,
          MIN(route_path) AS route_path
        FROM clinical_analytics_screen_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        GROUP BY module_key, dashboard_type
        ORDER BY dashboard_type, module_key
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT module_key, report_key, report_name, report_category, output_formats
        FROM clinical_analytics_report_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        ORDER BY report_category, module_key, report_name
        LIMIT 220
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT dashboard_key, dashboard_name, dashboard_type, audience_role, refresh_interval_seconds, status
        FROM clinical_analytics_dashboards
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        ORDER BY dashboard_type, dashboard_name
        LIMIT 80
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    modules,
    reports,
    dashboards,
  });
}
