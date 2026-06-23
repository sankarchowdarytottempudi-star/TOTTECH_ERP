"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ClipboardList,
  FlaskConical,
  Pill,
  ScanLine,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import ClinicalMobilePatientSearch from "@/components/clinical/ClinicalMobilePatientSearch";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

const sectionConfig: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: typeof Activity;
  }
> = {
  queue: {
    title: "Consultation Queue",
    subtitle:
      "Checked-in patients waiting for the doctor or assistant to start consultation.",
    icon: ClipboardList,
  },
  active: {
    title: "Active Consultations",
    subtitle:
      "Patients currently in consultation with open doctor workspace records.",
    icon: Stethoscope,
  },
  completed: {
    title: "Completed Consultations",
    subtitle:
      "Closed consultations with saved clinical records and downstream orders.",
    icon: Activity,
  },
  appointments: {
    title: "My Appointments",
    subtitle:
      "Upcoming and recent appointments available for consultation workflow.",
    icon: Activity,
  },
  prescriptions: {
    title: "Prescriptions",
    subtitle:
      "Doctor prescriptions and pharmacy handoff status.",
    icon: Pill,
  },
  "lab-orders": {
    title: "Lab Orders",
    subtitle:
      "Laboratory orders created from consultations and patient care workflows.",
    icon: FlaskConical,
  },
  "radiology-orders": {
    title: "Radiology Orders",
    subtitle:
      "Radiology studies ordered by clinicians and awaiting imaging/reporting.",
    icon: ScanLine,
  },
  "clinical-notes": {
    title: "Clinical Notes",
    subtitle:
      "Saved doctor notes, diagnoses, treatment plans, advice, and observations.",
    icon: ClipboardList,
  },
  "follow-ups": {
    title: "Follow Ups",
    subtitle:
      "Patients with follow-up dates captured during consultation.",
    icon: Activity,
  },
  "patient-history": {
    title: "Patient History",
    subtitle:
      "Patient-level longitudinal view for consultations, orders, and clinical records.",
    icon: UserRound,
  },
};

export default function DoctorSectionPage() {
  const params =
    useParams<{ section: string }>();
  const router = useRouter();
  const section = params?.section || "queue";
  const config =
    sectionConfig[section] ||
    sectionConfig.queue;
  const Icon = config.icon;
  const [rows, setRows] =
    useState<Row[]>([]);
  const [query, setQuery] =
    useState("");
  const [loading, setLoading] =
    useState(true);

  const endpoint = useMemo(
    () =>
      `/api/clinical/doctors/consultations?view=${encodeURIComponent(section)}&q=${encodeURIComponent(query)}`,
    [section, query]
  );

  const load = async () => {
    setLoading(true);
    const response = await fetch(endpoint);

    if (response.ok) {
      const payload =
        await response.json();
      setRows(payload.rows || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void load();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [endpoint]);

  const startConsultation = async (
    row: Row
  ) => {
    const response = await fetch(
      "/api/clinical/doctors/consultations",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          appointment_id: row.id,
        }),
      }
    );
    const payload =
      await response.json();

    if (!response.ok) {
      notify.error(
        payload.error ||
          "Failed to start consultation"
      );
      return;
    }

    notify.success(
      "Consultation started"
    );
    router.push(
      payload.consultation_url ||
        `/clinical-services/doctors/consultation/${row.id}`
    );
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
                Doctors Module
              </p>
              <h1 className="mt-2 break-words text-4xl font-black">
                {config.title}
              </h1>
              <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-white/90">
                {config.subtitle}
              </p>
            </div>
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[8px] border border-[#D4AF37]/50 bg-white/10 text-[#D4AF37]">
              <Icon size={30} />
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
            <label className="flex min-h-12 items-center gap-2 rounded-[8px] border border-slate-300 px-3">
              <Search
                size={17}
                className="text-slate-400"
              />
              <input
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search MRN, mobile, patient, doctor, order..."
                className="min-w-0 flex-1 bg-transparent py-3 text-sm font-bold outline-none"
              />
            </label>
          </div>
          <ClinicalMobilePatientSearch compact />
        </section>

        <section className="space-y-3">
          {loading ? (
            <p className="rounded-[8px] border border-slate-200 bg-white p-4 text-sm font-black text-slate-600">
              Loading doctor workflow records...
            </p>
          ) : null}
          {!loading && !rows.length ? (
            <p className="rounded-[8px] border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600">
              No records found for this view.
            </p>
          ) : null}
          {rows.map((row) => {
            const href = hrefForRow(
              section,
              row
            );

            return (
              <ClinicalRecordCard
                key={`${section}-${String(row.id)}`}
                href={href}
                eyebrow={eyebrowForRow(
                  section,
                  row
                )}
                title={titleForRow(
                  section,
                  row
                )}
                description={descriptionForRow(
                  section,
                  row
                )}
                status={statusForRow(row)}
                metadata={metadataForRow(
                  section,
                  row
                )}
                patientHref={
                  row.patient_id
                    ? `/clinical-services/patients/${row.patient_id}`
                    : undefined
                }
                editHref={href}
                auditHref={`${href}#audit`}
                historyHref={`${href}#history`}
              >
                {[
                  "queue",
                  "appointments",
                ].includes(section) ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void startConsultation(
                        row
                      );
                    }}
                    className="rounded-[8px] bg-[#04142E] px-4 py-2 text-sm font-black text-white transition hover:bg-[#0B1F3A]"
                  >
                    Start Consultation
                  </button>
                ) : null}
              </ClinicalRecordCard>
            );
          })}
        </section>
      </div>
    </ClinicalShell>
  );
}

