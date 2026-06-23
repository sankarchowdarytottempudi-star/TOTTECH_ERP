# Voucher Numbering Standard Report

## Backup
- Backup path: `/opt/backups/voucher-numbering/20260620-1124`
- Backed up: source, Prisma schema, migrations, environment, PM2 config, uploads snapshot

## Implemented Changes
- Added server-side document numbering helper in `lib/document-numbering.ts`
- Added `document_number_sequences` table migration
- Expense voucher numbers are now generated automatically on create
- Voucher number field is no longer editable in the UI
- School code is treated as immutable on edit screens and update APIs

## Number Format
`<SCHOOL_CODE>-EXP-<YY>-<RUNNING_NUMBER>`

## Validation
- Generated sample numbers for school `KVSES` and academic year `2026-2027`
- Output:
  - `KVSES-EXP-27-00001`
  - `KVSES-EXP-27-00002`
- Sequence increments correctly and stays school/year scoped

## Deployment
- `npx prisma generate` completed successfully
- `npx prisma migrate deploy` applied migration `202606201130_document_numbering_standard`
- `npm run build` completed successfully
- PM2 restarted: `tottech-one`
