import fs from "fs/promises";
import path from "path";

import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import { queueWhatsAppMessage } from "@/lib/notifications/whatsapp";
import {
  certificateDocumentNumber,
  cleanSchoolCode,
} from "@/lib/student-lifecycle";
import {
  renderStudentCertificatePdf,
  studentCertificateFileName,
  studentCertificateRelativePath,
} from "@/lib/student-certificates";

type StudentRow = Record<string, unknown>;

const appBaseUrl = () =>
  String(
    process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://erp.tottechsolutions.com"
  ).replace(/\/+$/, "");

const currentAcademicYearLabel = (
  student: StudentRow
) =>
  String(
    student.academic_year ||
      student.selected_academic_year ||
      "-"
  ).trim() || "-";

const studentName = (student: StudentRow) =>
  String(
    [
      student.first_name,
      student.middle_name,
      student.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
      student.name ||
      "-"
  ).trim() || "-";

const recipientPhone = (
  student: StudentRow
) =>
  String(
    student.phone ||
      student.father_phone ||
      student.mother_phone ||
      ""
  )
    .trim();

async function loadStudentContext(
  studentId: number,
  academicYearId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<StudentRow[]>(
      `
      SELECT
        s.*,
        sc.school_name,
        sc.school_code,
        sc.address AS school_address,
        sc.phone AS school_phone,
        sc.email AS school_email,
        sc.recognition_number,
        sc.recognition_authority,
        sc.recognition_start_date,
        sc.recognition_expiry_date,
        sc.affiliation_number,
        sc.affiliation_authority,
        sc.affiliation_start_date,
        sc.affiliation_expiry_date,
        c.class_name,
        sec.section_name,
        ay.academic_year AS selected_academic_year
      FROM students s
      LEFT JOIN schools sc ON sc.id = s.school_id
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
        AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
      LEFT JOIN classes c
        ON c.id = COALESCE(s.current_class_id, sye.class_id)
      LEFT JOIN sections sec
        ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
      LEFT JOIN academic_years ay
        ON ay.id = COALESCE(s.academic_year_id, sye.academic_year_id)
      WHERE s.id = $1::int
      ORDER BY sye.academic_year_id DESC NULLS LAST, sye.id DESC
      LIMIT 1
      `,
      studentId,
      academicYearId ?? null
    );

  return rows[0] || null;
}

async function nextDocumentSequence(
  schoolId: number,
  documentType: string
) {
  const rows =
    await prisma.$queryRawUnsafe<
      { count: number }[]
    >(
      `
      SELECT COUNT(*)::int AS count
      FROM student_documents
      WHERE school_id = $1::int
        AND document_type = $2
      `,
      schoolId,
      documentType
    );

  return Number(rows[0]?.count || 0) + 1;
}

async function saveCertificatePdf(
  fileName: string,
  buffer: Buffer
) {
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "students",
    "certificates"
  );
  await fs.mkdir(uploadDir, {
    recursive: true,
  });
  const fullPath = path.join(
    uploadDir,
    fileName
  );
  await fs.writeFile(fullPath, buffer);

  return fullPath;
}

function docNumberPrefix(
  type: "TRANSFER_CERTIFICATE" | "STUDY_CERTIFICATE"
) {
  return type === "TRANSFER_CERTIFICATE"
    ? "TC"
    : "SC";
}

function publicUrl(relativePath: string) {
  return `${appBaseUrl()}${relativePath}`;
}

