-- Align legacy-created clinical tables with the normalized Phase 3 model.

ALTER TABLE bed_allocations ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id);
ALTER TABLE bed_allocations ADD COLUMN IF NOT EXISTS allocation_uid VARCHAR(80);
ALTER TABLE bed_allocations ADD COLUMN IF NOT EXISTS building VARCHAR(255);
ALTER TABLE bed_allocations ADD COLUMN IF NOT EXISTS ward VARCHAR(255);
ALTER TABLE bed_allocations ADD COLUMN IF NOT EXISTS bed_number VARCHAR(120);
ALTER TABLE bed_allocations ADD COLUMN IF NOT EXISTS action VARCHAR(120);
ALTER TABLE bed_allocations ADD COLUMN IF NOT EXISTS priority VARCHAR(40) DEFAULT 'NORMAL';
ALTER TABLE bed_allocations ADD COLUMN IF NOT EXISTS notes TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS bed_allocations_allocation_uid_idx ON bed_allocations(allocation_uid) WHERE allocation_uid IS NOT NULL;

ALTER TABLE bed_transfers ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id);
ALTER TABLE bed_transfers ADD COLUMN IF NOT EXISTS from_room_id INTEGER REFERENCES clinical_room_master(id);
ALTER TABLE bed_transfers ADD COLUMN IF NOT EXISTS to_room_id INTEGER REFERENCES clinical_room_master(id);
ALTER TABLE bed_transfers ADD COLUMN IF NOT EXISTS transfer_reason TEXT;
ALTER TABLE bed_transfers ADD COLUMN IF NOT EXISTS transferred_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE nursing_notes ADD COLUMN IF NOT EXISTS vital_id INTEGER REFERENCES nursing_vitals(id);
ALTER TABLE nursing_notes ADD COLUMN IF NOT EXISTS note_text TEXT;

ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS result_value TEXT;
ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS critical_value BOOLEAN DEFAULT FALSE;
ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS entered_by INTEGER;
ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS entered_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS status VARCHAR(80) DEFAULT 'COMPLETED';

ALTER TABLE pharmacy_batches ADD COLUMN IF NOT EXISTS stock_id INTEGER REFERENCES pharmacy_stock(id);
ALTER TABLE pharmacy_batches ADD COLUMN IF NOT EXISTS quantity NUMERIC(12,2) DEFAULT 0;

ALTER TABLE pharmacy_purchase_orders ADD COLUMN IF NOT EXISTS stock_id INTEGER REFERENCES pharmacy_stock(id);
ALTER TABLE pharmacy_purchase_orders ADD COLUMN IF NOT EXISTS purchase_order VARCHAR(120);
ALTER TABLE pharmacy_purchase_orders ADD COLUMN IF NOT EXISTS goods_receipt VARCHAR(120);
ALTER TABLE pharmacy_purchase_orders ADD COLUMN IF NOT EXISTS supplier VARCHAR(255);

ALTER TABLE ivf_embryos ADD COLUMN IF NOT EXISTS ivf_cycle_id INTEGER REFERENCES ivf_cycles(id);
ALTER TABLE ivf_embryos ADD COLUMN IF NOT EXISTS embryo_grade VARCHAR(120);
ALTER TABLE ivf_embryos ADD COLUMN IF NOT EXISTS sperm_count VARCHAR(120);
ALTER TABLE ivf_embryos ADD COLUMN IF NOT EXISTS motility VARCHAR(120);
ALTER TABLE ivf_embryos ADD COLUMN IF NOT EXISTS morphology VARCHAR(120);

ALTER TABLE consultation_radiology_orders ADD COLUMN IF NOT EXISTS order_uid VARCHAR(80);
ALTER TABLE consultation_radiology_orders ADD COLUMN IF NOT EXISTS priority VARCHAR(40) DEFAULT 'NORMAL';
CREATE UNIQUE INDEX IF NOT EXISTS consultation_radiology_orders_uid_idx ON consultation_radiology_orders(order_uid) WHERE order_uid IS NOT NULL;

ALTER TABLE ot_schedules ADD COLUMN IF NOT EXISTS schedule_uid VARCHAR(80);
ALTER TABLE ot_schedules ADD COLUMN IF NOT EXISTS priority VARCHAR(40) DEFAULT 'NORMAL';
CREATE UNIQUE INDEX IF NOT EXISTS ot_schedules_schedule_uid_idx ON ot_schedules(schedule_uid) WHERE schedule_uid IS NOT NULL;

CREATE INDEX IF NOT EXISTS bed_allocations_scope_idx ON bed_allocations (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS bed_transfers_scope_idx ON bed_transfers (tenant_id, hospital_id, branch_id, patient_id) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS nursing_notes_vital_idx ON nursing_notes (vital_id) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS lab_results_order_idx ON lab_results (lab_order_id) WHERE COALESCE(is_deleted,false) = false;
CREATE INDEX IF NOT EXISTS consultation_radiology_orders_scope_idx ON consultation_radiology_orders (tenant_id, hospital_id, branch_id, patient_id, status) WHERE COALESCE(is_deleted,false) = false;
