# CHANGE IMPACT REPORT - AGENTIC AI PLATFORM 20260605

Generated: 2026-06-05  
Change: Add three-layer TOTTECH AI agentic platform: knowledge, action, approval, education knowledge engine, and AI observability.

## Affected Modules

- TOTTECH AI
- Governance/RBAC
- Event Ledger
- Students
- Teachers
- Staff/User Management
- Exams
- Exam Schedule
- Homework
- Question Papers
- Transport
- Hostel
- Dining
- Finance/Invoices
- Reports
- Academic Year context

## Affected APIs

New APIs:

- `/api/tottech-ai/knowledge`
- `/api/tottech-ai/actions`
- `/api/tottech-ai/actions/[id]`
- `/api/tottech-ai/actions/[id]/approve`
- `/api/tottech-ai/actions/[id]/execute`
- `/api/tottech-ai/observability`

Existing APIs affected indirectly:

- `/api/tottech-ai/complete`
- `/api/tottech-ai/usage`
- `/api/tottech-ai/health`

## Affected Mobile Screens

Future mobile screens affected:

- SchoolGPT
- Governance
- Automation
- War Room
- Notifications
- User Management
- Students
- Teachers
- Attendance
- Finance
- Transport
- Hostel
- Dining

This change adds backend capabilities only. No mobile UI is changed in this pass.

## Affected Reports

- `EMERGENCY_RECOVERY_EXECUTION_REPORT.md`
- `RESTORATION_VALIDATION_REPORT.md`
- `PLATFORM_READINESS_REPORT.md`
- `CHANGE_IMPACT_AGENTIC_AI_PLATFORM_20260605.md`

## Affected RBAC Permissions

New permissions required:

- `AI.KNOWLEDGE`
- `AI.ACTION_REQUEST`
- `AI.APPROVE_ACTION`
- `AI.EXECUTE_ACTION`
- `AI.VIEW_OBSERVABILITY`

SUPER_ADMIN will receive these permissions. Non-admin roles require business-approved role-permission mapping before access is expanded.

## Affected Timelines

Event Ledger receives entries for:

- Knowledge queries
- Action requests
- Action approvals
- Action execution
- Action execution failures

Timeline fan-out occurs where the executed action has a student, teacher, class, or school entity target.

## Affected AI Grounding

Knowledge answers will use this priority order:

1. ERP database
2. Documents / recovered file records
3. Official education sources
4. Internet search

Official and internet source lookup is represented by governed source records. Live external search remains disabled unless explicitly enabled through environment/governance settings.

## Deployment Risk

- Adds new database tables and indexes.
- Adds new server routes and action execution handlers.
- Execution handlers can write to production tables only after an approved action request.
- Several requested actions do not have recovered production tables; these are executed as operational records in the AI action/event-ledger layer until first-class ERP tables are restored.

## Rollback Notes

The migration creates new AI-specific tables and permissions. Existing production tables are not structurally modified. Rollback can disable routes by removing new files and dropping the `202606051710_agentic_ai_platform` migration tables if no action records need to be retained.
