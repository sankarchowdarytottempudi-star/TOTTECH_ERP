# Subscription Management Report

Date: 2026-06-19

## Plans Supported

- IVF_ONLY
- CLINICAL_PRO
- ENTERPRISE
- CUSTOM

## Access Rules

Super Admin roles can modify licensing:

- `tottech_super_admin`
- `clinical_super_admin`
- `organization_admin`

Hospital Admin can view licensing but cannot modify it:

- `hospital_admin`

## Runtime Behavior

When a hospital has a module disabled:

- Sidebar item is hidden.
- Mobile shortcut is hidden.
- Direct page navigation is blocked.
- API returns `403 Module Not Licensed`.

## Validation Scenarios

Recommended validation setup:

- Hospital A: IVF only
- Hospital B: IVF + Lab + Pharmacy + Billing
- Hospital C: Enterprise/all modules

Expected results:

- Hospital A sees IVF workflows and cannot access Lab/Pharmacy/Billing routes unless enabled.
- Hospital B sees IVF, Lab, Pharmacy and Billing.
- Hospital C sees all modules.

## Build Validation

- `npx prisma generate`: passed.
- `npm run build`: passed.
