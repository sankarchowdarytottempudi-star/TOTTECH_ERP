# APK Source Gap Matrix

Date: 2026-06-05

Comparison sources:

- Recovered source: `/opt/tottech-one`
- Current database: PostgreSQL `schoolerp`
- Current web app: `https://erp.tottechsolutions.com`
- Current mobile source: `/opt/tottech-one/mobile`
- APK product reference: `/opt/recovery/downloads/app-release (3).apk`

## Coverage Summary

```text
APK-proven endpoint references: 42
Endpoint routes now present: 42
APK screen identifiers: 53
Mobile route/screen coverage now represented: 45
Current DB tables: 128
Current web/app build routes: 175
```

## Endpoint Gap Matrix

| APK-Proven Endpoint | Source Before | Status After Reconstruction | Notes |
|---|---:|---:|---|
| `/api/school-os/context` | Missing | Reconstructed | School, academic year, governance, KPIs, events, health. |
| `/api/concessions/360` | Missing | Reconstructed | Requests, status summary, audit rows. |
| `/api/ai/usage` | Missing alias | Reconstructed | Alias to TOTTECH AI usage. |
| `/api/dining-attendance-recovery` | Missing | Reconstructed | Offline dining recovery and summary. |
| `/api/finance/invoices` | Missing list/generate route | Reconstructed | GET list/summary and POST invoice generation. |
| `/api/homework/submissions` | Missing | Reconstructed | Submission review API. |
| `/api/import` | Missing alias | Reconstructed | Alias to existing imports API. |
| `/api/knowledge/documents` | Missing | Reconstructed | Knowledge documents for SchoolGPT. |
| `/api/my-school-branding` | Missing alias | Reconstructed | Alias to branding API. |
| `/api/operations/audit-center` | Missing alias | Reconstructed | Alias to operations audit API. |
| `/api/operations/data-integrity` | Missing | Reconstructed | Academic-year/workflow integrity checks. |
| `/api/rbac/meal-plans` | Missing | Reconstructed | Dining permissions and meal plan access. |
| `/api/reports-center` | Missing alias | Reconstructed | Alias to reports API. |
| `/api/schoolgpt` | Missing alias | Reconstructed | Alias to TOTTECH AI knowledge engine. |
| `/api/switch-school-os-context` | Missing | Reconstructed | Active school switch for mobile context. |

All other APK endpoint references were already present in the current web/API source.

## Screen Gap Matrix

| APK Screen / Feature | Recovered Mobile Source Before | Status After Reconstruction |
|---|---:|---:|
| Dashboard | Recovered | Enhanced |
| Login | Recovered | Existing |
| Students | Recovered | Partial |
| StudentDetail / Student Workspace | Missing | Reconstructed shell |
| Teachers | Recovered | Partial |
| Attendance | Recovered | Existing |
| Marks | Recovered | Existing |
| Academics | Missing | Reconstructed shell |
| Admissions | Missing | Reconstructed shell |
| Exams | Missing | Reconstructed shell |
| Homework | Missing | Reconstructed shell |
| Timetable | Missing | Reconstructed shell |
| Finance | Missing | Reconstructed shell |
| FinanceDrilldown | Missing | Reconstructed shell |
| Concessions | Missing | Reconstructed shell |
| Dining | Partial through operations | Needs dedicated native UX |
| Transport | Partial through operations | Needs dedicated native UX |
| Hostel | Partial through operations | Needs dedicated native UX |
| Reports | Missing | Reconstructed shell |
| WarRoom | Missing | Reconstructed shell |
| AutomationEngine | Missing | Reconstructed shell |
| AuditCenter | Missing | Reconstructed shell |
| Governance | Missing | Reconstructed shell |
| Observability | Missing | Reconstructed shell |
| AICommandCenter | Missing | Reconstructed shell |
| KnowledgeBase | Missing | Reconstructed shell |
| Notifications | Missing | Reconstructed shell |
| SchoolManagement | Missing | Reconstructed shell |
| UserManagement | Missing | Reconstructed shell |
| Onboarding | Missing | Reconstructed shell |
| Platform | Missing | Reconstructed shell |
| Profile | Missing | Reconstructed shell |
| WorkflowBuilder | Missing | Reconstructed shell |

