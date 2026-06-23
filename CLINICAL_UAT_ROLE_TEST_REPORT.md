# Clinical Services UAT Role Test Report

Generated: 2026-06-10T03:44:23.534Z

## Scope

- Tenant: TOTTECH Multi-Speciality Hospital (13)
- Hospital: TOTTECH Multi-Speciality Hospital (13)
- Branch: Vijayawada Main Branch (13)
- Clinic: TOTTECH Clinical Services OPD (10)
- Base URL: https://erp.tottechsolutions.com

## Summary

| Role | Status |
|---|---|
| Receptionist | WORKING |
| Doctor | WORKING |
| Nurse | WORKING |
| Lab Technician | WORKING |
| Pharmacist | WORKING |
| Hospital Admin | WORKING |
| Finance User | WORKING |

## Role Findings

## Receptionist

Status: **WORKING**

User: `uat.receptionist@tottechclinical.local`

Daily tasks:

- Register/search patients
- Book appointments
- Collect front-desk payments

| Page | Status | Load ms | Notes | Screenshot |
|---|---|---:|---|---|
| /clinical-services | WORKING | 2660 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/receptionist--clinical-services.png |
| /clinical-services/patients | WORKING | 4216 | Slow page load over 4s | /opt/tottech-one/uat-evidence/clinical-services/receptionist--clinical-services-patients.png |
| /clinical-services/appointments | WORKING | 2405 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/receptionist--clinical-services-appointments.png |
| /clinical-services/finance | WORKING | 1783 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/receptionist--clinical-services-finance.png |

Manual UAT fields to capture from the actual role user:

- Extra clicks
- Missing fields
- Confusing screens
- Slow pages
- Permission issues

## Doctor

Status: **WORKING**

User: `uat.doctor@tottechclinical.local`

Daily tasks:

- Review patient 360
- Consultation
- Prescription
- Lab/radiology orders

| Page | Status | Load ms | Notes | Screenshot |
|---|---|---:|---|---|
| /clinical-services | WORKING | 3371 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/doctor--clinical-services.png |
| /clinical-services/patients | WORKING | 2643 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/doctor--clinical-services-patients.png |
| /clinical-services/doctors | WORKING | 1719 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/doctor--clinical-services-doctors.png |
| /clinical-services/laboratory | WORKING | 3181 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/doctor--clinical-services-laboratory.png |

Manual UAT fields to capture from the actual role user:

- Extra clicks
- Missing fields
- Confusing screens
- Slow pages
- Permission issues

## Nurse

Status: **WORKING**

User: `uat.nurse@tottechclinical.local`

Daily tasks:

- Open patients
- View admissions
- Review ICU cases
- Record vitals workflow

| Page | Status | Load ms | Notes | Screenshot |
|---|---|---:|---|---|
| /clinical-services | WORKING | 2424 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/nurse--clinical-services.png |
| /clinical-services/patients | WORKING | 1767 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/nurse--clinical-services-patients.png |
| /clinical-services/hms/ip | WORKING | 2143 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/nurse--clinical-services-hms-ip.png |
| /clinical-services/hms/icu | WORKING | 1144 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/nurse--clinical-services-hms-icu.png |

Manual UAT fields to capture from the actual role user:

- Extra clicks
- Missing fields
- Confusing screens
- Slow pages
- Permission issues

## Lab Technician

Status: **WORKING**

User: `uat.lab@tottechclinical.local`

Daily tasks:

- Open lab queue
- Review samples
- Submit lab results

| Page | Status | Load ms | Notes | Screenshot |
|---|---|---:|---|---|
| /clinical-services | WORKING | 1896 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/lab-technician--clinical-services.png |
| /clinical-services/laboratory | WORKING | 2087 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/lab-technician--clinical-services-laboratory.png |

Manual UAT fields to capture from the actual role user:

- Extra clicks
- Missing fields
- Confusing screens
- Slow pages
- Permission issues

## Pharmacist

Status: **WORKING**

User: `uat.pharmacist@tottechclinical.local`

Daily tasks:

- Open prescriptions
- Dispense medicines
- Check stock

| Page | Status | Load ms | Notes | Screenshot |
|---|---|---:|---|---|
| /clinical-services | WORKING | 1366 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/pharmacist--clinical-services.png |
| /clinical-services/pharmacy | WORKING | 2675 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/pharmacist--clinical-services-pharmacy.png |

Manual UAT fields to capture from the actual role user:

- Extra clicks
- Missing fields
- Confusing screens
- Slow pages
- Permission issues

## Hospital Admin

Status: **WORKING**

User: `uat.hospital.admin@tottechclinical.local`

Daily tasks:

- Manage setup
- Review users
- Monitor operations

| Page | Status | Load ms | Notes | Screenshot |
|---|---|---:|---|---|
| /clinical-services | WORKING | 4050 | Slow page load over 4s | /opt/tottech-one/uat-evidence/clinical-services/hospital-admin--clinical-services.png |
| /clinical-services/administration | WORKING | 1971 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/hospital-admin--clinical-services-administration.png |
| /clinical-services/security | WORKING | 4102 | Slow page load over 4s | /opt/tottech-one/uat-evidence/clinical-services/hospital-admin--clinical-services-security.png |

Manual UAT fields to capture from the actual role user:

- Extra clicks
- Missing fields
- Confusing screens
- Slow pages
- Permission issues

## Finance User

Status: **WORKING**

User: `uat.finance@tottechclinical.local`

Daily tasks:

- Review invoices
- Collections
- Outstanding receivables
- Daily cash

| Page | Status | Load ms | Notes | Screenshot |
|---|---|---:|---|---|
| /clinical-services | WORKING | 1521 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/finance-user--clinical-services.png |
| /clinical-services/finance | WORKING | 4049 | Slow page load over 4s | /opt/tottech-one/uat-evidence/clinical-services/finance-user--clinical-services-finance.png |
| /clinical-services/billing | WORKING | 1197 | No automated issue detected | /opt/tottech-one/uat-evidence/clinical-services/finance-user--clinical-services-billing.png |

Manual UAT fields to capture from the actual role user:

- Extra clicks
- Missing fields
- Confusing screens
- Slow pages
- Permission issues


## Human UAT Note

This run verifies access, renderability, page timing, obvious broken routes, and placeholder text. The subjective findings requested by the user (extra clicks, missing fields, confusing screens) must be completed by the actual role users during live UAT. Their feedback is intentionally left as a capture checklist on each role.
