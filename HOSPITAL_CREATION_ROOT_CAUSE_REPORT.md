# Hospital Creation Root Cause Report

Date: 2026-06-19

## Observed Failure

User clicked `Create Hospital`, but the registry remained empty and the UI did not expose a clear success/error state.

## Root Causes Identified

1. Frontend save flow had limited phase-level tracing.
2. The API request could wait indefinitely from the UI perspective because there was no client-side timeout.
3. The backend create sequence was not wrapped in a single transaction, so a failure after hospital insert could create ambiguous state.
4. Backend errors were returned too generically for real UAT debugging.
5. Registry refresh needed stronger visible tracing and post-save verification.

## Fixes Applied

- Added frontend trace logs:
  - `CREATE_BUTTON_CLICKED`
  - `VALIDATION_STARTED`
  - `VALIDATION_PASSED`
  - `API_REQUEST_STARTED`
  - `API_RESPONSE_RECEIVED`
  - `REGISTRY_REFRESH_STARTED`
  - `REGISTRY_REFRESH_SUCCESS`
- Added visible save-stage message under the create button.
- Added a 45-second request timeout.
- Ensured every path reaches `setSaving(false)` through `finally`.
- Added frontend required-field and email validation.
- Wrapped backend hospital creation in a database transaction.
- Added backend trace logs:
  - `REQUEST_RECEIVED`
  - `VALIDATION_PASSED`
  - `HOSPITAL_INSERT_SUCCESS`
  - `BRANCH_INSERT_SUCCESS`
  - `CLINIC_INSERT_SUCCESS`
  - `OWNER_INSERT_SUCCESS`
  - `ADMIN_INSERT_SUCCESS`
  - `SUBSCRIPTION_INSERT_SUCCESS`
  - `MODULE_ACCESS_INSERT_SUCCESS`
  - `TRANSACTION_COMMITTED`
  - `RESPONSE_SENT`

## Build Validation

`npm run build` passed.
