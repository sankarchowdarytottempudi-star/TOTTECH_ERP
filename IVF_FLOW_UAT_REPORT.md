# IVF Flow UAT Report

Generated: 2026-06-20
Environment: https://erp.tottechsolutions.com

## Browser-Validated IVF Workflows
- Couple management
- IVF cycle creation
- Stimulation
- Retrieval
- Embryology / fertilization
- Embryo inventory
- Cryopreservation
- Embryo transfer
- Pregnancy tracking

## Records Created/Updated
- Couple: `2` / `CPL-1781981888781`
- Cycle: `16` / `CYC-1781981995554`
- Stimulation: `1`
- Retrieval: `1`
- Fertilization: `13` / `FER-1781983225813`
- Embryo: `2` / `EMB-1781983225819`
- Cryopreservation: `1` / `CRYO-1781983384812`
- Transfer: `1` / `TRF-1781983236179`
- Pregnancy: `1`

## Status by Module
| Module | Result | Notes |
| --- | --- | --- |
| Couple Management | PASS | Create and record persistence validated. |
| Fertility Assessment | NOT COMPLETELY VALIDATED | No dedicated create/edit run in this pass. |
| IVF Cycle | PASS | Created and visible in UI. |
| Stimulation | PASS | Created successfully from the UI. |
| Retrieval | PASS | Created successfully from the UI. |
| Embryology | PASS | Created successfully from the UI. |
| Embryo Management | PASS | Created successfully from the UI. |
| Cryopreservation | PASS | Create and edit validated; edited location code from `L1` to `L2`. |
| Transfer | PASS | Created successfully from the UI. |
| Pregnancy Tracking | PASS | Created successfully from the UI. |

## Evidence Files
- `/opt/tottech-one/ivf-uat/ivf-couple-saved.png`
- `/opt/tottech-one/ivf-uat/ivf-cycle-saved.png`
- `/opt/tottech-one/ivf-uat/ivf-stimulation-saved.png`
- `/opt/tottech-one/ivf-uat/ivf-retrieval-saved.png`
- `/opt/tottech-one/ivf-uat/ivf-embryology-saved.png`
- `/opt/tottech-one/ivf-uat/ivf-embryos-saved.png`
- `/opt/tottech-one/ivf-uat/ivf-transfer-saved.png`
- `/opt/tottech-one/ivf-uat/ivf-pregnancy-saved.png`
- `/opt/tottech-one/ivf-uat/cryo-saved.png`
- `/opt/tottech-one/ivf-uat/cryo-edit.png`
- `/opt/tottech-one/ivf-uat/ivf-dashboard.png`

## Remaining Gaps
- Full search/view/delete walkthrough for every IVF submodule was not completed in this pass.
- Fertility assessment still needs a dedicated browser create/edit validation.
