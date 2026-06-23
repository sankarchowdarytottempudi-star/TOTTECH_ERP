-- Link teachers to staff master for HRMS -> PF -> ECR flow

ALTER TABLE "teachers"
  ADD COLUMN IF NOT EXISTS "staff_id" integer;

ALTER TABLE "hr_staff_master"
  ADD COLUMN IF NOT EXISTS "teacher_id" integer;

CREATE UNIQUE INDEX IF NOT EXISTS "uq_teachers_staff_id"
  ON "teachers" ("staff_id");

CREATE UNIQUE INDEX IF NOT EXISTS "uq_hr_staff_master_teacher_id"
  ON "hr_staff_master" ("teacher_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_teachers_staff_id'
  ) THEN
    ALTER TABLE "teachers"
      ADD CONSTRAINT "fk_teachers_staff_id"
      FOREIGN KEY ("staff_id") REFERENCES "hr_staff_master" ("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_hr_staff_master_teacher_id'
  ) THEN
    ALTER TABLE "hr_staff_master"
      ADD CONSTRAINT "fk_hr_staff_master_teacher_id"
      FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
  END IF;
END $$;

-- Best-effort historical backfill using existing employee IDs where both records already exist.
UPDATE "teachers" t
SET "staff_id" = s.id
FROM "hr_staff_master" s
WHERE t."staff_id" IS NULL
  AND t."employee_id" IS NOT NULL
  AND s."employee_id" = t."employee_id";

UPDATE "hr_staff_master" s
SET "teacher_id" = t.id
FROM "teachers" t
WHERE s."teacher_id" IS NULL
  AND t."employee_id" IS NOT NULL
  AND s."employee_id" = t."employee_id";
