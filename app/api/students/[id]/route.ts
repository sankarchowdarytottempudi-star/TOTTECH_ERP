import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { recordEvent } from "@/lib/governance/events";
import { calculateRisk} from "@/lib/studentRisk";
import StudentDNA from "@/components/student/StudentDNA";
import {  generateStudentDNA,} from "@/lib/intelligence/studentDNA";
import {
  normalizeStudentStatus,
  statusIsActive,
} from "@/lib/student-lifecycle";
import { alternatePhoneConflictsWithPrimary } from "@/lib/contact-utils";
import {
  normalizeStudentBacklogs,
} from "@/lib/student-backlogs";

const parseYesNo = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  return normalized === "yes" || normalized === "true";
};

const normalizeString = (value: unknown) =>
  String(value ?? "").trim();

const nullableString = (value: unknown) => {
  const text = normalizeString(value);
  return text || null;
};

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phonePattern = /^\d{10}$/;

const validatePhoneField = (
  label: string,
  value: unknown,
  required = false
) => {
  const text = normalizeString(value);
  if (!text && !required) {
    return null;
  }

  if (!text) {
    return `${label} is required.`;
  }

  if (!phonePattern.test(text)) {
    return `${label} must contain exactly 10 digits.`;
  }

  return null;
};



export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const student =
      await prisma.students.findUnique({
        where: {
          id: Number(id),
        },
      });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

   const attendance =
  await prisma.attendance_master.findMany({
        where: {
          student_id: Number(id),
        },
        orderBy: {
          attendance_date: "desc",
        },
        take: 30,
      });

   const marks =
  await prisma.marks.findMany({
    where: {
      student_id: Number(id),
    },
    include: {
      subjects: true,
      exams: true,
    },
  });

const examSchedule =
  await prisma.exam_schedule.findMany({
    orderBy: {
      exam_date: "asc",
    },
    take: 5,
  });

const subjectMap: any = {};

marks.forEach((m: any) => {

const subject =
  m.subjects?.subject_name ||
  "Unknown";

  if (!subjectMap[subject]) {
    subjectMap[subject] = {
      total: 0,
      count: 0,
    };
  }

  subjectMap[subject].total +=
    Number(m.obtained_marks || 0);

  subjectMap[subject].count++;
});

const subjectPerformance =
  Object.keys(subjectMap).map(
    (subject) => ({
      subject,
      average: Math.round(
        subjectMap[subject].total /
        subjectMap[subject].count
      ),
    })
  );

const subjectStrengths =
  subjectPerformance
    .filter(
      (s:any) => s.average >= 75
    )
    .map(
      (s:any) => s.subject
    );

const subjectWeaknesses =
  subjectPerformance
    .filter(
      (s:any) => s.average < 40
    )
    .map(
      (s:any) => s.subject
    );

const upcomingExams =
  examSchedule.map((exam: any) => ({
    id: exam.id,
    exam_date: exam.exam_date,
    start_time: exam.start_time,
    room_no: exam.room_no,
    status: exam.status,
  }));

const learningGaps =
  await prisma.$queryRawUnsafe<
    Record<string, unknown>[]
  >(
    `
    SELECT *
    FROM student_learning_gaps
    WHERE student_id = $1
    ORDER BY COALESCE(identified_date, created_at) DESC, id DESC
    LIMIT 100
    `,
    Number(id)
  );

const documents =
  await prisma.$queryRawUnsafe<
    Record<string, unknown>[]
  >(
    `
    SELECT
      sd.id,
      sd.document_type,
      sd.document_number,
      sd.title,
      sd.file_url,
      sd.issued_on,
      sd.metadata,
      sd.created_at,
      COALESCE(u.full_name, '') AS uploaded_by_name
    FROM student_documents sd
    LEFT JOIN users u ON u.id = sd.created_by
    WHERE sd.student_id = $1
      AND COALESCE(sd.is_deleted, false) = false
    ORDER BY sd.created_at DESC, sd.id DESC
    LIMIT 100
    `,
    Number(id)
  );

