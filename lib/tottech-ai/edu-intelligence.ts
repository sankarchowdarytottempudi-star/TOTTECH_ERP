import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import {
  getGovernanceSnapshot,
  GovernanceUser,
} from "@/lib/governance/rbac";
import { recordEvent } from "@/lib/governance/events";
import { recordAIObservability } from "./observability";
import { answerKnowledgeQuery } from "./knowledge";

type EduInput = {
  user: GovernanceUser;
  prompt: string;
  school_id?: number | null;
  academic_year_id?: number | null;
  include_internet?: boolean;
};

type SourceTrace = {
  source_key: string;
  source_type: string;
  display_name: string;
  priority: number;
  official: boolean;
  evidence: string[];
};

type QuestionType =
  | "DATA_QUERY"
  | "ANALYTICS_QUERY"
  | "GENERAL_EDUCATION_QUERY"
  | "RAG_QUERY";

type SchoolScope = {
  schoolId: number | null;
  academicYearId: number | null;
  schoolName: string;
  academicYear: string;
  canUseAllSchools: boolean;
  restricted: boolean;
  restrictionReason?: string;
};

type CountRow = {
  count: number;
};

type StudentSearchRow = {
  id: number;
  school_id: number | null;
  academic_year_id: number | null;
  student_name: string | null;
  admission_number: string | null;
  phone: string | null;
  class_name: string | null;
  section_name: string | null;
};

type AttendanceRiskRow = {
  student_id: number;
  student_name: string | null;
  class_name: string | null;
  section_name: string | null;
  present_count: number;
  total_count: number;
  attendance_percent: number;
};

type ClassRiskRow = {
  class_name: string | null;
  section_name: string | null;
  risk_students: number;
};

type SubjectAverageRow = {
  subject_name: string | null;
  average_percent: number | null;
  entries: number;
};

type FinanceRow = {
  total_due: string | number | null;
  pending_invoices: number;
};

type CollectionRow = {
  total_collected: string | number | null;
  payment_count: number;
};

type TeacherRow = {
  teacher_id: number;
  teacher_name: string | null;
  department: string | null;
  designation: string | null;
  class_count: number;
};

type KnowledgeDocumentRow = {
  id: number;
  title: string;
  category: string;
  domain: string | null;
  source: string | null;
  source_url: string | null;
  content: string;
  confidence_score: string | number;
};

const safeExcerpt = (
  value: string,
  length = 1200
) => value.slice(0, length);

const hashText = (value: string) =>
  crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const numberValue = (
  value: unknown
) => {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : 0;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? parsed
      : 0;
  }

  return 0;
};

const formatMoney = (value: unknown) =>
  `₹${Math.round(numberValue(value)).toLocaleString("en-IN")}`;

const formatPercent = (value: unknown) =>
  `${Math.round(numberValue(value))}%`;

const isAdminRole = (role?: string) => {
  const text = String(role || "")
    .toUpperCase()
    .replace(/[^A-Z_]/g, "_");
  return (
    text.includes("SUPER_ADMIN") ||
    text.includes("OWNER") ||
    text.includes("PRINCIPAL") ||
    text.includes("ADMIN")
  );
};

const isTeacherRole = (role?: string) =>
  String(role || "")
    .toUpperCase()
    .includes("TEACHER");

const isParentRole = (role?: string) =>
  String(role || "")
    .toUpperCase()
    .includes("PARENT");

const isStudentRole = (role?: string) =>
  String(role || "")
    .toUpperCase()
    .includes("STUDENT");

function classifyQuestion(
  prompt: string
): QuestionType {
  const text = normalize(prompt);

  const ragTerms = [
    "policy",
    "rule",
    "refund",
    "handbook",
    "circular",
    "promotion criteria",
    "attendance rule",
    "school/college policy",
    "fee policy",
  ];

  if (
    ragTerms.some((term) =>
      text.includes(term)
    )
  ) {
    return "RAG_QUERY";
  }

  const analyticsTerms = [
    "why",
    "improve",
    "recommend",
    "predict",
    "likely",
    "risk",
    "intervention",
    "underperform",
    "declining",
    "support",
    "biggest risks",
    "health report",
    "action plan",
    "focus on today",
    "may discontinue",
    "likely to fail",
  ];

  if (
    analyticsTerms.some((term) =>
      text.includes(term)
    )
  ) {
    return "ANALYTICS_QUERY";
  }

  const dataTerms = [
    "how many",
    "show",
    "list",
    "attendance",
    "fee",
    "collection",
    "pending",
    "students",
    "teachers",
    "marks",
    "results",
    "enrolled",
    "absent",
    "present",
    "invoices",
    "payments",
  ];

  if (
    dataTerms.some((term) =>
      text.includes(term)
    )
  ) {
    return "DATA_QUERY";
  }

  return "GENERAL_EDUCATION_QUERY";
}

async function resolveScope(
  input: EduInput
): Promise<SchoolScope> {
  const governance =
    await getGovernanceSnapshot(input.user);
  const canUseAllSchools =
    isAdminRole(input.user.role);
  const userSchoolId =
    Number(input.user.school_id) || null;
  const requestedSchoolId =
    input.school_id ?? userSchoolId ?? null;
  const schoolId =
    canUseAllSchools
      ? requestedSchoolId
      : userSchoolId;

  if (
    !canUseAllSchools &&
    !userSchoolId
  ) {
    return {
      schoolId: null,
      academicYearId: null,
      schoolName:
        "no assigned school/college",
      academicYear:
        "not configured",
      canUseAllSchools,
      restricted: true,
      restrictionReason:
        "Your role is not assigned to a school/college, so EduGPT cannot access institution records.",
    };
  }

  const school =
    schoolId
      ? await prisma.schools.findUnique({
          where: {
            id: schoolId,
          },
          select: {
            id: true,
            school_name: true,
          },
        })
      : null;
  const academicYearId =
    input.academic_year_id ??
    governance.activeAcademicYear?.id ??
    null;
  const academicYear =
    academicYearId
      ? await prisma.academic_years.findUnique({
          where: {
            id: academicYearId,
          },
          select: {
            academic_year: true,
          },
        })
      : null;

  return {
    schoolId,
    academicYearId,
    schoolName:
      school?.school_name ||
      input.user.school_name ||
      (schoolId
        ? `School #${schoolId}`
        : "all accessible schools/colleges"),
    academicYear:
      academicYear?.academic_year ||
      governance.activeAcademicYear
        ?.academic_year ||
      "all/current years",
    canUseAllSchools,
    restricted: false,
  };
}

