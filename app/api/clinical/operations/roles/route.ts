import { NextResponse } from "next/server";

import { apiError } from "@/lib/api/errors";
import {
  clinicalRoleKey,
  ensureClinicalOperationalRoles,
  listClinicalOperationalRoles,
} from "@/lib/clinical/role-governance";
import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function toJson(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

async function findRoleById(id: number, context: { tenantId: number; hospitalId: number; branchId: number }) {
  const rows = (await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT id, role_name, role_key, permissions, field_permissions, created_at, updated_at
    FROM clinical_roles
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  )) as Row[];

  return rows[0] || null;
}

export async function GET(request: Request) {
  try {
    const auth = await requireClinicalContext(request);
    if (auth.response) return auth.response;

    const context = auth.context!;
    const payload = await listClinicalOperationalRoles(context);

    return NextResponse.json({
      ...payload,
      standard_roles: [
        "Reception",
        "Vitals",
        "Doctor",
        "Lab Technician",
        "Pharmacist",
        "Nurse",
        "OT Staff",
        "ICU Staff",
        "Finance User",
        "Hospital Admin",
        "Hospital Owner",
        "Auditor",
      ],
    });
  } catch (error) {
    return apiError(error, "Failed to load clinical roles");
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireClinicalContext(request);
    if (auth.response) return auth.response;

    const context = auth.context!;
    const body = await request.json();
    const roleName = normalizeText(body.role_name || body.roleName);
    const roleKey = clinicalRoleKey(body.role_key || body.roleKey || roleName);
    const permissions = toJson(body.permissions);
    const fieldPermissions = toJson(body.field_permissions || body.fieldPermissions);

    if (!roleName || !roleKey) {
      return NextResponse.json(
        { error: "Role name and role key are required." },
        { status: 400 }
      );
    }

    const result = await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO clinical_roles (
        tenant_id,
        clinic_id,
        hospital_id,
        branch_id,
        role_name,
        role_key,
        permissions,
        field_permissions,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (tenant_id, clinic_id, role_key)
      DO UPDATE SET
        role_name = EXCLUDED.role_name,
        hospital_id = EXCLUDED.hospital_id,
        branch_id = EXCLUDED.branch_id,
        permissions = EXCLUDED.permissions,
        field_permissions = EXCLUDED.field_permissions,
        updated_by = EXCLUDED.updated_by,
        updated_at = CURRENT_TIMESTAMP,
        is_deleted = false
      RETURNING *
      `,
      context.tenantId,
      context.clinicId,
      context.hospitalId,
      context.branchId,
      roleName,
      roleKey,
      JSON.stringify(permissions),
      JSON.stringify(fieldPermissions),
      context.user.id ?? null
    );

    await recordClinicalAudit(context, {
      moduleName: "clinical_roles",
      action: "create",
      entityType: "clinical_roles",
      entityId: Number(result[0]?.id) || null,
      summary: `Role ${roleName} created`,
      payload: result[0],
    });

    return NextResponse.json(
      { role: result[0] },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error, "Failed to create role");
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireClinicalContext(request);
    if (auth.response) return auth.response;

    const context = auth.context!;
    const body = await request.json();
    const roleId = Number(body.id || body.role_id);
    const roleName = normalizeText(body.role_name || body.roleName);
    const roleKey = clinicalRoleKey(body.role_key || body.roleKey);
    const permissions = toJson(body.permissions);
    const fieldPermissions = toJson(body.field_permissions || body.fieldPermissions);

    if (!roleId) {
      return NextResponse.json(
        { error: "Role id is required." },
        { status: 400 }
      );
    }

    const existing = await findRoleById(roleId, context);

    if (!existing) {
      return NextResponse.json(
        { error: "Role not found." },
        { status: 404 }
      );
    }

    const nextRoleName = roleName || String(existing.role_name || "");
    const nextRoleKey = roleKey || clinicalRoleKey(String(existing.role_key || ""));

    const result = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE clinical_roles
      SET role_name = $2,
          role_key = $3,
          permissions = $4::jsonb,
          field_permissions = $5::jsonb,
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $7
        AND hospital_id = $8
        AND branch_id = $9
      RETURNING *
      `,
      roleId,
      nextRoleName,
      nextRoleKey,
      JSON.stringify(permissions),
      JSON.stringify(fieldPermissions),
      context.user.id ?? null,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

    await recordClinicalAudit(context, {
      moduleName: "clinical_roles",
      action: "update",
      entityType: "clinical_roles",
      entityId: roleId,
      summary: `Role ${nextRoleName} updated`,
      payload: result[0],
    });

    return NextResponse.json({ role: result[0] });
  } catch (error) {
    return apiError(error, "Failed to update role");
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireClinicalContext(request);
    if (auth.response) return auth.response;

    const context = auth.context!;
    const body = await request.json();
    const roleId = Number(body.id || body.role_id);

    if (!roleId) {
      return NextResponse.json(
        { error: "Role id is required." },
        { status: 400 }
      );
    }

    const role = await findRoleById(roleId, context);
    if (!role) {
      return NextResponse.json(
        { error: "Role not found." },
        { status: 404 }
      );
    }

    await prisma.$executeRawUnsafe(
      `
      UPDATE clinical_roles
      SET is_deleted = true,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $3
        AND hospital_id = $4
        AND branch_id = $5
      `,
      roleId,
      context.user.id ?? null,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

    await recordClinicalAudit(context, {
      moduleName: "clinical_roles",
      action: "delete",
      entityType: "clinical_roles",
      entityId: roleId,
      summary: `Role ${String(role.role_name || "")} deleted`,
      payload: role,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "Failed to delete role");
  }
}
