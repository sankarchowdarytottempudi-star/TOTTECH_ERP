# CHANGE IMPACT REPORT - ACADEMIC WORKFLOWS 20260605

## Summary

This change completes the core academic workflow requested for TOTTECH ONE:

- Exam creation
- Exam type creation
- Exam schedule creation
- Question paper creation with question-by-question entry
- Homework assignment
- Question-wise marks entry

The implementation uses the recovered source as the codebase and writes to the existing PostgreSQL academic tables, with additional raw-SQL-backed fields introduced for school, academic year, timeline, and governance context.

## Affected Modules

- Academics
- Exams
- Homework
- Question Papers
- Marks Entry
- Student 360 academic history
- Event Ledger
- Academic Year Engine

## Affected Pages

- `/exams`
- `/academics/exam-schedule`
- `/academics/question-papers`
- `/academics/homework`
- `/academics/marks-entry`
- `components/Sidebar.tsx`

## Affected APIs

- `GET /api/exams`
- `POST /api/exams`
- `GET /api/exam-types`
- `POST /api/exam-types`
- `GET /api/exam-schedule`
- `POST /api/exam-schedule`
- `GET /api/question-papers`
- `POST /api/question-papers`
- `GET /api/homework`
- `POST /api/homework`
- `GET /api/marks-entry/exams`
- `GET /api/marks-entry/students`
- `GET /api/marks-entry/questions`
- `GET /api/marks-entry`
- `POST /api/marks-entry`

## Affected Database Objects

- `exams`
- `exam_types`
- `exam_schedule`
- `question_bank`
- `question_papers`
- `question_paper_questions`
- `homework_assignments`
- `homework_submissions`
- `student_marks_entry`
- `marks`
- `event_ledger`

## Database Changes

Migration file:

- `prisma/migrations/202606052000_academic_workflow_completion/migration.sql`

The migration adds school, academic year, metadata, and audit fields needed to make schedules, papers, homework, and marks usable in production workflows.

## Workflow Impact

### Exam Creation

Admins can create academic exams and reusable exam types.

### Exam Scheduling

Admins can schedule exams by class, section, subject, date, time, room, invigilator, and optional question paper.

### Question Paper Creation

Admins can create a question paper and enter individual questions with:

- Section
- Question type
- Difficulty
- Topic
- Marks
- Answer or evaluation notes
- Optional flag

### Homework

Admins can assign homework by class, section, subject, teacher, due date, and status.

### Marks Entry

Teachers/admins can select a scheduled exam, load the class-section roster, select a student, and save all question-wise marks in one batch.

## RBAC Impact

Existing `academics` permission gates the Academics sidebar group. No hardcoded role-specific write bypass was added in the client pages. API routes still rely on authenticated current user context and should be tied to the dynamic permission system in the next RBAC hardening pass.

## Academic Year Impact

The APIs use the selected or current academic year where available:

- Exam creation stores academic year.
- Exam schedule stores academic year.
- Question papers store academic year.
- Homework assignments store academic year.
- Marks entry stores academic year and updates aggregate `marks`.

## Timeline Impact

Marks entry updates question-wise `student_marks_entry` and aggregate `marks`, enabling Student 360 academic history to read from persisted academic records.

## Event Ledger Impact

Events are recorded for:

- Exam created
- Exam schedule created
- Question paper created
- Homework assigned
- Marks entered

## AI Grounding Impact

TOTTECH AI can now ground academic answers and future agentic actions against:

- Exams
- Schedules
- Question papers
- Homework
- Marks
- Student academic performance
- Academic year context
- Event ledger events

## Mobile Impact

No React Native mobile source was changed in this pass. Mobile parity is still required for:

- Exam creation
- Exam schedule
- Question paper creation
- Homework assignment
- Marks entry

## Reports Impact

This change creates the data foundation for:

- Student academic reports
- Exam performance reports
- Subject performance reports
- Question-wise analysis
- Homework completion reporting
- Class-section academic progress

Dedicated report screens were not implemented in this pass.

## Validation Required

- Prisma validation
- TypeScript production build
- Runtime route smoke tests
- Authenticated create-flow testing with real class, section, subject, exam, paper, student data

## Validation Completed

- `npx prisma validate`: passed
- Targeted ESLint for changed academic workflow files and APIs: passed
- `npm run build`: passed
- PM2 restart and save: passed
- Authenticated live route smoke tests: passed for pages and APIs listed in this report

## Known Technical Debt

- `prisma/schema.prisma` does not yet model every newly added raw SQL column.
- Some old question-bank routes still use Prisma model fields from the recovered schema and need modernization.
- Mobile academic workflow parity is still missing.
- Dynamic RBAC write checks should be enforced at the API layer per action.
- Full-project `npm run lint` still fails on pre-existing recovered/reconstructed files outside this pass.
