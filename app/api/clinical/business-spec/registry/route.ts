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
    screens,
    validations,
    workflows,
    approvals,
    reports,
    templates,
    documents,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'clinical_business_%') AS business_tables,
        (SELECT COUNT(*)::int FROM clinical_business_screens WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS screens,
        (SELECT COUNT(*)::int FROM clinical_business_screen_fields WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS screen_fields,
        (SELECT COUNT(*)::int FROM clinical_business_dropdown_values WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS dropdown_values,
        (SELECT COUNT(*)::int FROM clinical_business_validation_rules WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS validation_rules,
        (SELECT COUNT(*)::int FROM clinical_business_workflows WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS workflows,
        (SELECT COUNT(*)::int FROM clinical_business_workflow_states WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS workflow_states,
        (SELECT COUNT(*)::int FROM clinical_business_approval_rules WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS approval_rules,
        (SELECT COUNT(*)::int FROM clinical_business_reports WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS reports,
        (SELECT COUNT(*)::int FROM clinical_business_report_columns WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS report_columns,
        (SELECT COUNT(*)::int FROM clinical_business_export_rules WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS export_rules,
        (SELECT COUNT(*)::int FROM clinical_business_communication_templates WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS communication_templates,
        (SELECT COUNT(*)::int FROM clinical_business_audit_rules WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS audit_rules,
        (SELECT COUNT(*)::int FROM clinical_business_sensitive_access_rules WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS sensitive_access_rules,
        (SELECT COUNT(*)::int FROM clinical_business_document_templates WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS document_templates
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT screen_id, screen_name, module_name, role_access, business_rules, workflow_states, audit_events
      FROM clinical_business_screens
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY screen_id
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT rule_key, screen_id, field_key, rule_type, severity, message
      FROM clinical_business_validation_rules
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY screen_id, rule_type
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT workflow_key, workflow_name, module_name, description
      FROM clinical_business_workflows
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY workflow_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT approval_type, condition_label, condition_expression, approver_role, reason_required
      FROM clinical_business_approval_rules
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY approval_type, condition_label
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT report_id, report_name, module_name, supported_formats, permission_key
      FROM clinical_business_reports
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY report_id
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT template_key, template_name, channel, trigger_event, subject_template, variables
      FROM clinical_business_communication_templates
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY channel, template_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT template_key, template_name, module_name, output_formats, required_sections, signer_roles
      FROM clinical_business_document_templates
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY module_name, template_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    screens,
    validations,
    workflows,
    approvals,
    reports,
    templates,
    documents,
  });
}
