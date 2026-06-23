# Clinical Enterprise Modules Backup Report

Generated: 2026-06-09

## Backup Location

`/opt/backups/clinical-enterprise-modules/20260609-1537`

## Backup Contents

- Application source archive: `tottech-one-source.tar.gz`
- Environment backup: `env.backup`
- Prisma archive: `prisma.tar.gz`
- PM2 dump: `pm2-dump.pm2`
- Nginx archive: `nginx.tar.gz`

## Backup Size

793M

## Restore Outline

1. Stop the application:
   `pm2 stop tottech-one`
2. Restore source:
   `tar -xzf /opt/backups/clinical-enterprise-modules/20260609-1537/tottech-one-source.tar.gz -C /opt`
3. Restore environment:
   `cp /opt/backups/clinical-enterprise-modules/20260609-1537/env.backup /opt/tottech-one/.env`
4. Reinstall/build if needed:
   `cd /opt/tottech-one && npm install && npm run build`
5. Restore PM2:
   `cp /opt/backups/clinical-enterprise-modules/20260609-1537/pm2-dump.pm2 /root/.pm2/dump.pm2 && pm2 resurrect`

## Verification

Backup directory was created and measured successfully before implementation.
