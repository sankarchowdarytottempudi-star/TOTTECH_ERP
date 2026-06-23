import { prisma } from "@/lib/prisma";
import type {
  PlatformContext,
} from "@/lib/api/context";

export type FinanceReportType =
  | "daily"
  | "weekly"
  | "monthly"
  | "academic-year"
  | "pending-fee"
  | "overdue"
  | "defaulter"
  | "concession"
  | "invoice-audit"
  | "payment-audit";

export type FinanceFilters = {
  schoolId?: number | null;
  academicYearId?: number | null;
  classId?: number | null;
  sectionId?: number | null;
  from?: string | null;
  to?: string | null;
  allSchools?: boolean;
  allYears?: boolean;
};

type Row = Record<string, unknown>;

const numberValue = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const positive = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

const dateOrNull = (value: unknown) => {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text)
    ? text
    : null;
};

export function filtersFromRequest(
  request: Request,
  context: PlatformContext
): FinanceFilters {
  const url = new URL(request.url);

  return {
    schoolId:
      context.allSchools
        ? positive(url.searchParams.get("school_id"))
        : context.schoolId,
    academicYearId:
      context.allYears
        ? positive(
            url.searchParams.get(
              "academic_year_id"
            )
          )
        : context.academicYearId,
    classId: positive(
      url.searchParams.get("class_id")
    ),
    sectionId: positive(
      url.searchParams.get("section_id")
    ),
    from: dateOrNull(
      url.searchParams.get("from")
    ),
    to: dateOrNull(url.searchParams.get("to")),
    allSchools: context.allSchools,
    allYears: context.allYears,
  };
}

const invoiceFilterSql = (
  dateColumn = "i.invoice_date"
) => `
  ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
  AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
  AND ($3::int IS NULL OR i.class_id = $3::int)
  AND ($4::int IS NULL OR i.section_id = $4::int)
  AND ($5::date IS NULL OR ${dateColumn} >= $5::date)
  AND ($6::date IS NULL OR ${dateColumn} <= $6::date)
`;

const paymentFilterSql = (
  dateColumn = "p.payment_date"
) => `
  ($1::int IS NULL OR COALESCE(p.school_id, i.school_id, s.school_id) = $1::int)
  AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
  AND ($3::int IS NULL OR p.class_id = $3::int)
  AND ($4::int IS NULL OR p.section_id = $4::int)
  AND ($5::date IS NULL OR ${dateColumn} >= $5::date)
  AND ($6::date IS NULL OR ${dateColumn} <= $6::date)
`;

function params(filters: FinanceFilters) {
  return [
    filters.schoolId ?? null,
    filters.academicYearId ?? null,
    filters.classId ?? null,
    filters.sectionId ?? null,
    filters.from ?? null,
    filters.to ?? null,
  ];
}

function collectionPercent(
  collected: number,
  generated: number
) {
  return generated > 0
    ? Math.round((collected / generated) * 100)
    : 0;
}

