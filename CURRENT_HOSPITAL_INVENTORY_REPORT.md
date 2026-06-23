# CURRENT_HOSPITAL_INVENTORY_REPORT

## Live Clinical Hospital Baseline

| ID | Hospital Name | Code | Status | Deleted |
|---:|---|---|---|---|
| 36 | Kandimalla Speciality Hospital | KSH | ACTIVE | f |

## Live Branches

| ID | Hospital ID | Branch Name | Code | Status | Deleted |
|---:|---:|---|---|---|---|
| 31 | 36 | Kandimalla Speciality Hospital Main Branch | KSH-MAIN | ACTIVE | f |

## Live Clinics

| ID | Hospital ID | Branch ID | Clinic Name | Clinic Code | Type | Deleted |
|---:|---:|---:|---|---|---|---|
| 27 | 36 | 31 | Kandimalla Speciality Hospital | KSH-HMS | HMS | f |

## Live Hospital Subscription

| ID | Plan | Status |
|---:|---|---|
| 19 | STANDARD | ACTIVE |

## Enabled Module Entitlements

Enabled modules: **20**

| Module Code | Enabled |
|---|---|
| AI | t |
| ANALYTICS | t |
| APPOINTMENTS | t |
| BILLING | t |
| ER | t |
| FINANCE | t |
| HR | t |
| ICU | t |
| INSURANCE | t |
| INVENTORY | t |
| IP | t |
| IVF | t |
| LAB | t |
| OP | t |
| OT | t |
| PATIENTS | t |
| PHARMACY | t |
| PROCUREMENT | t |
| RADIOLOGY | t |
| REFERRAL | t |

## Summary

- Active hospitals: **1**
- Active branches: **1**
- Active clinics: **1**
- Live hospital-scoped user profiles: **2**
- Live hospital-scoped clinical users: **2**

## Verification

- Kandimalla Speciality Hospital remains the only active clinical hospital in scope.
- The live branch and clinic remain linked to hospital 36.
- Module entitlements remain enabled for the live hospital context.
