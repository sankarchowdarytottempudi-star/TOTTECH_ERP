export type FinanceModuleKey =
  | "coa"
  | "gl"
  | "cost-centers"
  | "profit-centers"
  | "ar"
  | "ap"
  | "cash"
  | "banks"
  | "gst"
  | "tds"
  | "assets"
  | "budgets"
  | "revenue-cycle"
  | "insurance-companies"
  | "tpa"
  | "preauth"
  | "claims"
  | "claim-documents"
  | "corporates"
  | "corporate-patients"
  | "referrals"
  | "commission-rules"
  | "commission-calculations"
  | "doctor-incentives"
  | "payouts"
  | "ai-finance";

export type FinanceModuleConfig = {
  key: FinanceModuleKey;
  label: string;
  table: string;
  idPrefix: string;
  uidColumn?: string;
  patientColumn?: string;
  doctorColumn?: string;
  accountColumn?: string;
  dateColumn: string;
  statusColumn?: string;
  createColumns: string[];
  requiredColumns?: string[];
  numericColumns?: string[];
  booleanColumns?: string[];
  dateColumns?: string[];
  textAreaColumns?: string[];
  jsonColumns?: string[];
};

const commonMoneyColumns = [
  "amount",
  "budget",
  "revenue_target",
  "total_debit",
  "total_credit",
  "debit",
  "credit",
  "gross_amount",
  "discount_amount",
  "tax_amount",
  "paid_amount",
  "outstanding_amount",
  "opening_balance",
  "current_balance",
  "closing_balance",
  "book_balance",
  "variance",
  "taxable_amount",
  "cgst_amount",
  "sgst_amount",
  "igst_amount",
  "rate",
  "deducted_amount",
  "purchase_cost",
  "depreciation_rate",
  "useful_life_months",
  "current_value",
  "depreciation_amount",
  "accumulated_depreciation",
  "closing_value",
  "budget_amount",
  "actual_amount",
  "cost_amount",
  "margin_amount",
  "requested_amount",
  "approved_amount",
  "rejected_amount",
  "claim_amount",
  "settled_amount",
  "credit_limit",
  "fixed_amount",
  "percentage",
  "revenue_generated",
  "revenue_amount",
  "commission_percentage",
  "commission_amount",
  "tax_deduction",
  "net_payable",
  "revenue_threshold",
  "incentive_percentage",
  "incentive_amount",
  "predicted_revenue",
  "predicted_claim_delay_days",
  "claim_approval_probability",
  "referral_impact",
  "confidence_score",
  "settlement_period_days",
];

const commonIdColumns = [
  "parent_account_id",
  "account_id",
  "journal_id",
  "cost_center_id",
  "profit_center_id",
  "department_id",
  "patient_id",
  "doctor_id",
  "insurance_company_id",
  "corporate_id",
  "vendor_id",
  "bank_id",
  "category_id",
  "asset_id",
  "tpa_id",
  "preauth_id",
  "claim_id",
  "uploaded_by",
  "referral_id",
  "rule_id",
  "approved_by",
  "commission_calculation_id",
];

const numericColumns = [
  ...commonIdColumns,
  ...commonMoneyColumns,
];

const dateColumns = [
  "journal_date",
  "invoice_date",
  "due_date",
  "transaction_date",
  "statement_date",
  "deduction_date",
  "purchase_date",
  "period_start",
  "period_end",
  "revenue_date",
  "agreement_date",
  "submitted_date",
  "approval_date",
  "settlement_date",
  "agreement_start",
  "agreement_end",
  "payment_date",
];

export const financeModules: Record<
  FinanceModuleKey,
  FinanceModuleConfig
