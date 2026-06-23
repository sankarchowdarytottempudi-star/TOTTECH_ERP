import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const [reports, events] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT report_key, report_name, report_category, data_source, output_formats
        FROM clinical_security_reports
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
        ORDER BY report_category, report_name
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT event_key, event_type, severity, summary, created_at
        FROM clinical_security_events
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
        ORDER BY created_at DESC
        LIMIT 100
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    context,
    reports,
    events,
  });
}
