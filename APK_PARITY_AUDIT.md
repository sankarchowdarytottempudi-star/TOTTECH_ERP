# APK Parity Forensic Audit

Generated: 2026-06-05

Scope: audit only. No application code, routes, APIs, screens, CSS, database schema, or production records were modified.

## Executive Verdict

The current TOTTECH ONE production system is online and materially improved from the recovered backup, but it is still not at full parity with the latest known APK state.

The APK proves a later, mobile-first product with School OS context, AI Command Center, Student Workspace, Teacher Workspace, Invoice Generation Wizard, Concessions 360, Dining Attendance Intelligence, offline attendance/dining drafts, Governance Center, Automation Engine, Audit Center, War Room, Knowledge Base, and SchoolGPT.

Current production has many of the matching API routes and several web workflows. The largest remaining gap is execution parity: many APK-proven mobile workflows are represented as route names or cards, not as complete native workflows with live data, create/update actions, approval, audit, timeline fan-out, and offline sync.

## Evidence Sources

| Source | Evidence Used |
|---|---|
| Latest APK | `/opt/recovery/downloads/app-release (3).apk`, 60M, version evidence in `APK_FORENSIC_REPORT.md`. |
| APK extraction | `/opt/apk-forensics/tottech-one-latest-apk`, including Hermes bytecode dump and endpoint/navigation reports. |
| APK reports | `APK_FORENSIC_REPORT.md`, `APK_SOURCE_GAP_MATRIX.md`. |
| Current source | `/opt/tottech-one`, 117 API route files, 169 exported API methods, 92 web pages. |
| Current mobile source | `/opt/tottech-one/mobile`, React Native CLI Android project exists; rebuilt APK exists at `mobile/android/app/build/outputs/apk/release/app-release.apk`, 56M. |
| Published APK | `public/downloads/app-release.apk`, 56M. This is a rebuilt APK, not byte-for-byte the recovered 60M APK. |
| Live production | Authenticated checks against `https://erp.tottechsolutions.com`. |
| Database | PostgreSQL `schoolerp`, relevant row counts and table columns inspected. |

## Important Distinction

`APK_SOURCE_GAP_MATRIX.md` proves that many APK endpoint names were reconstructed. That is useful, but endpoint parity is not workflow parity.

For this audit, a feature is considered:

- `WORKING` only when APK evidence, source, UI, database/API, live production, and a credible end-to-end workflow exist.
- `PARTIAL` when important pieces exist but the APK-proven workflow is incomplete, shell-like, not mobile-native, not audited, or not data-proven.
- `MISSING` when no credible production workflow exists.

No production write smoke tests were performed during this audit.

## Live Production Reachability

Authenticated login returned 200. The following selected checks returned 200:

| Surface | Result |
|---|---|
| `/dashboard` | 200 |
| `/students`, `/students/1000` | 200 |
| `/teachers`, `/teachers/1` | 200 |
| `/finance`, `/finance/invoices`, `/finance/concessions` | 200 |
| `/dining`, `/transport`, `/hostel` | 200 |
| `/war-room`, `/ai-command-center`, `/settings/roles`, `/mobile-app`, `/reports` | 200 |
| `/api/school-os/context` | 200 |
| `/api/students`, `/api/students/1000`, `/api/students/1000/enterprise-history` | 200 |
| `/api/teachers`, `/api/teachers/1`, `/api/teachers/1/enterprise-history` | 200 |
| `/api/dining`, `/api/dining-attendance-recovery` | 200 |
| `/api/transport`, `/api/hostels` | 200 |
| `/api/finance`, `/api/finance/invoices`, `/api/concessions/360` | 200 |
| `/api/tottech-ai/actions`, `/api/tottech-ai/knowledge`, `/api/tottech-ai/observability`, `/api/tottech-ai/providers`, `/api/tottech-ai/usage` | 200 |
| `/api/operations/audit-center`, `/api/operations/data-integrity`, `/api/operations/health` | 200 |
| `/api/reports-center`, `/api/schoolgpt`, `/api/parent/summary` | 200 |

Reachability is not counted as proof of a completed workflow.

## Database Reality

