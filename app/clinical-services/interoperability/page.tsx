"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  Database,
  FileText,
  Fingerprint,
  GitBranch,
  Globe2,
  Hospital,
  Network,
  RadioTower,
  ScanLine,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { interopDashboardModules } from "@/lib/clinical/interoperability-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  modules?: Row[];
  reports?: Row[];
};

const featuredModules = [
  ["abha", "ABHA Management", Fingerprint],
  ["consents", "ABDM Consents", ShieldCheck],
  ["fhir-resources", "FHIR Server", GitBranch],
  ["hl7", "HL7 Engine", RadioTower],
  ["dicom-nodes", "DICOM Gateway", ScanLine],
  ["ayushman-claims", "Ayushman Claims", Hospital],
  ["terminology", "Terminology Server", Stethoscope],
  ["mpi", "Master Patient Index", Network],
] as const;

export default function ClinicalInteroperabilityPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/interoperability/registry"
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
            FHIR + HL7 + DICOM + ABDM + HIE
          </p>
          <h1 className="mt-2 text-4xl font-black">
            TOTTECH Interoperability Hub
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            National digital health exchange foundation for ABHA, ABDM
            consent, FHIR R4/R5, HL7, DICOM/PACS, Ayushman Bharat,
            terminology mapping, MPI, HIE, external labs, pharmacies,
            referral hospitals, and healthcare API marketplace workflows.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Fingerprint}
            title="ABHA Profiles"
            value={counts.abha_profiles}
          />
          <Metric
            icon={ShieldCheck}
            title="Consents"
            value={counts.consents}
          />
          <Metric
            icon={GitBranch}
            title="FHIR Resources"
            value={counts.fhir_resources}
          />
          <Metric
            icon={RadioTower}
            title="HL7 Messages"
            value={counts.hl7_messages}
          />
          <Metric
            icon={ScanLine}
            title="PACS Studies"
            value={counts.pacs_studies}
          />
          <Metric
            icon={Hospital}
            title="Ayushman Claims"
            value={counts.ayushman_claims}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Metric
            icon={Database}
            title="Tables"
            value={counts.interop_tables}
          />
          <Metric
            icon={FileText}
            title="Screens"
            value={counts.screens}
          />
          <Metric
            icon={Globe2}
            title="API Specs"
            value={counts.api_endpoints}
          />
          <Metric
            icon={FileText}
            title="Reports"
            value={counts.reports}
          />
          <Metric
            icon={Network}
            title="MPI Records"
            value={counts.mpi_records}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredModules.map(([key, label, Icon]) => (
            <Link
              key={key}
              href={`/clinical-services/interoperability/${key}`}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                <Icon size={21} />
              </div>
              <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                Interoperability Module
              </p>
              <h2 className="mt-1 text-2xl font-black">
                {label}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                Open records, exchange workflows, registry screens, API
                contracts, report definitions, and audit trails.
              </p>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Screen Registry">
            <Rows
              rows={data?.modules || []}
              empty="No interoperability screen registry loaded."
              primary={(row) =>
                String(row.module_key || "-")
              }
              secondary={(row) =>
                `${row.screen_count || 0} screens configured`
              }
            />
          </Panel>
          <Panel title="Report Registry">
            <Rows
              rows={(data?.reports || []).slice(0, 16)}
              empty="No interoperability reports configured."
              primary={(row) =>
                String(row.report_name || "-")
              }
              secondary={(row) =>
                `${row.report_category || "Interop"} | ${row.module_key || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Interoperability Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {interopDashboardModules.map((module) => (
              <Link
                key={module.key}
                href={`/clinical-services/interoperability/${module.key}`}
                className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-black transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                {module.label}
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
  icon: typeof Activity;
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
      <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
        {empty}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div
          key={`${primary(row)}-${index}`}
          className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
        >
          <p className="break-words font-black">
            {primary(row)}
          </p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-600">
            {secondary(row)}
          </p>
        </div>
      ))}
    </div>
  );
}
