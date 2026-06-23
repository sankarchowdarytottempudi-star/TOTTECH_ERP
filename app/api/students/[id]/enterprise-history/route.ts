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
  const studentId = Number(id);
  const schoolId =
    auth.user?.school_id ?? null;

  const [
    profile,
    academicYears,
    promotions,
    attendance,
    homework,
    marks,
    invoices,
    payments,
    concessions,
    dining,
    hostel,
    hostelMoves,
    transport,
    transportMoves,
    timelines,
    events,
  ] = await Promise.all([
    prisma.students.findUnique({
      where: {
        id: studentId,
      },
    }),
    prisma.$queryRawUnsafe(
      `
      SELECT sye.*, ay.academic_year, c.class_name, sec.section_name
      FROM student_year_enrollments sye
      LEFT JOIN academic_years ay ON ay.id = sye.academic_year_id
      LEFT JOIN classes c ON c.id = sye.class_id
      LEFT JOIN sections sec ON sec.id = sye.section_id
      WHERE sye.student_id = $1
      ORDER BY ay.start_date DESC NULLS LAST, sye.id DESC
      `,
      studentId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT sp.*, say.academic_year AS source_academic_year, tay.academic_year AS target_academic_year
      FROM student_promotions sp
      LEFT JOIN academic_years say ON say.id = sp.source_academic_year_id
      LEFT JOIN academic_years tay ON tay.id = sp.target_academic_year_id
      WHERE sp.student_id = $1
      ORDER BY COALESCE(sp.promotion_date, sp.promoted_on::date) DESC NULLS LAST, sp.id DESC
      `,
      studentId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT a.*, ay.academic_year
      FROM attendance_master a
      LEFT JOIN academic_years ay ON ay.id = a.academic_year_id
      WHERE a.student_id = $1
      ORDER BY a.attendance_date DESC NULLS LAST
      LIMIT 200
      `,
      studentId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT hs.*, ha.title, ha.description, ha.due_date, ay.academic_year
      FROM homework_submissions hs
      LEFT JOIN homework_assignments ha ON ha.id = hs.homework_id
      LEFT JOIN academic_years ay ON ay.id = hs.academic_year_id
      WHERE hs.student_id = $1
      ORDER BY hs.created_at DESC
      LIMIT 200
      `,
      studentId
    ),
    prisma.marks.findMany({
      where: {
        student_id: studentId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 200,
    }),
    prisma.$queryRawUnsafe(
      `
      SELECT i.*, ay.academic_year
      FROM invoices i
      LEFT JOIN academic_years ay ON ay.id = i.academic_year_id
      WHERE i.student_id = $1
      ORDER BY i.created_at DESC
      LIMIT 200
      `,
      studentId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT p.*, ay.academic_year
      FROM payments p
      LEFT JOIN academic_years ay ON ay.id = p.academic_year_id
      WHERE p.student_id = $1
      ORDER BY p.created_at DESC
      LIMIT 200
      `,
      studentId
    ),
    prisma.concession_requests.findMany({
      where: {
        student_id: studentId,
      },
      orderBy: {
        requested_at: "desc",
      },
      take: 200,
    }),
    prisma.$queryRawUnsafe(
      `
      SELECT d.*, ay.academic_year
      FROM dining_attendance d
      LEFT JOIN academic_years ay ON ay.id = d.academic_year_id
      WHERE d.student_id = $1
      ORDER BY d.attendance_date DESC
      LIMIT 200
      `,
      studentId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT ha.*, ay.academic_year
      FROM hostel_allocations ha
      LEFT JOIN academic_years ay ON ay.id = ha.academic_year_id
      WHERE ha.student_id = $1
      ORDER BY ha.allocation_date DESC NULLS LAST, ha.id DESC
      LIMIT 200
      `,
      studentId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT hmh.*, ay.academic_year
      FROM hostel_movement_history hmh
      LEFT JOIN academic_years ay ON ay.id = hmh.academic_year_id
      WHERE hmh.student_id = $1
      ORDER BY hmh.movement_at DESC
      LIMIT 200
      `,
      studentId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT ta.*, tr.route_name, ay.academic_year
      FROM transport_assignments ta
      LEFT JOIN transport_routes tr ON tr.id = ta.route_id
      LEFT JOIN academic_years ay ON ay.id = ta.academic_year_id
      WHERE ta.student_id = $1
      ORDER BY ta.id DESC
      LIMIT 200
      `,
      studentId
    ),
    prisma.$queryRawUnsafe(
      `
      SELECT tph.*, ay.academic_year
      FROM transport_pickup_drop_history tph
      LEFT JOIN academic_years ay ON ay.id = tph.academic_year_id
      WHERE tph.student_id = $1
      ORDER BY tph.event_time DESC
      LIMIT 200
      `,
      studentId
    ),
    prisma.student_timelines.findMany({
      where: {
        student_id: studentId,
      },
      orderBy: {
        occurred_at: "desc",
      },
      take: 200,
    }),
    prisma.event_ledger.findMany({
      where: {
        school_id: schoolId ?? undefined,
        entity_type: "student",
        entity_id: studentId,
      },
      orderBy: {
        occurred_at: "desc",
      },
      take: 200,
    }),
  ]);

  return NextResponse.json({
    profile,
    academicYears,
    promotions,
    attendance,
    homework,
    marks,
    invoices,
    payments,
    concessions,
    dining,
    hostel,
    hostelMoves,
    transport,
    transportMoves,
    timelines,
    events,
  });
}
