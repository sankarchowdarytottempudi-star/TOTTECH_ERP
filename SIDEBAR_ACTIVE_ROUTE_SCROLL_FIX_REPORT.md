# Sidebar Active Route Scroll Fix Report

## Issue

Clinical Services sidebar did not keep the selected menu option visible after navigation. Users had to collapse and reopen Dashboard or another sidebar group before the active option became visible.

## Root Cause

Two problems were found in `components/clinical/ClinicalShell.tsx`:

1. Active parent expansion was delayed through a timeout, so the active child could be hidden when the scroll effect ran.
2. Parent workspace links used prefix route matching. For example, `/clinical-services/finance/ar` also marked `/clinical-services/finance` as active, so the scroll logic selected the parent workspace before the real child item.

## Fix Applied

- Expanded the active parent domain immediately when `pathname` changes.
- Added exact route matching for domain workspace links.
- Kept prefix route matching for real child items so detail pages still highlight their section.
- Replaced fragile `scrollIntoView` behavior with scroll-container based centering using element and container bounding rectangles.
- Added retry timing with `requestAnimationFrame` and delayed checks so the active item is centered after the expanded group renders.

## Validation

Production build passed with `npm run build`.

PM2 process restarted:

`pm2 restart tottech-one --update-env`

Playwright validation:

| Route | Active Item | Parent | Visible |
| --- | --- | --- | --- |
| `/clinical-services/ivf/embryology` | Embryology | IVF & Fertility | Yes |
| `/clinical-services/ivf/transfers` | Transfer | IVF & Fertility | Yes |
| `/clinical-services/finance/ar` | Receivables | Finance & Accounts | Yes |
| `/clinical-services/analytics/cfo-dashboard` | Financial Dashboard | Dashboard | Yes |

Screenshot evidence:

`/opt/tottech-one/sidebar-active-route-scroll-fix.png`

## Status

Fixed and deployed.
