import { cookies } from "next/headers";

import { getSelectedAcademicYear } from "@/lib/academicYear";
import { isSuperAdmin } from "@/lib/access-control";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UserContext = {
  id?: number;
  role?: string;
  school_id?: number | null;
  academic_year_id?: number | null;
  academic_year_scope?: string | null;
  school_scope?: string | null;
};

export type PlatformContext = {
  user: UserContext;
  schoolId: number | null;
  academicYearId: number | null;
  allSchools: boolean;
  allYears: boolean;
  schoolScope: "all" | "selected" | "assigned";
  academicYearScope: "all" | "selected" | "current";
};

export type MutationContext = PlatformContext & {
  requiredSchoolId: number;
  requiredAcademicYearId: number;
  createdBy: number | null;
  updatedBy: number | null;
};

const positiveNumber = (
  value: string | null | undefined
) => {
  const number = Number(value);

  return Number.isFinite(number) &&
    number > 0
    ? number
    : null;
};

const isAllValue = (
  value: string | null | undefined
) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  return (
    normalized === "all" ||
    normalized === "0"
  );
};

export async function resolvePlatformContext(
  request?: Request
): Promise<PlatformContext | null> {
  const user =
    (await getCurrentUser()) as UserContext | null;

  if (!user) {
    return null;
  }

  const url = request
    ? new URL(request.url)
    : null;
  let cookieSchool:
    | string
    | undefined;
  let cookieAcademicYear:
    | string
    | undefined;

  try {
    const cookieStore =
      await cookies();
    cookieSchool =
      cookieStore.get(
        "active_school_id"
      )?.value;
    cookieAcademicYear =
      cookieStore.get(
        "active_academic_year_id"
      )?.value;
  } catch {
    cookieSchool = undefined;
    cookieAcademicYear = undefined;
  }

  const requestedSchool =
    url?.searchParams.get("school_id") ??
    url?.searchParams.get(
      "selected_school_id"
    ) ??
    cookieSchool;
  const requestedAcademicYear =
    url?.searchParams.get(
      "academic_year_id"
    ) ??
    url?.searchParams.get(
      "selected_academic_year_id"
    ) ??
    cookieAcademicYear;

  const superAdmin =
    isSuperAdmin(user.role);
  const requestedSchoolId =
    positiveNumber(requestedSchool);
  const activeSchoolId =
    Number(user.school_id) || null;

  const schoolId = superAdmin
    ? isAllValue(requestedSchool)
      ? null
      : requestedSchoolId ??
        activeSchoolId ??
        null
    : activeSchoolId;

  const allSchools =
    superAdmin && !schoolId;

  let academicYearId: number | null =
    null;
  let academicYearScope:
    | "all"
    | "selected"
    | "current" = "current";

  if (isAllValue(requestedAcademicYear)) {
    academicYearScope = "all";
  } else {
    const requestedAcademicYearId =
      positiveNumber(
        requestedAcademicYear
      );

    if (requestedAcademicYearId) {
      academicYearId =
        requestedAcademicYearId;
      academicYearScope = "selected";
    } else if (
      user.academic_year_scope === "all"
    ) {
      academicYearScope = "all";
    } else if (
      Number(user.academic_year_id)
    ) {
      academicYearId =
        Number(user.academic_year_id);
      academicYearScope = "selected";
    } else {
      const year =
        await getSelectedAcademicYear(
          schoolId
        );
      academicYearId =
        Number(year?.id) || null;
      academicYearScope = "current";
    }
  }

  return {
    user,
    schoolId,
    academicYearId,
    allSchools,
    allYears:
      academicYearScope === "all",
    schoolScope: allSchools
      ? "all"
      : superAdmin
        ? "selected"
        : "assigned",
    academicYearScope,
  };
}

const bodyNumber = (
  body: Record<string, unknown> | null,
  key: string
) => {
  const value = body?.[key];
  const number =
    typeof value === "string" ||
    typeof value === "number"
      ? Number(value)
      : null;

  return Number.isFinite(number) &&
    Number(number) > 0
    ? Number(number)
    : null;
};

export async function resolveMutationContext(
  request: Request,
  body: Record<string, unknown> | null = null
) {
  const context =
    await resolvePlatformContext(request);

  if (!context) {
    return {
      context: null,
      error:
        "Login required before saving records.",
    };
  }

  const requestedSchoolId =
    bodyNumber(body, "school_id") ??
    bodyNumber(body, "selected_school_id") ??
    context.schoolId;

  if (!requestedSchoolId) {
    return {
      context: null,
      error:
        "Select a school before saving this record.",
    };
  }

  if (
    !context.allSchools &&
    context.schoolId &&
    requestedSchoolId !== context.schoolId
  ) {
    return {
      context: null,
      error:
        "You cannot save records outside the selected or assigned school.",
    };
  }

  const school =
    await prisma.schools.findFirst({
      where: {
        id: requestedSchoolId,
        is_active: true,
      },
      select: {
        id: true,
      },
    });

  if (!school) {
    return {
      context: null,
      error:
        "Selected school was not found or is inactive.",
    };
  }

  const requestedAcademicYearId =
    bodyNumber(body, "academic_year_id") ??
    bodyNumber(
      body,
      "selected_academic_year_id"
    ) ??
    bodyNumber(
      body,
      "source_academic_year_id"
    ) ??
    context.academicYearId;

  if (!requestedAcademicYearId) {
    return {
      context: null,
      error:
        "Select an academic year before saving this record.",
    };
  }

  const academicYear =
    await prisma.academic_years.findFirst({
      where: {
        id: requestedAcademicYearId,
        OR: [
          {
            school_id: requestedSchoolId,
          },
          {
            school_id: null,
          },
        ],
      },
      select: {
        id: true,
      },
    });

  if (!academicYear) {
    return {
      context: null,
      error:
        "Selected academic year does not belong to the selected school context.",
    };
  }

  return {
    context: {
      ...context,
      requiredSchoolId: requestedSchoolId,
      requiredAcademicYearId:
        requestedAcademicYearId,
      createdBy:
        Number(context.user.id) || null,
      updatedBy:
        Number(context.user.id) || null,
    } satisfies MutationContext,
    error: null,
  };
}

export function createStamp(
  context: MutationContext
) {
  return {
    school_id: context.requiredSchoolId,
    academic_year_id:
      context.requiredAcademicYearId,
    created_by: context.createdBy,
    created_at: new Date(),
  };
}

export function updateStamp(
  context: MutationContext
) {
  return {
    updated_by: context.updatedBy,
    updated_at: new Date(),
  };
}

export function schoolSqlFilter(
  alias: string,
  column = "school_id"
) {
  return `($1::int IS NULL OR ${alias}.${column} = $1::int)`;
}

export function academicYearSqlFilter(
  alias: string,
  column = "academic_year_id"
) {
  return `($2::int IS NULL OR ${alias}.${column} = $2::int OR ${alias}.${column} IS NULL)`;
}
