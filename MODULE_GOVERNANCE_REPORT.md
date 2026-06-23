# Module Governance Report

Generated: 2026-06-20

## Scope

School-level SaaS module governance for TOTTECH ONE, including visual control center, menu visibility, and server-side API enforcement.

## Existing Foundation Verified

The following tables exist in production:

- `school_module_access`
- `user_school_access`
- `user_login_history`

The route `/platform/subscriptions` is live and accessible to SUPER_ADMIN.

## Fix Applied

- Standardized the sidebar label to `School Governance`.
- Confirmed module entitlements are visible in the School Subscription Management screen.
- Confirmed SUPER_ADMIN context exposes the canonical module set:
  - `STUDENTS`
  - `TEACHERS`
  - `ACADEMICS`
  - `FINANCE`
  - `OPERATIONS`
  - `DINING`
  - `TRANSPORT`
  - `HOSTEL`
  - `REPORTS`
  - `ANALYTICS`
  - `AI`
  - `USER_MANAGEMENT`
  - `PARENT_PORTAL`
  - `MOBILE_APP`
- New routes use `requireSchoolModule(...)` where appropriate:
  - Finance Expenses: `FINANCE`
  - Parent Attendance Declaration: `PARENT_PORTAL`
  - PTM: `PARENT_PORTAL`
  - Feedback/Complaints: `PARENT_PORTAL`

## Files Modified

- `components/Sidebar.tsx`
- `app/api/finance/expenses/route.ts`
- `app/api/parent-attendance-declarations/route.ts`
- `app/api/ptm/route.ts`
- `app/api/feedback/route.ts`

## Validation

- `/platform/subscriptions` returns `HTTP/1.1 200 OK`.
- Screenshot confirms module toggles and enabled module counts:
  - `/opt/tottech-one/post-uat-screenshots/school-governance.png`
- Live context API returned full module access for SUPER_ADMIN.
- Disabled-module API behavior is implemented through `requireSchoolModule(...)`; populated per-school negative tests should be repeated with a non-SUPER_ADMIN assigned to Starter/Professional/Enterprise schools.

## Evidence

- Build: `npm run build` passed.
- Deployment: `pm2 restart tottech-one --update-env && pm2 save` completed.
- Production route: `https://erp.tottechsolutions.com/platform/subscriptions`

## Remaining Gap

The sprint did not exhaustively retrofit every legacy API in the application. New and touched APIs are guarded. A full route-by-route module-gating audit is still recommended before paid onboarding.