async function rawRows<T>(
  sql: string,
  ...values: unknown[]
) {
  return prisma.$queryRawUnsafe<T[]>(
    sql,
    ...values
  );
}

function schoolYearWhere(alias = "") {
  const prefix = alias
    ? `${alias}.`
    : "";
  return `
    ($1::int IS NULL OR ${prefix}school_id = $1::int)
    AND ($2::int IS NULL OR ${prefix}academic_year_id = $2::int OR ${prefix}academic_year_id IS NULL)
  `;
}

async function getCount(
  table: string,
  scope: SchoolScope
) {
  const rows =
    await rawRows<CountRow>(
      `
      SELECT COUNT(*)::int AS count
      FROM ${table}
      WHERE ${schoolYearWhere()}
      `,
      scope.schoolId,
      scope.academicYearId
    ).catch(() => []);

  return rows[0]?.count ?? 0;
}

async function getSchoolSnapshot(
  scope: SchoolScope
) {
  const [
    students,
    teachers,
    attendance,
    marks,
    invoices,
    payments,
    finance,
    collections,
  ] = await Promise.all([
    getCount("students", scope),
    getCount("teachers", scope),
    getCount("attendance_master", scope),
    getCount("marks", scope),
    getCount("invoices", scope),
    getCount("payments", scope),
    rawRows<FinanceRow>(
      `
      SELECT
        COALESCE(SUM(GREATEST(COALESCE(balance_amount, total_amount, 0), 0)), 0)::numeric AS total_due,
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) NOT IN ('PAID', 'CANCELLED', 'REFUNDED'))::int AS pending_invoices
      FROM invoices
      WHERE ${schoolYearWhere()}
      `,
      scope.schoolId,
      scope.academicYearId
    ).catch(() => []),
    rawRows<CollectionRow>(
      `
      SELECT
        COALESCE(SUM(amount), 0)::numeric AS total_collected,
        COUNT(*)::int AS payment_count
      FROM payments
      WHERE ${schoolYearWhere()}
      `,
      scope.schoolId,
      scope.academicYearId
    ).catch(() => []),
  ]);

  return {
    students,
    teachers,
    attendance,
    marks,
    invoices,
    payments,
    totalDue:
      finance[0]?.total_due ?? 0,
    pendingInvoices:
      finance[0]?.pending_invoices ??
      0,
    totalCollected:
      collections[0]
        ?.total_collected ?? 0,
    paymentCount:
      collections[0]
        ?.payment_count ?? 0,
  };
}

async function getAttendanceRisk(
  scope: SchoolScope,
  threshold = 75
) {
  const rows =
    await rawRows<AttendanceRiskRow>(
      `
      WITH student_attendance AS (
        SELECT
          s.id AS student_id,
          COALESCE(NULLIF(s.name, ''), concat_ws(' ', s.first_name, s.middle_name, s.last_name), s.admission_number, 'Unnamed Student') AS student_name,
          c.class_name,
          sec.section_name,
          COUNT(a.id) FILTER (WHERE UPPER(COALESCE(a.status, '')) = 'PRESENT')::int AS present_count,
          COUNT(a.id)::int AS total_count
        FROM students s
        LEFT JOIN attendance_master a
          ON a.student_id = s.id
          AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
        LEFT JOIN classes c ON c.id = s.current_class_id
        LEFT JOIN sections sec ON sec.id = s.current_section_id
        WHERE ${schoolYearWhere("s")}
          AND COALESCE(s.is_active, true) = true
        GROUP BY s.id, student_name, c.class_name, sec.section_name
      )
      SELECT
        student_id,
        student_name,
        class_name,
        section_name,
        present_count,
        total_count,
        CASE WHEN total_count > 0 THEN ROUND((present_count::numeric / total_count::numeric) * 100, 2) ELSE 0 END::float AS attendance_percent
      FROM student_attendance
      WHERE total_count > 0
        AND ((present_count::numeric / total_count::numeric) * 100) < $3::numeric
      ORDER BY attendance_percent ASC, student_name ASC
      LIMIT 50
      `,
      scope.schoolId,
      scope.academicYearId,
      threshold
    ).catch(() => []);

  const classRows =
    await rawRows<ClassRiskRow>(
      `
      WITH student_attendance AS (
        SELECT
          s.id AS student_id,
          COALESCE(c.class_name, 'Unassigned') AS class_name,
          COALESCE(sec.section_name, '-') AS section_name,
          COUNT(a.id) FILTER (WHERE UPPER(COALESCE(a.status, '')) = 'PRESENT')::int AS present_count,
          COUNT(a.id)::int AS total_count
        FROM students s
        LEFT JOIN attendance_master a
          ON a.student_id = s.id
          AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
        LEFT JOIN classes c ON c.id = s.current_class_id
        LEFT JOIN sections sec ON sec.id = s.current_section_id
        WHERE ${schoolYearWhere("s")}
          AND COALESCE(s.is_active, true) = true
        GROUP BY s.id, c.class_name, sec.section_name
      )
      SELECT
        class_name,
        section_name,
        COUNT(*)::int AS risk_students
      FROM student_attendance
      WHERE total_count > 0
        AND ((present_count::numeric / total_count::numeric) * 100) < $3::numeric
      GROUP BY class_name, section_name
      ORDER BY risk_students DESC, class_name ASC
      LIMIT 12
      `,
      scope.schoolId,
      scope.academicYearId,
      threshold
    ).catch(() => []);

  return {
    students: rows,
    classes: classRows,
  };
}

const stopwords = new Set([
  "how",
  "can",
  "improve",
  "student",
  "students",
  "child",
  "academic",
  "performance",
  "why",
  "is",
  "are",
  "the",
  "what",
  "which",
  "show",
  "give",
  "report",
  "principal",
  "owner",
  "teacher",
  "parent",
]);

