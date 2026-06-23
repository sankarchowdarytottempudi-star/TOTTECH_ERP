# Clinical Hospital OS Dashboard Redesign Report

Date: 2026-06-07

## Scope

Redesigned TOTTECH Clinical Services operational dashboards and module templates to behave like a Hospital Operating System instead of a configuration portal.

## Delivered

- Added reusable `DashboardCard` component with:
  - Click navigation
  - Hover state
  - Pointer cursor
  - Refresh hook
  - Export action
  - Loading state support
  - Permission hook support
- Added reusable operational components:
  - `QuickActionsPanel`
  - `OperationalPanel`
  - `ClickableBarChart`
- Removed `Configured Forms` and `Audit Activity` from operational dashboard/module pages.
- Kept `Configured Forms` only on `/clinical-services/forms`.
- Reworked the clinical dashboard with:
  - Quick Actions
  - Recent Patients
  - Today's Schedule
  - Revenue Breakdown
  - Department Performance
  - Pending Tasks
  - Alerts
  - Notifications
  - Patients Waiting
- Made KPI cards clickable on:
  - Clinical dashboard
  - Generic clinical module page
  - HMS landing and HMS module pages
  - IVF landing and IVF module pages
  - Pharmacy landing and Pharmacy module pages
  - Finance landing and Finance module pages
  - HRMS landing and HRMS module pages
- Made key operational rows clickable:
  - Patient cards already route to Patient 360
  - Appointment queue rows route to patient/appointment context
  - Doctor cards route to doctor context
  - HMS rows route to patient/module context
  - IVF rows route to IVF 360/cycle context
  - Pharmacy rows route to medicine/patient/module context
  - Finance rows route to patient/claim/invoice/module context
  - HRMS rows route to owning HRMS module

## Files Changed

- `components/clinical/EnterpriseDashboard.tsx`
- `app/api/clinical/dashboard/route.ts`
- `app/clinical-services/page.tsx`
- `app/clinical-services/[module]/page.tsx`
- `app/clinical-services/hms/page.tsx`
- `app/clinical-services/hms/[module]/page.tsx`
- `app/clinical-services/ivf/page.tsx`
- `app/clinical-services/ivf/[module]/page.tsx`
- `app/clinical-services/pharmacy/page.tsx`
- `app/clinical-services/pharmacy/[module]/page.tsx`
- `app/clinical-services/finance/page.tsx`
- `app/clinical-services/finance/[module]/page.tsx`
- `app/clinical-services/hrms/page.tsx`
- `app/clinical-services/hrms/[module]/page.tsx`
- `app/clinical-services/appointments/page.tsx`
- `app/clinical-services/doctors/page.tsx`

## Verification

- `npm run build`: passed.
- `pm2 restart tottech-one --update-env`: passed.
- `pm2 save`: passed.
- Runtime smoke tests returned `200`:
  - `/api/clinical/dashboard`
  - `/clinical-services`
  - `/clinical-services/hms`
  - `/clinical-services/ivf`
  - `/clinical-services/pharmacy`
  - `/clinical-services/finance`
  - `/clinical-services/hrms`
  - `/clinical-services/appointments`
- Live HTTPS smoke tests returned `200`:
  - `https://erp.tottechsolutions.com/clinical-services`
  - `https://erp.tottechsolutions.com/clinical-services/hms`
  - `https://erp.tottechsolutions.com/clinical-services/finance`

