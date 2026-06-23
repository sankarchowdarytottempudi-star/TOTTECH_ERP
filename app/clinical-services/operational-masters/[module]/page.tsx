"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  Edit3,
  Printer,
  Save,
  Search,
  Trash2,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import {
  getOperationalMasterConfig,
  type OperationalField,
  type OperationalMasterConfig,
} from "@/lib/clinical/operational-masters-core";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type Payload = {
  module?: OperationalMasterConfig;
  metrics?: {
    total?: number;
  };
  rows?: Row[];
  error?: string;
};

const defaultRoleMatrix = JSON.stringify(
  {
    patient: {
      create: true,
      view: true,
      edit: true,
      delete: false,
      export: false,
      print: true,
    },
    doctor: {
      create: true,
      view: true,
      edit: true,
      delete: false,
    },
    lab: {
      create: true,
      view: true,
      edit: true,
      delete: false,
      approve: false,
    },
    pharmacy: {
      create: true,
      view: true,
      edit: true,
      delete: false,
      dispense: true,
    },
    billing: {
      create: true,
      view: true,
      edit: true,
      delete: false,
      refund: false,
    },
    reports: {
      view: true,
      export: false,
    },
  },
  null,
  2
);

export default function OperationalMasterPage() {
  const params = useParams<{
    module: string;
  }>();
  const moduleKey = String(params?.module || "");
  const config = useMemo(
    () =>
      getOperationalMasterConfig(
        moduleKey
      ),
    [moduleKey]
  );
  const [payload, setPayload] =
    useState<Payload | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] =
    useState("");
  const [form, setForm] =
    useState<Record<string, string>>({});
  const [editingId, setEditingId] =
    useState<number | null>(null);
  const [saving, setSaving] =
    useState(false);
  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const load = async () => {
    if (!config) return;

    const searchParams =
      new URLSearchParams();
    if (query) searchParams.set("q", query);
    if (status)
      searchParams.set("status", status);

    const response = await fetch(
      `/api/clinical/operational-masters/${moduleKey}?${searchParams.toString()}`
    );

    if (response.ok) {
      setPayload(await response.json());
    } else {
      setPayload({
        error:
          "Unable to load operational master.",
      });
    }
  };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void load();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [moduleKey]);

  if (!config) {
    return (
      <ClinicalShell>
        <div className="p-4">
          <section className="rounded-[8px] border border-red-200 bg-white p-6">
            <h1 className="text-3xl font-black">
              Unknown Operational Master
            </h1>
          </section>
        </div>
      </ClinicalShell>
    );
  }

  const rows = payload?.rows || [];

  const updateForm = (
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
    setForm(
      config.key === "roles"
        ? {
            module_permissions:
              defaultRoleMatrix,
            status: "ACTIVE",
          }
        : { status: "ACTIVE" }
    );
  };

  const editRow = (row: Row) => {
    const next: Record<string, string> = {};
    for (const field of config.fields) {
      const value = row[field.key];
      next[field.key] =
        typeof value === "object" &&
        value !== null
          ? JSON.stringify(value, null, 2)
          : String(value ?? "");
    }
    setEditingId(Number(row.id));
    setForm(next);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveRecord = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/clinical/operational-masters/${moduleKey}`,
        {
          method: editingId
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            id: editingId,
            status:
              form.status || "ACTIVE",
          }),
        }
      );
      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to save record"
        );
      }

      notify.success(
        editingId
          ? "Record updated"
          : "Record created"
      );
      resetForm();
      await load();
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to save record"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (row: Row) => {
    if (
      !window.confirm(
        "Delete this record?"
      )
    ) {
      return;
    }

    const response = await fetch(
      `/api/clinical/operational-masters/${moduleKey}?id=${row.id}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      notify.success("Record deleted");
      await load();
    } else {
      notify.error("Delete failed");
    }
  };

  const exportCsv = () => {
    const columns = [
      "id",
      ...config.fields.map(
        (field) => field.key
      ),
    ];
    const csv = [
      columns.join(","),
      ...rows.map((row) =>
        columns
          .map((column) =>
            JSON.stringify(
              row[column] ?? ""
            )
          )
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv",
    });
    const url =
      URL.createObjectURL(blob);
    const link =
      document.createElement("a");
    link.href = url;
    link.download = `${config.key}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <Link
          href="/clinical-services/operational-masters"
          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#04142E]"
        >
          <ArrowLeft size={16} />
          Operational Masters
        </Link>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase text-[#8a6500]">
            Data Capture First
          </p>
          <h1 className="mt-2 text-4xl font-black text-[#04142E]">
            {config.label}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-600">
            {config.description}
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[#04142E]">
                {editingId
                  ? "Edit Record"
                  : "Create Record"}
              </h2>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-[8px] border border-slate-200 px-4 py-2 text-sm font-black"
                >
                  New Record
                </button>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {config.fields
                .filter(
                  (field) =>
                    showAdvanced ||
                    !field.advanced
                )
                .map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    value={
                      form[field.key] || ""
                    }
                    onChange={(value) =>
                      updateForm(
                        field.key,
                        value
                      )
                    }
                  />
                ))}
            </div>

            {config.fields.some(
              (field) => field.advanced
            ) ? (
              <button
                type="button"
                onClick={() =>
                  setShowAdvanced(
                    (value) => !value
                  )
                }
                className="mt-4 text-sm font-black text-[#8a6500]"
              >
                {showAdvanced
                  ? "Hide Additional Information"
                  : "Show Additional Information"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={saveRecord}
              disabled={saving}
              className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-5 py-3 text-sm font-black text-[#D4AF37] disabled:opacity-60"
            >
              <Save size={16} />
              {saving
                ? "Saving..."
                : editingId
                  ? "Update"
                  : "Save"}
            </button>
          </article>

          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-[#8a6500]">
                  Records
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#04142E]">
                  {payload?.metrics?.total || 0} total
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportCsv}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 px-3 py-2 text-xs font-black"
                >
                  <Download size={14} />
                  Export
                </button>
                <button
                  type="button"
                  onClick={() =>
                    window.print()
                  }
                  className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 px-3 py-2 text-xs font-black"
                >
                  <Printer size={14} />
                  Print
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <div className="flex items-center gap-2 rounded-[8px] border border-slate-200 px-3">
                <Search
                  size={16}
                  className="text-slate-500"
                />
                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search records"
                  className="h-11 min-w-0 flex-1 outline-none"
                />
              </div>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="h-11 rounded-[8px] border border-slate-200 px-3 font-bold"
              >
                <option value="">
                  All Status
                </option>
                <option value="ACTIVE">
                  ACTIVE
                </option>
                <option value="INACTIVE">
                  INACTIVE
                </option>
                <option value="DRAFT">
                  DRAFT
                </option>
              </select>
              <button
                type="button"
                onClick={load}
                className="h-11 rounded-[8px] bg-[#04142E] px-5 text-sm font-black text-[#D4AF37]"
              >
                Filter
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {rows.length ? (
                rows.map((row) => (
                  <div
                    key={String(row.id)}
                    className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase text-[#8a6500]">
                          ID {String(row.id)}
                        </p>
                        <h3 className="mt-1 break-words text-lg font-black text-[#04142E]">
                          {String(
                            row[
                              config.primaryColumn
                            ] ||
                              row.lab_test_name ||
                              row.asset_number ||
                              row.equipment_number ||
                              "Record"
                          )}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            editRow(row)
                          }
                          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            deleteRecord(row)
                          }
                          className="inline-flex items-center gap-2 rounded-[8px] border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {config.fields
                        .slice(0, 9)
                        .map((field) => (
                          <div
                            key={field.key}
                            className="rounded-[8px] border border-slate-200 bg-white p-3"
                          >
                            <p className="text-[11px] font-black uppercase text-slate-500">
                              {field.label}
                            </p>
                            <p className="mt-1 break-words text-sm font-bold text-slate-950">
                              {formatValue(
                                row[field.key]
                              )}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
                  No records found.
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </ClinicalShell>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: OperationalField;
  value: string;
  onChange: (value: string) => void;
}) {
  const label = (
    <label className="text-xs font-black uppercase text-slate-500">
      {field.label}
      {field.required ? (
        <span className="text-red-600">
          {" "}
          *
        </span>
      ) : null}
    </label>
  );

  if (field.type === "textarea" || field.type === "json") {
    return (
      <div className="space-y-2 md:col-span-2">
        {label}
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={field.type === "json" ? 12 : 4}
          className="w-full rounded-[8px] border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-2">
        {label}
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-11 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
        >
          <option value="">Select</option>
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
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label}
      <input
        type={
          field.type === "number" ||
          field.type === "date" ||
          field.type === "time"
            ? field.type
            : "text"
        }
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-[#D4AF37]"
      />
    </div>
  );
}

function formatValue(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