function extractSearchTerms(
  prompt: string
) {
  return normalize(prompt)
    .split(" ")
    .filter(
      (term) =>
        term.length >= 3 &&
        !stopwords.has(term)
    )
    .slice(0, 6);
}

async function findStudent(
  prompt: string,
  scope: SchoolScope
) {
  const terms =
    extractSearchTerms(prompt);

  if (!terms.length) {
    return null;
  }

  const rows =
    await rawRows<StudentSearchRow>(
      `
      SELECT
        s.id,
        s.school_id,
        s.academic_year_id,
        COALESCE(NULLIF(s.name, ''), concat_ws(' ', s.first_name, s.middle_name, s.last_name), s.admission_number, 'Unnamed Student') AS student_name,
        s.admission_number,
        s.phone,
        c.class_name,
        sec.section_name
      FROM students s
      LEFT JOIN classes c ON c.id = s.current_class_id
      LEFT JOIN sections sec ON sec.id = s.current_section_id
      WHERE ${schoolYearWhere("s")}
        AND (
          COALESCE(s.name, '') ILIKE ANY($3::text[])
          OR concat_ws(' ', s.first_name, s.middle_name, s.last_name) ILIKE ANY($3::text[])
          OR COALESCE(s.admission_number, '') ILIKE ANY($3::text[])
          OR COALESCE(s.phone, '') ILIKE ANY($3::text[])
          OR COALESCE(s.father_name, '') ILIKE ANY($3::text[])
          OR COALESCE(s.mother_name, '') ILIKE ANY($3::text[])
        )
      ORDER BY s.updated_at DESC NULLS LAST, s.id DESC
      LIMIT 5
      `,
      scope.schoolId,
      scope.academicYearId,
      terms.map((term) => `%${term}%`)
    ).catch(() => []);

  return rows[0] ?? null;
}

async function getStudentSubjectAverages(
  studentId: number,
  scope: SchoolScope
) {
  return rawRows<SubjectAverageRow>(
    `
    SELECT
      COALESCE(sub.subject_name, 'Overall') AS subject_name,
      ROUND(AVG(CASE WHEN COALESCE(m.total_marks, 0) > 0 THEN (m.obtained_marks / m.total_marks) * 100 ELSE NULL END), 2)::float AS average_percent,
      COUNT(*)::int AS entries
    FROM marks m
    LEFT JOIN subjects sub ON sub.id = m.subject_id
    WHERE m.student_id = $3::int
      AND ${schoolYearWhere("m")}
    GROUP BY COALESCE(sub.subject_name, 'Overall')
    HAVING COUNT(*) > 0
    ORDER BY average_percent ASC NULLS LAST
    `,
    scope.schoolId,
    scope.academicYearId,
    studentId
  ).catch(() => []);
}

async function getStudentAttendancePercent(
  studentId: number,
  scope: SchoolScope
) {
  const rows =
    await rawRows<{
      present_count: number;
      total_count: number;
      attendance_percent: number;
    }>(
      `
      SELECT
        COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'PRESENT')::int AS present_count,
        COUNT(*)::int AS total_count,
        CASE WHEN COUNT(*) > 0
          THEN ROUND((COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'PRESENT')::numeric / COUNT(*)::numeric) * 100, 2)
          ELSE 0
        END::float AS attendance_percent
      FROM attendance_master
      WHERE student_id = $3::int
        AND ${schoolYearWhere()}
      `,
      scope.schoolId,
      scope.academicYearId,
      studentId
    ).catch(() => []);

  return rows[0] ?? {
    present_count: 0,
    total_count: 0,
    attendance_percent: 0,
  };
}

async function getTeachers(
  scope: SchoolScope
) {
  return rawRows<TeacherRow>(
    `
    SELECT
      t.id AS teacher_id,
      trim(concat_ws(' ', t.first_name, t.last_name)) AS teacher_name,
      t.department,
      t.designation,
      COUNT(c.id)::int AS class_count
    FROM teachers t
    LEFT JOIN classes c ON c.class_teacher_id = t.id
    WHERE ${schoolYearWhere("t")}
      AND COALESCE(t.is_active, true) = true
    GROUP BY t.id, teacher_name, t.department, t.designation
    ORDER BY class_count DESC, teacher_name ASC
    LIMIT 20
    `,
    scope.schoolId,
    scope.academicYearId
  ).catch(() => []);
}

async function retrieveEducationKnowledge(
  prompt: string,
  scope: SchoolScope
) {
  const terms =
    extractSearchTerms(prompt);
  const query =
    terms.join(" ") || prompt;

  return rawRows<KnowledgeDocumentRow>(
    `
    SELECT
      id,
      title,
      category,
      domain,
      source,
      source_url,
      content,
      confidence_score
    FROM education_knowledge_documents
    WHERE is_active = true
      AND ($1::int IS NULL OR school_id = $1::int OR school_id IS NULL)
      AND (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(category, '') || ' ' || coalesce(domain, '') || ' ' || coalesce(content, ''))
          @@ plainto_tsquery('english', $2::text)
        OR title ILIKE ANY($3::text[])
        OR category ILIKE ANY($3::text[])
        OR content ILIKE ANY($3::text[])
      )
    ORDER BY
      CASE WHEN school_id = $1::int THEN 0 ELSE 1 END,
      confidence_score DESC,
      id ASC
    LIMIT 5
    `,
    scope.schoolId,
    query,
    terms.length
      ? terms.map((term) => `%${term}%`)
      : [`%${prompt.slice(0, 40)}%`]
  ).catch(() => []);
}

function sourceTraceFromDocs(
  docs: KnowledgeDocumentRow[]
): SourceTrace[] {
  return docs.map((doc, index) => ({
    source_key: `education_knowledge_${doc.id}`,
    source_type:
      doc.source_url
        ? "DOCUMENT"
        : "KNOWLEDGE_BASE",
    display_name: doc.title,
    priority: index + 1,
    official: false,
    evidence: [
      doc.category,
      safeExcerpt(doc.content, 180),
    ],
  }));
}

