ALTER TABLE hr_staff_master
  ADD COLUMN IF NOT EXISTS staff_type VARCHAR(30) DEFAULT 'Teaching',
  ADD COLUMN IF NOT EXISTS staff_category VARCHAR(120),
  ADD COLUMN IF NOT EXISTS sub_category VARCHAR(120),
  ADD COLUMN IF NOT EXISTS class_assignment VARCHAR(255),
  ADD COLUMN IF NOT EXISTS section_assignment VARCHAR(255),
  ADD COLUMN IF NOT EXISTS subject_assignment VARCHAR(255),
  ADD COLUMN IF NOT EXISTS assignment_type VARCHAR(80),
  ADD COLUMN IF NOT EXISTS is_class_teacher BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS teaching_experience VARCHAR(255),
  ADD COLUMN IF NOT EXISTS teacher_gap_history TEXT,
  ADD COLUMN IF NOT EXISTS previous_organization VARCHAR(255),
  ADD COLUMN IF NOT EXISTS reporting_manager VARCHAR(255),
  ADD COLUMN IF NOT EXISTS work_location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS joining_date DATE,
  ADD COLUMN IF NOT EXISTS salary_details TEXT;

UPDATE hr_staff_master
SET staff_type = 'Teaching'
WHERE staff_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_hr_staff_master_staff_type
  ON hr_staff_master(school_id, academic_year_id, staff_type);

CREATE INDEX IF NOT EXISTS idx_hr_staff_master_sub_category
  ON hr_staff_master(school_id, sub_category);
