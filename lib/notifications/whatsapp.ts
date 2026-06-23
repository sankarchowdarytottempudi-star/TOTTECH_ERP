import { prisma } from "@/lib/prisma";
import { recordEvent } from "@/lib/governance/events";
import {
  buildPublicInvoicePdfUrl,
  buildPublicPaymentReceiptUrl,
} from "@/lib/public-document-links";
import { pickPreferredPhone } from "@/lib/contact-utils";

type Row = Record<string, unknown>;

type WhatsAppContext = {
  schoolId?: number | null;
  academicYearId?: number | null;
  userId?: number | null;
  studentId?: number | null;
  entityType?: string | null;
  entityId?: number | null;
  triggeredBy?: string | null;
};

type QueueInput = WhatsAppContext & {
  templateName: string;
  recipient?: string | null;
  variables: Array<string | number | null | undefined>;
  messagePreview?: string | null;
};

const templatePreview: Record<
  string,
  string
> = {
  student_created:
    "Student {{1}} has been created with admission number {{2}} at {{3}}.",
  payment_received:
    "Payment received for {{1}}. Invoice {{2}}, reference {{3}}, paid {{4}}, balance {{5}}. Receipt: {{6}}",
  invoice_created:
    "Invoice {{2}} for {{1}} has been generated for {{3}}. Due date / link: {{4}}.",
  payment_due_reminder:
    "Fee reminder for {{1}}. Invoice {{2}}, amount due {{3}}, due date {{4}}. {{5}} {{6}}",
  homework_assigned:
    "Homework assigned to {{1}}: {{2}} for {{3}} ({{4}}), due {{5}}. {{6}}",
  exam_schedule_created:
    "Exam scheduled for {{1}}: {{2}} - {{3}} on {{4}} at {{5}}, room {{6}}.",
  exam_schedule_reminder:
    "Exam reminder for {{1}}: {{2}} ({{3}}), first exam {{4}}. {{5}}",
  monthly_attendance_report:
    "Attendance report for {{1}} - {{2}}: {{3}}%, present {{4}}, absent {{5}}, late {{6}}, leave {{7}}.",
  student_absent_alert:
    "Dear parent, {{1}} is marked absent on {{2}} for {{3}}. Please contact {{4}} if this is incorrect.",
  ptm_scheduled:
    `Dear Parent,

A Parent Teacher Meeting has been scheduled.

Student: {{1}}
Class: {{2}}
Teacher: {{3}}

Date: {{4}}
Time: {{5}}

Venue: {{6}}

Please attend the meeting.

{{7}} School/College`,
  ptm_reminder:
    `Reminder:

Parent Teacher Meeting for {{1}}

Date: {{2}}
Time: {{3}}

Venue: {{4}}

Please attend.

{{5}} School/College`,
  ptm_feedback:
    `Thank you for attending PTM.

Student: {{1}}

Teacher Remarks:
{{2}}

Action Items:
{{3}}

{{4}} School/College`,
};

const enabled = () =>
  String(
    process.env.WHATSAPP_ENABLED ||
      "false"
  )
    .trim()
    .toLowerCase() === "true";

const baseUrl = () =>
  String(
    process.env.WHATSAPP_BASE_URL ||
      ""
  ).trim();

const apiKey = () =>
  String(
    process.env.WHATSAPP_API_KEY ||
      ""
  ).trim();

const providerName = () =>
  String(
    process.env.WHATSAPP_PROVIDER ||
      "interakt"
  )
    .trim()
    .toLowerCase();

const templateLanguage = () =>
  String(
    process.env.WHATSAPP_TEMPLATE_LANGUAGE ||
      "en"
  ).trim();

const defaultCountryCode = () =>
  String(
    process.env.WHATSAPP_DEFAULT_COUNTRY_CODE ||
      "+91"
  )
    .trim()
    .replace(/^\+?/, "+");

export function whatsappProviderStatus() {
  return {
    provider: providerName(),
    enabled: enabled(),
    hasApiKey: Boolean(apiKey()),
    hasBaseUrl: Boolean(baseUrl()),
    configured:
      enabled() &&
      Boolean(apiKey()) &&
      Boolean(baseUrl()),
  };
}

function settingEnabled(
  value: unknown
) {
  if (
    typeof value === "boolean"
  ) {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "enabled" in value
  ) {
    return Boolean(
      (value as { enabled?: unknown })
        .enabled
    );
  }

  return true;
}

async function databaseEnabled(
  schoolId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<
      { setting_value: unknown }[]
    >(
      `
      SELECT setting_value
      FROM governance_settings
      WHERE setting_key = 'whatsapp.enabled'
        AND (school_id IS NULL OR ($1::int IS NOT NULL AND school_id = $1::int))
      ORDER BY school_id NULLS FIRST
      `,
      schoolId ?? null
    );

  if (!rows.length) {
    return true;
  }

  return settingEnabled(
    rows[rows.length - 1]
      ?.setting_value
  );
}

export async function getWhatsAppProviderStatus(
  schoolId?: number | null
) {
  const base =
    whatsappProviderStatus();
  const databaseSetting =
    await databaseEnabled(schoolId);

  return {
    ...base,
    envEnabled: base.enabled,
    databaseEnabled:
      databaseSetting,
    enabled:
      base.enabled &&
      databaseSetting,
    configured:
      base.configured &&
      databaseSetting,
  };
}

