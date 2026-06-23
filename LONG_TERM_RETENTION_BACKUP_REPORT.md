# LONG_TERM_RETENTION_BACKUP_REPORT

Generated: 2026-06-22 10:13 Europe/Berlin
Backup path: /opt/backups/long-term-retention/20260622-1013
Verification: PASS

## Backup Contents

- Database: /opt/backups/long-term-retention/20260622-1013/database/long_term_retention_20260622-1013.sql
- Source Code: /opt/backups/long-term-retention/20260622-1013/source/tottech-one_20260622-1013.tar.gz
- Prisma Schema: /opt/backups/long-term-retention/20260622-1013/prisma/schema.prisma
- Prisma Migrations: /opt/backups/long-term-retention/20260622-1013/prisma/migrations_20260622-1013.tar.gz
- Uploads: /opt/backups/long-term-retention/20260622-1013/uploads/uploads_20260622-1013.tar.gz or NO_UPLOADS_DIR marker
- Documents: /opt/backups/long-term-retention/20260622-1013/documents/documents_20260622-1013.tar.gz or NO_DOCUMENTS_DIR marker
- Environment Files: /opt/backups/long-term-retention/20260622-1013/env/
- PM2 Snapshot: /opt/backups/long-term-retention/20260622-1013/env/pm2-jlist.json
- Checksums: /opt/backups/long-term-retention/20260622-1013/checksums/SHA256SUMS
- Verification Log: /opt/backups/long-term-retention/20260622-1013/checksums/VERIFY.log

## Backup Size

1.7G	/opt/backups/long-term-retention/20260622-1013

## Restore Commands

Database restore:

```bash
psql "$DATABASE_URL" < /opt/backups/long-term-retention/20260622-1013/database/long_term_retention_20260622-1013.sql
```

Source restore:

```bash
tar -xzf /opt/backups/long-term-retention/20260622-1013/source/tottech-one_20260622-1013.tar.gz -C /opt
```

Prisma restore:

```bash
cp /opt/backups/long-term-retention/20260622-1013/prisma/schema.prisma /opt/tottech-one/prisma/schema.prisma
tar -xzf /opt/backups/long-term-retention/20260622-1013/prisma/migrations_20260622-1013.tar.gz -C /opt/tottech-one/prisma
```

Checksum verification:

```bash
cd /opt/backups/long-term-retention/20260622-1013 && sha256sum -c checksums/SHA256SUMS
```

## Rollback Steps

1. Stop the application with `pm2 stop tottech-one`.
2. Restore source and Prisma files from the backup archive.
3. Restore the database dump.
4. Run `npx prisma generate`.
5. Restart with `pm2 restart tottech-one --update-env`.
6. Verify the app and run the relevant regression checks.
