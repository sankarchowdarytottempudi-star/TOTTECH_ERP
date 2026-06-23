import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth =
    await requirePermission({
      module: "imports",
      action: "manage",
    });

  if (auth.response) {
    return auth.response;
  }

  const jobs =
    await prisma.import_jobs.findMany({
      where:
        await scopedSchoolWhere(
          auth.user
        ),
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    });

  return NextResponse.json({
    jobs,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "imports",
      action: "manage",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const job =
    await prisma.import_jobs.create({
      data: {
        school_id:
          auth.user?.school_id ?? null,
        module_name:
          body.module_name ?? "students",
        status:
          body.status ?? "PENDING",
        file_name:
          body.file_name ?? null,
        total_rows:
          Number(body.total_rows ?? 0),
        metadata:
          body.metadata ?? {},
        created_by:
          auth.user?.id ?? null,
      },
    });

  return NextResponse.json({
    job,
  });
}
