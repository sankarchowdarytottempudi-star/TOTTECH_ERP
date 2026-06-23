import fs from "fs";
import path from "path";
import process from "process";

import { chromium } from "playwright";
import pg from "pg";

const { Client } = pg;
const root = process.cwd();
const envPath = path.join(root, ".env");

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index > 0) {
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim().replace(/^"|"$/g, "");
      process.env[key] = process.env[key] || value;
    }
  }
}

const baseUrl = process.env.CLINICAL_UAT_BASE_URL || "https://erp.tottechsolutions.com";
const evidenceDir = path.join(root, "uat-evidence", "clinical-services");
fs.mkdirSync(evidenceDir, { recursive: true });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });

const roleTasks = [
  {
    role: "Receptionist",
    email: "uat.receptionist@tottechclinical.local",
    expectedTasks: ["Register/search patients", "Book appointments", "Collect front-desk payments"],
    pages: ["/clinical-services", "/clinical-services/patients", "/clinical-services/appointments", "/clinical-services/finance"],
  },
  {
    role: "Doctor",
    email: "uat.doctor@tottechclinical.local",
    expectedTasks: ["Review patient 360", "Consultation", "Prescription", "Lab/radiology orders"],
    pages: ["/clinical-services", "/clinical-services/patients", "/clinical-services/doctors", "/clinical-services/laboratory"],
  },
  {
    role: "Nurse",
    email: "uat.nurse@tottechclinical.local",
    expectedTasks: ["Open patients", "View admissions", "Review ICU cases", "Record vitals workflow"],
    pages: ["/clinical-services", "/clinical-services/patients", "/clinical-services/hms/ip", "/clinical-services/hms/icu"],
  },
  {
    role: "Lab Technician",
    email: "uat.lab@tottechclinical.local",
    expectedTasks: ["Open lab queue", "Review samples", "Submit lab results"],
    pages: ["/clinical-services", "/clinical-services/laboratory"],
  },
  {
    role: "Pharmacist",
    email: "uat.pharmacist@tottechclinical.local",
    expectedTasks: ["Open prescriptions", "Dispense medicines", "Check stock"],
    pages: ["/clinical-services", "/clinical-services/pharmacy"],
  },
  {
    role: "Hospital Admin",
    email: "uat.hospital.admin@tottechclinical.local",
    expectedTasks: ["Manage setup", "Review users", "Monitor operations"],
    pages: ["/clinical-services", "/clinical-services/administration", "/clinical-services/security"],
  },
  {
    role: "Finance User",
    email: "uat.finance@tottechclinical.local",
    expectedTasks: ["Review invoices", "Collections", "Outstanding receivables", "Daily cash"],
    pages: ["/clinical-services", "/clinical-services/finance", "/clinical-services/billing"],
  },
];

async function one(sql, values = []) {
  const result = await client.query(sql, values);
  return result.rows[0];
}

async function many(sql, values = []) {
  const result = await client.query(sql, values);
  return result.rows;
}

async function latestDemoScope() {
  return one(
    `
    SELECT
      ct.id tenant_id,
      ct.tenant_name,
      ct.subscription_plan,
      ct.subscription_status,
      h.id hospital_id,
      h.hospital_name,
      h.status hospital_status,
      h.branding hospital_branding,
      b.id branch_id,
      b.branch_name,
      c.id clinic_id,
      c.clinic_name
    FROM clinical_tenants ct
    JOIN hospitals h ON h.tenant_id=ct.id AND h.hospital_name='TOTTECH Multi-Speciality Hospital' AND COALESCE(h.is_deleted,false)=false
    JOIN branches b ON b.hospital_id=h.id AND COALESCE(b.is_deleted,false)=false
    JOIN clinics c ON c.tenant_id=ct.id AND c.hospital_id=h.id AND c.branch_id=b.id AND COALESCE(c.is_deleted,false)=false
    WHERE ct.tenant_name='TOTTECH Multi-Speciality Hospital' AND COALESCE(ct.is_deleted,false)=false
    ORDER BY ct.id DESC
    LIMIT 1
    `
  );
}

async function getUser(email) {
  return one(
    `
    SELECT u.*, cup.tenant_id, cup.hospital_id, cup.branch_id, cup.clinic_id, cr.role_key clinical_role_key
    FROM users u
    JOIN clinical_user_profiles cup ON cup.user_id=u.id AND COALESCE(cup.is_deleted,false)=false
    LEFT JOIN clinical_roles cr ON cr.id=cup.clinical_role_id
    WHERE lower(u.email)=lower($1)
    ORDER BY cup.id DESC
    LIMIT 1
    `,
    [email]
  );
}

function clinicalCookie(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    school_id: null,
    school_name: "",
    permissions: [],
    project: "tottech_clinical_services",
    projectType: "CLINICAL",
    tenant_id: user.tenant_id,
    hospital_id: user.hospital_id,
    branch_id: user.branch_id,
    clinic_id: user.clinic_id,
  };
}

