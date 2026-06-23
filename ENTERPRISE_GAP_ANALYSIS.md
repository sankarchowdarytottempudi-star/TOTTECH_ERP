# ENTERPRISE GAP ANALYSIS

Generated: 2026-06-05  
System: TOTTECH ONE live recovery at `/opt/tottech-one`  
Rule: This audit was generated before this sprint's implementation changes.

## Executive Summary

The recovered system is no longer just the old backup. It now has a live production cutover, 105 Prisma models, 92 web pages, 88 API routes, Event Ledger, timeline tables, governed TOTTECH AI gateway, and an agentic AI backend.

It is still not the highest-known enterprise state described in the reconstruction prompt. The largest remaining gaps are inconsistent academic-year ownership across operational tables, incomplete promotion workflow, incomplete finance approval ledgers, incomplete person-level dining, incomplete first-class homework/timetable/dining-plan tables, partial dynamic RBAC, outdated recovered UI patterns, and no complete native Android project/signing chain.

## Current Inventory

| Area | Current Evidence |
|---|---:|
| Web pages | 92 |
| API routes | 88 |
| Prisma models | 105 |
| Database tables | 105 |
| Schools | 2 |
| Students | 1003 |
| Teachers | 51 |
| Attendance rows | 206 |
| Event ledger rows | 9 |
| AI knowledge sources | 11 |
| AI action requests | 2 |
| Hardcoded role references | 61 |
| Roles without permissions | 11 |

## Gap Matrix

| Area | Status | Evidence | Required Work |
|---|---|---|---|
| Web | Partial | App is live, 92 pages, modernized logo, many pages still recovered admin-panel style | Premium SaaS UI pass, remove placeholders, fix overflow and broken buttons |
| Mobile | Partial | React Native source exists, typechecks earlier; native Android/signing missing | Native project, release build, parity screens, keyboard/overflow fixes |
| Database | Partial | 105 tables, many enterprise tables exist | Add academic-year columns and missing workflow/history tables |
| Prisma | Partial | Schema validates, 105 models | Add new enterprise models and regenerate client |
| RBAC | Partial | DB-backed permissions exist; SUPER_ADMIN has permissions | Remove hardcoded roles, map 11 non-admin role profiles |
| Governance | Partial | Governance settings, feature flags, menu/page/module permission tables exist | Governance CRUD for roles, menus, pages, APIs, features, schools |
| AI | Present | TOTTECH AI knowledge/action/approval/observability backend is live | UI dashboards, document ingestion, governed search provider |
| Dining | Partial | `dining_attendance` exists but student-only and no academic year | Person-level attendance, meal plans, assignments, menus, diet, cost, wastage |
| Transport | Partial | Routes, stops, vehicles, assignments, attendance exist | Academic-year assignments, pickup/drop history, analytics |
| Hostel | Partial | Hostels, rooms, allocations, attendance exist | Bed history, movement history, academic-year assignments |
| Finance | Partial | Fees, invoices, payments, concessions exist | Approval ledger, invoice audit, refunds, scholarships, finance timeline |
| Attendance | Partial | Student/staff attendance tables exist | Academic-year ownership and cross-year reports |
| Academics | Partial | Classes, sections, exams, schedules, marks, question papers exist | Homework table, timetable table, academic-year ownership |
| Student 360 | Partial | Student detail page and API exist | Promotion, invoice, payment, transport, hostel, dining, homework, timeline, event ledger history |
| Teacher 360 | Partial | Teacher detail page exists | Assigned classes/sections, homework/reviews, dining, timeline, event ledger |
| School 360 | Partial | School profile and command pages exist | Executive command center with operational, SaaS, AI, timeline analytics |
| Event Ledger | Present | `event_ledger` live, fan-out timelines exist | Broader event coverage across workflows |
| Timeline Engine | Partial | Student/teacher/class/school timelines exist | Backfill operational history and emit events from all modules |
| Operational History | Partial | Dining/hostel/transport attendance tables exist | Add assignments/history and academic-year links |
| Concession Workflow | Partial | Requests and audit logs exist | Restrict approval to SUPER_ADMIN/ORG_OWNER and ledger finance approval |
| Invoice Workflow | Missing | Invoice lifecycle exists, no approval ledger | Add approval/audit trail and approval API |
| SchoolGPT | Deprecated | `ai-school-copilot` and `schoolgpt` references still exist | Keep compatibility but route new work to TOTTECH AI |

