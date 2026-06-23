import {
  NextRequest,
  NextResponse,
} from "next/server";
import {
  userModuleKeysForPath,
} from "@/lib/user-module-routing";

function isClinicalServicesEmail(
  email?: string | null
) {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();

  return (
    normalized ===
      "cs-superadmin@erp.com" ||
    normalized.startsWith("cs-")
  );
}

const modulePathRules: Array<{
  key: string;
  paths: string[];
}> = [
  {
    key: "STUDENTS",
    paths: ["/students", "/api/students"],
  },
  {
    key: "TEACHERS",
    paths: ["/teachers", "/api/teachers"],
  },
  {
    key: "ACADEMICS",
    paths: [
      "/academics",
      "/promotions",
      "/exams",
      "/api/classes",
      "/api/sections",
      "/api/subjects",
      "/api/exams",
      "/api/exam-schedule",
      "/api/homework",
      "/api/marks-entry",
      "/api/question-bank",
      "/api/question-papers",
      "/api/syllabus",
      "/api/promotions",
    ],
  },
  {
    key: "FINANCE",
    paths: [
      "/finance",
      "/fees",
      "/api/finance",
      "/api/concessions",
      "/api/fee-categories",
    ],
  },
  {
    key: "OPERATIONS",
    paths: [
      "/attendance",
      "/operations",
      "/api/attendance",
      "/api/staff-attendance",
    ],
  },
  {
    key: "TRANSPORT",
    paths: ["/transport", "/api/transport"],
  },
  {
    key: "HOSTEL",
    paths: ["/hostel", "/api/hostels"],
  },
  {
    key: "DINING",
    paths: ["/dining", "/api/dining"],
  },
  {
    key: "REPORTS",
    paths: [
      "/reports",
      "/api/reports",
      "/api/reports-center",
    ],
  },
  {
    key: "ANALYTICS",
    paths: [
      "/principal-analytics",
      "/analytics",
      "/war-room",
    ],
  },
  {
    key: "AI",
    paths: [
      "/ai-command-center",
      "/ai-school-copilot",
      "/ai-dashboard",
      "/student-intelligence",
      "/faculty-intelligence",
      "/school-brain",
      "/schoolgpt",
      "/school-gpt",
      "/ai",
      "/school-ai",
      "/ai-insights",
      "/ai-reports",
      "/tottech-ai",
      "/clinical-services/ai",
      "/settings/ai",
      "/api/tottech-ai",
      "/api/ai",
    ],
  },
  {
    key: "USER_MANAGEMENT",
    paths: [
      "/settings/users",
      "/api/users",
    ],
  },
  {
    key: "PARENT_PORTAL",
    paths: ["/parent"],
  },
];

function moduleForPath(pathname: string) {
  return modulePathRules.find((rule) =>
    rule.paths.some(
      (path) =>
        pathname === path ||
        pathname.startsWith(`${path}/`)
    )
  )?.key;
}

function moduleAccessFromCookie(
  request: NextRequest
) {
  const value =
    request.cookies.get("module_access")?.value;

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Record<
      string,
      boolean
    >;
  } catch {
    return null;
  }
}

function userModuleAccessFromCookie(
  request: NextRequest
) {
  const value =
    request.cookies.get("user_module_access")?.value;

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Record<
      string,
      boolean
    >;
  } catch {
    return null;
  }
}

function explicitModuleAccess(
  access: Record<string, boolean> | null | undefined,
  key: string
) {
  return access?.[key] === true;
}

export function middleware(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/api/auth/login",
  ];

  if (
    publicRoutes.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  const userCookie =
    request.cookies.get("erpUser");

  if (!userCookie) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  try {
    const user = JSON.parse(
      userCookie.value
    );
    const isClinicalUser =
      user.projectType ===
        "CLINICAL" ||
      user.project ===
        "tottech_clinical_services" ||
      isClinicalServicesEmail(user.email);
    const isClinicalPath =
      pathname.startsWith(
        "/clinical-services"
      );

    if (
      isClinicalUser &&
      pathname === "/"
    ) {
      return NextResponse.redirect(
        new URL(
          "/clinical-services",
          request.url
        )
      );
    }

    if (
      isClinicalUser &&
      !isClinicalPath &&
      !pathname.startsWith("/api/")
    ) {
      return NextResponse.redirect(
        new URL(
          "/clinical-services",
          request.url
        )
      );
    }

    if (
      !isClinicalUser &&
      isClinicalPath
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    const role = String(user.role || "")
      .trim()
      .toUpperCase();
    const isSuperAdmin =
      role === "SUPER_ADMIN";
    const moduleKey =
      !isClinicalUser && !isSuperAdmin
        ? moduleForPath(pathname)
        : null;

    const userModuleKeys =
      userModuleKeysForPath(pathname);

    if (isSuperAdmin) {
      return NextResponse.next();
    }

    if (moduleKey || userModuleKeys.length) {
      const schoolAccess =
        moduleAccessFromCookie(request) ||
        user.module_access ||
        {};
      const userAccess =
        userModuleAccessFromCookie(request) ||
        user.user_module_access ||
        {};
      const aiAllowed =
        schoolAccess.AI !== false &&
        userAccess.TOTTECH_AI !== false &&
        userAccess.SCHOOLGPT !== false;

      const allowed =
        [moduleKey, ...userModuleKeys].some(
          (key) => {
            if (!key) return false;

          if (
            key === "AI" ||
            key === "TOTTECH_AI" ||
            key === "SCHOOLGPT"
          ) {
            return aiAllowed === true;
          }

            return (
              explicitModuleAccess(
                schoolAccess,
                key
              ) &&
              explicitModuleAccess(
                userAccess,
                key
              )
            );
        }
      );

      if (!allowed) {
        const deniedKey =
          moduleKey || userModuleKeys[0];

        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              error:
                "This module is not enabled for the selected school subscription.",
              module_key: deniedKey,
            },
            {
              status: 403,
            }
          );
        }

        const url = new URL(
          "/module-not-licensed",
          request.url
        );
        url.searchParams.set(
          "module",
          deniedKey || "UNKNOWN"
        );
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    "/",
    "/clinical-services/:path*",
    "/students/:path*",
    "/teachers/:path*",
    "/schools/:path*",
    "/academics/:path*",
    "/attendance/:path*",
    "/fees/:path*",
    "/finance/:path*",
    "/settings/:path*",
    "/platform/:path*",
    "/war-room/:path*",
    "/transport/:path*",
    "/hostel/:path*",
    "/dining/:path*",
    "/exams/:path*",
    "/operations/:path*",
    "/reports/:path*",
    "/principal-analytics/:path*",
    "/analytics/:path*",
    "/ai-command-center/:path*",
    "/ai-school-copilot/:path*",
    "/student-intelligence/:path*",
    "/faculty-intelligence/:path*",
    "/school-brain/:path*",
    "/parent/:path*",
    "/imports/:path*",
    "/api/clinical/:path*",
    "/api/tottech-ai/:path*",
    "/api/ai/:path*",
    "/api/users/:path*",
    "/api/students/:path*",
    "/api/teachers/:path*",
    "/api/finance/:path*",
    "/api/reports/:path*",
    "/api/reports-center/:path*",
    "/api/attendance/:path*",
    "/api/transport/:path*",
    "/api/hostels/:path*",
    "/api/dining/:path*",
  ],
};
