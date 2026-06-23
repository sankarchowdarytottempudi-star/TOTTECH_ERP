import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const serialize = (value: unknown) =>
  JSON.parse(
    JSON.stringify(value, (_, item) =>
      typeof item === "bigint" ? Number(item) : item
    )
  );

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
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const { id } = await params;
  const patientId = Number(id);

  if (!Number.isFinite(patientId)) {
    return NextResponse.json(
      {
        error: "Valid patient id is required.",
      },
      {
        status: 400,
      }
    );
  }

  const scope = [
    patientId,
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];

  const [
    patientRows,
    appointments,
    opVisits,
    erVisits,
    admissions,
    icuRecords,
    otSchedules,
    clinicalOtSchedules,
    nursingNotes,
    medicalRecords,
    vitals,
    labOrders,
    labResults,
    radiologyOrders,
    radiologyReports,
    radiologyUploads,
    prescriptions,
    documents,
    invoices,
    payments,
    insurancePolicies,
    insuranceClaims,
    referrals,
    ivfCases,
    ivfCouples,
    ivfCycles,
    ivfTimeline,
    pharmacySales,
    pharmacyDispensing,
    pharmacyDispenses,
    pharmacyTimeline,
    financeInvoices,
    operationalPayments,
    financeTimeline,
    interopResources,
    interopTimeline,
    alerts,
    timeline,
    workflowEvents,
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
        AND COALESCE(is_deleted,false) = false
      LIMIT 1
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM appointments
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY appointment_date DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM op_visits
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY visit_date DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM er_visits
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY arrival_time DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM ip_admissions
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY admission_date DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM icu_monitoring_records
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY recorded_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM ot_schedules
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY scheduled_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_ot_schedules
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY scheduled_date DESC NULLS LAST, scheduled_time DESC NULLS LAST, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM nursing_notes
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY note_time DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_vitals
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM medical_records
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        lo.*,
        d.full_name AS doctor_name,
        COALESCE(lt.lab_test_name, lt.test_name, lo.order_type) AS lab_test_name,
        COALESCE(lt.reference_range, lt.normal_value) AS reference_range,
        lt.unit AS result_unit
      FROM lab_orders lo
      LEFT JOIN doctors d ON d.id = lo.doctor_id
      LEFT JOIN clinical_lab_test_master lt
        ON lt.id = lo.lab_test_id
        AND lt.tenant_id = lo.tenant_id
        AND lt.hospital_id = lo.hospital_id
        AND lt.branch_id = lo.branch_id
        AND COALESCE(lt.is_deleted,false) = false
      WHERE lo.patient_id = $1
        AND lo.tenant_id = $2
        AND lo.hospital_id = $3
        AND lo.branch_id = $4
        AND COALESCE(lo.is_deleted,false) = false
      ORDER BY lo.ordered_at DESC, lo.id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
	      SELECT
	        lr.*,
	        lo.appointment_id,
	        lo.order_uid,
	        lo.order_type,
	        lo.status AS order_status,
	        COALESCE(lt.lab_test_name, lo.order_type) AS lab_test_name,
	        COALESCE(lt.unit, (lr.result_data ->> 'unit')) AS result_unit,
	        COALESCE(lt.reference_range, lt.normal_value, (lr.result_data ->> 'reference_range')) AS reference_range,
	        COALESCE(u.full_name, validator.full_name) AS released_by_name,
	        lr.validated_at AS released_at
	      FROM lab_results lr
	      LEFT JOIN lab_orders lo ON lo.id = lr.lab_order_id
	      LEFT JOIN clinical_lab_test_master lt
	        ON (
	          lt.id = lo.lab_test_id
	          OR lower(lt.lab_test_name) = lower(lo.order_type)
	        )
	        AND lt.tenant_id = lr.tenant_id
	        AND lt.hospital_id = lr.hospital_id
	        AND lt.branch_id = lr.branch_id
	        AND COALESCE(lt.is_deleted,false) = false
	      LEFT JOIN users u ON u.id = lr.updated_by
	      LEFT JOIN users validator ON validator.id = lr.validated_by
	      WHERE lr.patient_id = $1 AND lr.tenant_id = $2 AND lr.hospital_id = $3 AND lr.branch_id = $4 AND COALESCE(lr.is_deleted,false) = false
	      ORDER BY lr.created_at DESC, lr.id DESC
	      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM radiology_orders
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM radiology_reports
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM radiology_uploads
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY uploaded_at DESC NULLS LAST, created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM prescriptions
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM medical_documents
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM billing_invoices
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY invoice_date DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM billing_payments
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY payment_date DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM insurance_policies
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM insurance_claims
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY submission_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_referrals
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 20
      `,
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
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM ivf_couples
      WHERE (female_patient_id = $1 OR male_patient_id = $1)
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT cyc.*
      FROM ivf_cycles cyc
      JOIN ivf_couples c ON c.id = cyc.couple_id
      WHERE (c.female_patient_id = $1 OR c.male_patient_id = $1)
        AND cyc.tenant_id = $2
        AND cyc.hospital_id = $3
        AND cyc.branch_id = $4
        AND COALESCE(cyc.is_deleted,false) = false
        AND COALESCE(c.is_deleted,false) = false
      ORDER BY cyc.start_date DESC NULLS LAST, cyc.id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT t.*
      FROM ivf_timeline t
      LEFT JOIN ivf_couples c ON c.id = t.couple_id
      WHERE (t.patient_id = $1 OR c.female_patient_id = $1 OR c.male_patient_id = $1)
        AND t.tenant_id = $2
        AND t.hospital_id = $3
        AND t.branch_id = $4
        AND COALESCE(t.is_deleted,false) = false
      ORDER BY t.created_at DESC, t.id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM pharmacy_retail_sales
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY sale_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM pharmacy_ip_dispensing
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_pharmacy_dispenses
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM pharmacy_timeline
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_finance_ar_invoices
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY invoice_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_operational_payments
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY payment_date DESC NULLS LAST, created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_finance_timeline
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT fhir_id, resource_type, resource_status, resource, created_at, updated_at
      FROM clinical_interop_fhir_resources
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY updated_at DESC NULLS LAST, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_interop_timeline
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_patient_alerts
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_patient_timeline
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY event_time DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_patient_workflow_events
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT *
      FROM clinical_audit_events
      WHERE entity_type IN ('patient','appointment','op_visits','ip_admissions','billing_invoices')
        AND (
          entity_id = $1
          OR payload::text LIKE '%' || $1::text || '%'
        )
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,
      ...scope
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

  return NextResponse.json(serialize({
    context,
    patient: patientRows[0],
    appointments,
    opVisits,
    erVisits,
    admissions,
    icuRecords,
    otSchedules: [
      ...otSchedules,
      ...clinicalOtSchedules,
    ],
    nursingNotes,
    medicalRecords,
    vitals,
    labOrders,
    labResults,
    radiologyOrders,
    radiologyReports,
    radiologyUploads,
    prescriptions,
    documents,
    invoices,
    payments,
    insurancePolicies,
    insuranceClaims,
    referrals,
    ivfCases,
    ivfCouples,
    ivfCycles,
    ivfTimeline,
    pharmacySales,
    pharmacyDispensing: [
      ...pharmacyDispensing,
      ...pharmacyDispenses,
    ],
    pharmacyTimeline,
    financeInvoices,
    operationalPayments,
    financeTimeline,
    interopResources,
    interopTimeline,
    alerts,
    timeline: [
      ...timeline,
      ...workflowEvents.map((event): Row => ({
        ...event,
        event_type: event.workflow_stage,
        event_title: event.status,
        event_summary: event.summary,
      })),
      ...ivfTimeline,
      ...pharmacyTimeline,
      ...financeTimeline,
      ...interopTimeline,
    ].sort((a, b) => {
      const aDate = new Date(String(a.event_time || a.created_at || 0)).getTime();
      const bDate = new Date(String(b.event_time || b.created_at || 0)).getTime();
      return bDate - aDate;
    }),
    audit,
  }));
}
