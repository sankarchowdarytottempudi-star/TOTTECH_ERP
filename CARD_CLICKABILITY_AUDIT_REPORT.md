# Card Clickability Audit Report

Date: 2026-06-07

Scope:

- TOTTECH ONE web app
- TOTTECH Clinical Services web app
- Tottempudi Software Solutions corporate website
- React Native mobile app variants

## Result

Status: IMPLEMENTED AND BUILT

## TOTTECH ONE

Findings:

- Main dashboard KPI cards were already clickable through `PremiumCard`.
- Hero mini metric cards were static.
- Analytics panel required clicking only the small button.
- Attendance and upcoming exam widgets required clicking inner text links only.

Fixes:

- Converted hero mini metric cards to accessible full-card links.
- Converted the analytics panel into a full-card link to `/analytics`.
- Added optional full-card navigation support to `Widget`.
- Converted Today's Attendance and Upcoming Exams widgets into full-card navigation targets.
- Removed nested anchor markup after converting widgets into full-card links.

Primary routes:

- Students -> `/students/list`
- Teachers -> `/teachers`
- Schools -> `/schools/list`
- Attendance -> `/attendance`
- Classes -> `/academics/classes`
- Subjects -> `/academics/subjects`
- Question Bank -> `/academics/question-bank`
- Question Papers -> `/academics/question-papers`
- Analytics -> `/analytics`
- AI Insights -> `/ai-command-center`

## TOTTECH Clinical Services

Findings:

- Enterprise dashboard KPI cards already use full-card click behavior through `DashboardCard`.
- Operational panels already support row-level navigation when a `hrefForRow` is provided.
- Clinical record cards already support card click, keyboard access, View Details, Edit, Audit Timeline, History, and Patient 360 links.

Fixes:

- Added a mobile Clinical Services workspace to the platform APK.
- CS-prefixed users are routed to the Clinical Services mobile workspace after login.
- Clinical mobile workspace opens the relevant live web modules for patients, appointments, HMS, IVF, lab, radiology, pharmacy, finance, security, and analytics.

## Corporate Website

Findings:

- Product cards were clickable.
- Service cards, industry cards, product module cards, feature cards, benefit cards, visual prompt cards, ecosystem nodes, and stat tiles were visually card-like but not consistently navigational.

Fixes:

- Added reusable clickable-card behavior and focus styling.
- Added card action labels.
- Made service cards route to contact intent URLs.
- Made industry cards route to product pages or contact intent URLs.
- Made TOTTECH ONE and Clinical Services module cards route to product-specific consultation URLs.
- Made feature/benefit cards route to relevant product/service/contact flows.
- Made visual prompt cards route to visual consultation intent URLs.
- Made product ecosystem nodes clickable.
- Made stat tiles clickable.

## Mobile Apps

Created two Android release variants:

1. Corporate app
   - App label: `TOTTECH Solutions`
   - Application ID: `com.tottempudi.solutions`
   - Scope: corporate website only
   - Entry file: `index.corporate.js`
   - Download: `https://erp.tottechsolutions.com/downloads/tottech-solutions.apk`

2. Platform app
   - App label: `TOTTECH Platform`
   - Application ID: `com.tottech.platform`
   - Scope: TOTTECH ONE + TOTTECH Clinical Services
   - Entry file: `index.js`
   - Download: `https://erp.tottechsolutions.com/downloads/tottech-platform.apk`
   - Also published as: `https://erp.tottechsolutions.com/downloads/apk-release.apk`

## Verification

Builds:

- Corporate website: `npm run build` passed.
- TOTTECH ONE + Clinical Services: `npm run build` passed.
- Mobile TypeScript: `npm run typecheck` passed.
- Platform APK: `npm run build:android:platform` passed.
- Corporate APK: `npm run build:android:corporate` passed.

Runtime:

- `tottech-corporate` PM2 process restarted and online.
- `tottech-one` PM2 process restarted and online.
- `https://tottechsolutions.com` returned HTTP 200.
- `https://erp.tottechsolutions.com/login` returned HTTP 200 after warm-up.
- `https://erp.tottechsolutions.com/downloads/tottech-platform.apk` returned HTTP 200.
- `https://erp.tottechsolutions.com/downloads/tottech-solutions.apk` returned HTTP 200.

## Notes

Form containers and content panels were intentionally not all converted to links. Cards that contain inputs, save buttons, or editable workflow controls should remain normal panels to avoid accidental navigation while users are entering data.

