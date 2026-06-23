import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
} from "@/lib/governance/rbac";
import {
  normalizeSchoolBranding,
} from "@/lib/school-branding";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const cookieStore =
    await cookies();
  const activeSchool =
    cookieStore.get(
      "active_school_id"
    )?.value;
  const selectedSchoolId =
    activeSchool &&
    activeSchool !== "all"
      ? Number(activeSchool)
      : null;
  const userSchoolId =
    auth.user?.school_id
      ? Number(auth.user.school_id)
      : null;
  const isPlatformMode =
    auth.user?.role === "SUPER_ADMIN" &&
    !selectedSchoolId &&
    !userSchoolId;
  const schoolId =
    selectedSchoolId || userSchoolId;
  const school = schoolId
    ? await prisma.schools.findUnique({
        where: {
          id: schoolId,
        },
      })
    : null;
  const settings =
    await prisma.branding_settings.findMany({
      where: {
        OR: [
          {
            school_id: null,
          },
          {
            school_id:
              schoolId ??
              undefined,
          },
        ],
      },
      orderBy: {
        brand_key: "asc",
      },
    });
  const branding =
    normalizeSchoolBranding(school, {
      platformMode: isPlatformMode,
    });

  return NextResponse.json({
    ...branding,
    settings,
  }, {
    headers: {
      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const body =
    await request.json();
  const schoolId =
    auth.user?.school_id ?? null;
  const brandKey =
    String(body.brand_key);
  const existing =
    await prisma.branding_settings.findFirst({
      where: {
        school_id: schoolId,
        brand_key: brandKey,
      },
    });

  const setting = existing
    ? await prisma.branding_settings.update({
        where: {
          id: existing.id,
        },
        data: {
          brand_value:
            body.brand_value ?? {},
          updated_by:
            auth.user?.id ?? null,
          updated_at: new Date(),
        },
      })
    : await prisma.branding_settings.create({
        data: {
          school_id: schoolId,
          brand_key: brandKey,
          brand_value:
            body.brand_value ?? {},
          updated_by:
            auth.user?.id ?? null,
        },
      });

  return NextResponse.json({
    setting,
  });
}
