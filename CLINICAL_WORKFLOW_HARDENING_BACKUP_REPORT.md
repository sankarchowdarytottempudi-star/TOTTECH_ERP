# Clinical Workflow Hardening Backup Report

Generated: 2026-06-07 17:15 CEST

## Backup Location

`/opt/backups/clinical-workflow-hardening/20260607-1712`

## Backup Contents

| Area | Location | Verification |
|---|---|---|
| PostgreSQL database | `database/schoolerp-before-clinical-workflow.dump` | `pg_restore -l` succeeded with 11,619 restore-list lines |
| Application source | `source/tottech-one-source.tar.gz` | `tar -tzf` succeeded with 89,195 archived paths |
| Environment file | `env/.env.backup` | copied without exposing secret values |
| Prisma schema and migrations | `prisma/prisma` | copied |
| Uploads/documents/downloads | `public/` | copied where present |
| Clinical implementation reports | `reports/` | copied |
| PM2 process state | `process/pm2-jlist.json` | copied |
| Nginx effective config | `process/nginx-dump.txt` | copied |

## Size Summary

Total backup size: approximately 788 MB.

Key artifacts:

- Database dump: approximately 9.7 MB
- Source archive: approximately 640 MB
- Download artifacts: approximately 166 MB
- Prisma schema and migrations: approximately 1.3 MB

## Restore Commands

Database restore into a fresh database:

```bash
sudo -u postgres createdb schoolerp_restore
sudo -u postgres pg_restore -d schoolerp_restore /opt/backups/clinical-workflow-hardening/20260607-1712/database/schoolerp-before-clinical-workflow.dump
```

Application source restore:

```bash
cd /opt
tar -xzf /opt/backups/clinical-workflow-hardening/20260607-1712/source/tottech-one-source.tar.gz
```

Environment restore:

```bash
cp /opt/backups/clinical-workflow-hardening/20260607-1712/env/.env.backup /opt/tottech-one/.env
```

PM2 restart after restore:

```bash
cd /opt/tottech-one
npm install
npx prisma generate
npm run build
pm2 restart tottech-one
```

## Rollback Procedure

1. Stop the running app with `pm2 stop tottech-one`.
2. Restore source archive into `/opt`.
3. Restore `.env` from the backup path.
4. Restore the PostgreSQL dump into the production database or a replacement database after confirming the target.
5. Run `npx prisma generate` and `npm run build`.
6. Restart with `pm2 restart tottech-one`.
7. Verify `/login`, `/clinical-services`, and `/api/clinical/dashboard`.

## Status

Backup verified. Clinical workflow hardening work may proceed.
