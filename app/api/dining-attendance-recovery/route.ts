import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import { recordEvent } from "@/lib/governance/events";
import {
  requireCurrentUser,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth = await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const where =
    await scopedSchoolWhere(auth.user);
  const [
    attendance,
    summary,
    mealPlans,
    specialDiets,
  ] = await Promise.all([
    prisma.dining_attendance.findMany({
      where,
      orderBy: {
        attendance_date: "desc",
      },
      take: 200,
    }),
    prisma.dining_attendance.groupBy({
      by: ["meal_type", "status"],
      where,
      _count: {
        id: true,
      },
    }),
    prisma.$queryRawUnsafe(
      `
      SELECT *
      FROM dining_meal_plans
      WHERE ($1::int IS NULL OR school_id = $1::int)
      ORDER BY created_at DESC
      LIMIT 100
      `,
      auth.user?.school_id ?? null
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT *
      FROM dining_special_diets
      WHERE ($1::int IS NULL OR school_id = $1::int)
      ORDER BY created_at DESC
      LIMIT 100
      `,
      auth.user?.school_id ?? null
    ),
  ]);

  return NextResponse.json({
    attendance,
    summary,
    mealPlans,
    specialDiets,
    offlineRecovery: {
      supported: true,
      source:
        "APK-proven offline dining attendance recovery",
    },
  });
}

export async function POST(
  request: Request
) {
  const auth = await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const body = await request.json();
  const schoolId =
    auth.user?.school_id ?? null;
  const academicYear =
    await getSelectedAcademicYear(
      schoolId
    );
  const academicYearId =
    Number(
      body.academic_year_id ??
        (auth.user as any)
          ?.academic_year_id ??
        academicYear?.id
    ) || null;
  const records = Array.isArray(body.records)
    ? body.records
    : [body];
  const saved = [];

  for (const item of records) {
    const rows =
      await prisma.$queryRawUnsafe<
        unknown[]
      >(
        `
        INSERT INTO dining_attendance (
          school_id,
          academic_year_id,
          student_id,
          meal_type,
          attendance_date,
          status,
          recorded_by,
          source,
          remarks,
          metadata,
          created_by
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11)
        ON CONFLICT ON CONSTRAINT uq_dining_student_meal_date
        DO UPDATE SET
          academic_year_id = EXCLUDED.academic_year_id,
          status = EXCLUDED.status,
          recorded_by = EXCLUDED.recorded_by,
          source = EXCLUDED.source,
          remarks = EXCLUDED.remarks,
          metadata = EXCLUDED.metadata,
          created_by = EXCLUDED.created_by
        RETURNING *
        `,
        schoolId,
        academicYearId,
        item.student_id
          ? Number(item.student_id)
          : null,
        String(item.meal_type ?? "LUNCH"),
        item.attendance_date
          ? new Date(item.attendance_date)
          : new Date(),
        item.status ?? "PRESENT",
        auth.user?.id ?? null,
        item.source ??
          "mobile-offline-recovery",
        item.remarks ?? null,
        JSON.stringify(item.metadata ?? {}),
        auth.user?.id ?? null
      );
    const record = rows[0];

    saved.push(record);
  }

  await recordEvent({
    school_id:
      schoolId,
    academic_year_id:
      academicYearId,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "dining",
    event_type:
      "DINING_ATTENDANCE_RECOVERY_SYNCED",
    action: "sync",
    entity_type: "school",
    entity_id:
      schoolId,
    summary:
      "Dining attendance offline recovery synced",
    payload: {
      count: saved.length,
    },
  });

  return NextResponse.json({
    saved,
  });
}
