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
    params: Promise<{
      entity: string;
      id: string;
    }>;
  }
) {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const { entity, id } =
    await params;
  const where =
    entity === "student"
      ? {
          student_id: Number(id),
        }
      : {
          id: Number(id),
        };

  const records =
    await prisma.dining_attendance.findMany({
      where,
      orderBy: {
        attendance_date: "desc",
      },
      take: 100,
    });

  return NextResponse.json({
    entity,
    id: Number(id),
    records,
  });
}