const backlogs =
  await prisma.$queryRawUnsafe<
    Record<string, unknown>[]
  >(
    `
    SELECT
      sb.*,
      COALESCE(sub.subject_name, '') AS subject_name,
      COALESCE(ex.exam_name, '') AS exam_name,
      COALESCE(ay.academic_year, '') AS academic_year
    FROM student_backlogs sb
    LEFT JOIN subjects sub ON sub.id = sb.subject_id
    LEFT JOIN exams ex ON ex.id = sb.exam_id
    LEFT JOIN academic_years ay ON ay.id = sb.academic_year_id
    WHERE sb.student_id = $1
    ORDER BY sb.created_at DESC, sb.id DESC
    `,
    Number(id)
  );

const backlogTimeline =
  await prisma.$queryRawUnsafe<
    Record<string, unknown>[]
  >(
    `
    SELECT
      el.id,
      el.event_type,
      el.action,
      el.summary,
      el.payload,
      el.occurred_at,
      el.created_at
    FROM event_ledger el
    WHERE el.entity_type = 'student'
      AND el.entity_id = $1
      AND el.module_name = 'students'
      AND el.event_type IN (
        'BACKLOG_CREATED',
        'BACKLOG_UPDATED',
        'BACKLOG_CLEARED',
        'BACKLOG_DELETED'
      )
    ORDER BY COALESCE(el.occurred_at, el.created_at) DESC, el.id DESC
    LIMIT 100
    `,
    Number(id)
  );

    const presentDays =
      attendance.filter(
        (a) => a.status === "PRESENT"
      ).length;

    const attendancePercent =
      attendance.length > 0
        ? Math.round(
            (presentDays /
              attendance.length) *
              100
          )
        : 0;

     const sortedAttendance = [...attendance].sort(
  (a: any, b: any) =>
    new Date(b.attendance_date).getTime() -
    new Date(a.attendance_date).getTime()
);

let attendanceStreak = 0;

for (const row of sortedAttendance) {
  if (row.status === "PRESENT") {
    attendanceStreak++;
  } else {
    break;
  }
}

    const averageMarks =
      marks.length > 0
        ? Number(
            (
              marks.reduce(
                (sum, m) =>
                  sum +
                  Number(
                    m.obtained_marks || 0
                  ),
                0
              ) / marks.length
            ).toFixed(2)
          )
        : 0;

    const risk =
  calculateRisk(
    attendancePercent,
    averageMarks
  );

const examStats = {
  upcomingExams: 1,
  completedExams: marks.length > 0 ? 1 : 0,

  examReadiness:
    averageMarks > 0
      ? Math.round(
          attendancePercent * 0.4 +
          averageMarks * 0.6
        )
      : 0,
};

const feeStats = {
  assignedAmount: 0,
  paidAmount: 0,
  outstandingAmount: 0,
  complianceScore: 100,
};

const riskFactors = [];

if (attendancePercent < 75) {
  riskFactors.push(
    "Attendance below 75%"
  );
}

if (
  averageMarks > 0 &&
  averageMarks < 40
) {
  riskFactors.push(
    "Academic performance below target"
  );
}

if (
  averageMarks > 0 &&
  examStats.examReadiness < 60
) {
  riskFactors.push(
    "Low exam readiness"
  );
}

if (
  feeStats.complianceScore < 80
) {
  riskFactors.push(
    "Fee compliance issue"
  );
}

const aiInsights = {
  healthScore: Math.round(
    attendancePercent * 0.4 +
    averageMarks * 0.4 +
    feeStats.complianceScore * 0.2
  ),
  promotionProbability: Math.round(
    attendancePercent * 0.3 +
    averageMarks * 0.5 +
    feeStats.complianceScore * 0.2
  ),
};

const studentDNA =
  generateStudentDNA({
    attendancePercent,
    averageMarks,
    subjectStrengths,
    subjectWeaknesses,
  });

const backlogSummary: {
  total: number;
  cleared: number;
  pending: number;
} = {
  total: backlogs.length,
  cleared: backlogs.filter(
    (row) =>
      String(
        row.backlog_status || "PENDING"
      )
        .trim()
        .toUpperCase() === "CLEARED"
  ).length,
  pending: 0,
};
backlogSummary.pending = Math.max(
  0,
  backlogSummary.total -
    backlogSummary.cleared
);

