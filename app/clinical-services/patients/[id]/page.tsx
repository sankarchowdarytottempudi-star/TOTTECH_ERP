"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  FileText,
  FlaskConical,
  HeartPulse,
  History,
  Pill,
  ShieldAlert,
  ScanLine,
  UserRound,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";

type Row = Record<string, unknown>;

const labResultDisplay = (row: Row) => {
  const resultData = row.result_data && typeof row.result_data === "object"
    ? row.result_data as Row
    : {};
  const value = String(row.result_value || resultData.value || resultData.result_value || "").trim();
  const unit = String(row.result_unit || resultData.unit || "").trim();
  const reference = String(row.reference_range || resultData.reference_range || "").trim();
  const releasedBy = String(row.released_by_name || "").trim();
  const releasedAt = String(row.released_at || row.validated_at || row.updated_at || row.created_at || "").trim();
  return {
    name: String(row.lab_test_name || row.order_type || resultData.test_name || row.result_uid || row.order_uid || "Lab record"),
    value,
    unit,
    reference,
    releasedBy,
    releasedAt,
    status: String(row.result_status || row.status || row.order_status || "-"),
  };
};

type PatientPayload = {
  patient?: Row;
  appointments?: Row[];
  opVisits?: Row[];
  erVisits?: Row[];
  admissions?: Row[];
  icuRecords?: Row[];
  otSchedules?: Row[];
  nursingNotes?: Row[];
  medicalRecords?: Row[];
  vitals?: Row[];
  operationalPayments?: Row[];
  ivfCases?: Row[];
  labOrders?: Row[];
  labResults?: Row[];
  radiologyOrders?: Row[];
  radiologyReports?: Row[];
  radiologyUploads?: Row[];
  prescriptions?: Row[];
  documents?: Row[];
  invoices?: Row[];
  payments?: Row[];
  insurancePolicies?: Row[];
  insuranceClaims?: Row[];
  ivfCouples?: Row[];
  ivfCycles?: Row[];
  pharmacySales?: Row[];
  pharmacyDispensing?: Row[];
  financeInvoices?: Row[];
  interopResources?: Row[];
  alerts?: Row[];
  timeline?: Row[];
  audit?: Row[];
};

const labOrderDisplay = (row: Row) => ({
  name: String(row.lab_test_name || row.order_type || row.order_uid || "Lab order"),
  orderedAt: String(row.ordered_at || row.created_at || "").trim(),
  orderedBy: String(row.doctor_name || row.created_by_name || row.doctor_id || "Doctor").trim(),
  status: String(row.status || row.order_status || "-").trim(),
  priority: String(row.priority || "NORMAL").trim(),
});

