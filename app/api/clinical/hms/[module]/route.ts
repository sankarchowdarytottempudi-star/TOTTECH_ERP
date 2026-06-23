import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import { createBillingItemForWorkflow } from "@/lib/clinical/phase4-operational-spine";
import { recordWorkflowEvent } from "@/lib/clinical/workflow";
import {
  getHmsModuleConfig,
  normalizeHmsValue,
} from "@/lib/clinical/hms-core";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

async function patientIdForHmsRow(
  context: Awaited<ReturnType<typeof requireClinicalContext>>["context"],
  config: ReturnType<typeof getHmsModuleConfig>,
  row: Row
) {
  if (!context || !config) return null;
  if (config.patientColumn && row[config.patientColumn]) {
    return toNumber(row[config.patientColumn]);
  }
  const admissionId = toNumber(row.admission_id);
  if (!admissionId) return null;
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT patient_id
    FROM ip_admissions
    WHERE id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
      AND COALESCE(is_deleted,false)=false
    LIMIT 1
    `,
    admissionId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  return toNumber(rows[0]?.patient_id);
}

const hmsBillingAmount = (moduleKey: string) => {
  if (moduleKey === "ip") return 1500;
  if (moduleKey === "bed-allocations") return 1000;
  if (moduleKey === "icu") return 2500;
  if (moduleKey === "medication-administrations") return 350;
  return 0;
};

const hmsBillingDescription = (
  config: ReturnType<typeof getHmsModuleConfig>,
  row: Row
) => {
  if (!config) return "HMS service";
  if (config.key === "ip") {
    return `IP admission ${row.admission_number || row.id}`;
  }
  if (config.key === "bed-allocations") {
    return `Bed allocation ${row.allocation_uid || row.id}`;
  }
  if (config.key === "icu") {
    return `ICU monitoring ${row.id}`;
  }
  if (config.key === "medication-administrations") {
    return `Inpatient medication ${row.medicine || row.id}`;
  }
  return `${config.label} ${row.id}`;
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
  const config = getHmsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error: "Unknown HMS module.",
      },
      {
        status: 404,
      }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const patientId = toNumber(
    searchParams?.get("patient_id")
  );
  const search = String(searchParams?.get("q") || searchParams?.get("search") || "").trim();
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

  if (patientId !== null && Boolean(config.patientColumn)) {
    filters.push(
      `AND t.${config.patientColumn} = $${paramsList.length + 1}`
    );
    paramsList.push(patientId);
  }

  if (search.length >= 2) {
    paramsList.push(`%${search.toLowerCase()}%`);
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
        FROM clinical_hms_screen_definitions
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
        SELECT report_key, report_name, output_formats
        FROM clinical_hms_report_definitions
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
        FROM clinical_hms_api_endpoint_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND api_group = $4
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
  const config = getHmsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error: "Unknown HMS module.",
      },
      {
        status: 404,
      }
    );
  }

  const body = await request.json();
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
    const normalized = normalizeHmsValue(
      config,
      column,
      body[column]
    );

    if (normalized !== null) {
      insertColumns.push(column);
      values.push(normalized);
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

  await recordClinicalAudit(context, {
    moduleName: config.key,
    action: "create",
    entityType: config.table,
    entityId: Number(row.id),
    summary: `${config.label} record created`,
    payload: row,
  });

  if (
    config.patientColumn &&
    row[config.patientColumn]
  ) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_patient_timeline (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        patient_id,
        event_type,
        event_title,
        event_summary,
        source_table,
        source_id,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      Number(row[config.patientColumn]),
      config.key.toUpperCase(),
      `${config.label} created`,
      `${config.label} workflow record created`,
      config.table,
      Number(row.id),
      context.user.id ?? null
    );
  }

  const patientId = await patientIdForHmsRow(context, config, row);
  if (patientId) {
    await recordWorkflowEvent(context, {
      patientId,
      workflowStage: config.key.toUpperCase(),
      status: String(row[config.statusColumn || "status"] || "CREATED"),
      summary: `${config.label} workflow record created.`,
      sourceTable: config.table,
      sourceId: Number(row.id),
      metadata: row,
    });

    if (config.key === "ip") {
      await createBillingItemForWorkflow(context, {
        moduleKey: "ipd",
        patientId,
        sourceRecordId: Number(row.id),
        description: hmsBillingDescription(config, row),
        amount: hmsBillingAmount(config.key),
      }).catch(() => null);

      await queueClinicalWorkflowNotification(context, {
        templateKey: "ip_admission_confirmed",
        patientId,
        sourceModule: config.table,
        sourceRecordId: Number(row.id),
        variables: {
          ward: row.ward_id || "-",
          room: row.room_id || "-",
          bed: row.bed_id || "-",
          admission_date: row.admission_date || new Date().toLocaleDateString("en-IN"),
        },
      }).catch(() => null);
    }

    if (config.key === "bed-allocations") {
      await createBillingItemForWorkflow(context, {
        moduleKey: "bed-management",
        patientId,
        sourceRecordId: Number(row.id),
        description: hmsBillingDescription(config, row),
        amount: hmsBillingAmount(config.key),
      }).catch(() => null);

      await queueClinicalWorkflowNotification(context, {
        templateKey: "bed_allocated",
        patientId,
        sourceModule: config.table,
        sourceRecordId: Number(row.id),
        variables: {
          ward: row.ward || row.ward_id || "-",
          room: row.room_id || "-",
          bed: row.bed_number || row.bed_id || "-",
          allocation_time: row.allocation_date || new Date().toLocaleString("en-IN"),
        },
      }).catch(() => null);
    }

    if (config.key === "medication-administrations") {
      await createBillingItemForWorkflow(context, {
        moduleKey: "pharmacy",
        patientId,
        sourceRecordId: Number(row.id),
        description: hmsBillingDescription(config, row),
        amount: hmsBillingAmount(config.key),
      }).catch(() => null);
    }

    if (config.key === "bed-transfers") {
      await queueClinicalWorkflowNotification(context, {
        templateKey: "patient_transferred",
        patientId,
        sourceModule: config.table,
        sourceRecordId: Number(row.id),
        variables: {
          from_location: row.current_bed_id || row.current_ward_id || row.from_room_id || "-",
          to_location: row.target_bed_id || row.target_ward_id || row.to_room_id || "-",
          reason: row.reason || row.transfer_reason || "-",
        },
      }).catch(() => null);
    }

    if (config.key === "discharges") {
      await queueClinicalWorkflowNotification(context, {
        templateKey: "discharge_completed",
        patientId,
        sourceModule: config.table,
        sourceRecordId: Number(row.id),
        variables: {
          discharge_date: row.discharge_date || new Date().toLocaleDateString("en-IN"),
          followup_date: row.follow_up || "-",
        },
      }).catch(() => null);
    }
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
  const config = getHmsModuleConfig(module);

  if (!config?.statusColumn) {
    return NextResponse.json(
      {
        error:
          "This HMS module does not support status updates.",
      },
      {
        status: 400,
      }
    );
  }

  const body = await request.json();
  const id = toNumber(body.id);
  const status = String(
    body.status || ""
  ).trim();

  if (!id || !status) {
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
    moduleName: config.key,
    action: "update",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} status updated`,
    payload: {
      status,
    },
  });

  const patientId = await patientIdForHmsRow(context, config, rows[0]);
  if (patientId) {
    await recordWorkflowEvent(context, {
      patientId,
      workflowStage: config.key.toUpperCase(),
      status,
      summary: `${config.label} status updated to ${status}.`,
      sourceTable: config.table,
      sourceId: id,
      metadata: rows[0],
    });
  }

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
  const config = getHmsModuleConfig(module);

  if (!config) {
    return NextResponse.json(
      {
        error: "Unknown HMS module.",
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
    moduleName: config.key,
    action: "delete",
    entityType: config.table,
    entityId: id,
    summary: `${config.label} record deleted`,
  });

  return NextResponse.json({
    success: true,
  });
}
