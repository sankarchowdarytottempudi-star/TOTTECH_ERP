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
    frameworks,
    controls,
    risks,
    safety,
    incidents,
    goLive,
    reports,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'clinical_compliance_%') AS compliance_tables,
        (SELECT COUNT(*)::int FROM clinical_compliance_frameworks WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS frameworks,
        (SELECT COUNT(*)::int FROM clinical_compliance_controls WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS controls,
        (SELECT COUNT(*)::int FROM clinical_compliance_consents WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS consents,
        (SELECT COUNT(*)::int FROM clinical_compliance_patient_safety_goals WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS safety_goals,
        (SELECT COUNT(*)::int FROM clinical_compliance_incidents WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS incidents,
        (SELECT COUNT(*)::int FROM clinical_compliance_risk_register WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS risks,
        (SELECT COUNT(*)::int FROM clinical_compliance_infection_surveillance WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS infection_records,
        (SELECT COUNT(*)::int FROM clinical_compliance_dr_tests WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS dr_tests,
        (SELECT COUNT(*)::int FROM clinical_compliance_soc_events WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS soc_events,
        (SELECT COUNT(*)::int FROM clinical_compliance_vulnerabilities WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS vulnerabilities,
        (SELECT COUNT(*)::int FROM clinical_compliance_uat_cases WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS uat_cases,
        (SELECT COUNT(*)::int FROM clinical_compliance_go_live_checklists WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS go_live_items,
        (SELECT COUNT(*)::int FROM clinical_compliance_reports WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS compliance_reports,
        (SELECT COUNT(*)::int FROM clinical_compliance_table_blueprints WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS table_blueprints
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT framework_key, framework_name, framework_scope, readiness_percent, status
      FROM clinical_compliance_frameworks
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY framework_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT framework_key, module_key, control_name, evidence_type, owner_role, status
      FROM clinical_compliance_controls
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY framework_key, module_key
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT risk_id, risk_name, risk_category, probability, impact, owner_role, status
      FROM clinical_compliance_risk_register
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY risk_category, risk_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT goal_name, jci_goal, measurement_method, evidence_required
      FROM clinical_compliance_patient_safety_goals
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY goal_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT incident_number, department, severity, incident_type, status
      FROM clinical_compliance_incidents
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY severity, incident_number
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT checklist_area, checklist_item, status, evidence_required
      FROM clinical_compliance_go_live_checklists
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY checklist_area, checklist_item
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT report_name, framework_key, report_category, output_formats, evidence_source
      FROM clinical_compliance_reports
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY framework_key, report_category, report_name
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
    frameworks,
    controls,
    risks,
    safety,
    incidents,
    goLive,
    reports,
  });
}