| Table | Rows | Parity Meaning |
|---|---:|---|
| schools | 2 | Restored core tenant data exists. |
| students | 1003 | Core roster exists. |
| teachers | 51 | Core faculty roster exists. |
| classes | 20 | Class setup exists. |
| sections | 61 | Section setup exists. |
| academic_years | 4 | Active academic years exist for both schools. |
| student_year_enrollments | 1003 | Student/year links exist. |
| invoices | 1 | Invoice table exists but production volume is not proven. |
| invoice_line_items | 0 | Generated invoice detail rows are absent in current data. |
| invoice_installments | 0 | Payment part workflow is not data-proven. |
| fee_categories | 8 | Fee categories are real. |
| concession_requests | 0 | Concession workflow is not data-proven. |
| concession_audit_logs | 0 | Concession approval audit is not data-proven. |
| event_ledger | 25 | Event ledger exists, but sparse. |
| student_timelines | 2 | Student timeline exists, but sparse. |
| teacher_timelines | 0 | Teacher timeline is not data-proven. |
| class_timelines | 0 | Class 360/history is not data-proven. |
| school_timelines | 4 | School timeline is sparse. |
| dining_attendance | 0 | Dining attendance workflow not data-proven. |
| dining_meal_plans | 0 | Meal plan workflow not data-proven. |
| dining_weekly_menus | 0 | Weekly menu workflow not data-proven. |
| dining_inventory_items | 0 | Dining inventory workflow missing in production data. |
| dining_purchases | 0 | Dining purchases workflow missing in production data. |
| dining_consumption_logs | 0 | Dining consumption workflow missing in production data. |
| dining_production_sheets | 0 | Kitchen production workflow missing in production data. |
| dining_wastage_logs | 0 | Wastage workflow missing in production data. |
| transport_vehicles | 2 | Vehicle data exists. |
| transport_routes | 0 | Route workflow is not data-proven. |
| transport_assignments | 0 | Assignment workflow is not data-proven. |
| hostel_rooms | 1 | Room data exists, shallow. |
| hostels | 1 | Hostel data exists, shallow. |
| hostel_allocations | 0 | Allocation workflow is not data-proven. |
| automation_rules | 0 | Automation engine is not operationally proven. |
| automation_runs | 0 | No automation execution evidence. |
| ai_action_requests | 5 | AI action queue exists. |
| ai_action_approvals | 2 | AI approval layer exists. |
| ai_usage_logs | 4 | AI usage tracking exists. |
| ai_observability_events | 11 | AI observability exists. |
| ai_providers | 9 | Provider registry exists. |
| ai_models | 1 | Only deterministic recovery model is enabled. |

Additional checks:

- Current academic years: school 1 and school 2 both have `2025-2026` marked current.
- Event ledger year coverage: 25 events total, 9 events have `academic_year_id` null.
- Enabled AI provider/model: only `deterministic` / `recovery-grounded-v1`.
- `TOTTECH_AI_ENABLE_WEB_SEARCH` is unset.
- Dynamic governance data exists: 101 permissions, 111 role-permission links, 6 feature flags, 6 menu permissions, 8 page permissions, 16 module permissions.
- Source still contains 89 hardcoded role-name references and 41 `requirePermission` call sites; governance is not fully dynamic across the codebase.

## APK Capability Matrix

