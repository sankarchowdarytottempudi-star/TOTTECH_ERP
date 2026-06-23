"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  ClipboardList,
  FileText,
  FlaskConical,
  HeartPulse,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import {
  DashboardCard,
  OperationalPanel,
} from "@/components/clinical/EnterpriseDashboard";

type Row = Record<string, unknown>;

type DashboardPayload = {
  metrics?: Record<string, string | number | null>;
  appointments?: Row[];
  waiting?: Row[];
  recentPatients?: Row[];
  pendingTasks?: Row[];
  aiInsight?: {
    confidenceScore?: number;
    summary?: string;
    dataSourcesUsed?: string[];
  };
};

const capabilityLinks: Record<string, Record<string, string>> = {
  "front-desk": {
    "Patient registration": "/clinical-services/patients",
    "Appointment booking": "/clinical-services/appointments",
    "Queue and token management": "/clinical-services/appointments?queue=WAITING",
    "Check in and check out": "/clinical-services/appointments",
  },
  opd: {
    "Patient 360 review": "/clinical-services/patients",
    "Clinical notes": "/clinical-services/doctors/consultations",
    Prescriptions: "/clinical-services/pharmacy",
    "Follow-up planning": "/clinical-services/appointments",
  },
  ipd: {
    "Admission tracking": "/clinical-services/hms/ip",
    "Bed movements": "/clinical-services/bed-management",
    "Nursing notes": "/clinical-services/nursing-station",
    "Discharge workflow": "/clinical-services/discharges",
  },
  ivf: {
    "IVF case tracking": "/clinical-services/ivf/cycles",
    "Cycle status": "/clinical-services/ivf/cycles",
    "Embryology records": "/clinical-services/ivf/embryology",
    "AI IVF insights": "/clinical-services/ai",
  },
  laboratory: {
    "Lab orders": "/clinical-services/laboratory",
    "Sample tracking": "/clinical-services/laboratory?status=SAMPLE_COLLECTED",
    "Result validation": "/clinical-services/laboratory?status=RESULT_READY",
    "AI interpretation support": "/clinical-services/ai",
  },
  radiology: {
    "Imaging orders": "/clinical-services/radiology",
    "Report upload": "/clinical-services/radiology",
    "Clinical review": "/clinical-services/patients",
    "Document audit": "/clinical-services/security/audit",
  },
  pharmacy: {
    "Prescription queue": "/clinical-services/pharmacy",
    "Medication dispensing": "/clinical-services/pharmacy?status=PENDING",
    "Inventory link": "/clinical-services/pharmacy/inventory",
    "Patient history": "/clinical-services/patients",
  },
  billing: {
    "Revenue tracking": "/clinical-services/finance",
    Receipts: "/clinical-services/billing",
    "Service charges": "/clinical-services/finance/charges",
    "Clinic analytics": "/clinical-services/analytics/finance",
  },
  inventory: {
    "Stock tracking": "/clinical-services/inventory",
    "Purchase entries": "/clinical-services/inventory/purchases",
    Consumption: "/clinical-services/inventory/consumption",
    "Low-stock signals": "/clinical-services/inventory?status=LOW_STOCK",
  },
  reports: {
    "Operational KPIs": "/clinical-services/analytics",
    "Clinical reports": "/clinical-services/reports",
    "Doctor workload": "/clinical-services/analytics/doctors",
    "Revenue analysis": "/clinical-services/finance",
  },
  documents: {
    "Document uploads": "/clinical-services/documents",
    "Version tracking": "/clinical-services/documents",
    "Patient linking": "/clinical-services/patients",
    "AI summarization": "/clinical-services/ai",
  },
  workflows: {
    "Workflow states": "/clinical-services/business-spec/workflows",
    Transitions: "/clinical-services/business-spec/workflows",
    Approvals: "/clinical-services/security/approval-workflows",
    "Audit trail": "/clinical-services/security/audit",
  },
  administration: {
    "Role framework": "/clinical-services/security/roles",
    "Clinic context": "/clinical-services/platform-hospitals",
    "Department setup": "/clinical-services/administration",
    "Tenant isolation": "/clinical-services/security/tenant-security-audit",
  },
  settings: {
    Branding: "/clinical-services/platform-hospitals",
    "Clinic settings": "/clinical-services/administration",
    "AI policy": "/clinical-services/ai",
    "Form defaults": "/clinical-services/forms",
  },
};