function erpSourceTrace(
  evidence: string[],
  tables: string[]
): SourceTrace {
  return {
    source_key: "tottech_one_erp",
    source_type: "ERP",
    display_name:
      "TOTTECH ONE live ERP database",
    priority: 1,
    official: false,
    evidence: [
      `Tables: ${tables.join(", ")}`,
      ...evidence,
    ],
  };
}

async function buildDataAnswer(
  prompt: string,
  scope: SchoolScope
) {
  const text = normalize(prompt);
  const snapshot =
    await getSchoolSnapshot(scope);
  const tables = [
    "students",
    "teachers",
    "attendance_master",
    "marks",
    "invoices",
    "payments",
  ];

  if (
    text.includes("below 75") ||
    text.includes("attendance below") ||
    text.includes("low attendance")
  ) {
    const risk =
      await getAttendanceRisk(scope, 75);
    const classLines =
      risk.classes.length
        ? risk.classes
            .map(
              (row) =>
                `- ${row.class_name}${row.section_name && row.section_name !== "-" ? ` ${row.section_name}` : ""}: ${row.risk_students} students`
            )
            .join("\n")
        : "- No class-wise low-attendance records found.";
    const studentLines =
      risk.students.length
        ? risk.students
            .slice(0, 10)
            .map(
              (row) =>
                `- ${row.student_name}: ${formatPercent(row.attendance_percent)} (${row.class_name || "Unassigned"}${row.section_name ? ` ${row.section_name}` : ""})`
            )
            .join("\n")
        : "- No students currently have recorded attendance below 75% in the selected context.";

    return {
      answer: [
        "Summary",
        `${risk.students.length} students have recorded attendance below 75% in ${scope.schoolName}.`,
        "",
        "Class / Section Breakdown",
        classLines,
        "",
        "Students Requiring Attention",
        studentLines,
        "",
        "Recommended Action",
        risk.students.length
          ? "Start with parent engagement for the lowest-attendance students, then schedule class-teacher follow-up and weekly attendance monitoring."
          : "No immediate attendance intervention is required from the available records.",
        "",
        "Evidence",
        `School/College: ${scope.schoolName}`,
        `Academic Year: ${scope.academicYear}`,
        "Source: attendance_master + students + classes + sections",
        "",
        "Confidence",
        "High (ERP-grounded)",
      ].join("\n"),
      tables: [
        "attendance_master",
        "students",
        "classes",
        "sections",
      ],
      sourceTrace: [
        erpSourceTrace(
          [
            `${risk.students.length} students below 75%`,
            `${risk.classes.length} class/section groups`,
          ],
          [
            "attendance_master",
            "students",
            "classes",
            "sections",
          ]
        ),
      ],
      confidence: 0.94,
    };
  }

  if (
    text.includes("fee") ||
    text.includes("collection") ||
    text.includes("due") ||
    text.includes("invoice") ||
    text.includes("payment")
  ) {
    return {
      answer: [
        "Summary",
        `Finance snapshot for ${scope.schoolName}:`,
        "",
        `- Total collected: ${formatMoney(snapshot.totalCollected)}`,
        `- Payment records: ${snapshot.paymentCount}`,
        `- Pending invoices: ${snapshot.pendingInvoices}`,
        `- Outstanding amount: ${formatMoney(snapshot.totalDue)}`,
        "",
        "What This Means",
        snapshot.pendingInvoices
          ? "There are pending dues requiring follow-up. Prioritize high-balance invoices and students with repeated delays."
          : "No pending invoice risk is visible from the available invoice records.",
        "",
        "Evidence",
        `Academic Year: ${scope.academicYear}`,
        "Source: invoices + payments",
        "",
        "Confidence",
        "High (ERP-grounded)",
      ].join("\n"),
      tables: ["invoices", "payments"],
      sourceTrace: [
        erpSourceTrace(
          [
            `${snapshot.pendingInvoices} pending invoices`,
            `${snapshot.paymentCount} payment records`,
          ],
          ["invoices", "payments"]
        ),
      ],
      confidence: 0.93,
    };
  }

  return {
    answer: [
      "Summary",
      `ERP snapshot for ${scope.schoolName}:`,
      "",
      `- Students: ${snapshot.students}`,
      `- Teachers: ${snapshot.teachers}`,
      `- Attendance records: ${snapshot.attendance}`,
      `- Marks records: ${snapshot.marks}`,
      `- Invoices: ${snapshot.invoices}`,
      `- Payments: ${snapshot.payments}`,
      "",
      "What Happened",
      "EduGPT answered this from live TOTTECH ONE ERP tables in the selected school/college and academic-year context.",
      "",
      "Evidence",
      `School/College: ${scope.schoolName}`,
      `Academic Year: ${scope.academicYear}`,
      `ERP tables: ${tables.join(", ")}`,
      "",
      "Confidence",
      "High (ERP-grounded)",
    ].join("\n"),
    tables,
    sourceTrace: [
      erpSourceTrace(
        [
          `${snapshot.students} students`,
          `${snapshot.teachers} teachers`,
          `${snapshot.attendance} attendance records`,
        ],
        tables
      ),
    ],
    confidence: 0.9,
  };
}

function weakAreaAdvice(
  subject: string
) {
  const text = subject.toLowerCase();

  if (
    text.includes("math") ||
    text.includes("algebra")
  ) {
    return [
      "Fractions and number operations",
      "Algebra fundamentals",
      "Word-problem translation",
    ];
  }

  if (
    text.includes("science") ||
    text.includes("physics") ||
    text.includes("chemistry") ||
    text.includes("biology")
  ) {
    return [
      "Concept explanation",
      "Experiment-based learning",
      "Diagram and application practice",
    ];
  }

  if (
    text.includes("english") ||
    text.includes("language")
  ) {
    return [
      "Reading comprehension",
      "Vocabulary practice",
      "Structured writing",
    ];
  }

  return [
    "Concept revision",
    "Weekly practice tests",
    "Error-correction notebook",
  ];
}

