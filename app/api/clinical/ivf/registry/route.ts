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

  const [counts, modules, reports, kpis] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'ivf_%') AS ivf_tables,
          (SELECT COUNT(*)::int FROM ivf_screen_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS screens,
          (SELECT COUNT(*)::int FROM ivf_api_endpoint_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS api_endpoints,
          (SELECT COUNT(*)::int FROM ivf_report_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS reports,
          (SELECT COUNT(*)::int FROM ivf_couples WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS couples,
          (SELECT COUNT(*)::int FROM ivf_cycles WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS cycles,
          (SELECT COUNT(*)::int FROM ivf_retrievals WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS retrievals,
          (SELECT COUNT(*)::int FROM ivf_embryo_transfers WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS transfers,
          (SELECT COUNT(*)::int FROM ivf_pregnancies WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS pregnancies,
          (SELECT COALESCE(SUM(total), 0)::numeric FROM ivf_billing WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS revenue
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT module_key, COUNT(*)::int AS screen_count
        FROM ivf_screen_definitions
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
        FROM ivf_report_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        ORDER BY report_category, module_key, report_name
        LIMIT 150
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          COUNT(*) FILTER (WHERE p.pregnancy_outcome = 'Clinical Pregnancy')::int AS clinical_pregnancies,
          COUNT(*) FILTER (WHERE p.pregnancy_outcome = 'Live Birth')::int AS live_births,
          COUNT(*) FILTER (WHERE p.pregnancy_outcome IN ('Miscarriage','Failed','Ectopic Pregnancy'))::int AS failed_cycles,
          COUNT(*) FILTER (WHERE e.current_status = 'FROZEN')::int AS frozen_embryos,
          COUNT(*) FILTER (WHERE e.current_status = 'TRANSFERRED')::int AS transferred_embryos
        FROM ivf_couples c
        LEFT JOIN ivf_cycles cy ON cy.couple_id = c.id AND COALESCE(cy.is_deleted,false) = false
        LEFT JOIN ivf_pregnancies p ON p.cycle_id = cy.id AND COALESCE(p.is_deleted,false) = false
        LEFT JOIN ivf_embryos e ON e.cycle_id = cy.id AND COALESCE(e.is_deleted,false) = false
        WHERE c.tenant_id = $1
          AND c.hospital_id = $2
          AND c.branch_id = $3
          AND COALESCE(c.is_deleted,false) = false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    kpis: kpis[0] || {},
    modules,
    reports,
  });
}
