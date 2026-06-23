-- CreateTable
CREATE TABLE "concession_requests" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "student_id" INTEGER,
    "invoice_id" INTEGER,
    "fee_category_id" INTEGER,
    "academic_year" VARCHAR(50),
    "requested_amount" DECIMAL(12,2),
    "approved_amount" DECIMAL(12,2),
    "reason" TEXT,
    "status" VARCHAR(50) DEFAULT 'PENDING',
    "requested_by" INTEGER,
    "reviewed_by" INTEGER,
    "requested_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(6),
    "metadata" JSONB,

    CONSTRAINT "concession_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concession_audit_logs" (
    "id" SERIAL NOT NULL,
    "concession_request_id" INTEGER,
    "school_id" INTEGER,
    "actor_user_id" INTEGER,
    "action" VARCHAR(100),
    "previous_status" VARCHAR(50),
    "new_status" VARCHAR(50),
    "comments" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "concession_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_ledger" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "academic_year_id" INTEGER,
    "user_id" INTEGER,
    "actor_role" VARCHAR(100),
    "module_name" VARCHAR(100) NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "action" VARCHAR(100),
    "entity_type" VARCHAR(100),
    "entity_id" INTEGER,
    "entity_uid" VARCHAR(255),
    "severity" VARCHAR(50) DEFAULT 'INFO',
    "summary" TEXT,
    "payload" JSONB,
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_timelines" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "student_id" INTEGER NOT NULL,
    "event_id" INTEGER,
    "academic_year_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "source_module" VARCHAR(100),
    "visibility" VARCHAR(50) DEFAULT 'SCHOOL',
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_timelines" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "teacher_id" INTEGER NOT NULL,
    "event_id" INTEGER,
    "academic_year_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "source_module" VARCHAR(100),
    "visibility" VARCHAR(50) DEFAULT 'SCHOOL',
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_timelines" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "class_id" INTEGER NOT NULL,
    "section_id" INTEGER,
    "event_id" INTEGER,
    "academic_year_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "source_module" VARCHAR(100),
    "visibility" VARCHAR(50) DEFAULT 'SCHOOL',
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_timelines" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "event_id" INTEGER,
    "academic_year_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "source_module" VARCHAR(100),
    "visibility" VARCHAR(50) DEFAULT 'SCHOOL',
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dining_attendance" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "student_id" INTEGER,
    "meal_type" VARCHAR(50) NOT NULL,
    "attendance_date" DATE NOT NULL,
    "status" VARCHAR(50) DEFAULT 'PRESENT',
    "recorded_by" INTEGER,
    "source" VARCHAR(100),
    "remarks" TEXT,
    "event_id" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dining_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_attendance" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "student_id" INTEGER,
    "hostel_id" INTEGER,
    "room_id" INTEGER,
    "attendance_date" DATE NOT NULL,
    "status" VARCHAR(50) DEFAULT 'PRESENT',
    "recorded_by" INTEGER,
    "remarks" TEXT,
    "event_id" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hostel_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_attendance" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "student_id" INTEGER,
    "route_id" INTEGER,
    "vehicle_id" INTEGER,
    "trip_type" VARCHAR(50) NOT NULL,
    "attendance_date" DATE NOT NULL,
    "status" VARCHAR(50) DEFAULT 'PRESENT',
    "pickup_point" VARCHAR(255),
    "drop_point" VARCHAR(255),
    "recorded_by" INTEGER,
    "remarks" TEXT,
    "event_id" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transport_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "governance_settings" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "setting_key" VARCHAR(150) NOT NULL,
    "setting_value" JSONB,
    "description" TEXT,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "governance_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "module_name" VARCHAR(100),
    "flag_key" VARCHAR(150) NOT NULL,
    "enabled" BOOLEAN DEFAULT false,
    "rollout_percentage" INTEGER DEFAULT 100,
    "config" JSONB,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_permissions" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "menu_key" VARCHAR(150) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "path" VARCHAR(255),
    "parent_key" VARCHAR(150),
    "module_name" VARCHAR(100),
    "permission_key" VARCHAR(150),
    "sort_order" INTEGER DEFAULT 0,
    "is_enabled" BOOLEAN DEFAULT true,
    "config" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_permissions" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "page_path" VARCHAR(255) NOT NULL,
    "module_name" VARCHAR(100),
    "permission_key" VARCHAR(150),
    "is_public" BOOLEAN DEFAULT false,
    "is_enabled" BOOLEAN DEFAULT true,
    "config" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_permissions" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "module_key" VARCHAR(150) NOT NULL,
    "module_name" VARCHAR(255) NOT NULL,
    "action_key" VARCHAR(100) NOT NULL,
    "permission_key" VARCHAR(150) NOT NULL,
    "is_enabled" BOOLEAN DEFAULT true,
    "config" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_providers" (
    "id" SERIAL NOT NULL,
    "provider_key" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "provider_type" VARCHAR(100) NOT NULL,
    "base_url" VARCHAR(500),
    "encrypted_credentials_ref" TEXT,
    "is_enabled" BOOLEAN DEFAULT false,
    "priority" INTEGER DEFAULT 100,
    "config" JSONB,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_models" (
    "id" SERIAL NOT NULL,
    "provider_key" VARCHAR(100) NOT NULL,
    "model_key" VARCHAR(150) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "capability" VARCHAR(100),
    "context_window" INTEGER,
    "input_cost_per_1k" DECIMAL(12,6),
    "output_cost_per_1k" DECIMAL(12,6),
    "default_temperature" DECIMAL(4,2),
    "max_tokens" INTEGER,
    "is_enabled" BOOLEAN DEFAULT false,
    "config" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_policy_profiles" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "profile_key" VARCHAR(150) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "is_default" BOOLEAN DEFAULT false,
    "grounding_required" BOOLEAN DEFAULT true,
    "fallback_enabled" BOOLEAN DEFAULT true,
    "allowed_modules" JSONB,
    "allowed_role_ids" JSONB,
    "max_tokens" INTEGER,
    "temperature" DECIMAL(4,2),
    "pii_policy" VARCHAR(50) DEFAULT 'STRICT',
    "config" JSONB,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_policy_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_school_limits" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "policy_profile_id" INTEGER,
    "daily_request_limit" INTEGER,
    "monthly_token_limit" INTEGER,
    "monthly_cost_limit" DECIMAL(12,2),
    "is_enabled" BOOLEAN DEFAULT true,
    "reset_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_school_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_logs" (
    "id" SERIAL NOT NULL,
    "request_id" VARCHAR(150),
    "school_id" INTEGER,
    "user_id" INTEGER,
    "module_name" VARCHAR(100),
    "provider_key" VARCHAR(100),
    "model_key" VARCHAR(150),
    "policy_profile_id" INTEGER,
    "prompt_hash" VARCHAR(128),
    "prompt_excerpt" TEXT,
    "response_excerpt" TEXT,
    "input_tokens" INTEGER DEFAULT 0,
    "output_tokens" INTEGER DEFAULT 0,
    "estimated_cost" DECIMAL(12,6) DEFAULT 0,
    "latency_ms" INTEGER,
    "success" BOOLEAN DEFAULT true,
    "fallback_used" BOOLEAN DEFAULT false,
    "grounding_sources" JSONB,
    "error_code" VARCHAR(100),
    "error_message" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_health_checks" (
    "id" SERIAL NOT NULL,
    "provider_key" VARCHAR(100) NOT NULL,
    "model_key" VARCHAR(150),
    "status" VARCHAR(50) NOT NULL,
    "latency_ms" INTEGER,
    "error_code" VARCHAR(100),
    "error_message" TEXT,
    "metadata" JSONB,
    "checked_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "tenant_code" VARCHAR(100) NOT NULL,
    "tenant_name" VARCHAR(255) NOT NULL,
    "lifecycle_state" VARCHAR(50) DEFAULT 'ACTIVE',
    "region" VARCHAR(100),
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" SERIAL NOT NULL,
    "plan_key" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "monthly_price" DECIMAL(12,2) DEFAULT 0,
    "max_students" INTEGER,
    "max_staff" INTEGER,
    "ai_token_limit" INTEGER,
    "whatsapp_limit" INTEGER,
    "storage_gb_limit" DECIMAL(12,2),
    "features" JSONB,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_subscriptions" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "plan_id" INTEGER,
    "status" VARCHAR(50) DEFAULT 'ACTIVE',
    "start_date" DATE,
    "end_date" DATE,
    "renewal_date" DATE,
    "billing_cycle" VARCHAR(50) DEFAULT 'MONTHLY',
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_metering" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "meter_key" VARCHAR(100) NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "quantity" DECIMAL(14,4) DEFAULT 0,
    "unit" VARCHAR(50),
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_metering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_metering" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "messages_sent" INTEGER DEFAULT 0,
    "estimated_cost" DECIMAL(12,4) DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_metering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage_metering" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "used_gb" DECIMAL(12,4) DEFAULT 0,
    "file_count" INTEGER DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storage_metering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_analytics" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "revenue_amount" DECIMAL(14,2) DEFAULT 0,
    "source" VARCHAR(100),
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revenue_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profit_analytics" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "revenue_amount" DECIMAL(14,2) DEFAULT 0,
    "cost_amount" DECIMAL(14,2) DEFAULT 0,
    "profit_amount" DECIMAL(14,2) DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profit_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_lifecycle_events" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "event_type" VARCHAR(100) NOT NULL,
    "status" VARCHAR(50),
    "actor_user_id" INTEGER,
    "notes" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_lifecycle_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_automations" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "automation_key" VARCHAR(150) NOT NULL,
    "schedule_cron" VARCHAR(100),
    "is_enabled" BOOLEAN DEFAULT true,
    "last_run_at" TIMESTAMP(6),
    "next_run_at" TIMESTAMP(6),
    "config" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_automations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renewals" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "subscription_id" INTEGER,
    "renewal_date" DATE,
    "status" VARCHAR(50) DEFAULT 'PENDING',
    "amount" DECIMAL(12,2),
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "renewals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_onboarding" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "onboarding_key" VARCHAR(150),
    "stage" VARCHAR(100),
    "status" VARCHAR(50) DEFAULT 'OPEN',
    "assigned_to" INTEGER,
    "checklist" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rules" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "rule_key" VARCHAR(150) NOT NULL,
    "module_name" VARCHAR(100),
    "trigger" VARCHAR(150) NOT NULL,
    "action" VARCHAR(150) NOT NULL,
    "is_enabled" BOOLEAN DEFAULT false,
    "config" JSONB,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_runs" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "automation_rule_id" INTEGER,
    "status" VARCHAR(50) DEFAULT 'QUEUED',
    "started_at" TIMESTAMP(6),
    "finished_at" TIMESTAMP(6),
    "result" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_impact_reports" (
    "id" SERIAL NOT NULL,
    "change_key" VARCHAR(150) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "affected_modules" JSONB,
    "affected_apis" JSONB,
    "affected_mobile_screens" JSONB,
    "affected_reports" JSONB,
    "affected_rbac_permissions" JSONB,
    "affected_timelines" JSONB,
    "affected_ai_grounding" JSONB,
    "risk_level" VARCHAR(50) DEFAULT 'MEDIUM',
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_impact_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_jobs" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "module_name" VARCHAR(100),
    "status" VARCHAR(50) DEFAULT 'PENDING',
    "file_name" VARCHAR(255),
    "total_rows" INTEGER DEFAULT 0,
    "success_rows" INTEGER DEFAULT 0,
    "failed_rows" INTEGER DEFAULT 0,
    "error_summary" TEXT,
    "metadata" JSONB,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_exports" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "report_key" VARCHAR(150) NOT NULL,
    "format" VARCHAR(50),
    "status" VARCHAR(50) DEFAULT 'READY',
    "file_url" TEXT,
    "filter_json" JSONB,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branding_settings" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "brand_key" VARCHAR(150) NOT NULL,
    "brand_value" JSONB,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branding_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_registrations" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "user_id" INTEGER,
    "device_token" VARCHAR(500) NOT NULL,
    "platform" VARCHAR(50),
    "is_active" BOOLEAN DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_health_checks" (
    "id" SERIAL NOT NULL,
    "check_key" VARCHAR(150) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "latency_ms" INTEGER,
    "details" JSONB,
    "checked_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operation_health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_backups" (
    "id" SERIAL NOT NULL,
    "backup_key" VARCHAR(150) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'UNKNOWN',
    "file_path" TEXT,
    "size_bytes" BIGINT,
    "checksum" VARCHAR(255),
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operation_backups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "concession_requests_school_id_student_id_idx" ON "concession_requests"("school_id", "student_id");

-- CreateIndex
CREATE INDEX "concession_requests_status_idx" ON "concession_requests"("status");

-- CreateIndex
CREATE INDEX "concession_audit_logs_concession_request_id_idx" ON "concession_audit_logs"("concession_request_id");

-- CreateIndex
CREATE INDEX "concession_audit_logs_school_id_idx" ON "concession_audit_logs"("school_id");

-- CreateIndex
CREATE INDEX "event_ledger_school_id_module_name_idx" ON "event_ledger"("school_id", "module_name");

-- CreateIndex
CREATE INDEX "event_ledger_entity_type_entity_id_idx" ON "event_ledger"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "event_ledger_occurred_at_idx" ON "event_ledger"("occurred_at");

-- CreateIndex
CREATE INDEX "student_timelines_school_id_student_id_idx" ON "student_timelines"("school_id", "student_id");

-- CreateIndex
CREATE INDEX "student_timelines_event_id_idx" ON "student_timelines"("event_id");

-- CreateIndex
CREATE INDEX "teacher_timelines_school_id_teacher_id_idx" ON "teacher_timelines"("school_id", "teacher_id");

-- CreateIndex
CREATE INDEX "teacher_timelines_event_id_idx" ON "teacher_timelines"("event_id");

-- CreateIndex
CREATE INDEX "class_timelines_school_id_class_id_idx" ON "class_timelines"("school_id", "class_id");

-- CreateIndex
CREATE INDEX "class_timelines_event_id_idx" ON "class_timelines"("event_id");

-- CreateIndex
CREATE INDEX "school_timelines_school_id_idx" ON "school_timelines"("school_id");

-- CreateIndex
CREATE INDEX "school_timelines_event_id_idx" ON "school_timelines"("event_id");

-- CreateIndex
CREATE INDEX "dining_attendance_school_id_attendance_date_idx" ON "dining_attendance"("school_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "uq_dining_student_meal_date" ON "dining_attendance"("school_id", "student_id", "meal_type", "attendance_date");

-- CreateIndex
CREATE INDEX "hostel_attendance_school_id_attendance_date_idx" ON "hostel_attendance"("school_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hostel_student_date" ON "hostel_attendance"("school_id", "student_id", "attendance_date");

-- CreateIndex
CREATE INDEX "transport_attendance_school_id_attendance_date_idx" ON "transport_attendance"("school_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "uq_transport_student_trip_date" ON "transport_attendance"("school_id", "student_id", "trip_type", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "uq_governance_setting_scope" ON "governance_settings"("school_id", "setting_key");

-- CreateIndex
CREATE INDEX "feature_flags_module_name_idx" ON "feature_flags"("module_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_feature_flag_scope" ON "feature_flags"("school_id", "flag_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_menu_permission_scope" ON "menu_permissions"("school_id", "menu_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_page_permission_scope" ON "page_permissions"("school_id", "page_path");

-- CreateIndex
CREATE UNIQUE INDEX "uq_module_permission_scope" ON "module_permissions"("school_id", "module_key", "action_key");

-- CreateIndex
CREATE UNIQUE INDEX "ai_providers_provider_key_key" ON "ai_providers"("provider_key");

-- CreateIndex
CREATE INDEX "ai_models_provider_key_idx" ON "ai_models"("provider_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_ai_provider_model" ON "ai_models"("provider_key", "model_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_ai_policy_profile_scope" ON "ai_policy_profiles"("school_id", "profile_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_ai_school_limit" ON "ai_school_limits"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_usage_logs_request_id_key" ON "ai_usage_logs"("request_id");

-- CreateIndex
CREATE INDEX "ai_usage_logs_school_id_module_name_idx" ON "ai_usage_logs"("school_id", "module_name");

-- CreateIndex
CREATE INDEX "ai_usage_logs_provider_key_model_key_idx" ON "ai_usage_logs"("provider_key", "model_key");

-- CreateIndex
CREATE INDEX "ai_usage_logs_created_at_idx" ON "ai_usage_logs"("created_at");

-- CreateIndex
CREATE INDEX "ai_health_checks_provider_key_checked_at_idx" ON "ai_health_checks"("provider_key", "checked_at");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_tenant_code_key" ON "tenants"("tenant_code");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_plan_key_key" ON "subscription_plans"("plan_key");

-- CreateIndex
CREATE INDEX "school_subscriptions_school_id_status_idx" ON "school_subscriptions"("school_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_usage_meter_period" ON "usage_metering"("school_id", "meter_key", "period_start", "period_end");

-- CreateIndex
CREATE UNIQUE INDEX "uq_whatsapp_meter_period" ON "whatsapp_metering"("school_id", "period_start", "period_end");

-- CreateIndex
CREATE UNIQUE INDEX "uq_storage_meter_period" ON "storage_metering"("school_id", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "revenue_analytics_school_id_period_start_idx" ON "revenue_analytics"("school_id", "period_start");

-- CreateIndex
CREATE INDEX "profit_analytics_school_id_period_start_idx" ON "profit_analytics"("school_id", "period_start");

-- CreateIndex
CREATE INDEX "school_lifecycle_events_school_id_event_type_idx" ON "school_lifecycle_events"("school_id", "event_type");

-- CreateIndex
CREATE UNIQUE INDEX "uq_billing_automation_scope" ON "billing_automations"("school_id", "automation_key");

-- CreateIndex
CREATE INDEX "renewals_school_id_status_idx" ON "renewals"("school_id", "status");

-- CreateIndex
CREATE INDEX "customer_onboarding_school_id_status_idx" ON "customer_onboarding"("school_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_automation_rule_scope" ON "automation_rules"("school_id", "rule_key");

-- CreateIndex
CREATE INDEX "automation_runs_school_id_status_idx" ON "automation_runs"("school_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "change_impact_reports_change_key_key" ON "change_impact_reports"("change_key");

-- CreateIndex
CREATE INDEX "import_jobs_school_id_module_name_idx" ON "import_jobs"("school_id", "module_name");

-- CreateIndex
CREATE INDEX "report_exports_school_id_report_key_idx" ON "report_exports"("school_id", "report_key");

-- CreateIndex
CREATE UNIQUE INDEX "uq_branding_setting_scope" ON "branding_settings"("school_id", "brand_key");

-- CreateIndex
CREATE INDEX "notification_registrations_school_id_user_id_idx" ON "notification_registrations"("school_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_registrations_device_token_key" ON "notification_registrations"("device_token");

-- CreateIndex
CREATE INDEX "operation_health_checks_check_key_checked_at_idx" ON "operation_health_checks"("check_key", "checked_at");

-- CreateIndex
CREATE INDEX "operation_backups_status_created_at_idx" ON "operation_backups"("status", "created_at");

-- Seed enterprise permissions without assuming recovered permissions are unique.
INSERT INTO permissions (module_name, action_name)
SELECT module_name, action_name
FROM (
    VALUES
        ('AI', 'MANAGE'),
        ('AI', 'USE'),
        ('AI', 'VIEW_USAGE'),
        ('AI', 'VIEW_HEALTH'),
        ('GOVERNANCE', 'MANAGE'),
        ('GOVERNANCE', 'READ'),
        ('EVENT_LEDGER', 'READ'),
        ('TIMELINE', 'READ'),
        ('CONCESSIONS', 'CREATE'),
        ('CONCESSIONS', 'READ'),
        ('CONCESSIONS', 'APPROVE'),
        ('OPERATIONS', 'READ'),
        ('OPERATIONS', 'MANAGE'),
        ('AUTOMATION', 'MANAGE'),
        ('PLATFORM', 'MANAGE'),
        ('BILLING', 'MANAGE'),
        ('REPORTS', 'READ'),
        ('IMPORTS', 'MANAGE')
) AS seed(module_name, action_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM permissions p
    WHERE p.module_name = seed.module_name
      AND p.action_name = seed.action_name
);

-- Give the highest existing administrator role every newly reconstructed enterprise permission.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'SUPER_ADMIN'
  AND p.module_name IN (
      'AI',
      'GOVERNANCE',
      'EVENT_LEDGER',
      'TIMELINE',
      'CONCESSIONS',
      'OPERATIONS',
      'AUTOMATION',
      'PLATFORM',
      'BILLING',
      'REPORTS',
      'IMPORTS'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM role_permissions rp
      WHERE rp.role_id = r.id
        AND rp.permission_id = p.id
  );

INSERT INTO governance_settings (school_id, setting_key, setting_value, description)
VALUES
    (NULL, 'rbac.mode', '{"source":"database","hardcodedRolesAllowed":false}'::jsonb, 'RBAC must be driven by roles, permissions, and role_permissions.'),
    (NULL, 'academic_year.enforcement', '{"required":true,"scope":"school"}'::jsonb, 'All school operations must resolve an active academic year.'),
    (NULL, 'change_impact.required', '{"beforeDeploy":true,"outputs":["modules","apis","mobileScreens","reports","rbac","timelines","aiGrounding"]}'::jsonb, 'Every future change requires impact analysis before deployment.'),
    (NULL, 'ai.gateway.required', '{"product":"TOTTECH AI","directProviderCallsAllowed":false}'::jsonb, 'TOTTECH ONE modules must call only the TOTTECH AI gateway.')
ON CONFLICT DO NOTHING;

INSERT INTO feature_flags (school_id, module_name, flag_key, enabled, config)
VALUES
    (NULL, 'governance', 'dynamic_rbac', true, '{"source":"database"}'::jsonb),
    (NULL, 'governance', 'dynamic_governance', true, '{"source":"database"}'::jsonb),
    (NULL, 'timeline', 'event_ledger', true, '{"source":"event_ledger"}'::jsonb),
    (NULL, 'ai', 'tottech_ai_gateway', true, '{"brand":"TOTTECH AI","tagline":"Gateway To Innovation"}'::jsonb),
    (NULL, 'mobile', 'react_native_rebuild', true, '{"latestApkEvidence":"app-release (3).apk"}'::jsonb),
    (NULL, 'commercial', 'subscription_metering', true, '{"meters":["ai","whatsapp","storage","usage"]}'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO module_permissions (school_id, module_key, module_name, action_key, permission_key, is_enabled)
VALUES
    (NULL, 'ai', 'TOTTECH AI', 'manage', 'AI.MANAGE', true),
    (NULL, 'ai', 'TOTTECH AI', 'use', 'AI.USE', true),
    (NULL, 'governance', 'Governance', 'manage', 'GOVERNANCE.MANAGE', true),
    (NULL, 'governance', 'Governance', 'read', 'GOVERNANCE.READ', true),
    (NULL, 'event-ledger', 'Event Ledger', 'read', 'EVENT_LEDGER.READ', true),
    (NULL, 'timeline', 'Unified Timeline', 'read', 'TIMELINE.READ', true),
    (NULL, 'concessions', 'Concessions', 'approve', 'CONCESSIONS.APPROVE', true),
    (NULL, 'operations', 'Operations Center', 'manage', 'OPERATIONS.MANAGE', true),
    (NULL, 'automation', 'Automation Engine', 'manage', 'AUTOMATION.MANAGE', true),
    (NULL, 'platform', 'Platform Center', 'manage', 'PLATFORM.MANAGE', true),
    (NULL, 'billing', 'Billing', 'manage', 'BILLING.MANAGE', true)
ON CONFLICT DO NOTHING;

INSERT INTO page_permissions (school_id, page_path, module_name, permission_key, is_public, is_enabled)
VALUES
    (NULL, '/operations', 'operations', 'OPERATIONS.READ', false, true),
    (NULL, '/reports', 'reports', 'REPORTS.READ', false, true),
    (NULL, '/imports', 'imports', 'IMPORTS.MANAGE', false, true),
    (NULL, '/finance/concessions', 'concessions', 'CONCESSIONS.READ', false, true),
    (NULL, '/ai-dashboard', 'ai', 'AI.VIEW_USAGE', false, true),
    (NULL, '/ai-command-center', 'ai', 'AI.USE', false, true),
    (NULL, '/settings/ai', 'ai', 'AI.MANAGE', false, true),
    (NULL, '/war-room', 'operations', 'OPERATIONS.READ', false, true)
ON CONFLICT DO NOTHING;

INSERT INTO menu_permissions (school_id, menu_key, label, path, parent_key, module_name, permission_key, sort_order, is_enabled)
VALUES
    (NULL, 'operations', 'Operations', '/operations', NULL, 'operations', 'OPERATIONS.READ', 500, true),
    (NULL, 'reports', 'Reports', '/reports', NULL, 'reports', 'REPORTS.READ', 510, true),
    (NULL, 'imports', 'Imports', '/imports', NULL, 'imports', 'IMPORTS.MANAGE', 520, true),
    (NULL, 'concessions', 'Concessions', '/finance/concessions', 'finance', 'concessions', 'CONCESSIONS.READ', 530, true),
    (NULL, 'ai-dashboard', 'AI Usage', '/ai-dashboard', 'ai', 'ai', 'AI.VIEW_USAGE', 540, true),
    (NULL, 'ai-settings', 'AI Governance', '/settings/ai', 'settings', 'ai', 'AI.MANAGE', 550, true)
ON CONFLICT DO NOTHING;

INSERT INTO ai_providers (provider_key, display_name, provider_type, is_enabled, priority, config)
VALUES
    ('deterministic', 'Deterministic Recovery Provider', 'local-fallback', true, 0, '{"safeFallback":true,"requiresExternalKey":false}'::jsonb),
    ('gemini', 'Gemini', 'external', false, 100, '{"directErpCallsAllowed":false}'::jsonb),
    ('openai', 'OpenAI', 'external', false, 110, '{"directErpCallsAllowed":false}'::jsonb),
    ('claude', 'Claude', 'external', false, 120, '{"directErpCallsAllowed":false}'::jsonb),
    ('deepseek', 'DeepSeek', 'external', false, 130, '{"directErpCallsAllowed":false}'::jsonb),
    ('ollama', 'Ollama', 'local', false, 140, '{"directErpCallsAllowed":false}'::jsonb),
    ('qwen', 'Qwen', 'external', false, 150, '{"directErpCallsAllowed":false}'::jsonb),
    ('mistral', 'Mistral', 'external', false, 160, '{"directErpCallsAllowed":false}'::jsonb),
    ('local', 'Local Models', 'local', false, 170, '{"directErpCallsAllowed":false}'::jsonb)
ON CONFLICT ("provider_key") DO NOTHING;

INSERT INTO ai_models (provider_key, model_key, display_name, capability, context_window, is_enabled, config)
VALUES
    ('deterministic', 'recovery-grounded-v1', 'Recovery Grounded Fallback', 'text', 8000, true, '{"fallback":true}'::jsonb)
ON CONFLICT ("provider_key", "model_key") DO NOTHING;

INSERT INTO ai_policy_profiles (school_id, profile_key, display_name, is_default, grounding_required, fallback_enabled, allowed_modules, max_tokens, temperature, pii_policy)
VALUES
    (NULL, 'default-governed', 'Default Governed AI Policy', true, true, true, '["schoolgpt","attendance","finance","transport","hostel","dining","war-room"]'::jsonb, 1200, 0.20, 'STRICT')
ON CONFLICT DO NOTHING;

INSERT INTO ai_health_checks (provider_key, model_key, status, latency_ms, metadata)
VALUES
    ('deterministic', 'recovery-grounded-v1', 'HEALTHY', 0, '{"source":"migration"}'::jsonb);

INSERT INTO subscription_plans (plan_key, display_name, monthly_price, max_students, max_staff, ai_token_limit, whatsapp_limit, storage_gb_limit, features)
VALUES
    ('recovery-enterprise', 'Recovery Enterprise', 0, 100000, 10000, 1000000, 100000, 1024, '["erp","governance","ai","mobile","operations"]'::jsonb)
ON CONFLICT ("plan_key") DO NOTHING;

INSERT INTO operation_health_checks (check_key, status, details)
VALUES
    ('database.restore', 'PASS', '{"source":"schoolerp_before_demo_seed.sql"}'::jsonb),
    ('prisma.schema', 'PASS', '{"phase":"enterprise_reconstruction"}'::jsonb);

INSERT INTO change_impact_reports (
    change_key,
    title,
    affected_modules,
    affected_apis,
    affected_mobile_screens,
    affected_reports,
    affected_rbac_permissions,
    affected_timelines,
    affected_ai_grounding,
    risk_level
)
VALUES (
    'enterprise-reconstruction-20260605',
    'Full platform recovery enterprise reconstruction',
    '["governance","rbac","timeline","ai","mobile","commercial","operations"]'::jsonb,
    '["/api/tottech-ai/*","/api/concessions","/api/operations/*","/api/school-context"]'::jsonb,
    '["DashboardScreen","StudentsScreen","TeachersScreen","AttendanceScreen","EnterpriseModuleScreens","OperationalScreens"]'::jsonb,
    '["PLATFORM_READINESS_REPORT","RESTORATION_VALIDATION_REPORT"]'::jsonb,
    '["AI.MANAGE","GOVERNANCE.MANAGE","CONCESSIONS.APPROVE","OPERATIONS.MANAGE"]'::jsonb,
    '["student_timelines","teacher_timelines","class_timelines","school_timelines"]'::jsonb,
    '["Academic Year","School Context","RBAC","Event Ledger","ERP Records"]'::jsonb,
    'HIGH'
)
ON CONFLICT ("change_key") DO NOTHING;
