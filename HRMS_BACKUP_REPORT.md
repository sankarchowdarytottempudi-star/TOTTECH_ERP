# HRMS Backup Report

Backup timestamp: `20260620-1231`

Backup location:

`/opt/backups/hrms-completion/20260620-1231`

## Contents

- Database dump: `database.sql`
- Source code snapshot: `source/`
- Prisma schema: `schema.prisma`
- Prisma migrations: `migrations/`
- Uploads: `uploads/`
- Environment files: `.env`
- PM2 snapshot: `pm2-jlist.json`
- Verification report: `REPORT.txt`
- Checksums: `checksums.sha256`

## Verified Sizes

- Source code: `4.7G`
- Database dump: `171M`
- Uploads: `18M`
- Migrations: `1.5M`
- Prisma schema: `100K`
- PM2 snapshot: `8.0K`

## Restore Commands

```bash
cd /opt/tottech-one
cp -a /opt/backups/hrms-completion/20260620-1231/source/* /opt/tottech-one/
cp /opt/backups/hrms-completion/20260620-1231/schema.prisma /opt/tottech-one/prisma/schema.prisma
cp -a /opt/backups/hrms-completion/20260620-1231/migrations/* /opt/tottech-one/prisma/migrations/
cp -a /opt/backups/hrms-completion/20260620-1231/uploads /opt/tottech-one/public/uploads
cp /opt/backups/hrms-completion/20260620-1231/.env /opt/tottech-one/.env
psql "$DATABASE_URL" < /opt/backups/hrms-completion/20260620-1231/database.sql
pm2 start /opt/backups/hrms-completion/20260620-1231/pm2-jlist.json
```

## Rollback Steps

1. Stop the current PM2 app: `pm2 stop tottech-one`
2. Restore source, Prisma schema, and migrations from the backup snapshot.
3. Restore `public/uploads` and environment files.
4. Restore the database from `database.sql`.
5. Run `npx prisma generate` and `npx prisma migrate deploy`.
6. Start the app again: `pm2 restart tottech-one --update-env`

## Checksum Verification

The backup checksum file has been regenerated after the final database dump:

`/opt/backups/hrms-completion/20260620-1231/checksums.sha256`
