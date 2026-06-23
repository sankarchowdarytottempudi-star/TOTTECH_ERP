-- TOTTECH Clinical Services - Phase 11 Screen-by-Screen UI/UX Design System + Navigation + Workflows

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS hospital_id INTEGER;
ALTER TABLE clinical_menu_items ADD COLUMN IF NOT EXISTS branch_id INTEGER;

CREATE TABLE IF NOT EXISTS clinical_ui_design_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  token_key VARCHAR(160) NOT NULL,
  token_name VARCHAR(255) NOT NULL,
  token_category VARCHAR(120) NOT NULL,
  token_value TEXT NOT NULL,
  usage_context TEXT,
  css_variable VARCHAR(160),
  tailwind_reference VARCHAR(160),
  status VARCHAR(80) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, token_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  navigation_key VARCHAR(180) NOT NULL,
  label VARCHAR(255) NOT NULL,
  parent_key VARCHAR(180),
  route_path VARCHAR(255),
  module_key VARCHAR(120) NOT NULL,
  icon_key VARCHAR(120),
  audience_role VARCHAR(120),
  required_permission VARCHAR(180),
  sort_order INTEGER DEFAULT 0,
  layout_region VARCHAR(80) DEFAULT 'SIDEBAR',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, navigation_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_screen_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  template_key VARCHAR(180) NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  layout_regions JSONB DEFAULT '[]'::jsonb,
  required_sections JSONB DEFAULT '[]'::jsonb,
  responsive_policy JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, template_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_screen_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  screen_key VARCHAR(220) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  route_path VARCHAR(255),
  screen_type VARCHAR(120) DEFAULT 'WORKSPACE',
  layout_template VARCHAR(180) DEFAULT 'standard_screen',
  breadcrumb_schema JSONB DEFAULT '[]'::jsonb,
  required_regions JSONB DEFAULT '["breadcrumb","page_header","actions","filters","data_grid","analytics_widget","audit_widget"]'::jsonb,
  component_stack JSONB DEFAULT '[]'::jsonb,
  workflow_actions JSONB DEFAULT '[]'::jsonb,
  data_binding_schema JSONB DEFAULT '{}'::jsonb,
  mobile_behavior JSONB DEFAULT '{}'::jsonb,
  accessibility_notes TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, screen_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_dashboard_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  dashboard_key VARCHAR(220) NOT NULL,
  dashboard_name VARCHAR(255) NOT NULL,
  dashboard_type VARCHAR(120) NOT NULL,
  audience_role VARCHAR(120),
  kpi_schema JSONB DEFAULT '[]'::jsonb,
  chart_schema JSONB DEFAULT '[]'::jsonb,
  table_schema JSONB DEFAULT '[]'::jsonb,
  filter_schema JSONB DEFAULT '[]'::jsonb,
  ai_insights_schema JSONB DEFAULT '{}'::jsonb,
  export_schema JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  refresh_policy JSONB DEFAULT '{"seconds":300}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, dashboard_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_component_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  component_key VARCHAR(220) NOT NULL,
  component_name VARCHAR(255) NOT NULL,
  component_category VARCHAR(120) NOT NULL,
  framework VARCHAR(120) DEFAULT 'React + Tailwind + ShadCN',
  tailwind_blueprint TEXT,
  shadcn_blueprint TEXT,
  props_schema JSONB DEFAULT '{}'::jsonb,
  states_schema JSONB DEFAULT '["default","hover","focus","disabled","loading","success","error"]'::jsonb,
  accessibility_schema JSONB DEFAULT '{}'::jsonb,
  responsive_schema JSONB DEFAULT '{}'::jsonb,
  usage_guidelines TEXT,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, component_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_workflow_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  workflow_key VARCHAR(220) NOT NULL,
  workflow_name VARCHAR(255) NOT NULL,
  workflow_category VARCHAR(120) NOT NULL,
  trigger_screen_key VARCHAR(220),
  steps JSONB DEFAULT '[]'::jsonb,
  approval_policy JSONB DEFAULT '{}'::jsonb,
  audit_policy JSONB DEFAULT '{}'::jsonb,
  mobile_supported BOOLEAN DEFAULT true,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  version INTEGER DEFAULT 1,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, workflow_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_responsive_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  breakpoint_key VARCHAR(120) NOT NULL,
  min_width INTEGER NOT NULL,
  max_width INTEGER,
  layout_rule JSONB DEFAULT '{}'::jsonb,
  navigation_rule JSONB DEFAULT '{}'::jsonb,
  typography_rule JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, breakpoint_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_accessibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  rule_key VARCHAR(180) NOT NULL,
  rule_name VARCHAR(255) NOT NULL,
  wcag_reference VARCHAR(120),
  requirement TEXT NOT NULL,
  test_method TEXT,
  severity VARCHAR(80) DEFAULT 'HIGH',
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, rule_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_interaction_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  interaction_key VARCHAR(180) NOT NULL,
  interaction_name VARCHAR(255) NOT NULL,
  interaction_category VARCHAR(120) NOT NULL,
  motion_policy JSONB DEFAULT '{}'::jsonb,
  state_policy JSONB DEFAULT '{}'::jsonb,
  feedback_policy JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, interaction_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_mobile_app_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  app_key VARCHAR(160) NOT NULL,
  app_name VARCHAR(255) NOT NULL,
  audience_role VARCHAR(120) NOT NULL,
  navigation_model JSONB DEFAULT '{}'::jsonb,
  screen_groups JSONB DEFAULT '[]'::jsonb,
  offline_policy JSONB DEFAULT '{}'::jsonb,
  notification_policy JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, app_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_data_grid_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  standard_key VARCHAR(180) NOT NULL,
  standard_name VARCHAR(255) NOT NULL,
  feature_schema JSONB DEFAULT '["pagination","sorting","filtering","export","column_chooser","saved_views"]'::jsonb,
  density_policy JSONB DEFAULT '{}'::jsonb,
  empty_state_policy JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, standard_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_form_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  standard_key VARCHAR(180) NOT NULL,
  standard_name VARCHAR(255) NOT NULL,
  required_features JSONB DEFAULT '["validation","autosave","draft_mode","audit_trail","attachments"]'::jsonb,
  validation_policy JSONB DEFAULT '{}'::jsonb,
  autosave_policy JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, standard_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_notification_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  notification_key VARCHAR(180) NOT NULL,
  notification_name VARCHAR(255) NOT NULL,
  notification_type VARCHAR(80) NOT NULL,
  visual_policy JSONB DEFAULT '{}'::jsonb,
  delivery_policy JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, notification_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_theme_modes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  theme_key VARCHAR(160) NOT NULL,
  theme_name VARCHAR(255) NOT NULL,
  palette JSONB DEFAULT '{}'::jsonb,
  typography JSONB DEFAULT '{}'::jsonb,
  component_overrides JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, theme_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_api_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  endpoint_key VARCHAR(220) NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  method VARCHAR(20) NOT NULL,
  path VARCHAR(255) NOT NULL,
  required_permission VARCHAR(180),
  response_contract JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, endpoint_key)
);

