# CHANGE IMPACT REPORT - RECOVERY CUTOVER 20260605

Generated: 2026-06-05  
Change: Emergency production recovery, SQL restore, enterprise reconstruction, TOTTECH AI gateway deployment, Nginx/SSL/PM2 cutover.

## Affected Modules

- Authentication and session handling
- Dashboard
- Students
- Teachers
- Attendance
- Finance and concessions
- Transport
- Hostel
- Dining
- Parent portal
- War Room
- Operations
- Reports
- Imports
- Governance/RBAC
- Academic years
- TOTTECH AI
- Mobile APK distribution

## Affected APIs

- `/api/auth/login`
- `/api/dashboard`
- `/api/students`
- `/api/teachers`
- `/api/attendance`
- `/api/finance`
- `/api/transport`
- `/api/hostels`
- `/api/dining`
- `/api/concessions/*`
- `/api/school-context`
- `/api/debug/school-context`
- `/api/operations/*`
- `/api/reports`
- `/api/imports`
- `/api/tottech-ai/*`

## Affected Mobile Screens

- Students
- Teachers
- Attendance
- Finance
- Transport
- Hostel
- Dining
- War Room
- Automation
- Governance
- Parent Portal
- SchoolGPT
- Notifications
- User Management

The latest recovered APK is served unchanged from `/downloads/app-release.apk`. Rebuilt React Native source typechecks, but native Android project/signing material remains missing.

## Affected Reports

- `EMERGENCY_RECOVERY_EXECUTION_REPORT.md`
- `RESTORATION_VALIDATION_REPORT.md`
- `PLATFORM_READINESS_REPORT.md`
- `MOBILE_READINESS.md`

## Affected RBAC Permissions

Permission table increased to 86 rows. SUPER_ADMIN has all 86 permission links. Menu/page/module permission tables are database-backed and seeded.

Known gap: 11 non-SUPER_ADMIN roles currently have no role-permission links in restored data. Business-approved permission profiles are required before enabling those accounts broadly.

## Affected Timelines

- `event_ledger` exists and contains recovery/AI events.
- `school_timelines` contains one recovery/AI timeline row.
- `student_timelines`, `teacher_timelines`, and `class_timelines` exist but have no recovered historical rows.

## Affected AI Grounding

TOTTECH AI now grounds responses through:

- School context
- Academic year context
- Authenticated user/RBAC context
- ERP counts and records
- Event ledger/timeline structures where available

External providers are disabled until credentials are configured by an authorized administrator. Deterministic recovery fallback is active.

## Deployment Validation

- Production build passed.
- Prisma validation passed.
- PostgreSQL restore passed.
- Nginx syntax check passed.
- SSL issued and active.
- PM2 process online.
- Mobile typecheck passed.
- ESLint failed with recovered-source lint debt: 203 errors, 20 warnings.

## Residual Risk

- Missing production uploads/documents if no separate backup exists.
- Missing native Android source/signing keys.
- Legacy hardcoded role branches remain in recovered code.
- Non-admin RBAC mapping needs approval.
- Provider credential encryption and production AI billing controls should be hardened before enabling external AI providers.
