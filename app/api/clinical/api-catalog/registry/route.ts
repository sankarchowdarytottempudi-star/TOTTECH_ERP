import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;

  const [
    counts,
    gateway,
    rest,
    graphql,
    events,
    webhooks,
    integrations,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'clinical_api_catalog_%') AS catalog_tables,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_gateway_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS gateway_policies,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_rest_endpoints WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS rest_endpoints,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_graphql_operations WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS graphql_operations,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_websocket_channels WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS websocket_channels,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_websocket_events WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS websocket_events,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_events WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS event_catalog,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_rabbitmq_topics WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS rabbitmq_topics,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_webhooks WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS webhooks,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_error_standards WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS error_standards,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_versioning_rules WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS versioning_rules,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_rate_limits WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS rate_limits,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_openapi_specs WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS openapi_specs,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_integration_contracts WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS integration_contracts
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT policy_key, policy_name, middleware_order, middleware_name, requirement
      FROM clinical_api_catalog_gateway_policies
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY middleware_order
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT endpoint_name, method, path, api_group, module_key, permission_key, rate_limit_policy
      FROM clinical_api_catalog_rest_endpoints
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY api_group, path, method
      LIMIT 120
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT operation_key, operation_name, operation_type, graph_area, query_definition
      FROM clinical_api_catalog_graphql_operations
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY graph_area, operation_name
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT event_key, event_name, event_category, producer_service, consumer_services
      FROM clinical_api_catalog_events
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY event_category, event_name
      LIMIT 80
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT webhook_key, webhook_name, direction, external_system, path, auth_scheme
      FROM clinical_api_catalog_webhooks
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY direction, external_system
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT contract_key, integration_name, integration_type, external_system, protocol, auth_scheme
      FROM clinical_api_catalog_integration_contracts
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY integration_type, integration_name
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    gateway,
    rest,
    graphql,
    events,
    webhooks,
    integrations,
  });
}
