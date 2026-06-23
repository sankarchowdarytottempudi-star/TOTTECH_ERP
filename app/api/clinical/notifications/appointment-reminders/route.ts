import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { queueClinicalNotification } from "@/lib/clinical/notification-service";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  const body = await request.json().catch(() => ({}));
  const reminderDate =
    body.date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT a.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name, p.phone, d.full_name AS doctor_name
    FROM appointments a
    LEFT JOIN patients p ON p.id=a.patient_id
    LEFT JOIN doctors d ON d.id=a.doctor_id
    WHERE a.tenant_id=$1
      AND a.hospital_id=$2
      AND a.branch_id=$3
      AND a.appointment_date=$4::date
      AND a.status IN ('BOOKED','CONFIRMED','SCHEDULED')
      AND COALESCE(a.is_deleted,false)=false
    ORDER BY a.start_time ASC NULLS LAST
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    reminderDate
  );

  const created = [];
  for (const appointment of rows) {
    if (!appointment.phone) continue;
    const notification = await queueClinicalNotification(context, {
      channel: "WHATSAPP",
      templateKey: "appointment_reminder",
      recipient: String(appointment.phone),
      patientId: Number(appointment.patient_id),
      appointmentId: Number(appointment.id),
      sourceModule: "appointments",
      sourceRecordId: Number(appointment.id),
      scheduledAt: new Date().toISOString(),
      variables: {
        patient_name: appointment.patient_name,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.start_time,
        doctor_name: appointment.doctor_name,
        message: `Your appointment is scheduled on ${appointment.appointment_date}.`,
      },
    });
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_appointment_reminders (
        tenant_id,hospital_id,branch_id,clinic_id,appointment_id,patient_id,reminder_type,reminder_at,channel,status,notification_id,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,'APPOINTMENT_REMINDER',CURRENT_TIMESTAMP,'WHATSAPP',$7,$8,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (tenant_id,hospital_id,branch_id,appointment_id,reminder_type,channel) WHERE COALESCE(is_deleted,false)=false
      DO UPDATE SET notification_id=EXCLUDED.notification_id, status=EXCLUDED.status, updated_at=CURRENT_TIMESTAMP
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      Number(appointment.id),
      Number(appointment.patient_id),
      String(notification.status),
      Number(notification.id),
      context.user.id ?? null
    );
    created.push(notification);
  }

  await recordClinicalAudit(context, {
    moduleName: "appointment_reminders",
    action: "generate",
    summary: `Generated ${created.length} appointment reminders for ${reminderDate}`,
    payload: { reminderDate, created: created.length },
  });

  return NextResponse.json({ date: reminderDate, reminders: created.length, rows: created });
}
