import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const serialize = (value: unknown) =>
  JSON.parse(
    JSON.stringify(value, (_, item) =>
      typeof item === "bigint" ? Number(item) : item
    )
  );

const allowedTypes = new Set([
  "JPG",
  "JPEG",
  "PNG",
  "PDF",
  "DICOM",
  "MP4",
]);

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const text = (value: unknown) => String(value || "").trim();

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const patientId = toNumber(searchParams?.get("patient_id"));
  const orderId = toNumber(searchParams?.get("order_id"));

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT ru.*, ro.order_number, ro.study_type
    FROM radiology_uploads ru
    LEFT JOIN radiology_orders ro ON ro.id = ru.order_id
    WHERE ru.tenant_id = $1
      AND ru.hospital_id = $2
      AND ru.branch_id = $3
      AND COALESCE(ru.is_deleted,false) = false
      AND ($4::int IS NULL OR ru.patient_id = $4::int)
      AND ($5::int IS NULL OR ru.order_id = $5::int)
    ORDER BY ru.uploaded_at DESC NULLS LAST, ru.created_at DESC, ru.id DESC
    LIMIT 200
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    patientId,
    orderId
  );

  return NextResponse.json({ rows: serialize(rows) });
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body = await request.json();
  const patientId = toNumber(body.patient_id);
  const orderId = toNumber(body.order_id);
  const reportId = toNumber(body.report_id);
  const fileName = text(body.file_name);
  const fileUrl = text(body.file_url);
  const fileType = text(body.file_type || fileName.split(".").pop()).toUpperCase();

  if (!patientId) {
    return NextResponse.json(
      { error: "Patient id is required for radiology upload." },
      { status: 400 }
    );
  }

  if (!fileName || !fileUrl) {
    return NextResponse.json(
      { error: "File name and file URL are required." },
      { status: 400 }
    );
  }

  if (!allowedTypes.has(fileType)) {
    return NextResponse.json(
      {
        error:
          "Unsupported radiology file type. Allowed: JPG, JPEG, PNG, PDF, DICOM, MP4.",
      },
      { status: 400 }
    );
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO radiology_uploads (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      upload_number,
      order_id,
      report_id,
      patient_id,
      file_name,
      file_url,
      file_type,
      mime_type,
      file_size,
      uploaded_by,
      uploaded_at,
      metadata,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,CURRENT_TIMESTAMP,$15::jsonb,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    `RAD-UP-${Date.now()}`,
    orderId,
    reportId,
    patientId,
    fileName,
    fileUrl,
    fileType,
    text(body.mime_type) || null,
    toNumber(body.file_size),
    context.user.id ?? null,
    JSON.stringify({
      source: "radiology_upload_api",
      allowed_types: Array.from(allowedTypes),
    })
  );
  const upload = rows[0];

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
      metadata,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,'RADIOLOGY_UPLOAD','Radiology upload registered',$6,'radiology_uploads',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    patientId,
    `${fileType} radiology file ${fileName} registered.`,
    upload.id,
    JSON.stringify({
      order_id: orderId,
      report_id: reportId,
      file_url: fileUrl,
    }),
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName: "radiology",
    action: "upload_register",
    entityType: "radiology_upload",
    entityId: Number(upload.id),
    summary: "Radiology upload registered",
    payload: {
      patient_id: patientId,
      order_id: orderId,
      file_type: fileType,
    },
  });

  return NextResponse.json(serialize(upload), { status: 201 });
}
