"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  Settings,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import { DashboardCard, OperationalPanel } from "@/components/clinical/EnterpriseDashboard";

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

type Workspace =
  | "roles"
  | "audit"
  | "configuration"
  | "reports"
  | "system"
  | "masters";

const text = (value: unknown, fallback = "-") =>
  String(value ?? "").trim() || fallback;

const percent = (value: unknown) =>
  `${Number(value || 0).toLocaleString("en-IN")}%`;

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const workspaceMeta: Record<Workspace, { eyebrow: string; title: string; description: string }> = {
  roles: {
    eyebrow: "SaaS & Security",
    title: "Role Permission Management",
    description:
      "Create, review, assign, and audit hospital permissions before onboarding a real hospital.",
  },
  audit: {
    eyebrow: "Audit Command Center",
    title: "User Activity and Transaction Audit",
    description:
      "Track logins, record changes, billing actions, prescription actions, pharmacy actions, lab actions, and configuration changes.",
  },
  configuration: {
    eyebrow: "Hospital Configuration",
    title: "Self-Service Hospital Setup",
    description:
      "Hospital admins can review hospital profile, branches, departments, doctors, invoice settings, and clinical templates without developer intervention.",
  },
  reports: {
    eyebrow: "Reports Center",
    title: "Enterprise Report Engine",
    description:
      "Revenue, patient, lab, pharmacy, doctor productivity, payments, and consultation reports with export-ready definitions.",
  },
  system: {
    eyebrow: "Production Operations",
    title: "Backup, Recovery, and Go-Live Controls",
    description:
      "Daily backup, weekly backup, restore validation, production checklist, and supportability evidence.",
  },
  masters: {
    eyebrow: "Operational Masters",
    title: "Hospital Master Data Control",
    description:
      "Manage medicines, lab tests, departments, diagnosis/procedure codes, payment modes, and tax-rule readiness from the clinical master-data foundation.",
  },
};

