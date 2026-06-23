export const USER_MODULE_PATH_RULES = [
  { key: "STUDENTS", paths: ["/students"] },
  { key: "TEACHERS", paths: ["/teachers"] },
  {
    key: "ACADEMICS",
    paths: [
      "/academics",
      "/promotions",
      "/exams",
    ],
  },
  {
    key: "CLASSES",
    paths: ["/academics/classes"],
  },
  {
    key: "SECTIONS",
    paths: ["/academics/sections"],
  },
  {
    key: "SUBJECTS",
    paths: ["/academics/subjects"],
  },
  {
    key: "SYLLABUS",
    paths: ["/academics/syllabus"],
  },
  {
    key: "HOMEWORK",
    paths: ["/academics/homework"],
  },
  {
    key: "QUESTION_BANK",
    paths: ["/academics/question-bank"],
  },
  {
    key: "QUESTION_PAPERS",
    paths: ["/academics/question-papers"],
  },
  {
    key: "EXAM_SCHEDULE",
    paths: ["/academics/exam-schedule"],
  },
  {
    key: "EXAMS",
    paths: ["/academics/exams"],
  },
  {
    key: "MARKS_ENTRY",
    paths: ["/academics/marks-entry"],
  },
  {
    key: "ATTENDANCE",
    paths: ["/attendance", "/attendance/calendar", "/attendance/staff", "/attendance/students"],
  },
  {
    key: "FINANCE",
    paths: ["/finance", "/fees"],
  },
  {
    key: "INVOICES",
    paths: ["/finance/invoices", "/invoices"],
  },
  {
    key: "PAYMENTS",
    paths: ["/finance/payments"],
  },
  {
    key: "CONCESSIONS",
    paths: ["/finance/concessions"],
  },
  {
    key: "EXPENSES",
    paths: ["/finance/expenses"],
  },
  {
    key: "EXPENSE_VOUCHERS",
    paths: ["/finance/vouchers"],
  },
  {
    key: "REPORTS",
    paths: ["/reports", "/finance/reports", "/reports-center"],
  },
  {
    key: "ANALYTICS",
    paths: ["/principal-analytics", "/analytics", "/war-room"],
  },
  {
    key: "OPERATIONS",
    paths: ["/operations"],
  },
  {
    key: "DINING",
    paths: ["/dining"],
  },
  {
    key: "TRANSPORT",
    paths: ["/transport"],
  },
  {
    key: "HOSTEL",
    paths: ["/hostel"],
  },
  {
    key: "PARENT_PORTAL",
    paths: ["/parent"],
  },
  {
    key: "TOTTECH_AI",
    paths: [
      "/ai-command-center",
      "/ai-school-copilot",
      "/ai-dashboard",
      "/ai",
      "/tottech-ai",
      "/ai-insights",
      "/ai-reports",
      "/school-ai",
      "/clinical-services/ai",
      "/settings/ai",
    ],
  },
  {
    key: "SCHOOLGPT",
    paths: ["/schoolgpt", "/school-gpt"],
  },
  {
    key: "USER_MANAGEMENT",
    paths: ["/settings/users"],
  },
  {
    key: "SETTINGS",
    paths: ["/settings"],
  },
] as const;

export function userModuleKeysForPath(pathname: string) {
  const cleanPath = pathname.split("?")[0].split("#")[0];

  if (
    cleanPath === "/clinical-services/ai" ||
    cleanPath.startsWith("/clinical-services/ai/") ||
    cleanPath === "/settings/ai" ||
    cleanPath.startsWith("/settings/ai/")
  ) {
    return ["TOTTECH_AI"];
  }

  return USER_MODULE_PATH_RULES
    .filter((rule) =>
      rule.paths.some(
        (path) =>
          cleanPath === path ||
          cleanPath.startsWith(`${path}/`)
      )
    )
    .map((rule) => rule.key);
}
