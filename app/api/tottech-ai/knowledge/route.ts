import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";
import { resolvePlatformContext } from "@/lib/api/context";
import {
  answerEduGPTQuestion,
} from "@/lib/tottech-ai/edu-intelligence";

export async function GET() {
  const moduleGuard = await requireSchoolModule("AI");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth =
    await requirePermission({
      module: "ai",
      action: "knowledge",
    });

  if (auth.response) {
    return auth.response;
  }

  const sources =
    await prisma.ai_knowledge_sources.findMany({
      orderBy: [
        {
          priority: "asc",
        },
        {
          source_key: "asc",
        },
      ],
    });

  return NextResponse.json({
    priority: [
      "ERP",
      "DOCUMENT",
      "OFFICIAL",
      "INTERNET",
    ],
    sources,
    internetSearchEnabled:
      process.env
        .TOTTECH_AI_ENABLE_WEB_SEARCH ===
      "true",
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
      action: "knowledge",
    });

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
      await answerEduGPTQuestion({
        user: auth.user!,
        prompt: String(
          body.prompt ??
            body.question ??
            ""
        ),
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

    return NextResponse.json(
      result
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Knowledge query failed";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
