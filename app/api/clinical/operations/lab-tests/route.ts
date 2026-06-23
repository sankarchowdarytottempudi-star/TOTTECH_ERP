import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { nullableText, serialize, text, toDecimal } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const q = searchParams?.get("q")?.trim();
  const activeOnly = searchParams?.get("active") !== "false";

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM clinical_lab_test_master
    WHERE tenant_id = $1
      AND hospital_id = $2
      AND branch_id = $3
      AND COALESCE(is_deleted,false) = false
      AND ($4::text IS NULL OR lower(lab_test_name) LIKE $4 OR lower(COALESCE(category,'')) LIKE $4)
      AND ($5::boolean = false OR status = 'ACTIVE')
    ORDER BY lab_test_name ASC
    LIMIT 300
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    q ? `%${q.toLowerCase()}%` : null,
    activeOnly
  );

  return NextResponse.json(serialize({ rows }));
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json();

  if (!text(body.lab_test_name)) {
    return NextResponse.json({ error: "Lab test name is required." }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_lab_test_master (
      tenant_id,hospital_id,branch_id,clinic_id,lab_test_name,category,normal_value,unit,
      reference_range,cost,status,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    text(body.lab_test_name),
    nullableText(body.category),
    nullableText(body.normal_value),
    nullableText(body.unit),
    nullableText(body.reference_range),
    toDecimal(body.cost) ?? 0,
    text(body.status) || "ACTIVE",
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName: "lab_master",
    action: "create",
    entityType: "clinical_lab_test_master",
    entityId: Number(rows[0].id),
    summary: "Lab test master created",
    payload: rows[0],
  });

  return NextResponse.json(serialize(rows[0]), { status: 201 });
}
