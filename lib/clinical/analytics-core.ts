export type AnalyticsModuleKey =
  | "data-warehouse"
  | "kpi-engine"
  | "ceo-dashboard"
  | "cfo-dashboard"
  | "medical-director"
  | "ivf-analytics"
  | "lab-analytics"
  | "radiology-analytics"
  | "pharmacy-analytics"
  | "insurance-analytics"
  | "referral-analytics"
  | "patient-analytics"
  | "hr-analytics"
  | "ot-analytics"
  | "bed-analytics"
  | "ai-insights"
  | "forecasting"
  | "report-builder"
  | "scheduled-reports"
  | "report-catalog"
  | "export-center"
  | "bi-integration"
  | "executive-alerts"
  | "data-lake";

export type AnalyticsModuleConfig = {
  key: AnalyticsModuleKey;
  label: string;
  table: string;
  category: string;
  idPrefix: string;
  uidColumn?: string;
  dateColumn: string;
  statusColumn?: string;
  createColumns: string[];
  requiredColumns?: string[];
  numericColumns?: string[];
  booleanColumns?: string[];
  dateColumns?: string[];
  textAreaColumns?: string[];
  jsonColumns?: string[];
};

const numericColumns = [
  "dashboard_id",
  "report_template_id",
  "refresh_interval_seconds",
  "target_value",
  "current_value",
  "variance_value",
  "metric_value",
  "amount",
  "quantity",
  "sort_order",
  "rows_processed",
  "rows_failed",
  "horizon_days",
  "confidence_score",
  "rows_loaded",
  "rows_rejected",
];

const dateColumns = [
  "period_start",
  "period_end",
  "next_run_at",
  "last_run_at",
  "last_watermark",
  "sent_at",
  "metric_date",
  "started_at",
  "ended_at",
];

const jsonColumns = [
  "drilldown_payload",
  "layout_payload",
  "query_payload",
  "visualization_payload",
  "filter_schema",
  "grouping_schema",
  "chart_schema",
  "output_formats",
  "delivery_methods",
  "recipients",
  "error_payload",
  "input_features",
  "output_metrics",
  "source_payload",
  "trigger_condition",
  "metadata_payload",
  "dimension_tables",
  "measure_definitions",
  "log_payload",
  "measure_payload",
  "attribute_payload",
  "payload",
];

const metricCreateColumns = [
  "module_key",
  "record_key",
  "record_name",
  "metric_category",
  "metric_date",
  "metric_value",
  "target_value",
  "variance_value",
  "amount",
  "status",
  "payload",
];

const metricModule = (
  key: AnalyticsModuleKey,
  label: string,
  table: string,
  category: string
): AnalyticsModuleConfig => ({
  key,
  label,
  table,
  category,
  idPrefix: key.toUpperCase().slice(0, 8),
  dateColumn: "metric_date",
  statusColumn: "status",
  createColumns: metricCreateColumns,
  requiredColumns: ["record_name"],
  numericColumns,
  dateColumns,
  jsonColumns,
});

export const analyticsModules: Record<
  AnalyticsModuleKey,
  AnalyticsModuleConfig
