CREATE TABLE IF NOT EXISTS ai_knowledge_sources (
  id SERIAL PRIMARY KEY,
  source_key VARCHAR(150) NOT NULL UNIQUE,
  source_type VARCHAR(50) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100,
  base_url VARCHAR(500),
  is_official BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT true,
  config JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_sources_type_priority
  ON ai_knowledge_sources(source_type, priority);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_sources_enabled
  ON ai_knowledge_sources(is_enabled);

CREATE TABLE IF NOT EXISTS ai_knowledge_queries (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(150) NOT NULL UNIQUE,
  school_id INTEGER,
  user_id INTEGER,
  prompt_hash VARCHAR(128),
  prompt_excerpt TEXT,
  answer_excerpt TEXT,
  source_trace JSONB,
  priority_trace JSONB,
  provider_key VARCHAR(100),
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_queries_school_created
  ON ai_knowledge_queries(school_id, created_at);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_queries_user_created
  ON ai_knowledge_queries(user_id, created_at);

CREATE TABLE IF NOT EXISTS ai_action_requests (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(150) NOT NULL UNIQUE,
  school_id INTEGER,
  academic_year_id INTEGER,
  requested_by INTEGER,
  module_name VARCHAR(100) NOT NULL,
  action_type VARCHAR(120) NOT NULL,
  target_entity_type VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
  risk_level VARCHAR(50) DEFAULT 'MEDIUM',
  prompt TEXT,
  normalized_payload JSONB,
  preview JSONB,
  validation_errors JSONB,
  approval_policy JSONB,
  approved_by INTEGER,
  approved_at TIMESTAMP(6),
  rejected_by INTEGER,
  rejected_at TIMESTAMP(6),
  executed_by INTEGER,
  executed_at TIMESTAMP(6),
  execution_result JSONB,
  failure_reason TEXT,
  event_id INTEGER,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_action_requests_school_status
  ON ai_action_requests(school_id, status);

CREATE INDEX IF NOT EXISTS idx_ai_action_requests_action_status
  ON ai_action_requests(action_type, status);

CREATE INDEX IF NOT EXISTS idx_ai_action_requests_requested_created
  ON ai_action_requests(requested_by, created_at);

CREATE TABLE IF NOT EXISTS ai_action_approvals (
  id SERIAL PRIMARY KEY,
  action_request_id INTEGER NOT NULL,
  user_id INTEGER,
  decision VARCHAR(50) NOT NULL,
  comments TEXT,
  metadata JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_action_approvals_request
  ON ai_action_approvals(action_request_id);

CREATE INDEX IF NOT EXISTS idx_ai_action_approvals_user_created
  ON ai_action_approvals(user_id, created_at);

CREATE TABLE IF NOT EXISTS ai_observability_events (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(150),
  school_id INTEGER,
  user_id INTEGER,
  layer VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  provider_key VARCHAR(100),
  source_type VARCHAR(50),
  action_request_id INTEGER,
  latency_ms INTEGER,
  estimated_cost DECIMAL(12, 6) DEFAULT 0,
  success BOOLEAN DEFAULT true,
  payload JSONB,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_observability_school_layer_created
  ON ai_observability_events(school_id, layer, created_at);

CREATE INDEX IF NOT EXISTS idx_ai_observability_action_request
  ON ai_observability_events(action_request_id);

CREATE INDEX IF NOT EXISTS idx_ai_observability_request
  ON ai_observability_events(request_id);

INSERT INTO permissions (module_name, action_name)
SELECT 'AI', action_name
FROM (
  VALUES
    ('KNOWLEDGE'),
    ('ACTION_REQUEST'),
    ('APPROVE_ACTION'),
    ('EXECUTE_ACTION'),
    ('VIEW_OBSERVABILITY')
) AS p(action_name)
WHERE NOT EXISTS (
  SELECT 1
  FROM permissions existing
  WHERE existing.module_name = 'AI'
    AND existing.action_name = p.action_name
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
  ON p.module_name = 'AI'
 AND p.action_name IN (
   'KNOWLEDGE',
   'ACTION_REQUEST',
   'APPROVE_ACTION',
   'EXECUTE_ACTION',
   'VIEW_OBSERVABILITY'
 )
WHERE r.role_name = 'SUPER_ADMIN'
  AND NOT EXISTS (
    SELECT 1
    FROM role_permissions rp
    WHERE rp.role_id = r.id
      AND rp.permission_id = p.id
  );

INSERT INTO module_permissions (
  school_id,
  module_key,
  module_name,
  action_key,
  permission_key,
  is_enabled,
  config
)
SELECT NULL, module_key, module_name, action_key, permission_key, true, '{}'::jsonb
FROM (
  VALUES
    ('ai_knowledge', 'TOTTECH AI Knowledge', 'knowledge', 'AI.KNOWLEDGE'),
    ('ai_action_request', 'TOTTECH AI Actions', 'action_request', 'AI.ACTION_REQUEST'),
    ('ai_approval', 'TOTTECH AI Approvals', 'approve_action', 'AI.APPROVE_ACTION'),
    ('ai_execution', 'TOTTECH AI Execution', 'execute_action', 'AI.EXECUTE_ACTION'),
    ('ai_observability', 'TOTTECH AI Observability', 'view_observability', 'AI.VIEW_OBSERVABILITY')
) AS m(module_key, module_name, action_key, permission_key)
WHERE NOT EXISTS (
  SELECT 1
  FROM module_permissions existing
  WHERE existing.school_id IS NULL
    AND existing.module_key = m.module_key
    AND existing.action_key = m.action_key
);

INSERT INTO ai_knowledge_sources (
  source_key,
  source_type,
  display_name,
  priority,
  base_url,
  is_official,
  is_enabled,
  config
)
VALUES
  ('erp_database', 'ERP', 'TOTTECH ONE ERP Database', 10, NULL, false, true, '{"coverage":["schools","students","teachers","attendance","finance","hostel","transport","dining","academics"]}'::jsonb),
  ('event_ledger', 'ERP', 'TOTTECH ONE Event Ledger', 15, NULL, false, true, '{"coverage":["audit","timeline","operations","ai_actions"]}'::jsonb),
  ('document_storage', 'DOCUMENT', 'TOTTECH ONE Document Storage', 30, NULL, false, true, '{"paths":["public/uploads","public/downloads"],"content_indexing":"pending"}'::jsonb),
  ('ap_school_education', 'OFFICIAL', 'Andhra Pradesh Commissionerate of School Education', 50, 'https://cse.ap.gov.in', true, true, '{"topics":["AP Government GO","School Education","Academic Policies","Circulars"]}'::jsonb),
  ('ap_board_secondary', 'OFFICIAL', 'Andhra Pradesh Board of Secondary Education', 52, 'https://bse.ap.gov.in', true, true, '{"topics":["Examination Rules","SSC","School Board"]}'::jsonb),
  ('cbse', 'OFFICIAL', 'Central Board of Secondary Education', 55, 'https://www.cbse.gov.in', true, true, '{"topics":["CBSE","Examination Rules","Affiliation","Circulars"]}'::jsonb),
  ('ncert', 'OFFICIAL', 'NCERT', 58, 'https://www.ncert.nic.in', true, true, '{"topics":["NCERT","Curriculum","Textbooks","Learning Outcomes"]}'::jsonb),
  ('ugc', 'OFFICIAL', 'University Grants Commission', 65, 'https://www.ugc.gov.in', true, true, '{"topics":["UGC","Higher Education","Scholarships","Regulations"]}'::jsonb),
  ('aicte', 'OFFICIAL', 'All India Council for Technical Education', 68, 'https://www.aicte-india.org', true, true, '{"topics":["AICTE","Technical Education","Approvals","Policies"]}'::jsonb),
  ('ministry_education', 'OFFICIAL', 'Ministry of Education, Government of India', 70, 'https://www.education.gov.in', true, true, '{"topics":["Education News","National Policy","Government Circulars"]}'::jsonb),
  ('internet_search', 'INTERNET', 'Governed Internet Search', 100, NULL, false, false, '{"requires_env":"TOTTECH_AI_ENABLE_WEB_SEARCH=true","policy":"official_sources_first"}'::jsonb)
ON CONFLICT (source_key)
DO UPDATE SET
  source_type = EXCLUDED.source_type,
  display_name = EXCLUDED.display_name,
  priority = EXCLUDED.priority,
  base_url = EXCLUDED.base_url,
  is_official = EXCLUDED.is_official,
  is_enabled = EXCLUDED.is_enabled,
  config = EXCLUDED.config,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO event_ledger (
  school_id,
  user_id,
  actor_role,
  module_name,
  event_type,
  action,
  entity_type,
  summary,
  payload
)
VALUES (
  NULL,
  NULL,
  'SYSTEM',
  'ai',
  'AGENTIC_AI_PLATFORM_MIGRATED',
  'migrate',
  'ai_platform',
  'TOTTECH AI agentic knowledge/action/approval platform schema deployed',
  '{"layers":["knowledge","action","approval"],"safety":"preview_approval_execute_event_ledger"}'::jsonb
);
