import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth =
    await requirePermission({
      module: "platform",
      action: "manage",
    });

  if (auth.response) {
    return auth.response;
  }

  const items =
    await prisma.customer_onboarding.findMany({
      where:
        await scopedSchoolWhere(
          auth.user
        ),
      orderBy: {
        updated_at: "desc",
      },
      take: 100,
    });

  return NextResponse.json({
    onboarding: items,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "platform",
      action: "manage",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const item =
    await prisma.customer_onboarding.create({
      data: {
        school_id:
          body.school_id ??
          auth.user?.school_id ??
          null,
        onboarding_key:
          body.onboarding_key ??
          `onboarding-${Date.now()}`,
        stage:
          body.stage ?? "start",
        status:
          body.status ?? "OPEN",
        assigned_to:
          body.assigned_to ?? null,
        checklist:
          body.checklist ?? {},
        metadata:
          body.metadata ?? {},
      },
    });

  return NextResponse.json({
    item,
  });
}
