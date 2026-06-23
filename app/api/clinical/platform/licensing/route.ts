import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  CLINICAL_MODULE_CODES,
  CLINICAL_MODULE_LABELS,
} from "@/lib/clinical/module-licensing";
import {
  nullableText,
  serialize,
  text,
} from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const editableRoles = new Set([
  "tottech_super_admin",
  "clinical_super_admin",
  "organization_admin",
]);

const readableRoles = new Set([
  ...editableRoles,
  "hospital_admin",
]);

const planPresets: Record<string, string[]> = {
  IVF_ONLY: ["PATIENTS", "APPOINTMENTS", "OP", "IVF", "BILLING"],
  CLINICAL_PRO: [
    "PATIENTS",
    "APPOINTMENTS",
    "OP",
    "IVF",
    "LAB",
    "RADIOLOGY",
    "PHARMACY",
    "BILLING",
    "FINANCE",
  ],
  ENTERPRISE: [...CLINICAL_MODULE_CODES],
};

export async function GET(
  request: Request
) {
  const auth =
    await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  if (!readableRoles.has(context.roleKey)) {
    return NextResponse.json(
      {
        error:
          "Only hospital administrators can view licensing.",
      },
      { status: 403 }
    );
  }

  const canEdit = editableRoles.has(
    context.roleKey
  );
  const rows = await prisma.$queryRawUnsafe<
    Row[]
  >(
    `
    SELECT
      h.id,
      h.tenant_id,
      h.hospital_name,
      h.hospital_code,
      h.email,
      h.phone,
      h.status AS hospital_status,
      h.branding,
      COALESCE(hs.plan_name, 'ENTERPRISE') AS plan_name,
      hs.start_date,
      hs.end_date,
      COALESCE(hs.status, h.status, 'ACTIVE') AS subscription_status,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'module_code', hma.module_code,
            'enabled', COALESCE(hma.enabled, false),
            'label', hma.module_code
          ) ORDER BY hma.module_code)
          FROM hospital_module_access hma
          WHERE hma.tenant_id = h.tenant_id
            AND hma.hospital_id = h.id
        ),
        '[]'::jsonb
      ) AS modules
    FROM hospitals h
    LEFT JOIN LATERAL (
      SELECT *
      FROM hospital_subscriptions hs
      WHERE hs.tenant_id = h.tenant_id
        AND hs.hospital_id = h.id
        AND COALESCE(hs.is_deleted, false) = false
      ORDER BY hs.created_at DESC, hs.id DESC
      LIMIT 1
    ) hs ON true
    WHERE h.tenant_id = $1
      AND COALESCE(h.is_deleted, false) = false
      AND ($2::boolean = true OR h.id = $3)
    ORDER BY h.hospital_name ASC
    `,
    context.tenantId,
    canEdit,
    context.hospitalId
  );

  return NextResponse.json(
    serialize({
      canEdit,
      modules: CLINICAL_MODULE_CODES.map(
        (moduleCode) => ({
          module_code: moduleCode,
          label:
            CLINICAL_MODULE_LABELS[
              moduleCode
            ],
        })
      ),
      rows,
    })
  );
}

export async function PUT(
  request: Request
) {
  const auth =
    await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  if (!editableRoles.has(context.roleKey)) {
    return NextResponse.json(
      {
        error:
          "Only platform super admins can modify hospital licensing.",
      },
      { status: 403 }
    );
  }

  const body = await request.json();
  const hospitalId = Number(body.hospital_id);
  const planName =
    text(body.plan_name) || "CUSTOM";
  const status =
    text(body.status) || "ACTIVE";
  const startDate =
    nullableText(body.start_date);
  const endDate = nullableText(body.end_date);
  const requestedModules: string[] = Array.isArray(
    body.modules
  )
    ? body.modules.map((item: unknown) =>
        String(item || "")
      )
    : planPresets[planName] || [];
  const enabledModules = new Set(
    requestedModules.filter((moduleCode) =>
      CLINICAL_MODULE_CODES.includes(
        moduleCode as any
      )
    )
  );

  if (!hospitalId) {
    return NextResponse.json(
      { error: "hospital_id is required." },
      { status: 400 }
    );
  }

  const hospitalRows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, hospital_name
      FROM hospitals
      WHERE tenant_id = $1
        AND id = $2
        AND COALESCE(is_deleted, false) = false
      LIMIT 1
      `,
      context.tenantId,
      hospitalId
    );

  if (!hospitalRows.length) {
    return NextResponse.json(
      { error: "Hospital not found." },
      { status: 404 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `
      INSERT INTO hospital_subscriptions (
        tenant_id,
        hospital_id,
        plan_name,
        start_date,
        end_date,
        status,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4::date,$5::date,$6,$7,$7,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      hospitalId,
      planName,
      startDate,
      endDate,
      status,
      context.user.id ?? null
    );

    for (const moduleCode of CLINICAL_MODULE_CODES) {
      await tx.$executeRawUnsafe(
        `
        INSERT INTO hospital_module_access (
          tenant_id,
          hospital_id,
          module_code,
          enabled,
          enabled_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (tenant_id, hospital_id, module_code)
        DO UPDATE SET
          enabled = EXCLUDED.enabled,
          updated_by = EXCLUDED.updated_by,
          updated_at = CURRENT_TIMESTAMP
        `,
        context.tenantId,
        hospitalId,
        moduleCode,
        enabledModules.has(moduleCode),
        context.user.id ?? null
      );
    }
  });

  await recordClinicalAudit(context, {
    moduleName: "hospital_licensing",
    action: "update",
    entityType: "hospital",
    entityId: hospitalId,
    summary: "Hospital subscription and module access updated",
    payload: {
      hospital_id: hospitalId,
      plan_name: planName,
      status,
      modules: Array.from(enabledModules),
    },
  });

  return NextResponse.json({
    success: true,
  });
}
