-- TOTTECH ONE - PF Compliance Module

ALTER TABLE "hr_staff_master"
  ADD COLUMN IF NOT EXISTS "pf_number" varchar(50),
  ADD COLUMN IF NOT EXISTS "uan_number" varchar(50),
  ADD COLUMN IF NOT EXISTS "pf_joining_date" date,
  ADD COLUMN IF NOT EXISTS "pf_status" varchar(50);

DO $$
BEGIN
  INSERT INTO "event_type_catalog" ("module_name", "event_type", "description")
  VALUES
    ('HRMS', 'PF_PORTAL_OPENED', 'Provident Fund portal launched'),
    ('HRMS', 'PF_DETAILS_UPDATED', 'Provident Fund details updated'),
    ('HRMS', 'PF_NUMBER_ADDED', 'Provident Fund number added'),
    ('HRMS', 'UAN_NUMBER_UPDATED', 'UAN number updated')
  ON CONFLICT DO NOTHING;
EXCEPTION
  WHEN undefined_table THEN
    NULL;
END $$;
