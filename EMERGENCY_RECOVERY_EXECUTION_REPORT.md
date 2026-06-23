# EMERGENCY RECOVERY EXECUTION REPORT

Generated: 2026-06-05T16:05:23+02:00  
Target: https://erp.tottechsolutions.com  
Live application path: `/opt/tottech-one`  
Recovery evidence path: `/opt/recovery`  

## Result

TOTTECH ONE is online behind Nginx and Let's Encrypt SSL. The PostgreSQL dump was restored, the recovered application was rebuilt, the reconstructed enterprise/TOTTECH AI recovery layer was applied, PM2 is running under systemd startup, and the latest recovered APK is downloadable.

Admin credentials were rotated and stored root-only at:

`/root/tottech-one-admin-credentials.txt`

Secrets are intentionally not printed in this report.

## Phase 1 - Server Bootstrap

Installed and verified:

```text
node -v          v22.22.3
npm -v           10.9.8
pm2 -v           7.0.1
psql --version   psql (PostgreSQL) 16.14 (Ubuntu 16.14-1.pgdg22.04+1)
nginx -v         nginx/1.18.0 (Ubuntu)
certbot          certbot 1.21.0
openssl          OpenSSL 3.0.2 15 Mar 2022
git              git version 2.34.1
```

Services:

```text
postgresql=active
nginx=active
pm2-root=enabled/active
```

## Phase 2 - Application Restore

Recovered source was copied from:

`/opt/recovery/opt/school-erp/frontend`

to:

`/opt/tottech-one`

Recovery originals were not modified.

Build validation:

```text
npm install            PASS
npx prisma generate    PASS
npx prisma validate    PASS - schema valid
npm run build          PASS - Next.js 16.2.6, 155 app routes
```

Build output summary:

```text
Compiled successfully
Running TypeScript
Generating static pages (155/155)
Route count includes /dashboard and /api/tottech-ai/*
```

## Phase 3 - Database Restore

Restored dump:

`/opt/recovery/opt/backups/schoolerp_before_seed.sql`

Database:

```text
database: schoolerp
user: schooladmin
```

Final database audit:

```text
tables                         100
foreign_keys                   24
schools                        2
students                       1003
teachers                       51
users                          2
roles                          12
permissions                    86
role_permissions               86
classes                        20
sections                       61
academic_years                 3
schools_without_current_year   0
attendance_master              206
event_ledger                   2
student_timelines              0
teacher_timelines              0
class_timelines                0
school_timelines               1
concession_requests            0
concession_audit_logs          0
ai_providers                   9
ai_models                      1
ai_usage_logs                  1
ai_health_checks               1
ai_role_access                 108
governance_settings            4
feature_flags                  6
menu_permissions               6
page_permissions               8
module_permissions             11
```

Academic-year repair performed after validation found school 2 had no current year:

```text
INSERTED: school_id=2, academic_year=2025-2026, start_date=2025-06-01, end_date=2026-04-30, is_current=true
schools_without_current_year  0
current_years                 2
```

## Phase 4 - Environment

Production `.env` was created at:

`/opt/tottech-one/.env`

Mode:

```text
600
```

Rotated variables include:

```text
DATABASE_URL
SESSION_SECRET
JWT_SECRET
NEXT_PUBLIC_APP_URL
APP_URL
UPLOAD_DIR
DOCUMENT_STORAGE_DIR
SMTP placeholders
```

Recovered passwords were not reused.

## Phase 5 - PM2

Start command:

```text
pm2 start npm --name tottech-one -- start -- -p 3000
pm2 save --force
systemctl start pm2-root
```

Final process status:

```text
tottech-one    online    pid=37464    restarts=2
```

PM2 runtime:

```text
script path       /usr/bin/npm
script args       start -- -p 3000
exec cwd          /opt/tottech-one
node.js version   22.22.3
```

## Phase 6 - Nginx

Configured:

`/etc/nginx/sites-available/erp.tottechsolutions.com`

Validation:

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Ports:

```text
nginx listening on 80 and 443
Next.js listening on 3000
PostgreSQL listening on 127.0.0.1:5432
```

## Phase 7 - SSL

Issued with Certbot:

```text
Certificate Name: erp.tottechsolutions.com
Domains: erp.tottechsolutions.com
Expiry Date: 2026-09-03 12:59:33+00:00
Certificate Path: /etc/letsencrypt/live/erp.tottechsolutions.com/fullchain.pem
Private Key Path: /etc/letsencrypt/live/erp.tottechsolutions.com/privkey.pem
```

