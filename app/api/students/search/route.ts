import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const guard = await requireSchoolModule("STUDENTS");
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

  const startedAt = Date.now();
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams?.get("q")?.trim() || "";
  const query = rawQuery.toLowerCase();
  const digits = rawQuery.replace(/\D/g, "");

  if (rawQuery.length < 3) {
    return NextResponse.json({
      query: rawQuery,
      count: 0,
      results: [],
      timing_ms: Date.now() - startedAt,
      message: "Type at least 3 characters to search students.",
    });
  }

  const searchRows = async (academicYearFilter: number | null) =>
    prisma.$queryRawUnsafe<Row[]>(
      `
    SELECT
      s.id,
      s.first_name,
      s.middle_name,
      s.last_name,
      s.name,
      s.photo_url,
      s.admission_number,
      s.enrollment_number,
      s.phone,
      s.father_name,
      s.mother_name,
      s.uid,
      s.apaar,
      s.pen,
      s.has_previous_school,
      s.previous_school_details,
      s.previous_academic_performance,
      s.academic_gap_duration,
      s.school_id,
      CASE
        WHEN COALESCE(s.is_suspended, false) = true THEN 'SUSPENDED'
        WHEN COALESCE(s.is_active, true) = false THEN 'INACTIVE'
        ELSE 'ACTIVE'
      END AS student_status,
      sch.school_name,
      COALESCE(c.class_name, '') AS class_name,
      COALESCE(sec.section_name, '') AS section_name,
      COALESCE(ay.academic_year, '') AS academic_year,
      COALESCE(sye.roll_number, s.roll_number, '') AS resolved_roll_number
    FROM students s
    LEFT JOIN schools sch ON sch.id = s.school_id
    LEFT JOIN student_year_enrollments sye
      ON sye.student_id = s.id
      AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
      AND COALESCE(sye.status, 'ACTIVE') = 'ACTIVE'
    LEFT JOIN classes c
      ON c.id = COALESCE(s.current_class_id, sye.class_id)
    LEFT JOIN sections sec
      ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
    LEFT JOIN academic_years ay
      ON ay.id = COALESCE(s.academic_year_id, sye.academic_year_id)
    WHERE ($1::int IS NULL OR s.school_id = $1::int)
      AND (
        $2::int IS NULL
        OR s.academic_year_id = $2::int
        OR sye.academic_year_id = $2::int
        OR (s.academic_year_id IS NULL AND sye.academic_year_id IS NULL)
      )
      AND (
        lower(COALESCE(s.name, '')) LIKE $3
        OR lower(COALESCE(s.first_name, '') || ' ' || COALESCE(s.middle_name, '') || ' ' || COALESCE(s.last_name, '')) LIKE $3
        OR lower(COALESCE(s.admission_number, '')) LIKE $3
        OR lower(COALESCE(s.enrollment_number, '')) LIKE $3
        OR lower(COALESCE(s.phone, '')) LIKE $3
        OR lower(COALESCE(s.father_name, '')) LIKE $3
        OR lower(COALESCE(s.mother_name, '')) LIKE $3
        OR lower(COALESCE(c.class_name, '')) LIKE $3
        OR lower(COALESCE(sec.section_name, '')) LIKE $3
        OR ($4::text <> '' AND right(regexp_replace(COALESCE(s.uid, ''), '\\D', '', 'g'), 4) = right($4::text, 4))
        OR ($4::text <> '' AND right(regexp_replace(COALESCE(s.apaar, ''), '\\D', '', 'g'), 4) = right($4::text, 4))
        OR ($4::text <> '' AND right(regexp_replace(COALESCE(s.pen, ''), '\\D', '', 'g'), 4) = right($4::text, 4))
        OR ($4::text <> '' AND regexp_replace(COALESCE(s.phone, ''), '\\D', '', 'g') LIKE '%' || $4::text)
      )
    ORDER BY
      CASE
        WHEN lower(COALESCE(s.name, '')) LIKE $3 THEN 1
        WHEN lower(COALESCE(s.first_name, '') || ' ' || COALESCE(s.middle_name, '') || ' ' || COALESCE(s.last_name, '')) LIKE $3 THEN 2
        WHEN lower(COALESCE(s.admission_number, '')) LIKE $3 THEN 3
        WHEN lower(COALESCE(s.enrollment_number, '')) LIKE $3 THEN 4
        WHEN $4::text <> '' AND regexp_replace(COALESCE(s.phone, ''), '\\D', '', 'g') LIKE '%' || $4::text THEN 5
        ELSE 6
      END,
      s.created_at DESC,
      s.id DESC
    LIMIT 20
    `,
      context.schoolId,
      academicYearFilter,
      `%${query}%`,
      digits
    );

  let rows = await searchRows(context.academicYearId ?? null);
  const fallbackUsed = !rows.length && context.academicYearId !== null;
  if (fallbackUsed) {
    rows = await searchRows(null);
  }

  return NextResponse.json({
    query: rawQuery,
    count: rows.length,
    timing_ms: Date.now() - startedAt,
    fallback_used: fallbackUsed,
    results: rows.map((row) => ({
      id: row.id,
      student_name:
        row.name ||
        [row.first_name, row.middle_name, row.last_name]
          .filter(Boolean)
          .join(" ") ||
        `Student ${row.id}`,
      admission_number: row.admission_number,
      enrollment_number: row.enrollment_number,
      phone: row.phone,
      father_name: row.father_name,
      mother_name: row.mother_name,
      school_name: row.school_name,
      student_status: row.student_status,
      class_name: row.class_name,
      section_name: row.section_name,
      academic_year: row.academic_year,
      roll_number: row.resolved_roll_number,
      photo_url: row.photo_url,
      has_previous_school: row.has_previous_school,
      previous_school_details: row.previous_school_details,
      previous_academic_performance: row.previous_academic_performance,
      academic_gap_duration: row.academic_gap_duration,
      patient_360_href: `/students/${row.id}`,
    })),
  });
}
