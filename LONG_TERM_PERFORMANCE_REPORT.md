# LONG TERM PERFORMANCE REPORT

Generated: 2026-06-22T08:48:38.890Z

## Status

PARTIAL PASS. Index coverage is improved and current-data timings pass. Full 5M+ record load simulation was not run against production.

## Current-Data EXPLAIN Results

| Query | Execution ms | Planning ms |
|---|---:|---:|
| attendance_by_school_year_date | 0.27 | 2.061 |
| marks_by_school_year_student | 0.158 | 1.576 |
| invoices_by_school_year_date | 0.125 | 1.019 |
| payments_by_school_year_date | 0.169 | 1.17 |
| payroll_by_staff_month | 0.08 | 0.53 |
| pf_by_staff_month | 0.066 | 0.884 |
| event_ledger_by_entity | 0.09 | 1.243 |

## Indexes Added

- Students school/year/status.
- Attendance school/year/date/student.
- Marks school/year/student.
- Invoices and payments school/year/date.
- Payroll and PF month/year paths.
- Event ledger entity lookup.
- Homework, transport, hostel, and expense retention paths.

## Remaining Mandatory Certification

Run a non-production load test with approximately 2,000 students, 200 teachers, 100 staff, 15 academic years, 5M attendance rows, 1M marks rows, 500K finance rows, and multi-million event ledger rows.

## Evidence

- Backup: /opt/backups/long-term-retention/20260622-1013
- Prisma migrations: 202606221040_long_term_retention_hardening, 202606221055_retention_trigger_coverage
- Prisma status: database schema up to date
- Prisma generate: PASS
- Production build: PASS
- Final schema audit: /opt/evidence/long-term-retention/schema-audit-final.json
- Performance evidence: /opt/evidence/long-term-retention/performance-explain.json
- Lifecycle trigger proof: update on teachers created one lifecycle history row inside transaction and was rolled back.
