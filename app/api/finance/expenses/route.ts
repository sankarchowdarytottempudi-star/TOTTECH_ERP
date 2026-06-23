import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";
import { isSuperAdminRole } from "@/lib/school-access";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

const DEFAULT_CATEGORIES = [
  ["SALARY", "Salary"],
  ["BUS_FUEL", "Bus Fuel"],
  ["BUS_MAINTENANCE", "Bus Maintenance"],
  ["STATIONERY", "Stationery"],
  ["ELECTRICITY", "Electricity"],
  ["WATER", "Water"],
  ["INTERNET", "Internet"],
  ["LABORATORY", "Laboratory"],
  ["LIBRARY", "Library"],
  ["SPORTS", "Sports"],
  ["FURNITURE", "Furniture"],
  ["EQUIPMENT", "Equipment"],
  ["REPAIRS", "Repairs"],
  ["BUILDING_MAINTENANCE", "Building Maintenance"],
  ["MARKETING", "Marketing"],
  ["EVENTS", "Events"],
  ["EXAM_EXPENSES", "Exam Expenses"],
  ["PRINTING", "Printing"],
  ["SOFTWARE_SUBSCRIPTION", "Software Subscription"],
  ["TRANSPORT", "Transport"],
  ["DINING", "Dining"],
  ["HOSTEL", "Hostel"],
  ["MISCELLANEOUS", "Miscellaneous"],
] as const;

const allowedStatuses = new Set([
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "PAID",
]);

const allowedPaymentModes = new Set([
  "CASH",
  "UPI",
  "CARD",
  "BANK_TRANSFER",
  "CHEQUE",
  "NET_BANKING",
  "INSURANCE",
  "MIXED",
]);

const toInt = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? Math.floor(parsed)
    : null;
};

const toMoney = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? Number(parsed.toFixed(2))
    : null;
};

const normalizeText = (value: unknown) =>
  String(value ?? "").trim();

const normalizeDate = (value: unknown) => {
  const text = normalizeText(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
};

const categoryCode = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const classNameFor = (row: Row) =>
  String(row.class_name || row.className || "-");

const sectionNameFor = (row: Row) =>
  String(row.section_name || row.sectionName || "-");

async function ensureCategorySeed(schoolId: number | null) {
  for (const [code, label] of DEFAULT_CATEGORIES) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
      SELECT NULL, $1, $2, 'DEFAULT', FALSE, TRUE
      WHERE NOT EXISTS (
        SELECT 1 FROM expense_categories
        WHERE school_id IS NULL AND category_code = $1
      )
      `,
      code,
      label
    );
  }

  if (schoolId) {
    const schoolSpecificCategories = DEFAULT_CATEGORIES.filter(([code]) =>
      code !== "MISCELLANEOUS"
    );
    for (const [code, label] of schoolSpecificCategories) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
        SELECT $1, $2, $3, 'SCHOOL', FALSE, TRUE
        WHERE NOT EXISTS (
          SELECT 1 FROM expense_categories
          WHERE school_id = $1 AND category_code = $2
        )
        `,
        schoolId,
        code,
        label
      );
    }
  }
}

async function resolveExpenseFilters(
  request: Request,
  context: Awaited<ReturnType<typeof resolvePlatformContext>>
) {
  const url = new URL(request.url);
  const schoolId = context?.allSchools
    ? toInt(url.searchParams?.get("school_id"))
    : context?.schoolId ?? null;
  const academicYearId = context?.allYears
    ? toInt(url.searchParams?.get("academic_year_id"))
    : context?.academicYearId ?? null;
  return {
    schoolId,
    academicYearId,
    classId: toInt(url.searchParams?.get("class_id")),
    sectionId: toInt(url.searchParams?.get("section_id")),
    status: normalizeText(url.searchParams?.get("status")).toUpperCase() || null,
    category: normalizeText(url.searchParams?.get("category")).toUpperCase() || null,
    createdBy: toInt(url.searchParams?.get("created_by")),
    from: normalizeDate(url.searchParams?.get("from")),
    to: normalizeDate(url.searchParams?.get("to")),
    q: normalizeText(url.searchParams?.get("q")),
  };
}

