# Clinical Workflow Gap Analysis

Generated: 2026-06-10

## Scope

This sprint focused only on hospital operational workflow corrections:

- Pharmacy administration versus dispensing counter separation
- Patient-name-first operational lookup
- Patient 360 lab order/result visibility
- Patient history and timeline evidence
- Data integrity checks across prescription, lab, pharmacy, and billing handoff points

No readiness dashboards or unrelated modules were added.

## Implementation Summary

### Pharmacy Workflow Redesign

Status: PARTIAL, improved

Implemented:

- Replaced the generic Pharmacy landing page with a domain-specific pharmacy workspace.
- Split pharmacy into:
  - Pharmacy Administration
  - Pharmacy Dispensing Counter
- Added administration entry points:
  - Medicine Master
  - Drug Categories
  - Manufacturers / Vendors
  - Purchase Orders
  - GRN
  - Stock / Batch / Expiry
  - Reorder Levels
- Added dispensing queues:
  - Pending Prescriptions
  - Partially Dispensed
  - Dispensed
  - All Queue
- Pharmacy queue now displays doctor-prescribed medicines with dosage, frequency, duration, and quantity.
- Dispensing actions remain connected to existing stock reduction, billing item creation, and audit/event logic through `/api/clinical/operations/pharmacy-dispense`.

Remaining gap:

- Returned Medicines Queue is represented as an expected queue category but does not yet have a distinct return workflow screen.

Evidence:

- `/opt/tottech-one/reports/screenshots/clinical-pharmacy-dispense-flow.png`
- `/opt/tottech-one/reports/screenshots/clinical-pharmacy-prescription-queue.png`

### Patient Search Standardization

Status: READY for core operational lookup

Implemented:

- Created global patient lookup API:
  - `/api/clinical/patient-lookup`
- Created reusable component:
  - `components/clinical/ClinicalPatientLookup.tsx`
- Search supports:
  - Patient Name
  - Mobile / WhatsApp / alternate mobile
  - UHID / MRN
  - ABHA
- Integrated lookup into:
  - Operations
  - Doctors
  - Laboratory
  - Generic operational pages through `Phase2OperationalPage`
  - Pharmacy

Validated:

- `/api/clinical/patient-lookup?q=Journey` returned 18 real patients.
- First result: `Journey Patient E2E-1781081397344`, `UHID-1781081398424`.

Evidence:

- `/opt/tottech-one/reports/screenshots/clinical-patient-search.png`
- `/opt/tottech-one/reports/screenshots/clinical-lab-flow.png`
- `/opt/tottech-one/reports/screenshots/clinical-prescription-flow.png`

### Lab Workflow Correction

Status: PARTIAL, improved

Implemented:

- Patient 360 now separates:
  - Lab Orders
  - Lab Results
- Lab Orders display:
  - Test name
  - Ordered date
  - Ordered by
  - Priority
  - Status
- Lab Results display:
  - Test name
  - Result value
  - Unit when available
  - Normal range when available
  - Result date
  - Status
  - Released by
- Patient 360 API now enriches lab orders/results from normalized lab tables and lab test master records where available.

Validated:

- Patient `526`, `UHID-1781081398424`:
  - Lab Orders: 1
  - Lab Results: 1
  - Released result: `Complete Blood Count`
  - Result value: `WBC 7,200 / cumm; Hb 12.8 g/dL; Platelets 2.5 lakh`
  - Status: `RELEASED`

Remaining gap:

- Some historical lab results lack structured unit/normal range data because the source test master did not contain complete reference values at creation time.

Evidence:

- `/opt/tottech-one/reports/screenshots/clinical-patient-360-lab-history.png`

### Patient 360 View

Status: PARTIAL, improved

Existing Patient 360 already included patient identity, vitals, consultations, prescriptions, lab, billing, pharmacy, documents, timeline, and audit sections.

Improved:

- Added explicit lab order and lab result history sections.
- Kept all module links returning to Patient 360 through lookup and queue actions.