async function buildStudentSuccessAnswer(
  prompt: string,
  scope: SchoolScope
) {
  const student =
    await findStudent(prompt, scope);

  if (!student) {
    return null;
  }

  const [
    attendance,
    subjects,
    docs,
  ] = await Promise.all([
    getStudentAttendancePercent(
      student.id,
      scope
    ),
    getStudentSubjectAverages(
      student.id,
      scope
    ),
    retrieveEducationKnowledge(
      "student intervention academic improvement remedial classes",
      scope
    ),
  ]);
  const weakSubjects =
    subjects
      .filter(
        (row) =>
          numberValue(row.average_percent) >
            0 &&
          numberValue(row.average_percent) <
            60
      )
      .slice(0, 4);
  const strengths =
    subjects
      .filter(
        (row) =>
          numberValue(row.average_percent) >=
          70
      )
      .slice(-3);
  const riskFactors = [
    attendance.total_count &&
    attendance.attendance_percent < 75
      ? `Attendance is ${formatPercent(attendance.attendance_percent)}, below the 75% watch threshold.`
      : null,
    weakSubjects.length
      ? `${weakSubjects.length} subject area(s) are below 60%.`
      : null,
    subjects.length
      ? null
      : "Subject-wise marks are not available in the ERP for this student.",
  ].filter(Boolean);
  const weakAreaLines =
    weakSubjects.length
      ? weakSubjects
          .map(
            (subject) =>
              `- ${subject.subject_name}: ${formatPercent(subject.average_percent)}`
          )
          .join("\n")
      : subjects.length
        ? "- No subject average below 60% from available marks."
        : "- Requested subject performance is not available in the institution database.";
  const teacherFocus =
    weakSubjects.length
      ? weakSubjects
          .flatMap((subject) =>
            weakAreaAdvice(
              subject.subject_name ||
                "subject"
            ).map(
              (area) =>
                `- ${subject.subject_name}: ${area}`
            )
          )
          .slice(0, 8)
          .join("\n")
      : "- Use recent classwork and unit-test errors to identify the next learning gap.";
  const confidence =
    subjects.length ||
    attendance.total_count
      ? 0.84
      : 0.55;

  return {
    answer: [
      "Summary",
      `${student.student_name} has been analyzed using available attendance and marks data.`,
      "",
      "Student Context",
      `- UHID / Admission No: ${student.admission_number || "Not available"}`,
      `- Class / Section: ${student.class_name || "Unassigned"}${student.section_name ? ` ${student.section_name}` : ""}`,
      `- Attendance: ${attendance.total_count ? formatPercent(attendance.attendance_percent) : "Not available"}`,
      "",
      "Strengths",
      strengths.length
        ? strengths
            .map(
              (row) =>
                `- ${row.subject_name}: ${formatPercent(row.average_percent)}`
            )
            .join("\n")
        : "- Strengths cannot be determined from the current marks data.",
      "",
      "Weak Areas",
      weakAreaLines,
      "",
      "Root Causes",
      riskFactors.length
        ? riskFactors
            .map((item) => `- ${item}`)
            .join("\n")
        : "- No major risk factor is visible from available ERP records.",
      "",
      "Teacher Focus",
      teacherFocus,
      "",
      "Parent Focus",
      "- Maintain a daily fixed study slot.",
      "- Review attendance weekly.",
      "- Check completed homework and correction work.",
      "- Meet the class teacher monthly until performance stabilizes.",
      "",
      "Recommended Action Plan",
      "- Two remedial sessions per week for weak subjects.",
      "- Weekly 20-minute concept check by subject teacher.",
      "- One parent meeting within the next 7 days if attendance is below 75%.",
      "- Track progress after the next unit test.",
      "",
      "Expected Improvement",
      confidence >= 0.8
        ? "10-15% improvement in the next term is reasonable if attendance and remedial practice improve."
        : "A prediction is not reliable until more attendance and marks records are available.",
      "",
      "Evidence",
      "Source: students + attendance_master + marks + subjects",
      "",
      "Confidence",
      `${Math.round(confidence * 100)}%`,
    ].join("\n"),
    tables: [
      "students",
      "attendance_master",
      "marks",
      "subjects",
    ],
    sourceTrace: [
      erpSourceTrace(
        [
          `${attendance.total_count} attendance records for selected student`,
          `${subjects.length} subject averages found`,
        ],
        [
          "students",
          "attendance_master",
          "marks",
          "subjects",
        ]
      ),
      ...sourceTraceFromDocs(docs),
    ],
    confidence,
    documentIds: docs.map((doc) => doc.id),
  };
}

