import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import {
  isModuleLicensed,
  moduleCodeForClinicalPath,
} from "@/lib/clinical/module-licensing";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

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
  const [
    metrics,
    appointments,
    waiting,
    recentPatients,
    revenueBreakdown,
    departmentPerformance,
    pendingTasks,
    alerts,
    notifications,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM appointments WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND appointment_date = CURRENT_DATE AND COALESCE(is_deleted,false) = false) AS todays_appointments,
        (SELECT COUNT(*)::int FROM patients WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND created_at::date = CURRENT_DATE AND COALESCE(is_deleted,false) = false) AS patients_registered_today,
        (SELECT COUNT(*)::int FROM doctors WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND status = 'AVAILABLE' AND COALESCE(is_deleted,false) = false) AS doctors_available,
        (SELECT COUNT(*)::int FROM lab_orders WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND status IN ('ORDERED','SAMPLE_COLLECTED','PENDING') AND COALESCE(is_deleted,false) = false) AS lab_orders_pending,
        (
          COALESCE((SELECT SUM(COALESCE(total,0)) FROM billing_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND invoice_date = CURRENT_DATE AND COALESCE(is_deleted,false) = false), 0)
          +
          COALESCE((SELECT SUM(COALESCE(paid_amount,0)) FROM clinical_finance_ar_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND invoice_date = CURRENT_DATE AND COALESCE(is_deleted,false) = false), 0)
          +
          COALESCE((SELECT SUM(COALESCE(amount,0)) FROM clinical_finance_cash_transactions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND transaction_date = CURRENT_DATE AND COALESCE(is_deleted,false) = false), 0)
        )::numeric AS revenue_today,
        (
          COALESCE((SELECT SUM(COALESCE(total,0)) FROM billing_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE) AND COALESCE(is_deleted,false) = false), 0)
          +
          COALESCE((SELECT SUM(COALESCE(paid_amount,0)) FROM clinical_finance_ar_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE) AND COALESCE(is_deleted,false) = false), 0)
          +
          COALESCE((SELECT SUM(COALESCE(amount,0)) FROM clinical_finance_cash_transactions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND date_trunc('month', transaction_date) = date_trunc('month', CURRENT_DATE) AND COALESCE(is_deleted,false) = false), 0)
        )::numeric AS revenue_this_month,
        (SELECT COUNT(*)::int FROM ivf_cycles WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND status = 'ACTIVE' AND COALESCE(is_deleted,false) = false) AS ivf_cycles_active,
        (SELECT COUNT(*)::int FROM appointments WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND appointment_date = CURRENT_DATE AND queue_status = 'WAITING' AND COALESCE(is_deleted,false) = false) AS patients_waiting
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        a.id,
        a.appointment_uid,
        a.appointment_date,
        a.start_time,
        a.status,
        a.queue_status,
        a.token_number,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name,
        d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND COALESCE(a.is_deleted, false) = false
      ORDER BY a.start_time ASC NULLS LAST, a.id DESC
      LIMIT 12
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        a.id,
        a.token_number,
        a.queue_status,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND a.queue_status IN ('WAITING','CHECKED_IN')
        AND COALESCE(a.is_deleted, false) = false
      ORDER BY a.created_at ASC
      LIMIT 10
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        id,
        patient_uid,
        uhid,
        first_name,
        last_name,
        phone AS mobile,
        created_at
      FROM patients
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted, false) = false
      ORDER BY created_at DESC
      LIMIT 8
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT 'OP/IP Billing' AS label,
        COALESCE(SUM(COALESCE(total,0)), 0)::numeric AS value,
        '/clinical-services/hms/billing' AS href
      FROM billing_invoices
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE)
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Finance AR' AS label,
        COALESCE(SUM(COALESCE(paid_amount,0)), 0)::numeric AS value,
        '/clinical-services/finance/ar' AS href
      FROM clinical_finance_ar_invoices
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE)
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Cash Collections' AS label,
        COALESCE(SUM(COALESCE(amount,0)), 0)::numeric AS value,
        '/clinical-services/finance/cash' AS href
      FROM clinical_finance_cash_transactions
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND date_trunc('month', transaction_date) = date_trunc('month', CURRENT_DATE)
        AND COALESCE(is_deleted, false) = false
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(d.department_name, 'Unassigned') AS label,
        COUNT(a.id)::int AS value,
        '/clinical-services/appointments' AS href
      FROM departments d
      LEFT JOIN doctors doc
        ON doc.department_id = d.id
        AND doc.tenant_id = d.tenant_id
        AND doc.hospital_id = d.hospital_id
        AND doc.branch_id = d.branch_id
        AND COALESCE(doc.is_deleted, false) = false
      LEFT JOIN appointments a
        ON a.doctor_id = doc.id
        AND a.appointment_date = CURRENT_DATE
        AND COALESCE(a.is_deleted, false) = false
      WHERE d.tenant_id = $1
        AND d.hospital_id = $2
        AND d.branch_id = $3
        AND COALESCE(d.is_deleted, false) = false
      GROUP BY d.department_name
      ORDER BY value DESC, d.department_name ASC
      LIMIT 8
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT 'Patients waiting' AS title,
        COUNT(*)::int AS value,
        '/clinical-services/appointments' AS href
      FROM appointments
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND appointment_date = CURRENT_DATE
        AND queue_status IN ('WAITING','CHECKED_IN')
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Pending lab orders' AS title,
        COUNT(*)::int AS value,
        '/clinical-services/lab-orders' AS href
      FROM lab_orders
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND status IN ('ORDERED','SAMPLE_COLLECTED','PENDING')
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Active IVF cycles' AS title,
        COUNT(*)::int AS value,
        '/clinical-services/ivf/cycles' AS href
      FROM ivf_cycles
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND status = 'ACTIVE'
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Draft insurance claims' AS title,
        COUNT(*)::int AS value,
        '/clinical-services/finance/claims' AS href
      FROM clinical_finance_claims
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND status IN ('DRAFT','PENDING')
        AND COALESCE(is_deleted, false) = false
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        'Queue' AS category,
        a.id,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS title,
        CONCAT('Token ', COALESCE(a.token_number::text, '-'), ' is ', COALESCE(a.queue_status, '-')) AS summary,
        '/clinical-services/appointments' AS href
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND a.queue_status IN ('WAITING','CHECKED_IN')
        AND COALESCE(a.is_deleted, false) = false
      ORDER BY a.created_at ASC
      LIMIT 6
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        'Appointment' AS category,
        id,
        appointment_uid AS title,
        CONCAT(COALESCE(status, '-'), ' on ', appointment_date::text) AS summary,
        '/clinical-services/appointments' AS href
      FROM appointments
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND appointment_date >= CURRENT_DATE
        AND COALESCE(is_deleted, false) = false
      ORDER BY appointment_date ASC, start_time ASC NULLS LAST
      LIMIT 6
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  const licensedModules =
    context.licensedModules || [];
  const canShowHref = (href: string) =>
    isModuleLicensed(
      moduleCodeForClinicalPath(href),
      licensedModules
    );
  const rawMetrics = metrics[0] || {};
  const filteredMetrics = {
    ...rawMetrics,
    lab_orders_pending: canShowHref(
      "/clinical-services/laboratory"
    )
      ? rawMetrics.lab_orders_pending
      : undefined,
    revenue_today: canShowHref(
      "/clinical-services/hms/billing"
    )
      ? rawMetrics.revenue_today
      : undefined,
    revenue_this_month: canShowHref(
      "/clinical-services/finance/cash"
    )
      ? rawMetrics.revenue_this_month
      : undefined,
    ivf_cycles_active: canShowHref(
      "/clinical-services/ivf/cycles"
    )
      ? rawMetrics.ivf_cycles_active
      : undefined,
  };
  const hrefFiltered = (rows: Row[]) =>
    rows.filter((row) =>
      canShowHref(String(row.href || ""))
    );

  return NextResponse.json({
    context,
    metrics: filteredMetrics,
    appointments,
    waiting,
    recentPatients,
    revenueBreakdown:
      hrefFiltered(revenueBreakdown),
    departmentPerformance,
    pendingTasks: hrefFiltered(pendingTasks),
    alerts: hrefFiltered(alerts),
    notifications:
      hrefFiltered(notifications),
    aiInsight: {
      confidenceScore: 82,
      summary:
        "Clinical dashboard is grounded in patient, appointment, doctor, lab, IVF, finance, and queue records for the selected clinic.",
      dataSourcesUsed: [
        "appointments",
        "patients",
        "doctors",
        "lab_orders",
        "ivf_cycles",
        "billing_invoices",
        "clinical_finance_ar_invoices",
      ],
    },
  });
}
