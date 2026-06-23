# TOTTECH ONE HMS Security Certification Report

Generated: 2026-06-09

## Certification Status

Status: **Conditionally Certified**

The system has the right security foundations but requires final execution evidence before certification for a live hospital.

## Verified Security Foundations

- Clinical users are separated by `isClinicalServicesEmail` and clinical profile context.
- Clinical context provides:
  - `tenantId`
  - `hospitalId`
  - `branchId`
  - `clinicId`
  - role metadata
  - branding metadata
- Core production routes use `requireClinicalContext`.
- Many normalized APIs enforce:
  - `tenant_id`
  - `hospital_id`
  - `branch_id`
- Audit helper writes to `clinical_audit_events`.
- Role permission tables exist.
- Role permission audit route exists.
- Tenant security audit route exists.

## Security Risks

- Not every generic clinical route has been manually certified line-by-line.
- Notification delivery must avoid PHI leakage.
- QR payloads must remain verification references, not medical data dumps.
- Doctor signature URL needs integrity controls.
- Backup files must be encrypted or protected by filesystem permissions.
- Existing npm audit reports 6 vulnerabilities from dependency scan; no force upgrade was applied.

## Security Acceptance Status

- Tenant isolation foundation: WORKING
- Branch isolation foundation: WORKING
- Audit logging foundation: WORKING
- RBAC foundation: PARTIAL
- ABAC/data masking: PARTIAL
- Break-glass evidence: PARTIAL
- Secure notification delivery: PARTIAL
- Backup access control: PARTIAL

## Execution Evidence

- Role permission audit endpoint returned `WORKING`.
- Tenant security audit endpoint returned `WORKING`.
- Demo Hospital A could not query Demo Hospital B patient under Hospital A scope.
- Clinical context bug in organization join was fixed so tenant/hospital/branch context resolves correctly for newly created demo tenants.

## Certification Decision

Do not certify as fully live-hospital ready until:

1. Authenticated tenant security audit shows zero high severity isolation findings.
2. Role permission audit shows no orphan permissions.
3. Notification queue is implemented and tested without secret/PHI leakage.
4. Backup script permissions and restore procedure are tested.
5. Multi-tenant demo proves Hospital A cannot access Hospital B data.