const moduleConfig: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: typeof Activity;
    capabilities: string[];
  }
> = {
  "front-desk": {
    title: "Front Desk",
    subtitle:
      "Reception, registration, token flow, patient queue, and appointment movement.",
    icon: ClipboardList,
    capabilities: [
      "Patient registration",
      "Appointment booking",
      "Queue and token management",
      "Check in and check out",
    ],
  },
  opd: {
    title: "OPD",
    subtitle:
      "Doctor workspace for consultation notes, vitals, diagnosis, prescriptions, and follow-up.",
    icon: Activity,
    capabilities: [
      "Patient 360 review",
      "Clinical notes",
      "Prescriptions",
      "Follow-up planning",
    ],
  },
  ipd: {
    title: "IPD",
    subtitle:
      "Admission, bed movement, inpatient observations, discharge notes, and care coordination.",
    icon: ClipboardList,
    capabilities: [
      "Admission tracking",
      "Bed movements",
      "Nursing notes",
      "Discharge workflow",
    ],
  },
  ivf: {
    title: "IVF Management",
    subtitle:
      "Cycle tracking, partner profile, embryology coordination, stimulation protocol, and outcome history.",
    icon: HeartPulse,
    capabilities: [
      "IVF case tracking",
      "Cycle status",
      "Embryology records",
      "AI IVF insights",
    ],
  },
  laboratory: {
    title: "Laboratory",
    subtitle:
      "Lab order intake, sample tracking, result entry, validation, and interpretation support.",
    icon: FlaskConical,
    capabilities: [
      "Lab orders",
      "Sample tracking",
      "Result validation",
      "AI interpretation support",
    ],
  },
  radiology: {
    title: "Radiology",
    subtitle:
      "Imaging orders, report capture, document upload, and clinician review flow.",
    icon: FileText,
    capabilities: [
      "Imaging orders",
      "Report upload",
      "Clinical review",
      "Document audit",
    ],
  },
  pharmacy: {
    title: "Pharmacy",
    subtitle:
      "Prescription fulfillment, medication stock, dispensing notes, and patient medication history.",
    icon: ClipboardList,
    capabilities: [
      "Prescription queue",
      "Medication dispensing",
      "Inventory link",
      "Patient history",
    ],
  },
  billing: {
    title: "Billing",
    subtitle:
      "Clinical billing, consultation fees, lab charges, pharmacy charges, receipts, and revenue analytics.",
    icon: BarChart3,
    capabilities: [
      "Revenue tracking",
      "Receipts",
      "Service charges",
      "Clinic analytics",
    ],
  },
  inventory: {
    title: "Inventory",
    subtitle:
      "Clinical supplies, lab consumables, pharmacy stock, purchase entries, and utilization tracking.",
    icon: ClipboardList,
    capabilities: [
      "Stock tracking",
      "Purchase entries",
      "Consumption",
      "Low-stock signals",
    ],
  },
  reports: {
    title: "Reports",
    subtitle:
      "Clinic reports grounded in patients, appointments, doctors, labs, IVF, documents, and billing.",
    icon: BarChart3,
    capabilities: [
      "Operational KPIs",
      "Clinical reports",
      "Doctor workload",
      "Revenue analysis",
    ],
  },
  documents: {
    title: "Document Center",
    subtitle:
      "Patient documents, clinical uploads, versioning, document audit, and AI summarization.",
    icon: FileText,
    capabilities: [
      "Document uploads",
      "Version tracking",
      "Patient linking",
      "AI summarization",
    ],
  },
  workflows: {
    title: "Workflow Designer",
    subtitle:
      "Clinical lifecycle states, transitions, approvals, and audit-backed operational automation.",
    icon: Workflow,
    capabilities: [
      "Workflow states",
      "Transitions",
      "Approvals",
      "Audit trail",
    ],
  },
  administration: {
    title: "Administration",
    subtitle:
      "Clinical roles, clinic configuration, departments, users, and tenant controls.",
    icon: ShieldCheck,
    capabilities: [
      "Role framework",
      "Clinic context",
      "Department setup",
      "Tenant isolation",
    ],
  },
  settings: {
    title: "Settings",
    subtitle:
      "Clinical branding, clinic configuration, default workflows, AI policies, and form settings.",
    icon: ShieldCheck,
    capabilities: [
      "Branding",
      "Clinic settings",
      "AI policy",
      "Form defaults",
    ],
  },
};

