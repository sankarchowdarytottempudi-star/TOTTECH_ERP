export type HmsModuleKey =
  | "op"
  | "er"
  | "ip"
  | "wards"
  | "beds"
  | "bed-allocations"
  | "bed-transfers"
  | "discharges"
  | "icu"
  | "ot"
  | "nursing"
  | "nursing-assessments"
  | "medication-administrations"
  | "billing"
  | "insurance";

export type HmsModuleConfig = {
  key: HmsModuleKey;
  label: string;
  table: string;
  idPrefix: string;
  uidColumn?: string;
  patientColumn?: string;
  dateColumn: string;
  statusColumn?: string;
  createColumns: string[];
  numericColumns?: string[];
  booleanColumns?: string[];
  dateColumns?: string[];
};

export const hmsModules: Record<
  HmsModuleKey,
  HmsModuleConfig
> = {
  op: {
    key: "op",
    label: "OP Management",
    table: "op_visits",
    idPrefix: "OPV",
    uidColumn: "visit_number",
    patientColumn: "patient_id",
    dateColumn: "visit_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "doctor_id",
      "department_id",
      "appointment_id",
      "chief_complaint",
      "present_illness",
      "past_medical_history",
      "past_surgical_history",
      "family_history",
      "social_history",
      "lifestyle_history",
      "drug_allergies",
      "food_allergies",
      "environmental_allergies",
      "follow_up_date",
      "follow_up_notes",
      "status",
    ],
    numericColumns: [
      "patient_id",
      "doctor_id",
      "department_id",
      "appointment_id",
    ],
    dateColumns: ["follow_up_date"],
  },
  er: {
    key: "er",
    label: "Emergency Room",
    table: "er_visits",
    idPrefix: "ER",
    uidColumn: "er_number",
    patientColumn: "patient_id",
    dateColumn: "arrival_time",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "arrival_mode",
      "triage_level",
      "status",
    ],
    numericColumns: ["patient_id"],
  },
  ip: {
    key: "ip",
    label: "IP Admission",
    table: "ip_admissions",
    idPrefix: "IP",
    uidColumn: "admission_number",
    patientColumn: "patient_id",
    dateColumn: "admission_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "consultant_id",
      "department_id",
      "admission_reason",
      "diagnosis",
      "expected_discharge",
      "status",
    ],
    numericColumns: [
      "patient_id",
      "consultant_id",
      "department_id",
    ],
    dateColumns: ["expected_discharge"],
  },
  wards: {
    key: "wards",
    label: "Ward Management",
    table: "hms_wards",
    idPrefix: "WARD",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "ward_name",
      "ward_code",
      "ward_type",
      "status",
    ],
  },
  beds: {
    key: "beds",
    label: "Bed Management",
    table: "hms_beds",
    idPrefix: "BED",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "ward_id",
      "room_id",
      "bed_number",
      "bed_type",
      "status",
    ],
    numericColumns: ["ward_id", "room_id"],
  },
  "bed-allocations": {
    key: "bed-allocations",
    label: "Bed Allocations",
    table: "bed_allocations",
    idPrefix: "BAL",
    patientColumn: undefined,
    dateColumn: "allocation_date",
    statusColumn: "status",
    createColumns: [
      "admission_id",
      "ward_id",
      "room_id",
      "bed_id",
      "allocation_date",
      "release_date",
      "status",
    ],
    numericColumns: [
      "admission_id",
      "ward_id",
      "room_id",
      "bed_id",
    ],
    dateColumns: [
      "allocation_date",
      "release_date",
    ],
  },
  "bed-transfers": {
    key: "bed-transfers",
    label: "Bed Transfers",
    table: "bed_transfers",
    idPrefix: "BTR",
    patientColumn: undefined,
    dateColumn: "transfer_time",
    createColumns: [
      "admission_id",
      "current_ward_id",
      "target_ward_id",
      "current_bed_id",
      "target_bed_id",
      "reason",
      "transfer_time",
    ],
    numericColumns: [
      "admission_id",
      "current_ward_id",
      "target_ward_id",
      "current_bed_id",
      "target_bed_id",
    ],
    dateColumns: ["transfer_time"],
  },
  discharges: {
    key: "discharges",
    label: "Discharge Planning",
    table: "discharge_summaries",
    idPrefix: "DSC",
    patientColumn: undefined,
    dateColumn: "discharge_date",
    createColumns: [
      "admission_id",
      "discharge_date",
      "discharge_summary",
      "final_diagnosis",
      "follow_up",
      "discharge_medications",
    ],
    numericColumns: ["admission_id"],
    dateColumns: ["discharge_date"],
  },
  icu: {
    key: "icu",
    label: "ICU Management",
    table: "icu_monitoring_records",
    idPrefix: "ICU",
    patientColumn: "patient_id",
    dateColumn: "recorded_at",
    statusColumn: "alert_level",
    createColumns: [
      "patient_id",
      "admission_id",
      "bed_id",
      "ventilator",
      "oxygen",
      "ecg",
      "bp",
      "pulse",
      "temperature",
      "urine_output",
      "alert_level",
    ],
    numericColumns: [
      "patient_id",
      "admission_id",
      "bed_id",
    ],
    booleanColumns: ["ventilator"],
  },
  ot: {
    key: "ot",
    label: "Operation Theatre",
    table: "ot_schedules",
    idPrefix: "OT",
    patientColumn: "patient_id",
    dateColumn: "scheduled_date",
    statusColumn: "status",
    createColumns: [
      "procedure_name",
      "patient_id",
      "surgeon_id",
      "anesthetist_id",
      "ot_room_id",
      "scheduled_date",
      "scheduled_time",
      "duration_minutes",
      "status",
    ],
    numericColumns: [
      "patient_id",
      "surgeon_id",
      "anesthetist_id",
      "ot_room_id",
      "duration_minutes",
    ],
    dateColumns: ["scheduled_date"],
  },
  nursing: {
    key: "nursing",
    label: "Nursing",
    table: "nursing_notes",
    idPrefix: "NUR",
    patientColumn: "patient_id",
    dateColumn: "note_time",
    createColumns: [
      "patient_id",
      "admission_id",
      "observation",
      "action_taken",
    ],
    numericColumns: [
      "patient_id",
      "admission_id",
    ],
  },
  "nursing-assessments": {
    key: "nursing-assessments",
    label: "Nursing Assessments",
    table: "nursing_assessments",
    idPrefix: "NAS",
    patientColumn: "patient_id",
    dateColumn: "assessed_at",
    createColumns: [
      "patient_id",
      "admission_id",
      "pain_assessment",
      "skin_assessment",
      "fall_risk",
      "pressure_ulcer_risk",
      "assessed_at",
    ],
    numericColumns: [
      "patient_id",
      "admission_id",
    ],
    dateColumns: ["assessed_at"],
  },
  "medication-administrations": {
    key: "medication-administrations",
    label: "Medication Administration",
    table: "medication_administrations",
    idPrefix: "MAR",
    patientColumn: "patient_id",
    dateColumn: "administered_time",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "admission_id",
      "medicine",
      "dose",
      "route",
      "administered_time",
      "administered_by",
      "status",
    ],
    numericColumns: [
      "patient_id",
      "admission_id",
      "administered_by",
    ],
    dateColumns: ["administered_time"],
  },
  billing: {
    key: "billing",
    label: "Billing",
    table: "billing_invoices",
    idPrefix: "INV",
    uidColumn: "invoice_number",
    patientColumn: "patient_id",
    dateColumn: "invoice_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "department_id",
      "subtotal",
      "discount",
      "tax",
      "total",
      "paid_amount",
      "balance_amount",
      "status",
    ],
    numericColumns: [
      "patient_id",
      "department_id",
      "subtotal",
      "discount",
      "tax",
      "total",
      "paid_amount",
      "balance_amount",
    ],
  },
  insurance: {
    key: "insurance",
    label: "Insurance",
    table: "insurance_claims",
    idPrefix: "CLM",
    uidColumn: "claim_number",
    patientColumn: "patient_id",
    dateColumn: "submission_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "policy_id",
      "invoice_id",
      "submission_date",
      "claimed_amount",
      "approved_amount",
      "rejected_amount",
      "status",
    ],
    numericColumns: [
      "patient_id",
      "policy_id",
      "invoice_id",
      "claimed_amount",
      "approved_amount",
      "rejected_amount",
    ],
    dateColumns: ["submission_date"],
  },
};

export function getHmsModuleConfig(
  moduleKey: string
) {
  return hmsModules[
    moduleKey as HmsModuleKey
  ];
}

export function normalizeHmsValue(
  config: HmsModuleConfig,
  column: string,
  value: unknown
) {
  if (value === undefined || value === "") {
    return null;
  }

  if (
    config.numericColumns?.includes(column)
  ) {
    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  if (
    config.booleanColumns?.includes(column)
  ) {
    return Boolean(value);
  }

  if (config.dateColumns?.includes(column)) {
    return String(value);
  }

  return String(value).trim();
}