function endpoint() {
  const rawUrl = baseUrl().trim();
  const url = rawUrl.replace(/\/+$/, "");

  if (!url) {
    return "";
  }

  if (providerName() === "interakt") {
    if (/\/v1\/public\/message$/i.test(url)) {
      return `${url}/`;
    }

    if (/\/v1\/public$/i.test(url)) {
      return `${url}/message/`;
    }
  }

  if (
    /send|message/i.test(url)
  ) {
    return rawUrl;
  }

  return `${url}/messages`;
}

function asStringArray(
  value: unknown
) {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item === null ||
      item === undefined
        ? ""
        : String(item)
    );
  }

  if (typeof value === "string") {
    try {
      const parsed =
        JSON.parse(value);
      return asStringArray(parsed);
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
}

function splitPhoneForInterakt(
  value: unknown
) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .trim();
  const country =
    defaultCountryCode();
  const countryDigits =
    country.replace(/\D/g, "");

  if (
    countryDigits &&
    digits.startsWith(
      countryDigits
    ) &&
    digits.length >
      countryDigits.length
  ) {
    return {
      countryCode: country,
      phoneNumber: digits.slice(
        countryDigits.length
      ),
    };
  }

  return {
    countryCode: country,
    phoneNumber: digits,
  };
}

function buildInteraktPayload(
  message: Row,
  variables: string[]
) {
  const phone =
    splitPhoneForInterakt(
      message.recipient
    );

  return {
    countryCode: phone.countryCode,
    phoneNumber: phone.phoneNumber,
    callbackData: JSON.stringify({
      message_id: message.id,
      school_id:
        message.school_id,
      academic_year_id:
        message.academic_year_id,
    }),
    type: "Template",
    template: {
      name: String(
        message.template_name || ""
      ),
      languageCode:
        templateLanguage(),
      bodyValues: variables,
    },
  };
}

function buildGenericPayload(
  message: Row,
  variables: string[]
) {
  return {
    to: message.recipient,
    type: "template",
    template: {
      name: message.template_name,
      language: {
        code:
          templateLanguage(),
      },
      variables,
    },
    metadata: {
      message_id: message.id,
      school_id:
        message.school_id,
      academic_year_id:
        message.academic_year_id,
    },
  };
}

function providerMessageId(
  parsed: unknown
) {
  const responseObject =
    parsed as Record<string, unknown>;
  const nested =
    responseObject.data as
      | Record<string, unknown>
      | undefined;

  return (
    String(
      responseObject.id ||
        responseObject.message_id ||
        responseObject.messageId ||
        nested?.id ||
        nested?.message_id ||
        nested?.messageId ||
        ""
    ) || null
  );
}

function normalizePhone(
  value?: string | null
) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .trim();

  if (!digits) {
    return "";
  }

  if (digits.length === 10) {
    return `91${digits}`;
  }

  return digits;
}

function maskPhone(value: string) {
  if (value.length <= 4) {
    return "****";
  }

  return `${"*".repeat(
    Math.max(0, value.length - 4)
  )}${value.slice(-4)}`;
}

const safeJson = (value: unknown) =>
  JSON.parse(JSON.stringify(value));

function renderPreview(
  templateName: string,
  variables: string[]
) {
  let text =
    templatePreview[templateName] ||
    templateName;

  variables.forEach(
    (variable, index) => {
      text = text.replaceAll(
        `{{${index + 1}}}`,
        variable || "-"
      );
    }
  );

  return text;
}

function currentMonthRange() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  );

  return {
    start,
    end,
  };
}

async function templateIsEnabled(
  templateName: string
) {
  const rows =
    await prisma.$queryRawUnsafe<
      { is_enabled: boolean | null }[]
    >(
      `
      SELECT is_enabled
      FROM whatsapp_templates
      WHERE template_name = $1
      LIMIT 1
      `,
      templateName
    );

  return rows[0]?.is_enabled !== false;
}

async function insertMessage(
  input: QueueInput,
  status = "QUEUED",
  deliveryStatus = "PENDING",
  lastError: string | null = null
) {
  const recipient =
    normalizePhone(input.recipient);
  const variables = input.variables.map(
    (variable) =>
      variable === null ||
      variable === undefined
        ? ""
        : String(variable)
  );
  const preview =
    input.messagePreview ||
    renderPreview(
      input.templateName,
      variables
    );

  const rows =
    await prisma.$queryRawUnsafe<
      { id: number }[]
    >(
      `
      INSERT INTO whatsapp_messages (
        school_id,
        academic_year_id,
        student_id,
        user_id,
        template_name,
        recipient,
        recipient_masked,
        variables,
        payload,
        message_preview,
        status,
        delivery_status,
        last_error,
        triggered_by,
        entity_type,
        entity_id,
        created_by,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10,$11,$12,$13,$14,$15,$16,$17,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING id
      `,
      input.schoolId ?? null,
      input.academicYearId ?? null,
      input.studentId ?? null,
      input.userId ?? null,
      input.templateName,
      recipient || null,
      recipient ? maskPhone(recipient) : null,
      JSON.stringify(variables),
      JSON.stringify({
        template:
          input.templateName,
        variables,
      }),
      preview,
      status,
      deliveryStatus,
      lastError,
      input.triggeredBy ?? null,
      input.entityType ?? null,
      input.entityId ?? null,
      input.userId ?? null
    );

  return rows[0]?.id;
}

