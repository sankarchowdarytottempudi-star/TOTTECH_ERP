# Authentication Cookie Report

## Scope

Validated Clinical Services login cookie creation and cookie options for the platform login flow.

## Fixes Applied

- Clinical login now sets `erpUser` with `platform_type`, `project`, and `projectType`.
- Clinical login now sets `platform_type=CLINICAL`.
- Clinical login now initializes:
  - `active_hospital_id`
  - `active_branch_id`
  - `active_clinic_id`
- Logout now clears:
  - `erpUser`
  - `platform_type`
  - `active_hospital_id`
  - `active_branch_id`
  - `active_clinic_id`

## Cookie Options

For local HTTP validation:

- `secure=false`
- `sameSite=strict`
- `path=/`
- `erpUser` is `HttpOnly`
- active context cookies are readable by the browser for UI context handling

For production HTTPS behind proxy:

- `secure=true` when `x-forwarded-proto=https` or request URL is HTTPS

## Runtime Evidence

Login API tested with Clinical platform users:

| User | Login | Redirect | Platform Cookie | Context Cookies |
| --- | --- | --- | --- | --- |
| `authfix_super` | PASS | `/clinical-services` | `CLINICAL` | PASS |
| `authfix_clinicadmin` | PASS | `/clinical-services` | `CLINICAL` | PASS |
| `authfix_doctor` | PASS | `/clinical-services` | `CLINICAL` | PASS |
| `authfix_frontdesk` | PASS | `/clinical-services` | `CLINICAL` | PASS |

Observed response cookies:

- `erpUser=<json>; HttpOnly; SameSite=strict`
- `platform_type=CLINICAL; SameSite=strict`
- `active_hospital_id=1; SameSite=strict`
- `active_branch_id=1; SameSite=strict`
- `active_clinic_id=1; SameSite=strict`

## Notes

Temporary validation users were deactivated and their clinical profiles were soft-deleted after testing.

## Status

PASS
