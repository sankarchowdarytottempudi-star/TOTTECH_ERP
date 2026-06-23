import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export async function getSelectedAcademicYear(
  schoolId?: number | null
) {
  const cookieStore = await cookies();
  const selected =
    cookieStore.get(
      "active_academic_year_id"
    )?.value;
  const selectedValue =
    String(selected || "")
      .trim()
      .toLowerCase();

  if (
    selectedValue === "all" ||
    selectedValue === "0"
  ) {
    return null;
  }

  const selectedId = selected
    ? Number(selected)
    : null;

  if (
    selectedId &&
    Number.isFinite(selectedId)
  ) {
    const year =
      await prisma.academic_years.findFirst({
        where: {
          id: selectedId,
          ...(schoolId
            ? {
                OR: [
                  {
                    school_id: schoolId,
                  },
                  {
                    school_id: null,
                  },
                ],
              }
            : {}),
        },
      });

    if (year) {
      return year;
    }
  }

  return prisma.academic_years.findFirst({
    where: {
      is_current: true,
      ...(schoolId
        ? {
            OR: [
              {
                school_id: schoolId,
              },
              {
                school_id: null,
              },
            ],
          }
        : {}),
    },
    orderBy: {
      id: "desc",
    },
  });
}

export async function getSelectedAcademicYearId(
  schoolId?: number | null
) {
  const year =
    await getSelectedAcademicYear(
      schoolId
    );

  return year?.id ?? null;
}
