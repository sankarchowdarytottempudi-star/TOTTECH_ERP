# Clinical Accessibility Contrast Fix Report

Date: 2026-06-07

## Objective

Fix poor text visibility on dark navy Clinical Services hero cards, Patient 360 banners, IVF banners, command center headers, and dashboard hero sections.

## Design Standard Applied

- Navy: `#04142E`
- Gold: `#D4AF37`
- White: `#FFFFFF`
- Hero titles: white, `font-weight: 800`, opacity `1`
- Hero subtitles: `rgba(255,255,255,0.90)`, opacity `1`
- Section labels: gold, opacity `1`
- Small metadata: `rgba(255,255,255,0.75)`, opacity `1`
- Nested light cards inside dark heroes: dark clinical navy text with deeper accessible gold labels/icons

## Implementation Summary

- Added a shared clinical hero accessibility class: `tt-clinical-dark-hero`.
- Applied the class to `36` Clinical Services dark hero/banner sections.
- Removed dark foreground behavior from dark hero sections through global overrides.
- Preserved readable text inside nested white/light cards embedded in dark hero sections.
- Darkened nested-card gold labels/icons from `#8A6500` to `#735300` so small labels pass WCAG AAA on white.

## Files Updated

- `app/globals.css`
- `app/clinical-services/**`

## Validation Scope

Routes tested:

- `/clinical-services`
- `/clinical-services/patients/1`
- `/clinical-services/ivf`
- `/clinical-services/ivf/couples/1`
- `/clinical-services/hms`
- `/clinical-services/hms/op`
- `/clinical-services/pharmacy`
- `/clinical-services/finance`
- `/clinical-services/analytics`
- `/clinical-services/security`

Viewports tested:

- Desktop
- Tablet
- Mobile

## Contrast Results

Samples measured: `129`

Hero containers measured: `30`

WCAG AA failures: `0`

WCAG AAA failures: `0`

Minimum measured contrast:

- Text: `QR Payload`
- Foreground: `rgb(115, 83, 0)`
- Background: `rgb(255, 255, 255)`
- Ratio: `7.08:1`
- Result: WCAG AAA

Key contrast ratios:

- Gold `#D4AF37` on navy `#04142E`: `8.72:1`
- White `rgba(255,255,255,0.90)` on navy `#04142E`: `14.88:1`
- White `#FFFFFF` on navy `#04142E`: `18.35:1`
- Nested accessible gold `#735300` on white `#FFFFFF`: `7.08:1`

## Screenshot Evidence

Before screenshots:

- `/opt/tottech-one/visual-evidence/clinical-contrast-fix/before`

After screenshots:

- `/opt/tottech-one/visual-evidence/clinical-contrast-fix/after`

Measurement file:

- `/opt/tottech-one/visual-evidence/clinical-contrast-fix/after/contrast-measurements.json`

## Build And Deployment

- `npm run build`: Passed
- Static pages generated: `244`
- PM2 app restarted: `tottech-one`
- PM2 process list saved

## Live Route Status

All tested live routes returned HTTP `200`.

## Status

Complete.

Clinical dark hero banners now use a consistent accessible navy/gold/white treatment, nested cards remain readable, and desktop/tablet/mobile contrast validation passes WCAG AAA for sampled text.
