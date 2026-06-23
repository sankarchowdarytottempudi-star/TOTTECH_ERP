import { NextResponse } from "next/server";

import { recordClinicalAudit, requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export const runtime = "nodejs";

const scopedTables = [
  "patients",
  "patient_visits",
  "patient_allergies",
  "patient_documents",
  "patient_contacts",
  "consultations",
  "consultation_diagnoses",
  "consultation_prescriptions",
  "consultation_lab_orders",
  "consultation_radiology_orders",
  "lab_orders",
  "lab_samples",
  "lab_results",
  "lab_result_approvals",
  "pharmacy_stock",
  "pharmacy_batches",
  "pharmacy_dispensing",
  "pharmacy_purchase_orders",
  "nursing_vitals",
  "nursing_notes",
  "medication_administration_records",
  "shift_handovers",
  "admissions",
  "bed_allocations",
  "bed_transfers",
  "discharges",
  "ot_schedules",
  "ot_procedures",
  "ot_staff_assignments",
  "icu_admissions",
  "icu_monitoring",
  "ventilator_tracking",
  "ivf_cycles",
  "ivf_stimulation",
  "ivf_monitoring",
  "ivf_egg_retrievals",
  "ivf_embryos",
  "ivf_transfers",
  "ivf_cryostorage",
  "inventory_items",
  "inventory_transactions",
  "inventory_issues",
  "inventory_returns",
  "billing_invoices",
  "billing_invoice_items",
  "payments",
  "refunds",
  "insurance_claims",
  "insurance_policies",
] as const;

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) {
    return auth.response;
  }
  const context = auth.context!;

  const columns = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name = ANY($1::text[])
    ORDER BY table_name, ordinal_position
    `,
    scopedTables
  );

  const columnMap = new Map<string, Set<string>>();
  columns.forEach((row) => {
    const tableName = String(row.table_name);
    if (!columnMap.has(tableName)) {
      columnMap.set(tableName, new Set());
    }
    columnMap.get(tableName)!.add(String(row.column_name));
  });

  const findings = scopedTables.flatMap((table) => {
    const tableColumns = columnMap.get(table);
    if (!tableColumns) {
      return [
        {
          severity: "HIGH",
          table,
          finding: "Expected production table is missing.",
        },
      ];
    }
    return ["tenant_id", "hospital_id", "branch_id"]
      .filter((column) => !tableColumns.has(column))
      .map((column) => ({
        severity: "HIGH",
        table,
        column,
        finding: "Missing isolation column.",
      }));
  });

  const missingScopes = await Promise.all(
    scopedTables
      .filter((table) => {
        const tableColumns = columnMap.get(table);
        return (
          tableColumns?.has("tenant_id") &&
          tableColumns.has("hospital_id") &&
          tableColumns.has("branch_id")
        );
      })
      .map(async (table) => {
        const clinicalScopeFilter =
          table === "payments" || table === "refunds"
            ? "AND (patient_id IS NOT NULL OR clinic_id IS NOT NULL OR hospital_id IS NOT NULL OR branch_id IS NOT NULL OR tenant_id IS NOT NULL)"
            : "";
        const rows = await prisma.$queryRawUnsafe<Row[]>(
          `
          SELECT COUNT(*)::int AS count
          FROM ${table}
          WHERE (
            tenant_id IS NULL
            OR hospital_id IS NULL
            OR branch_id IS NULL
          )
             ${clinicalScopeFilter}
          `
        );
        return {
          table,
          null_scope_records: Number(rows[0]?.count || 0),
        };
      })
  );

  const nullScopeFindings = missingScopes
    .filter((row) => row.null_scope_records > 0)
    .map((row) => ({
      severity: "HIGH",
      table: row.table,
      finding: "Records exist without full tenant/hospital/branch scope.",
      count: row.null_scope_records,
    }));

  const allFindings = [...findings, ...nullScopeFindings];

  for (const finding of allFindings.length
    ? allFindings
    : [{ severity: "INFO", table: "all_scoped_tables", finding: "No tenant isolation gaps detected." }]) {
    const tableColumns = columnMap.get(String(finding.table));
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO clinical_tenant_security_audit (
        tenant_id,
        hospital_id,
        branch_id,
        table_name,
        tenant_column_present,
        hospital_column_present,
        branch_column_present,
        audit_status,
        finding,
        created_by,
        created_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      String(finding.table || ""),
      tableColumns?.has("tenant_id") ?? true,
      tableColumns?.has("hospital_id") ?? true,
      tableColumns?.has("branch_id") ?? true,
      String(finding.severity || "INFO"),
      String(finding.finding || ""),
      context.user.id ?? null
    );
  }

  await recordClinicalAudit(context, {
    moduleName: "clinical_security",
    action: "tenant_security_audit",
    summary: `Tenant security audit completed with ${allFindings.length} findings.`,
    payload: {
      tables: scopedTables.length,
      findings: allFindings.length,
    },
  });

  return NextResponse.json({
    status: allFindings.length ? "PARTIAL" : "WORKING",
    tablesAudited: scopedTables.length,
    findings: allFindings,
  });
}
