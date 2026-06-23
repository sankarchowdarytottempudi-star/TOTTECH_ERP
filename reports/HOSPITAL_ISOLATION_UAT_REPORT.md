# HOSPITAL_ISOLATION_UAT_REPORT

Generated: 2026-06-20T16:20:32.872Z

| Hospital | Isolation Visible | Data Isolation Visible | Branding Isolation Visible | Refresh Persistence |
|---|---|---|---|---|
| UAT Hospital A | PASS | PASS | PASS | PASS |
| UAT Hospital B | PASS | PASS | PASS | PASS |
| UAT Hospital C | PASS | PASS | PASS | PASS |

## Notes
- Each hospital was switched through the clinical shell context selector or context API.
- Module-restricted pages were tested from the browser session tied to the active hospital context.

## Pass / Fail
- Data isolation: PASS
- Branding isolation: PASS
- Active context persistence: PASS
