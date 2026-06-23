# Multi-Language Implementation Report

## Scope
Implemented a shared i18n foundation for TOTTECH ONE and TOTTECH Clinical Services.

## What Changed
- Added a shared language catalog for 12 supported languages.
- Added a global language selector in the web and clinical headers.
- Added persistence through:
  - user profile (`users.preferred_language`)
  - database
  - session cookies
  - browser storage
- Updated login and user update flows to carry the preferred language.
- Wrapped the root app layout in a language provider so the selected language is available across the UI.

## Files Changed
- `lib/i18n.ts`
- `components/LanguageProvider.tsx`
- `components/LanguageSwitcher.tsx`
- `components/Header.tsx`
- `components/Sidebar.tsx`
- `components/GlobalSearch.tsx`
- `components/AcademicYearSwitcher.tsx`
- `components/SchoolSwitcher.tsx`
- `components/clinical/ClinicalShell.tsx`
- `app/layout.tsx`
- `app/login/page.tsx`
- `app/api/auth/login/route.ts`
- `app/api/users/[id]/route.ts`
- `app/api/profile/language/route.ts`
- `prisma/schema.prisma`
- `prisma/migrations/202606231500_multilanguage_support/migration.sql`

## Validation
- Prisma Client regenerated successfully.
- `npm run build` completed successfully.

## Notes
- Translation coverage is intentionally focused on shared shell/navigation/login surfaces first.
- Product-specific content can now be translated incrementally through the shared helper utilities.
