"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import ClinicalMobilePatientSearch from "@/components/clinical/ClinicalMobilePatientSearch";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type Field = {
  id: number;
  field_key: string;
  label: string;
  field_type: string;
  tab_key?: string | null;
  section_key?: string | null;
  sort_order?: number | null;
  is_required?: boolean | null;
  options?: string[];
};

type ClinicalForm = {
  form_key: string;
  form_name: string;
  fields?: Field[];
};

const emptyForm: Record<
  string,
  string
> = {};

export default function ClinicalPatientsPage() {
  const [patients, setPatients] =
    useState<Row[]>([]);
  const [forms, setForms] =
    useState<ClinicalForm[]>([]);
  const [form, setForm] =
    useState(emptyForm);
  const [query, setQuery] =
    useState("");
  const [saving, setSaving] =
    useState(false);

  const registrationForm = useMemo(
    () =>
      forms.find(
        (item) =>
          item.form_key ===
          "patient_registration"
      ),
    [forms]
  );
  const fields = useMemo(
    () =>
      (registrationForm?.fields || [])
        .filter(
          (field) =>
            ![
              "Image Upload",
              "File Upload",
              "Signature",
            ].includes(
              field.field_type
            )
        )
        .sort(
          (a, b) =>
            Number(a.sort_order || 0) -
            Number(b.sort_order || 0)
        ),
    [registrationForm]
  );

  const load = async (
    search = query
  ) => {
    const [patientResponse, formResponse] =
      await Promise.all([
        fetch(
          `/api/clinical/patients?q=${encodeURIComponent(
            search
          )}`
        ),
        fetch("/api/clinical/forms"),
      ]);

    if (patientResponse.ok) {
      const payload =
        await patientResponse.json();
      setPatients(
        payload.patients || []
      );
    }

    if (formResponse.ok) {
      const payload =
        await formResponse.json();
      setForms(payload.forms || []);
    }
  };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void load("");
      }, 0);

    return () =>
      window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePatient = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        "/api/clinical/patients",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Failed to register patient"
        );
      }

      notify.success(
        "Patient registered"
      );
      setForm({});
      await load("");
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to register patient"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="rounded-[8px] border border-teal-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">
            Patient Management
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Registration, Search and Patient Journey
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            Registration fields are loaded from the clinical form builder.
            Admins can add, rename, and require fields without changing code.
          </p>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <ClinicalMobilePatientSearch
              onSelectPatient={(patient) => {
                window.location.href = `/clinical-services/patients/${patient.id}`;
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
              <UserPlus size={22} />
            </div>
            <h2 className="text-2xl font-black">
              Register Patient
            </h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fields.map((field) => (
              <DynamicField
                key={field.field_key}
                field={field}
                value={
                  form[field.field_key] ||
                  ""
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    [field.field_key]:
                      value,
                  })
                }
              />
            ))}
            <label className="block rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-4">
              <span className="text-xs font-black uppercase text-[#8a6500]">
                IVF Patient
              </span>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.ivf_patient === "true"}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      ivf_patient: event.target.checked ? "true" : "",
                      patient_type: event.target.checked ? "IVF" : "",
                    })
                  }
                  className="h-5 w-5"
                />
                <span className="text-sm font-bold text-[#04142E]">
                  Show this patient in IVF workflows
                </span>
              </div>
            </label>
          </div>

          <button
            onClick={savePatient}
            disabled={saving}
            className="mt-5 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Register Patient"}
          </button>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black">
              Patients
            </h2>
            <div className="flex min-w-0 flex-1 gap-2 md:max-w-lg">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value
                    )
                  }
                  className="w-full rounded-[8px] border border-slate-300 py-3 pl-10 pr-3 text-sm font-semibold outline-none focus:border-teal-600"
                  placeholder="Search mobile, MRN/UHID, patient name, ABHA number"
                />
              </div>
              <button
                onClick={() =>
                  load(query)
                }
                className="rounded-[8px] border border-slate-300 px-4 py-3 text-sm font-black"
              >
                Search
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {patients.map((patient) => (
              <ClinicalRecordCard
                key={String(patient.id)}
                href={`/clinical-services/patients/${patient.id}`}
                eyebrow={String(patient.patient_uid || "-")}
                title={
                  `${patient.first_name || ""} ${patient.last_name || ""}`.trim() ||
                  "Patient"
                }
                description={String(patient.phone || "No phone")}
                status={String(patient.status || "ACTIVE")}
                editHref={`/clinical-services/patients/${patient.id}?mode=edit`}
                auditHref={`/clinical-services/patients/${patient.id}#audit`}
                historyHref={`/clinical-services/patients/${patient.id}#history`}
              >
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black">
                  <span className="rounded-[8px] bg-white p-2">
                    Appts{" "}
                    {String(
                      patient.appointment_count ||
                        0
                    )}
                  </span>
                  <span className="rounded-[8px] bg-white p-2">
                    Records{" "}
                    {String(
                      patient.record_count ||
                        0
                    )}
                  </span>
                  <span className="rounded-[8px] bg-white p-2">
                    IVF{" "}
                    {String(
                      patient.ivf_case_count ||
                      0
                    )}
                  </span>
                </div>
              </ClinicalRecordCard>
            ))}
          </div>
        </section>
      </div>
    </ClinicalShell>
  );
}

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
}) {
  const type =
    field.field_type.toLowerCase();

  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {field.label}
        {field.is_required ? " *" : ""}
      </span>
      {type === "dropdown" ||
      type === "radio" ? (
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
        >
          <option value="">
            Select
          </option>
          {(field.options || []).map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>
      ) : type === "rich text" ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="mt-2 min-h-28 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          type={
            type === "date"
              ? "date"
              : type === "email"
                ? "email"
                : type === "phone"
                  ? "tel"
                  : type === "number"
                    ? "number"
                    : "text"
          }
          className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
        />
      )}
    </label>
  );
}
