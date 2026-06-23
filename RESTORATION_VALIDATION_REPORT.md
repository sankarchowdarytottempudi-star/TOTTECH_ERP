# RESTORATION VALIDATION REPORT

Generated: 2026-06-05  
Workspace: `/opt/tottech-one-rebuild`  
Evidence preserved: `/opt/recovery` was not overwritten.

## Phase 0 Gate

`/opt/recovery/LOST_FEATURES_MATRIX.md` exists and was generated before rebuild work began.

## Database Restore

Recovered dump restored into PostgreSQL 16 after recreating the compatibility role expected by the dump.

Baseline recovered data:

| Entity | Count |
|---|---:|
| Schools | 2 |
| Students | 1003 |
| Teachers | 51 |
| Users | 2 |
| Roles | 12 |
| Original permissions | 68 |
| Classes | 20 |
| Sections | 61 |
| Attendance master rows | 206 |

Applied reconstruction migrations:

1. `202606051535_enterprise_reconstruction`
2. `202606051610_ai_governance_completion`
3. `202606051625_academic_year_guard`

## Runtime Route Validation

Validated locally through `next start` against restored PostgreSQL:

| Route | Status |
|---|---:|
| `/login` | 200 |
| `/dashboard` | 200 |
| `/students` | 200 |
| `/teachers` | 200 |
| `/attendance` | 200 |
| `/finance` | 200 |
| `/transport` | 200 |
| `/hostel` | 200 |
| `/dining` | 200 |
| `/operations` | 200 |
| `/reports` | 200 |
| `/imports` | 200 |
| `/finance/concessions` | 200 |
| `/api/school-context` | 200 |
| `/api/debug/school-context` | 200 |
| `/api/tottech-ai/health` | 200 |
| `/api/tottech-ai/providers` | 200 |
| `/api/operations/health` | 200 |
| `/api/concessions` | 200 |
| `/api/dining` | 200 |

## Validation Commands

| Check | Result |
|---|---|
| `npm ci` | PASS, 5 moderate npm advisories in web dependencies |
| `npx prisma validate` | PASS |
| `npx prisma generate` | PASS |
| SQL dump restore | PASS |
| Enterprise migrations | PASS |
| `npm run build` | PASS, 155 app routes |
| `npm run lint` | FAIL, 203 errors and 20 warnings from recovered lint debt |
| Mobile `npm install` | PASS, 0 vulnerabilities |
| Mobile `npm run typecheck` | PASS |
| Mobile `npm run android` | BLOCKED, no recovered native `android/` project/signing files |

## Audit Results

| Audit | Result |
|---|---|
| RBAC | 12 roles, 86 permissions, 86 role-permission links, DB-backed menu/page/module permission tables seeded |
| Academic Year | Repaired to one current academic year per school with a partial unique index |
| Governance | 4 settings, 6 feature flags, 1 change-impact report |
| AI | 9 providers, 1 deterministic model, 108 role-access rows, 2 usage logs, 1 health check, 8 grounding sources |
| Timeline | Event ledger active; AI calls created school timeline rows |
| Operational History | Dining/hostel/transport attendance tables exist; no historical rows recovered |

## Production Status

Live VPS cutover completed on 2026-06-05.

`https://erp.tottechsolutions.com` is online behind Nginx and Let's Encrypt SSL. PM2 is running `tottech-one` from `/opt/tottech-one` on port 3000, with `pm2-root` enabled and active for startup resurrection.

Final live validation:

| Check | Result |
|---|---|
| Root URL with redirects | 200 |
| `/login` | 200 |
| `/dashboard` | 200 |
| `/students` | 200 |
| `/teachers` | 200 |
| `/attendance` | 200 |
| `/finance` | 200 |
| `/transport` | 200 |
| `/hostel` | 200 |
| `/dining` | 200 |
| `/api/tottech-ai/health` authenticated | 200 |
| APK download | 200, 62,489,698 bytes |

Detailed terminal output is recorded in `/opt/tottech-one/EMERGENCY_RECOVERY_EXECUTION_REPORT.md`.

## Remaining Blockers

- Original production VPS data, uploads, documents, and raw PostgreSQL volume are still missing.
- ESLint does not pass due recovered-code lint debt.
- Android native project and signing keys are missing; mobile source typechecks but cannot produce an APK yet.
- Some legacy UI components still contain hardcoded role-name display logic.
- Non-SUPER_ADMIN role permission mapping needs a business-approved RBAC profile; current restored permission links grant all permissions to SUPER_ADMIN only.