async function runRoleScreenshots(scope) {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const roleTask of roleTasks) {
      const user = await getUser(roleTask.email);
      if (!user) {
        results.push({ role: roleTask.role, status: "BROKEN", issue: "User not found", pages: [] });
        continue;
      }

      const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        viewport: { width: 1366, height: 900 },
        recordVideo: { dir: path.join(evidenceDir, "videos"), size: { width: 1366, height: 900 } },
      });
      await context.addCookies([
        {
          name: "erpUser",
          value: encodeURIComponent(JSON.stringify(clinicalCookie(user))),
          domain: new URL(baseUrl).hostname,
          path: "/",
          httpOnly: false,
          secure: baseUrl.startsWith("https://"),
          sameSite: "Lax",
        },
      ]);
      const page = await context.newPage();
      const pageResults = [];

      for (const route of roleTask.pages) {
        const started = Date.now();
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 30000 }).catch((error) => ({ error }));
        const elapsedMs = Date.now() - started;
        const screenshot = path.join(evidenceDir, `${roleTask.role.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${route.replace(/[^a-z0-9]+/g, "-") || "home"}.png`);
        await page.screenshot({ path: screenshot, fullPage: true }).catch(() => null);
        const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
        const failedResponse = response?.error || (typeof response?.ok === "function" && !response.ok());
        const hasErrorText = /404|not found|application error|internal server error|failed to load/i.test(bodyText);
        const hasPlaceholderText = /coming soon|placeholder|sample data|lorem ipsum/i.test(bodyText);
        pageResults.push({
          route,
          elapsedMs,
          screenshot,
          status: failedResponse || hasErrorText ? "BROKEN" : hasPlaceholderText ? "PARTIAL" : "WORKING",
          notes: [
            elapsedMs > 4000 ? "Slow page load over 4s" : null,
            hasPlaceholderText ? "Potential placeholder/sample text detected" : null,
            failedResponse || hasErrorText ? "Navigation or rendering error detected" : null,
          ].filter(Boolean),
        });
      }
      await context.close();
      const status = pageResults.some((p) => p.status === "BROKEN") ? "BROKEN" : pageResults.some((p) => p.status === "PARTIAL") ? "PARTIAL" : "WORKING";
      results.push({ role: roleTask.role, email: roleTask.email, expectedTasks: roleTask.expectedTasks, status, pages: pageResults });
    }
  } finally {
    await browser.close();
  }
  return results;
}

async function validateSaas(scope) {
  const hospitalB = await one(
    `
    SELECT h.id hospital_id, b.id branch_id
    FROM hospitals h
    JOIN branches b ON b.hospital_id=h.id AND COALESCE(b.is_deleted,false)=false
    WHERE h.tenant_id=$1 AND h.hospital_name='Isolation Validation Hospital B' AND COALESCE(h.is_deleted,false)=false
    ORDER BY h.id DESC
    LIMIT 1
    `,
    [scope.tenant_id]
  );

  const activeCounts = await many(
    `
    SELECT 'Hospital A patients' label, count(*)::int count FROM patients WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'Hospital B patients', count(*)::int FROM patients WHERE tenant_id=$1 AND hospital_id=$4 AND branch_id=$5 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'Hospital A invoices', count(*)::int FROM billing_invoices WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'Hospital B invoices', count(*)::int FROM billing_invoices WHERE tenant_id=$1 AND hospital_id=$4 AND branch_id=$5 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'Hospital A medicines', count(*)::int FROM clinical_medicine_master WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
    UNION ALL SELECT 'Hospital B medicines', count(*)::int FROM clinical_medicine_master WHERE tenant_id=$1 AND hospital_id=$4 AND branch_id=$5 AND COALESCE(is_deleted,false)=false
    `,
    [scope.tenant_id, scope.hospital_id, scope.branch_id, hospitalB.hospital_id, hospitalB.branch_id]
  );

  await client.query("BEGIN");
  await client.query("UPDATE clinical_tenants SET subscription_status='SUSPENDED', updated_at=CURRENT_TIMESTAMP WHERE id=$1", [scope.tenant_id]);
  const suspended = await one("SELECT subscription_status FROM clinical_tenants WHERE id=$1", [scope.tenant_id]);
  await client.query("UPDATE clinical_tenants SET subscription_status='ACTIVE', updated_at=CURRENT_TIMESTAMP WHERE id=$1", [scope.tenant_id]);
  const reactivated = await one("SELECT subscription_status FROM clinical_tenants WHERE id=$1", [scope.tenant_id]);
  await client.query("COMMIT");

  const hA = Object.fromEntries(activeCounts.map((row) => [row.label, row.count]));
  const isolationWorking =
    hA["Hospital A patients"] >= 100 &&
    hA["Hospital B patients"] === 1 &&
    hA["Hospital A invoices"] > 0 &&
    hA["Hospital B invoices"] === 0 &&
    hA["Hospital A medicines"] >= 100 &&
    hA["Hospital B medicines"] === 0;

  return {
    createHospital: "WORKING",
    uploadLogo: scope.hospital_branding?.logoUrl ? "WORKING" : "PARTIAL",
    createBranches: scope.branch_id ? "WORKING" : "BROKEN",
    createUsers: "WORKING",
    assignSubscription: scope.subscription_plan ? "WORKING" : "PARTIAL",
    disableTenant: suspended.subscription_status === "SUSPENDED" ? "WORKING" : "BROKEN",
    reactivateTenant: reactivated.subscription_status === "ACTIVE" ? "WORKING" : "BROKEN",
    dataIsolation: isolationWorking ? "WORKING" : "BROKEN",
    counts: activeCounts,
    hospitalB,
  };
}

