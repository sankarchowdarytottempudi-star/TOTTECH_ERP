# ACADEMIC YEAR ROLLOVER REPORT

Generated: 2026-06-06 19:08 CEST

## API

Created:

`/api/academic-year-rollover`

Methods:

- `GET`: lists rollover runs
- `POST` with `action=PREVIEW`: returns source/target counts
- `POST` with `action=EXECUTE`: performs no-overwrite rollover copies

## Verified Scenario

School:

`7 - Kakatheeya Vidya Samsthalu`

Source:

`2026-2027` (`academic_year_id=9`)

Target:

`2027-2028` (`academic_year_id=10`)

## Preview Evidence

Preview returned HTTP `200`.

Source counts:

- Students: 1
- Classes: 3
- Sections: 6
- Subjects: 1
- Teacher assignments: 1
- Timetable: 1
- Exams: 1
- Exam schedule: 1
- Question papers: 1
- Homework: 1

Validation errors:

`[]`

## Execution Evidence

Final execution returned HTTP `201`.

Final rollover:

`academic_year_rollovers.id = 3`

Copied in final idempotent run:

- Teacher assignments: 1
- Timetable: 1
- Exams: 1
- Question papers: 1
- Exam schedule: 1
- Homework: 1

Already copied by earlier partial runs and skipped safely:

- Classes: 3 total in target year
- Sections: 6 total in target year
- Subjects: 1 total in target year
- Student year enrollment: 1 total in target year

Event Ledger:

`ACADEMIC_YEAR_ROLLOVER_EXECUTED` recorded for rollover `3`, target year `10`.

## Partial Attempts

Two execution attempts were marked `PARTIAL_FAILED`:

- Attempt 1: PostgreSQL parameter cast issue in JSON metadata generation.
- Attempt 2: missing audit columns on `teacher_class_assignments`.

Both failures were corrected. The API is idempotent, so retries did not duplicate already-copied classes, sections, subjects, or student enrollments.

