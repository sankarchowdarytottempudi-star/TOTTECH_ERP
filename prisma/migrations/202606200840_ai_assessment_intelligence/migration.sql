-- AI Assessment Intelligence Engine

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS ideal_answer TEXT,
  ADD COLUMN IF NOT EXISTS rubric TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT;

ALTER TABLE student_marks_entry
  ADD COLUMN IF NOT EXISTS student_answer_text TEXT,
  ADD COLUMN IF NOT EXISTS ai_suggested_marks NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_exact_match_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_concept_match_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_keyword_match_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_semantic_similarity_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_completeness_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_grammar_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_writing_quality_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_logical_flow_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_critical_thinking_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_quality_label VARCHAR(40),
  ADD COLUMN IF NOT EXISTS ai_understanding_level VARCHAR(20),
  ADD COLUMN IF NOT EXISTS ai_confidence_percent NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ai_reasoning TEXT,
  ADD COLUMN IF NOT EXISTS ai_misconceptions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS teacher_review_status VARCHAR(40) DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS teacher_reviewed_by INTEGER,
  ADD COLUMN IF NOT EXISTS teacher_reviewed_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_student_marks_entry_ai_review
  ON student_marks_entry(question_paper_id, student_id, ai_quality_label, teacher_review_status);

CREATE INDEX IF NOT EXISTS idx_question_bank_ai_scope
  ON question_bank(school_id, academic_year_id, subject_id, class_id, section_id);
