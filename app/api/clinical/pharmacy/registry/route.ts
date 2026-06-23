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

  const [counts, modules, reports] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'pharmacy_%') AS pharmacy_tables,
          (SELECT COUNT(*)::int FROM pharmacy_screen_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS screens,
          (SELECT COUNT(*)::int FROM pharmacy_api_endpoint_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS api_endpoints,
          (SELECT COUNT(*)::int FROM pharmacy_report_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS reports,
          (SELECT COUNT(*)::int FROM pharmacy_medicines WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS medicines,
          (SELECT COUNT(*)::int FROM pharmacy_vendors WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS vendors,
          (SELECT COUNT(*)::int FROM pharmacy_purchase_orders WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false AND status NOT IN ('CLOSED','CANCELLED')) AS pending_pos,
          (SELECT COUNT(*)::int FROM pharmacy_grns WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false AND status IN ('DRAFT','RECEIVED')) AS grn_pending,
          (SELECT COUNT(*)::int FROM pharmacy_inventory WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false AND inventory_status = 'LOW_STOCK') AS low_stock,
          (SELECT COUNT(*)::int FROM pharmacy_inventory WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false AND inventory_status = 'OUT_OF_STOCK') AS out_of_stock,
          (SELECT COUNT(*)::int FROM pharmacy_batches WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false AND expiry_date <= CURRENT_DATE + INTERVAL '90 days') AS near_expiry,
          (SELECT COALESCE(SUM(total), 0)::numeric FROM pharmacy_retail_sales WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false AND sale_date = CURRENT_DATE) AS sales_today,
          (SELECT COALESCE(SUM(total), 0)::numeric FROM pharmacy_retail_sales WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS revenue
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT module_key, COUNT(*)::int AS screen_count
        FROM pharmacy_screen_definitions
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
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT module_key, report_key, report_name, report_category, output_formats
        FROM pharmacy_report_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        ORDER BY report_category, module_key, report_name
        LIMIT 160
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
  });
}
