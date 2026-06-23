# HISTORICAL REPORTING REPORT

Generated: 2026-06-06 19:08 CEST

## Result

Status: IMPROVED AND VERIFIED FOR ACADEMIC STRUCTURE

## Verified Counts

School `7`, academic year `2026-2027`:

- Classes: 3
- Sections: 6
- Subjects: 1
- Student enrollments: 1
- Teacher assignments: 1
- Timetable: 1
- Exams: 1
- Exam schedule: 1
- Homework: 1

School `7`, academic year `2027-2028`:

- Classes: 3
- Sections: 6
- Subjects: 1
- Student enrollments: 1
- Teacher assignments: 1
- Timetable: 1
- Exams: 1
- Exam schedule: 1
- Homework: 1

All Years classes API:

Returned both `2026-2027` and `2027-2028` records for school `7`.

## Verified Endpoints

- `/api/classes?school_id=7&academic_year_id=10`: HTTP 200, 3 classes
- `/api/sections?school_id=7&academic_year_id=10`: HTTP 200, 6 sections
- `/api/classes?school_id=7&academic_year_id=all`: HTTP 200, both years visible

## Remaining Gap

Graphical year-comparison reports across finance, dining, transport, hostel, and marks still need UI-level proof.

