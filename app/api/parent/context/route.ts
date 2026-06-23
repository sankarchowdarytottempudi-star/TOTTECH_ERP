import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";
import { getParentLinkedStudents } from "@/lib/parent-access";

type Row = Record<string, unknown>;

const toNumber = (value: string | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function GET(request: Request) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) {
    return guard.response;
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const linkedStudents = await getParentLinkedStudents({
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    full_name: user.full_name,
    school_id: user.school_id,
  });

  const { searchParams } = new URL(request.url);
  const requestedStudentId = toNumber(
    searchParams?.get("student_id")
  );
  const selectedStudentId =
    requestedStudentId ??
    (Number(linkedStudents[0]?.id) || null);
  const selectedStudent =
    linkedStudents.find((student) => student.id === selectedStudentId) ||
    linkedStudents[0] ||
    null;

  if (!selectedStudent) {
    return NextResponse.json({
      linked_students: [],
      selected_student: null,
      attendance: [],
      marks: [],
      question_marks: [],
      homework: [],
      exams: [],
      timetable: [],
      syllabus: [],
      fees: [],
      ptm_meetings: [],
      declarations: [],
    });
  }

  const studentClassId =
    Number(selectedStudent.current_class_id) || -1;
  const studentSectionId =
    Number(selectedStudent.current_section_id) || -1;

  const [attendance, marks, questionMarks, homework, exams, timetable, syllabus, fees, ptmMeetings, declarations] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          a.id,
          a.attendance_date,
          a.status,
          a.remarks
        FROM attendance_master a
        WHERE a.student_id = $1::int
        ORDER BY a.attendance_date DESC, a.id DESC
        LIMIT 60
        `,
        selectedStudent.id
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          m.id,
          m.exam_id,
          m.subject_id,
          m.total_marks,
          m.obtained_marks,
          m.grade,
          m.remarks,
          ex.exam_name,
          ex.exam_type,
          sub.subject_name
        FROM marks m
        LEFT JOIN exams ex ON ex.id = m.exam_id
        LEFT JOIN subjects sub ON sub.id = m.subject_id
        WHERE m.student_id = $1::int
        ORDER BY m.created_at DESC, m.id DESC
        LIMIT 120
        `,
        selectedStudent.id
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          sme.id,
          sme.exam_schedule_id,
          sme.question_paper_id,
          sme.question_id,
          sme.obtained_marks,
          sme.max_marks,
          sme.grade,
          sme.remarks,
          sme.teacher_review_status,
          sme.ai_suggested_marks,
          qb.question_text,
          qb.answer_text,
          qb.ideal_answer,
          qb.rubric,
          qb.max_marks AS question_bank_max_marks,
          es.exam_date,
          es.status AS exam_status,
          COALESCE(sub.subject_name, '') AS subject_name
        FROM student_marks_entry sme
        LEFT JOIN question_bank qb ON qb.id = sme.question_id
        LEFT JOIN exam_schedule es ON es.id = sme.exam_schedule_id
        LEFT JOIN subjects sub ON sub.id = COALESCE(es.subject_id, qb.subject_id)
        WHERE sme.student_id = $1::int
        ORDER BY sme.updated_at DESC, sme.id DESC
        LIMIT 200
        `,
        selectedStudent.id
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          ha.id,
          ha.title,
          ha.description,
          ha.due_date,
          ha.status,
          ha.assignment_type,
          c.class_name,
          sec.section_name,
          sub.subject_name
        FROM homework_assignments ha
        LEFT JOIN classes c ON c.id = ha.class_id
        LEFT JOIN sections sec ON sec.id = ha.section_id
        LEFT JOIN subjects sub ON sub.id = ha.subject_id
        WHERE ($1::int IS NULL OR ha.class_id = $1::int)
          AND ($2::int IS NULL OR ha.section_id = $2::int)
        ORDER BY ha.created_at DESC, ha.id DESC
        LIMIT 120
        `,
        studentClassId,
        studentSectionId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          es.id,
          es.exam_date,
          es.start_time,
          es.end_time,
          es.room_no,
          es.status,
          ex.exam_name,
          ex.exam_type,
          sub.subject_name,
          c.class_name,
          sec.section_name
        FROM exam_schedule es
        LEFT JOIN exams ex ON ex.id = es.exam_id
        LEFT JOIN subjects sub ON sub.id = es.subject_id
        LEFT JOIN classes c ON c.id = es.class_id
        LEFT JOIN sections sec ON sec.id = es.section_id
        WHERE ($1::int IS NULL OR es.class_id = $1::int)
          AND ($2::int IS NULL OR es.section_id = $2::int)
        ORDER BY es.exam_date DESC NULLS LAST, es.start_time ASC NULLS LAST, es.id DESC
        LIMIT 120
        `,
        studentClassId,
        studentSectionId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          te.id,
          te.day_of_week,
          te.start_time,
          te.end_time,
          te.room_no,
          te.status,
          c.class_name,
          sec.section_name,
          sub.subject_name,
          TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name
        FROM timetable_entries te
        LEFT JOIN classes c ON c.id = te.class_id
        LEFT JOIN sections sec ON sec.id = te.section_id
        LEFT JOIN subjects sub ON sub.id = te.subject_id
        LEFT JOIN teachers t ON t.id = te.teacher_id
        WHERE ($1::int IS NULL OR te.class_id = $1::int)
          AND ($2::int IS NULL OR te.section_id = $2::int)
        ORDER BY
          CASE te.day_of_week
            WHEN 'MONDAY' THEN 1
            WHEN 'TUESDAY' THEN 2
            WHEN 'WEDNESDAY' THEN 3
            WHEN 'THURSDAY' THEN 4
            WHEN 'FRIDAY' THEN 5
            WHEN 'SATURDAY' THEN 6
            WHEN 'SUNDAY' THEN 7
            ELSE 8
          END,
          te.start_time ASC NULLS LAST,
          te.id DESC
        LIMIT 120
        `,
        studentClassId,
        studentSectionId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          su.id,
          su.title,
          su.description,
          su.expected_completion_percent,
          su.actual_completion_percent,
          su.completed_periods,
          su.status,
          c.class_name,
          sec.section_name,
          sub.subject_name,
          et.exam_name AS exam_type_name
        FROM syllabus_units su
        LEFT JOIN classes c ON c.id = su.class_id
        LEFT JOIN sections sec ON sec.id = su.section_id
        LEFT JOIN subjects sub ON sub.id = su.subject_id
        LEFT JOIN exam_types et ON et.id = su.exam_type_id
        WHERE ($1::int IS NULL OR su.class_id = $1::int)
          AND ($2::int IS NULL OR su.section_id = $2::int)
        ORDER BY su.created_at DESC, su.id DESC
        LIMIT 120
        `,
        studentClassId,
        studentSectionId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          sfa.id,
          COALESCE(fc.fee_name, 'Fee Assignment') AS fee_name,
          sfa.assigned_amount,
          sfa.discount_amount,
          sfa.academic_year,
          COALESCE(paid.total_paid, 0)::numeric(12,2) AS paid_amount
        FROM student_fee_assignments sfa
        LEFT JOIN fee_categories fc ON fc.id = sfa.fee_category_id
        LEFT JOIN (
          SELECT
            student_id,
            SUM(COALESCE(amount, 0))::numeric(12,2) AS total_paid
          FROM payments
          WHERE student_id = $1::int
          GROUP BY student_id
        ) paid ON paid.student_id = sfa.student_id
        WHERE sfa.student_id = $1::int
        ORDER BY sfa.created_at DESC, sfa.id DESC
        LIMIT 120
        `,
        selectedStudent.id
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          p.id,
          p.meeting_title,
          p.meeting_date,
          p.meeting_time,
          p.status,
          p.mode,
          p.notes,
          p.action_items
        FROM ptm_meetings p
        WHERE p.student_id = $1::int
        ORDER BY p.meeting_date DESC, p.id DESC
        LIMIT 80
        `,
        selectedStudent.id
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          d.id,
          d.declaration_date,
          d.declaration_status,
          d.reason,
          d.created_at
        FROM parent_attendance_declarations d
        WHERE d.student_id = $1::int
        ORDER BY d.declaration_date DESC, d.id DESC
        LIMIT 80
        `,
        selectedStudent.id
      ),
    ]);

  return NextResponse.json({
    linked_students: linkedStudents,
    selected_student: selectedStudent,
    attendance,
    marks,
    question_marks: questionMarks,
    homework,
    exams,
    timetable,
    syllabus,
    fees,
    ptm_meetings: ptmMeetings,
    declarations,
  });
}
