CREATE TABLE IF NOT EXISTS document_number_sequences (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  document_type VARCHAR(80) NOT NULL,
  year_suffix VARCHAR(12) NOT NULL,
  current_sequence INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (school_id, document_type, year_suffix)
);

CREATE INDEX IF NOT EXISTS idx_document_number_sequences_school_type_year
  ON document_number_sequences(school_id, document_type, year_suffix);

ALTER TABLE school_expenses
  ALTER COLUMN voucher_number SET DEFAULT NULL;

UPDATE school_expenses
SET voucher_number = NULL
WHERE voucher_number = '';
