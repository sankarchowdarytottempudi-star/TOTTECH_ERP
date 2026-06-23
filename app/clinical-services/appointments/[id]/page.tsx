"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  History,
  UserRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";

type Row = Record<string, unknown>;

export default function ClinicalAppointmentDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [appointment, setAppointment] =
    useState<Row | null>(null);
  const [patients, setPatients] = useState<Row[]>([]);
  const [doctors, setDoctors] = useState<Row[]>([]);
  const [departments, setDepartments] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const editMode = searchParams?.get("mode") === "edit";
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    department_id: "",
    appointment_date: "",
    start_time: "",
    end_time: "",
    appointment_type: "OPD",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const response = await fetch(
        `/api/clinical/appointments?id=${params?.id}`
      );

      if (response.ok) {
        const payload = await response.json();
        setAppointment(
          payload.appointments?.[0] || null
        );
        setPatients(payload.patients || []);
        setDoctors(payload.doctors || []);
        setDepartments(payload.departments || []);
      }

      setLoading(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [params?.id]);

  useEffect(() => {
    if (!appointment) {
      return;
    }

    setForm({
      patient_id: String(appointment.patient_id || ""),
      doctor_id: String(appointment.doctor_id || ""),
      department_id: String(appointment.department_id || ""),
      appointment_date: String(appointment.appointment_date || "").slice(0, 10),
      start_time: String(appointment.start_time || "").slice(0, 5),
      end_time: String(appointment.end_time || "").slice(0, 5),
      appointment_type: String(appointment.appointment_type || "OPD"),
      reason: String(appointment.reason || ""),
      notes: String(appointment.notes || ""),
    });
  }, [appointment]);

  const saveAppointment = async () => {
    if (!appointment?.id) return;
    setSaving(true);
    try {
      const response = await fetch("/api/clinical/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appointment.id,
          ...form,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to update appointment");
      }
      window.location.href = `/clinical-services/appointments/${payload.id || appointment.id}`;
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to update appointment");
    } finally {
      setSaving(false);
    }
  };

  const deleteAppointment = async () => {
    if (!appointment?.id) return;
    if (!window.confirm("Delete this appointment?")) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/clinical/appointments?id=${appointment.id}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to delete appointment");
      }
      window.location.href = "/clinical-services/appointments";
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete appointment");
    } finally {
      setSaving(false);
    }
  };

  const patientHref = appointment?.patient_id
    ? `/clinical-services/patients/${appointment.patient_id}`
    : undefined;

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <Link
          href="/clinical-services/appointments"
          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#04142E] shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
        >
          <ArrowLeft size={16} />
          Back to Appointments
        </Link>

        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Appointment Details
          </p>
          <h1 className="mt-2 break-words text-4xl font-black">
            {loading
              ? "Loading appointment..."
              : String(
                  appointment?.patient_name ||
                    `Appointment #${params?.id}`
                )}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Appointment workspace with queue state, patient link, clinical
            context, history, and audit tracking.
          </p>
        </section>

        {!loading && !appointment ? (
          <section className="rounded-[8px] border border-red-200 bg-white p-6 text-sm font-black text-red-700 shadow-sm">
            Appointment #{params?.id} was not found.
          </section>
        ) : null}

        {appointment ? (
          <>
            {editMode ? (
              <section className="rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
                      Appointment Maintenance
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Edit Appointment
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                      Update the appointment date, doctor, department, queue timing and visit notes.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={saveAppointment}
                      disabled={saving}
                      className="rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={deleteAppointment}
                      disabled={saving}
                      className="rounded-[8px] border border-red-200 bg-white px-4 py-3 text-sm font-black text-red-700 disabled:opacity-50"
                    >
                      Delete Appointment
                    </button>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Patient" value={null}>
                    <select
                      value={form.patient_id}
                      onChange={(event) => setForm((current) => ({ ...current, patient_id: event.target.value }))}
                      className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={String(patient.id)} value={String(patient.id)}>
                          {String(patient.patient_name || `${patient.first_name || ""} ${patient.last_name || ""}`.trim())}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Doctor" value={null}>
                    <select
                      value={form.doctor_id}
                      onChange={(event) => setForm((current) => ({ ...current, doctor_id: event.target.value }))}
                      className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doctor) => (
                        <option key={String(doctor.id)} value={String(doctor.id)}>
                          {String(doctor.full_name || "Doctor")}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Department" value={null}>
                    <select
                      value={form.department_id}
                      onChange={(event) => setForm((current) => ({ ...current, department_id: event.target.value }))}
                      className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option key={String(department.id)} value={String(department.id)}>
                          {String(department.department_name || "Department")}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {[
                    ["appointment_date", "Date", "date"],
                    ["start_time", "Start Time", "time"],
                    ["end_time", "End Time", "time"],
                    ["appointment_type", "Visit Type", "text"],
                    ["reason", "Reason", "text"],
                    ["notes", "Notes", "text"],
                  ].map(([key, label, type]) => (
                    <label key={key} className="block">
                      <span className="text-xs font-black uppercase text-slate-600">{label}</span>
                      {key === "notes" ? (
                        <textarea
                          value={form[key as keyof typeof form]}
                          onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                          className="mt-2 min-h-[120px] w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                        />
                      ) : (
                        <input
                          value={form[key as keyof typeof form]}
                          type={type as string}
                          onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                          className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                        />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="grid gap-3 md:grid-cols-4">
              <ActionLink
                href="#overview"
                icon={CalendarDays}
                label="View Details"
              />
              {patientHref ? (
                <ActionLink
                  href={patientHref}
                  icon={UserRound}
                  label="Patient 360"
                />
              ) : null}
              <ActionLink
                href="#audit"
                icon={ClipboardList}
                label="Audit Timeline"
              />
              <ActionLink
                href="#history"
                icon={History}
                label="History"
              />
            </section>

            <section
              id="overview"
              className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-black text-[#04142E]">
                Overview
              </h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {Object.entries(appointment)
                  .filter(
                    ([key]) =>
                      ![
                        "tenant_id",
                        "hospital_id",
                        "branch_id",
                        "clinic_id",
                        "is_deleted",
                      ].includes(key)
                  )
                  .map(([key, value]) => (
                    <Field
                      key={key}
                      label={key}
                      value={value}
                    />
                  ))}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <Panel
                id="history"
                title="History"
              >
                <Field
                  label="Created"
                  value={appointment.created_at}
                />
                <Field
                  label="Updated"
                  value={appointment.updated_at}
                />
              </Panel>
              <Panel id="audit" title="Audit">
                <Field
                  label="Status"
                  value={appointment.status}
                />
                <Field
                  label="Queue Status"
                  value={appointment.queue_status}
                />
              </Panel>
            </section>
          </>
        ) : null}
      </div>
    </ClinicalShell>
  );
}

function ActionLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof CalendarDays;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-[#04142E] shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-[#fff9e8] hover:shadow-md"
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

function Panel({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-black text-[#04142E]">
        {title}
      </h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: unknown;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.06em] text-slate-500">
        {label.replaceAll("_", " ")}
      </p>
      {children ? (
        <div className="mt-1">{children}</div>
      ) : (
        <p className="mt-1 break-words text-sm font-bold text-[#04142E]">
          {value === null || value === undefined
            ? "-"
            : String(value)}
        </p>
      )}
    </div>
  );
}
