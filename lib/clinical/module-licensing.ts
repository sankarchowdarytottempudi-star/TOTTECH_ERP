export const CLINICAL_MODULE_CODES = [
  "PATIENTS",
  "APPOINTMENTS",
  "OP",
  "IP",
  "ER",
  "ICU",
  "OT",
  "IVF",
  "LAB",
  "RADIOLOGY",
  "PHARMACY",
  "INVENTORY",
  "PROCUREMENT",
  "BILLING",
  "INSURANCE",
  "REFERRAL",
  "FINANCE",
  "HR",
  "ANALYTICS",
  "AI",
] as const;

export type ClinicalModuleCode =
  (typeof CLINICAL_MODULE_CODES)[number];

export const CLINICAL_MODULE_LABELS: Record<
  ClinicalModuleCode,
  string
> = {
  PATIENTS: "Patients",
  APPOINTMENTS: "Appointments",
  OP: "Outpatient / Doctors",
  IP: "Inpatient",
  ER: "Emergency",
  ICU: "ICU",
  OT: "Operation Theatre",
  IVF: "IVF & Fertility",
  LAB: "Laboratory",
  RADIOLOGY: "Radiology",
  PHARMACY: "Pharmacy",
  INVENTORY: "Inventory",
  PROCUREMENT: "Procurement",
  BILLING: "Billing",
  INSURANCE: "Insurance",
  REFERRAL: "Referral",
  FINANCE: "Finance",
  HR: "HR",
  ANALYTICS: "Analytics",
  AI: "AI",
};

const normalized = (value: string) =>
  value.split("?")[0].split("#")[0].toLowerCase();

const pathRules: {
  includes?: string;
  startsWith?: string;
  moduleCode: ClinicalModuleCode;
}[] = [
  { startsWith: "/clinical-services/patients", moduleCode: "PATIENTS" },
  { startsWith: "/api/clinical/patients", moduleCode: "PATIENTS" },
  { startsWith: "/api/clinical/patient-lookup", moduleCode: "PATIENTS" },
  { startsWith: "/api/clinical/global-search", moduleCode: "PATIENTS" },
  { startsWith: "/clinical-services/patient-timeline", moduleCode: "PATIENTS" },

  { startsWith: "/clinical-services/appointments", moduleCode: "APPOINTMENTS" },
  { startsWith: "/api/clinical/appointments", moduleCode: "APPOINTMENTS" },

  { startsWith: "/clinical-services/doctors", moduleCode: "OP" },
  { startsWith: "/api/clinical/doctors", moduleCode: "OP" },
  { startsWith: "/clinical-services/operations", moduleCode: "OP" },
  { startsWith: "/api/clinical/operations/vitals", moduleCode: "OP" },

  { includes: "/hms/ip", moduleCode: "IP" },
  { includes: "/ip", moduleCode: "IP" },
  { includes: "/admission", moduleCode: "IP" },
  { includes: "/discharge", moduleCode: "IP" },
  { includes: "/bed", moduleCode: "IP" },
  { includes: "/ward", moduleCode: "IP" },
  { startsWith: "/api/clinical/operations/rooms", moduleCode: "IP" },

  { includes: "/hms/er", moduleCode: "ER" },
  { includes: "/emergency", moduleCode: "ER" },

  { includes: "/icu", moduleCode: "ICU" },
  { includes: "/ventilator", moduleCode: "ICU" },

  { includes: "/ot", moduleCode: "OT" },
  { startsWith: "/api/clinical/operations/ot-schedules", moduleCode: "OT" },

  { startsWith: "/clinical-services/ivf", moduleCode: "IVF" },
  { startsWith: "/api/clinical/ivf", moduleCode: "IVF" },

  { startsWith: "/clinical-services/laboratory", moduleCode: "LAB" },
  { startsWith: "/api/clinical/operations/lab", moduleCode: "LAB" },

  { startsWith: "/clinical-services/radiology", moduleCode: "RADIOLOGY" },
  { startsWith: "/api/clinical/radiology", moduleCode: "RADIOLOGY" },

  { startsWith: "/clinical-services/pharmacy", moduleCode: "PHARMACY" },
  { startsWith: "/api/clinical/pharmacy", moduleCode: "PHARMACY" },
  { startsWith: "/api/clinical/operations/medicines", moduleCode: "PHARMACY" },
  { startsWith: "/api/clinical/operations/pharmacy-dispense", moduleCode: "PHARMACY" },

  { includes: "/inventory", moduleCode: "INVENTORY" },
  { includes: "/stock", moduleCode: "INVENTORY" },
  { includes: "/warehouse", moduleCode: "INVENTORY" },
  { includes: "/asset", moduleCode: "INVENTORY" },

  { includes: "/procurement", moduleCode: "PROCUREMENT" },
  { includes: "/purchase", moduleCode: "PROCUREMENT" },
  { includes: "/grn", moduleCode: "PROCUREMENT" },

  { startsWith: "/api/clinical/billing", moduleCode: "BILLING" },
  { includes: "/billing", moduleCode: "BILLING" },
  { startsWith: "/api/clinical/operations/payments", moduleCode: "BILLING" },

  { includes: "/insurance", moduleCode: "INSURANCE" },
  { includes: "/claim", moduleCode: "INSURANCE" },
  { includes: "/preauth", moduleCode: "INSURANCE" },

  { includes: "/referral", moduleCode: "REFERRAL" },

  { startsWith: "/clinical-services/finance", moduleCode: "FINANCE" },
  { startsWith: "/api/clinical/finance", moduleCode: "FINANCE" },

  { startsWith: "/clinical-services/hr", moduleCode: "HR" },
  { startsWith: "/api/clinical/hr", moduleCode: "HR" },

  { startsWith: "/clinical-services/analytics", moduleCode: "ANALYTICS" },
  { startsWith: "/api/clinical/analytics", moduleCode: "ANALYTICS" },

  { startsWith: "/api/clinical/ai", moduleCode: "AI" },
  { includes: "/ai", moduleCode: "AI" },
];

export function moduleCodeForClinicalPath(
  path: string
): ClinicalModuleCode | null {
  const cleanPath = normalized(path);
  const rule = pathRules.find((item) => {
    if (item.startsWith && cleanPath.startsWith(item.startsWith)) {
      return true;
    }
    if (item.includes && cleanPath.includes(item.includes)) {
      return true;
    }
    return false;
  });

  return rule?.moduleCode ?? null;
}

export function isModuleLicensed(
  moduleCode: ClinicalModuleCode | null,
  licensedModules?: string[] | null
) {
  if (!moduleCode) {
    return true;
  }

  if (!Array.isArray(licensedModules) || licensedModules.length === 0) {
    return true;
  }

  return licensedModules.includes(moduleCode);
}
