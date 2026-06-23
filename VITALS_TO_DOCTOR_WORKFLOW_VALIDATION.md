# Vitals To Doctor Workflow Validation

Date: 2026-06-10

## Defect Fixed

The Vitals Collection workflow no longer depends on staff manually entering an appointment ID first. The vitals station now uses the shared patient lookup pattern used by Patient 360, Lab, Pharmacy and Operations.

## Changes Implemented

- Added patient-first lookup to the Vitals section.
- Search supports patient name, mobile number, UHID/MRN and ABHA.
- Selecting a patient loads:
  - Active/latest appointment
  - Token number
  - Appointment status
  - Queue status
  - Existing vitals, when available
- Vitals API now accepts `patient_id` and resolves the current appointment automatically when `appointment_id` is not supplied.
- Save button now disables while saving and shows a spinner.
- API success response now returns:
  - `Vitals saved successfully. Patient moved to Doctor Queue.`
- Vitals queue now shows:
  - Today Queue
  - Completed Vitals
  - Ready For Doctor Queue
- Patient lookup now returns latest vitals so existing readings are visible immediately.

## End-To-End Test Record

Patient:

- Patient ID: `527`
- Name: `Tottempudi Leela Sankar Chowdary`
- UHID/MRN: `1234567890`
- Mobile: `8179618819`

Appointment:

- Appointment ID: `128`
- Appointment No: `APT-1781100002640`
- Token: `T-002`

## Database Evidence

Vitals row persisted:

| Field | Value |
|---|---|
| Vitals ID | `19` |
| Patient ID | `527` |
| Appointment ID | `128` |
| BP | `110/70` |
| Pulse | `99` |
| Temperature | `98` |
| SpO2 | `99` |
| Height | `511` |
| Weight | `133.2` |
| BMI | `5.1` |
| Status | `VITALS_COLLECTED` |

Appointment queue updated:

| Field | Value |
|---|---|
| Appointment Status | `VITALS_COMPLETED` |
| Queue Status | `WAITING_FOR_DOCTOR` |

Timeline event created:

| Field | Value |
|---|---|
| Event Type | `VITALS` |
| Event Title | `VITALS_COMPLETED` |
| Source Table | `clinical_vitals` |
| Source ID | `19` |
| Summary | `Vitals captured by nursing and patient moved to doctor queue.` |

## Doctor Workspace Evidence

Doctor consultation API for appointment `128` now returns latest vitals:

- BP: `110/70`
- Pulse: `99`
- SpO2: `99`
- BMI: `5.1`

The doctor screen displays the saved vitals in the Clinical Notes header.

## Screenshot Evidence

- Patient search: `/opt/tottech-one/evidence/vitals-workflow/01-vitals-patient-search.png`
- Vitals selected and queues: `/opt/tottech-one/evidence/vitals-workflow/02-vitals-selected-and-queues.png`
- Doctor workspace displaying vitals: `/opt/tottech-one/evidence/vitals-workflow/03-doctor-workspace-vitals.png`

## Validation Result

Status: `WORKING`

The patient was processed end-to-end through:

Patient Lookup -> Vitals Save -> Queue Update -> Doctor Workspace

The doctor workspace displays the saved vitals automatically.
