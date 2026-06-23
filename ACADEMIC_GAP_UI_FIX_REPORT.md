# ACADEMIC_GAP_UI_FIX_REPORT.md

## Summary

Updated the student admission flow so academic-gap fields behave conditionally instead of always showing.

## Backup

- Backup created at: `/root/backups/academic-gap-ui-fix/20260621-1302/tottech-one.tar.gz`
- Checksum: `e7c848e8f5043dab8ddab839d5c15393f20683568ef594e7def19d931998e50e`

## What Changed

### Student Create

- `Has Academic Gap` now controls visibility of the gap fields.
- When `No` is selected:
  - `Gap From Academic Year` is hidden
  - `Gap To Academic Year` is hidden
  - `Gap Duration` is hidden
  - `Gap Reason` is hidden
- Hidden academic-gap fields are saved as `NULL`.
- When `Yes` is selected:
  - gap fields are shown
  - `Gap From Academic Year`, `Gap To Academic Year`, and `Gap Reason` are required
  - `Gap Duration` is auto-calculated

### Student Edit

- Same conditional behavior added.
- Switching to `No` clears the gap values before save.
- Switching to `Yes` shows the required gap fields again.

### Student 360

- The academic-gap card is now hidden when the student has no academic gap.

### Teacher 360

- The teaching-gap section is now hidden when there are no teaching-gap records.

## Backend Changes

Student create/update handlers were updated so:

- academic-gap fields are stored as `NULL` when `Has Academic Gap = No`
- validation blocks saving when `Has Academic Gap = Yes` but required gap fields are missing
- `Gap Duration` remains auto-calculated from the from/to academic years

## Files Updated

- `app/students/page.tsx`
- `app/students/edit/[id]/page.tsx`
- `components/student/StudentOverview.tsx`
- `app/api/students/route.ts`
- `app/api/students/[id]/route.ts`
- `app/teachers/[id]/page.tsx`

## Validation

Build completed successfully after the change set.

### Before Screenshot

- `/opt/student_form_refinement_students.png`

This image shows the academic-gap fields visible even when `Has Academic Gap` is set to `No`.

### After Screenshots

- `/opt/academic_gap_ui_fix_after.png`
- `/opt/academic_gap_ui_fix_student_edit_after.png`
- `/opt/academic_gap_ui_fix_student_360_after.png`

These images show:

- gap fields hidden on the create form when `No` is selected
- the edit form using the same conditional behavior
- Student 360 hiding the academic-gap block when not applicable

## Notes

- The student-side implementation is now conditional and stores `NULL` gap values when no gap is selected.
- The teacher-side codebase does not currently have a separate academic-gap data model on create/edit; the teacher 360 view now hides the teaching-gap section when empty so the UI is not showing dead space or placeholder content.
