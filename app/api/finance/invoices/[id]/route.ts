import { NextResponse } from "next/server";

import { resolvePlatformContext } from "@/lib/api/context";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const editableRoles = new Set([
  "SUPER_ADMIN",
  "ADMIN",
  "OWNER",
  "ACCOUNTANT",
]);

const normalizeRole = (role?: string | null) =>
  String(role || "")
    .trim()
    .toUpperCase();

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

const toDateOrNull = (value: unknown) =>
  typeof value === "string" && value
    ? new Date(value)
    : null;

const asDateOrNull = (value: unknown) => {
  if (value instanceof Date) {
    return value;
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  return null;
};

const startOfLocalDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

async function resolveId(
  params: RouteContext["params"]
) {
  const resolved = await params;
  const id = Number(resolved.id);

  return Number.isFinite(id) && id > 0
    ? id
    : null;
}

async function loadInvoice(
  id: number,
  schoolId: number | null,
  academicYearId: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        i.*,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      WHERE i.id = $1::int
        AND ($2::int IS NULL OR COALESCE(i.school_id, s.school_id) = $2::int)
        AND ($3::int IS NULL OR i.academic_year_id = $3::int OR i.academic_year_id IS NULL)
      LIMIT 1
      `,
      id,
      schoolId,
      academicYearId
    );

  return rows[0] || null;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const id = await resolveId(params);

  if (!id) {
    return NextResponse.json(
      {
        error:
          "A valid invoice id is required.",
      },
      {
        status: 400,
      }
    );
  }

  const context =
    await resolvePlatformContext(request);

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

  const invoice = await loadInvoice(
    id,
    context.schoolId,
    context.academicYearId
  );

  if (!invoice) {
    return NextResponse.json(
      {
        error:
          "Invoice not found for the selected school and academic year.",
      },
      {
        status: 404,
      }
    );
  }

  const [
    lineItems,
    installments,
    payments,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM invoice_line_items
      WHERE invoice_id = $1::int
      ORDER BY id ASC
      `,
      id
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM invoice_installments
      WHERE invoice_id = $1::int
      ORDER BY part_number ASC, id ASC
      `,
      id
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM payments
      WHERE invoice_id = $1::int
      ORDER BY created_at DESC, id DESC
      `,
      id
    ),
  ]);

  return NextResponse.json({
    invoice,
    line_items: lineItems,
    installments,
    payments,
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const id = await resolveId(params);
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (
    !editableRoles.has(
      normalizeRole(user.role)
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Only Admin, Super Admin, Owner, or Accountant users can edit invoices.",
      },
      {
        status: 403,
      }
    );
  }

  if (!id) {
    return NextResponse.json(
      {
        error:
          "A valid invoice id is required.",
      },
      {
        status: 400,
      }
    );
  }

  const context =
    await resolvePlatformContext(request);

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

  const body = await request.json();
  const invoice = await loadInvoice(
    id,
    context.schoolId,
    context.academicYearId
  );

  if (!invoice) {
    return NextResponse.json(
      {
        error:
          "Invoice not found for the selected school and academic year.",
      },
      {
        status: 404,
      }
    );
  }

  const paidAmount = Number(
    invoice.paid_amount || 0
  );
  const totalAmount =
    toNumber(body.total_amount) ??
    Number(invoice.total_amount || 0);

  if (totalAmount < paidAmount) {
    return NextResponse.json(
      {
        error:
          "Invoice total cannot be lower than the amount already paid.",
      },
      {
        status: 400,
      }
    );
  }

  const status = String(
    body.status || invoice.status || "PENDING"
  )
    .trim()
    .toUpperCase();
  const dueDate =
    toDateOrNull(body.due_date) ??
    asDateOrNull(invoice.due_date);
  const invoiceDate =
    toDateOrNull(body.invoice_date) ??
    asDateOrNull(invoice.invoice_date);

  if (
    dueDate &&
    (Number.isNaN(dueDate.getTime()) ||
      startOfLocalDay(dueDate) <
        startOfLocalDay(new Date()))
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
    dueDate &&
    invoiceDate &&
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

  const balanceAmount =
    Math.max(totalAmount - paidAmount, 0);

  const updatedRows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE invoices
      SET invoice_date = $2,
          due_date = $3,
          total_amount = $4,
          balance_amount = $5,
          status = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      id,
      invoiceDate,
      dueDate,
      totalAmount,
      balanceAmount,
      balanceAmount === 0
        ? "PAID"
        : status
    );
  const updated = updatedRows[0];

  await recordEvent({
    school_id:
      Number(updated.school_id) || null,
    academic_year_id:
      Number(updated.academic_year_id) ||
      null,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "finance",
    event_type: "INVOICE_UPDATED",
    action: "update",
    entity_type: "student",
    entity_id:
      Number(updated.student_id) || null,
    summary: "Invoice updated",
    payload: {
      invoice_id: id,
      total_amount: totalAmount,
      balance_amount: balanceAmount,
      status: updated.status,
      due_date: dueDate,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const id = await resolveId(params);
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (
    !editableRoles.has(
      normalizeRole(user.role)
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Only Admin, Super Admin, Owner, or Accountant users can delete unpaid invoices.",
      },
      {
        status: 403,
      }
    );
  }

  if (!id) {
    return NextResponse.json(
      {
        error:
          "A valid invoice id is required.",
      },
      {
        status: 400,
      }
    );
  }

  const context =
    await resolvePlatformContext(request);

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

  const invoice = await loadInvoice(
    id,
    context.schoolId,
    context.academicYearId
  );

  if (!invoice) {
    return NextResponse.json(
      {
        error:
          "Invoice not found for the selected school and academic year.",
      },
      {
        status: 404,
      }
    );
  }

  const paymentRows =
    await prisma.$queryRawUnsafe<
      { count: number }[]
    >(
      `
      SELECT COUNT(*)::int AS count
      FROM payments
      WHERE invoice_id = $1::int
      `,
      id
    );
  const paymentCount =
    Number(paymentRows[0]?.count || 0);

  if (paymentCount > 0) {
    return NextResponse.json(
      {
        error:
          "This invoice has payment records. Reverse or remove payments before deleting the invoice.",
      },
      {
        status: 409,
      }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `
      DELETE FROM invoice_installments
      WHERE invoice_id = $1::int
      `,
      id
    );
    await tx.$executeRawUnsafe(
      `
      DELETE FROM invoice_line_items
      WHERE invoice_id = $1::int
      `,
      id
    );
    await tx.$executeRawUnsafe(
      `
      DELETE FROM invoices
      WHERE id = $1::int
      `,
      id
    );
  });

  await recordEvent({
    school_id:
      Number(invoice.school_id) || null,
    academic_year_id:
      Number(invoice.academic_year_id) ||
      null,
    user_id: Number(user.id) || null,
    actor_role: user.role,
    module_name: "finance",
    event_type: "INVOICE_DELETED",
    action: "delete",
    entity_type: "student",
    entity_id:
      Number(invoice.student_id) || null,
    summary: "Unpaid invoice deleted",
    payload: {
      invoice_id: id,
      invoice_number:
        invoice.invoice_number,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
