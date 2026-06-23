# FINAL EXECUTION PLAN

Sprint: TOTTECH ONE Final Enterprise Completion Sprint  
Created: 2026-06-06  
Rollback point: `/opt/backups/final-completion-sprint/20260606-1048`  
Backup report: `PRE_IMPLEMENTATION_BACKUP_REPORT.md`

## Ground Rules

- Preserve the latest recovered APK as product and UX specification: `/opt/recovery/downloads/app-release (3).apk`.
- Preserve current TOTTECH ONE black, white, and gold branding.
- Do not count routes, pages, or components as completion.
- Count only working workflows with database evidence, API evidence, UI/mobile evidence, academic-year evidence, RBAC evidence, event-ledger evidence, and timeline evidence.
- Do not insert fake production records to inflate readiness.
- Use real records, controlled smoke records, or documented staging/test evidence.
- No direct ERP module may call AI providers. AI must go through TOTTECH AI gateway/provider layer.
- AI actions must follow preview -> approval -> execute -> event ledger.

## Current Baseline From Audits

| Area | Current Evidence | Sprint Target |
| --- | ---: | ---: |
| Overall Platform | 43-49% depending on latest audit | >= 95% |
| APK Parity | 44-52% | >= 95% |
| Mobile APK Parity | 31-45% | >= 95% |
| AI APK Parity | 40-48% | >= 95% |
| Dining | 18-42% | >= 95% |
| Transport | 24-38% | >= 95% |
| Hostel | 28-42% | >= 95% |
| Academic Year | 61-68% | >= 95% |
| Governance | 38% | >= 95% |

The range exists because later reconstruction improved some APIs and mobile surfaces, but the audits still show limited proof of real workflow execution.

## Critical Gaps

| Order | Gap | Business Impact | Technical Impact | Dependencies | Risk | Completion Evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Academic-year enforcement is incomplete | Historical reporting and promotions can corrupt or mix year data | Every operational write must resolve `school_id`, `academic_year_id`, `created_by`, `created_at` | `academic_years`, current school context, auth | High data integrity risk | DB column audit, write-path audit, year comparison tests |
| 2 | Event Ledger coverage is sparse | Admins cannot prove who did what, when, and in which year | Centralize event creation and fan-out to timelines | Auth, active year resolver, entity IDs | High compliance risk | Every create/update/delete/assign/approve records event |
| 3 | Student 360 is partial | Student profile is not the single source of truth | Aggregate academics, fees, dining, hostel, transport, documents, events | Academic-year engine, event ledger, all module APIs | High product risk | One screen/API/mobile view shows full year-aware history |
| 4 | Teacher 360 is partial | Teacher workload, exams, homework, attendance and history are incomplete | Teacher history aggregation and event fan-out | Academics, attendance, timelines | High operations risk | Teacher 360 has live tabs, timelines, mobile support |
| 5 | School 360 command center is partial | Leadership cannot run the school from one view | Real KPIs from DB, risks, revenue, operations, AI insights | All module data, reports API, AI grounding | High executive value risk | School 360 cards all trace to real records |
| 6 | Finance workflow is incomplete | Billing, concessions, collections and defaulters are core revenue workflows | Invoice lifecycle, line items, installments, payments, approvals | Students/classes/sections, fee categories, RBAC | High revenue risk | Generate, approve, collect, receipt, defaulter reports |
| 7 | Dining is not a complete operations center | Meal attendance/cost/inventory are not operationally controlled | Full CRUD and analytics for menus, attendance, inventory, production, wastage | Students/classes/sections, inventory tables | High daily operations risk | Web/mobile workflows plus dining history in Student 360 |
| 8 | Transport is not a complete operations center | Safety and route tracking are incomplete | Vehicle/driver/route/assignment/attendance/pickup/drop lifecycle | Students/teachers, route tables | High safety risk | Assign and track route usage with history |
| 9 | Hostel is not a complete operations center | Room allocation and safety tracking are incomplete | Block/room/bed/allocation/attendance/movement workflow | Students/classes/sections, hostel tables | High safety risk | Allocate beds, track attendance/movement/vacancy |
| 10 | Mobile workflows are still shallow | APK was mobile-first; users cannot operate from mobile | Replace shell screens with API-backed create/edit/delete/assign/approve/search flows | Stable APIs and auth | High APK parity risk | Native workflows execute and persist records |
| 11 | Dynamic RBAC is incomplete | Hardcoded roles break enterprise SaaS governance | Central guards for roles, permissions, menus, pages, APIs | Permissions seed data, role profiles | High security risk | Source count reduction and denied-access tests |
| 12 | TOTTECH AI still needs full answer/action loop | AI cannot be trusted as a school copilot if it only lists sources | KB retrieval, official/web retrieval, answer extraction, memory, safe actions | Provider gateway, KB table, action APIs | High product differentiation risk | Answers first, cites sources, stores knowledge, safe action execution |

