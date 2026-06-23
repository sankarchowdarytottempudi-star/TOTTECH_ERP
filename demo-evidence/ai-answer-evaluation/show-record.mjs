import { chromium } from 'playwright';
const baseUrl='https://erp.tottechsolutions.com';
const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({username:'admin', password:'Admin@2026', platform_type:'EDUCATIONAL'})});
const loginJson = await loginResponse.json();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1600,height:1600} });
await context.addCookies([
  { name:'erpUser', value:encodeURIComponent(JSON.stringify(loginJson.user)), domain:'erp.tottechsolutions.com', path:'/', secure:true, httpOnly:true, sameSite:'Strict' },
  { name:'active_school_id', value:'all', domain:'erp.tottechsolutions.com', path:'/', secure:true, httpOnly:false, sameSite:'Strict' },
  { name:'platform_type', value:'EDUCATIONAL', domain:'erp.tottechsolutions.com', path:'/', secure:true, httpOnly:false, sameSite:'Strict' },
]);
const page = await context.newPage();
await page.goto(`${baseUrl}/exams/answer-evaluation`, { waitUntil:'networkidle' });
const selectByLabel = async (label, value) => {
  const select = page.locator('label').filter({ hasText: label }).locator('select');
  await select.selectOption(String(value));
};
await selectByLabel('School', 8);
await page.waitForTimeout(500);
await selectByLabel('Academic Year', 9);
await page.waitForTimeout(500);
await selectByLabel('Exam', 2);
await page.waitForTimeout(800);
await selectByLabel('Class', 12);
await page.waitForTimeout(500);
await selectByLabel('Section', 16);
await page.waitForTimeout(2000);
await page.screenshot({ path:'/opt/tottech-one/demo-evidence/ai-answer-evaluation/06-record-visible.png', fullPage:true });
console.log('done');
await browser.close();
