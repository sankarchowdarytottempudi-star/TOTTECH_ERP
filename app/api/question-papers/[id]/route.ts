import { NextResponse } from "next/server";

import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function metadataValue(
  source: unknown,
  key: string
) {
  if (!source) {
    return null;
  }

  const metadata =
    typeof source === "string"
      ? safeJson(source)
      : source;

  if (
    !metadata ||
    typeof metadata !== "object"
  ) {
    return null;
  }

  const value = (
    metadata as Record<
      string,
      unknown
    >
  )[key];

  return typeof value === "string"
    ? value
    : null;
}

function safeJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const resolvedParams =
      await params;
    const id = Number(
      resolvedParams.id
    );

    if (!id) {
      return validationError(
        "A valid question paper id is required."
      );
    }

    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return validationError(
        "Login required before viewing a question paper."
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;

    const paperRows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          qp.*,
          e.exam_name,
          et.exam_name AS exam_type_name,
          c.class_name,
          sec.section_name,
          sub.subject_name
        FROM question_papers qp
        LEFT JOIN exams e ON e.id = qp.exam_id
        LEFT JOIN exam_types et ON et.id = qp.exam_type_id
        LEFT JOIN classes c ON c.id = qp.class_id
        LEFT JOIN sections sec ON sec.id = qp.section_id
        LEFT JOIN subjects sub ON sub.id = qp.subject_id
        WHERE qp.id = $1::int
          AND ($2::int IS NULL OR COALESCE(qp.school_id, c.school_id) = $2::int)
          AND ($3::int IS NULL OR qp.academic_year_id = $3::int OR qp.academic_year_id IS NULL)
        LIMIT 1
        `,
        id,
        schoolId,
        academicYearId
      );

    const paper = paperRows[0];

    if (!paper) {
      return NextResponse.json(
        {
          error:
            "Question paper not found.",
        },
        {
          status: 404,
        }
      );
    }

    const questions =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          qpq.id,
          qpq.question_paper_id,
          qpq.question_id,
          qpq.display_order,
          qpq.section_name,
          qpq.question_marks,
          qpq.is_optional,
          qpq.metadata AS paper_question_metadata,
          qb.question_text,
          qb.answer_text,
          qb.chapter_name,
          qb.topic_name,
          qb.learning_outcome,
          qb.difficulty_level,
          qb.bloom_level,
          qb.question_type,
          qb.max_marks,
          qb.metadata AS question_metadata
        FROM question_paper_questions qpq
        LEFT JOIN question_bank qb ON qb.id = qpq.question_id
        WHERE qpq.question_paper_id = $1::int
        ORDER BY qpq.display_order ASC NULLS LAST, qpq.id ASC
        `,
        id
      );

    return NextResponse.json({
      paper,
      questions: questions.map(
        (question) => ({
          ...question,
          formula_text:
            metadataValue(
              question.paper_question_metadata,
              "formula_text"
            ) ||
            metadataValue(
              question.question_metadata,
              "formula_text"
            ),
          scribble_data:
            metadataValue(
              question.paper_question_metadata,
              "scribble_data"
            ) ||
            metadataValue(
              question.question_metadata,
              "scribble_data"
            ),
        })
      ),
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load question paper"
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const resolvedParams =
      await params;
    const id = Number(
      resolvedParams.id
    );
    const body = await request.json();

    const paper =
      await prisma.question_papers.update({
        where: {
          id,
        },
        data: {
          paper_name: body.paper_name,
          exam_type_id: Number(body.exam_type_id),
          class_id: Number(body.class_id),
          section_id: Number(body.section_id),
          subject_id: Number(body.subject_id),
          total_marks: Number(body.total_marks),
          exam_date: new Date(body.exam_date),
        },
      });

    return NextResponse.json(paper);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const resolvedParams =
      await params;
    const id = Number(
      resolvedParams.id
    );

    await prisma.question_paper_questions.deleteMany({
      where: {
        question_paper_id: id,
      },
    });

    await prisma.question_papers.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
