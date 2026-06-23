# IVF Analytics Verification Report

Date: 2026-06-13

## Verification Summary

The IVF graphical dashboard was verified through API checks, production build, PM2 restart, and browser screenshots.

## API Verification

Authenticated local clinical context used:

- User: `CS-Superadmin@erp.com`
- Tenant: `1`
- Hospital: `1`
- Branch: `1`

### Recent Couples

Endpoint:

`GET /api/clinical/ivf/dashboard`

Result:

- Recent couples returned: 1
- Couple: `CPL-1781369893114`
- Female: `Likhitha`
- Male: `Leelasankarchowdary`

### Search Autocomplete

Endpoint:

`GET /api/clinical/ivf/dashboard?search=li`

Result:

- Suggestions returned: 6
- First match:
  - Type: `couple`
  - Couple ID: `1`
  - Couple Number: `CPL-1781369893114`
  - Label: `Likhitha / Leelasankarchowdary`
  - UHID values included
  - Mobile values included

### Dashboard Analytics

Endpoint:

`GET /api/clinical/ivf/dashboard?couple_id=1`

Result:

- Couple loaded successfully.
- Analytics keys returned:
  - `femaleAssessmentTrend`
  - `femaleHormoneTrend`
  - `maleAssessmentTrend`
  - `cycleTimeline`
  - `cycleStatus`
  - `cycleOutcomes`
  - `follicleGrowth`
  - `medicationTimeline`
  - `retrievalBreakdown`
  - `embryologyBreakdown`
  - `cryoBreakdown`
  - `transferHistory`
  - `transferSuccessRate`
  - `donorUsage`
  - `donorSuccessRate`
  - `surrogacyProgress`
  - `surrogacyMilestones`
  - `pregnancyFunnel`

## Browser Verification

Playwright verified:

- Dashboard page opened.
- Autocomplete displayed `CPL-1781369893114`.
- Couple selection loaded dashboard context.
- Female assessment chart section rendered.
- Cycle timeline rendered.
- Retrieval section rendered.
- Pregnancy funnel section rendered.
- Console errors: 0

Evidence file:

- `reports/ivf-dashboard/evidence.json`

Note: the failed requests listed in the Playwright evidence are Next.js route prefetch aborts during navigation/preload cancellation. They are not dashboard API failures and no console errors were recorded.

## Production Build

Command:

`npm run build`

Status:

PASSED

## Production Restart

Command:

`pm2 restart tottech-one --update-env`

Status:

COMPLETED

## Readiness Result

Status: WORKING

The IVF dashboard is no longer count-card-only. It is now a graphical, patient/couple-driven dashboard backed by normalized IVF records. Areas without entered clinical records show no-data states instead of fake sample charts.

