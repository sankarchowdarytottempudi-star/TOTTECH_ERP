# Hospital Button Root Cause Report

Generated: 2026-06-19

## Issue

The Clinical Services hospital onboarding screen appeared to have a non-clickable **Create Hospital** button. Users received no API request, no loading state, no success message, and no visible validation feedback.

## Root Cause

The button and save flow did not expose enough state to the user or console:

- The button used native `disabled={saving}`, which suppresses click events while saving and gives no diagnostic log.
- Validation failures were thrown as general errors/toasts without persistent field-level errors.
- The click handler did not log all blocking conditions before validation.
- Required onboarding fields were not visually marked as invalid after a failed click.

No overlay, z-index, or `pointer-events:none` issue was found in the patched button area. The backend hospital creation endpoint was functional once a valid request was submitted.

## Fix Applied

Updated `app/clinical-services/platform-hospitals/page.tsx`:

- Added `handleCreateClick()` that always logs `CREATE_BUTTON_CLICKED`.
- Replaced native disabled behavior with `aria-disabled` and an internal `saving` guard so click diagnostics are still visible.
- Added `validateForm()` with required-field and email validation.
- Added field-level visual errors for hospital details, logo, owner, and admin fields.
- Added required create validation for:
  - Hospital Name
  - Hospital Code
  - Logo
  - Hospital Email
  - Phone
  - Address
  - City
  - State
  - Country
  - Owner Name
  - Owner Email
  - Admin Name
  - Admin Email
- Added requested console logs:
  - `CREATE_BUTTON_CLICKED`
  - `FORM_VALIDATION_STARTED`
  - `FORM_VALIDATION_RESULT`
  - `FORM_VALIDATION_PASSED`
  - `API_CALL_STARTED`
  - `API_RESPONSE_RECEIVED`

## Validation Evidence

Browser automation proved:

- Empty-form click logs `CREATE_BUTTON_CLICKED`.
- Empty-form click shows field-level validation errors.
- Filled form uploads logo through `POST /api/clinical/platform/hospitals/upload-logo`.
- Create button fires `POST /api/clinical/platform/hospitals`.
- API returns HTTP 201.
- Registry refreshes and shows the new hospital.

Screenshots:

- `screenshots/hospital-button-fix/before-validation.png`
- `screenshots/hospital-button-fix/validation-errors.png`
- `screenshots/hospital-button-fix/filled-form.png`
- `screenshots/hospital-button-fix/created-registry.png`

