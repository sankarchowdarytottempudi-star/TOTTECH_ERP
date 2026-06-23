import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isSuperAdminRole,
} from "@/lib/school-access";

export const MODULE_KEYS = [
  "STUDENTS",
  "TEACHERS",
  "ACADEMICS",
  "FINANCE",
  "OPERATIONS",
  "DINING",
  "TRANSPORT",
  "HOSTEL",
  "REPORTS",
  "ANALYTICS",
  "AI",
  "USER_MANAGEMENT",
  "PARENT_PORTAL",
  "MOBILE_APP",
] as const;

export type SchoolModuleKey =
  (typeof MODULE_KEYS)[number];

export const USER_MODULE_KEYS = [
  "STUDENTS",
  "TEACHERS",
  "ACADEMICS",
  "CLASSES",
  "SECTIONS",
  "SUBJECTS",
  "SYLLABUS",
  "ATTENDANCE",
  "HOMEWORK",
  "EXAM_SCHEDULE",
  "EXAMS",
  "QUESTION_BANK",
  "QUESTION_PAPERS",
  "MARKS_ENTRY",
  "STUDENT_360",
  "TEACHER_360",
  "SCHOOL_360",
  "FINANCE",
  "FEES",
  "CONCESSIONS",
  "INVOICES",
  "PAYMENTS",
  "EXPENSES",
  "EXPENSE_VOUCHERS",
  "RECEIPTS",
  "DINING",
  "TRANSPORT",
  "HOSTEL",
  "OPERATIONS",
  "PF",
  "CREDENTIALING",
  "LMS",
  "CME",
  "TRAINING",
  "PERFORMANCE",
  "RECRUITMENT",
  "PAYROLL",
  "INCREMENTS",
  "PAYSLIPS",
  "REPORTS",
  "ANALYTICS",
  "GOVERNANCE",
  "WAR_ROOM",
  "TOTTECH_AI",
  "SCHOOLGPT",
  "SETTINGS",
  "USER_MANAGEMENT",
  "PARENT_PORTAL",
  "MOBILE_APP",
] as const;

export type UserModuleKey =
  (typeof USER_MODULE_KEYS)[number];

export function parentSchoolModuleForUserKey(
  key: string
): SchoolModuleKey | null {
  const normalized = String(key || "")
    .trim()
    .toUpperCase();

  switch (normalized) {
    case "STUDENTS":
    case "TEACHERS":
    case "STUDENT_360":
    case "TEACHER_360":
      return normalized as SchoolModuleKey;
    case "CLASSES":
    case "SECTIONS":
    case "SUBJECTS":
    case "SYLLABUS":
    case "HOMEWORK":
    case "EXAM_SCHEDULE":
    case "EXAMS":
    case "QUESTION_BANK":
    case "QUESTION_PAPERS":
    case "MARKS_ENTRY":
      return "ACADEMICS";
    case "ATTENDANCE":
    case "DINING":
    case "TRANSPORT":
    case "HOSTEL":
      return "OPERATIONS";
    case "FINANCE":
    case "FEES":
    case "CONCESSIONS":
    case "INVOICES":
    case "PAYMENTS":
    case "EXPENSES":
    case "EXPENSE_VOUCHERS":
    case "RECEIPTS":
      return "FINANCE";
    case "REPORTS":
      return "REPORTS";
    case "ANALYTICS":
      return "ANALYTICS";
    case "TOTTECH_AI":
    case "SCHOOLGPT":
      return "AI";
    case "USER_MANAGEMENT":
    case "SETTINGS":
    case "PF":
    case "CREDENTIALING":
    case "LMS":
    case "CME":
    case "TRAINING":
    case "PERFORMANCE":
    case "RECRUITMENT":
    case "PAYROLL":
    case "INCREMENTS":
    case "PAYSLIPS":
      return "USER_MANAGEMENT";
    case "PARENT_PORTAL":
      return "PARENT_PORTAL";
    case "MOBILE_APP":
      return "MOBILE_APP";
    case "OPERATIONS":
      return "OPERATIONS";
    case "GOVERNANCE":
    case "WAR_ROOM":
      return "ANALYTICS";
    default:
      return (MODULE_KEYS as readonly string[]).includes(
        normalized
      )
        ? (normalized as SchoolModuleKey)
        : null;
  }
}

