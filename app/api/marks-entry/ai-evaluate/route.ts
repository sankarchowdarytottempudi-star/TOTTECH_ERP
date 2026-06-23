import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { resolvePlatformContext } from "@/lib/api/context";
import { apiError, validationError } from "@/lib/api/errors";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";
import {
  buildAssessmentAggregateMetrics,
  evaluateAnswer,
} from "@/lib/academics/assessment-ai";

type Row = Record<string, unknown>;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return validationError("Login required before running AI assessment.");
    }

    const context = await resolvePlatformContext(request);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const studentId = Number(body.student_id);
    const questionPaperId = Number(body.question_paper_id);
    const examScheduleId = Number(body.exam_schedule_id || 0) || null;
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const teacherOverride = Number(body.teacher_override_marks || 0) || null;

    if (!studentId || !questionPaperId || !answers.length) {
      return validationError("Student, question paper, and answers are required.");
    }

    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        qpq.question_id,
        qpq.question_marks,
        qb.question_text,
        qb.answer_text AS ideal_answer,
        qb.rubric,
        qb.keywords,
        qb.max_marks,
        qb.question_type
      FROM question_paper_questions qpq
      LEFT JOIN question_bank qb ON qb.id = qpq.question_id
      WHERE qpq.question_paper_id = $1
      ORDER BY qpq.display_order ASC, qpq.id ASC
      `,
      questionPaperId
    );

    const response: Array<
      ReturnType<typeof evaluateAnswer> & {
        question_id: number;
        student_answer: string;
        ideal_answer: string;
        max_marks: number;
        teacherOverride: number | null;
      }
    > = answers.map((answer: Row) => {
      const questionId = Number(answer.question_id);
      const question = rows.find((row) => Number(row.question_id) === questionId);
      const maxMarks = Number(question?.question_marks || question?.max_marks || 0);
      const rawKeywords = question?.keywords;
      const keywordList = Array.isArray(rawKeywords)
        ? rawKeywords.map((value) => String(value || "").trim()).filter(Boolean)
        : String(rawKeywords || "")
            .split(/[,;\n]/)
            .map((value) => value.trim())
            .filter(Boolean);
      const evaluation = evaluateAnswer({
        questionText: String(question?.question_text || ""),
        idealAnswer: String(question?.ideal_answer || ""),
        rubric: String(question?.rubric || ""),
        keywords: keywordList,
        studentAnswer: String(answer.student_answer || answer.answer_text || ""),
        maxMarks,
        questionType: String(question?.question_type || ""),
      });

      return {
        question_id: questionId,
        student_answer: String(answer.student_answer || answer.answer_text || ""),
        ideal_answer: String(question?.ideal_answer || ""),
        max_marks: maxMarks,
        ...evaluation,
        teacherOverride,
      };
    });

    const averageRecommendedMarks =
      response.reduce((sum: number, item) => sum + Number(item.recommendedMarks || 0), 0) /
      Math.max(response.length, 1);
    const aggregateMetrics = buildAssessmentAggregateMetrics(response);

    await recordEvent({
      school_id: context.schoolId,
      academic_year_id: context.academicYearId,
      user_id: Number(user.id) || null,
      actor_role: user.role,
      module_name: "marks",
      event_type: "AI_ASSESSMENT_EVALUATED",
      action: "evaluate",
      entity_type: "student_exam_answers",
      entity_id: studentId,
      summary: "AI assessment suggestions generated.",
      payload: {
        student_id: studentId,
        question_paper_id: questionPaperId,
        exam_schedule_id: examScheduleId,
        evaluations: response,
      },
    });

    await prisma.$queryRawUnsafe(
      `
      INSERT INTO student_exam_analysis (
        student_id,
        question_paper_id,
        strengths,
        weaknesses,
        ai_recommendations,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP)
      `,
      studentId,
      questionPaperId,
      response.filter((item) => item.conceptMatchScore >= 70).map((item) => `Q${item.question_id}`).join(", ") || null,
      response.filter((item) => item.conceptMatchScore < 60).map((item) => `Q${item.question_id}`).join(", ") || null,
      `Average AI recommended marks: ${averageRecommendedMarks.toFixed(2)}`
    );

    return NextResponse.json({
      student_id: studentId,
      question_paper_id: questionPaperId,
      exam_schedule_id: examScheduleId,
      average_recommended_marks: Number(averageRecommendedMarks.toFixed(2)),
      evaluations: response,
      aggregate_metrics: aggregateMetrics,
      summary: {
        question_count: response.length,
        concept_detection_accuracy: Number(
          (
            response.reduce((sum, item) => sum + Number(item.conceptMatchScore || 0), 0) /
            Math.max(response.length, 1)
          ).toFixed(2)
        ),
        partial_credit_accuracy: Number(
          (
            response.filter((item) => item.understandingLevel === "PARTIAL").length /
            Math.max(response.length, 1) * 100
          ).toFixed(2)
        ),
        teacher_approval_required: true,
        teacher_override_marks: teacherOverride,
        skill_metrics: aggregateMetrics,
      },
    });
  } catch (error) {
    console.error(error);
    return apiError(error, "Failed to evaluate answers");
  }
}