## Academic-Year Gaps

Required academic year:

```text
1 June to 31 May
Examples: 2025-2026, 2026-2027, 2027-2028
```

Current gaps:

- `academic_years` exists and current-year repair was completed.
- Many operational tables do not have `academic_year_id`.
- Some tables store only `academic_year` text.
- Cross-year reporting needs consistent indexed IDs.
- Promotion currently writes `student_promotions` without source section, target section, approval status, or approved-by fields.

Tables needing academic-year ownership include students, teachers, attendance, finance, invoices, payments, concessions, exams, schedules, marks, homework, question papers, dining, hostel, transport, notifications, AI usage, and operational history.

## Finance Gaps

Present:

- Fee categories
- Fees
- Invoices
- Payments
- Payment receipts
- Concession requests
- Concession audit logs

Missing/partial:

- Invoice approval ledger
- Invoice audit trail
- Finance approval ledger
- Scholarships
- Refunds
- Finance timeline fan-out
- Approval restriction to SUPER_ADMIN or Organization Owner

## Operational Gaps

Dining:

- Current `dining_attendance` has `student_id`, but no `teacher_id`, `staff_id`, `academic_year_id`, or `recorded_at`.
- Meal plans, assignments, weekly menus, special diets, inventory, purchases, consumption, production sheet, cost tracking, and wastage analytics are missing as first-class tables.

Transport:

- Routes/stops/vehicles/assignments/attendance exist.
- Academic-year assignment and pickup/drop history need strengthening.

Hostel:

- Hostels/rooms/allocations/attendance exist.
- Beds, movement history, warden tracking, and academic-year history need strengthening.

## AI Gaps

Present:

- Provider abstraction
- TOTTECH AI gateway
- Knowledge layer
- Action layer
- Approval layer
- Observability layer
- ERP/document/official/internet source priority registry
- Event Ledger audit for AI actions

Remaining:

- Document ingestion/indexing
- Source citations with extracted document snippets
- Governed search provider integration
- Approval/observability UI
- Full removal of `SchoolGPT` naming from UI routes

## RBAC/Governance Gaps

Present:

- Permissions
- Role-permission table
- Menu/page/module permissions
- Feature flags
- Governance settings

Gaps:

- 11 roles have no restored permission mappings.
- 61 hardcoded role references remain in app/lib/components.
- Governance CRUD is not complete.
- API/menu/page/feature assignment needs a full governance center.

## Classification Summary

| Classification | Areas |
|---|---|
| Present | Live web recovery, PostgreSQL, PM2/Nginx/SSL, Event Ledger, TOTTECH AI backend |
| Partial | Academic year, promotion, finance, dining, transport, hostel, Student 360, Teacher 360, School 360, governance, mobile |
| Missing | Native Android build/signing, full UI parity, first-class homework/timetable/dining plan tables, invoice approval ledger |
| Deprecated | SchoolGPT naming and recovered static AI pages |
| Needs Rebuild | Premium UI/UX, RBAC profiles, governance center, mobile release app, operational history backfill |

## Implementation Priorities For This Sprint

1. Add academic-year architecture consistently to operational tables.
2. Add enhanced promotion workflow and history.
3. Add finance approval/audit ledger, scholarships, refunds.
4. Upgrade dining/hostel/transport operational history tables.
5. Add API endpoints for academic-year context, promotions, finance approvals, and 360 enterprise history.
6. Validate with Prisma, production build, route checks, and DB audits.
