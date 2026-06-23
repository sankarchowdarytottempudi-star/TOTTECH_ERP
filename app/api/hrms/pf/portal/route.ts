import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const context = await resolvePlatformContext(
    request
  );

  if (!user || !context) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));

  await recordEvent({
    school_id: context.schoolId,
    academic_year_id: context.academicYearId,
    user_id: user.id,
    created_by: user.id,
    actor_role: user.role,
    module_name: "HRMS",
    event_type: "PF_PORTAL_OPENED",
    action: "open",
    entity_type: "hr_staff_master",
    summary: `PF portal opened: ${String(
      body.label || "Portal"
    )}`,
    payload: body,
  });

  return NextResponse.json({ ok: true });
}
