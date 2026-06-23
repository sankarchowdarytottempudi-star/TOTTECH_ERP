import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const rawAcademicYearId = String(
      body.academicYearId ??
        body.academic_year_id ??
        ""
    );
    const normalized =
      rawAcademicYearId
        .trim()
        .toLowerCase();

    if (
      normalized === "all" ||
      normalized === "0"
    ) {
      const response =
        NextResponse.json({
          success: true,
          academicYear: null,
          scope: "all",
        });

      response.cookies.set(
        "active_academic_year_id",
        "all",
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        }
      );

      return response;
    }

    const academicYearId = Number(
      rawAcademicYearId
    );

    if (
      !academicYearId ||
      !Number.isFinite(academicYearId)
    ) {
      return validationError(
        "Select a valid academic year."
      );
    }

    const year =
      await prisma.academic_years.findUnique({
        where: {
          id: academicYearId,
        },
      });

    if (!year) {
      return validationError(
        "Academic year was not found."
      );
    }

    const response = NextResponse.json({
      success: true,
      academicYear: year,
    });

    response.cookies.set(
      "active_academic_year_id",
      String(year.id),
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    return apiError(
      error,
      "Failed to switch academic year"
    );
  }
}
