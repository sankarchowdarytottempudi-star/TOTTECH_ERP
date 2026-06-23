"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  Filter,
  Printer,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";

type Row = Record<string, unknown>;

type Payload = {
  patient?: Row;
  events?: Row[];
  filters?: {
    eventTypes?: string[];
  };
};

const text = (value: unknown) =>
  String(value ?? "").trim();

export default function PatientTimelinePage() {
  const params = useParams<{ id: string }>();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [query, setQuery] = useState("");
  const [eventType, setEventType] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Row | null>(null);
  const [message, setMessage] = useState("");

  const patientName = useMemo(() => {
    const patient = payload?.patient || {};
    return (
      `${patient.first_name || ""} ${patient.last_name || ""}`.trim() ||
      "Patient"
    );
  }, [payload]);

  const load = async () => {
    setLoading(true);
    const url = new URLSearchParams();
    if (query.trim()) {
      url.set("q", query.trim());
    }
    if (eventType) {
      url.set("eventType", eventType);
    }
    const response = await fetch(
      `/api/clinical/patients/${params?.id}/timeline?${url.toString()}`
    );
    if (response.ok) {
      setPayload(await response.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 150);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, query, eventType]);

  const events = payload?.events || [];
  const eventTypes =
    payload?.filters?.eventTypes ||
    Array.from(
      new Set(
        events.map((event) => text(event.event_type)).filter(Boolean)
      )
    );

  const printTimeline = () => {
    window.print();
  };

  const registerPdf = async () => {
    const response = await fetch(
      `/api/clinical/patients/${params?.id}/timeline`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType: "Patient Timeline PDF",
          title: `${patientName} Timeline Export`,
        }),
      }
    );
    if (response.ok) {
      setMessage(
        "Timeline PDF export registered in document repository."
      );
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-5 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/35 bg-[#04142E] p-6 text-white shadow-sm print:bg-white print:text-[#04142E]">
          <Link
            href={`/clinical-services/patients/${params?.id}`}
            className="text-sm font-black text-[#D4AF37]"
          >
            Back to Patient 360
          </Link>
          <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
                Patient Timeline
              </p>
              <h1 className="mt-2 text-4xl font-black">
                {patientName}
              </h1>
              <p className="mt-2 text-sm font-semibold text-white/85">
                Chronological clinical, operational, billing, document, and audit events.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button
                onClick={load}
                className="inline-flex items-center gap-2 rounded-[8px] border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={printTimeline}
                className="inline-flex items-center gap-2 rounded-[8px] border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white"
              >
                <Printer size={16} />
                Print
              </button>
              <a
                href={`/api/clinical/patients/${params?.id}/timeline?export=csv`}
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#D4AF37] px-4 py-3 text-sm font-black text-[#04142E]"
              >
                <Download size={16} />
                CSV
              </a>
              <button
                onClick={registerPdf}
                className="inline-flex items-center gap-2 rounded-[8px] bg-white px-4 py-3 text-sm font-black text-[#04142E]"
              >
                <FileText size={16} />
                Export PDF
              </button>
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-800 print:hidden">
            {message}
          </div>
        ) : null}

        <section className="grid gap-3 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_260px] print:hidden">
          <label className="relative block">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-12 w-full rounded-[8px] border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
              placeholder="Search timeline events, descriptions, source..."
            />
          </label>
          <label className="relative block">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              className="min-h-12 w-full rounded-[8px] border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
            >
              <option value="">All event types</option>
              {eventTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          {loading ? (
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 text-sm font-black text-slate-600">
              Loading patient timeline...
            </div>
          ) : events.length ? (
            <div className="relative space-y-4 before:absolute before:left-5 before:top-2 before:h-full before:w-px before:bg-[#D4AF37]/40">
              {events.map((event) => (
                <button
                  key={String(event.id)}
                  onClick={() => setSelected(event)}
                  className="relative grid w-full grid-cols-[44px_1fr] gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[#D4AF37] hover:bg-white hover:shadow-md"
                >
                  <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-[#D4AF37] bg-[#04142E] text-sm font-black text-[#D4AF37]">
                    {text(event.event_type).slice(0, 1) || "E"}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-black uppercase text-[#735300]">
                      {text(event.event_type)} | {text(event.event_source)}
                    </span>
                    <span className="mt-1 block break-words text-lg font-black text-[#04142E]">
                      {text(event.title)}
                    </span>
                    <span className="mt-1 block break-words text-sm font-semibold leading-6 text-slate-600">
                      {text(event.description) || "No additional details."}
                    </span>
                    <span className="mt-2 block text-xs font-black uppercase text-slate-500">
                      {text(event.event_datetime)}{" "}
                      {text(event.user_name)
                        ? `| ${event.user_name}`
                        : ""}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 text-sm font-black text-slate-600">
              No timeline events found for this patient.
            </div>
          )}
        </section>

        {selected ? (
          <div className="fixed inset-0 z-50 bg-black/50 p-4 print:hidden">
            <aside className="ml-auto flex h-full max-w-xl flex-col rounded-[8px] bg-white shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                <div>
                  <p className="text-xs font-black uppercase text-[#735300]">
                    Event Details
                  </p>
                  <h2 className="mt-1 break-words text-2xl font-black text-[#04142E]">
                    {text(selected.title)}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-[8px] border border-slate-200 p-2 text-[#04142E]"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
                {[
                  "event_type",
                  "event_source",
                  "source_record_id",
                  "description",
                  "event_datetime",
                  "user_name",
                ].map((key) => (
                  <div
                    key={key}
                    className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-black uppercase text-slate-500">
                      {key.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 break-words text-sm font-black text-[#04142E]">
                      {text(selected[key]) || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </ClinicalShell>
  );
}
