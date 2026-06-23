# PROMOTION_VALIDATION_REPORT

Generated: 2026-06-06

## Backup And Archive

- Backup directory: `/opt/backups/data-reset/20260606-1640`
- Full database dump: `/opt/backups/data-reset/20260606-1640/schoolerp-full-before-data-reset.dump`
- Schema dump: `/opt/backups/data-reset/20260606-1640/schoolerp-schema-before-data-reset.sql`
- Archive schema: `archive_data_reset_20260606_1640`
- Backup report: `/opt/backups/data-reset/20260606-1640/DATA_RESET_BACKUP_REPORT.md`
- Archive report: `/opt/backups/data-reset/20260606-1640/DATA_ARCHIVE_REPORT.md`
- Reset report: `/opt/backups/data-reset/20260606-1640/DATA_RESET_REPORT.md`

## Data Reset Result

- Existing operational school data was archived before purge.
- Existing schools/classes/sections/students/teachers were purged during the reset.
- Users, roles, permissions, governance, settings, feature flags, TOTTECH AI knowledge, audit framework structure, and finance configuration scaffolding were preserved.
- Event ledger was reset after archive and now contains a new `DATA_RESET_COMPLETED` audit event.

## Current Post-Reset State

Fresh data has been created after the reset:

- Schools: 1
- Classes: 3
- Sections: 6
- Students: 0
- Teachers: 0
- Global academic years: 3

Current school data verified:

- `Kakatheeya Vidya Samsthalu` / `KVS`
- Classes visible through `/api/classes?school_id=7`: Nursery, LKG, UKG
- Sections visible through `/api/sections?school_id=7`: A/B sections for Nursery, LKG, UKG

## Academic Year Framework

Global academic years were added for clean post-reset usage:

- `2024-2025`
- `2025-2026` current
- `2026-2027`

Academic-year APIs now return global valid years when All Schools is selected, avoiding stale academic years tied to archived/deleted schools.

## Mandatory Context Enforcement

Creation APIs now block missing school or academic-year context for:

- Students
- Teachers
- Classes
- Sections
- Subjects
- Exams
- Homework
- Question Papers
- Finance Invoices
- Transport Operations
- Dining Operations
- Hostel Operations

The implementation prefers validated school/current academic year context over stale cookies from deleted schools.

## Promotion Center

Promotion Center is available at:

- `/promotions`

Menu location:

- Academics -> Promotions

Implemented:

- School filter
- Academic Year From
- Academic Year To
- Class filter
- Section filter
- Student filter
- Candidate loading after at least two filters
- Selected-student promotion
- Bulk promotion from filters
- Preview workflow creation
- Approval flow
- Execution flow
- Duplicate target-year enrollment guard
- Same-year promotion guard
- Invalid target class/section guard
- Event Ledger recording

## Dropout Management

Implemented:

- `student_dropout_records` history table
- Student dropout status fields on `students`
- Dropout categories: Transfer, Discontinued, Financial, Migration, Medical, Other
- Dropout date, reason, remarks
- Event Ledger recording
- Dropout summary API

## Teacher Rollover

Implemented:

- `teacher_rollovers` history table
- Continue Teacher
- Transfer Teacher audit record
- Deactivate Teacher
- Bulk rollover
- Historical teacher assignment preservation through `teacher_class_assignments`
- Event Ledger recording

## API Validation

Validated after production build and PM2 restart:

- `GET /api/my-school` returns `All Schools` for SUPER_ADMIN all-school context.
- `GET /api/dashboard` returns all-school aggregate counts.
- `GET /api/classes` returns all visible classes in All Schools context.
- `GET /api/classes?school_id=7` returns 3 school-specific classes.
- `GET /api/sections?school_id=7` returns 6 school-specific sections.
- `GET /api/subjects?school_id=7` returns an empty list with HTTP 200.
- `GET /api/promotions/candidates?school_id=7&source_academic_year_id=9` returns school, valid global academic years, classes, sections, and zero students with HTTP 200.
- `GET /api/promotions/teacher-rollover?school_id=7&source_academic_year_id=9` returns zero teachers with HTTP 200.
- `GET /api/promotions/reports?school_id=7&academic_year_id=9` returns promotion/dropout analytics with HTTP 200.

## Build And Runtime

- `npm run build`: passed.
- PM2 app: `tottech-one` online.
- PM2 restarted after build.
- PM2 process list saved.

## Remaining Notes

- Fresh student and teacher workflow validation requires user-created students and teachers.
- Promotion execution requires at least one source student and a valid target class.
- Teacher rollover execution requires teachers and source-year assignments.
