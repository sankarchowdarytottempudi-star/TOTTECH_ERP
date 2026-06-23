import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import { recordEvent } from "@/lib/governance/events";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import {
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";

export async function GET(
  request: Request
) {

  const context =
    await resolvePlatformContext(
      request
    );

  if (!context) {
    return NextResponse.json([]);
  }

  const url = new URL(request.url);
  const search = String(
    url.searchParams?.get("search") ||
      url.searchParams?.get("q") ||
      ""
  ).trim();
  const status = String(
    url.searchParams?.get("status") || ""
  )
    .trim()
    .toUpperCase();

  const teacherSubjectIds =
    String(context.user.role || "")
      .toUpperCase() === "TEACHER"
      ? await prisma.$queryRawUnsafe<
          Array<{ subject_id: number | null }>
        >(
          `
          SELECT DISTINCT tca.subject_id
          FROM teacher_class_assignments tca
          INNER JOIN teachers t ON t.id = tca.teacher_id
          WHERE t.user_id = $1::int
            AND tca.subject_id IS NOT NULL
            AND COALESCE(tca.status, 'ACTIVE') = 'ACTIVE'
            AND ($2::int IS NULL OR tca.school_id = $2::int)
            AND ($3::int IS NULL OR tca.academic_year_id = $3::int)
          `,
          Number(context.user.id || 0),
          context.schoolId,
          context.academicYearId
        )
      : null;
  const teacherSubjectIdList =
    teacherSubjectIds?.map((row) =>
      Number(row.subject_id)
    ).filter(Boolean) || [];

  if (
    String(context.user.role || "")
      .toUpperCase() === "TEACHER" &&
    !teacherSubjectIdList.length
  ) {
    return NextResponse.json([]);
  }

  const where: any = {
    ...(context.schoolId
      ? {
          school_id: context.schoolId,
        }
      : {}),
    ...(context.academicYearId &&
    !context.allYears
      ? {
          academic_year_id:
            context.academicYearId,
        }
      : {}),
    ...(status
      ? {
          status,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              subject_name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              subject_code: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
    ...(teacherSubjectIds
      ? {
          id: {
            in: teacherSubjectIdList,
          },
        }
      : {}),
  };

  const subjects =
    await prisma.subjects.findMany({
      where,
      orderBy: [
        {
          subject_name: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

  const schoolIds = Array.from(
    new Set(
      subjects
        .map((subject) =>
          Number(subject.school_id)
        )
        .filter(Boolean)
    )
  );

  const yearIds = Array.from(
    new Set(
      subjects
        .map((subject) =>
          Number(subject.academic_year_id)
        )
        .filter(Boolean)
    )
  );

  const [schools, years] =
    await Promise.all([
      schoolIds.length
        ? prisma.schools.findMany({
            where: {
              id: {
                in: schoolIds,
              },
            },
            select: {
              id: true,
              school_name: true,
            },
          })
        : Promise.resolve([]),
      yearIds.length
        ? prisma.academic_years.findMany({
            where: {
              id: {
                in: yearIds,
              },
            },
            select: {
              id: true,
              academic_year: true,
            },
          })
        : Promise.resolve([]),
    ]);
  const schoolMap = new Map(
    schools.map((school) => [
      school.id,
      school.school_name,
    ])
  );
  const yearMap = new Map(
    years.map((year) => [
      year.id,
      year.academic_year,
    ])
  );

  return NextResponse.json(
    subjects.map((subject) => ({
      ...subject,
      school_name:
        subject.school_id
          ? schoolMap.get(subject.school_id) ||
            null
          : null,
      academic_year:
        subject.academic_year_id
          ? yearMap.get(
              subject.academic_year_id
            ) || null
          : null,
    }))
  );

}

export async function POST(
  request: Request
) {

  const body =
    await request.json();

  const user =
    await getCurrentUser();

  if (!user) {
    return validationError(
      "Login required before creating a subject."
    );
  }

  if (
    !canManageRecord(
      user.role,
      "subject",
      "create"
    )
  ) {
    return NextResponse.json(
      {
        error: managementError(
          "subject",
          "create"
        ),
      },
      {
        status: 403,
      }
    );
  }

  const schoolId =
    Number(body.school_id) ||
    Number(user.school_id) ||
    null;
  const academicYear =
    body.academic_year_id
      ? null
      : await getSelectedAcademicYear(
          schoolId
        );
  const academicYearId =
    Number(
      body.academic_year_id ??
        academicYear?.id ??
        user.academic_year_id
    ) || null;

  if (!schoolId) {
    return validationError(
      "Select a school/college before creating a subject."
    );
  }

  if (!academicYearId) {
    return validationError(
      "Select an academic year before creating a subject."
    );
  }

  const subjectName = String(
    body.subject_name || ""
  ).trim();
  const subjectCode = String(
    body.subject_code || ""
  ).trim();
  const description = String(
    body.description || ""
  ).trim();
  const status =
    String(body.status || "ACTIVE")
      .trim()
      .toUpperCase() === "INACTIVE"
      ? "INACTIVE"
      : "ACTIVE";

  if (!subjectName) {
    return validationError(
      "Subject name is required."
    );
  }

  const duplicateFilters: any[] = [
    {
      subject_name: {
        equals: subjectName,
        mode: "insensitive",
      },
    },
  ];

  if (subjectCode) {
    duplicateFilters.push({
      subject_code: {
        equals: subjectCode,
        mode: "insensitive",
      },
    });
  }

  const existing =
    await prisma.subjects.findFirst({
      where: {
        school_id: schoolId,
        academic_year_id:
          academicYearId,
        OR: duplicateFilters,
      },
      select: {
        id: true,
        subject_name: true,
      },
    });

  if (existing) {
    return validationError(
      `Subject already exists for this school/college and academic year: ${existing.subject_name}.`
    );
  }

  const subject =
    await prisma.subjects.create({

      data: {

        school_id:
          schoolId,
        academic_year_id:
          academicYearId,

        subject_name:
          subjectName,

        subject_code:
          subjectCode || null,
        description:
          description || null,
        status,
        created_by:
          user.id || null,

      },

    });

  await recordEvent({
    school_id: schoolId,
    academic_year_id:
      academicYearId,
    user_id: user.id,
    actor_role: user.role,
    module_name: "academics",
    event_type: "SUBJECT_CREATED",
    action: "create",
    entity_type: "school",
    entity_id: schoolId,
    summary: "Subject created",
    payload: {
      subject_id: subject.id,
      subject_name:
        subject.subject_name,
    },
  });

  return NextResponse.json(
    subject
  );

}