| APK-Proven Capability | APK Proven | Source Exists | UI Exists | DB Exists | API Exists | Working Workflow Exists | Mobile Workflow Exists | Production Verified | Status | Evidence |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| AI Command Center | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | APK proves `AI Command Center`. Web `/ai-command-center` is metrics/read-oriented; real agent flow is split into `/ai-school-copilot`. Mobile `AICommandCenterScreen` is a recovered feature-card screen. |
| School Brain | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | `/api/brain`, `/api/schoolgpt`, `/api/tottech-ai/knowledge` live. Only deterministic provider is enabled; web search is unset. |
| Student Workspace | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | Web Student 360 exists at `/students/[id]`; mobile `StudentDetailScreen` names endpoints but does not fetch a selected student. |
| Teacher Workspace | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | Teacher detail exists but is read/analytics-oriented; mobile teacher workspace is not a full APK workflow. |
| Student 360 | Yes | Yes | Yes | Yes | Yes | Partial | Partial | Yes | PARTIAL | `/students/1000`, `/api/students/1000`, `/api/students/1000/enterprise-history` live. Operational history rows for dining/hostel/transport are empty. |
| Teacher 360 | Yes | Yes | Partial | Yes | Yes | Partial | Missing | Yes | PARTIAL | `/teachers/1` and enterprise history live, but `teacher_timelines` has 0 rows and mobile Teacher 360 is not implemented. |
| School 360 | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | `/schools/[id]`, War Room and school command APIs exist; workflow is read-oriented. |
| Finance Drilldown | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | Finance pages/API live; mobile FinanceDrilldown is feature-card only. |
| Invoice Generation Wizard | Yes | Yes | Yes | Yes | Yes | Partial | Missing | Yes | PARTIAL | Web invoice wizard exists and POST route supports class/section/student and installments. Mobile APK-proven wizard is not implemented as a live mobile workflow. |
| Fee Categories | Yes | Yes | Yes | Yes | Yes | Partial | Missing | Yes | PARTIAL | Web fee category CRUD exists and 8 categories exist. Mobile picker/wizard parity is missing. |
| Concessions 360 | Yes | Yes | Yes | Yes | Yes | Partial | Missing | Yes | PARTIAL | Create/approve UI and APIs exist, but 0 concession requests/audit logs and mobile workflow is shell only. |
| Dining Attendance Intelligence | Yes | Yes | Partial | Yes | Yes | Partial | Missing | Yes | PARTIAL | Web attendance form exists; 0 dining attendance rows; no mobile offline/live flow. |
| Dining Recovery | Yes | Yes | No workflow UI | Yes | Yes | Partial | Missing | Yes | PARTIAL | `/api/dining-attendance-recovery` exists and returns 200; no mobile offline queue/recovery UI. |
| Meal Plans | Yes | Yes | Yes | Yes | Yes | Partial | Missing | Yes | PARTIAL | Web meal plan create exists; 0 rows and no mobile workflow. |
| Weekly Menus | Yes | Yes | Yes | Yes | Yes | Partial | Missing | Yes | PARTIAL | Web weekly menu/calendar exists; 0 rows and no mobile workflow. |
| Special Diets | Yes | Partial | Missing | Partial | Missing | Missing | Missing | No | MISSING | APK strings prove special diet restrictions. Current dining UI/API do not expose a special-diet workflow. |
| Food Wastage | Yes | Partial | Missing | Yes | Missing | Missing | Missing | No | MISSING | `dining_wastage_logs` exists with 0 rows; no UI/API workflow found. |
| Kitchen Production | Yes | Partial | Missing | Yes | Missing | Missing | Missing | No | MISSING | `dining_production_sheets` exists with 0 rows; no UI/API workflow found. |
| Dining Analytics | Yes | Partial | Missing | Partial | Partial | Missing | Missing | No | MISSING | Dining page lists data but no analytics/intelligence workflow is proven. |
| Transport Administration | Yes | Yes | Yes | Yes | Yes | Partial | Missing | Yes | PARTIAL | Web vehicle/route/assignment forms exist; routes and assignments have 0 rows; mobile Transport routes to generic Operations cards. |
| Route Assignment | Yes | Yes | Yes | Yes | Yes | Partial | Missing | Yes | PARTIAL | Web route create and assignment exist; no production route/assignment rows; no mobile workflow. |
| Vehicle Assignment | Yes | Partial | Partial | Partial | Partial | Partial | Missing | Yes | PARTIAL | Vehicles exist; assignment is via route `vehicle_number`, not a complete vehicle assignment lifecycle. |
| Hostel Administration | Yes | Yes | Partial | Yes | Yes | Partial | Missing | Yes | PARTIAL | Hostel create exists; hostel UI is shallow and legacy-styled; no full allocation workflow. |
| Room Allocation | Yes | Partial | Missing | Yes | Partial | Missing | Missing | No | MISSING | `hostel_rooms` has 1 row and `hostel_allocations` has 0 rows; no normal UI allocation workflow. |
| Warden Management | Yes | Partial | Partial | Yes | Partial | Partial | Missing | Yes | PARTIAL | Warden fields exist on hostel create; no dedicated warden lifecycle. |
| Reports Center | Yes | Yes | Partial | Partial | Yes | Partial | Partial | Yes | PARTIAL | `/reports` and `/api/reports-center` live, but export/report workflow breadth is not proven. |
| War Room | Yes | Yes | Partial | Partial | Yes | Partial | Partial | Yes | PARTIAL | Web War Room is read-oriented. Mobile War Room is feature-card. No command actions/closure workflow. |
| Audit Center | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | Event Ledger and audit APIs exist; coverage is sparse and mobile audit center is shell-like. |
| Automation Engine | Yes | Partial | Partial | Yes | Partial | Missing | Partial | Yes | MISSING | Automation pages/cards exist, but `automation_rules` and `automation_runs` are both 0. |
| Observability | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | Operations health and AI observability APIs live; mobile observability is feature-card only. |
| Governance Center | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | Roles/permissions/flags exist, but hardcoded role checks remain and coverage is incomplete. |
| School Switching | Yes | Yes | Partial | Yes | Yes | Partial | Missing | Yes | PARTIAL | Switch APIs exist; mobile SchoolManagement screen only names the endpoint. |
| Knowledge Base | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | Knowledge documents API exists; document ingestion/index workflow is not fully proven. |
| SchoolGPT | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | `/api/schoolgpt` and `/api/tottech-ai/knowledge` live. Internet search disabled; official-source retrieval is not live-proven. |
| Notifications | Yes | Partial | Partial | Partial | Yes | Partial | Partial | Partial | PARTIAL | Device registration API exists, but no end-to-end push/parent notification workflow is proven. |
| Workflow Builder | Yes | Partial | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | AI action approval flow and promotions exist; no general APK-style workflow builder. |
| User Management | Yes | Yes | Yes | Yes | Yes | Partial | Partial | Yes | PARTIAL | Web user management works; mobile user management is feature-card only. |
| Platform Center | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | Branding/context APIs exist; commercial platform controls are shallow. |
| Parent Portal | Yes | Partial | Partial | Yes | Yes | Partial | Partial | Yes | PARTIAL | `/api/parent/summary` live; page is not a complete authenticated parent history/workflow experience. |
| Offline Attendance | Yes | Partial | Missing | Partial | Partial | Missing | Missing | No | MISSING | APK proves offline attendance drafts. Current mobile Attendance screen renders static cards and no offline draft queue. |
| Offline Dining | Yes | Partial | Missing | Partial | Yes | Partial | Missing | Yes | PARTIAL | Recovery endpoint exists, but mobile offline dining draft/sync workflow is absent. |

