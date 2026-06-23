# ACADEMIC YEAR RETENTION REPORT

Generated: 2026-06-22T08:48:38.890Z

## Status

PASS for academic-year aware data model.

## Validated

- Academic-year aware student tables: students, student_year_enrollments, student_academic_history, student_backlogs, attendance, marks, invoices, payments, documents.
- Academic-year aware staff/payroll tables: hr_staff_master, hr_salary_assignments, hr_pay_slips, hr_pf_ledgers.
- Promotion history tables preserve old-year assignment data.
- Timetable edit is available via `PATCH /api/timetable/[id]` and UI edit controls; `timetable_entries` is now lifecycle-triggered so frequent timetable changes are historically captured.

## Supported Contexts

Current year, historical year, and all-year reporting are structurally supported by school/year columns and retention indexes.

## Evidence

- Backup: /opt/backups/long-term-retention/20260622-1013
- Prisma migrations: 202606221040_long_term_retention_hardening, 202606221055_retention_trigger_coverage
- Prisma status: database schema up to date
- Prisma generate: PASS
- Production build: PASS
- Final schema audit: /opt/evidence/long-term-retention/schema-audit-final.json
- Performance evidence: /opt/evidence/long-term-retention/performance-explain.json
- Lifecycle trigger proof: update on teachers created one lifecycle history row inside transaction and was rolled back.
