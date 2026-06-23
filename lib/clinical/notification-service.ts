import { ClinicalContext, recordClinicalAudit } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";
import { recordWorkflowEvent } from "@/lib/clinical/workflow";

type Row = Record<string, unknown>;

const text = (value: unknown) => String(value ?? "").trim();

const renderTemplate = (template: string, variables: Record<string, unknown>) =>
  template.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (_, key) =>
    text(variables[key]) || "-"
  );

const templateVariableOrder = (template: string, fallback: string[] = []) => {
  const matches = Array.from(
    template.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)
  ).map((match) => match[1]);
  return Array.from(new Set(matches.length ? matches : fallback));
};

const isGenericDoctorName = (value: unknown) => {
  const name = text(value);
  return !name || /^doctor( #\d+)?$/i.test(name) || /^assigned doctor$/i.test(name);
};

const whatsappEnabled = () =>
  ["true", "1", "yes", "enabled"].includes(
    text(process.env.CLINICAL_WHATSAPP_ENABLED || process.env.WHATSAPP_ENABLED)
      .toLowerCase()
  );

const splitPhoneNumber = (recipient: string) => {
  const defaultCountryCode =
    text(process.env.CLINICAL_WHATSAPP_DEFAULT_COUNTRY_CODE || process.env.WHATSAPP_DEFAULT_COUNTRY_CODE) ||
    "+91";
  const countryDigits = defaultCountryCode.replace(/\D/g, "");
  let phoneNumber = recipient.replace(/\D/g, "");
  if (
    countryDigits &&
    phoneNumber.startsWith(countryDigits) &&
    phoneNumber.length > 10
  ) {
    phoneNumber = phoneNumber.slice(countryDigits.length);
  }
  phoneNumber = phoneNumber.replace(/^0+/, "");
  return {
    countryCode: defaultCountryCode.startsWith("+")
      ? defaultCountryCode
      : `+${defaultCountryCode}`,
    phoneNumber,
  };
};

export const clinicalNotificationDefaults: Record<
  string,
  {
    templateName: string;
    subject: string;
    body: string;
    variables: string[];
  }
> = {
  patient_registration_success: {
    templateName: "Patient Registration Success",
    subject: "Patient registration completed",
    body: "Dear {{patient_name}},\n\nWelcome to {{hospital_name}}.\n\nYour patient registration has been completed successfully.\n\nUHID: {{uhid}}\n\nRegistered On:\n{{registration_date}}\n\nFor assistance please contact:\n{{hospital_phone}}\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "hospital_name", "uhid", "registration_date", "hospital_phone"],
  },
  appointment_booked: {
    templateName: "Appointment Booked",
    subject: "Appointment confirmed",
    body: "Dear {{patient_name}},\n\nYour appointment has been confirmed.\n\nDoctor:\n{{doctor_name}}\n\nDepartment:\n{{department}}\n\nDate:\n{{appointment_date}}\n\nTime:\n{{appointment_time}}\n\nAppointment No:\n{{appointment_number}}\n\nPlease arrive 15 minutes before your scheduled time.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "doctor_name", "department", "appointment_date", "appointment_time", "appointment_number", "hospital_name"],
  },
  appointment_checked_in: {
    templateName: "Appointment Check-In",
    subject: "Appointment checked in",
    body: "Dear {{patient_name}},\n\nYou have successfully checked in.\n\nDoctor:\n{{doctor_name}}\n\nDepartment:\n{{department}}\n\nToken Number:\n{{token_number}}\n\nPlease wait for your consultation.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "doctor_name", "department", "token_number", "hospital_name"],
  },
  vitals_completed: {
    templateName: "Vitals Completed",
    subject: "Vitals recorded",
    body: "Dear {{patient_name}},\n\nYour vitals have been recorded successfully.\n\nYou will be called shortly for consultation with:\n\nDr. {{doctor_name}}\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "doctor_name", "hospital_name"],
  },
  consultation_completed: {
    templateName: "Consultation Completed",
    subject: "Consultation completed",
    body: "Dear {{patient_name}},\n\nYour consultation with\nDr. {{doctor_name}}\nhas been completed.\n\nDiagnosis:\n{{diagnosis_summary}}\n\nPrescription and investigation details are available at the hospital.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "doctor_name", "diagnosis_summary", "hospital_name"],
  },
  lab_test_ordered: {
    templateName: "Lab Test Ordered",
    subject: "Lab test ordered",
    body: "Dear {{patient_name}},\n\nYour doctor has requested the following laboratory investigations:\n\n{{lab_tests}}\n\nPlease proceed to the laboratory department.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "lab_tests", "hospital_name"],
  },
  lab_sample_collected: {
    templateName: "Lab Sample Collected",
    subject: "Lab sample collected",
    body: "Dear {{patient_name}},\n\nYour laboratory sample has been collected successfully.\n\nTests:\n{{lab_tests}}\n\nYou will receive a notification once results are available.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "lab_tests", "hospital_name"],
  },
  lab_report_ready: {
    templateName: "Lab Report Ready",
    subject: "Lab report ready",
    body: "Dear {{patient_name}},\n\nYour laboratory report is now available.\n\nTests:\n{{lab_tests}}\n\nPlease collect the report from the hospital or access it through the patient portal.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "lab_tests", "hospital_name"],
  },
  prescription_generated: {
    templateName: "Prescription Generated",
    subject: "Prescription generated",
    body: "Dear {{patient_name}},\n\nYour prescription has been generated.\n\nDoctor:\n{{doctor_name}}\n\nMedicines:\n{{medicine_count}}\n\nPlease proceed to the pharmacy counter.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "doctor_name", "medicine_count", "hospital_name"],
  },
  medicines_dispensed: {
    templateName: "Medicines Dispensed",
    subject: "Medicines dispensed",
    body: "Dear {{patient_name}},\n\nYour medicines have been dispensed successfully.\n\nPrescription Number:\n{{prescription_number}}\n\nAmount:\n₹{{amount}}\n\nPlease follow the prescribed dosage instructions.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "prescription_number", "amount", "hospital_name"],
  },
  bill_generated: {
    templateName: "Bill Generated",
    subject: "Bill generated",
    body: "Dear {{patient_name}},\n\nInvoice generated successfully.\n\nInvoice Number:\n{{invoice_number}}\n\nAmount:\n₹{{amount}}\n\nDepartment:\n{{department}}\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "invoice_number", "amount", "department", "hospital_name"],
  },
  payment_received: {
    templateName: "Payment Received",
    subject: "Payment received",
    body: "Dear {{patient_name}},\n\nPayment received successfully.\n\nAmount:\n₹{{amount}}\n\nPayment Mode:\n{{payment_mode}}\n\nReceipt Number:\n{{receipt_number}}\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "amount", "payment_mode", "receipt_number", "hospital_name"],
  },
  ip_admission_confirmed: {
    templateName: "IP Admission Confirmed",
    subject: "Admission confirmed",
    body: "Dear {{patient_name}},\n\nYour admission has been confirmed.\n\nWard:\n{{ward}}\n\nRoom:\n{{room}}\n\nBed:\n{{bed}}\n\nAdmission Date:\n{{admission_date}}\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "ward", "room", "bed", "admission_date", "hospital_name"],
  },
  bed_allocated: {
    templateName: "Bed Allocated",
    subject: "Bed allocated",
    body: "Dear {{patient_name}},\n\nYour bed allocation has been completed.\n\nWard:\n{{ward}}\n\nRoom:\n{{room}}\n\nBed:\n{{bed}}\n\nAllocation Time:\n{{allocation_time}}\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "ward", "room", "bed", "allocation_time", "hospital_name"],
  },
  patient_transferred: {
    templateName: "Patient Transferred",
    subject: "Patient transferred",
    body: "Dear {{patient_name}},\n\nYour ward/bed transfer has been recorded.\n\nFrom:\n{{from_location}}\n\nTo:\n{{to_location}}\n\nReason:\n{{reason}}\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "from_location", "to_location", "reason", "hospital_name"],
  },
  discharge_initiated: {
    templateName: "Discharge Initiated",
    subject: "Discharge initiated",
    body: "Dear {{patient_name}},\n\nYour discharge process has been initiated.\n\nPlease complete billing and pharmacy formalities.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "hospital_name"],
  },
  discharge_completed: {
    templateName: "Discharge Completed",
    subject: "Discharge completed",
    body: "Dear {{patient_name}},\n\nYou have been discharged successfully.\n\nDischarge Date:\n{{discharge_date}}\n\nFollow-up Date:\n{{followup_date}}\n\nWe wish you a speedy recovery.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "discharge_date", "followup_date", "hospital_name"],
  },
  followup_reminder: {
    templateName: "Follow-Up Reminder",
    subject: "Follow-up reminder",
    body: "Dear {{patient_name}},\n\nThis is a reminder for your follow-up consultation.\n\nDoctor:\n{{doctor_name}}\n\nDate:\n{{appointment_date}}\n\nTime:\n{{appointment_time}}\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "doctor_name", "appointment_date", "appointment_time", "hospital_name"],
  },
  payment_due_reminder: {
    templateName: "Payment Due Reminder",
    subject: "Payment due reminder",
    body: "Dear {{patient_name}},\n\nAn outstanding amount of ₹{{due_amount}} is pending.\n\nInvoice:\n{{invoice_number}}\n\nPlease contact the billing desk for assistance.\n\nThank you,\n{{hospital_name}}",
    variables: ["patient_name", "due_amount", "invoice_number", "hospital_name"],
  },
};

async function getTemplate(
  context: ClinicalContext,
  templateKey: string,
  channel: string
) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM clinical_notification_templates
    WHERE tenant_id=$1
      AND hospital_id=$2
      AND branch_id=$3
      AND template_key=$4
      AND channel=$5
      AND COALESCE(status,'ACTIVE')='ACTIVE'
      AND COALESCE(is_deleted,false)=false
    ORDER BY id DESC
    LIMIT 1
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    templateKey,
    channel
  );
  return rows[0] || null;
}