## APK Workflow Matrix

| Workflow | APK Intent | Current Web/API | Current Mobile | Audit/Timeline | Status |
|---|---|---|---|---|---|
| Create student | Mobile/admin create in active school | Web and mobile StudentsScreen POST `/api/students`; DB has 1003 students | Mobile create exists | Event recorded on API create/update/delete | WORKING/PARTIAL |
| Update student | Existing record update | Web edit and `PUT /api/students/[id]` exist | Mobile update missing | Event recorded | PARTIAL |
| Delete student from DB | Permanent delete | Web/mobile delete endpoints exist | Mobile delete exists | Delete records event after deletion | PARTIAL |
| Student 360 history | Attendance, marks, fees, dining, hostel, transport | Enterprise history API exists | Mobile detail is shell | Operational tables empty | PARTIAL |
| Create teacher/staff | Teacher/staff creation | Web and mobile teacher create exist | Mobile teacher create exists | Event recorded | WORKING/PARTIAL |
| Update teacher/staff | Existing record update | Web edit and `PUT /api/teachers/[id]` exist | Mobile update missing | Event recorded | PARTIAL |
| Teacher 360 history | Attendance, workload, copilot, timeline | Detail API/page exist | Mobile missing | `teacher_timelines` has 0 rows | PARTIAL |
| Exam creation | Create exams | Web/mobile AcademicsScreen POST `/api/exams` | Mobile actual API-backed workflow | Event recorded | WORKING/PARTIAL |
| Exam schedule | Schedule with class/section/subject | Web/mobile API-backed workflow | Mobile actual API-backed workflow | Event recorded | WORKING/PARTIAL |
| Question paper creation | Question-wise builder | Web/mobile API-backed workflow | Mobile actual API-backed workflow | Event recorded | WORKING/PARTIAL |
| Homework assignment | Assign homework | Web/mobile API-backed workflow | Mobile actual API-backed workflow | Event recorded | WORKING/PARTIAL |
| Marks entry | Question-wise marks | Web/mobile API-backed workflow | Mobile actual API-backed workflow | Event recorded | WORKING/PARTIAL |
| Invoice generation | Wizard by student/class/section/categories/installments | Web wizard and API exist | Mobile wizard missing | Event recorded on generation | PARTIAL |
| Fee category setup | Create/edit/delete fee structures | Web CRUD exists | Mobile picker missing | No universal audit | PARTIAL |
| Concession request/approval | Create, approve, reject, audit | Web/API exist | Mobile missing | Audit table exists but 0 rows | PARTIAL |
| Dining attendance | Class/section/student search and meal attendance | Web/API exist | Mobile missing | 0 rows | PARTIAL |
| Dining recovery/offline sync | Offline draft saved/synced | Recovery API exists | Mobile missing | Not data-proven | PARTIAL |
| Meal planning/menu | Meal plans and weekly menus | Web/API exist | Mobile missing | 0 rows | PARTIAL |
| Special diet | Restrictions/medical notes | Missing | Missing | Missing | MISSING |
| Kitchen production | Production/served/cost | Schema only | Missing | 0 rows | MISSING |
| Wastage | Wastage cost and reason | Schema only | Missing | 0 rows | MISSING |
| Transport route/assignment | Vehicles, routes, assignments | Web/API exist | Mobile missing | 0 route/assignment rows | PARTIAL |
| Hostel allocation | Hostel, room, bed allocation | AI action and schema exist; normal UI missing | Missing | 0 allocations | PARTIAL/MISSING |
| School switching | Active school context | APIs exist | Mobile selector missing | Not fully proven | PARTIAL |
| Governance controls | DB-driven roles/menus/features | DB and settings exist | Mobile missing | Hardcoded role refs remain | PARTIAL |
| Automation | Rules, alerts, follow-up | Cards/API foundations only | Mobile shell | 0 rules/runs | MISSING |
| Audit center | Event ledger evidence | API exists | Mobile shell | Sparse ledger | PARTIAL |
| War room | Command center actions | Read dashboard exists | Mobile shell | No closure workflow | PARTIAL |
| AI action approval | Preview -> approve -> execute -> ledger | Web copilot/API exist | Mobile shell | AI action rows exist | PARTIAL |
| Knowledge questions | ERP/docs/official/internet | Knowledge API exists | Mobile shell | Internet disabled | PARTIAL |

