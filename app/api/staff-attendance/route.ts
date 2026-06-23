import { NextResponse } from "next/server";

import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

const todayDate = () =>
  new Date().toISOString().slice(0, 10);

export async function GET() {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before loading staff attendance."
      );
    }

    const schoolId =
      user.role === "SUPER_ADMIN" &&
      !user.school_id
        ? null
        : Number(user.school_id) || null;

    const records =
      await prisma.teacher_attendance.findMany({
        where: schoolId
          ? {
              school_id: schoolId,
            }
          : {},
        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(records);

  } catch (error) {

    console.error(error);

    return apiError(
      error,
      "Failed to load staff attendance."
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before saving staff attendance."
      );
    }

    const body = await request.json();
    const teacherId =
      Number(body.teacher_id);

    if (
      !teacherId ||
      !Number.isFinite(teacherId)
    ) {
      return validationError(
        "Teacher is required before saving staff attendance."
      );
    }

    const teacher =
      await prisma.teachers.findUnique({
        where: {
          id: teacherId,
        },
        select: {
          id: true,
          school_id: true,
        },
      });

    if (!teacher) {
      return validationError(
        "Selected teacher was not found."
      );
    }

    const schoolId =
      Number(
        body.school_id ??
          teacher.school_id ??
          user.school_id
      ) || null;

    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          user.academic_year_id ??
          academicYear?.id
      ) || null;

    const attendanceDate =
      body.attendance_date
        ? String(body.attendance_date).slice(0, 10)
        : todayDate();

    if (attendanceDate !== todayDate()) {
      return validationError(
        "Staff attendance can only be marked for today."
      );
    }

    const record =
      await prisma.teacher_attendance.create({
        data: {
          school_id: schoolId,
          academic_year_id:
            academicYearId,
          teacher_id: teacherId,
          attendance_date: new Date(
            `${attendanceDate}T00:00:00.000Z`
          ),
          status:
            body.status || "PRESENT",
          remarks: body.remarks || "",
          created_by: user.id || null,
        },
      });

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name:
        "teacher_attendance",
      event_type:
        "TEACHER_ATTENDANCE_RECORDED",
      action: "record",
      entity_type: "teacher",
      entity_id: teacherId,
      summary:
        "Teacher attendance recorded",
      payload: {
        attendance_id: record.id,
        status: record.status,
        attendance_date:
          record.attendance_date,
      },
    });

    return NextResponse.json(record);

  } catch (error) {

    console.error(error);

    return apiError(
      error,
      "Failed to save staff attendance."
    );
  }
}