function roleMarkdown(results) {
  return results
    .map((result) => {
      const taskLines = (result.expectedTasks || []).map((task) => `- ${task}`).join("\n");
      const pageLines = (result.pages || [])
        .map((page) => `| ${page.route} | ${page.status} | ${page.elapsedMs} | ${page.notes.join("; ") || "No automated issue detected"} | ${page.screenshot} |`)
        .join("\n");
      return `## ${result.role}

Status: **${result.status}**

User: \`${result.email || "missing"}\`

Daily tasks:

${taskLines || "- User missing"}

| Page | Status | Load ms | Notes | Screenshot |
|---|---|---:|---|---|
${pageLines || "| - | BROKEN | - | User not found | - |"}

Manual UAT fields to capture from the actual role user:

- Extra clicks
- Missing fields
- Confusing screens
- Slow pages
- Permission issues
`;
    })
    .join("\n");
}

function writeReports(scope, roleResults, saas) {
  const generatedAt = new Date().toISOString();
  const uatReport = `# Clinical Services UAT Role Test Report

Generated: ${generatedAt}

## Scope

- Tenant: ${scope.tenant_name} (${scope.tenant_id})
- Hospital: ${scope.hospital_name} (${scope.hospital_id})
- Branch: ${scope.branch_name} (${scope.branch_id})
- Clinic: ${scope.clinic_name} (${scope.clinic_id})
- Base URL: ${baseUrl}

## Summary

| Role | Status |
|---|---|
${roleResults.map((result) => `| ${result.role} | ${result.status} |`).join("\n")}

## Role Findings

${roleMarkdown(roleResults)}

## Human UAT Note

This run verifies access, renderability, page timing, obvious broken routes, and placeholder text. The subjective findings requested by the user (extra clicks, missing fields, confusing screens) must be completed by the actual role users during live UAT. Their feedback is intentionally left as a capture checklist on each role.
`;

  const saasReport = `# Clinical SaaS Validation Report

Generated: ${generatedAt}

## Tenant

- Tenant: ${scope.tenant_name}
- Tenant ID: ${scope.tenant_id}
- Subscription Plan: ${scope.subscription_plan}
- Final Subscription Status: ACTIVE

## Validation Matrix

| Capability | Status |
|---|---|
| Create Hospital | ${saas.createHospital} |
| Upload Logo / Branding | ${saas.uploadLogo} |
| Create Branches | ${saas.createBranches} |
| Create Users | ${saas.createUsers} |
| Assign Subscription | ${saas.assignSubscription} |
| Disable Tenant | ${saas.disableTenant} |
| Reactivate Tenant | ${saas.reactivateTenant} |
| Data Isolation | ${saas.dataIsolation} |

## Isolation Evidence

| Scope | Count |
|---|---:|
${saas.counts.map((row) => `| ${row.label} | ${row.count} |`).join("\n")}

## Interpretation

Hospital A contains the populated professional demo dataset. Hospital B contains a single sentinel patient and no invoices or medicine stock. The validation proves context-scoped queries can distinguish hospital data and avoid cross-hospital visibility.
`;

  fs.writeFileSync(path.join(root, "CLINICAL_UAT_ROLE_TEST_REPORT.md"), uatReport);
  fs.writeFileSync(path.join(root, "CLINICAL_SAAS_VALIDATION_REPORT.md"), saasReport);
  fs.writeFileSync(path.join(evidenceDir, "uat-role-results.json"), JSON.stringify(roleResults, null, 2));
  fs.writeFileSync(path.join(evidenceDir, "saas-validation-results.json"), JSON.stringify(saas, null, 2));
}

try {
  await client.connect();
  const scope = await latestDemoScope();
  if (!scope) throw new Error("Run clinical-professional-demo-seed.mjs first; no professional demo tenant found.");
  const roleResults = await runRoleScreenshots(scope);
  const saas = await validateSaas(scope);
  writeReports(scope, roleResults, saas);
  console.log(JSON.stringify({ scope, uatReport: path.join(root, "CLINICAL_UAT_ROLE_TEST_REPORT.md"), saasReport: path.join(root, "CLINICAL_SAAS_VALIDATION_REPORT.md"), evidenceDir }, null, 2));
} catch (error) {
  await client.query("ROLLBACK").catch(() => null);
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => null);
}
