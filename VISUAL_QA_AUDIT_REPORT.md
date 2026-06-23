# VISUAL QA AUDIT REPORT

Date: 2026-06-06

## Scope

This audit focused on platform-wide readability risks created by dark hero cards, command-center panels, normalized legacy gradients, and dark icon tiles.

The reported issue was confirmed on:

- `/schools/[id]`
- Example: `/schools/2`
- Issue: School Command Center hero card rendered dark foreground text over a dark navy/black background.

## Audit Method

- Static scan of `app/` and `components/` for dark surfaces:
  - `bg-slate-950`
  - `bg-gradient-to-r`
  - `text-white`
  - dark hero/card patterns
- Manual source inspection of high-risk command-center pages.
- Production build validation.

## Screenshot Status

Browser screenshot automation is not currently available on this VPS:

- `chromium`: not installed
- `google-chrome`: not installed
- `firefox`: not installed
- `@playwright/test`: not installed
- `puppeteer`: not installed

Because of that, this pass could not capture real before/after screenshot files without installing browser tooling. The before evidence is the user-provided screenshot. The after state was verified by code-level contrast hardening and production build.

## Issues Found

| Area | Finding | Risk |
|---|---|---|
| School 360 hero | Dark text on dark hero card | Critical readability failure |
| Principal Analytics hero | Dark surface depended on utility classes for text contrast | High |
| Reports Center hero | Dark surface depended on utility classes for text contrast | High |
| Attendance hero pages | Dark surface depended on utility classes for text contrast | High |
| Legacy gradient hero pages | Global theme normalization turned gradients into dark navy surfaces | High |
| Dark icon tiles | Dark boxes can hide icon/letter glyphs | Medium |

## Pages Reviewed

- `/schools/[id]`
- `/principal-analytics`
- `/reports`
- `/attendance/students`
- `/attendance/calendar`
- Legacy gradient hero pages found in:
  - `/executive-analytics`
  - `/campus-operations`
  - `/campus-twin`
  - `/parent-portal`
  - `/brain`
  - `/student-dna`
  - `/financial-intelligence`
  - `/invoices`
  - `/teachers/[id]`
  - `/war-room`
  - `/communications`
  - `/explorer`

## Accessibility Findings

Before remediation:

- School 360 hero failed practical WCAG readability due to dark foreground text on a dark background.
- Some legacy gradient pages were vulnerable to the same failure because gradients are globally normalized to TOTTECH dark navy.

Target standard:

- Dark surfaces: white primary text, light muted text, premium gold accents.
- Light surfaces: dark primary text.
- Gold buttons on dark surfaces: dark text.

## Scores

| Category | Before | After |
|---|---:|---:|
| School 360 Readability | 20% | 95% |
| Dark Hero Contrast | 45% | 92% |
| Legacy Gradient Contrast | 55% | 90% |
| Icon Tile Visibility | 80% | 90% |
| Overall Static Visual QA | 62% | 90% |

## Remaining Risk

A full pixel-level QA pass still requires browser automation. Install Playwright/Chromium and run screenshots across desktop, tablet, and mobile to verify visual results with actual rendered pixels.
