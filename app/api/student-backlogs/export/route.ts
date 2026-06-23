import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { resolvePlatformContext } from "@/lib/api/context";
import { apiError } from "@/lib/api/errors";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";

const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function GET(request: Request) {
  try {
    const guard = await requireSchoolModule("STUDENTS");
    if (guard.response) {
      return guard.response;
    }

    const context = await resolvePlatformContext(request);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const schoolId =
      numberOrNull(url.searchParams?.get("school_id")) ??
      context.schoolId ??
      null;
    const academicYearId =
      numberOrNull(url.searchParams?.get("academic_year_id")) ??
      context.academicYearId ??
      null;

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `
      SELECT
        sb.id,
        sb.student_id,
        COALESCE(NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.middle_name, '') || ' ' || COALESCE(s.last_name, '')), ''), s.name) AS student_name,
        sch.school_name,
        ay.academic_year,
        c.class_name,
        sec.section_name,
        sub.subject_name,
        ex.exam_name,
        sb.backlog_status,
        sb.backlog_reason,
        sb.cleared_date,
        sb.remarks,
        sb.created_at
      FROM student_backlogs sb
      LEFT JOIN students s ON s.id = sb.student_id
      LEFT JOIN schools sch ON sch.id = sb.school_id
      LEFT JOIN academic_years ay ON ay.id = sb.academic_year_id
      LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, s.section_id)
      LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id)
      LEFT JOIN subjects sub ON sub.id = sb.subject_id
      LEFT JOIN exams ex ON ex.id = sb.exam_id
      WHERE ($1::int IS NULL OR sb.school_id = $1::int)
        AND ($2::int IS NULL OR sb.academic_year_id = $2::int)
      ORDER BY sb.created_at DESC, sb.id DESC
      `,
      schoolId,
      academicYearId
    );

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(
      rows.map((row) => ({
        "Student Name": row.student_name || "",
        "School/College": row.school_name || "",
        "Academic Year": row.academic_year || "",
        Class: row.class_name || "",
        Section: row.section_name || "",
        Subject: row.subject_name || "",
        Exam: row.exam_name || "",
        Status: row.backlog_status || "",
        Reason: row.backlog_reason || "",
        "Cleared Date": row.cleared_date || "",
        Remarks: row.remarks || "",
      }))
    );
    XLSX.utils.book_append_sheet(workbook, sheet, "Backlogs");

    const totals = XLSX.utils.json_to_sheet([
      {
        rows: rows.length,
        cleared: rows.filter(
          (row) =>
            String(row.backlog_status || "PENDING").toUpperCase() === "CLEARED"
        ).length,
        pending: rows.filter(
          (row) =>
            String(row.backlog_status || "PENDING").toUpperCase() !== "CLEARED"
        ).length,
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, totals, "Totals");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    }) as Buffer;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="student-backlogs.xlsx"`,
      },
    });
  } catch (error) {
    return apiError(error, "Failed to export backlog workbook");
  }
}
