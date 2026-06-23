import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { getCurrentUser } from "@/lib/auth";
import { apiError, validationError } from "@/lib/api/errors";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";

const text = (value: unknown) => String(value ?? "").trim();
const numberOrNull = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function POST(request: Request) {
  try {
    const guard = await requireSchoolModule("STUDENTS");
    if (guard.response) {
      return guard.response;
    }

    const user = await getCurrentUser();
    if (!user) {
      return validationError("Login required before importing backlogs.");
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return validationError("Attach an Excel file before importing.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!firstSheet) {
      return validationError("The workbook does not contain a worksheet.");
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
      defval: "",
    });

    const imported: Record<string, unknown>[] = [];
    const schoolId = Number(user.school_id) || null;
    const academicYearId =
      numberOrNull(form.get("academic_year_id")) ??
      numberOrNull(user.academic_year_id) ??
      null;

    for (const row of rows) {
      const studentId = numberOrNull(
        row.student_id ?? row.StudentID ?? row.Student_Id
      );
      if (!studentId) {
        continue;
      }

      const subjectId = numberOrNull(row.subject_id ?? row.SubjectID);
      const examId = numberOrNull(row.exam_id ?? row.ExamID);
      const backlogStatus = String(
        row.backlog_status ?? row.Status ?? "Pending"
      ).trim().toUpperCase() === "CLEARED"
        ? "CLEARED"
        : "PENDING";
      const backlogReason = text(row.backlog_reason ?? row.Reason) || null;
      const clearedDate = text(row.cleared_date ?? row.ClearedDate) || null;
      const remarks = text(row.remarks ?? row.Remarks) || null;

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
        schoolId,
        academicYearId,
        subjectId,
        examId,
        backlogStatus,
        backlogReason,
        backlogStatus === "CLEARED" && clearedDate
          ? new Date(clearedDate)
          : null,
        remarks
      );

      imported.push({
        student_id: studentId,
        subject_id: subjectId,
        exam_id: examId,
        backlog_status: backlogStatus,
      });

      await recordEvent({
        school_id: schoolId,
        academic_year_id: academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "students",
        event_type:
          backlogStatus === "CLEARED"
            ? "BACKLOG_CLEARED"
            : "BACKLOG_CREATED",
        action: "create",
        entity_type: "student",
        entity_id: studentId,
        summary: "Backlog imported from Excel",
        payload: {
          subject_id: subjectId,
          exam_id: examId,
          backlog_status: backlogStatus,
          backlog_reason: backlogReason,
        },
      });
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      rows: imported,
    });
  } catch (error) {
    return apiError(error, "Failed to import backlog workbook");
  }
}
