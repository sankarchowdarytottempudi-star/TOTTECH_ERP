import crypto from "crypto";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  getActiveAcademicYear,
  GovernanceUser,
  scopedSchoolWhere,
} from "@/lib/governance/rbac";
import { recordEvent } from "@/lib/governance/events";
import { recordAIObservability } from "./observability";

type ActionInput = {
  user: GovernanceUser;
  action_type: string;
  payload?: Record<string, unknown>;
  prompt?: string;
  school_id?: number | null;
};

type ApprovalInput = {
  user: GovernanceUser;
  id: number;
  decision: "APPROVE" | "REJECT";
  comments?: string | null;
  metadata?: Record<string, unknown>;
};

type ExecutionInput = {
  user: GovernanceUser;
  id: number;
};

type ExecutionResult = {
  entity_type: string;
  entity_id?: number | null;
  record?: unknown;
  operationalRecord?: boolean;
  message: string;
};

const supportedActions = {
  CREATE_STUDENT: {
    module: "students",
    target: "student",
    risk: "MEDIUM",
    writes: ["students"],
  },
  UPDATE_STUDENT: {
    module: "students",
    target: "student",
    risk: "MEDIUM",
    writes: ["students"],
  },
  CREATE_TEACHER: {
    module: "teachers",
    target: "teacher",
    risk: "MEDIUM",
    writes: ["teachers"],
  },
  UPDATE_TEACHER: {
    module: "teachers",
    target: "teacher",
    risk: "MEDIUM",
    writes: ["teachers"],
  },
  CREATE_STAFF: {
    module: "users",
    target: "user",
    risk: "HIGH",
    writes: ["users"],
  },
  UPDATE_STAFF: {
    module: "users",
    target: "user",
    risk: "HIGH",
    writes: ["users"],
  },
  CREATE_EXAM: {
    module: "exams",
    target: "exam",
    risk: "MEDIUM",
    writes: ["exams"],
  },
  UPDATE_EXAM: {
    module: "exams",
    target: "exam",
    risk: "MEDIUM",
    writes: ["exams"],
  },
  CREATE_EXAM_SCHEDULE: {
    module: "exam_schedule",
    target: "exam_schedule",
    risk: "HIGH",
    writes: ["exam_schedule"],
  },
  UPDATE_EXAM_SCHEDULE: {
    module: "exam_schedule",
    target: "exam_schedule",
    risk: "HIGH",
    writes: ["exam_schedule"],
  },
  CREATE_HOMEWORK: {
    module: "homework",
    target: "homework",
    risk: "LOW",
    writes: ["homework_assignments"],
  },
  CREATE_QUESTION_PAPER: {
    module: "question_papers",
    target: "question_paper",
    risk: "MEDIUM",
    writes: ["question_papers"],
  },
  CREATE_ROUTE: {
    module: "transport",
    target: "transport_route",
    risk: "MEDIUM",
    writes: ["transport_routes"],
  },
  UPDATE_ROUTE: {
    module: "transport",
    target: "transport_route",
    risk: "MEDIUM",
    writes: ["transport_routes"],
  },
  CREATE_HOSTEL: {
    module: "hostel",
    target: "hostel",
    risk: "MEDIUM",
    writes: ["hostels"],
  },
  UPDATE_HOSTEL: {
    module: "hostel",
    target: "hostel",
    risk: "MEDIUM",
    writes: ["hostels"],
  },
  CREATE_DINING_PLAN: {
    module: "dining",
    target: "dining_plan",
    risk: "LOW",
    writes: ["dining_meal_plans"],
  },
  UPDATE_DINING_PLAN: {
    module: "dining",
    target: "dining_plan",
    risk: "LOW",
    writes: ["dining_meal_plans"],
  },
  GENERATE_INVOICE: {
    module: "finance",
    target: "invoice",
    risk: "HIGH",
    writes: ["invoices"],
  },
  ASSIGN_TRANSPORT: {
    module: "transport",
    target: "student",
    risk: "HIGH",
    writes: ["students"],
  },
  ASSIGN_HOSTEL: {
    module: "hostel",
    target: "student",
    risk: "HIGH",
    writes: [
      "students",
      "hostel_allocations",
    ],
  },
  ASSIGN_DINING: {
    module: "dining",
    target: "student",
    risk: "LOW",
    writes: [
      "dining_meal_assignments",
    ],
  },
  CREATE_TIMETABLE: {
    module: "timetable",
    target: "timetable",
    risk: "MEDIUM",
    writes: ["timetable_entries"],
  },
  GENERATE_REPORTS: {
    module: "reports",
    target: "report_export",
    risk: "LOW",
    writes: ["report_exports"],
  },
} as const;

type SupportedAction =
  keyof typeof supportedActions;

const asJson = (value: unknown) =>
  value === undefined
    ? undefined
    : JSON.parse(JSON.stringify(value));

const normalizeActionType = (
  value: string
) =>
  value
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

const asRecord = (
  value: unknown
) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value)
    ? (value as Record<
        string,
        unknown
      >)
    : {};

const stringValue = (
  value: unknown
) =>
  value === null ||
  value === undefined
    ? null
    : String(value).trim() || null;

const numberValue = (
  value: unknown
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed =
    typeof value === "number"
      ? value
      : Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
};

const dateValue = (
  value: unknown
) => {
  if (!value) {
    return null;
  }

  const parsed =
    value instanceof Date
      ? value
      : new Date(String(value));

  return Number.isNaN(
    parsed.getTime()
  )
    ? null
    : parsed;
};

const timeValue = (
  value: unknown
) => {
  const text =
    stringValue(value);

  if (!text) {
    return null;
  }

  const withSeconds =
    /^\d{2}:\d{2}$/.test(text)
      ? `${text}:00`
      : text;
  const parsed =
    new Date(
      `1970-01-01T${withSeconds}Z`
    );

  return Number.isNaN(
    parsed.getTime()
  )
    ? null
    : parsed;
};

