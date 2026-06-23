import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const teacherId = Number(id);
  const schoolId =
    auth.user?.school_id ?? null;

  const [
    profile,
    assignedClasses,
    attendance,
    homeworkCreated,
    timetable,
    questionBank,
    dining,
    timelines,
    events,
  ] = await Promise.all([
    prisma.teachers.findUnique({
      where: {
        id: teacherId,
      },
    }),
    prisma.classes.findMany({
      where: {
        class_teacher_id:
          teacherId,
      },
      include: {
        sections: true,
      },
    }),
    prisma.teacher_attendance.findMany({
      where: {
        teacher_id: teacherId,
      },
      orderBy: {
        attendance_date: "desc",
      },
      take: 200,
    }),
    prisma.$queryRawUnsafe(
      `
      SELECT ha.*, ay.academic_year
      FROM homework_assignments ha
      LEFT JOIN academic_years ay ON ay.id = ha.academic_year_id
      WHERE ha.teacher_id = $1
      ORDER BY ha.created_at DESC
      LIMIT 200
      `,
      teacherId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT te.*, ay.academic_year
      FROM timetable_entries te
      LEFT JOIN academic_years ay ON ay.id = te.academic_year_id
      WHERE te.teacher_id = $1
      ORDER BY te.day_of_week, te.start_time
      LIMIT 200
      `,
      teacherId
    ),
    prisma.question_bank.findMany({
      where: {
        created_by: teacherId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 200,
    }),
    prisma.$queryRawUnsafe(
      `
      SELECT d.*, ay.academic_year
      FROM dining_attendance d
      LEFT JOIN academic_years ay ON ay.id = d.academic_year_id
      WHERE d.teacher_id = $1
      ORDER BY d.attendance_date DESC
      LIMIT 200
      `,
      teacherId
    ),
    prisma.teacher_timelines.findMany({
      where: {
        teacher_id: teacherId,
      },
      orderBy: {
        occurred_at: "desc",
      },
      take: 200,
    }),
    prisma.event_ledger.findMany({
      where: {
        school_id: schoolId ?? undefined,
        entity_type: "teacher",
        entity_id: teacherId,
      },
      orderBy: {
        occurred_at: "desc",
      },
      take: 200,
    }),
  ]);

  return NextResponse.json({
    profile,
    assignedClasses,
    attendance,
    homeworkCreated,
    timetable,
    questionBank,
    dining,
    timelines,
    events,
  });
}