async function buildAnalyticsAnswer(
  prompt: string,
  scope: SchoolScope
) {
  const studentAnswer =
    await buildStudentSuccessAnswer(
      prompt,
      scope
    );

  if (studentAnswer) {
    return studentAnswer;
  }

  const text = normalize(prompt);
  const terms =
    extractSearchTerms(prompt);

  if (
    (text.includes("improve") ||
      text.includes("performing poorly") ||
      text.includes("marks dropping")) &&
    terms.some(
      (term) =>
        ![
          "academically",
          "performance",
          "marks",
          "dropping",
          "poorly",
        ].includes(term)
    )
  ) {
    const docs =
      await retrieveEducationKnowledge(
        "student intervention academic improvement remedial classes",
        scope
      );

    return {
      answer: [
        "Summary",
        "Requested student-specific improvement analysis is not available because no matching student record was found in the selected school/college and academic year.",
        "",
        "Search Used",
        `- Terms: ${terms.join(", ") || "none"}`,
        `- School/College: ${scope.schoolName}`,
        `- Academic Year: ${scope.academicYear}`,
        "",
        "What To Do",
        "- Check the spelling or search by admission number/mobile number.",
        "- Make sure the correct school/college and academic year are selected.",
        "- Once the student is found, EduGPT will analyze attendance, marks, homework and risk factors.",
        "",
        "General Recommendation",
        "For a student who is struggling, start with attendance review, weak-subject identification, remedial classes, weekly practice checks and a parent meeting.",
        "",
        "Confidence",
        "High that no matching student was found in the selected ERP context.",
      ].join("\n"),
      tables: ["students"],
      sourceTrace: [
        erpSourceTrace(
          [
            `No matching student for: ${terms.join(", ")}`,
          ],
          ["students"]
        ),
        ...sourceTraceFromDocs(docs),
      ],
      confidence: 0.82,
      documentIds: docs.map((doc) => doc.id),
    };
  }

  const [
    snapshot,
    risk,
    teachers,
    docs,
  ] = await Promise.all([
    getSchoolSnapshot(scope),
    getAttendanceRisk(scope, 75),
    getTeachers(scope),
    retrieveEducationKnowledge(
      `${prompt} student success institution health teacher support`,
      scope
    ),
  ]);

  if (
    text.includes("teacher") ||
    text.includes("teachers")
  ) {
    const teacherLines =
      teachers.length
        ? teachers
            .slice(0, 10)
            .map(
              (teacher) =>
                `- ${teacher.teacher_name || `Teacher #${teacher.teacher_id}`}: ${teacher.department || "Department not set"}, ${teacher.class_count} assigned class(es)`
            )
            .join("\n")
        : "- Teacher records are not available in the selected ERP context.";

    return {
      answer: [
        "Summary",
        "Teacher support analysis is based on available teacher assignments and institution risk indicators.",
        "",
        "Teacher Snapshot",
        teacherLines,
        "",
        "Risk Indicators",
        `- Students below 75% attendance: ${risk.students.length}`,
        `- Pending invoices: ${snapshot.pendingInvoices}`,
        "",
        "Recommendations",
        "- Review class-wise results and attendance with each class teacher.",
        "- Provide support first to teachers handling classes with the highest attendance and marks risk.",
        "- Introduce peer observation for new teachers and teachers with declining class outcomes.",
        "- Track assignment completion and remedial-session attendance weekly.",
        "",
        "Evidence",
        "Source: teachers + classes + attendance_master + invoices",
        "",
        "Confidence",
        teachers.length
          ? "Medium (ERP-grounded, marks-by-teacher mapping is limited)"
          : "Low (teacher assignment data unavailable)",
      ].join("\n"),
      tables: [
        "teachers",
        "classes",
        "attendance_master",
        "invoices",
      ],
      sourceTrace: [
        erpSourceTrace(
          [
            `${teachers.length} teacher rows analyzed`,
            `${risk.students.length} low-attendance students`,
          ],
          [
            "teachers",
            "classes",
            "attendance_master",
            "invoices",
          ]
        ),
        ...sourceTraceFromDocs(docs),
      ],
      confidence:
        teachers.length
          ? 0.72
          : 0.48,
      documentIds: docs.map((doc) => doc.id),
    };
  }

  const riskScore = Math.min(
    100,
    Math.round(
      risk.students.length * 8 +
        snapshot.pendingInvoices * 5 +
        (snapshot.students
          ? 10
          : 0)
    )
  );

  return {
    answer: [
      "Institution Health Summary",
      `${scope.schoolName} currently has ${snapshot.students} students, ${snapshot.teachers} teachers, ${snapshot.pendingInvoices} pending invoices, and ${risk.students.length} students below 75% attendance from available ERP records.`,
      "",
      "What Happened",
      "- EduGPT reviewed student count, attendance risk, finance dues, marks availability, and teacher records.",
      "",
      "Top Risks",
      risk.students.length
        ? `- Attendance risk: ${risk.students.length} students below 75%.`
        : "- Attendance risk: no below-75% students found in recorded attendance.",
      snapshot.pendingInvoices
        ? `- Finance risk: ${snapshot.pendingInvoices} pending invoices, outstanding ${formatMoney(snapshot.totalDue)}.`
        : "- Finance risk: no pending invoices visible.",
      snapshot.marks
        ? `- Academic evidence: ${snapshot.marks} marks records available for analysis.`
        : "- Academic evidence gap: marks records are limited or unavailable.",
      "",
      "Recommended Actions This Week",
      "1. Meet class teachers for the lowest-attendance students.",
      "2. Publish a pending-fee follow-up list for finance and class teachers.",
      "3. Run subject-wise marks review for classes with low averages.",
      "4. Schedule parent meetings for high-risk students.",
      "5. Track the same metrics again next week to verify improvement.",
      "",
      "Institution Health Score",
      `${Math.max(0, 100 - riskScore)}/100`,
      "",
      "Evidence",
      "Source: students + teachers + attendance_master + marks + invoices + payments",
      "",
      "Confidence",
      snapshot.students
        ? "Medium-High (ERP-grounded with simple risk scoring)"
        : "Low (limited ERP data)",
    ].join("\n"),
    tables: [
      "students",
      "teachers",
      "attendance_master",
      "marks",
      "invoices",
      "payments",
    ],
    sourceTrace: [
      erpSourceTrace(
        [
          `${snapshot.students} students`,
          `${risk.students.length} attendance-risk students`,
          `${snapshot.pendingInvoices} pending invoices`,
        ],
        [
          "students",
          "teachers",
          "attendance_master",
          "marks",
          "invoices",
          "payments",
        ]
      ),
      ...sourceTraceFromDocs(docs),
    ],
    confidence:
      snapshot.students
        ? 0.78
        : 0.45,
    documentIds: docs.map((doc) => doc.id),
  };
}

