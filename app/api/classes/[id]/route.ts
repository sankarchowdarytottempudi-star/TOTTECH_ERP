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
    await prisma.classes.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        sections: true,
      },
    });

  return record
    ? NextResponse.json(record)
    : NextResponse.json(
        {
          error: "Class not found",
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
      "class",
      "update"
    )
  ) {
    return NextResponse.json(
      {
        error: managementError(
          "class",
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
      await prisma.classes.update({
        where: {
          id: Number(id),
        },
        data: {
          class_name:
            body.class_name,
          class_teacher_id:
            body.class_teacher_id
              ? Number(
                  body.class_teacher_id
                )
              : null,
        },
      });

    return NextResponse.json(record);
  } catch (error) {
    return apiError(
      error,
      "Failed to update class"
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
      "class",
      "delete"
    )
  ) {
    return NextResponse.json(
      {
        error: managementError(
          "class",
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
    await prisma.classes.delete({
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
      "Failed to delete class"
    );
  }
}
