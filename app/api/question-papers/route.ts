import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import {
  resolveMutationContext,
  resolvePlatformContext,
} from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type PaperQuestion = {
  question_id?: number | string | null;
  question_text?: string | null;
  answer_text?: string | null;
  formula_text?: string | null;
  scribble_data?: string | null;
  chapter_name?: string | null;
  topic_name?: string | null;
  learning_outcome?: string | null;
  difficulty_level?: string | null;
  bloom_level?: string | null;
  question_type?: string | null;
  section_name?: string | null;
  question_marks?: number | string | null;
  max_marks?: number | string | null;
  is_optional?: boolean | null;
};

export async function GET(
  request: Request
) {
  try {
    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return validationError(
        "Login required before viewing question papers."
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;
    const papers =
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
          sub.subject_name,
          COUNT(qpq.id)::int AS question_count
        FROM question_papers qp
        LEFT JOIN exams e ON e.id = qp.exam_id
        LEFT JOIN exam_types et ON et.id = qp.exam_type_id
        LEFT JOIN classes c ON c.id = qp.class_id
        LEFT JOIN sections sec ON sec.id = qp.section_id
        LEFT JOIN subjects sub ON sub.id = qp.subject_id
        LEFT JOIN question_paper_questions qpq ON qpq.question_paper_id = qp.id
        WHERE ($1::int IS NULL OR COALESCE(qp.school_id, c.school_id) = $1::int)
          AND ($2::int IS NULL OR qp.academic_year_id = $2::int OR qp.academic_year_id IS NULL)
        GROUP BY qp.id, e.exam_name, et.exam_name, c.class_name, sec.section_name, sub.subject_name
        ORDER BY qp.created_at DESC NULLS LAST, qp.id DESC
        LIMIT 250
        `,
        schoolId,
        academicYearId
      );

    return NextResponse.json(
      papers
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load question papers"
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before creating a question paper."
      );
    }

    const body =
      await request.json();
    const {
      context: mutationContext,
      error: contextError,
    } = await resolveMutationContext(
      request,
      body
    );
    const schoolId =
      mutationContext?.requiredSchoolId ??
      null;
    const classId =
      Number(body.class_id) || null;
    const sectionId =
      Number(body.section_id) || null;
    const subjectId =
      Number(body.subject_id) || null;
    const questions =
      Array.isArray(body.questions)
        ? (body.questions as PaperQuestion[])
        : [];

    if (contextError || !schoolId) {
      return validationError(
        contextError ||
          "Select a school before creating a question paper."
      );
    }

    if (
      !body.paper_name ||
      !classId ||
      !sectionId ||
      !subjectId
    ) {
      return validationError(
        "Paper name, class, section, and subject are required."
      );
    }

    if (!questions.length) {
      return validationError(
        "Add at least one question to the question paper."
      );
    }

    const academicYearId =
      mutationContext?.requiredAcademicYearId ??
      null;

    if (!academicYearId) {
      return validationError(
        "Select an academic year before creating a question paper."
      );
    }

    const totalMarks =
      questions.reduce(
        (sum, question) =>
          sum +
          Number(
            question.question_marks ??
              question.max_marks ??
              0
          ),
        0
      );

    const result =
      await prisma.$transaction(
        async (tx) => {
          const paperRows =
            await tx.$queryRawUnsafe<
              Row[]
            >(
              `
              INSERT INTO question_papers (
                school_id,
                academic_year_id,
                exam_id,
                exam_type_id,
                class_id,
                section_id,
                subject_id,
                paper_name,
                total_marks,
                exam_date,
                instructions,
                duration_minutes,
                metadata,
                created_by,
                created_at,
                updated_at
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
              RETURNING *
              `,
              schoolId,
              academicYearId,
              body.exam_id
                ? Number(body.exam_id)
                : null,
              body.exam_type_id
                ? Number(
                    body.exam_type_id
                  )
                : null,
              classId,
              sectionId,
              subjectId,
              body.paper_name,
              Number(
                body.total_marks ||
                  totalMarks
              ),
              body.exam_date
                ? new Date(
                    body.exam_date
                  )
                : null,
              body.instructions || null,
              body.duration_minutes
                ? Number(
                    body.duration_minutes
                  )
                : null,
              JSON.stringify(
                body.metadata || {}
              ),
              user.id || null
            );
          const paper = paperRows[0];

          for (const [
            index,
            question,
          ] of questions.entries()) {
            const questionMetadata = {
              formula_text:
                question.formula_text ||
                null,
              scribble_data:
                question.scribble_data ||
                null,
              has_scribble: Boolean(
                question.scribble_data
              ),
            };
            let questionId =
              Number(
                question.question_id
              ) || null;

            if (!questionId) {
              if (!question.question_text) {
                throw new Error(
                  `Question ${index + 1} text is required.`
                );
              }

              const questionRows =
                await tx.$queryRawUnsafe<
                  Row[]
                >(
                  `
                  INSERT INTO question_bank (
                    school_id,
                    academic_year_id,
                    class_id,
                    section_id,
                    subject_id,
                    chapter_name,
                    topic_name,
                    learning_outcome,
                    difficulty_level,
                    bloom_level,
                    question_type,
                    question_text,
                    answer_text,
                    max_marks,
                    created_by,
                    created_at,
                    updated_at,
                    metadata
                  )
                  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$16::jsonb)
                  RETURNING *
                  `,
                  schoolId,
                  academicYearId,
                  classId,
                  sectionId,
                  subjectId,
                  question.chapter_name ||
                    null,
                  question.topic_name ||
                    null,
                  question.learning_outcome ||
                    null,
                  question.difficulty_level ||
                    "MEDIUM",
                  question.bloom_level ||
                    null,
                  question.question_type ||
                    "SHORT_ANSWER",
                  question.question_text,
                  question.answer_text ||
                    null,
                  Number(
                    question.max_marks ??
                      question.question_marks ??
                      0
                  ),
                  user.id || null,
                  JSON.stringify(
                    questionMetadata
                  )
                );
              questionId = Number(
                questionRows[0]?.id
              );
            }

            await tx.$executeRawUnsafe(
              `
              INSERT INTO question_paper_questions (
                question_paper_id,
                question_id,
                display_order,
                section_name,
                question_marks,
                is_optional,
                metadata,
                created_at
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,CURRENT_TIMESTAMP)
              `,
              Number(paper.id),
              questionId,
              index + 1,
              question.section_name ||
                "A",
              Number(
                question.question_marks ??
                  question.max_marks ??
                  0
              ),
              Boolean(question.is_optional),
              JSON.stringify(
                questionMetadata
              )
            );
          }

          return paper;
        }
      );

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type:
        "QUESTION_PAPER_CREATED",
      action: "create",
      entity_type: "class",
      entity_id: classId,
      summary:
        "Question paper created",
      payload: {
        question_paper_id:
          result.id,
        section_id: sectionId,
        subject_id: subjectId,
        question_count:
          questions.length,
      },
    });

    return NextResponse.json(
      result,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to create question paper"
    );
  }
}
