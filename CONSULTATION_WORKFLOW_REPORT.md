# Consultation Workflow Report

Date: 2026-06-07

## Workflow Implemented

Reception flow:

1. Book appointment.
2. Mark patient as `CHECKED_IN`.
3. Patient appears in Doctors -> Consultation Queue.
4. Doctor/assistant starts consultation.
5. Appointment moves to `IN_CONSULTATION`.
6. Doctor opens `/clinical-services/doctors/consultation/[id]`.
7. Doctor saves clinical notes, prescription, lab orders, radiology orders.
8. Timeline and audit records are created.

## Consultation Workbench

Layout implemented:

- Left: Patient Summary.
- Center: Consultation Workspace.
- Right: Clinical History and Timeline.

Patient summary includes name, MRN/UHID, age, gender, mobile, blood group, allergies, insurance, current visit, last visit, and primary doctor.

Clinical workspace includes chief complaint, history, diagnosis, clinical notes, advice, follow-up date, medicines, lab orders, and radiology orders.

## Runtime Evidence

Validation appointment `78`:

- Status: `IN_CONSULTATION`.
- Queue status: `IN_CONSULTATION`.
- Medical record: `1`.
- Current consultation GET returned:
  - Patient: `UAT17 Patient 100 Female`.
  - Current record: `1`.
  - Previous lab report/order rows: `2`.
  - Previous radiology rows: `3`.

## APIs

- `GET /api/clinical/doctors/consultations?view=queue`
- `POST /api/clinical/doctors/consultations`
- `GET /api/clinical/doctors/consultations/[id]`
- `POST /api/clinical/doctors/consultations/[id]`
