-- AI Answer Evaluation Center

CREATE TABLE IF NOT EXISTS answer_evaluation_uploads (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  exam_schedule_id INTEGER,
  question_paper_id INTEGER,
  class_id INTEGER,
  section_id INTEGER,
  student_id INTEGER,
  uploaded_by INTEGER,
  original_file_name VARCHAR(255),
  stored_file_name VARCHAR(255),
  file_path TEXT,
  mime_type VARCHAR(120),
  page_count INTEGER,
  ocr_text TEXT,
  extracted_answers JSONB DEFAULT '[]'::jsonb,
  ai_evaluation JSONB DEFAULT '{}'::jsonb,
  ai_summary JSONB DEFAULT '{}'::jsonb,
  teacher_review_status VARCHAR(40) DEFAULT 'PENDING',
  teacher_reviewed_by INTEGER,
  teacher_reviewed_at TIMESTAMP,
  teacher_comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_answer_eval_scope
  ON answer_evaluation_uploads(school_id, academic_year_id, exam_schedule_id, class_id, section_id, student_id);

CREATE INDEX IF NOT EXISTS idx_answer_eval_review
  ON answer_evaluation_uploads(question_paper_id, teacher_review_status, created_at DESC);
