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
const db = new Client({ connectionString: process.env.DATABASE_URL });

async function one(sql, values = []) {
  const result = await db.query(sql, values);
  return result.rows[0] || null;
}

async function login(page) {
  await page.goto(`${baseUrl}/login?platform=clinical`, { waitUntil: "networkidle", timeout: 30000 });
  const platform = page.locator("select").first();
  await platform.selectOption({ label: /Clinical Services/i }).catch(async () => {
    await platform.selectOption("CLINICAL").catch(() => null);
  });
  await page.getByPlaceholder(/username/i).fill("cs-superadmin@erp.com");
  await page.getByPlaceholder(/password/i).fill("Clinical@2026");
  await page.getByRole("button", { name: /^Login$/i }).click();
  await page.waitForURL(/\/clinical-services/i, { timeout: 30000 });
  await page.waitForLoadState("networkidle").catch(() => null);
}

async function main() {
  await db.connect();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    await login(page);
    await page.goto(`${baseUrl}/clinical-services/billing-counter`, { waitUntil: "networkidle", timeout: 30000 });
    await page.screenshot({ path: path.join(root, "billing-reconciliation-before.png"), fullPage: true });

    const invoiceNumber = "INV-1781980018161-8588";
    await page.getByText(invoiceNumber, { exact: false }).first().click();
    await page.waitForTimeout(500);

    const balanceText = await page.getByText(/Balance ₹/i).first().innerText().catch(() => "");
    const balance = Number(String(balanceText).replace(/[^0-9.]/g, "")) || 0;
    if (!balance) {
      throw new Error(`Selected invoice balance not detected from UI: ${balanceText}`);
    }

    await page.locator('input').nth(1).fill(String(balance)).catch(async () => {
      const inputs = page.locator('input');
      const count = await inputs.count();
      for (let i = 0; i < count; i += 1) {
        const input = inputs.nth(i);
        const placeholder = await input.getAttribute("placeholder").catch(() => null);
        if (placeholder === null) {
          await input.fill(String(balance)).catch(() => null);
          break;
        }
      }
    });

    await page.getByRole("button", { name: /Collect & Print Receipt/i }).click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(root, "billing-reconciliation-after.png"), fullPage: true });

    const invoice = await one(`
      SELECT id, invoice_number, total, paid_amount, balance_amount, status
      FROM billing_invoices
      WHERE invoice_number = $1
      LIMIT 1
    `, [invoiceNumber]);

    const payment = await one(`
      SELECT p.id, p.amount, p.receipt_number, pr.receipt_number AS receipt_row
      FROM payments p
      LEFT JOIN payment_receipts pr ON pr.payment_id = p.id
      WHERE p.invoice_id = $1
      ORDER BY p.id DESC
      LIMIT 1
    `, [invoice.id]);

    console.log(JSON.stringify({ invoice, payment }, null, 2));
  } finally {
    await context.close();
    await browser.close();
    await db.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