export async function issueStudentCertificate(
  input: {
    studentId: number;
    certificateType:
      | "TRANSFER_CERTIFICATE"
      | "STUDY_CERTIFICATE";
    issueDate?: Date | null;
    reasonForLeaving?: string | null;
    conduct?: string | null;
    attendance?: string | null;
    userId?: number | null;
    academicYearId?: number | null;
  }
) {
  const issueDate =
    input.issueDate || new Date();
  const student =
    await loadStudentContext(
      input.studentId,
      input.academicYearId
    );

  if (!student) {
    throw new Error("Student not found.");
  }

  const schoolId =
    Number(student.school_id) || null;
  if (!schoolId) {
    throw new Error(
      "Student school/college information is missing."
    );
  }

  const schoolCode = cleanSchoolCode(
    student.school_code ||
      student.school_name ||
      "KVS"
  );
  const sequence =
    await nextDocumentSequence(
      schoolId,
      input.certificateType
    );
  const documentNumber =
    certificateDocumentNumber(
      schoolCode,
      docNumberPrefix(input.certificateType),
      sequence,
      issueDate
    );

  const fileName =
    studentCertificateFileName(
      documentNumber,
      input.certificateType
    );
  const fileUrl =
    studentCertificateRelativePath(fileName);

  const pdfBuffer =
    await renderStudentCertificatePdf({
      documentNumber,
      title:
        input.certificateType ===
        "TRANSFER_CERTIFICATE"
          ? "Transfer Certificate"
          : "Study Certificate",
      subtitle:
        input.certificateType ===
        "TRANSFER_CERTIFICATE"
          ? "Transfer certificate issued after verifying student lifecycle records."
          : "Study certificate issued from the student academic profile.",
      school: {
        school_name:
          String(student.school_name || "").trim() ||
          null,
        school_code:
          String(student.school_code || "").trim() ||
          null,
        school_logo:
          String(
            student.school_logo ||
              student.logo_url ||
              ""
          ).trim() || null,
        logo_url:
          String(
            student.school_logo ||
              student.logo_url ||
              ""
          ).trim() || null,
        address:
          String(student.school_address || "").trim() ||
          null,
        phone:
          String(student.school_phone || "").trim() ||
          null,
        email:
          String(student.school_email || "").trim() ||
          null,
        recognition_number:
          String(
            student.recognition_number || ""
          ).trim() || null,
        affiliation_number:
          String(
            student.affiliation_number || ""
          ).trim() || null,
        recognition_authority:
          String(
            student.recognition_authority || ""
          ).trim() || null,
        affiliation_authority:
          String(
            student.affiliation_authority || ""
          ).trim() || null,
      },
      student,
      academicYear:
        currentAcademicYearLabel(student),
      className:
        String(student.class_name || "").trim() ||
        null,
      sectionName:
        String(student.section_name || "").trim() ||
        null,
      issueDate,
      dateOfJoining: (student.admission_date ||
        student.created_at ||
        null) as string | Date | null,
      dateOfLeaving: (input.certificateType ===
        "TRANSFER_CERTIFICATE"
          ? issueDate
          : null) as string | Date | null,
      reasonForLeaving:
        input.reasonForLeaving || null,
      conduct: input.conduct || null,
      attendance:
        input.attendance || null,
      statusLabel:
        String(
          student.student_status || "ACTIVE"
        ).trim() || "ACTIVE",
      narrative:
        input.certificateType ===
        "TRANSFER_CERTIFICATE"
          ? `This is to certify that ${studentName(student)} bearing Admission Number ${String(student.admission_number || "-")} has been studying in this institution and the Transfer Certificate is issued on request after completion of the required formalities.`
          : `This is to certify that ${studentName(student)} bearing Admission Number ${String(student.admission_number || "-")} is a bonafide student of ${String(student.school_name || "the school/college")}, studying during the current academic year.`,
      extraRows:
        input.certificateType ===
        "TRANSFER_CERTIFICATE"
          ? [
              [
                "Last Class Attended",
                student.class_name || "-",
              ],
            ]
          : [],
    });

  const fullPath = await saveCertificatePdf(
    fileName,
    pdfBuffer
  );

  const documentType =
    input.certificateType ===
    "TRANSFER_CERTIFICATE"
      ? "TRANSFER_CERTIFICATE"
      : "STUDY_CERTIFICATE";

  const document = await prisma.student_documents.create(
    {
      data: {
        school_id: schoolId,
        academic_year_id:
          Number(
            student.academic_year_id ||
              input.academicYearId ||
              null
          ) || null,
        student_id: input.studentId,
        document_type: documentType,
        document_number: documentNumber,
        title:
          input.certificateType ===
          "TRANSFER_CERTIFICATE"
            ? "Transfer Certificate"
            : "Study Certificate",
        file_url: fileUrl,
        issued_on: issueDate,
        metadata: {
          certificateType: documentType,
          schoolName:
            student.school_name || null,
          schoolCode:
            student.school_code || null,
          className:
            student.class_name || null,
          sectionName:
            student.section_name || null,
          academicYear:
            currentAcademicYearLabel(
              student
            ),
          filePath: fullPath,
        },
        created_by: input.userId ?? null,
        updated_by: input.userId ?? null,
      },
    }
  );

  if (
    input.certificateType ===
    "TRANSFER_CERTIFICATE"
  ) {
    await prisma.$executeRawUnsafe(
      `
      UPDATE students
      SET student_status = 'TRANSFERRED',
          is_active = false,
          status_reason = $1,
          status_updated_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2::int
      `,
      input.reasonForLeaving ||
        "Transfer certificate issued",
      input.studentId
    );

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO student_dropout_records (
        school_id,
        student_id,
        from_class_id,
        from_section_id,
        dropout_academic_year_id,
        dropout_category,
        dropout_reason,
        dropout_date,
        remarks,
        approved_by,
        created_by,
        metadata
      )
      VALUES ($1,$2,$3,$4,$5,'TRANSFER',$6,$7,$8,$9,$9,$10::jsonb)
      `,
      schoolId,
      input.studentId,
      Number(student.current_class_id) ||
        null,
      Number(student.current_section_id) ||
        null,
      Number(
        student.academic_year_id ||
          input.academicYearId ||
          null
      ) || null,
      input.reasonForLeaving || null,
      issueDate,
      "Transfer certificate issued",
      input.userId ?? null,
      JSON.stringify({
        certificateDocumentId: document.id,
        documentNumber,
        source: "transfer_certificate",
      })
    );

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
      VALUES ($1,$2,$3,$4,$5,'TRANSFERRED',$6,$7,$8::jsonb)
      `,
      input.studentId,
      schoolId,
      Number(
        student.academic_year_id ||
          input.academicYearId ||
          null
      ) || null,
      Number(student.current_class_id) ||
        null,
      Number(student.current_section_id) ||
        null,
      issueDate,
      input.userId ?? null,
      JSON.stringify({
        certificateDocumentId: document.id,
        documentNumber,
        source: "transfer_certificate",
      })
    );
  }

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO student_timelines (
      school_id,
      student_id,
      academic_year_id,
      title,
      description,
      source_module,
      visibility,
      metadata,
      occurred_at,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,'student_lifecycle','SCHOOL',$6::jsonb,$7,CURRENT_TIMESTAMP)
    `,
    schoolId,
    input.studentId,
    Number(
      student.academic_year_id ||
        input.academicYearId ||
        null
    ) || null,
    input.certificateType ===
      "TRANSFER_CERTIFICATE"
      ? "Transfer Certificate Issued"
      : "Study Certificate Issued",
    input.certificateType ===
      "TRANSFER_CERTIFICATE"
      ? `Transfer certificate ${documentNumber} generated and student marked as transferred.`
      : `Study certificate ${documentNumber} generated.`,
    JSON.stringify({
      documentId: document.id,
      documentNumber,
      fileUrl,
      certificateType:
        input.certificateType,
    }),
    issueDate
  );

  await recordEvent({
    school_id: schoolId,
    academic_year_id:
      Number(
        student.academic_year_id ||
          input.academicYearId ||
          null
      ) || null,
    user_id: input.userId ?? null,
    actor_role: "SYSTEM",
    module_name: "students",
    event_type:
      input.certificateType ===
      "TRANSFER_CERTIFICATE"
        ? "TRANSFER_CERTIFICATE_ISSUED"
        : "STUDY_CERTIFICATE_ISSUED",
    action:
      input.certificateType ===
      "TRANSFER_CERTIFICATE"
        ? "transfer_certificate"
        : "study_certificate",
    entity_type: "student",
    entity_id: input.studentId,
    summary:
      input.certificateType ===
      "TRANSFER_CERTIFICATE"
        ? "Transfer certificate issued"
        : "Study certificate issued",
    payload: {
      documentId: document.id,
      documentNumber,
      fileUrl,
    },
  });

  const phone = recipientPhone(student);
  if (phone) {
    await queueWhatsAppMessage({
      templateName:
        input.certificateType ===
        "TRANSFER_CERTIFICATE"
          ? "transfer_certificate_issued"
          : "study_certificate_issued",
      schoolId,
      academicYearId:
        Number(
          student.academic_year_id ||
            input.academicYearId ||
            null
        ) || null,
      studentId: input.studentId,
      userId: input.userId ?? null,
      recipient: phone,
      variables: [
        studentName(student),
        String(student.admission_number || "-"),
        documentNumber,
        `${appBaseUrl()}${fileUrl}`,
      ],
      triggeredBy:
        input.certificateType ===
        "TRANSFER_CERTIFICATE"
          ? "TRANSFER_CERTIFICATE_ISSUED"
          : "STUDY_CERTIFICATE_ISSUED",
      entityType: "student",
      entityId: input.studentId,
    }).catch((error) => {
      console.error(
        "WhatsApp certificate queue failed:",
        error
      );
    });
  }

  return {
    student,
    document,
    filePath: fullPath,
    fileUrl,
    publicUrl: `${appBaseUrl()}${fileUrl}`,
    documentNumber,
  };
}
