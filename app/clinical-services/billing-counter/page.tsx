"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Download,
  IndianRupee,
  type LucideIcon,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Wallet,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;
type SummaryCard = [title: string, value: string | number, Icon: LucideIcon];

const statuses = [
  ["", "All Bills"],
  ["OPEN", "Pending Bills"],
  ["PARTIAL", "Partially Paid"],
  ["PAID", "Paid Bills"],
  ["CANCELLED", "Cancelled Bills"],
  ["REFUNDED", "Refunded Bills"],
] as const;

const paymentMethods = [
  "Cash",
  "UPI",
  "Card",
  "Net Banking",
  "Insurance",
  "Mixed Payment",
];

const money = (value: unknown) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const asText = (value: unknown) =>
  value === null || value === undefined || value === "" ? "-" : String(value);

export default function BillingCounterPage() {
  const [invoices, setInvoices] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Row>({});
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [sourceModule, setSourceModule] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const [payment, setPayment] = useState({
    amount: "",
    paymentMode: "Cash",
    referenceNumber: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params?.set("status", status);
    if (query.trim()) params?.set("q", query.trim());
    if (sourceModule) params?.set("sourceModule", sourceModule);
    const response = await fetch(`/api/clinical/billing/invoices?${params}`);
    if (response.ok) {
      const payload = await response.json();
      setInvoices(payload.invoices || []);
      setSummary(payload.summary || {});
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 200);
    return () => window.clearTimeout(timer);
  }, [status, query, sourceModule]);

  const balance = Number(selected?.balance_amount ?? selected?.balance ?? 0);

  useEffect(() => {
    if (selected) {
      setPayment((current) => ({
        ...current,
        amount: String(balance || ""),
      }));
    }
  }, [selected?.id]);

  const collect = async () => {
    if (!selected?.id || !selected?.patient_id) {
      notify.error("Select an invoice before collecting payment.");
      return;
    }
    if (Number(selected?.total_amount ?? selected?.total ?? 0) <= 0) {
      notify.error("This invoice has no billable amount. Generate billable line items before collecting payment.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/clinical/billing/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "payment",
          invoiceId: selected.id,
          patientId: selected.patient_id,
          amount: payment.amount,
          paymentMode: payment.paymentMode,
          referenceNumber: payment.referenceNumber,
          remarks: payment.remarks,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Failed to collect payment.");
      notify.success("Payment collected and receipt generated.");
      setSelected(null);
      setPayment({
        amount: "",
        paymentMode: "Cash",
        referenceNumber: "",
        remarks: "",
      });
      await load();
      window.open(`/api/clinical/documents/render/payment-receipt/${payload.id}`, "_blank");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Failed to collect payment.");
    } finally {
      setSaving(false);
    }
  };

  const cards = useMemo<SummaryCard[]>(
    () => [
      ["Pending Bills", Number(summary.pendingCount || 0), Receipt],
      ["Paid Bills", Number(summary.paidCount || 0), Wallet],
      ["Partially Paid", Number(summary.partialCount || 0), CreditCard],
      ["Balance", money(summary.balance), IndianRupee],
    ],
    [summary]
  );

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Front Desk Billing Counter
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Billing, Collections & Receipts
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-white/90">
            Collect consultation, lab, radiology, pharmacy, IP, OT and IVF payments from generated invoices. Lab status changes never create or modify bills.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(([title, value, Icon]) => (
            <div key={String(title)} className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  {String(title)}
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-5 text-3xl font-black text-[#04142E]">
                {String(value)}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_120px]">
            <label className="flex min-h-12 items-center gap-3 rounded-[8px] border border-slate-300 px-4 focus-within:border-[#D4AF37]">
              <Search size={18} className="text-[#8a6500]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search invoice, patient name or UHID..."
                className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
              />
            </label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-[8px] border border-slate-300 px-3 text-sm font-bold">
              {statuses.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select value={sourceModule} onChange={(event) => setSourceModule(event.target.value)} className="rounded-[8px] border border-slate-300 px-3 text-sm font-bold">
              <option value="">All Departments</option>
              <option value="consultations">Consultation</option>
              <option value="laboratory">Lab</option>
              <option value="radiology">Radiology</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="ipd">IP</option>
              <option value="ot">OT</option>
              <option value="ivf">IVF</option>
            </select>
            <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-white">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-[#04142E]">Invoices</h2>
            <div className="mt-4 overflow-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    <th className="p-3">Invoice</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Paid</th>
                    <th className="p-3">Balance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={asText(invoice.id)}
                      onClick={() => setSelected(invoice)}
                      className={`cursor-pointer border-b border-slate-100 transition hover:bg-[#fff9e8] ${selected?.id === invoice.id ? "bg-[#fff9e8]" : ""}`}
                    >
                      <td className="p-3 font-black text-[#04142E]">{asText(invoice.invoice_number)}</td>
                      <td className="p-3 font-bold">{asText(invoice.patient_name)}</td>
                      <td className="p-3 font-bold">{asText(invoice.source_module || invoice.invoice_type)}</td>
                      <td className="p-3 font-black">{money(invoice.total)}</td>
                      <td className="p-3 font-bold">{money(invoice.paid_amount)}</td>
                      <td className="p-3 font-black text-[#8a6500]">{money(invoice.balance_amount ?? invoice.balance)}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-[#04142E] px-3 py-1 text-[11px] font-black text-[#D4AF37]">
                          {asText(invoice.status)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Link onClick={(event) => event.stopPropagation()} href={`/api/clinical/billing/invoices/${invoice.id}/pdf`} target="_blank" className="rounded-[8px] border border-slate-300 px-3 py-2 text-xs font-black text-[#04142E]">
                            <Printer size={14} />
                          </Link>
                          <Link onClick={(event) => event.stopPropagation()} href={`/api/clinical/billing/invoices/${invoice.id}/pdf`} target="_blank" className="rounded-[8px] border border-slate-300 px-3 py-2 text-xs font-black text-[#04142E]">
                            <Download size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!invoices.length ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-sm font-black text-slate-500">
                        {loading ? "Loading bills..." : "No bills found for the selected filter."}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-[#04142E]">Collect Payment</h2>
            {selected ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] p-4">
                  <p className="text-sm font-black text-[#04142E]">{asText(selected.invoice_number)}</p>
                  <p className="mt-1 text-xs font-bold text-slate-600">{asText(selected.patient_name)} | Balance {money(balance)}</p>
                </div>
                <label className="block text-xs font-black uppercase text-slate-500">
                  Amount
                  <input value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold" />
                </label>
                <label className="block text-xs font-black uppercase text-slate-500">
                  Payment Method
                  <select value={payment.paymentMode} onChange={(event) => setPayment({ ...payment, paymentMode: event.target.value })} className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold">
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-black uppercase text-slate-500">
                  Reference Number
                  <input value={payment.referenceNumber} onChange={(event) => setPayment({ ...payment, referenceNumber: event.target.value })} className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold" />
                </label>
                <label className="block text-xs font-black uppercase text-slate-500">
                  Remarks
                  <textarea value={payment.remarks} onChange={(event) => setPayment({ ...payment, remarks: event.target.value })} className="mt-2 min-h-24 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold" />
                </label>
                <button disabled={saving} type="button" onClick={collect} className="w-full rounded-[8px] bg-[#04142E] px-5 py-4 text-sm font-black text-white disabled:opacity-60">
                  {saving ? "Collecting..." : "Collect & Print Receipt"}
                </button>
              </div>
            ) : (
              <p className="mt-4 rounded-[8px] border border-dashed border-slate-300 p-4 text-sm font-bold text-slate-500">
                Select an invoice from the table to collect payment and generate a receipt PDF.
              </p>
            )}
          </aside>
        </section>
      </div>
    </ClinicalShell>
  );
}
