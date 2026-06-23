# PRE IMPLEMENTATION BACKUP REPORT

Sprint: TOTTECH ONE Final Enterprise Completion Sprint  
Backup timestamp: 20260606-1048  
Backup root: `/opt/backups/final-completion-sprint/20260606-1048`

## Backup Verification Status

Status: VERIFIED

The rollback point was created before any final-sprint implementation changes.

Total backup size:

```bash
385M /opt/backups/final-completion-sprint/20260606-1048
```

Verification completed:

- PostgreSQL custom dump created and listed successfully.
- PostgreSQL plain SQL dump created.
- Application source archive opened successfully.
- Upload archive opened successfully.
- Document archive opened successfully.
- Current APK/download archive opened successfully.
- Recovered latest APK copied.
- Prisma schema and migrations backed up.
- Nginx configuration and full `nginx -T` snapshot backed up.
- PM2 process state and dump backed up.
- Environment file backed up with restricted permissions.
- File manifest and SHA256 manifest generated.

## Backup Contents

| Area | Location | Size |
| --- | --- | ---: |
| PostgreSQL custom dump | `/opt/backups/final-completion-sprint/20260606-1048/database/schoolerp_20260606-1048.dump` | 407K |
| PostgreSQL SQL dump | `/opt/backups/final-completion-sprint/20260606-1048/database/schoolerp_20260606-1048.sql` | 512K |
| PostgreSQL dump manifest | `/opt/backups/final-completion-sprint/20260606-1048/database/schoolerp_20260606-1048.dump.list` | 75K |
| Application source | `/opt/backups/final-completion-sprint/20260606-1048/source/tottech-one-source_20260606-1048.tar.gz` | 251M |
| Uploads | `/opt/backups/final-completion-sprint/20260606-1048/uploads/uploads_20260606-1048.tar.gz` | 136B |
| Documents | `/opt/backups/final-completion-sprint/20260606-1048/documents/documents_20260606-1048.tar.gz` | 114B |
| Current public downloads/APKs | `/opt/backups/final-completion-sprint/20260606-1048/apk/current-downloads_20260606-1048.tar.gz` | 70M |
| Latest recovered APK reference | `/opt/backups/final-completion-sprint/20260606-1048/apk/recovered-latest-app-release-3.apk` | 60M |
| Environment variables | `/opt/backups/final-completion-sprint/20260606-1048/env/tottech-one.env` | 549B |
| Redacted environment reference | `/opt/backups/final-completion-sprint/20260606-1048/env/tottech-one.env.redacted` | 333B |
| Prisma schema | `/opt/backups/final-completion-sprint/20260606-1048/prisma/schema.prisma` | 54K |
| Prisma migrations and seed directory | `/opt/backups/final-completion-sprint/20260606-1048/prisma/prisma-migrations_20260606-1048.tar.gz` | 22K |
| Prisma config | `/opt/backups/final-completion-sprint/20260606-1048/prisma/prisma.config.ts` | 374B |
| Nginx config snapshot | `/opt/backups/final-completion-sprint/20260606-1048/nginx/nginx-T_20260606-1048.txt` | 8.6K |
| Nginx sites available | `/opt/backups/final-completion-sprint/20260606-1048/nginx/sites-available_20260606-1048.tar.gz` | 1.8K |
| Nginx sites enabled | `/opt/backups/final-completion-sprint/20260606-1048/nginx/sites-enabled_20260606-1048.tar.gz` | 181B |
| PM2 JSON state | `/opt/backups/final-completion-sprint/20260606-1048/pm2/pm2-jlist_20260606-1048.json` | 6.8K |
| PM2 status | `/opt/backups/final-completion-sprint/20260606-1048/pm2/pm2-status_20260606-1048.txt` | 1.6K |
| PM2 dump | `/opt/backups/final-completion-sprint/20260606-1048/pm2/dump.pm2` | 8.5K |
| File manifest | `/opt/backups/final-completion-sprint/20260606-1048/manifests/backup-file-manifest.tsv` | 2.2K |
| SHA256 manifest | `/opt/backups/final-completion-sprint/20260606-1048/manifests/backup-sha256.txt` | 3.7K |

## Notes

- The database connection URL in `.env` contains a Prisma-only query parameter. The dump was generated with the same URL after removing that query suffix for `pg_dump` compatibility.
- The application source archive excludes `node_modules`, `.next`, `.git`, `.env`, `public/uploads`, and `public/downloads`. These items are either generated, separately backed up, or secret-bearing.
- The sensitive environment file is stored at mode `600`.
- Secrets are not printed in this report.

## Restore Commands

Set variables first:

