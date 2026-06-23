import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const root = '/opt/tottech-one/demo-evidence/ai-answer-evaluation';
const pdfPath = path.join(root, 'answer-sheet.pdf');
const shot = (name) => path.join(root, `${name}.png`);
const reportPath = path.join(root, 'run-log.json');
const baseUrl = 'https://erp.tottechsolutions.com';

const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'Admin@2026', platform_type: 'EDUCATIONAL' }),
});
const loginJson = await loginResponse.json();
if (!loginResponse.ok || !loginJson.success) {
  throw new Error(`Login failed: ${JSON.stringify(loginJson)}`);
}

const cookieHeader = [
  `erpUser=${encodeURIComponent(JSON.stringify(loginJson.user))}`,
  'active_school_id=all',
  'platform_type=EDUCATIONAL',
].join('; ');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ignoreHTTPSErrors: true,
  viewport: { width: 1600, height: 1600 },
});
await context.addCookies([
  {
    name: 'erpUser',
    value: encodeURIComponent(JSON.stringify(loginJson.user)),
    domain: 'erp.tottechsolutions.com',
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'Strict',
  },
  {
    name: 'active_school_id',
    value: 'all',
    domain: 'erp.tottechsolutions.com',
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'Strict',
  },
  {
    name: 'platform_type',
    value: 'EDUCATIONAL',
    domain: 'erp.tottechsolutions.com',
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'Strict',
  },
]);

const page = await context.newPage();
const apiEvents = [];
page.on('response', async (response) => {
  const url = response.url();
  if (url.includes('/api/exams/answer-evaluation')) {
    let body = null;
    try {
      body = await response.clone().json();
    } catch {
      try {
        body = await response.clone().text();
      } catch {
        body = null;
      }
    }
    apiEvents.push({ url, status: response.status(), body });
  }
});

const centerUrl = `${baseUrl}/exams/answer-evaluation?school_id=8&academic_year_id=9&exam_schedule_id=2&class_id=12&section_id=16&student_id=4`;
await page.goto(centerUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: shot('01-answer-center-initial'), fullPage: true });

const form = new FormData();
form.append('school_id', '8');
form.append('academic_year_id', '9');
form.append('exam_schedule_id', '2');
form.append('question_paper_id', '2');
form.append('class_id', '12');
form.append('section_id', '16');
form.append('student_id', '4');
form.append('answer_sheets', new Blob([await fs.promises.readFile(pdfPath)], { type: 'application/pdf' }), 'answer-sheet.pdf');

const uploadResponse = await fetch(`${baseUrl}/api/exams/answer-evaluation`, {
  method: 'POST',
  headers: { Cookie: cookieHeader },
  body: form,
});
const uploadJson = await uploadResponse.json();
if (!uploadResponse.ok || !uploadJson.success) {
  throw new Error(`Upload failed: ${JSON.stringify(uploadJson)}`);
}

await page.goto(centerUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
await page.screenshot({ path: shot('04-after-ocr'), fullPage: true });

const ocrText = await page.locator('pre').first().textContent().catch(() => null);
const recordCountText = await page.locator('text=/records/').first().textContent().catch(() => null);

const uploadId = uploadJson.records?.[0]?.id || uploadJson.records?.[0]?.record_id || null;
const reviewBody = {
  upload_id: uploadId,
  teacher_review_status: 'APPROVED',
  teacher_comments: 'Verified OCR extraction and approved AI suggested marks after review.',
  overrides: [{ question_id: 2, final_marks: 5 }],
};
const reviewResponse = await fetch(`${baseUrl}/api/exams/answer-evaluation`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json', Cookie: cookieHeader },
  body: JSON.stringify(reviewBody),
});
const reviewJson = await reviewResponse.json();
if (!reviewResponse.ok || !reviewJson.success) {
  throw new Error(`Review failed: ${JSON.stringify(reviewJson)}`);
}

await page.goto(centerUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: shot('05-after-review'), fullPage: true });

const output = {
  loginJson,
  uploadJson,
  reviewJson,
  apiEvents,
  ocrText,
  recordCountText,
  cookies: await context.cookies(),
};
fs.writeFileSync(reportPath, JSON.stringify(output, null, 2));
await browser.close();
console.log(JSON.stringify({ screenshots: [
  shot('01-answer-center-initial'),
  shot('04-after-ocr'),
  shot('05-after-review'),
], reportPath }, null, 2));
