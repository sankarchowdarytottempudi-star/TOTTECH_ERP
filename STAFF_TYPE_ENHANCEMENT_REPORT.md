# Staff Type Enhancement Report

## Summary

The Teacher module has been expanded into School Staff Management by adding a `staff_type` split between Teaching and Non-Teaching staff.

## Database Changes

- Added `staff_type` to `teachers` with default `Teaching`.
- Added `subject_specialization` to `teachers`.
- Added `classes_handling` and `sections_handling` JSON columns to `teachers`.
- Added matching migration SQL:
  - `prisma/migrations/202606211600_staff_type_enhancement/migration.sql`

## UI Changes

### Staff Create

- Added Staff Type selector.
- Teaching staff now show:
  - Designation options for academic staff
  - Subject specialization multi-select
  - Classes handling multi-select
  - Sections handling multi-select
- Non-Teaching staff now show:
  - Department selector
  - Non-teaching designation selector

### Staff Edit

- Same conditional staff type behavior was added to the edit form.

### Staff View / 360

- Staff type is now shown on the teacher detail page.
- Subject specialization, classes handling, and sections handling are visible in staff detail output.

### Staff Search / Filters

- Search text now includes staff type.
- Staff type filter was added to the teacher listing page.
- Teacher cards now show the current staff type badge.

## API Changes

- `POST /api/teachers`
- `PUT /api/teachers/[id]`
- `GET /api/teachers`

These routes now persist and filter staff type, subject specialization, and handling assignments.

## Validation

- `npm run build` completed successfully after the implementation.

## Notes

- No new module was created.
- The existing Teacher module was converted into a staff-oriented workflow without removing current school teacher behavior.
