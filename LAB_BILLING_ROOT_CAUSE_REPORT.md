# Lab Billing Root Cause Report

Generated: 2026-06-13

## Issue

Changing a lab order from `BILL_PAID` to `SAMPLE_COLLECTED` could result in patient messaging that showed an incorrect amount, such as Rs. 800, even when the Lab Test Master cost was Rs. 50.

## Root Cause

Two code paths allowed laboratory billing to fall back to hardcoded amounts:

1. `app/api/clinical/doctors/consultations/[id]/route.ts`
   - Lab billing previously used `Number(masterRows[0]?.cost || 800)`.
   - If the lab test master was not matched correctly, or the cost was missing, the billing item could silently become Rs. 800.

2. `lib/clinical/phase4-operational-spine.ts`
   - The laboratory billable map had a fallback `rate: 800`.
   - That made missing lab master pricing dangerous instead of visibly invalid.

## Fix Applied

### Lab Cost Source

Lab billing now reads the amount only from `clinical_lab_test_master`:

- `cost`
- fallback to `price` only if the column exists and has a valid positive value

The lab master match checks:

- `lab_test_name`
- `test_name`
- `test_code`

### No Hardcoded Rs. 800

The Rs. 800 fallback was removed.

For laboratory billing, missing or invalid Lab Test Master pricing now returns a blocking validation error:

`Lab test "<name>" is missing from Lab Test Master or has no valid cost. Please configure the test cost before billing.`

### Lab Order Status

Doctor-created lab orders now start as:

`BILL_GENERATED`

instead of a generic ordered state.

## Files Changed

- `app/api/clinical/doctors/consultations/[id]/route.ts`
- `lib/clinical/phase4-operational-spine.ts`
- `app/api/clinical/operations/lab-results/route.ts`
- `app/api/clinical/billing/invoices/route.ts`

## Validation Evidence

Test patient:

- Patient ID: `529`
- UHID: `UHID-1781384553216`
- Appointment ID: `131`
- Lab Order ID: `92`
- Lab Test: `FF`
- Lab Test Master ID: `1`
- Lab Test Master Cost: `Rs. 50`

Database verification:

```sql
lab_order_id | status           | lab_test_id | lab_test_name | cost
92           | SAMPLE_COLLECTED | 1           | FF            | 50.00
```

Invoice item verification:

```sql
item_id | invoice_id | item_type | item_name     | rate  | amount | invoice_total | status
253     | 212        | LAB       | FF Lab Charge | 50.00 | 50.00  | 50.00         | PAID
```

Result:

- Rs. 800 no longer appears.
- Lab billing is anchored to Lab Test Master.
- Sample collection did not create a new bill.
- Sample collection did not change the invoice amount.

