type PlannedAction = {
  mode: "action";
  action_type: string;
  payload: Record<string, unknown>;
  confidence: number;
  missing_fields: string[];
  explanation: string;
};

type PlannedKnowledge = {
  mode: "knowledge";
  include_internet: boolean;
  confidence: number;
  explanation: string;
};

export type PlannerResult =
  | PlannedAction
  | PlannedKnowledge;

const actionEntities = [
  "student",
  "teacher",
  "staff",
  "exam schedule",
  "exam",
  "homework",
  "question paper",
  "route",
  "transport",
  "hostel",
  "dining",
  "meal plan",
  "invoice",
  "timetable",
  "report",
];

const educationTerms = [
  "government order",
  "go",
  "andhra",
  "andhrapradesh",
  "andhra pradesh",
  "cbse",
  "ncert",
  "ugc",
  "aicte",
  "scholarship",
  "circular",
  "education",
  "school/college policy",
  "exam rule",
  "academic policy",
];

const normalized = (value: string) =>
  value.toLowerCase().trim();

const toTitleCase = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
    )
    .join(" ");

const numberFrom = (
  value: string,
  pattern: RegExp
) => {
  const match = value.match(pattern);
  return match?.[1]
    ? Number(match[1])
    : null;
};

const textFrom = (
  value: string,
  pattern: RegExp
) => {
  const match = value.match(pattern);
  return match?.[1]?.trim() || null;
};

const parseJsonPayload = (
  prompt: string
) => {
  const jsonBlock =
    prompt.match(/\{[\s\S]*\}/);

  if (!jsonBlock) {
    return {};
  }

  try {
    const parsed = JSON.parse(
      jsonBlock[0]
    );

    return parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
      ? (parsed as Record<
          string,
          unknown
        >)
      : {};
  } catch {
    return {};
  }
};

const parseKeyValues = (
  prompt: string
) => {
  const payload: Record<
    string,
    unknown
  > = {};
  const known = [
    "id",
    "student_id",
    "teacher_id",
    "staff_id",
    "exam_id",
    "schedule_id",
    "route_id",
    "hostel_id",
    "room_id",
    "meal_plan_id",
    "class_id",
    "section_id",
    "subject_id",
    "exam_type_id",
    "question_paper_id",
    "first_name",
    "last_name",
    "name",
    "email",
    "phone",
    "admission_number",
    "employee_id",
    "role",
    "exam_name",
    "exam_type",
    "exam_date",
    "start_date",
    "end_date",
    "start_time",
    "end_time",
    "room_no",
    "route_name",
    "vehicle_number",
    "driver_name",
    "driver_phone",
    "hostel_name",
    "hostel_type",
    "warden_name",
    "warden_phone",
    "plan_name",
    "meal_type",
    "price",
    "title",
    "description",
    "due_date",
    "paper_name",
    "total_marks",
    "total_amount",
    "paid_amount",
    "pickup_point",
    "drop_point",
    "bed_number",
    "day_of_week",
    "format",
    "report_key",
  ];

  for (const key of known) {
    const friendly =
      key.replaceAll("_", "[ _-]");
    const match = prompt.match(
      new RegExp(
        `(?:^|[\\s\\n,;])${friendly}\\s*[:=]\\s*([^\\n,;]+)`,
        "i"
      )
    );

    if (match?.[1]) {
      payload[key] =
        match[1].trim();
    }
  }

  return payload;
};

const extractCommonPayload = (
  prompt: string
) => {
  const payload = {
    ...parseJsonPayload(prompt),
    ...parseKeyValues(prompt),
  };
  const lower = normalized(prompt);
  const email =
    textFrom(
      prompt,
      /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i
    );
  const phone =
    textFrom(
      prompt,
      /\b(\+?\d[\d\s-]{8,}\d)\b/
    );

  if (email && !payload.email) {
    payload.email = email;
  }

  if (phone && !payload.phone) {
    payload.phone =
      phone.replace(/[^\d+]/g, "");
  }

  const id =
    numberFrom(
      lower,
      /\b(?:id|record)\s*#?\s*(\d+)\b/
    );

  if (id && !payload.id) {
    payload.id = id;
  }

  const studentId =
    numberFrom(
      lower,
      /\bstudent\s*(?:id)?\s*#?\s*(\d+)\b/
    );

  if (studentId) {
    payload.student_id = studentId;
  }

  const teacherId =
    numberFrom(
      lower,
      /\bteacher\s*(?:id)?\s*#?\s*(\d+)\b/
    );

  if (teacherId) {
    payload.teacher_id = teacherId;
  }

  const routeId =
    numberFrom(
      lower,
      /\broute\s*(?:id)?\s*#?\s*(\d+)\b/
    );

  if (routeId) {
    payload.route_id = routeId;
  }

  const amount =
    numberFrom(
      lower,
      /(?:amount|fee|invoice)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)/i
    );

  if (amount && !payload.total_amount) {
    payload.total_amount = amount;
  }

  return payload;
};

