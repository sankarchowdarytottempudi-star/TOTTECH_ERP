import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import { requireSchoolModule } from "@/lib/module-governance";

export async function GET() {
  const moduleGuard = await requireSchoolModule("AI");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth = await requirePermission({
    module: "ai",
    action: "knowledge",
  });

  if (auth.response) {
    return auth.response;
  }

  const sources =
    await prisma.ai_knowledge_sources.findMany({
      where: {
        source_type: {
          in: [
            "DOCUMENT",
            "POLICY",
            "REPORT",
            "CIRCULAR",
          ],
        },
      },
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
    documents: sources,
    priority: [
      "ERP",
      "DOCUMENT",
      "OFFICIAL",
      "INTERNET",
    ],
  });
}
