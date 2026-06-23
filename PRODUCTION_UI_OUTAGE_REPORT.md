# PRODUCTION UI OUTAGE REPORT

Generated: 2026-06-22 10:55 Europe/Berlin

## Incident

Production URL:

`https://erp.tottechsolutions.com`

Symptom reported:

- Login page rendered as raw HTML.
- No CSS.
- No responsive TOTTECH layout.
- Plain browser controls visible.

## Root Cause

The running Next.js process was serving HTML that referenced stale `/_next/static` chunk names that no longer existed in the active `.next/static/chunks` directory.

Before remediation, `/login` referenced assets such as:

- `/_next/static/chunks/11a-bgqw-i._t.css`
- `/_next/static/chunks/0_1end-8hug1-.js`
- `/_next/static/chunks/turbopack-0067d7hbz0.62.js`
- `/_next/static/chunks/0glwtw9p1oct7.js`

Those asset requests returned:

- `500 text/plain Internal Server Error`

This caused the browser to receive HTML but fail to load the CSS and some runtime chunks.

PM2 logs also showed stale deployment symptoms:

- `Failed to find Server Action "x". This request might be from an older or newer deployment.`

## Files / Runtime Areas Affected

No application source file change was required for the UI outage.

Affected runtime/build artifacts:

- `.next`
- `.next/static`
- PM2 running process: `tottech-one`

## Build Output Verification

Before cleanup:

- `.next/static` existed.
- Some currently referenced chunks were missing.
- Static asset requests returned 500.

After cleanup:

- Removed `.next`.
- Ran `npm install`.
- Ran `npm run build`.
- Build completed successfully.
- Static generation completed: `361/361` pages.
- New `.next` size: `152M`.
- Static files detected: `214`.

## PM2 Status

Command executed:

`pm2 restart tottech-one --update-env`

Result:

- App: `tottech-one`
- Status: `online`
- New PID after restart: `3141539`
- PM2 process list saved with `pm2 save`

## Nginx Status

Command executed:

`nginx -t`

Result:

- Configuration syntax: OK
- Test: successful

Relevant Nginx routing:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

Static `/_next/static/*` requests are proxied to the Next.js server, which is valid for this deployment.

## Resolution

Executed:

```bash
rm -rf .next
npm install
npm run build
pm2 restart tottech-one --update-env
pm2 save
```

## Post-Fix Static Asset Validation

After restart, `/login` referenced the new active build chunks.

Validated asset responses:

| Asset Type | URL Pattern | Status |
|---|---|---|
| CSS | `/_next/static/chunks/00gdcpqhs-~r6.css` | `200 text/css` |
| JS | `/_next/static/chunks/0-hrh_uw98wb_.js` | `200 application/javascript` |
| JS | `/_next/static/chunks/0ftebqjv5-g2b.js` | `200 application/javascript` |
| JS | `/_next/static/chunks/turbopack-12c4p6f0c9v~g.js` | `200 application/javascript` |

All tested login-page static assets returned `200`.

## Page Validation

| Page | Result |
|---|---|
| `/login` | `200`, CSS loaded, no Playwright request failures, no console errors |
| `/dashboard` | `200`, CSS loaded, no static asset failures |
| `/students` | Redirected to `/login` when unauthenticated, CSS loaded |
| `/teachers` | Redirected to `/login` when unauthenticated, CSS loaded |
| `/finance` | Redirected to `/login` when unauthenticated, CSS loaded |

Dashboard console output contained unauthenticated `401` API calls during anonymous Playwright validation. These were not chunk/CSS failures.

## Evidence

Screenshots:

- `/opt/evidence/production-ui-outage/login.png`
- `/opt/evidence/production-ui-outage/dashboard.png`
- `/opt/evidence/production-ui-outage/students.png`
- `/opt/evidence/production-ui-outage/teachers.png`
- `/opt/evidence/production-ui-outage/finance.png`

Playwright result file:

- `/opt/evidence/production-ui-outage/playwright-results.json`

Captured HTML:

- `/tmp/login-after.html`

## Current Status

Production UI outage is resolved.

The login page is no longer serving raw unstyled UI. Static CSS and JavaScript chunks now load from the active build.

