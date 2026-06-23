import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import {
  filtersFromRequest,
  getFinanceReport,
  normalizeReportType,
} from "@/lib/finance/command-center";
import {
  renderFinanceReportPdf,
  renderFinanceReportXlsx,
} from "@/lib/finance/report-export";
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
  const format =
    url.searchParams?.get("format") === "xlsx"
      ? "xlsx"
      : "pdf";
  const theme =
    url.searchParams?.get("theme") === "mono"
      ? "mono"
      : "color";
  const report = await getFinanceReport(
    normalizeReportType(
      url.searchParams?.get("type")
    ),
    context,
    filtersFromRequest(request, context)
  );

  if (format === "xlsx") {
    const workbook =
      renderFinanceReportXlsx(report);
    return new NextResponse(
      new Uint8Array(workbook),
      {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=\"${report.type}-finance-report.xlsx\"`,
      },
      }
    );
  }

  const pdf =
    await renderFinanceReportPdf(report, theme);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"${report.type}-finance-report.pdf\"`,
    },
  });
}
