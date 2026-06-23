# USER_CRUD_FAILURE_REPORT

## Summary
The original Sprint 2 blocker was that clinical user creation failed for some hospital roles because the hospital-scoped role records were missing.

## Root Cause
- The clinical user create flow expected a hospital-specific role record to already exist.
- When the role was absent for a hospital, user creation could fail or be rejected.

## Fix Applied
- Added additive role provisioning in the clinical role governance layer.
- Updated the clinical admin-user create/update flow to auto-provision missing hospital-scoped clinical role records instead of failing the request.
- Extended the sidebar role access maps so newly provisioned roles can see the correct navigation.

## Retest Evidence
- Browser create-user flow returned `201` for clinical users.
- Created users appeared in the visible grid after save and after refresh.
- Reset password, deactivate/activate, and soft-delete flows were validated through the UI.
- Fresh login after password reset succeeded.
- Fresh login for a deleted user was blocked with `401`.

## Result
The Sprint 2 user CRUD blocker is resolved for the validated flows.
