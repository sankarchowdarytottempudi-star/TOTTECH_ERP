# Professional Demo Hospital Report

Generated: 2026-06-10T03:38:07.792Z

## Demo Tenant

- Tenant: TOTTECH Multi-Speciality Hospital
- Tenant ID: 13
- Hospital: TOTTECH Multi-Speciality Hospital
- Hospital ID: 13
- Branch: Vijayawada Main Branch
- Branch ID: 13
- Clinic: TOTTECH Clinical Services OPD
- Clinic ID: 10
- Demo password for UAT users: `ClinicalUAT@2026`

## Created Users

- Receptionist: `uat.receptionist@tottechclinical.local` (RECEPTIONIST)
- Doctor: `uat.doctor@tottechclinical.local` (DOCTOR)
- Nurse: `uat.nurse@tottechclinical.local` (NURSE)
- Lab Technician: `uat.lab@tottechclinical.local` (LAB_TECHNICIAN)
- Pharmacist: `uat.pharmacist@tottechclinical.local` (PHARMACIST)
- Hospital Admin: `uat.hospital.admin@tottechclinical.local` (HOSPITAL_ADMIN)
- Finance User: `uat.finance@tottechclinical.local` (FINANCE_USER)
- CEO: `uat.ceo@tottechclinical.local` (CEO)
- CFO: `uat.cfo@tottechclinical.local` (CFO)
- CIO: `uat.cio@tottechclinical.local` (CIO)

## Seeded Clinical Data

- departments: 12
- roleUsers: 10
- doctors: 20
- patients: 100
- consultations: 50
- labReports: 30
- radiologyReports: 20
- medicines: 100
- admissions: 8
- icuCases: 5
- ivfCases: 5

## Verification Counts

| Entity | Count |
|---|---:|
| consultations | 50 |
| doctors | 20 |
| lab_results | 30 |
| medicines | 100 |
| patients | 100 |
| payments | 113 |
| radiology_orders | 20 |
| timeline_events | 318 |

## SaaS Isolation Fixture

- A second hospital was created inside the same tenant for isolation testing.
- Hospital B ID: 14
- Branch B ID: 14
- One sentinel patient exists in Hospital B and must not appear when Hospital A context is active.

## Sales Demo Positioning

Lead with multi-tenant architecture, IVF included, hospital branding, complete patient timeline, integrated billing, and fast deployment. Do not pitch this as only another OP/IP/Lab/Pharmacy product.