function validateActionPayload(
  actionType: SupportedAction,
  payload: Record<string, unknown>
) {
  const errors: string[] = [];
  const requireAny = (
    fields: string[],
    label: string
  ) => {
    if (
      !fields.some((field) =>
        stringValue(payload[field])
      )
    ) {
      errors.push(
        `${label} is required`
      );
    }
  };
  const requireField = (
    field: string,
    label = field
  ) => {
    if (
      stringValue(payload[field]) ===
        null &&
      numberValue(payload[field]) ===
        null
    ) {
      errors.push(
        `${label} is required`
      );
    }
  };

  switch (actionType) {
    case "CREATE_STUDENT":
      requireAny(
        ["first_name", "name"],
        "Student name"
      );
      break;
    case "UPDATE_STUDENT":
      requireAny(
        [
          "id",
          "student_id",
          "admission_number",
          "email",
        ],
        "Student identifier"
      );
      break;
    case "CREATE_TEACHER":
      requireAny(
        ["first_name", "email"],
        "Teacher name or email"
      );
      break;
    case "UPDATE_TEACHER":
      requireAny(
        [
          "id",
          "teacher_id",
          "employee_id",
          "email",
        ],
        "Teacher identifier"
      );
      break;
    case "CREATE_STAFF":
      requireField(
        "full_name",
        "Staff full name"
      );
      requireField(
        "email",
        "Staff email"
      );
      requireField(
        "role",
        "Staff role"
      );
      break;
    case "UPDATE_STAFF":
      requireAny(
        ["id", "staff_id", "email"],
        "Staff identifier"
      );
      break;
    case "CREATE_EXAM":
      requireField(
        "exam_name",
        "Exam name"
      );
      break;
    case "UPDATE_EXAM":
      requireAny(
        ["id", "exam_id", "exam_name"],
        "Exam identifier"
      );
      break;
    case "CREATE_EXAM_SCHEDULE":
      requireField(
        "class_id",
        "Class"
      );
      requireField(
        "section_id",
        "Section"
      );
      requireField(
        "subject_id",
        "Subject"
      );
      requireField(
        "exam_date",
        "Exam date"
      );
      break;
    case "UPDATE_EXAM_SCHEDULE":
      requireAny(
        ["id", "schedule_id"],
        "Exam schedule identifier"
      );
      break;
    case "CREATE_HOMEWORK":
      requireField(
        "title",
        "Homework title"
      );
      break;
    case "CREATE_QUESTION_PAPER":
      requireField(
        "paper_name",
        "Question paper name"
      );
      break;
    case "CREATE_ROUTE":
      requireField(
        "route_name",
        "Route name"
      );
      break;
    case "UPDATE_ROUTE":
      requireAny(
        ["id", "route_id", "route_name"],
        "Route identifier"
      );
      break;
    case "CREATE_HOSTEL":
      requireField(
        "hostel_name",
        "Hostel name"
      );
      break;
    case "UPDATE_HOSTEL":
      requireAny(
        ["id", "hostel_id", "hostel_name"],
        "Hostel identifier"
      );
      break;
    case "CREATE_DINING_PLAN":
      requireField(
        "plan_name",
        "Dining plan name"
      );
      break;
    case "UPDATE_DINING_PLAN":
      requireAny(
        ["id", "meal_plan_id", "plan_name"],
        "Dining plan identifier"
      );
      break;
    case "GENERATE_INVOICE":
      requireField(
        "student_id",
        "Student"
      );
      requireField(
        "total_amount",
        "Invoice amount"
      );
      break;
    case "ASSIGN_TRANSPORT":
      requireField(
        "student_id",
        "Student"
      );
      if (
        numberValue(
          payload.transport_route_id
        ) === null &&
        numberValue(payload.route_id) ===
          null
      ) {
        errors.push(
          "Transport route is required"
        );
      }
      break;
    case "ASSIGN_HOSTEL":
      requireField(
        "student_id",
        "Student"
      );
      if (
        numberValue(
          payload.hostel_room_id
        ) === null &&
        numberValue(payload.room_id) ===
          null
      ) {
        errors.push(
          "Hostel room is required"
        );
      }
      break;
    case "ASSIGN_DINING":
      requireField(
        "student_id",
        "Student"
      );
      requireField(
        "meal_plan_id",
        "Meal plan"
      );
      break;
    case "CREATE_TIMETABLE":
      requireField(
        "class_id",
        "Class"
      );
      requireField(
        "section_id",
        "Section"
      );
      requireField(
        "subject_id",
        "Subject"
      );
      requireField(
        "teacher_id",
        "Teacher"
      );
      requireField(
        "day_of_week",
        "Day"
      );
      break;
    default:
      break;
  }

  return errors;
}

function buildPreview(
  actionType: SupportedAction,
  payload: Record<string, unknown>,
  errors: string[]
) {
  const definition =
    supportedActions[actionType];

  return {
    action_type: actionType,
    module_name:
      definition.module,
    target_entity_type:
      definition.target,
    risk_level:
      definition.risk,
    requested_writes:
      definition.writes,
    safety_flow: [
      "Request",
      "Preview",
      "Approval",
      "Execute",
      "Event Ledger",
    ],
    requires_approval: true,
    writes_before_approval: false,
    validation: {
      ok:
        errors.length === 0,
      errors,
    },
    normalized_payload: payload,
  };
}

export function listSupportedAIActions() {
  return Object.entries(
    supportedActions
  ).map(
    ([
      action_type,
      definition,
    ]) => ({
      action_type,
      ...definition,
    })
  );
}

