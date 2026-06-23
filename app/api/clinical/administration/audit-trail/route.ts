import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const text = (value: unknown) =>
  String(value ?? "").trim();

const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const url = new URL(request.url);
  const moduleName = text(url.searchParams?.get("module"));
  const userId = numberOrNull(url.searchParams?.get("userId"));
  const patientId = numberOrNull(url.searchParams?.get("patientId"));
  const from = text(url.searchParams?.get("from"));
  const to = text(url.searchParams?.get("to"));

  const events = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      a.*,
      u.full_name AS user_name,
      p.patient_uid,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
    FROM clinical_audit_events a
    LEFT JOIN users u ON u.id=a.user_id
    LEFT JOIN patient_timeline_events e
      ON e.event_source=a.module_name
      AND e.source_record_id=a.entity_id
      AND e.tenant_id=a.tenant_id
      AND e.hospital_id=a.hospital_id
      AND e.branch_id=a.branch_id
    LEFT JOIN patients p ON p.id=e.patient_id
    WHERE a.tenant_id=$1
      AND a.hospital_id=$2
      AND a.branch_id=$3
      AND COALESCE(a.is_deleted,false)=false
      AND ($4::text = '' OR a.module_name=$4::text)
      AND ($5::int IS NULL OR a.user_id=$5::int)
      AND ($6::int IS NULL OR e.patient_id=$6::int)
      AND ($7::date IS NULL OR a.created_at::date >= $7::date)
      AND ($8::date IS NULL OR a.created_at::date <= $8::date)
    ORDER BY a.created_at DESC
    LIMIT 500
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    moduleName,
    userId,
    patientId,
    from || null,
    to || null
  );

  return NextResponse.json({
    events,
    context,
  });
}
