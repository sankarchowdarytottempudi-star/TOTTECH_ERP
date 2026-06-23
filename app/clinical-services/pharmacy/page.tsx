"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Database,
  PackageCheck,
  Pill,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalPatientLookup from "@/components/clinical/ClinicalPatientLookup";
import {
  DashboardCard,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

const asText = (value: unknown, fallback = "-") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

const asList = (value: unknown): Row[] => {
  if (Array.isArray(value)) {
    return value as Row[];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const statusTabs = [
  { key: "PENDING", label: "Pending Prescriptions" },
  { key: "PARTIAL_DISPENSE", label: "Partially Dispensed" },
  { key: "COMPLETED", label: "Dispensed" },
  { key: "RETURNED", label: "Returned Medicines" },
  { key: "ALL", label: "All Queue" },
];

const adminLinks = [
  {
    title: "Medicine Master",
    href: "/clinical-services/pharmacy/medicines",
    icon: Pill,
    summary: "Medicines, strengths, schedules, reorder levels.",
  },
  {
    title: "Drug Categories",
    href: "/clinical-services/pharmacy/categories",
    icon: Database,
    summary: "Drug classifications and controlled categories.",
  },
  {
    title: "Manufacturers / Vendors",
    href: "/clinical-services/pharmacy/vendors",
    icon: Truck,
    summary: "Vendor licenses, contacts and purchase terms.",
  },
  {
    title: "Purchase Orders",
    href: "/clinical-services/pharmacy/purchase-orders",
    icon: ShoppingCart,
    summary: "Purchase order workflow and vendor supply.",
  },
  {
    title: "GRN",
    href: "/clinical-services/pharmacy/grn",
    icon: PackageCheck,
    summary: "Goods receipt, batch inward and invoice capture.",
  },
  {
    title: "Stock / Batch / Expiry",
    href: "/clinical-services/pharmacy/inventory",
    icon: Boxes,
    summary: "Stock quantity, batch tracking and expiry control.",
  },
  {
    title: "Reorder Levels",
    href: "/clinical-services/pharmacy/reorder",
    icon: AlertTriangle,
    summary: "Low stock rules and reorder review.",
  },
];

export default function ClinicalPharmacyPage() {
  const [status, setStatus] = useState("PENDING");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      status,
    });

    if (query.trim()) {
      params?.set("q", query.trim());
    }

    try {
      const response = await fetch(
        `/api/clinical/operations/pharmacy-dispense?${params?.toString()}`
      );

      if (response.ok) {
        const payload = await response.json();
        setRows(payload.rows || []);
      }
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 150);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    const requestedStatus = new URLSearchParams(window.location.search).get("status");
    if (requestedStatus) setStatus(requestedStatus);
  }, []);

  const counts = useMemo(
    () => ({
      pending: rows.filter((row) => asText(row.status) === "PENDING").length,
      partial: rows.filter((row) => asText(row.status) === "PARTIAL_DISPENSE").length,
      completed: rows.filter((row) => asText(row.status) === "COMPLETED").length,
      returned: rows.filter((row) => asText(row.status) === "RETURNED").length,
      total: rows.length,
    }),
    [rows]
  );

  const dispense = async (row: Row, dispenseStatus: string) => {
    setSavingId(Number(row.id));

    try {
      const response = await fetch("/api/clinical/operations/pharmacy-dispense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queue_id: row.id,
          dispense_status: dispenseStatus,
          notes: `${dispenseStatus.replaceAll("_", " ")} from pharmacy counter`,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Unable to dispense prescription.");
      }

      notify.success("Pharmacy queue updated");
      await load();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Unable to dispense prescription.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/45 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Pharmacy Operating Model
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Administration + Dispensing Counter
          </h1>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-white/90">
            Pharmacy administration manages medicines, vendors, purchasing,
            batches, expiry and reorder rules. The dispensing counter starts
            from doctor prescriptions and never asks the pharmacist to search
            internal appointment IDs.
          </p>
        </section>

        <ClinicalPatientLookup
          title="Pharmacy Patient Lookup"
          description="Find a patient by name, mobile number, UHID/MRN, or ABHA. Open Patient 360 or filter the prescription queue using the same value."
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Pending"
            value={counts.pending}
            icon={ClipboardList}
            drillDownUrl="/clinical-services/pharmacy?status=PENDING"
            caption="Awaiting pharmacist verification"
            refresh={load}
          />
          <DashboardCard
            title="Partial"
            value={counts.partial}
            icon={AlertTriangle}
            drillDownUrl="/clinical-services/pharmacy?status=PARTIAL_DISPENSE"
            caption="Partially dispensed prescriptions"
            refresh={load}
          />
          <DashboardCard
            title="Dispensed"
            value={counts.completed}
            icon={CheckCircle2}
            drillDownUrl="/clinical-services/pharmacy?status=COMPLETED"
            caption="Completed handoffs"
            refresh={load}
          />
          <DashboardCard
            title="Returns"
            value={counts.returned}
            icon={RotateCcw}
            drillDownUrl="/clinical-services/pharmacy?status=RETURNED"
            caption="Returned medicines queue"
            refresh={load}
          />
          <DashboardCard
            title="Admin Areas"
            value={adminLinks.length}
            icon={Database}
            drillDownUrl="/clinical-services/pharmacy/medicines"
            caption="Master, purchase and inventory"
            refresh={load}
          />
        </section>

        <QuickActionsPanel
          actions={[
            {
              label: "Prescription Queue",
              href: "/clinical-services/pharmacy/prescription-queue",
              icon: ClipboardList,
            },
            {
              label: "Medicine Master",
              href: "/clinical-services/pharmacy/medicines",
              icon: Pill,
            },
            {
              label: "Stock Management",
              href: "/clinical-services/pharmacy/inventory",
              icon: Boxes,
            },
            {
              label: "Purchase Orders",
              href: "/clinical-services/pharmacy/purchase-orders",
              icon: ShoppingCart,
            },
          ]}
        />

        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-[#8a6500]">
                  Pharmacy Administration
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#04142E]">
                  Masters, Purchasing and Stock
                </h2>
              </div>
              <Database className="text-[#D4AF37]" />
            </div>
            <div className="mt-5 grid gap-3">
              {adminLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-[8px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-[#04142E]">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-600">
                          {item.summary}
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </article>

          <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase text-[#8a6500]">
                  Pharmacy Dispensing Counter
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#04142E]">
                  Doctor Prescription Handoff
                </h2>
              </div>
              <button
                type="button"
                onClick={load}
                className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-[#04142E] transition hover:border-[#D4AF37]"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px]">
              <label className="relative block">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-h-12 w-full rounded-[8px] border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
                  placeholder="Search patient name, mobile, UHID/MRN, prescription"
                />
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="min-h-12 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
              >
                {statusTabs.map((tab) => (
                  <option key={tab.key} value={tab.key}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 space-y-4">
              {loading ? (
                <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 text-sm font-black text-slate-600">
                  Loading pharmacy queue...
                </div>
              ) : null}

              {!loading && !rows.length ? (
                <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-bold text-slate-600">
                  No prescriptions found for this queue filter.
                </div>
              ) : null}

              {rows.map((row) => {
                const medications = asList(row.medications).length
                  ? asList(row.medications)
                  : asList(row.prescription_medications);

                return (
                  <article
                    key={String(row.id)}
                    className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.08em] text-[#735300]">
                          {asText(row.queue_number)} / {asText(row.prescription_uid)}
                        </p>
                        <h3 className="mt-1 break-words text-xl font-black text-[#04142E]">
                          {asText(row.registered_patient_name || row.patient_name, "Patient")}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          {asText(row.uhid || row.patient_uid, "No UHID/MRN")} |{" "}
                          {asText(row.phone || row.patient_mobile, "No mobile")} | Dr.{" "}
                          {asText(row.doctor_name, "Not assigned")}
                        </p>
                      </div>
                      <span className="rounded-[8px] border border-[#D4AF37]/45 bg-[#fff4df] px-3 py-2 text-xs font-black uppercase text-[#735300]">
                        {asText(row.status)}
                      </span>
                    </div>

                    <div className="mt-4 rounded-[8px] border border-slate-200 bg-white p-3">
                      <p className="text-xs font-black uppercase text-[#8a6500]">
                        Doctor Prescribed Medicines
                      </p>
                      <div className="mt-3 grid gap-2">
                        {medications.length ? (
                          medications.map((medicine, index) => (
                            <div
                              key={`${row.id}-${index}`}
                              className="grid gap-2 rounded-[8px] bg-slate-50 p-3 text-xs font-bold text-slate-700 md:grid-cols-5"
                            >
                              <span className="font-black text-[#04142E]">
                                {asText(medicine.name || medicine.medicine_name || medicine.medicine)}
                              </span>
                              <span>Dosage: {asText(medicine.dosage || medicine.dose)}</span>
                              <span>Frequency: {asText(medicine.frequency)}</span>
                              <span>Duration: {asText(medicine.duration)}</span>
                              <span>Qty: {asText(medicine.quantity || medicine.qty)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-[8px] bg-slate-50 p-3 text-xs font-bold text-slate-600">
                            No structured medicine lines found. Open the prescription to review source details.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={savingId === Number(row.id)}
                        onClick={() => dispense(row, "DISPENSED")}
                        className="rounded-[8px] bg-[#04142E] px-3 py-2 text-xs font-black text-white disabled:opacity-60"
                      >
                        Dispense Medicines
                      </button>
                      <button
                        type="button"
                        disabled={savingId === Number(row.id)}
                        onClick={() => dispense(row, "PARTIAL_DISPENSE")}
                        className="rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#735300] disabled:opacity-60"
                      >
                        Partially Dispense
                      </button>
                      <button
                        type="button"
                        disabled={savingId === Number(row.id)}
                        onClick={() => dispense(row, "OUT_OF_STOCK")}
                        className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-800 disabled:opacity-60"
                      >
                        Out of Stock
                      </button>
                      <button
                        type="button"
                        disabled={savingId === Number(row.id)}
                        onClick={() => dispense(row, "RETURNED")}
                        className="rounded-[8px] border border-[#D4AF37]/50 bg-white px-3 py-2 text-xs font-black text-[#735300] disabled:opacity-60"
                      >
                        Return Medicines
                      </button>
                      {row.patient_id ? (
                        <Link
                          href={`/clinical-services/patients/${row.patient_id}`}
                          className="rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E]"
                        >
                          Patient 360
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </ClinicalShell>
  );
}
