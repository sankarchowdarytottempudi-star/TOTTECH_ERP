import { NextResponse } from "next/server";

import {
  requirePermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";
import {
  approveActionRequest,
} from "@/lib/tottech-ai/actions";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const moduleGuard = await requireSchoolModule("AI");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth =
    await requirePermission({
      module: "ai",
      action: "approve_action",
    });

  if (auth.response) {
    return auth.response;
  }

  try {
    const { id } =
      await params;
    const body =
      await request.json();
    const decision = String(
      body.decision ??
        "APPROVE"
    ).toUpperCase();

    if (
      decision !== "APPROVE" &&
      decision !== "REJECT"
    ) {
      return NextResponse.json(
        {
          error:
            "Decision must be APPROVE or REJECT",
        },
        {
          status: 400,
        }
      );
    }

    const action =
      await approveActionRequest({
        user: auth.user!,
        id: Number(id),
        decision,
        comments:
          body.comments ?? null,
        metadata:
          body.metadata ?? {},
      });

    return NextResponse.json({
      action,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "AI action approval failed";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status:
          message.includes(
            "not found"
          )
            ? 404
            : 400,
      }
    );
  }
}
