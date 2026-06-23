import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { nullableText, serialize, text, toDecimal, toNumber } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT r.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
    FROM clinical_room_master r
    LEFT JOIN patients p ON p.id = r.patient_id
    WHERE r.tenant_id = $1 AND r.hospital_id = $2 AND r.branch_id = $3
      AND COALESCE(r.is_deleted,false) = false
    ORDER BY r.room_number ASC
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  return NextResponse.json(serialize({ rows }));
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json();
  if (!text(body.room_number)) {
    return NextResponse.json({ error: "Room number is required." }, { status: 400 });
  }
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_room_master (
      tenant_id,hospital_id,branch_id,clinic_id,room_number,room_type,room_rent,status,
      patient_id,admission_id,notes,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    text(body.room_number),
    nullableText(body.room_type),
    toDecimal(body.room_rent) ?? 0,
    text(body.status) || "AVAILABLE",
    toNumber(body.patient_id),
    toNumber(body.admission_id),
    nullableText(body.notes),
    context.user.id ?? null
  );
  await recordClinicalAudit(context, {
    moduleName: "room_management",
    action: "save",
    entityType: "clinical_room_master",
    entityId: Number(rows[0].id),
    summary: "Room master/allocation saved",
    payload: rows[0],
  });
  return NextResponse.json(serialize(rows[0]), { status: 201 });
}
