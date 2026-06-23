-- Clinical Phase 4 tenant/hospital/branch isolation validation.
WITH required_tables(table_name) AS (
  VALUES
    ('patient_timeline_events'),
    ('billing_invoices'),
    ('billing_invoice_items'),
    ('payments'),
    ('refunds'),
    ('insurance_providers'),
    ('insurance_policies'),
    ('insurance_pre_authorizations'),
    ('insurance_claims'),
    ('insurance_settlements'),
    ('document_repository'),
    ('claim_documents')
),
required_columns(column_name) AS (
  VALUES ('tenant_id'), ('hospital_id'), ('branch_id')
),
matrix AS (
  SELECT rt.table_name, rc.column_name
  FROM required_tables rt
  CROSS JOIN required_columns rc
)
SELECT
  matrix.table_name,
  matrix.column_name,
  CASE WHEN c.column_name IS NULL THEN 'MISSING' ELSE 'PRESENT' END AS status
FROM matrix
LEFT JOIN information_schema.columns c
  ON c.table_schema='public'
 AND c.table_name=matrix.table_name
 AND c.column_name=matrix.column_name
ORDER BY matrix.table_name, matrix.column_name;
