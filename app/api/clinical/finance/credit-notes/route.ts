import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT cn.*, i.invoice_number, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
    FROM clinical_credit_notes cn
    LEFT JOIN billing_invoices i ON i.id=cn.invoice_id
    LEFT JOIN patients p ON p.id=cn.patient_id
    WHERE cn.tenant_id=$1 AND cn.hospital_id=$2 AND cn.branch_id=$3 AND COALESCE(cn.is_deleted,false)=false
    ORDER BY cn.created_at DESC
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
  const invoiceId = Number(body.invoice_id);
  const amount = Number(body.amount);
  if (!Number.isFinite(invoiceId) || invoiceId <= 0 || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Valid invoice and positive amount are required." }, { status: 400 });
  }
  const invoiceRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM billing_invoices
    WHERE id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
    LIMIT 1
    `,
    invoiceId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const invoice = invoiceRows[0];
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  const number = `CN-${Date.now()}`;
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_credit_notes (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,invoice_id,credit_note_number,amount,reason,status,payload,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'APPROVED',$10::jsonb,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    Number(invoice.patient_id),
    invoiceId,
    number,
    amount,
    body.reason || null,
    JSON.stringify(body),
    context.user.id ?? null
  );
  await prisma.$executeRawUnsafe(
    `
    UPDATE billing_invoices
    SET discount=COALESCE(discount,0)+$5,
        total=GREATEST(COALESCE(total,0)-$5,0),
        balance_amount=GREATEST(COALESCE(balance_amount,balance,0)-$5,0),
        balance=GREATEST(COALESCE(balance_amount,balance,0)-$5,0),
        updated_at=CURRENT_TIMESTAMP,
        updated_by=$6
    WHERE id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4
    `,
    invoiceId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    amount,
    context.user.id ?? null
  );
  await recordClinicalAudit(context, {
    moduleName: "clinical_credit_notes",
    action: "create",
    entityType: "clinical_credit_notes",
    entityId: Number(rows[0].id),
    summary: `Credit note ${number} created`,
    payload: rows[0],
  });
  return NextResponse.json(rows[0], { status: 201 });
}
