# Clinical UAT Data Report

Audit date: 2026-06-07

Scope: Identification only. No archive, backup, purge, or deletion was performed.

## Executive Result

Status: IDENTIFICATION ONLY

The UAT/test/demo scan found 2,627 matching records across 72 tables. This is not a deletion list yet. Several matches are likely configuration records, permission names, testing requirement records, or other production metadata that merely contain words like `test`, `demo`, or `UAT`.

Because the functional audit did not pass, the pre-production backup and cleanup phases are blocked.

## Cleanup Gate Status

| Gate | Result |
|---|---|
| Functional audit passed | No |
| PRE_PRODUCTION_BACKUP created | No |
| UAT/test/demo records deleted | No |
| Explicit approval requested | Not yet applicable |

## Scan Method

Search pattern:

- `UAT`
- `TEST`
- `DEMO`

Columns scanned:

- Public PostgreSQL `text`
- `varchar`
- `json`
- `jsonb`

## Candidate Records Found

| Table | Matching Records |
|---|---:|
| clinical_security_role_permissions | 1926 |
| patients | 101 |
| clinical_security_permissions | 100 |
| appointments | 75 |
| clinical_audit_events | 67 |
| clinical_dictionary_fields | 54 |
| doctors | 50 |
| clinical_production_technology_stack | 17 |
| clinical_dictionary_constraints | 16 |
| clinical_finance_timeline | 14 |
| clinical_dictionary_indexes | 12 |
| ivf_timeline | 12 |
| ai_knowledge_queries | 11 |
| clinical_production_go_live_checklist | 10 |
| clinical_compliance_uat_cases | 8 |
| ai_knowledge_base | 7 |
| clinical_compliance_go_live_checklists | 6 |
| clinical_interop_fhir_audit | 6 |
| pharmacy_timeline | 6 |
| clinical_production_security_controls | 5 |
| clinical_production_testing_requirements | 5 |
| ai_usage_logs | 4 |
| clinical_analytics_timeline | 4 |
| clinical_dictionary_entities | 4 |
| clinical_interop_fhir_resources | 4 |
| clinical_interop_timeline | 4 |
| clinical_ui_accessibility_rules | 4 |
| event_ledger | 4 |
| clinical_compliance_dr_tests | 3 |
| clinical_compliance_penetration_tests | 3 |
| clinical_finance_accounts | 3 |
| clinical_finance_cash_transactions | 3 |
| clinical_finance_cost_centers | 3 |
| clinical_finance_journal_entries | 3 |
| icu_monitoring_records | 3 |
| ivf_couples | 3 |
| ivf_female_assessments | 3 |
| ivf_male_assessments | 3 |
| ivf_stimulation_records | 3 |
| ot_schedules | 3 |
| pharmacy_medicine_categories | 3 |
| pharmacy_medicines | 3 |
| pharmacy_purchase_orders | 3 |
| pharmacy_retail_sales | 3 |
| pharmacy_vendors | 3 |
| pharmacy_warehouses | 3 |
| clinical_analytics_ai_insights | 2 |
| clinical_analytics_ceo_metrics | 2 |
| clinical_finance_referrals | 2 |
| clinical_interop_hl7_messages | 2 |
| clinical_interop_pacs_studies | 2 |
| clinical_production_backup_policies | 2 |
| clinical_security_data_masks | 2 |
| exam_types | 2 |
| exams | 2 |
| lab_orders | 2 |
| school_timelines | 2 |
| ai_observability_events | 1 |
| clinical_api_catalog_rest_endpoints | 1 |
| clinical_business_report_columns | 1 |
| clinical_business_reports | 1 |
| clinical_compliance_bcm_plans | 1 |
| clinical_compliance_risk_register | 1 |
| clinical_compliance_vulnerabilities | 1 |
| clinical_dictionary_entity_groups | 1 |
| clinical_menu_items | 1 |
| clinical_production_infrastructure_components | 1 |
| clinical_security_approval_workflows | 1 |
| concession_audit_logs | 1 |
| concession_requests | 1 |
| feature_flags | 1 |
| pharmacy_prescription_queue | 1 |

## Records To Remove After Approval

Potential cleanup candidates, pending backup and explicit approval:

- Patients with names, email addresses, phone numbers, UIDs, or metadata containing `UAT`, `TEST`, or `DEMO`.
- Doctors with test/demo identifiers.
- Appointments with reasons such as `UAT Phase 17 consultation`.
- Clinical operational records created only for validation, including related pharmacy, lab, radiology, OP/IP/ICU/OT, IVF, finance, timeline, and audit records.
- Duplicate UAT analytics records and generated UAT events.

## Records To Retain Unless Separately Approved

Do not automatically remove these categories just because the scan matched `test`, `demo`, or `UAT`:

- RBAC permissions and role-permission rows.
- Security controls and data masking configuration.
- Compliance UAT case definitions.
- Production readiness, testing requirement, and go-live checklist records.
- Dictionary/entity metadata and generated schema descriptors.
- AI knowledge base records unless reviewed by content owner.
- Event ledger/audit records required for traceability.
- Feature flags, menu items, and approval workflow definitions.

## Required Next Step

Before any deletion:

1. Close the broken and partial workflow gaps listed in `CLINICAL_WORKFLOW_STATUS_REPORT.md`.
2. Re-run this audit.
3. Confirm 0 broken pages, 0 dead cards, 0 dead links, and 0 broken workflows.
4. Create and verify `PRE_PRODUCTION_BACKUP`.
5. Present a final deletion manifest.
6. Wait for explicit user approval.

No data was deleted.

