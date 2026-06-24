# Database Backup Report

## Database Source
- Database name: `schoolerp`
- User from application configuration: `schooladmin`

## Backup Artifacts

| Artifact | Path | Size |
| --- | --- | --- |
| Custom archive | `/opt/backups/recovery-foundation/20260624-0758/database/tottech_one.backup` | `6.8M` |
| Schema dump | `/opt/backups/recovery-foundation/20260624-0758/database/schema.sql` | `3.5M` |
| Data dump | `/opt/backups/recovery-foundation/20260624-0758/database/data.sql` | `25M` |

## Verification
- `pg_restore -l` completed successfully against the custom archive.
- Archive metadata confirms:
  - format: `CUSTOM`
  - TOC entries: `12845`
  - source database: `schoolerp`
  - dump version: `1.15-0`
  - PostgreSQL version: `16.14`

## Recovery Coverage
- Schema: captured
- Data: captured
- Constraints: included in schema dump
- Indexes: included in schema dump and custom archive
- Foreign keys: included in schema dump and custom archive

## Restore Note
- The archive is suitable for restore validation in an isolated environment before any production recovery use.

