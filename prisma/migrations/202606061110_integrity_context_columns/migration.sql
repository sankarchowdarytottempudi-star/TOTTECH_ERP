-- Phase 1 integrity substrate for final enterprise completion sprint.
-- Additive only: nullable context columns plus safe backfills.

ALTER TABLE students ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE attendance_master ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE teacher_attendance ADD COLUMN IF NOT EXISTS school_id integer;
ALTER TABLE teacher_attendance ADD COLUMN IF NOT EXISTS created_by integer;

ALTER TABLE classes ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE exam_schedule ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE student_marks_entry ADD COLUMN IF NOT EXISTS created_by integer;

ALTER TABLE fees ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE fee_categories ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE payment_receipts ADD COLUMN IF NOT EXISTS school_id integer;
ALTER TABLE payment_receipts ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE payment_receipts ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE concession_requests ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE concession_requests ADD COLUMN IF NOT EXISTS created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE dining_attendance ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE dining_inventory_items ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE dining_inventory_items ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE dining_consumption_logs ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE dining_wastage_logs ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE dining_meal_assignments ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE dining_special_diets ADD COLUMN IF NOT EXISTS created_by integer;

ALTER TABLE transport_vehicles ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE transport_vehicles ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE transport_routes ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE transport_routes ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE transport_attendance ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE transport_pickup_drop_history ADD COLUMN IF NOT EXISTS created_by integer;

ALTER TABLE hostels ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE hostels ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE hostel_rooms ADD COLUMN IF NOT EXISTS academic_year_id integer;
ALTER TABLE hostel_rooms ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE hostel_allocations ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE hostel_attendance ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE hostel_movement_history ADD COLUMN IF NOT EXISTS created_by integer;

ALTER TABLE event_ledger ADD COLUMN IF NOT EXISTS created_by integer;

UPDATE teacher_attendance ta
SET school_id = t.school_id
FROM teachers t
WHERE ta.teacher_id = t.id
  AND ta.school_id IS NULL;

UPDATE event_ledger
SET created_by = user_id
WHERE created_by IS NULL
  AND user_id IS NOT NULL;

UPDATE classes c
SET academic_year_id = (
  SELECT ay.id
  FROM academic_years ay
  WHERE ay.school_id = c.school_id
    AND ay.is_current = true
  ORDER BY ay.id DESC
  LIMIT 1
)
WHERE c.academic_year_id IS NULL;

UPDATE sections s
SET academic_year_id = COALESCE(
  (
    SELECT c.academic_year_id
    FROM classes c
    WHERE c.id = s.class_id
    LIMIT 1
  ),
  (
    SELECT ay.id
    FROM academic_years ay
    WHERE ay.school_id = s.school_id
      AND ay.is_current = true
    ORDER BY ay.id DESC
    LIMIT 1
  )
)
WHERE s.academic_year_id IS NULL;

UPDATE subjects sub
SET academic_year_id = (
  SELECT ay.id
  FROM academic_years ay
  WHERE ay.school_id = sub.school_id
    AND ay.is_current = true
  ORDER BY ay.id DESC
  LIMIT 1
)
WHERE sub.academic_year_id IS NULL;

UPDATE transport_vehicles tv
SET academic_year_id = (
  SELECT ay.id
  FROM academic_years ay
  WHERE ay.school_id = tv.school_id
    AND ay.is_current = true
  ORDER BY ay.id DESC
  LIMIT 1
)
WHERE tv.academic_year_id IS NULL;

UPDATE transport_routes tr
SET academic_year_id = (
  SELECT ay.id
  FROM academic_years ay
  WHERE ay.school_id = tr.school_id
    AND ay.is_current = true
  ORDER BY ay.id DESC
  LIMIT 1
)
WHERE tr.academic_year_id IS NULL;

UPDATE hostels h
SET academic_year_id = (
  SELECT ay.id
  FROM academic_years ay
  WHERE ay.school_id = h.school_id
    AND ay.is_current = true
  ORDER BY ay.id DESC
  LIMIT 1
)
WHERE h.academic_year_id IS NULL;

UPDATE hostel_rooms hr
SET academic_year_id = (
  SELECT ay.id
  FROM academic_years ay
  WHERE ay.school_id = hr.school_id
    AND ay.is_current = true
  ORDER BY ay.id DESC
  LIMIT 1
)
WHERE hr.academic_year_id IS NULL;

UPDATE dining_inventory_items di
SET academic_year_id = (
  SELECT ay.id
  FROM academic_years ay
  WHERE ay.school_id = di.school_id
    AND ay.is_current = true
  ORDER BY ay.id DESC
  LIMIT 1
)
WHERE di.academic_year_id IS NULL;

UPDATE payment_receipts pr
SET school_id = p.school_id,
    academic_year_id = p.academic_year_id,
    created_by = p.received_by
FROM payments p
WHERE pr.payment_id = p.id
  AND (
    pr.school_id IS NULL
    OR pr.academic_year_id IS NULL
    OR pr.created_by IS NULL
  );

CREATE INDEX IF NOT EXISTS idx_attendance_master_year ON attendance_master (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_scope ON teacher_attendance (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_classes_year ON classes (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_sections_year ON sections (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_subjects_year ON subjects (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_transport_routes_year ON transport_routes (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_transport_vehicles_year ON transport_vehicles (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_hostels_year ON hostels (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_hostel_rooms_year ON hostel_rooms (school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_dining_inventory_year ON dining_inventory_items (school_id, academic_year_id);
