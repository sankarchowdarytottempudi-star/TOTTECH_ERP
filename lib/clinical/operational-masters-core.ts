export type OperationalFieldType =
  | "text"
  | "number"
  | "date"
  | "time"
  | "textarea"
  | "select"
  | "json";

export type OperationalField = {
  key: string;
  label: string;
  type: OperationalFieldType;
  required?: boolean;
  options?: string[];
  advanced?: boolean;
};

export type OperationalMasterConfig = {
  key: string;
  label: string;
  description: string;
  table: string;
  dateColumn: string;
  statusColumn?: string;
  primaryColumn: string;
  searchColumns: string[];
  fields: OperationalField[];
};

const activeStatus = [
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
];

export const operationalMasters: Record<
  string,
  OperationalMasterConfig
> = {
  doctors: {
    key: "doctors",
    label: "Doctor Master",
    description:
      "Complete doctor master with registration, fees, qualification, department and license details.",
    table: "doctors",
    dateColumn: "created_at",
    statusColumn: "status",
    primaryColumn: "full_name",
    searchColumns: [
      "doctor_code",
      "doctor_uid",
      "full_name",
      "specialization",
      "phone",
      "email",
      "registration_number",
    ],
    fields: [
      { key: "doctor_code", label: "Doctor Code", type: "text", required: true },
      { key: "full_name", label: "Doctor Name", type: "text", required: true },
      { key: "qualification", label: "Qualification", type: "text", required: true },
      { key: "specialization", label: "Specialization", type: "text", required: true },
      { key: "sub_specialization", label: "Sub Specialization", type: "text" },
      { key: "registration_number", label: "Registration Number", type: "text", required: true },
      { key: "experience_years", label: "Experience", type: "number" },
      { key: "department_id", label: "Department ID", type: "number" },
      { key: "designation", label: "Designation", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Mobile", type: "text", required: true },
      { key: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE", "OTHER"] },
      { key: "date_of_birth", label: "DOB", type: "date", advanced: true },
      { key: "joining_date", label: "Joining Date", type: "date" },
      { key: "consultation_fee", label: "Consultation Fee", type: "number" },
      { key: "follow_up_fee", label: "Follow Up Fee", type: "number" },
      { key: "license_expiry", label: "License Expiry", type: "date" },
      { key: "address", label: "Address", type: "textarea", advanced: true },
      { key: "photo_url", label: "Photo URL", type: "text", advanced: true },
      { key: "signature_url", label: "Signature URL", type: "text", advanced: true },
      { key: "status", label: "Status", type: "select", options: activeStatus, required: true },
    ],
  },
  departments: {
    key: "departments",
    label: "Department Master",
    description:
      "Clinical departments with specialization types and organizational hierarchy.",
    table: "departments",
    dateColumn: "created_at",
    primaryColumn: "department_name",
    searchColumns: [
      "department_name",
      "department_code",
      "department_type",
    ],
    fields: [
      { key: "department_code", label: "Department Code", type: "text", required: true },
      { key: "department_name", label: "Department Name", type: "text", required: true },
      { key: "department_type", label: "Department Type", type: "text" },
    ],
  },
  "lab-tests": {
    key: "lab-tests",
    label: "Lab Test Master",
    description:
      "Laboratory test master with sample, container, ranges, critical values, method, machine, TAT and pricing.",
    table: "clinical_lab_test_master",
    dateColumn: "created_at",
    statusColumn: "status",
    primaryColumn: "test_name",
    searchColumns: [
      "test_code",
      "test_name",
      "lab_test_name",
      "department",
      "category",
      "sample_type",
    ],
    fields: [
      { key: "test_code", label: "Test Code", type: "text", required: true },
      { key: "test_name", label: "Test Name", type: "text", required: true },
      { key: "department", label: "Department", type: "text", required: true },
      { key: "category", label: "Category", type: "text" },
      { key: "sub_category", label: "Sub Category", type: "text" },
      { key: "sample_type", label: "Sample Type", type: "text", required: true },
      { key: "sample_container", label: "Sample Container", type: "text", required: true },
      { key: "method", label: "Method", type: "text" },
      { key: "machine", label: "Machine", type: "text" },
      { key: "normal_range_male", label: "Normal Range Male", type: "textarea" },
      { key: "normal_range_female", label: "Normal Range Female", type: "textarea" },
      { key: "normal_range_child", label: "Normal Range Child", type: "textarea" },
      { key: "critical_low", label: "Critical Low", type: "text" },
      { key: "critical_high", label: "Critical High", type: "text" },
      { key: "turnaround_time", label: "Turn Around Time", type: "text", required: true },
      { key: "price", label: "Price", type: "number", required: true },
      { key: "tax", label: "Tax", type: "number" },
      { key: "status", label: "Status", type: "select", options: activeStatus, required: true },
    ],
  },
  medicines: {
    key: "medicines",
    label: "Pharmacy Medicine Master",
    description:
      "Medicine master with generic, brand, manufacturer, HSN/GST, reorder, storage and pricing details.",
    table: "pharmacy_medicines",
    dateColumn: "created_at",
    statusColumn: "status",
    primaryColumn: "brand_name",
    searchColumns: [
      "medicine_code",
      "generic_name",
      "brand_name",
      "manufacturer",
      "category",
      "hsn_code",
    ],
    fields: [
      { key: "medicine_code", label: "Medicine Code", type: "text", required: true },
      { key: "generic_name", label: "Generic Name", type: "text", required: true },
      { key: "brand_name", label: "Brand Name", type: "text", required: true },
      { key: "manufacturer", label: "Manufacturer", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "strength", label: "Strength", type: "text" },
      { key: "unit", label: "Unit", type: "text" },
      { key: "pack_size", label: "Pack Size", type: "text" },
      { key: "hsn_code", label: "HSN Code", type: "text" },
      { key: "gst", label: "GST", type: "number" },
      { key: "reorder_level", label: "Reorder Level", type: "number" },
      { key: "storage_condition", label: "Storage Conditions", type: "text" },
      { key: "schedule_drug", label: "Schedule Type", type: "text" },
      { key: "purchase_price", label: "Purchase Price", type: "number" },
      { key: "selling_price", label: "Selling Price", type: "number" },
      { key: "status", label: "Status", type: "select", options: activeStatus, required: true },
    ],
  },
  roles: {
    key: "roles",
    label: "Role Management",
    description:
      "Operational role builder with module permission matrix stored as JSON.",
    table: "clinical_operational_roles",
    dateColumn: "created_at",
    statusColumn: "status",
    primaryColumn: "role_name",
    searchColumns: ["role_name", "description", "status"],
    fields: [
      { key: "role_name", label: "Role Name", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "module_permissions", label: "Module Permissions JSON", type: "json", required: true },
      { key: "status", label: "Status", type: "select", options: activeStatus, required: true },
    ],
  },
  assets: {
    key: "assets",
    label: "IT / Facility Asset Master",
    description:
      "Asset register for laptop, desktop, tablet, mobile, printer, server and facility assets with allocation.",
    table: "clinical_finance_assets",
    dateColumn: "created_at",
    statusColumn: "status",
    primaryColumn: "asset_name",
    searchColumns: [
      "asset_number",
      "asset_name",
      "asset_type",
      "brand",
      "serial_number",
      "allocated_to",
      "employee_id",
    ],
    fields: [
      { key: "asset_number", label: "Asset Number", type: "text", required: true },
      { key: "asset_name", label: "Asset Name", type: "text", required: true },
      { key: "asset_type", label: "Asset Type", type: "select", options: ["Laptop", "Desktop", "Tablet", "Mobile", "Printer", "Server", "Bed", "Furniture", "Other"], required: true },
      { key: "category", label: "Category", type: "text" },
      { key: "brand", label: "Brand", type: "text" },
      { key: "model", label: "Model", type: "text" },
      { key: "serial_number", label: "Serial Number", type: "text" },
      { key: "purchase_date", label: "Purchase Date", type: "date" },
      { key: "warranty_expiry", label: "Warranty Expiry", type: "date" },
      { key: "vendor", label: "Vendor", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "department_id", label: "Department ID", type: "number" },
      { key: "allocated_to", label: "Allocated To", type: "text" },
      { key: "employee_id", label: "Employee ID", type: "text" },
      { key: "purchase_cost", label: "Cost", type: "number" },
      { key: "asset_status", label: "Asset Status", type: "select", options: ["ACTIVE", "REPAIR", "LOST", "DISPOSED"] },
      { key: "remarks", label: "Remarks", type: "textarea", advanced: true },
      { key: "status", label: "Status", type: "select", options: activeStatus, required: true },
    ],
  },
  equipment: {
    key: "equipment",
    label: "Medical Equipment Master",
    description:
      "Biomedical equipment register with AMC, warranty, calibration and current location.",
    table: "clinical_biomedical_equipment",
    dateColumn: "created_at",
    statusColumn: "status",
    primaryColumn: "equipment_name",
    searchColumns: [
      "equipment_number",
      "equipment_name",
      "equipment_category",
      "manufacturer",
      "serial_number",
      "department",
    ],
    fields: [
      { key: "equipment_number", label: "Equipment Number", type: "text", required: true },
      { key: "equipment_name", label: "Equipment Name", type: "text", required: true },
      { key: "equipment_category", label: "Equipment Category", type: "select", options: ["Ventilator", "Monitor", "Defibrillator", "ECG", "MRI", "CT", "Ultrasound", "Analyzer", "Microscope", "Other"], required: true },
      { key: "manufacturer", label: "Manufacturer", type: "text" },
      { key: "model", label: "Model", type: "text" },
      { key: "serial_number", label: "Serial Number", type: "text" },
      { key: "purchase_date", label: "Purchase Date", type: "date" },
      { key: "warranty_expiry", label: "Warranty Expiry", type: "date" },
      { key: "amc_vendor", label: "AMC Vendor", type: "text" },
      { key: "amc_expiry", label: "AMC Expiry", type: "date" },
      { key: "calibration_date", label: "Calibration Date", type: "date" },
      { key: "next_calibration", label: "Next Calibration", type: "date" },
      { key: "department", label: "Department", type: "text" },
      { key: "current_location", label: "Current Location", type: "text" },
      { key: "assigned_user", label: "Assigned User", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["ACTIVE", "CALIBRATION_DUE", "SERVICE_DUE", "BREAKDOWN", "RETIRED"], required: true },
      { key: "remarks", label: "Remarks", type: "textarea", advanced: true },
    ],
  },
};

export const operationalMasterList =
  Object.values(operationalMasters);

export function getOperationalMasterConfig(
  key: string
) {
  return operationalMasters[key];
}

export function normalizeOperationalValue(
  field: OperationalField,
  value: unknown
) {
  if (value === undefined || value === null) {
    return null;
  }

  const raw = String(value).trim();

  if (!raw) {
    return null;
  }

  if (field.type === "number") {
    const parsed = Number(raw);
    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  if (field.type === "json") {
    if (typeof value === "object") {
      return value;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return raw;
}