export function schoolAllowsUserKey(
  schoolAccess: Record<string, boolean>,
  key: string
) {
  const parent =
    parentSchoolModuleForUserKey(key);

  if (!parent) {
    return true;
  }

  return schoolAccess[parent] !== false;
}

export const USER_MODULE_MASTER = [
  { module_key: "STUDENTS", module_name: "Students", category: "Academics", sort_order: 1 },
  { module_key: "TEACHERS", module_name: "Teachers", category: "Academics", sort_order: 2 },
  { module_key: "ACADEMICS", module_name: "Academics", category: "Academics", sort_order: 3 },
  { module_key: "CLASSES", module_name: "Classes", category: "Academics", sort_order: 4 },
  { module_key: "SECTIONS", module_name: "Sections", category: "Academics", sort_order: 5 },
  { module_key: "SUBJECTS", module_name: "Subjects", category: "Academics", sort_order: 6 },
  { module_key: "SYLLABUS", module_name: "Syllabus", category: "Academics", sort_order: 7 },
  { module_key: "ATTENDANCE", module_name: "Attendance", category: "Operations", sort_order: 8 },
  { module_key: "HOMEWORK", module_name: "Homework", category: "Academics", sort_order: 9 },
  { module_key: "EXAM_SCHEDULE", module_name: "Exam Schedule", category: "Academics", sort_order: 10 },
  { module_key: "EXAMS", module_name: "Exams", category: "Academics", sort_order: 11 },
  { module_key: "QUESTION_BANK", module_name: "Question Bank", category: "Academics", sort_order: 12 },
  { module_key: "QUESTION_PAPERS", module_name: "Question Papers", category: "Academics", sort_order: 13 },
  { module_key: "MARKS_ENTRY", module_name: "Marks Entry", category: "Academics", sort_order: 14 },
  { module_key: "STUDENT_360", module_name: "Student 360", category: "Insights", sort_order: 15 },
  { module_key: "TEACHER_360", module_name: "Teacher 360", category: "Insights", sort_order: 16 },
  { module_key: "SCHOOL_360", module_name: "School/College 360", category: "Insights", sort_order: 17 },
  { module_key: "FINANCE", module_name: "Finance", category: "Finance", sort_order: 18 },
  { module_key: "FEES", module_name: "Fees", category: "Finance", sort_order: 19 },
  { module_key: "CONCESSIONS", module_name: "Concessions", category: "Finance", sort_order: 20 },
  { module_key: "INVOICES", module_name: "Invoices", category: "Finance", sort_order: 21 },
  { module_key: "PAYMENTS", module_name: "Payments", category: "Finance", sort_order: 22 },
  { module_key: "EXPENSES", module_name: "Expenses", category: "Finance", sort_order: 23 },
  { module_key: "EXPENSE_VOUCHERS", module_name: "Expense Vouchers", category: "Finance", sort_order: 24 },
  { module_key: "RECEIPTS", module_name: "Receipts", category: "Finance", sort_order: 25 },
  { module_key: "DINING", module_name: "Dining", category: "Operations", sort_order: 26 },
  { module_key: "TRANSPORT", module_name: "Transport", category: "Operations", sort_order: 27 },
  { module_key: "HOSTEL", module_name: "Hostel", category: "Operations", sort_order: 28 },
  { module_key: "OPERATIONS", module_name: "Operations", category: "Operations", sort_order: 29 },
  { module_key: "PF", module_name: "Provident Fund (PF)", category: "HR", sort_order: 30 },
  { module_key: "CREDENTIALING", module_name: "Credentialing", category: "HR", sort_order: 31 },
  { module_key: "LMS", module_name: "LMS", category: "HR", sort_order: 32 },
  { module_key: "CME", module_name: "CME", category: "HR", sort_order: 33 },
  { module_key: "TRAINING", module_name: "Training", category: "HR", sort_order: 34 },
  { module_key: "PERFORMANCE", module_name: "Performance", category: "HR", sort_order: 35 },
  { module_key: "RECRUITMENT", module_name: "Recruitment", category: "HR", sort_order: 36 },
  { module_key: "PAYROLL", module_name: "Payroll", category: "HR", sort_order: 37 },
  { module_key: "INCREMENTS", module_name: "Increments", category: "HR", sort_order: 38 },
  { module_key: "PAYSLIPS", module_name: "Pay Slips", category: "HR", sort_order: 39 },
  { module_key: "REPORTS", module_name: "Reports", category: "Governance", sort_order: 40 },
  { module_key: "ANALYTICS", module_name: "Analytics", category: "Governance", sort_order: 41 },
  { module_key: "GOVERNANCE", module_name: "Governance", category: "Governance", sort_order: 42 },
  { module_key: "WAR_ROOM", module_name: "War Room", category: "Governance", sort_order: 43 },
  { module_key: "TOTTECH_AI", module_name: "TOTTECH AI", category: "AI", sort_order: 44 },
  { module_key: "SCHOOLGPT", module_name: "SchoolGPT", category: "AI", sort_order: 45 },
  { module_key: "SETTINGS", module_name: "Settings", category: "Administration", sort_order: 46 },
  { module_key: "USER_MANAGEMENT", module_name: "User Management", category: "Administration", sort_order: 47 },
  { module_key: "PARENT_PORTAL", module_name: "Parent Portal", category: "Parent", sort_order: 48 },
  { module_key: "MOBILE_APP", module_name: "Mobile App", category: "Platform", sort_order: 49 },
] as const;

