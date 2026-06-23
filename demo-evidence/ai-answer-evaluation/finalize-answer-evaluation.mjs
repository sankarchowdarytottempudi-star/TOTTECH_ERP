import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const root = '/opt/tottech-one/demo-evidence/ai-answer-evaluation';
const shot = (name) => path.join(root, `${name}.png`);
const reportPath = path.join(root, 'final-run-log.json');
const baseUrl = 'https://erp.tottechsolutions.com';

const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'Admin@2026', platform_type: 'EDUCATIONAL' }),
});
const loginJson = await loginResponse.json();
if (!loginResponse.ok || !loginJson.success) throw new Error(`Login failed: ${JSON.stringify(loginJson)}`);

const cookieHeader = [
  `erpUser=${encodeURIComponent(JSON.stringify(loginJson.user))}`,
  'active_school_id=all',
  'platform_type=EDUCATIONAL',
].join('; ');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1600, height: 1600 } });
await context.addCookies([
  { name: 'erpUser', value: encodeURIComponent(JSON.stringify(loginJson.user)), domain: 'erp.tottechsolutions.com', path: '/', secure: true, httpOnly: true, sameSite: 'Strict' },
  { name: 'active_school_id', value: 'all', domain: 'erp.tottechsolutions.com', path: '/', secure: true, httpOnly: false, sameSite: 'Strict' },
  { name: 'platform_type', value: 'EDUCATIONAL', domain: 'erp.tottechsolutions.com', path: '/', secure: true, httpOnly: false, sameSite: 'Strict' },
]);
const page = await context.newPage();
const apiEvents = [];
page.on('response', async (response) => {
  if (response.url().includes('/api/exams/answer-evaluation')) {
    let body = null;
    try { body = await response.json(); }
    catch {
      try { body = await response.text(); } catch { body = null; }
    }
    apiEvents.push({ url: response.url(), status: response.status(), body });
  }
});

const centerUrl = `${baseUrl}/exams/answer-evaluation?school_id=8&academic_year_id=9&exam_schedule_id=2&class_id=12&section_id=16&student_id=4`;
await page.goto(centerUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: shot('04-after-ocr'), fullPage: true });
const ocrText = await page.locator('pre').first().textContent().catch(() => null);
const recordStatus = await page.locator('text=/PENDING|APPROVED|OVERRIDE|REJECTED/').first().textContent().catch(() => null);

const reviewResponse = await fetch(`${baseUrl}/api/exams/answer-evaluation`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json', Cookie: cookieHeader },
  body: JSON.stringify({
    upload_id: 1,
    teacher_review_status: 'APPROVED',
    teacher_comments: 'Verified OCR extraction and approved AI suggested marks after review.',
    overrides: [{ question_id: 2, final_marks: 5 }],
  }),
});
const reviewJson = await reviewResponse.json();
if (!reviewResponse.ok || !reviewJson.success) throw new Error(`Review failed: ${JSON.stringify(reviewJson)}`);

await page.goto(centerUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: shot('05-after-review'), fullPage: true });

const finalOutput = {
  loginJson,
  recordStatus,
  ocrText,
  apiEvents,
  reviewJson,
  cookies: await context.cookies(),
};
fs.writeFileSync(reportPath, JSON.stringify(finalOutput, null, 2));
await browser.close();
console.log(JSON.stringify({ screenshots: [shot('04-after-ocr'), shot('05-after-review')], reportPath }, null, 2));
