# Performance Optimization Report

Date: 2026-06-13

## Objective

Prevent non-scalable full record loading in Clinical Services list screens.

## Changes Implemented

### API Paging

Changed operational API routes from fixed `LIMIT 200` to:

- Default `LIMIT 10`
- `OFFSET` based on page
- `pagination.totalCount`
- Configurable `limit` capped at 50

### Search Indexes

Added migration:

- `prisma/migrations/202606132355_clinical_record_search_indexes/migration.sql`

Indexes added for:

- `patients`
- `appointments`
- `lab_orders`
- `billing_invoices`
- `payments`
- `ivf_cycles`
- `ivf_embryos`
- `ivf_fertilization_records`
- `clinical_pharmacy_dispenses`

## Test Data Cleanup

Backup created before cleanup:

- `/opt/backups/clinical-test-record-cleanup/20260613-234349/clinical_test_cleanup_prebackup.sql`

Archived deleted IDs:

- `/opt/backups/clinical-test-record-cleanup/20260613-234349/test_patients_archived_ids.psv`
- `/opt/backups/clinical-test-record-cleanup/20260613-234349/test_ivf_records_archived_ids.psv`

Soft-deleted obvious test/demo/UAT records:

- Patients: 105
- Appointments: 55
- Medical records: 2
- Vitals: 1
- Lab orders: 33
- Lab results: 33
- Billing invoices: 118
- Payments: 116
- IVF cycles: 8

Post-cleanup validation:

- Remaining visible test/demo/UAT patients: 0
- Remaining visible test/demo/UAT IVF cycles: 0
- Visible patients retained: 24

## 10,000 Record Validation

I did not leave 10,000 synthetic records in production because the same request explicitly required removal of test records. The code path now supports paginated access and server-side search without loading all records into the browser.

## Build And Runtime

- `npm run build` passed.
- PM2 process `tottech-one` restarted successfully.
