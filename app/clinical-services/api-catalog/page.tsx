"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Database,
  GitBranch,
  Globe2,
  Network,
  RadioTower,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { apiCatalogDashboardModules } from "@/lib/clinical/api-catalog-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  gateway?: Row[];
  rest?: Row[];
  graphql?: Row[];
  events?: Row[];
  webhooks?: Row[];
  integrations?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "rest",
    "REST APIs",
    Network,
    "1000+ /api/v1 contracts with method, path, permission, request, response, rate-limit, audit, and tenant middleware rules.",
  ],
  [
    "graphql",
    "GraphQL",
    GitBranch,
    "Patient 360, executive dashboard, analytics, and mobile operation contracts.",
  ],
  [
    "websockets",
    "WebSockets",
    RadioTower,
    "Notifications, ICU monitoring, lab updates, telemedicine, and chat realtime channels.",
  ],
  [
    "events",
    "Event Catalog",
    Workflow,
    "PatientCreated, AppointmentBooked, LabResultReady, EmbryoCreated, ClaimApproved, and generated clinical workflow events.",
  ],
  [
    "webhooks",
    "Webhooks",
    Globe2,
    "Inbound and outbound contracts for labs, insurance, ABHA, payments, claims, and reports.",
  ],
  [
    "integrations",
    "Integrations",
    ShieldCheck,
    "FHIR R4/R5, HL7, DICOM, PACS, ABHA, Ayushman Bharat, lab, insurance, and payment contracts.",
  ],
];

export default function ClinicalApiCatalogPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/api-catalog/registry"
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
            Phase 14 Complete API + Event Catalog
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Integration Contract Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Definitive backend contract registry for REST APIs, GraphQL,
            WebSockets, RabbitMQ events, webhooks, error standards, API
            versioning, rate limits, OpenAPI 3.1, and external integration
            contracts. Every contract is tenant, hospital, and branch scoped.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Database}
            title="Catalog Tables"
            value={counts.catalog_tables}
          />
          <Metric
            icon={Network}
            title="REST APIs"
            value={counts.rest_endpoints}
          />
          <Metric
            icon={GitBranch}
            title="GraphQL"
            value={counts.graphql_operations}
          />
          <Metric
            icon={RadioTower}
            title="Realtime"
            value={counts.websocket_events}
          />
          <Metric
            icon={Workflow}
            title="Events"
            value={counts.event_catalog}
          />
          <Metric
            icon={AlertTriangle}
            title="Errors"
            value={counts.error_standards}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/api-catalog/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  API Contract
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
          <Panel title="Gateway Middleware">
            <Rows
              rows={data?.gateway || []}
              empty="No gateway policies registered."
              primary={(row) =>
                String(row.policy_name || "-")
              }
              secondary={(row) =>
                `${row.middleware_order || "-"} | ${row.middleware_name || "-"} | ${row.requirement || "-"}`
              }
            />
          </Panel>
          <Panel title="REST Contract Sample">
            <Rows
              rows={data?.rest || []}
              empty="No REST contracts registered."
              primary={(row) =>
                `${row.method || "-"} ${row.path || "-"}`
              }
              secondary={(row) =>
                `${row.api_group || "-"} | ${row.permission_key || "-"} | ${row.rate_limit_policy || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Event Catalog">
            <Rows
              rows={data?.events || []}
              empty="No domain events registered."
              primary={(row) =>
                String(row.event_name || "-")
              }
              secondary={(row) =>
                `${row.event_category || "-"} | ${row.producer_service || "-"} | ${compactJson(row.consumer_services)}`
              }
            />
          </Panel>
          <Panel title="Integration Contracts">
            <Rows
              rows={data?.integrations || []}
              empty="No integrations registered."
              primary={(row) =>
                String(row.integration_name || "-")
              }
              secondary={(row) =>
                `${row.protocol || "-"} | ${row.external_system || "-"} | ${row.auth_scheme || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Phase 14 Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {apiCatalogDashboardModules.map(
              (module) => (
                <Link
                  key={module.key}
                  href={`/clinical-services/api-catalog/${module.key}`}
                  className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-black transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
                >
                  {module.label}
                  <span className="mt-1 block text-xs font-bold text-slate-500">
                    {module.category}
                  </span>
                </Link>
              )
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
      <div className="mt-4 space-y-3">
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

  return rows.slice(0, 8).map((row, index) => (
    <article
      key={String(row.id || index)}
      className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
    >
      <p className="break-words text-sm font-black text-[#0B1F3A]">
        {primary(row)}
      </p>
      <p className="mt-1 break-words text-xs font-semibold leading-5 text-slate-600">
        {secondary(row)}
      </p>
    </article>
  ));
}

function compactJson(value: unknown) {
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
