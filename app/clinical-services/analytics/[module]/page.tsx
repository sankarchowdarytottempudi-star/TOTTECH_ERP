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
  AlertTriangle,
  BarChart3,
  Brain,
  Database,
  FileText,
  Plus,
  TrendingUp,
  Warehouse,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import {
  getAnalyticsModuleConfig,
  type AnalyticsModuleConfig,
} from "@/lib/clinical/analytics-core";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: AnalyticsModuleConfig;
  metrics?: Record<string, string | number | null>;
  rows?: Row[];
  screens?: Row[];
  reports?: Row[];
  endpoints?: Row[];
  insights?: Row[];
};

const defaultStatus: Record<string, string> = {
  "data-warehouse": "READY",
  "kpi-engine": "ACTIVE",
  "ceo-dashboard": "ACTIVE",
  "cfo-dashboard": "ACTIVE",
  "medical-director": "ACTIVE",
  "ivf-analytics": "ACTIVE",
  "lab-analytics": "ACTIVE",
  "radiology-analytics": "ACTIVE",
  "pharmacy-analytics": "ACTIVE",
  "insurance-analytics": "ACTIVE",
  "referral-analytics": "ACTIVE",
  "patient-analytics": "ACTIVE",
  "hr-analytics": "ACTIVE",
  "ot-analytics": "ACTIVE",
  "bed-analytics": "ACTIVE",
  "ai-insights": "OPEN",
  forecasting: "DRAFT",
  "report-builder": "ACTIVE",
  "scheduled-reports": "ACTIVE",
  "export-center": "PENDING",
  "bi-integration": "CONFIGURED",
  "executive-alerts": "ACTIVE",
  "data-lake": "ACTIVE",
};

const moduleIcons: Record<string, LucideIcon> = {
  "data-warehouse": Warehouse,
  "kpi-engine": BarChart3,
  "ceo-dashboard": TrendingUp,
  "cfo-dashboard": BarChart3,
  "medical-director": Activity,
  "ai-insights": Brain,
  forecasting: TrendingUp,
  "executive-alerts": AlertTriangle,
  "data-lake": Database,
};

export default function ClinicalAnalyticsModulePage() {
  const params =
    useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const config = useMemo(
    () => getAnalyticsModuleConfig(moduleKey),
    [moduleKey]
  );
  const [data, setData] =
    useState<ModulePayload | null>(null);
  const [form, setForm] =
    useState<Record<string, string>>({});
  const [saving, setSaving] =
    useState(false);

  const load = useCallback(async () => {
    if (!config) {
      return;
    }

    const response = await fetch(
      `/api/clinical/analytics/${moduleKey}`
    );

    if (response.ok) {
      setData(await response.json());
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
              Unknown Analytics Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This module is not registered in the Phase 9 intelligence platform.
            </p>
          </section>
        </div>
      </ClinicalShell>
    );
  }

  const Icon =
    moduleIcons[moduleKey] || BarChart3;

  const save = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/clinical/analytics/${moduleKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            module_key:
              form.module_key || moduleKey,
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
            "Analytics record could not be saved."
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
      `/api/clinical/analytics/${moduleKey}?id=${id}`,
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
                {config.category}
              </p>
              <h1 className="mt-2 text-4xl font-black">
                {config.label}
              </h1>
              <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
                Real-time analytics workspace with tenant-isolated metrics,
                BI evidence, report definitions, API contracts, AI insight
                review, exports, schedules, and executive drilldowns.
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

          <Panel title="Dashboard Evidence">
            <Rows
              rows={data?.screens || []}
              empty="No screen definitions registered."
              primary={(row) =>
                String(row.screen_name || "-")
              }
              secondary={(row) =>
                `${row.dashboard_type || config.category} | ${row.route_path || "-"}`
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
                    href={`/clinical-services/analytics/${moduleKey}/${row.id}`}
                    eyebrow={`ID ${String(row.id)}`}
                    title={recordTitle(row, config)}
                    description={`${config.category} | ${config.label}`}
                    status={String(
                      row.status ||
                        row.alert_status ||
                        row.export_status ||
                        "-"
                    )}
                    editHref={`/clinical-services/analytics/${moduleKey}?record=${row.id}&mode=edit`}
                    auditHref={`/clinical-services/analytics/${moduleKey}/${row.id}#audit`}
                    historyHref={`/clinical-services/analytics/${moduleKey}/${row.id}#history`}
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
                  No records created yet for this analytics workflow.
                </div>
              )}
            </div>
          </Panel>

          <Panel title="Reports, APIs, and AI Insights">
            <div className="grid gap-4">
              <EvidenceBlock
                title="AI Insight Queue"
                rows={data?.insights || []}
                empty="No AI insight records for this module yet."
                primary={(row) =>
                  String(row.title || "-")
                }
                secondary={(row) =>
                  `${row.severity || "INFO"} | ${row.status || "-"} | Confidence ${row.confidence_score || "-"}`
                }
              />
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
                title="Report Definitions"
                rows={data?.reports || []}
                empty="No report definitions registered."
                primary={(row) =>
                  String(row.report_name || "-")
                }
                secondary={(row) =>
                  `${row.report_category || "Analytics"} | ${row.output_formats || "-"}`
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
  onChange,
}: {
  column: string;
  config: AnalyticsModuleConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  const label = column.split("_").join(" ");
  const required =
    config.requiredColumns?.includes(column);

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
        column === "last_watermark"
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
  config: AnalyticsModuleConfig
) {
  const candidates = [
    config.uidColumn,
    "kpi_name",
    "dashboard_name",
    "widget_name",
    "report_name",
    "schedule_name",
    "job_name",
    "model_name",
    "title",
    "alert_name",
    "notification_key",
    "object_key",
    "integration_key",
    "export_key",
    "cube_name",
    "record_name",
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
