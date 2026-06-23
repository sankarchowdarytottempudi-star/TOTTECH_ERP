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
  Boxes,
  Cloud,
  Database,
  GitBranch,
  Server,
  ShieldCheck,
  TestTube2,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import {
  getProductionModuleConfig,
  type ProductionModuleConfig,
} from "@/lib/clinical/production-core";

type Row = Record<string, unknown>;

type ModulePayload = {
  module?: ProductionModuleConfig;
  metrics?: Record<string, string | number | null>;
  rows?: Row[];
};

const moduleIcons: Record<string, LucideIcon> = {
  apps: Boxes,
  services: Server,
  packages: Boxes,
  infrastructure: Cloud,
  stack: Database,
  "prisma-rules": Database,
  "api-contracts": GitBranch,
  events: Workflow,
  security: ShieldCheck,
  testing: TestTube2,
  devops: Cloud,
  monitoring: Server,
  backups: Database,
  "go-live": ShieldCheck,
};

export default function ClinicalProductionModulePage() {
  const params =
    useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const config = useMemo(
    () => getProductionModuleConfig(moduleKey),
    [moduleKey]
  );
  const [data, setData] =
    useState<ModulePayload | null>(null);

  const load = useCallback(async () => {
    if (!config) {
      return;
    }

    const response = await fetch(
      `/api/clinical/production/${moduleKey}`
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
              Unknown Production Module
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This Phase 12 module is not registered in the production
              readiness pack.
            </p>
          </section>
        </div>
      </ClinicalShell>
    );
  }

  const Icon =
    moduleIcons[moduleKey] || Server;
  const rows = data?.rows || [];

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <Link
          href="/clinical-services/production"
          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#0B1F3A] shadow-sm"
        >
          <ArrowLeft size={16} />
          Production Readiness
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
            icon={Workflow}
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
                Production Records
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Showing records from `{config.table}` for the active tenant,
                hospital, and branch.
              </p>
            </div>
            <p className="rounded-[8px] bg-[#fff3d0] px-4 py-2 text-xs font-black uppercase text-[#8a6500]">
              {String(data?.metrics?.total ?? 0)} total
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            {rows.length ? (
              rows.map((row, index) => (
                <ProductionRow
                  key={String(row.id || index)}
                  row={row}
                  columns={config.primaryColumns}
                  moduleKey={moduleKey}
                />
              ))
            ) : (
              <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
                No production-readiness records found.
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

function ProductionRow({
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
    ) || columns[0];

  return (
    <ClinicalRecordCard
      href={`/clinical-services/production/${moduleKey}/${row.id}`}
      eyebrow={`ID ${String(row.id || "-")}`}
      title={formatValue(row[titleColumn])}
      description="Production-readiness record"
      status={String(row.status || row.environment || "-")}
      editHref={`/clinical-services/production/${moduleKey}?record=${row.id}&mode=edit`}
      auditHref={`/clinical-services/production/${moduleKey}/${row.id}#audit`}
      historyHref={`/clinical-services/production/${moduleKey}/${row.id}#history`}
    >
      <p className="text-lg font-black text-[#0B1F3A]">
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

  const text =
    typeof value === "string"
      ? value
      : JSON.stringify(value);

  return text.length > 180
    ? `${text.slice(0, 180)}...`
    : text;
}
