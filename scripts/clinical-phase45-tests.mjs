import fs from "fs";
import path from "path";
import process from "process";

import pg from "pg";

const { Client } = pg;

const appRoot = process.cwd();
const envPath = path.join(appRoot, ".env");

if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8");
  env
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .forEach((line) => {
      const index = line.indexOf("=");
      if (index > 0) {
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^"|"$/g, "");
        process.env[key] = process.env[key] || value;
      }
    });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required for clinical Phase 4.5 tests.");
  process.exit(1);
}

const client = new Client({
  connectionString: databaseUrl,
});

const requiredTables = [
  "financial_reconciliations",
  "shift_closings",
  "daily_collections",
  "outstanding_receivables",
  "revenue_report_snapshots",
  "clinical_role_permission_audit",
  "clinical_tenant_security_audit",
];

const isolationTables = [
  "patients",
  "consultations",
  "consultation_prescriptions",
  "lab_orders",
  "lab_results",
  "consultation_radiology_orders",
  "discharges",
  "admissions",
  "billing_invoices",
  "billing_invoice_items",
  "insurance_claims",
  "ivf_cycles",
  ...requiredTables,
];

const failures = [];

const assert = (condition, message) => {
  if (!condition) {
    failures.push(message);
  }
};

async function tableExists(tableName) {
  const result = await client.query(
    `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema='public'
        AND table_name=$1
    ) AS exists
    `,
    [tableName]
  );
  return result.rows[0]?.exists === true;
}

async function tableColumns(tableName) {
  const result = await client.query(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name=$1
    `,
    [tableName]
  );
  return new Set(result.rows.map((row) => row.column_name));
}

async function run() {
  await client.connect();

  for (const table of requiredTables) {
    assert(await tableExists(table), `Missing required Phase 4.5 table: ${table}`);
  }

  for (const table of isolationTables) {
    if (!(await tableExists(table))) {
      failures.push(`Cannot validate isolation columns because table is missing: ${table}`);
      continue;
    }
    const columns = await tableColumns(table);
    ["tenant_id", "hospital_id", "branch_id"].forEach((column) => {
      assert(columns.has(column), `${table} is missing isolation column ${column}`);
    });
  }

  const invoiceMismatch = await client.query(`
    SELECT COUNT(*)::int AS count
    FROM billing_invoices i
    LEFT JOIN (
      SELECT invoice_id, COALESCE(SUM(total),0)::numeric AS item_total
      FROM billing_invoice_items
      WHERE COALESCE(is_deleted,false)=false
      GROUP BY invoice_id
    ) items ON items.invoice_id=i.id
    WHERE COALESCE(i.is_deleted,false)=false
      AND ABS(COALESCE(i.total,0) - COALESCE(items.item_total,0)) > 0.01
  `);
  assert(
    Number(invoiceMismatch.rows[0]?.count || 0) === 0,
    `Billing invoice totals are out of sync for ${invoiceMismatch.rows[0]?.count} invoices.`
  );

  const pdfFiles = [
    "lib/clinical/pdf-engine.ts",
    "app/api/clinical/billing/invoices/[id]/pdf/route.ts",
    "app/api/clinical/documents/[id]/pdf/route.ts",
    "app/api/clinical/documents/render/[documentType]/[id]/route.ts",
  ];
  pdfFiles.forEach((file) => {
    assert(fs.existsSync(path.join(appRoot, file)), `Missing PDF implementation file: ${file}`);
  });

  await client.end();

  if (failures.length) {
    console.error("Clinical Phase 4.5 validation failed:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log("Clinical Phase 4.5 validation passed.");
  console.log(`Validated ${requiredTables.length} hardening tables.`);
  console.log(`Validated isolation columns on ${isolationTables.length} tables.`);
  console.log("Validated billing totals and PDF implementation files.");
}

run().catch(async (error) => {
  await client.end().catch(() => {});
  console.error(error);
  process.exit(1);
});