export async function createActionRequest(
  input: ActionInput
) {
  const started = Date.now();
  const requestId =
    crypto.randomUUID();
  const actionType =
    normalizeActionType(
      input.action_type
    ) as SupportedAction;

  if (
    !Object.prototype.hasOwnProperty.call(
      supportedActions,
      actionType
    )
  ) {
    throw new Error(
      `Unsupported AI action: ${input.action_type}`
    );
  }

  const payload = asRecord(
    input.payload
  );
  const definition =
    supportedActions[actionType];
  const schoolId =
    input.school_id ??
    input.user.school_id ??
    null;
  const academicYear =
    await getActiveAcademicYear(
      schoolId
    );
  const errors =
    validateActionPayload(
      actionType,
      payload
    );
  const preview =
    buildPreview(
      actionType,
      payload,
      errors
    );
  const status =
    errors.length > 0
      ? "PREVIEW"
      : "PENDING_APPROVAL";

  const action =
    await prisma.ai_action_requests.create({
      data: {
        request_id: requestId,
        school_id: schoolId,
        academic_year_id:
          academicYear?.id ?? null,
        requested_by:
          input.user.id ?? null,
        module_name:
          definition.module,
        action_type: actionType,
        target_entity_type:
          definition.target,
        status,
        risk_level:
          definition.risk,
        prompt:
          input.prompt ?? null,
        normalized_payload:
          asJson(payload),
        preview:
          asJson(preview),
        validation_errors:
          errors.length
            ? asJson(errors)
            : null,
        approval_policy:
          asJson({
            requiredPermission:
              "AI.APPROVE_ACTION",
            executePermission:
              "AI.EXECUTE_ACTION",
            noProductionWritesBeforeApproval:
              true,
            auditRequired: true,
          }),
      },
    });

  await recordAIObservability({
    request_id: requestId,
    school_id: schoolId,
    user_id:
      input.user.id ?? null,
    layer: "action",
    event_type:
      "ACTION_PREVIEW_CREATED",
    action_request_id:
      action.id,
    latency_ms:
      Date.now() - started,
    success:
      errors.length === 0,
    payload: {
      action_type: actionType,
      status,
      errors,
    },
  });

  await recordEvent({
    school_id: schoolId,
    academic_year_id:
      academicYear?.id ?? null,
    user_id: input.user.id,
    actor_role:
      input.user.role,
    module_name: "ai",
    event_type:
      "AI_ACTION_REQUESTED",
    action: "preview",
    entity_type:
      definition.target,
    summary:
      `AI action preview created: ${actionType}`,
    payload: {
      requestId,
      actionId:
        action.id,
      status,
      writes:
        definition.writes,
      validationErrors:
        errors,
    },
  });

  return action;
}

export async function listActionRequests(
  user: GovernanceUser,
  status?: string | null
) {
  const where = {
    ...(await scopedSchoolWhere(user)),
    ...(status
      ? {
          status:
            status.toUpperCase(),
        }
      : {}),
  };

  return prisma.ai_action_requests.findMany({
    where,
    orderBy: {
      created_at: "desc",
    },
    take: 100,
  });
}

export async function getActionRequest(
  user: GovernanceUser,
  id: number
) {
  const action =
    await prisma.ai_action_requests.findUnique({
      where: {
        id,
      },
    });

  if (!action) {
    return null;
  }

  const scoped =
    await scopedSchoolWhere(user);

  if (
    "school_id" in scoped &&
    action.school_id !==
      scoped.school_id
  ) {
    return null;
  }

  return action;
}

export async function approveActionRequest(
  input: ApprovalInput
) {
  const action =
    await getActionRequest(
      input.user,
      input.id
    );

  if (!action) {
    throw new Error(
      "AI action request not found"
    );
  }

  const validationErrors =
    Array.isArray(
      action.validation_errors
    )
      ? action.validation_errors
      : [];

  if (
    input.decision === "APPROVE" &&
    validationErrors.length
  ) {
    throw new Error(
      "Cannot approve an action with validation errors."
    );
  }

  if (
    ![
      "PENDING_APPROVAL",
      "PREVIEW",
    ].includes(action.status)
  ) {
    throw new Error(
      `Action cannot be approved from status ${action.status}.`
    );
  }

  const now = new Date();
  const status =
    input.decision === "APPROVE"
      ? "APPROVED"
      : "REJECTED";

  const [
    updated,
  ] = await prisma.$transaction([
    prisma.ai_action_requests.update({
      where: {
        id: action.id,
      },
      data:
        status === "APPROVED"
          ? {
              status,
              approved_by:
                input.user.id ?? null,
              approved_at: now,
              updated_at: now,
            }
          : {
              status,
              rejected_by:
                input.user.id ?? null,
              rejected_at: now,
              updated_at: now,
            },
    }),
    prisma.ai_action_approvals.create({
      data: {
        action_request_id:
          action.id,
        user_id:
          input.user.id ?? null,
        decision:
          input.decision,
        comments:
          input.comments ?? null,
        metadata:
          input.metadata ?? {},
      },
    }),
  ]);

  await recordAIObservability({
    request_id:
      action.request_id,
    school_id:
      action.school_id,
    user_id:
      input.user.id ?? null,
    layer: "approval",
    event_type:
      `ACTION_${status}`,
    action_request_id:
      action.id,
    success: true,
    payload: {
      decision:
        input.decision,
      comments:
        input.comments,
    },
  });

  await recordEvent({
    school_id:
      action.school_id,
    academic_year_id:
      action.academic_year_id,
    user_id: input.user.id,
    actor_role:
      input.user.role,
    module_name: "ai",
    event_type:
      `AI_ACTION_${status}`,
    action:
      input.decision.toLowerCase(),
    entity_type:
      action.target_entity_type,
    summary:
      `AI action ${status.toLowerCase()}: ${action.action_type}`,
    payload: {
      actionId:
        action.id,
      requestId:
        action.request_id,
      comments:
        input.comments,
    },
  });

  return updated;
}

const hasPayloadValue = (
  payload: Record<string, unknown>,
  key: string
) =>
  payload[key] !== undefined &&
  payload[key] !== null &&
  String(payload[key]).trim() !== "";

const optionalString = (
  payload: Record<string, unknown>,
  key: string
) => {
  if (!hasPayloadValue(payload, key)) {
    return undefined;
  }

  return (
    stringValue(payload[key]) ??
    undefined
  );
};

