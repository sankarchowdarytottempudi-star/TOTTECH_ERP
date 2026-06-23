import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import { apiError } from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(
  request: Request
) {
  try {
    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json([]);
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;
    const exams =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          es.*,
          e.exam_name,
          et.exam_name AS exam_type_name,
          qp.paper_name,
          c.class_name,
          sec.section_name,
          sub.subject_name
        FROM exam_schedule es
        LEFT JOIN exams e ON e.id = es.exam_id
        LEFT JOIN exam_types et ON et.id = es.exam_type_id
        LEFT JOIN question_papers qp ON qp.id = es.question_paper_id
        LEFT JOIN classes c ON c.id = es.class_id
        LEFT JOIN sections sec ON sec.id = es.section_id
        LEFT JOIN subjects sub ON sub.id = es.subject_id
        WHERE ($1::int IS NULL OR COALESCE(es.school_id, c.school_id) = $1::int)
          AND ($2::int IS NULL OR es.academic_year_id = $2::int OR es.academic_year_id IS NULL)
        ORDER BY es.exam_date DESC NULLS LAST, es.id DESC
        `,
        schoolId,
        academicYearId
      );

    return NextResponse.json(
      exams
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load mark-entry exams"
    );
  }
}
