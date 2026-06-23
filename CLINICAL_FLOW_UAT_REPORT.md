# Clinical Flow UAT Report

Generated: 2026-06-20
Environment: https://erp.tottechsolutions.com
Role used: Clinical Services Super Admin / clinical staff roles through browser UI

## Scope Validated
- Front Desk patient registration
- Appointment booking and queue progression
- Vitals capture
- Doctor consultation
- Lab order lifecycle
- Pharmacy queue / dispense flow
- Billing invoice and receipt workflow

## Browser Evidence
- Login successful on clinical platform.
- Patient created from UI: `Go Live Patient A` and `Go Live Patient B`.
- Appointment created: `APT-1781979643808` / appointment id `132`.
- Vitals saved for appointment `132`.
- Consultation saved for appointment `132`.
- Lab order created and progressed to released state.
- Pharmacy prescription queue created and completed.
- Billing receipt collected through the browser UI.

## Key Records
- Patient: `531` (`Go Live Patient B`)
- Appointment: `132`
- Vitals: `22`
- Lab order: `93` / `94` / `95` workflow evidence on the same patient journey
- Lab result: `86`
- Prescription: `24`
- Pharmacy queue: `25`

## Status by Workflow
| Workflow | Result | Notes |
| --- | --- | --- |
| Patient registration | PASS | UI save, persistence, and patient list evidence available. |
| Appointment booking | PASS | Appointment and queue state persisted. |
| Vitals | PASS | BP, pulse, temperature, SpO2, height, weight, respiration saved. |
| Consultation | PASS | Doctor consultation saved with medicines and lab order. |
| Lab | PASS | Sample collection, entry, validation, approval, release validated. |
| Pharmacy | PASS | Prescription queue completed and stock/dispense flow observed. |
| Billing | PARTIAL | Receipt collection worked, but invoice/accounting state needs a follow-up audit. |

## Evidence Files
- `/opt/tottech-one/login-check-clinical.png`
- `/opt/tottech-one/lab-save-fixed.png`
- `/opt/tottech-one/lab-after-save.png`
- `/opt/tottech-one/lab-released-ui.png`
- `/opt/tottech-one/pharmacy-edit-complete.png`
- `/opt/tottech-one/hms-billing-create.png`
- `/opt/tottech-one/billing-collect.png`
- `/opt/tottech-one/finance-payments-view.png`

## Notes
The clinical chain is operational end-to-end through the browser. Billing needs one more accounting reconciliation check before we call it fully clean for handover.
