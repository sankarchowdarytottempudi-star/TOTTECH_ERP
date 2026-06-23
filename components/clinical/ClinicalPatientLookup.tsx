"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Phone,
  Search,
  UserRound,
} from "lucide-react";

type Patient = Record<string, unknown>;

const asText = (value: unknown, fallback = "-") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

export default function ClinicalPatientLookup({
  title = "Patient Search",
  description = "Search by patient name first, or use mobile number, UHID/MRN, or ABHA when needed.",
  compact = false,
  onSelectPatient,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
  onSelectPatient?: (patient: Patient) => void;
}) {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    const digits = trimmed.replace(/\D/g, "");

    if (trimmed.length < 2 && digits.length < 4) {
      setPatients([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/clinical/patient-lookup?q=${encodeURIComponent(trimmed)}`
        );

        if (response.ok) {
          const payload = await response.json();
          setPatients(payload.patients || []);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <section className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
          <Search size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
            {title}
          </p>
          {!compact ? (
            <p className="mt-1 text-xs font-bold leading-5 text-slate-700">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <label className="mt-4 flex min-h-12 items-center gap-2 rounded-[8px] border border-[#D4AF37]/45 bg-white px-3">
        <Search size={16} className="shrink-0 text-[#8a6500]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search patient name, mobile, UHID/MRN, ABHA"
          className="min-w-0 flex-1 bg-transparent py-3 pl-1 text-sm font-bold text-[#04142E] outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="mt-3 space-y-2">
        {loading ? (
          <p className="rounded-[8px] bg-white p-3 text-sm font-black text-slate-600">
            Searching patients...
          </p>
        ) : null}

        {patients.map((patient) => (
          <article
            key={String(patient.id)}
            className="rounded-[8px] border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="break-words text-sm font-black text-[#04142E]">
                  {asText(patient.patient_name, "Patient")}
                </p>
                <p className="mt-1 break-words text-xs font-bold text-slate-600">
                  {asText(patient.uhid || patient.patient_uid, "No UHID/MRN")} |{" "}
                  {asText(patient.gender)} | Age {asText(patient.age)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-black">
                  <span className="inline-flex items-center gap-1 rounded-[8px] bg-slate-50 px-2 py-1 text-slate-700">
                    <Phone size={12} />
                    {asText(patient.phone || patient.whatsapp_number, "No mobile")}
                  </span>
                  {patient.appointment_id ? (
                    <span className="inline-flex items-center gap-1 rounded-[8px] bg-[#fff9e8] px-2 py-1 text-[#735300]">
                      <CalendarDays size={12} />
                      {asText(patient.appointment_status)} /{" "}
                      {asText(patient.queue_status)}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {onSelectPatient ? (
                  <button
                    type="button"
                    onClick={() => onSelectPatient(patient)}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-3 py-2 text-xs font-black text-white"
                  >
                    <UserRound size={14} />
                    Select
                  </button>
                ) : null}
                <Link
                  href={`/clinical-services/patients/${patient.id}`}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E] transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
                >
                  Open Patient 360
                </Link>
                {patient.appointment_id ? (
                  <Link
                    href={`/clinical-services/doctors/consultation/${patient.appointment_id}`}
                    className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E] transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
                  >
                    Doctor View
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}

        {query.trim().length >= 2 && !loading && !patients.length ? (
          <p className="rounded-[8px] border border-dashed border-[#D4AF37]/50 bg-white p-3 text-sm font-bold text-slate-600">
            No matching patient found for this hospital context.
          </p>
        ) : null}
      </div>
    </section>
  );
}
