import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import { resolvePlatformContext } from "@/lib/api/context";
import { notifyInvoiceCreated } from "@/lib/notifications/whatsapp";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

type Row = Record<string, unknown>;

const numberArray = (
  value: unknown
) =>
  Array.isArray(value)
    ? value
        .map((item) => Number(item))
        .filter((item) =>
          Number.isFinite(item)
        )
    : [];

const toNumber = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const endOfMonth = (
  base: Date,
  offset: number
) =>
  new Date(
    base.getFullYear(),
    base.getMonth() + offset + 1,
    0
  );

const splitAmount = (
  total: number,
  count: number
) => {
  const safeCount = Math.max(
    1,
    count
  );
  const part =
    Math.floor(
      (total / safeCount) * 100
    ) / 100;
  const amounts = Array.from(
    {
      length: safeCount,
    },
    () => part
  );
  const used = part * safeCount;
  amounts[safeCount - 1] =
    Math.round(
      (amounts[safeCount - 1] +
        (total - used)) *
        100
    ) / 100;
  return amounts;
};

const startOfLocalDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

export async function GET(
  request: Request
) {
  const moduleGuard =
    await requireSchoolModule("FINANCE");
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
  const [invoices, summary] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          i.*,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
          s.admission_number,
          c.class_name,
          sec.section_name,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', ili.id,
                'fee_category_id', ili.fee_category_id,
                'fee_name', ili.fee_name,
                'amount', ili.amount
              )
            ) FILTER (WHERE ili.id IS NOT NULL),
            '[]'::json
          ) AS line_items,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', ii.id,
                'part_number', ii.part_number,
                'part_label', ii.part_label,
                'due_date', ii.due_date,
                'amount', ii.amount,
                'paid_amount', ii.paid_amount,
                'balance_amount', ii.balance_amount,
                'status', ii.status
              )
            ) FILTER (WHERE ii.id IS NOT NULL),
            '[]'::json
          ) AS installments
        FROM invoices i
        LEFT JOIN students s ON s.id = i.student_id
        LEFT JOIN classes c ON c.id = i.class_id
        LEFT JOIN sections sec ON sec.id = i.section_id
        LEFT JOIN invoice_line_items ili ON ili.invoice_id = i.id
        LEFT JOIN invoice_installments ii ON ii.invoice_id = i.id
        WHERE ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
          AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
        GROUP BY i.id, s.name, s.first_name, s.last_name, s.admission_number, c.class_name, sec.section_name
        ORDER BY i.created_at DESC
        LIMIT 300
        `,
        schoolId,
        academicYearId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT COUNT(i.id)::int AS invoice_count,
               COALESCE(SUM(i.total_amount), 0)::numeric AS total_amount,
               COALESCE(SUM(i.paid_amount), 0)::numeric AS paid_amount,
               COALESCE(SUM(i.balance_amount), 0)::numeric AS balance_amount
        FROM invoices i
        LEFT JOIN students s ON s.id = i.student_id
        WHERE ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
          AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
        `,
        schoolId,
        academicYearId
      ),
    ]);

  return NextResponse.json({
    invoices,
    summary: Array.isArray(summary)
      ? summary[0]
      : summary,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "fees",
      action: "create",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const context =
    await resolvePlatformContext(
      request
    );
  const schoolId =
    auth.user?.role === "SUPER_ADMIN"
      ? toNumber(body.school_id) ??
        context?.schoolId ??
        auth.user?.school_id ??
        null
      : context?.schoolId ??
        auth.user?.school_id ??
        null;

  if (!schoolId) {
    return NextResponse.json(
      {
        error:
          "Select a school before generating invoices.",
      },
      {
        status: 400,
      }
    );
  }

  const classId = toNumber(
    body.class_id
  );
  const sectionId = toNumber(
    body.section_id
  );
  const selectedStudentIds =
    numberArray(
      body.student_ids ??
        body.studentIds
    ).slice(0, 300);
  const feeCategoryIds =
    numberArray(
      body.fee_category_ids ??
        body.feeCategoryIds
    );
  const scope = String(
    body.billing_scope ||
      body.student_scope ||
      "STUDENT"
  ).toUpperCase();

  let studentIds =
    selectedStudentIds;

  if (
    scope === "CLASS_SECTION" ||
    scope === "CLASS"
  ) {
    if (!classId) {
      return NextResponse.json(
        {
          error:
            "Select a class before generating class or section invoices.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await prisma.$queryRawUnsafe<
        { id: number }[]
      >(
        `
        SELECT DISTINCT s.id
        FROM students s
        LEFT JOIN student_year_enrollments sye ON sye.student_id = s.id
        WHERE ($1::int IS NULL OR s.school_id = $1::int)
          AND COALESCE(s.current_class_id, sye.class_id) = $2::int
          AND ($3::int IS NULL OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $3::int)
        ORDER BY s.id ASC
        LIMIT 500
        `,
        schoolId,
        classId,
        sectionId
      );
    studentIds = rows.map((row) =>
      Number(row.id)
    );
  }

  if (!studentIds.length) {
    return NextResponse.json(
      {
        error:
          "Select at least one student, or choose a class/section with active students.",
      },
      {
        status: 400,
      }
    );
  }

  if (!feeCategoryIds.length) {
    return NextResponse.json(
      {
        error:
          "Select at least one fee structure.",
      },
      {
        status: 400,
      }
    );
  }

  const selectedAcademicYearId =
    toNumber(body.academic_year_id) ??
    context?.academicYearId ??
    null;
  const currentYear =
    selectedAcademicYearId
      ? await prisma.academic_years.findFirst({
          where: {
            id: selectedAcademicYearId,
            OR: [
              {
                school_id: schoolId,
              },
              {
                school_id: null,
              },
            ],
          },
        })
      : await prisma.academic_years.findFirst({
          where: {
            is_current: true,
            OR: [
              {
                school_id: schoolId,
              },
              {
                school_id: null,
              },
            ],
          },
          orderBy: {
            id: "desc",
          },
        });

  if (!currentYear?.id) {
    return NextResponse.json(
      {
        error:
          "Select an academic year before generating invoices.",
      },
      {
        status: 400,
      }
    );
  }

  const categories =
    await prisma.fee_categories.findMany({
      where: {
        id: {
          in: feeCategoryIds,
        },
        is_active: true,
        ...(schoolId
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
          : {}),
      },
    });

  if (!categories.length) {
    return NextResponse.json(
      {
        error:
          "No active fee structures found.",
      },
      {
        status: 400,
      }
    );
  }

  const amount =
    categories.reduce(
      (sum, category) =>
        sum +
        Number(category.amount ?? 0),
      0
    );

  if (amount <= 0) {
    return NextResponse.json(
      {
        error:
          "Selected fee structures have no billable amount.",
      },
      {
        status: 400,
      }
    );
  }

  const dueDate = body.due_date
    ? new Date(body.due_date)
    : new Date(
        Date.now() +
          14 * 24 * 60 * 60 * 1000
      );
  const invoiceDate =
    body.invoice_date
      ? new Date(body.invoice_date)
      : new Date();

  if (
    Number.isNaN(dueDate.getTime()) ||
    startOfLocalDay(dueDate) <
      startOfLocalDay(new Date())
  ) {
    return NextResponse.json(
      {
        error:
          "Invoice due date must be today or a future date.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    startOfLocalDay(dueDate) <
    startOfLocalDay(invoiceDate)
  ) {
    return NextResponse.json(
      {
        error:
          "Invoice due date cannot be earlier than invoice date.",
      },
      {
        status: 400,
      }
    );
  }
  const installmentMode =
    String(
      body.installment_mode ||
        body.billing_period ||
        "SINGLE"
    ).toUpperCase();
  const installmentCount =
    installmentMode === "SINGLE"
      ? 1
      : Math.max(
          1,
          Math.min(
            12,
            Number(
              body.installment_count ||
                (installmentMode ===
                "QUARTERLY"
                  ? 3
                  : 3)
            ) || 3
          )
        );
  const installmentAmounts =
    splitAmount(
      amount,
      installmentCount
    );
  const created: Row[] = [];

  for (const [
    index,
    studentId,
  ] of studentIds.entries()) {
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
        studentId,
        schoolId,
        currentYear?.id ?? null
      );
    const student =
      studentRows[0];

    if (!student) {
      continue;
    }

    const invoiceClassId =
      classId ||
      Number(student.class_id) ||
      null;
    const invoiceSectionId =
      sectionId ||
      Number(student.section_id) ||
      null;
    const invoiceNumber = `INV-${Date.now()}-${studentId}-${index + 1}`;
    const invoiceRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        INSERT INTO invoices (
          invoice_number,
          school_id,
          academic_year_id,
          class_id,
          section_id,
          student_id,
          invoice_date,
          due_date,
          total_amount,
          paid_amount,
          balance_amount,
          status,
          billing_scope,
          billing_period,
          installment_count,
          source,
          metadata,
          created_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,$9,'PENDING',$10,$11,$12,'web',$13::jsonb,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING *
        `,
        invoiceNumber,
        Number(student.school_id) ||
          schoolId,
        currentYear?.id ?? null,
        invoiceClassId,
        invoiceSectionId,
        studentId,
        invoiceDate,
        dueDate,
        amount,
        scope,
        installmentMode,
        installmentCount,
        JSON.stringify({
          fee_category_ids:
            feeCategoryIds,
        }),
        auth.user?.id ?? null
      );
    const invoice =
      invoiceRows[0];

    if (!invoice?.id) {
      continue;
    }

    for (const category of categories) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO invoice_line_items (
          invoice_id,
          fee_category_id,
          fee_name,
          amount,
          metadata,
          created_at
        )
        VALUES ($1,$2,$3,$4,$5::jsonb,CURRENT_TIMESTAMP)
        `,
        Number(invoice.id),
        category.id,
        category.fee_name,
        Number(category.amount ?? 0),
        JSON.stringify({
          fee_code:
            category.fee_code,
          frequency:
            category.frequency,
        })
      );
    }

    for (
      let partIndex = 0;
      partIndex < installmentCount;
      partIndex++
    ) {
      const partAmount =
        installmentAmounts[partIndex];
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO invoice_installments (
          invoice_id,
          part_number,
          part_label,
          due_date,
          amount,
          paid_amount,
          balance_amount,
          status,
          metadata,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,0,$5,'PENDING',$6::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        `,
        Number(invoice.id),
        partIndex + 1,
        installmentCount === 1
          ? "Full Amount"
          : `Part ${partIndex + 1}`,
        installmentCount === 1
          ? dueDate
          : endOfMonth(
              dueDate,
              partIndex
            ),
        partAmount,
        JSON.stringify({
          installment_mode:
            installmentMode,
        })
      );
    }

    created.push(invoice);

    await recordEvent({
      school_id:
        Number(student.school_id) ||
        schoolId,
      academic_year_id:
        currentYear?.id ?? null,
      user_id: auth.user?.id,
      actor_role:
        auth.user?.role,
      module_name: "finance",
      event_type:
        "INVOICE_GENERATED",
      action: "generate",
      entity_type: "student",
      entity_id: studentId,
      summary:
        "Invoice generated with class/section and fee structure context.",
      payload: {
        invoice_id: invoice.id,
        invoice_number:
          invoice.invoice_number,
        fee_category_ids:
          feeCategoryIds,
        class_id: invoiceClassId,
        section_id:
          invoiceSectionId,
        installment_mode:
          installmentMode,
        installment_count:
          installmentCount,
        amount,
      },
    });

    await notifyInvoiceCreated(
      Number(invoice.id),
      auth.user?.id ?? null
    ).catch((error) => {
      console.error(
        "WhatsApp invoice_created dispatch failed:",
        error instanceof Error
          ? error.message
          : error
      );
    });
  }

  return NextResponse.json(
    {
      invoices: created,
      count: created.length,
      amount,
      installment_mode:
        installmentMode,
      installment_count:
        installmentCount,
      feeCategories:
        categories.map((category) => ({
          id: category.id,
          fee_name:
            category.fee_name,
          amount:
            category.amount,
        })),
    },
    {
      status: 201,
    }
  );
}
