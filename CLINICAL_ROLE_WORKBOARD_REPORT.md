# Clinical Role Workboard Report

Generated: 2026-06-09

## New API

`/api/clinical/workboard`

## Context Enforcement

The endpoint requires an authenticated Clinical Services user and resolves the active clinical context through `requireClinicalContext`.

Every query is scoped by:

- `tenant_id`
- `hospital_id`
- `branch_id`

## Workboards Implemented

| Role Board | Evidence Tables | Primary Use |
|---|---|---|
| Front Desk | `appointments`, `patients`, `ip_admissions` | Arrivals, waiting queue, registration, discharge handoff |
| Doctor | `appointments`, `lab_results` | Consultations and lab result review |
| Nursing | `ip_admissions` | Admitted patient care tasks |
| Laboratory | `lab_orders` | Pending samples/orders |
| Pharmacy | `pharmacy_prescription_queue`, `pharmacy_inventory` | Prescription queue and stock alerts |
| Billing | `billing_invoices`, `clinical_finance_claims` | Unpaid invoices and claim follow-up |
| Administration | Combined operational queues | Hospital operations overview |

## Dashboard Rendering

The Clinical Services dashboard now renders:

- Workboard title
- Role label
- Operational guidance question
- Quick actions
- Clickable task list
- Activity feed from `clinical_audit_events`

## Clickability

All workboard tasks and quick actions navigate to existing Clinical Services routes.

## Validation

- TypeScript: PASSED
- Production build: PASSED
