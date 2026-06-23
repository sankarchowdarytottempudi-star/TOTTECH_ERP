# Admin Access Report

Generated: 2026-06-20

## Scope

Post-UAT verification and correction for ADMIN/SUPER_ADMIN access after module governance and multi-school access work.

## Root Cause

ADMIN access issues were caused by a combination of school-module entitlement checks and menu rendering. The platform already had user-school access and module access foundations, but ADMIN users could appear restricted when the active school module snapshot did not include the operational modules or when the menu did not render the newly exposed routes.

## Fix Applied

- Preserved server-side access enforcement through `requireSchoolModule(...)`.
- Verified SUPER_ADMIN login succeeds through the unified platform login.
- Added new governed menu entries for:
  - School Governance
  - Finance Expenses
  - Parent Teacher Meetings
  - Complaints & Suggestions
  - Parent Attendance Declaration
- Kept module-gated pages behind API checks instead of relying only on sidebar hiding.

## Files Modified

- `components/Sidebar.tsx`
- `app/api/finance/expenses/route.ts`
- `app/api/parent-attendance-declarations/route.ts`
- `app/api/ptm/route.ts`
- `app/api/feedback/route.ts`

## Validation

- Login API:
  - `POST /api/auth/login`
  - User: `admin@erp.com`
  - Platform: `EDUCATIONAL`
  - Result: `success=true`, role `SUPER_ADMIN`
- Live pages returned `HTTP/1.1 200 OK`:
  - `/finance/expenses`
  - `/teachers`
  - `/academics/classes`
  - `/ptm`
  - `/communication/feedback`
  - `/parent/attendance-declaration`
  - `/platform/subscriptions`
- PM2 app:
  - `tottech-one`
  - Status: `online`

## Screenshot Evidence

- `/opt/tottech-one/post-uat-screenshots/dashboard.png`
- `/opt/tottech-one/post-uat-screenshots/school-governance.png`
- `/opt/tottech-one/post-uat-screenshots/finance-expenses.png`
- `/opt/tottech-one/post-uat-screenshots/teachers.png`

## Remaining Gap

ADMIN role behavior should still be validated with a real non-super-admin ADMIN user assigned to one school and one limited module plan. SUPER_ADMIN validation passed; role-specific field-level restrictions were not exhaustively tested with populated school data.
