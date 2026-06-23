# Sample Data Cleanup Report

Date: 2026-06-08

## Backup

Rollback point created before cleanup:

`/opt/backups/tablet-sampledata-ai-import/20260608-065906`

Key files:

- `database/schoolerp-before-tablet-sampledata-ai-import.dump`
- `database/schoolerp-before-tablet-sampledata-ai-import.sql`
- `source/tottech-one-source.tar.gz`
- `source/tottempudi-corporate-source.tar.gz`
- `env/tottech-one.env`
- `pm2/pm2-dump.pm2`

## Cleanup Scope

Operational/sample records were removed from:

- TOTTECH ONE students, teachers, classes, sections, subjects, attendance, academics, finance, transport, hostel, dining, timelines, and event ledger rows.
- Clinical Services patients, doctors, appointments, OP/IP/ER/ICU/OT, nursing, lab, radiology, billing, insurance, IVF, pharmacy, HR runtime, finance runtime, analytics runtime, mobile runtime, interoperability runtime, compliance runtime, timelines, and audit activity rows.

Preserved:

- Login users
- Roles and permissions
- Academic years
- School setup
- Clinical tenant, hospital, branch setup
- Application configuration
- Menus
- Screen definitions
- API catalogs
- Report definitions
- Governance/configuration tables

## Evidence

Before cleanup:

- Candidate tables: `866`
- Tables with visible records: `107`

After cleanup:

- Candidate tables with remaining records: `0`

Evidence files:

- `/opt/backups/tablet-sampledata-ai-import/20260608-065906/reports/sample_data_candidate_tables.tsv`
- `/opt/backups/tablet-sampledata-ai-import/20260608-065906/reports/sample_data_nonzero_before.tsv`
- `/opt/backups/tablet-sampledata-ai-import/20260608-065906/reports/sample_data_nonzero_after.tsv`
- `/opt/backups/tablet-sampledata-ai-import/20260608-065906/reports/sample_data_truncate_execute.log`

## Restore Command

```bash
sudo -u postgres pg_restore --clean --if-exists -d schoolerp /opt/backups/tablet-sampledata-ai-import/20260608-065906/database/schoolerp-before-tablet-sampledata-ai-import.dump
```
