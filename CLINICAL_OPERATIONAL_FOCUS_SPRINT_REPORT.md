# Clinical Operational Focus Sprint Report

Date: 2026-06-13

Scope:
- Doctor module and consultation workflow
- Global mobile number search
- Lab and radiology integration visibility
- Pharmacy integration visibility
- Patient 360 completion checkpoints
- Clickable cards / dead-link audit targets
- UAT validation gate
- Backup and dummy-data cleanup gate
- Real hospital data loading readiness
- Pilot deployment readiness

## Code Changes Completed

1. Global search result enrichment
   - Header global search now shows patient latest visit status, latest prescription, lab report count, and radiology count.
   - Patient result still routes directly to Patient 360.

2. Mobile/patient search enrichment
   - Mobile lookup cards now show latest visit date, status, prescription, lab report count, and radiology record count.
   - Patient 360 link uses the API-provided Patient 360 URL when available.

3. Vitals workflow hardening
   - Vitals form state now includes `patient_id` as a first-class field.
   - Selecting a patient preloads appointment ID, latest existing vitals, and clinical context from lookup.
   - Vitals notification now resolves the assigned doctor name from the appointment instead of sending internal doctor IDs.

## Current Database Evidence

Operational records currently present:

| Table | Active Count |
| --- | ---: |
| patients | 128 |
| appointments | 77 |
| clinical_vitals | 20 |
| medical_records | 24 |
| lab_orders | 55 |
| lab_results | 55 |
| radiology_orders | 1 |
| prescriptions | 22 |
| pharmacy_prescription_queue | 22 |
| clinical_pharmacy_dispenses | 23 |
| billing_invoices | 141 |
| payments | 132 |

UAT/TEST/DEMO marker scan:

| Area | Matching Rows |
| --- | ---: |
| patients | 0 |
| appointments | 0 |
| medical_records | 0 |

No data was removed in this sprint.

## Operational Workflow Status

| Capability | Status | Evidence / Notes |
| --- | --- | --- |
| Reception to appointment | WORKING | Appointment records exist and global search opens Patient 360/appointments. |
| Appointment to vitals | WORKING/PARTIAL | Vitals can now be saved by patient context; real role UAT still required. |
| Vitals to doctor consultation | WORKING/PARTIAL | Vitals API moves queue to doctor and doctor loader reads latest vitals. Needs live user verification after save. |
| Doctor consultation | WORKING | Consultation page displays patient summary, allergies, history, vitals, labs, radiology, prescription and follow-up. |
| Lab order from doctor | WORKING | Lab orders and lab results exist; doctor consultation API creates lab orders and billing items. |
| Radiology order from doctor | PARTIAL | Radiology orders are supported, but current active count is low. Needs pilot test data and upload/release UAT. |
| Prescription to pharmacy | WORKING | Prescriptions and pharmacy queue counts match, and pharmacy dispense records exist. |
| Pharmacy dispense | WORKING/PARTIAL | Dispense records exist. UAT should validate partial/out-of-stock/return cases with real stock. |
| Patient 360 | WORKING | Patient 360 aggregates demographics, vitals, consultation, prescriptions, lab, radiology, pharmacy, billing, documents, timeline and audit. |
| Global mobile search | WORKING | Mobile lookup returns linked patient, latest visit, latest prescription, lab count, radiology count, and Patient 360 link. |

## Clickable Cards / Dead Links Audit Focus

High-priority cards and rows that must remain clickable during UAT:

- Global search patient result -> Patient 360
- Mobile lookup patient result -> Patient 360
- Patient 360 journey cards -> relevant operational section
- Vitals Today Queue -> Doctor Consultation
- Completed Vitals -> Doctor Consultation
- Ready For Doctor Queue -> Doctor Consultation
- Lab order row -> Doctor View
- Pharmacy queue action buttons -> dispense workflow
- Billing/payment rows -> billing section

## UAT Validation Required Before Pilot

Role-based UAT must be performed with real users:

- Receptionist: register patient, book appointment, search by mobile, open Patient 360.
- Nurse: search patient, save vitals, confirm doctor queue update.
- Doctor: open consultation, verify vitals/history/lab/radiology, create lab order, radiology order, prescription, follow-up.
- Lab Technician: receive order, collect sample, enter result, validate, approve, release.
- Radiology Technician: receive order, upload report/images, approve/release.
- Pharmacist: dispense, partial dispense, out-of-stock and return.
- Billing/Finance: verify auto-created billing items, collect payment, print receipt.
- Hospital Admin: validate users, departments, masters and operational permissions.

## Dummy Data Cleanup Gate

Do not remove data until:

1. Backup is created under `/opt/backups/pre-production-cleanup/YYYYMMDD-HHMM`.
2. UAT report confirms what should be retained.
3. Only records explicitly matching `UAT%`, `TEST%`, or `DEMO%` are selected.
4. Masters, users, roles, departments, medicines, lab tests, settings and workflows are retained.

Current scan found no obvious UAT/TEST/DEMO patient journey rows in patients, appointments or medical records.

## Pilot Readiness Recommendation

Next work should stay limited to:

- Execute live role-based UAT.
- Fix any broken cards, buttons, or workflow transitions discovered during UAT.
- Load real hospital data through controlled import.
- Validate one complete outpatient journey with real hospital data.
- Then package pilot deployment.

Do not add new architecture, governance, compliance, metadata catalogs or analytics phases until these operational workflows pass UAT.
