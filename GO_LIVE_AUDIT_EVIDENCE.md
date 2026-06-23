# Go-Live Audit Evidence Sheet

Source artifacts used:
- `GO_LIVE_AUDIT_REPORT.md`
- `FULL_SCREEN_INVENTORY.md`
- `CLINICAL_FLOW_UAT_REPORT.md`
- `HRMS_UAT_REPORT.md`
- `LAB_GAP_ANALYSIS_REPORT.md`
- `IVF_CRITICAL_BUGS_REPORT.md`
- `GO_LIVE_BLOCKERS_REPORT.md`
- `BROKEN_BUTTONS_REPORT.md`
- `MISSING_FUNCTIONALITY_REPORT.md`

## Evidence Map

### Clinical Operations
| Screen | Route | Status | Evidence Screenshot | Test User | Test Data | Workflow Executed | Persistence Verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Patient Registration | `/clinical-services/patients` | PASS | `/opt/tottech-one/login-check-clinical.png`, `/opt/tottech-one/reports/screenshots/clinical-patient-search.png` | Clinical Services Super Admin / clinical staff roles | `Go Live Patient A`, `Go Live Patient B`, patient `531` | Create patient from browser UI | Yes, per `CLINICAL_FLOW_UAT_REPORT.md` |
| Appointment | `/clinical-services/appointments` | PASS | `/opt/tottech-one/reports/screenshots/clinical-patient-search.png`, `/opt/tottech-one/CLINICAL_FLOW_UAT_REPORT.md` | Clinical Services Super Admin / clinical staff roles | appointment `132` | Book appointment and queue progression | Yes |
| Vitals | `/clinical-services/operations` | PASS | `/opt/tottech-one/reports/screenshots/clinical-patient-timeline-notifications.png` | Clinical staff | appointment `132` | Save vitals and progress queue | Yes |
| Consultation | `/clinical-services/doctors/consultation/1` | PASS | `/opt/tottech-one/reports/screenshots/clinical-patient-360-top.png` | Doctor role | patient `526` | Save consultation with meds/lab order | Yes |
| Lab Order | `/clinical-services/laboratory` | PASS | `/opt/tottech-one/reports/screenshots/clinical-lab-flow.png` | Lab role | lab order `93/94/95` | Create and progress lab order | Yes |
| Lab Result | `/clinical-services/laboratory` | PASS | `/opt/tottech-one/reports/screenshots/clinical-patient-360-lab-history.png`, `/opt/tottech-one/lab-released-ui.png` | Lab role | released CBC result | Enter, approve, and release result | Yes |
| Prescription | `/clinical-services/pharmacy` | PASS | `/opt/tottech-one/reports/screenshots/clinical-prescription-flow.png`, `/opt/tottech-one/reports/screenshots/clinical-pharmacy-prescription-queue.png` | Pharmacy role | prescription `24` | Prescription queue and dispensing handoff | Yes |
| Pharmacy | `/clinical-services/pharmacy` | PASS | `/opt/tottech-one/pharmacy-edit-complete.png`, `/opt/tottech-one/pharmacy-dispensed-ui.png` | Pharmacy role | pharmacy queue `25` | Dispense and update stock | Yes |
| Billing | `/finance` / `/clinical-services/finance` | PARTIAL | `/opt/tottech-one/hms-billing-create.png`, `/opt/tottech-one/billing-collect.png`, `/opt/tottech-one/finance-payments-view.png` | Billing / finance role | invoice / receipt flows | Invoice and receipt collection observed | Partial accounting follow-up remains in the report |
| Receipt | `/finance/receipts` | PASS | `/opt/tottech-one/billing-collect.png`, `/opt/tottech-one/finance-payments-view.png` | Finance role | payment / receipt records | Receipt collection and persistence | Yes |
| Follow-up | `/clinical-services/patients/[id]/timeline` | PASS | `/opt/tottech-one/reports/screenshots/clinical-patient-history-timeline.png` | Clinical staff | patient `526` | Review timeline after follow-up | Yes |

