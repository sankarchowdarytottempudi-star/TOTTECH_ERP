import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import {
  createPatientTimelineEvent,
  recalculateInvoice,
} from "@/lib/clinical/phase4-operational-spine";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type BillingSummary = {
  total: number;
  paid: number;
  balance: number;
  pendingCount: number;
  paidCount: number;
  partialCount: number;
  cancelledCount: number;
  refundedCount: number;
};

const text = (value: unknown) =>
  String(value ?? "").trim();

const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const url = new URL(request.url);
  const patientId = numberOrNull(url.searchParams?.get("patientId"));
  const status = text(url.searchParams?.get("status"));
  const sourceModule = text(url.searchParams?.get("sourceModule"));
  const q = text(url.searchParams?.get("q")).toLowerCase();
  const search = q ? `%${q}%` : null;

  const invoices = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      i.*,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
      p.patient_uid,
      p.uhid,
      COUNT(ii.id)::int AS item_count
    FROM billing_invoices i
    LEFT JOIN patients p ON p.id=i.patient_id
    LEFT JOIN billing_invoice_items ii ON ii.invoice_id=i.id AND COALESCE(ii.is_deleted,false)=false
    WHERE i.tenant_id=$1
      AND i.hospital_id=$2
      AND i.branch_id=$3
      AND COALESCE(i.is_deleted,false)=false
      AND ($4::int IS NULL OR i.patient_id=$4::int)
      AND ($5::text = '' OR i.status=$5::text)
      AND ($7::text = '' OR i.source_module=$7::text OR i.invoice_type=$7::text)
      AND (
        $6::text IS NULL
        OR lower(i.invoice_number) LIKE $6::text
        OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $6::text
        OR lower(COALESCE(p.patient_uid,'')) LIKE $6::text
      )
    GROUP BY i.id,p.id
    ORDER BY i.created_at DESC
    LIMIT 300
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    patientId,
    status,
    search,
    sourceModule
  );

  const summary = invoices.reduce(
    (acc: BillingSummary, invoice) => {
      const invoiceStatus = text(invoice.status).toUpperCase();
      const total = Number(invoice.total || 0);
      const paid = Number(invoice.paid_amount || 0);
      const balance = Number(invoice.balance_amount ?? invoice.balance ?? 0);
      acc.total += total;
      acc.paid += paid;
      acc.balance += balance;
      if (invoiceStatus === "PAID") acc.paidCount += 1;
      else if (invoiceStatus === "PARTIAL") acc.partialCount += 1;
      else if (invoiceStatus === "CANCELLED") acc.cancelledCount += 1;
      else if (invoiceStatus === "REFUNDED") acc.refundedCount += 1;
      else acc.pendingCount += 1;
      return acc;
    },
    {
      total: 0,
      paid: 0,
      balance: 0,
      pendingCount: 0,
      paidCount: 0,
      partialCount: 0,
      cancelledCount: 0,
      refundedCount: 0,
    }
  );

  return NextResponse.json({ invoices, summary });
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body = (await request.json()) as Record<string, unknown>;
  const action = text(body.action) || "invoice";
  const invoiceId = numberOrNull(body.invoiceId);
  const patientId = numberOrNull(body.patientId);

  if (action === "payment") {
    if (!invoiceId || !patientId || !Number(body.amount)) {
      return NextResponse.json(
        { error: "Invoice, patient, and amount are required." },
        { status: 400 }
      );
    }

    const invoiceRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM billing_invoices
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      LIMIT 1
      `,
      invoiceId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );
    const invoice = invoiceRows[0];

    if (!invoice) {
      return NextResponse.json(
        {
          error: "Invoice not found for the selected context.",
        },
        { status: 404 }
      );
    }

    const invoiceTotal = Number(invoice.total_amount || 0);
    const invoicePaid = Number(invoice.paid_amount || 0);
    const invoiceBalance = Math.max(invoiceTotal - invoicePaid, 0);

    if (invoiceTotal <= 0) {
      return NextResponse.json(
        {
          error:
            "This invoice has no billable amount. Generate billable line items before collecting payment.",
        },
        { status: 400 }
      );
    }

    if (Number(body.amount) > invoiceBalance) {
      return NextResponse.json(
        {
          error:
            "Payment amount cannot be greater than the invoice balance.",
        },
        { status: 400 }
      );
    }

    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO payments (
        tenant_id,hospital_id,branch_id,clinic_id,
        invoice_id,patient_id,payment_number,payment_mode,
        payment_method,amount,payment_date,reference_number,
        remarks,received_by,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::varchar,$8::varchar,$9,CURRENT_DATE,$10,$11,$12,$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      invoiceId,
      patientId,
      uid("PAY"),
      text(body.paymentMode) || "Cash",
      Number(body.amount),
      text(body.referenceNumber),
      text(body.remarks),
      context.user.id ?? null
    );
    await recalculateInvoice(invoiceId);
    const refreshedInvoiceRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM billing_invoices
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      LIMIT 1
      `,
      invoiceId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );
    const refreshedInvoice = refreshedInvoiceRows[0];
    const invoiceStatus = text(refreshedInvoice?.status).toUpperCase();
    if (invoiceStatus === "PAID" || invoiceStatus === "PARTIAL") {
      await prisma.$executeRawUnsafe(
        `
        UPDATE lab_orders lo
        SET status = CASE
              WHEN $5::varchar = 'PAID' THEN 'BILL_PAID'
              ELSE lo.status
            END,
            updated_by = $6,
            updated_at = CURRENT_TIMESTAMP
        FROM billing_invoice_items ii
        WHERE ii.invoice_id = $1
          AND ii.item_type = 'LAB'
          AND ii.item_reference_id = lo.id
          AND lo.tenant_id = $2
          AND lo.hospital_id = $3
          AND lo.branch_id = $4
          AND COALESCE(ii.is_deleted,false) = false
          AND COALESCE(lo.is_deleted,false) = false
          AND lo.status IN ('DOCTOR_PRESCRIBED','ORDERED','BILL_GENERATED','PENDING_PAYMENT')
        `,
        invoiceId,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        invoiceStatus,
        context.user.id ?? null
      );
    }
    if (invoiceStatus === "PAID") {
      await prisma.$executeRawUnsafe(
        `
        UPDATE appointments
        SET status = 'COMPLETED',
            queue_status = 'COMPLETED',
            updated_by = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE patient_id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
          AND COALESCE(is_deleted,false) = false
          AND status IN ('CONSULTATION_COMPLETED','AWAITING_BILLING','AWAITING_PAYMENT','LAB_COMPLETED')
        `,
        patientId,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        context.user.id ?? null
      );
    }
    await createPatientTimelineEvent(context, {
      patientId,
      eventType: "Payments",
      eventSource: "payments",
      sourceRecordId: Number(rows[0].id),
      title: `Payment received: ${body.amount}`,
      description: `${body.paymentMode || "Cash"} payment posted for invoice ${invoiceId}.`,
    });
    await queueClinicalWorkflowNotification(context, {
      templateKey: "payment_received",
      patientId,
      invoiceId,
      sourceModule: "payments",
      sourceRecordId: Number(rows[0].id),
      variables: {
        amount: Number(body.amount),
        payment_mode: body.paymentMode || "Cash",
        receipt_number: rows[0].payment_number || rows[0].receipt_number || rows[0].id,
      },
    });
    return NextResponse.json(rows[0], { status: 201 });
  }

  if (action === "refund") {
    if (!invoiceId || !patientId || !Number(body.amount)) {
      return NextResponse.json(
        { error: "Invoice, patient, and refund amount are required." },
        { status: 400 }
      );
    }

    const refundSummaryRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE((
          SELECT SUM(amount)
          FROM payments p
          WHERE p.invoice_id = $1
            AND p.tenant_id = $2
            AND p.hospital_id = $3
            AND p.branch_id = $4
            AND COALESCE(p.is_deleted,false)=false
        ),0)::numeric AS paid_amount,
        COALESCE((
          SELECT SUM(COALESCE(r.amount, r.refund_amount, 0))
          FROM refunds r
          WHERE r.invoice_id = $1
            AND r.tenant_id = $2
            AND r.hospital_id = $3
            AND r.branch_id = $4
            AND COALESCE(r.is_deleted,false)=false
            AND UPPER(COALESCE(r.status,'')) IN ('APPROVED','PROCESSED','COMPLETED','REFUNDED')
        ),0)::numeric AS refunded_amount
      `,
      invoiceId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );
    const refundableAmount = Math.max(
      Number(refundSummaryRows[0]?.paid_amount || 0) -
        Number(refundSummaryRows[0]?.refunded_amount || 0),
      0
    );
    if (Number(body.amount) > refundableAmount) {
      return NextResponse.json(
        {
          error:
            "Refund amount cannot be greater than the refundable payment balance.",
        },
        { status: 400 }
      );
    }

    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO refunds (
        tenant_id,hospital_id,branch_id,clinic_id,
        invoice_id,patient_id,refund_number,amount,refund_amount,
        reason,status,requested_by,approved_by,approved_at,processed_at,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$9,'APPROVED',$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      invoiceId,
      patientId,
      uid("REF"),
      Number(body.amount),
      text(body.reason),
      context.user.id ?? null
    );
    await recalculateInvoice(invoiceId);
    await createPatientTimelineEvent(context, {
      patientId,
      eventType: "Refunds",
      eventSource: "refunds",
      sourceRecordId: Number(rows[0].id),
      title: `Refund processed: ${body.amount}`,
      description: text(body.reason),
    });
    return NextResponse.json(rows[0], { status: 201 });
  }

  if (!patientId) {
    return NextResponse.json(
      { error: "Patient is required." },
      { status: 400 }
    );
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO billing_invoices (
      tenant_id,hospital_id,branch_id,clinic_id,
      invoice_number,patient_id,visit_id,invoice_date,status,
      subtotal,discount,tax,total,paid_amount,balance_amount,balance,
      invoice_type,source_module,source_record_id,
      created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE,'OPEN',0,0,0,0,0,0,0,'PATIENT',$8,$9,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    uid("INV"),
    patientId,
    numberOrNull(body.visitId),
    text(body.sourceModule),
    numberOrNull(body.sourceRecordId),
    context.user.id ?? null
  );
  await createPatientTimelineEvent(context, {
    patientId,
    eventType: "Billing Events",
    eventSource: "billing_invoices",
    sourceRecordId: Number(rows[0].id),
    title: `Invoice created: ${rows[0].invoice_number}`,
    description: "Manual billing invoice created.",
  });

  await queueClinicalWorkflowNotification(context, {
    templateKey: "bill_generated",
    patientId,
    invoiceId: Number(rows[0].id),
    sourceModule: "billing_invoices",
    sourceRecordId: Number(rows[0].id),
    variables: {
      invoice_number: rows[0].invoice_number || rows[0].id,
      amount: rows[0].total || 0,
      department: text(body.sourceModule) || "Billing",
    },
  });

  return NextResponse.json(rows[0], { status: 201 });
}
