import fs from "fs";
import path from "path";

import { chromium } from "playwright";

const root = process.cwd();
const evidenceRoot = path.join(root, "demo-evidence");
const screenshotDir = path.join(evidenceRoot, "screenshots");
const videoDir = path.join(evidenceRoot, "video");
fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const baseUrl = process.env.DEMO_BASE_URL || "https://erp.tottechsolutions.com";

const pages = [
  ["01-clinical-dashboard", "/clinical-services"],
  ["02-patient-record", "/clinical-services/patients/4"],
  ["03-patient-timeline", "/clinical-services/patients/4/timeline"],
  ["04-appointments", "/clinical-services/appointments"],
  ["05-laboratory", "/clinical-services/laboratory"],
  ["06-pharmacy", "/clinical-services/pharmacy"],
  ["07-finance", "/clinical-services/finance"],
  ["08-security", "/clinical-services/security"],
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ignoreHTTPSErrors: true,
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: videoDir,
    size: { width: 1440, height: 900 },
  },
});
const page = await context.newPage();

await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
await page.fill('input[type="email"], input[name="email"]', "cs-hospital-admin@erp.com");
await page.fill('input[type="password"], input[name="password"]', "Clinical@2026");
await page.click('button:has-text("Login"), button[type="submit"]');
await page.waitForTimeout(1500);

await context.addCookies([
  {
    name: "active_hospital_id",
    value: "7",
    domain: "erp.tottechsolutions.com",
    path: "/",
    secure: true,
  },
  {
    name: "active_branch_id",
    value: "7",
    domain: "erp.tottechsolutions.com",
    path: "/",
    secure: true,
  },
  {
    name: "active_clinic_id",
    value: "5",
    domain: "erp.tottechsolutions.com",
    path: "/",
    secure: true,
  },
]);

const captured = [];
for (const [name, url] of pages) {
  await page.goto(`${baseUrl}${url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const file = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  captured.push({ name, url, file });
}

await page.goto(`${baseUrl}/api/clinical/documents/verify?document_id=1`, {
  waitUntil: "networkidle",
});
await page.waitForTimeout(700);
await page.screenshot({
  path: path.join(screenshotDir, "09-document-verification.png"),
  fullPage: true,
});

await context.close();
await browser.close();

const videos = fs
  .readdirSync(videoDir)
  .filter((file) => file.endsWith(".webm"))
  .map((file) => path.join(videoDir, file));

fs.writeFileSync(
  path.join(evidenceRoot, "SCREENSHOT_AND_VIDEO_EVIDENCE.md"),
  `# Clinical Demo Screenshot and Video Evidence

Generated: ${new Date().toISOString()}

## Screenshots

${captured
  .map((item) => `- ${item.name}: ${item.file} (${item.url})`)
  .join("\n")}
- document verification: ${path.join(screenshotDir, "09-document-verification.png")}

## Video

${videos.map((video) => `- ${video}`).join("\n") || "No video file generated."}
`
);

console.log(
  JSON.stringify(
    {
      screenshots: captured.length + 1,
      videos,
      report: path.join(evidenceRoot, "SCREENSHOT_AND_VIDEO_EVIDENCE.md"),
    },
    null,
    2
  )
);