## APK Mobile Matrix

| Mobile Capability | Current Mobile Evidence | Status |
|---|---|---|
| Native Android project | `mobile/android` exists and release APK was built | WORKING |
| Login | `LoginScreen` calls `/api/auth/login` and stores cookie/user | WORKING |
| Dashboard navigation | Dashboard navigates to modules, but does not fetch live KPI data | PARTIAL |
| Students | Mobile list/create/delete with class/section roster API | PARTIAL |
| Student 360 | `StudentDetailScreen` is a recovered feature-card screen, no live selected student fetch | PARTIAL |
| Teachers | Mobile list/create/delete with class/section assignment | PARTIAL |
| Teacher 360 | No live teacher detail workflow | MISSING |
| Academics | Mobile creates exams, exam types, schedules, papers, homework, marks | WORKING/PARTIAL |
| Attendance | Static cards only | MISSING |
| Finance | Feature-card screen only; no invoice wizard | MISSING |
| Concessions | Feature-card screen only | MISSING |
| Dining | Routes to generic Operations; no meal/attendance/offline workflow | MISSING |
| Transport | Routes to generic Operations; no route/assignment workflow | MISSING |
| Hostel | Routes to generic Operations; no allocation workflow | MISSING |
| War Room | Feature-card screen only | PARTIAL |
| Audit Center | Feature-card screen only | PARTIAL |
| Automation Engine | Feature-card screen only | MISSING |
| Governance | Feature-card screen only | PARTIAL/MISSING |
| AI Command Center | Feature-card screen only | PARTIAL/MISSING |
| Knowledge Base | Feature-card screen only | PARTIAL/MISSING |
| Notifications | Feature-card screen only | PARTIAL/MISSING |
| School switching | Endpoint named but no selector/write workflow | MISSING |
| Offline attendance | APK-proven but absent in source | MISSING |
| Offline dining | Recovery API exists but mobile draft/sync absent | MISSING |
| Mobile global search | APK-proven; not found as a live mobile search workflow | MISSING |

Mobile API evidence: only 9 `apiRequest` call sites were found in `mobile/src`, concentrated in login, students, teachers, and academics.

## APK AI Matrix

