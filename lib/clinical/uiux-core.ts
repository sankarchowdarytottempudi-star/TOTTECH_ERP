export type UiuxModuleKey =
  | "design-tokens"
  | "navigation"
  | "screen-templates"
  | "screen-specs"
  | "dashboards"
  | "components"
  | "workflows"
  | "responsive"
  | "accessibility"
  | "interactions"
  | "mobile-apps"
  | "grid-standards"
  | "form-standards"
  | "notifications"
  | "theme-modes"
  | "api-blueprints"
  | "report-blueprints";

export type UiuxModuleConfig = {
  key: UiuxModuleKey;
  label: string;
  table: string;
  category: string;
  dateColumn: string;
  description: string;
  primaryColumns: string[];
};

export const uiuxModules: Record<
  UiuxModuleKey,
  UiuxModuleConfig
> = {
  "design-tokens": {
    key: "design-tokens",
    label: "Design Tokens",
    table: "clinical_ui_design_tokens",
    category: "Design System",
    dateColumn: "created_at",
    description:
      "Gold, navy, white, typography, radius, shadow, spacing, and layout tokens for TOTTECH Clinical Services.",
    primaryColumns: [
      "token_key",
      "token_name",
      "token_category",
      "token_value",
      "usage_context",
    ],
  },
  navigation: {
    key: "navigation",
    label: "Navigation System",
    table: "clinical_ui_navigation_items",
    category: "Navigation",
    dateColumn: "created_at",
    description:
      "Master sidebar, dashboard, patient, OP, IP, IVF, lab, radiology, pharmacy, billing, insurance, reports, and settings navigation blueprint.",
    primaryColumns: [
      "navigation_key",
      "label",
      "parent_key",
      "route_path",
      "audience_role",
    ],
  },
  "screen-templates": {
    key: "screen-templates",
    label: "Screen Templates",
    table: "clinical_ui_screen_templates",
    category: "Layouts",
    dateColumn: "created_at",
    description:
      "Reusable screen structures for standard screens, command-center dashboards, Patient 360, and clinical workbenches.",
    primaryColumns: [
      "template_key",
      "template_name",
      "layout_regions",
      "required_sections",
    ],
  },
  "screen-specs": {
    key: "screen-specs",
    label: "Screen Specifications",
    table: "clinical_ui_screen_specs",
    category: "Screens",
    dateColumn: "created_at",
    description:
      "500+ screen-by-screen UI specifications with breadcrumb, header, filters, data grid, analytics, audit, mobile behavior, and workflows.",
    primaryColumns: [
      "screen_key",
      "screen_name",
      "module_key",
      "route_path",
      "screen_type",
    ],
  },
  dashboards: {
    key: "dashboards",
    label: "Dashboard Specifications",
    table: "clinical_ui_dashboard_specs",
    category: "Dashboards",
    dateColumn: "created_at",
    description:
      "100+ executive, operational, clinical, finance, AI, mobile, and module command-center dashboard specifications.",
    primaryColumns: [
      "dashboard_key",
      "dashboard_name",
      "dashboard_type",
      "audience_role",
    ],
  },
  components: {
    key: "components",
    label: "Reusable Components",
    table: "clinical_ui_component_specs",
    category: "Component Library",
    dateColumn: "created_at",
    description:
      "200+ React, Tailwind, and ShadCN component blueprints with props, states, accessibility, and responsive behavior.",
    primaryColumns: [
      "component_key",
      "component_name",
      "component_category",
      "framework",
    ],
  },
  workflows: {
    key: "workflows",
    label: "Workflow UI",
    table: "clinical_ui_workflow_specs",
    category: "Workflow Engine",
    dateColumn: "created_at",
    description:
      "Visual workflows for registration, appointment, consultation, billing, payment, IVF, lab, claims, AI review, and mobile offline flows.",
    primaryColumns: [
      "workflow_key",
      "workflow_name",
      "workflow_category",
      "trigger_screen_key",
      "mobile_supported",
    ],
  },
  responsive: {
    key: "responsive",
    label: "Responsive Rules",
    table: "clinical_ui_responsive_rules",
    category: "Responsive System",
    dateColumn: "created_at",
    description:
      "Breakpoints and layout policies for 320, 480, 768, 1024, 1440, and 1920 pixel viewports.",
    primaryColumns: [
      "breakpoint_key",
      "min_width",
      "max_width",
      "layout_rule",
    ],
  },
  accessibility: {
    key: "accessibility",
    label: "Accessibility Rules",
    table: "clinical_ui_accessibility_rules",
    category: "Accessibility",
    dateColumn: "created_at",
    description:
      "WCAG 2.1, keyboard navigation, screen reader, high contrast, focus, touch target, and overflow requirements.",
    primaryColumns: [
      "rule_key",
      "rule_name",
      "wcag_reference",
      "severity",
    ],
  },
  interactions: {
    key: "interactions",
    label: "Interaction Specs",
    table: "clinical_ui_interaction_specs",
    category: "Interactions",
    dateColumn: "created_at",
    description:
      "Card reveal, modal, AI thinking, approval preview, and notification interaction policies.",
    primaryColumns: [
      "interaction_key",
      "interaction_name",
      "interaction_category",
    ],
  },
  "mobile-apps": {
    key: "mobile-apps",
    label: "Mobile App UI",
    table: "clinical_ui_mobile_app_specs",
    category: "Mobile",
    dateColumn: "created_at",
    description:
      "Patient App, Doctor App, and Nurse App UI blueprints with navigation, offline, and notification policies.",
    primaryColumns: [
      "app_key",
      "app_name",
      "audience_role",
      "screen_groups",
    ],
  },
  "grid-standards": {
    key: "grid-standards",
    label: "Data Grid Standards",
    table: "clinical_ui_data_grid_standards",
    category: "Data Grid",
    dateColumn: "created_at",
    description:
      "Pagination, sorting, filtering, export, column chooser, saved views, density, and empty-state standards.",
    primaryColumns: [
      "standard_key",
      "standard_name",
      "feature_schema",
    ],
  },
  "form-standards": {
    key: "form-standards",
    label: "Form Standards",
    table: "clinical_ui_form_standards",
    category: "Forms",
    dateColumn: "created_at",
    description:
      "Validation, autosave, draft mode, audit trail, attachments, and clinical safety form standards.",
    primaryColumns: [
      "standard_key",
      "standard_name",
      "required_features",
    ],
  },
  notifications: {
    key: "notifications",
    label: "Notifications",
    table: "clinical_ui_notification_specs",
    category: "Notifications",
    dateColumn: "created_at",
    description:
      "Success, warning, error, and info notification visual and delivery policies.",
    primaryColumns: [
      "notification_key",
      "notification_name",
      "notification_type",
    ],
  },
  "theme-modes": {
    key: "theme-modes",
    label: "Theme Modes",
    table: "clinical_ui_theme_modes",
    category: "Theme",
    dateColumn: "created_at",
    description:
      "Light mode, dark mode, and hospital branding mode palette and component override definitions.",
    primaryColumns: [
      "theme_key",
      "theme_name",
      "palette",
      "typography",
    ],
  },
  "api-blueprints": {
    key: "api-blueprints",
    label: "API Blueprints",
    table: "clinical_ui_api_blueprints",
    category: "Frontend/API Contract",
    dateColumn: "created_at",
    description:
      "Frontend API endpoint contract blueprints for generated modules with permission and response contracts.",
    primaryColumns: [
      "endpoint_key",
      "module_key",
      "method",
      "path",
    ],
  },
  "report-blueprints": {
    key: "report-blueprints",
    label: "Report Blueprints",
    table: "clinical_ui_report_blueprints",
    category: "Reports",
    dateColumn: "created_at",
    description:
      "Clinical, IVF, financial, insurance, referral, operations, mobile, AI, audit, and executive report UI blueprints.",
    primaryColumns: [
      "report_key",
      "module_key",
      "report_name",
      "report_category",
    ],
  },
};

export const uiuxDashboardModules =
  Object.values(uiuxModules);

export function getUiuxModuleConfig(
  key: string
) {
  return uiuxModules[
    key as UiuxModuleKey
  ];
}
