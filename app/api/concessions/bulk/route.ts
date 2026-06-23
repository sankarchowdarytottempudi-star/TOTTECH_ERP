import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "concessions",
      action: "approve",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const ids =
    Array.isArray(body.ids)
      ? body.ids.map(Number)
      : [];
  const status =
    String(
      body.status ?? "APPROVED"
    ).toUpperCase();

  const result =
    await prisma.concession_requests.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status,
        reviewed_by:
          auth.user?.id ?? null,
        reviewed_at: new Date(),
      },
    });

  return NextResponse.json({
    updated: result.count,
    status,
  });
}
