import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  getIvfModuleConfig,
  normalizeIvfValue,
} from "@/lib/clinical/ivf-core";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

const getTableColumns = async (table: string) => {
  const rows = await prisma.$queryRawUnsafe<{ column_name: string }[]>(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = $1
    `,
    table
  );
  return new Set(rows.map((row) => row.column_name));
};

const quoteIdent = (value: string) =>
  `"${value.replace(/"/g, '""')}"`;

const unique = <T,>(values: T[]) =>
  Array.from(new Set(values));

const clinicalScopeColumns = [
  "tenant_id",
  "hospital_id",
  "branch_id",
] as const;

const foreignKeyTargets: Record<
  string,
  {
    table: string;
    label: string;
  }
> = {
  couple_id: {
    table: "ivf_couples",
    label: "couple",
  },
  cycle_id: {
    table: "ivf_cycles",
    label: "IVF cycle",
  },
  treatment_plan_id: {
    table: "ivf_treatment_plans",
    label: "IVF treatment plan",
  },
  retrieval_id: {
    table: "ivf_retrievals",
    label: "egg retrieval",
  },
  embryo_id: {
    table: "ivf_embryos",
    label: "embryo",
  },
  embryo_record_id: {
    table: "ivf_embryos",
    label: "embryo",
  },
  transfer_id: {
    table: "ivf_embryo_transfers",
    label: "embryo transfer",
  },
  doctor_id: {
    table: "doctors",
    label: "doctor",
  },
  embryologist_id: {
    table: "doctors",
    label: "embryologist",
  },
  anesthetist_id: {
    table: "doctors",
    label: "anesthetist",
  },
  approved_by: {
    table: "doctors",
    label: "approver",
  },
  patient_id: {
    table: "patients",
    label: "patient",
  },
  female_patient_id: {
    table: "patients",
    label: "female patient",
  },
  male_patient_id: {
    table: "patients",
    label: "male patient",
  },
  department_id: {
    table: "departments",
    label: "department",
  },
};