async function insertDefaultTemplate(
  context: ClinicalContext,
  templateKey: string,
  channel: string
) {
  const defaultTemplate = clinicalNotificationDefaults[templateKey];
  const defaultBody =
    defaultTemplate?.body ||
    "Dear {{patient_name}}, {{message}} - {{hospital_name}}";
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_notification_templates (
      tenant_id,hospital_id,branch_id,template_key,channel,template_name,subject,body,variables,status,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,'ACTIVE',$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    templateKey,
    channel,
    defaultTemplate?.templateName || templateKey.replace(/_/g, " "),
    defaultTemplate?.subject || "TOTTECH Clinical Services",
    defaultBody,
    JSON.stringify(defaultTemplate?.variables || ["patient_name", "message", "hospital_name"]),
    context.user.id ?? null
  );
  return rows[0];
}

async function dispatchQueuedMessage(
  channel: string,
  recipient: string,
  messageBody: string,
  templateKey?: string,
  variables?: Record<string, unknown>,
  bodyValues?: string[]
) {
  if (channel === "WHATSAPP" && !whatsappEnabled()) {
    return {
      status: "QUEUED",
      provider: "whatsapp",
      reason: "WHATSAPP_ENABLED/CLINICAL_WHATSAPP_ENABLED is not true.",
    };
  }
  if (channel === "WHATSAPP") {
    const apiKey =
      process.env.CLINICAL_WHATSAPP_API_KEY ||
      process.env.INTERAKT_API_KEY ||
      process.env.WHATSAPP_API_KEY;
    const baseUrl =
      process.env.CLINICAL_WHATSAPP_BASE_URL ||
      process.env.INTERAKT_BASE_URL ||
      process.env.WHATSAPP_BASE_URL;

    if (!apiKey || !baseUrl) {
      return {
        status: "QUEUED",
        provider: "whatsapp",
        reason: "WhatsApp provider credentials are not configured.",
      };
    }

    try {
      const phone = splitPhoneNumber(recipient);
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${apiKey}`,
        },
        body: JSON.stringify({
          countryCode: phone.countryCode,
          phoneNumber: phone.phoneNumber,
          type: "Template",
          callbackData: JSON.stringify({
            source: "tottech_clinical_services",
            templateKey,
          }).slice(0, 512),
          template: {
            name: templateKey,
            languageCode:
              process.env.CLINICAL_WHATSAPP_LANGUAGE ||
              process.env.WHATSAPP_TEMPLATE_LANGUAGE ||
              "en",
            bodyValues:
              bodyValues && bodyValues.length
                ? bodyValues
                : Object.values(variables || {}).map((value) => text(value)),
          },
        }),
      });
      const body = await response.text();
      let parsed: Row | null = null;
      try {
        parsed = JSON.parse(body) as Row;
      } catch {
        parsed = null;
      }
      return {
        status: response.ok && parsed?.result !== false ? "SENT" : "QUEUED",
        provider: "whatsapp",
        httpStatus: response.status,
        response: body.slice(0, 1000),
        messageId: parsed?.id || null,
      };
    } catch (error) {
      return {
        status: "QUEUED",
        provider: "whatsapp",
        error: error instanceof Error ? error.message : "WhatsApp dispatch failed.",
      };
    }
  }
  if (channel === "SMS" && process.env.CLINICAL_SMS_ENABLED !== "true") {
    return {
      status: "QUEUED",
      provider: "sms",
      reason: "CLINICAL_SMS_ENABLED is not true.",
    };
  }
  if (channel === "EMAIL" && process.env.CLINICAL_EMAIL_ENABLED !== "true") {
    return {
      status: "QUEUED",
      provider: "email",
      reason: "CLINICAL_EMAIL_ENABLED is not true.",
    };
  }
  return {
    status: "SENT",
    provider: channel.toLowerCase(),
    recipient,
    length: messageBody.length,
    simulated: true,
  };
}

export async function queueClinicalNotification(
  context: ClinicalContext,
  input: {
    channel: "WHATSAPP" | "SMS" | "EMAIL";
    templateKey: string;
    recipient: string;
    variables: Record<string, unknown>;
    patientId?: number | null;
    appointmentId?: number | null;
    invoiceId?: number | null;
    sourceModule?: string | null;
    sourceRecordId?: number | null;
    scheduledAt?: string | Date | null;
  }
) {
  const template =
    (await getTemplate(context, input.templateKey, input.channel)) ||
    (await insertDefaultTemplate(context, input.templateKey, input.channel));
  const messageBody = renderTemplate(text(template.body), {
    ...input.variables,
    hospital_name: context.hospitalName || context.branding.name,
    branch_name: context.branchName,
  });
  const orderedVariables = templateVariableOrder(
    text(template.body),
    clinicalNotificationDefaults[input.templateKey]?.variables || []
  );
  const bodyValues = orderedVariables.map((key) =>
    text({
      ...input.variables,
      hospital_name: context.hospitalName || context.branding.name,
      branch_name: context.branchName,
    }[key])
  );
  const providerResponse = await dispatchQueuedMessage(
    input.channel,
    input.recipient,
    messageBody,
    input.templateKey,
    input.variables,
    bodyValues
  );
  const status = providerResponse.status === "SENT" ? "SENT" : "QUEUED";
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinical_notification_queue (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,appointment_id,invoice_id,
      source_module,source_record_id,channel,template_key,recipient,subject,message_body,payload,
      status,scheduled_at,sent_at,provider_response,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,COALESCE($17::timestamp,CURRENT_TIMESTAMP),
      CASE WHEN $16='SENT' THEN CURRENT_TIMESTAMP ELSE NULL END,$18::jsonb,$19,$19,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    input.patientId ?? null,
    input.appointmentId ?? null,
    input.invoiceId ?? null,
    input.sourceModule ?? null,
    input.sourceRecordId ?? null,
    input.channel,
    input.templateKey,
    input.recipient,
    text(template.subject) || null,
    messageBody,
    JSON.stringify(input.variables),
    status,
    input.scheduledAt ?? null,
    JSON.stringify(providerResponse),
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName: "clinical_notifications",
    action: "queue",
    entityType: "clinical_notification_queue",
    entityId: Number(rows[0]?.id),
    summary: `${input.channel} notification ${status.toLowerCase()} for ${input.templateKey}`,
    payload: {
      channel: input.channel,
      templateKey: input.templateKey,
      status,
      sourceModule: input.sourceModule,
      sourceRecordId: input.sourceRecordId,
    },
  });

  if (input.patientId) {
    await recordWorkflowEvent(context, {
      patientId: input.patientId,
      appointmentId: input.appointmentId ?? null,
      workflowStage: "NOTIFICATION",
      status,
      summary: `${input.channel} ${status.toLowerCase()} for ${input.templateKey}.`,
      sourceTable: "clinical_notification_queue",
      sourceId: Number(rows[0]?.id),
      metadata: {
        channel: input.channel,
        template_key: input.templateKey,
        recipient: input.recipient,
        source_module: input.sourceModule,
        source_record_id: input.sourceRecordId,
        provider_response: providerResponse,
      },
    });
  }

  return rows[0];
}

export async function ensureClinicalNotificationTemplates(context: ClinicalContext) {
  for (const templateKey of Object.keys(clinicalNotificationDefaults)) {
    await insertDefaultTemplate(context, templateKey, "WHATSAPP").catch(async () => null);
  }
}

export async function retryClinicalNotification(
  context: ClinicalContext,
  notificationId: number
) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT *
    FROM clinical_notification_queue
    WHERE id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
      AND COALESCE(is_deleted,false)=false
    LIMIT 1
    `,
    notificationId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  const row = rows[0];
  if (!row) return null;

  const payload =
    typeof row.payload === "string"
      ? JSON.parse(String(row.payload || "{}"))
      : ((row.payload || {}) as Record<string, unknown>);
  const messageBody = text(row.message_body);
  const template =
    (await getTemplate(context, text(row.template_key), text(row.channel))) ||
    (await insertDefaultTemplate(context, text(row.template_key), text(row.channel)));
  const bodyValues = templateVariableOrder(
    text(template.body),
    clinicalNotificationDefaults[text(row.template_key)]?.variables || []
  ).map((key) => text(payload[key]));

  const providerResponse = await dispatchQueuedMessage(
    text(row.channel),
    text(row.recipient),
    messageBody,
    text(row.template_key),
    payload,
    bodyValues
  );
  const status = providerResponse.status === "SENT" ? "SENT" : "QUEUED";
  const updated = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE clinical_notification_queue
    SET status=$5,
        sent_at=CASE WHEN $5='SENT' THEN CURRENT_TIMESTAMP ELSE sent_at END,
        provider_response=$6::jsonb,
        retry_count=COALESCE(retry_count,0)+1,
        updated_by=$7,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
    RETURNING *
    `,
    notificationId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    status,
    JSON.stringify(providerResponse),
    context.user.id ?? null
  );

  if (row.patient_id) {
    await recordWorkflowEvent(context, {
      patientId: Number(row.patient_id),
      appointmentId: row.appointment_id ? Number(row.appointment_id) : null,
      workflowStage: "NOTIFICATION",
      status,
      summary: `${row.channel} retry ${status.toLowerCase()} for ${row.template_key}.`,
      sourceTable: "clinical_notification_queue",
      sourceId: notificationId,
      metadata: {
        channel: row.channel,
        template_key: row.template_key,
        recipient: row.recipient,
        provider_response: providerResponse,
      },
    });
  }

  return updated[0] || null;
}

async function getPatientNotificationContext(
  context: ClinicalContext,
  patientId: number
) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      p.id,
      COALESCE(NULLIF(TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')), ''), p.patient_uid, p.uhid) AS patient_name,
      p.patient_uid,
      p.uhid,
      p.phone,
      p.whatsapp_number,
      p.alternate_mobile
    FROM patients p
    WHERE p.id=$1
      AND p.tenant_id=$2
      AND p.hospital_id=$3
      AND p.branch_id=$4
      AND COALESCE(p.is_deleted,false)=false
    LIMIT 1
    `,
    patientId,
    context.tenantId,
    context.hospitalId,
    context.branchId
  );
  return rows[0] || null;
}

async function getWorkflowDoctorName(
  context: ClinicalContext,
  input: {
    appointmentId?: number | null;
    patientId?: number | null;
  }
) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT d.full_name AS doctor_name
    FROM appointments a
    LEFT JOIN doctors d ON d.id = a.doctor_id
    WHERE a.tenant_id=$1
      AND a.hospital_id=$2
      AND a.branch_id=$3
      AND COALESCE(a.is_deleted,false)=false
      AND (
        ($4::int IS NOT NULL AND a.id=$4::int)
        OR ($4::int IS NULL AND $5::int IS NOT NULL AND a.patient_id=$5::int)
      )
    ORDER BY
      CASE WHEN $4::int IS NOT NULL AND a.id=$4::int THEN 0 ELSE 1 END,
      a.appointment_date DESC NULLS LAST,
      a.created_at DESC,
      a.id DESC
    LIMIT 1
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    input.appointmentId ?? null,
    input.patientId ?? null
  );
  return text(rows[0]?.doctor_name) || "Assigned Doctor";
}

