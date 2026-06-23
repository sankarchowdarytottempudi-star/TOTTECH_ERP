# Clinical Workflow Status Report

Audit date: 2026-06-07

Scope: End-to-end workflow readiness for the requested Clinical Services operations.

## Executive Result

Status: PARTIAL

Core registration, appointment, consultation, prescription, billing, pharmacy queue, radiology upload, patient timeline, and audit trail foundations exist. The workflow set is not complete enough for UAT data cleanup.

## Workflow Matrix

| Workflow | Status | Evidence | Gap |
|---|---|---|---|
| Patient Registration | WORKING | `patients` has 101 rows; `/api/clinical/patients` returns 200 | None found in this audit |
| Appointment | WORKING | `appointments` has 78 rows; `/api/clinical/appointments` returns 200 | None found in this audit |
| Consultation | WORKING | `medical_records` has 1 row; `/api/clinical/doctors/consultations/78` returns 200 | Needs broader multi-doctor UAT |
| Prescription | WORKING | `prescriptions` has 1 row | Needs broader medication inventory validation |
| Lab Order | WORKING | `lab_orders` has 2 rows | None found for order creation |
| Lab Result | PARTIAL | `lab_results` table exists | 0 result rows; result entry, approval, and release not proven |
| Radiology Order | WORKING | `radiology_orders` has 1 row | None found for order creation |
| Radiology Upload | WORKING | `radiology_uploads` has 2 rows; upload API returns 200 | Report finalization not proven |
| Radiology Result/Report | PARTIAL | `radiology_reports` table exists | 0 report rows |
| Pharmacy Dispense | PARTIAL | `pharmacy_prescription_queue` has 1 row | Inventory deduction, sale, and complete dispense lifecycle need UAT proof |
| Admission | WORKING | `ip_admissions` has 3 rows | Related bed/ward flows still have zero-data risks |
| Discharge | PARTIAL | `discharge_summaries` table exists | 0 discharge rows |
| Billing | WORKING | `billing_invoices` has 3 rows | Payment/refund/write-off lifecycle not fully proven in this audit |
| Insurance | PARTIAL | `insurance_claims` has 3 rows | Full pre-auth, submission, settlement, denial, appeal flow not proven |
| Referral | PARTIAL | `clinical_referrals` exists | 0 clinical referral rows |
| IVF Cycle | WORKING | `ivf_couples` has 3 rows; `ivf_cycles` has 3 rows; IVF 360 API returns 200 | Needs full downstream cycle proof |
| Embryology | PARTIAL | `ivf_embryos` exists | 0 embryo rows |
| Transfer | BROKEN | Expected `ivf_transfers` table | Missing table |
| Pregnancy Tracking | BROKEN | Expected `ivf_pregnancy_tracking` table | Missing table; `ivf_pregnancies` exists but has 0 rows |

## 360 Views

| View | Status | Evidence | Gap |
|---|---|---|---|
| Patient 360 | WORKING | `/api/clinical/hms/patient-360/101` returns 200; `clinical_patient_timeline` has 127 rows | Some tabs depend on incomplete lab/radiology/discharge/referral data |
| IVF 360 | PARTIAL | `/api/clinical/ivf/360/3` returns 200; couples/cycles exist | Embryology, transfer, and pregnancy tracking are not production-proven |

## Clickability And Drilldown

| Element Type | Status | Evidence |
|---|---|---|
| Registered navigation links | WORKING | 250 internal clinical links returned 200 |
| Page routes | WORKING | 425 authenticated page routes returned 200 |
| Obvious dead static links | WORKING | No `href="#"`, `javascript:void`, empty click handlers, or permanent disabled buttons found |
| KPI/card/table click-through | PARTIAL | Destination routes are available, but several destinations have zero data or missing workflow tables |
| Chart drilldowns | PARTIAL | Analytics pages are reachable; 21 of 24 analytics API modules have zero rows |
| Form save/update | PARTIAL | Some write workflows have data evidence; lab result, discharge, referral, IVF transfer, and pregnancy tracking are not proven |

## Critical Blocks Before UAT Cleanup

1. Create and validate IVF transfer model/table or map to the correct existing production table.
2. Create and validate IVF pregnancy tracking model/table or map to the correct existing production table.
3. Execute and prove Lab Result entry, approval, and release.
4. Execute and prove Radiology Report finalization.
5. Execute and prove IP Discharge Summary.
6. Execute and prove Referral creation and commission/CRM lifecycle.
7. Execute and prove IVF Embryology record creation.
8. Re-audit mobile workflows because all 33 mobile module APIs currently return zero rows.

## Cleanup Gate

Result: FAILED

Reason: The audit does not have 0 broken workflows.

No backup or deletion was performed.

