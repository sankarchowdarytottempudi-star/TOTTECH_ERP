# Lab UAT Report

## Result
**PASS for validated hospital workflows**

## Tested Through Browser UI

- login
- lab order create
- lab order search
- lab result edit
- lab result persistence after refresh

## Evidence Summary
Browser smoke validation was executed through the UI using Playwright.

Validated records included:

- lab order `LAB-1781984864007-4210`
- sample number `SMP-LAB-1781984863112`

## Database Proof

- `lab_orders.id = 97`
- `lab_orders.order_uid = LAB-1781984864007-4210`
- `lab_orders.sample_number = SMP-LAB-1781984863112`
- `lab_orders.result_value = Slightly elevated`
- `lab_orders.status = ORDERED`

## Screenshots
Evidence screenshots are stored under:

`/opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/`

## Conclusion
The validated lab hospital workflows are operational and persistent.

Standalone diagnostic-center completeness is still partial because dedicated patient registration, walk-in booking, barcode, technician queue, and report delivery workflows are not yet fully productized.

