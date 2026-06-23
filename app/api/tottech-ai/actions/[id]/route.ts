import { NextResponse } from "next/server";

import {
  requirePermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";
import {
  getActionRequest,
} from "@/lib/tottech-ai/actions";

export async function GET(
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
      action: "action_request",
    });

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const action =
    await getActionRequest(
      auth.user!,
      Number(id)
    );

  if (!action) {
    return NextResponse.json(
      {
        error:
          "AI action request not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    action,
  });
}
