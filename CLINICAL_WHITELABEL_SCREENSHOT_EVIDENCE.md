# Clinical White-Label Screenshot Evidence

Generated from live production domain:

`https://erp.tottechsolutions.com`

## Screenshots

1. Login page with Tottempudi Software Solutions pre-login branding  
   `/opt/tottech-one/screenshots/clinical-whitelabel-evidence/01-login-tottempudi-branding.png`

2. Clinical Services dashboard using authenticated hospital context  
   `/opt/tottech-one/screenshots/clinical-whitelabel-evidence/02-clinical-dashboard-hospital-branding.png`

3. Platform Super Admin hospital onboarding page  
   `/opt/tottech-one/screenshots/clinical-whitelabel-evidence/03-hospital-onboarding-empty-form.png`

4. Hospital onboarding live brand preview with filled sample values  
   `/opt/tottech-one/screenshots/clinical-whitelabel-evidence/04-hospital-onboarding-live-preview-filled.png`

5. Tablet-width responsive hospital onboarding layout  
   `/opt/tottech-one/screenshots/clinical-whitelabel-evidence/05-tablet-hospital-onboarding-responsive.png`

## Validation

- Screenshots were captured with Chromium from the live production domain.
- Authenticated screenshots used an existing Clinical Super Admin browser session cookie without changing credentials.
- No demo hospital was submitted during screenshot capture.
- Live brand preview readability was fixed after screenshot QA found a dark-text-on-dark-panel issue.
- Production build passed after the fix.
- PM2 process `tottech-one` was restarted and saved.
