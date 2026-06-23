ALTER TABLE ivf_fertilization_records
  ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id),
  ADD COLUMN IF NOT EXISTS embryo_record_id INTEGER REFERENCES ivf_embryos(id),
  ADD COLUMN IF NOT EXISTS doctor_id INTEGER REFERENCES doctors(id),
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

ALTER TABLE ivf_embryos
  ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id);

CREATE INDEX IF NOT EXISTS idx_ivf_fertilization_patient
  ON ivf_fertilization_records(tenant_id, hospital_id, branch_id, patient_id, is_deleted);

CREATE INDEX IF NOT EXISTS idx_ivf_fertilization_embryo
  ON ivf_fertilization_records(tenant_id, hospital_id, branch_id, embryo_record_id, is_deleted);

CREATE INDEX IF NOT EXISTS idx_ivf_embryos_patient
  ON ivf_embryos(tenant_id, hospital_id, branch_id, patient_id, is_deleted);
