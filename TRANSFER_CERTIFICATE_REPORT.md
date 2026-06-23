# Transfer Certificate Report

## Summary
Transfer certificate generation is now available from Student 360 and writes a PDF, document vault row, lifecycle history, timeline entry, and event log.

## What Changed
- Added `app/api/students/[id]/transfer-certificate/route.ts`
- Added `lib/student-certificate-service.ts`
- Added `lib/student-certificates.ts`
- Added `app/students/[id]/page.tsx` actions for certificate generation

## Workflow
Student profile -> generate transfer certificate -> PDF rendered -> stored in `student_documents` -> student marked `TRANSFERRED` -> `is_active = false` -> dropout record written -> academic history written -> WhatsApp queued if a recipient phone exists.

## Validation
- `npx prisma generate` succeeded.
- `npx prisma migrate deploy` applied the lifecycle migration.
- `npm run build` completed successfully.

## Evidence
- `student_documents` table exists.
- Transfer/study certificate routes compile in the production build.
- Student lifecycle PDFs use school branding, recognition, affiliation, and seal imagery when available.

