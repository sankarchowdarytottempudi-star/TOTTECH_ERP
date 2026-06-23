# Patient Journey End-to-End Evidence Report

Generated: 2026-06-10T08:51:23.537Z

Base URL: https://erp.tottechsolutions.com

Hospital: TOTTECH Multi-Speciality Hospital

Branch: Vijayawada Main Branch

Journey tag: E2E-1781081397344

Patient: Journey Patient E2E-1781081397344 (526)

Appointment: 127

Lab Order: 81

Invoice: 207

Payment: 197

## Verification Matrix

| Step | Database | UI | Status | Timeline | Billing | Documents | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Register Patient | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/patients/526<br>Patient row created. |
| Appointment | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/appointments/127<br>Appointment status is BOOKED/WAITING. |
| Check-In | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/appointments/127<br>Queue status is WAITING_FOR_VITALS. |
| Vitals | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/doctors/consultation/127<br>Appointment status is VITALS_COMPLETED; queue status is WAITING_FOR_DOCTOR. |
| Doctor Consultation | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/doctors/consultation/127<br>Queue status is LAB_ORDERED. |
| Lab Order | WORKING | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/doctors/consultation/127<br>Lab order status is ORDERED.<br>Automatic lab billing item should be created when the doctor orders the lab. |
| Sample Collection | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/laboratory<br>Lab order status is COLLECTED. |
| Lab Processing | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/laboratory<br>Lab order status is PROCESSING. |
| Result Entry | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/laboratory<br>Lab result status is ENTERED; order is RESULT_ENTERED. |
| Result Validation | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/laboratory<br>Lab result status is VALIDATED; order is VALIDATED. |
| Result Approval | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/laboratory<br>Lab result status is APPROVED; order is APPROVED. |
| Result Release | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/laboratory<br>Lab result status is RELEASED; order is RELEASED; queue is WAITING_FOR_DOCTOR_REVIEW. |
| Doctor Review | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/doctors/consultation/127<br>Doctor consultation API and UI both show released lab result values for review. |
| Prescription | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/doctors/consultation/127<br>Prescription RX-1781081451896; pharmacy queue PENDING. |
| Pharmacy | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/pharmacy<br>Pharmacy queue is COMPLETED. |
| Billing | WORKING | WORKING | WORKING | NOT_APPLICABLE | WORKING | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/billing-revenue<br>Workflow invoice INV-1781081423676-2010 status is OPEN.<br>Invoice and itemized charges were created automatically by workflow orchestration. |
| Payment | WORKING | WORKING | WORKING | WORKING | WORKING | NOT_APPLICABLE | UI loaded and scrolled: /clinical-services/billing-revenue<br>Appointment status is COMPLETED; queue is COMPLETED.<br>Payment API posted payment without DB fallback: 197. |
| Documents and Timeline Review | WORKING | WORKING | NOT_CHECKED | WORKING | NOT_APPLICABLE | WORKING | UI loaded and scrolled: /clinical-services/patients/526/timeline<br>Invoice PDF OK, Lab PDF OK, Receipt PDF OK, Prescription PDF OK. |

## Defects Found

| # | Step | Issue | Impact |
| --- | --- | --- | --- |
| - | - | No defects detected by this runner. | - |

## Evidence Files

### Screen Recording

- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/videos/page@8b3b773fbc95710bc53e6cc1d13a5969.webm

### Screenshots

- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/01-register-patient.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/02-appointment.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/03-check-in.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/04-vitals.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/05-doctor-consultation-and-lab-order.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/07-sample-collection.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/08-lab-processing.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/09-result-entry.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/10-result-validation.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/11-result-approval.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/12-result-release.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/13-doctor-review.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/14-prescription.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/15-pharmacy.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/16-billing.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/17-payment.png
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/screenshots/18-final-patient-timeline.png

### Generated Documents

- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/documents/E2E-1781081397344-invoice.pdf
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/documents/E2E-1781081397344-lab-report.pdf
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/documents/E2E-1781081397344-payment-receipt.pdf
- /opt/tottech-one/uat-evidence/clinical-services/patient-journey/documents/E2E-1781081397344-prescription.pdf

## Raw Result JSON

/opt/tottech-one/uat-evidence/clinical-services/patient-journey/patient-journey-results.json
