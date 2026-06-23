# Change Impact: School Journey Workflows

Date: 2026-06-05

## Purpose

Add the missing school -> class -> section -> student/teacher workflow foundation and connect it to dining, transport, invoices, concessions, and payment collection.

## Affected Modules

- Academics: classes, sections, academic-year student enrollment.
- Students: admission, edit, list context.
- Teachers: create, edit, card list, class/section assignments.
- Dining: meal attendance roster filtering and class/section history.
- Transport: student and teacher route assignments.
- Finance: invoice generation, fee structures selection, installment parts, payment collection, concessions.
- Governance/Event Ledger: create/update/assignment/payment/concession events.

## Affected APIs

- `/api/roster`
- `/api/classes`
- `/api/sections`
- `/api/students`
- `/api/students/[id]`
- `/api/teachers`
- `/api/teachers/[id]`
- `/api/dining`
- `/api/transport`
- `/api/finance/invoices`
- `/api/finance/payments`
- `/api/concessions`
- `/api/concessions/[id]/approval`

## Affected Web Pages

- `/students`
- `/students/edit/[id]`
- `/teachers`
- `/teachers/edit/[id]`
- `/dining`
- `/transport`
- `/finance/invoices`
- `/finance/collection`
- `/finance/payments`
- `/finance/concessions`

## Database Changes

- Added `teacher_class_assignments`.
- Added `invoice_line_items`.
- Added `invoice_installments`.
- Added/normalized class, section, school, academic-year, metadata, and payment-tracking columns on finance, dining, transport, student, and teacher workflow tables.

## Mobile Impact

- Mobile should consume `/api/roster` for class/section/student/teacher selectors.
- Mobile finance screens need invoice-installment and payment collection support.
- Mobile dining/transport assignment screens should mirror the web cascade filters.

## Reports Impact

- Pending fee reports can now use invoice class/section fields.
- Dining history can now group by class/section.
- Transport assignment reporting can now separate student and teacher assignments.
- Teacher 360 can include class/section assignment history.

## RBAC Impact

- Existing finance, concessions, students, teachers, transport, and dining permissions continue to apply.
- No hardcoded role names were added for these workflows.
- Future RBAC refinement should split payment collection from fee creation.

## Timeline Impact

- Student timeline receives student create/update, dining, transport, invoice, payment, and concession events where applicable.
- Teacher timeline receives teacher update and transport assignment events where applicable.
- Class timeline receives class events; future enhancement should fan out roster activity to class timelines.

## AI Grounding Impact

- TOTTECH AI can use `/api/roster` and the new assignment/installment tables to ground class/section-aware answers and action previews.
- Future AI action support should map prompts like "create quarterly invoice for class 5A" to the new invoice workflow.

## Validation

- `npx prisma validate`: passed.
- `npm run build`: passed.
- PM2 restarted and saved.
- Authenticated HTTP checks returned 200 for changed pages and APIs.
