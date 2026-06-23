# TOTTECH ONE Finance Command Center Report

Generated: 2026-06-19 14:00 CEST

## Backup

Backup completed before implementation:

`/opt/backups/finance-command-center/20260619-1328`

Backup size:

`3.0G`

Backup report:

`FINANCE_COMMAND_CENTER_BACKUP_REPORT.md`

Included database dump, source, Prisma files, uploads, documents, PM2 metadata, environment file snapshot, and `SHA256SUMS` checksum manifest.

## Database / Migration

Added migration:

`prisma/migrations/202606191332_finance_command_center_indexes/migration.sql`

Indexes added:

- `idx_invoices_finance_command_center` on `invoices(school_id, academic_year_id, invoice_date, class_id, section_id, student_id, status)`
- `idx_payments_finance_command_center` on `payments(school_id, academic_year_id, payment_date, class_id, section_id, student_id)`
- `idx_concession_requests_finance_command_center` on `concession_requests(school_id, academic_year_id, status, created_at)`

Validation query confirmed all 3 finance indexes exist.

## API Changes

Extended `/api/finance` into a command-center payload using existing tables only:

- `invoices`
- `payments`
- `payment_receipts`
- `fee_categories`
- `concession_requests`

Added:

- `kpis.totalRevenue`
- `kpis.totalInvoices`
- `kpis.collectedAmount`
- `kpis.pendingAmount`
- `kpis.collectionPercentage`
- `kpis.defaulters`
- `kpis.concessions`
- `kpis.expectedRevenue`
- `monthlyAnalytics`
- `comparisons.classRevenue`
- `comparisons.schoolRevenue`
- `charts.collectionTrend`
- `charts.revenueTrend`
- `charts.pendingTrend`
- `charts.collectionVsTarget`
- Active context fields for selected school, academic year, all-school and all-year scope

Added report APIs:

- `GET /api/finance/reports`
- `GET /api/finance/reports/export?format=pdf`
- `GET /api/finance/reports/export?format=xlsx`
- `POST /api/finance/reports/share`
- `GET /api/public/finance/reports/pdf`

Supported report types:

- daily
- weekly
- monthly
- academic-year
- pending-fee
- overdue
- defaulter
- concession
- invoice-audit
- payment-audit

## Export Implementation

PDF:

- Implemented shared finance report PDF renderer.
- Includes school/report header, academic year, generated date, totals, table rows, footer and page numbers.

Excel:

- Implemented real `.xlsx` export using the installed `xlsx` package.
- CSV was not used as a substitute.

Public signed links:

- Added signed public monthly/report PDF links for WhatsApp sharing.
- Unsigned report link returns `403`.
- Signed report link returns `200 OK` and `Content-Type: application/pdf`.

Existing invoice and receipt public PDF links remain the source for invoice/receipt WhatsApp sharing.

## Payment Scoping Fix

Updated finance payment collection flow to resolve active school through `resolvePlatformContext(request)` instead of relying only on `auth.user.school_id`.

This preserves the multi-school user access model.

## UI Changes

Rebuilt `/finance` as Fee Collection Command Center:

- KPI cards
- Monthly analytics table
- Collection trend
- Revenue trend
- Pending trend
- School revenue comparison
- Class revenue comparison
- Finance Reports Center actions
- PDF export
- Excel export
- Print action
- Email/WhatsApp buttons are visible but disabled where direct configuration/delivery workflow is not yet selected by the user

Added `/finance/reports` using the same finance command-center/reporting interface.

Added Finance sidebar link:

- Finance → Reports

## Calculation Rules Implemented

- Fee Generated: `SUM(invoices.total_amount)`
- Fee Collected: payments total where available, otherwise invoice paid total
- Pending Fee: `SUM(invoices.balance_amount)` where balance is greater than zero
- Collection %: collected / generated, rounded whole percent
- Defaulters: distinct students with overdue unpaid invoice balance
- Concessions: approved concession amount from `concession_requests.approved_amount`, fallback to requested amount
- Expected Revenue: generated invoice amount plus active fee category exposure where invoices are not yet generated

## Data Evidence

Production snapshot after deployment:

- Invoices: 0
- Total invoice amount: 0
- Pending invoice amount: 0
- Payments: 130
- Payment amount: 446248.00
- Pending invoices: 0
- Finance indexes found: 3

Note: current production database has payment rows but no invoice rows at the time of validation. The command center handles this and will populate generated/pending invoice analytics as invoice records are created.

## Build / Deployment Evidence

Commands executed successfully:

- `npx prisma generate`
- `npx prisma migrate deploy`
- `npm run build`
- `pm2 restart tottech-one --update-env`

PM2:

- Process: `tottech-one`
- Status: `online`

Live checks:

- `https://erp.tottechsolutions.com/login` returned `200 OK`
- `https://erp.tottechsolutions.com/finance` redirects unauthenticated users to `/login`
- Unsigned public report PDF returned `403`
- Signed public monthly report PDF returned `200 OK` with `Content-Type: application/pdf`

## Validation Notes

Completed:

- Backup verification
- Migration deployment
- Production build
- PM2 restart
- Live route check
- Signed public report PDF check
- Finance index existence check

Recommended authenticated UAT:

- Login as a finance-enabled user and open `/finance`.
- Export monthly report PDF.
- Export monthly report Excel.
- Export pending fee report PDF.
- Export defaulter report PDF.
- Create an invoice, collect a payment, and verify KPI cards update.
- Use `/api/finance/reports/share` to generate a signed public report link and place that link in the WhatsApp template.

