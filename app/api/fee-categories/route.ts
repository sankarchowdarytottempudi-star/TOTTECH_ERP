import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request
) {
  try {
    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json([]);
    }

    const categories =
      await prisma.fee_categories.findMany({
        where: {
          ...(context.schoolId
            ? {
                OR: [
                  {
                    school_id:
                      context.schoolId,
                  },
                  {
                    school_id: null,
                  },
                ],
              }
            : {}),
          ...(context.academicYearId
            ? {
                AND: [
                  {
                    OR: [
                      {
                        academic_year_id:
                          context.academicYearId,
                      },
                      {
                        academic_year_id:
                          null,
                      },
                    ],
                  },
                ],
              }
            : {}),
        },
        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(
      categories
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load fee categories"
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before creating a fee category."
      );
    }

    if (!body.fee_name) {
      return validationError(
        "Fee name is required."
      );
    }

    const schoolId =
      Number(
        body.school_id ??
          user.school_id
      ) || null;
    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          user.academic_year_id ??
          academicYear?.id
      ) || null;

    const category =
      await prisma.fee_categories.create({
        data: {
          school_id: schoolId,
          academic_year_id:
            academicYearId,
          class_id: body.class_id
            ? Number(body.class_id)
            : null,
          section_id: body.section_id
            ? Number(body.section_id)
            : null,
          fee_name: body.fee_name,
          fee_code:
            body.fee_code || null,
          amount: Number(
            body.amount || 0
          ),
          frequency:
            body.frequency || null,
          billing_cycle:
            body.billing_cycle ||
            body.frequency ||
            null,
          description:
            body.description || null,
          metadata:
            body.metadata || {},
          is_active: true,
          created_by:
            user.id || null,
        },
      });

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "finance",
      event_type:
        "FEE_CATEGORY_CREATED",
      action: "create",
      entity_type: "school",
      entity_id: schoolId,
      summary: "Fee category created",
      payload: {
        fee_category_id:
          category.id,
        fee_name:
          category.fee_name,
        amount:
          category.amount,
      },
    });

    return NextResponse.json(
      category,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to create fee category"
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const body =
      await request.json();

    const category =
      await prisma.fee_categories.update({
        where: {
          id: Number(body.id),
        },
        data: {
          fee_name: body.fee_name,
          fee_code:
            body.fee_code || null,
          amount: Number(
            body.amount || 0
          ),
          frequency:
            body.frequency || null,
          description:
            body.description || null,
        },
      });

    return NextResponse.json(
      category
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to update fee category"
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);
    const id =
      searchParams?.get("id");

    if (!id) {
      return validationError(
        "Fee category id is required."
      );
    }

    await prisma.fee_categories.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to delete fee category"
    );
  }
}
