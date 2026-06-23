import { NextResponse } from "next/server";

import { pdfFormatters, pdfResponse, renderClinicalPdf } from "@/lib/clinical/pdf-engine";
import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { id } = await params;

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT d.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name, p.patient_uid, p.uhid
    FROM document_repository d
    LEFT JOIN patients p ON p.id=d.patient_id
    WHERE d.id=$1
      AND d.tenant_id=$2
      AND d.hospital_id=$3
      AND d.branch_id=$4
      AND COALESCE(d.is_deleted,false)=false
    LIMIT 1
    `,
    Number(id),
    context.tenantId,
    context.hospitalId,
    context.branchId
  );

  if (!rows[0]) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const document = rows[0];
  const buffer = await renderClinicalPdf(context, {
    title: String(document.document_title || "Clinical Document"),
    documentNumber: String(document.id),
    patient: document,
    qrText: `document:${document.id}:tenant:${context.tenantId}:hospital:${context.hospitalId}:branch:${context.branchId}`,
    sections: [
      {
        title: "Document Details",
        rows: [
          ["Document Type", document.document_type],
          ["Source Module", document.source_module],
          ["Source Record", document.source_record_id],
          ["Version", document.version],
          ["Generated At", pdfFormatters.date(document.created_at)],
          ["File", document.file_name],
        ],
      },
    ],
  });

  return pdfResponse(buffer, String(document.file_name || `clinical-document-${id}.pdf`));
}
