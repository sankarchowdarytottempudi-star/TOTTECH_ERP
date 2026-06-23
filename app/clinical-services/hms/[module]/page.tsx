"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Database,
  FileText,
  Plus,
  Search,
  Workflow,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import {
  DashboardCard,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";
import {
  getHmsModuleConfig,
  type HmsModuleConfig,
} from "@/lib/clinical/hms-core";
import {
  getHmsStatusModule,
  isControlledStatusField,
  statusOptionsToSelect,
  type ClinicalStatusOption,
} from "@/lib/clinical/status-master";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: HmsModuleConfig;
  metrics?: Record<string, string | number | null>;
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
  };
  rows?: Row[];
  screens?: Row[];
  reports?: Row[];
  endpoints?: Row[];
};

const defaultStatus: Record<string, string> = {
  op: "WAITING",
  er: "BOOKED",
  ip: "ADMITTED",
  icu: "STABLE",
  ot: "SCHEDULED",
  billing: "DRAFT",
  insurance: "DRAFT",
};

export default function ClinicalHmsModulePage() {
  const params =
    useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const config = useMemo(
    () => getHmsModuleConfig(moduleKey),
    [moduleKey]
  );
  const [data, setData] =
    useState<ModulePayload | null>(null);
  const [patients, setPatients] =
    useState<Row[]>([]);
  const [doctors, setDoctors] =
    useState<Row[]>([]);
  const [departments, setDepartments] =
    useState<Row[]>([]);
  const [statusOptions, setStatusOptions] =
    useState<ClinicalStatusOption[]>([]);
  const [form, setForm] =
    useState<Record<string, string>>({});
  const [recordSearch, setRecordSearch] =
    useState("");
  const [page, setPage] =
    useState(1);
  const [saving, setSaving] =
    useState(false);

  const load = async () => {
    if (!config) {
      return;
    }

    const [
      moduleResponse,
      patientsResponse,
      doctorsResponse,
      statusResponse,
    ] = await Promise.all([
      fetch(
        `/api/clinical/hms/${moduleKey}?limit=10&page=${page}&q=${encodeURIComponent(recordSearch.length >= 2 ? recordSearch : "")}`
      ),
      fetch("/api/clinical/patients"),
      fetch("/api/clinical/doctors"),
      fetch(
        `/api/clinical/status-master?module=${encodeURIComponent(getHmsStatusModule(moduleKey))}`
      ),
    ]);

    if (moduleResponse.ok) {
      setData(await moduleResponse.json());
    }

    if (patientsResponse.ok) {
      const payload =
        await patientsResponse.json();
      setPatients(payload.patients || []);
    }

    if (doctorsResponse.ok) {
      const payload =
        await doctorsResponse.json();
      setDoctors(payload.doctors || []);
      setDepartments(
        payload.departments || []
      );
    }

    if (statusResponse.ok) {
      const payload =
        await statusResponse.json();
      setStatusOptions(payload.statuses || []);
    }
  };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void load();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [moduleKey, page, recordSearch]);

  if (!config) {
    return (
      <ClinicalShell>
        <div className="p-4">
          <section className="rounded-[8px] border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black">
              Unknown HMS Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This module is not registered in the HMS core engine.
            </p>
          </section>
        </div>
      </ClinicalShell>
    );
  }

  const save = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/clinical/hms/${moduleKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            status:
              form.status ||
              defaultStatus[moduleKey] ||
              "OPEN",
          }),
        }
      );
      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Failed to save HMS record"
        );
      }

      notify.success("HMS record saved");
      setForm({});
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to save HMS record"
      );
    } finally {
      setSaving(false);
    }
  };

  const metrics = data?.metrics || {};

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
            HMS Core Module
          </p>
          <h1 className="mt-2 text-4xl font-black">
            {config.label}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-200">
            Records, workflow screens, audit, and timeline are
            branch-scoped through the HMS engine.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            icon={Database}
            title="Records"
            value={metrics.total}
            drillDownUrl={`/clinical-services/hms/${moduleKey}`}
            caption="Open records"
          />
          <DashboardCard
            icon={Activity}
            title="Today"
            value={metrics.today}
            drillDownUrl={`/clinical-services/hms/${moduleKey}?date=today`}
            caption="Today's records"
          />
          <DashboardCard
            icon={Workflow}
            title="Patients"
            value={patients.length}
            drillDownUrl="/clinical-services/patients"
            caption="Patient 360 search"
          />
          <DashboardCard
            icon={FileText}
            title="Timeline"
            value={metrics.timeline || 0}
            drillDownUrl="/clinical-services/patient-timeline"
            caption="Patient events"
          />
        </section>

        <QuickActionsPanel
          actions={[
            {
              label: "Register Patient",
              href: "/clinical-services/patients",
              icon: Plus,
            },
            {
              label: "Book Appointment",
              href: "/clinical-services/appointments",
              icon: Activity,
            },
            {
              label: `Create ${config.label}`,
              href: `/clinical-services/hms/${moduleKey}`,
              icon: Workflow,
            },
            {
              label: "Open Billing",
              href: "/clinical-services/hms/billing",
              icon: FileText,
            },
          ]}
        />

        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
                <Plus size={21} />
              </div>
              <h2 className="text-2xl font-black">
                Create Record
              </h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {config.createColumns.map((column) => (
                <DynamicInput
                  key={column}
                  column={column}
                  value={form[column] || ""}
                  patients={patients}
                  doctors={doctors}
                  departments={departments}
                  statusOptions={statusOptions}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      [column]: value,
                    })
                  }
                />
              ))}
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="mt-5 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : `Save ${config.label}`}
            </button>
          </article>

          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
                <Search size={21} />
              </div>
              <h2 className="text-2xl font-black">
                Records
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {(data?.rows || []).map((row) => (
                <ClinicalRecordCard
                  key={String(row.id)}
                  href={recordHref(
                    row,
                    moduleKey
                  )}
                  eyebrow={businessEyebrow(row, patients, doctors, config.label)}
                  title={businessTitle(row, patients, doctors, config.label)}
                  description={businessDescription(row, patients, doctors)}
                  status={String(
                      row.status ||
                        row.alert_level ||
                        "-"
                    )}
                  metadata={[
                    `Module ${config.label}`,
                    `Patient ${String(row.patient_id || "-")}`,
                  ]}
                  patientHref={
                    row.patient_id
                      ? `/clinical-services/patients/${row.patient_id}`
                      : undefined
                  }
                  editHref={`/clinical-services/hms/${moduleKey}?record=${row.id}&mode=edit`}
                  auditHref={`/clinical-services/hms/${moduleKey}/${row.id}#audit`}
                  historyHref={`/clinical-services/hms/${moduleKey}/${row.id}#history`}
                />
              ))}
              {!data?.rows?.length ? (
                <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No records created for this module yet.
                </p>
              ) : null}
            </div>
            <RecordSearchAndPagination
              query={recordSearch}
              onQueryChange={(value) => {
                setRecordSearch(value);
                setPage(1);
              }}
              page={page}
              totalCount={Number(data?.pagination?.totalCount || 0)}
              onPrevious={() => setPage((current) => Math.max(1, current - 1))}
              onNext={() => setPage((current) => current + 1)}
            />
          </article>
        </section>

      </div>
    </ClinicalShell>
  );
}

