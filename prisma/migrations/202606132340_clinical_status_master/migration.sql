CREATE TABLE IF NOT EXISTS status_master (
  id SERIAL PRIMARY KEY,
  module VARCHAR(120) NOT NULL,
  status_code VARCHAR(120) NOT NULL,
  status_label VARCHAR(255) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  color VARCHAR(40),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (module, status_code)
);

CREATE TABLE IF NOT EXISTS status_migration_audit (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(160) NOT NULL,
  column_name VARCHAR(160) NOT NULL,
  old_value TEXT,
  new_value VARCHAR(120) NOT NULL,
  record_count INTEGER NOT NULL DEFAULT 0,
  migrated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO status_master (module, status_code, status_label, display_order, color, is_active)
VALUES
  ('ivf_couples','NEW','New',10,'#0EA5E9',true),
  ('ivf_couples','UNDER_REVIEW','Under Review',20,'#F59E0B',true),
  ('ivf_couples','APPROVED','Approved',30,'#10B981',true),
  ('ivf_couples','CLOSED','Closed',40,'#64748B',true),
  ('ivf_assessment','PENDING','Pending',10,'#F59E0B',true),
  ('ivf_assessment','IN_PROGRESS','In Progress',20,'#0EA5E9',true),
  ('ivf_assessment','COMPLETED','Completed',30,'#10B981',true),
  ('ivf_cycles','PLANNED','Planned',10,'#64748B',true),
  ('ivf_cycles','ACTIVE','Active',20,'#0EA5E9',true),
  ('ivf_cycles','ON_HOLD','On Hold',30,'#F59E0B',true),
  ('ivf_cycles','COMPLETED','Completed',40,'#10B981',true),
  ('ivf_cycles','CANCELLED','Cancelled',50,'#EF4444',true),
  ('ivf_stimulation','STARTED','Started',10,'#0EA5E9',true),
  ('ivf_stimulation','IN_PROGRESS','In Progress',20,'#3B82F6',true),
  ('ivf_stimulation','TRIGGER_GIVEN','Trigger Given',30,'#D4AF37',true),
  ('ivf_stimulation','COMPLETED','Completed',40,'#10B981',true),
  ('ivf_retrievals','SCHEDULED','Scheduled',10,'#64748B',true),
  ('ivf_retrievals','COMPLETED','Completed',20,'#10B981',true),
  ('ivf_retrievals','CANCELLED','Cancelled',30,'#EF4444',true),
  ('ivf_embryology','FERTILIZED','Fertilized',10,'#0EA5E9',true),
  ('ivf_embryology','DAY3','Day 3',20,'#3B82F6',true),
  ('ivf_embryology','DAY5','Day 5',30,'#8B5CF6',true),
  ('ivf_embryology','BLASTOCYST','Blastocyst',40,'#D4AF37',true),
  ('ivf_embryology','FROZEN','Frozen',50,'#06B6D4',true),
  ('ivf_embryology','DISCARDED','Discarded',60,'#EF4444',true),
  ('ivf_cryo','STORED','Stored',10,'#0EA5E9',true),
  ('ivf_cryo','THAWED','Thawed',20,'#F59E0B',true),
  ('ivf_cryo','TRANSFERRED','Transferred',30,'#10B981',true),
  ('ivf_cryo','DISCARDED','Discarded',40,'#EF4444',true),
  ('ivf_transfers','SCHEDULED','Scheduled',10,'#64748B',true),
  ('ivf_transfers','COMPLETED','Completed',20,'#10B981',true),
  ('ivf_transfers','FAILED','Failed',30,'#EF4444',true),
  ('ivf_donors','ACTIVE','Active',10,'#10B981',true),
  ('ivf_donors','INACTIVE','Inactive',20,'#64748B',true),
  ('ivf_donors','BLOCKED','Blocked',30,'#EF4444',true),
  ('ivf_surrogacy','ACTIVE','Active',10,'#10B981',true),
  ('ivf_surrogacy','COMPLETED','Completed',20,'#10B981',true),
  ('ivf_surrogacy','TERMINATED','Terminated',30,'#EF4444',true),
  ('ivf_pregnancy','POSITIVE_BETA_HCG','Positive Beta HCG',10,'#0EA5E9',true),
  ('ivf_pregnancy','HEARTBEAT_CONFIRMED','Heartbeat Confirmed',20,'#10B981',true),
  ('ivf_pregnancy','FIRST_TRIMESTER','First Trimester',30,'#3B82F6',true),
  ('ivf_pregnancy','SECOND_TRIMESTER','Second Trimester',40,'#8B5CF6',true),
  ('ivf_pregnancy','DELIVERED','Delivered',50,'#10B981',true),
  ('appointments','BOOKED','Booked',10,'#64748B',true),
  ('appointments','CONFIRMED','Confirmed',20,'#0EA5E9',true),
  ('appointments','CANCELLED','Cancelled',30,'#EF4444',true),
  ('appointments','NO_SHOW','No Show',40,'#F97316',true),
  ('appointments','CHECKED_IN','Checked In',50,'#10B981',true),
  ('vitals','WAITING','Waiting',10,'#64748B',true),
  ('vitals','VITALS_COLLECTED','Vitals Collected',20,'#0EA5E9',true),
  ('vitals','READY_FOR_CONSULTATION','Ready For Consultation',30,'#10B981',true),
  ('consultations','WAITING','Waiting',10,'#64748B',true),
  ('consultations','IN_CONSULTATION','In Consultation',20,'#0EA5E9',true),
  ('consultations','CONSULTATION_COMPLETED','Consultation Completed',30,'#10B981',true),
  ('consultations','FOLLOWUP_REQUIRED','Follow-Up Required',40,'#F59E0B',true),
  ('lab','PRESCRIBED','Prescribed',10,'#64748B',true),
  ('lab','BILL_GENERATED','Bill Generated',20,'#D4AF37',true),
  ('lab','BILL_PAID','Bill Paid',30,'#10B981',true),
  ('lab','SAMPLE_COLLECTED','Sample Collected',40,'#0EA5E9',true),
  ('lab','PROCESSING','Processing',50,'#3B82F6',true),
  ('lab','REPORT_READY','Report Ready',60,'#10B981',true),
  ('lab','DELIVERED','Delivered',70,'#10B981',true),
  ('pharmacy','PENDING','Pending',10,'#F59E0B',true),
  ('pharmacy','DISPENSED','Dispensed',20,'#0EA5E9',true),
  ('pharmacy','PARTIALLY_DISPENSED','Partially Dispensed',30,'#D4AF37',true),
  ('pharmacy','COMPLETED','Completed',40,'#10B981',true),
  ('ip','ADMITTED','Admitted',10,'#0EA5E9',true),
  ('ip','UNDER_TREATMENT','Under Treatment',20,'#3B82F6',true),
  ('ip','READY_FOR_DISCHARGE','Ready For Discharge',30,'#F59E0B',true),
  ('ip','DISCHARGED','Discharged',40,'#10B981',true),
  ('icu','ADMITTED','Admitted',10,'#0EA5E9',true),
  ('icu','CRITICAL','Critical',20,'#EF4444',true),
  ('icu','STABLE','Stable',30,'#10B981',true),
  ('icu','TRANSFERRED','Transferred',40,'#D4AF37',true),
  ('icu','DISCHARGED','Discharged',50,'#10B981',true),
  ('ot','SCHEDULED','Scheduled',10,'#64748B',true),
  ('ot','IN_PROGRESS','In Progress',20,'#0EA5E9',true),
  ('ot','COMPLETED','Completed',30,'#10B981',true),
  ('ot','CANCELLED','Cancelled',40,'#EF4444',true),
  ('billing','DRAFT','Draft',10,'#64748B',true),
  ('billing','GENERATED','Generated',20,'#0EA5E9',true),
  ('billing','PARTIALLY_PAID','Partially Paid',30,'#D4AF37',true),
  ('billing','PAID','Paid',40,'#10B981',true),
  ('billing','CANCELLED','Cancelled',50,'#EF4444',true),
  ('billing','REFUNDED','Refunded',60,'#8B5CF6',true),
  ('payments','PENDING','Pending',10,'#F59E0B',true),
  ('payments','SUCCESS','Success',20,'#10B981',true),
  ('payments','FAILED','Failed',30,'#EF4444',true),
  ('payments','REFUNDED','Refunded',40,'#8B5CF6',true),
  ('patients','ACTIVE','Active',10,'#10B981',true),
  ('patients','INACTIVE','Inactive',20,'#64748B',true),
  ('patients','BLOCKED','Blocked',30,'#EF4444',true),
  ('patients','ARCHIVED','Archived',40,'#64748B',true)
ON CONFLICT (module, status_code) DO UPDATE
SET
  status_label = EXCLUDED.status_label,
  display_order = EXCLUDED.display_order,
  color = EXCLUDED.color,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;

DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'ivf_couples'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'ivf_couples','status',status,'NEW',COUNT(*)::int
    FROM ivf_couples
    WHERE UPPER(TRIM(COALESCE(status,''))) IN ('ACTIVE','ACTVE','NEW')
    GROUP BY status;
    UPDATE ivf_couples SET status = 'NEW' WHERE UPPER(TRIM(COALESCE(status,''))) IN ('ACTIVE','ACTVE','NEW');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'ivf_female_assessments'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'ivf_female_assessments','status',status,'PENDING',COUNT(*)::int
    FROM ivf_female_assessments
    WHERE UPPER(TRIM(COALESCE(status,''))) IN ('DRAFT','PENDING')
    GROUP BY status;
    UPDATE ivf_female_assessments SET status = 'PENDING' WHERE UPPER(TRIM(COALESCE(status,''))) IN ('DRAFT','PENDING');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'ivf_male_assessments'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'ivf_male_assessments','status',status,'PENDING',COUNT(*)::int
    FROM ivf_male_assessments
    WHERE UPPER(TRIM(COALESCE(status,''))) IN ('DRAFT','PENDING')
    GROUP BY status;
    UPDATE ivf_male_assessments SET status = 'PENDING' WHERE UPPER(TRIM(COALESCE(status,''))) IN ('DRAFT','PENDING');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'ivf_cycles'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'ivf_cycles','status',status,
      CASE
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('CANCELLED','CANCELED') THEN 'CANCELLED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('COMPLETED','DONE','FINISH','FINISHED') THEN 'COMPLETED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('ON_HOLD','HOLD') THEN 'ON_HOLD'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('PLANNED','PLAN') THEN 'PLANNED'
        ELSE 'ACTIVE'
      END,
      COUNT(*)::int
    FROM ivf_cycles
    WHERE COALESCE(status,'') <> ''
    GROUP BY status;
    UPDATE ivf_cycles SET status =
      CASE
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('CANCELLED','CANCELED') THEN 'CANCELLED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('COMPLETED','DONE','FINISH','FINISHED') THEN 'COMPLETED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('ON_HOLD','HOLD') THEN 'ON_HOLD'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('PLANNED','PLAN') THEN 'PLANNED'
        ELSE 'ACTIVE'
      END
    WHERE COALESCE(status,'') <> '';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'ivf_fertilization_records'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'ivf_fertilization_records','status',status,'FERTILIZED',COUNT(*)::int
    FROM ivf_fertilization_records
    WHERE UPPER(TRIM(COALESCE(status,''))) IN ('RECORDED','FERTILIZED','ACTIVE')
    GROUP BY status;
    UPDATE ivf_fertilization_records SET status = 'FERTILIZED' WHERE UPPER(TRIM(COALESCE(status,''))) IN ('RECORDED','FERTILIZED','ACTIVE');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'ivf_freezing_records'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'ivf_freezing_records','status',status,'STORED',COUNT(*)::int
    FROM ivf_freezing_records
    WHERE UPPER(TRIM(COALESCE(status,''))) IN ('FROZEN','STORED','ACTIVE')
    GROUP BY status;
    UPDATE ivf_freezing_records SET status = 'STORED' WHERE UPPER(TRIM(COALESCE(status,''))) IN ('FROZEN','STORED','ACTIVE');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'ivf_embryo_transfers'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'ivf_embryo_transfers','status',status,'COMPLETED',COUNT(*)::int
    FROM ivf_embryo_transfers
    WHERE UPPER(TRIM(COALESCE(status,''))) IN ('DONE','FINISH','FINISHED','COMPLETED')
    GROUP BY status;
    UPDATE ivf_embryo_transfers SET status = 'COMPLETED' WHERE UPPER(TRIM(COALESCE(status,''))) IN ('DONE','FINISH','FINISHED','COMPLETED');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'lab_orders'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'lab_orders','status',status,
      CASE
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('ORDERED','DOCTOR_PRESCRIBED','PRESCRIBED') THEN 'PRESCRIBED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('COLLECTED','SAMPLE_COLLECTED') THEN 'SAMPLE_COLLECTED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('RESULT_ENTERED','VALIDATED','APPROVED','RELEASED','COMPLETED') THEN 'REPORT_READY'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('BILL_GENERATED') THEN 'BILL_GENERATED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('BILL_PAID') THEN 'BILL_PAID'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('PROCESSING') THEN 'PROCESSING'
        ELSE 'PRESCRIBED'
      END,
      COUNT(*)::int
    FROM lab_orders
    WHERE COALESCE(status,'') <> ''
    GROUP BY status;
    UPDATE lab_orders SET status =
      CASE
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('ORDERED','DOCTOR_PRESCRIBED','PRESCRIBED') THEN 'PRESCRIBED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('COLLECTED','SAMPLE_COLLECTED') THEN 'SAMPLE_COLLECTED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('RESULT_ENTERED','VALIDATED','APPROVED','RELEASED','COMPLETED') THEN 'REPORT_READY'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('BILL_GENERATED') THEN 'BILL_GENERATED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('BILL_PAID') THEN 'BILL_PAID'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('PROCESSING') THEN 'PROCESSING'
        ELSE 'PRESCRIBED'
      END
    WHERE COALESCE(status,'') <> '';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'billing_invoices'
  ) INTO table_exists;
  IF table_exists THEN
    INSERT INTO status_migration_audit (table_name,column_name,old_value,new_value,record_count)
    SELECT 'billing_invoices','status',status,
      CASE
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('OPEN','GENERATED') THEN 'GENERATED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('PARTIAL','PARTIALLY_PAID') THEN 'PARTIALLY_PAID'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('PAID','SUCCESS') THEN 'PAID'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('CANCELLED','CANCELED') THEN 'CANCELLED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('REFUNDED') THEN 'REFUNDED'
        ELSE 'DRAFT'
      END,
      COUNT(*)::int
    FROM billing_invoices
    WHERE COALESCE(status,'') <> ''
    GROUP BY status;
    UPDATE billing_invoices SET status =
      CASE
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('OPEN','GENERATED') THEN 'GENERATED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('PARTIAL','PARTIALLY_PAID') THEN 'PARTIALLY_PAID'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('PAID','SUCCESS') THEN 'PAID'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('CANCELLED','CANCELED') THEN 'CANCELLED'
        WHEN UPPER(TRIM(COALESCE(status,''))) IN ('REFUNDED') THEN 'REFUNDED'
        ELSE 'DRAFT'
      END
    WHERE COALESCE(status,'') <> '';
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON status_master TO schooladmin;
GRANT USAGE, SELECT ON SEQUENCE status_master_id_seq TO schooladmin;
GRANT SELECT, INSERT, UPDATE, DELETE ON status_migration_audit TO schooladmin;
GRANT USAGE, SELECT ON SEQUENCE status_migration_audit_id_seq TO schooladmin;
