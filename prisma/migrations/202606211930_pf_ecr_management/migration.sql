-- TOTTECH ONE - Provident Fund (PF) & ECR Management

ALTER TABLE "hr_staff_master"
  ADD COLUMN IF NOT EXISTS "pf_applicable" boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS "eps_applicable" boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS "pf_exit_date" date,
  ADD COLUMN IF NOT EXISTS "basic_salary" numeric(12,2),
  ADD COLUMN IF NOT EXISTS "da" numeric(12,2),
  ADD COLUMN IF NOT EXISTS "pf_wage" numeric(12,2),
  ADD COLUMN IF NOT EXISTS "voluntary_pf_percent" numeric(5,2),
  ADD COLUMN IF NOT EXISTS "employer_pf_percent" numeric(5,2);

CREATE TABLE IF NOT EXISTS "hr_pf_ledgers" (
  "id" SERIAL PRIMARY KEY,
  "school_id" integer,
  "academic_year_id" integer,
  "staff_id" integer,
  "payroll_run_id" integer,
  "payroll_batch" varchar(120),
  "payroll_month" integer,
  "payroll_year" integer,
  "uan_number" varchar(50),
  "pf_member_id" varchar(50),
  "pf_applicable" boolean DEFAULT true,
  "eps_applicable" boolean DEFAULT true,
  "basic_salary" numeric(12,2),
  "da" numeric(12,2),
  "pf_wage" numeric(12,2),
  "employee_pf" numeric(12,2),
  "employer_pf" numeric(12,2),
  "eps" numeric(12,2),
  "edli" numeric(12,2),
  "filed_status" varchar(40) DEFAULT 'PENDING',
  "filed_at" timestamp(6),
  "created_by" integer,
  "updated_by" integer,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_hr_pf_ledgers_scope"
  ON "hr_pf_ledgers" ("school_id", "academic_year_id", "payroll_year", "payroll_month");

CREATE INDEX IF NOT EXISTS "idx_hr_pf_ledgers_uan"
  ON "hr_pf_ledgers" ("school_id", "uan_number");

ALTER TABLE "hr_pf_ledgers"
  ADD CONSTRAINT "fk_hr_pf_ledgers_school"
  FOREIGN KEY ("school_id") REFERENCES "schools" ("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "hr_pf_ledgers"
  ADD CONSTRAINT "fk_hr_pf_ledgers_academic_year"
  FOREIGN KEY ("academic_year_id") REFERENCES "academic_years" ("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "hr_pf_ledgers"
  ADD CONSTRAINT "fk_hr_pf_ledgers_staff"
  FOREIGN KEY ("staff_id") REFERENCES "hr_staff_master" ("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "hr_pf_ledgers"
  ADD CONSTRAINT "fk_hr_pf_ledgers_payroll_run"
  FOREIGN KEY ("payroll_run_id") REFERENCES "hr_payroll_runs" ("id")
  ON DELETE SET NULL ON UPDATE NO ACTION;

DO $$
BEGIN
  INSERT INTO "event_type_catalog" ("module_name", "event_type", "description")
  VALUES
    ('HRMS', 'PF_PROFILE_UPDATED', 'Provident Fund profile updated'),
    ('HRMS', 'PF_LEDGER_CREATED', 'Provident Fund monthly ledger created'),
    ('HRMS', 'PF_ECR_GENERATED', 'Provident Fund ECR file generated'),
    ('HRMS', 'PF_ECR_DOWNLOADED', 'Provident Fund ECR file downloaded'),
    ('HRMS', 'PF_PORTAL_OPENED', 'Provident Fund EPFO portal opened')
  ON CONFLICT DO NOTHING;
EXCEPTION
  WHEN undefined_table THEN
    NULL;
END $$;
