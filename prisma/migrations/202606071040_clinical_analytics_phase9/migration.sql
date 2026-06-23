-- TOTTECH Clinical Services - Phase 9 Enterprise Reporting + Analytics + BI + Data Warehouse + AI Insights Platform

CREATE TABLE IF NOT EXISTS clinical_analytics_kpis (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  kpi_code VARCHAR(160) NOT NULL,
  kpi_name VARCHAR(255) NOT NULL,
  kpi_category VARCHAR(120) NOT NULL,
  module_key VARCHAR(120),
  numerator_expression TEXT,
  denominator_expression TEXT,
  target_value NUMERIC(18,4),
  current_value NUMERIC(18,4) DEFAULT 0,
  variance_value NUMERIC(18,4) DEFAULT 0,
  trend_direction VARCHAR(80),
  period_start DATE,
  period_end DATE,
  drilldown_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, kpi_code)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_dashboards (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dashboard_key VARCHAR(160) NOT NULL,
  dashboard_name VARCHAR(255) NOT NULL,
  dashboard_type VARCHAR(120) NOT NULL,
  audience_role VARCHAR(120),
  layout_payload JSONB DEFAULT '{}'::jsonb,
  refresh_interval_seconds INTEGER DEFAULT 300,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, dashboard_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_dashboard_widgets (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dashboard_id INTEGER REFERENCES clinical_analytics_dashboards(id),
  widget_key VARCHAR(160) NOT NULL,
  widget_name VARCHAR(255) NOT NULL,
  widget_type VARCHAR(120) DEFAULT 'KPI',
  data_source VARCHAR(255),
  query_payload JSONB DEFAULT '{}'::jsonb,
  visualization_payload JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, widget_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_report_templates (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_key VARCHAR(180) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  report_category VARCHAR(120) NOT NULL,
  report_description TEXT,
  filter_schema JSONB DEFAULT '{}'::jsonb,
  grouping_schema JSONB DEFAULT '{}'::jsonb,
  chart_schema JSONB DEFAULT '{}'::jsonb,
  output_formats JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_report_schedules (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_template_id INTEGER REFERENCES clinical_analytics_report_templates(id),
  schedule_name VARCHAR(255) NOT NULL,
  schedule_type VARCHAR(80) NOT NULL,
  delivery_methods JSONB DEFAULT '["EMAIL"]'::jsonb,
  recipients JSONB DEFAULT '[]'::jsonb,
  next_run_at TIMESTAMP,
  last_run_at TIMESTAMP,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS clinical_analytics_data_warehouse_jobs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  job_key VARCHAR(160) NOT NULL,
  job_name VARCHAR(255) NOT NULL,
  source_system VARCHAR(120) NOT NULL,
  target_table VARCHAR(160) NOT NULL,
  load_type VARCHAR(80) DEFAULT 'INCREMENTAL',
  last_watermark TIMESTAMP,
  rows_processed INTEGER DEFAULT 0,
  rows_failed INTEGER DEFAULT 0,
  job_status VARCHAR(80) DEFAULT 'READY',
  error_payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, job_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_forecast_models (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  model_key VARCHAR(160) NOT NULL,
  model_name VARCHAR(255) NOT NULL,
  forecast_type VARCHAR(120) NOT NULL,
  horizon_days INTEGER NOT NULL,
  input_features JSONB DEFAULT '[]'::jsonb,
  output_metrics JSONB DEFAULT '{}'::jsonb,
  confidence_score NUMERIC(8,4),
  model_status VARCHAR(80) DEFAULT 'DRAFT',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, model_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_ai_insights (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  insight_key VARCHAR(180) NOT NULL,
  insight_type VARCHAR(120) NOT NULL,
  module_key VARCHAR(120),
  severity VARCHAR(80) DEFAULT 'INFO',
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  recommendation TEXT,
  source_payload JSONB DEFAULT '{}'::jsonb,
  confidence_score NUMERIC(8,4),
  clinical_review_required BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'OPEN',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, insight_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_alerts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  alert_key VARCHAR(180) NOT NULL,
  alert_type VARCHAR(120) NOT NULL,
  alert_name VARCHAR(255) NOT NULL,
  trigger_condition JSONB DEFAULT '{}'::jsonb,
  delivery_methods JSONB DEFAULT '["EMAIL"]'::jsonb,
  severity VARCHAR(80) DEFAULT 'MEDIUM',
  alert_status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, alert_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_executive_notifications (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  notification_key VARCHAR(180) NOT NULL,
  notification_type VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  recipient_role VARCHAR(120),
  delivery_status VARCHAR(80) DEFAULT 'PENDING',
  sent_at TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, notification_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_data_lake_objects (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  object_key VARCHAR(255) NOT NULL,
  object_type VARCHAR(120) NOT NULL,
  source_system VARCHAR(120),
  storage_path TEXT,
  metadata_payload JSONB DEFAULT '{}'::jsonb,
  retention_policy VARCHAR(160),
  object_status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, object_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_bi_integrations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  integration_key VARCHAR(180) NOT NULL,
  provider_name VARCHAR(120) NOT NULL,
  connection_mode VARCHAR(120),
  dataset_name VARCHAR(255),
  export_endpoint TEXT,
  credentials_reference VARCHAR(255),
  integration_status VARCHAR(80) DEFAULT 'CONFIGURED',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, integration_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_export_jobs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  export_key VARCHAR(180) NOT NULL,
  export_format VARCHAR(80) NOT NULL,
  source_report_key VARCHAR(180),
  watermark_enabled BOOLEAN DEFAULT true,
  password_protected BOOLEAN DEFAULT false,
  export_status VARCHAR(80) DEFAULT 'PENDING',
  file_url TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, export_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_olap_cubes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  cube_key VARCHAR(180) NOT NULL,
  cube_name VARCHAR(255) NOT NULL,
  fact_table VARCHAR(180) NOT NULL,
  dimension_tables JSONB DEFAULT '[]'::jsonb,
  measure_definitions JSONB DEFAULT '{}'::jsonb,
  refresh_status VARCHAR(80) DEFAULT 'READY',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, cube_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_etl_runs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  job_id INTEGER REFERENCES clinical_analytics_data_warehouse_jobs(id),
  run_number VARCHAR(180) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  rows_loaded INTEGER DEFAULT 0,
  rows_rejected INTEGER DEFAULT 0,
  run_status VARCHAR(80) DEFAULT 'RUNNING',
  log_payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, run_number)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_fact_table_registry (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  fact_table_name VARCHAR(180) NOT NULL,
  source_system VARCHAR(120),
  grain_description TEXT,
  measure_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, fact_table_name)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_dimension_table_registry (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dimension_table_name VARCHAR(180) NOT NULL,
  source_system VARCHAR(120),
  natural_key VARCHAR(180),
  attribute_payload JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, dimension_table_name)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_timeline (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120),
  event_type VARCHAR(160) NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_summary TEXT,
  source_table VARCHAR(160),
  source_id INTEGER,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'clinical_analytics_fact_patient_visits','clinical_analytics_fact_appointments','clinical_analytics_fact_admissions',
    'clinical_analytics_fact_lab_orders','clinical_analytics_fact_lab_results','clinical_analytics_fact_radiology',
    'clinical_analytics_fact_prescriptions','clinical_analytics_fact_pharmacy_sales','clinical_analytics_fact_billing',
    'clinical_analytics_fact_payments','clinical_analytics_fact_claims','clinical_analytics_fact_ivf_cycles',
    'clinical_analytics_fact_embryology','clinical_analytics_fact_referrals','clinical_analytics_fact_ot_utilization',
    'clinical_analytics_fact_bed_occupancy','clinical_analytics_fact_hr_attendance','clinical_analytics_fact_patient_satisfaction',
    'clinical_analytics_fact_incidents','clinical_analytics_fact_population_health','clinical_analytics_dim_patient',
    'clinical_analytics_dim_doctor','clinical_analytics_dim_department','clinical_analytics_dim_branch',
    'clinical_analytics_dim_hospital','clinical_analytics_dim_date','clinical_analytics_dim_time',
    'clinical_analytics_dim_insurance','clinical_analytics_dim_referral','clinical_analytics_dim_service',
    'clinical_analytics_dim_diagnosis','clinical_analytics_dim_procedure','clinical_analytics_dim_medicine',
    'clinical_analytics_dim_lab_test','clinical_analytics_dim_radiology_modality','clinical_analytics_dim_ivf_protocol',
    'clinical_analytics_dim_employee','clinical_analytics_dim_bed','clinical_analytics_dim_ot_room'
  ]
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL,
        hospital_id INTEGER NOT NULL,
        branch_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        source_system VARCHAR(120),
        source_record_id INTEGER,
        natural_key VARCHAR(180),
        date_key INTEGER,
        time_key INTEGER,
        patient_id INTEGER,
        doctor_id INTEGER,
        department_id INTEGER,
        metric_date DATE DEFAULT CURRENT_DATE,
        metric_value NUMERIC(18,4) DEFAULT 0,
        amount NUMERIC(18,2) DEFAULT 0,
        quantity NUMERIC(18,4) DEFAULT 0,
        status VARCHAR(80) DEFAULT ''ACTIVE'',
        payload JSONB DEFAULT ''{}''::jsonb,
        created_by INTEGER,
        updated_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT false
      )',
      tbl
    );
  END LOOP;
END $$;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'clinical_analytics_ceo_metrics','clinical_analytics_cfo_metrics','clinical_analytics_medical_director_metrics',
    'clinical_analytics_ivf_success_metrics','clinical_analytics_lab_operational_metrics','clinical_analytics_radiology_metrics',
    'clinical_analytics_pharmacy_inventory_metrics','clinical_analytics_insurance_claim_metrics','clinical_analytics_referral_performance_metrics',
    'clinical_analytics_patient_growth_metrics','clinical_analytics_hr_productivity_metrics','clinical_analytics_ot_efficiency_metrics',
    'clinical_analytics_bed_utilization_metrics','clinical_analytics_quality_nabh_metrics','clinical_analytics_patient_safety_metrics',
    'clinical_analytics_revenue_trends','clinical_analytics_profit_trends','clinical_analytics_department_revenue',
    'clinical_analytics_doctor_revenue','clinical_analytics_growth_trends','clinical_analytics_cost_analysis',
    'clinical_analytics_budget_variance','clinical_analytics_cash_flow_snapshots','clinical_analytics_receivables_aging',
    'clinical_analytics_payables_aging','clinical_analytics_insurance_receivables','clinical_analytics_corporate_receivables',
    'clinical_analytics_mortality_risk_scores','clinical_analytics_readmission_risk_scores','clinical_analytics_complication_risk_scores',
    'clinical_analytics_infection_rate_snapshots','clinical_analytics_average_length_of_stay','clinical_analytics_incident_reports',
    'clinical_analytics_age_wise_ivf_success','clinical_analytics_protocol_wise_ivf_success','clinical_analytics_doctor_wise_ivf_success',
    'clinical_analytics_embryologist_success','clinical_analytics_fertilization_rates','clinical_analytics_blastocyst_rates',
    'clinical_analytics_cryo_utilization','clinical_analytics_transfer_outcomes','clinical_analytics_lab_tat_snapshots',
    'clinical_analytics_critical_result_snapshots','clinical_analytics_lab_revenue_snapshots','clinical_analytics_radiology_machine_utilization',
    'clinical_analytics_radiologist_productivity','clinical_analytics_ct_utilization','clinical_analytics_mri_utilization',
    'clinical_analytics_ultrasound_utilization','clinical_analytics_top_medicines','clinical_analytics_low_stock_snapshots',
    'clinical_analytics_dead_stock_snapshots','clinical_analytics_expiry_loss_snapshots','clinical_analytics_stock_turnover',
    'clinical_analytics_inventory_value','clinical_analytics_consumption_trends','clinical_analytics_claim_approval_rates',
    'clinical_analytics_claim_denial_rates','clinical_analytics_claim_collection_rates','clinical_analytics_settlement_time',
    'clinical_analytics_top_referrers','clinical_analytics_referral_revenue','clinical_analytics_commission_paid',
    'clinical_analytics_referral_conversion','clinical_analytics_no_show_rates','clinical_analytics_repeat_visits',
    'clinical_analytics_demographic_age','clinical_analytics_demographic_gender','clinical_analytics_demographic_location',
    'clinical_analytics_disease_trends','clinical_analytics_staff_attendance','clinical_analytics_leave_trends',
    'clinical_analytics_attrition_snapshots','clinical_analytics_nurse_productivity','clinical_analytics_ot_procedure_volume',
    'clinical_analytics_surgeon_productivity','clinical_analytics_ot_turnaround_time','clinical_analytics_ot_cancellation_rate',
    'clinical_analytics_icu_occupancy','clinical_analytics_ward_utilization','clinical_analytics_discharge_forecasts',
    'clinical_analytics_revenue_forecasts','clinical_analytics_patient_forecasts','clinical_analytics_lab_demand_forecasts',
    'clinical_analytics_ivf_demand_forecasts','clinical_analytics_underutilized_departments','clinical_analytics_staffing_gaps',
    'clinical_analytics_ot_optimization','clinical_analytics_bed_optimization','clinical_analytics_insurance_delay_predictions',
    'clinical_analytics_outstanding_collection_predictions','clinical_analytics_dashboard_access_logs','clinical_analytics_report_access_logs',
    'clinical_analytics_report_delivery_logs','clinical_analytics_report_download_logs','clinical_analytics_watermark_audit_logs',
    'clinical_analytics_powerbi_exports','clinical_analytics_tableau_exports','clinical_analytics_looker_exports',
    'clinical_analytics_metabase_exports','clinical_analytics_alert_delivery_logs','clinical_analytics_revenue_drop_alerts',
    'clinical_analytics_claim_rejection_spike_alerts','clinical_analytics_icu_full_alerts','clinical_analytics_low_cash_flow_alerts',
    'clinical_analytics_ai_recommendation_actions','clinical_analytics_ai_review_queue','clinical_analytics_model_training_runs',
    'clinical_analytics_model_prediction_logs','clinical_analytics_population_health_risk_groups','clinical_analytics_data_quality_checks',
    'clinical_analytics_data_lineage_events','clinical_analytics_data_retention_jobs','clinical_analytics_archive_jobs',
    'clinical_analytics_master_data_syncs','clinical_analytics_terminology_rollups','clinical_analytics_pivot_definitions'
  ]
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL,
        hospital_id INTEGER NOT NULL,
        branch_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        module_key VARCHAR(120),
        record_key VARCHAR(180),
        record_name VARCHAR(255),
        metric_category VARCHAR(120),
        metric_date DATE DEFAULT CURRENT_DATE,
        metric_value NUMERIC(18,4) DEFAULT 0,
        target_value NUMERIC(18,4) DEFAULT 0,
        variance_value NUMERIC(18,4) DEFAULT 0,
        amount NUMERIC(18,2) DEFAULT 0,
        status VARCHAR(80) DEFAULT ''ACTIVE'',
        payload JSONB DEFAULT ''{}''::jsonb,
        created_by INTEGER,
        updated_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT false
      )',
      tbl
    );
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS clinical_analytics_screen_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  screen_key VARCHAR(180) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  route_path VARCHAR(255),
  dashboard_type VARCHAR(120),
  section_definitions JSONB DEFAULT '[]'::jsonb,
  visualization_definitions JSONB DEFAULT '[]'::jsonb,
  workflow_definitions JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, screen_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_api_endpoint_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  endpoint_key VARCHAR(180) NOT NULL,
  method VARCHAR(20) NOT NULL,
  path VARCHAR(255) NOT NULL,
  permission_key VARCHAR(180),
  request_schema JSONB DEFAULT '{}'::jsonb,
  response_schema JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, endpoint_key)
);

