# TOTTECH ONE HMS Disaster Recovery Runbook

Generated: 2026-06-09

## Objective

Restore TOTTECH ONE HMS clinical services after server, database, storage, or deployment failure.

## Recovery Targets

- Target RPO: 15 minutes where database backups are scheduled frequently.
- Target RTO: 1 hour for a prepared VPS with Node.js, PostgreSQL, Nginx, PM2, and SSL.

## Backup Command

```bash
cd /opt/tottech-one
bash scripts/clinical-production-backup.sh
```

Default destination:

```text
/opt/backups/clinical-production/YYYYMMDD-HHMMSS
```

## Backup Contents

- Source code excluding `node_modules`, `.git`, and `.next/cache`
- Database SQL dump
- `.env` copied as `env.backup` with restricted permissions
- Uploads archive if present
- Documents archive if present
- PM2 process list
- Restore command notes

## Restore Procedure

1. Provision VPS with Node.js, npm, PostgreSQL, Nginx, PM2, and Git.
2. Copy the selected backup directory to the new server.
3. Restore source:

```bash
mkdir -p /opt/tottech-one
tar -xzf source.tar.gz -C /opt/tottech-one
```

4. Restore `.env`:

```bash
cp env.backup /opt/tottech-one/.env
chmod 600 /opt/tottech-one/.env
```

5. Restore database:

```bash
psql "$DATABASE_URL" < database.sql
```

6. Restore uploads/documents if present:

```bash
tar -xzf uploads.tar.gz -C /opt/tottech-one
tar -xzf documents.tar.gz -C /opt/tottech-one
```

7. Rebuild and restart:

```bash
cd /opt/tottech-one
npm install
npm run build
pm2 restart tottech-one --update-env || pm2 start npm --name tottech-one -- start
pm2 save
```

8. Validate:

```bash
npm run clinical:phase45:test
curl -I http://localhost:3000/login
```

## Security Notes

- Never commit `.env` or backup archives to source control.
- Restrict backup directory permissions to root or deployment operator.
- Move production backups to off-server storage for real disaster protection.
- Test restore monthly.
