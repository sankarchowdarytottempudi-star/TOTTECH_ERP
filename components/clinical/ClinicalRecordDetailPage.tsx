"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Bed,
  Building2,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Edit3,
  FileClock,
  FileText,
  FlaskConical,
  HeartPulse,
  History,
  Pill,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Wind,
} from "lucide-react";

import ClinicalShell from "@/components/clinical/ClinicalShell";

type Row = Record<string, unknown>;

type Payload = {
  module?: {
    label?: string;
    key?: string;
  };
  rows?: Row[];
};

const familyLabels: Record<string, string> = {
  hms: "HMS Record",
  ivf: "IVF Record",
  pharmacy: "Pharmacy Record",
  finance: "Finance Record",
  analytics: "Analytics Record",
  security: "Security Record",
  compliance: "Compliance Record",
  "api-catalog": "API Contract",
  "business-spec": "Business Specification",
  uiux: "UI/UX Blueprint",
  interoperability: "Interoperability Record",
  dictionary: "Dictionary Record",
  production: "Production Record",
  mobile: "Mobile Record",
  hrms: "HRMS Record",
};

export default function ClinicalRecordDetailPage({
  family,
}: {
  family: string;
}) {
  const params = useParams<{
    module: string;
    id: string;
  }>();
  const moduleKey = params?.module || "";
  const recordId = params?.id || "";
  const [payload, setPayload] =
    useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const response = await fetch(
        `/api/clinical/${family}/${moduleKey}`
      );

      if (response.ok) {
        setPayload(await response.json());
      }

      setLoading(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [family, moduleKey]);

  const row = useMemo(
    () =>
      (payload?.rows || []).find(
        (item) => String(item.id) === recordId
      ),
    [payload, recordId]
  );

  const moduleLabel =
    payload?.module?.label ||
    readable(moduleKey);
  const detailLabel =
    family === "hms" && moduleKey === "ip"
      ? "IP Admission 360"
      : familyLabels[family] || "Clinical Record";
  const title = row
    ? recordTitle(row, moduleLabel)
    : `${moduleLabel} #${recordId}`;
  const patientHref =
    row?.patient_id !== undefined &&
    row?.patient_id !== null
      ? `/clinical-services/patients/${row.patient_id}`
      : undefined;
  const baseHref = `/clinical-services/${family}/${moduleKey}`;

  return (
    <ClinicalShell>
      <div className="space-y-6 p-4">
        <Link
          href={baseHref}
          className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#04142E] shadow-sm transition hover:border-[#D4AF37] hover:bg-[#fff9e8]"
        >
          <ArrowLeft size={16} />
          Back to {moduleLabel}
        </Link>

        <section className="tt-clinical-dark-hero rounded-[8px] border border-[#D4AF37]/50 bg-[#04142E] p-7 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">
            {detailLabel}
          </p>
          <h1 className="mt-2 break-words text-4xl font-black">
            {loading ? "Loading record..." : title}
          </h1>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-100">
            Detail workspace with overview, patient context, operational
            history, audit, timeline, and edit routing for this record.
          </p>
        </section>

        {!loading && !row ? (
          <section className="rounded-[8px] border border-red-200 bg-white p-6 text-sm font-black text-red-700 shadow-sm">
            Record #{recordId} was not found in {moduleLabel}.
          </section>
        ) : null}

        {row ? (
          <>
            <section className="grid gap-3 md:grid-cols-4">
              <ActionLink
                href="#overview"
                icon={Activity}
                label="View Details"
              />
              <ActionLink
                href={`${baseHref}?record=${recordId}&mode=edit`}
                icon={Edit3}
                label="Edit"
              />
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
              {patientHref ? (
                <ActionLink
                  href={patientHref}
                  icon={UserRound}
                  label="Patient 360"
                />
              ) : null}
            </section>

            <section
              id="overview"
              className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
            >
              <Panel
                icon={Activity}
                title="Overview"
              >
                <FieldGrid row={row} />
              </Panel>
              <Panel
                icon={UserRound}
                title="Patient Details"
              >
                {patientHref ? (
                  <Link
                    href={patientHref}
                    className="inline-flex rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0B1F3A]"
                  >
                    Open Patient 360
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-slate-600">
                    This record is not linked to a patient.
                  </p>
                )}
                <FieldList
                  row={row}
                  keys={[
                    "patient_id",
                    "patient_name",
                    "patient_uid",
                    "admission_id",
                    "appointment_id",
                    "doctor_id",
                    "consultant_id",
                    "department_id",
                  ]}
                />
              </Panel>
            </section>

            {family === "hms" &&
            moduleKey === "icu" ? (
              <section className="grid gap-6 xl:grid-cols-2">
                <Panel
                  icon={HeartPulse}
                  title="Vitals"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "bp",
                      "pulse",
                      "temperature",
                      "oxygen",
                      "ecg",
                      "urine_output",
                      "alert_level",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Wind}
                  title="Ventilator"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "ventilator",
                      "oxygen",
                      "bed_id",
                      "recorded_at",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Pill}
                  title="Medication"
                >
                  <p className="text-sm font-semibold text-slate-600">
                    Medication links are available through the patient
                    timeline and pharmacy dispensing context.
                  </p>
                </Panel>
                <Panel
                  icon={Stethoscope}
                  title="Doctor Notes"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "doctor_notes",
                      "clinical_notes",
                      "observation",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ClipboardList}
                  title="Nursing Notes"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "nursing_notes",
                      "action_taken",
                      "observation",
                    ]}
                  />
                </Panel>
              </section>
            ) : null}

            {family === "hms" &&
            moduleKey === "ip" ? (
              <section className="grid gap-6 xl:grid-cols-2">
                <Panel
                  icon={Activity}
                  title="Admission Details"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "admission_number",
                      "admission_date",
                      "admission_reason",
                      "expected_discharge",
                      "status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={UserRound}
                  title="Patient Information"
                >
                  {patientHref ? (
                    <Link
                      href={patientHref}
                      className="mb-4 inline-flex rounded-[8px] bg-[#04142E] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0B1F3A]"
                    >
                      Open Patient 360
                    </Link>
                  ) : null}
                  <FieldList
                    row={row}
                    keys={[
                      "patient_id",
                      "patient_name",
                      "patient_uid",
                      "uhid",
                      "mobile",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Building2}
                  title="Ward Details"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "ward_id",
                      "ward_name",
                      "department_id",
                      "department_name",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Bed}
                  title="Bed Allocation"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "bed_id",
                      "bed_number",
                      "room_id",
                      "bed_status",
                      "cleaning_status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Stethoscope}
                  title="Treating Doctor"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "consultant_id",
                      "doctor_id",
                      "treating_doctor_id",
                      "doctor_name",
                      "department_id",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ClipboardList}
                  title="Diagnosis"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "diagnosis",
                      "admission_reason",
                      "chief_complaint",
                      "present_illness",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ClipboardCheck}
                  title="Orders"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "orders",
                      "doctor_orders",
                      "care_plan",
                      "procedure_orders",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Pill}
                  title="Medication"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "medication",
                      "medications",
                      "mar",
                      "pharmacy_order_id",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={HeartPulse}
                  title="Vitals"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "bp",
                      "pulse",
                      "temperature",
                      "oxygen",
                      "vitals",
                      "recorded_at",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ClipboardList}
                  title="Nursing Notes"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "nursing_notes",
                      "shift_notes",
                      "action_taken",
                      "care_plan",
                      "escalations",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Stethoscope}
                  title="Doctor Notes"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "doctor_notes",
                      "clinical_notes",
                      "progress_notes",
                      "observation",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={FlaskConical}
                  title="Lab Orders"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "lab_order_id",
                      "lab_orders",
                      "lab_status",
                      "sample_status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ScanLine}
                  title="Radiology Orders"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "radiology_order_id",
                      "radiology_orders",
                      "study_id",
                      "radiology_status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={CreditCard}
                  title="Billing"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "invoice_id",
                      "billing_invoice_id",
                      "billing_status",
                      "total",
                      "balance_amount",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ShieldCheck}
                  title="Insurance"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "claim_id",
                      "policy_id",
                      "preauth_id",
                      "insurance_status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={FileText}
                  title="Discharge Planning"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "expected_discharge",
                      "discharge_plan",
                      "discharge_status",
                      "discharge_summary",
                    ]}
                  />
                </Panel>
              </section>
            ) : null}

            {family === "hms" &&
            moduleKey === "beds" ? (
              <section className="grid gap-6 xl:grid-cols-2">
                <Panel
                  icon={Bed}
                  title="Bed Details"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "bed_number",
                      "bed_type",
                      "status",
                      "room_id",
                      "ward_id",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={UserRound}
                  title="Current Occupancy"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "patient_id",
                      "admission_id",
                      "allocation_id",
                      "occupancy_status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Building2}
                  title="Ward Information"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "ward_id",
                      "ward_name",
                      "ward_code",
                      "ward_type",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ClipboardCheck}
                  title="Cleaning Status"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "cleaning_status",
                      "last_cleaned_at",
                      "status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={History}
                  title="Transfer History"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "current_bed_id",
                      "target_bed_id",
                      "transfer_time",
                      "reason",
                    ]}
                  />
                </Panel>
              </section>
            ) : null}

            {family === "hms" &&
            moduleKey === "wards" ? (
              <section className="grid gap-6 xl:grid-cols-2">
                <Panel
                  icon={Building2}
                  title="Ward Details"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "ward_name",
                      "ward_code",
                      "ward_type",
                      "status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Bed}
                  title="Beds and Occupancy"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "bed_count",
                      "occupied_beds",
                      "available_beds",
                      "branch_id",
                    ]}
                  />
                </Panel>
              </section>
            ) : null}

            {family === "hms" &&
            moduleKey === "bed-allocations" ? (
              <section className="grid gap-6 xl:grid-cols-2">
                <Panel
                  icon={Bed}
                  title="Bed Allocation"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "admission_id",
                      "ward_id",
                      "room_id",
                      "bed_id",
                      "allocation_date",
                      "release_date",
                      "status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={History}
                  title="Transfer History"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "current_ward_id",
                      "target_ward_id",
                      "current_bed_id",
                      "target_bed_id",
                      "transfer_time",
                      "reason",
                    ]}
                  />
                </Panel>
              </section>
            ) : null}

            {family === "hms" &&
            moduleKey === "bed-transfers" ? (
              <section className="grid gap-6 xl:grid-cols-2">
                <Panel
                  icon={History}
                  title="Transfer History"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "admission_id",
                      "current_ward_id",
                      "target_ward_id",
                      "current_bed_id",
                      "target_bed_id",
                      "transfer_time",
                      "reason",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Bed}
                  title="Bed Details"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "current_bed_id",
                      "target_bed_id",
                      "status",
                    ]}
                  />
                </Panel>
              </section>
            ) : null}

            {family === "hms" &&
            [
              "nursing",
              "nursing-assessments",
              "medication-administrations",
            ].includes(moduleKey) ? (
              <section className="grid gap-6 xl:grid-cols-2">
                <Panel
                  icon={ClipboardList}
                  title="Nursing Assessment"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "pain_assessment",
                      "skin_assessment",
                      "fall_risk",
                      "pressure_ulcer_risk",
                      "assessed_at",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={HeartPulse}
                  title="Vitals"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "bp",
                      "pulse",
                      "temperature",
                      "oxygen",
                      "vitals",
                      "recorded_at",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={Pill}
                  title="Medication Administration Record (MAR)"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "medicine",
                      "dose",
                      "route",
                      "administered_time",
                      "administered_by",
                      "status",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ClipboardList}
                  title="Shift Notes"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "note_time",
                      "observation",
                      "action_taken",
                      "shift_notes",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ClipboardCheck}
                  title="Care Plan"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "care_plan",
                      "nursing_plan",
                      "follow_up",
                    ]}
                  />
                </Panel>
                <Panel
                  icon={ShieldCheck}
                  title="Escalations"
                >
                  <FieldList
                    row={row}
                    keys={[
                      "escalations",
                      "alert_level",
                      "incident_id",
                    ]}
                  />
                </Panel>
              </section>
            ) : null}

            <section className="grid gap-6 xl:grid-cols-2">
              <Panel
                icon={FileClock}
                title="Timeline"
                id="history"
              >
                <Timeline row={row} />
              </Panel>
              <Panel
                icon={ClipboardList}
                title="Audit"
                id="audit"
              >
                <FieldList
                  row={row}
                  keys={[
                    "created_by",
                    "created_at",
                    "updated_by",
                    "updated_at",
                    "status",
                    "alert_level",
                    "approval_status",
                    "collection_status",
                    "verification_status",
                  ]}
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
  icon: typeof Activity;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-[#04142E] shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-[#fff9e8] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/45"
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

function Panel({
  title,
  icon: Icon,
  id,
  children,
}: {
  title: string;
  icon: typeof Activity;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#fff4df] text-[#735300]">
          <Icon size={21} />
        </div>
        <h2 className="text-2xl font-black text-[#04142E]">
          {title}
        </h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function FieldGrid({ row }: { row: Row }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Object.entries(row)
        .filter(
          ([key]) =>
            ![
              "is_deleted",
              "tenant_id",
              "hospital_id",
              "branch_id",
              "clinic_id",
            ].includes(key)
        )
        .slice(0, 24)
        .map(([key, value]) => (
          <FieldCard
            key={key}
            label={key}
            value={value}
          />
        ))}
    </div>
  );
}

function FieldList({
  row,
  keys,
}: {
  row: Row;
  keys: string[];
}) {
  const available = keys.filter(
    (key) => row[key] !== undefined
  );

  if (!available.length) {
    return (
      <p className="rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
        No linked information recorded yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {available.map((key) => (
        <FieldCard
          key={key}
          label={key}
          value={row[key]}
        />
      ))}
    </div>
  );
}

function FieldCard({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.06em] text-slate-500">
        {readable(label)}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-[#04142E]">
        {formatValue(value)}
      </p>
    </div>
  );
}

function Timeline({ row }: { row: Row }) {
  const items = ([
    ["Created", row.created_at],
    ["Updated", row.updated_at],
    ["Record date", row.recorded_at || row.created_at],
  ] as [string, unknown][]).filter(
    (entry): entry is [string, unknown] =>
      Boolean(entry[1])
  );

  return (
    <div className="space-y-3">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-[8px] border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-xs font-black uppercase text-[#735300]">
            {label}
          </p>
          <p className="mt-1 text-sm font-bold text-[#04142E]">
            {formatValue(value)}
          </p>
        </div>
      ))}
    </div>
  );
}

function recordTitle(row: Row, fallback: string) {
  return String(
    row.patient_name ||
      row.visit_number ||
      row.er_number ||
      row.admission_number ||
      row.invoice_number ||
      row.claim_number ||
      row.procedure_name ||
      row.couple_number ||
      row.cycle_number ||
      row.medicine_code ||
      row.po_number ||
      row.grn_number ||
      row.journal_number ||
      row.account_name ||
      row.title ||
      row.name ||
      `${fallback} #${row.id}`
  );
}

function readable(value: string) {
  return value
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
