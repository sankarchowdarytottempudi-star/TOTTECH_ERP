# TOTTECH ONE HMS Performance Certification Report

Generated: 2026-06-09

## Certification Status

Status: **Partial**

## Verified Indexes

Important indexes found:

- `patients`: tenant/clinic and tenant/hospital/branch indexes.
- `appointments`: scope/date/status indexes.
- `patient_timeline_events`: tenant/hospital/branch/patient/date index and duplicate prevention index.
- `billing_invoices`: tenant/hospital/branch/patient/status indexes.
- `billing_invoice_items`: invoice index.
- `lab_orders`: scope and consultation-related indexes.
- `lab_results`: lab order index.
- `document_repository`: tenant/hospital/branch/patient/document type index.
- `admissions`, `icu_admissions`, `ot_schedules`: scope indexes.
- `pharmacy_stock`: scope/medicine/status index.

## Performance Risks

- `payments` and `refunds` need stronger tenant/hospital/branch/date indexes for finance reports.
- Generic pages may read broad datasets if pagination is not enforced.
- Analytics/spec tables are very numerous; broad registry reads must remain paginated.
- PDF generation is synchronous per request and should be acceptable for single document downloads, but bulk PDF generation should become queued.
- Notification queue should be processed asynchronously.

## Recommended Optimizations

Only necessary optimizations:

1. Add `payments(tenant_id,hospital_id,branch_id,payment_date,is_deleted)` index.
2. Add `refunds(tenant_id,hospital_id,branch_id,created_at,is_deleted)` index.
3. Add `insurance_claims(tenant_id,hospital_id,branch_id,status,submission_date,is_deleted)` if not already sufficient.
4. Ensure timeline APIs always paginate.
5. Keep PDF generation per document, not bulk synchronous.

## Certification Decision

Performance is acceptable for demo/UAT and small live pilots. Payment/refund/insurance finance indexes were added in the final completion migration. Larger hospital go-live should still include load testing and pagination validation.