export async function getFinanceCommandCenter(
  context: PlatformContext,
  filters: FinanceFilters
) {
  const p = params(filters);
  const [
    schoolRows,
    academicYearRows,
    kpiRows,
    concessionRows,
    expectedRows,
    monthlyRows,
    classRows,
    schoolRowsComparison,
    invoiceRows,
    paymentRows,
    pendingRows,
    defaulterRows,
  ] = await Promise.all([
    filters.schoolId
      ? prisma.$queryRawUnsafe<Row[]>(
          `SELECT id, school_name, school_code, logo_url FROM schools WHERE id = $1 LIMIT 1`,
          filters.schoolId
        )
      : Promise.resolve([]),
    filters.academicYearId
      ? prisma.$queryRawUnsafe<Row[]>(
          `SELECT id, academic_year FROM academic_years WHERE id = $1 LIMIT 1`,
          filters.academicYearId
        )
      : Promise.resolve([]),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COUNT(i.id)::int AS invoice_count,
        COALESCE(SUM(i.total_amount), 0)::numeric AS generated,
        COALESCE(SUM(i.paid_amount), 0)::numeric AS invoice_paid,
        COALESCE(SUM(i.balance_amount), 0)::numeric AS pending,
        COUNT(DISTINCT i.student_id) FILTER (WHERE COALESCE(i.balance_amount, 0) > 0 AND COALESCE(i.due_date, CURRENT_DATE) < CURRENT_DATE)::int AS defaulters,
        COUNT(*) FILTER (WHERE COALESCE(i.balance_amount, 0) > 0)::int AS pending_invoice_count
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      WHERE ${invoiceFilterSql()}
      `,
      ...p
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT COALESCE(SUM(COALESCE(approved_amount, requested_amount, 0)), 0)::numeric AS concessions
      FROM concession_requests cr
      WHERE ($1::int IS NULL OR cr.school_id = $1::int)
        AND ($2::int IS NULL OR cr.academic_year_id = $2::int OR cr.academic_year_id IS NULL)
        AND ($3::int IS NULL OR EXISTS (SELECT 1 FROM students s WHERE s.id = cr.student_id AND s.current_class_id = $3::int))
        AND ($4::int IS NULL OR EXISTS (SELECT 1 FROM students s WHERE s.id = cr.student_id AND COALESCE(s.current_section_id, s.section_id) = $4::int))
        AND ($5::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) >= $5::date)
        AND ($6::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) <= $6::date)
        AND UPPER(COALESCE(cr.status, '')) = 'APPROVED'
      `,
      ...p
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT COALESCE(SUM(fc.amount), 0)::numeric AS expected_fee_categories
      FROM fee_categories fc
      WHERE ($1::int IS NULL OR fc.school_id = $1::int OR fc.school_id IS NULL)
        AND ($2::int IS NULL OR fc.academic_year_id = $2::int OR fc.academic_year_id IS NULL)
        AND ($3::int IS NULL OR fc.class_id = $3::int OR fc.class_id IS NULL)
        AND ($4::int IS NULL OR fc.section_id = $4::int OR fc.section_id IS NULL)
        AND COALESCE(fc.is_active, true) = true
      `,
      filters.schoolId ?? null,
      filters.academicYearId ?? null,
      filters.classId ?? null,
      filters.sectionId ?? null
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      WITH months AS (
        SELECT date_trunc('month', d)::date AS month_start
        FROM generate_series(
          COALESCE($5::date, date_trunc('year', CURRENT_DATE)::date),
          COALESCE($6::date, CURRENT_DATE),
          interval '1 month'
        ) d
      ),
      invoice_month AS (
        SELECT date_trunc('month', i.invoice_date)::date AS month_start,
               COALESCE(SUM(i.total_amount), 0)::numeric AS generated,
               COALESCE(SUM(i.balance_amount), 0)::numeric AS pending
        FROM invoices i
        LEFT JOIN students s ON s.id = i.student_id
        WHERE ${invoiceFilterSql()}
        GROUP BY 1
      ),
      payment_month AS (
        SELECT date_trunc('month', p.payment_date)::date AS month_start,
               COALESCE(SUM(p.amount), 0)::numeric AS collected
        FROM payments p
        LEFT JOIN invoices i ON i.id = p.invoice_id
        LEFT JOIN students s ON s.id = p.student_id
        WHERE ${paymentFilterSql()}
        GROUP BY 1
      ),
      concession_month AS (
        SELECT date_trunc('month', COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at))::date AS month_start,
               COALESCE(SUM(COALESCE(cr.approved_amount, cr.requested_amount, 0)), 0)::numeric AS concessions
        FROM concession_requests cr
        WHERE ($1::int IS NULL OR cr.school_id = $1::int)
          AND ($2::int IS NULL OR cr.academic_year_id = $2::int OR cr.academic_year_id IS NULL)
          AND UPPER(COALESCE(cr.status, '')) = 'APPROVED'
        GROUP BY 1
      )
      SELECT
        m.month_start,
        to_char(m.month_start, 'Mon YYYY') AS month,
        COALESCE(im.generated, 0)::numeric AS generated,
        COALESCE(pm.collected, 0)::numeric AS collected,
        COALESCE(im.pending, 0)::numeric AS pending,
        COALESCE(cm.concessions, 0)::numeric AS concessions
      FROM months m
      LEFT JOIN invoice_month im ON im.month_start = m.month_start
      LEFT JOIN payment_month pm ON pm.month_start = m.month_start
      LEFT JOIN concession_month cm ON cm.month_start = m.month_start
      ORDER BY m.month_start
      `,
      ...p
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(c.class_name, 'Unassigned') AS label,
        COALESCE(SUM(i.total_amount), 0)::numeric AS generated,
        COALESCE(SUM(i.paid_amount), 0)::numeric AS collected,
        COALESCE(SUM(i.balance_amount), 0)::numeric AS pending
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      WHERE ${invoiceFilterSql()}
      GROUP BY c.class_name
      ORDER BY generated DESC
      LIMIT 20
      `,
      ...p
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(sc.school_name, 'Unassigned') AS label,
        COALESCE(SUM(i.total_amount), 0)::numeric AS generated,
        COALESCE(SUM(i.paid_amount), 0)::numeric AS collected,
        COALESCE(SUM(i.balance_amount), 0)::numeric AS pending
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN schools sc ON sc.id = COALESCE(i.school_id, s.school_id)
      WHERE ${invoiceFilterSql()}
      GROUP BY sc.school_name
      ORDER BY generated DESC
      LIMIT 20
      `,
      ...p
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        i.*,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name,
        ay.academic_year,
        sc.school_name
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      LEFT JOIN academic_years ay ON ay.id = i.academic_year_id
      LEFT JOIN schools sc ON sc.id = COALESCE(i.school_id, s.school_id)
      WHERE ${invoiceFilterSql()}
      ORDER BY i.invoice_date DESC NULLS LAST, i.id DESC
      LIMIT 500
      `,
      ...p
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        p.*,
        i.invoice_number,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name,
        ay.academic_year,
        sc.school_name
      FROM payments p
      LEFT JOIN invoices i ON i.id = p.invoice_id
      LEFT JOIN students s ON s.id = p.student_id
      LEFT JOIN classes c ON c.id = p.class_id
      LEFT JOIN sections sec ON sec.id = p.section_id
      LEFT JOIN academic_years ay ON ay.id = p.academic_year_id
      LEFT JOIN schools sc ON sc.id = COALESCE(p.school_id, i.school_id, s.school_id)
      WHERE ${paymentFilterSql()}
      ORDER BY p.payment_date DESC NULLS LAST, p.id DESC
      LIMIT 500
      `,
      ...p
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        i.*,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        COALESCE(s.phone, s.father_phone, s.mother_phone) AS mobile,
        s.admission_number,
        c.class_name,
        sec.section_name,
        sc.school_name
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      LEFT JOIN schools sc ON sc.id = COALESCE(i.school_id, s.school_id)
      WHERE ${invoiceFilterSql()}
        AND COALESCE(i.balance_amount, 0) > 0
      ORDER BY i.due_date ASC NULLS LAST, i.balance_amount DESC
      LIMIT 500
      `,
      ...p
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        i.student_id,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        COALESCE(s.phone, s.father_phone, s.mother_phone) AS mobile,
        s.admission_number,
        c.class_name,
        sec.section_name,
        COUNT(i.id)::int AS overdue_invoices,
        COALESCE(SUM(i.balance_amount), 0)::numeric AS pending_amount,
        MIN(i.due_date) AS oldest_due_date
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      WHERE ${invoiceFilterSql()}
        AND COALESCE(i.balance_amount, 0) > 0
        AND COALESCE(i.due_date, CURRENT_DATE) < CURRENT_DATE
      GROUP BY i.student_id, student_name, COALESCE(s.phone, s.father_phone, s.mother_phone), s.admission_number, c.class_name, sec.section_name
      ORDER BY pending_amount DESC
      LIMIT 500
      `,
      ...p
    ),
  ]);

  const kpis = kpiRows[0] || {};
  const generated = numberValue(kpis.generated);
  const collected = numberValue(kpis.invoice_paid);
  const paymentsCollected = paymentRows.reduce(
    (sum, row) => sum + numberValue(row.amount),
    0
  );
  const collectedAmount =
    paymentsCollected || collected;
  const pending = numberValue(kpis.pending);
  const concessions = numberValue(
    concessionRows[0]?.concessions
  );
  const expectedFeeCategories = numberValue(
    expectedRows[0]?.expected_fee_categories
  );
  const expectedRevenue =
    generated +
    Math.max(
      expectedFeeCategories - generated,
      0
    );

  const monthlyAnalytics: Row[] = monthlyRows.map(
    (row) => {
      const monthGenerated = numberValue(
        row.generated
      );
      const monthCollected = numberValue(
        row.collected
      );

      return {
        ...row,
        generated: monthGenerated,
        collected: monthCollected,
        pending: numberValue(row.pending),
        concessions: numberValue(
          row.concessions
        ),
        collection_percentage:
          collectionPercent(
            monthCollected,
            monthGenerated
          ),
      };
    }
  );

  return {
    context: {
      selectedSchool:
        schoolRows[0] || null,
      selectedAcademicYear:
        academicYearRows[0] || null,
      school_id:
        filters.schoolId ?? null,
      academic_year_id:
        filters.academicYearId ?? null,
      all_schools:
        context.allSchools &&
        !filters.schoolId,
      all_years:
        context.allYears &&
        !filters.academicYearId,
      school_scope:
        context.schoolScope,
      academic_year_scope:
        context.academicYearScope,
      filters,
    },
    kpis: {
      totalRevenue: generated,
      totalInvoices:
        numberValue(kpis.invoice_count),
      collectedAmount,
      pendingAmount: pending,
      collectionPercentage:
        collectionPercent(
          collectedAmount,
          generated
        ),
      defaulters:
        numberValue(kpis.defaulters),
      concessions,
      expectedRevenue,
      pendingInvoices:
        numberValue(
          kpis.pending_invoice_count
        ),
    },
    monthlyAnalytics,
    comparisons: {
      classRevenue:
        classRows.map(normalizeAmountRow),
      schoolRevenue:
        schoolRowsComparison.map(
          normalizeAmountRow
        ),
    },
    charts: {
      collectionTrend: monthlyAnalytics.map(
        (row) => ({
          label: row.month,
          value: row.collected,
        })
      ),
      revenueTrend: monthlyAnalytics.map(
        (row) => ({
          label: row.month,
          value: row.generated,
        })
      ),
      pendingTrend: monthlyAnalytics.map(
        (row) => ({
          label: row.month,
          value: row.pending,
        })
      ),
      collectionVsTarget:
        monthlyAnalytics.map((row) => ({
          label: row.month,
          collected: row.collected,
          target: row.generated,
        })),
    },
    invoicesData: invoiceRows,
    paymentsData: paymentRows,
    pendingFees: pendingRows,
    defaultersData: defaulterRows,
    outstandingInvoices: pendingRows,
    recentCollections:
      paymentRows.slice(0, 25),
    legacy: {
      totalFees: generated,
      totalCollected:
        collectedAmount,
      pending,
      invoices:
        numberValue(kpis.invoice_count),
      payments: paymentRows.length,
      collectionHealth:
        collectionPercent(
          collectedAmount,
          generated
        ),
      pendingInvoices:
        numberValue(
          kpis.pending_invoice_count
        ),
      chart: [
        {
          label: "Generated",
          value: generated,
        },
        {
          label: "Collected",
          value: collectedAmount,
        },
        {
          label: "Pending",
          value: pending,
        },
      ],
    },
  };
}

