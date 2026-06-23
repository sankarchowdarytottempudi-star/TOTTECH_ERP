import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth = await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const schoolId =
    auth.user?.school_id ?? null;
  const submissions =
    await prisma.$queryRawUnsafe(
      `
      SELECT hs.*, ha.title AS homework_title, ha.due_date, s.name AS student_name
      FROM homework_submissions hs
      LEFT JOIN homework_assignments ha ON ha.id = hs.homework_id
      LEFT JOIN students s ON s.id = hs.student_id
      WHERE ($1::int IS NULL OR hs.school_id = $1::int)
      ORDER BY hs.created_at DESC
      LIMIT 200
      `,
      schoolId
    );

  return NextResponse.json({
    submissions,
  });
}
