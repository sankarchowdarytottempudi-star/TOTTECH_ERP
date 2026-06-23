"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  ClipboardList,
  FileText,
  Workflow,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { DashboardCard } from "@/components/clinical/EnterpriseDashboard";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  modules?: Row[];
  reports?: Row[];
};

const moduleLinks = [
  ["op", "OP Management"],
  ["er", "Emergency"],
  ["ip", "IP Admission"],
  ["icu", "ICU"],
  ["ot", "Operation Theatre"],
  ["nursing", "Nursing"],
  ["billing", "Billing"],
  ["insurance", "Insurance"],
];

export default function ClinicalHmsCorePage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/hms/registry"
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
        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
            HMS Core
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Hospital Operations Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-200">
            Registration, appointments, OP, IP, ER, ICU, OT,
            nursing, billing, insurance, reports, and
            Patient 360 run under tenant, hospital, and branch scope.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DashboardCard
            icon={Activity}
            title="Patients"
            value={counts.patients}
            drillDownUrl="/clinical-services/patients"
            caption="Patient search and 360"
          />
          <DashboardCard
            icon={Workflow}
            title="OP Consultations"
            value={counts.op_visits || 0}
            drillDownUrl="/clinical-services/hms/op"
            caption="Open OP workspace"
          />
          <DashboardCard
            icon={ClipboardList}
            title="Admissions"
            value={counts.admissions || 0}
            drillDownUrl="/clinical-services/hms/ip"
            caption="Open IP admissions"
          />
          <DashboardCard
            icon={BarChart3}
            title="Invoices"
            value={counts.invoices}
            drillDownUrl="/clinical-services/hms/billing"
            caption="Open billing"
          />
          <DashboardCard
            icon={FileText}
            title="Reports"
            value={counts.reports}
            drillDownUrl="/clinical-services/analytics/medical-director"
            caption="Clinical reports"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {moduleLinks.map(([key, label]) => (
            <Link
              key={key}
              href={`/clinical-services/hms/${key}`}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:bg-teal-50"
            >
              <p className="text-xs font-black uppercase text-teal-700">
                HMS Module
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {label}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                Open operational records, drill-downs, reports, and workflow actions.
              </p>
            </Link>
          ))}
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
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-4xl font-black">
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
