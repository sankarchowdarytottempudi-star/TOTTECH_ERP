"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
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
import { businessSpecDashboardModules } from "@/lib/clinical/business-spec-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  screens?: Row[];
  validations?: Row[];
  workflows?: Row[];
  approvals?: Row[];
  reports?: Row[];
  templates?: Row[];
  documents?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "screens",
    "Screen Fields",
    ClipboardList,
    "Patient registration, appointment booking, OP consultation, IVF cycle, embryology, lab result entry, and claim submission.",
  ],
  [
    "validations",
    "Validation Rules",
    ShieldCheck,
    "Uniqueness, dates, active doctors, slot availability, IVF consent, critical labs, and claim-document rules.",
  ],
  [
    "workflows",
    "Workflows",
    Workflow,
    "Patient, IP, IVF, and claim workflow definitions with state progression.",
  ],
  [
    "approvals",
    "Approval Matrix",
    KeyRound,
    "Refund and discount approval rules by threshold and approver role.",
  ],
  [
    "reports",
    "Report Definitions",
    FileText,
    "Daily OP, Daily Admission, IVF Success, Lab Revenue, and Referral Revenue reports.",
  ],
  [
    "templates",
    "Communication Templates",
    Mail,
    "Email, SMS, WhatsApp, and push notification templates with variables.",
  ],
];

export default function ClinicalBusinessSpecPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/business-spec/registry"
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
            Phase 15 Business Specification Layer
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Screen, Workflow and Communication Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Final business-specification registry for screen fields,
            validation rules, dropdown values, workflows, approval matrix,
            reports, export rules, communication templates, audit rules,
            sensitive access controls, and document templates.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Database}
            title="Spec Tables"
            value={counts.business_tables}
          />
          <Metric
            icon={ClipboardList}
            title="Screens"
            value={counts.screens}
          />
          <Metric
            icon={GitBranch}
            title="Fields"
            value={counts.screen_fields}
          />
          <Metric
            icon={ShieldCheck}
            title="Validations"
            value={counts.validation_rules}
          />
          <Metric
            icon={Workflow}
            title="States"
            value={counts.workflow_states}
          />
          <Metric
            icon={Bell}
            title="Templates"
            value={counts.communication_templates}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/business-spec/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Business Spec
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
          <Panel title="Screen Specifications">
            <Rows
              rows={data?.screens || []}
              empty="No screen specifications registered."
              primary={(row) =>
                `${row.screen_id || "-"} - ${row.screen_name || "-"}`
              }
              secondary={(row) =>
                `${row.module_name || "-"} | roles ${compactJson(row.role_access)} | audit ${compactJson(row.audit_events)}`
              }
            />
          </Panel>
          <Panel title="Approval Matrix">
            <Rows
              rows={data?.approvals || []}
              empty="No approval rules registered."
              primary={(row) =>
                `${row.approval_type || "-"} ${row.condition_label || ""}`
              }
              secondary={(row) =>
                `${row.condition_expression || "-"} | approver ${row.approver_role || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Report Definitions">
            <Rows
              rows={data?.reports || []}
              empty="No report definitions registered."
              primary={(row) =>
                `${row.report_id || "-"} - ${row.report_name || "-"}`
              }
              secondary={(row) =>
                `${row.module_name || "-"} | formats ${compactJson(row.supported_formats)}`
              }
            />
          </Panel>
          <Panel title="Document Templates">
            <Rows
              rows={data?.documents || []}
              empty="No document templates registered."
              primary={(row) =>
                String(row.template_name || "-")
              }
              secondary={(row) =>
                `${row.module_name || "-"} | sections ${compactJson(row.required_sections)}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Phase 15 Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {businessSpecDashboardModules.map(
              (module) => (
                <Link
                  key={module.key}
                  href={`/clinical-services/business-spec/${module.key}`}
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
