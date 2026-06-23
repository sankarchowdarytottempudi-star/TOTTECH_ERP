# Record Display Standardization Report

Date: 2026-06-13

## Objective

Replace developer-style record cards such as `#13`, `Couple 1`, `Patient 1`, and raw internal IDs with business-facing record information.

## Updated Areas

Dynamic Clinical Services record list engines updated:

- IVF records: `app/clinical-services/ivf/[module]/page.tsx`
- HMS records: `app/clinical-services/hms/[module]/page.tsx`
- Pharmacy records: `app/clinical-services/pharmacy/[module]/page.tsx`
- Finance records: `app/clinical-services/finance/[module]/page.tsx`

## Display Rules Implemented

### IVF

Cards now prefer:

- Female / male couple names
- UHID / patient UID
- Cycle number
- Embryo ID
- Embryo grade
- Doctor / embryologist name
- Business dates

### HMS

Cards now prefer:

- Patient name
- UHID / patient UID
- Mobile
- Doctor name
- Admission / visit / invoice / claim numbers
- Visit or admission date

### Pharmacy

Cards now prefer:

- Patient name
- UHID / patient UID
- Prescription number
- Medicine name
- Doctor name
- Bill amount

### Finance

Cards now prefer:

- Patient name
- UHID / patient UID
- Invoice number
- Receipt / claim / transaction reference
- Account name
- Amount

## Evidence Screenshots

- `reports/record-display-ivf-cycles.png`
- `reports/record-display-hms-ip.png`
- `reports/record-display-pharmacy.png`
- `reports/record-display-finance.png`

## Build Validation

- `npm run build` passed.
- PM2 process `tottech-one` restarted successfully.