function generalEducationAnswer(
  prompt: string,
  docs: KnowledgeDocumentRow[]
) {
  const text = normalize(prompt);
  const evidence =
    docs
      .slice(0, 3)
      .map((doc) => doc.content);

  if (
    text.includes("algebra")
  ) {
    return [
      "Summary",
      "Based on educational best practices, algebra is easier when students move from concrete examples to symbols gradually.",
      "",
      "Recommended Methods",
      "- Start with number patterns before variables.",
      "- Use balance-scale visuals to explain equations.",
      "- Connect algebra to real-life money, distance, age and area problems.",
      "- Teach common error patterns and let students correct worked examples.",
      "- Give short daily practice instead of one long weekly worksheet.",
      "",
      "Classroom Activity",
      "Give students 5 word problems and ask them only to write the equation first. This strengthens translation before calculation.",
      "",
      "Evidence",
      evidence.length
        ? evidence
            .map(
              (item, index) =>
                `${index + 1}. ${safeExcerpt(item, 220)}`
            )
            .join("\n")
        : "No local education knowledge document matched this exact question.",
      "",
      "Confidence",
      "Medium (education best-practice guidance)",
    ].join("\n");
  }

  if (
    text.includes("newton")
  ) {
    return [
      "Summary",
      "Based on educational best practices, Newton's laws should be taught with simple motion examples before formulas.",
      "",
      "Newton's Laws",
      "1. First Law: An object stays at rest or keeps moving unless an external force acts on it.",
      "2. Second Law: Force equals mass times acceleration. A heavier object needs more force to accelerate.",
      "3. Third Law: For every action, there is an equal and opposite reaction.",
      "",
      "Teaching Tip",
      "Use a ball, toy car, or classroom chair to demonstrate force, motion and reaction visibly.",
      "",
      "Confidence",
      "Medium (general education knowledge)",
    ].join("\n");
  }

  if (
    text.includes("thesis") ||
    text.includes("dissertation") ||
    text.includes("literature review") ||
    text.includes("research")
  ) {
    return [
      "Summary",
      "Based on academic-writing best practices, a strong research document starts with a clear problem, focused research questions and a transparent methodology.",
      "",
      "Suggested Structure",
      "- Title",
      "- Abstract",
      "- Introduction and problem statement",
      "- Research questions or hypotheses",
      "- Literature review",
      "- Methodology",
      "- Data analysis",
      "- Findings",
      "- Discussion",
      "- Recommendations",
      "- References",
      "",
      "Next Step",
      "Share the topic, education level, methodology preference and required citation style; EduGPT can draft a thesis outline or literature-review plan.",
      "",
      "Confidence",
      "Medium (academic-writing guidance; live research retrieval is not yet configured)",
    ].join("\n");
  }

  return [
    "Summary",
    "Based on educational best practices, here is guidance for your question.",
    "",
    docs.length
      ? docs
          .slice(0, 3)
          .map(
            (doc) =>
              `${doc.title}: ${safeExcerpt(doc.content, 450)}`
          )
          .join("\n\n")
      : "The requested information is not available in the institution database. For general education guidance, use active recall, spaced revision, clear learning objectives, frequent formative assessment and targeted feedback.",
    "",
    "Recommendations",
    "- Define the learning objective clearly.",
    "- Use short assessment checkpoints.",
    "- Personalize support based on attendance, marks and assignment completion when school/college data exists.",
    "- Review progress weekly.",
    "",
    "Confidence",
    docs.length
      ? "Medium (local education knowledge)"
      : "Low-Medium (general best-practice response)",
  ].join("\n");
}

async function buildGeneralOrRagAnswer(
  prompt: string,
  scope: SchoolScope,
  questionType: QuestionType
) {
  let docs =
    await retrieveEducationKnowledge(
      prompt,
      scope
    );

  if (questionType === "RAG_QUERY") {
    const promptText = normalize(prompt);
    docs = docs.filter((doc) => {
      const category =
        normalize(doc.category);
      const title =
        normalize(doc.title);
      const content =
        normalize(doc.content);

      if (
        category === "ai-governance" &&
        !promptText.includes("ai")
      ) {
        return false;
      }

      if (
        promptText.includes("fee") ||
        promptText.includes("refund")
      ) {
        return (
          title.includes("fee") ||
          title.includes("refund") ||
          content.includes("fee") ||
          content.includes("refund")
        );
      }

      if (
        promptText.includes("attendance")
      ) {
        return (
          title.includes("attendance") ||
          content.includes("attendance")
        );
      }

      return true;
    });
  }

  if (
    questionType === "RAG_QUERY" &&
    !docs.length
  ) {
    return {
      answer: [
        "Summary",
        "Requested information is not available in the institution knowledge base.",
        "",
        "What To Do",
        "Upload the relevant policy, circular, handbook or academic rule into the TOTTECH AI knowledge base, then ask again.",
        "",
        "Confidence",
        "High that no matching local knowledge document was found.",
      ].join("\n"),
      tables: [],
      sourceTrace: [],
      confidence: 0.4,
      documentIds: [],
    };
  }

  return {
    answer: generalEducationAnswer(
      prompt,
      docs
    ),
    tables: [],
    sourceTrace:
      sourceTraceFromDocs(docs),
    confidence:
      docs.length
        ? 0.72
        : 0.55,
    documentIds: docs.map((doc) => doc.id),
  };
}

async function logEduAnswer({
  input,
  requestId,
  prompt,
  promptHash,
  answer,
  scope,
  questionType,
  sourceTrace,
  tables,
  documentIds,
  confidence,
  started,
}: {
  input: EduInput;
  requestId: string;
  prompt: string;
  promptHash: string;
  answer: string;
  scope: SchoolScope;
  questionType: QuestionType;
  sourceTrace: SourceTrace[];
  tables: string[];
  documentIds: number[];
  confidence: number;
  started: number;
}) {
  const latency =
    Date.now() - started;

  await prisma.ai_knowledge_queries
    .create({
      data: {
        request_id: requestId,
        school_id: scope.schoolId,
        user_id:
          input.user.id ?? null,
        prompt_hash: promptHash,
        prompt_excerpt:
          safeExcerpt(prompt),
        answer_excerpt:
          safeExcerpt(answer, 8000),
        source_trace: sourceTrace,
        priority_trace: [
          "ERP",
          "ANALYTICS",
          "EDUCATION_RAG",
          "GENERAL_KNOWLEDGE",
        ],
        provider_key:
          "edugpt-router-v1",
        latency_ms: latency,
        success: true,
      },
    })
    .catch((error) => {
      console.error(
        "EduGPT query log failed",
        error
      );
    });

  await prisma.education_ai_retrievals
    .create({
      data: {
        request_id: requestId,
        school_id: scope.schoolId,
        user_id:
          input.user.id ?? null,
        question_type: questionType,
        prompt_excerpt:
          safeExcerpt(prompt),
        document_ids: documentIds,
        erp_tables: tables,
        confidence_score: confidence,
      },
    })
    .catch((error) => {
      console.error(
        "EduGPT retrieval log failed",
        error
      );
    });

  await recordAIObservability({
    request_id: requestId,
    school_id: scope.schoolId,
    user_id:
      input.user.id ?? null,
    layer: "knowledge",
    event_type:
      "EDUGPT_QUERY",
    provider_key:
      "edugpt-router-v1",
    source_type:
      questionType,
    latency_ms: latency,
    success: true,
    payload: {
      prompt_excerpt:
        safeExcerpt(prompt, 300),
      questionType,
      tables,
      documentIds,
      confidence,
    },
  }).catch(() => undefined);

  await recordEvent({
    school_id: scope.schoolId,
    user_id: input.user.id,
    actor_role:
      input.user.role,
    module_name: "ai",
    event_type:
      "EDUGPT_QUERY",
    action: "query",
    entity_type: "education_ai",
    entity_id: scope.schoolId,
    summary:
      "EduGPT answered TOTTECH ONE AI question",
    payload: {
      requestId,
      questionType,
      tables,
      documentIds,
      confidence,
    },
  }).catch(() => undefined);
}