export default function ClinicalModulePage() {
  const params = useParams<{ module: string }>();
  const moduleKey = params?.module || "";
  const [data, setData] = useState<DashboardPayload | null>(null);
  const config = useMemo(
    () =>
      moduleConfig[moduleKey] || {
        title: moduleKey
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        subtitle:
          "Clinical module workspace using tenant-isolated operating metrics, drill-down lists, quick actions, and AI insight.",
        icon: Activity,
        capabilities: [
          "Clinic context",
          "Operational drill-downs",
          "Clickable KPIs",
          "AI insight",
        ],
      },
    [moduleKey]
  );
  const Icon = config.icon;
  const getCapabilityHref = (item: string) =>
    capabilityLinks[moduleKey]?.[item] ||
    `/clinical-services/${moduleKey}`;

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const response = await fetch("/api/clinical/dashboard");

      if (response.ok) {
        setData(await response.json());
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const metrics = data?.metrics || {};

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-[8px] border border-teal-300 bg-teal-500/10 text-teal-300">
              <Icon size={28} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
                Clinical Module
              </p>
              <h1 className="mt-2 break-words text-4xl font-black">
                {config.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-200">
                {config.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Today Appointments"
            value={metrics.todays_appointments || 0}
            icon={Activity}
            drillDownUrl="/clinical-services/appointments"
            caption="Appointment calendar"
          />
          <DashboardCard
            title="Waiting Patients"
            value={metrics.patients_waiting || 0}
            icon={ClipboardList}
            drillDownUrl="/clinical-services/appointments?queue=WAITING"
            caption="Queue management"
          />
          <DashboardCard
            title="Doctors Available"
            value={metrics.doctors_available || 0}
            icon={Activity}
            drillDownUrl="/clinical-services/doctors?status=AVAILABLE"
            caption="Doctor availability"
          />
          <DashboardCard
            title="Lab Pending"
            value={metrics.lab_orders_pending || 0}
            icon={FlaskConical}
            drillDownUrl="/clinical-services/lab-orders?status=pending"
            caption="Pending lab orders"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel title="Module Capabilities">
            <div className="grid gap-3 md:grid-cols-2">
              {config.capabilities.map((item) => (
                <Link
                  key={item}
                  href={getCapabilityHref(item)}
                  className="group rounded-[8px] border border-[#D4AF37]/40 bg-[#fff4d6] p-4 text-sm font-black text-[#04142E] shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-[#ffe7a3] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
                  aria-label={`Open ${item}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="break-words">{item}</span>
                    <span className="text-[#8a6500] transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Panel>
          <OperationalPanel
            title="Recent Patients"
            eyebrow="Patient Context"
            rows={data?.recentPatients || []}
            empty="No patient records yet."
            primary={(row) =>
              `${row.patient_uid || row.uhid || "-"} ${row.first_name || ""} ${row.last_name || ""}`.trim()
            }
            secondary={(row) =>
              `${row.mobile || "No mobile"} | ${row.created_at || ""}`
            }
            hrefForRow={(row) =>
              `/clinical-services/patients/${row.id}`
            }
          />
          <OperationalPanel
            title="Pending Tasks"
            eyebrow="Operational Queue"
            rows={data?.pendingTasks || []}
            empty="No pending tasks."
            primary={(row) =>
              String(row.title || "Task")
            }
            secondary={(row) =>
              `${row.value || 0} records require review`
            }
            hrefForRow={(row) =>
              String(
                row.href ||
                  "/clinical-services"
              )
            }
          />
          <Panel title="AI Module Insight">
            <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
              {data?.aiInsight?.summary ||
                "AI insight will become richer as clinical records are created."}
            </p>
          </Panel>
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
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
