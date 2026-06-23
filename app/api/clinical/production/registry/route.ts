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

  const [
    counts,
    apps,
    services,
    security,
    testing,
    devops,
    backups,
    goLive,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'clinical_production_%') AS production_tables,
        (SELECT COUNT(*)::int FROM clinical_production_monorepo_apps WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS apps,
        (SELECT COUNT(*)::int FROM clinical_production_services WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS services,
        (SELECT COUNT(*)::int FROM clinical_production_packages WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS packages,
        (SELECT COUNT(*)::int FROM clinical_production_infrastructure_components WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS infrastructure,
        (SELECT COUNT(*)::int FROM clinical_production_technology_stack WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS stack,
        (SELECT COUNT(*)::int FROM clinical_production_prisma_rules WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS prisma_rules,
        (SELECT COUNT(*)::int FROM clinical_production_api_contracts WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS api_contracts,
        (SELECT COUNT(*)::int FROM clinical_production_event_contracts WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS events,
        (SELECT COUNT(*)::int FROM clinical_production_security_controls WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS security_controls,
        (SELECT COUNT(*)::int FROM clinical_production_testing_requirements WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS testing_requirements,
        (SELECT COUNT(*)::int FROM clinical_production_devops_artifacts WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS devops_artifacts,
        (SELECT COUNT(*)::int FROM clinical_production_monitoring_rules WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS monitoring_rules,
        (SELECT COUNT(*)::int FROM clinical_production_backup_policies WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS backup_policies,
        (SELECT COUNT(*)::int FROM clinical_production_go_live_checklist WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS go_live_items
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT app_key, app_name, app_type, target_users, folder_path, deployment_target
      FROM clinical_production_monorepo_apps
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY app_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT service_key, service_name, api_prefix, responsibilities, event_topics
      FROM clinical_production_services
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY service_name
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT control_key, control_name, control_area, severity, requirement
      FROM clinical_production_security_controls
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY severity, control_area
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT test_key, test_name, test_type, framework, target_coverage, command
      FROM clinical_production_testing_requirements
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY test_type
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT artifact_key, artifact_name, artifact_type, artifact_path, deployment_stage
      FROM clinical_production_devops_artifacts
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY deployment_stage, artifact_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT policy_key, policy_name, backup_type, schedule_expression, recovery_target
      FROM clinical_production_backup_policies
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY backup_type
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT checklist_key, checklist_item, checklist_category, status, required_for_go_live
      FROM clinical_production_go_live_checklist
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY checklist_category, checklist_item
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    apps,
    services,
    security,
    testing,
    devops,
    backups,
    goLive,
  });
}