The rebuilt mobile source now represents APK-proven navigation and screen intent. Several screens remain shells rather than full native data-entry implementations.

## Priority Feature Matrix

| Feature | APK Evidence | Web/API | DB | Mobile | Status |
|---|---|---:|---:|---:|---|
| Student 360 | Student Workspace, at-risk students, timeline, profile | Partial | Present | Reconstructed shell | Partial |
| Teacher 360 | Teacher profile, assignments, copilot | Partial | Present | Recovered/partial | Partial |
| School 360 | School OS, health, War Room | Reconstructed | Present | Reconstructed shell | Partial |
| Dining Operations | Meal plans, offline dining drafts, served count | Reconstructed API | Present | Partial | Partial |
| Transport Operations | Route visibility, vehicle/admin reports | Existing API | Partial | Partial | Partial |
| Hostel Operations | Room capacity, warden, assignment | Existing API + DB | Partial | Partial | Partial |
| Invoice Generation | Invoice wizard, generate invoices from mobile | Reconstructed POST | Present | Reconstructed shell | Runtime proven |
| Fee Categories | Fee category endpoint and mobile picker | Existing | Present | Reconstructed shell | Recovered |
| Concession Workflow | Concessions 360, approvals | Reconstructed | Present | Reconstructed shell | Partial |
| Approval Workflow | Finance approvals, AI approval flow | Existing + reconstructed | Present | Reconstructed shell | Partial |
| Academic Year Engine | Academic OS, active school/year context | Existing + reconstructed | Present | Mobile shell | Partial |
| Promotion Engine | Promotion probability/workflow references | Existing + enterprise APIs | Present | Workflow shell | Partial |
| Event Ledger | Audit/activity evidence | Existing | Present | Audit shell | Partial |
| Timeline | Timeline refs, Student 360 | Existing APIs | Present | Record shell | Partial |
| War Room | War Room screen | Existing page + shell | Present | Reconstructed shell | Partial |
| Automation | Automation Engine | Existing foundation | Present | Reconstructed shell | Partial |
| Governance | Role access, quotas, flags | Existing + context | Present | Reconstructed shell | Partial |
| Observability | Health, audit, AI observability | Existing + alias | Present | Reconstructed shell | Partial |
| Parent Portal | Parent summary, notifications | Existing API/page | Present | Notifications shell | Partial |
| Notification Center | Register device, push abstraction | Existing | Present | Reconstructed shell | Partial |
| TOTTECH AI SchoolGPT | SchoolGPT, Knowledge Base, AI usage | Existing + aliases | Present | Reconstructed shell | Partial |

## Missing or Still Partial

- Dedicated native Dining screen with offline queue persistence and sync UI.
- Dedicated native Transport screen with assignment/write workflows.
- Dedicated native Hostel screen with room/bed allocation write workflows.
- Full native Student 360 detail with live API fetch and drill-down tabs.
- Full native Teacher 360 detail with live API fetch and workload management.
- Native Android project folder and build toolchain.
- End-to-end automated Playwright/Appium validation of APK parity.
- Full Prisma schema update for all additive enterprise DB columns/tables.
- Existing full-repo lint debt remains.

## Reconstruction Decisions

When APK and recovered source differed, APK evidence won. The following were added because the APK proved them:

- School OS context API.
- Mobile school switching API.
- Concessions 360 API.
- Dining attendance recovery API.
- Finance invoices list and generation API.
- Homework submissions API.
- Knowledge documents API.
- Reports Center API alias.
- SchoolGPT API alias.
- AI usage API alias.
- Operations Audit Center alias.
- Operations data-integrity API.
- RBAC meal plans API.
- Rebuilt mobile screen source for APK-proven command-center modules.
