import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import {
  queueClinicalNotification,
  retryClinicalNotification,
} from "@/lib/clinical/notification-service";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM clinical_notification_queue
    WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    ORDER BY created_at DESC
    LIMIT 250
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  return NextResponse.json({ rows });
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json();
  const row = await queueClinicalNotification(context, {
    channel: body.channel || "WHATSAPP",
    templateKey: body.template_key || "manual_message",
    recipient: String(body.recipient || ""),
    variables: body.variables || { message: body.message || "Clinical notification" },
    patientId: body.patient_id ? Number(body.patient_id) : null,
    appointmentId: body.appointment_id ? Number(body.appointment_id) : null,
    invoiceId: body.invoice_id ? Number(body.invoice_id) : null,
    sourceModule: body.source_module || "manual",
    sourceRecordId: body.source_record_id ? Number(body.source_record_id) : null,
    scheduledAt: body.scheduled_at || null,
  });
  return NextResponse.json(row, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json().catch(() => ({}));
  const ids = Array.isArray(body.ids)
    ? body.ids.map((id: unknown) => Number(id)).filter(Boolean)
    : body.id
      ? [Number(body.id)].filter(Boolean)
      : [];

  const retryIds =
    ids.length > 0
      ? ids
      : (
          await prisma.$queryRawUnsafe<Row[]>(
            `
            SELECT id
            FROM clinical_notification_queue
            WHERE tenant_id=$1
              AND hospital_id=$2
              AND branch_id=$3
              AND status='QUEUED'
              AND COALESCE(is_deleted,false)=false
            ORDER BY created_at ASC
            LIMIT 100
            `,
            context.tenantId,
            context.hospitalId,
            context.branchId
          )
        ).map((row) => Number(row.id));

  const results = [];
  for (const id of retryIds) {
    const row = await retryClinicalNotification(context, id);
    results.push({ id, row });
  }

  return NextResponse.json({
    retried: results.length,
    results,
  });
}