const optionalNumber = (
  payload: Record<string, unknown>,
  key: string
) => {
  if (!hasPayloadValue(payload, key)) {
    return undefined;
  }

  return (
    numberValue(payload[key]) ??
    undefined
  );
};

const optionalDate = (
  payload: Record<string, unknown>,
  key: string
) => {
  if (!hasPayloadValue(payload, key)) {
    return undefined;
  }

  return (
    dateValue(payload[key]) ??
    undefined
  );
};

async function findStudentId(
  payload: Record<string, unknown>,
  schoolId: number | null
) {
  const id =
    numberValue(payload.id) ??
    numberValue(payload.student_id);

  if (id) {
    return id;
  }

  const student =
    await prisma.students.findFirst({
      where: {
        ...(schoolId
          ? {
              school_id: schoolId,
            }
          : {}),
        OR: [
          {
            admission_number:
              stringValue(
                payload.admission_number
              ) ?? undefined,
          },
          {
            email:
              stringValue(payload.email) ??
              undefined,
          },
          {
            phone:
              stringValue(payload.phone) ??
              undefined,
          },
        ].filter((item) =>
          Object.values(item).some(
            (value) =>
              value !== undefined
          )
        ),
      },
      orderBy: {
        id: "desc",
      },
    });

  return student?.id ?? null;
}

async function findTeacherId(
  payload: Record<string, unknown>,
  schoolId: number | null
) {
  const id =
    numberValue(payload.id) ??
    numberValue(payload.teacher_id);

  if (id) {
    return id;
  }

  const teacher =
    await prisma.teachers.findFirst({
      where: {
        ...(schoolId
          ? {
              school_id: schoolId,
            }
          : {}),
        OR: [
          {
            employee_id:
              stringValue(
                payload.employee_id
              ) ?? undefined,
          },
          {
            email:
              stringValue(payload.email) ??
              undefined,
          },
          {
            phone:
              stringValue(payload.phone) ??
              undefined,
          },
        ].filter((item) =>
          Object.values(item).some(
            (value) =>
              value !== undefined
          )
        ),
      },
      orderBy: {
        id: "desc",
      },
    });

  return teacher?.id ?? null;
}

