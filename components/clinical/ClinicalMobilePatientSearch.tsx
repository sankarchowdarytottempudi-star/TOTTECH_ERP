"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Phone,
  Search,
  UserRound,
} from "lucide-react";

type Patient = Record<string, unknown>;

export default function ClinicalMobilePatientSearch({
  onSelectPatient,
  compact = false,
}: {
  onSelectPatient?: (patient: Patient) => void;
  compact?: boolean;
}) {
  const [mobile, setMobile] =
    useState("");
  const [patients, setPatients] =
    useState<Patient[]>([]);
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const digits = mobile.replace(
      /\D/g,
      ""
    );

    if (digits.length < 3) {
      setPatients([]);
      return;
    }

    const timer =
      window.setTimeout(async () => {
        setLoading(true);

        try {
          const response = await fetch(
            `/api/clinical/mobile-search?mobile=${encodeURIComponent(digits)}`
          );

          if (response.ok) {
            const payload =
              await response.json();
            setPatients(
              payload.patients || []
            );
          }
        } finally {
          setLoading(false);
        }
      }, 250);

    return () =>
      window.clearTimeout(timer);
  }, [mobile]);

  return (
    <section className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
          <Phone size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#8a6500]">
            Mobile Number Discovery
          </p>
          {!compact ? (
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
              Find every patient linked to the same mobile number before creating duplicates.
            </p>
          ) : null}
        </div>
      </div>

      <label className="mt-4 flex min-h-12 items-center gap-2 rounded-[8px] border border-[#D4AF37]/45 bg-white px-3">
        <Search
          size={16}
          className="text-[#8a6500]"
        />
        <input
          value={mobile}
          onChange={(event) =>
            setMobile(event.target.value)
          }
          placeholder="Enter mobile number"
          className="min-w-0 flex-1 bg-transparent py-3 text-sm font-bold outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="mt-3 space-y-2">
        {loading ? (
          <p className="rounded-[8px] bg-white p-3 text-sm font-black text-slate-600">
            Searching linked patients...
          </p>
        ) : null}
        {patients.map((patient) => (
          <article
            key={String(patient.id)}
            className="rounded-[8px] border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="break-words text-sm font-black text-[#04142E]">
                  {String(
                    patient.patient_name ||
                      "Patient"
                  )}
                </p>
                <p className="mt-1 break-words text-xs font-bold text-slate-600">
                  {String(
                    patient.uhid ||
                      patient.patient_uid ||
                      "No MRN"
                  )}{" "}
                  | Age{" "}
                  {String(
                    patient.age || "-"
                  )}{" "}
                  |{" "}
                  {String(
                    patient.gender || "-"
                  )}
                </p>
                <p className="mt-1 text-xs font-black uppercase text-[#8a6500]">
                  {String(
                    patient.relationship ||
                      "Linked Patient"
                  )}
                </p>
                <div className="mt-2 grid gap-1 text-[11px] font-bold text-slate-600 sm:grid-cols-2">
                  <span>
                    Latest Visit:{" "}
                    {String(
                      patient.latest_visit_date ||
                        "No visit"
                    )}
                  </span>
                  <span>
                    Status:{" "}
                    {String(
                      patient.latest_visit_status ||
                        "-"
                    )}
                  </span>
                  <span>
                    Rx:{" "}
                    {String(
                      patient.latest_prescription_uid ||
                        "No prescription"
                    )}
                  </span>
                  <span>
                    Lab Reports:{" "}
                    {String(
                      patient.lab_report_count ||
                        0
                    )}
                  </span>
                  <span>
                    Radiology:{" "}
                    {String(
                      patient.radiology_record_count ||
                        0
                    )}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {onSelectPatient ? (
                  <button
                    type="button"
                    onClick={() =>
                      onSelectPatient(
                        patient
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-3 py-2 text-xs font-black text-white"
                  >
                    <UserRound size={14} />
                    Select
                  </button>
                ) : null}
                <Link
                  href={String(
                    patient.patient_360_href ||
                      `/clinical-services/patients/${patient.id}`
                  )}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E]"
                >
                  Open Patient 360
                </Link>
              </div>
            </div>
          </article>
        ))}
        {mobile.replace(/\D/g, "").length >=
          3 &&
        !loading &&
        !patients.length ? (
          <p className="rounded-[8px] border border-dashed border-[#D4AF37]/50 bg-white p-3 text-sm font-bold text-slate-600">
            No linked patient found. Use quick registration before booking if this is a new patient.
          </p>
        ) : null}
      </div>
    </section>
  );
}
