"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Binary,
  BookOpen,
  Database,
  FileCode2,
  FileText,
  GitBranch,
  KeyRound,
  Network,
  ShieldCheck,
  Table2,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { dictionaryDashboardModules } from "@/lib/clinical/dictionary-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  groups?: Row[];
  modules?: Row[];
  reports?: Row[];
  diagrams?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "entities",
    "Entity Catalog",
    Table2,
    "1000+ generation-ready entity definitions with table names, module ownership, RBAC actions, and schema blueprints.",
  ],
  [
    "fields",
    "Field Catalog",
    Binary,
    "5000+ field definitions covering UUID tenancy, audit/version fields, data types, Prisma types, and validation rules.",
  ],
  [
    "relationships",
    "Relationships",
    GitBranch,
    "Foreign key map for patient, appointment, OP, IP, IVF, lab, radiology, billing, claims, finance, and audit flows.",
  ],
  [
    "constraints",
    "Constraints",
    KeyRound,
    "Primary key, tenant scope, status, version, uniqueness, and validation constraints for generated schemas.",
  ],
  [
    "indexes",
    "Indexes",
    Database,
    "Tenant, hospital, branch, patient, doctor, appointment, admission, claim, and invoice indexing strategy.",
  ],
  [
    "er-diagrams",
    "ER Diagrams",
    Network,
    "Mermaid ER blueprints for patient care, IVF, finance, claims, and generation documentation.",
  ],
  [
    "generation-rules",
    "Generation Rules",
    FileCode2,
    "Rules for PostgreSQL schema, Prisma models, NestJS entities, DTOs, APIs, RBAC, reports, and seed data.",
  ],
  [
    "retention",
    "Retention Policies",
    ShieldCheck,
    "Clinical, insurance, audit, AI, and system-log retention and archival policies.",
  ],
];

export default function ClinicalDictionaryPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/dictionary/registry"
        );

        if (response.ok) {
          setData(await response.json());
        }
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, []);

  const counts = data?.counts || {};

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#0B1F3A] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Master Data Model + Generation Blueprint
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Database Dictionary Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Phase 10 foundation for generating PostgreSQL schemas, Prisma
            models, NestJS entities, DTOs, APIs, relationships, constraints,
            indexes, RBAC, reports, retention policies, archival policies,
            and ER diagrams without guessing.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Database}
            title="Dictionary Tables"
            value={counts.dictionary_tables}
          />
          <Metric
            icon={BookOpen}
            title="Entity Groups"
            value={counts.entity_groups}
          />
          <Metric
            icon={Table2}
            title="Entities"
            value={counts.entities}
          />
          <Metric
            icon={Binary}
            title="Fields"
            value={counts.fields}
          />
          <Metric
            icon={GitBranch}
            title="Relationships"
            value={counts.relationships}
          />
          <Metric
            icon={KeyRound}
            title="Constraints"
            value={counts.constraints}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Database}
            title="Indexes"
            value={counts.indexes}
          />
          <Metric
            icon={Network}
            title="ER Diagrams"
            value={counts.er_diagrams}
          />
          <Metric
            icon={Workflow}
            title="API Specs"
            value={counts.api_endpoints}
          />
          <Metric
            icon={FileText}
            title="Reports"
            value={counts.reports}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/dictionary/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Dictionary Platform
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {label}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {summary}
                </p>
              </Link>
            )
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Entity Groups">
            <Rows
              rows={data?.groups || []}
              empty="No dictionary entity groups loaded."
              primary={(row) =>
                String(row.group_name || "-")
              }
              secondary={(row) =>
                `${row.group_key || "-"} | ${row.description || ""}`
              }
            />
          </Panel>
          <Panel title="ER Diagrams">
            <Rows
              rows={data?.diagrams || []}
              empty="No ER diagrams configured."
              primary={(row) =>
                String(row.diagram_name || "-")
              }
              secondary={(row) =>
                `${row.diagram_type || "MERMAID"} | ${JSON.stringify(row.entity_keys || [])}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Phase 10 Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {dictionaryDashboardModules.map((module) => (
              <Link
                key={module.key}
                href={`/clinical-services/dictionary/${module.key}`}
                className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-black transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                {module.label}
                <span className="mt-1 block text-xs font-bold text-slate-500">
                  {module.category}
                </span>
              </Link>
            ))}
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
