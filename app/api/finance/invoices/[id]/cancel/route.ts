import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";

export async function POST(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const invoice =
    await prisma.invoices.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "CANCELLED",
      },
    });

  await recordEvent({
    school_id:
      auth.user?.school_id ?? null,
    user_id: auth.user?.id,
    actor_role: auth.user?.role,
    module_name: "finance",
    event_type:
      "INVOICE_CANCELLED",
    action: "cancel",
    entity_type: "student",
    entity_id:
      invoice.student_id,
    summary:
      "Invoice cancelled",
    payload: {
      invoice_id: invoice.id,
    },
  });

  return NextResponse.json({
    invoice,
  });
}
