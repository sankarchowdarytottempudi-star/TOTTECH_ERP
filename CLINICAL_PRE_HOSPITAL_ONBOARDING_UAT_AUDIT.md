# Clinical Pre-Hospital Onboarding UAT Audit

Date: 2026-06-13

Scope:
- Reception to appointment
- Vitals to doctor queue
- Doctor consultation
- Lab and radiology orders
- Prescription to pharmacy queue
- Pharmacy dispense / partial / out of stock
- Patient 360
- Global mobile number search
- UAT cleanup guidance

## Capability Status

| Area | Status | Evidence |
| --- | --- | --- |
| Reception patient lookup | WORKING | `/api/clinical/patient-lookup` supports name, phone, WhatsApp, alternate mobile, UHID/MRN, ABHA. |
| Global mobile number search | WORKING | `/api/clinical/global-search` and `/api/clinical/mobile-search` now return Patient 360 links, latest visit, latest prescription, lab count, and radiology count. |
| Appointment workflow | WORKING | Existing appointment APIs and doctor consultation loader use appointment, token, status, queue status. |
| Vitals visibility in doctor workspace | WORKING/PARTIAL | Doctor consultation loader reads latest `clinical_vitals`. UAT should verify save-to-doctor immediately after real nurse save. |
| Doctor clinical history | WORKING | Doctor consultation API returns previous visits, prescriptions, released lab reports, radiology orders/reports/uploads, admissions, discharges, IVF/procedure history, timeline, allergies, chronic history. |
| Lab order from doctor | WORKING | Doctor consultation save creates `lab_orders`, billing items, workflow events, and notifications. |
| Radiology order from doctor | WORKING | Doctor consultation save creates `radiology_orders`, billing items, and timeline metadata. |
| Released lab result in doctor view | WORKING | Doctor consultation API returns only released lab results with result value, unit, reference range, released by, and released date. |
| Radiology result/upload visibility | PARTIAL | Doctor and Patient 360 load radiology orders, reports, uploads. UAT should verify image/report upload and approval from radiology screen. |
| Prescription engine | WORKING | Doctor prescription uses pharmacy master autocomplete and saves pharmacy master IDs. |
| Pharmacy queue | WORKING | Prescriptions flow to pharmacy queue with dispense, partial dispense, and out-of-stock statuses. |
| Stock reduction | WORKING/PARTIAL | Pharmacy dispense route handles stock status transitions. UAT should confirm stock balances for the medicines used in pilot data. |
| Patient 360 | WORKING | Patient 360 includes demographics, appointments, vitals, consultations, prescriptions, lab, radiology, admissions, billing, insurance, IVF, documents, timeline, audit. |
| Dummy data cleanup | NOT EXECUTED | Do not delete data until backup is created and UAT records are identified. |

## UAT Role Checklist

Receptionist:
- Register patient.
- Book appointment.
- Search by mobile.
- Open Patient 360.
- Check appointment status and token.

Nurse:
- Search by mobile/name/UHID.
- Record vitals.
- Confirm patient moves to doctor queue.

Doctor:
- Open consultation queue.
- Confirm vitals visible.
- Review previous visits, prescriptions, lab/radiology, admissions, timeline.
- Create lab order, radiology order, prescription, follow-up.

Lab Technician:
- Receive lab order.
- Collect sample.
- Enter result.
- Approve/release result.
- Confirm doctor sees released values.

Radiology:
- Receive radiology order.
- Upload report/images.
- Approve result.
- Confirm doctor and Patient 360 visibility.

Pharmacist:
- Open prescription queue.
- Dispense, partial dispense, and out-of-stock scenarios.
- Confirm stock movement and Patient 360 event.

Billing/Finance:
- Confirm consultation/lab/radiology/pharmacy billing items.
- Collect payment.
- Verify receipt and Patient 360 timeline.

## Pre-Production Cleanup Rule

Before removing dummy/UAT data:
1. Create backup under `/opt/backups/pre-production-cleanup/YYYYMMDD-HHMM`.
2. Identify only records matching `UAT%`, `TEST%`, `DEMO%`.
3. Do not delete:
   - Masters
   - Users
   - Roles
   - Departments
   - Medicines
   - Lab Tests
   - Settings
   - Workflows
4. Generate a data cleanup report before deletion.

## Current Recommendation

Proceed with role-based UAT using real pilot-style records. Do not onboard a paying hospital until:
- Vitals save is proven in doctor workspace immediately after nurse save.
- Radiology upload/report approval is proven in doctor view.
- Pharmacy stock reduction is verified with real medicine batches.
- Patient 360 timeline shows every step from registration through payment.

