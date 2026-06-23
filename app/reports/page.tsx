"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Layout from "@/components/Layout";
import CommandCenterHero from "@/components/ui/CommandCenterHero";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";

type ReportExport = {
  id: number;
  school_id?: number | null;
  report_key?: string | null;
  format?: string | null;
  status?: string | null;
  file_url?: string | null;
  filter_json?: Record<string, unknown> | null;
  created_at?: string | null;
};

type Metric = {
  label: string;
  value: number;
  currency?: boolean;
};

type ReportDefinition = {
  key: string;
  title: string;
  category?: string;
  detail?: string;
  metrics?: Metric[];
  chart?: {
    label: string;
    value: number;
  }[];
  details?: Record<string, unknown>[];
};

type ReportsPayload = {
  exports?: ReportExport[];
  summary?: {
    students?: number;
    teachers?: number;
    classes?: number;
    sections?: number;
    attendance?: number;
    invoices?: number;
    totalFees?: number;
    collectedFees?: number;
    pendingFees?: number;
    events?: number;
    diningAttendance?: number;
    collectionHealth?: number;
  };
  reports?: ReportDefinition[];
};

const reportCatalog = [
  {
    key: "principal-daily-command",
    title: "Principal Daily Command",
    category: "Executive",
    detail:
      "School/College health, students, teachers, attendance, fees and action summary.",
  },
  {
    key: "attendance-risk-summary",
    title: "Attendance Risk Summary",
    category: "Attendance",
    detail:
      "Student/staff attendance evidence and follow-up readiness.",
  },
  {
    key: "finance-collection-summary",
    title: "Finance Collection Summary",
    category: "Finance",
    detail:
      "Fee exposure, collections, pending amount and invoice readiness.",
  },
  {
    key: "academic-performance-summary",
    title: "Academic Performance Summary",
    category: "Academics",
    detail:
      "Marks entries, exam readiness, class/section and subject coverage.",
  },
  {
    key: "operations-audit-summary",
    title: "Operations Audit Summary",
    category: "Operations",
    detail:
      "Event ledger, data integrity, approvals and operational history.",
  },
  {
    key: "student-360-summary",
    title: "Student 360 Summary",
    category: "360",
    detail:
      "Student attendance, academics, finance, dining, transport and hostel signals.",
  },
] as const;

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

function formatMetric(metric: Metric) {
  return metric.currency
    ? `Rs. ${Number(
        metric.value || 0
      ).toLocaleString()}`
    : Number(
        metric.value || 0
      ).toLocaleString();
}

