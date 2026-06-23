import { NextResponse } from "next/server";

import {
  requireClinicalContext,
  recordClinicalAudit,
} from "@/lib/clinical/context";
import {
  clinicalNotificationDefaults,
  ensureClinicalNotificationTemplates,
} from "@/lib/clinical/notification-service";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const text = (value: unknown) => String(value ?? "").trim();

const templateVariables = (templateKey: string, body: string) => {
  const matches = Array.from(
    body.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)
  ).map((match) => match[1]);
  return Array.from(
    new Set(
      matches.length
        ? matches
        : clinicalNotificationDefaults[templateKey]?.variables || []
    )
  );
};

export async function GET() {
  const auth = await requireClinicalContext();
  if (auth.response) return auth.response;
  const context = auth.context!;

  await ensureClinicalNotificationTemplates(context);

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM clinical_notification_templates
    WHERE tenant_id=$1
      AND hospital_id=$2
      AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
    ORDER BY template_key, channel
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );

  return NextResponse.json({
    templates: rows,
    defaults: clinicalNotificationDefaults,
  });
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json();

  const templateKey = text(body.template_key);
  const channel = text(body.channel || "WHATSAPP").toUpperCase();
  const templateName =
    text(body.template_name) ||
    clinicalNotificationDefaults[templateKey]?.templateName ||
    templateKey.replace(/_/g, " ");
  const subject =
    text(body.subject) ||
    clinicalNotificationDefaults[templateKey]?.subject ||
    templateName;
  const messageBody =
    text(body.body) ||
    clinicalNotificationDefaults[templateKey]?.body ||
    "Dear {{patient_name}}, {{message}} - {{hospital_name}}";
  const status = text(body.status || "ACTIVE").toUpperCase();

  if (!templateKey) {
    return NextResponse.json(
      { error: "Template key is required." },
      { status: 400 }
    );
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_notification_templates (
      tenant_id,hospital_id,branch_id,template_key,channel,template_name,subject,body,variables,status,
      created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    ON CONFLICT (tenant_id,hospital_id,branch_id,template_key,channel)
    DO UPDATE SET
      template_name=EXCLUDED.template_name,
      subject=EXCLUDED.subject,
      body=EXCLUDED.body,
      variables=EXCLUDED.variables,
      status=EXCLUDED.status,
      updated_by=EXCLUDED.updated_by,
      updated_at=CURRENT_TIMESTAMP,
      is_deleted=false
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    templateKey,
    channel,
    templateName,
    subject,
    messageBody,
    JSON.stringify(templateVariables(templateKey, messageBody)),
    status,
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName: "clinical_notification_templates",
    action: "upsert",
    entityType: "clinical_notification_templates",
    entityId: Number(rows[0]?.id),
    summary: `Notification template ${templateKey} saved.`,
    payload: rows[0],
  });

  return NextResponse.json(rows[0], { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams?.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { error: "Valid template id is required." },
      { status: 400 }
    );
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE clinical_notification_templates
    SET is_deleted=true,
        status='DISABLED',
        updated_by=$5,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
    RETURNING *
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName: "clinical_notification_templates",
    action: "delete",
    entityType: "clinical_notification_templates",
    entityId: id,
    summary: "Notification template disabled.",
    payload: rows[0] || {},
  });

  return NextResponse.json({ success: true, template: rows[0] || null });
}
