# Translation Coverage Report

## Covered Areas
- Global language selector
- Login screen labels and helper text
- Header labels and actions
- Sidebar navigation labels
- Global search placeholder text
- School / academic year switchers
- Clinical shell header and navigation labels

## Persistence Coverage
- Browser storage: `app_language`
- Session cookie: `app_language`
- User profile field: `users.preferred_language`
- Login response payload and cookies updated

## Not Yet Fully Converted
- Deep module content across every page in both applications
- PDF content generation labels
- AI response translation on all endpoints
- Historical report templates that are generated server-side

## Validation
- Production build passed after Prisma regeneration and typecheck.
