import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";

const numberOrNull = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

export async function GET(
  request: Request
) {
  const auth =
    await requirePermission({
      module: "promotions",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const { searchParams } =
    new URL(request.url);
  const schoolId =
    auth.user?.role === "SUPER_ADMIN"
      ? numberOrNull(
          searchParams?.get("school_id")
        ) ??
        auth.user?.school_id ??
        null
      : auth.user?.school_id ?? null;
  const academicYearId =
    numberOrNull(
      searchParams?.get(
        "academic_year_id"
      )
    );

  const [
    promotionSummary,
    dropoutSummary,
    classPromotions,
    sectionPromotions,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        COUNT(*)::int AS promoted_students,
        COUNT(DISTINCT student_id)::int AS unique_students,
        COUNT(*) FILTER (WHERE approval_status = 'APPROVED')::int AS approved_promotions
      FROM student_promotions
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR target_academic_year_id = $2::int)
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        COUNT(*)::int AS dropout_students,
        COUNT(*) FILTER (WHERE dropout_category = 'TRANSFER')::int AS transfer_count,
        COUNT(*) FILTER (WHERE dropout_category = 'DISCONTINUED')::int AS discontinued_count,
        COUNT(*) FILTER (WHERE dropout_category = 'FINANCIAL')::int AS financial_count,
        COUNT(*) FILTER (WHERE dropout_category = 'MIGRATION')::int AS migration_count,
        COUNT(*) FILTER (WHERE dropout_category = 'MEDICAL')::int AS medical_count,
        COUNT(*) FILTER (WHERE dropout_category = 'OTHER')::int AS other_count
      FROM student_dropout_records
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR dropout_academic_year_id = $2::int)
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        c.class_name,
        COUNT(sp.id)::int AS promoted_students
      FROM student_promotions sp
      LEFT JOIN classes c ON c.id = sp.to_class_id
      WHERE ($1::int IS NULL OR sp.school_id = $1::int)
        AND ($2::int IS NULL OR sp.target_academic_year_id = $2::int)
      GROUP BY c.class_name
      ORDER BY promoted_students DESC
      `,
      schoolId,
      academicYearId
    ),
    prisma.$queryRawUnsafe<
      Record<string, unknown>[]
    >(
      `
      SELECT
        c.class_name,
        sec.section_name,
        COUNT(sp.id)::int AS promoted_students
      FROM student_promotions sp
      LEFT JOIN classes c ON c.id = sp.to_class_id
      LEFT JOIN sections sec ON sec.id = sp.to_section_id
      WHERE ($1::int IS NULL OR sp.school_id = $1::int)
        AND ($2::int IS NULL OR sp.target_academic_year_id = $2::int)
      GROUP BY c.class_name, sec.section_name
      ORDER BY promoted_students DESC
      `,
      schoolId,
      academicYearId
    ),
  ]);

  return NextResponse.json({
    promotionSummary:
      promotionSummary[0] || {},
    dropoutSummary:
      dropoutSummary[0] || {},
    classPromotions,
    sectionPromotions,
  });
}