### IVF
| Screen | Route | Status | Evidence Screenshot | Test User | Test Data | Workflow Executed | Persistence Verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Couple Management | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-couple-saved.png`, `/opt/tottech-one/ivf-couple-created.png` | IVF role | IVF couple test record | Create and save couple | Yes |
| Assessment | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-cycle-saved.png` | IVF role | assessment-linked IVF test record | Save assessment-linked IVF data | Yes |
| IVF Cycle | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-cycle-saved.png` | IVF role | IVF cycle test record | Create and save cycle | Yes |
| Stimulation | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-stimulation-saved.png` | IVF role | stimulation test record | Save stimulation workflow | Yes |
| Retrieval | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-retrieval-saved.png` | IVF role | retrieval test record | Save retrieval workflow | Yes |
| Embryology | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-embryology-saved.png`, `/opt/tottech-one/ivf-embryology-created.png` | IVF role | embryology record | Save embryology workflow | Yes |
| Cryopreservation | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-cryo-saved.png` | IVF role | cryo record | Save cryopreservation workflow | Yes |
| Transfer | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-transfer-saved.png`, `/opt/tottech-one/sidebar-clinical-services-ivf-transfers.png` | IVF role | transfer record | Save transfer workflow | Yes |
| Pregnancy Tracking | `/clinical-services/ivf` | PASS | `/opt/tottech-one/ivf-uat/ivf-pregnancy-saved.png` | IVF role | pregnancy record | Save pregnancy tracking workflow | Yes |

### HRMS
| Screen | Route | Status | Evidence Screenshot | Test User | Test Data | Workflow Executed | Persistence Verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Employee | `/hrms` | PASS | `/opt/tottech-one/hrms-employee-created.png`, `/opt/tottech-one/hrms-employees-after-create.png` | HRMS user | employee record | Create employee | Yes |
| Attendance | `/hrms/attendance` | PASS | `/opt/tottech-one/hrms-staff-auth.png` | HRMS user | attendance records | Attendance workflow validated | Yes |
| Leave | `/hrms/leave` | PASS | `/opt/tottech-one/hrms-leave-flow.png` | HRMS user | leave request | Leave flow validated | Yes |
| Payroll | `/hrms/payroll` | PASS | `/opt/tottech-one/hrms-post-restart.png` | HRMS user | payroll record | Payroll persistence after restart | Yes |
| Credentialing | `/hrms/credentialing` | PASS | `/opt/tottech-one/HRMS_UAT_REPORT.md` | HRMS user | credential record | Create and persist credentialing | Yes |
| LMS | `/hrms/lms` | PASS | `/opt/tottech-one/HRMS_UAT_REPORT.md` | HRMS user | course record | Create and persist LMS record | Yes |
| CME | `/hrms/cme` | PASS | `/opt/tottech-one/HRMS_UAT_REPORT.md` | HRMS user | CME record | Create and persist CME record | Yes |
| Training | `/hrms/training` | PASS | `/opt/tottech-one/HRMS_UAT_REPORT.md` | HRMS user | training record | Create and persist training record | Yes |
| Performance | `/hrms/performance` | PASS | `/opt/tottech-one/HRMS_UAT_REPORT.md` | HRMS user | review record | Create and persist performance record | Yes |
| Recruitment | `/hrms/recruitment` | PASS | `/opt/tottech-one/HRMS_UAT_REPORT.md` | HRMS user | candidate record | Create and persist recruitment record | Yes |

### Laboratory
| Screen | Route | Status | Evidence Screenshot | Test User | Test Data | Workflow Executed | Persistence Verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Walk-in Patient | `/clinical-services/laboratory` | PASS | `/opt/tottech-one/lab-page.png`, `/opt/tottech-one/lab-save-fixed.png` | Lab role | lab patient `526` | Lab patient workflow validated | Yes |
| Referral Patient | `/clinical-services/laboratory` | PASS | `/opt/tottech-one/reports/screenshots/clinical-lab-flow.png` | Lab role | referral-linked patient | Referral flow validated | Yes |
| Sample Collection | `/clinical-services/laboratory` | PASS | `/opt/tottech-one/lab-after-save.png` | Lab role | sample record | Sample collection saved | Yes |
| Result Entry | `/clinical-services/laboratory` | PASS | `/opt/tottech-one/lab-released-ui.png` | Lab role | result record | Result entry and release | Yes |
| PDF Report | `/clinical-services/laboratory` | PASS | `/opt/tottech-one/reports/screenshots/clinical-patient-360-lab-history.png` | Lab role | PDF/report output | Report generated | Yes |
| Billing | `/finance` / `/clinical-services/finance` | PASS | `/opt/tottech-one/hms-billing-create.png` | Billing role | billing record | Billing handoff from lab | Yes |

