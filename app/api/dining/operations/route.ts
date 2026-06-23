import { NextResponse } from "next/server";

import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const scopedSchoolId = (
  user: any,
  body?: any
) =>
  Number(body?.school_id) ||
  Number(user?.school_id) ||
  null;

const asDate = (value: unknown) =>
  value ? new Date(String(value)) : new Date();

async function context(
  body?: any
) {
  const user =
    await getCurrentUser();

  if (!user) {
    return {
      user: null,
      schoolId: null,
      academicYear: null,
      academicYearId: null,
      response: validationError(
        "Login required to manage dining operations."
      ),
    };
  }

  const schoolId =
    scopedSchoolId(user, body);

  if (!schoolId) {
    return {
      user,
      schoolId: null,
      academicYear: null,
      academicYearId: null,
      response: validationError(
        "Select a school before managing dining operations."
      ),
    };
  }

  const academicYear =
    await getSelectedAcademicYear(
      schoolId
    );
  const academicYearId =
    Number(
      body?.academic_year_id ??
        user.academic_year_id ??
        academicYear?.id
    ) || null;

  return {
    user,
    schoolId,
    academicYear,
    academicYearId,
    response: null,
  };
}

export async function GET(
  request: Request
) {
  try {
    const auth =
      await resolvePlatformContext(
        request
      );

    if (!auth) {
      return validationError(
        "Login required to manage dining operations."
      );
    }

    const schoolId = auth.schoolId;
    const academicYearId =
      auth.academicYearId;

    const [
      inventoryItems,
      purchases,
      consumptionLogs,
      productionSheets,
      wastageLogs,
      mealAssignments,
      analyticsRows,
    ] = await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM dining_inventory_items
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY item_name ASC
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT p.*, i.item_name, i.unit
        FROM dining_purchases p
        LEFT JOIN dining_inventory_items i ON i.id = p.item_id
        WHERE ($1::int IS NULL OR p.school_id = $1::int)
          AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
        ORDER BY p.purchase_date DESC, p.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT c.*, i.item_name, i.unit
        FROM dining_consumption_logs c
        LEFT JOIN dining_inventory_items i ON i.id = c.item_id
        WHERE ($1::int IS NULL OR c.school_id = $1::int)
          AND ($2::int IS NULL OR c.academic_year_id = $2::int OR c.academic_year_id IS NULL)
        ORDER BY c.consumption_date DESC, c.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM dining_production_sheets
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY production_date DESC, id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT w.*, ps.meal_type, ps.production_date
        FROM dining_wastage_logs w
        LEFT JOIN dining_production_sheets ps ON ps.id = w.production_sheet_id
        WHERE ($1::int IS NULL OR w.school_id = $1::int)
          AND ($2::int IS NULL OR w.academic_year_id = $2::int OR w.academic_year_id IS NULL)
        ORDER BY w.wastage_date DESC, w.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          a.*,
          mp.plan_name,
          mp.meal_type,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
          t.first_name AS teacher_first_name,
          t.last_name AS teacher_last_name
        FROM dining_meal_assignments a
        LEFT JOIN dining_meal_plans mp ON mp.id = a.meal_plan_id
        LEFT JOIN students s ON s.id = a.student_id
        LEFT JOIN teachers t ON t.id = a.teacher_id
        WHERE ($1::int IS NULL OR a.school_id = $1::int)
          AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
        ORDER BY a.created_at DESC, a.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          COALESCE(SUM(ps.served_count), 0)::int AS served_count,
          COALESCE(SUM(ps.cost_amount), 0)::numeric AS production_cost,
          COALESCE(SUM(w.cost_amount), 0)::numeric AS wastage_cost,
          COALESCE(SUM(p.total_cost), 0)::numeric AS purchase_cost,
          COALESCE(COUNT(DISTINCT da.id), 0)::int AS attendance_count,
          COALESCE(COUNT(DISTINCT a.id), 0)::int AS assignment_count
        FROM (SELECT $1::int AS school_id, $2::int AS academic_year_id) ctx
        LEFT JOIN dining_production_sheets ps
          ON (ctx.school_id IS NULL OR ps.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR ps.academic_year_id = ctx.academic_year_id OR ps.academic_year_id IS NULL)
        LEFT JOIN dining_wastage_logs w
          ON (ctx.school_id IS NULL OR w.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR w.academic_year_id = ctx.academic_year_id OR w.academic_year_id IS NULL)
        LEFT JOIN dining_purchases p
          ON (ctx.school_id IS NULL OR p.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR p.academic_year_id = ctx.academic_year_id OR p.academic_year_id IS NULL)
        LEFT JOIN dining_attendance da
          ON (ctx.school_id IS NULL OR da.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR da.academic_year_id = ctx.academic_year_id OR da.academic_year_id IS NULL)
        LEFT JOIN dining_meal_assignments a
          ON (ctx.school_id IS NULL OR a.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR a.academic_year_id = ctx.academic_year_id OR a.academic_year_id IS NULL)
        `,
        schoolId,
        academicYearId
      ),
    ]);

    return NextResponse.json({
      academicYear:
        {
          id: academicYearId,
          scope:
            auth.academicYearScope,
        },
      inventoryItems,
      purchases,
      consumptionLogs,
      productionSheets,
      wastageLogs,
      mealAssignments,
      analytics:
        analyticsRows[0] || {},
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to load dining operations."
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();
    const auth =
      await context(body);

    if (auth.response) {
      return auth.response;
    }

    const user = auth.user!;
    const schoolId = auth.schoolId!;
    const academicYearId =
      auth.academicYearId;
    const kind = String(
      body.kind || ""
    ).toLowerCase();

    if (kind === "inventory_item") {
      if (!body.item_name) {
        return validationError(
          "Inventory item name is required."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO dining_inventory_items (
            school_id,
            academic_year_id,
            item_name,
            unit,
            current_quantity,
            reorder_level,
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
          String(body.item_name).trim(),
          body.unit || "kg",
          Number(body.current_quantity || 0),
          Number(body.reorder_level || 0),
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
          "DINING_INVENTORY_ITEM_CREATED",
        action: "create",
        entity_type: "school",
        entity_id: schoolId,
        summary:
          "Dining inventory item created",
        payload: rows[0],
      });

      return NextResponse.json({
        inventoryItem: rows[0],
      });
    }

    if (kind === "purchase") {
      const itemId =
        Number(body.item_id) || null;
      const quantity = Number(
        body.quantity || 0
      );
      const unitCost = Number(
        body.unit_cost || 0
      );

      if (!itemId || quantity <= 0) {
        return validationError(
          "Inventory item and positive purchase quantity are required."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO dining_purchases (
            school_id,
            academic_year_id,
            item_id,
            purchase_date,
            quantity,
            unit_cost,
            total_cost,
            vendor_name,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          itemId,
          asDate(body.purchase_date),
          quantity,
          unitCost,
          Number(
            body.total_cost ??
              quantity * unitCost
          ),
          body.vendor_name || null,
          user.id || null
        );

      await prisma.$executeRawUnsafe(
        `
        UPDATE dining_inventory_items
        SET current_quantity = COALESCE(current_quantity, 0) + $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND school_id = $3
        `,
        quantity,
        itemId,
        schoolId
      );

      await recordEvent({
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "dining",
        event_type:
          "DINING_PURCHASE_RECORDED",
        action: "create",
        entity_type: "school",
        entity_id: schoolId,
        summary:
          "Dining purchase recorded",
        payload: rows[0],
      });

      return NextResponse.json({
        purchase: rows[0],
      });
    }

    if (kind === "consumption") {
      const itemId =
        Number(body.item_id) || null;
      const quantity = Number(
        body.quantity || 0
      );

      if (!itemId || quantity <= 0) {
        return validationError(
          "Inventory item and positive consumption quantity are required."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO dining_consumption_logs (
            school_id,
            academic_year_id,
            item_id,
            consumption_date,
            quantity,
            meal_type,
            recorded_by,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          itemId,
          asDate(
            body.consumption_date
          ),
          quantity,
          body.meal_type || "LUNCH",
          user.id || null,
          JSON.stringify(
            body.metadata || {}
          ),
          user.id || null
        );

      await prisma.$executeRawUnsafe(
        `
        UPDATE dining_inventory_items
        SET current_quantity = GREATEST(COALESCE(current_quantity, 0) - $1, 0),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND school_id = $3
        `,
        quantity,
        itemId,
        schoolId
      );

      await recordEvent({
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "dining",
        event_type:
          "DINING_CONSUMPTION_RECORDED",
        action: "record",
        entity_type: "school",
        entity_id: schoolId,
        summary:
          "Dining consumption recorded",
        payload: rows[0],
      });

      return NextResponse.json({
        consumption: rows[0],
      });
    }

    if (kind === "production") {
      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO dining_production_sheets (
            school_id,
            academic_year_id,
            production_date,
            meal_type,
            expected_count,
            produced_count,
            served_count,
            cost_amount,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          asDate(
            body.production_date
          ),
          body.meal_type || "LUNCH",
          Number(
            body.expected_count || 0
          ),
          Number(
            body.produced_count || 0
          ),
          Number(
            body.served_count || 0
          ),
          Number(
            body.cost_amount || 0
          ),
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
          "DINING_PRODUCTION_RECORDED",
        action: "record",
        entity_type: "school",
        entity_id: schoolId,
        summary:
          "Dining production sheet recorded",
        payload: rows[0],
      });

      return NextResponse.json({
        productionSheet: rows[0],
      });
    }

    if (kind === "wastage") {
      const quantity = Number(
        body.quantity || 0
      );

      if (quantity <= 0) {
        return validationError(
          "Positive wastage quantity is required."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO dining_wastage_logs (
            school_id,
            academic_year_id,
            production_sheet_id,
            wastage_date,
            quantity,
            cost_amount,
            reason,
            recorded_by,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          body.production_sheet_id
            ? Number(
                body.production_sheet_id
              )
            : null,
          asDate(body.wastage_date),
          quantity,
          Number(
            body.cost_amount || 0
          ),
          body.reason || null,
          user.id || null,
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
          "DINING_WASTAGE_RECORDED",
        action: "record",
        entity_type: "school",
        entity_id: schoolId,
        summary:
          "Dining wastage recorded",
        payload: rows[0],
      });

      return NextResponse.json({
        wastage: rows[0],
      });
    }

    if (
      kind === "meal_assignment" ||
      kind === "special_diet"
    ) {
      const studentId =
        Number(body.student_id) || null;
      const teacherId =
        Number(body.teacher_id) || null;

      if (!studentId && !teacherId) {
        return validationError(
          "Select a student or teacher before assigning a meal plan."
        );
      }

      const metadata = {
        ...(body.metadata || {}),
        special_diet:
          kind === "special_diet"
            ? true
            : Boolean(
                body.special_diet
              ),
        diet_notes:
          body.diet_notes || null,
        medical_notes:
          body.medical_notes || null,
      };

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO dining_meal_assignments (
            school_id,
            academic_year_id,
            meal_plan_id,
            student_id,
            teacher_id,
            staff_id,
            start_date,
            end_date,
            status,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          body.meal_plan_id
            ? Number(
                body.meal_plan_id
              )
            : null,
          studentId,
          teacherId,
          body.staff_id
            ? Number(body.staff_id)
            : null,
          asDate(body.start_date),
          body.end_date
            ? new Date(body.end_date)
            : null,
          body.status ||
            (kind === "special_diet"
              ? "SPECIAL_DIET"
              : "ACTIVE"),
          JSON.stringify(metadata),
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
          kind === "special_diet"
            ? "DINING_SPECIAL_DIET_RECORDED"
            : "DINING_MEAL_ASSIGNED",
        action: "assign",
        entity_type: studentId
          ? "student"
          : "teacher",
        entity_id:
          studentId || teacherId,
        summary:
          kind === "special_diet"
            ? "Dining special diet recorded"
            : "Dining meal plan assigned",
        payload: rows[0],
      });

      return NextResponse.json({
        assignment: rows[0],
      });
    }

    return validationError(
      "Unsupported dining operation."
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to save dining operation."
    );
  }
}
