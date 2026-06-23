export type ProductionModuleKey =
  | "apps"
  | "services"
  | "packages"
  | "infrastructure"
  | "stack"
  | "prisma-rules"
  | "api-contracts"
  | "events"
  | "security"
  | "testing"
  | "devops"
  | "monitoring"
  | "backups"
  | "go-live";

export type ProductionModuleConfig = {
  key: ProductionModuleKey;
  label: string;
  table: string;
  category: string;
  dateColumn: string;
  description: string;
  primaryColumns: string[];
};

export const productionModules: Record<
  ProductionModuleKey,
  ProductionModuleConfig
> = {
  apps: {
    key: "apps",
    label: "Monorepo Apps",
    table:
      "clinical_production_monorepo_apps",
    category: "Enterprise Architecture",
    dateColumn: "created_at",
    description:
      "Web admin, patient portal, doctor portal, nurse portal, referral portal, executive dashboard, and mobile API app architecture.",
    primaryColumns: [
      "app_key",
      "app_name",
      "app_type",
      "folder_path",
      "deployment_target",
    ],
  },
  services: {
    key: "services",
    label: "Microservices",
    table: "clinical_production_services",
    category: "Backend Architecture",
    dateColumn: "created_at",
    description:
      "NestJS service catalog for auth, patients, appointments, doctors, nursing, IP, ER, ICU, OT, IVF, lab, radiology, PACS, pharmacy, inventory, billing, finance, insurance, referrals, reporting, analytics, AI, notifications, and integrations.",
    primaryColumns: [
      "service_key",
      "service_name",
      "service_type",
      "api_prefix",
      "responsibilities",
    ],
  },
  packages: {
    key: "packages",
    label: "Shared Packages",
    table: "clinical_production_packages",
    category: "Monorepo",
    dateColumn: "created_at",
    description:
      "Shared UI, types, utilities, auth, and Prisma packages for generated clinical services.",
    primaryColumns: [
      "package_key",
      "package_name",
      "folder_path",
      "package_type",
      "exports",
    ],
  },
  infrastructure: {
    key: "infrastructure",
    label: "Infrastructure",
    table:
      "clinical_production_infrastructure_components",
    category: "DevOps",
    dateColumn: "created_at",
    description:
      "Docker, Kubernetes, Terraform, monitoring, and backup artifact registry.",
    primaryColumns: [
      "component_key",
      "component_name",
      "component_type",
      "artifact_path",
      "provider_targets",
    ],
  },
  stack: {
    key: "stack",
    label: "Technology Stack",
    table:
      "clinical_production_technology_stack",
    category: "Implementation Stack",
    dateColumn: "created_at",
    description:
      "Frontend, backend, database, cache, event bus, storage, testing, monitoring, and logging technology targets.",
    primaryColumns: [
      "stack_key",
      "stack_area",
      "technology_name",
      "minimum_version",
      "usage_policy",
    ],
  },
  "prisma-rules": {
    key: "prisma-rules",
    label: "Prisma Rules",
    table:
      "clinical_production_prisma_rules",
    category: "Database",
    dateColumn: "created_at",
    description:
      "Schema, relation, index, seeder, soft-delete, and audit rules for generated Prisma models and migrations.",
    primaryColumns: [
      "rule_key",
      "rule_name",
      "rule_category",
      "enforcement_level",
      "requirement",
    ],
  },
  "api-contracts": {
    key: "api-contracts",
    label: "API Contracts",
    table:
      "clinical_production_api_contracts",
    category: "OpenAPI",
    dateColumn: "created_at",
    description:
      "REST API and OpenAPI 3.1 endpoint contracts for every registered service.",
    primaryColumns: [
      "service_key",
      "method",
      "path",
      "auth_required",
      "tenant_isolation_required",
    ],
  },
  events: {
    key: "events",
    label: "Event Contracts",
    table:
      "clinical_production_event_contracts",
    category: "RabbitMQ",
    dateColumn: "created_at",
    description:
      "RabbitMQ events for patient, appointment, admission, lab, embryo, invoice, and claim workflows.",
    primaryColumns: [
      "event_key",
      "event_name",
      "routing_key",
      "producer_service",
      "consumer_services",
    ],
  },
  security: {
    key: "security",
    label: "Security Controls",
    table:
      "clinical_production_security_controls",
    category: "Security",
    dateColumn: "created_at",
    description:
      "JWT, MFA, SSO, RBAC, ABAC, tenant isolation, encryption, audit, and AI safety controls.",
    primaryColumns: [
      "control_key",
      "control_name",
      "control_area",
      "severity",
      "requirement",
    ],
  },
  testing: {
    key: "testing",
    label: "Testing Framework",
    table:
      "clinical_production_testing_requirements",
    category: "Testing",
    dateColumn: "created_at",
    description:
      "Jest, Supertest, Playwright, k6, and security testing requirements.",
    primaryColumns: [
      "test_key",
      "test_name",
      "test_type",
      "framework",
      "target_coverage",
    ],
  },
  devops: {
    key: "devops",
    label: "DevOps Artifacts",
    table:
      "clinical_production_devops_artifacts",
    category: "Deployment",
    dateColumn: "created_at",
    description:
      "Dockerfile, Docker Compose, Kubernetes, Prometheus, backup, and CI/CD artifact registry.",
    primaryColumns: [
      "artifact_key",
      "artifact_name",
      "artifact_type",
      "artifact_path",
      "deployment_stage",
    ],
  },
  monitoring: {
    key: "monitoring",
    label: "Monitoring Rules",
    table:
      "clinical_production_monitoring_rules",
    category: "Observability",
    dateColumn: "created_at",
    description:
      "Prometheus alert rules for service, database, CPU, memory, errors, claims, and backup failures.",
    primaryColumns: [
      "rule_key",
      "rule_name",
      "metric_name",
      "threshold_expression",
      "severity",
    ],
  },
  backups: {
    key: "backups",
    label: "Backup and DR",
    table:
      "clinical_production_backup_policies",
    category: "Disaster Recovery",
    dateColumn: "created_at",
    description:
      "15-minute database RPO, daily full backups, weekly archive, object storage backups, and restore targets.",
    primaryColumns: [
      "policy_key",
      "policy_name",
      "backup_type",
      "schedule_expression",
      "recovery_target",
    ],
  },
  "go-live": {
    key: "go-live",
    label: "Go-Live Checklist",
    table:
      "clinical_production_go_live_checklist",
    category: "Production Readiness",
    dateColumn: "created_at",
    description:
      "Functional, security, infrastructure, testing, disaster recovery, audit, training, and migration go-live gates.",
    primaryColumns: [
      "checklist_key",
      "checklist_item",
      "checklist_category",
      "status",
      "acceptance_evidence",
    ],
  },
};

export const productionDashboardModules =
  Object.values(productionModules);

export function getProductionModuleConfig(
  key: string
) {
  return productionModules[
    key as ProductionModuleKey
  ];
}
