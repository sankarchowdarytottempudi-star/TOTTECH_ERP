import { NextResponse } from "next/server";

import {
  requirePermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";
import {
  createActionRequest,
  listActionRequests,
  listSupportedAIActions,
} from "@/lib/tottech-ai/actions";

export async function GET(
  request: Request
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

  const url =
    new URL(request.url);
  const status =
    url.searchParams?.get(
      "status"
    );
  const actions =
    await listActionRequests(
      auth.user!,
      status
    );

  return NextResponse.json({
    supportedActions:
      listSupportedAIActions(),
    actions,
  });
}

export async function POST(
  request: Request
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

  try {
    const body =
      await request.json();
    const action =
      await createActionRequest({
        user: auth.user!,
        action_type: String(
          body.action_type ??
            body.action ??
            ""
        ),
        payload:
          body.payload ??
          body.data ??
          {},
        prompt:
          body.prompt ?? null,
        school_id:
          body.school_id ??
          auth.user?.school_id ??
          null,
      });

    return NextResponse.json(
      {
        action,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "AI action request failed";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status:
          message.includes(
            "Unsupported"
          )
            ? 400
            : 500,
      }
    );
  }
}
