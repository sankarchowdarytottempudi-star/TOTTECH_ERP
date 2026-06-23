import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { getCurrentUser } from "@/lib/auth";
import { requireSchoolModule } from "@/lib/module-governance";
import { getParentLinkedStudents } from "@/lib/parent-access";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const statuses = new Set([
  "WILL_ATTEND",
  "BOARDED_BUS",
  "ABSENT",
  "LEAVE",
  "MEDICAL_LEAVE",
]);

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

export async function GET(request: Request) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) {
    return guard.response;
  }

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const studentId = toNumber(searchParams?.get("student_id"));
  const user = await getCurrentUser();
  const linkedStudents =
    user?.role === "PARENT"
      ? await getParentLinkedStudents({
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          full_name: user.full_name,
          school_id: context.schoolId,
        })
      : null;
  if (user?.role === "PARENT" && !linkedStudents?.length) {
    return NextResponse.json({ declarations: [] });
  }
  const requestedStudentId =
    studentId &&
    linkedStudents?.length &&
    !linkedStudents.some((student) => Number(student.id) === studentId)
      ? null
      : studentId;

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      d.*,
      COALESCE(s.name, NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), 'Student ' || s.id::text) AS student_name,
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
    LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, sye.section_id, s.section_id)
    WHERE ($1::int IS NULL OR d.school_id = $1::int)
      AND ($2::int IS NULL OR d.academic_year_id = $2::int OR d.academic_year_id IS NULL)
      AND ($3::int IS NULL OR d.student_id = $3::int)
    ORDER BY d.declaration_date DESC, d.id DESC
    LIMIT 150
    `,
    context.schoolId,
    context.academicYearId,
    requestedStudentId
  );

  return NextResponse.json({ declarations: rows });
}

export async function POST(request: Request) {
  const guard = await requireSchoolModule("PARENT_PORTAL");
  if (guard.response) {
    return guard.response;
  }

  const context = await resolvePlatformContext(request);
  const user = await getCurrentUser();
  if (!context || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const studentId = toNumber(body.student_id);
  const status = String(body.declaration_status || "")
    .trim()
    .toUpperCase();
  const linkedStudentSet =
    user.role === "PARENT"
      ? new Set(
          (
            await getParentLinkedStudents({
              id: user.id,
              username: user.username,
              email: user.email,
              phone: user.phone,
              full_name: user.full_name,
              school_id: context.schoolId,
            })
          ).map((student) => Number(student.id))
        )
      : null;
  if (user.role === "PARENT" && !linkedStudentSet?.size) {
    return NextResponse.json(
      { error: "No linked students were found for this parent account." },
      { status: 403 }
    );
  }

  if (!context.schoolId || !studentId) {
    return NextResponse.json(
      { error: "School/College and student are required." },
      { status: 400 }
    );
  }

  if (
    linkedStudentSet &&
    !linkedStudentSet.has(studentId)
  ) {
    return NextResponse.json(
      { error: "You can only submit declarations for your linked student(s)." },
      { status: 403 }
    );
  }

  if (!statuses.has(status)) {
    return NextResponse.json(
      { error: "Select Will Attend, Boarded Bus, Absent, Leave, or Medical Leave." },
      { status: 400 }
    );
  }

  if (status === "LEAVE" || status === "MEDICAL_LEAVE") {
    const reason = String(body.reason || "").trim();
    if (!reason) {
      return NextResponse.json(
        { error: "Reason is required for leave or medical leave declarations." },
        { status: 400 }
      );
    }
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO parent_attendance_declarations (
      school_id, academic_year_id, student_id, declaration_date,
      declaration_status, reason, declared_by, declared_by_name,
      declared_at, created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
    ON CONFLICT (school_id, student_id, declaration_date)
    DO UPDATE SET
      declaration_status = EXCLUDED.declaration_status,
      reason = EXCLUDED.reason,
      declared_by = EXCLUDED.declared_by,
      declared_by_name = EXCLUDED.declared_by_name,
      declared_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    context.schoolId,
    context.academicYearId,
    studentId,
    body.declaration_date ? new Date(body.declaration_date) : new Date(),
    status,
    body.reason || null,
    Number(user.id) || null,
    user.full_name || user.email || "Parent"
  );

  return NextResponse.json(rows[0], { status: 201 });
}
