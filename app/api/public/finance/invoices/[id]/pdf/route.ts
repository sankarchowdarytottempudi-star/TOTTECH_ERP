import { NextResponse } from "next/server";

import {
  verifyPublicDocumentToken,
} from "@/lib/public-document-links";
import { renderInvoicePdf } from "@/lib/finance/public-pdf";
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
          "A valid invoice id is required.",
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
      "invoice",
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

  const invoiceRows =
    await prisma.$queryRawUnsafe<
      Row[]
    >(
      `
      SELECT
        i.*,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name,
        ay.academic_year
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      LEFT JOIN academic_years ay ON ay.id = i.academic_year_id
      WHERE i.id = $1::int
      LIMIT 1
      `,
      id
    );
  const invoice = invoiceRows[0];

  if (!invoice) {
    return NextResponse.json(
      {
        error:
          "Invoice not found.",
      },
      {
        status: 404,
      }
    );
  }

  const [
    schoolRows,
    lineItems,
    installments,
    payments,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM schools
      WHERE id = $1::int
      LIMIT 1
      `,
      Number(invoice.school_id) || 0
    ),
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

  const pdf =
    await renderInvoicePdf({
      school: schoolRows[0] || null,
      invoice,
      lineItems,
      installments,
      payments,
      template,
    });

  const fileName = `invoice-${String(invoice.invoice_number || id).replace(/[^a-zA-Z0-9_-]/g, "-")}.pdf`;

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
