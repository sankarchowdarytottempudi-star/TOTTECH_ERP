"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CreditCard,
  FlaskConical,
  HeartPulse,
  PlusCircle,
  Receipt,
  Stethoscope,
  UserRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import {
  ClickableBarChart,
  DashboardCard,
  OperationalPanel,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";
import {
  isModuleLicensed,
  moduleCodeForClinicalPath,
} from "@/lib/clinical/module-licensing";
import {
  getClinicalRoleFamily,
  shouldShowClinicalAnalytics,
  shouldShowClinicalQuickActions,
} from "@/lib/clinical/workflow-experience";

type Row = Record<string, unknown>;

type DashboardPayload = {
	  context?: {
	    hospitalName?: string;
	    branchName?: string;
	    clinicName?: string;
	    organizationName?: string;
	    licensedModules?: string[];
      roleName?: string;
	  };
  metrics?: Record<
    string,
    string | number | null
  >;
  appointments?: Row[];
  waiting?: Row[];
  recentPatients?: Row[];
  revenueBreakdown?: Row[];
  departmentPerformance?: Row[];
  pendingTasks?: Row[];
  alerts?: Row[];
  notifications?: Row[];
  aiInsight?: {
    confidenceScore?: number;
    summary?: string;
    dataSourcesUsed?: string[];
  };
};

type WorkItem = {
  id: string;
  title: string;
  summary: string;
  status: string;
  priority: string;
  href: string;
  entityType: string;
  entityId?: number | null;
  dueAt?: string | null;
};

type WorkboardPayload = {
  context?: {
    roleName?: string;
  };
  metrics?: Record<string, number>;
  roleWorkboard?: {
    title: string;
    question: string;
    href: string;
    tasks: WorkItem[];
    quickActions: {
      label: string;
      href: string;
    }[];
  };
};

const metricCards = [
  {
    key: "todays_appointments",
    title: "Today's Appointments",
    icon: CalendarDays,
    drillDownUrl:
      "/clinical-services/appointments",
    caption: "Open appointment calendar",
  },
  {
    key: "patients_registered_today",
    title: "Patients Registered Today",
    icon: UserRound,
    drillDownUrl:
      "/clinical-services/patients?created=today",
    caption: "Open patient search",
  },
  {
    key: "doctors_available",
    title: "Doctors Available",
    icon: Activity,
    drillDownUrl:
      "/clinical-services/doctors?status=AVAILABLE",
    caption: "Open doctor availability",
  },
  {
    key: "lab_orders_pending",
    title: "Lab Orders Pending",
    icon: FlaskConical,
    drillDownUrl:
      "/clinical-services/lab-orders?status=pending",
    caption: "Open pending lab orders",
  },
  {
    key: "revenue_today",
    title: "Revenue Today",
    icon: BarChart3,
    drillDownUrl:
      "/clinical-services/hms/billing?date=today",
    caption: "Open billing dashboard",
  },
  {
    key: "revenue_this_month",
    title: "Revenue This Month",
    icon: BarChart3,
    drillDownUrl:
      "/clinical-services/finance/cash?range=month",
    caption: "Open finance dashboard",
  },
  {
    key: "ivf_cycles_active",
    title: "IVF Cycles Active",
    icon: HeartPulse,
    drillDownUrl:
      "/clinical-services/ivf/cycles?status=ACTIVE",
    caption: "Open active IVF cycles",
  },
  {
    key: "patients_waiting",
    title: "Patients Waiting",
    icon: AlertTriangle,
    drillDownUrl:
      "/clinical-services/appointments?queue=WAITING",
    caption: "Open queue management",
  },
];

const displayValue = (
  value: unknown
) =>
  value === null ||
  value === undefined
    ? "0"
    : String(value);

export default function ClinicalServicesDashboard() {
  const [data, setData] =
    useState<DashboardPayload | null>(
      null
    );
  const [workboard, setWorkboard] =
    useState<WorkboardPayload | null>(
      null
    );

  const loadDashboard = async () => {
    const [
      dashboardResponse,
      workboardResponse,
    ] = await Promise.all([
      fetch("/api/clinical/dashboard"),
      fetch("/api/clinical/workboard"),
    ]);

    if (dashboardResponse.ok) {
      setData(
        await dashboardResponse.json()
      );
    }

    if (workboardResponse.ok) {
      setWorkboard(
        await workboardResponse.json()
      );
    }
  };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadDashboard();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, []);

	  const metrics = data?.metrics || {};
	  const licensedModules =
	    data?.context?.licensedModules || [];
	  const isHrefLicensed = (href: string) =>
	    isModuleLicensed(
	      moduleCodeForClinicalPath(href),
	      licensedModules
	    );
  const roleName =
    String(data?.context?.roleName || "")
      .trim()
      .toUpperCase();
  const roleFamily =
    getClinicalRoleFamily(roleName);
  const showAnalytics =
    shouldShowClinicalAnalytics(roleName);
  const showQuickActions =
    shouldShowClinicalQuickActions(roleName);
  const canManageLicensing =
    roleFamily === "super_admin" ||
    roleFamily === "admin";
  const roleMetricKeys: Record<
    string,
    string[]
  > = {
    super_admin: [
      "todays_appointments",
      "patients_registered_today",
      "patients_waiting",
      "lab_orders_pending",
      "revenue_today",
      "revenue_this_month",
      "ivf_cycles_active",
    ],
    admin: [
      "todays_appointments",
      "patients_registered_today",
      "patients_waiting",
      "lab_orders_pending",
      "revenue_today",
      "revenue_this_month",
    ],
    reception: [
      "todays_appointments",
      "patients_waiting",
      "patients_registered_today",
      "revenue_today",
    ],
    doctor: [
      "patients_waiting",
      "lab_orders_pending",
      "patients_registered_today",
      "todays_appointments",
    ],
    lab: [
      "lab_orders_pending",
      "patients_waiting",
      "patients_registered_today",
    ],
    pharmacy: [
      "patients_registered_today",
      "patients_waiting",
      "revenue_today",
    ],
    nurse: [
      "todays_appointments",
      "patients_waiting",
      "patients_registered_today",
      "lab_orders_pending",
    ],
    ot: [
      "todays_appointments",
      "patients_waiting",
      "patients_registered_today",
    ],
    icu: [
      "patients_waiting",
      "patients_registered_today",
      "lab_orders_pending",
    ],
    ivf: [
      "ivf_cycles_active",
      "patients_registered_today",
      "patients_waiting",
    ],
    finance: [
      "revenue_today",
      "revenue_this_month",
      "patients_waiting",
    ],
    other: [
      "todays_appointments",
      "patients_registered_today",
      "patients_waiting",
    ],
  };
  const visibleMetricCards =
    metricCards.filter(
      (card) =>
        isHrefLicensed(
          card.drillDownUrl
        ) &&
        roleMetricKeys[
          roleFamily
        ]?.includes(card.key)
    );
  const quickActions = showQuickActions
    ? [
    {
      label: "Register Patient",
      href: "/clinical-services/patients",
      icon: UserRound,
	    },
	    {
	      label: "Book Appointment",
	      href: "/clinical-services/appointments",
	      icon: CalendarDays,
	    },
	    {
	      label: "New Admission",
	      href: "/clinical-services/hms/ip",
	      icon: PlusCircle,
	    },
	    {
	      label: "Create Invoice",
	      href: "/clinical-services/hms/billing",
	      icon: Receipt,
	    },
	    {
	      label: "Add Lab Order",
	      href: "/clinical-services/lab-orders",
	      icon: FlaskConical,
	    },
	    {
	      label: "Start Consultation",
	      href: "/clinical-services/hms/op",
	      icon: Stethoscope,
	    },
	    {
	      label: "Create IVF Cycle",
	      href: "/clinical-services/ivf/cycles",
	      icon: HeartPulse,
	    },
    {
      label: "Post Payment",
      href: "/clinical-services/finance/cash",
      icon: CreditCard,
    },
  ]
    .filter((action) =>
      isHrefLicensed(action.href)
    )
    : [];

  const operationalPanels = [
    {
      title: "Recent Patients",
      eyebrow: "Patient Access",
      rows: data?.recentPatients || [],
      empty: "No patients registered yet.",
      primary: (row: Row) =>
        `${row.patient_uid || row.uhid || "-"} ${row.first_name || ""} ${row.last_name || ""}`.trim(),
      secondary: (row: Row) =>
        `${row.mobile || "No mobile"} | ${row.created_at || ""}`,
      hrefForRow: (row: Row) =>
        `/clinical-services/patients/${row.id}`,
    },
    {
      title: "Today's Schedule",
      eyebrow: "Appointments",
      rows: data?.appointments || [],
      empty: "No appointments today.",
      primary: (row: Row) =>
        String(
          row.patient_name ||
            "Patient"
        ),
      secondary: (row: Row) =>
        `${row.token_number || "-"} | ${row.status || "-"} | ${row.doctor_name || "No doctor"}`,
      hrefForRow: () =>
        "/clinical-services/appointments",
    },
    {
      title: "Pending Tasks",
      eyebrow: "Work Queue",
      rows: data?.pendingTasks || [],
      empty: "No pending operational tasks.",
      primary: (row: Row) =>
        String(row.title || "Task"),
      secondary: (row: Row) =>
        `${row.value || 0} records require review`,
      hrefForRow: (row: Row) =>
        String(
          row.href ||
            "/clinical-services"
        ),
    },
    {
      title: "Alerts",
      eyebrow: "Live Operations",
      rows: data?.alerts || [],
      empty: "No active queue alerts.",
      primary: (row: Row) =>
        String(row.title || "Alert"),
      secondary: (row: Row) =>
        `${row.category || "Alert"} | ${row.summary || ""}`,
      hrefForRow: (row: Row) =>
        String(
          row.href ||
            "/clinical-services"
        ),
    },
    {
      title: "Notifications",
      eyebrow: "Upcoming Work",
      rows: data?.notifications || [],
      empty: "No notifications.",
      primary: (row: Row) =>
        String(
          row.title || "Notification"
        ),
      secondary: (row: Row) =>
        `${row.category || "Notification"} | ${row.summary || ""}`,
      hrefForRow: (row: Row) =>
        String(
          row.href ||
            "/clinical-services"
        ),
    },
    {
      title: "Patients Waiting",
      eyebrow: "Queue Management",
      rows: data?.waiting || [],
      empty: "No waiting patients.",
      primary: (row: Row) =>
        String(
          row.patient_name ||
            "Patient"
        ),
      secondary: (row: Row) =>
        `${row.token_number || "-"} | ${row.queue_status || "-"}`,
      hrefForRow: () =>
        "/clinical-services/appointments",
    },
  ];

  const rolePanelOrder: Record<
    string,
    number[]
  > = {
    super_admin: [0, 1, 2, 3, 4, 5],
    admin: [0, 1, 2, 3, 4, 5],
    reception: [1, 5, 0, 2],
    doctor: [5, 1, 0, 2],
    lab: [2, 3, 0, 4],
    pharmacy: [2, 3, 4, 0],
    nurse: [1, 5, 2, 3],
    ot: [1, 2, 3, 4],
    icu: [5, 2, 3, 4],
    ivf: [0, 1, 2, 3],
    finance: [2, 3, 4, 5],
    other: [0, 1, 2],
  };

  const visiblePanels =
    rolePanelOrder[roleFamily]?.map(
      (index) => operationalPanels[index]
    ) || operationalPanels.slice(0, 3);

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-8 text-white shadow-xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-300">
                Clinical Command Center
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
                {data?.context?.clinicName ||
                  data?.context?.branchName ||
                  "TOTTECH Clinical Services"}
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-200">
                {data?.context?.hospitalName ||
                  data?.context?.organizationName ||
                  "Hospital Network"}
                {" "}dashboard grounded in patients,
                appointments, doctors, lab orders, IVF cases,
                finance activity, queue movement and operational alerts for the
                selected clinic.
              </p>
            </div>
            <Link
              href="/clinical-services/operational-masters"
              className="inline-flex items-center justify-center rounded-[8px] border border-[#D4AF37]/60 bg-white px-5 py-3 text-sm font-black text-[#04142E]"
            >
              Operational Masters
            </Link>
            {canManageLicensing ? (
              <Link
                href="/clinical-services/hospital-licensing"
                className="inline-flex items-center justify-center rounded-[8px] border border-white/20 bg-[#D4AF37] px-5 py-3 text-sm font-black text-slate-950"
              >
                Hospital Licensing
              </Link>
            ) : null}
          </div>
        </section>

        <ClinicalWorkboard
          payload={workboard}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleMetricCards.map((card) => (
            <DashboardCard
              key={card.key}
              title={card.title}
              value={displayValue(
                metrics[card.key]
              )}
              icon={card.icon}
              drillDownUrl={
                card.drillDownUrl
              }
              caption={card.caption}
              trend="Drill down available"
              refresh={loadDashboard}
            />
          ))}
        </section>

        {showQuickActions ? (
          <QuickActionsPanel
            actions={quickActions}
          />
        ) : null}

        <section className="grid gap-6 xl:grid-cols-2">
          {visiblePanels.map((panel) => (
            <OperationalPanel
              key={panel.title}
              title={panel.title}
              eyebrow={panel.eyebrow}
              rows={panel.rows}
              empty={panel.empty}
              primary={panel.primary}
              secondary={panel.secondary}
              hrefForRow={panel.hrefForRow}
            />
          ))}
        </section>

        {showAnalytics ? (
          <section className="grid gap-6 xl:grid-cols-2">
            <ClickableBarChart
              title="Revenue Breakdown"
              empty="No revenue records for this month."
              rows={(data?.revenueBreakdown || []).map(
                (row) => ({
                  label: String(
                    row.label || "Revenue"
                  ),
                  value: Number(
                    row.value || 0
                  ),
                  href: String(
                    row.href ||
                      "/clinical-services/finance"
                  ),
                })
              )}
            />
            <ClickableBarChart
              title="Department Performance"
              empty="No department activity today."
              rows={(data?.departmentPerformance || []).map(
                (row) => ({
                  label: String(
                    row.label ||
                      "Department"
                  ),
                  value: Number(
                    row.value || 0
                  ),
                  href: String(
                    row.href ||
                      "/clinical-services/appointments"
                  ),
                })
              )}
            />
          </section>
        ) : null}
      </div>
    </ClinicalShell>
  );
}