## High Gaps

| Order | Gap | Business Impact | Technical Impact | Dependencies | Risk | Completion Evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 13 | Automation Engine is non-operational | No proactive follow-up, reminders, or risk triggers | Rule builder, scheduler, run logs, approvals | Event ledger, notifications, RBAC | Medium-high | Automation rules execute and log outcomes |
| 14 | War Room is read-oriented | Leadership cannot close incidents/actions | Incident workflow, assignments, status, timeline | Event ledger, users, school context | Medium-high | Open/assign/resolve war-room events |
| 15 | Parent Portal is shallow | Parents cannot see trusted child history | Student-scoped history, invoices, attendance, homework, dining/transport/hostel | Student 360 aggregation | Medium-high | Parent view mirrors approved Student 360 subset |
| 16 | Reports Center uses incomplete dynamic evidence | Reports do not consistently drill to source records | Report registry, chart data APIs, detail drilldowns | Module APIs | Medium-high | Each report shows chart and underlying records |
| 17 | Question-paper scribble/diagram support is incomplete | Math/science/social questions need diagrams/formulas | Attachment/canvas/scribble storage and renderer | Uploads/docs, question tables | Medium | Question builder supports typed + scribble assets |
| 18 | Visual QA regressions remain possible | Dark-on-dark and overflow reduce trust | Design tokens and contrast audit across pages/mobile | Existing UI components | Medium | WCAG AA pass for key surfaces |
| 19 | APK UX parity is not proven by screenshots | Claims cannot be trusted without visual evidence | Screenshot capture setup or manual evidence | Android/emulator/browser tooling | Medium | Side-by-side visual proof report |

## Medium Gaps

| Order | Gap | Business Impact | Technical Impact | Dependencies | Risk | Completion Evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 20 | Commercial SaaS controls are shallow | Billing/tenant management remains incomplete | Plans, usage metering, renewals, tenant lifecycle | Finance, school lifecycle, AI metering | Medium | Plan/usage/revenue dashboards with records |
| 21 | Notifications are not end-to-end proven | Users miss approvals, attendance, billing updates | Notification templates, delivery logs, mobile registration | Users, parent portal, mobile | Medium | Trigger and delivery evidence |
| 22 | Document intelligence is incomplete | AI cannot ground circulars/policies/question papers reliably | Ingestion, indexing, metadata, retrieval | Uploads/docs, AI KB | Medium | Documents searchable and cited |
| 23 | Lint/type debt remains high | Future changes risk regressions | Fix high-signal lint issues first | Existing source | Medium | Build + lint trend improvement |

## Low Gaps

| Order | Gap | Business Impact | Technical Impact | Dependencies | Risk | Completion Evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 24 | Cosmetic consistency | Improves perceived quality but does not prove workflow | Token cleanup, spacing, cards | Visual QA | Low | No unreadable text or overflow |
| 25 | Additional animations | Improves premium feel | Subtle transitions/loading states | Stable UI | Low | No performance or accessibility regression |

## Implementation Phases

### Phase 1: Integrity Substrate

Objective: make every later workflow trustworthy.

1. Build a reusable active context resolver for `school_id`, `academic_year_id`, and `created_by`.
2. Audit operational write APIs for missing academic-year fields.
3. Patch highest-impact writes first: students, teachers, attendance, homework, question papers, exams, exam schedule, marks, invoices, payments, concessions, dining, transport, hostel.
4. Harden `recordEvent` to always attach school/year/user when resolvable.
5. Ensure timeline fan-out for student, teacher, class, and school.

Reports:

- `ACADEMIC_YEAR_COMPLETION_REPORT.md`
- `EVENT_LEDGER_COMPLETION_REPORT.md`

Validation:

- Prisma validate/generate.
- DB column coverage audit.
- Controlled write smoke tests with real or temporary rollback-safe records.
- Event/timeline row evidence.

### Phase 2: 360 Architecture

