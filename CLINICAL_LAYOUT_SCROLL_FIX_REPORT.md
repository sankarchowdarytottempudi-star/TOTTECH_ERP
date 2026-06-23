# Clinical Layout Scroll Fix Report

Generated: 2026-06-07

## Objective

Fix the Clinical Services enterprise application shell so the browser page no longer scrolls as one long document.

Required behavior:

- Fixed header.
- Fixed/sidebar-visible enterprise navigation.
- Only the content area scrolls.
- Mobile drawer locks body scroll while open.
- Bottom navigation remains fixed on mobile.
- No horizontal overflow.

## Files Changed

- `components/clinical/ClinicalShell.tsx`
- `app/globals.css`

## Implementation Summary

The Clinical Services shell was converted from a page-level scrolling layout into a viewport-bounded application frame:

- Added `tt-clinical-shell` as a `100vh / 100dvh` fixed-height shell with `overflow: hidden`.
- Added a fixed-height application header:
  - `56px` mobile.
  - `64px` desktop.
- Moved desktop sidebar into the non-scrolling shell body below the header.
- Made sidebar container `overflow-hidden`.
- Kept sidebar menu as its own internal scroll area using `tt-clinical-sidebar-scroll`.
- Made the main content panel the only vertical scroll container.
- Preserved mobile drawer behavior and verified body scroll lock.

## Validation

Production build:

- `npm run build`: Passed.
- Static page generation: 244 pages generated.

Production deployment:

- PM2 process restarted: `tottech-one`.
- PM2 status: online.
- Live routes verified through `https://erp.tottechsolutions.com`.

Routes checked:

- `/clinical-services`
- `/clinical-services/hms`
- `/clinical-services/patients`
- `/clinical-services/finance`
- `/clinical-services/security`

## Evidence

Screenshot and measurement evidence is stored at:

`/opt/tottech-one/visual-evidence/clinical-layout-scroll-fix`

Screenshots:

- `desktop_clinical-services.png`
- `desktop_clinical-services_hms.png`
- `desktop_clinical-services_patients.png`
- `desktop_clinical-services_finance.png`
- `desktop_clinical-services_security.png`
- `mobile_clinical-services.png`
- `mobile_drawer_open.png`

Measurement file:

- `layout-measurements.json`

## Key Measurement Results

Desktop viewport tested: `1440 x 900`.

- Document scroll height: `900`.
- Body scroll height: `900`.
- Header height: `64`.
- Sidebar top: `64`.
- Sidebar height: `836`.
- Content top: `64`.
- Content height: `836`.
- Shell overflow: `hidden`.
- Content overflow-y: `auto`.
- Sidebar overflow: `hidden`.
- Horizontal overflow: `false`.

Mobile viewport tested: `390 x 844`.

- Document scroll height: `844`.
- Body scroll height: `844`.
- Header height: `56`.
- Content top: `56`.
- Content height: `788`.
- Bottom navigation fixed and visible.
- Mobile drawer body lock: `true`.
- Drawer visible after menu open: `true`.
- Body overflow while drawer open: `hidden`.
- Horizontal overflow: `false`.

## Result

Status: `WORKING`

Clinical Services now behaves like an enterprise application shell:

- Header remains visible.
- Sidebar remains visible on desktop.
- Sidebar menu scrolls internally when needed.
- Content scrolls independently.
- Mobile drawer opens/closes with body scroll locked.
- Mobile bottom navigation remains fixed.
- No browser-level page scrolling was detected during validation.
