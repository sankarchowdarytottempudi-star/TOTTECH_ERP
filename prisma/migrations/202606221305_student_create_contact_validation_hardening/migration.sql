ALTER TABLE students
  ADD COLUMN IF NOT EXISTS has_backlogs BOOLEAN DEFAULT FALSE;

UPDATE students
SET has_backlogs = FALSE
WHERE has_backlogs IS NULL;
