# Hospital Form Validation Report

Generated: 2026-06-19

## Validation Behavior

Hospital creation now validates in the click handler instead of making the button feel dead.

On click:

1. Logs button state and form state.
2. Runs field validation.
3. Shows visual errors beside invalid fields.
4. Stops before the API call if validation fails.
5. Keeps the button visible and clickable for correction.

## Required Fields

For new hospital creation:

| Field | Required | Validation |
| --- | --- | --- |
| Hospital Name | Yes | Non-empty |
| Hospital Code | Yes | Non-empty |
| Hospital Logo | Yes | Uploaded logo path required |
| Hospital Email | Yes | Valid email |
| Phone | Yes | Non-empty |
| Address | Yes | Non-empty |
| City | Yes | Non-empty |
| State | Yes | Non-empty |
| Country | Yes | Non-empty |
| Owner Name | Yes | Non-empty |
| Owner Email | Yes | Valid email |
| Admin Name | Yes | Non-empty |
| Admin Email | Yes | Valid email |

Owner/admin passwords remain optional at the UI level, but when provided they are sent to the backend for user provisioning.

## Validation Console Evidence

Empty-form click produced:

```text
CREATE_BUTTON_CLICKED
FORM_VALIDATION_STARTED
FORM_VALIDATION_RESULT valid=false
CREATE_HOSPITAL_FAILED Please complete the highlighted fields...
```

Completed-form click produced:

```text
CREATE_BUTTON_CLICKED
FORM_VALIDATION_STARTED
FORM_VALIDATION_RESULT valid=true
FORM_VALIDATION_PASSED
API_CALL_STARTED
API_RESPONSE_RECEIVED status=201 ok=true
REGISTRY_REFRESH_SUCCESS
```

## UX Improvements

- Required failures are shown next to each field.
- Logo validation is shown below the upload control.
- Invalid fields are highlighted with a red border and light red background.
- Save state shows `"Saving..."` with a visual wait state.
- API or validation failures are kept in the trace message and toast instead of failing silently.

