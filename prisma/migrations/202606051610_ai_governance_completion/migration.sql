-- CreateTable
CREATE TABLE "ai_role_access" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "policy_profile_id" INTEGER,
    "module_name" VARCHAR(100),
    "can_use" BOOLEAN DEFAULT false,
    "can_manage" BOOLEAN DEFAULT false,
    "config" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_role_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_provider_credentials" (
    "id" SERIAL NOT NULL,
    "provider_key" VARCHAR(100) NOT NULL,
    "credential_label" VARCHAR(150),
    "encrypted_credentials_ref" TEXT NOT NULL,
    "rotation_status" VARCHAR(100) DEFAULT 'NEEDS_CONFIGURATION',
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_provider_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_provider_fallbacks" (
    "id" SERIAL NOT NULL,
    "provider_key" VARCHAR(100) NOT NULL,
    "fallback_provider_key" VARCHAR(100) NOT NULL,
    "priority" INTEGER DEFAULT 100,
    "is_enabled" BOOLEAN DEFAULT true,
    "config" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_provider_fallbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_rate_limits" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "role_id" INTEGER,
    "provider_key" VARCHAR(100),
    "requests_per_day" INTEGER,
    "tokens_per_day" INTEGER,
    "is_enabled" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_cost_budgets" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "provider_key" VARCHAR(100),
    "period" VARCHAR(50) NOT NULL,
    "budget_amount" DECIMAL(12,2) DEFAULT 0,
    "spent_amount" DECIMAL(12,2) DEFAULT 0,
    "alert_threshold" DECIMAL(5,2) DEFAULT 80,
    "is_enabled" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_cost_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompt_templates" (
    "id" SERIAL NOT NULL,
    "template_key" VARCHAR(150) NOT NULL,
    "module_name" VARCHAR(100),
    "system_prompt" TEXT,
    "user_prompt" TEXT,
    "is_enabled" BOOLEAN DEFAULT true,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_grounding_sources" (
    "id" SERIAL NOT NULL,
    "source_key" VARCHAR(150) NOT NULL,
    "module_name" VARCHAR(100),
    "table_name" VARCHAR(150),
    "source_policy" JSONB,
    "is_enabled" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_grounding_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_role_access_policy_profile_id_idx" ON "ai_role_access"("policy_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_ai_role_module_access" ON "ai_role_access"("role_id", "module_name");

