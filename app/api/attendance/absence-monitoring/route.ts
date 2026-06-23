import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";

const toNumber = (value: string | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const dateOnly = (value: string | null) => {
  if (!value) return null;
  const candidate = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : null;
};

const startOfWeek = () => {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - diff);
  return start.toISOString().slice(0, 10);
};

const endOfWeek = () => {
  const start = new Date(`${startOfWeek()}T00:00:00.000Z`);
  start.setUTCDate(start.getUTCDate() + 7);
  return start.toISOString().slice(0, 10);
};

const monthStart = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
};

const monthEnd = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
    .toISOString()
    .slice(0, 10);
};

export async function GET(request: Request) {
  const guard = await requireSchoolModule("OPERATIONS");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const schoolId = toNumber(searchParams?.get("school_id")) ?? context.schoolId ?? null;
  const academicYearId = toNumber(searchParams?.get("academic_year_id")) ?? context.academicYearId ?? null;
  const classId = toNumber(searchParams?.get("class_id"));
  const sectionId = toNumber(searchParams?.get("section_id"));
  const studentId = toNumber(searchParams?.get("student_id"));
  const from = dateOnly(searchParams?.get("from"));
  const to = dateOnly(searchParams?.get("to"));
  const rangeStart = from || monthStart();
  const rangeEnd = to || monthEnd();

  const [dashboard, timeline, classSummary, sectionSummary, genderSummary, chronicRows, responseRows, parentDeclarations] = await Promise.all([
    prisma.$queryRawUnsafe<any[]>(
      `
      WITH filtered AS (
        SELECT a.*
        FROM attendance_master a
        WHERE ($1::int IS NULL OR a.school_id = $1::int)
          AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
          AND ($3::int IS NULL OR a.class_id = $3::int)
          AND ($4::int IS NULL OR a.section_id = $4::int)
          AND ($5::int IS NULL OR a.student_id = $5::int)
      )
      SELECT
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'ABSENT' AND attendance_date = CURRENT_DATE)::int AS today_absent,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'ABSENT' AND attendance_date >= CURRENT_DATE - INTERVAL '6 day')::int AS weekly_absent,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'ABSENT' AND attendance_date >= date_trunc('month', CURRENT_DATE))::int AS monthly_absent,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'ABSENT')::int AS total_absent,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) IN ('LATE','HALF_DAY'))::int AS partial_absent,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) IN ('LEAVE_APPROVED','MEDICAL_LEAVE','DUTY_LEAVE'))::int AS leave_count,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'PRESENT')::int AS present_count,
        COUNT(DISTINCT student_id) FILTER (WHERE UPPER(COALESCE(status,'')) = 'ABSENT' AND attendance_date = CURRENT_DATE)::int AS today_absent_students
      FROM filtered
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId,
      studentId
    ),
    prisma.$queryRawUnsafe<any[]>(
      `
      SELECT
        a.attendance_date::text AS attendance_date,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(a.status,'')) = 'ABSENT')::int AS absent_count,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(a.status,'')) = 'PRESENT')::int AS present_count,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(a.status,'')) IN ('LATE','HALF_DAY'))::int AS partial_count
      FROM attendance_master a
      WHERE ($1::int IS NULL OR a.school_id = $1::int)
        AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
        AND ($3::int IS NULL OR a.class_id = $3::int)
        AND ($4::int IS NULL OR a.section_id = $4::int)
        AND ($5::int IS NULL OR a.student_id = $5::int)
        AND a.attendance_date >= $6::date
        AND a.attendance_date < $7::date
      GROUP BY a.attendance_date
      ORDER BY a.attendance_date ASC
      LIMIT 120
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId,
      studentId,
      rangeStart,
      rangeEnd
    ),
    prisma.$queryRawUnsafe<any[]>(
      `
      SELECT
        COALESCE(c.class_name, 'Unassigned') AS label,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(a.status,'')) = 'ABSENT')::int AS count
      FROM attendance_master a
      LEFT JOIN classes c ON c.id = a.class_id
      WHERE ($1::int IS NULL OR a.school_id = $1::int)
        AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
        AND a.attendance_date >= $3::date
        AND a.attendance_date < $4::date
      GROUP BY COALESCE(c.class_name, 'Unassigned')
      ORDER BY count DESC, label ASC
      LIMIT 20
      `,
      schoolId,
      academicYearId,
      rangeStart,
      rangeEnd
    ),
    prisma.$queryRawUnsafe<any[]>(
      `
      SELECT
        COALESCE(sec.section_name, 'Unassigned') AS label,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(a.status,'')) = 'ABSENT')::int AS count
      FROM attendance_master a
      LEFT JOIN sections sec ON sec.id = a.section_id
      WHERE ($1::int IS NULL OR a.school_id = $1::int)
        AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
        AND a.attendance_date >= $3::date
        AND a.attendance_date < $4::date
      GROUP BY COALESCE(sec.section_name, 'Unassigned')
      ORDER BY count DESC, label ASC
      LIMIT 20
      `,
      schoolId,
      academicYearId,
      rangeStart,
      rangeEnd
    ),
    prisma.$queryRawUnsafe<any[]>(
      `
      SELECT
        COALESCE(s.gender, 'Unspecified') AS label,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(a.status,'')) = 'ABSENT')::int AS count
      FROM attendance_master a
      LEFT JOIN students s ON s.id = a.student_id
      WHERE ($1::int IS NULL OR a.school_id = $1::int)
        AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
        AND a.attendance_date >= $3::date
        AND a.attendance_date < $4::date
      GROUP BY COALESCE(s.gender, 'Unspecified')
      ORDER BY count DESC, label ASC
      LIMIT 20
      `,
      schoolId,
      academicYearId,
      rangeStart,
      rangeEnd
    ),
    prisma.$queryRawUnsafe<any[]>(
      `
      WITH recent AS (
        SELECT
          student_id,
          attendance_date,
          UPPER(COALESCE(status, '')) AS status,
          ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY attendance_date DESC, id DESC) AS rn
        FROM attendance_master
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      ),
      streaks AS (
        SELECT
          student_id,
          COUNT(*) FILTER (WHERE status = 'ABSENT') AS absent_count,
          COUNT(*) FILTER (WHERE status = 'ABSENT' AND rn <= 10) AS recent_absent_score,
          MAX(attendance_date) FILTER (WHERE status = 'ABSENT') AS last_absent
        FROM recent
        GROUP BY student_id
      )
      SELECT
        s.id AS student_id,
        COALESCE(NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), s.name, 'Student ' || s.id::text) AS student_name,
        s.admission_number,
        s.enrollment_number,
        COALESCE(streaks.absent_count, 0)::int AS absent_count,
        COALESCE(streaks.recent_absent_score, 0)::int AS recent_absent_score
      FROM streaks
      JOIN students s ON s.id = streaks.student_id
      WHERE COALESCE(streaks.absent_count, 0) >= 3 OR COALESCE(streaks.recent_absent_score, 0) >= 3
      ORDER BY COALESCE(streaks.recent_absent_score, 0) DESC, COALESCE(streaks.absent_count, 0) DESC, student_name ASC
      LIMIT 25
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<any[]>(
      `
      SELECT
        r.*,
        COALESCE(NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')), ''), s.name, 'Student ' || s.id::text) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name
      FROM attendance_absence_responses r
      LEFT JOIN students s ON s.id = r.student_id
      LEFT JOIN classes c ON c.id = s.current_class_id
      LEFT JOIN sections sec ON sec.id = s.current_section_id
      WHERE ($1::int IS NULL OR r.school_id = $1::int)
        AND ($2::int IS NULL OR r.academic_year_id = $2::int OR r.academic_year_id IS NULL)
        AND ($3::int IS NULL OR r.student_id = $3::int)
      ORDER BY r.created_at DESC, r.id DESC
      LIMIT 50
      `,
      schoolId,
      academicYearId,
      studentId
    ),
    prisma.$queryRawUnsafe<any[]>(
      `
      SELECT
        d.*,
        COALESCE(NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), s.name, 'Student ' || s.id::text) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name
      FROM parent_attendance_declarations d
      LEFT JOIN students s ON s.id = d.student_id
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
        AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        AND COALESCE(sye.status, 'ACTIVE') = 'ACTIVE'
      LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
      LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
      WHERE ($1::int IS NULL OR d.school_id = $1::int)
        AND ($2::int IS NULL OR d.academic_year_id = $2::int OR d.academic_year_id IS NULL)
        AND ($3::int IS NULL OR d.student_id = $3::int)
      ORDER BY d.declaration_date DESC, d.id DESC
      LIMIT 50
      `,
      schoolId,
      academicYearId,
      studentId
    ),
  ]);

  return NextResponse.json({
    filters: {
      school_id: schoolId,
      academic_year_id: academicYearId,
      class_id: classId,
      section_id: sectionId,
      student_id: studentId,
      from: rangeStart,
      to: rangeEnd,
    },
    dashboard: dashboard[0] || {},
    timeline,
    class_summary: classSummary,
    section_summary: sectionSummary,
    gender_summary: genderSummary,
    chronic_absentees: chronicRows,
    responses: responseRows,
    parent_declarations: parentDeclarations,
  });
}

export async function POST(request: Request) {
  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const studentId = toNumber(String(body.student_id || null));
  const attendanceId = toNumber(String(body.attendance_id || null));
  const schoolId = toNumber(String(body.school_id || null)) ?? context.schoolId ?? null;
  const academicYearId = toNumber(String(body.academic_year_id || null)) ?? context.academicYearId ?? null;
  const responseType = String(body.response_type || "").trim().toUpperCase();
  const notes = String(body.notes || "").trim() || null;
  const attachmentUrl = String(body.attachment_url || "").trim() || null;
  const attachmentName = String(body.attachment_name || "").trim() || null;

  const allowed = new Set(["SICK", "MEDICAL", "FAMILY_EMERGENCY", "PERSONAL", "OTHER"]);
  if (!studentId || !schoolId || !allowed.has(responseType)) {
    return NextResponse.json({ error: "Student and valid response type are required." }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<any[]>(
    `
    INSERT INTO attendance_absence_responses (
      school_id, academic_year_id, attendance_id, student_id, response_type,
      notes, attachment_url, attachment_name, declared_by, created_by, created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
    RETURNING *
  `,
    schoolId,
    academicYearId,
    attendanceId,
    studentId,
    responseType,
    notes,
    attachmentUrl,
    attachmentName,
    Number(context.user?.id || 0) || null
  );

  await recordEvent({
    school_id: schoolId,
    academic_year_id: academicYearId,
    user_id: Number(context.user?.id || 0) || null,
    actor_role: String(context.user?.role || "SYSTEM"),
    module_name: "attendance",
    event_type: "PARENT_RESPONSE_RECEIVED",
    action: "create",
    entity_type: "absence_response",
    entity_id: rows[0]?.id || null,
    summary: "Parent absence response recorded",
    payload: {
      student_id: studentId,
      attendance_id: attendanceId,
      response_type: responseType,
      notes,
      attachment_url: attachmentUrl,
      attachment_name: attachmentName,
    },
  });

  return NextResponse.json({ response: rows[0] }, { status: 201 });
}
