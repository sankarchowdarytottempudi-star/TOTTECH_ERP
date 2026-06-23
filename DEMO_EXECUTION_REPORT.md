# Demo Execution Report

Generated: 2026-06-09T20:36:21.629Z

## Demo Login Password

Clinical@2026

## Created Records

```json
{
  "generatedAt": "2026-06-09T20:36:21.629Z",
  "loginPassword": "Clinical@2026",
  "tenant": 8,
  "hospitalA": 7,
  "branchA": 7,
  "clinic": 5,
  "departments": {
    "OPD": 25,
    "LAB": 26,
    "PHARM": 27,
    "FIN": 28
  },
  "users": {
    "SUPER_ADMIN": "cs-super-admin@erp.com",
    "HOSPITAL_OWNER": "cs-hospital-owner@erp.com",
    "HOSPITAL_ADMIN": "cs-hospital-admin@erp.com",
    "RECEPTIONIST": "cs-receptionist@erp.com",
    "DOCTOR": "cs-doctor@erp.com",
    "NURSE": "cs-nurse@erp.com",
    "LAB_TECHNICIAN": "cs-lab-technician@erp.com",
    "PHARMACIST": "cs-pharmacist@erp.com",
    "CFO": "cs-cfo@erp.com",
    "CEO": "cs-ceo@erp.com",
    "CIO": "cs-cio@erp.com"
  },
  "doctor": 4,
  "patient": 4,
  "appointment": 5,
  "invoices": {
    "consultation": 5,
    "lab": 6,
    "pharmacy": 7
  },
  "payments": {
    "consultation": 2,
    "lab": 3,
    "pharmacy": 4
  },
  "vitals": 1,
  "consultations": {
    "first": 1,
    "followUp": 2
  },
  "lab": {
    "test": 5,
    "order": 14,
    "sample": 16,
    "result": 10
  },
  "pharmacy": {
    "medicine": 4,
    "stock": 3,
    "dispensing": 1
  },
  "multiTenantValidation": {
    "hospitalB": 8,
    "patientB": 5,
    "hospitalAQueryForHospitalBPatientRows": 0,
    "status": "PASSED"
  }
}
```

## Workflow Proven

Registration -> Appointment -> Consultation Payment -> Vitals -> Consultation -> Lab Order -> Lab Payment -> Sample -> Lab Result -> Follow Up -> Prescription -> Pharmacy Dispense -> Pharmacy Payment -> Timeline.

## Multi-Tenant Validation

Hospital A query for Hospital B patient returned 0 rows.

## Evidence Generated

PDFs:

- `/opt/tottech-one/demo-evidence/pdfs/consultation-invoice.pdf`
- `/opt/tottech-one/demo-evidence/pdfs/prescription.pdf`
- `/opt/tottech-one/demo-evidence/pdfs/lab-report.pdf`
- `/opt/tottech-one/demo-evidence/pdfs/payment-receipt.pdf`

Screenshots:

- `/opt/tottech-one/demo-evidence/screenshots/01-clinical-dashboard.png`
- `/opt/tottech-one/demo-evidence/screenshots/02-patient-record.png`
- `/opt/tottech-one/demo-evidence/screenshots/03-patient-timeline.png`
- `/opt/tottech-one/demo-evidence/screenshots/04-appointments.png`
- `/opt/tottech-one/demo-evidence/screenshots/05-laboratory.png`
- `/opt/tottech-one/demo-evidence/screenshots/06-pharmacy.png`
- `/opt/tottech-one/demo-evidence/screenshots/07-finance.png`
- `/opt/tottech-one/demo-evidence/screenshots/08-security.png`
- `/opt/tottech-one/demo-evidence/screenshots/09-document-verification.png`

Video:

- `/opt/tottech-one/demo-evidence/video/page@c2d2548167a998e137b04c9c85572f02.webm`

Security evidence:

- `/opt/tottech-one/demo-evidence/role-permission-audit.json`
- `/opt/tottech-one/demo-evidence/tenant-security-audit.json`

Finance evidence:

- `/opt/tottech-one/demo-evidence/daily-collections.json`

## Endpoint Evidence

- Login succeeded for `cs-hospital-admin@erp.com`.
- Clinical context resolved to tenant `8`, hospital `7`, branch `7`, clinic `5`.
- Invoice PDF returned `200 application/pdf`.
- Prescription PDF returned `200 application/pdf`.
- Lab report PDF returned `200 application/pdf`.
- Payment receipt PDF returned `200 application/pdf`.
- Role permission audit returned `WORKING`.
- Tenant security audit returned `WORKING` with zero findings.
- Daily collections returned consultation, lab, and pharmacy payments from generated demo transactions.
