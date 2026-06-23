-- Long-term lifecycle hardening for 15-30 year school ERP retention.

CREATE TABLE IF NOT EXISTS student_backlogs (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  school_id INTEGER,
  academic_year_id INTEGER,
  subject_id INTEGER,
  exam_id INTEGER,
  backlog_status VARCHAR(30) DEFAULT 'PENDING',
  backlog_reason TEXT,
  cleared_date DATE,
  remarks TEXT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT student_backlogs_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT student_backlogs_school_id_fkey
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT student_backlogs_academic_year_id_fkey
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT student_backlogs_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT student_backlogs_exam_id_fkey
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_student_backlogs_student_status
  ON student_backlogs(student_id, backlog_status);
CREATE INDEX IF NOT EXISTS idx_student_backlogs_school_status
  ON student_backlogs(school_id, backlog_status);
CREATE INDEX IF NOT EXISTS idx_student_backlogs_year_status
  ON student_backlogs(academic_year_id, backlog_status);
CREATE INDEX IF NOT EXISTS idx_student_backlogs_subject_status
  ON student_backlogs(subject_id, backlog_status);
CREATE INDEX IF NOT EXISTS idx_student_backlogs_exam_status
  ON student_backlogs(exam_id, backlog_status);

CREATE TABLE IF NOT EXISTS lifecycle_change_history (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(80) NOT NULL,
  entity_id INTEGER NOT NULL,
  school_id INTEGER,
  academic_year_id INTEGER,
  change_type VARCHAR(40) NOT NULL,
  old_snapshot JSONB,
  new_snapshot JSONB,
  changed_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lifecycle_history_entity
  ON lifecycle_change_history(entity_type, entity_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_lifecycle_history_school_year
  ON lifecycle_change_history(school_id, academic_year_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_lifecycle_history_change
  ON lifecycle_change_history(change_type, changed_at DESC);

CREATE OR REPLACE FUNCTION capture_lifecycle_change()
RETURNS TRIGGER AS $$
DECLARE
  old_json JSONB;
  new_json JSONB;
  changed_entity_id INTEGER;
  changed_school_id INTEGER;
  changed_academic_year_id INTEGER;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    old_json := to_jsonb(OLD);
    new_json := to_jsonb(NEW);
    IF old_json = new_json THEN
      RETURN NEW;
    END IF;
    changed_entity_id := COALESCE((new_json->>'id')::integer, (old_json->>'id')::integer);
    changed_school_id := COALESCE((new_json->>'school_id')::integer, (old_json->>'school_id')::integer);
    changed_academic_year_id := COALESCE((new_json->>'academic_year_id')::integer, (old_json->>'academic_year_id')::integer);
    INSERT INTO lifecycle_change_history (
      entity_type, entity_id, school_id, academic_year_id, change_type, old_snapshot, new_snapshot
    )
    VALUES (
      TG_TABLE_NAME, changed_entity_id, changed_school_id, changed_academic_year_id, 'UPDATE', old_json, new_json
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    old_json := to_jsonb(OLD);
    changed_entity_id := (old_json->>'id')::integer;
    changed_school_id := NULLIF(old_json->>'school_id', '')::integer;
    changed_academic_year_id := NULLIF(old_json->>'academic_year_id', '')::integer;
    INSERT INTO lifecycle_change_history (
      entity_type, entity_id, school_id, academic_year_id, change_type, old_snapshot
    )
    VALUES (
      TG_TABLE_NAME, changed_entity_id, changed_school_id, changed_academic_year_id, 'DELETE', old_json
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  target_table TEXT;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'students',
    'teachers',
    'hr_staff_master',
    'hr_salary_assignments',
    'hr_salary_structures',
    'hr_pay_slips',
    'hr_pf_ledgers',
    'student_year_enrollments',
    'student_academic_history',
    'student_documents',
    'timetable_entries'
  ]
  LOOP
    IF to_regclass(target_table) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_lifecycle_update ON %I', target_table, target_table);
      EXECUTE format('CREATE TRIGGER trg_%I_lifecycle_update AFTER UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION capture_lifecycle_change()', target_table, target_table);
    END IF;
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_students_retention_school_year_status
  ON students(school_id, academic_year_id, status, id);
CREATE INDEX IF NOT EXISTS idx_attendance_retention_school_year_date
  ON attendance(school_id, academic_year_id, attendance_date, student_id);
CREATE INDEX IF NOT EXISTS idx_marks_retention_school_year_student
  ON student_marks_entry(school_id, academic_year_id, student_id, exam_schedule_id);
CREATE INDEX IF NOT EXISTS idx_invoices_retention_school_year_date
  ON invoices(school_id, academic_year_id, invoice_date, student_id);
CREATE INDEX IF NOT EXISTS idx_payments_retention_school_year_date
  ON payments(school_id, academic_year_id, payment_date, student_id);
CREATE INDEX IF NOT EXISTS idx_payroll_retention_staff_month
  ON hr_pay_slips(school_id, academic_year_id, staff_id, payroll_month, payroll_year);
CREATE INDEX IF NOT EXISTS idx_pf_retention_staff_month
  ON hr_pf_ledgers(school_id, academic_year_id, staff_id, payroll_year, payroll_month);
CREATE INDEX IF NOT EXISTS idx_event_ledger_retention_entity
  ON event_ledger(entity_type, entity_id, created_at DESC);