const inferName = (
  prompt: string,
  entity: string
) => {
  const match = prompt.match(
    new RegExp(
      `${entity}\\s+(?:named\\s+|name\\s+)?([A-Za-z][A-Za-z .'-]{2,60})`,
      "i"
    )
  );
  const raw =
    match?.[1]
      ?.replace(
        /\b(with|phone|email|admission|employee|class|section|for|route|hostel|exam|schedule|fee|amount)\b[\s\S]*$/i,
        ""
      )
      .trim() || null;

  if (!raw) {
    return {};
  }

  const parts =
    toTitleCase(raw).split(/\s+/);

  return {
    first_name: parts[0],
    last_name:
      parts.slice(1).join(" ") ||
      null,
    name: parts.join(" "),
  };
};

function inferActionType(
  prompt: string
) {
  const lower = normalized(prompt);
  const isInformationalReport =
    /\b(show|give|view|what|why|which|how|analyze|analyse|predict|compare|summarize|summary)\b/.test(
      lower
    );
  const isUpdate =
    /\b(update|change|edit|modify|correct)\b/.test(
      lower
    );
  const isAssign =
    /\b(assign|allocate|allot)\b/.test(
      lower
    );
  const isGenerate =
    /\b(generate|create invoice|make invoice)\b/.test(
      lower
    );
  const isCreate =
    /\b(create|add|new|schedule)\b/.test(
      lower
    );

  if (
    isAssign &&
    lower.includes("transport")
  ) {
    return "ASSIGN_TRANSPORT";
  }

  if (
    isAssign &&
    lower.includes("hostel")
  ) {
    return "ASSIGN_HOSTEL";
  }

  if (
    isAssign &&
    (lower.includes("dining") ||
      lower.includes("meal"))
  ) {
    return "ASSIGN_DINING";
  }

  if (
    isGenerate &&
    lower.includes("invoice")
  ) {
    return "GENERATE_INVOICE";
  }

  if (
    lower.includes("exam schedule")
  ) {
    return isUpdate
      ? "UPDATE_EXAM_SCHEDULE"
      : "CREATE_EXAM_SCHEDULE";
  }

  if (lower.includes("student")) {
    return isUpdate
      ? "UPDATE_STUDENT"
      : isCreate
      ? "CREATE_STUDENT"
      : null;
  }

  if (
    lower.includes("teacher")
  ) {
    return isUpdate
      ? "UPDATE_TEACHER"
      : isCreate
      ? "CREATE_TEACHER"
      : null;
  }

  if (lower.includes("staff")) {
    return isUpdate
      ? "UPDATE_STAFF"
      : isCreate
      ? "CREATE_STAFF"
      : null;
  }

  if (
    lower.includes("question paper")
  ) {
    return "CREATE_QUESTION_PAPER";
  }

  if (lower.includes("homework")) {
    return "CREATE_HOMEWORK";
  }

  if (
    lower.includes("timetable")
  ) {
    return "CREATE_TIMETABLE";
  }

  if (
    lower.includes("route") ||
    lower.includes("transport")
  ) {
    return isUpdate
      ? "UPDATE_ROUTE"
      : isCreate
      ? "CREATE_ROUTE"
      : null;
  }

  if (lower.includes("hostel")) {
    return isUpdate
      ? "UPDATE_HOSTEL"
      : isCreate
      ? "CREATE_HOSTEL"
      : null;
  }

  if (
    lower.includes("meal plan") ||
    lower.includes("dining")
  ) {
    return isUpdate
      ? "UPDATE_DINING_PLAN"
      : isCreate
      ? "CREATE_DINING_PLAN"
      : null;
  }

  if (lower.includes("exam")) {
    return isUpdate
      ? "UPDATE_EXAM"
      : isCreate
      ? "CREATE_EXAM"
      : null;
  }

  if (lower.includes("report")) {
    return isGenerate &&
      !isInformationalReport
      ? "GENERATE_REPORTS"
      : null;
  }

  return null;
}