function hrefForRow(
  section: string,
  row: Row
) {
  if (
    [
      "queue",
      "active",
      "completed",
      "appointments",
    ].includes(section)
  ) {
    return `/clinical-services/doctors/consultation/${row.id}`;
  }

  if (
    section === "clinical-notes" ||
    section === "follow-ups"
  ) {
    return row.appointment_id
      ? `/clinical-services/doctors/consultation/${row.appointment_id}`
      : `/clinical-services/patients/${row.patient_id}`;
  }

  return row.patient_id
    ? `/clinical-services/patients/${row.patient_id}`
    : "/clinical-services/doctors";
}

function eyebrowForRow(
  section: string,
  row: Row
) {
  return String(
    row.token_number ||
      row.appointment_uid ||
      row.prescription_uid ||
      row.order_uid ||
      row.order_number ||
      row.patient_uid ||
      section
  );
}

function titleForRow(
  section: string,
  row: Row
) {
  if (section === "patient-history") {
    return String(
      row.patient_name ||
        `${row.first_name || ""} ${row.last_name || ""}`.trim() ||
        "Patient"
    );
  }

  return String(
    row.patient_name ||
      row.order_type ||
      row.study_type ||
      row.diagnosis ||
      row.chief_complaint ||
      row.prescription_uid ||
      "Clinical Record"
  );
}

function descriptionForRow(
  section: string,
  row: Row
) {
  if (section === "patient-history") {
    return `Appointments ${row.appointment_count || 0} | Consultations ${row.consultation_count || 0} | Prescriptions ${row.prescription_count || 0}`;
  }

  return [
    row.doctor_name,
    row.department_name,
    row.phone,
    row.start_time,
    row.follow_up_date,
  ]
    .filter(Boolean)
    .map(String)
    .join(" | ");
}

function statusForRow(row: Row) {
  return String(
    row.queue_status ||
      row.status ||
      row.pharmacy_status ||
      row.order_status ||
      row.consultation_status ||
      "-"
  );
}

function metadataForRow(
  section: string,
  row: Row
) {
  return [
    `View ${section.replaceAll("-", " ")}`,
    row.appointment_date
      ? `Date ${row.appointment_date}`
      : null,
    row.order_type
      ? `Test ${row.order_type}`
      : null,
    row.study_type
      ? `Study ${row.study_type}`
      : null,
    row.follow_up_date
      ? `Follow up ${row.follow_up_date}`
      : null,
  ].filter(Boolean) as string[];
}
