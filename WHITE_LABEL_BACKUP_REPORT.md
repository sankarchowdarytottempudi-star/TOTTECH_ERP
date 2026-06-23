# White Label Backup Report

Timestamp: 20260609-1406
Backup root: /opt/backups/white-label-multi-tenant/20260609-1406

## Backup Paths
/opt/backups/white-label-multi-tenant/20260609-1406/apk/apk-files.tar.gz
/opt/backups/white-label-multi-tenant/20260609-1406/backup-file-sizes.tsv
/opt/backups/white-label-multi-tenant/20260609-1406/config/.env
/opt/backups/white-label-multi-tenant/20260609-1406/database/schoolerp.sql
/opt/backups/white-label-multi-tenant/20260609-1406/documents/README.txt
/opt/backups/white-label-multi-tenant/20260609-1406/nginx/sites-available/default
/opt/backups/white-label-multi-tenant/20260609-1406/nginx/sites-available/erp.tottechsolutions.com
/opt/backups/white-label-multi-tenant/20260609-1406/nginx/sites-available/tottechsoftwaresolutions.com
/opt/backups/white-label-multi-tenant/20260609-1406/pm2/dump.pm2
/opt/backups/white-label-multi-tenant/20260609-1406/pm2/pm2-jlist.json
/opt/backups/white-label-multi-tenant/20260609-1406/prisma/migrations.tar.gz
/opt/backups/white-label-multi-tenant/20260609-1406/prisma/schema.prisma
/opt/backups/white-label-multi-tenant/20260609-1406/source/tottech-one-source.tar.gz
/opt/backups/white-label-multi-tenant/20260609-1406/uploads/uploads.tar.gz

## Backup Sizes
/opt/backups/white-label-multi-tenant/20260609-1406/apk/apk-files.tar.gz	121915633 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/source/tottech-one-source.tar.gz	923263492 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/config/.env	802 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/nginx/sites-available/default	2412 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/nginx/sites-available/tottechsoftwaresolutions.com	2815 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/nginx/sites-available/erp.tottechsolutions.com	1522 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/prisma/schema.prisma	84729 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/prisma/migrations.tar.gz	148491 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/pm2/dump.pm2	24515 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/pm2/pm2-jlist.json	20081 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/uploads/uploads.tar.gz	136 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/database/schoolerp.sql	48732386 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/backup-file-sizes.tsv	0 bytes
/opt/backups/white-label-multi-tenant/20260609-1406/documents/README.txt	17 bytes

## Verification Results
Database dump: VERIFIED
Source archive: VERIFIED
Environment file: VERIFIED
Prisma schema: VERIFIED
Migrations archive: VERIFIED
PM2 dump: VERIFIED

## Restore Commands
systemctl stop nginx || true
pm2 stop tottech-one || true
set -a; source /opt/tottech-one/.env; set +a; psql "${DATABASE_URL%%\?*}" < /opt/backups/white-label-multi-tenant/20260609-1406/database/schoolerp.sql
tar -C /opt -xzf /opt/backups/white-label-multi-tenant/20260609-1406/source/tottech-one-source.tar.gz
cp /opt/backups/white-label-multi-tenant/20260609-1406/config/.env /opt/tottech-one/.env
cp /opt/backups/white-label-multi-tenant/20260609-1406/prisma/schema.prisma /opt/tottech-one/prisma/schema.prisma
tar -C /opt/tottech-one/prisma -xzf /opt/backups/white-label-multi-tenant/20260609-1406/prisma/migrations.tar.gz
cp /opt/backups/white-label-multi-tenant/20260609-1406/pm2/dump.pm2 /root/.pm2/dump.pm2 && pm2 resurrect
nginx -t && systemctl restart nginx

## Rollback Procedure
1. Stop PM2 and Nginx.
2. Restore source archive to /opt/tottech-one.
3. Restore .env, Prisma schema and migrations.
4. Restore database dump.
5. Restore PM2 dump and Nginx configuration.
6. Run npm install if node_modules are absent, then npm run build.
7. Restart PM2 and Nginx.