async function updateMessage(
  id: number,
  data: {
    status: string;
    deliveryStatus: string;
    providerResponse?: unknown;
    providerMessageId?: string | null;
    lastError?: string | null;
    sent?: boolean;
    retry?: boolean;
  }
) {
  await prisma.$executeRawUnsafe(
    `
    UPDATE whatsapp_messages
    SET status = $2,
        delivery_status = $3,
        provider_response = $4::jsonb,
        provider_message_id = COALESCE($5, provider_message_id),
        last_error = $6,
        retry_count = CASE WHEN $7::boolean THEN retry_count + 1 ELSE retry_count END,
        next_attempt_at = CASE WHEN $7::boolean THEN CURRENT_TIMESTAMP + INTERVAL '5 minutes' ELSE next_attempt_at END,
        sent_at = CASE WHEN $8::boolean THEN CURRENT_TIMESTAMP ELSE sent_at END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    id,
    data.status,
    data.deliveryStatus,
    JSON.stringify(
      safeJson(
        data.providerResponse ?? {}
      )
    ),
    data.providerMessageId ?? null,
    data.lastError ?? null,
    Boolean(data.retry),
    Boolean(data.sent)
  );
}

async function recordAttempt(
  messageId: number,
  attemptNumber: number,
  status: string,
  errorMessage: string | null,
  response: unknown
) {
  await prisma.$executeRawUnsafe(
    `
    INSERT INTO whatsapp_retry_attempts (
      message_id,
      attempt_number,
      status,
      error_message,
      provider_response,
      attempted_at
    )
    VALUES ($1,$2,$3,$4,$5::jsonb,CURRENT_TIMESTAMP)
    `,
    messageId,
    attemptNumber,
    status,
    errorMessage,
    JSON.stringify(
      safeJson(response ?? {})
    )
  );
}

async function meterSend(
  schoolId: number | null
) {
  const { start, end } =
    currentMonthRange();

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO whatsapp_metering (
      school_id,
      period_start,
      period_end,
      messages_sent,
      estimated_cost,
      metadata,
      created_at
    )
    VALUES ($1,$2,$3,1,0,$4::jsonb,CURRENT_TIMESTAMP)
    ON CONFLICT (school_id, period_start, period_end)
    DO UPDATE SET
      messages_sent = COALESCE(whatsapp_metering.messages_sent, 0) + 1,
      metadata = COALESCE(whatsapp_metering.metadata, '{}'::jsonb) || EXCLUDED.metadata
    `,
    schoolId,
    start,
    end,
    JSON.stringify({
      source:
        "tottech_one_whatsapp",
    })
  );
}

