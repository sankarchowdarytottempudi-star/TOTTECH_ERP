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
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

type Row = Record<string, unknown>;

const scopedSchoolId = (user: any) =>
  user?.role === "SUPER_ADMIN"
    ? Number(user.school_id) || null
    : Number(user?.school_id) || null;

export async function GET(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("HOSTEL");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return validationError(
        "Login required to view hostel operations."
      );
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;

    const [
      hostels,
      allocations,
      attendance,
      movementHistory,
    ] = await Promise.all([
      prisma.hostels.findMany({
        where: {
          ...(schoolId
            ? {
                school_id: schoolId,
              }
            : {}),
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
          id: "desc",
        },
      }),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          ha.*,
          h.hostel_name,
          h.hostel_type,
          s.admission_number,
          s.enrollment_number,
          s.first_name,
          s.middle_name,
          s.last_name,
          COALESCE(c.class_name, '') AS class_name,
          COALESCE(sec.section_name, '') AS section_name
        FROM hostel_allocations ha
        LEFT JOIN hostels h ON h.id = ha.hostel_id
        LEFT JOIN students s ON s.id = ha.student_id
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
        LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
        WHERE ($1::int IS NULL OR ha.school_id = $1::int)
          AND ($2::int IS NULL OR ha.academic_year_id = $2::int OR ha.academic_year_id IS NULL)
        ORDER BY ha.allocation_date DESC NULLS LAST, ha.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          ha.*,
          h.hostel_name,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name
        FROM hostel_attendance ha
        LEFT JOIN hostels h ON h.id = ha.hostel_id
        LEFT JOIN students s ON s.id = ha.student_id
        WHERE ($1::int IS NULL OR ha.school_id = $1::int)
          AND ($2::int IS NULL OR ha.academic_year_id = $2::int OR ha.academic_year_id IS NULL)
        ORDER BY ha.attendance_date DESC, ha.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          hm.*,
          h.hostel_name,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name
        FROM hostel_movement_history hm
        LEFT JOIN hostels h ON h.id = hm.hostel_id
        LEFT JOIN students s ON s.id = hm.student_id
        WHERE ($1::int IS NULL OR hm.school_id = $1::int)
          AND ($2::int IS NULL OR hm.academic_year_id = $2::int OR hm.academic_year_id IS NULL)
        ORDER BY hm.movement_at DESC, hm.id DESC
        LIMIT 200
        `,
        schoolId,
        academicYearId
      ),
    ]);

    return NextResponse.json({
      hostels,
      allocations,
      attendance,
      movementHistory,
      academicYear: {
        id: academicYearId,
        scope:
          context.academicYearScope,
      },
    });
  } catch (error) {
    console.error(
      "Hostel GET error:",
      error
    );

    return apiError(
      error,
      "Failed to load hostel operations."
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before updating hostel operations."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "hostel",
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "hostel",
            "create"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();
    const kind = String(
      body.kind || "hostel"
    );
    const schoolId =
      scopedSchoolId(user) ||
      Number(body.school_id) ||
      null;
    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        academicYear?.id ??
          user.academic_year_id
      ) || null;

    if (!schoolId) {
      return validationError(
        "Select a school before updating hostel operations."
      );
    }

    if (!academicYearId) {
      return validationError(
        "Select an academic year before updating hostel operations."
      );
    }

    if (kind === "assignment") {
      return assignHostel({
        body,
        user,
        schoolId,
        academicYearId,
      });
    }

    if (kind === "attendance") {
      return recordHostelAttendance({
        body,
        user,
        schoolId,
        academicYearId,
      });
    }

    if (kind === "movement") {
      return recordHostelMovement({
        body,
        user,
        schoolId,
        academicYearId,
      });
    }

    if (!body.hostel_name) {
      return validationError(
        "Hostel name is required."
      );
    }

    const hostel =
      await prisma.hostels.create({
        data: {
          school_id: schoolId,
          academic_year_id:
            academicYearId,
          hostel_name: String(
            body.hostel_name
          ).trim(),
          hostel_type:
            body.hostel_type
              ? String(
                  body.hostel_type
                ).trim()
              : null,
          warden_name:
            body.warden_name
              ? String(
                  body.warden_name
                ).trim()
              : null,
          warden_phone:
            body.warden_phone
              ? String(
                  body.warden_phone
                ).trim()
              : null,
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
      module_name: "hostel",
      event_type: "HOSTEL_CREATED",
      action: "create",
      entity_type: "hostel",
      entity_id: hostel.id,
      summary: "Hostel created",
      payload: {
        hostel_name:
          hostel.hostel_name,
        hostel_type:
          hostel.hostel_type,
      },
    });

    return NextResponse.json(
      {
        hostel,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Hostel POST error:",
      error
    );

    return apiError(
      error,
      "Failed to save hostel operations."
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
        "Login required before updating hostels."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "hostel",
        "update"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "hostel",
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
    const id = Number(body.id);
    const schoolId =
      scopedSchoolId(user);

    if (!id) {
      return validationError(
        "A valid hostel id is required."
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        Row[]
      >(
        `
        UPDATE hostels
        SET hostel_name = COALESCE($2, hostel_name),
            hostel_type = $3,
            warden_name = $4,
            warden_phone = $5
        WHERE id = $1
          AND ($6::int IS NULL OR school_id = $6::int)
        RETURNING *
        `,
        id,
        body.hostel_name
          ? String(
              body.hostel_name
            ).trim()
          : null,
        body.hostel_type || null,
        body.warden_name || null,
        body.warden_phone || null,
        schoolId
      );

    if (!rows[0]) {
      return NextResponse.json(
        {
          error: "Hostel not found.",
        },
        {
          status: 404,
        }
      );
    }

    await recordEvent({
      school_id: schoolId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "hostel",
      event_type: "HOSTEL_UPDATED",
      action: "update",
      entity_type: "hostel",
      entity_id: id,
      summary: "Hostel updated",
      payload: rows[0],
    });

    return NextResponse.json({
      hostel: rows[0],
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to update hostel"
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
        "Login required before deleting hostels."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "hostel",
        "delete"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "hostel",
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
    const id = Number(
      url.searchParams?.get("id")
    );
    const schoolId =
      scopedSchoolId(user);

    if (!id) {
      return validationError(
        "A valid hostel id is required."
      );
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(
          "DELETE FROM hostel_attendance WHERE hostel_id = $1",
          id
        );
        await tx.$executeRawUnsafe(
          "DELETE FROM hostel_movement_history WHERE hostel_id = $1",
          id
        );
        await tx.$executeRawUnsafe(
          "DELETE FROM hostel_allocations WHERE hostel_id = $1",
          id
        );
        await tx.$executeRawUnsafe(
          "DELETE FROM hostels WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",
          id,
          schoolId
        );
      }
    );

    await recordEvent({
      school_id: schoolId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "hostel",
      event_type: "HOSTEL_DELETED",
      action: "delete",
      entity_type: "hostel",
      entity_id: id,
      summary: "Hostel deleted",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to delete hostel"
    );
  }
}

async function assignHostel({
  body,
  user,
  schoolId,
  academicYearId,
}: {
  body: any;
  user: any;
  schoolId: number;
  academicYearId: number | null;
}) {
  const hostelId =
    Number(body.hostel_id) || null;
  const studentId =
    Number(body.student_id) || null;

  if (!hostelId) {
    return validationError(
      "Select a hostel before assigning a student."
    );
  }

  if (!studentId) {
    return validationError(
      "Select a student before assigning hostel."
    );
  }

  const [hostel] =
    await prisma.hostels.findMany({
      where: {
        id: hostelId,
        school_id: schoolId,
      },
      take: 1,
    });

  if (!hostel) {
    return validationError(
      "Selected hostel does not belong to the selected school."
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
        AND s.school_id = $2
      ORDER BY sye.id DESC NULLS LAST
      LIMIT 1
      `,
      studentId,
      schoolId,
      academicYearId
    );
  const student = studentRows[0];

  if (!student) {
    return validationError(
      "Selected student was not found in the selected school."
    );
  }

  const classId =
    Number(body.class_id) || null;
  const sectionId =
    Number(body.section_id) || null;

  if (
    classId &&
    Number(student.class_id) !==
      classId
  ) {
    return validationError(
      "Selected student does not belong to the selected class."
    );
  }

  if (
    sectionId &&
    Number(student.section_id) !==
      sectionId
  ) {
    return validationError(
      "Selected student does not belong to the selected section."
    );
  }

  const allocationDate =
    body.allocation_date
      ? new Date(body.allocation_date)
      : new Date();
  const bedNumber =
    body.bed_number
      ? String(body.bed_number).trim()
      : null;

  const allocationRows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO hostel_allocations (
        school_id,
        academic_year_id,
        student_id,
        hostel_id,
        room_id,
        bed_number,
        allocation_date,
        created_by,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)
      RETURNING *
      `,
      schoolId,
      academicYearId,
      studentId,
      hostelId,
      body.room_id
        ? Number(body.room_id)
        : null,
      bedNumber,
      allocationDate,
      user.id || null
    );
  const allocation =
    allocationRows[0];

  await prisma.hostel_students.create({
    data: {
      student_id: studentId,
      room_number:
        body.room_number
          ? String(
              body.room_number
            ).trim()
          : null,
      bed_number: bedNumber,
      joining_date: allocationDate,
      status: "ACTIVE",
    },
  });

  await prisma.students.update({
    where: {
      id: studentId,
    },
    data: {
      hostel_required: true,
    },
  });

  await recordEvent({
    school_id: schoolId,
    academic_year_id:
      academicYearId,
    user_id: user.id,
    actor_role: user.role,
    module_name: "hostel",
    event_type:
      "HOSTEL_ASSIGNED_TO_STUDENT",
    action: "assign",
    entity_type: "student",
    entity_id: studentId,
    summary:
      "Hostel assigned to student",
    payload: {
      hostel_id: hostelId,
      allocation_id:
        allocation?.id,
      class_id: classId,
      section_id: sectionId,
    },
  });

  return NextResponse.json(
    {
      allocation,
    },
    {
      status: 201,
    }
  );
}

async function recordHostelAttendance({
  body,
  user,
  schoolId,
  academicYearId,
}: {
  body: any;
  user: any;
  schoolId: number;
  academicYearId: number | null;
}) {
  const studentId =
    Number(body.student_id) || null;
  const hostelId =
    Number(body.hostel_id) || null;

  if (!studentId || !hostelId) {
    return validationError(
      "Student and hostel are required before recording hostel attendance."
    );
  }

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO hostel_attendance (
        school_id,
        academic_year_id,
        student_id,
        hostel_id,
        room_id,
        attendance_date,
        status,
        recorded_by,
        remarks,
        metadata,
        created_by,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,CURRENT_TIMESTAMP)
      ON CONFLICT ON CONSTRAINT uq_hostel_student_date
      DO UPDATE SET
        hostel_id = EXCLUDED.hostel_id,
        room_id = EXCLUDED.room_id,
        status = EXCLUDED.status,
        recorded_by = EXCLUDED.recorded_by,
        remarks = EXCLUDED.remarks,
        metadata = EXCLUDED.metadata
      RETURNING *
      `,
      schoolId,
      academicYearId,
      studentId,
      hostelId,
      body.room_id
        ? Number(body.room_id)
        : null,
      body.attendance_date
        ? new Date(body.attendance_date)
        : new Date(),
      body.status || "PRESENT",
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
      module_name: "hostel",
      event_type:
        "HOSTEL_ATTENDANCE_RECORDED",
      action: "record",
      entity_type: "student",
      entity_id: studentId,
      summary:
        "Hostel attendance recorded",
      payload: rows[0],
    });

  await prisma.$executeRawUnsafe(
    `
    UPDATE hostel_attendance
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

async function recordHostelMovement({
  body,
  user,
  schoolId,
  academicYearId,
}: {
  body: any;
  user: any;
  schoolId: number;
  academicYearId: number | null;
}) {
  const studentId =
    Number(body.student_id) || null;
  const hostelId =
    Number(body.hostel_id) || null;

  if (!studentId || !hostelId) {
    return validationError(
      "Student and hostel are required before recording hostel movement."
    );
  }

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO hostel_movement_history (
        school_id,
        academic_year_id,
        student_id,
        hostel_id,
        room_id,
        bed_id,
        movement_type,
        movement_at,
        recorded_by,
        notes,
        metadata,
        created_by,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,CURRENT_TIMESTAMP)
      RETURNING *
      `,
      schoolId,
      academicYearId,
      studentId,
      hostelId,
      body.room_id
        ? Number(body.room_id)
        : null,
      body.bed_id
        ? Number(body.bed_id)
        : null,
      body.movement_type || "CHECK_IN",
      body.movement_at
        ? new Date(body.movement_at)
        : new Date(),
      user.id || null,
      body.notes || null,
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
    module_name: "hostel",
    event_type:
      "HOSTEL_MOVEMENT_RECORDED",
    action: "record",
    entity_type: "student",
    entity_id: studentId,
    summary:
      "Hostel movement recorded",
    payload: rows[0],
  });

  return NextResponse.json({
    movement: rows[0],
  });
}
