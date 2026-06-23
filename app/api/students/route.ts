import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getCurrentUser } from "@/lib/auth";
import { getSelectedAcademicYear } from "@/lib/academicYear";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { resolvePlatformContext } from "@/lib/api/context";
import { recordEvent } from "@/lib/governance/events";
import { notifyStudentCreated } from "@/lib/notifications/whatsapp";
import { prisma } from "@/lib/prisma";
import {
  requireSchoolModule,
} from "@/lib/module-governance";
import { alternatePhoneConflictsWithPrimary } from "@/lib/contact-utils";
import {
  normalizeStudentBacklogs,
} from "@/lib/student-backlogs";

type StudentRow = Record<
  string,
  unknown
>;

const cleanCode = (value: unknown) =>
  String(value || "KVS")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") || "KVS";

const currentYearSuffix = () =>
  String(new Date().getFullYear()).slice(-2);

const academicYearStart = (
  value: unknown
) => {
  const match = String(value || "")
    .match(/(\d{4})\s*-\s*(\d{4})/);
  return match ? Number(match[1]) : null;
};

const calculateAcademicGapDuration = (
  fromYear: unknown,
  toYear: unknown
) => {
  const fromStart = academicYearStart(fromYear);
  const toStart = academicYearStart(toYear);

  if (
    fromStart === null ||
    toStart === null ||
    toStart < fromStart
  ) {
    return null;
  }

  const gapYears = Math.max(
    0,
    toStart - fromStart - 1
  );
  const label =
    gapYears <= 0
      ? "No academic gap"
      : `${gapYears} Academic Year${gapYears === 1 ? "" : "s"}`;

  return label;
};

const normalizePerformance = (
  value: unknown
) => {
  const text = String(value || "").trim();
  return text || null;
};

const parseYesNo = (
  value: unknown
) => {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  return normalized === "yes" || normalized === "true";
};

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const normalizeString = (value: unknown) =>
  String(value ?? "").trim();

const nullableString = (value: unknown) => {
  const text = normalizeString(value);
  return text || null;
};

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phonePattern = /^\d{10}$/;

const validatePhoneField = (
  label: string,
  value: unknown,
  required = false
) => {
  const text = normalizeString(value);
  if (!text && !required) {
    return null;
  }

  if (!text) {
    return `${label} is required.`;
  }

  if (!phonePattern.test(text)) {
    return `${label} must contain exactly 10 digits.`;
  }

  return null;
};

const hasFile = (file: unknown): file is File =>
  typeof File !== "undefined" &&
  file instanceof File &&
  file.size > 0;

const parseJsonField = (
  value: FormDataEntryValue | null
) => {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

async function readStudentPayload(request: Request) {
  const contentType =
    request.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return {
      body: await request.json(),
      dobCertificate: null as File | null,
    };
  }

  const form = await request.formData();
  const body: Record<string, unknown> = {};

  for (const [key, value] of form.entries()) {
    if (value instanceof File) {
      continue;
    }

    body[key] = value;
  }

  body.backlogs =
    parseJsonField(form.get("backlogs")) || [];

  return {
    body,
    dobCertificate:
      form.get("dob_certificate") as File | null,
  };
}

async function saveStudentDocumentFile({
  file,
  schoolId,
  studentId,
  admissionNumber,
}: {
  file: File;
  schoolId: number;
  studentId: number;
  admissionNumber: string;
}) {
  if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
    throw new Error(
      "DOB Certificate must be PDF, JPG, JPEG, or PNG."
    );
  }

  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new Error(
      "DOB Certificate must be 10 MB or smaller."
    );
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() ||
    (file.type === "application/pdf" ? "pdf" : "jpg");
  const safeAdmission =
    admissionNumber.replace(/[^A-Za-z0-9_-]/g, "-");
  const fileName = `${safeAdmission}-dob-certificate-${Date.now()}.${extension}`;
  const relativePath = `/uploads/students/documents/${schoolId}/${studentId}/${fileName}`;
  const targetDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "students",
    "documents",
    String(schoolId),
    String(studentId)
  );

  await mkdir(targetDir, {
    recursive: true,
  });

  const bytes = await file.arrayBuffer();
  await writeFile(
    path.join(targetDir, fileName),
    Buffer.from(bytes)
  );

  return {
    fileName,
    fileUrl: relativePath,
  };
}

