WITH ranked_current_years AS (
    SELECT
        id,
        row_number() OVER (
            PARTITION BY school_id
            ORDER BY start_date DESC NULLS LAST, id DESC
        ) AS rn
    FROM academic_years
    WHERE is_current IS TRUE
)
UPDATE academic_years ay
SET is_current = false
FROM ranked_current_years ranked
WHERE ay.id = ranked.id
  AND ranked.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS uq_academic_year_one_current_per_school
ON academic_years (school_id)
WHERE is_current IS TRUE;

INSERT INTO event_ledger (
    school_id,
    module_name,
    event_type,
    action,
    entity_type,
    severity,
    summary,
    payload
)
VALUES (
    NULL,
    'academic-year',
    'ACADEMIC_YEAR_CURRENT_GUARD_APPLIED',
    'repair',
    'school',
    'INFO',
    'Recovery migration enforced one current academic year per school.',
    '{"source":"recovery-migration"}'::jsonb
);