> = {
  coa: {
    key: "coa",
    label: "Chart of Accounts",
    table: "clinical_finance_accounts",
    idPrefix: "ACC",
    uidColumn: "account_code",
    accountColumn: "id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "account_name",
      "account_type",
      "parent_account_id",
      "cost_center_id",
      "profit_center_id",
      "is_system_account",
      "status",
    ],
    requiredColumns: ["account_name", "account_type"],
    numericColumns,
    booleanColumns: ["is_system_account"],
  },
  gl: {
    key: "gl",
    label: "General Ledger",
    table:
      "clinical_finance_journal_entries",
    idPrefix: "JE",
    uidColumn: "journal_number",
    dateColumn: "journal_date",
    statusColumn: "status",
    createColumns: [
      "journal_date",
      "reference",
      "description",
      "total_debit",
      "total_credit",
      "status",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: ["description"],
  },
  "cost-centers": {
    key: "cost-centers",
    label: "Cost Centers",
    table:
      "clinical_finance_cost_centers",
    idPrefix: "CC",
    uidColumn: "cost_center_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "cost_center_name",
      "department_id",
      "manager_id",
      "budget",
      "status",
    ],
    requiredColumns: ["cost_center_name"],
    numericColumns: [
      ...numericColumns,
      "manager_id",
    ],
  },
  "profit-centers": {
    key: "profit-centers",
    label: "Profit Centers",
    table:
      "clinical_finance_profit_centers",
    idPrefix: "PC",
    uidColumn: "profit_center_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "profit_center_name",
      "department_id",
      "revenue_target",
      "status",
    ],
    requiredColumns: ["profit_center_name"],
    numericColumns,
  },
  ar: {
    key: "ar",
    label: "Accounts Receivable",
    table: "clinical_finance_ar_invoices",
    idPrefix: "AR",
    uidColumn: "invoice_number",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "invoice_date",
    statusColumn: "status",
    createColumns: [
      "customer_type",
      "patient_id",
      "insurance_company_id",
      "corporate_id",
      "doctor_id",
      "department_id",
      "invoice_date",
      "due_date",
      "gross_amount",
      "discount_amount",
      "tax_amount",
      "paid_amount",
      "outstanding_amount",
      "collection_status",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  ap: {
    key: "ap",
    label: "Accounts Payable",
    table:
      "clinical_finance_ap_vendor_invoices",
    idPrefix: "AP",
    uidColumn: "invoice_number",
    dateColumn: "invoice_date",
    statusColumn: "status",
    createColumns: [
      "vendor_id",
      "vendor_name",
      "invoice_date",
      "due_date",
      "amount",
      "paid_amount",
      "outstanding_amount",
      "aging_bucket",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  cash: {
    key: "cash",
    label: "Cash Management",
    table:
      "clinical_finance_cash_transactions",
    idPrefix: "CASH",
    uidColumn: "transaction_number",
    dateColumn: "transaction_date",
    statusColumn: "status",
    createColumns: [
      "transaction_date",
      "transaction_type",
      "amount",
      "reference",
      "remarks",
      "status",
    ],
    requiredColumns: [
      "transaction_type",
      "amount",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: ["remarks"],
  },
  banks: {
    key: "banks",
    label: "Bank Management",
    table: "clinical_finance_banks",
    idPrefix: "BANK",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "bank_name",
      "account_number",
      "ifsc",
      "branch",
      "account_type",
      "opening_balance",
      "current_balance",
      "status",
    ],
    requiredColumns: [
      "bank_name",
      "account_number",
    ],
    numericColumns,
  },
  gst: {
    key: "gst",
    label: "GST Management",
    table:
      "clinical_finance_gst_configurations",
    idPrefix: "GST",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "gstin",
      "state_code",
      "tax_type",
      "cgst_rate",
      "sgst_rate",
      "igst_rate",
      "status",
    ],
    requiredColumns: ["gstin"],
    numericColumns: [
      ...numericColumns,
      "cgst_rate",
      "sgst_rate",
      "igst_rate",
    ],
  },
  tds: {
    key: "tds",
    label: "TDS Management",
    table:
      "clinical_finance_tds_deductions",
    idPrefix: "TDS",
    dateColumn: "deduction_date",
    statusColumn: "status",
    createColumns: [
      "category_id",
      "pan",
      "payee_type",
      "payee_name",
      "amount",
      "deducted_amount",
      "deduction_date",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  assets: {
    key: "assets",
    label: "Fixed Assets",
    table: "clinical_finance_assets",
    idPrefix: "AST",
    uidColumn: "asset_number",
    dateColumn: "purchase_date",
    statusColumn: "status",
    createColumns: [
      "asset_name",
      "category",
      "purchase_date",
      "purchase_cost",
      "location",
      "department_id",
      "depreciation_method",
      "depreciation_rate",
      "useful_life_months",
      "current_value",
      "status",
    ],
    requiredColumns: ["asset_name"],
    numericColumns,
    dateColumns,
    textAreaColumns: ["location"],
  },
  budgets: {
    key: "budgets",
    label: "Budgeting",
    table: "clinical_finance_budgets",
    idPrefix: "BUD",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "financial_year",
      "department_id",
      "budget_type",
      "budget_amount",
      "actual_amount",
      "variance",
      "status",
    ],
    requiredColumns: ["financial_year"],
    numericColumns,
  },
  "revenue-cycle": {
    key: "revenue-cycle",
    label: "Revenue Cycle",
    table:
      "clinical_finance_revenue_records",
    idPrefix: "REV",
    uidColumn: "revenue_number",
    patientColumn: "patient_id",
    doctorColumn: "doctor_id",
    dateColumn: "revenue_date",
    statusColumn: "status",
    createColumns: [
      "revenue_source",
      "patient_id",
      "doctor_id",
      "department_id",
      "revenue_date",
      "amount",
      "cost_amount",
      "margin_amount",
      "status",
    ],
    requiredColumns: ["revenue_source"],
    numericColumns,
    dateColumns,
  },
  "insurance-companies": {
    key: "insurance-companies",
    label: "Insurance Companies",
    table:
      "clinical_finance_insurance_companies",
    idPrefix: "INS",
    uidColumn: "company_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "company_name",
      "contact_person",
      "email",
      "phone",
      "settlement_terms",
      "status",
    ],
    requiredColumns: ["company_name"],
    textAreaColumns: ["settlement_terms"],
  },
  tpa: {
    key: "tpa",
    label: "TPA Management",
    table: "clinical_finance_tpas",
    idPrefix: "TPA",
    uidColumn: "tpa_code",
    dateColumn: "agreement_date",
    statusColumn: "status",
    createColumns: [
      "tpa_name",
      "agreement_date",
      "settlement_period_days",
      "coverage_rules",
      "status",
    ],
    requiredColumns: ["tpa_name"],
    numericColumns,
    dateColumns,
    jsonColumns: ["coverage_rules"],
  },
  preauth: {
    key: "preauth",
    label: "Pre Authorization",
    table:
      "clinical_finance_pre_authorizations",
    idPrefix: "PA",
    uidColumn: "request_number",
    patientColumn: "patient_id",
    dateColumn: "submitted_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "insurance_company_id",
      "tpa_id",
      "diagnosis",
      "requested_amount",
      "submitted_date",
      "approved_amount",
      "rejected_amount",
      "approval_date",
      "remarks",
      "status",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: [
      "diagnosis",
      "remarks",
    ],
  },
  claims: {
    key: "claims",
    label: "Claims Management",
    table: "clinical_finance_claims",
    idPrefix: "CLM",
    uidColumn: "claim_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "admission_number",
      "insurance_company_id",
      "tpa_id",
      "preauth_id",
      "claim_amount",
      "approved_amount",
      "rejected_amount",
      "settled_amount",
      "submitted_date",
      "settlement_date",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  "claim-documents": {
    key: "claim-documents",
    label: "Claim Documents",
    table:
      "clinical_finance_claim_documents",
    idPrefix: "CDOC",
    dateColumn: "created_at",
    statusColumn: "verification_status",
    createColumns: [
      "claim_id",
      "document_type",
      "document_title",
      "file_url",
      "verification_status",
      "uploaded_by",
    ],
    requiredColumns: ["document_type"],
    numericColumns,
  },
  corporates: {
    key: "corporates",
    label: "Corporate Billing",
    table: "clinical_finance_corporates",
    idPrefix: "CORP",
    uidColumn: "corporate_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "corporate_name",
      "agreement_start",
      "agreement_end",
      "credit_limit",
      "contact_person",
      "email",
      "phone",
      "status",
    ],
    requiredColumns: ["corporate_name"],
    numericColumns,
    dateColumns,
  },
  "corporate-patients": {
    key: "corporate-patients",
    label: "Corporate Patients",
    table:
      "clinical_finance_corporate_patients",
    idPrefix: "CPAT",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "corporate_id",
      "patient_id",
      "employee_id",
      "corporate_approval",
      "package_eligibility",
      "status",
    ],
    numericColumns,
    textAreaColumns: [
      "package_eligibility",
    ],
  },
  referrals: {
    key: "referrals",
    label: "Referral Management",
    table: "clinical_finance_referrals",
    idPrefix: "REF",
    uidColumn: "referral_code",
    doctorColumn: "doctor_id",
    dateColumn: "agreement_date",
    statusColumn: "status",
    createColumns: [
      "referral_type",
      "doctor_id",
      "external_hospital",
      "external_clinic",
      "agent_name",
      "corporate_id",
      "name",
      "mobile",
      "email",
      "address",
      "agreement_date",
      "status",
    ],
    requiredColumns: [
      "referral_type",
      "name",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: ["address"],
  },
  "commission-rules": {
    key: "commission-rules",
    label: "Commission Rules",
    table:
      "clinical_finance_commission_rules",
    idPrefix: "CRULE",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "rule_name",
      "department_id",
      "procedure_name",
      "commission_type",
      "fixed_amount",
      "percentage",
      "slab_rules",
      "revenue_sharing_rules",
      "status",
    ],
    requiredColumns: ["rule_name"],
    numericColumns,
    jsonColumns: [
      "slab_rules",
      "revenue_sharing_rules",
    ],
  },
  "commission-calculations": {
    key: "commission-calculations",
    label: "Commission Calculation",
    table:
      "clinical_finance_commission_calculations",
    idPrefix: "COM",
    uidColumn: "calculation_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "referral_id",
      "rule_id",
      "patient_id",
      "revenue_generated",
      "commission_percentage",
      "commission_amount",
      "tax_deduction",
      "net_payable",
      "approval_status",
      "status",
    ],
    numericColumns,
  },
  "doctor-incentives": {
    key: "doctor-incentives",
    label: "Doctor Incentives",
    table:
      "clinical_finance_doctor_incentives",
    idPrefix: "INC",
    doctorColumn: "doctor_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "doctor_id",
      "rule_id",
      "department_id",
      "revenue_amount",
      "incentive_percentage",
      "incentive_amount",
      "period_start",
      "period_end",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  payouts: {
    key: "payouts",
    label: "Payout Management",
    table: "clinical_finance_payouts",
    idPrefix: "PAY",
    uidColumn: "payout_number",
    dateColumn: "payment_date",
    statusColumn: "status",
    createColumns: [
      "referral_id",
      "commission_calculation_id",
      "amount",
      "payment_date",
      "payment_method",
      "reference",
      "status",
    ],
    numericColumns,
    dateColumns,
  },
  "ai-finance": {
    key: "ai-finance",
    label: "AI Finance Engine",
    table: "clinical_finance_ai_forecasts",
    idPrefix: "AIFIN",
    uidColumn: "forecast_number",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "forecast_type",
      "forecast_period",
      "predicted_revenue",
      "predicted_claim_delay_days",
      "claim_approval_probability",
      "referral_impact",
      "model_name",
      "confidence_score",
      "recommendations",
      "status",
    ],
    requiredColumns: ["forecast_type"],
    numericColumns,
    jsonColumns: ["recommendations"],
  },
};

export function getFinanceModuleConfig(
  moduleKey: string
) {
  return financeModules[
    moduleKey as FinanceModuleKey
  ];
}

export function normalizeFinanceValue(
  config: FinanceModuleConfig,
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

  if (config.jsonColumns?.includes(column)) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return column === "slab_rules" ||
          column === "recommendations"
          ? []
          : {};
      }
    }

    return value ?? {};
  }

  if (config.dateColumns?.includes(column)) {
    return String(value);
  }

  return String(value).trim();
}

export const financeDashboardModules =
  Object.values(financeModules);
