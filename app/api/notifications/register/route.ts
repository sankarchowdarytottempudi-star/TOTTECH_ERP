import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";

export async function POST(
  request: Request
) {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const deviceToken =
    String(body.device_token ?? "");

  if (!deviceToken) {
    return NextResponse.json(
      {
        error:
          "device_token is required",
      },
      {
        status: 400,
      }
    );
  }

  const registration =
    await prisma.notification_registrations.upsert({
      where: {
        device_token: deviceToken,
      },
      update: {
        is_active: true,
        platform:
          body.platform ?? null,
        metadata:
          body.metadata ?? {},
        updated_at: new Date(),
      },
      create: {
        school_id:
          auth.user?.school_id ?? null,
        user_id:
          auth.user?.id ?? null,
        device_token:
          deviceToken,
        platform:
          body.platform ?? null,
        metadata:
          body.metadata ?? {},
      },
    });

  return NextResponse.json({
    registration,
  });
}
