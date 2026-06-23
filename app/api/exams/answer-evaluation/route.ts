import fs from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { resolvePlatformContext } from "@/lib/api/context";
import { apiError, validationError } from "@/lib/api/errors";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";
import {
  evaluateQuestionSheet,
  extractAnswerSheetText,
  saveAnswerSheetFile,
  splitAnswerSheetText,
  type AnswerEvaluationQuestion,
} from "@/lib/academics/answer-evaluation";

type Row = Record<string, unknown>;

const normalizeWorkflowStatus = (value: unknown) => {
  const status = String(value || "").trim().toUpperCase();
  if (!status) return "TEACHER_REVIEW_PENDING";
  if (status === "APPROVED") return "TEACHER_APPROVED";
  if (status === "OVERRIDE") return "TEACHER_APPROVED";
  if (status === "REJECTED") return "TEACHER_REJECTED";
  if (status === "PUBLISHED") return "PUBLISHED";
  if (status === "AI_EVALUATED") return "AI_EVALUATED";
  if (status === "DRAFT") return "DRAFT";
  if (status === "TEACHER_APPROVED") return "TEACHER_APPROVED";
  if (status === "TEACHER_REJECTED") return "TEACHER_REJECTED";
  if (status === "TEACHER_REVIEW_PENDING") return "TEACHER_REVIEW_PENDING";
  return "TEACHER_REVIEW_PENDING";
};

const parsePositive = (value: FormDataEntryValue | null) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const parseNumber = (value: FormDataEntryValue | null) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : null;
};

const stringify = (value: unknown) => String(value ?? "").trim();

async function loadQuestionPaper(questionPaperId: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      qpq.question_id,
      qpq.display_order,
      qpq.question_marks,
      qb.question_text,
      qb.answer_text,
      qb.ideal_answer,
      qb.keywords,
      qb.rubric,
      qb.question_type,
      qb.bloom_level,
      qb.difficulty_level
    FROM question_paper_questions qpq
    LEFT JOIN question_bank qb ON qb.id = qpq.question_id
    WHERE qpq.question_paper_id = $1
    ORDER BY qpq.display_order ASC, qpq.id ASC
    `,
    questionPaperId
  );

  return rows as AnswerEvaluationQuestion[];
}

async function loadExamSchedule(examScheduleId: number) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      es.*,
      e.exam_name,
      e.exam_type,
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
    WHERE es.id = $1
    LIMIT 1
    `,
    examScheduleId
  );

  return rows[0] || null;
}

