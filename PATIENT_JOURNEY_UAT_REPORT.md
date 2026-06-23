# Patient Journey UAT Report

Generated: 2026-06-20
Scope: Patient registration -> appointment -> vitals -> consultation -> lab -> pharmacy -> billing

## Browser-Validated Journey
1. Patient registration created via UI.
2. Appointment booked via UI.
3. Vitals saved via UI.
4. Doctor consultation saved via UI.
5. Lab request created and processed via UI.
6. Pharmacy prescription queue completed via UI.
7. Billing receipt flow executed via UI.

## Record Trail
- Patient: `Go Live Patient B` / UHID `UHID-1781979515806`
- Appointment: `132`
- Lab order: `93`
- Lab result: `86`
- Prescription: `24`
- Pharmacy queue: `25`
- Billing payment: `PAY-1781981604028-3415`

## Result
| Step | Status |
| --- | --- |
| Registration | PASS |
| Appointment | PASS |
| Vitals | PASS |
| Doctor consultation | PASS |
| Lab | PASS |
| Pharmacy | PASS |
| Billing receipt collection | PARTIAL |

## Evidence
- Browser screenshots captured during the workflow.
- Database rows persisted for each major step.

## Observation
The patient journey is usable, but billing reconciliation still needs one pass because the invoice state and payment state deserve a final audit before certification.
