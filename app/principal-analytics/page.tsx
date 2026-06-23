"use client";

import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import { useLanguage } from "@/components/LanguageProvider";
import {
  apiJson,
  errorMessage,
} from "@/lib/client/api";

type DashboardMetrics = {
  students?: number;
  teachers?: number;
  schools?: number;
  classes?: number;
  subjects?: number;
  sections?: number;
  attendance?: number;
  marksEntries?: number;
  campusHealth?: number;
};

type FinanceMetrics = {
  totalFees?: number;
  totalCollected?: number;
  pending?: number;
  invoices?: number;
  payments?: number;
};

type ReportPayload = {
  exports?: Array<{
    id: number;
    report_key?: string | null;
    status?: string | null;
    format?: string | null;
    created_at?: string | null;
  }>;
  summary?: {
    students?: number;
    teachers?: number;
    attendance?: number;
  };
};

type HealthPayload = {
  status?: string;
  counts?: {
    schools?: number;
    students?: number;
    teachers?: number;
    events?: number;
  };
};

type IntegrityPayload = {
  status?: string;
  checks?: {
    studentsWithoutYear?: number;
    teachersWithoutYear?: number;
    pendingPromotions?: Array<Record<string, unknown>>;
    pendingFinanceApprovals?: Array<Record<string, unknown>>;
  };
};

type OptionalState<T> = {
  data: T | null;
  error: string | null;
};

const emptyState = <T,>(): OptionalState<T> => ({
  data: null,
  error: null,
});

async function optionalJson<T>(
  path: string
): Promise<OptionalState<T>> {
  try {
    return {
      data: await apiJson<T>(path),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: errorMessage(error),
    };
  }
}

