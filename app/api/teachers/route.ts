import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";
import {
  requireSchoolModule,
} from "@/lib/module-governance";
import { phonesConflict } from "@/lib/contact-utils";
import {
  ensureTeacherEmployeeId,
  syncTeacherToStaff,
} from "@/lib/hrms/teacherStaffSync";

type TeacherRow = Record<
  string,
  unknown
>;

type TeacherAssignmentInput = {
  class_id: number | null;
  section_id: number | null;
  subject_id: number | null;
  assignment_type: string;
};

const documentFieldMap = [
  ["resume", "Resume"],
  ["experience_certificates", "Experience Certificates"],
  ["relieving_letter", "Relieving Letter"],
  ["previous_pay_slip", "Previous Pay Slip"],
  ["aadhaar", "Aadhaar"],
  ["pan", "PAN"],
  ["qualification_certificates", "Qualification Certificates"],
  ["tet_certificates", "TET Certificates"],
] as const;

const qualificationDefaults = {
  qualification: "",
  specialization: "",
  university: "",
  college: "",
  board_university_type: "",
  year_of_passing: "",
  percentage_cgpa: "",
  grade: "",
  certificate_upload: "",
};

const certificationDefaults = {
  certification_name: "",
  issuing_authority: "",
  issue_date: "",
  expiry_date: "",
  certificate_upload: "",
};

const teacherNoteDefaults = {
  note_type: "PRIVATE",
  note_date: "",
  added_by: "",
  visibility: "PRIVATE",
  notes: "",
};

const performanceNoteDefaults = {
  achievements: "",
  awards: "",
  parent_feedback: "",
  improvement_areas: "",
  disciplinary_notes: "",
};

const addressKeys = [
  "house_number",
  "street",
  "area",
  "village_city",
  "mandal",
  "district",
  "state",
  "country",
  "pincode",
] as const;

const tableColumnsCache = new Map<
  string,
  Set<string>
>();

async function getTableColumns(
  table: string
) {
  const cached =
    tableColumnsCache.get(table);
  if (cached) {
    return cached;
  }

  const rows =
    await prisma.$queryRawUnsafe<
      Array<{ column_name: string }>
    >(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
      `,
      table
    );

  const columns = new Set(
    rows.map((row) =>
      String(row.column_name)
    )
  );
  tableColumnsCache.set(table, columns);
  return columns;
}

async function uploadTeacherDocuments(files: Record<string, File | null | undefined>) {
  const valid = Object.entries(files).filter(([, file]) => file && file.size > 0);
  if (!valid.length) return [];
  const uploadDir = path.join(process.cwd(), "public", "uploads", "teachers", "documents");
  await mkdir(uploadDir, { recursive: true });
  const outputs: Array<{ type: string; label: string; url: string; name: string }> = [];
  for (const [key, file] of valid) {
    if (!file) continue;
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : ".bin";
    const fileName = `teacher-${key}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
    const label = documentFieldMap.find(([field]) => field === key)?.[1] || key;
    outputs.push({
      type: key,
      label,
      url: `/uploads/teachers/documents/${fileName}`,
      name: file.name,
    });
  }
  return outputs;
}

function parseJsonField(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function readTeacherPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const documents = await uploadTeacherDocuments(
      Object.fromEntries(documentFieldMap.map(([key]) => [key, form.get(key) as File | null]))
    );
    return {
      employee_id: form.get("employee_id"),
      staff_type: form.get("staff_type"),
      first_name: form.get("first_name"),
      last_name: form.get("last_name"),
      gender: form.get("gender"),
      phone: form.get("phone"),
      email: form.get("email"),
      qualification: form.get("qualification"),
      experience_years: form.get("experience_years"),
      joining_date: form.get("joining_date"),
      department: form.get("department"),
      designation: form.get("designation"),
      subject_specialization: form.get("subject_specialization"),
      salary: form.get("salary"),
      address: form.get("address"),
      class_id: form.get("class_id"),
      section_id: form.get("section_id"),
      subject_id: form.get("subject_id"),
      assignment_type: form.get("assignment_type"),
      classes_handling:
        parseJsonField(form.get("classes_handling")) || [],
      sections_handling:
        parseJsonField(form.get("sections_handling")) || [],
      current_address: parseJsonField(form.get("current_address")) || {},
      permanent_address: parseJsonField(form.get("permanent_address")) || {},
      same_as_current_address: String(form.get("same_as_current_address") || "") === "true",
      employment_history: parseJsonField(form.get("employment_history")) || [],
      salary_history: parseJsonField(form.get("salary_history")) || {},
      qualifications: parseJsonField(form.get("qualifications")) || [],
      certifications: parseJsonField(form.get("certifications")) || [],
      teacher_notes: parseJsonField(form.get("teacher_notes")) || [],
      performance_notes: parseJsonField(form.get("performance_notes")) || {},
      documents: documents.length ? documents : (parseJsonField(form.get("documents")) || []),
    } as Record<string, unknown>;
  }

  const body = await request.json();
  return body as Record<string, unknown>;
}

