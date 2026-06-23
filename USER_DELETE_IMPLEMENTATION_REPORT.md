# User Delete Implementation Report

Date: 2026-06-19

## Implemented

- Added soft-delete support to shared `users` table:
  - `is_deleted`
  - `deleted_at`
  - `deleted_by`
- Updated Clinical Services user API:
  - Active users list excludes deleted users.
  - Deleted users list is available through `?deleted=true`.
  - Actions supported: activate, deactivate, lock, archive, soft delete, restore, permanent delete.
- Soft delete now updates both:
  - `users`
  - `clinical_user_profiles`
- Login blocks deleted users with `COALESCE(u.is_deleted,false) = false`.
- User Management UI now includes:
  - Active Users tab
  - Deleted Users tab
  - Restore User
  - Permanent Delete User
  - Lock User
  - Reset Password

## Safety Rule

Permanent delete is attempted only for already-deleted users. If the user is referenced by clinical records or audit history, the API returns `409` and keeps the user archived.

## Validation

- `npx prisma generate`: passed.
- `npm run build`: passed.
