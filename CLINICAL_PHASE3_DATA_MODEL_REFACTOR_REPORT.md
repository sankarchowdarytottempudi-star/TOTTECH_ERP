# Clinical Services Phase 3 Data Model Refactoring Report

Generated: 2026-06-09

## Objective

Replace generic clinical workflow storage with normalized healthcare domain entities.

The Phase 2 UI remains available, but the API no longer persists core healthcare workflow data into `clinical_phase2_records`.

## Migrations Added

- `prisma/migrations/202606091910_clinical_phase3_normalized_healthcare_model/migration.sql`
- `prisma/migrations/202606091925_clinical_phase3_legacy_table_alignment/migration.sql`

## Normalized Tables Available

Patient domain:

- `patients`
- `patient_visits`
- `patient_allergies`
- `patient_documents`
- `patient_contacts`

Consultation domain:

- `consultations`
- `consultation_diagnoses`
- `consultation_prescriptions`
- `consultation_lab_orders`
- `consultation_radiology_orders`

Lab domain:

- `lab_orders`
- `lab_samples`
- `lab_results`
- `lab_result_approvals`

Pharmacy domain:

- `pharmacy_stock`
- `pharmacy_batches`
- `pharmacy_dispensing`
- `pharmacy_purchase_orders`

Nursing domain:

- `nursing_vitals`
- `nursing_notes`
- `medication_administration_records`
- `shift_handovers`

IPD domain:

- `admissions`
- `bed_allocations`
- `bed_transfers`
- `discharges`

OT domain:

- `ot_schedules`
- `ot_procedures`
- `ot_staff_assignments`

ICU domain:

- `icu_admissions`
- `icu_monitoring`
- `ventilator_tracking`

IVF domain:

- `ivf_cycles`
- `ivf_stimulation`
- `ivf_monitoring`
- `ivf_egg_retrievals`
- `ivf_embryos`
- `ivf_transfers`
- `ivf_cryostorage`

Inventory domain:

- `inventory_items`
- `inventory_transactions`
- `inventory_issues`
- `inventory_returns`

## Repository / Service Layer

Created:

- `lib/clinical/phase3-domain-storage.ts`

This repository maps existing operational UI modules to normalized tables:

- `nursing` -> `nursing_vitals`, `nursing_notes`, `medication_administration_records`, `shift_handovers`
- `consultations` -> `consultations`, `consultation_diagnoses`, `consultation_prescriptions`, `consultation_lab_orders`
- `laboratory` -> `lab_orders`, `lab_samples`, `lab_results`, `lab_result_approvals`
- `radiology` -> `consultation_radiology_orders`
- `bed-management` -> `bed_allocations`
- `ipd` -> `admissions`, `bed_allocations`, `nursing_notes`, `discharges`
- `ot` -> `ot_schedules`, `ot_procedures`, `ot_staff_assignments`
- `icu` -> `icu_admissions`, `icu_monitoring`, `ventilator_tracking`
- `ivf` -> `ivf_cycles`, `ivf_stimulation`, `ivf_embryos`, `ivf_cryostorage`
- `pharmacy` -> `pharmacy_stock`, `pharmacy_batches`, `pharmacy_purchase_orders`, `pharmacy_dispensing`
- `inventory` -> `inventory_items`, `inventory_transactions`, `inventory_issues`

## API Refactor

Updated:

- `app/api/clinical/phase2/[module]/route.ts`

Behavior now:

- `GET` reads from normalized domain tables.
- `POST` creates normalized domain entities and child records.
- `PATCH` updates normalized domain entities and refreshes related child rows.
- `DELETE` soft-deletes normalized domain entities.
- `GET ?export=csv` exports normalized records.

The API still exposes the same route to preserve the current UI, but storage is no longer generic.

## Data Integrity

Implemented:

- Tenant isolation through `tenant_id`
- Hospital isolation through `hospital_id`
- Branch isolation through `branch_id`
- Patient foreign keys where applicable
- Doctor foreign keys where applicable
- Medicine foreign keys where applicable
- Lab test foreign keys where applicable
- Room foreign keys where applicable
- Parent-child relationships for consultations, lab, nursing, IPD, OT, ICU, IVF, pharmacy, and inventory
- Soft delete for operational records
- Audit logging through `clinical_audit_events`

## Generic Storage Status

The previous table:

- `clinical_phase2_records`

is retained only as historical/rollback compatibility. The Phase 3 operational API no longer writes new core healthcare data to this generic table.

## Validation

Commands run:

- Applied both SQL migrations with `psql`
- Granted app DB user access to new tables and sequences
- Verified all 41 normalized tables exist
- `npx tsc --noEmit --pretty false`
- `npm run build`

Result:

- TypeScript passed
- Production build passed

## Production Note

The current UI is preserved intentionally. The major change is the backend persistence architecture: operational healthcare records now land in domain-specific relational tables instead of generic JSON workflow storage.