function formatMoney(value?: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function percent(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

export default function PrincipalAnalyticsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] =
    useState<OptionalState<DashboardMetrics>>(
      emptyState
    );
  const [finance, setFinance] =
    useState<OptionalState<FinanceMetrics>>(
      emptyState
    );
  const [reports, setReports] =
    useState<OptionalState<ReportPayload>>(
      emptyState
    );
  const [health, setHealth] =
    useState<OptionalState<HealthPayload>>(
      emptyState
    );
  const [integrity, setIntegrity] =
    useState<
      OptionalState<IntegrityPayload>
    >(emptyState);

  useEffect(() => {
    let mounted = true;

    void Promise.all([
      optionalJson<DashboardMetrics>(
        "/api/dashboard"
      ),
      optionalJson<FinanceMetrics>(
        "/api/finance"
      ),
      optionalJson<ReportPayload>(
        "/api/reports"
      ),
      optionalJson<HealthPayload>(
        "/api/operations/health"
      ),
      optionalJson<IntegrityPayload>(
        "/api/operations/data-integrity"
      ),
    ]).then(
      ([
        dashboardResult,
        financeResult,
        reportResult,
        healthResult,
        integrityResult,
      ]) => {
        if (!mounted) {
          return;
        }

        setDashboard(dashboardResult);
        setFinance(financeResult);
        setReports(reportResult);
        setHealth(healthResult);
        setIntegrity(integrityResult);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  const collectionHealth = useMemo(() => {
    const total =
      finance.data?.totalFees || 0;
    const collected =
      finance.data?.totalCollected || 0;

    if (!total) {
      return 0;
    }

    return (collected / total) * 100;
  }, [finance.data]);

  const attentionItems = [
    {
      label: "Pending Fee Exposure",
      value: formatMoney(
        finance.data?.pending
      ),
      tone:
        (finance.data?.pending || 0) > 0
          ? "Review"
          : "Healthy",
    },
    {
      label: "Academic Year Gaps",
      value: String(
        (integrity.data?.checks
          ?.studentsWithoutYear || 0) +
          (integrity.data?.checks
            ?.teachersWithoutYear || 0)
      ),
      tone:
        integrity.data?.status ||
        "Unknown",
    },
    {
      label: "Event Ledger Records",
      value: String(
        health.data?.counts?.events || 0
      ),
      tone:
        health.data?.status || "Unknown",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="tt-dark-hero rounded-2xl border border-amber-200 bg-slate-950 p-6 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="tt-dark-accent text-xs font-black uppercase tracking-wide">
                {t("executiveWorkspace", "Executive Workspace")}
              </p>
              <h1 className="tt-dark-title mt-2 break-words text-3xl font-black md:text-4xl">
                {t("principalAnalytics", "Principal Analytics")}
              </h1>
              <p className="tt-dark-copy mt-2 max-w-3xl text-sm font-semibold leading-6">
                {t(
                  "principalAnalyticsSubtitle",
                  "School/College health, academics, finance, attendance and operational evidence in one principal view."
                )}
              </p>
            </div>
            <div className="rounded-xl border border-amber-300/40 bg-white/10 px-4 py-3">
              <p className="tt-dark-accent text-xs font-black uppercase">
                {t("campusHealthScore", "Campus Health")}
              </p>
              <p className="tt-dark-kpi mt-1 text-3xl font-black">
                {loading
                  ? "..."
                  : percent(
                      dashboard.data
                        ?.campusHealth || 0
                    )}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={t("studentsCount", "Students")}
            value={dashboard.data?.students}
            detail={t("activeStudentRecords", "Active student records")}
          />
          <MetricCard
            label={t("teachersCount", "Teachers")}
            value={dashboard.data?.teachers}
            detail={t("facultyRecords", "Faculty records")}
          />
          <MetricCard
            label={t("attendance", "Attendance")}
            value={
              dashboard.data?.attendance
            }
            detail={t("attendanceRecords", "Attendance records")}
          />
          <MetricCard
            label={t("marksEntries", "Marks Entries")}
            value={
              dashboard.data?.marksEntries
            }
            detail={t("examScoringEvidence", "Exam scoring evidence")}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="tt-card tt-card-pad">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black">
                  {t("academicIntelligence", "Academic Intelligence")}
                </h2>
                <p className="text-sm font-semibold text-slate-600">
                  {t(
                    "academicIntelligenceSubtitle",
                    "Class, section, subject and assessment readiness."
                  )}
                </p>
              </div>
                <a
                className="tt-button-secondary text-center"
                href="/academics"
              >
                {t("openAcademics", "Open Academics")}
              </a>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <MiniStat
                label={t("classes", "Classes")}
                value={dashboard.data?.classes}
              />
              <MiniStat
                label={t("sections", "Sections")}
                value={dashboard.data?.sections}
              />
              <MiniStat
                label={t("subjects", "Subjects")}
                value={dashboard.data?.subjects}
              />
            </div>
            <StatusPanel
              title={t("academicYearIntegrity", "Academic Year Integrity")}
              status={
                integrity.data?.status ||
                (integrity.error
                  ? "Unavailable"
                  : "Checking")
              }
              detail={
                integrity.error ||
                t(
                  "academicYearIntegrityDetail",
                  `${integrity.data?.checks?.studentsWithoutYear || 0} students and ${integrity.data?.checks?.teachersWithoutYear || 0} teachers missing academic-year context.`
                )
              }
            />
          </section>

          <section className="tt-card tt-card-pad">
            <h2 className="text-xl font-black">
              {t("whatNeedsAttention", "What Needs Attention")}
            </h2>
            <div className="mt-4 space-y-3">
              {attentionItems.map(
                (item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-black uppercase text-slate-500">
                      {item.label}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="break-words text-lg font-black">
                        {item.value}
                      </p>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                        {item.tone}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="tt-card tt-card-pad">
            <h2 className="text-xl font-black">
              {t("financeIntelligence", "Finance Intelligence")}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <MiniStat
                label={t("totalFees", "Total Fees")}
                value={formatMoney(
                  finance.data?.totalFees
                )}
              />
              <MiniStat
                label={t("collected", "Collected")}
                value={formatMoney(
                  finance.data?.totalCollected
                )}
              />
              <MiniStat
                label={t("pending", "Pending")}
                value={formatMoney(
                  finance.data?.pending
                )}
              />
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm font-black">
                <span>{t("collectionHealth", "Collection Health")}</span>
                <span>
                  {percent(collectionHealth)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{
                    width: percent(
                      collectionHealth
                    ),
                  }}
                />
              </div>
            </div>
            {finance.error ? (
              <p className="mt-4 text-sm font-semibold text-red-700">
                {finance.error}
              </p>
            ) : null}
          </section>

          <section className="tt-card tt-card-pad">
            <h2 className="text-xl font-black">
              {t("reportsAndEvidence", "Reports And Evidence")}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <MiniStat
                label={t("reports", "Reports")}
                value={
                  reports.data?.exports?.length ||
                  0
                }
              />
              <MiniStat
                label={t("reportAttendance", "Report Attendance")}
                value={
                  reports.data?.summary
                    ?.attendance || 0
                }
              />
              <MiniStat
                label={t("ledgerEvents", "Ledger Events")}
                value={
                  health.data?.counts?.events ||
                  0
                }
              />
            </div>
            <div className="mt-5 space-y-3">
              {(reports.data?.exports || [])
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <p className="font-black">
                      {item.report_key ||
                        `Report ${item.id}`}
                    </p>
                    <p className="text-sm font-semibold text-slate-600">
                      {item.status || "READY"} /{" "}
                      {item.format || "json"}
                    </p>
                  </div>
                ))}
              {!reports.data?.exports?.length ? (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  {t(
                    "noReportExportsYet",
                    "No report exports have been generated yet. Use Reports Center to create principal, attendance, finance and operations reports."
                  )}
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value?: number;
  detail: string;
}) {
  return (
    <div className="tt-card tt-card-pad">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">
        {value ?? 0}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        {detail}
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value?: number | string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-lg font-black">
        {value ?? 0}
      </p>
    </div>
  );
}

function StatusPanel({
  title,
  status,
  detail,
}: {
  title: string;
  status: string;
  detail: string;
}) {
  return (
    <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="font-black">{title}</p>
        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-amber-800">
          {status}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-700">
        {detail}
      </p>
    </div>
  );
}
