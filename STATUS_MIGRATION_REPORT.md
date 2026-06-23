# Status Migration Report

Date: 2026-06-13

## Summary

Existing free-text status values were migrated into controlled status codes for the most active Clinical Services workflow tables.

## Migration Audit

Audit table:

- `status_migration_audit`

Rows captured:

- 17 mapping rows

Records mapped:

- 232 records

## Tables Migrated

### IVF

- `ivf_couples.status`
- `ivf_female_assessments.status`
- `ivf_male_assessments.status`
- `ivf_cycles.status`
- `ivf_fertilization_records.status`
- `ivf_freezing_records.status`
- `ivf_embryo_transfers.status`

### Laboratory

- `lab_orders.status`

Current validated status distribution:

- `PRESCRIBED`: 19
- `PROCESSING`: 2
- `REPORT_READY`: 49
- `SAMPLE_COLLECTED`: 4

### Billing

- `billing_invoices.status`

Current validated status distribution:

- `DRAFT`: 1
- `GENERATED`: 13
- `PAID`: 128

## Example Mappings

- `Actve`, `ACTIVE`, `active` style values normalize to controlled status codes.
- `Done`, `Finish`, `Finished` style values normalize to `COMPLETED` where supported.
- Legacy IVF embryology `RECORDED` normalizes to `FERTILIZED`.
- Legacy lab terminal states `COMPLETED`, `APPROVED`, `RELEASED` normalize to `REPORT_READY`.
- Legacy billing `OPEN` normalizes to `GENERATED`.
- Legacy billing `PARTIAL` normalizes to `PARTIALLY_PAID`.

## Validation

Post-migration checks confirm core workflow statuses are now using code values instead of mixed free-text labels.

Remaining note:

- Large metadata/catalog/analytics tables still contain their own administrative statuses. The production workflow fix focused on user-operational status entry paths, not registry/catalog maintenance tables.
