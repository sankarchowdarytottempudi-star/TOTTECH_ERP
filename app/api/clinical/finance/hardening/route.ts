import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { pdfFormatters, pdfResponse, renderClinicalPdf } from "@/lib/clinical/pdf-engine";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

const reportDefinitions = {
  reconciliation: "Financial Reconciliation",
  "shift-closing": "Shift Closing",
  "daily-collections": "Daily Collections",
  "outstanding-receivables": "Outstanding Receivables",
  revenue: "Revenue Report",
} as const;

type ReportKey = keyof typeof reportDefinitions;

const isReportKey = (value: string): value is ReportKey =>
  Object.prototype.hasOwnProperty.call(reportDefinitions, value);

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const csvEscape = (value: unknown) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

async function dailyCollections(
  tenantId: number,
  hospitalId: number,
  branchId: number,
  fromDate: string,
  toDate: string
) {
  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      COALESCE(payment_mode, payment_method, 'Unspecified') AS payment_mode,
      COUNT(*)::int AS payment_count,
      COALESCE(SUM(amount),0)::numeric AS total_amount
    FROM payments
    WHERE tenant_id=$1
      AND hospital_id=$2
      AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
      AND payment_date BETWEEN $4::date AND $5::date
    GROUP BY COALESCE(payment_mode, payment_method, 'Unspecified')
    ORDER BY total_amount DESC
    `,
    tenantId,
    hospitalId,
    branchId,
    fromDate,
    toDate
  );
}

async function outstandingReceivables(
  tenantId: number,
  hospitalId: number,
  branchId: number,
  fromDate: string,
  toDate: string
) {
  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      i.id,
      i.invoice_number,
      i.invoice_date,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
      p.uhid,
      i.total,
      i.paid_amount,
      COALESCE(i.balance_amount, i.balance, 0) AS outstanding_amount,
      i.status
    FROM billing_invoices i
    LEFT JOIN patients p ON p.id=i.patient_id
    WHERE i.tenant_id=$1
      AND i.hospital_id=$2
      AND i.branch_id=$3
      AND COALESCE(i.is_deleted,false)=false
      AND i.invoice_date BETWEEN $4::date AND $5::date
      AND COALESCE(i.balance_amount, i.balance, 0) > 0
    ORDER BY i.invoice_date DESC, i.id DESC
    `,
    tenantId,
    hospitalId,
    branchId,
    fromDate,
    toDate
  );
}

async function revenueReport(
  tenantId: number,
  hospitalId: number,
  branchId: number,
  fromDate: string,
  toDate: string
) {
  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      COALESCE(source_module, invoice_type, 'General') AS revenue_stream,
      COUNT(*)::int AS invoice_count,
      COALESCE(SUM(total),0)::numeric AS gross_revenue,
      COALESCE(SUM(paid_amount),0)::numeric AS collected_revenue,
      COALESCE(SUM(balance_amount),0)::numeric AS outstanding_revenue
    FROM billing_invoices
    WHERE tenant_id=$1
      AND hospital_id=$2
      AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
      AND invoice_date BETWEEN $4::date AND $5::date
    GROUP BY COALESCE(source_module, invoice_type, 'General')
    ORDER BY gross_revenue DESC
    `,
    tenantId,
    hospitalId,
    branchId,
    fromDate,
    toDate
  );
}

async function reconciliationReport(
  tenantId: number,
  hospitalId: number,
  branchId: number,
  fromDate: string,
  toDate: string
) {
  const [collections, refunds] = await Promise.all([
    dailyCollections(tenantId, hospitalId, branchId, fromDate, toDate),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(status,'Unspecified') AS refund_status,
        COUNT(*)::int AS refund_count,
        COALESCE(SUM(COALESCE(amount, refund_amount, 0)),0)::numeric AS refund_amount
      FROM refunds
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
        AND created_at::date BETWEEN $4::date AND $5::date
      GROUP BY COALESCE(status,'Unspecified')
      ORDER BY refund_amount DESC
      `,
      tenantId,
      hospitalId,
      branchId,
      fromDate,
      toDate
    ),
  ]);
  const collectionTotal = collections.reduce(
    (sum, row) => sum + numberValue(row.total_amount),
    0
  );
  const refundTotal = refunds.reduce(
    (sum, row) => sum + numberValue(row.refund_amount),
    0
  );
  return [
    ...collections.map((row) => ({
      category: "Collection",
      mode_or_status: row.payment_mode,
      count: row.payment_count,
      amount: row.total_amount,
    })),
    ...refunds.map((row) => ({
      category: "Refund",
      mode_or_status: row.refund_status,
      count: row.refund_count,
      amount: row.refund_amount,
    })),
    {
      category: "Net",
      mode_or_status: "Collections minus refunds",
      count: "",
      amount: collectionTotal - refundTotal,
    },
  ];
}

async function shiftClosingReport(
  tenantId: number,
  hospitalId: number,
  branchId: number,
  fromDate: string,
  toDate: string
) {
  const rows = await dailyCollections(tenantId, hospitalId, branchId, fromDate, toDate);
  const total = rows.reduce((sum, row) => sum + numberValue(row.total_amount), 0);
  return [
    ...rows.map((row) => ({
      closing_item: row.payment_mode,
      transaction_count: row.payment_count,
      expected_amount: row.total_amount,
      variance: 0,
      status: "READY_FOR_CLOSING",
    })),
    {
      closing_item: "Total",
      transaction_count: rows.reduce((sum, row) => sum + numberValue(row.payment_count), 0),
      expected_amount: total,
      variance: 0,
      status: "BALANCED",
    },
  ];
}

