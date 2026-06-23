export type IvfModuleKey =
  | "couples"
  | "female-assessment"
  | "male-assessment"
  | "treatment-plans"
  | "cycles"
  | "stimulation"
  | "retrievals"
  | "embryology"
  | "embryos"
  | "cryo"
  | "transfers"
  | "pregnancies"
  | "donors"
  | "surrogacy"
  | "billing"
  | "referrals"
  | "ai";

export type IvfModuleConfig = {
  key: IvfModuleKey;
  label: string;
  table: string;
  idPrefix: string;
  uidColumn?: string;
  coupleColumn?: string;
  patientColumn?: string;
  dateColumn: string;
  statusColumn?: string;
  createColumns: string[];
  numericColumns?: string[];
  booleanColumns?: string[];
  dateColumns?: string[];
  textAreaColumns?: string[];
};

const commonCoupleColumns = [
  "couple_id",
  "cycle_id",
];

export const ivfModules: Record<
  IvfModuleKey,
  IvfModuleConfig
> = {
  couples: {
    key: "couples",
    label: "Couple Registration",
    table: "ivf_couples",
    idPrefix: "CPL",
    uidColumn: "couple_number",
    coupleColumn: "id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "female_patient_id",
      "male_patient_id",
      "marriage_date",
      "infertility_duration_months",
      "primary_infertility",
      "secondary_infertility",
      "female_name",
      "female_age",
      "female_height",
      "female_weight",
      "female_bmi",
      "female_blood_group",
      "female_occupation",
      "male_name",
      "male_age",
      "male_height",
      "male_weight",
      "male_bmi",
      "male_blood_group",
      "referral_doctor",
      "referral_hospital",
      "referral_agent",
      "campaign_source",
      "commission_plan",
      "status",
    ],
    numericColumns: [
      "female_patient_id",
      "male_patient_id",
      "infertility_duration_months",
      "female_age",
      "female_height",
      "female_weight",
      "female_bmi",
      "male_age",
      "male_height",
      "male_weight",
      "male_bmi",
    ],
    booleanColumns: [
      "primary_infertility",
      "secondary_infertility",
    ],
    dateColumns: ["marriage_date"],
  },
  "female-assessment": {
    key: "female-assessment",
    label: "Female Fertility Assessment",
    table: "ivf_female_assessments",
    idPrefix: "FEMA",
    coupleColumn: "couple_id",
    patientColumn: "patient_id",
    dateColumn: "assessment_date",
    statusColumn: "status",
    createColumns: [
      "couple_id",
      "patient_id",
      "assessment_date",
      "menarche_age",
      "cycle_length",
      "cycle_regularity",
      "lmp",
      "previous_pregnancies",
      "previous_ivf_cycles",
      "previous_miscarriages",
      "previous_abortions",
      "previous_ectopic_pregnancy",
      "amh",
      "fsh",
      "lh",
      "estradiol",
      "progesterone",
      "tsh",
      "prolactin",
      "vitamin_d",
      "hba1c",
      "right_ovary_afc",
      "left_ovary_afc",
      "endometrial_thickness",
      "fibroids",
      "polyps",
      "ovarian_cysts",
      "pcos_findings",
      "hsg_result",
      "laparoscopy_result",
      "tubal_patency",
      "hydrosalpinx",
      "clinical_summary",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "patient_id",
      "menarche_age",
      "cycle_length",
      "previous_pregnancies",
      "previous_ivf_cycles",
      "previous_miscarriages",
      "previous_abortions",
      "previous_ectopic_pregnancy",
      "amh",
      "fsh",
      "lh",
      "estradiol",
      "progesterone",
      "tsh",
      "prolactin",
      "vitamin_d",
      "hba1c",
      "right_ovary_afc",
      "left_ovary_afc",
      "endometrial_thickness",
    ],
    dateColumns: [
      "assessment_date",
      "lmp",
    ],
    textAreaColumns: [
      "fibroids",
      "polyps",
      "ovarian_cysts",
      "pcos_findings",
      "hsg_result",
      "laparoscopy_result",
      "hydrosalpinx",
      "clinical_summary",
    ],
  },
  "male-assessment": {
    key: "male-assessment",
    label: "Male Fertility Assessment",
    table: "ivf_male_assessments",
    idPrefix: "MALE",
    coupleColumn: "couple_id",
    patientColumn: "patient_id",
    dateColumn: "assessment_date",
    statusColumn: "status",
    createColumns: [
      "couple_id",
      "patient_id",
      "assessment_date",
      "volume",
      "liquefaction_time",
      "sperm_count",
      "motility",
      "progressive_motility",
      "morphology",
      "vitality",
      "ph",
      "viscosity",
      "dna_fragmentation",
      "oxidative_stress",
      "mar_test",
      "testosterone",
      "fsh",
      "lh",
      "prolactin",
      "clinical_summary",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "patient_id",
      "volume",
      "liquefaction_time",
      "sperm_count",
      "motility",
      "progressive_motility",
      "morphology",
      "vitality",
      "ph",
      "dna_fragmentation",
      "testosterone",
      "fsh",
      "lh",
      "prolactin",
    ],
    dateColumns: ["assessment_date"],
    textAreaColumns: [
      "clinical_summary",
    ],
  },
  "treatment-plans": {
    key: "treatment-plans",
    label: "Treatment Planning",
    table: "ivf_treatment_plans",
    idPrefix: "TPL",
    uidColumn: "plan_number",
    coupleColumn: "couple_id",
    dateColumn: "planned_start_date",
    statusColumn: "status",
    createColumns: [
      "couple_id",
      "treatment_type",
      "protocol_type",
      "doctor_id",
      "department_id",
      "planned_start_date",
      "planned_end_date",
      "clinical_indication",
      "donor_required",
      "surrogate_required",
      "insurance_required",
      "package_id",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "doctor_id",
      "department_id",
      "package_id",
    ],
    booleanColumns: [
      "donor_required",
      "surrogate_required",
      "insurance_required",
    ],
    dateColumns: [
      "planned_start_date",
      "planned_end_date",
    ],
    textAreaColumns: [
      "clinical_indication",
    ],
  },
  cycles: {
    key: "cycles",
    label: "IVF Cycles",
    table: "ivf_cycles",
    idPrefix: "CYC",
    uidColumn: "cycle_number",
    coupleColumn: "couple_id",
    dateColumn: "start_date",
    statusColumn: "status",
    createColumns: [
      "couple_id",
      "treatment_plan_id",
      "cycle_type",
      "protocol_type",
      "start_date",
      "expected_retrieval_date",
      "expected_transfer_date",
      "doctor_id",
      "embryologist_id",
      "status",
      "outcome",
      "outcome_date",
      "workflow_stage",
      "priority",
      "notes",
    ],
    numericColumns: [
      "couple_id",
      "treatment_plan_id",
      "doctor_id",
      "embryologist_id",
    ],
    dateColumns: [
      "start_date",
      "expected_retrieval_date",
      "expected_transfer_date",
      "outcome_date",
    ],
    textAreaColumns: ["notes"],
  },
  stimulation: {
    key: "stimulation",
    label: "Stimulation Management",
    table: "ivf_stimulation_records",
    idPrefix: "STM",
    coupleColumn: "couple_id",
    dateColumn: "monitoring_date",
    statusColumn: "status",
    createColumns: [
      ...commonCoupleColumns,
      "cycle_day",
      "monitoring_date",
      "doctor_id",
      "medication",
      "dose",
      "duration",
      "notes",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "cycle_id",
      "cycle_day",
      "doctor_id",
    ],
    dateColumns: ["monitoring_date"],
    textAreaColumns: ["notes"],
  },
  retrievals: {
    key: "retrievals",
    label: "Egg Retrieval",
    table: "ivf_retrievals",
    idPrefix: "RET",
    uidColumn: "retrieval_number",
    coupleColumn: "couple_id",
    dateColumn: "retrieval_date",
    statusColumn: "status",
    createColumns: [
      ...commonCoupleColumns,
      "retrieval_date",
      "doctor_id",
      "anesthetist_id",
      "procedure_duration_minutes",
      "follicles_aspirated",
      "oocytes_retrieved",
      "mii",
      "mi",
      "gv",
      "degenerated",
      "bleeding",
      "pain",
      "ohss_risk",
      "hospital_admission",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "cycle_id",
      "doctor_id",
      "anesthetist_id",
      "procedure_duration_minutes",
      "follicles_aspirated",
      "oocytes_retrieved",
      "mii",
      "mi",
      "gv",
      "degenerated",
    ],
    booleanColumns: [
      "hospital_admission",
    ],
    dateColumns: ["retrieval_date"],
    textAreaColumns: [
      "bleeding",
      "pain",
    ],
  },
  embryology: {
    key: "embryology",
    label: "Embryology Lab",
    table: "ivf_fertilization_records",
    idPrefix: "FER",
    uidColumn: "fertilization_number",
    coupleColumn: "couple_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      ...commonCoupleColumns,
      "patient_id",
      "embryo_record_id",
      "retrieval_id",
      "doctor_id",
      "method",
      "oocytes_inseminated",
      "two_pn",
      "one_pn",
      "three_pn",
      "failed_fertilization",
      "embryologist_id",
      "notes",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "cycle_id",
      "patient_id",
      "embryo_record_id",
      "retrieval_id",
      "doctor_id",
      "oocytes_inseminated",
      "two_pn",
      "one_pn",
      "three_pn",
      "failed_fertilization",
      "embryologist_id",
    ],
    textAreaColumns: ["notes"],
  },
  embryos: {
    key: "embryos",
    label: "Embryo Management",
    table: "ivf_embryos",
    idPrefix: "EMB",
    uidColumn: "embryo_id",
    coupleColumn: "couple_id",
    dateColumn: "creation_date",
    statusColumn: "current_status",
    createColumns: [
      ...commonCoupleColumns,
      "creation_date",
      "current_status",
      "fertilization_method",
      "day3_grade",
      "day5_grade",
      "pgt_status",
      "storage_location_id",
      "notes",
    ],
    numericColumns: [
      "couple_id",
      "cycle_id",
      "storage_location_id",
    ],
    dateColumns: ["creation_date"],
    textAreaColumns: ["notes"],
  },
  cryo: {
    key: "cryo",
    label: "Cryopreservation",
    table: "ivf_freezing_records",
    idPrefix: "CRYO",
    uidColumn: "cryo_number",
    coupleColumn: "couple_id",
    dateColumn: "freezing_date",
    statusColumn: "status",
    createColumns: [
      "embryo_id",
      ...commonCoupleColumns,
      "freezing_date",
      "method",
      "tank_number",
      "canister",
      "straw_number",
      "location_code",
      "status",
    ],
    numericColumns: [
      "embryo_id",
      "couple_id",
      "cycle_id",
    ],
    dateColumns: ["freezing_date"],
  },
  transfers: {
    key: "transfers",
    label: "Embryo Transfer",
    table: "ivf_embryo_transfers",
    idPrefix: "TRF",
    uidColumn: "transfer_number",
    coupleColumn: "couple_id",
    dateColumn: "transfer_date",
    statusColumn: "status",
    createColumns: [
      ...commonCoupleColumns,
      "transfer_date",
      "doctor_id",
      "embryologist_id",
      "transfer_type",
      "embryo_count",
      "embryo_grade",
      "embryo_age_days",
      "catheter_type",
      "difficulty",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "cycle_id",
      "doctor_id",
      "embryologist_id",
      "embryo_count",
      "embryo_age_days",
    ],
    dateColumns: ["transfer_date"],
  },
  pregnancies: {
    key: "pregnancies",
    label: "Pregnancy Tracking",
    table: "ivf_pregnancies",
    idPrefix: "PRG",
    coupleColumn: "couple_id",
    dateColumn: "beta_hcg_date",
    statusColumn: "status",
    createColumns: [
      ...commonCoupleColumns,
      "transfer_id",
      "beta_hcg_date",
      "beta_hcg_result",
      "beta_hcg_status",
      "ultrasound_date",
      "gestational_sac",
      "yolk_sac",
      "heartbeat",
      "crl",
      "pregnancy_outcome",
      "outcome_date",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "cycle_id",
      "transfer_id",
      "beta_hcg_result",
      "crl",
    ],
    booleanColumns: [
      "gestational_sac",
      "yolk_sac",
      "heartbeat",
    ],
    dateColumns: [
      "beta_hcg_date",
      "ultrasound_date",
      "outcome_date",
    ],
  },
  donors: {
    key: "donors",
    label: "Donor Management",
    table: "ivf_donors",
    idPrefix: "DNR",
    uidColumn: "donor_number",
    dateColumn: "created_at",
    statusColumn: "availability_status",
    createColumns: [
      "donor_type",
      "age",
      "blood_group",
      "education",
      "medical_history",
      "genetic_screening",
      "availability_status",
    ],
    numericColumns: ["age"],
    textAreaColumns: [
      "medical_history",
      "genetic_screening",
    ],
  },
  surrogacy: {
    key: "surrogacy",
    label: "Surrogacy",
    table: "ivf_surrogates",
    idPrefix: "SUR",
    uidColumn: "surrogate_number",
    dateColumn: "created_at",
    statusColumn: "availability_status",
    createColumns: [
      "age",
      "previous_pregnancies",
      "medical_history",
      "legal_clearance",
      "availability_status",
    ],
    numericColumns: [
      "age",
      "previous_pregnancies",
    ],
    booleanColumns: ["legal_clearance"],
    textAreaColumns: [
      "medical_history",
    ],
  },
  billing: {
    key: "billing",
    label: "IVF Billing",
    table: "ivf_billing",
    idPrefix: "IVFINV",
    uidColumn: "invoice_number",
    coupleColumn: "couple_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      ...commonCoupleColumns,
      "package_id",
      "additional_procedures",
      "discounts",
      "taxes",
      "total",
      "paid_amount",
      "balance_amount",
      "status",
    ],
    numericColumns: [
      "couple_id",
      "cycle_id",
      "package_id",
      "additional_procedures",
      "discounts",
      "taxes",
      "total",
      "paid_amount",
      "balance_amount",
    ],
  },
  referrals: {
    key: "referrals",
    label: "IVF Referral Management",
    table: "ivf_referrals",
    idPrefix: "REF",
    coupleColumn: "couple_id",
    dateColumn: "created_at",
    statusColumn: "approval_status",
    createColumns: [
      "couple_id",
      "referral_source",
      "referral_doctor",
      "referral_hospital",
      "referral_agent",
      "campaign",
      "commission_type",
      "percentage",
      "fixed_amount",
      "approval_status",
      "payment_status",
    ],
    numericColumns: [
      "couple_id",
      "percentage",
      "fixed_amount",
    ],
  },
  ai: {
    key: "ai",
    label: "TOTTECH IVF AI",
    table: "ivf_ai_summaries",
    idPrefix: "IVFAI",
    coupleColumn: "couple_id",
    dateColumn: "created_at",
    statusColumn:
      "clinical_review_required",
    createColumns: [
      ...commonCoupleColumns,
      "summary_type",
      "prompt",
      "answer",
      "confidence",
      "clinical_review_required",
    ],
    numericColumns: [
      "couple_id",
      "cycle_id",
      "confidence",
    ],
    booleanColumns: [
      "clinical_review_required",
    ],
    textAreaColumns: [
      "prompt",
      "answer",
    ],
  },
};

export function getIvfModuleConfig(
  moduleKey: string
) {
  return ivfModules[
    moduleKey as IvfModuleKey
  ];
}

export function normalizeIvfValue(
  config: IvfModuleConfig,
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
    return (
      value === true ||
      value === "true" ||
      value === "1" ||
      value === "on"
    );
  }

  if (config.dateColumns?.includes(column)) {
    return String(value);
  }

  return String(value).trim();
}

export const ivfDashboardModules =
  Object.values(ivfModules);
