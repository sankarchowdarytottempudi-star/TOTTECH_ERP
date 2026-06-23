import { NextResponse } from "next/server";

import {
  getFinanceReport,
  normalizeReportType,
} from "@/lib/finance/command-center";
import {
  verifyFinanceReportToken,
} from "@/lib/finance/report-links";
import {
  renderFinanceReportPdf,
} from "@/lib/finance/report-export";

export async function GET(request: Request) {
  const url = new URL(request.url);

  if (
    !verifyFinanceReportToken(
      url.searchParams
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid or expired finance report link.",
      },
      {
        status: 403,
      }
    );
  }

  const schoolId = Number(
    url.searchParams?.get("school_id") || 0
  ) || null;
  const academicYearId = Number(
    url.searchParams?.get("academic_year_id") ||
      0
  ) || null;

  const report = await getFinanceReport(
    normalizeReportType(
      url.searchParams?.get("type")
    ),
    {
      user: {},
      schoolId,
      academicYearId,
      allSchools: !schoolId,
      allYears: !academicYearId,
      schoolScope: schoolId
        ? "selected"
        : "all",
      academicYearScope:
        academicYearId
          ? "selected"
          : "all",
    },
    {
      schoolId,
      academicYearId,
      classId:
        Number(
          url.searchParams?.get("class_id") ||
            0
        ) || null,
      sectionId:
        Number(
          url.searchParams?.get("section_id") ||
            0
        ) || null,
      from: url.searchParams?.get("from"),
      to: url.searchParams?.get("to"),
      allSchools: !schoolId,
      allYears: !academicYearId,
    }
  );

  const theme = url.searchParams?.get("theme") === "mono" ? "mono" : "color";
  const pdf =
    await renderFinanceReportPdf(report, theme);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=\"${report.type}-finance-report.pdf\"`,
    },
  });
}
