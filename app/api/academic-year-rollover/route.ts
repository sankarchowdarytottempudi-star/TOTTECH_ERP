import { NextResponse } from "next/server";

import {
  resolveMutationContext,
  resolvePlatformContext,
} from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import { prisma } from "@/lib/prisma";

type CountRow = {
  count: number;
};

type YearRow = {
  id: number;
  school_id: number | null;
  academic_year: string | null;
};

type RolloverBody = {
  school_id?: number | string;
  source_academic_year_id?: number | string;
  target_academic_year_id?: number | string;
  action?: string;
  entities?: string[];
  rollover_id?: number | string;
};

const defaultEntities = [
  "students",
  "classes",
  "sections",
  "subjects",
  "teacher_assignments",
  "timetable",
  "exams",
  "exam_schedule",
  "question_papers",
  "homework",
  "transport",
  "dining",
  "hostel",
];

const numberOrNull = (
  value: unknown
) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const normalizeEntities = (
  value: unknown
) => {
  if (!Array.isArray(value)) {
    return defaultEntities;
  }

  const allowed =
    new Set(defaultEntities);
  const selected = value
    .map((item) =>
      String(item)
        .trim()
        .toLowerCase()
    )
    .filter((item) =>
      allowed.has(item)
    );

  return selected.length
    ? selected
    : defaultEntities;
};

async function countSql(
  sql: string,
  ...params: unknown[]
) {
  const rows =
    await prisma.$queryRawUnsafe<
      CountRow[]
    >(sql, ...params);

  return Number(rows[0]?.count || 0);
}

