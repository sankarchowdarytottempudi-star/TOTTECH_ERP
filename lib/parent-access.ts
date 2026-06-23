import { prisma } from "@/lib/prisma";

type ParentIdentity = {
  id?: number | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  full_name?: string | null;
  school_id?: number | null;
};

type ParentStudentRow = {
  id: number;
  school_id: number | null;
  student_name: string | null;
  admission_number: string | null;
  enrollment_number: string | null;
  roll_number: string | null;
  current_class_id: number | null;
  current_section_id: number | null;
  class_name: string | null;
  section_name: string | null;
  photo_url: string | null;
  parent_username: string | null;
  guardian_username: string | null;
  student_status: string | null;
};

const normalizeIdentity = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .toLowerCase();

const identityCandidates = (user: ParentIdentity) =>
  Array.from(
    new Set(
      [
        user.username,
        user.email,
        user.phone,
        user.full_name,
        String(user.id ?? ""),
      ]
        .map(normalizeIdentity)
        .filter(Boolean)
    )
  );

export async function getParentLinkedStudents(
  user: ParentIdentity
) {
  const schoolId =
    Number(user.school_id) || null;
  const identities = identityCandidates(user);

  if (!identities.length) {
    return [] as ParentStudentRow[];
  }

  const rows =
    await prisma.$queryRawUnsafe<ParentStudentRow[]>(
      `
      SELECT
        s.id,
        s.school_id,
        COALESCE(
          NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')), ''),
          NULLIF(s.name, ''),
          'Student ' || s.id::text
        ) AS student_name,
        s.admission_number,
        s.enrollment_number,
        s.roll_number,
        COALESCE(s.current_class_id, sye.class_id) AS current_class_id,
        COALESCE(s.current_section_id, s.section_id, sye.section_id) AS current_section_id,
        c.class_name,
        sec.section_name,
        s.photo_url,
        s.parent_username,
        s.guardian_username,
        s.student_status
      FROM students s
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
        AND COALESCE(sye.status, 'ACTIVE') = 'ACTIVE'
      LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
      LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
      WHERE ($1::int IS NULL OR s.school_id = $1::int)
        AND (
          LOWER(COALESCE(s.parent_username, '')) = ANY($2::text[])
          OR LOWER(COALESCE(s.guardian_username, '')) = ANY($2::text[])
        )
      ORDER BY student_name ASC, s.id ASC
      `,
      schoolId,
      identities
    );

  return rows;
}

export type { ParentIdentity, ParentStudentRow };
