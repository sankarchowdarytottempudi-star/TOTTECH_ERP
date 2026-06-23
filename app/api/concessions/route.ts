import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import {
  requirePermission,
} from "@/lib/governance/rbac";

export async function GET(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "concessions",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const context =
    await resolvePlatformContext(
      request
    );

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

  const schoolId =
    context.schoolId;
  const academicYearId =
    context.academicYearId;
  const concessions =
    await prisma.$queryRawUnsafe(
      `
      SELECT
        cr.*,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name,
        i.invoice_number
      FROM concession_requests cr
      LEFT JOIN students s ON s.id = cr.student_id
      LEFT JOIN invoices i ON i.id = cr.invoice_id
      LEFT JOIN classes c ON c.id = COALESCE(i.class_id, s.current_class_id)
      LEFT JOIN sections sec ON sec.id = COALESCE(i.section_id, s.current_section_id, s.section_id)
      WHERE ($1::int IS NULL OR cr.school_id = $1::int)
        AND ($2::int IS NULL OR cr.academic_year_id = $2::int OR cr.academic_year_id IS NULL)
      ORDER BY cr.requested_at DESC
      LIMIT 200
      `,
      schoolId,
      academicYearId
    );

  return NextResponse.json({
    concessions,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "concessions",
      action: "create",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const schoolId =
    auth.user?.school_id ?? null;
  const academicYear =
    await getSelectedAcademicYear(
      schoolId
    );
  const academicYearId =
    Number(
      body.academic_year_id ??
        (auth.user as any)
          ?.academic_year_id ??
        academicYear?.id
    ) || null;

  const concession =
    await prisma.concession_requests.create({
      data: {
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        student_id:
          body.student_id
            ? Number(body.student_id)
            : null,
        invoice_id:
          body.invoice_id
            ? Number(body.invoice_id)
            : null,
        fee_category_id:
          body.fee_category_id
            ? Number(
                body.fee_category_id
              )
            : null,
        academic_year:
          body.academic_year ?? null,
        requested_amount:
          body.requested_amount ?? null,
        reason: body.reason ?? null,
        status: "PENDING",
        requested_by:
          auth.user?.id ?? null,
        created_by:
          auth.user?.id ?? null,
        metadata: body.metadata ?? {},
      },
    });

  await prisma.concession_audit_logs.create({
    data: {
      concession_request_id:
        concession.id,
      school_id:
        concession.school_id,
      actor_user_id:
        auth.user?.id ?? null,
      action: "CREATE",
      new_status:
        concession.status,
      comments:
        body.reason ?? null,
    },
  });

  await recordEvent({
    school_id:
      concession.school_id,
    academic_year_id:
      academicYearId,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "concessions",
    event_type:
      "CONCESSION_CREATED",
    action: "create",
    entity_type: "student",
    entity_id:
      concession.student_id,
    summary:
      "Concession request created",
    payload: {
      concession_id:
        concession.id,
      requested_amount:
        concession.requested_amount,
    },
  });

  return NextResponse.json({
    concession,
  });
}
