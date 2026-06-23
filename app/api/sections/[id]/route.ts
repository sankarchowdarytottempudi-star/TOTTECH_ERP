import { NextResponse } from "next/server";

import {
  apiError,
} from "@/lib/api/errors";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";

export async function GET(
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
  const record =
    await prisma.sections.findUnique({
      where: {
        id: Number(id),
      },
    });

  return record
    ? NextResponse.json(record)
    : NextResponse.json(
        {
          error:
            "Section not found",
        },
        {
          status: 404,
        }
      );
}

export async function PATCH(
  request: Request,
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

  if (
    !canManageRecord(
      auth.user?.role,
      "section",
      "update"
    )
  ) {
    return NextResponse.json(
      {
        error: managementError(
          "section",
          "update"
        ),
      },
      {
        status: 403,
      }
    );
  }

  try {
    const { id } = await params;
    const body =
      await request.json();
    const record =
      await prisma.sections.update({
        where: {
          id: Number(id),
        },
        data: {
          section_name:
            body.section_name,
          class_id:
            body.class_id
              ? Number(body.class_id)
              : undefined,
        },
      });

    return NextResponse.json(record);
  } catch (error) {
    return apiError(
      error,
      "Failed to update section"
    );
  }
}

export async function DELETE(
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

  if (
    !canManageRecord(
      auth.user?.role,
      "section",
      "delete"
    )
  ) {
    return NextResponse.json(
      {
        error: managementError(
          "section",
          "delete"
        ),
      },
      {
        status: 403,
      }
    );
  }

  try {
    const { id } = await params;
    await prisma.sections.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return apiError(
      error,
      "Failed to delete section"
    );
  }
}
