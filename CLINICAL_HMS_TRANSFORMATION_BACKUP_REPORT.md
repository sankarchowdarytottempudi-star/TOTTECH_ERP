# Clinical HMS Transformation Backup Report

Backup: `/opt/backups/clinical-hms-transformation/20260609-1507`

Created before implementation.

## Restore
- Database: `psql "$DATABASE_URL" < /opt/backups/clinical-hms-transformation/20260609-1507/database/tottech-one.sql`
- Source: extract `/opt/backups/clinical-hms-transformation/20260609-1507/source/tottech-one-source.tar.gz`
- Env: restore `/opt/backups/clinical-hms-transformation/20260609-1507/env/.env`
- PM2: restore dump then `pm2 resurrect`

## Sizes

```
47M	/opt/backups/clinical-hms-transformation/20260609-1507/database
4.0K	/opt/backups/clinical-hms-transformation/20260609-1507/documents
8.0K	/opt/backups/clinical-hms-transformation/20260609-1507/env
24K	/opt/backups/clinical-hms-transformation/20260609-1507/nginx
28K	/opt/backups/clinical-hms-transformation/20260609-1507/pm2
236K	/opt/backups/clinical-hms-transformation/20260609-1507/prisma
811M	/opt/backups/clinical-hms-transformation/20260609-1507/source
8.0K	/opt/backups/clinical-hms-transformation/20260609-1507/uploads
```
