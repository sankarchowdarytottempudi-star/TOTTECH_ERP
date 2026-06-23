# HRMS Screen Inventory

Scope: TOTTECH Clinical Services HRMS routes under `/clinical-services/hrms`.

## Inventory

### Landing
- `/clinical-services/hrms`

### Operational Modules
- `/clinical-services/hrms/employees`
- `/clinical-services/hrms/attendance`
- `/clinical-services/hrms/leave`
- `/clinical-services/hrms/payroll`
- `/clinical-services/hrms/credentialing`
- `/clinical-services/hrms/lms`
- `/clinical-services/hrms/cme`
- `/clinical-services/hrms/training`
- `/clinical-services/hrms/performance`
- `/clinical-services/hrms/recruitment`

### Record Detail / Edit
- `/clinical-services/hrms/[module]/[id]`

## UI Controls Observed
- Create
- Search
- Filters
- Grid View
- Card View
- View
- Edit
- Delete
- Export Excel
- Print

## Validation Notes
- The clinical HRMS workspace is now a live operational module surface rather than a database dictionary viewer.
- Main module pages display business labels, operational summaries, search, create, edit, and delete actions.
- No shell-style table-name/column-name viewer was observed on the tested clinical HRMS routes.

