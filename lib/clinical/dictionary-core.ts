export type DictionaryModuleKey =
  | "entities"
  | "fields"
  | "relationships"
  | "constraints"
  | "indexes"
  | "retention"
  | "archival"
  | "er-diagrams"
  | "generation-rules"
  | "blueprints";

export type DictionaryModuleConfig = {
  key: DictionaryModuleKey;
  label: string;
  table: string;
  category: string;
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
  "sort_order",
  "version",
  "max_length",
  "numeric_precision",
  "numeric_scale",
  "retention_years",
];

const booleanColumns = [
  "is_business_table",
  "physical_table_required",
  "report_enabled",
  "is_primary_key",
  "is_foreign_key",
  "is_required",
  "is_nullable",
  "is_unique",
  "is_indexed",
  "is_active",
];

const jsonColumns = [
  "postgres_schema_blueprint",
  "dto_blueprint",
  "rbac_actions",
  "enum_values",
  "validation_rules",
  "columns",
  "entity_keys",
  "relationship_keys",
  "rule_payload",
  "blueprint_payload",
];

export const dictionaryModules: Record<
  DictionaryModuleKey,
  DictionaryModuleConfig
> = {
  entities: {
    key: "entities",
    label: "Entity Catalog",
    table: "clinical_dictionary_entities",
    category: "Master Data Model",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "group_key",
      "entity_key",
      "entity_name",
      "table_name",
      "module_key",
      "entity_type",
      "is_business_table",
      "physical_table_required",
      "tenant_policy",
      "generation_status",
      "postgres_schema_blueprint",
      "prisma_model_blueprint",
      "nestjs_entity_blueprint",
      "dto_blueprint",
      "rbac_actions",
      "report_enabled",
      "description",
      "status",
    ],
    requiredColumns: [
      "group_key",
      "entity_key",
      "entity_name",
      "table_name",
      "module_key",
    ],
    numericColumns,
    booleanColumns,
    textAreaColumns: [
      "description",
      "prisma_model_blueprint",
      "nestjs_entity_blueprint",
    ],
    jsonColumns,
  },
  fields: {
    key: "fields",
    label: "Field Catalog",
    table: "clinical_dictionary_fields",
    category: "Fields",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "entity_key",
      "field_key",
      "field_name",
      "column_name",
      "data_type",
      "postgres_type",
      "prisma_type",
      "nestjs_type",
      "is_primary_key",
      "is_foreign_key",
      "is_required",
      "is_nullable",
      "is_unique",
      "is_indexed",
      "default_expression",
      "max_length",
      "numeric_precision",
      "numeric_scale",
      "enum_values",
      "validation_rules",
      "ui_component",
      "sort_order",
      "description",
      "status",
    ],
    requiredColumns: [
      "entity_key",
      "field_key",
      "field_name",
      "column_name",
      "data_type",
      "postgres_type",
      "prisma_type",
    ],
    numericColumns,
    booleanColumns,
    textAreaColumns: [
      "description",
      "default_expression",
    ],
    jsonColumns,
  },
  relationships: {
    key: "relationships",
    label: "Relationships",
    table:
      "clinical_dictionary_relationships",
    category: "Relationships",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "relationship_key",
      "from_entity_key",
      "to_entity_key",
      "from_column",
      "to_column",
      "relation_type",
      "cardinality",
      "on_delete",
      "on_update",
      "prisma_relation",
      "description",
      "status",
    ],
    requiredColumns: [
      "relationship_key",
      "from_entity_key",
      "to_entity_key",
      "from_column",
    ],
    textAreaColumns: [
      "description",
      "prisma_relation",
    ],
  },
  constraints: {
    key: "constraints",
    label: "Constraints",
    table: "clinical_dictionary_constraints",
    category: "Constraints",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "entity_key",
      "constraint_key",
      "constraint_name",
      "constraint_type",
      "columns",
      "expression",
      "validation_message",
      "status",
    ],
    requiredColumns: [
      "entity_key",
      "constraint_key",
      "constraint_name",
      "constraint_type",
    ],
    textAreaColumns: [
      "expression",
      "validation_message",
    ],
    jsonColumns,
  },
  indexes: {
    key: "indexes",
    label: "Indexes",
    table: "clinical_dictionary_indexes",
    category: "Indexes",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "entity_key",
      "index_key",
      "index_name",
      "index_type",
      "columns",
      "is_unique",
      "where_clause",
      "status",
    ],
    requiredColumns: [
      "entity_key",
      "index_key",
      "index_name",
    ],
    booleanColumns,
    textAreaColumns: ["where_clause"],
    jsonColumns,
  },
  retention: {
    key: "retention",
    label: "Retention Policies",
    table:
      "clinical_dictionary_retention_policies",
    category: "Governance",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "policy_key",
      "entity_group",
      "retention_period",
      "retention_years",
      "legal_basis",
      "status",
    ],
    requiredColumns: [
      "policy_key",
      "entity_group",
      "retention_period",
    ],
    numericColumns,
    textAreaColumns: ["legal_basis"],
  },
  archival: {
    key: "archival",
    label: "Archival Policies",
    table:
      "clinical_dictionary_archival_policies",
    category: "Governance",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "policy_key",
      "archive_target",
      "trigger_condition",
      "archive_storage",
      "restore_sla",
      "status",
    ],
    requiredColumns: [
      "policy_key",
      "archive_target",
      "trigger_condition",
    ],
    textAreaColumns: ["trigger_condition"],
  },
  "er-diagrams": {
    key: "er-diagrams",
    label: "ER Diagrams",
    table: "clinical_dictionary_er_diagrams",
    category: "ER Diagrams",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "diagram_key",
      "diagram_name",
      "diagram_type",
      "entity_keys",
      "relationship_keys",
      "diagram_text",
      "status",
    ],
    requiredColumns: [
      "diagram_key",
      "diagram_name",
    ],
    textAreaColumns: ["diagram_text"],
    jsonColumns,
  },
  "generation-rules": {
    key: "generation-rules",
    label: "Generation Rules",
    table:
      "clinical_dictionary_generation_rules",
    category: "Generators",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "rule_key",
      "generator_target",
      "rule_name",
      "rule_payload",
      "status",
    ],
    requiredColumns: [
      "rule_key",
      "generator_target",
      "rule_name",
    ],
    jsonColumns,
  },
  blueprints: {
    key: "blueprints",
    label: "Schema Blueprints",
    table: "clinical_dictionary_blueprints",
    category: "Blueprints",
    dateColumn: "created_at",
    statusColumn: "status",
    createColumns: [
      "blueprint_key",
      "blueprint_type",
      "entity_key",
      "blueprint_name",
      "blueprint_text",
      "blueprint_payload",
      "status",
    ],
    requiredColumns: [
      "blueprint_key",
      "blueprint_type",
      "blueprint_name",
    ],
    textAreaColumns: ["blueprint_text"],
    jsonColumns,
  },
};

export const dictionaryDashboardModules =
  Object.values(dictionaryModules);

export function getDictionaryModuleConfig(
  moduleKey: string
) {
  return dictionaryModules[
    moduleKey as DictionaryModuleKey
  ];
}

export function normalizeDictionaryValue(
  config: DictionaryModuleConfig,
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
