# Hospital Switcher Auth Validation

## Scope

Validated authenticated hospital selection and persistence for Clinical Services.

## Fixes Applied

- Clinical login initializes the active hospital, branch, and clinic cookies from the user's first clinical profile.
- Super admin hospital switching no longer causes context authorization failure when the selected hospital does not have a direct user profile row.
- Context POST uses shared secure-cookie logic for both HTTP development and HTTPS production.

## Validation Flow

1. Login as Clinical Super Admin.
2. Call `GET /api/clinical/context`.
3. Confirm selected hospital loads.
4. Switch hospital with `POST /api/clinical/context`.
5. Call `GET /api/clinical/context` again using the updated cookies.

## Runtime Evidence

Initial context:

- HTTP: `200`
- Hospital: `TOTTECH Clinical Services Hospital Network`
- Hospital ID: `1`
- Branch ID: `1`
- Clinic ID: `1`
- Accessible hospitals: `2`

Hospital switch:

- Request: `POST /api/clinical/context`
- Payload: `{ "hospital_id": 16 }`
- Response: HTTP `200`
- Result: `{ "success": true }`

Context after switch:

- HTTP: `200`
- Hospital: `Visible CRUD Hospital Edited 007870`
- Hospital ID: `16`
- Branch ID: `16`
- Clinic ID: `12`
- Accessible hospitals:
  - `TOTTECH Clinical Services Hospital Network`
  - `Visible CRUD Hospital Edited 007870`

## Persistence

The hospital switch was validated using the same cookie jar after the POST request, proving that the selected hospital persisted through cookies and survived a subsequent context reload.

## Build And Process Evidence

- `npm run build` passed.
- PM2 started fresh:
  - Process: `tottech-one`
  - Status: `online`
  - Port: `3000`

## Status

PASS
