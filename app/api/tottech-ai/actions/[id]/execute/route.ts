import { NextResponse } from "next/server";

import {
  requirePermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";
import {
  executeApprovedActionRequest,
} from "@/lib/tottech-ai/actions";

export async function POST(
  _request: Request,
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
      action: "execute_action",
    });

  if (auth.response) {
    return auth.response;
  }

  try {
    const { id } =
      await params;
    const result =
      await executeApprovedActionRequest({
        user: auth.user!,
        id: Number(id),
      });

    return NextResponse.json(
      result
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "AI action execution failed";

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
