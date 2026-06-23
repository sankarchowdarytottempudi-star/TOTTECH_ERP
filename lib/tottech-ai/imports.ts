import { randomUUID } from "crypto";
import * as XLSX from "xlsx";

import { prisma } from "@/lib/prisma";

type ContextUser = {
  id?: number;
};

type PlatformImportContext = {
  schoolId?: number | null;
  academicYearId?: number | null;
  user?: ContextUser | null;
};

export type ImportScope =
  | "tottech-one"
  | "clinical-services";

type ImportSpec = {
  key: string;
  label: string;
  scope: ImportScope;
  table: string;
  required: string[];
  recommended?: string[];
  defaults?: Record<string, unknown>;
  context: "school" | "clinical";
};

type ColumnInfo = {
  column_name: string;
  data_type: string;
};

type ClinicalContext = {
  tenantId: number;
  hospitalId: number;
  branchId: number;
};

type RowError = {
  row: number;
  error: string;
};

export type AIImportResult = {
  ok: boolean;
  status:
    | "READY"
    | "NEEDS_COLUMNS"
    | "PARTIAL"
    | "COMPLETED"
    | "FAILED";
  scope: ImportScope;
  moduleName: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  failedRows: number;
  insertedRows: number;
  detectedColumns: string[];
  requiredColumns: string[];
  recommendedColumns: string[];
  missingColumns: string[];
  rowErrors: RowError[];
  sampleTemplate: Record<string, string>;
  message: string;
  job?: unknown;
};

const SCHOOL_SPECS: ImportSpec[] = [
  {
    key: "classes",
    label: "Classes",
    scope: "tottech-one",
    table: "classes",
    required: ["class_name"],
    recommended: ["class_teacher_id"],
    context: "school",
  },
  {
    key: "sections",
    label: "Sections",
    scope: "tottech-one",
    table: "sections",
    required: ["section_name", "class_name"],
    recommended: ["class_id"],
    context: "school",
  },
  {
    key: "subjects",
    label: "Subjects",
    scope: "tottech-one",
    table: "subjects",
    required: ["subject_name"],
    recommended: ["subject_code"],
    context: "school",
  },
  {
    key: "students",
    label: "Students",
    scope: "tottech-one",
    table: "students",
    required: ["name", "admission_number"],
    recommended: [
      "class_name",
      "section_name",
      "phone",
      "father_name",
      "mother_name",
    ],
    defaults: {
      is_active: true,
      status: "ACTIVE",
    },
    context: "school",
  },
  {
    key: "teachers",
    label: "Teachers",
    scope: "tottech-one",
    table: "teachers",
    required: ["first_name"],
    recommended: [
      "last_name",
      "phone",
      "email",
      "designation",
      "department",
    ],
    defaults: {
      is_active: true,
    },
    context: "school",
  },
  {
    key: "fee_categories",
    label: "Fee Categories",
    scope: "tottech-one",
    table: "fee_categories",
    required: ["fee_name", "amount"],
    recommended: ["frequency", "class_name", "section_name"],
    defaults: {
      is_active: true,
      frequency: "MONTHLY",
    },
    context: "school",
  },
  {
    key: "transport_routes",
    label: "Transport Routes",
    scope: "tottech-one",
    table: "transport_routes",
    required: ["route_name"],
    recommended: [
      "vehicle_number",
      "driver_name",
      "driver_phone",
    ],
    context: "school",
  },
  {
    key: "hostels",
    label: "Hostels",
    scope: "tottech-one",
    table: "hostels",
    required: ["hostel_name"],
    recommended: [
      "hostel_type",
      "warden_name",
      "warden_phone",
    ],
    context: "school",
  },
  {
    key: "dining_meal_plans",
    label: "Dining Meal Plans",
    scope: "tottech-one",
    table: "dining_meal_plans",
    required: ["plan_name", "meal_type", "price"],
    defaults: {
      status: "ACTIVE",
    },
    context: "school",
  },
  {
    key: "dining_weekly_menus",
    label: "Dining Weekly Menus",
    scope: "tottech-one",
    table: "dining_weekly_menus",
    required: ["week_start", "day_of_week", "meal_type", "menu_items"],
    recommended: ["nutrition_notes"],
    context: "school",
  },
];

