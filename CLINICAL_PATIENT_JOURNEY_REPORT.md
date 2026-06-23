# Clinical Patient Journey Report

Generated: 2026-06-09

## Patient 360 Enhancement

The Patient 360 page now includes a visible journey layer showing the lifecycle of a patient across hospital operations.

## Journey Stages

| Stage | Data Used | Route |
|---|---|---|
| Registration | `patients` | `/clinical-services/patients` |
| Appointments | `appointments` | `/clinical-services/appointments` |
| OP / EMR | `opVisits`, `medicalRecords` | `/clinical-services/hms/op` |
| Diagnostics | `labOrders`, `labResults`, `radiologyOrders`, `radiologyReports` | `/clinical-services/hms/lab-orders` |
| IP / Critical Care | `admissions`, `icuRecords` | `/clinical-services/hms/ip` |
| Pharmacy | `prescriptions`, `pharmacySales`, `pharmacyDispensing` | `/clinical-services/pharmacy` |
| Billing / Insurance | `invoices`, `payments`, `insuranceClaims` | `/clinical-services/hms/billing` |
| Timeline / Audit | `timeline`, `audit` | `/clinical-services/security/audit-logs` |

## Record Interactivity

Rows in Patient 360 panels now use clickable drill-down cards where a corresponding route exists.

## Validation

- TypeScript: PASSED
- Production build: PASSED
