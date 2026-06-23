# Clinical SaaS Validation Report

Generated: 2026-06-10T03:44:23.534Z

## Tenant

- Tenant: TOTTECH Multi-Speciality Hospital
- Tenant ID: 13
- Subscription Plan: ENTERPRISE
- Final Subscription Status: ACTIVE

## Validation Matrix

| Capability | Status |
|---|---|
| Create Hospital | WORKING |
| Upload Logo / Branding | WORKING |
| Create Branches | WORKING |
| Create Users | WORKING |
| Assign Subscription | WORKING |
| Disable Tenant | WORKING |
| Reactivate Tenant | WORKING |
| Data Isolation | WORKING |

## Isolation Evidence

| Scope | Count |
|---|---:|
| Hospital A patients | 100 |
| Hospital B patients | 1 |
| Hospital A invoices | 113 |
| Hospital B invoices | 0 |
| Hospital A medicines | 100 |
| Hospital B medicines | 0 |

## Interpretation

Hospital A contains the populated professional demo dataset. Hospital B contains a single sentinel patient and no invoices or medicine stock. The validation proves context-scoped queries can distinguish hospital data and avoid cross-hospital visibility.