export async function answerEduGPTQuestion(
  input: EduInput
) {
  const started = Date.now();
  const requestId =
    crypto.randomUUID();
  const prompt =
    input.prompt.trim();
  const promptHash =
    hashText(normalize(prompt));

  if (!prompt) {
    throw new Error(
      "Ask EduGPT a school/college data, school/college intelligence, or education knowledge question."
    );
  }

  const scope =
    await resolveScope(input);

  if (scope.restricted) {
    return {
      requestId,
      aiMode:
        "School/College Data Intelligence",
      queryType: "DATA_QUERY",
      answer: [
        "Summary",
        scope.restrictionReason,
        "",
        "Security",
        "EduGPT did not query school/college records because the user has no authorized school/college context.",
      ].join("\n"),
      sourceTrace: [],
      priorityTrace: [
        "RBAC",
      ],
      confidenceScore: 1,
      grounding: {
        school: null,
        academicYear: null,
        role: input.user.role,
      },
    };
  }

  const questionType =
    classifyQuestion(prompt);

  if (
    isParentRole(input.user.role) ||
    isStudentRole(input.user.role)
  ) {
    const ownStudent =
      await findStudent(
        `${input.user.id || ""} ${prompt}`,
        scope
      );

    if (!ownStudent) {
      return {
        requestId,
        aiMode:
          "Role-Safe Student Support",
        queryType: questionType,
        answer: [
          "Summary",
          "I cannot find an authorized student record linked to this login.",
          "",
          "Security",
          "Parent and student accounts can only view their own child/student records. Ask the school/college administrator to link the student profile to this account.",
        ].join("\n"),
        sourceTrace: [],
        priorityTrace: [
          "RBAC",
        ],
        confidenceScore: 1,
        grounding: {
          schoolId: scope.schoolId,
          academicYearId:
            scope.academicYearId,
          role: input.user.role,
        },
      };
    }
  }

  if (
    isTeacherRole(input.user.role) &&
    questionType === "DATA_QUERY" &&
    !normalize(prompt).includes("my")
  ) {
    return {
      requestId,
      aiMode:
        "Role-Safe Teacher Assistant",
      queryType: questionType,
      answer: [
        "Summary",
        "Teacher accounts should ask for assigned-class or own-student information only.",
        "",
        "Security",
        "EduGPT did not return whole-school/college data because this role requires class/student scoping.",
      ].join("\n"),
      sourceTrace: [],
      priorityTrace: [
        "RBAC",
      ],
      confidenceScore: 1,
      grounding: {
        schoolId: scope.schoolId,
        academicYearId:
          scope.academicYearId,
        role: input.user.role,
      },
    };
  }

  const result =
    questionType === "DATA_QUERY"
      ? await buildDataAnswer(
          prompt,
          scope
        )
      : questionType ===
          "ANALYTICS_QUERY"
        ? await buildAnalyticsAnswer(
            prompt,
            scope
          )
        : await buildGeneralOrRagAnswer(
            prompt,
            scope,
            questionType
          );
  const documentIds: number[] =
    "documentIds" in result &&
    Array.isArray(result.documentIds)
      ? result.documentIds.filter(
          (id): id is number =>
            typeof id === "number"
        )
      : [];

  if (
    questionType ===
      "GENERAL_EDUCATION_QUERY" &&
    !result.sourceTrace.length &&
    input.include_internet
  ) {
    const legacy =
      await answerKnowledgeQuery(input);

    if (
      legacy?.answer &&
      !legacy.answer.includes(
        "I could not find a confident answer"
      )
    ) {
      return {
        ...legacy,
        aiMode:
          "General Education Knowledge",
        queryType: questionType,
        sourceTrace:
          legacy.sources ?? [],
      };
    }
  }

  await logEduAnswer({
    input,
    requestId,
    prompt,
    promptHash,
    answer: result.answer,
    scope,
    questionType,
    sourceTrace:
      result.sourceTrace,
    tables: result.tables,
    documentIds,
    confidence:
      result.confidence,
    started,
  });

  return {
    requestId,
    aiMode:
      questionType === "DATA_QUERY"
        ? "School/College Data Intelligence"
        : questionType ===
            "ANALYTICS_QUERY"
          ? "AI Analysis & Recommendations"
          : questionType ===
              "RAG_QUERY"
            ? "Institution Knowledge RAG"
            : "General Education Knowledge",
    queryType: questionType,
    answer: result.answer,
    priorityTrace: [
      "ERP",
      "ANALYTICS",
      "EDUCATION_RAG",
      "GENERAL_KNOWLEDGE",
    ],
    sourceTrace:
      result.sourceTrace,
    sources:
      result.sourceTrace,
    confidenceScore:
      result.confidence,
    grounding: {
      schoolId: scope.schoolId,
      academicYearId:
        scope.academicYearId,
      schoolName:
        scope.schoolName,
      academicYear:
        scope.academicYear,
      role: input.user.role,
      canUseAllSchools:
        scope.canUseAllSchools,
      queryType: questionType,
    },
  };
}
