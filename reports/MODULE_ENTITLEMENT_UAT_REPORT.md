# MODULE_ENTITLEMENT_UAT_REPORT

Generated: 2026-06-20T16:20:32.872Z

## UI Validation

| Hospital | Desired Modules | Entitlements Saved | Persist After Refresh | Persist After Relogin | Persist After Switch | Persist After PM2 Restart |
|---|---|---|---|---|---|---|
| UAT Hospital A | IVF | PASS | PASS | PASS | PASS | PASS |
| UAT Hospital B | IVF, LAB, PHARMACY | PASS | PASS | PASS | PASS | PASS |
| UAT Hospital C | PATIENTS, APPOINTMENTS, OP, IP, ER, ICU, OT, IVF, LAB, RADIOLOGY, PHARMACY, INVENTORY, PROCUREMENT, BILLING, INSURANCE, REFERRAL, FINANCE, HR, ANALYTICS, AI | PASS | PASS | PASS | PASS | PASS |

## Database Evidence
- UAT Hospital A (UATA01): 1 enabled modules
- UAT Hospital B (UATB01): 3 enabled modules
- UAT Hospital C (UATC02): 20 enabled modules

## Route and API Security
### UAT Hospital A
- Sidebar hides unauthorized items: PASS
- Active hospital visible in UI: PASS
- Route checks:
  - /clinical-services/laboratory: BLOCKED (https://erp.tottechsolutions.com/clinical-services/laboratory)
  - /clinical-services/pharmacy: BLOCKED (https://erp.tottechsolutions.com/clinical-services/pharmacy)
  - /clinical-services/finance: BLOCKED (https://erp.tottechsolutions.com/clinical-services/finance)
- API checks:
  - /api/clinical/finance/registry: BLOCKED (HTTP 403)
  - /api/clinical/operations/lab-tests: BLOCKED (HTTP 403)
  - /api/clinical/operations/pharmacy-dispense: BLOCKED (HTTP 403)

### UAT Hospital B
- Sidebar hides unauthorized items: PASS
- Active hospital visible in UI: PASS
- Route checks:
  - /clinical-services/finance: BLOCKED (https://erp.tottechsolutions.com/clinical-services/finance)
- API checks:
  - /api/clinical/finance/registry: BLOCKED (HTTP 403)

### UAT Hospital C
- Sidebar hides unauthorized items: PASS
- Active hospital visible in UI: PASS
- Route checks:

- API checks:


## Evidence Artifacts
- reports/hospital-platform-uat/uat-hospital-a-switcher.png
- reports/hospital-platform-uat/uat-hospital-b-switcher.png
- reports/hospital-platform-uat/uat-hospital-c-switcher.png

## Pass / Fail
- Module entitlement persistence: PASS
- Menu security: PASS
- Route security: PASS
- API security: PASS
