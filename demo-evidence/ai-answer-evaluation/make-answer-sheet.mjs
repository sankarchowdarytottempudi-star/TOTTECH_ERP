import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const outDir = '/opt/tottech-one/demo-evidence/ai-answer-evaluation';
const htmlPath = path.join(outDir, 'answer-sheet.html');
const pdfPath = path.join(outDir, 'answer-sheet.pdf');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: A4; margin: 18mm; }
body { font-family: Arial, sans-serif; color: #111827; }
h1 { margin: 0 0 10px; font-size: 22px; }
.meta { font-size: 12px; margin-bottom: 16px; }
.q { margin: 16px 0; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; }
.q h2 { margin: 0 0 8px; font-size: 16px; }
.a { font-size: 14px; line-height: 1.6; }
</style></head><body>
<h1>Answer Sheet - Mid Term Science</h1>
<div class="meta">School: Kakatheeya Vidya Samsthalu Elementary School<br>Student: Likhitha Tottempudi<br>Class: 10-A<br>Exam: Mid Term 2026</div>
<div class="q"><h2>Q1. What is photosynthesis?</h2><div class="a">Photosynthesis is the process by which green plants use sunlight, carbon dioxide, and water to make food and release oxygen.</div></div>
</body></html>`;
fs.writeFileSync(htmlPath, html);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' } });
await browser.close();
console.log(pdfPath);
