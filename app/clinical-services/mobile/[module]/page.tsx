"use client";

import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  Bell,
  Brain,
  Database,
  FileText,
  Plus,
  ShieldCheck,
  Smartphone,
  UserRound,
  Video,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import {
  getMobileModuleConfig,
  type MobileModuleConfig,
} from "@/lib/clinical/mobile-core";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: MobileModuleConfig;
  metrics?: Record<string, string | number | null>;
  rows?: Row[];
  screens?: Row[];
  reports?: Row[];
  endpoints?: Row[];
};

const defaultStatus: Record<string, string> = {
  dashboard: "ACTIVE",
  "mobile-users": "ACTIVE",
  devices: "ACTIVE",
  "auth-sessions": "ACTIVE",
  "patient-dashboard": "ACTIVE",
  "patient-profile": "ACTIVE",
  "patient-360": "ACTIVE",
  appointments: "BOOKED",
  "lab-reports": "READY",
  "lab-trends": "ACTIVE",
  "radiology-reports": "READY",
  eprescriptions: "ACTIVE",
  "refill-requests": "REQUESTED",
  "medication-reminders": "ACTIVE",
  "online-payments": "PENDING",
  documents: "STORED",
  "health-tracker": "ACTIVE",
  wearables: "ACTIVE",
  "ivf-dashboard": "ACTIVE",
  "ivf-medications": "PENDING",
  "doctor-consultations": "DRAFT",
  telemedicine: "SCHEDULED",
  chat: "OPEN",
  "nurse-tasks": "PENDING",
  "medication-admin": "PENDING",
  vitals: "RECORDED",
  "referral-leads": "NEW",
  "referral-commissions": "PENDING",
  "corporate-employees": "ACTIVE",
  "executive-kpis": "ACTIVE",
  notifications: "PENDING",
  "offline-sync": "PENDING",
  "ai-assistant": "ANSWERED",
};

const moduleIcons: Record<string, LucideIcon> = {
  appointments: Activity,
  telemedicine: Video,
  notifications: Bell,
  "ai-assistant": Brain,
  "mobile-users": UserRound,
  devices: ShieldCheck,
};

