CREATE TABLE IF NOT EXISTS education_knowledge_documents (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NULL REFERENCES schools(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  domain VARCHAR(120) NULL,
  source VARCHAR(255) NULL,
  source_url VARCHAR(500) NULL,
  publication_date DATE NULL,
  content TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  citations JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0.80,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by INTEGER NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_education_knowledge_scope
  ON education_knowledge_documents (school_id, category, is_active);

CREATE INDEX IF NOT EXISTS idx_education_knowledge_search
  ON education_knowledge_documents
  USING gin (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(category, '') || ' ' || coalesce(domain, '') || ' ' || coalesce(content, '')
    )
  );

CREATE TABLE IF NOT EXISTS education_ai_retrievals (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(150) NOT NULL,
  school_id INTEGER NULL REFERENCES schools(id) ON DELETE SET NULL,
  user_id INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
  question_type VARCHAR(80) NOT NULL,
  prompt_excerpt TEXT NULL,
  document_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  erp_tables JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0.70,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_education_ai_retrievals_request
  ON education_ai_retrievals (request_id);

CREATE INDEX IF NOT EXISTS idx_education_ai_retrievals_school
  ON education_ai_retrievals (school_id, created_at);

INSERT INTO education_knowledge_documents
  (title, category, domain, source, source_url, content, keywords, citations, confidence_score)
VALUES
  (
    'EduGPT Answer Safety Policy',
    'ai-governance',
    'school-ai',
    'TOTTECH ONE',
    NULL,
    'EduGPT must first check authorized school ERP data for data questions. If data is unavailable, it must say the requested information is not available in the institution database. Recommendations must be labelled as analysis or educational best practices. EduGPT must not expose records outside the user role and school context.',
    '["ai safety","erp grounding","rbac","no hallucination"]'::jsonb,
    '[]'::jsonb,
    0.95
  ),
  (
    'Student Intervention Framework',
    'student-success',
    'school-education',
    'TOTTECH ONE',
    NULL,
    'Student improvement plans should consider attendance, subject-wise marks, assignment completion, teacher remarks and parent engagement. Common interventions include remedial classes, focused practice on weak concepts, weekly formative assessment, attendance monitoring and parent meetings.',
    '["student intervention","attendance","marks","remedial classes"]'::jsonb,
    '[]'::jsonb,
    0.86
  ),
  (
    'Teaching Algebra Effectively',
    'teacher-support',
    'mathematics',
    'TOTTECH ONE',
    NULL,
    'Algebra teaching improves when teachers use concrete examples, visual models, number patterns, balance-scale representations, word problems, frequent low-stakes practice and error analysis. Students who struggle with algebra often need reinforcement in fractions, integers, factorization and translating words into equations.',
    '["algebra","mathematics","teaching strategies","learning gaps"]'::jsonb,
    '[]'::jsonb,
    0.84
  ),
  (
    'Evidence-Based Study Planning',
    'student-support',
    'learning-science',
    'TOTTECH ONE',
    NULL,
    'Effective study plans use active recall, spaced repetition, short focused sessions, practice papers, retrieval quizzes, correction notebooks and weekly revision. For Grade 10 students, daily revision and subject rotation reduce exam anxiety and improve retention.',
    '["study plan","active recall","spaced repetition","grade 10"]'::jsonb,
    '[]'::jsonb,
    0.84
  ),
  (
    'Academic Research and Thesis Structure',
    'research',
    'higher-education',
    'TOTTECH ONE',
    NULL,
    'A thesis normally includes introduction, problem statement, research questions, objectives, literature review, methodology, data analysis, findings, discussion, recommendations, limitations and references. Common methods include quantitative, qualitative, mixed methods, action research, case study, experimental design and survey research.',
    '["thesis","dissertation","research methodology","literature review"]'::jsonb,
    '[]'::jsonb,
    0.82
  ),
  (
    'Bloom Taxonomy and Assessment Design',
    'assessment',
    'curriculum',
    'TOTTECH ONE',
    NULL,
    'Assessment design should map questions and rubrics to cognitive levels such as remember, understand, apply, analyze, evaluate and create. Balanced question papers should include objective recall, conceptual understanding, application problems and higher-order thinking tasks.',
    '["Bloom taxonomy","rubrics","question papers","assessment"]'::jsonb,
    '[]'::jsonb,
    0.82
  )
ON CONFLICT DO NOTHING;
