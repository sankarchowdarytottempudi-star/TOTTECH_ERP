# HISTORICAL REPORTING CERTIFICATION

Generated: 2026-06-22T08:48:38.890Z

## Status

PARTIAL PASS. Query/index foundation is ready; full browser report sweep remains.

## Validated Query Paths

| Query Path | Execution ms | Planning ms |
|---|---:|---:|
| attendance_by_school_year_date | 0.27 | 2.061 |
| marks_by_school_year_student | 0.158 | 1.576 |
| invoices_by_school_year_date | 0.125 | 1.019 |
| payments_by_school_year_date | 0.169 | 1.17 |
| payroll_by_staff_month | 0.08 | 0.53 |
| pf_by_staff_month | 0.066 | 0.884 |
| event_ledger_by_entity | 0.09 | 1.243 |

## Supported Reports By Structure

- Attendance: school/year/date indexed.
- Marks: school/year/student indexed.
- Finance: invoice/payment school/year/date indexed.
- Payroll: pay slip month/year retained.
- PF: PF ledger month/year retained.
- Transport/Hostel/Dining: assignment/attendance tables are school/year aware and trigger-protected where present.

## Remaining Gap

Browser-level report exports for every historical module were not re-run in this sprint.

## Evidence

- Backup: /opt/backups/long-term-retention/20260622-1013
- Prisma migrations: 202606221040_long_term_retention_hardening, 202606221055_retention_trigger_coverage
- Prisma status: database schema up to date
- Prisma generate: PASS
- Production build: PASS
- Final schema audit: /opt/evidence/long-term-retention/schema-audit-final.json
- Performance evidence: /opt/evidence/long-term-retention/performance-explain.json
- Lifecycle trigger proof: update on teachers created one lifecycle history row inside transaction and was rolled back.