function enrichPayload(
  actionType: string,
  prompt: string,
  payload: Record<string, unknown>
) {
  const lower = normalized(prompt);

  if (
    actionType.includes("STUDENT")
  ) {
    Object.assign(
      payload,
      {
        ...inferName(
          prompt,
          "student"
        ),
        ...payload,
      }
    );
  }

  if (
    actionType.includes("TEACHER")
  ) {
    Object.assign(
      payload,
      {
        ...inferName(
          prompt,
          "teacher"
        ),
        ...payload,
      }
    );
  }

  if (
    actionType.includes("STAFF") &&
    !payload.full_name
  ) {
    const name =
      inferName(prompt, "staff")
        .name;
    if (name) {
      payload.full_name = name;
    }
  }

  if (
    actionType.includes("ROUTE") &&
    !payload.route_name
  ) {
    const route =
      textFrom(
        prompt,
        /route\s+(?:named\s+|name\s+)?([A-Za-z0-9 .'-]{2,60})/i
      );
    if (route) {
      payload.route_name =
        route
          .replace(
            /\b(with|driver|vehicle|phone)\b[\s\S]*$/i,
            ""
          )
          .trim();
    }
  }

  if (
    actionType.includes("HOSTEL") &&
    !payload.hostel_name
  ) {
    const hostel =
      textFrom(
        prompt,
        /hostel\s+(?:named\s+|name\s+)?([A-Za-z0-9 .'-]{2,60})/i
      );
    if (hostel) {
      payload.hostel_name =
        hostel
          .replace(
            /\b(with|warden|phone|room)\b[\s\S]*$/i,
            ""
          )
          .trim();
    }
  }

  if (
    actionType.includes("DINING") &&
    !payload.meal_type
  ) {
    for (const meal of [
      "breakfast",
      "lunch",
      "snacks",
      "dinner",
    ]) {
      if (lower.includes(meal)) {
        payload.meal_type =
          meal.toUpperCase();
      }
    }
  }

  if (
    actionType ===
      "CREATE_DINING_PLAN" &&
    !payload.plan_name
  ) {
    payload.plan_name =
      textFrom(
        prompt,
        /(?:meal plan|dining plan)\s+(?:named\s+)?([A-Za-z0-9 .'-]{2,80})/i
      ) || payload.meal_type || "Meal Plan";
  }

  if (
    actionType.includes("EXAM") &&
    !payload.exam_name
  ) {
    const exam =
      textFrom(
        prompt,
        /exam\s+(?:named\s+|name\s+)?([A-Za-z0-9 .'-]{2,80})/i
      );
    if (exam) {
      payload.exam_name =
        exam
          .replace(
            /\b(on|from|to|for|class|section|subject)\b[\s\S]*$/i,
            ""
          )
          .trim();
    }
  }

  return payload;
}

function missingFor(
  actionType: string,
  payload: Record<string, unknown>
) {
  const has = (key: string) =>
    payload[key] !== undefined &&
    payload[key] !== null &&
    String(payload[key]).trim() !== "";
  const any = (keys: string[]) =>
    keys.some(has);

  switch (actionType) {
    case "CREATE_STUDENT":
      return any([
        "first_name",
        "name",
      ])
        ? []
        : ["student name"];
    case "UPDATE_STUDENT":
      return [
        any([
          "id",
          "student_id",
          "admission_number",
          "email",
        ])
          ? null
          : "student id/admission/email",
      ].filter(Boolean) as string[];
    case "CREATE_TEACHER":
      return any([
        "first_name",
        "email",
      ])
        ? []
        : ["teacher name or email"];
    case "UPDATE_TEACHER":
      return [
        any([
          "id",
          "teacher_id",
          "employee_id",
          "email",
        ])
          ? null
          : "teacher id/employee/email",
      ].filter(Boolean) as string[];
    case "CREATE_STAFF":
      return [
        has("full_name")
          ? null
          : "staff full name",
        has("email")
          ? null
          : "staff email",
        has("role") ? null : "staff role",
      ].filter(Boolean) as string[];
    case "CREATE_EXAM":
      return has("exam_name")
        ? []
        : ["exam name"];
    case "CREATE_ROUTE":
      return has("route_name")
        ? []
        : ["route name"];
    case "CREATE_HOSTEL":
      return has("hostel_name")
        ? []
        : ["hostel name"];
    case "GENERATE_INVOICE":
      return [
        has("student_id")
          ? null
          : "student id",
        has("total_amount")
          ? null
          : "amount",
      ].filter(Boolean) as string[];
    default:
      return [];
  }
}

export function planTottechAIRequest(
  prompt: string
): PlannerResult {
  const text = prompt.trim();
  const lower = normalized(text);
  const actionType =
    inferActionType(text);
  const containsActionEntity =
    actionEntities.some((entity) =>
      lower.includes(entity)
    );
  const containsEducationTerm =
    educationTerms.some((term) =>
      lower.includes(term)
    );

  if (
    actionType &&
    containsActionEntity
  ) {
    const payload = enrichPayload(
      actionType,
      text,
      extractCommonPayload(text)
    );
    const missing =
      missingFor(actionType, payload);

    return {
      mode: "action",
      action_type: actionType,
      payload,
      confidence:
        missing.length === 0
          ? 0.86
          : 0.58,
      missing_fields: missing,
      explanation:
        "Detected a school/college operation request. TOTTECH AI will create a preview and wait for approval before any database write.",
    };
  }

  return {
    mode: "knowledge",
    include_internet:
      containsEducationTerm,
    confidence:
      containsEducationTerm
        ? 0.8
        : 0.65,
    explanation:
      containsEducationTerm
        ? "Detected an education or government-policy question. Official sources and governed internet search will be prioritized after ERP grounding."
        : "Detected an informational school/college question. ERP, documents, and event ledger grounding will be used first.",
  };
}