function readableKey(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function recordTitle(
  row: Record<string, unknown>
) {
  return String(
    row.student_name ||
      row.teacher_name ||
      row.invoice_number ||
      row.receipt_number ||
      row.fee_name ||
      row.record_type ||
      row.event_type ||
      row.module_name ||
      row.id ||
      "Record"
  );
}

function recordMeta(
  row: Record<string, unknown>
) {
  return [
    row.admission_number,
    row.employee_id,
    row.class_name,
    row.section_name,
    row.status,
    row.payment_method,
    row.module_name,
  ]
    .filter(Boolean)
    .join(" • ");
}

function recordHref(
  row: Record<string, unknown>
) {
  const id = Number(row.id || 0);
  const recordType = String(
    row.record_type || ""
  ).toLowerCase();

  if (row.invoice_number) {
    return "/finance/invoices";
  }

  if (row.receipt_number) {
    return "/finance/payments";
  }

  if (row.fee_name) {
    return "/finance/fees";
  }

  if (row.event_type) {
    return "/operations/audit-center";
  }

  if (row.meal_type) {
    return "/dining";
  }

  if (row.attendance_date) {
    return "/attendance/calendar";
  }

  if (recordType.includes("exam")) {
    return "/academics/exam-schedule";
  }

  if (recordType.includes("question")) {
    return "/academics/question-papers";
  }

  if (recordType.includes("marks")) {
    return "/academics/marks-entry";
  }

  if (recordType.includes("homework")) {
    return "/academics/homework";
  }

  if (row.teacher_name && id) {
    return `/teachers/${id}`;
  }

  if (row.student_name && id) {
    return `/students/${id}`;
  }

  return "";
}

export default function ReportsPage() {
  const [payload, setPayload] =
    useState<ReportsPayload | null>(
      null
    );
  const [loading, setLoading] =
    useState(true);
  const [creating, setCreating] =
    useState<string | null>(null);
  const [selectedKey, setSelectedKey] =
    useState(
      "principal-daily-command"
    );
  const [selectedExport, setSelectedExport] =
    useState<ReportExport | null>(
      null
    );
  const [message, setMessage] =
    useState("");
  const [error, setError] =
    useState("");
  const detailsRef =
    useRef<HTMLElement | null>(null);

  const loadReports = async () => {
    try {
      setError("");
      const data =
        await apiJson<ReportsPayload>(
          "/api/reports"
        );
      setPayload(data);
    } catch (requestError) {
      setError(
        errorMessage(
          requestError,
          "Failed to load reports"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(
      loadReports
    );
  }, []);

  const reports = useMemo(() => {
    const serverReports = new Map(
      (payload?.reports || []).map(
        (report) => [
          report.key,
          report,
        ]
      )
    );

    return reportCatalog.map(
      (catalog) => ({
        ...catalog,
        ...(serverReports.get(
          catalog.key
        ) || {}),
      })
    );
  }, [payload?.reports]);

  const selectedReport =
    reports.find(
      (report) =>
        report.key === selectedKey
    ) || reports[0];

  const openReportDetails = (
    reportKey?: string | null,
    exportRecord?: ReportExport | null
  ) => {
    const nextKey =
      reportKey ||
      selectedReport?.key ||
      reports[0]?.key;

    if (!nextKey) {
      return;
    }

    setSelectedKey(nextKey);
    setSelectedExport(
      exportRecord || null
    );
    window.setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      detailsRef.current?.focus();
    }, 40);
  };

  const exportsByKey = useMemo(() => {
    const map = new Map<
      string,
      ReportExport
    >();

    for (const item of payload?.exports ||
      []) {
      if (
        item.report_key &&
        !map.has(item.report_key)
      ) {
        map.set(
          item.report_key,
          item
        );
      }
    }

    return map;
  }, [payload?.exports]);

  const createReport = async (
    reportKey: string
  ) => {
    try {
      setCreating(reportKey);
      setMessage("");
      setError("");
      await apiJson("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          report_key: reportKey,
          format: "json",
          filters: {
            generated_from:
              "reports_center",
            generated_at:
              new Date().toISOString(),
          },
        }),
      });
      setSelectedKey(reportKey);
      setMessage(
        "Report generated and added to the report history."
      );
      await loadReports();
    } catch (requestError) {
      setError(
        errorMessage(
          requestError,
          "Failed to generate report"
        )
      );
    } finally {
      setCreating(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <CommandCenterHero
          label="Executive Evidence Center"
          title="Reports Center"
          subtitle="All generated reports remain accessible here and each report is backed by live ERP records, not sample data."
          className="tt-dark-hero"
        >
          <a
            href="/principal-analytics"
            className="rounded-lg border border-[#D4AF37]/50 bg-white/10 px-4 py-3 text-center text-sm font-black text-white"
          >
            Open Principal Analytics
          </a>
        </CommandCenterHero>

        {message ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-black text-red-800">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Generated Reports"
            value={
              payload?.exports?.length || 0
            }
            detail="Persistent export records"
          />
          <SummaryCard
            label="Students"
            value={
              payload?.summary?.students ||
              0
            }
            detail="Live student records"
          />
          <SummaryCard
            label="Teachers"
            value={
              payload?.summary?.teachers ||
              0
            }
            detail="Live teacher records"
          />
          <SummaryCard
            label="Finance Health"
            value={
              payload?.summary
                ?.collectionHealth || 0
            }
            detail="Collection percentage"
            suffix="%"
          />
        </div>

        <section className="tt-card tt-card-pad">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Reports
              </h2>
              <p className="text-sm font-semibold text-slate-600">
                Report cards now show live KPIs and open the underlying ERP records through View Details.
              </p>
            </div>
            <button
              onClick={loadReports}
              className="tt-button-secondary"
            >
              Refresh Reports
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => {
              const lastExport =
                exportsByKey.get(
                  report.key
                );

              return (
                <article
                  key={report.key}
                  className={`rounded-lg border p-5 shadow-sm transition ${
                    selectedKey ===
                    report.key
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase text-amber-700">
                        {report.category}
                      </p>
                      <h3 className="mt-1 break-words text-lg font-black">
                        {report.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-amber-100">
                      {lastExport
                        ? "Ready"
                        : "Live"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                    {report.detail}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {(report.metrics || [])
                      .slice(0, 4)
                      .map((metric) => (
                        <div
                          key={
                            metric.label
                          }
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <p className="text-[11px] font-black uppercase text-slate-500">
                            {metric.label}
                          </p>
                          <p className="mt-1 truncate text-lg font-black">
                            {formatMetric(
                              metric
                            )}
                          </p>
                        </div>
                      ))}
                  </div>

                  <MiniBars
                    data={
                      report.chart || []
                    }
                  />

                  <div className="mt-4 rounded-lg bg-white/80 p-3 text-sm">
                    <p className="font-black text-slate-700">
                      Last generated
                    </p>
                    <p className="mt-1 font-semibold text-slate-600">
                      {formatDate(
                        lastExport?.created_at
                      )}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      onClick={() =>
                        openReportDetails(
                          report.key,
                          lastExport
                        )
                      }
                      className="tt-button-secondary"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        createReport(
                          report.key
                        )
                      }
                      disabled={
                        creating ===
                        report.key
                      }
                      className="tt-button"
                    >
                      {creating ===
                      report.key
                        ? "Generating..."
                        : "Generate"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {selectedReport ? (
          <ReportDetails
            ref={detailsRef}
            report={selectedReport}
            exportRecord={
              selectedExport ||
              exportsByKey.get(
                selectedReport.key
              ) ||
              null
            }
          />
        ) : null}

        <section className="tt-card tt-card-pad">
          <h2 className="text-xl font-black">
            Report History
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Generated reports stay accessible for users and can be reopened through their report key.
          </p>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden bg-slate-100 px-4 py-3 text-xs font-black uppercase text-slate-600 md:grid md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr_0.8fr]">
              <span>Report</span>
              <span>Status</span>
              <span>Format</span>
              <span>Created</span>
              <span>Action</span>
            </div>
            {(payload?.exports || []).length ? (
              (payload?.exports || [])
                .slice(0, 50)
                .map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 border-t border-slate-200 px-4 py-3 text-sm md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr_0.8fr] md:items-center"
                  >
                    <span className="break-words font-black">
                      {item.report_key ||
                        `Report ${item.id}`}
                    </span>
                    <span className="font-semibold">
                      {item.status ||
                        "READY"}
                    </span>
                    <span className="font-semibold">
                      {item.format ||
                        "json"}
                    </span>
                    <span className="break-words font-semibold text-slate-600">
                      {formatDate(
                        item.created_at
                      )}
                    </span>
                    <button
                      className="tt-button-secondary min-h-[36px] px-3 py-2 text-xs"
                      onClick={() =>
                        openReportDetails(
                          item.report_key,
                          item
                        )
                      }
                    >
                      View Details
                    </button>
                  </div>
                ))
            ) : (
              <div className="border-t border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                {loading
                  ? "Loading report history..."
                  : "No report history yet. Generate a report above to create the first export record."}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  suffix = "",
}: {
  label: string;
  value: number;
  detail: string;
  suffix?: string;
}) {
  return (
    <div className="tt-card tt-card-pad">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">
        {Number(value || 0).toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        {detail}
      </p>
    </div>
  );
}

function MiniBars({
  data,
}: {
  data: {
    label: string;
    value: number;
  }[];
}) {
  const max = Math.max(
    1,
    ...data.map((item) =>
      Number(item.value || 0)
    )
  );

  if (!data.length) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {data.slice(0, 4).map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[110px_1fr_64px] items-center gap-2 text-xs"
        >
          <span className="truncate font-bold text-slate-600">
            {item.label}
          </span>
          <span className="h-2 overflow-hidden rounded-full bg-slate-100">
            <span
              className="block h-full rounded-full bg-amber-600"
              style={{
                width: `${Math.max(
                  6,
                  (Number(
                    item.value || 0
                  ) /
                    max) *
                    100
                )}%`,
              }}
            />
          </span>
          <span className="truncate text-right font-black text-slate-950">
            {Number(
              item.value || 0
            ).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

const ReportDetails = forwardRef<
  HTMLElement,
  {
  report: ReportDefinition;
  exportRecord?: ReportExport | null;
}
>(function ReportDetails(
  {
    report,
    exportRecord,
  },
  ref
) {
  const rows = report.details || [];
  const visibleKeys = Array.from(
    new Set(
      rows.flatMap((row) =>
        Object.keys(row)
      )
    )
  )
    .filter(
      (key) =>
        ![
          "metadata",
          "payload",
          "filter_json",
        ].includes(key)
    )
    .slice(0, 8);

  return (
    <section
      ref={ref}
      tabIndex={-1}
      className="tt-card tt-card-pad scroll-mt-24 outline-none"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-amber-700">
            View Details
          </p>
          <h2 className="mt-1 text-2xl font-black">
            {report.title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Underlying student, teacher, transaction, academic, or operational records contributing to this report.
          </p>
          {exportRecord ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-black uppercase">
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800">
                Export #{exportRecord.id}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
                {exportRecord.status ||
                  "READY"}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
                {exportRecord.format ||
                  "json"}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
                {formatDate(
                  exportRecord.created_at
                )}
              </span>
            </div>
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[360px]">
          {(report.metrics || [])
            .slice(0, 4)
            .map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-[11px] font-black uppercase text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-1 truncate text-lg font-black">
                  {formatMetric(metric)}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-black">
            Graphical View
          </h3>
          <MiniBars data={report.chart || []} />
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200">
          <div className="bg-slate-100 px-4 py-3 text-sm font-black">
            Contributing Records ({rows.length})
          </div>

          {rows.length ? (
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="sticky top-0 bg-white text-xs font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-3">
                      Record
                    </th>
                    {visibleKeys
                      .filter(
                        (key) =>
                          ![
                            "id",
                            "student_name",
                            "teacher_name",
                          ].includes(key)
                      )
                      .slice(0, 6)
                      .map((key) => (
                        <th
                          key={key}
                          className="p-3"
                        >
                          {readableKey(key)}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(
                    (row, index) => (
                      <tr
                        key={`${recordTitle(
                          row
                        )}-${index}`}
                        className="border-t border-slate-200"
                      >
                        <td className="p-3 align-top">
                          <p className="font-black">
                            {recordTitle(row)}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            {recordMeta(row)}
                          </p>
                          {recordHref(row) ? (
                            <a
                              href={recordHref(
                                row
                              )}
                              className="mt-2 inline-flex rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 hover:bg-amber-100"
                            >
                              Open Record
                            </a>
                          ) : null}
                        </td>
                        {visibleKeys
                          .filter(
                            (key) =>
                              ![
                                "id",
                                "student_name",
                                "teacher_name",
                              ].includes(
                                key
                              )
                          )
                          .slice(0, 6)
                          .map((key) => (
                            <td
                              key={key}
                              className="max-w-[220px] break-words p-3 align-top font-semibold text-slate-700"
                            >
                              {String(
                                row[key] ?? "-"
                              )}
                            </td>
                          ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5 text-sm font-semibold text-slate-600">
              No live records currently contribute to this report.
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
