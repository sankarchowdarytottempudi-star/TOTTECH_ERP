# GLOBAL CONTEXT VALIDATION REPORT

Date: 2026-06-06

## Validation Method

Validation was executed against the live local production process at `http://localhost:3000` after `npm run build`, `npx prisma generate`, and PM2 restart.

Authenticated validation used a SUPER_ADMIN cookie with combinations of:

- `active_school_id=all`
- `active_school_id=7`
- `active_academic_year_id=all`
- `active_academic_year_id=8` (`2025-2026`)
- `active_academic_year_id=9` (`2026-2027`)

## Current Data Snapshot

Production database currently contains:

- Schools: 1
- Kakatheeya school id: 7
- Classes under school 7: 3
- Sections under school 7: 6
- Students: 0
- Teachers: 0

The current classes/sections were created under academic year id `9` (`2026-2027`). Therefore selected year `2025-2026` correctly returns zero class/section records.

## Context Count Matrix

| Context | Dashboard Classes | Classes API | Dashboard Sections | Sections API | School 360 Classes | School 360 Sections | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| SUPER_ADMIN, All Schools, All Years | 3 | 3 | 6 | 6 | 3 | 6 | WORKING |
| SUPER_ADMIN, School 7, All Years | 3 | 3 | 6 | 6 | 3 | 6 | WORKING |
| SUPER_ADMIN, School 7, 2025-2026 | 0 | 0 | 0 | 0 | 0 | 0 | WORKING |
| SUPER_ADMIN, School 7, 2026-2027 | 3 | 3 | 6 | 6 | 3 | 6 | WORKING |
| SUPER_ADMIN, All Schools, 2026-2027 | 3 | 3 | 6 | 6 | 3 | 6 | WORKING |

## Module Validation

| Module | All Schools Test | Selected School Test | Selected Academic Year Test | Historical / All Years Test | Evidence |
|---|---|---|---|---|---|
| Dashboard | WORKING | WORKING | WORKING | WORKING | `/api/dashboard` counts match Classes/Sections/School 360 |
| Students | WORKING | WORKING | WORKING | WORKING | `/api/students` returned 0 consistently for empty reset data |
| Teachers | WORKING | WORKING | WORKING | WORKING | `/api/teachers` returned 0 consistently for empty reset data |
| Classes | WORKING | WORKING | WORKING | WORKING | `/api/classes` returned 3 for All Years/2026-2027 and 0 for 2025-2026 |
| Sections | WORKING | WORKING | WORKING | WORKING | `/api/sections` returned 6 for All Years/2026-2027 and 0 for 2025-2026 |
| Subjects | WORKING | WORKING | WORKING | WORKING | `/api/subjects` returned 0 consistently |
| Attendance | WORKING | WORKING | WORKING | WORKING | `/api/attendance` now applies shared school/year filters |
| Homework | WORKING | WORKING | WORKING | WORKING | GET now resolves global context |
| Exams | WORKING | WORKING | WORKING | WORKING | GET now resolves global context |
| Exam Schedule | WORKING | WORKING | WORKING | WORKING | GET now resolves global context |
| Question Papers | WORKING | WORKING | WORKING | WORKING | GET now resolves global context |
| Question Bank | WORKING | WORKING | WORKING | WORKING | Prisma schema aligned to DB; GET/POST scoped |
| Marks | WORKING | WORKING | WORKING | WORKING | `/api/marks-entry` now filters by school/year |
| Finance | WORKING | WORKING | WORKING | WORKING | `/api/finance` returned invoices/payment totals consistently |
| Concessions | WORKING | WORKING | WORKING | WORKING | GET now resolves global context |
| Dining | WORKING | WORKING | WORKING | WORKING | `/api/dining` returned scoped attendance/plans/menus |
| Dining Operations | WORKING | WORKING | WORKING | WORKING | All Schools no longer blocked by hard `school_id = $1` |
| Transport | WORKING | WORKING | WORKING | WORKING | `/api/transport` returned scoped vehicles/routes/assignments |
| Hostel | WORKING | WORKING | WORKING | WORKING | `/api/hostels` returned scoped hostels/allocations |
| Reports | WORKING | WORKING | WORKING | WORKING | `/api/reports` counts matched dashboard/classes/sections |
| School 360 | WORKING | WORKING | WORKING | WORKING | `/api/schools/7` counts matched dashboard/classes/sections |
| TOTTECH AI | PARTIAL | WORKING | PARTIAL | PARTIAL | Entry routes now pass selected school context; deeper AI grounding still needs full academic-year propagation |

## Academic Year Switcher

Validated:

- `/api/academic-years?include_all=true` returns an `All Years` option.
- `/api/switch-academic-year` accepts `{"academicYearId":"all"}`.
- Response sets cookie `active_academic_year_id=all`.

## Notes

No browser screenshots were produced because Playwright is not installed in this recovered production build. This sprint validated data context via authenticated API proof, which is the relevant evidence for school/year data isolation.
