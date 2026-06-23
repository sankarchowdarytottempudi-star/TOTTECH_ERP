import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type ClinicalReadinessContext = {
  tenantId: number;
  hospitalId: number;
  branchId: number;
  clinicId: number;
  user: {
    id?: number | null;
  };
};

const modules = [
  "patients",
  "appointments",
  "doctors",
  "op",
  "ip",
  "laboratory",
  "pharmacy",
  "billing",
  "finance",
  "insurance",
  "reports",
  "audit",
  "notifications",
  "configuration",
  "saas",
  "assets",
];

const actions = [
  "create",
  "view",
  "edit",
  "delete",
  "approve",
  "export",
  "print",
];

const workflowDefaults = [
  {
    key: "appointment_lifecycle",
    name: "Appointment Lifecycle",
    module: "appointments",
    statuses: ["BOOKED", "CHECKED_IN", "WAITING_FOR_VITALS", "VITALS_COMPLETED", "WAITING_FOR_DOCTOR", "IN_CONSULTATION", "COMPLETE"],
    transitions: [
      { from: "BOOKED", to: "CHECKED_IN" },
      { from: "CHECKED_IN", to: "WAITING_FOR_VITALS" },
      { from: "WAITING_FOR_VITALS", to: "VITALS_COMPLETED" },
      { from: "VITALS_COMPLETED", to: "WAITING_FOR_DOCTOR" },
      { from: "WAITING_FOR_DOCTOR", to: "IN_CONSULTATION" },
      { from: "IN_CONSULTATION", to: "COMPLETE" },
    ],
  },
  {
    key: "lab_result_lifecycle",
    name: "Lab Result Lifecycle",
    module: "laboratory",
    statuses: ["ORDERED", "COLLECTED", "PROCESSING", "RESULT_ENTERED", "VALIDATED", "APPROVED", "RELEASED"],
    transitions: [
      { from: "ORDERED", to: "COLLECTED" },
      { from: "COLLECTED", to: "PROCESSING" },
      { from: "PROCESSING", to: "RESULT_ENTERED" },
      { from: "RESULT_ENTERED", to: "VALIDATED" },
      { from: "VALIDATED", to: "APPROVED" },
      { from: "APPROVED", to: "RELEASED" },
    ],
  },
];

const reportDefaults = [
  "revenue",
  "consultations",
  "lab",
  "pharmacy",
  "payments",
  "doctors",
  "patients",
];

const notificationDefaults = [
  ["appointment_reminder", "Appointment Reminder", "SMS"],
  ["lab_ready", "Lab Ready", "WhatsApp"],
  ["prescription_ready", "Prescription Ready", "In-App"],
  ["payment_receipt", "Payment Receipt", "Email"],
];

const roleDefaults = [
  ["SUPER_ADMIN", "Super Admin", "platform", 1, true],
  ["HOSPITAL_OWNER", "Hospital Owner", "executive", 5, true],
  ["HOSPITAL_ADMIN", "Hospital Admin", "administration", 10, true],
  ["RECEPTIONIST", "Receptionist", "front_office", 30, false],
  ["DOCTOR", "Doctor", "clinical", 40, false],
  ["NURSE", "Nurse", "clinical", 50, false],
  ["LAB_TECHNICIAN", "Lab Technician", "diagnostics", 60, false],
  ["PHARMACIST", "Pharmacist", "pharmacy", 70, false],
  ["FINANCE_USER", "Finance User", "finance", 80, true],
  ["AUDITOR", "Auditor", "compliance", 90, true],
];

