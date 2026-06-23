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
          (SELECT COUNT(*)::int FROM clinical_hms_screen_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS screens,
          (SELECT COUNT(*)::int FROM clinical_hms_api_endpoint_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS api_endpoints,
          (SELECT COUNT(*)::int FROM clinical_hms_report_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS reports,
          (SELECT COUNT(*)::int FROM patients WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS patients,
          (SELECT COUNT(*)::int FROM appointments WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS appointments,
          (SELECT COUNT(*)::int FROM op_visits WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS op_visits,
          (SELECT COUNT(*)::int FROM ip_admissions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS admissions,
          (SELECT COUNT(*)::int FROM billing_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS invoices,
          (SELECT COUNT(*)::int FROM insurance_claims WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS insurance_claims
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          module_key,
          COUNT(*)::int AS screen_count
        FROM clinical_hms_screen_definitions
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
        SELECT module_key, report_key, report_name, output_formats
        FROM clinical_hms_report_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        ORDER BY module_key, report_name
        LIMIT 120
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