async function nextStudentNumber(
  schoolId: number,
  schoolCode: string,
  type: "AD" | "EN"
) {
  const suffix = currentYearSuffix();
  const prefix = `${schoolCode}-${type}-`;
  const column =
    type === "AD"
      ? "admission_number"
      : "enrollment_number";
  const rows =
    await prisma.$queryRawUnsafe<
      { max_number: number | null }[]
    >(
      `
      SELECT COALESCE(
        MAX(
          NULLIF(
            regexp_replace(${column}, '^.*-${type}-([0-9]+)/${suffix}$', '\\1'),
            ${column}
          )::int
        ),
        0
      )::int AS max_number
      FROM students
      WHERE school_id = $1::int
        AND ${column} ~ $2
      `,
      schoolId,
      `^${prefix}[0-9]+/${suffix}$`
    );
  const next =
    Number(rows[0]?.max_number || 0) + 1;

  return `${prefix}${String(next).padStart(3, "0")}/${suffix}`;
}

async function assignAlphabeticalRollNumbers({
  schoolId,
  academicYearId,
  classId,
  sectionId,
}: {
  schoolId: number;
  academicYearId: number;
  classId: number;
  sectionId: number | null;
}) {
  const rows =
    await prisma.$queryRawUnsafe<
      { id: number }[]
    >(
      `
      SELECT s.id
      FROM students s
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
        AND sye.academic_year_id = $2::int
      WHERE s.school_id = $1::int
        AND COALESCE(s.current_class_id, sye.class_id) = $3::int
        AND (
          $4::int IS NULL
          OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $4::int
        )
        AND COALESCE(s.is_active, true) = true
      ORDER BY
        LOWER(COALESCE(NULLIF(s.first_name, ''), split_part(COALESCE(s.name, ''), ' ', 1), '')) ASC,
        LOWER(COALESCE(s.last_name, '')) ASC,
        s.id ASC
      `,
      schoolId,
      academicYearId,
      classId,
      sectionId
    );

  for (const [
    index,
    row,
  ] of rows.entries()) {
    const rollNumber =
      String(index + 1);

    await prisma.$executeRawUnsafe(
      `
      UPDATE students
      SET roll_number = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2::int
      `,
      rollNumber,
      Number(row.id)
    );

    await prisma.$executeRawUnsafe(
      `
      UPDATE student_year_enrollments
      SET roll_number = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE student_id = $2::int
        AND academic_year_id = $3::int
      `,
      rollNumber,
      Number(row.id),
      academicYearId
    );
  }
}

async function insertStudentAcademicHistory({
  studentId,
  schoolId,
  academicYearId,
  classId,
  sectionId,
  promotionStatus,
  userId,
  metadata,
}: {
  studentId: number;
  schoolId: number | null;
  academicYearId: number | null;
  classId: number | null;
  sectionId: number | null;
  promotionStatus: string;
  userId: number | null;
  metadata?: Record<string, unknown>;
}) {
  await prisma.$executeRawUnsafe(
    `
    INSERT INTO student_academic_history (
      student_id,
      school_id,
      academic_year_id,
      class_id,
      section_id,
      promotion_status,
      promoted_on,
      created_by,
      metadata
    )
    VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,$8::jsonb)
    `,
    studentId,
    schoolId,
    academicYearId,
    classId,
    sectionId,
    promotionStatus,
    userId,
    JSON.stringify(metadata || {})
  );
}

