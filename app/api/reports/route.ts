import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { resolvePlatformContext } from "@/lib/api/context";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

type Row = Record<string, unknown>;

const numberValue = (
  value: unknown
) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const percent = (
  numerator: number,
  denominator: number
) =>
  denominator > 0
    ? Math.round(
        (numerator / denominator) * 100
      )
    : 0;

export async function GET(
  request: Request
) {
  const moduleGuard =
    await requireSchoolModule("REPORTS");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth =
    await requirePermission({
      module: "reports",
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
  const where =
    schoolId
      ? {
          OR: [
            {
              school_id: schoolId,
            },
            {
              school_id: null,
            },
          ],
        }
      : {};

  const [
    exports,
    studentRows,
    teacherRows,
    attendanceRows,
    invoiceRows,
    paymentRows,
    feeCategoryRows,
    academicRows,
    eventRows,
    diningRows,
    counts,
  ] = await Promise.all([
    prisma.report_exports.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    }),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        s.id,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        s.enrollment_number,
        s.phone,
        c.class_name,
        sec.section_name,
        ay.academic_year,
        s.created_at
      FROM students s
      LEFT JOIN classes c ON c.id = s.current_class_id
      LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id)
      LEFT JOIN academic_years ay ON ay.id = s.academic_year_id
      WHERE ($1::int IS NULL OR s.school_id = $1::int)
        AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)
      ORDER BY s.created_at DESC NULLS LAST, s.id DESC
      LIMIT 40
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        t.id,
        TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name,
        t.employee_id,
        t.department,
        t.designation,
        t.phone,
        t.email,
        ay.academic_year,
        t.created_at
      FROM teachers t
      LEFT JOIN academic_years ay ON ay.id = t.academic_year_id
      WHERE ($1::int IS NULL OR t.school_id = $1::int)
        AND ($2::int IS NULL OR t.academic_year_id = $2::int OR t.academic_year_id IS NULL)
      ORDER BY t.created_at DESC NULLS LAST, t.id DESC
      LIMIT 40
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        am.id,
        am.attendance_date,
        am.status,
        am.remarks,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name
      FROM attendance_master am
      LEFT JOIN students s ON s.id = am.student_id
      LEFT JOIN classes c ON c.id = am.class_id
      LEFT JOIN sections sec ON sec.id = am.section_id
      WHERE ($1::int IS NULL OR COALESCE(am.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR am.academic_year_id = $2::int OR am.academic_year_id IS NULL)
      ORDER BY am.attendance_date DESC NULLS LAST, am.id DESC
      LIMIT 80
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        i.id,
        i.invoice_number,
        i.invoice_date,
        i.due_date,
        i.total_amount,
        i.paid_amount,
        i.balance_amount,
        i.status,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      WHERE ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
      ORDER BY i.created_at DESC NULLS LAST, i.id DESC
      LIMIT 80
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        p.id,
        p.receipt_number,
        p.payment_date,
        p.payment_method,
        p.amount,
        p.reference_number,
        i.invoice_number,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        c.class_name,
        sec.section_name
      FROM payments p
      LEFT JOIN invoices i ON i.id = p.invoice_id
      LEFT JOIN students s ON s.id = p.student_id
      LEFT JOIN classes c ON c.id = p.class_id
      LEFT JOIN sections sec ON sec.id = p.section_id
      WHERE ($1::int IS NULL OR COALESCE(p.school_id, i.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
      ORDER BY p.created_at DESC NULLS LAST, p.id DESC
      LIMIT 60
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        fc.id,
        fc.fee_name,
        fc.fee_code,
        fc.amount,
        fc.frequency,
        c.class_name,
        sec.section_name,
        fc.is_active,
        fc.created_at
      FROM fee_categories fc
      LEFT JOIN classes c ON c.id = fc.class_id
      LEFT JOIN sections sec ON sec.id = fc.section_id
      WHERE ($1::int IS NULL OR fc.school_id = $1::int OR fc.school_id IS NULL)
        AND ($2::int IS NULL OR fc.academic_year_id = $2::int OR fc.academic_year_id IS NULL)
      ORDER BY fc.created_at DESC NULLS LAST, fc.id DESC
      LIMIT 60
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT 'Exam Schedules' AS record_type, COUNT(*)::int AS total
      FROM exam_schedule es
      WHERE ($1::int IS NULL OR es.school_id = $1::int)
        AND ($2::int IS NULL OR es.academic_year_id = $2::int OR es.academic_year_id IS NULL)
      UNION ALL
      SELECT 'Question Papers' AS record_type, COUNT(*)::int AS total
      FROM question_papers qp
      WHERE ($1::int IS NULL OR qp.school_id = $1::int)
        AND ($2::int IS NULL OR qp.academic_year_id = $2::int OR qp.academic_year_id IS NULL)
      UNION ALL
      SELECT 'Marks Entries' AS record_type, COUNT(*)::int AS total
      FROM student_marks_entry sme
      WHERE ($1::int IS NULL OR sme.school_id = $1::int)
        AND ($2::int IS NULL OR sme.academic_year_id = $2::int OR sme.academic_year_id IS NULL)
      UNION ALL
      SELECT 'Homework' AS record_type, COUNT(*)::int AS total
      FROM homework_assignments ha
      WHERE ($1::int IS NULL OR ha.school_id = $1::int)
        AND ($2::int IS NULL OR ha.academic_year_id = $2::int OR ha.academic_year_id IS NULL)
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        id,
        module_name,
        event_type,
        action,
        entity_type,
        entity_id,
        severity,
        summary,
        occurred_at
      FROM event_ledger
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      ORDER BY occurred_at DESC NULLS LAST, id DESC
      LIMIT 80
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        da.id,
        da.attendance_date,
        da.meal_type,
        da.status,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        c.class_name,
        sec.section_name
      FROM dining_attendance da
      LEFT JOIN students s ON s.id = da.student_id
      LEFT JOIN classes c ON c.id = da.class_id
      LEFT JOIN sections sec ON sec.id = da.section_id
      WHERE ($1::int IS NULL OR COALESCE(da.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR da.academic_year_id = $2::int OR da.academic_year_id IS NULL)
      ORDER BY da.attendance_date DESC NULLS LAST, da.id DESC
      LIMIT 60
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM students s WHERE ($1::int IS NULL OR s.school_id = $1::int) AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)) AS students,
        (SELECT COUNT(*)::int FROM teachers t WHERE ($1::int IS NULL OR t.school_id = $1::int) AND ($2::int IS NULL OR t.academic_year_id = $2::int OR t.academic_year_id IS NULL)) AS teachers,
        (SELECT COUNT(*)::int FROM classes c WHERE ($1::int IS NULL OR c.school_id = $1::int) AND ($2::int IS NULL OR c.academic_year_id = $2::int OR c.academic_year_id IS NULL)) AS classes,
        (SELECT COUNT(*)::int FROM sections sec WHERE ($1::int IS NULL OR sec.school_id = $1::int) AND ($2::int IS NULL OR sec.academic_year_id = $2::int OR sec.academic_year_id IS NULL)) AS sections,
        (SELECT COUNT(*)::int FROM attendance_master am WHERE ($1::int IS NULL OR am.school_id = $1::int) AND ($2::int IS NULL OR am.academic_year_id = $2::int OR am.academic_year_id IS NULL)) AS attendance,
        (SELECT COUNT(*)::int FROM invoices i WHERE ($1::int IS NULL OR i.school_id = $1::int) AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)) AS invoices,
        (SELECT COALESCE(SUM(i.total_amount),0)::numeric FROM invoices i WHERE ($1::int IS NULL OR i.school_id = $1::int) AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)) AS total_fees,
        (SELECT COALESCE(SUM(i.paid_amount),0)::numeric FROM invoices i WHERE ($1::int IS NULL OR i.school_id = $1::int) AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)) AS collected_fees,
        (SELECT COALESCE(SUM(i.balance_amount),0)::numeric FROM invoices i WHERE ($1::int IS NULL OR i.school_id = $1::int) AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)) AS pending_fees,
        (SELECT COUNT(*)::int FROM event_ledger el WHERE ($1::int IS NULL OR el.school_id = $1::int) AND ($2::int IS NULL OR el.academic_year_id = $2::int OR el.academic_year_id IS NULL)) AS events,
        (SELECT COUNT(*)::int FROM dining_attendance da WHERE ($1::int IS NULL OR da.school_id = $1::int) AND ($2::int IS NULL OR da.academic_year_id = $2::int OR da.academic_year_id IS NULL)) AS dining_attendance
      `,
      schoolId,
      academicYearId
    ),
  ]);
  const summary =
    counts[0] || {};
  const totalFees = numberValue(
    summary.total_fees
  );
  const collectedFees = numberValue(
    summary.collected_fees
  );
  const pendingFees = numberValue(
    summary.pending_fees
  );
  const attendanceTotal =
    attendanceRows.length;
  const present =
    attendanceRows.filter((row) =>
      String(row.status || "")
        .toUpperCase()
        .includes("PRESENT")
    ).length;
  const absent =
    attendanceRows.filter((row) =>
      String(row.status || "")
        .toUpperCase()
        .includes("ABSENT")
    ).length;

  const reports = [
    {
      key: "principal-daily-command",
      title: "Principal Daily Command",
      metrics: [
        {
          label: "Students",
          value: numberValue(
            summary.students
          ),
        },
        {
          label: "Teachers",
          value: numberValue(
            summary.teachers
          ),
        },
        {
          label: "Collection %",
          value: percent(
            collectedFees,
            totalFees
          ),
        },
        {
          label: "Events",
          value: numberValue(
            summary.events
          ),
        },
      ],
      chart: [
        {
          label: "Students",
          value: numberValue(
            summary.students
          ),
        },
        {
          label: "Teachers",
          value: numberValue(
            summary.teachers
          ),
        },
        {
          label: "Classes",
          value: numberValue(
            summary.classes
          ),
        },
        {
          label: "Sections",
          value: numberValue(
            summary.sections
          ),
        },
      ],
      details: [
        ...studentRows.slice(0, 8),
        ...teacherRows.slice(0, 8),
        ...eventRows.slice(0, 8),
      ],
    },
    {
      key: "attendance-risk-summary",
      title: "Attendance Risk Summary",
      metrics: [
        {
          label: "Records",
          value: numberValue(
            summary.attendance
          ),
        },
        {
          label: "Present",
          value: present,
        },
        {
          label: "Absent",
          value: absent,
        },
        {
          label: "Present %",
          value: percent(
            present,
            attendanceTotal
          ),
        },
      ],
      chart: [
        {
          label: "Present",
          value: present,
        },
        {
          label: "Absent",
          value: absent,
        },
        {
          label: "Other",
          value:
            attendanceTotal -
            present -
            absent,
        },
      ],
      details: attendanceRows,
    },
    {
      key: "finance-collection-summary",
      title: "Finance Collection Summary",
      metrics: [
        {
          label: "Total Fees",
          value: totalFees,
          currency: true,
        },
        {
          label: "Collected",
          value: collectedFees,
          currency: true,
        },
        {
          label: "Pending",
          value: pendingFees,
          currency: true,
        },
        {
          label: "Invoices",
          value: numberValue(
            summary.invoices
          ),
        },
      ],
      chart: [
        {
          label: "Total",
          value: totalFees,
        },
        {
          label: "Collected",
          value: collectedFees,
        },
        {
          label: "Pending",
          value: pendingFees,
        },
      ],
      details: [
        ...invoiceRows,
        ...paymentRows.slice(0, 30),
        ...feeCategoryRows.slice(0, 20),
      ],
    },
    {
      key: "academic-performance-summary",
      title: "Academic Performance Summary",
      metrics: academicRows.map(
        (row) => ({
          label: String(
            row.record_type || "Record"
          ),
          value: numberValue(row.total),
        })
      ),
      chart: academicRows.map(
        (row) => ({
          label: String(
            row.record_type || "Record"
          ),
          value: numberValue(row.total),
        })
      ),
      details: academicRows,
    },
    {
      key: "operations-audit-summary",
      title: "Operations Audit Summary",
      metrics: [
        {
          label: "Ledger Events",
          value: numberValue(
            summary.events
          ),
        },
        {
          label: "Dining Attendance",
          value: numberValue(
            summary.dining_attendance
          ),
        },
        {
          label: "Recent Events",
          value: eventRows.length,
        },
      ],
      chart: [
        {
          label: "Events",
          value: numberValue(
            summary.events
          ),
        },
        {
          label: "Dining",
          value: numberValue(
            summary.dining_attendance
          ),
        },
      ],
      details: [
        ...eventRows,
        ...diningRows,
      ],
    },
    {
      key: "student-360-summary",
      title: "Student 360 Summary",
      metrics: [
        {
          label: "Students",
          value: numberValue(
            summary.students
          ),
        },
        {
          label: "Attendance Records",
          value: numberValue(
            summary.attendance
          ),
        },
        {
          label: "Invoices",
          value: numberValue(
            summary.invoices
          ),
        },
        {
          label: "Dining Records",
          value: numberValue(
            summary.dining_attendance
          ),
        },
      ],
      chart: [
        {
          label: "Attendance",
          value: numberValue(
            summary.attendance
          ),
        },
        {
          label: "Invoices",
          value: numberValue(
            summary.invoices
          ),
        },
        {
          label: "Dining",
          value: numberValue(
            summary.dining_attendance
          ),
        },
      ],
      details: [
        ...studentRows,
        ...attendanceRows.slice(0, 30),
        ...invoiceRows.slice(0, 30),
        ...diningRows.slice(0, 30),
      ],
    },
  ];

  return NextResponse.json({
    exports,
    summary: {
      students: numberValue(
        summary.students
      ),
      teachers: numberValue(
        summary.teachers
      ),
      classes: numberValue(
        summary.classes
      ),
      sections: numberValue(
        summary.sections
      ),
      attendance: numberValue(
        summary.attendance
      ),
      invoices: numberValue(
        summary.invoices
      ),
      totalFees,
      collectedFees,
      pendingFees,
      events: numberValue(
        summary.events
      ),
      diningAttendance: numberValue(
        summary.dining_attendance
      ),
      collectionHealth: percent(
        collectedFees,
        totalFees
      ),
    },
    datasets: {
      students: studentRows,
      teachers: teacherRows,
      attendance: attendanceRows,
      invoices: invoiceRows,
      payments: paymentRows,
      feeCategories:
        feeCategoryRows,
      academics: academicRows,
      events: eventRows,
      dining: diningRows,
    },
    reports,
  });
}

export async function POST(
  request: Request
) {
  const moduleGuard =
    await requireSchoolModule("REPORTS");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

  const auth =
    await requirePermission({
      module: "reports",
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

  const body =
    await request.json();
  const filters =
    body.filters &&
    typeof body.filters === "object"
      ? body.filters
      : {};
  const exportRecord =
    await prisma.report_exports.create({
      data: {
        school_id:
          context.schoolId ??
          auth.user?.school_id ??
          null,
        report_key:
          String(
            body.report_key ??
              "custom-report"
          ),
        format:
          body.format ?? "json",
        status: "READY",
        filter_json:
          {
            ...filters,
            active_school_id:
              context.schoolId,
            active_academic_year_id:
              context.academicYearId,
          },
        created_by:
          auth.user?.id ?? null,
      },
    });

  return NextResponse.json({
    export: exportRecord,
  });
}
