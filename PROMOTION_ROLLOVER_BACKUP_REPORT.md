# PROMOTION ROLLOVER BACKUP REPORT

Generated: 2026-06-06 19:08 CEST

## Rollback Point

Backup root:

`/opt/backups/promotion-rollover-sprint/20260606-1828`

Verified before implementation.

## Backup Contents

| Area | Location | Size |
| --- | --- | ---: |
| Database dump | `/opt/backups/promotion-rollover-sprint/20260606-1828/database/schoolerp-promotion-rollover-before.dump` | 506K |
| Application source | `/opt/backups/promotion-rollover-sprint/20260606-1828/source/tottech-one-source.tar.gz` | 129M |
| Prisma | `/opt/backups/promotion-rollover-sprint/20260606-1828/prisma/prisma.tar.gz` | 30K |
| Env snapshot | `/opt/backups/promotion-rollover-sprint/20260606-1828/env/env.snapshot` | 549B |
| Public uploads | `/opt/backups/promotion-rollover-sprint/20260606-1828/uploads/public-uploads.tar.gz` | 136B |
| Documents | `/opt/backups/promotion-rollover-sprint/20260606-1828/documents/app-documents.tar.gz` | 494B |
| APK/downloads | `/opt/backups/promotion-rollover-sprint/20260606-1828/apk/public-downloads.tar.gz` | 70M |
| Nginx | `/opt/backups/promotion-rollover-sprint/20260606-1828/nginx/nginx-config.tar.gz` | 7.2K |
| PM2 | `/opt/backups/promotion-rollover-sprint/20260606-1828/pm2/pm2-state.tar.gz` | 15K |

## Verification

- `pg_restore -l` succeeded.
- Source, Prisma, uploads, documents, and APK archives passed `tar -tzf`.
- PM2 and Nginx snapshots were written.

## Restore Commands

Database:

```bash
pg_restore --clean --if-exists -d schoolerp /opt/backups/promotion-rollover-sprint/20260606-1828/database/schoolerp-promotion-rollover-before.dump
```

Source:

```bash
tar -xzf /opt/backups/promotion-rollover-sprint/20260606-1828/source/tottech-one-source.tar.gz -C /opt
```

PM2/Nginx:

Restore the archived config files from the backup root, then run `nginx -t`, restart Nginx, and restart `tottech-one`.

