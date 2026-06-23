# School Expense Management Backup Report

## Backup Location

`/opt/backups/school-expense-management/20260620-0802`

## Verified Backup Contents

- `database.sql`
- `source-code.tar.gz`
- `uploads-documents.tar.gz`
- `schema.prisma`
- `migrations/`
- `env.backup`
- `pm2-save.txt`
- `SHA256SUMS.txt`

## File Sizes

- `database.sql` - 176,235,373 bytes
- `source-code.tar.gz` - 1,113,629,770 bytes
- `uploads-documents.tar.gz` - 16,538,749 bytes
- `schema.prisma` - 94,866 bytes
- `env.backup` - 833 bytes
- `pm2-save.txt` - 85 bytes
- `SHA256SUMS.txt` - 503 bytes

## Verification

Checksum file generated and verified after backup creation:

- `SHA256SUMS.txt`

## Restore Commands

```bash
# Restore database
PGPASSWORD='n4kVLjBX7r2lA8sgEi7ABEPcRjKL6FXY' psql -h localhost -U schooladmin -d schoolerp < /opt/backups/school-expense-management/20260620-0802/database.sql

# Restore source code snapshot
cd /opt
tar -xzf /opt/backups/school-expense-management/20260620-0802/source-code.tar.gz

# Restore uploads/documents snapshot
cd /opt
tar -xzf /opt/backups/school-expense-management/20260620-0802/uploads-documents.tar.gz

# Restore PM2 state
pm2 resurrect
```

## Rollback Steps

1. Stop PM2 process `tottech-one`.
2. Restore code from the source snapshot if needed.
3. Restore database from `database.sql` if required.
4. Restore uploads/documents if any attachment path is impacted.
5. Run `npx prisma migrate deploy` after rollback if schema drift exists.
6. Restart the app with `pm2 restart tottech-one --update-env`.

