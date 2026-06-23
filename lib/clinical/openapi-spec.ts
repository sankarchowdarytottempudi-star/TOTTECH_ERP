import type { ClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

type OpenApiOperation = {
  summary: string;
  tags: string[];
  security: Array<Record<string, string[]>>;
  parameters: Array<Record<string, unknown>>;
  requestBody?: Record<string, unknown>;
  responses: Record<string, unknown>;
  "x-tenant-isolation": boolean;
  "x-audit-required": boolean;
  "x-rate-limit": string;
  "x-permission": string | null;
};

type OpenApiSpec = {
  openapi: string;
  info: Record<string, unknown>;
  servers: Array<Record<string, unknown>>;
  security: Array<Record<string, string[]>>;
  paths: Record<
    string,
    Record<string, OpenApiOperation>
  >;
  components: Record<string, unknown>;
};

export async function buildClinicalOpenApiSpec(
  context: ClinicalContext
): Promise<OpenApiSpec> {
  const rows =
    await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT endpoint_name, method, path, api_group, module_key, request_schema, response_schema, permission_key, rate_limit_policy, audit_middleware, tenant_middleware
      FROM clinical_api_catalog_rest_endpoints
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY api_group, path, method
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

  const paths: OpenApiSpec["paths"] =
    {};

  for (const row of rows) {
    const path = String(
      row.path || "/"
    );
    const method = String(
      row.method || "GET"
    ).toLowerCase();
    const isWrite =
      !["get", "delete"].includes(
        method
      );

    paths[path] = paths[path] || {};
    paths[path][method] = {
      summary: String(
        row.endpoint_name || path
      ),
      tags: [
        String(
          row.api_group || "Clinical"
        ),
      ],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters:
        path.includes("{id}")
          ? [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ]
          : [],
      ...(isWrite
        ? {
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema:
                    jsonSchemaFromValue(
                      row.request_schema
                    ),
                },
              },
            },
          }
        : {}),
      responses: {
        "200": {
          description:
            "Successful clinical API response.",
          content: {
            "application/json": {
              schema:
                jsonSchemaFromValue(
                  row.response_schema
                ),
            },
          },
        },
        "400": {
          $ref:
            "#/components/responses/BadRequest",
        },
        "401": {
          $ref:
            "#/components/responses/Unauthorized",
        },
        "403": {
          $ref:
            "#/components/responses/Forbidden",
        },
        "429": {
          $ref:
            "#/components/responses/RateLimited",
        },
      },
      "x-tenant-isolation": Boolean(
        row.tenant_middleware
      ),
      "x-audit-required": Boolean(
        row.audit_middleware
      ),
      "x-rate-limit": String(
        row.rate_limit_policy ||
          "default_100_per_minute"
      ),
      "x-permission": row.permission_key
        ? String(row.permission_key)
        : null,
    };
  }

  return {
    openapi: "3.1.0",
    info: {
      title:
        "TOTTECH Clinical Services API",
      version: "1.0.0",
      description:
        "Tenant-scoped API catalog generated from Phase 14 REST contracts.",
    },
    servers: [
      {
        url: "/api/v1",
        description:
          "TOTTECH Clinical Services API Gateway",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      responses: {
        BadRequest:
          errorResponse("Validation failed"),
        Unauthorized:
          errorResponse(
            "Authentication required"
          ),
        Forbidden:
          errorResponse(
            "Permission denied"
          ),
        RateLimited:
          errorResponse(
            "Rate limit exceeded"
          ),
      },
      schemas: {
        StandardErrorResponse: {
          type: "object",
          required: [
            "success",
            "errorCode",
            "message",
          ],
          properties: {
            success: {
              type: "boolean",
              const: false,
            },
            errorCode: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
        },
      },
    },
  };
}

export function toYaml(
  value: unknown,
  indent = 0
): string {
  const spaces = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (!value.length) {
      return "[]";
    }

    return value
      .map((item) => {
        if (isPlainObject(item)) {
          return `${spaces}-\n${toYaml(item, indent + 2)}`;
        }

        return `${spaces}- ${yamlScalar(item)}`;
      })
      .join("\n");
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);

    if (!entries.length) {
      return "{}";
    }

    return entries
      .map(([key, item]) => {
        if (
          isPlainObject(item) ||
          Array.isArray(item)
        ) {
          return `${spaces}${key}:\n${toYaml(item, indent + 2)}`;
        }

        return `${spaces}${key}: ${yamlScalar(item)}`;
      })
      .join("\n");
  }

  return yamlScalar(value);
}

function jsonSchemaFromValue(
  value: unknown
) {
  if (isPlainObject(value)) {
    return {
      type: "object",
      additionalProperties: true,
      example: value,
    };
  }

  if (Array.isArray(value)) {
    return {
      type: "array",
      items: {
        type: "object",
      },
      example: value,
    };
  }

  return {
    type: "object",
    additionalProperties: true,
  };
}

function errorResponse(
  message: string
) {
  return {
    description: message,
    content: {
      "application/json": {
        schema: {
          $ref:
            "#/components/schemas/StandardErrorResponse",
        },
      },
    },
  };
}

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function yamlScalar(value: unknown) {
  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "\"\"";
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return JSON.stringify(String(value));
}