HTTPS validation:

```text
root=200 bytes=11389
login=200 bytes=11389
dashboard=200 bytes=25947
```

Direct `/` returns a 307 redirect to `/login`; following redirects returns 200.

## Phase 8 - APK Restoration

Published latest recovered APK:

Source:

`/opt/recovery/downloads/app-release (3).apk`

Target:

`/opt/tottech-one/public/downloads/app-release.apk`

Validation:

```text
apk=200 bytes=62489698
sha256=0499ee6bd15dd83915747f87b42f5a5df04a9a4539e9522293469a0ebe4efdaa
```

Public URL:

`https://erp.tottechsolutions.com/downloads/app-release.apk`

## Phase 9 - Functional Validation

Login API:

```text
login_status=200
user=admin@erp.com
role=SUPER_ADMIN
school=Kakatheeya
```

Authenticated route validation:

```text
/login                         200
/dashboard                     200
/students                      200
/teachers                      200
/attendance                    200
/finance                       200
/transport                     200
/hostel                        200
/dining                        200
/ai-school-copilot             200
/settings/roles                200
/settings/academic-years       200
/parent/dashboard              200
/war-room                      200
/operations                    200
/reports                       200
/imports                       200
/finance/concessions           200
/api/school-context            200
/api/debug/school-context      200
/api/tottech-ai/health         200
/api/tottech-ai/providers      200
/downloads/app-release.apk     200
```

TOTTECH AI completion endpoint:

```text
ai_complete_status=200
provider=deterministic
model=recovery-grounded-v1
fallbackUsed=true
grounded counts: students=1003, teachers=51, attendance records=206
```

The gateway did not call Gemini or any external provider directly. It used the deterministic recovery fallback because provider credentials are not configured.

## Phase 10 - Recovery Gap Reconstruction

Applied reconstructed recovery layer from:

`/opt/tottech-one-rebuild`

to:

`/opt/tottech-one`

Preserved production `.env` and APK. Applied migrations:

```text
202606051535_enterprise_reconstruction
202606051610_ai_governance_completion
202606051625_academic_year_guard
```

Reconstructed tables include:

```text
concession_requests
concession_audit_logs
event_ledger
dining_attendance
hostel_attendance
transport_attendance
student_timelines
teacher_timelines
class_timelines
school_timelines
ai_providers
ai_models
ai_usage_logs
ai_health_checks
ai_policy_profiles
ai_school_limits
governance_settings
feature_flags
menu_permissions
page_permissions
module_permissions
```

## Phase 11 - TOTTECH AI

Implemented gateway routes:

```text
/api/tottech-ai/complete
/api/tottech-ai/governance
/api/tottech-ai/health
/api/tottech-ai/providers
/api/tottech-ai/usage
```

Provider layer records:

```text
Gemini
OpenAI
Claude
DeepSeek
Ollama
Qwen
Mistral
Local Models
Deterministic recovery provider
```

Current state:

```text
ai_providers       9
ai_models          1
ai_role_access     108
ai_usage_logs      1
ai_health_checks   1
```

## Mobile

Recovered/rebuilt React Native source exists at:

`/opt/tottech-one/mobile`

Validation:

```text
npm install         PASS - 506 packages, 0 vulnerabilities
npm run typecheck   PASS
```

Android build remains blocked because no native `android/` project/signing files were recovered. The restored latest APK is being served directly.

## Remaining Risks

```text
npm run lint        FAIL - 203 errors, 20 warnings
hardcoded role refs 55 references in legacy recovered code
roles_without_permissions 11 non-SUPER_ADMIN roles have no role_permissions rows
upload/doc storage no recovered production files beyond the backup contents
external AI providers disabled until credentials and governance approval are configured
```

Recent PM2 error log includes stale post-deployment Server Action mismatch messages from requests made around rebuild/restart. Current route checks pass.

## Readiness Decision

Emergency production recovery is complete:

```text
erp.tottechsolutions.com online     PASS
login working                       PASS
database restored                   PASS
PM2 running                         PASS
PM2 startup enabled and active      PASS
Nginx running                       PASS
SSL active                          PASS
APK downloadable                    PASS
TOTTECH AI gateway established      PASS
enterprise tables reconstructed     PASS
```

Full platform hardening is not complete until lint debt, legacy hardcoded role branches, non-admin role permission mapping, native Android build files, and any missing production uploads/documents are resolved.
