"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CircleDollarSign,
  Gauge,
  Landmark,
  PieChart,
  Users,
} from "lucide-react";

import Layout from "@/components/Layout";
import CommandCenterHero from "@/components/ui/CommandCenterHero";
import FinanceModuleNav from "@/components/finance/FinanceModuleNav";
import { apiJson, errorMessage } from "@/lib/client/api";

type Row = Record<string, any>;

type SchoolOption = {
  id: number;
  school_name?: string;
  school_code?: string;
};

type AcademicYearOption = {
  id: number | string;
  academic_year?: string;
  is_selected?: boolean;
};

type ClassOption = {
  id: number;
  class_name?: string;
  school_name?: string;
};

type SectionOption = {
  id: number;
  class_id?: number;
  section_name?: string;
  class_name?: string;
};

type FinancePayload = {
  context?: Row;
  kpis?: {
    totalRevenue?: number;
    totalInvoices?: number;
    collectedAmount?: number;
    pendingAmount?: number;
    collectionPercentage?: number;
    defaulters?: number;
    concessions?: number;
    expectedRevenue?: number;
    pendingInvoices?: number;
  };
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
  invoicesData?: Row[];
  paymentsData?: Row[];
  pendingFees?: Row[];
  defaultersData?: Row[];
  recentCollections?: Row[];
};

const reportTypes = [
  ["daily", "Daily Collection"],
  ["weekly", "Weekly Collection"],
  ["monthly", "Monthly Collection"],
  ["academic-year", "Academic Year"],
  ["pending-fee", "Pending Fee"],
  ["overdue", "Overdue"],
  ["defaulter", "Defaulters"],
  ["concession", "Concessions"],
  ["invoice-audit", "Invoice Audit"],
  ["payment-audit", "Payment Audit"],
];

function money(value: unknown) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function percent(value: unknown) {
  return `${Number(value || 0)}%`;
}

function queryString(filters: Record<string, string>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params?.set(key, value);
  });
  return params?.toString();
}

function delta(current: number, previous: number) {
  if (!previous) {
    return current > 0 ? "+100%" : "0%";
  }
  return `${current >= previous ? "+" : ""}${Math.round(((current - previous) / previous) * 100)}%`;
}

function changeTone(current: number, previous: number) {
  return current >= previous
    ? "text-emerald-300"
    : "text-rose-300";
}

