import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const supportedResources = new Set([
  "Patient",
  "Practitioner",
  "Organization",
  "Encounter",
  "Observation",
  "Condition",
  "Procedure",
  "MedicationRequest",
  "DiagnosticReport",
]);

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
};

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      resource: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { resource } = await params;

  if (!supportedResources.has(resource)) {
    return NextResponse.json(
      { error: "Unsupported FHIR resource." },
      { status: 404 }
    );
  }

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_interop_fhir_resources
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND resource_type = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY updated_at DESC NULLS LAST, id DESC
      LIMIT 200
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      resource
    );

  return NextResponse.json({
    resourceType: "Bundle",
    type: "searchset",
    total: rows.length,
    entry: rows.map((row) => ({
      fullUrl: `/api/clinical/interoperability/fhir/${resource}/${row.fhir_id}`,
      resource: row.resource,
    })),
  });
}

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      resource: string;
    }>;
  }
) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { resource } = await params;

  if (!supportedResources.has(resource)) {
    return NextResponse.json(
      { error: "Unsupported FHIR resource." },
      { status: 404 }
    );
  }

  const body = await request.json();
  const fhirId =
    String(body.id || `${resource}-${Date.now()}`);
  const patientId = toNumber(
    body.patient_id ||
      body.patientId ||
      body.subject?.reference?.split("/").pop()
  );
  const practitionerId = toNumber(
    body.practitioner_id ||
      body.practitionerId ||
      body.performer?.[0]?.reference
        ?.split("/")
        .pop()
  );

  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO clinical_interop_fhir_resources (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        fhir_id,
        fhir_version,
        resource_type,
        patient_id,
        practitioner_id,
        resource_status,
        resource,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (tenant_id, hospital_id, branch_id, fhir_id, resource_type)
      DO UPDATE SET
        fhir_version = EXCLUDED.fhir_version,
        patient_id = EXCLUDED.patient_id,
        practitioner_id = EXCLUDED.practitioner_id,
        resource_status = EXCLUDED.resource_status,
        resource = EXCLUDED.resource,
        updated_by = EXCLUDED.updated_by,
        updated_at = CURRENT_TIMESTAMP,
        is_deleted = false
      RETURNING *
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      fhirId,
      String(body.fhir_version || "R4"),
      resource,
      patientId,
      practitionerId,
      String(body.status || "ACTIVE"),
      JSON.stringify({
        ...body,
        id: fhirId,
        resourceType: resource,
      }),
      context.user.id ?? null
    );

  const row = rows[0];

  await recordClinicalAudit(context, {
    moduleName: "interop_fhir",
    action: "upsert",
    entityType:
      "clinical_interop_fhir_resources",
    entityId: Number(row.id),
    summary: `${resource} FHIR resource upserted`,
    payload: row,
  });

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO clinical_interop_fhir_audit (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      resource_id,
      request_method,
      request_path,
      request_payload,
      response_payload,
      status_code,
      requester,
      organization,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,'POST',$6,$7::jsonb,$8::jsonb,201,$9,$10,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    Number(row.id),
    `/api/clinical/interoperability/fhir/${resource}`,
    JSON.stringify(body),
    JSON.stringify(row.resource),
    context.user.email || "clinical-user",
    context.hospitalName,
    context.user.id ?? null
  );

  return NextResponse.json(
    row.resource,
    { status: 201 }
  );
}
