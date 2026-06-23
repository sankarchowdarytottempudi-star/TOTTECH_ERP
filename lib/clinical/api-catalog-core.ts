export type ApiCatalogModuleKey =
  | "gateway"
  | "rest"
  | "graphql"
  | "websockets"
  | "websocket-events"
  | "events"
  | "rabbitmq"
  | "webhooks"
  | "errors"
  | "versioning"
  | "rate-limits"
  | "openapi"
  | "integrations";

export type ApiCatalogModuleConfig = {
  key: ApiCatalogModuleKey;
  label: string;
  table: string;
  category: string;
  dateColumn: string;
  description: string;
  primaryColumns: string[];
};

export const apiCatalogModules: Record<
  ApiCatalogModuleKey,
  ApiCatalogModuleConfig
> = {
  gateway: {
    key: "gateway",
    label: "API Gateway Policies",
    table:
      "clinical_api_catalog_gateway_policies",
    category: "Gateway",
    dateColumn: "created_at",
    description:
      "Gateway middleware contract for auth, tenant isolation, audit, rate limiting, and request logging before traffic reaches any clinical API.",
    primaryColumns: [
      "policy_key",
      "policy_name",
      "middleware_order",
      "middleware_name",
      "requirement",
    ],
  },
  rest: {
    key: "rest",
    label: "REST API Catalog",
    table:
      "clinical_api_catalog_rest_endpoints",
    category: "REST",
    dateColumn: "created_at",
    description:
      "Versioned REST contracts for Auth, Patients, Appointments, OP, IP, ICU, OT, IVF, Lab, Radiology, Pharmacy, Billing, Insurance, Referral, Finance, Reports, Analytics, Mobile, AI, and Security.",
    primaryColumns: [
      "method",
      "path",
      "api_group",
      "module_key",
      "permission_key",
    ],
  },
  graphql: {
    key: "graphql",
    label: "GraphQL Operations",
    table:
      "clinical_api_catalog_graphql_operations",
    category: "GraphQL",
    dateColumn: "created_at",
    description:
      "GraphQL query and mutation contracts for Patient 360, executive dashboards, analytics, and mobile application payloads.",
    primaryColumns: [
      "operation_key",
      "operation_name",
      "operation_type",
      "graph_area",
      "query_definition",
    ],
  },
  websockets: {
    key: "websockets",
    label: "WebSocket Channels",
    table:
      "clinical_api_catalog_websocket_channels",
    category: "Realtime",
    dateColumn: "created_at",
    description:
      "Realtime channel contracts for notifications, ICU monitoring, lab updates, telemedicine, and chat.",
    primaryColumns: [
      "channel_key",
      "channel_name",
      "namespace",
      "purpose",
      "auth_required",
    ],
  },
  "websocket-events": {
    key: "websocket-events",
    label: "WebSocket Events",
    table:
      "clinical_api_catalog_websocket_events",
    category: "Realtime",
    dateColumn: "created_at",
    description:
      "Realtime event payloads for appointment booking, lab results, claim approvals, patient admission, ICU alerts, telemedicine, and chat.",
    primaryColumns: [
      "event_key",
      "channel_key",
      "event_name",
      "direction",
      "payload_schema",
    ],
  },
  events: {
    key: "events",
    label: "Domain Event Catalog",
    table:
      "clinical_api_catalog_events",
    category: "Events",
    dateColumn: "created_at",
    description:
      "Canonical event catalog for PatientCreated, AppointmentBooked, LabResultReady, EmbryoCreated, ClaimApproved, and generated clinical workflow events.",
    primaryColumns: [
      "event_key",
      "event_name",
      "event_category",
      "producer_service",
      "consumer_services",
    ],
  },
  rabbitmq: {
    key: "rabbitmq",
    label: "RabbitMQ Topics",
    table:
      "clinical_api_catalog_rabbitmq_topics",
    category: "Messaging",
    dateColumn: "created_at",
    description:
      "RabbitMQ routing-key registry for patient, appointment, admission, lab, IVF, invoice, claim, payment, security, and AI review events.",
    primaryColumns: [
      "routing_key",
      "exchange_name",
      "event_key",
      "producer_service",
      "dead_letter_queue",
    ],
  },
  webhooks: {
    key: "webhooks",
    label: "Webhook Contracts",
    table:
      "clinical_api_catalog_webhooks",
    category: "Webhooks",
    dateColumn: "created_at",
    description:
      "Inbound and outbound webhook contracts for lab partners, insurance/TPA, ABHA, payments, claim status, and report-ready callbacks.",
    primaryColumns: [
      "webhook_key",
      "webhook_name",
      "direction",
      "external_system",
      "path",
    ],
  },
  errors: {
    key: "errors",
    label: "Error Standards",
    table:
      "clinical_api_catalog_error_standards",
    category: "Error Handling",
    dateColumn: "created_at",
    description:
      "Standardized error-code catalog using the platform response model: success, errorCode, and message.",
    primaryColumns: [
      "error_code",
      "http_status",
      "module_key",
      "message_template",
      "response_schema",
    ],
  },
  versioning: {
    key: "versioning",
    label: "API Versioning",
    table:
      "clinical_api_catalog_versioning_rules",
    category: "Versioning",
    dateColumn: "created_at",
    description:
      "API version lifecycle rules for /api/v1 and /api/v2, compatibility policy, and deprecation governance.",
    primaryColumns: [
      "version_key",
      "version_label",
      "base_path",
      "lifecycle_status",
      "deprecation_policy",
    ],
  },
  "rate-limits": {
    key: "rate-limits",
    label: "Rate Limit Policies",
    table:
      "clinical_api_catalog_rate_limits",
    category: "Gateway",
    dateColumn: "created_at",
    description:
      "Default, critical, and webhook rate-limit policies, including 100 requests/minute default and 20 requests/minute critical controls.",
    primaryColumns: [
      "policy_key",
      "policy_name",
      "requests_per_minute",
      "applies_to",
      "reason",
    ],
  },
  openapi: {
    key: "openapi",
    label: "OpenAPI Specifications",
    table:
      "clinical_api_catalog_openapi_specs",
    category: "OpenAPI 3.1",
    dateColumn: "created_at",
    description:
      "Swagger UI, OpenAPI JSON, and OpenAPI YAML publication contracts generated from the REST API catalog.",
    primaryColumns: [
      "spec_key",
      "spec_name",
      "openapi_version",
      "output_format",
      "spec_path",
    ],
  },
  integrations: {
    key: "integrations",
    label: "Integration Contracts",
    table:
      "clinical_api_catalog_integration_contracts",
    category: "Integrations",
    dateColumn: "created_at",
    description:
      "External integration contracts for FHIR R4/R5, HL7, DICOM, PACS, ABHA, Ayushman Bharat, labs, insurance, and payment gateways.",
    primaryColumns: [
      "integration_name",
      "integration_type",
      "external_system",
      "protocol",
      "auth_scheme",
    ],
  },
};

export const apiCatalogDashboardModules =
  Object.values(apiCatalogModules);

export function getApiCatalogModuleConfig(
  key: string
) {
  return apiCatalogModules[
    key as ApiCatalogModuleKey
  ];
}
