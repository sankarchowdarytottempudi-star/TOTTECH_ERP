import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const rows = async (sql: string, ...params: unknown[]) => {
  try {
    return await prisma.$queryRawUnsafe<Row[]>(sql, ...params);
  } catch (error) {
    console.error("[clinical-enterprise-command-center] query failed", error);
    return [];
  }
};

const one = async (sql: string, ...params: unknown[]) =>
  (await rows(sql, ...params))[0] || {};

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const scope = [context.tenantId, context.hospitalId, context.branchId];

  const [
    revenue,
    revenueTrend,
    revenueByDepartment,
    revenueByDoctor,
    revenueByService,
    collectionTrend,
    invoices,
    payments,
    pendingDues,
    refunds,
    claims,
    patientJourney,
    prescriptionQueue,
    assets,
    assetAlerts,
    auditEvents,
    globalMetrics,
    hospitalComparison,
    executive,
  ] = await Promise.all([
    one(
      `
      SELECT
        COALESCE(SUM(total) FILTER (WHERE invoice_date = CURRENT_DATE),0)::numeric AS today_revenue,
        COALESCE(SUM(total) FILTER (WHERE date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE)),0)::numeric AS monthly_revenue,
        COALESCE(SUM(balance_amount),0)::numeric AS outstanding_amount,
        COUNT(*) FILTER (WHERE COALESCE(balance_amount,0) > 0)::int AS pending_payments,
        COUNT(*) FILTER (WHERE status IN ('REFUNDED','CANCELLED'))::int AS refunds,
        COALESCE(SUM(paid_amount),0)::numeric AS collection_efficiency_value,
        CASE WHEN COALESCE(SUM(total),0) > 0
          THEN ROUND((COALESCE(SUM(paid_amount),0) / NULLIF(SUM(total),0)) * 100, 2)
          ELSE 0
        END AS collection_efficiency
      FROM billing_invoices
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      `,
      ...scope
    ),
    rows(
      `
      SELECT invoice_date::date AS label, COALESCE(SUM(total),0)::numeric AS value, '/clinical-services/finance?date=' || invoice_date::date AS href
      FROM billing_invoices
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND invoice_date >= CURRENT_DATE - INTERVAL '14 days'
        AND COALESCE(is_deleted,false)=false
      GROUP BY invoice_date
      ORDER BY invoice_date
      `,
      ...scope
    ),
    rows(
      `
      SELECT COALESCE(d.department_name, bi.source_module, bi.invoice_type, 'Unassigned') AS label,
        COALESCE(SUM(bi.total),0)::numeric AS value,
        '/clinical-services/finance?department=' || COALESCE(d.id::text,'unassigned') AS href
      FROM billing_invoices bi
      LEFT JOIN departments d ON d.id=bi.department_id
      WHERE bi.tenant_id=$1 AND bi.hospital_id=$2 AND bi.branch_id=$3
        AND COALESCE(bi.is_deleted,false)=false
      GROUP BY d.id, d.department_name, bi.source_module, bi.invoice_type
      ORDER BY value DESC
      LIMIT 8
      `,
      ...scope
    ),
    rows(
      `
      SELECT COALESCE(u.full_name, d.full_name, 'Unassigned') AS label,
        COALESCE(SUM(bi.total),0)::numeric AS value,
        '/clinical-services/doctors' AS href
      FROM billing_invoices bi
      LEFT JOIN appointments a ON a.id=bi.source_record_id AND bi.source_module IN ('appointments','consultation','consultations')
      LEFT JOIN doctors d ON d.id=a.doctor_id
      LEFT JOIN users u ON u.id=bi.created_by
      WHERE bi.tenant_id=$1 AND bi.hospital_id=$2 AND bi.branch_id=$3
        AND COALESCE(bi.is_deleted,false)=false
      GROUP BY COALESCE(u.full_name, d.full_name, 'Unassigned')
      ORDER BY value DESC
      LIMIT 8
      `,
      ...scope
    ),
    rows(
      `
      SELECT COALESCE(source_module, invoice_type, 'General') AS label,
        COALESCE(SUM(total),0)::numeric AS value,
        '/clinical-services/finance?service=' || COALESCE(source_module, invoice_type, 'General') AS href
      FROM billing_invoices
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      GROUP BY COALESCE(source_module, invoice_type, 'General')
      ORDER BY value DESC
      LIMIT 8
      `,
      ...scope
    ),
    rows(
      `
      SELECT payment_date::date AS label,
        COALESCE(SUM(amount),0)::numeric AS value,
        '/clinical-services/finance?collection_date=' || payment_date::date AS href
      FROM payments
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
        AND payment_date::date >= CURRENT_DATE - INTERVAL '14 days'
      GROUP BY payment_date::date
      ORDER BY payment_date::date
      `,
      ...scope
    ),
    rows(
      `
      SELECT bi.id, bi.invoice_number, bi.invoice_date, bi.total, bi.paid_amount, bi.balance_amount, bi.status,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
      FROM billing_invoices bi
      LEFT JOIN patients p ON p.id=bi.patient_id
      WHERE bi.tenant_id=$1 AND bi.hospital_id=$2 AND bi.branch_id=$3
        AND COALESCE(bi.is_deleted,false)=false
      ORDER BY bi.created_at DESC
      LIMIT 20
      `,
      ...scope
    ),
    rows(
      `
      SELECT pay.id, pay.payment_number, pay.payment_date, pay.payment_mode, pay.payment_method, pay.amount, pay.reference_number,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        bi.invoice_number
      FROM payments pay
      LEFT JOIN patients p ON p.id=pay.patient_id
      LEFT JOIN billing_invoices bi ON bi.id=pay.invoice_id
      WHERE pay.tenant_id=$1 AND pay.hospital_id=$2 AND pay.branch_id=$3
        AND COALESCE(pay.is_deleted,false)=false
      ORDER BY pay.payment_date DESC NULLS LAST, pay.id DESC
      LIMIT 20
      `,
      ...scope
    ),
    rows(
      `
      SELECT bi.id, bi.invoice_number, bi.invoice_date, bi.total, bi.paid_amount, bi.balance_amount, bi.status,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
      FROM billing_invoices bi
      LEFT JOIN patients p ON p.id=bi.patient_id
      WHERE bi.tenant_id=$1 AND bi.hospital_id=$2 AND bi.branch_id=$3
        AND COALESCE(bi.balance_amount,0) > 0
        AND COALESCE(bi.is_deleted,false)=false
      ORDER BY bi.invoice_date ASC NULLS LAST, bi.id DESC
      LIMIT 20
      `,
      ...scope
    ),
    rows(
      `
      SELECT id, refund_number, amount, reason, status, created_at
      FROM billing_refunds
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 20
      `,
      ...scope
    ),
    rows(
      `
      SELECT id, claim_number, claim_amount, approved_amount, settled_amount, status, submitted_date
      FROM clinical_finance_claims
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY submitted_date DESC NULLS LAST, id DESC
      LIMIT 20
      `,
      ...scope
    ),
    rows(
      `
      SELECT id, patient_id, event_type, event_title, event_summary, source_table, source_id, event_time, created_at,
        COALESCE(source_table, 'Hospital') AS department_name,
        created_by
      FROM clinical_patient_timeline
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY COALESCE(event_time, created_at) DESC
      LIMIT 40
      `,
      ...scope
    ),
    rows(
      `
      SELECT q.id, q.queue_number, q.prescription_uid, q.patient_name, q.status, q.created_at,
        pr.prescription_uid AS prescription_number
      FROM pharmacy_prescription_queue q
      LEFT JOIN prescriptions pr ON pr.id=q.prescription_id
      WHERE q.tenant_id=$1 AND q.hospital_id=$2 AND q.branch_id=$3
        AND COALESCE(q.is_deleted,false)=false
      ORDER BY q.created_at DESC
      LIMIT 20
      `,
      ...scope
    ),
    rows(
      `
      SELECT a.id, a.asset_number, a.asset_name, a.category, a.purchase_date, a.purchase_cost, a.current_value, a.status, a.location,
        d.department_name
      FROM clinical_finance_assets a
      LEFT JOIN departments d ON d.id=a.department_id
      WHERE a.tenant_id=$1 AND a.hospital_id=$2 AND a.branch_id=$3
        AND COALESCE(a.is_deleted,false)=false
      ORDER BY a.updated_at DESC NULLS LAST, a.id DESC
      LIMIT 30
      `,
      ...scope
    ),
    rows(
      `
      SELECT id, asset_number, asset_name, category, status, purchase_date, location
      FROM clinical_finance_assets
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
        AND (
          status IN ('REPAIR','LOST','DISPOSED')
          OR (purchase_date IS NOT NULL AND purchase_date <= CURRENT_DATE - INTERVAL '330 days')
        )
      ORDER BY status, purchase_date ASC NULLS LAST
      LIMIT 12
      `,
      ...scope
    ),
    rows(
      `
      SELECT a.id, a.module_name, a.action, a.entity_type, a.entity_id, a.summary, a.created_at,
        u.full_name AS user_name
      FROM clinical_audit_events a
      LEFT JOIN users u ON u.id=a.user_id
      WHERE a.tenant_id=$1 AND a.hospital_id=$2 AND a.branch_id=$3
        AND COALESCE(a.is_deleted,false)=false
      ORDER BY a.created_at DESC
      LIMIT 30
      `,
      ...scope
    ),
    one(
      `
      SELECT
        (SELECT COUNT(*)::int FROM hospitals WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_hospitals,
        (SELECT COUNT(*)::int FROM patients WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_patients,
        (SELECT COUNT(*)::int FROM doctors WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_doctors,
        (SELECT COUNT(*)::int FROM appointments WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_consultations,
        (SELECT COALESCE(SUM(total),0)::numeric FROM billing_invoices WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_revenue,
        (SELECT COUNT(*)::int FROM lab_orders WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_lab_tests,
        (SELECT COUNT(*)::int FROM prescriptions WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_prescriptions
      `,
      context.tenantId
    ),
    rows(
      `
      SELECT h.id, h.hospital_name AS label,
        COALESCE(SUM(bi.total),0)::numeric AS value,
        COUNT(DISTINCT p.id)::int AS patient_count,
        COUNT(DISTINCT a.id)::int AS consultation_count,
        '/clinical-services/platform-hospitals' AS href
      FROM hospitals h
      LEFT JOIN billing_invoices bi ON bi.hospital_id=h.id AND COALESCE(bi.is_deleted,false)=false
      LEFT JOIN patients p ON p.hospital_id=h.id AND COALESCE(p.is_deleted,false)=false
      LEFT JOIN appointments a ON a.hospital_id=h.id AND COALESCE(a.is_deleted,false)=false
      WHERE h.tenant_id=$1 AND COALESCE(h.is_deleted,false)=false
      GROUP BY h.id, h.hospital_name
      ORDER BY value DESC
      LIMIT 10
      `,
      context.tenantId
    ),
    one(
      `
      SELECT
        (SELECT COUNT(*)::int FROM patients WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND created_at::date=CURRENT_DATE AND COALESCE(is_deleted,false)=false) AS patients_today,
        (SELECT COALESCE(SUM(total),0)::numeric FROM billing_invoices WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND invoice_date=CURRENT_DATE AND COALESCE(is_deleted,false)=false) AS revenue_today,
        (SELECT COUNT(*)::int FROM ip_admissions WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('ADMITTED','ACTIVE') AND COALESCE(is_deleted,false)=false) AS admissions,
        (SELECT COUNT(*)::int FROM discharges WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND discharge_date=CURRENT_DATE AND COALESCE(is_deleted,false)=false) AS discharges,
        (SELECT COUNT(*)::int FROM lab_orders WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('ORDERED','COLLECTED','PROCESSING','RESULT_ENTERED','VALIDATED','APPROVED') AND COALESCE(is_deleted,false)=false) AS pending_labs,
        (SELECT COUNT(*)::int FROM pharmacy_prescription_queue WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('PENDING','PARTIAL') AND COALESCE(is_deleted,false)=false) AS pending_prescriptions,
        (SELECT COUNT(*)::int FROM bed_allocations WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('OCCUPIED','ACTIVE') AND COALESCE(is_deleted,false)=false) AS bed_occupancy,
        (SELECT COUNT(*)::int FROM doctors WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status='AVAILABLE' AND COALESCE(is_deleted,false)=false) AS doctor_utilization
      `,
      ...scope
    ),
  ]);

  const cashByMode = await rows(
    `
    SELECT COALESCE(payment_mode, payment_method, 'Unspecified') AS label,
      COALESCE(SUM(amount),0)::numeric AS value,
      '/clinical-services/finance?payment_mode=' || COALESCE(payment_mode, payment_method, 'Unspecified') AS href
    FROM payments
    WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
      AND payment_date::date = CURRENT_DATE
    GROUP BY COALESCE(payment_mode, payment_method, 'Unspecified')
    ORDER BY value DESC
    `,
    ...scope
  );

  return NextResponse.json({
    context,
    revenue,
    cashByMode,
    revenueTrend,
    revenueByDepartment,
    revenueByDoctor,
    revenueByService,
    collectionTrend,
    invoices,
    payments,
    pendingDues,
    refunds,
    claims,
    patientJourney,
    prescriptionQueue,
    assets,
    assetAlerts,
    auditEvents,
    globalMetrics,
    hospitalComparison,
    executive,
  });
}
