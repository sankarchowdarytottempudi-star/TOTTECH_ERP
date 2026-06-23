"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ClipboardList,
  FlaskConical,
  Pill,
  ScanLine,
  Search,
  Stethoscope,
  UserPlus,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalPatientLookup from "@/components/clinical/ClinicalPatientLookup";
import {
  DashboardCard,
  QuickActionsPanel,
} from "@/components/clinical/EnterpriseDashboard";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

const initialForm = {
  full_name: "",
  specialization: "",
  department_id: "",
  phone: "",
  email: "",
  consultation_fee: "",
  status: "AVAILABLE",
};

export default function ClinicalDoctorsPage() {
  const [doctors, setDoctors] = useState<Row[]>([]);
  const [departments, setDepartments] = useState<Row[]>([]);
  const [form, setForm] = useState(initialForm);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [workflowCounts, setWorkflowCounts] =
    useState<Record<string, number>>({});

  const load = async (search = query) => {
    const [
      response,
      queueResponse,
      activeResponse,
      completedResponse,
      prescriptionsResponse,
      labResponse,
      radiologyResponse,
    ] = await Promise.all([
      fetch(
        `/api/clinical/doctors?q=${encodeURIComponent(search)}`
      ),
      fetch("/api/clinical/doctors/consultations?view=queue"),
      fetch("/api/clinical/doctors/consultations?view=active"),
      fetch("/api/clinical/doctors/consultations?view=completed"),
      fetch("/api/clinical/doctors/consultations?view=prescriptions"),
      fetch("/api/clinical/doctors/consultations?view=lab-orders"),
      fetch("/api/clinical/doctors/consultations?view=radiology-orders"),
    ]);

    if (response.ok) {
      const payload = await response.json();
      setDoctors(payload.doctors || []);
      setDepartments(payload.departments || []);
    }

    const countRows = async (item: Response) =>
      item.ok ? ((await item.json()).rows || []).length : 0;
    setWorkflowCounts({
      queue: await countRows(queueResponse),
      active: await countRows(activeResponse),
      completed: await countRows(completedResponse),
      prescriptions: await countRows(prescriptionsResponse),
      lab: await countRows(labResponse),
      radiology: await countRows(radiologyResponse),
    });
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load("");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveDoctor = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/clinical/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to create doctor");
      }

      notify.success("Doctor created");
      setForm(initialForm);
      await load("");
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to create doctor"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="rounded-[8px] border border-teal-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">
            Clinical Workforce
          </p>
          <h1 className="mt-2 text-4xl font-black">Doctors</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            Doctor profiles are clinic-scoped and feed appointment booking,
            queue management, clinical notes, lab orders, IVF work, and AI
            clinical summaries.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            title="Consultation Queue"
            value={workflowCounts.queue || 0}
            icon={ClipboardList}
            drillDownUrl="/clinical-services/doctors/queue"
            caption="Checked-in patients waiting"
            trend="Start consultation"
          />
          <DashboardCard
            title="Active Consultations"
            value={workflowCounts.active || 0}
            icon={Stethoscope}
            drillDownUrl="/clinical-services/doctors/active"
            caption="Open doctor workspaces"
          />
          <DashboardCard
            title="Completed Consultations"
            value={workflowCounts.completed || 0}
            icon={Activity}
            drillDownUrl="/clinical-services/doctors/completed"
            caption="Saved clinical records"
          />
          <DashboardCard
            title="Prescriptions"
            value={workflowCounts.prescriptions || 0}
            icon={Pill}
            drillDownUrl="/clinical-services/doctors/prescriptions"
            caption="Pharmacy handoff records"
          />
          <DashboardCard
            title="Lab Orders"
            value={workflowCounts.lab || 0}
            icon={FlaskConical}
            drillDownUrl="/clinical-services/doctors/lab-orders"
            caption="Consultation-driven lab orders"
          />
          <DashboardCard
            title="Radiology Orders"
            value={workflowCounts.radiology || 0}
            icon={ScanLine}
            drillDownUrl="/clinical-services/doctors/radiology-orders"
            caption="Imaging and upload workflow"
          />
        </section>

        <QuickActionsPanel
          actions={[
            {
              label: "Consultation Queue",
              href: "/clinical-services/doctors/queue",
              icon: ClipboardList,
            },
            {
              label: "Active Consultations",
              href: "/clinical-services/doctors/active",
              icon: Stethoscope,
            },
            {
              label: "Patient History",
              href: "/clinical-services/doctors/patient-history",
              icon: Activity,
            },
            {
              label: "Prescription Queue",
              href: "/clinical-services/pharmacy/prescription-queue",
              icon: Pill,
            },
          ]}
        />

        <ClinicalPatientLookup
          title="Doctor Patient Lookup"
          description="Find patients by name, mobile number, UHID/MRN, or ABHA. Open Patient 360 or the latest consultation without asking staff for appointment IDs."
        />

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
              <UserPlus size={22} />
            </div>
            <h2 className="text-2xl font-black">Create Doctor</h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TextField
              label="Full Name"
              value={form.full_name}
              onChange={(value) =>
                setForm({ ...form, full_name: value })
              }
            />
            <TextField
              label="Specialization"
              value={form.specialization}
              onChange={(value) =>
                setForm({ ...form, specialization: value })
              }
            />
            <label className="block">
              <span className="text-xs font-black uppercase text-slate-600">
                Department
              </span>
              <select
                value={form.department_id}
                onChange={(event) =>
                  setForm({
                    ...form,
                    department_id: event.target.value,
                  })
                }
                className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option
                    key={String(department.id)}
                    value={String(department.id)}
                  >
                    {String(department.department_name)}
                  </option>
                ))}
              </select>
            </label>
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
            />
            <TextField
              label="Consultation Fee"
              value={form.consultation_fee}
              onChange={(value) =>
                setForm({ ...form, consultation_fee: value })
              }
            />
          </div>

          <button
            onClick={saveDoctor}
            disabled={saving}
            className="mt-5 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create Doctor"}
          </button>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black">Doctor Directory</h2>
            <div className="flex min-w-0 flex-1 gap-2 md:max-w-lg">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full rounded-[8px] border border-slate-300 py-3 pl-10 pr-3 text-sm font-semibold outline-none focus:border-teal-600"
                  placeholder="Search doctor, specialty, phone, email"
                />
              </div>
              <button
                onClick={() => load(query)}
                className="rounded-[8px] border border-slate-300 px-4 py-3 text-sm font-black"
              >
                Search
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <Link
                key={String(doctor.id)}
                href={`/clinical-services/doctors?doctor=${doctor.id}`}
                className="block rounded-[8px] border border-slate-200 bg-slate-50 p-5 transition hover:border-[#D4AF37] hover:bg-white hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
                    <Stethoscope size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-black">
                      {String(doctor.full_name || "Doctor")}
                    </h3>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-600">
                      {String(doctor.specialization || "General")}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black">
                  <span className="rounded-[8px] bg-white p-2">
                    {String(doctor.department_name || "No department")}
                  </span>
                  <span className="rounded-[8px] bg-white p-2">
                    {String(doctor.status || "AVAILABLE")}
                  </span>
                </div>
              </Link>
            ))}
            {!doctors.length ? (
              <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                No doctors created for this clinic yet.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </ClinicalShell>
  );
}

function TextField({
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
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
      />
    </label>
  );
}
