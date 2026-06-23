# TOTTECH ONE Multi-School User Access Report

Generated: 2026-06-19 12:02 Europe/Berlin

## Status

IMPLEMENTED AND DEPLOYED

## Backup

Backup location:

`/opt/backups/multi-school-user-access/20260619-1119`

Backup report:

`/opt/tottech-one/MULTI_SCHOOL_USER_ACCESS_BACKUP_REPORT.md`

Backup verification:

PASS

Artifacts verified:

- Database dump
- Database schema
- Source archive
- Prisma schema and migrations
- Uploads archive
- PM2 process snapshot
- Environment files
- SHA256 checksum manifest

## Database Changes

Created migration:

`prisma/migrations/202606191119_multi_school_user_access/migration.sql`

Added table:

`user_school_access`

Fields:

- `id`
- `user_id`
- `school_id`
- `is_primary`
- `is_active`
- `created_at`
- `created_by`

Constraints and indexes:

- Unique: `user_id + school_id`
- Index: `user_id + is_active`
- Index: `school_id + is_active`
- FK: `user_id -> users.id`
- FK: `school_id -> schools.id`

Backfill:

Existing `users.school_id` records were copied into `user_school_access` as primary active school assignments.

## API Changes

Implemented school-assignment enforcement in:

- `lib/school-access.ts`
- `lib/auth.ts`
- `app/api/auth/login/route.ts`
- `app/api/school-context/route.ts`
- `app/api/my-school/route.ts`
- `app/api/schools/route.ts`
- `app/api/switch-school/route.ts`
- `app/api/users/route.ts`
- `app/api/users/[id]/route.ts`
- `lib/governance/rbac.ts`

Security behavior:

- `/api/schools` now requires login.
- Non-super-admin users only receive assigned schools.
- Non-super-admin users cannot switch to `All Schools`.
- Switching to an unassigned school returns HTTP 403.
- User management API only exposes users from the manager's assigned schools.

## UI Changes

Implemented:

- `/select-school` post-login school selection screen.
- User Management multi-school assignment control.
- Select All Schools button.
- Primary School selector.
- User cards showing Primary School and Additional Schools.
- Header school switcher enabled for assigned multi-school users.

## Role Validation

Role behavior implemented:

- `SUPER_ADMIN`: All schools and all-school context.
- `OWNER`: Assigned schools only.
- `ADMIN`: Assigned schools only.
- `PRINCIPAL`: Assigned school access.
- `TEACHER`: Assigned school access.

Global all-school access is now restricted to `SUPER_ADMIN`.

## Validation Data

Created validation schools:

- School A: `MSUA School A 202606190954`, ID `10`
- School B: `MSUA School B 202606190954`, ID `11`
- School C: `MSUA School C 202606190954`, ID `12`

Created validation user:

- Username: `msua_admin_202606190954`
- Role: `ADMIN`
- Assigned schools: School A and School B
- Not assigned: School C

## API Evidence

Login:

- Result: PASS
- Redirect: `/select-school`
- Assigned schools returned: School A and School B

School list:

- Result: PASS
- `/api/schools` returned only School A and School B.
- School C was not visible.

School switch:

- Switch to School B: PASS
- `/api/my-school` returned School B after switch.

Unauthorized school switch:

- Attempt to switch to School C: PASS
- Response: HTTP 403
- Error: `You are not assigned to this school.`

Anonymous school list:

- Result: PASS
- `/api/schools` without login returned HTTP 401.

User management scope:

- Result: PASS
- Validation admin saw only users scoped to assigned schools.

## Screenshot Evidence

Screenshots saved:

- `validation-screenshots/multi-school-user-access/select-school.png`
- `validation-screenshots/multi-school-user-access/user-management.png`

## Deployment Evidence

Commands executed:

- `npx prisma generate`
- `npx prisma migrate deploy`
- `npm run build`
- `pm2 restart tottech-one --update-env`

Build:

- PASS

Migration:

- PASS
- No pending migrations after deployment.

PM2:

- Process: `tottech-one`
- Status: `online`
- Restart count after deployment: `2`

Production URL check:

- `https://erp.tottechsolutions.com/login`
- Result: HTTP 200

## Security Validation Summary

| Check | Status |
| --- | --- |
| User can belong to multiple schools | PASS |
| Multi-school user redirected to school selector | PASS |
| Single active school stored in session cookie | PASS |
| Non-super-admin school list filtered | PASS |
| Non-super-admin cannot select All Schools | PASS |
| Non-super-admin cannot access unassigned School C | PASS |
| Anonymous school list blocked | PASS |
| User management scoped by assigned schools | PASS |
| Prisma migration deployed | PASS |
| Production build deployed | PASS |

## Result

TOTTECH ONE now supports multi-school user assignment through `user_school_access`.

The deployed application enforces assigned-school context in authentication, school switching, school listing, user management, and current-school resolution.

