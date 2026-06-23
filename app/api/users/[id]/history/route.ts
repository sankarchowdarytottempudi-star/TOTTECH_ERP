import { NextRequest, NextResponse } from "next/server";

import {
  requireSchoolModule,
} from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const moduleGuard =
      await requireSchoolModule(
        "USER_MANAGEMENT"
      );

    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const resolvedParams =
      await params;
    const userId = Number(
      resolvedParams.id
    );

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "A valid user id is required.",
        },
        {
          status: 400,
        }
      );
    }

    const [loginHistory, auditHistory] =
      await Promise.all([
        prisma.user_login_history.findMany({
          where: {
            user_id: userId,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 50,
        }),
        prisma.audit_logs.findMany({
          where: {
            action_details: {
              contains: `"target_user_id":${userId}`,
            },
          },
          orderBy: {
            created_at: "desc",
          },
          take: 50,
        }),
      ]);

    return NextResponse.json({
      loginHistory,
      auditHistory,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load user history",
      },
      {
        status: 500,
      }
    );
  }
}
