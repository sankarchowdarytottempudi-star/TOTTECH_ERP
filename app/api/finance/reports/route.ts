import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import {
  filtersFromRequest,
  getFinanceReport,
  normalizeReportType,
} from "@/lib/finance/command-center";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

export async function GET(request: Request) {
  const moduleGuard =
    await requireSchoolModule("FINANCE");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const context =
    await resolvePlatformContext(request);

  if (!context) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const url = new URL(request.url);
  const report = await getFinanceReport(
    normalizeReportType(
      url.searchParams?.get("type")
    ),
    context,
    filtersFromRequest(request, context)
  );

  return NextResponse.json(report);
}
