# Role Based Navigation Report

## Role Families Covered
- Reception
- Doctor
- Lab
- Pharmacy
- Nurse
- OT
- ICU
- IVF
- Finance
- Admin
- Super Admin

## Navigation Rules Applied
- Super Admin: full clinical navigation remains available.
- Admin: broader clinical and governance paths remain available, but technical/analytics areas are reduced.
- Reception: patient access, appointments, billing, and queue-related flows only.
- Doctor: patients, consultations, lab, pharmacy, and clinical work queues.
- Lab: patient access, lab, radiology, and workflow queues.
- Pharmacy: patient access, pharmacy, inventory, and billing paths.
- Nurse / Vitals / ICU / OT / IVF: only their operational workflows.
- Analytics and technical areas are hidden from operational users.

## Implementation Notes
- Sidebar domains are filtered in the clinical shell by role family.
- Bottom navigation no longer shows analytics for operational roles.
- Dashboard quick actions are only shown to governance roles.
