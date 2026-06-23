import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();
    const cookieStore =
      await cookies();
    const activeSchool =
      cookieStore.get(
        "active_school_id"
      )?.value;
    const activeSchoolId =
      activeSchool &&
      activeSchool !== "all"
        ? Number(activeSchool)
        : null;
    const schoolContextId =
      user?.role === "SUPER_ADMIN"
        ? activeSchoolId &&
          Number.isFinite(activeSchoolId)
          ? activeSchoolId
          : null
        : user?.school_id ?? null;
    const selected =
      await getSelectedAcademicYear(
        schoolContextId
      );

    const years =
      await prisma.academic_years.findMany({
        where: schoolContextId
          ? {
              OR: [
                {
                  school_id:
                    schoolContextId,
                },
                {
                  school_id: null,
                },
              ],
            }
          : {
              school_id: null,
            },
        orderBy: {
          id: "desc",
        },
      });
    const includeAll =
      new URL(request.url).searchParams?.get(
        "include_all"
      ) === "true";
    const allYearsOption =
      includeAll
        ? [
            {
              id: "all",
              school_id: null,
              academic_year:
                "All Years",
              start_date: null,
              end_date: null,
              is_current: false,
              created_at: null,
              is_selected:
                user?.academic_year_scope ===
                "all",
            },
          ]
        : [];

    return NextResponse.json(
      [
        ...allYearsOption,
        ...years.map((year) => ({
          ...year,
          is_selected:
            user?.academic_year_scope ===
            "all"
              ? false
              : selected?.id === year.id,
        })),
      ]
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load academic years"
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();
    const user =
      await getCurrentUser();
    const schoolId =
      Number(
        body.school_id ??
          user?.school_id
      ) || null;

    if (!body.academic_year) {
      return validationError(
        "Academic year name is required."
      );
    }

    if (body.is_current) {
      await prisma.academic_years.updateMany({
        where: {
          school_id: schoolId,
        },
        data: {
          is_current: false,
        },
      });
    }

    const year =
      await prisma.academic_years.create({
        data: {
          school_id: schoolId,
          academic_year:
            body.academic_year,
          start_date:
            body.start_date
              ? new Date(
                  body.start_date
                )
              : null,
          end_date:
            body.end_date
              ? new Date(
                  body.end_date
                )
              : null,
          is_current:
            Boolean(
              body.is_current
            ),
        },
      });

    return NextResponse.json(
      year
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to create academic year"
    );
  }
}
