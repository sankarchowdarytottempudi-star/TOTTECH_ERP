import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  getDictionaryModuleConfig,
  normalizeDictionaryValue,
} from "@/lib/clinical/dictionary-core";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      module: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module } = await params;
  const config =
    getDictionaryModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown dictionary module." },
      { status: 404 }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const entityKey =
    searchParams?.get("entity_key");
  const groupKey =
    searchParams?.get("group_key");

  const paramsList: unknown[] = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];
  const filters: string[] = [];

  if (
    entityKey &&
    [
      "fields",
      "relationships",
      "constraints",
      "indexes",
      "blueprints",
    ].includes(config.key)
  ) {
    const column =
      config.key === "relationships"
        ? "from_entity_key"
        : "entity_key";
    filters.push(
      `AND t.${column} = $${paramsList.length + 1}`
    );
    paramsList.push(entityKey);
  }

  if (
    groupKey &&
    config.key === "entities"
  ) {
    filters.push(
      `AND t.group_key = $${paramsList.length + 1}`
    );
    paramsList.push(groupKey);
  }

  const [rows, screens, reports, endpoints, metrics] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT t.*
        FROM ${config.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted, false) = false
          ${filters.join("\n")}
        ORDER BY t.${config.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT 250
        `,
        ...paramsList
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT screen_key, screen_name, route_path, section_definitions, workflow_definitions
        FROM clinical_dictionary_screen_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND module_key = $4
          AND COALESCE(is_deleted,false) = false
        ORDER BY screen_key
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        config.key
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT report_key, report_name, report_category, output_formats
        FROM clinical_dictionary_report_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND module_key = $4
          AND COALESCE(is_deleted,false) = false
        ORDER BY report_name
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        config.key
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT endpoint_key, method, path, permission_key
        FROM clinical_dictionary_api_endpoint_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND module_key = $4
          AND COALESCE(is_deleted,false) = false
        ORDER BY endpoint_key
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        config.key
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE t.${config.dateColumn}::date = CURRENT_DATE)::int AS today
        FROM ${config.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    context,
    module: config,
    metrics: metrics[0] || {},
    rows,
    screens,
    reports,
    endpoints,
  });
}

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      module: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module } = await params;
  const config =
    getDictionaryModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown dictionary module." },
      { status: 404 }
    );
  }

  const body = await request.json();

  for (const column of config.requiredColumns || []) {
    if (
      body[column] === undefined ||
      body[column] === ""
    ) {
      return NextResponse.json(
        {
          error: `${column.split("_").join(" ")} is required.`,
        },
        { status: 400 }
      );
    }
  }

  const insertColumns = [
    "tenant_id",
    "hospital_id",
    "branch_id",
    "clinic_id",
  ];
  const values: unknown[] = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
  ];

  for (const column of config.createColumns) {
    const normalized =
      normalizeDictionaryValue(
        config,
        column,
        body[column]
      );

    if (normalized !== null) {
      insertColumns.push(column);
      values.push(
        config.jsonColumns?.includes(column)
          ? JSON.stringify(normalized)
          : normalized
      );
    }
  }

  insertColumns.push(
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
    "is_active",
    "is_deleted"
  );
  values.push(
    context.user.id ?? null,
    context.user.id ?? null
  );

  const placeholders = values.map(
    (_, index) => {
      const column =
        insertColumns[index];
      return config.jsonColumns?.includes(column)
        ? `$${index + 1}::jsonb`
        : `$${index + 1}`;
    }
  );
  placeholders.push(
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMESTAMP",
    "true",
    "false"
  );

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO ${config.table} (
        ${insertColumns.join(", ")}
      )
      VALUES (${placeholders.join(", ")})
      RETURNING *
      `,
      ...values
    );
  const row = rows[0];

  await recordClinicalAudit(context, {
    moduleName: `dictionary_${config.key}`,
    action: "create",
    entityType: config.table,
    entityId: null,
    summary: `${config.label} dictionary record created`,
    payload: row,
  });

  return NextResponse.json(row, {
    status: 201,
  });
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      module: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module } = await params;
  const config =
    getDictionaryModuleConfig(module);

  if (!config?.statusColumn) {
    return NextResponse.json(
      {
        error:
          "This dictionary module does not support status updates.",
      },
      { status: 400 }
    );
  }

  const body = await request.json();
  const id = String(body.id || "");
  const status = normalizeDictionaryValue(
    config,
    config.statusColumn,
    body.status
  );

  if (!uuidPattern.test(id) || status === null) {
    return NextResponse.json(
      {
        error:
          "Valid record id and status are required.",
      },
      { status: 400 }
    );
  }

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE ${config.table}
      SET ${config.statusColumn} = $5,
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1::uuid
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      RETURNING *
      `,
      id,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      status,
      context.user.id ?? null
    );

  if (!rows.length) {
    return NextResponse.json(
      { error: "Record not found." },
      { status: 404 }
    );
  }

  await recordClinicalAudit(context, {
    moduleName: `dictionary_${config.key}`,
    action: "update",
    entityType: config.table,
    entityId: null,
    summary: `${config.label} status updated`,
    payload: { id, status },
  });

  return NextResponse.json(rows[0]);
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      module: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module } = await params;
  const config =
    getDictionaryModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown dictionary module." },
      { status: 404 }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const id = String(searchParams?.get("id") || "");

  if (!uuidPattern.test(id)) {
    return NextResponse.json(
      { error: "Valid record id is required." },
      { status: 400 }
    );
  }

  await prisma.$executeRawUnsafe(
    `
    UPDATE ${config.table}
    SET is_deleted = true,
        is_active = false,
        deleted_at = CURRENT_TIMESTAMP,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1::uuid
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName: `dictionary_${config.key}`,
    action: "delete",
    entityType: config.table,
    entityId: null,
    summary: `${config.label} dictionary record deleted`,
    payload: { id },
  });

  return NextResponse.json({
    success: true,
  });
}
