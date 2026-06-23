import { NextResponse } from "next/server";

import {
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  getPhase2Module,
} from "@/lib/clinical/phase2-workflows";
import {
  deleteDomainRecord,
  listDomainRecords,
  saveDomainRecord,
} from "@/lib/clinical/phase3-domain-storage";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const text = (value: unknown) =>
  String(value || "").trim();

const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const csvEscape = (value: unknown) => {
  const raw = String(value ?? "");
  if (
    raw.includes(",") ||
    raw.includes("\"") ||
    raw.includes("\n")
  ) {
    return `"${raw.replaceAll("\"", "\"\"")}"`;
  }

  return raw;
};

async function loadLookups(
  context: NonNullable<
    Awaited<
      ReturnType<typeof requireClinicalContext>
    >["context"]
  >
) {
  const [
    patients,
    doctors,
    departments,
    medicines,
    labTests,
    rooms,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, patient_uid, uhid, first_name, last_name, phone
      FROM patients
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC
      LIMIT 300
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, full_name, specialization, department_id
      FROM doctors
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY full_name
      LIMIT 200
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, department_name, department_code
      FROM departments
      WHERE tenant_id = $1
        AND (hospital_id IS NULL OR hospital_id = $2)
        AND (branch_id IS NULL OR branch_id = $3)
        AND COALESCE(is_deleted,false) = false
      ORDER BY department_name
      LIMIT 200
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, medicine_name, generic_name, strength, stock_quantity
      FROM clinical_medicine_master
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY medicine_name
      LIMIT 300
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, COALESCE(test_name, lab_test_name) AS test_name, category, sample_type
      FROM clinical_lab_test_master
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY COALESCE(test_name, lab_test_name)
      LIMIT 300
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, room_number, room_type, status
      FROM clinical_room_master
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY room_number
      LIMIT 300
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  return {
    patients,
    doctors,
    departments,
    medicines,
    labTests,
    rooms,
  };
}

function validatePayload(
  moduleKey: string,
  body: Record<string, unknown>
) {
  const module =
    getPhase2Module(moduleKey);

  if (!module) {
    return {
      error: "Unknown operational module.",
      module: null,
    };
  }

  for (const field of module.fields) {
    if (
      field.required &&
      !text(body[field.key])
    ) {
      return {
        error: `${field.label} is required.`,
        module,
      };
    }
  }

  return {
    error: null,
    module,
  };
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
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module: moduleKey } =
    await params;
  const module =
    getPhase2Module(moduleKey);

  if (!module) {
    return NextResponse.json(
      { error: "Unknown operational module." },
      { status: 404 }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const query =
    searchParams?.get("q")?.trim() ||
    "";
  const status =
    searchParams?.get("status")?.trim() ||
    "";
  const exportType =
    searchParams?.get("export");
  const statusFilter = status
    ? status
    : null;

  const [records, lookups] =
    await Promise.all([
      listDomainRecords(
        context,
        module.key,
        query,
        statusFilter || ""
      ),
      loadLookups(context),
    ]);

  if (exportType === "csv") {
    const lines = [
      [
        "Record UID",
        "Module",
        "Title",
        "Patient",
        "Status",
        "Priority",
        "Updated At",
      ].join(","),
      ...records.map((record) =>
        [
          record.record_uid,
          module.title,
          record.title,
          record.patient_name,
          record.status,
          record.priority,
          record.updated_at,
        ]
          .map(csvEscape)
          .join(",")
      ),
    ];

    return new Response(
      lines.join("\n"),
      {
        headers: {
          "Content-Type":
            "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=\"${module.key}-records.csv\"`,
        },
      }
    );
  }

  return NextResponse.json({
    module,
    records,
    lookups,
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
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module: moduleKey } =
    await params;
  const body =
    (await request.json()) as Record<
      string,
      unknown
    >;
  const validation =
    validatePayload(moduleKey, body);

  if (validation.error) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const module = validation.module!;
  const record =
    await saveDomainRecord(
      context,
      module.key,
      body
    );

  return NextResponse.json(
    record,
    { status: 201 }
  );
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
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module: moduleKey } =
    await params;
  const module =
    getPhase2Module(moduleKey);

  if (!module) {
    return NextResponse.json(
      { error: "Unknown operational module." },
      { status: 404 }
    );
  }

  const body =
    (await request.json()) as Record<
      string,
      unknown
    >;
  const id = numberOrNull(body.id);

  if (!id) {
    return NextResponse.json(
      { error: "Record id is required." },
      { status: 400 }
    );
  }

  const merged = { ...body };
  delete merged.id;
  const record =
    await saveDomainRecord(
      context,
      module.key,
      merged,
      id
    );

  return NextResponse.json(
    record
  );
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
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { module: moduleKey } =
    await params;
  const module =
    getPhase2Module(moduleKey);

  if (!module) {
    return NextResponse.json(
      { error: "Unknown operational module." },
      { status: 404 }
    );
  }

  const { searchParams } =
    new URL(request.url);
  const id = numberOrNull(
    searchParams?.get("id")
  );

  if (!id) {
    return NextResponse.json(
      { error: "Record id is required." },
      { status: 400 }
    );
  }

  await deleteDomainRecord(
    context,
    module.key,
    id
  );

  return NextResponse.json({
    success: true,
  });
}
