"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  Database,
  FileText,
  HeartPulse,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { complianceDashboardModules } from "@/lib/clinical/compliance-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  frameworks?: Row[];
  controls?: Row[];
  risks?: Row[];
  safety?: Row[];
  incidents?: Row[];
  goLive?: Row[];
  reports?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "frameworks",
    "Compliance Frameworks",
    ShieldCheck,
    "NABH, JCI, HIPAA, GDPR, ISO 27001, SOC 2, ABDM, Ayushman Bharat, and Clinical Establishment Act.",
  ],
  [
    "controls",
    "Controls",
    ClipboardList,
    "Evidence-backed controls for audits, privacy, security, patient safety, and statutory readiness.",
  ],
  [
    "safety",
    "Patient Safety",
    HeartPulse,
    "JCI international patient safety goals and evidence requirements.",
  ],
  [
    "risks",
    "Risk Register",
    AlertTriangle,
    "Clinical, financial, operational, technology, and compliance risk governance.",
  ],
  [
    "security",
    "Security Operations",
    Activity,
    "SOC events for failed logins, MFA failures, unauthorized access, mass exports, and data-leak attempts.",
  ],
  [
    "go-live",
    "Go-Live Readiness",
    Workflow,
    "Infrastructure, application, security, UAT, monitoring, backup, and audit go-live gates.",
  ],
];

export default function ClinicalCompliancePage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/compliance/registry"
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
            Phase 16 Compliance + Go-Live Governance
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Accreditation, Security and Readiness Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Compliance foundation for corporate hospitals, IVF chains,
            international deployments, accreditation audits, security audits,
            legal compliance, production go-live, clinical governance, and
            post-go-live hypercare.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Database}
            title="Tables"
            value={counts.compliance_tables}
          />
          <Metric
            icon={ShieldCheck}
            title="Frameworks"
            value={counts.frameworks}
          />
          <Metric
            icon={ClipboardList}
            title="Controls"
            value={counts.controls}
          />
          <Metric
            icon={HeartPulse}
            title="Safety Goals"
            value={counts.safety_goals}
          />
          <Metric
            icon={FileText}
            title="Reports"
            value={counts.compliance_reports}
          />
          <Metric
            icon={Database}
            title="Blueprints"
            value={counts.table_blueprints}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/compliance/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Compliance
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
          <Panel title="Framework Readiness">
            <Rows
              rows={data?.frameworks || []}
              empty="No frameworks registered."
              primary={(row) =>
                `${row.framework_name || "-"} - ${row.readiness_percent || 0}%`
              }
              secondary={(row) =>
                String(row.framework_scope || "-")
              }
            />
          </Panel>
          <Panel title="Risk Register">
            <Rows
              rows={data?.risks || []}
              empty="No risks registered."
              primary={(row) =>
                `${row.risk_id || "-"} - ${row.risk_name || "-"}`
              }
              secondary={(row) =>
                `${row.risk_category || "-"} | probability ${row.probability || "-"} | impact ${row.impact || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Patient Safety Goals">
            <Rows
              rows={data?.safety || []}
              empty="No patient-safety goals registered."
              primary={(row) =>
                String(row.goal_name || "-")
              }
              secondary={(row) =>
                `${row.jci_goal || "-"} | ${row.evidence_required || "-"}`
              }
            />
          </Panel>
          <Panel title="Go-Live Gates">
            <Rows
              rows={data?.goLive || []}
              empty="No go-live gates registered."
              primary={(row) =>
                `${row.checklist_area || "-"} - ${row.checklist_item || "-"}`
              }
              secondary={(row) =>
                `${row.status || "PENDING"} | ${row.evidence_required || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Phase 16 Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {complianceDashboardModules.map(
              (module) => (
                <Link
                  key={module.key}
                  href={`/clinical-services/compliance/${module.key}`}
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
