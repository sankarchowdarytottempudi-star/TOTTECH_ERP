import { NextResponse } from "next/server";

import {
  requireCurrentUser,
} from "@/lib/governance/rbac";
import {
  completeWithTottechAI,
} from "@/lib/tottech-ai/gateway";

export async function POST(
  req: Request
) {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  try {
    const body =
      await req.json();

    const result =
      await completeWithTottechAI({
        user: auth.user!,
        prompt:
          String(
            body.question ??
              body.prompt ??
              ""
          ),
        module_name: "schoolgpt",
        school_id:
          auth.user?.school_id ?? null,
        metadata: body,
      });

    return NextResponse.json({
      answer: result.answer,
      requestId:
        result.requestId,
      provider:
        result.provider,
      model: result.model,
      fallbackUsed:
        result.fallbackUsed,
      grounding:
        result.grounding,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "AI Copilot Failed",
      },
      {
        status: 500,
      }
    );
  }
}
