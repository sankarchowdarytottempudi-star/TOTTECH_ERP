# Pharmacy UAT Report

## Result
**PASS for validated hospital workflows**

## Tested Through Browser UI

- login
- medicine master create
- medicine master edit
- medicine master search
- medicine master persistence after refresh
- pharmacy retail sale create
- sale persistence after refresh

## Evidence Summary
Browser smoke validation was executed through the UI using Playwright.

Validated records included:

- medicine master record with code `MED-1781984800222`
- retail sale record with bill number `BILL-1781984862138`

## Database Proof

- `clinical_medicine_master.brand_name = UAT Brand UAT MED-1781984769839`
- `clinical_medicine_master.medicine_code = MED-1781984800222`
- `pharmacy_retail_sales.bill_number = BILL-1781984862138`
- `pharmacy_retail_sales.prescription_number = RX-SALE-1781984831862`
- `pharmacy_retail_sales.total = 493.00`
- `pharmacy_retail_sales.paid_amount = 500.00`

## Screenshots
Evidence screenshots are stored under:

`/opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/`

## Conclusion
The validated pharmacy hospital workflows are operational and persistent.

Standalone pharmacy SaaS completeness is still partial because customer master, supplier payments, OTC/cashier productization, and commercial reporting screens are not yet fully productized.