CREATE TABLE IF NOT EXISTS clinical_ui_report_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  report_key VARCHAR(220) NOT NULL,
  module_key VARCHAR(120) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  report_category VARCHAR(120) NOT NULL,
  filter_schema JSONB DEFAULT '[]'::jsonb,
  visualization_schema JSONB DEFAULT '[]'::jsonb,
  export_formats JSONB DEFAULT '["PDF","Excel","CSV"]'::jsonb,
  status VARCHAR(80) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(tenant_id, hospital_id, branch_id, report_key)
);

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
tokens(token_key, token_name, token_category, token_value, usage_context, css_variable, tailwind_reference) AS (
  VALUES
    ('color_primary_gold','Primary Gold','color','#D4AF37','Buttons, highlights, revenue indicators, premium features','--clinical-gold','text-[#D4AF37]'),
    ('color_secondary_navy','Secondary Navy Blue','color','#0B1F3A','Navigation, headers, sidebar, command cards','--clinical-navy','bg-[#0B1F3A]'),
    ('color_background_white','Background White','color','#FFFFFF','Primary content surfaces','--clinical-white','bg-white'),
    ('color_success','Success','color','#22C55E','Success messages and healthy status','--clinical-success','text-green-600'),
    ('color_warning','Warning','color','#F59E0B','Warnings, attention states, aging queues','--clinical-warning','text-amber-600'),
    ('color_error','Error','color','#EF4444','Errors and critical clinical alerts','--clinical-error','text-red-600'),
    ('font_family_primary','Primary Font','typography','Inter','Application typography','--clinical-font','font-sans'),
    ('font_family_fallback','Fallback Font','typography','Roboto','Fallback typography','--clinical-font-fallback','font-sans'),
    ('radius_card','Card Radius','shape','8px','Enterprise cards and panels','--clinical-card-radius','rounded-[8px]'),
    ('radius_button','Button Radius','shape','8px','Buttons and compact controls','--clinical-button-radius','rounded-[8px]'),
    ('shadow_card','Card Shadow','elevation','0 10px 30px rgba(11,31,58,0.10)','Premium card elevation','--clinical-card-shadow','shadow-sm'),
    ('spacing_page_x','Page Horizontal Padding','spacing','20px','Desktop and tablet page gutters','--clinical-page-x','px-5'),
    ('spacing_page_y','Page Vertical Padding','spacing','32px','Page vertical rhythm','--clinical-page-y','py-8'),
    ('z_sidebar','Sidebar Z Index','layout','30','Persistent navigation','--clinical-z-sidebar','z-30'),
    ('z_modal','Modal Z Index','layout','60','Blocking clinical workflows','--clinical-z-modal','z-60')
)
INSERT INTO clinical_ui_design_tokens (
  tenant_id, hospital_id, branch_id, clinic_id, token_key, token_name, token_category, token_value, usage_context, css_variable, tailwind_reference, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, tokens.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN tokens
ON CONFLICT (tenant_id, hospital_id, branch_id, token_key)
DO UPDATE SET token_name = EXCLUDED.token_name, token_category = EXCLUDED.token_category, token_value = EXCLUDED.token_value, usage_context = EXCLUDED.usage_context, css_variable = EXCLUDED.css_variable, tailwind_reference = EXCLUDED.tailwind_reference, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
templates(template_key, template_name, layout_regions, required_sections, responsive_policy, description) AS (
  VALUES
    ('standard_screen','Standard Enterprise Screen','["header","sidebar","main","widgets","footer"]'::jsonb,'["breadcrumb","page_header","actions","filters","data_grid","analytics_widget","audit_widget"]'::jsonb,'{"mobile":"stacked","tablet":"two_column","desktop":"dashboard_grid"}'::jsonb,'Default screen template mandated by Phase 11.'),
    ('dashboard_command_center','Dashboard Command Center','["hero","kpis","charts","tables","ai_insights","audit"]'::jsonb,'["kpis","charts","filters","export","ai_insights"]'::jsonb,'{"mobile":"kpi_carousel","tablet":"cards_grid","desktop":"executive_grid"}'::jsonb,'Premium executive dashboard template.'),
    ('patient_360','Patient 360 Workspace','["profile_header","tabs","right_sidebar","timeline","ai"]'::jsonb,'["overview","visits","lab","radiology","pharmacy","billing","insurance","ivf","documents","timeline"]'::jsonb,'{"mobile":"tabbed","tablet":"tabs_sidebar","desktop":"tabs_plus_sidebar"}'::jsonb,'The most important patient command-center screen.'),
    ('clinical_workbench','Clinical Workbench','["left_history","center_notes","right_orders","bottom_ai"]'::jsonb,'["patient_history","clinical_notes","orders","prescription","follow_up","ai_assistant"]'::jsonb,'{"mobile":"stepper","tablet":"two_pane","desktop":"three_pane"}'::jsonb,'Consultation and clinical workbench template.')
)
INSERT INTO clinical_ui_screen_templates (
  tenant_id, hospital_id, branch_id, clinic_id, template_key, template_name, layout_regions, required_sections, responsive_policy, description, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, templates.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN templates
ON CONFLICT (tenant_id, hospital_id, branch_id, template_key)
DO UPDATE SET template_name = EXCLUDED.template_name, layout_regions = EXCLUDED.layout_regions, required_sections = EXCLUDED.required_sections, responsive_policy = EXCLUDED.responsive_policy, description = EXCLUDED.description, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
nav(navigation_key, label, parent_key, route_path, module_key, icon_key, audience_role, required_permission, sort_order, layout_region) AS (
  VALUES
    ('dashboard','Dashboard',NULL,'/clinical-services','dashboard','activity','ALL','clinical.dashboard.read',10,'SIDEBAR'),
    ('executive_dashboard','Executive Dashboard','dashboard','/clinical-services/analytics/ceo','dashboard','bar-chart','EXECUTIVE','clinical.analytics.executive.read',20,'SIDEBAR'),
    ('operations_dashboard','Operations Dashboard','dashboard','/clinical-services/analytics/operations','dashboard','workflow','OPERATIONS','clinical.analytics.operations.read',30,'SIDEBAR'),
    ('clinical_dashboard','Clinical Dashboard','dashboard','/clinical-services/analytics/medical-director','dashboard','heart-pulse','CLINICAL','clinical.analytics.clinical.read',40,'SIDEBAR'),
    ('finance_dashboard','Finance Dashboard','dashboard','/clinical-services/finance','dashboard','bar-chart','FINANCE','clinical.finance.read',50,'SIDEBAR'),
    ('ai_dashboard','AI Dashboard','dashboard','/clinical-services/ai','dashboard','brain','EXECUTIVE','clinical.ai.read',60,'SIDEBAR'),
    ('patient_new_registration','New Registration','patients','/clinical-services/patients/new','patients','user-plus','RECEPTION','clinical.patients.create',110,'SIDEBAR'),
    ('patient_search','Patient Search','patients','/clinical-services/patients/search','patients','search','ALL','clinical.patients.read',120,'SIDEBAR'),
    ('patient_360','Patient 360','patients','/clinical-services/patients/360','patients','user-round','CLINICAL','clinical.patients.360',130,'SIDEBAR'),
    ('patient_documents','Patient Documents','patients','/clinical-services/documents','patients','file-text','ALL','clinical.documents.read',140,'SIDEBAR'),
    ('patient_timeline','Patient Timeline','patients','/clinical-services/patients/timeline','patients','activity','CLINICAL','clinical.timeline.read',150,'SIDEBAR'),
    ('op_consultations','Consultations','op','/clinical-services/opd','op','stethoscope','DOCTOR','clinical.op.consult',210,'SIDEBAR'),
    ('op_prescriptions','Prescriptions','op','/clinical-services/opd/prescriptions','op','pill','DOCTOR','clinical.op.prescriptions',220,'SIDEBAR'),
    ('op_followups','Follow Ups','op','/clinical-services/opd/follow-ups','op','calendar','DOCTOR','clinical.op.followups',230,'SIDEBAR'),
    ('op_procedures','Procedures','op','/clinical-services/opd/procedures','op','workflow','DOCTOR','clinical.op.procedures',240,'SIDEBAR'),
    ('ip_admissions','Admissions','ip','/clinical-services/ipd','ip','building','RECEPTION','clinical.ip.admissions',310,'SIDEBAR'),
    ('ip_transfers','Transfers','ip','/clinical-services/ipd/transfers','ip','workflow','NURSE','clinical.ip.transfers',320,'SIDEBAR'),
    ('ip_ward_management','Ward Management','ip','/clinical-services/ipd/wards','ip','building','NURSE','clinical.ip.wards',330,'SIDEBAR'),
    ('ip_bed_management','Bed Management','ip','/clinical-services/ipd/beds','ip','building','NURSE','clinical.ip.beds',340,'SIDEBAR'),
    ('ip_discharges','Discharges','ip','/clinical-services/ipd/discharges','ip','file-text','DOCTOR','clinical.ip.discharges',350,'SIDEBAR'),
    ('ivf_cycles','Cycles','ivf','/clinical-services/ivf/cycles','ivf','workflow','IVF','clinical.ivf.cycles',410,'SIDEBAR'),
    ('ivf_embryology','Embryology','ivf','/clinical-services/ivf/embryology','ivf','flask','IVF','clinical.ivf.embryology',420,'SIDEBAR'),
    ('lab_orders','Orders','lab','/clinical-services/diagnostics/lab/orders','lab','flask','LAB','clinical.lab.orders',510,'SIDEBAR'),
    ('radiology_pacs','PACS','radiology','/clinical-services/diagnostics/radiology/pacs','radiology','scan','RADIOLOGY','clinical.radiology.pacs',610,'SIDEBAR'),
    ('pharmacy_sales','Sales','pharmacy','/clinical-services/pharmacy/sales','pharmacy','shopping-cart','PHARMACY','clinical.pharmacy.sales',710,'SIDEBAR'),
    ('billing_invoices','Invoices','billing','/clinical-services/finance/ar','billing','file-text','BILLING','clinical.billing.invoices',810,'SIDEBAR'),
    ('insurance_claims','Claims','insurance','/clinical-services/finance/claims','insurance','shield','INSURANCE','clinical.insurance.claims',910,'SIDEBAR'),
    ('reports_clinical','Clinical Reports','reports','/clinical-services/analytics/catalog','reports','file-text','ALL','clinical.reports.read',1010,'SIDEBAR'),
    ('settings_users','Users','settings','/clinical-services/settings/users','settings','users','ADMIN','clinical.settings.users',1110,'SIDEBAR'),
    ('settings_roles','Roles','settings','/clinical-services/settings/roles','settings','shield','ADMIN','clinical.settings.roles',1120,'SIDEBAR')
)
INSERT INTO clinical_ui_navigation_items (
  tenant_id, hospital_id, branch_id, clinic_id, navigation_key, label, parent_key, route_path, module_key, icon_key, audience_role, required_permission, sort_order, layout_region, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, nav.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN nav
ON CONFLICT (tenant_id, hospital_id, branch_id, navigation_key)
DO UPDATE SET label = EXCLUDED.label, parent_key = EXCLUDED.parent_key, route_path = EXCLUDED.route_path, module_key = EXCLUDED.module_key, icon_key = EXCLUDED.icon_key, audience_role = EXCLUDED.audience_role, required_permission = EXCLUDED.required_permission, sort_order = EXCLUDED.sort_order, layout_region = EXCLUDED.layout_region, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
named(screen_key, screen_name, module_key, route_path, screen_type, layout_template, component_stack, workflow_actions) AS (
  VALUES
    ('login','Login','auth','/login','AUTH','standard_screen','["Logo","HospitalName","Email","Password","OTP","RememberMe","ForgotPassword","LoginButton","AnimatedHospitalIllustration"]'::jsonb,'["authenticate","otp_login","forgot_password"]'::jsonb),
    ('executive_dashboard','Executive Dashboard','dashboard','/clinical-services/analytics/ceo','DASHBOARD','dashboard_command_center','["Revenue","OPCount","IPCount","Occupancy","Claims","IVFCycles","LabRevenue","PharmacyRevenue","RevenueTrend","PatientGrowth","DepartmentPerformance","ClaimsTrend"]'::jsonb,'["filter","drilldown","export","ai_insight"]'::jsonb),
    ('patient_registration','Patient Registration','patients','/clinical-services/patients/new','FORM','standard_screen','["PatientPhoto","PatientInformation","Insurance","Referral","EmergencyContact"]'::jsonb,'["save","save_and_book_appointment","save_and_admit"]'::jsonb),
    ('patient_360','Patient 360','patients','/clinical-services/patients/360','360','patient_360','["PatientHeader","Overview","Visits","Lab","Radiology","Pharmacy","Billing","Insurance","IVF","Documents","Timeline","Allergies","Alerts","CurrentMedications","OutstandingBills"]'::jsonb,'["open_visit","order_lab","open_bill","upload_document","ai_summary"]'::jsonb),
    ('appointment_calendar','Appointment Calendar','appointments','/clinical-services/appointments','CALENDAR','standard_screen','["DayView","WeekView","MonthView","DoctorView","DepartmentView"]'::jsonb,'["create","reschedule","cancel","check_in"]'::jsonb),
    ('op_consultation','OP Consultation','op','/clinical-services/opd','WORKBENCH','clinical_workbench','["PatientHistory","ClinicalNotes","Orders","Prescription","FollowUp","AIAssistant"]'::jsonb,'["save_notes","create_order","prescribe","schedule_followup"]'::jsonb),
    ('admission_screen','Admission Screen','ip','/clinical-services/ipd','FORM','standard_screen','["AdmissionDetails","RoomSelection","BedSelection","Insurance","Deposit"]'::jsonb,'["admit","collect_deposit","assign_bed"]'::jsonb),
    ('icu_dashboard','ICU Dashboard','icu','/clinical-services/icu','DASHBOARD','dashboard_command_center','["BedStatus","VentilatorStatus","CriticalAlerts","Monitoring"]'::jsonb,'["monitor","escalate","handover"]'::jsonb),
    ('ivf_dashboard','IVF Dashboard','ivf','/clinical-services/ivf','DASHBOARD','dashboard_command_center','["ActiveCycles","Retrievals","Transfers","Pregnancies","SuccessRate","CyclePipeline"]'::jsonb,'["open_cycle","schedule_retrieval","review_success_rate"]'::jsonb),
    ('embryology_workbench','Embryology Workbench','ivf','/clinical-services/ivf/embryology','WORKBENCH','clinical_workbench','["Embryos","Grades","Images","CryoStatus","DoctorFilter","EmbryologistFilter","DateFilter","GradeFilter"]'::jsonb,'["grade_embryo","capture_image","cryo_store"]'::jsonb),
    ('lab_dashboard','Lab Dashboard','lab','/clinical-services/diagnostics/lab','DASHBOARD','dashboard_command_center','["SamplesPending","CriticalResults","TAT","Revenue"]'::jsonb,'["collect_sample","enter_result","flag_critical"]'::jsonb),
    ('result_entry','Result Entry','lab','/clinical-services/diagnostics/lab/results','GRID','standard_screen','["Parameter","Value","Unit","ReferenceRange"]'::jsonb,'["save_result","validate_range","release_report"]'::jsonb),
    ('pacs_viewer','PACS Viewer','radiology','/clinical-services/diagnostics/radiology/pacs','VIEWER','standard_screen','["Zoom","Rotate","Pan","Measure","Annotate"]'::jsonb,'["view_study","annotate","report"]'::jsonb),
    ('pharmacy_sales','Pharmacy Sales','pharmacy','/clinical-services/pharmacy/sales','POS','standard_screen','["PrescriptionSearch","MedicineSearch","Cart","Payment"]'::jsonb,'["add_to_cart","collect_payment","print_bill"]'::jsonb),
    ('inventory_dashboard','Inventory Dashboard','inventory','/clinical-services/pharmacy/inventory','DASHBOARD','dashboard_command_center','["StockValue","LowStock","Expired","NearExpiry"]'::jsonb,'["reorder","stock_adjustment","transfer"]'::jsonb),
    ('billing','Billing','billing','/clinical-services/finance/ar','FORM','standard_screen','["Patient","Services","Discounts","Taxes","Payment"]'::jsonb,'["generate_invoice","collect_payment","apply_discount"]'::jsonb),
    ('claims_dashboard','Claims Dashboard','insurance','/clinical-services/finance/claims','DASHBOARD','dashboard_command_center','["Submitted","Approved","Rejected","Pending"]'::jsonb,'["submit_claim","track_claim","settle"]'::jsonb),
    ('referral_dashboard','Referral Dashboard','referrals','/clinical-services/finance/referrals','DASHBOARD','dashboard_command_center','["Referrals","Revenue","Commission","PendingPayments"]'::jsonb,'["calculate_commission","approve_payment"]'::jsonb),
    ('report_center','Report Center','reports','/clinical-services/analytics/catalog','REPORT','standard_screen','["ReportCategories","Filters","Preview","Export"]'::jsonb,'["preview","export_pdf","export_excel"]'::jsonb),
    ('ai_command_center','AI Command Center','ai','/clinical-services/ai','AI','dashboard_command_center','["ClinicalAI","IVFAI","FinanceAI","OperationsAI"]'::jsonb,'["ask","summarize","recommend","clinical_review_required"]'::jsonb)
)
INSERT INTO clinical_ui_screen_specs (
  tenant_id, hospital_id, branch_id, clinic_id, screen_key, screen_name, module_key, route_path, screen_type, layout_template, component_stack, workflow_actions, mobile_behavior, accessibility_notes, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, named.screen_key, named.screen_name, named.module_key, named.route_path, named.screen_type, named.layout_template, named.component_stack, named.workflow_actions,
  '{"320":"single_column","480":"single_column","768":"two_column","1024":"dashboard_grid","1440":"command_center","1920":"wide_command_center"}'::jsonb,
  'WCAG 2.1 AA, keyboard navigation, screen reader labels, high contrast support.',
  scope.user_id, scope.user_id
FROM scope
CROSS JOIN named
ON CONFLICT (tenant_id, hospital_id, branch_id, screen_key)
DO UPDATE SET screen_name = EXCLUDED.screen_name, module_key = EXCLUDED.module_key, route_path = EXCLUDED.route_path, screen_type = EXCLUDED.screen_type, layout_template = EXCLUDED.layout_template, component_stack = EXCLUDED.component_stack, workflow_actions = EXCLUDED.workflow_actions, mobile_behavior = EXCLUDED.mobile_behavior, accessibility_notes = EXCLUDED.accessibility_notes, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key, module_name, screen_count) AS (
  VALUES
    ('patients','Patients',20),('appointments','Appointments',20),('op','OP',20),('ip','IP',20),('er','ER',20),('icu','ICU',20),('ot','OT',20),('ivf','IVF',20),
    ('lab','Laboratory',20),('radiology','Radiology',20),('pharmacy','Pharmacy',20),('inventory','Inventory',20),('billing','Billing',20),('insurance','Insurance',20),
    ('referrals','Referrals',20),('finance','Finance',20),('hr','HR',20),('reports','Reports',20),('analytics','Analytics',20),('ai','AI',20),('settings','Settings',20),
    ('documents','Documents',20),('mobile_patient','Patient App',20),('mobile_doctor','Doctor App',20),('mobile_nurse','Nurse App',20),('workflow_engine','Workflow Engine',20),('governance','Governance',20)
),
screens AS (
  SELECT module_key, module_name, generate_series(1, screen_count) AS n FROM modules
)
INSERT INTO clinical_ui_screen_specs (
  tenant_id, hospital_id, branch_id, clinic_id, screen_key, screen_name, module_key, route_path, screen_type, layout_template, breadcrumb_schema, component_stack, workflow_actions, data_binding_schema, mobile_behavior, accessibility_notes, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  screens.module_key || '_blueprint_screen_' || LPAD(screens.n::text, 2, '0'),
  screens.module_name || ' Blueprint Screen ' || screens.n,
  screens.module_key,
  '/clinical-services/' || replace(screens.module_key,'_','-') || '/screen-' || screens.n,
  CASE WHEN screens.n % 5 = 0 THEN 'DASHBOARD' WHEN screens.n % 3 = 0 THEN 'FORM' ELSE 'WORKSPACE' END,
  CASE WHEN screens.n % 5 = 0 THEN 'dashboard_command_center' ELSE 'standard_screen' END,
  jsonb_build_array('Clinical Services', screens.module_name, 'Screen ' || screens.n),
  jsonb_build_array('Button','Card','Modal','Drawer','Dropdown','Table','DatePicker','Chart','Timeline','Calendar'),
  jsonb_build_array('create','read','update','delete','assign','approve','audit','export'),
  jsonb_build_object('source','database','tenantScoped',true,'hospitalScoped',true,'branchScoped',true,'auditRequired',true),
  jsonb_build_object('320','single_column','480','single_column','768','two_column','1024','dashboard_grid','1440','command_center','1920','wide_command_center'),
  'WCAG 2.1 AA with keyboard navigation, readable contrast, no clipping, no horizontal overflow.',
  scope.user_id, scope.user_id
FROM scope
CROSS JOIN screens
ON CONFLICT (tenant_id, hospital_id, branch_id, screen_key)
DO UPDATE SET screen_name = EXCLUDED.screen_name, route_path = EXCLUDED.route_path, screen_type = EXCLUDED.screen_type, layout_template = EXCLUDED.layout_template, breadcrumb_schema = EXCLUDED.breadcrumb_schema, component_stack = EXCLUDED.component_stack, workflow_actions = EXCLUDED.workflow_actions, data_binding_schema = EXCLUDED.data_binding_schema, mobile_behavior = EXCLUDED.mobile_behavior, accessibility_notes = EXCLUDED.accessibility_notes, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
dashboards(module_key, module_name) AS (
  VALUES
    ('executive','Executive'),('operations','Operations'),('clinical','Clinical'),('finance','Finance'),('ai','AI'),('patients','Patients'),('appointments','Appointments'),('op','OP'),('ip','IP'),('icu','ICU'),
    ('ivf','IVF'),('lab','Laboratory'),('radiology','Radiology'),('pharmacy','Pharmacy'),('inventory','Inventory'),('billing','Billing'),('insurance','Insurance'),('referrals','Referrals'),('reports','Reports'),('analytics','Analytics'),
    ('mobile_patient','Patient Mobile'),('mobile_doctor','Doctor Mobile'),('mobile_nurse','Nurse Mobile'),('governance','Governance')
),
rows AS (
  SELECT module_key, module_name, generate_series(1, 5) AS n FROM dashboards
)
INSERT INTO clinical_ui_dashboard_specs (
  tenant_id, hospital_id, branch_id, clinic_id, dashboard_key, dashboard_name, dashboard_type, audience_role, kpi_schema, chart_schema, table_schema, filter_schema, ai_insights_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  rows.module_key || '_dashboard_' || rows.n,
  rows.module_name || ' Dashboard ' || rows.n,
  CASE WHEN rows.module_key IN ('executive','operations','clinical','finance','ai') THEN 'MASTER' ELSE 'MODULE' END,
  upper(rows.module_key),
  jsonb_build_array('Revenue','OP Count','IP Count','Occupancy','Claims','IVF Cycles','Lab Revenue','Pharmacy Revenue'),
  jsonb_build_array('Revenue Trend','Patient Growth','Department Performance','Claims Trend'),
  jsonb_build_array('Recent Activity','Risk Queue','Audit Trail'),
  jsonb_build_array('Hospital','Branch','Department','Date Range','Doctor','Status'),
  jsonb_build_object('enabled',true,'reviewRequired',true,'clinicalDisclaimer','Clinical Review Required'),
  scope.user_id, scope.user_id
FROM scope
CROSS JOIN rows
ON CONFLICT (tenant_id, hospital_id, branch_id, dashboard_key)
DO UPDATE SET dashboard_name = EXCLUDED.dashboard_name, dashboard_type = EXCLUDED.dashboard_type, audience_role = EXCLUDED.audience_role, kpi_schema = EXCLUDED.kpi_schema, chart_schema = EXCLUDED.chart_schema, table_schema = EXCLUDED.table_schema, filter_schema = EXCLUDED.filter_schema, ai_insights_schema = EXCLUDED.ai_insights_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
categories(category, component_prefix) AS (
  VALUES
    ('Button','button'),('Card','card'),('Modal','modal'),('Drawer','drawer'),('Dropdown','dropdown'),('Table','table'),('DatePicker','datepicker'),('Chart','chart'),('Timeline','timeline'),('Calendar','calendar'),
    ('KPI','kpi'),('Filter','filter'),('Search','search'),('Stepper','stepper'),('Tabs','tabs'),('Upload','upload'),('Avatar','avatar'),('Badge','badge'),('Toast','toast'),('CommandPalette','command_palette'),
    ('AI Panel','ai_panel'),('Audit Widget','audit_widget')
),
rows AS (
  SELECT category, component_prefix, generate_series(1, 10) AS n FROM categories
)
INSERT INTO clinical_ui_component_specs (
  tenant_id, hospital_id, branch_id, clinic_id, component_key, component_name, component_category, tailwind_blueprint, shadcn_blueprint, props_schema, accessibility_schema, responsive_schema, usage_guidelines, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  rows.component_prefix || '_' || rows.n,
  rows.category || ' Component ' || rows.n,
  rows.category,
  'Use TOTTECH navy, white, gold, 8px radius, Inter typography, WCAG AA contrast.',
  'Use ShadCN primitive where available; wrap with clinical tokens and audit-friendly states.',
  jsonb_build_object('variant',jsonb_build_array('primary','secondary','outline','danger'),'size',jsonb_build_array('sm','md','lg'),'loading',true,'disabled',true),
  jsonb_build_object('wcag','2.1 AA','keyboard',true,'screenReader',true,'highContrast',true),
  jsonb_build_object('mobile','full_width','tablet','fluid','desktop','auto'),
  'Reusable Phase 11 component blueprint for enterprise healthcare screens.',
  scope.user_id, scope.user_id
FROM scope
CROSS JOIN rows
ON CONFLICT (tenant_id, hospital_id, branch_id, component_key)
DO UPDATE SET component_name = EXCLUDED.component_name, component_category = EXCLUDED.component_category, tailwind_blueprint = EXCLUDED.tailwind_blueprint, shadcn_blueprint = EXCLUDED.shadcn_blueprint, props_schema = EXCLUDED.props_schema, accessibility_schema = EXCLUDED.accessibility_schema, responsive_schema = EXCLUDED.responsive_schema, usage_guidelines = EXCLUDED.usage_guidelines, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
categories(category) AS (
  VALUES ('Registration'),('Appointment'),('Consultation'),('Billing'),('Payment'),('Admission'),('Discharge'),('IVF Cycle'),('Lab Result'),('Radiology Report'),('Pharmacy Sale'),('Insurance Claim'),('Referral'),('Audit'),('AI Review'),('Mobile Offline')
),
rows AS (
  SELECT category, generate_series(1, 5) AS n FROM categories
)
INSERT INTO clinical_ui_workflow_specs (
  tenant_id, hospital_id, branch_id, clinic_id, workflow_key, workflow_name, workflow_category, trigger_screen_key, steps, approval_policy, audit_policy, mobile_supported, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  lower(replace(rows.category,' ','_')) || '_workflow_' || rows.n,
  rows.category || ' Workflow ' || rows.n,
  rows.category,
  lower(replace(rows.category,' ','_')) || '_screen',
  jsonb_build_array('Draft','Validate','Preview','Approve If Required','Execute','Audit','Notify'),
  jsonb_build_object('requiredFor',jsonb_build_array('discount','claim','clinical_ai_action','controlled_drug'),'roles',jsonb_build_array('Hospital Admin','Clinical Lead','Finance Lead')),
  jsonb_build_object('eventLedger',true,'oldValue',true,'newValue',true,'ipDeviceBrowser',true),
  true,
  scope.user_id, scope.user_id
FROM scope
CROSS JOIN rows
ON CONFLICT (tenant_id, hospital_id, branch_id, workflow_key)
DO UPDATE SET workflow_name = EXCLUDED.workflow_name, workflow_category = EXCLUDED.workflow_category, steps = EXCLUDED.steps, approval_policy = EXCLUDED.approval_policy, audit_policy = EXCLUDED.audit_policy, mobile_supported = EXCLUDED.mobile_supported, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
breakpoints(breakpoint_key, min_width, max_width, layout_rule, navigation_rule, typography_rule) AS (
  VALUES
    ('mobile_320',320,479,'{"columns":1,"cards":"stacked","padding":"16px"}'::jsonb,'{"sidebar":"drawer","header":"compact"}'::jsonb,'{"base":"14px","title":"24px"}'::jsonb),
    ('mobile_480',480,767,'{"columns":1,"cards":"stacked","padding":"18px"}'::jsonb,'{"sidebar":"drawer","header":"compact"}'::jsonb,'{"base":"14px","title":"26px"}'::jsonb),
    ('tablet_768',768,1023,'{"columns":2,"cards":"grid","padding":"20px"}'::jsonb,'{"sidebar":"drawer","header":"standard"}'::jsonb,'{"base":"15px","title":"30px"}'::jsonb),
    ('desktop_1024',1024,1439,'{"columns":3,"cards":"grid","padding":"24px"}'::jsonb,'{"sidebar":"fixed","header":"standard"}'::jsonb,'{"base":"15px","title":"34px"}'::jsonb),
    ('desktop_1440',1440,1919,'{"columns":4,"cards":"command_center","padding":"32px"}'::jsonb,'{"sidebar":"fixed","header":"executive"}'::jsonb,'{"base":"16px","title":"38px"}'::jsonb),
    ('wide_1920',1920,NULL,'{"columns":6,"cards":"wide_command_center","padding":"40px"}'::jsonb,'{"sidebar":"fixed","header":"executive"}'::jsonb,'{"base":"16px","title":"42px"}'::jsonb)
)
INSERT INTO clinical_ui_responsive_rules (
  tenant_id, hospital_id, branch_id, clinic_id, breakpoint_key, min_width, max_width, layout_rule, navigation_rule, typography_rule, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, breakpoints.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN breakpoints
ON CONFLICT (tenant_id, hospital_id, branch_id, breakpoint_key)
DO UPDATE SET min_width = EXCLUDED.min_width, max_width = EXCLUDED.max_width, layout_rule = EXCLUDED.layout_rule, navigation_rule = EXCLUDED.navigation_rule, typography_rule = EXCLUDED.typography_rule, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
rules(rule_key, rule_name, wcag_reference, requirement, test_method, severity) AS (
  VALUES
    ('contrast_text','Text Contrast','WCAG 1.4.3','All normal text must meet AA contrast.','Automated contrast scan plus screenshots.','CRITICAL'),
    ('contrast_large_text','Large Text Contrast','WCAG 1.4.3','Large text, KPIs, badges, and hero text must remain readable on dark and light cards.','Automated contrast scan plus screenshots.','HIGH'),
    ('keyboard_navigation','Keyboard Navigation','WCAG 2.1.1','Every interactive control must be keyboard reachable.','Tab order walkthrough.','CRITICAL'),
    ('screen_reader_labels','Screen Reader Labels','WCAG 4.1.2','Buttons, icons, inputs, and charts require accessible names.','ARIA inspection.','HIGH'),
    ('focus_visible','Focus Visible','WCAG 2.4.7','Keyboard focus must be visible with gold/navy focus rings.','Keyboard test.','HIGH'),
    ('no_horizontal_scroll','No Horizontal Page Scroll','WCAG 1.4.10','Pages must avoid page-level horizontal scroll at all breakpoints.','Viewport screenshot test.','HIGH'),
    ('touch_targets','Touch Targets','WCAG 2.5.5','Mobile controls must use accessible touch target sizing.','Mobile viewport test.','HIGH'),
    ('error_messages','Error Messaging','WCAG 3.3.1','Forms must show field-specific validation errors.','Form validation test.','HIGH')
)
INSERT INTO clinical_ui_accessibility_rules (
  tenant_id, hospital_id, branch_id, clinic_id, rule_key, rule_name, wcag_reference, requirement, test_method, severity, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, rules.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN rules
ON CONFLICT (tenant_id, hospital_id, branch_id, rule_key)
DO UPDATE SET rule_name = EXCLUDED.rule_name, wcag_reference = EXCLUDED.wcag_reference, requirement = EXCLUDED.requirement, test_method = EXCLUDED.test_method, severity = EXCLUDED.severity, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
interactions(interaction_key, interaction_name, interaction_category, motion_policy, state_policy, feedback_policy) AS (
  VALUES
    ('card_reveal','Card Reveal','animation','{"durationMs":180,"easing":"ease-out","reducedMotion":"fade"}'::jsonb,'{"loading":"skeleton","loaded":"visible"}'::jsonb,'{"success":"gold accent","error":"red alert"}'::jsonb),
    ('modal_open','Modal Open','animation','{"durationMs":160,"easing":"ease-out","reducedMotion":"instant"}'::jsonb,'{"open":"focus trap","close":"return focus"}'::jsonb,'{"success":"toast","error":"inline"}'::jsonb),
    ('ai_thinking','AI Thinking State','ai','{"durationMs":900,"loop":true,"reducedMotion":"static dots"}'::jsonb,'{"thinking":"animated gold pulse","ready":"answer card"}'::jsonb,'{"sources":"collapsible","clinicalReview":"visible"}'::jsonb),
    ('approval_preview','Approval Preview','workflow','{"durationMs":180,"easing":"ease-out"}'::jsonb,'{"draft":"preview","approved":"execute enabled","rejected":"locked"}'::jsonb,'{"audit":"event ledger entry"}'::jsonb),
    ('notification_toast','Notification Toast','feedback','{"durationMs":200,"easing":"ease-out"}'::jsonb,'{"success":"green","warning":"amber","error":"red","info":"navy"}'::jsonb,'{"audible":false,"screenReader":"polite"}'::jsonb)
)
INSERT INTO clinical_ui_interaction_specs (
  tenant_id, hospital_id, branch_id, clinic_id, interaction_key, interaction_name, interaction_category, motion_policy, state_policy, feedback_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, interactions.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN interactions
ON CONFLICT (tenant_id, hospital_id, branch_id, interaction_key)
DO UPDATE SET interaction_name = EXCLUDED.interaction_name, interaction_category = EXCLUDED.interaction_category, motion_policy = EXCLUDED.motion_policy, state_policy = EXCLUDED.state_policy, feedback_policy = EXCLUDED.feedback_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
apps(app_key, app_name, audience_role, navigation_model, screen_groups, offline_policy, notification_policy) AS (
  VALUES
    ('patient_app','Patient App UI','PATIENT','{"model":"bottom_tabs_plus_context_header","tabs":["Home","Appointments","Reports","Bills","AI"]}'::jsonb,'["Patient 360","Appointments","Lab Reports","Radiology","Prescriptions","Payments","Documents","IVF","Notifications"]'::jsonb,'{"offlineRead":true,"offlineWrite":"draft_only"}'::jsonb,'{"push":true,"whatsapp":true,"email":true}'::jsonb),
    ('doctor_app','Doctor App UI','DOCTOR','{"model":"command_workspace","tabs":["Queue","Patients","Consult","Orders","AI"]}'::jsonb,'["Doctor Queue","Patient 360","Consultation","Prescriptions","Follow Ups","AI Assistant"]'::jsonb,'{"offlineRead":true,"offlineWrite":"signed_sync"}'::jsonb,'{"criticalAlerts":true,"labReady":true,"admissionAlerts":true}'::jsonb),
    ('nurse_app','Nurse App UI','NURSE','{"model":"ward_rounds","tabs":["Ward","Tasks","Vitals","Medication","Alerts"]}'::jsonb,'["Ward Patients","Vitals","Medication","Tasks","Admissions","Transfers","Discharges"]'::jsonb,'{"offlineRead":true,"offlineWrite":"queued_sync"}'::jsonb,'{"taskAlerts":true,"handover":true,"criticalAlerts":true}'::jsonb)
)
INSERT INTO clinical_ui_mobile_app_specs (
  tenant_id, hospital_id, branch_id, clinic_id, app_key, app_name, audience_role, navigation_model, screen_groups, offline_policy, notification_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, apps.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN apps
ON CONFLICT (tenant_id, hospital_id, branch_id, app_key)
DO UPDATE SET app_name = EXCLUDED.app_name, audience_role = EXCLUDED.audience_role, navigation_model = EXCLUDED.navigation_model, screen_groups = EXCLUDED.screen_groups, offline_policy = EXCLUDED.offline_policy, notification_policy = EXCLUDED.notification_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
standards(standard_key, standard_name, feature_schema, density_policy, empty_state_policy) AS (
  VALUES
    ('enterprise_data_grid','Enterprise Data Grid','["pagination","sorting","filtering","export","column_chooser","saved_views"]'::jsonb,'{"compact":true,"comfortable":true,"clinicalDefault":"comfortable"}'::jsonb,'{"icon":"FileText","message":"No records match the selected clinical context."}'::jsonb),
    ('clinical_orders_grid','Clinical Orders Grid','["pagination","critical_flag","tat","department_filter","export","saved_views"]'::jsonb,'{"clinicalDefault":"compact"}'::jsonb,'{"message":"No pending orders."}'::jsonb),
    ('finance_ledger_grid','Finance Ledger Grid','["pagination","date_range","export","column_chooser","drilldown","saved_views"]'::jsonb,'{"clinicalDefault":"comfortable"}'::jsonb,'{"message":"No financial records for the selected filters."}'::jsonb)
)
INSERT INTO clinical_ui_data_grid_standards (
  tenant_id, hospital_id, branch_id, clinic_id, standard_key, standard_name, feature_schema, density_policy, empty_state_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, standards.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN standards
ON CONFLICT (tenant_id, hospital_id, branch_id, standard_key)
DO UPDATE SET standard_name = EXCLUDED.standard_name, feature_schema = EXCLUDED.feature_schema, density_policy = EXCLUDED.density_policy, empty_state_policy = EXCLUDED.empty_state_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
forms(standard_key, standard_name, required_features, validation_policy, autosave_policy) AS (
  VALUES
    ('enterprise_form','Enterprise Form Standard','["validation","autosave","draft_mode","audit_trail","attachments"]'::jsonb,'{"fieldErrors":true,"serverErrors":true,"clinicalSafetyWarnings":true}'::jsonb,'{"enabled":true,"intervalSeconds":30,"draftRetentionDays":7}'::jsonb),
    ('clinical_order_form','Clinical Order Form','["validation","draft_mode","audit_trail","attachments","clinical_review_required"]'::jsonb,'{"doctorRequired":true,"patientRequired":true,"departmentRequired":true}'::jsonb,'{"enabled":true,"intervalSeconds":20}'::jsonb),
    ('billing_form','Billing Form','["validation","audit_trail","attachments","approval_preview"]'::jsonb,'{"discountApproval":true,"taxValidation":true,"insuranceValidation":true}'::jsonb,'{"enabled":true,"intervalSeconds":30}'::jsonb)
)
INSERT INTO clinical_ui_form_standards (
  tenant_id, hospital_id, branch_id, clinic_id, standard_key, standard_name, required_features, validation_policy, autosave_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, forms.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN forms
ON CONFLICT (tenant_id, hospital_id, branch_id, standard_key)
DO UPDATE SET standard_name = EXCLUDED.standard_name, required_features = EXCLUDED.required_features, validation_policy = EXCLUDED.validation_policy, autosave_policy = EXCLUDED.autosave_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
notifications(notification_key, notification_name, notification_type, visual_policy, delivery_policy) AS (
  VALUES
    ('success','Success','SUCCESS','{"color":"#22C55E","icon":"check","durationMs":3500}'::jsonb,'{"toast":true,"audit":false}'::jsonb),
    ('warning','Warning','WARNING','{"color":"#F59E0B","icon":"alert","durationMs":5000}'::jsonb,'{"toast":true,"audit":true}'::jsonb),
    ('error','Error','ERROR','{"color":"#EF4444","icon":"x","durationMs":7000}'::jsonb,'{"toast":true,"audit":true}'::jsonb),
    ('info','Info','INFO','{"color":"#0B1F3A","icon":"info","durationMs":3500}'::jsonb,'{"toast":true,"audit":false}'::jsonb)
)
INSERT INTO clinical_ui_notification_specs (
  tenant_id, hospital_id, branch_id, clinic_id, notification_key, notification_name, notification_type, visual_policy, delivery_policy, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, notifications.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN notifications
ON CONFLICT (tenant_id, hospital_id, branch_id, notification_key)
DO UPDATE SET notification_name = EXCLUDED.notification_name, notification_type = EXCLUDED.notification_type, visual_policy = EXCLUDED.visual_policy, delivery_policy = EXCLUDED.delivery_policy, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
themes(theme_key, theme_name, palette, typography, component_overrides) AS (
  VALUES
    ('light_mode','Light Mode','{"primary":"#D4AF37","secondary":"#0B1F3A","background":"#FFFFFF","surface":"#F8FAFC"}'::jsonb,'{"font":"Inter","fallback":"Roboto"}'::jsonb,'{"radius":"8px","shadow":"premium_light"}'::jsonb),
    ('dark_mode','Dark Mode','{"primary":"#D4AF37","secondary":"#0B1F3A","background":"#061224","surface":"#0B1F3A","text":"#FFFFFF"}'::jsonb,'{"font":"Inter","fallback":"Roboto"}'::jsonb,'{"radius":"8px","shadow":"premium_dark"}'::jsonb),
    ('hospital_branding_mode','Hospital Branding Mode','{"primary":"tenant_configurable","secondary":"#0B1F3A","gold":"#D4AF37","white":"#FFFFFF"}'::jsonb,'{"font":"Inter","fallback":"Roboto"}'::jsonb,'{"radius":"8px","brandLogo":"hospital"}'::jsonb)
)
INSERT INTO clinical_ui_theme_modes (
  tenant_id, hospital_id, branch_id, clinic_id, theme_key, theme_name, palette, typography, component_overrides, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id, themes.*, scope.user_id, scope.user_id
FROM scope
CROSS JOIN themes
ON CONFLICT (tenant_id, hospital_id, branch_id, theme_key)
DO UPDATE SET theme_name = EXCLUDED.theme_name, palette = EXCLUDED.palette, typography = EXCLUDED.typography, component_overrides = EXCLUDED.component_overrides, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key) AS (
  VALUES ('patients'),('appointments'),('op'),('ip'),('ivf'),('lab'),('radiology'),('pharmacy'),('billing'),('insurance'),('referrals'),('reports'),('analytics'),('ai'),('settings'),('uiux')
),
api_rows AS (
  SELECT module_key, method, generate_series(1, 5) AS n
  FROM modules
  CROSS JOIN (VALUES ('GET'),('POST'),('PUT'),('DELETE')) AS m(method)
)
INSERT INTO clinical_ui_api_blueprints (
  tenant_id, hospital_id, branch_id, clinic_id, endpoint_key, module_key, method, path, required_permission, response_contract, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  api_rows.module_key || '_' || lower(api_rows.method) || '_endpoint_' || api_rows.n,
  api_rows.module_key,
  api_rows.method,
  '/api/clinical/' || api_rows.module_key || '/blueprint/' || api_rows.n,
  'clinical.' || api_rows.module_key || '.' || lower(api_rows.method),
  jsonb_build_object('tenant_id','required','hospital_id','required','branch_id','required','audit','required'),
  scope.user_id, scope.user_id
FROM scope
CROSS JOIN api_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, endpoint_key)
DO UPDATE SET module_key = EXCLUDED.module_key, method = EXCLUDED.method, path = EXCLUDED.path, required_permission = EXCLUDED.required_permission, response_contract = EXCLUDED.response_contract, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
modules(module_key) AS (
  VALUES ('clinical'),('ivf'),('financial'),('insurance'),('referral'),('operations'),('mobile'),('ai'),('audit'),('executive')
),
report_rows AS (
  SELECT module_key, generate_series(1, 10) AS n FROM modules
)
INSERT INTO clinical_ui_report_blueprints (
  tenant_id, hospital_id, branch_id, clinic_id, report_key, module_key, report_name, report_category, filter_schema, visualization_schema, created_by, updated_by
)
SELECT scope.tenant_id, scope.hospital_id, scope.branch_id, scope.clinic_id,
  report_rows.module_key || '_ui_report_' || report_rows.n,
  report_rows.module_key,
  initcap(report_rows.module_key) || ' UI Report ' || report_rows.n,
  upper(report_rows.module_key),
  jsonb_build_array('Hospital','Branch','Department','Date Range','Status'),
  jsonb_build_array('KPI','Trend','Bar Chart','Detail Grid','Export'),
  scope.user_id, scope.user_id
FROM scope
CROSS JOIN report_rows
ON CONFLICT (tenant_id, hospital_id, branch_id, report_key)
DO UPDATE SET module_key = EXCLUDED.module_key, report_name = EXCLUDED.report_name, report_category = EXCLUDED.report_category, filter_schema = EXCLUDED.filter_schema, visualization_schema = EXCLUDED.visualization_schema, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

WITH scope AS (
  SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id, COALESCE(cup.branch_id, c.branch_id) AS branch_id, cup.clinic_id, cup.user_id
  FROM clinical_user_profiles cup
  JOIN clinics c ON c.id = cup.clinic_id
  WHERE COALESCE(cup.is_deleted,false) = false
  ORDER BY cup.id ASC
  LIMIT 1
),
items(menu_key, label, path, module_name, permission_key, sort_order) AS (
  VALUES
    ('uiux_core','UI/UX Blueprint','/clinical-services/uiux','Clinical UI/UX Blueprint','clinical.uiux.read',1210),
    ('uiux_design_tokens','Design Tokens','/clinical-services/uiux/design-tokens','Clinical UI/UX Blueprint','clinical.uiux.tokens',1220),
    ('uiux_navigation','Navigation System','/clinical-services/uiux/navigation','Clinical UI/UX Blueprint','clinical.uiux.navigation',1230),
    ('uiux_screens','Screen Specifications','/clinical-services/uiux/screen-specs','Clinical UI/UX Blueprint','clinical.uiux.screens',1240),
    ('uiux_dashboards','Dashboards','/clinical-services/uiux/dashboards','Clinical UI/UX Blueprint','clinical.uiux.dashboards',1250),
    ('uiux_components','Components','/clinical-services/uiux/components','Clinical UI/UX Blueprint','clinical.uiux.components',1260),
    ('uiux_workflows','Workflows','/clinical-services/uiux/workflows','Clinical UI/UX Blueprint','clinical.uiux.workflows',1270),
    ('uiux_responsive','Responsive Rules','/clinical-services/uiux/responsive','Clinical UI/UX Blueprint','clinical.uiux.responsive',1280),
    ('uiux_accessibility','Accessibility','/clinical-services/uiux/accessibility','Clinical UI/UX Blueprint','clinical.uiux.accessibility',1290),
    ('uiux_mobile','Mobile UX','/clinical-services/uiux/mobile-apps','Clinical UI/UX Blueprint','clinical.uiux.mobile',1300)
)
INSERT INTO clinical_menu_items (
  tenant_id, clinic_id, hospital_id, branch_id, menu_key, label, path, module_name, permission_key, sort_order,
  created_by, updated_by, created_at, updated_at, is_deleted
)
SELECT scope.tenant_id, scope.clinic_id, scope.hospital_id, scope.branch_id, items.menu_key, items.label, items.path, items.module_name, items.permission_key, items.sort_order,
  scope.user_id, scope.user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
FROM scope
CROSS JOIN items
ON CONFLICT (tenant_id, clinic_id, menu_key)
DO UPDATE SET hospital_id = EXCLUDED.hospital_id, branch_id = EXCLUDED.branch_id, label = EXCLUDED.label, path = EXCLUDED.path, module_name = EXCLUDED.module_name, permission_key = EXCLUDED.permission_key, sort_order = EXCLUDED.sort_order, is_enabled = true, is_deleted = false, updated_at = CURRENT_TIMESTAMP;

INSERT INTO clinical_audit_events (
  tenant_id, hospital_id, branch_id, clinic_id, user_id, module_name, action, entity_type, summary, payload, created_at
)
SELECT cup.tenant_id, COALESCE(cup.hospital_id, c.hospital_id), COALESCE(cup.branch_id, c.branch_id), cup.clinic_id, cup.user_id,
  'Clinical UI/UX Phase 11',
  'PHASE_11_UIUX_BLUEPRINT_INSTALLED',
  'clinical_ui_blueprint',
  'Phase 11 screen-by-screen UI/UX design system, navigation, workflows, dashboards, components, mobile rules, and accessibility blueprint installed.',
  jsonb_build_object('screen_specs_target','500+','dashboards_target','100+','components_target','200+','brand','Gold/Navy/White','framework','Next.js + React + Tailwind + ShadCN + Framer Motion'),
  CURRENT_TIMESTAMP
FROM clinical_user_profiles cup
JOIN clinics c ON c.id = cup.clinic_id
WHERE COALESCE(cup.is_deleted,false) = false
ORDER BY cup.id ASC
LIMIT 1;