> = {
  "data-warehouse": {
    key: "data-warehouse",
    label: "Data Warehouse",
    table:
      "clinical_analytics_data_warehouse_jobs",
    category: "Warehouse",
    idPrefix: "DWH",
    uidColumn: "job_key",
    dateColumn: "created_at",
    statusColumn: "job_status",
    createColumns: [
      "job_key",
      "job_name",
      "source_system",
      "target_table",
      "load_type",
      "last_watermark",
      "rows_processed",
      "rows_failed",
      "job_status",
      "error_payload",
    ],
    requiredColumns: [
      "job_name",
      "source_system",
      "target_table",
    ],
    numericColumns,
    dateColumns,
    jsonColumns,
  },
  "kpi-engine": {
    key: "kpi-engine",
    label: "KPI Engine",
    table: "clinical_analytics_kpis",
    category: "KPI",
    idPrefix: "KPI",
    uidColumn: "kpi_code",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "kpi_code",
      "kpi_name",
      "kpi_category",
      "module_key",
      "numerator_expression",
      "denominator_expression",
      "target_value",
      "current_value",
      "variance_value",
      "trend_direction",
      "period_start",
      "period_end",
      "drilldown_payload",
      "status",
    ],
    requiredColumns: [
      "kpi_name",
      "kpi_category",
    ],
    numericColumns,
    dateColumns,
    textAreaColumns: [
      "numerator_expression",
      "denominator_expression",
    ],
    jsonColumns,
  },
  "ceo-dashboard": metricModule(
    "ceo-dashboard",
    "CEO Dashboard",
    "clinical_analytics_ceo_metrics",
    "Executive"
  ),
  "cfo-dashboard": metricModule(
    "cfo-dashboard",
    "CFO Dashboard",
    "clinical_analytics_cfo_metrics",
    "Executive"
  ),
  "medical-director": metricModule(
    "medical-director",
    "Medical Director Dashboard",
    "clinical_analytics_medical_director_metrics",
    "Clinical"
  ),
  "ivf-analytics": metricModule(
    "ivf-analytics",
    "IVF Analytics",
    "clinical_analytics_ivf_success_metrics",
    "IVF"
  ),
  "lab-analytics": metricModule(
    "lab-analytics",
    "Lab Analytics",
    "clinical_analytics_lab_operational_metrics",
    "Laboratory"
  ),
  "radiology-analytics": metricModule(
    "radiology-analytics",
    "Radiology Analytics",
    "clinical_analytics_radiology_metrics",
    "Radiology"
  ),
  "pharmacy-analytics": metricModule(
    "pharmacy-analytics",
    "Pharmacy Analytics",
    "clinical_analytics_pharmacy_inventory_metrics",
    "Pharmacy"
  ),
  "insurance-analytics": metricModule(
    "insurance-analytics",
    "Insurance Analytics",
    "clinical_analytics_insurance_claim_metrics",
    "Insurance"
  ),
  "referral-analytics": metricModule(
    "referral-analytics",
    "Referral Analytics",
    "clinical_analytics_referral_performance_metrics",
    "Referral"
  ),
  "patient-analytics": metricModule(
    "patient-analytics",
    "Patient Analytics",
    "clinical_analytics_patient_growth_metrics",
    "Patient"
  ),
  "hr-analytics": metricModule(
    "hr-analytics",
    "HR Analytics",
    "clinical_analytics_hr_productivity_metrics",
    "HR"
  ),
  "ot-analytics": metricModule(
    "ot-analytics",
    "OT Analytics",
    "clinical_analytics_ot_efficiency_metrics",
    "Operations"
  ),
  "bed-analytics": metricModule(
    "bed-analytics",
    "Bed Analytics",
    "clinical_analytics_bed_utilization_metrics",
    "Operations"
  ),
  "ai-insights": {
    key: "ai-insights",
    label: "AI Insights Engine",
    table: "clinical_analytics_ai_insights",
    category: "AI",
    idPrefix: "AINS",
    uidColumn: "insight_key",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "insight_key",
      "insight_type",
      "module_key",
      "severity",
      "title",
      "summary",
      "recommendation",
      "source_payload",
      "confidence_score",
      "clinical_review_required",
      "status",
    ],
    requiredColumns: [
      "insight_type",
      "title",
      "summary",
    ],
    numericColumns,
    booleanColumns: [
      "clinical_review_required",
    ],
    textAreaColumns: [
      "summary",
      "recommendation",
    ],
    jsonColumns,
  },
  forecasting: {
    key: "forecasting",
    label: "Forecasting Engine",
    table: "clinical_analytics_forecast_models",
    category: "Forecasting",
    idPrefix: "FCST",
    uidColumn: "model_key",
    dateColumn: "created_at",
    statusColumn: "model_status",
    createColumns: [
      "model_key",
      "model_name",
      "forecast_type",
      "horizon_days",
      "input_features",
      "output_metrics",
      "confidence_score",
      "model_status",
    ],
    requiredColumns: [
      "model_name",
      "forecast_type",
      "horizon_days",
    ],
    numericColumns,
    jsonColumns,
  },
  "report-builder": {
    key: "report-builder",
    label: "Report Builder",
    table:
      "clinical_analytics_report_templates",
    category: "Reports",
    idPrefix: "RPT",
    uidColumn: "report_key",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "report_key",
      "report_name",
      "report_category",
      "report_description",
      "filter_schema",
      "grouping_schema",
      "chart_schema",
      "output_formats",
      "status",
    ],
    requiredColumns: [
      "report_name",
      "report_category",
    ],
    textAreaColumns: ["report_description"],
    jsonColumns,
  },
  "scheduled-reports": {
    key: "scheduled-reports",
    label: "Scheduled Reports",
    table:
      "clinical_analytics_report_schedules",
    category: "Reports",
    idPrefix: "RSCH",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "report_template_id",
      "schedule_name",
      "schedule_type",
      "delivery_methods",
      "recipients",
      "next_run_at",
      "last_run_at",
      "status",
    ],
    requiredColumns: [
      "schedule_name",
      "schedule_type",
    ],
    numericColumns,
    dateColumns,
    jsonColumns,
  },
  "report-catalog": {
    key: "report-catalog",
    label: "Report Catalog",
    table:
      "clinical_analytics_report_definitions",
    category: "Reports",
    idPrefix: "RCAT",
    uidColumn: "report_key",
    dateColumn: "created_at",
    createColumns: [
      "module_key",
      "report_key",
      "report_name",
      "report_category",
      "output_formats",
      "metric_definitions",
    ],
    requiredColumns: [
      "module_key",
      "report_name",
      "report_category",
    ],
    jsonColumns: [
      ...jsonColumns,
      "metric_definitions",
    ],
  },
  "export-center": {
    key: "export-center",
    label: "Data Export Center",
    table: "clinical_analytics_export_jobs",
    category: "Exports",
    idPrefix: "EXP",
    uidColumn: "export_key",
    dateColumn: "created_at",
    statusColumn: "export_status",
    createColumns: [
      "export_key",
      "export_format",
      "source_report_key",
      "watermark_enabled",
      "password_protected",
      "export_status",
      "file_url",
    ],
    requiredColumns: ["export_format"],
    booleanColumns: [
      "watermark_enabled",
      "password_protected",
    ],
  },
  "bi-integration": {
    key: "bi-integration",
    label: "BI Integration",
    table: "clinical_analytics_bi_integrations",
    category: "BI",
    idPrefix: "BI",
    uidColumn: "integration_key",
    dateColumn: "created_at",
    statusColumn: "integration_status",
    createColumns: [
      "integration_key",
      "provider_name",
      "connection_mode",
      "dataset_name",
      "export_endpoint",
      "credentials_reference",
      "integration_status",
    ],
    requiredColumns: ["provider_name"],
  },
  "executive-alerts": {
    key: "executive-alerts",
    label: "Executive Alerts",
    table: "clinical_analytics_alerts",
    category: "Alerts",
    idPrefix: "ALT",
    uidColumn: "alert_key",
    dateColumn: "created_at",
    statusColumn: "alert_status",
    createColumns: [
      "alert_key",
      "alert_type",
      "alert_name",
      "trigger_condition",
      "delivery_methods",
      "severity",
      "alert_status",
    ],
    requiredColumns: [
      "alert_type",
      "alert_name",
    ],
    jsonColumns,
  },
  "data-lake": {
    key: "data-lake",
    label: "Enterprise Data Lake",
    table:
      "clinical_analytics_data_lake_objects",
    category: "Data Lake",
    idPrefix: "LAKE",
    uidColumn: "object_key",
    dateColumn: "created_at",
    statusColumn: "object_status",
    createColumns: [
      "object_key",
      "object_type",
      "source_system",
      "storage_path",
      "metadata_payload",
      "retention_policy",
      "object_status",
    ],
    requiredColumns: ["object_type"],
    jsonColumns,
  },
};

export const analyticsDashboardModules =
  Object.values(analyticsModules);

export function getAnalyticsModuleConfig(
  moduleKey: string
) {
  return analyticsModules[
    moduleKey as AnalyticsModuleKey
  ];
}

export function normalizeAnalyticsValue(
  config: AnalyticsModuleConfig,
  column: string,
  value: unknown
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (config.booleanColumns?.includes(column)) {
    if (typeof value === "boolean") {
      return value;
    }

    return ["true", "1", "yes", "on"].includes(
      String(value).toLowerCase()
    );
  }

  if (config.numericColumns?.includes(column)) {
    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  if (config.jsonColumns?.includes(column)) {
    if (typeof value === "object") {
      return value;
    }

    try {
      return JSON.parse(String(value));
    } catch {
      return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return String(value);
}
