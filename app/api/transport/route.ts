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

const activeSchoolId = (
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
      await requireSchoolModule("TRANSPORT");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return validationError(
        "Login required to view transport."
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;

    const [
      vehicles,
      routes,
      assignments,
      attendance,
      pickupDropHistory,
    ] = await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM transport_vehicles
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY id DESC
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM transport_routes
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY id DESC
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          ta.*,
          tr.route_name,
          tr.vehicle_number,
          s.first_name,
          s.last_name,
          t.first_name AS teacher_first_name,
          t.last_name AS teacher_last_name,
          c.class_name,
          sec.section_name,
          ay.academic_year
        FROM transport_assignments ta
        LEFT JOIN transport_routes tr ON tr.id = ta.route_id
        LEFT JOIN students s ON s.id = ta.student_id
        LEFT JOIN teachers t ON t.id = ta.teacher_id
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
        LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
        LEFT JOIN academic_years ay ON ay.id = ta.academic_year_id
        WHERE ($1::int IS NULL OR COALESCE(ta.school_id, s.school_id, t.school_id) = $1::int)
          AND ($2::int IS NULL OR ta.academic_year_id = $2::int OR ta.academic_year_id IS NULL)
        ORDER BY ta.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          ta.*,
          tr.route_name,
          tr.vehicle_number,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name
        FROM transport_attendance ta
        LEFT JOIN transport_routes tr ON tr.id = ta.route_id
        LEFT JOIN students s ON s.id = ta.student_id
        WHERE ($1::int IS NULL OR ta.school_id = $1::int)
          AND ($2::int IS NULL OR ta.academic_year_id = $2::int OR ta.academic_year_id IS NULL)
        ORDER BY ta.attendance_date DESC, ta.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          h.*,
          tr.route_name,
          tr.vehicle_number,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name
        FROM transport_pickup_drop_history h
        LEFT JOIN transport_routes tr ON tr.id = h.route_id
        LEFT JOIN students s ON s.id = h.student_id
        WHERE ($1::int IS NULL OR h.school_id = $1::int)
          AND ($2::int IS NULL OR h.academic_year_id = $2::int OR h.academic_year_id IS NULL)
        ORDER BY h.event_time DESC, h.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
    ]);

    return NextResponse.json({
      vehicles,
      routes,
      assignments,
      attendance,
      pickupDropHistory,
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
      "Failed to load transport"
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
        "Login required to update transport."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "transport",
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "transport",
            "create"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();
    const kind = String(
      body.kind || "vehicle"
    );
    const schoolId =
      user.role === "SUPER_ADMIN"
        ? Number(body.school_id) ||
          activeSchoolId(user)
        : activeSchoolId(user);

    if (!schoolId) {
      return validationError(
        "Select a school before updating transport."
      );
    }

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

    if (!academicYearId) {
      return validationError(
        "Select an academic year before updating transport."
      );
    }

    if (kind === "route") {
      if (!body.route_name) {
        return validationError(
          "Route name is required."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO transport_routes (
            school_id,
            academic_year_id,
            route_name,
            vehicle_number,
            driver_name,
            driver_phone,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          body.route_name,
          body.vehicle_number || null,
          body.driver_name || null,
          body.driver_phone || null,
          user.id || null
        );

      await recordEvent({
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "transport",
        event_type:
          "TRANSPORT_ROUTE_CREATED",
        action: "create",
        entity_type: "school",
        entity_id: schoolId,
        summary:
          "Transport route created",
      });

      return NextResponse.json({
        route: rows[0],
      });
    }

    if (kind === "assignment") {
      const assignedToType =
        String(
          body.assigned_to_type ||
            (body.teacher_id
              ? "TEACHER"
              : "STUDENT")
        ).toUpperCase();
      const studentId =
        assignedToType === "STUDENT"
          ? Number(body.student_id) ||
            null
          : null;
      const teacherId =
        assignedToType === "TEACHER"
          ? Number(body.teacher_id) ||
            null
          : null;

      if (
        assignedToType === "STUDENT" &&
        !studentId
      ) {
        return validationError(
          "Select a student before assigning transport."
        );
      }

      if (
        assignedToType === "TEACHER" &&
        !teacherId
      ) {
        return validationError(
          "Select a teacher before assigning transport."
        );
      }

      if (!body.route_id) {
        return validationError(
          "Select a route before assigning transport."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO transport_assignments (
            school_id,
            student_id,
            teacher_id,
            route_id,
            pickup_point,
            drop_point,
            academic_year_id,
            assigned_to_type,
            status,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ACTIVE',$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          studentId,
          teacherId,
          Number(body.route_id),
          body.pickup_point || null,
          body.drop_point || null,
          academicYearId,
          assignedToType,
          user.id || null
        );

      await recordEvent({
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "transport",
        event_type:
          "TRANSPORT_ASSIGNED",
        action: "assign",
        entity_type:
          assignedToType === "TEACHER"
            ? "teacher"
            : "student",
        entity_id:
          assignedToType === "TEACHER"
            ? teacherId
            : studentId,
        summary:
          `Transport assigned to ${assignedToType.toLowerCase()}`,
        payload: {
          route_id: body.route_id,
          assigned_to_type:
            assignedToType,
        },
      });

      return NextResponse.json({
        assignment: rows[0],
      });
    }

    if (kind === "attendance") {
      const studentId =
        Number(body.student_id) || null;
      const routeId =
        Number(body.route_id) || null;
      const tripType = String(
        body.trip_type || "PICKUP"
      ).toUpperCase();

      if (!studentId || !routeId) {
        return validationError(
          "Student and route are required before recording transport attendance."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO transport_attendance (
            school_id,
            academic_year_id,
            student_id,
            route_id,
            vehicle_id,
            trip_type,
            attendance_date,
            status,
            pickup_point,
            drop_point,
            recorded_by,
            remarks,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,CURRENT_TIMESTAMP)
          ON CONFLICT ON CONSTRAINT uq_transport_student_trip_date
          DO UPDATE SET
            route_id = EXCLUDED.route_id,
            vehicle_id = EXCLUDED.vehicle_id,
            status = EXCLUDED.status,
            pickup_point = EXCLUDED.pickup_point,
            drop_point = EXCLUDED.drop_point,
            recorded_by = EXCLUDED.recorded_by,
            remarks = EXCLUDED.remarks,
            metadata = EXCLUDED.metadata
          RETURNING *
          `,
          schoolId,
          academicYearId,
          studentId,
          routeId,
          body.vehicle_id
            ? Number(body.vehicle_id)
            : null,
          tripType,
          body.attendance_date
            ? new Date(
                body.attendance_date
              )
            : new Date(),
          body.status || "PRESENT",
          body.pickup_point || null,
          body.drop_point || null,
          user.id || null,
          body.remarks || null,
          JSON.stringify(
            body.metadata || {}
          ),
          user.id || null
        );

      const event =
        await recordEvent({
          school_id: schoolId,
          academic_year_id:
            academicYearId,
          user_id: user.id,
          actor_role: user.role,
          module_name: "transport",
          event_type:
            "TRANSPORT_ATTENDANCE_RECORDED",
          action: "record",
          entity_type: "student",
          entity_id: studentId,
          summary:
            "Transport attendance recorded",
          payload: rows[0],
        });

      await prisma.$executeRawUnsafe(
        `
        UPDATE transport_attendance
        SET event_id = $1
        WHERE id = $2
        `,
        event.id,
        rows[0]?.id
      );

      return NextResponse.json({
        attendance: {
          ...rows[0],
          event_id: event.id,
        },
      });
    }

    if (
      kind === "pickup_drop" ||
      kind === "trip_event"
    ) {
      const studentId =
        Number(body.student_id) || null;
      const routeId =
        Number(body.route_id) || null;

      if (!studentId || !routeId) {
        return validationError(
          "Student and route are required before recording pickup/drop history."
        );
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          INSERT INTO transport_pickup_drop_history (
            school_id,
            academic_year_id,
            student_id,
            route_id,
            vehicle_id,
            trip_type,
            pickup_point,
            drop_point,
            event_time,
            status,
            recorded_by,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          studentId,
          routeId,
          body.vehicle_id
            ? Number(body.vehicle_id)
            : null,
          String(
            body.trip_type || "PICKUP"
          ).toUpperCase(),
          body.pickup_point || null,
          body.drop_point || null,
          body.event_time
            ? new Date(body.event_time)
            : new Date(),
          body.status || "RECORDED",
          user.id || null,
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
        module_name: "transport",
        event_type:
          "TRANSPORT_PICKUP_DROP_RECORDED",
        action: "record",
        entity_type: "student",
        entity_id: studentId,
        summary:
          "Transport pickup/drop history recorded",
        payload: rows[0],
      });

      return NextResponse.json({
        pickupDrop: rows[0],
      });
    }

    if (!body.vehicle_number) {
      return validationError(
        "Vehicle number is required."
      );
    }

    const vehicle =
      await prisma.transport_vehicles.create({
        data: {
          school_id: schoolId,
          academic_year_id:
            academicYearId,
          vehicle_number:
            body.vehicle_number,
          vehicle_type:
            body.vehicle_type || null,
          capacity:
            body.capacity
              ? Number(body.capacity)
              : null,
          driver_name:
            body.driver_name || null,
          driver_phone:
            body.driver_phone || null,
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
      module_name: "transport",
      event_type:
        "TRANSPORT_VEHICLE_CREATED",
      action: "create",
      entity_type: "school",
      entity_id: schoolId,
      summary:
        "Transport vehicle created",
    });

    return NextResponse.json({
      vehicle,
    });
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to save transport"
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
        "Login required to update transport."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "transport",
        "update"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "transport",
            "update"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();
    const kind = String(
      body.kind || ""
    ).toLowerCase();
    const id = Number(body.id);
    const schoolId =
      activeSchoolId(user);

    if (!id) {
      return validationError(
        "A valid transport record id is required."
      );
    }

    if (kind === "route") {
      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          UPDATE transport_routes
          SET route_name = COALESCE($2, route_name),
              vehicle_number = $3,
              driver_name = $4,
              driver_phone = $5
          WHERE id = $1
            AND ($6::int IS NULL OR school_id = $6::int)
          RETURNING *
          `,
          id,
          body.route_name
            ? String(
                body.route_name
              ).trim()
            : null,
          body.vehicle_number || null,
          body.driver_name || null,
          body.driver_phone || null,
          schoolId
        );

      if (!rows[0]) {
        return NextResponse.json(
          {
            error:
              "Transport route not found.",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json({
        route: rows[0],
      });
    }

    if (kind === "assignment") {
      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          UPDATE transport_assignments
          SET route_id = COALESCE($2, route_id),
              pickup_point = $3,
              drop_point = $4,
              status = COALESCE($5, status),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND ($6::int IS NULL OR school_id = $6::int)
          RETURNING *
          `,
          id,
          body.route_id
            ? Number(body.route_id)
            : null,
          body.pickup_point || null,
          body.drop_point || null,
          body.status || null,
          schoolId
        );

      if (!rows[0]) {
        return NextResponse.json(
          {
            error:
              "Transport assignment not found.",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json({
        assignment: rows[0],
      });
    }

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        UPDATE transport_vehicles
        SET vehicle_number = COALESCE($2, vehicle_number),
            vehicle_type = $3,
            capacity = $4,
            driver_name = $5,
            driver_phone = $6
        WHERE id = $1
          AND ($7::int IS NULL OR school_id = $7::int)
        RETURNING *
        `,
        id,
        body.vehicle_number
          ? String(
              body.vehicle_number
            ).trim()
          : null,
        body.vehicle_type || null,
        body.capacity
          ? Number(body.capacity)
          : null,
        body.driver_name || null,
        body.driver_phone || null,
        schoolId
      );

    if (!rows[0]) {
      return NextResponse.json(
        {
          error:
            "Transport vehicle not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      vehicle: rows[0],
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to update transport"
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
        "Login required to delete transport."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "transport",
        "delete"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "transport",
            "delete"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const url =
      new URL(request.url);
    const kind = String(
      url.searchParams?.get("kind") ||
        "vehicle"
    ).toLowerCase();
    const id = Number(
      url.searchParams?.get("id")
    );
    const schoolId =
      activeSchoolId(user);

    if (!id) {
      return validationError(
        "A valid transport record id is required."
      );
    }

    if (kind === "route") {
      await prisma.$transaction(
        async (tx) => {
          await tx.$executeRawUnsafe(
            "DELETE FROM transport_attendance WHERE route_id = $1",
            id
          );
          await tx.$executeRawUnsafe(
            "DELETE FROM transport_pickup_drop_history WHERE route_id = $1",
            id
          );
          await tx.$executeRawUnsafe(
            "DELETE FROM transport_assignments WHERE route_id = $1",
            id
          );
          await tx.$executeRawUnsafe(
            "DELETE FROM transport_routes WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",
            id,
            schoolId
          );
        }
      );
    } else if (
      kind === "assignment"
    ) {
      await prisma.$executeRawUnsafe(
        "DELETE FROM transport_assignments WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",
        id,
        schoolId
      );
    } else {
      await prisma.$executeRawUnsafe(
        "DELETE FROM transport_vehicles WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",
        id,
        schoolId
      );
    }

    await recordEvent({
      school_id: schoolId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "transport",
      event_type:
        "TRANSPORT_RECORD_DELETED",
      action: "delete",
      entity_type: kind,
      entity_id: id,
      summary:
        "Transport record deleted",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to delete transport"
    );
  }
}
