# Teacher Assignment Report

Generated: 2026-06-20

## Scope

Teacher multi-class, multi-section, and multi-subject assignment support, plus teacher filters and performance cards.

## Root Cause

The live database already contained `teacher_class_assignments`, but the active uniqueness constraint did not include `subject_id`. That meant a teacher could be blocked from having multiple subject assignments for the same class/section/type.

## Database Change

Migration:

- `prisma/migrations/202606200620_post_uat_gap_closure/migration.sql`

Updated unique index:

```sql
CREATE UNIQUE INDEX uq_teacher_class_assignment_active
ON teacher_class_assignments (
  teacher_id,
  academic_year_id,
  class_id,
  COALESCE(section_id, 0),
  COALESCE(subject_id, 0),
  assignment_type
)
WHERE status = 'ACTIVE';
```

Production verification confirmed the index exists.

## API Changes

- `app/api/teachers/route.ts`
  - Supports `class_id`, `section_id`, `subject_id` filters.
  - Accepts `assignments[]`.
  - Stores `subject_id`.
  - Returns performance fields.
- `app/api/teachers/[id]/route.ts`
  - Supports update of multiple assignments.
  - Deactivates old assignments only when assignment payload is submitted.
- `app/api/roster/route.ts`
  - Includes subjects for teacher filter UI.

## UI Changes

- `app/teachers/page.tsx`
  - Added class, section, and subject filters.
  - Added subject selector during teacher creation.
  - Added card-level metrics:
    - Performance %
    - Attendance %
    - Homework Completion %
    - Exam Outcome %

## Validation

- `/teachers` returns `HTTP/1.1 200 OK`.
- `/api/teachers?class_id=&section_id=&subject_id=` returns 200 with an empty list for the current selected context.
- Screenshot:
  - `/opt/tottech-one/post-uat-screenshots/teachers.png`

## Remaining Gap

The selected live context currently has no teacher rows, so UI rendering and API success were validated, but populated assignment create/update flow should be tested with real teachers, classes, sections, and subjects after data is loaded.
