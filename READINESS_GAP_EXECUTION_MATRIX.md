# TOTTECH ONE + TOTTECH AI Readiness Gap Execution Matrix

Generated: 2026-06-05

Source audits:

- `ENTERPRISE_CAPABILITY_MATRIX.md`
- `APK_PARITY_AUDIT.md`
- `APK_FORENSIC_REPORT.md`
- `APK_SOURCE_GAP_MATRIX.md`
- `PLATFORM_READINESS_REPORT.md`
- `TOTTECH_AI_AGENTIC_PLATFORM_REPORT.md`

## Current Baseline

| Area | Audit Score | Primary Blocker |
|---|---:|---|
| Overall Platform | 43% | Business workflows are partial; many routes/pages are not enough. |
| APK Parity | 44% | APK-proven mobile-first operations are still incomplete. |
| Mobile APK Parity | 31% | Several native screens are shells or feature cards. |
| AI APK Parity | 40% | AI has foundation, but weak mobile execution, agent breadth, and live intelligence. |
| Dining | 18% | Inventory, purchases, consumption, production, wastage, assignments, analytics incomplete. |
| Transport | 24% | Attendance and pickup/drop history missing; route/assignment data not proven. |
| Hostel | 28% | Allocation year context, attendance, and movement history incomplete. |
| Governance | 38% | Hardcoded role checks remain; dynamic permissions not universal. |

## Execution Priorities

| Priority | Gap | Business Impact | Dependencies | Database Impact | Mobile Impact | AI Impact | Closure Strategy |
|---:|---|---|---|---|---|---|---|
| 1 | Event Ledger and timeline academic-year gaps | Without year-aware audit, every enterprise workflow is weak evidence. | `academic_years`, `event_ledger`, timeline tables | Default active `academic_year_id` when caller omits it. | Mobile writes become auditable without extra screen logic. | AI grounding reads cleaner event data. | Harden `recordEvent` and fan-out. |
| 2 | Dining operational workflow | Daily meals affect billing, parent trust, health, and operational cost. | Dining tables, students, classes, sections | Add inventory, purchase, consumption, production, wastage, assignments APIs. | Native Dining screen can execute real workflows. | AI can ground dining answers/actions in real records. | Add `/api/dining/operations` and mobile workflows. |
| 3 | Transport operational workflow | Route assignment and pickup/drop history are high-risk school workflows. | Routes, assignments, attendance/history tables | Add attendance and pickup/drop event writes. | Native Transport screen can execute assignment/attendance. | AI can reason over transport safety history. | Extend `/api/transport`. |
| 4 | Hostel operational workflow | Room allocation and daily attendance are safety-critical. | Hostels, allocations, attendance/history tables | Store allocation with academic year; add attendance/movement writes. | Native Hostel screen can execute allocation/attendance. | AI can answer hostel occupancy/history questions. | Extend `/api/hostels`. |
| 5 | Mobile execution parity | APK was mobile-first; screens must create/assign/review, not just show cards. | API client, auth cookie, existing screens | No schema change; uses above APIs. | Replaces shell cards with API-backed forms. | Adds mobile AI action/knowledge path evidence. | Add operational mobile screens and navigation. |
| 6 | AI action completeness | AI vision requires safe action preview/approval/execute across ERP. | AI action tables, operational APIs | Action execution should create real ERP rows after approval. | Mobile AI should request/approve/review actions. | Moves AI from chatbot foundation to agentic copilot. | Subsequent sprint: wire missing action executors to new APIs. |
| 7 | Dynamic RBAC coverage | Enterprise SaaS cannot rely on hardcoded roles. | `permissions`, `role_permissions`, server guards | No schema change; add permission guards. | Mobile receives 403 consistently. | AI governance can respect same rules. | Incrementally add `requirePermission` per module. |

## Sprint Closure Scope

This sprint closes the highest-risk workflow substrate:

- Active academic-year defaulting in Event Ledger.
- Dining operations API for inventory, purchases, consumption, production, wastage, meal assignments, and special diets.
- Transport attendance and pickup/drop history.
- Hostel allocation year context, attendance, and movement history.
- Native mobile access to Dining, Transport, Hostel, and AI operational workflows.

## Out Of Scope For This Sprint

The following remain important but are too broad to claim as closed without separate testable implementation:

- Eliminating every hardcoded role branch.
- Full external AI provider execution and official web search.
- Full automated scheduler/automation runner.
- Universal mobile export/report generation.
- Full production smoke writes for every school module.
