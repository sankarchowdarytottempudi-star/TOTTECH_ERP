import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const text = (value: unknown) =>
  String(value || "").trim();

const nullableText = (value: unknown) =>
  text(value) || null;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { searchParams } = new URL(request.url);
  const query = searchParams?.get("q")?.trim() || "";
  const search = query
    ? `%${query.toLowerCase()}%`
    : null;

  const [doctors, departments] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        d.*,
        dep.department_name
      FROM doctors d
      LEFT JOIN departments dep ON dep.id = d.department_id
      WHERE d.tenant_id = $1
        AND d.hospital_id = $2
        AND d.branch_id = $3
        AND COALESCE(d.is_deleted, false) = false
        AND (
          $4::text IS NULL
          OR lower(d.full_name) LIKE $4::text
          OR lower(COALESCE(d.specialization, '')) LIKE $4::text
          OR lower(COALESCE(d.phone, '')) LIKE $4::text
          OR lower(COALESCE(d.email, '')) LIKE $4::text
        )
      ORDER BY d.full_name ASC
      LIMIT 200
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      search
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
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  return NextResponse.json({
    doctors,
    departments,
  });
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  try {
    const body = await request.json();

    if (!text(body.full_name)) {
      return NextResponse.json(
        {
          error: "Doctor full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const uid = `DOC-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const departmentId = toNumber(body.department_id);
    const department =
      departmentId === null
        ? null
        : await prisma.departments.findFirst({
            where: {
              id: departmentId,
              tenant_id: context.tenantId,
              hospital_id: context.hospitalId,
              branch_id: context.branchId,
              is_deleted: false,
            },
            select: { id: true },
          });
    const doctor = await prisma.doctors.create({
      data: {
        tenant_id: context.tenantId,
        clinic_id: context.clinicId,
        hospital_id: context.hospitalId,
        branch_id: context.branchId,
        doctor_uid: uid,
        full_name: text(body.full_name),
        specialization: nullableText(body.specialization),
        department_id: department?.id || null,
        phone: nullableText(body.phone),
        email: nullableText(body.email),
        consultation_fee: Number(body.consultation_fee || 0),
        availability: body.availability || {},
        status: text(body.status) || "AVAILABLE",
        created_by: context.user.id ?? null,
        updated_by: context.user.id ?? null,
        is_deleted: false,
      },
    });

    await recordClinicalAudit(context, {
      moduleName: "doctors",
      action: "create",
      entityType: "doctor",
      entityId: Number(doctor.id),
      summary: "Clinical doctor profile created",
      payload: {
        doctor_uid: uid,
      },
    });

    return NextResponse.json(doctor, {
      status: 201,
    });
  } catch (error) {
    console.error("Clinical doctor create failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create doctor record.",
      },
      {
        status: 500,
      }
    );
  }
}
