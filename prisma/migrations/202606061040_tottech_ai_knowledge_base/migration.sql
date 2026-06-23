CREATE TABLE IF NOT EXISTS ai_knowledge_base (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year VARCHAR(50),
  question TEXT NOT NULL,
  normalized_question TEXT NOT NULL,
  question_hash VARCHAR(128) NOT NULL,
  answer TEXT NOT NULL,
  summary TEXT,
  keywords JSONB,
  sources JSONB,
  embedding JSONB,
  confidence NUMERIC(5,2) DEFAULT 0.70,
  mode VARCHAR(50) DEFAULT 'default',
  retrieved_at TIMESTAMP DEFAULT now(),
  last_verified TIMESTAMP DEFAULT now(),
  usage_count INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_ai_knowledge_base_school_question
  ON ai_knowledge_base(school_id, question_hash);

CREATE INDEX IF NOT EXISTS ai_knowledge_base_question_hash_idx
  ON ai_knowledge_base(question_hash);

CREATE INDEX IF NOT EXISTS ai_knowledge_base_school_id_academic_year_idx
  ON ai_knowledge_base(school_id, academic_year);

CREATE INDEX IF NOT EXISTS ai_knowledge_base_last_verified_idx
  ON ai_knowledge_base(last_verified);
