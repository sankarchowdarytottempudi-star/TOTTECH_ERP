ALTER TABLE subjects ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS status varchar(30) DEFAULT 'ACTIVE';
UPDATE subjects SET status = 'ACTIVE' WHERE status IS NULL;
CREATE INDEX IF NOT EXISTS idx_subjects_school_year_status ON subjects(school_id, academic_year_id, status);