return NextResponse.json({
  student,
  attendancePercent,
  averageMarks,
  risk,
subjectPerformance,
  attendance,
  marks,
  attendanceStreak,
  examStats,
  feeStats,
  aiInsights,
upcomingExams,
    riskFactors,
    studentDNA,
    learningGaps,
    documents,
    backlogs,
    backlogSummary,
    backlogTimeline,
  });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}

type StudentRow = Record<
  string,
  unknown
>;

const academicYearStart = (
  value: unknown
) => {
  const match = String(value || "")
    .match(/(\d{4})\s*-\s*(\d{4})/);
  return match ? Number(match[1]) : null;
};

const calculateAcademicGapDuration = (
  fromYear: unknown,
  toYear: unknown
) => {
  const fromStart = academicYearStart(fromYear);
  const toStart = academicYearStart(toYear);

  if (
    fromStart === null ||
    toStart === null ||
    toStart < fromStart
  ) {
    return null;
  }

  const gapYears = Math.max(
    0,
    toStart - fromStart - 1
  );

  return gapYears <= 0
    ? "No academic gap"
    : `${gapYears} Academic Year${gapYears === 1 ? "" : "s"}`;
};

async function insertAcademicHistory({
  studentId,
  schoolId,
  academicYearId,
  classId,
  sectionId,
  promotionStatus,
  userId,
  metadata,
}: {
  studentId: number;
  schoolId: number | null;
  academicYearId: number | null;
  classId: number | null;
  sectionId: number | null;
  promotionStatus: string;
  userId: number | null;
  metadata?: Record<string, unknown>;
}) {
  await prisma.$executeRawUnsafe(
    `
    INSERT INTO student_academic_history (
      student_id,
      school_id,
      academic_year_id,
      class_id,
      section_id,
      promotion_status,
      promoted_on,
      created_by,
      metadata
    )
    VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,$8::jsonb)
    `,
    studentId,
    schoolId,
    academicYearId,
    classId,
    sectionId,
    promotionStatus,
    userId,
    JSON.stringify(metadata || {})
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body =
      await request.json();
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before updating a student."
      );
    }

    const studentId = Number(id);
    const schoolId =
      user.role === "SUPER_ADMIN"
        ? null
        : Number(user.school_id);
    const existingRows =
      await prisma.$queryRawUnsafe<
        StudentRow[]
      >(
        `
        SELECT *
        FROM students
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        LIMIT 1
        `,
        studentId,
        schoolId
      );
    const existing = existingRows[0];

    if (!existing) {
      return validationError(
        "Student not found or outside the selected school."
      );
    }

    const existingBacklogs =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT *
        FROM student_backlogs
        WHERE student_id = $1::int
        ORDER BY id ASC
        `,
        studentId
      );

    const academicYear =
      await getSelectedAcademicYear(
        user.school_id
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          user.academic_year_id ??
          academicYear?.id
      ) || null;
    const classId =
      Number(
        body.current_class_id ??
          body.class_id
      ) || null;
    const sectionId =
      Number(
        body.current_section_id ??
          body.section_id
      ) || null;
    const nextStatus =
      normalizeStudentStatus(
        body.student_status ??
          body.status ??
          existing.student_status ??
          (statusIsActive(existing.is_active)
            ? "ACTIVE"
            : "DROPOUT")
      );
    const nextIsActive =
      statusIsActive(
        nextStatus,
        Boolean(existing.is_active)
      );
    const nextAdmissionNumber =
      body.admission_number ??
      existing.admission_number ??
      null;
    const nextEnrollmentNumber =
      body.enrollment_number ??
      existing.enrollment_number ??
      null;

    if (!normalizeString(body.gender)) {
      return validationError(
        "Gender is required."
      );
    }

    if (!normalizeString(body.first_name)) {
      return validationError(
        "Student first name is required."
      );
    }

    if (!normalizeString(body.last_name)) {
      return validationError(
        "Student last name is required."
      );
    }

    const nextDobText = normalizeString(
      body.dob ?? existing.dob
    );
    if (!nextDobText) {
      return validationError(
        "Date of Birth is required."
      );
    }

    const nextDob = new Date(nextDobText);
    if (
      Number.isNaN(nextDob.getTime()) ||
      nextDob > new Date()
    ) {
      return validationError(
        "Date of Birth must be a valid past date."
      );
    }

    const nextAddress =
      normalizeString(
        body.address_line_1 ??
          body.address ??
          existing.address
      );
    if (!nextAddress) {
      return validationError(
        "Address Line 1 is required."
      );
    }

    if (!normalizeString(body.father_name)) {
      return validationError(
        "Father's name is required."
      );
    }

    if (!normalizeString(body.mother_name)) {
      return validationError(
        "Mother's name is required."
      );
    }

    const phoneError = [
      validatePhoneField(
        "Student Phone Number",
        body.phone,
        true
      ),
      validatePhoneField(
        "Father's Phone Number",
        body.father_phone,
        true
      ),
      validatePhoneField(
        "Mother's Phone Number",
        body.mother_phone
      ),
      validatePhoneField(
        "Alternate Mobile Number",
        body.guardian_alternative_mobile
      ),
      validatePhoneField(
        "Emergency Contact Number",
        body.emergency_contact_number
      ),
    ].find(Boolean);

    if (phoneError) {
      return validationError(phoneError);
    }

    const email = normalizeString(body.email);
    if (email && !emailPattern.test(email)) {
      return validationError(
        "Please enter a valid email address."
      );
    }
    const hasPreviousSchool =
      parseYesNo(
        body.has_previous_school ??
          existing.has_previous_school ??
          false
      );
    const previousSchoolDetails =
      hasPreviousSchool
        ? String(
            body.previous_school_details ??
              existing.previous_school_details ??
              ""
          ).trim() || null
        : null;
    const previousAcademicPerformance =
      hasPreviousSchool
        ? String(
            body.previous_academic_performance ??
              body.previous_school_performance ??
              existing.previous_academic_performance ??
              existing.previous_school_performance ??
              ""
          ).trim() || null
        : null;
    const hasBacklogs =
      parseYesNo(
        body.has_backlogs ??
          existing.has_backlogs ??
          false
      );
    const backlogs =
      normalizeStudentBacklogs(
        body.backlogs,
        hasBacklogs
      );

    const hasAcademicGap =
      typeof body.has_academic_gap === "boolean"
        ? body.has_academic_gap
        : String(body.has_academic_gap || "")
            .trim()
            .toLowerCase() === "yes" ||
          String(body.has_academic_gap || "")
            .trim()
            .toLowerCase() === "true";
    const academicGapFromYear =
      hasAcademicGap
        ? body.academic_gap_from_year ??
          existing.academic_gap_from_year ??
          null
        : null;
    const academicGapToYear =
      hasAcademicGap
        ? body.academic_gap_to_year ??
          existing.academic_gap_to_year ??
          null
        : null;
    const academicGapDuration =
      hasAcademicGap
        ? calculateAcademicGapDuration(
            academicGapFromYear,
            academicGapToYear
          )
        : null;
    const academicGapReason =
      hasAcademicGap
        ? body.academic_gap_reason ??
          existing.academic_gap_reason ??
          null
        : null;

    if (
      hasPreviousSchool &&
      (!previousSchoolDetails ||
        !previousAcademicPerformance)
    ) {
      return validationError(
        "Previous school/college details and previous academic performance are required when Has Previous School/College is Yes."
      );
    }

    if (
      hasAcademicGap &&
      (!academicGapFromYear ||
        !academicGapToYear ||
        !academicGapReason)
    ) {
      return validationError(
        "Academic gap details are required when Has Academic Gap is Yes."
      );
    }

    if (hasBacklogs && !backlogs.length) {
      return validationError(
        "At least one backlog record is required when Has Backlogs is Yes."
      );
    }

    if (classId) {
      const classRows =
        await prisma.$queryRawUnsafe<
          StudentRow[]
        >(
          `
          SELECT id
          FROM classes
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
          `,
          classId,
          schoolId
        );

      if (!classRows.length) {
        return validationError(
          "Selected class does not belong to the selected school."
        );
      }
    }

    if (sectionId) {
      const sectionRows =
        await prisma.$queryRawUnsafe<
          StudentRow[]
        >(
          `
          SELECT id
          FROM sections
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
            AND ($3::int IS NULL OR class_id = $3::int)
          `,
          sectionId,
          schoolId,
          classId
        );

      if (!sectionRows.length) {
        return validationError(
          "Selected section must belong to the selected class and school."
        );
      }
    }

    const fullName = [
      body.first_name,
      body.middle_name,
      body.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    if (
      alternatePhoneConflictsWithPrimary({
        primary: [
          body.phone,
          body.father_phone,
          body.mother_phone,
        ],
        alternates: [
          body.guardian_alternative_mobile,
        ],
      })
    ) {
      return validationError(
        "Guardian Alternative Mobile must be different from the student, father, and mother phone numbers."
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        StudentRow[]
      >(
      `
        UPDATE students
        SET enrollment_number = $1,
            admission_number = $2,
            name = $3,
            first_name = $4,
            middle_name = $5,
            last_name = $6,
            gender = $7,
            dob = $8,
            phone = $9,
            email = $10,
            blood_group = $11,
            religion = $12,
            caste = $13,
            mother_tongue = $14,
            address = $15,
            father_name = $16,
            mother_name = $17,
            father_phone = $18,
            mother_phone = $19,
            father_alternative_mobile = $20,
            mother_alternative_mobile = $21,
            guardian_alternative_mobile = $22,
            emergency_contact_number = $23,
            emergency_contact_name = $24,
            emergency_relationship = $25,
            has_previous_school = $26,
            has_backlogs = $27,
            previous_school_details = $28,
            previous_academic_performance = $29,
            previous_school_percentage = NULL,
            previous_school_grade = NULL,
            has_academic_gap = $30,
            academic_gap_from_year = $31,
            academic_gap_to_year = $32,
            academic_gap_duration = $33,
            academic_gap_reason = $34,
            section_id = $35,
            current_class_id = $36,
            current_section_id = $37,
            academic_year_id = $38,
            student_status = $39,
            is_active = $40,
            status_updated_at = CURRENT_TIMESTAMP,
            status_reason = $41,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $42
          AND ($43::int IS NULL OR school_id = $43::int)
        RETURNING *
        `,
        nextEnrollmentNumber,
        nextAdmissionNumber,
        fullName || body.name || null,
        body.first_name || null,
        body.middle_name || null,
        body.last_name || null,
        nullableString(body.gender),
        nextDob,
        nullableString(body.phone),
        email || null,
        nullableString(body.blood_group ?? existing.blood_group),
        nullableString(body.religion ?? existing.religion),
        nullableString(body.caste ?? existing.caste),
        nullableString(body.mother_tongue ?? existing.mother_tongue),
        nextAddress,
        nullableString(body.father_name),
        nullableString(body.mother_name),
        nullableString(body.father_phone),
        nullableString(body.mother_phone),
        null,
        null,
        nullableString(body.guardian_alternative_mobile),
        nullableString(body.emergency_contact_number),
        nullableString(body.emergency_contact_name),
        nullableString(body.emergency_relationship),
        hasPreviousSchool,
        hasBacklogs,
        previousSchoolDetails,
        previousAcademicPerformance,
        hasAcademicGap,
        academicGapFromYear,
        academicGapToYear,
        academicGapDuration,
        academicGapReason,
        body.section_id
          ? Number(body.section_id)
          : sectionId,
        classId,
        sectionId,
        academicYearId,
        nextStatus,
        nextIsActive,
        body.status_reason ||
          body.reason ||
          (nextStatus === "ACTIVE"
            ? "Student record updated"
            : `Status updated to ${nextStatus}`),
        studentId,
        schoolId
      );

    const student = rows[0];

    if (!student) {
      return validationError(
        "Student not found or outside the selected school."
      );
    }

    await prisma.$executeRawUnsafe(
      `
      DELETE FROM student_backlogs
      WHERE student_id = $1::int
      `,
      studentId
    );

    const backlogKey = (
      row: Record<string, unknown>
    ) =>
      [
        row.subject_id ?? "",
        row.exam_id ?? "",
        String(
          row.backlog_status || "PENDING"
        ).toUpperCase(),
        row.backlog_reason ?? "",
        row.cleared_date ?? "",
        row.remarks ?? "",
      ].join("|");

    const previousBacklogKeys = new Set(
      existingBacklogs.map((row) =>
        backlogKey(row)
      )
    );

    for (const backlog of existingBacklogs) {
      await recordEvent({
        school_id:
          Number(student.school_id) || null,
        academic_year_id: academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "students",
        event_type: "BACKLOG_DELETED",
        action: "delete",
        entity_type: "student",
        entity_id: studentId,
        summary:
          "Backlog removed during student update",
        payload: {
          subject_id: backlog.subject_id,
          exam_id: backlog.exam_id,
          backlog_status: backlog.backlog_status,
        },
      });
    }

    if (backlogs.length) {
      for (const backlog of backlogs) {
        await prisma.$executeRawUnsafe(
          `
          INSERT INTO student_backlogs (
            student_id,
            school_id,
            academic_year_id,
            subject_id,
            exam_id,
            backlog_status,
            backlog_reason,
            cleared_date,
            remarks,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          `,
          studentId,
          Number(student.school_id) || null,
          academicYearId,
          backlog.subject_id,
          backlog.exam_id,
          backlog.backlog_status,
          backlog.backlog_reason,
          backlog.cleared_date
            ? new Date(backlog.cleared_date)
            : null,
          backlog.remarks
        );

        const eventType =
          backlog.backlog_status === "CLEARED"
            ? "BACKLOG_CLEARED"
            : previousBacklogKeys.has(
                backlogKey(backlog)
              )
              ? "BACKLOG_UPDATED"
              : "BACKLOG_CREATED";

        await recordEvent({
          school_id:
            Number(student.school_id) || null,
          academic_year_id: academicYearId,
          user_id: user.id,
          actor_role: user.role,
          module_name: "students",
          event_type: eventType,
          action:
            eventType === "BACKLOG_CREATED"
              ? "create"
              : "update",
          entity_type: "student",
          entity_id: studentId,
          summary:
            eventType === "BACKLOG_CLEARED"
              ? "Backlog cleared during student update"
              : eventType === "BACKLOG_UPDATED"
                ? "Backlog updated during student update"
                : "Backlog created during student update",
          payload: {
            subject_id: backlog.subject_id,
            exam_id: backlog.exam_id,
            backlog_status: backlog.backlog_status,
            backlog_reason: backlog.backlog_reason,
          },
        });
      }
    }

    if (academicYearId) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO student_year_enrollments (
          school_id,
          student_id,
          academic_year_id,
          class_id,
          section_id,
          status,
          source,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,'ACTIVE','student_edit',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (student_id, academic_year_id)
        DO UPDATE SET
          class_id = EXCLUDED.class_id,
          section_id = EXCLUDED.section_id,
          status = 'ACTIVE',
          source = 'student_edit',
          updated_at = CURRENT_TIMESTAMP
        `,
        Number(student.school_id) || null,
        studentId,
        academicYearId,
        classId,
        sectionId
      );

      await insertAcademicHistory({
        studentId,
        schoolId:
          Number(student.school_id) || null,
        academicYearId,
        classId,
        sectionId,
        promotionStatus:
          nextStatus === "PROMOTED"
            ? "PROMOTED"
            : "UPDATED",
        userId: user.id || null,
        metadata: {
          source: "student_update",
          status: nextStatus,
        },
      });
    }

    await recordEvent({
      school_id:
        Number(student.school_id) ||
        null,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "students",
      event_type: "STUDENT_UPDATED",
      action: "update",
      entity_type: "student",
      entity_id: studentId,
      summary:
        "Student record updated",
      payload: {
        class_id: classId,
        section_id: sectionId,
      },
    });

    return NextResponse.json(
      student
    );
  } catch (error) {
    console.error(
      "Student update error:",
      error
    );

    return apiError(
      error,
      "Failed to update student"
    );
  }
}

