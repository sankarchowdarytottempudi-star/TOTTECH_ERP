import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { nextDocumentNumber } from "@/lib/document-numbering";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { requireSchoolModule } from "@/lib/module-governance";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

const allowedStatuses = new Set(["DRAFT", "SUBMITTED", "APPROVED", "PAID", "CANCELLED"]);

const normalizeText = (value: unknown) => String(value ?? "").trim();
const toInt = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null;
};
const toMoney = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Number(parsed.toFixed(2)) : null;
};
const normalizeDate = (value: unknown) => {
  const text = normalizeText(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
};
const text = (value: unknown, fallback = "-") => {
  const output = String(value ?? "").trim();
  return output || fallback;
};

async function uploadDocuments(files: File[]) {
  const valid = files.filter((file) => file && file.size > 0);
  if (!valid.length) return [];
  const uploadDir = path.join(process.cwd(), "public", "uploads", "finance", "vouchers");
  await mkdir(uploadDir, { recursive: true });
  const outputs: Array<{ url: string; name: string }> = [];
  for (const file of valid.slice(0, 8)) {
    if (!["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) continue;
    if (file.size > 8 * 1024 * 1024) continue;
    const ext = file.type === "application/pdf" ? ".pdf" : file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
    const fileName = `voucher-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
    outputs.push({ url: `/uploads/finance/vouchers/${fileName}`, name: file.name });
  }
  return outputs;
}

async function readBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    return {
      school_id: form.get("school_id"),
      academic_year_id: form.get("academic_year_id"),
      voucher_date: form.get("voucher_date"),
      expense_category: form.get("expense_category"),
      paid_to: form.get("paid_to"),
      mobile_number: form.get("mobile_number"),
      address: form.get("address"),
      amount: form.get("amount"),
      amount_in_words: form.get("amount_in_words"),
      payment_mode: form.get("payment_mode"),
      reference_number: form.get("reference_number"),
      purpose: form.get("purpose"),
      remarks: form.get("remarks"),
      voucher_status: form.get("voucher_status"),
      receiver_name: form.get("receiver_name"),
      attachment_1: form.get("attachment_1"),
      attachment_2: form.get("attachment_2"),
    } as Record<string, unknown> & { attachment_1?: File | null; attachment_2?: File | null };
  }
  return await request.json();
}

async function recordVoucherEvent(input: {
  schoolId: number;
  academicYearId: number | null;
  voucherId: number;
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
    input.voucherId,
    input.eventType,
    input.actorUserId,
    input.actorRole,
    input.summary,
    JSON.stringify(input.payload || {})
  );
}

export async function GET(request: Request) {
  const guard = await requireSchoolModule("FINANCE");
  if (guard.response) return guard.response;

  const context = await resolvePlatformContext(request);
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const schoolId = context.allSchools ? toInt(url.searchParams?.get("school_id")) : context.schoolId ?? null;
  const academicYearId = context.allYears ? toInt(url.searchParams?.get("academic_year_id")) : context.academicYearId ?? null;
  const status = normalizeText(url.searchParams?.get("status")).toUpperCase();
  const category = normalizeText(url.searchParams?.get("category")).toUpperCase();
  const q = normalizeText(url.searchParams?.get("q"));
  const where = [
    "COALESCE(e.voucher_number, '') <> ''",
    schoolId ? `e.school_id = ${schoolId}` : "TRUE",
    academicYearId ? `COALESCE(e.academic_year_id, 0) = ${academicYearId}` : "TRUE",
    status ? `UPPER(COALESCE(e.voucher_status, '')) = '${status.replace(/'/g, "''")}'` : "TRUE",
    category ? `UPPER(COALESCE(e.category, '')) = '${category.replace(/'/g, "''")}'` : "TRUE",
    q ? `(COALESCE(e.paid_to, '') ILIKE '%${q.replace(/'/g, "''")}%' OR COALESCE(e.voucher_number, '') ILIKE '%${q.replace(/'/g, "''")}%' OR COALESCE(e.reference_number, '') ILIKE '%${q.replace(/'/g, "''")}%' )` : "TRUE",
  ];
  const whereSql = where.join(" AND ");

  const [vouchers, summary, monthly, categories, topVendors, schools, academicYears, createdByUsers] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        e.*,
        s.school_name,
        ay.academic_year,
        creator.full_name AS created_by_name,
        approver.full_name AS approved_by_name
      FROM school_expenses e
      LEFT JOIN schools s ON s.id = e.school_id
      LEFT JOIN academic_years ay ON ay.id = e.academic_year_id
      LEFT JOIN users creator ON creator.id = e.created_by
      LEFT JOIN users approver ON approver.id = e.approved_by
      WHERE ${whereSql}
      ORDER BY COALESCE(e.voucher_date, e.expense_date) DESC, e.id DESC
      LIMIT 300
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COUNT(*)::int AS voucher_count,
        COALESCE(SUM(e.amount), 0)::numeric AS total_expense,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.voucher_status, '')) = 'PAID'), 0)::numeric AS paid_expense,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.voucher_status, '')) IN ('DRAFT','SUBMITTED')), 0)::numeric AS pending_expense
      FROM school_expenses e
      WHERE ${whereSql}
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        to_char(date_trunc('month', COALESCE(e.voucher_date, e.expense_date)), 'Mon YYYY') AS label,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      WHERE ${whereSql}
      GROUP BY 1
      ORDER BY 1
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT COALESCE(e.category, 'Uncategorized') AS label, COUNT(*)::int AS count, COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      WHERE ${whereSql}
      GROUP BY 1
      ORDER BY value DESC
      LIMIT 10
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT COALESCE(e.paid_to, 'Unknown Vendor') AS label, COUNT(*)::int AS count, COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      WHERE ${whereSql}
      GROUP BY 1
      ORDER BY value DESC
      LIMIT 10
      `
    ),
    prisma.schools.findMany({
      where: context.allSchools ? {} : { id: context.schoolId ?? 0 },
      select: { id: true, school_name: true, school_code: true },
      orderBy: { school_name: "asc" },
    }),
    prisma.academic_years.findMany({
      where: context.allYears ? {} : { id: context.academicYearId ?? 0 },
      select: { id: true, academic_year: true },
      orderBy: { academic_year: "desc" },
    }),
    prisma.users.findMany({
      where: {
        platform_type: "EDUCATIONAL",
        ...(schoolId ? { user_school_access: { some: { school_id: schoolId, is_active: true } } } : {}),
      },
      select: { id: true, full_name: true, role: true },
      orderBy: { full_name: "asc" },
      take: 200,
    }),
  ]);

  return NextResponse.json({
    context: {
      allSchools: context.allSchools,
      allYears: context.allYears,
      selectedSchool: schools.find((school) => school.id === schoolId) ?? null,
      selectedAcademicYear: academicYears.find((year) => year.id === academicYearId) ?? null,
      filters: { school_id: schoolId, academic_year_id: academicYearId, status, category, q },
    },
    vouchers,
    summary: {
      voucherCount: Number(summary[0]?.voucher_count || 0),
      totalExpense: Number(summary[0]?.total_expense || 0),
      paidExpense: Number(summary[0]?.paid_expense || 0),
      pendingExpense: Number(summary[0]?.pending_expense || 0),
    },
    analytics: {
      expenseByMonth: monthly.map((row) => ({ label: String(row.label || "-"), value: Number(row.value || 0) })),
      expenseByCategory: categories.map((row) => ({ label: String(row.label || "-"), value: Number(row.value || 0), count: Number(row.count || 0) })),
      topVendors: topVendors.map((row) => ({ label: String(row.label || "-"), value: Number(row.value || 0), count: Number(row.count || 0) })),
    },
    options: {
      schools,
      academicYears,
      createdByUsers: createdByUsers.map((row) => ({ id: row.id, full_name: row.full_name, role: row.role })),
      statuses: ["DRAFT", "SUBMITTED", "APPROVED", "PAID", "CANCELLED"],
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
    return NextResponse.json({ error: "Select a school before creating vouchers." }, { status: 400 });
  }

  const body = await readBody(request);
  const schoolId = toInt(body.school_id) || context.schoolId;
  const academicYearId = toInt(body.academic_year_id) || context.academicYearId;
  const amount = toMoney(body.amount);
  const status = normalizeText(body.voucher_status).toUpperCase() || "DRAFT";
  const attachments = await uploadDocuments([
    body.attachment_1 instanceof File ? body.attachment_1 : null,
    body.attachment_2 instanceof File ? body.attachment_2 : null,
  ].filter(Boolean) as File[]);

  if (!schoolId) return NextResponse.json({ error: "School/College is required." }, { status: 400 });
  if (!academicYearId) return NextResponse.json({ error: "Academic year is required." }, { status: 400 });
  if (!amount) return NextResponse.json({ error: "Amount must be greater than zero." }, { status: 400 });
  if (!status || !allowedStatuses.has(status)) return NextResponse.json({ error: "Select a valid voucher status." }, { status: 400 });

  const numbering = await nextDocumentNumber({
    schoolId,
    academicYearId,
    documentType: "EXP",
    prefix: "EXP",
  });

  const inserted = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO school_expenses (
      school_id, academic_year_id, category, expense_type, expense_date, voucher_number, voucher_date,
      paid_to, mobile_number, payee_address, amount, amount_in_words, payment_method, reference_number,
      purpose, remarks, supporting_documents, voucher_status, receiver_name,
      created_by, updated_by, created_at, updated_at
    )
    VALUES (
      $1,$2,$3,'VOUCHER',$4,$5,$6,
      $7,$8,$9,$10,$11,$12,$13,
      $14,$15,$16::jsonb,$17,$18,
      $19,$19,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
    )
    RETURNING *
    `,
    schoolId,
    academicYearId,
    normalizeText(body.expense_category) || "MISCELLANEOUS",
    normalizeDate(body.voucher_date) ?? new Date(),
    numbering.documentNumber,
    normalizeDate(body.voucher_date) ?? new Date(),
    normalizeText(body.paid_to) || null,
    normalizeText(body.mobile_number) || null,
    normalizeText(body.address) || null,
    amount,
    normalizeText(body.amount_in_words) || null,
    normalizeText(body.payment_mode).toUpperCase() || null,
    normalizeText(body.reference_number) || null,
    normalizeText(body.purpose) || null,
    normalizeText(body.remarks) || null,
    JSON.stringify(attachments),
    status,
    normalizeText(body.receiver_name) || null,
    Number(user.id) || null
  );

  const voucher = inserted[0] || null;
  if (!voucher) {
    return NextResponse.json({ error: "Failed to create voucher." }, { status: 500 });
  }

  await recordVoucherEvent({
    schoolId,
    academicYearId,
    voucherId: Number(voucher.id),
    eventType: "VOUCHER_CREATED",
    actorUserId: Number(user.id) || null,
    actorRole: user.role || null,
    summary: `Voucher ${voucher.voucher_number || voucher.id} created.`,
    payload: voucher,
  });

  await recordEvent({
    school_id: schoolId,
    academic_year_id: academicYearId,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "finance",
    event_type: "VOUCHER_CREATED",
    action: "create",
    entity_type: "expense_voucher",
    entity_id: Number(voucher.id) || null,
    summary: `Voucher ${voucher.voucher_number || voucher.id} created.`,
    payload: voucher,
  });

  return NextResponse.json(voucher, { status: 201 });
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
  const voucherStatus = normalizeText(body.voucher_status).toUpperCase();
  if (!id) return NextResponse.json({ error: "Voucher ID is required." }, { status: 400 });
  if (!allowedStatuses.has(voucherStatus)) return NextResponse.json({ error: "Select a valid voucher status." }, { status: 400 });

  const updated = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE school_expenses
    SET
      voucher_status = $2,
      approved_by = CASE WHEN $2 = 'APPROVED' THEN $3 ELSE approved_by END,
      approved_at = CASE WHEN $2 = 'APPROVED' THEN CURRENT_TIMESTAMP ELSE approved_at END,
      paid_by = CASE WHEN $2 = 'PAID' THEN $3 ELSE paid_by END,
      paid_at = CASE WHEN $2 = 'PAID' THEN CURRENT_TIMESTAMP ELSE paid_at END,
      updated_by = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
    id,
    voucherStatus,
    Number(user.id) || null
  );

  const voucher = updated[0] || null;
  if (!voucher) {
    return NextResponse.json({ error: "Voucher not found." }, { status: 404 });
  }

  await recordVoucherEvent({
    schoolId: Number(voucher.school_id),
    academicYearId: voucher.academic_year_id ? Number(voucher.academic_year_id) : null,
    voucherId: Number(voucher.id),
    eventType: `VOUCHER_${voucherStatus}`,
    actorUserId: Number(user.id) || null,
    actorRole: user.role || null,
    summary: `Voucher ${voucher.voucher_number || voucher.id} moved to ${voucherStatus}.`,
    payload: voucher,
  });

  await recordEvent({
    school_id: Number(voucher.school_id),
    academic_year_id: voucher.academic_year_id ? Number(voucher.academic_year_id) : null,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "finance",
    event_type: `VOUCHER_${voucherStatus}`,
    action: "update",
    entity_type: "expense_voucher",
    entity_id: Number(voucher.id) || null,
    summary: `Voucher ${voucher.voucher_number || voucher.id} moved to ${voucherStatus}.`,
    payload: voucher,
  });

  return NextResponse.json(voucher);
}
