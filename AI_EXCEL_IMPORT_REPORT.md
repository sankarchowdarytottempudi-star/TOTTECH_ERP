# TOTTECH AI Excel Import Report

Date: 2026-06-08

## Objective

Allow real production data to be loaded through TOTTECH AI using Excel or CSV files.

## Implemented

- Added `/api/tottech-ai/imports`.
- Added validation-first Excel parsing using `xlsx`.
- Added AI Excel Import panel inside the TOTTECH AI chat workspace.
- Import flow supports:
  - Analyze-only mode.
  - Missing-column detection.
  - Row-level validation errors.
  - Template column suggestions.
  - Explicit "Load valid rows now" mode for database writes.
  - Import job tracking in `import_jobs`.

## Supported TOTTECH ONE Modules

- Classes
- Sections
- Subjects
- Students
- Teachers
- Fee Categories
- Transport Routes
- Hostels
- Dining Meal Plans
- Dining Weekly Menus

All TOTTECH ONE imports require selected school and selected academic year context.

## Supported Clinical Services Modules

- Patients
- Doctors
- Appointments
- OP Visits
- IP Admissions
- Lab Orders
- Radiology Orders
- Billing Invoices
- Insurance Claims
- Pharmacy Medicines
- Pharmacy Inventory
- IVF Couples
- IVF Cycles
- Clinical HR Employees

Clinical imports use the configured tenant, hospital, and branch context.

## Safety Behavior

If required fields are missing, TOTTECH AI returns:

- Missing required fields.
- Detected Excel columns.
- Required columns.
- Recommended columns.
- A template column list.

No data is inserted unless validation passes and the user enables "Load valid rows now".

## Context Fix

The shared platform context resolver now reads:

- `active_school_id`
- `active_academic_year_id`

This ensures SUPER_ADMIN-selected school and academic-year context is honored by imports and context-aware APIs.

The `/api/my-school` and `/api/academic-years` endpoints were also updated to read the selected context cookies, so the header selectors do not drift away from the active API context.

## Validation

Production build passed after implementation:

```bash
npm run build
```

The new route is present in the build output:

`/api/tottech-ai/imports`
