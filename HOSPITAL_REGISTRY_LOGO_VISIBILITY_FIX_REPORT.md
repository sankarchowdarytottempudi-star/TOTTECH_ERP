# Hospital Registry And Logo Visibility Fix Report

## Issue

New hospital details appeared in Live Brand Preview but did not appear under Hospital Registry -> Created Hospitals. Uploaded logos could also render as broken image text.

## Root Cause

1. Live Brand Preview was showing unsaved form state, while the registry only displays persisted `hospitals` rows.
2. The hospital creation API still enforced the old `cs-` username/email prefix rule for owner/admin users, which could block hospital creation after the platform login restructure.
3. The UI used raw image tags for hospital logos without path normalization or fallback handling.
4. After save, an existing search/filter could keep the new hospital hidden.

## Fix Applied

- Removed the obsolete `cs-` owner/admin email restriction from `app/api/clinical/platform/hospitals/route.ts`.
- Added normalized hospital logo rendering with fallback in `app/clinical-services/platform-hospitals/page.tsx`.
- Replaced raw hospital logo images in:
  - Upload preview
  - Live Brand Preview
  - Hospital Registry cards
  - Hospital Details panel
- After create/update, the page now clears search, switches the registry filter to `ACTIVE`, and reloads the registry with explicit filter values.
- Updated owner/admin labels to remove the old `cs-*` instruction.

## Runtime Validation

Temporary hospital create/read/delete validation:

- Created hospital ID: `17`
- Registry API returned the created hospital under `status=ACTIVE`
- Uploaded logo path persisted:
  `/uploads/clinical/hospitals/hospital-logo-1781415310348-481423eeb659b.jpg`
- Temporary hospital was soft-deleted after validation.

Browser validation:

- Route tested: `/clinical-services/platform-hospitals`
- Active hospital cards rendered: `2`
- Broken images found: `0`
- Screenshot: `/opt/tottech-one/hospital-registry-logo-fix.png`

Build and deployment:

- `npm run build` passed.
- `pm2 restart tottech-one --update-env` completed.

## Status

Fixed and deployed.
