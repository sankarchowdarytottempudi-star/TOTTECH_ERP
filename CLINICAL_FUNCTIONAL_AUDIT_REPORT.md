# Clinical Functional Audit Report

Audit date: 2026-06-07

Scope: TOTTECH Clinical Services pre-production audit. No data was deleted. No backup was created because the audit did not pass the required zero-gap gate.

## Executive Result

Status: PARTIAL

The Clinical Services UI is reachable and the registered navigation surface is not broken, but the platform is not ready for UAT data cleanup. Several workflows either have no operational records or are missing the expected production data model.

Required cleanup gate:

| Gate | Result |
|---|---:|
| Broken pages | 0 |
| Dead links | 0 |
| Broken workflows | More than 0 |
| Dead cards/widgets | No obvious static dead-link markers found, but full click-through depends on incomplete workflows |
| Backup allowed | No |
| Data deletion allowed | No |

## Audit Method

Evidence collected:

- Authenticated route audit across 425 Clinical Services pages.
- Internal clinical link audit across 250 discovered application links.
- Clinical module API audit across 241 module endpoints.
- Workflow table evidence for core operational tables.
- Static source scan for obvious dead interactions: `href="#"`, `javascript:void`, empty click handlers, permanent disabled buttons, `Coming Soon`, `Not implemented`, `Configured Forms`, and `Audit Activity`.
- UAT/test/demo record scan across public PostgreSQL text/json columns.

Runtime user context used for authenticated checks:

- Clinical project: `tottech_clinical_services`
- Role: `SUPER_ADMIN`

## Page Status By Domain

| Domain | Pages | Working | Partial | Broken | Placeholder |
|---|---:|---:|---:|---:|---:|
| Administration | 8 | 8 | 0 | 0 | 0 |
| Analytics & Reports | 7 | 7 | 0 | 0 | 0 |
| Analytics | 24 | 24 | 0 | 0 | 0 |
| Appointments | 1 | 1 | 0 | 0 | 0 |
| Billing & Revenue | 7 | 7 | 0 | 0 | 0 |
| Compliance | 21 | 21 | 0 | 0 | 0 |
| Dashboard | 7 | 7 | 0 | 0 | 0 |
| Doctors | 13 | 13 | 0 | 0 | 0 |
| Emergency (ER) | 5 | 5 | 0 | 0 | 0 |
| Finance & Accounts | 7 | 7 | 0 | 0 | 0 |
| Finance | 26 | 26 | 0 | 0 | 0 |
| HMS | 15 | 15 | 0 | 0 | 0 |
| HRMS | 34 | 34 | 0 | 0 | 0 |
| ICU | 5 | 5 | 0 | 0 | 0 |
| IVF & Fertility | 15 | 15 | 0 | 0 | 0 |
| IVF 360 | 1 | 1 | 0 | 0 | 0 |
| IVF | 17 | 17 | 0 | 0 | 0 |
| Inpatient (IP) | 11 | 11 | 0 | 0 | 0 |
| Insurance & TPA | 6 | 6 | 0 | 0 | 0 |
| Interoperability | 29 | 29 | 0 | 0 | 0 |
| Inventory & Procurement | 7 | 7 | 0 | 0 | 0 |
| Laboratory | 8 | 8 | 0 | 0 | 0 |
| Mobile | 33 | 33 | 0 | 0 | 0 |
| Operation Theatre | 6 | 6 | 0 | 0 | 0 |
| Outpatient (OP) | 7 | 7 | 0 | 0 | 0 |
| Patient 360 | 1 | 1 | 0 | 0 | 0 |
| Patient Engagement | 6 | 6 | 0 | 0 | 0 |
| Patient Management | 8 | 8 | 0 | 0 | 0 |
| Pharmacy | 32 | 32 | 0 | 0 | 0 |
| Production | 14 | 14 | 0 | 0 | 0 |
| Radiology & PACS | 6 | 6 | 0 | 0 | 0 |
| Referral & CRM | 7 | 7 | 0 | 0 | 0 |
| Security & Compliance | 7 | 7 | 0 | 0 | 0 |
| Security | 18 | 18 | 0 | 0 | 0 |
| TOTTECH AI | 6 | 6 | 0 | 0 | 0 |

## Module API Status

All 241 tested module API endpoints returned HTTP 200. That proves endpoint availability, not full workflow completion.

