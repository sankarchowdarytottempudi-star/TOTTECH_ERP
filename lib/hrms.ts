import { prisma } from "@/lib/prisma";

export const HRMS_MODULES = {
  "staff-directory": {
    key: "staff-directory",
    title: "Staff Master",
  },
  "leave-management": {
    key: "leave-management",
    title: "Leave Management",
  },
  lop: {
    key: "lop",
    title: "Loss Of Pay (LOP)",
  },
  payroll: {
    key: "payroll",
    title: "Salary Management",
  },
  increments: {
    key: "increments",
    title: "Increment Management",
  },
  payslips: {
    key: "payslips",
    title: "Pay Slip Generation",
  },
  approvals: {
    key: "approvals",
    title: "Approval Workflow",
  },
  pf: {
    key: "pf",
    title: "Provident Fund (PF)",
  },
} as const;

export type HrmsModuleKey =
  keyof typeof HRMS_MODULES;

export function cleanSchoolCode(
  code?: string | null
) {
  return String(code || "SCH")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12) || "SCH";
}

export function yearSuffix(
  date = new Date()
) {
  return String(date.getFullYear()).slice(-2);
}

export function monthYearLabel(
  month?: number | null,
  year?: number | null
) {
  if (!month || !year) {
    return "";
  }
  const label = new Date(year, month - 1, 1);
  return label.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export async function nextHrSequence(
  table: string,
  column: string,
  prefix: string
) {
  const rows =
    await prisma.$queryRawUnsafe<
      { max_seq: number | null }[]
    >(
      `
      SELECT COALESCE(
        MAX(
          NULLIF(
            regexp_replace(${column}, '^.*-([0-9]+)$', '\\1'),
            ${column}
          )::int
        ),
        0
      )::int AS max_seq
      FROM ${table}
      WHERE ${column} LIKE $1
      `,
      `${prefix}%`
    );

  return Number(rows[0]?.max_seq || 0) + 1;
}

export async function nextEmployeeId(
  schoolCode: string
) {
  const suffix = yearSuffix();
  const prefix = `${cleanSchoolCode(
    schoolCode
  )}-EMP-${suffix}-`;
  const seq = await nextHrSequence(
    "hr_staff_master",
    "employee_id",
    prefix
  );
  return `${prefix}${String(seq).padStart(
    5,
    "0"
  )}`;
}

export async function nextLeaveCode(
  schoolCode: string
) {
  const suffix = yearSuffix();
  const prefix = `${cleanSchoolCode(
    schoolCode
  )}-LV-${suffix}-`;
  const seq = await nextHrSequence(
    "hr_leave_requests",
    "id",
    prefix
  );
  return `${prefix}${String(seq).padStart(
    5,
    "0"
  )}`;
}

export function decimal(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Number(number.toFixed(2))
    : null;
}

export function asInt(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) &&
    Number.isInteger(number)
    ? number
    : null;
}

export function normalizeText(value: unknown) {
  return String(value || "").trim();
}

export function leaveDays(
  fromDate: string | Date,
  toDate: string | Date
) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diff =
    Math.max(
      0,
      Math.round(
        (to.getTime() - from.getTime()) /
          86400000
      )
    ) + 1;
  return diff;
}
