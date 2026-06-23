CREATE INDEX IF NOT EXISTS idx_patients_clinical_search
  ON patients (tenant_id, hospital_id, branch_id, is_deleted, uhid, patient_uid, phone);

CREATE INDEX IF NOT EXISTS idx_patients_clinical_name_search
  ON patients (tenant_id, hospital_id, branch_id, is_deleted, first_name, last_name);

CREATE INDEX IF NOT EXISTS idx_appointments_clinical_search
  ON appointments (tenant_id, hospital_id, branch_id, is_deleted, patient_id, doctor_id, appointment_date, status);

CREATE INDEX IF NOT EXISTS idx_lab_orders_clinical_search
  ON lab_orders (tenant_id, hospital_id, branch_id, is_deleted, patient_id, doctor_id, status);

CREATE INDEX IF NOT EXISTS idx_billing_invoices_clinical_search
  ON billing_invoices (tenant_id, hospital_id, branch_id, is_deleted, patient_id, invoice_number, status);

CREATE INDEX IF NOT EXISTS idx_payments_clinical_search
  ON payments (tenant_id, hospital_id, branch_id, is_deleted, patient_id, receipt_number, payment_number, payment_mode);

CREATE INDEX IF NOT EXISTS idx_ivf_cycles_clinical_search
  ON ivf_cycles (tenant_id, hospital_id, branch_id, is_deleted, couple_id, patient_id, cycle_number, status);

CREATE INDEX IF NOT EXISTS idx_ivf_embryos_clinical_search
  ON ivf_embryos (tenant_id, hospital_id, branch_id, is_deleted, couple_id, cycle_id, patient_id, embryo_id, current_status);

CREATE INDEX IF NOT EXISTS idx_ivf_fertilization_records_clinical_search
  ON ivf_fertilization_records (tenant_id, hospital_id, branch_id, is_deleted, couple_id, cycle_id, patient_id, embryo_record_id, status);

CREATE INDEX IF NOT EXISTS idx_clinical_pharmacy_dispenses_search
  ON clinical_pharmacy_dispenses (tenant_id, hospital_id, branch_id, is_deleted, patient_id, prescription_id, dispense_status);
