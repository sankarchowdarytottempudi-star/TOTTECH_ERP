import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { createDocumentRecord } from "@/lib/clinical/phase4-operational-spine";
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
  const patientId = numberOrNull(url.searchParams?.get("patientId"));
  const documentType = text(url.searchParams?.get("documentType"));

  const documents = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT d.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
    FROM document_repository d
    LEFT JOIN patients p ON p.id=d.patient_id
    WHERE d.tenant_id=$1
      AND d.hospital_id=$2
      AND d.branch_id=$3
      AND COALESCE(d.is_deleted,false)=false
      AND ($4::int IS NULL OR d.patient_id=$4::int)
      AND ($5::text = '' OR d.document_type=$5::text)
    ORDER BY d.created_at DESC
    LIMIT 300
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    patientId,
    documentType
  );

  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body = (await request.json()) as Record<string, unknown>;

  if (!text(body.documentType) || !text(body.title)) {
    return NextResponse.json(
      { error: "Document type and title are required." },
      { status: 400 }
    );
  }

  const document = await createDocumentRecord(context, {
    patientId: numberOrNull(body.patientId),
    documentType: text(body.documentType),
    title: text(body.title),
    sourceModule: text(body.sourceModule),
    sourceRecordId: numberOrNull(body.sourceRecordId),
    fileName: text(body.fileName),
    fileUrl: text(body.fileUrl),
    contentType: text(body.contentType) || "application/pdf",
  });

  return NextResponse.json(document, { status: 201 });
}
