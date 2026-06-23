"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  Bell,
  ClipboardList,
  Database,
  FileText,
  GitBranch,
  KeyRound,
  Mail,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import {
  getBusinessSpecModuleConfig,
  type BusinessSpecModuleConfig,
} from "@/lib/clinical/business-spec-core";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: BusinessSpecModuleConfig;
  metrics?: Record<string, string | number | null>;
  rows?: Row[];
};

const moduleIcons: Record<string, LucideIcon> = {
  screens: ClipboardList,
  fields: GitBranch,
  dropdowns: ClipboardList,
  validations: ShieldCheck,
  workflows: Workflow,
  states: Workflow,
  approvals: KeyRound,
  reports: FileText,
  "report-columns": FileText,
  exports: Database,
  templates: Mail,
  audit: ShieldCheck,
  sensitive: ShieldCheck,
  documents: Bell,
};

export default function ClinicalBusinessSpecModulePage() {
  const params =
    useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const config = useMemo(
    () => getBusinessSpecModuleConfig(moduleKey),
    [moduleKey]
  );
  const [data, setData] =
    useState<ModulePayload | null>(null);

  const load = useCallback(async () => {
    if (!config) {
      return;
    }

    const response = await fetch(
      `/api/clinical/business-spec/${moduleKey}`
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
              Unknown Business Specification Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This Phase 15 business-spec module is not registered.
            </p>
          </section>
        </div>
      </ClinicalShell>
    );
  }

  const Icon =
    moduleIcons[moduleKey] || ClipboardList;
  const rows = data?.rows || [];

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <Link
          href="/clinical-services/business-spec"
          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#0B1F3A] shadow-sm"
        >
          <ArrowLeft size={16} />
          Business Specs
        </Link>

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
                {config.description}
              </p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-[8px] border border-[#D4AF37]/60 bg-white/10 text-[#D4AF37]">
              <Icon size={30} />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric
            icon={Database}
            title="Records"
            value={data?.metrics?.total}
          />
          <Metric
            icon={FileText}
            title="Primary Fields"
            value={config.primaryColumns.length}
          />
          <Metric
            icon={ShieldCheck}
            title="Tenant Scoped"
            value="Yes"
          />
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">
                Specification Records
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Showing `{config.table}` for the active tenant, hospital,
                and branch.
              </p>
            </div>
            <p className="rounded-[8px] bg-[#fff3d0] px-4 py-2 text-xs font-black uppercase text-[#8a6500]">
              {String(data?.metrics?.total ?? 0)} total
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            {rows.length ? (
              rows.map((row, index) => (
                <BusinessSpecRow
                  key={String(row.id || index)}
                  row={row}
                  columns={config.primaryColumns}
                  moduleKey={moduleKey}
                />
              ))
            ) : (
              <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
                No business-spec records found.
              </p>
            )}
          </div>
        </section>
      </div>
    </ClinicalShell>
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
    <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">
          {title}
        </p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#fff3d0] text-[#8a6500]">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-4xl font-black text-[#0B1F3A]">
        {String(value ?? 0)}
      </p>
    </div>
  );
}

function BusinessSpecRow({
  row,
  columns,
  moduleKey,
}: {
  row: Row;
  columns: string[];
  moduleKey: string;
}) {
  const titleColumn =
    columns.find((column) =>
      column.endsWith("_name")
    ) ||
    columns.find((column) =>
      column.endsWith("_label")
    ) ||
    columns[0];

  return (
    <ClinicalRecordCard
      href={`/clinical-services/business-spec/${moduleKey}/${row.id}`}
      eyebrow={`ID ${String(row.id || "-")}`}
      title={formatValue(row[titleColumn])}
      description="Business specification record"
      status={String(row.status || row.approval_status || "-")}
      editHref={`/clinical-services/business-spec/${moduleKey}?record=${row.id}&mode=edit`}
      auditHref={`/clinical-services/business-spec/${moduleKey}/${row.id}#audit`}
      historyHref={`/clinical-services/business-spec/${moduleKey}/${row.id}#history`}
    >
      <p className="break-words text-lg font-black text-[#0B1F3A]">
        {formatValue(row[titleColumn])}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <div
            key={column}
            className="rounded-[8px] border border-slate-200 bg-white p-3"
          >
            <p className="text-[11px] font-black uppercase text-slate-500">
              {column.replaceAll("_", " ")}
            </p>
            <p className="mt-1 break-words text-sm font-bold text-slate-800">
              {formatValue(row[column])}
            </p>
          </div>
        ))}
      </div>
    </ClinicalRecordCard>
  );
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}
