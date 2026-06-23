# CONTEXT STAMPING REPORT

Generated: 2026-06-06 19:08 CEST

## Result

Status: COMPLETED FOR PROMOTION/ROLLOVER SUBSTRATE

Added:

- `resolveMutationContext()` in `lib/api/context.ts`
- `createStamp()` and `updateStamp()` helpers
- Migration: `prisma/migrations/202606061830_promotion_rollover_completion/migration.sql`

## Rules Enforced

- Create/update operations can require concrete `school_id`.
- Create/update operations can require concrete `academic_year_id`.
- `All Schools` is rejected for mutation unless a concrete school is supplied.
- Academic year must belong to the selected school or be a global academic year.

## Database Evidence

Verified operational tables now expose:

- `school_id`
- `academic_year_id` or explicit source/target academic-year columns
- `created_by`
- `created_at`
- `updated_by`
- `updated_at`

Transition tables with source/target year architecture:

- `promotion_workflows`
- `student_promotions`
- `teacher_rollovers`
- `academic_year_rollovers`

These intentionally use `source_academic_year_id` and `target_academic_year_id` rather than a single `academic_year_id`.

## Supported Years

Verified:

- 2024-2025
- 2025-2026
- 2026-2027
- 2027-2028

## Remaining Risk

Legacy rows may still have null `updated_by` where no historical actor exists. New rollover-created rows are stamped with the executing user.

