import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  getPharmacyModuleConfig,
  normalizePharmacyValue,
} from "@/lib/clinical/pharmacy-core";
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
    getPharmacyModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown pharmacy module." },
      { status: 404 }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const patientId = toNumber(
    searchParams?.get("patient_id")
  );
  const medicineId = toNumber(
    searchParams?.get("medicine_id")
  );
  const search = String(searchParams?.get("q") || searchParams?.get("search") || "").trim();
  const recordId = toNumber(searchParams?.get("record_id") || searchParams?.get("id"));
  const page = Math.max(
    1,
    Number(searchParams?.get("page") || 1) || 1
  );
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams?.get("limit") || 10) || 10)
  );
  const offset = (page - 1) * limit;

  const paramsList: unknown[] = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];
  const filters: string[] = [];

  if (
    patientId &&
    config.patientColumn
  ) {
    filters.push(
      `AND t.${config.patientColumn} = $${paramsList.length + 1}`
    );
    paramsList.push(patientId);
  }

  if (
    medicineId &&
    config.medicineColumn
  ) {
    const column =
      config.medicineColumn === "id"
        ? "id"
        : config.medicineColumn;
    filters.push(
      `AND t.${column} = $${paramsList.length + 1}`
    );
    paramsList.push(medicineId);
  }

  if (search.length >= 2) {
    paramsList.push(`%${search.toLowerCase()}%`);
    filters.push(
      `AND LOWER(to_jsonb(t)::text) LIKE $${paramsList.length}`
    );
  }

  if (recordId) {
    paramsList.push(recordId);
    filters.push(`AND t.id = $${paramsList.length}`);
  }

  const pagingParams = [
    ...paramsList,
    limit,
    offset,
  ];
  const limitIndex = paramsList.length + 1;
  const offsetIndex = paramsList.length + 2;

  const [rows, screens, reports, endpoints, metrics, totalRows] =
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
        LIMIT $${limitIndex}
        OFFSET $${offsetIndex}
        `,
        ...pagingParams
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT screen_key, screen_name, route_path, section_definitions, field_definitions, workflow_definitions
        FROM pharmacy_screen_definitions
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
        FROM pharmacy_report_definitions
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
        FROM pharmacy_api_endpoint_definitions
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
      SELECT COUNT(*)::int AS total_count
      FROM ${config.table} t
      WHERE t.tenant_id = $1
        AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
          ${filters.join("\n")}
        `,
        ...paramsList
      ),
    ]);

  return NextResponse.json({
    context,
    module: config,
    metrics: metrics[0] || {},
    pagination: {
      page,
      limit,
      totalCount: Number(totalRows[0]?.total_count || 0),
    },
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
    getPharmacyModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown pharmacy module." },
      { status: 404 }
    );
  }

  const body = await request.json();

  if (
    config.key === "medicines" &&
    (!body.generic_name ||
      !body.brand_name ||
      !body.strength ||
      !body.form ||
      !body.manufacturer)
  ) {
    return NextResponse.json(
      {
        error:
          "Generic name, brand name, strength, form, and manufacturer are required.",
      },
      { status: 400 }
    );
  }

  if (
    config.createColumns.includes("medicine_id") &&
    !toNumber(body.medicine_id)
  ) {
    return NextResponse.json(
      {
        error:
          "Medicine selection is required for this pharmacy workflow.",
      },
      { status: 400 }
    );
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
      normalizePharmacyValue(
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
    moduleName: `pharmacy_${config.key}`,
    action: "create",
    entityType: config.table,
    entityId: Number(row.id),
    summary: `${config.label} record created`,
    payload: row,
  });

  const patientId = config.patientColumn
    ? toNumber(row[config.patientColumn])
    : null;
  const medicineId =
    config.medicineColumn === "id"
      ? toNumber(row.id)
      : config.medicineColumn
        ? toNumber(row[config.medicineColumn])
        : null;
  const batchId = toNumber(row.batch_id);

  if (patientId || medicineId || batchId) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO pharmacy_timeline (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        patient_id,
        medicine_id,
        batch_id,
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      patientId,
      medicineId,
      batchId,
      config.key.toUpperCase(),
      `${config.label} created`,
      `${config.label} workflow record created`,
      config.table,
      Number(row.id),
      JSON.stringify(row),
      context.user.id ?? null
    );
  }

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
    getPharmacyModuleConfig(module);

  if (!config?.statusColumn) {
    return NextResponse.json(
      {
        error:
          "This pharmacy module does not support status updates.",
      },
      { status: 400 }
    );
  }

  const body = await request.json();
  const id = toNumber(body.id);
  const status = normalizePharmacyValue(
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

  const completedDispenseSet =
        config.key === "prescription-queue" &&
    String(status) === "COMPLETED"
      ? ", dispensed_at = CURRENT_TIMESTAMP"
      : "";
  const hasEditableFields = config.createColumns.some((column) =>
    Object.prototype.hasOwnProperty.call(body, column)
  );

  if (body._mode === "status" || (!hasEditableFields && body.status !== undefined)) {
    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        UPDATE ${config.table}
        SET ${config.statusColumn} = $5,
            updated_by = $6,
            updated_at = CURRENT_TIMESTAMP
            ${completedDispenseSet}
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
      moduleName: `pharmacy_${config.key}`,
      action: "update",
      entityType: config.table,
      entityId: id,
      summary: `${config.label} status updated`,
      payload: { status },
    });

    if (
      config.key === "prescription-queue" &&
      rows[0].prescription_id
    ) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE prescriptions
        SET pharmacy_status = $5,
            updated_by = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
          AND COALESCE(is_deleted,false) = false
        `,
        rows[0].prescription_id,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        status,
        context.user.id ?? null
      );
    }

    return NextResponse.json(rows[0]);
  }

  const updateAssignments: string[] = [];
  const updateValues: unknown[] = [
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];

  for (const column of config.createColumns) {
    const hasColumn =
      Object.prototype.hasOwnProperty.call(body, column);
    if (!hasColumn) {
      continue;
    }

    const normalized = normalizePharmacyValue(
      config,
      column,
      body[column]
    );

    if (normalized !== null) {
      updateAssignments.push(
        `${column} = $${updateValues.length + 1}${config.jsonColumns?.includes(column) ? "::jsonb" : ""}`
      );
      updateValues.push(
        config.jsonColumns?.includes(column)
          ? JSON.stringify(normalized)
          : normalized
      );
    }
  }

  if (body.status !== undefined && config.statusColumn) {
    const normalizedStatus = normalizePharmacyValue(
      config,
      config.statusColumn,
      body.status
    );
    if (normalizedStatus !== null) {
      updateAssignments.push(
        `${config.statusColumn} = $${updateValues.length + 1}`
      );
      updateValues.push(normalizedStatus);
    }
  }

  if (!updateAssignments.length) {
    return NextResponse.json(
      { error: "At least one editable field is required." },
      { status: 400 }
    );
  }

  updateAssignments.push(
    `updated_by = $${updateValues.length + 1}`,
    "updated_at = CURRENT_TIMESTAMP"
  );
  updateValues.push(context.user.id ?? null);

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE ${config.table}
      SET ${updateAssignments.join(", ")}
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      RETURNING *
      `,
      ...updateValues
    );

  if (!rows.length) {
    return NextResponse.json(
      { error: "Record not found." },
      { status: 404 }
    );
  }

  await recordClinicalAudit(context, {
    moduleName: `pharmacy_${config.key}`,
    action: "update",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} record updated`,
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
    getPharmacyModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      { error: "Unknown pharmacy module." },
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
    moduleName: `pharmacy_${config.key}`,
    action: "delete",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} record deleted`,
  });

  return NextResponse.json({
    success: true,
  });
}
