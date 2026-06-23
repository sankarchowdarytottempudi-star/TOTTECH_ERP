# Post UAT Gap Closure Backup Report

Generated: 20260620-0603
Backup root: /opt/backups/post-uat-gap-closure/20260620-0603
Total size: 1.3G

## Backup Locations

- Database: /opt/backups/post-uat-gap-closure/20260620-0603/database/tottech_one_20260620-0603.sql
- Source code: /opt/backups/post-uat-gap-closure/20260620-0603/source/tottech-one-source_20260620-0603.tar.gz
- Prisma schema/migrations: /opt/backups/post-uat-gap-closure/20260620-0603/prisma/prisma_20260620-0603.tar.gz
- Uploads: /opt/backups/post-uat-gap-closure/20260620-0603/uploads/
- Documents: /opt/backups/post-uat-gap-closure/20260620-0603/documents/
- Environment files: /opt/backups/post-uat-gap-closure/20260620-0603/env/
- PM2 config: /opt/backups/post-uat-gap-closure/20260620-0603/pm2/
- Checksums: /opt/backups/post-uat-gap-closure/20260620-0603/checksums/SHA256SUMS

## Backup Sizes

```
12K	/opt/backups/post-uat-gap-closure/20260620-0603/checksums
168M	/opt/backups/post-uat-gap-closure/20260620-0603/database
4.0K	/opt/backups/post-uat-gap-closure/20260620-0603/documents
12K	/opt/backups/post-uat-gap-closure/20260620-0603/env
24K	/opt/backups/post-uat-gap-closure/20260620-0603/pm2
184K	/opt/backups/post-uat-gap-closure/20260620-0603/prisma
1.1G	/opt/backups/post-uat-gap-closure/20260620-0603/source
16M	/opt/backups/post-uat-gap-closure/20260620-0603/uploads
```

## Verification

Checksum verification completed successfully. The checksum directory is intentionally excluded from checksum generation to avoid self-referential mismatch.

```
/opt/backups/post-uat-gap-closure/20260620-0603/env/.env.recovery.example: OK
/opt/backups/post-uat-gap-closure/20260620-0603/env/.env: OK
/opt/backups/post-uat-gap-closure/20260620-0603/source/tottech-one-source_20260620-0603.tar.gz: OK
/opt/backups/post-uat-gap-closure/20260620-0603/prisma/prisma_20260620-0603.tar.gz: OK
/opt/backups/post-uat-gap-closure/20260620-0603/pm2/dump_20260620-0603.pm2: OK
/opt/backups/post-uat-gap-closure/20260620-0603/pm2/pm2-jlist_20260620-0603.json: OK
/opt/backups/post-uat-gap-closure/20260620-0603/uploads/uploads_20260620-0603.tar.gz: OK
/opt/backups/post-uat-gap-closure/20260620-0603/database/tottech_one_20260620-0603.sql: OK
/opt/backups/post-uat-gap-closure/20260620-0603/documents/NO_DOCUMENTS_DIR: OK
```

## Restore Commands

Database:

```bash
set -a; source /opt/tottech-one/.env; set +a
DB_URL="${DATABASE_URL%%\?*}"
psql "$DB_URL" < /opt/backups/post-uat-gap-closure/20260620-0603/database/tottech_one_20260620-0603.sql
```

Source:

```bash
cd /opt
mv /opt/tottech-one /opt/tottech-one.rollback.20260620-0603
tar -xzf /opt/backups/post-uat-gap-closure/20260620-0603/source/tottech-one-source_20260620-0603.tar.gz -C /opt
```

Prisma only:

```bash
cd /opt/tottech-one
tar -xzf /opt/backups/post-uat-gap-closure/20260620-0603/prisma/prisma_20260620-0603.tar.gz
npx prisma generate
npx prisma migrate deploy
```

Uploads/Documents:

```bash
cd /opt/tottech-one
[ -f /opt/backups/post-uat-gap-closure/20260620-0603/uploads/uploads_20260620-0603.tar.gz ] && tar -xzf /opt/backups/post-uat-gap-closure/20260620-0603/uploads/uploads_20260620-0603.tar.gz -C /opt/tottech-one
[ -f /opt/backups/post-uat-gap-closure/20260620-0603/documents/documents_20260620-0603.tar.gz ] && tar -xzf /opt/backups/post-uat-gap-closure/20260620-0603/documents/documents_20260620-0603.tar.gz -C /opt/tottech-one
```

PM2:

```bash
cp /opt/backups/post-uat-gap-closure/20260620-0603/pm2/dump_20260620-0603.pm2 /root/.pm2/dump.pm2
pm2 resurrect
```

## Rollback Steps

1. Stop app: `pm2 stop tottech-one`.
2. Restore source tarball from this backup.
3. Restore database dump if schema/data rollback is required.
4. Restore uploads/documents if file assets changed.
5. Run `npm install` only if dependencies changed.
6. Run `npx prisma generate && npx prisma migrate deploy && npm run build`.
7. Start app: `pm2 restart tottech-one --update-env && pm2 save`.
8. Verify `https://erp.tottechsolutions.com/login`.
