"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  CalendarClock,
  ClipboardList,
  Database,
  Fingerprint,
  MapPin,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { DashboardCard } from "@/components/clinical/EnterpriseDashboard";
import { hrmsDashboardModules } from "@/lib/clinical/hrms-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  employees?: Row[];
  attendancePolicies?: Row[];
  shifts?: Row[];
  courses?: Row[];
  reports?: Row[];
  expiringLicenses?: Row[];
  apiSamples?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "employees",
    "Employee Master",
    UsersRound,
    "Doctors, nurses, embryologists, technicians, pharmacy, finance, HR, and corporate workforce profiles.",
  ],
  [
    "attendance",
    "Geo Attendance",
    MapPin,
    "Mobile and web attendance with hospital-coordinate validation and one-meter radius policy.",
  ],
  [
    "biometric",
    "Biometric Integration",
    Fingerprint,
    "ZKTeco, eSSL, Matrix, Realtime, and Mantra device registry with sync evidence.",
  ],
  [
    "roster",
    "Roster Management",
    CalendarClock,
    "Ward, department, nurse, doctor, and staff shift planning.",
  ],
  [
    "payroll",
    "Payroll",
    Wallet,
    "Attendance, overtime, deductions, salary calculation, approval, and payslip workflow.",
  ],
  [
    "credentialing",
    "Doctor Credentialing",
    Stethoscope,
    "Medical council number, qualification, specialization, documents, and license expiry.",
  ],
  [
    "privileges",
    "Doctor Privileging",
    BadgeCheck,
    "IVF procedures, surgeries, endoscopy, ICU, and emergency privilege approval flow.",
  ],
  [
    "lms",
    "LMS + Compliance Training",
    BookOpenCheck,
    "HIPAA, GDPR, NABH, infection control, fire safety, patient safety, IVF, and technology courses.",
  ],
  [
    "analytics",
    "HR Analytics",
    BarChart3,
    "Headcount, attrition, attendance, training compliance, payroll cost, and productivity analytics.",
  ],
];

export default function ClinicalHrmsPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/hrms/registry"
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
            Phase 17 HRMS + Payroll + Credentialing + LMS
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Hospital Workforce Management Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Workforce platform for hospital staff, doctors, nurses,
            embryologists, lab technicians, radiology staff, pharmacists,
            finance teams, corporate teams, credentialing, privileging,
            compliance learning, payroll, and geo-validated attendance.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <DashboardCard
            icon={UsersRound}
            title="Employees"
            value={counts.employees}
            drillDownUrl="/clinical-services/hrms/employees"
            caption="Employee master"
          />
          <DashboardCard
            icon={ClipboardList}
            title="Attendance"
            value={counts.attendance || 0}
            drillDownUrl="/clinical-services/hrms/attendance"
            caption="Geo attendance"
          />
          <DashboardCard
            icon={Activity}
            title="Shifts"
            value={data?.shifts?.length || 0}
            drillDownUrl="/clinical-services/hrms/roster"
            caption="Roster management"
          />
          <DashboardCard
            icon={ShieldCheck}
            title="License Alerts"
            value={data?.expiringLicenses?.length || 0}
            drillDownUrl="/clinical-services/hrms/licenses"
            caption="Expiring credentials"
          />
          <DashboardCard
            icon={Wallet}
            title="Payroll"
            value={counts.payroll || 0}
            drillDownUrl="/clinical-services/hrms/payroll"
            caption="Payroll processing"
          />
          <DashboardCard
            icon={BookOpenCheck}
            title="Training"
            value={data?.courses?.length || 0}
            drillDownUrl="/clinical-services/hrms/lms"
            caption="LMS courses"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/hrms/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Workforce
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
          <Panel title="Geo Attendance Policy">
            <Rows
              rows={
                data?.attendancePolicies ||
                []
              }
              href="/clinical-services/hrms/attendance"
              empty="No geo attendance policy registered."
              primary={(row) =>
                `${row.policy_key || "-"} | ${row.allowed_radius_meters || 1} meter radius`
              }
              secondary={(row) =>
                `lat ${row.latitude || "not set"} | lng ${row.longitude || "not set"} | mobile ${row.mobile_attendance_enabled ? "enabled" : "disabled"}`
              }
            />
          </Panel>
          <Panel title="Shift Master">
            <Rows
              rows={data?.shifts || []}
              href="/clinical-services/hrms/roster"
              empty="No shifts registered."
              primary={(row) =>
                `${row.shift_code || "-"} - ${row.shift_name || "-"}`
              }
              secondary={(row) =>
                `${row.shift_type || "-"} | ${row.start_time || "-"} to ${row.end_time || "-"} | grace ${row.grace_minutes || 0} min`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Mandatory LMS Courses">
            <Rows
              rows={data?.courses || []}
              href="/clinical-services/hrms/lms"
              empty="No LMS courses registered."
              primary={(row) =>
                `${row.course_id || "-"} - ${row.course_name || "-"}`
              }
              secondary={(row) =>
                `${row.category || "-"} | ${row.duration_hours || 0} hours | ${row.instructor || "-"}`
              }
            />
          </Panel>
          <Panel title="License Expiry Alerts">
            <Rows
              rows={
                data?.expiringLicenses || []
              }
              href="/clinical-services/hrms/credentialing"
              empty="No licenses expiring in the next 90 days."
              primary={(row) =>
                `${row.license_type || "-"} - ${row.license_number || "-"}`
              }
              secondary={(row) =>
                `${row.expiry_date || "-"} | ${row.authority || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="HR Reports">
            <Rows
              rows={data?.reports || []}
              href="/clinical-services/analytics/hr-analytics"
              empty="No HR reports registered."
              primary={(row) =>
                String(
                  row.report_name || "-"
                )
              }
              secondary={(row) =>
                `${row.report_category || "-"} | ${(row.output_formats as string) || "PDF, Excel, CSV"}`
              }
            />
          </Panel>
          <Panel title="Workforce Planning">
            <Rows
              rows={data?.employees || []}
              href="/clinical-services/hrms/employees"
              empty="No workforce records yet."
              primary={(row) =>
                String(
                  row.employee_name ||
                    row.full_name ||
                    row.employee_number ||
                    "Employee"
                )
              }
              secondary={(row) =>
                `${row.department_name || row.department || "-"} | ${row.status || "ACTIVE"}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Phase 17 Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {hrmsDashboardModules.map(
              (module) => (
                <Link
                  key={module.key}
                  href={`/clinical-services/hrms/${module.key}`}
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
  href,
  empty,
  primary,
  secondary,
}: {
  rows: Row[];
  href?: string;
  empty: string;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
        {empty}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <Link
          key={`${primary(row)}-${index}`}
          href={
            href
              ? `${href}?record=${row.id || index}`
              : "#"
          }
          className="block rounded-[8px] border border-slate-200 bg-slate-50 p-4 transition hover:border-[#D4AF37] hover:bg-white hover:shadow-md"
        >
          <p className="text-sm font-black text-slate-950">
            {primary(row)}
          </p>
          <p className="mt-1 break-words text-xs font-semibold text-slate-600">
            {secondary(row)}
          </p>
        </Link>
      ))}
    </div>
  );
}