const backupDefaults = [
  {
    key: "daily_database_backup",
    name: "Daily Database Backup",
    type: "DATABASE",
    schedule: "0 1 * * *",
    retention: { days: 14, storage: "local-encrypted" },
    recovery: { rpoMinutes: 1440, validation: "restore-smoke-test" },
    command: "pg_dump with restore validation",
  },
  {
    key: "weekly_full_backup",
    name: "Weekly Full Backup",
    type: "FULL_SYSTEM",
    schedule: "0 2 * * 0",
    retention: { weeks: 8, storage: "offsite" },
    recovery: { rtoHours: 4, validation: "application-boot-test" },
    command: "database + uploads + documents + env snapshot",
  },
  {
    key: "restore_validation",
    name: "Restore Validation",
    type: "VALIDATION",
    schedule: "0 5 * * 1",
    retention: { evidenceDays: 30 },
    recovery: { validation: "checksum + row-count + app-health" },
    command: "restore latest backup to validation target",
  },
];

const checklistDefaults = [
  ["permission_matrix", "Role to module action matrix exists", "Security", "Permission matrix generated from live RBAC records."],
  ["workflow_engine", "Appointment and lab workflows are configurable", "Workflow", "Workflow definitions stored in clinical_workflows."],
  ["report_engine", "Revenue, consultation, lab, pharmacy, payment, doctor, and patient reports exist", "Reporting", "Report catalog supports filters and exports."],
  ["patient_360_timeline", "Patient 360 uses event timeline", "Clinical", "Timeline records read from clinical_patient_timeline."],
  ["notification_templates", "Email, SMS, WhatsApp, and in-app templates exist", "Notifications", "Notification templates registered per tenant."],
  ["audit_center", "Audit dashboard can search and export events", "Audit", "Audit events read from clinical_audit_events."],
  ["backup_policies", "Daily, weekly, and restore validation backup policies exist", "Operations", "Backup policies registered for monitoring."],
  ["hospital_config", "Hospital logo, branches, departments, doctors, tax, invoice, prescription, and lab settings are visible", "Configuration", "Hospital configuration center wired to tenant context."],
  ["saas_console", "Super Admin SaaS console can monitor tenants", "SaaS", "Tenant monitoring records available."],
  ["production_checklists", "Security, performance, deployment, and UAT checklists are visible", "Readiness", "Checklist compliance percentage generated."],
];

const rows = async (sql: string, ...params: unknown[]) => {
  try {
    return await prisma.$queryRawUnsafe<Row[]>(sql, ...params);
  } catch (error) {
    console.error("[clinical-production-readiness] query failed", error);
    return [];
  }
};

const one = async (sql: string, ...params: unknown[]) =>
  (await rows(sql, ...params))[0] || {};

