-- School Expense Management completion migration.

ALTER TABLE school_expenses
  ADD COLUMN IF NOT EXISTS class_id INTEGER,
  ADD COLUMN IF NOT EXISTS section_id INTEGER,
  ADD COLUMN IF NOT EXISTS expense_type VARCHAR(80),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS paid_by INTEGER,
  ADD COLUMN IF NOT EXISTS rejected_by INTEGER,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_school_expenses_class_section
  ON school_expenses(school_id, academic_year_id, class_id, section_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_school_expenses_created_by
  ON school_expenses(school_id, created_by, expense_date);

CREATE TABLE IF NOT EXISTS expense_categories (
  id SERIAL PRIMARY KEY,
  school_id INTEGER,
  category_code VARCHAR(80) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  category_group VARCHAR(80),
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_expense_categories UNIQUE (school_id, category_code)
);

CREATE INDEX IF NOT EXISTS idx_expense_categories_scope
  ON expense_categories(school_id, is_active, category_group);

CREATE TABLE IF NOT EXISTS school_expense_events (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL,
  academic_year_id INTEGER,
  expense_id INTEGER NOT NULL,
  event_type VARCHAR(80) NOT NULL,
  actor_user_id INTEGER,
  actor_role VARCHAR(80),
  summary TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_school_expense_events_scope
  ON school_expense_events(school_id, academic_year_id, expense_id, created_at DESC);

INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'SALARY', 'Salary', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'SALARY');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'BUS_FUEL', 'Bus Fuel', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'BUS_FUEL');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'BUS_MAINTENANCE', 'Bus Maintenance', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'BUS_MAINTENANCE');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'STATIONERY', 'Stationery', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'STATIONERY');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'ELECTRICITY', 'Electricity', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'ELECTRICITY');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'WATER', 'Water', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'WATER');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'INTERNET', 'Internet', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'INTERNET');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'LABORATORY', 'Laboratory', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'LABORATORY');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'LIBRARY', 'Library', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'LIBRARY');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'SPORTS', 'Sports', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'SPORTS');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'FURNITURE', 'Furniture', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'FURNITURE');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'EQUIPMENT', 'Equipment', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'EQUIPMENT');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'REPAIRS', 'Repairs', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'REPAIRS');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'BUILDING_MAINTENANCE', 'Building Maintenance', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'BUILDING_MAINTENANCE');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'MARKETING', 'Marketing', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'MARKETING');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'EVENTS', 'Events', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'EVENTS');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'EXAM_EXPENSES', 'Exam Expenses', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'EXAM_EXPENSES');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'PRINTING', 'Printing', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'PRINTING');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'SOFTWARE_SUBSCRIPTION', 'Software Subscription', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'SOFTWARE_SUBSCRIPTION');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'TRANSPORT', 'Transport', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'TRANSPORT');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'DINING', 'Dining', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'DINING');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'HOSTEL', 'Hostel', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'HOSTEL');
INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
SELECT NULL, 'MISCELLANEOUS', 'Miscellaneous', 'DEFAULT', FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM expense_categories WHERE school_id IS NULL AND category_code = 'MISCELLANEOUS');
