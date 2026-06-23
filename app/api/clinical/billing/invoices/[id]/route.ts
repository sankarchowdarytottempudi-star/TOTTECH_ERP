import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

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
  const invoiceId = Number(id);

  const [invoices, items, payments, refunds] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT i.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name, p.patient_uid, p.uhid
      FROM billing_invoices i
      LEFT JOIN patients p ON p.id=i.patient_id
      WHERE i.id=$1 AND i.tenant_id=$2 AND i.hospital_id=$3 AND i.branch_id=$4 AND COALESCE(i.is_deleted,false)=false
      LIMIT 1
      `,
      invoiceId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT * FROM billing_invoice_items
      WHERE invoice_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY id
      `,
      invoiceId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT * FROM payments
      WHERE invoice_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      `,
      invoiceId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT * FROM refunds
      WHERE invoice_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      `,
      invoiceId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  if (!invoices[0]) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  return NextResponse.json({
    invoice: invoices[0],
    items,
    payments,
    refunds,
  });
}
