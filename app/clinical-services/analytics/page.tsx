"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Database,
  FileText,
  LineChart,
  ShieldCheck,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { analyticsDashboardModules } from "@/lib/clinical/analytics-core";
import {
  shouldShowClinicalAnalytics,
} from "@/lib/clinical/workflow-experience";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  modules?: Row[];
  reports?: Row[];
  dashboards?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "ceo-dashboard",
    "CEO Dashboard",
    TrendingUp,
    "Revenue today, revenue month, occupancy, admissions, discharges, satisfaction, IVF, lab, and pharmacy revenue.",
  ],
  [
    "cfo-dashboard",
    "CFO Dashboard",
    BarChart3,
    "Cash flow, receivables, payables, insurance/corporate dues, profit, budget variance, and revenue forecast.",
  ],
  [
    "medical-director",
    "Medical Director",
    ShieldCheck,
    "Clinical outcomes, mortality, readmissions, infection rates, NABH, patient safety, and quality signals.",
  ],
  [
    "ivf-analytics",
    "IVF Analytics",
    Activity,
    "Cycles, retrievals, transfers, pregnancies, live births, protocol success, embryo metrics, and outcomes.",
  ],
  [
    "ai-insights",
    "AI Insights",
    Brain,
    "Risk detection, operational optimization, revenue predictions, cash-flow risk, and clinical review workflows.",
  ],
  [
    "data-warehouse",
    "Data Warehouse",
    Warehouse,
    "Facts, dimensions, ETL jobs, warehouse lineage, OLAP cube foundation, and data quality checks.",
  ],
  [
    "report-catalog",
    "Report Catalog",
    FileText,
    "500+ report definitions with exports, scheduled delivery, filters, pivots, and drilldown-ready metadata.",
  ],
  [
    "executive-alerts",
    "Executive Alerts",
    AlertTriangle,
    "Revenue drop, claim rejection spike, ICU full, OT underutilized, and low cash-flow notification workflows.",
  ],
];

export default function ClinicalAnalyticsPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);
  const [roleName, setRoleName] =
    useState("");

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/analytics/registry"
        );

        if (response.ok) {
          setData(await response.json());
        }
      }, 0);

    try {
      const stored =
        typeof window !== "undefined"
          ? window.localStorage.getItem("erpUser")
          : null;
      if (stored) {
        const parsed = JSON.parse(stored) as {
          role?: string;
          role_name?: string;
        };
        setRoleName(
          String(
            parsed.role ||
              parsed.role_name ||
              ""
          )
        );
      }
    } catch {
      setRoleName("");
    }

    return () =>
      window.clearTimeout(timer);
  }, []);

  const counts = data?.counts || {};
  const showAnalytics =
    shouldShowClinicalAnalytics(roleName);

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        {!showAnalytics ? (
          <section className="rounded-[8px] border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
              Access Restricted
            </p>
            <h1 className="mt-2 text-2xl font-black text-slate-950">
              Analytics is available to governance roles only.
            </h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Operational users should stay in their workflow dashboards,
              queues, and patient worklists.
            </p>
          </section>
        ) : null}

        {showAnalytics ? (
          <>
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#0B1F3A] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Data Warehouse + BI + AI Insights
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Enterprise Healthcare Intelligence Platform
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Phase 9 command center for real-time analytics, executive
            dashboards, clinical analytics, financial intelligence, IVF
            success analytics, forecasting, BI integrations, data exports,
            data lake governance, and AI insights with clinical review.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Database}
            title="Analytics Tables"
            value={counts.analytics_tables}
          />
          <Metric
            icon={LineChart}
            title="Screens"
            value={counts.screens}
          />
          <Metric
            icon={Activity}
            title="API Specs"
            value={counts.api_endpoints}
          />
          <Metric
            icon={FileText}
            title="Reports"
            value={counts.reports}
          />
          <Metric
            icon={Brain}
            title="AI Insights"
            value={counts.ai_insights}
          />
          <Metric
            icon={AlertTriangle}
            title="Alerts"
            value={counts.alerts}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/analytics/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Analytics Platform
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {label}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {summary}
                </p>
              </Link>
            )
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Screen Registry">
            <Rows
              rows={data?.modules || []}
              empty="No analytics screen registry loaded."
              primary={(row) =>
                String(row.module_key || "-")
              }
              secondary={(row) =>
                `${row.dashboard_type || "Analytics"} | ${row.screen_count || 0} screens configured`
              }
            />
          </Panel>
          <Panel title="Report Catalog Preview">
            <Rows
              rows={(data?.reports || []).slice(
                0,
                18
              )}
              empty="No analytics reports configured."
              primary={(row) =>
                String(row.report_name || "-")
              }
              secondary={(row) =>
                `${row.report_category || "Analytics"} | ${row.module_key || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
                Complete Phase 9 Workspaces
              </p>
              <h2 className="mt-1 text-2xl font-black">
                BI, Data Warehouse, Dashboards, Forecasts, Alerts, Reports, and AI Insights
              </h2>
            </div>
            <div className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff8e5] px-4 py-3 text-xs font-black uppercase text-[#8a6500]">
              AI insights are advisory only; clinical review required
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {analyticsDashboardModules.map((module) => (
              <Link
                key={module.key}
                href={`/clinical-services/analytics/${module.key}`}
                className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-black transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                {module.label}
                <span className="mt-1 block text-xs font-bold text-slate-500">
                  {module.category}
                </span>
              </Link>
            ))}
          </div>
        </section>
          </>
        ) : null}
      </div>
    </ClinicalShell>
  );
}

function Metric({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
  title: string;
  value: unknown;
}) {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">
          {title}
        </p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 break-words text-3xl font-black">
        {String(value ?? 0)}
      </p>
    </article>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Rows({
  rows,
  empty,
  primary,
  secondary,
}: {
  rows: Row[];
  empty: string;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-600">
        {empty}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div
          key={`${primary(row)}-${index}`}
          className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
        >
          <p className="break-words text-sm font-black">
            {primary(row)}
          </p>
          <p className="mt-1 break-words text-xs font-bold text-slate-500">
            {secondary(row)}
          </p>
        </div>
      ))}
    </div>
  );
}