async function tableCounts(
  schoolId: number,
  academicYearId: number
) {
  const [
    students,
    classes,
    sections,
    subjects,
    teacherAssignments,
    timetable,
    exams,
    examSchedule,
    questionPapers,
    homework,
    transportRoutes,
    transportVehicles,
    transportAssignments,
    hostels,
    hostelRooms,
    hostelAllocations,
    diningMealPlans,
    diningMenus,
    diningAssignments,
  ] = await Promise.all([
    countSql(
      "SELECT COUNT(*)::int AS count FROM student_year_enrollments WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM classes WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM sections WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM subjects WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM teacher_class_assignments WHERE school_id = $1 AND academic_year_id = $2 AND COALESCE(status, 'ACTIVE') = 'ACTIVE'",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM timetable_entries WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM exams WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM exam_schedule WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM question_papers WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM homework_assignments WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM transport_routes WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM transport_vehicles WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM transport_assignments WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM hostels WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM hostel_rooms WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM hostel_allocations WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM dining_meal_plans WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM dining_weekly_menus WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
    countSql(
      "SELECT COUNT(*)::int AS count FROM dining_meal_assignments WHERE school_id = $1 AND academic_year_id = $2",
      schoolId,
      academicYearId
    ),
  ]);

  return {
    students,
    classes,
    sections,
    subjects,
    teacherAssignments,
    timetable,
    exams,
    examSchedule,
    questionPapers,
    homework,
    transportRoutes,
    transportVehicles,
    transportAssignments,
    hostels,
    hostelRooms,
    hostelAllocations,
    diningMealPlans,
    diningMenus,
    diningAssignments,
  };
}

async function insertItem(
  rolloverId: number,
  entityType: string,
  status: string,
  message: string,
  metadata: Record<string, unknown> = {},
  userId: number | null = null
) {
  await prisma.$executeRawUnsafe(
    `
    INSERT INTO academic_year_rollover_items (
      rollover_id,
      entity_type,
      status,
      message,
      metadata,
      created_by,
      updated_by,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5::jsonb,$6,$6,CURRENT_TIMESTAMP)
    `,
    rolloverId,
    entityType,
    status,
    message,
    JSON.stringify(metadata),
    userId
  );
}

async function copyRows(
  sql: string,
  ...params: unknown[]
) {
  const rows =
    await prisma.$queryRawUnsafe<
      { id: number }[]
    >(sql, ...params);

  return rows.length;
}

async function deleteRows(
  sql: string,
  ...params: unknown[]
) {
  const rows =
    await prisma.$queryRawUnsafe<
      { id: number }[]
    >(sql, ...params);

  return rows.length;
}

async function executeRolloverCopies(
  schoolId: number,
  sourceYearId: number,
  targetYearId: number,
  userId: number | null,
  entities: string[],
  rolloverId: number
) {
  const has = (entity: string) =>
    entities.includes(entity);
  const copied: Record<string, number> = {};
  const logItem = (
    entityType: string,
    status: string,
    message: string,
    metadata: Record<string, unknown> = {}
  ) =>
    insertItem(
      rolloverId,
      entityType,
      status,
      message,
      metadata,
      userId
    );

  if (has("classes")) {
    copied.classes = await copyRows(
      `
      INSERT INTO classes (
        school_id,
        academic_year_id,
        class_name,
        class_teacher_id,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT c.school_id, $3, c.class_name, c.class_teacher_id, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM classes c
      WHERE c.school_id = $1
        AND c.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM classes existing
          WHERE existing.school_id = c.school_id
            AND existing.academic_year_id = $3
            AND lower(existing.class_name) = lower(c.class_name)
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId
    );
    await logItem(
      "classes",
      "COPIED",
      `${copied.classes} classes copied`
    );
  }

  if (has("sections")) {
    copied.sections = await copyRows(
      `
      INSERT INTO sections (
        school_id,
        academic_year_id,
        class_id,
        section_name,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT s.school_id, $3, target_class.id, s.section_name, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM sections s
      JOIN classes source_class ON source_class.id = s.class_id
      JOIN classes target_class
        ON target_class.school_id = s.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      WHERE s.school_id = $1
        AND s.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM sections existing
          WHERE existing.school_id = s.school_id
            AND existing.academic_year_id = $3
            AND existing.class_id = target_class.id
            AND lower(COALESCE(existing.section_name, '')) = lower(COALESCE(s.section_name, ''))
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId
    );
    await logItem(
      "sections",
      "COPIED",
      `${copied.sections} sections copied`
    );
  }

  if (has("subjects")) {
    copied.subjects = await copyRows(
      `
      INSERT INTO subjects (
        school_id,
        academic_year_id,
        subject_name,
        subject_code,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT s.school_id, $3, s.subject_name, s.subject_code, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM subjects s
      WHERE s.school_id = $1
        AND s.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM subjects existing
          WHERE existing.school_id = s.school_id
            AND existing.academic_year_id = $3
            AND lower(COALESCE(existing.subject_code, existing.subject_name, '')) =
                lower(COALESCE(s.subject_code, s.subject_name, ''))
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId
    );
    await logItem(
      "subjects",
      "COPIED",
      `${copied.subjects} subjects copied`
    );
  }

  if (has("students")) {
    copied.students = await copyRows(
      `
      INSERT INTO student_year_enrollments (
        school_id,
        student_id,
        academic_year_id,
        class_id,
        section_id,
        roll_number,
        status,
        source,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      SELECT sye.school_id,
             sye.student_id,
             $3,
             target_class.id,
             target_section.id,
             sye.roll_number,
             COALESCE(sye.status, 'ACTIVE'),
             'academic_year_rollover',
             jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $4::int),
             $5,
             $5,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
      FROM student_year_enrollments sye
      LEFT JOIN classes source_class ON source_class.id = sye.class_id
      LEFT JOIN sections source_section ON source_section.id = sye.section_id
      LEFT JOIN classes target_class
        ON target_class.school_id = sye.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      LEFT JOIN sections target_section
        ON target_section.school_id = sye.school_id
       AND target_section.academic_year_id = $3
       AND target_section.class_id = target_class.id
       AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
      WHERE sye.school_id = $1
        AND sye.academic_year_id = $2
        AND COALESCE(sye.status, 'ACTIVE') = 'ACTIVE'
        AND target_class.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM student_year_enrollments existing
          WHERE existing.student_id = sye.student_id
            AND existing.academic_year_id = $3
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      rolloverId,
      userId
    );
    await logItem(
      "students",
      "COPIED",
      `${copied.students} same-class student enrollments carried forward`,
      {
        note:
          "Class promotion workflow remains the primary path for class advancement.",
      }
    );
  }

  if (has("teacher_assignments")) {
    copied.teacherAssignments =
      await copyRows(
        `
        INSERT INTO teacher_class_assignments (
          school_id,
          academic_year_id,
          teacher_id,
          class_id,
          section_id,
          subject_id,
          assignment_type,
          status,
          assigned_by,
          assigned_at,
          created_by,
          updated_by,
          created_at,
          updated_at,
          metadata
        )
        SELECT tca.school_id,
               $3,
               tca.teacher_id,
               target_class.id,
               target_section.id,
               target_subject.id,
               COALESCE(tca.assignment_type, 'CLASS_TEACHER'),
               COALESCE(tca.status, 'ACTIVE'),
               $4,
               CURRENT_TIMESTAMP,
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP,
               COALESCE(tca.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int)
        FROM teacher_class_assignments tca
        LEFT JOIN classes source_class ON source_class.id = tca.class_id
        LEFT JOIN sections source_section ON source_section.id = tca.section_id
        LEFT JOIN subjects source_subject ON source_subject.id = tca.subject_id
        LEFT JOIN classes target_class
          ON target_class.school_id = tca.school_id
         AND target_class.academic_year_id = $3
         AND lower(target_class.class_name) = lower(source_class.class_name)
        LEFT JOIN sections target_section
          ON target_section.school_id = tca.school_id
         AND target_section.academic_year_id = $3
         AND target_section.class_id = target_class.id
         AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
        LEFT JOIN subjects target_subject
          ON target_subject.school_id = tca.school_id
         AND target_subject.academic_year_id = $3
         AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
             lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
        WHERE tca.school_id = $1
          AND tca.academic_year_id = $2
          AND COALESCE(tca.status, 'ACTIVE') = 'ACTIVE'
          AND target_class.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1
            FROM teacher_class_assignments existing
            WHERE existing.school_id = tca.school_id
              AND existing.academic_year_id = $3
              AND existing.teacher_id = tca.teacher_id
              AND existing.class_id = target_class.id
              AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
              AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
              AND COALESCE(existing.assignment_type, '') = COALESCE(tca.assignment_type, '')
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId,
        rolloverId
      );
    await logItem(
      "teacher_assignments",
      "COPIED",
      `${copied.teacherAssignments} teacher assignments copied`
    );
  }

  if (has("timetable")) {
    copied.timetable = await copyRows(
      `
      INSERT INTO timetable_entries (
        school_id,
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id,
        day_of_week,
        start_time,
        end_time,
        room_no,
        status,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      SELECT te.school_id,
             $3,
             target_class.id,
             target_section.id,
             target_subject.id,
             te.teacher_id,
             te.day_of_week,
             te.start_time,
             te.end_time,
             te.room_no,
             COALESCE(te.status, 'ACTIVE'),
             COALESCE(te.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
             $4,
             $4,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
      FROM timetable_entries te
      LEFT JOIN classes source_class ON source_class.id = te.class_id
      LEFT JOIN sections source_section ON source_section.id = te.section_id
      LEFT JOIN subjects source_subject ON source_subject.id = te.subject_id
      LEFT JOIN classes target_class
        ON target_class.school_id = te.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      LEFT JOIN sections target_section
        ON target_section.school_id = te.school_id
       AND target_section.academic_year_id = $3
       AND target_section.class_id = target_class.id
       AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
      LEFT JOIN subjects target_subject
        ON target_subject.school_id = te.school_id
       AND target_subject.academic_year_id = $3
       AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
           lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
      WHERE te.school_id = $1
        AND te.academic_year_id = $2
        AND target_class.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM timetable_entries existing
          WHERE existing.school_id = te.school_id
            AND existing.academic_year_id = $3
            AND existing.class_id = target_class.id
            AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
            AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
            AND COALESCE(existing.teacher_id, 0) = COALESCE(te.teacher_id, 0)
            AND COALESCE(existing.day_of_week, '') = COALESCE(te.day_of_week, '')
            AND COALESCE(existing.start_time::text, '') = COALESCE(te.start_time::text, '')
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId,
      rolloverId
    );
    await logItem(
      "timetable",
      "COPIED",
      `${copied.timetable} timetable entries copied`
    );
  }

  if (has("exams")) {
    copied.exams = await copyRows(
      `
      INSERT INTO exams (
        school_id,
        academic_year_id,
        exam_name,
        exam_type,
        start_date,
        end_date,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT e.school_id,
             $3,
             e.exam_name,
             e.exam_type,
             e.start_date + INTERVAL '1 year',
             e.end_date + INTERVAL '1 year',
             $4,
             CURRENT_TIMESTAMP,
             $4,
             CURRENT_TIMESTAMP
      FROM exams e
      WHERE e.school_id = $1
        AND e.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM exams existing
          WHERE existing.school_id = e.school_id
            AND existing.academic_year_id = $3
            AND lower(COALESCE(existing.exam_name, '')) = lower(COALESCE(e.exam_name, ''))
            AND lower(COALESCE(existing.exam_type, '')) = lower(COALESCE(e.exam_type, ''))
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId
    );
    await logItem(
      "exams",
      "COPIED",
      `${copied.exams} exams copied`
    );
  }

  if (has("question_papers")) {
    copied.questionPapers =
      await copyRows(
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
          duration_minutes,
          instructions,
          exam_date,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT qp.school_id,
               $3,
               target_exam.id,
               qp.exam_type_id,
               target_class.id,
               target_section.id,
               target_subject.id,
               qp.paper_name,
               qp.total_marks,
               qp.duration_minutes,
               qp.instructions,
               qp.exam_date + INTERVAL '1 year',
               COALESCE(qp.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM question_papers qp
        LEFT JOIN exams source_exam ON source_exam.id = qp.exam_id
        LEFT JOIN exams target_exam
          ON target_exam.school_id = qp.school_id
         AND target_exam.academic_year_id = $3
         AND lower(COALESCE(target_exam.exam_name, '')) = lower(COALESCE(source_exam.exam_name, ''))
         AND lower(COALESCE(target_exam.exam_type, '')) = lower(COALESCE(source_exam.exam_type, ''))
        LEFT JOIN classes source_class ON source_class.id = qp.class_id
        LEFT JOIN sections source_section ON source_section.id = qp.section_id
        LEFT JOIN subjects source_subject ON source_subject.id = qp.subject_id
        LEFT JOIN classes target_class
          ON target_class.school_id = qp.school_id
         AND target_class.academic_year_id = $3
         AND lower(target_class.class_name) = lower(source_class.class_name)
        LEFT JOIN sections target_section
          ON target_section.school_id = qp.school_id
         AND target_section.academic_year_id = $3
         AND target_section.class_id = target_class.id
         AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
        LEFT JOIN subjects target_subject
          ON target_subject.school_id = qp.school_id
         AND target_subject.academic_year_id = $3
         AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
             lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
        WHERE qp.school_id = $1
          AND qp.academic_year_id = $2
          AND target_class.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1
            FROM question_papers existing
            WHERE existing.school_id = qp.school_id
              AND existing.academic_year_id = $3
              AND lower(COALESCE(existing.paper_name, '')) = lower(COALESCE(qp.paper_name, ''))
              AND COALESCE(existing.class_id, 0) = COALESCE(target_class.id, 0)
              AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
              AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId,
        rolloverId
      );
    await logItem(
      "question_papers",
      "COPIED",
      `${copied.questionPapers} question papers copied`
    );
  }

  if (has("exam_schedule")) {
    copied.examSchedule = await copyRows(
      `
      INSERT INTO exam_schedule (
        school_id,
        academic_year_id,
        exam_id,
        exam_type_id,
        question_paper_id,
        class_id,
        section_id,
        subject_id,
        exam_date,
        start_time,
        end_time,
        room_no,
        invigilator_teacher_id,
        status,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      SELECT es.school_id,
             $3,
             target_exam.id,
             es.exam_type_id,
             NULL,
             target_class.id,
             target_section.id,
             target_subject.id,
             es.exam_date + INTERVAL '1 year',
             es.start_time,
             es.end_time,
             es.room_no,
             es.invigilator_teacher_id,
             COALESCE(es.status, 'SCHEDULED'),
             COALESCE(es.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
             $4,
             $4,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
      FROM exam_schedule es
      LEFT JOIN exams source_exam ON source_exam.id = es.exam_id
      LEFT JOIN exams target_exam
        ON target_exam.school_id = es.school_id
       AND target_exam.academic_year_id = $3
       AND lower(COALESCE(target_exam.exam_name, '')) = lower(COALESCE(source_exam.exam_name, ''))
       AND lower(COALESCE(target_exam.exam_type, '')) = lower(COALESCE(source_exam.exam_type, ''))
      LEFT JOIN classes source_class ON source_class.id = es.class_id
      LEFT JOIN sections source_section ON source_section.id = es.section_id
      LEFT JOIN subjects source_subject ON source_subject.id = es.subject_id
      LEFT JOIN classes target_class
        ON target_class.school_id = es.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      LEFT JOIN sections target_section
        ON target_section.school_id = es.school_id
       AND target_section.academic_year_id = $3
       AND target_section.class_id = target_class.id
       AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
      LEFT JOIN subjects target_subject
        ON target_subject.school_id = es.school_id
       AND target_subject.academic_year_id = $3
       AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
           lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
      WHERE es.school_id = $1
        AND es.academic_year_id = $2
        AND target_class.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM exam_schedule existing
          WHERE existing.school_id = es.school_id
            AND existing.academic_year_id = $3
            AND COALESCE(existing.exam_id, 0) = COALESCE(target_exam.id, 0)
            AND COALESCE(existing.class_id, 0) = COALESCE(target_class.id, 0)
            AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
            AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
            AND existing.exam_date = es.exam_date + INTERVAL '1 year'
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId,
      rolloverId
    );
    await logItem(
      "exam_schedule",
      "COPIED",
      `${copied.examSchedule} exam schedules copied`
    );
  }

  if (has("homework")) {
    copied.homework = await copyRows(
      `
      INSERT INTO homework_assignments (
        school_id,
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id,
        title,
        description,
        due_date,
        status,
        assignment_type,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      SELECT ha.school_id,
             $3,
             target_class.id,
             target_section.id,
             target_subject.id,
             ha.teacher_id,
             ha.title,
             ha.description,
             ha.due_date + INTERVAL '1 year',
             'DRAFT',
             COALESCE(ha.assignment_type, 'CLASS_SECTION'),
             COALESCE(ha.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
             $4,
             $4,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
      FROM homework_assignments ha
      LEFT JOIN classes source_class ON source_class.id = ha.class_id
      LEFT JOIN sections source_section ON source_section.id = ha.section_id
      LEFT JOIN subjects source_subject ON source_subject.id = ha.subject_id
      LEFT JOIN classes target_class
        ON target_class.school_id = ha.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      LEFT JOIN sections target_section
        ON target_section.school_id = ha.school_id
       AND target_section.academic_year_id = $3
       AND target_section.class_id = target_class.id
       AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
      LEFT JOIN subjects target_subject
        ON target_subject.school_id = ha.school_id
       AND target_subject.academic_year_id = $3
       AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
           lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
      WHERE ha.school_id = $1
        AND ha.academic_year_id = $2
        AND target_class.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM homework_assignments existing
          WHERE existing.school_id = ha.school_id
            AND existing.academic_year_id = $3
            AND COALESCE(existing.class_id, 0) = COALESCE(target_class.id, 0)
            AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
            AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
            AND lower(COALESCE(existing.title, '')) = lower(COALESCE(ha.title, ''))
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId,
      rolloverId
    );
    await logItem(
      "homework",
      "COPIED",
      `${copied.homework} homework assignments copied as drafts`
    );
  }

  if (has("transport")) {
    copied.transportRoutes =
      await copyRows(
        `
        INSERT INTO transport_routes (
          school_id,
          academic_year_id,
          route_name,
          vehicle_number,
          driver_name,
          driver_phone,
          created_by,
          created_at,
          updated_by,
          updated_at
        )
        SELECT tr.school_id, $3, tr.route_name, tr.vehicle_number, tr.driver_name, tr.driver_phone, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
        FROM transport_routes tr
        WHERE tr.school_id = $1
          AND tr.academic_year_id = $2
          AND NOT EXISTS (
            SELECT 1 FROM transport_routes existing
            WHERE existing.school_id = tr.school_id
              AND existing.academic_year_id = $3
              AND lower(COALESCE(existing.route_name, '')) = lower(COALESCE(tr.route_name, ''))
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId
      );
    copied.transportVehicles =
      await copyRows(
        `
        INSERT INTO transport_vehicles (
          school_id,
          academic_year_id,
          vehicle_number,
          vehicle_type,
          capacity,
          driver_name,
          driver_phone,
          created_by,
          created_at,
          updated_by,
          updated_at
        )
        SELECT tv.school_id, $3, tv.vehicle_number, tv.vehicle_type, tv.capacity, tv.driver_name, tv.driver_phone, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
        FROM transport_vehicles tv
        WHERE tv.school_id = $1
          AND tv.academic_year_id = $2
          AND NOT EXISTS (
            SELECT 1 FROM transport_vehicles existing
            WHERE existing.school_id = tv.school_id
              AND existing.academic_year_id = $3
              AND lower(COALESCE(existing.vehicle_number, '')) = lower(COALESCE(tv.vehicle_number, ''))
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId
      );
    copied.transportAssignments =
      await copyRows(
        `
        INSERT INTO transport_assignments (
          school_id,
          academic_year_id,
          assigned_to_type,
          student_id,
          teacher_id,
          staff_id,
          route_id,
          pickup_point,
          drop_point,
          status,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT ta.school_id,
               $3,
               ta.assigned_to_type,
               ta.student_id,
               ta.teacher_id,
               ta.staff_id,
               target_route.id,
               ta.pickup_point,
               ta.drop_point,
               COALESCE(ta.status, 'ACTIVE'),
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM transport_assignments ta
        LEFT JOIN transport_routes source_route ON source_route.id = ta.route_id
        LEFT JOIN transport_routes target_route
          ON target_route.school_id = ta.school_id
         AND target_route.academic_year_id = $3
         AND lower(COALESCE(target_route.route_name, '')) = lower(COALESCE(source_route.route_name, ''))
        WHERE ta.school_id = $1
          AND ta.academic_year_id = $2
          AND COALESCE(ta.status, 'ACTIVE') = 'ACTIVE'
          AND target_route.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM transport_assignments existing
            WHERE existing.school_id = ta.school_id
              AND existing.academic_year_id = $3
              AND COALESCE(existing.student_id, 0) = COALESCE(ta.student_id, 0)
              AND COALESCE(existing.teacher_id, 0) = COALESCE(ta.teacher_id, 0)
              AND existing.route_id = target_route.id
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId
      );
    await logItem(
      "transport",
      "COPIED",
      `${copied.transportRoutes} routes, ${copied.transportVehicles} vehicles, ${copied.transportAssignments} assignments copied`
    );
  }

  if (has("dining")) {
    copied.diningMealPlans =
      await copyRows(
        `
        INSERT INTO dining_meal_plans (
          school_id,
          academic_year_id,
          plan_name,
          meal_type,
          price,
          status,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT dmp.school_id, $3, dmp.plan_name, dmp.meal_type, dmp.price, COALESCE(dmp.status, 'ACTIVE'), COALESCE(dmp.metadata, '{}'::jsonb), $4, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        FROM dining_meal_plans dmp
        WHERE dmp.school_id = $1
          AND dmp.academic_year_id = $2
          AND NOT EXISTS (
            SELECT 1 FROM dining_meal_plans existing
            WHERE existing.school_id = dmp.school_id
              AND existing.academic_year_id = $3
              AND lower(COALESCE(existing.plan_name, '')) = lower(COALESCE(dmp.plan_name, ''))
              AND lower(COALESCE(existing.meal_type, '')) = lower(COALESCE(dmp.meal_type, ''))
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId
      );
    copied.diningMenus =
      await copyRows(
        `
        INSERT INTO dining_weekly_menus (
          school_id,
          academic_year_id,
          week_start,
          day_of_week,
          meal_type,
          menu_items,
          nutrition_notes,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT dwm.school_id,
               $3,
               dwm.week_start + INTERVAL '1 year',
               dwm.day_of_week,
               dwm.meal_type,
               dwm.menu_items,
               dwm.nutrition_notes,
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM dining_weekly_menus dwm
        WHERE dwm.school_id = $1
          AND dwm.academic_year_id = $2
          AND NOT EXISTS (
            SELECT 1 FROM dining_weekly_menus existing
            WHERE existing.school_id = dwm.school_id
              AND existing.academic_year_id = $3
              AND existing.week_start = dwm.week_start + INTERVAL '1 year'
              AND COALESCE(existing.day_of_week, '') = COALESCE(dwm.day_of_week, '')
              AND COALESCE(existing.meal_type, '') = COALESCE(dwm.meal_type, '')
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId
      );
    copied.diningAssignments =
      await copyRows(
        `
        INSERT INTO dining_meal_assignments (
          school_id,
          academic_year_id,
          meal_plan_id,
          student_id,
          teacher_id,
          staff_id,
          start_date,
          end_date,
          status,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT dma.school_id,
               $3,
               target_plan.id,
               dma.student_id,
               dma.teacher_id,
               dma.staff_id,
               dma.start_date + INTERVAL '1 year',
               dma.end_date + INTERVAL '1 year',
               COALESCE(dma.status, 'ACTIVE'),
               COALESCE(dma.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM dining_meal_assignments dma
        LEFT JOIN dining_meal_plans source_plan ON source_plan.id = dma.meal_plan_id
        LEFT JOIN dining_meal_plans target_plan
          ON target_plan.school_id = dma.school_id
         AND target_plan.academic_year_id = $3
         AND lower(COALESCE(target_plan.plan_name, '')) = lower(COALESCE(source_plan.plan_name, ''))
         AND lower(COALESCE(target_plan.meal_type, '')) = lower(COALESCE(source_plan.meal_type, ''))
        WHERE dma.school_id = $1
          AND dma.academic_year_id = $2
          AND COALESCE(dma.status, 'ACTIVE') = 'ACTIVE'
          AND target_plan.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM dining_meal_assignments existing
            WHERE existing.school_id = dma.school_id
              AND existing.academic_year_id = $3
              AND COALESCE(existing.student_id, 0) = COALESCE(dma.student_id, 0)
              AND COALESCE(existing.teacher_id, 0) = COALESCE(dma.teacher_id, 0)
              AND existing.meal_plan_id = target_plan.id
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId,
        rolloverId
      );
    await logItem(
      "dining",
      "COPIED",
      `${copied.diningMealPlans} meal plans, ${copied.diningMenus} menus, ${copied.diningAssignments} meal assignments copied`
    );
  }

  if (has("hostel")) {
    copied.hostels = await copyRows(
      `
      INSERT INTO hostels (
        school_id,
        academic_year_id,
        hostel_name,
        hostel_type,
        warden_name,
        warden_phone,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT h.school_id, $3, h.hostel_name, h.hostel_type, h.warden_name, h.warden_phone, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM hostels h
      WHERE h.school_id = $1
        AND h.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1 FROM hostels existing
          WHERE existing.school_id = h.school_id
            AND existing.academic_year_id = $3
            AND lower(COALESCE(existing.hostel_name, '')) = lower(COALESCE(h.hostel_name, ''))
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId
    );
    copied.hostelRooms = await copyRows(
      `
      INSERT INTO hostel_rooms (
        school_id,
        academic_year_id,
        room_number,
        hostel_name,
        capacity,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT hr.school_id, $3, hr.room_number, hr.hostel_name, hr.capacity, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM hostel_rooms hr
      WHERE hr.school_id = $1
        AND hr.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1 FROM hostel_rooms existing
          WHERE existing.school_id = hr.school_id
            AND existing.academic_year_id = $3
            AND lower(COALESCE(existing.hostel_name, '')) = lower(COALESCE(hr.hostel_name, ''))
            AND lower(COALESCE(existing.room_number, '')) = lower(COALESCE(hr.room_number, ''))
        )
      RETURNING id
      `,
      schoolId,
      sourceYearId,
      targetYearId,
      userId
    );
    copied.hostelAllocations =
      await copyRows(
        `
        INSERT INTO hostel_allocations (
          school_id,
          academic_year_id,
          student_id,
          hostel_id,
          room_id,
          bed_number,
          allocation_date,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT ha.school_id,
               $3,
               ha.student_id,
               target_hostel.id,
               target_room.id,
               ha.bed_number,
               ha.allocation_date + INTERVAL '1 year',
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM hostel_allocations ha
        LEFT JOIN hostels source_hostel ON source_hostel.id = ha.hostel_id
        LEFT JOIN hostel_rooms source_room ON source_room.id = ha.room_id
        LEFT JOIN hostels target_hostel
          ON target_hostel.school_id = ha.school_id
         AND target_hostel.academic_year_id = $3
         AND lower(COALESCE(target_hostel.hostel_name, '')) = lower(COALESCE(source_hostel.hostel_name, ''))
        LEFT JOIN hostel_rooms target_room
          ON target_room.school_id = ha.school_id
         AND target_room.academic_year_id = $3
         AND lower(COALESCE(target_room.hostel_name, '')) = lower(COALESCE(source_room.hostel_name, ''))
         AND lower(COALESCE(target_room.room_number, '')) = lower(COALESCE(source_room.room_number, ''))
        WHERE ha.school_id = $1
          AND ha.academic_year_id = $2
          AND target_hostel.id IS NOT NULL
          AND target_room.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM hostel_allocations existing
            WHERE existing.school_id = ha.school_id
              AND existing.academic_year_id = $3
              AND existing.student_id = ha.student_id
              AND existing.hostel_id = target_hostel.id
              AND existing.room_id = target_room.id
          )
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        userId
      );
    await logItem(
      "hostel",
      "COPIED",
      `${copied.hostels} hostels, ${copied.hostelRooms} rooms, ${copied.hostelAllocations} allocations copied`
    );
  }

  copied.marks = 0;
  await logItem(
    "marks",
    "PRESERVED",
    "Marks remain historical and are not copied into the target year.",
    {
      reason:
        "Marks are operational history; copying them would corrupt year-specific academic evidence.",
    }
  );

  return copied;
}

async function rollbackRolloverCopies(
  schoolId: number,
  sourceYearId: number,
  targetYearId: number,
  userId: number | null,
  rolloverId: number
) {
  const deletions: Record<string, number> = {};

  deletions.studentYearEnrollments =
    await deleteRows(
      `
      DELETE FROM student_year_enrollments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.teacherAssignments =
    await deleteRows(
      `
      DELETE FROM teacher_class_assignments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.timetable =
    await deleteRows(
      `
      DELETE FROM timetable_entries
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.questionPapers =
    await deleteRows(
      `
      DELETE FROM question_papers
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.examSchedule =
    await deleteRows(
      `
      DELETE FROM exam_schedule
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.homework =
    await deleteRows(
      `
      DELETE FROM homework_assignments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.transportAssignments =
    await deleteRows(
      `
      DELETE FROM transport_assignments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.diningAssignments =
    await deleteRows(
      `
      DELETE FROM dining_meal_assignments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.hostelAllocations =
    await deleteRows(
      `
      DELETE FROM hostel_allocations
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,
      schoolId,
      targetYearId,
      rolloverId
    );

  deletions.exams =
    await deleteRows(
      `
      DELETE FROM exams
      WHERE school_id = $1
        AND academic_year_id = $2
        AND created_by = $3
        AND created_at >= COALESCE((SELECT executed_at FROM academic_year_rollovers WHERE id = $4), created_at)
      RETURNING id
      `,
      schoolId,
      targetYearId,
      userId,
      rolloverId
    );

  deletions.classes =
    await deleteRows(
      `
      DELETE FROM classes
      WHERE school_id = $1
        AND academic_year_id = $2
        AND created_by = $3
        AND created_at >= COALESCE((SELECT executed_at FROM academic_year_rollovers WHERE id = $4), created_at)
      RETURNING id
      `,
      schoolId,
      targetYearId,
      userId,
      rolloverId
    );

  deletions.sections =
    await deleteRows(
      `
      DELETE FROM sections
      WHERE school_id = $1
        AND academic_year_id = $2
        AND created_by = $3
        AND created_at >= COALESCE((SELECT executed_at FROM academic_year_rollovers WHERE id = $4), created_at)
      RETURNING id
      `,
      schoolId,
      targetYearId,
      userId,
      rolloverId
    );

  deletions.subjects =
    await deleteRows(
      `
      DELETE FROM subjects
      WHERE school_id = $1
        AND academic_year_id = $2
        AND created_by = $3
        AND created_at >= COALESCE((SELECT executed_at FROM academic_year_rollovers WHERE id = $4), created_at)
      RETURNING id
      `,
      schoolId,
      targetYearId,
      userId,
      rolloverId
    );

  await prisma.$executeRawUnsafe(
    `
    UPDATE academic_year_rollovers
    SET status = 'ROLLED_BACK',
        metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
          'rolledBackAt', CURRENT_TIMESTAMP,
          'rolledBackBy', $2::int,
          'rolledBackSourceAcademicYearId', $3::int,
          'rolledBackTargetAcademicYearId', $4::int,
          'rolledBackCounts', $5::jsonb
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    rolloverId,
    userId,
    sourceYearId,
    targetYearId,
    JSON.stringify(deletions)
  );

  return deletions;
}

async function validateYears(
  schoolId: number,
  sourceYearId: number,
  targetYearId: number
) {
  if (sourceYearId === targetYearId) {
    return {
      error:
        "Source and target academic years must be different.",
    };
  }

  const rows =
    await prisma.$queryRawUnsafe<
      YearRow[]
    >(
      `
      SELECT id, school_id, academic_year
      FROM academic_years
      WHERE id IN ($1, $2)
        AND (school_id = $3 OR school_id IS NULL)
      `,
      sourceYearId,
      targetYearId,
      schoolId
    );

  if (rows.length !== 2) {
    return {
      error:
        "Source and target academic years must exist in the selected school context.",
    };
  }

  return {
    error: null,
    years: rows,
  };
}

export async function GET(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "promotions",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const context =
    await resolvePlatformContext(
      request
    );

  if (!context) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const rollovers =
    await prisma.$queryRawUnsafe(
      `
      SELECT
        ayr.*,
        s.school_name,
        source_year.academic_year AS source_academic_year,
        target_year.academic_year AS target_academic_year
      FROM academic_year_rollovers ayr
      LEFT JOIN schools s ON s.id = ayr.school_id
      LEFT JOIN academic_years source_year ON source_year.id = ayr.source_academic_year_id
      LEFT JOIN academic_years target_year ON target_year.id = ayr.target_academic_year_id
      WHERE ($1::int IS NULL OR ayr.school_id = $1::int)
        AND ($2::int IS NULL OR ayr.source_academic_year_id = $2::int OR ayr.target_academic_year_id = $2::int)
      ORDER BY ayr.created_at DESC
      LIMIT 100
      `,
      context.schoolId,
      context.academicYearId
    );

  return NextResponse.json({
    rollovers,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "promotions",
      action: "create",
    });

  if (auth.response) {
    return auth.response;
  }

  try {
    const body =
      (await request.json()) as RolloverBody;
    const sourceYearId =
      numberOrNull(
        body.source_academic_year_id
      );
    const targetYearId =
      numberOrNull(
        body.target_academic_year_id
      );

    if (
      !sourceYearId ||
      !targetYearId
    ) {
      return NextResponse.json(
        {
          error:
            "Source and target academic years are required for rollover.",
        },
        {
          status: 400,
        }
      );
    }

    const { context, error } =
      await resolveMutationContext(
        request,
        {
          ...body,
          academic_year_id:
            sourceYearId,
        } as Record<string, unknown>
      );

    if (!context) {
      return NextResponse.json(
        {
          error,
        },
        {
          status: 400,
        }
      );
    }

    const schoolId =
      context.requiredSchoolId;
    const yearValidation =
      await validateYears(
        schoolId,
        sourceYearId,
        targetYearId
      );

    if (yearValidation.error) {
      return NextResponse.json(
        {
          error:
            yearValidation.error,
        },
        {
          status: 400,
        }
      );
    }

    const entities =
      normalizeEntities(
        body.entities
      );
    const sourceCounts =
      await tableCounts(
        schoolId,
        sourceYearId
      );
    const targetCountsBefore =
      await tableCounts(
        schoolId,
        targetYearId
      );

    const validationErrors: string[] =
      [];

    if (
      entities.includes("sections") &&
      sourceCounts.classes > 0 &&
      sourceCounts.sections > 0 &&
      !entities.includes("classes")
    ) {
      validationErrors.push(
        "Sections depend on classes. Include classes before rolling over sections."
      );
    }

    if (
      entities.includes("students") &&
      targetCountsBefore.classes === 0 &&
      sourceCounts.students > 0 &&
      !entities.includes("classes")
    ) {
      validationErrors.push(
        "Student carry-forward requires target classes. Preview or execute classes first."
      );
    }

    const action = String(
      body.action || "PREVIEW"
    ).toUpperCase();

    if (action === "PREVIEW") {
      return NextResponse.json({
        status: "PREVIEW",
        school_id: schoolId,
        source_academic_year_id:
          sourceYearId,
        target_academic_year_id:
          targetYearId,
        entities,
        sourceCounts,
        targetCountsBefore,
        validationErrors,
        canExecute:
          validationErrors.length === 0,
      });
    }

    if (
      action !== "EXECUTE"
    ) {
      return NextResponse.json(
        {
          error:
            "Rollover action must be PREVIEW or EXECUTE.",
        },
        {
          status: 400,
        }
      );
    }

    if (validationErrors.length) {
      return NextResponse.json(
        {
          error:
            "Rollover validation failed.",
          validationErrors,
        },
        {
          status: 400,
        }
      );
    }

    const rolloverRows =
      await prisma.$queryRawUnsafe<
        { id: number }[]
      >(
        `
        INSERT INTO academic_year_rollovers (
          school_id,
          source_academic_year_id,
          target_academic_year_id,
          status,
          requested_by,
          approved_by,
          executed_by,
          approved_at,
          executed_at,
          source_counts,
          target_counts,
          validation_errors,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,'EXECUTED',$4,$4,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$5::jsonb,$6::jsonb,$7::jsonb,$8::jsonb,$4,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING id
        `,
        schoolId,
        sourceYearId,
        targetYearId,
        context.updatedBy,
        JSON.stringify(sourceCounts),
        JSON.stringify(
          targetCountsBefore
        ),
        JSON.stringify(
          validationErrors
        ),
        JSON.stringify({
          entities,
          flow:
            "preview_validate_approve_execute_audit",
        })
      );
    const rolloverId =
      rolloverRows[0]?.id;

    const copiedCounts =
      await executeRolloverCopies(
        schoolId,
        sourceYearId,
        targetYearId,
        context.updatedBy,
        entities,
        rolloverId
      );
    const targetCountsAfter =
      await tableCounts(
        schoolId,
        targetYearId
      );

    await prisma.$executeRawUnsafe(
      `
      UPDATE academic_year_rollovers
      SET copied_counts = $1::jsonb,
          target_counts = $2::jsonb,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      JSON.stringify(copiedCounts),
      JSON.stringify(
        targetCountsAfter
      ),
      rolloverId
    );

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        targetYearId,
      user_id:
        context.updatedBy,
      actor_role:
        context.user.role,
      module_name:
        "academic_year",
      event_type:
        "ACADEMIC_YEAR_ROLLOVER_EXECUTED",
      action: "rollover",
      entity_type:
        "academic_year_rollover",
      entity_id: rolloverId,
      summary:
        "Academic year rollover executed",
      payload: {
        rolloverId,
        sourceAcademicYearId:
          sourceYearId,
        targetAcademicYearId:
          targetYearId,
        copiedCounts,
        entities,
      },
    });

    return NextResponse.json(
      {
        status: "EXECUTED",
        rolloverId,
        copiedCounts,
        sourceCounts,
        targetCountsBefore,
        targetCountsAfter,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Academic year rollover failed.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "promotions",
      action: "delete",
    });

  if (auth.response) {
    return auth.response;
  }

  try {
    const body =
      (await request.json()) as RolloverBody;
    const rolloverId =
      numberOrNull(body.rollover_id);

    if (!rolloverId) {
      return NextResponse.json(
        {
          error:
            "Rollover identifier is required for rollback.",
        },
        {
          status: 400,
        }
      );
    }

    const { context, error } =
      await resolveMutationContext(
        request,
        {
          rollover_id: rolloverId,
        } as Record<string, unknown>
      );

    if (!context) {
      return NextResponse.json(
        {
          error,
        },
        {
          status: 400,
        }
      );
    }

    const schoolId = context.requiredSchoolId;
    const rolloverRows =
      await prisma.$queryRawUnsafe<
        {
          id: number;
          school_id: number | null;
          source_academic_year_id: number;
          target_academic_year_id: number;
          status: string | null;
        }[]
      >(
        `
        SELECT id, school_id, source_academic_year_id, target_academic_year_id, status
        FROM academic_year_rollovers
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        LIMIT 1
        `,
        rolloverId,
        schoolId
      );

    const rollover = rolloverRows[0];

    if (!rollover) {
      return NextResponse.json(
        {
          error: "Academic year rollover not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (String(rollover.status || "").toUpperCase() !== "EXECUTED") {
      return NextResponse.json(
        {
          error:
            "Only executed rollovers can be rolled back.",
        },
        {
          status: 400,
        }
      );
    }

    const rolledBackCounts =
      await rollbackRolloverCopies(
        schoolId,
        rollover.source_academic_year_id,
        rollover.target_academic_year_id,
        context.updatedBy,
        rollover.id
      );

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        rollover.source_academic_year_id,
      user_id: context.updatedBy,
      actor_role: context.user.role,
      module_name: "academic_year",
      event_type:
        "ACADEMIC_YEAR_ROLLOVER_ROLLED_BACK",
      action: "rollback",
      entity_type: "academic_year_rollover",
      entity_id: rollover.id,
      summary: "Academic year rollover rolled back",
      payload: {
        rolloverId: rollover.id,
        sourceAcademicYearId:
          rollover.source_academic_year_id,
        targetAcademicYearId:
          rollover.target_academic_year_id,
        rolledBackCounts,
      },
    });

    return NextResponse.json(
      {
        status: "ROLLED_BACK",
        rolloverId: rollover.id,
        rolledBackCounts,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Academic year rollover rollback failed.",
      },
      {
        status: 500,
      }
    );
  }
}
