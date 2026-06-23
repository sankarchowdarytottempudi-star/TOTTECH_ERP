const { chromium } = require('playwright');
(async()=>{
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1200}});
  const errors=[];
  page.on('console', msg => { if (msg.type() === 'error') errors.push('console:'+msg.text()); });
  page.on('pageerror', err => errors.push('pageerror:'+err.message));
  page.on('response', async res => { if (res.status() >= 500) errors.push(`500:${res.status()}:${res.url()}`); });
  await page.goto('https://erp.tottechsolutions.com/login', {waitUntil:'networkidle'});
  await page.locator('input').nth(0).fill('admin');
  await page.locator('input').nth(1).fill('Admin@2026');
  const selectCount = await page.locator('select').count();
  if (selectCount) {
    const sel = page.locator('select').first();
    try { await sel.selectOption({label:'Educational (TOTTECH ONE)'}); } catch { await sel.selectOption('EDUCATIONAL'); }
  }
  const btn = page.getByRole('button', {name:/sign in|login/i}).first();
  await btn.click();
  await page.waitForLoadState('networkidle');

  const paths = ['/finance/expenses','/finance/vouchers','/finance/collection','/attendance/staff','/attendance/students'];
  for (const p of paths) {
    await page.goto('https://erp.tottechsolutions.com'+p, {waitUntil:'networkidle'});
    console.log('OK', p, (await page.locator('body').innerText()).slice(0,180).replace(/\n/g,' '));
  }
  await page.goto('https://erp.tottechsolutions.com/attendance/staff', {waitUntil:'networkidle'});
  const staffDate = page.locator('input[type="date"]').first();
  console.log('staff-date-attrs', {
    min: await staffDate.getAttribute('min'),
    max: await staffDate.getAttribute('max'),
    value: await staffDate.inputValue().catch(()=>null)
  });
  await page.goto('https://erp.tottechsolutions.com/attendance/students', {waitUntil:'networkidle'});
  const studentDate = page.locator('input[type="date"]').first();
  console.log('student-date-attrs', {
    min: await studentDate.getAttribute('min'),
    max: await studentDate.getAttribute('max'),
    value: await studentDate.inputValue().catch(()=>null)
  });
  console.log('ERRORS', JSON.stringify(errors, null, 2));
  await browser.close();
})();
