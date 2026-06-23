import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth =
    await requirePermission({
      module: "operations",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const backups =
    await prisma.operation_backups.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    });

  return NextResponse.json({
    backups,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "operations",
      action: "manage",
    });

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const backup =
    await prisma.operation_backups.create({
      data: {
        backup_key:
          body.backup_key ??
          `manual-${Date.now()}`,
        status:
          body.status ?? "REQUESTED",
        file_path:
          body.file_path ?? null,
        size_bytes:
          body.size_bytes
            ? BigInt(body.size_bytes)
            : null,
        checksum:
          body.checksum ?? null,
        metadata:
          body.metadata ?? {},
      },
    });

  return NextResponse.json({
    backup,
  });
}
