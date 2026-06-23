import { prisma } from "@/lib/prisma";

export type SchoolAccessRow = {
  id: number;
  school_name: string | null;
  school_code?: string | null;
  is_primary: boolean;
};

export const normalizeRole = (role?: string | null) =>
  String(role || "").trim().toUpperCase();

export const isSuperAdminRole = (role?: string | null) =>
  normalizeRole(role) === "SUPER_ADMIN";

export async function getUserSchoolAccess(
  userId?: number | null,
  role?: string | null
): Promise<SchoolAccessRow[]> {
  if (!userId) return [];

  if (isSuperAdminRole(role)) {
    const schools = await prisma.schools.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        school_name: true,
        school_code: true,
      },
      orderBy: {
        school_name: "asc",
      },
    });

    return schools.map((school, index) => ({
      ...school,
      is_primary: index === 0,
    }));
  }

  const rows = await prisma.user_school_access.findMany({
    where: {
      user_id: Number(userId),
      is_active: true,
      schools: {
        is_active: true,
      },
    },
    select: {
      is_primary: true,
      schools: {
        select: {
          id: true,
          school_name: true,
          school_code: true,
        },
      },
    },
    orderBy: [
      {
        is_primary: "desc",
      },
      {
        school_id: "asc",
      },
    ],
  });

  return rows.map((row) => ({
    id: row.schools.id,
    school_name: row.schools.school_name,
    school_code: row.schools.school_code,
    is_primary: row.is_primary === true,
  }));
}

export async function userCanAccessSchool(
  userId?: number | null,
  role?: string | null,
  schoolId?: number | null
) {
  if (!schoolId) return isSuperAdminRole(role);
  if (isSuperAdminRole(role)) return true;
  if (!userId) return false;

  const access = await prisma.user_school_access.findFirst({
    where: {
      user_id: Number(userId),
      school_id: Number(schoolId),
      is_active: true,
    },
    select: {
      id: true,
    },
  });

  return Boolean(access);
}

export async function getPrimarySchoolId(
  userId?: number | null,
  role?: string | null
) {
  const schools = await getUserSchoolAccess(userId, role);
  return schools.find((school) => school.is_primary)?.id ?? schools[0]?.id ?? null;
}

export function parseSchoolIds(input: unknown): number[] {
  const values = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(",")
      : input === null || input === undefined
        ? []
        : [input];

  return Array.from(
    new Set(
      values
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0)
    )
  );
}

export async function replaceUserSchoolAccess(input: {
  userId: number;
  schoolIds: number[];
  primarySchoolId?: number | null;
  createdBy?: number | null;
}) {
  const schoolIds = Array.from(new Set(input.schoolIds));
  const primarySchoolId =
    input.primarySchoolId && schoolIds.includes(input.primarySchoolId)
      ? input.primarySchoolId
      : schoolIds[0] ?? null;

  await prisma.$transaction(async (tx) => {
    await tx.user_school_access.updateMany({
      where: {
        user_id: input.userId,
      },
      data: {
        is_active: false,
        is_primary: false,
      },
    });

    for (const schoolId of schoolIds) {
      await tx.user_school_access.upsert({
        where: {
          user_id_school_id: {
            user_id: input.userId,
            school_id: schoolId,
          },
        },
        create: {
          user_id: input.userId,
          school_id: schoolId,
          is_primary: schoolId === primarySchoolId,
          is_active: true,
          created_by: input.createdBy ?? null,
        },
        update: {
          is_primary: schoolId === primarySchoolId,
          is_active: true,
        },
      });
    }
  });

  return primarySchoolId;
}
