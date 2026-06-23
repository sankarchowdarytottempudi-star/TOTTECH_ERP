# Clinical RBAC Test Report

Generated: 2026-06-07 17:43 CEST

## Evidence

Clinical roles present:

| Role Count | Evidence |
|---:|---|
| 14 | `clinical_roles` contains `clinical_super_admin`, `organization_admin`, `clinic_admin`, `receptionist`, `doctor`, `ivf_specialist`, `embryologist`, `nurse`, `lab_technician`, `radiologist`, `pharmacist`, `billing_executive`, `patient_support`, `auditor` |

Each listed role currently has 8 permission keys in its permissions JSON.

Access tests:

| Test | Result |
|---|---|
| No cookie to `/api/clinical/dashboard` | Blocked by middleware, HTTP 307 to `/login` |
| Clinical super admin context | WORKING |
| Wrong branch context `branch_id=999` | Blocked, HTTP 401 |

## Findings

| Requirement | Status | Evidence |
|---|---|---|
| Role table exists | WORKING | `clinical_roles` present |
| User profile mapped to role | WORKING | `clinical_user_profiles` maps user 3 to role 1 |
| Tenant/hospital/branch context resolves | WORKING | `/api/clinical/context` response |
| Anonymous access blocked | WORKING | HTTP 307 to `/login` |
| Wrong branch access blocked | WORKING | HTTP 401 |
| Per-action permissions enforced on every endpoint | PARTIAL | APIs load context but most create/update/delete handlers do not check a module/action permission before executing |
| Record-level doctor/nurse/lab scoping | PARTIAL/MISSING | No complete assigned-patient or assigned-ward enforcement proof found |
| Field-level masking | PARTIAL/MISSING | Sensitive fields exist; field masking is not proven across patient screens/API |
| Export reason/audit workflow | PARTIAL/MISSING | Not validated in this sprint |
| MFA controls | MISSING | Not validated in this sprint |

## RBAC Conclusion

Clinical RBAC is **not hospital-grade yet**. Authentication and branch isolation work, but action-level, record-level, field-level, export, and MFA controls must be enforced before security sign-off.
