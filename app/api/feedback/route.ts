import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const types = new Set(["COMPLAINT", "SUGGESTION", "FEEDBACK", "ESCALATION"]);
const statuses = new Set(["OPEN", "ASSIGNED", "RESOLVED", "CLOSED"]);

export async function GET(request: Request) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams?.get("status");
  const feedbackType = searchParams?.get("feedback_type");

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT f.*, assignee.full_name AS assigned_to_name, s.school_name
    FROM school_feedback f
    LEFT JOIN users assignee ON assignee.id = f.assigned_to
    LEFT JOIN schools s ON s.id = f.school_id
    WHERE ($1::int IS NULL OR f.school_id = $1::int)
      AND ($2::int IS NULL OR f.academic_year_id = $2::int OR f.academic_year_id IS NULL)
      AND ($3::text IS NULL OR f.status = $3::text)
      AND ($4::text IS NULL OR f.feedback_type = $4::text)
    ORDER BY f.created_at DESC, f.id DESC
    LIMIT 200
    `,
    context.schoolId,
    context.academicYearId,
    status,
    feedbackType
  );

  return NextResponse.json({ feedback: rows });
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
    return NextResponse.json({ error: "Select a school before saving feedback." }, { status: 400 });
  }

  const body = await request.json();
  const feedbackType = String(body.feedback_type || "").trim().toUpperCase();
  const status = String(body.status || "OPEN").trim().toUpperCase();

  if (!types.has(feedbackType) || !statuses.has(status)) {
    return NextResponse.json({ error: "Valid type and status are required." }, { status: 400 });
  }
  if (!body.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO school_feedback (
      school_id, academic_year_id, feedback_type, title, description, status,
      priority, assigned_to, student_id, parent_name, contact_phone,
      created_by, updated_by, created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
    RETURNING *
    `,
    context.schoolId,
    context.academicYearId,
    feedbackType,
    body.title,
    body.description || null,
    status,
    body.priority || "NORMAL",
    Number(body.assigned_to) || null,
    Number(body.student_id) || null,
    body.parent_name || null,
    body.contact_phone || null,
    Number(user.id) || null
  );

  await recordEvent({
    school_id: context.schoolId,
    academic_year_id: context.academicYearId,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "communication",
    event_type: `${feedbackType}_CREATED`,
    action: "create",
    entity_type: "school_feedback",
    entity_id: Number(rows[0]?.id) || null,
    summary: `${feedbackType.toLowerCase()} created.`,
    payload: rows[0] || {},
  });

  return NextResponse.json(rows[0], { status: 201 });
}

export async function PATCH(request: Request) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const id = Number(body.id);
  const status = String(body.status || "").trim().toUpperCase();
  if (!id || !statuses.has(status)) {
    return NextResponse.json({ error: "Valid id and status are required." }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE school_feedback
    SET status = $2,
        assigned_to = COALESCE($3, assigned_to),
        resolution_notes = COALESCE($4, resolution_notes),
        updated_at = CURRENT_TIMESTAMP,
        resolved_at = CASE WHEN $2 = 'RESOLVED' THEN CURRENT_TIMESTAMP ELSE resolved_at END,
        closed_at = CASE WHEN $2 = 'CLOSED' THEN CURRENT_TIMESTAMP ELSE closed_at END
    WHERE id = $1
      AND ($5::int IS NULL OR school_id = $5::int)
    RETURNING *
    `,
    id,
    status,
    Number(body.assigned_to) || null,
    body.resolution_notes || null,
    context.schoolId
  );

  return NextResponse.json(rows[0] || null);
}