function ClinicalWorkboard({
  payload,
}: {
  payload: WorkboardPayload | null;
}) {
  const board =
    payload?.roleWorkboard;
  const tasks = board?.tasks || [];
  const metrics =
    payload?.metrics || {};

  return (
    <section>
      <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
              My Work
              {payload?.context
                ?.roleName
                ? ` | ${payload.context.roleName}`
                : ""}
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {board?.title ||
                "Hospital Operations Workboard"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
              {board?.question ||
                "Clinical tasks are loaded from tenant, hospital and branch scoped records."}
            </p>
          </div>
          <Link
            href={
              board?.href ||
              "/clinical-services"
            }
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#0B1F3A] px-4 py-3 text-sm font-black text-[#D4AF37] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Open Workboard
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MiniMetric
            label="Waiting"
            value={metrics.waitingQueue}
          />
          <MiniMetric
            label="Admissions"
            value={metrics.activeAdmissions}
          />
          <MiniMetric
            label="Lab Pending"
            value={metrics.pendingLabOrders}
          />
          <MiniMetric
            label="Revenue Holds"
            value={metrics.unpaidInvoices}
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {(board?.quickActions || []).map(
            (action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-[#fff9e8] hover:shadow-md"
              >
                <span className="min-w-0 break-words text-sm font-black text-slate-950">
                  {action.label}
                </span>
                <ArrowRight
                  className="shrink-0 text-[#8a6500]"
                  size={16}
                />
              </Link>
            )
          )}
        </div>

        <div className="mt-6 space-y-3">
          {tasks.length ? (
            tasks.slice(0, 8).map((task) => (
              <Link
                key={task.id}
                href={task.href}
                className="group block rounded-[8px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-white hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-black text-slate-950">
                      {task.title}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-600">
                      {task.summary}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <span className="rounded-full border border-[#D4AF37] bg-[#fff9e8] px-3 py-1 text-xs font-black uppercase text-[#8a6500]">
                      {task.status}
                    </span>
                    <span
                      className="rounded-full border border-[#D4AF37]/70 bg-[#04142E] px-3 py-1 text-xs font-black uppercase shadow-sm"
                      style={{ color: "#FFFFFF" }}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
              No role-specific work items are pending for this hospital context.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">
        {value ?? 0}
      </p>
    </div>
  );
}
