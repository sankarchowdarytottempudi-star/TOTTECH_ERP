import { NextResponse } from "next/server";

import {
  createDocumentRecord,
} from "@/lib/clinical/phase4-operational-spine";
import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const text = (value: unknown) =>
  String(value ?? "").trim();

function csvEscape(value: unknown) {
  const raw = String(value ?? "");
  if (
    raw.includes(",") ||
    raw.includes("\"") ||
    raw.includes("\n")
  ) {
    return `"${raw.replaceAll("\"", "\"\"")}"`;
  }
  return raw;
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { id } = await params;
  const patientId = Number(id);

  if (!Number.isFinite(patientId)) {
    return NextResponse.json(
      { error: "Patient id is required." },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const q = text(url.searchParams?.get("q")).toLowerCase();
  const eventType = text(url.searchParams?.get("eventType"));
  const exportType = text(url.searchParams?.get("export"));
  const search = q ? `%${q}%` : null;

  const [patientRows, events] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, patient_uid, uhid, first_name, last_name, phone, email, status
      FROM patients
      WHERE id=$1
        AND tenant_id=$2
        AND hospital_id=$3
        AND branch_id=$4
        AND COALESCE(is_deleted,false)=false
      LIMIT 1
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        e.*,
        u.full_name AS user_name
      FROM patient_timeline_events e
      LEFT JOIN users u ON u.id = e.created_by
      WHERE e.patient_id=$1
        AND e.tenant_id=$2
        AND e.hospital_id=$3
        AND e.branch_id=$4
        AND COALESCE(e.is_deleted,false)=false
        AND ($5::text = '' OR e.event_type=$5::text)
        AND (
          $6::text IS NULL
          OR lower(e.event_type) LIKE $6::text
          OR lower(e.event_source) LIKE $6::text
          OR lower(e.title) LIKE $6::text
          OR lower(COALESCE(e.description,'')) LIKE $6::text
        )
      ORDER BY e.event_datetime DESC, e.id DESC
      LIMIT 500
      `,
      patientId,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      eventType,
      search
    ),
  ]);

  if (!patientRows[0]) {
    return NextResponse.json(
      { error: "Patient not found." },
      { status: 404 }
    );
  }

  if (exportType === "csv") {
    const lines = [
      ["Date", "Type", "Source", "Title", "Description", "User"].join(","),
      ...events.map((event) =>
        [
          event.event_datetime,
          event.event_type,
          event.event_source,
          event.title,
          event.description,
          event.user_name,
        ]
          .map(csvEscape)
          .join(",")
      ),
    ];
    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="patient-${patientId}-timeline.csv"`,
      },
    });
  }

  return NextResponse.json({
    context,
    patient: patientRows[0],
    events,
    filters: {
      eventTypes: Array.from(
        new Set(events.map((event) => event.event_type).filter(Boolean))
      ),
    },
  });
}

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { id } = await params;
  const patientId = Number(id);
  const body = (await request.json()) as Record<string, unknown>;

  if (!Number.isFinite(patientId)) {
    return NextResponse.json(
      { error: "Patient id is required." },
      { status: 400 }
    );
  }

  const document = await createDocumentRecord(context, {
    patientId,
    documentType: text(body.documentType) || "Timeline PDF",
    title: text(body.title) || "Patient Timeline Export",
    sourceModule: "patient_timeline",
    sourceRecordId: patientId,
    fileName: `patient-${patientId}-timeline.pdf`,
    contentType: "application/pdf",
  });

  return NextResponse.json(document, {
    status: 201,
  });
}