async function recordExpenseLedger(input: {
  schoolId: number;
  academicYearId: number | null;
  expenseId: number;
  eventType: string;
  actorUserId: number | null;
  actorRole: string | null;
  summary: string;
  payload: unknown;
}) {
  await prisma.$executeRawUnsafe(
    `
    INSERT INTO school_expense_events (
      school_id, academic_year_id, expense_id, event_type,
      actor_user_id, actor_role, summary, payload, created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,CURRENT_TIMESTAMP)
    `,
    input.schoolId,
    input.academicYearId,
    input.expenseId,
    input.eventType,
    input.actorUserId,
    input.actorRole,
    input.summary,
    JSON.stringify(input.payload || {})
  );
}

async function uploadAttachment(file: File | null) {
  if (!file) return null;
  const allowedTypes = new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ]);
  if (!allowedTypes.has(file.type)) {
    throw new Error("Attachment must be PDF, JPG, PNG, or WEBP.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Attachment must be 8 MB or smaller.");
  }
  const uploadDir = path.join(process.cwd(), "public", "uploads", "finance", "expenses");
  await mkdir(uploadDir, { recursive: true });
  const ext = file.type === "application/pdf" ? ".pdf" : file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
  const fileName = `expense-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const destination = path.join(uploadDir, fileName);
  await writeFile(destination, Buffer.from(await file.arrayBuffer()));
  return {
    attachment_url: `/uploads/finance/expenses/${fileName}`,
    attachment_name: file.name,
  };
}

async function readBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    return {
      school_id: form.get("school_id"),
      academic_year_id: form.get("academic_year_id"),
      class_id: form.get("class_id"),
      section_id: form.get("section_id"),
      category: form.get("category"),
      custom_category: form.get("custom_category"),
      expense_date: form.get("expense_date"),
      vendor_name: form.get("vendor_name"),
      description: form.get("description"),
      amount: form.get("amount"),
      payment_method: form.get("payment_method"),
      reference_number: form.get("reference_number"),
      status: form.get("status"),
      created_by: form.get("created_by"),
      attachment: form.get("attachment"),
    } as Record<string, unknown> & { attachment?: File | null };
  }
  return await request.json();
}

export async function GET(request: Request) {
  const guard = await requireSchoolModule("FINANCE");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filters = await resolveExpenseFilters(request, context);
  await ensureCategorySeed(filters.schoolId ?? context.schoolId);

  const scopeSchool = context.allSchools ? filters.schoolId : context.schoolId;
  const scopeAcademicYear = context.allYears ? filters.academicYearId : context.academicYearId;
  const wherePieces = [
    scopeSchool ? `e.school_id = ${scopeSchool}` : "TRUE",
    scopeAcademicYear ? `COALESCE(e.academic_year_id, 0) = ${scopeAcademicYear}` : "TRUE",
    filters.classId ? `e.class_id = ${filters.classId}` : "TRUE",
    filters.sectionId ? `e.section_id = ${filters.sectionId}` : "TRUE",
    filters.status ? `UPPER(COALESCE(e.status, '')) = '${filters.status.replace(/'/g, "''")}'` : "TRUE",
    filters.category ? `UPPER(COALESCE(e.category, '')) = '${filters.category.replace(/'/g, "''")}'` : "TRUE",
    filters.createdBy ? `e.created_by = ${filters.createdBy}` : "TRUE",
    filters.from ? `e.expense_date >= '${filters.from.toISOString().slice(0, 10)}'` : "TRUE",
    filters.to ? `e.expense_date <= '${filters.to.toISOString().slice(0, 10)}'` : "TRUE",
    "COALESCE(e.voucher_number, '') = ''",
    filters.q
      ? `(COALESCE(e.vendor_name, '') ILIKE '%${filters.q.replace(/'/g, "''")}%' OR COALESCE(e.description, '') ILIKE '%${filters.q.replace(/'/g, "''")}%' OR COALESCE(e.reference_number, '') ILIKE '%${filters.q.replace(/'/g, "''")}%' )`
      : "TRUE",
  ];
  const whereSql = wherePieces.join(" AND ");
  const schoolScopeSql = scopeSchool ? `WHERE id = ${scopeSchool}` : "";
  const academicScopeSql = scopeAcademicYear ? `WHERE id = ${scopeAcademicYear}` : "";
  const classScopeSql = scopeSchool ? `WHERE school_id = ${scopeSchool}` : "";

  const [
    expenses,
    summary,
    monthly,
    byCategory,
    bySchool,
    byAcademicYear,
    byClass,
    bySection,
    schools,
    academicYears,
    classes,
    sections,
    createdByUsers,
    categoryRows,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        e.*,
        s.school_name,
        s.school_code,
        ay.academic_year,
        c.class_name,
        sec.section_name,
        creator.full_name AS created_by_name,
        approver.full_name AS approved_by_name,
        rejecter.full_name AS rejected_by_name,
        payer.full_name AS paid_by_name
      FROM school_expenses e
      LEFT JOIN schools s ON s.id = e.school_id
      LEFT JOIN academic_years ay ON ay.id = e.academic_year_id
      LEFT JOIN classes c ON c.id = e.class_id
      LEFT JOIN sections sec ON sec.id = e.section_id
      LEFT JOIN users creator ON creator.id = e.created_by
      LEFT JOIN users approver ON approver.id = e.approved_by
      LEFT JOIN users rejecter ON rejecter.id = e.rejected_by
      LEFT JOIN users payer ON payer.id = e.paid_by
      WHERE ${whereSql}
      ORDER BY e.expense_date DESC, e.id DESC
      LIMIT 500
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COUNT(*)::int AS expense_count,
        COALESCE(SUM(e.amount), 0)::numeric AS total_expense,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.status, '')) = 'APPROVED'), 0)::numeric AS approved_expense,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.status, '')) = 'PENDING_APPROVAL'), 0)::numeric AS pending_approval,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.status, '')) = 'REJECTED'), 0)::numeric AS rejected_expense,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.status, '')) = 'PAID'), 0)::numeric AS paid_expense
      FROM school_expenses e
      WHERE ${whereSql}
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        to_char(date_trunc('month', e.expense_date), 'Mon YYYY') AS label,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      WHERE ${whereSql}
      GROUP BY 1
      ORDER BY date_trunc('month', e.expense_date)
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(e.category, 'Uncategorized') AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      WHERE ${whereSql}
      GROUP BY 1
      ORDER BY value DESC
      LIMIT 10
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        s.school_name AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      LEFT JOIN schools s ON s.id = e.school_id
      WHERE ${whereSql}
      GROUP BY s.school_name
      ORDER BY value DESC
      LIMIT 20
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(ay.academic_year, 'Unassigned') AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      LEFT JOIN academic_years ay ON ay.id = e.academic_year_id
      WHERE ${whereSql}
      GROUP BY ay.academic_year
      ORDER BY value DESC
      LIMIT 20
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(c.class_name, 'Entire School') AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      LEFT JOIN classes c ON c.id = e.class_id
      WHERE ${whereSql}
      GROUP BY c.class_name
      ORDER BY value DESC
      LIMIT 20
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(sec.section_name, 'Entire School') AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      LEFT JOIN sections sec ON sec.id = e.section_id
      WHERE ${whereSql}
      GROUP BY sec.section_name
      ORDER BY value DESC
      LIMIT 20
      `
    ),
    prisma.schools.findMany({
      where: context.allSchools
        ? { is_active: true }
        : {
            OR: [
              { id: context.schoolId ?? 0 },
              {
                user_school_access: {
                  some: {
                    user_id: Number(context.user?.id) || 0,
                    is_active: true,
                    is_primary: true,
                  },
                },
              },
            ],
          },
      select: { id: true, school_name: true, school_code: true, logo_url: true },
      orderBy: { school_name: "asc" },
    }),
    prisma.academic_years.findMany({
      where: context.allYears
        ? {}
        : scopeSchool
          ? {
              OR: [
                { school_id: scopeSchool },
                { id: context.academicYearId ?? 0 },
              ],
            }
          : {},
      select: { id: true, academic_year: true },
      orderBy: { academic_year: "desc" },
    }),
    prisma.classes.findMany({
      where: scopeSchool
        ? { school_id: scopeSchool }
        : {},
      select: { id: true, class_name: true, school_id: true },
      orderBy: { class_name: "asc" },
    }),
    prisma.sections.findMany({
      where: scopeSchool
        ? { school_id: scopeSchool }
        : {},
      select: { id: true, section_name: true, class_id: true, school_id: true },
      orderBy: { section_name: "asc" },
    }),
    prisma.users.findMany({
      where: {
        platform_type: "EDUCATIONAL",
        ...(scopeSchool
          ? {
              user_school_access: {
                some: { school_id: scopeSchool, is_active: true },
              },
            }
          : {}),
      },
      select: { id: true, full_name: true, role: true },
      orderBy: { full_name: "asc" },
      take: 200,
    }),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        category_code,
        category_name,
        category_group,
        is_custom
      FROM expense_categories
      WHERE is_active = TRUE
        AND (
          school_id IS NULL
          OR ${scopeSchool ? `school_id = ${scopeSchool}` : "TRUE"}
        )
      ORDER BY
        CASE WHEN school_id IS NULL THEN 0 ELSE 1 END,
        category_name ASC
      `
    ),
  ]);

  const totalExpense = Number(summary[0]?.total_expense || 0);
  const approvedExpense = Number(summary[0]?.approved_expense || 0);
  const pendingApproval = Number(summary[0]?.pending_approval || 0);
  const rejectedExpense = Number(summary[0]?.rejected_expense || 0);
  const paidExpense = Number(summary[0]?.paid_expense || 0);
  const monthlyByMonth = monthly.map((row) => ({
    label: String(row.label || "-"),
    value: Number(row.value || 0),
  }));

  return NextResponse.json({
    context: {
      allSchools: context.allSchools,
      allYears: context.allYears,
      selectedSchool:
        schools.find((school) => school.id === scopeSchool) ?? null,
      selectedAcademicYear:
        academicYears.find((year) => year.id === scopeAcademicYear) ?? null,
      filters: {
        school_id: scopeSchool,
        academic_year_id: scopeAcademicYear,
        class_id: filters.classId,
        section_id: filters.sectionId,
        status: filters.status,
        category: filters.category,
        created_by: filters.createdBy,
        from: filters.from,
        to: filters.to,
        q: filters.q,
      },
    },
    expenses,
    summary: {
      expenseCount: Number(summary[0]?.expense_count || 0),
      totalExpense,
      approvedExpense,
      pendingApproval,
      rejectedExpense,
      paidExpense,
      monthlyExpense: monthlyByMonth.at(-1)?.value || 0,
      yearlyExpense: totalExpense,
    },
    analytics: {
      expenseByMonth: monthlyByMonth,
      expenseByCategory: byCategory.map((row) => ({
        label: String(row.label || "-"),
        value: Number(row.value || 0),
        count: Number(row.count || 0),
      })),
      expenseBySchool: bySchool.map((row) => ({
        label: String(row.label || "-"),
        value: Number(row.value || 0),
        count: Number(row.count || 0),
      })),
      expenseByAcademicYear: byAcademicYear.map((row) => ({
        label: String(row.label || "-"),
        value: Number(row.value || 0),
        count: Number(row.count || 0),
      })),
      expenseByClass: byClass.map((row) => ({
        label: String(row.label || "-"),
        value: Number(row.value || 0),
        count: Number(row.count || 0),
      })),
      expenseBySection: bySection.map((row) => ({
        label: String(row.label || "-"),
        value: Number(row.value || 0),
        count: Number(row.count || 0),
      })),
      topCategories: (categoryRows.length
        ? categoryRows
        : DEFAULT_CATEGORIES.map(([code, label]) => ({
            category_code: code,
            category_name: label,
          }))
      ).map((row) => ({
        label: String(row.category_name || row.category_code || "-"),
        value: 1,
      })),
    },
    options: {
      schools,
      academicYears,
      classes: classes.map((row) => ({
        id: row.id,
        class_name: row.class_name,
        school_id: row.school_id,
      })),
      sections: sections.map((row) => ({
        id: row.id,
        section_name: row.section_name,
        class_id: row.class_id,
        school_id: row.school_id,
      })),
      createdByUsers: createdByUsers.map((row) => ({
        id: row.id,
        full_name: row.full_name,
        role: row.role,
      })),
      categories: (categoryRows.length
        ? categoryRows
        : DEFAULT_CATEGORIES.map(([code, label]) => ({
            category_code: code,
            category_name: label,
          }))
      ).map((row: any) => ({
        code: String(row.category_code || ""),
        name: String(row.category_name || row.label || ""),
      })),
      statuses: Array.from(allowedStatuses),
      paymentModes: Array.from(allowedPaymentModes),
    },
  });
}

