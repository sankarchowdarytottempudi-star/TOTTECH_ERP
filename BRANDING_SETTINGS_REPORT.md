# Branding Settings Report

Status: Implemented

Completed:
- Settings card renamed to School Branding.
- Added `/settings/school-branding` route alias.
- School branding settings now write to `schools`, not legacy `school_profile`.
- Editable fields include logo, favicon, primary/secondary color, owner/principal contact, address, website, subscription, and school assistant name.

Files:
- `app/settings/page.tsx`
- `app/settings/school-profile/page.tsx`
- `app/settings/school-branding/page.tsx`
- `app/api/settings/school-profile/route.ts`

