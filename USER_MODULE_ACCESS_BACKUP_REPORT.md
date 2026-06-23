# User Module Access Backup Report

Backup timestamp: `20260620-0853`

## Backup Location

`/opt/backups/user-module-access/20260620-0853`

## What Was Backed Up

- Database dump
- Source code mirror
- Prisma schema
- Prisma migrations
- Environment file
- PM2 snapshot

## Verified Files

- `database/database.sql`
- `source/source-code.tar.gz`
- `source-code/` source mirror
- `prisma/schema.prisma`
- `prisma/migrations.tar.gz`
- `env.backup`
- `pm2/pm2-save.txt`

## Restore Notes

### Database

```bash
PGPASSWORD='***' psql -h localhost -U schooladmin -d schoolerp < /opt/backups/user-module-access/20260620-0853/database/database.sql
```

### Source

```bash
rsync -a /opt/backups/user-module-access/20260620-0853/source-code/ /opt/tottech-one/
```

### Prisma

```bash
cp /opt/backups/user-module-access/20260620-0853/prisma/schema.prisma /opt/tottech-one/prisma/schema.prisma
tar -xzf /opt/backups/user-module-access/20260620-0853/prisma/migrations.tar.gz -C /opt/tottech-one/prisma
```

### PM2

```bash
pm2 resurrect
```

## Verification

- Backup directory created before changes.
- Database export completed.
- Source mirror completed.
- Prisma schema copied.
- Migration archive created.
- PM2 snapshot saved.

