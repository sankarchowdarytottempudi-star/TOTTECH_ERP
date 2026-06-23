# LONG TERM DATA MODEL AUDIT

Generated: 2026-06-22T08:48:38.890Z

## Summary

Audited tables: 38
PASS: 38
FAIL: 0

## Fixes Applied

- Created missing `student_backlogs` physical table expected by the schema/APIs.
- Created `lifecycle_change_history` for immutable update/delete snapshots.
- Added lifecycle triggers across student, teacher, staff, finance, academic, transport, hostel, dining, payroll, PF, and certificate-related tables.
- Added long-horizon indexes for attendance, marks, finance, payroll, PF, homework, transport, hostel, event ledger, and lifecycle tables.

## Table Audit

| Table | Records | School Aware | Academic Year Aware | History Preserved | Status |
|---|---:|---|---|---|---|
| students | 2 | YES | YES | YES | PASS |
| student_academic_history | 3 | YES | YES | YES | PASS |
| student_backlogs | 0 | YES | YES | YES | PASS |
| student_documents | 2 | YES | YES | YES | PASS |
| student_promotions | 0 | YES | YES | YES | PASS |
| student_year_enrollments | 1 | YES | YES | YES | PASS |
| teachers | 3 | YES | YES | YES | PASS |
| teacher_class_assignments | 0 | YES | YES | YES | PASS |
| hr_staff_master | 8 | YES | YES | YES | PASS |
| lifecycle_change_history | 0 | YES | YES | YES | PASS |
| hr_salary_history | 7 | YES | YES | YES | PASS |
| hr_pay_slips | 11 | YES | YES | YES | PASS |
| hr_increment_requests | 0 | YES | YES | YES | PASS |
| hr_leave_requests | 0 | YES | YES | YES | PASS |
| hr_lop_entries | 0 | YES | YES | YES | PASS |
| hr_salary_structures | 1 | YES | YES | YES | PASS |
| hr_salary_assignments | 7 | YES | YES | YES | PASS |
| hr_payroll_runs | 2 | YES | YES | YES | PASS |
| hr_pf_ledgers | 8 | YES | YES | YES | PASS |
| invoices | 2 | YES | YES | YES | PASS |
| payments | 3 | YES | YES | YES | PASS |
| school_expenses | 0 | YES | YES | YES | PASS |
| expense_categories | 23 | YES | YES | YES | PASS |
| concession_requests | 0 | YES | YES | YES | PASS |
| classes | 14 | YES | YES | YES | PASS |
| sections | 26 | YES | YES | YES | PASS |
| subjects | 8 | YES | YES | YES | PASS |
| exams | 1 | YES | YES | YES | PASS |
| question_papers | 2 | YES | YES | YES | PASS |
| student_marks_entry | 1 | YES | YES | YES | PASS |
| homework_assignments | 0 | YES | YES | YES | PASS |
| timetable_entries | 2 | YES | YES | YES | PASS |
| transport_assignments | 0 | YES | YES | YES | PASS |
| transport_attendance | 0 | YES | YES | YES | PASS |
| hostel_allocations | 1 | YES | YES | YES | PASS |
| hostel_attendance | 0 | YES | YES | YES | PASS |
| dining_attendance | 0 | YES | YES | YES | PASS |
| event_ledger | 160 | YES | YES | YES | PASS |

## Evidence

- Backup: /opt/backups/long-term-retention/20260622-1013
- Prisma migrations: 202606221040_long_term_retention_hardening, 202606221055_retention_trigger_coverage
- Prisma status: database schema up to date
- Prisma generate: PASS
- Production build: PASS
- Final schema audit: /opt/evidence/long-term-retention/schema-audit-final.json
- Performance evidence: /opt/evidence/long-term-retention/performance-explain.json
- Lifecycle trigger proof: update on teachers created one lifecycle history row inside transaction and was rolled back.
