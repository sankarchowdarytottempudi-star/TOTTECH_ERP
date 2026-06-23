# Teacher Master Enhancement Report

## Backup
- Backup report: `TEACHER_MASTER_BACKUP_REPORT.md`
- Backup location: `/opt/backups/teacher-master-enhancement/YYYYMMDD-HHMM`

## Implemented
- Added current address capture to teacher create/edit flows.
- Added permanent address capture with `Same As Current Address` support.
- Added employment history capture.
- Added salary history capture.
- Added document upload capture for:
  - Resume
  - Experience Certificates
  - Relieving Letter
  - Previous Pay Slip
  - Aadhaar
  - PAN
  - Qualification Certificates
  - TET Certificates
- Extended Teacher 360 to display:
  - Current address
  - Permanent address
  - Employment history
  - Salary history
  - Uploaded documents
- Added Prisma schema fields and database migration for teacher profile enrichment.

## Database Changes
- `teachers.current_address` JSONB
- `teachers.permanent_address` JSONB
- `teachers.employment_history` JSONB
- `teachers.salary_history` JSONB
- `teachers.documents` JSONB

## Validation
- `npx prisma generate` completed successfully.
- `npx prisma migrate deploy` applied migration `202606201145_teacher_master_enhancement`.
- `npm run build` completed successfully.
- PM2 app `tottech-one` restarted successfully.

## Notes
- The current implementation stores structured teacher profile metadata on the teacher record itself, which keeps the change additive and avoids breaking existing teacher workflows.
- Salary history is present in the data model and Teacher 360 view; role-based masking can be tightened further if you want a stricter OWNER / SUPER_ADMIN / HR gate on the UI.
