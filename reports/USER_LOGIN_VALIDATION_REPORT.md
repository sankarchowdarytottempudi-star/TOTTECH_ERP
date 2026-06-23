# USER_LOGIN_VALIDATION_REPORT

## Scope
Login, logout, refresh, password reset, and blocked-login validation for clinical users.

## Validated Outcomes
- Fresh login succeeded after browser-driven password reset.
- Deactivated / inactive accounts were blocked from login during UAT flows.
- Soft-deleted users were blocked from login with a `401` response from the auth endpoint.
- Role-scoped hospital admin users were able to authenticate in the expected hospital context.

## Browser Evidence
- Password reset dialog was accepted in the UI and the new password worked in a fresh browser session.
- Attempted login for a soft-deleted user was rejected by `/api/auth/login` with `401`.

## Result
Login validation passed for the validated positive and negative cases.
