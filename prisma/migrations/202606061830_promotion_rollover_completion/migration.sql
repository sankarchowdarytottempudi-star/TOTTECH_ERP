-- TOTTECH ONE promotion + academic-year rollover completion substrate.
-- Idempotent by design because the restored production DB is not using Prisma's
-- _prisma_migrations ledger.

CREATE TABLE IF NOT EXISTS academic_year_rollovers (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  source_academic_year_id INTEGER NOT NULL,
  target_academic_year_id INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'PREVIEW',
  requested_by INTEGER,
  approved_by INTEGER,
  executed_by INTEGER,
  approved_at TIMESTAMP,
  executed_at TIMESTAMP,
  source_counts JSONB DEFAULT '{}'::jsonb,
  target_counts JSONB DEFAULT '{}'::jsonb,
  copied_counts JSONB DEFAULT '{}'::jsonb,
  validation_errors JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_academic_year_rollovers_scope
  ON academic_year_rollovers(school_id, source_academic_year_id, target_academic_year_id);

CREATE INDEX IF NOT EXISTS idx_academic_year_rollovers_status
  ON academic_year_rollovers(status);

CREATE TABLE IF NOT EXISTS academic_year_rollover_items (
  id SERIAL PRIMARY KEY,
  rollover_id INTEGER REFERENCES academic_year_rollovers(id) ON DELETE CASCADE,
  entity_type VARCHAR(100) NOT NULL,
  source_id INTEGER,
  target_id INTEGER,
  status VARCHAR(50) DEFAULT 'PENDING',
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_academic_year_rollover_items_rollover
  ON academic_year_rollover_items(rollover_id, entity_type);

DO $$
DECLARE
  target_table TEXT;
  tables TEXT[] := ARRAY[
    'schools',
    'classes',
    'sections',
    'subjects',
    'students',
    'teachers',
    'attendance_master',
    'teacher_attendance',
    'homework_assignments',
    'homework_submissions',
    'teacher_class_assignments',
    'timetable_entries',
    'question_bank',
    'question_papers',
    'question_paper_questions',
    'exams',
    'exam_schedule',
    'student_marks_entry',
    'marks',
    'fee_categories',
    'invoices',
    'payments',
    'payment_receipts',
    'concession_requests',
    'dining_attendance',
    'dining_meal_plans',
    'dining_meal_assignments',
    'dining_weekly_menus',
    'dining_special_diets',
    'dining_inventory_items',
    'dining_purchases',
    'dining_consumption_logs',
    'dining_production_sheets',
    'dining_wastage_logs',
    'transport_routes',
    'transport_vehicles',
    'transport_assignments',
    'transport_attendance',
    'transport_pickup_drop_history',
    'hostels',
    'hostel_rooms',
    'hostel_allocations',
    'hostel_attendance',
    'hostel_movement_history',
    'event_ledger'
    ,'student_year_enrollments'
    ,'promotion_workflows'
    ,'promotion_workflow_students'
    ,'student_promotions'
    ,'student_dropout_records'
    ,'teacher_rollovers'
    ,'academic_year_rollovers'
    ,'academic_year_rollover_items'
  ];
BEGIN
  FOREACH target_table IN ARRAY tables LOOP
    IF EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = target_table
    ) THEN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = target_table
          AND column_name = 'created_by'
      ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN created_by INTEGER', target_table);
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = target_table
          AND column_name = 'created_at'
      ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', target_table);
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = target_table
          AND column_name = 'updated_by'
      ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN updated_by INTEGER', target_table);
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = target_table
          AND column_name = 'updated_at'
      ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', target_table);
      END IF;
    END IF;
  END LOOP;
END $$;

INSERT INTO academic_years (school_id, academic_year, start_date, end_date, is_current)
SELECT NULL, '2027-2028', DATE '2027-06-01', DATE '2028-05-31', false
WHERE NOT EXISTS (
  SELECT 1
  FROM academic_years
  WHERE school_id IS NULL
    AND academic_year = '2027-2028'
);
