# Disaster Recovery Runbook

## Objective
Recover the production application within the target recovery window using the verified baseline backup.

## Current Recovery Assets
- Baseline tag: `PRE_UI_TRANSFORMATION_V1`
- Backup directory: `/opt/backups/recovery-foundation/20260624-0758`

## Immediate Actions
1. Confirm incident scope.
2. Freeze further changes.
3. Restore application code from the baseline tag.
4. Restore the PostgreSQL backup into an isolated target first.
5. Validate the restored database.
6. Restore uploads and configuration.
7. Re-enable the application.

## Dry-Run Validation Completed
- The backup archive was inspected with `pg_restore -l`.
- The archive is non-empty and structurally valid.
- The backup directory contains database, source, uploads, infra, and git artifacts.
- An isolated restore check completed successfully into a throwaway PostgreSQL database.
- The restored throwaway database reported `1194` public tables before being dropped.

## Operational Recovery Checks
- Browser login
- Dashboard render
- One patient/student workflow
- One file-backed page
- One role-based page

## Notes
- No production DNS, nginx, PM2, or live database changes are made by this runbook until an explicit recovery decision is approved.
- Production restore should use the verified backup only after an isolated restore check passes.
