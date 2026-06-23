# Change Impact Report: Enterprise Reconstruction Sprint

Date: 2026-06-05

## Summary

This sprint added enterprise-grade recovery structures and live APIs to the restored TOTTECH ONE deployment. The change was intentionally additive: no production tables were dropped and no application source from `/opt/recovery` was modified.

## Affected Modules

- Academic Years
- Promotions
- Students
- Teachers
- Schools
- Finance
- Dining
- Hostel
- Transport
- RBAC
- Event Ledger
- TOTTECH AI observability validation
- Mobile reconstruction validation

## Affected APIs

Added or rebuilt:

- `/api/enterprise/academic-year-context`
- `/api/promotions`
- `/api/promotions/[id]/approve`
- `/api/promotions/[id]/execute`
- `/api/finance/approvals`
- `/api/finance/approvals/[id]/approve`
- `/api/students/[id]/enterprise-history`
- `/api/teachers/[id]/enterprise-history`
- `/api/schools/[id]/command-center`

Validated existing AI APIs:

- `/api/tottech-ai/health`
- `/api/tottech-ai/providers`
- `/api/tottech-ai/usage`
- `/api/tottech-ai/governance`
- `/api/tottech-ai/observability`
- `/api/tottech-ai/actions`

## Affected Database Structures

Migration:

- `prisma/migrations/202606051745_enterprise_reconstruction_sprint/migration.sql`

New enterprise tables:

- `student_year_enrollments`
- `promotion_workflows`
- `promotion_workflow_students`
- `homework_assignments`
- `homework_submissions`
- `timetable_entries`
- `finance_approval_ledger`
- `invoice_audit_logs`
- `scholarships`
- `refunds`
- `dining_meal_plans`
- `dining_meal_assignments`
- `dining_weekly_menus`
- `dining_special_diets`
- `dining_inventory_items`
- `dining_purchases`
- `dining_consumption_logs`
- `dining_production_sheets`
- `dining_wastage_logs`
- `hostel_beds`
- `hostel_movement_history`
- `hostel_warden_tracking`
- `transport_pickup_drop_history`

Existing tables extended with `academic_year_id` or operational context:

- `students`
- `teachers`
- `attendance`
- `attendance_master`
- `teacher_attendance`
- `fees`
- `fee_payments`
- `invoices`
- `payments`
- `concession_requests`
- `exams`
- `exam_schedule`
- `marks`
- `question_papers`
- `question_bank`
- `dining_attendance`
- `hostel_attendance`
- `transport_attendance`
- `hostel_allocations`
- `transport_assignments`
- `notifications`
- `ai_usage_logs`

## Affected Pages

Validated pages:

- `/login`
- `/dashboard`
- `/students`
- `/teachers`
- `/attendance`
- `/finance`
- `/transport`
- `/hostel`
- `/dining`
- `/ai-dashboard`
- `/ai-command-center`
- `/ai-school-copilot`
- `/war-room`
- `/parent-portal`
- `/promotions`
- `/settings/roles`
- `/settings/academic-years`

This sprint did not complete full UI integration for every new API. Several new APIs are ready for page integration.

## Affected Mobile Screens

Existing recovered/rebuilt mobile screens inspected:

- Login
- Dashboard
- Students
- Teachers
- Attendance
- Marks
- Enterprise
- Operations

Mobile TypeScript passed. Native Android build remains blocked because the native project and Android build toolchain are missing.

## Affected Reports

Created:

- `ENTERPRISE_GAP_ANALYSIS.md`
- `ENTERPRISE_RECONSTRUCTION_REPORT.md`
- `CHANGE_IMPACT_ENTERPRISE_RECONSTRUCTION_20260605.md`

Existing related reports remain:

- `PLATFORM_READINESS_REPORT.md`
- `TOTTECH_AI_AGENTIC_PLATFORM_REPORT.md`

## Affected RBAC Permissions

Added/granted to `SUPER_ADMIN`:

- `PROMOTIONS.READ`
- `PROMOTIONS.CREATE`
- `PROMOTIONS.APPROVE`
- `FINANCE.APPROVE`
- `FINANCE.VIEW_APPROVALS`
- `DINING.MANAGE_OPERATIONS`
- `HOSTEL.MANAGE_OPERATIONS`
- `TRANSPORT.MANAGE_OPERATIONS`
- `ACADEMIC_YEAR.MANAGE`
- `TIMELINE.VIEW_HISTORY`

## Affected Timelines

New timeline and history sources were added or exposed through:

- `student_year_enrollments`
- `student_promotions`
- `promotion_workflows`
- `finance_approval_ledger`
- `invoice_audit_logs`
- `hostel_movement_history`
- `transport_pickup_drop_history`
- `event_ledger`
- Existing `student_timelines`, `teacher_timelines`, `class_timelines`, and `school_timelines`

## Affected AI Grounding

The School command center and enterprise-history APIs expose academic-year, school, RBAC, timeline, operational, and Event Ledger context that can be used by TOTTECH AI grounding.

No ERP module was changed to call an AI provider directly.

## Deployment Impact

Production process:

- PM2 app `tottech-one` restarted and saved.
- Nginx and PostgreSQL are active.
- HTTPS route checks passed.

Database:

- Additive migration applied.
- Privileges granted to `schooladmin` for new tables/sequences.
- Academic-year date repair applied and recorded in Event Ledger.

## Verification

Passed:

- `npx prisma validate`
- focused ESLint on edited approval routes
- `npm run build`
- `npm --prefix mobile run typecheck`
- authenticated API/page checks
- promotion approval smoke test
- finance approval smoke test
- APK download check

Known failing gate:

- `npm run lint` fails on existing recovered-source debt: 203 errors, 19 warnings.

Blocked:

- Android build: missing native project and build toolchain.

## Rollback Notes

The migration is additive. A rollback should not drop the new tables until all new API consumers are disabled and a fresh backup is taken.

The academic-year boundary repair updated three existing 2025-2026 rows from April 30 end dates to May 31. This repair is recorded in `event_ledger`.
