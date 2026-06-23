import { NextResponse } from "next/server";

import { apiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);
    const paperId = Number(
      searchParams?.get("paperId")
    );

    if (!paperId) {
      return NextResponse.json([]);
    }

    const questions =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          qpq.id,
          qpq.question_id,
          qpq.display_order,
          qpq.section_name,
          COALESCE(qpq.question_marks, qb.max_marks, 0) AS question_marks,
          qpq.is_optional,
          qb.question_text,
          qb.answer_text,
          qb.chapter_name,
          qb.topic_name,
          qb.learning_outcome,
          qb.difficulty_level,
          qb.bloom_level,
          qb.question_type
        FROM question_paper_questions qpq
        LEFT JOIN question_bank qb ON qb.id = qpq.question_id
        WHERE qpq.question_paper_id = $1
        ORDER BY qpq.display_order ASC, qpq.id ASC
        `,
        paperId
      );

    return NextResponse.json(
      questions
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load paper questions"
    );
  }
}