export async function POST(request: Request) {
  const guard = await requireSchoolModule("FINANCE");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  const user = await getCurrentUser();
  if (!context || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!context.schoolId) {
    return NextResponse.json({ error: "Select a school before creating expenses." }, { status: 400 });
  }

  const body = await readBody(request);
  const schoolId = toInt(body.school_id) || context.schoolId;
  const academicYearId = toInt(body.academic_year_id) || context.academicYearId;
  const classId = toInt(body.class_id);
  const sectionId = toInt(body.section_id);
  const amount = toMoney(body.amount);
  const status = normalizeText(body.status).toUpperCase() || "PENDING_APPROVAL";
  const attachment = body.attachment instanceof File ? body.attachment : null;
  const vendorName = normalizeText(body.vendor_name);
  const description = normalizeText(body.description);
  const paymentMethod = normalizeText(body.payment_method).toUpperCase();
  const customCategory = normalizeText(body.custom_category);
  const categoryValue = normalizeText(body.category).toUpperCase();

  if (!schoolId || schoolId !== context.schoolId && !context.allSchools) {
    return NextResponse.json({ error: "Expense must belong to the selected school." }, { status: 400 });
  }

  if (!academicYearId) {
    return NextResponse.json({ error: "Academic year is required." }, { status: 400 });
  }

  if (!amount) {
    return NextResponse.json({ error: "Expense amount must be greater than zero." }, { status: 400 });
  }

  if (status && !allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Select a valid expense status." }, { status: 400 });
  }

  if (paymentMethod && !allowedPaymentModes.has(paymentMethod)) {
    return NextResponse.json({ error: "Select a valid payment mode." }, { status: 400 });
  }

  let category = categoryValue;
  if (categoryValue === "CUSTOM") {
    if (!customCategory) {
      return NextResponse.json({ error: "Enter a custom expense category." }, { status: 400 });
    }
    category = categoryCode(customCategory);
  }

  if (!category) {
    return NextResponse.json({ error: "Select an expense category." }, { status: 400 });
  }

  const attachmentInfo = await uploadAttachment(attachment);

  const rows = await prisma.$transaction(async (tx) => {
    const inserted = await tx.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO school_expenses (
        school_id, academic_year_id, class_id, section_id, category, expense_type, expense_date,
        vendor_name, description, amount, payment_method, reference_number, status,
        attachment_url, attachment_name,
        created_by, updated_by, created_at, updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,
        $14,$15,
        $16,$16,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
      )
      RETURNING *
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId,
      category,
      category,
      normalizeDate(body.expense_date) ?? new Date(),
      vendorName || null,
      description || null,
      amount,
      paymentMethod || null,
      normalizeText(body.reference_number) || null,
      status,
      attachmentInfo?.attachment_url ?? null,
      attachmentInfo?.attachment_name ?? null,
      Number(user.id) || null
    );

    return inserted;
  });

  const expense = rows[0] || null;
  if (!expense) {
    return NextResponse.json({ error: "Failed to create expense." }, { status: 500 });
  }

  await recordExpenseLedger({
    schoolId,
    academicYearId,
    expenseId: Number(expense.id),
    eventType: "EXPENSE_CREATED",
    actorUserId: Number(user.id) || null,
    actorRole: user.role || null,
    summary: `Expense created for ${category}.`,
    payload: expense,
  });

  await recordEvent({
    school_id: schoolId,
    academic_year_id: academicYearId,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "finance",
    event_type: "EXPENSE_CREATED",
    action: "create",
    entity_type: "school_expense",
    entity_id: Number(expense.id) || null,
    summary: `Expense created for ${category}.`,
    payload: expense,
  });

  return NextResponse.json(expense, { status: 201 });
}