function normalizeAmountRow(row: Row) {
  return {
    ...row,
    generated: numberValue(row.generated),
    collected: numberValue(row.collected),
    pending: numberValue(row.pending),
    collection_percentage:
      collectionPercent(
        numberValue(row.collected),
        numberValue(row.generated)
      ),
  };
}

export async function getFinanceReport(
  reportType: FinanceReportType,
  context: PlatformContext,
  filters: FinanceFilters
) {
  const data =
    await getFinanceCommandCenter(
      context,
      filters
    );

  const monthly =
    data.monthlyAnalytics;
  const reportMap: Record<
    FinanceReportType,
    Row[]
  > = {
    daily: data.paymentsData,
    weekly: data.paymentsData,
    monthly,
    "academic-year": monthly,
    "pending-fee": data.pendingFees,
    overdue: data.pendingFees.filter(
      (row) =>
        row.due_date &&
        new Date(String(row.due_date)) <
          new Date()
    ),
    defaulter: data.defaultersData,
    concession: await getConcessionRows(filters),
    "invoice-audit": data.invoicesData,
    "payment-audit": data.paymentsData,
  };

  const rows =
    reportMap[reportType] || monthly;

  return {
    type: reportType,
    title: reportTitle(reportType),
    context: data.context,
    kpis: data.kpis,
    rows,
    totals: totalsForRows(rows),
  };
}

