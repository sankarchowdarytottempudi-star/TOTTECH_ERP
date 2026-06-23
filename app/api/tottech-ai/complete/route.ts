import { NextResponse } from "next/server";

import {
  completeWithTottechAI,
} from "@/lib/tottech-ai/gateway";
import { resolvePlatformContext } from "@/lib/api/context";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";

export async function POST(
  request: Request
) {
  const moduleGuard = await requireSchoolModule("AI");
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

    const result =
      await completeWithTottechAI({
        user: auth.user!,
        prompt:
          String(
            body.prompt ??
              body.question ??
              ""
          ),
        module_name:
          String(
            body.module_name ??
              body.module ??
              "schoolgpt"
          ),
        school_id:
          body.school_id ??
          context?.schoolId ??
          null,
        metadata:
          {
            ...(body.metadata ?? {}),
            academic_year_id:
              context?.academicYearId ??
              null,
            all_years:
              context?.allYears ??
              false,
          },
      });

    return NextResponse.json(
      result
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "TOTTECH AI request failed";

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
