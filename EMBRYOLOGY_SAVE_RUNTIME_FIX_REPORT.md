# Embryology Lab Save Runtime Fix Report

Generated: 2026-06-14

## Issue

Embryology Lab form opened and accepted values, but clicking **Save Embryology Lab** did not save reliably.

## Runtime Root Cause

The backend route was reached, but PostgreSQL rejected the generated SQL.

Live PM2 error:

`Raw query failed. Code: 42601. Message: multiple assignments to same column "patient_id"`

Affected route:

`app/api/clinical/ivf/[module]/route.ts`

Affected module:

`/clinical-services/ivf/embryology`

Affected table:

`ivf_fertilization_records`

## Fix Applied

Added defensive column de-duplication in the generic IVF save route:

- De-duplicates writable columns from module config.
- Prevents duplicate `UPDATE ... SET patient_id = ...` assignments.
- Prevents duplicate `INSERT` column names.
- Quotes derived `patient_id` assignment consistently.

This fix applies to Embryology and protects other IVF modules using the same generic route.

## API Verification

### Create Test

Endpoint:

`POST /api/clinical/ivf/embryology`

Payload included:

- `couple_id = 1`
- `cycle_id = 15`
- `patient_id = 1`
- `embryo_record_id = 1`
- `doctor_id = 1`
- `method = injection`
- `failed_fertilization = -1`
- `status = FROZEN`

Result:

- HTTP 201
- Created record ID: `11`
- Row persisted in `ivf_fertilization_records`

### Update Test

Endpoint:

`POST /api/clinical/ivf/embryology`

Payload included:

- `id = 11`
- `method = injection updated`
- `oocytes_inseminated = 2`
- `two_pn = 1`
- `failed_fertilization = 0`
- `status = FERTILIZED`

Result:

- HTTP 200
- Existing row updated successfully.

## Database Evidence

Latest verified row:

| id | method | oocytes_inseminated | two_pn | failed_fertilization | status | notes |
|---:|---|---:|---:|---:|---|---|
| 11 | injection updated | 2 | 1 | 0 | FERTILIZED | Codex update verification |

## Grid Verification

`GET /api/clinical/ivf/embryology?limit=5&page=1&q=Codex`

Returned:

- Record `11` with status `FERTILIZED`
- Record `10` with status `FROZEN`

## Test Data Cleanup

The two Codex verification rows created during this runtime test were soft-deleted after validation:

- `id = 10`
- `id = 11`

This keeps the live clinical dataset clean while preserving audit/database evidence.

## Build / Deployment

- Production build: PASS
- PM2 restart: PASS
- Latest PM2 error log: no new `multiple assignments to same column patient_id` error after fix.

## Status

Embryology Lab create and update save paths are now working through the live production API.
