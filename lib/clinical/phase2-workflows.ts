export type Phase2FieldType =
  | "text"
  | "number"
  | "date"
  | "time"
  | "textarea"
  | "select"
  | "patient"
  | "doctor"
  | "department"
  | "medicine"
  | "lab_test"
  | "room";

export type Phase2Field = {
  key: string;
  label: string;
  type: Phase2FieldType;
  required?: boolean;
  options?: string[];
  section?: string;
  placeholder?: string;
};

export type Phase2Module = {
  key: string;
  title: string;
  subtitle: string;
  route: string;
  audience: string;
  primaryAction: string;
  statuses: string[];
  defaultStatus: string;
  titleFields: string[];
  printTitle: string;
  fields: Phase2Field[];
};

const root = "/clinical-services";

const patientField: Phase2Field = {
  key: "patient_id",
  label: "Patient",
  type: "patient",
  required: true,
  section: "Patient",
};

const notesField: Phase2Field = {
  key: "notes",
  label: "Notes",
  type: "textarea",
  section: "Notes",
};

export const phase2Modules: Phase2Module[] = [
  {
    key: "nursing",
    title: "Nursing Station",
    subtitle:
      "Vitals entry, nursing notes, medication administration, and shift handover.",
    route: `${root}/nursing`,
    audience: "Nurses and ward teams",
    primaryAction: "Save Nursing Record",
    statuses: [
      "PRESENT",
      "VITALS_ENTERED",
      "MEDICATION_GIVEN",
      "HANDOVER_DONE",
    ],
    defaultStatus: "PRESENT",
    titleFields: ["patient_id", "temperature", "blood_pressure"],
    printTitle: "Nursing Station Record",
    fields: [
      patientField,
      { key: "temperature", label: "Temperature", type: "number", section: "Vitals" },
      { key: "pulse", label: "Pulse", type: "number", section: "Vitals" },
      { key: "respiratory_rate", label: "Respiratory Rate", type: "number", section: "Vitals" },
      { key: "blood_pressure", label: "Blood Pressure", type: "text", section: "Vitals", placeholder: "120/80" },
      { key: "spo2", label: "SpO2", type: "number", section: "Vitals" },
      { key: "weight", label: "Weight", type: "number", section: "Vitals" },
      { key: "height", label: "Height", type: "number", section: "Vitals" },
      { key: "bmi", label: "BMI", type: "number", section: "Vitals" },
      { key: "medicine_id", label: "Medicine", type: "medicine", section: "Medication" },
      { key: "dose", label: "Dose", type: "text", section: "Medication" },
      { key: "administration_time", label: "Time", type: "time", section: "Medication" },
      { key: "nurse_name", label: "Nurse", type: "text", section: "Medication" },
      { key: "handover_to", label: "Handover To", type: "text", section: "Shift Handover" },
      notesField,
    ],
  },
  {
    key: "consultations",
    title: "Doctor Consultation",
    subtitle:
      "Clinical notes, diagnosis, medicine orders, lab/radiology orders, and prescription generation.",
    route: `${root}/consultations`,
    audience: "Doctors",
    primaryAction: "Save Consultation",
    statuses: [
      "DRAFT",
      "IN_CONSULTATION",
      "CONSULTATION_COMPLETED",
      "FOLLOW_UP_REQUIRED",
    ],
    defaultStatus: "DRAFT",
    titleFields: ["patient_id", "chief_complaint", "diagnosis"],
    printTitle: "Doctor Consultation Sheet",
    fields: [
      patientField,
      { key: "doctor_id", label: "Doctor", type: "doctor", required: true, section: "Doctor" },
      { key: "chief_complaint", label: "Chief Complaint", type: "textarea", required: true, section: "Clinical" },
      { key: "symptoms", label: "Symptoms", type: "textarea", section: "Clinical" },
      { key: "diagnosis", label: "Diagnosis", type: "textarea", section: "Clinical" },
      { key: "clinical_notes", label: "Clinical Notes", type: "textarea", section: "Clinical" },
      { key: "follow_up_date", label: "Follow-Up Date", type: "date", section: "Follow-Up" },
      { key: "medicine_id", label: "Medicine Order", type: "medicine", section: "Orders" },
      { key: "lab_test_id", label: "Lab Test Order", type: "lab_test", section: "Orders" },
      { key: "radiology_modality", label: "Radiology", type: "select", options: ["X-Ray", "CT", "MRI", "Ultrasound", "ECG", "Echo"], section: "Orders" },
      { key: "procedure", label: "Procedure", type: "text", section: "Orders" },
      notesField,
    ],
  },
  {
    key: "laboratory",
    title: "Laboratory Operations",
    subtitle:
      "Sample collection, tracking, result entry, validation, approval, and report release.",
    route: `${root}/laboratory`,
    audience: "Lab technicians and lab managers",
    primaryAction: "Save Lab Record",
    statuses: ["ORDERED", "SAMPLE_COLLECTED", "PROCESSING", "COMPLETED", "APPROVED", "RELEASED"],
    defaultStatus: "ORDERED",
    titleFields: ["patient_id", "lab_test_id", "sample_number"],
    printTitle: "Laboratory Order / Result",
    fields: [
      patientField,
      { key: "lab_test_id", label: "Lab Test", type: "lab_test", required: true, section: "Order" },
      { key: "sample_number", label: "Sample Number", type: "text", section: "Sample" },
      { key: "sample_type", label: "Sample Type", type: "text", section: "Sample" },
      { key: "collection_time", label: "Collection Time", type: "time", section: "Sample" },
      { key: "result_value", label: "Result Value", type: "text", section: "Result" },
      { key: "critical_value", label: "Critical Value", type: "select", options: ["NO", "YES"], section: "Result" },
      { key: "validated_by", label: "Validated By", type: "text", section: "Approval" },
      notesField,
    ],
  },
  {
    key: "radiology",
    title: "Radiology",
    subtitle:
      "Radiology orders, scheduling, technician entry, report entry, approval, and release.",
    route: `${root}/radiology`,
    audience: "Radiology technicians and radiologists",
    primaryAction: "Save Radiology Record",
    statuses: ["ORDERED", "SCHEDULED", "IMAGING_DONE", "REPORT_ENTERED", "APPROVED", "RELEASED"],
    defaultStatus: "ORDERED",
    titleFields: ["patient_id", "modality", "study_name"],
    printTitle: "Radiology Order / Report",
    fields: [
      patientField,
      { key: "modality", label: "Modality", type: "select", required: true, options: ["X-Ray", "CT", "MRI", "Ultrasound", "ECG", "Echo"], section: "Order" },
      { key: "study_name", label: "Study Name", type: "text", required: true, section: "Order" },
      { key: "scheduled_date", label: "Scheduled Date", type: "date", section: "Schedule" },
      { key: "technician", label: "Technician", type: "text", section: "Technician" },
      { key: "findings", label: "Findings", type: "textarea", section: "Report" },
      { key: "impression", label: "Impression", type: "textarea", section: "Report" },
      { key: "approved_by", label: "Approved By", type: "text", section: "Approval" },
      notesField,
    ],
  },
  {
    key: "bed-management",
    title: "Bed Management",
    subtitle:
      "Building, ward, room, bed status, admissions, transfers, discharges, and live occupancy.",
    route: `${root}/bed-management`,
    audience: "Reception, admission desk, nursing supervisors",
    primaryAction: "Save Bed Action",
    statuses: ["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING", "MAINTENANCE", "DISCHARGED"],
    defaultStatus: "AVAILABLE",
    titleFields: ["room_id", "bed_number", "patient_id"],
    printTitle: "Bed Management Record",
    fields: [
      { key: "building", label: "Building", type: "text", section: "Location" },
      { key: "ward", label: "Ward", type: "text", section: "Location" },
      { key: "room_id", label: "Room", type: "room", section: "Location" },
      { key: "bed_number", label: "Bed Number", type: "text", required: true, section: "Bed" },
      { ...patientField, required: false },
      { key: "action", label: "Action", type: "select", options: ["Admit", "Transfer", "Discharge", "Reserve", "Cleaning", "Maintenance"], section: "Action" },
      notesField,
    ],
  },
  {
    key: "ipd",
    title: "IPD Management",
    subtitle:
      "Admission, bed allocation, daily rounds, nursing notes, medication, transfer, and discharge.",
    route: `${root}/ipd`,
    audience: "Admission, ward, doctors, nursing teams",
    primaryAction: "Save IPD Record",
    statuses: ["ADMITTED", "BED_ALLOCATED", "DAILY_ROUND_DONE", "TRANSFERRED", "DISCHARGE_PLANNED", "DISCHARGED"],
    defaultStatus: "ADMITTED",
    titleFields: ["patient_id", "room_id", "admission_reason"],
    printTitle: "IPD Admission / Daily Record",
    fields: [
      patientField,
      { key: "doctor_id", label: "Treating Doctor", type: "doctor", section: "Admission" },
      { key: "room_id", label: "Bed / Room", type: "room", section: "Admission" },
      { key: "admission_date", label: "Admission Date", type: "date", section: "Admission" },
      { key: "admission_reason", label: "Admission Reason", type: "textarea", required: true, section: "Admission" },
      { key: "daily_round_notes", label: "Daily Round Notes", type: "textarea", section: "Rounds" },
      { key: "nursing_notes", label: "Nursing Notes", type: "textarea", section: "Nursing" },
      { key: "discharge_summary", label: "Discharge Summary", type: "textarea", section: "Discharge" },
      notesField,
    ],
  },
  {
    key: "ot",
    title: "Operation Theatre",
    subtitle:
      "OT scheduling, surgeon assignment, anaesthesia, procedure notes, and OT billing.",
    route: `${root}/ot`,
    audience: "OT coordinators, surgeons, anaesthesia teams",
    primaryAction: "Save OT Schedule",
    statuses: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
    defaultStatus: "SCHEDULED",
    titleFields: ["patient_id", "procedure", "surgeon_id"],
    printTitle: "Operation Theatre Schedule",
    fields: [
      patientField,
      { key: "procedure", label: "Procedure", type: "text", required: true, section: "Procedure" },
      { key: "surgeon_id", label: "Surgeon", type: "doctor", section: "Team" },
      { key: "assistant_surgeon", label: "Assistant Surgeon", type: "text", section: "Team" },
      { key: "anaesthetist", label: "Anaesthetist", type: "text", section: "Team" },
      { key: "ot_room", label: "OT Room", type: "room", section: "Room" },
      { key: "procedure_date", label: "Date", type: "date", section: "Schedule" },
      { key: "start_time", label: "Start Time", type: "time", section: "Schedule" },
      { key: "end_time", label: "End Time", type: "time", section: "Schedule" },
      { key: "billing_notes", label: "Billing Notes", type: "textarea", section: "Billing" },
      notesField,
    ],
  },
  {
    key: "icu",
    title: "ICU Management",
    subtitle:
      "ICU admission, hourly monitoring, ventilator tracking, and critical care notes.",
    route: `${root}/icu`,
    audience: "ICU doctors and nurses",
    primaryAction: "Save ICU Record",
    statuses: ["ADMITTED", "HOURLY_MONITORING", "CRITICAL", "STABLE", "TRANSFERRED", "DISCHARGED"],
    defaultStatus: "ADMITTED",
    titleFields: ["patient_id", "pulse", "ventilator_mode"],
    printTitle: "ICU Monitoring Record",
    fields: [
      patientField,
      { key: "pulse", label: "Pulse", type: "number", section: "Vitals" },
      { key: "bp", label: "BP", type: "text", section: "Vitals" },
      { key: "spo2", label: "SpO2", type: "number", section: "Vitals" },
      { key: "ventilator_mode", label: "Ventilator Mode", type: "text", section: "Ventilator" },
      { key: "fio2", label: "FiO2", type: "number", section: "Ventilator" },
      { key: "peep", label: "PEEP", type: "number", section: "Ventilator" },
      { key: "respiratory_rate", label: "Respiratory Rate", type: "number", section: "Vitals" },
      { key: "critical_notes", label: "Critical Care Notes", type: "textarea", section: "Notes" },
      notesField,
    ],
  },
  {
    key: "ivf",
    title: "IVF Management",
    subtitle:
      "Cycle workflow, investigations, stimulation, retrieval, embryology, transfer, pregnancy test, cryo, billing, and reports.",
    route: `${root}/ivf`,
    audience: "IVF doctors, embryologists, coordinators",
    primaryAction: "Save IVF Workflow",
    statuses: ["CONSULTATION", "INVESTIGATIONS", "STIMULATION", "RETRIEVAL", "EMBRYO_CULTURE", "TRANSFER", "PREGNANCY_TEST", "FOLLOW_UP", "CLOSED"],
    defaultStatus: "CONSULTATION",
    titleFields: ["patient_id", "cycle_number", "workflow_stage"],
    printTitle: "IVF Cycle Record",
    fields: [
      patientField,
      { key: "cycle_number", label: "Cycle Number", type: "text", required: true, section: "Cycle" },
      { key: "workflow_stage", label: "Workflow Stage", type: "select", options: ["Consultation", "Investigations", "Stimulation", "Follicular Monitoring", "Trigger", "Egg Retrieval", "Sperm Collection", "Fertilization", "Embryo Culture", "Embryo Transfer", "Pregnancy Test", "Follow-Up"], section: "Cycle" },
      { key: "amh", label: "AMH", type: "number", section: "Female Profile" },
      { key: "fsh", label: "FSH", type: "number", section: "Female Profile" },
      { key: "lh", label: "LH", type: "number", section: "Female Profile" },
      { key: "estradiol", label: "Estradiol", type: "number", section: "Female Profile" },
      { key: "afc", label: "AFC", type: "number", section: "Female Profile" },
      { key: "sperm_count", label: "Sperm Count", type: "text", section: "Male Profile" },
      { key: "motility", label: "Motility", type: "text", section: "Male Profile" },
      { key: "morphology", label: "Morphology", type: "text", section: "Male Profile" },
      { key: "embryo_grade", label: "Embryo Grade", type: "text", section: "Embryology" },
      { key: "storage_tank", label: "Storage Tank", type: "text", section: "Cryopreservation" },
      { key: "canister", label: "Canister", type: "text", section: "Cryopreservation" },
      { key: "straw_number", label: "Straw Number", type: "text", section: "Cryopreservation" },
      { key: "freeze_date", label: "Freeze Date", type: "date", section: "Cryopreservation" },
      { key: "package_billing", label: "Package Billing", type: "number", section: "Billing" },
      notesField,
    ],
  },
  {
    key: "pharmacy",
    title: "Pharmacy Operations",
    subtitle:
      "Inventory, batch, expiry, purchase orders, goods receipt, dispensing, returns, and alerts.",
    route: `${root}/pharmacy`,
    audience: "Pharmacy staff",
    primaryAction: "Save Pharmacy Record",
    statuses: ["STOCK", "PO_CREATED", "GOODS_RECEIVED", "PRESCRIPTION_QUEUE", "DISPENSED", "RETURNED", "LOW_STOCK", "EXPIRING"],
    defaultStatus: "STOCK",
    titleFields: ["medicine_id", "batch_number", "patient_id"],
    printTitle: "Pharmacy Operation Record",
    fields: [
      { key: "medicine_id", label: "Medicine", type: "medicine", required: true, section: "Medicine" },
      { key: "batch_number", label: "Batch", type: "text", section: "Inventory" },
      { key: "expiry_date", label: "Expiry Date", type: "date", section: "Inventory" },
      { key: "quantity", label: "Quantity", type: "number", section: "Inventory" },
      { key: "purchase_order", label: "Purchase Order", type: "text", section: "Purchase" },
      { key: "goods_receipt", label: "Goods Receipt", type: "text", section: "Purchase" },
      { ...patientField, required: false },
      { key: "dispense_notes", label: "Dispense Notes", type: "textarea", section: "Dispensing" },
      { key: "return_reason", label: "Return Reason", type: "textarea", section: "Returns" },
      notesField,
    ],
  },
  {
    key: "inventory",
    title: "Inventory Management",
    subtitle:
      "OT, ICU, lab, and general medical supplies purchase, stock entry, issue, return, and consumption tracking.",
    route: `${root}/inventory`,
    audience: "Stores and procurement teams",
    primaryAction: "Save Inventory Record",
    statuses: ["PURCHASED", "STOCK_ENTERED", "ISSUED", "RETURNED", "CONSUMED"],
    defaultStatus: "STOCK_ENTERED",
    titleFields: ["item_name", "category", "quantity"],
    printTitle: "Inventory Operation Record",
    fields: [
      { key: "category", label: "Category", type: "select", required: true, options: ["OT Consumables", "ICU Consumables", "Lab Consumables", "General Medical Supplies"], section: "Item" },
      { key: "item_name", label: "Item Name", type: "text", required: true, section: "Item" },
      { key: "quantity", label: "Quantity", type: "number", required: true, section: "Stock" },
      { key: "supplier", label: "Supplier", type: "text", section: "Purchase" },
      { key: "purchase_date", label: "Purchase Date", type: "date", section: "Purchase" },
      { key: "issued_to", label: "Issued To", type: "text", section: "Issue" },
      { key: "consumption_area", label: "Consumption Area", type: "text", section: "Consumption" },
      notesField,
    ],
  },
];

export const phase2ModuleMap = new Map(
  phase2Modules.map((module) => [
    module.key,
    module,
  ])
);

export function getPhase2Module(
  key: string
) {
  return phase2ModuleMap.get(key);
}

export function titleForRecord(
  module: Phase2Module,
  data: Record<string, unknown>,
  lookupText: Record<string, string> = {}
) {
  const parts = module.titleFields
    .map((field) => {
      const value = data[field];
      return lookupText[field] || String(value || "").trim();
    })
    .filter(Boolean);

  return (
    parts.join(" | ") ||
    `${module.title} Record`
  );
}

