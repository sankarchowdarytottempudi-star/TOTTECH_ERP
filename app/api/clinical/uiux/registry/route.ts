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
    namedScreens,
    navigation,
    dashboards,
    components,
    workflows,
    mobileApps,
    accessibility,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'clinical_ui_%') AS ui_tables,
        (SELECT COUNT(*)::int FROM clinical_ui_design_tokens WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS design_tokens,
        (SELECT COUNT(*)::int FROM clinical_ui_navigation_items WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS navigation_items,
        (SELECT COUNT(*)::int FROM clinical_ui_screen_templates WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS screen_templates,
        (SELECT COUNT(*)::int FROM clinical_ui_screen_specs WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS screen_specs,
        (SELECT COUNT(*)::int FROM clinical_ui_dashboard_specs WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS dashboards,
        (SELECT COUNT(*)::int FROM clinical_ui_component_specs WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS components,
        (SELECT COUNT(*)::int FROM clinical_ui_workflow_specs WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS workflows,
        (SELECT COUNT(*)::int FROM clinical_ui_responsive_rules WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS responsive_rules,
        (SELECT COUNT(*)::int FROM clinical_ui_accessibility_rules WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS accessibility_rules,
        (SELECT COUNT(*)::int FROM clinical_ui_mobile_app_specs WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS mobile_apps,
        (SELECT COUNT(*)::int FROM clinical_ui_api_blueprints WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS api_blueprints,
        (SELECT COUNT(*)::int FROM clinical_ui_report_blueprints WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false) AS report_blueprints
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT screen_key, screen_name, module_key, route_path, screen_type, layout_template, component_stack, workflow_actions
      FROM clinical_ui_screen_specs
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND screen_key IN (
          'login','executive_dashboard','patient_registration','patient_360',
          'appointment_calendar','op_consultation','admission_screen','icu_dashboard',
          'ivf_dashboard','embryology_workbench','lab_dashboard','result_entry',
          'pacs_viewer','pharmacy_sales','inventory_dashboard','billing',
          'claims_dashboard','referral_dashboard','report_center','ai_command_center'
        )
        AND COALESCE(is_deleted,false) = false
      ORDER BY screen_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT navigation_key, label, parent_key, route_path, module_key, audience_role, sort_order
      FROM clinical_ui_navigation_items
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY sort_order ASC
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT dashboard_key, dashboard_name, dashboard_type, audience_role, kpi_schema, chart_schema
      FROM clinical_ui_dashboard_specs
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY dashboard_type, dashboard_name
      LIMIT 60
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT component_key, component_name, component_category, framework, states_schema
      FROM clinical_ui_component_specs
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY component_category, component_name
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT workflow_key, workflow_name, workflow_category, steps, approval_policy, mobile_supported
      FROM clinical_ui_workflow_specs
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY workflow_category, workflow_name
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT app_key, app_name, audience_role, navigation_model, screen_groups, offline_policy
      FROM clinical_ui_mobile_app_specs
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY app_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT rule_key, rule_name, wcag_reference, requirement, severity
      FROM clinical_ui_accessibility_rules
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY severity, rule_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    namedScreens,
    navigation,
    dashboards,
    components,
    workflows,
    mobileApps,
    accessibility,
  });
}
