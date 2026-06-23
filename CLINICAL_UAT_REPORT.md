# Clinical UAT Report

Generated: 2026-06-07 17:43 CEST

## UAT Execution

Script: `scripts/clinical-phase17-uat.mjs`

Execution target: `http://localhost:3000`

Authentication: Clinical super admin context cookie for `CS-Superadmin@erp.com`; no password exposed.

## UAT Results

| Test | Status | Evidence |
|---|---|---|
| Clinical context | WORKING | Tenant 1, hospital 1, branch 1, clinic 1, role `clinical_super_admin` |
| Patient seed | WORKING | 100 UAT patients available |
| Doctor seed | WORKING | 50 UAT doctors available |
| Appointment booking/status | WORKING | 25 appointments created per run; status update succeeded |
| HMS OP/IP/Nursing/ICU/OT/Billing/Insurance | WORKING | Records created through `/api/clinical/hms/*` |
| HMS ER | WORKING | `/api/clinical/hms/er` returned HTTP 201 with ER number `ER-1780846964101` |
| IVF couple-to-transfer | WORKING | Couple, female assessment, male assessment, plan, cycle, stimulation, retrieval, embryology, transfer created |
| Pharmacy purchase/inventory/sale | WORKING | Category, vendor, medicine, warehouse, PO, inventory, retail sale created |
| Finance CoA/GL/AR/Cash/Referral | WORKING | CoA, cost center, GL, AR invoice, cash transaction, referral created |
| Interop FHIR/HL7/PACS | WORKING | FHIR Patient/Practitioner/Observation, HL7 message, PACS study created |
| Analytics KPI/AI insight | WORKING | CEO dashboard metric and AI insight created |
| Dashboard API | WORKING | Metrics returned real counts and revenue |
| Patient 360 API | WORKING | Expanded 360 payload returned HTTP 200 |

## Live Metric Evidence

Dashboard metrics after restart:

| Metric | Value |
|---|---:|
| Today's appointments | 28 |
| Patients registered today | 101 |
| Doctors available | 51 |
| Lab orders pending | 0 |
| Revenue today | 19560 |
| Revenue this month | 19560 |
| IVF cycles active | 3 |
| Patients waiting | 24 |

Expanded Patient 360 evidence for patient `101`:

| Data Area | Count |
|---|---:|
| Appointments | 3 |
| OP visits | 3 |
| ER visits | present after ER UAT |
| Admissions | 3 |
| Nursing notes | 3 |
| HMS invoices | 3 |
| Finance invoices | 3 |
| IVF couples | 3 |
| IVF cycles | 3 |
| Pharmacy sales | 3 |
| FHIR resources | 3 |
| Timeline entries | 59 |
| Audit events | 13 |

## UAT Not Completed

| Area | Reason |
|---|---|
| Full diagnostic lab/radiology workflow | Dedicated order/sample/result/report UI/API not fully implemented |
| Mobile UAT | React Native app/APK pipeline not validated |
| Performance UAT | 100/500/1000 concurrent user tests not executed |
| Full finance statutory reports | Trial balance, P&L, balance sheet, GST reports not validated |
| RBAC negative testing by role | Non-super-admin clinical users and per-action denials not fully validated |

## UAT Conclusion

Selected workflows are working through real APIs. Full hospital UAT is **partial** until diagnostics, mobile, RBAC denials, performance, and statutory finance reporting are completed.
