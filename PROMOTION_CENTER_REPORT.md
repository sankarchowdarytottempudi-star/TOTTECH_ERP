# PROMOTION CENTER REPORT

Generated: 2026-06-06 19:08 CEST

## Implemented

Promotion Center at `/promotions` now includes:

- Student promotion workflow
- Candidate filtering by school, academic year, class, section, student
- Bulk/selected-student promotion preview
- Approval step
- Execute step
- Dropout management
- Teacher rollover
- Academic Year Rollover Wizard

## Student Promotion

Existing workflow remains:

Preview -> Approve -> Execute -> Event Ledger

Execution writes:

- `promotion_workflows`
- `promotion_workflow_students`
- `student_year_enrollments`
- `student_promotions`
- Event Ledger

No student promotion execution smoke test was run in this sprint because only one real student exists in the reset dataset and a promotion would change that student’s active academic placement.

## Teacher Rollover

Existing teacher rollover remains available:

- Continue Teacher
- Transfer Teacher
- Deactivate Teacher
- Copies active teacher class assignments to target year where applicable
- Writes `teacher_rollovers`
- Writes Event Ledger

## Rollover Wizard Added

The new wizard supports:

- Students
- Classes
- Sections
- Subjects
- Teacher assignments
- Timetable
- Exams
- Exam schedule
- Question papers
- Homework
- Transport
- Dining
- Hostel

Marks are preserved as historical records and are not copied into target year.

