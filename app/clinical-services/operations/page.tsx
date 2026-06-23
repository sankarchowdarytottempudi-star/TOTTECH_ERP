"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bed,
  CheckCircle2,
  FlaskConical,
  HeartPulse,
  Pill,
  Receipt,
  Save,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";
import ClinicalPatientLookup from "@/components/clinical/ClinicalPatientLookup";
import {
  BP_VALIDATION_MESSAGE,
  formatBloodPressureInput,
  parseBloodPressure,
  shouldShowBloodPressureError,
} from "@/lib/clinical/blood-pressure";
import { notify } from "@/lib/notify";

type Row = Record<string, unknown>;
type Payload = { rows?: Row[]; summary?: Row; daily?: Row[]; workflow?: Row[] };

const endpoints = {
  users: "/api/clinical/operations/admin-users",
  labTests: "/api/clinical/operations/lab-tests",
  medicines: "/api/clinical/operations/medicines",
  vitals: "/api/clinical/operations/vitals",
  labResults: "/api/clinical/operations/lab-results",
  pharmacy: "/api/clinical/operations/pharmacy-dispense",
  rooms: "/api/clinical/operations/rooms",
  ot: "/api/clinical/operations/ot-schedules",
  payments: "/api/clinical/operations/payments",
  owner: "/api/clinical/operations/owner-dashboard",
  patients: "/api/clinical/patients",
};

const emptyForms = {
  user: {
    employee_id: "",
    name: "",
    mobile: "",
    email: "",
    department: "",
    role: "Front Desk",
    username: "",
    password: "",
    status: "Active",
  },
  labTest: {
    lab_test_name: "",
    category: "",
    normal_value: "",
    unit: "",
    reference_range: "",
    cost: "",
    status: "ACTIVE",
  },
  medicine: {
    medicine_name: "",
    generic_name: "",
    brand_name: "",
    medicine_type: "",
    strength: "",
    unit: "",
    selling_price: "",
    stock_quantity: "",
    reorder_level: "",
    expiry_date: "",
    status: "ACTIVE",
  },
  vitals: {
    patient_id: "",
    appointment_id: "",
    blood_pressure: "",
    weight: "",
    height: "",
    temperature: "",
    spo2: "",
    pulse: "",
    respiration: "",
    notes: "",
  },
  labResult: {
    lab_order_id: "",
    action: "RESULT_ENTRY",
    result_value: "",
    remarks: "",
    attachments: "",
  },
  room: {
    room_number: "",
    room_type: "",
    room_rent: "",
    status: "AVAILABLE",
    patient_id: "",
    notes: "",
  },
  ot: {
    patient_id: "",
    doctor_id: "",
    appointment_id: "",
    ot_number: "",
    procedure_name: "",
    scheduled_date: "",
    scheduled_time: "",
    status: "PLANNED",
    notes: "",
  },
  payment: {
    patient_id: "",
    appointment_id: "",
    lab_order_id: "",
    payment_type: "CONSULTATION_FEE",
    amount: "",
    payment_method: "Cash",
    reference_number: "",
    notes: "",
  },
};

const asString = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

