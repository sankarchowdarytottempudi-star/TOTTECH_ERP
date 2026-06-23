# RESTORATION STEPS

## 1. Prepare Fresh VPS

Install Docker, Docker Compose, Node 22, PM2, Nginx, and Certbot.

```bash
apt update
apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx
npm install -g pm2
```

## 2. Copy Rebuilt Workspace

Use `/opt/tottech-one-rebuild` as the reconstructed source. Do not deploy from `/opt/recovery`; that directory is forensic evidence.

## 3. Configure Environment

Copy `.env.recovery.example` to `.env` and set rotated production values.

Required variables:

- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`
- `APP_PORT`
- `NEXT_PUBLIC_APP_NAME`
- `TOTTECH_ONE_BRAND`
- `TOTTECH_AI_BRAND`
- `TOTTECH_API_BASE_URL`
- `UPLOAD_DIR`
- `DOCUMENT_STORAGE_DIR`

## 4. Start With Docker Compose

```bash
cd /opt/tottech-one-rebuild
docker compose -f docker-compose.recovery.yml up -d
```

The first database start runs:

1. recovered SQL dump
2. enterprise reconstruction migration
3. AI governance migration
4. academic-year guard migration

If the Postgres volume already exists, init scripts will not rerun. Remove or migrate the volume deliberately only after taking a backup.

## 5. PM2 Alternative

```bash
cd /opt/tottech-one-rebuild
npm ci
npx prisma generate
npm run build
pm2 start ecosystem.config.js
pm2 save
```

## 6. Nginx

Copy `nginx.tottech-one.conf` to:

```bash
/etc/nginx/sites-available/tottech-one.conf
```

Enable it:

```bash
ln -s /etc/nginx/sites-available/tottech-one.conf /etc/nginx/sites-enabled/tottech-one.conf
nginx -t
systemctl reload nginx
```

## 7. SSL

After DNS for `erp.tottechsolutions.com` points to the VPS:

```bash
certbot --nginx -d erp.tottechsolutions.com
```

## 8. Validate

```bash
npx prisma validate
npx prisma generate
npm run build
npm run lint
```

Expected current state:

- Prisma validation passes.
- Production build passes.
- ESLint fails until recovered lint debt is fixed.

Check routes:

```bash
curl -I https://erp.tottechsolutions.com/login
curl -I https://erp.tottechsolutions.com/dashboard
curl -I https://erp.tottechsolutions.com/students
curl -I https://erp.tottechsolutions.com/teachers
curl -I https://erp.tottechsolutions.com/attendance
curl -I https://erp.tottechsolutions.com/finance
curl -I https://erp.tottechsolutions.com/transport
curl -I https://erp.tottechsolutions.com/hostel
curl -I https://erp.tottechsolutions.com/dining
```

## 9. Mobile

Mobile source exists under `mobile/`.

```bash
cd /opt/tottech-one-rebuild/mobile
npm install
npm run typecheck
```

Android release build remains blocked until a native Android project and signing configuration are added or regenerated.
