import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import { resolvePlatformContext } from "@/lib/api/context";
import { notifyPaymentReceived } from "@/lib/notifications/whatsapp";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import {
  requireSchoolModule,
} from "@/lib/module-governance";

type Row = Record<string, unknown>;

const toNumber = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const startOfLocalDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

const parsePaymentDate = (value: unknown) => {
  if (!value) {
    return startOfLocalDay(new Date());
  }

  const text = String(value).trim();
  const match = text.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (match) {
    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    );
  }

  return new Date(text);
};

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
  const url = new URL(request.url);
  const studentName = String(url.searchParams?.get("student_name") || "").trim();
  const classId = toNumber(url.searchParams?.get("class_id"));
  const sectionId = toNumber(url.searchParams?.get("section_id"));
  const payments =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        p.*,
        i.invoice_number,
        i.total_amount AS invoice_total_amount,
        i.paid_amount AS invoice_paid_amount,
        GREATEST(COALESCE(i.total_amount, 0) - COALESCE((
          SELECT SUM(p2.amount)
          FROM payments p2
          WHERE p2.invoice_id = i.id
        ), 0), 0) AS invoice_balance_amount,
        i.balance_amount,
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
        AND ($3::int IS NULL OR COALESCE(p.class_id, i.class_id, s.current_class_id) = $3::int)
        AND ($4::int IS NULL OR COALESCE(p.section_id, i.section_id, s.current_section_id) = $4::int)
        AND (
          $5::text = '' OR
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) ILIKE $6::text
        )
      ORDER BY p.created_at DESC
      LIMIT 250
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId,
      studentName,
      `%${studentName}%`
    );

  return NextResponse.json({
    payments,
  });
}