const studentDependentTables = [
  "ai_student_analysis",
  "attendance",
  "attendance_master",
  "communication_logs",
  "dining_attendance",
  "dining_meal_assignments",
  "dining_special_diets",
  "fee_payments",
  "homework_submissions",
  "hostel_allocations",
  "hostel_attendance",
  "hostel_movement_history",
  "hostel_students",
  "marks",
  "notifications",
  "promotion_workflow_students",
  "refunds",
  "scholarships",
  "student_exam_analysis",
  "student_exam_answers",
  "student_fee_assignments",
  "student_marks_entry",
  "student_promotions",
  "student_timelines",
  "student_year_enrollments",
  "transport_assignments",
  "transport_attendance",
  "transport_pickup_drop_history",
];

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before deleting a student."
      );
    }

    const studentId = Number(id);
    const schoolId =
      user.role === "SUPER_ADMIN"
        ? null
        : Number(user.school_id);
    const rows =
      await prisma.$queryRawUnsafe<
        StudentRow[]
      >(
        `
        SELECT id, school_id, first_name, last_name, admission_number
        FROM students
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        `,
        studentId,
        schoolId
      );
    const existing = rows[0];

    if (!existing) {
      return validationError(
        "Student not found or outside the selected school."
      );
    }

    const existingBacklogs =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT *
        FROM student_backlogs
        WHERE student_id = $1::int
        ORDER BY id ASC
        `,
        studentId
      );

    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(
          `
          DELETE FROM payment_receipts
          WHERE payment_id IN (
            SELECT id FROM payments WHERE student_id = $1
          )
          `,
          studentId
        );

        await tx.$executeRawUnsafe(
          `
          DELETE FROM invoice_audit_logs
          WHERE invoice_id IN (
            SELECT id FROM invoices WHERE student_id = $1
          )
          `,
          studentId
        );

        await tx.$executeRawUnsafe(
          `
          DELETE FROM concession_audit_logs
          WHERE concession_request_id IN (
            SELECT id FROM concession_requests WHERE student_id = $1
          )
          `,
          studentId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM payments WHERE student_id = $1",
          studentId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM invoices WHERE student_id = $1",
          studentId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM concession_requests WHERE student_id = $1",
          studentId
        );

        for (const table of studentDependentTables) {
          await tx.$executeRawUnsafe(
            `DELETE FROM ${table} WHERE student_id = $1`,
            studentId
          );
        }

        await tx.$executeRawUnsafe(
          `
          DELETE FROM event_ledger
          WHERE entity_type = 'student'
            AND entity_id = $1
          `,
          studentId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM students WHERE id = $1",
          studentId
        );
      }
    );

    await recordEvent({
      school_id:
        Number(existing.school_id) ||
        null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "students",
      event_type: "STUDENT_DELETED",
      action: "delete",
      entity_type: "school",
      entity_id:
        Number(existing.school_id) ||
        null,
      summary:
        "Student record hard deleted",
      payload: {
        student_id: studentId,
        admission_number:
          existing.admission_number,
      },
    });

    for (const backlog of existingBacklogs) {
      await recordEvent({
        school_id:
          Number(existing.school_id) || null,
        academic_year_id:
          Number(existing.academic_year_id) ||
          null,
        user_id: user.id,
        actor_role: user.role,
        module_name: "students",
        event_type: "BACKLOG_DELETED",
        action: "delete",
        entity_type: "student",
        entity_id: studentId,
        summary: "Backlog deleted with student record",
        payload: {
          subject_id: backlog.subject_id,
          exam_id: backlog.exam_id,
          backlog_status: backlog.backlog_status,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Student delete error:",
      error
    );

    return apiError(
      error,
      "Failed to delete student"
    );
  }
}
