import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isClinicalServicesEmail } from "@/lib/project-routing";
import {
  CLINICAL_MODULE_LABELS,
  moduleCodeForClinicalPath,
  type ClinicalModuleCode,
} from "@/lib/clinical/module-licensing";

export type ClinicalUser = {
  id?: number;
  email?: string;
  role?: string;
  full_name?: string;
  project?: string;
  projectType?: string;
  platform_type?: string;
};

export type ClinicalContext = {
  user: ClinicalUser;
  tenantId: number;
  hospitalId: number;
  branchId: number;
  clinicId: number;
  organizationId: number | null;
  tenantName: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalEmail: string;
  hospitalLicenseNumber: string;
  branchName: string;
  organizationName: string;
  clinicName: string;
  roleKey: string;
  roleName: string;
  permissions: Record<string, unknown>;
  licensedModules?: ClinicalModuleCode[];
  branding: {
    name: string;
    logoUrl: string | null;
    primaryColor: string;
    accentColor: string;
    source: string;
  };
};

type Row = Record<string, unknown>;

const numberValue = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const jsonRecord = (value: unknown) =>
  value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};

const firstText = (...values: unknown[]) =>
  values
    .map((value) => String(value || "").trim())
    .find(Boolean) || "";

export function isClinicalUser(
  user: ClinicalUser | null
) {
  return (
    user?.project ===
      "tottech_clinical_services" ||
    String(user?.projectType || "")
      .trim()
      .toUpperCase() === "CLINICAL" ||
    String(user?.platform_type || "")
      .trim()
      .toUpperCase() === "CLINICAL" ||
    isClinicalServicesEmail(user?.email)
  );
}

const privilegedClinicalRoles = new Set([
  "tottech_super_admin",
  "clinical_super_admin",
  "organization_admin",
]);

export function clinicalUnauthorized(
  message =
    "Clinical Services login required."
) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status: 401,
    }
  );
}

export function clinicalModuleNotLicensed(
  moduleCode: ClinicalModuleCode
) {
  return NextResponse.json(
    {
      error: "Module Not Licensed",
      module_code: moduleCode,
      module_name:
        CLINICAL_MODULE_LABELS[moduleCode],
    },
    {
      status: 403,
    }
  );
}

export async function getHospitalLicensedModules(
  tenantId: number,
  hospitalId: number
): Promise<ClinicalModuleCode[]> {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,
      tenantId,
      hospitalId
    );

  return rows
    .map((row) =>
      String(row.module_code || "")
    )
    .filter((code): code is ClinicalModuleCode =>
      Object.prototype.hasOwnProperty.call(
        CLINICAL_MODULE_LABELS,
        code
      )
    );
}

async function hasExplicitModuleRows(
  tenantId: number,
  hospitalId: number
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,
      tenantId,
      hospitalId
    );

  return Number(rows[0]?.count || 0) > 0;
}