export default function ClinicalMobileModulePage() {
  const params =
    useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const config = useMemo(
    () => getMobileModuleConfig(moduleKey),
    [moduleKey]
  );
  const [data, setData] =
    useState<ModulePayload | null>(null);
  const [patients, setPatients] =
    useState<Row[]>([]);
  const [doctors, setDoctors] =
    useState<Row[]>([]);
  const [mobileUsers, setMobileUsers] =
    useState<Row[]>([]);
  const [devices, setDevices] =
    useState<Row[]>([]);
  const [form, setForm] =
    useState<Record<string, string>>({});
  const [saving, setSaving] =
    useState(false);

  const load = useCallback(async () => {
    if (!config) {
      return;
    }

    const [
      moduleResponse,
      patientsResponse,
      doctorsResponse,
      mobileUsersResponse,
      devicesResponse,
    ] = await Promise.all([
      fetch(`/api/clinical/mobile/${moduleKey}`),
      fetch("/api/clinical/patients"),
      fetch("/api/clinical/doctors"),
      fetch("/api/clinical/mobile/mobile-users"),
      fetch("/api/clinical/mobile/devices"),
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
    }

    if (mobileUsersResponse.ok) {
      const payload =
        await mobileUsersResponse.json();
      setMobileUsers(payload.rows || []);
    }

    if (devicesResponse.ok) {
      const payload =
        await devicesResponse.json();
      setDevices(payload.rows || []);
    }
  }, [config, moduleKey]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void load();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [load]);

  if (!config) {
    return (
      <ClinicalShell>
        <div className="p-4">
          <section className="rounded-[8px] border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black">
              Unknown Mobile Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This module is not registered in the Phase 8 mobile platform.
            </p>
          </section>
        </div>
      </ClinicalShell>
    );
  }

  const Icon =
    moduleIcons[moduleKey] || Smartphone;

  const save = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/clinical/mobile/${moduleKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            ...(config.statusColumn
              ? {
                  [config.statusColumn]:
                    form[config.statusColumn] ||
                    defaultStatus[moduleKey] ||
                    "ACTIVE",
                }
              : {}),
          }),
        }
      );
      const payload = await response.json();

      if (!response.ok) {
        notify.error(
          payload.error ||
            "Mobile record could not be saved."
        );
        return;
      }

      notify.success(
        `${config.label} saved.`
      );
      setForm({});
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: unknown) => {
    const response = await fetch(
      `/api/clinical/mobile/${moduleKey}?id=${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      notify.success(
        `${config.label} removed.`
      );
      await load();
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#0B1F3A] p-7 text-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
                {config.appName}
              </p>
              <h1 className="mt-2 text-4xl font-black">
                {config.label}
              </h1>
              <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
                Tenant-isolated mobile workflow for Android, iOS, tablet,
                web portal, kiosk, smart TV, offline sync, audit logging,
                push notification, and clinical safety evidence.
              </p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-[8px] border border-[#D4AF37]/60 bg-white/10 text-[#D4AF37]">
              <Icon size={30} />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Metric
            icon={Database}
            title="Records"
            value={data?.metrics?.total}
          />
          <Metric
            icon={Activity}
            title="Today"
            value={data?.metrics?.today}
          />
          <Metric
            icon={FileText}
            title="Screens"
            value={data?.screens?.length}
          />
          <Metric
            icon={Workflow}
            title="API Specs"
            value={data?.endpoints?.length}
          />
          <Metric
            icon={FileText}
            title="Reports"
            value={data?.reports?.length}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel title={`Create ${config.label}`}>
            <div className="grid gap-3 md:grid-cols-2">
              {config.createColumns.map((column) => (
                <Field
                  key={column}
                  column={column}
                  config={config}
                  value={form[column] || ""}
                  patients={patients}
                  doctors={doctors}
                  mobileUsers={mobileUsers}
                  devices={devices}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      [column]: value,
                    }))
                  }
                />
              ))}
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#0B1F3A] px-5 py-3 text-sm font-black text-white shadow-sm disabled:opacity-60"
            >
              <Plus size={17} />
              {saving
                ? "Saving..."
                : `Save ${config.label}`}
            </button>
          </Panel>

          <Panel title="Workflow Evidence">
            <Rows
              rows={data?.screens || []}
              empty="No screen definitions registered."
              primary={(row) =>
                String(row.screen_name || "-")
              }
              secondary={(row) =>
                `${row.app_name || config.appName} | ${row.route_path || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Current Records">
            <div className="space-y-3">
              {(data?.rows || []).length ? (
                (data?.rows || []).map((row) => (
                  <ClinicalRecordCard
                    key={String(row.id)}
                    href={`/clinical-services/mobile/${moduleKey}/${row.id}`}
                    eyebrow={`ID ${String(row.id)}`}
                    title={recordTitle(row, config)}
                    description={`Mobile ${config.label} record`}
                    status={String(
                      row.status ||
                        row.sync_status ||
                        row.session_status ||
                        "-"
                    )}
                    patientHref={
                      row.patient_id
                        ? `/clinical-services/patients/${row.patient_id}`
                        : undefined
                    }
                    editHref={`/clinical-services/mobile/${moduleKey}?record=${row.id}&mode=edit`}
                    auditHref={`/clinical-services/mobile/${moduleKey}/${row.id}#audit`}
                    historyHref={`/clinical-services/mobile/${moduleKey}/${row.id}#history`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black">
                          {recordTitle(row, config)}
                        </p>
                        <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                          ID {String(row.id)}
                        </p>
                      </div>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          void remove(row.id)
                        }}
                        className="rounded-[8px] border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {Object.entries(row)
                        .filter(
                          ([key]) =>
                            ![
                              "is_deleted",
                              "created_by",
                              "updated_by",
                            ].includes(key)
                        )
                        .slice(0, 8)
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="rounded-[8px] bg-white p-3"
                          >
                            <p className="text-[11px] font-black uppercase text-slate-500">
                              {key
                                .split("_")
                                .join(" ")}
                            </p>
                            <p className="mt-1 break-words text-sm font-bold text-slate-950">
                              {formatValue(value)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </ClinicalRecordCard>
                ))
              ) : (
                <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-600">
                  No records created yet for this mobile workflow.
                </div>
              )}
            </div>
          </Panel>

          <Panel title="APIs and Reports">
            <div className="grid gap-4">
              <EvidenceBlock
                title="API Contracts"
                rows={data?.endpoints || []}
                empty="No API endpoint definitions registered."
                primary={(row) =>
                  `${row.method || "GET"} ${row.path || "-"}`
                }
                secondary={(row) =>
                  String(row.permission_key || "-")
                }
              />
              <EvidenceBlock
                title="Reports"
                rows={data?.reports || []}
                empty="No report definitions registered."
                primary={(row) =>
                  String(row.report_name || "-")
                }
                secondary={(row) =>
                  `${row.report_category || "Mobile"} | ${row.output_formats || "-"}`
                }
              />
            </div>
          </Panel>
        </section>
      </div>
    </ClinicalShell>
  );
}

function Field({
  column,
  config,
  value,
  patients,
  doctors,
  mobileUsers,
  devices,
  onChange,
}: {
  column: string;
  config: MobileModuleConfig;
  value: string;
  patients: Row[];
  doctors: Row[];
  mobileUsers: Row[];
  devices: Row[];
  onChange: (value: string) => void;
}) {
  const label = column.split("_").join(" ");
  const required =
    config.requiredColumns?.includes(column);

  if (column === "patient_id") {
    return (
      <Select
        label={label}
        value={value}
        required={required}
        options={patients.map((patient) => ({
          value: String(patient.id),
          label: `${patient.patient_name || patient.full_name || patient.first_name || "Patient"} | ${patient.uhid || patient.patient_code || patient.id}`,
        }))}
        onChange={onChange}
      />
    );
  }

  if (column === "doctor_id") {
    return (
      <Select
        label={label}
        value={value}
        required={required}
        options={doctors.map((doctor) => ({
          value: String(doctor.id),
          label: `${doctor.doctor_name || doctor.full_name || doctor.first_name || "Doctor"} | ${doctor.department_name || doctor.specialization || doctor.id}`,
        }))}
        onChange={onChange}
      />
    );
  }

  if (column === "mobile_user_id") {
    return (
      <Select
        label={label}
        value={value}
        required={required}
        options={mobileUsers.map((user) => ({
          value: String(user.id),
          label: `${user.mobile_user_type || "Mobile User"} | ${user.mobile_number || user.email || user.id}`,
        }))}
        onChange={onChange}
      />
    );
  }

  if (column === "device_id") {
    return (
      <Select
        label={label}
        value={value}
        required={required}
        options={devices.map((device) => ({
          value: String(device.id),
          label: `${device.device_name || device.platform || "Device"} | ${device.device_uid || device.id}`,
        }))}
        onChange={onChange}
      />
    );
  }

  if (config.jsonColumns?.includes(column)) {
    return (
      <label className="block">
        <span className="text-xs font-black uppercase text-slate-600">
          {label}
          {required ? " *" : ""}
        </span>
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="JSON or comma-separated values"
          className="mt-2 min-h-[92px] w-full rounded-[8px] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
        />
      </label>
    );
  }

  if (config.textAreaColumns?.includes(column)) {
    return (
      <label className="block">
        <span className="text-xs font-black uppercase text-slate-600">
          {label}
          {required ? " *" : ""}
        </span>
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="mt-2 min-h-[92px] w-full rounded-[8px] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
        />
      </label>
    );
  }

  const inputType =
    config.dateColumns?.includes(column)
      ? column.endsWith("_at") ||
        column === "last_login" ||
        column === "expires_at"
        ? "datetime-local"
        : "date"
      : config.numericColumns?.includes(column)
        ? "number"
        : "text";

  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={inputType}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-[8px] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  required,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-[8px] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
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
  icon: LucideIcon;
  title: string;
  value: unknown;
}) {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">
          {title}
        </p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 break-words text-3xl font-black">
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
      <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-600">
        {empty}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div
          key={`${primary(row)}-${index}`}
          className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
        >
          <p className="break-words text-sm font-black">
            {primary(row)}
          </p>
          <p className="mt-1 break-words text-xs font-bold text-slate-500">
            {secondary(row)}
          </p>
        </div>
      ))}
    </div>
  );
}

function EvidenceBlock({
  title,
  rows,
  empty,
  primary,
  secondary,
}: {
  title: string;
  rows: Row[];
  empty: string;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
}) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase text-slate-500">
        {title}
      </h3>
      <div className="mt-3">
        <Rows
          rows={rows}
          empty={empty}
          primary={primary}
          secondary={secondary}
        />
      </div>
    </div>
  );
}

function recordTitle(
  row: Row,
  config: MobileModuleConfig
) {
  const candidates = [
    config.uidColumn,
    "widget_title",
    "event_title",
    "report_title",
    "medicine_name",
    "document_title",
    "current_stage",
    "task_title",
    "lead_name",
    "employee_name",
    "kpi_label",
    "title",
    "prompt",
  ].filter(Boolean) as string[];

  for (const key of candidates) {
    if (row[key]) {
      return String(row[key]);
    }
  }

  return `${config.label} #${String(row.id || "-")}`;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