export default function ClinicalOperationsPage() {
  const [users, setUsers] = useState<Row[]>([]);
  const [labTests, setLabTests] = useState<Row[]>([]);
  const [medicines, setMedicines] = useState<Row[]>([]);
  const [vitalsQueue, setVitalsQueue] = useState<Row[]>([]);
  const [labOrders, setLabOrders] = useState<Row[]>([]);
  const [pharmacyQueue, setPharmacyQueue] = useState<Row[]>([]);
  const [rooms, setRooms] = useState<Row[]>([]);
  const [otRows, setOtRows] = useState<Row[]>([]);
  const [payments, setPayments] = useState<Row[]>([]);
  const [patients, setPatients] = useState<Row[]>([]);
  const [owner, setOwner] = useState<Payload | null>(null);
  const [forms, setForms] = useState(emptyForms);
  const [saving, setSaving] = useState(false);
  const [selectedVitalsPatient, setSelectedVitalsPatient] = useState<Row | null>(null);

  const updateForm = <K extends keyof typeof emptyForms>(
    key: K,
    next: Record<string, string>
  ) => {
    setForms((current) => ({
      ...current,
      [key]: next as (typeof emptyForms)[K],
    }));
  };

  const load = async () => {
    const [
      userRes,
      labRes,
      medRes,
      vitalsRes,
      labOrdersRes,
      pharmRes,
      roomRes,
      otRes,
      paymentRes,
      patientRes,
      ownerRes,
    ] = await Promise.all([
      fetch(endpoints.users),
      fetch(endpoints.labTests),
      fetch(endpoints.medicines),
      fetch(endpoints.vitals),
      fetch(endpoints.labResults),
      fetch(endpoints.pharmacy),
      fetch(endpoints.rooms),
      fetch(endpoints.ot),
      fetch(endpoints.payments),
      fetch(endpoints.patients),
      fetch(endpoints.owner),
    ]);

    if (userRes.ok) setUsers(((await userRes.json()) as Payload).rows || []);
    if (labRes.ok) setLabTests(((await labRes.json()) as Payload).rows || []);
    if (medRes.ok) setMedicines(((await medRes.json()) as Payload).rows || []);
    if (vitalsRes.ok) setVitalsQueue(((await vitalsRes.json()) as Payload).rows || []);
    if (labOrdersRes.ok) setLabOrders(((await labOrdersRes.json()) as Payload).rows || []);
    if (pharmRes.ok) setPharmacyQueue(((await pharmRes.json()) as Payload).rows || []);
    if (roomRes.ok) setRooms(((await roomRes.json()) as Payload).rows || []);
    if (otRes.ok) setOtRows(((await otRes.json()) as Payload).rows || []);
    if (paymentRes.ok) setPayments(((await paymentRes.json()) as Payload).rows || []);
    if (patientRes.ok) setPatients(((await patientRes.json()) as { patients?: Row[] }).patients || []);
    if (ownerRes.ok) setOwner((await ownerRes.json()) as Payload);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const save = async (
    label: string,
    url: string,
    body: Record<string, string>,
    resetKey?: keyof typeof emptyForms
  ) => {
    setSaving(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Failed to save ${label}`);
      notify.success(payload.message || `${label} saved`);
      if (resetKey) {
        setForms((current) => ({ ...current, [resetKey]: emptyForms[resetKey] }));
      }
      await load();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : `Failed to save ${label}`);
    } finally {
      setSaving(false);
    }
  };

  const ownerCards = useMemo<Array<[string, string | number]>>(
    () => [
      ["OP Revenue", asString(owner?.summary?.op_revenue || 0)],
      ["IP Revenue", asString(owner?.summary?.ip_revenue || 0)],
      ["OT Revenue", asString(owner?.summary?.ot_revenue || 0)],
      ["Lab Revenue", asString(owner?.summary?.lab_revenue || 0)],
      ["Pharmacy Revenue", asString(owner?.summary?.pharmacy_revenue || 0)],
      ["Medicine Burn", asString(owner?.summary?.medicine_burn_rate || 0)],
      ["Lab Bills Paid", asString(owner?.summary?.lab_bills_paid || 0)],
      ["Samples Collected", asString(owner?.summary?.samples_collected || 0)],
      ["Rooms Occupied", `${asString(owner?.summary?.rooms_occupied || 0)} / ${asString(owner?.summary?.rooms_total || 0)}`],
      ["Current Bills", asString(owner?.summary?.current_bills || 0)],
      ["Profit", asString(owner?.summary?.profit || 0)],
    ],
    [owner]
  );

  const selectVitalsPatient = (patient: Row) => {
    setSelectedVitalsPatient(patient);
    setForms((current) => ({
      ...current,
      vitals: {
        ...current.vitals,
        patient_id: asString(patient.id),
        appointment_id: asString(
          patient.appointment_id || patient.latest_appointment_id
        ),
        blood_pressure: formatBloodPressureInput(asString(patient.blood_pressure || "")),
        pulse: asString(patient.pulse || ""),
        temperature: asString(patient.temperature || ""),
        spo2: asString(patient.spo2 || ""),
        height: asString(patient.height || ""),
        weight: asString(patient.weight || ""),
        respiration: asString(patient.respiration || ""),
        notes: asString(patient.vitals_notes || ""),
      } as typeof current.vitals,
    }));
    notify.success(
      patient.appointment_id || patient.latest_appointment_id
        ? `Loaded ${asString(patient.patient_name)} for vitals.`
        : `Loaded ${asString(patient.patient_name)}. Active appointment is required.`
    );
  };

  const completedVitalsQueue = vitalsQueue.filter((row) =>
    Boolean(row.vitals_id) ||
    ["VITALS_COMPLETED", "READY_FOR_CONSULTATION"].includes(asString(row.status)) ||
    ["WAITING_FOR_DOCTOR", "READY_FOR_CONSULTATION"].includes(asString(row.queue_status))
  );
  const readyForDoctorQueue = vitalsQueue.filter((row) =>
    ["WAITING_FOR_DOCTOR", "READY_FOR_CONSULTATION", "IN_CONSULTATION"].includes(asString(row.queue_status)) ||
    ["VITALS_COMPLETED", "READY_FOR_CONSULTATION", "IN_CONSULTATION"].includes(asString(row.status))
  );

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            Real Hospital Workflow
          </p>
          <h1 className="mt-2 text-4xl font-black">Front Desk → Vitals → Doctor → Lab → Pharmacy → Billing</h1>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-white/90">
            This command center uses real patient, appointment, master, queue, result, dispense and payment records. No dummy buttons.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Kpi title="Vitals Waiting" value={vitalsQueue.length} icon={HeartPulse} href="#vitals" />
          <Kpi title="Pending Lab Orders" value={labOrders.filter((row) => !["RELEASED", "RESULT_RELEASED", "RESULT_READY"].includes(asString(row.status))).length} icon={FlaskConical} href="#lab" />
          <Kpi title="Pharmacy Queue" value={pharmacyQueue.length} icon={Pill} href="#pharmacy" />
          <Kpi title="Payments" value={payments.length} icon={Receipt} href="#front-desk" />
        </section>

        <ClinicalPatientLookup
          title="Operational Patient Lookup"
          description="Search by patient name, mobile number, UHID/MRN, or ABHA before opening vitals, doctor, lab, pharmacy, billing, IP, ICU, OT, or nursing workflows."
        />

        <Panel id="admin" title="Admin Module: Users, Lab Master, Medicine Master" icon={ShieldCheck}>
          <div className="grid gap-4 xl:grid-cols-3">
            <FormCard title="Create Operational User">
              <InputGrid form={forms.user} onChange={(next) => updateForm("user", next)} selectFields={{ role: ["Front Desk", "Vital Team", "Doctors", "Lab", "Pharmacy", "ICU", "OT", "Nurse", "Admin"], status: ["Active", "Inactive"] }} />
              <SaveButton saving={saving} onClick={() => save("User", endpoints.users, forms.user, "user")} />
            </FormCard>
            <FormCard title="Create Lab Test">
              <InputGrid form={forms.labTest} onChange={(next) => updateForm("labTest", next)} selectFields={{ status: ["ACTIVE", "INACTIVE"] }} />
              <SaveButton saving={saving} onClick={() => save("Lab test", endpoints.labTests, forms.labTest, "labTest")} />
            </FormCard>
            <FormCard title="Create Medicine">
              <InputGrid form={forms.medicine} onChange={(next) => updateForm("medicine", next)} selectFields={{ status: ["ACTIVE", "INACTIVE"] }} />
              <SaveButton saving={saving} onClick={() => save("Medicine", endpoints.medicines, forms.medicine, "medicine")} />
            </FormCard>
          </div>
          <RecordStrip title="Latest Users" rows={users} primary="full_name" secondary="role_name" />
          <RecordStrip title="Lab Tests" rows={labTests} primary="lab_test_name" secondary="category" />
          <RecordStrip title="Medicines" rows={medicines} primary="medicine_name" secondary="stock_quantity" />
        </Panel>

        <Panel id="front-desk" title="Front Desk: Search, Appointments and Collections" icon={UserRound}>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[8px] border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#04142E]">
                <Search size={16} />
                Patient Search by Name / Mobile / MRN / ABHA
              </div>
              <RecordStrip title="Patients linked to search context" rows={patients} primary="first_name" secondary="phone" hrefBase="/clinical-services/patients" />
            </div>
            <FormCard title="Collect Fee">
              <InputGrid form={forms.payment} onChange={(next) => updateForm("payment", next)} selectFields={{ payment_type: ["CONSULTATION_FEE", "LAB_PAYMENT", "OT_PAYMENT", "IP_PAYMENT", "ROOM_RENT", "PHARMACY_PAYMENT"], payment_method: ["Cash", "UPI", "Card", "Bank Transfer"] }} />
              <SaveButton saving={saving} onClick={() => save("Payment", endpoints.payments, forms.payment, "payment")} />
            </FormCard>
          </div>
        </Panel>

        <Panel id="vitals" title="Vital Collection Team: Patients Waiting" icon={HeartPulse}>
          <div className="grid gap-4 2xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <ClinicalPatientLookup
                title="Vitals Patient Lookup"
                description="Search by patient name, mobile number, UHID/MRN, or ABHA. Selecting the patient loads the current appointment, token, status, and existing vitals."
                compact
                onSelectPatient={selectVitalsPatient}
              />
              <VitalsFormCard
                form={forms.vitals}
                selectedPatient={selectedVitalsPatient}
                saving={saving}
                onChange={(next) => updateForm("vitals", next)}
                onSave={() => {
                  if (
                    forms.vitals.blood_pressure &&
                    !parseBloodPressure(forms.vitals.blood_pressure)
                  ) {
                    notify.error(BP_VALIDATION_MESSAGE);
                    return;
                  }

                  void save("Vitals", endpoints.vitals, forms.vitals, "vitals");
                }}
              />
            </div>
            <div className="space-y-4">
              <RecordStrip title="Today Queue" rows={vitalsQueue} primary="patient_name" secondary="token_number" hrefBase="/clinical-services/doctors/consultation" />
              <RecordStrip title="Completed Vitals" rows={completedVitalsQueue} primary="patient_name" secondary="blood_pressure" hrefBase="/clinical-services/doctors/consultation" />
              <RecordStrip title="Ready For Doctor Queue" rows={readyForDoctorQueue} primary="patient_name" secondary="queue_status" hrefBase="/clinical-services/doctors/consultation" />
            </div>
          </div>
        </Panel>

        <Panel id="lab" title="Lab Module: Sample, Result Entry, Approval and Release" icon={FlaskConical}>
          <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
            <FormCard title="Enter Lab Result">
              <InputGrid form={forms.labResult} onChange={(next) => updateForm("labResult", next)} selectFields={{ action: ["RESULT_ENTRY", "VALIDATE", "APPROVE", "RELEASE", "PROCESSING", "SAMPLE_COLLECTED"] }} />
              <SaveButton saving={saving} onClick={() => save("Lab result", endpoints.labResults, forms.labResult, "labResult")} />
            </FormCard>
            <RecordStrip
              title="Lab Orders"
              rows={labOrders}
              primary="order_type"
              secondary="patient_name"
              action={(row) => (
                <div className="flex flex-wrap gap-2">
                  {asString(row.status) !== "SAMPLE_COLLECTED" &&
                  !["COLLECTED", "SAMPLE_COLLECTED", "PROCESSING", "RESULT_ENTERED", "VALIDATED", "APPROVED", "RELEASED", "RESULT_APPROVED", "RESULT_RELEASED", "RESULT_READY"].includes(asString(row.status)) ? (
                    <button
                      type="button"
                      onClick={() =>
                        save("Sample collected", endpoints.labResults, {
                          lab_order_id: asString(row.id),
                          action: "SAMPLE_COLLECTED",
                          remarks: "Sample collected from lab desk",
                          result_value: "",
                          attachments: "",
                        })
                      }
                      className="rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#735300]"
                    >
                      Mark Sample Collected
                    </button>
                  ) : null}
                  {asString(row.status) === "COLLECTED" ? (
                    <button
                      type="button"
                      onClick={() =>
                        save("Processing started", endpoints.labResults, {
                          lab_order_id: asString(row.id),
                          action: "PROCESSING",
                          remarks: "Lab processing started.",
                        })
                      }
                      className="rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#735300]"
                    >
                      Start Processing
                    </button>
                  ) : null}
                  {asString(row.status) === "RESULT_ENTERED" ? (
                    <button
                      type="button"
                      onClick={() =>
                        save("Result validated", endpoints.labResults, {
                          lab_order_id: asString(row.id),
                          action: "VALIDATE",
                          remarks: "Result validated by lab.",
                        })
                      }
                      className="rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#735300]"
                    >
                      Validate
                    </button>
                  ) : null}
                  {asString(row.status) === "VALIDATED" ? (
                    <button
                      type="button"
                      onClick={() =>
                        save("Result approved", endpoints.labResults, {
                          lab_order_id: asString(row.id),
                          action: "APPROVE",
                          remarks: "Result approved by lab.",
                        })
                      }
                      className="rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#735300]"
                    >
                      Approve
                    </button>
                  ) : null}
                  {asString(row.status) === "APPROVED" ? (
                    <button
                      type="button"
                      onClick={() =>
                        save("Result released", endpoints.labResults, {
                          lab_order_id: asString(row.id),
                          action: "RELEASE",
                          remarks: "Result released for doctor review.",
                        })
                      }
                      className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800"
                    >
                      Release
                    </button>
                  ) : null}
                  <Link
                    href={`/clinical-services/doctors/consultation/${asString(row.appointment_id)}`}
                    className="rounded-[8px] bg-[#04142E] px-3 py-2 text-xs font-black text-white"
                  >
                    Doctor View
                  </Link>
                </div>
              )}
            />
          </div>
        </Panel>

        <Panel id="pharmacy" title="Pharmacy Module: Doctor Prescription Queue" icon={Pill}>
          <RecordStrip
            title="Pending Prescriptions"
            rows={pharmacyQueue}
            primary="patient_name"
            secondary="prescription_uid"
            action={(row) => (
              <div className="flex flex-wrap gap-2">
                {["DISPENSED", "PARTIAL_DISPENSE", "OUT_OF_STOCK"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => save(status, endpoints.pharmacy, { queue_id: asString(row.id), dispense_status: status })}
                    className="rounded-[8px] border border-[#D4AF37]/50 bg-[#fff9e8] px-3 py-2 text-xs font-black text-[#735300]"
                  >
                    {status.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            )}
          />
        </Panel>

        <Panel id="rooms" title="Room and OT Management" icon={Bed}>
          <div className="grid gap-4 xl:grid-cols-2">
            <FormCard title="Room Master / Allocation">
              <InputGrid form={forms.room} onChange={(next) => updateForm("room", next)} selectFields={{ status: ["AVAILABLE", "OCCUPIED", "MAINTENANCE"] }} />
              <SaveButton saving={saving} onClick={() => save("Room", endpoints.rooms, forms.room, "room")} />
            </FormCard>
            <FormCard title="OT Booking">
              <InputGrid form={forms.ot} onChange={(next) => updateForm("ot", next)} selectFields={{ status: ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] }} />
              <SaveButton saving={saving} onClick={() => save("OT schedule", endpoints.ot, forms.ot, "ot")} />
            </FormCard>
          </div>
          <RecordStrip title="Rooms" rows={rooms} primary="room_number" secondary="status" />
          <RecordStrip title="OT Schedules" rows={otRows} primary="procedure_name" secondary="status" />
        </Panel>

        <Panel id="owner" title="Owner / Management Dashboard" icon={Activity}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {ownerCards.map(([title, value]) => (
              <Kpi key={title} title={title} value={value} icon={Receipt} href="/clinical-services/operations#front-desk" />
            ))}
          </div>
          <RecordStrip title="Workflow Movement" rows={owner?.workflow || []} primary="workflow_stage" secondary="status" />
        </Panel>
      </div>
    </ClinicalShell>
  );
}

function Panel({ id, title, icon: Icon, children }: { id: string; title: string; icon: typeof Activity; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
          <Icon size={20} />
        </div>
        <h2 className="text-2xl font-black text-[#04142E]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Kpi({ title, value, icon: Icon, href }: { title: string; value: string | number; icon: typeof Activity; href: string }) {
  return (
    <Link href={href} className="group rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">{title}</p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-black text-[#04142E]">{value}</p>
    </Link>
  );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-lg font-black text-[#04142E]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InputGrid({ form, onChange, selectFields = {} }: { form: Record<string, string>; onChange: (next: Record<string, string>) => void; selectFields?: Record<string, string[]> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Object.keys(form).map((key) => (
        <label key={key} className="block">
          <span className="text-xs font-black uppercase text-slate-600">{key.replaceAll("_", " ")}</span>
          {selectFields[key] ? (
            <select
              value={form[key]}
              onChange={(event) => onChange({ ...form, [key]: event.target.value })}
              className="mt-2 w-full rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
            >
              {selectFields[key].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              value={form[key]}
              onChange={(event) => onChange({ ...form, [key]: event.target.value })}
              className="mt-2 w-full rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
            />
          )}
        </label>
      ))}
    </div>
  );
}

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0b2448] disabled:opacity-50"
  >
      {saving ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        <Save size={16} />
      )}
      {saving ? "Saving..." : "Save"}
    </button>
  );
}

function VitalsFormCard({
  form,
  selectedPatient,
  saving,
  onChange,
  onSave,
}: {
  form: Record<string, string>;
  selectedPatient: Row | null;
  saving: boolean;
  onChange: (next: Record<string, string>) => void;
  onSave: () => void;
}) {
  const fields = [
    "blood_pressure",
    "pulse",
    "temperature",
    "spo2",
    "height",
    "weight",
    "respiration",
    "notes",
  ];
  return (
    <FormCard title="Save Vitals and Mark Ready">
      {selectedPatient ? (
        <div className="rounded-[8px] border border-[#D4AF37]/45 bg-[#fff9e8] p-3">
          <p className="text-sm font-black text-[#04142E]">
            {asString(selectedPatient.patient_name) || "Selected patient"}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-700">
            UHID/MRN {asString(selectedPatient.uhid || selectedPatient.patient_uid)} | Token{" "}
            {asString(selectedPatient.token_number)} | Status{" "}
            {asString(selectedPatient.appointment_status || selectedPatient.latest_visit_status)} / {asString(selectedPatient.queue_status)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-700">
            Latest visit {asString(selectedPatient.latest_visit_date || selectedPatient.appointment_date || "-")} | Rx{" "}
            {asString(selectedPatient.latest_prescription_uid || "No prescription")} | Lab reports{" "}
            {asString(selectedPatient.lab_report_count || 0)} | Radiology{" "}
            {asString(selectedPatient.radiology_record_count || 0)}
          </p>
          {selectedPatient.vitals_id ? (
            <p className="mt-2 inline-flex items-center gap-2 rounded-[8px] bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800">
              <CheckCircle2 size={13} />
              Existing vitals: BP {asString(selectedPatient.blood_pressure)}, Pulse{" "}
              {asString(selectedPatient.pulse)}, SpO2 {asString(selectedPatient.spo2)}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="rounded-[8px] border border-dashed border-[#D4AF37]/50 bg-white p-3 text-sm font-bold text-slate-600">
          Search and select a patient before entering vitals.
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((key) => (
          <label key={key} className={key === "notes" ? "block md:col-span-2" : "block"}>
            <span className="text-xs font-black uppercase text-slate-600">{key.replaceAll("_", " ")}</span>
            <input
              value={form[key] || ""}
              onChange={(event) =>
                onChange({
                  ...form,
                  [key]:
                    key === "blood_pressure"
                      ? formatBloodPressureInput(event.target.value)
                      : event.target.value,
                })
              }
              placeholder={key === "blood_pressure" ? "120/80" : undefined}
              inputMode={key === "blood_pressure" ? "numeric" : undefined}
              maxLength={key === "blood_pressure" ? 6 : undefined}
              className="mt-2 w-full rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-[#04142E] outline-none focus:border-[#D4AF37]"
            />
            {key === "blood_pressure" &&
            shouldShowBloodPressureError(form[key] || "") ? (
              <span className="mt-1 block text-xs font-black text-red-700">
                {BP_VALIDATION_MESSAGE}
              </span>
            ) : null}
          </label>
        ))}
      </div>
      <SaveButton saving={saving} onClick={onSave} />
    </FormCard>
  );
}

function RecordStrip({ title, rows, primary, secondary, hrefBase, action }: { title: string; rows: Row[]; primary: string; secondary: string; hrefBase?: string; action?: (row: Row) => React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-black uppercase tracking-[0.08em] text-[#8a6500]">{title}</h3>
      {rows.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.slice(0, 12).map((row) => {
            const content = (
              <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-md">
                <p className="break-words text-base font-black text-[#04142E]">{asString(row[primary]) || asString(row.patient_name) || asString(row.name) || `#${asString(row.id)}`}</p>
                <p className="mt-1 break-words text-xs font-bold text-slate-600">{asString(row[secondary]) || asString(row.status) || "-"}</p>
                <p className="mt-2 text-[11px] font-black uppercase text-[#8a6500]">{asString(row.status || row.queue_status || row.role_key || "")}</p>
                {action ? <div className="mt-3">{action(row)}</div> : null}
              </div>
            );

            if (hrefBase) {
              const id = asString(row.appointment_id || row.patient_id || row.id);
              return (
                <Link key={`${title}-${asString(row.id)}`} href={`${hrefBase}/${id}`}>
                  {content}
                </Link>
              );
            }

            return <div key={`${title}-${asString(row.id)}`}>{content}</div>;
          })}
        </div>
      ) : (
        <p className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-slate-600">
          No records yet.
        </p>
      )}
    </div>
  );
}
