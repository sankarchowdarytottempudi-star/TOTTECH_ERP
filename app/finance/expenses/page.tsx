"use client";

import { Download, Filter, Plus, Printer, RefreshCcw, ShieldCheck, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Row = Record<string, any>;

type ExpensePayload = {
  context?: {
    selectedSchool?: Row | null;
    selectedAcademicYear?: Row | null;
    allSchools?: boolean;
    allYears?: boolean;
    filters?: Row;
  };
  expenses?: Row[];
  summary?: {
    expenseCount?: number;
    totalExpense?: number;
    approvedExpense?: number;
    pendingApproval?: number;
    rejectedExpense?: number;
    paidExpense?: number;
    monthlyExpense?: number;
    yearlyExpense?: number;
  };
  analytics?: {
    expenseByMonth?: Row[];
    expenseByCategory?: Row[];
    expenseBySchool?: Row[];
    expenseByAcademicYear?: Row[];
    expenseByClass?: Row[];
    expenseBySection?: Row[];
    topCategories?: Row[];
  };
  options?: {
    schools?: Row[];
    academicYears?: Row[];
    classes?: Row[];
    sections?: Row[];
    createdByUsers?: Row[];
    categories?: Row[];
    statuses?: string[];
    paymentModes?: string[];
  };
};

type FinancePayload = {
  kpis?: {
    totalRevenue?: number;
    collectedAmount?: number;
    pendingAmount?: number;
    collectionPercentage?: number;
  };
  charts?: {
    collectionTrend?: Row[];
    revenueTrend?: Row[];
  };
};

const initialFilterState = {
  school_id: "",
  academic_year_id: "",
  class_id: "",
  section_id: "",
  status: "",
  category: "",
  created_by: "",
  from: "",
  to: "",
  q: "",
};

const initialForm = {
  school_id: "",
  academic_year_id: "",
  class_id: "",
  section_id: "",
  category: "SALARY",
  custom_category: "",
  expense_date: new Date().toISOString().slice(0, 10),
  vendor_name: "",
  description: "",
  amount: "",
  payment_method: "CASH",
  reference_number: "",
  status: "PENDING_APPROVAL",
  attachment: null as File | null,
};

function queryString(filters: Record<string, string>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params?.set(key, value);
  });
  return params?.toString();
}

function money(value: unknown) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function dateText(value: unknown) {
  if (!value) return "-";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-IN");
}

function chartWidth(value: unknown, max: number) {
  return `${Math.max(6, (Number(value || 0) / Math.max(max, 1)) * 100)}%`;
}

