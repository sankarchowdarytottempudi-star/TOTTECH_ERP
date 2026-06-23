"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Edit3,
  FileText,
  Printer,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalPatientLookup from "@/components/clinical/ClinicalPatientLookup";
import {
  getPhase2Module,
  Phase2Field,
  Phase2Module,
} from "@/lib/clinical/phase2-workflows";

type Row = Record<string, unknown>;

type Payload = {
  module: Phase2Module;
  records: Row[];
  lookups: {
    patients: Row[];
    doctors: Row[];
    departments: Row[];
    medicines: Row[];
    labTests: Row[];
    rooms: Row[];
  };
};

const text = (value: unknown) =>
  String(value ?? "").trim();

const emptyData = (module: Phase2Module) =>
  module.fields.reduce<Record<string, string>>(
    (acc, field) => {
      acc[field.key] = "";
      return acc;
    },
    {
      status: module.defaultStatus,
      priority: "NORMAL",
    }
  );

function lookupLabel(
  field: Phase2Field,
  value: unknown,
  lookups: Payload["lookups"]
) {
  const id = Number(value);
  if (!Number.isFinite(id)) {
    return text(value) || "-";
  }

  if (field.type === "patient") {
    const patient = lookups.patients.find(
      (item) => Number(item.id) === id
    );
    return patient
      ? `${patient.patient_uid || patient.uhid || "PAT"} - ${patient.first_name || ""} ${patient.last_name || ""}`.trim()
      : "-";
  }

  if (field.type === "doctor") {
    const doctor = lookups.doctors.find(
      (item) => Number(item.id) === id
    );
    return text(doctor?.full_name) || "-";
  }

  if (field.type === "department") {
    const department = lookups.departments.find(
      (item) => Number(item.id) === id
    );
    return text(department?.department_name) || "-";
  }

  if (field.type === "medicine") {
    const medicine = lookups.medicines.find(
      (item) => Number(item.id) === id
    );
    return text(medicine?.medicine_name) || "-";
  }

  if (field.type === "lab_test") {
    const labTest = lookups.labTests.find(
      (item) => Number(item.id) === id
    );
    return text(labTest?.test_name) || "-";
  }

  if (field.type === "room") {
    const room = lookups.rooms.find(
      (item) => Number(item.id) === id
    );
    return room
      ? `${room.room_number || ""} ${room.room_type || ""}`.trim()
      : "-";
  }

  return text(value) || "-";
}