Objective: make Student 360, Teacher 360, School 360, and Class 360 operational centers.

1. Student 360: profile, admissions, attendance, homework, exams, marks, invoices, payments, concessions, transport, hostel, dining, documents, timeline, event ledger, AI insights.
2. Teacher 360: profile, attendance, classes, subjects, homework, question papers, exams, marks, salary/performance placeholders only if backed by data, timeline, event ledger, AI insights.
3. School 360: real command-center KPIs for students, teachers, classes, sections, subjects, attendance, finance, dining, transport, hostel, performance, revenue, risks, AI insights, timeline, event ledger.
4. Class 360: roster, subjects, timetable, attendance, homework, exams, marks, timelines.

Reports:

- `STUDENT_360_COMPLETION_REPORT.md`
- `TEACHER_360_COMPLETION_REPORT.md`
- `SCHOOL_360_COMPLETION_REPORT.md`

Validation:

- API responses prove all tabs use real DB records.
- Web and mobile screens render the same workflow evidence.
- Historical year switching works.

### Phase 3: Finance Completion

Objective: close revenue workflows end to end.

1. Fee categories and class/section/student assignments.
2. Invoice wizard with line items and installments.
3. Invoice approval restricted to `SUPER_ADMIN` and `OWNER` or equivalent dynamic permissions.
4. Concession request, approval, rejection, audit log.
5. Payments, receipts, pending fees, defaulters and collection reports.
6. Finance 360 tabs in student/school views.

Report:

- `FINANCE_COMPLETION_REPORT.md`

Validation:

- Create invoice by class/section and by specific student.
- Collect payment with class/section/student filters.
- Approve/reject concession.
- Drilldown reports show source records.

### Phase 4: Operations Completion

Objective: make Dining, Transport, and Hostel production-grade operations centers.

Dining:

- Meal plans, weekly menus, special diets, inventory, purchases, consumption, production sheets, wastage, attendance, cost tracking, analytics, AI recommendations.

Transport:

- Vehicles, drivers, routes, route stops, student/teacher assignments, attendance, pickup/drop history, revenue analytics, AI recommendations.

Hostel:

- Blocks, rooms, beds, allocations, attendance, movement history, vacancies, revenue analytics, AI recommendations.

Reports:

- `DINING_COMPLETION_REPORT.md`
- `TRANSPORT_COMPLETION_REPORT.md`
- `HOSTEL_COMPLETION_REPORT.md`

Validation:

- Class/section/student filtering works everywhere applicable.
- Records appear in Student 360, Teacher 360 where relevant, School 360, Event Ledger, and Timeline.
- Mobile workflows can create/assign/review.

### Phase 5: Governance and Dynamic RBAC

Objective: remove hardcoded enterprise behavior.

1. Inventory current hardcoded role/permission/flag checks.
2. Replace direct role checks with dynamic permission guards where feasible.
3. Make menus, pages, actions, APIs, features and module access DB-driven.
4. Add deny/allow evidence for super admin, admin, principal, teacher.
5. Preserve user-requested access matrix:
   - Super admin: full remove access for schools, classes, sections, timetable, subjects, exams, exam schedule, transport, routes, hostels, dining menus, meal plans.
   - Admin: add/edit/remove for timetable, subjects, exams, exam schedule, transport, routes, hostels, dining menus, meal plans.
   - Principal: add/view/edit sections, timetable, subjects, exams, exam schedule.
   - Teacher: add/view/edit timetable, subjects, exams, exam schedule.

Report:

- `GOVERNANCE_COMPLETION_REPORT.md`

Validation:

- Source-code count reduction.
- API-level permission tests.
- Menu/page visibility tests.

### Phase 6: TOTTECH AI Foundation and Vision

Objective: make TOTTECH AI answer like an AI assistant and act like a safe school copilot.

Foundation:

1. Knowledge base first retrieval.
2. ERP grounding.
3. Document grounding.
4. Official-source retrieval.
5. Governed internet retrieval.
6. Answer extraction.
7. Store question, answer, summary, keywords, sources, retrieved date, confidence, school context, academic year.
8. Never return source registry dumps as final answers.

Vision:

1. School Assistant.
2. School Copilot.
3. School Agent.
4. School Brain.
5. Modes: Executive, Teacher, Parent, Student, Governance.
6. Safe actions: preview, approval, execute, audit.
7. Observability: prompt, answer, source, provider, user, school, cost, latency, actions, approvals, failures.

