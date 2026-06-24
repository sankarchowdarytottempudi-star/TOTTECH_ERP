# Backup Inventory Report

## Scope
This report documents the recovery foundation backup created before UI, AI, language, and go-live work.

## Baseline Tag
- Local tag: `PRE_UI_TRANSFORMATION_V1`
- Purpose: baseline before UI transformation

## Verified Backup Location
- `/opt/backups/recovery-foundation/20260624-0758`

## Verified Contents

| Category | Evidence |
| --- | --- |
| Database | `database/tottech_one.backup`, `database/schema.sql`, `database/data.sql` |
| Source code | `source/` copy present with 13,189 files |
| Uploads | `uploads/` copy present with 46 files |
| Infrastructure | `.env`, `.env.recovery.example`, `docker-compose.recovery.yml`, `ecosystem.config.js`, `next.config.ts`, `nginx.tottech-one.conf`, `package.json`, `package-lock.json` |
| Git metadata | `git/HEAD`, `git/config` |

## Backup Size
- Total backup size: `3.2G`
- Database archive size: `6.8M`
- Schema dump size: `3.5M`
- Data dump size: `25M`

## Validation Performed
- Custom PostgreSQL archive listed successfully with `pg_restore -l`
- Archive metadata shows:
  - Database: `schoolerp`
  - Dump format: `CUSTOM`
  - TOC entries: `12845`
  - PostgreSQL version: `16.14`

## Recovery Notes
- Production application files were not modified as part of backup creation.
- The backup includes source, database, upload, infra, and git metadata needed for rollback.

