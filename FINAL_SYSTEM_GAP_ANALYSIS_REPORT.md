# TOTTECH ONE HMS Final System Gap Analysis Report

Generated: 2026-06-09

## Audit Scope

Reviewed:

- Database schema and migrations
- Clinical APIs under `app/api/clinical`
- Clinical UI pages under `app/clinical-services`
- Clinical libraries under `lib/clinical`
- Billing, patient timeline, documents, PDFs, security, reports, and workflow support
- Existing implementation reports and validation scripts

## 1. Already Implemented Features

### Core Clinical Architecture

- Multi-tenant clinical context resolver exists in `lib/clinical/context.ts`.
- Tenant, hospital, and branch context is resolved from logged-in clinical user profile.
- Core normalized clinical entities exist:
  - `patients`
  - `appointments`
  - `consultations`
  - `consultation_prescriptions`
  - `consultation_lab_orders`
  - `consultation_radiology_orders`
  - `lab_orders`
  - `lab_results`
  - `pharmacy_stock`
  - `pharmacy_dispensing`
  - `admissions`
  - `ot_schedules`
  - `icu_admissions`
  - `ivf_cycles`
  - `billing_invoices`
  - `billing_invoice_items`
  - `payments`
  - `refunds`
  - `insurance_claims`
  - `document_repository`
  - `patient_timeline_events`

### Patient Timeline

- Dedicated `patient_timeline_events` table exists.
- Timeline route exists: `GET/POST /api/clinical/patients/[id]/timeline`.
- Timeline page exists: `/clinical-services/patients/[id]/timeline`.
- Operational spine writes timeline events for billing/document/workflow events.
- Unique source index prevents duplicate timeline events for the same source.

### Billing Engine

- Billing invoice and invoice item tables exist.
- Invoice APIs exist:
  - `/api/clinical/billing/invoices`
  - `/api/clinical/billing/invoices/[id]`
  - `/api/clinical/billing/invoices/[id]/pdf`
- Invoice recalculation helper exists in `phase4-operational-spine.ts`.
- Invoice PDF now generates real binary PDF.

### Payments and Refunds

- `payments` and `refunds` tables exist.
- Clinical operations payment route exists: `/api/clinical/operations/payments`.
- Financial hardening route exists: `/api/clinical/finance/hardening`.

### Insurance

- `insurance_policies` and `insurance_claims` exist.
- Insurance claim PDF is supported through `/api/clinical/documents/render/insurance-claim/[id]`.

### Laboratory and Radiology

- Lab order/result tables exist.
- Lab operations routes exist.
- Lab PDF route exists through `/api/clinical/documents/render/lab-report/[id]`.
- Radiology order table exists and radiology PDF route exists.

### Pharmacy

- Pharmacy stock and dispensing tables exist.
- Pharmacy module APIs/pages exist.
- Pharmacy dispensing has stock FK support.

### IPD / OT / ICU / IVF

- Domain tables exist for admissions, OT schedules, ICU admissions, IVF cycles, and IVF child tables.
- UI pages and dynamic detail routes exist for IP/IPD, ICU, OT, and IVF.
- IVF cycle PDF exists.

### Document Repository and PDF Engine

- `document_repository` exists.
- Real PDF renderer exists at `lib/clinical/pdf-engine.ts`.
- PDFs support branding, QR payloads, signatures labels, download headers, and audit/timeline registration.

### Security and Audit

- `clinical_audit_events` exists.
- Role and permission tables exist:
  - `clinical_roles`
  - `clinical_security_permissions`
  - `clinical_security_role_permissions`
- Role permission audit route exists.
- Tenant security audit route exists.

### Hospital Branding

- `hospitals.branding`, `branches.branding`, and clinical context branding merge exist.
- PDF engine uses context branding and optional logo URL.

### Financial Reports

- Financial hardening reports exist:
  - Daily collections
  - Outstanding receivables
  - Reconciliation
  - Shift closing
  - Revenue
- JSON, CSV, and PDF report formats are supported.

### Automated Tests

- `npm run clinical:phase45:test` exists and validates:
  - Phase 4.5 hardening tables
  - Isolation columns
  - Billing totals
  - PDF implementation files

## 2. Partially Implemented Features

### Notifications

- Notification template/log style tables exist:
  - `clinical_notification_templates`
  - `clinical_mobile_whatsapp_delivery_receipts`
  - `clinical_mobile_sms_delivery_receipts`
  - `clinical_finance_notification_logs`
- No unified clinical notification queue/service was found.
- Appointment reminders are represented in mobile/spec tables but not as executable workflow.

### Credit Notes

- `refunds` exists.
- Dedicated `credit_notes` or `clinical_credit_notes` table was not found.

