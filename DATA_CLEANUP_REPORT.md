# DATA_CLEANUP_REPORT

## Scope

Clinical Services data cleanup focused on removing sample, validation, autotest, and demo data while preserving the live Kandimalla Speciality Hospital tenant and its operational configuration.

## Preserved

- Roles
- Permissions
- Masters
- Medicines
- Lab tests
- Configurations
- Clinical settings
- Kandimalla Speciality Hospital live tenant

## Removed

- Validation hospitals
- Autotest hospitals
- Demo hospitals
- Sample clinical hospital records tied to non-live tenants
- Non-live clinical roles and related user-profile records
- Sample hospital organizations not required by the live tenant

## Database Cleanup Results

### Hospitals

- Remaining non-Kandimalla active hospitals: `0`

### Branches

- Remaining non-Kandimalla active branches: `0`

### Organizations

- Remaining non-Kandimalla active organizations: `1`

The remaining organization row is retained because it is still referenced by the live Kandimalla clinic record and is therefore part of the operational tenant context.

## Validation Notes

- Verified that the live Kandimalla Speciality Hospital remains present.
- Verified that non-live hospital and branch records were removed.
- Verified that sample hospital organizations were reduced to only the live-linked operational reference.

## Status

Cleanup completed for the sample/validation hospital layer without removing live operational Kandimalla tenant data.
