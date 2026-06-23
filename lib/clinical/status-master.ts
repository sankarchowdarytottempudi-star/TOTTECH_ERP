export type ClinicalStatusOption = {
  id: number;
  module: string;
  status_code: string;
  status_label: string;
  display_order: number;
  color: string | null;
  is_active: boolean;
};

const statusFields = new Set([
  "status",
  "record_status",
  "workflow_status",
  "appointment_status",
  "cycle_status",
  "lab_status",
  "billing_status",
  "payment_status",
  "patient_status",
  "admission_status",
  "discharge_status",
  "consultation_status",
  "ivf_status",
  "embryo_status",
  "pregnancy_status",
  "current_status",
  "availability_status",
  "approval_status",
  "collection_status",
  "verification_status",
  "inventory_status",
  "dispense_status",
  "queue_status",
]);

export function isControlledStatusField(column: string) {
  return statusFields.has(column);
}

export function statusLabel(code: string) {
  return code
    .split("_")
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
    )
    .join(" ");
}

export function statusOptionsToSelect(
  options: ClinicalStatusOption[],
  currentValue?: string
) {
  const mapped = options.map((option) => ({
    value: option.status_code,
    label:
      option.status_label ||
      statusLabel(option.status_code),
  }));

  if (
    currentValue &&
    !mapped.some((option) => option.value === currentValue)
  ) {
    return [
      {
        value: currentValue,
        label: `${statusLabel(currentValue)} (legacy)`,
      },
      ...mapped,
    ];
  }

  return mapped;
}

export function getIvfStatusModule(moduleKey: string) {
  const map: Record<string, string> = {
    couples: "ivf_couples",
    "female-assessment": "ivf_assessment",
    "male-assessment": "ivf_assessment",
    "treatment-plans": "ivf_cycles",
    cycles: "ivf_cycles",
    stimulation: "ivf_stimulation",
    retrievals: "ivf_retrievals",
    embryology: "ivf_embryology",
    embryos: "ivf_embryology",
    cryo: "ivf_cryo",
    transfers: "ivf_transfers",
    pregnancies: "ivf_pregnancy",
    donors: "ivf_donors",
    surrogacy: "ivf_surrogacy",
    billing: "billing",
    referrals: "ivf_donors",
  };

  return map[moduleKey] || "ivf_cycles";
}

export function getHmsStatusModule(moduleKey: string) {
  const map: Record<string, string> = {
    op: "consultations",
    er: "appointments",
    ip: "ip",
    icu: "icu",
    ot: "ot",
    billing: "billing",
    insurance: "billing",
  };

  return map[moduleKey] || "appointments";
}

export function getFinanceStatusModule(moduleKey: string) {
  if (
    moduleKey.includes("payment") ||
    moduleKey === "cash" ||
    moduleKey === "payouts"
  ) {
    return "payments";
  }

  return "billing";
}

export function getPharmacyStatusModule() {
  return "pharmacy";
}