### Insurance Claim Workflow

- Insurance claim records exist.
- PDF output exists.
- A dedicated submit/approve/reject/settle workflow API is not clearly present.

### Doctor Digital Signature

- `doctors.signature_url` exists.
- Current PDF engine supports signature label but does not yet render actual doctor signature image.

### QR Verification

- PDFs embed QR payloads.
- A dedicated QR verification API/page is not present.

### Backup and DR

- `clinical_production_backup_policies` and production registry exist.
- A concrete executable backup script and disaster recovery runbook are not yet complete.

### Executive Dashboards

- Clinical analytics tables and dashboard pages exist.
- User requested simple CEO/CFO/CIO dashboards using real workflow transactions. Existing dashboards appear broad/spec-like and need a simple transaction-grounded view for final demo evidence.

## 3. Missing Features

High-priority missing items confirmed:

1. Unified WhatsApp/SMS/Email notification queue.
2. Appointment reminder executable workflow.
3. Dedicated credit note workflow.
4. Insurance claim status workflow API.
5. Doctor signature rendering in PDFs.
6. QR document verification API.
7. Automated backup script.
8. Disaster recovery documentation.
9. Demo execution seed/run script for the full hospital journey.
10. Screen recording evidence for the requested end-to-end workflow.

## 4. Duplicate Features

The system contains both production workflow tables and numerous catalog/spec/blueprint tables:

- Real operational tables: `patients`, `appointments`, `consultations`, `billing_invoices`, `lab_orders`, etc.
- Blueprint/spec tables: `clinical_business_*`, `clinical_dictionary_*`, `clinical_ui_*`, `clinical_api_catalog_*`, `clinical_analytics_*`.
- Older generic/scaffold tables: `clinical_workflows`, `clinical_phase2_records`, `clinical_patient_workflow_events`, `clinical_patient_timeline`.

These are not all duplicates in purpose, but they create architectural risk if operational workflows write to generic/scaffold tables instead of normalized entities.

## 5. Redundant Tables

Potentially redundant or legacy tables to avoid using for new production workflow writes:

- `clinical_phase2_records`
- `clinical_workflows`
- `clinical_patient_workflow_events`
- `clinical_patient_timeline`
- generic `clinical_reports` if replacing normalized report routes

Do not delete these without a migration/archival review because existing pages may still reference them.

## 6. Redundant APIs

Potential overlap exists between:

- `/api/clinical/hms/[module]`
- `/api/clinical/phase2/[module]`
- `/api/clinical/production/[module]`
- `/api/clinical/finance/[module]`
- `/api/clinical/finance/hardening`

Recommendation: production workflows should prefer explicit normalized APIs or registry-backed APIs only when they enforce tenant/hospital/branch scope.

## 7. Security Risks

- Some generic module APIs rely on dynamic table mappings. They appear whitelisted, but each must continue to reject arbitrary table input.
- Tenant isolation exists in many queries, but broad audit is required for every generic route.
- Notification delivery must not expose API keys or PHI in logs.
- PDF QR payloads must not expose sensitive medical data.
- Break-glass/access logging needs routine operational validation.

## 8. Performance Risks

- Core tables have useful indexes for patients, appointments, billing, timeline, lab, admissions, and documents.
- `payments` and `refunds` lack strong visible tenant/hospital/branch indexes in the audit output.
- Timeline has correct patient/date scoped index.
- Analytics/spec tables are numerous and can slow inventory/reporting if queried broadly without pagination.
- Generic module pages must paginate; large hospital datasets will not tolerate unbounded table reads.

## 9. Data Integrity Risks

- One invoice total mismatch was detected and corrected during Phase 4.5 validation.
- Credit note workflow is missing, so negative adjustments may be mixed with refunds.
- Notification logs are fragmented by channel/type rather than one operational queue.
- Doctor signature exists as a URL field but is not yet cryptographically verified.
- Some tables have tenant/hospital/branch columns but not always full FK constraints to tenant/hospital/branch masters.

## 10. Production Readiness Score

Current assessed score after completion pass: **90%**

Reasoning:

- Strong normalized foundation, billing, timeline, PDFs, audit, context, and many pages exist.
- This pass added notification queue, appointment reminders, credit notes, insurance workflow transition API, doctor signature rendering, QR verification API, backup script, DR runbook, demo data, PDFs, screenshots, video evidence, and clean tenant audit evidence.
- Remaining gap: CEO/CFO/CIO dashboards are still simple existing clinical dashboard surfaces rather than dedicated executive dashboards with role-specific UX.

## Implementation Rule

Only the confirmed missing items above should be implemented next. Do not create duplicate clinical workflow tables, duplicate billing APIs, or duplicate document engines.