export default function GoLiveWorkspace({ workspace }: { workspace: Workspace }) {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleKey, setRoleKey] = useState("");
  const [permissionKey, setPermissionKey] = useState("");
  const [decision, setDecision] = useState("ALLOW");
  const [workflowId, setWorkflowId] = useState("");
  const [statuses, setStatuses] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    const response = await fetch("/api/clinical/production-readiness", {
      cache: "no-store",
    });
    if (response.ok) {
      const payload = await response.json();
      setData(payload);
      const firstRole = payload.matrix?.[0];
      const firstPermission = payload.permissions?.[0];
      const firstWorkflow = payload.workflows?.[0];
      if (firstRole && !roleKey) setRoleKey(String(firstRole.role_key || ""));
      if (firstPermission && !permissionKey) setPermissionKey(String(firstPermission.permission_key || ""));
      if (firstWorkflow && !workflowId) {
        setWorkflowId(String(firstWorkflow.id));
        setStatuses(Array.isArray(firstWorkflow.statuses) ? firstWorkflow.statuses.join(", ") : "");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedWorkflow = useMemo(
    () => (data?.workflows || []).find((workflow) => String(workflow.id) === workflowId),
    [data, workflowId]
  );

  const savePermission = async () => {
    setMessage("");
    const response = await fetch("/api/clinical/production-readiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "assignPermission",
        roleKey,
        permissionKey,
        accessDecision: decision,
      }),
    });
    setMessage(response.ok ? "Permission updated and audit logged." : "Permission update failed.");
    await load();
  };

  const saveWorkflow = async () => {
    setMessage("");
    const clean = statuses
      .split(",")
      .map((item) => item.trim().toUpperCase().replace(/\s+/g, "_"))
      .filter(Boolean);
    const transitions = clean.slice(1).map((status, index) => ({
      from: clean[index],
      to: status,
    }));
    const response = await fetch("/api/clinical/production-readiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateWorkflow",
        workflowId,
        statuses: clean,
        transitions,
      }),
    });
    setMessage(response.ok ? "Workflow updated and audit logged." : "Workflow update failed.");
    await load();
  };

  const compliance = data?.compliance || {};
  const meta = workspaceMeta[workspace];

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            {meta.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-black">{meta.title}</h1>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-white/90">
            {meta.description}
          </p>
        </section>

        {message ? (
          <p className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-4 text-sm font-black text-[#735300]">
            {message}
          </p>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <DashboardCard title="Overall" value={percent(compliance.overall)} icon={ClipboardCheck} drillDownUrl="/clinical-services/production-readiness" caption="Go-live readiness" loading={loading} refresh={load} />
          <DashboardCard title="Security" value={percent(compliance.security)} icon={ShieldCheck} drillDownUrl="/clinical-services/admin/roles" caption="RBAC coverage" loading={loading} refresh={load} />
          <DashboardCard title="Workflows" value={percent(compliance.workflows)} icon={GitBranch} drillDownUrl="/clinical-services/configuration" caption="Configurable flows" loading={loading} refresh={load} />
          <DashboardCard title="Reports" value={percent(compliance.reporting)} icon={FileSpreadsheet} drillDownUrl="/clinical-services/reports" caption="Export-ready catalog" loading={loading} refresh={load} />
          <DashboardCard title="Notifications" value={percent(compliance.notifications)} icon={Bell} drillDownUrl="/clinical-services/configuration" caption="Template coverage" loading={loading} refresh={load} />
          <DashboardCard title="Backups" value={percent(compliance.backups)} icon={DatabaseBackup} drillDownUrl="/clinical-services/system" caption="Recovery policy" loading={loading} refresh={load} />
        </section>

        {workspace === "roles" ? (
          <RolesWorkspace
            data={data}
            roleKey={roleKey}
            setRoleKey={setRoleKey}
            permissionKey={permissionKey}
            setPermissionKey={setPermissionKey}
            decision={decision}
            setDecision={setDecision}
            savePermission={savePermission}
          />
        ) : null}

        {workspace === "audit" ? <AuditWorkspace data={data} /> : null}

        {workspace === "configuration" ? (
          <ConfigurationWorkspace
            data={data}
            workflowId={workflowId}
            setWorkflowId={setWorkflowId}
            statuses={statuses}
            setStatuses={setStatuses}
            selectedWorkflow={selectedWorkflow}
            saveWorkflow={saveWorkflow}
          />
        ) : null}

        {workspace === "reports" ? <ReportsWorkspace data={data} /> : null}

        {workspace === "system" ? <SystemWorkspace data={data} /> : null}

        {workspace === "masters" ? <MastersWorkspace /> : null}
      </div>
    </ClinicalShell>
  );
}

function RolesWorkspace({
  data,
  roleKey,
  setRoleKey,
  permissionKey,
  setPermissionKey,
  decision,
  setDecision,
  savePermission,
}: {
  data: Payload | null;
  roleKey: string;
  setRoleKey: (value: string) => void;
  permissionKey: string;
  setPermissionKey: (value: string) => void;
  decision: string;
  setDecision: (value: string) => void;
  savePermission: () => void;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase text-[#8a6500]">Role Management UI</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Assign Permissions</h2>
        <div className="mt-5 grid gap-3">
          <Select label="Role" value={roleKey} onChange={setRoleKey} options={(data?.matrix || []).map((role) => [String(role.role_key), `${role.role_name} (${role.role_key})`])} />
          <Select label="Permission" value={permissionKey} onChange={setPermissionKey} options={(data?.permissions || []).map((permission) => [String(permission.permission_key), `${permission.module_key}.${permission.action_key}`])} />
          <Select label="Decision" value={decision} onChange={setDecision} options={[["ALLOW", "ALLOW"], ["DENY", "DENY"]]} />
          <button onClick={savePermission} className="rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-[#D4AF37]">
            Save Permission
          </button>
          <Link href="/clinical-services/security" className="rounded-[8px] border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-950">
            Open Full Security Center
          </Link>
        </div>
      </section>

      <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[#8a6500]">Permission Audit Screen</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Role Matrix</h2>
          </div>
          <button onClick={() => downloadJson("clinical-role-permission-matrix.json", data?.matrix || [])} className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 px-4 py-2 text-sm font-black">
            <Download size={16} /> Export
          </button>
        </div>
        <div className="mt-5 overflow-x-auto rounded-[8px] border border-slate-200">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 font-black">Role</th>
                {(data?.modules || []).map((module) => (
                  <th key={module} className="p-3 font-black uppercase">{module}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.matrix || []).map((role) => (
                <tr key={String(role.role_key)} className="align-top">
                  <td className="border-t border-slate-100 p-3 font-black">
                    {text(role.role_name)}
                    <p className="text-xs text-slate-500">{text(role.role_key)}</p>
                  </td>
                  {((role.modules as Row[]) || []).map((module) => (
                    <td key={String(module.module)} className="border-t border-slate-100 p-3">
                      <div className="flex flex-wrap gap-1">
                        {((module.actions as Row[]) || []).map((action) => (
                          <span key={String(action.permissionKey)} className={`rounded px-2 py-1 text-[10px] font-black uppercase ${action.allowed ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
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
    </section>
  );
}

function AuditWorkspace({ data }: { data: Payload | null }) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <OperationalPanel eyebrow="Audit Dashboard" title="Recent Audit Activity" rows={data?.auditEvents || []} empty="No audit events recorded." primary={(row) => `${row.module_name} - ${row.action}`} secondary={(row) => `${row.user_name || "System"} | ${row.created_at || ""} | ${row.summary || ""}`} hrefForRow={() => "/clinical-services/audit"} />
      <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase text-[#8a6500]">Audit Search</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Filters</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {["Date", "User", "Department", "Module", "Action"].map((item) => <Info key={item} label={item} value="Available in audit export dataset" />)}
        </div>
        <button onClick={() => downloadJson("clinical-audit-events.json", data?.auditEvents || [])} className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-[#D4AF37]">
          <Download size={16} /> Export Audit JSON
        </button>
      </section>
    </section>
  );
}

function ConfigurationWorkspace({
  data,
  workflowId,
  setWorkflowId,
  statuses,
  setStatuses,
  selectedWorkflow,
  saveWorkflow,
}: {
  data: Payload | null;
  workflowId: string;
  setWorkflowId: (value: string) => void;
  statuses: string;
  setStatuses: (value: string) => void;
  selectedWorkflow?: Row;
  saveWorkflow: () => void;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase text-[#8a6500]">Hospital Profile</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">{text(data?.hospitalConfig?.hospital_name, "Hospital")}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Info label="Logo" value={data?.hospitalConfig?.logo_url || "Configured through branding"} />
          <Info label="Branches" value={data?.hospitalConfig?.branches} />
          <Info label="Departments" value={data?.hospitalConfig?.departments} />
          <Info label="Doctors" value={data?.hospitalConfig?.doctors} />
          <Info label="Invoice Settings" value="Finance templates" />
          <Info label="Prescription / Lab Templates" value="Document templates" />
        </div>
      </section>
      <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase text-[#8a6500]">Dynamic Workflow Engine</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Workflow Editor</h2>
        <div className="mt-5 grid gap-3">
          <Select label="Workflow" value={workflowId} onChange={(value) => {
            setWorkflowId(value);
            const workflow = (data?.workflows || []).find((item) => String(item.id) === value);
            setStatuses(Array.isArray(workflow?.statuses) ? workflow.statuses.join(", ") : String(workflow?.statuses || ""));
          }} options={(data?.workflows || []).map((workflow) => [String(workflow.id), `${workflow.workflow_name} (${workflow.module_name})`])} />
          <label>
            <span className="text-xs font-black uppercase text-slate-600">Statuses</span>
            <textarea value={statuses} onChange={(event) => setStatuses(event.target.value)} className="mt-2 min-h-28 w-full rounded-[8px] border border-slate-300 p-3 text-sm font-bold" />
          </label>
          <p className="text-xs font-bold text-slate-500">Transitions: {JSON.stringify(selectedWorkflow?.transitions || [])}</p>
          <button onClick={saveWorkflow} className="rounded-[8px] bg-[#D4AF37] px-4 py-3 text-sm font-black text-[#04142E]">Save Workflow</button>
        </div>
      </section>
      <NotificationTemplatesPanel />
    </section>
  );
}

function NotificationTemplatesPanel() {
  const [templates, setTemplates] = useState<Row[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    template_key: "",
    channel: "WHATSAPP",
    template_name: "",
    subject: "",
    body: "",
    status: "ACTIVE",
  });
  const [message, setMessage] = useState("");

  const loadTemplates = async () => {
    const response = await fetch("/api/clinical/notifications/templates", {
      cache: "no-store",
    });
    if (!response.ok) return;
    const payload = await response.json();
    const rows = payload.templates || [];
    setTemplates(rows);
    const first = rows[0];
    if (first && !selectedId) {
      setSelectedId(String(first.id));
      setForm({
        template_key: text(first.template_key),
        channel: text(first.channel, "WHATSAPP"),
        template_name: text(first.template_name),
        subject: text(first.subject),
        body: text(first.body),
        status: text(first.status, "ACTIVE"),
      });
    }
  };

  useEffect(() => {
    void loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTemplate = (id: string) => {
    setSelectedId(id);
    const row = templates.find((item) => String(item.id) === id);
    if (!row) return;
    setForm({
      template_key: text(row.template_key),
      channel: text(row.channel, "WHATSAPP"),
      template_name: text(row.template_name),
      subject: text(row.subject),
      body: text(row.body),
      status: text(row.status, "ACTIVE"),
    });
  };

  const save = async () => {
    setMessage("");
    const response = await fetch("/api/clinical/notifications/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMessage(response.ok ? "Notification template saved." : "Template save failed.");
    await loadTemplates();
  };

  const disable = async () => {
    if (!selectedId) return;
    setMessage("");
    const response = await fetch(`/api/clinical/notifications/templates?id=${selectedId}`, {
      method: "DELETE",
    });
    setMessage(response.ok ? "Notification template disabled." : "Template disable failed.");
    setSelectedId("");
    await loadTemplates();
  };

  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
      <p className="text-xs font-black uppercase text-[#8a6500]">
        Notification Center
      </p>
      <h2 className="mt-1 text-2xl font-black text-slate-950">
        Notification Templates
      </h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
        Create, edit, enable, disable, and map WhatsApp templates to clinical
        workflow events. These templates are used by patient registration,
        appointment, lab, pharmacy, billing, admission, and discharge workflows.
      </p>

      {message ? (
        <p className="mt-4 rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-3 text-sm font-black text-[#735300]">
          {message}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-2">
          <Select
            label="Template"
            value={selectedId}
            onChange={selectTemplate}
            options={templates.map((template) => [
              String(template.id),
              `${template.template_key} (${template.status})`,
            ])}
          />
          <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-600">
            Active templates: {templates.filter((item) => text(item.status) === "ACTIVE").length}
            <br />
            Total templates: {templates.length}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <TextInput label="Template Key" value={form.template_key} onChange={(value) => setForm((old) => ({ ...old, template_key: value }))} />
            <TextInput label="Template Name" value={form.template_name} onChange={(value) => setForm((old) => ({ ...old, template_name: value }))} />
            <Select label="Channel" value={form.channel} onChange={(value) => setForm((old) => ({ ...old, channel: value }))} options={[["WHATSAPP", "WhatsApp"], ["SMS", "SMS"], ["EMAIL", "Email"]]} />
            <Select label="Status" value={form.status} onChange={(value) => setForm((old) => ({ ...old, status: value }))} options={[["ACTIVE", "Active"], ["DISABLED", "Disabled"]]} />
          </div>
          <TextInput label="Subject" value={form.subject} onChange={(value) => setForm((old) => ({ ...old, subject: value }))} />
          <label>
            <span className="text-xs font-black uppercase text-slate-600">Body</span>
            <textarea
              value={form.body}
              onChange={(event) => setForm((old) => ({ ...old, body: event.target.value }))}
              className="mt-2 min-h-48 w-full rounded-[8px] border border-slate-300 p-3 text-sm font-bold leading-6 text-slate-800"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button onClick={save} className="rounded-[8px] bg-[#D4AF37] px-4 py-3 text-sm font-black text-[#04142E]">
              Save Template
            </button>
            <button onClick={disable} className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700">
              Disable Template
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold" />
    </label>
  );
}

function ReportsWorkspace({ data }: { data: Payload | null }) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <OperationalPanel eyebrow="Advanced Reporting Center" title="Report Catalog" rows={data?.reports || []} empty="No reports registered." primary={(row) => text(row.report_name)} secondary={(row) => `${row.module_name} | filters, Excel export, PDF export, scheduled reports`} hrefForRow={() => "/clinical-services/reports"} />
      <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase text-[#8a6500]">Exports</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">PDF / Excel / CSV</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {["PDF Export", "Excel Export", "CSV Export"].map((item) => <Info key={item} label={item} value="Ready from report definitions" />)}
        </div>
        <button onClick={() => downloadJson("clinical-report-catalog.json", data?.reports || [])} className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-[#D4AF37]">
          <Download size={16} /> Export Catalog
        </button>
      </section>
    </section>
  );
}

function SystemWorkspace({ data }: { data: Payload | null }) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <OperationalPanel eyebrow="Backup Dashboard" title="Backup Policies" rows={data?.backups || []} empty="No backup policies registered." primary={(row) => text(row.policy_name)} secondary={(row) => `${row.backup_type} | ${row.schedule_expression} | ${JSON.stringify(row.recovery_target || {})}`} hrefForRow={() => "/clinical-services/system"} />
      <OperationalPanel eyebrow="Deployment Checklist" title="Go-Live Gates" rows={data?.checklist || []} empty="No checklist items registered." primary={(row) => text(row.checklist_item)} secondary={(row) => `${row.checklist_category} | ${row.status} | ${row.acceptance_evidence}`} hrefForRow={() => "/clinical-services/production-readiness"} />
    </section>
  );
}

function MastersWorkspace() {
  const masters = [
    ["Medicines", "/clinical-services/operational-masters/medicines", "Medicine master, stock readiness, pharmacy workflow."],
    ["Lab Tests", "/clinical-services/operational-masters/lab-tests", "Lab tests, price, sample, result workflow readiness."],
    ["Departments", "/clinical-services/configuration", "Branch and department configuration."],
    ["Diagnosis Codes", "/clinical-services/operational-masters/diagnosis-codes", "Diagnosis coding readiness."],
    ["Procedure Codes", "/clinical-services/operational-masters/procedure-codes", "Procedure and service catalog readiness."],
    ["Payment Modes", "/clinical-services/finance/payment-modes", "Cash, card, UPI, insurance, corporate."],
    ["Tax Rules", "/clinical-services/configuration", "GST and invoice tax configuration."],
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {masters.map(([label, href, description]) => (
        <Link key={label} href={href} className="group rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-xl">
          <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
            <Stethoscope size={20} />
          </div>
          <h2 className="mt-4 text-xl font-black text-[#04142E]">{label}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{description}</p>
        </Link>
      ))}
    </section>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-bold">
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </label>
  );
}

function Info({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 break-words text-base font-black text-slate-950">{text(value, "0")}</p>
    </div>
  );
}