async function callProvider(
  message: Row
) {
  const status =
    await getWhatsAppProviderStatus(
      Number(message.school_id) ||
        null
    );

  if (!status.enabled) {
    return {
      ok: false,
      final: true,
      deliveryStatus: "DISABLED",
      error:
        "WhatsApp integration is disabled.",
      response: {
        provider:
          "whatsapp",
        enabled: false,
      },
    };
  }

  if (!status.configured) {
    return {
      ok: false,
      final: true,
      deliveryStatus:
        "CONFIG_REQUIRED",
      error:
        "WhatsApp provider base URL is not configured.",
      response: {
        provider:
          "whatsapp",
        hasApiKey:
          status.hasApiKey,
        hasBaseUrl:
          status.hasBaseUrl,
      },
    };
  }

  const provider =
    providerName();
  const variables =
    asStringArray(
      message.variables
    );
  const payload =
    provider === "interakt"
      ? buildInteraktPayload(
          message,
          variables
        )
      : buildGenericPayload(
          message,
          variables
        );

  const response = await fetch(endpoint(), {
    method: "POST",
    headers: {
      Authorization:
        provider === "interakt"
          ? `Basic ${apiKey()}`
          : `Bearer ${apiKey()}`,
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text =
    await response.text();
  let parsed: unknown = {
    body: text,
  };

  try {
    parsed = text
      ? JSON.parse(text)
      : {};
  } catch {
    parsed = {
      body: text,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      final:
        response.status >= 400 &&
        response.status < 500,
      deliveryStatus: "FAILED",
      error: `Provider returned HTTP ${response.status}`,
      response: parsed,
    };
  }

  return {
    ok: true,
    final: true,
    deliveryStatus: "SENT",
    providerMessageId:
      providerMessageId(parsed),
    response: parsed,
  };
}

export async function processWhatsAppQueue(
  limit = 10
) {
  const messages =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM whatsapp_messages
      WHERE (
          status IN ('QUEUED', 'RETRY')
          OR (
            status = 'FAILED'
            AND delivery_status IN ('CONFIG_REQUIRED', 'DISABLED')
          )
          OR (
            status = 'FAILED'
            AND delivery_status = 'FAILED'
            AND last_error ILIKE 'Provider returned HTTP 404%'
          )
        )
        AND COALESCE(next_attempt_at, CURRENT_TIMESTAMP) <= CURRENT_TIMESTAMP
        AND COALESCE(retry_count, 0) < COALESCE(max_retries, 3)
      ORDER BY created_at ASC
      LIMIT $1
      `,
      limit
    );

  const results = [];

  for (const message of messages) {
    const attemptNumber =
      Number(message.retry_count || 0) + 1;

    try {
      const result =
        await callProvider(message);

      if (result.ok) {
        await updateMessage(
          Number(message.id),
          {
            status: "SENT",
            deliveryStatus: "SENT",
            providerResponse:
              result.response,
            providerMessageId:
              result.providerMessageId,
            sent: true,
          }
        );
        await recordAttempt(
          Number(message.id),
          attemptNumber,
          "SENT",
          null,
          result.response
        );
        await meterSend(
          Number(message.school_id) ||
            null
        );
        await recordEvent({
          school_id:
            Number(message.school_id) ||
            null,
          academic_year_id:
            Number(
              message.academic_year_id
            ) || null,
          user_id:
            Number(message.user_id) ||
            null,
          module_name:
            "whatsapp",
          event_type:
            "WHATSAPP_MESSAGE_SENT",
          action: "send",
          entity_type:
            String(
              message.entity_type ||
                "whatsapp_message"
            ),
          entity_id:
            Number(
              message.entity_id ||
                message.id
            ) || null,
          summary:
            "WhatsApp message sent",
          payload: {
            message_id:
              message.id,
            template:
              message.template_name,
            recipient:
              message.recipient_masked,
            delivery_status:
              "SENT",
          },
        });
        results.push({
          id: message.id,
          status: "SENT",
        });
      } else {
        const configurationPending =
          result.deliveryStatus ===
            "CONFIG_REQUIRED" ||
          result.deliveryStatus ===
            "DISABLED";
        const retry =
          !result.final &&
          attemptNumber <
            Number(
              message.max_retries || 3
            );
        const status =
          configurationPending
            ? "QUEUED"
            : retry
              ? "RETRY"
              : "FAILED";
        const errorMessage =
          result.error ||
          "WhatsApp provider failed.";

        await updateMessage(
          Number(message.id),
          {
            status,
            deliveryStatus:
              result.deliveryStatus,
            providerResponse:
              result.response,
            lastError:
              errorMessage,
            retry,
          }
        );
        await recordAttempt(
          Number(message.id),
          attemptNumber,
          status,
          errorMessage,
          result.response
        );
        await recordEvent({
          school_id:
            Number(message.school_id) ||
            null,
          academic_year_id:
            Number(
              message.academic_year_id
            ) || null,
          user_id:
            Number(message.user_id) ||
            null,
          module_name:
            "whatsapp",
          event_type:
            "WHATSAPP_MESSAGE_FAILED",
          action: "send",
          entity_type:
            String(
              message.entity_type ||
                "whatsapp_message"
            ),
          entity_id:
            Number(
              message.entity_id ||
                message.id
            ) || null,
          severity: "WARN",
          summary:
            "WhatsApp message failed",
          payload: {
            message_id:
              message.id,
            template:
              message.template_name,
            recipient:
              message.recipient_masked,
            delivery_status:
              result.deliveryStatus,
            error: errorMessage,
          },
        });
        results.push({
          id: message.id,
          status,
        });
      }
    } catch (error) {
      const messageText =
        error instanceof Error
          ? error.message
          : "Unknown WhatsApp provider error";
      await updateMessage(
        Number(message.id),
        {
          status: "RETRY",
          deliveryStatus: "FAILED",
          lastError: messageText,
          providerResponse: {},
          retry: true,
        }
      );
      await recordAttempt(
        Number(message.id),
        attemptNumber,
        "RETRY",
        messageText,
        {}
      );
      results.push({
        id: message.id,
        status: "RETRY",
      });
    }
  }

  return results;
}

export async function queueWhatsAppMessage(
  input: QueueInput
) {
  const recipient =
    normalizePhone(input.recipient);

  if (
    !(await templateIsEnabled(
      input.templateName
    ))
  ) {
    const messageId =
      await insertMessage(
        input,
        "SKIPPED",
        "TEMPLATE_DISABLED",
        "WhatsApp template is disabled."
      );

    return {
      id: messageId,
      status: "SKIPPED",
    };
  }

  if (!recipient) {
    const messageId =
      await insertMessage(
        input,
        "FAILED",
        "NO_RECIPIENT",
        "No WhatsApp recipient phone number found."
      );

    await recordEvent({
      school_id:
        input.schoolId ?? null,
      academic_year_id:
        input.academicYearId ?? null,
      user_id: input.userId ?? null,
      module_name: "whatsapp",
      event_type:
        "WHATSAPP_MESSAGE_FAILED",
      action: "queue",
      entity_type:
        input.entityType ||
        "whatsapp_message",
      entity_id:
        input.entityId ||
        messageId ||
        null,
      severity: "WARN",
      summary:
        "WhatsApp message failed",
      payload: {
        message_id: messageId,
        template:
          input.templateName,
        delivery_status:
          "NO_RECIPIENT",
      },
    });

    return {
      id: messageId,
      status: "FAILED",
    };
  }

  const messageId =
    await insertMessage({
      ...input,
      recipient,
    });

  await processWhatsAppQueue(25);

  return {
    id: messageId,
    status: "QUEUED",
  };
}

function fullName(row: Row) {
  return (
    String(row.name || "").trim() ||
    [
      row.first_name,
      row.middle_name,
      row.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Student"
  );
}

const money = (value: unknown) =>
  `Rs. ${Number(value || 0).toFixed(2)}`;

const dateText = (value: unknown) =>
  value
    ? new Date(
        value as string | Date
      ).toLocaleDateString("en-IN")
    : "-";

const timeText = (value: unknown) =>
  value ? String(value) : "-";

export async function notifyStudentCreated(
  studentId: number,
  userId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT s.*, sc.school_name
      FROM students s
      LEFT JOIN schools sc ON sc.id = s.school_id
      WHERE s.id = $1
      LIMIT 1
      `,
      studentId
    );
  const student = rows[0];

  if (!student) {
    return null;
  }

  return queueWhatsAppMessage({
    templateName:
      "student_created",
    schoolId:
      Number(student.school_id) ||
      null,
    academicYearId:
      Number(
        student.academic_year_id
      ) || null,
    studentId,
    userId: userId ?? null,
    recipient:
      String(
        pickPreferredPhone([
          student.father_phone,
          student.father_alternative_mobile,
          student.mother_phone,
          student.mother_alternative_mobile,
          student.guardian_alternative_mobile,
          student.emergency_contact_number,
          student.phone,
        ])
      ),
    variables: [
      fullName(student),
      String(
        student.admission_number ||
          "-"
      ),
      String(
        student.school_name ||
          "-"
      ),
    ],
    triggeredBy:
      "STUDENT_CREATED",
    entityType: "student",
    entityId: studentId,
  });
}

export async function notifyStudentAbsent(
  attendanceId: number,
  userId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        a.*,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone,
        sc.school_name,
        sc.phone AS school_phone
      FROM attendance_master a
      LEFT JOIN students s ON s.id = a.student_id
      LEFT JOIN schools sc ON sc.id = a.school_id
      WHERE a.id = $1
        AND UPPER(COALESCE(a.status,'')) = 'ABSENT'
      LIMIT 1
      `,
      attendanceId
    );
  const row = rows[0];

  if (!row) {
    return null;
  }

  return queueWhatsAppMessage({
    templateName: "student_absent_alert",
    schoolId: Number(row.school_id) || null,
    academicYearId:
      Number(row.academic_year_id) || null,
    studentId: Number(row.student_id) || null,
    userId: userId ?? null,
    recipient: String(
      pickPreferredPhone([
        row.father_phone,
        row.father_alternative_mobile,
        row.mother_phone,
        row.mother_alternative_mobile,
        row.guardian_alternative_mobile,
        row.emergency_contact_number,
        row.phone,
      ])
    ),
    variables: [
      fullName(row),
      dateText(row.attendance_date),
      String(row.school_name || "school"),
      String(row.school_phone || "the school/college office"),
    ],
    triggeredBy: "STUDENT_ABSENT",
    entityType: "attendance",
    entityId: attendanceId,
  });
}

export async function notifyInvoiceCreated(
  invoiceId: number,
  userId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        i.*,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      WHERE i.id = $1
      LIMIT 1
      `,
      invoiceId
    );
  const invoice = rows[0];

  if (!invoice) {
    return null;
  }

  return queueWhatsAppMessage({
    templateName:
      "invoice_created",
    schoolId:
      Number(invoice.school_id) ||
      null,
    academicYearId:
      Number(
        invoice.academic_year_id
      ) || null,
    studentId:
      Number(invoice.student_id) ||
      null,
    userId: userId ?? null,
    recipient:
      String(
        pickPreferredPhone([
          invoice.father_phone,
          invoice.father_alternative_mobile,
          invoice.mother_phone,
          invoice.mother_alternative_mobile,
          invoice.guardian_alternative_mobile,
          invoice.emergency_contact_number,
          invoice.phone,
        ])
      ),
    variables: [
      fullName(invoice),
      String(
        invoice.invoice_number ||
          "-"
      ),
      money(invoice.total_amount),
      `${dateText(invoice.due_date)} | Invoice PDF: ${buildPublicInvoicePdfUrl(invoiceId)}`,
    ],
    triggeredBy:
      "INVOICE_GENERATED",
    entityType: "student",
    entityId:
      Number(invoice.student_id) ||
      invoiceId,
  });
}

export async function notifyPaymentReceived(
  paymentId: number,
  userId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        p.*,
        i.invoice_number,
        i.balance_amount,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM payments p
      LEFT JOIN invoices i ON i.id = p.invoice_id
      LEFT JOIN students s ON s.id = p.student_id
      WHERE p.id = $1
      LIMIT 1
      `,
      paymentId
    );
  const payment = rows[0];

  if (!payment) {
    return null;
  }

  return queueWhatsAppMessage({
    templateName:
      "payment_received",
    schoolId:
      Number(payment.school_id) ||
      null,
    academicYearId:
      Number(
        payment.academic_year_id
      ) || null,
    studentId:
      Number(payment.student_id) ||
      null,
    userId: userId ?? null,
    recipient:
      String(
        pickPreferredPhone([
          payment.father_phone,
          payment.father_alternative_mobile,
          payment.mother_phone,
          payment.mother_alternative_mobile,
          payment.guardian_alternative_mobile,
          payment.emergency_contact_number,
          payment.phone,
        ])
      ),
    variables: [
      fullName(payment),
      String(
        payment.invoice_number ||
          "-"
      ),
      String(
        payment.reference_number ||
          payment.receipt_number ||
          "-"
      ),
      money(payment.amount),
      money(payment.balance_amount),
      buildPublicPaymentReceiptUrl(
        paymentId
      ),
    ],
    triggeredBy:
      "PAYMENT_RECORDED",
    entityType: "student",
    entityId:
      Number(payment.student_id) ||
      paymentId,
  });
}

export async function notifyHomeworkAssigned(
  homeworkId: number,
  userId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        ha.*,
        sub.subject_name,
        c.class_name,
        sec.section_name,
        s.id AS student_id,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM homework_assignments ha
      LEFT JOIN subjects sub ON sub.id = ha.subject_id
      LEFT JOIN classes c ON c.id = ha.class_id
      LEFT JOIN sections sec ON sec.id = ha.section_id
      JOIN students s
        ON s.school_id = ha.school_id
       AND COALESCE(s.current_class_id, s.section_id) IS NOT NULL
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
       AND sye.academic_year_id = ha.academic_year_id
      WHERE ha.id = $1
        AND COALESCE(s.current_class_id, sye.class_id) = ha.class_id
        AND COALESCE(s.current_section_id, s.section_id, sye.section_id) = ha.section_id
      LIMIT 300
      `,
      homeworkId
    );

  const results = [];

  for (const row of rows) {
    results.push(
      await queueWhatsAppMessage({
        templateName:
          "homework_assigned",
        schoolId:
          Number(row.school_id) ||
          null,
        academicYearId:
          Number(
            row.academic_year_id
          ) || null,
        studentId:
          Number(row.student_id) ||
          null,
        userId: userId ?? null,
        recipient:
      String(
            pickPreferredPhone([
              row.father_phone,
              row.father_alternative_mobile,
              row.mother_phone,
              row.mother_alternative_mobile,
              row.guardian_alternative_mobile,
              row.emergency_contact_number,
              row.phone,
            ])
          ),
        variables: [
          fullName(row),
          String(row.title || "-"),
          String(
            row.subject_name ||
              "-"
          ),
          `${row.class_name || "-"} / ${row.section_name || "-"}`,
          dateText(row.due_date),
          String(
            row.description || "-"
          ),
        ],
        triggeredBy:
          "HOMEWORK_ASSIGNED",
        entityType: "student",
        entityId:
          Number(row.student_id) ||
          homeworkId,
      })
    );
  }

  return results;
}

