-- Extend lifecycle history capture to operational tables used in long-term reports.

DO $$
DECLARE
  target_table TEXT;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'student_backlogs',
    'teacher_class_assignments',
    'hr_increment_requests',
    'hr_leave_requests',
    'hr_lop_entries',
    'invoices',
    'payments',
    'school_expenses',
    'expense_categories',
    'concession_requests',
    'classes',
    'sections',
    'subjects',
    'exams',
    'question_papers',
    'student_marks_entry',
    'homework_assignments',
    'transport_assignments',
    'transport_attendance',
    'hostel_allocations',
    'hostel_attendance',
    'dining_attendance'
  ]
  LOOP
    IF to_regclass(target_table) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_lifecycle_update ON %I', target_table, target_table);
      EXECUTE format('CREATE TRIGGER trg_%I_lifecycle_update AFTER UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION capture_lifecycle_change()', target_table, target_table);
    END IF;
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_retention
  ON teacher_class_assignments(school_id, academic_year_id, teacher_id, class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_retention
  ON homework_assignments(school_id, academic_year_id, class_id, section_id, due_date);
CREATE INDEX IF NOT EXISTS idx_transport_assignments_retention
  ON transport_assignments(school_id, academic_year_id, student_id, status);
CREATE INDEX IF NOT EXISTS idx_hostel_allocations_retention
  ON hostel_allocations(school_id, academic_year_id, student_id, allocation_date);
CREATE INDEX IF NOT EXISTS idx_school_expenses_retention
  ON school_expenses(school_id, academic_year_id, expense_date, category, status);
