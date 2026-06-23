# AUTHENTICATION PLATFORM SEPARATION REPORT

Generated: 2026-06-13

## Objective

Allow normal usernames across both products while ensuring authentication is scoped by the selected platform.

Example:

- `admin` + Educational authenticates against TOTTECH ONE users.
- `admin` + Clinical authenticates against TOTTECH Clinical Services users.
- `doctor1` + Clinical is valid.
- `doctor1` + Educational is rejected because the user does not exist in the Educational platform.

## Authentication Change

The login API now accepts:

```json
{
  "username": "admin",
  "password": "********",
  "platform_type": "EDUCATIONAL"
}
```

or:

```json
{
  "username": "admin",
  "password": "********",
  "platform_type": "CLINICAL"
}
```

The lookup now filters by:

- `platform_type`
- `username`
- active `status`
- active user flag

The API keeps email login compatibility, but platform separation is authoritative.

## Runtime API Validation

Validation was performed against the running app on `127.0.0.1:3000`.

| Test | Result | Meaning |
|---|---|---|
| `admin` + `EDUCATIONAL` + wrong password | `Invalid Password` | Educational `admin` exists and platform lookup succeeded |
| `admin` + `CLINICAL` + wrong password | `Invalid Password` | Clinical `admin` exists and platform lookup succeeded |
| `doctor1` + `CLINICAL` + wrong password | `Invalid Password` | Clinical `doctor1` exists and platform lookup succeeded |
| `doctor1` + `EDUCATIONAL` + wrong password | `Invalid username or platform.` | Platform separation correctly blocked cross-platform lookup |

Password success testing was not performed because existing production passwords were not changed or exposed.

## Cookie/User Session Payload

The authenticated user payload now includes:

- `username`
- `platform_type`
- `project`
- `projectType`
- `redirectTo`

This allows the frontend and server context to route users without relying on username prefixes.

## Database Rules

The migration enforces:

- Same username may exist on different platforms.
- Same username may not duplicate inside the same platform.

Unique index:

```sql
users_platform_username_unique
```

## Clinical User Creation

Clinical user creation paths now write:

- `username`
- `platform_type = 'CLINICAL'`
- `status`

Updated routes:

- `app/api/clinical/operations/admin-users/route.ts`
- `app/api/clinical/platform/hospitals/route.ts`

## Educational User Behavior

Existing TOTTECH ONE users were migrated to:

- `platform_type = 'EDUCATIONAL'`

Example users:

- `admin`
- `principal1`

## Clinical User Behavior

Existing Clinical Services users were migrated to:

- `platform_type = 'CLINICAL'`

Example users:

- `admin`
- `doctor1`
- `reception`
- `labtech`
- `pharmacy1`

## Prefix Dependency Status

The login authentication path no longer requires:

- `CS-`
- `HMS-`
- `IVF-`

Legacy prefix helpers remain only as compatibility fallback for older server-side context paths and old cookies. New login sessions use `platform_type`.

## Screenshot Evidence

- `reports/platform-login-education.png`
- `reports/platform-login-clinical.png`

## Status

Authentication platform separation is implemented, built, restarted, and validated against the running application.
