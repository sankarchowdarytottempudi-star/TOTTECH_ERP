# Go Live Audit Report

Generated: 2026-06-23T11:23:54.855Z

## Decision

**NO-GO**

## Scorecard

- Total Screens Audited: 168
- Total Pass: 166
- Total Fail: 0
- Partial: 2
- Readiness Score: 99%
- Critical Defects: 0
- High Defects: 2
- Medium Defects: 0
- Low Defects: 0

## Top 20 Go-Live Blockers

1. /clinical-services/operational-masters — PARTIAL — Placeholder/empty-state text detected | Console: ERROR: Failed to load resource: the server responded with a status of 500 (Internal Server Error) | ERROR: Failed to load resource: the server responded with a status of 500 (Internal Server Error) | ERROR: Failed to load resource: the server responded with a status of 500 (Internal Server Error)
2. /clinical-services/operations — PARTIAL — Placeholder/empty-state text detected | Console: ERROR: Failed to load resource: the server responded with a status of 500 (Internal Server Error) | ERROR: Failed to load resource: the server responded with a status of 500 (Internal Server Error) | ERROR: Failed to load resource: the server responded with a status of 500 (Internal Server Error)

## Exact Screens That Failed

- None

## Exact Buttons That Failed

- /clinical-services/operational-masters: 
- /clinical-services/operational-masters: 
- /clinical-services/operational-masters: Logout
- /clinical-services/operational-masters: Dashboard5 workflows
- /clinical-services/operational-masters: Patient Management6 workflows
- /clinical-services/operations: 
- /clinical-services/operations: 
- /clinical-services/operations: Logout
- /clinical-services/operations: Dashboard5 workflows
- /clinical-services/operations: Patient Management6 workflows

## Exact Workflows That Failed

- Route load and rendering was checked across all non-API screens.
- Screens with placeholder/empty-state copy were marked partial.
- Screens with 404/500/JS/runtime errors were marked broken.
