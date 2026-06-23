import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { serialize } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  const [
    summaryRows,
    dailyRows,
    workflowRows,
    pharmacyRows,
    labRows,
    roomRows,
    appointmentRows,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN payment_type = 'CONSULTATION_FEE' THEN amount ELSE 0 END),0) AS op_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'IP_PAYMENT' THEN amount ELSE 0 END),0) AS ip_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'OT_PAYMENT' THEN amount ELSE 0 END),0) AS ot_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'LAB_PAYMENT' THEN amount ELSE 0 END),0) AS lab_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'PHARMACY_PAYMENT' THEN amount ELSE 0 END),0) AS pharmacy_revenue,
        COALESCE(SUM(amount),0) AS total_revenue,
        COUNT(*)::int AS payment_count
      FROM clinical_operational_payments
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT payment_date, payment_type, COALESCE(SUM(amount),0) AS amount
      FROM clinical_operational_payments
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      GROUP BY payment_date, payment_type
      ORDER BY payment_date DESC
      LIMIT 120
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT workflow_stage, status, COUNT(*)::int AS count
      FROM clinical_patient_workflow_events
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      GROUP BY workflow_stage, status
      ORDER BY count DESC
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COALESCE(SUM(d.quantity * COALESCE(m.selling_price,0)),0) AS pharmacy_dispense_value,
        COALESCE(SUM(d.quantity),0) AS medicine_units_dispensed,
        COUNT(*)::int AS dispense_count
      FROM clinical_pharmacy_dispenses d
      LEFT JOIN clinical_medicine_master m
        ON lower(m.medicine_name) = lower(d.medicine_name)
       AND m.tenant_id = d.tenant_id
       AND m.hospital_id = d.hospital_id
       AND m.branch_id = d.branch_id
       AND COALESCE(m.is_deleted,false) = false
      WHERE d.tenant_id = $1 AND d.hospital_id = $2 AND d.branch_id = $3
        AND COALESCE(d.is_deleted,false) = false
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COUNT(*)::int AS lab_order_count,
        COUNT(*) FILTER (WHERE status = 'RESULT_READY')::int AS lab_results_ready,
        COUNT(*) FILTER (WHERE status = 'SAMPLE_COLLECTED')::int AS samples_collected,
        COUNT(*) FILTER (WHERE status = 'BILL_PAID')::int AS lab_bills_paid
      FROM lab_orders
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COUNT(*)::int AS rooms_total,
        COUNT(*) FILTER (WHERE status = 'OCCUPIED')::int AS rooms_occupied,
        COUNT(*) FILTER (WHERE status = 'AVAILABLE')::int AS rooms_available,
        COALESCE(SUM(room_rent) FILTER (WHERE status = 'OCCUPIED'),0) AS active_room_rent
      FROM clinical_room_master
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        COUNT(*)::int AS appointment_count,
        COUNT(*) FILTER (WHERE status = 'READY_FOR_CONSULTATION')::int AS ready_for_consultation,
        COUNT(*) FILTER (WHERE status = 'IN_CONSULTATION')::int AS in_consultation,
        COUNT(*) FILTER (WHERE status IN ('CHECKED_OUT','COMPLETED'))::int AS completed_consultations
      FROM appointments
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  const summary = summaryRows[0] || {};
  const pharmacy = pharmacyRows[0] || {};
  const lab = labRows[0] || {};
  const rooms = roomRows[0] || {};
  const appointments = appointmentRows[0] || {};
  const totalRevenue = Number(summary.total_revenue || 0);
  const pharmacyBurnRate = Number(pharmacy.pharmacy_dispense_value || 0);
  return NextResponse.json(
    serialize({
      summary: {
        ...summary,
        ...pharmacy,
        ...lab,
        ...rooms,
        ...appointments,
        referral_commission: 0,
        doctor_revenue: summary.op_revenue || 0,
        department_revenue: summary.total_revenue || 0,
        salary_expense: 0,
        administrative_expense: 0,
        medicine_burn_rate: pharmacyBurnRate,
        lab_cost: 0,
        ot_cost: 0,
        current_bills: totalRevenue,
        profit: totalRevenue - pharmacyBurnRate,
        cash_flow: totalRevenue,
      },
      daily: dailyRows,
      workflow: workflowRows,
    })
  );
}