export async function POST(
  request: Request
) {
  const moduleGuard =
    await requireSchoolModule("FINANCE");
  if (moduleGuard.response) {
    return moduleGuard.response;
  }

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

  const invoiceId = toNumber(
    body.invoice_id
  );
  const amount = Number(
    body.amount || 0
  );
  const installmentId = toNumber(
    body.installment_id
  );

  if (!invoiceId) {
    return NextResponse.json(
      {
        error:
          "Select an invoice before recording payment.",
      },
      {
        status: 400,
      }
    );
  }

  if (!amount || amount <= 0) {
    return NextResponse.json(
      {
        error:
          "Enter a valid payment amount greater than zero.",
      },
      {
        status: 400,
      }
    );
  }

  const paymentDate =
    parsePaymentDate(
      body.payment_date
    );

  if (
    Number.isNaN(
      paymentDate.getTime()
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Enter a valid payment date.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    startOfLocalDay(paymentDate) <
    startOfLocalDay(new Date())
  ) {
    return NextResponse.json(
      {
        error:
          "Payment date cannot be older than today.",
      },
      {
        status: 400,
      }
    );
  }

  const schoolId =
    context.schoolId ?? null;
  const invoiceRows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM invoices
      WHERE id = $1
        AND ($2::int IS NULL OR school_id = $2::int)
      LIMIT 1
      `,
      invoiceId,
      schoolId
    );
  const invoice = invoiceRows[0];

  if (!invoice) {
    return NextResponse.json(
      {
        error:
          "Invoice not found for the selected school.",
      },
      {
        status: 404,
      }
    );
  }

  if (
    Number(
      invoice.installment_count || 1
    ) > 1 &&
    !installmentId
  ) {
    return NextResponse.json(
      {
        error:
          "Select the installment part before recording payment for a multi-part invoice.",
      },
      {
        status: 400,
      }
    );
  }

  const balance = Number(
    invoice.balance_amount || 0
  );

  if (amount > balance) {
    return NextResponse.json(
      {
        error:
          "Payment amount cannot be greater than the invoice balance.",
      },
      {
        status: 400,
      }
    );
  }

  const receiptNumber = `RCPT-${Date.now()}-${invoiceId}`;
  const result =
    await prisma.$transaction(
      async (tx) => {
        if (installmentId) {
          await tx.$executeRawUnsafe(
            `
            UPDATE invoice_installments
            SET paid_amount = LEAST(amount, COALESCE(paid_amount, 0) + $1),
                balance_amount = GREATEST(amount - (COALESCE(paid_amount, 0) + $1), 0),
                status = CASE
                  WHEN GREATEST(amount - (COALESCE(paid_amount, 0) + $1), 0) = 0 THEN 'PAID'
                  ELSE 'PARTIAL'
                END,
                paid_at = CASE
                  WHEN GREATEST(amount - (COALESCE(paid_amount, 0) + $1), 0) = 0 THEN CURRENT_TIMESTAMP
                  ELSE paid_at
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
              AND invoice_id = $3
            `,
            amount,
            installmentId,
            invoiceId
          );
        } else {
          await tx.$executeRawUnsafe(
            `
            WITH pending AS (
              SELECT id
              FROM invoice_installments
              WHERE invoice_id = $2
                AND COALESCE(balance_amount, 0) > 0
              ORDER BY part_number ASC
              LIMIT 1
            )
            UPDATE invoice_installments ii
            SET paid_amount = LEAST(ii.amount, COALESCE(ii.paid_amount, 0) + $1),
                balance_amount = GREATEST(ii.amount - (COALESCE(ii.paid_amount, 0) + $1), 0),
                status = CASE
                  WHEN GREATEST(ii.amount - (COALESCE(ii.paid_amount, 0) + $1), 0) = 0 THEN 'PAID'
                  ELSE 'PARTIAL'
                END,
                paid_at = CASE
                  WHEN GREATEST(ii.amount - (COALESCE(ii.paid_amount, 0) + $1), 0) = 0 THEN CURRENT_TIMESTAMP
                  ELSE ii.paid_at
                END,
                updated_at = CURRENT_TIMESTAMP
            FROM pending
            WHERE ii.id = pending.id
            `,
            amount,
            invoiceId
          );
        }

        const updatedInvoices =
          await tx.$queryRawUnsafe<Row[]>(
            `
            UPDATE invoices
            SET paid_amount = COALESCE(paid_amount, 0) + $1,
                balance_amount = GREATEST(COALESCE(balance_amount, 0) - $1, 0),
                status = CASE
                  WHEN GREATEST(COALESCE(balance_amount, 0) - $1, 0) = 0 THEN 'PAID'
                  ELSE 'PARTIAL'
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
            `,
            amount,
            invoiceId
          );
        const updatedInvoice =
          updatedInvoices[0];
        const paymentRows =
          await tx.$queryRawUnsafe<Row[]>(
            `
            INSERT INTO payments (
              school_id,
              academic_year_id,
              class_id,
              section_id,
              invoice_id,
              student_id,
              payment_date,
              payment_method,
              amount,
              reference_number,
              remarks,
              receipt_number,
              received_by,
              metadata,
              created_by,
              created_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15,CURRENT_TIMESTAMP)
            RETURNING *
            `,
            updatedInvoice.school_id,
            updatedInvoice.academic_year_id,
            updatedInvoice.class_id,
            updatedInvoice.section_id,
            invoiceId,
            updatedInvoice.student_id,
            paymentDate,
            body.payment_method ||
              "CASH",
            amount,
            body.reference_number ||
              null,
            body.remarks || null,
            receiptNumber,
            auth.user?.id ?? null,
            JSON.stringify({
              installment_id:
                installmentId,
            }),
            auth.user?.id ?? null
          );
        const payment =
          paymentRows[0];

        await tx.$executeRawUnsafe(
          `
          INSERT INTO payment_receipts (
            receipt_number,
            school_id,
            academic_year_id,
            payment_id,
            receipt_date,
            amount,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP)
          `,
          receiptNumber,
          updatedInvoice.school_id,
          updatedInvoice.academic_year_id,
          payment.id,
          paymentDate,
          amount,
          auth.user?.id ?? null
        );

        return {
          invoice: updatedInvoice,
          payment,
        };
      }
    );

  await recordEvent({
    school_id:
      Number(result.invoice.school_id) ||
      schoolId,
    academic_year_id:
      Number(
        result.invoice.academic_year_id
      ) || null,
    user_id: auth.user?.id,
    actor_role:
      auth.user?.role,
    module_name: "finance",
    event_type:
      "PAYMENT_RECORDED",
    action: "collect",
    entity_type: "student",
    entity_id:
      Number(
        result.invoice.student_id
      ) || null,
    summary:
      "Fee payment recorded and invoice balance updated.",
    payload: {
      invoice_id: invoiceId,
      payment_id:
        result.payment.id,
      amount,
      receipt_number:
        receiptNumber,
      installment_id:
        installmentId,
    },
  });

  await notifyPaymentReceived(
    Number(result.payment.id),
    auth.user?.id ?? null
  ).catch((error) => {
    console.error(
      "WhatsApp payment_received dispatch failed:",
      error instanceof Error
        ? error.message
        : error
    );
  });

  return NextResponse.json(
    result,
    {
      status: 201,
    }
  );
}
