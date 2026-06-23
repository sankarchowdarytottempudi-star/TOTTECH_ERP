import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { recordEvent } from "@/lib/governance/events";
import {
  generateTeacherDNA,
} from "@/lib/intelligence/teacherDNA";
import { phonesConflict } from "@/lib/contact-utils";
import {
  syncTeacherToStaff,
} from "@/lib/hrms/teacherStaffSync";




export async function GET(
  request: Request,
  context: any
) {
  try {
    const { id } = await context.params;

    const teacher =
      await prisma.teachers.findUnique({
        where: {
          id: Number(id),
        },
      });

    if (!teacher) {
      return NextResponse.json(
        {
          error: "Teacher Not Found",
        },
        {
          status: 404,
        }
      );
    }

    const assignments =
      await prisma.$queryRawUnsafe<
        TeacherRow[]
      >(
        `
        SELECT
          tca.*,
          c.class_name,
          sec.section_name
        FROM teacher_class_assignments tca
        LEFT JOIN classes c ON c.id = tca.class_id
        LEFT JOIN sections sec ON sec.id = tca.section_id
        WHERE tca.teacher_id = $1
          AND tca.status = 'ACTIVE'
        ORDER BY tca.id DESC
        `,
        Number(id)
      );
    const primaryAssignment =
      assignments[0] || null;

    const attendance =
      await prisma.teacher_attendance.findMany({
        where: {
          teacher_id: Number(id),
        },
      });

    const present =
      attendance.filter(
        (a) =>
          a.status === "PRESENT"
      ).length;

    const attendancePercent =
      attendance.length > 0
        ? Math.round(
            (present /
              attendance.length) *
              100
          )
        : 100;

    const experienceScore =
      Math.min(
        (teacher.experience_years || 0) * 10,
        100
      );

    const impactScore =
      Math.round(
        attendancePercent * 0.6 +
        experienceScore * 0.4
      );

    let rating = "Excellent";

    if (impactScore < 60) {
      rating = "Needs Support";
    } else if (
      impactScore < 80
    ) {
      rating = "Good";
    }

    const teacherHealth =
      Math.round(
        impactScore * 0.5 +
        attendancePercent * 0.3 +
        experienceScore * 0.2
      );

    const burnoutRisk =
      attendancePercent < 70
        ? "HIGH"
        : attendancePercent < 85
        ? "MEDIUM"
        : "LOW";

    const teacherDNA =
  generateTeacherDNA({
    attendancePercent,
    experienceScore,
    impactScore,
  });

    const teachingGaps =
      await prisma.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `
        SELECT *
        FROM teacher_teaching_gaps
        WHERE teacher_id = $1
        ORDER BY COALESCE(target_date, created_at) DESC, id DESC
        LIMIT 100
        `,
        Number(id)
      );
  

    const recommendations =
      impactScore >= 80
        ? [
            "Continue mentoring high-performing students",
            "Maintain attendance consistency",
            "Conduct advanced workshops",
            "Share best practices with faculty",
          ]
        : [
            "Increase classroom engagement activities",
            "Improve parent communication",
            "Attend professional development sessions",
            "Track student progress more frequently",
          ];

    return NextResponse.json({
      teacher: {
        ...teacher,
        class_id:
          primaryAssignment?.class_id ??
          null,
        section_id:
          primaryAssignment?.section_id ??
          null,
        class_name:
          primaryAssignment?.class_name ??
          null,
        section_name:
          primaryAssignment?.section_name ??
          null,
        assignments,
      },

      attendancePercent,

      experienceScore,

      impactScore,

      teacherHealth,

      burnoutRisk,

      rating,

      recommendations,

      teacherDNA,
      teachingGaps,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed",
      },
      {
        status: 500,
      }
    );
  }
}

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
    outputs.push({ type: key, label, url: `/uploads/teachers/documents/${fileName}`, name: file.name });
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
      current_address: parseJsonField(form.get("current_address")) || {},
      permanent_address: parseJsonField(form.get("permanent_address")) || {},
      classes_handling: parseJsonField(form.get("classes_handling")) || [],
      sections_handling: parseJsonField(form.get("sections_handling")) || [],
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

  return (await request.json()) as Record<string, unknown>;
}

