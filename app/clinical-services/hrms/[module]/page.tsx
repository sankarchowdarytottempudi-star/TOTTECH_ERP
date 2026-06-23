"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Download,
  Eye,
  Filter,
  Pencil,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { DashboardCard } from "@/components/clinical/EnterpriseDashboard";
import { getHrmsModuleConfig } from "@/lib/clinical/hrms-core";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: {
    key: string;
    label: string;
    category: string;
    description: string;
    primaryColumns: string[];
  };
  metrics?: Record<string, string | number | null>;
  rows?: Row[];
  error?: string;
};

export default function ClinicalHrmsModulePage() {
  const params = useParams();
  const key = String(params?.module || "");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const fallbackConfig = useMemo(
    () => getHrmsModuleConfig(key),
    [key]
  );
  const [data, setData] = useState<ModulePayload | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"GRID" | "CARD">("GRID");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<
    Record<string, string>
  >({});

  const loadModule = useCallback(async () => {
    const response = await fetch(`/api/clinical/hrms/${key}`);
    if (response.ok) {
      setData(await response.json());
      return;
    }
    setData({ error: "Unable to load this HRMS module." });
  }, [key]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadModule();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadModule]);

  const moduleConfig = data?.module || fallbackConfig;
  const rows = data?.rows || [];
  const metrics = data?.metrics || {};

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      Object.values(row)
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  useEffect(() => {
    if (!createOpen) return;
    const nextValues: Record<string, string> = {};
    (moduleConfig?.primaryColumns || []).forEach((column) => {
      nextValues[column] = "";
    });
    nextValues.status = String(
      rows[0]?.status ||
        rows[0]?.employee_status ||
        rows[0]?.approval_status ||
        "ACTIVE"
    );
    setFormValues((current) => ({
      ...nextValues,
      ...current,
    }));
  }, [createOpen, moduleConfig?.primaryColumns, rows]);

  async function handleCreate() {
    setFeedback(null);
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(formValues).filter(
          ([, value]) => value.trim().length > 0
        )
      );

      const response = await fetch(
        `/api/clinical/hrms/${key}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to create this HRMS record."
        );
      }

      setFeedback("Record created successfully.");
      notify.success("Record created successfully.");
      setCreateOpen(false);
      await loadModule();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create this HRMS record.";
      setFeedback(message);
      notify.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number | string) {
    if (
      !window.confirm(
        "Delete this HRMS record?"
      )
    ) {
      return;
    }
    setFeedback(null);
    try {
      const response = await fetch(
        `/api/clinical/hrms/${key}?id=${encodeURIComponent(String(id))}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to delete this HRMS record."
        );
      }
      setFeedback("Record deleted successfully.");
      notify.success("Record deleted successfully.");
      await loadModule();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete this HRMS record.";
      setFeedback(message);
      notify.error(message);
    }
  }

  function handleExport() {
    setFeedback(null);
    const headers = [
      "record_id",
      ...(moduleConfig?.primaryColumns || []),
      "status",
    ];
    const lines = [
      headers.join(","),
      ...filteredRows.map((row) =>
        headers
          .map((column) =>
            csvEscape(
              column === "record_id"
                ? row.id
                : row[column] ?? ""
            )
          )
          .join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${key}-hrms-export.csv`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback("Export prepared.");
  }

  function handlePrint() {
    setFeedback(null);
    window.print();
  }

  function focusSearch() {
    searchRef.current?.focus();
    setFeedback("Search field focused.");
  }

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <Link
          href="/clinical-services/hrms"
          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-sm"
        >
          <ArrowLeft size={16} />
          HRMS Command Center
        </Link>

        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#0B1F3A] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            {moduleConfig?.category || "HRMS"}
          </p>
          <h1 className="mt-2 text-4xl font-black">
            {moduleConfig?.label || "HRMS Module"}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            {moduleConfig?.description ||
              data?.error ||
              "Clinical workforce module for daily hospital operations."}
          </p>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
                HRMS Operations
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {moduleConfig?.label || "HRMS Module"}
              </h2>
              <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600">
                Create, search, filter, view, edit, delete, export, print, and review operational records directly from the module workspace.
              </p>
            </div>
          <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 rounded-[8px] bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-sm"
              >
                <Plus size={16} />
                Create
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-sm"
              >
                <Download size={16} />
                Export Excel
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-sm"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                ref={searchRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input !pl-11"
                placeholder={`Search ${moduleConfig?.label || "records"}...`}
              />
            </label>
            <button
              type="button"
              onClick={focusSearch}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-sm"
            >
              <Filter size={16} />
              Filters
            </button>
            <div className="inline-flex overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode("GRID")}
                className={`rounded-[7px] px-3 py-2 text-sm font-black ${viewMode === "GRID" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                Grid View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("CARD")}
                className={`rounded-[7px] px-3 py-2 text-sm font-black ${viewMode === "CARD" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                Card View
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title="Records"
            value={metrics.total}
            icon={ShieldCheck}
            drillDownUrl={`/clinical-services/hrms/${key}`}
            caption="Open operational records"
          />
          <DashboardCard
            title="Today"
            value={metrics.today}
            icon={ShieldCheck}
            drillDownUrl={`/clinical-services/hrms/${key}?date=today`}
            caption="Today's records"
          />
          <DashboardCard
            title="Tenant Scope"
            value="Isolated"
            icon={ShieldCheck}
            drillDownUrl="/clinical-services/security"
            caption="Security context"
          />
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-[#8a6500]">
                Operational Workspace
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {filteredRows.length} Records
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase text-slate-600">
              Search, filter, view, edit, delete, audit
            </div>
          </div>

          {filteredRows.length ? (
            <div className="mt-4 grid gap-4">
              {viewMode === "GRID" ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredRows.map((row, index) => (
                    <OperationalRecordCard
                      key={`${moduleConfig?.key}-${index}`}
                      row={row}
                      label={moduleConfig?.label || "HRMS Record"}
                      category={moduleConfig?.category || "HRMS"}
                      columns={moduleConfig?.primaryColumns || []}
                      moduleKey={key}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                filteredRows.map((row, index) => (
                  <div
                    key={`${moduleConfig?.key}-${index}`}
                    className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
                          {recordEyebrow(row)}
                        </p>
                        <h3 className="mt-1 truncate text-xl font-black text-slate-950">
                          {recordTitle(row, moduleConfig?.label || "HRMS Record")}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          {recordSubtitle(row, moduleConfig?.primaryColumns || [])}
                        </p>
                      </div>
                      <span className="rounded-[8px] bg-white px-3 py-1 text-xs font-black uppercase text-emerald-700 shadow-sm">
                        {String(row.status || row.employee_status || row.approval_status || "ACTIVE")}
                      </span>
                    </div>
                    <div className="mt-4">
                      <RecordCard
                        row={row}
                        columns={moduleConfig?.primaryColumns || []}
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <ActionButton
                        as="link"
                        href={`/clinical-services/hrms/${key}/${row.id}`}
                        label="View"
                        icon={<Eye size={15} />}
                      />
                      <ActionButton
                        as="link"
                        href={`/clinical-services/hrms/${key}/${row.id}?mode=edit`}
                        label="Edit"
                        icon={<Pencil size={15} />}
                      />
                      <ActionButton
                        onClick={() => handleDelete(row.id as number | string)}
                        label="Delete"
                        icon={<Trash2 size={15} />}
                        danger
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
              No matching operational records found.
            </div>
          )}
        </section>

        {feedback ? (
          <section className="rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
            {feedback}
          </section>
        ) : null}
      </div>

      {createOpen ? (
        <CreateHrmsRecordModal
          moduleLabel={moduleConfig?.label || "HRMS Record"}
          primaryColumns={moduleConfig?.primaryColumns || []}
          values={formValues}
          saving={saving}
          onClose={() => setCreateOpen(false)}
          onChange={(column, value) =>
            setFormValues((current) => ({
              ...current,
              [column]: value,
            }))
          }
          onSave={handleCreate}
        />
      ) : null}
    </ClinicalShell>
  );
}

function OperationalRecordCard({
  row,
  label,
  category,
  columns,
  moduleKey,
  onDelete,
}: {
  row: Row;
  label: string;
  category: string;
  columns: string[];
  moduleKey: string;
  onDelete: (id: number | string) => Promise<void>;
}) {
  const recordId = row.id as number | string;
  return (
    <article className="rounded-[8px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
            {category}
          </p>
          <h3 className="mt-1 truncate text-xl font-black text-slate-950">
            {recordTitle(row, label)}
          </h3>
          <p className="mt-1 truncate text-sm font-semibold text-slate-600">
            {recordSubtitle(row, columns)}
          </p>
        </div>
        <span className="rounded-[8px] bg-white px-3 py-1 text-xs font-black uppercase text-emerald-700 shadow-sm">
          {String(row.status || row.employee_status || row.approval_status || "ACTIVE")}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        {columns.slice(0, 4).map((column) => (
          <div
            key={column}
            className="flex min-w-0 items-center justify-between gap-3 rounded-[8px] border border-slate-200 bg-white px-3 py-2"
          >
            <span className="truncate font-bold text-slate-500">
              {formatLabel(column)}
            </span>
            <span className="truncate font-semibold text-slate-950">
              {formatValue(row[column])}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton
          as="link"
          href={`/clinical-services/hrms/${moduleKey}/${recordId}`}
          label="View"
          icon={<Eye size={15} />}
        />
        <ActionButton
          as="link"
          href={`/clinical-services/hrms/${moduleKey}/${recordId}?mode=edit`}
          label="Edit"
          icon={<Pencil size={15} />}
        />
        <ActionButton
          onClick={() => void onDelete(recordId)}
          label="Delete"
          icon={<Trash2 size={15} />}
          danger
        />
      </div>
    </article>
  );
}

function recordTitle(row: Row, fallback: string) {
  const firstColumn =
    Object.entries(row).find(
      ([key, value]) =>
        key.endsWith("_name") &&
        value !== null &&
        value !== undefined
    )?.[1] ??
    row.employee_number ??
    row.employee_id ??
    row.course_name ??
    row.shift_name ??
    row.id;

  return String(firstColumn || fallback);
}

function recordSubtitle(row: Row, columns: string[]) {
  const values = columns
    .slice(0, 3)
    .map((column) => formatValue(row[column]))
    .filter((value) => value !== "-");
  return values.join(" • ") || "Operational record";
}

function recordEyebrow(row: Row) {
  return String(
    row.employee_id ||
      row.course_id ||
      row.shift_code ||
      row.policy_key ||
      row.requisition_number ||
      row.candidate_id ||
      row.id ||
      "Record"
  );
}

function RecordCard({
  row,
  columns,
}: {
  row: Row;
  columns: string[];
}) {
  const visibleColumns = columns.length ? columns : Object.keys(row).slice(0, 6);

  return (
    <article className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 transition hover:border-[#D4AF37] hover:bg-white hover:shadow-md">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleColumns.map((column) => (
          <div key={column} className="min-w-0">
            <p className="text-[11px] font-black uppercase text-slate-500">
              {formatLabel(column)}
            </p>
            <p className="mt-1 break-words text-sm font-bold text-slate-950">
              {formatValue(row[column])}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function ActionButton({
  label,
  icon,
  danger = false,
  onClick,
  href,
  as,
}: {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
  href?: string;
  as?: "link" | "button";
}) {
  const className = `inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-black shadow-sm ${danger ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-950"}`;

  if (as === "link") {
    return (
      <Link href={href || "#"} className={className}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {icon}
      {label}
    </button>
  );
}

function CreateHrmsRecordModal({
  moduleLabel,
  primaryColumns,
  values,
  saving,
  onClose,
  onChange,
  onSave,
}: {
  moduleLabel: string;
  primaryColumns: string[];
  values: Record<string, string>;
  saving: boolean;
  onClose: () => void;
  onChange: (column: string, value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[8px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
              Create Record
            </p>
            <h3 className="mt-1 text-2xl font-black text-slate-950">
              {moduleLabel}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-950"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {primaryColumns.map((column) => (
            <label key={column} className="block">
              <span className="mb-2 block text-sm font-black text-slate-950">
                {formatLabel(column)}
              </span>
              <input
                value={values[column] || ""}
                onChange={(event) =>
                  onChange(column, event.target.value)
                }
                className="input"
                placeholder={`Enter ${formatLabel(column)}`}
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-950">
              Status
            </span>
            <input
              value={values.status || "ACTIVE"}
              onChange={(event) =>
                onChange("status", event.target.value)
              }
              className="input"
              placeholder="ACTIVE"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-[8px] bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function csvEscape(value: unknown) {
  const text = formatValue(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}