| AI Capability | APK Evidence | Current Evidence | Status |
|---|---|---|---|
| AI Command Center | APK screen/string | Web dashboard exists; actual action UI lives in `/ai-school-copilot`; mobile card only | PARTIAL |
| School Brain | SchoolGPT and School Brain strings | `/api/brain`, `/api/schoolgpt`, `/api/tottech-ai/knowledge` live | PARTIAL |
| Knowledge Engine | ERP/docs/official/internet priority | ERP/document/official source code exists; internet search unset | PARTIAL |
| Official source intelligence | AP GO, CBSE, NCERT, UGC, AICTE references | Official source links/fallbacks exist; no live retrieval proven | PARTIAL |
| Internet intelligence | APK and vision require fallback internet | `TOTTECH_AI_ENABLE_WEB_SEARCH=unset` | MISSING |
| Action Engine | AI actions and approvals | 23 supported action types in source; action queue rows exist | PARTIAL |
| Approval Engine | Preview -> approval -> execute | APIs and 2 approval rows exist | PARTIAL/WORKING |
| Provider abstraction | Provider layer | 9 providers registered; only deterministic enabled | PARTIAL |
| Provider dashboards | Usage/health/cost | Usage/observability APIs live | PARTIAL |
| Prompt/action observability | Prompt/source/provider/user/cost/latency | AI observability rows exist | PARTIAL |
| Mobile AI workflow | AI Command Center mobile | Feature-card screen only | MISSING |
| Autonomous agents | Automation and copilot | `automation_rules=0`, `automation_runs=0` | MISSING |
| Grounding by academic year/RBAC/event ledger | APK/vision | Grounding exists but event coverage is sparse and 9 event rows have null year | PARTIAL |

## APK UX Matrix

| Area | APK Intent | Current Production Match | Status |
|---|---|---|---|
| Navigation | Mobile command-center structure | Mobile route map exists; many screens are cards | PARTIAL |
| Dashboard | Mobile command center with School OS context | Web/dashboard reachable; mobile dashboard static | PARTIAL |
| Student screens | Student Workspace and intervention workflow | Web Student 360 partial; mobile student list works but detail shell | PARTIAL |
| Teacher screens | Teacher Workflow Builder and Teacher 360 | Web teacher detail partial; mobile workflow incomplete | PARTIAL |
| Finance | Treasury Control and invoice wizard | Web wizard exists; mobile missing | PARTIAL |
| Dining | Attendance intelligence, menus, offline | Web partial; mobile missing | PARTIAL |
| Transport | Admin, route, assignment | Web partial; mobile missing | PARTIAL |
| Hostel | Admin, rooms, allocation | Web shallow; mobile missing | PARTIAL/MISSING |
| Governance | School-wise flags, quotas, roles | DB exists but enforcement incomplete; mobile shell | PARTIAL |
| AI | Command Center, School Brain, Knowledge Base | Web split and partial; mobile shell | PARTIAL |
| War Room | Executive command center and drilldowns | Web read-oriented; mobile shell | PARTIAL |
| Automation | Rule cards, alerts, reminders | No production rules/runs | MISSING |
| Reports | Reports Center and exports | API/page live but workflow breadth unproven | PARTIAL |
| Audit | Audit trail and activity evidence | Event ledger exists but sparse | PARTIAL |
| Knowledge Base | Documents and education sources | API exists but ingestion/search not fully proven | PARTIAL |

## What Exists But Is Still Not APK Parity

1. API endpoints matching APK strings exist, but many do not prove business completion.
2. Mobile route names exist, but many screens render feature cards rather than executing the workflow.
3. Web workflows exist for students, teachers, academics, invoices, dining, transport and concessions, but APK was mobile-first and offline-aware.
4. Database tables exist for many enterprise modules, but production rows are mostly absent for dining, hostel, transport, concession and automation.
5. Event Ledger exists, but coverage is sparse and some events lack academic-year context.
6. Dynamic RBAC data exists, but hardcoded role checks remain.
7. AI provider abstraction exists, but external model execution and internet intelligence are not enabled/proven.

## Top 50 Missing APK Capabilities By Business Impact

