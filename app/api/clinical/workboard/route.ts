import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type WorkItem = {
  id: string;
  title: string;
  summary: string;
  status: string;
  priority: string;
  href: string;
  entityType: string;
  entityId?: number | null;
  dueAt?: string | null;
};

const text = (value: unknown, fallback = "") =>
  String(value ?? fallback).trim() || fallback;

const optionalText = (value: unknown) => {
  const result = String(value ?? "").trim();
  return result || null;
};

const num = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

async function rows(
  sql: string,
  ...params: unknown[]
) {
  try {
    return await prisma.$queryRawUnsafe<Row[]>(
      sql,
      ...params
    );
  } catch (error) {
    console.error(
      "[clinical-workboard] query failed",
      error
    );
    return [];
  }
}

async function count(
  sql: string,
  ...params: unknown[]
) {
  const result = await rows(sql, ...params);
  return num(result[0]?.value);
}

const item = (
  prefix: string,
  row: Row,
  input: Omit<WorkItem, "id">
): WorkItem => ({
  id: `${prefix}-${text(row.id, "0")}`,
  ...input,
});

const lower = (value: string) =>
  value.toLowerCase();

function resolveBoardKey(roleKey: string) {
  const role = lower(roleKey);

  if (
    role.includes("doctor") ||
    role.includes("consultant")
  ) {
    return "doctor";
  }

  if (
    role.includes("nurse") ||
    role.includes("ward")
  ) {
    return "nursing";
  }

  if (role.includes("lab")) {
    return "lab";
  }

  if (role.includes("pharma")) {
    return "pharmacy";
  }

  if (
    role.includes("bill") ||
    role.includes("finance") ||
    role.includes("cash")
  ) {
    return "billing";
  }

  if (
    role.includes("reception") ||
    role.includes("front")
  ) {
    return "front_desk";
  }

  return "administration";
}

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const scoped = [
    context.tenantId,
    context.hospitalId,
    context.branchId,
  ];

  const [
    appointmentsToday,
    waitingQueue,
    registeredToday,
    activeAdmissions,
    pendingDischarges,
    pendingLabOrders,
    labResultsToReview,
    pendingRadiology,
    pendingPharmacy,
    lowStock,
    unpaidInvoices,
    pendingClaims,
    todayRevenue,
    recentAudit,
  ] = await Promise.all([
    rows(
      `
      SELECT a.id, a.appointment_uid, a.appointment_date, a.start_time, a.status, a.queue_status,
        a.priority, a.token_number,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name,
        d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.tenant_id = $1 AND a.hospital_id = $2 AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND COALESCE(a.is_deleted,false) = false
      ORDER BY a.start_time ASC NULLS LAST, a.id DESC
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT a.id, a.queue_status, a.priority, a.token_number, a.created_at,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1 AND a.hospital_id = $2 AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND a.queue_status IN ('WAITING','CHECKED_IN','IN_CONSULTATION')
        AND COALESCE(a.is_deleted,false) = false
      ORDER BY a.created_at ASC
      LIMIT 12
      `,
      ...scoped
    ),
    count(
      `
      SELECT COUNT(*)::int AS value
      FROM patients
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND created_at::date = CURRENT_DATE
        AND COALESCE(is_deleted,false) = false
      `,
      ...scoped
    ),
    rows(
      `
      SELECT ia.id, ia.admission_number, ia.admission_date, ia.expected_discharge, ia.status,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM ip_admissions ia
      LEFT JOIN patients p ON p.id = ia.patient_id
      WHERE ia.tenant_id = $1 AND ia.hospital_id = $2 AND ia.branch_id = $3
        AND ia.status IN ('ADMITTED','ACTIVE','OBSERVATION')
        AND COALESCE(ia.is_deleted,false) = false
      ORDER BY ia.admission_date DESC
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT ia.id, ia.admission_number, ia.expected_discharge, ia.status,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM ip_admissions ia
      LEFT JOIN patients p ON p.id = ia.patient_id
      WHERE ia.tenant_id = $1 AND ia.hospital_id = $2 AND ia.branch_id = $3
        AND (
          ia.status IN ('DISCHARGE_REQUESTED','PENDING_DISCHARGE')
          OR ia.expected_discharge <= CURRENT_DATE
        )
        AND COALESCE(ia.is_deleted,false) = false
      ORDER BY ia.expected_discharge ASC NULLS LAST
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT lo.id, lo.order_uid, lo.order_type, lo.priority, lo.status, lo.ordered_at,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM lab_orders lo
      LEFT JOIN patients p ON p.id = lo.patient_id
      WHERE lo.tenant_id = $1 AND lo.hospital_id = $2 AND lo.branch_id = $3
        AND lo.status IN ('ORDERED','PENDING','SAMPLE_COLLECTED','PROCESSING')
        AND COALESCE(lo.is_deleted,false) = false
      ORDER BY lo.ordered_at ASC NULLS LAST
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT lr.id, lr.result_uid, lr.result_status, lr.validated_at, lr.created_at,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM lab_results lr
      LEFT JOIN patients p ON p.id = lr.patient_id
      WHERE lr.tenant_id = $1 AND lr.hospital_id = $2 AND lr.branch_id = $3
        AND COALESCE(lr.result_status,'') IN ('COMPLETED','PENDING_REVIEW','PENDING_VERIFICATION')
        AND COALESCE(lr.is_deleted,false) = false
      ORDER BY lr.created_at ASC
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT ro.id, ro.order_number, ro.study_type, ro.priority, ro.order_status, ro.order_date,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM radiology_orders ro
      LEFT JOIN patients p ON p.id = ro.patient_id
      WHERE ro.tenant_id = $1 AND ro.hospital_id = $2 AND ro.branch_id = $3
        AND ro.order_status IN ('ORDERED','PENDING','SCHEDULED','IN_PROGRESS')
        AND COALESCE(ro.is_deleted,false) = false
      ORDER BY ro.order_date ASC NULLS LAST
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT ppq.id, ppq.queue_number, ppq.prescription_uid, ppq.patient_name,
        ppq.patient_mobile, ppq.status, ppq.created_at
      FROM pharmacy_prescription_queue ppq
      WHERE ppq.tenant_id = $1 AND ppq.hospital_id = $2 AND ppq.branch_id = $3
        AND ppq.status IN ('PENDING','READY','PARTIAL')
        AND COALESCE(ppq.is_deleted,false) = false
      ORDER BY ppq.created_at ASC
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT pi.id, pi.available_quantity, pi.inventory_status, pi.expiry_date,
        pi.medicine_id, pi.warehouse_id
      FROM pharmacy_inventory pi
      WHERE pi.tenant_id = $1 AND pi.hospital_id = $2 AND pi.branch_id = $3
        AND (
          COALESCE(pi.available_quantity,0) <= 5
          OR pi.inventory_status IN ('LOW_STOCK','OUT_OF_STOCK','NEAR_EXPIRY')
          OR pi.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
        )
        AND COALESCE(pi.is_deleted,false) = false
      ORDER BY pi.expiry_date ASC NULLS LAST, pi.available_quantity ASC
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT bi.id, bi.invoice_number, bi.total, bi.paid_amount, bi.balance_amount, bi.status, bi.invoice_date,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM billing_invoices bi
      LEFT JOIN patients p ON p.id = bi.patient_id
      WHERE bi.tenant_id = $1 AND bi.hospital_id = $2 AND bi.branch_id = $3
        AND COALESCE(bi.balance_amount,0) > 0
        AND COALESCE(bi.is_deleted,false) = false
      ORDER BY bi.invoice_date ASC NULLS LAST
      LIMIT 12
      `,
      ...scoped
    ),
    rows(
      `
      SELECT cfc.id, cfc.claim_number, cfc.claim_amount, cfc.approved_amount, cfc.status, cfc.submitted_date,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM clinical_finance_claims cfc
      LEFT JOIN patients p ON p.id = cfc.patient_id
      WHERE cfc.tenant_id = $1 AND cfc.hospital_id = $2 AND cfc.branch_id = $3
        AND cfc.status IN ('DRAFT','PENDING','SUBMITTED','QUERY')
        AND COALESCE(cfc.is_deleted,false) = false
      ORDER BY cfc.submitted_date ASC NULLS LAST, cfc.created_at ASC
      LIMIT 12
      `,
      ...scoped
    ),
    count(
      `
      SELECT COALESCE(SUM(COALESCE(total,0)),0)::numeric AS value
      FROM billing_invoices
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND invoice_date = CURRENT_DATE
        AND COALESCE(is_deleted,false) = false
      `,
      ...scoped
    ),
    rows(
      `
      SELECT id, module_name, action, entity_type, entity_id, summary, created_at
      FROM clinical_audit_events
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC
      LIMIT 14
      `,
      ...scoped
    ),
  ]);

  const frontDeskTasks: WorkItem[] = [
    ...waitingQueue.map((row) =>
      item("queue", row, {
        title: text(row.patient_name, "Waiting patient"),
        summary: `Token ${text(row.token_number, "-")} is ${text(row.queue_status, "waiting")}`,
        status: text(row.queue_status, "WAITING"),
        priority: text(row.priority, "NORMAL"),
        href: "/clinical-services/appointments",
        entityType: "appointment",
        entityId: num(row.id),
        dueAt: optionalText(row.created_at),
      })
    ),
    ...pendingDischarges.map((row) =>
      item("discharge", row, {
        title: `Discharge: ${text(row.patient_name, "Patient")}`,
        summary: `Admission ${text(row.admission_number, "-")} is ${text(row.status, "pending")}`,
        status: text(row.status, "PENDING"),
        priority: "HIGH",
        href: `/clinical-services/hms/ip/${row.id}`,
        entityType: "ip_admission",
        entityId: num(row.id),
        dueAt: optionalText(row.expected_discharge),
      })
    ),
  ];

  const doctorTasks: WorkItem[] = [
    ...appointmentsToday.map((row) =>
      item("doctor-appointment", row, {
        title: text(row.patient_name, "Patient appointment"),
        summary: `${text(row.appointment_uid, "Appointment")} with ${text(row.doctor_name, "doctor")} at ${text(row.start_time, "-")}`,
        status: text(row.status, "SCHEDULED"),
        priority: text(row.priority, "NORMAL"),
        href: "/clinical-services/hms/op",
        entityType: "appointment",
        entityId: num(row.id),
        dueAt: optionalText(row.appointment_date),
      })
    ),
    ...labResultsToReview.map((row) =>
      item("lab-review", row, {
        title: `Review lab result ${text(row.result_uid, "")}`,
        summary: `${text(row.patient_name, "Patient")} result requires clinical review`,
        status: text(row.result_status, "PENDING_REVIEW"),
        priority: "HIGH",
        href: "/clinical-services/hms/lab-results",
        entityType: "lab_result",
        entityId: num(row.id),
        dueAt: optionalText(row.created_at),
      })
    ),
  ];

  const nursingTasks: WorkItem[] = activeAdmissions.map((row) =>
    item("nursing-admission", row, {
      title: text(row.patient_name, "Admitted patient"),
      summary: `Admission ${text(row.admission_number, "-")} needs vitals, medication and shift notes`,
      status: text(row.status, "ADMITTED"),
      priority: "HIGH",
      href: `/clinical-services/hms/ip/${row.id}`,
      entityType: "ip_admission",
      entityId: num(row.id),
      dueAt: optionalText(row.expected_discharge),
    })
  );

  const labTasks: WorkItem[] = pendingLabOrders.map((row) =>
    item("lab-order", row, {
      title: text(row.order_uid, "Lab order"),
      summary: `${text(row.order_type, "Investigation")} for ${text(row.patient_name, "patient")}`,
      status: text(row.status, "PENDING"),
      priority: text(row.priority, "NORMAL"),
      href: "/clinical-services/hms/lab-orders",
      entityType: "lab_order",
      entityId: num(row.id),
      dueAt: optionalText(row.ordered_at),
    })
  );

  const pharmacyTasks: WorkItem[] = [
    ...pendingPharmacy.map((row) =>
      item("pharmacy-rx", row, {
        title: text(row.queue_number, "Prescription queue"),
        summary: `${text(row.patient_name, "Patient")} | ${text(row.prescription_uid, "Prescription")}`,
        status: text(row.status, "PENDING"),
        priority: "HIGH",
        href: "/clinical-services/pharmacy/sales",
        entityType: "pharmacy_queue",
        entityId: num(row.id),
        dueAt: optionalText(row.created_at),
      })
    ),
    ...lowStock.map((row) =>
      item("stock", row, {
        title: `Inventory alert #${text(row.id)}`,
        summary: `Available ${text(row.available_quantity, "0")} | ${text(row.inventory_status, "stock review")}`,
        status: text(row.inventory_status, "LOW_STOCK"),
        priority: "HIGH",
        href: "/clinical-services/pharmacy/inventory",
        entityType: "pharmacy_inventory",
        entityId: num(row.id),
        dueAt: optionalText(row.expiry_date),
      })
    ),
  ];

  const billingTasks: WorkItem[] = [
    ...unpaidInvoices.map((row) =>
      item("invoice", row, {
        title: text(row.invoice_number, "Unpaid invoice"),
        summary: `${text(row.patient_name, "Patient")} balance ${text(row.balance_amount, "0")}`,
        status: text(row.status, "PENDING"),
        priority: "HIGH",
        href: "/clinical-services/hms/billing",
        entityType: "billing_invoice",
        entityId: num(row.id),
        dueAt: optionalText(row.invoice_date),
      })
    ),
    ...pendingClaims.map((row) =>
      item("claim", row, {
        title: text(row.claim_number, "Insurance claim"),
        summary: `${text(row.patient_name, "Patient")} claim ${text(row.claim_amount, "0")}`,
        status: text(row.status, "PENDING"),
        priority: "HIGH",
        href: "/clinical-services/finance/claims",
        entityType: "finance_claim",
        entityId: num(row.id),
        dueAt: optionalText(row.submitted_date),
      })
    ),
  ];

  const administrationTasks: WorkItem[] = [
    ...frontDeskTasks.slice(0, 4),
    ...doctorTasks.slice(0, 4),
    ...labTasks.slice(0, 4),
    ...billingTasks.slice(0, 4),
  ];

  const workboards = {
    front_desk: {
      title: "Front Desk Workboard",
      question: "Which arrivals, registrations, admissions and billing handoffs need attention?",
      href: "/clinical-services/appointments",
      tasks: frontDeskTasks,
      quickActions: [
        { label: "Register Patient", href: "/clinical-services/patients" },
        { label: "Book Appointment", href: "/clinical-services/appointments" },
        { label: "Open Queue", href: "/clinical-services/appointments" },
      ],
    },
    doctor: {
      title: "Doctor Workboard",
      question: "Which patients should I consult, review or discharge next?",
      href: "/clinical-services/hms/op",
      tasks: doctorTasks,
      quickActions: [
        { label: "Start OP Consultation", href: "/clinical-services/hms/op" },
        { label: "Review Lab Results", href: "/clinical-services/hms/lab-results" },
        { label: "Open Patient Search", href: "/clinical-services/patients" },
      ],
    },
    nursing: {
      title: "Nursing Workboard",
      question: "Which admitted patients need vitals, medication or care-plan actions?",
      href: "/clinical-services/hms/ip",
      tasks: nursingTasks,
      quickActions: [
        { label: "Open IP Admissions", href: "/clinical-services/hms/ip" },
        { label: "Open ICU", href: "/clinical-services/hms/icu" },
        { label: "Patient Search", href: "/clinical-services/patients" },
      ],
    },
    lab: {
      title: "Laboratory Workboard",
      question: "Which samples, orders and reports are blocking clinical decisions?",
      href: "/clinical-services/hms/lab-orders",
      tasks: labTasks,
      quickActions: [
        { label: "Pending Lab Orders", href: "/clinical-services/hms/lab-orders" },
        { label: "Lab Results", href: "/clinical-services/hms/lab-results" },
        { label: "Reports", href: "/clinical-services/reports" },
      ],
    },
    pharmacy: {
      title: "Pharmacy Workboard",
      question: "Which prescriptions, low-stock items and expiry risks need action?",
      href: "/clinical-services/pharmacy",
      tasks: pharmacyTasks,
      quickActions: [
        { label: "Dispense Prescription", href: "/clinical-services/pharmacy/sales" },
        { label: "Inventory", href: "/clinical-services/pharmacy/inventory" },
        { label: "Purchases", href: "/clinical-services/pharmacy/purchases" },
      ],
    },
    billing: {
      title: "Billing Workboard",
      question: "Which bills, collections and insurance claims are holding revenue?",
      href: "/clinical-services/hms/billing",
      tasks: billingTasks,
      quickActions: [
        { label: "Create Invoice", href: "/clinical-services/hms/billing" },
        { label: "Post Payment", href: "/clinical-services/finance/cash" },
        { label: "Claims", href: "/clinical-services/finance/claims" },
      ],
    },
    administration: {
      title: "Hospital Operations Workboard",
      question: "What needs attention across patient access, clinical care and revenue?",
      href: "/clinical-services",
      tasks: administrationTasks,
      quickActions: [
        { label: "Register Patient", href: "/clinical-services/patients" },
        { label: "Book Appointment", href: "/clinical-services/appointments" },
        { label: "Create Invoice", href: "/clinical-services/hms/billing" },
        { label: "Reports", href: "/clinical-services/reports" },
      ],
    },
  };

  const boardKey = resolveBoardKey(context.roleKey);
  const roleWorkboard =
    workboards[
      boardKey as keyof typeof workboards
    ] || workboards.administration;

  return NextResponse.json({
    context: {
      tenantId: context.tenantId,
      hospitalId: context.hospitalId,
      branchId: context.branchId,
      clinicId: context.clinicId,
      hospitalName: context.hospitalName,
      branchName: context.branchName,
      clinicName: context.clinicName,
      roleKey: context.roleKey,
      roleName: context.roleName,
    },
    metrics: {
      appointmentsToday: appointmentsToday.length,
      waitingQueue: waitingQueue.length,
      registeredToday,
      activeAdmissions: activeAdmissions.length,
      pendingDischarges: pendingDischarges.length,
      pendingLabOrders: pendingLabOrders.length,
      labResultsToReview: labResultsToReview.length,
      pendingRadiology: pendingRadiology.length,
      pendingPharmacy: pendingPharmacy.length,
      lowStock: lowStock.length,
      unpaidInvoices: unpaidInvoices.length,
      pendingClaims: pendingClaims.length,
      todayRevenue,
    },
    roleWorkboard,
    workboards,
    activityFeed: recentAudit.map((row) => ({
      id: row.id,
      title: text(row.summary, text(row.action, "Audit event")),
      summary: `${text(row.module_name, "Clinical")} | ${text(row.entity_type, "record")} ${text(row.entity_id, "")}`,
      action: row.action,
      moduleName: row.module_name,
      entityType: row.entity_type,
      entityId: row.entity_id,
      createdAt: row.created_at,
      href:
        row.entity_type === "patient" && row.entity_id
          ? `/clinical-services/patients/${row.entity_id}`
          : "/clinical-services/security/audit-logs",
    })),
  });
}