export default function ClinicalPatientProfilePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PatientPayload | null>(null);
  const [saving, setSaving] = useState(false);
  const editMode = searchParams?.get("mode") === "edit";
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const response = await fetch(
        `/api/clinical/hms/patient-360/${params?.id}`
      );

      if (response.ok) {
        setData(await response.json());
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [params?.id]);

  useEffect(() => {
    const patient = data?.patient || {};
    setForm({
      first_name: String(patient.first_name || ""),
      middle_name: String(patient.middle_name || ""),
      last_name: String(patient.last_name || ""),
      gender: String(patient.gender || ""),
      date_of_birth: String(patient.date_of_birth || "").slice(0, 10),
      blood_group: String(patient.blood_group || ""),
      religion: String(patient.religion || ""),
      phone: String(patient.phone || ""),
      email: String(patient.email || ""),
      whatsapp_number: String(patient.whatsapp_number || ""),
      address: String(patient.address || ""),
      address_line1: String(patient.address_line1 || ""),
      address_line2: String(patient.address_line2 || ""),
      landmark: String(patient.landmark || ""),
      city: String(patient.city || ""),
      district: String(patient.district || ""),
      state: String(patient.state || ""),
      country: String(patient.country || ""),
      pincode: String(patient.pincode || ""),
    });
  }, [data]);

  const savePatient = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/clinical/patients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params?.id,
          ...form,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to update patient");
      }
      window.location.href = `/clinical-services/patients/${payload.id || params?.id}`;
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to update patient");
    } finally {
      setSaving(false);
    }
  };

  const deletePatient = async () => {
    if (!window.confirm("Delete this patient?")) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/clinical/patients?id=${params?.id}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to delete patient");
      }
      window.location.href = "/clinical-services/patients";
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete patient");
    } finally {
      setSaving(false);
    }
  };

  const patient = data?.patient || {};
  const patientName =
    `${patient.first_name || ""} ${patient.last_name || ""}`.trim() ||
    "Patient";
  const journey =
    buildPatientJourney(data);

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <section className="tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-6 text-white shadow-sm">
          <Link
            href="/clinical-services/patients"
            className="text-sm font-black text-teal-300"
          >
            Back to Patients
          </Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.36fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-300">
                Patient 360
              </p>
              <h1 className="mt-2 break-words text-4xl font-black">
                {patientName}
              </h1>
              <p className="mt-2 break-words text-sm font-semibold text-slate-200">
                {String(patient.patient_uid || "-")} |{" "}
                {String(patient.phone || "No phone")} |{" "}
                {String(patient.status || "ACTIVE")}
              </p>
            </div>
            <div className="rounded-[8px] border border-teal-300 bg-white p-4 text-slate-950">
              <p className="text-xs font-black uppercase text-teal-700">
                QR Payload
              </p>
              <p className="mt-2 break-words text-sm font-black">
                {String(patient.patient_uid || "Register patient")}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={CalendarDays}
            title="Appointments"
            value={data?.appointments?.length || 0}
          />
          <Metric
            icon={FileText}
            title="OP Visits"
            value={data?.opVisits?.length || 0}
          />
          <Metric
            icon={HeartPulse}
            title="Vitals"
            value={data?.vitals?.length || 0}
          />
          <Metric
            icon={HeartPulse}
            title="Admissions"
            value={data?.admissions?.length || 0}
          />
          <Metric
            icon={History}
            title="Timeline"
            value={data?.timeline?.length || 0}
          />
          <Metric
            icon={Pill}
            title="Prescriptions"
            value={data?.prescriptions?.length || 0}
          />
          <Metric
            icon={FlaskConical}
            title="Lab Reports"
            value={data?.labResults?.length || 0}
          />
          <Metric
            icon={ScanLine}
            title="Radiology"
            value={
              (data?.radiologyOrders?.length || 0) +
              (data?.radiologyReports?.length || 0) +
              (data?.radiologyUploads?.length || 0)
            }
          />
          <Metric
            icon={HeartPulse}
            title="IVF Records"
            value={
              (data?.ivfCouples?.length || 0) +
              (data?.ivfCycles?.length || 0) +
              (data?.ivfCases?.length || 0)
            }
          />
          <Metric
            icon={FileText}
            title="Finance"
            value={
              (data?.invoices?.length || 0) +
              (data?.financeInvoices?.length || 0)
            }
          />
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
                Patient Journey
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Registration to Clinical Closure
              </h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                This journey is generated from real patient, appointment, OP/IP,
                lab, radiology, pharmacy, billing and audit records for the
                current hospital context.
              </p>
            </div>
            <Link
              href={`/clinical-services/patients/${params?.id}/timeline`}
              className="rounded-[8px] bg-[#0B1F3A] px-4 py-3 text-sm font-black text-[#D4AF37]"
            >
              Open Timeline
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {journey.map((step) => {
              const Icon = step.icon;
              return (
                <Link
                  key={step.key}
                  href={step.href}
                  className={`group rounded-[8px] border p-4 transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-md ${
                    step.count
                      ? "border-slate-200 bg-slate-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#0B1F3A] text-[#D4AF37]">
                      <Icon size={18} />
                    </div>
                    <span className="rounded-full border border-[#D4AF37] bg-[#fff9e8] px-3 py-1 text-xs font-black text-[#8a6500]">
                      {step.count}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-black uppercase text-slate-950">
                    {step.title}
                  </p>
                  <p className="mt-1 break-words text-xs font-semibold leading-5 text-slate-600">
                    {step.summary}
                  </p>
                  <p className="mt-3 break-words text-xs font-black uppercase text-[#8a6500]">
                    {step.latest || "No record yet"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {editMode ? (
            <section className="xl:col-span-2 rounded-[8px] border border-[#D4AF37]/40 bg-[#fff9e8] p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a6500]">
                    Patient Maintenance
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    Edit Patient
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                    Update core patient identity and contact details. All changes are saved to the clinical record and audit trail.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={savePatient}
                    disabled={saving}
                    className="rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={deletePatient}
                    disabled={saving}
                    className="rounded-[8px] border border-red-200 bg-white px-4 py-3 text-sm font-black text-red-700 disabled:opacity-50"
                  >
                    Delete Patient
                  </button>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ["first_name", "First Name"],
                  ["middle_name", "Middle Name"],
                  ["last_name", "Last Name"],
                  ["gender", "Gender"],
                  ["date_of_birth", "Date of Birth", "date"],
                  ["phone", "Phone Number"],
                  ["email", "Email", "email"],
                  ["whatsapp_number", "WhatsApp Number"],
                  ["blood_group", "Blood Group"],
                  ["religion", "Religion"],
                  ["address_line1", "Address Line 1"],
                  ["address_line2", "Address Line 2"],
                  ["landmark", "Landmark"],
                  ["city", "City"],
                  ["district", "District"],
                  ["state", "State"],
                  ["country", "Country"],
                  ["pincode", "Postal Code"],
                ].map(([key, label, type]) => (
                  <label key={key} className="block">
                    <span className="text-xs font-black uppercase text-slate-600">{label}</span>
                    <input
                      value={form[key] || ""}
                      type={type === "date" ? "date" : type === "email" ? "email" : "text"}
                      onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                      className="mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"
                    />
                  </label>
                ))}
              </div>
            </section>
          ) : null}

          <Panel title="Profile" icon={UserRound}>
            <Info label="Gender" value={patient.gender} />
            <Info label="Date of Birth" value={patient.date_of_birth} />
            <Info label="Email" value={patient.email} />
            <Info label="Address" value={patient.address} />
            <Info
              label="Emergency Contact"
              value={`${patient.emergency_contact_name || "-"} ${patient.emergency_contact_phone || ""}`.trim()}
            />
            <Info label="Insurance" value={patient.insurance_provider} />
          </Panel>
          <Panel title="Clinical History" icon={ShieldAlert}>
            <Info label="Blood Group" value={patient.blood_group} />
            <Info label="Allergies" value={patient.allergies} />
            <Info label="Medical History" value={patient.medical_history} />
          </Panel>
          <Panel title="Vitals" icon={HeartPulse}>
            <Rows
              rows={data?.vitals || []}
              empty="No vitals captured yet."
              primary={(row) =>
                `BP ${row.blood_pressure || "-"} | Pulse ${row.pulse || "-"} | SpO2 ${row.spo2 || "-"}`
              }
              secondary={(row) =>
                `BMI ${row.bmi || "-"} | ${row.created_at || ""}`
              }
              hrefForRow={() =>
                `/clinical-services/patients/${params?.id}`
              }
            />
          </Panel>
          <Panel title="Consultations and Prescriptions" icon={Pill}>
            <Rows
              rows={[
                ...(data?.medicalRecords || []),
                ...(data?.prescriptions || []),
              ]}
              empty="No consultations or prescriptions yet."
              primary={(row) =>
                String(
                  row.prescription_uid ||
                    row.diagnosis ||
                    row.chief_complaint ||
                    "Consultation"
                )
              }
              secondary={(row) =>
                `${row.status || row.pharmacy_status || "-"} | ${row.follow_up_date || row.created_at || ""}`
              }
              hrefForRow={() =>
                "/clinical-services/hms/op"
              }
            />
          </Panel>
          <Panel title="Lab Orders" icon={FlaskConical}>
            <Rows
              rows={data?.labOrders || []}
              empty="No lab orders yet."
              primary={(row) => {
                const order = labOrderDisplay(row);
                return order.name;
              }}
              secondary={(row) => {
                const order = labOrderDisplay(row);
                return [
                  `Status ${order.status}`,
                  `Priority ${order.priority}`,
                  order.orderedAt ? `Ordered ${order.orderedAt}` : "",
                  order.orderedBy ? `By ${order.orderedBy}` : "",
                ]
                  .filter(Boolean)
                  .join(" | ");
              }}
              hrefForRow={() =>
                "/clinical-services/hms/lab-orders"
              }
            />
          </Panel>
          <Panel title="Lab Results" icon={FlaskConical}>
            <Rows
              rows={data?.labResults || []}
              empty="No lab results yet."
              primary={(row) => {
                const result = labResultDisplay(row);
                return result.value
                  ? `${result.name}: ${result.value}${result.unit ? ` ${result.unit}` : ""}`
                  : result.name;
              }}
              secondary={(row) => {
                const result = labResultDisplay(row);
                return [
                  `Status ${result.status}`,
                  result.reference ? `Normal range ${result.reference}` : "",
                  result.releasedBy ? `Released by ${result.releasedBy}` : "",
                  result.releasedAt ? `Result date ${result.releasedAt}` : "",
                ]
                  .filter(Boolean)
                  .join(" | ");
              }}
              hrefForRow={() =>
                "/clinical-services/hms/lab-orders"
              }
            />
          </Panel>
          <Panel title="Radiology Reports and Uploads" icon={ScanLine}>
            <Rows
              rows={[
                ...(data?.radiologyOrders || []),
                ...(data?.radiologyReports || []),
                ...(data?.radiologyUploads || []),
              ]}
              empty="No radiology orders, reports, or uploads yet."
              primary={(row) =>
                String(
                  row.order_number ||
                    row.report_number ||
                    row.file_name ||
                    row.study_type ||
                    "Radiology record"
                )
              }
              secondary={(row) =>
                `${row.order_status || row.status || row.file_type || "-"} | ${row.order_date || row.study_date || row.uploaded_at || row.created_at || ""}`
              }
              hrefForRow={() =>
                "/clinical-services/hms/radiology-orders"
              }
            />
          </Panel>
          <Panel title="Appointments" icon={CalendarDays}>
            <Rows
              rows={data?.appointments || []}
              empty="No appointments yet."
              primary={(row) =>
                `${row.appointment_date || ""} ${row.token_number || ""}`.trim()
              }
              secondary={(row) =>
                `${row.status || "-"} | ${row.doctor_name || "No doctor"}`
              }
              hrefForRow={() =>
                "/clinical-services/appointments"
              }
            />
          </Panel>
          <Panel title="OP / ER / IP History" icon={FileText}>
            <Rows
              rows={[
                ...(data?.opVisits || []),
                ...(data?.erVisits || []),
                ...(data?.admissions || []),
              ]}
              empty="No OP, ER, or IP records yet."
              primary={(row) =>
                String(
                  row.visit_number ||
                    row.er_number ||
                    row.admission_number ||
                    "Clinical record"
                )
              }
              secondary={(row) =>
                `${row.status || row.triage_level || "-"} | ${row.visit_date || row.arrival_time || row.admission_date || ""}`
              }
              hrefForRow={(row) =>
                row.admission_number && row.id
                  ? `/clinical-services/hms/ip/${row.id}`
                  : "/clinical-services/hms/op"
              }
            />
          </Panel>
          <Panel title="Billing and Insurance" icon={FileText}>
            <Rows
              rows={[
                ...(data?.invoices || []),
                ...(data?.financeInvoices || []),
                ...(data?.payments || []),
                ...(data?.operationalPayments || []),
                ...(data?.insuranceClaims || []),
              ]}
              empty="No billing or insurance records yet."
              primary={(row) =>
                String(
                  row.invoice_number ||
                    row.payment_number ||
                    row.payment_type ||
                    row.claim_number ||
                    "Financial record"
                )
              }
              secondary={(row) =>
                `${row.status || row.method || "-"} | ${row.total || row.amount || row.claimed_amount || ""}`
              }
              hrefForRow={() =>
                "/clinical-services/hms/billing"
              }
            />
          </Panel>
          <Panel title="IVF History" icon={HeartPulse}>
            <Rows
              rows={[
                ...(data?.ivfCases || []),
                ...(data?.ivfCouples || []),
                ...(data?.ivfCycles || []),
              ]}
              empty="No IVF records yet."
              primary={(row) =>
                String(
                  row.couple_number ||
                    row.case_uid ||
                    row.cycle_number ||
                    "IVF record"
                )
              }
              secondary={(row) =>
                `${row.status || "-"} | ${row.created_at || row.start_date || ""}`
              }
              hrefForRow={() =>
                "/clinical-services/ivf/cycles"
              }
            />
          </Panel>
          <Panel title="Pharmacy and Medicines" icon={FileText}>
            <Rows
              rows={[
                ...(data?.pharmacySales || []),
                ...(data?.pharmacyDispensing || []),
              ]}
              empty="No pharmacy activity yet."
              primary={(row) =>
                String(
                  row.bill_number ||
                    row.dispensing_number ||
                    row.medicine_name ||
                    row.prescription_number ||
                    "Pharmacy record"
                )
              }
              secondary={(row) =>
                `${row.status || "-"} | ${row.total || row.quantity || ""}`
              }
              hrefForRow={() =>
                "/clinical-services/pharmacy"
              }
            />
          </Panel>
          <Panel title="Interoperability" icon={FileText}>
            <Rows
              rows={data?.interopResources || []}
              empty="No FHIR/interop resources yet."
              primary={(row) =>
                String(
                  row.fhir_id ||
                    row.resource_type ||
                    "FHIR resource"
                )
              }
              secondary={(row) =>
                `${row.resource_type || "-"} | ${row.resource_status || "-"}`
              }
              hrefForRow={() =>
                "/clinical-services/interoperability/fhir"
              }
            />
          </Panel>
          <Panel title="Timeline and Alerts" icon={History}>
            <Rows
              rows={[
                ...(data?.alerts || []),
                ...(data?.timeline || []),
              ]}
              empty="No timeline or alert events yet."
              primary={(row) =>
                String(
                  row.alert_title ||
                    row.event_title ||
                    row.summary ||
                    row.action ||
                    "Event"
                )
              }
              secondary={(row) =>
                `${row.event_type || row.alert_type || "-"} | ${row.event_time || row.created_at || ""}`
              }
              hrefForRow={() =>
                "/clinical-services/security/audit-logs"
              }
            />
          </Panel>
          <Panel title="Audit Evidence" icon={History}>
            <Rows
              rows={data?.audit || []}
              empty="No audit evidence yet."
              primary={(row) =>
                String(row.summary || row.action || "Audit event")
              }
              secondary={(row) =>
                `${row.module_name || "-"} | ${row.created_at || ""}`
              }
              hrefForRow={() =>
                "/clinical-services/security/audit-logs"
              }
            />
          </Panel>
        </section>
      </div>
    </ClinicalShell>
  );
}

function latestFrom(
  rows: Row[] | undefined,
  ...fields: string[]
) {
  const row = rows?.[0];

  if (!row) {
    return "";
  }

  for (const field of fields) {
    if (row[field]) {
      return String(row[field]);
    }
  }

  return "";
}

function buildPatientJourney(
  data: PatientPayload | null
) {
  return [
    {
      key: "registration",
      title: "Registration",
      icon: UserRound,
      count: data?.patient ? 1 : 0,
      summary: "Patient demographics, identity, contact and emergency details.",
      latest: latestFrom(
        data?.patient ? [data.patient] : [],
        "created_at",
        "updated_at"
      ),
      href: "/clinical-services/patients",
    },
    {
      key: "appointments",
      title: "Appointments",
      icon: CalendarDays,
      count: data?.appointments?.length || 0,
      summary: "Bookings, queue movement, doctor assignment and follow-ups.",
      latest: latestFrom(
        data?.appointments,
        "appointment_date",
        "created_at"
      ),
      href: "/clinical-services/appointments",
    },
    {
      key: "consultations",
      title: "OP / EMR",
      icon: FileText,
      count:
        (data?.opVisits?.length || 0) +
        (data?.medicalRecords?.length || 0),
      summary: "OP visits, chief complaints, diagnosis, advice and notes.",
      latest: latestFrom(
        [
          ...(data?.opVisits || []),
          ...(data?.medicalRecords || []),
        ],
        "visit_date",
        "created_at"
      ),
      href: "/clinical-services/hms/op",
    },
    {
      key: "diagnostics",
      title: "Diagnostics",
      icon: FlaskConical,
      count:
        (data?.labOrders?.length || 0) +
        (data?.labResults?.length || 0) +
        (data?.radiologyOrders?.length || 0) +
        (data?.radiologyReports?.length || 0),
      summary: "Lab orders, lab results, radiology orders and reports.",
      latest: latestFrom(
        [
          ...(data?.labResults || []),
          ...(data?.radiologyOrders || []),
          ...(data?.radiologyReports || []),
        ],
        "ordered_at",
        "created_at",
        "order_date"
      ),
      href: "/clinical-services/hms/lab-orders",
    },
    {
      key: "admissions",
      title: "IP / Critical Care",
      icon: HeartPulse,
      count:
        (data?.admissions?.length || 0) +
        (data?.icuRecords?.length || 0),
      summary: "Admissions, ICU monitoring, ward movement and nursing records.",
      latest: latestFrom(
        [
          ...(data?.admissions || []),
          ...(data?.icuRecords || []),
        ],
        "admission_date",
        "created_at"
      ),
      href: "/clinical-services/hms/ip",
    },
    {
      key: "pharmacy",
      title: "Pharmacy",
      icon: Pill,
      count:
        (data?.prescriptions?.length || 0) +
        (data?.pharmacySales?.length || 0) +
        (data?.pharmacyDispensing?.length || 0),
      summary: "Prescriptions, dispensing, sales and medication history.",
      latest: latestFrom(
        [
          ...(data?.prescriptions || []),
          ...(data?.pharmacySales || []),
          ...(data?.pharmacyDispensing || []),
        ],
        "created_at",
        "dispensed_at"
      ),
      href: "/clinical-services/pharmacy",
    },
    {
      key: "billing",
      title: "Billing / Insurance",
      icon: FileText,
      count:
        (data?.invoices?.length || 0) +
        (data?.financeInvoices?.length || 0) +
        (data?.payments?.length || 0) +
        (data?.insuranceClaims?.length || 0),
      summary: "Invoices, payments, claims and revenue traceability.",
      latest: latestFrom(
        [
          ...(data?.invoices || []),
          ...(data?.financeInvoices || []),
          ...(data?.payments || []),
          ...(data?.insuranceClaims || []),
        ],
        "invoice_date",
        "submitted_date",
        "created_at"
      ),
      href: "/clinical-services/hms/billing",
    },
    {
      key: "audit",
      title: "Timeline / Audit",
      icon: History,
      count:
        (data?.timeline?.length || 0) +
        (data?.audit?.length || 0),
      summary: "Patient events and audit evidence across all modules.",
      latest: latestFrom(
        [
          ...(data?.timeline || []),
          ...(data?.audit || []),
        ],
        "event_time",
        "created_at"
      ),
      href: "/clinical-services/security/audit-logs",
    },
  ];
}

function Metric({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof UserRound;
  title: string;
  value: number;
}) {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-black uppercase text-slate-500">{title}</p>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-4xl font-black">{value}</p>
    </article>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-teal-50 text-teal-800">
          <Icon size={20} />
        </div>
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-slate-950">
        {String(value || "-")}
      </p>
    </div>
  );
}

function Rows({
  rows,
  empty,
  primary,
  secondary,
  hrefForRow,
}: {
  rows: Row[];
  empty: string;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
  hrefForRow?: (row: Row) => string;
}) {
  if (!rows.length) {
    return (
      <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
        {empty}
      </p>
    );
  }

  return rows.map((row, index) => {
    const href = hrefForRow?.(row);
    const content = (
      <>
      <p className="break-words font-black">{primary(row)}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-600">
        {secondary(row)}
      </p>
      </>
    );

    if (href) {
      return (
        <Link
          key={`${primary(row)}-${index}`}
          href={href}
          className="block rounded-[8px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-white hover:shadow-md"
        >
          {content}
        </Link>
      );
    }

    return (
      <div
        key={`${primary(row)}-${index}`}
        className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
      >
        {content}
      </div>
    );
  });
}