async function loadReport(
  report: ReportKey,
  tenantId: number,
  hospitalId: number,
  branchId: number,
  fromDate: string,
  toDate: string
) {
  if (report === "daily-collections") {
    return dailyCollections(tenantId, hospitalId, branchId, fromDate, toDate);
  }
  if (report === "outstanding-receivables") {
    return outstandingReceivables(tenantId, hospitalId, branchId, fromDate, toDate);
  }
  if (report === "revenue") {
    return revenueReport(tenantId, hospitalId, branchId, fromDate, toDate);
  }
  if (report === "reconciliation") {
    return reconciliationReport(tenantId, hospitalId, branchId, fromDate, toDate);
  }
  return shiftClosingReport(tenantId, hospitalId, branchId, fromDate, toDate);
}

async function saveSnapshot(
  report: ReportKey,
  context: NonNullable<Awaited<ReturnType<typeof requireClinicalContext>>["context"]>,
  fromDate: string,
  toDate: string,
  rows: Row[]
) {
  const payload = JSON.stringify({ fromDate, toDate, rows });
  const totalAmount = rows.reduce((sum, row) => {
    return (
      sum +
      numberValue(row.total_amount) +
      numberValue(row.gross_revenue) +
      numberValue(row.outstanding_amount) +
      numberValue(row.amount) +
      numberValue(row.expected_amount)
    );
  }, 0);

  if (report === "daily-collections") {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO daily_collections (tenant_id,hospital_id,branch_id,collection_date,total_collected,total_transactions,collection_breakdown,created_by)
      VALUES ($1,$2,$3,$4::date,$5,$6,$7::jsonb,$8)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      toDate,
      totalAmount,
      rows.reduce((sum, row) => sum + numberValue(row.payment_count), 0),
      payload,
      context.user.id ?? null
    );
  } else if (report === "outstanding-receivables") {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO outstanding_receivables (tenant_id,hospital_id,branch_id,report_date,total_outstanding,invoice_count,aging_breakdown,created_by)
      VALUES ($1,$2,$3,$4::date,$5,$6,$7::jsonb,$8)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      toDate,
      totalAmount,
      rows.length,
      payload,
      context.user.id ?? null
    );
  } else if (report === "revenue") {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO revenue_report_snapshots (tenant_id,hospital_id,branch_id,report_name,period_start,period_end,gross_revenue,collected_revenue,outstanding_revenue,report_payload,created_by)
      VALUES ($1,$2,$3,$4,$5::date,$6::date,$7,$8,$9,$10::jsonb,$11)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      reportDefinitions[report],
      fromDate,
      toDate,
      rows.reduce((sum, row) => sum + numberValue(row.gross_revenue), 0),
      rows.reduce((sum, row) => sum + numberValue(row.collected_revenue), 0),
      rows.reduce((sum, row) => sum + numberValue(row.outstanding_revenue), 0),
      payload,
      context.user.id ?? null
    );
  }
}

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) {
    return auth.response;
  }
  const context = auth.context!;
  const url = new URL(request.url);
  const reportParam = url.searchParams?.get("report") || "daily-collections";
  if (!isReportKey(reportParam)) {
    return NextResponse.json({ error: "Unsupported finance report." }, { status: 400 });
  }
  const today = new Date().toISOString().slice(0, 10);
  const fromDate = url.searchParams?.get("from") || today;
  const toDate = url.searchParams?.get("to") || today;
  const rows = (await loadReport(
    reportParam,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    fromDate,
    toDate
  )) as Row[];

  await recordClinicalAudit(context, {
    moduleName: "clinical_finance_reports",
    action: "read_report",
    entityType: reportParam,
    summary: `${reportDefinitions[reportParam]} generated`,
    payload: { report: reportParam, fromDate, toDate, rowCount: rows.length },
  });

  if (url.searchParams?.get("snapshot") === "true") {
    await saveSnapshot(reportParam, context, fromDate, toDate, rows);
  }

  if (url.searchParams?.get("format") === "csv") {
    const columns = Object.keys(rows[0] || { report: reportParam });
    const csv = [
      columns.map(csvEscape).join(","),
      ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
    ].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${reportParam}-${fromDate}-${toDate}.csv"`,
      },
    });
  }

  if (url.searchParams?.get("format") === "pdf") {
    const columns = Object.keys(rows[0] || { report: reportParam }).slice(0, 6);
    const buffer = await renderClinicalPdf(context, {
      title: reportDefinitions[reportParam],
      subtitle: `${fromDate} to ${toDate}`,
      documentNumber: `${reportParam}-${fromDate}-${toDate}`,
      qrText: `finance:${reportParam}:${fromDate}:${toDate}:tenant:${context.tenantId}:hospital:${context.hospitalId}:branch:${context.branchId}`,
      signatureLabel: "Finance Authorized Signature",
      sections: [
        {
          title: "Report Records",
          table: {
            columns: columns.map((column) => ({
              key: column,
              label: column.replace(/_/g, " ").toUpperCase(),
              width: Math.floor(510 / Math.max(columns.length, 1)),
            })),
            rows,
          },
        },
      ],
    });
    return pdfResponse(buffer, `${reportParam}-${fromDate}-${toDate}.pdf`);
  }

  return NextResponse.json({
    report: reportParam,
    title: reportDefinitions[reportParam],
    scope: {
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
    },
    fromDate,
    toDate,
    rows,
  });
}
