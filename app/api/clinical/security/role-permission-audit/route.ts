import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) {
    return auth.response;
  }
  const context = auth.context!;

  const [roles, permissions, rolePermissions] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT role_key, role_name, permissions, field_permissions
      FROM clinical_roles
      WHERE tenant_id=$1
        AND COALESCE(hospital_id,$2)=$2
        AND COALESCE(branch_id,$3)=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY role_key
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT permission_key, module_key, action_key, audit_required, requires_approval, status
      FROM clinical_security_permissions
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY module_key, action_key
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT role_key, permission_key, access_decision, record_scope_policy, field_mask_profile
      FROM clinical_security_role_permissions
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY role_key, permission_key
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  const roleKeys = new Set(roles.map((row) => String(row.role_key)));
  const permissionKeys = new Set(permissions.map((row) => String(row.permission_key)));
  const findings = [
    ...roles
      .filter((role) => !role.permissions || JSON.stringify(role.permissions) === "{}")
      .map((role) => ({
        severity: "MEDIUM",
        finding: "Role has no structured permissions JSON.",
        role_key: role.role_key,
      })),
    ...rolePermissions
      .filter((row) => !roleKeys.has(String(row.role_key)))
      .map((row) => ({
        severity: "HIGH",
        finding: "Role permission references a missing role.",
        role_key: row.role_key,
        permission_key: row.permission_key,
      })),
    ...rolePermissions
      .filter((row) => !permissionKeys.has(String(row.permission_key)))
      .map((row) => ({
        severity: "HIGH",
        finding: "Role permission references a missing permission.",
        role_key: row.role_key,
        permission_key: row.permission_key,
      })),
    ...permissions
      .filter((permission) => permission.status && String(permission.status) !== "ACTIVE")
      .map((permission) => ({
        severity: "LOW",
        finding: "Permission is not active.",
        permission_key: permission.permission_key,
        status: permission.status,
      })),
  ];

  for (const findingRaw of findings.length
    ? findings
    : [{ severity: "INFO", finding: "No role permission gaps detected." }]) {
    const finding = findingRaw as Record<string, unknown>;
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_role_permission_audit (
        tenant_id,
        hospital_id,
        branch_id,
        role_key,
        permission_key,
        audit_status,
        finding,
        created_by,
        created_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      String(finding.role_key || ""),
      String(finding.permission_key || ""),
      String(finding.severity || "INFO"),
      String(finding.finding || ""),
      context.user.id ?? null
    );
  }

  await recordClinicalAudit(context, {
    moduleName: "clinical_security",
    action: "role_permission_audit",
    summary: `Role permission audit completed with ${findings.length} findings.`,
    payload: { roles: roles.length, permissions: permissions.length, findings: findings.length },
  });

  return NextResponse.json({
    status: findings.some((finding) => finding.severity === "HIGH")
      ? "PARTIAL"
      : "WORKING",
    roles: roles.length,
    permissions: permissions.length,
    rolePermissions: rolePermissions.length,
    findings,
  });
}
