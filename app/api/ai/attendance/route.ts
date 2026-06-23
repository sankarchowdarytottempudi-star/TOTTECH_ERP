import { NextResponse } from "next/server";

import {
  requireCurrentUser,
} from "@/lib/governance/rbac";
import {
  completeWithTottechAI,
} from "@/lib/tottech-ai/gateway";

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
  const result =
    await completeWithTottechAI({
      user: auth.user!,
      prompt:
        String(
          body.prompt ??
            body.question ??
            "Summarize attendance risk."
        ),
      module_name: "attendance",
      school_id:
        auth.user?.school_id ?? null,
      metadata: body,
    });

  return NextResponse.json(result);
}