-- CreateIndex
CREATE INDEX "ai_provider_credentials_provider_key_idx" ON "ai_provider_credentials"("provider_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_ai_provider_fallback" ON "ai_provider_fallbacks"("provider_key", "fallback_provider_key");

-- CreateIndex
CREATE INDEX "ai_rate_limits_school_id_role_id_idx" ON "ai_rate_limits"("school_id", "role_id");

-- CreateIndex
CREATE INDEX "ai_cost_budgets_school_id_period_idx" ON "ai_cost_budgets"("school_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "ai_prompt_templates_template_key_key" ON "ai_prompt_templates"("template_key");

-- CreateIndex
CREATE UNIQUE INDEX "ai_grounding_sources_source_key_key" ON "ai_grounding_sources"("source_key");

INSERT INTO ai_role_access (role_id, policy_profile_id, module_name, can_use, can_manage, config)
SELECT
    r.id,
    p.id,
    module_seed.module_name,
    true,
    EXISTS (
        SELECT 1
        FROM role_permissions rp
        JOIN permissions perm ON perm.id = rp.permission_id
        WHERE rp.role_id = r.id
          AND perm.module_name = 'AI'
          AND perm.action_name = 'MANAGE'
    ),
    '{"source":"migration","databaseDriven":true}'::jsonb
FROM roles r
LEFT JOIN ai_policy_profiles p ON p.profile_key = 'default-governed'
Cross JOIN (
    VALUES
        ('schoolgpt'),
        ('finance'),
        ('attendance'),
        ('reports'),
        ('teacher'),
        ('war-room'),
        ('dining'),
        ('hostel'),
        ('transport')
) AS module_seed(module_name)
ON CONFLICT ("role_id", "module_name") DO NOTHING;

INSERT INTO ai_provider_fallbacks (provider_key, fallback_provider_key, priority, is_enabled, config)
VALUES
    ('gemini', 'deterministic', 1000, true, '{"reason":"recovery fallback"}'::jsonb),
    ('openai', 'deterministic', 1000, true, '{"reason":"recovery fallback"}'::jsonb),
    ('claude', 'deterministic', 1000, true, '{"reason":"recovery fallback"}'::jsonb),
    ('deepseek', 'deterministic', 1000, true, '{"reason":"recovery fallback"}'::jsonb),
    ('ollama', 'deterministic', 1000, true, '{"reason":"recovery fallback"}'::jsonb),
    ('qwen', 'deterministic', 1000, true, '{"reason":"recovery fallback"}'::jsonb),
    ('mistral', 'deterministic', 1000, true, '{"reason":"recovery fallback"}'::jsonb),
    ('local', 'deterministic', 1000, true, '{"reason":"recovery fallback"}'::jsonb)
ON CONFLICT ("provider_key", "fallback_provider_key") DO NOTHING;

INSERT INTO ai_rate_limits (school_id, role_id, provider_key, requests_per_day, tokens_per_day, is_enabled)
SELECT NULL, r.id, 'deterministic', 500, 500000, true
FROM roles r;

INSERT INTO ai_cost_budgets (school_id, provider_key, period, budget_amount, spent_amount, alert_threshold, is_enabled)
VALUES
    (NULL, 'deterministic', 'MONTHLY', 0, 0, 80, true),
    (NULL, 'gemini', 'MONTHLY', 0, 0, 80, false),
    (NULL, 'openai', 'MONTHLY', 0, 0, 80, false),
    (NULL, 'claude', 'MONTHLY', 0, 0, 80, false),
    (NULL, 'deepseek', 'MONTHLY', 0, 0, 80, false),
    (NULL, 'ollama', 'MONTHLY', 0, 0, 80, false),
    (NULL, 'qwen', 'MONTHLY', 0, 0, 80, false),
    (NULL, 'mistral', 'MONTHLY', 0, 0, 80, false),
    (NULL, 'local', 'MONTHLY', 0, 0, 80, false);

INSERT INTO ai_prompt_templates (template_key, module_name, system_prompt, user_prompt, is_enabled)
VALUES
    ('schoolgpt.default', 'schoolgpt', 'You are TOTTECH AI. Ground every answer in the active school, academic year, RBAC permissions, event ledger, and ERP records.', '{{question}}', true),
    ('finance.default', 'finance', 'You are TOTTECH AI for finance. Use fees, invoices, payments, concessions, and event ledger records only.', '{{question}}', true),
    ('attendance.default', 'attendance', 'You are TOTTECH AI for attendance. Use attendance records, academic year, school context, and timelines only.', '{{question}}', true),
    ('war-room.default', 'war-room', 'You are TOTTECH AI for operations. Summarize risks from governed ERP records and event ledger facts.', '{{question}}', true)
ON CONFLICT ("template_key") DO NOTHING;

INSERT INTO ai_grounding_sources (source_key, module_name, table_name, source_policy, is_enabled)
VALUES
    ('academic_year', 'core', 'academic_years', '{"required":true}'::jsonb, true),
    ('school_context', 'core', 'schools', '{"required":true}'::jsonb, true),
    ('rbac_permissions', 'governance', 'role_permissions', '{"required":true}'::jsonb, true),
    ('event_ledger', 'timeline', 'event_ledger', '{"required":true}'::jsonb, true),
    ('students', 'students', 'students', '{"scope":"school"}'::jsonb, true),
    ('teachers', 'teachers', 'teachers', '{"scope":"school"}'::jsonb, true),
    ('finance', 'finance', 'fees', '{"scope":"school"}'::jsonb, true),
    ('attendance', 'attendance', 'attendance_master', '{"scope":"school"}'::jsonb, true)
ON CONFLICT ("source_key") DO NOTHING;