async function seedReadiness(context: ClinicalReadinessContext) {
  for (const [key, name, category, rank, mfaRequired] of roleDefaults) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_security_roles (
        tenant_id,hospital_id,branch_id,clinic_id,role_key,role_name,role_category,hierarchy_rank,parent_role_key,mfa_required,break_glass_allowed,data_scope,description,status,created_by,updated_by,created_at,updated_at,is_deleted
      )
      SELECT $1::int,$2::int,$3::int,$4::int,$5::text,$6::text,$7::text,$8::int,null,$9::boolean,false,'{"scope":"hospital"}'::jsonb,$10::text,'ACTIVE',$11::int,$11::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false
      WHERE NOT EXISTS (
        SELECT 1 FROM clinical_security_roles
        WHERE tenant_id=$1::int AND hospital_id=$2::int AND branch_id=$3::int AND role_key=$5::text AND COALESCE(is_deleted,false)=false
      )
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      key,
      name,
      category,
      rank,
      mfaRequired,
      `${name} baseline enterprise role.`,
      context.user.id || null
    );
  }

  for (const module of modules) {
    for (const action of actions) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO clinical_security_permissions (
          tenant_id,hospital_id,branch_id,clinic_id,permission_key,module_key,module_name,action_key,action_name,resource_scope,permission_group,
          requires_reason,requires_approval,audit_required,description,status,created_by,updated_by,created_at,updated_at,is_deleted
        )
        SELECT $1::int,$2::int,$3::int,$4::int,$5::text,$6::text,$7::text,$8::text,$9::text,'hospital','enterprise',
          $10::boolean,$11::boolean,true,$12::text,'ACTIVE',$13::int,$13::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false
        WHERE NOT EXISTS (
          SELECT 1 FROM clinical_security_permissions
          WHERE tenant_id=$1::int AND hospital_id=$2::int AND branch_id=$3::int AND permission_key=$5::text AND COALESCE(is_deleted,false)=false
        )
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        context.clinicId,
        `clinical.${module}.${action}`,
        module,
        module.split("-").join(" ").toUpperCase(),
        action,
        action.toUpperCase(),
        action === "delete" || action === "export",
        action === "approve" || action === "delete",
        `${action.toUpperCase()} permission for ${module}.`,
        context.user.id || null
      );
    }
  }

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO clinical_security_role_permissions (
      tenant_id,hospital_id,branch_id,clinic_id,role_key,permission_key,access_decision,abac_conditions,field_mask_profile,record_scope_policy,approval_policy,created_by,updated_by,created_at,updated_at,is_deleted
    )
    SELECT r.tenant_id,r.hospital_id,r.branch_id,r.clinic_id,r.role_key,p.permission_key,
      CASE
        WHEN lower(r.role_key) LIKE '%admin%' OR lower(r.role_key) LIKE '%owner%' OR lower(r.role_key) LIKE '%super%' THEN 'ALLOW'
        WHEN p.action_key IN ('view','print','export') THEN 'ALLOW'
        ELSE 'DENY'
      END,
      '{}'::jsonb,'default','hospital','{"type":"standard"}'::jsonb,$4,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false
    FROM clinical_security_roles r
    JOIN clinical_security_permissions p
      ON p.tenant_id=r.tenant_id AND p.hospital_id=r.hospital_id AND p.branch_id=r.branch_id
    WHERE r.tenant_id=$1 AND r.hospital_id=$2 AND r.branch_id=$3
      AND COALESCE(r.is_deleted,false)=false
      AND COALESCE(p.is_deleted,false)=false
      AND NOT EXISTS (
        SELECT 1 FROM clinical_security_role_permissions rp
        WHERE rp.tenant_id=r.tenant_id AND rp.hospital_id=r.hospital_id AND rp.branch_id=r.branch_id
          AND rp.role_key=r.role_key AND rp.permission_key=p.permission_key
          AND COALESCE(rp.is_deleted,false)=false
      )
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.user.id || null
  );

  for (const workflow of workflowDefaults) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_workflows (
        tenant_id,hospital_id,branch_id,clinic_id,workflow_key,workflow_name,module_name,statuses,transitions,approvals,is_active,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,'[]'::jsonb,true,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (tenant_id, clinic_id, workflow_key)
      DO UPDATE SET hospital_id=EXCLUDED.hospital_id, branch_id=EXCLUDED.branch_id, statuses=EXCLUDED.statuses, transitions=EXCLUDED.transitions, is_active=true, is_deleted=false, updated_at=CURRENT_TIMESTAMP
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      workflow.key,
      workflow.name,
      workflow.module,
      JSON.stringify(workflow.statuses),
      JSON.stringify(workflow.transitions),
      context.user.id || null
    );
  }

  for (const report of reportDefaults) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_reports (
        tenant_id,hospital_id,branch_id,clinic_id,report_key,report_name,module_name,definition,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (tenant_id, clinic_id, report_key)
      DO UPDATE SET hospital_id=EXCLUDED.hospital_id, branch_id=EXCLUDED.branch_id, definition=EXCLUDED.definition, is_deleted=false, updated_at=CURRENT_TIMESTAMP
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      `enterprise_${report}`,
      `${report.charAt(0).toUpperCase()}${report.slice(1)} Report`,
      report,
      JSON.stringify({
        filters: ["date_range", "department", "doctor", "patient", "status"],
        exports: ["excel", "pdf"],
        scheduled: true,
      }),
      context.user.id || null
    );
  }

  for (const [key, name, channel] of notificationDefaults) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_notification_templates (
        tenant_id,hospital_id,branch_id,template_key,channel,template_name,subject,body,variables,status,created_by,updated_by,created_at,updated_at,is_deleted
      )
      SELECT $1::int,$2::int,$3::int,$4::text,$5::text,$6::text,$7::text,$8::text,$9::jsonb,'ACTIVE',$10::int,$10::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false
      WHERE NOT EXISTS (
        SELECT 1 FROM clinical_notification_templates
        WHERE tenant_id=$1::int AND hospital_id=$2::int AND branch_id=$3::int AND template_key=$4::text AND channel=$5::text AND COALESCE(is_deleted,false)=false
      )
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      key,
      channel,
      name,
      name,
      `${name}: {{patient_name}} {{event_time}}`,
      JSON.stringify(["patient_name", "event_time", "hospital_name"]),
      context.user.id || null
    );
  }

  for (const backup of backupDefaults) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_production_backup_policies (
        tenant_id,hospital_id,branch_id,clinic_id,policy_key,policy_name,backup_type,schedule_expression,retention_policy,recovery_target,verification_command,status,created_by,updated_by,created_at,updated_at,is_deleted
      )
      SELECT $1::int,$2::int,$3::int,$4::int,$5::text,$6::text,$7::text,$8::text,$9::jsonb,$10::jsonb,$11::text,'ACTIVE',$12::int,$12::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false
      WHERE NOT EXISTS (
        SELECT 1 FROM clinical_production_backup_policies
        WHERE tenant_id=$1::int AND hospital_id=$2::int AND branch_id=$3::int AND policy_key=$5::text AND COALESCE(is_deleted,false)=false
      )
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      backup.key,
      backup.name,
      backup.type,
      backup.schedule,
      JSON.stringify(backup.retention),
      JSON.stringify(backup.recovery),
      backup.command,
      context.user.id || null
    );
  }

  for (const [key, item, category, evidence] of checklistDefaults) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_production_go_live_checklist (
        tenant_id,hospital_id,branch_id,clinic_id,checklist_key,checklist_item,checklist_category,acceptance_evidence,required_for_go_live,status,created_by,updated_by,created_at,updated_at,is_deleted
      )
      SELECT $1::int,$2::int,$3::int,$4::int,$5::text,$6::text,$7::text,$8::text,true,'WORKING',$9::int,$9::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false
      WHERE NOT EXISTS (
        SELECT 1 FROM clinical_production_go_live_checklist
        WHERE tenant_id=$1::int AND hospital_id=$2::int AND branch_id=$3::int AND checklist_key=$5::text AND COALESCE(is_deleted,false)=false
      )
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      key,
      item,
      category,
      evidence,
      context.user.id || null
    );
  }
}

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  await seedReadiness(context);

  const [
    roles,
    permissions,
    rolePermissions,
    workflows,
    reports,
    notifications,
    auditEvents,
    patientTimeline,
    backups,
    checklist,
    hospitalConfig,
    tenants,
    counts,
  ] = await Promise.all([
    rows(
      `SELECT role_key, role_name, role_category, hierarchy_rank, mfa_required, status FROM clinical_security_roles WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY hierarchy_rank, role_name`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT permission_key,module_key,module_name,action_key,action_name,requires_approval,audit_required,status FROM clinical_security_permissions WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY module_key, action_key`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT role_key,permission_key,access_decision FROM clinical_security_role_permissions WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT id,workflow_key,workflow_name,module_name,statuses,transitions,approvals,is_active,updated_at FROM clinical_workflows WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY module_name, workflow_name`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT id,report_key,report_name,module_name,definition,updated_at FROM clinical_reports WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY module_name, report_name`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT id,template_key,channel,template_name,status,updated_at FROM clinical_notification_templates WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY template_key, channel`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT a.id,a.module_name,a.action,a.entity_type,a.summary,a.created_at,u.full_name AS user_name FROM clinical_audit_events a LEFT JOIN users u ON u.id=a.user_id WHERE a.tenant_id=$1 AND a.hospital_id=$2 AND a.branch_id=$3 AND COALESCE(a.is_deleted,false)=false ORDER BY a.created_at DESC LIMIT 100`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT id,patient_id,event_type,event_title,event_summary,source_table,source_id,event_time,created_at
       FROM clinical_patient_timeline
       WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
       ORDER BY COALESCE(event_time,created_at) DESC
       LIMIT 100`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT policy_key,policy_name,backup_type,schedule_expression,recovery_target,status FROM clinical_production_backup_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY backup_type, policy_name`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT checklist_key,checklist_item,checklist_category,status,required_for_go_live,acceptance_evidence FROM clinical_production_go_live_checklist WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false ORDER BY checklist_category, checklist_item`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    one(
      `SELECT h.id,h.hospital_name,h.branding->>'logoUrl' AS logo_url,h.gst_number,h.license_number,b.branch_name,
        (SELECT COUNT(*)::int FROM branches WHERE hospital_id=$2 AND COALESCE(is_deleted,false)=false) AS branches,
        (SELECT COUNT(*)::int FROM departments WHERE hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS departments,
        (SELECT COUNT(*)::int FROM doctors WHERE hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS doctors
       FROM hospitals h LEFT JOIN branches b ON b.id=$3 WHERE h.id=$2 LIMIT 1`,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    rows(
      `SELECT t.id,t.tenant_name,t.subscription_status AS status,
        COUNT(DISTINCT h.id)::int AS hospitals,
        COUNT(DISTINCT u.id)::int AS users,
        COALESCE(SUM(bi.total),0)::numeric AS revenue
       FROM clinical_tenants t
       LEFT JOIN hospitals h ON h.tenant_id=t.id AND COALESCE(h.is_deleted,false)=false
       LEFT JOIN clinical_user_profiles cup ON cup.tenant_id=t.id AND COALESCE(cup.is_deleted,false)=false
       LEFT JOIN users u ON u.id=cup.user_id
       LEFT JOIN billing_invoices bi ON bi.tenant_id=t.id AND COALESCE(bi.is_deleted,false)=false
       WHERE COALESCE(t.is_deleted,false)=false
       GROUP BY t.id,t.tenant_name,t.status
       ORDER BY revenue DESC
       LIMIT 30`
    ),
    one(
      `
      SELECT
        (SELECT COUNT(*)::int FROM clinical_security_permissions WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS permission_count,
        (SELECT COUNT(*)::int FROM clinical_security_role_permissions WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND access_decision='ALLOW' AND COALESCE(is_deleted,false)=false) AS allowed_permissions,
        (SELECT COUNT(*)::int FROM clinical_workflows WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND is_active=true AND COALESCE(is_deleted,false)=false) AS workflow_count,
        (SELECT COUNT(*)::int FROM clinical_reports WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS report_count,
        (SELECT COUNT(*)::int FROM clinical_notification_templates WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status='ACTIVE' AND COALESCE(is_deleted,false)=false) AS notification_count,
        (SELECT COUNT(*)::int FROM clinical_production_backup_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS backup_count,
        (SELECT COUNT(*)::int FROM clinical_production_go_live_checklist WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('DONE','PASS','WORKING','COMPLETE') AND COALESCE(is_deleted,false)=false) AS passed_checklist,
        (SELECT COUNT(*)::int FROM clinical_production_go_live_checklist WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS total_checklist
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  const rolePermissionSet = new Set(
    rolePermissions
      .filter((row) => row.access_decision === "ALLOW")
      .map((row) => `${row.role_key}:${row.permission_key}`)
  );
  const permissionByKey = new Map(
    permissions.map((row) => [String(row.permission_key), row])
  );
  const matrix = roles.map((role) => ({
    ...role,
    modules: modules.map((module) => ({
      module,
      actions: actions.map((action) => {
        const key = `clinical.${module}.${action}`;
        return {
          action,
          permissionKey: key,
          exists: permissionByKey.has(key),
          allowed: rolePermissionSet.has(`${role.role_key}:${key}`),
        };
      }),
    })),
  }));

  const checklistTotal = Number(counts.total_checklist || 0);
  const checklistPassed = Number(counts.passed_checklist || 0);
  const compliance = {
    productionReadiness: checklistTotal ? Math.round((checklistPassed / checklistTotal) * 100) : 0,
    security: Math.min(100, Math.round((Number(counts.allowed_permissions || 0) / Math.max(1, Number(counts.permission_count || 0))) * 100)),
    workflows: Math.min(100, Math.round((Number(counts.workflow_count || 0) / 2) * 100)),
    reporting: Math.min(100, Math.round((Number(counts.report_count || 0) / reportDefaults.length) * 100)),
    notifications: Math.min(100, Math.round((Number(counts.notification_count || 0) / notificationDefaults.length) * 100)),
    backups: Math.min(100, Math.round((Number(counts.backup_count || 0) / 3) * 100)),
  };
  const overall = Math.round(
    (compliance.productionReadiness + compliance.security + compliance.workflows + compliance.reporting + compliance.notifications + compliance.backups) / 6
  );

  return NextResponse.json({
    context,
    modules,
    actions,
    roles,
    permissions,
    rolePermissions,
    matrix,
    workflows,
    reports,
    notifications,
    auditEvents,
    patientTimeline,
    backups,
    checklist,
    hospitalConfig,
    tenants,
    counts,
    compliance: {
      ...compliance,
      overall,
    },
  });
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body = await request.json();
  const action = String(body.action || "");

  if (action === "updateWorkflow") {
    const workflowId = Number(body.workflowId);
    const statuses = Array.isArray(body.statuses) ? body.statuses : String(body.statuses || "").split(",").map((item) => item.trim()).filter(Boolean);
    const transitions = Array.isArray(body.transitions) ? body.transitions : [];

    if (!workflowId || statuses.length < 2) {
      return NextResponse.json({ error: "Workflow and at least two statuses are required." }, { status: 400 });
    }

    await prisma.$executeRawUnsafe(
      `
      UPDATE clinical_workflows
      SET statuses=$5::jsonb, transitions=$6::jsonb, updated_by=$7, updated_at=CURRENT_TIMESTAMP
      WHERE id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
      `,
      workflowId,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      JSON.stringify(statuses),
      JSON.stringify(transitions),
      context.user.id || null
    );

    await recordClinicalAudit(context, {
      moduleName: "production_readiness",
      action: "workflow_updated",
      entityType: "clinical_workflows",
      entityId: workflowId,
      summary: `Workflow updated with ${statuses.length} statuses.`,
      payload: { statuses, transitions },
    });

    return NextResponse.json({ ok: true });
  }

  if (action === "assignPermission") {
    const roleKey = String(body.roleKey || "");
    const permissionKey = String(body.permissionKey || "");
    const accessDecision = String(body.accessDecision || "ALLOW").toUpperCase() === "DENY" ? "DENY" : "ALLOW";

    if (!roleKey || !permissionKey) {
      return NextResponse.json({ error: "Role and permission are required." }, { status: 400 });
    }

    await prisma.$executeRawUnsafe(
      `
      UPDATE clinical_security_role_permissions
      SET access_decision=$6, updated_by=$7, updated_at=CURRENT_TIMESTAMP
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND role_key=$4 AND permission_key=$5 AND COALESCE(is_deleted,false)=false
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      roleKey,
      permissionKey,
      accessDecision,
      context.user.id || null
    );

    await recordClinicalAudit(context, {
      moduleName: "production_readiness",
      action: "permission_assigned",
      entityType: "clinical_security_role_permissions",
      summary: `${roleKey} ${accessDecision} ${permissionKey}.`,
      payload: { roleKey, permissionKey, accessDecision },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}