export async function PUT(
  request: Request,
  context: any
) {
  try {
    const { id } =
      await context.params;
    const body = await readTeacherPayload(request);
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before updating a teacher."
      );
    }

    const teacherId = Number(id);
    const schoolId =
      user.role === "SUPER_ADMIN"
        ? null
        : Number(user.school_id);
    const academicYear =
      await getSelectedAcademicYear(
        user.school_id
      );
    const academicYearId =
      Number(
        body.academic_year_id ??
          user.academic_year_id ??
          academicYear?.id
      ) || null;
    const classId =
      Number(body.class_id) || null;
    const sectionId =
      Number(body.section_id) || null;
    const subjectId =
      Number(body.subject_id) || null;
    const assignmentsSource = Array.isArray(body.assignments)
      ? (body.assignments as Record<string, unknown>[])
      : [];
    const hasAssignmentsPayload =
      assignmentsSource.length > 0;
    const assignments =
      hasAssignmentsPayload
        ? assignmentsSource
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

    const rows =
      await prisma.$queryRawUnsafe<
        TeacherRow[]
      >(
        `
        UPDATE teachers
        SET academic_year_id = $1,
            employee_id = $2,
            staff_type = $3,
            first_name = $4,
            last_name = $5,
            gender = $6,
            phone = $7,
            whatsapp_number = $8,
            alternative_mobile = $9,
            emergency_contact_number = $10,
            emergency_contact_person = $11,
            relationship = $12,
            email = $13,
            qualification = $14,
            experience_years = $15,
            joining_date = $16,
            department = $17,
            designation = $18,
            subject_specialization = $19,
            salary = $20,
            address = $21,
            current_address = $22::jsonb,
            permanent_address = $23::jsonb,
            classes_handling = $24::jsonb,
            sections_handling = $25::jsonb,
            employment_history = $26::jsonb,
            salary_history = $27::jsonb,
            qualifications = $28::jsonb,
            certifications = $29::jsonb,
            teacher_notes = $30::jsonb,
            performance_notes = $31::jsonb,
            documents = $32::jsonb,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $33
          AND ($34::int IS NULL OR school_id = $34::int)
        RETURNING *
        `,
        academicYearId,
        body.employee_id || null,
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
        teacherId,
        schoolId
      );

    const teacher = rows[0];

    if (!teacher) {
      return validationError(
        "Teacher not found or outside the selected school."
      );
    }

    await syncTeacherToStaff({
      teacherId: teacherId,
      schoolId: Number(teacher.school_id) || Number(user.school_id) || 0,
      academicYearId,
      employeeId: String(teacher.employee_id || body.employee_id || "") || null,
      firstName: String(teacher.first_name || "") || null,
      lastName: String(teacher.last_name || "") || null,
      department: String(teacher.department || "") || null,
      designation: String(teacher.designation || "") || null,
      qualification: String(teacher.qualification || "") || null,
      experienceYears: teacher.experience_years ?? null,
      phone: String(teacher.phone || "") || null,
      email: String(teacher.email || "") || null,
      address: String(teacher.address || "") || null,
      salary: teacher.salary ? Number(teacher.salary) : null,
      isActive: teacher.is_active !== false,
      updatedBy: user.id || null,
    });

    if (assignments.length > 0) {
      if (hasAssignmentsPayload) {
        await prisma.$executeRawUnsafe(
          `
          UPDATE teacher_class_assignments
          SET status = 'INACTIVE',
              updated_at = CURRENT_TIMESTAMP
          WHERE teacher_id = $1
            AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
          `,
          teacherId,
          academicYearId
        );
      }

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
          status = 'ACTIVE',
          assigned_by = EXCLUDED.assigned_by,
          updated_at = CURRENT_TIMESTAMP
        `,
        Number(teacher.school_id) ||
          schoolId,
        academicYearId,
        teacherId,
        assignment.class_id,
        assignment.section_id,
        assignment.subject_id,
        assignment.assignment_type,
        user.id || null
      );
      }
    } else if (hasAssignmentsPayload) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE teacher_class_assignments
        SET status = 'INACTIVE',
            updated_at = CURRENT_TIMESTAMP
        WHERE teacher_id = $1
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        `,
        teacherId,
        academicYearId
      );
    }

    await recordEvent({
      school_id:
        Number(teacher.school_id) ||
        null,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "teachers",
      event_type: "TEACHER_UPDATED",
      action: "update",
      entity_type: "teacher",
      entity_id: teacherId,
      summary:
        "Teacher record updated",
      payload: {
        assignments,
      },
    });

    return NextResponse.json(
      teacher
    );
  } catch (error) {
    console.error(
      "Teacher update error:",
      error
    );

    return apiError(
      error,
      "Failed to update teacher"
    );
  }
}