async function executeAction(
  actionType: SupportedAction,
  payload: Record<string, unknown>,
  schoolId: number | null,
  academicYearId: number | null
) : Promise<ExecutionResult> {
  switch (actionType) {
    case "CREATE_STUDENT": {
      const student =
        await prisma.students.create({
          data: {
            school_id: schoolId,
            enrollment_number:
              stringValue(
                payload.enrollment_number
              ),
            admission_number:
              stringValue(
                payload.admission_number
              ),
            name:
              stringValue(payload.name),
            first_name:
              stringValue(
                payload.first_name
              ),
            middle_name:
              stringValue(
                payload.middle_name
              ),
            last_name:
              stringValue(
                payload.last_name
              ),
            gender:
              stringValue(
                payload.gender
              ),
            phone:
              stringValue(payload.phone),
            email:
              stringValue(payload.email),
            father_name:
              stringValue(
                payload.father_name
              ),
            mother_name:
              stringValue(
                payload.mother_name
              ),
            section_id:
              numberValue(
                payload.section_id
              ),
            academic_year:
              stringValue(
                payload.academic_year
              ),
            is_active: true,
          },
        });

      return {
        entity_type: "student",
        entity_id: student.id,
        record: student,
        message:
          "Student created after approval.",
      };
    }
    case "UPDATE_STUDENT": {
      const studentId =
        await findStudentId(
          payload,
          schoolId
        );

      if (!studentId) {
        throw new Error(
          "Student not found for the provided identifier."
        );
      }

      const student =
        await prisma.students.update({
          where: {
            id: studentId,
          },
          data: {
            enrollment_number:
              optionalString(
                payload,
                "enrollment_number"
              ),
            admission_number:
              optionalString(
                payload,
                "admission_number"
              ),
            name:
              optionalString(
                payload,
                "name"
              ),
            first_name:
              optionalString(
                payload,
                "first_name"
              ),
            middle_name:
              optionalString(
                payload,
                "middle_name"
              ),
            last_name:
              optionalString(
                payload,
                "last_name"
              ),
            gender:
              optionalString(
                payload,
                "gender"
              ),
            phone:
              optionalString(
                payload,
                "phone"
              ),
            email:
              optionalString(
                payload,
                "email"
              ),
            father_name:
              optionalString(
                payload,
                "father_name"
              ),
            mother_name:
              optionalString(
                payload,
                "mother_name"
              ),
            section_id:
              optionalNumber(
                payload,
                "section_id"
              ),
            updated_at: new Date(),
          },
        });

      return {
        entity_type: "student",
        entity_id: student.id,
        record: student,
        message:
          "Student updated after approval.",
      };
    }
    case "CREATE_TEACHER": {
      const teacher =
        await prisma.teachers.create({
          data: {
            school_id: schoolId,
            employee_id:
              stringValue(
                payload.employee_id
              ),
            first_name:
              stringValue(
                payload.first_name
              ),
            last_name:
              stringValue(
                payload.last_name
              ),
            gender:
              stringValue(
                payload.gender
              ),
            phone:
              stringValue(payload.phone),
            email:
              stringValue(payload.email),
            qualification:
              stringValue(
                payload.qualification
              ),
            experience_years:
              numberValue(
                payload.experience_years
              ),
            department:
              stringValue(
                payload.department
              ),
            designation:
              stringValue(
                payload.designation
              ),
            address:
              stringValue(
                payload.address
              ),
            is_active: true,
          },
        });

      return {
        entity_type: "teacher",
        entity_id: teacher.id,
        record: teacher,
        message:
          "Teacher created after approval.",
      };
    }
    case "UPDATE_TEACHER": {
      const teacherId =
        await findTeacherId(
          payload,
          schoolId
        );

      if (!teacherId) {
        throw new Error(
          "Teacher not found for the provided identifier."
        );
      }

      const teacher =
        await prisma.teachers.update({
          where: {
            id: teacherId,
          },
          data: {
            employee_id:
              optionalString(
                payload,
                "employee_id"
              ),
            first_name:
              optionalString(
                payload,
                "first_name"
              ),
            last_name:
              optionalString(
                payload,
                "last_name"
              ),
            gender:
              optionalString(
                payload,
                "gender"
              ),
            phone:
              optionalString(
                payload,
                "phone"
              ),
            email:
              optionalString(
                payload,
                "email"
              ),
            qualification:
              optionalString(
                payload,
                "qualification"
              ),
            experience_years:
              optionalNumber(
                payload,
                "experience_years"
              ),
            department:
              optionalString(
                payload,
                "department"
              ),
            designation:
              optionalString(
                payload,
                "designation"
              ),
            address:
              optionalString(
                payload,
                "address"
              ),
            updated_at: new Date(),
          },
        });

      return {
        entity_type: "teacher",
        entity_id: teacher.id,
        record: teacher,
        message:
          "Teacher updated after approval.",
      };
    }
    case "CREATE_STAFF": {
      const randomPassword =
        crypto
          .randomBytes(24)
          .toString("hex");
      const passwordHash =
        await bcrypt.hash(
          randomPassword,
          10
        );
      const user =
        await prisma.users.create({
          data: {
            school_id: schoolId,
            full_name: String(
              payload.full_name
            ),
            email: String(
              payload.email
            ),
            phone:
              stringValue(payload.phone),
            password_hash:
              passwordHash,
            role: String(
              payload.role
            ).toUpperCase(),
            is_active: false,
          },
        });

      return {
        entity_type: "user",
        entity_id: user.id,
        record: {
          ...user,
          password_hash:
            "[redacted]",
          credential_status:
            "inactive_random_password_reset_required",
        },
        message:
          "Staff user created inactive. Use reset-password workflow before activation.",
      };
    }
    case "UPDATE_STAFF": {
      const staffId =
        numberValue(payload.id) ??
        numberValue(payload.staff_id);
      const staff =
        staffId
          ? await prisma.users.findFirst({
              where: {
                id: staffId,
                ...(schoolId
                  ? {
                      school_id:
                        schoolId,
                    }
                  : {}),
              },
            })
          : await prisma.users.findFirst({
              where: {
                email: String(
                  payload.email
                ),
                ...(schoolId
                  ? {
                      school_id:
                        schoolId,
                    }
                  : {}),
              },
            });

      if (!staff) {
        throw new Error(
          "Staff user not found for the provided identifier."
        );
      }

      const user =
        await prisma.users.update({
          where: {
            id: staff.id,
          },
          data: {
            full_name:
              optionalString(
                payload,
                "full_name"
              ),
            email:
              optionalString(
                payload,
                "email"
              ),
            phone:
              optionalString(
                payload,
                "phone"
              ),
            role:
              hasPayloadValue(
                payload,
                "role"
              )
                ? String(
                    payload.role
                  ).toUpperCase()
                : undefined,
          },
        });

      return {
        entity_type: "user",
        entity_id: user.id,
        record: {
          ...user,
          password_hash:
            "[redacted]",
        },
        message:
          "Staff user updated after approval.",
      };
    }
    case "CREATE_EXAM": {
      const exam =
        await prisma.exams.create({
          data: {
            school_id: schoolId,
            exam_name:
              stringValue(
                payload.exam_name
              ),
            exam_type:
              stringValue(
                payload.exam_type
              ),
            start_date:
              dateValue(
                payload.start_date
              ),
            end_date:
              dateValue(payload.end_date),
          },
        });

      return {
        entity_type: "exam",
        entity_id: exam.id,
        record: exam,
        message:
          "Exam created after approval.",
      };
    }
    case "UPDATE_EXAM": {
      const examId =
        numberValue(payload.id) ??
        numberValue(payload.exam_id);
      const existing = examId
        ? await prisma.exams.findFirst({
            where: {
              id: examId,
              ...(schoolId
                ? {
                    school_id:
                      schoolId,
                  }
                : {}),
            },
          })
        : await prisma.exams.findFirst({
            where: {
              exam_name: String(
                payload.exam_name
              ),
              ...(schoolId
                ? {
                    school_id:
                      schoolId,
                  }
                : {}),
            },
            orderBy: {
              id: "desc",
            },
          });

      if (!existing) {
        throw new Error(
          "Exam not found for the provided identifier."
        );
      }

      const exam =
        await prisma.exams.update({
          where: {
            id: existing.id,
          },
          data: {
            exam_name:
              optionalString(
                payload,
                "exam_name"
              ),
            exam_type:
              optionalString(
                payload,
                "exam_type"
              ),
            start_date:
              optionalDate(
                payload,
                "start_date"
              ),
            end_date:
              optionalDate(
                payload,
                "end_date"
              ),
          },
        });

      return {
        entity_type: "exam",
        entity_id: exam.id,
        record: exam,
        message:
          "Exam updated after approval.",
      };
    }
    case "CREATE_EXAM_SCHEDULE": {
      const schedule =
        await prisma.exam_schedule.create({
          data: {
            exam_type_id:
              numberValue(
                payload.exam_type_id
              ),
            question_paper_id:
              numberValue(
                payload.question_paper_id
              ),
            class_id:
              numberValue(
                payload.class_id
              ),
            section_id:
              numberValue(
                payload.section_id
              ),
            subject_id:
              numberValue(
                payload.subject_id
              ),
            exam_date:
              dateValue(
                payload.exam_date
              ),
            start_time:
              timeValue(
                payload.start_time
              ),
            end_time:
              timeValue(
                payload.end_time
              ),
            room_no:
              stringValue(
                payload.room_no
              ),
            invigilator_teacher_id:
              numberValue(
                payload.invigilator_teacher_id
              ),
            status: "SCHEDULED",
          },
        });

      return {
        entity_type:
          "exam_schedule",
        entity_id: schedule.id,
        record: schedule,
        message:
          "Exam schedule created after approval.",
      };
    }
    case "UPDATE_EXAM_SCHEDULE": {
      const scheduleId =
        numberValue(payload.id) ??
        numberValue(payload.schedule_id);

      if (!scheduleId) {
        throw new Error(
          "Exam schedule id is required for update."
        );
      }

      const schedule =
        await prisma.exam_schedule.update({
          where: {
            id: scheduleId,
          },
          data: {
            exam_type_id:
              optionalNumber(
                payload,
                "exam_type_id"
              ),
            question_paper_id:
              optionalNumber(
                payload,
                "question_paper_id"
              ),
            class_id:
              optionalNumber(
                payload,
                "class_id"
              ),
            section_id:
              optionalNumber(
                payload,
                "section_id"
              ),
            subject_id:
              optionalNumber(
                payload,
                "subject_id"
              ),
            exam_date:
              optionalDate(
                payload,
                "exam_date"
              ),
            start_time:
              hasPayloadValue(
                payload,
                "start_time"
              )
                ? timeValue(
                    payload.start_time
                  )
                : undefined,
            end_time:
              hasPayloadValue(
                payload,
                "end_time"
              )
                ? timeValue(
                    payload.end_time
                  )
                : undefined,
            room_no:
              optionalString(
                payload,
                "room_no"
              ),
            invigilator_teacher_id:
              optionalNumber(
                payload,
                "invigilator_teacher_id"
              ),
            status:
              optionalString(
                payload,
                "status"
              ),
          },
        });

      return {
        entity_type:
          "exam_schedule",
        entity_id: schedule.id,
        record: schedule,
        message:
          "Exam schedule updated after approval.",
      };
    }
    case "CREATE_HOMEWORK": {
      const rows =
        await prisma.$queryRawUnsafe<
          {
            id: number;
          }[]
        >(
          `
          INSERT INTO homework_assignments (
            school_id,
            academic_year_id,
            class_id,
            section_id,
            subject_id,
            teacher_id,
            title,
            description,
            due_date,
            status,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'ACTIVE',$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          numberValue(payload.class_id),
          numberValue(payload.section_id),
          numberValue(payload.subject_id),
          numberValue(payload.teacher_id),
          stringValue(payload.title),
          stringValue(payload.description),
          dateValue(payload.due_date),
          null
        );

      return {
        entity_type: "homework",
        entity_id: rows[0]?.id ?? null,
        record: rows[0],
        message:
          "Homework created after approval.",
      };
    }
    case "CREATE_QUESTION_PAPER": {
      const paper =
        await prisma.question_papers.create({
          data: {
            exam_type_id:
              numberValue(
                payload.exam_type_id
              ),
            class_id:
              numberValue(
                payload.class_id
              ),
            section_id:
              numberValue(
                payload.section_id
              ),
            subject_id:
              numberValue(
                payload.subject_id
              ),
            paper_name:
              stringValue(
                payload.paper_name
              ),
            total_marks:
              numberValue(
                payload.total_marks
              ),
            exam_date:
              dateValue(
                payload.exam_date
              ),
          },
        });

      return {
        entity_type:
          "question_paper",
        entity_id: paper.id,
        record: paper,
        message:
          "Question paper created after approval.",
      };
    }
    case "CREATE_ROUTE": {
      const route =
        await prisma.transport_routes.create({
          data: {
            school_id: schoolId,
            route_name:
              stringValue(
                payload.route_name
              ),
            vehicle_number:
              stringValue(
                payload.vehicle_number
              ),
            driver_name:
              stringValue(
                payload.driver_name
              ),
            driver_phone:
              stringValue(
                payload.driver_phone
              ),
          },
        });

      return {
        entity_type:
          "transport_route",
        entity_id: route.id,
        record: route,
        message:
          "Transport route created after approval.",
      };
    }
    case "UPDATE_ROUTE": {
      const routeId =
        numberValue(payload.id) ??
        numberValue(payload.route_id);
      const existing = routeId
        ? await prisma.transport_routes.findFirst(
            {
              where: {
                id: routeId,
                ...(schoolId
                  ? {
                      school_id:
                        schoolId,
                    }
                  : {}),
              },
            }
          )
        : await prisma.transport_routes.findFirst(
            {
              where: {
                route_name: String(
                  payload.route_name
                ),
                ...(schoolId
                  ? {
                      school_id:
                        schoolId,
                    }
                  : {}),
              },
              orderBy: {
                id: "desc",
              },
            }
          );

      if (!existing) {
        throw new Error(
          "Transport route not found for the provided identifier."
        );
      }

      const route =
        await prisma.transport_routes.update({
          where: {
            id: existing.id,
          },
          data: {
            route_name:
              optionalString(
                payload,
                "route_name"
              ),
            vehicle_number:
              optionalString(
                payload,
                "vehicle_number"
              ),
            driver_name:
              optionalString(
                payload,
                "driver_name"
              ),
            driver_phone:
              optionalString(
                payload,
                "driver_phone"
              ),
          },
        });

      return {
        entity_type:
          "transport_route",
        entity_id: route.id,
        record: route,
        message:
          "Transport route updated after approval.",
      };
    }
    case "CREATE_HOSTEL": {
      const hostel =
        await prisma.hostels.create({
          data: {
            school_id: schoolId,
            hostel_name:
              stringValue(
                payload.hostel_name
              ),
            hostel_type:
              stringValue(
                payload.hostel_type
              ),
            warden_name:
              stringValue(
                payload.warden_name
              ),
            warden_phone:
              stringValue(
                payload.warden_phone
              ),
          },
        });

      return {
        entity_type: "hostel",
        entity_id: hostel.id,
        record: hostel,
        message:
          "Hostel created after approval.",
      };
    }
    case "UPDATE_HOSTEL": {
      const hostelId =
        numberValue(payload.id) ??
        numberValue(payload.hostel_id);
      const existing = hostelId
        ? await prisma.hostels.findFirst({
            where: {
              id: hostelId,
              ...(schoolId
                ? {
                    school_id:
                      schoolId,
                  }
                : {}),
            },
          })
        : await prisma.hostels.findFirst({
            where: {
              hostel_name: String(
                payload.hostel_name
              ),
              ...(schoolId
                ? {
                    school_id:
                      schoolId,
                  }
                : {}),
            },
            orderBy: {
              id: "desc",
            },
          });

      if (!existing) {
        throw new Error(
          "Hostel not found for the provided identifier."
        );
      }

      const hostel =
        await prisma.hostels.update({
          where: {
            id: existing.id,
          },
          data: {
            hostel_name:
              optionalString(
                payload,
                "hostel_name"
              ),
            hostel_type:
              optionalString(
                payload,
                "hostel_type"
              ),
            warden_name:
              optionalString(
                payload,
                "warden_name"
              ),
            warden_phone:
              optionalString(
                payload,
                "warden_phone"
              ),
          },
        });

      return {
        entity_type: "hostel",
        entity_id: hostel.id,
        record: hostel,
        message:
          "Hostel updated after approval.",
      };
    }
    case "CREATE_DINING_PLAN": {
      const rows =
        await prisma.$queryRawUnsafe<
          {
            id: number;
          }[]
        >(
          `
          INSERT INTO dining_meal_plans (
            school_id,
            academic_year_id,
            plan_name,
            meal_type,
            price,
            status,
            metadata,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          stringValue(payload.plan_name),
          stringValue(payload.meal_type) ??
            "LUNCH",
          numberValue(payload.price) ?? 0,
          stringValue(payload.status) ??
            "ACTIVE",
          JSON.stringify(
            asRecord(payload.metadata)
          ),
          null
        );

      return {
        entity_type: "dining_plan",
        entity_id: rows[0]?.id ?? null,
        record: rows[0],
        message:
          "Dining meal plan created after approval.",
      };
    }
    case "UPDATE_DINING_PLAN": {
      const planId =
        numberValue(payload.id) ??
        numberValue(payload.meal_plan_id);
      const rows =
        await prisma.$queryRawUnsafe<
          {
            id: number;
          }[]
        >(
          `
          UPDATE dining_meal_plans
          SET plan_name = COALESCE($1, plan_name),
              meal_type = COALESCE($2, meal_type),
              price = COALESCE($3, price),
              status = COALESCE($4, status),
              updated_at = CURRENT_TIMESTAMP
          WHERE (
              ($5::int IS NOT NULL AND id = $5::int)
              OR ($5::int IS NULL AND plan_name = $6)
            )
            AND ($7::int IS NULL OR school_id = $7::int)
          RETURNING *
          `,
          optionalString(
            payload,
            "plan_name"
          ) ?? null,
          optionalString(
            payload,
            "meal_type"
          ) ?? null,
          optionalNumber(
            payload,
            "price"
          ) ?? null,
          optionalString(
            payload,
            "status"
          ) ?? null,
          planId,
          stringValue(payload.plan_name),
          schoolId
        );

      if (!rows[0]) {
        throw new Error(
          "Dining plan not found for the provided identifier."
        );
      }

      return {
        entity_type: "dining_plan",
        entity_id: rows[0].id,
        record: rows[0],
        message:
          "Dining meal plan updated after approval.",
      };
    }
    case "GENERATE_INVOICE": {
      const total =
        numberValue(
          payload.total_amount
        ) ?? 0;
      const paid =
        numberValue(
          payload.paid_amount
        ) ?? 0;
      const invoice =
        await prisma.invoices.create({
          data: {
            invoice_number:
              stringValue(
                payload.invoice_number
              ) ??
              `AI-${schoolId ?? "S"}-${Date.now()}`,
            student_id:
              numberValue(
                payload.student_id
              ),
            invoice_date:
              dateValue(
                payload.invoice_date
              ) ?? new Date(),
            due_date:
              dateValue(payload.due_date),
            total_amount: total,
            paid_amount: paid,
            balance_amount:
              total - paid,
            status:
              stringValue(
                payload.status
              ) ?? "PENDING",
          },
        });

      return {
        entity_type: "invoice",
        entity_id: invoice.id,
        record: invoice,
        message:
          "Invoice generated after approval.",
      };
    }
    case "ASSIGN_TRANSPORT": {
      const student =
        await prisma.students.update({
          where: {
            id: Number(
              numberValue(
                payload.student_id
              )
            ),
          },
          data: {
            transport_required:
              true,
            transport_route_id:
              numberValue(
                payload
                  .transport_route_id
              ) ??
              numberValue(
                payload.route_id
              ),
          },
        });

      return {
        entity_type: "student",
        entity_id: student.id,
        record: student,
        message:
          "Transport assigned after approval.",
      };
    }
    case "ASSIGN_HOSTEL": {
      const studentId = Number(
        numberValue(
          payload.student_id
        )
      );
      const roomId =
        numberValue(
          payload.hostel_room_id
        ) ??
        numberValue(payload.room_id);
      const hostelId =
        numberValue(
          payload.hostel_id
        );

      const [
        student,
        allocation,
      ] = await prisma.$transaction([
        prisma.students.update({
          where: {
            id: studentId,
          },
          data: {
            hostel_required: true,
            hostel_room_id: roomId,
          },
        }),
        prisma.hostel_allocations.create({
          data: {
            school_id: schoolId,
            student_id: studentId,
            hostel_id: hostelId,
            room_id: roomId,
            bed_number:
              stringValue(
                payload.bed_number
              ),
            allocation_date:
              dateValue(
                payload.allocation_date
              ) ?? new Date(),
          },
        }),
      ]);

      return {
        entity_type: "student",
        entity_id: student.id,
        record: {
          student,
          allocation,
        },
        message:
          "Hostel assigned after approval.",
      };
    }
    case "ASSIGN_DINING": {
      const rows =
        await prisma.$queryRawUnsafe<
          {
            id: number;
          }[]
        >(
          `
          INSERT INTO dining_meal_assignments (
            school_id,
            academic_year_id,
            meal_plan_id,
            student_id,
            teacher_id,
            staff_id,
            start_date,
            end_date,
            status,
            metadata,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          numberValue(
            payload.meal_plan_id
          ),
          numberValue(
            payload.student_id
          ),
          numberValue(
            payload.teacher_id
          ),
          numberValue(
            payload.staff_id
          ),
          dateValue(
            payload.start_date
          ) ?? new Date(),
          dateValue(payload.end_date),
          stringValue(payload.status) ??
            "ACTIVE",
          JSON.stringify(
            asRecord(payload.metadata)
          )
        );

      return {
        entity_type: "student",
        entity_id:
          numberValue(
            payload.student_id
          ),
        record: rows[0],
        message:
          "Dining plan assigned after approval.",
      };
    }
    case "CREATE_TIMETABLE": {
      const rows =
        await prisma.$queryRawUnsafe<
          {
            id: number;
          }[]
        >(
          `
          INSERT INTO timetable_entries (
            school_id,
            academic_year_id,
            class_id,
            section_id,
            subject_id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            room_no,
            status,
            metadata,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'ACTIVE',$11::jsonb,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,
          schoolId,
          academicYearId,
          numberValue(payload.class_id),
          numberValue(
            payload.section_id
          ),
          numberValue(
            payload.subject_id
          ),
          numberValue(
            payload.teacher_id
          ),
          stringValue(
            payload.day_of_week
          ),
          timeValue(
            payload.start_time
          ),
          timeValue(payload.end_time),
          stringValue(payload.room_no),
          JSON.stringify(
            asRecord(payload.metadata)
          ),
          null
        );

      return {
        entity_type: "timetable",
        entity_id: rows[0]?.id ?? null,
        record: rows[0],
        message:
          "Timetable entry created after approval.",
      };
    }
    case "GENERATE_REPORTS": {
      const report =
        await prisma.report_exports.create({
          data: {
            school_id: schoolId,
            report_key:
              stringValue(
                payload.report_key
              ) ?? "ai-generated-report",
            format:
              stringValue(payload.format) ??
              "json",
            status: "READY",
            filter_json:
              asJson(
                payload.filters ?? {}
              ),
            created_by: null,
          },
        });

      return {
        entity_type:
          "report_export",
        entity_id: report.id,
        record: report,
        message:
          "Report export generated after approval.",
      };
    }
    default:
      return {
        entity_type: "ai_action",
        operationalRecord: true,
        record: {
          action_type: actionType,
          payload,
        },
        message:
          "No recovered production table exists for this action. The approved operation was preserved in AI action history and Event Ledger.",
      };
  }
}

export async function executeApprovedActionRequest(
  input: ExecutionInput
) {
  const action =
    await getActionRequest(
      input.user,
      input.id
    );

  if (!action) {
    throw new Error(
      "AI action request not found"
    );
  }

  if (
    action.status !== "APPROVED"
  ) {
    throw new Error(
      `Action must be APPROVED before execution. Current status: ${action.status}.`
    );
  }

  const actionType =
    action.action_type as SupportedAction;
  const payload =
    asRecord(
      action.normalized_payload
    );
  const started = Date.now();

  try {
    const result =
      await executeAction(
        actionType,
        payload,
        action.school_id,
        action.academic_year_id
      );

    const event =
      await recordEvent({
        school_id:
          action.school_id,
        academic_year_id:
          action.academic_year_id,
        user_id: input.user.id,
        actor_role:
          input.user.role,
        module_name:
          action.module_name,
        event_type:
          "AI_ACTION_EXECUTED",
        action:
          action.action_type,
        entity_type:
          result.entity_type,
        entity_id:
          result.entity_id ?? null,
        summary:
          result.message,
        payload: {
          actionId:
            action.id,
          requestId:
            action.request_id,
          actionType:
            action.action_type,
          result:
            result.record,
        },
      });

    const updated =
      await prisma.ai_action_requests.update({
        where: {
          id: action.id,
        },
        data: {
          status: "EXECUTED",
          executed_by:
            input.user.id ?? null,
          executed_at: new Date(),
          execution_result:
            asJson(result),
          event_id: event.id,
          updated_at: new Date(),
        },
      });

    await recordAIObservability({
      request_id:
        action.request_id,
      school_id:
        action.school_id,
      user_id:
        input.user.id ?? null,
      layer: "action",
      event_type:
        "ACTION_EXECUTED",
      action_request_id:
        action.id,
      latency_ms:
        Date.now() - started,
      success: true,
      payload: {
        action_type:
          action.action_type,
        event_id: event.id,
        entity_type:
          result.entity_type,
        entity_id:
          result.entity_id,
      },
    });

    return {
      action: updated,
      result,
      event,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Action execution failed";

    await prisma.ai_action_requests.update({
      where: {
        id: action.id,
      },
      data: {
        status: "FAILED",
        failure_reason:
          message,
        updated_at: new Date(),
      },
    });

    await recordAIObservability({
      request_id:
        action.request_id,
      school_id:
        action.school_id,
      user_id:
        input.user.id ?? null,
      layer: "action",
      event_type:
        "ACTION_EXECUTION_FAILED",
      action_request_id:
        action.id,
      latency_ms:
        Date.now() - started,
      success: false,
      payload: {
        action_type:
          action.action_type,
        error: message,
      },
    });

    await recordEvent({
      school_id:
        action.school_id,
      academic_year_id:
        action.academic_year_id,
      user_id: input.user.id,
      actor_role:
        input.user.role,
      module_name: "ai",
      event_type:
        "AI_ACTION_EXECUTION_FAILED",
      action:
        action.action_type,
      entity_type:
        action.target_entity_type,
      summary:
        `AI action execution failed: ${action.action_type}`,
      severity: "ERROR",
      payload: {
        actionId:
          action.id,
        requestId:
          action.request_id,
        error: message,
      },
    });

    throw error;
  }
}