1. Mobile dining attendance workflow with class/section/student search and meal marking.
2. Mobile offline dining draft queue and sync loop.
3. Mobile offline student attendance draft queue and sync loop.
4. Mobile transport route creation and assignment workflow.
5. Mobile hostel allocation workflow with hostel, room, bed and student assignment.
6. Mobile invoice generation wizard with scope, student/class/section, fee category selection, and installment parts.
7. Mobile concession request and approval workflow.
8. Mobile AI Command Center with actual prompt/action/approval execution, not feature cards.
9. Mobile School Brain and SchoolGPT question flow.
10. Mobile school switching selector that writes active school context.
11. Mobile Student 360 detail that fetches real student, timeline, attendance, finance, dining, transport and hostel history.
12. Mobile Teacher 360 detail that fetches real teacher, assignments, workload, attendance and timeline.
13. Complete Teacher Workspace / Teacher Workflow Builder.
14. Complete School 360 command workflow with actions and follow-up closure.
15. Dining special diet and medical restriction workflow.
16. Dining kitchen production sheets.
17. Dining food wastage logging and cost impact.
18. Dining purchase and inventory workflows.
19. Dining analytics for served count, cost, wastage and meal participation.
20. Transport route data is empty in production.
21. Transport assignment data is empty in production.
22. Transport attendance workflow.
23. Transport pickup/drop history workflow.
24. Vehicle-to-route lifecycle and capacity utilization workflow.
25. Hostel room allocation workflow.
26. Hostel attendance workflow.
27. Hostel movement history workflow.
28. Dedicated warden management lifecycle.
29. Concession production data and audit log proof.
30. Invoice line-item and installment data proof in production.
31. Payment installment collection workflow tied to invoice parts.
32. Parent-visible finance history tied to invoices/payments/concessions.
33. Parent Portal full authenticated history, notifications, homework, attendance and fee visibility.
34. Workflow Builder beyond AI action queue and promotion fragments.
35. Automation rules and scheduled runs.
36. War Room action closure, owner assignment and follow-up audit.
37. Universal Event Ledger coverage across legacy APIs.
38. Universal timeline fan-out for student, teacher, class and school records.
39. Class 360 history and timeline.
40. Teacher timeline rows and operational history.
41. Academic-year defaulting in every event/action path.
42. Previous-year operational reporting across dining, transport, hostel, finance and attendance.
43. Full dynamic RBAC enforcement on every API route.
44. Elimination of hardcoded role-name gates from source.
45. Database-driven menu/page/module permissions in the actual navigation layer.
46. Provider-enabled TOTTECH AI beyond deterministic recovery model.
47. Live official-source retrieval for AP GO, CBSE, NCERT, UGC, AICTE and education updates.
48. Internet fallback search for education questions when ERP/docs/official sources are insufficient.
49. AI observability dashboard tied to every prompt, source, action, approval, cost and failure.
50. Mobile push notification lifecycle from registration to delivered school/parent alerts.

## Parity Scores

Scoring basis: `WORKING = 1`, `PARTIAL = 0.5`, `MISSING = 0`, adjusted downward where production data is empty or mobile workflow is only a feature card.

| Area | Score | Rationale |
|---|---:|---|
| APK Parity | 44% | Most APK-proven capabilities have some source/API evidence, but few are complete end-to-end workflows. |
| Mobile APK Parity | 31% | Login, students, teachers and academics have real API calls. Most APK command-center, AI, governance, finance, dining, transport, hostel and offline workflows are missing or shells. |
| AI APK Parity | 40% | AI action/approval/observability foundation exists. External providers, internet intelligence, autonomous agents and mobile AI are not proven. |
| ERP APK Parity | 57% | Web/API/database reconstruction is significantly stronger than mobile. Finance, academics, students, teachers, dining and transport have real pieces, but operational data and full workflows are incomplete. |
| Overall Platform Parity | 45% | The platform is restored and partially reconstructed, but APK-proven business execution is still substantially incomplete. |

## Final Audit Position

The current production platform is not merely cosmetic, and it is not just the old recovered backup. It has real reconstructed APIs, database tables, web workflows, a native Android project, and some mobile API-backed workflows.

However, the current production platform still does not match the latest known APK experience. The APK's strongest evidence is mobile-first enterprise execution. Current production is strongest on web/API foundations and weakest on native mobile workflow execution, offline sync, automation, governance enforcement, operational history, and AI vision completion.

The next implementation sprint should target the missing APK capabilities above, starting with mobile workflow parity and the empty operational modules: dining, transport, hostel, concessions, invoice installments/payments, timelines, event ledger coverage, dynamic RBAC, and real TOTTECH AI knowledge/action/approval execution.