function text(value: unknown) {
  return String(value || "").trim();
}

function fullName(row?: Row) {
  return [row?.first_name, row?.middle_name, row?.last_name]
    .map(text)
    .filter(Boolean)
    .join(" ");
}

function findById(rows: Row[], id: unknown) {
  return rows.find((row) => String(row.id) === String(id));
}

function businessEyebrow(
  row: Row,
  patients: Row[],
  doctors: Row[],
  fallback: string
) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id || row.consultant_id || row.surgeon_id);
  return (
    text(row.visit_number) ||
    text(row.er_number) ||
    text(row.admission_number) ||
    text(row.invoice_number) ||
    text(row.claim_number) ||
    text(patient?.uhid || patient?.patient_uid) ||
    text(doctor?.full_name) ||
    fallback
  );
}

function businessTitle(
  row: Row,
  patients: Row[],
  doctors: Row[],
  fallback: string
) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id || row.consultant_id || row.surgeon_id);
  return (
    fullName(patient) ||
    text(row.patient_name) ||
    text(row.ward_name) ||
    text(row.bed_number) ||
    text(row.procedure_name) ||
    text(row.final_diagnosis) ||
    text(row.medicine) ||
    text(doctor?.full_name) ||
    fallback
  );
}

function businessDescription(row: Row, patients: Row[], doctors: Row[]) {
  const patient = findById(patients, row.patient_id);
  const doctor = findById(doctors, row.doctor_id || row.consultant_id || row.surgeon_id);
  return [
    text(patient?.uhid || patient?.patient_uid),
    text(patient?.phone),
    text(doctor?.full_name),
    text(row.admission_date || row.visit_date || row.scheduled_date || row.created_at).slice(0, 10),
  ]
    .filter(Boolean)
    .join(" | ");
}

