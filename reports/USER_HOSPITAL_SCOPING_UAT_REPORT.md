# USER_HOSPITAL_SCOPING_UAT_REPORT

## Scope
Hospital isolation and scoped user access validation for Sprint 2.

## Hospitals Used
- Kandimalla Speciality Hospital
- UAT Hospital A
- UAT Hospital B
- UAT Hospital C

## Browser Validation Summary
- Users were created and validated inside the intended hospital context.
- Clinical admin-user creation returned profiles with the expected `hospital_id` and `branch_id` in the response payload.
- Users created for one hospital remained visible in that hospital context and were not cross-leaked into the others during the UAT browser runs.
- The hospital switcher and context stack already passed in Sprint 1 and remained the foundation for Sprint 2 user scoping.

## Evidence
- UAT user creation responses captured in the browser runs showed hospital-specific profile placement.
- Multi-user creation runs were executed across UAT Hospital A, B, and C.

## Result
Hospital-scoped user creation and access behavior were validated across the UAT hospital set.
