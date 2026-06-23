# Promotion Engine Report

## Summary
The promotion workflow now preserves the original admission number and records every lifecycle move in `student_academic_history`.

## What Changed
- `app/api/promotions/[id]/execute/route.ts`
  - Promotion now updates `student_status` to `PROMOTED`.
  - Promotion now keeps `admission_number` untouched.
  - Promotion now creates a `student_academic_history` row with `promotion_status = PROMOTED`.
- `app/api/students/route.ts`
  - New admissions now create an initial `student_academic_history` row with `promotion_status = ADMITTED`.
- `app/api/students/[id]/route.ts`
  - Student updates now preserve existing admission/enrollment numbers unless explicitly changed.
  - Student status is normalized and stored in `student_status`.

## Validation
- `npx prisma generate` succeeded.
- `npx prisma migrate deploy` applied migration `202606200724_student_lifecycle_sprint`.
- `npm run build` completed successfully.

## Evidence
- `student_academic_history` table exists.
- `students.student_status`, `students.status_updated_at`, and `students.status_reason` exist.
- Existing student rows were preserved during migration backfill.