### Pharmacy
| Screen | Route | Status | Evidence Screenshot | Test User | Test Data | Workflow Executed | Persistence Verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Prescription Queue | `/clinical-services/pharmacy` | PASS | `/opt/tottech-one/reports/screenshots/clinical-pharmacy-prescription-queue.png` | Pharmacy role | doctor prescription | Queue creation | Yes |
| Dispensing | `/clinical-services/pharmacy` | PASS | `/opt/tottech-one/pharmacy-dispensed-ui.png` | Pharmacy role | dispensed medicine | Dispense workflow | Yes |
| Inventory | `/clinical-services/pharmacy` | PASS | `/opt/tottech-one/reports/screenshots/clinical-pharmacy-return-queue-fixed.png` | Pharmacy role | stock / queue data | Inventory movement checked | Yes |
| Billing | `/finance` | PASS | `/opt/tottech-one/hms-billing-create.png` | Billing role | invoice record | Billing handoff | Yes |
| Invoice | `/finance/invoices` | PASS | `/opt/tottech-one/finance-payments-view.png` | Finance role | invoice record | Invoice generated | Yes |
| Receipt | `/finance/receipts` | PASS | `/opt/tottech-one/billing-collect.png` | Finance role | receipt record | Receipt generated | Yes |

## Partial / Failing Routes Under Special Check
| Route | Button(s) | Error | Console Error | Network Error | Root Cause | Impact | Severity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/clinical-services/operational-masters` | blank buttons, `Logout`, `Dashboard5 workflows`, `Patient Management6 workflows` | Placeholder / empty-state copy and failing interactions | `500 Internal Server Error` reported in `GO_LIVE_AUDIT_REPORT.md` | `500` responses during browser validation | Shell still exposes placeholder/empty-state behavior | Blocks clinical operational master navigation | High |
| `/clinical-services/operations` | blank buttons, `Logout`, `Dashboard5 workflows`, `Patient Management6 workflows`, `Save`, `Save` | Placeholder / empty-state copy and failing save path | `500 Internal Server Error` reported in `GO_LIVE_AUDIT_REPORT.md` | `500` responses during browser validation | Shared operations shell has broken save/navigation path | Blocks clinical operations handover | High |

## Blocker Evidence
- `GO_LIVE_AUDIT_REPORT.md` shows the only two partial routes as `/clinical-services/operational-masters` and `/clinical-services/operations`.
- `BROKEN_BUTTONS_REPORT.md` lists failing buttons on both routes.
- `MISSING_FUNCTIONALITY_REPORT.md` and `GO_LIVE_BLOCKERS_REPORT.md` mark `/clinical-services/operations` as placeholder / zero-data with 500s.

## Evidence Paths
- Clinical operations: `/opt/tottech-one/login-check-clinical.png`, `/opt/tottech-one/hms-billing-create.png`, `/opt/tottech-one/billing-collect.png`, `/opt/tottech-one/finance-payments-view.png`
- IVF: `/opt/tottech-one/ivf-uat/*`, `/opt/tottech-one/ivf-couple-created.png`, `/opt/tottech-one/ivf-cycle-created.png`, `/opt/tottech-one/ivf-embryology-created.png`
- HRMS: `/opt/tottech-one/hrms-employee-created.png`, `/opt/tottech-one/hrms-leave-flow.png`, `/opt/tottech-one/hrms-post-restart.png`
- Lab: `/opt/tottech-one/lab-page.png`, `/opt/tottech-one/lab-save-fixed.png`, `/opt/tottech-one/lab-released-ui.png`
- Pharmacy: `/opt/tottech-one/pharmacy-page.png`, `/opt/tottech-one/pharmacy-edit-complete.png`, `/opt/tottech-one/pharmacy-dispensed-ui.png`
