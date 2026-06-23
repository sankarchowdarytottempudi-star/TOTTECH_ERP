import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  getAnalyticsModuleConfig,
  normalizeAnalyticsValue,
} from "@/lib/clinical/analytics-core";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

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
    getAnalyticsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown analytics module." },
      { status: 404 }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const status = searchParams?.get("status");
  const paramsList: unknown[] = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];
  const filters: string[] = [];

  if (status && config.statusColumn) {
    filters.push(
      `AND t.${config.statusColumn} = $${paramsList.length + 1}`
    );
    paramsList.push(status);
  }

  const [rows, screens, reports, endpoints, metrics, insights] =
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
        LIMIT 200
        `,
        ...paramsList
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT screen_key, screen_name, route_path, dashboard_type, section_definitions, visualization_definitions, workflow_definitions
        FROM clinical_analytics_screen_definitions
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
        SELECT report_key, report_name, report_category, output_formats, metric_definitions
        FROM clinical_analytics_report_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND module_key = $4
          AND COALESCE(is_deleted,false) = false
        ORDER BY report_category, report_name
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        config.key
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT endpoint_key, method, path, permission_key
        FROM clinical_analytics_api_endpoint_definitions
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
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT insight_key, insight_type, severity, title, summary, confidence_score, status, clinical_review_required
        FROM clinical_analytics_ai_insights
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND (module_key = $4 OR $4 = 'ai-insights')
          AND COALESCE(is_deleted,false) = false
        ORDER BY created_at DESC, id DESC
        LIMIT 20
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        config.key
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
    insights,
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
    getAnalyticsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown analytics module." },
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

  if (config.uidColumn) {
    insertColumns.push(config.uidColumn);
    values.push(
      `${config.idPrefix}-${Date.now()}`
    );
  }

  for (const column of config.createColumns) {
    if (
      config.uidColumn &&
      column === config.uidColumn
    ) {
      continue;
    }

    const normalized =
      normalizeAnalyticsValue(
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
    moduleName: `analytics_${config.key}`,
    action: "create",
    entityType: config.table,
    entityId: Number(row.id),
    summary: `${config.label} analytics record created`,
    payload: row,
  });

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO clinical_analytics_timeline (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      module_key,
      event_type,
      event_title,
      event_summary,
      source_table,
      source_id,
      payload,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    config.key,
    config.key.toUpperCase(),
    `${config.label} created`,
    `${config.category} analytics workflow record created`,
    config.table,
    Number(row.id),
    JSON.stringify(row),
    context.user.id ?? null
  );

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
    getAnalyticsModuleConfig(module);

  if (!config?.statusColumn) {
    return NextResponse.json(
      {
        error:
          "This analytics module does not support status updates.",
      },
      { status: 400 }
    );
  }

  const body = await request.json();
  const id = toNumber(body.id);
  const status = normalizeAnalyticsValue(
    config,
    config.statusColumn,
    body.status
  );

  if (!id || status === null) {
    return NextResponse.json(
      {
        error:
          "Record id and status are required.",
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
      WHERE id = $1
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
    moduleName: `analytics_${config.key}`,
    action: "update",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} status updated`,
    payload: { status },
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
    getAnalyticsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown analytics module." },
      { status: 404 }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const id = toNumber(searchParams?.get("id"));

  if (!id) {
    return NextResponse.json(
      { error: "Record id is required." },
      { status: 400 }
    );
  }

  await prisma.$executeRawUnsafe(
    `
    UPDATE ${config.table}
    SET is_deleted = true,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
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
    moduleName: `analytics_${config.key}`,
    action: "delete",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} analytics record deleted`,
  });

  return NextResponse.json({
    success: true,
  });
}
