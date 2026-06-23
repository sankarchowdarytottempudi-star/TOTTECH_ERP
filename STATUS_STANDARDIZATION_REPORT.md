# Status Standardization Report

Date: 2026-06-13

## Objective

Replace Clinical Services free-text status entry with controlled dropdowns backed by `status_master`.

## Modules Updated

Dynamic status dropdowns are now active in these operational engines:

- IVF modules
- HMS modules
- Pharmacy modules
- Finance modules

## Fields Controlled

The UI now treats these fields as controlled status fields:

- `status`
- `record_status`
- `workflow_status`
- `appointment_status`
- `cycle_status`
- `lab_status`
- `billing_status`
- `payment_status`
- `patient_status`
- `admission_status`
- `discharge_status`
- `consultation_status`
- `ivf_status`
- `embryo_status`
- `pregnancy_status`
- `current_status`
- `availability_status`
- `approval_status`
- `collection_status`
- `verification_status`
- `inventory_status`
- `dispense_status`
- `queue_status`

## Dropdown Source

All updated dropdowns load options from:

- `GET /api/clinical/status-master?module=<module>`

No status values are hardcoded in the updated form dropdown UI. The frontend only maps the current business area to a status module key.

## Business Status Coverage

Implemented controlled sets for:

- IVF Couple Management
- Fertility Assessment
- IVF Cycle
- Stimulation
- Retrieval
- Embryology
- Cryopreservation
- Transfer
- Donor
- Surrogacy
- Pregnancy Tracking
- Front Desk Appointment
- Vitals
- Doctor Consultation
- Lab
- Pharmacy
- IP
- ICU
- OT
- Billing
- Payments

## Validation Results

Build:

- Passed with `npm run build`

Runtime:

- PM2 `tottech-one` restarted successfully.

API:

- `ivf_cycles` status API returned controlled dropdown values.
- `lab` status API returned controlled dropdown values.

Migration:

- 232 existing records mapped into controlled status codes.

Screenshots:

- `reports/status-ivf-cycles-dropdown.png`
- `reports/status-ivf-embryology-dropdown.png`
- `reports/status-hms-ip-dropdown.png`
- `reports/status-finance-ar-dropdown.png`

## Result

Users can no longer manually type arbitrary status values in the updated Clinical Services operational dynamic forms. Status values now come from `status_master`, which gives dashboards, reports, filters, and workflow automation a stable code vocabulary.
