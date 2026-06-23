# TOTTECH ONE User Lifecycle Report

Generated: 2026-06-19 13:27 CEST

## Scope

Implemented safe SaaS user lifecycle controls for Educational users.

## Database Changes

- Added lifecycle fields to `users`:
  - `locked_at`
  - `locked_by`
  - `archived_at`
  - `archived_by`
  - `updated_at`
- Standardized user statuses:
  - `ACTIVE`
  - `INACTIVE`
  - `LOCKED`
  - `ARCHIVED`
- Added `user_login_history` for login success, failure, and blocked-account evidence.

## Login Enforcement

`/api/auth/login` now allows login only when:

- `status = ACTIVE`
- `is_active = true`
- `is_deleted = false`

Blocked states return clear errors:

- `INACTIVE`: user account is inactive.
- `LOCKED`: user account is locked.
- `ARCHIVED`: user account is archived.

Every failed, blocked, or successful login writes a `user_login_history` row.

## Lifecycle API

Implemented `PATCH /api/users/[id]` actions:

- `DISABLE`
- `LOCK`
- `ARCHIVE`
- `RESTORE`

No hard-delete user endpoint was added.

Each lifecycle action:

- Preserves historical creator/approval references.
- Updates only user status/lifecycle metadata.
- Writes an `audit_logs` record.

## User Management UI

Updated `/settings/users` with:

- Status badge
- Status filter
- Disable action
- Lock action
- Archive action
- Restore action
- Reset password action
- User history action

Added `GET /api/users/[id]/history` returning:

- Login history
- Lifecycle audit history

## Security

User-management APIs are now protected by the school module entitlement `USER_MANAGEMENT`.

If the selected school does not have `USER_MANAGEMENT`, APIs return:

`403 This module is not enabled for the selected school subscription.`

## Database Evidence

Post-migration snapshot:

- Users by status:
  - `ACTIVE`: 62
  - `INACTIVE`: 4
- `user_login_history` rows at deployment time: 0

Rows will populate from the next login attempts after this deployment.

## Validation

Completed:

- Prisma client generation passed.
- Migration deployed successfully.
- Production build passed.
- PM2 restarted.
- Live login route returned HTTP 200.

Recommended manual UAT:

- Disable one non-production user and verify login is blocked.
- Lock one non-production user and verify login is blocked.
- Archive one non-production user and verify it appears under Archived filter.
- Restore the user and verify login succeeds when status is `ACTIVE`.

