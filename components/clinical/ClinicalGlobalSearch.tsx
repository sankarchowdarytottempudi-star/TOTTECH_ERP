"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

type Row = Record<string, unknown>;

export default function ClinicalGlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/clinical/global-search?q=${encodeURIComponent(query)}`
        );

        if (response.ok) {
          const payload = await response.json();
          setResults(payload.results || []);
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative min-w-0 flex-1">
      <label className="relative flex min-h-11 items-center rounded-[8px] border border-slate-300 bg-white focus-within:border-[#D4AF37]">
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 shrink-0 text-[#8a6500]"
        />
        <input
          value={query}
          onFocus={() => setOpen(Boolean(results.length))}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 pl-10 pr-3 text-sm font-bold outline-none placeholder:text-slate-400"
          placeholder="Search patient, mobile, MRN, ABHA, doctor, appointment..."
        />
      </label>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[70vh] overflow-y-auto rounded-[8px] border border-slate-200 bg-white p-2 shadow-2xl">
          {loading ? (
            <p className="rounded-[8px] bg-slate-50 p-3 text-sm font-black text-slate-600">
              Searching clinical records...
            </p>
          ) : null}
          {!loading && !results.length ? (
            <p className="rounded-[8px] bg-slate-50 p-3 text-sm font-black text-slate-600">
              No records found.
            </p>
          ) : null}
          {results.slice(0, 15).map((row, index) => (
            <Link
              key={`${row.result_type}-${row.id}-${index}`}
              href={String(row.href || "/clinical-services")}
              onClick={() => setOpen(false)}
              className="block rounded-[8px] p-3 transition hover:bg-[#fff9e8]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-black text-[#04142E]">
                    {String(row.title || "Clinical result")}
                  </p>
                  <p className="mt-1 break-words text-xs font-bold text-slate-600">
                    {String(row.subtitle || "-")}
                  </p>
                  {String(row.result_type || "") === "Patient" ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black uppercase">
                      <span className="rounded-[8px] bg-slate-100 px-2 py-1 text-slate-700">
                        Visit {String(row.latest_visit_status || "-")}
                      </span>
                      <span className="rounded-[8px] bg-slate-100 px-2 py-1 text-slate-700">
                        Rx {String(row.latest_prescription_uid || "None")}
                      </span>
                      <span className="rounded-[8px] bg-slate-100 px-2 py-1 text-slate-700">
                        Lab {String(row.lab_report_count || 0)}
                      </span>
                      <span className="rounded-[8px] bg-slate-100 px-2 py-1 text-slate-700">
                        Radiology {String(row.radiology_record_count || 0)}
                      </span>
                    </div>
                  ) : null}
                </div>
                <span className="shrink-0 rounded-[8px] border border-[#D4AF37]/45 bg-[#fff9e8] px-2 py-1 text-[11px] font-black uppercase text-[#735300]">
                  {String(row.result_type || "Record")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
