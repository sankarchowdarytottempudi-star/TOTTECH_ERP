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

  const [counts, groups, modules, reports, diagrams] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'clinical_dictionary_%') AS dictionary_tables,
          (SELECT COUNT(*)::int FROM clinical_dictionary_entity_groups WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS entity_groups,
          (SELECT COUNT(*)::int FROM clinical_dictionary_entities WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS entities,
          (SELECT COUNT(*)::int FROM clinical_dictionary_fields WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS fields,
          (SELECT COUNT(*)::int FROM clinical_dictionary_relationships WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS relationships,
          (SELECT COUNT(*)::int FROM clinical_dictionary_constraints WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS constraints,
          (SELECT COUNT(*)::int FROM clinical_dictionary_indexes WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS indexes,
          (SELECT COUNT(*)::int FROM clinical_dictionary_retention_policies WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS retention_policies,
          (SELECT COUNT(*)::int FROM clinical_dictionary_archival_policies WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS archival_policies,
          (SELECT COUNT(*)::int FROM clinical_dictionary_er_diagrams WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS er_diagrams,
          (SELECT COUNT(*)::int FROM clinical_dictionary_generation_rules WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS generation_rules,
          (SELECT COUNT(*)::int FROM clinical_dictionary_blueprints WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS blueprints,
          (SELECT COUNT(*)::int FROM clinical_dictionary_screen_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS screens,
          (SELECT COUNT(*)::int FROM clinical_dictionary_api_endpoint_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS api_endpoints,
          (SELECT COUNT(*)::int FROM clinical_dictionary_report_definitions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS reports
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT group_key, group_name, description, sort_order
        FROM clinical_dictionary_entity_groups
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        ORDER BY sort_order, group_name
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT module_key, COUNT(*)::int AS screen_count
        FROM clinical_dictionary_screen_definitions
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
        FROM clinical_dictionary_report_definitions
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
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT diagram_key, diagram_name, diagram_type, entity_keys
        FROM clinical_dictionary_er_diagrams
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
        ORDER BY diagram_name
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    groups,
    modules,
    reports,
    diagrams,
  });
}
