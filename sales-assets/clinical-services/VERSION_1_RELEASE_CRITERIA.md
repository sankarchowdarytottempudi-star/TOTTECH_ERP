# Version 1.0 Release Criteria

Pilot-readiness gate before approaching hospitals

Generated: 2026-06-10T03:40:31.504Z

## Critical Workflow Gate

Patient registration, appointment, consultation, prescription, lab order/result, radiology, pharmacy, admission, billing, payment, PDF generation, and timeline must pass UAT.

## Security Gate

No major security findings. Tenant isolation must prove Hospital A cannot view Hospital B patients, bills, reports, inventory, or users.

## Finance Gate

Invoices, payments, receipts, refunds/credit notes, shift closing, daily collections, and reconciliation must match generated transactions.

## Operations Gate

Backups and recovery must be tested. Demo environment must be ready. Role-specific permissions must not block daily work or expose sensitive data incorrectly.

## Sales Gate

Brochure, pricing, feature comparison, implementation timeline, security document, demo script, screenshots, and PDFs must be ready before pilot outreach.
