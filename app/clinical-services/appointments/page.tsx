"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalRecordCard from "@/components/clinical/ClinicalRecordCard";
import ClinicalMobilePatientSearch from "@/components/clinical/ClinicalMobilePatientSearch";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;

const today = () =>
  new Date().toISOString().slice(0, 10);

const initialForm = {
  patient_id: "",
  doctor_id: "",
  department_id: "",
  appointment_date: today(),
  start_time: "",
  end_time: "",
  appointment_type: "OPD",
  reason: "",
  notes: "",
};

export default function ClinicalAppointmentsPage() {
  const [date, setDate] = useState(today());
  const [appointments, setAppointments] = useState<Row[]>([]);
  const [patients, setPatients] = useState<Row[]>([]);
  const [doctors, setDoctors] = useState<Row[]>([]);
  const [departments, setDepartments] = useState<Row[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const load = async (viewDate = date) => {
    const response = await fetch(
      `/api/clinical/appointments?date=${encodeURIComponent(viewDate)}`
    );

    if (response.ok) {
      const payload = await response.json();
      setAppointments(payload.appointments || []);
      setPatients(payload.patients || []);
      setDoctors(payload.doctors || []);
      setDepartments(payload.departments || []);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load(date);
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const bookAppointment = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/clinical/appointments", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          ...form,
          appointment_date: date,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to book appointment");
      }

      notify.success(editingId ? "Appointment updated" : "Appointment booked");
      setEditingId("");
      setForm({
        ...initialForm,
        appointment_date: date,
      });
      await load(date);
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to book appointment"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateAppointment = async (
    appointment: Row,
    status: string,
    queueStatus: string
  ) => {
    const response = await fetch("/api/clinical/appointments", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: appointment.id,
        status,
        queue_status: queueStatus,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      notify.error(payload.error || "Failed to update appointment");
      return;
    }

    notify.success("Appointment updated");
    await load(date);
  };

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
            Front Desk Command
          </p>
          <h1 className="mt-2 text-4xl font-black">Appointments</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-200">
            Book appointments, manage tokens, check patients in, move them
            through consultation, and close the visit with audit tracking.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
                <CalendarDays size={22} />
              </div>
            <h2 className="text-2xl font-black">
              {editingId ? "Edit Appointment" : "Book Appointment"}
            </h2>
            </div>

            <div className="mt-5">
              <ClinicalMobilePatientSearch
                onSelectPatient={(patient) =>
                  setForm({
                    ...form,
                    patient_id: String(patient.id || ""),
                  })
                }
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-xs font-black uppercase text-slate-600">
                  Date
                </span>
                <input
                  value={date}
                  type="date"
                  onChange={(event) => {
                    setDate(event.target.value);
                    setForm({
                      ...form,
                      appointment_date: event.target.value,
                    });
                  }}
                  className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase text-slate-600">
                  Patient
                </span>
                <select
                  value={form.patient_id}
                  onChange={(event) =>
                    setForm({ ...form, patient_id: event.target.value })
                  }
                  className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={String(patient.id)} value={String(patient.id)}>
                      {`${patient.patient_uid || ""} ${patient.first_name || ""} ${patient.last_name || ""}`.trim()}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase text-slate-600">
                  Doctor
                </span>
                <select
                  value={form.doctor_id}
                  onChange={(event) => {
                    const doctorId = event.target.value;
                    const selectedDoctor = doctors.find(
                      (doctor) => String(doctor.id) === doctorId
                    );
                    setForm({
                      ...form,
                      doctor_id: doctorId,
                      department_id: String(
                        selectedDoctor?.department_id || form.department_id || ""
                      ),
                    });
                  }}
                  className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={String(doctor.id)} value={String(doctor.id)}>
                      {String(doctor.full_name)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase text-slate-600">
                  Department
                </span>
                <select
                  value={form.department_id}
                  onChange={(event) =>
                    setForm({ ...form, department_id: event.target.value })
                  }
                  className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={String(department.id)} value={String(department.id)}>
                      {String(department.department_name)}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                label="Start Time"
                type="time"
                value={form.start_time}
                onChange={(value) => setForm({ ...form, start_time: value })}
              />
              <TextField
                label="End Time"
                type="time"
                value={form.end_time}
                onChange={(value) => setForm({ ...form, end_time: value })}
              />
              <TextField
                label="Visit Type"
                value={form.appointment_type}
                onChange={(value) =>
                  setForm({ ...form, appointment_type: value })
                }
              />
              <TextField
                label="Reason"
                value={form.reason}
                onChange={(value) => setForm({ ...form, reason: value })}
              />
            </div>

            <button
              onClick={bookAppointment}
              disabled={saving}
              className="mt-5 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Appointment" : "Book Appointment"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId("");
                  setForm({ ...initialForm, appointment_date: date });
                }}
                className="ml-3 mt-5 rounded-[8px] border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#04142E]"
              >
                Cancel Edit
              </button>
            ) : null}
          </article>

          <article className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Day Queue</h2>
            <div className="mt-5 space-y-3">
              {appointments.map((appointment) => (
                <ClinicalRecordCard
                  key={String(appointment.id)}
                  href={`/clinical-services/appointments/${appointment.id}`}
                  eyebrow={String(appointment.token_number || "-")}
                  title={String(appointment.patient_name || "Patient")}
                  description={`${String(appointment.doctor_name || "No doctor")} | ${String(appointment.start_time || "No time")}`}
                  status={String(appointment.status || "-")}
                  metadata={[
                    `Queue ${String(appointment.queue_status || "-")}`,
                    `Type ${String(appointment.appointment_type || "-")}`,
                  ]}
                  patientHref={
                    appointment.patient_id
                      ? `/clinical-services/patients/${appointment.patient_id}`
                      : undefined
                  }
                  editHref={`/clinical-services/appointments/${appointment.id}?mode=edit`}
                  auditHref={`/clinical-services/appointments/${appointment.id}#audit`}
                  historyHref={`/clinical-services/appointments/${appointment.id}#history`}
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge icon={Clock} text={String(appointment.status)} />
                    <Badge
                      icon={UserCheck}
                      text={String(appointment.queue_status)}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionButton
                      label="Edit"
                      onClick={() => {
                        setEditingId(String(appointment.id || ""));
                        setDate(String(appointment.appointment_date || date).slice(0, 10));
                        setForm({
                          patient_id: String(appointment.patient_id || ""),
                          doctor_id: String(appointment.doctor_id || ""),
                          department_id: String(appointment.department_id || ""),
                          appointment_date: String(appointment.appointment_date || date).slice(0, 10),
                          start_time: String(appointment.start_time || "").slice(0, 5),
                          end_time: String(appointment.end_time || "").slice(0, 5),
                          appointment_type: String(appointment.appointment_type || "OPD"),
                          reason: String(appointment.reason || ""),
                          notes: String(appointment.notes || ""),
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                    <ActionButton
                      label="Check In"
                      onClick={() =>
                        updateAppointment(
                          appointment,
                          "CHECKED_IN",
                          "CHECKED_IN"
                        )
                      }
                    />
                    <ActionButton
                      label="In Consultation"
                      onClick={() =>
                        updateAppointment(
                          appointment,
                          "IN_CONSULTATION",
                          "IN_CONSULTATION"
                        )
                      }
                    />
                    <ActionButton
                      label="Check Out"
                      onClick={() =>
                        updateAppointment(
                          appointment,
                          "CHECKED_OUT",
                          "COMPLETED"
                        )
                      }
                    />
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        updateAppointment(appointment, "CANCELLED", "CANCELLED")
                      }}
                      className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </ClinicalRecordCard>
              ))}
              {!appointments.length ? (
                <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  No appointments for this date.
                </p>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </ClinicalShell>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-600">
        {label}
      </span>
      <input
        value={value}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
      />
    </label>
  );
}

function Badge({
  icon: Icon,
  text,
}: {
  icon: typeof CheckCircle2;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[8px] bg-white px-3 py-2 text-xs font-black text-slate-700">
      <Icon size={15} />
      {text || "-"}
    </span>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="rounded-[8px] border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black text-teal-800"
    >
      {label}
    </button>
  );
}
