# Clinical Context Auth Report

## Scope

Validated that `GET /api/clinical/context` returns a valid Clinical Services context immediately after login.

## Root Cause

`/api/clinical/context` returned unauthorized because Clinical user detection only accepted the old `CS-*` email convention or `project=tottech_clinical_services`.

Normal Clinical platform usernames now log in with:

- `platform_type=CLINICAL`
- `projectType=CLINICAL`

but the context resolver did not treat those fields as Clinical identity.

## Fixes Applied

- Updated Clinical user detection to accept:
  - `project=tottech_clinical_services`
  - `projectType=CLINICAL`
  - `platform_type=CLINICAL`
  - legacy `CS-*` email users
- Added privileged selected-hospital fallback for:
  - `tottech_super_admin`
  - `clinical_super_admin`
  - `organization_admin`

This prevents 401 after a super admin switches to a hospital where they do not have a direct `clinical_user_profiles` row.

## Expected Context Payload

Validated payload includes:

- `context.user`
- `context.tenantId`
- `context.hospitalId`
- `context.branchId`
- `context.clinicId`
- `context.hospitalName`
- `context.branchName`
- `context.clinicName`
- `context.roleKey`
- `context.branding`
- `hospitals[]`
- `branches[]`
- `clinics[]`
- `departments[]`
- `menu[]`

## Runtime Evidence

Immediately after login:

| Role | Context Status | Hospital | Hospital Count |
| --- | --- | --- | --- |
| `clinical_super_admin` | HTTP 200 | TOTTECH Clinical Services Hospital Network | 2 |
| `clinic_admin` | HTTP 200 | TOTTECH Clinical Services Hospital Network | 1 |
| `doctor` | HTTP 200 | TOTTECH Clinical Services Hospital Network | 1 |
| `receptionist` | HTTP 200 | TOTTECH Clinical Services Hospital Network | 1 |

Unauthenticated request:

- `/api/clinical/context` redirects to `/login` through middleware.

## Role Notes

Tenant 1 currently has `clinic_admin` and `receptionist` role keys configured. It does not have separate `hospital_admin` or `frontdesk` role keys. The closest configured equivalents were validated:

- `clinic_admin` for hospital admin style access
- `receptionist` for front desk access

## Status

PASS