export default function ExpenseManagementPage() {
  const [payload, setPayload] = useState<ExpensePayload | null>(null);
  const [finance, setFinance] = useState<FinancePayload | null>(null);
  const [filters, setFilters] = useState(initialFilterState);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const qs = queryString(filters);
      const [expenses, financePayload] = await Promise.all([
        apiJson<ExpensePayload>(`/api/finance/expenses${qs ? `?${qs}` : ""}`),
        apiJson<FinancePayload>(`/api/finance${qs ? `?${qs}` : ""}`),
      ]);
      setPayload(expenses);
      setFinance(financePayload);
      if (!form.school_id && expenses.context?.filters?.school_id) {
        setForm((current) => ({
          ...current,
          school_id: String(expenses.context?.filters?.school_id || ""),
          academic_year_id: String(expenses.context?.filters?.academic_year_id || ""),
        }));
      }
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to load expenses"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => payload?.expenses || [], [payload?.expenses]);
  const analytics = payload?.analytics || {};
  const summary = payload?.summary || {};
  const options = payload?.options || {};
  const financeKpis = finance?.kpis || {};
  const selectedSchool = payload?.context?.selectedSchool?.school_name || "All Schools/Colleges";
  const selectedAcademicYear = payload?.context?.selectedAcademicYear?.academic_year || "All Academic Years";
  const maxExpenseMonth = Math.max(1, ...(analytics.expenseByMonth || []).map((row) => Number(row.value || 0)));
  const maxCategory = Math.max(1, ...(analytics.expenseByCategory || []).map((row) => Number(row.value || 0)));
  const filterQuery = queryString(filters);

  const createExpense = async () => {
    try {
      setSaving(true);
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value instanceof File) {
          body.append(key, value);
        } else if (value) {
          body.append(key, String(value));
        }
      });

      const response = await fetch("/api/finance/expenses", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create expense");
      }
      notify.success("Expense created and queued for workflow");
      setForm(initialForm);
      await load();
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to create expense"));
    } finally {
      setSaving(false);
    }
  };

  const updateExpense = async (id: number, action: "APPROVE" | "REJECT" | "MARK_PAID") => {
    try {
      const result = await apiJson<Row>("/api/finance/expenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      notify.success(`Expense ${action === "MARK_PAID" ? "marked as paid" : action.toLowerCase()} successfully`);
      if (result) await load();
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to update expense"));
    }
  };

  const income = Number(financeKpis.totalRevenue || financeKpis.collectedAmount || 0);
  const expenseTotal = Number(summary.totalExpense || 0);
  const profitLoss = income - expenseTotal;

  return (
    <Layout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-xl border border-amber-300/40 bg-slate-950 text-white shadow-2xl">
          <div className="bg-[radial-gradient(circle_at_top_right,rgba(214,160,52,0.28),transparent_38%),linear-gradient(135deg,#030b16_0%,#0a1730_55%,#20180c_100%)] p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">School/College Expense Command Center</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-black md:text-5xl">School/College Expense Management</h1>
                <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-white/80">
                  Manage expenses with school/college, academic year, class and section filters, approval workflow, exportable reports, and attachment-backed records.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <KpiSmall label="Income" value={money(income)} />
                <KpiSmall label="Expense" value={money(expenseTotal)} />
                <KpiSmall label="Profit / Loss" value={money(profitLoss)} tone={profitLoss >= 0 ? "good" : "bad"} />
                <KpiSmall label="Collection % (reference)" value={`${Number(financeKpis.collectionPercentage || 0)}%`} />
              </div>
            </div>
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-amber-700">Context</p>
              <h2 className="text-2xl font-black text-slate-950">{selectedSchool} • {selectedAcademicYear}</h2>
              <p className="text-sm font-semibold text-slate-600">Users see names, not internal IDs.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="tt-button-secondary" onClick={() => void load()}><RefreshCcw size={16} /> Reload</button>
              <a className="tt-button-secondary" href={`/api/finance/expenses/export?${filterQuery ? `${filterQuery}&` : ""}format=pdf`}><Download size={16} /> Export PDF</a>
              <a className="tt-button-secondary" href={`/api/finance/expenses/export?${filterQuery ? `${filterQuery}&` : ""}format=xlsx`}><Download size={16} /> Export Excel</a>
              <button className="tt-button-secondary" onClick={() => window.print()}><Printer size={16} /> Print</button>
            </div>
          </div>
        </section>

        <section className="tt-card tt-card-pad space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-600"><Filter size={16} /> Expense Filters</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <Select label="School/College Name" value={filters.school_id} onChange={(value) => setFilters((current) => ({ ...current, school_id: value }))} options={[{ value: "", label: "All Schools/Colleges" }, ...(options.schools || []).map((row) => ({ value: String(row.id), label: row.school_name }))]} />
            <Select label="Academic Year" value={filters.academic_year_id} onChange={(value) => setFilters((current) => ({ ...current, academic_year_id: value }))} options={[{ value: "", label: "All Academic Years" }, ...(options.academicYears || []).map((row) => ({ value: String(row.id), label: row.academic_year }))]} />
            <Select label="Expense Status" value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value }))} options={[{ value: "", label: "All Statuses" }, ...(options.statuses || []).map((value) => ({ value, label: value.replaceAll("_", " ") }))]} />
            <Select label="Expense Type" value={filters.category} onChange={(value) => setFilters((current) => ({ ...current, category: value }))} options={[{ value: "", label: "All Categories" }, ...(options.categories || []).map((row) => ({ value: row.code, label: row.name }))]} />
            <Select label="Class" value={filters.class_id} onChange={(value) => setFilters((current) => ({ ...current, class_id: value }))} options={[{ value: "", label: "All Classes" }, ...(options.classes || []).map((row) => ({ value: String(row.id), label: row.class_name }))]} />
            <Select label="Section" value={filters.section_id} onChange={(value) => setFilters((current) => ({ ...current, section_id: value }))} options={[{ value: "", label: "All Sections" }, ...(options.sections || []).map((row) => ({ value: String(row.id), label: row.section_name }))]} />
            <Input label="From Date" inputType="date" value={filters.from} onChange={(value) => setFilters((current) => ({ ...current, from: value }))} />
            <Input label="To Date" inputType="date" value={filters.to} onChange={(value) => setFilters((current) => ({ ...current, to: value }))} />
            <Select label="Created By" value={filters.created_by} onChange={(value) => setFilters((current) => ({ ...current, created_by: value }))} options={[{ value: "", label: "All Users" }, ...(options.createdByUsers || []).map((row) => ({ value: String(row.id), label: row.full_name }))]} />
            <Input label="Search" value={filters.q} onChange={(value) => setFilters((current) => ({ ...current, q: value }))} placeholder="Vendor, reference, description" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="tt-button" onClick={() => void load()}><Filter size={16} /> Apply Filters</button>
            <button className="tt-button-secondary" onClick={() => setFilters(initialFilterState)}>Clear Filters</button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard title="Total Expense" value={money(summary.totalExpense)} />
          <MetricCard title="Monthly Expense" value={money(summary.monthlyExpense)} />
          <MetricCard title="Yearly Expense" value={money(summary.yearlyExpense)} />
          <MetricCard title="Pending Approvals" value={money(summary.pendingApproval)} />
          <MetricCard title="Approved Expenses" value={money(summary.approvedExpense)} />
          <MetricCard title="Rejected Expenses" value={money(summary.rejectedExpense)} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <AnalyticsCard title="Expense by Month" rows={analytics.expenseByMonth || []} max={Math.max(1, ...(analytics.expenseByMonth || []).map((row) => Number(row.value || 0)))} />
          <AnalyticsCard title="Expense by Category" rows={analytics.expenseByCategory || []} max={Math.max(1, ...(analytics.expenseByCategory || []).map((row) => Number(row.value || 0)))} />
          <AnalyticsCard title="Expense by School/College" rows={analytics.expenseBySchool || []} max={Math.max(1, ...(analytics.expenseBySchool || []).map((row) => Number(row.value || 0)))} />
          <AnalyticsCard title="Top 10 Categories" rows={analytics.topCategories || []} max={Math.max(1, ...(analytics.topCategories || []).map((row) => Number(row.value || 0)))} countOnly />
        </section>

        <section className="tt-card tt-card-pad space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-600"><Plus size={16} /> Expense Entry</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select label="School/College Name" value={form.school_id} onChange={(value) => setForm((current) => ({ ...current, school_id: value }))} options={[{ value: "", label: "Select School/College" }, ...(options.schools || []).map((row) => ({ value: String(row.id), label: row.school_name }))]} />
            <Select label="Academic Year" value={form.academic_year_id} onChange={(value) => setForm((current) => ({ ...current, academic_year_id: value }))} options={[{ value: "", label: "Select Year" }, ...(options.academicYears || []).map((row) => ({ value: String(row.id), label: row.academic_year }))]} />
            <Select label="Class" value={form.class_id} onChange={(value) => setForm((current) => ({ ...current, class_id: value }))} options={[{ value: "", label: "Entire School/College" }, ...(options.classes || []).map((row) => ({ value: String(row.id), label: row.class_name }))]} />
            <Select label="Section" value={form.section_id} onChange={(value) => setForm((current) => ({ ...current, section_id: value }))} options={[{ value: "", label: "All Sections" }, ...(options.sections || []).map((row) => ({ value: String(row.id), label: row.section_name }))]} />
            <Select label="Expense Type" value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value }))} options={[{ value: "CUSTOM", label: "Custom Category" }, ...(options.categories || []).map((row) => ({ value: row.code, label: row.name }))]} />
            {form.category === "CUSTOM" ? (
              <Input label="Custom Category" value={form.custom_category} onChange={(value) => setForm((current) => ({ ...current, custom_category: value }))} placeholder="Type expense category" />
            ) : null}
            <Input label="Expense Date" inputType="date" value={form.expense_date} onChange={(value) => setForm((current) => ({ ...current, expense_date: value }))} />
            <Input label="Amount" inputMode="decimal" value={form.amount} onChange={(value) => setForm((current) => ({ ...current, amount: value }))} placeholder="0.00" />
            <Input label="Vendor Name" value={form.vendor_name} onChange={(value) => setForm((current) => ({ ...current, vendor_name: value }))} />
            <Select label="Payment Mode" value={form.payment_method} onChange={(value) => setForm((current) => ({ ...current, payment_method: value }))} options={(options.paymentModes || ["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "NET_BANKING", "INSURANCE"]).map((value) => ({ value, label: value.replaceAll("_", " ") }))} />
            <Select label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} options={[{ value: "PENDING_APPROVAL", label: "Pending Approval" }, { value: "APPROVED", label: "Approved" }, { value: "PAID", label: "Paid" }, { value: "REJECTED", label: "Rejected" }]} />
            <Input label="Invoice / Reference Number" value={form.reference_number} onChange={(value) => setForm((current) => ({ ...current, reference_number: value }))} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
          <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto] md:items-end">
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Attachment Upload</span>
              <input
                className="input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={(event) => setForm((current) => ({ ...current, attachment: event.target.files?.[0] || null }))}
              />
              <p className="mt-1 text-xs font-semibold text-slate-500">PDF, JPG, PNG, WEBP. Bills and vouchers are stored with the expense record.</p>
            </label>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
              Approval workflow: <strong>Pending Approval → Approved → Paid</strong>
            </div>
            <button className="tt-button" disabled={saving} onClick={createExpense}>
              <Upload size={16} /> {saving ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-amber-700">Expense Register</p>
              <h2 className="text-2xl font-black text-slate-950">Latest records</h2>
              <p className="text-sm font-semibold text-slate-600">Showing the latest 500 matching records with names instead of IDs.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">
              Total Records: {summary.expenseCount || rows.length}
            </div>
          </div>

          {loading ? (
            <p className="mt-4 text-sm font-semibold text-slate-600">Loading expenses...</p>
          ) : rows.length === 0 ? (
            <p className="mt-4 text-sm font-semibold text-slate-600">No expenses found for the selected filters.</p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-3 pr-4">Expense Date</th>
                    <th className="py-3 pr-4">School/College</th>
                    <th className="py-3 pr-4">Academic Year</th>
                    <th className="py-3 pr-4">Class</th>
                    <th className="py-3 pr-4">Section</th>
                    <th className="py-3 pr-4">Expense Type</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Created By</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-semibold">{dateText(row.expense_date)}</td>
                      <td className="py-3 pr-4">{row.school_name || "-"}</td>
                      <td className="py-3 pr-4">{row.academic_year || "-"}</td>
                      <td className="py-3 pr-4">{row.class_name || "Entire School/College"}</td>
                      <td className="py-3 pr-4">{row.section_name || "-"}</td>
                      <td className="py-3 pr-4 font-black">{String(row.category || "-").replaceAll("_", " ")}</td>
                      <td className="py-3 pr-4 font-black">{money(row.amount)}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-900">
                          {String(row.status || "-").replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{row.created_by_name || "-"}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {row.status === "PENDING_APPROVAL" ? (
                            <>
                              <button className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700" onClick={() => updateExpense(Number(row.id), "APPROVE")}>Approve</button>
                              <button className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700" onClick={() => updateExpense(Number(row.id), "REJECT")}>Reject</button>
                            </>
                          ) : null}
                          {row.status === "APPROVED" ? (
                            <button className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-black text-sky-700" onClick={() => updateExpense(Number(row.id), "MARK_PAID")}>Mark Paid</button>
                          ) : null}
                          {row.attachment_url ? (
                            <a className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-black text-slate-700" href={row.attachment_url} target="_blank" rel="noreferrer">View Bill</a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

function KpiSmall({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className={`min-w-[140px] rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur ${tone === "good" ? "ring-1 ring-emerald-400/30" : tone === "bad" ? "ring-1 ring-red-400/30" : ""}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="tt-card tt-card-pad">
      <p className="text-xs font-black uppercase text-slate-500">{title}</p>
      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function AnalyticsCard({ title, rows, max, countOnly = false }: { title: string; rows: Row[]; max: number; countOnly?: boolean }) {
  return (
    <div className="tt-card tt-card-pad">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <div className="mt-5 space-y-3">
        {rows.slice(0, 10).map((row) => (
          <div key={String(row.label || row.name || Math.random())}>
            <div className="mb-1 flex justify-between gap-3 text-xs font-black text-slate-600">
              <span className="truncate">{String(row.label || row.name || "-")}</span>
              <span>{countOnly ? String(row.value || row.count || 0) : money(row.value)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-amber-500" style={{ width: chartWidth(row.value, max) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputType?: "text" | "date" | "number" | "search" | "email" | "tel" | "url";
  placeholder?: string;
  inputMode?: string;
};

function Input({ label, value, onChange, inputType, placeholder, inputMode }: InputProps) {
  const resolvedType = (inputType ?? "text") as
    | "url"
    | "decimal"
    | "search"
    | "email"
    | "none"
    | "numeric"
    | "text"
    | "tel";
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <input
        className="input"
        {...({
          type: resolvedType,
          inputMode,
          placeholder,
          value,
          onChange: (event: any) => onChange(event.target.value),
        } as any)}
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <textarea className="input min-h-28" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
