import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { queueClinicalWorkflowNotification } from "@/lib/clinical/notification-service";
import { recordWorkflowEvent } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const toNumber = (
  value: unknown
) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : null;
};

const text = (value: unknown) =>
  String(value || "").trim();

export async function GET(
  request: Request
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } =
    new URL(request.url);
  const appointmentId = toNumber(
    searchParams?.get("id")
  );
  const viewDate =
    searchParams?.get("date") ||
    new Date()
      .toISOString()
      .slice(0, 10);
  const appointmentFilter = appointmentId
    ? "AND a.id = $4"
    : "AND a.appointment_date = $4::date";

  const [appointments, patients, doctors, departments] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT
          a.*,
          COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name,
          p.patient_uid,
          d.full_name AS doctor_name,
          dep.department_name
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN doctors d ON d.id = a.doctor_id
        LEFT JOIN departments dep ON dep.id = a.department_id
        WHERE a.tenant_id = $1
          AND a.hospital_id = $2
          AND a.branch_id = $3
          ${appointmentFilter}
          AND COALESCE(a.is_deleted, false) = false
        ORDER BY a.start_time ASC NULLS LAST, a.id DESC
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        appointmentId || viewDate
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT id, patient_uid, first_name, last_name, phone
        FROM patients
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted, false) = false
        ORDER BY created_at DESC
        LIMIT 200
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT id, full_name, specialization, department_id, status
        FROM doctors
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted, false) = false
        ORDER BY full_name ASC
        LIMIT 100
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT id, department_name, department_code
        FROM departments
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted, false) = false
        ORDER BY department_name ASC
        LIMIT 100
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  return NextResponse.json({
    date: viewDate,
    appointments,
    patients,
    doctors,
    departments,
  });
}