async function getConcessionRows(
  filters: FinanceFilters
) {
  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      cr.*,
      COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
      s.admission_number,
      i.invoice_number,
      fc.fee_name
    FROM concession_requests cr
    LEFT JOIN students s ON s.id = cr.student_id
    LEFT JOIN invoices i ON i.id = cr.invoice_id
    LEFT JOIN fee_categories fc ON fc.id = cr.fee_category_id
    WHERE ($1::int IS NULL OR cr.school_id = $1::int)
      AND ($2::int IS NULL OR cr.academic_year_id = $2::int OR cr.academic_year_id IS NULL)
      AND ($3::int IS NULL OR COALESCE(s.current_class_id, i.class_id) = $3::int)
      AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id, i.section_id) = $4::int)
      AND ($5::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) >= $5::date)
      AND ($6::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) <= $6::date)
    ORDER BY COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) DESC NULLS LAST, cr.id DESC
    LIMIT 500
    `,
    ...params(filters)
  );
}

function totalsForRows(rows: Row[]) {
  return rows.reduce<{
    generated: number;
    collected: number;
    pending: number;
    concessions: number;
  }>(
    (totals, row) => ({
      generated:
        totals.generated +
        numberValue(
          row.generated ??
            row.total_amount
        ),
      collected:
        totals.collected +
        numberValue(
          row.collected ??
            row.amount ??
            row.paid_amount
        ),
      pending:
        totals.pending +
        numberValue(
          row.pending ??
            row.balance_amount ??
            row.pending_amount
        ),
      concessions:
        totals.concessions +
        numberValue(
          row.concessions ??
            row.approved_amount
        ),
    }),
    {
      generated: 0,
      collected: 0,
      pending: 0,
      concessions: 0,
    }
  );
}

function reportTitle(
  type: FinanceReportType
) {
  const titles: Record<
    FinanceReportType,
    string
  > = {
    daily: "Daily Collection Report",
    weekly: "Weekly Collection Report",
    monthly: "Monthly Collection Report",
    "academic-year":
      "Academic Year Collection Report",
    "pending-fee": "Pending Fee Report",
    overdue: "Overdue Report",
    defaulter: "Defaulter Report",
    concession: "Concession Report",
    "invoice-audit":
      "Invoice Audit Report",
    "payment-audit":
      "Payment Audit Report",
  };

  return titles[type] || titles.monthly;
}

export function normalizeReportType(
  value: unknown
): FinanceReportType {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  const allowed: FinanceReportType[] = [
    "daily",
    "weekly",
    "monthly",
    "academic-year",
    "pending-fee",
    "overdue",
    "defaulter",
    "concession",
    "invoice-audit",
    "payment-audit",
  ];

  return allowed.includes(
    normalized as FinanceReportType
  )
    ? (normalized as FinanceReportType)
    : "monthly";
}
