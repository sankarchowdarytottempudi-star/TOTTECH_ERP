import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type MarkEntry = {
  question_id: number | string;
  obtained_marks: number | string;
  max_marks: number | string;
  remarks?: string | null;
};

const gradeFor = (
  total: number,
  max: number
) => {
  const percent =
    max > 0 ? (total / max) * 100 : 0;

  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  if (percent >= 35) return "E";
  return "F";
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
      return NextResponse.json([]);
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;
    const { searchParams } =
      new URL(request.url);
    const studentId = Number(
      searchParams?.get("student_id") ||
        0
    );
    const examScheduleId = Number(
      searchParams?.get(
        "exam_schedule_id"
      ) || 0
    );
    const questionPaperId = Number(
      searchParams?.get(
        "question_paper_id"
      ) || 0
    );
    const marks =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          sme.*,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
          qb.question_text,
          es.exam_date,
          e.exam_name,
          sub.subject_name
        FROM student_marks_entry sme
        LEFT JOIN students s ON s.id = sme.student_id
        LEFT JOIN question_bank qb ON qb.id = sme.question_id
        LEFT JOIN exam_schedule es ON es.id = sme.exam_schedule_id
        LEFT JOIN exams e ON e.id = es.exam_id
        LEFT JOIN subjects sub ON sub.id = es.subject_id
        WHERE ($1::int IS NULL OR COALESCE(sme.school_id, s.school_id) = $1::int)
          AND ($2::int IS NULL OR sme.academic_year_id = $2::int OR sme.academic_year_id IS NULL)
          AND ($3::int IS NULL OR sme.student_id = $3::int)
          AND ($4::int IS NULL OR sme.exam_schedule_id = $4::int)
          AND ($5::int IS NULL OR sme.question_paper_id = $5::int)
        ORDER BY sme.created_at DESC
        LIMIT 300
        `,
        schoolId,
        academicYearId,
        studentId || null,
        examScheduleId || null,
        questionPaperId || null
      );

    return NextResponse.json(
      marks
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load marks"
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
        "Login required before saving marks."
      );
    }

    const body =
      await request.json();
    const studentId = Number(
      body.student_id
    );
    const examScheduleId =
      Number(
        body.exam_schedule_id
      );
    const questionPaperId =
      Number(
        body.question_paper_id
      );
    const entries: MarkEntry[] =
      Array.isArray(body.entries)
        ? body.entries
        : [
            {
              question_id:
                body.question_id,
              obtained_marks:
                body.obtained_marks,
              max_marks:
                body.max_marks,
              remarks: body.remarks,
            },
          ];

    if (
      !studentId ||
      !examScheduleId ||
      !questionPaperId ||
      !entries.length
    ) {
      return validationError(
        "Student, exam schedule, question paper, and marks are required."
      );
    }

    const scheduleRows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        SELECT
          es.*,
          c.school_id AS class_school_id
        FROM exam_schedule es
        LEFT JOIN classes c ON c.id = es.class_id
        WHERE es.id = $1
        LIMIT 1
        `,
        examScheduleId
      );
    const schedule =
      scheduleRows[0];

    if (!schedule) {
      return validationError(
        "Exam schedule was not found."
      );
    }

    const schoolId =
      Number(schedule.school_id) ||
      Number(schedule.class_school_id) ||
      Number(user.school_id) ||
      null;
    const academicYearId =
      Number(
        schedule.academic_year_id
      ) || null;
    const classId =
      Number(schedule.class_id) ||
      null;
    const sectionId =
      Number(schedule.section_id) ||
      null;
    const subjectId =
      Number(schedule.subject_id) ||
      null;
    const examId =
      Number(schedule.exam_id) ||
      null;
    let totalMarks = 0;
    let maxMarks = 0;

    await prisma.$transaction(
      async (tx) => {
        for (const entry of entries) {
          const obtained =
            Number(
              entry.obtained_marks || 0
            );
          const max =
            Number(
              entry.max_marks || 0
            );
          const questionId =
            Number(entry.question_id);

          totalMarks += obtained;
          maxMarks += max;

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
              created_by,
              created_at,
              updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
            ON CONFLICT ON CONSTRAINT uq_student_question
            DO UPDATE SET
              school_id = EXCLUDED.school_id,
              academic_year_id = EXCLUDED.academic_year_id,
              class_id = EXCLUDED.class_id,
              section_id = EXCLUDED.section_id,
              obtained_marks = EXCLUDED.obtained_marks,
              max_marks = EXCLUDED.max_marks,
              grade = EXCLUDED.grade,
              remarks = EXCLUDED.remarks,
              created_by = EXCLUDED.created_by,
              updated_at = CURRENT_TIMESTAMP
            `,
            schoolId,
            academicYearId,
            classId,
            sectionId,
            studentId,
            examScheduleId,
            questionPaperId,
            questionId,
            obtained,
            max,
            gradeFor(obtained, max),
            entry.remarks || null,
            user.id || null
          );
        }

        if (
          examId &&
          subjectId
        ) {
          const aggregateRows =
            await tx.$queryRawUnsafe<
              Row[]
            >(
              `
              SELECT id
              FROM marks
              WHERE student_id = $1
                AND exam_id = $2
                AND subject_id = $3
                AND ($4::int IS NULL OR school_id = $4::int)
              ORDER BY id DESC
              LIMIT 1
              `,
              studentId,
              examId,
              subjectId,
              schoolId
            );
          const aggregateId =
            Number(
              aggregateRows[0]?.id
            ) || null;
          const grade =
            gradeFor(
              totalMarks,
              maxMarks
            );

          if (aggregateId) {
            await tx.$executeRawUnsafe(
              `
              UPDATE marks
              SET academic_year_id = $1,
                  total_marks = $2,
                  obtained_marks = $3,
                  grade = $4,
                  remarks = $5
              WHERE id = $6
              `,
              academicYearId,
              maxMarks,
              totalMarks,
              grade,
              body.remarks || null,
              aggregateId
            );
          } else {
            await tx.$executeRawUnsafe(
              `
              INSERT INTO marks (
                school_id,
                academic_year_id,
                student_id,
                subject_id,
                exam_id,
                total_marks,
                obtained_marks,
                grade,
                remarks,
                created_at
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP)
              `,
              schoolId,
              academicYearId,
              studentId,
              subjectId,
              examId,
              maxMarks,
              totalMarks,
              grade,
              body.remarks || null
            );
          }
        }
      }
    );

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "marks",
      event_type: "MARKS_ENTERED",
      action: "evaluate",
      entity_type: "student",
      entity_id: studentId,
      summary:
        "Exam marks entered",
      payload: {
        exam_schedule_id:
          examScheduleId,
        question_paper_id:
          questionPaperId,
        total_marks:
          totalMarks,
        max_marks: maxMarks,
        grade: gradeFor(
          totalMarks,
          maxMarks
        ),
      },
    });

    return NextResponse.json({
      success: true,
      total_marks: totalMarks,
      max_marks: maxMarks,
      grade: gradeFor(
        totalMarks,
        maxMarks
      ),
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to save marks"
    );
  }
}
