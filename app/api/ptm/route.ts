import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { requireSchoolModule } from "@/lib/module-governance";
import { ensurePtmWhatsAppTemplates, queueWhatsAppMessage } from "@/lib/notifications/whatsapp";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

export async function GET(request: Request) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      p.*,
      COALESCE(s.name, NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), 'Student ' || s.id::text) AS student_name,
      t.first_name || ' ' || COALESCE(t.last_name,'') AS teacher_name,
      c.class_name,
      sec.section_name
    FROM ptm_meetings p
    LEFT JOIN students s ON s.id = p.student_id
    LEFT JOIN teachers t ON t.id = p.teacher_id
    LEFT JOIN classes c ON c.id = p.class_id
    LEFT JOIN sections sec ON sec.id = p.section_id
    WHERE ($1::int IS NULL OR p.school_id = $1::int)
      AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
    ORDER BY p.meeting_date DESC, p.id DESC
    LIMIT 200
    `,
    context.schoolId,
    context.academicYearId
  );

  const summaryRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      COUNT(*)::int AS total_ptms,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'SCHEDULED')::int AS scheduled_count,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'COMPLETED')::int AS completed_count,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'MISSED')::int AS missed_count,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'RESCHEDULED')::int AS rescheduled_count,
      ROUND(
        CASE WHEN COUNT(*) = 0 THEN 0
        ELSE (COUNT(*) FILTER (WHERE COALESCE(parent_confirmation,'') IN ('CONFIRMED','ATTENDED'))::numeric / COUNT(*)::numeric) * 100
        END
      , 2)::numeric AS parent_attendance_pct
    FROM ptm_meetings
    WHERE ($1::int IS NULL OR school_id = $1::int)
      AND ($2::int IS NULL OR academic_year_id = $2::int)
    `,
    context.schoolId,
    context.academicYearId
  );

  return NextResponse.json({
    meetings: rows,
    summary: summaryRows[0] || {},
  });
}

export async function POST(request: Request) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  const user = await getCurrentUser();
  if (!context || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!context.schoolId) {
    return NextResponse.json({ error: "Select a school before scheduling PTM." }, { status: 400 });
  }

  const body = await request.json();
  if (!body.meeting_title || !body.meeting_date) {
    return NextResponse.json({ error: "Meeting title and date are required." }, { status: 400 });
  }

  const schoolRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT school_name, school_code, phone, email, principal_name, address
    FROM schools
    WHERE id = $1::int
    LIMIT 1
    `,
    context.schoolId
  );
  const school = schoolRows[0] || {};

  await ensurePtmWhatsAppTemplates(context.schoolId, Number(user.id) || null);

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO ptm_meetings (
      school_id, academic_year_id, student_id, teacher_id, class_id, section_id,
      meeting_title, meeting_date, meeting_time, mode, parent_confirmation,
      status, notes, action_items, follow_up_date, created_by, updated_by,
      created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'PENDING','SCHEDULED',$11,$12,$13,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
    RETURNING *
    `,
    context.schoolId,
    context.academicYearId,
    toNumber(body.student_id),
    toNumber(body.teacher_id),
    toNumber(body.class_id),
    toNumber(body.section_id),
    body.meeting_title,
    new Date(body.meeting_date),
    body.meeting_time || null,
    body.mode || "IN_PERSON",
    body.notes || null,
    body.action_items || null,
    body.follow_up_date ? new Date(body.follow_up_date) : null,
    Number(user.id) || null
  );

  const meeting = rows[0] || {};

  const studentRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT COALESCE(s.name, NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), 'Student ' || s.id::text) AS student_name
    FROM students s
    WHERE s.id = $1::int
    LIMIT 1
    `,
    toNumber(body.student_id)
  );
  const teacherRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT COALESCE(NULLIF(TRIM(COALESCE(t.first_name,'') || ' ' || COALESCE(t.last_name,'')), ''), 'Teacher ' || t.id::text) AS teacher_name
    FROM teachers t
    WHERE t.id = $1::int
    LIMIT 1
    `,
    toNumber(body.teacher_id)
  );

  const studentName = String(studentRows[0]?.student_name || "Student").trim() || "Student";
  const teacherName = String(teacherRows[0]?.teacher_name || "Teacher").trim() || "Teacher";
  const schoolName = String(school.school_name || "School/College").trim() || "School/College";

  const venue = String(
    body.venue ||
      body.meeting_venue ||
      school.address ||
      school.principal_name ||
      "School/College premises"
  ).trim() || "School/College premises";

  const date = new Date(body.meeting_date).toLocaleDateString("en-IN");
  const time = String(body.meeting_time || "-").trim() || "-";

  const recipient = String(
    body.parent_phone ||
      body.whatsapp_number ||
      body.mobile ||
      ""
  ).trim();

  if (recipient) {
    await queueWhatsAppMessage({
      templateName: "ptm_scheduled",
      schoolId: context.schoolId,
      academicYearId: context.academicYearId,
      userId: Number(user.id) || null,
      studentId: toNumber(body.student_id),
      recipient,
      variables: [
        studentName,
        String(body.class_name || body.class_id || "-"),
        teacherName,
        date,
        time,
        venue,
        schoolName,
      ],
      triggeredBy: "PTM_SCHEDULED",
      entityType: "ptm_meeting",
      entityId: Number(meeting.id) || null,
      messagePreview: `Dear Parent, PTM scheduled for ${studentName} at ${schoolName}.`,
    }).catch((error) => {
      console.error("PTM WhatsApp queue failed:", error);
    });
  }

  await recordEvent({
    school_id: context.schoolId,
    academic_year_id: context.academicYearId,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "ptm",
    event_type: "PTM_SCHEDULED",
    action: "create",
    entity_type: "ptm_meeting",
    entity_id: Number(meeting.id) || null,
    summary: "Parent teacher meeting scheduled.",
    payload: { ...meeting, school_name: schoolName },
  });

  return NextResponse.json({ ...meeting, school_name: schoolName }, { status: 201 });
}

export async function PATCH(request: Request) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const id = toNumber(body.id);
  if (!id) {
    return NextResponse.json({ error: "Meeting id is required." }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE ptm_meetings
    SET parent_confirmation = COALESCE($2, parent_confirmation),
        status = COALESCE($3, status),
        notes = COALESCE($4, notes),
        action_items = COALESCE($5, action_items),
        follow_up_date = COALESCE($6, follow_up_date),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND ($7::int IS NULL OR school_id = $7::int)
    RETURNING *
    `,
    id,
    body.parent_confirmation || null,
    body.status || null,
    body.notes || null,
    body.action_items || null,
    body.follow_up_date ? new Date(body.follow_up_date) : null,
    context.schoolId
  );

  return NextResponse.json(rows[0] || null);
}
