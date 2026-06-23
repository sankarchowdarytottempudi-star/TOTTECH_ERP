import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import {
  buildPublicFinanceReportUrl,
} from "@/lib/finance/report-links";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

export async function POST(request: Request) {
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

  const body = await request.json().catch(
    () => ({})
  );
  const params = new URLSearchParams();
  params?.set(
    "type",
    String(body.type || "monthly")
  );
  params?.set("format", "pdf");

  for (const key of [
    "school_id",
    "academic_year_id",
    "class_id",
    "section_id",
    "from",
    "to",
  ]) {
    if (body[key]) {
      params?.set(key, String(body[key]));
    }
  }

  if (
    context.schoolId &&
    !params?.get("school_id")
  ) {
    params?.set(
      "school_id",
      String(context.schoolId)
    );
  }
  if (
    context.academicYearId &&
    !params?.get("academic_year_id")
  ) {
    params?.set(
      "academic_year_id",
      String(context.academicYearId)
    );
  }

  const publicUrl =
    buildPublicFinanceReportUrl(params);

  return NextResponse.json({
    success: true,
    public_pdf_url: publicUrl,
    whatsapp_ready: true,
    message:
      "Use this public signed PDF link in the WhatsApp template. It does not require login.",
  });
}
