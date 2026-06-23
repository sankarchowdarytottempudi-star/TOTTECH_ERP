# USER_MANAGEMENT_UAT_REPORT

## Scope
Sprint 2 user management UAT for TOTTECH Clinical Services.

## Browser Validation Completed
- Logged in through the clinical UI as hospital admin for UAT Hospital A.
- Created dedicated UAT users for role coverage and lifecycle validation.
- Verified create, edit, deactivate, activate, reset password, soft delete, restore, and login behavior through Playwright browser runs.

## Users Created During UAT
- `Sprint2 Doctor`
- `UAT A Reception`
- `UAT A Vitals`
- `UAT A Finance`
- `UAT B Lab`
- `UAT B Pharmacy`
- `UAT B Nurse`
- `UAT C OT`
- `UAT C ICU`
- `Sprint2 DeleteCheck <timestamp>` for delete/login validation

## Key Browser Evidence
- User creation returned `201` from the clinical admin-users endpoint and the new user appeared in the visible grid.
- Edit updated name, email, and phone and the updated record remained visible after refresh.
- Password reset succeeded from the browser and the fresh login with the new password succeeded.
- Deactivate/activate toggles updated the visible user state and remained persisted after refresh.
- Soft delete moved the user into the Deleted Users view with restore/permanent-delete actions available.
- A fresh browser login using the deleted account was blocked with `401`.

## Evidence Artifacts
- Screenshot: `/opt/tottech-one/artifacts/sprint2-user-lifecycle.png`
- Multi-user creation screenshots are present in `/opt/tottech-one/artifacts/`

## Result
Sprint 2 user lifecycle functionality is operational in the UI for the validated flows.