async function loadQuestionMetrics(
  filters: {
    schoolId: number | null;
    academicYearId: number | null;
    examScheduleId: number | null;
    classId: number | null;
    sectionId: number | null;
    studentId: number | null;
  }
) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    WITH ranked AS (
      SELECT
        sme.student_id,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.middle_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        COALESCE(s.roll_number, sye.roll_number) AS roll_number,
        c.class_name,
        sec.section_name,
        SUM(COALESCE(sme.obtained_marks, 0))::numeric AS obtained_marks,
        SUM(COALESCE(sme.max_marks, 0))::numeric AS max_marks,
        CASE
          WHEN SUM(COALESCE(sme.max_marks, 0)) > 0
          THEN ROUND((SUM(COALESCE(sme.obtained_marks, 0)) / SUM(COALESCE(sme.max_marks, 0))) * 100, 2)
          ELSE 0
        END AS percentage
      FROM student_marks_entry sme
      LEFT JOIN students s ON s.id = sme.student_id
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
        AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
      LEFT JOIN classes c ON c.id = COALESCE(sme.class_id, s.current_class_id, sye.class_id)
      LEFT JOIN sections sec ON sec.id = COALESCE(sme.section_id, s.current_section_id, s.section_id, sye.section_id)
      WHERE ($1::int IS NULL OR COALESCE(sme.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR sme.academic_year_id = $2::int OR sme.academic_year_id IS NULL)
        AND ($3::int IS NULL OR sme.exam_schedule_id = $3::int)
        AND ($4::int IS NULL OR COALESCE(sme.class_id, s.current_class_id, sye.class_id) = $4::int)
        AND ($5::int IS NULL OR COALESCE(sme.section_id, s.current_section_id, s.section_id, sye.section_id) = $5::int)
        AND ($6::int IS NULL OR sme.student_id = $6::int)
      GROUP BY sme.student_id, student_name, s.admission_number, COALESCE(s.roll_number, sye.roll_number), c.class_name, sec.section_name
    )
    SELECT *,
      CASE
        WHEN percentage >= 90 THEN 'A+'
        WHEN percentage >= 80 THEN 'A'
        WHEN percentage >= 70 THEN 'B'
        WHEN percentage >= 60 THEN 'C'
        WHEN percentage >= 50 THEN 'D'
        WHEN percentage >= 35 THEN 'E'
        ELSE 'F'
      END AS grade
    FROM ranked
    ORDER BY percentage DESC, student_name ASC
    LIMIT 50
    `,
    filters.schoolId,
    filters.academicYearId,
    filters.examScheduleId,
    filters.classId,
    filters.sectionId,
    filters.studentId
  );

  return rows;
}

export async function GET(request: Request) {
  try {
    const context = await resolvePlatformContext(request);
    if (!context) {
      return NextResponse.json({ records: [], summary: null, analytics: null });
    }

    const { searchParams } = new URL(request.url);
    const uploadId = parsePositive(searchParams?.get("id"));
    const examScheduleId = parsePositive(searchParams?.get("exam_schedule_id"));
    const classId = parsePositive(searchParams?.get("class_id"));
    const sectionId = parsePositive(searchParams?.get("section_id"));
    const studentId = parsePositive(searchParams?.get("student_id"));
    const schoolId = parsePositive(searchParams?.get("school_id")) ?? context.schoolId;
    const academicYearId = parsePositive(searchParams?.get("academic_year_id")) ?? context.academicYearId;

    const records = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        aeu.*,
        sc.school_name,
        ay.academic_year,
        s.name AS student_name,
        s.admission_number,
        s.roll_number,
        c.class_name,
        sec.section_name,
        es.exam_date,
        es.status AS exam_status,
        qp.paper_name
      FROM answer_evaluation_uploads aeu
      LEFT JOIN schools sc ON sc.id = aeu.school_id
      LEFT JOIN academic_years ay ON ay.id = aeu.academic_year_id
      LEFT JOIN students s ON s.id = aeu.student_id
      LEFT JOIN classes c ON c.id = aeu.class_id
      LEFT JOIN sections sec ON sec.id = aeu.section_id
      LEFT JOIN exam_schedule es ON es.id = aeu.exam_schedule_id
      LEFT JOIN question_papers qp ON qp.id = aeu.question_paper_id
      WHERE ($1::int IS NULL OR aeu.school_id = $1::int)
        AND ($2::int IS NULL OR aeu.academic_year_id = $2::int OR aeu.academic_year_id IS NULL)
        AND ($3::int IS NULL OR aeu.exam_schedule_id = $3::int)
        AND ($4::int IS NULL OR aeu.class_id = $4::int)
        AND ($5::int IS NULL OR aeu.section_id = $5::int)
        AND ($6::int IS NULL OR aeu.student_id = $6::int)
        AND ($7::int IS NULL OR aeu.id = $7::int)
      ORDER BY aeu.created_at DESC, aeu.id DESC
      LIMIT 100
      `,
      schoolId,
      academicYearId,
      examScheduleId,
      classId,
      sectionId,
      studentId,
      uploadId
    );

    const analytics = await loadQuestionMetrics({
      schoolId,
      academicYearId,
      examScheduleId,
      classId,
      sectionId,
      studentId,
    });

    return NextResponse.json({
      records,
      summary: {
        total_records: records.length,
        pending_reviews: records.filter((record) => String(record.teacher_review_status || "").toUpperCase() === "PENDING").length,
        approved_reviews: records.filter((record) => String(record.teacher_review_status || "").toUpperCase() === "APPROVED").length,
        override_reviews: records.filter((record) => String(record.teacher_review_status || "").toUpperCase() === "OVERRIDE").length,
      },
      analytics,
    });
  } catch (error) {
    console.error(error);
    return apiError(error, "Failed to load answer evaluations");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return validationError("Login required before uploading answer sheets.");
    }

    const context = await resolvePlatformContext(request);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const schoolId = parsePositive(form.get("school_id")) ?? context.schoolId;
    const academicYearId = parsePositive(form.get("academic_year_id")) ?? context.academicYearId;
    const examScheduleId = parsePositive(form.get("exam_schedule_id"));
    const questionPaperId = parsePositive(form.get("question_paper_id"));
    const classId = parsePositive(form.get("class_id"));
    const sectionId = parsePositive(form.get("section_id"));
    const studentId = parsePositive(form.get("student_id"));

    if (!schoolId || !academicYearId || !examScheduleId || !questionPaperId || !studentId) {
      return validationError("School/College, academic year, exam schedule, question paper and student are required.");
    }

    const files = form.getAll("answer_sheets").filter((item): item is File => item instanceof File);
    const singleFile = form.get("answer_sheet");
    if (singleFile instanceof File) {
      files.unshift(singleFile);
    }

    if (!files.length) {
      return validationError("Upload at least one answer sheet.");
    }

    const schedule = await loadExamSchedule(examScheduleId);
    const questions = await loadQuestionPaper(questionPaperId);
    if (!questions.length) {
      return validationError("The selected question paper does not contain questions.");
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "exams", "answer-evaluation");
    await fs.mkdir(uploadDir, { recursive: true });

    const createdRecords: Row[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { filePath, storedFileName } = await saveAnswerSheetFile(uploadDir, file.name || "answer-sheet", buffer);
      const extracted = await extractAnswerSheetText(filePath, file.type);
      const answerChunks = splitAnswerSheetText(extracted.text, questions.length);
      const evaluation = evaluateQuestionSheet(questions, answerChunks);

      const evaluationRows = evaluation.evaluations.map((item, index) => {
        const question = questions[index];
        return {
          question_id: item.question_id,
          question_number: item.question_number,
          question_text: question?.question_text || null,
          question_type: question?.question_type || null,
          bloom_level: question?.bloom_level || null,
          difficulty_level: question?.difficulty_level || null,
          max_marks: item.max_marks,
          student_answer: item.student_answer,
          ideal_answer: item.ideal_answer,
          exact_match_score: item.exactMatchScore,
          concept_match_score: item.conceptMatchScore,
          keyword_match_score: item.keywordMatchScore,
          semantic_similarity_score: item.semanticSimilarityScore,
          completeness_score: item.completenessScore,
          grammar_score: item.grammarScore,
          writing_quality_score: item.writingQualityScore,
          logical_flow_score: item.logicalFlowScore,
          critical_thinking_score: item.criticalThinkingScore,
          recommended_marks: item.recommendedMarks,
          confidence_percent: item.confidencePercent,
          quality_label: item.qualityLabel,
          understanding_level: item.understandingLevel,
          misconceptions: item.misconceptions,
          missing_concepts: item.missingConcepts,
          strong_concepts: item.strongConcepts,
          reasoning: item.reasoning,
          teacher_override_marks: item.teacherOverrideMarks,
        };
      });

      await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `
          INSERT INTO answer_evaluation_uploads (
            school_id,
            academic_year_id,
            exam_schedule_id,
            question_paper_id,
            class_id,
            section_id,
            student_id,
            uploaded_by,
            original_file_name,
            stored_file_name,
            file_path,
            mime_type,
            page_count,
            ocr_text,
            extracted_answers,
            ai_evaluation,
            ai_summary,
            teacher_review_status,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb,$17::jsonb,'AI_EVALUATED',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          `,
          schoolId,
          academicYearId,
          examScheduleId,
          questionPaperId,
          classId || schedule?.class_id || null,
          sectionId || schedule?.section_id || null,
          studentId,
          user.id || null,
          file.name || null,
          storedFileName,
          filePath,
          file.type || null,
          extracted.pageCount || null,
          extracted.text || null,
          JSON.stringify(evaluationRows),
          JSON.stringify(evaluation.aggregate),
          JSON.stringify({
            question_count: evaluationRows.length,
            average_recommended_marks: Number(
              (
                evaluationRows.reduce((sum, item) => sum + Number(item.recommended_marks || 0), 0) /
                Math.max(evaluationRows.length, 1)
              ).toFixed(2)
            ),
            concept_detection_accuracy: Number(
              (
                evaluationRows.reduce((sum, item) => sum + Number(item.concept_match_score || 0), 0) /
                Math.max(evaluationRows.length, 1)
              ).toFixed(2)
            ),
            teacher_approval_required: true,
            workflow_status: "AI_EVALUATED",
            workflow_status_label: "AI Evaluated",
          })
        );

        for (const item of evaluationRows) {
          await tx.$executeRawUnsafe(
            `
          INSERT INTO student_marks_entry (
              school_id,
              academic_year_id,
              class_id,
              section_id,
              student_id,
              exam_schedule_id,
              question_paper_id,
              question_id,
            obtained_marks,
            max_marks,
            grade,
            remarks,
            student_answer_text,
            ai_suggested_marks,
            ai_exact_match_score,
            ai_concept_match_score,
            ai_keyword_match_score,
            ai_semantic_similarity_score,
            ai_completeness_score,
            ai_grammar_score,
            ai_writing_quality_score,
            ai_logical_flow_score,
            ai_critical_thinking_score,
            ai_quality_label,
            ai_understanding_level,
            ai_confidence_percent,
            ai_reasoning,
            ai_misconceptions,
            teacher_review_status,
            created_by,
            created_at,
            updated_at
          )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NULL,$9,NULL,NULL,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25::jsonb,'TEACHER_REVIEW_PENDING',$26,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
            ON CONFLICT ON CONSTRAINT uq_student_question
            DO UPDATE SET
              school_id = EXCLUDED.school_id,
              academic_year_id = EXCLUDED.academic_year_id,
              class_id = EXCLUDED.class_id,
              section_id = EXCLUDED.section_id,
              student_answer_text = EXCLUDED.student_answer_text,
              ai_suggested_marks = EXCLUDED.ai_suggested_marks,
              ai_exact_match_score = EXCLUDED.ai_exact_match_score,
              ai_concept_match_score = EXCLUDED.ai_concept_match_score,
              ai_keyword_match_score = EXCLUDED.ai_keyword_match_score,
              ai_semantic_similarity_score = EXCLUDED.ai_semantic_similarity_score,
              ai_completeness_score = EXCLUDED.ai_completeness_score,
              ai_grammar_score = EXCLUDED.ai_grammar_score,
              ai_writing_quality_score = EXCLUDED.ai_writing_quality_score,
              ai_logical_flow_score = EXCLUDED.ai_logical_flow_score,
              ai_critical_thinking_score = EXCLUDED.ai_critical_thinking_score,
              ai_quality_label = EXCLUDED.ai_quality_label,
              ai_understanding_level = EXCLUDED.ai_understanding_level,
              ai_confidence_percent = EXCLUDED.ai_confidence_percent,
              ai_reasoning = EXCLUDED.ai_reasoning,
              ai_misconceptions = EXCLUDED.ai_misconceptions,
              teacher_review_status = EXCLUDED.teacher_review_status,
              updated_at = CURRENT_TIMESTAMP
            `,
            schoolId,
            academicYearId,
            classId || schedule?.class_id || null,
            sectionId || schedule?.section_id || null,
            studentId,
            examScheduleId,
            questionPaperId,
            item.question_id,
            item.max_marks,
            item.student_answer,
            item.recommended_marks,
            item.exact_match_score,
            item.concept_match_score,
            item.keyword_match_score,
            item.semantic_similarity_score,
            item.completeness_score,
            item.grammar_score,
            item.writing_quality_score,
            item.logical_flow_score,
            item.critical_thinking_score,
            item.quality_label,
            item.understanding_level,
            item.confidence_percent,
            item.reasoning,
            JSON.stringify(item.misconceptions || []),
            user.id || null
          );
        }
      });

      const record = {
        school_id: schoolId,
        academic_year_id: academicYearId,
        exam_schedule_id: examScheduleId,
        question_paper_id: questionPaperId,
        class_id: classId || schedule?.class_id || null,
        section_id: sectionId || schedule?.section_id || null,
        student_id: studentId,
        uploaded_by: user.id || null,
        original_file_name: file.name || null,
        stored_file_name: storedFileName,
        file_path: `/uploads/exams/answer-evaluation/${storedFileName}`,
        mime_type: file.type || null,
        page_count: extracted.pageCount || null,
        ocr_text: extracted.text,
        extracted_answers: evaluationRows,
        ai_evaluation: evaluation.aggregate,
        ai_summary: evaluation.summary,
      };
      createdRecords.push(record);

      await recordEvent({
        school_id: schoolId,
        academic_year_id: academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "academics",
        event_type: "ANSWER_EVALUATION_UPLOADED",
        action: "evaluate",
        entity_type: "answer_evaluation_uploads",
        entity_id: Number(studentId),
        summary: "Answer sheet uploaded and evaluated by AI.",
        payload: {
          exam_schedule_id: examScheduleId,
          question_paper_id: questionPaperId,
          student_id: studentId,
          file_name: file.name,
          page_count: extracted.pageCount || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      records: createdRecords,
    });
  } catch (error) {
    console.error(error);
    return apiError(error, "Failed to upload answer sheet");
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return validationError("Login required before reviewing answer evaluations.");
    }

    const context = await resolvePlatformContext(request);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const uploadId = parseNumber(body.upload_id);
    const teacherReviewStatus = normalizeWorkflowStatus(body.teacher_review_status);
    const teacherComments = stringify(body.teacher_comments) || null;
    const overrides = Array.isArray(body.overrides) ? body.overrides : [];

    if (!uploadId) {
      return validationError("Select an answer evaluation record first.");
    }

    const uploadRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM answer_evaluation_uploads
      WHERE id = $1
      LIMIT 1
      `,
      uploadId
    );

    const upload = uploadRows[0];
    if (!upload) {
      return validationError("Answer evaluation record not found.");
    }

    const teacherMarksByQuestion = new Map<number, number>();
    for (const override of overrides) {
      const questionId = Number(override?.question_id);
      const finalMarks = Number(override?.final_marks);
      if (Number.isFinite(questionId) && Number.isFinite(finalMarks)) {
        teacherMarksByQuestion.set(questionId, finalMarks);
      }
    }

    const response = await prisma.$transaction(async (tx) => {
      const existingRows = await tx.$queryRawUnsafe<Row[]>(
        `
        SELECT question_id, max_marks, ai_suggested_marks
        FROM student_marks_entry
        WHERE student_id = $1
          AND exam_schedule_id = $2
          AND question_paper_id = $3
        `,
        Number(upload.student_id),
        Number(upload.exam_schedule_id),
        Number(upload.question_paper_id)
      );

      for (const row of existingRows) {
        const questionId = Number(row.question_id);
        const aiMarks = Number(row.ai_suggested_marks || 0);
        const finalMarks = teacherMarksByQuestion.has(questionId)
          ? teacherMarksByQuestion.get(questionId) ?? aiMarks
          : aiMarks;
        const maxMarks = Number(row.max_marks || 0);
        const grade =
          maxMarks > 0
            ? finalMarks / maxMarks >= 0.9
              ? "A+"
              : finalMarks / maxMarks >= 0.8
                ? "A"
                : finalMarks / maxMarks >= 0.7
                  ? "B"
                  : finalMarks / maxMarks >= 0.6
                    ? "C"
                    : finalMarks / maxMarks >= 0.5
                      ? "D"
                      : finalMarks / maxMarks >= 0.35
                        ? "E"
                        : "F"
            : null;
        const nextStatus = teacherReviewStatus === "PUBLISHED"
          ? "PUBLISHED"
          : teacherReviewStatus === "TEACHER_REJECTED"
            ? "TEACHER_REJECTED"
            : "TEACHER_APPROVED";

        await tx.$executeRawUnsafe(
          `
          UPDATE student_marks_entry
          SET obtained_marks = $1,
              grade = $2,
              remarks = COALESCE($3, remarks),
              teacher_review_status = $4,
              teacher_reviewed_by = $5,
              teacher_reviewed_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE student_id = $6
            AND exam_schedule_id = $7
            AND question_paper_id = $8
            AND question_id = $9
          `,
          finalMarks,
          grade,
          teacherComments,
          nextStatus,
          user.id || null,
          Number(upload.student_id),
          Number(upload.exam_schedule_id),
          Number(upload.question_paper_id),
          questionId
        );
      }

      const uploadStatus =
        teacherReviewStatus === "PUBLISHED"
          ? "PUBLISHED"
          : teacherReviewStatus === "TEACHER_REJECTED"
            ? "TEACHER_REJECTED"
            : "TEACHER_APPROVED";

      const updated = await tx.$queryRawUnsafe<Row[]>(
        `
        UPDATE answer_evaluation_uploads
        SET teacher_review_status = $2,
            teacher_reviewed_by = $3,
            teacher_reviewed_at = CURRENT_TIMESTAMP,
            teacher_comments = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
        `,
        uploadId,
        uploadStatus,
        user.id || null,
        teacherComments
      );
      return updated[0];
    });

    await recordEvent({
      school_id: Number(upload.school_id) || context.schoolId,
      academic_year_id: Number(upload.academic_year_id) || context.academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "academics",
      event_type: "ANSWER_EVALUATION_REVIEWED",
      action: teacherReviewStatus === "PUBLISHED" ? "publish" : teacherReviewStatus === "TEACHER_REJECTED" ? "reject" : "approve",
      entity_type: "answer_evaluation_uploads",
      entity_id: Number(upload.student_id) || uploadId,
      summary: `Teacher review marked as ${teacherReviewStatus || "TEACHER_APPROVED"}.`,
      payload: {
        upload_id: uploadId,
        teacher_comments: teacherComments,
        overrides: Array.from(teacherMarksByQuestion.entries()).map(([question_id, final_marks]) => ({
          question_id,
          final_marks,
        })),
      },
    });

    return NextResponse.json({
      success: true,
      record: response,
    });
  } catch (error) {
    console.error(error);
    return apiError(error, "Failed to update answer evaluation review");
  }
}
