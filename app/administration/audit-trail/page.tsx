"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";

type Row = Record<string, unknown>;

const text = (value: unknown) =>
  String(value ?? "").trim();

export default function ClinicalAuditTrailPage() {
  const [events, setEvents] = useState<Row[]>([]);
  const [moduleName, setModuleName] = useState("");
  const [userId, setUserId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (moduleName) params?.set("module", moduleName);
    if (userId) params?.set("userId", userId);
    if (patientId) params?.set("patientId", patientId);
    if (from) params?.set("from", from);
    if (to) params?.set("to", to);

    const response = await fetch(
      `/api/clinical/administration/audit-trail?${params?.toString()}`
    );
    if (response.ok) {
      const body = await response.json();
      setEvents(body.events || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 150);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleName, userId, patientId, from, to]);

  return (
    <ClinicalShell>
      <div className="space-y-5 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/35 bg-[#04142E] p-6 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Security & Compliance
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Audit Trail
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-white/85">
            Filter create, update, delete, approve, print, download, login, and logout activity by user, patient, module, hospital, branch, and date.
          </p>
        </section>

        <section className="grid gap-3 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5">
          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-600">
              <Filter size={14} />
              Module
            </span>
            <input
              value={moduleName}
              onChange={(event) => setModuleName(event.target.value)}
              className="min-h-12 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-bold text-[#04142E]"
              placeholder="consultations"
            />
          </label>
          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-600">
              <Search size={14} />
              User ID
            </span>
            <input
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="min-h-12 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-bold text-[#04142E]"
              placeholder="User"
            />
          </label>
          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-600">
              <Search size={14} />
              Patient ID
            </span>
            <input
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              className="min-h-12 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-bold text-[#04142E]"
              placeholder="Patient"
            />
          </label>
          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-600">
              <CalendarDays size={14} />
              From
            </span>
            <input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="min-h-12 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-bold text-[#04142E]"
            />
          </label>
          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-600">
              <CalendarDays size={14} />
              To
            </span>
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="min-h-12 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-bold text-[#04142E]"
            />
          </label>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-[#735300]">
                Audit Events
              </p>
              <h2 className="text-2xl font-black text-[#04142E]">
                {events.length} records
              </h2>
            </div>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-[#04142E]"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 text-sm font-black text-slate-600">
              Loading audit trail...
            </div>
          ) : events.length ? (
            <div className="space-y-3">
              {events.map((event) => (
                <article
                  key={String(event.id)}
                  className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#735300]">
                        <ShieldCheck size={14} />
                        {text(event.action)} | {text(event.module_name)}
                      </p>
                      <h3 className="mt-1 break-words text-lg font-black text-[#04142E]">
                        {text(event.summary) || "Audit event"}
                      </h3>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-600">
                        {text(event.patient_name)}
                        {text(event.patient_uid)
                          ? ` | ${event.patient_uid}`
                          : ""}
                      </p>
                    </div>
                    <p className="text-xs font-black uppercase text-slate-500">
                      {text(event.created_at)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 text-sm font-black text-slate-600">
              No audit records found for the selected filters.
            </div>
          )}
        </section>
      </div>
    </ClinicalShell>
  );
}
