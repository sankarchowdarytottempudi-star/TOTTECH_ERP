"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  DatabaseBackup,
  Download,
  FileSpreadsheet,
  GitBranch,
  KeyRound,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import {
  DashboardCard,
  OperationalPanel,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";

type Row = Record<string, unknown>;

type Payload = {
  modules?: string[];
  actions?: string[];
  matrix?: Row[];
  permissions?: Row[];
  workflows?: Row[];
  reports?: Row[];
  notifications?: Row[];
  auditEvents?: Row[];
  patientTimeline?: Row[];
  backups?: Row[];
  checklist?: Row[];
  hospitalConfig?: Row;
  tenants?: Row[];
  compliance?: Record<string, number>;
};

const text = (value: unknown, fallback = "-") =>
  String(value ?? "").trim() || fallback;

const percent = (value: unknown) =>
  `${Number(value || 0).toLocaleString("en-IN")}%`;

export default function ClinicalProductionReadinessPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [workflowId, setWorkflowId] = useState("");
  const [workflowStatuses, setWorkflowStatuses] = useState("");
  const [roleKey, setRoleKey] = useState("");
  const [permissionKey, setPermissionKey] = useState("");
  const [permissionDecision, setPermissionDecision] = useState("ALLOW");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    const response = await fetch("/api/clinical/production-readiness", {
      cache: "no-store",
    });

    if (response.ok) {
      const payload = await response.json();
      setData(payload);
      const firstWorkflow = payload.workflows?.[0];
      if (firstWorkflow && !workflowId) {
        setWorkflowId(String(firstWorkflow.id));
        setWorkflowStatuses(
          Array.isArray(firstWorkflow.statuses)
            ? firstWorkflow.statuses.join(", ")
            : String(firstWorkflow.statuses || "")
        );
      }
      const firstRole = payload.matrix?.[0];
      const firstPermission = payload.permissions?.[0];
      if (firstRole && !roleKey) setRoleKey(String(firstRole.role_key || ""));
      if (firstPermission && !permissionKey) setPermissionKey(String(firstPermission.permission_key || ""));
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compliance = data?.compliance || {};
  const matrixRows = data?.matrix || [];
  const modules = data?.modules || [];
  const actions = data?.actions || [];
  const selectedWorkflow = useMemo(
    () => (data?.workflows || []).find((workflow) => String(workflow.id) === workflowId),
    [data, workflowId]
  );

  const saveWorkflow = async () => {
    setMessage("");
    const statuses = workflowStatuses
      .split(",")
      .map((item) => item.trim().toUpperCase().replace(/\s+/g, "_"))
      .filter(Boolean);
    const transitions = statuses.slice(1).map((status, index) => ({
      from: statuses[index],
      to: status,
    }));
    const response = await fetch("/api/clinical/production-readiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateWorkflow",
        workflowId,
        statuses,
        transitions,
      }),
    });
    setMessage(response.ok ? "Workflow updated." : "Workflow update failed.");
    await load();
  };

  const savePermission = async () => {
    setMessage("");
    const response = await fetch("/api/clinical/production-readiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "assignPermission",
        roleKey,
        permissionKey,
        accessDecision: permissionDecision,
      }),
    });
    setMessage(response.ok ? "Permission assignment updated." : "Permission update failed.");
    await load();
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Production Readiness Audit + SaaS Controls
          </p>
          <h1 className="mt-2 text-4xl font-black">
            First Paying Hospital Readiness
          </h1>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-white/90">
            Role permissions, configurable workflows, report definitions,
            notification templates, audit trail, backup policies, hospital
            configuration, SaaS tenant controls, and production checklists are
            validated from live tenant-scoped records.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <DashboardCard title="Overall" value={percent(compliance.overall)} icon={ClipboardCheck} drillDownUrl="/clinical-services/production-readiness" caption="Commercial readiness" loading={loading} refresh={load} />
          <DashboardCard title="Security" value={percent(compliance.security)} icon={ShieldCheck} drillDownUrl="#permissions" caption="RBAC matrix coverage" loading={loading} refresh={load} />
          <DashboardCard title="Workflows" value={percent(compliance.workflows)} icon={GitBranch} drillDownUrl="#workflows" caption="Configurable flow coverage" loading={loading} refresh={load} />
          <DashboardCard title="Reports" value={percent(compliance.reporting)} icon={FileSpreadsheet} drillDownUrl="#reports" caption="Report engine coverage" loading={loading} refresh={load} />
          <DashboardCard title="Notifications" value={percent(compliance.notifications)} icon={Bell} drillDownUrl="#notifications" caption="Template coverage" loading={loading} refresh={load} />
          <DashboardCard title="Backups" value={percent(compliance.backups)} icon={DatabaseBackup} drillDownUrl="#backups" caption="Backup policy coverage" loading={loading} refresh={load} />
        </section>

        <QuickActionsPanel
          actions={[
            { label: "Role Management", href: "#roles", icon: UsersRound },
            { label: "Permission Assignment", href: "#permission-assignment", icon: KeyRound },
            { label: "Workflow Editor", href: "#workflows", icon: GitBranch },
            { label: "Audit Search", href: "#audit", icon: Search },
          ]}
        />

        {message ? (
          <p className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-4 text-sm font-black text-[#735300]">
            {message}
          </p>
        ) : null}

        <section id="permissions" className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-[#8a6500]">Permission Matrix</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Role &gt; Module &gt; Action
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-900">
              <Download size={16} />
              Export Matrix
            </button>
          </div>
          <div className="mt-5 overflow-x-auto rounded-[8px] border border-slate-200">
            <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 p-3 font-black">Role</th>
                  {modules.map((module) => (
                    <th key={module} className="border-b border-slate-200 p-3 font-black uppercase">{module}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((role) => (
                  <tr key={String(role.role_key)} className="align-top">
                    <td className="border-b border-slate-100 p-3 font-black text-slate-950">
                      {text(role.role_name)}
                      <p className="text-xs font-bold text-slate-500">{text(role.role_key)}</p>
                    </td>
                    {((role.modules as Row[]) || []).map((module) => (
                      <td key={String(module.module)} className="border-b border-slate-100 p-3">
                        <div className="flex flex-wrap gap-1">
                          {((module.actions as Row[]) || []).map((action) => (
                            <span
                              key={String(action.action)}
                              title={String(action.permissionKey)}
                              className={`rounded px-2 py-1 text-[10px] font-black uppercase ${
                                action.allowed
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {String(action.action).slice(0, 3)}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="permission-assignment" className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase text-[#8a6500]">Role Management UI</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Permission Assignment</h2>
            <div className="mt-5 grid gap-3">
              <Select label="Role" value={roleKey} onChange={setRoleKey} options={matrixRows.map((role) => [String(role.role_key), `${role.role_name} (${role.role_key})`])} />
              <Select label="Permission" value={permissionKey} onChange={setPermissionKey} options={(data?.permissions || []).map((permission) => [String(permission.permission_key), `${permission.module_key}.${permission.action_key}`])} />
              <Select label="Decision" value={permissionDecision} onChange={setPermissionDecision} options={[["ALLOW", "ALLOW"], ["DENY", "DENY"]]} />
              <button onClick={savePermission} className="rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-[#D4AF37]">Save Permission</button>
            </div>
          </section>

          <section id="workflows" className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase text-[#8a6500]">Dynamic Workflow Engine</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Workflow Definitions</h2>
            <div className="mt-5 grid gap-3">
              <Select
                label="Workflow"
                value={workflowId}
                onChange={(value) => {
                  setWorkflowId(value);
                  const workflow = (data?.workflows || []).find((item) => String(item.id) === value);
                  setWorkflowStatuses(Array.isArray(workflow?.statuses) ? workflow.statuses.join(", ") : String(workflow?.statuses || ""));
                }}
                options={(data?.workflows || []).map((workflow) => [String(workflow.id), `${workflow.workflow_name} (${workflow.module_name})`])}
              />
              <label className="block">
                <span className="text-xs font-black uppercase text-slate-600">Statuses</span>
                <textarea value={workflowStatuses} onChange={(event) => setWorkflowStatuses(event.target.value)} className="mt-2 min-h-28 w-full rounded-[8px] border border-slate-300 p-3 text-sm font-bold" />
              </label>
              <p className="text-xs font-bold text-slate-500">
                Current transitions: {JSON.stringify(selectedWorkflow?.transitions || [])}
              </p>
              <button onClick={saveWorkflow} className="rounded-[8px] bg-[#D4AF37] px-4 py-3 text-sm font-black text-[#04142E]">Save Workflow</button>
            </div>
          </section>
        </section>

        <section id="reports" className="grid gap-6 xl:grid-cols-2">
          <OperationalPanel
            eyebrow="Advanced Reporting Center"
            title="Report Engine"
            rows={data?.reports || []}
            empty="No report definitions."
            primary={(row) => text(row.report_name)}
            secondary={(row) => `${text(row.module_name)} | filters, Excel export, PDF export, scheduled reports`}
            hrefForRow={() => "/clinical-services/analytics/report-catalog"}
          />
          <OperationalPanel
            eyebrow="Notification Engine"
            title="Centralized Templates"
            rows={data?.notifications || []}
            empty="No notification templates."
            primary={(row) => `${row.template_name} (${row.channel})`}
            secondary={(row) => `${row.template_key} | ${row.status}`}
            hrefForRow={() => "/clinical-services/production-readiness#notifications"}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <OperationalPanel
            eyebrow="Patient 360 Upgrade"
            title="Event Timeline"
            rows={data?.patientTimeline || []}
            empty="No patient journey events yet."
            primary={(row) => `${row.event_title || row.event_type || "Timeline Event"}`}
            secondary={(row) =>
              `${row.event_time || row.created_at || ""} | Patient ${row.patient_id || "-"} | ${row.event_summary || row.source_table || ""}`
            }
            hrefForRow={(row) => `/clinical-services/patients/${row.patient_id || ""}`}
          />
          <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase text-[#8a6500]">
              Event-Centric Patient Journey
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Required Timeline Coverage
            </h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                "Registration",
                "Appointment",
                "Check-In",
                "Vitals",
                "Consultation",
                "Lab",
                "Pharmacy",
                "Billing",
                "Payment",
              ].map((event) => (
                <div
                  key={event}
                  className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] px-4 py-3 text-sm font-black text-slate-950"
                >
                  {event}
                </div>
              ))}
            </div>
          </section>
        </section>

        <section id="audit" className="grid gap-6 xl:grid-cols-2">
          <OperationalPanel
            eyebrow="Audit Center"
            title="Audit Search and Export"
            rows={data?.auditEvents || []}
            empty="No audit events yet."
            primary={(row) => `${row.module_name} - ${row.action}`}
            secondary={(row) => `${row.user_name || "System"} | ${row.entity_type || "-"} | ${row.created_at || ""} | ${row.summary || ""}`}
            hrefForRow={() => "/clinical-services/security/audit"}
          />
          <OperationalPanel
            eyebrow="Backup and Recovery"
            title="Backup Monitoring"
            rows={data?.backups || []}
            empty="No backup policies."
            primary={(row) => text(row.policy_name)}
            secondary={(row) => `${row.backup_type} | ${row.schedule_expression} | ${JSON.stringify(row.recovery_target || {})}`}
            hrefForRow={() => "/clinical-services/production/backups"}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase text-[#8a6500]">Hospital Configuration Center</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{text(data?.hospitalConfig?.hospital_name, "Hospital")}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Logo" value={data?.hospitalConfig?.logo_url || "Configure hospital logo"} />
              <Info label="Branches" value={data?.hospitalConfig?.branches} />
              <Info label="Departments" value={data?.hospitalConfig?.departments} />
              <Info label="Doctors" value={data?.hospitalConfig?.doctors} />
              <Info label="Invoice Settings" value="Configurable through finance templates" />
              <Info label="Prescription / Lab Templates" value="Managed through document templates" />
            </div>
          </section>
          <OperationalPanel
            eyebrow="Super Admin SaaS Console"
            title="Tenant Monitoring"
            rows={data?.tenants || []}
            empty="No tenants found."
            primary={(row) => `${row.tenant_name} - ${row.status || "ACTIVE"}`}
            secondary={(row) => `Hospitals ${row.hospitals || 0} | Users ${row.users || 0} | Revenue Rs. ${Number(row.revenue || 0).toLocaleString("en-IN")}`}
            hrefForRow={() => "/clinical-services/platform-hospitals"}
          />
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase text-[#8a6500]">UAT & Production Checklist</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Compliance Checklist</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(data?.checklist || []).map((item) => (
              <article key={String(item.checklist_key)} className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={["DONE", "PASS", "WORKING", "COMPLETE"].includes(String(item.status)) ? "text-emerald-600" : "text-slate-400"} size={20} />
                  <div className="min-w-0">
                    <p className="break-words text-sm font-black text-slate-950">{text(item.checklist_item)}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{text(item.checklist_category)} | {text(item.status, "PENDING")}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ClinicalShell>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold">
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function Info({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 break-words text-lg font-black text-slate-950">{text(value, "0")}</p>
    </div>
  );
}
