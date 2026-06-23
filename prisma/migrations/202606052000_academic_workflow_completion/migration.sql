-- Academic workflow completion:
-- exam creation, schedule, question papers, homework, and marks entry.

ALTER TABLE exam_schedule
  ADD COLUMN IF NOT EXISTS school_id INTEGER,
  ADD COLUMN IF NOT EXISTS exam_id INTEGER,
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE exam_schedule es
SET school_id = c.school_id
FROM classes c
WHERE es.class_id = c.id
  AND es.school_id IS NULL;

ALTER TABLE question_papers
  ADD COLUMN IF NOT EXISTS school_id INTEGER,
  ADD COLUMN IF NOT EXISTS exam_id INTEGER,
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS instructions TEXT,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_by INTEGER,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE question_papers qp
SET school_id = c.school_id
FROM classes c
WHERE qp.class_id = c.id
  AND qp.school_id IS NULL;

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS school_id INTEGER,
  ADD COLUMN IF NOT EXISTS class_id INTEGER,
  ADD COLUMN IF NOT EXISTS section_id INTEGER,
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS answer_text TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE question_paper_questions
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE homework_assignments
  ADD COLUMN IF NOT EXISTS assignment_type VARCHAR(50) DEFAULT 'CLASS_SECTION',
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

ALTER TABLE student_marks_entry
  ADD COLUMN IF NOT EXISTS school_id INTEGER,
  ADD COLUMN IF NOT EXISTS academic_year_id INTEGER,
  ADD COLUMN IF NOT EXISTS class_id INTEGER,
  ADD COLUMN IF NOT EXISTS section_id INTEGER,
  ADD COLUMN IF NOT EXISTS grade VARCHAR(20),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE student_marks_entry sme
SET school_id = s.school_id
FROM students s
WHERE sme.student_id = s.id
  AND sme.school_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_exam_schedule_school_year
  ON exam_schedule (school_id, academic_year_id, class_id, section_id);

CREATE INDEX IF NOT EXISTS idx_question_papers_school_year
  ON question_papers (school_id, academic_year_id, class_id, section_id, subject_id);

CREATE INDEX IF NOT EXISTS idx_question_bank_scope
  ON question_bank (school_id, academic_year_id, subject_id, class_id, section_id);

CREATE INDEX IF NOT EXISTS idx_homework_assignments_scope
  ON homework_assignments (school_id, academic_year_id, class_id, section_id, subject_id);

CREATE INDEX IF NOT EXISTS idx_student_marks_entry_scope
  ON student_marks_entry (school_id, academic_year_id, class_id, section_id, exam_schedule_id);