export const PLAN_DEFAULTS: Record<
  string,
  SchoolModuleKey[]
> = {
  STARTER: [
    "STUDENTS",
    "TEACHERS",
    "ACADEMICS",
  ],
  PROFESSIONAL: [
    "STUDENTS",
    "TEACHERS",
    "ACADEMICS",
    "FINANCE",
    "OPERATIONS",
    "REPORTS",
  ],
  ENTERPRISE: [...MODULE_KEYS],
  CUSTOM: [
    "STUDENTS",
    "TEACHERS",
    "ACADEMICS",
  ],
};

export function normalizeModuleKey(
  value: unknown
): SchoolModuleKey | null {
  const key = String(value || "")
    .trim()
    .toUpperCase();

  return (MODULE_KEYS as readonly string[]).includes(key)
    ? (key as SchoolModuleKey)
    : null;
}

export function modulesForPlan(
  plan?: string | null
) {
  const normalized = String(plan || "STARTER")
    .trim()
    .toUpperCase();

  return (
    PLAN_DEFAULTS[normalized] ||
    PLAN_DEFAULTS.STARTER
  );
}

export function moduleAccessSnapshot(
  rows: Array<{
    module_key: string | null;
    enabled: boolean | null;
  }>
) {
  const enabled = new Set(
    rows
      .filter((row) => row.enabled)
      .map((row) =>
        String(row.module_key || "").toUpperCase()
      )
  );

  return MODULE_KEYS.reduce(
    (output, key) => ({
      ...output,
      [key]: enabled.has(key),
    }),
    {} as Record<SchoolModuleKey, boolean>
  );
}

export function userModuleAccessSnapshot(
  rows: Array<{
    module_key: string | null;
    enabled: boolean | null;
  }>
) {
  const enabled = new Set(
    rows
      .filter((row) => row.enabled)
      .map((row) => String(row.module_key || "").toUpperCase())
  );

  return USER_MODULE_KEYS.reduce(
    (output, key) => ({
      ...output,
      [key]: enabled.has(key),
    }),
    {} as Record<UserModuleKey, boolean>
  );
}

