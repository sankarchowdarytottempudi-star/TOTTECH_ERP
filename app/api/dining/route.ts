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
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

type Row = Record<string, unknown>;

const schoolScope = (
  user: any
) =>
  user?.role === "SUPER_ADMIN"
    ? Number(user.school_id) || null
    : Number(user?.school_id) || null;

export async function GET(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("DINING");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return validationError(
        "Login required to view dining."
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;

    const [
      diningAttendance,
      mealPlans,
      weeklyMenus,
    ] = await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          da.*,
          s.first_name,
          s.last_name,
          COALESCE(c.class_name, '') AS class_name,
          COALESCE(sec.section_name, '') AS section_name
        FROM dining_attendance da
        LEFT JOIN students s ON s.id = da.student_id
        LEFT JOIN classes c ON c.id = da.class_id
        LEFT JOIN sections sec ON sec.id = da.section_id
        WHERE ($1::int IS NULL OR da.school_id = $1::int)
          AND ($2::int IS NULL OR da.academic_year_id = $2::int OR da.academic_year_id IS NULL)
        ORDER BY da.attendance_date DESC, da.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM dining_meal_plans
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY created_at DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM dining_weekly_menus
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY week_start DESC, day_of_week ASC, meal_type ASC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
    ]);

    return NextResponse.json({
      diningAttendance,
      mealPlans,
      weeklyMenus,
      academicYear: {
        id: academicYearId,
        scope:
          context.academicYearScope,
      },
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load dining data"
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required to update dining."
      );
    }

    const body =
      await request.json();
    const kind = String(
      body.kind || "attendance"
    );

    const resource =
      kind === "meal_plan"
        ? "meal_plan"
        : kind === "weekly_menu"
          ? "dining_menu"
          : "dining_menu";

    if (
      !canManageRecord(
        user.role,
        resource,
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            resource,
            "create"
          ),
        },
        {
          status: 403,
        }
      );
    }
    const schoolId =
      user.role === "SUPER_ADMIN"
        ? Number(body.school_id) ||
          schoolScope(user)
        : schoolScope(user);
    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          academicYear?.id ??
          user.academic_year_id
      ) || null;

    if (!schoolId) {
      return validationError(
        "Select a school before updating dining."
      );
    }

    if (!academicYearId) {
      return validationError(
        "Select an academic year before updating dining."
      );
    }

    if (kind === "meal_plan") {
      if (!body.plan_name) {
        return validationError(
          "Meal plan name is required."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO dining_meal_plans (
            school_id,
            academic_year_id,
            plan_name,
            meal_type,
            price,
            status,
            metadata,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          body.plan_name,
          body.meal_type || "LUNCH",
          Number(body.price || 0),
          body.status || "ACTIVE",
          JSON.stringify(
            body.metadata || {}
          ),
          user.id || null
        );

      await recordEvent({
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "dining",
        event_type:
          "DINING_MEAL_PLAN_CREATED",
        action: "create",
        entity_type: "school",
        entity_id: schoolId,
        summary:
          "Dining meal plan created",
      });

      return NextResponse.json({
        mealPlan: rows[0],
      });
    }

    if (kind === "weekly_menu") {
      if (!body.week_start) {
        return validationError(
          "Week start date is required."
        );
      }

      const menuItems =
        typeof body.menu_items ===
        "string"
          ? body.menu_items
              .split(",")
              .map((item: string) =>
                item.trim()
              )
              .filter(Boolean)
          : body.menu_items || [];

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO dining_weekly_menus (
            school_id,
            academic_year_id,
            week_start,
            day_of_week,
            meal_type,
            menu_items,
            nutrition_notes,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          new Date(body.week_start),
          body.day_of_week || "MONDAY",
          body.meal_type || "LUNCH",
          JSON.stringify(menuItems),
          body.nutrition_notes || null,
          user.id || null
        );

      await recordEvent({
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "dining",
        event_type:
          "DINING_MENU_CREATED",
        action: "create",
        entity_type: "school",
        entity_id: schoolId,
        summary:
          "Dining menu created",
      });

      return NextResponse.json({
        weeklyMenu: rows[0],
      });
    }

    if (!body.student_id) {
      return validationError(
        "Select a student before recording dining attendance."
      );
    }

    const studentRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          s.id,
          s.school_id,
          COALESCE(s.current_class_id, sye.class_id) AS class_id,
          COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id
        FROM students s
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($3::int IS NULL OR sye.academic_year_id = $3::int)
        WHERE s.id = $1
          AND ($2::int IS NULL OR s.school_id = $2::int)
        ORDER BY sye.id DESC NULLS LAST
        LIMIT 1
        `,
        Number(body.student_id),
        schoolId,
        academicYearId
      );
    const student =
      studentRows[0];

    if (!student) {
      return validationError(
        "Selected student was not found in the selected school."
      );
    }

    const classId =
      Number(
        body.class_id ??
          student.class_id
      ) || null;
    const sectionId =
      Number(
        body.section_id ??
          student.section_id
      ) || null;

    const rows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        INSERT INTO dining_attendance (
          school_id,
          academic_year_id,
          class_id,
          section_id,
          student_id,
          meal_type,
          attendance_date,
          status,
          recorded_by,
          source,
          remarks,
          metadata,
          created_by,
          created_at,
          recorded_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'web',$10,$11::jsonb,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT ON CONSTRAINT uq_dining_student_meal_date
        DO UPDATE SET
          status = EXCLUDED.status,
          remarks = EXCLUDED.remarks,
          recorded_by = EXCLUDED.recorded_by,
          class_id = EXCLUDED.class_id,
          section_id = EXCLUDED.section_id,
          recorded_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        schoolId,
        academicYearId,
        classId,
        sectionId,
        Number(body.student_id),
        body.meal_type || "LUNCH",
        body.attendance_date
          ? new Date(
              body.attendance_date
            )
          : new Date(),
        body.status || "PRESENT",
        user.id || null,
        body.remarks || null,
        JSON.stringify(
          body.metadata || {}
        ),
        user.id || null
      );

    const record = rows[0];

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "dining",
      event_type:
        "DINING_ATTENDANCE_RECORDED",
      action: "record",
      entity_type: "student",
      entity_id: Number(body.student_id),
      summary:
        "Dining attendance recorded",
      payload: {
        meal_type: body.meal_type,
        status: body.status,
        class_id: classId,
        section_id: sectionId,
      },
    });

    return NextResponse.json({
      record,
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to save dining data"
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required to update dining."
      );
    }

    const body =
      await request.json();
    const kind = String(
      body.kind || ""
    ).toLowerCase();
    const id = Number(body.id);
    const resource =
      kind === "meal_plan"
        ? "meal_plan"
        : "dining_menu";

    if (
      !canManageRecord(
        user.role,
        resource,
        "update"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            resource,
            "update"
          ),
        },
        {
          status: 403,
        }
      );
    }

    if (!id) {
      return validationError(
        "A valid dining record id is required."
      );
    }

    const schoolId =
      schoolScope(user);

    if (kind === "meal_plan") {
      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          UPDATE dining_meal_plans
          SET plan_name = COALESCE($2, plan_name),
              meal_type = COALESCE($3, meal_type),
              price = COALESCE($4, price),
              status = COALESCE($5, status),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND ($6::int IS NULL OR school_id = $6::int)
          RETURNING *
          `,
          id,
          body.plan_name
            ? String(
                body.plan_name
              ).trim()
            : null,
          body.meal_type || null,
          body.price !== undefined &&
            body.price !== ""
            ? Number(body.price)
            : null,
          body.status || null,
          schoolId
        );

      if (!rows[0]) {
        return NextResponse.json(
          {
            error:
              "Meal plan not found.",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json({
        mealPlan: rows[0],
      });
    }

    const menuItems =
      typeof body.menu_items === "string"
        ? body.menu_items
            .split(",")
            .map((item: string) =>
              item.trim()
            )
            .filter(Boolean)
        : body.menu_items || null;

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        UPDATE dining_weekly_menus
        SET week_start = COALESCE($2, week_start),
            day_of_week = COALESCE($3, day_of_week),
            meal_type = COALESCE($4, meal_type),
            menu_items = COALESCE($5::jsonb, menu_items),
            nutrition_notes = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND ($7::int IS NULL OR school_id = $7::int)
        RETURNING *
        `,
        id,
        body.week_start
          ? new Date(body.week_start)
          : null,
        body.day_of_week || null,
        body.meal_type || null,
        menuItems
          ? JSON.stringify(menuItems)
          : null,
        body.nutrition_notes || null,
        schoolId
      );

    if (!rows[0]) {
      return NextResponse.json(
        {
          error:
            "Dining menu not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      menu: rows[0],
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to update dining record"
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required to delete dining."
      );
    }

    const url =
      new URL(request.url);
    const kind = String(
      url.searchParams?.get("kind") ||
        ""
    ).toLowerCase();
    const id = Number(
      url.searchParams?.get("id")
    );
    const resource =
      kind === "meal_plan"
        ? "meal_plan"
        : "dining_menu";

    if (
      !canManageRecord(
        user.role,
        resource,
        "delete"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            resource,
            "delete"
          ),
        },
        {
          status: 403,
        }
      );
    }

    if (!id) {
      return validationError(
        "A valid dining record id is required."
      );
    }

    const schoolId =
      schoolScope(user);

    if (kind === "meal_plan") {
      await prisma.$transaction(
        async (tx) => {
          await tx.$executeRawUnsafe(
            "DELETE FROM dining_meal_assignments WHERE meal_plan_id = $1",
            id
          );
          await tx.$executeRawUnsafe(
            "DELETE FROM dining_meal_plans WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",
            id,
            schoolId
          );
        }
      );
    } else {
      await prisma.$executeRawUnsafe(
        "DELETE FROM dining_weekly_menus WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",
        id,
        schoolId
      );
    }

    await recordEvent({
      school_id: schoolId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "dining",
      event_type:
        "DINING_RECORD_DELETED",
      action: "delete",
      entity_type: kind,
      entity_id: id,
      summary:
        "Dining record deleted",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to delete dining record"
    );
  }
}