export async function notifyExamScheduleCreated(
  scheduleId: number,
  userId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        es.*,
        COALESCE(e.exam_name, et.exam_name, 'Exam') AS exam_name,
        sub.subject_name,
        c.class_name,
        sec.section_name,
        s.id AS student_id,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM exam_schedule es
      LEFT JOIN exams e ON e.id = es.exam_id
      LEFT JOIN exam_types et ON et.id = es.exam_type_id
      LEFT JOIN subjects sub ON sub.id = es.subject_id
      LEFT JOIN classes c ON c.id = es.class_id
      LEFT JOIN sections sec ON sec.id = es.section_id
      JOIN students s ON s.school_id = es.school_id
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
       AND sye.academic_year_id = es.academic_year_id
      WHERE es.id = $1
        AND COALESCE(s.current_class_id, sye.class_id) = es.class_id
        AND COALESCE(s.current_section_id, s.section_id, sye.section_id) = es.section_id
      LIMIT 300
      `,
      scheduleId
    );

  const results = [];

  for (const row of rows) {
    results.push(
      await queueWhatsAppMessage({
        templateName:
          "exam_schedule_created",
        schoolId:
          Number(row.school_id) ||
          null,
        academicYearId:
          Number(
            row.academic_year_id
          ) || null,
        studentId:
          Number(row.student_id) ||
          null,
        userId: userId ?? null,
        recipient:
          String(
            row.father_phone ||
              row.mother_phone ||
              row.phone ||
              ""
          ),
        variables: [
          fullName(row),
          String(row.exam_name || "-"),
          String(
            row.subject_name ||
              "-"
          ),
          dateText(row.exam_date),
          `${timeText(row.start_time)}-${timeText(row.end_time)}`,
          String(row.room_no || "-"),
        ],
        triggeredBy:
          "EXAM_SCHEDULE_CREATED",
        entityType: "student",
        entityId:
          Number(row.student_id) ||
          scheduleId,
      })
    );
  }

  return results;
}

export async function queuePaymentDueReminder(
  invoiceId: number,
  reminderMessage: string,
  userId?: number | null
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        i.*,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      WHERE i.id = $1
      LIMIT 1
      `,
      invoiceId
    );
  const invoice = rows[0];

  if (!invoice) {
    return null;
  }

  return queueWhatsAppMessage({
    templateName:
      "payment_due_reminder",
    schoolId:
      Number(invoice.school_id) ||
      null,
    academicYearId:
      Number(
        invoice.academic_year_id
      ) || null,
    studentId:
      Number(invoice.student_id) ||
      null,
    userId: userId ?? null,
    recipient:
      String(
        pickPreferredPhone([
          invoice.father_phone,
          invoice.father_alternative_mobile,
          invoice.mother_phone,
          invoice.mother_alternative_mobile,
          invoice.guardian_alternative_mobile,
          invoice.emergency_contact_number,
          invoice.phone,
        ])
      ),
    variables: [
      fullName(invoice),
      String(
        invoice.invoice_number ||
          "-"
      ),
      money(invoice.balance_amount),
      dateText(invoice.due_date),
      reminderMessage,
      buildPublicInvoicePdfUrl(
        invoiceId
      ),
    ],
    triggeredBy:
      "PAYMENT_DUE_REMINDER",
    entityType: "student",
    entityId:
      Number(invoice.student_id) ||
      invoiceId,
  });
}