| Module Group | Endpoints | Zero-data endpoints | Broken |
|---|---:|---:|---:|
| analytics | 24 | 21 | 0 |
| compliance | 21 | 0 | 0 |
| finance | 26 | 20 | 0 |
| hms | 15 | 7 | 0 |
| hrms | 26 | 18 | 0 |
| interoperability | 23 | 19 | 0 |
| ivf | 17 | 8 | 0 |
| mobile | 33 | 33 | 0 |
| pharmacy | 24 | 16 | 0 |
| production | 14 | 0 | 0 |
| security | 18 | 3 | 0 |

Important finding: 145 of 241 module APIs currently return zero operational rows. These cannot be counted as production-proven workflows.

## Core Runtime API Checks

| API | Result |
|---|---|
| `/api/clinical/patients` | WORKING |
| `/api/clinical/appointments` | WORKING |
| `/api/clinical/doctors/consultations/78` | WORKING |
| `/api/clinical/hms/patient-360/101` | WORKING |
| `/api/clinical/ivf/360/3` | WORKING |
| `/api/clinical/pharmacy/prescription-queue?patient_id=101` | WORKING |
| `/api/clinical/radiology/uploads?patient_id=101` | WORKING |
| `/api/clinical/global-search?q=9000000100` | WORKING |

## Operational Data Evidence

| Table | Status | Count |
|---|---|---:|
| patients | EXISTS | 101 |
| doctors | EXISTS | 51 |
| appointments | EXISTS | 78 |
| medical_records | EXISTS | 1 |
| prescriptions | EXISTS | 1 |
| lab_orders | EXISTS | 2 |
| lab_results | EXISTS | 0 |
| radiology_orders | EXISTS | 1 |
| radiology_reports | EXISTS | 0 |
| radiology_uploads | EXISTS | 2 |
| pharmacy_prescription_queue | EXISTS | 1 |
| ip_admissions | EXISTS | 3 |
| discharge_summaries | EXISTS | 0 |
| billing_invoices | EXISTS | 3 |
| insurance_claims | EXISTS | 3 |
| clinical_referrals | EXISTS | 0 |
| ivf_couples | EXISTS | 3 |
| ivf_cycles | EXISTS | 3 |
| ivf_embryos | EXISTS | 0 |
| ivf_transfers | MISSING_TABLE | - |
| ivf_pregnancy_tracking | MISSING_TABLE | - |
| ivf_pregnancies | EXISTS | 0 |
| clinical_audit_events | EXISTS | 357 |
| clinical_patient_timeline | EXISTS | 127 |

## Functional Findings

WORKING:

- Dashboard and command-center routes are reachable.
- Patient Registration has database evidence.
- Appointment has database evidence.
- Doctor consultation detail API is reachable.
- Prescription has database evidence.
- Lab Order has database evidence.
- Radiology Order and upload have database evidence.
- Pharmacy prescription queue has database evidence.
- IP admission records exist.
- Billing invoices exist.
- Insurance claims exist.
- Patient 360 and IVF 360 routes/API endpoints are reachable.
- Clinical audit and patient timeline tables contain records.

PARTIAL:

- Laboratory workflow is incomplete because `lab_results` has zero rows.
- Radiology workflow is incomplete because `radiology_reports` has zero rows.
- IP workflow is incomplete because `discharge_summaries` has zero rows.
- Referral workflow is incomplete because `clinical_referrals` has zero rows.
- IVF workflow is incomplete because `ivf_embryos` has zero rows.
- Insurance workflow has claims, but full claim lifecycle validation was not proven.
- Finance, HRMS, analytics, mobile, pharmacy, and interoperability have many zero-data module endpoints.

BROKEN:

- IVF Transfer cannot be production-proven because `ivf_transfers` is missing.
- IVF Pregnancy Tracking cannot be production-proven because `ivf_pregnancy_tracking` is missing and `ivf_pregnancies` has zero rows.

PLACEHOLDER:

- No registered audited page returned route-level placeholder signals.
- Zero-data module APIs remain placeholder-risk until real rows and click-through workflows are proven.

## Backup And Cleanup Decision

PRE_PRODUCTION_BACKUP was not created.

Reason: The user instruction allows backup only after audit passes with:

- 0 Broken Pages
- 0 Dead Cards
- 0 Dead Links
- 0 Broken Workflows

The audit currently has 0 broken pages and 0 dead links, but not 0 broken workflows. Data cleanup must remain blocked.

