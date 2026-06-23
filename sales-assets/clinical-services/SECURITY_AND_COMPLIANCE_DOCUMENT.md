# Security & Compliance Document

Hospital-grade security posture for sales and procurement review

Generated: 2026-06-10T03:40:31.504Z

## Tenant Isolation

Every clinical record is scoped by tenant_id, hospital_id, and branch_id. UAT includes a Hospital A / Hospital B isolation fixture.

## Role Access

Receptionist, doctor, nurse, lab technician, pharmacist, finance, hospital admin, CEO, CFO, and CIO have separate operating responsibilities.

## Audit Trail

Clinical actions, billing actions, document generation, security checks, and tenant validation are logged through audit/event tables and reports.

## Documents

Prescription, lab report, invoice, receipt, and verification flows support hospital branding, QR verification, and print/download use cases.

## Operational Controls

Backups, disaster recovery documentation, role permission audit, tenant security audit, and performance certification are maintained as production readiness evidence.
