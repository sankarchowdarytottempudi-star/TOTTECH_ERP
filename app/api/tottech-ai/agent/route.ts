import { NextResponse } from "next/server";

import { planTottechAIRequest } from "@/lib/tottech-ai/planner";
import { answerEduGPTQuestion } from "@/lib/tottech-ai/edu-intelligence";
import { createActionRequest } from "@/lib/tottech-ai/actions";
import { resolvePlatformContext } from "@/lib/api/context";
import {
  requireCurrentUser,
  userHasPermission,
} from "@/lib/governance/rbac";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

export async function POST(
  request: Request
) {
  const moduleGuard =
    await requireSchoolModule("AI");

  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  try {
    const body =
      await request.json();
    const context =
      await resolvePlatformContext(
        request
      );
    const prompt = String(
      body.prompt ??
        body.question ??
        ""
    ).trim();

    if (!prompt) {
      return NextResponse.json(
        {
          error:
            "Ask TOTTECH AI a question or request a school operation.",
        },
        {
          status: 400,
        }
      );
    }

    const plan =
      planTottechAIRequest(prompt);

    if (plan.mode === "action") {
      const allowed =
        await userHasPermission(
          auth.user,
          {
            module: "ai",
            action: "action_request",
          }
        );

      if (!allowed) {
        return NextResponse.json(
          {
            error:
              "AI action requests are not enabled for this role.",
          },
          {
            status: 403,
          }
        );
      }

      const action =
        await createActionRequest({
          user: auth.user!,
          action_type:
            plan.action_type,
          payload: {
            ...plan.payload,
            ...(body.payload ?? {}),
          },
          prompt,
          school_id:
            body.school_id ??
            context?.schoolId ??
            null,
        });

      return NextResponse.json({
        mode: "action",
        planner: plan,
        action,
        answer:
          action.status ===
          "PENDING_APPROVAL"
            ? "I prepared a safe action preview. Review it, approve it, then execute it to write to the database."
            : "I prepared a preview but need missing information before approval.",
      });
    }

    const allowed =
      await userHasPermission(
        auth.user,
        {
          module: "ai",
          action: "knowledge",
        }
      );

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "AI knowledge queries are not enabled for this role.",
        },
        {
          status: 403,
        }
      );
    }

    const result =
      await answerEduGPTQuestion({
        user: auth.user!,
        prompt,
        school_id:
          body.school_id ??
          context?.schoolId ??
          null,
        academic_year_id:
          body.academic_year_id ??
          context?.academicYearId ??
          null,
        include_internet:
          body.include_internet ===
          false
            ? false
            : true,
      });

    return NextResponse.json({
      mode: "knowledge",
      planner: plan,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "TOTTECH AI agent failed";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status:
          message.includes("access")
            ? 403
            : 500,
      }
    );
  }
}
