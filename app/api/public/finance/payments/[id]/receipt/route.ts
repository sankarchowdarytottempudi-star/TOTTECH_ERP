import { NextResponse } from "next/server";

import { renderReceiptPdf } from "@/lib/finance/public-pdf";
import {
  verifyPublicDocumentToken,
} from "@/lib/public-document-links";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function resolveId(
  params: RouteContext["params"]
) {
  const resolved = await params;
  const id = Number(resolved.id);

  return Number.isFinite(id) && id > 0
    ? id
    : null;
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
          "A valid payment id is required.",
      },
      {
        status: 400,
      }
    );
  }

  const url = new URL(request.url);
  const token =
    url.searchParams?.get("token");
  const template =
    url.searchParams?.get("template") ===
    "print"
      ? "print"
      : "digital";

  if (
    !verifyPublicDocumentToken(
      "receipt",
      id,
      token
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid or expired document link.",
      },
      {
        status: 403,
      }
    );
  }

  const paymentRows =
    await prisma.$queryRawUnsafe<
      Row[]
    >(
      `
      SELECT
        p.*,
        pr.receipt_date,
        i.invoice_number,
        i.balance_amount,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name,
        ay.academic_year,
        u.full_name AS received_by_name
      FROM payments p
      LEFT JOIN payment_receipts pr ON pr.payment_id = p.id
      LEFT JOIN invoices i ON i.id = p.invoice_id
      LEFT JOIN students s ON s.id = p.student_id
      LEFT JOIN classes c ON c.id = p.class_id
      LEFT JOIN sections sec ON sec.id = p.section_id
      LEFT JOIN academic_years ay ON ay.id = COALESCE(p.academic_year_id, i.academic_year_id)
      LEFT JOIN users u ON u.id = COALESCE(p.received_by, p.created_by)
      WHERE p.id = $1::int
      LIMIT 1
      `,
      id
    );
  const payment = paymentRows[0];

  if (!payment) {
    return NextResponse.json(
      {
        error:
          "Payment receipt not found.",
      },
      {
        status: 404,
      }
    );
  }

  const [schoolRows, lineItems] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM schools
        WHERE id = $1::int
        LIMIT 1
        `,
        Number(payment.school_id) || 0
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT *
        FROM invoice_line_items
        WHERE invoice_id = $1::int
        ORDER BY id ASC
        `,
        Number(payment.invoice_id) || 0
      ),
    ]);

  const pdf =
    await renderReceiptPdf({
      school: schoolRows[0] || null,
      payment,
      lineItems,
      template,
    });

  const fileName = `receipt-${String(payment.receipt_number || id).replace(/[^a-zA-Z0-9_-]/g, "-")}.pdf`;

  return new NextResponse(
    new Uint8Array(pdf),
    {
    headers: {
      "Content-Type":
        "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control":
        "private, no-store, max-age=0",
      "X-Robots-Tag":
        "noindex, nofollow",
    },
    }
  );
}
