import { NextResponse } from "next/server";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import { getCurrentUser } from "@/lib/auth";
import { resolvePlatformContext } from "@/lib/api/context";
import { prisma } from "@/lib/prisma";
import {
  summarizeSchoolCompliance,
} from "@/lib/school-compliance";

const parseDate = (value: unknown) => {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime())
    ? null
    : date;
};

const invalidDateRange = (
  start: Date | null,
  end: Date | null
) =>
  Boolean(
    start && end && end.getTime() <= start.getTime()
  );

export async function GET(
  request: Request,
  context: any
) {
  try {

    const { id } =
      await context.params;
    const platformContext =
      await resolvePlatformContext(
        request
      );

    if (!platformContext) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const schoolId = Number(id);

    if (
      !platformContext.allSchools &&
      platformContext.schoolId &&
      platformContext.schoolId !==
        schoolId
    ) {
      return NextResponse.json(
        {
          error:
            "You can only view your selected school.",
        },
        {
          status: 403,
        }
      );
    }

    const school =
      await prisma.schools.findUnique({
        where: {
          id: schoolId,
        },
      });

    if (!school) {
      return NextResponse.json(
        { error: "School/College Not Found" },
        { status: 404 }
      );
    }

    const academicYearId =
      platformContext.academicYearId;

    const [
      counts,
      invoiceSummary,
      recentEvents,
    ] = await Promise.all([
      prisma.$queryRawUnsafe<any[]>(
        `
        SELECT
          (SELECT COUNT(*)::int FROM students s WHERE s.school_id = $1::int AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)) AS students,
          (SELECT COUNT(*)::int FROM teachers t WHERE t.school_id = $1::int AND ($2::int IS NULL OR t.academic_year_id = $2::int OR t.academic_year_id IS NULL)) AS teachers,
          (SELECT COUNT(*)::int FROM classes c WHERE c.school_id = $1::int AND ($2::int IS NULL OR c.academic_year_id = $2::int OR c.academic_year_id IS NULL)) AS classes,
          (SELECT COUNT(*)::int FROM sections sec WHERE sec.school_id = $1::int AND ($2::int IS NULL OR sec.academic_year_id = $2::int OR sec.academic_year_id IS NULL)) AS sections,
          (SELECT COUNT(*)::int FROM subjects sub WHERE sub.school_id = $1::int AND ($2::int IS NULL OR sub.academic_year_id = $2::int OR sub.academic_year_id IS NULL)) AS subjects,
          (SELECT COUNT(*)::int FROM attendance_master am WHERE am.school_id = $1::int AND ($2::int IS NULL OR am.academic_year_id = $2::int OR am.academic_year_id IS NULL)) AS attendance
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<any[]>(
        `
        SELECT
          COUNT(*)::int AS invoice_count,
          COALESCE(SUM(total_amount), 0)::numeric AS total_amount,
          COALESCE(SUM(paid_amount), 0)::numeric AS paid_amount,
          COALESCE(SUM(balance_amount), 0)::numeric AS balance_amount
        FROM invoices
        WHERE school_id = $1::int
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        `,
        schoolId,
        academicYearId
      ),
      prisma.event_ledger.findMany({
        where: {
          school_id: schoolId,
          ...(academicYearId
            ? {
                OR: [
                  {
                    academic_year_id:
                      academicYearId,
                  },
                  {
                    academic_year_id:
                      null,
                  },
                ],
              }
            : {}),
        },
        orderBy: {
          occurred_at: "desc",
        },
        take: 8,
      }),
    ]);
    const countRow =
      counts?.[0] || {};
    const studentCount =
      Number(
        countRow.students || 0
      );
    const teacherCount =
      Number(
        countRow.teachers || 0
      );
    const classCount =
      Number(
        countRow.classes || 0
      );
    const sectionCount =
      Number(
        countRow.sections || 0
      );
    const subjectCount =
      Number(
        countRow.subjects || 0
      );
    const attendanceCount =
      Number(
        countRow.attendance || 0
      );

    const campusHealth =
      Math.round(
        (
          (studentCount > 0 ? 20 : 0) +
          (teacherCount > 0 ? 20 : 0) +
          (classCount > 0 ? 20 : 0) +
          (subjectCount > 0 ? 20 : 0) +
          (attendanceCount > 0 ? 20 : 0)
        )
      );
    const finance =
      invoiceSummary?.[0] || {};
    const totalAmount = Number(
      finance.total_amount || 0
    );
    const paidAmount = Number(
      finance.paid_amount || 0
    );
    const collectionHealth =
      totalAmount > 0
        ? Math.round(
            (paidAmount /
              totalAmount) *
              100
          )
        : 0;

    return NextResponse.json({
      school,
      compliance: summarizeSchoolCompliance(
        school
      ),
      studentCount,
      teacherCount,
      classCount,
      sectionCount,
      subjectCount,
      attendanceCount,
      campusHealth,
      finance: {
        invoiceCount:
          Number(
            finance.invoice_count || 0
          ),
        totalAmount,
        paidAmount,
        balanceAmount: Number(
          finance.balance_amount || 0
        ),
        collectionHealth,
      },
      recentEvents,
      context: {
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        all_years:
          platformContext.allYears,
      },
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: any
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before updating a school."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "school",
        "update"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "school",
            "update"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const { id } =
      await context.params;
    const body =
      await request.json();
    const normalizeText = (
      value: unknown
    ) => {
      const output = String(
        value ?? ""
      ).trim();

      return output || null;
    };

    const recognitionStartDate = parseDate(
      body.recognition_start_date
    );
    const recognitionExpiryDate = parseDate(
      body.recognition_expiry_date
    );
    const affiliationStartDate = parseDate(
      body.affiliation_start_date
    );
    const affiliationExpiryDate = parseDate(
      body.affiliation_expiry_date
    );
    const promotionBacklogMode =
      String(
        body.promotion_backlog_mode ||
          (body.settings as any)?.backlog_promotion_mode ||
          "WARNING"
      )
        .trim()
        .toUpperCase() === "BLOCK"
        ? "BLOCK"
        : "WARNING";

    if (
      invalidDateRange(
        recognitionStartDate,
        recognitionExpiryDate
      )
    ) {
      return validationError(
        "Recognition expiry date must be greater than the start date."
      );
    }

    if (
      invalidDateRange(
        affiliationStartDate,
        affiliationExpiryDate
      )
    ) {
      return validationError(
        "Affiliation expiry date must be greater than the start date."
      );
    }

    const school =
      await prisma.schools.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          settings: true,
        },
      });

    const schoolUpdate =
      await prisma.schools.update({
        where: {
          id: Number(id),
        },
        data: {
          school_name:
            body.school_name,
          school_code: undefined,
          email: body.email,
          phone: body.phone,
          address: body.address,
          logo_url:
            normalizeText(
              body.logo_url
            ) ||
            normalizeText(
              body.school_logo
            ) ||
            undefined,
          school_logo:
            normalizeText(
              body.school_logo
            ) ||
            normalizeText(
              body.logo_url
            ) ||
            undefined,
          favicon_url:
            normalizeText(
              body.favicon_url
            ) ||
            normalizeText(
              body.school_favicon
            ) ||
            normalizeText(
              body.logo_url
            ) ||
            undefined,
          school_favicon:
            normalizeText(
              body.school_favicon
            ) ||
            normalizeText(
              body.favicon_url
            ) ||
            normalizeText(
              body.logo_url
            ) ||
            undefined,
          primary_color:
            normalizeText(
              body.primary_color
            ) || undefined,
          secondary_color:
            normalizeText(
              body.secondary_color
            ) || undefined,
          city:
            normalizeText(body.city) ||
            undefined,
          state:
            normalizeText(body.state) ||
            undefined,
          country:
            normalizeText(body.country) ||
            undefined,
          postal_code:
            normalizeText(
              body.postal_code
            ) || undefined,
          website:
            normalizeText(
              body.website
            ) || undefined,
          principal_name:
            body.principal_name,
          principal_contact:
            normalizeText(
              body.principal_contact
            ) || undefined,
          owner_name:
            normalizeText(
              body.owner_name
            ) || undefined,
          owner_contact:
            normalizeText(
              body.owner_contact
            ) || undefined,
          subscription_plan:
            normalizeText(
              body.subscription_plan
            ) || undefined,
          subscription_status:
            normalizeText(
              body.subscription_status
            ) || undefined,
          ai_branding_name:
            normalizeText(
              body.ai_branding_name
            ) || undefined,
          recognition_number:
            normalizeText(
              body.recognition_number
            ) || undefined,
          recognition_authority:
            normalizeText(
              body.recognition_authority
            ) || undefined,
          recognition_start_date:
            recognitionStartDate || undefined,
          recognition_expiry_date:
            recognitionExpiryDate || undefined,
          affiliation_number:
            normalizeText(
              body.affiliation_number
            ) || undefined,
          affiliation_authority:
            normalizeText(
              body.affiliation_authority
            ) || undefined,
          affiliation_start_date:
            affiliationStartDate || undefined,
          affiliation_expiry_date:
            affiliationExpiryDate || undefined,
          settings: {
            ...(school?.settings &&
            typeof school.settings === "object"
              ? (school.settings as Record<string, unknown>)
              : {}),
            ...(typeof body.settings === "object" &&
            body.settings
              ? (body.settings as Record<string, unknown>)
              : {}),
            backlog_promotion_mode:
              promotionBacklogMode,
          },
          is_active:
            typeof body.is_active ===
            "boolean"
              ? body.is_active
              : undefined,
          updated_by:
            user.id || null,
          updated_at: new Date(),
        },
      });

    return NextResponse.json(schoolUpdate);
  } catch (error) {
    return apiError(
      error,
      "Failed to update school"
    );
  }
}

export async function DELETE(
  _request: Request,
  context: any
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before deleting a school."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "school",
        "delete"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "school",
            "delete"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const { id } =
      await context.params;

    await prisma.schools.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to delete school"
    );
  }
}
