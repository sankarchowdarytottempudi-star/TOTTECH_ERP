import { NextResponse } from "next/server";

import { pdfFormatters, pdfResponse, renderClinicalPdf } from "@/lib/clinical/pdf-engine";
import { createDocumentRecord } from "@/lib/clinical/phase4-operational-spine";
import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
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
  const invoiceId = Number(id);

  const [invoiceRows, itemRows] = await Promise.all([
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
  ]);

  const invoice = invoiceRows[0];
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  await createDocumentRecord(context, {
    patientId: Number(invoice.patient_id),
    documentType: "Invoice",
    title: `Invoice ${invoice.invoice_number}`,
    sourceModule: "billing_invoices",
    sourceRecordId: invoiceId,
    fileName: `clinical-invoice-${invoice.invoice_number || invoiceId}.pdf`,
    contentType: "application/pdf",
  });

  await recordClinicalAudit(context, {
    moduleName: "billing_invoices",
    action: "print_pdf",
    entityType: "billing_invoices",
    entityId: invoiceId,
    summary: `Invoice PDF generated for ${invoice.invoice_number || invoiceId}`,
    payload: {
      invoiceId,
      fileName: `clinical-invoice-${invoice.invoice_number || invoiceId}.pdf`,
    },
  });

  const buffer = await renderClinicalPdf(context, {
    title: "Invoice",
    documentNumber: String(invoice.invoice_number || invoiceId),
    patient: invoice,
    qrText: `invoice:${invoiceId}:tenant:${context.tenantId}:hospital:${context.hospitalId}:branch:${context.branchId}`,
    signatureLabel: "Billing Authorized Signature",
    sections: [
      {
        title: "Invoice Summary",
        rows: [
          ["Invoice Number", invoice.invoice_number],
          ["Invoice Date", pdfFormatters.date(invoice.invoice_date)],
          ["Status", invoice.status],
          ["Subtotal", pdfFormatters.money(invoice.subtotal)],
          ["Discount", pdfFormatters.money(invoice.discount)],
          ["Tax", pdfFormatters.money(invoice.tax)],
          ["Total", pdfFormatters.money(invoice.total)],
          ["Paid", pdfFormatters.money(invoice.paid_amount)],
          ["Balance", pdfFormatters.money(invoice.balance_amount ?? invoice.balance)],
        ],
      },
      {
        title: "Invoice Items",
        table: {
          columns: [
            { key: "item_name", label: "Item", width: 150 },
            { key: "item_type", label: "Type", width: 82 },
            { key: "quantity", label: "Qty", width: 50 },
            { key: "rate", label: "Rate", width: 70 },
            { key: "discount", label: "Discount", width: 70 },
            { key: "tax", label: "Tax", width: 60 },
            { key: "total", label: "Total", width: 84 },
          ],
          rows: itemRows.map((item) => ({
            ...item,
            rate: pdfFormatters.money(item.rate),
            discount: pdfFormatters.money(item.discount),
            tax: pdfFormatters.money(item.tax),
            total: pdfFormatters.money(item.total ?? item.amount),
          })),
        },
      },
    ],
  });

  return pdfResponse(
    buffer,
    `clinical-invoice-${invoice.invoice_number || invoiceId}.pdf`
  );
}
