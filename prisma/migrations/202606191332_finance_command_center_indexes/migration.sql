CREATE INDEX IF NOT EXISTS idx_invoices_finance_command_center
  ON invoices (school_id, academic_year_id, invoice_date, class_id, section_id, student_id, status);

CREATE INDEX IF NOT EXISTS idx_payments_finance_command_center
  ON payments (school_id, academic_year_id, payment_date, class_id, section_id, student_id);

CREATE INDEX IF NOT EXISTS idx_concession_requests_finance_command_center
  ON concession_requests (school_id, academic_year_id, status, created_at);
