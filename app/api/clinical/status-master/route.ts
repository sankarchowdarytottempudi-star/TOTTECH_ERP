import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const module = String(searchParams?.get("module") || "").trim();

  if (!module) {
    return NextResponse.json(
      {
        error: "Status module is required.",
      },
      {
        status: 400,
      }
    );
  }

  const statuses = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      id,
      module,
      status_code,
      status_label,
      display_order,
      color,
      is_active
    FROM status_master
    WHERE module = $1
      AND COALESCE(is_active, true) = true
    ORDER BY display_order, status_label
    `,
    module
  );

  return NextResponse.json({
    module,
    statuses,
  });
}