const CLINICAL_SPECS: ImportSpec[] = [
  {
    key: "patients",
    label: "Patients",
    scope: "clinical-services",
    table: "patients",
    required: ["first_name", "phone"],
    recommended: [
      "last_name",
      "gender",
      "date_of_birth",
      "email",
      "address",
    ],
    defaults: {
      status: "ACTIVE",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "doctors",
    label: "Doctors",
    scope: "clinical-services",
    table: "doctors",
    required: ["full_name", "specialization"],
    recommended: ["phone", "email"],
    defaults: {
      status: "ACTIVE",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "appointments",
    label: "Appointments",
    scope: "clinical-services",
    table: "appointments",
    required: ["appointment_date", "patient_phone"],
    recommended: ["doctor_name", "start_time", "reason"],
    defaults: {
      status: "BOOKED",
      queue_status: "WAITING",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "op_visits",
    label: "OP Visits",
    scope: "clinical-services",
    table: "op_visits",
    required: ["patient_phone", "visit_date"],
    recommended: ["doctor_name", "chief_complaint", "diagnosis"],
    defaults: {
      status: "OPEN",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "ip_admissions",
    label: "IP Admissions",
    scope: "clinical-services",
    table: "ip_admissions",
    required: ["patient_phone", "admission_date"],
    recommended: ["doctor_name", "admission_reason", "diagnosis"],
    defaults: {
      status: "ADMITTED",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "lab_orders",
    label: "Lab Orders",
    scope: "clinical-services",
    table: "lab_orders",
    required: ["patient_phone", "order_type"],
    recommended: ["doctor_name", "priority", "notes"],
    defaults: {
      status: "ORDERED",
      priority: "ROUTINE",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "radiology_orders",
    label: "Radiology Orders",
    scope: "clinical-services",
    table: "radiology_orders",
    required: ["patient_phone", "study_type"],
    recommended: ["doctor_name", "priority", "clinical_notes"],
    defaults: {
      order_status: "ORDERED",
      priority: "ROUTINE",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "billing_invoices",
    label: "Billing Invoices",
    scope: "clinical-services",
    table: "billing_invoices",
    required: ["patient_phone", "total"],
    recommended: ["invoice_date", "discount", "tax", "paid_amount"],
    defaults: {
      status: "PENDING",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "insurance_claims",
    label: "Insurance Claims",
    scope: "clinical-services",
    table: "insurance_claims",
    required: ["patient_phone", "claim_number", "claimed_amount"],
    recommended: ["submission_date", "approved_amount", "status"],
    defaults: {
      status: "DRAFT",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "pharmacy_medicines",
    label: "Pharmacy Medicines",
    scope: "clinical-services",
    table: "pharmacy_medicines",
    required: ["generic_name", "brand_name"],
    recommended: ["strength", "form", "manufacturer", "reorder_level"],
    defaults: {
      status: "ACTIVE",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "pharmacy_inventory",
    label: "Pharmacy Inventory",
    scope: "clinical-services",
    table: "pharmacy_inventory",
    required: ["current_quantity"],
    recommended: ["medicine_id", "selling_price", "expiry_date"],
    defaults: {
      inventory_status: "AVAILABLE",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "ivf_couples",
    label: "IVF Couples",
    scope: "clinical-services",
    table: "ivf_couples",
    required: ["female_name", "male_name"],
    recommended: ["female_age", "male_age", "infertility_duration_months"],
    defaults: {
      status: "ACTIVE",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "ivf_cycles",
    label: "IVF Cycles",
    scope: "clinical-services",
    table: "ivf_cycles",
    required: ["cycle_number", "cycle_type"],
    recommended: ["start_date", "doctor_name", "status"],
    defaults: {
      status: "ACTIVE",
      is_deleted: false,
    },
    context: "clinical",
  },
  {
    key: "clinical_hr_employees",
    label: "Clinical HR Employees",
    scope: "clinical-services",
    table: "clinical_hr_employees",
    required: ["first_name", "mobile"],
    recommended: ["last_name", "email", "department", "designation"],
    defaults: {
      employee_status: "ACTIVE",
      is_deleted: false,
    },
    context: "clinical",
  },
];

export const IMPORT_SPECS = [
  ...SCHOOL_SPECS,
  ...CLINICAL_SPECS,
];

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const hasValue = (value: unknown) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== "";

const quoteIdentifier = (value: string) =>
  `"${value.replace(/"/g, '""')}"`;

const normalizeModule = (value: string) =>
  normalizeKey(value).replace(/-/g, "_");

const dateLikeTypes = new Set([
  "date",
  "timestamp without time zone",
  "timestamp with time zone",
]);

const numericTypes = new Set([
  "integer",
  "bigint",
  "numeric",
  "double precision",
  "real",
]);

function resolveSpec(
  scope: ImportScope,
  moduleName: string
) {
  const normalized =
    normalizeModule(moduleName);

  return IMPORT_SPECS.find(
    (spec) =>
      spec.scope === scope &&
      spec.key === normalized
  );
}

function normalizeRow(
  row: Record<string, unknown>
) {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeKey(key)] = value;
  }

  const aliasPairs: [string, string][] = [
    ["student_name", "name"],
    ["full_name", "name"],
    ["name", "full_name"],
    ["mobile", "phone"],
    ["phone", "mobile"],
    ["phone", "patient_phone"],
    ["class", "class_name"],
    ["section", "section_name"],
    ["admission_no", "admission_number"],
    ["admission_number", "admission_no"],
    ["patient_mobile", "patient_phone"],
    ["patient_phone", "phone"],
    ["doctor", "doctor_name"],
    ["consultant", "doctor_name"],
  ];

  for (const [from, to] of aliasPairs) {
    if (
      hasValue(normalized[from]) &&
      !hasValue(normalized[to])
    ) {
      normalized[to] = normalized[from];
    }
  }

  if (
    hasValue(normalized.name) &&
    !hasValue(normalized.first_name)
  ) {
    const [first, ...rest] = String(
      normalized.name
    )
      .trim()
      .split(/\s+/);
    normalized.first_name = first;
    if (!hasValue(normalized.last_name)) {
      normalized.last_name = rest.join(" ");
    }
  }

  if (
    hasValue(normalized.first_name) &&
    !hasValue(normalized.name)
  ) {
    normalized.name = [
      normalized.first_name,
      normalized.middle_name,
      normalized.last_name,
    ]
      .filter(hasValue)
      .join(" ");
  }

  if (
    hasValue(normalized.name) &&
    !hasValue(normalized.full_name)
  ) {
    normalized.full_name = normalized.name;
  }

  return normalized;
}

function parseWorksheet(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
  });
  const sheetName = workbook.SheetNames[0];
  const worksheet = sheetName
    ? workbook.Sheets[sheetName]
    : null;

  if (!worksheet) {
    return [];
  }

  return XLSX.utils
    .sheet_to_json<Record<string, unknown>>(
      worksheet,
      {
        defval: "",
      }
    )
    .map(normalizeRow);
}

async function getTableColumns(table: string) {
  return prisma.$queryRawUnsafe<ColumnInfo[]>(
    `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position
    `,
    table
  );
}

async function getClinicalContext(): Promise<ClinicalContext | null> {
  const rows =
    await prisma.$queryRawUnsafe<
      ClinicalContext[]
    >(
      `
      SELECT
        t.id AS "tenantId",
        h.id AS "hospitalId",
        b.id AS "branchId"
      FROM clinical_tenants t
      JOIN hospitals h ON h.tenant_id = t.id
        AND COALESCE(h.is_deleted, false) = false
      JOIN branches b ON b.tenant_id = t.id
        AND b.hospital_id = h.id
        AND COALESCE(b.is_deleted, false) = false
      WHERE COALESCE(t.is_deleted, false) = false
      ORDER BY t.id, h.id, b.id
      LIMIT 1
      `
    );

  return rows[0] ?? null;
}

async function getAcademicYearName(
  academicYearId: number | null | undefined
) {
  if (!academicYearId) {
    return null;
  }

  const rows =
    await prisma.$queryRawUnsafe<
      { academic_year: string }[]
    >(
      `
      SELECT academic_year
      FROM academic_years
      WHERE id = $1
      LIMIT 1
      `,
      academicYearId
    );

  return rows[0]?.academic_year ?? null;
}

function parseCellValue(
  value: unknown,
  dataType: string,
  columnName: string
) {
  if (!hasValue(value)) {
    return null;
  }

  if (value instanceof Date) {
    return dateLikeTypes.has(dataType)
      ? value.toISOString()
      : value.toISOString();
  }

  if (
    typeof value === "number" &&
    dateLikeTypes.has(dataType)
  ) {
    const parsed =
      XLSX.SSF.parse_date_code(value);
    if (parsed) {
      return new Date(
        Date.UTC(
          parsed.y,
          parsed.m - 1,
          parsed.d,
          parsed.H || 0,
          parsed.M || 0,
          Math.floor(parsed.S || 0)
        )
      ).toISOString();
    }
  }

  if (dataType === "boolean") {
    const normalized = String(value)
      .trim()
      .toLowerCase();
    return [
      "true",
      "yes",
      "y",
      "1",
      "active",
    ].includes(normalized);
  }

  if (numericTypes.has(dataType)) {
    const number =
      typeof value === "number"
        ? value
        : Number(String(value).replace(/,/g, ""));
    return Number.isFinite(number)
      ? number
      : null;
  }

  if (dataType === "jsonb") {
    if (
      typeof value === "object" &&
      value !== null
    ) {
      return JSON.stringify(value);
    }

    const text = String(value).trim();
    if (!text) {
      return null;
    }

    try {
      return JSON.stringify(JSON.parse(text));
    } catch {
      if (columnName === "menu_items") {
        return JSON.stringify(
          text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        );
      }
      return JSON.stringify({
        value: text,
      });
    }
  }

  return String(value).trim();
}

async function resolveClassId(
  row: Record<string, unknown>,
  schoolId: number,
  academicYearId: number
) {
  if (hasValue(row.class_id)) {
    return Number(row.class_id);
  }

  if (!hasValue(row.class_name)) {
    return null;
  }

  const rows =
    await prisma.$queryRawUnsafe<{ id: number }[]>(
      `
      SELECT id
      FROM classes
      WHERE school_id = $1
        AND academic_year_id = $2
        AND lower(class_name) = lower($3)
      ORDER BY id DESC
      LIMIT 1
      `,
      schoolId,
      academicYearId,
      String(row.class_name)
    );

  return rows[0]?.id ?? null;
}

async function resolveSectionId(
  row: Record<string, unknown>,
  schoolId: number,
  academicYearId: number,
  classId: number | null
) {
  if (hasValue(row.section_id)) {
    return Number(row.section_id);
  }

  if (
    !classId ||
    !hasValue(row.section_name)
  ) {
    return null;
  }

  const rows =
    await prisma.$queryRawUnsafe<{ id: number }[]>(
      `
      SELECT id
      FROM sections
      WHERE school_id = $1
        AND academic_year_id = $2
        AND class_id = $3
        AND lower(section_name) = lower($4)
      ORDER BY id DESC
      LIMIT 1
      `,
      schoolId,
      academicYearId,
      classId,
      String(row.section_name)
    );

  return rows[0]?.id ?? null;
}

async function resolveStudentId(
  row: Record<string, unknown>,
  schoolId: number,
  academicYearId: number
) {
  if (hasValue(row.student_id)) {
    return Number(row.student_id);
  }

  const admission =
    row.admission_number ||
    row.student_admission_number;
  const phone =
    row.student_phone ||
    row.phone;

  const rows =
    await prisma.$queryRawUnsafe<{ id: number }[]>(
      `
      SELECT id
      FROM students
      WHERE school_id = $1
        AND academic_year_id = $2
        AND (
          ($3::text IS NOT NULL AND admission_number = $3::text)
          OR ($4::text IS NOT NULL AND phone = $4::text)
          OR ($5::text IS NOT NULL AND lower(name) = lower($5::text))
        )
      ORDER BY id DESC
      LIMIT 1
      `,
      schoolId,
      academicYearId,
      hasValue(admission)
        ? String(admission)
        : null,
      hasValue(phone) ? String(phone) : null,
      hasValue(row.student_name)
        ? String(row.student_name)
        : null
    );

  return rows[0]?.id ?? null;
}

async function resolvePatientId(
  row: Record<string, unknown>,
  context: ClinicalContext
) {
  if (hasValue(row.patient_id)) {
    return Number(row.patient_id);
  }

  const phone =
    row.patient_phone ||
    row.phone ||
    row.mobile;
  const uhid =
    row.uhid || row.patient_uid;

  const rows =
    await prisma.$queryRawUnsafe<{ id: number }[]>(
      `
      SELECT id
      FROM patients
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted, false) = false
        AND (
          ($4::text IS NOT NULL AND phone = $4::text)
          OR ($5::text IS NOT NULL AND uhid = $5::text)
          OR ($5::text IS NOT NULL AND patient_uid = $5::text)
        )
      ORDER BY id DESC
      LIMIT 1
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      hasValue(phone) ? String(phone) : null,
      hasValue(uhid) ? String(uhid) : null
    );

  return rows[0]?.id ?? null;
}

async function resolveDoctorId(
  row: Record<string, unknown>,
  context: ClinicalContext
) {
  if (hasValue(row.doctor_id)) {
    return Number(row.doctor_id);
  }

  if (!hasValue(row.doctor_name)) {
    return null;
  }

  const rows =
    await prisma.$queryRawUnsafe<{ id: number }[]>(
      `
      SELECT id
      FROM doctors
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted, false) = false
        AND lower(full_name) = lower($4)
      ORDER BY id DESC
      LIMIT 1
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      String(row.doctor_name)
    );

  return rows[0]?.id ?? null;
}

function missingColumnsFor(
  spec: ImportSpec,
  rows: Record<string, unknown>[],
  contextMissing: string[]
) {
  const detected = new Set(
    rows.flatMap((row) => Object.keys(row))
  );
  const missing = spec.required.filter(
    (column) => !detected.has(column)
  );

  return [...missing, ...contextMissing];
}

function sampleTemplate(spec: ImportSpec) {
  return [
    ...spec.required,
    ...(spec.recommended ?? []),
  ].reduce<Record<string, string>>(
    (template, column) => {
      template[column] = "";
      return template;
    },
    {}
  );
}

async function prepareRow({
  spec,
  row,
  platformContext,
  clinicalContext,
  columns,
}: {
  spec: ImportSpec;
  row: Record<string, unknown>;
  platformContext: PlatformImportContext;
  clinicalContext: ClinicalContext | null;
  columns: ColumnInfo[];
}) {
  const output: Record<string, unknown> = {
    ...(spec.defaults ?? {}),
    ...row,
  };
  const userId =
    platformContext.user?.id ?? null;

  if (spec.context === "school") {
    const schoolId =
      Number(platformContext.schoolId) || null;
    const academicYearId =
      Number(platformContext.academicYearId) ||
      null;

    if (!schoolId || !academicYearId) {
      throw new Error(
        "Select school/college and academic year before importing this sheet."
      );
    }

    output.school_id = schoolId;
    output.academic_year_id = academicYearId;
    output.created_by = userId;
    output.updated_by = userId;
    output.created_at = new Date();
    output.updated_at = new Date();

    const academicYear =
      await getAcademicYearName(
        academicYearId
      );
    if (academicYear) {
      output.academic_year = academicYear;
    }

    const classId =
      await resolveClassId(
        row,
        schoolId,
        academicYearId
      );

    if (
      spec.key === "sections" &&
      !classId
    ) {
      throw new Error(
        "Class not found. Create/import classes first or provide class_id."
      );
    }

    if (classId) {
      if (
        columns.some(
          (column) =>
            column.column_name === "class_id"
        )
      ) {
        output.class_id = classId;
      }
      if (
        columns.some(
          (column) =>
            column.column_name ===
            "current_class_id"
        )
      ) {
        output.current_class_id =
          classId;
      }
    }

    const sectionId =
      await resolveSectionId(
        row,
        schoolId,
        academicYearId,
        classId
      );
    if (sectionId) {
      if (
        columns.some(
          (column) =>
            column.column_name === "section_id"
        )
      ) {
        output.section_id = sectionId;
      }
      if (
        columns.some(
          (column) =>
            column.column_name ===
            "current_section_id"
        )
      ) {
        output.current_section_id =
          sectionId;
      }
    }

    const studentId =
      await resolveStudentId(
        row,
        schoolId,
        academicYearId
      );
    if (
      studentId &&
      columns.some(
        (column) =>
          column.column_name === "student_id"
      )
    ) {
      output.student_id = studentId;
    }

    if (
      spec.key === "students" &&
      !hasValue(output.enrollment_number)
    ) {
      output.enrollment_number =
        row.enrollment_number ??
        row.admission_number;
    }
  } else if (spec.context === "clinical") {
    if (!clinicalContext) {
      throw new Error(
        "Clinical tenant, hospital, and branch setup is missing."
      );
    }

    output.tenant_id =
      clinicalContext.tenantId;
    output.hospital_id =
      clinicalContext.hospitalId;
    output.branch_id =
      clinicalContext.branchId;
    output.created_by = userId;
    output.updated_by = userId;
    output.created_at = new Date();
    output.updated_at = new Date();

    const patientId =
      await resolvePatientId(
        row,
        clinicalContext
      );
    if (
      patientId &&
      columns.some(
        (column) =>
          column.column_name === "patient_id"
      )
    ) {
      output.patient_id = patientId;
    }

    const doctorId =
      await resolveDoctorId(
        row,
        clinicalContext
      );
    if (
      doctorId &&
      columns.some(
        (column) =>
          [
            "doctor_id",
            "consultant_id",
          ].includes(column.column_name)
      )
    ) {
      output.doctor_id = doctorId;
      output.consultant_id = doctorId;
    }

    if (
      spec.key === "patients" &&
      !hasValue(output.patient_uid)
    ) {
      const suffix = Date.now()
        .toString()
        .slice(-8);
      output.patient_uid = `PT-${suffix}`;
      output.uhid =
        output.uhid ?? output.patient_uid;
    }

    if (
      spec.key === "doctors" &&
      !hasValue(output.doctor_uid)
    ) {
      output.doctor_uid = `DR-${Date.now()
        .toString()
        .slice(-8)}`;
    }

    if (
      spec.key ===
        "clinical_hr_employees" &&
      !hasValue(output.id)
    ) {
      output.id = randomUUID();
    }
  }

  return output;
}

async function insertRow(
  spec: ImportSpec,
  row: Record<string, unknown>,
  columns: ColumnInfo[]
) {
  const columnMap = new Map(
    columns.map((column) => [
      column.column_name,
      column,
    ])
  );

  const writable = Object.entries(row)
    .filter(([key, value]) => {
      if (!columnMap.has(key)) {
        return false;
      }
      if (
        key === "id" &&
        spec.key !==
          "clinical_hr_employees"
      ) {
        return false;
      }
      return value !== undefined;
    })
    .map(([key, value]) => {
      const column = columnMap.get(key)!;
      return [
        key,
        parseCellValue(
          value,
          column.data_type,
          key
        ),
      ] as [string, unknown];
    })
    .filter(([, value]) => value !== undefined);

  if (!writable.length) {
    throw new Error(
      "No matching database columns found for this row."
    );
  }

  const columnSql = writable
    .map(([key]) => quoteIdentifier(key))
    .join(", ");
  const paramSql = writable
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO ${quoteIdentifier(spec.table)}
      (${columnSql})
    VALUES (${paramSql})
    `,
    ...writable.map(([, value]) => value)
  );
}

export async function runTottechAIImport({
  scope,
  moduleName,
  fileName,
  buffer,
  commit,
  platformContext,
}: {
  scope: ImportScope;
  moduleName: string;
  fileName: string;
  buffer: ArrayBuffer;
  commit: boolean;
  platformContext: PlatformImportContext;
}): Promise<AIImportResult> {
  const spec = resolveSpec(scope, moduleName);

  if (!spec) {
    const supported = IMPORT_SPECS.filter(
      (item) => item.scope === scope
    )
      .map((item) => item.key)
      .join(", ");

    return {
      ok: false,
      status: "FAILED",
      scope,
      moduleName,
      fileName,
      totalRows: 0,
      validRows: 0,
      failedRows: 0,
      insertedRows: 0,
      detectedColumns: [],
      requiredColumns: [],
      recommendedColumns: [],
      missingColumns: [],
      rowErrors: [],
      sampleTemplate: {},
      message: `Unsupported import module. Supported ${scope} modules: ${supported}.`,
    };
  }

  const rows = parseWorksheet(buffer);
  const detectedColumns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  ).sort();
  const clinicalContext =
    spec.context === "clinical"
      ? await getClinicalContext()
      : null;
  const contextMissing =
    spec.context === "school"
      ? [
          !platformContext.schoolId
            ? "selected_school_id"
            : "",
          !platformContext.academicYearId
            ? "selected_academic_year_id"
            : "",
        ].filter(Boolean)
      : !clinicalContext
        ? [
            "clinical_tenant_id",
            "hospital_id",
            "branch_id",
          ]
        : [];
  const missingColumns =
    missingColumnsFor(
      spec,
      rows,
      contextMissing
    );

  if (!rows.length || missingColumns.length) {
    const job =
      await prisma.import_jobs.create({
        data: {
          school_id:
            platformContext.schoolId ?? null,
          module_name: `${scope}:${spec.key}`,
          status: "NEEDS_COLUMNS",
          file_name: fileName,
          total_rows: rows.length,
          success_rows: 0,
          failed_rows: rows.length,
          error_summary:
            missingColumns.length
              ? `Missing required fields: ${missingColumns.join(", ")}`
              : "The workbook does not contain any rows.",
          metadata: {
            detectedColumns,
            requiredColumns:
              spec.required,
            recommendedColumns:
              spec.recommended ?? [],
            sampleTemplate:
              sampleTemplate(spec),
          },
          created_by:
            platformContext.user?.id ?? null,
        },
      });

    return {
      ok: false,
      status: "NEEDS_COLUMNS",
      scope,
      moduleName: spec.key,
      fileName,
      totalRows: rows.length,
      validRows: 0,
      failedRows: rows.length,
      insertedRows: 0,
      detectedColumns,
      requiredColumns: spec.required,
      recommendedColumns:
        spec.recommended ?? [],
      missingColumns,
      rowErrors: [],
      sampleTemplate: sampleTemplate(spec),
      message: missingColumns.length
        ? `Update the Excel file with these required fields: ${missingColumns.join(", ")}. Then upload again.`
        : "The workbook is empty. Add rows and upload again.",
      job,
    };
  }

  const columns =
    await getTableColumns(spec.table);
  const rowErrors: RowError[] = [];
  const preparedRows: Record<
    string,
    unknown
  >[] = [];

  for (const [index, row] of rows.entries()) {
    const missingRequired =
      spec.required.filter(
        (column) => !hasValue(row[column])
      );

    if (missingRequired.length) {
      rowErrors.push({
        row: index + 2,
        error: `Missing value for ${missingRequired.join(", ")}`,
      });
      continue;
    }

    try {
      preparedRows.push(
        await prepareRow({
          spec,
          row,
          platformContext,
          clinicalContext,
          columns,
        })
      );
    } catch (error) {
      rowErrors.push({
        row: index + 2,
        error:
          error instanceof Error
            ? error.message
            : "Row validation failed",
      });
    }
  }

  if (!commit) {
    const job =
      await prisma.import_jobs.create({
        data: {
          school_id:
            platformContext.schoolId ?? null,
          module_name: `${scope}:${spec.key}`,
          status: rowErrors.length
            ? "PARTIAL"
            : "READY",
          file_name: fileName,
          total_rows: rows.length,
          success_rows:
            preparedRows.length,
          failed_rows: rowErrors.length,
          error_summary:
            rowErrors
              .slice(0, 5)
              .map(
                (item) =>
                  `Row ${item.row}: ${item.error}`
              )
              .join("; ") || null,
          metadata: {
            detectedColumns,
            requiredColumns:
              spec.required,
            recommendedColumns:
              spec.recommended ?? [],
            rowErrors,
            sampleTemplate:
              sampleTemplate(spec),
          },
          created_by:
            platformContext.user?.id ?? null,
        },
      });

    return {
      ok: !rowErrors.length,
      status: rowErrors.length
        ? "PARTIAL"
        : "READY",
      scope,
      moduleName: spec.key,
      fileName,
      totalRows: rows.length,
      validRows: preparedRows.length,
      failedRows: rowErrors.length,
      insertedRows: 0,
      detectedColumns,
      requiredColumns: spec.required,
      recommendedColumns:
        spec.recommended ?? [],
      missingColumns: [],
      rowErrors: rowErrors.slice(0, 25),
      sampleTemplate: sampleTemplate(spec),
      message: rowErrors.length
        ? "I found row-level issues. Fix those rows before loading, or upload a corrected workbook."
        : "The Excel file is ready. Choose Load valid rows to write it to the database.",
      job,
    };
  }

  let insertedRows = 0;

  for (const row of preparedRows) {
    await insertRow(spec, row, columns);
    insertedRows += 1;
  }

  const job =
    await prisma.import_jobs.create({
      data: {
        school_id:
          platformContext.schoolId ?? null,
        module_name: `${scope}:${spec.key}`,
        status: rowErrors.length
          ? "PARTIAL"
          : "COMPLETED",
        file_name: fileName,
        total_rows: rows.length,
        success_rows: insertedRows,
        failed_rows: rowErrors.length,
        error_summary:
          rowErrors
            .slice(0, 5)
            .map(
              (item) =>
                `Row ${item.row}: ${item.error}`
            )
            .join("; ") || null,
        metadata: {
          detectedColumns,
          requiredColumns: spec.required,
          recommendedColumns:
            spec.recommended ?? [],
          rowErrors,
        },
        created_by:
          platformContext.user?.id ?? null,
      },
    });

  return {
    ok: !rowErrors.length,
    status: rowErrors.length
      ? "PARTIAL"
      : "COMPLETED",
    scope,
    moduleName: spec.key,
    fileName,
    totalRows: rows.length,
    validRows: preparedRows.length,
    failedRows: rowErrors.length,
    insertedRows,
    detectedColumns,
    requiredColumns: spec.required,
    recommendedColumns:
      spec.recommended ?? [],
    missingColumns: [],
    rowErrors: rowErrors.slice(0, 25),
    sampleTemplate: sampleTemplate(spec),
    message: rowErrors.length
      ? `Loaded ${insertedRows} valid rows. ${rowErrors.length} rows need correction.`
      : `Loaded ${insertedRows} rows into ${spec.label}.`,
    job,
  };
}
