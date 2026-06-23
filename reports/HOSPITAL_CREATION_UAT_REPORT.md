# HOSPITAL_CREATION_UAT_REPORT

Generated: 2026-06-20T15:56:27.648Z

## Baseline
- Frozen live hospital baseline: Kandimalla Speciality Hospital (ID 36)
- Dedicated UAT hospitals created through the UI: UAT Hospital A, UAT Hospital B, UAT Hospital C

## UI Validation

| Hospital | Created | Owner Created | Admin Created | Logo Saved | Subscription Saved | Module Assignments Saved | Visible in Grid | Visible in Search | Visible After Refresh | Visible After Relogin | Visible in Switcher | Edit Tested | Delete Tested |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| UAT Hospital A | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | NOT RUN |
| UAT Hospital B | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | NOT RUN | NOT RUN |
| UAT Hospital C | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | NOT RUN | PASS |

## Edit Validation
- UAT Hospital A: address updated to 'UAT Hospital A Address - EDITED | UAT VERIFIED'; visible after edit: PASS; search count: 1

## Database Evidence
- Active hospitals after UAT: Kandimalla Speciality Hospital (KSH), UAT Hospital A (UATA01), UAT Hospital B (UATB01)
- Registry baseline count before UAT validation: 4

## Evidence Artifacts
- reports/hospital-platform-uat/hospital-a-created.png
- reports/hospital-platform-uat/hospital-b-created.png
- reports/hospital-platform-uat/hospital-c-created.png
- reports/hospital-platform-uat/uat-hospital-a-edited.png
- reports/hospital-platform-uat/uat-hospital-a-after-edit.png
- reports/hospital-platform-uat/uat-hospital-c-deleted.png

## Pass / Fail
- Hospital platform creation workflow: PASS
- Hospital edit workflow: PASS
- Hospital search workflow: PASS
- Hospital delete workflow: PASS