export async function PATCH(request: Request) {
  const guard = await requireSchoolModule("FINANCE");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  const user = await getCurrentUser();
  if (!context || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const id = toInt(body.id);
  const action = normalizeText(body.action).toUpperCase();

  if (!id || !["APPROVE", "REJECT", "MARK_PAID"].includes(action)) {
    return NextResponse.json({ error: "Valid id and action are required." }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT e.*
    FROM school_expenses e
    WHERE e.id = $1::int
      AND ($2::int IS NULL OR e.school_id = $2::int)
    LIMIT 1
    `,
    id,
    context.schoolId
  );

  const existing = rows[0];
  if (!existing) {
    return NextResponse.json({ error: "Expense not found for the selected school." }, { status: 404 });
  }

  let nextStatus = existing.status as string;
  let updateSql = "";

  if (action === "APPROVE") {
    nextStatus = "APPROVED";
    updateSql = `
      UPDATE school_expenses
      SET status = 'APPROVED',
          approved_by = $2,
          approved_at = CURRENT_TIMESTAMP,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1::int
    `;
  } else if (action === "REJECT") {
    nextStatus = "REJECTED";
    updateSql = `
      UPDATE school_expenses
      SET status = 'REJECTED',
          rejected_by = $2,
          rejected_at = CURRENT_TIMESTAMP,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1::int
    `;
  } else {
    nextStatus = "PAID";
    updateSql = `
      UPDATE school_expenses
      SET status = 'PAID',
          paid_by = $2,
          paid_at = CURRENT_TIMESTAMP,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1::int
    `;
  }

  const updatedRows = await prisma.$queryRawUnsafe<Row[]>(
    updateSql,
    id,
    Number(user.id) || null
  );

  if (!updatedRows.length) {
    return NextResponse.json({ error: "Failed to update expense status." }, { status: 500 });
  }

  const updated = updatedRows[0];

  await recordExpenseLedger({
    schoolId: Number(updated.school_id) || Number(existing.school_id) || 0,
    academicYearId: Number(updated.academic_year_id) || Number(existing.academic_year_id) || null,
    expenseId: id,
    eventType: `EXPENSE_${nextStatus}`,
    actorUserId: Number(user.id) || null,
    actorRole: user.role || null,
    summary: `Expense ${nextStatus.toLowerCase()}.`,
    payload: updated,
  });

  await recordEvent({
    school_id: Number(updated.school_id) || Number(existing.school_id) || null,
    academic_year_id: Number(updated.academic_year_id) || Number(existing.academic_year_id) || null,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "finance",
    event_type: `EXPENSE_${nextStatus}`,
    action: action.toLowerCase(),
    entity_type: "school_expense",
    entity_id: id,
    summary: `Expense ${nextStatus.toLowerCase()}.`,
    payload: updated,
  });

  return NextResponse.json(updated);
}