export async function queueMonthlyAttendanceReport(
  input: {
    studentId: number;
    month: string;
    present: number;
    absent: number;
    late: number;
    leave: number;
    userId?: number | null;
  }
) {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM students
      WHERE id = $1
      LIMIT 1
      `,
      input.studentId
    );
  const student = rows[0];

  if (!student) {
    return null;
  }

  const total =
    input.present +
    input.absent +
    input.late +
    input.leave;
  const attendance =
    total > 0
      ? Math.round(
          (input.present / total) * 100
        )
      : 0;

  return queueWhatsAppMessage({
    templateName:
      "monthly_attendance_report",
    schoolId:
      Number(student.school_id) ||
      null,
    academicYearId:
      Number(
        student.academic_year_id
      ) || null,
    studentId: input.studentId,
    userId: input.userId ?? null,
    recipient:
      String(
        pickPreferredPhone([
          student.father_phone,
          student.father_alternative_mobile,
          student.mother_phone,
          student.mother_alternative_mobile,
          student.guardian_alternative_mobile,
          student.emergency_contact_number,
          student.phone,
        ])
      ),
    variables: [
      fullName(student),
      input.month,
      String(attendance),
      String(input.present),
      String(input.absent),
      String(input.late),
      String(input.leave),
    ],
    triggeredBy:
      "MONTHLY_ATTENDANCE_REPORT",
    entityType: "student",
    entityId: input.studentId,
  });
}

export async function setWhatsAppEnabled(
  isEnabled: boolean,
  userId?: number | null,
  schoolId?: number | null
) {
  const payload = JSON.stringify({
    enabled: isEnabled,
  });

  if (!schoolId) {
    const rows =
      await prisma.$queryRawUnsafe<
        { id: number }[]
      >(
        `
        SELECT id
        FROM governance_settings
        WHERE school_id IS NULL
          AND setting_key = 'whatsapp.enabled'
        ORDER BY id DESC
        LIMIT 1
        `
      );
    const existingId =
      rows[0]?.id || null;

    if (existingId) {
      await prisma.$executeRawUnsafe(
        `
        UPDATE governance_settings
        SET setting_value = $2::jsonb,
            updated_by = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        existingId,
        payload,
        userId ?? null
      );
      await prisma.$executeRawUnsafe(
        `
        DELETE FROM governance_settings
        WHERE school_id IS NULL
          AND setting_key = 'whatsapp.enabled'
          AND id <> $1
        `,
        existingId
      );
      return;
    }
  }

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO governance_settings (
      school_id,
      setting_key,
      setting_value,
      description,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1,'whatsapp.enabled',$2::jsonb,'WhatsApp notification enablement', $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (school_id, setting_key)
    DO UPDATE SET
      setting_value = EXCLUDED.setting_value,
      updated_by = EXCLUDED.updated_by,
      updated_at = CURRENT_TIMESTAMP
    `,
    schoolId ?? null,
    payload,
    userId ?? null
  );
}

export async function setWhatsAppTemplateEnabled(
  templateName: string,
  isEnabled: boolean
) {
  await prisma.$executeRawUnsafe(
    `
    UPDATE whatsapp_templates
    SET is_enabled = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE template_name = $1
    `,
    templateName,
    isEnabled
  );
}

export async function getWhatsAppDashboard(
  schoolId?: number | null,
  academicYearId?: number | null
) {
  const [
    provider,
    templates,
    stats,
    failedMessages,
    retryQueue,
  ] = await Promise.all([
    getWhatsAppProviderStatus(
      schoolId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        template_name,
        trigger_event,
        description,
        variables,
        is_enabled,
        updated_at
      FROM whatsapp_templates
      ORDER BY template_name ASC
      `
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COUNT(*)::int AS total_messages,
        COUNT(*) FILTER (WHERE status = 'SENT')::int AS sent_messages,
        COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed_messages,
        COUNT(*) FILTER (WHERE status IN ('QUEUED','RETRY'))::int AS queued_messages,
        COUNT(*) FILTER (WHERE delivery_status = 'CONFIG_REQUIRED')::int AS config_required_messages,
        COUNT(*) FILTER (WHERE delivery_status = 'NO_RECIPIENT')::int AS no_recipient_messages
      FROM whatsapp_messages
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      `,
      schoolId ?? null,
      academicYearId ?? null
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        id,
        template_name,
        recipient_masked,
        status,
        delivery_status,
        last_error,
        retry_count,
        created_at,
        updated_at
      FROM whatsapp_messages
      WHERE status = 'FAILED'
        AND ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      ORDER BY updated_at DESC
      LIMIT 50
      `,
      schoolId ?? null,
      academicYearId ?? null
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        id,
        template_name,
        recipient_masked,
        status,
        delivery_status,
        retry_count,
        next_attempt_at,
        created_at
      FROM whatsapp_messages
      WHERE status IN ('QUEUED','RETRY')
        AND ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      ORDER BY next_attempt_at ASC NULLS FIRST
      LIMIT 50
      `,
      schoolId ?? null,
      academicYearId ?? null
    ),
  ]);

  return {
    provider,
    templates,
    stats: stats[0] || {},
    failedMessages,
    retryQueue,
  };
}

export async function registerWhatsAppDeliveryEvent(
  input: {
    providerMessageId?: string | null;
    messageId?: number | null;
    deliveryStatus: string;
    providerResponse?: unknown;
    metadata?: unknown;
  }
) {
  const rows =
    input.messageId
      ? await prisma.$queryRawUnsafe<Row[]>(
          `
          SELECT *
          FROM whatsapp_messages
          WHERE id = $1
          LIMIT 1
          `,
          input.messageId
        )
      : await prisma.$queryRawUnsafe<Row[]>(
          `
          SELECT *
          FROM whatsapp_messages
          WHERE provider_message_id = $1
          LIMIT 1
          `,
          input.providerMessageId ||
            ""
        );
  const message = rows[0];

  if (!message) {
    return null;
  }

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO whatsapp_delivery_events (
      message_id,
      delivery_status,
      provider_response,
      metadata,
      received_at
    )
    VALUES ($1,$2,$3::jsonb,$4::jsonb,CURRENT_TIMESTAMP)
    `,
    Number(message.id),
    input.deliveryStatus,
    JSON.stringify(
      safeJson(
        input.providerResponse ||
          {}
      )
    ),
    JSON.stringify(
      safeJson(
        input.metadata || {}
      )
    )
  );

  await prisma.$executeRawUnsafe(
    `
    UPDATE whatsapp_messages
    SET delivery_status = $2,
        delivered_at = CASE WHEN $2 IN ('DELIVERED','READ') THEN CURRENT_TIMESTAMP ELSE delivered_at END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    Number(message.id),
    input.deliveryStatus
  );

  await recordEvent({
    school_id:
      Number(message.school_id) ||
      null,
    academic_year_id:
      Number(
        message.academic_year_id
      ) || null,
    user_id:
      Number(message.user_id) ||
      null,
    module_name: "whatsapp",
    event_type:
      "WHATSAPP_DELIVERY_UPDATED",
    action: "delivery",
    entity_type:
      String(
        message.entity_type ||
          "whatsapp_message"
      ),
    entity_id:
      Number(
        message.entity_id ||
          message.id
      ) || null,
    summary:
      "WhatsApp delivery status updated",
    payload: {
      message_id: message.id,
      template:
        message.template_name,
      recipient:
        message.recipient_masked,
      delivery_status:
        input.deliveryStatus,
    },
  });

  return {
    id: message.id,
    delivery_status:
      input.deliveryStatus,
  };
}

const ptmDefaultTemplates = {
  ptm_scheduled: {
    templateName: "PTM Scheduled",
    subject: "Parent teacher meeting scheduled",
    body: `Dear Parent,

A Parent Teacher Meeting has been scheduled.

Student: {{1}}
Class: {{2}}
Teacher: {{3}}

Date: {{4}}
Time: {{5}}

Venue: {{6}}

Please attend the meeting.

{{7}} School/College`,
    variables: ["student_name", "class_name", "teacher_name", "date", "time", "venue", "school_name"],
  },
  ptm_reminder: {
    templateName: "PTM Reminder",
    subject: "Parent teacher meeting reminder",
    body: `Reminder:

Parent Teacher Meeting for {{1}}

Date: {{2}}
Time: {{3}}

Venue: {{4}}

Please attend.

{{5}} School/College`,
    variables: ["student_name", "date", "time", "venue", "school_name"],
  },
  ptm_feedback: {
    templateName: "PTM Feedback",
    subject: "Thank you for attending PTM",
    body: `Thank you for attending PTM.

Student: {{1}}

Teacher Remarks:
{{2}}

Action Items:
{{3}}

{{4}} School/College`,
    variables: ["student_name", "teacher_remarks", "action_items", "school_name"],
  },
} as const;

export async function ensurePtmWhatsAppTemplates(
  schoolId: number | null,
  createdBy?: number | null
) {
  if (!schoolId) {
    return [];
  }

  const schoolRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT school_name
    FROM schools
    WHERE id = $1::int
    LIMIT 1
    `,
    schoolId
  );
  const school = schoolRows[0] || {};
  const schoolName = String(school.school_name || "School/College").trim() || "School/College";

  const results = [];

  for (const [templateKey, template] of Object.entries(ptmDefaultTemplates)) {
    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO whatsapp_templates (
        school_id,
        template_key,
        template_name,
        subject,
        body,
        variables,
        channel,
        is_enabled,
        created_by,
        updated_by,
        created_at,
        updated_at,
        metadata
      )
      SELECT
        $1::int,
        $2,
        $3,
        $4,
        REPLACE($5, '{{7}}', $6),
        $7::jsonb,
        'WHATSAPP',
        true,
        $8::int,
        $8::int,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        $9::jsonb
      WHERE NOT EXISTS (
        SELECT 1
        FROM whatsapp_templates
        WHERE school_id = $1::int
          AND template_key = $2
          AND channel = 'WHATSAPP'
          AND COALESCE(is_deleted,false)=false
      )
      RETURNING id, template_key
      `,
      schoolId,
      templateKey,
      template.templateName,
      template.subject,
      template.body,
      schoolName,
      JSON.stringify(template.variables),
      createdBy ?? null,
      JSON.stringify({ source: "ptm_defaults" })
    );
    results.push(rows[0] || null);
  }

  return results;
}
