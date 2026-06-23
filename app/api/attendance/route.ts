import { NextResponse } from "next/server";

import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";
import {
  requireSchoolModule,
} from "@/lib/module-governance";
import { sendAbsentNotifications } from "@/lib/attendance/absence-alerts";

type AttendanceInput = {
  school_id?: unknown;
  class_id?: unknown;
  section_id?: unknown;
  student_id?: unknown;
  attendance_date?: unknown;
  status?: unknown;
  remarks?: unknown;
};

type AttendanceRow = {
  id: number;
  school_id: number | null;
  class_id: number | null;
  section_id: number | null;
  student_id: number | null;
  attendance_date: string | Date | null;
  status: string | null;
  remarks: string | null;
  created_at: string | Date | null;
  student_name: string | null;
  admission_number: string | null;
  enrollment_number: string | null;
  roll_number: string | null;
  class_name: string | null;
  section_name: string | null;
};

type SummaryRow = {
  attendance_date: string | null;
  status: string | null;
  count: number;
};

const allowedStatuses = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "LEAVE_APPROVED",
  "MEDICAL_LEAVE",
  "DUTY_LEAVE",
] as const;

const toPositiveNumber = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const dateString = (
  value: unknown
) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string") {
    return null;
  }

  const candidate = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(
    candidate
  )
    ? candidate
    : null;
};

const monthRange = (
  value: string | null
) => {
  if (
    !value ||
    !/^\d{4}-\d{2}$/.test(value)
  ) {
    return {
      start: null,
      end: null,
    };
  }

  const [year, month] = value
    .split("-")
    .map(Number);
  const start = new Date(
    Date.UTC(year, month - 1, 1)
  );
  const end = new Date(
    Date.UTC(year, month, 1)
  );

  return {
    start: start
      .toISOString()
      .slice(0, 10),
    end: end
      .toISOString()
      .slice(0, 10),
  };
};

const normalizeStatus = (
  value: unknown
) => {
  const status = String(
    value || "PRESENT"
  )
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  return allowedStatuses.includes(
    status as (typeof allowedStatuses)[number]
  )
    ? status
    : null;
};

const dbDate = (value: string) =>
  new Date(`${value}T00:00:00.000Z`);

const todayDate = () =>
  new Date().toISOString().slice(0, 10);

const getScopedSchoolId = (
  user: Record<string, unknown>,
  requestedSchoolId?: unknown
) => {
  const userSchoolId = toPositiveNumber(
    user.school_id
  );

  if (
    user.role === "SUPER_ADMIN" &&
    !userSchoolId
  ) {
    return toPositiveNumber(
      requestedSchoolId
    );
  }

  return userSchoolId;
};