CREATE TABLE IF NOT EXISTS clinical_analytics_report_definitions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  report_key VARCHAR(180) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  report_category VARCHAR(120),
  output_formats JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  metric_definitions JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, module_key, report_key)
);

CREATE INDEX IF NOT EXISTS idx_clinical_analytics_kpis_scope ON clinical_analytics_kpis(tenant_id, hospital_id, branch_id, module_key, kpi_category, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_analytics_dashboards_scope ON clinical_analytics_dashboards(tenant_id, hospital_id, branch_id, dashboard_type, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_analytics_ai_insights_scope ON clinical_analytics_ai_insights(tenant_id, hospital_id, branch_id, module_key, severity, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_analytics_alerts_scope ON clinical_analytics_alerts(tenant_id, hospital_id, branch_id, alert_type, severity, alert_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_clinical_analytics_timeline_scope ON clinical_analytics_timeline(tenant_id, hospital_id, branch_id, module_key, created_at);

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
items(menu_key, label, path, module_name, permission_key, sort_order) AS (
  VALUES
    ('analytics_core','Analytics Command Center','/clinical-services/analytics','analytics','clinical.analytics.read',360),
    ('analytics_warehouse','Data Warehouse','/clinical-services/analytics/data-warehouse','analytics','clinical.analytics.warehouse.read',361),
    ('analytics_kpis','KPI Engine','/clinical-services/analytics/kpi-engine','analytics','clinical.analytics.kpis.read',362),
    ('analytics_ceo','CEO Dashboard','/clinical-services/analytics/ceo-dashboard','analytics','clinical.analytics.ceo.read',363),
    ('analytics_cfo','CFO Dashboard','/clinical-services/analytics/cfo-dashboard','analytics','clinical.analytics.cfo.read',364),
    ('analytics_medical_director','Medical Director Dashboard','/clinical-services/analytics/medical-director','analytics','clinical.analytics.medical.read',365),
    ('analytics_ivf','IVF Analytics','/clinical-services/analytics/ivf-analytics','analytics','clinical.analytics.ivf.read',366),
    ('analytics_lab','Lab Analytics','/clinical-services/analytics/lab-analytics','analytics','clinical.analytics.lab.read',367),
    ('analytics_radiology','Radiology Analytics','/clinical-services/analytics/radiology-analytics','analytics','clinical.analytics.radiology.read',368),
    ('analytics_pharmacy','Pharmacy Analytics','/clinical-services/analytics/pharmacy-analytics','analytics','clinical.analytics.pharmacy.read',369),
    ('analytics_insurance','Insurance Analytics','/clinical-services/analytics/insurance-analytics','analytics','clinical.analytics.insurance.read',370),
    ('analytics_referral','Referral Analytics','/clinical-services/analytics/referral-analytics','analytics','clinical.analytics.referral.read',371),
    ('analytics_patient','Patient Analytics','/clinical-services/analytics/patient-analytics','analytics','clinical.analytics.patient.read',372),
    ('analytics_hr','HR Analytics','/clinical-services/analytics/hr-analytics','analytics','clinical.analytics.hr.read',373),
    ('analytics_ot','OT Analytics','/clinical-services/analytics/ot-analytics','analytics','clinical.analytics.ot.read',374),
    ('analytics_bed','Bed Analytics','/clinical-services/analytics/bed-analytics','analytics','clinical.analytics.bed.read',375),
    ('analytics_ai','AI Insights','/clinical-services/analytics/ai-insights','analytics','clinical.analytics.ai.read',376),
    ('analytics_forecasting','Forecasting','/clinical-services/analytics/forecasting','analytics','clinical.analytics.forecast.read',377),
    ('analytics_report_builder','Report Builder','/clinical-services/analytics/report-builder','analytics','clinical.analytics.report_builder.read',378),
    ('analytics_scheduled_reports','Scheduled Reports','/clinical-services/analytics/scheduled-reports','analytics','clinical.analytics.schedules.read',379),
    ('analytics_catalog','Report Catalog','/clinical-services/analytics/report-catalog','analytics','clinical.analytics.catalog.read',380),
    ('analytics_export','Data Export Center','/clinical-services/analytics/export-center','analytics','clinical.analytics.export.read',381),
    ('analytics_bi','BI Integration','/clinical-services/analytics/bi-integration','analytics','clinical.analytics.bi.read',382),
    ('analytics_alerts','Executive Alerts','/clinical-services/analytics/executive-alerts','analytics','clinical.analytics.alerts.read',383),
    ('analytics_lake','Enterprise Data Lake','/clinical-services/analytics/data-lake','analytics','clinical.analytics.lake.read',384)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.clinic_id,
  scope.hospital_id,
  scope.branch_id,
  items.menu_key,
  items.label,
  items.path,
  items.module_name,
  items.permission_key,
  items.sort_order,
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET
  hospital_id = EXCLUDED.hospital_id,
  branch_id = EXCLUDED.branch_id,
  label = EXCLUDED.label,
  path = EXCLUDED.path,
  module_name = EXCLUDED.module_name,
  permission_key = EXCLUDED.permission_key,
  sort_order = EXCLUDED.sort_order,
  is_enabled = true,
  is_deleted = false,
  updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, category, screen_count, api_count, report_count) AS (
  VALUES
    ('data-warehouse','Data Warehouse','Warehouse',5,11,25),
    ('kpi-engine','KPI Engine','KPI',5,11,25),
    ('ceo-dashboard','CEO Dashboard','Executive',5,11,25),
    ('cfo-dashboard','CFO Dashboard','Executive',5,11,25),
    ('medical-director','Medical Director Dashboard','Clinical',5,11,25),
    ('ivf-analytics','IVF Analytics','IVF',5,11,25),
    ('lab-analytics','Lab Analytics','Laboratory',5,11,25),
    ('radiology-analytics','Radiology Analytics','Radiology',5,11,25),
    ('pharmacy-analytics','Pharmacy Analytics','Pharmacy',5,11,25),
    ('insurance-analytics','Insurance Analytics','Insurance',5,11,25),
    ('referral-analytics','Referral Analytics','Referral',5,11,25),
    ('patient-analytics','Patient Analytics','Patient',5,11,25),
    ('hr-analytics','HR Analytics','HR',5,11,25),
    ('ot-analytics','OT Analytics','Operations',5,11,25),
    ('bed-analytics','Bed Analytics','Operations',5,11,25),
    ('ai-insights','AI Insights Engine','AI',5,11,25),
    ('forecasting','Forecasting Engine','Forecasting',5,11,25),
    ('report-builder','Report Builder','Reports',5,11,25),
    ('scheduled-reports','Scheduled Reports','Reports',5,11,25),
    ('report-catalog','Report Catalog','Reports',5,11,25),
    ('export-center','Data Export Center','Exports',5,11,25),
    ('bi-integration','BI Integration','BI',5,11,25),
    ('executive-alerts','Executive Alerts','Alerts',5,11,25),
    ('data-lake','Enterprise Data Lake','Data Lake',5,11,25)
),
screen_rows AS (
  SELECT modules.*, generate_series(1, screen_count) AS n FROM modules
)
INSERT INTO clinical_analytics_screen_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, screen_key, screen_name, route_path, dashboard_type,
  section_definitions, visualization_definitions, workflow_definitions, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  screen_rows.module_key,
  screen_rows.module_key || '_screen_' || LPAD(screen_rows.n::text, 2, '0'),
  screen_rows.module_name || ' Screen ' || screen_rows.n,
  '/clinical-services/analytics/' || screen_rows.module_key,
  screen_rows.category,
  jsonb_build_array('Executive Header', 'KPI Cards', 'Trend Charts', 'Drilldowns', 'AI Insights', 'Export Controls'),
  jsonb_build_array('KPI', 'Line Chart', 'Bar Chart', 'Donut Chart', 'Pivot Table', 'Forecast Band'),
  jsonb_build_array('View', 'Filter', 'Drilldown', 'Export', 'Schedule', 'Alert', 'Review AI Insight'),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN screen_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, screen_key)
DO UPDATE SET
  screen_name = EXCLUDED.screen_name,
  route_path = EXCLUDED.route_path,
  dashboard_type = EXCLUDED.dashboard_type,
  section_definitions = EXCLUDED.section_definitions,
  visualization_definitions = EXCLUDED.visualization_definitions,
  workflow_definitions = EXCLUDED.workflow_definitions,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, api_count) AS (
  VALUES
    ('data-warehouse',11),('kpi-engine',11),('ceo-dashboard',11),('cfo-dashboard',11),
    ('medical-director',11),('ivf-analytics',11),('lab-analytics',11),('radiology-analytics',11),
    ('pharmacy-analytics',11),('insurance-analytics',11),('referral-analytics',11),('patient-analytics',11),
    ('hr-analytics',11),('ot-analytics',11),('bed-analytics',11),('ai-insights',11),
    ('forecasting',11),('report-builder',11),('scheduled-reports',11),('report-catalog',11),
    ('export-center',11),('bi-integration',11),('executive-alerts',11),('data-lake',11)
),
api_rows AS (
  SELECT modules.*, generate_series(1, api_count) AS n FROM modules
)
INSERT INTO clinical_analytics_api_endpoint_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, endpoint_key, method, path, permission_key,
  request_schema, response_schema, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  api_rows.module_key,
  api_rows.module_key || '_api_' || LPAD(api_rows.n::text, 3, '0'),
  CASE WHEN api_rows.n % 6 = 1 THEN 'POST' WHEN api_rows.n % 6 = 2 THEN 'PATCH' WHEN api_rows.n % 6 = 3 THEN 'DELETE' ELSE 'GET' END,
  '/api/clinical/analytics/' || api_rows.module_key || '/' || api_rows.n,
  'clinical.analytics.' || replace(api_rows.module_key, '-', '_') || '.execute',
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','clinic_id','required','date_range','optional','filters','optional'),
  jsonb_build_object('audit','required','drilldown','supported','exports','supported','ai_insights', api_rows.module_key = 'ai-insights'),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN api_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, endpoint_key)
DO UPDATE SET
  method = EXCLUDED.method,
  path = EXCLUDED.path,
  permission_key = EXCLUDED.permission_key,
  request_schema = EXCLUDED.request_schema,
  response_schema = EXCLUDED.response_schema,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;

WITH scope AS (
  SELECT
    cup.tenant_id,
    COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
    COALESCE(cup.branch_id, c.branch_id) AS branch_id,
    cup.clinic_id,
    cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, category, report_count) AS (
  VALUES
    ('data-warehouse','Data Warehouse','Warehouse',25),
    ('kpi-engine','KPI Engine','KPI',25),
    ('ceo-dashboard','CEO Dashboard','Executive',25),
    ('cfo-dashboard','CFO Dashboard','Executive',25),
    ('medical-director','Medical Director Dashboard','Clinical',25),
    ('ivf-analytics','IVF Analytics','IVF',25),
    ('lab-analytics','Lab Analytics','Laboratory',25),
    ('radiology-analytics','Radiology Analytics','Radiology',25),
    ('pharmacy-analytics','Pharmacy Analytics','Pharmacy',25),
    ('insurance-analytics','Insurance Analytics','Insurance',25),
    ('referral-analytics','Referral Analytics','Referral',25),
    ('patient-analytics','Patient Analytics','Patient',25),
    ('hr-analytics','HR Analytics','HR',25),
    ('ot-analytics','OT Analytics','Operations',25),
    ('bed-analytics','Bed Analytics','Operations',25),
    ('ai-insights','AI Insights Engine','AI',25),
    ('forecasting','Forecasting Engine','Forecasting',25),
    ('report-builder','Report Builder','Reports',25),
    ('scheduled-reports','Scheduled Reports','Reports',25),
    ('report-catalog','Report Catalog','Reports',25),
    ('export-center','Data Export Center','Exports',25),
    ('bi-integration','BI Integration','BI',25),
    ('executive-alerts','Executive Alerts','Alerts',25),
    ('data-lake','Enterprise Data Lake','Data Lake',25)
),
report_rows AS (
  SELECT modules.*, generate_series(1, report_count) AS n FROM modules
)
INSERT INTO clinical_analytics_report_definitions (
  tenant_id, hospital_id, branch_id, clinic_id, module_key, report_key, report_name, report_category,
  output_formats, metric_definitions, created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT
  scope.tenant_id,
  scope.hospital_id,
  scope.branch_id,
  scope.clinic_id,
  report_rows.module_key,
  report_rows.module_key || '_report_' || LPAD(report_rows.n::text, 3, '0'),
  report_rows.module_name || ' Report ' || report_rows.n,
  report_rows.category,
  '["PDF","Excel","CSV","JSON","XML"]'::jsonb,
  jsonb_build_object(
    'source','data_warehouse',
    'scope','tenant_hospital_branch_clinic',
    'module', report_rows.module_key,
    'supports_drilldown', true,
    'supports_schedule', true,
    'supports_watermark', true,
    'clinical_review_required', report_rows.module_key = 'ai-insights'
  ),
  scope.user_id,
  scope.user_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  false
FROM scope
CROSS JOIN report_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, module_key, report_key)
DO UPDATE SET
  report_name = EXCLUDED.report_name,
  report_category = EXCLUDED.report_category,
  output_formats = EXCLUDED.output_formats,
  metric_definitions = EXCLUDED.metric_definitions,
  updated_at = CURRENT_TIMESTAMP,
  is_deleted = false;
