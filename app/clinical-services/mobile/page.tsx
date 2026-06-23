"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  Brain,
  CalendarDays,
  FileText,
  HeartPulse,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Tablet,
  UsersRound,
  Video,
  WifiOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { mobileDashboardModules } from "@/lib/clinical/mobile-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  modules?: Row[];
  reports?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "patient-dashboard",
    "Patient App",
    Smartphone,
    "Appointments, payments, reports, prescriptions, IVF progress, document vault, health tracker, and health score.",
  ],
  [
    "doctor-consultations",
    "Doctor App",
    Stethoscope,
    "Daily worklist, consultation notes, prescriptions, telemedicine, clinical templates, AI notes, and e-signature.",
  ],
  [
    "nurse-tasks",
    "Nurse App",
    HeartPulse,
    "Nursing tasks, medication administration, vitals capture, procedure tracking, and patient alerts.",
  ],
  [
    "telemedicine",
    "Telemedicine",
    Video,
    "Video sessions, chat, recordings, screen share events, quality logs, consent, and follow-up workflows.",
  ],
  [
    "referral-leads",
    "Referral App",
    UsersRound,
    "Referral leads, conversion tracking, revenue attribution, commission approvals, and payout visibility.",
  ],
  [
    "executive-kpis",
    "Executive App",
    Tablet,
    "CEO, CFO, smart TV, kiosk, corporate dashboards, engagement analytics, and app operations.",
  ],
  [
    "ai-assistant",
    "AI Patient Assistant",
    Brain,
    "Safe patient guidance, source-backed answers, clinical review warning, and AI safety observability.",
  ],
  [
    "offline-sync",
    "Offline Mode",
    WifiOff,
    "Offline queue, conflict resolution, device binding, app release channels, and security events.",
  ],
];

export default function ClinicalMobilePage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/mobile/registry"
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
            Android + iOS + Portal + Kiosk + Smart TV
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Mobile Patient Engagement Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Phase 8 foundation for the TOTTECH Patient App, Doctor App,
            Nurse App, Referral App, Corporate Portal, Telemedicine App,
            Executive App, tablet workflows, kiosk mode, smart TV dashboards,
            push notifications, offline sync, and mobile security.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Smartphone}
            title="Mobile Users"
            value={counts.mobile_users}
          />
          <Metric
            icon={ShieldCheck}
            title="Devices"
            value={counts.devices}
          />
          <Metric
            icon={CalendarDays}
            title="Appointments"
            value={counts.appointments}
          />
          <Metric
            icon={Video}
            title="Telemedicine"
            value={counts.telemedicine_sessions}
          />
          <Metric
            icon={Bell}
            title="Notifications"
            value={counts.notifications}
          />
          <Metric
            icon={Brain}
            title="AI Logs"
            value={counts.ai_logs}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={FileText}
            title="Tables"
            value={counts.mobile_tables}
          />
          <Metric
            icon={Tablet}
            title="Screens"
            value={counts.screens}
          />
          <Metric
            icon={Activity}
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
                href={`/clinical-services/mobile/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Mobile Platform
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
          <Panel title="Screen Registry">
            <Rows
              rows={data?.modules || []}
              empty="No mobile screen registry loaded."
              primary={(row) =>
                String(row.module_key || "-")
              }
              secondary={(row) =>
                `${row.app_name || "Mobile"} | ${row.screen_count || 0} screens configured`
              }
            />
          </Panel>
          <Panel title="Report Registry">
            <Rows
              rows={(data?.reports || []).slice(
                0,
                16
              )}
              empty="No mobile reports configured."
              primary={(row) =>
                String(row.report_name || "-")
              }
              secondary={(row) =>
                `${row.report_category || "Mobile"} | ${row.module_key || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6500]">
                Complete Phase 8 Workspaces
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Patient, Doctor, Nurse, Referral, Telemedicine, Corporate, and Executive Apps
              </h2>
            </div>
            <div className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff8e5] px-4 py-3 text-xs font-black uppercase text-[#8a6500]">
              Clinical review required for every AI health response
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {mobileDashboardModules.map((module) => (
              <Link
                key={module.key}
                href={
                  module.key === "dashboard"
                    ? "/clinical-services/mobile"
                    : `/clinical-services/mobile/${module.key}`
                }
                className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-black transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                {module.label}
                <span className="mt-1 block text-xs font-bold text-slate-500">
                  {module.appName}
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