export async function queueClinicalWorkflowNotification(
  context: ClinicalContext,
  input: {
    templateKey: string;
    patientId?: number | null;
    appointmentId?: number | null;
    invoiceId?: number | null;
    sourceModule?: string | null;
    sourceRecordId?: number | null;
    variables?: Record<string, unknown>;
    recipient?: string | null;
  }
) {
  if (!input.patientId && !input.recipient) {
    return null;
  }

  const patient = input.patientId
    ? await getPatientNotificationContext(context, input.patientId)
    : null;
  const recipient = text(
    input.recipient ||
      patient?.whatsapp_number ||
      patient?.phone ||
      patient?.alternate_mobile
  );

  if (!recipient) {
    return null;
  }

  const doctorName = isGenericDoctorName(input.variables?.doctor_name)
    ? await getWorkflowDoctorName(context, {
        appointmentId: input.appointmentId ?? null,
        patientId: input.patientId ?? null,
      })
    : text(input.variables?.doctor_name);

  return queueClinicalNotification(context, {
    channel: "WHATSAPP",
    templateKey: input.templateKey,
    recipient,
    patientId: input.patientId ?? null,
    appointmentId: input.appointmentId ?? null,
    invoiceId: input.invoiceId ?? null,
    sourceModule: input.sourceModule,
    sourceRecordId: input.sourceRecordId,
    variables: {
      patient_name: patient?.patient_name || "Patient",
      uhid: patient?.uhid || patient?.patient_uid || "-",
      hospital_name: context.hospitalName || context.branding.name,
      hospital_phone: "-",
      ...input.variables,
      doctor_name: doctorName || "Assigned Doctor",
    },
  });
}