export async function resolveClinicalContext(
  request?: Request
): Promise<ClinicalContext | null> {
  const user =
    (await getCurrentUser()) as ClinicalUser | null;

  if (!user || !isClinicalUser(user)) {
    return null;
  }

  const cookieStore =
    await cookies();
  const selectedClinic =
    numberValue(
      cookieStore.get(
        "active_clinic_id"
      )?.value
    );
  const selectedHospital =
    numberValue(
      cookieStore.get(
        "active_hospital_id"
      )?.value
    );
  const selectedBranch =
    numberValue(
      cookieStore.get(
        "active_branch_id"
      )?.value
    );
  const url = request
    ? new URL(request.url)
    : null;
  const requestedClinic =
    numberValue(
      url?.searchParams.get(
        "clinic_id"
      )
    );
  const requestedHospital =
    numberValue(
      url?.searchParams.get(
        "hospital_id"
      )
    );
  const requestedBranch =
    numberValue(
      url?.searchParams.get(
        "branch_id"
      )
    );
  const clinicId =
    requestedClinic ?? selectedClinic;
  const hospitalId =
    requestedHospital ?? selectedHospital;
  const branchId =
    requestedBranch ?? selectedBranch;

  const isPlatformSuperAdmin =
    String(user?.role || "")
      .trim()
      .toUpperCase() === "SUPER_ADMIN" ||
    privilegedClinicalRoles.has(
      String(user?.role || "")
        .trim()
        .toLowerCase()
    );

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        cup.tenant_id,
        cup.clinic_id,
        COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
        COALESCE(cup.branch_id, c.branch_id) AS branch_id,
        c.organization_id,
        ct.tenant_name,
        h.hospital_name,
        h.address AS hospital_address,
        h.phone AS hospital_phone,
        h.email AS hospital_email,
        h.license_number AS hospital_license_number,
        h.branding AS hospital_branding,
        b.branch_name,
        b.branding AS branch_branding,
        COALESCE(o.organization_name, ct.tenant_name, c.clinic_name) AS organization_name,
        o.branding AS organization_branding,
        c.clinic_name,
        c.branding AS clinic_branding,
        cr.role_key,
        cr.role_name,
        cr.permissions
      FROM clinical_user_profiles cup
      JOIN clinics c ON c.id = cup.clinic_id
      LEFT JOIN organizations o ON (
        o.tenant_id = cup.tenant_id
        OR o.id = cup.tenant_id
      )
        AND COALESCE(o.is_deleted, false) = false
      LEFT JOIN clinical_tenants ct ON ct.id = cup.tenant_id
      LEFT JOIN hospitals h ON h.id = COALESCE(cup.hospital_id, c.hospital_id)
      LEFT JOIN branches b ON b.id = COALESCE(cup.branch_id, c.branch_id)
      LEFT JOIN clinical_roles cr ON cr.id = cup.clinical_role_id
      WHERE cup.user_id = $1
        AND COALESCE(cup.is_deleted, false) = false
        AND COALESCE(c.is_deleted, false) = false
        AND ($2::int IS NULL OR cup.clinic_id = $2::int)
        AND ($3::int IS NULL OR COALESCE(cup.hospital_id, c.hospital_id) = $3::int)
        AND ($4::int IS NULL OR COALESCE(cup.branch_id, c.branch_id) = $4::int)
      ORDER BY cup.id ASC
      LIMIT 1
      `,
      user.id ?? null,
      clinicId,
      hospitalId,
      branchId
    );

  let row = rows[0];

  if (!row && isPlatformSuperAdmin) {
    const bootstrapRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        WITH selected_hospital AS (
          SELECT h.*
          FROM hospitals h
          WHERE COALESCE(h.is_deleted, false) = false
          ORDER BY h.created_at ASC, h.id ASC
          LIMIT 1
        ),
        selected_branch AS (
          SELECT b.*
          FROM branches b
          JOIN selected_hospital h ON h.id = b.hospital_id
          WHERE COALESCE(b.is_deleted, false) = false
          ORDER BY b.created_at ASC, b.id ASC
          LIMIT 1
        ),
        selected_clinic AS (
          SELECT c.*
          FROM clinics c
          JOIN selected_hospital h ON h.id = c.hospital_id
          LEFT JOIN selected_branch b ON b.id = c.branch_id
          WHERE COALESCE(c.is_deleted, false) = false
          ORDER BY c.created_at ASC, c.id ASC
          LIMIT 1
        )
        SELECT
          h.tenant_id,
          COALESCE(sc.id, NULL) AS clinic_id,
          h.id AS hospital_id,
          COALESCE(sb.id, sc.branch_id, NULL) AS branch_id,
          sc.organization_id,
          ct.tenant_name,
          h.hospital_name,
          h.address AS hospital_address,
          h.phone AS hospital_phone,
          h.email AS hospital_email,
          h.license_number AS hospital_license_number,
          h.branding AS hospital_branding,
          sb.branch_name,
          sb.branding AS branch_branding,
          COALESCE(o.organization_name, ct.tenant_name, sc.clinic_name, h.hospital_name) AS organization_name,
          o.branding AS organization_branding,
          COALESCE(sc.clinic_name, h.hospital_name) AS clinic_name,
          sc.branding AS clinic_branding,
          'clinical_super_admin'::text AS role_key,
          'Clinical Super Admin'::text AS role_name,
          '{}'::jsonb AS permissions
        FROM selected_hospital h
        LEFT JOIN selected_branch sb ON true
        LEFT JOIN selected_clinic sc ON true
        LEFT JOIN organizations o ON (
          o.tenant_id = h.tenant_id
          OR o.id = h.tenant_id
        )
          AND COALESCE(o.is_deleted, false) = false
        LEFT JOIN clinical_tenants ct ON ct.id = h.tenant_id
        LIMIT 1
        `
      );

    row = bootstrapRows[0];
  }

  if (
    !row &&
    selectedHospital &&
    user.id
  ) {
    const fallbackRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        WITH base_profile AS (
          SELECT
            cup.tenant_id,
            cup.clinic_id AS base_clinic_id,
            COALESCE(cup.hospital_id, c.hospital_id) AS base_hospital_id,
            COALESCE(cup.branch_id, c.branch_id) AS base_branch_id,
            c.organization_id,
            cr.role_key,
            cr.role_name,
            cr.permissions
          FROM clinical_user_profiles cup
          JOIN clinics c ON c.id = cup.clinic_id
          LEFT JOIN clinical_roles cr ON cr.id = cup.clinical_role_id
          WHERE cup.user_id = $1
            AND COALESCE(cup.is_deleted, false) = false
            AND COALESCE(c.is_deleted, false) = false
          ORDER BY cup.id ASC
          LIMIT 1
        ),
        selected_hospital AS (
          SELECT h.*
          FROM hospitals h
          JOIN base_profile bp ON bp.tenant_id = h.tenant_id
          WHERE h.id = $2
            AND COALESCE(h.is_deleted, false) = false
            AND COALESCE(bp.role_key, '') = ANY($3::text[])
          LIMIT 1
        ),
        selected_branch AS (
          SELECT b.*
          FROM branches b
          JOIN selected_hospital h ON h.id = b.hospital_id
          WHERE b.tenant_id = h.tenant_id
            AND ($4::int IS NULL OR b.id = $4::int)
            AND COALESCE(b.is_deleted, false) = false
          ORDER BY
            CASE WHEN $4::int IS NOT NULL AND b.id = $4::int THEN 0 ELSE 1 END,
            b.id ASC
          LIMIT 1
        ),
        selected_clinic AS (
          SELECT c.*
          FROM clinics c
          JOIN selected_hospital h ON h.id = c.hospital_id
          LEFT JOIN selected_branch b ON b.id = c.branch_id
          WHERE c.tenant_id = h.tenant_id
            AND ($5::int IS NULL OR c.id = $5::int)
            AND (
              b.id IS NULL
              OR c.branch_id = b.id
            )
            AND COALESCE(c.is_deleted, false) = false
          ORDER BY
            CASE WHEN $5::int IS NOT NULL AND c.id = $5::int THEN 0 ELSE 1 END,
            c.id ASC
          LIMIT 1
        )
        SELECT
          bp.tenant_id,
          COALESCE(sc.id, bp.base_clinic_id) AS clinic_id,
          sh.id AS hospital_id,
          COALESCE(sb.id, sc.branch_id, bp.base_branch_id) AS branch_id,
          COALESCE(sc.organization_id, bp.organization_id) AS organization_id,
          ct.tenant_name,
          sh.hospital_name,
          sh.address AS hospital_address,
          sh.phone AS hospital_phone,
          sh.email AS hospital_email,
          sh.license_number AS hospital_license_number,
          sh.branding AS hospital_branding,
          sb.branch_name,
          sb.branding AS branch_branding,
          COALESCE(o.organization_name, ct.tenant_name, sc.clinic_name, sh.hospital_name) AS organization_name,
          o.branding AS organization_branding,
          COALESCE(sc.clinic_name, sh.hospital_name) AS clinic_name,
          sc.branding AS clinic_branding,
          bp.role_key,
          bp.role_name,
          bp.permissions
        FROM base_profile bp
        JOIN selected_hospital sh ON true
        LEFT JOIN selected_branch sb ON true
        LEFT JOIN selected_clinic sc ON true
        LEFT JOIN organizations o ON (
          o.tenant_id = bp.tenant_id
          OR o.id = bp.tenant_id
        )
          AND COALESCE(o.is_deleted, false) = false
        LEFT JOIN clinical_tenants ct ON ct.id = bp.tenant_id
        LIMIT 1
        `,
        user.id,
        selectedHospital,
        Array.from(privilegedClinicalRoles),
        selectedBranch,
        selectedClinic
      );

    row = fallbackRows[0];
  }

  if (!row) {
    return null;
  }

  const organizationBranding =
    jsonRecord(row.organization_branding);
  const hospitalBranding =
    jsonRecord(row.hospital_branding);
  const branchBranding =
    jsonRecord(row.branch_branding);
  const clinicBranding =
    jsonRecord(row.clinic_branding);
  const effectiveBranding = {
    ...organizationBranding,
    ...hospitalBranding,
    ...branchBranding,
    ...clinicBranding,
  };
  const logoUrl = firstText(
    effectiveBranding.logoUrl,
    effectiveBranding.logo_url,
    effectiveBranding.logo,
    effectiveBranding.hospital_logo,
    effectiveBranding.image
  );
  const brandName = firstText(
    effectiveBranding.name,
    effectiveBranding.hospitalName,
    effectiveBranding.hospital_name,
    row.hospital_name,
    row.branch_name,
    row.clinic_name,
    row.organization_name
  );

  const licensedModules =
    await getHospitalLicensedModules(
      Number(row.tenant_id),
      Number(row.hospital_id)
    );

  return {
    user,
    tenantId:
      Number(row.tenant_id),
    hospitalId:
      Number(row.hospital_id),
    branchId:
      Number(row.branch_id),
    clinicId:
      Number(row.clinic_id),
    organizationId:
      numberValue(
        row.organization_id
      ),
    organizationName:
      String(
        row.organization_name || ""
      ),
    tenantName:
      String(row.tenant_name || ""),
    hospitalName:
      String(row.hospital_name || ""),
    hospitalAddress:
      String(row.hospital_address || ""),
    hospitalPhone:
      String(row.hospital_phone || ""),
    hospitalEmail:
      String(row.hospital_email || ""),
    hospitalLicenseNumber:
      String(row.hospital_license_number || ""),
    branchName:
      String(row.branch_name || ""),
    clinicName:
      String(row.clinic_name || ""),
    roleKey:
      String(
        row.role_key ||
          "clinical_user"
      ),
    roleName:
      String(
        row.role_name ||
          "Clinical User"
      ),
    permissions:
      (row.permissions ||
        {}) as Record<
        string,
        unknown
      >,
    licensedModules,
    branding: {
      name: brandName || "Hospital",
      logoUrl: logoUrl || null,
      primaryColor:
        firstText(
          effectiveBranding.primaryColor,
          effectiveBranding.primary_color
        ) || "#04142E",
      accentColor:
        firstText(
          effectiveBranding.accentColor,
          effectiveBranding.accent_color
        ) || "#D4AF37",
      source: logoUrl
        ? "hospital"
        : "generated",
    },
  };
}

export async function requireClinicalContext(
  request?: Request
) {
  const context =
    await resolveClinicalContext(
      request
    );

  if (!context) {
    return {
      context: null,
      response:
        clinicalUnauthorized(),
    };
  }

  if (request) {
    const pathname = new URL(
      request.url
    ).pathname;
    const moduleCode =
      moduleCodeForClinicalPath(pathname);

    const roleKey = String(
      context.user.role || ""
    )
      .trim()
      .toUpperCase();
    const isSuperAdmin =
      roleKey === "SUPER_ADMIN" ||
      privilegedClinicalRoles.has(
        String(context.user.role || "")
          .trim()
          .toLowerCase()
      );

    if (isSuperAdmin) {
      return {
        context,
        response: null,
      };
    }

    if (moduleCode) {
      const hasModuleRows =
        await hasExplicitModuleRows(
          context.tenantId,
          context.hospitalId
        );
      const isLicensed =
        !hasModuleRows ||
        (context.licensedModules || []).includes(
          moduleCode
        );

      if (!isLicensed) {
        return {
          context: null,
          response:
            clinicalModuleNotLicensed(
              moduleCode
            ),
        };
      }
    }
  }

  return {
    context,
    response: null,
  };
}

export async function recordClinicalAudit(
  context: ClinicalContext,
  input: {
    moduleName: string;
    action: string;
    entityType?: string | null;
    entityId?: number | null;
    summary?: string | null;
    payload?: unknown;
  }
) {
  await prisma.$executeRawUnsafe(
    `
    INSERT INTO clinical_audit_events (
      tenant_id,
      clinic_id,
      hospital_id,
      branch_id,
      user_id,
      module_name,
      action,
      entity_type,
      entity_id,
      summary,
      payload,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$5,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.clinicId,
    context.hospitalId,
    context.branchId,
    context.user.id ?? null,
    input.moduleName,
    input.action,
    input.entityType ?? null,
    input.entityId ?? null,
    input.summary ?? null,
    JSON.stringify(
      input.payload ?? {}
    )
  );
}