function groupTotals(rows: Row[] = [], labelKey: string, valueKey = "amount") {
  const totals = new Map<string, number>();
  rows.forEach((row) => {
    const label = String(row[labelKey] || "Unassigned");
    totals.set(label, (totals.get(label) || 0) + Number(row[valueKey] || 0));
  });
  return Array.from(totals.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

export default function FinancePage() {
  const [data, setData] = useState<FinancePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("pending");
  const [reportType, setReportType] = useState("monthly");
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [filters, setFilters] = useState({
    school_id: "",
    academic_year_id: "",
    class_id: "",
    section_id: "",
    from: "",
    to: "",
  });

  async function loadFinance() {
    try {
      setLoading(true);
      setError("");
      const qs = queryString(filters);
      const payload = await apiJson<FinancePayload>(`/api/finance${qs ? `?${qs}` : ""}`);
      setData(payload);
    } catch (requestError) {
      setError(errorMessage(requestError, "Failed to load finance command center"));
    } finally {
      setLoading(false);
    }
  }

  async function loadFilterOptions() {
    try {
      const [schoolRows, yearRows, classRows, sectionRows] = await Promise.all([
        apiJson<SchoolOption[]>("/api/schools"),
        apiJson<AcademicYearOption[]>("/api/academic-years?include_all=true"),
        apiJson<ClassOption[]>("/api/classes"),
        apiJson<SectionOption[]>("/api/sections"),
      ]);

      setSchools(Array.isArray(schoolRows) ? schoolRows : []);
      setAcademicYears(Array.isArray(yearRows) ? yearRows : []);
      setClasses(Array.isArray(classRows) ? classRows : []);
      setSections(Array.isArray(sectionRows) ? sectionRows : []);

      const selectedYear = Array.isArray(yearRows)
        ? yearRows.find((year) => year.is_selected && year.id !== "all")
        : null;

      if (selectedYear?.id) {
        setFilters((current) =>
          current.academic_year_id
            ? current
            : {
                ...current,
                academic_year_id: String(selectedYear.id),
              }
        );
      }
    } catch (requestError) {
      console.warn("Failed to load finance filter options", requestError);
    }
  }

  useEffect(() => {
    void loadFilterOptions();
    void loadFinance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kpis = data?.kpis || {};
  const monthly = data?.monthlyAnalytics || [];
  const latestMonth = monthly.at(-1) || {};
  const previousMonth = monthly.at(-2) || {};
  const classCollections = groupTotals(data?.paymentsData || data?.invoicesData || [], "class_name", "amount");
  const sectionCollections = groupTotals(data?.paymentsData || data?.invoicesData || [], "section_name", "amount");
  const pendingByClass = groupTotals(data?.pendingFees || [], "class_name", "balance_amount");
  const topDefaulters = (data?.defaultersData || []).slice(0, 10);
  const expectedCollection = Number(latestMonth.generated || kpis.expectedRevenue || 0);
  const collectionRisk = Number(kpis.collectionPercentage || 0) >= 90
    ? "Low"
    : Number(kpis.collectionPercentage || 0) >= 75
      ? "Medium"
      : "High";
  const recommendedActions = [
    Number(kpis.pendingAmount || 0) > 0 ? "Prioritize follow-up on overdue balances." : "Keep current recovery cadence.",
    Number(kpis.defaulters || 0) > 0 ? "Alert class mentors for defaulter lists." : "No active defaulter escalation today.",
    Number(kpis.concessions || 0) > 0 ? "Review concession approvals against target." : "Monitor concession approvals weekly.",
  ];
  const cards = [
    { key: "revenue", title: "Total Revenue", value: money(kpis.totalRevenue), detail: "Fee generated from invoices", rows: data?.invoicesData || [], report: "monthly" },
    { key: "invoices", title: "Total Invoices", value: String(kpis.totalInvoices || 0), detail: "Generated invoice records", rows: data?.invoicesData || [], report: "invoice-audit" },
    { key: "collected", title: "Collected Amount", value: money(kpis.collectedAmount), detail: "Payments collected", rows: data?.paymentsData || [], report: "daily" },
    { key: "pending", title: "Pending Amount", value: money(kpis.pendingAmount), detail: "Outstanding fee balance", rows: data?.pendingFees || [], report: "pending-fee" },
    { key: "collection", title: "Collection %", value: percent(kpis.collectionPercentage), detail: "Collected divided by generated", rows: data?.monthlyAnalytics || [], report: "monthly" },
    { key: "defaulters", title: "Defaulters", value: String(kpis.defaulters || 0), detail: "Students with overdue balance", rows: data?.defaultersData || [], report: "defaulter" },
    { key: "concessions", title: "Concessions", value: money(kpis.concessions), detail: "Approved concessions", rows: data?.monthlyAnalytics || [], report: "concession" },
    { key: "expected", title: "Expected Revenue", value: money(kpis.expectedRevenue), detail: "Invoices plus active fee exposure", rows: data?.monthlyAnalytics || [], report: "academic-year" },
  ];

  const selectedCard = cards.find((card) => card.key === selectedDetail) || cards[0];
  const reportQuery = useMemo(() => queryString({ ...filters, type: reportType }), [filters, reportType]);
  const visibleSections = useMemo(
    () =>
      sections.filter(
        (section) =>
          !filters.class_id ||
          String(section.class_id || "") === filters.class_id
      ),
    [filters.class_id, sections]
  );

  return (
    <Layout>
      <div className="space-y-6">
        <CommandCenterHero
          label="Fee Collection Command Center"
          title="Finance Command Center"
          subtitle="Revenue, invoices, collections, pending dues, concessions, defaulters and exports from live finance records."
          healthCard={
            <div className="min-w-[180px] rounded-[8px] border border-[#D4AF37]/45 bg-[linear-gradient(180deg,rgba(212,175,55,0.28),rgba(212,175,55,0.12))] p-4 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#102033]/80">Collection Health</p>
              <p className="mt-2 text-[44px] font-black leading-none text-white md:text-[52px]">{kpis.collectionPercentage || 0}%</p>
            </div>
          }
        >
          <div className="grid min-w-[320px] grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">
            {[
              { label: "Total Revenue", value: money(kpis.totalRevenue), delta: delta(Number(kpis.totalRevenue || 0), Number(previousMonth.generated || 0)), tone: changeTone(Number(kpis.totalRevenue || 0), Number(previousMonth.generated || 0)), icon: Landmark },
              { label: "Collected", value: money(kpis.collectedAmount), delta: delta(Number(kpis.collectedAmount || 0), Number(previousMonth.collected || 0)), tone: changeTone(Number(kpis.collectedAmount || 0), Number(previousMonth.collected || 0)), icon: CircleDollarSign },
              { label: "Pending", value: money(kpis.pendingAmount), delta: delta(Number(kpis.pendingAmount || 0), Number(previousMonth.pending || 0)), tone: Number(kpis.pendingAmount || 0) > Number(previousMonth.pending || 0) ? "text-rose-300" : "text-emerald-300", icon: Bell },
              { label: "Collection %", value: percent(kpis.collectionPercentage), delta: delta(Number(kpis.collectionPercentage || 0), Number(previousMonth.collection_percentage || 0)), tone: changeTone(Number(kpis.collectionPercentage || 0), Number(previousMonth.collection_percentage || 0)), icon: Gauge },
              { label: "Defaulters", value: String(kpis.defaulters || 0), delta: delta(Number(kpis.defaulters || 0), Number(previousMonth.defaulters || 0)), tone: Number(kpis.defaulters || 0) > Number(previousMonth.defaulters || 0) ? "text-rose-300" : "text-emerald-300", icon: Users },
            ].map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </CommandCenterHero>

        <FinanceModuleNav />

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="tt-card tt-card-pad">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-amber-700">AI-Ready Finance Insight</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Collection Intelligence</h2>
              </div>
              <div className="rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-2 text-right">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-800">Expected Collection This Month</p>
                <p className="text-2xl font-black text-slate-950">{money(expectedCollection)}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Collection Risk</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{collectionRisk}</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">Based on current collection percentage and overdue balances.</p>
              </div>
              <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">Top Pending Classes</p>
                <div className="mt-3 space-y-2">
                  {pendingByClass.slice(0, 3).map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 rounded-[8px] bg-white p-3">
                      <span className="text-sm font-black text-slate-950">{row.label}</span>
                      <span className="text-sm font-black text-amber-800">{money(row.value)}</span>
                    </div>
                  ))}
                  {!pendingByClass.length ? <p className="text-sm font-semibold text-slate-500">No pending class data available.</p> : null}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-500">Recommended Actions</p>
              <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700">
                {recommendedActions.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="tt-card tt-card-pad">
            <p className="text-xs font-black uppercase text-amber-700">Quick Context</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Current Finance Scope</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <ContextChip label="Total Revenue" value={money(kpis.totalRevenue)} />
              <ContextChip label="Collected" value={money(kpis.collectedAmount)} />
              <ContextChip label="Pending" value={money(kpis.pendingAmount)} />
              <ContextChip label="Defaulters" value={String(kpis.defaulters || 0)} />
            </div>
          </section>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <label className="min-w-0">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">School/College Name</span>
              <select
                className="input"
                value={filters.school_id}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    school_id: event.target.value,
                    class_id: "",
                    section_id: "",
                  }))
                }
              >
                <option value="">All Schools/Colleges</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.school_name || `School ${school.id}`}
                    {school.school_code ? ` (${school.school_code})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="min-w-0">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Academic Year</span>
              <select
                className="input"
                value={filters.academic_year_id}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    academic_year_id:
                      event.target.value === "all"
                        ? ""
                        : event.target.value,
                  }))
                }
              >
                <option value="">All Academic Years</option>
                {academicYears.map((year) => (
                  <option key={String(year.id)} value={year.id === "all" ? "all" : String(year.id)}>
                    {year.academic_year || `Academic Year ${year.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label className="min-w-0">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Class Name</span>
              <select
                className="input"
                value={filters.class_id}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    class_id: event.target.value,
                    section_id: "",
                  }))
                }
              >
                <option value="">All Classes</option>
                {classes
                  .filter(
                    (classItem) =>
                      !filters.school_id ||
                      String((classItem as Row).school_id || "") === filters.school_id
                  )
                  .map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.class_name || `Class ${classItem.id}`}
                      {classItem.school_name ? ` - ${classItem.school_name}` : ""}
                    </option>
                  ))}
              </select>
            </label>

            <label className="min-w-0">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Section Name</span>
              <select
                className="input"
                value={filters.section_id}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    section_id: event.target.value,
                  }))
                }
                disabled={!filters.class_id && visibleSections.length === 0}
              >
                <option value="">All Sections</option>
                {visibleSections
                  .filter(
                    (section) =>
                      !filters.school_id ||
                      String((section as Row).school_id || "") === filters.school_id
                  )
                  .map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.section_name || `Section ${section.id}`}
                      {section.class_name ? ` - ${section.class_name}` : ""}
                    </option>
                  ))}
              </select>
            </label>

            <label className="min-w-0">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">From Date</span>
              <input
                className="input"
                type="date"
                value={filters.from}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    from: event.target.value,
                  }))
                }
              />
            </label>

            <label className="min-w-0">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">To Date</span>
              <input
                className="input"
                type="date"
                value={filters.to}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    to: event.target.value,
                  }))
                }
              />
            </label>
          </div>
          <button onClick={loadFinance} className="tt-button mt-4" disabled={loading}>{loading ? "Loading..." : "Apply Filters"}</button>
          {error ? <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-black text-red-700">{error}</p> : null}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <AnalyticsPanel
            title="Revenue vs Collection Chart"
            subtitle="Generated amount compared with actual collections by month."
            rows={monthly.map((row) => ({
              label: String(row.month),
              primary: Number(row.generated || 0),
              secondary: Number(row.collected || 0),
              accent: "bg-emerald-500",
              secondaryAccent: "bg-sky-500",
            }))}
          />
          <AnalyticsPanel
            title="Monthly Collection Trend"
            subtitle="Collection momentum across the selected academic scope."
            rows={monthly.map((row) => ({
              label: String(row.month),
              primary: Number(row.collected || 0),
              accent: "bg-amber-500",
            }))}
          />
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => {
                setSelectedDetail(card.key);
                setReportType(card.report);
              }}
              className={`tt-card text-left transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl ${selectedDetail === card.key ? "border-amber-400" : ""}`}
            >
              <div className="h-1 bg-amber-600" />
              <div className="tt-card-pad">
                <p className="text-xs font-black uppercase text-slate-500">{card.title}</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">{card.value}</h2>
                <p className="mt-3 text-sm font-semibold text-slate-600">{card.detail}</p>
                <span className="mt-5 inline-flex text-sm font-black text-amber-800">Open filtered report</span>
              </div>
            </button>
          ))}
        </div>

        <section className="grid gap-6 xl:grid-cols-3">
          <TrendCard title="Class Wise Collection" data={classCollections} />
          <TrendCard title="Section Wise Collection" data={sectionCollections} />
          <TrendCard title="Top 10 Defaulters" data={topDefaulters.map((row) => ({ label: row.student_name || row.admission_number || "-", value: Number(row.pending_amount || row.balance_amount || 0) }))} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <ComparisonCard title="Top Performing Classes" data={classCollections.slice(0, 10).map((row) => ({ ...row, collected: row.value }))} />
          <ComparisonCard title="Least Performing Classes" data={[...classCollections].sort((a, b) => a.value - b.value).slice(0, 10).map((row) => ({ ...row, collected: row.value }))} />
        </section>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-amber-700">Monthly Analytics</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Generated vs Collected vs Pending</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="tt-button-secondary" href={`/api/finance/reports/export?${queryString({ ...filters, type: "monthly", format: "pdf" })}`}>Export PDF</a>
              <a className="tt-button-secondary" href={`/api/finance/reports/export?${queryString({ ...filters, type: "monthly", format: "xlsx" })}`}>Export Excel</a>
              <button className="tt-button-secondary" onClick={() => window.print()}>Print</button>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500">
                <tr><th className="p-3">Month</th><th className="p-3">Generated</th><th className="p-3">Collected</th><th className="p-3">Pending</th><th className="p-3">Concessions</th><th className="p-3">Collection %</th></tr>
              </thead>
              <tbody>
                {(data?.monthlyAnalytics || []).map((row) => (
                  <tr key={row.month} className="border-t border-slate-200">
                    <td className="p-3 font-black">{row.month}</td><td className="p-3">{money(row.generated)}</td><td className="p-3">{money(row.collected)}</td><td className="p-3">{money(row.pending)}</td><td className="p-3">{money(row.concessions)}</td><td className="p-3 font-black">{row.collection_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-amber-700">Finance Reports Center</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">{selectedCard.title}</h2>
              <p className="text-sm font-semibold text-slate-600">{selectedCard.detail}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="input w-56" value={reportType} onChange={(event) => setReportType(event.target.value)}>
                {reportTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <a className="tt-button-secondary" href={`/api/finance/reports?${reportQuery}`}>View JSON</a>
              <a className="tt-button-secondary" href={`/api/finance/reports/export?${queryString({ ...filters, type: reportType, format: "pdf" })}`}>Export PDF</a>
              <a className="tt-button-secondary" href={`/api/finance/reports/export?${queryString({ ...filters, type: reportType, format: "xlsx" })}`}>Export Excel</a>
              <button className="tt-button-secondary" disabled title="Configure SMTP to enable email PDFs">Email PDF</button>
              <button className="tt-button-secondary" disabled title="WhatsApp report sharing uses public signed links and can be enabled from the report delivery workflow">WhatsApp PDF</button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            {(selectedCard.rows || []).slice(0, 80).map((row, index) => (
              <div key={index} className="grid gap-3 border-t border-slate-200 p-4 text-sm md:grid-cols-[1.3fr_1fr_0.8fr_0.8fr]">
                <div><p className="font-black text-slate-950">{row.student_name || row.invoice_number || row.receipt_number || row.month || `Record ${index + 1}`}</p><p className="text-xs font-semibold text-slate-500">{[row.admission_number, row.class_name, row.section_name, row.status].filter(Boolean).join(" • ")}</p></div>
                <p className="font-semibold text-slate-700">{row.invoice_number || row.payment_method || row.school_name || row.label || "-"}</p>
                <p className="font-black">{money(row.total_amount ?? row.generated ?? row.amount ?? row.collected)}</p>
                <p className="font-black text-amber-800">{money(row.balance_amount ?? row.pending ?? row.pending_amount)}</p>
              </div>
            ))}
            {!selectedCard.rows?.length ? <div className="bg-slate-50 p-5 text-sm font-semibold text-slate-600">No records found for this report.</div> : null}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function MetricCard({
  label,
  value,
  delta,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  tone: string;
  icon: any;
}) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/10 p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.9)" }}>{label}</p>
          <p className="mt-2 text-2xl font-black" style={{ color: "#FFFFFF" }}>{value}</p>
        </div>
        <div className="rounded-[8px] bg-white/12 p-2 text-white">
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
        {Number(delta.replace(/[^0-9-]/g, "")) >= 0 ? <ArrowUpRight size={14} className={tone} /> : <ArrowDownRight size={14} className={tone} />}
        <span className={tone}>{delta}</span>
        <span style={{ color: "rgba(255,255,255,0.6)" }}>vs previous month</span>
      </div>
    </div>
  );
}

function ContextChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function AnalyticsPanel({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: Array<{ label: string; primary: number; secondary?: number; accent: string; secondaryAccent?: string }>;
}) {
  const max = Math.max(1, ...rows.map((row) => Math.max(row.primary, row.secondary || 0)));
  return (
    <section className="tt-card tt-card-pad">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-amber-700">{title}</p>
          <p className="mt-1 text-sm font-semibold text-slate-600">{subtitle}</p>
        </div>
        <PieChart size={18} className="text-amber-700" />
      </div>
      <div className="mt-5 space-y-4">
        {rows.slice(0, 8).map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs font-black uppercase text-slate-500">
              <span>{row.label}</span>
              <span>{money(row.primary)}</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${row.accent}`} style={{ width: `${clampPercent((row.primary / max) * 100)}%` }} />
              </div>
              {typeof row.secondary === "number" ? (
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${row.secondaryAccent || "bg-sky-500"}`} style={{ width: `${clampPercent((row.secondary / max) * 100)}%` }} />
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {!rows.length ? <div className="rounded-[8px] border border-dashed border-slate-200 p-4 text-sm font-semibold text-slate-500">No records available for this analytics block.</div> : null}
      </div>
    </section>
  );
}

function TrendCard({ title, data }: { title: string; data: Row[] }) {
  const max = Math.max(1, ...data.map((item) => Number(item.value || 0)));
  return <div className="tt-card tt-card-pad"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-5 space-y-3">{data.slice(0, 10).map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs font-black text-slate-600"><span>{item.label}</span><span>{money(item.value)}</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.max(3, (Number(item.value || 0) / max) * 100)}%` }} /></div></div>)}</div></div>;
}

function ComparisonCard({ title, data }: { title: string; data: Row[] }) {
  return <div className="tt-card tt-card-pad"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-5 space-y-3">{data.slice(0, 10).map((item) => <div key={item.label} className="rounded-lg border border-slate-200 p-3"><div className="flex justify-between gap-3"><p className="font-black text-slate-900">{item.label}</p><p className="font-black text-amber-800">{item.collection_percentage || Math.round((Number(item.collected || 0)/Math.max(1, Number(item.generated || 0))) * 100)}%</p></div><p className="mt-1 text-xs font-semibold text-slate-500">Generated {money(item.generated)} • Collected {money(item.collected)} • Pending {money(item.pending)}</p></div>)}</div></div>;
}