export async function ensureSchoolModuleRows(
  schoolId: number,
  plan?: string | null,
  enabledBy?: number | null
) {
  const enabledModules = new Set(
    modulesForPlan(plan)
  );

  await prisma.$transaction(
    MODULE_KEYS.map((moduleKey) =>
      prisma.school_module_access.upsert({
        where: {
          school_id_module_key: {
            school_id: schoolId,
            module_key: moduleKey,
          },
        },
        create: {
          school_id: schoolId,
          module_key: moduleKey,
          enabled: enabledModules.has(moduleKey),
          enabled_by: enabledBy ?? null,
          enabled_at: enabledModules.has(moduleKey)
            ? new Date()
            : null,
        },
        update: {},
      })
    )
  );
}

export async function getSchoolModuleAccess(
  schoolId?: number | null
) {
  if (!schoolId) {
    return moduleAccessSnapshot(
      MODULE_KEYS.map((moduleKey) => ({
        module_key: moduleKey,
        enabled: true,
      }))
    );
  }

  const school =
    await prisma.schools.findUnique({
      where: {
        id: Number(schoolId),
      },
      select: {
        id: true,
        subscription_plan: true,
      },
    });

  if (!school) {
    return moduleAccessSnapshot([]);
  }

  await ensureSchoolModuleRows(
    school.id,
    school.subscription_plan
  );

  const rows =
    await prisma.school_module_access.findMany({
      where: {
        school_id: school.id,
      },
      select: {
        module_key: true,
        enabled: true,
      },
    });

  return moduleAccessSnapshot(rows);
}

export async function ensureUserModuleMasterRows() {
  await Promise.all(
    USER_MODULE_MASTER.map((module) =>
      prisma.module_master.upsert({
        where: {
          module_key: module.module_key,
        },
        create: {
          module_key: module.module_key,
          module_name: module.module_name,
          category: module.category,
          sort_order: module.sort_order,
          is_active: true,
        },
        update: {
          module_name: module.module_name,
          category: module.category,
          sort_order: module.sort_order,
          is_active: true,
        },
      })
    )
  );
}

export async function getUserModuleAccess(
  userId?: number | null,
  schoolId?: number | null
) {
  if (!userId || !schoolId) {
    return userModuleAccessSnapshot(
      USER_MODULE_MASTER.map((module) => ({
        module_key: module.module_key,
        enabled: true,
      }))
    );
  }

  await ensureUserModuleMasterRows();

  const schoolAccess = await getSchoolModuleAccess(schoolId);
  const rows = await prisma.user_module_access.findMany({
    where: {
      user_id: Number(userId),
      school_id: Number(schoolId),
      is_active: true,
      module_master: {
        is_active: true,
      },
    },
    select: {
      is_active: true,
      module_master: {
        select: {
          module_key: true,
        },
      },
    },
  });

  const enabled = new Set(
    rows
      .filter((row) => row.is_active)
      .map((row) =>
        String(
          row.module_master?.module_key || ""
        ).toUpperCase()
      )
  );

  return USER_MODULE_KEYS.reduce(
    (output, key) => ({
      ...output,
      [key]:
        !rows.length
          ? schoolAllowsUserKey(
              schoolAccess,
              key
            )
          : enabled.has(key) &&
            schoolAllowsUserKey(
              schoolAccess,
              key
            ),
    }),
    {} as Record<string, boolean>
  );
}