export async function GET(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("OPERATIONS");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json(
        {
          error:
            "Login required before loading attendance.",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } =
      new URL(request.url);
    const classId = toPositiveNumber(
      searchParams?.get("class_id")
    );
    const sectionId = toPositiveNumber(
      searchParams?.get("section_id")
    );
    const date = dateString(
      searchParams?.get("date")
    );
    const { start, end } =
      monthRange(
        searchParams?.get("month")
      );
    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;

    const [
      attendance,
      summary,
    ] = await Promise.all([
      prisma.$queryRawUnsafe<
        AttendanceRow[]
      >(
        `
        SELECT
          a.id,
          a.school_id,
          a.class_id,
          a.section_id,
          a.student_id,
          a.attendance_date,
          a.status,
          a.remarks,
          a.created_at,
          COALESCE(
            NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')), ''),
            s.name,
            CASE
              WHEN a.student_id IS NOT NULL THEN 'Student #' || a.student_id::text
              ELSE 'Unassigned Student'
            END
          ) AS student_name,
          s.admission_number,
          s.enrollment_number,
          s.roll_number,
          c.class_name,
          sec.section_name
        FROM attendance_master a
        LEFT JOIN students s ON s.id = a.student_id
        LEFT JOIN classes c ON c.id = a.class_id
        LEFT JOIN sections sec ON sec.id = a.section_id
        WHERE ($1::int IS NULL OR a.school_id = $1::int)
          AND ($2::int IS NULL OR a.class_id = $2::int)
          AND ($3::int IS NULL OR a.section_id = $3::int)
          AND ($4::date IS NULL OR a.attendance_date = $4::date)
          AND ($5::date IS NULL OR a.attendance_date >= $5::date)
          AND ($6::date IS NULL OR a.attendance_date < $6::date)
          AND ($7::int IS NULL OR a.academic_year_id = $7::int OR a.academic_year_id IS NULL)
        ORDER BY a.attendance_date DESC NULLS LAST, a.id DESC
        LIMIT 1500
        `,
        schoolId,
        classId,
        sectionId,
        date,
        start,
        end,
        academicYearId
      ),
      prisma.$queryRawUnsafe<
        SummaryRow[]
      >(
        `
        SELECT
          a.attendance_date::text AS attendance_date,
          UPPER(COALESCE(a.status, 'UNKNOWN')) AS status,
          COUNT(*)::int AS count
        FROM attendance_master a
        WHERE ($1::int IS NULL OR a.school_id = $1::int)
          AND ($2::int IS NULL OR a.class_id = $2::int)
          AND ($3::int IS NULL OR a.section_id = $3::int)
          AND ($4::date IS NULL OR a.attendance_date = $4::date)
          AND ($5::date IS NULL OR a.attendance_date >= $5::date)
          AND ($6::date IS NULL OR a.attendance_date < $6::date)
          AND ($7::int IS NULL OR a.academic_year_id = $7::int OR a.academic_year_id IS NULL)
        GROUP BY a.attendance_date, UPPER(COALESCE(a.status, 'UNKNOWN'))
        ORDER BY a.attendance_date ASC
        `,
        schoolId,
        classId,
        sectionId,
        date,
        start,
        end,
        academicYearId
      ),
    ]);

    return NextResponse.json({
      attendance,
      summary,
      filters: {
        school_id: schoolId,
        class_id: classId,
        section_id: sectionId,
        date,
        month:
          searchParams?.get("month") ??
          null,
        academic_year_id:
          academicYearId,
      },
    });
  } catch (error) {
    console.error(
      "Attendance load error:",
      error
    );

    return apiError(
      error,
      "Failed to load attendance."
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("OPERATIONS");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const body =
      await request.json();
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Login required before saving attendance.",
        },
        {
          status: 401,
        }
      );
    }

    const rawRecords =
      Array.isArray(body.records) &&
      body.records.length > 0
        ? (body.records as AttendanceInput[])
        : ([body] as AttendanceInput[]);

    const firstRecord =
      rawRecords[0] || {};
    let schoolId =
      getScopedSchoolId(
        user,
        body.school_id ??
          firstRecord.school_id
      );

    if (!schoolId) {
      const firstClassId =
        toPositiveNumber(
          firstRecord.class_id
        );
      const classRecord =
        firstClassId
          ? await prisma.classes.findUnique({
              where: {
                id: firstClassId,
              },
              select: {
                school_id: true,
              },
            })
          : null;

      schoolId =
        toPositiveNumber(
          classRecord?.school_id
        );
    }

    if (!schoolId) {
      return validationError(
        "Select a school before saving attendance."
      );
    }

    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      toPositiveNumber(
        body.academic_year_id
      ) ??
      toPositiveNumber(
        user.academic_year_id
      ) ??
      toPositiveNumber(
        academicYear?.id
      );

    const errors: string[] = [];
    const normalized = rawRecords
      .map((record, index) => {
        const studentId =
          toPositiveNumber(
            record.student_id
          );
        const classId =
          toPositiveNumber(
            record.class_id
          );
        const sectionId =
          toPositiveNumber(
            record.section_id
          );
        const attendanceDate =
          dateString(
            record.attendance_date
          );

        if (
          attendanceDate &&
          attendanceDate !== todayDate()
        ) {
          errors.push(
            `Row ${index + 1}: attendance date must be today.`
          );
        }
        const status =
          normalizeStatus(
            record.status
          );

        if (!studentId) {
          errors.push(
            `Row ${index + 1}: student is required.`
          );
        }

        if (!classId) {
          errors.push(
            `Row ${index + 1}: class is required.`
          );
        }

        if (!sectionId) {
          errors.push(
            `Row ${index + 1}: section is required.`
          );
        }

        if (!attendanceDate) {
          errors.push(
            `Row ${index + 1}: attendance date is required.`
          );
        }

        if (!status) {
          errors.push(
            `Row ${index + 1}: status must be Present, Absent, Late, Half Day, Leave Approved, Medical Leave, or Duty Leave.`
          );
        }

        return {
          school_id: schoolId,
          class_id: classId || 0,
          section_id: sectionId || 0,
          student_id: studentId || 0,
          attendance_date:
            attendanceDate || "",
          status: status || "PRESENT",
          remarks:
            typeof record.remarks ===
            "string"
              ? record.remarks.trim()
              : null,
        };
      });

    if (errors.length > 0) {
      return validationError(
        errors[0]
      );
    }

    const deduped = Array.from(
      new Map(
        normalized.map((record) => [
          record.student_id,
          record,
        ])
      ).values()
    );

    const saved =
      await prisma.$transaction(
        async (tx) => {
          const rows = [];

          for (const record of deduped) {
            await tx.attendance_master.deleteMany(
              {
                where: {
                  school_id:
                    record.school_id,
                  student_id:
                    record.student_id,
                  attendance_date:
                    dbDate(
                      record.attendance_date
                    ),
                },
              }
            );

            rows.push(
              await tx.attendance_master.create(
                {
                  data: {
                    school_id:
                      record.school_id,
                    academic_year_id:
                      academicYearId,
                    class_id:
                      record.class_id,
                    section_id:
                      record.section_id,
                    student_id:
                      record.student_id,
                    attendance_date:
                      dbDate(
                        record.attendance_date
                      ),
                    status:
                      record.status,
                    remarks:
                      record.remarks,
                    created_by:
                      toPositiveNumber(
                        user.id
                      ),
                  },
                }
              )
            );
          }

          return rows;
        }
      );

    const counts =
      deduped.reduce<
        Record<string, number>
      >((acc, record) => {
        acc[record.status] =
          (acc[record.status] || 0) + 1;
        return acc;
      }, {});

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id:
        toPositiveNumber(user.id),
      actor_role:
        typeof user.role === "string"
          ? user.role
          : null,
      module_name: "attendance",
      event_type:
        "STUDENT_ATTENDANCE_SAVED",
      action: "save",
      entity_type: "class",
      entity_id:
        deduped[0]?.class_id ?? null,
      summary: `Saved student attendance for ${deduped.length} students.`,
      payload: {
        attendance_date:
          deduped[0]
            ?.attendance_date ?? null,
        class_id:
          deduped[0]?.class_id ??
          null,
        section_id:
          deduped[0]?.section_id ??
          null,
        counts,
      },
    });

    await Promise.all(
      saved
        .filter(
          (row) =>
            String(row.status || "")
              .toUpperCase() === "ABSENT"
        )
        .map((row) =>
          sendAbsentNotifications(
            Number(row.id),
            toPositiveNumber(user.id)
          ).catch((error) => {
            console.error(
              "Absent notification workflow failed:",
              error instanceof Error
                ? error.message
                : error
            );
          })
        )
    );

    return NextResponse.json({
      success: true,
      count: saved.length,
      attendance: saved,
    });
  } catch (error) {
    console.error(
      "Attendance save error:",
      error
    );

    return apiError(
      error,
      "Failed to save attendance."
    );
  }
}