Validated:

- `/api/clinical/hms/patient-360/526` returned:
  - Patient record
  - 1 lab order
  - 1 released lab result
  - 1 prescription
  - 25 timeline entries

Evidence:

- `/opt/tottech-one/reports/screenshots/clinical-patient-360-top.png`
- `/opt/tottech-one/reports/screenshots/clinical-patient-360-lab-history.png`
- `/opt/tottech-one/reports/screenshots/clinical-patient-history-timeline.png`

## Clinical Data Integrity Validation

Validated against real UAT data in:

- Tenant: `13`
- Hospital: `TOTTECH Multi-Speciality Hospital`
- Branch: `Vijayawada Main Branch`
- Patient: `526`
- UHID: `UHID-1781081398424`

| Flow | Evidence | Status |
|---|---:|---|
| Doctor Prescription -> Pharmacy Queue | Pharmacy queue rows include `prescription_uid`, patient, doctor, structured medications | READY |
| Doctor Lab Order -> Lab Queue | Lab API returns order `LAB-1781081423648-1` for patient `526` | READY |
| Lab Result -> Patient History | Patient 360 shows released CBC result value and status | READY |
| Billing Payment -> Finance | Existing billing/payment tables are linked in Patient 360; not re-executed in this sprint | PARTIAL |
| Admission -> IP | Not executed in this sprint | PARTIAL |
| Discharge -> Patient Timeline | Not executed in this sprint | PARTIAL |

## Operational Status Audit

Only modules with verified end-to-end workflow evidence are marked READY.

| Module | Status | Notes |
|---|---|---|
| Patient Management | PARTIAL | Patient 360 and lookup work; full registration workflow was not re-run in this sprint. |
| Doctors | PARTIAL | Doctor lookup and prescription handoff evidence exists; consultation flow was not re-run end-to-end here. |
| OP | PARTIAL | Existing appointment/consultation records are visible; full OP journey not re-executed. |
| IP | PARTIAL | Lookup integration applies; admission/discharge was not validated in this sprint. |
| Lab | PARTIAL | Lab order/result visibility is corrected and validated; complete collect/process/approve/release was not re-run. |
| Pharmacy | PARTIAL | Dispensing counter and prescription queue are corrected; returns workflow remains outstanding. |
| Billing | PARTIAL | Existing billing integration is preserved; no new payment execution in this sprint. |
| Finance | PARTIAL | Finance receives billing/payment data through existing records; detailed finance workflow not re-run. |

## Verification Commands

Build:

```bash
npm run build
```

Runtime:

```bash
pm2 restart tottech-one --update-env
```

API validation:

```bash
GET /api/clinical/patient-lookup?q=Journey
GET /api/clinical/hms/patient-360/526
GET /api/clinical/operations/pharmacy-dispense?status=ALL&q=Journey
GET /api/clinical/operations/lab-results?patient_id=526
```

## Files Changed

- `app/api/clinical/patient-lookup/route.ts`
- `components/clinical/ClinicalPatientLookup.tsx`
- `components/clinical/Phase2OperationalPage.tsx`
- `app/clinical-services/operations/page.tsx`
- `app/clinical-services/doctors/page.tsx`
- `app/clinical-services/pharmacy/page.tsx`
- `app/api/clinical/operations/pharmacy-dispense/route.ts`
- `app/api/clinical/hms/patient-360/[id]/route.ts`
- `app/clinical-services/patients/[id]/page.tsx`

## Current Conclusion

The sprint corrected the highest-impact visibility and handoff gaps without creating parallel modules. The platform now supports patient-name-first lookup across operational workflows, shows released lab values inside Patient 360, and presents pharmacy as an actual prescription dispensing counter instead of a generic module.

The remaining gaps are workflow-completion gaps, not screen-creation gaps:

- Pharmacy returns
- Full re-execution of billing/payment
- IP admission/discharge validation
- Finance reconciliation validation