export async function POST(
  request: Request
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  try {
    const body =
      await request.json();
    const patientId = toNumber(
      body.patient_id
    );

    if (!patientId) {
      return NextResponse.json(
        {
          error:
            "Select a patient before booking an appointment.",
        },
        {
          status: 400,
        }
      );
    }

    const patient = await prisma.patients.findFirst({
      where: {
        id: patientId,
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        is_deleted: false,
      },
      select: {
        id: true,
        patient_uid: true,
      },
    });

    if (!patient) {
      return NextResponse.json(
        {
          error:
            "Selected patient does not exist in the current hospital context.",
        },
        {
          status: 400,
        }
      );
    }

    if (!text(body.appointment_date)) {
      return NextResponse.json(
        {
          error:
            "Appointment date is required.",
        },
        {
          status: 400,
        }
      );
    }

    const tokenRows =
      await prisma.$queryRawUnsafe<
        { next_token: number }[]
      >(
        `
        SELECT COALESCE(MAX(NULLIF(regexp_replace(token_number, '\\D', '', 'g'), '')::int), 0) + 1 AS next_token
        FROM appointments
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND appointment_date = $4::date
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        body.appointment_date
      );
    const token = `T-${String(
      tokenRows[0]?.next_token || 1
    ).padStart(3, "0")}`;
    const uid = `APT-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const doctorId = toNumber(body.doctor_id);
    if (doctorId === null) {
      return NextResponse.json(
        {
          error:
            "Select a doctor before booking an appointment.",
        },
        {
          status: 400,
        }
      );
    }

    const doctor = await prisma.doctors.findFirst({
      where: {
        id: doctorId,
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        is_deleted: false,
      },
      select: {
        id: true,
        department_id: true,
      },
    });

    if (!doctor) {
      return NextResponse.json(
        {
          error:
            "Selected doctor does not exist in the current hospital context.",
        },
        { status: 400 }
      );
    }

    const requestedDepartmentId = toNumber(body.department_id);
    const fallbackDepartmentId =
      doctor?.department_id ?? null;
    const resolvedDepartmentId =
      requestedDepartmentId ?? fallbackDepartmentId;

    if (
      requestedDepartmentId !== null &&
      doctor.department_id !== null &&
      requestedDepartmentId !== doctor.department_id
    ) {
      return NextResponse.json(
        {
          error:
            "Selected doctor does not belong to the chosen department.",
        },
        { status: 400 }
      );
    }

    if (!resolvedDepartmentId) {
      return NextResponse.json(
        {
          error:
            "Select a department or assign the doctor to a department before booking the appointment.",
        },
        { status: 400 }
      );
    }

    const department =
      await prisma.departments.findFirst({
        where: {
          id: resolvedDepartmentId,
          tenant_id: context.tenantId,
          hospital_id: context.hospitalId,
          branch_id: context.branchId,
          is_deleted: false,
        },
        select: {
          id: true,
          department_name: true,
        },
      });

    if (!department) {
      return NextResponse.json(
        {
          error:
            "Selected department does not exist in the current hospital context.",
        },
        { status: 400 }
      );
    }

    const appointment =
      await prisma.appointments.create({
        data: {
          tenant_id: context.tenantId,
          clinic_id: context.clinicId,
          hospital_id: context.hospitalId,
          branch_id: context.branchId,
          patient_id: patient.id,
          doctor_id: doctor.id,
          department_id: department.id,
          appointment_uid: uid,
          appointment_date: new Date(`${text(body.appointment_date)}T00:00:00.000Z`),
          start_time: text(body.start_time)
            ? new Date(`1970-01-01T${text(body.start_time)}:00.000Z`)
            : null,
          end_time: text(body.end_time)
            ? new Date(`1970-01-01T${text(body.end_time)}:00.000Z`)
            : null,
          appointment_type: text(body.appointment_type) || "OPD",
          status: "BOOKED",
          token_number: token,
          queue_status: "WAITING",
          reason: text(body.reason) || null,
          notes: text(body.notes) || null,
          metadata: body.metadata || {},
          created_by: context.user.id ?? null,
          updated_by: context.user.id ?? null,
          is_deleted: false,
        },
      });

    await recordClinicalAudit(context, {
      moduleName: "appointments",
      action: "create",
      entityType: "appointment",
      entityId: Number(appointment.id),
      summary: "Clinical appointment booked",
      payload: {
        appointment_uid: uid,
        token_number: token,
        patient_id: patient.id,
        doctor_id: doctor.id,
        department_id: department.id,
      },
    });

    await recordWorkflowEvent(context, {
      patientId,
      appointmentId: Number(appointment.id),
      workflowStage: "APPOINTMENT",
      status: "BOOKED",
      summary: `Appointment booked with token ${token}.`,
      sourceTable: "appointments",
      sourceId: Number(appointment.id),
      metadata: {
        appointment_uid: uid,
        token_number: token,
        doctor_id: appointment.doctor_id,
        department_id: appointment.department_id,
      },
    });

    await queueClinicalWorkflowNotification(context, {
      templateKey: "appointment_booked",
      patientId,
      appointmentId: Number(appointment.id),
      sourceModule: "appointments",
      sourceRecordId: Number(appointment.id),
      variables: {
        doctor_name: appointment.doctor_id
          ? `Doctor #${appointment.doctor_id}`
          : "Doctor",
        department: department.department_name,
        appointment_date: String(appointment.appointment_date || body.appointment_date || "-"),
        appointment_time: String(appointment.start_time || "-"),
        appointment_number: appointment.appointment_uid || appointment.id,
      },
    });

    return NextResponse.json(
      appointment,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Clinical appointment create failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create appointment.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;

  try {
    const body = await request.json();
    const id = toNumber(body.id);

    if (!id) {
      return NextResponse.json({ error: "Appointment id is required." }, { status: 400 });
    }

    let status = text(body.status) || null;
    let queueStatus = text(body.queue_status) || null;

    if (status === "CHECKED_IN" || queueStatus === "CHECKED_IN") {
      status = "CHECKED_IN";
      queueStatus = "WAITING_FOR_VITALS";
    }

    const existing = await prisma.appointments.findFirst({
      where: {
        id,
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        is_deleted: false,
      },
      select: {
        id: true,
        patient_id: true,
        doctor_id: true,
        department_id: true,
        token_number: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }

    const doctorId = toNumber(body.doctor_id);
    const departmentId = toNumber(body.department_id);

    const doctorLookupId =
      doctorId ?? existing.doctor_id ?? null;

    const doctor =
      doctorLookupId === null
        ? null
        : await prisma.doctors.findFirst({
            where: {
              id: doctorLookupId,
              tenant_id: context.tenantId,
              hospital_id: context.hospitalId,
              branch_id: context.branchId,
              is_deleted: false,
            },
            select: {
              id: true,
              department_id: true,
            },
          });

    if (doctorLookupId !== null && !doctor) {
      return NextResponse.json(
        { error: "Selected doctor does not exist in the current hospital context." },
        { status: 400 }
      );
    }

    if (
      doctor &&
      departmentId !== null &&
      doctor.department_id !== null &&
      departmentId !== doctor.department_id
    ) {
      return NextResponse.json(
        { error: "Selected doctor does not belong to the chosen department." },
        { status: 400 }
      );
    }

    const resolvedDepartmentId =
      departmentId ?? doctor?.department_id ?? existing.department_id ?? null;

    if (!resolvedDepartmentId) {
      return NextResponse.json(
        { error: "Select a department before updating the appointment." },
        { status: 400 }
      );
    }

    const department = await prisma.departments.findFirst({
      where: {
        id: resolvedDepartmentId,
        tenant_id: context.tenantId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        is_deleted: false,
      },
      select: { id: true, department_name: true },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Selected department does not exist in the current hospital context." },
        { status: 400 }
      );
    }

    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE appointments
      SET doctor_id = COALESCE($5, doctor_id),
          department_id = $6,
          appointment_date = COALESCE($7::date, appointment_date),
          start_time = COALESCE($8::time, start_time),
          end_time = COALESCE($9::time, end_time),
          appointment_type = COALESCE($10, appointment_type),
          reason = COALESCE($11, reason),
          notes = COALESCE($12, notes),
          status = COALESCE($13, status),
          queue_status = COALESCE($14, queue_status),
          cancellation_reason = CASE WHEN $13 = 'CANCELLED' THEN COALESCE($15, cancellation_reason) ELSE cancellation_reason END,
          updated_by = $16,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted, false) = false
      RETURNING *
      `,
      id,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      doctor?.id ?? existing.doctor_id ?? null,
      department.id,
      text(body.appointment_date) || null,
      text(body.start_time) || null,
      text(body.end_time) || null,
      text(body.appointment_type) || null,
      text(body.reason) || null,
      text(body.notes) || null,
      status,
      queueStatus,
      text(body.cancellation_reason) || null,
      context.user.id ?? null
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }

    await recordClinicalAudit(context, {
      moduleName: "appointments",
      action: "update",
      entityType: "appointment",
      entityId: id,
      summary: "Clinical appointment status updated",
      payload: {
        status,
        queue_status: queueStatus,
        department_id: department.id,
      },
    });

    if (status || queueStatus) {
      await recordWorkflowEvent(context, {
        patientId: Number(rows[0].patient_id),
        appointmentId: id,
        workflowStage: "APPOINTMENT",
        status: queueStatus || status || "UPDATED",
        summary: `Appointment moved to ${queueStatus || status}.`,
        sourceTable: "appointments",
        sourceId: id,
        metadata: {
          status,
          queue_status: queueStatus,
          department_id: department.id,
        },
      });

      if (status === "CHECKED_IN" || queueStatus === "WAITING_FOR_VITALS") {
        await queueClinicalWorkflowNotification(context, {
          templateKey: "appointment_checked_in",
          patientId: Number(rows[0].patient_id),
          appointmentId: id,
          sourceModule: "appointments",
          sourceRecordId: id,
          variables: {
            doctor_name: rows[0].doctor_id ? `Doctor #${rows[0].doctor_id}` : "Doctor",
            department: department.department_name,
            token_number: rows[0].token_number || "-",
          },
        });
      }
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Clinical appointment update failed", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update appointment.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const id = toNumber(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Appointment id is required." }, { status: 400 });
  }

  const existing = await prisma.appointments.findFirst({
    where: {
      id,
      tenant_id: context.tenantId,
      hospital_id: context.hospitalId,
      branch_id: context.branchId,
      is_deleted: false,
    },
    select: {
      id: true,
      patient_id: true,
      appointment_uid: true,
      token_number: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }

  await prisma.$executeRawUnsafe(
    `
    UPDATE appointments
    SET is_deleted = true,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted, false) = false
    `,
    id,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName: "appointments",
    action: "delete",
    entityType: "appointment",
    entityId: id,
    summary: "Clinical appointment deleted",
    payload: {
      appointment_uid: existing.appointment_uid,
      token_number: existing.token_number,
      patient_id: existing.patient_id,
    },
  });

  await recordWorkflowEvent(context, {
    patientId: Number(existing.patient_id),
    appointmentId: id,
    workflowStage: "APPOINTMENT",
    status: "CANCELLED",
    summary: "Appointment deleted from workflow workspace.",
    sourceTable: "appointments",
    sourceId: id,
    metadata: {
      appointment_uid: existing.appointment_uid,
      token_number: existing.token_number,
      deleted: true,
    },
  });

  return NextResponse.json({ success: true });
}
