import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { id } = await params;
  const patientId = Number(id);

  const [
    patientRows,
    appointments,
    medicalRecords,
    ivfCases,
    documents,
    audit,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM patients
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted, false) = false
      LIMIT 1
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT a.*, d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.patient_id = $1
        AND a.tenant_id = $2
        AND a.hospital_id = $3
        AND a.branch_id = $4
        AND COALESCE(a.is_deleted, false) = false
      ORDER BY a.appointment_date DESC, a.start_time DESC NULLS LAST
      LIMIT 50
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM medical_records
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted, false) = false
      ORDER BY created_at DESC
      LIMIT 50
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM ivf_cases
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted, false) = false
      ORDER BY created_at DESC
      LIMIT 20
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM medical_documents
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted, false) = false
      ORDER BY created_at DESC
      LIMIT 50
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_audit_events
      WHERE entity_type = 'patient'
        AND entity_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      ORDER BY created_at DESC
      LIMIT 50
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  if (!patientRows.length) {
    return NextResponse.json(
      {
        error: "Patient not found.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    patient: patientRows[0],
    appointments,
    medicalRecords,
    ivfCases,
    documents,
    audit,
  });
}
