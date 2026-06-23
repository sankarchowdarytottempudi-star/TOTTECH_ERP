"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  Database,
  FileText,
  KeyRound,
  Package,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  UsersRound,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import { DashboardCard } from "@/components/clinical/EnterpriseDashboard";

type ModuleRow = {
  key: string;
  label: string;
  category: string;
  description: string;
  href: string;
  iconKey: string;
  status: "WORKING" | "PARTIAL" | "MISSING";
  tableCoverage: number;
  matchingTableCount: number;
  recordCount: number;
  requiredCapabilities: string[];
  actions: {
    label: string;
    href: string;
  }[];
};

type Payload = {
  context?: {
    hospitalName?: string;
    branchName?: string;
    roleName?: string;
  };
  totals?: {
    modules: number;
    working: number;
    partial: number;
    missing: number;
    totalKnownRecords: number;
  };
  modules?: ModuleRow[];
};

const icons: Record<string, LucideIcon> = {
  users: UsersRound,
  security_rbac: KeyRound,
  hr_employees: UsersRound,
  hrms_core: BriefcaseBusiness,
  finance_assets: Package,
  assets: Stethoscope,
  purchase_orders: ClipboardList,
  documents: FileText,
  dictionary_core: Database,
  backup: Database,
  analytics_ceo: BarChart3,
  mobile_core: Smartphone,
};

export default function ClinicalEnterpriseModulesPage() {
  const [data, setData] =
    useState<Payload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/enterprise-modules"
        );

        if (response.ok) {
          setData(await response.json());
        }
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, []);

  const modules = data?.modules || [];
  const categories = useMemo(() => {
    const grouped = new Map<
      string,
      ModuleRow[]
    >();

    for (const module of modules) {
      const existing =
        grouped.get(module.category) || [];
      existing.push(module);
      grouped.set(module.category, existing);
    }

    return Array.from(grouped.entries());
  }, [modules]);
  const totals = data?.totals || {
    modules: 0,
    working: 0,
    partial: 0,
    missing: 0,
    totalKnownRecords: 0,
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D4AF37]">
                Enterprise Completion Command Center
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
                Missing HMS Modules
              </h1>
              <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-white/90">
                Live readiness map for IAM, role builder, HRMS, payroll,
                fixed assets, biomedical equipment, procurement, vendor
                management, documents, backup/DR, executive dashboard, and
                mobile readiness for{" "}
                {data?.context?.hospitalName ||
                  "the selected hospital"}
                .
              </p>
            </div>
            <div className="rounded-[8px] border border-[#D4AF37]/50 bg-white p-5 text-[#04142E]">
              <p className="text-xs font-black uppercase text-[#8a6500]">
                Active Context
              </p>
              <p className="mt-2 text-2xl font-black">
                {data?.context?.branchName ||
                  "Clinical Branch"}
              </p>
              <p className="mt-2 text-sm font-bold text-slate-600">
                Role:{" "}
                {data?.context?.roleName ||
                  "Clinical User"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DashboardCard
            title="Enterprise Modules"
            value={totals.modules}
            icon={Workflow}
            drillDownUrl="/clinical-services/enterprise"
            caption="Mandatory HMS coverage"
          />
          <DashboardCard
            title="Working"
            value={totals.working}
            icon={ShieldCheck}
            drillDownUrl="/clinical-services/enterprise?status=working"
            caption="High table coverage"
          />
          <DashboardCard
            title="Partial"
            value={totals.partial}
            icon={AlertTriangle}
            drillDownUrl="/clinical-services/enterprise?status=partial"
            caption="Needs workflow completion"
          />
          <DashboardCard
            title="Missing"
            value={totals.missing}
            icon={AlertTriangle}
            drillDownUrl="/clinical-services/enterprise?status=missing"
            caption="No evidence tables"
          />
          <DashboardCard
            title="Known Records"
            value={totals.totalKnownRecords}
            icon={Database}
            drillDownUrl="/clinical-services/enterprise"
            caption="Tenant-scoped records"
          />
        </section>

        {categories.map(
          ([category, categoryModules]) => (
            <section
              key={category}
              className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-[#8a6500]">
                    Enterprise Domain
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {category}
                  </h2>
                </div>
                <span className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] px-4 py-2 text-xs font-black uppercase text-[#8a6500]">
                  {categoryModules.length} modules
                </span>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {categoryModules.map(
                  (module) => {
                    const Icon =
                      icons[module.iconKey] ||
                      Workflow;
                    return (
                      <ClinicalRecordCard
                        key={module.key}
                        href={module.href}
                        eyebrow={module.category}
                        title={module.label}
                        description={
                          module.description
                        }
                        status={module.status}
                        editHref={module.href}
                        auditHref="/clinical-services/security/access-logs"
                        historyHref="/clinical-services/enterprise"
                      >
                        <div className="grid gap-4 md:grid-cols-[auto_1fr]">
                          <div className="grid h-14 w-14 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
                            <Icon size={24} />
                          </div>
                          <div className="min-w-0">
                            <div className="grid gap-3 sm:grid-cols-3">
                              <Evidence
                                label="Coverage"
                                value={`${module.tableCoverage}%`}
                              />
                              <Evidence
                                label="Tables"
                                value={
                                  module.matchingTableCount
                                }
                              />
                              <Evidence
                                label="Records"
                                value={
                                  module.recordCount
                                }
                              />
                            </div>
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                              {module.requiredCapabilities.map(
                                (capability) => (
                                  <div
                                    key={capability}
                                    className="rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                                  >
                                    {capability}
                                  </div>
                                )
                              )}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {module.actions.map(
                                (action) => (
                                  <Link
                                    key={action.label}
                                    href={action.href}
                                    className="inline-flex items-center gap-2 rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#735300] transition hover:bg-white"
                                  >
                                    {action.label}
                                    <ArrowRight
                                      size={13}
                                    />
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </ClinicalRecordCard>
                    );
                  }
                )}
              </div>
            </section>
          )
        )}
      </div>
    </ClinicalShell>
  );
}

function Evidence({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-3">
      <p className="text-[11px] font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-lg font-black text-[#04142E]">
        {value}
      </p>
    </div>
  );
}
