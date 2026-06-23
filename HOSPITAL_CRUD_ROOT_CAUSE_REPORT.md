# Hospital CRUD Root Cause Report

Generated: 2026-06-13

## Issue

The Hospital Creation Wizard allowed a hospital to be submitted, but Hospital Management was incomplete after save:

- No full hospital list UX.
- No View action.
- No Edit action.
- No Delete action.
- No Activate / Deactivate action.
- No search or status filtering.
- API supported only `GET` and `POST`; it did not support hospital update or soft delete.

## Root Cause

The route `/clinical-services/platform-hospitals` was implemented as a creation wizard plus a small registry card list. It did not provide a full CRUD management surface.

API route:

- `GET /api/clinical/platform/hospitals` existed.
- `POST /api/clinical/platform/hospitals` existed.
- `PATCH /api/clinical/platform/hospitals` was missing.
- `DELETE /api/clinical/platform/hospitals` was missing.

UI route:

- Showed created hospital cards, but only as basic summary cards.
- Did not expose View/Edit/Delete/Activate/Deactivate actions.
- Did not expose searchable/filterable list controls.
- Did not expose hospital details with branches, doctors, staff, compliance, and branding fields.

## Fix Applied

### API

Updated:

- `app/api/clinical/platform/hospitals/route.ts`

Implemented:

- Search by hospital name, code, phone, or email.
- Filter by `ACTIVE`, `INACTIVE`, and `DELETED`.
- Full list fields:
  - Hospital logo/branding
  - Hospital name
  - Hospital code
  - Email
  - Phone
  - Branch count
  - Doctor count
  - Staff count
  - Status
  - Created date
  - Created by
  - Branch details
  - Doctor details
  - Staff details
- `PATCH` update for:
  - Logo
  - Name
  - Address
  - Phone
  - Email
  - GST
  - License
  - NABH
  - ABHA
  - Timezone
  - Currency
  - Status
- `PATCH` action support:
  - `ACTIVATE`
  - `DEACTIVATE`
- `DELETE` support:
  - Soft delete only.
  - Sets `is_deleted = true`.
  - Sets `status = 'DELETED'`.
- Audit logging for create/update/activate/deactivate/delete.

### UI

Updated:

- `app/clinical-services/platform-hospitals/page.tsx`

Implemented:

- Search input.
- Status filter.
- Hospital cards with:
  - Logo
  - Name
  - Code
  - Email
  - Phone
  - Branches count
  - Doctors count
  - Staff count
  - Status
  - Created date
- Actions:
  - View
  - Edit
  - Manage Doctors
  - Manage Staff
  - Manage Branches
  - Activate
  - Deactivate
  - Delete
- Hospital details panel with:
  - Logo
  - Name
  - Code
  - Address
  - GST
  - License
  - NABH
  - ABHA
  - Timezone
  - Currency
  - Doctors
  - Staff
  - Branches
  - Created By
  - Created Date
- Edit flow:
  - Clicking Edit populates the existing form.
  - Save Changes uses `PATCH`.
  - Cancel Edit resets the form.

## Build Result

```text
npm run build
Compiled successfully
Finished TypeScript
Generated static pages successfully
```

## Runtime Deployment

```text
pm2 restart tottech-one --update-env
tottech-one online
```

## Notes

PM2 error logs still contain older IVF and Next.js `/login` stack traces from previous runs. The hospital CRUD validation itself completed without browser console errors or failed browser requests.