const validateForeignKeys = async (
  context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>,
  input: {
    config: NonNullable<ReturnType<typeof getIvfModuleConfig>>;
    writableColumns: string[];
    body: Row;
  }
) => {
  for (const column of input.writableColumns) {
    const target = foreignKeyTargets[column];
    if (!target) {
      continue;
    }

    const normalized = normalizeIvfValue(
      input.config,
      column,
      input.body[column]
    );
    const id = toNumber(normalized);

    if (!id) {
      continue;
    }

    const targetColumns = await getTableColumns(target.table);
    const values: unknown[] = [id];
    const filters = ["id = $1"];

    for (const scopeColumn of clinicalScopeColumns) {
      if (!targetColumns.has(scopeColumn)) {
        continue;
      }
      values.push(context[scopeColumn === "tenant_id" ? "tenantId" : scopeColumn === "hospital_id" ? "hospitalId" : "branchId"]);
      filters.push(`${scopeColumn} = $${values.length}`);
    }

    if (targetColumns.has("is_deleted")) {
      filters.push("COALESCE(is_deleted,false) = false");
    }

    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id
      FROM ${target.table}
      WHERE ${filters.join(" AND ")}
      LIMIT 1
      `,
      ...values
    );

    if (!rows.length) {
      return `Selected ${target.label} was not found for this hospital and branch. Please select a valid ${target.label} or leave it blank.`;
    }
  }

  return null;
};

const resolveCyclePatientId = async (input: {
  coupleId: number | null;
  explicitPatientId: number | null;
}) => {
  if (input.explicitPatientId) {
    return input.explicitPatientId;
  }
  if (!input.coupleId) {
    return null;
  }
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT female_patient_id, male_patient_id
    FROM ivf_couples
    WHERE id = $1
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,
    input.coupleId
  );
  return toNumber(rows[0]?.female_patient_id) || toNumber(rows[0]?.male_patient_id);
};

const normalizeAttachments = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const row = item as Row;
      const name = String(row.name || row.file_name || "").trim();
      const type = String(row.type || row.file_type || "").trim();
      const dataUrl = String(row.dataUrl || row.data_url || row.url || "").trim();
      if (!name && !dataUrl) {
        return null;
      }
      return {
        name,
        type,
        size: Number(row.size || 0) || 0,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      };
    })
    .filter(Boolean);
};

const createIvfDocuments = async (
  context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>,
  input: {
    config: NonNullable<ReturnType<typeof getIvfModuleConfig>>;
    row: Row;
    attachments: ReturnType<typeof normalizeAttachments>;
  }
) => {
  if (!input.attachments.length) {
    return;
  }

  const coupleId = toNumber(input.row.couple_id);
  const patientId = toNumber(input.row.patient_id);
  const cycleId = toNumber(input.row.cycle_id);

  for (const attachment of input.attachments) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO ivf_documents (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        couple_id,
        patient_id,
        cycle_id,
        record_number,
        record_date,
        title,
        status,
        payload,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE,$9,'ACTIVE',$10::jsonb,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      coupleId,
      patientId,
      cycleId,
      `${input.config.idPrefix}-ATT-${Date.now()}`,
      attachment?.name || `${input.config.label} attachment`,
      JSON.stringify({
        ...attachment,
        source_module: input.config.key,
        source_table: input.config.table,
        source_id: input.row.id,
      }),
      context.user.id ?? null
    );
  }
};

const treatmentPlanExists = async (
  context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>,
  treatmentPlanId: number
) => {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT id
    FROM ivf_treatment_plans
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,
    treatmentPlanId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  return rows.length > 0;
};

const createIvfTimeline = async (
  context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>,
  input: {
    config: NonNullable<ReturnType<typeof getIvfModuleConfig>>;
    row: Row;
    action: "created" | "updated";
  }
) => {
  const coupleId =
    input.config.coupleColumn === "id"
      ? Number(input.row.id)
      : toNumber(input.row[input.config.coupleColumn || ""]);
  const patientId =
    (input.config.patientColumn
      ? toNumber(input.row[input.config.patientColumn])
      : null) ||
    toNumber(input.row.patient_id) ||
    toNumber(input.row.female_patient_id);
  const cycleId =
    input.config.key === "cycles"
      ? Number(input.row.id)
      : toNumber(input.row.cycle_id);

  if (!coupleId) {
    return;
  }

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO ivf_timeline (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      couple_id,
      patient_id,
      cycle_id,
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
    coupleId,
    patientId,
    cycleId,
    input.config.key.toUpperCase(),
    `${input.config.label} ${input.action}`,
    `${input.config.label} workflow record ${input.action}`,
    input.config.table,
    Number(input.row.id),
    JSON.stringify(input.row),
    context.user.id ?? null
  );
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
  const config = getIvfModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error: "Unknown IVF module.",
      },
      {
        status: 404,
      }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const coupleId = toNumber(
    searchParams?.get("couple_id")
  );
  const patientId = toNumber(
    searchParams?.get("patient_id")
  );
  const search = String(searchParams?.get("search") || "").trim();
  const genericSearch = String(
    searchParams?.get("q") || search
  ).trim();
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

  if (coupleId && config.coupleColumn) {
    if (config.coupleColumn === "id") {
      filters.push("AND t.id = $4");
    } else {
      filters.push(
        `AND t.${config.coupleColumn} = $4`
      );
    }
    paramsList.push(coupleId);
  }

  if (
    patientId &&
    config.patientColumn &&
    !coupleId
  ) {
    filters.push(
      `AND t.${config.patientColumn} = $4`
    );
    paramsList.push(patientId);
  }

  if (search && config.key === "embryos") {
    paramsList.push(`%${search.toLowerCase()}%`);
    const index = paramsList.length;
    filters.push(`
      AND (
        LOWER(COALESCE(t.embryo_id,'')) LIKE $${index}
        OR LOWER(COALESCE(t.embryo_grade,'')) LIKE $${index}
        OR LOWER(COALESCE(t.day3_grade,'')) LIKE $${index}
        OR LOWER(COALESCE(t.day5_grade,'')) LIKE $${index}
        OR EXISTS (
          SELECT 1
          FROM ivf_cycles cyc
          WHERE cyc.id = COALESCE(t.cycle_id, t.ivf_cycle_id)
            AND LOWER(COALESCE(cyc.cycle_number,'')) LIKE $${index}
        )
        OR EXISTS (
          SELECT 1
          FROM patients p
          LEFT JOIN ivf_couples c ON c.id = t.couple_id
          WHERE p.id = COALESCE(t.patient_id, c.female_patient_id, c.male_patient_id)
            AND LOWER(CONCAT_WS(' ', p.first_name, p.middle_name, p.last_name, p.phone, p.patient_uid, p.uhid, p.abha_id)) LIKE $${index}
        )
      )
    `);
  }

  if (genericSearch.length >= 2 && config.key !== "embryos") {
    paramsList.push(`%${genericSearch.toLowerCase()}%`);
    filters.push(
      `AND LOWER(to_jsonb(t)::text) LIKE $${paramsList.length}`
    );
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
        FROM ivf_screen_definitions
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
        FROM ivf_report_definitions
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
        FROM ivf_api_endpoint_definitions
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
  const config = getIvfModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error: "Unknown IVF module.",
      },
      {
        status: 404,
      }
    );
  }

  try {
  const body = await request.json();
  const recordId = toNumber(body.id);

  if (
    config.createColumns.includes("couple_id") &&
    !toNumber(body.couple_id)
  ) {
    return NextResponse.json(
      {
        error:
          "Couple selection is required for this IVF workflow.",
      },
      {
        status: 400,
      }
    );
  }

  const tableColumns = await getTableColumns(config.table);
  const writableColumns = unique(
    config.createColumns.filter((column) =>
      tableColumns.has(column)
    )
  );

  const foreignKeyError = await validateForeignKeys(context, {
    config,
    writableColumns,
    body,
  });

  if (foreignKeyError) {
    return NextResponse.json(
      {
        error: foreignKeyError,
      },
      {
        status: 400,
      }
    );
  }

  const coupleIdFromBody = toNumber(body.couple_id);
  const patientIdFromBody = toNumber(body.patient_id);
  const derivedPatientId =
    ["cycles", "embryology", "embryos"].includes(config.key)
      ? await resolveCyclePatientId({
          coupleId: coupleIdFromBody,
          explicitPatientId: patientIdFromBody,
        })
      : patientIdFromBody;
  const treatmentPlanId = toNumber(body.treatment_plan_id);

  if (
    config.key === "cycles" &&
    treatmentPlanId &&
    !(await treatmentPlanExists(context, treatmentPlanId))
  ) {
    return NextResponse.json(
      {
        error:
          "Selected IVF treatment plan was not found for this hospital and branch. Please select a valid treatment plan or leave it blank.",
      },
      { status: 400 }
    );
  }

  if (recordId) {
    const values: unknown[] = [
      recordId,
      context.tenantId,
      context.hospitalId,
      context.branchId,
    ];
    const assignments: string[] = [];
    const updatedColumns = new Set<string>();

    for (const column of writableColumns) {
      if (updatedColumns.has(column)) {
        continue;
      }

      const normalized = normalizeIvfValue(config, column, body[column]);
      if (normalized !== null) {
        values.push(normalized);
        assignments.push(`${quoteIdent(column)} = $${values.length}`);
        updatedColumns.add(column);
      }
    }

    if (
      ["cycles", "embryology", "embryos"].includes(config.key) &&
      tableColumns.has("patient_id") &&
      derivedPatientId &&
      !updatedColumns.has("patient_id")
    ) {
      values.push(derivedPatientId);
      assignments.push(`${quoteIdent("patient_id")} = $${values.length}`);
      updatedColumns.add("patient_id");
    }

    if (!assignments.length) {
      return NextResponse.json(
        { error: "No editable IVF fields were provided." },
        { status: 400 }
      );
    }

    values.push(context.user.id ?? null);
    const updatedByIndex = values.length;
    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE ${config.table}
      SET ${assignments.join(", ")},
          updated_by = $${updatedByIndex},
          updated_at = CURRENT_TIMESTAMP
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
      return NextResponse.json({ error: "IVF record not found." }, { status: 404 });
    }

    const row = rows[0];
    const attachments = normalizeAttachments(body.attachments);
    if (attachments.length && tableColumns.has("attachments")) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE ${config.table}
        SET attachments = COALESCE(attachments, '[]'::jsonb) || $5::jsonb,
            updated_by = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
        `,
        Number(row.id),
        context.tenantId,
        context.hospitalId,
        context.branchId,
        JSON.stringify(attachments),
        context.user.id ?? null
      );
      row.attachments = [
        ...((Array.isArray(row.attachments) ? row.attachments : []) as unknown[]),
        ...attachments,
      ];
    }
    await createIvfDocuments(context, {
      config,
      row,
      attachments,
    });
    await recordClinicalAudit(context, {
      moduleName: `ivf_${config.key}`,
      action: "update",
      entityType: config.table,
      entityId: Number(row.id),
      summary: `${config.label} record updated`,
      payload: row,
    });
    await createIvfTimeline(context, {
      config,
      row,
      action: "updated",
    });

    return NextResponse.json(row);
  }

  const insertColumns = [
    "tenant_id",
    "hospital_id",
    "branch_id",
    "clinic_id",
  ];
  const insertColumnSet = new Set(insertColumns);
  const values: unknown[] = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
  ];

  if (config.uidColumn) {
    if (!insertColumnSet.has(config.uidColumn)) {
      insertColumns.push(config.uidColumn);
      insertColumnSet.add(config.uidColumn);
      values.push(
        `${config.idPrefix}-${Date.now()}`
      );
    }
  }

  for (const column of writableColumns) {
    if (insertColumnSet.has(column)) {
      continue;
    }

    const normalized = normalizeIvfValue(
      config,
      column,
      body[column]
    );

    if (normalized !== null) {
      insertColumns.push(column);
      insertColumnSet.add(column);
      values.push(normalized);
    }
  }

  if (
    ["cycles", "embryology", "embryos"].includes(config.key) &&
    tableColumns.has("patient_id") &&
    derivedPatientId &&
    !insertColumnSet.has("patient_id")
  ) {
    insertColumns.push("patient_id");
    insertColumnSet.add("patient_id");
    values.push(derivedPatientId);
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
    (_, index) => `$${index + 1}`
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
  const attachments = normalizeAttachments(body.attachments);
  if (attachments.length && tableColumns.has("attachments")) {
    await prisma.$executeRawUnsafe(
      `
      UPDATE ${config.table}
      SET attachments = $5::jsonb,
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,
      Number(row.id),
      context.tenantId,
      context.hospitalId,
      context.branchId,
      JSON.stringify(attachments),
      context.user.id ?? null
    );
    row.attachments = attachments;
  }
  await createIvfDocuments(context, {
    config,
    row,
    attachments,
  });

  await recordClinicalAudit(context, {
    moduleName: `ivf_${config.key}`,
    action: "create",
    entityType: config.table,
    entityId: Number(row.id),
    summary: `${config.label} record created`,
    payload: row,
  });

  await createIvfTimeline(context, {
    config,
    row,
    action: "created",
  });

  return NextResponse.json(row, {
    status: 201,
  });
  } catch (error) {
    console.error("IVF record save failed", {
      module: config.key,
      error,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save IVF record.",
      },
      {
        status: 500,
      }
    );
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
  const config = getIvfModuleConfig(module);

  if (!config?.statusColumn) {
    return NextResponse.json(
      {
        error:
          "This IVF module does not support status updates.",
      },
      {
        status: 400,
      }
    );
  }

  const body = await request.json();
  const id = toNumber(body.id);
  const status = normalizeIvfValue(
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
      {
        status: 400,
      }
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
      {
        error: "Record not found.",
      },
      {
        status: 404,
      }
    );
  }

  await recordClinicalAudit(context, {
    moduleName: `ivf_${config.key}`,
    action: "update",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} status updated`,
    payload: {
      status,
    },
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
  const config = getIvfModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error: "Unknown IVF module.",
      },
      {
        status: 404,
      }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const id = toNumber(searchParams?.get("id"));

  if (!id) {
    return NextResponse.json(
      {
        error: "Record id is required.",
      },
      {
        status: 400,
      }
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
    moduleName: `ivf_${config.key}`,
    action: "delete",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} record deleted`,
  });

  return NextResponse.json({
    success: true,
  });
}
