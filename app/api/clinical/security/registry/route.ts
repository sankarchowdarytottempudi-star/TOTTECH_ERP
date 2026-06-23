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
    roles,
    masks,
    recordPolicies,
    approvals,
    mfa,
    reports,
    apiGroups,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'clinical_security_%') AS security_tables,
        (SELECT COUNT(*)::int FROM clinical_security_roles WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS roles,
        (SELECT COUNT(*)::int FROM clinical_security_permissions WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS permissions,
        (SELECT COUNT(*)::int FROM clinical_security_role_permissions WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS role_permissions,
        (SELECT COUNT(*)::int FROM clinical_security_data_masks WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS data_masks,
        (SELECT COUNT(*)::int FROM clinical_security_record_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS record_policies,
        (SELECT COUNT(*)::int FROM clinical_security_field_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS field_policies,
        (SELECT COUNT(*)::int FROM clinical_security_export_controls WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS export_controls,
        (SELECT COUNT(*)::int FROM clinical_security_bulk_action_controls WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS bulk_controls,
        (SELECT COUNT(*)::int FROM clinical_security_approval_workflows WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS approval_workflows,
        (SELECT COUNT(*)::int FROM clinical_security_mfa_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS mfa_policies,
        (SELECT COUNT(*)::int FROM clinical_security_session_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS session_policies,
        (SELECT COUNT(*)::int FROM clinical_security_reports WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS security_reports,
        (SELECT COUNT(*)::int FROM clinical_security_api_groups WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS api_groups
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT role_key, role_name, role_category, hierarchy_rank, parent_role_key, mfa_required, break_glass_allowed
      FROM clinical_security_roles
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY hierarchy_rank, role_name
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT mask_key, field_name, sensitive_type, mask_pattern, example_masked, full_access_roles, masked_roles
      FROM clinical_security_data_masks
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY sensitive_type
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT policy_key, policy_name, role_key, module_key, rule_expression
      FROM clinical_security_record_policies
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY role_key
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT workflow_key, workflow_name, module_key, action_key, trigger_condition, approver_roles
      FROM clinical_security_approval_workflows
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY workflow_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT policy_key, role_key, factor_policy, required_context, status
      FROM clinical_security_mfa_policies
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY role_key
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT report_key, report_name, report_category, data_source, output_formats
      FROM clinical_security_reports
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY report_category, report_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT group_key, path_prefix, description
      FROM clinical_security_api_groups
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY group_key
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    roles,
    masks,
    recordPolicies,
    approvals,
    mfa,
    reports,
    apiGroups,
  });
}
