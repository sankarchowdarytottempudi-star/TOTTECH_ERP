# School Compliance Report

## Summary
School recognition and affiliation metadata is now captured in the database and surfaced in the school create/edit/detail flows.

## Database Changes
Added to `schools`:
- `recognition_number`
- `recognition_authority`
- `recognition_start_date`
- `recognition_expiry_date`
- `affiliation_number`
- `affiliation_authority`
- `affiliation_start_date`
- `affiliation_expiry_date`

## UI Changes
- `app/schools/page.tsx`
  - school create form now includes recognition and affiliation fields.
- `app/schools/edit/[id]/page.tsx`
  - edit form now loads and saves recognition and affiliation fields.
- `app/schools/[id]/page.tsx`
  - school detail screen now shows compliance badges and alert cards.

## Validation
- `npx prisma migrate deploy` applied the school lifecycle migration.
- Build completed successfully.

## Evidence
- The compliance summary helper returns statuses for:
  - Recognition Valid
  - Recognition Expiring Soon
  - Recognition Expired
  - Affiliation Valid
  - Affiliation Expiring Soon
  - Affiliation Expired

