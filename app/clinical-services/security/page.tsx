"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Database,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  ShieldPlus,
  UserCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { securityDashboardModules } from "@/lib/clinical/security-core";

type Row = Record<string, unknown>;

type RegistryPayload = {
  counts?: Record<string, string | number | null>;
  roles?: Row[];
  masks?: Row[];
  recordPolicies?: Row[];
  approvals?: Row[];
  mfa?: Row[];
  reports?: Row[];
  apiGroups?: Row[];
};

const featuredModules: Array<[
  string,
  string,
  LucideIcon,
  string,
]> = [
  [
    "roles",
    "RBAC Roles",
    UserCheck,
    "Hospital access hierarchy with 100+ clinical, administrative, finance, portal, and department roles.",
  ],
  [
    "permissions",
    "Permissions",
    KeyRound,
    "5000+ action permissions across create, read, update, delete, approve, reject, export, print, share, and audit view.",
  ],
  [
    "role-permissions",
    "Role Matrix",
    ShieldCheck,
    "RBAC + ABAC role-permission matrix with scope, approval, masks, and record policies.",
  ],
  [
    "data-masks",
    "Data Masking",
    EyeOff,
    "Aadhaar, ABHA, passport, insurance policy, and mobile masking rules.",
  ],
  [
    "approval-workflows",
    "Approval Workflows",
    Workflow,
    "Refunds, commission payments, claim submission, asset disposal, stock adjustments, and discounts.",
  ],
  [
    "break-glass",
    "Break Glass",
    ShieldPlus,
    "Emergency temporary access with reason, expiry, approval, and audit.",
  ],
];

export default function ClinicalSecurityPage() {
  const [data, setData] =
    useState<RegistryPayload | null>(null);

  useEffect(() => {
    const timer =
      window.setTimeout(async () => {
        const response = await fetch(
          "/api/clinical/security/registry"
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
            Phase 13 Enterprise RBAC + ABAC
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Security Governance Command Center
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Hospital-grade role hierarchy, permission matrix, data masking,
            record-level security, field-level security, export controls,
            approval workflows, MFA, session security, access logs, break-glass
            access, and security reports.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric
            icon={Database}
            title="Security Tables"
            value={counts.security_tables}
          />
          <Metric
            icon={UserCheck}
            title="Roles"
            value={counts.roles}
          />
          <Metric
            icon={KeyRound}
            title="Permissions"
            value={counts.permissions}
          />
          <Metric
            icon={ShieldCheck}
            title="Role Matrix"
            value={counts.role_permissions}
          />
          <Metric
            icon={EyeOff}
            title="Masks"
            value={counts.data_masks}
          />
          <Metric
            icon={LockKeyhole}
            title="MFA Policies"
            value={counts.mfa_policies}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredModules.map(
            ([key, label, Icon, summary]) => (
              <Link
                key={key}
                href={`/clinical-services/security/${key}`}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#D4AF37]/15 text-[#8a6500]">
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-xs font-black uppercase text-[#8a6500]">
                  Security Governance
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
          <Panel title="Access Hierarchy">
            <Rows
              rows={data?.roles || []}
              empty="No clinical roles loaded."
              primary={(row) =>
                String(row.role_name || "-")
              }
              secondary={(row) =>
                `${row.role_category || "-"} | rank ${row.hierarchy_rank || "-"} | MFA ${row.mfa_required ? "required" : "optional"}`
              }
            />
          </Panel>
          <Panel title="Data Masking">
            <Rows
              rows={data?.masks || []}
              empty="No masking rules loaded."
              primary={(row) =>
                String(row.field_name || "-")
              }
              secondary={(row) =>
                `${row.sensitive_type || "-"} | ${row.mask_pattern || "-"} | ${row.example_masked || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Record-Level Security">
            <Rows
              rows={data?.recordPolicies || []}
              empty="No record-level policies loaded."
              primary={(row) =>
                String(row.policy_name || "-")
              }
              secondary={(row) =>
                `${row.role_key || "-"} | ${row.module_key || "-"} | ${row.rule_expression || "-"}`
              }
            />
          </Panel>
          <Panel title="Approval Workflows">
            <Rows
              rows={data?.approvals || []}
              empty="No approval workflows loaded."
              primary={(row) =>
                String(row.workflow_name || "-")
              }
              secondary={(row) =>
                `${row.module_key || "-"} | ${row.trigger_condition || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Security Reports">
            <Rows
              rows={data?.reports || []}
              empty="No security reports loaded."
              primary={(row) =>
                String(row.report_name || "-")
              }
              secondary={(row) =>
                `${row.report_category || "-"} | ${row.data_source || "-"}`
              }
            />
          </Panel>
          <Panel title="API Groups">
            <Rows
              rows={data?.apiGroups || []}
              empty="No security API groups loaded."
              primary={(row) =>
                String(row.path_prefix || "-")
              }
              secondary={(row) =>
                `${row.group_key || "-"} | ${row.description || "-"}`
              }
            />
          </Panel>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            Complete Phase 13 Workspaces
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {securityDashboardModules.map((module) => (
              <Link
                key={module.key}
                href={`/clinical-services/security/${module.key}`}
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
