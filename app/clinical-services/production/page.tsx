"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Boxes,
  Cloud,
  Database,
  GitBranch,
  Server,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { productionDashboardModules } from "@/lib/clinical/production-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  apps?: Row[];
  services?: Row[];
  security?: Row[];
  testing?: Row[];
  devops?: Row[];
  backups?: Row[];
  goLive?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "apps",
    "Monorepo Apps",
    Boxes,
    "Web admin, portals, executive dashboard, and mobile API architecture.",
  ],
  [
    "services",
    "Microservices",
    Server,
    "25 NestJS service contracts covering HMS, IVF, diagnostics, pharmacy, finance, AI, notifications, and integrations.",
  ],
  [
    "api-contracts",
    "API Contracts",
    GitBranch,
    "400 REST/OpenAPI 3.1 endpoint contracts with auth, tenant isolation, and audit requirements.",
  ],
  [
    "security",
    "Security Controls",
    ShieldCheck,
    "JWT, MFA, SSO, RBAC, ABAC, tenant isolation, encryption, audit, and AI safety.",
  ],
  [
    "testing",
    "Testing Framework",
    TestTube2,
    "Jest, Supertest, Playwright, k6, and security-test readiness.",
  ],
  [
    "devops",
    "DevOps Artifacts",
    Cloud,
    "Docker, Compose, Kubernetes, Prometheus, backups, and CI/CD deployment artifacts.",
  ],
];

export default function ClinicalProductionPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/production/registry"
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
            Phase 12 Final Production Pack
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Production Readiness Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Codex implementation pack for monorepo architecture,
            microservices, Prisma rules, REST/OpenAPI contracts, security,
            testing, Docker, Kubernetes, CI/CD, monitoring, backups, disaster
            recovery, and go-live readiness.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Database}
            title="Production Tables"
            value={counts.production_tables}
          />
          <Metric
            icon={Boxes}
            title="Apps"
            value={counts.apps}
          />
          <Metric
            icon={Server}
            title="Services"
            value={counts.services}
          />
          <Metric
            icon={GitBranch}
            title="API Contracts"
            value={counts.api_contracts}
          />
          <Metric
            icon={ShieldCheck}
            title="Security"
            value={counts.security_controls}
          />
          <Metric
            icon={BarChart3}
            title="Go-Live Gates"
            value={counts.go_live_items}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/production/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Production Pack
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
          <Panel title="Microservice Catalog">
            <Rows
              rows={data?.services || []}
              empty="No services registered."
              primary={(row) =>
                String(row.service_name || "-")
              }
              secondary={(row) =>
                `${row.api_prefix || "-"} | ${compactJson(row.responsibilities)}`
              }
            />
          </Panel>
          <Panel title="DevOps Artifacts">
            <Rows
              rows={data?.devops || []}
              empty="No DevOps artifacts registered."
              primary={(row) =>
                String(row.artifact_name || "-")
              }
              secondary={(row) =>
                `${row.artifact_type || "-"} | ${row.artifact_path || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Security Controls">
            <Rows
              rows={data?.security || []}
              empty="No security controls registered."
              primary={(row) =>
                String(row.control_name || "-")
              }
              secondary={(row) =>
                `${row.severity || "-"} | ${row.requirement || "-"}`
              }
            />
          </Panel>
          <Panel title="Go-Live Checklist">
            <Rows
              rows={data?.goLive || []}
              empty="No go-live gates registered."
              primary={(row) =>
                String(row.checklist_item || "-")
              }
              secondary={(row) =>
                `${row.checklist_category || "-"} | ${row.status || "PENDING"}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Phase 12 Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {productionDashboardModules.map((module) => (
              <Link
                key={module.key}
                href={`/clinical-services/production/${module.key}`}
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
      <div className="mt-4">
        {children}
      </div>
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
      <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
        {empty}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.slice(0, 12).map((row, index) => (
        <div
          key={String(row.id || index)}
          className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-sm font-black text-[#0B1F3A]">
            {primary(row)}
          </p>
          <p className="mt-1 break-words text-xs font-semibold text-slate-600">
            {secondary(row)}
          </p>
        </div>
      ))}
    </div>
  );
}

function compactJson(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  const text =
    typeof value === "string"
      ? value
      : JSON.stringify(value);

  return text.length > 130
    ? `${text.slice(0, 130)}...`
    : text;
}
