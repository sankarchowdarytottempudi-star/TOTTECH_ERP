import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";

const numberOrNull = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const categories = new Set([
  "TRANSFER",
  "DISCONTINUED",
  "FINANCIAL",
  "MIGRATION",
  "MEDICAL",
  "OTHER",
]);

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

  const { searchParams } =
    new URL(request.url);
  const schoolId =
    auth.user?.role === "SUPER_ADMIN"
      ? numberOrNull(
          searchParams?.get("school_id")
        ) ??
        auth.user?.school_id ??
        null
      : auth.user?.school_id ?? null;
  const academicYearId =
    numberOrNull(
      searchParams?.get(
        "academic_year_id"
      )
    );

  const [records, summary] =
    await Promise.all([
      prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT
          d.*,
          COALESCE(NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')), ''), s.name) AS student_name,
          s.admission_number,
          c.class_name,
          sec.section_name,
          ay.academic_year
        FROM student_dropout_records d
        LEFT JOIN students s ON s.id = d.student_id
        LEFT JOIN classes c ON c.id = d.from_class_id
        LEFT JOIN sections sec ON sec.id = d.from_section_id
        LEFT JOIN academic_years ay ON ay.id = d.dropout_academic_year_id
        WHERE ($1::int IS NULL OR d.school_id = $1::int)
          AND ($2::int IS NULL OR d.dropout_academic_year_id = $2::int)
        ORDER BY d.dropout_date DESC NULLS LAST, d.id DESC
        LIMIT 300
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT
          COUNT(*)::int AS dropout_count,
          COUNT(*) FILTER (WHERE dropout_category = 'TRANSFER')::int AS transfer_count,
          COUNT(*) FILTER (WHERE dropout_category = 'DISCONTINUED')::int AS discontinued_count,
          COUNT(*) FILTER (WHERE dropout_category = 'FINANCIAL')::int AS financial_count,
          COUNT(*) FILTER (WHERE dropout_category = 'MIGRATION')::int AS migration_count,
          COUNT(*) FILTER (WHERE dropout_category = 'MEDICAL')::int AS medical_count,
          COUNT(*) FILTER (WHERE dropout_category = 'OTHER')::int AS other_count
        FROM student_dropout_records
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR dropout_academic_year_id = $2::int)
        `,
        schoolId,
        academicYearId
      ),
    ]);

  return NextResponse.json({
    records,
    summary:
      summary[0] || {},
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

  const body =
    await request.json();
  const studentId = numberOrNull(
    body.student_id
  );
  const category = String(
    body.dropout_category ||
      body.category ||
      "OTHER"
  ).toUpperCase();
  const dropoutDate =
    body.dropout_date
      ? new Date(body.dropout_date)
      : new Date();

  if (!studentId) {
    return NextResponse.json(
      {
        error:
          "Select a student before marking dropout.",
      },
      {
        status: 400,
      }
    );
  }

  if (!categories.has(category)) {
    return NextResponse.json(
      {
        error:
          "Dropout category must be Transfer, Discontinued, Financial, Migration, Medical, or Other.",
      },
      {
        status: 400,
      }
    );
  }

  const studentRows =
    await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        s.*,
        COALESCE(s.current_class_id, sye.class_id) AS class_id,
        COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id,
        COALESCE(s.academic_year_id, sye.academic_year_id) AS source_academic_year_id
      FROM students s
      LEFT JOIN student_year_enrollments sye ON sye.student_id = s.id
      WHERE s.id = $1
      ORDER BY sye.academic_year_id DESC NULLS LAST
      LIMIT 1
      `,
      studentId
    );
  const student = studentRows[0];

  if (!student) {
    return NextResponse.json(
      {
        error:
          "Student not found.",
      },
      {
        status: 404,
      }
    );
  }

  const schoolId =
    Number(student.school_id) ||
    null;
  const yearId =
    numberOrNull(
      body.dropout_academic_year_id
    ) ||
    Number(
      student.source_academic_year_id
    ) ||
    null;

  if (
    auth.user?.role !== "SUPER_ADMIN" &&
    auth.user?.school_id !== schoolId
  ) {
    return NextResponse.json(
      {
        error:
          "You can only update dropout records for your school.",
      },
      {
        status: 403,
      }
    );
  }

  const rows =
    await prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      INSERT INTO student_dropout_records (
        school_id,
        student_id,
        from_class_id,
        from_section_id,
        dropout_academic_year_id,
        dropout_category,
        dropout_reason,
        dropout_date,
        remarks,
        approved_by,
        created_by,
        metadata
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10,$11::jsonb)
      RETURNING *
      `,
      schoolId,
      studentId,
      Number(student.class_id) ||
        null,
      Number(student.section_id) ||
        null,
      yearId,
      category,
      body.dropout_reason ||
        body.reason ||
        null,
      dropoutDate,
      body.remarks || null,
      auth.user?.id ?? null,
      JSON.stringify({
        source:
          "promotion_center",
      })
    );

  await prisma.$executeRawUnsafe(
    `
    UPDATE students
    SET status = $1,
        student_status = $1,
        is_active = false,
        dropout_reason = $5,
        dropout_category = $2,
        dropout_date = $3,
        dropout_academic_year_id = $4,
        status_updated_at = CURRENT_TIMESTAMP,
        status_reason = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    `,
    category === "TRANSFER"
      ? "TRANSFERRED"
      : "DROPOUT",
    category,
    dropoutDate,
    yearId,
    body.dropout_reason ||
      body.reason ||
      null,
    studentId
  );

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
    yearId,
    Number(student.class_id) || null,
    Number(student.section_id) || null,
    category === "TRANSFER"
      ? "TRANSFERRED"
      : "DROPOUT",
    auth.user?.id ?? null,
    JSON.stringify({
      source: "promotion_center",
      dropoutCategory: category,
      dropoutDate:
        dropoutDate.toISOString(),
    })
  );

  await recordEvent({
    school_id: schoolId,
    academic_year_id: yearId,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "promotions",
    event_type:
      "STUDENT_MARKED_DROPOUT",
    action: "dropout",
    entity_type: "student",
    entity_id: studentId,
    summary:
      "Student marked as dropout",
    payload: {
      category,
      dropoutDate:
        dropoutDate.toISOString(),
    },
  });

  return NextResponse.json({
    dropout: rows[0],
  });
}
