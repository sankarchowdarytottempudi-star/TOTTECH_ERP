export type PharmacyModuleKey =
  | "prescription-queue"
  | "medicines"
  | "categories"
  | "vendors"
  | "requisitions"
  | "purchase-orders"
  | "grn"
  | "inventory"
  | "warehouses"
  | "transfers"
  | "sales"
  | "ip-dispensing"
  | "ivf-medications"
  | "controlled-drugs"
  | "expiry"
  | "returns"
  | "adjustments"
  | "audits"
  | "reorder"
  | "ai-forecast"
  | "formulary"
  | "pricing"
  | "claims"
  | "mobile";

export type PharmacyModuleConfig = {
  key: PharmacyModuleKey;
  label: string;
  table: string;
  idPrefix: string;
  uidColumn?: string;
  medicineColumn?: string;
  patientColumn?: string;
  dateColumn: string;
  statusColumn?: string;
  createColumns: string[];
  numericColumns?: string[];
  booleanColumns?: string[];
  dateColumns?: string[];
  textAreaColumns?: string[];
  jsonColumns?: string[];
};

export const pharmacyModules: Record<
  PharmacyModuleKey,
  PharmacyModuleConfig
> = {
  "prescription-queue": {
    key: "prescription-queue",
    label: "Prescription Queue",
    table: "pharmacy_prescription_queue",
    idPrefix: "RXQ",
    uidColumn: "queue_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "prescription_id",
      "appointment_id",
      "medical_record_id",
      "patient_id",
      "doctor_id",
      "prescription_uid",
      "patient_name",
      "patient_mobile",
      "medications",
      "status",
      "notes",
    ],
    numericColumns: [
      "prescription_id",
      "appointment_id",
      "medical_record_id",
      "patient_id",
      "doctor_id",
    ],
    jsonColumns: ["medications"],
    textAreaColumns: ["notes"],
  },
  medicines: {
    key: "medicines",
    label: "Medicine Master",
    table: "pharmacy_medicines",
    idPrefix: "MED",
    uidColumn: "medicine_code",
    medicineColumn: "id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "generic_name",
      "brand_name",
      "strength",
      "form",
      "manufacturer",
      "category_id",
      "hsn_code",
      "schedule_drug",
      "controlled_drug",
      "narcotic",
      "storage_condition",
      "cold_chain_required",
      "barcode",
      "qr_code",
      "shelf_life_days",
      "reorder_level",
      "maximum_level",
      "minimum_level",
      "status",
    ],
    numericColumns: [
      "category_id",
      "shelf_life_days",
      "reorder_level",
      "maximum_level",
      "minimum_level",
    ],
    booleanColumns: [
      "controlled_drug",
      "narcotic",
      "cold_chain_required",
    ],
  },
  categories: {
    key: "categories",
    label: "Drug Classification",
    table: "pharmacy_medicine_categories",
    idPrefix: "CAT",
    uidColumn: "category_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "category_name",
      "category_type",
      "restrictions",
      "status",
    ],
    textAreaColumns: ["restrictions"],
  },
  vendors: {
    key: "vendors",
    label: "Vendor Management",
    table: "pharmacy_vendors",
    idPrefix: "VEN",
    uidColumn: "vendor_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "vendor_name",
      "gst_number",
      "drug_license_number",
      "address",
      "contact_person",
      "mobile",
      "email",
      "payment_terms",
      "credit_limit",
      "rating",
      "status",
    ],
    numericColumns: [
      "credit_limit",
      "rating",
    ],
    textAreaColumns: ["address"],
  },
  requisitions: {
    key: "requisitions",
    label: "Purchase Requisitions",
    table:
      "pharmacy_purchase_requisitions",
    idPrefix: "PR",
    uidColumn: "requisition_number",
    dateColumn: "request_date",
    statusColumn: "status",
    createColumns: [
      "department_id",
      "requested_by",
      "request_date",
      "priority",
      "reason",
      "status",
    ],
    numericColumns: [
      "department_id",
      "requested_by",
    ],
    dateColumns: ["request_date"],
    textAreaColumns: ["reason"],
  },
  "purchase-orders": {
    key: "purchase-orders",
    label: "Purchase Orders",
    table: "pharmacy_purchase_orders",
    idPrefix: "PO",
    uidColumn: "po_number",
    dateColumn: "po_date",
    statusColumn: "status",
    createColumns: [
      "requisition_id",
      "vendor_id",
      "po_date",
      "expected_delivery",
      "remarks",
      "subtotal",
      "tax",
      "discount",
      "net_amount",
      "status",
    ],
    numericColumns: [
      "requisition_id",
      "vendor_id",
      "subtotal",
      "tax",
      "discount",
      "net_amount",
    ],
    dateColumns: [
      "po_date",
      "expected_delivery",
    ],
    textAreaColumns: ["remarks"],
  },
  grn: {
    key: "grn",
    label: "Goods Receipt Notes",
    table: "pharmacy_grns",
    idPrefix: "GRN",
    uidColumn: "grn_number",
    dateColumn: "received_date",
    statusColumn: "status",
    createColumns: [
      "po_id",
      "vendor_id",
      "invoice_number",
      "invoice_date",
      "received_date",
      "status",
    ],
    numericColumns: ["po_id", "vendor_id"],
    dateColumns: [
      "invoice_date",
      "received_date",
    ],
  },
  inventory: {
    key: "inventory",
    label: "Inventory",
    table: "pharmacy_inventory",
    idPrefix: "INVSTK",
    medicineColumn: "medicine_id",
    dateColumn: "created_at",
    statusColumn: "inventory_status",
    createColumns: [
      "warehouse_id",
      "location_id",
      "medicine_id",
      "batch_id",
      "current_quantity",
      "reserved_quantity",
      "available_quantity",
      "unit_cost",
      "selling_price",
      "expiry_date",
      "inventory_status",
    ],
    numericColumns: [
      "warehouse_id",
      "location_id",
      "medicine_id",
      "batch_id",
      "current_quantity",
      "reserved_quantity",
      "available_quantity",
      "unit_cost",
      "selling_price",
    ],
    dateColumns: ["expiry_date"],
  },
  warehouses: {
    key: "warehouses",
    label: "Warehouses",
    table: "pharmacy_warehouses",
    idPrefix: "WH",
    uidColumn: "warehouse_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "warehouse_name",
      "pharmacy_type",
      "location",
      "manager_id",
      "capacity",
      "status",
    ],
    numericColumns: [
      "manager_id",
      "capacity",
    ],
    textAreaColumns: ["location"],
  },
  transfers: {
    key: "transfers",
    label: "Stock Transfers",
    table: "pharmacy_stock_transfers",
    idPrefix: "TRN",
    uidColumn: "transfer_number",
    dateColumn: "transfer_date",
    statusColumn: "status",
    createColumns: [
      "source_store_id",
      "destination_store_id",
      "transfer_date",
      "requested_by",
      "status",
    ],
    numericColumns: [
      "source_store_id",
      "destination_store_id",
      "requested_by",
    ],
    dateColumns: ["transfer_date"],
  },
  sales: {
    key: "sales",
    label: "Retail Pharmacy",
    table: "pharmacy_retail_sales",
    idPrefix: "BILL",
    uidColumn: "bill_number",
    patientColumn: "patient_id",
    dateColumn: "sale_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "doctor_id",
      "prescription_number",
      "sale_date",
      "payment_mode",
      "subtotal",
      "discount",
      "tax",
      "total",
      "paid_amount",
      "status",
    ],
    numericColumns: [
      "patient_id",
      "doctor_id",
      "subtotal",
      "discount",
      "tax",
      "total",
      "paid_amount",
    ],
    dateColumns: ["sale_date"],
  },
  "ip-dispensing": {
    key: "ip-dispensing",
    label: "IP Pharmacy",
    table: "pharmacy_ip_dispensing",
    idPrefix: "IPD",
    uidColumn: "dispensing_number",
    medicineColumn: "medicine_id",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "admission_id",
      "patient_id",
      "ward",
      "doctor_id",
      "medicine_id",
      "batch_id",
      "quantity",
      "frequency",
      "status",
    ],
    numericColumns: [
      "admission_id",
      "patient_id",
      "doctor_id",
      "medicine_id",
      "batch_id",
      "quantity",
    ],
  },
  "ivf-medications": {
    key: "ivf-medications",
    label: "IVF Pharmacy",
    table:
      "pharmacy_ivf_medication_tracking",
    idPrefix: "IVFMED",
    medicineColumn: "medicine_id",
    patientColumn: "patient_id",
    dateColumn: "start_date",
    statusColumn: "status",
    createColumns: [
      "cycle_id",
      "patient_id",
      "medicine_id",
      "medication_type",
      "dose",
      "start_date",
      "end_date",
      "compliance",
      "status",
    ],
    numericColumns: [
      "cycle_id",
      "patient_id",
      "medicine_id",
    ],
    dateColumns: [
      "start_date",
      "end_date",
    ],
  },
  "controlled-drugs": {
    key: "controlled-drugs",
    label: "Controlled Drugs",
    table:
      "pharmacy_controlled_drug_register",
    idPrefix: "CDR",
    uidColumn: "register_number",
    medicineColumn: "medicine_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "medicine_id",
      "batch_id",
      "quantity_received",
      "quantity_issued",
      "balance",
      "authorized_by",
      "movement_type",
      "remarks",
      "status",
    ],
    numericColumns: [
      "medicine_id",
      "batch_id",
      "quantity_received",
      "quantity_issued",
      "balance",
      "authorized_by",
    ],
    textAreaColumns: ["remarks"],
  },
  expiry: {
    key: "expiry",
    label: "Expiry Management",
    table: "pharmacy_expiry_actions",
    idPrefix: "EXP",
    uidColumn: "action_number",
    medicineColumn: "medicine_id",
    dateColumn: "action_date",
    statusColumn: "status",
    createColumns: [
      "medicine_id",
      "batch_id",
      "action_type",
      "action_date",
      "quantity",
      "remarks",
      "status",
    ],
    numericColumns: [
      "medicine_id",
      "batch_id",
      "quantity",
    ],
    dateColumns: ["action_date"],
    textAreaColumns: ["remarks"],
  },
  returns: {
    key: "returns",
    label: "Returns Management",
    table: "pharmacy_customer_returns",
    idPrefix: "RET",
    uidColumn: "return_number",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "sale_id",
      "patient_id",
      "reason",
      "approval_status",
      "status",
    ],
    numericColumns: ["sale_id", "patient_id"],
    textAreaColumns: ["reason"],
  },
  adjustments: {
    key: "adjustments",
    label: "Stock Adjustments",
    table: "pharmacy_stock_adjustments",
    idPrefix: "ADJ",
    uidColumn: "adjustment_number",
    medicineColumn: "medicine_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "medicine_id",
      "batch_id",
      "reason",
      "stock_before",
      "stock_after",
      "approved_by",
      "status",
    ],
    numericColumns: [
      "medicine_id",
      "batch_id",
      "stock_before",
      "stock_after",
      "approved_by",
    ],
  },
  audits: {
    key: "audits",
    label: "Inventory Audit",
    table: "pharmacy_inventory_audits",
    idPrefix: "AUD",
    uidColumn: "audit_number",
    medicineColumn: "medicine_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "warehouse_id",
      "medicine_id",
      "batch_id",
      "system_quantity",
      "physical_quantity",
      "variance",
      "status",
    ],
    numericColumns: [
      "warehouse_id",
      "medicine_id",
      "batch_id",
      "system_quantity",
      "physical_quantity",
      "variance",
    ],
  },
  reorder: {
    key: "reorder",
    label: "Auto Reorder",
    table: "pharmacy_reorder_rules",
    idPrefix: "ROR",
    medicineColumn: "medicine_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "medicine_id",
      "minimum_level",
      "maximum_level",
      "preferred_vendor_id",
      "lead_time_days",
      "auto_po_enabled",
      "status",
    ],
    numericColumns: [
      "medicine_id",
      "minimum_level",
      "maximum_level",
      "preferred_vendor_id",
      "lead_time_days",
    ],
    booleanColumns: ["auto_po_enabled"],
  },
  "ai-forecast": {
    key: "ai-forecast",
    label: "AI Inventory Engine",
    table: "pharmacy_ai_forecasts",
    idPrefix: "AIF",
    uidColumn: "forecast_number",
    medicineColumn: "medicine_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "medicine_id",
      "forecast_type",
      "predicted_consumption",
      "future_demand",
      "shortage_risk",
      "expiry_risk",
      "clinical_review_required",
      "status",
    ],
    numericColumns: [
      "medicine_id",
      "predicted_consumption",
      "future_demand",
      "shortage_risk",
      "expiry_risk",
    ],
    booleanColumns: [
      "clinical_review_required",
    ],
  },
  formulary: {
    key: "formulary",
    label: "Formulary",
    table: "pharmacy_formulary",
    idPrefix: "FOR",
    medicineColumn: "medicine_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "medicine_id",
      "category_id",
      "hospital_approved",
      "alternative_medicine_id",
      "restrictions",
      "status",
    ],
    numericColumns: [
      "medicine_id",
      "category_id",
      "alternative_medicine_id",
    ],
    booleanColumns: [
      "hospital_approved",
    ],
    textAreaColumns: ["restrictions"],
  },
  pricing: {
    key: "pricing",
    label: "Pharmacy Billing",
    table: "pharmacy_pricing_rules",
    idPrefix: "PRICE",
    medicineColumn: "medicine_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "medicine_id",
      "mrp",
      "selling_price",
      "discount",
      "insurance_coverage",
      "status",
    ],
    numericColumns: [
      "medicine_id",
      "mrp",
      "selling_price",
      "discount",
    ],
    booleanColumns: [
      "insurance_coverage",
    ],
  },
  claims: {
    key: "claims",
    label: "Insurance Pharmacy Claims",
    table: "pharmacy_insurance_claims",
    idPrefix: "PCLM",
    uidColumn: "claim_number",
    medicineColumn: "medicine_id",
    patientColumn: "patient_id",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "sale_id",
      "patient_id",
      "medicine_id",
      "approved_amount",
      "rejected_amount",
      "remarks",
      "status",
    ],
    numericColumns: [
      "sale_id",
      "patient_id",
      "medicine_id",
      "approved_amount",
      "rejected_amount",
    ],
    textAreaColumns: ["remarks"],
  },
  mobile: {
    key: "mobile",
    label: "Mobile Pharmacy App",
    table: "pharmacy_mobile_stock_checks",
    idPrefix: "MOB",
    uidColumn: "record_number",
    medicineColumn: "medicine_id",
    dateColumn: "record_date",
    statusColumn: "status",
    createColumns: [
      "patient_id",
      "medicine_id",
      "batch_id",
      "warehouse_id",
      "record_number",
      "record_date",
      "title",
      "status",
    ],
    numericColumns: [
      "patient_id",
      "medicine_id",
      "batch_id",
      "warehouse_id",
    ],
    dateColumns: ["record_date"],
  },
};

export function getPharmacyModuleConfig(
  moduleKey: string
) {
  return pharmacyModules[
    moduleKey as PharmacyModuleKey
  ];
}

export function normalizePharmacyValue(
  config: PharmacyModuleConfig,
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
        return {};
      }
    }

    return value ?? {};
  }

  if (config.dateColumns?.includes(column)) {
    return String(value);
  }

  return String(value).trim();
}

export const pharmacyDashboardModules =
  Object.values(pharmacyModules);
