import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";

export async function GET() {
  const auth =
    await requirePermission({
      module: "governance",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const [
    schools,
    academicYears,
    settings,
    flags,
  ] = await Promise.all([
    prisma.schools.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        school_name: true,
        school_code: true,
        is_active: true,
      },
    }),
    prisma.academic_years.findMany({
      orderBy: {
        id: "asc",
      },
    }),
    prisma.governance_settings.findMany({
      orderBy: {
        setting_key: "asc",
      },
    }),
    prisma.feature_flags.findMany({
      orderBy: {
        flag_key: "asc",
      },
    }),
  ]);

  return NextResponse.json({
    currentUser: {
      id: auth.user?.id,
      school_id:
        auth.user?.school_id ?? null,
      school_name:
        auth.user?.school_name ?? null,
    },
    schools,
    academicYears,
    settings,
    flags,
  });
}
