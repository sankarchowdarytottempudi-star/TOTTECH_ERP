import { prisma } from "@/lib/prisma";

export type ClinicalRolePermissionModule = {
  module_key: string;
  actions: string[];
};

export type ClinicalRolePermissionSet = {
  modules: ClinicalRolePermissionModule[];
  source: "clinical_security" | "manual";
};

export type ClinicalOperationalRole = {
  id: number;
  tenant_id: number | null;
  hospital_id: number | null;
  branch_id: number | null;
  clinic_id: number | null;
  role_name: string;
  role_key: string;
  permissions: ClinicalRolePermissionSet | Record<string, unknown> | null;
  field_permissions: Record<string, unknown> | null;
  created_at?: Date | null;
  updated_at?: Date | null;
};

type ContextLike = {
  tenantId: number;
  hospitalId: number;
  branchId: number;
  clinicId: number;
  user?: {
    id?: number | null;
  };
};

type RoleSeedRow = {
  role_name: string | null;
  role_key: string | null;
};

type PermissionRow = {
  role_key: string | null;
  module_key: string | null;
  action_key: string | null;
};

const normalizeRoleKey = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const normalizeRoleName = (value: string) =>
  String(value || "")
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (item) => item.toUpperCase());

const fallbackRoles: RoleSeedRow[] = [
  { role_key: "receptionist", role_name: "Reception" },
  { role_key: "vitals", role_name: "Vitals" },
  { role_key: "doctor", role_name: "Doctor" },
  { role_key: "nurse", role_name: "Nurse" },
  { role_key: "lab_technician", role_name: "Lab Technician" },
  { role_key: "pharmacist", role_name: "Pharmacist" },
  { role_key: "icu_staff", role_name: "ICU Staff" },
  { role_key: "ot_staff", role_name: "OT Staff" },
  { role_key: "finance_user", role_name: "Finance User" },
  { role_key: "hospital_admin", role_name: "Hospital Admin" },
  { role_key: "hospital_owner", role_name: "Hospital Owner" },
  { role_key: "auditor", role_name: "Auditor" },
];

export function clinicalRoleKey(value: string | null | undefined) {
  return normalizeRoleKey(value || "");
}

export function clinicalRoleLabel(value: string | null | undefined) {
  return normalizeRoleName(value || "");
}

export function clinicalRolePermissionsJSON(
  rows: PermissionRow[]
) {
  const modules = new Map<string, Set<string>>();

  for (const row of rows) {
    const moduleKey = String(row.module_key || "").trim().toUpperCase();
    const actionKey = String(row.action_key || "").trim().toUpperCase();

    if (!moduleKey || !actionKey) {
      continue;
    }

    if (!modules.has(moduleKey)) {
      modules.set(moduleKey, new Set<string>());
    }

    modules.get(moduleKey)?.add(actionKey);
  }

  return {
    modules: Array.from(modules.entries()).map(([module_key, actions]) => ({
      module_key,
      actions: Array.from(actions).sort(),
    })),
    source: "clinical_security" as const,
  };
}

async function loadSecurityRoleSeeds(context: ContextLike) {
  const roles = (await prisma.$queryRawUnsafe(
    `
    SELECT role_name, role_key
    FROM clinical_security_roles
    WHERE tenant_id = $1
      AND hospital_id = $2
      AND branch_id = $3
      AND COALESCE(is_deleted,false) = false
    ORDER BY hierarchy_rank, role_name
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId
  )) as RoleSeedRow[];

  const permissions = (await prisma.$queryRawUnsafe(
    `
    SELECT rp.role_key, p.module_key, p.action_key
    FROM clinical_security_role_permissions rp
    JOIN clinical_security_permissions p
      ON p.permission_key = rp.permission_key
    WHERE rp.tenant_id = $1
      AND rp.hospital_id = $2
      AND rp.branch_id = $3
      AND COALESCE(rp.is_deleted,false) = false
      AND COALESCE(p.is_deleted,false) = false
    ORDER BY rp.role_key, p.module_key, p.action_key
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId
  )) as PermissionRow[];

  return { roles, permissions };
}