export async function replaceUserModuleAccess(input: {
  userId: number;
  schoolId: number;
  moduleKeys: string[];
  createdBy?: number | null;
}) {
  await ensureUserModuleMasterRows();
  const keys = Array.from(new Set(input.moduleKeys.map((item) => String(item || "").trim().toUpperCase()).filter(Boolean)));
  const masters = await prisma.module_master.findMany({
    where: {
      module_key: {
        in: keys,
      },
      is_active: true,
    },
    select: {
      id: true,
      module_key: true,
    },
  });
  const masterByKey = new Map(masters.map((item) => [item.module_key, item.id]));

  await prisma.user_module_access.updateMany({
    where: {
      user_id: input.userId,
      school_id: input.schoolId,
    },
    data: {
      is_active: false,
    },
  });

  await prisma.$transaction(
    keys
      .filter((key) => masterByKey.has(key))
      .map((key) =>
        prisma.user_module_access.upsert({
          where: {
            user_id_school_id_module_id: {
              user_id: input.userId,
              school_id: input.schoolId,
              module_id: masterByKey.get(key) as number,
            },
          },
          create: {
            user_id: input.userId,
            school_id: input.schoolId,
            module_id: masterByKey.get(key) as number,
            created_by: input.createdBy ?? null,
            is_active: true,
          },
          update: {
            is_active: true,
          },
        })
      )
  );
}

export async function requireSchoolModule(
  moduleKey: SchoolModuleKey
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      ),
    };
  }

  if (
    String(user.role || "")
      .trim()
      .toUpperCase() === "PARENT" &&
    moduleKey === "AI"
  ) {
    return {
      user,
      response: NextResponse.json(
        {
          error:
            "AI access is not available for parent accounts.",
          module_key: moduleKey,
        },
        {
          status: 403,
        }
      ),
    };
  }

  if (isSuperAdminRole(user.role)) {
    return {
      user,
      response: null,
    };
  }

  const schoolId =
    Number(user.school_id) || null;

  if (!schoolId) {
    return {
      user,
      response: NextResponse.json(
        {
          error:
            "Select a school/college before using this module.",
        },
        {
          status: 403,
        }
      ),
    };
  }

  const access =
    await getSchoolModuleAccess(schoolId);

  const userAccess =
    await getUserModuleAccess(
      Number(user.id) || null,
      schoolId
    ) as Record<string, boolean>;

  if (moduleKey === "AI") {
    const effectiveAiAccess =
      access.AI !== false &&
      userAccess.TOTTECH_AI !== false &&
      userAccess.SCHOOLGPT !== false;

    if (!effectiveAiAccess) {
      return {
        user,
        response: NextResponse.json(
          {
            error:
              "You do not have access to this module.",
            module_key: moduleKey,
          },
          {
            status: 403,
          }
        ),
      };
    }

    return {
      user,
      response: null,
    };
  }

  if (
    !access[moduleKey] ||
    userAccess[moduleKey] === false
  ) {
    return {
      user,
      response: NextResponse.json(
        {
          error:
            "This module is not enabled for the selected school/college subscription.",
          module_key: moduleKey,
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

export async function moduleCookieValue(
  schoolId?: number | null,
  role?: string | null,
  userId?: number | null
) {
  if (isSuperAdminRole(role)) {
    return JSON.stringify(
      moduleAccessSnapshot(
        MODULE_KEYS.map((moduleKey) => ({
          module_key: moduleKey,
          enabled: true,
        }))
      )
    );
  }

  const schoolAccess =
    await getSchoolModuleAccess(schoolId);
  const userAccess =
    await getUserModuleAccess(
      userId,
      schoolId
    );
  return JSON.stringify(
    USER_MODULE_KEYS.reduce(
      (output, key) => ({
        ...output,
        [key]:
          schoolAllowsUserKey(
            schoolAccess,
            key
          ) &&
          userAccess[key] !== false,
      }),
      {} as Record<string, boolean>
    )
  );
}

export function moduleNotLicensedResponse(
  moduleKey: SchoolModuleKey
) {
  return NextResponse.json(
    {
      error:
        "This module is not enabled for the selected school/college subscription.",
      module_key: moduleKey,
    },
    {
      status: 403,
    }
  );
}
