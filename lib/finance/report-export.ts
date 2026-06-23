import * as XLSX from "xlsx";
import { renderExecutiveFinanceReportPdf, type ExecutiveTheme } from "@/lib/finance/executive-pdf";

type Row = Record<string, unknown>;

const money = (value: unknown) =>
  `Rs. ${Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

const text = (
  value: unknown,
  fallback = "-"
) => {
  const output = String(
    value ?? ""
  ).trim();
  return output || fallback;
};

const columns = [
  ["student_name", "Student"],
  ["admission_number", "Admission No"],
  ["invoice_number", "Invoice"],
  ["receipt_number", "Receipt"],
  ["class_name", "Class"],
  ["section_name", "Section"],
  ["month", "Month"],
  ["status", "Status"],
  ["payment_method", "Payment Method"],
  ["generated", "Generated"],
  ["total_amount", "Total"],
  ["collected", "Collected"],
  ["amount", "Amount"],
  ["pending", "Pending"],
  ["pending_amount", "Pending Amount"],
  ["balance_amount", "Balance"],
  ["concessions", "Concessions"],
  ["approved_amount", "Approved Concession"],
  ["payment_date", "Payment Date"],
  ["invoice_date", "Invoice Date"],
  ["due_date", "Due Date"],
] as const;

function visibleColumns(rows: Row[]) {
  const keys = new Set(
    rows.flatMap((row) =>
      Object.keys(row)
    )
  );
  const selected = columns.filter(
    ([key]) => keys.has(key)
  );
  return selected.length
    ? selected
    : columns.slice(0, 8);
}

export async function renderFinanceReportPdf(
  report: {
    type?: string;
    title: string;
    rows: Row[];
    totals: Row;
    context?: {
      selectedSchool?: Row | null;
      selectedAcademicYear?: Row | null;
      all_schools?: boolean;
      all_years?: boolean;
      filters?: Row;
    };
    kpis?: Record<string, unknown>;
    monthlyAnalytics?: Row[];
    comparisons?: {
      classRevenue?: Row[];
      schoolRevenue?: Row[];
    };
    charts?: {
      collectionTrend?: Row[];
      revenueTrend?: Row[];
      pendingTrend?: Row[];
      collectionVsTarget?: Row[];
    };
  },
  theme: ExecutiveTheme = "color"
) {
  const rows = report.rows || [];
  const comparisonRows = [
    ...(report.comparisons?.classRevenue || []).map((row) => ({
      label: text(row.class_name || row.label || row.name || row.school_name),
      value: Number(row.generated || row.collected || row.amount || row.total_amount || 0),
      meta: text(row.section_name || row.academic_year || row.month || row.status),
    })),
    ...(report.comparisons?.schoolRevenue || []).map((row) => ({
      label: text(row.school_name || row.label || row.name),
      value: Number(row.generated || row.collected || row.amount || row.total_amount || 0),
      meta: text(row.section_name || row.academic_year || row.month || row.status),
    })),
  ];

  const topPerformers = comparisonRows.length
    ? comparisonRows.slice().sort((a, b) => b.value - a.value)
    : rows.map((row) => ({
        label: text(row.class_name || row.student_name || row.invoice_number || row.label),
        value: Number(row.generated || row.collected || row.amount || row.total_amount || row.pending_amount || row.balance_amount || 0),
        meta: text(row.section_name || row.payment_method || row.status || row.month),
      }));

  const bottomPerformers = comparisonRows.length
    ? comparisonRows.slice().sort((a, b) => a.value - b.value)
    : rows.map((row) => ({
        label: text(row.class_name || row.student_name || row.invoice_number || row.label),
        value: Number(row.pending_amount || row.balance_amount || row.pending || row.amount || row.total_amount || 0),
        meta: text(row.section_name || row.payment_method || row.status || row.month),
      }));

  return renderExecutiveFinanceReportPdf({
    type: report.type || "finance",
    title: report.title,
    context: report.context,
    kpis: report.kpis || {
      totalRevenue: report.totals.generated ?? 0,
      totalInvoices: report.totals.invoice_count ?? rows.length,
      collectedAmount: report.totals.collected ?? 0,
      pendingAmount: report.totals.pending ?? 0,
      collectionPercentage: report.totals.collection_percentage ?? 0,
      defaulters: report.totals.defaulters ?? 0,
      concessions: report.totals.concessions ?? 0,
      expectedRevenue: report.totals.expected_revenue ?? 0,
    },
    rows: rows.length
      ? rows
      : [
          {
            label: "No records",
            month: "No Data",
            generated: 0,
            collected: 0,
            pending: 0,
            amount: 0,
            balance_amount: 0,
        },
      ],
    totals: report.totals,
    theme,
    topPerformers,
    bottomPerformers,
    trendSeries: (report.charts?.revenueTrend?.length
      ? report.charts.revenueTrend
      : report.charts?.collectionTrend || []).map((row: any) => ({
        label: text(row.label),
        value: Number(row.value ?? row.collected ?? row.target ?? 0),
        color: typeof row.color === "string" ? row.color : undefined,
      })),
    pieSeries: (report.charts?.collectionVsTarget?.length
      ? report.charts.collectionVsTarget.map((row: any) => ({
          label: text(row.label),
          value: Number(row.collected ?? row.target ?? row.value ?? 0),
        }))
      : rows.map((row) => ({
          label: text(row.label || row.category_name || row.class_name || row.section_name),
          value: Number(row.generated ?? row.collected ?? row.amount ?? row.total_amount ?? 0),
        }))).map((row: any) => ({
        label: text(row.label),
        value: Number(row.value ?? 0),
        color: typeof row.color === "string" ? row.color : undefined,
      })),
    aiInsights: [
      `Executive finance dashboard generated from live school/college data.`,
      `Use the charts to compare collection health, outstanding balances, and school/college performance.`,
    ],
    aiForecasting: [
      `Forecasting highlights collection risk and low-performing classes or schools/colleges.`,
      `Expense outlook should be reviewed alongside revenue trend and pending exposure.`,
    ],
  });
}

export function renderFinanceReportXlsx(report: {
  title: string;
  rows: Row[];
  totals: Row;
}) {
  const workbook =
    XLSX.utils.book_new();
  const rows = report.rows || [];
  const jsonRows = rows.map((row) => {
    const output: Record<string, unknown> = {};
    for (const [key, label] of visibleColumns(
      rows
    )) {
      output[label] = row[key] ?? "";
    }
    return output;
  });
  const sheet =
    XLSX.utils.json_to_sheet(jsonRows);
  XLSX.utils.book_append_sheet(
    workbook,
    sheet,
    report.title.slice(0, 31)
  );
  const totalsSheet =
    XLSX.utils.json_to_sheet([
      report.totals,
    ]);
  XLSX.utils.book_append_sheet(
    workbook,
    totalsSheet,
    "Totals"
  );
  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  }) as Buffer;
}
