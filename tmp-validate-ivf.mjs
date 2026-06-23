import { chromium } from 'playwright';
import fs from 'fs/promises';

const baseUrl = 'https://erp.tottechsolutions.com';
const username = 'cs-superadmin@erp.com';
const password = 'Clinical@2026';
const out = '/opt/tottech-one/ivf-uat';
await fs.mkdir(out, { recursive: true });

function log(...args) { console.log(new Date().toISOString(), ...args); }

async function login(page) {
  await page.goto(`${baseUrl}/login?platform=clinical`, { waitUntil: 'networkidle' });
  await page.getByPlaceholder(/username/i).fill(username);
  await page.getByPlaceholder(/password/i).fill(password);
  await page.locator('select').first().selectOption('CLINICAL').catch(()=>{});
  await page.getByRole('button', { name: /^Login$/i }).click();
  await page.waitForURL(/\/clinical-services/, { timeout: 30000 });
}

async function saveModule(page, route, values, name, fileBase) {
  log('opening', name, route);
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const article = page.locator('h2', { hasText: 'Create Record' }).locator('xpath=ancestor::article[1]');
  const controls = article.locator('input,textarea,select');
  const count = await controls.count();
  log(name, 'control count', count);
  for (let i = 0; i < count; i++) {
    const control = controls.nth(i);
    const type = await control.evaluate(n => (n.tagName === 'SELECT' ? 'select' : (n.type || '').toLowerCase())).catch(()=>'');
    const tag = await control.evaluate(n => n.tagName.toLowerCase()).catch(()=>'');
    const key = Object.keys(values)[i];
    const value = values[key];
    if (value === undefined) continue;
    if (tag === 'select') {
      const options = await control.locator('option').evaluateAll(nodes => nodes.map(o => ({ value: o.value, text: o.textContent.trim() })));
      const desired = String(value);
      let matched = options.find(o => o.value === desired || o.text.toLowerCase() === desired.toLowerCase() || o.text.toLowerCase().includes(desired.toLowerCase()));
      if (!matched) matched = options.find(o => o.value && desired.toLowerCase().includes(o.value.toLowerCase()));
      if (matched) {
        await control.selectOption({ value: matched.value || '' });
      } else {
        log(name, 'no match for select value', i, desired, options);
      }
    } else if (type === 'checkbox' || type === 'radio') {
      const truthy = ['true', '1', 'yes', 'y', 'on'].includes(String(value).toLowerCase());
      if (truthy) await control.check(); else await control.uncheck();
    } else {
      await control.fill(String(value));
    }
  }
  const waitPost = page.waitForResponse(resp => resp.url().includes('/api/clinical/ivf/') && resp.request().method() === 'POST');
  await article.getByRole('button', { name: /Save|Create|Update/i }).first().click();
  const response = await waitPost.catch(() => null);
  await page.waitForTimeout(2500);
  const body = await page.locator('body').innerText();
  await page.screenshot({ path: `${out}/${fileBase}-saved.png`, fullPage: true });
  log(name, 'response', response ? response.status() : 'none', 'snippet', body.slice(0, 300).replace(/\s+/g,' '));
  return response ? await response.json().catch(() => ({})) : {};
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1200 } });
const page = await context.newPage();
page.on('console', msg => { if (msg.type() === 'error') console.log('console error:', msg.text()); });
page.on('pageerror', err => console.log('pageerror:', err.message));
page.on('response', async res => { const u = res.url(); if (u.includes('/api/clinical/ivf/') && !res.ok()) console.log('bad resp', res.status(), u); });
await login(page);

const coupleId = '2';
const cycleId = '16';

const coupleId = '2';
const cycleId = '16';
const embryoId = '2';

const cryo = await saveModule(page, '/clinical-services/ivf/cryo?mode=create', {
  embryo_id: embryoId,
  couple_id: coupleId,
  cycle_id: cycleId,
  freezing_date: '2026-06-22',
  method: 'Vitrification',
  tank_number: 'T1',
  canister: 'C1',
  straw_number: 'S1',
  location_code: 'L1',
  status: 'STORED',
}, 'ivf-cryo', 'cryo');

await page.goto(`${baseUrl}/clinical-services/ivf/dashboard`, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${out}/ivf-dashboard.png`, fullPage: true });
log('dashboard text snippet', (await page.locator('body').innerText()).slice(0, 300));
await browser.close();
