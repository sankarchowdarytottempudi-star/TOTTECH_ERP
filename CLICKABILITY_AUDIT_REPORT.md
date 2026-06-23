# Clinical Services Clickability Audit Report

Generated: 2026-06-13

## Audit Method

Static route and link sweep across:

- `app/clinical-services`
- `components/clinical`
- `mobile/src`

The sprint fixed confirmed stale routes and dead anchors. Authenticated browser replay is still required for a true zero-dead-controls certification.

## Fixed Items

| Location | Previous Target | Fixed Target | Status |
| --- | --- | --- | --- |
| Mobile Clinical launchpad: Today Schedule | `/patients/appointments` | `/appointments` | FIXED |
| Mobile Clinical launchpad: Register Patient | `/patients/registration` | `/patients` | FIXED |
| Mobile Clinical launchpad: Patient Search | `/patients/search` | `/patients` | FIXED |
| Mobile Clinical launchpad: Patient Timeline | `/patients/timeline` | `/patients` | FIXED |
| Mobile Clinical launchpad: Queue | `/patients/queue` | `/appointments` | FIXED |
| Mobile Clinical launchpad: Diagnostics | `/diagnostics` | `/operations#lab` | FIXED |
| Mobile Clinical launchpad: Billing | `/billing` | `/billing-revenue` | FIXED |
| Mobile Clinical launchpad: AI pages | `/ai/clinical`, `/ai/ivf`, `/ai/command-center` | `/ai` | FIXED |
| Clinical Operations owner KPI | `#billing` | `#front-desk` | FIXED |

## Current Certification

- Static dead-route fixes: COMPLETED for confirmed stale links.
- Build validation after fixes: PASSED.
- Runtime authenticated clickability replay: REQUIRED before claiming 0 dead buttons/cards.

## Remaining Audit Gate

Run Playwright with clinical login for:

- Dashboard cards
- Patient cards
- Appointment rows
- Vitals queue
- Doctor consultation buttons
- Lab queue actions
- Pharmacy queue actions
- Billing and payment actions
- Patient 360 timeline events

