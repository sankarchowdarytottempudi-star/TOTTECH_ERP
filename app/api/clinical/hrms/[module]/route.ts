import { NextResponse } from "next/server";

import type { ClinicalContext } from "@/lib/clinical/context";
import { requireClinicalContext } from "@/lib/clinical/context";
import { getHrmsModuleConfig } from "@/lib/clinical/hrms-core";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Row = Record<string, unknown>;

const tableColumnsCache = new Map<string, string[]>();

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
    getHrmsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Unknown clinical HRMS module.",
      },
      { status: 404 }
    );
  }

  const [rows, metrics] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT t.*
        FROM ${config.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        ORDER BY t.${config.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT 500
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
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
  const config = getHrmsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown clinical HRMS module." },
      { status: 404 }
    );
  }

  const body = (await request.json()) as Record<
    string,
    unknown
  >;
  const columns = await getTableColumns(
    config.table
  );
  const payload = normalizePayload(
    body,
    columns,
    context
  );

  if (!Object.keys(payload).length) {
    return NextResponse.json(
      {
        error:
          "At least one field is required to create a record.",
      },
      { status: 400 }
    );
  }

  try {
    const inserted = await insertRecord(
      config.table,
      payload
    );

    return NextResponse.json(inserted, {
      status: 201,
    });
  } catch (error) {
    return hrmsErrorResponse(error, "Unable to create this HRMS record.");
  }
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
  const config = getHrmsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown clinical HRMS module." },
      { status: 404 }
    );
  }

  const body = (await request.json()) as Record<
    string,
    unknown
  >;
  const id = Number(body.id);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { error: "Record id is required." },
      { status: 400 }
    );
  }

  const columns = await getTableColumns(
    config.table
  );
  const payload = normalizePayload(
    body,
    columns,
    context
  );
  delete payload.id;

  if (!Object.keys(payload).length) {
    return NextResponse.json(
      {
        error:
          "At least one field is required to update a record.",
      },
      { status: 400 }
    );
  }

  try {
    const updated = await updateRecord(
      config.table,
      id,
      payload,
      context
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return hrmsErrorResponse(error, "Unable to update this HRMS record.");
  }
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
  const config = getHrmsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown clinical HRMS module." },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams?.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { error: "Record id is required." },
      { status: 400 }
    );
  }

  try {
    const deleted = await softDeleteRecord(
      config.table,
      id,
      context
    );

    if (!deleted) {
      return NextResponse.json(
        { error: "Record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return hrmsErrorResponse(error, "Unable to delete this HRMS record.");
  }
}

async function getTableColumns(table: string) {
  const cached = tableColumnsCache.get(table);
  if (cached) {
    return cached;
  }

  const rows = await prisma.$queryRawUnsafe<
    { column_name: string }[]
  >(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position
    `,
    table
  );

  const columns = rows.map((row) => row.column_name);
  tableColumnsCache.set(table, columns);
  return columns;
}

function normalizePayload(
  body: Record<string, unknown>,
  columns: string[],
  context: ClinicalContext
) {
  const allowed = new Set(columns);
  const payload: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    if (!allowed.has(key)) continue;
    if (value === undefined) continue;
    if (typeof value === "string" && !value.trim()) continue;
    payload[key] = value;
  }

  for (const key of [
    "tenant_id",
    "hospital_id",
    "branch_id",
    "clinic_id",
    "created_by",
    "updated_by",
    "is_deleted",
  ]) {
    if (!allowed.has(key)) continue;
    if (key === "is_deleted") {
      payload[key] = false;
    } else if (key === "created_by" || key === "updated_by") {
      payload[key] = context.user.id ?? null;
    } else if (key === "clinic_id") {
      payload[key] = context.clinicId ?? null;
    } else if (key === "tenant_id") {
      payload[key] = context.tenantId;
    } else if (key === "hospital_id") {
      payload[key] = context.hospitalId;
    } else if (key === "branch_id") {
      payload[key] = context.branchId;
    }
  }

  return payload;
}

async function insertRecord(
  table: string,
  payload: Record<string, unknown>
) {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${placeholders})
    RETURNING *
    `,
    ...values
  );

  return rows[0] || null;
}

async function updateRecord(
  table: string,
  id: number,
  payload: Record<string, unknown>,
  context: {
    tenantId: number;
    hospitalId: number;
    branchId: number;
  }
) {
  const columns = Object.keys(payload);
  if (!columns.length) return null;

  const setClause = columns
    .map((column, index) => `${column} = $${index + 1}`)
    .join(", ");

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE ${table}
    SET ${setClause}
    WHERE id = $${columns.length + 1}
      AND tenant_id = $${columns.length + 2}
      AND hospital_id = $${columns.length + 3}
      AND branch_id = $${columns.length + 4}
    RETURNING *
    `,
    ...columns.map((column) => payload[column]),
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );

  return rows[0] || null;
}

async function softDeleteRecord(
  table: string,
  id: number,
  context: {
    tenantId: number;
    hospitalId: number;
    branchId: number;
  }
) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE ${table}
    SET is_deleted = true
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    RETURNING id
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );

  return rows.length > 0;
}

function hrmsErrorResponse(
  error: unknown,
  fallback: string
) {
  const message = formatHrmsError(error, fallback);
  return NextResponse.json(
    { error: message },
    { status: 400 }
  );
}

function formatHrmsError(
  error: unknown,
  fallback: string
) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "A record with these details already exists.";
    }
    if (error.code === "P2003") {
      return "One of the linked values is invalid or missing.";
    }
    if (error.code === "P2011" || error.code === "P2010") {
      const metaMessage =
        (error.meta as { driverAdapterError?: { message?: string }; message?: string } | undefined)
          ?.driverAdapterError?.message ||
        (error.meta as { message?: string } | undefined)?.message ||
        "";
      if (/null value in column/i.test(metaMessage)) {
        return "Please complete all required fields before saving.";
      }
      if (/column .* does not exist/i.test(metaMessage)) {
        return "This HRMS module is missing a required database column.";
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
