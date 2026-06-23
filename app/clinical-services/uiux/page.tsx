"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Database,
  LayoutGrid,
  Monitor,
  Palette,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { uiuxDashboardModules } from "@/lib/clinical/uiux-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  namedScreens?: Row[];
  navigation?: Row[];
  dashboards?: Row[];
  components?: Row[];
  workflows?: Row[];
  mobileApps?: Row[];
  accessibility?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "design-tokens",
    "Design Tokens",
    Palette,
    "Gold, navy, white, typography, radius, spacing, shadow, and layout tokens.",
  ],
  [
    "screen-specs",
    "Screen Specifications",
    Monitor,
    "560 screen specs covering enterprise, clinical, mobile, workflow, and AI experiences.",
  ],
  [
    "dashboards",
    "Dashboards",
    BarChart3,
    "120 command-center dashboard blueprints with KPIs, charts, filters, export, and AI insight regions.",
  ],
  [
    "components",
    "Components",
    LayoutGrid,
    "220 reusable React, Tailwind, and ShadCN component specifications.",
  ],
  [
    "workflows",
    "Workflows",
    Workflow,
    "Registration, appointment, consultation, billing, payment, IVF, lab, claims, AI, and mobile flows.",
  ],
  [
    "accessibility",
    "Accessibility",
    ShieldCheck,
    "WCAG 2.1 AA, keyboard, screen reader, high contrast, focus, touch, and overflow rules.",
  ],
];

export default function ClinicalUiuxPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/uiux/registry"
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
            Screen-by-Screen UI/UX Blueprint
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Clinical Design System Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Phase 11 converts the clinical frontend vision into a database-backed
            blueprint for Next.js, React components, Tailwind, ShadCN,
            navigation, workflows, dashboards, mobile views, accessibility,
            dark mode, and hospital branding.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Database}
            title="UI Tables"
            value={counts.ui_tables}
          />
          <Metric
            icon={Palette}
            title="Tokens"
            value={counts.design_tokens}
          />
          <Metric
            icon={Monitor}
            title="Screens"
            value={counts.screen_specs}
          />
          <Metric
            icon={BarChart3}
            title="Dashboards"
            value={counts.dashboards}
          />
          <Metric
            icon={LayoutGrid}
            title="Components"
            value={counts.components}
          />
          <Metric
            icon={Workflow}
            title="Workflows"
            value={counts.workflows}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/uiux/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Phase 11 Blueprint
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
          <Panel title="Named Screens From Prompt">
            <Rows
              rows={data?.namedScreens || []}
              empty="No named Phase 11 screens loaded."
              primary={(row) =>
                String(row.screen_name || "-")
              }
              secondary={(row) =>
                `${row.module_key || "-"} | ${row.route_path || "-"} | ${row.screen_type || "-"}`
              }
            />
          </Panel>
          <Panel title="Navigation Blueprint">
            <Rows
              rows={data?.navigation || []}
              empty="No navigation blueprint loaded."
              primary={(row) =>
                String(row.label || "-")
              }
              secondary={(row) =>
                `${row.parent_key || "root"} | ${row.route_path || "-"} | ${row.audience_role || "ALL"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Dashboard Framework">
            <Rows
              rows={data?.dashboards || []}
              empty="No dashboard specifications loaded."
              primary={(row) =>
                String(row.dashboard_name || "-")
              }
              secondary={(row) =>
                `${row.dashboard_type || "-"} | ${row.audience_role || "-"}`
              }
            />
          </Panel>
          <Panel title="Mobile App UI">
            <Rows
              rows={data?.mobileApps || []}
              empty="No mobile app specifications loaded."
              primary={(row) =>
                String(row.app_name || "-")
              }
              secondary={(row) =>
                `${row.audience_role || "-"} | ${compactJson(row.screen_groups)}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Phase 11 Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {uiuxDashboardModules.map((module) => (
              <Link
                key={module.key}
                href={`/clinical-services/uiux/${module.key}`}
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
          key={String(row.id || row.screen_key || row.navigation_key || index)}
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

  return text.length > 120
    ? `${text.slice(0, 120)}...`
    : text;
}