export async function GET(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("STUDENTS");
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

    const students =
      await prisma.$queryRawUnsafe<
        StudentRow[]
      >(
        `
        SELECT
          s.*,
          COALESCE(c.class_name, '') AS class_name,
          COALESCE(sec.section_name, '') AS section_name,
          ay.academic_year AS selected_academic_year
        FROM students s
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        LEFT JOIN classes c
          ON c.id = COALESCE(s.current_class_id, sye.class_id)
        LEFT JOIN sections sec
          ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
        LEFT JOIN academic_years ay
          ON ay.id = COALESCE(s.academic_year_id, sye.academic_year_id)
        WHERE ($1::int IS NULL OR s.school_id = $1::int)
          AND (
            $2::int IS NULL
            OR s.academic_year_id = $2::int
            OR sye.academic_year_id = $2::int
            OR (s.academic_year_id IS NULL AND sye.academic_year_id IS NULL)
          )
        ORDER BY s.id DESC
        `,
        schoolId,
        academicYearId
      );

    return NextResponse.json(
      students
    );
  } catch (error) {
    console.error(
      "Student fetch error:",
      error
    );

    return apiError(
      error,
      "Failed to fetch students"
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const moduleGuard =
      await requireSchoolModule("STUDENTS");
    if (moduleGuard.response) {
      return moduleGuard.response;
    }

    const {
      body,
      dobCertificate,
    } = await readStudentPayload(request);
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before adding a student."
      );
    }

    const schoolId =
      Number(
        body.school_id ??
          user.school_id
      ) || null;

    if (!schoolId) {
      return validationError(
        "Select a school before adding a student."
      );
    }

    if (!normalizeString(body.gender)) {
      return validationError(
        "Gender is required."
      );
    }

    if (!body.first_name && !body.name) {
      return validationError(
        "Student first name is required."
      );
    }

    if (!normalizeString(body.last_name)) {
      return validationError(
        "Student last name is required."
      );
    }

    const dobText = normalizeString(
      body.dob ?? body.date_of_birth
    );
    if (!dobText) {
      return validationError(
        "Date of Birth is required."
      );
    }

    const dobDate = new Date(dobText);
    if (
      Number.isNaN(dobDate.getTime()) ||
      dobDate > new Date()
    ) {
      return validationError(
        "Date of Birth must be a valid past date."
      );
    }

    if (!hasFile(dobCertificate)) {
      return validationError(
        "DOB Certificate is required."
      );
    }

    const addressLine1 =
      normalizeString(
        body.address_line_1 ?? body.address
      );
    if (!addressLine1) {
      return validationError(
        "Address Line 1 is required."
      );
    }

    if (!normalizeString(body.father_name)) {
      return validationError(
        "Father's name is required."
      );
    }

    if (!normalizeString(body.mother_name)) {
      return validationError(
        "Mother's name is required."
      );
    }

    const phoneErrors = [
      validatePhoneField(
        "Student Phone Number",
        body.phone,
        true
      ),
      validatePhoneField(
        "Father's Phone Number",
        body.father_phone,
        true
      ),
      validatePhoneField(
        "Mother's Phone Number",
        body.mother_phone
      ),
      validatePhoneField(
        "Alternate Mobile Number",
        body.guardian_alternative_mobile
      ),
      validatePhoneField(
        "Emergency Contact Number",
        body.emergency_contact_number
      ),
    ].find(Boolean);

    if (phoneErrors) {
      return validationError(phoneErrors);
    }

    const email =
      normalizeString(body.email);
    if (email && !emailPattern.test(email)) {
      return validationError(
        "Please enter a valid email address."
      );
    }

    const admissionDateInput = normalizeString(
      body.admission_date
    );
    const admissionDate = admissionDateInput
      ? new Date(admissionDateInput)
      : new Date();

    if (
      !Number.isNaN(admissionDate.getTime()) &&
      admissionDate < dobDate
    ) {
      return validationError(
        "Admission date cannot be earlier than Date of Birth."
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
        "Select an academic year before adding a student."
      );
    }

    const classId =
      Number(
        body.current_class_id ??
          body.class_id
      ) || null;
    const sectionId =
      Number(
        body.current_section_id ??
          body.section_id
      ) || null;

    if (!classId) {
      return validationError(
        "Class is required before adding a student."
      );
    }

    if (!sectionId) {
      return validationError(
        "Section is required before adding a student."
      );
    }

    if (classId) {
      const classRows =
        await prisma.$queryRawUnsafe<
          StudentRow[]
        >(
          `
          SELECT id, school_id
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
          StudentRow[]
        >(
          `
          SELECT id, class_id, school_id
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

    const fullName = [
      body.first_name,
      body.middle_name,
      body.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    if (
      alternatePhoneConflictsWithPrimary({
        primary: [
          body.phone,
          body.father_phone,
          body.mother_phone,
        ],
        alternates: [
          body.guardian_alternative_mobile,
        ],
      })
    ) {
      return validationError(
        "Guardian Alternative Mobile must be different from the student, father, and mother phone numbers."
      );
    }

    const schoolRows =
      await prisma.$queryRawUnsafe<
        StudentRow[]
      >(
        `
        SELECT id, school_code
        FROM schools
        WHERE id = $1::int
        LIMIT 1
        `,
        schoolId
      );
    const schoolCode = cleanCode(
      schoolRows[0]?.school_code
    );
    const admissionNumber =
      await nextStudentNumber(
        schoolId,
        schoolCode,
        "AD"
      );
    const enrollmentNumber =
      await nextStudentNumber(
        schoolId,
        schoolCode,
        "EN"
      );
    const hasPreviousSchool =
      parseYesNo(body.has_previous_school);
    const previousSchoolDetails =
      hasPreviousSchool
        ? String(
            body.previous_school_details || ""
          ).trim() || null
        : null;
    const previousAcademicPerformance =
      hasPreviousSchool
        ? normalizePerformance(
            body.previous_academic_performance ??
              body.previous_school_performance
          )
        : null;

    const hasAcademicGap =
      typeof body.has_academic_gap === "boolean"
        ? body.has_academic_gap
        : String(body.has_academic_gap || "")
            .trim()
            .toLowerCase() === "yes" ||
          String(body.has_academic_gap || "")
            .trim()
            .toLowerCase() === "true";
    const academicGapDuration =
      hasAcademicGap
        ? calculateAcademicGapDuration(
            body.academic_gap_from_year,
            body.academic_gap_to_year
          )
        : null;
    const academicGapFromYear = hasAcademicGap
      ? body.academic_gap_from_year || null
      : null;
    const academicGapToYear = hasAcademicGap
      ? body.academic_gap_to_year || null
      : null;
    const academicGapReason = hasAcademicGap
      ? body.academic_gap_reason || null
      : null;
    const hasBacklogs =
      parseYesNo(body.has_backlogs);
    const backlogs =
      normalizeStudentBacklogs(
        body.backlogs,
        hasBacklogs
      );

    if (
      hasPreviousSchool &&
      (!previousSchoolDetails ||
        !previousAcademicPerformance)
    ) {
      return validationError(
        "Previous school/college details and previous academic performance are required when Has Previous School/College is Yes."
      );
    }

    if (
      hasAcademicGap &&
      (!academicGapFromYear ||
        !academicGapToYear ||
        !academicGapReason)
    ) {
      return validationError(
        "Academic gap details are required when Has Academic Gap is Yes."
      );
    }

    if (hasBacklogs && !backlogs.length) {
      return validationError(
        "At least one backlog record is required when Has Backlogs is Yes."
      );
    }

    const studentInsertColumns = [
      "school_id",
      "academic_year_id",
      "enrollment_number",
      "admission_number",
      "name",
      "first_name",
      "middle_name",
      "last_name",
      "gender",
      "dob",
      "phone",
      "email",
      "blood_group",
      "religion",
      "caste",
      "mother_tongue",
      "address",
      "admission_date",
      "father_name",
      "mother_name",
      "father_phone",
      "mother_phone",
      "father_alternative_mobile",
      "mother_alternative_mobile",
      "guardian_alternative_mobile",
      "emergency_contact_number",
      "emergency_contact_name",
      "emergency_relationship",
      "has_previous_school",
      "has_backlogs",
      "previous_school_details",
      "previous_academic_performance",
      "has_academic_gap",
      "academic_gap_from_year",
      "academic_gap_to_year",
      "academic_gap_duration",
      "academic_gap_reason",
      "roll_number",
      "section_id",
      "current_class_id",
      "current_section_id",
      "created_by",
      "is_active",
      "student_status",
      "status_updated_at",
      "status_reason",
      "created_at",
      "updated_at",
    ];

    const studentInsertValues = [
      schoolId,
      academicYearId,
      enrollmentNumber,
      admissionNumber,
      fullName || body.name || null,
      body.first_name || null,
      body.middle_name || null,
      body.last_name || null,
      nullableString(body.gender),
      dobDate,
      nullableString(body.phone),
      email || null,
      nullableString(body.blood_group),
      nullableString(body.religion),
      nullableString(body.caste),
      nullableString(body.mother_tongue),
      addressLine1,
      admissionDate,
      nullableString(body.father_name),
      nullableString(body.mother_name),
      nullableString(body.father_phone),
      nullableString(body.mother_phone),
      null,
      null,
      nullableString(body.guardian_alternative_mobile),
      nullableString(body.emergency_contact_number),
      body.emergency_contact_name || null,
      body.emergency_relationship || null,
      hasPreviousSchool,
      hasBacklogs,
      previousSchoolDetails,
      previousAcademicPerformance,
      hasAcademicGap,
      academicGapFromYear,
      academicGapToYear,
      academicGapDuration,
      academicGapReason,
      null,
      sectionId,
      classId,
      sectionId,
      user.id || null,
      true,
      "ACTIVE",
      new Date(),
      "Admission created",
      new Date(),
      new Date(),
    ];

    const rows =
      await prisma.$queryRawUnsafe<
        StudentRow[]
      >(
        `INSERT INTO students (${studentInsertColumns.join(", ")})
         VALUES (${studentInsertValues.map((_, index) => `$${index + 1}`).join(", ")})
         RETURNING *`,
        ...studentInsertValues
      );

    let student = rows[0];

    if (
      student?.id &&
      academicYearId
    ) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO student_year_enrollments (
          school_id,
          student_id,
          academic_year_id,
          class_id,
          section_id,
          roll_number,
          status,
          source,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,'ACTIVE','admission',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (student_id, academic_year_id)
        DO UPDATE SET
          class_id = EXCLUDED.class_id,
          section_id = EXCLUDED.section_id,
          roll_number = EXCLUDED.roll_number,
          status = 'ACTIVE',
          source = 'admission',
          updated_at = CURRENT_TIMESTAMP
        `,
        schoolId,
        Number(student.id),
        academicYearId,
        classId,
        sectionId,
        null
      );

      await insertStudentAcademicHistory({
        studentId: Number(student.id),
        schoolId,
        academicYearId,
        classId,
        sectionId,
        promotionStatus: "ADMITTED",
        userId: user.id || null,
        metadata: {
          source: "student_admission",
          admissionNumber,
          enrollmentNumber,
        },
      });

      if (backlogs.length) {
        for (const backlog of backlogs) {
          await prisma.$executeRawUnsafe(
            `
            INSERT INTO student_backlogs (
              student_id,
              school_id,
              academic_year_id,
              subject_id,
              exam_id,
              backlog_status,
              backlog_reason,
              cleared_date,
              remarks,
              created_at,
              updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
            `,
            Number(student.id),
            schoolId,
            academicYearId,
            backlog.subject_id,
            backlog.exam_id,
            backlog.backlog_status,
            backlog.backlog_reason,
            backlog.cleared_date
              ? new Date(backlog.cleared_date)
              : null,
            backlog.remarks
          );

          await recordEvent({
            school_id: schoolId,
            academic_year_id: academicYearId,
            user_id: user.id,
            actor_role: user.role,
            module_name: "students",
            event_type:
              backlog.backlog_status === "CLEARED"
                ? "BACKLOG_CLEARED"
                : "BACKLOG_CREATED",
            action: "create",
            entity_type: "student",
            entity_id: Number(student.id),
            summary:
              backlog.backlog_status === "CLEARED"
                ? "Cleared backlog created with student admission"
                : "Backlog created with student admission",
            payload: {
              subject_id: backlog.subject_id,
              exam_id: backlog.exam_id,
              backlog_status: backlog.backlog_status,
              backlog_reason: backlog.backlog_reason,
            },
          });
        }
      }

      await assignAlphabeticalRollNumbers({
        schoolId,
        academicYearId,
        classId,
        sectionId,
      });

      const refreshedRows =
        await prisma.$queryRawUnsafe<
          StudentRow[]
        >(
          `
          SELECT *
          FROM students
          WHERE id = $1::int
          LIMIT 1
          `,
          Number(student.id)
        );

      student =
        refreshedRows[0] || student;
    }

    if (student?.id && hasFile(dobCertificate)) {
      const savedDocument =
        await saveStudentDocumentFile({
          file: dobCertificate,
          schoolId,
          studentId: Number(student.id),
          admissionNumber,
        });

      await prisma.student_documents.create({
        data: {
          school_id: schoolId,
          academic_year_id: academicYearId,
          student_id: Number(student.id),
          document_type: "DOB_CERTIFICATE",
          document_number: `${admissionNumber}-DOB-CERTIFICATE`,
          title: "DOB Certificate",
          file_url: savedDocument.fileUrl,
          metadata: {
            original_name: dobCertificate.name,
            file_name: savedDocument.fileName,
            mime_type: dobCertificate.type,
            size: dobCertificate.size,
          },
          created_by: user.id || null,
          updated_by: user.id || null,
        },
      });

      await recordEvent({
        school_id: schoolId,
        academic_year_id: academicYearId,
        user_id: user.id,
        actor_role: user.role,
        module_name: "students",
        event_type: "DOCUMENT_UPLOADED",
        action: "create",
        entity_type: "student",
        entity_id: Number(student.id),
        summary:
          "DOB certificate uploaded with student admission",
        payload: {
          document_type: "DOB_CERTIFICATE",
          file_url: savedDocument.fileUrl,
        },
      });
    }

    await recordEvent({
      school_id: schoolId,
      academic_year_id:
        academicYearId,
      user_id: user.id,
      actor_role: user.role,
      module_name: "students",
      event_type: "STUDENT_CREATED",
      action: "create",
      entity_type: "student",
      entity_id:
        typeof student?.id === "number"
          ? student.id
          : Number(student?.id),
      summary:
        "Student record created",
      payload: {
        admission_number:
          admissionNumber,
        enrollment_number:
          enrollmentNumber,
        class_id: classId,
        section_id: sectionId,
      },
    });

    if (student?.id) {
      await notifyStudentCreated(
        Number(student.id),
        user.id || null
      ).catch((error) => {
        console.error(
          "WhatsApp student_created dispatch failed:",
          error instanceof Error
            ? error.message
            : error
        );
      });
    }

    return NextResponse.json(
      student,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Student save error:",
      error
    );

    return apiError(
      error,
      "Failed to save student"
    );
  }
}
