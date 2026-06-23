import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams?.get("token");
  const documentId = Number(url.searchParams?.get("document_id"));
  if (!token && !Number.isFinite(documentId)) {
    return NextResponse.json({ error: "token or document_id is required." }, { status: 400 });
  }
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT d.id, d.document_type, d.document_title, d.source_module, d.source_record_id, d.created_at,
           h.hospital_name, b.branch_name,
           v.verification_status, v.verification_token
    FROM document_repository d
    LEFT JOIN hospitals h ON h.id=d.hospital_id
    LEFT JOIN branches b ON b.id=d.branch_id
    LEFT JOIN clinical_document_verifications v ON v.document_id=d.id AND COALESCE(v.is_deleted,false)=false
    WHERE COALESCE(d.is_deleted,false)=false
      AND (($1::text IS NOT NULL AND v.verification_token=$1) OR ($2::int IS NOT NULL AND d.id=$2))
    LIMIT 1
    `,
    token,
    Number.isFinite(documentId) ? documentId : null
  );
  if (!rows[0]) {
    return NextResponse.json({ status: "INVALID", error: "Document verification failed." }, { status: 404 });
  }
  await prisma.$executeRawUnsafe(
    `
    UPDATE clinical_document_verifications
    SET verified_at=CURRENT_TIMESTAMP,
        ip_address=$2,
        updated_at=CURRENT_TIMESTAMP
    WHERE verification_token=$1
    `,
    rows[0].verification_token || token,
    request.headers.get("x-forwarded-for") || null
  ).catch(() => {});
  return NextResponse.json({ status: "VALID", document: rows[0] });
}
