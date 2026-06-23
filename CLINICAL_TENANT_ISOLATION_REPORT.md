# Clinical Tenant Isolation Report

Generated: 2026-06-07 17:43 CEST

## Context Resolution

`/api/clinical/context` resolved:

| Field | Value |
|---|---|
| tenantId | 1 |
| hospitalId | 1 |
| branchId | 1 |
| clinicId | 1 |
| roleKey | clinical_super_admin |

## Isolation Evidence

| Test | Status | Evidence |
|---|---|---|
| Correct context request | WORKING | HTTP 200 |
| Invalid branch request | WORKING | `branch_id=999` returned HTTP 401 |
| Core APIs filter by tenant/hospital/branch | WORKING | Patients, doctors, appointments, HMS, IVF, pharmacy, finance, FHIR routes include scope filters |
| Core tables include isolation columns | WORKING | Sampled transactional tables include `tenant_id`, `hospital_id`, `branch_id`, `clinic_id` |

Sampled tables with isolation/audit columns:

- `patients`
- `appointments`
- `doctors`
- `op_visits`
- `ip_admissions`
- `nursing_notes`
- `billing_invoices`
- `insurance_claims`
- `ivf_couples`
- `ivf_cycles`
- `pharmacy_medicines`
- `pharmacy_inventory`
- `clinical_finance_ar_invoices`
- `clinical_interop_fhir_resources`

## Remaining Isolation Risks

| Risk | Status |
|---|---|
| Every one of the 695 `clinical_%` tables was not individually audited | PARTIAL |
| Super admin cross-tenant "all tenants" behavior not validated | PARTIAL |
| Non-super-admin role isolation not validated | PARTIAL |
| Background jobs/report exports tenant scoping not validated | PARTIAL |

## Tenant Isolation Conclusion

Core clinical tenant/hospital/branch isolation is working for the workflows tested. Full platform-wide tenant isolation certification is **partial** until every module, background job, report, export, and non-admin role is tested.
