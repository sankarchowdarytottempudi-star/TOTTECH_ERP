# USER_ROLE_PERMISSION_UAT_REPORT

## Scope
Role-based browser smoke validation for clinical user accounts created during Sprint 2.

## Roles Exercised
- Reception
- Vitals
- Doctor
- Lab
- Pharmacy
- Nurse
- OT
- ICU
- Finance

## Validation Summary
- Each tested account completed a browser login successfully using the clinical platform.
- Sidebar navigation loaded for each role after login.
- Role-scoped access was exercised across the validated accounts without exposing the HRMS/security administration shell to the tested operational roles.

## Notes
- The validated role accounts were created in the hospital-scoped UAT setup and used the shared clinical password established during UAT.
- The role provisioning fix ensured missing hospital-scoped clinical role records were auto-created when needed, which removed the earlier create-user blocker.

## Result
Role login and scoped navigation smoke checks completed successfully for the tested clinical operational roles.
