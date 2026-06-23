# Tablet View Parity Report

Date: 2026-06-08

## Objective

Keep tablet views aligned with desktop web views for:

- TOTTECH ONE
- TOTTECH Clinical Services
- TOTTECH AI workspace

Phones remain compact. Tablets now use the full web application shell.

## TOTTECH ONE Changes

- Desktop sidebar now appears from `md` breakpoint instead of `lg`.
- Mobile drawer and mobile bottom navigation are limited to phone widths below `md`.
- Main content offset now uses:
  - `md:ml-[240px]`
  - `lg:ml-[280px]`
- Sidebar uses a tablet width of `240px` and desktop width of `280px`.
- Header desktop controls now appear from `md`, including academic year and school switcher.

## Clinical Services Changes

- Clinical sidebar now appears from `md` breakpoint.
- Clinical mobile drawer and bottom navigation are limited to phone widths below `md`.
- Clinical content width now accounts for:
  - `280px` tablet sidebar.
  - `320px` desktop sidebar.
- Header and logout controls use tablet desktop behavior from `md`.

## TOTTECH AI Changes

- Chat workspace now uses desktop-style side panels from `lg`.
- AI Excel Import panel is visible in the workspace.
- Chat history remains available on larger tablet/desktop layouts.

## Verification

Production build passed:

```bash
npm run build
```

Fresh PM2 restart completed:

```bash
pm2 restart tottech-one --update-env
pm2 restart tottech-corporate tottech-corporate-api --update-env
pm2 save
```