```bash
export BACKUP_ROOT=/opt/backups/final-completion-sprint/20260606-1048
export APP_DIR=/opt/tottech-one
```

Restore application source:

```bash
pm2 stop tottech-one || true
mv /opt/tottech-one /opt/tottech-one.rollback.$(date +%Y%m%d-%H%M%S)
tar -xzf "$BACKUP_ROOT/source/tottech-one-source_20260606-1048.tar.gz" -C /opt
cp "$BACKUP_ROOT/env/tottech-one.env" "$APP_DIR/.env"
chmod 600 "$APP_DIR/.env"
```

Restore uploads and downloads:

```bash
tar -xzf "$BACKUP_ROOT/uploads/uploads_20260606-1048.tar.gz" -C "$APP_DIR/public"
tar -xzf "$BACKUP_ROOT/documents/documents_20260606-1048.tar.gz" -C "$APP_DIR/public/uploads"
tar -xzf "$BACKUP_ROOT/apk/current-downloads_20260606-1048.tar.gz" -C "$APP_DIR/public"
```

Restore Prisma artifacts if needed:

```bash
cp "$BACKUP_ROOT/prisma/schema.prisma" "$APP_DIR/prisma/schema.prisma"
rm -rf "$APP_DIR/prisma/migrations"
tar -xzf "$BACKUP_ROOT/prisma/prisma-migrations_20260606-1048.tar.gz" -C "$APP_DIR/prisma"
```

Restore database using custom dump:

```bash
set -a
. "$APP_DIR/.env"
set +a
export DB_RESTORE_URL="${DATABASE_URL%%\\?*}"
pg_restore --clean --if-exists --no-owner --dbname "$DB_RESTORE_URL" "$BACKUP_ROOT/database/schoolerp_20260606-1048.dump"
```

Alternative plain SQL restore:

```bash
set -a
. "$APP_DIR/.env"
set +a
export DB_RESTORE_URL="${DATABASE_URL%%\\?*}"
psql "$DB_RESTORE_URL" -f "$BACKUP_ROOT/database/schoolerp_20260606-1048.sql"
```

Restore Nginx configuration:

```bash
tar -xzf "$BACKUP_ROOT/nginx/sites-available_20260606-1048.tar.gz" -C /etc/nginx
tar -xzf "$BACKUP_ROOT/nginx/sites-enabled_20260606-1048.tar.gz" -C /etc/nginx
cp "$BACKUP_ROOT/nginx/nginx.conf" /etc/nginx/nginx.conf
nginx -t
systemctl reload nginx
```

Restore PM2 state:

```bash
cp "$BACKUP_ROOT/pm2/dump.pm2" /root/.pm2/dump.pm2
pm2 resurrect
pm2 save
```

Rebuild and restart application:

```bash
cd "$APP_DIR"
npm install
npx prisma generate
npm run build
pm2 restart tottech-one --update-env
```

## Rollback Procedure

1. Stop application traffic:

```bash
pm2 stop tottech-one || true
```

2. Restore source, `.env`, uploads, documents, downloads, Prisma artifacts, and database using the commands above.

3. Verify infrastructure:

```bash
nginx -t
pm2 status
curl -I http://localhost:3000
curl -I https://erp.tottechsolutions.com
```

4. Verify database:

```bash
set -a
. /opt/tottech-one/.env
set +a
psql "${DATABASE_URL%%\\?*}" -c "select count(*) from information_schema.tables where table_schema = 'public';"
```

5. Confirm PM2 is persisted:

```bash
pm2 save
```

## Backup Integrity Evidence

Commands executed successfully:

```bash
pg_restore -l /opt/backups/final-completion-sprint/20260606-1048/database/schoolerp_20260606-1048.dump
tar -tzf /opt/backups/final-completion-sprint/20260606-1048/source/tottech-one-source_20260606-1048.tar.gz
tar -tzf /opt/backups/final-completion-sprint/20260606-1048/uploads/uploads_20260606-1048.tar.gz
tar -tzf /opt/backups/final-completion-sprint/20260606-1048/documents/documents_20260606-1048.tar.gz
tar -tzf /opt/backups/final-completion-sprint/20260606-1048/apk/current-downloads_20260606-1048.tar.gz
tar -tzf /opt/backups/final-completion-sprint/20260606-1048/prisma/prisma-migrations_20260606-1048.tar.gz
tar -tzf /opt/backups/final-completion-sprint/20260606-1048/nginx/sites-available_20260606-1048.tar.gz
tar -tzf /opt/backups/final-completion-sprint/20260606-1048/nginx/sites-enabled_20260606-1048.tar.gz
```

The SHA256 manifest is available at:

```bash
/opt/backups/final-completion-sprint/20260606-1048/manifests/backup-sha256.txt
```
