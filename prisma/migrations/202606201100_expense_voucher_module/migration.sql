-- Expense voucher and payment disbursement support.

ALTER TABLE school_expenses
  ADD COLUMN IF NOT EXISTS voucher_number VARCHAR(120),
  ADD COLUMN IF NOT EXISTS voucher_date DATE,
  ADD COLUMN IF NOT EXISTS paid_to VARCHAR(255),
  ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS payee_address TEXT,
  ADD COLUMN IF NOT EXISTS amount_in_words TEXT,
  ADD COLUMN IF NOT EXISTS purpose TEXT,
  ADD COLUMN IF NOT EXISTS remarks TEXT,
  ADD COLUMN IF NOT EXISTS supporting_documents JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS voucher_status VARCHAR(40) DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS receiver_signed_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_school_expenses_voucher_scope
  ON school_expenses(school_id, academic_year_id, voucher_status, voucher_date);

CREATE UNIQUE INDEX IF NOT EXISTS uq_school_expenses_voucher_number
  ON school_expenses(school_id, COALESCE(voucher_number, ''))
  WHERE voucher_number IS NOT NULL AND voucher_number <> '';
