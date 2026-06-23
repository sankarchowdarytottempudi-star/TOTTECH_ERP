import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";
import { queueWhatsAppMessage } from "@/lib/notifications/whatsapp";

type Row = Record<string, unknown>;

const uniquePhones = (phones: Array<string | null | undefined>) => {
  const normalized = phones
    .map((value) =>
      String(value || "")
        .replace(/\D/g, "")
        .trim()
    )
    .filter(Boolean);
  return Array.from(new Set(normalized));
};

const toDateLabel = (value: unknown) => {
  const candidate =
    value instanceof Date
      ? value
      : new Date(String(value || new Date()));

  if (Number.isNaN(candidate.getTime())) {
    return new Date().toLocaleDateString();
  }

  return candidate.toLocaleDateString();
};

async function createAbsenceNotificationLog(input: {
  schoolId: number | null;
  studentId: number | null;
  academicYearId: number | null;
  channel: string;
  templateName: string;
  message: string;
  deliveryStatus: string;
  sentStatus: boolean;
  recipient?: string | null;
  metadata?: Record<string, unknown>;
}) {
  return prisma.notifications.create({
    data: {
      school_id: input.schoolId,
      student_id: input.studentId,
      notification_type: `${input.channel}:${input.templateName}`,
      message: input.message,
      sent_status: input.sentStatus,
      channel: input.channel,
      recipient_phone: input.recipient ?? null,
      delivery_status: input.deliveryStatus,
      metadata: {
        source: "attendance",
        template_name: input.templateName,
        channel: input.channel,
        ...input.metadata,
      },
    },
  });
}

export async function sendAbsentNotifications(
  attendanceId: number,
  userId: number | null
) {
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      a.*,
      s.name,
      s.first_name,
      s.middle_name,
      s.last_name,
      s.phone,
      s.father_name,
      s.father_phone,
      s.mother_name,
      s.mother_phone,
      sc.school_name,
      sc.phone AS school_phone,
      sc.email AS school_email
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
    return {
      whatsapp: [],
      notifications: [],
    };
  }

  const parentPhones = uniquePhones([
    row.father_phone as string | null,
    row.mother_phone as string | null,
    row.phone as string | null,
  ]);

  const schoolName =
    String(row.school_name || "School/College");
  const studentName =
    String(
      row.name ||
        [
          row.first_name,
          row.middle_name,
          row.last_name,
        ]
          .filter(Boolean)
          .join(" ") ||
        `Student ${row.student_id || ""}`
    ).trim();
  const dateLabel = toDateLabel(row.attendance_date);
  const classLabel = String(
    row.class_name || "Class"
  );
  const sectionLabel = String(
    row.section_name || "Section"
  );
  const message = `Dear Parent,\n\nYour child ${studentName} was marked ABSENT today.\n\nDate: ${dateLabel}\nClass: ${classLabel}\nSection: ${sectionLabel}\n\nIf this absence was entered by mistake, please contact the school immediately.\n\nRegards,\n${schoolName}`;

  const whatsappResults = [];
  const whatsappRecipients = parentPhones.length
    ? parentPhones
    : [String(row.school_phone || "")];

  for (const recipient of whatsappRecipients) {
    if (!recipient) {
      continue;
    }

    try {
      const result = await queueWhatsAppMessage({
        templateName: "student_absent_alert",
        schoolId: Number(row.school_id) || null,
        academicYearId:
          Number(row.academic_year_id) || null,
        studentId:
          Number(row.student_id) || null,
        userId,
        recipient,
        variables: [
          studentName,
          dateLabel,
          classLabel,
          String(
            row.school_phone || "the school/college office"
          ),
        ],
        triggeredBy: "STUDENT_ABSENT",
        entityType: "attendance",
        entityId: attendanceId,
        messagePreview: message,
      });

      whatsappResults.push(result);

      await createAbsenceNotificationLog({
        schoolId: Number(row.school_id) || null,
        studentId: Number(row.student_id) || null,
        academicYearId:
          Number(row.academic_year_id) || null,
        channel: "WHATSAPP",
        templateName: "student_absent_alert",
        message,
        deliveryStatus: "QUEUED",
        sentStatus: true,
        recipient,
        metadata: {
          attendance_id: attendanceId,
          queue_status: result.status,
        },
      });
    } catch (error) {
      await createAbsenceNotificationLog({
        schoolId: Number(row.school_id) || null,
        studentId: Number(row.student_id) || null,
        academicYearId:
          Number(row.academic_year_id) || null,
        channel: "WHATSAPP",
        templateName: "student_absent_alert",
        message,
        deliveryStatus: "FAILED",
        sentStatus: false,
        recipient,
        metadata: {
          attendance_id: attendanceId,
          error:
            error instanceof Error
              ? error.message
              : String(error),
        },
      });
    }
  }

  const notifications = await Promise.all(
    [
      {
        channel: "SMS",
        sent: true,
        deliveryStatus: "QUEUED",
        recipient:
          parentPhones[0] ||
          String(row.school_phone || ""),
      },
      {
        channel: "EMAIL",
        sent: Boolean(row.school_email),
        deliveryStatus: row.school_email
          ? "QUEUED"
          : "NO_RECIPIENT",
        recipient: row.school_email || null,
      },
      {
        channel: "PUSH",
        sent: true,
        deliveryStatus: "QUEUED",
        recipient: String(row.student_id || ""),
      },
    ].map((item) =>
      createAbsenceNotificationLog({
        schoolId: Number(row.school_id) || null,
        studentId: Number(row.student_id) || null,
        academicYearId:
          Number(row.academic_year_id) || null,
        channel: item.channel,
        templateName: "student_absent_alert",
        message,
        sentStatus: item.sent,
        deliveryStatus: item.deliveryStatus,
        recipient:
          typeof item.recipient === "string"
            ? item.recipient
            : null,
      })
    )
  );

  await recordEvent({
    school_id:
      Number(row.school_id) || null,
    academic_year_id:
      Number(row.academic_year_id) || null,
    user_id: userId,
    actor_role: "SYSTEM",
    module_name: "attendance",
    event_type: "ABSENCE_ALERTS_SENT",
    action: "notify",
    entity_type: "attendance",
    entity_id: Number(row.id) || null,
    summary:
      "Student absence notifications queued",
    payload: {
      student_id:
        Number(row.student_id) || null,
      student_name: studentName,
      recipients: parentPhones,
      channels: ["WHATSAPP", "SMS", "EMAIL", "PUSH"],
    },
  });

  return {
    whatsapp: whatsappResults,
    notifications,
  };
}
