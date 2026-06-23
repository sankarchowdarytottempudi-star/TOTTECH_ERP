# PF ECR Implementation Plan

## Scope
- Convert the existing HRMS PF guidance page into an operational PF workspace.
- Store employee PF profile fields in `hr_staff_master`.
- Add a monthly PF ledger table for payroll/ECR generation.
- Provide preview and export flows for PF ECR outputs.
- Preserve EPFO compliance disclaimers and redirect users to the official EPFO portals.

## Backend Work
- Extend Prisma schema with PF profile fields and `hr_pf_ledgers`.
- Add migration for PF profile columns and PF ledger table.
- Add PF workspace API:
  - dashboard metrics
  - PF profile list
  - PF profile update
- Add PF ECR API:
  - preview ledger generation
  - TXT export
  - XLSX export
  - PDF summary export
- Add UAN validation and duplicate prevention.
- Add event ledger entries for PF profile updates, ledger creation, portal opens, and ECR downloads.

## Frontend Work
- Replace the guidance-only PF page with a live workspace.
- Add PF dashboard KPI cards.
- Add PF profile edit form.
- Add PF register table.
- Add monthly PF ledger/ECR controls.
- Add EPFO portal shortcut buttons.

## Validation
- Verify PF page loads without errors.
- Update a PF profile and confirm persistence.
- Generate a PF ledger preview and confirm summary values.
- Export TXT, Excel, and PDF summary files.
- Confirm EPFO portal redirects work.
- Validate database rows for PF profile updates and ledger creation.

