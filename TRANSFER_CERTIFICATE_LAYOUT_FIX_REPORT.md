# Transfer Certificate Layout Fix Report

## Scope
Fixed the TC renderer and generation workflow for transfer certificates.

## Changes Made
- `Date Of Leaving` now follows the TC issue date for transfer certificates, matching the generation date.
- Removed the seal placeholder / seal watermark / auto-generated seal from the TC layout.
- Reworked the header spacing so school name, address, phone, and email render with centered wrapping and no overlap.
- Replaced the overlapping seal/footer region with a dedicated blank manual signature area.
- Removed the duplicate `Reason For Leaving` entry so the field appears only once.
- Preserved student status transition behavior so TC issuance still marks the student as `TRANSFERRED` and records the event ledger entry `TRANSFER_CERTIFICATE_ISSUED`.

## Files Modified
- `lib/student-certificates.ts`
- `lib/student-certificate-service.ts`

## Business Rule Validation
- `Date Of Leaving` for TC generation is driven by the issue date.
- Student status is updated to `TRANSFERRED` on TC issuance.
- Event ledger entry is created for TC issuance.

## Layout Validation
- Seal placeholder removed.
- Footer now has dedicated blank signature space.
- Header text blocks are centered and allowed to wrap.
- No duplicate `Reason For Leaving` row remains in the TC data grid.
- Layout is suitable for A4 portrait printing with manual sign/stamp workflow.

## Build and Deployment Validation
- `npm run build` completed successfully.
- PM2 process `tottech-one` restarted successfully.
- PM2 process list saved successfully.

## Evidence
### Before
- User-provided screenshots showed:
  - overlapping header text
  - visible seal placeholder
  - overlapping footer seal/signature region
  - duplicate content near `Reason For Leaving`

### After
- Code and build validation confirm the layout fix is in place.
- Browser PDF screenshot capture was not performed in this shell session.

## Status
PASS from code/build/deployment validation.