export default function Phase2OperationalPage({
  moduleKey,
}: {
  moduleKey: string;
}) {
  const config = getPhase2Module(moduleKey);
  const [payload, setPayload] =
    useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState<
    Record<string, string>
  >(config ? emptyData(config) : {});
  const [editingId, setEditingId] =
    useState<number | null>(null);
  const [selected, setSelected] =
    useState<Row | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const module = payload?.module || config;

  const sections = useMemo(() => {
    if (!module) {
      return [];
    }

    const map = new Map<string, Phase2Field[]>();
    for (const field of module.fields) {
      const section = field.section || "Details";
      map.set(section, [
        ...(map.get(section) || []),
        field,
      ]);
    }
    return Array.from(map.entries());
  }, [module]);

  const load = async () => {
    if (!config) {
      return;
    }

    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("q", query.trim());
    }
    if (status) {
      params.set("status", status);
    }

    const response = await fetch(
      `/api/clinical/phase2/${moduleKey}?${params.toString()}`
    );
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(
        body.error ||
          "Unable to load operational records."
      );
      setLoading(false);
      return;
    }

    setPayload(await response.json());
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 150);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey, query, status]);

  if (!module) {
    return (
      <ClinicalShell>
        <div className="p-4">
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-5 text-sm font-black text-red-800">
            Unknown Phase 2 module.
          </div>
        </div>
      </ClinicalShell>
    );
  }

  const records = payload?.records || [];
  const lookups =
    payload?.lookups || {
      patients: [],
      doctors: [],
      departments: [],
      medicines: [],
      labTests: [],
      rooms: [],
    };

  const updateField = (
    key: string,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setSelected(null);
    setMessage("");
    setError("");
    setForm(emptyData(module));
  };

  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const response = await fetch(
      `/api/clinical/phase2/${module.key}`,
      {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          id: editingId || undefined,
        }),
      }
    );

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(
        body.error ||
          "Unable to save this operational record."
      );
      setSaving(false);
      return;
    }

    setMessage(
      editingId
        ? "Record updated successfully."
        : "Record created successfully."
    );
    setSaving(false);
    resetForm();
    await load();
  };

  const edit = (record: Row) => {
    const data =
      (record.data || {}) as Record<string, unknown>;
    const next = emptyData(module);
    for (const key of Object.keys(next)) {
      next[key] = text(
        data[key] ?? record[key] ?? next[key]
      );
    }
    next.status = text(record.status) || next.status;
    next.priority =
      text(record.priority) || next.priority;
    setEditingId(Number(record.id));
    setSelected(record);
    setForm(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (record: Row) => {
    if (
      !window.confirm(
        `Delete ${record.title || "this record"}?`
      )
    ) {
      return;
    }

    const response = await fetch(
      `/api/clinical/phase2/${module.key}?id=${record.id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(
        body.error ||
          "Unable to delete this record."
      );
      return;
    }
    setMessage("Record deleted.");
    await load();
  };

  const printRecord = (record: Row) => {
    const data =
      (record.data || {}) as Record<string, unknown>;
    const rows = module.fields
      .map(
        (field) => `
          <tr>
            <th>${field.label}</th>
            <td>${lookupLabel(field, data[field.key], lookups)}</td>
          </tr>
        `
      )
      .join("");
    const html = `
      <html>
        <head>
          <title>${module.printTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #04142E; }
            h1 { margin-bottom: 4px; }
            p { color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; }
            th, td { border: 1px solid #d7dee8; padding: 10px; text-align: left; vertical-align: top; }
            th { width: 220px; background: #fff7df; color: #735300; }
          </style>
        </head>
        <body>
          <h1>${module.printTitle}</h1>
          <p>${record.record_uid || ""} | ${record.status || ""}</p>
          <h2>${record.title || module.title}</h2>
          <table>${rows}</table>
        </body>
      </html>
    `;
    const win = window.open("", "_blank");
    if (!win) {
      return;
    }
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const renderField = (field: Phase2Field) => {
    const value = form[field.key] || "";
    const common =
      "min-h-12 w-full rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#04142E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/25";

    const selectOptions = () => {
      if (field.type === "patient") {
        return lookups.patients.map((item) => ({
          value: String(item.id),
          label: `${item.patient_uid || item.uhid || "PAT"} - ${item.first_name || ""} ${item.last_name || ""}`.trim(),
        }));
      }
      if (field.type === "doctor") {
        return lookups.doctors.map((item) => ({
          value: String(item.id),
          label: text(item.full_name),
        }));
      }
      if (field.type === "department") {
        return lookups.departments.map((item) => ({
          value: String(item.id),
          label: text(item.department_name),
        }));
      }
      if (field.type === "medicine") {
        return lookups.medicines.map((item) => ({
          value: String(item.id),
          label: `${item.medicine_name || ""} ${item.strength || ""}`.trim(),
        }));
      }
      if (field.type === "lab_test") {
        return lookups.labTests.map((item) => ({
          value: String(item.id),
          label: text(item.test_name),
        }));
      }
      if (field.type === "room") {
        return lookups.rooms.map((item) => ({
          value: String(item.id),
          label: `${item.room_number || ""} ${item.room_type || ""} ${item.status || ""}`.trim(),
        }));
      }
      return (field.options || []).map((item) => ({
        value: item,
        label: item,
      }));
    };

    if (
      field.type === "select" ||
      field.type === "patient" ||
      field.type === "doctor" ||
      field.type === "department" ||
      field.type === "medicine" ||
      field.type === "lab_test" ||
      field.type === "room"
    ) {
      return (
        <select
          value={value}
          onChange={(event) =>
            updateField(field.key, event.target.value)
          }
          className={common}
          required={field.required}
        >
          <option value="">Select {field.label}</option>
          {selectOptions().map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          value={value}
          onChange={(event) =>
            updateField(field.key, event.target.value)
          }
          rows={4}
          className={common}
          placeholder={field.placeholder}
          required={field.required}
        />
      );
    }

    return (
      <input
        value={value}
        onChange={(event) =>
          updateField(field.key, event.target.value)
        }
        type={field.type}
        className={common}
        placeholder={field.placeholder}
        required={field.required}
      />
    );
  };

  return (
    <ClinicalShell>
      <div className="space-y-5 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/35 bg-[#04142E] p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
                Phase 2 Daily Operations
              </p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">
                {module.title}
              </h1>
              <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-white/90">
                {module.subtitle}
              </p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.08em] text-white/75">
                {module.audience}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={load}
                className="inline-flex items-center gap-2 rounded-[8px] border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/15"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <a
                href={`/api/clinical/phase2/${module.key}?export=csv`}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#D4AF37]/45 bg-[#D4AF37] px-4 py-3 text-sm font-black text-[#04142E] transition hover:bg-[#f2cf67]"
              >
                <Download size={16} />
                CSV Export
              </a>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm font-black text-red-800">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-800">
            {message}
          </div>
        ) : null}

        <ClinicalPatientLookup
          title={`${module.title} Patient Lookup`}
          description="Use patient name first, then mobile number, UHID/MRN, or ABHA. Operational staff should not need appointment IDs or internal record IDs to find a patient."
          compact={module.key === "pharmacy"}
        />

        <form
          onSubmit={submit}
          className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-[#735300]">
                {editingId ? "Edit Record" : "New Record"}
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#04142E]">
                {module.primaryAction}
              </h2>
            </div>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-[#04142E]"
              >
                <X size={16} />
                Cancel Edit
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-600">
                Status
              </span>
              <select
                value={form.status || module.defaultStatus}
                onChange={(event) =>
                  updateField("status", event.target.value)
                }
                className="min-h-12 w-full rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
              >
                {module.statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-600">
                Priority
              </span>
              <select
                value={form.priority || "NORMAL"}
                onChange={(event) =>
                  updateField("priority", event.target.value)
                }
                className="min-h-12 w-full rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
              >
                {["LOW", "NORMAL", "HIGH", "CRITICAL"].map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-600">
                Workflow Step
              </span>
              <input
                value={form.workflow_step || ""}
                onChange={(event) =>
                  updateField(
                    "workflow_step",
                    event.target.value
                  )
                }
                className="min-h-12 w-full rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
                placeholder="Current workflow step"
              />
            </label>
          </div>

          <div className="mt-5 space-y-5">
            {sections.map(([section, fields]) => (
              <section
                key={section}
                className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="text-sm font-black uppercase text-[#04142E]">
                  {section}
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {fields.map((field) => (
                    <label
                      key={field.key}
                      className={
                        field.type === "textarea"
                          ? "space-y-2 xl:col-span-3"
                          : "space-y-2"
                      }
                    >
                      <span className="text-xs font-black uppercase text-slate-600">
                        {field.label}
                        {field.required ? " *" : ""}
                      </span>
                      {renderField(field)}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#092352] disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : module.primaryAction}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#04142E]"
            >
              Clear
            </button>
          </div>
        </form>

        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_240px_auto] md:items-center">
            <label className="relative block">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                className="min-h-12 w-full rounded-[8px] border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
                placeholder="Search patient, record id, phone, status, notes..."
              />
            </label>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="min-h-12 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
            >
              <option value="">All statuses</option>
              {module.statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={load}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-4 text-sm font-black text-[#04142E]"
            >
              <RefreshCw size={16} />
              Search
            </button>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 text-sm font-black text-slate-600">
                Loading {module.title} records...
              </div>
            ) : records.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {records.map((record) => {
                  const data =
                    (record.data || {}) as Record<
                      string,
                      unknown
                    >;
                  return (
                    <article
                      key={String(record.id)}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelected(record)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          setSelected(record);
                        }
                      }}
                      className="cursor-pointer rounded-[8px] border border-slate-200 bg-slate-50 p-4 shadow-sm outline-none transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-white hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#D4AF37]/35"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase tracking-[0.08em] text-[#735300]">
                            {text(record.record_uid)}
                          </p>
                          <h3 className="mt-1 break-words text-xl font-black text-[#04142E]">
                            {text(record.title) || module.title}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-slate-600">
                            {text(record.patient_name) ||
                              "No patient linked"}{" "}
                            {text(record.patient_uid)
                              ? `| ${record.patient_uid}`
                              : ""}
                          </p>
                        </div>
                        <span className="rounded-[8px] border border-[#D4AF37]/45 bg-[#fff4df] px-3 py-2 text-xs font-black uppercase text-[#735300]">
                          {text(record.status)}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {module.fields
                          .slice(0, 4)
                          .map((field) => (
                            <span
                              key={field.key}
                              className="rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                            >
                              {field.label}:{" "}
                              {lookupLabel(
                                field,
                                data[field.key],
                                lookups
                              )}
                            </span>
                          ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelected(record);
                          }}
                          className="inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-3 py-2 text-xs font-black text-white"
                        >
                          <FileText size={14} />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            edit(record);
                          }}
                          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E]"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            printRecord(record);
                          }}
                          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#04142E]"
                        >
                          <Printer size={14} />
                          Print
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            remove(record);
                          }}
                          className="inline-flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 text-sm font-black text-slate-600">
                No {module.title} records found for this hospital branch.
              </div>
            )}
          </div>
        </section>

        {selected ? (
          <section className="rounded-[8px] border border-[#D4AF37]/45 bg-[#fff9e8] p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase text-[#735300]">
                  Record Details
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#04142E]">
                  {text(selected.title)}
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-700">
                  {text(selected.record_uid)} | {text(selected.status)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-[#04142E]"
              >
                <X size={16} />
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {module.fields.map((field) => {
                const data =
                  (selected.data || {}) as Record<string, unknown>;
                return (
                  <div
                    key={field.key}
                    className="rounded-[8px] border border-[#f0d28a] bg-white p-4"
                  >
                    <p className="text-xs font-black uppercase text-[#735300]">
                      {field.label}
                    </p>
                    <p className="mt-1 break-words text-sm font-black text-[#04142E]">
                      {lookupLabel(
                        field,
                        data[field.key],
                        lookups
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </ClinicalShell>
  );
}