Reports:

- `TOTTECH_AI_FOUNDATION_REPORT.md`
- `TOTTECH_AI_VISION_REPORT.md`

Validation:

- Known AP school-opening and SSC exam-date questions answer directly with source citations.
- Same question later hits knowledge base.
- AI action creates preview only before approval.
- Approval/execution writes event ledger and module records.

### Phase 7: Mobile APK Parity

Objective: preserve APK product experience while making workflows live.

1. Use recovered APK navigation/interaction language as baseline.
2. Preserve command-center UX for Dashboard, Student Workspace, Teacher Workspace, School Workspace, SchoolGPT, TOTTECH AI, Dining, Transport, Hostel, Finance, Governance and War Room.
3. Replace shell screens with API-backed workflows.
4. Add mobile create/edit/delete/assign/approve/search/generate/review/export where supported by web/API.
5. Rebuild release APK and publish at `/downloads/apk-release.apk` and `/downloads/app-release.apk`.

Report:

- `APK_PARITY_COMPLETION_REPORT.md`

Validation:

- Android typecheck/build.
- APK download check.
- Workflow matrix with mobile source evidence.

### Phase 8: Visual QA and Accessibility

Objective: prevent unreadable text, clipped cards and broken responsive layouts.

1. Audit dark-on-dark and light-on-light issues.
2. Fix header, hero cards, KPI cards, AI chat bubbles, badges, avatars, forms, modals, dropdowns, mobile cards.
3. Enforce black/white/gold tokens with readable contrast.
4. Verify desktop, tablet and mobile layouts.

Report:

- `UI_QUALITY_AUDIT_REPORT.md`

Validation:

- Browser screenshots where available.
- No known dark-on-dark regressions.
- No horizontal page scroll on core pages.

### Phase 9: Final Capability Validation

Objective: prove readiness honestly.

1. Validate every module by workflow, not route.
2. Check Create, Read, Update, Delete, Assign, Approve, Audit, Timeline, Academic Year and Mobile.
3. Generate evidence tables from runtime checks.
4. Do not claim 95% if evidence is missing.

Report:

- `FINAL_ENTERPRISE_READINESS_REPORT.md`

Validation:

- Prisma validation.
- TypeScript/build.
- ESLint status and remaining debt.
- Production build.
- Android build.
- RBAC audit.
- Academic year audit.
- Governance audit.
- AI audit.
- Timeline audit.
- Operational history audit.

## Immediate Execution Order

1. Phase 1: Context resolver, academic-year write audit, event-ledger/timeline hardening.
2. Phase 2: Student/Teacher/School/Class 360 API aggregation and UI/mobile evidence.
3. Phase 3: Finance workflow closure.
4. Phase 4: Dining/Transport/Hostel workflow closure.
5. Phase 5: Governance/RBAC enforcement pass.
6. Phase 6: TOTTECH AI answer/action/memory completion.
7. Phase 7: Mobile APK parity.
8. Phase 8: Visual QA.
9. Phase 9: Final validation report.

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Production data corruption during wide workflow changes | Critical | Verified rollback point, controlled writes, no fake records for score inflation |
| Existing Prisma migration baseline mismatch | High | Prefer additive SQL with Prisma schema sync, document migrations, validate with `prisma generate` |
| Hardcoded role checks hidden in legacy code | High | Source-code count audit plus targeted replacement by module |
| Mobile parity claims without runtime screenshots | Medium | Use source/build/workflow evidence now; add screenshot tooling when Android runtime is available |
| Official/internet AI answers becoming stale | Medium | Store retrieved date and confidence; revalidate official-source answers |
| Full 95% target may exceed current sprint size | High | Report truthfully with evidence and remaining gaps |

## Definition of Enterprise Completion

The sprint can claim enterprise completion only when:

- Core workflow records include school, academic year, created user and timestamps.
- Student 360, Teacher 360, School 360 and Class 360 are real operational centers.
- Finance, Dining, Transport and Hostel workflows can be executed and audited.
- Dynamic RBAC governs APIs, menus, pages, actions and features.
- Event Ledger and timelines record every major action.
- TOTTECH AI answers questions directly, cites sources, stores knowledge and performs safe approved actions.
- Mobile app executes workflows, not just navigation.
- APK parity and UI quality are proven with evidence.
- `FINAL_ENTERPRISE_READINESS_REPORT.md` reaches targets using workflow proof, not route counts.
