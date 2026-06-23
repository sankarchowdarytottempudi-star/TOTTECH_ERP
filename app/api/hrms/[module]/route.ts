import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import {
  resolveMutationContext,
  resolvePlatformContext,
} from "@/lib/api/context";
import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  asInt,
  cleanSchoolCode,
  decimal,
  HRMS_MODULES,
  leaveDays,
  nextEmployeeId,
} from "@/lib/hrms";
import {
  isValidUan,
  normalizeUan,
} from "@/lib/hrms/pf";

type Row = Record<string, unknown>;

const activeFilter = {
  OR: [
    {
      is_active: true,
    },
    {
      is_active: null,
    },
  ],
};

const tableColumnsCache = new Map<
  string,
  Set<string>
>();

async function getTableColumns(
  table: string
) {
  const cached =
    tableColumnsCache.get(table);
  if (cached) {
    return cached;
  }

  const rows =
    await prisma.$queryRawUnsafe<
      Array<{ column_name: string }>
    >(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
      `,
      table
    );

  const columns = new Set(
    rows.map((row) =>
      String(row.column_name)
    )
  );
  tableColumnsCache.set(table, columns);
  return columns;
}

function moduleTitle(
  moduleKey: string
) {
  return (
    HRMS_MODULES[
      moduleKey as keyof typeof HRMS_MODULES
    ]?.title || "HRMS Module"
  );
}

async function schoolContext(
  schoolId: number | null
) {
  if (!schoolId) {
    return null;
  }

  const school =
    await prisma.schools.findUnique({
      where: {
        id: schoolId,
      },
      select: {
        id: true,
        school_name: true,
        school_code: true,
      },
    });

  return school;
}

function sortDesc<T extends { id?: number }>(
  rows: T[]
) {
  return [...rows].sort(
    (a, b) =>
      Number(b.id || 0) - Number(a.id || 0)
  );
}

function dayKey(value: unknown) {
  const date = new Date(
    String(value || new Date())
  );
  return date.toISOString().slice(0, 10);
}

async function buildLeaveBalances(
  schoolId: number | null,
  academicYearId: number | null
) {
  const allocations =
    await prisma.hr_leave_allocations.findMany({
      where: {
        school_id: schoolId ?? undefined,
        academic_year_id:
          academicYearId ?? undefined,
      },
      orderBy: {
        id: "desc",
      },
    });

  const requests =
    await prisma.hr_leave_requests.findMany({
      where: {
        school_id: schoolId ?? undefined,
        academic_year_id:
          academicYearId ?? undefined,
        status: "APPROVED",
      },
      orderBy: {
        id: "desc",
      },
    });

  const usedByKey = new Map<string, number>();
  for (const request of requests) {
    const key = [
      request.staff_id,
      request.leave_category_id,
    ].join(":");
    usedByKey.set(
      key,
      (usedByKey.get(key) || 0) +
        Number(request.days_requested || 0)
    );
  }

  return allocations.map((allocation) => {
    const key = [
      allocation.staff_id,
      allocation.leave_category_id,
    ].join(":");
    const used = usedByKey.get(key) || 0;
    const balance =
      Number(allocation.allocated_days || 0) -
      used;

    return {
      ...allocation,
      used_days: used,
      balance_days: balance,
    };
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ module: string }> }
) {
  try {
    const params = await context.params;
    const moduleKey = params?.module || "";
    const current = await resolvePlatformContext(
      request
    );
    if (!current) {
      return NextResponse.json(
        { error: "Login required." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const q =
      url.searchParams?.get("q")?.trim() || "";
    const schoolId =
      asInt(url.searchParams?.get("school_id")) ??
      current.schoolId;
    const academicYearId =
      asInt(
        url.searchParams?.get("academic_year_id")
      ) ?? current.academicYearId;

    if (moduleKey === "staff-directory") {
      const columns =
        await getTableColumns(
          "hr_staff_master"
        );
      const params: Array<
        string | number | null
      > = [];
      const whereParts: string[] = columns.has(
        "is_deleted"
      )
        ? [`COALESCE(t.is_deleted,false) = false`]
        : [];
      let index = 1;
      const addParam = (
        value: string | number | null
      ) => {
        params?.push(value);
        return `$${index++}`;
      };

      if (schoolId != null) {
        whereParts.push(
          `t.school_id = ${addParam(
            schoolId
          )}`
        );
      }

      if (academicYearId != null) {
        whereParts.push(
          `t.academic_year_id = ${addParam(
            academicYearId
          )}`
        );
      }

      if (q) {
        const searchableColumns = [
          "first_name",
          "last_name",
          "employee_id",
          "mobile",
          "designation",
          "department",
          "staff_type",
          "staff_category",
          "sub_category",
        ].filter((column) =>
          columns.has(column)
        );

        if (searchableColumns.length) {
          whereParts.push(
            `(${searchableColumns
              .map(
                (column) =>
                  `COALESCE(t.${column}::text, '') ILIKE ${addParam(`%${q}%`)}`
              )
              .join(" OR ")})`
          );
        }
      }

      const rows =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          SELECT t.*
          FROM hr_staff_master t
          WHERE ${whereParts.join(" AND ")}
          ORDER BY t.id DESC
          LIMIT 50
          `,
          ...params
        );

      return NextResponse.json({
        module: moduleKey,
        title: moduleTitle(moduleKey),
        records: rows,
        counts: {
          total: rows.length,
          active: rows.filter((row) => row.is_active !== false)
            .length,
        },
      });
    }

    if (moduleKey === "leave-management") {
      const [categories, balances, requests] =
        await Promise.all([
          prisma.hr_leave_categories.findMany({
            where: {
              school_id: schoolId ?? undefined,
              ...(q
                ? {
                    category_name: {
                      contains: q,
                      mode: "insensitive",
                    },
                  }
                : {}),
            },
            orderBy: {
              id: "desc",
            },
          }),
          buildLeaveBalances(
            schoolId ?? null,
            academicYearId ?? null
          ),
          prisma.hr_leave_requests.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
              ...(q
                ? {
                    OR: [
                      {
                        reason: {
                          contains: q,
                          mode: "insensitive",
                        },
                      },
                      {
                        status: {
                          contains: q,
                          mode: "insensitive",
                        },
                      },
                    ],
                  }
                : {}),
            },
            orderBy: {
              id: "desc",
            },
            take: 100,
          }),
        ]);

      return NextResponse.json({
        module: moduleKey,
        title: moduleTitle(moduleKey),
        categories,
        balances,
        requests,
        counts: {
          categories: categories.length,
          requests: requests.length,
          approved: requests.filter(
            (row) => row.status === "APPROVED"
          ).length,
          pending: requests.filter(
            (row) => row.status === "PENDING"
          ).length,
        },
      });
    }

    if (moduleKey === "lop") {
      const entries =
        await prisma.hr_lop_entries.findMany({
          where: {
            school_id: schoolId ?? undefined,
            academic_year_id:
              academicYearId ?? undefined,
          },
          orderBy: {
            id: "desc",
          },
          take: 100,
        });

      const teacherAttendance =
        await prisma.teacher_attendance.findMany({
          where: {
            school_id: schoolId ?? undefined,
            academic_year_id:
              academicYearId ?? undefined,
            status: "ABSENT",
          },
          orderBy: {
            attendance_date: "desc",
          },
          take: 100,
        });

      return NextResponse.json({
        module: moduleKey,
        title: moduleTitle(moduleKey),
        entries,
        teacherAttendance,
        counts: {
          generated: entries.length,
          absent: teacherAttendance.length,
        },
      });
    }

    if (moduleKey === "payroll") {
      const [structures, assignments, history, runs, slips] =
        await Promise.all([
          prisma.hr_salary_structures.findMany({
            where: {
              school_id: schoolId ?? undefined,
            },
            orderBy: {
              id: "desc",
            },
            take: 50,
          }),
          prisma.hr_salary_assignments.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
            },
            orderBy: {
              id: "desc",
            },
            take: 100,
          }),
          prisma.hr_salary_history.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
            },
            orderBy: {
              id: "desc",
            },
            take: 100,
          }),
          prisma.hr_payroll_runs.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
            },
            orderBy: {
              id: "desc",
            },
            take: 25,
          }),
          prisma.hr_pay_slips.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
            },
            orderBy: {
              id: "desc",
            },
            take: 100,
          }),
        ]);

      return NextResponse.json({
        module: moduleKey,
        title: moduleTitle(moduleKey),
        structures,
        assignments,
        history,
        runs,
        slips,
        counts: {
          structures: structures.length,
          assignments: assignments.length,
          slips: slips.length,
        },
      });
    }

    if (moduleKey === "increments") {
      const requests =
        await prisma.hr_increment_requests.findMany({
          where: {
            school_id: schoolId ?? undefined,
            academic_year_id:
              academicYearId ?? undefined,
            ...(q
              ? {
                  OR: [
                    {
                      reason: {
                        contains: q,
                        mode: "insensitive",
                      },
                    },
                    {
                      status: {
                        contains: q,
                        mode: "insensitive",
                      },
                    },
                  ],
                }
              : {}),
          },
          orderBy: {
            id: "desc",
          },
          take: 100,
        });

      return NextResponse.json({
        module: moduleKey,
        title: moduleTitle(moduleKey),
        requests,
        counts: {
          pending: requests.filter(
            (row) => row.status === "PENDING"
          ).length,
          approved: requests.filter(
            (row) => row.status === "APPROVED"
          ).length,
          rejected: requests.filter(
            (row) => row.status === "REJECTED"
          ).length,
        },
      });
    }

    if (moduleKey === "payslips") {
      const slips =
        await prisma.hr_pay_slips.findMany({
          where: {
            school_id: schoolId ?? undefined,
            academic_year_id:
              academicYearId ?? undefined,
          },
          orderBy: {
            id: "desc",
          },
          take: 100,
        });

      return NextResponse.json({
        module: moduleKey,
        title: moduleTitle(moduleKey),
        slips,
        counts: {
          total: slips.length,
        },
      });
    }

    if (moduleKey === "pf") {
      const columns =
        await getTableColumns(
          "hr_staff_master"
        );
      const params: Array<
        string | number | null
      > = [];
      const whereParts: string[] = [
        `COALESCE(t.is_deleted,false) = false`,
      ];
      let index = 1;
      const addParam = (
        value: string | number | null
      ) => {
        params?.push(value);
        return `$${index++}`;
      };

      if (schoolId != null) {
        whereParts.push(
          `t.school_id = ${addParam(
            schoolId
          )}`
        );
      }

      if (academicYearId != null) {
        whereParts.push(
          `t.academic_year_id = ${addParam(
            academicYearId
          )}`
        );
      }

      const pfColumns = [
        "pf_number",
        "uan_number",
        "pf_status",
      ].filter((column) =>
        columns.has(column)
      );

      if (pfColumns.length) {
        whereParts.push(
          `(${pfColumns
            .map(
              (column) =>
                `NULLIF(COALESCE(t.${column}::text, ''), '') IS NOT NULL`
            )
            .join(" OR ")})`
        );
      }

      if (q) {
        const searchableColumns = [
          "first_name",
          "last_name",
          "pf_number",
          "uan_number",
        ].filter((column) =>
          columns.has(column)
        );

        if (searchableColumns.length) {
          whereParts.push(
            `(${searchableColumns
              .map(
                (column) =>
                  `COALESCE(t.${column}::text, '') ILIKE ${addParam(`%${q}%`)}`
              )
              .join(" OR ")})`
          );
        }
      }

      const pfRecords =
        await prisma.$queryRawUnsafe<
          Row[]
        >(
          `
          SELECT t.*
          FROM hr_staff_master t
          WHERE ${whereParts.join(" AND ")}
          ORDER BY t.id DESC
          LIMIT 100
          `,
          ...params
        );

      return NextResponse.json({
        module: moduleKey,
        title: moduleTitle(moduleKey),
        records: pfRecords,
        notice:
          "Employee Provident Fund (EPF) regulations are governed by the Employees' Provident Fund Organisation (EPFO), Government of India.",
        links: [
          "https://www.epfindia.gov.in",
          "https://unifiedportal-mem.epfindia.gov.in",
          "https://unifiedportal-emp.epfindia.gov.in",
          "https://passbook.epfindia.gov.in",
        ],
        counts: {
          total: pfRecords.length,
        },
      });
    }

    if (moduleKey === "approvals") {
      const [leaveRequests, increments, payrollRuns] =
        await Promise.all([
          prisma.hr_leave_requests.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
              status: "PENDING",
            },
            orderBy: {
              id: "desc",
            },
            take: 50,
          }),
          prisma.hr_increment_requests.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
              status: "PENDING",
            },
            orderBy: {
              id: "desc",
            },
            take: 50,
          }),
          prisma.hr_payroll_runs.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
              status: "SUBMITTED",
            },
            orderBy: {
              id: "desc",
            },
            take: 50,
          }),
        ]);

      const records = [
        ...leaveRequests.map((row) => ({
          id: row.id,
          module_key: "leave-management",
          label: `Leave request - ${row.id}`,
          status: row.status,
          requested_at: row.created_at,
          payload: row,
        })),
        ...increments.map((row) => ({
          id: row.id,
          module_key: "increments",
          label: `Increment request - ${row.id}`,
          status: row.status,
          requested_at: row.created_at,
          payload: row,
        })),
        ...payrollRuns.map((row) => ({
          id: row.id,
          module_key: "payroll",
          label: `Payroll run - ${row.id}`,
          status: row.status,
          requested_at: row.created_at,
          payload: row,
        })),
      ];

      return NextResponse.json({
        module: moduleKey,
        title: moduleTitle(moduleKey),
        records: sortDesc(records),
        counts: {
          pending: records.length,
        },
      });
    }

    return NextResponse.json({
      module: moduleKey,
      title: moduleTitle(moduleKey),
      records: [],
      counts: {},
    });
  } catch (error) {
    console.error("HRMS GET failed", error);
    return apiError(error, "Failed to load HR module");
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ module: string }> }
) {
  try {
    const params = await context.params;
    const moduleKey = params?.module || "";
    const body = await request.json();
    const user = await getCurrentUser();
    const mutation = await resolveMutationContext(
      request,
      body
    );

    if (!mutation.context) {
      return validationError(
        mutation.error ||
          "School/College context is required."
      );
    }

    const schoolId = mutation.context.schoolId;
    const academicYearId =
      mutation.context.academicYearId;
    const school =
      await schoolContext(schoolId);

    if (!school) {
      return validationError(
        "Selected school not found."
      );
    }

    const action = String(
      body.action || "create"
    ).toLowerCase();

    if (moduleKey === "staff-directory") {
      if (action === "delete") {
        const id = asInt(body.id);
        if (!id) {
          return validationError(
            "Select a staff record to delete."
          );
        }
        const existing =
          await prisma.hr_staff_master.findUnique({
            where: { id },
          });
        await prisma.hr_staff_master.update({
          where: { id },
          data: {
            is_active: false,
            updated_by: mutation.context.user.id,
            updated_at: new Date(),
            notes: {
              ...(existing?.notes &&
              typeof existing.notes === "object"
                ? (existing.notes as Record<
                    string,
                    unknown
                  >)
                : {}),
              deleted_at: new Date().toISOString(),
            },
          },
        });
        await recordEvent({
          school_id: schoolId,
          academic_year_id:
            academicYearId,
          user_id: user?.id || null,
          created_by: user?.id || null,
          actor_role: user?.role || null,
          module_name: "HRMS",
          event_type: "STAFF_DELETED",
          action: "delete",
          entity_type: "hr_staff_master",
          entity_id: id,
          summary: "Staff master record archived",
          payload: body,
        });
        return NextResponse.json({
          ok: true,
        });
      }

      const id = asInt(body.id);
      const staffType =
        String(body.staff_type || "Teaching") === "Non-Teaching"
          ? "Non-Teaching"
          : "Teaching";
      const payload = {
        school_id: schoolId,
        academic_year_id: academicYearId,
        staff_type: staffType,
        staff_category:
          staffType === "Non-Teaching"
            ? body.staff_category || null
            : null,
        sub_category:
          staffType === "Non-Teaching"
            ? body.sub_category || null
            : null,
        first_name: body.first_name || null,
        last_name: body.last_name || null,
        department: body.department || null,
        designation: body.designation || null,
        class_assignment:
          staffType === "Teaching"
            ? body.class_assignment || null
            : null,
        section_assignment:
          staffType === "Teaching"
            ? body.section_assignment || null
            : null,
        subject_assignment:
          staffType === "Teaching"
            ? body.subject_assignment || null
            : null,
        assignment_type:
          staffType === "Teaching"
            ? body.assignment_type || null
            : null,
        is_class_teacher:
          staffType === "Teaching" &&
          (body.is_class_teacher === "on" ||
            body.is_class_teacher === true),
        teaching_experience:
          staffType === "Teaching"
            ? body.teaching_experience || null
            : null,
        qualification:
          staffType === "Teaching"
            ? body.qualification || null
            : null,
        teacher_gap_history:
          staffType === "Teaching"
            ? body.teacher_gap_history || null
            : null,
        experience_years: decimal(
          body.experience_years
        ),
        experience_gap: body.experience_gap || null,
        previous_school:
          staffType === "Teaching"
            ? body.previous_school || null
            : null,
        previous_organization:
          staffType === "Non-Teaching"
            ? body.previous_organization || null
            : null,
        reporting_manager:
          staffType === "Non-Teaching"
            ? body.reporting_manager || null
            : null,
        work_location:
          staffType === "Non-Teaching"
            ? body.work_location || null
            : null,
        joining_date:
          staffType === "Non-Teaching" && body.joining_date
            ? new Date(body.joining_date)
            : null,
        mobile: body.mobile || null,
        alternate_mobile:
          body.alternate_mobile || null,
        whatsapp_number:
          body.whatsapp_number || null,
        email: body.email || null,
        address: body.address || null,
        pf_number: body.pf_number || null,
        uan_number: normalizeUan(
          body.uan_number
        ) || null,
        pf_joining_date: body.pf_joining_date
          ? new Date(body.pf_joining_date)
          : null,
        pf_status: body.pf_status || null,
        pf_applicable:
          body.pf_applicable === undefined
            ? true
            : Boolean(body.pf_applicable),
        eps_applicable:
          body.eps_applicable === undefined
            ? true
            : Boolean(body.eps_applicable),
        pf_exit_date: body.pf_exit_date
          ? new Date(body.pf_exit_date)
          : null,
        basic_salary: decimal(
          body.basic_salary
        ),
        da: decimal(body.da),
        pf_wage: decimal(body.pf_wage),
        voluntary_pf_percent: decimal(
          body.voluntary_pf_percent
        ),
        employer_pf_percent: decimal(
          body.employer_pf_percent
        ),
        salary_details:
          staffType === "Non-Teaching"
            ? body.salary_details || null
            : null,
        bank_details:
          typeof body.bank_details === "string" &&
          body.bank_details.trim()
            ? { details: body.bank_details.trim() }
            : body.bank_details || {},
        pan: body.pan || null,
        aadhaar: body.aadhaar || null,
        documents: body.documents || {},
        notes: body.notes || {},
        salary_structure_id: asInt(
          body.salary_structure_id
        ),
        is_active:
          body.is_active !== undefined
            ? Boolean(body.is_active)
            : true,
        created_by: mutation.context.user.id,
        updated_by: mutation.context.user.id,
      } as const;

      const normalizedUan = normalizeUan(
        body.uan_number
      );
      if (
        normalizedUan &&
        !isValidUan(normalizedUan)
      ) {
        return validationError(
          "UAN must contain exactly 12 digits."
        );
      }

      if (normalizedUan) {
        const duplicate =
          await prisma.hr_staff_master.findFirst({
            where: {
              school_id: schoolId,
              uan_number: normalizedUan,
              ...(id ? { NOT: { id } } : {}),
            },
            select: { id: true },
          });

        if (duplicate) {
          return validationError(
            "Duplicate UAN number already exists for this school."
          );
        }
      }

      const record = id
        ? await prisma.hr_staff_master.update({
            where: { id },
            data: {
              ...payload,
              updated_at: new Date(),
            },
          })
        : await prisma.hr_staff_master.create({
            data: {
              ...payload,
              employee_id: await nextEmployeeId(
                school.school_code
              ),
              employee_number:
                body.employee_number || null,
            },
          });

      const pfEventType =
        !body.pf_number && !body.uan_number
          ? "PF_DETAILS_UPDATED"
          : id
            ? "PF_DETAILS_UPDATED"
            : body.pf_number
              ? "PF_NUMBER_ADDED"
              : body.uan_number
                ? "UAN_NUMBER_UPDATED"
                : "PF_DETAILS_UPDATED";

      await recordEvent({
        school_id: schoolId,
        academic_year_id: academicYearId,
        user_id: user?.id || null,
        created_by: user?.id || null,
        actor_role: user?.role || null,
        module_name: "HRMS",
        event_type: id
          ? "STAFF_UPDATED"
          : "STAFF_CREATED",
        action: id ? "update" : "create",
        entity_type: "hr_staff_master",
        entity_id: record.id,
        summary: `Staff master ${id ? "updated" : "created"}`,
        payload,
      });

      if (body.pf_number || body.uan_number || body.pf_status || body.pf_joining_date) {
        await recordEvent({
          school_id: schoolId,
          academic_year_id: academicYearId,
          user_id: user?.id || null,
          created_by: user?.id || null,
          actor_role: user?.role || null,
          module_name: "HRMS",
          event_type: pfEventType,
          action: id ? "update" : "create",
          entity_type: "hr_staff_master",
          entity_id: record.id,
          summary: "Provident Fund details updated",
          payload: {
            pf_number: body.pf_number || null,
            uan_number: body.uan_number || null,
            pf_joining_date: body.pf_joining_date || null,
            pf_status: body.pf_status || null,
          },
        });
      }

      return NextResponse.json(record);
    }

    if (moduleKey === "leave-management") {
      if (action === "create-category") {
        const category =
          await prisma.hr_leave_categories.create(
            {
              data: {
                school_id: schoolId,
                category_name: body.category_name,
                category_code: body.category_code || null,
                leaves_per_year: decimal(
                  body.leaves_per_year
                ),
                carry_forward_allowed:
                  Boolean(body.carry_forward_allowed),
                max_consecutive_days: asInt(
                  body.max_consecutive_days
                ) || 3,
                requires_approval:
                  body.requires_approval !== false,
                is_active: true,
                created_by: mutation.context.user.id,
                updated_by: mutation.context.user.id,
              },
            }
          );
        return NextResponse.json(category);
      }

      if (
        action === "update-category" ||
        action === "delete-category"
      ) {
        const id = asInt(body.id);
        if (!id) {
          return validationError(
            "Select a leave category."
          );
        }
        if (action === "delete-category") {
          await prisma.hr_leave_categories.update({
            where: { id },
            data: {
              is_active: false,
              updated_by:
                mutation.context.user.id,
              updated_at: new Date(),
            },
          });
          return NextResponse.json({
            ok: true,
          });
        }
        const category =
          await prisma.hr_leave_categories.update(
            {
              where: { id },
              data: {
                category_name: body.category_name,
                category_code: body.category_code || null,
                leaves_per_year: decimal(
                  body.leaves_per_year
                ),
                carry_forward_allowed:
                  Boolean(body.carry_forward_allowed),
                max_consecutive_days: asInt(
                  body.max_consecutive_days
                ) || 3,
                requires_approval:
                  body.requires_approval !== false,
                updated_by:
                  mutation.context.user.id,
                updated_at: new Date(),
              },
            }
          );
        return NextResponse.json(category);
      }

      if (action === "create-allocation") {
        const allocation =
          await prisma.hr_leave_allocations.create({
            data: {
              school_id: schoolId,
              academic_year_id: academicYearId,
              staff_id: asInt(body.staff_id),
              leave_category_id: asInt(
                body.leave_category_id
              ),
              department: body.department || null,
              designation: body.designation || null,
              allocated_days: decimal(
                body.allocated_days
              ),
              carry_forward:
                Boolean(body.carry_forward),
              is_active: true,
              created_by: mutation.context.user.id,
              updated_by: mutation.context.user.id,
            },
          });
        return NextResponse.json(allocation);
      }

      if (action === "submit-request") {
        const fromDate = new Date(body.from_date);
        const olderThan = new Date();
        olderThan.setDate(
          olderThan.getDate() - 3
        );
        if (fromDate < olderThan) {
          return validationError(
            "Cannot apply leave older than 3 days."
          );
        }
        const days = leaveDays(
          body.from_date,
          body.to_date
        );
        const requestRow =
          await prisma.hr_leave_requests.create({
            data: {
              school_id: schoolId,
              academic_year_id: academicYearId,
              staff_id: asInt(body.staff_id),
              leave_category_id: asInt(
                body.leave_category_id
              ),
              from_date: new Date(body.from_date),
              to_date: new Date(body.to_date),
              days_requested: days,
              reason: body.reason || null,
              attachment: body.attachment || {},
              status: "PENDING",
              created_by: mutation.context.user.id,
              updated_by: mutation.context.user.id,
            },
          });
        await recordEvent({
          school_id: schoolId,
          academic_year_id: academicYearId,
          user_id: user?.id || null,
          created_by: user?.id || null,
          actor_role: user?.role || null,
          module_name: "HRMS",
          event_type: "LEAVE_REQUEST_CREATED",
          action: "create",
          entity_type: "hr_leave_requests",
          entity_id: requestRow.id,
          summary: "Leave request created",
          payload: requestRow,
        });
        return NextResponse.json(requestRow);
      }

      if (
        action === "approve-request" ||
        action === "reject-request"
      ) {
        const id = asInt(body.id);
        if (!id) {
          return validationError(
            "Select a leave request."
          );
        }
        const status =
          action === "approve-request"
            ? "APPROVED"
            : "REJECTED";
        const requestRow =
          await prisma.hr_leave_requests.update({
            where: { id },
            data: {
              status,
              approved_by:
                action === "approve-request"
                  ? mutation.context.user.id
                  : undefined,
              approved_at:
                action === "approve-request"
                  ? new Date()
                  : undefined,
              rejection_reason:
                action === "reject-request"
                  ? body.rejection_reason || null
                  : undefined,
              updated_by: mutation.context.user.id,
              updated_at: new Date(),
            },
          });
        await recordEvent({
          school_id: schoolId,
          academic_year_id: academicYearId,
          user_id: user?.id || null,
          created_by: user?.id || null,
          actor_role: user?.role || null,
          module_name: "HRMS",
          event_type:
            action === "approve-request"
              ? "LEAVE_APPROVED"
              : "LEAVE_REJECTED",
          action,
          entity_type: "hr_leave_requests",
          entity_id: requestRow.id,
          summary: `Leave request ${status.toLowerCase()}`,
          payload: requestRow,
        });
        return NextResponse.json(requestRow);
      }
    }

    if (moduleKey === "lop") {
      if (action !== "generate") {
        return validationError(
          "Unknown LOP action."
        );
      }

      const absences =
        await prisma.teacher_attendance.findMany({
          where: {
            school_id: schoolId ?? undefined,
            academic_year_id:
              academicYearId ?? undefined,
            status: "ABSENT",
          },
          orderBy: {
            attendance_date: "desc",
          },
        });

      const entries = [];
      for (const row of absences) {
        const teacher = row.teacher_id
          ? await prisma.teachers.findUnique({
              where: {
                id: row.teacher_id,
              },
              select: {
                id: true,
                first_name: true,
                last_name: true,
                employee_id: true,
              },
            })
          : null;
        const day = Number(
          body.days_lost || 1
        );
        const amount = decimal(
          body.amount || 0
        );
        const entry =
          await prisma.hr_lop_entries.create({
            data: {
              school_id: schoolId,
              academic_year_id: academicYearId,
              staff_id: teacher?.id || null,
              attendance_date: row.attendance_date,
              days_lost: day,
              amount,
              reason:
                body.reason ||
                "Absent without approved leave",
              source: "teacher_attendance",
              status: "GENERATED",
              created_by: mutation.context.user.id,
              updated_by: mutation.context.user.id,
            },
          });
        entries.push(entry);
      }

      return NextResponse.json({
        ok: true,
        generated: entries.length,
        entries,
      });
    }

    if (moduleKey === "payroll") {
      if (action === "create-structure") {
        const structure =
          await prisma.hr_salary_structures.create(
            {
              data: {
                school_id: schoolId,
                academic_year_id: academicYearId,
                structure_name:
                  body.structure_name,
                basic: decimal(body.basic),
                hra: decimal(body.hra),
                da: decimal(body.da),
                special_allowance: decimal(
                  body.special_allowance
                ),
                transport_allowance: decimal(
                  body.transport_allowance
                ),
                medical_allowance: decimal(
                  body.medical_allowance
                ),
                other_allowances: decimal(
                  body.other_allowances
                ),
                pf: decimal(body.pf),
                esi: decimal(body.esi),
                professional_tax: decimal(
                  body.professional_tax
                ),
                income_tax: decimal(
                  body.income_tax
                ),
                other_deductions: decimal(
                  body.other_deductions
                ),
                gross_salary: decimal(
                  body.gross_salary
                ),
                net_salary: decimal(
                  body.net_salary
                ),
                metadata: body.metadata || {},
                is_active: true,
                created_by: mutation.context.user.id,
                updated_by: mutation.context.user.id,
              },
            }
          );
        return NextResponse.json(structure);
      }

      if (
        action === "update-structure" ||
        action === "delete-structure"
      ) {
        const id = asInt(body.id);
        if (!id) {
          return validationError(
            "Select a salary structure."
          );
        }
        if (action === "delete-structure") {
          await prisma.hr_salary_structures.update({
            where: { id },
            data: {
              is_active: false,
              updated_by:
                mutation.context.user.id,
              updated_at: new Date(),
            },
          });
          return NextResponse.json({
            ok: true,
          });
        }
        const structure =
          await prisma.hr_salary_structures.update(
            {
              where: { id },
              data: {
                structure_name:
                  body.structure_name,
                basic: decimal(body.basic),
                hra: decimal(body.hra),
                da: decimal(body.da),
                special_allowance: decimal(
                  body.special_allowance
                ),
                transport_allowance: decimal(
                  body.transport_allowance
                ),
                medical_allowance: decimal(
                  body.medical_allowance
                ),
                other_allowances: decimal(
                  body.other_allowances
                ),
                pf: decimal(body.pf),
                esi: decimal(body.esi),
                professional_tax: decimal(
                  body.professional_tax
                ),
                income_tax: decimal(
                  body.income_tax
                ),
                other_deductions: decimal(
                  body.other_deductions
                ),
                gross_salary: decimal(
                  body.gross_salary
                ),
                net_salary: decimal(
                  body.net_salary
                ),
                metadata: body.metadata || {},
                updated_by:
                  mutation.context.user.id,
                updated_at: new Date(),
              },
            }
          );
        return NextResponse.json(structure);
      }

      if (action === "create-assignment") {
        const assignment =
          await prisma.hr_salary_assignments.create(
            {
              data: {
                school_id: schoolId,
                academic_year_id: academicYearId,
                staff_id: asInt(body.staff_id),
                salary_structure_id: asInt(
                  body.salary_structure_id
                ),
                effective_from:
                  body.effective_from
                    ? new Date(
                        body.effective_from
                      )
                    : null,
                effective_to: body.effective_to
                  ? new Date(body.effective_to)
                  : null,
                current_salary: decimal(
                  body.current_salary
                ),
                status: "ACTIVE",
                created_by: mutation.context.user.id,
                updated_by: mutation.context.user.id,
              },
            }
          );
        await prisma.hr_salary_history.create({
          data: {
            school_id: schoolId,
            academic_year_id: academicYearId,
            staff_id: asInt(body.staff_id),
            salary_structure_id: asInt(
              body.salary_structure_id
            ),
            old_salary: decimal(body.old_salary),
            new_salary: decimal(
              body.current_salary
            ),
            change_reason:
              body.change_reason || "New assignment",
            revised_by: mutation.context.user.id,
          },
        });
        return NextResponse.json(assignment);
      }

      if (action === "generate-run") {
        const staff =
          await prisma.hr_staff_master.findMany({
            where: {
              school_id: schoolId ?? undefined,
              is_active: true,
            },
          });
        const assignments =
          await prisma.hr_salary_assignments.findMany({
            where: {
              school_id: schoolId ?? undefined,
              academic_year_id:
                academicYearId ?? undefined,
              status: "ACTIVE",
            },
          });
        const byStaff = new Map(
          assignments.map((row) => [row.staff_id || 0, row])
        );
        let gross = 0;
        let deductions = 0;
        let slips = 0;
        for (const row of staff) {
          const assignment = byStaff.get(row.id);
          if (!assignment) {
            continue;
          }
          const salary = Number(
            assignment.current_salary || 0
          );
          gross += salary;
          const lopAmount = await prisma.hr_lop_entries.aggregate(
            {
              _sum: {
                amount: true,
              },
              where: {
                school_id: schoolId ?? undefined,
                academic_year_id:
                  academicYearId ?? undefined,
                staff_id: row.id,
                status: "GENERATED",
              },
            }
          );
          const lop =
            Number(lopAmount._sum.amount || 0);
          deductions += lop;
          await prisma.hr_pay_slips.create({
            data: {
              school_id: schoolId,
              academic_year_id: academicYearId,
              payroll_month: asInt(
                body.payroll_month
              ) || new Date().getMonth() + 1,
              payroll_year: asInt(
                body.payroll_year
              ) || new Date().getFullYear(),
              payroll_run_id: null,
              staff_id: row.id,
              gross_salary: salary,
              total_deductions: lop,
              net_salary: Math.max(
                0,
                salary - lop
              ),
              status: "GENERATED",
              created_by: mutation.context.user.id,
            },
          });
          slips += 1;
        }

        const run =
          await prisma.hr_payroll_runs.create({
            data: {
              school_id: schoolId,
              academic_year_id: academicYearId,
              payroll_month: asInt(
                body.payroll_month
              ) || new Date().getMonth() + 1,
              payroll_year: asInt(
                body.payroll_year
              ) || new Date().getFullYear(),
              total_staff: staff.length,
              total_gross: gross,
              total_deductions: deductions,
              total_net: gross - deductions,
              status: "GENERATED",
              generated_by: mutation.context.user.id,
            },
          });

        await prisma.hr_pay_slips.updateMany({
          where: {
            school_id: schoolId ?? undefined,
            academic_year_id:
              academicYearId ?? undefined,
            payroll_month: asInt(
              body.payroll_month
            ) || new Date().getMonth() + 1,
            payroll_year: asInt(
              body.payroll_year
            ) || new Date().getFullYear(),
            payroll_run_id: null,
          },
          data: {
            payroll_run_id: run.id,
          },
        });

        return NextResponse.json({
          run,
          slips,
        });
      }

      if (action === "approve-run") {
        const id = asInt(body.id);
        if (!id) {
          return validationError(
            "Select a payroll run."
          );
        }
        const run =
          await prisma.hr_payroll_runs.update({
            where: {
              id,
            },
            data: {
              status: "APPROVED",
              approved_by: mutation.context.user.id,
              approved_at: new Date(),
              updated_at: new Date(),
            },
          });
        return NextResponse.json(run);
      }
    }

    if (moduleKey === "increments") {
      if (action === "create-request") {
        const currentSalary =
          decimal(body.current_salary) || 0;
        const requestedPercentage =
          decimal(body.requested_percentage) || 0;
        const requestedAmount =
          decimal(body.requested_amount) ||
          (currentSalary * requestedPercentage) / 100;
        const requestedSalary =
          decimal(body.requested_salary) ||
          currentSalary + requestedAmount;

        const row =
          await prisma.hr_increment_requests.create(
            {
              data: {
                school_id: schoolId,
                academic_year_id: academicYearId,
                staff_id: asInt(body.staff_id),
                current_salary: currentSalary,
                requested_salary: requestedSalary,
                requested_percentage:
                  requestedPercentage,
                requested_amount: requestedAmount,
                reason: body.reason || null,
                status: "PENDING",
                requested_by: mutation.context.user.id,
              },
            }
          );
        return NextResponse.json(row);
      }

      if (
        action === "approve-request" ||
        action === "reject-request"
      ) {
        const id = asInt(body.id);
        if (!id) {
          return validationError(
            "Select an increment request."
          );
        }
        const finalSalary =
          action === "approve-request"
            ? decimal(body.final_salary) ||
              decimal(body.requested_salary)
            : undefined;
        const row =
          await prisma.hr_increment_requests.update(
            {
              where: { id },
              data: {
                status:
                  action === "approve-request"
                    ? "APPROVED"
                    : "REJECTED",
                owner_adjustment_percentage: decimal(
                  body.owner_adjustment_percentage
                ),
                owner_adjustment_amount: decimal(
                  body.owner_adjustment_amount
                ),
                final_salary: finalSalary,
                approved_by:
                  action === "approve-request"
                    ? mutation.context.user.id
                    : undefined,
                approved_at:
                  action === "approve-request"
                    ? new Date()
                    : undefined,
              },
            }
          );
        if (action === "approve-request") {
          await prisma.hr_salary_history.create({
            data: {
              school_id: schoolId,
              academic_year_id: academicYearId,
              staff_id: row.staff_id,
              old_salary: row.current_salary,
              new_salary: row.final_salary,
              change_reason:
                body.reason || "Increment approved",
              revised_by: mutation.context.user.id,
            },
          });
        }
        return NextResponse.json(row);
      }
    }

    if (moduleKey === "payslips") {
      if (action === "generate") {
        const runId = asInt(body.payroll_run_id);
        const run = runId
          ? await prisma.hr_payroll_runs.findUnique({
              where: { id: runId },
            })
          : null;
        if (!run) {
          return validationError(
            "Select a payroll run to generate slips."
          );
        }
        const slips =
          await prisma.hr_pay_slips.findMany({
            where: {
              payroll_run_id: run.id,
            },
            orderBy: {
              id: "desc",
            },
          });
        return NextResponse.json({
          run,
          slips,
        });
      }
    }

    if (moduleKey === "approvals") {
      const approvalModule =
        String(body.module_key || "").trim();
      const approvalId = asInt(body.id);
      if (!approvalModule || !approvalId) {
        return validationError(
          "Select an approval item."
        );
      }
      const isReject =
        ["reject", "reject-request"].includes(
          String(action).toLowerCase()
        );
      if (approvalModule === "leave-management") {
        const updated =
          await prisma.hr_leave_requests.update({
            where: { id: approvalId },
            data: {
              status:
                isReject
                  ? "REJECTED"
                  : "APPROVED",
              approved_by: mutation.context.user.id,
              approved_at: new Date(),
              rejection_reason:
                action === "reject"
                  ? body.rejection_reason || null
                  : null,
            },
          });
        return NextResponse.json(updated);
      }
      if (approvalModule === "increments") {
        const updated =
          await prisma.hr_increment_requests.update({
            where: { id: approvalId },
            data: {
              status:
                isReject
                  ? "REJECTED"
                  : "APPROVED",
              approved_by: mutation.context.user.id,
              approved_at: new Date(),
            },
          });
        return NextResponse.json(updated);
      }
      if (approvalModule === "payroll") {
        const updated =
          await prisma.hr_payroll_runs.update({
            where: { id: approvalId },
            data: {
              status:
                isReject
                  ? "REJECTED"
                  : "APPROVED",
              approved_by: mutation.context.user.id,
              approved_at: new Date(),
            },
          });
        return NextResponse.json(updated);
      }
    }

    return validationError(
      `Unsupported HR module action: ${moduleKey}`
    );
  } catch (error) {
    console.error("HRMS POST failed", error);
    return apiError(error, "Failed to save HR record");
  }
}
