"use client";

import { Download, Filter, Plus, Printer, RefreshCcw, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/Layout";
import { apiJson, errorMessage } from "@/lib/client/api";
import { notify } from "@/lib/notify";

type Row = Record<string, any>;

type VoucherPayload = {
  context?: {
    selectedSchool?: Row | null;
    selectedAcademicYear?: Row | null;
    allSchools?: boolean;
    allYears?: boolean;
    filters?: Row;
  };
  vouchers?: Row[];
  summary?: {
    voucherCount?: number;
    totalExpense?: number;
    paidExpense?: number;
    pendingExpense?: number;
  };
  analytics?: {
    expenseByMonth?: Row[];
    expenseByCategory?: Row[];
    topVendors?: Row[];
  };
  options?: {
    schools?: Row[];
    academicYears?: Row[];
    createdByUsers?: Row[];
    statuses?: string[];
  };
};

const initialFilterState = {
  school_id: "",
  academic_year_id: "",
  status: "",
  category: "",
  q: "",
};

const initialForm = {
  school_id: "",
  academic_year_id: "",
  voucher_date: new Date().toISOString().slice(0, 10),
  expense_category: "MISCELLANEOUS",
  paid_to: "",
  mobile_number: "",
  address: "",
  amount: "",
  amount_in_words: "",
  payment_mode: "CASH",
  reference_number: "",
  purpose: "",
  remarks: "",
  voucher_status: "DRAFT",
  receiver_name: "",
  attachment_1: null as File | null,
  attachment_2: null as File | null,
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

export default function ExpenseVouchersPage() {
  const [payload, setPayload] = useState<VoucherPayload | null>(null);
  const [filters, setFilters] = useState(initialFilterState);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const qs = queryString(filters);
      const vouchers = await apiJson<VoucherPayload>(`/api/finance/vouchers${qs ? `?${qs}` : ""}`);
      setPayload(vouchers);
      if (!form.school_id && vouchers.context?.filters?.school_id) {
        setForm((current) => ({
          ...current,
          school_id: String(vouchers.context?.filters?.school_id || ""),
          academic_year_id: String(vouchers.context?.filters?.academic_year_id || ""),
        }));
      }
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to load expense vouchers"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => payload?.vouchers || [], [payload?.vouchers]);
  const summary = payload?.summary || {};
  const analytics = payload?.analytics || {};
  const options = payload?.options || {};
  const filterQuery = queryString(filters);

  const createVoucher = async () => {
    try {
      setSaving(true);
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value instanceof File) body.append(key, value);
        else if (value) body.append(key, String(value));
      });
      const response = await fetch("/api/finance/vouchers", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to create voucher");
      notify.success("Expense voucher created");
      setForm(initialForm);
      await load();
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to create voucher"));
    } finally {
      setSaving(false);
    }
  };

  const updateVoucher = async (id: number, voucher_status: string) => {
    try {
      const response = await fetch("/api/finance/vouchers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, voucher_status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to update voucher");
      notify.success("Voucher updated");
      await load();
    } catch (requestError) {
      notify.error(errorMessage(requestError, "Failed to update voucher"));
    }
  };

  const totalExpense = Number(summary.totalExpense || 0);
  const paidExpense = Number(summary.paidExpense || 0);
  const pendingExpense = Number(summary.pendingExpense || 0);

  return (
    <Layout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-xl border border-amber-300/40 bg-slate-950 text-white shadow-2xl">
          <div className="bg-[radial-gradient(circle_at_top_right,rgba(214,160,52,0.28),transparent_38%),linear-gradient(135deg,#030b16_0%,#0a1730_55%,#20180c_100%)] p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Finance • Expense Vouchers</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-black md:text-5xl">Expense Voucher &amp; Payment Disbursement</h1>
                <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-white/80">
                  Manage vouchers, acknowledgements, approvals, and payment proof for vendor, salary, reimbursement, utility, transport, and maintenance disbursements.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <KpiSmall label="Total Expenses" value={money(totalExpense)} />
                <KpiSmall label="Paid Expenses" value={money(paidExpense)} />
                <KpiSmall label="Pending Expenses" value={money(pendingExpense)} />
              </div>
            </div>
          </div>
        </section>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-amber-700">Context</p>
              <h2 className="text-2xl font-black text-slate-950">{payload?.context?.selectedSchool?.school_name || "All Schools/Colleges"} • {payload?.context?.selectedAcademicYear?.academic_year || "All Academic Years"}</h2>
              <p className="text-sm font-semibold text-slate-600">Vouchers, not just expense entries.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="tt-button-secondary" onClick={() => void load()}><RefreshCcw size={16} /> Reload</button>
              <a className="tt-button-secondary" href={`/api/finance/vouchers/export?${filterQuery ? `${filterQuery}&` : ""}format=pdf`}><Download size={16} /> Export PDF</a>
              <a className="tt-button-secondary" href={`/api/finance/vouchers/export?${filterQuery ? `${filterQuery}&` : ""}format=xlsx`}><Download size={16} /> Export Excel</a>
              <button className="tt-button-secondary" onClick={() => window.print()}><Printer size={16} /> Print</button>
            </div>
          </div>
        </section>

        <section className="tt-card tt-card-pad space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-600"><Filter size={16} /> Voucher Filters</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Select label="School/College Name" value={filters.school_id} onChange={(value) => setFilters((current) => ({ ...current, school_id: value }))} options={[{ value: "", label: "All Schools/Colleges" }, ...(options.schools || []).map((row) => ({ value: String(row.id), label: row.school_name }))]} />
            <Select label="Academic Year" value={filters.academic_year_id} onChange={(value) => setFilters((current) => ({ ...current, academic_year_id: value }))} options={[{ value: "", label: "All Academic Years" }, ...(options.academicYears || []).map((row) => ({ value: String(row.id), label: row.academic_year }))]} />
            <Select label="Voucher Status" value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value }))} options={[{ value: "", label: "All Statuses" }, ...(options.statuses || []).map((value) => ({ value, label: value.replaceAll("_", " ") }))]} />
            <Input label="Search" value={filters.q} onChange={(value) => setFilters((current) => ({ ...current, q: value }))} placeholder="Paid to, voucher no, reference" />
            <Select label="Expense Category" value={filters.category} onChange={(value) => setFilters((current) => ({ ...current, category: value }))} options={[{ value: "", label: "All Categories" }, { value: "SALARY", label: "Salary" }, { value: "BUS_FUEL", label: "Bus Fuel" }, { value: "MAINTENANCE", label: "Maintenance" }, { value: "UTILITIES", label: "Utilities" }, { value: "TRANSPORT", label: "Transport" }, { value: "MISCELLANEOUS", label: "Miscellaneous" }]} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="tt-button" onClick={() => void load()}><Filter size={16} /> Apply Filters</button>
            <button className="tt-button-secondary" onClick={() => setFilters(initialFilterState)}>Clear Filters</button>
          </div>
        </section>

        <section className="tt-card tt-card-pad space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-600"><Plus size={16} /> New Expense Voucher</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input label="Voucher Number" value="Auto-generated on save" disabled />
            <Input label="Voucher Date" inputType="date" value={form.voucher_date} onChange={(value) => setForm((current) => ({ ...current, voucher_date: value }))} />
            <Select label="School/College" value={form.school_id} onChange={(value) => setForm((current) => ({ ...current, school_id: value }))} options={[{ value: "", label: "Select School/College" }, ...(options.schools || []).map((row) => ({ value: String(row.id), label: row.school_name }))]} />
            <Select label="Academic Year" value={form.academic_year_id} onChange={(value) => setForm((current) => ({ ...current, academic_year_id: value }))} options={[{ value: "", label: "Select Year" }, ...(options.academicYears || []).map((row) => ({ value: String(row.id), label: row.academic_year }))]} />
            <Select label="Expense Category" value={form.expense_category} onChange={(value) => setForm((current) => ({ ...current, expense_category: value }))} options={[{ value: "SALARY", label: "Salary" }, { value: "BUS_FUEL", label: "Bus Fuel" }, { value: "ADVANCE", label: "Advance Payment" }, { value: "REIMBURSEMENT", label: "Reimbursement" }, { value: "UTILITIES", label: "Utility Payment" }, { value: "TRANSPORT", label: "Transport Payment" }, { value: "MAINTENANCE", label: "Maintenance" }, { value: "CUSTOM", label: "Custom" }]} />
            <Input label="Paid To" value={form.paid_to} onChange={(value) => setForm((current) => ({ ...current, paid_to: value }))} />
            <Input label="Mobile Number" value={form.mobile_number} onChange={(value) => setForm((current) => ({ ...current, mobile_number: value }))} />
            <Input label="Amount" inputMode="decimal" value={form.amount} onChange={(value) => setForm((current) => ({ ...current, amount: value }))} />
            <Input label="Amount in Words" value={form.amount_in_words} onChange={(value) => setForm((current) => ({ ...current, amount_in_words: value }))} />
            <Select label="Payment Mode" value={form.payment_mode} onChange={(value) => setForm((current) => ({ ...current, payment_mode: value }))} options={["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "NET_BANKING"].map((value) => ({ value, label: value.replaceAll("_", " ") }))} />
            <Input label="Reference Number" value={form.reference_number} onChange={(value) => setForm((current) => ({ ...current, reference_number: value }))} />
            <Select label="Workflow Status" value={form.voucher_status} onChange={(value) => setForm((current) => ({ ...current, voucher_status: value }))} options={[{ value: "DRAFT", label: "Draft" }, { value: "SUBMITTED", label: "Submitted" }, { value: "APPROVED", label: "Approved" }, { value: "PAID", label: "Paid" }, { value: "CANCELLED", label: "Cancelled" }]} />
            <Input label="Receiver Name" value={form.receiver_name} onChange={(value) => setForm((current) => ({ ...current, receiver_name: value }))} />
          </div>
          <Textarea label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
          <Textarea label="Purpose" value={form.purpose} onChange={(value) => setForm((current) => ({ ...current, purpose: value }))} />
          <Textarea label="Remarks" value={form.remarks} onChange={(value) => setForm((current) => ({ ...current, remarks: value }))} />
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Supporting Document 1</span>
              <input className="input" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={(event) => setForm((current) => ({ ...current, attachment_1: event.target.files?.[0] || null }))} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-500">Supporting Document 2</span>
              <input className="input" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={(event) => setForm((current) => ({ ...current, attachment_2: event.target.files?.[0] || null }))} />
            </label>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
              Workflow: <strong>Draft → Submitted → Approved → Paid → Cancelled</strong>
            </div>
            <button className="tt-button" disabled={saving} onClick={createVoucher}><Upload size={16} /> {saving ? "Saving..." : "Save Voucher"}</button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Voucher Count" value={String(summary.voucherCount || rows.length)} />
          <MetricCard title="Paid Expense" value={money(summary.paidExpense)} />
          <MetricCard title="Pending Expense" value={money(summary.pendingExpense)} />
        </section>

        <section className="tt-card tt-card-pad">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-amber-700">Voucher Register</p>
              <h2 className="text-2xl font-black text-slate-950">Latest records</h2>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">Total Records: {summary.voucherCount || rows.length}</div>
          </div>

          {loading ? (
            <p className="mt-4 text-sm font-semibold text-slate-600">Loading vouchers...</p>
          ) : rows.length === 0 ? (
            <p className="mt-4 text-sm font-semibold text-slate-600">No vouchers found for the selected filters.</p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-3 pr-4">Voucher Date</th>
                    <th className="py-3 pr-4">Voucher No</th>
                    <th className="py-3 pr-4">Paid To</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-semibold">{dateText(row.voucher_date || row.expense_date)}</td>
                      <td className="py-3 pr-4 font-black">{row.voucher_number || "-"}</td>
                      <td className="py-3 pr-4">{row.paid_to || row.vendor_name || "-"}</td>
                      <td className="py-3 pr-4">{String(row.category || "-").replaceAll("_", " ")}</td>
                      <td className="py-3 pr-4 font-black">{money(row.amount)}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-900">
                          {String(row.voucher_status || "-").replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {row.voucher_status === "DRAFT" ? <button className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-black text-sky-700" onClick={() => updateVoucher(Number(row.id), "SUBMITTED")}>Submit</button> : null}
                          {row.voucher_status === "SUBMITTED" ? (
                            <>
                              <button className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700" onClick={() => updateVoucher(Number(row.id), "APPROVED")}>Approve</button>
                              <button className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700" onClick={() => updateVoucher(Number(row.id), "CANCELLED")}>Cancel</button>
                            </>
                          ) : null}
                          {row.voucher_status === "APPROVED" ? <button className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700" onClick={() => updateVoucher(Number(row.id), "PAID")}>Mark Paid</button> : null}
                          {row.supporting_documents ? <a className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-black text-slate-700" href={Array.isArray(row.supporting_documents) && row.supporting_documents[0]?.url ? row.supporting_documents[0].url : "#"} target="_blank" rel="noreferrer">View Docs</a> : null}
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

function KpiSmall({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[140px] rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
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

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value || option.label} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function Input({ label, value, onChange, inputType, placeholder, inputMode, disabled = false }: { label: string; value: string; onChange?: (value: string) => void; inputType?: "text" | "date" | "number" | "search" | "email" | "tel" | "url"; placeholder?: string; inputMode?: string; disabled?: boolean; }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <input className="input" {...({ type: inputType || "text", inputMode, placeholder, value, disabled, onChange: (event: any) => onChange?.(event.target.value) } as any)} />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span>
      <textarea className="input min-h-24" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