function RecordSearchAndPagination({
  query,
  onQueryChange,
  page,
  totalCount,
  onPrevious,
  onNext,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  page: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const canNext = page * 10 < totalCount;
  return (
    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-[1fr_auto] md:items-center">
      <label className="flex min-h-11 items-center gap-2 rounded-[8px] border border-slate-300 px-3">
        <Search size={16} className="text-[#8a6500]" />
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search patient, UHID, mobile, doctor, invoice..." className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" />
      </label>
      <div className="flex items-center gap-2 text-xs font-black text-slate-600">
        <span>Total {totalCount}</span>
        <button type="button" onClick={onPrevious} disabled={page <= 1} className="rounded-[8px] border border-slate-200 px-3 py-2 disabled:opacity-40">Previous</button>
        <span>Page {page}</span>
        <button type="button" onClick={onNext} disabled={!canNext} className="rounded-[8px] border border-slate-200 px-3 py-2 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

function recordHref(
  row: Row,
  moduleKey: string
) {
  if (row.patient_id) {
    return `/clinical-services/hms/${moduleKey}/${row.id}`;
  }

  return `/clinical-services/hms/${moduleKey}/${row.id}`;
}

function DynamicInput({
  column,
  value,
  patients,
  doctors,
  departments,
  statusOptions,
  onChange,
}: {
  column: string;
  value: string;
  patients: Row[];
  doctors: Row[];
  departments: Row[];
  statusOptions: ClinicalStatusOption[];
  onChange: (value: string) => void;
}) {
  const label = column
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");

  if (column === "patient_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={patients.map((patient) => ({
          value: String(patient.id),
          label: `${patient.patient_uid || patient.uhid || ""} ${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
        }))}
      />
    );
  }

  if (
    [
      "doctor_id",
      "surgeon_id",
      "consultant_id",
      "anesthetist_id",
    ].includes(column)
  ) {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={doctors.map((doctor) => ({
          value: String(doctor.id),
          label: String(doctor.full_name),
        }))}
      />
    );
  }

  if (column === "department_id") {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={departments.map((department) => ({
          value: String(department.id),
          label: String(department.department_name),
        }))}
      />
    );
  }

  if (isControlledStatusField(column)) {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={statusOptionsToSelect(statusOptions, value)}
      />
    );
  }

  const type =
    column.includes("date")
      ? "date"
      : column.includes("time")
        ? "time"
        : column.includes("amount") ||
            column.includes("total") ||
            column.includes("duration") ||
            column.endsWith("_id")
          ? "number"
          : "text";

  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <input
        value={value}
        type={type}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Metric({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Activity;
  title: string;
  value: unknown;
}) {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">
          {title}
        </p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-4xl font-black">
        {String(value ?? 0)}
      </p>
    </article>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Rows({
  rows,
  empty,
  primary,
  secondary,
}: {
  rows: Row[];
  empty: string;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
}) {
  if (!rows.length) {
    return (
      <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
        {empty}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div
          key={`${primary(row)}-${index}`}
          className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
        >
          <p className="break-words font-black">
            {primary(row)}
          </p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-600">
            {secondary(row)}
          </p>
        </div>
      ))}
    </div>
  );
}
