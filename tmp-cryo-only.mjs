import { chromium } from 'playwright';
const baseUrl = 'https://erp.tottechsolutions.com';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1200 } });
const page = await context.newPage();
await page.goto(`${baseUrl}/login?platform=clinical`, { waitUntil: 'networkidle' });
await page.getByPlaceholder(/username/i).fill('cs-superadmin@erp.com');
await page.getByPlaceholder(/password/i).fill('Clinical@2026');
await page.locator('select').first().selectOption('CLINICAL').catch(()=>{});
await page.getByRole('button', { name: /^Login$/i }).click();
await page.waitForTimeout(4000);
await page.goto(`${baseUrl}/clinical-services/ivf/cryo?mode=create`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
const article = page.locator('h2', { hasText: 'Create Record' }).locator('xpath=ancestor::article[1]');
const controls = article.locator('input,textarea,select');
const values = ['2', '2', '16', '2026-06-22', 'Vitrification', 'T1', 'C1', 'S1', 'L1', 'STORED'];
for (let i = 0; i < values.length; i++) {
  const control = controls.nth(i);
  const tag = await control.evaluate(n => n.tagName.toLowerCase());
  const type = await control.evaluate(n => n.tagName === 'SELECT' ? 'select' : (n.type || '').toLowerCase());
  const value = values[i];
  if (tag === 'select') {
    const options = await control.locator('option').evaluateAll(nodes => nodes.map(o => ({ value: o.value, text: o.textContent.trim() })));
    const desired = String(value);
    let matched = options.find(o => o.value === desired || o.text.toLowerCase().includes(desired.toLowerCase()));
    if (!matched) matched = options.find(o => o.value && desired.toLowerCase().includes(o.value.toLowerCase()));
    if (matched) await control.selectOption({ value: matched.value || '' });
  } else if (type === 'checkbox' || type === 'radio') {
    const truthy = ['true','1','yes','y','on'].includes(String(value).toLowerCase());
    if (truthy) await control.check(); else await control.uncheck();
  } else {
    await control.fill(String(value));
  }
}
const waitPost = page.waitForResponse(resp => resp.url().includes('/api/clinical/ivf/cryo') && resp.request().method() === 'POST');
await article.getByRole('button', { name: /Save|Create|Update/i }).first().click();
const response = await waitPost;
console.log('status', response.status());
console.log(await response.text());
await page.screenshot({ path: '/opt/tottech-one/ivf-uat/cryo-saved.png', fullPage: true });
await browser.close();
