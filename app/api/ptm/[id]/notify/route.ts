import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireSchoolModule } from "@/lib/module-governance";
import { resolvePlatformContext } from "@/lib/api/context";
import { queueWhatsAppMessage, ensurePtmWhatsAppTemplates } from "@/lib/notifications/whatsapp";
import { recordEvent } from "@/lib/governance/events";

type Row = Record<string, unknown>;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  const user = await getCurrentUser();
  if (!context || !user || !context.schoolId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const meetingId = toNumber(id);
  if (!meetingId) {
    return NextResponse.json({ error: "Invalid PTM id." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const template = String(body.template || "ptm_reminder").trim();

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      p.*,
      COALESCE(s.name, NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), 'Student ' || s.id::text) AS student_name,
      COALESCE(NULLIF(TRIM(COALESCE(t.first_name,'') || ' ' || COALESCE(t.last_name,'')), ''), 'Teacher ' || t.id::text) AS teacher_name,
      c.class_name,
      sec.section_name,
      sc.school_name,
      sc.address,
      sc.phone,
      sc.email,
      sc.principal_name
    FROM ptm_meetings p
    LEFT JOIN students s ON s.id = p.student_id
    LEFT JOIN teachers t ON t.id = p.teacher_id
    LEFT JOIN classes c ON c.id = p.class_id
    LEFT JOIN sections sec ON sec.id = p.section_id
    LEFT JOIN schools sc ON sc.id = p.school_id
    WHERE p.id = $1
      AND ($2::int IS NULL OR p.school_id = $2::int)
    LIMIT 1
    `,
    meetingId,
    context.schoolId
  );
  const meeting = rows[0];
  if (!meeting) {
    return NextResponse.json({ error: "PTM meeting not found." }, { status: 404 });
  }

  await ensurePtmWhatsAppTemplates(context.schoolId, Number(user.id) || null);

  const studentName = String(meeting.student_name || "Student").trim() || "Student";
  const teacherName = String(meeting.teacher_name || "Teacher").trim() || "Teacher";
  const schoolName = String(meeting.school_name || "School/College").trim() || "School/College";
  const venue = String(body.venue || meeting.address || meeting.principal_name || schoolName || "School/College premises").trim() || "School/College premises";
  const date = new Date(String(meeting.meeting_date || new Date())).toLocaleDateString("en-IN");
  const time = String(meeting.meeting_time || "-").trim() || "-";
  const parentPhone = String(body.recipient || meeting.parent_phone || meeting.whatsapp_number || "").trim();

  if (!parentPhone) {
    return NextResponse.json({ error: "No parent WhatsApp number available." }, { status: 400 });
  }

  const common = {
    schoolId: context.schoolId,
    academicYearId: context.academicYearId,
    userId: Number(user.id) || null,
    studentId: toNumber(meeting.student_id),
    recipient: parentPhone,
    triggeredBy: `PTM_${template.toUpperCase()}`,
    entityType: "ptm_meeting",
    entityId: meetingId,
  };

  if (template === "ptm_feedback") {
    await queueWhatsAppMessage({
      ...common,
      templateName: "ptm_feedback",
      variables: [
        studentName,
        String(body.teacher_remarks || meeting.notes || "-"),
        String(body.action_items || meeting.action_items || "-"),
        schoolName,
      ],
      messagePreview: `Thank you for attending PTM for ${studentName} at ${schoolName}.`,
    });
  } else if (template === "ptm_scheduled") {
    await queueWhatsAppMessage({
      ...common,
      templateName: "ptm_scheduled",
      variables: [
        studentName,
        String(meeting.class_name || "-"),
        teacherName,
        date,
        time,
        venue,
        schoolName,
      ],
      messagePreview: `PTM scheduled for ${studentName} at ${schoolName}.`,
    });
  } else {
    await queueWhatsAppMessage({
      ...common,
      templateName: "ptm_reminder",
      variables: [
        studentName,
        date,
        time,
        venue,
        schoolName,
      ],
      messagePreview: `PTM reminder for ${studentName} at ${schoolName}.`,
    });
  }

  await recordEvent({
    school_id: context.schoolId,
    academic_year_id: context.academicYearId,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "ptm",
    event_type: template.toUpperCase(),
    action: "notify",
    entity_type: "ptm_meeting",
    entity_id: meetingId,
    summary: `PTM ${template.replace(/_/g, " ")}`,
    payload: { template, studentName, schoolName },
  });

  return NextResponse.json({ success: true, template });
}