export async function GET(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("TEACHERS");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json([]);
    }

    const schoolId =
      context.schoolId;
    const academicYearId =
      context.academicYearId;
    const { searchParams } =
      new URL(request.url);
    const classId =
      Number(
        searchParams?.get("class_id")
      ) || null;
    const staffType = String(
      searchParams?.get("staff_type") || ""
    ).trim();
    const sectionId =
      Number(
        searchParams?.get("section_id")
      ) || null;
    const subjectId =
      Number(
        searchParams?.get("subject_id")
      ) || null;
    const teacherColumns =
      await getTableColumns("teachers");
    const hasStaffTypeColumn =
      teacherColumns.has("staff_type");
    const effectiveStaffType =
      hasStaffTypeColumn ? staffType : "";

    const teachers =
      await prisma.$queryRawUnsafe<
        TeacherRow[]
      >(
        `
        WITH attendance_stats AS (
          SELECT
            teacher_id,
            CASE
              WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'PRESENT')::numeric / COUNT(*)::numeric) * 100, 0)
              ELSE 0
            END AS attendance_percent
          FROM teacher_attendance
          WHERE ($1::int IS NULL OR school_id = $1::int)
            AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
          GROUP BY teacher_id
        ),
        homework_stats AS (
          SELECT
            teacher_id,
            COUNT(*)::int AS homework_count,
            CASE
              WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) IN ('COMPLETED','PUBLISHED','ACTIVE'))::numeric / COUNT(*)::numeric) * 100, 0)
              ELSE 0
            END AS homework_completion_percent
          FROM homework_assignments
          WHERE ($1::int IS NULL OR school_id = $1::int)
            AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
          GROUP BY teacher_id
        ),
        marks_stats AS (
          SELECT
            tca.teacher_id,
            CASE
              WHEN SUM(m.total_marks) > 0 THEN ROUND((SUM(m.obtained_marks)::numeric / SUM(m.total_marks)::numeric) * 100, 0)
              ELSE 0
            END AS exam_performance_percent
          FROM teacher_class_assignments tca
          LEFT JOIN marks m
            ON m.school_id = tca.school_id
           AND ($2::int IS NULL OR m.academic_year_id = $2::int OR m.academic_year_id IS NULL)
           AND ($3::int IS NULL OR m.subject_id = $3::int OR tca.subject_id = $3::int)
          WHERE ($1::int IS NULL OR tca.school_id = $1::int)
            AND ($2::int IS NULL OR tca.academic_year_id = $2::int OR tca.academic_year_id IS NULL)
          GROUP BY tca.teacher_id
        )
        SELECT
          t.*,
          ay.academic_year AS selected_academic_year,
          MIN(c.class_name) AS class_name,
          MIN(sec.section_name) AS section_name,
          COALESCE(att.attendance_percent, 0)::int AS attendance_percent,
          COALESCE(hw.homework_completion_percent, 0)::int AS homework_completion_percent,
          COALESCE(ms.exam_performance_percent, 0)::int AS exam_performance_percent,
          ROUND((
            COALESCE(att.attendance_percent, 0) * 0.30 +
            COALESCE(hw.homework_completion_percent, 0) * 0.30 +
            COALESCE(ms.exam_performance_percent, 0) * 0.40
          ), 0)::int AS performance_percent,
          ROUND((
            COALESCE(hw.homework_completion_percent, 0) * 0.35 +
            COALESCE(ms.exam_performance_percent, 0) * 0.65
          ), 0)::int AS student_outcome_percent,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'assignment_id', tca.id,
                'class_id', tca.class_id,
                'class_name', c.class_name,
                'section_id', tca.section_id,
                'section_name', sec.section_name,
                'subject_id', tca.subject_id,
                'subject_name', sub.subject_name,
                'assignment_type', tca.assignment_type
              )
            ) FILTER (WHERE tca.id IS NOT NULL),
            '[]'::json
          ) AS assignments
        FROM teachers t
        LEFT JOIN academic_years ay
          ON ay.id = t.academic_year_id
        LEFT JOIN teacher_class_assignments tca
          ON tca.teacher_id = t.id
          AND tca.status = 'ACTIVE'
          AND ($2::int IS NULL OR tca.academic_year_id = $2::int OR tca.academic_year_id IS NULL)
        LEFT JOIN classes c ON c.id = tca.class_id
        LEFT JOIN sections sec ON sec.id = tca.section_id
        LEFT JOIN subjects sub ON sub.id = tca.subject_id
        LEFT JOIN attendance_stats att ON att.teacher_id = t.id
        LEFT JOIN homework_stats hw ON hw.teacher_id = t.id
        LEFT JOIN marks_stats ms ON ms.teacher_id = t.id
        WHERE ($1::int IS NULL OR t.school_id = $1::int)
          AND (
            $2::int IS NULL
            OR t.academic_year_id = $2::int
            OR t.academic_year_id IS NULL
          )
          AND ($3::int IS NULL OR tca.subject_id = $3::int)
          AND ($4::int IS NULL OR tca.class_id = $4::int)
          AND ($5::int IS NULL OR tca.section_id = $5::int)
          AND (
            $6::text = ''
            ${
              hasStaffTypeColumn
                ? "OR UPPER(COALESCE(t.staff_type, 'TEACHING')) = UPPER($6::text)"
                : ""
            }
          )
        GROUP BY t.id, ay.academic_year, att.attendance_percent, hw.homework_completion_percent, ms.exam_performance_percent
        ORDER BY t.id DESC
        `,
        schoolId,
        academicYearId,
        subjectId,
        classId,
        sectionId,
        effectiveStaffType
      );

    return NextResponse.json(
      teachers
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to fetch teachers"
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("TEACHERS");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const body = await readTeacherPayload(request);
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before adding a teacher."
      );
    }

    const schoolId =
      Number(
        body.school_id ??
          user.school_id
      ) || null;

    if (!schoolId) {
      return validationError(
        "Select a school before adding a teacher."
      );
    }

    if (!body.first_name) {
      return validationError(
        "Teacher first name is required."
      );
    }

    const academicYear =
      await getSelectedAcademicYear(
        schoolId
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          academicYear?.id ??
          user.academic_year_id
      ) || null;

    if (!academicYearId) {
      return validationError(
        "Select an academic year before adding a teacher."
      );
    }

    const classId =
      Number(body.class_id) || null;
    const sectionId =
      Number(body.section_id) || null;
    const subjectId =
      Number(body.subject_id) || null;
    const assignments = Array.isArray(
      body.assignments
    )
      ? body.assignments
          .map((assignment: Record<string, unknown>) => ({
            class_id:
              Number(assignment.class_id) ||
              null,
            section_id:
              Number(assignment.section_id) ||
              null,
            subject_id:
              Number(assignment.subject_id) ||
              null,
            assignment_type:
              String(
                assignment.assignment_type ||
                  body.assignment_type ||
                  "SUBJECT_TEACHER"
              ).toUpperCase(),
          }))
          .filter(
            (assignment: TeacherAssignmentInput) =>
              assignment.class_id ||
              assignment.subject_id
          )
      : classId || subjectId
        ? [
            {
              class_id: classId,
              section_id: sectionId,
              subject_id: subjectId,
              assignment_type:
                body.assignment_type ||
                "CLASS_TEACHER",
            },
          ]
        : [];

    if (
      phonesConflict([
        body.phone,
        body.whatsapp_number,
        body.alternative_mobile,
        body.emergency_contact_number,
      ])
    ) {
      return validationError(
        "Primary and alternate contact numbers must be unique."
      );
    }

    if (classId) {
      const classRows =
        await prisma.$queryRawUnsafe<
          TeacherRow[]
        >(
          `
          SELECT id
          FROM classes
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
          `,
          classId,
          schoolId
        );

      if (!classRows.length) {
        return validationError(
          "Selected class does not belong to the selected school."
        );
      }
    }

    if (sectionId) {
      const sectionRows =
        await prisma.$queryRawUnsafe<
          TeacherRow[]
        >(
          `
          SELECT id
          FROM sections
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
            AND ($3::int IS NULL OR class_id = $3::int)
          `,
          sectionId,
          schoolId,
          classId
        );

      if (!sectionRows.length) {
        return validationError(
          "Selected section must belong to the selected class and school."
        );
      }
    }

    const employeeId = await ensureTeacherEmployeeId(
      schoolId,
      String(body.employee_id || "") || null
    );

    const rows =
      await prisma.$queryRawUnsafe<
        TeacherRow[]
      >(
        `
        INSERT INTO teachers (
          school_id,
          academic_year_id,
          employee_id,
          staff_type,
          first_name,
          last_name,
          gender,
          phone,
          whatsapp_number,
          alternative_mobile,
          emergency_contact_number,
          emergency_contact_person,
          relationship,
          email,
          qualification,
          experience_years,
          joining_date,
          department,
          designation,
          subject_specialization,
          salary,
          address,
          current_address,
          permanent_address,
          classes_handling,
          sections_handling,
          employment_history,
          salary_history,
          qualifications,
          certifications,
          teacher_notes,
          performance_notes,
          documents,
          created_by,
          is_active,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23::jsonb,$24::jsonb,$25::jsonb,$26::jsonb,$27::jsonb,$28::jsonb,$29::jsonb,$30::jsonb,$31::jsonb,$32::jsonb,$33::jsonb,$34,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING *
        `,
        schoolId,
        academicYearId,
        employeeId,
        String(body.staff_type || "Teaching"),
        body.first_name || null,
        body.last_name || null,
        body.gender || null,
        body.phone || null,
        body.whatsapp_number || null,
        body.alternative_mobile || null,
        body.emergency_contact_number || null,
        body.emergency_contact_person || null,
        body.relationship || null,
        body.email || null,
        body.qualification || null,
        body.experience_years
          ? Number(
              body.experience_years
            )
          : null,
        body.joining_date
          ? new Date(
              String(body.joining_date)
            )
          : null,
        body.department || null,
        body.designation || null,
        body.subject_specialization || null,
        body.salary
          ? Number(body.salary)
          : null,
        body.address || null,
        JSON.stringify(body.current_address || {}),
        JSON.stringify(body.permanent_address || {}),
        JSON.stringify(body.classes_handling || []),
        JSON.stringify(body.sections_handling || []),
        JSON.stringify(body.employment_history || []),
        JSON.stringify(body.salary_history || {}),
        JSON.stringify(body.qualifications || []),
        JSON.stringify(body.certifications || []),
        JSON.stringify(body.teacher_notes || []),
        JSON.stringify(body.performance_notes || {}),
        JSON.stringify(body.documents || []),
        user.id || null
      );

    const teacher = rows[0];

    if (teacher?.id) {
      await syncTeacherToStaff({
        teacherId: Number(teacher.id),
        schoolId,
        academicYearId,
        employeeId,
        firstName:
          String(body.first_name || "") || null,
        lastName:
          String(body.last_name || "") || null,
        department:
          String(body.department || "") || null,
        designation:
          String(body.designation || "") || null,
        qualification:
          String(body.qualification || "") || null,
        experienceYears: body.experience_years
          ? Number(body.experience_years)
          : null,
        phone: String(body.phone || "") || null,
        email: String(body.email || "") || null,
        address:
          String(body.address || "") || null,
        salary: body.salary
          ? Number(body.salary)
          : null,
        isActive:
          body.is_active !== undefined
            ? Boolean(body.is_active)
            : true,
        createdBy: user.id || null,
        updatedBy: user.id || null,
      });
    }

    if (teacher?.id) {
      for (const assignment of assignments) {
        await prisma.$executeRawUnsafe(
          `
        INSERT INTO teacher_class_assignments (
          school_id,
          academic_year_id,
          teacher_id,
          class_id,
          section_id,
          subject_id,
          assignment_type,
          status,
          assigned_by,
          assigned_at,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'ACTIVE',$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (
          teacher_id,
          academic_year_id,
          class_id,
          (COALESCE(section_id, 0)),
          (COALESCE(subject_id, 0)),
          assignment_type
        )
        WHERE status = 'ACTIVE'
        DO UPDATE SET
          section_id = EXCLUDED.section_id,
          subject_id = EXCLUDED.subject_id,
          assigned_by = EXCLUDED.assigned_by,
          updated_at = CURRENT_TIMESTAMP
        `,
          schoolId,
          academicYearId,
          Number(teacher.id),
          assignment.class_id,
          assignment.section_id,
          assignment.subject_id,
          assignment.assignment_type,
          user.id || null
        );
      }
    }

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "teachers",
      event_type: "TEACHER_CREATED",
      action: "create",
      entity_type: "teacher",
      entity_id:
        Number(teacher?.id) ||
        null,
      summary:
        "Teacher record created",
      payload: {
        assignments,
      },
    });

    return NextResponse.json(
      teacher,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to save teacher"
    );
  }
}
