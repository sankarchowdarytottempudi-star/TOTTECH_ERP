import PDFDocument from "pdfkit";
import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { apiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const parsePositive = (value: string | null) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

async function loadRows(filters: {
  schoolId: number | null;
  academicYearId: number | null;
  examScheduleId: number | null;
  classId: number | null;
  sectionId: number | null;
  studentId: number | null;
}) {
  return prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      aeu.id,
      aeu.teacher_review_status,
      aeu.teacher_comments,
      aeu.created_at,
      sc.school_name,
      ay.academic_year,
      s.name AS student_name,
      s.admission_number,
      c.class_name,
      sec.section_name,
      es.exam_date,
      qp.paper_name,
      aeu.ai_summary,
      aeu.ai_evaluation
    FROM answer_evaluation_uploads aeu
    LEFT JOIN schools sc ON sc.id = aeu.school_id
    LEFT JOIN academic_years ay ON ay.id = aeu.academic_year_id
    LEFT JOIN students s ON s.id = aeu.student_id
    LEFT JOIN classes c ON c.id = aeu.class_id
    LEFT JOIN sections sec ON sec.id = aeu.section_id
    LEFT JOIN exam_schedule es ON es.id = aeu.exam_schedule_id
    LEFT JOIN question_papers qp ON qp.id = aeu.question_paper_id
    WHERE ($1::int IS NULL OR aeu.school_id = $1::int)
      AND ($2::int IS NULL OR aeu.academic_year_id = $2::int OR aeu.academic_year_id IS NULL)
      AND ($3::int IS NULL OR aeu.exam_schedule_id = $3::int)
      AND ($4::int IS NULL OR aeu.class_id = $4::int)
      AND ($5::int IS NULL OR aeu.section_id = $5::int)
      AND ($6::int IS NULL OR aeu.student_id = $6::int)
    ORDER BY aeu.created_at DESC, aeu.id DESC
    LIMIT 500
    `,
    filters.schoolId,
    filters.academicYearId,
    filters.examScheduleId,
    filters.classId,
    filters.sectionId,
    filters.studentId
  );
}

function collectPdf(render: (doc: PDFKit.PDFDocument) => void) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 32 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    render(doc);
    doc.end();
  });
}

function toText(value: unknown, fallback = "-") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

export async function GET(request: Request) {
  try {
    const context = await resolvePlatformContext(request);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = String(searchParams?.get("format") || "pdf").toLowerCase();
    const type = String(searchParams?.get("type") || "student").toLowerCase();
    const schoolId = parsePositive(searchParams?.get("school_id")) ?? context.schoolId;
    const academicYearId = parsePositive(searchParams?.get("academic_year_id")) ?? context.academicYearId;
    const examScheduleId = parsePositive(searchParams?.get("exam_schedule_id"));
    const classId = parsePositive(searchParams?.get("class_id"));
    const sectionId = parsePositive(searchParams?.get("section_id"));
    const studentId = parsePositive(searchParams?.get("student_id"));

    const rows = await loadRows({
      schoolId,
      academicYearId,
      examScheduleId,
      classId,
      sectionId,
      studentId,
    });

    const summary = {
      totalRecords: rows.length,
      approved: rows.filter((row) => String(row.teacher_review_status || "").toUpperCase() === "APPROVED").length,
      pending: rows.filter((row) => String(row.teacher_review_status || "").toUpperCase() === "PENDING").length,
      override: rows.filter((row) => String(row.teacher_review_status || "").toUpperCase() === "OVERRIDE").length,
    };

    if (format === "xlsx" || format === "excel") {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          [
            {
              report_type: type,
              school_id: schoolId ?? "All",
              academic_year_id: academicYearId ?? "All",
              exam_schedule_id: examScheduleId ?? "All",
              class_id: classId ?? "All",
              section_id: sectionId ?? "All",
              student_id: studentId ?? "All",
              total_records: summary.totalRecords,
              approved_reviews: summary.approved,
              pending_reviews: summary.pending,
              override_reviews: summary.override,
            },
          ]
        ),
        "Summary"
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          rows.map((row) => ({
            student_name: row.student_name,
            admission_number: row.admission_number,
            class_name: row.class_name,
            section_name: row.section_name,
            paper_name: row.paper_name,
            review_status: row.teacher_review_status,
            comments: row.teacher_comments,
            created_at: row.created_at,
          }))
        ),
        "Records"
      );

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename=answer-evaluation-${type}.xlsx`,
        },
      });
    }

    const pdfBuffer = await collectPdf((doc) => {
      doc.fontSize(20).fillColor("#04142E").text("AI Answer Evaluation Report", { align: "center" });
      doc.moveDown(0.4);
      doc.fontSize(11).fillColor("#6B7280").text(`Report Type: ${type.toUpperCase()}`, { align: "center" });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#111827");
      doc.text(`School/College: ${schoolId ?? "All Schools/Colleges"}`);
      doc.text(`Academic Year: ${academicYearId ?? "All Years"}`);
      doc.text(`Exam Schedule: ${examScheduleId ?? "All Exams"}`);
      doc.text(`Class: ${classId ?? "All Classes"}`);
      doc.text(`Section: ${sectionId ?? "All Sections"}`);
      doc.text(`Student: ${studentId ?? "All Students"}`);
      doc.text(`Generated: ${new Date().toLocaleString()}`);

      doc.moveDown();
      doc.fontSize(12).fillColor("#04142E").text("Executive Summary");
      doc.moveDown(0.2);
      doc.fontSize(10).fillColor("#111827");
      doc.text(`Total Records: ${summary.totalRecords}`);
      doc.text(`Approved: ${summary.approved}`);
      doc.text(`Pending: ${summary.pending}`);
      doc.text(`Override: ${summary.override}`);

      doc.moveDown();
      doc.fontSize(12).fillColor("#04142E").text("Records");
      doc.moveDown(0.2);

      rows.slice(0, 18).forEach((row, index) => {
        doc.fontSize(10).fillColor("#111827").text(
          `${index + 1}. ${toText(row.student_name)} • ${toText(row.admission_number)} • ${toText(row.class_name)} ${toText(row.section_name)} • ${toText(row.paper_name)} • ${toText(row.teacher_review_status, "PENDING")}`
        );
        doc.fontSize(9).fillColor("#6B7280").text(`Comments: ${toText(row.teacher_comments)}`);
        doc.moveDown(0.25);
      });
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=answer-evaluation-${type}.pdf`,
      },
    });
  } catch (error) {
    console.error(error);
    return apiError(error, "Failed to export answer evaluation report");
  }
}
