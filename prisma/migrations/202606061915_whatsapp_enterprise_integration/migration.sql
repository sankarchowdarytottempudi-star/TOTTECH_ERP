-- TOTTECH ONE WhatsApp enterprise notification substrate.
-- Idempotent because this recovered production database is managed by direct SQL.

CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(150) UNIQUE NOT NULL,
  trigger_event VARCHAR(150),
  description TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  academic_year_id INTEGER,
  student_id INTEGER,
  user_id INTEGER,
  template_name VARCHAR(150) NOT NULL,
  recipient VARCHAR(50),
  recipient_masked VARCHAR(50),
  variables JSONB DEFAULT '[]'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  message_preview TEXT,
  status VARCHAR(50) DEFAULT 'QUEUED',
  delivery_status VARCHAR(50) DEFAULT 'PENDING',
  provider_message_id VARCHAR(255),
  provider_response JSONB,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_error TEXT,
  triggered_by VARCHAR(150),
  entity_type VARCHAR(100),
  entity_id INTEGER,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_scope
  ON whatsapp_messages(school_id, academic_year_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status
  ON whatsapp_messages(status, next_attempt_at);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_template
  ON whatsapp_messages(template_name);

CREATE TABLE IF NOT EXISTS whatsapp_delivery_events (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES whatsapp_messages(id) ON DELETE CASCADE,
  delivery_status VARCHAR(50),
  provider_response JSONB,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS whatsapp_retry_attempts (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES whatsapp_messages(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  error_message TEXT,
  provider_response JSONB,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_retry_attempts_message
  ON whatsapp_retry_attempts(message_id, attempted_at);

INSERT INTO whatsapp_templates (template_name, trigger_event, description, variables)
VALUES
  ('student_created', 'STUDENT_CREATED', 'Student creation notification', '["Student Name","Admission Number","School Name"]'::jsonb),
  ('payment_received', 'PAYMENT_RECORDED', 'Payment received notification', '["Student Name","Invoice Number","Payment Reference","Amount Paid","Balance","Receipt URL"]'::jsonb),
  ('invoice_created', 'INVOICE_GENERATED', 'Invoice generated notification', '["Student Name","Invoice Number","Amount","Due Date"]'::jsonb),
  ('payment_due_reminder', 'PAYMENT_DUE_REMINDER', 'Fee due reminder notification', '["Student Name","Invoice Number","Amount Due","Due Date","Reminder Message","Invoice URL"]'::jsonb),
  ('homework_assigned', 'HOMEWORK_ASSIGNED', 'Homework assigned notification', '["Student Name","Homework Title","Subject","Class/Section","Due Date","Homework Details"]'::jsonb),
  ('exam_schedule_created', 'EXAM_SCHEDULE_CREATED', 'Exam scheduled notification', '["Student Name","Exam Name","Subject","Date","Time","Room"]'::jsonb),
  ('exam_schedule_reminder', 'EXAM_SCHEDULE_REMINDER', 'Exam schedule reminder notification', '["Student Name","Exam Name","Class/Section","First Exam Date","Schedule Summary"]'::jsonb),
  ('monthly_attendance_report', 'MONTHLY_ATTENDANCE_REPORT', 'Monthly attendance report notification', '["Student Name","Month","Attendance %","Present","Absent","Late","Leave"]'::jsonb)
ON CONFLICT (template_name)
DO UPDATE SET
  trigger_event = EXCLUDED.trigger_event,
  description = EXCLUDED.description,
  variables = EXCLUDED.variables,
  updated_at = CURRENT_TIMESTAMP;