export async function ensureClinicalOperationalRoles(
  context: ContextLike
) {
  const existing = (await prisma.$queryRawUnsafe(
    `
    SELECT role_key
    FROM clinical_roles
    WHERE tenant_id = $1
      AND hospital_id = $2
      AND branch_id = $3
      AND COALESCE(is_deleted,false) = false
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId
  )) as Array<{ role_key: string | null }>;

  const existingKeys = new Set(
    existing.map((item) =>
      clinicalRoleKey(item.role_key)
    )
  );

  const { roles, permissions } =
    await loadSecurityRoleSeeds(context);

  const fallbackMap = new Map(
    fallbackRoles.map((role) => [
      role.role_key,
      role.role_name,
    ])
  );

  const rolePermissionMap = new Map<
    string,
    PermissionRow[]
  >();

  for (const row of permissions) {
    const key = clinicalRoleKey(
      row.role_key
    );
    if (!key) continue;
    const current =
      rolePermissionMap.get(key) || [];
    current.push(row);
    rolePermissionMap.set(key, current);
  }

  const seedMap = new Map<string, string>();

  for (const role of fallbackRoles) {
    const roleKey = clinicalRoleKey(role.role_key);
    if (!roleKey) continue;
    seedMap.set(
      roleKey,
      role.role_name || clinicalRoleLabel(roleKey)
    );
  }

  for (const role of roles) {
    const roleKey = clinicalRoleKey(role.role_key);
    if (!roleKey) continue;
    seedMap.set(
      roleKey,
      role.role_name || fallbackMap.get(roleKey) || clinicalRoleLabel(roleKey)
    );
  }

  for (const [roleKey, roleName] of seedMap.entries()) {
    if (!roleKey || existingKeys.has(roleKey)) {
      continue;
    }

    const permissionJson =
      clinicalRolePermissionsJSON(
        rolePermissionMap.get(roleKey) || []
      );

    await prisma.$executeRawUnsafe(
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
      VALUES (
        $1,$2,$3,$4,$5,$6,$7::jsonb,'{}'::jsonb,$8,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false
      )
      ON CONFLICT (tenant_id, clinic_id, role_key)
      DO UPDATE SET
        role_name = EXCLUDED.role_name,
        hospital_id = EXCLUDED.hospital_id,
        branch_id = EXCLUDED.branch_id,
        permissions = COALESCE(clinical_roles.permissions, EXCLUDED.permissions),
        updated_by = EXCLUDED.updated_by,
        updated_at = CURRENT_TIMESTAMP,
        is_deleted = false
      `,
      context.tenantId,
      context.clinicId,
      context.hospitalId,
      context.branchId,
      roleName || fallbackMap.get(roleKey) || clinicalRoleLabel(roleKey),
      roleKey,
      JSON.stringify(permissionJson),
      context.user?.id ?? null
    );
  }
}

export async function ensureClinicalRoleRecord(
  context: ContextLike,
  roleKeyInput: string,
  roleNameInput?: string | null
) {
  const roleKey = clinicalRoleKey(roleKeyInput);
  if (!roleKey) {
    return null;
  }

  const existing = (await prisma.$queryRawUnsafe(
    `
    SELECT id, role_name, role_key
    FROM clinical_roles
    WHERE tenant_id = $1
      AND hospital_id = $2
      AND branch_id = $3
      AND role_key = $4
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    roleKey
  )) as Array<{ id: number; role_name: string | null; role_key: string | null }>;

  if (existing[0]) {
    return existing[0];
  }

  const fallbackName =
    normalizeRoleName(
      roleNameInput || roleKey
    ) || clinicalRoleLabel(roleKey);

  const result = (await prisma.$queryRawUnsafe(
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
    VALUES (
      $1,$2,$3,$4,$5,$6,'{"modules":[],"source":"manual"}'::jsonb,'{}'::jsonb,$7,$7,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false
    )
    ON CONFLICT (tenant_id, clinic_id, role_key)
    DO UPDATE SET
      role_name = EXCLUDED.role_name,
      hospital_id = EXCLUDED.hospital_id,
      branch_id = EXCLUDED.branch_id,
      updated_by = EXCLUDED.updated_by,
      updated_at = CURRENT_TIMESTAMP,
      is_deleted = false
    RETURNING id, role_name, role_key
    `,
    context.tenantId,
    context.clinicId,
    context.hospitalId,
    context.branchId,
    fallbackName,
    roleKey,
    context.user?.id ?? null
  )) as Array<{ id: number; role_name: string | null; role_key: string | null }>;

  return result[0] || null;
}

export async function listClinicalOperationalRoles(
  context: ContextLike
) {
  await ensureClinicalOperationalRoles(context);

  const roles = (await prisma.$queryRawUnsafe(
    `
    SELECT
      cr.id,
      cr.tenant_id,
      cr.clinic_id,
      cr.hospital_id,
      cr.branch_id,
      cr.role_name,
      cr.role_key,
      cr.permissions,
      cr.field_permissions,
      cr.created_at,
      cr.updated_at,
      COALESCE((
        SELECT COUNT(*)
        FROM clinical_user_profiles cup
        WHERE cup.tenant_id = cr.tenant_id
          AND cup.hospital_id = cr.hospital_id
          AND cup.branch_id = cr.branch_id
          AND cup.clinical_role_id = cr.id
          AND COALESCE(cup.is_deleted,false) = false
      ), 0)::int AS user_count
    FROM clinical_roles cr
    WHERE cr.tenant_id = $1
      AND cr.hospital_id = $2
      AND cr.branch_id = $3
      AND COALESCE(cr.is_deleted,false) = false
    ORDER BY lower(cr.role_name), cr.id
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId
  )) as ClinicalOperationalRole & {
    user_count?: number;
  }[];

  const permissionCatalog = (await prisma.$queryRawUnsafe(
    `
    SELECT
      module_key,
      ARRAY_AGG(DISTINCT action_key ORDER BY action_key) AS actions
    FROM clinical_security_permissions
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
  )) as Array<{ module_key: string; actions: string[] }>;

  return {
    roles: roles.map((role) => {
      const row = role as ClinicalOperationalRole;
      return {
        ...row,
        permissions:
          row.permissions && typeof row.permissions === "object"
            ? row.permissions
            : { modules: [], source: "manual" },
      };
    }),
    permissionCatalog: permissionCatalog.map(
      (row) => ({
        module_key: row.module_key,
        actions: Array.isArray(row.actions)
          ? row.actions
          : [],
      })
    ),
  };
}
