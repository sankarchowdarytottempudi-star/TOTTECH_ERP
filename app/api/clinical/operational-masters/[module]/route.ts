import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  getOperationalMasterConfig,
  normalizeOperationalValue,
} from "@/lib/clinical/operational-masters-core";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

const text = (value: unknown) =>
  String(value ?? "").trim();

function validateBody(
  config: NonNullable<
    ReturnType<typeof getOperationalMasterConfig>
  >,
  body: Record<string, unknown>
) {
  const errors: string[] = [];

  for (const field of config.fields) {
    if (
      field.required &&
      !text(body[field.key])
    ) {
      errors.push(`${field.label} is required.`);
    }

    if (
      field.type === "json" &&
      text(body[field.key])
    ) {
      const normalized =
        normalizeOperationalValue(
          field,
          body[field.key]
        );

      if (!normalized) {
        errors.push(
          `${field.label} must be valid JSON.`
        );
      }
    }
  }

  return errors;
}

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
    getOperationalMasterConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown operational master.",
      },
      { status: 404 }
    );
  }

  const url = new URL(request.url);
  const q = text(url.searchParams?.get("q"));
  const status = text(
    url.searchParams?.get("status")
  );
  const filters = [
    "tenant_id = $1",
    "hospital_id = $2",
    "branch_id = $3",
    "COALESCE(is_deleted,false) = false",
  ];
  const values: unknown[] = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];

  if (q) {
    const searchParts =
      config.searchColumns.map((column) => {
        values.push(`%${q}%`);
        return `COALESCE(${column}::text,'') ILIKE $${values.length}`;
      });
    filters.push(
      `(${searchParts.join(" OR ")})`
    );
  }

  if (status && config.statusColumn) {
    values.push(status);
    filters.push(
      `${config.statusColumn} = $${values.length}`
    );
  }

  const [rows, metrics] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM ${config.table}
        WHERE ${filters.join(" AND ")}
        ORDER BY ${config.dateColumn} DESC NULLS LAST, id DESC
        LIMIT 300
        `,
        ...values
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT COUNT(*)::int AS total
        FROM ${config.table}
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted,false) = false
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
    getOperationalMasterConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown operational master.",
      },
      { status: 404 }
    );
  }

  const body =
    (await request.json()) as Record<
      string,
      unknown
    >;
  const errors = validateBody(config, body);

  if (errors.length) {
    return NextResponse.json(
      { error: errors.join(" ") },
      { status: 400 }
    );
  }

  const columns = [
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
  const placeholders = [
    "$1",
    "$2",
    "$3",
    "$4",
  ];

  for (const field of config.fields) {
    const normalized =
      normalizeOperationalValue(
        field,
        body[field.key]
      );

    if (normalized !== null) {
      columns.push(field.key);
      values.push(
        field.type === "json"
          ? JSON.stringify(normalized)
          : normalized
      );
      placeholders.push(
        field.type === "json"
          ? `$${values.length}::jsonb`
          : `$${values.length}`
      );
    }
  }

  if (
    config.key === "doctors" &&
    !columns.includes("doctor_uid")
  ) {
    columns.push("doctor_uid");
    values.push(
      text(body.doctor_code) ||
        `DOC-${Date.now()}`
    );
    placeholders.push(`$${values.length}`);
  }

  columns.push(
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
  placeholders.push(
    `$${values.length - 1}`,
    `$${values.length}`,
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMESTAMP",
    "false"
  );

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO ${config.table} (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
      `,
      ...values
    );

  await recordClinicalAudit(context, {
    moduleName: `operational_${config.key}`,
    action: "create",
    entityType: config.table,
    entityId: Number(rows[0]?.id),
    summary: `${config.label} created`,
    payload: rows[0],
  });

  return NextResponse.json(rows[0], {
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
    getOperationalMasterConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown operational master.",
      },
      { status: 404 }
    );
  }

  const body =
    (await request.json()) as Record<
      string,
      unknown
    >;
  const id = toNumber(body.id);

  if (!id) {
    return NextResponse.json(
      { error: "Record id is required." },
      { status: 400 }
    );
  }

  const errors = validateBody(config, body);

  if (errors.length) {
    return NextResponse.json(
      { error: errors.join(" ") },
      { status: 400 }
    );
  }

  const updates: string[] = [];
  const values: unknown[] = [
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];

  for (const field of config.fields) {
    const normalized =
      normalizeOperationalValue(
        field,
        body[field.key]
      );
    values.push(
      field.type === "json" &&
        normalized !== null
        ? JSON.stringify(normalized)
        : normalized
    );
    updates.push(
      `${field.key} = ${
        field.type === "json"
          ? `$${values.length}::jsonb`
          : `$${values.length}`
      }`
    );
  }

  values.push(context.user.id ?? null);
  updates.push(
    `updated_by = $${values.length}`,
    "updated_at = CURRENT_TIMESTAMP"
  );

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE ${config.table}
      SET ${updates.join(", ")}
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      RETURNING *
      `,
      ...values
    );

  if (!rows.length) {
    return NextResponse.json(
      { error: "Record not found." },
      { status: 404 }
    );
  }

  await recordClinicalAudit(context, {
    moduleName: `operational_${config.key}`,
    action: "update",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} updated`,
    payload: rows[0],
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
    getOperationalMasterConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown operational master.",
      },
      { status: 404 }
    );
  }

  const id = toNumber(
    new URL(request.url).searchParams?.get("id")
  );

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
    moduleName: `operational_${config.key}`,
    action: "delete",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} deleted`,
  });

  return NextResponse.json({
    success: true,
  });
}
