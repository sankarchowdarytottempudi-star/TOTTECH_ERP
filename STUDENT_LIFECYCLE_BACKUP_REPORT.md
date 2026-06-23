# Student Lifecycle Sprint Backup Report

Generated: 2026-06-20 07:05

## Backup Root

`/opt/backups/student-lifecycle-sprint/20260620-0705`

## Backup Locations

- Database: `/opt/backups/student-lifecycle-sprint/20260620-0705/database/tottech_one_20260620-0705.sql`
- Source code: `/opt/backups/student-lifecycle-sprint/20260620-0705/source/tottech-one-source_20260620-0705.tar.gz`
- Prisma schema and migrations: `/opt/backups/student-lifecycle-sprint/20260620-0705/prisma/prisma_20260620-0705.tar.gz`
- Uploads: `/opt/backups/student-lifecycle-sprint/20260620-0705/uploads/uploads_20260620-0705.tar.gz`
- Documents: `/opt/backups/student-lifecycle-sprint/20260620-0705/documents/NO_DOCUMENTS_DIR`
- Checksums: `/opt/backups/student-lifecycle-sprint/20260620-0705/checksums/SHA256SUMS`

## Backup Sizes

```text
12K   checksums
168M  database
8.0K  documents
188K  prisma
1.5G  source
16M   uploads
```

## Verification

Checksum verification completed successfully.

```text
database/tottech_one_20260620-0705.sql: OK
documents/NO_DOCUMENTS_DIR: OK
prisma/prisma_20260620-0705.tar.gz: OK
source/tottech-one-source_20260620-0705.tar.gz: OK
uploads/uploads_20260620-0705.tar.gz: OK
```

## Restore Commands

Database:

```bash
cd /opt/tottech-one
set -a; . ./.env; set +a
DB_URL="${DATABASE_URL%%\?*}"
psql "$DB_URL" < /opt/backups/student-lifecycle-sprint/20260620-0705/database/tottech_one_20260620-0705.sql
```

Source:

```bash
pm2 stop tottech-one
mv /opt/tottech-one /opt/tottech-one.rollback.student-lifecycle
tar -xzf /opt/backups/student-lifecycle-sprint/20260620-0705/source/tottech-one-source_20260620-0705.tar.gz -C /opt
cd /opt/tottech-one
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart tottech-one --update-env
pm2 save
```

Uploads:

```bash
tar -xzf /opt/backups/student-lifecycle-sprint/20260620-0705/uploads/uploads_20260620-0705.tar.gz -C /opt/tottech-one/public
```

## Rollback Steps

1. Stop the app with `pm2 stop tottech-one`.
2. Restore source from the source tarball.
3. Restore database dump if schema/data rollback is required.
4. Restore uploads/documents.
5. Run `npx prisma generate`, `npx prisma migrate deploy`, and `npm run build`.
6. Restart PM2 with `pm2 restart tottech-one --update-env && pm2 save`.
7. Verify `https://erp.tottechsolutions.com/login`.