const teacherDependentTables = [
  "teacher_attendance",
  "teacher_timelines",
  "teacher_class_assignments",
  "dining_attendance",
  "dining_meal_assignments",
  "dining_special_diets",
  "homework_assignments",
  "timetable_entries",
];

export async function DELETE(
  request: Request,
  context: any
) {
  try {
    const { id } =
      await context.params;
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before deleting a teacher."
      );
    }

    const teacherId = Number(id);
    const schoolId =
      user.role === "SUPER_ADMIN"
        ? null
        : Number(user.school_id);
    const rows =
      await prisma.$queryRawUnsafe<
        TeacherRow[]
      >(
        `
        SELECT id, school_id, first_name, last_name, employee_id
        FROM teachers
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        `,
        teacherId,
        schoolId
      );
    const existing = rows[0];

    if (!existing) {
      return validationError(
        "Teacher not found or outside the selected school."
      );
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(
          `
          UPDATE hr_staff_master
          SET teacher_id = NULL,
              is_active = false,
              pf_status = 'INACTIVE',
              updated_at = CURRENT_TIMESTAMP,
              notes = COALESCE(notes, '{}'::jsonb) || jsonb_build_object(
                'archived_teacher_id', $2,
                'archived_teacher_employee_id', $3,
                'archived_teacher_name', $4,
                'archived_at', CURRENT_TIMESTAMP::text
              )
          WHERE teacher_id = $1
          `,
          teacherId,
          teacherId,
          String(existing.employee_id || ""),
          [existing.first_name, existing.last_name]
            .filter(Boolean)
            .join(" ")
        );

        await tx.$executeRawUnsafe(
          `
          UPDATE classes
          SET class_teacher_id = NULL
          WHERE class_teacher_id = $1
          `,
          teacherId
        );

        await tx.$executeRawUnsafe(
          `
          UPDATE exam_schedule
          SET invigilator_teacher_id = NULL
          WHERE invigilator_teacher_id = $1
          `,
          teacherId
        );

        for (const table of teacherDependentTables) {
          await tx.$executeRawUnsafe(
            `DELETE FROM ${table} WHERE teacher_id = $1`,
            teacherId
          );
        }

        await tx.$executeRawUnsafe(
          `
          DELETE FROM event_ledger
          WHERE entity_type = 'teacher'
            AND entity_id = $1
          `,
          teacherId
        );

        await tx.$executeRawUnsafe(
          "DELETE FROM teachers WHERE id = $1",
          teacherId
        );
      }
    );

    await recordEvent({
      school_id:
        Number(existing.school_id) ||
        null,
      user_id: user.id,
      actor_role: user.role,
      module_name: "teachers",
      event_type: "TEACHER_DELETED",
      action: "delete",
      entity_type: "school",
      entity_id:
        Number(existing.school_id) ||
        null,
      summary:
        "Teacher record hard deleted",
      payload: {
        teacher_id: teacherId,
        employee_id:
          existing.employee_id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Teacher delete error:",
      error
    );

    return apiError(
      error,
      "Failed to delete teacher"
    );
  }
}
