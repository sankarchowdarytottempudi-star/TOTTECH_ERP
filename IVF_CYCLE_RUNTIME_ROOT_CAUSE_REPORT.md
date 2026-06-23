# IVF Cycle Runtime Root Cause Report

Generated: 2026-06-13

## Scope

Runtime investigation of the reported issue:

> User opens IVF Cycle, enters data, clicks Save, and the record is not saved.

## Reproduction Evidence

The IVF cycle API and UI were tested against the running application at:

- Local runtime: `http://127.0.0.1:3000`
- PM2 app: `tottech-one`
- Auth context: `CS-Superadmin@erp.com`
- Clinical context: tenant `1`, hospital `1`, branch `1`, clinic `1`

## Root Cause

The runtime logs contained repeated IVF save failures from the generic IVF module endpoint:

```text
Raw query failed. Code: 23503.
insert or update on table "ivf_fertilization_records" violates foreign key constraint "ivf_fertilization_records_retrieval_id_fkey"
```

This is a real IVF save-path defect. The shared IVF module save API allowed child workflow references such as `retrieval_id`, `cycle_id`, `embryo_id`, and doctor references to be submitted without validating that the referenced record exists in the current tenant, hospital, and branch.

When a bad reference reached PostgreSQL, the database rejected the insert with a foreign key violation. That produced a server-side failure path instead of a clean user-facing validation message.

## Secondary UX Defect

The IVF page called `response.json()` directly. If the backend returned a non-JSON error body, the client could throw while parsing and only show a generic failure. The save button therefore looked unreliable even when the real problem was validation or backend failure.

## Fix Applied

### Backend

Updated:

- `app/api/clinical/ivf/[module]/route.ts`

Added pre-write foreign key validation for IVF references:

- `couple_id` -> `ivf_couples`
- `cycle_id` -> `ivf_cycles`
- `treatment_plan_id` -> `ivf_treatment_plans`
- `retrieval_id` -> `ivf_retrievals`
- `embryo_id` / `embryo_record_id` -> `ivf_embryos`
- `transfer_id` -> `ivf_embryo_transfers`
- `doctor_id`, `embryologist_id`, `anesthetist_id`, `approved_by` -> `doctors`
- `patient_id`, `female_patient_id`, `male_patient_id` -> `patients`
- `department_id` -> `departments`

Validation is scoped by available `tenant_id`, `hospital_id`, and `branch_id` columns and ignores soft-deleted records.

The save endpoint now returns a clear JSON response such as:

```json
{
  "error": "Selected egg retrieval was not found for this hospital and branch. Please select a valid egg retrieval or leave it blank."
}
```

### Frontend

Updated:

- `app/clinical-services/ivf/[module]/page.tsx`

Changes:

- Robust API response parser that handles JSON and non-JSON responses.
- Cycle-specific success message: `IVF Cycle Saved Successfully`.
- Exact backend error message shown on failure.
- Added explicit `Cancel`, `Close`, and `Delete` controls.
- Keeps existing update flow using the same save endpoint with `id`.

## Runtime Validation

### Invalid FK Path

Test:

```http
POST /api/clinical/ivf/embryology
```

Payload included invalid `retrieval_id = 99999999`.

Result:

```json
{
  "status": 400,
  "error": "Selected egg retrieval was not found for this hospital and branch. Please select a valid egg retrieval or leave it blank."
}
```

This proves the previous database crash path is now handled before insert.

## Build And Deployment

Build:

```text
npm run build
```

Result:

```text
Compiled successfully
Finished TypeScript
Generated static pages successfully
```

Runtime restart:

```text
pm2 restart tottech-one --update-env
```

Result:

```text
tottech-one online
```

## Remaining Notes

The PM2 error log still contains historical Prisma foreign key stack traces from before this patch. The new validation test returned HTTP 400 instead of creating a new Prisma foreign key crash.

