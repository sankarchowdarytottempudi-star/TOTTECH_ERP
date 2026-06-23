# Study Certificate Report

## Summary
Study certificate generation is available from Student 360 and stores a signed PDF copy in the student document vault.

## What Changed
- Added `app/api/students/[id]/study-certificate/route.ts`
- Added `lib/student-certificate-service.ts`
- Added `lib/student-certificates.ts`
- Added certificate actions in `app/students/[id]/page.tsx`

## Workflow
Student profile -> generate study certificate -> PDF rendered -> stored in `student_documents` -> timeline/event records written -> WhatsApp queued if a recipient phone exists.

## Validation
- `npx prisma generate` succeeded.
- `npx prisma migrate deploy` applied the lifecycle migration.
- `npm run build` completed successfully.

## Evidence
- `student_documents` exists.
- Generated PDFs are public files under `public/uploads/students/certificates/`.

